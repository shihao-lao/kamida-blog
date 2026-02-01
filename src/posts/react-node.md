---
title: "ReactNode 与 ReactElement：到底差在哪？"
date: "2026-2-1"
tag: "React,TypeScript"
category: "前端"
---

# ReactNode 与 ReactElement：到底差在哪？

写 React + TypeScript 的时候，最常见的两个类型就是 `ReactNode` 和 `ReactElement`。它们经常一起出现，比如：

- `children: React.ReactNode`
- `render(): React.ReactElement`

看起来都像“React 能渲染的东西”，但它们的语义完全不同。理解这俩的差别，会直接影响你写组件 Props、封装 render prop。

---

## 一句话结论

- **ReactElement**：一个“React 元素对象”，也就是 JSX 编译后的产物（结构化对象，带 `type/props/key/ref`）。
- **ReactNode**：一个“可渲染值”的大集合，包含 `ReactElement`，还包含字符串、数字、数组、Fragment、Portal，以及 `null/undefined/boolean` 这类“渲染为空”的值。

换句话说：

> `ReactElement` 是 `ReactNode` 的一个子集；`ReactNode` 才是 “children 能接受什么” 的真正答案。

---

## ReactElement：JSX 编译后的对象

你写的 JSX：

```tsx
const a = <div className="box" />;
const b = <MyComp foo={1} />;
```

最终都会变成“React 元素对象”。在类型层面，它通常对应：

- `React.ReactElement`（更准确、更底层的类型）
- `JSX.Element`（更常见的 JSX 返回类型，通常等价于 `ReactElement<any, any>` 的别名/包装，取决于 TS/React 版本配置）

一个直观的理解是：`ReactElement` 是“描述 UI 的结构化数据”，像这样：

```ts
type ReactElementLike = {
  type: string | Function;
  props: Record<string, unknown>;
  key: string | null;
};
```

它不是 DOM，也不是 HTML 字符串，而是 React 用来构建 Fiber/协调更新的输入数据。

### 什么时候用 ReactElement？

当你希望调用方“必须传一个组件/标签”，而不是随便传文本、数字、数组时，用 `ReactElement` 更合适：

```tsx
type Props = {
  icon: React.ReactElement;
};

function Button({ icon }: Props) {
  return <button className="btn">{icon}Click</button>;
}

// ✅ 可以
<Button icon={<span>🔥</span>} />

// ❌ 不行（因为 string 不是 ReactElement）
<Button icon={"🔥"} />
```

---

## ReactNode：React 能“吃下去并渲染”的所有东西

`ReactNode` 是一个联合类型（大杂烩）。你可以把它理解成：只要 React 渲染器接受，它就算 `ReactNode`。

```tsx
export type ReactNode =
  | React$Element<any>
  | ReactPortal
  | ReactText
  | ReactFragment
  | ReactProvider<any>
  | ReactConsumer<any>;
```

按照这份源码定义，`ReactNode` 由下面 6 类组成：

### 1）React$Element<any>（也就是我们常说的 ReactElement）

```tsx
<div />
<MyComp />
```

### 2）ReactPortal（Portal）

```tsx
import { createPortal } from "react-dom";

createPortal(<div className="modal">Hi</div>, document.body);
```

### 3）ReactText（文本）

`ReactText` 通常就是 `string | number`，也就是 React 允许你直接写在 JSX 里的文本节点：

```tsx
<div>Hello</div>
<div>{123}</div>
```

### 4）ReactFragment（Fragment）

Fragment 的作用是把多个子节点组合在一起，但它本身不会渲染成额外的 DOM 节点：

```tsx
<>
  <ChildA />
  <ChildB />
</>
```

### 5）ReactProvider<any>（Context Provider）

```tsx
import React from "react";

const MyContext = React.createContext(null);

<MyContext.Provider value={{ theme: "dark" }}>
  <Child />
</MyContext.Provider>;
```

### 6）ReactConsumer<any>（Context Consumer）

```tsx
import React from "react";

const MyContext = React.createContext(null);

<MyContext.Consumer>
  {(value) => <pre>{JSON.stringify(value)}</pre>}
</MyContext.Consumer>;
```

补充一点：你在 TypeScript 里常见到的 `React.ReactNode` 往往会比这份定义更宽（例如包含 `null/undefined/boolean`、可迭代结构等）。这类差异通常来自 React/TS 版本、类型定义文件的演进，以及某些类型在不同实现里被拆分或合并。

### 什么时候用 ReactNode？

当你想表达“这里可以放任意可渲染内容”，尤其是 `children`、slot、render 出来的片段，用 `ReactNode` 最合适：

```tsx
type CardProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section>
      <header>{title}</header>
      <div>{children}</div>
    </section>
  );
}

// 这些都合法：
<Card title="标题">正文</Card>
<Card title={<b>加粗标题</b>}>{123}</Card>
<Card title={null}>{[<span key="1">a</span>, <span key="2">b</span>]}</Card>
```

---

## ReactNode vs ReactElement：从“约束力度”来理解

你可以把它们理解为两种不同强度的约束：

- `ReactElement`：强约束。你必须给我一个“元素对象”（JSX 产物）。
- `ReactNode`：弱约束。你给我任何 React 能渲染的值都行（包括元素、文本、Fragment、Portal、Provider/Consumer 等；不同类型定义的覆盖范围可能略有差异）。

这直接决定了 API 设计体验：

### 场景 1：你只接受一个“组件块”

比如 `icon`、`header` 必须是一个组件标签，否则 UI 结构不好控制：

```tsx
type Props = { header: React.ReactElement };
```

### 场景 2：你接受“任意内容”

比如 `children`、`title`、`footer` 可以是文本也可以是组件：

```tsx
type Props = { children: React.ReactNode };
```

---

## 常见误区：JSX.Element、ReactElement、ReactNode 到底怎么选？

简单规则：

- **写 children / slot**：优先 `React.ReactNode`
- **写必须是一个元素的 props（比如 icon）**：用 `React.ReactElement`
- **组件返回值类型**：通常不需要手写；如果一定要写，React 组件返回值更贴近 `React.ReactElement | null`（实际情况依赖你的组件是否可能返回 `null`）

一个容易踩坑的点是：**组件的返回值常被认为是 `ReactNode`**，但这会让约束过于宽松（比如你可能并不希望函数组件返回 `string`）。实践里更常见的是不写返回类型，让 TS 推导，或者写 `JSX.Element` / `ReactElement | null`。

---

## 为什么这俩的差别跟 SSR/SEO/Hydration 有关系？

因为 Hydration 关注的是：**服务端生成的 HTML 与客户端“用同样的数据渲染出来的 ReactElement 树”是否一致**。在这个过程中：

- `ReactElement` 是结构（树形 UI 描述）
- `ReactNode` 是你可能塞进树里的各种值（包括空值、条件渲染结果、数组等）

当你在服务端和客户端因为环境差异（时间、随机数、浏览器 API）导致 `ReactNode` 的取值不同，就会出现 hydration mismatch（内容对不上），React 会警告并可能回退到重新渲染。

---

## 最后一句

> **ReactElement 是 JSX 编译出来的“元素对象”；ReactNode 是 React 能渲染的“所有东西”。**
