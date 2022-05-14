import { ipcMain } from 'electron';
import MusicParser from './music-parser';

const LIBRARY_PATH = 'C:/Users/Geoxor/Documents/GitHub/amethyst/music';

ipcMain.handle('load-library', () => MusicParser.loadMusic(LIBRARY_PATH));

// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });
