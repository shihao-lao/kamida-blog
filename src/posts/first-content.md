---
title: "Hello World"
date: "2025-11-12"
tag: "Next.js"
category: "Next.js"
---
# JavaScript 变量声明：`let`、`const` 与 `var` 的区别

## 目录

1. [作用域](#作用域)
2. [变量提升](#变量提升)
3. [可重定义](#可重定义)
4. [使用建议](#使用建议)

---

## 作用域

### `var`：函数作用域或全局作用域

var 声明的变量具有函数作用域或全局作用域。在函数内部使用 var 声明的变量，在整个函数体内均可访问，即使在 if 语句、for 循环等代码块内声明，也会被提升到函数顶部。

```javascript
function example() {
    if (true) {
        var x = 10; // 变量提升到函数顶部
    }
    console.log(x); // 输出 10（块内声明，函数内可访问）
}
example();
```

### `let` :块级作用域

let 声明的变量具有块级作用域，即由 {} 包裹的代码块（如 if 块、for 循环块）。变量仅在当前块内有效，超出范围则无法访问。

```javascript
function example() {
    if (true) {
        let y = 20; // 仅在 if 块内有效
    }
    console.log(y); // 报错：y is not defined
}
example();
```

### `const`：常量

const 声明的变量具有块级作用域，并且必须在声明时赋值，且不能重新赋值。

```javascript
function example() {
    const z = 30;
}
console.log(z); 
example();// 报错：ReferenceError: z is not defined
```

## 变量提升

### `var` 的变量提升现象

JavaScript 引擎会将 `var` 声明的变量提升到作用域顶部，但**不会提升赋值操作**。在声明前访问变量时，结果为 `undefined`。

```javascript
console.log(a); // 输出 undefined
var a = 10;
```

### `let` 和 `const` 的变量提升现象

`let` 和 `const` 声明的变量不会被提升，但会存在暂时性死区（TDZ）。在声明前访问变量会抛出 `ReferenceError` 错误。

```javascript
console.log(b); // 报错：ReferenceError: b is not defined
let b = 20;
```

## 可重定义

### `var` 的可重定义

使用 `var` 声明的变量可以被重新赋值，即使在同一作用域内多次声明。

```javascript
var x = 10;
var x = 20;
console.log(x); // 输出 20
```

### `let` 和 `const` 的不可重定义

`let` 和 `const` 声明的变量不能被重新赋值，否则会抛出 `SyntaxError` 错误。

```javascript
let y = 10;
let y = 20; // 报错：SyntaxError: Identifier 'y' has already been declared
```

## 使用建议

### 推荐使用 `let` 和 `const`

对于需要块级作用域的变量，推荐使用 `let` 和 `const`。它们提供了更明确的作用域范围，避免了变量提升带来的问题。

```javascript
function example() {
    let x = 10;
    const y = 20;
}
```

### 避免使用 `var`

如果需要在函数作用域或全局作用域内定义变量，应避免使用 `var`。使用 `let` 或 `const` 可以更清晰地表达变量的作用域范围。

```javascript
function example() {
    var x = 10; // 避免使用 var
}
example();
```

### 避免在循环中使用 `var`

在循环中使用 `var` 会导致变量提升，可能导致意外的行为。推荐使用 `let` 或 `const` 来替代 `var`。

```javascript
{
function example() {
    for (var i = 0; i < 5; i++) {
}
}
console.log(i); // 输出 5
```
