[Simplified Chinese](README.md) | [English](README_EN.md)

```
  _     _                  ____          ____            _       _       
 | |   (_)_ __  _   ___  _|  _ \  ___   / ___|  ___ _ __(_)_ __ | |_ ___ 
 | |   | | '_ \| | | \ \/ / | | |/ _ \  \___ \ / __| '__| | '_ \| __/ __|
 | |___| | | | | |_| |>  <| |_| | (_) |  ___) | (__| |  | | |_) | |_\__ \
 |_____|_|_| |_|\__,_/_/\_\____/ \___/  |____/ \___|_|  |_| .__/ \__|___/
                                                          |_|            
```

<div align="center">
  <a href="https://github.com/anghunk/linuxdo-scripts">
    <img src="https://github.com/anghunk/linuxdo-scripts/blob/main/public/icon/128.png?raw=true" alt="Logo" width="80" height="80">
  </a>

  <h1>LinuxDo Scripts</h1>

  <p>
    <a href="https://discord.gg/3wDmhCsVeU">Discord</a>
    ·
    <a href="https://linuxdo-scripts.zishu.me">Usage Documentation</a>
    ·
    <a href="https://github.com/anghunk/linuxdo-scripts/issues/new/choose">Feedback</a>
    ·
    <a href="https://github.com/anghunk/linuxdo-scripts/releases/latest">Latest Release</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/v/release/anghunk/linuxdo-scripts?logo=github&label=Version">
    <img src="https://img.shields.io/github/stars/anghunk/linuxdo-scripts?logo=github&style=flat&label=Stars">
    <img src="https://img.shields.io/chrome-web-store/users/fbgblmjbeebanackldpbmpacppflgmlj?style=flat&logo=googlechrome&label=ChromeWebStore">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache">
  </p>
</div>

## 📖 I. Project Introduction

LinuxDo Scripts is a feature-rich browser extension designed to enhance the user experience on the LinuxDo forum. It integrates a variety of practical features, from basic interface optimization to advanced AI assistance, making your forum browsing and interaction smoother and more efficient.

