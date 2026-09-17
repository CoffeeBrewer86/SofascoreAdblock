let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);

        // 递归遍历并修改尺寸
        function collapseAds(node) {
            if (typeof node !== 'object' || node === null) return;
            
            // 1. 如果发现了 ads 数组，不删除它，而是把尺寸设为 0
            if (node.hasOwnProperty('ads') && Array.isArray(node.ads)) {
                node.ads.forEach(ad => {
                    ad.height = 0;       // 强制高度为0
                    ad.width = 0;        // 强制宽度为0
                    ad.content = "";     // 清空素材
                    ad.enabled = false;  // 标记禁用
                });
            }
            
            // 2. 针对信息流里的原生广告项 (type == ad/html)
            if (Array.isArray(node)) {
                for (let i = node.length - 1; i >= 0; i--) {
                    let item = node[i];
                    if (item && typeof item === 'object') {
                        if (item.type === 'ad' || item.type === 'html' || item.type === 'dfp') {
                            item.height = 0;
                            item.width = 0;
                            item.content = "";
                        } else {
                            collapseAds(item);
                        }
                    }
                }
                return;
            }
            
            for (let key in node) {
                collapseAds(node[key]);
            }
        }
        
        collapseAds(obj);
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
