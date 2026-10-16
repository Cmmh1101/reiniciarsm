// Shown on pages whose content is Spanish-only for now, when the visitor is browsing in English.
export default function SpanishOnlyNotice({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="note" className="bg-paper-soft text-ink font-mono text-[11.5px] tracking-wide px-[8vw] py-3 border-b border-[rgba(20,25,43,0.1)]">
      {message}
    </p>
  );
}
