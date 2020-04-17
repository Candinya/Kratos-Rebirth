![Kratos-Rebirth](https://repository-images.githubusercontent.com/132322562/46429300-7da7-11ea-8c82-d03503cb17b8)

## 关于这个主题

一只移植的主题，主要是个人使用，相关介绍可以参见主题说明页面~

全新的配置文档增加了！戳[这里](https://candinya.com/posts/Kratos-Rebirth-Manual/)查看更多~

有为这个主题专门开发两个页面，详见[Kratos-Rebirth-Specified-Pages](https://github.com/Candinya/Kratos-Rebirth-Specified-Pages)

核心结构&样式来源：[@MoeDog](https://github.com/xb2016) 狗狗大佬的[Kratos-pjax](https://github.com/xb2016/kratos-pjax)

非常感谢：

- [Kratos-pjax](https://github.com/xb2016/kratos-pjax)
- [hexo-theme-sagiri](https://github.com/DIYgod/diygod.me/tree/master/themes/sagiri)
- [hexo-theme-landscape](https://github.com/hexojs/hexo-theme-landscape)
- [DisqusJS](https://github.com/SukkaW/DisqusJS)
- [APlayer](https://github.com/MoePlayer/APlayer)
- [NProgress](https://github.com/rstacruz/nprogress)
- [CloudFlare](https://www.cloudflare.com/)
- [jsDelivr](https://www.jsdelivr.com/)

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
    "hexo-generator-index": "^1.0.0",
    "hexo-generator-index-pin-top": "^0.2.2",
    "hexo-generator-tag": "^1.0.0",
    "hexo-renderer-ejs": "^1.0.0",
    "hexo-renderer-marked": "^2.0.0",
    "hexo-renderer-stylus": "^1.1.0",
    "hexo-server": "^1.0.0"
  }
}
```
