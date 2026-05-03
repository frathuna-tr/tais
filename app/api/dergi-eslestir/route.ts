import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  try {
    const { makale } = await req.json()
    if (!makale) return NextResponse.json({ error: 'Makale boş' }, { status: 400 })

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Sen TAİS platformunun akademik dergi eşleştirme yapay zekasısın.

Aşağıdaki makale için en uygun 5 dergiyi sırala. SADECE JSON döndür:
{
  "giris": "kısa giriş mesajı",
  "dergiler": [
    {
      "name": "Dergi Adı",
      "score": 94,
      "if": "7.5",
      "q": "Q1",
      "ulakbim": false,
      "open": true,
      "deadline": "18 gün",
      "urgency": "urgent",
      "aciklama": "Neden uygun"
    }
  ],
  "oneri": "öneri mesajı"
}

Makale: ${makale}`
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)
    return NextResponse.json(data)

  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message || 'Hata oluştu' }, { status: 500 })
  }
}