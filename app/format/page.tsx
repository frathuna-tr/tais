'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const ikonStyle = { width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' } as const

const sidebarSections = [
  { label: 'Ana Menü', items: [
    { label:'Dashboard', href:'/dashboard', badge:'', icon:<svg viewBox="0 0 12 12" fill="#60a5fa" width="14" height="14"><rect x="1" y="1" width="4" height="4"/><rect x="7" y="1" width="4" height="4"/><rect x="1" y="7" width="4" height="4"/><rect x="7" y="7" width="4" height="4"/></svg> },
    { label:'Akademik Ağ', href:'/ag', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="2" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="2" r="1.5" fill="#06b6d4"/><circle cx="10" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="10" r="1.5" fill="#06b6d4"/><line x1="2" y1="6" x2="6" y2="2" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="2" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/><line x1="2" y1="6" x2="6" y2="10" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="10" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/></svg> },
    { label:'Dergi Eşleştirme', href:'/dergi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#34d399" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
    { label:'Makale Formatlama', href:'/format', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#f97316" width="14" height="14"><rect x="1" y="1" width="10" height="1"/><rect x="1" y="3" width="8" height="1"/><rect x="1" y="5" width="10" height="1"/><rect x="1" y="7" width="6" height="1"/><rect x="8" y="6" width="3" height="3"/><rect x="9" y="5" width="1" height="1"/></svg> },
    { label:'Preprint', href:'/preprint', badge:'', icon:<svg viewBox="0 0 12 12" fill="#fb923c" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
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

const DERGILER = [
  'Nature Medicine','The Lancet','JAMA','BMJ','Cell',
  'Nature','Science','PLOS ONE','Scientific Reports',
  'Computers in Biology and Medicine','AI in Medicine',
  'Journal of Medical Systems','IEEE Trans. Medical Imaging',
  'Bioinformatics','Nucleic Acids Research',
  'Türkiye Klinikleri','Acta Medica','Balkan Medical Journal',
  'DergiPark','ULAKBİM',
]

export default function MakaleFormatlama() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [makale, setMakale] = useState('')
  const [dosyaAdi, setDosyaAdi] = useState('')
  const [hedefDergi, setHedefDergi] = useState('Nature Medicine')
  const [ozelDergi, setOzelDergi] = useState('')
  const [hedefFormat, setHedefFormat] = useState('apa7')
  const [istek, setIstek] = useState('')
  const [loading, setLoading] = useState(false)
  const [sonuc, setSonuc] = useState('')
  const [notlar, setNotlar] = useState('')
  const [degisiklikler, setDegisiklikler] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

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

  const formatla = async () => {
    if (!makale.trim() || loading) return
    setLoading(true); setSonuc(''); setNotlar(''); setDegisiklikler([])
    try {
      const res = await fetch('/api/makale-formatla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ makale, hedefDergi: ozelDergi || hedefDergi, hedefFormat, istek }),
      })
      const data = await res.json()
      if (data.sonuc) {
        setSonuc(data.sonuc)
        setNotlar(data.notlar || '')
        setDegisiklikler(data.degisiklikler?.split('\n').filter((d: string) => d.trim().startsWith('-') || d.trim().startsWith('•') || d.trim().match(/^\d/)) || [])
      } else {
        setSonuc('Hata: ' + (data.error || 'Bilinmeyen hata'))
      }
    } catch {
      setSonuc('Bağlantı hatası.')
    }
    setLoading(false)
  }

  const dosyaOku = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setDosyaAdi(f.name)
    const reader = new FileReader()
    reader.onload = ev => setMakale(ev.target?.result as string || '')
    reader.readAsText(f)
  }

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#f97316; border-left-color:#f97316; background:rgba(249,115,22,0.08); font-weight:600; }
        .field { width:100%; border:1.5px solid rgba(0,0,0,0.07); padding:10px 12px; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; background:#fff; transition:border 0.2s; color:#0a0a0a; }
        .field:focus { border-color:#f97316; }
        .run-btn { width:100%; background:#f97316; color:#fff; border:none; padding:13px; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .run-btn:hover { background:#9061f9; }
        .run-btn:disabled { background:#ccc; cursor:not-allowed; }
        .toolbar-btn { background:transparent; border:1px solid rgba(0,0,0,0.1); padding:7px 14px; font-size:11px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; color:rgba(0,0,0,0.5); }
        .toolbar-btn:hover { border-color:#0a0a0a; color:#0a0a0a; }
        .toolbar-btn.primary { background:#0a0a0a; color:#fff; border-color:#0a0a0a; }
        .toolbar-btn.primary:hover { background:#f97316; border-color:#f97316; }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
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
                const isActive = '/format' === item.href
                return (
                  <div key={i} onClick={() => router.push(item.href)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 18px',fontSize:'13px',color:isActive?'#f97316':'rgba(255,255,255,0.55)',borderLeft:`2px solid ${isActive?'#f97316':'transparent'}`,background:isActive?'rgba(249,115,22,0.08)':'transparent',fontWeight:isActive?600:400,cursor:'pointer',transition:'all 0.2s'}}
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

        {/* MAIN — TEMİZ SPLIT SCREEN */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',height:'100vh',overflow:'hidden'}}>

          {/* SOL — GİRİŞ */}
          <div style={{display:'flex',flexDirection:'column',borderRight:'1px solid rgba(0,0,0,0.07)',overflow:'hidden',background:'#fff'}}>

            {/* Sol header */}
            <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(0,0,0,0.07)',background:'linear-gradient(90deg,#f9731615,transparent)'}}>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'15px',fontWeight:700,color:'#0a0a0a',marginBottom:'2px'}}>✨ Makale Formatlama</div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.4)'}}>Makalenizi hedef dergiye uygun formata çevirin</div>
            </div>

            <div style={{flex:1,overflowY:'auto',padding:'18px',display:'flex',flexDirection:'column',gap:'14px'}}>

              {/* ATIF FORMATI */}
              <div>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>Atıf & Referans Formatı</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}}>
                  {[
                    {key:'apa7',label:'APA 7',desc:'Sosyal Bilimler'},
                    {key:'vancouver',label:'Vancouver',desc:'Tıp & Sağlık'},
                    {key:'chicago',label:'Chicago',desc:'Beşeri Bilimler'},
                    {key:'ieee',label:'IEEE',desc:'Mühendislik'},
                    {key:'harvard',label:'Harvard',desc:'Genel Akademik'},
                    {key:'mla',label:'MLA',desc:'Dil & Edebiyat'},
                    {key:'ama',label:'AMA',desc:'Tıp Dergileri'},
                    {key:'acs',label:'ACS',desc:'Kimya Bilimleri'},
                    {key:'nature',label:'Nature',desc:'Nature Grubu'},
                  ].map(f => (
                    <div key={f.key} onClick={() => setHedefFormat(f.key)} style={{padding:'8px 10px',border:`1.5px solid ${hedefFormat===f.key?'#f97316':'rgba(0,0,0,0.07)'}`,background:hedefFormat===f.key?'rgba(249,115,22,0.06)':'#f8fafc',cursor:'pointer',transition:'all 0.2s',textAlign:'center'}}>
                      <div style={{fontSize:'12px',fontWeight:700,color:hedefFormat===f.key?'#f97316':'#0a0a0a'}}>{f.label}</div>
                      <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',marginTop:'1px'}}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HEDEF DERGİ */}
              <div>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>Hedef Dergi</div>
                <select className="field" value={hedefDergi} onChange={e => setHedefDergi(e.target.value)} style={{marginBottom:'6px'}}>
                  {DERGILER.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input className="field" placeholder="Listede yok mu? Dergi adını yazın..." value={ozelDergi} onChange={e => setOzelDergi(e.target.value)}/>
              </div>

              {/* MAKALE */}
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:'6px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px'}}>Makale Metni</div>
                  <label style={{fontSize:'11px',color:'#f97316',fontWeight:600,cursor:'pointer'}}>
                    📎 {dosyaAdi || 'Dosya Yükle'}
                    <input type="file" accept=".txt,.doc,.docx" style={{display:'none'}} onChange={dosyaOku}/>
                  </label>
                </div>
                <textarea
                  className="field"
                  style={{flex:1,resize:'none',lineHeight:1.7,minHeight:'200px'}}
                  placeholder="Makalenizi buraya yapıştırın...

YZ hangi dergiye gönderdiğinizi bilip o derginin kurallarını otomatik uygulayacak:
• Atıf formatı (APA, Vancouver, Chicago...)
• Bölüm başlıkları
• Özet yapısı
• Referans listesi"
                  value={makale}
                  onChange={e => setMakale(e.target.value)}
                />
                <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',textAlign:'right'}}>
                  {makale.split(/\s+/).filter(Boolean).length} kelime · {makale.length} karakter
                </div>
              </div>

              {/* ÖZEL İSTEK */}
              <div>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px'}}>Özel İstek (opsiyonel)</div>
                <input className="field" placeholder="ör. Özeti 250 kelimeye düşür, şekil başlıklarını İngilizce yap..." value={istek} onChange={e => setIstek(e.target.value)}/>
              </div>
            </div>

            {/* ÇALIŞTIR */}
            <div style={{padding:'14px 18px',borderTop:'1px solid rgba(0,0,0,0.07)',flexShrink:0}}>
              <button className="run-btn" onClick={formatla} disabled={loading || !makale.trim()}>
                {loading
                  ? <><span style={{width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.4)',borderTop:'2px solid #fff',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/> Formatlanıyor...</>
                  : `✨ ${ozelDergi || hedefDergi} Formatına Çevir`
                }
              </button>
            </div>
          </div>

          {/* SAĞ — SONUÇ */}
          <div style={{display:'flex',flexDirection:'column',overflow:'hidden',background:'#f8f9fa'}}>

            {/* Sağ header */}
            <div style={{padding:'12px 20px',borderBottom:'1px solid rgba(0,0,0,0.07)',background:'#fff',display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',flex:1}}>
                {sonuc ? `Sonuç — ${ozelDergi || hedefDergi}` : 'Sonuç'}
              </div>
              {sonuc && (
                <>
                  <button className="toolbar-btn primary" onClick={() => { navigator.clipboard.writeText(sonuc); setCopied(true); setTimeout(()=>setCopied(false),2000) }}>
                    {copied ? '✓ Kopyalandı' : 'Kopyala'}
                  </button>
                  <button className="toolbar-btn" onClick={() => router.push('/dergi')}>Dergiye Gönder →</button>
                  <button className="toolbar-btn" onClick={() => router.push('/intihal')}>İntihal Kontrol →</button>
                </>
              )}
            </div>

            {/* Sonuç içeriği */}
            <div style={{flex:1,overflowY:'auto',padding:'0'}}>
              {!sonuc && !loading && (
                <div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px',padding:'40px',textAlign:'center'}}>
                  <div style={{fontSize:'48px',opacity:0.2}}>✨</div>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:500,color:'rgba(0,0,0,0.35)',marginBottom:'8px'}}>Henüz formatlama yapılmadı</div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.25)',lineHeight:1.6}}>Sol tarafa makalenizi yapıştırın,<br/>hedef dergiyi seçin ve butona basın.</div>
                  </div>
                </div>
              )}

              {loading && (
                <div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'20px'}}>
                  <span style={{width:'36px',height:'36px',border:'3px solid rgba(249,115,22,0.2)',borderTop:'3px solid #f97316',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontSize:'14px',fontWeight:600,color:'#0a0a0a',marginBottom:'6px'}}>Formatlanıyor...</div>
                    <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)'}}>{ozelDergi || hedefDergi} kuralları uygulanıyor</div>
                  </div>
                </div>
              )}

              {sonuc && !loading && (
                <div style={{animation:'fadeIn 0.4s ease'}}>
                  {/* Formatlanmış makale */}
                  <div style={{padding:'24px 28px',background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
                    <div style={{whiteSpace:'pre-wrap',fontSize:'13px',lineHeight:1.9,color:'#0a0a0a',fontFamily:'Georgia,serif'}}>
                      {sonuc}
                    </div>
                  </div>

                  {/* Notlar */}
                  {notlar && (
                    <div style={{padding:'18px 24px',borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'12px',fontWeight:700,color:'#0a0a0a',marginBottom:'10px'}}>
                        📋 {ozelDergi || hedefDergi} — Kritik Kurallar
                      </div>
                      <div style={{fontSize:'12px',color:'rgba(0,0,0,0.6)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{notlar}</div>
                    </div>
                  )}

                  {/* Değişiklikler */}
                  {degisiklikler.length > 0 && (
                    <div style={{padding:'18px 24px'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'12px',fontWeight:700,color:'#0a0a0a',marginBottom:'10px'}}>
                        ✅ Yapılan Değişiklikler
                      </div>
                      {degisiklikler.map((d,i) => (
                        <div key={i} style={{display:'flex',gap:'8px',padding:'5px 0',borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
                          <span style={{color:'#f97316',fontWeight:700,flexShrink:0}}>✓</span>
                          <span style={{fontSize:'12px',color:'rgba(0,0,0,0.55)',lineHeight:1.5}}>{d.replace(/^[-•\d.]\s*/,'')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
