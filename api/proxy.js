const axios = require('axios');

module.exports = async (req, res) => {
  // 允许跨域请求（小程序需要）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: '缺少 url 参数' });
  }

  try {
    // 代理请求七牛文件
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // 设置正确的文件类型
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    // 返回文件数据
    return res.status(200).send(Buffer.from(response.data));
  } catch (error) {
    console.error('代理请求失败:', error.message);
    return res.status(500).json({ error: '代理请求失败', detail: error.message });
  }
};
