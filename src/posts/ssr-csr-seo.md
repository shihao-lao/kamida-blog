---
title: "SSR,CSR与SEO的关系"
date: "2026-1-28"
tag: "JS,SEO"
category: "前端"
--- 

# SSR、CSR 与 SEO

我第一次听到 SSR / CSR 的时候，脑子里其实只有一个画面：一堆缩写在跳舞，然后 Next.js / Nuxt.js 又把它们包装成一堆开关（`ssr: true`、`dynamic`、`cache`、`hydration`……），越看越像“玄学”。

但真正把它们看懂以后，会发现本质很朴素：

> 页面里那段可见的 HTML，到底是在哪里“拼出来”的？

这篇文章会把这件事讲清楚。你看完以后，再回去看框架文档，很多配置会变得透明。

---

## 目录

1. [一句话去魅：HTML 是谁拼的？](#一句话去魅html-是谁拼的)
2. [SSR：概念、区别与最小代码](#ssr概念区别与最小代码)
3. [CSR：概念、区别与最小代码](#csr概念区别与最小代码)
4. [SEO 视角：爬虫看到的是什么](#seo-视角爬虫看到的是什么)
5. [怎么选：用一段对话讲清楚](#怎么选用一段对话讲清楚)
6. [加一段现实：为什么又流行 Hydration](#加一段现实为什么又流行-hydration)

---

## 一句话去魅：HTML 是谁拼的？

- **CSR（Client-Side Rendering）客户端渲染** ：浏览器下载 JS 后，自己把内容拼进页面里。
- **SSR（Server-Side Rendering）服务端渲染**：服务器先把带内容的 HTML 拼好，再发给浏览器。



---

## SSR：概念、区别与最小代码

SSR（Server-Side Rendering）的核心是：**服务器在响应请求之前，就把数据填进模板，组装出“带内容的 HTML”并返回**。

### SSR 跟 CSR 的区别（从首屏角度看）

- SSR：首屏内容在 HTML 里，浏览器拿到响应就能先渲染出正文
- CSR：首屏内容通常不在 HTML 里，需要等 JS 下载、执行、请求数据后再渲染

### SSR 的最小代码（服务端拼好 HTML 再返回）

```js
async function handleRequest(req, res) {
  const data = await db.query("SELECT title, summary FROM news LIMIT 1");

  const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${data.title}</title>
      </head>
      <body>
        <div id="root">
          <h1>${data.title}</h1>
          <p>${data.summary}</p>
        </div>
      </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}
```

**体验上的典型表现：**

- 首屏更“稳”：HTML 里就有正文，先渲染再说
- 交互不一定一开始就有：通常要等客户端 JS 加载完成后再接管事件绑定

---

## CSR：概念、区别与最小代码

CSR（Client-Side Rendering）的核心是：**服务器先返回一个很薄的 HTML 壳（通常只有 root 容器）+ JS 资源；浏览器执行 JS 后再请求数据并生成 DOM**。

### CSR 跟 SSR 的区别（从链路角度看）

- CSR：HTML 壳 -> 下载 JS -> 执行 JS -> 请求数据 -> 生成 DOM
- SSR：请求数据（服务端）-> 生成 HTML（服务端）-> 返回 HTML -> 浏览器直接渲染

### CSR 的最小代码（浏览器执行 JS 再把内容塞进 root）

服务器返回的 HTML（“查看源代码”里常见）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>News</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

浏览器执行的 JS（bundle.js 的本质）：

```js
async function main() {
  const res = await fetch("https://api.example.com/news");
  const data = await res.json();

  document.getElementById("root").innerHTML = `
    <h1>${data.title}</h1>
    <p>${data.summary}</p>
  `;
}

main();
```

**体验上的典型表现：**

- 首屏是否能尽快看到内容，取决于 JS 下载、执行与数据请求速度
- JS 出问题时，页面可能长期只剩一个空容器或 Loading

---

## SEO 视角：爬虫看到的是什么

SEO（搜索引擎优化）是让网站在搜索结果中更具可见度的过程，也称为提升搜索排名。

### 爬虫干的事很简单

- 访问你的 URL
- 拿到返回的 HTML
- 读里面的文字（标题、段落、结构）

它不会像真实用户那样有耐心“等你页面跑完一堆 JS 再说”。

### 爬虫遇到 CSR：可能只抄到空壳

如果你的正文内容要等 JS 执行后才生成，那么爬虫拿到的可能是：

```html
<div id="root"></div>
<script src="/bundle.js"></script>
```

这时问题就来了：

- 有些爬虫会执行 JS，但能力、成本、等待时间都有限
- 有些爬虫干脆不执行 JS 或执行得很不完整

 结果就是：**它可能“看不见”你的正文内容**，收录和排名自然容易吃亏。

### 爬虫遇到 SSR：正文就在 HTML 里

SSR 返回的 HTML 本身就包含标题段落：

```html
<h1>SSR、CSR 与 SEO：把“框架滤镜”摘掉以后</h1>
<p>这篇文章尽量用人话把这件事讲清楚……</p>
```

对爬虫来说这非常友好：它不需要执行 JS，也能把核心内容抄走。

所以你经常会听到一句总结（它其实不玄学）：

- **内容型页面（博客/商品页/落地页）更适合 SSR（或至少首屏可见内容来自服务器）**

---

## 怎么选：用一段对话讲清楚

如果你的页面以“内容展示”为主（博客、商品详情、落地页），更推荐 SSR 或至少保证首屏内容能直接从服务器返回，因为正文在 HTML 里会让首屏展示更稳定，也更利于爬虫抓取；反过来，如果是后台管理系统这类强交互页面，SEO 基本不重要，CSR 往往更合适，服务器只需输出静态资源，更多计算放在客户端完成。需要注意的是，“SSR 更快”更准确的含义是“首屏更快更确定”：SSR 让文字随 HTML 一起到达，而 CSR 的首屏速度会更依赖 JS 包体、网络状况和数据接口性能。很多框架引入 Hydration 的原因也很现实：首次用 SSR 解决首屏与 SEO，随后再用客户端 JS 接上交互，让体验接近 CSR。

---

## 加一段现实：为什么又流行 Hydration

Hydration 用 React 的案例来讲解，他是一套非常具体的机制：**服务器先用 `react-dom/server` 生成 HTML（让首屏内容可见、利于 SEO），浏览器再用 `react-dom/client` 的 `hydrateRoot` 在同一份 DOM 上挂载 React，把事件处理器和状态逻辑接上去**。从用户视角看，页面先“能看见”，随后变得“能点、能交互”；从工程视角看，它把 SSR 的首屏优势和 CSR 的交互优势拼在了一起。

下面给一个不依赖框架的最小示意：服务端负责吐出一份已经包含按钮与初始计数的 HTML，客户端用 `hydrateRoot` 对这份 HTML 进行水合。

### 1）服务端：用 react-dom/server 生成 HTML

```js
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";

function App({ initialCount }) {
  return (
    <div>
      <button id="like">👍 Like</button>
      <span id="count">{initialCount}</span>
    </div>
  );
}

const app = express();
app.use(express.static("public"));

app.get("/", (req, res) => {
  const initialCount = 0;
  const html = renderToString(<App initialCount={initialCount} />);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!DOCTYPE html>
<html lang="zh-CN">
  <head><meta charset="UTF-8" /><title>Hydration</title></head>
  <body>
    <div id="root">${html}</div>
    <script>window.__INITIAL_COUNT__=${initialCount}</script>
    <script src="/client.js"></script>
  </body>
</html>`);
});

app.listen(3000);
```

### 2）客户端：用 hydrateRoot 接管同一份 DOM

```js
import React, { useState } from "react";
import { hydrateRoot } from "react-dom/client";

function App({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>👍 Like</button>
      <span>{count}</span>
    </div>
  );
}

hydrateRoot(
  document.getElementById("root"),
  <App initialCount={window.__INITIAL_COUNT__ ?? 0} />
);
```

这个例子的关键点是：**服务端和客户端渲染出的 DOM 结构要一致**，否则会出现 hydration mismatch（React 会警告并可能回退到重新渲染）。这也是为什么框架会非常强调“同一份数据驱动同一份 UI”，以及为什么你会看到它们把初始数据序列化进页面里再在客户端读出来。

---

## 最后一句

以后再看到 SSR / CSR 这些概念，不用背定义，问自己三个问题就够了：

1. 首屏 HTML 里有没有正文内容？
2. 正文内容是不是必须等 JS 执行才出现？
3. 交互是从一开始就有，还是后面“接上去”的？

