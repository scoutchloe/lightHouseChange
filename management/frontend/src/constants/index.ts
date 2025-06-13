// API相关常量
export const API_BASE_URL = 'http://localhost:8082/api';

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'lighthouse_token',
  USER_INFO: 'lighthouse_user_info',
  THEME: 'lighthouse_theme',
  PERMISSIONS: 'lighthouse_permissions',
} as const;

// 路由路径
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CONTENT: {
    SPACES: '/content/spaces',
    PROBLEMS: '/content/problems',
    SOLUTIONS: '/content/solutions',
    BANNERS: '/content/banners',
    RECOMMENDATIONS: '/content/recommendations',
  },
  ORDER: {
    LIST: '/order/list',
    DETAIL: '/order/detail',
  },
  USER: {
    LIST: '/user/list',
    ROLES: '/user/roles',
  },
  SYSTEM: {
    PERMISSIONS: '/system/permissions',
    CONFIG: '/system/config',
    LOGS: '/system/logs',
    OPERATION_LOG: '/system/operation-log',
    ADMIN_USER: '/system/admin-user',
  },
} as const;

// 订单状态映射
export const ORDER_STATUS_MAP = {
  PENDING_PAYMENT: { label: '待付款', color: 'orange' },
  PAID: { label: '已付款', color: 'blue' },
  SHIPPED: { label: '已发货', color: 'cyan' },
  DELIVERED: { label: '已送达', color: 'purple' },
  COMPLETED: { label: '已完成', color: 'green' },
  CANCELLED: { label: '已取消', color: 'red' },
  REFUNDED: { label: '已退款', color: 'gray' },
} as const;

// 支付状态映射
export const PAYMENT_STATUS_MAP = {
  UNPAID: { label: '未支付', color: 'orange' },
  PAID: { label: '已支付', color: 'green' },
  REFUNDED: { label: '已退款', color: 'red' },
} as const;

// 支付方式映射
export const PAYMENT_METHOD_MAP = {
  WECHAT: { label: '微信支付', icon: 'wechat' },
  ALIPAY: { label: '支付宝', icon: 'alipay' },
} as const;

// 订单类型映射
export const ORDER_TYPE_MAP = {
  SOLUTION: { label: '方案订单', color: 'blue' },
  PRODUCT: { label: '商品订单', color: 'green' },
  MIXED: { label: '混合订单', color: 'purple' },
} as const;

// 难度等级映射
export const DIFFICULTY_LEVEL_MAP = {
  1: { label: '简单', color: 'green' },
  2: { label: '中等', color: 'orange' },
  3: { label: '困难', color: 'red' },
} as const;

// 表格分页配置
export const TABLE_PAGE_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
} as const;

// 上传文件配置
export const UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptTypes: ['image/jpeg', 'image/png', 'image/gif'],
  action: `${API_BASE_URL}/upload`,
} as const;

// 主题色配置
export const THEME_COLORS = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#1890ff',
} as const;

// 菜单图标映射
export const MENU_ICONS = {
  dashboard: 'DashboardOutlined',
  content: 'FileTextOutlined',
  order: 'ShoppingCartOutlined',
  user: 'UserOutlined',
  system: 'SettingOutlined',
  spaces: 'HomeOutlined',
  problems: 'ExclamationCircleOutlined',
  solutions: 'BulbOutlined',
  banners: 'PictureOutlined',
  recommendations: 'StarOutlined',
} as const;

// 权限代码
export const PERMISSIONS = {
  // 内容管理
  CONTENT_SPACE_VIEW: 'content:space:view',
  CONTENT_SPACE_CREATE: 'content:space:create',
  CONTENT_SPACE_UPDATE: 'content:space:update',
  CONTENT_SPACE_DELETE: 'content:space:delete',
  
  CONTENT_PROBLEM_VIEW: 'content:problem:view',
  CONTENT_PROBLEM_CREATE: 'content:problem:create',
  CONTENT_PROBLEM_UPDATE: 'content:problem:update',
  CONTENT_PROBLEM_DELETE: 'content:problem:delete',
  
  CONTENT_SOLUTION_VIEW: 'content:solution:view',
  CONTENT_SOLUTION_CREATE: 'content:solution:create',
  CONTENT_SOLUTION_UPDATE: 'content:solution:update',
  CONTENT_SOLUTION_DELETE: 'content:solution:delete',
  
  // 订单管理
  ORDER_VIEW: 'order:view',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  ORDER_EXPORT: 'order:export',
  
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // 系统管理
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOG: 'system:log',
  SYSTEM_PERMISSION: 'system:permission',
} as const; 