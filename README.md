# 个人博客后台管理系统

> 基于 Vue 3 + Vite + Element Plus + TailwindCSS 的现代化博客后台管理系统

## 🔥 技术栈

- **构建工具：** Vite
- **前端框架：** Vue 3 (Composition API)
- **UI 框架：** Element Plus
- **CSS 框架：** TailwindCSS
- **包管理器：** pnpm
- **状态管理：** Pinia（替代Vuex的更现代的解决方案）
- **路由：** Vue Router
- **HTTP 工具：** Axios
- **代码规范：** ESLint + Prettier
- **提交规范：** Commitlint

## 📦 环境准备

```bash
# 环境版本
node >= 16
pnpm >= 7
```

````

## 🚀 开发指南

```bash
# 克隆项目
git clone [你的项目地址]

# 进入项目目录
cd blog-admin

# 安装依赖
pnpm install

# 启动服务
pnpm dev

# 构建生产环境
pnpm build
```

## 📁 目录结构

```bash
├── src/
│   ├── api/          # API 接口管理
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── composables/  # 组合式函数
│   ├── layouts/      # 布局组件
│   ├── router/       # 路由配置
│   ├── stores/       # Pinia 状态管理
│   ├── styles/       # 全局样式
│   ├── utils/        # 工具函数
│   └── views/        # 页面视图
├── public/           # 公共资源
├── .env              # 环境变量
├── .eslintrc.js     # ESLint 配置
├── .prettierrc      # Prettier 配置
├── package.json     # 项目配置
├── vite.config.ts   # Vite 配置
└── tailwind.config.js # Tailwind 配置
```

## 🔨 功能模块

- [ ] 用户认证
  - [ ] 登录
  - [ ] 退出
  - [ ] 修改密码
- [ ] 文章管理
  - [ ] 文章列表
  - [ ] 文章创建
  - [ ] 文章编辑
  - [ ] 文章删除
- [ ] 分类管理
- [ ] 标签管理
- [ ] 评论管理
- [ ] 系统设置

## 💡 开发规范

- **命名规范：**
  - 文件夹：kebab-case
  - 组件：PascalCase
  - 变量：camelCase
- **提交规范：**
  - feat: 新功能
  - fix: 修复
  - docs: 文档更新
  - style: 代码格式
  - refactor: 重构
  - perf: 性能优化
  - test: 测试
  - chore: 构建过程或辅助工具的变动

## 📄 License

[MIT](LICENSE)

```

```
````
