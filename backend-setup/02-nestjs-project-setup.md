# Step 2: 创建 NestJS 项目

## 1. 安装 NestJS CLI

```bash
npm install -g @nestjs/cli
```

验证安装：
```bash
nest --version
```

---

## 2. 创建项目

```bash
# 进入你想放置后端项目的目录
cd /Users/yang/Desktop/study

# 创建 NestJS 项目
nest new tt-admin-backend

# 选择 npm 或 yarn (推荐 npm)
```

---

## 3. 安装必要依赖

```bash
cd tt-admin-backend

# 数据库相关
npm install @nestjs/typeorm typeorm pg

# 认证相关
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
npm install bcryptjs
npm install -D @types/bcryptjs @types/passport-jwt @types/passport-local

# 配置相关
npm install @nestjs/config

# 验证相关
npm install class-validator class-transformer

# Swagger API 文档
npm install @nestjs/swagger
```

---

## 4. 项目结构规划

创建以下目录结构：

```bash
# 创建模块目录
mkdir -p src/modules/auth
mkdir -p src/modules/users
mkdir -p src/common/guards
mkdir -p src/common/interceptors
mkdir -p src/common/decorators
mkdir -p src/config
```

最终结构：
```
tt-admin-backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   └── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   └── user.entity.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── decorators/
│   ├── config/
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 5. 环境变量配置

创建 `.env` 文件：

```bash
touch .env
```

`.env` 内容：
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=你的密码
DB_DATABASE=tt_admin

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=development
```

创建 `.env.example` (不包含真实密码，用于分享代码)：
```bash
touch .env.example
```

---

## 6. 启动项目验证

```bash
npm run start:dev
```

访问 http://localhost:3000 看到 "Hello World!" 说明项目创建成功。

---

## 下一步

Step 3 将实现：
- TypeORM 数据库连接配置
- User Entity 定义
- Auth 模块 (注册/登录/JWT)