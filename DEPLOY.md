# Cloudflare Pages 自动部署配置指南

## 流水线说明

本项目配置了两个 GitHub Actions 工作流：

| 文件 | 触发条件 | 说明 |
|------|----------|------|
| `deploy.yml` | 推送到 `main` 分支 | 部署到生产环境 |
| `deploy-branch.yml` | 推送到其他分支 | 部署预览版本 |

## 配置步骤

### 第一步：获取 Cloudflare 凭证

#### 1. 获取 API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板（或使用自定义权限）
4. 权限设置：
   - **Account** - `Cloudflare Pages` - `Edit`
   - **Account** - `Account Settings` - `Read`
5. 点击 **Continue to summary** → **Create Token**
6. **复制并保存 Token**（只显示一次）

#### 2. 获取 Account ID

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在任意页面右侧栏可以看到 **Account ID**
3. 或访问：`https://dash.cloudflare.com/<ACCOUNT_ID>`
4. **复制 Account ID**

### 第二步：配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**，添加以下两个 Secret：

| Name | Value |
|------|-------|
| `CLOUDFLARE_API_TOKEN` | 你的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Account ID |

### 第三步：创建 Cloudflare Pages 项目（可选）

如果你想提前创建项目：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单点击 **Workers & Pages**
3. 点击 **Create application** → **Pages** → **Create a Pages project**
4. 项目名称填写：`boss-coming`
5. 直接点击 **Save**（不需要设置构建配置，由 GitHub Actions 处理）

### 第四步：推送代码触发部署

```bash
# 初始化 Git 仓库（如果还没有）
cd e:\WebstormProjects\WorkFish
git init
git add .
git commit -m "Initial commit: Boss Coming game"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/boss-coming.git

# 推送到 main 分支触发部署
git branch -M main
git push -u origin main
```

## 部署结果

### 生产环境
推送到 `main` 分支后部署到：
```
https://boss-coming.pages.dev
```

### 预览版本
其他分支推送到后部署到：
```
https://<分支名>.boss-coming.pages.dev
```

## 查看部署状态

1. 进入 GitHub 仓库的 **Actions** 标签
2. 可以看到部署工作流的运行状态
3. 点击可以查看详细日志

## 自定义域名（可选）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **boss-coming**
3. 点击 **Custom domains**
4. 点击 **Set up a custom domain**
5. 输入你的域名并按照提示配置 DNS

## 常见问题

### Q: 部署失败怎么办？

检查以下内容：
1. GitHub Secrets 是否正确配置
2. API Token 权限是否足够
3. 查看 Actions 日志了解具体错误

### Q: 如何回滚版本？

在 Cloudflare Dashboard 的 Pages 项目中：
1. 点击 **Deployments**
2. 找到想要回滚的版本
3. 点击 **Rollback to this deployment**

### Q: 如何关闭自动部署？

删除 `.github/workflows/` 目录下的 yml 文件即可。
