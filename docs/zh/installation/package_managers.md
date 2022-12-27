# 通过软件包管理器进行安装

对于那些人来说，Amethyst 可以从下列的软件库中安装，这种方法适用于想要快速并简单地体验 Amethyst 的用户。

## Winget
Amethyst 可以从 [Winget Repository](https://github.com/microsoft/winget-pkgs/tree/master/manifests/g/Geoxor/Amethyst) 中下载。
```powershell
$ winget install -e --id Geoxor.Amethyst
```

## Scoop
Amethyst 可以通过 [Scoop](https://scoop.sh/) 安装。
```powershell
$ scoop install https://raw.githubusercontent.com/Geoxor/Amethyst/master/manifests/scoop/amethyst.json
```

## Pacman
Amethyst 也可以通过 [Aur Repository](https://aur.archlinux.org/packages/amethyst-player) 安装、
```sh
$ yay -S amethyst-player
```