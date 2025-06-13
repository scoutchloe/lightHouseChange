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
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FireOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { contentRecommendationApi } from '../../../services/api';
import './style.css';

const { Option } = Select;
const { TextArea } = Input;

interface Recommendation {
  id: number;
  title: string;
  description: string;
  content: string;
  image: string;
  tags: string;
  type: string;
  targetId: number;
  targetUrl: string;
  isHot: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  sortOrder: number;
  status: number;
  createTime: string;
  updateTime: string;
}

const RecommendationPage: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Recommendation[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Recommendation | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取推荐内容列表
  const fetchRecommendations = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await contentRecommendationApi.getPage({
        current,
        size: pageSize,
        ...params
      });
      
      if (response.code === 200) {
        setDataSource(response.data.records);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取推荐内容列表失败');
      }
    } catch (error) {
      message.error('获取推荐内容列表失败');
      console.error('获取推荐内容列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = () => {
    const values = form.getFieldsValue();
    const params: any = {};
    
    if (values.title) params.title = values.title;
    if (values.type) params.type = values.type;
    if (values.isHot !== undefined) params.isHot = values.isHot;
    if (values.status !== undefined) params.status = values.status;
    
    setCurrent(1);
    fetchRecommendations(params);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    fetchRecommendations();
  };

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    setModalVisible(true);
    modalForm.resetFields();
  };

  // 编辑
  const handleEdit = (record: Recommendation) => {
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
      const response = await contentRecommendationApi.delete(id);
      if (response.code === 200) {
        message.success('删除成功');
        fetchRecommendations();
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
      const response = await contentRecommendationApi.batchDelete(selectedRowKeys as number[]);
      if (response.code === 200) {
        message.success('批量删除成功');
        setSelectedRowKeys([]);
        fetchRecommendations();
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
      const response = await contentRecommendationApi.updateStatus(id, status);
      if (response.code === 200) {
        message.success('状态更新成功');
        fetchRecommendations();
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
        ? await contentRecommendationApi.update(editingRecord.id, values)
        : await contentRecommendationApi.create(values);

      if (response.code === 200) {
        message.success(editingRecord ? '更新成功' : '创建成功');
        setModalVisible(false);
        fetchRecommendations();
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

  // 推荐类型映射
  const typeMap = {
    'solution': { text: '解决方案', color: 'blue' },
    'article': { text: '文章', color: 'green' },
    'video': { text: '视频', color: 'purple' },
    'product': { text: '商品', color: 'orange' }
  };

  // 表格列定义
  const columns: ColumnsType<Recommendation> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left'
    },
    {
      title: '推荐标题',
      dataIndex: 'title',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (text: string, record: Recommendation) => (
        <div>
          <Tooltip title={text}>
            {record.isHot === 1 && (
              <FireOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
            )}
            {text}
          </Tooltip>
        </div>
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
      title: '推荐类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => {
        const config = typeMap[type as keyof typeof typeMap];
        return config ? (
          <Tag color={config.color}>{config.text}</Tag>
        ) : (
          <Tag>{type}</Tag>
        );
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      render: (tags: string) => (
        tags ? tags.split(',').map((tag, index) => (
          <Tag key={index} color="cyan" style={{ marginBottom: 4 }}>
            {tag}
          </Tag>
        )) : '-'
      )
    },
    {
      title: '热门',
      dataIndex: 'isHot',
      width: 80,
      render: (isHot: number) => (
        <Tag color={isHot === 1 ? 'red' : 'default'}>
          {isHot === 1 ? '热门' : '普通'}
        </Tag>
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
      dataIndex: 'likeCount',
      width: 80,
      sorter: true
    },
    {
      title: '分享数',
      dataIndex: 'shareCount',
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
      render: (status: number, record: Recommendation) => (
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
            title="确定要删除这个推荐内容吗？"
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
    fetchRecommendations();
  }, [current, pageSize]);

  return (
    <div className="recommendation-page">
      <Card>
        <Form
          form={form}
          layout="inline"
          className="search-form"
          onFinish={handleSearch}
        >
          <Form.Item name="title" label="推荐标题">
            <Input placeholder="请输入推荐标题" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item name="type" label="推荐类型">
            <Select placeholder="请选择类型" allowClear style={{ width: 120 }}>
              <Option value="solution">解决方案</Option>
              <Option value="article">文章</Option>
              <Option value="video">视频</Option>
              <Option value="product">商品</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="isHot" label="是否热门">
            <Select placeholder="请选择" allowClear style={{ width: 120 }}>
              <Option value={1}>热门</Option>
              <Option value={0}>普通</Option>
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
          <h3>推荐内容列表</h3>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增推荐
            </Button>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个推荐内容吗？`}
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
        title={editingRecord ? '编辑推荐内容' : '新增推荐内容'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={700}
        className="recommendation-modal"
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={{
            status: 1,
            sortOrder: 0,
            isHot: 0,
            type: 'solution'
          }}
        >
          <Form.Item
            name="title"
            label="推荐标题"
            rules={[{ required: true, message: '请输入推荐标题' }]}
          >
            <Input placeholder="请输入推荐标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="推荐描述"
            rules={[{ required: true, message: '请输入推荐描述' }]}
          >
            <TextArea rows={3} placeholder="请输入推荐描述" />
          </Form.Item>

          <Form.Item name="content" label="详细内容">
            <TextArea rows={5} placeholder="请输入详细内容" />
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

          <Form.Item
            name="type"
            label="推荐类型"
            rules={[{ required: true, message: '请选择推荐类型' }]}
          >
            <Select placeholder="请选择推荐类型">
              <Option value="solution">解决方案</Option>
              <Option value="article">文章</Option>
              <Option value="video">视频</Option>
              <Option value="product">商品</Option>
            </Select>
          </Form.Item>

          <Form.Item name="targetId" label="目标ID">
            <InputNumber min={0} placeholder="请输入目标ID" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="targetUrl" label="目标链接">
            <Input placeholder="请输入目标链接" />
          </Form.Item>

          <Form.Item name="isHot" label="是否热门">
            <Select>
              <Option value={0}>普通</Option>
              <Option value={1}>热门</Option>
            </Select>
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

export default RecommendationPage; 