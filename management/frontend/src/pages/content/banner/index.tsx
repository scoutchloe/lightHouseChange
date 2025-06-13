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
  DatePicker
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
import { contentBannerApi } from '../../../services/api';
import './style.css';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  linkUrl: string;
  linkType: number;
  position: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
  status: number;
  createTime: string;
  updateTime: string;
}

const BannerPage: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Banner[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Banner | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取轮播图列表
  const fetchBanners = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await contentBannerApi.getPage({
        current,
        size: pageSize,
        ...params
      });
      
      if (response.code === 200) {
        setDataSource(response.data.records);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取轮播图列表失败');
      }
    } catch (error) {
      message.error('获取轮播图列表失败');
      console.error('获取轮播图列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = () => {
    const values = form.getFieldsValue();
    const params: any = {};
    
    if (values.title) params.title = values.title;
    if (values.position) params.position = values.position;
    if (values.status !== undefined) params.status = values.status;
    
    setCurrent(1);
    fetchBanners(params);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    fetchBanners();
  };

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    setModalVisible(true);
    modalForm.resetFields();
  };

  // 编辑
  const handleEdit = (record: Banner) => {
    setEditingRecord(record);
    setModalVisible(true);
    modalForm.setFieldsValue({
      ...record,
      dateRange: record.startTime && record.endTime ? [
        dayjs(record.startTime),
        dayjs(record.endTime)
      ] : null
    });
  };

  // 删除
  const handleDelete = async (id: number) => {
    try {
      const response = await contentBannerApi.delete(id);
      if (response.code === 200) {
        message.success('删除成功');
        fetchBanners();
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
      const response = await contentBannerApi.batchDelete(selectedRowKeys as number[]);
      if (response.code === 200) {
        message.success('批量删除成功');
        setSelectedRowKeys([]);
        fetchBanners();
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
      const response = await contentBannerApi.updateStatus(id, status);
      if (response.code === 200) {
        message.success('状态更新成功');
        fetchBanners();
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

      // 处理时间范围
      if (values.dateRange && values.dateRange.length === 2) {
        values.startTime = values.dateRange[0].format('YYYY-MM-DD HH:mm:ss');
        values.endTime = values.dateRange[1].format('YYYY-MM-DD HH:mm:ss');
      }
      delete values.dateRange;

      const response = editingRecord
        ? await contentBannerApi.update(editingRecord.id, values)
        : await contentBannerApi.create(values);

      if (response.code === 200) {
        message.success(editingRecord ? '更新成功' : '创建成功');
        setModalVisible(false);
        fetchBanners();
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

  // 链接类型映射
  const linkTypeMap = {
    0: { text: '无链接', color: 'default' },
    1: { text: '内部链接', color: 'blue' },
    2: { text: '外部链接', color: 'green' }
  };

  // 位置映射
  const positionMap = {
    'home': '首页轮播',
    'category': '分类页轮播',
    'tabbar': '底部导航'
  };

  // 表格列定义
  const columns: ColumnsType<Banner> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      fixed: 'left'
    },
    {
      title: '轮播图标题',
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
      title: '图片',
      dataIndex: 'image',
      width: 120,
      render: (image: string) => (
        image ? (
          <Image
            width={80}
            height={50}
            src={image}
            style={{ borderRadius: 4 }}
            preview={{
              mask: <EyeOutlined />
            }}
          />
        ) : (
          <div style={{ width: 80, height: 50, background: '#f5f5f5', borderRadius: 4 }} />
        )
      )
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: 120,
      render: (position: string) => (
        <Tag color="purple">
          {positionMap[position as keyof typeof positionMap] || position}
        </Tag>
      )
    },
    {
      title: '链接类型',
      dataIndex: 'linkType',
      width: 100,
      render: (linkType: number) => {
        const config = linkTypeMap[linkType as keyof typeof linkTypeMap];
        return config ? (
          <Tag color={config.color}>{config.text}</Tag>
        ) : '-';
      }
    },
    {
      title: '链接地址',
      dataIndex: 'linkUrl',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (text: string) => (
        text ? (
          <Tooltip title={text}>
            <a href={text} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          </Tooltip>
        ) : '-'
      )
    },
    {
      title: '展示时间',
      dataIndex: 'startTime',
      width: 200,
      render: (startTime: string, record: Banner) => (
        <div>
          <div>{dayjs(startTime).format('YYYY-MM-DD HH:mm')}</div>
          <div style={{ color: '#999', fontSize: 12 }}>
            至 {dayjs(record.endTime).format('YYYY-MM-DD HH:mm')}
          </div>
        </div>
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
      render: (status: number, record: Banner) => (
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
            title="确定要删除这个轮播图吗？"
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
    fetchBanners();
  }, [current, pageSize]);

  return (
    <div className="banner-page">
      <Card>
        <Form
          form={form}
          layout="inline"
          className="search-form"
          onFinish={handleSearch}
        >
          <Form.Item name="title" label="轮播图标题">
            <Input placeholder="请输入标题" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item name="position" label="展示位置">
            <Select placeholder="请选择位置" allowClear style={{ width: 150 }}>
              <Option value="home">首页轮播</Option>
              <Option value="category">分类页轮播</Option>
              <Option value="tabbar">底部导航</Option>
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
          <h3>轮播图列表</h3>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增轮播图
            </Button>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个轮播图吗？`}
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
          scroll={{ x: 1400 }}
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
        title={editingRecord ? '编辑轮播图' : '新增轮播图'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        width={700}
        className="banner-modal"
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={{
            status: 1,
            sortOrder: 0,
            linkType: 0,
            position: 'home'
          }}
        >
          <Form.Item
            name="title"
            label="轮播图标题"
            rules={[{ required: true, message: '请输入轮播图标题' }]}
          >
            <Input placeholder="请输入轮播图标题" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            name="image"
            label="图片地址"
            rules={[{ required: true, message: '请输入图片地址' }]}
          >
            <Input placeholder="请输入图片地址" />
          </Form.Item>

          <Form.Item
            name="position"
            label="展示位置"
            rules={[{ required: true, message: '请选择展示位置' }]}
          >
            <Select placeholder="请选择展示位置">
              <Option value="home">首页轮播</Option>
              <Option value="category">分类页轮播</Option>
              <Option value="tabbar">底部导航</Option>
            </Select>
          </Form.Item>

          <Form.Item name="linkType" label="链接类型">
            <Select>
              <Option value={0}>无链接</Option>
              <Option value={1}>内部链接</Option>
              <Option value={2}>外部链接</Option>
            </Select>
          </Form.Item>

          <Form.Item name="linkUrl" label="链接地址">
            <Input placeholder="请输入链接地址" />
          </Form.Item>

          <Form.Item name="dateRange" label="展示时间">
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
            />
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

export default BannerPage; 