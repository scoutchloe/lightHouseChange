import { http } from './request';
import type {
  Space,
  Problem,
  Solution,
  Order,
  Banner,
  Recommendation,
  User,
  Role,
  Permission,
  PageResponse,
} from '../types';

// 认证相关API
export const authApi = {
  // 登录
  login: (data: { username: string; password: string }) =>
    http.post<{ token: string; adminInfo: any }>('/auth/login', data),
  
  // 登出
  logout: () => http.post('/auth/logout'),
  
  // 获取用户信息
  getUserInfo: () => http.get<any>('/auth/userinfo'),
  
  // 获取当前用户权限
  getUserPermissions: () => http.get<Permission[]>('/auth/permissions'),
};

// 空间类型API
export const spaceApi = {
  // 获取空间列表
  getList: () => http.get<Space[]>('/spaces'),
  
  // 获取空间详情
  getDetail: (id: number) => http.get<Space>(`/spaces/${id}`),
  
  // 创建空间
  create: (data: Partial<Space>) => http.post<Space>('/spaces', data),
  
  // 更新空间
  update: (id: number, data: Partial<Space>) => http.put<Space>(`/spaces/${id}`, data),
  
  // 删除空间
  delete: (id: number) => http.delete(`/spaces/${id}`),
};

// 问题类型API
export const problemApi = {
  // 获取问题列表
  getList: (spaceId?: number) => 
    http.get<Problem[]>('/problems', { params: { spaceId } }),
  
  // 根据空间ID获取问题列表
  getBySpaceId: (spaceId: number) => 
    http.get<Problem[]>(`/problems/space/${spaceId}`),
  
  // 获取问题详情
  getDetail: (id: number) => http.get<Problem>(`/problems/${id}`),
  
  // 创建问题
  create: (data: Partial<Problem>) => http.post<Problem>('/problems', data),
  
  // 更新问题
  update: (id: number, data: Partial<Problem>) => http.put<Problem>(`/problems/${id}`, data),
  
  // 删除问题
  delete: (id: number) => http.delete(`/problems/${id}`),
};

// 解决方案API
export const solutionApi = {
  // 获取解决方案列表（分页）
  getList: (params: {
    page?: number;
    pageSize?: number;
    spaceId?: number;
    keyword?: string;
  }) => http.get<{ records: Solution[]; total: number; size: number; current: number; pages: number }>('/solutions', { params }),
  
  // 获取热门解决方案
  getHotList: (limit?: number) => 
    http.get<Solution[]>('/solutions/hot', { params: { limit } }),
  
  // 获取解决方案详情
  getDetail: (id: number) => http.get<Solution>(`/solutions/${id}`),
  
  // 创建解决方案
  create: (data: Partial<Solution>) => http.post<Solution>('/solutions', data),
  
  // 更新解决方案
  update: (id: number, data: Partial<Solution>) => http.put<Solution>(`/solutions/${id}`, data),
  
  // 删除解决方案
  delete: (id: number) => http.delete(`/solutions/${id}`),
  
  // 增加收藏
  addFavorite: (id: number) => http.post(`/solutions/${id}/favorite`),
  
  // 取消收藏
  removeFavorite: (id: number) => http.delete(`/solutions/${id}/favorite`),
};

// 订单API
export const orderApi = {
  // 获取订单列表（分页）
  getList: (params: {
    page?: number;
    size?: number;
    userId?: number;
    orderStatus?: string;
  }) => http.get<PageResponse<Order>>('/orders', { params }),
  
  // 根据用户ID获取订单列表
  getByUserId: (userId: number, page = 1, size = 10) =>
    http.get<PageResponse<Order>>(`/orders/user/${userId}`, { params: { page, size } }),
  
  // 根据用户ID和状态获取订单列表
  getByUserIdAndStatus: (userId: number, orderStatus: string, page = 1, size = 10) =>
    http.get<PageResponse<Order>>(`/orders/user/${userId}/status/${orderStatus}`, { params: { page, size } }),
  
  // 获取订单详情
  getDetail: (id: number) => http.get<Order>(`/orders/${id}`),
  
  // 根据订单号获取订单详情
  getByOrderNo: (orderNo: string) => http.get<Order>(`/orders/orderNo/${orderNo}`),
  
  // 创建订单
  create: (data: Partial<Order>) => http.post<Order>('/orders', data),
  
  // 更新订单状态
  updateStatus: (id: number, orderStatus: string) =>
    http.put<boolean>(`/orders/${id}/status`, null, { params: { orderStatus } }),
  
  // 更新支付状态
  updatePaymentStatus: (id: number, paymentStatus: string) =>
    http.put<boolean>(`/orders/${id}/payment`, null, { params: { paymentStatus } }),
  
  // 取消订单
  cancel: (id: number, cancelReason?: string) =>
    http.put<boolean>(`/orders/${id}/cancel`, null, { params: { cancelReason } }),
  
  // 发货
  ship: (id: number, data: { trackingNumber?: string; shippingCompany?: string }) =>
    http.put<boolean>(`/orders/${id}/ship`, data),
  
  // 确认收货
  confirmDelivery: (id: number) => http.put<boolean>(`/orders/${id}/delivery`),
};

