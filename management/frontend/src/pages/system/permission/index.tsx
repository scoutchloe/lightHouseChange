import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Form,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Tree,
  Switch,
  Popconfirm,
  Row,
  Col,
  Tabs,
  Select
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import './style.css';

const { TabPane } = Tabs;

interface Role {
  id: number;
  roleName: string;
  roleCode: string;
  description: string;
  status: number;
  permissions: string[];
  createTime: string;
  updateTime: string;
}

interface Permission {
  id: number;
  permissionName: string;
  permissionCode: string;
  type: string; // menu, button
  parentId: number;
  path: string;
  icon: string;
  sort: number;
  status: number;
  children?: Permission[];
}

const PermissionPage: React.FC = () => {
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [permissionForm] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionTree, setPermissionTree] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 模拟数据
  const mockRoles: Role[] = [
    {
      id: 1,
      roleName: '超级管理员',
      roleCode: 'SUPER_ADMIN',
      description: '系统超级管理员，拥有所有权限',
      status: 1,
      permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      createTime: '2025-01-01 10:00:00',
      updateTime: '2025-01-01 10:00:00'
    },
    {
      id: 2,
      roleName: '普通管理员',
      roleCode: 'ADMIN',
      description: '普通管理员，拥有部分权限',
      status: 1,
      permissions: ['1', '2', '3', '4', '5'],
      createTime: '2025-01-01 10:00:00',
      updateTime: '2025-01-01 10:00:00'
    },
    {
      id: 3,
      roleName: '运营人员',
      roleCode: 'OPERATOR',
      description: '运营人员，主要负责内容管理',
      status: 1,
      permissions: ['1', '2', '3'],
      createTime: '2025-01-01 10:00:00',
      updateTime: '2025-01-01 10:00:00'
    }
  ];

  const mockPermissions: Permission[] = [
    {
      id: 1,
      permissionName: '系统管理',
      permissionCode: 'SYSTEM',
      type: 'menu',
      parentId: 0,
      path: '/system',
      icon: 'SettingOutlined',
      sort: 1,
      status: 1,
      children: [
        {
          id: 2,
          permissionName: '用户管理',
          permissionCode: 'SYSTEM_USER',
          type: 'menu',
          parentId: 1,
          path: '/system/user',
          icon: 'UserOutlined',
          sort: 1,
          status: 1,
          children: [
            {
              id: 3,
              permissionName: '新增用户',
              permissionCode: 'SYSTEM_USER_ADD',
              type: 'button',
              parentId: 2,
              path: '',
              icon: '',
              sort: 1,
              status: 1
            },
            {
              id: 4,
              permissionName: '编辑用户',
              permissionCode: 'SYSTEM_USER_EDIT',
              type: 'button',
              parentId: 2,
              path: '',
              icon: '',
              sort: 2,
              status: 1
            },
            {
              id: 5,
              permissionName: '删除用户',
              permissionCode: 'SYSTEM_USER_DELETE',
              type: 'button',
              parentId: 2,
              path: '',
              icon: '',
              sort: 3,
              status: 1
            }
          ]
        },
        {
          id: 6,
          permissionName: '角色管理',
          permissionCode: 'SYSTEM_ROLE',
          type: 'menu',
          parentId: 1,
          path: '/system/role',
          icon: 'SafetyOutlined',
          sort: 2,
          status: 1,
          children: [
            {
              id: 7,
              permissionName: '新增角色',
              permissionCode: 'SYSTEM_ROLE_ADD',
              type: 'button',
              parentId: 6,
              path: '',
              icon: '',
              sort: 1,
              status: 1
            },
            {
              id: 8,
              permissionName: '编辑角色',
              permissionCode: 'SYSTEM_ROLE_EDIT',
              type: 'button',
              parentId: 6,
              path: '',
              icon: '',
              sort: 2,
              status: 1
            }
          ]
        }
      ]
    },
    {
      id: 9,
      permissionName: '内容管理',
      permissionCode: 'CONTENT',
      type: 'menu',
      parentId: 0,
      path: '/content',
      icon: 'FileTextOutlined',
      sort: 2,
      status: 1,
      children: [
        {
          id: 10,
          permissionName: '文章管理',
          permissionCode: 'CONTENT_ARTICLE',
          type: 'menu',
          parentId: 9,
          path: '/content/article',
          icon: 'FileOutlined',
          sort: 1,
          status: 1
        }
      ]
    }
  ];

  // 转换权限数据为树形结构
  const convertToTreeData = (permissions: Permission[]): DataNode[] => {
    return permissions.map(permission => ({
      key: permission.id.toString(),
      title: permission.permissionName,
      children: permission.children ? convertToTreeData(permission.children) : undefined
    }));
  };

  // 获取所有权限ID（扁平化）
  const getAllPermissionIds = (permissions: Permission[]): string[] => {
    const ids: string[] = [];
    const traverse = (perms: Permission[]) => {
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

  // 角色表格列定义
  const roleColumns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Tag color="blue">{permissions.length}个权限</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRole(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleAssignPermission(record)}
          >
            分配权限
          </Button>
          <Popconfirm
            title="确定要删除这个角色吗？"
            onConfirm={() => handleDeleteRole(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 权限表格列定义
  const permissionColumns: ColumnsType<Permission> = [
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      key: 'permissionName'
    },
    {
      title: '权限编码',
      dataIndex: 'permissionCode',
      key: 'permissionCode'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'menu' ? 'blue' : 'green'}>
          {type === 'menu' ? '菜单' : '按钮'}
        </Tag>
      )
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPermission(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个权限吗？"
            onConfirm={() => handleDeletePermission(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 处理角色相关操作
  const handleAddRole = () => {
    setEditingRole(null);
    roleForm.resetFields();
    setRoleModalVisible(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    roleForm.setFieldsValue(role);
    setRoleModalVisible(true);
  };

  const handleDeleteRole = (id: number) => {
    message.success('删除角色成功');
    // 这里应该调用删除API
  };

  const handleSaveRole = async () => {
    try {
      const values = await roleForm.validateFields();
      if (editingRole) {
        message.success('更新角色成功');
      } else {
        message.success('创建角色成功');
      }
      setRoleModalVisible(false);
      // 这里应该调用保存API
    } catch (error) {
      console.error('保存角色失败:', error);
    }
  };

  // 处理权限相关操作
  const handleAddPermission = () => {
    setEditingPermission(null);
    permissionForm.resetFields();
    setPermissionModalVisible(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    permissionForm.setFieldsValue(permission);
    setPermissionModalVisible(true);
  };

  const handleDeletePermission = (id: number) => {
    message.success('删除权限成功');
    // 这里应该调用删除API
  };

  const handleSavePermission = async () => {
    try {
      const values = await permissionForm.validateFields();
      if (editingPermission) {
        message.success('更新权限成功');
      } else {
        message.success('创建权限成功');
      }
      setPermissionModalVisible(false);
      // 这里应该调用保存API
    } catch (error) {
      console.error('保存权限失败:', error);
    }
  };

  // 处理权限分配
  const handleAssignPermission = (role: Role) => {
    setSelectedRole(role);
    setCheckedKeys(role.permissions);
    setAssignModalVisible(true);
  };

  const handleSaveAssignment = () => {
    if (selectedRole) {
      message.success('权限分配成功');
      setAssignModalVisible(false);
      // 这里应该调用权限分配API
    }
  };

  useEffect(() => {
    // 初始化数据
    setRoles(mockRoles);
    setPermissions(mockPermissions);
    setPermissionTree(convertToTreeData(mockPermissions));
    setExpandedKeys(getAllPermissionIds(mockPermissions));
  }, []);

  return (
    <div className="permission-page">
      <Tabs defaultActiveKey="roles">
        <TabPane tab="角色管理" key="roles">
          <Card>
            <div className="table-header">
              <h3>角色列表</h3>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddRole}
                >
                  新增角色
                </Button>
                <Button icon={<ReloadOutlined />}>
                  刷新
                </Button>
              </Space>
            </div>
            
            <Table
              columns={roleColumns}
              dataSource={roles}
              rowKey="id"
              loading={loading}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="权限管理" key="permissions">
          <Card>
            <div className="table-header">
              <h3>权限列表</h3>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddPermission}
                >
                  新增权限
                </Button>
                <Button icon={<ReloadOutlined />}>
                  刷新
                </Button>
              </Space>
            </div>
            
            <Table
              columns={permissionColumns}
              dataSource={permissions}
              rowKey="id"
              loading={loading}
              expandable={{
                childrenColumnName: 'children'
              }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 角色编辑弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={roleModalVisible}
        onOk={handleSaveRole}
        onCancel={() => setRoleModalVisible(false)}
        width={600}
      >
        <Form
          form={roleForm}
          layout="vertical"
          initialValues={{ status: 1 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label="角色名称"
                rules={[{ required: true, message: '请输入角色名称' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleCode"
                label="角色编码"
                rules={[{ required: true, message: '请输入角色编码' }]}
              >
                <Input placeholder="请输入角色编码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限编辑弹窗 */}
      <Modal
        title={editingPermission ? '编辑权限' : '新增权限'}
        open={permissionModalVisible}
        onOk={handleSavePermission}
        onCancel={() => setPermissionModalVisible(false)}
        width={600}
      >
        <Form
          form={permissionForm}
          layout="vertical"
          initialValues={{ status: 1, type: 'menu' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="permissionName"
                label="权限名称"
                rules={[{ required: true, message: '请输入权限名称' }]}
              >
                <Input placeholder="请输入权限名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="permissionCode"
                label="权限编码"
                rules={[{ required: true, message: '请输入权限编码' }]}
              >
                <Input placeholder="请输入权限编码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="权限类型"
                rules={[{ required: true, message: '请选择权限类型' }]}
              >
                <Select>
                  <Select.Option value="menu">菜单</Select.Option>
                  <Select.Option value="button">按钮</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sort"
                label="排序"
              >
                <Input type="number" placeholder="请输入排序号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="path"
            label="路径"
          >
            <Input placeholder="请输入路径" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限分配弹窗 */}
      <Modal
        title={`为角色"${selectedRole?.roleName}"分配权限`}
        open={assignModalVisible}
        onOk={handleSaveAssignment}
        onCancel={() => setAssignModalVisible(false)}
        width={500}
      >
        <Tree
          checkable
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onCheck={(checked) => setCheckedKeys(Array.isArray(checked) ? checked.map(String) : [])}
          onExpand={(expanded) => setExpandedKeys(expanded.map(String))}
          treeData={permissionTree}
        />
      </Modal>
    </div>
  );
};

export default PermissionPage; 