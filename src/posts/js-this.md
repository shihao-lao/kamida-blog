---
title: "JS中的this"
date: "2025-6-12"
tag: "Js,this"
category: "JavaScript"
--- 
# JS中的this

## 目录

1. [JS中的this指向](#this指向)
2. [JS中this的绑定规则](#this的绑定规则)
3. [箭头函数中的this](#箭头函数中的this)
4. [有关this的实际情况](#有关this的实际情况)

## this指向

JavaScript中的`this`指向由**执行上下文**决定

### 全局中的this

在全局上下文中，`this`指向全局对象。在浏览器中，全局对象是`window`，在Node.js中，全局对象是`global`。

```js
console.log(this); //window
```

### 函数中的this

在函数中，`this`的值取决于函数的调用方式。

```js
function foo()
{
    console.log(this);
}
//1.直接调用
foo()
// 类似于 window.foo()

//2,创建对象调用
var obj={
    name:"why",
    foo:foo
}
obj.foo.apply()//类似于window.foo() window

obj.foo()//obj

//3.apply调用
foo.apply()//window
```

## this的绑定规则

### 默认绑定

独立函数调用时this就绑定到全局对象：

```js
function showThis() {
  console.log(this); //window
}
showThis();
```

### 隐式绑定

通过对象方法调用时,this就绑定到调用的对象：

```js
var obj={
    name:"obj",
    foo:function()
    {
        console.log(this);
    }
}
obj.foo()//通过对象进行调用
// obj

var fn=obj.foo

fn()//通过函数直接调用
// window

var bar={
    name:"obj1",
    foo1:obj.foo
}
bar.foo1()//bar
```

### 显式绑定

通过call/apply/bind强制绑定：

```js
function foo()
{
    console.log("函数调用"+this);
}
//apply call函数 调用 第一个参数为this绑定
foo.apply("abc")
foo.call("abd")
//bind需要返回对象并且进行直接绑定
var fn=foo.bind("aaa")
fn()
```

### new绑定

new绑定类似调用一个函数构造器,这个时候是用this创建出来的一个对象：

```js
function Person(name) {
  this.name = name;
}
const p = new Person('Tom');
console.log(p.name); //Tom
```

## 箭头函数中的this

箭头函数中的this是在定义时确定的，而不是在调用时确定的。箭头函数中的this指向的是定义时的上下文。

```js
var aaa = {
  data: [],
  fn: function () {
    setTimeout(function () {
      var result = ["abc", "adf", "213"];
      this.data = result; // 这里的this指向的是
      console.log("Inside regular function:", this.data); // 输出数据
    }, 2000);
    //箭头函数没有绑定this 指向的还是上级作用域
    setTimeout(() => {
      var result = ["abc", "adf", "213"];
      this.data = result; // 这里 `this` 指向 `aaa`
      console.log("Inside arrow function:", this.data); // 输出数据
    }, 2);
  },
};

aaa.fn();

```

## 有关this的实际情况

### React/Vue 组件中的方法绑定

在React/Vue组件中，方法绑定是一个常见的场景。在这些框架中，方法绑定是通过`this`来实现的。

```js
// React 类组件（旧写法）
class Button extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this); // 必须绑定
  }
  
  handleClick() {
    console.log(this); // 未绑定时是undefined
    this.setState({ clicked: true }); // 绑定后才能操作组件状态
  }

  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}

// 现代写法（使用箭头函数属性）
class Button extends React.Component {
  handleClick = () => { // 箭头函数自动绑定实例
    console.log(this); // 始终指向组件实例
  }

  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}
```

### 事件处理函数中的this

在事件处理函数中，`this`通常指向触发事件的元素。

```js
// 传统事件绑定
button.addEventListener('click', function() {
  console.log(this); // 指向被点击的button元素
});

// 使用箭头函数时
button.addEventListener('click', () => {
  console.log(this); // 指向定义时的上下文（可能是Window）
});

// 需要同时获取元素和组件实例时
class Component {
  constructor(element) {
    this.element = element;
    element.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick() {
    console.log(this); // 组件实例
    console.log(event.currentTarget); // 被点击的元素
  }
}
```

### 异步回调中的this丢失

在异步回调中，`this`可能会丢失。

```js
const loader = {
  data: null,
  fetchData() {
    // ❌ 错误写法（this丢失）
    fetch('/api').then(function(response) {
      this.data = response; // 这里的this指向Window！
    });

    // ✅ 正确解决方案
    fetch('/api').then((response) => {
      this.data = response; // 箭头函数继承外层this
    });

    // ✅ 或使用闭包保存this
    const _this = this;
    fetch('/api').then(function(response) {
      _this.data = response;
    });
  }
}
```
