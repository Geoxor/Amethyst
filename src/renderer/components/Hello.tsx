import { useEffect, useState } from 'react';
import type { IAudioMetadata } from 'music-metadata/lib';
import Cover from './Cover';

export default function Hello() {
  const [songs, setSongs] = useState<(IAudioMetadata & { path: string })[]>([]);

  useEffect(() => {
    async function fetchData() {
      window.electron.ipcRenderer
        .invoke('load-library')
        .then((data: any) => setSongs(data))
        .catch(() => console.log('Failed to fetch songs..'));
    }

    fetchData();
  }, []);

  return (
    <div className="p-4 flex flex-wrap gap-4">
      {songs.map((song) =>
        song.common.picture ? (
          <Cover
            key={song.common.title}
            image={song.common.picture[0].data.buffer}
            path={song.path}
          />
        ) : (
          <h1>Cannot load cover...</h1>
        )
      )}
    </div>
  );
}
