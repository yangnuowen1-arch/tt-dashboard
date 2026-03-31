# 项目结构说明文档

> 本文档旨在帮助后端开发者了解前端项目结构，以便使用 NestJS 开发对接的后端服务。

## 项目概述

- **项目名称**: free-nextjs-admin-dashboard
- **版本**: 2.2.3
- **框架**: Next.js 16.1.6 (App Router)
- **UI框架**: TailwindCSS 4.x
- **React版本**: 19.2.0
- **主要功能**: 电商后台管理系统仪表盘

---

## 根目录结构

```
tt-admin-dashboard/
├── public/                 # 静态资源目录
├── src/                    # 源代码目录
├── .idea/                  # IDE配置 (JetBrains)
├── node_modules/           # 依赖包 (自动生成)
├── .next/                  # Next.js构建输出 (自动生成)
├── package.json            # 项目配置和依赖
├── next.config.ts          # Next.js配置
├── eslint.config.mjs       # ESLint配置
├── postcss.config.js       # PostCSS配置
├── prettier.config.js      # Prettier配置
├── tsconfig.json           # TypeScript配置
├── README.md               # 项目说明
└── LICENSE                 # 许可证
```

---

## src/ - 源代码目录

### src/app/ - 路由页面目录 (Next.js App Router)

采用路由分组 (Route Groups) 组织，使用 `()` 包裹的文件夹不会出现在 URL 中。

#### 页面路由结构

| 路径 | URL路由 | 功能说明 |
|------|---------|----------|
| `src/app/(admin)/page.tsx` | `/` | **首页/仪表盘** - 电商数据概览 |
| `src/app/(admin)/layout.tsx` | - | Admin布局容器 (包含Sidebar和Header) |
| `src/app/(admin)/(others-pages)/calendar/page.tsx` | `/calendar` | 日历页面 |
| `src/app/(admin)/(others-pages)/profile/page.tsx` | `/profile` | 用户资料页面 |
| `src/app/(admin)/(others-pages)/blank/page.tsx` | `/blank` | 空白页面模板 |
| `src/app/(admin)/(others-pages)/(forms)/form-elements/page.tsx` | `/form-elements` | 表单元素展示 |
| `src/app/(admin)/(others-pages)/(tables)/basic-tables/page.tsx` | `/basic-tables` | 基础表格展示 |
| `src/app/(admin)/(others-pages)/(chart)/line-chart/page.tsx` | `/line-chart` | 折线图页面 |
| `src/app/(admin)/(others-pages)/(chart)/bar-chart/page.tsx` | `/bar-chart` | 柱状图页面 |
| `src/app/(admin)/(ui-elements)/alerts/page.tsx` | `/alerts` | 警告提示组件 |
| `src/app/(admin)/(ui-elements)/avatars/page.tsx` | `/avatars` | 头像组件 |
| `src/app/(admin)/(ui-elements)/badge/page.tsx` | `/badge` | 徽章组件 |
| `src/app/(admin)/(ui-elements)/buttons/page.tsx` | `/buttons` | 按钮组件 |
| `src/app/(admin)/(ui-elements)/images/page.tsx` | `/images` | 图片组件 |
| `src/app/(admin)/(ui-elements)/modals/page.tsx` | `/modals` | 弹窗组件 |
| `src/app/(admin)/(ui-elements)/videos/page.tsx` | `/videos` | 视频组件 |
| `src/app/(full-width-pages)/(auth)/signin/page.tsx` | `/signin` | **登录页面** |
| `src/app/(full-width-pages)/(auth)/signup/page.tsx` | `/signup` | **注册页面** |
| `src/app/(full-width-pages)/(error-pages)/error-404/page.tsx` | `/error-404` | 404错误页面 |

**后端对接要点**:
- `/signin` 和 `/signup` 页面需要后端提供认证 API
- `/profile` 页面需要用户信息 API
- `/` 首页需要电商统计数据 API (订单、销售、用户等)

---

### src/components/ - 组件目录

#### 组件分类

