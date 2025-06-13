# 入舍管理端后端

## 项目简介

入舍管理端后端是一个基于Spring Boot的RESTful API服务，为入舍家装小程序的管理端提供数据支持。

## 功能特性

### 已完成功能
- ✅ 管理员认证系统
  - 管理员登录/退出
  - JWT令牌认证
  - 密码加密存储
  - 登录日志记录

- ✅ 操作日志系统
  - AOP自动记录操作日志
  - 详细记录操作信息（IP、浏览器、执行时间等）
  - 敏感信息过滤
  - 异步日志记录
  - 分页查询和筛选
  - 定时清理过期日志

- ✅ 基础架构
  - 统一响应格式
  - 全局异常处理
  - 参数校验
  - API文档集成(Knife4j)
  - 跨域配置
  - 异步任务支持
  - 定时任务支持

### 待开发功能
- 🔄 内容管理
  - 空间类型管理
  - 问题类型管理
  - 解决方案管理
  - 轮播图管理

- 🔄 订单管理
  - 订单列表查询
  - 订单状态管理
  - 订单详情查看

- 🔄 用户管理
  - 用户列表查询
  - 用户状态管理
  - 用户行为分析

- 🔄 系统管理
  - 管理员管理
  - 角色权限管理
  - 系统配置管理

## 技术栈

- **框架**: Spring Boot 3.5.0
- **数据库**: MySQL 8.0
- **ORM**: MyBatis-Plus 3.5.12
- **安全**: Spring Security 6.5.0
- **认证**: JWT (jjwt 0.12.6)
- **连接池**: HikariCP 6.3.0
- **文档**: Knife4j 4.6.0
- **构建工具**: Maven 3.9+
- **JDK版本**: Java 21

## 快速开始

### 环境要求
- JDK 21+
- Maven 3.9+
- MySQL 8.0+

### 数据库配置

1. 创建数据库
```sql
CREATE DATABASE managementlightHouse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 执行建表脚本
```bash
# 在MySQL中执行以下脚本文件
src/main/resources/sql/admin.sql
src/main/resources/sql/operation_log.sql
```

### 启动步骤

1. 克隆项目
```bash
git clone <repository-url>
cd management/backend
```

2. 修改数据库配置
```yaml
# src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/managementlightHouse?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 123456
```

3. 编译项目
```bash
mvn clean compile
```

4. 启动服务
```bash
mvn spring-boot:run
```

5. 访问API文档
```
http://localhost:8082/api/doc.html
```

### 默认管理员账户
- 用户名: `admin`
- 密码: `admin123`

## API接口

### 认证接口
- `POST /api/auth/login` - 管理员登录
- `POST /api/auth/logout` - 管理员退出

### 操作日志接口
- `GET /api/operation-log/page` - 分页查询操作日志
- `GET /api/operation-log/{id}` - 查询操作日志详情
- `DELETE /api/operation-log/clean` - 清理过期日志

### 测试接口
- `GET /api/test/health` - 健康检查

## 项目结构

```
src/main/java/com/nextera/managelighthouse/
├── common/              # 通用类
│   └── Result.java      # 统一响应结果
├── config/              # 配置类
│   ├── MybatisPlusConfig.java
│   └── SecurityConfig.java
├── controller/          # 控制器
│   ├── AuthController.java
│   └── TestController.java
├── dto/                 # 数据传输对象
│   ├── LoginRequest.java
│   └── LoginResponse.java
├── entity/              # 实体类
│   └── Admin.java
├── exception/           # 异常处理
│   └── GlobalExceptionHandler.java
├── mapper/              # 数据访问层
│   └── AdminMapper.java
├── service/             # 服务层
│   ├── AdminService.java
│   └── impl/
│       └── AdminServiceImpl.java
└── util/                # 工具类
    └── JwtUtil.java
```

## 开发规范

### 代码规范
- 使用Lombok简化代码
- 统一使用Result包装响应数据
- 异常统一通过GlobalExceptionHandler处理
- 使用@Valid进行参数校验

### 数据库规范
- 表名使用下划线命名
- 字段名使用下划线命名
- 必须包含create_time、update_time字段
- 软删除使用is_deleted字段

### API规范
- RESTful风格设计
- 统一使用/api前缀
- 使用Swagger注解完善文档
- 返回状态码遵循HTTP标准

## 部署说明

### 生产环境配置
1. 修改application.yml中的profile为prod
2. 配置生产环境数据库连接
3. 修改JWT密钥
4. 配置日志级别

### Docker部署
```dockerfile
# 待补充Docker配置
```

## 常见问题

### Q: 启动时提示数据库连接失败？
A: 请检查MySQL服务是否启动，数据库配置是否正确。

### Q: JWT令牌验证失败？
A: 请检查JWT密钥配置，确保前后端使用相同的密钥。

### Q: API文档无法访问？
A: 请确认服务已启动，访问地址为 http://localhost:8082/api/doc.html

## 更新日志

### v0.1.0 (2025-06-13)
- 初始化项目结构
- 完成管理员认证功能
- 集成JWT认证
- 添加API文档支持
- 完成基础架构搭建
- 完成操作日志系统
  - AOP自动记录操作日志
  - 异步日志处理
  - 分页查询和筛选
  - 定时清理过期日志 