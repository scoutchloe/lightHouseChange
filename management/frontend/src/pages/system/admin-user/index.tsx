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
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminUserApi } from '../../../services/api';
import './style.css';

const { Option } = Select;

interface AdminUser {
  id: number;
  username: string;
  realName: string;
  email: string;
  phone: string;
  avatar: string;
  status: number;
  role: number;
  lastLoginTime: string;
  lastLoginIp: string;
  createTime: string;
  updateTime: string;
}

const AdminUserPage: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AdminUser | null>(null);
  const [resetPasswordRecord, setResetPasswordRecord] = useState<AdminUser | null>(null);

  // 状态选项
  const statusOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ];

  // 角色选项
  const roleOptions = [
    { label: '超级管理员', value: 1 },
    { label: '普通管理员', value: 2 },
  ];

  // 获取管理员用户列表
  const fetchAdminUsers = async (params: any = {}) => {
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
        message.error(response.message || '获取管理员用户失败');
      }
    } catch (error) {
      message.error('获取管理员用户失败');
      console.error('获取管理员用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = () => {
    const values = form.getFieldsValue();
    const params: any = {};
    
    if (values.username) params.username = values.username;
    if (values.realName) params.realName = values.realName;
    if (values.status !== undefined) params.status = values.status;
    if (values.role !== undefined) params.role = values.role;
    
    setCurrent(1);
    fetchAdminUsers(params);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    fetchAdminUsers();
  };

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = (record: AdminUser) => {
    setEditingRecord(record);
    modalForm.setFieldsValue({
      ...record,
    });
    setModalVisible(true);
  };

  // 删除
  const handleDelete = async (record: AdminUser) => {
    try {
      const response = await adminUserApi.deleteAdminUser(record.id);
      if (response.code === 200) {
        message.success('删除成功');
        fetchAdminUsers();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  // 重置密码
  const handleResetPassword = (record: AdminUser) => {
    setResetPasswordRecord(record);
    passwordForm.resetFields();
    setPasswordModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await modalForm.validateFields();
      
      if (editingRecord) {
        // 编辑
        const response = await adminUserApi.updateAdminUser(editingRecord.id, values);
        if (response.code === 200) {
          message.success('更新成功');
          setModalVisible(false);
          fetchAdminUsers();
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        // 新增
        const response = await adminUserApi.createAdminUser(values);
        if (response.code === 200) {
          message.success('创建成功');
          setModalVisible(false);
          fetchAdminUsers();
        } else {
          message.error(response.message || '创建失败');
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 提交密码重置
  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      
      if (resetPasswordRecord) {
        const response = await adminUserApi.resetPassword(resetPasswordRecord.id, values.newPassword);
        if (response.code === 200) {
          message.success('密码重置成功');
          setPasswordModalVisible(false);
        } else {
          message.error(response.message || '密码重置失败');
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error);
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

  // 表格列定义
  const columns: ColumnsType<AdminUser> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 80,
      render: (avatar: string, record) => (
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
      title: '角色',
      dataIndex: 'role',
      width: 100,
      render: (role: number) => {
        const roleMap: Record<number, { text: string; color: string }> = {
          1: { text: '超级管理员', color: 'red' },
          2: { text: '普通管理员', color: 'blue' }
        };
        const roleInfo = roleMap[role];
        return roleInfo ? <Tag color={roleInfo.color}>{roleInfo.text}</Tag> : role;
      }
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
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      width: 160,
      render: (time: string) => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
      width: 120,
      render: (ip: string) => ip || '-'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record)}
          >
            重置密码
          </Button>
          {record.username !== 'admin' && (
            <Popconfirm
              title="确定要删除该管理员用户吗？"
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
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchAdminUsers();
  }, [current, pageSize]);

  return (
    <div className="admin-user-page">
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
          
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              {statusOptions.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="role" label="角色">
            <Select placeholder="请选择角色" allowClear style={{ width: 120 }}>
              {roleOptions.map(item => (
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
          <h3>管理员用户列表</h3>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增管理员
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
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
        title={editingRecord ? '编辑管理员用户' : '新增管理员用户'}
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
            role: 2
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
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  {roleOptions.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
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
          
          {!editingRecord && (
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
          )}
          
          <Form.Item name="avatar" label="头像URL">
            <Input placeholder="请输入头像URL" />
          </Form.Item>
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
            <Input.Password placeholder="请确认密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserPage; 