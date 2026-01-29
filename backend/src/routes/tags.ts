import { Router, Request, Response } from 'express';
import { getDatabase } from '../db';

const router = Router();

// GET /api/tags - 获取所有标签及其使用计数
router.get('/', (_req: Request, res: Response) => {
  const db = getDatabase();

  const result = db.exec(`
    SELECT t.name, COUNT(bt.bookmark_id) as count
    FROM tags t
    LEFT JOIN bookmark_tags bt ON t.id = bt.tag_id
    GROUP BY t.id
    ORDER BY count DESC, t.name ASC
  `);

  const tags = result.length > 0
    ? result[0].values.map((row) => ({
        name: row[0] as string,
        count: row[1] as number,
      }))
    : [];

  res.json({ success: true, data: tags });
});

export default router;
