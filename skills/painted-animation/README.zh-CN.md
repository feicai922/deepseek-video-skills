<div align="center">

# painted-animation · 大肥鱼

<a href="README.md"><img src="https://img.shields.io/badge/English-1E3A8A?style=for-the-badge" alt="English"></a>
<a href="README.zh-CN.md"><img src="https://img.shields.io/badge/简体中文-5B93FF?style=for-the-badge" alt="简体中文"></a>

用 DeepSeek 大肥鱼做手绘风格动画与歌词 MV 的制作技能（Claude Code Skill）。
属于 [deepseek-video-skills](../../README.zh-CN.md) 合集。

</div>

![大肥鱼 模型表](docs/views.jpg)

## 概述

本技能全部用代码制作动画视频：分镜设计、角色动画、镜头运动、转场、音乐同步，以及可选的卡拉 OK 字幕。所有画面都由
p5.js 与水彩笔刷库 [p5.brush](https://github.com/acamposuribe/p5.brush) 程序化绘制，不依赖任何图像生成模型。每一帧都是
时间的纯函数，在无头 Chrome 中逐帧渲染，再由 ffmpeg 编码。

主角是 **大肥鱼**：一只按本项目 `角色设定.md` 绘制的 Q 版鲸鱼娘——大头、深蓝卷发加呆毛、鲸鱼鳍状耳、大而亮的蓝眼睛、
柔和的张嘴笑、白色女仆发箍、蓝白女仆装，以及一条尾巴分叉从腰侧探出的深蓝鲸鱼尾。她拥有 39 种情绪、五张手绘关键视角
图、帽子与配件系统，以及走路 / 挥鳍 / 游泳等动作辅助函数。她是**原创同人角色**，不是 DeepSeek Logo，也不是官方吉祥物。

## 技术原理

1. **分镜。** Agent 先写出镜头表（场景、配色、情绪线、转场），并为每个镜头列出按时间排好的“观众需要理解的信息”。
2. **绘制。** 每个镜头是一个 JavaScript 函数，用 `paint()` / `inkLine()` 绘制整帧。转身只用关键视角图，不做 3D。
3. **审查。** 在无头 Chrome 中渲染关键帧拼图、逐帧序列与局部特写，Agent 看图并据此修改，直到每个镜头都读得懂。
4. **输出。** 各帧并行渲染，ffmpeg 编码为 MP4，如有音频则一并合入。

## 主要特性

- **每个角色一个绘制函数**，所有镜头造型一致（`deepseeker(x, y, u, options)`）。
- **逐帧精确的时间控制：** 表情通过 `emotions()` 过渡，自带预备动作、受惊反应与回弹；动作可精确对齐节拍或唱词。
- **为她定制的动作：** `swim()` 让尾巴先动的滑翔，`hopWalk()` 用侧鳍摇摆走路。
- **内置动画原理：** `jump`、`take`、`spring`、`ring`、弧线、快速转身的残影。
- **笔刷不工作的机器也能出片：** 某些显卡/驱动组合下 p5.brush 的着色器画不出任何东西，引擎会自动识别并改用 2D 扁平绘制
  渲出同样的画面，视频照常生成（没有水彩质感，这一点会在 Studio 控制台打印）。

## 示例：《最后一点深海的光》（14 秒）

<p align="center"><img src="docs/deepsea.gif" width="640" alt="大肥鱼与深海里的小光点"></p>

模板自带的示范片 `template/src/scenes/deepsea.js`：大肥鱼下潜到海底一颗被贝壳困住的小光点旁，灵光一现，俯冲一口咬开贝壳，
小鱼游了出来，绕着她的鲸鱼尾转圈，最后落在她的发箍上，一起从深渊升向浅金色的水面。它演示了情绪时间线、带尾巴的滑翔、
受惊反应、张嘴大咬、笔刷擦除转场和圆形收场。成片见 [docs/deepsea.mp4](docs/deepsea.mp4)。

## 环境要求

- Claude Code（或任何能读取本 Skill 并执行命令、且接入具备编码能力 DeepSeek 模型的 Agent）
- Node.js、Google Chrome（或 Chromium / Edge）、ffmpeg
- Python 3 及 numpy（仅节拍检测需要）

## 安装

参见[合集说明](../../README.zh-CN.md#安装)。作为 Claude Code 插件：

```
/plugin marketplace add <你的用户名>/deepseek-video-skills
/plugin install painted-animation@deepseek-video-skills
```

也可以把本目录复制或链接到 `~/.claude/skills/painted-animation`（或项目内的 `.claude/skills/`）。

## 使用方法

描述你想要的视频，例如：

> 做一段 15 秒的手绘动画：大肥鱼想抓住一只泡泡。

> 为这首歌做歌词 MV。（附音频与 LRC 文件）

也可以直接用 `/painted-animation` 调用。技能会创建项目、提交分镜、逐个镜头制作并审查，最终输出 `out/video.mp4`。

## 目录结构

| 路径 | 说明 |
|---|---|
| `SKILL.md` | Agent 遵循的工作流程与规则 |
| `template/` | 引擎：`src/deepseek.js`（大肥鱼）、`src/core.js`、`src/timeline.js`、`src/sheets.js`、`src/karaoke.js`、示范片、`render.mjs`、`studio.html`、`ANIMATION_GUIDE.md` |
| `scripts/new_project.mjs` | 项目初始化与环境检查（Node，跨平台） |
| `scripts/beat_grid.py` | 节拍与相位检测，并对齐 LRC |
| `references/music-video.md` | 音乐视频与长篇制作规范 |
| `references/upstream/clawd-kit/` | 本引擎所改编的原始工具包（John Heibel，MIT），原样保留以证明来源 |
| `docs/` | 模型表、示范成片与 GIF |

## 致谢

引擎、渲染器与整体方法改编自 John Heibel 的 [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
（MIT，© 2026，见 `template/LICENSE`）及其 [PDoomVideo](https://github.com/JohnHeibel/PDoomVideo)；本 DeepSeek 版又改编自
tuzhechen2005 的 [opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills)（MIT，© 2026）。本版的大肥鱼角色
模块、配色、示范片、模型表与文档为新作。原始工具包原样保存在 `references/upstream/clawd-kit/`。

## 许可协议

MIT，见仓库 [LICENSE](../../LICENSE) 与 [NOTICE.md](../../NOTICE.md)。
