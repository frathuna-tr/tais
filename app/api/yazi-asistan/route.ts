import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { mod, metin, dil, hedefDil, stil } = await req.json()

    const prompts: Record<string, string> = {
      abstract: `Sen bir akademik yazı asistanısın. Aşağıdaki metinden profesyonel bir akademik abstract yaz.
Dil: ${dil || 'Türkçe'}
Stil: ${stil || 'Akademik'}
Format: Amaç, Yöntem, Bulgular, Sonuç yapısında, 250-300 kelime.
Metin: ${metin}`,

      coverletter: `Sen bir akademik yazı asistanısın. Aşağıdaki makale bilgilerine göre dergi editörüne profesyonel bir cover letter yaz.
Dil: ${dil || 'İngilizce'}
Akademik ve resmi ton kullan. 3-4 paragraf.
Makale bilgileri: ${metin}`,

      ceviri: `Aşağıdaki akademik metni ${hedefDil || 'İngilizce'} diline çevir. Akademik terminolojiyi koru, doğal ve akıcı bir çeviri yap.
Metin: ${metin}`,

      duzeltme: `Sen bir akademik yazı editörüsün. Aşağıdaki metni dilbilgisi, ifade ve akademik üslup açısından düzelt ve geliştir.
Orijinal yapıyı koru ama daha güçlü hale getir.
Metin: ${metin}`,

      ozet: `Aşağıdaki akademik metni ana noktaları koruyarak kısa ve öz bir şekilde özetle.
Dil: ${dil || 'Türkçe'}
3-5 madde halinde ana bulgular ve sonuçlar.
Metin: ${metin}`,
    }

    const prompt = prompts[mod] || prompts.abstract

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ sonuc: text })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