> [!note]
> Forum discussion thread: [linuxdo enhanced plugin, continuous updates welcome feedback - LINUX DO](https://linux.do/t/topic/170951)

> [!note]
> Compatibility has also been synchronized with the [idcflare.com](https://idcflare.com) website. (90% of features are compatible, with a few exceptions, such as: image generation for sharing.)

### 1. Core Highlights
- 🎨 **Interface Beautification** - Multiple theme skins, personalized customization
- 🤖 **AI Intelligence** - Topic summarization, intelligent reply generation
- 📚 **Content Management** - Favorites, user tags, content filtering
- ⚡ **Experience Optimization** - Quick operations, automated functions
- 🔧 **Highly Customizable** - Supports custom CSS, quick replies, etc.

![Main Image](https://github.com/user-attachments/assets/1b0039de-3f3e-420b-9a91-6bc651e8c8e5)

<details>
<summary>More Screenshot Demonstrations</summary>
  
![How to Use](https://github.com/user-attachments/assets/514b92b7-deb3-4eee-80cd-c2203f4661b8)
![Favorite Enhancement](https://github.com/user-attachments/assets/0523929c-c825-40b8-817e-1f9ea06a01ea)
![Share Post](https://github.com/user-attachments/assets/07728ccc-4032-431d-bf70-e32b7a8e2289)

</details>

## 📥 II. Quick Installation

### 1. Supported Browsers

| Browser                         | Installation Link                                                                             | Remarks         |
| ------------------------------- | --------------------------------------------------------------------------------------------- | --------------- |
| **Chrome / Edge / Arc / Brave** | [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj) | Recommended     |
| **Firefox**                     | [Firefox Addons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)            | Recommended     |
| **Users in China**              | [Crx Store](https://www.crxsoso.com/webstore/detail/fbgblmjbeebanackldpbmpacppflgmlj)         | No VPN required |

### 2. Installation Steps
1. Click the installation link for your browser above.
2. Click "Add to Browser" in the extension store.
3. Confirm installation permissions.
4. Visit the [LinuxDo Forum](https://linux.do) to start using.

## ✨ III. Features

<details>
<summary>🔍 Browsing Experience Optimization</summary>

- ⏰ Display creation time in topic list.
- 🏢 Show floor number and author identifier.
- 🆕 Open topics in a new tab.
- 👀 Directly preview topic details and comments in the topic list.
- 📝 Optimize display of mixed Chinese and English text.
- 🖼️ Optimize signature image display to prevent corruption.
- 🌙 Automatically switch to dark mode.
- 📱 Optimize for ultra-wide displays.

</details>

<details>
<summary>📚 Content Management</summary>

- ⭐ Comprehensive favorites functionality.
- 🏷️ User tagging system.
- 🚫 Force-block topics from specified users.
- 👑 Toggle to view only the original poster's posts.
- 🔍 Keyword and tag filtering.
- 📅 Block old posts by time.

</details>

<details>
<summary>💬 Interaction Enhancement</summary>

- ⚡ Quick replies to topics (supports custom templates).
- 😊 Optimized comment box emoticons.
- 📊 Query user level information.
- 👍 Quick "like" button.
- 🔄 Automatically expand replies.

</details>

<details>
<summary>🤖 AI Intelligent Assistant</summary>

- 📋 AI topic summarization.
- 💡 Intelligent reply generation.
- 🤝 AI-assisted replying.
- 🎯 Intelligent content analysis.

</details>

<details>
<summary>🎨 Personalization</summary>

- 🎭 Multiple forum theme skins.
- 😀 Forum emoticon style switching.
- 🎨 Support for custom CSS styles.
- ☁️ Cloud synchronization of settings.
- 🖼️ Customize forum logo.
- 📑 Customize tab icon and title.

</details>

<details>
<summary>🔧 Utility Tools</summary>

- 📸 Convert topics to image for sharing.
- 📄 Export forum articles.
- ⬆️ Return to top / Go directly to the first floor.
- 🔕 Quickly mute posts.
- 🎯 View your own reply floor.

</details>


## 🛠️ IV. Development Guide

### 1. Environment Requirements
- **Node.js**: `v22.12.0`

### 2. Local Development

```bash
# 1. Clone the project
git clone https://github.com/anghunk/linuxdo-scripts.git
cd linuxdo-scripts

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

### 3. Loading the Extension
1. Open your browser's extension management page:
   - Chrome: `chrome://extensions/`
   - Firefox: `about:addons`
2. Enable "Developer mode".
3. Click "Load unpacked extension".
4. Select the `.output/chrome-mv3` folder at the root of the project.

### 4. Development Conventions
- 🧩 **Component-based development**: Each feature is an independent component to avoid conflicts.
- 🔄 **Submission process**: PR → Code review → Merge.
- 📚 **Documentation update**: New features must be synchronized with documentation updates.

## 🤝 V. Contributing

### 1. Ways to Contribute
- 🐛 [Report a Bug](https://github.com/anghunk/linuxdo-scripts/issues/new?template=bug_report.yml)
- 💡 [Suggest a Feature](https://github.com/anghunk/linuxdo-scripts/issues/new?template=feature_report.yml)
- 🔧 [Submit Code](https://github.com/anghunk/linuxdo-scripts/pulls)
- 🙍‍♂️ [Join the Discussion](https://discord.gg/3wDmhCsVeU)

### 2. Contributors
![Contributors](https://contrib.rocks/image?repo=anghunk/linuxdo-scripts)

### 3. Reference Projects

- https://linux.do/t/topic/850824 - Shi Huang Jiang's emoticon pack feature

## 📄 VI. Other Information

### 1. Star History

[![Star History Chart](https://api.star-history.com/svg?repos=anghunk/linuxdo-scripts&type=Timeline)](https://www.star-history.com/#anghunk/linuxdo-scripts&Timeline)

### 2. License

This project is licensed under the [Apache License 2.0](https://github.com/anghunk/linuxdo-scripts/blob/main/LICENSE).

**You are free to:**
- ✅ Use, copy, modify, and distribute this software.
- ✅ Use for commercial purposes.
- ✅ Re-license under the terms of the agreement.

**But you must:**
- 📋 Retain the original copyright notice.
- 📋 Indicate modifications made to the original code.

### 3. Disclaimer

- This project is a **free and open-source** project and does not guarantee absolute perfection or error-freeness.
- Please assess the risks yourself before use and comply with relevant laws and regulations.
- Any form of abuse is strictly prohibited.
- For any infringement issues, please contact [@anghunk](https://github.com/anghunk) for timely resolution.

---

![](https://invidget.wdh.app/3wDmhCsVeU)

<div align="center">
  <p>If this project has been helpful to you, please consider giving us a ⭐ Star!</p>
  <p>Made with ❤️ by <a href="https://github.com/anghunk">@anghunk</a> and <a href="https://github.com/anghunk/linuxdo-scripts/graphs/contributors">contributors</a></p>
</div>