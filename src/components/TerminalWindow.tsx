interface Props {
  imageUrl: string;
  altText: string;
}

export function TerminalWindow({ imageUrl, altText }: Props) {
  return (
    <div className="rounded-lg overflow-hidden border border-border shadow-2xl flex justify-center">
      <img
        src={imageUrl}
        alt={altText}
        className="max-w-full h-auto block max-h-[65vh]"
        loading="lazy"
      />
    </div>
  );
}
