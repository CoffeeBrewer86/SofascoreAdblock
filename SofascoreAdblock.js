let body = $response.body;
if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 如果 JSON 中包含 ads 字段，将其清空（变成空数组）
        if (obj.ads) {
            obj.ads = [];
        }
        
        // 重新打包为字符串返回给 APP
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // 如果解析报错，原样放行
        console.log("Sofascore JSON 解析失败: " + e);
        $done({});
    }
} else {
    $done({});
}