// 轮播图API
export const bannerApi = {
  // 获取轮播图列表
  getList: () => http.get<Banner[]>('/banners'),
  
  // 获取底部导航栏轮播图
  getTabBarList: () => http.get<Banner[]>('/banners/tabbar'),
  
  // 获取轮播图详情
  getDetail: (id: number) => http.get<Banner>(`/banners/${id}`),
  
  // 创建轮播图
  create: (data: Partial<Banner>) => http.post<Banner>('/banners', data),
  
  // 更新轮播图
  update: (id: number, data: Partial<Banner>) => http.put<Banner>(`/banners/${id}`, data),
  
  // 删除轮播图
  delete: (id: number) => http.delete(`/banners/${id}`),
};

// 推荐内容API
export const recommendationApi = {
  // 获取推荐内容列表
  getList: () => http.get<Recommendation[]>('/recommendations'),
  
  // 获取热门推荐内容
  getHotList: (limit?: number) => 
    http.get<Recommendation[]>('/recommendations/hot', { params: { limit } }),
  
  // 获取推荐内容详情
  getDetail: (id: number) => http.get<Recommendation>(`/recommendations/${id}`),
  
  // 创建推荐内容
  create: (data: Partial<Recommendation>) => http.post<Recommendation>('/recommendations', data),
  
  // 更新推荐内容
  update: (id: number, data: Partial<Recommendation>) => http.put<Recommendation>(`/recommendations/${id}`, data),
  
  // 删除推荐内容
  delete: (id: number) => http.delete(`/recommendations/${id}`),
};

// 用户管理API（预留，后端暂未实现）
export const userApi = {
  // 获取用户列表
  getList: (params: {
    page?: number;
    size?: number;
    keyword?: string;
    status?: boolean;
  }) => http.get<PageResponse<User>>('/users', { params }),
  
  // 获取用户详情
  getDetail: (id: number) => http.get<User>(`/users/${id}`),
  
  // 创建用户
  create: (data: Partial<User>) => http.post<User>('/users', data),
  
  // 更新用户
  update: (id: number, data: Partial<User>) => http.put<User>(`/users/${id}`, data),
  
  // 删除用户
  delete: (id: number) => http.delete(`/users/${id}`),
  
  // 重置密码
  resetPassword: (id: number, newPassword: string) =>
    http.put(`/users/${id}/password`, { newPassword }),
};

// 角色管理API
export const roleApi = {
  // 分页查询角色
  getPage: (params: {
    current?: number;
    size?: number;
    roleName?: string;
    roleCode?: string;
    status?: number;
  }) => http.get<PageResponse<Role>>('/system/role/page', { params }),
  
  // 获取所有角色列表
  getList: () => http.get<Role[]>('/system/role/list'),
  
  // 获取角色详情（包含权限信息）
  getDetail: (id: number) => http.get<Role>(`/system/role/${id}`),
  
  // 创建角色
  create: (data: Partial<Role>) => http.post<any>('/system/role', data),
  
  // 更新角色
  update: (data: Partial<Role>) => http.put<any>('/system/role', data),
  
  // 删除角色
  delete: (id: number) => http.delete<any>(`/system/role/${id}`),
  
  // 分配角色权限
  assignPermissions: (data: { roleId: number; permissionIds: number[] }) =>
    http.post<any>('/system/role/assign-permissions', data),
};

