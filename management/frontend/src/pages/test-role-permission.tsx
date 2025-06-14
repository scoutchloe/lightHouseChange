import React, { useState, useEffect } from 'react';
import { Card, Button, message, Space, Tag } from 'antd';
import { roleApi } from '../services/api';
import type { Role, Permission } from '../types';

const TestRolePermission: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载角色列表
  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await roleApi.getPage({ current: 1, size: 10 });
      console.log('角色列表响应:', response);
      if (response.code === 200) {
        setRoles(response.data.records);
        message.success('加载角色列表成功');
      } else {
        message.error(response.message || '获取角色列表失败');
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 测试获取角色详情
  const testGetRoleDetail = async (roleId: number) => {
    try {
      const response = await roleApi.getDetail(roleId);
      console.log('角色详情响应:', response);
      if (response.code === 200) {
        const role = response.data;
        console.log('角色权限:', role.permissions);
        message.success(`获取角色详情成功，权限数量: ${role.permissions?.length || 0}`);
      } else {
        message.error(response.message || '获取角色详情失败');
      }
    } catch (error) {
      console.error('获取角色详情失败:', error);
      message.error('获取角色详情失败');
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Card title="角色权限测试" loading={loading}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button onClick={loadRoles}>刷新角色列表</Button>
          
          <div>
            <h3>角色列表:</h3>
            {roles.map(role => (
              <Card key={role.id} size="small" style={{ marginBottom: '10px' }}>
                <Space>
                  <span><strong>{role.roleName}</strong> ({role.roleCode})</span>
                  <Tag color={role.status === 1 ? 'green' : 'red'}>
                    {role.status === 1 ? '启用' : '禁用'}
                  </Tag>
                  <Button 
                    size="small" 
                    onClick={() => testGetRoleDetail(role.id)}
                  >
                    获取详情
                  </Button>
                </Space>
                <div style={{ marginTop: '8px' }}>
                  <span>权限数量: {role.permissions?.length || 0}</span>
                  {role.permissions && role.permissions.length > 0 && (
                    <div style={{ marginTop: '4px' }}>
                      权限列表: {role.permissions.map((p: Permission) => p.permissionName).join(', ')}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TestRolePermission; 