# 入舍 - 家居轻改造微信小程序后端API

## 项目简介

本项目是"入舍 - 家居轻改造微信小程序"的后端API服务，基于Spring Boot 3和Java 21开发，提供家居改造相关的数据接口。

## 技术栈

- **Java**: 21
- **Spring Boot**: 3.2.0
- **Maven**: 项目管理工具
- **Lombok**: 简化Java代码
- **Jackson**: JSON处理

## 项目结构

```
backend/
├── src/main/java/com/lighthouse/
│   ├── HomeRenovationApiApplication.java    # 主应用类
│   ├── common/
│   │   └── ApiResponse.java                 # 统一响应格式
│   ├── config/
│   │   └── CorsConfig.java                  # 跨域配置
│   ├── controller/
│   │   ├── HealthController.java            # 健康检查控制器
│   │   ├── SpaceController.java             # 空间相关接口
│   │   └── ProblemController.java           # 问题相关接口
│   ├── entity/
│   │   ├── Space.java                       # 空间实体
│   │   └── Problem.java                     # 问题实体
│   └── service/
│       └── DataService.java                 # 数据服务类
├── src/main/resources/
│   └── application.yml                      # 应用配置
├── pom.xml                                  # Maven配置
└── README.md                                # 项目文档
```

## 快速开始

### 环境要求

- Java 21+
- Maven 3.6+

### 运行项目

1. **克隆项目**
   ```bash
   cd backend
   ```

2. **编译项目**
   ```bash
   mvn clean compile
   ```

3. **运行项目**
   ```bash
   mvn spring-boot:run
   ```

4. **访问服务**
   - 服务地址: http://localhost:8081/api
   - 健康检查: http://localhost:8081/api/health
   - API信息: http://localhost:8081/api/health/info

## API接口文档

### 基础信息

- **Base URL**: `http://localhost:8081/api`
- **响应格式**: JSON
- **字符编码**: UTF-8

### 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1703123456789
}
```

### 接口列表

#### 1. 健康检查

**GET** `/health`

**响应示例**:
```json
{
  "code": 200,
  "message": "服务运行正常",
  "data": {
    "status": "UP",
    "service": "入舍 - 家居轻改造API",
    "version": "1.0.0",
    "timestamp": "2023-12-21 10:30:45"
  },
  "timestamp": 1703123456789
}
```

#### 2. 获取所有空间类型

**GET** `/spaces`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取空间类型成功",
  "data": [
    {
      "id": 1,
      "name": "客厅",
      "icon": "tv",
      "iconColor": "#22C55E",
      "description": "适合社交、休闲的多功能空间",
      "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ],
  "timestamp": 1703123456789
}
```

#### 3. 根据ID获取空间信息

**GET** `/spaces/{id}`

**路径参数**:
- `id`: 空间ID

**响应示例**:
```json
{
  "code": 200,
  "message": "获取空间信息成功",
  "data": {
    "id": 1,
    "name": "客厅",
    "icon": "tv",
    "iconColor": "#22C55E",
    "description": "适合社交、休闲的多功能空间",
    "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  "timestamp": 1703123456789
}
```

#### 4. 根据空间ID获取问题列表

**GET** `/problems?spaceId={spaceId}`

**查询参数**:
- `spaceId`: 空间ID

**响应示例**:
```json
{
  "code": 200,
  "message": "获取问题列表成功",
  "data": [
    {
      "id": 101,
      "name": "收纳不足",
      "icon": "inbox",
      "description": "东西太多没地方放，空间显得凌乱",
      "spaceId": 1
    }
  ],
  "timestamp": 1703123456789
}
```

#### 5. 根据空间ID获取问题列表（路径参数）

**GET** `/problems/space/{spaceId}`

**路径参数**:
- `spaceId`: 空间ID

**响应示例**: 同上

## 开发说明

### 数据来源

当前版本使用内存中的模拟数据，数据来源于前端项目的 `mock.js` 文件。后续版本将接入真实数据库。

### 日志配置

- 开发环境：DEBUG级别
- 生产环境：WARN级别
- 日志格式：`%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n`

### 跨域配置

已配置允许所有来源的跨域请求，支持微信小程序调用。

## 部署说明

### 打包项目

```bash
mvn clean package
```

### 运行JAR包

```bash
java -jar target/home-renovation-api-1.0.0.jar
```

### Docker部署（可选）

```dockerfile
FROM openjdk:21-jdk-slim
COPY target/home-renovation-api-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 版本历史

- **v1.0.0** (2023-12-21)
  - 初始版本
  - 实现空间和问题相关接口
  - 提供模拟数据服务

## 联系方式

- 作者: lighthouse
- 项目: 入舍 - 家居轻改造微信小程序 