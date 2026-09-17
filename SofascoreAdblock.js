// 获取原始响应体
let body = $response.body;

if (body) {
    try {
        // 将 JSON 字符串解析为对象
        let obj = JSON.parse(body);
        
        // 判断是否存在 ads 节点
        if (obj.ads) {
            // 直接将 ads 数组清空，掐断广告占位符的源头
            obj.ads = [];
        }
        
        // 如果您在同一个请求里还发现了其他关于会员或去广告的字段，也可以顺手修改，比如：
        // if (obj.user) obj.user.adFree = true;
        
        // 返回修改后的完整 JSON 数据
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // 如果解析出错，返回原始数据，防止 APP 崩溃
        console.log("Sofascore 重写脚本解析失败: " + e);
        $done({});
    }
} else {
    $done({});
}
