'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const ikonStyle = { width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' } as const

const sidebarSections = [
  { label: 'Ana Menü', items: [
    { label:'Dashboard', href:'/dashboard', badge:'', icon:<svg viewBox="0 0 12 12" fill="#60a5fa" width="14" height="14"><rect x="1" y="1" width="4" height="4"/><rect x="7" y="1" width="4" height="4"/><rect x="1" y="7" width="4" height="4"/><rect x="7" y="7" width="4" height="4"/></svg> },
    { label:'Akademik Ağ', href:'/ag', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="2" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="2" r="1.5" fill="#06b6d4"/><circle cx="10" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="10" r="1.5" fill="#06b6d4"/><line x1="2" y1="6" x2="6" y2="2" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="2" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/><line x1="2" y1="6" x2="6" y2="10" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="10" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/></svg> },
    { label:'Dergi Eşleştirme', href:'/dergi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#34d399" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
    { label:'Preprint', href:'/preprint', badge:'', icon:<svg viewBox="0 0 12 12" fill="#fb923c" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
    { label:'Makale Formatlama', href:'/format', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#f97316" width="14" height="14"><rect x="1" y="1" width="10" height="1"/><rect x="1" y="3" width="8" height="1"/><rect x="1" y="5" width="10" height="1"/><rect x="1" y="7" width="6" height="1"/><rect x="8" y="6" width="3" height="3"/><rect x="9" y="5" width="1" height="1"/></svg> },
    { label:'Projeler', href:'/projeler', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#3b82f6" width="14" height="14"><rect x="1" y="1" width="10" height="2"/><rect x="1" y="5" width="10" height="2"/><rect x="1" y="9" width="7" height="2"/></svg> },
    { label:'İş Birliği Alanı', href:'/isbirligi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#00c48c" width="14" height="14"><rect x="0" y="5" width="3" height="2"/><rect x="3" y="4" width="2" height="1"/><rect x="3" y="7" width="2" height="1"/><rect x="5" y="3" width="2" height="6"/><rect x="7" y="4" width="2" height="1"/><rect x="7" y="7" width="2" height="1"/><rect x="9" y="5" width="3" height="2"/></svg> },
    { label:'CV', href:'/cv', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#fbbf24" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="0" width="4" height="2"/><rect x="4" y="3" width="4" height="1"/><rect x="4" y="5" width="5" height="1"/></svg> },
    { label:'Yazı Asistanı', href:'/yazi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#06b6d4" width="14" height="14"><rect x="1" y="1" width="7" height="1"/><rect x="1" y="3" width="5" height="1"/><rect x="1" y="5" width="6" height="1"/><rect x="1" y="7" width="4" height="1"/><rect x="8" y="6" width="3" height="1"/><rect x="9" y="5" width="1" height="3"/></svg> },
    { label:'İntihal Kontrolü', href:'/intihal', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="5" cy="5" r="3.5" stroke="#38bdf8" strokeWidth="1" fill="none"/><line x1="7.5" y1="7.5" x2="11" y2="11" stroke="#38bdf8" strokeWidth="1.5"/></svg> },
    { label:'Mesajlar', href:'/mesajlar', badge:'7', badgeRed:true, icon:<svg viewBox="0 0 12 12" fill="rgba(255,255,255,0.45)" width="14" height="14"><rect x="1" y="2" width="10" height="7"/><rect x="1" y="9" width="2" height="2"/><rect x="2" y="8" width="8" height="1"/></svg> },
  ]},
  { label: 'Paydaşlar', items: [
    { label:'Danışmanlık', href:'/danisman', badge:'', icon:<svg viewBox="0 0 12 12" fill="#22d3ee" width="14" height="14"><rect x="1" y="4" width="10" height="7"/><rect x="4" y="2" width="4" height="2"/><rect x="5" y="6" width="2" height="3"/></svg> },
    { label:'Firmalar', href:'/firmalar', badge:'', icon:<svg viewBox="0 0 12 12" fill="#f43f5e" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="3" width="1" height="1"/><rect x="7" y="3" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="5" y="8" width="2" height="3"/></svg> },
  ]},
  { label: 'Profil', items: [
    { label:'Profilim', href:'/profil', badge:'', icon:<svg viewBox="0 0 12 12" fill="#94a3b8" width="14" height="14"><rect x="4" y="1" width="4" height="4"/><rect x="3" y="2" width="1" height="2"/><rect x="8" y="2" width="1" height="2"/><rect x="3" y="5" width="1" height="1"/><rect x="8" y="5" width="1" height="1"/><rect x="1" y="8" width="10" height="3"/><rect x="2" y="7" width="2" height="1"/><rect x="8" y="7" width="2" height="1"/></svg> },
  ]},
]

interface Sonuc {
  skor: number
  risk: string
  riskRenk: string
  ozet: string
  sorunlular: { metin: string; sebep: string; risk: string }[]
  oneriler: string[]
}

export default function Intihal() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [metin, setMetin] = useState('')
  const [loading, setLoading] = useState(false)
  const [sonuc, setSonuc] = useState<Sonuc | null>(null)
  const [animSkor, setAnimSkor] = useState(0)
  const [dosyaAdi, setDosyaAdi] = useState('')
  const [kaynaklar, setKaynaklar] = useState([
    {label:'Akademik Veritabanları',desc:'arXiv, PubMed, Semantic Scholar',on:true},
    {label:'Türk Akademik Arşivi',desc:'DergiPark, YÖK Tez Merkezi',on:true},
    {label:'Web Kaynakları',desc:'Genel internet içeriği',on:false},
  ])

  useEffect(() => {
    const move = (e: MouseEvent) => { if (curRef.current) { curRef.current.style.left=(e.clientX-2)+'px'; curRef.current.style.top=(e.clientY-2)+'px' } }
    document.addEventListener('mousemove', move)
    return () => document.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const mn = mncRef.current; if (!mn) return
    const mc = mn.getContext('2d')!
    const mnp = [{x:4,y:4},{x:13,y:3},{x:22,y:4},{x:13,y:13},{x:13,y:22},{x:7,y:18},{x:19,y:18}]
    const mph = mnp.map(() => mnp.map(() => Math.random()*Math.PI*2))
    let mt = 0, raf: number
    const draw = () => {
      mc.clearRect(0,0,26,26)
      for (let i=0;i<mnp.length;i++) for (let j=i+1;j<mnp.length;j++) {
        const a=mnp[i],b=mnp[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy)
        if (d<16) { const f=Math.max(0,Math.sin(mt*0.9+mph[i][j])); mc.beginPath(); mc.moveTo(a.x,a.y); mc.lineTo(b.x,b.y); mc.strokeStyle=`rgba(0,196,140,${f*0.7*(1-d/16)})`; mc.lineWidth=0.9; mc.stroke() }
      }
      mnp.forEach((p,i) => {
        const pulse=Math.sin(mt*1.5+i*0.7); const g=0.5+0.5*Math.sin(mt*0.8+i*1.2)
        mc.beginPath(); mc.arc(p.x,p.y,1.8+pulse*0.5,0,Math.PI*2)
        mc.fillStyle=`rgba(${Math.round(240*(1-g))},${Math.round(244*(1-g)+196*g)},${Math.round(255*(1-g)+140*g)},${0.7+0.3*pulse})`; mc.fill()
      })
      mt+=0.022; raf=requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  // Skor animasyonu
  useEffect(() => {
    if (!sonuc) return
    let current = 0
    const target = sonuc.skor
    const iv = setInterval(() => {
      current += 2
      if (current >= target) { setAnimSkor(target); clearInterval(iv) }
      else setAnimSkor(current)
    }, 20)
    return () => clearInterval(iv)
  }, [sonuc])

  const skorRenk = (s: number) => s >= 80 ? '#00c48c' : s >= 60 ? '#f59e0b' : '#ef4444'
  const riskRenk = (r: string) => r === 'Yüksek' ? '#ef4444' : r === 'Orta' ? '#f59e0b' : '#00c48c'

  const kontrol = async () => {
    if (!metin.trim() || loading) return
    setLoading(true); setSonuc(null); setAnimSkor(0)
    try {
      const res = await fetch('/api/intihal-kontrol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metin }),
      })
      const data = await res.json()
      if (!data.error) setSonuc(data)
      else setSonuc({ skor: 0, risk: 'Hata', riskRenk: 'kirmizi', ozet: data.error, sorunlular: [], oneriler: [] })
    } catch {
      setSonuc({ skor: 0, risk: 'Hata', riskRenk: 'kirmizi', ozet: 'Bağlantı hatası.', sorunlular: [], oneriler: [] })
    }
    setLoading(false)
  }

  const dosyaOku = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDosyaAdi(file.name)
    const reader = new FileReader()
    reader.onload = ev => setMetin(ev.target?.result as string || '')
    reader.readAsText(file)
  }

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#00c48c; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
        .upload-zone { border:2px dashed rgba(0,196,140,0.3); padding:28px; text-align:center; transition:all 0.2s; cursor:pointer; }
        .upload-zone:hover { border-color:#00c48c; background:rgba(0,196,140,0.03); }
        .field-textarea { width:100%; border:1.5px solid rgba(0,0,0,0.07); padding:14px; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; resize:none; background:#fff; line-height:1.7; transition:border 0.2s; color:#0a0a0a; }
        .field-textarea:focus { border-color:#00c48c; }
        .run-btn { width:100%; background:#00c48c; color:#0a0a0a; border:none; padding:14px; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .run-btn:hover { background:#00a87a; color:#fff; }
        .run-btn:disabled { background:#ccc; cursor:not-allowed; }
        .sorun-item { padding:12px 14px; border-left:3px solid; background:#fff; border:1px solid rgba(0,0,0,0.07); }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanLine { 0%{top:0;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <svg ref={curRef} style={{position:'fixed',top:0,left:0,zIndex:9999,pointerEvents:'none'}} width="20" height="20" viewBox="0 0 10 10">
        <rect x="0" y="0" width="2" height="2" fill="#00c48c"/><rect x="0" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="4" width="2" height="2" fill="#00c48c"/><rect x="0" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="8" width="2" height="2" fill="#00c48c"/><rect x="2" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="4" width="2" height="2" fill="#00c48c"/><rect x="4" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="6" width="2" height="2" fill="#00c48c"/><rect x="6" y="8" width="2" height="2" fill="#00c48c"/>
      </svg>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',height:'100vh'}}>

        {/* SIDEBAR */}
        <aside style={{background:'linear-gradient(180deg,#0d1117 0%,#0a0f0c 100%)',display:'flex',flexDirection:'column',height:'100vh',overflowY:'auto',borderRight:'1px solid rgba(0,196,140,0.15)'}}>
          <div style={{padding:'16px 20px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
              <canvas ref={mncRef} width="26" height="26" style={{flexShrink:0}}/>
              <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'21px',fontWeight:700,background:'linear-gradient(90deg,#00c48c,#fff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>tais.tr</span>
            </div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,0.2)',letterSpacing:'1px'}}>Akademik Ekosistem</div>
          </div>
          {sidebarSections.map((section, si) => (
            <div key={si} style={{padding:'10px 0'}}>
              <div style={{fontSize:'9px',color:'rgba(0,196,140,0.5)',letterSpacing:'2px',textTransform:'uppercase',padding:'0 18px',marginBottom:'6px'}}>{section.label}</div>
              {section.items.map((item, i) => {
                const isActive = '/intihal' === item.href
                return (
                  <div key={i} onClick={() => router.push(item.href)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 18px',fontSize:'13px',color:isActive?'#00c48c':'rgba(255,255,255,0.55)',borderLeft:`2px solid ${isActive?'#00c48c':'transparent'}`,background:isActive?'rgba(0,196,140,0.08)':'transparent',fontWeight:isActive?600:400,cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='#fff';el.style.background='rgba(255,255,255,0.05)'}}}
                    onMouseLeave={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='rgba(255,255,255,0.55)';el.style.background='transparent'}}}>
                    <span style={ikonStyle}>{item.icon}</span>
                    <span style={{flex:1}}>{item.label}</span>
                    {item.badge && <span style={{background:(item as any).badgeRed?'#ee5533':'#00c48c',color:(item as any).badgeRed?'#fff':'#0a0a0a',fontSize:'8px',fontWeight:800,padding:'2px 5px',borderRadius:(item as any).badgeRed?'8px':'0',fontFamily:"'Pixelify Sans',monospace"}}>{item.badge}</span>}
                  </div>
                )
              })}
            </div>
          ))}
          <div style={{marginTop:'auto',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'34px',height:'34px',background:'#00c48c',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#0a0a0a',fontFamily:"'Pixelify Sans',monospace"}}>AY</div>
              <div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',fontWeight:500}}>Dr. Ayşe Yılmaz</div>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>Doç. Dr. · İTÜ</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>

          {/* HEADER */}
          <div style={{background:'linear-gradient(90deg,#38bdf8 0%,#38bdf888 50%,#38bdf820 100%)',padding:'14px 28px',display:'flex',alignItems:'center',gap:'16px',flexShrink:0,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a'}}>🔍 İntihal Kontrolü</div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.5)',marginTop:'3px'}}>Akademik metninizin özgünlüğünü YZ ile analiz edin</div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'6px',fontFamily:"'Pixelify Sans',monospace",fontSize:'11px',color:'#0a0a0a',fontWeight:700}}>
              <span style={{width:'6px',height:'6px',background:loading?'#f59e0b':'#0a0a0a',borderRadius:'50%'}}/>
              {loading?'Analiz Ediliyor...':'Hazır'}
            </div>
          </div>

          <div style={{flex:1,overflow:'hidden',display:'grid',gridTemplateColumns:'380px 1fr',minHeight:0}}>

            {/* SOL — GİRİŞ */}
            <div style={{display:'flex',flexDirection:'column',borderRight:'1px solid rgba(0,0,0,0.07)',overflow:'hidden'}}>

              <div style={{flex:1,overflowY:'auto',padding:'20px',display:'flex',flexDirection:'column',gap:'14px'}}>

                {/* DOSYA YÜKLEME */}
                <div>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Dosya Yükle (opsiyonel)</div>
                  <label className="upload-zone">
                    <div style={{fontSize:'28px',marginBottom:'8px'}}>📄</div>
                    <div style={{fontSize:'13px',fontWeight:600,color:'#0a0a0a',marginBottom:'4px'}}>
                      {dosyaAdi || 'PDF veya TXT yükle'}
                    </div>
                    <div style={{fontSize:'11px',color:'rgba(0,0,0,0.35)'}}>veya aşağıya metin yapıştır</div>
                    <input type="file" accept=".txt,.pdf" style={{display:'none'}} onChange={dosyaOku}/>
                  </label>
                </div>

                {/* METİN GİRİŞİ */}
                <div style={{flex:1,display:'flex',flexDirection:'column',gap:'6px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',letterSpacing:'1px',textTransform:'uppercase'}}>Veya Metin Girin</div>
                    <span style={{fontSize:'11px',color:'rgba(0,0,0,0.3)'}}>{metin.length} karakter</span>
                  </div>
                  <textarea className="field-textarea" style={{flex:1,minHeight:'200px'}} placeholder="Analiz etmek istediğiniz akademik metni buraya yapıştırın..." value={metin} onChange={e => setMetin(e.target.value)}/>
                </div>

                {/* KAYNAK SEÇENEKLERİ */}
                <div>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Karşılaştırma Kaynakları</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    {kaynaklar.map((s,i) => (
                      <div key={i} onClick={() => setKaynaklar(prev => prev.map((k,j) => j===i ? {...k,on:!k.on} : k))} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',border:`1.5px solid ${s.on?'rgba(0,196,140,0.3)':'rgba(0,0,0,0.07)'}`,background:s.on?'rgba(0,196,140,0.03)':'#fff',cursor:'pointer',transition:'all 0.2s'}}>
                        <div style={{width:'16px',height:'16px',border:`2px solid ${s.on?'#00c48c':'rgba(0,0,0,0.2)'}`,borderRadius:'2px',background:s.on?'#00c48c':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.2s'}}>
                          {s.on&&<svg viewBox="0 0 8 8" width="10" height="10"><polyline points="1 4 3.5 6.5 7 2" stroke="#0a0a0a" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                        </div>
                        <div>
                          <div style={{fontSize:'12px',fontWeight:500,color:'#0a0a0a'}}>{s.label}</div>
                          <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)',marginTop:'1px'}}>{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ÇALIŞTIR */}
              <div style={{padding:'16px',borderTop:'1px solid rgba(0,0,0,0.07)',flexShrink:0}}>
                <button className="run-btn" onClick={kontrol} disabled={loading || !metin.trim()}>
                  {loading ? (
                    <div style={{display:'flex',alignItems:'center',gap:'8px',justifyContent:'center'}}>
                      <span style={{width:'16px',height:'16px',border:'2px solid #0a0a0a',borderTop:'2px solid transparent',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/>
                      Analiz ediliyor...
                    </div>
                  ) : '🔍 İntihal Kontrolü Başlat'}
                </button>
              </div>
            </div>

            {/* SAĞ — SONUÇ */}
            <div style={{overflowY:'auto',padding:'24px',background:'#f8f9fa'}}>

              {!sonuc && !loading && (
                <div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px',color:'rgba(0,0,0,0.25)',textAlign:'center'}}>
                  <div style={{fontSize:'56px',opacity:0.3}}>🔍</div>
                  <div>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'16px',color:'rgba(0,0,0,0.4)',marginBottom:'6px'}}>Analiz bekleniyor</div>
                    <div style={{fontSize:'13px',maxWidth:'280px',lineHeight:1.6}}>Metninizi girin ve kontrolü başlatın. Sonuçlar burada görünecek.</div>
                  </div>
                </div>
              )}

              {loading && (
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'24px',height:'100%',animation:'fadeIn 0.3s ease'}}>
                  {/* TARAMA ANİMASYONU */}
                  <div style={{position:'relative',width:'100px',height:'130px'}}>
                    <div style={{position:'absolute',inset:0,background:'#fff',border:'1.5px solid rgba(0,0,0,0.1)',borderRadius:'4px'}}>
                      {[20,35,50,65,80,95,110].map((top,i) => (
                        <div key={i} style={{position:'absolute',left:'12px',right:'12px',top:`${top}%`,height:'3px',background:'rgba(0,0,0,0.07)',borderRadius:'2px'}}/>
                      ))}
                    </div>
                    <div style={{position:'absolute',left:'8px',right:'8px',height:'2px',background:'linear-gradient(90deg,transparent,#38bdf8,transparent)',boxShadow:'0 0 8px rgba(56,189,248,0.8)',animation:'scanLine 1.5s ease-in-out infinite'}}/>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'16px',color:'#0a0a0a',marginBottom:'6px'}}>Analiz ediliyor...</div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)'}}>Akademik veritabanları taranıyor</div>
                  </div>
                </div>
              )}

              {sonuc && (
                <div style={{display:'flex',flexDirection:'column',gap:'16px',animation:'fadeIn 0.4s ease'}}>

                  {/* SKOR KARTI */}
                  <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.07)',padding:'24px',display:'flex',alignItems:'center',gap:'24px'}}>
                    {/* DAİRE SKOR */}
                    <div style={{position:'relative',width:'100px',height:'100px',flexShrink:0}}>
                      <svg viewBox="0 0 100 100" width="100" height="100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="10"/>
                        <circle cx="50" cy="50" r="42" fill="none" stroke={skorRenk(animSkor)} strokeWidth="10"
                          strokeDasharray={`${2*Math.PI*42}`} strokeDashoffset={`${2*Math.PI*42*(1-animSkor/100)}`}
                          strokeLinecap="round" transform="rotate(-90 50 50)" style={{transition:'stroke-dashoffset 0.05s'}}/>
                      </svg>
                      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'22px',fontWeight:700,color:skorRenk(animSkor),lineHeight:1}}>
                          %{animSkor}
                        </div>
                        <div style={{fontSize:'9px',color:'rgba(0,0,0,0.3)',marginTop:'2px'}}>Özgünlük</div>
                      </div>
                    </div>

                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                        <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a'}}>
                          {sonuc.skor >= 80 ? '✅ Özgün' : sonuc.skor >= 60 ? '⚠️ Dikkat Gerekli' : '🚨 Yüksek Risk'}
                        </div>
                        <span style={{background:riskRenk(sonuc.risk)+'20',color:riskRenk(sonuc.risk),fontSize:'11px',padding:'3px 10px',fontWeight:700}}>
                          {sonuc.risk} Risk
                        </span>
                      </div>
                      <div style={{fontSize:'13px',color:'rgba(0,0,0,0.6)',lineHeight:1.6}}>{sonuc.ozet}</div>
                    </div>
                  </div>

                  {/* SORUNLU BÖLÜMLER */}
                  {sonuc.sorunlular.length > 0 && (
                    <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.07)',padding:'18px'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700,marginBottom:'12px',color:'#0a0a0a'}}>
                        ⚠️ Dikkat Gerektiren Bölümler
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                        {sonuc.sorunlular.map((s,i) => (
                          <div key={i} style={{padding:'12px 14px',background:'#fafafa',borderLeft:`3px solid ${riskRenk(s.risk)}`,border:`1px solid rgba(0,0,0,0.06)`}}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                              <span style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:riskRenk(s.risk)}}>{s.risk} Risk</span>
                            </div>
                            <div style={{fontSize:'12px',fontWeight:500,color:'#0a0a0a',marginBottom:'4px',fontStyle:'italic'}}>"{s.metin}"</div>
                            <div style={{fontSize:'11px',color:'rgba(0,0,0,0.45)'}}>{s.sebep}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ÖNERİLER */}
                  {sonuc.oneriler.length > 0 && (
                    <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.07)',padding:'18px'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700,marginBottom:'12px',color:'#0a0a0a'}}>
                        💡 Öneriler
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                        {sonuc.oneriler.map((o,i) => (
                          <div key={i} style={{display:'flex',gap:'10px',alignItems:'flex-start',padding:'8px 0',borderBottom:i<sonuc.oneriler.length-1?'1px solid rgba(0,0,0,0.05)':'none'}}>
                            <div style={{width:'20px',height:'20px',background:'rgba(0,196,140,0.1)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'10px',fontWeight:700,color:'#00c48c',fontFamily:"'Pixelify Sans',monospace"}}>
                              {i+1}
                            </div>
                            <div style={{fontSize:'12px',color:'rgba(0,0,0,0.6)',lineHeight:1.5}}>{o}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YENİDEN KONTROL */}
                  <button onClick={() => setSonuc(null)} style={{background:'transparent',border:'1px solid rgba(0,0,0,0.1)',padding:'10px',fontSize:'12px',fontWeight:600,color:'rgba(0,0,0,0.4)',cursor:'pointer',fontFamily:'DM Sans,sans-serif',transition:'all 0.2s'}}
                    onMouseEnter={e => {(e.currentTarget as HTMLElement).style.borderColor='#0a0a0a';(e.currentTarget as HTMLElement).style.color='#0a0a0a'}}
                    onMouseLeave={e => {(e.currentTarget as HTMLElement).style.borderColor='rgba(0,0,0,0.1)';(e.currentTarget as HTMLElement).style.color='rgba(0,0,0,0.4)'}}>
                    ← Yeni Kontrol
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
