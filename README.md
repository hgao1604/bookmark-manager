# Bookmark Manager

一个全栈书签管理器，用于学习 Claude Code 的核心特性。

## 功能

- 添加/编辑/删除书签
- 按标签分类
- 搜索功能
- 数据持久化 (SQLite)
- 响应式 UI

## 技术栈

- **前端**: React 18 + TypeScript + Tailwind CSS
- **后端**: Node.js + Express + SQLite
- **测试**: Vitest + Playwright

## 快速开始

```bash
# 克隆项目
git clone <repo-url>
cd bookmark-manager

# 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 启动开发服务器
# 终端 1 - 后端
cd backend && npm run dev

# 终端 2 - 前端
cd frontend && npm run dev
```

## 项目结构

```
bookmark-manager/
├── frontend/          # React 前端
├── backend/           # Express 后端
├── .claude/           # Claude Code 配置
└── CLAUDE.md          # Claude Code 上下文
```

## 开发

详见 [CLAUDE.md](./CLAUDE.md) 了解开发规范和常用命令。
