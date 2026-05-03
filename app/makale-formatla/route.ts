import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { makale, hedefDergi, istek } = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Sen akademik makale formatlama uzmanısın.

Aşağıdaki makaleyi "${hedefDergi}" dergisinin kurallarına göre formatla.

Yapman gerekenler:
- Atıf ve referans stilini o derginin formatına çevir
- Bölüm başlıklarını o derginin standardına uyarla  
- Özet ve anahtar kelime formatını ayarla
- Şekil/tablo etiketlerini uyarla
- Kelime limiti uyarısı ekle
${istek ? `- Ek istek: ${istek}` : ''}

ÇIKTI FORMATINI TAM OLARAK ŞÖYLE VER:

===MAKALE===
[Formatlanmış makale — temiz, yayına hazır]

===NOTLAR===
[Bu dergi için 3-5 kritik kural ve uyarı]

===DEĞİŞİKLİKLER===
[Yapılan değişiklikleri madde madde listele]

Makale:
${makale}`
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const sonuc = text.split('===MAKALE===')[1]?.split('===NOTLAR===')[0]?.trim() || text
    const notlar = text.split('===NOTLAR===')[1]?.split('===DEĞİŞİKLİKLER===')[0]?.trim() || ''
    const degisiklikler = text.split('===DEĞİŞİKLİKLER===')[1]?.trim() || ''

    return NextResponse.json({ sonuc, notlar, degisiklikler })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
