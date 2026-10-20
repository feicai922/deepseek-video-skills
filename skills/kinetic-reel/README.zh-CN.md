<div align="center">

# kinetic-reel · DeepSeek 深海

<a href="README.md"><img src="https://img.shields.io/badge/English-050D24?style=for-the-badge" alt="English"></a>
<a href="README.zh-CN.md"><img src="https://img.shields.io/badge/简体中文-2B59D8?style=for-the-badge" alt="简体中文"></a>

用 DeepSeek“浅海”视觉体系制作动态排版短片的技能（Claude Code Skill）。
属于 [deepseek-video-skills](../../README.zh-CN.md) 合集。

</div>

![DeepSeek 动态排版短片](docs/deepseek-reel.gif)

## 概述

本技能全部用代码制作节奏紧凑、以排版为主的动态短片，适用于产品片、Showreel 与网站片头：时间分配、分镜、排版动画、
three.js 生成式图层、形状连贯转场、合成配乐与最终编码。所有画面和音乐都由代码生成，不依赖任何图像、视频或音频生成模型。

内置的视觉体系是 **DeepSeek 深海**：深渊藏青 → DeepSeek 蓝 → 海面青 → 泡沫白；由“一滴光”弯成的鱼形标志、粒子组成的“深海”、
水光条纹的“暗流”、会凝聚成鱼群的粒子“鱼群”；配乐是卡拍的合成器，带声呐 ping 与水滴声。它是一套平面视觉系统，不是吉祥物动画：
鱼只以标志的形式出现，大小也是标志该有的大小。

## 技术原理

1. **时间分配与分镜。** Agent 先确定以哪部分为主、各部分占多少时间，再写镜头表：大标题、视觉机制、入场转场、音效。
2. **绘制。** 每个镜头是一个 JavaScript 函数，画出整帧：2D 画布负责文字与图示，three.js 图层生成背景，WebGL 后期负责
   RGB 分离、切片故障与颗粒。每一帧都是时间的纯函数。
3. **审查。** 在无头 Chrome 中渲染关键帧拼图、全分辨率单帧和转场序列，据此修改。
4. **配乐。** Node 里的小型合成器读取同一个 `cues.js`，所以每个动作点都落在对应的那一帧上。
5. **输出。** 各帧并行渲染（每帧几十毫秒），ffmpeg 编码 MP4 并合入配乐。

## 主要特性

- **以排版为主导：** 大标题用窄体展示字体（Anton），重击词用宽体无衬线（Archivo Black），全片唯一“旁白句”用斜体衬线，
  标注用等宽小字，固定在 HUD 网格里；中文用思源黑体作视觉配重。
- **每个镜头都有机制：** 请求在 INPUT → REASON → ANSWER 之间跳跃、粒子凝聚成鱼群、镜头钻进标志而不是硬切。
- **形状连贯的转场：** 从光点圆形展开、钻进圆形、向下推进一个深度层、像素格溶解。
- **画面与声音卡同一拍：** 二者读取同一条 120 BPM 时间轴；转场用同调铺底与钟声，从不用噪声扫频。
- **数据有出处：** 画面上的数字只来自提供的资料，并注明口径；示意内容一律标注 SCHEMATIC。

## 示例：深海 · 大肥鱼（18 秒）

模板本身就是一支可运行的 18 秒 DeepSeek 短片：深海、标志、信号、理念与名字。成片见
[docs/deepseek-reel.mp4](docs/deepseek-reel.mp4)（1280×720 网页版，可用 ender.mjs 重新渲染全尺寸），分镜见 [template/STORYBOARD.md](template/STORYBOARD.md)。
把它当作节奏、留白与声音的参考，把文字换成你的。

## 环境要求

- Claude Code（或任何能读取本 Skill 并执行命令、且接入具备编码能力 DeepSeek 模型的 Agent）
- Node.js、Google Chrome（或 Chromium / Edge）、ffmpeg

## 安装

参见[合集说明](../../README.zh-CN.md#安装)。作为 Claude Code 插件：

```
/plugin marketplace add <你的用户名>/deepseek-video-skills
/plugin install kinetic-reel@deepseek-video-skills
```

也可以复制或链接到 `~/.claude/skills/kinetic-reel`（或项目内的 `.claude/skills/`）。

## 使用方法

描述你想要的短片，例如：

> 为我们的新模型发布会做一支 45 秒的 DeepSeek 风格动态排版短片，以演示为主。

也可以直接 `/kinetic-reel` 调用。技能会基于 `template/` 创建项目、提交分镜、逐个镜头制作并审查，合成配乐后输出 `out/reel.mp4`。

## 目录结构

| 路径 | 说明 |
|---|---|
| `SKILL.md` | Agent 遵循的工作流程与规则 |
| `template/` | 引擎与示范片：`reel/reel.js`、`reel/cues.js`、`reel/index.html`、`music/score.mjs`、`render.mjs`、`STORYBOARD.md` |
| `scripts/new_project.mjs` | 项目初始化与环境检查（Node，跨平台） |
| `references/style-guide.md` | 配色、字体、版式网格、动效函数、GL 图层、转场目录 |
| `references/sound.md` | 合成器、转场音效规则、编曲方法与已知问题 |
| `examples/site-intro/` | 把短片做成网站入口页的实现（HTML/CSS/JS），附支持 HTTP Range 的 Cloudflare Worker |

## 致谢

本技能所基于的渲染器改编自 John Heibel 的 [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)
（MIT，© 2026）；本 DeepSeek 版改编自 tuzhechen2005 的 [opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills)
（MIT，© 2026）。本版的 DeepSeek 配色、图层、镜头、配乐与文档为新作。

## 许可协议

MIT，见仓库 [LICENSE](../../LICENSE) 与 [NOTICE.md](../../NOTICE.md)。
