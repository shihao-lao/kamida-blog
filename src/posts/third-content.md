---
title: "Hello World"
date: "2025-11-12"
tag: "Next.js"
category: "Next.js"
---
# call-apply-bind

## 一、call、apply、bind的区别

### 1. 功能

- call和apply的功能是一样的，都是用来改变函数的this指向的。
- bind的功能是用来改变函数的this指向的，并且返回一个新的函数。

### 2. 参数

- call和apply的第一个参数都是用来改变函数的this指向的，第二个参数是一个参数列表，call的参数列表是一个参数列表，apply的参数列表是一个数组。
- bind的第一个参数是用来改变函数的this指向的，第二个参数是一个参数列表，这个参数列表是一个数组。

### 3. 返回值

- call和apply的返回值是函数的返回值。
- bind的返回值是一个新的函数。

### 4. 用法

- call和apply的用法是一样的，都是用来改变函数的this指向的。
- bind的用法是用来改变函数的this指向的，并且返回一个新的函数。

### 5. 区别

- call和apply的区别是参数列表的形式不同。
- bind的区别是返回值的形式不同。

## 二.手写实现call、apply、bind

### call函数实现

```js
//给所有函数添加一个hycall方法
Function.prototype.hycall=function(thisArg,...args){//剩余参数获取传入的参数
    //1.获取需要调用的函数
    var fn=this
    //2.对thisArg进行类型转换
    thisArg=thisArg?Object(thisArg):window//保证类型的相同并且在传入undefiend/null时返回window
    thisArg.fn=fn//显示调用
    // fn(...args)
    var result=thisArg.fn(...args)//创建对象接受返回值
    return result
}


function foo()
{
    console.log("foo函数调用",this);
}
function sum(num1,num2)
{
    console.log("sum函数实现",this,num1,num2);
    return num1+num2
}

foo.call("abc")
foo.hycall("abc")
sum.hycall(undefined)
console.log(sum.hycall("abc",1,2));
```

### apply函数实现

```js
Function.prototype.hyapply = function (thisArg, args) {
  thisArg = thisArg ? Object(thisArg) : window; // Ensure thisArg is an object
  thisArg.fn = this; // Assign the function to be called
  // Call it with provided arguments
  // Clean up
  var result = thisArg.fn(...(args || []));
  delete thisArg.fn;
  return result;
};

// 使用示例
var bar = function (arg1, arg2) {
  console.log("bar函数调用", arg1, arg2, this);
};

// bar.hyapply("123", ["参数1", "参数2"]);
bar.hyapply("123");
```

### bind函数实现

```js
//创建hybind的构造函数
Function.prototype.hybind=function(thisArg,...args){
    var fn=this
    //
    thisArg=thisArg?Object(thisArg):window
    thisArg.this=fn
    function proxyfn(...argsment){
        
    return thisArg.this(...args,...argsment)
    
    }
    return proxyfn
}
function foo()
{
    console.log("foo函数被调用");
    return 20
}
function sum(num1,num2,num3){
    console.log(num1,num2,num3);
    console.log(this);
    return num1+num2+num3
}

var result=sum.hybind("abc",1,2)
console.log(result(3));
```

## 补充:ES6的剩余参数

### 剩余参数

- 剩余参数语法允许我们将一个不定数量的参数表示为一个数组。
- 剩余参数语法是三个点（...），放在参数的最后面，前面可以有其他参数。
- 剩余参数必须是最后一个参数。
- 剩余参数只能在函数定义中使用。
- 剩余参数可以是任意类型的参数，包括基本类型和对象类型。
- 剩余参数可以是一个空数组。
- 剩余参数可以是一个数组。

```js
function sum(...sums)
{
    console.log(sums);
}


sum(10)
sum(10,20)
sum(10,20,30)


//展开运算符spread

var name=["abc","acd","123"]
var newname=[...name]//依次遍历每一个元素
console.log(newname);
```
