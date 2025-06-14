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
  Image,
  InputNumber,
  Tooltip,
  Rate
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { contentSolutionApi } from '../../../services/api';
import './style.css';

const { Option } = Select;
const { TextArea } = Input;

interface Solution {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  tags: string;
  difficulty: number;
  estimatedTime: number;
  materials: string;
  tools: string;
  steps: string;
  tips: string;
  rating: number;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  sortOrder: number;
  status: number;
  createTime: string;
  updateTime: string;
}

const SolutionPage: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Solution[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Solution | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取解决方案列表
  const fetchSolutions = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await contentSolutionApi.getPage({
        current,
        size: pageSize,
        ...params
      });
      
      if (response.code === 200) {
        setDataSource(response.data.records);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取解决方案列表失败');
      }
    } catch (error) {
      message.error('获取解决方案列表失败');
      console.error('获取解决方案列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = () => {
    const values = form.getFieldsValue();
    const params: any = {};
    
    if (values.title) params.title = values.title;
    if (values.difficulty) params.difficulty = values.difficulty;
    if (values.status !== undefined) params.status = values.status;
    
    setCurrent(1);
    fetchSolutions(params);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    fetchSolutions();
  };

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    setModalVisible(true);
    modalForm.resetFields();
  };

  // 编辑
  const handleEdit = (record: Solution) => {
    setEditingRecord(record);
    setModalVisible(true);
    modalForm.setFieldsValue({
      ...record,
      tags: record.tags ? record.tags.split(',') : []
    });
  };

  // 删除
  const handleDelete = async (id: number) => {
    try {
      const response = await contentSolutionApi.delete(id);
      if (response.code === 200) {
        message.success('删除成功');
        fetchSolutions();
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
      const response = await contentSolutionApi.batchDelete(selectedRowKeys as number[]);
      if (response.code === 200) {
        message.success('批量删除成功');
        setSelectedRowKeys([]);
        fetchSolutions();
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
      const response = await contentSolutionApi.updateStatus(id, status);
      if (response.code === 200) {
        message.success('状态更新成功');
        fetchSolutions();
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

      // 处理标签
      if (values.tags && Array.isArray(values.tags)) {
        values.tags = values.tags.join(',');
      }

      const response = editingRecord
        ? await contentSolutionApi.update(editingRecord.id, values)
        : await contentSolutionApi.create(values);

      if (response.code === 200) {
        message.success(editingRecord ? '更新成功' : '创建成功');
        setModalVisible(false);
        fetchSolutions();
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

  // 难度等级映射
  const difficultyMap = {
    1: { text: '简单', color: 'green' },
    2: { text: '中等', color: 'orange' },
    3: { text: '困难', color: 'red' }
  };

  // 表格列定义
  const columns: ColumnsType<Solution> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left'
    },
    {
      title: '方案标题',
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
      title: '封面图',
      dataIndex: 'image',
      width: 100,
      render: (image: string) => (
        image ? (
          <Image
            width={60}
            height={40}
            src={image}
            style={{ borderRadius: 4 }}
            preview={{
              mask: <EyeOutlined />
            }}
          />
        ) : (
          <div style={{ width: 60, height: 40, background: '#f5f5f5', borderRadius: 4 }} />
        )
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      render: (tags: string) => (
        tags ? tags.split(',').map((tag, index) => (
          <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
            {tag}
          </Tag>
        )) : '-'
      )
    },
    {
      title: '难度',
      dataIndex: 'difficultyLevel',
      width: 80,
      render: (difficulty: number) => {
        const config = difficultyMap[difficulty as keyof typeof difficultyMap];
        return config ? (
          <Tag color={config.color}>{config.text}</Tag>
        ) : '-';
      }
    },
    {
      title: '预计时间',
      dataIndex: 'timeRequired',
      width: 100,
      render: (time: number) => time ? `${time}分钟` : '-'
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 120,
      render: (rating: number) => (
        <Rate disabled value={rating} style={{ fontSize: 14 }} />
      )
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      width: 80,
      sorter: true
    },
    {
      title: '点赞数',
      dataIndex: 'favoriteCount',
      width: 80,
      sorter: true
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
      render: (status: number, record: Solution) => (
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
            title="确定要删除这个解决方案吗？"
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
    fetchSolutions();
  }, [current, pageSize]);

  return (
    <div className="solution-page">
      <Card>
        <Form
          form={form}
          layout="inline"
          className="search-form"
          onFinish={handleSearch}
        >
          <Form.Item name="title" label="方案标题">
            <Input placeholder="请输入方案标题" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item name="difficulty" label="难度等级">
            <Select placeholder="请选择难度" allowClear style={{ width: 120 }}>
              <Option value={1}>简单</Option>
              <Option value={2}>中等</Option>
              <Option value={3}>困难</Option>
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
          <h3>解决方案列表</h3>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增方案
            </Button>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个方案吗？`}
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
        title={editingRecord ? '编辑解决方案' : '新增解决方案'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={800}
        className="solution-modal"
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={{
            status: 1,
            sortOrder: 0,
            difficulty: 1,
            estimatedTime: 30,
            rating: 5
          }}
        >
          <Form.Item
            name="title"
            label="方案标题"
            rules={[{ required: true, message: '请输入方案标题' }]}
          >
            <Input placeholder="请输入方案标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="方案描述"
            rules={[{ required: true, message: '请输入方案描述' }]}
          >
            <TextArea rows={3} placeholder="请输入方案描述" />
          </Form.Item>

          <Form.Item
            name="content"
            label="详细内容"
            rules={[{ required: true, message: '请输入详细内容' }]}
          >
            <TextArea rows={6} placeholder="请输入详细内容" />
          </Form.Item>

          <Form.Item name="image" label="封面图片">
            <Input placeholder="请输入封面图片URL" />
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              placeholder="请输入标签，按回车添加"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="difficulty" label="难度等级">
            <Select>
              <Option value={1}>简单</Option>
              <Option value={2}>中等</Option>
              <Option value={3}>困难</Option>
            </Select>
          </Form.Item>

          <Form.Item name="estimatedTime" label="预计时间（分钟）">
            <InputNumber min={1} placeholder="请输入预计时间" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="materials" label="所需材料">
            <TextArea rows={3} placeholder="请输入所需材料" />
          </Form.Item>

          <Form.Item name="tools" label="所需工具">
            <TextArea rows={3} placeholder="请输入所需工具" />
          </Form.Item>

          <Form.Item name="steps" label="操作步骤">
            <TextArea rows={4} placeholder="请输入操作步骤" />
          </Form.Item>

          <Form.Item name="tips" label="注意事项">
            <TextArea rows={3} placeholder="请输入注意事项" />
          </Form.Item>

          <Form.Item name="rating" label="推荐评分">
            <Rate />
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

export default SolutionPage; 