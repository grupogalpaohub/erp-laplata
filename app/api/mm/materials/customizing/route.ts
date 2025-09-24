import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Por enquanto, retornar dados hardcoded
    // Futuramente, buscar da tabela customizing
    const customizingData = {
      types: ['Brinco', 'Cordão', 'Choker', 'Gargantilha', 'Anel', 'Pulseira', 'Kit', 'Acessório', 'Outros'],
      classifications: ['Elementar', 'Ciclos', 'Amuletos', 'Ancestral', 'Místico', 'Naturaleza', 'Protetor', 'Outros']
    }

    return NextResponse.json(customizingData)

  } catch (error) {
    console.error('Error fetching customizing data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
