import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { metin } = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Sen akademik intihal analizi yapan bir yapay zekasın. Aşağıdaki akademik metni analiz et.

Metni şu açılardan değerlendir:
1. Özgünlük skoru (0-100 arası bir puan ver)
2. Potansiyel intihal riski olan bölümleri işaretle
3. Genel değerlendirme

SADECE JSON döndür:
{
  "skor": 87,
  "risk": "Düşük",
  "riskRenk": "yesil",
  "ozet": "Genel değerlendirme metni",
  "sorunlular": [
    {
      "metin": "sorunlu metin parçası",
      "sebep": "neden sorunlu olduğu",
      "risk": "Yüksek"
    }
  ],
  "oneriler": ["öneri 1", "öneri 2", "öneri 3"]
}

riskRenk değerleri: "yesil" (skor>=80), "sari" (skor>=60), "kirmizi" (skor<60)

Metin:
${metin}`
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
