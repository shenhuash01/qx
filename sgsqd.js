const axios = require('axios');
const https = require('https');

// 创建一个不验证证书的 https.Agent
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

axios.get('https://example.com/api', { httpsAgent })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));



const notify = require('./sendNotify');  // 引入青龙的通知模块

const token = process.env.sgs;
const headers = {
    "Host": "fwdt.shengongshe.org",
    "Connection": "keep-alive",
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Linux; Android 12; RMX3562 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160043 MMWEBSDK/20231105 MMWEBID/2307 MicroMessenger/8.0.44.2502(0x28002C51) WeChat/arm64 Weixin NetType/4G Language/zh_CN ABI/arm64",
    "Token": token,
    "X-Requested-With": "com.tencent.mm",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
};

// 签到函数
async function sign() {
    try {
        const response = await axios.get("https://fwdt.shengongshe.org/sgsWchartApi/api/My/sign", { headers });
        const message = `签到结果: ${response.data.msg}`;
        console.log(message);
        return message;
    } catch (error) {
        console.error("签到失败:", error);
        return "签到失败: " + error;
    }
}

// 获取新闻并阅读前三条
async function getNews() {
    try {
        const response = await axios.post("https://fwdt.shengongshe.org/sgsWchartApi/api/ImageText/list", { page: "1" }, { headers });
        const newsList = response.data.data.news;

        let message = "阅读新闻结果:\n";
        for (let i = 0; i < 3 && i < newsList.length; i++) {
            const readResult = await readNews(newsList[i].media_id);
            message += `新闻 ${i + 1}: ${readResult}\n`;
        }
        return message;
    } catch (error) {
        console.error("获取新闻失败:", error);
        return "获取新闻失败: " + error;
    }
}

// 阅读新闻函数
async function readNews(media_id) {
    try {
        const response = await axios.get("https://fwdt.shengongshe.org/sgsWchartApi/api/ImageText/read", {
            headers,
            params: { media_id }
        });
        return `阅读结果: ${response.data.msg}`;
    } catch (error) {
        console.error("阅读新闻失败:", error);
        return `阅读失败: ${error}`;
    }
}

// 主函数
(async () => {
    if (token) {
        const signMessage = await sign();
        const newsMessage = await getNews();
        const finalMessage = `${signMessage}\n${newsMessage}`;
        
        // 发送通知
        await notify.sendNotify("签到和新闻阅读结果", finalMessage);
    } else {
        console.log("未找到环境变量 sgs");
    }
})();
