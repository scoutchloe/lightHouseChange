import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Button, Space } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  BulbOutlined,
  HomeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { orderApi, solutionApi, spaceApi } from '../../services/api';
import { ORDER_STATUS_MAP } from '../../constants';
import type { Order, Solution } from '../../types';
import './style.css';

const { Title, Text } = Typography;

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalSolutions: number;
  totalSpaces: number;
  todayOrders: number;
  monthlyRevenue: number;
}

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalSolutions: 0,
    totalSpaces: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [hotSolutions, setHotSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 并行加载数据
      const [ordersRes, solutionsRes, spacesRes, hotSolutionsRes] = await Promise.all([
        orderApi.getList({ page: 1, size: 10 }),
        solutionApi.getList({ page: 1, pageSize: 10 }),
        spaceApi.getList(),
        solutionApi.getHotList(5),
      ]);

      // 模拟统计数据（实际应该从后端获取）
      setStats({
        totalUsers: 1250,
        totalOrders: ordersRes.data.total || 0,
        totalSolutions: solutionsRes.data.total || 0,
        totalSpaces: spacesRes.data.length || 0,
        todayOrders: 23,
        monthlyRevenue: 125600,
      });

      setRecentOrders(ordersRes.data.records || []);
      setHotSolutions(hotSolutionsRes.data || []);
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 统计卡片配置
  const statsCards = [
    {
      title: '总用户数',
      value: stats.totalUsers,
      icon: <UserOutlined />,
      color: '#1890ff',
      suffix: '人',
      trend: { value: 12.5, isUp: true },
    },
    {
      title: '总订单数',
      value: stats.totalOrders,
      icon: <ShoppingCartOutlined />,
      color: '#52c41a',
      suffix: '单',
      trend: { value: 8.2, isUp: true },
    },
    {
      title: '解决方案',
      value: stats.totalSolutions,
      icon: <BulbOutlined />,
      color: '#faad14',
      suffix: '个',
      trend: { value: 3.1, isUp: false },
    },
    {
      title: '空间类型',
      value: stats.totalSpaces,
      icon: <HomeOutlined />,
      color: '#722ed1',
      suffix: '个',
      trend: { value: 0, isUp: true },
    },
  ];

  // 订单表格列配置
  const orderColumns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      render: (text: string) => <Text copyable>{text}</Text>,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      render: (status: string) => {
        const statusInfo = ORDER_STATUS_MAP[status as keyof typeof ORDER_STATUS_MAP];
        return statusInfo ? (
          <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
        ) : (
          <Tag>{status}</Tag>
        );
      },
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => `¥${amount?.toFixed(2) || '0.00'}`,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <Title level={2}>仪表盘</Title>
        <Text type="secondary">欢迎回来，这里是系统概览</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stats-row">
        {statsCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="stats-card" loading={loading}>
              <div className="stats-content">
                <div className="stats-icon" style={{ backgroundColor: card.color }}>
                  {card.icon}
                </div>
                <div className="stats-info">
                  <Statistic
                    title={card.title}
                    value={card.value}
                    suffix={card.suffix}
                    valueStyle={{ fontSize: 24, fontWeight: 600 }}
                  />
                  <div className="stats-trend">
                    {card.trend.isUp ? (
                      <ArrowUpOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: '#f5222d' }} />
                    )}
                    <Text
                      type={card.trend.isUp ? 'success' : 'danger'}
                      style={{ marginLeft: 4 }}
                    >
                      {card.trend.value}%
                    </Text>
                    <Text type="secondary" style={{ marginLeft: 4 }}>
                      较上月
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* 最近订单 */}
        <Col xs={24} lg={16}>
          <Card
            title="最近订单"
            extra={<Button type="link">查看全部</Button>}
            className="recent-orders-card"
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              loading={loading}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        {/* 热门解决方案 */}
        <Col xs={24} lg={8}>
          <Card
            title="热门解决方案"
            extra={<Button type="link">查看全部</Button>}
            className="hot-solutions-card"
          >
            <div className="solutions-list">
              {hotSolutions.map((solution, index) => (
                <div key={solution.id} className="solution-item">
                  <div className="solution-rank">{index + 1}</div>
                  <div className="solution-info">
                    <Text strong className="solution-title">
                      {solution.title}
                    </Text>
                    <div className="solution-meta">
                      <Text type="secondary">¥{solution.price}</Text>
                      <Text type="secondary">评分: {solution.rating}</Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="快速操作" className="quick-actions-card">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8} md={6} lg={4}>
                <Button type="primary" block size="large">
                  新增空间
                </Button>
              </Col>
              <Col xs={12} sm={8} md={6} lg={4}>
                <Button block size="large">
                  新增问题
                </Button>
              </Col>
              <Col xs={12} sm={8} md={6} lg={4}>
                <Button block size="large">
                  新增方案
                </Button>
              </Col>
              <Col xs={12} sm={8} md={6} lg={4}>
                <Button block size="large">
                  订单管理
                </Button>
              </Col>
              <Col xs={12} sm={8} md={6} lg={4}>
                <Button block size="large">
                  用户管理
                </Button>
              </Col>
              <Col xs={12} sm={8} md={6} lg={4}>
                <Button block size="large">
                  系统设置
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 