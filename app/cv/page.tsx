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

export default function CV() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [format, setFormat] = useState('akademik')
  const [dil, setDil] = useState('TR')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(true)

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

  const regenerate = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1800)
  }

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#00c48c; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
        .opt-btn { padding:7px 14px; border:1.5px solid rgba(0,0,0,0.08); font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; background:transparent; color:rgba(0,0,0,0.45); cursor:pointer; transition:all 0.2s; }
        .opt-btn:hover { border-color:rgba(0,196,140,0.4); color:#00c48c; }
        .opt-btn.active { border-color:#00c48c; background:rgba(0,196,140,0.08); color:#00c48c; }
        .tool-btn { padding:8px 16px; border:1px solid rgba(0,0,0,0.1); font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; background:transparent; color:rgba(0,0,0,0.5); cursor:pointer; transition:all 0.2s; }
        .tool-btn:hover { border-color:#0a0a0a; color:#0a0a0a; }
        .tool-btn.primary { background:#00c48c; color:#0a0a0a; border-color:#00c48c; }
        .tool-btn.primary:hover { background:#00a87a; color:#fff; }
        .cv-sec-title { font-size:11px; font-weight:700; color:#00c48c; text-transform:uppercase; letter-spacing:1.5px; border-bottom:2px solid #00c48c; padding-bottom:4px; margin-bottom:12px; }
        .cv-item-name { font-size:13px; font-weight:700; color:#0a0a0a; }
        .cv-item-date { font-size:11px; color:rgba(0,0,0,0.35); }
        .cv-item-sub { font-size:12px; color:rgba(0,0,0,0.55); margin-top:2px; }
        .cv-item-desc { font-size:11px; color:rgba(0,0,0,0.45); margin-top:4px; line-height:1.5; }
        .cv-pub { font-size:12px; color:rgba(0,0,0,0.7); line-height:1.6; padding:8px 0; border-bottom:1px solid rgba(0,0,0,0.05); }
        .cv-pub:last-child { border-bottom:none; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
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
                const isActive = '/cv' === item.href
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
          <div style={{background:'linear-gradient(90deg,#fbbf24 0%,#fbbf2488 50%,#fbbf2415 100%)',padding:'14px 28px',display:'flex',alignItems:'center',gap:'20px',flexShrink:0,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a'}}>📄 CV Üretici</div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.5)',marginTop:'3px'}}>YZ ile akademik CV oluşturun ve indirin</div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'6px',fontFamily:"'Pixelify Sans',monospace",fontSize:'11px',color:'#0a0a0a',fontWeight:700}}>
              <span style={{width:'6px',height:'6px',background:loading?'#f59e0b':'#00c48c',borderRadius:'50%'}}/>
              {loading?'Üretiliyor...':'Hazır'}
            </div>
          </div>

          <div style={{flex:1,overflow:'hidden',display:'grid',gridTemplateColumns:'260px 1fr',minHeight:0}}>

            {/* SOL — AYARLAR */}
            <div style={{borderRight:'1px solid rgba(0,0,0,0.07)',background:'#fff',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{flex:1,overflowY:'auto',padding:'18px'}}>

                {/* CV YÜKLE */}
                <div style={{marginBottom:'20px'}}>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>CV Yükle</div>
                  <label style={{display:'block',border:'2px dashed rgba(0,196,140,0.3)',padding:'20px',textAlign:'center',cursor:'pointer',transition:'all 0.2s',background:'rgba(0,196,140,0.02)'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor='#00c48c'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(0,196,140,0.3)'}>
                    <div style={{fontSize:'24px',marginBottom:'6px'}}>📎</div>
                    <div style={{fontSize:'12px',fontWeight:600,color:'#0a0a0a',marginBottom:'3px'}}>PDF veya Word yükle</div>
                    <div style={{fontSize:'10px',color:'rgba(0,0,0,0.35)'}}>veya profil verisini kullan</div>
                    <input type="file" accept=".pdf,.doc,.docx" style={{display:'none'}}/>
                  </label>
                  <button style={{width:'100%',marginTop:'6px',padding:'8px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',fontSize:'12px',fontWeight:600,fontFamily:'DM Sans,sans-serif',cursor:'pointer',color:'rgba(0,0,0,0.6)',transition:'all 0.2s'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#e8ebe9'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='#f2f2f0'}>
                    TAİS Profilinden Oluştur
                  </button>
                </div>

                {/* FORMAT */}
                <div style={{marginBottom:'20px'}}>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>CV Formatı</div>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    {[
                      {key:'akademik',label:'Akademik',desc:'Yayınlar, projeler, atıflar'},
                      {key:'endustri',label:'Endüstri',desc:'Beceriler, deneyim, başarılar'},
                      {key:'avrupa',label:'Europass',desc:'AB standart formatı'},
                    ].map(f => (
                      <div key={f.key} onClick={() => setFormat(f.key)} style={{padding:'10px 12px',border:`1.5px solid ${format===f.key?'#00c48c':'rgba(0,0,0,0.07)'}`,background:format===f.key?'rgba(0,196,140,0.04)':'transparent',cursor:'pointer',transition:'all 0.2s'}}>
                        <div style={{fontSize:'12px',fontWeight:600,color:'#0a0a0a'}}>{f.label}</div>
                        <div style={{fontSize:'10px',color:'rgba(0,0,0,0.4)',marginTop:'2px'}}>{f.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DİL */}
                <div style={{marginBottom:'20px'}}>
                  <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>Çıktı Dili</div>
                  <div style={{display:'flex',gap:'6px'}}>
                    {['TR','EN','DE'].map(d => (
                      <button key={d} className={`opt-btn${dil===d?' active':''}`} onClick={() => setDil(d)} style={{flex:1}}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ÜRet */}
              <div style={{padding:'14px 18px',borderTop:'1px solid rgba(0,0,0,0.07)',flexShrink:0}}>
                <button onClick={regenerate} disabled={loading} style={{width:'100%',background:'#00c48c',color:'#0a0a0a',border:'none',padding:'12px',fontSize:'13px',fontWeight:700,fontFamily:'DM Sans,sans-serif',cursor:'pointer',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                  {loading
                    ? <><span style={{width:'14px',height:'14px',border:'2px solid #0a0a0a',borderTop:'2px solid transparent',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/> Üretiliyor...</>
                    : '🤖 YZ ile Yeniden Üret'
                  }
                </button>
              </div>
            </div>

            {/* SAĞ — CV ÖNIZLEME */}
            <div style={{background:'#e8ebe9',overflow:'hidden',display:'flex',flexDirection:'column'}}>

              {/* TOOLBAR */}
              <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'10px 20px',display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
                <div style={{fontSize:'12px',color:'rgba(0,0,0,0.45)',flex:1}}>
                  CV — <strong style={{color:'#0a0a0a'}}>{format==='akademik'?'Akademik':format==='endustri'?'Endüstri':'Europass'} Format</strong> · {dil}
                </div>
                <button className="tool-btn" onClick={regenerate}>↻ Yenile</button>
                <button className="tool-btn" onClick={() => setDil(dil==='TR'?'EN':'TR')}>🌐 {dil==='TR'?'EN\'e Çevir':'TR\'ye Çevir'}</button>
                <button className="tool-btn primary">⬇ PDF İndir</button>
              </div>

              {/* CV DOKÜMANI */}
              <div style={{flex:1,overflowY:'auto',padding:'28px',display:'flex',justifyContent:'center',alignItems:'flex-start'}}>
                {loading ? (
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:'16px'}}>
                    <span style={{width:'32px',height:'32px',border:'3px solid rgba(0,196,140,0.2)',borderTop:'3px solid #00c48c',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/>
                    <div style={{fontSize:'13px',color:'rgba(0,0,0,0.4)'}}>YZ CV hazırlıyor...</div>
                  </div>
                ) : (
                  <div style={{background:'#fff',width:'100%',maxWidth:'680px',padding:'48px',boxShadow:'0 4px 32px rgba(0,0,0,0.1)',animation:'fadeIn 0.4s ease',fontFamily:'Georgia,serif',minHeight:'100%'}}>

                    {/* CV BAŞLIK */}
                    <div style={{borderBottom:'3px solid #0a0a0a',paddingBottom:'16px',marginBottom:'20px'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'26px',fontWeight:700,color:'#0a0a0a',letterSpacing:'-0.5px'}}>Dr. Ayşe Yılmaz</div>
                      <div style={{fontSize:'13px',color:'rgba(0,0,0,0.55)',marginTop:'4px',fontFamily:'DM Sans,sans-serif'}}>Doçent Doktor · Biyomedikal Mühendislik</div>
                      <div style={{display:'flex',gap:'16px',marginTop:'8px',fontSize:'11px',color:'rgba(0,0,0,0.4)',fontFamily:'DM Sans,sans-serif',flexWrap:'wrap'}}>
                        <span>📧 ayse.yilmaz@itu.edu.tr</span>
                        <span>🏛 İstanbul Teknik Üniversitesi</span>
                        <span>🌐 scholar.google.com/ay</span>
                        <span>📍 İstanbul, Türkiye</span>
                      </div>
                    </div>

                    {/* EĞİTİM */}
                    <div style={{marginBottom:'20px'}}>
                      <div className="cv-sec-title">Eğitim</div>
                      {[
                        {derece:'Doktora, Biyomedikal Mühendislik',okul:'İstanbul Teknik Üniversitesi',tarih:'2018 — 2023',detay:'Tez: "Derin Öğrenme Tabanlı Erken Kanser Tespiti için Çok Modlu Görüntüleme Sistemleri"'},
                        {derece:'Yüksek Lisans, Bilgisayar Mühendisliği',okul:'Orta Doğu Teknik Üniversitesi',tarih:'2016 — 2018',detay:''},
                        {derece:'Lisans, Biyomedikal Mühendislik',okul:'Hacettepe Üniversitesi',tarih:'2012 — 2016',detay:'Bölüm birincisi'},
                      ].map((e,i) => (
                        <div key={i} style={{marginBottom:'12px',paddingBottom:'12px',borderBottom:i<2?'1px solid rgba(0,0,0,0.05)':'none'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                            <span className="cv-item-name">{e.derece}</span>
                            <span className="cv-item-date">{e.tarih}</span>
                          </div>
                          <div className="cv-item-sub">{e.okul}</div>
                          {e.detay && <div className="cv-item-desc">{e.detay}</div>}
                        </div>
                      ))}
                    </div>

                    {/* POZİSYONLAR */}
                    <div style={{marginBottom:'20px'}}>
                      <div className="cv-sec-title">Akademik Pozisyonlar</div>
                      {[
                        {unvan:'Doçent Doktor',bolum:'Biyomedikal Mühendislik Bölümü',kurum:'İstanbul Teknik Üniversitesi',tarih:'2023 — Günümüz',detay:'YZ destekli tıbbi görüntüleme ve federated learning araştırmaları.'},
                        {unvan:'Araştırma Görevlisi',bolum:'Bilgisayar Mühendisliği',kurum:'Orta Doğu Teknik Üniversitesi',tarih:'2018 — 2023',detay:''},
                      ].map((p,i) => (
                        <div key={i} style={{marginBottom:'12px',paddingBottom:'12px',borderBottom:i<1?'1px solid rgba(0,0,0,0.05)':'none'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                            <span className="cv-item-name">{p.unvan}</span>
                            <span className="cv-item-date">{p.tarih}</span>
                          </div>
                          <div className="cv-item-sub">{p.bolum} · {p.kurum}</div>
                          {p.detay && <div className="cv-item-desc">{p.detay}</div>}
                        </div>
                      ))}
                    </div>

                    {/* YAYINLAR */}
                    <div style={{marginBottom:'20px'}}>
                      <div className="cv-sec-title">Seçili Yayınlar</div>
                      <div className="cv-pub"><strong>Yılmaz, A.</strong>, Demir, M. et al. (2024). "Deep Learning-Based Early Detection of Pancreatic Cancer." <em>Nature Medicine</em>, 28(4). <span style={{color:'#00c48c',fontWeight:700}}>↗ 47 atıf · IF: 58.7</span></div>
                      <div className="cv-pub"><strong>Yılmaz, A.</strong>, Kaya, A. (2023). "Federated Learning for Privacy-Preserving Healthcare Analytics." <em>Computers in Biology</em>, 42(1). <span style={{color:'#00c48c',fontWeight:700}}>↗ 89 atıf · IF: 7.7</span></div>
                      <div className="cv-pub"><strong>Yılmaz, A.</strong> (2024). "Transformer-Based Architecture for Medical Image Segmentation." <em>AI in Medicine</em>, 15(2). <span style={{color:'#00c48c',fontWeight:700}}>↗ 31 atıf · IF: 7.0</span></div>
                    </div>

                    {/* PROJELER */}
                    <div style={{marginBottom:'20px'}}>
                      <div className="cv-sec-title">Araştırma Projeleri</div>
                      {[
                        {ad:'Kanser Erken Tespit Sistemi',tur:'TÜBİTAK 1001',tarih:'2024 — 2026',butce:'850.000 TL',rol:'Yürütücü'},
                        {ad:'Federated Learning Altyapısı',tur:'İş Birliği Projesi',tarih:'2025 — 2025',butce:'Ortak Kaynak',rol:'Yürütücü'},
                      ].map((p,i) => (
                        <div key={i} style={{marginBottom:'10px',paddingBottom:'10px',borderBottom:i<1?'1px solid rgba(0,0,0,0.05)':'none'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                            <span className="cv-item-name">{p.ad}</span>
                            <span className="cv-item-date">{p.tarih}</span>
                          </div>
                          <div className="cv-item-sub">{p.tur} · {p.butce} · <em>{p.rol}</em></div>
                        </div>
                      ))}
                    </div>

                    {/* UZMANLLIK */}
                    <div>
                      <div className="cv-sec-title">Uzmanlık Alanları</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:'6px',fontFamily:'DM Sans,sans-serif'}}>
                        {['Yapay Zeka','Derin Öğrenme','Tıbbi Görüntüleme','Federated Learning','Computer Vision','NLP','PyTorch','Python','CUDA','Biyoinformatik'].map((t,i) => (
                          <span key={i} style={{fontSize:'11px',padding:'3px 10px',border:'1px solid rgba(0,0,0,0.15)',color:'rgba(0,0,0,0.6)'}}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
