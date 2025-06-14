import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Button, Divider, Tag, Table, message } from 'antd';
import { usePermission } from '../hooks/usePermission';
import { authApi } from '../services/api';
import request from '../services/request';

const { Title, Text } = Typography;

const DebugPermissionsPage: React.FC = () => {
  const { permissions, hasPermission, loading } = usePermission();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [rawPermissions, setRawPermissions] = useState<any[]>([]);

  // 获取当前用户信息
  const getCurrentUser = () => {
    const userInfoStr = localStorage.getItem('lighthouse_user_info');
    if (userInfoStr) {
      try {
        return JSON.parse(userInfoStr);
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return null;
      }
    }
    return null;
  };

  // 获取用户信息和权限
  useEffect(() => {
    const user = getCurrentUser();
    setUserInfo(user);

    // 直接调用API获取权限
    const fetchPermissions = async () => {
      try {
        const response = await authApi.getUserPermissions();
        console.log('权限API响应:', response);
        setRawPermissions(response.data || []);
      } catch (error) {
        console.error('获取权限失败:', error);
      }
    };

    if (user) {
      fetchPermissions();
    }
  }, []);

  // 提取所有权限码
  const extractAllPermissionCodes = (permissions: any[]): string[] => {
    const codes: string[] = [];
    const traverse = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.permissionCode) {
          codes.push(node.permissionCode);
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };
    traverse(permissions);
    return codes;
  };

  const allPermissionCodes = extractAllPermissionCodes(rawPermissions);

  // 修复权限数据
  const handleFixPermissions = async () => {
    try {
      message.loading('正在修复权限数据...', 0);
      const response = await request.post('/debug/fix-content-admin');
      message.destroy();
      if (response.data.code === 200) {
        message.success('权限数据修复成功！请刷新页面查看效果');
        // 刷新页面数据
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        message.error('修复失败: ' + response.data.message);
      }
    } catch (error: any) {
      message.destroy();
      message.error('修复失败: ' + (error.message || '未知错误'));
      console.error('修复权限失败:', error);
    }
  };

  // 移除删除权限
  const handleRemoveDeletePermissions = async () => {
    try {
      message.loading('正在移除删除权限...', 0);
      const response = await request.post('/debug/remove-delete-permissions');
      message.destroy();
      if (response.data.code === 200) {
        message.success('删除权限已移除！请刷新页面查看效果');
        // 刷新页面数据
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        message.error('移除失败: ' + response.data.message);
      }
    } catch (error: any) {
      message.destroy();
      message.error('移除失败: ' + (error.message || '未知错误'));
      console.error('移除删除权限失败:', error);
    }
  };

  // 测试的权限码列表
  const testPermissions = [
    'dashboard:view',
    'content:view',
    'content:space:view',
    'content:space:create',
    'content:space:update',
    'content:space:delete',
    'content:problem:view',
    'content:solution:view',
    'content:banner:view',
    'content:recommendation:view',
    'order:view',
    'user:view',
    'system:view'
  ];

  const columns = [
    {
      title: '权限码',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Text code>{code}</Text>
    },
    {
      title: '是否拥有',
      dataIndex: 'hasPermission',
      key: 'hasPermission',
      render: (has: boolean) => (
        <Tag color={has ? 'green' : 'red'}>
          {has ? '有权限' : '无权限'}
        </Tag>
      )
    }
  ];

  const dataSource = testPermissions.map(code => ({
    key: code,
    code,
    hasPermission: hasPermission(code)
  }));

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>权限调试页面</Title>
      
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button 
            type="primary" 
            danger 
            onClick={handleFixPermissions}
            size="large"
          >
            修复 contentAdmin 权限数据
          </Button>
          <Button 
            type="default" 
            onClick={handleRemoveDeletePermissions}
            size="large"
          >
            移除删除权限（测试按钮控制）
          </Button>
        </Space>
        <div style={{ marginTop: '8px' }}>
          <Text style={{ color: '#666' }}>
            修复按钮：如果权限数据为空，点击修复权限配置<br/>
            移除按钮：移除删除权限，测试菜单仍显示但删除按钮消失
          </Text>
        </div>
      </div>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 用户信息 */}
        <Card title="当前用户信息">
          <Space direction="vertical">
            <Text><strong>用户名:</strong> {userInfo?.username || '未知'}</Text>
            <Text><strong>真实姓名:</strong> {userInfo?.realName || '未知'}</Text>
            <Text><strong>角色:</strong> {userInfo?.role || '未知'}</Text>
            <Text><strong>是否为admin:</strong> 
              <Tag color={userInfo?.username === 'admin' ? 'green' : 'red'}>
                {userInfo?.username === 'admin' ? '是' : '否'}
              </Tag>
            </Text>
          </Space>
        </Card>

        {/* 权限测试表格 */}
        <Card title="权限测试结果">
          <Table 
            columns={columns} 
            dataSource={dataSource} 
            pagination={false}
            size="small"
          />
        </Card>

        {/* 用户实际拥有的权限码 */}
        <Card title="用户实际拥有的权限码">
          <Text>从权限树中提取的所有权限码：</Text>
          <div style={{ marginTop: '16px' }}>
            <Space wrap>
              {allPermissionCodes.map(code => (
                <Tag key={code} color="blue">{code}</Tag>
              ))}
            </Space>
          </div>
          {allPermissionCodes.length === 0 && (
            <Text type="danger">没有找到任何权限码</Text>
          )}
        </Card>

        {/* 原始权限数据 */}
        <Card title="原始权限数据">
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
              {JSON.stringify(rawPermissions, null, 2)}
            </pre>
          </div>
        </Card>

        {/* 处理后的权限数据 */}
        <Card title="usePermission Hook 处理后的权限数据">
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
              {JSON.stringify(permissions, null, 2)}
            </pre>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default DebugPermissionsPage; 