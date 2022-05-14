/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  console.log(arg);
});
window.electron.ipcRenderer.send('ipc-example', ['ping']);

window.electron.ipcRenderer
  .invoke('some-name')
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
