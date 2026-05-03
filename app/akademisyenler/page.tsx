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

const akademisyenler = [
  { id:1, av:'KY', color:'#0ea5e9', name:'Prof. Dr. Kemal Yıldız', unvan:'Profesör Doktor', kurum:'İTÜ', bolum:'Yapay Zeka Lab', sehir:'İstanbul', uyum:96, hindex:24, yayın:55, atif:1240, online:true, tags:['YZ','Derin Öğrenme','NLP'], bio:'Türkiye\'nin önde gelen YZ araştırmacılarından. Federated learning ve gizlilik koruma üzerine çalışıyor.' },
  { id:2, av:'NŞ', color:'#ec4899', name:'Doç. Dr. Neslihan Şahin', unvan:'Doçent Doktor', kurum:'Hacettepe', bolum:'Onkoloji', sehir:'Ankara', uyum:93, hindex:18, yayın:38, atif:892, online:false, tags:['Onkoloji','Biyomedikal','Genomik'], bio:'Kanser erken tespiti ve genomik veri analizi alanında uzman. Nature Medicine\'da 12 yayını var.' },
  { id:3, av:'OA', color:'#10b981', name:'Dr. Okan Aydın', unvan:'Doktor Öğretim Üyesi', kurum:'ODTÜ', bolum:'Biyoinformatik', sehir:'Ankara', uyum:89, hindex:14, yayın:22, atif:534, online:false, tags:['Biyoinformatik','Python','ML'], bio:'Biyoinformatik ve makine öğrenimi kesişiminde çalışıyor. 3 ortak yayın potansiyeli var.' },
  { id:4, av:'ZK', color:'#f59e0b', name:'Prof. Dr. Zeynep Kara', unvan:'Profesör Doktor', kurum:'Ege Üniversitesi', bolum:'Nöroloji', sehir:'İzmir', uyum:85, hindex:21, yayın:41, atif:980, online:true, tags:['Nöroloji','Sinyal İşleme','EEG'], bio:'Nörolojik hastalıkların erken tespiti için makine öğrenimi modelleri geliştiriyor.' },
  { id:5, av:'BK', color:'#8b5cf6', name:'Doç. Dr. Baran Kurt', unvan:'Doçent Doktor', kurum:'Bilkent', bolum:'Robotik', sehir:'Ankara', uyum:83, hindex:16, yayın:28, atif:620, online:true, tags:['Robotik','Computer Vision','ROS'], bio:'Cerrahi robotik ve görüntü işleme konularında çalışıyor.' },
  { id:6, av:'EA', color:'#06b6d4', name:'Dr. Ece Arslan', unvan:'Doktor Öğretim Üyesi', kurum:'Bilkent', bolum:'Makine Öğrenimi', sehir:'Ankara', uyum:79, hindex:11, yayın:19, atif:342, online:false, tags:['ML','Transfer Learning','PyTorch'], bio:'Transfer learning ve az örnekli öğrenme konularında araştırma yapıyor.' },
  { id:7, av:'CK', color:'#ef4444', name:'Dr. Can Kara', unvan:'Doktor Öğretim Üyesi', kurum:'ODTÜ', bolum:'Veri Bilimi', sehir:'Ankara', uyum:74, hindex:9, yayın:15, atif:210, online:true, tags:['Veri Bilimi','R','İstatistik'], bio:'Büyük veri analizi ve istatistiksel öğrenme üzerine çalışıyor.' },
  { id:8, av:'SA', color:'#3b82f6', name:'Doç. Dr. Selin Arslan', unvan:'Doçent Doktor', kurum:'Hacettepe', bolum:'Tıp Bilişimi', sehir:'Ankara', uyum:71, hindex:13, yayın:24, atif:445, online:false, tags:['Tıp Bilişimi','EHR','FHIR'], bio:'Elektronik sağlık kayıtları ve klinik karar destek sistemleri üzerine uzman.' },
]

