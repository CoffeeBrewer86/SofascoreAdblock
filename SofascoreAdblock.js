let body = $response.body;
let url = $request.url; // 获取当前请求的 URL

if (body) {
    try {
        let obj = JSON.parse(body);

        // 【大杀器】如果是 dsp 广告接口，直接将整个返回体清空！
        if (url.includes('/dsp/')) {
            obj = {}; 
        } else {
            // 对于其他接口，使用 delete 彻底删除 ads 节点，而不是变为空数组
            function removeAds(node) {
                if (typeof node !== 'object' || node === null) return;
                
                if (node.hasOwnProperty('ads')) {
                    delete node.ads; // 核心修改：彻底删除该属性
                }
                
                for (let key in node) {
                    removeAds(node[key]);
                }
            }
            removeAds(obj);
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
