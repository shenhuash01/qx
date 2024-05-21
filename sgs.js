const url = "https://fwdt.shengongshe.org/sgsWchartApi/api/My/myIntegral";

if ($request && $request.url.includes(url)) {
  const token = $request.headers['token']; // 假设 token 在 Authorization 头中
  if (token) {
    $prefs.setValueForKey(token, "sgs"); // 将 token 保存到 Quantumult X 持久化存储中
    $notify("Token 获取成功", "Token 已成功保存", token); // 通知用户获取成功
  } else {
    $notify("Token 获取失败", "请求头中未找到 token", JSON.stringify($request.headers));
  }
  $done({}); // 完成请求处理
} else {
  $done({}); // 如果请求不匹配，正常完成处理
}
