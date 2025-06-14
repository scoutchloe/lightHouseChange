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
  Select,
  TreeSelect
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
  MenuOutlined,
  AppstoreOutlined,
  FolderOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { roleApi, permissionApi } from '../../../services/api';
import type { Role, Permission } from '../../../types/api';
import './style.css';

const { TabPane } = Tabs;

// 权限树节点数据类型
interface PermissionTreeNode extends DataNode {
  key: string;
  title: React.ReactNode;
  children?: PermissionTreeNode[];
  permission?: Permission;
  isLeaf?: boolean;
}

const PermissionPage: React.FC = () => {
  // 角色相关状态
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm] = Form.useForm();
  
  // 权限相关状态
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionTree, setPermissionTree] = useState<PermissionTreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [permissionForm] = Form.useForm();
  
  // 权限分配相关状态
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  
  // 分页状态
  const [rolePagination, setRolePagination] = useState({
    current: 1,
    size: 10,
    total: 0
  });

  // 加载角色列表
  const loadRoles = async (params?: any) => {
    try {
      setLoading(true);
      console.log('开始加载角色列表，参数:', params);
      
      const response = await roleApi.getPage({
        current: rolePagination.current,
        size: rolePagination.size,
        ...params
      });
      
      console.log('角色列表API响应:', response);
      
      if (response.code === 200) {
        const pageData = response.data;
        console.log('角色数据:', pageData);
        console.log('角色记录:', pageData.records);
        
        // 检查每个角色的权限信息
        pageData.records?.forEach((role, index) => {
          console.log(`角色${index + 1} [${role.roleName}] 权限信息:`, {
            permissions: role.permissions,
            permissionCount: role.permissions?.length || 0
          });
        });
        
        setRoles(pageData.records || []);
        setRolePagination(prev => ({
          ...prev,
          total: pageData.total || 0
        }));
      } else {
        console.error('角色列表加载失败:', response.message);
        message.error(response.message || '获取角色列表失败');
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载权限树
  const loadPermissionTree = async () => {
    try {
      setLoading(true);
      console.log('开始加载权限树');
      const response = await permissionApi.getTree();
      console.log('权限树API响应:', response);
      
      if (response.code === 200) {
        const permissionsData = response.data;
        console.log('权限树数据:', permissionsData);
        setPermissions(permissionsData || []);
        const treeData = convertToPermissionTree(permissionsData || []);
        setPermissionTree(treeData);
        // 默认不展开任何节点，让用户手动展开
        setExpandedKeys([]);
      } else {
        console.error('权限树加载失败:', response.message);
        message.error(response.message || '获取权限树失败');
      }
    } catch (error) {
      console.error('获取权限树失败:', error);
      message.error('获取权限树失败');
    } finally {
      setLoading(false);
    }
  };

  // 转换权限数据为树形结构（用于权限管理显示）
  const convertToPermissionTree = (permissions: Permission[]): PermissionTreeNode[] => {
    return permissions.map(permission => {
      const hasChildren = permission.children && permission.children.length > 0;
      
      return {
        key: permission.id.toString(),
        title: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {permission.permissionType === 'menu' ? (
                hasChildren ? <FolderOutlined /> : <MenuOutlined />
              ) : (
                <AppstoreOutlined />
              )}
              <span>{permission.permissionName}</span>
              <Tag color={permission.permissionType === 'menu' ? 'blue' : 'green'}>
                {permission.permissionType === 'menu' ? '菜单' : '按钮'}
              </Tag>
              <Tag color={permission.status === 1 ? 'success' : 'error'}>
                {permission.status === 1 ? '启用' : '禁用'}
              </Tag>
            </div>
            <Space size="small">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPermission(permission);
                }}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定要删除这个权限吗？"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleDeletePermission(permission.id);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                >
                  删除
                </Button>
              </Popconfirm>
            </Space>
          </div>
        ),
        children: hasChildren ? convertToPermissionTree(permission.children!) : undefined,
        permission,
        isLeaf: !hasChildren
      };
    });
  };

  // 转换为树形数据（用于权限分配，显示详细信息）
  const convertToDetailedTreeData = (permissions: Permission[]): DataNode[] => {
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

  // 转换为树形数据（简单版本）
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

  // 构建父级权限选项（用于TreeSelect）
  const buildParentOptions = (permissions: Permission[], excludeId?: number): DataNode[] => {
    return permissions
      .filter(permission => permission.id !== excludeId) // 排除当前编辑的权限
      .map(permission => ({
        key: permission.id.toString(),
        value: permission.id.toString(),
        title: `${permission.permissionName} (${permission.permissionType === 'menu' ? '菜单' : '按钮'})`,
        children: permission.children && permission.children.length > 0 
          ? buildParentOptions(permission.children, excludeId) 
          : undefined
      }));
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
      render: (permissions: Permission[]) => (
        <Tag color="blue">{permissions?.length || 0}个权限</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
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
      title: '权限类型',
      dataIndex: 'permissionType',
      key: 'permissionType',
      render: (type: string) => (
        <Tag color={type === 'menu' ? 'blue' : 'green'}>
          {type === 'menu' ? '菜单' : '按钮'}
        </Tag>
      )
    },
    {
      title: '路径',
      dataIndex: 'menuPath',
      key: 'menuPath',
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
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
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
    roleForm.setFieldsValue({ status: true });
    setRoleModalVisible(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    roleForm.setFieldsValue({
      ...role,
      status: role.status === 1
    });
    setRoleModalVisible(true);
  };

  const handleDeleteRole = async (id: number) => {
    try {
      const response = await roleApi.delete(id);
      if (response.code === 200) {
        message.success('删除角色成功');
        loadRoles();
      } else {
        message.error(response.message || '删除角色失败');
      }
    } catch (error) {
      console.error('删除角色失败:', error);
      message.error('删除角色失败');
    }
  };

  const handleSaveRole = async () => {
    try {
      const values = await roleForm.validateFields();
      console.log('角色表单数据:', values);
      
      const roleData = {
        ...values,
        status: values.status ? 1 : 0
      };
      
      console.log('准备发送的角色数据:', roleData);
      
      let response;
      if (editingRole) {
        console.log('更新角色，ID:', editingRole.id);
        response = await roleApi.update({ ...roleData, id: editingRole.id });
      } else {
        console.log('创建新角色');
        response = await roleApi.create(roleData);
      }
      
      console.log('角色API响应:', response);
      
      if (response.code === 200) {
        message.success(editingRole ? '更新角色成功' : '创建角色成功');
        setRoleModalVisible(false);
        roleForm.resetFields();
        setEditingRole(null);
        loadRoles();
      } else {
        console.error('角色保存失败:', response.message);
        message.error(response.message || '保存角色失败');
      }
    } catch (error) {
      console.error('保存角色失败:', error);
      message.error('保存角色失败');
    }
  };

  // 处理权限相关操作
  const handleAddPermission = () => {
    setEditingPermission(null);
    permissionForm.resetFields();
    permissionForm.setFieldsValue({ status: true, permissionType: 'menu', parentId: null });
    setPermissionModalVisible(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    permissionForm.setFieldsValue({
      ...permission,
      status: permission.status === 1,
      parentId: permission.parentId ? permission.parentId.toString() : null
    });
    setPermissionModalVisible(true);
  };

  const handleDeletePermission = async (id: number) => {
    try {
      const response = await permissionApi.delete(id);
      if (response.code === 200) {
        message.success('删除权限成功');
        loadPermissionTree(); // 重新加载权限树
      } else {
        message.error(response.message || '删除权限失败');
      }
    } catch (error) {
      console.error('删除权限失败:', error);
      message.error('删除权限失败');
    }
  };

  const handleSavePermission = async () => {
    try {
      const values = await permissionForm.validateFields();
      const permissionData = {
        ...values,
        status: values.status ? 1 : 0,
        parentId: values.parentId ? parseInt(values.parentId) : null
      };
      
      let response;
      if (editingPermission) {
        response = await permissionApi.update({ ...permissionData, id: editingPermission.id });
      } else {
        response = await permissionApi.create(permissionData);
      }
      
      if (response.code === 200) {
        message.success(editingPermission ? '更新权限成功' : '创建权限成功');
        setPermissionModalVisible(false);
        permissionForm.resetFields();
        setEditingPermission(null);
        loadPermissionTree(); // 重新加载权限树
      } else {
        message.error(response.message || '保存权限失败');
      }
    } catch (error) {
      console.error('保存权限失败:', error);
      message.error('保存权限失败');
    }
  };

  // 处理权限分配
  const handleAssignPermission = (role: Role) => {
    setSelectedRole(role);
    // 将权限ID转换为字符串数组
    const permissionIds = role.permissions ? role.permissions.map(p => p.id.toString()) : [];
    setCheckedKeys(permissionIds);
    setAssignModalVisible(true);
  };

  const handleSaveAssignment = async () => {
    if (selectedRole) {
      try {
        const response = await roleApi.assignPermissions({
          roleId: selectedRole.id,
          permissionIds: checkedKeys.map(key => parseInt(key))
        });
        
        if (response.code === 200) {
          message.success('权限分配成功');
          setAssignModalVisible(false);
          loadRoles(); // 重新加载角色列表
        } else {
          message.error(response.message || '权限分配失败');
        }
      } catch (error) {
        console.error('权限分配失败:', error);
        message.error('权限分配失败');
      }
    }
  };

  // 处理分页变化
  const handleRolePageChange = (page: number, pageSize: number) => {
    setRolePagination(prev => ({
      ...prev,
      current: page,
      size: pageSize
    }));
    loadRoles({ current: page, size: pageSize });
  };

  useEffect(() => {
    // 初始化数据
    loadRoles();
    loadPermissionTree();
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
                <Button icon={<ReloadOutlined />} onClick={() => loadRoles()}>
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
                current: rolePagination.current,
                pageSize: rolePagination.size,
                total: rolePagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
                onChange: handleRolePageChange
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="权限管理" key="permissions">
          <Card>
            <div className="table-header">
              <h3>权限树</h3>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddPermission}
                >
                  新增权限
                </Button>
                <Button icon={<ReloadOutlined />} onClick={() => loadPermissionTree()}>
                  刷新
                </Button>
                <Button 
                  icon={<FolderOpenOutlined />} 
                  onClick={() => setExpandedKeys(getAllPermissionIds(permissions))}
                >
                  展开全部
                </Button>
                <Button 
                  icon={<FolderOutlined />} 
                  onClick={() => setExpandedKeys([])}
                >
                  折叠全部
                </Button>
              </Space>
            </div>
            
            <Tree
              showLine
              showIcon={false}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onExpand={(expanded) => {
                setExpandedKeys(expanded.map(key => key.toString()));
              }}
              onSelect={(selected) => {
                setSelectedKeys(selected.map(key => key.toString()));
              }}
              treeData={permissionTree}
              style={{ marginTop: 16 }}
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
          initialValues={{ status: true }}
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
        width={700}
      >
        <Form
          form={permissionForm}
          layout="vertical"
          initialValues={{ status: true, permissionType: 'menu', parentId: null }}
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
                name="permissionType"
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
                name="parentId"
                label="父级权限"
              >
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={buildParentOptions(permissions, editingPermission?.id)}
                  placeholder="请选择父级权限（可选）"
                  allowClear
                  showSearch
                  treeDefaultExpandAll={false}
                  treeNodeFilterProp="title"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sortOrder"
                label="排序"
              >
                <Input type="number" placeholder="请输入排序号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="menuPath"
            label="路径"
          >
            <Input placeholder="请输入路径" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={2} placeholder="请输入权限描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限分配弹窗 */}
      <Modal
        title={`为角色 "${selectedRole?.roleName}" 分配权限`}
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
              onClick={() => setExpandedKeys(getAllPermissionIds(permissions))}
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
              onClick={() => setCheckedKeys(getAllPermissionIds(permissions))}
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
            treeData={convertToDetailedTreeData(permissions)}
          />
        </div>
        
        <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
          已选择 {checkedKeys.length} 个权限
        </div>
      </Modal>
    </div>
  );
};

export default PermissionPage; 