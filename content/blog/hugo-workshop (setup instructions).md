---
title: "Hugo Workshop (Setup Instructions)"
date: 2023-10-13T07:08:51+05:30
draft: false
---

## Installing `Chocolatey` for Windows users

To help our Window friends install **Chocolatey** first, this seems too tempting right now, but it is effortless.

To install, press `Super`, type `powershell`, then run as "Administrator" and paste the following command.

<!-- ```batch
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
``` -->
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Press enter. After this you have chocolatey.

## Installing Git

Now we have a very powerfull package (yes, it is windows) *choco*. So installing **Git** is just single command.
Open powershell with administrative privilage, type

```powershell
choco install git.install
```

Finally, Check whether Git is installed Successfully or not? Pass the command

```powershell
git -version

# Output
# git version 2.42.0
```

## Installing and Setting Up `gh-cli`

To start with, first install the [GitHub Command Line Interface](https://github.com/cli/cli#installation) (`gh-cli`). Now let's install `gh-cli` in one command with

```batch
choco install gh
```

to test the installation type

```powershell
gh --version

# Output
# gh version 2.36.0 (2023-10-04)
# https://github.com/cli/cli/releases/tag/v2.36.0
```

As the installation looks good now, let's log in to your GitHub account with,

```bash
gh auth login
```

And then follow the instructions (make sure you are logged in to your GitHub account in your favourite browser).

## Installing HUGO

Now you all can guess the command for installing **HUGO** (but run in administrative powershell),

```powershell
choco install hugo-extended
```
