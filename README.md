# 创作工作台

帮助短视频创作者把想法讲清楚的五步入门工具：定位 → 选题 → 文案 → 准备拍摄 → 看成片。

**在线使用：** https://yendammanh92087-prog.github.io/creative-workbench/

- 纯静态页面，无需安装；也可以下载 `dist/` 后双击 `index.html` 离线使用
- AI 建议走「自带密钥」模式：点页面右上角「AI 设置」，填入自己服务商（DeepSeek / 百炼 / 火山 / Moonshot / OpenRouter 等）的 API Key
- 材料只保存在访客自己的浏览器里；点 AI 按钮时，对应材料才会发给访客自己设置的服务商
- 部署：GitHub Pages，`gh-pages` 分支（内容为 `dist/` 目录）

本地预览：`cd dist && python3 -m http.server 8788`
