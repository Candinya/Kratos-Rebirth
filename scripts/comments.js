const {createHash,} = require('crypto');

hexo.extend.helper.register("hash_gitalk_id", function(id){
    const hasher = hexo.theme.config.gitalk_id_hasher;
    if(!hasher)return id;
    const hash = createHash(hasher);
    hash.update(id);
    return hash.digest('hex');
});