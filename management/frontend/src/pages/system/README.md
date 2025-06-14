# 系统管理模块

本模块实现了完整的 RBAC（基于角色的访问控制）系统，包含权限管理、角色管理、用户管理等功能。

## 功能模块

### 1. 权限管理 (`/system/permission`)

- 📋 权限列表查看
- ➕ 新增权限
- ✏️ 编辑权限
- 🗑️ 删除权限
- 🌳 权限树形结构展示
- 🏷️ 权限类型标识（菜单/按钮）

### 2. 角色管理 (`/system/role`)

- 📋 角色列表分页查询
- 🔍 角色搜索（支持角色名称、角色编码、状态筛选）
- ➕ 新增角色
- ✏️ 编辑角色
- 🗑️ 删除角色
- 🛡️ 角色权限分配
- 🎛️ 角色状态管理

**核心功能：**
- 权限分配：使用树形选择器为角色分配权限
- 状态管理：支持启用/禁用角色
- 数据验证：角色编码格式验证

### 3. 用户管理 (`/system/admin-user`)

- 📋 管理员用户列表
- ➕ 新增管理员
- ✏️ 编辑用户信息
- 🗑️ 删除用户
- 🔐 重置密码
- 👥 用户角色分配

## 组件架构

### 核心组件

#### 1. PermissionTree 组件 (`/components/PermissionTree`)
权限树组件，支持：
- 🌳 树形结构展示权限
- ☑️ 可选择模式（checkbox）
- 🏷️ 权限类型标识
- 📊 权限状态显示
- 📱 自适应高度

#### 2. PermissionControl 组件 (`/components/common/PermissionControl`)
权限控制组件，支持：
- 🛡️ 单个权限验证
- 👥 多权限验证（任意/全部）
- 🚫 无权限时的替代内容
- 🔧 灵活的权限配置

#### 3. RouteGuard 组件 (`/components/common/RouteGuard`)
路由权限守卫，支持：
- 🛡️ 路由级权限控制
- 🚫 403 页面展示
- 🔄 重定向处理
- ⏳ 加载状态处理

### Hooks

#### usePermission Hook (`/hooks/usePermission.ts`)
权限管理钩子，提供：
- 🔍 `hasPermission(code)` - 单权限检查
- 👥 `hasAnyPermission(codes)` - 任意权限检查
- 🛡️ `hasAllPermissions(codes)` - 全部权限检查
- 🔄 `refreshPermissions()` - 刷新权限

## 权限配置

### 权限码规范

```typescript
// 系统管理模块权限
'system:permission:list'    // 权限查询
'system:permission:add'     // 权限新增
'system:permission:edit'    // 权限修改
'system:permission:delete'  // 权限删除

'system:role:list'     // 角色查询
'system:role:add'      // 角色新增
'system:role:edit'     // 角色修改
'system:role:delete'   // 角色删除
'system:role:auth'     // 角色授权

'system:user:list'     // 用户查询
'system:user:add'      // 用户新增
'system:user:edit'     // 用户修改
'system:user:delete'   // 用户删除
'system:user:reset'    // 重置密码
'system:user:role'     // 用户授权
```

## 使用示例

### 1. 在组件中使用权限控制

```tsx
import PermissionControl from '@/components/common/PermissionControl';

// 单个权限控制
<PermissionControl permission="system:role:add">
  <Button>新增角色</Button>
</PermissionControl>

// 多权限控制（任意一个）
<PermissionControl permissions={['system:role:add', 'system:role:edit']}>
  <Button>操作按钮</Button>
</PermissionControl>

// 多权限控制（需要全部）
<PermissionControl 
  permissions={['system:role:add', 'system:role:edit']} 
  requireAll={true}
>
  <Button>高级操作</Button>
</PermissionControl>
```

### 2. 在路由中使用权限守卫

```tsx
import RouteGuard from '@/components/common/RouteGuard';

<RouteGuard permission="system:role:list">
  <RoleManagement />
</RouteGuard>
```

### 3. 在钩子中使用权限检查

```tsx
import { usePermission } from '@/hooks/usePermission';

const MyComponent = () => {
  const { hasPermission, hasAnyPermission } = usePermission();
  
  const canAdd = hasPermission('system:role:add');
  const canOperate = hasAnyPermission(['system:role:add', 'system:role:edit']);
  
  return (
    <div>
      {canAdd && <Button>新增</Button>}
      {canOperate && <Button>操作</Button>}
    </div>
  );
};
```

## API 接口

### 角色管理 API

- `GET /system/role/page` - 分页查询角色
- `GET /system/role/list` - 获取角色列表
- `GET /system/role/{id}` - 获取角色详情
- `POST /system/role` - 创建角色
- `PUT /system/role` - 更新角色
- `DELETE /system/role/{id}` - 删除角色
- `POST /system/role/assign-permissions` - 分配角色权限

### 权限管理 API

- `GET /system/permission/tree` - 获取权限树
- `GET /system/permission/page` - 分页查询权限
- `GET /system/permission/{id}` - 获取权限详情
- `POST /system/permission` - 创建权限
- `PUT /system/permission` - 更新权限
- `DELETE /system/permission/{id}` - 删除权限

## 样式定制

每个页面都有对应的样式文件：
- `permission/style.css` - 权限管理页面样式
- `role/style.css` - 角色管理页面样式
- `admin-user/style.css` - 用户管理页面样式

支持响应式设计，在移动端有良好的展示效果。

## 数据库表结构调整

### 从 sys_user 迁移到 admin 表

为了更好地区分管理端用户和普通用户，系统已将管理端用户表从 `sys_user` 迁移到 `admin` 表：

#### 主要变更：
1. **用户表**：`sys_user` → `admin`
2. **关联表**：`sys_user_role` → `admin_role`
3. **字段调整**：
   - 新增 `avatar` 字段（头像）
   - 新增 `role` 字段（内置角色：1-超级管理员，2-普通管理员）
   - 新增 `last_login_time` 字段（最后登录时间）
   - 新增 `last_login_ip` 字段（最后登录IP）
   - 新增 `is_deleted` 字段（软删除标记）

#### 类型定义更新：
```typescript
// 新的管理员用户类型
interface Admin {
  id: number;
  username: string;
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
  isDeleted?: number;
  roles?: Role[]; // 扩展权限角色
}
```

#### API 调整：
- 所有用户相关的 API 现在使用 `admin` 表
- 角色分配 API 支持为管理员分配多个角色
- 新增用户角色查询和分配接口

## 注意事项

1. **权限加载**：页面初始化时会自动加载用户权限
2. **实时更新**：权限变更后需要刷新页面或调用 `refreshPermissions()`
3. **错误处理**：所有 API 调用都有完善的错误处理
4. **类型安全**：使用 TypeScript 确保类型安全
5. **性能优化**：权限树组件支持虚拟滚动，处理大量数据无压力
6. **数据迁移**：从 sys_user 迁移到 admin 表时，需要执行相应的数据迁移脚本 