| 目录 | 功能说明 | 后端对接数据 |
|------|----------|-------------|
| `auth/` | 认证组件 (SignInForm, SignUpForm) | 需要: 登录/注册API |
| `ecommerce/` | 电商业务组件 | 需要: 统计数据、订单数据API |
| `header/` | 头部导航组件 (通知下拉、用户下拉) | 需要: 用户信息、通知API |
| `user-profile/` | 用户资料卡片组件 | 需要: 用户详情API |
| `tables/` | 表格组件 (含分页) | 需要: 列表数据API |
| `form/` | 表单组件 (输入框、选择器、开关等) | 需要: 表单提交API |
| `charts/` | 图表组件 (折线图、柱状图) | 需要: 统计数据API |
| `calendar/` | 日历组件 | 需要: 日历/事件API |
| `ui/` | UI基础组件 (按钮、徽章、弹窗、表格等) | 无需后端数据 |
| `common/` | 通用组件 (主题切换、面包屑等) | 无需后端数据 |
| `videos/` | 视频比例展示组件 | 无需后端数据 |
| `example/` | 示例组件 (Modal示例) | 无需后端数据 |

#### 重点电商组件 (src/components/ecommerce/)

| 文件 | 功能 | 后端需要的数据 |
|------|------|----------------|
| `EcommerceMetrics.tsx` | 电商指标概览卡片 | 销售额、订单数、用户增长数据 |
| `MonthlySalesChart.tsx` | 月度销售图表 | 按月销售统计数据 |
| `MonthlyTarget.tsx` | 月度目标达成 | 目标设置、完成进度 |
| `StatisticsChart.tsx` | 统计图表 | 用户访问/流量统计 |
| `RecentOrders.tsx` | 最近订单列表 | **订单列表API** (产品名、分类、价格、状态) |
| `DemographicCard.tsx` | 用户地区分布 | 用户地理位置分布数据 |
| `CountryMap.tsx` | 国家地图展示 | 各国家/地区用户数据 |

#### 认证组件 (src/components/auth/)

| 文件 | 功能 | 后端API需求 |
|------|------|-------------|
| `SignInForm.tsx` | 登录表单 | `POST /auth/login` - 邮箱+密码登录 |
| `SignUpForm.tsx` | 注册表单 | `POST /auth/register` - 用户注册 |

#### 用户组件 (src/components/user-profile/)

| 文件 | 功能 | 后端API需求 |
|------|------|-------------|
| `UserInfoCard.tsx` | 用户基本信息卡片 | `GET /users/:id` |
| `UserAddressCard.tsx` | 用户地址卡片 | `GET /users/:id/addresses` |
| `UserMetaCard.tsx` | 用户元信息卡片 | `GET /users/:id/meta` |

#### 头部组件 (src/components/header/)

| 文件 | 功能 | 后端API需求 |
|------|------|-------------|
| `NotificationDropdown.tsx` | 通知下拉菜单 | `GET /notifications` |
| `UserDropdown.tsx` | 用户下拉菜单 | `GET /users/current` |

---

### src/layout/ - 布局组件目录

| 文件 | 功能说明 |
|------|----------|
| `AppHeader.tsx` | 应用顶部导航栏 (含搜索框、通知、用户下拉) |
| `AppSidebar.tsx` | 应用侧边栏 (含菜单导航) |
| `Backdrop.tsx` | 移动端遮罩层组件 |
| `SidebarWidget.tsx` | 侧边栏底部小部件 |

---

### src/context/ - React Context 目录

| 文件 | 功能说明 | 后端对接影响 |
|------|----------|--------------|
| `SidebarContext.tsx` | 侧边栏状态管理 (展开/折叠) | 前端状态，无需后端 |
| `ThemeContext.tsx` | 主题状态管理 (light/dark模式) | 前端状态，无需后端 |

---

### src/hooks/ - 自定义 Hooks 目录

| 文件 | 功能说明 |
|------|----------|
| `useModal.ts` | 弹窗状态管理 hook (open/close/toggle) |
| `useGoBack.ts` | 返回上一页 hook |

---

### src/icons/ - 图标组件目录

| 文件 | 功能说明 |
|------|----------|
| `index.tsx` | 所有SVG图标导出 (菜单图标、用户图标等) |

---

## public/ - 静态资源目录

### public/images/ - 图片资源

