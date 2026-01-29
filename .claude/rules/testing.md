# Testing Rules

## 测试原则

### 测试金字塔
- 单元测试 (70%): 快速、隔离、大量
- 集成测试 (20%): API 端点、数据库交互
- E2E 测试 (10%): 关键用户流程

### 命名规范
```typescript
// 测试文件与源文件同目录
BookmarkCard.tsx
BookmarkCard.test.tsx

// 测试描述清晰
describe('BookmarkCard', () => {
  it('should render bookmark title', () => {});
  it('should call onDelete when delete button clicked', () => {});
});
```

## 单元测试 (Vitest)

### 组件测试
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkCard } from './BookmarkCard';

describe('BookmarkCard', () => {
  const mockBookmark = {
    id: 1,
    title: 'Test',
    url: 'https://example.com',
    tags: ['test']
  };

  it('should render bookmark title', () => {
    render(<BookmarkCard bookmark={mockBookmark} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Hook 测试
```typescript
import { renderHook, act } from '@testing-library/react';
import { useBookmarks } from './useBookmarks';

describe('useBookmarks', () => {
  it('should fetch bookmarks on mount', async () => {
    const { result } = renderHook(() => useBookmarks());
    await waitFor(() => {
      expect(result.current.bookmarks).toHaveLength(2);
    });
  });
});
```

## API 测试

### 使用 supertest
```typescript
import request from 'supertest';
import { app } from '../app';

describe('GET /api/bookmarks', () => {
  it('should return all bookmarks', async () => {
    const response = await request(app)
      .get('/api/bookmarks')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## E2E 测试 (Playwright)

### 关键流程覆盖
- 用户登录流程
- 创建书签流程
- 搜索和筛选流程

```typescript
test('user can add a bookmark', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="add-bookmark"]');
  await page.fill('[data-testid="url-input"]', 'https://example.com');
  await page.click('[data-testid="save-button"]');
  await expect(page.locator('[data-testid="bookmark-list"]')).toContainText('example.com');
});
```

## TDD 工作流

1. **Red**: 先写失败的测试
2. **Green**: 写最少代码让测试通过
3. **Refactor**: 重构代码，保持测试通过

```bash
# TDD 循环命令
npm run test:watch  # 持续运行测试
```
