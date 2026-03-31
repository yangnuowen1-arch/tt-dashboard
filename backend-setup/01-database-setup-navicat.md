# Step 1: PostgreSQL 数据库搭建 (Navicat Premium)

## 1. 确保 PostgreSQL 服务运行

### macOS 检查

```bash
# 检查 PostgreSQL 是否运行
pg_isready

# 如果没运行，启动它
brew services start postgresql@16
# 或者
postgres -D /usr/local/var/postgres
```

---

## 2. Navicat 连接 PostgreSQL

1. 打开 Navicat Premium
2. 点击 **连接** → **PostgreSQL**
3. 填写连接信息：

| 字段 | 值 |
|------|-----|
| 连接名 | tt_admin_local |
| 主机 | localhost 或 127.0.0.1 |
| 端口 | 5432 |
| 初始数据库 | postgres |
| 用户名 | postgres |
| 密码 | (你安装时设置的密码，可能为空) |

4. 点击 **测试连接**，成功后保存

---

## 3. 创建数据库

1. 右键连接 → **新建数据库**
2. 数据库名: `tt_admin`
3. 字符集: `UTF8`
4. 点击确定

---

## 4. 创建用户表

1. 双击打开 `tt_admin` 数据库
2. 点击 **查询** → **新建查询**
3. 粘贴以下 SQL 并执行：

```sql
-- 创建用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    avatar VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建邮箱索引
CREATE INDEX idx_users_email ON users(email);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 5. 验证表创建

在 Navicat 中刷新表列表，应该看到 `users` 表。

或执行查询：
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

---

## 数据库连接信息 (NestJS 配置用)

```
Host: localhost
Port: 5432
Database: tt_admin
Username: postgres
Password: (你的密码)
```

---

## 用户表字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | SERIAL | 主键自增 |
| email | VARCHAR(255) | 邮箱，唯一索引 |
| password | VARCHAR(255) | 密码哈希 (bcrypt) |
| name | VARCHAR(100) | 用户昵称 |
| avatar | VARCHAR(500) | 头像 URL |
| role | VARCHAR(20) | 角色: admin / user |
| is_active | BOOLEAN | 账户是否激活 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 (自动更新) |

---

完成后进入 **Step 2: 创建 NestJS 项目**
