'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const MODLAR = [
  { key:'abstract', label:'Abstract Yaz', icon:'📄', desc:'Makalenizden akademik abstract oluşturun', color:'#00c48c', tip:'Makale özetinizi veya ana noktaları girin' },
  { key:'coverletter', label:'Cover Letter', icon:'✉️', desc:'Dergi editörü için profesyonel mektup', color:'#3b82f6', tip:'Makale başlığı, yazarlar ve dergiye göndermek istediğiniz bilgileri girin' },
  { key:'ceviri', label:'Çeviri', icon:'🌐', desc:'TR ↔ EN akademik çeviri', color:'#06b6d4', tip:'Çevirmek istediğiniz akademik metni girin' },
  { key:'duzeltme', label:'Düzeltme', icon:'✏️', desc:'Dilbilgisi ve üslup iyileştirme', color:'#f59e0b', tip:'Düzeltilmesini istediğiniz metni girin' },
  { key:'ozet', label:'Özetle', icon:'📋', desc:'Uzun metni kısa ve öz hale getir', color:'#f43f5e', tip:'Özetlemek istediğiniz makale veya bölümü girin' },
]

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

export default function YaziAsistan() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [aktifMod, setAktifMod] = useState(0)
  const [metin, setMetin] = useState('')
  const [sonuc, setSonuc] = useState('')
  const [loading, setLoading] = useState(false)
  const [hedefDil, setHedefDil] = useState('İngilizce')
  const [copied, setCopied] = useState(false)
  const [gecmis, setGecmis] = useState<{mod:string,sonuc:string,tarih:string}[]>([])

  const mod = MODLAR[aktifMod]

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

  const calistir = async () => {
    if (!metin.trim() || loading) return
    setLoading(true); setSonuc('')
    try {
      const res = await fetch('/api/yazi-asistan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mod: mod.key, metin, dil: 'Türkçe', hedefDil, stil: 'Akademik' }),
      })
      const data = await res.json()
      if (data.sonuc) {
        setSonuc(data.sonuc)
        setGecmis(p => [{ mod: mod.label, sonuc: data.sonuc, tarih: new Date().toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'}) }, ...p.slice(0,4)])
      } else {
        setSonuc('Hata: ' + (data.error || 'Bilinmeyen hata'))
      }
    } catch {
      setSonuc('Bağlantı hatası.')
    }
    setLoading(false)
  }

  const kopyala = () => {
    navigator.clipboard.writeText(sonuc)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#00c48c; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
        .mod-btn { display:flex; flex-direction:column; align-items:center; gap:6px; padding:14px 10px; border:1.5px solid rgba(0,0,0,0.07); background:#fff; cursor:pointer; transition:all 0.2s; text-align:center; flex:1; }
        .mod-btn:hover { border-color:rgba(0,196,140,0.3); background:#fafffd; }
        .mod-btn.active { border-color:var(--active-color,#00c48c); background:var(--active-bg,rgba(0,196,140,0.06)); }
        .field-textarea { width:100%; border:1.5px solid rgba(0,0,0,0.07); padding:14px; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; resize:none; background:#fff; line-height:1.7; transition:border 0.2s; color:#0a0a0a; }
        .field-textarea:focus { border-color:#00c48c; }
        .run-btn { width:100%; background:#00c48c; color:#0a0a0a; border:none; padding:14px; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .run-btn:hover { background:#00a87a; color:#fff; }
        .run-btn:disabled { background:#ccc; cursor:not-allowed; }
        .copy-btn { background:#0a0a0a; color:#fff; border:none; padding:8px 16px; font-size:11px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .copy-btn:hover { background:#00c48c; color:#0a0a0a; }
        .copy-btn.copied { background:rgba(0,196,140,0.1); color:#00c48c; border:1px solid rgba(0,196,140,0.2); }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes typing { 0%,100%{opacity:1} 50%{opacity:0} }
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
                const isActive = '/yazi' === item.href
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
          <div style={{background:`linear-gradient(90deg,${mod.color} 0%,${mod.color}88 50%,${mod.color}20 100%)`,padding:'14px 28px',display:'flex',alignItems:'center',gap:'16px',flexShrink:0,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a'}}>
                {mod.icon} Yazı Asistanı — {mod.label}
              </div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.5)',marginTop:'3px'}}>{mod.desc}</div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'6px',fontFamily:"'Pixelify Sans',monospace",fontSize:'11px',color:'#0a0a0a',fontWeight:700}}>
              <span style={{width:'6px',height:'6px',background:loading?'#f59e0b':'#0a0a0a',borderRadius:'50%',animation:loading?'typing 1s infinite':''}}/>
              {loading ? 'Yazıyor...' : 'Hazır'}
            </div>
          </div>

          <div style={{flex:1,overflow:'hidden',display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:0}}>

            {/* SOL — GİRİŞ */}
            <div style={{display:'flex',flexDirection:'column',overflow:'hidden',borderRight:'1px solid rgba(0,0,0,0.07)'}}>

              {/* MOD SEÇİCİ */}
              <div style={{padding:'12px 16px',background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',flexShrink:0}}>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.35)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Mod Seç</div>
                <div style={{display:'flex',gap:'6px'}}>
                  {MODLAR.map((m, i) => (
                    <button key={m.key} className={`mod-btn${aktifMod===i?' active':''}`}
                      style={{'--active-color':m.color,'--active-bg':m.color+'10'} as any}
                      onClick={() => { setAktifMod(i); setSonuc('') }}>
                      <span style={{fontSize:'18px'}}>{m.icon}</span>
                      <span style={{fontSize:'10px',fontWeight:600,color:aktifMod===i?m.color:'rgba(0,0,0,0.5)',whiteSpace:'nowrap'}}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ÇEVİRİ DİL SEÇİCİ */}
              {mod.key === 'ceviri' && (
                <div style={{padding:'10px 16px',background:'#f8fafc',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',gap:'10px',flexShrink:0}}>
                  <span style={{fontSize:'12px',color:'rgba(0,0,0,0.5)',fontWeight:500}}>Hedef Dil:</span>
                  {['İngilizce','Türkçe','Almanca','Fransızca'].map(d => (
                    <button key={d} onClick={() => setHedefDil(d)} style={{padding:'4px 12px',fontSize:'11px',fontWeight:600,border:`1.5px solid ${hedefDil===d?mod.color:'rgba(0,0,0,0.07)'}`,background:hedefDil===d?mod.color+'15':'transparent',color:hedefDil===d?mod.color:'rgba(0,0,0,0.4)',cursor:'pointer',fontFamily:'DM Sans,sans-serif',transition:'all 0.2s'}}>
                      {d}
                    </button>
                  ))}
                </div>
              )}

              {/* METİN GİRİŞİ */}
              <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',padding:'16px',gap:'12px'}}>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.35)',letterSpacing:'1px',textTransform:'uppercase'}}>
                  {mod.tip}
                </div>
                <textarea
                  className="field-textarea"
                  style={{flex:1}}
                  placeholder={mod.tip + '...'}
                  value={metin}
                  onChange={e => setMetin(e.target.value)}
                />
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'11px',color:'rgba(0,0,0,0.3)'}}>{metin.length} karakter</span>
                  <button onClick={() => setMetin('')} style={{fontSize:'11px',color:'rgba(0,0,0,0.3)',background:'none',border:'none',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>Temizle</button>
                </div>
                <button className="run-btn" onClick={calistir} disabled={loading || !metin.trim()}>
                  {loading ? (
                    <>
                      <span style={{width:'16px',height:'16px',border:'2px solid #0a0a0a',borderTop:'2px solid transparent',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/>
                      Yazıyor...
                    </>
                  ) : (
                    <>{mod.icon} {mod.label} Yap</>
                  )}
                </button>
              </div>
            </div>

            {/* SAĞ — ÇIKTI */}
            <div style={{display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{padding:'12px 16px',background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
                <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.35)',letterSpacing:'1px',textTransform:'uppercase',flex:1}}>Sonuç</div>
                {sonuc && (
                  <>
                    <button className={`copy-btn${copied?' copied':''}`} onClick={kopyala}>
                      {copied ? '✓ Kopyalandı' : 'Kopyala'}
                    </button>
                    <button onClick={() => setSonuc('')} style={{fontSize:'11px',color:'rgba(0,0,0,0.3)',background:'none',border:'none',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>Temizle</button>
                  </>
                )}
              </div>

              <div style={{flex:1,overflowY:'auto',padding:'16px'}}>
                {loading ? (
                  <div style={{display:'flex',flexDirection:'column',gap:'8px',animation:'fadeIn 0.3s ease'}}>
                    <div style={{padding:'14px',background:'#fff',border:'1px solid rgba(0,0,0,0.07)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                        <div style={{width:'28px',height:'28px',background:'#0a0a0a',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#00c48c',fontFamily:"'Pixelify Sans',monospace"}}>YZ</div>
                        <span style={{fontSize:'12px',color:'rgba(0,0,0,0.4)'}}>TAİS Yazı Asistanı</span>
                      </div>
                      <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                        {[0,1,2].map(i => (
                          <span key={i} style={{width:'8px',height:'8px',background:'rgba(0,0,0,0.2)',borderRadius:'50%',display:'inline-block',animation:`typing 1.2s infinite ${i*0.2}s`}}/>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : sonuc ? (
                  <div style={{animation:'fadeIn 0.4s ease'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
                      <div style={{width:'28px',height:'28px',background:'#0a0a0a',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#00c48c',fontFamily:"'Pixelify Sans',monospace"}}>YZ</div>
                      <span style={{fontSize:'12px',color:'rgba(0,0,0,0.4)'}}>TAİS Yazı Asistanı · {mod.label}</span>
                      <span style={{width:'6px',height:'6px',background:'#00c48c',borderRadius:'50%',flexShrink:0}}/>
                    </div>
                    <div style={{padding:'16px',background:'#fff',border:'1px solid rgba(0,0,0,0.07)',fontSize:'13px',lineHeight:1.8,color:'#0a0a0a',fontWeight:300,whiteSpace:'pre-wrap'}}>
                      {sonuc}
                    </div>
                  </div>
                ) : (
                  <div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'12px',color:'rgba(0,0,0,0.25)'}}>
                    <span style={{fontSize:'40px'}}>{mod.icon}</span>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:'14px',fontWeight:500,color:'rgba(0,0,0,0.4)'}}>Sonuç burada görünecek</div>
                      <div style={{fontSize:'12px',marginTop:'4px'}}>Sol tarafa metninizi girin, çalıştır butonuna basın</div>
                    </div>
                  </div>
                )}

                {/* GEÇMİŞ */}
                {gecmis.length > 0 && !sonuc && !loading && (
                  <div style={{marginTop:'16px'}}>
                    <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.35)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'8px'}}>Son İşlemler</div>
                    {gecmis.map((g,i) => (
                      <div key={i} onClick={() => setSonuc(g.sonuc)} style={{padding:'10px 12px',background:'#fff',border:'1px solid rgba(0,0,0,0.07)',marginBottom:'6px',cursor:'pointer',transition:'all 0.2s'}}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor='rgba(0,196,140,0.3)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor='rgba(0,0,0,0.07)'}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                          <span style={{fontSize:'11px',fontWeight:600,color:'#0a0a0a'}}>{g.mod}</span>
                          <span style={{fontSize:'10px',color:'rgba(0,0,0,0.3)'}}>{g.tarih}</span>
                        </div>
                        <div style={{fontSize:'11px',color:'rgba(0,0,0,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{g.sonuc.slice(0,80)}...</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
