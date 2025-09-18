'use client'
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{padding:'2rem'}}>
        <h2>Ocorreu um erro ao renderizar a página.</h2>
        <p>Digest: <code>{error?.digest ?? 'n/d'}</code></p>
        <p>Tente novamente e, se persistir, verifique os logs do deployment.</p>
      </body>
    </html>
  )
}
