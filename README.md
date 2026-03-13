# Image Background Remover

一个基于 Next.js 和 Tailwind CSS 的在线图片背景移除工具。

## 功能特点

- 🚀 快速处理 - 3-10秒完成背景移除
- 🔒 隐私保护 - 不存储用户图片
- 💻 无需注册 - 打开即用
- 📱 响应式设计 - 支持桌面和移动端
- 🎨 现代化 UI - 使用 Tailwind CSS

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **API**: Remove.bg API
- **部署**: Vercel / Cloudflare Pages

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/feiyu-coder/image-background-remover.git
cd image-background-remover
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，添加你的 Remove.bg API Key：

```env
REMOVEBG_API_KEY=your_actual_api_key_here
```

获取 API Key：访问 [Remove.bg API](https://www.remove.bg/api) 注册并获取。

### 4. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
image-bg-remover-next/
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts          # API 路由
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 主页面
│   └── globals.css               # 全局样式
├── public/                       # 静态资源
├── docs/
│   └── mvp-requirements.md       # MVP 需求文档
├── .env.local.example            # 环境变量示例
├── next.config.ts                # Next.js 配置
├── tailwind.config.ts            # Tailwind 配置
└── package.json
```

## 使用方法

1. 上传图片（支持 JPG、PNG、WEBP，最大 10MB）
2. 点击"移除背景"按钮
3. 等待处理完成（3-10秒）
4. 下载处理后的图片

## API 说明

### POST /api/remove-bg

移除图片背景。

**请求参数：**
- `image`: File - 图片文件

**响应：**
```json
{
  "success": true,
  "image": "data:image/png;base64,..."
}
```

**错误响应：**
```json
{
  "error": "错误信息"
}
```

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量 `REMOVEBG_API_KEY`
4. 部署

### Cloudflare Pages

1. 推送代码到 GitHub
2. 在 Cloudflare Pages 连接仓库
3. 构建命令：`npm run build`
4. 输出目录：`.next`
5. 配置环境变量

## 成本说明

Remove.bg API 定价：
- 免费：50 次/月
- 付费：$0.20/张起

建议：
- 开发测试使用免费额度
- 生产环境根据流量选择合适套餐

## 开发计划

查看 [MVP 需求文档](./docs/mvp-requirements.md) 了解详细的开发计划。

## 许可证

MIT License

## 作者

飞鱼 (feiyu-coder)

## 贡献

欢迎提交 Issue 和 Pull Request！
