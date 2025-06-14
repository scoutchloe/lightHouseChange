import React, { useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Tree,
  Space,
  Tag,
  message
} from 'antd';
import type { DataNode } from 'antd/es/tree';

// 模拟权限数据
const mockPermissions = [
  {
    id: 1,
    permissionName: '系统管理',
    permissionCode: 'SYSTEM',
    permissionType: 'menu',
    status: 1,
    description: '系统管理模块',
    children: [
      {
        id: 11,
        permissionName: '用户管理',
        permissionCode: 'SYSTEM_USER',
        permissionType: 'menu',
        status: 1,
        description: '用户管理功能',
        children: [
          {
            id: 111,
            permissionName: '查看用户',
            permissionCode: 'SYSTEM_USER_VIEW',
            permissionType: 'button',
            status: 1,
            description: '查看用户列表'
          },
          {
            id: 112,
            permissionName: '新增用户',
            permissionCode: 'SYSTEM_USER_CREATE',
            permissionType: 'button',
            status: 1,
            description: '创建新用户'
          },
          {
            id: 113,
            permissionName: '编辑用户',
            permissionCode: 'SYSTEM_USER_UPDATE',
            permissionType: 'button',
            status: 1,
            description: '编辑用户信息'
          },
          {
            id: 114,
            permissionName: '删除用户',
            permissionCode: 'SYSTEM_USER_DELETE',
            permissionType: 'button',
            status: 1,
            description: '删除用户'
          }
        ]
      },
      {
        id: 12,
        permissionName: '角色管理',
        permissionCode: 'SYSTEM_ROLE',
        permissionType: 'menu',
        status: 1,
        description: '角色管理功能',
        children: [
          {
            id: 121,
            permissionName: '查看角色',
            permissionCode: 'SYSTEM_ROLE_VIEW',
            permissionType: 'button',
            status: 1,
            description: '查看角色列表'
          },
          {
            id: 122,
            permissionName: '新增角色',
            permissionCode: 'SYSTEM_ROLE_CREATE',
            permissionType: 'button',
            status: 1,
            description: '创建新角色'
          },
          {
            id: 123,
            permissionName: '分配权限',
            permissionCode: 'SYSTEM_ROLE_ASSIGN',
            permissionType: 'button',
            status: 1,
            description: '为角色分配权限'
          }
        ]
      },
      {
        id: 13,
        permissionName: '权限管理',
        permissionCode: 'SYSTEM_PERMISSION',
        permissionType: 'menu',
        status: 1,
        description: '权限管理功能'
      }
    ]
  },
  {
    id: 2,
    permissionName: '内容管理',
    permissionCode: 'CONTENT',
    permissionType: 'menu',
    status: 1,
    description: '内容管理模块',
    children: [
      {
        id: 21,
        permissionName: '文章管理',
        permissionCode: 'CONTENT_ARTICLE',
        permissionType: 'menu',
        status: 1,
        description: '文章管理功能'
      },
      {
        id: 22,
        permissionName: '分类管理',
        permissionCode: 'CONTENT_CATEGORY',
        permissionType: 'menu',
        status: 1,
        description: '分类管理功能'
      }
    ]
  },
  {
    id: 3,
    permissionName: '订单管理',
    permissionCode: 'ORDER',
    permissionType: 'menu',
    status: 1,
    description: '订单管理模块'
  }
];

// 模拟角色数据
const mockRole = {
  id: 1,
  roleName: '管理员',
  roleCode: 'ADMIN',
  description: '系统管理员角色'
};

const DemoPermissionAssign: React.FC = () => {
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(['1', '11', '111', '112', '2', '21']);

  // 获取所有权限ID
  const getAllPermissionIds = (permissions: any[]): string[] => {
    const ids: string[] = [];
    const traverse = (perms: any[]) => {
      perms.forEach(perm => {
        ids.push(perm.id.toString());
        if (perm.children) {
          traverse(perm.children);
        }
      });
    };
    traverse(permissions);
    return ids;
  };

  // 转换为详细的树形数据
  const convertToDetailedTreeData = (permissions: any[]): DataNode[] => {
    return permissions.map(permission => ({
      key: permission.id.toString(),
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500 }}>{permission.permissionName}</span>
          <Tag 
            color={permission.permissionType === 'menu' ? 'blue' : 'green'}
          >
            {permission.permissionType === 'menu' ? '菜单' : '按钮'}
          </Tag>
          <Tag 
            color={permission.status === 1 ? 'success' : 'error'}
          >
            {permission.status === 1 ? '启用' : '禁用'}
          </Tag>
          {permission.description && (
            <span style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>
              ({permission.description})
            </span>
          )}
        </div>
      ),
      children: permission.children ? convertToDetailedTreeData(permission.children) : undefined
    }));
  };

  const handleSaveAssignment = () => {
    message.success(`已为角色 "${mockRole.roleName}" 分配 ${checkedKeys.length} 个权限`);
    setAssignModalVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="权限分配功能演示">
        <p>这是权限分配功能的演示页面，展示了改进后的权限分配界面。</p>
        <p>当前模拟角色：<strong>{mockRole.roleName}</strong> ({mockRole.description})</p>
        
        <Button 
          type="primary" 
          onClick={() => setAssignModalVisible(true)}
        >
          为角色分配权限
        </Button>
      </Card>

      {/* 权限分配弹窗 */}
      <Modal
        title={`为角色 "${mockRole.roleName}" 分配权限`}
        open={assignModalVisible}
        onOk={handleSaveAssignment}
        onCancel={() => setAssignModalVisible(false)}
        width={800}
        style={{ top: 20 }}
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              size="small"
              onClick={() => setExpandedKeys(getAllPermissionIds(mockPermissions))}
            >
              展开全部
            </Button>
            <Button 
              size="small"
              onClick={() => setExpandedKeys([])}
            >
              折叠全部
            </Button>
            <Button 
              size="small"
              onClick={() => setCheckedKeys(getAllPermissionIds(mockPermissions))}
            >
              全选
            </Button>
            <Button 
              size="small"
              onClick={() => setCheckedKeys([])}
            >
              取消全选
            </Button>
          </Space>
        </div>
        
        <div style={{ 
          border: '1px solid #d9d9d9', 
          borderRadius: 6, 
          padding: 16, 
          maxHeight: 400, 
          overflow: 'auto' 
        }}>
          <Tree
            checkable
            checkStrictly
            showLine
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            onCheck={(checked) => {
              // 当使用checkStrictly时，checked是一个对象 {checked: Key[], halfChecked: Key[]}
              if (typeof checked === 'object' && 'checked' in checked) {
                setCheckedKeys(checked.checked.map(key => key.toString()));
              } else if (Array.isArray(checked)) {
                setCheckedKeys(checked.map(key => key.toString()));
              }
            }}
            onExpand={(expanded) => {
              setExpandedKeys(expanded.map(key => key.toString()));
            }}
            treeData={convertToDetailedTreeData(mockPermissions)}
          />
        </div>
        
        <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
          已选择 {checkedKeys.length} 个权限
        </div>
      </Modal>
    </div>
  );
};

export default DemoPermissionAssign; 