# 从源码编译
采取这种方法的人应该熟悉这种做法（克隆、构建等）。

这条命令将在 `./release/build` 目录为你的系统构建 Amethyst。

## Windows
```sh
$ git clone --recurse-submodules https://github.com/geoxor/amethyst \
  && cd amethyst \
  && yarn \
  && yarn package 
```

## Linux
⚠️ 如果你在 Linux 上进行编译， 下方的命令将试图编译为 `AppImage`，`deb`，`rpm` 和 `snap`，这样很可能会编译失败，因为缺少编译所需的依赖。

**你应该运行下列的命令:**

```sh
$ yarn package --linux dir # 编译到 "release/build/linux-unpacked"
```

```sh
$ yarn package --linux deb # 编译成 deb 包
```

```sh
$ yarn package --linux appimage # 编译成 appimage 包
```


更多关于手动打包参数的信息可以参考 [electron-builder 文档](https://www.electron.build/configuration/linux.html)。

