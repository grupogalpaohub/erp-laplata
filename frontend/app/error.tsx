"use client";
export default function GlobalError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  console.error("[GlobalError]", error?.message, error?.digest, error?.stack);
  return (
    <html><body style={{padding:24,fontFamily:"ui-sans-serif,system-ui"}}>
      <h2>Ocorreu um erro ao renderizar a página.</h2>
      <p>Digest: <code>{error?.digest ?? "n/a"}</code></p>
      <button onClick={reset} style={{marginTop:12,padding:"8px 12px",border:"1px solid #ddd",borderRadius:8}}>
        Tentar novamente
      </button>
    </body></html>
  );
}
