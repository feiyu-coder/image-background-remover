# Image Background Remover

一个基于 Next.js 和 Tailwind CSS 的在线图片背景移除工具，支持 Google OAuth 登录。

## 功能特点

- 🚀 快速处理 - 3-10秒完成背景移除
- 🔒 隐私保护 - 不存储用户图片
- 👤 Google 登录 - 安全便捷的用户认证
- 💻 无需注册 - 打开即用
- 📱 响应式设计 - 支持桌面和移动端
- 🎨 现代化 UI - 使用 Tailwind CSS

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **认证**: NextAuth.js (Google OAuth)
- **API**: Remove.bg API
- **部署**: Vercel

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

编辑 `.env.local`，添加必要的配置：

```env
# Remove.bg API Key
REMOVEBG_API_KEY=your_removebg_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

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

## 部署到 Vercel

### 方法 1：通过 Vercel Dashboard（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 用 GitHub 登录
3. 点击 **Import Project**
4. 选择 `feiyu-coder/image-background-remover` 仓库
5. 配置环境变量（见上方）
6. 点击 **Deploy**

### 方法 2：通过 Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## 配置 Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API**
4. 创建 **OAuth 2.0 客户端 ID**：
   - 应用类型：Web 应用
   - 授权重定向 URI：`https://your-domain.com/api/auth/callback/google`
5. 复制 **客户端 ID** 和 **客户端密钥**
6. 添加到环境变量

## 自定义域名

在 Vercel Dashboard 中：
1. 进入项目设置
2. 点击 **Domains**
3. 添加你的域名：`feiyu-imagebackgroundremover.shop`
4. 按照提示配置 DNS

## 项目结构

```
image-bg-remover-next/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth API routes
│   │   └── remove-bg/      # 背景移除 API
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   └── globals.css         # 全局样式
├── docs/
│   └── mvp-requirements.md # MVP 需求文档
├── .env.local.example      # 环境变量示例
├── next.config.ts          # Next.js 配置
├── tailwind.config.ts      # Tailwind 配置
└── package.json
```

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

## 成本说明

- **Remove.bg API**: 免费 50 次/月，付费 $0.20/张起
- **Vercel**: 免费额度足够个人项目使用
- **Google OAuth**: 免费

## 许可证

MIT License

## 作者

飞鱼 (feiyu-coder)

## 贡献

欢迎提交 Issue 和 Pull Request！
