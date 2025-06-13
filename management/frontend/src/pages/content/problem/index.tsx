import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Modal,
  message,
  Popconfirm,
  Switch,
  Tag,
  Upload,
  Image,
  InputNumber,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { contentProblemApi, contentSpaceApi } from '../../../services/api';
import './style.css';

const { Option } = Select;
const { TextArea } = Input;

interface Problem {
  id: number;
  spaceId: number;
  spaceName: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  sortOrder: number;
  status: number;
  createTime: string;
  updateTime: string;
}

interface Space {
  id: number;
  name: string;
  icon: string;
  iconColor: string;
}

const ProblemPage: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Problem[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Problem | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取空间列表
  const fetchSpaces = async () => {
    try {
      const response = await contentSpaceApi.getList();
      if (response.code === 200) {
        setSpaces(response.data);
      }
    } catch (error) {
      console.error('获取空间列表失败:', error);
    }
  };

  // 获取问题列表
  const fetchProblems = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await contentProblemApi.getPage({
        current,
        size: pageSize,
        ...params
      });
      
      if (response.code === 200) {
        setDataSource(response.data.records);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取问题列表失败');
      }
    } catch (error) {
      message.error('获取问题列表失败');
      console.error('获取问题列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = () => {
    const values = form.getFieldsValue();
    const params: any = {};
    
    if (values.title) params.title = values.title;
    if (values.spaceId) params.spaceId = values.spaceId;
    if (values.status !== undefined) params.status = values.status;
    
    setCurrent(1);
    fetchProblems(params);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    fetchProblems();
  };

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    setModalVisible(true);
    modalForm.resetFields();
  };

  // 编辑
  const handleEdit = (record: Problem) => {
    setEditingRecord(record);
    setModalVisible(true);
    modalForm.setFieldsValue({
      ...record,
      spaceId: record.spaceId
    });
  };

  // 删除
  const handleDelete = async (id: number) => {
    try {
      const response = await contentProblemApi.delete(id);
      if (response.code === 200) {
        message.success('删除成功');
        fetchProblems();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }

    try {
      const response = await contentProblemApi.batchDelete(selectedRowKeys as number[]);
      if (response.code === 200) {
        message.success('批量删除成功');
        setSelectedRowKeys([]);
        fetchProblems();
      } else {
        message.error(response.message || '批量删除失败');
      }
    } catch (error) {
      message.error('批量删除失败');
      console.error('批量删除失败:', error);
    }
  };

  // 状态切换
  const handleStatusChange = async (id: number, status: number) => {
    try {
      const response = await contentProblemApi.updateStatus(id, status);
      if (response.code === 200) {
        message.success('状态更新成功');
        fetchProblems();
      } else {
        message.error(response.message || '状态更新失败');
      }
    } catch (error) {
      message.error('状态更新失败');
      console.error('状态更新失败:', error);
    }
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await modalForm.validateFields();
      setModalLoading(true);

      const response = editingRecord
        ? await contentProblemApi.update(editingRecord.id, values)
        : await contentProblemApi.create(values);

      if (response.code === 200) {
        message.success(editingRecord ? '更新成功' : '创建成功');
        setModalVisible(false);
        fetchProblems();
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('保存失败');
      console.error('保存失败:', error);
    } finally {
      setModalLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<Problem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left'
    },
    {
      title: '所属空间',
      dataIndex: 'spaceName',
      width: 120,
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '问题标题',
      dataIndex: 'title',
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
      title: '问题描述',
      dataIndex: 'description',
      width: 250,
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
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      render: (icon: string) => (
        icon ? (
          <Image
            width={32}
            height={32}
            src={icon}
            style={{ borderRadius: 4 }}
            preview={{
              mask: <EyeOutlined />
            }}
          />
        ) : (
          <div style={{ width: 32, height: 32, background: '#f5f5f5', borderRadius: 4 }} />
        )
      )
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      width: 80,
      sorter: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number, record: Problem) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked ? 1 : 0)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      )
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
      width: 150,
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
          <Popconfirm
            title="确定要删除这个问题吗？"
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
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  useEffect(() => {
    fetchSpaces();
    fetchProblems();
  }, [current, pageSize]);

  return (
    <div className="problem-page">
      <Card>
        <Form
          form={form}
          layout="inline"
          className="search-form"
          onFinish={handleSearch}
        >
          <Form.Item name="title" label="问题标题">
            <Input placeholder="请输入问题标题" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item name="spaceId" label="所属空间">
            <Select placeholder="请选择空间" allowClear style={{ width: 150 }}>
              {spaces.map(space => (
                <Option key={space.id} value={space.id}>
                  {space.name}
                </Option>
              ))}
            </Select>
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
          <h3>问题列表</h3>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增问题
            </Button>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个问题吗？`}
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: 1200 }}
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
        title={editingRecord ? '编辑问题' : '新增问题'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={600}
        className="problem-modal"
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={{
            status: 1,
            sortOrder: 0,
            iconColor: '#1890ff'
          }}
        >
          <Form.Item
            name="spaceId"
            label="所属空间"
            rules={[{ required: true, message: '请选择所属空间' }]}
          >
            <Select placeholder="请选择空间">
              {spaces.map(space => (
                <Option key={space.id} value={space.id}>
                  {space.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="问题标题"
            rules={[{ required: true, message: '请输入问题标题' }]}
          >
            <Input placeholder="请输入问题标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="问题描述"
            rules={[{ required: true, message: '请输入问题描述' }]}
          >
            <TextArea rows={4} placeholder="请输入问题描述" />
          </Form.Item>

          <Form.Item name="icon" label="问题图标">
            <Input placeholder="请输入图标URL" />
          </Form.Item>

          <Form.Item name="iconColor" label="图标颜色">
            <Input type="color" style={{ width: 100 }} />
          </Form.Item>

          <Form.Item name="sortOrder" label="排序">
            <InputNumber min={0} placeholder="请输入排序值" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="status" label="状态">
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

export default ProblemPage; 