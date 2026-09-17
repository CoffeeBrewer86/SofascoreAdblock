let url = $request.url;
let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);

        // 1. 如果是 DSP 广告接口，直接全盘清空，破坏 APP 的预渲染逻辑
        if (url.includes('/dsp/')) {
            obj = {}; 
        }

        // 2. 暴力删除所有隐藏的 ads 节点 (使用 delete 而不是 [])
        function removeAds(node) {
            if (typeof node !== 'object' || node === null) return;
            if (node.hasOwnProperty('ads')) {
                delete node.ads; // 彻底物理删除该节点
            }
            for (let key in node) {
                removeAds(node[key]);
            }
        }
        removeAds(obj);

        // 3. 针对 /app/info 接口尝试注入 Premium 免广告特权 (可选盲狙)
        if (url.includes('/app/info')) {
            // 在日志中打印出 info，方便后续分析
            console.log("App Info 数据: " + JSON.stringify(obj));
            // 尝试盲猜常见的去广告字段
            if (obj.hasOwnProperty('adFree')) obj.adFree = true;
            if (obj.hasOwnProperty('isPremium')) obj.isPremium = true;
        }

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
