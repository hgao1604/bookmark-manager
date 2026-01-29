# Git Workflow Rules

## 分支策略

### 主要分支
- `main`: 生产环境代码，始终保持可部署状态
- `develop`: 开发分支，功能合并到此

### 功能分支命名
```
feature/add-bookmark-tags     # 新功能
fix/bookmark-delete-error     # Bug 修复
refactor/api-response-format  # 重构
docs/api-documentation        # 文档
test/bookmark-crud-tests      # 测试
```

## 提交规范

### Conventional Commits
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### 类型 (type)
| 类型 | 描述 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档变更 |
| style | 代码格式（不影响逻辑） |
| refactor | 重构（不是新功能也不是修复） |
| test | 添加或修改测试 |
| chore | 构建过程或辅助工具变更 |

### 作用域 (scope)
- `frontend`: 前端相关
- `backend`: 后端相关
- `api`: API 相关
- `db`: 数据库相关
- `bookmark`: 书签功能
- `tag`: 标签功能

### 示例
```bash
# 好的提交信息
feat(bookmark): add tag filtering functionality
fix(api): handle empty bookmark list correctly
docs(readme): update installation instructions
refactor(frontend): extract BookmarkList component

# 不好的提交信息
update code
fix bug
WIP
```

## 工作流程

### 开发新功能
```bash
# 1. 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "feat(scope): description"

# 3. 推送并创建 PR
git push -u origin feature/new-feature
gh pr create --base develop
```

### 代码审查
- PR 必须经过至少一人审查
- 所有测试必须通过
- 无 linting 错误

### 合并策略
- 使用 Squash and Merge 保持历史清晰
- 合并后删除功能分支

## Git Worktrees (多 Agent 协作)

### 设置
```bash
# 创建 worktrees 用于并行开发
git worktree add ../bookmark-frontend feature/frontend
git worktree add ../bookmark-backend feature/backend
git worktree add ../bookmark-tests feature/tests
```

### 清理
```bash
# 完成后清理 worktrees
git worktree remove ../bookmark-frontend
git worktree remove ../bookmark-backend
git worktree remove ../bookmark-tests
```

## 注意事项

- 不要直接推送到 main 分支
- 提交前运行 `npm run lint` 和 `npm run test`
- 保持提交原子化（一个提交做一件事）
- 及时同步上游变更，避免大量冲突
