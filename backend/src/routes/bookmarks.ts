import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getDatabase, saveDatabase } from '../db';

const router = Router();

// 验证 schema
const createBookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

const updateBookmarkSchema = createBookmarkSchema.partial();

// GET /api/bookmarks - 获取所有书签
router.get('/', (req: Request, res: Response) => {
  const db = getDatabase();
  const { query, tags, page = '1', pageSize = '20' } = req.query;

  let sql = `
    SELECT DISTINCT b.*, GROUP_CONCAT(t.name) as tag_names
    FROM bookmarks b
    LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
    LEFT JOIN tags t ON bt.tag_id = t.id
  `;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (query) {
    conditions.push('(b.title LIKE ? OR b.url LIKE ? OR b.description LIKE ?)');
    const searchTerm = `%${query}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (tags) {
    const tagList = (tags as string).split(',');
    conditions.push(`t.name IN (${tagList.map(() => '?').join(',')})`);
    params.push(...tagList);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' GROUP BY b.id ORDER BY b.created_at DESC';

  const offset = (parseInt(page as string) - 1) * parseInt(pageSize as string);
  sql += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(pageSize as string), offset);

  const stmt = db.prepare(sql);
  stmt.bind(params);

  const bookmarks = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as Record<string, unknown>;
    bookmarks.push({
      id: row.id,
      url: row.url,
      title: row.title,
      description: row.description,
      favicon: row.favicon,
      tags: row.tag_names ? (row.tag_names as string).split(',') : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  stmt.free();

  res.json({ success: true, data: bookmarks });
});

// GET /api/bookmarks/:id - 获取单个书签
router.get('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const { id } = req.params;

  const stmt = db.prepare(`
    SELECT b.*, GROUP_CONCAT(t.name) as tag_names
    FROM bookmarks b
    LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
    LEFT JOIN tags t ON bt.tag_id = t.id
    WHERE b.id = ?
    GROUP BY b.id
  `);
  stmt.bind([parseInt(id)]);

  if (!stmt.step()) {
    stmt.free();
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Bookmark not found' },
    });
  }

  const row = stmt.getAsObject() as Record<string, unknown>;
  stmt.free();

  res.json({
    success: true,
    data: {
      id: row.id,
      url: row.url,
      title: row.title,
      description: row.description,
      favicon: row.favicon,
      tags: row.tag_names ? (row.tag_names as string).split(',') : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  });
});

// POST /api/bookmarks - 创建书签
router.post('/', (req: Request, res: Response) => {
  const result = createBookmarkSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: result.error.message },
    });
  }

  const db = getDatabase();
  const { url, title, description, tags = [] } = result.data;

  try {
    db.run('INSERT INTO bookmarks (url, title, description) VALUES (?, ?, ?)', [
      url,
      title,
      description || null,
    ]);

    const idResult = db.exec('SELECT last_insert_rowid() as id');
    const bookmarkId = idResult[0].values[0][0] as number;

    // 处理标签
    for (const tagName of tags) {
      db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tagName]);
      const tagResult = db.exec(`SELECT id FROM tags WHERE name = '${tagName}'`);
      const tagId = tagResult[0].values[0][0] as number;
      db.run('INSERT INTO bookmark_tags (bookmark_id, tag_id) VALUES (?, ?)', [
        bookmarkId,
        tagId,
      ]);
    }

    saveDatabase();

    res.status(201).json({
      success: true,
      data: { id: bookmarkId, url, title, description, tags, createdAt: new Date().toISOString() },
    });
  } catch (err) {
    const error = err as Error;
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_URL', message: 'Bookmark with this URL already exists' },
      });
    }
    throw err;
  }
});

// PUT /api/bookmarks/:id - 更新书签
router.put('/:id', (req: Request, res: Response) => {
  const result = updateBookmarkSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: result.error.message },
    });
  }

  const db = getDatabase();
  const { id } = req.params;
  const { url, title, description, tags } = result.data;

  const updates: string[] = [];
  const params: unknown[] = [];

  if (url) { updates.push('url = ?'); params.push(url); }
  if (title) { updates.push('title = ?'); params.push(title); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  updates.push("updated_at = datetime('now')");

  if (updates.length > 1) {
    params.push(parseInt(id));
    db.run(`UPDATE bookmarks SET ${updates.join(', ')} WHERE id = ?`, params);
  }

  // 更新标签
  if (tags) {
    db.run('DELETE FROM bookmark_tags WHERE bookmark_id = ?', [parseInt(id)]);
    for (const tagName of tags) {
      db.run('INSERT OR IGNORE INTO tags (name) VALUES (?)', [tagName]);
      const tagResult = db.exec(`SELECT id FROM tags WHERE name = '${tagName}'`);
      const tagId = tagResult[0].values[0][0] as number;
      db.run('INSERT INTO bookmark_tags (bookmark_id, tag_id) VALUES (?, ?)', [
        parseInt(id),
        tagId,
      ]);
    }
  }

  saveDatabase();
  res.json({ success: true, data: { id: parseInt(id) } });
});

// DELETE /api/bookmarks/:id - 删除书签
router.delete('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const { id } = req.params;

  db.run('DELETE FROM bookmark_tags WHERE bookmark_id = ?', [parseInt(id)]);
  db.run('DELETE FROM bookmarks WHERE id = ?', [parseInt(id)]);
  saveDatabase();

  res.json({ success: true, data: null });
});

export default router;
