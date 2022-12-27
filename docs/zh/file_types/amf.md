# Amethyst 元数据文件 (.amf)

<img align="right" src="https://github.com/Geoxor/amethyst/raw/master/assets/images/amf.png" alt=".amf" width="128"/>

这个文件存储在 `%appdata%/amethyst` 的 `Metadata Cache` 目录中，它是一个标准的 [JSON](https://en.wikipedia.org/wiki/JSON) 文件，包含了给定音频文件的元数据，元数据文件名将与它所存储的音频文件的名称相同。如果文件被重新命名，Amethyst 将不得不重新缓存元数据，这意味着可能会有缓存文件的副本。例如对于 `enjoii - Never Say Goodbye.flac`， AMethyst 将会创建 `enjoii - Never Say Goodbye.flac.amf` 作为其元数据文件。

## 重新生成
当 Amethyst 分析一个文件的元数据时，元数据文件就会生成。你可以通过强制刷新元数据来重写或使用快捷键 `CTRL + ALT + R`。

## 删除
如上所述，所有的元数据缓存都存储在 `%appdata%/amethyst/Metadata Cache`。删除该目录中的文件就可以将元数据的缓存删除。
