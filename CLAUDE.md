# Bookmark Manager - Claude Code 学习项目

## 项目概述
全栈书签管理器，用于系统性学习 Claude Code 的核心特性。
支持书签的 CRUD 操作、标签分类、搜索功能。

## 技术栈
- **前端**: React 18 + TypeScript + Tailwind CSS
- **后端**: Node.js + Express + SQLite
- **测试**: Vitest (单元测试) + Playwright (E2E)
- **工具**: ESLint + Prettier

## 项目结构
```
bookmark-manager/
├── frontend/          # React 应用
├── backend/           # Express API
├── .claude/           # Claude Code 配置
│   ├── rules/         # 开发规则
│   ├── commands/      # 自定义命令
│   └── skills/        # 可复用技能
├── CLAUDE.md          # 本文件
└── README.md
```

## 常用命令

### 前端
```bash
cd frontend
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (默认 http://localhost:5173)
npm run build        # 构建生产版本
npm run test         # 运行单元测试
npm run lint         # 代码检查
```

### 后端
```bash
cd backend
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (默认 http://localhost:3000)
npm run test         # 运行测试
npm run lint         # 代码检查
```

### 全局
```bash
npm run test:e2e     # 运行 E2E 测试 (Playwright)
```

## API 契约

### 书签 CRUD
| 方法   | 路径                 | 描述         |
|--------|---------------------|--------------|
| GET    | /api/bookmarks      | 获取所有书签  |
| GET    | /api/bookmarks/:id  | 获取单个书签  |
| POST   | /api/bookmarks      | 创建书签      |
| PUT    | /api/bookmarks/:id  | 更新书签      |
| DELETE | /api/bookmarks/:id  | 删除书签      |

### 书签数据结构
```typescript
interface Bookmark {
  id: number;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

## 代码规范要点

### TypeScript
- 使用严格模式 (`strict: true`)
- 优先使用 interface 而非 type (除非需要联合类型)
- 避免使用 any，必要时使用 unknown
- 组件 Props 使用 Props 后缀: `ButtonProps`

### React
- 使用函数组件 + Hooks
- 组件文件使用 PascalCase: `BookmarkCard.tsx`
- Hook 文件使用 camelCase: `useBookmarks.ts`
- 每个组件一个文件，测试文件放在同目录

### 命名约定
- 变量/函数: camelCase
- 组件/类/类型: PascalCase
- 常量: UPPER_SNAKE_CASE
- 文件: 组件用 PascalCase，其他用 kebab-case

### Git 提交
- 使用约定式提交: `type(scope): description`
- 类型: feat, fix, docs, style, refactor, test, chore
- 示例: `feat(bookmark): add tag filtering`

## 已知问题与解决方案

### SQLite 相关
- 问题: SQLite 在 Windows 上可能需要额外配置
- 解决: 使用 better-sqlite3 包，它包含预编译的二进制文件

### 热更新
- 问题: Vite HMR 有时不触发
- 解决: 检查文件是否正确导出，必要时重启 dev server

---
*本文件随项目演进持续更新，记录遇到的问题和最佳实践*
