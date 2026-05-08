# 访问次数统计配置指南

## 当前状态

✅ 访问次数统计功能已实现  
📍 数据存储位置: `.visits.json`

---

## 方案 1: 本地开发使用 JSON 文件

这是当前的默认方案，适合本地开发和测试。

### 工作原理

1. 首次访问时，`.visits.json` 文件会记录访问次数
2. 每次刷新页面，访问次数 +1
3. 文件位于项目根目录

### 注意事项

⚠️ **Vercel 部署限制**: Vercel 的无服务器函数在每次请求后不会保留文件系统更改。这意味着：
- 本地开发：✅ 正常工作
- Vercel 部署：❌ 每次部署访问次数会重置

---

## 方案 2: 使用 Vercel KV（推荐用于生产环境）

### 步骤 1: 创建 Vercel KV 数据库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击 **Storage** 标签
4. 点击 **Create Database** → 选择 **KV**
5. 按照提示创建数据库

### 步骤 2: 连接数据库到项目

在 Storage 页面，点击创建的 KV 数据库，然后点击 **Connect to Project**，选择你的博客项目。

### 步骤 3: 环境变量自动配置

连接后，Vercel 会自动添加以下环境变量：
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### 步骤 4: 重新部署

在 Vercel Dashboard 中，点击 **Deployments**，然后点击右上角的 **Redeploy**。

### 验证配置

部署后，访问次数应该：
- ✅ 数字不会每次刷新都改变
- ✅ 每次访问数字 +1
- ✅ 数字会持久保存

---

## 方案 3: 使用 Upstash Redis（免费替代方案）

如果 Vercel KV 不在你的地区可用，可以使用 Upstash：

### 步骤 1: 创建 Upstash 账号

1. 访问 [Upstash](https://upstash.com/)
2. 注册账号并登录
3. 创建新的 Redis 数据库

### 步骤 2: 获取凭证

在 Upstash 控制台中，找到：
- **REST API URL**
- **REST API Token**

### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加：
- `KV_REST_API_URL`: 你的 Upstash REST URL
- `KV_REST_API_TOKEN`: 你的 Upstash REST Token

### 步骤 4: 重新部署

---

## 如何查看当前配置状态

### 检查是否配置了 Vercel KV

查看 Vercel 项目 Settings → Environment Variables，确认是否有：
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### 检查 .visits.json 文件

```bash
cat .visits.json
```

如果看到类似内容，说明本地文件存储正在工作：
```json
{
  "total_visits": 123
}
```

---

## 故障排除

### 问题: 访问次数每次刷新都变

**原因**: 没有配置 Vercel KV，使用的是随机数

**解决**: 配置 Vercel KV 或 Upstash Redis

### 问题: 部署后访问次数不增长

**原因**: Vercel 无服务器函数不支持文件系统写入

**解决**: 使用 Vercel KV 或 Upstash Redis

### 问题: 想重置访问次数

**本地**: 删除或编辑 `.visits.json` 文件  
**Vercel KV**: 在 Vercel Storage 控制台中删除 `total_visits` 键  
**Upstash**: 在 Upstash 控制台中删除键

---

## 推荐配置

| 环境 | 存储方案 | 说明 |
|------|----------|------|
| 本地开发 | `.visits.json` | 简单，无需配置 |
| Vercel 生产 | Vercel KV | 推荐，官方集成 |
| 备选方案 | Upstash Redis | 免费，灵活 |

---

## 总结

如果你只是想本地测试，当前配置已经可以工作。

如果要在 Vercel 上正确运行访问统计，需要：
1. 配置 Vercel KV 或 Upstash Redis
2. 设置环境变量
3. 重新部署

需要我帮你配置 Vercel KV 吗？
