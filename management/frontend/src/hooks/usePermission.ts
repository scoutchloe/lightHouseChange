import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import type { Permission } from '../types/api';

interface UsePermissionReturn {
  permissions: Permission[];
  loading: boolean;
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
  hasAllPermissions: (permissionCodes: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
}

/**
 * 权限管理钩子
 * @returns 权限相关的方法和状态
 */
export const usePermission = (): UsePermissionReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  // 从权限树中提取所有权限码
  const extractPermissionCodes = useCallback((permissions: Permission[]): string[] => {
    const codes: string[] = [];
    const traverse = (nodes: Permission[]) => {
      nodes.forEach(node => {
        codes.push(node.permissionCode);
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(permissions);
    return codes;
  }, []);

  // 获取当前用户的权限列表
  const loadPermissions = useCallback(async () => {
    setLoading(true);
    try {
      console.log('开始获取用户权限...');
      const response = await authApi.getUserPermissions();
      console.log('用户权限API响应:', response);
      
      if (response.code === 200) {
        const userPermissions = response.data || [];
        console.log('用户权限数据:', userPermissions);
        setPermissions(userPermissions);
        
        // 将权限码保存到localStorage
        const permissionCodes = extractPermissionCodes(userPermissions);
        console.log('用户权限码列表:', permissionCodes);
        localStorage.setItem('lighthouse_permissions', JSON.stringify(permissionCodes));
      } else {
        console.error('获取用户权限失败:', response.message);
        setPermissions([]);
      }
    } catch (error) {
      console.error('获取权限失败:', error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, [extractPermissionCodes]);

  // 检查当前用户是否为超级管理员
  const isAdmin = useCallback((): boolean => {
    const userInfo = localStorage.getItem('lighthouse_user_info');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.username === 'admin';
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return false;
      }
    }
    return false;
  }, []);

  // 检查是否有指定权限
  const hasPermission = useCallback((permissionCode: string): boolean => {
    // 超级管理员admin拥有所有权限
    if (isAdmin()) {
      console.log('超级管理员admin，拥有权限:', permissionCode);
      return true;
    }
    
    const allCodes = extractPermissionCodes(permissions);
    return allCodes.includes(permissionCode);
  }, [permissions, extractPermissionCodes, isAdmin]);

  // 检查是否有任意一个权限
  const hasAnyPermission = useCallback((permissionCodes: string[]): boolean => {
    // 超级管理员admin拥有所有权限
    if (isAdmin()) {
      console.log('超级管理员admin，拥有权限:', permissionCodes);
      return true;
    }
    
    const allCodes = extractPermissionCodes(permissions);
    return permissionCodes.some(code => allCodes.includes(code));
  }, [permissions, extractPermissionCodes, isAdmin]);

  // 检查是否有所有权限
  const hasAllPermissions = useCallback((permissionCodes: string[]): boolean => {
    // 超级管理员admin拥有所有权限
    if (isAdmin()) {
      console.log('超级管理员admin，拥有权限:', permissionCodes);
      return true;
    }
    
    const allCodes = extractPermissionCodes(permissions);
    return permissionCodes.every(code => allCodes.includes(code));
  }, [permissions, extractPermissionCodes, isAdmin]);

  // 刷新权限
  const refreshPermissions = useCallback(async () => {
    await loadPermissions();
  }, [loadPermissions]);

  useEffect(() => {
    // 只有在有token的情况下才获取权限
    const token = localStorage.getItem('lighthouse_token');
    if (token) {
      loadPermissions();
    }
  }, [loadPermissions]);

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions,
  };
};

export default usePermission; 