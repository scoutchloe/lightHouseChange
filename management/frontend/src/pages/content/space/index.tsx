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
  Row,
  Col,
  ColorPicker,
  Upload,
  Image,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { contentSpaceApi } from '../../../services/api';
import './style.css';

const { Option } = Select;

interface Space {
  id: number;
  name: string;
  icon: string;
  iconColor: string;
  description: string;
  image: string;
  status: number;
  sort: number;
  createTime: string;
  updateTime: string;
}

const SpacePage: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Space[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Space | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取空间列表
  const fetchSpaces = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await contentSpaceApi.getPage({
        current,
        size: pageSize,
        ...params
      });
      
      if (response.code === 200) {
        setDataSource(response.data.records);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取空间列表失败');
      }
    } catch (error) {
      message.error('获取空间列表失败');
      console.error('获取空间列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = () => {
    const values = form.getFieldsValue();
    setCurrent(1);
    fetchSpaces(values);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    fetchSpaces();
  };

  // 新增空间
  const handleAdd = () => {
    setEditingRecord(null);
    modalForm.resetFields();
    setModalVisible(true);
  };

  // 编辑空间
  const handleEdit = (record: Space) => {
    setEditingRecord(record);
    modalForm.setFieldsValue({
      ...record,
      iconColor: record.iconColor,
    });
    setModalVisible(true);
  };

  // 删除空间
  const handleDelete = async (id: number) => {
    try {
      const response = await contentSpaceApi.delete(id);
      if (response.code === 200) {
        message.success('删除空间成功');
        fetchSpaces();
      } else {
        message.error(response.message || '删除空间失败');
      }
    } catch (error) {
      message.error('删除空间失败');
      console.error('删除空间失败:', error);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的空间');
      return;
    }

    try {
      const response = await contentSpaceApi.batchDelete(selectedRowKeys as number[]);
      if (response.code === 200) {
        message.success('批量删除空间成功');
        setSelectedRowKeys([]);
        fetchSpaces();
      } else {
        message.error(response.message || '批量删除空间失败');
      }
    } catch (error) {
      message.error('批量删除空间失败');
      console.error('批量删除空间失败:', error);
    }
  };

  // 更新状态
  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      const response = await contentSpaceApi.updateStatus(id, status);
      if (response.code === 200) {
        message.success('更新状态成功');
        fetchSpaces();
      } else {
        message.error(response.message || '更新状态失败');
      }
    } catch (error) {
      message.error('更新状态失败');
      console.error('更新状态失败:', error);
    }
  };

  // 保存空间
  const handleSave = async () => {
    try {
      const values = await modalForm.validateFields();
      
      // 处理颜色值
      if (values.iconColor && typeof values.iconColor === 'object') {
        values.iconColor = values.iconColor.toHexString();
      }

      let response;
      if (editingRecord) {
        response = await contentSpaceApi.update(editingRecord.id, values);
      } else {
        response = await contentSpaceApi.create(values);
      }

      if (response.code === 200) {
        message.success(editingRecord ? '更新空间成功' : '创建空间成功');
        setModalVisible(false);
        fetchSpaces();
      } else {
        message.error(response.message || '保存空间失败');
      }
    } catch (error) {
      console.error('保存空间失败:', error);
    }
  };

  // 表格列定义
  const columns: ColumnsType<Space> = [
    {
      title: '空间名称',
      dataIndex: 'name',
      width: 120,
      fixed: 'left',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      render: (icon: string, record: Space) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              backgroundColor: record.iconColor,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
            }}
          >
            {icon.charAt(0).toUpperCase()}
          </div>
          <span>{icon}</span>
        </div>
      ),
    },
    {
      title: '图标颜色',
      dataIndex: 'iconColor',
      width: 100,
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: color,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }}
          />
          <span>{color}</span>
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '图片',
      dataIndex: 'image',
      width: 100,
      render: (image: string) => (
        image ? (
          <Image
            width={50}
            height={50}
            src={image}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <span>-</span>
        )
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
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
            onClick={() => handleUpdateStatus(record.id, record.status === 1 ? 0 : 1)}
          >
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
          <Popconfirm
            title="确定要删除这个空间吗？"
            onConfirm={() => handleDelete(record.id)}
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
      ),
    },
  ];

  useEffect(() => {
    fetchSpaces();
  }, [current, pageSize]);

  return (
    <div className="space-page">
      <Card>
        <Form
          form={form}
          layout="inline"
          className="search-form"
          onFinish={handleSearch}
        >
          <Form.Item name="name" label="空间名称">
            <Input placeholder="请输入空间名称" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
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
          <h3>空间列表</h3>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增空间
            </Button>
            <Popconfirm
              title="确定要删除选中的空间吗？"
              onConfirm={handleBatchDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                danger 
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
            </Popconfirm>
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
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
        title={editingRecord ? '编辑空间' : '新增空间'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        width={600}
        destroyOnClose
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={{
            status: 1,
            sort: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="空间名称"
                rules={[{ required: true, message: '请输入空间名称' }]}
              >
                <Input placeholder="请输入空间名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="icon"
                label="图标名称"
                rules={[{ required: true, message: '请输入图标名称' }]}
              >
                <Input placeholder="请输入图标名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="iconColor"
                label="图标颜色"
                rules={[{ required: true, message: '请选择图标颜色' }]}
              >
                <ColorPicker showText />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sort"
                label="排序权重"
                rules={[{ required: true, message: '请输入排序权重' }]}
              >
                <Input type="number" placeholder="数字越大越靠前" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="空间描述"
          >
            <Input.TextArea rows={3} placeholder="请输入空间描述" />
          </Form.Item>

          <Form.Item
            name="image"
            label="空间图片"
          >
            <Input placeholder="请输入图片URL" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SpacePage; 