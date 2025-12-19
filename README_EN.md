[Chinese Simplified](README.md) | [English](README_EN.md)

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
    <a href="https://linuxdo-scripts.zishu.me">Documentation</a>
    ·
    <a href="https://github.com/anghunk/linuxdo-scripts/issues/new/choose">Feedback</a>
    ·
    <a href="https://github.com/anghunk/linuxdo-scripts/releases/latest">Latest Version</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/v/release/anghunk/linuxdo-scripts?logo=github&label=Version">
    <img src="https://img.shields.io/github/stars/anghunk/linuxdo-scripts?logo=github&style=flat&label=Stars">
    <img src="https://img.shields.io/chrome-web-store/users/fbgblmjbeebanackldpbmpacppflgmlj?style=flat&logo=googlechrome&label=ChromeWebStore">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache">
  </p>
</div>

## 📖 I. Project Overview

LinuxDo Scripts is a feature-rich browser extension designed to enhance the user experience on the LinuxDo forum. It integrates a variety of practical features ranging from basic interface optimization to advanced AI assistance, making your forum browsing and interaction experience more smooth and efficient.

> [!note]
> Forum discussion post: [LinuxDo Enhancement Plugin, continues to update, welcome feedback - LINUX DO](https://linux.do/t/topic/170951), QQ Communication Group: 1035556246
>
> Already compatible with [idcflare.com](https://idcflare.com) website.

### 1. Key Features
- 🎨 **Interface Enhancement** - Multiple theme skins for personalization
- 🤖 **AI Intelligence** - Topic summary, intelligent reply generation
- 📚 **Content Management** - Favorites, user tags, content filtering
- ⚡ **Experience Optimization** - Quick actions, automated features
- 🔧 **Highly Customizable** - Supports custom CSS, quick replies, etc.

![Main Image](https://github.com/user-attachments/assets/1b0039de-3f3e-420b-9a91-6bc651e8c8e5)

<details>
<summary>More Screenshots</summary>
  
![Usage Method](https://github.com/user-attachments/assets/514b92b7-deb3-4eee-80cd-c2203f4661b8)
![Favorites Enhanced](https://github.com/user-attachments/assets/0523929c-c825-40b8-817e-1f9ea06a01ea)
![Share Post](https://github.com/user-attachments/assets/07728ccc-4032-431d-bf70-e32b7a8e2289)

</details>

## 📥 II. Quick Installation

### 1. Supported Browsers

| Browser                          | Install Link                                                                                      | Notes     |
| ------------------------------- | --------------------------------------------------------------------------------------------- | -------- |
| **Chrome / Edge / Arc / Brave** | [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj) | Recommended |
| **Firefox**                     | [Firefox Add-ons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)            | Recommended |
| **Chinese Users**               | [Crx Store](https://www.crxsoso.com/webstore/detail/fbgblmjbeebanackldpbmpacppflgmlj)          | No need to cross the wall |

### 2. Installation Steps
1. Click the installation link for the corresponding browser above
2. Click "Add to Browser" in the extension store
3. Confirm the installation permissions
4. Go to [LinuxDo Forum](https://linux.do) to start using it

## ✨ III. Features

<details>
<summary>🔍 Browser Experience Optimization</summary>

- ⏰ Topic list shows creation time
- 🏢 Display floor count and original poster identifier
- 🏢 Open topic in a new tab
- 👀 Directly preview details and comments in the topic list
- 📝 Optimize display of mixed Chinese and English text
- 🖼️ Optimize signature image display, prevent image damage
- 🌙 Automatically switch to dark mode
- 📱 Optimize for ultra-wide screen width

</details>

<details>
<summary>📚 Content Management</summary>

- ⭐ Comprehensive favorites feature
- 🏷️ User tag system
- 🚫 Force block specific user topics
- 👑 Only view the original poster switch feature
- 🔍 Keyword and tag filtering
- 📅 Block old posts by time

</details>

<details>
<summary>💬 Interaction Enhancement</summary>

- ⚡ Quick reply to topics (supports custom templates)
- 😊 Optimized comment box emojis
- 📊 Level information query
- 👍 Quick like button
- 🔄 Automatically expand replies

</details>

<details>
<summary>🤖 AI Assistant</summary>

- 📋 AI topic summary
- 💡 Intelligent reply generation
- 🤝 AI-assisted post replies
- 🎯 Intelligent content analysis

</details>

<details>
<summary>🎨 Personalization</summary>

- 🎭 Multiple forum theme skins
- 😀 Switch forum emoji style
- 🎨 Support for custom CSS styles
- ☁️ Set data cloud synchronization
- 🖼️ Custom forum logo
- 📑 Custom tab icon and title

</details>

<details>
<summary>🔧 Useful Tools</summary>

- 📸 Topic to image sharing
- 📄 Forum article export
- ⬆️ Back to top/direct to the first floor
- 🔕 Quick no-disturbance post
- 🎯 View your reply floor

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

# 3. Start the development service
npm run dev
```

### 3. Load Extension
1. Open the browser extension management page
   - Chrome: `chrome://extensions/`
   - Firefox: `about:addons`
2. Enable "Developer mode"
3. Click "Load unpacked extension"
4. Select the `.output/chrome-mv3` folder in the project root directory

### 4. Development Specifications
- 🧩 **Component-based Development**: Each function has an independent component, avoiding conflicts
- 🔄 **Pull Request Process**: PR → Code review → Merge
- 📚 **Documentation Update**: New features require documentation updates

## 🤝 V. Contributing

### 1. Contribution Methods
- 🐛 [Report Bug](https://github.com/anghunk/linuxdo-scripts/issues/new?template=bug_report.yml)
- 💡 [Feature Suggestion](https://github.com/anghunk/linuxdo-scripts/issues/new?template=feature_report.yml)
- 🔧 [Submit Code](https://github.com/anghunk/linuxdo-scripts/pulls)
- 🙍‍♂️ [Join Discussion](https://discord.gg/3wDmhCsVeU)

### 2. Contribution List
![Contributors](https://contrib.rocks/image?repo=anghunk/linuxdo-scripts)

### 3. Reference Projects

- https://linux.do/t/topic/850824 - Emperor Juice Emojis Feature

## 📄 VI. Other Information

### 1. Star History

[![Star History Chart](https://api.star-history.com/svg?repos=anghunk/linuxdo-scripts&type=Timeline)](https://www.star-history.com/#anghunk/linuxdo-scripts&Timeline)

### 2. Open Source License

This project is licensed under the [Apache License 2.0](https://github.com/anghunk/linuxdo-scripts/blob/main/LICENSE).

**You are free to:**
- ✅ Use, copy, modify, and distribute this software
- ✅ Use for commercial purposes
- ✅ Re-license under the terms of this license

**But must:**
- 📋 Retain the original copyright statement
- 📋 State modifications to the original code

### 3. Disclaimer

- This project is a **free and open-source project** and does not guarantee absolute perfection and accuracy
- Please evaluate the risks and comply with relevant laws and regulations before use
- Prohibit any form of abuse
- If there is any infringement, please contact [@anghunk](https://github.com/anghunk) for timely handling

---

![](https://invidget.wdh.app/3wDmhCsVeU)

<div align="center">
  <p>
  If this project is helpful to you, please consider giving us a ⭐ Star!
  
  Or [buy me a coffee](./Sponsor.md)
  </p>
  <p>Made with ❤️ by <a href="https://github.com/anghunk">@anghunk</a> and <a href="https://github.com/anghunk/linuxdo-scripts/graphs/contributors">contributors</a></p>
</div>