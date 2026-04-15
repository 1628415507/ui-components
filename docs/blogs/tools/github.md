# GitHub 多账号 SSH 配置与权限问题排查指南

## 1. 问题背景
在进行 `git push` 时，可能会遇到如下错误：
`ERROR: Permission to <repo> denied to <user_a>. fatal: Could not read from remote repository.`

### 核心原因分析
*   **身份冲突**：GitHub 通过本地的 SSH Key 识别身份，而非 `git config user.name`。
*   **权限不足**：当前识别到的 SSH 账号没有该仓库的写入权限。

---

## 2. 解决方案：配置多账号 SSH

### 第一步：为不同账号生成独立的 SSH Key
建议为每个账号指定明确的文件名。例如将密钥放在 `E:\HZF` 目录下：

```powershell
# 使用 -f 参数直接指定路径和文件名
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f E:\HZF\id_rsa_personal
```

### 第二步：创建/修改 SSH 配置文件 (`config`)
在用户目录的 `.ssh` 文件夹下（通常为 `C:\Users\用户名\.ssh\`）创建或修改 `config` 文件：
- 创建命令：`New-Item -Path "C:\Users\用户名\.ssh\config" -ItemType File`
- 写入配置内容
```text
# 账号一：默认账号 (即当前C盘的ssh账号)
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa

# 账号二：个人账号 (例如：hongzf)
Host github-personal #表示别名为github-personal
    HostName github.com
    User git
    # 注意：此处使用你刚才生成的私钥绝对路径
    IdentityFile E:/HZF/id_rsa_personal
```

### 第三步：将公钥添加到 GitHub
1.  打开公钥文件（如 `E:\HZF\id_rsa_personal.pub`），复制全部内容。
2.  登录对应的 GitHub 账号 -> **Settings** -> **SSH and GPG keys** -> **New SSH key**。

### 第四步：修改本地仓库的远程地址
由于配置了 `Host` 别名（如 `github-personal`），需要更新仓库的远程 URL：

```powershell
# 查看当前远程地址
git remote -v
# 将原来的 git@github.com 替换为配置中的别名 "github-personal"
# 格式：git remote set-url origin git@别名:用户名/仓库名.git
# git remote set-url origin git@github-personal:用户名/仓库名.git
git remote set-url origin git@github-personal:1628415507/ui-components.git
```

### 第五步：最后再次尝试推送：
```powershell
git push
```
---

## 3. 进阶排查建议

### 测试当前 SSH 身份
执行以下命令查看 GitHub 将你识别为哪个账号：
```bash
ssh -T git@github.com
# 或者测试别名
ssh -T git@github-personal
```

### 本地用户隔离
为了确保 Commit 日志中的作者信息正确，建议在对应仓库下单独设置用户信息：
```bash
git config user.name "Your Name"
git config user.email "your_email@example.com"
```

---

## 4. 架构师提示
*   **路径规范**：在 `config` 文件中，路径建议使用正斜杠 `/`，以避免 Windows 环境下的转义字符问题。
*   **安全原则**：私钥文件（无后缀名）必须妥善保管，严禁上传至任何代码仓库。
*   **协议选择**：若 SSH 调试困难，可临时切换为 HTTPS 协议并通过 Token 认证作为备选方案。
