import { ipcMain } from 'electron';

const doSomeWork = async () => {
  console.log('pussy');
  return 'pussy';
};

ipcMain.handle('some-name', async () => {
  const result = await doSomeWork();
  return result;
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});
