# 入舍 - 家居轻改造微信小程序后端API

## 项目简介

这是一个基于Spring Boot 3的后端API项目，为"入舍"家居轻改造微信小程序提供数据服务。项目使用Java 21、Maven构建工具和MyBatis-Plus作为数据访问层框架。

## 技术栈

- **Java**: 21
- **Spring Boot**: 3.4.5
- **数据库**: MySQL 8.0
- **ORM框架**: MyBatis-Plus 3.5.5
- **连接池**: HikariCP
- **构建工具**: Maven
- **开发工具**: Lombok

## 项目结构

```
backend/
├── src/main/java/com/lighthouse/
│   ├── HomeRenovationApiApplication.java    # 主应用类
│   ├── config/                              # 配置类
│   │   ├── CorsConfig.java                  # 跨域配置
│   │   └── MyBatisPlusMetaObjectHandler.java # 字段自动填充
│   ├── controller/                          # 控制器层
│   │   ├── HealthController.java            # 健康检查
│   │   ├── SpacesController.java            # 空间接口
│   │   ├── ProblemsController.java          # 问题接口
│   │   ├── BannerController.java            # 轮播图接口
│   │   └── RecommendationController.java    # 推荐内容接口
│   ├── entity/                              # 实体类
│   │   ├── Space.java                       # 空间实体
│   │   ├── Problem.java                     # 问题实体
│   │   ├── Banner.java                      # 轮播图实体
│   │   └── Recommendation.java              # 推荐内容实体
│   ├── mapper/                              # 数据访问层
│   │   ├── SpaceMapper.java                 # 空间Mapper
│   │   ├── ProblemMapper.java               # 问题Mapper
│   │   ├── BannerMapper.java                # 轮播图Mapper
│   │   └── RecommendationMapper.java        # 推荐内容Mapper
│   ├── service/                             # 服务层
│   │   ├── SpaceService.java                # 空间服务接口
│   │   ├── impl/SpaceServiceImpl.java       # 空间服务实现
│   │   ├── ProblemService.java              # 问题服务接口
│   │   ├── impl/ProblemServiceImpl.java     # 问题服务实现
│   │   ├── BannerService.java               # 轮播图服务接口
│   │   ├── impl/BannerServiceImpl.java      # 轮播图服务实现
│   │   ├── RecommendationService.java       # 推荐内容服务接口
│   │   ├── impl/RecommendationServiceImpl.java # 推荐内容服务实现
│   │   └── DataService.java                 # Mock数据服务（已注释）
│   └── common/                              # 通用类
│       └── ApiResponse.java                 # 统一响应格式
├── src/main/resources/
│   ├── application.yml                      # 应用配置
│   ├── sql/init.sql                         # 数据库初始化脚本
│   └── mapper/                              # MyBatis映射文件
│       ├── BannerMapper.xml                 # 轮播图映射
│       └── RecommendationMapper.xml         # 推荐内容映射
├── database/                                # 数据库相关文件
│   ├── README.md                            # 数据库说明
│   └── banner_mock_data.sql                 # 轮播图Mock数据
├── docs/                                    # 文档目录
│   ├── DATABASE_MIGRATION.md               # 数据库迁移说明
│   └── RECOMMENDATION_API_UPDATE.md        # 推荐内容API更新说明
├── backend_development_plan.md              # 后端开发计划
├── pom.xml                                  # Maven配置
└── README.md                                # 项目文档
```

## 数据库配置

### 连接信息
- **地址**: 127.0.0.1:3306
- **数据库**: lightHouse
- **用户名**: root
- **密码**: 123456

### 数据表结构