// 权限管理API
export const permissionApi = {
  // 获取权限树
  getTree: () => http.get<Permission[]>('/system/permission/tree'),
  
  // 分页查询权限
  getPage: (params: {
    current?: number;
    size?: number;
    permissionName?: string;
    permissionType?: number;
    status?: number;
  }) => http.get<PageResponse<Permission>>('/system/permission/page', { params }),
  
  // 获取权限详情
  getDetail: (id: number) => http.get<Permission>(`/system/permission/${id}`),
  
  // 创建权限
  create: (data: Partial<Permission>) => http.post<any>('/system/permission', data),
  
  // 更新权限
  update: (data: Partial<Permission>) => http.put<any>('/system/permission', data),
  
  // 删除权限
  delete: (id: number) => http.delete<any>(`/system/permission/${id}`),
};

// 健康检查API
export const healthApi = {
  // 基础健康检查
  check: () => http.get<string>('/health'),
  
  // 详细信息
  info: () => http.get<any>('/health/info'),
};

// 操作日志API
export const operationLogApi = {
  // 分页查询操作日志
  getOperationLogPage: (params: {
    current?: number;
    size?: number;
    module?: string;
    operationType?: string;
    adminUsername?: string;
    startTime?: string;
    endTime?: string;
  }) => http.get<{
    records: any[];
    total: number;
    size: number;
    current: number;
    pages: number;
  }>('/operation-log/page', { params }),
  
  // 获取操作日志详情
  getOperationLogById: (id: number) => http.get<any>(`/operation-log/${id}`),
  
  // 清理过期日志
  cleanExpiredLogs: (days: number) => http.delete(`/operation-log/clean/${days}`),
};

// 管理员用户API
export const adminUserApi = {
  // 分页查询管理员用户
  getAdminUserPage: (params: {
    current?: number;
    size?: number;
    username?: string;
    realName?: string;
    status?: number;
    role?: number;
  }) => http.get<{
    records: any[];
    total: number;
    size: number;
    current: number;
    pages: number;
  }>('/admin-user/page', { params }),
  
  // 获取管理员用户详情
  getAdminUserById: (id: number) => http.get<any>(`/admin-user/${id}`),
  
  // 创建管理员用户
  createAdminUser: (data: any) => http.post<any>('/admin-user', data),
  
  // 更新管理员用户
  updateAdminUser: (id: number, data: any) => http.put<any>(`/admin-user/${id}`, data),
  
  // 删除管理员用户
  deleteAdminUser: (id: number) => http.delete(`/admin-user/${id}`),
  
  // 重置密码
  resetPassword: (id: number, newPassword: string) => 
    http.put(`/admin-user/${id}/reset-password`, null, { params: { newPassword } }),
  
  // 检查用户名是否可用
  checkUsername: (username: string) => http.get<boolean>(`/admin-user/check-username`, { params: { username } }),
  
  // 检查邮箱是否可用
  checkEmail: (email: string) => http.get<boolean>(`/admin-user/check-email`, { params: { email } }),
  
  // 检查手机号是否可用
  checkPhone: (phone: string) => http.get<boolean>(`/admin-user/check-phone`, { params: { phone } }),
  
  // 获取用户角色
  getUserRoles: (id: number) => http.get<any[]>(`/admin-user/${id}/roles`),
  
  // 分配用户角色
  assignRoles: (id: number, roleIds: number[]) => 
    http.put(`/admin-user/${id}/roles`, { roleIds }),
};

// 系统配置API
export const systemConfigApi = {
  // 获取系统配置
  getConfig: (configType?: string) => http.get<any>('/system/config', { params: { configType } }),
  
  // 保存系统配置
  saveConfig: (data: any) => http.post<boolean>('/system/config', data),
  
  // 测试邮件配置
  testEmail: (data: any) => http.post<boolean>('/system/config/test-email', data),
  
  // 获取存储配置
  getStorageConfig: () => http.get<any>('/system/config/storage'),
  
  // 保存存储配置
  saveStorageConfig: (data: any) => http.post<boolean>('/system/config/storage', data),
};

