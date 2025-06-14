import React from 'react';
import { Card, Typography, Space, Button, Divider, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PermissionControl from '../components/PermissionControl';
import { PERMISSIONS } from '../constants';
import { usePermission } from '../hooks/usePermission';

const { Title, Text, Paragraph } = Typography;

const PermissionTestPage: React.FC = () => {
  const { permissions, hasPermission, loading } = usePermission();

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

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>权限控制测试页面</Title>
      
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
            <Text><strong>权限总数:</strong> {permissions.length}</Text>
          </Space>
        </Card>

        {/* 空间管理权限测试 */}
        <Card title="空间管理权限测试">
          <Paragraph>
            以下按钮根据用户权限动态显示/隐藏：
          </Paragraph>
          
          <Space wrap>
            <PermissionControl permission={PERMISSIONS.CONTENT_SPACE_VIEW}>
              <Button icon={<EditOutlined />}>
                查看空间 (content:space:view)
              </Button>
            </PermissionControl>

            <PermissionControl permission={PERMISSIONS.CONTENT_SPACE_CREATE}>
              <Button type="primary" icon={<PlusOutlined />}>
                新增空间 (content:space:create)
              </Button>
            </PermissionControl>

            <PermissionControl permission={PERMISSIONS.CONTENT_SPACE_UPDATE}>
              <Button icon={<EditOutlined />}>
                编辑空间 (content:space:update)
              </Button>
            </PermissionControl>

            <PermissionControl permission={PERMISSIONS.CONTENT_SPACE_DELETE}>
              <Button danger icon={<DeleteOutlined />}>
                删除空间 (content:space:delete)
              </Button>
            </PermissionControl>
          </Space>

          <Divider />

          <Paragraph>
            权限检查结果：
          </Paragraph>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text code>content:space:view</Text>
              <Tag color={hasPermission(PERMISSIONS.CONTENT_SPACE_VIEW) ? 'green' : 'red'}>
                {hasPermission(PERMISSIONS.CONTENT_SPACE_VIEW) ? '有权限' : '无权限'}
              </Tag>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text code>content:space:create</Text>
              <Tag color={hasPermission(PERMISSIONS.CONTENT_SPACE_CREATE) ? 'green' : 'red'}>
                {hasPermission(PERMISSIONS.CONTENT_SPACE_CREATE) ? '有权限' : '无权限'}
              </Tag>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text code>content:space:update</Text>
              <Tag color={hasPermission(PERMISSIONS.CONTENT_SPACE_UPDATE) ? 'green' : 'red'}>
                {hasPermission(PERMISSIONS.CONTENT_SPACE_UPDATE) ? '有权限' : '无权限'}
              </Tag>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text code>content:space:delete</Text>
              <Tag color={hasPermission(PERMISSIONS.CONTENT_SPACE_DELETE) ? 'green' : 'red'}>
                {hasPermission(PERMISSIONS.CONTENT_SPACE_DELETE) ? '有权限' : '无权限'}
              </Tag>
            </div>
          </Space>
        </Card>

        {/* 菜单权限说明 */}
        <Card title="菜单权限逻辑说明">
          <Space direction="vertical">
            <Text><strong>修复后的菜单权限逻辑：</strong></Text>
            <Text>1. 只要用户有任意一个子菜单的权限，父菜单就会显示</Text>
            <Text>2. 没有权限的子菜单不会显示</Text>
            <Text>3. 按钮权限在页面内部单独控制</Text>
            <Text>4. 超级管理员admin拥有所有权限</Text>
            
            <Divider />
            
            <Text><strong>测试场景：</strong></Text>
            <Text>• contentAdmin用户只有content:space:view权限时，内容管理菜单仍然显示</Text>
            <Text>• 但在空间管理页面中，只能看到"查看"相关按钮，看不到"删除"按钮</Text>
            <Text>• admin用户可以看到所有菜单和所有按钮</Text>
          </Space>
        </Card>

        {/* 权限详情 */}
        <Card title="当前用户权限详情">
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
              {JSON.stringify(permissions, null, 2)}
            </pre>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default PermissionTestPage; 