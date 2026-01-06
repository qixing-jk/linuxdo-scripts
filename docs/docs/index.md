---
layout: home

hero:
  name: LinuxDo Scripts
  tagline: 持续更新，提供更强大的论坛体验，欢迎贡献您的创意！
  image:
    src: https://github.com/anghunk/linuxdo-scripts/blob/main/public/icon/128.png?raw=true
    alt: 文档封面
  actions:
    - theme: brand
      text: 使用指南
      link: /guide/0-home/home.html
    - theme: alt
      text: GitHub
      link: https://github.com/anghunk/linuxdo-scripts
    - theme: alt
      text: Chrome 安装
      link: https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj
    - theme: alt
      text: Firefox 安装
      link: https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/

features:
  - icon: ⚡
    title: 体验优化
    details: 快捷操作、自动化功能、新标签页打开话题、中英文混排优化显示等
  - icon: 🔍
    title: 互动增强
    details: 快捷回复、等级信息查询、快捷点赞按钮、自动展开回复等
  - icon: 🤖
    title: AI 智能助手
    details: 话题总结、内容智能分析、智能回复生成等
  - icon: 📚
    title: 内容管理
    details: 完善的收藏夹功能、用户标签系统、关键词和标签过滤等
  - icon: 🎨
    title: 个性化定制
    details: 支持自定义 CSS、论坛表情风格切换、多种主题皮肤等
  - icon: 🔧
    title: 实用工具
    details: 话题转图片分享、论坛文章导出、返回顶部、快速免打扰帖子等
---


#### 1. 如何使用 LinuxDo Scripts 扩展设置？

安装扩展，重新进入 linux.do 论坛，将鼠标移动至浏览器最左侧边缘区域，可以触发设置按钮显示。

![Demonstration](./Demonstration.png)

#### 2. 扩展有哪些功能特性？

<details>
<summary>🔍 浏览体验优化</summary>

- ⏰ 话题列表显示创建时间
- 🏢 显示楼层数和楼主标识
- 🆕 新标签页打开话题
- 👀 话题列表直接预览详情及评论
- 📝 中英文混排优化显示
- 🖼️ 优化签名图显示，防止图片损坏
- 🌙 自动切换黑夜模式
- 📱 超长显示器宽度优化

</details>

<details>
<summary>📚 内容管理</summary>

- ⭐ 完善的收藏夹功能
- 🏷️ 用户标签系统
- 🚫 强制屏蔽指定用户话题
- 👑 只看楼主切换功能
- 🔍 关键词和标签过滤
- 📅 按时间屏蔽旧帖子

</details>

<details>
<summary>💬 互动增强</summary>

- ⚡ 话题快捷回复（支持自定义模板）
- 😊 评论框表情优化
- 📊 等级信息查询
- 👍 快捷点赞按钮
- 🔄 自动展开回复

</details>

<details>
<summary>🤖 AI 智能助手</summary>

- 📋 AI 话题总结
- 💡 智能生成回复
- 🤝 AI 辅助回帖
- 🎯 内容智能分析

</details>

<details>
<summary>🎨 个性化定制</summary>

- 🎭 多种论坛主题皮肤
- 😀 论坛表情风格切换
- 🎨 自定义 CSS 样式支持
- ☁️ 设置数据云端同步
- 🖼️ 自定义论坛 Logo
- 📑 自定义标签页图标和标题

</details>

<details>
<summary>🔧 实用工具</summary>

- 📸 话题转图片分享
- 📄 论坛文章导出
- ⬆️ 返回顶部/直达一楼
- 🔕 快速免打扰帖子
- 🎯 查看自己的回复楼层

</details>

<style>
.VPHero .text {
  font-size: 18px;
}

.VPImage {
  border-radius: 50%;
}

:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(40px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
  .clip {
    font-size:45px !important;
  }
  .tagline {
    font-size:20px !important;
  }
}
</style>