// 文件上传API（预留）
export const uploadApi = {
  // 上传文件
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return http.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// ==================== 内容管理API ====================

// 空间管理API
export const contentSpaceApi = {
  // 分页查询空间列表
  getPage: (params: any) => http.get('/content/space/page', { params }),
  // 获取空间详情
  getById: (id: number) => http.get(`/content/space/${id}`),
  // 创建空间
  create: (data: any) => http.post('/content/space', data),
  // 更新空间
  update: (id: number, data: any) => http.put(`/content/space/${id}`, data),
  // 删除空间
  delete: (id: number) => http.delete(`/content/space/${id}`),
  // 批量删除空间
  batchDelete: (ids: number[]) => http.delete('/content/space/batch', { data: ids }),
  // 更新空间状态
  updateStatus: (id: number, status: number) => 
    http.put(`/content/space/${id}/status?status=${status}`),
  // 获取所有空间列表
  getList: () => http.get('/content/space/list'),
};

// 问题管理API
export const contentProblemApi = {
  // 分页查询问题列表
  getPage: (params: any) => http.get('/content/problem/page', { params }),
  // 获取问题详情
  getById: (id: number) => http.get(`/content/problem/${id}`),
  // 创建问题
  create: (data: any) => http.post('/content/problem', data),
  // 更新问题
  update: (id: number, data: any) => http.put(`/content/problem/${id}`, data),
  // 删除问题
  delete: (id: number) => http.delete(`/content/problem/${id}`),
  // 批量删除问题
  batchDelete: (ids: number[]) => http.delete('/content/problem/batch', { data: ids }),
  // 更新问题状态
  updateStatus: (id: number, status: number) => 
    http.put(`/content/problem/${id}/status?status=${status}`),
  // 根据空间ID获取问题列表
  getBySpaceId: (spaceId: number) => http.get(`/content/problem/space/${spaceId}`),
};

// 解决方案管理API
export const contentSolutionApi = {
  // 分页查询解决方案列表
  getPage: (params: any) => http.get('/content/solution/page', { params }),
  // 获取解决方案详情
  getById: (id: number) => http.get(`/content/solution/${id}`),
  // 创建解决方案
  create: (data: any) => http.post('/content/solution', data),
  // 更新解决方案
  update: (id: number, data: any) => http.put(`/content/solution/${id}`, data),
  // 删除解决方案
  delete: (id: number) => http.delete(`/content/solution/${id}`),
  // 批量删除解决方案
  batchDelete: (ids: number[]) => http.delete('/content/solution/batch', { data: ids }),
  // 更新解决方案状态
  updateStatus: (id: number, status: number) => 
    http.put(`/content/solution/${id}/status?status=${status}`),
};

// 轮播图管理API
export const contentBannerApi = {
  // 分页查询轮播图列表
  getPage: (params: any) => http.get('/content/banner/page', { params }),
  // 获取轮播图详情
  getById: (id: number) => http.get(`/content/banner/${id}`),
  // 创建轮播图
  create: (data: any) => http.post('/content/banner', data),
  // 更新轮播图
  update: (id: number, data: any) => http.put(`/content/banner/${id}`, data),
  // 删除轮播图
  delete: (id: number) => http.delete(`/content/banner/${id}`),
  // 批量删除轮播图
  batchDelete: (ids: number[]) => http.delete('/content/banner/batch', { data: ids }),
  // 更新轮播图状态
  updateStatus: (id: number, status: number) => 
    http.put(`/content/banner/${id}/status?status=${status}`),
};

// 推荐内容管理API
export const contentRecommendationApi = {
  // 分页查询推荐内容列表
  getPage: (params: any) => http.get('/content/recommendation/page', { params }),
  // 获取推荐内容详情
  getById: (id: number) => http.get(`/content/recommendation/${id}`),
  // 创建推荐内容
  create: (data: any) => http.post('/content/recommendation', data),
  // 更新推荐内容
  update: (id: number, data: any) => http.put(`/content/recommendation/${id}`, data),
  // 删除推荐内容
  delete: (id: number) => http.delete(`/content/recommendation/${id}`),
  // 批量删除推荐内容
  batchDelete: (ids: number[]) => http.delete('/content/recommendation/batch', { data: ids }),
  // 更新推荐内容状态
  updateStatus: (id: number, status: number) => 
    http.put(`/content/recommendation/${id}/status?status=${status}`),
}; 