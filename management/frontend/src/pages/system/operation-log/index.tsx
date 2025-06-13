import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Descriptions,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { operationLogApi } from '../../../services/api';
import './style.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OperationLog {
  id: number;
  adminId: number;
  adminUsername: string;
  module: string;
  operationType: string;
  operationDesc: string;
  requestMethod: string;
  requestUrl: string;
  requestParams: string;
  responseResult: string;
  status: number;
  errorMsg: string;
  operationIp: string;
  operationLocation: string;
  browser: string;
  os: string;
  executionTime: number;
  operationTime: string;
  createTime: string;
}

const OperationLogPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<OperationLog[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OperationLog | null>(null);

  // 安全的JSON解析函数
  const safeJsonParse = (jsonString: string): string => {
    if (!jsonString) return '{}';
    
    try {
      // 先尝试解析JSON
      const parsed = JSON.parse(jsonString);
      // 如果解析成功，重新格式化输出
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      // 如果解析失败，直接返回原始字符串
      console.warn('JSON解析失败:', error);
      return jsonString;
    }
  };

  // 操作类型选项
  const operationTypes = [
    { label: '新增', value: 'CREATE' },
    { label: '修改', value: 'UPDATE' },
    { label: '删除', value: 'DELETE' },
    { label: '查询', value: 'QUERY' },
    { label: '登录', value: 'LOGIN' },
    { label: '退出', value: 'LOGOUT' },
    { label: '导出', value: 'EXPORT' },
    { label: '导入', value: 'IMPORT' },
    { label: '其他', value: 'OTHER' }
  ];

  // 模块选项
  const modules = [
    { label: '认证管理', value: '认证管理' },
    { label: '用户管理', value: '用户管理' },
    { label: '订单管理', value: '订单管理' },
    { label: '内容管理', value: '内容管理' },
    { label: '系统管理', value: '系统管理' },
    { label: '操作日志', value: '操作日志' }
  ];

  // 获取操作日志列表
  const fetchOperationLogs = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await operationLogApi.getOperationLogPage({
        current,
        size: pageSize,
        ...params
      });
      
      if (response.code === 200) {
        setDataSource(response.data.records);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '获取操作日志失败');
      }
    } catch (error) {
      message.error('获取操作日志失败');
      console.error('获取操作日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const handleSearch = () => {
    const values = form.getFieldsValue();
    const params: any = {};
    
    if (values.module) params.module = values.module;
    if (values.operationType) params.operationType = values.operationType;
    if (values.adminUsername) params.adminUsername = values.adminUsername;
    if (values.dateRange && values.dateRange.length === 2) {
      params.startTime = values.dateRange[0].format('YYYY-MM-DD');
      params.endTime = values.dateRange[1].format('YYYY-MM-DD');
    }
    
    setCurrent(1);
    fetchOperationLogs(params);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setCurrent(1);
    fetchOperationLogs();
  };

  // 查看详情
  const handleViewDetail = (record: OperationLog) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 清理过期日志
  const handleCleanLogs = async () => {
    try {
      const response = await operationLogApi.cleanExpiredLogs(30);
      if (response.code === 200) {
        message.success('清理过期日志成功');
        handleSearch();
      } else {
        message.error(response.message || '清理过期日志失败');
      }
    } catch (error) {
      message.error('清理过期日志失败');
      console.error('清理过期日志失败:', error);
    }
  };

  // 表格列定义
  const columns: ColumnsType<OperationLog> = [
    {
      title: '操作人',
      dataIndex: 'adminUsername',
      width: 100,
      fixed: 'left'
    },
    {
      title: '操作模块',
      dataIndex: 'module',
      width: 100
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      width: 80,
      render: (type: string) => {
        const colors: Record<string, string> = {
          CREATE: 'green',
          UPDATE: 'blue',
          DELETE: 'red',
          QUERY: 'default',
          LOGIN: 'purple',
          LOGOUT: 'orange',
          EXPORT: 'cyan',
          IMPORT: 'magenta'
        };
        const typeMap: Record<string, string> = {
          CREATE: '新增',
          UPDATE: '修改',
          DELETE: '删除',
          QUERY: '查询',
          LOGIN: '登录',
          LOGOUT: '退出',
          EXPORT: '导出',
          IMPORT: '导入'
        };
        return <Tag color={colors[type] || 'default'}>{typeMap[type] || type}</Tag>;
      }
    },
    {
      title: '操作描述',
      dataIndex: 'operationDesc',
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
      title: '请求方法',
      dataIndex: 'requestMethod',
      width: 80,
      render: (method: string) => {
        const colors: Record<string, string> = {
          GET: 'blue',
          POST: 'green',
          PUT: 'orange',
          DELETE: 'red'
        };
        return <Tag color={colors[method] || 'default'}>{method}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '成功' : '失败'}
        </Tag>
      )
    },
    {
      title: 'IP地址',
      dataIndex: 'operationIp',
      width: 120
    },
    {
      title: '地理位置',
      dataIndex: 'operationLocation',
      width: 100
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 120,
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
      title: '执行时间',
      dataIndex: 'executionTime',
      width: 100,
      render: (time: number) => `${time}ms`
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      width: 160,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
        </Space>
      )
    }
  ];

  useEffect(() => {
    fetchOperationLogs();
  }, [current, pageSize]);

  return (
    <div className="operation-log-page">
      <Card>
        <Form
          form={form}
          layout="inline"
          className="search-form"
          onFinish={handleSearch}
        >
          <Form.Item name="module" label="操作模块">
            <Select placeholder="请选择模块" allowClear style={{ width: 120 }}>
              {modules.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="operationType" label="操作类型">
            <Select placeholder="请选择类型" allowClear style={{ width: 120 }}>
              {operationTypes.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="adminUsername" label="操作人">
            <Input placeholder="请输入操作人" style={{ width: 120 }} />
          </Form.Item>
          
          <Form.Item name="dateRange" label="操作时间">
            <RangePicker />
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
          <h3>操作日志列表</h3>
          <Space>
            <Button icon={<ExportOutlined />}>
              导出
            </Button>
            <Popconfirm
              title="确定要清理30天前的操作日志吗？"
              onConfirm={handleCleanLogs}
              okText="确定"
              cancelText="取消"
            >
              <Button icon={<DeleteOutlined />} danger>
                清理过期日志
              </Button>
            </Popconfirm>
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
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

      {/* 详情弹窗 */}
      <Modal
        title="操作日志详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
        className="detail-modal"
      >
        {selectedRecord && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="操作人" span={1}>
              {selectedRecord.adminUsername}
            </Descriptions.Item>
            <Descriptions.Item label="操作模块" span={1}>
              {selectedRecord.module}
            </Descriptions.Item>
            <Descriptions.Item label="操作类型" span={1}>
              <Tag color={selectedRecord.operationType === 'LOGIN' ? 'purple' : 'blue'}>
                {selectedRecord.operationType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="操作状态" span={1}>
              <Tag color={selectedRecord.status === 1 ? 'success' : 'error'}>
                {selectedRecord.status === 1 ? '成功' : '失败'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="操作描述" span={2}>
              {selectedRecord.operationDesc}
            </Descriptions.Item>
            <Descriptions.Item label="请求方法" span={1}>
              <Tag color="blue">{selectedRecord.requestMethod}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="请求URL" span={1}>
              {selectedRecord.requestUrl}
            </Descriptions.Item>
            <Descriptions.Item label="IP地址" span={1}>
              {selectedRecord.operationIp}
            </Descriptions.Item>
            <Descriptions.Item label="地理位置" span={1}>
              {selectedRecord.operationLocation}
            </Descriptions.Item>
            <Descriptions.Item label="浏览器" span={1}>
              {selectedRecord.browser}
            </Descriptions.Item>
            <Descriptions.Item label="操作系统" span={1}>
              {selectedRecord.os}
            </Descriptions.Item>
            <Descriptions.Item label="执行时间" span={1}>
              {selectedRecord.executionTime}ms
            </Descriptions.Item>
            <Descriptions.Item label="操作时间" span={1}>
              {dayjs(selectedRecord.operationTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            {selectedRecord.requestParams && (
              <Descriptions.Item label="请求参数" span={2}>
                <pre className="json-content">
                  {safeJsonParse(selectedRecord.requestParams)}
                </pre>
              </Descriptions.Item>
            )}
            {selectedRecord.responseResult && (
              <Descriptions.Item label="响应结果" span={2}>
                <pre className="json-content">
                  {safeJsonParse(selectedRecord.responseResult)}
                </pre>
              </Descriptions.Item>
            )}
            {selectedRecord.errorMsg && (
              <Descriptions.Item label="错误信息" span={2}>
                <span style={{ color: '#ff4d4f' }}>{selectedRecord.errorMsg}</span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OperationLogPage; 