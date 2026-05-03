'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Msg { id:number; me:boolean; text:string; time:string }
interface Contact { id:number; av:string; color:string; name:string; sub:string; lastMsg:string; time:string; unread:number; online:boolean }

export default function Mesajlar() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(() => {
    const kisi = searchParams.get('kisi')
    if (kisi) {
      const idx = [0,1,2,3,4].find(i => ['MD','SA','KY','TC','AK'][i] === kisi)
      return idx ?? 0
    }
    return 0
  })
  const [input, setInput] = useState('')
  const [searchQ, setSearchQ] = useState('')

  const contacts: Contact[] = [
    {id:0,av:'MD',color:'#3b82f6',name:'Prof. Dr. Mehmet Demir',sub:'ODTÜ · Biyomedikal',lastMsg:'Projeyi ne zaman başlatalım?',time:'10:24',unread:3,online:true},
    {id:1,av:'SA',color:'#06b6d4',name:'Doç. Dr. Selin Arslan',sub:'Hacettepe · Tıp',lastMsg:'Makaleyi inceledim, harika!',time:'Dün',unread:0,online:false},
    {id:2,av:'KY',color:'#0ea5e9',name:'Prof. Dr. Kemal Yıldız',sub:'İTÜ · YZ Lab',lastMsg:'TÜBİTAK başvurusu için...',time:'Dün',unread:1,online:true},
    {id:3,av:'TC',color:'#f97316',name:'Techno Medikal A.Ş.',sub:'Firma · Danışmanlık',lastMsg:'Teklifinizi değerlendirdik',time:'2 gün',unread:2,online:false},
    {id:4,av:'AK',color:'#10b981',name:'Dr. Ali Kaya',sub:'Boğaziçi · Bilgisayar',lastMsg:'Veri setini paylaşabilir misin?',time:'3 gün',unread:0,online:false},
  ]

  const [allMsgs, setAllMsgs] = useState<Record<number,Msg[]>>({
    0:[
      {id:1,me:false,text:'Merhaba Dr. Yılmaz! Federated learning projesi için işbirliği yapmak isterim.',time:'09:12'},
      {id:2,me:true,text:'Merhaba Prof. Demir! Tabii ki, detayları konuşalım.',time:'09:45'},
      {id:3,me:false,text:'Harika! Özellikle gizlilik koruma mekanizmaları üzerine odaklanabiliriz.',time:'10:01'},
      {id:4,me:true,text:'Benim de tam çalıştığım alan.',time:'10:15'},
      {id:5,me:false,text:'Projeyi ne zaman başlatalım?',time:'10:24'},
    ],
    1:[
      {id:1,me:false,text:'Merhaba! Kanser tespiti makalenizi okudum.',time:'Dün 14:30'},
      {id:2,me:true,text:'Teşekkürler! Nasıl buldunuz?',time:'Dün 15:02'},
      {id:3,me:false,text:'Makaleyi inceledim, harika! Özellikle transformer mimarisi çok yaratıcı.',time:'Dün 15:45'},
    ],
    2:[
      {id:1,me:false,text:'TÜBİTAK 1001 başvurusu için konsorsiyum kuruyoruz.',time:'Dün 11:00'},
      {id:2,me:false,text:'Sizin de dahil olmanızı isteriz.',time:'Dün 11:02'},
    ],
    3:[
      {id:1,me:false,text:'Sayın Dr. Yılmaz, danışmanlık başvurunuzu aldık.',time:'2 gün önce'},
      {id:2,me:true,text:'Teşekkürler, detayları konuşabiliriz.',time:'2 gün önce'},
      {id:3,me:false,text:'Teklifinizi değerlendirdik.',time:'2 gün önce'},
    ],
    4:[
      {id:1,me:false,text:'Veri setini paylaşabilir misin?',time:'3 gün önce'},
    ],
  })

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [allMsgs, active])

  useEffect(() => {
    const move = (e:MouseEvent) => { if(curRef.current){curRef.current.style.left=(e.clientX-2)+'px';curRef.current.style.top=(e.clientY-2)+'px'} }
    document.addEventListener('mousemove',move)
    return () => document.removeEventListener('mousemove',move)
  },[])

  useEffect(() => {
    const mn=mncRef.current; if(!mn) return
    const mc=mn.getContext('2d')!
    const mnp=[{x:4,y:4},{x:13,y:3},{x:22,y:4},{x:13,y:13},{x:13,y:22},{x:7,y:18},{x:19,y:18}]
    const mph=mnp.map(()=>mnp.map(()=>Math.random()*Math.PI*2))
    let mt=0,raf:number
    const draw=()=>{
      mc.clearRect(0,0,26,26)
      for(let i=0;i<mnp.length;i++) for(let j=i+1;j<mnp.length;j++){
        const a=mnp[i],b=mnp[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy)
        if(d<16){const f=Math.max(0,Math.sin(mt*0.9+mph[i][j]));mc.beginPath();mc.moveTo(a.x,a.y);mc.lineTo(b.x,b.y);mc.strokeStyle=`rgba(0,196,140,${f*0.7*(1-d/16)})`;mc.lineWidth=0.9;mc.stroke()}
      }
      mnp.forEach((p,i)=>{const pulse=Math.sin(mt*1.5+i*0.7);const g=0.5+0.5*Math.sin(mt*0.8+i*1.2);mc.beginPath();mc.arc(p.x,p.y,1.8+pulse*0.5,0,Math.PI*2);mc.fillStyle=`rgba(${Math.round(240*(1-g))},${Math.round(244*(1-g)+196*g)},${Math.round(255*(1-g)+140*g)},${0.7+0.3*pulse})`;mc.fill()})
      mt+=0.022;raf=requestAnimationFrame(draw)
    }
    draw()
    return ()=>cancelAnimationFrame(raf)
  },[])

  const send = () => {
    if(!input.trim()) return
    const msg:Msg={id:Date.now(),me:true,text:input.trim(),time:new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}
    setAllMsgs(p=>({...p,[active]:[...(p[active]||[]),msg]}))
    setInput('')
  }

  const ac = contacts[active]
  const msgs = allMsgs[active] || []
  const filtered = contacts.filter(c=>!searchQ||c.name.toLowerCase().includes(searchQ.toLowerCase()))

  const navItems = [
    {label:'Dashboard',href:'/dashboard'},{label:'Akademik Ağ',href:'/ag',badge:'YZ'},{label:'Dergi Eşleştirme',href:'/dergi',badge:'YZ'},
    {label:'Preprint',href:'/preprint'},{label:'Projeler',href:'/projeler',badge:'YZ'},{label:'İş Birliği Alanı',href:'/isbirligi',badge:'YZ'},
    {label:'CV',href:'/cv',badge:'YZ'},{label:'Yazı Asistanı',href:'/yazi',badge:'YZ'},{label:'İntihal Kontrolü',href:'/intihal',badge:'YZ'},
    {label:'Mesajlar',href:'/mesajlar',badge:'6',badgeRed:true,active:true},
  ]


  const iconStyle = { width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' } as const

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

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;cursor:none!important}
        body{font-family:'DM Sans',sans-serif;height:100vh;overflow:hidden;background:#f2f2f0;color:#0a0a0a}
        .nav-item{display:flex;align-items:center;gap:10px;padding:8px 18px;font-size:13px;color:rgba(255,255,255,0.5);transition:all 0.2s;border-left:2px solid transparent;cursor:pointer}
        .nav-item:hover{color:#fff;background:rgba(255,255,255,0.04)}
        .nav-item.active{color:#00c48c;border-left-color:#00c48c;background:rgba(0,196,140,0.07);font-weight:600}
        .contact{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(0,0,0,0.05);cursor:pointer;transition:background 0.15s}
        .contact:hover{background:rgba(0,196,140,0.03)}
        .contact.on{background:rgba(0,196,140,0.06);border-left:2px solid #00c48c}
        @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
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
                const isActive = '/mesajlar' === item.href
                return (
                  <div key={i} onClick={() => router.push(item.href)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 18px',fontSize:'13px',color:isActive?'#00c48c':'rgba(255,255,255,0.55)',borderLeft:`2px solid ${isActive?'#00c48c':'transparent'}`,background:isActive?'rgba(0,196,140,0.08)':'transparent',fontWeight:isActive?600:400,cursor:'pointer',transition:'all 0.2s'}}
                    onMouseEnter={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='#fff';el.style.background='rgba(255,255,255,0.05)'}}}
                    onMouseLeave={e=>{if(!isActive){const el=e.currentTarget as HTMLElement;el.style.color='rgba(255,255,255,0.55)';el.style.background='transparent'}}}>
                    <span style={iconStyle}>{item.icon}</span>
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


        {/* MESAJ ALANI */}
        <div style={{display:'grid',gridTemplateColumns:'280px 1fr',height:'100vh',overflow:'hidden'}}>

          {/* KİŞİ LİSTESİ */}
          <div style={{background:'#fff',borderRight:'1px solid rgba(0,0,0,0.07)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(0,0,0,0.07)',flexShrink:0}}>
              <div style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'15px',fontWeight:700,marginBottom:'10px'}}>Mesajlar</div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#f2f2f0',padding:'8px 12px',border:'1px solid rgba(0,0,0,0.07)'}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Kişi ara..." style={{border:'none',outline:'none',background:'transparent',fontSize:'12px',fontFamily:'DM Sans,sans-serif',width:'100%',color:'#0a0a0a'}}/>
              </div>
            </div>
            <div style={{flex:1,overflowY:'auto'}}>
              {filtered.map(c=>(
                <div key={c.id} className={`contact${active===c.id?' on':''}`} onClick={()=>setActive(c.id)}>
                  <div style={{position:'relative',flexShrink:0}}>
                    <div style={{width:'40px',height:'40px',borderRadius:'50%',background:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace"}}>{c.av}</div>
                    {c.online&&<div style={{position:'absolute',bottom:'1px',right:'1px',width:'9px',height:'9px',background:'#00c48c',borderRadius:'50%',border:'2px solid #fff'}}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontSize:'12px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',flexShrink:0,marginLeft:'6px'}}>{c.time}</div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'2px'}}>
                      <div style={{fontSize:'11px',color:'rgba(0,0,0,0.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.lastMsg}</div>
                      {c.unread>0&&<span style={{background:'#00c48c',color:'#0a0a0a',fontSize:'9px',fontWeight:800,minWidth:'17px',height:'17px',borderRadius:'9px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginLeft:'4px',padding:'0 3px'}}>{c.unread}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOHBET */}
          <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'#f8f9fa',minWidth:0}}>

            {/* SOHBET HEADER */}
            <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'12px 20px',display:'flex',alignItems:'center',gap:'12px',flexShrink:0}}>
              <div style={{position:'relative',flexShrink:0}}>
                <div style={{width:'38px',height:'38px',borderRadius:'50%',background:ac.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace"}}>{ac.av}</div>
                {ac.online&&<div style={{position:'absolute',bottom:'1px',right:'1px',width:'9px',height:'9px',background:'#00c48c',borderRadius:'50%',border:'2px solid #fff'}}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'13px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ac.name}</div>
                <div style={{fontSize:'11px',color:ac.online?'#00c48c':'rgba(0,0,0,0.35)',marginTop:'1px'}}>{ac.online?'● Çevrimiçi':ac.sub}</div>
              </div>
              <div style={{display:'flex',gap:'6px',flexShrink:0}}>
                {[
                  <path key="phone" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.09-.09c.75-.7 1.44-.51 2.11-.45.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>,
                  <><polygon key="v1" points="23 7 16 12 23 17 23 7"/><rect key="v2" x="1" y="5" width="15" height="14" rx="2" ry="2"/></>,
                ].map((_,i)=>(
                  <div key={i} style={{width:'30px',height:'30px',background:'#f2f2f0',border:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',borderRadius:'2px'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round">
                      {i===0?<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.09-.09a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>:<><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>}
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* MESAJLAR */}
            <div style={{flex:1,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:'10px'}}>
              {msgs.map(msg=>(
                <div key={msg.id} style={{display:'flex',flexDirection:msg.me?'row-reverse':'row',gap:'8px',alignItems:'flex-end',animation:'msgIn 0.3s ease forwards'}}>
                  {!msg.me&&<div style={{width:'30px',height:'30px',borderRadius:'50%',background:ac.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#fff',fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>{ac.av}</div>}
                  <div style={{display:'flex',flexDirection:'column',gap:'3px',alignItems:msg.me?'flex-end':'flex-start',maxWidth:'55%'}}>
                    <div style={{padding:'10px 14px',fontSize:'13px',lineHeight:1.6,fontWeight:300,background:msg.me?'#0a0a0a':'#fff',color:msg.me?'#fff':'#0a0a0a',borderRadius:msg.me?'12px 0 12px 12px':'0 12px 12px 12px',border:msg.me?'none':'1px solid rgba(0,0,0,0.07)'}}>
                      {msg.text}
                    </div>
                    <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)'}}>{msg.time}</div>
                  </div>
                  {msg.me&&<div style={{width:'30px',height:'30px',borderRadius:'50%',background:'#00c48c',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#0a0a0a',fontFamily:"'Pixelify Sans',monospace",flexShrink:0}}>AY</div>}
                </div>
              ))}
              <div ref={bottomRef}/>
            </div>

            {/* INPUT */}
            <div style={{background:'#fff',borderTop:'1px solid rgba(0,0,0,0.07)',padding:'12px 20px',flexShrink:0}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',background:'#f2f2f0',border:'1.5px solid rgba(0,0,0,0.07)',padding:'10px 16px'}}>
                <input
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),send())}
                  placeholder={`${ac.name} kişisine mesaj...`}
                  style={{flex:1,border:'none',outline:'none',fontSize:'13px',fontFamily:'DM Sans,sans-serif',background:'transparent',color:'#0a0a0a',minWidth:0}}
                />
                <button onClick={send} style={{width:'36px',height:'36px',background:'#0a0a0a',border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,borderRadius:'2px',transition:'background 0.2s'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                </button>
              </div>
              <div style={{fontSize:'10px',color:'rgba(0,0,0,0.25)',marginTop:'5px'}}>Enter ile gönder</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
