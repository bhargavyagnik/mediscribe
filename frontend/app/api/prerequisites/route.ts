import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { condition } = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/llm/prerequisites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ condition }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to get prerequisites')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get prerequisites' },
      { status: 500 }
    )
  }
} 