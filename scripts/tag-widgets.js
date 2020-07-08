/*!
  标签小组件文件
  Created by [Candinya](https://candinya.com)
  Created for [Kratos-Rebirth](https://github.com/Candinya/Kratos-Rebirth)
*/

// 提示横幅
hexo.extend.tag.register('alertbox', function(args){
    return '<div class="alert alert-' + args[0] + '">' + args[1] + '</div>';
});

// 折叠内容
hexo.extend.tag.register('xchead', function(args){
    return `<div class="xControl">
    <div class="xHeading">
    <div class="xIcon"><i class="fa fa-plus"></i></div>
    <span>` + args[0] + `</span>
    </div>
    <div class="xContent">
    <div class="inner">`;
});

hexo.extend.tag.register('xcfoot', function(){
    return `</div>
    </div>
    </div>`;
});

// 提示面板
hexo.extend.tag.register('panelhead', function(args){
    return `<div class="panel panel-` + args[0] + `">
    <div class="panel-title">` + args[1] + `</div>
    <div class="panel-body">`;
});

hexo.extend.tag.register('panelfoot', function(){
    return `</div>
    </div>`;
});

