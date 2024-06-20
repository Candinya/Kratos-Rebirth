![Kratos : Rebirth](https://candymade.net/assets/screenshots/kratos-rebirth/all-platforms.png)

> (截图模板来自 [Vectonauta on Freepik](https://www.freepik.com/free-psd/isolated-tablet-laptop-smartphone-composition_40505824.htm) )

<div align="center">

[![构建版本](https://img.shields.io/github/v/release/Candinya/Kratos-Rebirth?style=for-the-badge)](https://github.com/Candinya/Kratos-Rebirth/releases/latest)
[![npm版本](https://img.shields.io/npm/v/hexo-theme-kratos-rebirth?color=red&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/hexo-theme-kratos-rebirth)
[![样例站点部署状态](https://img.shields.io/github/actions/workflow/status/Candinya/Kratos-Rebirth/build-demo.yml?style=for-the-badge&logo=github&label=Build%20Demo%20Site)](https://dev.krt.moe/)

</div>

## 🍭 关于主题

最初是一个从 Wordpress 移植过来的主题，抱着别浪费原开发者辛勤劳动的血汗成果的心态接手继续开发，竟逐渐迭代出了一套属于自己的生态。

<!-- TODO：在 Wiki 里继续扩展 -->

## 💞 安装使用

当前主题正在开发全新的 V3 版本，相关的流程还未完全准备就绪；如果您需要参考 V2 的部署文档，您可以前往 [branch/v2] 来查看相关的内容。

需要注意的是， V3 版本的使用方法和 V2 会有非常大的改变，届时我们将会整理出一份详细的迁移文档供您参考。

[branch/v2]: https://github.com/Candinya/Kratos-Rebirth/tree/v2

<!-- TODO：基于 https://github.com/kratos-rebirth/quickstart 模板初始化，把详细流程和配置说明放到 Wiki 里 -->

## 💬 周边生态支持

出于扩展性考虑， V3 版本开始的主题将不再内置具体的生态插件（如评论或是站点音乐播放器等），您可以根据自己的需要自行引入对应的资源文件。我们将会提供一个详细的文档说明，以及一些 V2 版本时可用的平台的相关样例。

<!-- TODO：模板写到 Wiki 里，具体的评论实现和配置写到 ecosystem 里 -->

## 🍩 二次开发

V3 版本的二次开发工作流与 V2 版本相差不大，主要的变化为提交时不再需要构建资源文件，转而使用 CI 在打包上传时自动构建。如果您有二次开发或是传统使用方式（放置在站点的 themes 目录下）的需求，您需要注意手动构建最新的资源文件。

我们使用 pnpm 作为包管理工具，它比起 yarn 和 npm 这种传统解决方案来说更注重节约硬盘空间，可以在一定程度上避免银河系中心黑洞级的 node_modules 目录出现。

<!-- TODO：写到 Wiki 里 -->

## 💮 非常感谢

### 开发者

[![贡献者](https://kratos-rebirth.github.io/contributors-graph/contributors.svg)](https://github.com/Candinya/Kratos-Rebirth/graphs/contributors)

以及几位特别开发者：

| 完成的工作                | 开发者       |
| ------------------------- | ------------ |
| 基础项目 Kratos 开发      | Seaton Jiang |
| 基础项目 Kratos-M2 开发   | MoeDog       |
| 基础项目 Kratos-Hexo 开发 | 蓝冰记忆     |

### 用户们

- 各位一直以来都坚持陪伴着我们的用户们 <!-- TODO：链接到 awesome 页面 -->

### 项目

请参见 Wiki （等待补充）

<!-- （从编辑历史里找这块对应的内容） -->

## 🎵 开源授权

| 组件 | 授权                            |
| ---- | ------------------------------- |
| 代码 | [GNU General Public License v3] |
| 文档 | [CC BY-SA 4.0 DEED]             |

[GNU General Public License v3]: https://www.gnu.org/licenses/gpl-3.0.zh-cn.html
[CC BY-SA 4.0 DEED]: https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans
