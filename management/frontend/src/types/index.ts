// 导出所有类型定义
export * from './api';

// 通用类型定义
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  permission?: string; // 权限代码
}

// 表格列配置
export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: any, index: number) => React.ReactNode;
  sorter?: boolean;
  filters?: Array<{ text: string; value: any }>;
}

// 表单字段配置
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'upload' | 'number';
  required?: boolean;
  rules?: any[];
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  disabled?: boolean;
}

// 搜索表单配置
export interface SearchForm {
  fields: FormField[];
  onSearch: (values: any) => void;
  onReset: () => void;
}

// 操作按钮配置
export interface ActionButton {
  key: string;
  label: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  danger?: boolean;
  icon?: string;
  permission?: string;
  onClick: (record?: any) => void;
}

// 页面配置
export interface PageConfig {
  title: string;
  breadcrumb?: string[];
  showBack?: boolean;
  actions?: ActionButton[];
}

// 主题配置
export interface ThemeConfig {
  primaryColor: string;
  darkMode: boolean;
  sidebarCollapsed: boolean;
}

// 用户状态
export interface UserState {
  isLoggedIn: boolean;
  userInfo: any;
  token: string;
  permissions: string[];
  roles: string[];
}

// 应用状态
export interface AppState {
  theme: ThemeConfig;
  user: UserState;
  loading: boolean;
  error: string | null;
} 