![Kratos-Rebirth](https://repository-images.githubusercontent.com/132322562/46429300-7da7-11ea-8c82-d03503cb17b8)

## 关于这个主题

一只移植的主题，主要是个人使用，相关介绍可以参见主题说明页面~

![构建版本](https://img.shields.io/github/v/release/Candinya/Kratos-Rebirth)
![样例站点部署状态](https://github.com/Candinya/Kratos-Rebirth/workflows/Build%20Demo%20Site/badge.svg)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCandinya%2FKratos-Rebirth.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FCandinya%2FKratos-Rebirth?ref=badge_shield)

[样例站点](https://kr-demo.candinya.com)自动部署已经上线，具体可以参照这篇日志：[使用Github Actions部署主题样例站](https://candinya.com/posts/theme-demo-deployment-with-github-actions/)

全新的配置文档增加了！戳[这里](https://candinya.com/posts/Kratos-Rebirth-Manual/)查看更多~

有为这个主题专门开发两个页面，详见[Kratos-Rebirth-Specified-Pages](https://github.com/Candinya/Kratos-Rebirth-Specified-Pages)

核心结构&样式来源：[@MoeDog](https://github.com/xb2016) 狗狗大佬的[Kratos](https://github.com/xb2016/kratos)的某个上古版本

## 超棒的赞助者们

- @vensing [GitHub](https://github.com/vensing) [Blog](https://vensing.com/)

## 特别提示

在运行之前，请您将`_config.yml.site.example`文件内的数据，复制到您**站点**的_config.yml中，否则可能会对相关代码的功能造成影响。

## 关于使用的环境

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
    "version": "4.2.0"
  },
  "dependencies": {
    "hexo": "^4.2.0",
    "hexo-generator-archive": "^1.0.0",
    "hexo-generator-category": "^1.0.0",
    "hexo-generator-feed": "^2.2.0",
    "hexo-generator-index-pin-top": "^0.2.2",
    "hexo-generator-sitemap": "^2.0.0",
    "hexo-generator-tag": "^1.0.0",
    "hexo-renderer-ejs": "^1.0.0",
    "hexo-renderer-marked": "^2.0.0",
    "hexo-renderer-stylus": "^1.1.0",
    "hexo-server": "^1.0.0"
  }
}
```

## 关于二次开发

为了保证最终上线产品的有效空间利用，我们引入了gulp对静态资源文件（js、css）进行压缩；因而您在src文件夹下直接修改的静态文件会无法实时生效，请安装gulp及相应的插件（在主题文件夹下`npm install`，使用`npx gulp`指令开启压缩与文件监听应该即可），以便压缩静态文件；

另外，单次压缩完成后不退出是正常现象（因为有watch关注文件变化，当出现静态文件变化则直接自动构建压缩后版本，无需手动再执行npx gulp；在控制台Ctrl+C可结束进程；若您不希望自动监听，而是每次都使用构建的话，您可以直接将gulpfile.js的watch那一行（第44行）注释或是删除掉均可。

## 非常感谢

- [Kratos-pjax](https://github.com/xb2016/kratos-pjax)
- [hexo-theme-sagiri](https://github.com/DIYgod/diygod.me/tree/master/themes/sagiri)
- [hexo-theme-suka](https://github.com/SukkaW/hexo-theme-suka)
- [hexo-theme-landscape](https://github.com/hexojs/hexo-theme-landscape)
- [DisqusJS](https://github.com/SukkaW/DisqusJS)
- [APlayer](https://github.com/MoePlayer/APlayer)
- [NProgress](https://github.com/rstacruz/nprogress)
- [CloudFlare](https://www.cloudflare.com/)
- [jsDelivr](https://www.jsdelivr.com/)

## 证书

- GNU General Public License v3

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCandinya%2FKratos-Rebirth.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FCandinya%2FKratos-Rebirth?ref=badge_large)
