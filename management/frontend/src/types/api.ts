// API响应基础类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页响应类型
export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 空间类型
export interface Space {
  id: number;
  name: string;
  icon: string;
  iconColor: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

// 问题类型
export interface Problem {
  id: number;
  name: string;
  icon: string;
  description: string;
  spaceId: number;
  createdAt: string;
  updatedAt: string;
}

// 解决方案类型
export interface Solution {
  id: number;
  title: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  spaceId: number;
  problems: string; // JSON字符串
  tags: string; // JSON字符串
  benefits: string;
  materials: string;
  steps: string;
  difficultyLevel: number; // 1-简单，2-中等，3-困难
  timeRequired: string;
  status: boolean;
  isHot: boolean;
  viewCount: number;
  favoriteCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  // 辅助字段
  problemsArray?: number[];
  tagsArray?: string[];
}

// 订单状态枚举
export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// 支付状态枚举
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

// 支付方式枚举
export enum PaymentMethod {
  WECHAT = 'WECHAT',
  ALIPAY = 'ALIPAY'
}

// 订单类型枚举
export enum OrderType {
  SOLUTION = 'SOLUTION',
  PRODUCT = 'PRODUCT',
  MIXED = 'MIXED'
}

// 订单项类型
export interface OrderItem {
  id: number;
  orderId: number;
  itemType: string;
  itemId: number;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// 订单类型
export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  orderType: OrderType;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  actualAmount: number;
  paymentMethod: PaymentMethod;
  paymentTime: string;
  shippingAddressId: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingTime: string;
  deliveryTime: string;
  completionTime: string;
  cancelReason: string;
  cancelTime: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

// 轮播图类型
export interface Banner {
  id: number;
  title: string;
  image: string;
  linkType: string;
  linkValue: string;
  position: string;
  sortOrder: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// 推荐内容类型
export interface Recommendation {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string; // JSON字符串
  sortOrder: number;
  status: boolean;
  isHot: boolean;
  createdAt: string;
  updatedAt: string;
  tagsArray?: string[];
}

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  status: boolean;
  roleId: number;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

// 角色类型
export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  status: number; // 0-禁用，1-启用
  description?: string;
  createdAt: string;
  updatedAt: string;
  createBy?: number;
  updateBy?: number;
  permissions?: Permission[]; // 关联的权限列表
}

// 权限类型
export interface Permission {
  id: number;
  permissionCode: string;
  permissionName: string;
  permissionType: string; // 'menu' | 'button'
  parentId: number;
  menuPath?: string;
  componentPath?: string;
  icon?: string;
  sortOrder: number;
  status: number; // 0-禁用，1-启用
  description?: string;
  createdAt: string;
  updatedAt: string;
  createBy?: number;
  updateBy?: number;
  children?: Permission[]; // 子权限
}

// 管理员用户类型
export interface Admin {
  id: number;
  username: string;
  password?: string;
  realName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: number; // 0-禁用，1-启用
  role: number; // 1-超级管理员，2-普通管理员
  lastLoginTime?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: number; // 0-未删除，1-已删除
  roles?: Role[]; // 关联的角色列表（用于扩展权限）
} 