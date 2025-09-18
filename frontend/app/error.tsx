'use client'
export default function Error({error}:{error:Error}){ 
  return <pre style={{whiteSpace:'pre-wrap',color:'#b00'}}>Erro: {error.message}</pre>
}