#### spaces表（空间类型）
```sql
CREATE TABLE spaces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '空间名称',
    icon VARCHAR(50) NOT NULL COMMENT '图标名称',
    icon_color VARCHAR(20) NOT NULL COMMENT '图标颜色',
    description VARCHAR(200) COMMENT '空间描述',
    image VARCHAR(500) COMMENT '空间图片URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### problems表（问题类型）
```sql
CREATE TABLE problems (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '问题名称',
    icon VARCHAR(50) NOT NULL COMMENT '图标名称',
    description VARCHAR(200) COMMENT '问题描述',
    space_id INT NOT NULL COMMENT '所属空间ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES spaces(id)
);
```

#### banner表（轮播图）
```sql
CREATE TABLE banner (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL COMMENT '轮播图标题',
    image VARCHAR(500) NOT NULL COMMENT '轮播图图片URL',
    link VARCHAR(500) COMMENT '跳转链接',
    sort INT DEFAULT 0 COMMENT '排序权重',
    status BOOLEAN DEFAULT TRUE COMMENT '状态：1-启用，0-禁用',
    is_tab_bar BOOLEAN DEFAULT FALSE COMMENT '是否为底部导航栏轮播图',
    description TEXT COMMENT '轮播图描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### recommendation表（推荐内容）
```sql
CREATE TABLE recommendation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL COMMENT '推荐内容标题',
    description TEXT COMMENT '推荐内容描述',
    image VARCHAR(500) COMMENT '推荐内容图片URL',
    tags TEXT COMMENT '标签（JSON格式存储）',
    sort INT DEFAULT 0 COMMENT '排序权重，数字越大越靠前',
    status BOOLEAN DEFAULT TRUE COMMENT '状态：1-启用，0-禁用',
    is_hot BOOLEAN DEFAULT FALSE COMMENT '是否为热门推荐：1-是，0-否',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API接口文档

### 基础信息
- **Base URL**: `http://localhost:8081/api`
- **Content-Type**: `application/json`

### 健康检查接口

#### 1. 基础健康检查
```http
GET /health
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": "API服务运行正常",
    "timestamp": "2024-01-01 12:00:00"
}
```

#### 2. 详细信息
```http
GET /health/info
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "name": "入舍 - 家居轻改造API",
        "version": "1.0.0",
        "description": "为微信小程序提供数据服务",
        "author": "LightHouse Team"
    },
    "timestamp": "2024-01-01 12:00:00"
}
```

### 空间类型接口

#### 1. 获取所有空间类型
```http
GET /spaces
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "客厅",
            "icon": "living-room",
            "iconColor": "#FF6B6B",
            "description": "家庭聚会和休闲的主要场所",
            "image": "https://example.com/images/living-room.jpg",
            "createdAt": "2024-01-01 12:00:00",
            "updatedAt": "2024-01-01 12:00:00"
        }
    ],
    "timestamp": "2024-01-01 12:00:00"
}
```

#### 2. 根据ID获取空间信息
```http
GET /spaces/{id}
```

**路径参数**:
- `id`: 空间ID

### 问题类型接口

#### 1. 根据空间ID获取问题列表（查询参数）
```http
GET /problems?spaceId={spaceId}
```

**查询参数**:
- `spaceId`: 空间ID

#### 2. 根据空间ID获取问题列表（路径参数）
```http
GET /problems/space/{spaceId}
```

**路径参数**:
- `spaceId`: 空间ID

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "空间显得拥挤",
            "icon": "crowded",
            "description": "客厅空间利用不合理，显得拥挤",
            "spaceId": 1,
            "createdAt": "2024-01-01 12:00:00",
            "updatedAt": "2024-01-01 12:00:00"
        }
    ],
    "timestamp": "2024-01-01 12:00:00"
}
```

### 轮播图接口

#### 1. 获取轮播图列表
```http
GET /banners
```

**响应示例**:
```json
{
    "code": 200,
    "message": "获取轮播图成功",
    "data": [
        {
            "id": 1,
            "title": "家居轻改造专家",
            "image": "/images/banners/banner1.jpg",
            "link": "/pages/index/index",
            "sort": 100,
            "status": true,
            "isTabBar": false,
            "description": "专业的家居改造解决方案，让您的家焕然一新",
            "createdAt": "2024-01-01 12:00:00",
            "updatedAt": "2024-01-01 12:00:00"
        }
    ],
    "timestamp": "2024-01-01 12:00:00"
}
```

#### 2. 获取底部导航栏轮播图
```http
GET /banners/tabbar
```

### 推荐内容接口

#### 1. 获取推荐内容列表
```http
GET /recommendations
```

**响应示例**:
```json
{
    "code": 200,
    "message": "获取推荐内容成功",
    "data": [
        {
            "id": 1,
            "title": "小户型照明优化指南",
            "description": "专业设计师总结的5个照明技巧，让小空间更明亮舒适",
            "image": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
            "tags": "[\"光线\", \"小户型\"]",
            "sort": 100,
            "status": true,
            "isHot": true,
            "createdAt": "2024-01-01 12:00:00",
            "updatedAt": "2024-01-01 12:00:00"
        }
    ],
    "timestamp": "2024-01-01 12:00:00"
}
```

#### 2. 获取热门推荐内容
```http
GET /recommendations/hot?limit=3
```

**查询参数**:
- `limit`: 限制返回数量，默认为3

#### 3. 根据ID获取推荐内容详情
```http
GET /recommendations/{id}
```

**路径参数**:
- `id`: 推荐内容ID

#### 4. 创建推荐内容
```http
POST /recommendations
```

**请求体**:
```json
{
    "title": "推荐内容标题",
    "description": "推荐内容描述",
    "image": "图片URL",
    "tags": "[\"标签1\", \"标签2\"]",
    "sort": 100,
    "status": true,
    "isHot": false
}
```

#### 5. 更新推荐内容
```http
PUT /recommendations/{id}
```

#### 6. 删除推荐内容
```http
DELETE /recommendations/{id}
```

## 快速开始

### 1. 环境要求
- Java 21+
- Maven 3.6+
- MySQL 8.0+

### 2. 数据库准备
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE lightHouse DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 执行初始化脚本
mysql -u root -p lightHouse < database/init.sql
```

