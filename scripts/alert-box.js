hexo.extend.tag.register('alertbox', function(args){
    return '<div class="alert alert-' + args[0] + '">' + args[1] + '</div>';
});