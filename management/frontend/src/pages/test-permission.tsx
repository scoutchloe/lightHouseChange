import React, { useEffect, useState } from 'react';
import { Card, Button, Space, Tag, message, Divider } from 'antd';
import { usePermission } from '../hooks/usePermission';
import { authApi } from '../services/api';

const TestPermissionPage: React.FC = () => {
  const { permissions, loading, hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // 获取用户信息
    const fetchUserInfo = async () => {
      try {
        const response = await authApi.getUserInfo();
        if (response.code === 200) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const testPermissions = [
    'dashboard:view',
    'content:view',
    'content:space:view',
    'content:problem:view',
    'order:view',
    'system:view',
    'system:permission:view',
    'system:admin:view'
  ];

  const handleTestPermission = (permission: string) => {
    const result = hasPermission(permission);
    message.info(`权限 ${permission}: ${result ? '有权限' : '无权限'}`);
  };

  const handleTestMultiplePermissions = () => {
    const contentPermissions = ['content:space:view', 'content:problem:view'];
    const hasAny = hasAnyPermission(contentPermissions);
    const hasAll = hasAllPermissions(contentPermissions);
    
    message.info(`内容权限 - 任意一个: ${hasAny ? '有' : '无'}, 全部: ${hasAll ? '有' : '无'}`);
  };

  if (loading) {
    return <div>加载权限中...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Card title="权限测试页面" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <strong>当前用户:</strong> {userInfo?.username || '未知'}
          </div>
          <div>
            <strong>用户角色:</strong> {userInfo?.role === 1 ? '超级管理员' : userInfo?.role === 2 ? '普通管理员' : '未知'}
          </div>
          <div>
            <strong>权限数量:</strong> {permissions.length}
          </div>
        </Space>
      </Card>

      <Card title="权限列表" style={{ marginBottom: 16 }}>
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          {permissions.map((permission, index) => (
            <div key={index} style={{ marginBottom: 8 }}>
              <Tag color={permission.permissionType === 'menu' ? 'blue' : 'green'}>
                {permission.permissionType === 'menu' ? '菜单' : '按钮'}
              </Tag>
              <span style={{ marginLeft: 8 }}>
                {permission.permissionName} ({permission.permissionCode})
              </span>
              {permission.children && permission.children.length > 0 && (
                <div style={{ marginLeft: 24, marginTop: 4 }}>
                  {permission.children.map((child, childIndex) => (
                    <div key={childIndex} style={{ marginBottom: 4 }}>
                      <Tag color={child.permissionType === 'menu' ? 'blue' : 'green'}>
                        {child.permissionType === 'menu' ? '菜单' : '按钮'}
                      </Tag>
                      <span style={{ marginLeft: 8, fontSize: 12 }}>
                        {child.permissionName} ({child.permissionCode})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="权限测试">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <strong>单个权限测试:</strong>
            <div style={{ marginTop: 8 }}>
              <Space wrap>
                {testPermissions.map(permission => (
                  <Button
                    key={permission}
                    size="small"
                    type={hasPermission(permission) ? 'primary' : 'default'}
                    onClick={() => handleTestPermission(permission)}
                  >
                    {permission}
                  </Button>
                ))}
              </Space>
            </div>
          </div>

          <Divider />

          <div>
            <strong>多权限测试:</strong>
            <div style={{ marginTop: 8 }}>
              <Button onClick={handleTestMultiplePermissions}>
                测试内容管理权限（任意/全部）
              </Button>
            </div>
          </div>

          <Divider />

          <div>
            <strong>权限状态:</strong>
            <div style={{ marginTop: 8 }}>
              <Space wrap>
                {testPermissions.map(permission => (
                  <Tag
                    key={permission}
                    color={hasPermission(permission) ? 'success' : 'error'}
                  >
                    {permission}: {hasPermission(permission) ? '✓' : '✗'}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TestPermissionPage; 