### 3. 配置文件
修改 `src/main/resources/application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/lightHouse?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 123456
```

### 4. 运行项目
```bash
# 编译项目
mvn clean compile

# 运行项目
mvn spring-boot:run

# 或者打包后运行
mvn clean package
java -jar target/home-renovation-api-1.0.0.jar
```

### 5. 验证服务
访问健康检查接口：
```bash
curl http://localhost:8081/api/health
```

## MyBatis-Plus特性

### 1. 自动填充
- `createdAt`: 插入时自动填充当前时间
- `updatedAt`: 插入和更新时自动填充当前时间

### 2. 分页支持
项目已配置分页插件，支持分页查询功能。

### 3. 条件构造器
使用QueryWrapper进行复杂查询：
```java
QueryWrapper<Space> queryWrapper = new QueryWrapper<>();
queryWrapper.eq("name", "客厅");
Space space = spaceMapper.selectOne(queryWrapper);
```

### 4. 代码生成
MyBatis-Plus提供代码生成器，可快速生成Entity、Mapper、Service等代码。

## 开发说明

### 1. 数据初始化
应用启动时会自动检查数据库，如果为空会初始化基础数据：
- 6个空间类型（客厅、卧室、厨房、卫生间、书房、阳台）
- 24个问题类型（每个空间4个问题）

### 2. 跨域配置
已配置CORS支持，允许前端跨域访问。

### 3. 统一响应格式
所有API接口使用统一的响应格式：
```json
{
    "code": 200,
    "message": "success",
    "data": {},
    "timestamp": "2024-01-01 12:00:00"
}
```

### 4. 错误处理
- 200: 成功
- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误

## 后续开发计划

参考 `backend_development_plan.md` 文件，后续将开发：
- 解决方案管理接口
- 轮播图管理接口
- 用户相关接口
- 文件上传接口
- 数据统计接口

## 更新日志

### v1.2.0 - 2025-06-01
**推荐内容API功能上线**

#### 新增功能
- ✅ 推荐内容管理系统
  - 新增 `recommendation` 数据表
  - 实现推荐内容CRUD操作
  - 支持热门推荐标记功能
  - 支持排序权重管理
  - 支持状态启用/禁用

#### 新增接口
- `GET /recommendations` - 获取推荐内容列表
- `GET /recommendations/hot` - 获取热门推荐内容
- `GET /recommendations/{id}` - 获取推荐内容详情
- `POST /recommendations` - 创建推荐内容
- `PUT /recommendations/{id}` - 更新推荐内容
- `DELETE /recommendations/{id}` - 删除推荐内容

#### 前端集成
- 更新 `getRecommendations()` 接口，从Mock数据改为调用后端API
- 更新 `getHotSolutions(limit)` 接口，从Mock数据改为调用后端API
- 保持数据结构兼容性，确保前端无缝切换

#### 数据库更新
- 新增 `recommendation` 表结构
- 插入6条初始化推荐内容数据
- 包含3条热门推荐内容

#### 技术改进
- 使用MyBatis-Plus自动填充功能
- 实现完整的分层架构（Entity、Mapper、Service、Controller）
- 添加详细的接口文档和使用说明

#### 相关文档
- 新增 `RECOMMENDATION_API_UPDATE.md` - 详细更新说明
- 更新 `backend_development_plan.md` - 标记完成状态
- 更新 `README.md` - 添加接口文档

### v1.1.0 - 2024-01-04
**数据库集成和轮播图功能**

#### 新增功能
- ✅ MyBatis-Plus完整集成
- ✅ 数据库表结构设计（space、problem、banner）
- ✅ 轮播图管理系统
- ✅ 字段自动填充功能

#### 新增接口
- 轮播图CRUD操作
- 底部导航栏轮播图
- 数据库版本的空间和问题接口

### v1.0.0 - 2024-01-01
**项目初始化**

#### 基础功能
- ✅ Spring Boot 3项目架构
- ✅ 统一响应格式
- ✅ 跨域配置
- ✅ 健康检查接口
- ✅ 空间类型和问题类型Mock接口

## 联系方式

如有问题，请联系开发团队。