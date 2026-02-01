---
title: "Git操作"
date: "2025-12-14"
tag: "Git"
category: "git工具"
---

## 🌱 一、Git 分支基本概念

在团队协作中，我们通常会遵循 **Git 分支模型（Branch Model）**：

```
main / master   👉 主分支（线上稳定版本）
│
├── dev         👉 开发分支（集成测试用）
│
├── feature/x   👉 功能分支（独立功能开发）
│
└── hotfix/x    👉 紧急修复分支


```

 🔹 简单来说：

 * **master/main**：线上正式版本
 * **dev**：日常开发整合
 * **feature/xxx**：新功能开发
 * **hotfix/xxx**：线上紧急修复

---

## 🛠 二、完整操作流程

下面以一个实际例子说明：
我们要从 `dev` 创建功能分支，开发完成后合并回主分支。

---

### 1️⃣ 从远程获取最新代码

```bash
# HTTPS（需要输入用户名/密码或 token）需要进行身份验证
git clone https://github.com/<org>/<repo>.git

# 或者使用 SSH（更推荐，用密钥免交互）需要进行有关的配置
git clone git@github.com:<org>/<repo>.git

# 指定目录名
git clone <url> my-project
```

这一步会更新远程分支信息（但不会改变你的本地代码）。

---

### 2️⃣ 切换到 `dev` 分支并拉取最新内容

```bash
git checkout dev
git pull origin dev
```

保证你本地的 `dev` 是最新的，这样你新建分支时不会带入旧代码。

---

### 3️⃣ 创建功能分支

```bash
git checkout -b feature/add-language-switch
```

> 这会基于 `dev` 创建一个新的本地分支。

---

### 4️⃣ 编码开发 & 本地提交

完成修改后执行：

```bash
git add .
git commit -m "feat: add language switch component"
```

 🧩 提交信息规范（推荐使用 [Conventional Commits](https://www.conventionalcommits.org/)）：

 * `feat:` 新功能
 * `fix:` 修复 bug
 * `refactor:` 重构
 * `docs:` 文档变更

---

### 5️⃣ 推送到远程分支

```bash
git push origin feature/add-language-switch
```

> 这会在远程仓库创建一个新的分支。
> 之后你可以在 GitHub / GitLab 上创建 **Pull Request (PR)** 或 **Merge Request (MR)**。

---

### 6️⃣ 发起合并请求（PR / MR）

在远程仓库页面：

* 从：`feature/add-language-switch`
* 合并到：`dev`

填写说明，例如：

> ✨ 新增语言切换功能
> ✅ 已通过本地测试
> ⚠️ 需在 `dev` 集成验证后合并入主分支

---

### 7️⃣ 审核通过后，合并到 `dev`

由 reviewer 或管理员执行：

```bash
git checkout dev
git pull origin dev
git merge feature/add-language-switch
git push origin dev
```

> ✅ 合并完成后，功能进入开发集成分支。

---

### 8️⃣ 测试完成后，合并到 `master`

确认所有功能在 `dev` 上测试通过后：

```bash
git checkout master
git pull origin master
git merge dev
git push origin master
```

> 🚀 此时 `master` 即为最新稳定版本，可用于发布部署。

---

## 📈 三、图解流程

```text
           ┌────────────┐
           │  master    │
           └─────┬──────┘
                 │
                 ▼
           ┌────────────┐
           │   dev      │ ← 集成分支
           └─────┬──────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌────────────┐     ┌────────────┐
│ feature/A  │     │ feature/B  │ ← 功能开发
└────────────┘     └────────────┘
```

---

## 🧹 四、分支合并后的清理

功能合并后，可以删除本地和远程分支：

```bash
# 删除本地分支
git branch -d feature/add-language-switch

# 删除远程分支
git push origin --delete feature/add-language-switch
```

---

## 💡 五、常见问题

| 问题                       | 原因        | 解决方案                              |
| ------------------------ | --------- | --------------------------------- |
| 合并时报冲突                   | 多人修改了同一文件 | 手动解决冲突后再 `git add` + `git commit` |
| 推送时报错 “non-fast-forward” | 远程比本地新    | 执行 `git pull --rebase` 再推送        |
| 远程分支没显示                  | 本地未 fetch | `git fetch --all`                 |

---

## 🏁 六、推荐命令速查表

| 操作     | 命令                                           |
| ------ | -------------------------------------------- |
| 查看分支   | `git branch -a`                              |
| 创建新分支  | `git checkout -b feature/xxx`                |
| 推送到远程  | `git push origin feature/xxx`                |
| 合并分支   | `git merge feature/xxx`                      |
| 删除本地分支 | `git branch -d feature/xxx`                  |
| 删除远程分支 | `git push origin --delete feature/xxx`       |
| 查看日志图  | `git log --oneline --graph --all --decorate` |

---

## ✨ 七、总结

> 一个规范的 Git 流程可以让团队协作更高效、风险更可控。

✅ 推荐最佳实践：

* 每个功能独立分支
* 小步提交、写清说明
* 定期同步远程分支
* 开发完先合到 `dev`，测试通过后再进 `master`

---

---



