import React from 'react';
import { Card, Typography, Space, Tag, Button, Divider } from 'antd';
import { usePermission } from '../hooks/usePermission';

const { Title, Text, Paragraph } = Typography;

const AdminTestPage: React.FC = () => {
  const { permissions, hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermission();

  // 获取当前用户信息
  const getCurrentUser = () => {
    const userInfo = localStorage.getItem('lighthouse_user_info');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return null;
      }
    }
    return null;
  };

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.username === 'admin';

  // 测试权限列表
  const testPermissions = [
    'dashboard:view',
    'content:view',
    'content:space:view',
    'content:problem:view',
    'order:view',
    'user:view',
    'system:view',
    'system:permission:view',
    'system:admin:view'
  ];

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>超级管理员权限测试</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 用户信息 */}
        <Card title="当前用户信息">
          <Space direction="vertical">
            <Text><strong>用户名:</strong> {currentUser?.username || '未知'}</Text>
            <Text><strong>真实姓名:</strong> {currentUser?.realName || '未知'}</Text>
            <Text><strong>是否为超级管理员:</strong> 
              <Tag color={isAdmin ? 'green' : 'red'}>
                {isAdmin ? '是' : '否'}
              </Tag>
            </Text>
          </Space>
        </Card>

        {/* 权限统计 */}
        <Card title="权限统计">
          <Space direction="vertical">
            <Text><strong>权限总数:</strong> {permissions.length}</Text>
            <Text><strong>是否为admin用户:</strong> 
              <Tag color={isAdmin ? 'green' : 'red'}>
                {isAdmin ? '是（拥有所有权限）' : '否（按角色权限）'}
              </Tag>
            </Text>
          </Space>
        </Card>

        {/* 权限测试 */}
        <Card title="权限测试">
          <Paragraph>
            以下是对各个权限的测试结果，超级管理员admin应该对所有权限都返回true：
          </Paragraph>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            {testPermissions.map(permission => (
              <div key={permission} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text code>{permission}</Text>
                <Tag color={hasPermission(permission) ? 'green' : 'red'}>
                  {hasPermission(permission) ? '有权限' : '无权限'}
                </Tag>
              </div>
            ))}
          </Space>

          <Divider />

          {/* 批量权限测试 */}
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>批量权限测试:</Text>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>是否有任意内容管理权限: ['content:view', 'content:space:view']</Text>
              <Tag color={hasAnyPermission(['content:view', 'content:space:view']) ? 'green' : 'red'}>
                {hasAnyPermission(['content:view', 'content:space:view']) ? '有权限' : '无权限'}
              </Tag>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>是否有所有系统管理权限: ['system:view', 'system:permission:view', 'system:admin:view']</Text>
              <Tag color={hasAllPermissions(['system:view', 'system:permission:view', 'system:admin:view']) ? 'green' : 'red'}>
                {hasAllPermissions(['system:view', 'system:permission:view', 'system:admin:view']) ? '有权限' : '无权限'}
              </Tag>
            </div>
          </Space>
        </Card>

        {/* 权限详情 */}
        <Card title="权限详情">
          <Text>当前用户的所有权限:</Text>
          <div style={{ marginTop: '16px', maxHeight: '300px', overflow: 'auto' }}>
            <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
              {JSON.stringify(permissions, null, 2)}
            </pre>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default AdminTestPage; 