| 目录 | 内容说明 |
|------|----------|
| `brand/` | 品牌 logo SVG (15个品牌图标) |
| `cards/` | 卡片图片 (3张) |
| `carousel/` | 轮播图片 (4张) |
| `chat/` | 聊天相关图片 |
| `country/` | 国家旗帜 SVG (8个国家) |
| `error/` | 错误页面图片 (404, 500, 503, 维护, 成功) |
| `grid-image/` | 网格展示图片 (6张) |
| `icons/` | 图标 SVG (文件类型图标) |
| `logo/` | 应用 logo (auth-logo, logo, logo-dark, logo-icon) |
| `product/` | 产品图片 (订单展示用) |
| `shape/` | 形状装饰图片 |
| `task/` | 任务相关图片 |
| `user/` | 用户头像示例 |
| `video-thumb/` | 视频缩略图 |

---

## 后端 API 接口规划建议

基于前端页面和组件分析，建议 NestJS 后端提供以下 API:

### 1. 认证模块 (Auth Module)

```
POST   /api/auth/login          # 登录
POST   /api/auth/register       # 注册
POST   /api/auth/logout         # 登出
POST   /api/auth/refresh        # 刷新Token
GET    /api/auth/me             # 获取当前用户信息
```

### 2. 用户模块 (Users Module)

```
GET    /api/users/:id           # 获取用户详情
PUT    /api/users/:id           # 更新用户信息
GET    /api/users/:id/addresses # 获取用户地址列表
POST   /api/users/:id/addresses # 添加用户地址
DELETE /api/users/:id/addresses/:addressId # 删除地址
```

### 3. 电商/仪表盘模块 (Dashboard Module)

```
GET    /api/dashboard/metrics   # 获取电商指标 (销售额、订单数、用户增长)
GET    /api/dashboard/monthly-sales # 获取月度销售数据
GET    /api/dashboard/statistics    # 获取访问统计数据
GET    /api/dashboard/demographics  # 获取用户地区分布
```

### 4. 订单模块 (Orders Module)

```
GET    /api/orders              # 获取订单列表 (支持分页、筛选)
GET    /api/orders/:id          # 获取订单详情
POST   /api/orders              # 创建订单
PUT    /api/orders/:id          # 更新订单状态
DELETE /api/orders/:id          # 删除订单
```

### 5. 产品模块 (Products Module)

```
GET    /api/products            # 获取产品列表
GET    /api/products/:id        # 获取产品详情
POST   /api/products            # 创建产品
PUT    /api/products/:id        # 更新产品
DELETE /api/products/:id        # 删除产品
```

### 6. 通知模块 (Notifications Module)

```
GET    /api/notifications       # 获取通知列表
PUT    /api/notifications/:id/read # 标记已读
DELETE /api/notifications/:id   # 删除通知
```

---

## 数据类型参考

### 订单数据类型 (参考 RecentOrders 组件)

```typescript
interface Order {
  id: number;
  name: string;        // 产品名称
  variants: string;    // 变体数量
  category: string;    // 分类
  price: string;       // 价格
  status: 'Delivered' | 'Pending' | 'Canceled';
  image: string;       // 产品图片URL
}
```

### 电商指标数据类型 (参考 EcommerceMetrics)

```typescript
interface EcommerceMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  growthRate: number;  // 增长百分比
}
```

---

## 技术栈对应

| 前端技术 | 后端对应建议 |
|----------|--------------|
| React 19 + Next.js 16 | NestJS (TypeScript) |
| TailwindCSS | 无需对应 (纯前端样式) |
| ApexCharts | 后端提供图表数据 JSON |
| FullCalendar | 后端提供事件/日程数据 |
| React Dropzone | 后端提供文件上传 API |

---

## 项目依赖清单 (关键依赖)

```json
{
  "dependencies": {
    "next": "^16.1.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "apexcharts": "^4.7.0",
    "react-apexcharts": "^1.8.0",
    "@fullcalendar/react": "^6.1.19",
    "flatpickr": "^4.6.13",
    "react-dropzone": "^14.3.8",
    "swiper": "^11.2.10",
    "tailwind-merge": "^2.6.0"
  }
}
```

---

## 总结

本项目是一个典型的 **电商后台管理系统** 前端模板，主要功能包括:

1. **认证系统**: 登录/注册页面
2. **仪表盘首页**: 电商数据可视化展示
3. **订单管理**: 订单列表展示
4. **用户管理**: 用户资料页面
5. **UI组件库**: 各种基础UI组件展示

**后端开发重点**: 需要实现认证、用户、订单、产品、通知、仪表盘统计等模块的 RESTful API。