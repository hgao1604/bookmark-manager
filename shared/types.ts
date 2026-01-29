/**
 * API 契约 - 前后端共享的类型定义
 * 这是多 Agent 协作的关键：定义清晰的接口规范
 */

// ============ 书签相关 ============

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  favicon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkRequest {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
}

export interface UpdateBookmarkRequest {
  url?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

// ============ 标签相关 ============

export interface Tag {
  name: string;
  count: number;
}

// ============ API 响应 ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============ 搜索相关 ============

export interface SearchParams {
  query?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
}

// ============ API 端点定义 ============

/**
 * API 端点契约
 *
 * GET    /api/bookmarks          - 获取书签列表（支持分页和搜索）
 * GET    /api/bookmarks/:id      - 获取单个书签
 * POST   /api/bookmarks          - 创建书签
 * PUT    /api/bookmarks/:id      - 更新书签
 * DELETE /api/bookmarks/:id      - 删除书签
 *
 * GET    /api/tags               - 获取所有标签（含使用计数）
 */