export default function AlanUyumluAkademisyenler() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [searchQ, setSearchQ] = useState('')
  const [siralama, setSiralama] = useState('uyum')
  const [baglilar, setBaglilar] = useState<number[]>([])
  const [secili, setSecili] = useState<typeof akademisyenler[0] | null>(null)

  const skorRenk = (s: number) => s >= 75 ? '#00c48c' : s >= 45 ? '#f59e0b' : '#ef4444'

  const filtered = akademisyenler
    .filter(a => !searchQ || a.name.toLowerCase().includes(searchQ.toLowerCase()) || a.kurum.toLowerCase().includes(searchQ.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(searchQ.toLowerCase())))
    .sort((a, b) => {
      if (siralama === 'uyum') return b.uyum - a.uyum
      if (siralama === 'hindex') return b.hindex - a.hindex
      if (siralama === 'yayin') return b.yayın - a.yayın
      return b.atif - a.atif
    })

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

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
        body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; color:rgba(255,255,255,0.55); transition:all 0.2s; border-left:2px solid transparent; cursor:pointer; }
        .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
        .nav-item.active { color:#00c48c; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
        .kart { background:#fff; border:1px solid rgba(0,0,0,0.07); padding:18px; cursor:pointer; transition:all 0.2s; }
        .kart:hover { border-color:rgba(0,196,140,0.3); box-shadow:0 3px 16px rgba(0,0,0,0.06); }
        .kart.secili { border-color:#00c48c; box-shadow:0 0 0 2px rgba(0,196,140,0.15); }
        .tag { font-size:10px; padding:3px 8px; background:rgba(0,0,0,0.05); color:rgba(0,0,0,0.5); }
        .btn-g { background:#00c48c; color:#0a0a0a; border:none; padding:8px 18px; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-g:hover { background:#00a87a; color:#fff; }
        .btn-g.bagli { background:rgba(0,196,140,0.1); color:#00c48c; border:1px solid rgba(0,196,140,0.2); }
        .btn-o { background:transparent; color:rgba(0,0,0,0.5); border:1px solid rgba(0,0,0,0.1); padding:8px 14px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .btn-o:hover { border-color:#0a0a0a; color:#0a0a0a; }
        .sort-btn { padding:6px 14px; font-size:11px; font-weight:600; border:1.5px solid rgba(0,0,0,0.07); color:rgba(0,0,0,0.45); background:transparent; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .sort-btn:hover { border-color:rgba(0,196,140,0.4); color:#00c48c; }
        .sort-btn.active { border-color:#00c48c; background:rgba(0,196,140,0.08); color:#00c48c; }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
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
                const isActive = false
                return (
                  <div key={i} onClick={() => router.push(item.href)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 18px',fontSize:'13px',color:'rgba(255,255,255,0.55)',borderLeft:'2px solid transparent',background:'transparent',cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.color='#fff';el.style.background='rgba(255,255,255,0.05)'}}
                    onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.color='rgba(255,255,255,0.55)';el.style.background='transparent'}}>
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
          <div style={{background:'linear-gradient(90deg,#00c48c 0%,#00c48c88 50%,#00c48c15 100%)',padding:'14px 28px',display:'flex',alignItems:'center',gap:'16px',flexShrink:0,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <button onClick={() => router.back()} style={{background:'rgba(0,0,0,0.1)',border:'none',padding:'6px 12px',fontSize:'12px',fontWeight:600,cursor:'pointer',color:'#0a0a0a',fontFamily:'DM Sans,sans-serif',display:'flex',alignItems:'center',gap:'4px'}}>
              ← Geri
            </button>
            <div>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:'#0a0a0a'}}>🎯 Alan Uyumlu Akademisyenler</div>
              <div style={{fontSize:'11px',color:'rgba(0,0,0,0.5)',marginTop:'3px'}}>YZ profilinize göre sıralandı — {filtered.length} akademisyen bulundu</div>
            </div>
          </div>

          {/* ARAMA + SIRALAMA */}
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'10px 28px',display:'flex',gap:'10px',alignItems:'center',flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',padding:'8px 14px',flex:1,maxWidth:'360px'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="İsim, kurum veya alan ara..." style={{border:'none',outline:'none',background:'transparent',fontSize:'12px',fontFamily:'DM Sans,sans-serif',width:'100%',color:'#0a0a0a'}}/>
            </div>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
              <span style={{fontSize:'11px',color:'rgba(0,0,0,0.4)',fontWeight:500}}>Sırala:</span>
              {[
                {key:'uyum',label:'Uyum'},
                {key:'hindex',label:'H-index'},
                {key:'yayin',label:'Yayın'},
                {key:'atif',label:'Atıf'},
              ].map(s => (
                <button key={s.key} className={`sort-btn${siralama===s.key?' active':''}`} onClick={() => setSiralama(s.key)}>{s.label}</button>
              ))}
            </div>
          </div>

          {/* İÇERİK */}
          <div style={{flex:1,overflow:'hidden',display:'grid',gridTemplateColumns:secili?'1fr 360px':'1fr',transition:'all 0.3s'}}>

            {/* AKADEMİSYEN LİSTESİ */}
            <div style={{overflowY:'auto',padding:'16px 28px',display:'flex',flexDirection:'column',gap:'10px'}}>
              {filtered.map((a,i) => (
                <div key={a.id} className={`kart${secili?.id===a.id?' secili':''}`} onClick={() => setSecili(secili?.id===a.id?null:a)}
                  style={{animation:`fadeIn 0.3s ease ${i*0.05}s both`}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:'16px'}}>

                    {/* AVATAR */}
                    <div style={{position:'relative',flexShrink:0}}>
                      <div style={{width:'52px',height:'52px',borderRadius:'50%',background:`radial-gradient(circle at 30% 30%,${a.color}dd,${a.color}88)`,border:`3px solid ${a.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'15px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace"}}>
                        {a.av}
                      </div>
                      {a.online && <div style={{position:'absolute',bottom:'2px',right:'2px',width:'12px',height:'12px',background:'#00c48c',borderRadius:'50%',border:'2px solid #fff'}}/>}
                    </div>

                    {/* BİLGİ */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
                        <div style={{fontSize:'15px',fontWeight:700,color:'#0a0a0a'}}>{a.name}</div>
                        {a.online && <span style={{fontSize:'10px',color:'#00c48c',fontWeight:600}}>● Çevrimiçi</span>}
                      </div>
                      <div style={{fontSize:'12px',color:'rgba(0,0,0,0.45)',marginBottom:'6px'}}>{a.unvan} · {a.kurum} · {a.bolum}</div>
                      <div style={{fontSize:'12px',color:'rgba(0,0,0,0.55)',lineHeight:1.5,marginBottom:'8px'}}>{a.bio}</div>
                      <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'10px'}}>
                        {a.tags.map((t,j) => <span key={j} className="tag">{t}</span>)}
                      </div>

                      {/* METRİKLER */}
                      <div style={{display:'flex',gap:'16px',marginBottom:'12px'}}>
                        {[
                          {l:'H-index',v:a.hindex,c:'#3b82f6'},
                          {l:'Yayın',v:a.yayın,c:'#0a0a0a'},
                          {l:'Atıf',v:a.atif.toLocaleString('tr-TR'),c:'#00c48c'},
                        ].map((m,j) => (
                          <div key={j} style={{textAlign:'center',padding:'6px 12px',background:'#f8fafc',border:'1px solid rgba(0,0,0,0.06)'}}>
                            <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'15px',fontWeight:700,color:m.c}}>{m.v}</div>
                            <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',textTransform:'uppercase',letterSpacing:'0.5px'}}>{m.l}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{display:'flex',gap:'6px'}}>
                        <button className={`btn-g${baglilar.includes(a.id)?' bagli':''}`} onClick={e => { e.stopPropagation(); setBaglilar(p => p.includes(a.id)?p:[ ...p,a.id]) }}>
                          {baglilar.includes(a.id) ? '✓ Bağlandı' : '+ Bağlan'}
                        </button>
                        <button className="btn-o" onClick={e => { e.stopPropagation(); router.push('/mesajlar') }}>Mesaj</button>
                        <button className="btn-o" onClick={e => { e.stopPropagation(); router.push('/isbirligi') }}>İş Birliği</button>
                      </div>
                    </div>

                    {/* UYUM SKORU */}
                    <div style={{flexShrink:0,textAlign:'center',padding:'16px 20px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'28px',fontWeight:700,color:skorRenk(a.uyum),lineHeight:1}}>%{a.uyum}</div>
                      <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',marginTop:'3px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Uyum</div>
                      <div style={{height:'4px',background:'rgba(0,0,0,0.06)',marginTop:'8px',overflow:'hidden',borderRadius:'2px'}}>
                        <div style={{height:'100%',width:`${a.uyum}%`,background:skorRenk(a.uyum),transition:'width 0.5s ease'}}/>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DETAY PANELİ */}
            {secili && (
              <div style={{borderLeft:'1px solid rgba(0,0,0,0.07)',background:'#fff',overflowY:'auto',animation:'slideIn 0.3s ease'}}>
                <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(0,0,0,0.07)',background:`linear-gradient(135deg,${secili.color}15,transparent)`,position:'sticky',top:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'13px',fontWeight:700}}>Profil Detayı</div>
                    <button onClick={() => setSecili(null)} style={{background:'none',border:'none',fontSize:'20px',color:'rgba(0,0,0,0.3)',cursor:'pointer'}}>×</button>
                  </div>
                </div>
                <div style={{padding:'20px'}}>
                  {/* Büyük avatar */}
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',marginBottom:'20px',padding:'20px',background:`linear-gradient(135deg,${secili.color}10,transparent)`,borderRadius:'4px'}}>
                    <div style={{width:'72px',height:'72px',borderRadius:'50%',background:`radial-gradient(circle at 30% 30%,${secili.color}dd,${secili.color}66)`,border:`4px solid ${secili.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",position:'relative'}}>
                      {secili.av}
                      {secili.online && <div style={{position:'absolute',bottom:'3px',right:'3px',width:'14px',height:'14px',background:'#00c48c',borderRadius:'50%',border:'2px solid #fff'}}/>}
                    </div>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'15px',fontWeight:700}}>{secili.name}</div>
                      <div style={{fontSize:'12px',color:'rgba(0,0,0,0.45)',marginTop:'2px'}}>{secili.unvan}</div>
                      <div style={{fontSize:'12px',color:secili.color,fontWeight:600,marginTop:'2px'}}>{secili.kurum} · {secili.bolum}</div>
                    </div>
                    <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'32px',fontWeight:700,color:skorRenk(secili.uyum)}}>%{secili.uyum} uyum</div>
                  </div>

                  {/* Metrikler */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'16px'}}>
                    {[{l:'H-index',v:secili.hindex,c:'#3b82f6'},{l:'Yayın',v:secili.yayın,c:'#0a0a0a'},{l:'Atıf',v:secili.atif,c:'#00c48c'}].map((m,i) => (
                      <div key={i} style={{textAlign:'center',padding:'10px',background:'#f8fafc',border:'1px solid rgba(0,0,0,0.06)'}}>
                        <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'18px',fontWeight:700,color:m.c}}>{m.v}</div>
                        <div style={{fontSize:'9px',color:'rgba(0,0,0,0.35)',textTransform:'uppercase'}}>{m.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Bio */}
                  <div style={{fontSize:'12px',color:'rgba(0,0,0,0.6)',lineHeight:1.7,marginBottom:'14px',padding:'12px',background:'#f8fafc',border:'1px solid rgba(0,0,0,0.05)'}}>
                    {secili.bio}
                  </div>

                  {/* Etiketler */}
                  <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'16px'}}>
                    {secili.tags.map((t,i) => <span key={i} style={{fontSize:'11px',padding:'4px 10px',border:`1.5px solid ${secili.color}44`,color:secili.color,background:`${secili.color}10`,fontWeight:500}}>{t}</span>)}
                  </div>

                  {/* Konum */}
                  <div style={{fontSize:'12px',color:'rgba(0,0,0,0.4)',marginBottom:'16px',display:'flex',alignItems:'center',gap:'6px'}}>
                    <span>📍</span> {secili.sehir}
                    {secili.online && <span style={{color:'#00c48c',fontWeight:600,marginLeft:'8px'}}>● Şu an çevrimiçi</span>}
                  </div>

                  {/* Butonlar */}
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    <button className={`btn-g${baglilar.includes(secili.id)?' bagli':''}`} style={{width:'100%',padding:'11px'}} onClick={() => setBaglilar(p => p.includes(secili.id)?p:[...p,secili.id])}>
                      {baglilar.includes(secili.id) ? '✓ Bağlandı' : '+ Bağlan'}
                    </button>
                    <button className="btn-o" style={{width:'100%',padding:'11px'}} onClick={() => router.push('/mesajlar')}>💬 Mesaj Gönder</button>
                    <button className="btn-o" style={{width:'100%',padding:'11px'}} onClick={() => router.push('/isbirligi')}>🤝 İş Birliği Teklifi</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
