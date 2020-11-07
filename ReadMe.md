![Kratos-Rebirth](https://repository-images.githubusercontent.com/132322562/46429300-7da7-11ea-8c82-d03503cb17b8)

## 🍭 关于主题

一只移植的主题，兼具亮暗双主题，身负多种小挂件，短能卡片列首页，长能文章读更多，退可罗列全归档，进可搜索全文章，相关介绍可以参见[主题说明](https://candinya.com/posts/Kratos-Rebirth/)页面哦~

[![构建版本](https://img.shields.io/github/v/release/Candinya/Kratos-Rebirth)](https://github.com/Candinya/Kratos-Rebirth/releases/latest)
[![样例站点部署状态](https://github.com/Candinya/Kratos-Rebirth/workflows/Build%20Demo%20Site/badge.svg)](https://kr-demo.candinya.com/)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCandinya%2FKratos-Rebirth.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FCandinya%2FKratos-Rebirth?ref=badge_shield)

[样例站点](https://kr-demo.candinya.com)自动部署已经上线，具体可以参照这篇日志：[使用Github Actions部署主题样例站](https://candinya.com/posts/theme-demo-deployment-with-github-actions/)

全新的配置文档增加了！戳[这里](https://candinya.com/posts/Kratos-Rebirth-Manual/)查看更多~

或者也可以去[项目Wiki](https://github.com/Candinya/Kratos-Rebirth/wiki)里面找找哦~

有为这个主题专门开发两个页面，详见[Kratos-Rebirth-Specified-Pages](https://github.com/Candinya/Kratos-Rebirth-Specified-Pages)

核心结构&样式来源：[@MoeDog](https://github.com/xb2016) 狗狗大佬的[Kratos](https://github.com/xb2016/kratos)的某个上古版本

## 💞 特别提示

1. 为了防止更新时配置文件的更新覆盖掉您的配置文件，主题的主配置文件是需要您**手动**复制一份`_config.yml.example`，并改名为`_config.yml`才可正常读取与使用的，请千万不要忘记啦。之前版本的站点配置文件从这个版本开始已经**不需要**加入了，使用[带上主题设置加载Hexo自定义功能](https://candinya.com/posts/process-with-theme-config-using-process-after/)的方法即可在代码生成阶段就完成主题配置的读取，进而在监听运行时也能完美地调用相关的配置参数。同时，也可以使用同样的方法精简掉JavaScript的配置，不必再去翻找那些被压缩得面目全非的代码啦。

2. 这个Branch之后会持续加入一些也许是Hexo 5的新特性，这些特性未必完全兼容Hexo 4，如果您使用的是Hexo 4.x的话您可以移步[hexo-4 branch](https://github.com/Candinya/Kratos-Rebirth/tree/hexo-4)哦，或是更为推荐的，将Hexo升级至5.x版本呢。

## 🍬超棒的赞助者们

- @vensing [GitHub](https://github.com/vensing) [Blog](https://vensing.com/)
- @TsumugiWenders [GitHub](https://github.com/TsumugiWenders) [Blog](https://blog.nekopara.net/)

## 🎁 使用环境小贴士

为了获得更佳的使用体验，建议安装的插件有：

- hexo-generator-index-pin-top
- hexo-generator-feed

请注意，不同版本的 Hexo 及相关附属对于此模板的兼容性可能会存在一定的冲突，此处附上开发环境的`package.json`：

``` json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  },
  "hexo": {
    "version": "5.2.0"
  },
  "dependencies": {
    "hexo": "^5.2.0",
    "hexo-deployer-git": "^2.1.0",
    "hexo-generator-archive": "^1.0.0",
    "hexo-generator-category": "^1.0.0",
    "hexo-generator-feed": "^3.0.0",
    "hexo-generator-index-pin-top": "^0.2.2",
    "hexo-generator-sitemap": "^2.1.0",
    "hexo-generator-tag": "^1.0.0",
    "hexo-renderer-ejs": "^1.0.0",
    "hexo-renderer-marked": "^3.3.0",
    "hexo-renderer-stylus": "^2.0.1",
    "hexo-server": "^2.0.0"
  }
}
```

## 🍩 二次开发相关

为了保证最终上线产品的有效空间利用，我们引入了gulp对静态资源文件（js、css）进行压缩；因而您在src文件夹下直接修改的静态文件会无法实时生效，请安装gulp及相应的插件（在主题文件夹下`npm install`，使用`npx gulp`指令开启压缩与文件监听应该即可），以便压缩静态文件；

另外，单次压缩完成后不退出是正常现象（因为有watch关注文件变化，当出现静态文件变化则直接自动构建压缩后版本，无需手动再执行npx gulp；在控制台Ctrl+C可结束进程；若您不希望自动监听，而是每次都使用构建的话，您可以直接将gulpfile.js的watch那一行（第44行）注释或是删除掉均可。

## 💮 非常感谢

- [Kratos-pjax](https://github.com/xb2016/kratos-pjax)
- [hexo-theme-sagiri](https://github.com/DIYgod/diygod.me/tree/master/themes/sagiri)
- [hexo-theme-suka](https://github.com/SukkaW/hexo-theme-suka)
- [hexo-theme-landscape](https://github.com/hexojs/hexo-theme-landscape)
- [DisqusJS](https://github.com/SukkaW/DisqusJS)
- [APlayer](https://github.com/MoePlayer/APlayer)
- [NProgress](https://github.com/rstacruz/nprogress)
- [CloudFlare](https://www.cloudflare.com/)
- [jsDelivr](https://www.jsdelivr.com/)

## 🎉 特别赞助

[![JetBrains](https://user-images.githubusercontent.com/20502130/90419395-14409500-e0e9-11ea-8b3b-ade4589dca84.png)](https://www.jetbrains.com/?from=Kratos%20%3a%20Rebirth)

## 🎵 证书

- GNU General Public License v3

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCandinya%2FKratos-Rebirth.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FCandinya%2FKratos-Rebirth?ref=badge_large)
