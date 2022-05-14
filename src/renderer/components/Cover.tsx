interface Props {
  image: ArrayBufferLike;
}

export default function Cover({ image }: Props) {
  return (
    <div>
      <img
        className="w-48 drop-shadow-xl rounded-[8px] transition duration-100 cursor-pointer transform scale-100 hover:scale-105 active:scale-100"
        src={URL.createObjectURL(new Blob([image], { type: 'image/jpeg' }))}
        alt="cover"
      />
    </div>
  );
}
