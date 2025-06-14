import React from 'react';
import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { usePermission } from '../../../hooks/usePermission';

interface RouteGuardProps {
  permission?: string; // 单个权限码
  permissions?: string[]; // 多个权限码
  requireAll?: boolean; // 是否需要所有权限，默认false（任意一个即可）
  redirectTo?: string; // 无权限时重定向的路径
  showForbidden?: boolean; // 是否显示403页面，默认true
  children: React.ReactNode;
}

/**
 * 路由权限守卫组件
 * 根据用户权限决定是否允许访问页面
 */
const RouteGuard: React.FC<RouteGuardProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  redirectTo = '/login',
  showForbidden = true,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermission();

  // 权限加载中
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>加载中...</div>
      </div>
    );
  }

  let hasRequiredPermissions = true;

  // 如果指定了单个权限
  if (permission) {
    hasRequiredPermissions = hasPermission(permission);
  }
  // 如果指定了多个权限
  else if (permissions.length > 0) {
    hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // 有权限，允许访问
  if (hasRequiredPermissions) {
    return <>{children}</>;
  }

  // 无权限处理
  if (showForbidden) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        }
      />
    );
  }

  // 重定向到指定页面
  return <Navigate to={redirectTo} replace />;
};

export default RouteGuard; 