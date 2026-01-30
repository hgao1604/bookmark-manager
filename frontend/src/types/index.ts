export interface Bookmark {
  id: number;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkInput {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
}

export interface UpdateBookmarkInput {
  url?: string;
  title?: string;
  description?: string;
  tags?: string[];
}
