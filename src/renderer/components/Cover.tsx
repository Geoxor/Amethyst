import Player from '../player';

interface Props {
  image: ArrayBufferLike;
  path: string;
}

export default function Cover({ image, path }: Props) {
  return (
    <button type="button" onClick={() => Player.playAudio(path)}>
      <img
        className="w-48 drop-shadow-xl rounded-[8px] transition duration-100 cursor-pointer transform scale-100 hover:scale-[102.5%] active:scale-100"
        src={URL.createObjectURL(new Blob([image], { type: 'image/jpeg' }))}
        alt="cover"
      />
    </button>
  );
}
