# Security Rules

## 输入验证

### 前端验证
- 所有用户输入必须验证
- URL 格式验证
- 标签长度限制
- XSS 防护：不使用 dangerouslySetInnerHTML

```typescript
// URL 验证示例
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

### 后端验证
- 永远不信任客户端数据
- 使用验证库 (如 zod, joi)
- 返回通用错误信息，不暴露内部细节

```typescript
import { z } from 'zod';

const bookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string().max(50)).max(10)
});
```

## SQL 注入防护

### 使用参数化查询
```typescript
// ✅ 安全
db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(id);

// ❌ 危险
db.exec(`SELECT * FROM bookmarks WHERE id = ${id}`);
```

### ORM 使用
- 优先使用 ORM 或查询构建器
- 避免原始 SQL 拼接

## XSS 防护

### React 默认防护
- React 自动转义 JSX 中的值
- 避免使用 dangerouslySetInnerHTML

### 内容安全策略
```typescript
// 设置 CSP 头
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'"
  );
  next();
});
```

## API 安全

### CORS 配置
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 每个 IP 最多 100 请求
});

app.use('/api', limiter);
```

## 敏感数据处理

### 环境变量
- 敏感配置使用环境变量
- 不要提交 .env 文件
- 提供 .env.example 模板

```bash
# .env.example
DATABASE_URL=sqlite:./data/bookmarks.db
API_PORT=3000
FRONTEND_URL=http://localhost:5173
```

### .gitignore
```
# 敏感文件
.env
.env.local
*.pem
*.key

# 数据库文件
*.db
*.sqlite
```

## 依赖安全

### 定期检查
```bash
# 检查已知漏洞
npm audit

# 自动修复
npm audit fix
```

### 锁定版本
- 使用 package-lock.json
- 定期更新依赖
- 审查新依赖的安全性
