let body = $response.body;

if (!body) {
    $done({});
}

try {
    let obj = JSON.parse(body);

    // 核心排雷函数：递归遍历并温柔清理
    function cleanAds(node) {
        if (typeof node !== 'object' || node === null) return;
        
        // 1. 如果当前节点是数组，遍历里面的每一个元素
        if (Array.isArray(node)) {
            for (let i = node.length - 1; i >= 0; i--) {
                let item = node[i];
                if (item && typeof item === 'object') {
                    // 识别并剔除信息流里伪装的广告元素 (结合你之前的 JSON: type 为 html 且 name 包含 Pass)
                    if (item.type === 'ad' || item.type === 'html' || item.type === 'dfp') {
                        node.splice(i, 1); // 从列表中平滑抹除该格子
                    } else {
                        cleanAds(item); // 不是广告，继续往下层找
                    }
                }
            }
            return;
        }

        // 2. 如果当前对象包含 ads 节点，将它变成明确的“空数组”而不是删除
        if (node.hasOwnProperty('ads')) {
            node.ads = []; 
        }
        
        // 继续递归其他属性
        for (let key in node) {
            cleanAds(node[key]);
        }
    }
    
    cleanAds(obj);
    
    // 如果是 dsp 接口，强制返回一个带有空 ads 数组的合法外壳
    if ($request.url.includes('/dsp/')) {
        obj = { ads: [] };
    }

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    console.log("Sofascore 脚本执行错误: " + e);
    $done({});
}
