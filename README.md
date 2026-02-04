[简体中文](README.md) | [English](README_EN.md)

<div align="center">
  <a href="https://github.com/anghunk/linuxdo-scripts">
    <img src="https://github.com/anghunk/linuxdo-scripts/blob/main/public/icon/128.png?raw=true" alt="Logo" width="80" height="80">
  </a>

  <h1>LinuxDo Scripts</h1>

  <p>

[Discord](https://discord.gg/n2pErsD7Kg) ·
[使用文档](https://linuxdo-scripts.zishu.me) ·
[更新日志](http://linuxdo-scripts.zishu.me/version-log) ·
[问题反馈](https://github.com/anghunk/linuxdo-scripts/issues/new/choose) ·
[最新版本](https://github.com/anghunk/linuxdo-scripts/releases/latest)

  </p>
  
  <p>

[![](https://img.shields.io/github/v/release/anghunk/linuxdo-scripts?logo=github&label=Version&style=flat-square)](https://github.com/anghunk/linuxdo-scripts/releases)
![](https://img.shields.io/github/stars/anghunk/linuxdo-scripts?logo=github&style=flat-square&label=Stars)
[![](https://img.shields.io/chrome-web-store/users/fbgblmjbeebanackldpbmpacppflgmlj?style=flat-square&logo=googlechrome&label=ChromeWebStore)](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)
![](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)

  </p>
</div>

## 一、项目简介

LinuxDo Scripts 是一个功能丰富的浏览器扩展，专为提升 LinuxDo 论坛的使用体验而设计。它集成了从基础界面优化到高级 AI 辅助的多项实用功能，让您的论坛浏览和互动体验更加流畅高效。

> [!note]
> 论坛交流贴：[linuxdo 增强插件，持续更新欢迎反馈 - LINUX DO](https://linux.do/t/topic/170951)，QQ 交流群：1035556246
>
> 已同步兼容 [idcflare.com](https://idcflare.com) 网站。

更多功能查看前往 [LinuxDo Scripts 文档](https://linuxdo-scripts.zishu.me)

![主图](https://github.com/user-attachments/assets/1b0039de-3f3e-420b-9a91-6bc651e8c8e5)

<details>
<summary>更多截图展示</summary>
  
![使用方式](https://github.com/user-attachments/assets/514b92b7-deb3-4eee-80cd-c2203f4661b8)
![收藏夹增强](https://github.com/user-attachments/assets/0523929c-c825-40b8-817e-1f9ea06a01ea)
![分享贴子](https://github.com/user-attachments/assets/07728ccc-4032-431d-bf70-e32b7a8e2289)

</details>

## 二、快速安装

### 1. 支持的浏览器

| 浏览器                          | 安装链接                                                                                      | 备注     |
| ------------------------------- | --------------------------------------------------------------------------------------------- | -------- |
| **Chrome / Edge / Arc / Brave** | [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj) | 推荐     |
| **Firefox**                     | [Firefox Addons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)            | 推荐     |
| **国内用户**                    | [Crx 商店](https://www.crxsoso.com/webstore/detail/fbgblmjbeebanackldpbmpacppflgmlj)          | 无需翻墙 |

### 2. 安装步骤

1. 点击上方对应浏览器的安装链接
2. 在扩展商店中点击"添加到浏览器"
3. 确认安装权限
4. 访问 [LinuxDo 论坛](https://linux.do) 开始使用

## 四、开发指南

### 1. 环境要求

- **Node.js**: `v22.12.0`

### 2. 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/anghunk/linuxdo-scripts.git
cd linuxdo-scripts

# 2. 安装依赖
npm install

# 3. 启动开发服务
npm run dev
```

### 3. 加载扩展

1. 打开浏览器扩展管理页面
   - Chrome: `chrome://extensions/`
   - Firefox: `about:addons`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目根目录下的 `.output/chrome-mv3` 文件夹

### 4. 开发规范

- 🧩 **组件化开发**: 每个功能独立组件，避免冲突
- 🔄 **提交流程**: PR → 代码审核 → 合并
- 📚 **文档更新**: 新功能需同步更新文档

## 五、参与贡献

### 1. 贡献方式

- 🐛 [报告 Bug](https://github.com/anghunk/linuxdo-scripts/issues/new?template=bug_report.yml)
- 💡 [功能建议](https://github.com/anghunk/linuxdo-scripts/issues/new?template=feature_report.yml)
- 🔧 [提交代码](https://github.com/anghunk/linuxdo-scripts/pulls)
- 🙍‍♂️ [加入讨论](https://discord.gg/n2pErsD7Kg)

### 2. 贡献列表

一如既往，感谢我们出色的贡献者们！

![Contributors](https://contrib.rocks/image?repo=anghunk/linuxdo-scripts)

### 3. 参考项目

- https://linux.do/t/topic/850824 - 始皇酱表情包功能

## 六、其他信息

### 1. Star History

[![Star History Chart](https://api.star-history.com/svg?repos=anghunk/linuxdo-scripts&type=Timeline)](https://www.star-history.com/#anghunk/linuxdo-scripts&Timeline)

### 2. 开源协议

本项目采用 [Apache License 2.0](https://github.com/anghunk/linuxdo-scripts/blob/main/LICENSE) 开源协议。

**您可以自由地：**

- ✅ 使用、复制、修改和分发本软件
- ✅ 用于商业目的
- ✅ 在遵循协议的前提下重新授权

**但需要：**

- 📋 保留原始版权声明
- 📋 标明对原始代码的修改

### 3. 免责声明

- 本项目为**免费开源**项目，不保证绝对完善无误
- 使用前请自行评估风险，遵守相关法律法规
- 严禁任何形式的滥用行为
- 如有侵权问题，请联系 [@anghunk](https://github.com/anghunk) 及时处理

---

![](https://invidget.wdh.app/3wDmhCsVeU)

<div align="center">
  <p>
  如果这个项目对您有帮助，请考虑给我们一个 ⭐ Star！
    
  或者 [打赏一杯咖啡](https://github.com/anghunk/anghunk/blob/main/Sponsor.md) 
  </p>
  <p>Made with ❤️ by <a href="https://github.com/anghunk">@anghunk</a> and <a href="https://github.com/anghunk/linuxdo-scripts/graphs/contributors">contributors</a></p>
</div>
