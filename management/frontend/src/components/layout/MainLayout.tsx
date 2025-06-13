import React, { useState } from 'react';
import { Layout, Menu, Button, Switch, Avatar, Dropdown, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
  BulbOutlined,
  PictureOutlined,
  StarOutlined,
  LogoutOutlined,
  BellOutlined,
  SafetyOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import DashboardPage from '../../pages/dashboard';
import OperationLogPage from '../../pages/system/operation-log';
import PermissionPage from '../../pages/system/permission';
import SystemConfigPage from '../../pages/system/config';
import AdminUserPage from '../../pages/system/admin-user';
import SpacePage from '../../pages/content/space';
import ProblemPage from '../../pages/content/problem';
import SolutionPage from '../../pages/content/solution';
import BannerPage from '../../pages/content/banner';
import RecommendationPage from '../../pages/content/recommendation';
import './MainLayout.css';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

// 临时页面组件
const TempPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
    <h2>{title}</h2>
    <p>此页面正在开发中...</p>
  </div>
);

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单配置
  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: '内容管理',
      children: [
        {
          key: ROUTES.CONTENT.SPACES,
          icon: <HomeOutlined />,
          label: '空间管理',
        },
        {
          key: ROUTES.CONTENT.PROBLEMS,
          icon: <ExclamationCircleOutlined />,
          label: '问题管理',
        },
        {
          key: ROUTES.CONTENT.SOLUTIONS,
          icon: <BulbOutlined />,
          label: '解决方案',
        },
        {
          key: ROUTES.CONTENT.BANNERS,
          icon: <PictureOutlined />,
          label: '轮播图管理',
        },
        {
          key: ROUTES.CONTENT.RECOMMENDATIONS,
          icon: <StarOutlined />,
          label: '推荐内容',
        },
      ],
    },
    {
      key: 'order',
      icon: <ShoppingCartOutlined />,
      label: '订单管理',
      children: [
        {
          key: ROUTES.ORDER.LIST,
          icon: <ShoppingCartOutlined />,
          label: '订单列表',
        },
      ],
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户管理',
      children: [
        {
          key: ROUTES.USER.LIST,
          icon: <UserOutlined />,
          label: '用户列表',
        },

      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: ROUTES.SYSTEM.PERMISSIONS,
          icon: <SafetyOutlined />,
          label: '权限管理',
        },
        //  {
        //   key: ROUTES.USER.ROLES,
        //   icon: <SettingOutlined />,
        //   label: '角色管理',
        // },
        {
          key: ROUTES.SYSTEM.CONFIG,
          icon: <SettingOutlined />,
          label: '系统配置',
        },
        {
          key: ROUTES.SYSTEM.OPERATION_LOG,
          icon: <AuditOutlined />,
          label: '操作日志',
        },
        {
          key: ROUTES.SYSTEM.ADMIN_USER,
          icon: <UserOutlined />,
          label: '管理员管理',
        },
      ],
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        localStorage.removeItem('lighthouse_token');
        localStorage.removeItem('lighthouse_user_info');
        navigate(ROUTES.LOGIN);
      },
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    // TODO: 实现暗黑模式切换逻辑
  };

  return (
    <Layout className={`main-layout ${darkMode ? 'dark-mode' : ''}`}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        className="main-sider"
      >
        <div className="logo">
          <div className="logo-icon">🏠</div>
          {!collapsed && <span className="logo-text">入舍管理</span>}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="main-menu"
        />
      </Sider>

      <Layout>
        {/* 头部 */}
        <Header className="main-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="collapse-btn"
            />
          </div>

          <div className="header-right">
            <div className="header-item">
              <Text>暗黑模式</Text>
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                size="small"
                style={{ marginLeft: 8 }}
              />
            </div>

            <div className="header-item">
              <Button type="text" icon={<BellOutlined />} />
            </div>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-info">
                <Avatar size="small" icon={<UserOutlined />} />
                <Text className="username">管理员</Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="main-content">
          <div className="content-wrapper">
            <Routes>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              
              {/* 内容管理 */}
              <Route path={ROUTES.CONTENT.SPACES} element={<SpacePage />} />
              <Route path={ROUTES.CONTENT.PROBLEMS} element={<ProblemPage />} />
              <Route path={ROUTES.CONTENT.SOLUTIONS} element={<SolutionPage />} />
              <Route path={ROUTES.CONTENT.BANNERS} element={<BannerPage />} />
              <Route path={ROUTES.CONTENT.RECOMMENDATIONS} element={<RecommendationPage />} />
              
              {/* 订单管理 */}
              <Route path={ROUTES.ORDER.LIST} element={<TempPage title="订单列表" />} />
              
              {/* 用户管理 */}
              <Route path={ROUTES.USER.LIST} element={<TempPage title="用户列表" />} />
              <Route path={ROUTES.USER.ROLES} element={<TempPage title="角色管理" />} />
              
              {/* 系统管理 */}
              <Route path={ROUTES.SYSTEM.PERMISSIONS} element={<PermissionPage />} />
              <Route path={ROUTES.SYSTEM.CONFIG} element={<SystemConfigPage />} />
              <Route path={ROUTES.SYSTEM.OPERATION_LOG} element={<OperationLogPage />} />
              <Route path={ROUTES.SYSTEM.ADMIN_USER} element={<AdminUserPage />} />
            </Routes>
          </div>
        </Content>

        {/* 底部 */}
        <Footer className="main-footer">
          <Text type="secondary">
            © 2024 入舍管理系统. All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 