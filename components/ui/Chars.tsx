export default function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span className="ch" key={i}>{c === " " ? "\u00A0" : c}</span>
      ))}
    </>
  );
}
