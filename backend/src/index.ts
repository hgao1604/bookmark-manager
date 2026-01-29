import express from 'express';
import cors from 'cors';
import { initDatabase } from './db';
import bookmarkRoutes from './routes/bookmarks';
import tagRoutes from './routes/tags';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// 路由
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/tags', tagRoutes);

// 健康检查
app.get('/api/health', (_, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

// 启动服务器
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch(console.error);
