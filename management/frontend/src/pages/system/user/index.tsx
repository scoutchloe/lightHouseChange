import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Avatar,
  Row,
  Col,
  Transfer,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminUserApi, roleApi } from '../../../services/api';
import PermissionControl from '../../../components/common/PermissionControl';
import type { Admin, Role } from '../../../types/api';
import './style.css';

const { Option } = Select;

interface TransferItem {
  key: string;
  title: string;
  description?: string;
}

const SystemUserPage: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Admin | null>(null);
  const [resetPasswordRecord, setResetPasswordRecord] = useState<Admin | null>(null);
  const [assignRoleRecord, setAssignRoleRecord] = useState<Admin | null>(null);
  const [transferTargetKeys, setTransferTargetKeys] = useState<string[]>([]);
  const [transferSelectedKeys, setTransferSelectedKeys] = useState<string[]>([]);

  // 状态选项
  const statusOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ];

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const response = await roleApi.getPage({ current: 1, size: 1000 });
      if (response.code === 200) {
        setRoles(response.data.records);
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
    }
  };

  // 获取系统用户列表
  const fetchUsers = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await adminUserApi.getAdminUserPage({
        current,
        size: pageSize,
        ...params
      });
      
      if (response.code === 200) {
        setDataSource(response.data.records);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取用户失败');
      }
    } catch (error) {
      message.error('获取用户失败');
      console.error('获取用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = (values: any) => {
    setCurrent(1);
    fetchUsers(values);
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    fetchUsers();
  };

  // 新增用户
  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    setModalVisible(true);
  };

  // 编辑用户
  const handleEdit = (record: Admin) => {
    setEditingRecord(record);
    modalForm.setFieldsValue({
      ...record,
    });
    setModalVisible(true);
  };

  // 删除用户
  const handleDelete = async (record: Admin) => {
    try {
      const response = await adminUserApi.deleteAdminUser(record.id);
      if (response.code === 200) {
        message.success('删除成功');
        fetchUsers();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  // 重置密码
  const handleResetPassword = (record: Admin) => {
    setResetPasswordRecord(record);
    passwordForm.resetFields();
    setPasswordModalVisible(true);
  };

  // 分配角色
  const handleAssignRole = async (record: Admin) => {
    setAssignRoleRecord(record);
    setRoleModalVisible(true);
    
    // 获取用户当前角色
    try {
      const response = await adminUserApi.getUserRoles(record.id);
      if (response.code === 200) {
        const targetKeys = response.data.map((role: Role) => role.id.toString());
        setTransferTargetKeys(targetKeys);
      } else {
        // 如果API不存在，使用record中的roles字段
        const userRoles = record.roles || [];
        const targetKeys = userRoles.map(role => role.id.toString());
        setTransferTargetKeys(targetKeys);
      }
    } catch (error) {
      console.error('获取用户角色失败:', error);
      // 降级处理：使用record中的roles字段
      const userRoles = record.roles || [];
      const targetKeys = userRoles.map(role => role.id.toString());
      setTransferTargetKeys(targetKeys);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await modalForm.validateFields();
      
      if (editingRecord) {
        // 更新用户
        const response = await adminUserApi.updateAdminUser(editingRecord.id, values);
        if (response.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          fetchUsers();
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        // 新增用户
        const response = await adminUserApi.createAdminUser(values);
        if (response.code === 200) {
          message.success('新增成功');
          setModalVisible(false);
          fetchUsers();
        } else {
          message.error(response.message || '新增失败');
        }
      }
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  // 提交重置密码
  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      
      if (resetPasswordRecord) {
        const response = await adminUserApi.resetPassword(resetPasswordRecord.id, values.newPassword);
        if (response.code === 200) {
          message.success('重置密码成功');
          setPasswordModalVisible(false);
        } else {
          message.error(response.message || '重置密码失败');
        }
      }
    } catch (error) {
      console.error('重置密码失败:', error);
    }
  };

  // 提交角色分配
  const handleRoleSubmit = async () => {
    try {
      if (assignRoleRecord) {
        const roleIds = transferTargetKeys.map(key => parseInt(key));
        const response = await adminUserApi.assignRoles(assignRoleRecord.id, roleIds);
        if (response.code === 200) {
          message.success('角色分配成功');
          setRoleModalVisible(false);
          fetchUsers();
        } else {
          message.error(response.message || '角色分配失败');
        }
      }
    } catch (error) {
      message.error('角色分配失败');
      console.error('角色分配失败:', error);
    }
  };

  // 检查用户名唯一性
  const checkUsername = async (_: any, value: string) => {
    if (!value) return Promise.resolve();
    
    // 如果是编辑模式且用户名未改变，则跳过检查
    if (editingRecord && editingRecord.username === value) {
      return Promise.resolve();
    }
    
    try {
      const response = await adminUserApi.checkUsername(value);
      if (response.code === 200 && !response.data) {
        return Promise.reject(new Error('用户名已存在'));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error('检查用户名失败'));
    }
  };

  // Transfer组件数据
  const transferData: TransferItem[] = roles.map(role => ({
    key: role.id.toString(),
    title: role.roleName,
    description: role.description,
  }));

  // 表格列定义
  const columns: ColumnsType<Admin> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <Avatar 
          src={avatar} 
          icon={<UserOutlined />}
          size={40}
        />
      )
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      fixed: 'left'
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 120
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (text: string) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '角色',
      dataIndex: 'roles',
      width: 200,
      render: (roles: Role[]) => (
        <Space size={[0, 8]} wrap>
          {roles && roles.length > 0 ? roles.map(role => (
            <Tag key={role.id} color="blue">
              {role.roleName}
            </Tag>
          )) : <Tag color="default">无角色</Tag>}
        </Space>
      )
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      width: 160,
      render: (time: string) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <PermissionControl permission="system:user:edit">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </PermissionControl>
          <PermissionControl permission="system:user:reset">
            <Button
              type="link"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record)}
            >
              重置密码
            </Button>
          </PermissionControl>
          <PermissionControl permission="system:user:role">
            <Button
              type="link"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => handleAssignRole(record)}
            >
              分配角色
            </Button>
          </PermissionControl>
          <PermissionControl permission="system:user:delete">
            {record.username !== 'admin' && (
              <Popconfirm
                title="确定要删除该用户吗？"
                onConfirm={() => handleDelete(record)}
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
            )}
          </PermissionControl>
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [current, pageSize]);

  return (
    <div className="system-user-page">
      <Card>
        <Form
          form={form}
          layout="inline"
          className="search-form"
          onFinish={handleSearch}
        >
          <Form.Item name="username" label="用户名">
            <Input placeholder="请输入用户名" style={{ width: 120 }} />
          </Form.Item>
          
          <Form.Item name="realName" label="真实姓名">
            <Input placeholder="请输入真实姓名" style={{ width: 120 }} />
          </Form.Item>
          
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" style={{ width: 160 }} />
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              {statusOptions.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card className="table-card">
        <div className="table-header">
          <h3>系统用户列表</h3>
          <PermissionControl permission="system:user:add">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增用户
            </Button>
          </PermissionControl>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size || 10);
            }
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRecord ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={{
            status: 1,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { pattern: /^[a-zA-Z0-9_]{3,20}$/, message: '用户名只能包含字母、数字、下划线，长度3-20位' },
                  { validator: checkUsername }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="realName"
                label="真实姓名"
                rules={[{ required: true, message: '请输入真实姓名' }]}
              >
                <Input placeholder="请输入真实姓名" />
              </Form.Item>
            </Col>
          </Row>
          
          {!editingRecord && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位' }
                  ]}
                >
                  <Input.Password placeholder="请输入密码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="请确认密码" />
                </Form.Item>
              </Col>
            </Row>
          )}
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { type: 'email', message: '邮箱格式不正确' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  {statusOptions.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={passwordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => setPasswordModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 分配角色弹窗 */}
      <Modal
        title="分配角色"
        open={roleModalVisible}
        onOk={handleRoleSubmit}
        onCancel={() => setRoleModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Transfer
          dataSource={transferData}
          titles={['可选角色', '已选角色']}
          targetKeys={transferTargetKeys}
          selectedKeys={transferSelectedKeys}
          onChange={(targetKeys) => setTransferTargetKeys(targetKeys.map(key => key.toString()))}
          onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
            setTransferSelectedKeys([...sourceSelectedKeys.map(key => key.toString()), ...targetSelectedKeys.map(key => key.toString())]);
          }}
          render={item => `${item.title} - ${item.description || '无描述'}`}
          listStyle={{
            width: 250,
            height: 300,
          }}
        />
      </Modal>
    </div>
  );
};

export default SystemUserPage; 