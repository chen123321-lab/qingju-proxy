import fetch from 'node-fetch';

export default async function handler(req, res) {
  // ========== 在这里改你的信息 ==========
  const USER = "13914165319";
  const PASS = "cxy12100";
  const ROOT_FOLDER = "青橘照片库";
  // ====================================

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 登录123云盘
    const loginRes = await fetch("https://www.123pan.com/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: USER, password: PASS })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;

    // 获取相册列表
    if (!req.query.folderId) {
      const folderRes = await fetch("https://www.123pan.com/api/file/list", {
        method: "POST",
        headers: { Authorization: token },
        body: JSON.stringify({ parent_id: "0", path: ROOT_FOLDER })
      });
      const folderData = await folderRes.json();
      const albums = folderData.data.list.filter(i => i.type === 1);
      return res.json({ albums });
    }

    // 获取图片列表
    const fileRes = await fetch("https://www.123pan.com/api/file/list", {
      method: "POST",
      headers: { Authorization: token },
      body: JSON.stringify({ parent_id: req.query.folderId })
    });
    const fileData = await fileRes.json();
    const imgs = fileData.data.list
      .filter(i => i.type === 0)
      .map(i => ({
        name: i.file_name,
        url: `https://d.123pan.com/d/${i.file_id}`
      }));
    res.json({ imgs });
  } catch (err) {
    res.status(500).json({ error: "服务器错误" });
  }
}
