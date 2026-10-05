# Sovue Personal Home

四页静态个人站：Home / Works / Experience / Life。

## 本地预览

在本目录执行 `npm start`，打开 http://127.0.0.1:4173 。需要 Node.js 22 或更新版本，无需安装生产依赖。

请通过 HTTP 预览；本项目使用 ES modules，不以双击 HTML 的 file:// 模式作为验收方式。

## 内容维护

- `assets/data.js`：六个项目、七个经历节点、四篇基础 Life 札记，中英文成对维护；`assets/life-extras.js` 追加悉尼、海岸、咖啡三篇，共七个主题。
- `assets/app.js`：页面构图、导航、弹层和场景编排。
- `assets/site.css`：分层样式、日夜主题、桌面与移动端排版。
- `assets/motion.js`：串行场景切换控制；连续点击只保留最新目的地。
- `assets/particles.js`：低频星尘和鼠标水墨笔触。
- `assets/` 下的 PNG：项目图标、原创宇宙背景、人物与城市意象。

默认中文、夜间主题，选择后存储在本机浏览器。用户选择减少动态效果时，保留操作与内容，缩短动画。

## 测试

`npm test` 运行场景状态机单元测试。

`tests/browser-audit.mjs` 为 Playwright 浏览器验收脚本。当前工作机使用已安装的 Microsoft Edge 与 Codex 内置 Playwright；其他环境通过 `PLAYWRIGHT_PATH` 指定 Playwright 包路径，并安装对应浏览器/录屏组件。

`docs/qa/` 保存本地截图、录屏与验收结果，不作为站点发布内容。

`node tests/resume-audit.mjs` 检查当前连续滚动版 Experience、圆盘旋转、七个 Life 详情和四页移动端溢出，结果保存在 `docs/qa/resume/`。旧 `browser-audit.mjs` 的 Experience 部分针对早期离散切换，不适用于连续滚动的停留位置。

2026-09-10 标注迭代：`assets/life-notes.js` 维护 21 条可展开双语长文，`assets/journal-extra.js` 补充 14 条经历札记，`assets/editorial-art.js` 维护宇宙索引和游戏／学习插图。`node tests/feedback-audit.mjs` 验证展开、按钮锚点、固定顶栏及时间线交互；`node tests/feedback-visual.mjs` 保存日间英文截图和本机帧间隔采样。结果位于 `docs/qa/feedback/`。

最新视觉修订由 `assets/cosmic-atlas.js` 维护精密星图，`assets/experience-landscape.js` 维护跨章节背景，`assets/note-preview.js` 维护 Life 悬停预览及点击固定。运行 `node tests/atlas-landscape-audit.mjs` 检查星图旋转缩放、21 条札记和六处跨章衔接，截图位于 `docs/qa/atlas-landscape/`。

## GitHub Pages

将本文件夹内容作为 Git 仓库根目录。工作流仅发布四页 HTML、`.nojekyll` 和 `assets`，不发布历史版本、测试、录屏或交接资料。

在目标仓库 Settings → Pages 中选择 GitHub Actions。推送 main 或手动运行 Deploy personal home 工作流即可部署。所有站内地址和素材均为相对路径，支持 `/sovue-home/` 仓库子路径。

历史交接记录中的候选仓库为 `xuejiehsuej/sovue-home`。此次本地制作没有修改远程仓库或 DNS；正式发布前应确认该仓库是实际目标。

## 内容边界

项目与履历依据用户交接资料整理，未核实的使用人数、评分、完成度已省略。收藏档案标为概念规划，海外学习标为愿景。Life 中的虚构城市片段采用“想象随笔 / 未来愿景”标识。背景城市图片为 AI 意象，不能作为真实到访记录。

本轮美术参考、原创素材来源和后续验收说明见 `docs/ART-DIRECTION.md`。
