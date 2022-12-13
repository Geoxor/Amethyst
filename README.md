<img align="left" src="https://media.discordapp.net/attachments/667464431562653706/1025732056124235826/icon.png?width=128&height=128">

![Discord](https://img.shields.io/discord/385387666415550474?label=Discord&logo=discord&style=flat)
![GitHub repo size](https://img.shields.io/github/repo-size/geoxor/amethyst?label=Size)

# 💎 Amethyst 
Amethyst is an [Electron-based](https://electronjs.org/) audio player with a [node-based](https://en.wikipedia.org/wiki/Node_graph_architecture) [audio routing](https://en.wikipedia.org/wiki/Audio_signal_flow) system, the main goal of this project is to make a [music player](https://en.wikipedia.org/wiki/Media_player_software) in [Typescript](https://www.typescriptlang.org/) to see how far we can stretch language today to prove it's possible to provide pro-level features as most [DAWs](https://en.wikipedia.org/wiki/Digital_audio_workstation) / [DAEs](https://en.wikipedia.org/wiki/Audio_editing_software), while also providing useful tools and customizability to the [end-user](https://en.wikipedia.org/wiki/End_user) to deal with audio.

## ⚠️ This is an unfinished application
Please do not write reviews yet as I have not finished implementing everything required for me to call this app "complete", things may suddenly change and the current state of the repository might not represent the complete version faithfully

## 📦 Installation
```bash
# Windows
winget install amethyst

# Arch
yay -S amethyst-player

# Debian (soon hopefully)
apt install amethyst

# MacOS (soon hopefully)
brew install amethyst

# Oneliner Build From Source
git clone --recurse-submodules https://github.com/geoxor/amethyst && cd amethyst && yarn && yarn test --run && yarn package
```

![Amethyst](https://cdn.discordapp.com/attachments/897569464684535860/1052188532975861850/image.png)

## ✨ Features
- Custom cursors
- Support for animated [GIF](https://en.wikipedia.org/wiki/GIF) cover art
- [Multichannel](https://en.wikipedia.org/wiki/Surround_sound) (up to 9.1.2) dB meters
- High FPS customizable [spectrum](https://en.wikipedia.org/wiki/Spectrum_analyzer)
- High FPS customizable [vectorscope](https://en.wikipedia.org/wiki/Vectorscope)
- [Discord RPC](https://discord.com/developers/docs/topics/rpc)
- [Node based](https://en.wikipedia.org/wiki/Node_graph_architecture) audio routing system
- Support for playing 
  - [ogg](https://en.wikipedia.org/wiki/Ogg)
  - [flac](https://en.wikipedia.org/wiki/FLAC)
  - [wav](https://en.wikipedia.org/wiki/WAV)
  - [opus](https://en.wikipedia.org/wiki/Opus_(audio_format))
  - [aac](https://en.wikipedia.org/wiki/Advanced_Audio_Coding)
  - [aiff](https://en.wikipedia.org/wiki/Audio_Interchange_File_Format)
  - [mp3](https://en.wikipedia.org/wiki/MP3)
  - [m4a](https://en.wikipedia.org/wiki/MP4_file_format)

## 📝 Contributing
- Use `Node.js 1.16.10`
- Use the `recommended extensions`
- Have `libvips` installed for linux
- Have `yarn` installed

## ⌨️ Coding
- Install dependencies with `yarn`
- Develop with `yarn dev`
- Compile with `yarn package`, compiled files will be in the `release/build` folder
