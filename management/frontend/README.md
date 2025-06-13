# 入舍管理系统前端

基于"入舍"家居轻改造小程序的PC端管理系统，采用现代化的React技术栈开发。

## 🚀 项目概述

"入舍"是一个家居轻改造小程序，核心理念是让用户成为自己的设计师，通过模块化解决方案实现快速、低成本的家居改造。本项目是其配套的PC端管理系统，用于管理小程序的各种业务数据。

## 🛠 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 4
- **UI组件库**: Ant Design 5
- **路由管理**: React Router 6
- **HTTP客户端**: Axios
- **样式方案**: CSS + CSS Modules
- **开发语言**: TypeScript

## ✨ 功能特性

### 🎨 界面设计
- 现代化的PC端界面设计
- 响应式布局，适配不同屏幕尺寸
- 暗黑模式支持
- 粒子动画背景效果
- 玻璃拟态设计风格

### 🔐 认证系统
- 用户登录/登出
- Token自动管理
- 路由权限守卫
- 会话状态持久化

### 📊 仪表盘
- 系统概览统计
- 实时数据展示
- 最近订单列表
- 热门解决方案
- 快速操作入口

### 📝 内容管理
- **空间类型管理**: 客厅、卧室、厨房、卫生间等空间分类
- **问题类型管理**: 收纳不足、采光不良等问题分类
- **解决方案管理**: 核心业务，包含价格、评分、材料、步骤等完整信息
- **轮播图管理**: 首页banner和导航栏轮播图
- **推荐内容管理**: 热门推荐和普通推荐内容

### 📦 订单管理
- 订单列表查看
- 订单状态管理
- 订单详情查看
- 支付状态跟踪
- 物流信息管理

### 👥 用户管理
- 用户信息管理
- 角色权限分配
- RBAC权限控制

### ⚙️ 系统管理
- 系统配置管理
- 操作日志记录
- 权限管理

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── common/         # 通用组件
│   ├── business/       # 业务组件
│   └── layout/         # 布局组件
├── pages/              # 页面目录
│   ├── login/          # 登录页面
│   ├── dashboard/      # 仪表盘
│   ├── content/        # 内容管理
│   ├── order/          # 订单管理
│   ├── user/           # 用户管理
│   └── system/         # 系统管理
├── services/           # 服务层
│   ├── api.ts          # API接口
│   └── request.ts      # HTTP请求封装
├── stores/             # 状态管理
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
├── types/              # 类型定义
├── constants/          # 常量定义
└── styles/             # 样式文件
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🔧 开发指南

### API配置

在 `src/constants/index.ts` 中配置API基础地址：

```typescript
export const API_BASE_URL = 'http://localhost:8081/api';
```

### 添加新页面

1. 在 `src/pages/` 下创建页面目录
2. 创建页面组件和样式文件
3. 在 `src/constants/index.ts` 中添加路由常量
4. 在主布局中添加路由配置

### 添加新API

1. 在 `src/types/api.ts` 中定义数据类型
2. 在 `src/services/api.ts` 中添加API方法
3. 在页面组件中调用API

### 权限控制

使用RBAC权限模型，在 `src/constants/index.ts` 中定义权限代码：

```typescript
export const PERMISSIONS = {
  CONTENT_SPACE_VIEW: 'content:space:view',
  CONTENT_SPACE_CREATE: 'content:space:create',
  // ...
};
```

## 🎯 开发计划

### 已完成 ✅
- [x] 项目基础架构搭建
- [x] 登录系统和路由架构
- [x] 主布局和导航系统
- [x] 仪表盘页面
- [x] API服务层封装
- [x] 类型定义和常量配置

### 进行中 🔄
- [ ] 内容管理页面开发
- [ ] 订单管理页面开发
- [ ] 用户管理页面开发

### 待开发 📋
- [ ] 系统管理页面
- [ ] RBAC权限系统
- [ ] 数据导出功能
- [ ] 批量操作功能
- [ ] 高级搜索功能
- [ ] 数据可视化图表
- [ ] 实时通知系统
- [ ] 操作日志详情
- [ ] 系统监控面板
- [ ] 多语言支持

## 🔗 相关链接

- [后端API文档](../backend/README.md)
- [小程序原型](../../prototype/)
- [需求文档](./need.md)
- [开发计划](./dev-plan.md)

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- 🎉 项目初始化
- ✨ 完成基础架构搭建
- ✨ 实现登录系统
- ✨ 完成主布局设计
- ✨ 实现仪表盘页面
- 🎨 添加粒子动画效果
- 🎨 实现暗黑模式支持

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 团队

- **项目负责人**: [您的姓名]
- **前端开发**: [您的姓名]
- **UI设计**: [设计师姓名]

## 📞 联系我们

如有问题或建议，请通过以下方式联系我们：

- 邮箱: [your-email@example.com]
- 项目地址: [项目仓库地址]
- 问题反馈: [Issues页面地址]
