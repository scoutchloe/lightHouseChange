# 灯塔家居改造小程序

一个基于微信小程序的家居改造解决方案平台，帮助用户发现和解决家居问题。

## 项目结构

```
lightHouseChange/
├── src/                    # 微信小程序前端代码
│   ├── api/               # API接口配置
│   ├── components/        # 公共组件
│   ├── pages/            # 页面文件
│   ├── static/           # 静态资源
│   └── utils/            # 工具函数
├── backend/              # Spring Boot后端服务
│   ├── src/              # Java源代码
│   ├── pom.xml           # Maven配置
│   └── README.md         # 后端说明文档
└── README.md             # 项目说明文档
```

## 功能特性

### 前端功能
- 🏠 **空间管理**: 支持客厅、卧室、厨房、卫生间等空间类型
- 🔍 **问题诊断**: 针对不同空间的常见问题提供解决方案
- 📱 **轮播展示**: 首页轮播图展示热门改造方案
- 💡 **解决方案**: 丰富的家居改造解决方案库
- 👤 **用户中心**: 个人信息管理和历史记录

### 后端功能
- 🚀 **RESTful API**: 提供完整的后端接口服务
- 📊 **数据管理**: 空间、问题、解决方案数据管理
- 🔧 **健康检查**: 系统状态监控和API信息查询
- 📋 **轮播管理**: 首页轮播图内容管理

## 技术栈

### 前端
- **框架**: 微信小程序原生开发
- **UI**: 自定义组件库
- **状态管理**: 页面级状态管理
- **网络请求**: uni.request封装

### 后端
- **框架**: Spring Boot 2.x
- **数据库**: MySQL
- **构建工具**: Maven
- **API文档**: 内置接口文档

## 快速开始

### 前端开发
1. 使用微信开发者工具打开`src`目录
2. 配置后端API地址（默认: http://localhost:8081/api）
3. 编译并预览

### 后端开发
1. 进入backend目录
2. 运行 `mvn spring-boot:run`
3. 访问 http://localhost:8081

## API接口

### 已实现接口
- `GET /api/spaces` - 获取空间类型列表
- `GET /api/problems` - 获取问题类型列表
- `GET /api/banners` - 获取轮播图数据
- `GET /api/health` - 健康检查

### 接口文档
访问后端服务后，可通过以下接口获取API信息：
- `GET /api/health/info` - 获取API详细信息

## 开发状态

- ✅ 基础架构搭建完成
- ✅ 前后端API集成完成
- ✅ 轮播图功能实现
- ✅ 空间和问题管理功能
- 🚧 解决方案详情页面开发中
- 🚧 用户系统开发中

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。 