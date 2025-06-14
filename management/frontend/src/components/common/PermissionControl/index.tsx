import React from 'react';
import { usePermission } from '../../../hooks/usePermission';

interface PermissionControlProps {
  permission?: string; // 单个权限码
  permissions?: string[]; // 多个权限码
  requireAll?: boolean; // 是否需要所有权限，默认false（任意一个即可）
  fallback?: React.ReactNode; // 无权限时显示的内容
  children: React.ReactNode;
}

/**
 * 权限控制组件
 * 根据用户权限决定是否渲染子组件
 */
const PermissionControl: React.FC<PermissionControlProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  // 如果指定了单个权限
  if (permission) {
    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
  }

  // 如果指定了多个权限
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    return hasRequiredPermissions ? <>{children}</> : <>{fallback}</>;
  }

  // 如果没有指定权限，默认显示
  return <>{children}</>;
};

export default PermissionControl; 