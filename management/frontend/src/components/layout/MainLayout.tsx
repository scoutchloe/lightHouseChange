import React, { useState, useEffect } from 'react';
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
import { usePermission } from '../../hooks/usePermission';
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
import TestPermissionPage from '../../pages/test-permission';
import AdminTestPage from '../../pages/admin-test';
import PermissionTestPage from '../../pages/permission-test';
import DebugPermissionsPage from '../../pages/debug-permissions';
import TestRolePermissionPage from '../../pages/test-role-permission';
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

// 菜单项配置（包含权限码）
const menuConfig = [
  {
    key: ROUTES.DASHBOARD,
    icon: <DashboardOutlined />,
    label: '仪表盘',
    permission: 'dashboard:view',
  },
  {
    key: 'content',
    icon: <FileTextOutlined />,
    label: '内容管理',
    permission: 'content:view',
    children: [
      {
        key: ROUTES.CONTENT.SPACES,
        icon: <HomeOutlined />,
        label: '空间管理',
        permission: 'content:space:view',
      },
      {
        key: ROUTES.CONTENT.PROBLEMS,
        icon: <ExclamationCircleOutlined />,
        label: '问题管理',
        permission: 'content:problem:view',
      },
      {
        key: ROUTES.CONTENT.SOLUTIONS,
        icon: <BulbOutlined />,
        label: '解决方案',
        permission: 'content:solution:view',
      },
      {
        key: ROUTES.CONTENT.BANNERS,
        icon: <PictureOutlined />,
        label: '轮播图管理',
        permission: 'content:banner:view',
      },
      {
        key: ROUTES.CONTENT.RECOMMENDATIONS,
        icon: <StarOutlined />,
        label: '推荐内容',
        permission: 'content:recommendation:view',
      },
    ],
  },
  {
    key: 'order',
    icon: <ShoppingCartOutlined />,
    label: '订单管理',
    permission: 'order:view',
    children: [
      {
        key: ROUTES.ORDER.LIST,
        icon: <ShoppingCartOutlined />,
        label: '订单列表',
        permission: 'order:list:view',
      },
    ],
  },
  {
    key: 'user',
    icon: <UserOutlined />,
    label: '用户管理',
    permission: 'user:view',
    children: [
      {
        key: ROUTES.USER.LIST,
        icon: <UserOutlined />,
        label: '用户列表',
        permission: 'user:list:view',
      },
    ],
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    permission: 'system:view',
    children: [
      {
        key: ROUTES.SYSTEM.PERMISSIONS,
        icon: <SafetyOutlined />,
        label: '权限管理',
        permission: 'system:permission:view',
      },
      {
        key: ROUTES.SYSTEM.CONFIG,
        icon: <SettingOutlined />,
        label: '系统配置',
        permission: 'system:config:view',
      },
      {
        key: ROUTES.SYSTEM.OPERATION_LOG,
        icon: <AuditOutlined />,
        label: '操作日志',
        permission: 'system:log:view',
      },
      {
        key: ROUTES.SYSTEM.ADMIN_USER,
        icon: <UserOutlined />,
        label: '管理员管理',
        permission: 'system:admin:view',
      },
    ],
  },
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions, hasPermission, hasAnyPermission, loading } = usePermission();

  // 检查当前用户是否为超级管理员
  const isAdmin = (): boolean => {
    const userInfo = localStorage.getItem('lighthouse_user_info');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.username === 'admin';
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return false;
      }
    }
    return false;
  };

  // 根据权限过滤菜单项
  const filterMenuByPermission = (menuConfig: any[]): any[] => {
    // 如果是超级管理员admin，显示所有菜单
    if (isAdmin()) {
      console.log('超级管理员admin，显示所有菜单');
      return menuConfig.map(item => {
        if (item.children) {
          return {
            ...item,
            children: item.children
          };
        }
        return item;
      });
    }

    return menuConfig.map(item => {
      // 如果没有权限要求，直接显示（如仪表盘）
      if (!item.permission) {
        return item;
      }

      // 如果有子菜单，递归过滤子菜单
      if (item.children) {
        const filteredChildren = filterMenuByPermission(item.children);
        
        // 只要有任意一个子菜单有权限，父菜单就显示
        if (filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren
          };
        }
        
        // 如果没有子菜单权限，但父菜单本身有权限，也显示（但不显示子菜单）
        if (hasPermission(item.permission)) {
          return {
            ...item,
            children: undefined
          };
        }
        
        // 既没有子菜单权限，父菜单也没有权限，不显示
        return null;
      }
      
      // 叶子节点，直接检查权限
      return hasPermission(item.permission) ? item : null;
    }).filter(Boolean);
  };

  // 更新菜单项
  useEffect(() => {
    if (!loading) {
      console.log('开始根据权限过滤菜单...');
      const filteredMenu = filterMenuByPermission(menuConfig);
      console.log('过滤后的菜单:', filteredMenu);
      setMenuItems(filteredMenu);
    }
  }, [loading, permissions]);

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
        localStorage.removeItem('lighthouse_permissions');
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

  // 权限加载中显示
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>加载权限中...</div>
      </div>
    );
  }

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
              
              {/* 测试页面 */}
              <Route path="/test-permission" element={<TestPermissionPage />} />
              <Route path="/admin-test" element={<AdminTestPage />} />
              <Route path="/permission-test" element={<PermissionTestPage />} />
              <Route path="/debug-permissions" element={<DebugPermissionsPage />} />
              <Route path="/test-role-permission" element={<TestRolePermissionPage />} />
            </Routes>
          </div>
        </Content>

        {/* 底部 */}
        <Footer className="main-footer">
          <Text type="secondary">
            © 2025 入舍管理系统. All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 