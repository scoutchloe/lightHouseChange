import React from 'react';
import { usePermission } from '../hooks/usePermission';

interface PermissionControlProps {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // 是否需要所有权限都满足，默认false（满足任意一个即可）
}

/**
 * 权限控制组件
 * 根据用户权限控制子组件的显示
 */
const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  children,
  fallback = null,
  requireAll = false
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  // 检查权限
  const checkPermission = (): boolean => {
    if (typeof permission === 'string') {
      return hasPermission(permission);
    }
    
    if (Array.isArray(permission)) {
      return requireAll 
        ? hasAllPermissions(permission)
        : hasAnyPermission(permission);
    }
    
    return false;
  };

  // 如果有权限，显示子组件；否则显示fallback或null
  return checkPermission() ? <>{children}</> : <>{fallback}</>;
};

export default PermissionControl; 