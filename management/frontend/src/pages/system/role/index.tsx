import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm,
  Tag,
  Row,
  Col,
  Divider,
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Role, Permission } from '../../../types';
import { roleApi } from '../../../services/api';
import PermissionTree from '../../../components/PermissionTree';
import PermissionControl from '../../../components/common/PermissionControl';
import dayjs from 'dayjs';
import './style.css';

const { TextArea } = Input;

interface SearchForm {
  roleName?: string;
  roleCode?: string;
  status?: number;
}

const RoleManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchForm, setSearchForm] = useState<SearchForm>({});

  // 模态框状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  // 权限分配模态框状态
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [checkedPermissions, setCheckedPermissions] = useState<number[]>([]);

  // 加载角色列表
  const loadRoles = async () => {
    setLoading(true);
    try {
      const params = {
        current,
        size: pageSize,
        ...searchForm,
      };
      const response = await roleApi.getPage(params);
      if (response.code === 200) {
        setRoles(response.data.records);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取角色列表失败');
      }
    } catch (error) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, [current, pageSize, searchForm]);

  // 搜索
  const handleSearch = (values: SearchForm) => {
    setSearchForm(values);
    setCurrent(1);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchForm({});
    setCurrent(1);
  };

  // 新增角色
  const handleAdd = () => {
    setModalType('add');
    setCurrentRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑角色
  const handleEdit = (record: Role) => {
    setModalType('edit');
    setCurrentRole(record);
    form.setFieldsValue({
      ...record,
      status: record.status === 1,
    });
    setModalVisible(true);
  };

  // 删除角色
  const handleDelete = async (id: number) => {
    try {
      const response = await roleApi.delete(id);
      if (response.code === 200) {
        message.success('删除成功');
        loadRoles();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 保存角色
  const handleSave = async (values: any) => {
    try {
      const data = {
        ...values,
        status: values.status ? 1 : 0,
      };

      if (modalType === 'add') {
        const response = await roleApi.create(data);
        if (response.code === 200) {
          message.success('新增成功');
        } else {
          message.error(response.message || '新增失败');
        }
      } else {
        const response = await roleApi.update({ ...data, id: currentRole!.id });
        if (response.code === 200) {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
        }
      }

      setModalVisible(false);
      loadRoles();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 权限分配
  const handlePermissionAssign = async (record: Role) => {
    setCurrentRole(record);
    try {
      // 获取角色详情（包含权限信息）
      const response = await roleApi.getDetail(record.id);
      console.log('获取角色详情响应:', response);
      if (response.code === 200 && response.data) {
        const rolePermissions = response.data.permissions || [];
        console.log('角色权限列表:', rolePermissions);
        setCheckedPermissions(rolePermissions.map((p: Permission) => p.id));
      } else {
        console.error('获取角色权限失败，响应码:', response.code);
        message.error('获取角色权限失败');
      }
    } catch (error) {
      console.error('获取角色权限异常:', error);
      message.error('获取角色权限失败');
    }
    setPermissionModalVisible(true);
  };

  // 保存权限分配
  const handlePermissionSave = async () => {
    try {
      const response = await roleApi.assignPermissions({
        roleId: currentRole!.id,
        permissionIds: checkedPermissions,
      });
      if (response.code === 200) {
        message.success('权限分配成功');
        setPermissionModalVisible(false);
      } else {
        message.error(response.message || '权限分配失败');
      }
    } catch (error) {
      message.error('权限分配失败');
    }
  };

  // 处理权限选择
  const handlePermissionCheck = (checkedKeys: number[]) => {
    setCheckedPermissions(checkedKeys);
  };

  const columns: ColumnsType<Role> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      width: 150,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <PermissionControl permission="system:role:edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            >
              编辑
            </Button>
          </PermissionControl>
          <PermissionControl permission="system:role:auth">
            <Button
              type="link"
              icon={<SettingOutlined />}
              onClick={() => handlePermissionAssign(record)}
              size="small"
            >
              权限
            </Button>
          </PermissionControl>
          <PermissionControl permission="system:role:delete">
            <Popconfirm
              title="确定要删除这个角色吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
          </PermissionControl>
        </Space>
      ),
    },
  ];

  return (
    <div className="role-management">
      <Card>
        {/* 搜索表单 */}
        <Form
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="roleName" label="角色名称">
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="roleCode" label="角色编码">
            <Input placeholder="请输入角色编码" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
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

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <PermissionControl permission="system:role:add">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增角色
            </Button>
          </PermissionControl>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
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
            },
          }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={modalType === 'add' ? '新增角色' : '编辑角色'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="roleCode"
                label="角色编码"
                rules={[
                  { required: true, message: '请输入角色编码' },
                  { pattern: /^[A-Z_]+$/, message: '角色编码只能包含大写字母和下划线' },
                ]}
              >
                <Input placeholder="请输入角色编码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleName"
                label="角色名称"
                rules={[{ required: true, message: '请输入角色名称' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限分配模态框 */}
      <Modal
        title="权限分配"
        open={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        onOk={handlePermissionSave}
        width={800}
      >
        <Divider orientation="left">选择权限</Divider>
        <PermissionTree
          checkable
          checkedKeys={checkedPermissions}
          onCheck={handlePermissionCheck}
          height={400}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement; 