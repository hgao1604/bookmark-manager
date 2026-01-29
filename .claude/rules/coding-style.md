# Coding Style Rules

## TypeScript 规范

### 类型定义
- 启用 strict 模式
- 禁止使用 `any`，使用 `unknown` 替代
- 接口优先于类型别名（除非需要联合/交叉类型）
- 为所有导出的函数添加返回类型

```typescript
// ✅ Good
interface BookmarkProps {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
}

// ❌ Bad
type BookmarkProps = {
  bookmark: any;
  onDelete: Function;
}
```

### 命名规范
| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getBookmarks`, `isLoading` |
| 组件/类/接口 | PascalCase | `BookmarkCard`, `UserService` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_TAGS` |
| 私有属性 | 前缀下划线 | `_internalState` |

### 文件组织
- 一个组件一个文件
- 组件文件: PascalCase (`BookmarkCard.tsx`)
- 工具函数: kebab-case (`date-utils.ts`)
- Hook: camelCase + use 前缀 (`useBookmarks.ts`)

## React 规范

### 组件结构
```typescript
// 1. 导入
import { useState, useEffect } from 'react';

// 2. 类型定义
interface Props {
  // ...
}

// 3. 组件定义
export function ComponentName({ prop1, prop2 }: Props) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. 副作用
  useEffect(() => {}, []);

  // 6. 事件处理
  const handleClick = () => {};

  // 7. 渲染
  return <div />;
}
```

### Hooks 使用
- 自定义 Hook 必须以 `use` 开头
- 避免在条件语句中使用 Hook
- 依赖数组要完整

## 后端规范

### Express 路由
- 使用 Router 分离路由
- 统一错误处理中间件
- 响应格式统一

```typescript
// 成功响应
{ success: true, data: {...} }

// 错误响应
{ success: false, error: { code: 'ERROR_CODE', message: '...' } }
```

### 数据库
- 使用参数化查询防止 SQL 注入
- 事务处理多步操作
- 合理使用索引
