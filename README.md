# 老板来了 - 上班摸鱼醒脑神器

一款适合上班摸鱼时玩的 30 秒醒脑反应小游戏。

## 游戏介绍

玩家在办公室摸鱼，老板会随机出现，玩家需要在规定时间内点击"伪装工作"按钮。如果反应及时则继续游戏，如果反应太慢则被老板抓包，游戏结束。

## 游戏玩法

1. 游戏总时长 30 秒
2. 玩家默认处于"摸鱼中"状态，分数每秒自动增加 10 分
3. 老板随机出现：
   - 前 10 秒：老板每 4-6 秒出现一次
   - 中间 10 秒：老板每 3-4 秒出现一次
   - 最后 10 秒：老板每 2-3 秒出现一次
4. 老板出现时，玩家需要在 1.2 秒内点击"伪装工作"按钮
5. 成功伪装：分数 +50，combo +1
6. 超时未点击：游戏结束

## 称号系统

- 0-200 分：实习摸鱼员
- 200-500 分：职场老油条
- 500-800 分：办公室影帝
- 800 分以上：摸鱼宗师

## 项目结构

```
├── game.js                 # 入口文件
├── game.json              # 小游戏配置
├── project.config.json    # 项目配置
├── js/
│   ├── main.js           # 游戏主循环
│   ├── gameState.js      # 游戏状态管理
│   ├── player.js         # 玩家数据
│   ├── boss.js           # 老板出现和检测逻辑
│   ├── scene.js          # 场景绘制
│   ├── ui.js             # 按钮、文字、页面绘制
│   └── utils.js          # 随机数、时间工具函数
└── README.md             # 项目说明
```

## 使用方法

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择本项目目录
4. 点击"预览"或"编译"即可运行

## 技术特点

- 使用微信小游戏原生 Canvas 2D 实现
- 不依赖复杂游戏引擎
- 代码结构清晰，按模块拆分
- Canvas 自适应不同屏幕尺寸
- 点击区域准确
- 游戏状态切换清晰

## 开发说明

- 项目使用 ES6+ 语法
- 采用模块化设计
- 代码中添加了必要注释

## 注意事项

- 本项目仅供学习和娱乐使用
- 请勿在工作时间过度游玩
- 如被老板发现，后果自负 😄

## 部署方式

### 微信小游戏

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择本项目根目录
4. 点击"预览"或"编译"即可运行

### Cloudflare Pages 部署

本项目支持部署到 Cloudflare Pages，让游戏可以在网页上运行。

#### 方法一：使用 Wrangler CLI

```bash
# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Cloudflare Pages
wrangler pages deploy ./web
```

#### 方法二：使用 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages 页面
3. 点击 "Create a project"
4. 连接你的 GitHub 仓库
5. 设置构建配置：
   - 构建命令：留空
   - 构建输出目录：`web`
6. 点击 "Save and Deploy"

#### 方法三：直接上传

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages 页面
3. 点击 "Upload assets"
4. 上传 `web` 目录下的所有文件
5. 点击 "Deploy"

### 访问游戏

部署完成后，Cloudflare 会提供一个域名，例如：
```
https://boss-coming.pages.dev
```

通过该域名即可在浏览器中玩游戏。

## 项目结构

```
├── game.js                 # 微信小游戏入口
├── game.json              # 小游戏配置
├── project.config.json    # 项目配置
├── wrangler.toml          # Cloudflare 部署配置
├── js/
│   ├── main.js           # 游戏主循环（微信版）
│   ├── gameState.js      # 游戏状态管理
│   ├── player.js         # 玩家数据
│   ├── boss.js           # 老板逻辑
│   ├── scene.js          # 场景绘制
│   ├── ui.js             # UI绘制
│   ├── utils.js          # 工具函数
│   └── polyfill.js       # 兼容性补丁
├── web/
│   ├── index.html        # Web版入口页面
│   ├── web-game.js       # Web版游戏代码（合并版）
│   ├── _headers          # Cloudflare Headers配置
│   └── _redirects        # Cloudflare Redirects配置
└── README.md             # 项目说明
```

## 许可证

MIT License
