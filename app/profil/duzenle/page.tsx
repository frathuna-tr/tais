'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'

const css = `
  * { margin:0; padding:0; box-sizing:border-box; cursor:none!important; }
  html, body { cursor:none!important; }
  body { font-family:'DM Sans',sans-serif; background:#f2f2f0; color:#0a0a0a; height:100vh; overflow:hidden; }
  .f-inp { width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.1); background:#f8f9fa; font-size:13px; font-family:'DM Sans',sans-serif; color:#0a0a0a; outline:none; box-sizing:border-box; display:block; }
  .f-inp:focus { border-color:#00c48c; }
  .f-ta { width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.1); background:#f8f9fa; font-size:13px; font-family:'DM Sans',sans-serif; color:#0a0a0a; outline:none; box-sizing:border-box; resize:vertical; display:block; }
  .f-ta:focus { border-color:#00c48c; }
  .f-sel { width:100%; padding:9px 12px; border:1px solid rgba(0,0,0,0.1); background:#f8f9fa; font-size:13px; font-family:'DM Sans',sans-serif; color:#0a0a0a; outline:none; box-sizing:border-box; appearance:none; display:block; }
  .f-sel:focus { border-color:#00c48c; }
  .f-lbl { font-size:10px; color:rgba(0,0,0,0.4); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:5px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .tbtn-ol { background:transparent; color:#0a0a0a; border:1px solid rgba(0,0,0,0.1); padding:8px 16px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; }
  .tbtn-ol:hover { border-color:#00c48c; color:#00c48c; }
  .tbtn-dk { background:#0a0a0a; color:#fff; border:none; padding:8px 20px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; min-width:110px; }
  .tbtn-ok { background:#00c48c; color:#0a0a0a; border:none; padding:8px 20px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; min-width:110px; }
  .sek-btn { flex:1; padding:10px 14px; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; border:none; cursor:pointer; background:transparent; color:rgba(0,0,0,0.35); border-bottom:2px solid transparent; }
  .sek-btn:hover { color:rgba(0,0,0,0.6); }
  .sek-btn.ak { color:#00c48c; border-bottom-color:#00c48c; }
  .nav-row { display:flex; align-items:center; gap:10px; padding:9px 18px; font-size:13px; cursor:pointer; border-left:2px solid transparent; color:rgba(255,255,255,0.55); transition:color 0.15s; }
  .nav-row:hover { background:rgba(255,255,255,0.05); color:#fff; }
  .nav-row.active { color:#00c48c !important; border-left-color:#00c48c; background:rgba(0,196,140,0.08); font-weight:600; }
  .info-box { padding:12px 14px; background:rgba(0,196,140,0.05); border:1px solid rgba(0,196,140,0.15); font-size:12px; color:rgba(0,0,0,0.5); line-height:1.6; }
`

export default function AkademisyenProfilDuzenle() {
  const { profil, yukleniyor, guncelle } = useProfile()
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const [sekme, setSekme] = useState<'genel'|'akademik'|'guvenlik'>('genel')
  const [kayit, setKayit] = useState<'idle'|'yukleniyor'|'tamam'>('idle')

  const [ad, setAd] = useState('')
  const [soyad, setSoyad] = useState('')
  const [eposta, setEposta] = useState('')
  const [telefon, setTelefon] = useState('')
  const [sehir, setSehir] = useState('')
  const [bio, setBio] = useState('')
  const [uzmanlik, setUzmanlik] = useState('')
  const [unvan, setUnvan] = useState('')
  const [uni, setUni] = useState('')
  const [fakulte, setFakulte] = useState('')
  const [bolum, setBolum] = useState('')
  const [orcid, setOrcid] = useState('')
  const [scholar, setScholar] = useState('')
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')
  const [s3, setS3] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarYukleniyor, setAvatarYukleniyor] = useState(false)

  const avataryukle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarYukleniyor(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(data.publicUrl + '?t=' + Date.now())
      await guncelle({ avatar_url: data.publicUrl } as any)
    }
    setAvatarYukleniyor(false)
  }

  useEffect(() => {
    if (!profil) return
    setAd(profil.ad || '')
    setSoyad(profil.soyad || '')
    setEposta(profil.email || '')
    setTelefon(profil.telefon || '')
    setSehir(profil.sehir || '')
    setBio(profil.bio || '')
    setUzmanlik(profil.uzmanlik || '')
    setUnvan(profil.unvan || '')
    setUni(profil.universite || '')
    setFakulte(profil.fakulte || '')
    setBolum(profil.bolum || '')
    setOrcid(profil.orcid || '')
    setScholar(profil.scholar || '')
    setAvatarUrl((profil as any).avatar_url || '')
  }, [profil])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (curRef.current) {
        curRef.current.style.left = (e.clientX - 2) + 'px'
        curRef.current.style.top = (e.clientY - 2) + 'px'
      }
    }
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
        if (d<16) { const f=Math.max(0,Math.sin(mt*0.9+mph[i][j])); mc.beginPath(); mc.moveTo(a.x,a.y); mc.lineTo(b.x,b.y); mc.strokeStyle='rgba(0,196,140,'+f*0.7*(1-d/16)+')'; mc.lineWidth=0.9; mc.stroke() }
      }
      mnp.forEach((p,i) => {
        const pulse=Math.sin(mt*1.5+i*0.7); const g=0.5+0.5*Math.sin(mt*0.8+i*1.2)
        mc.beginPath(); mc.arc(p.x,p.y,1.8+pulse*0.5,0,Math.PI*2)
        mc.fillStyle='rgba('+Math.round(240*(1-g))+','+Math.round(244*(1-g)+196*g)+','+Math.round(255*(1-g)+140*g)+','+(0.7+0.3*pulse)+')'
        mc.fill()
      })
      mt+=0.022; raf=requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  const kaydet = async () => {
    setKayit('yukleniyor')
    const { basarili } = await guncelle({
      ad, soyad, email: eposta, telefon, sehir, bio,
      uzmanlik, unvan, universite: uni, fakulte, bolum, orcid, scholar,
    })
    setKayit(basarili ? 'tamam' : 'idle')
    if (basarili) setTimeout(() => setKayit('idle'), 2500)
  }

  const iS = { width:'22px', height:'22px', display:'flex' as const, alignItems:'center' as const, justifyContent:'center' as const, flexShrink:0 as const, background:'rgba(255,255,255,0.07)', borderRadius:'2px', padding:'4px' }

  const navItems = [
    { label:'Dashboard', href:'/dashboard', icon:<svg viewBox="0 0 12 12" fill="#60a5fa" width="14" height="14"><rect x="1" y="1" width="4" height="4"/><rect x="7" y="1" width="4" height="4"/><rect x="1" y="7" width="4" height="4"/><rect x="7" y="7" width="4" height="4"/></svg> },
    { label:'Akademik Ağ', href:'/ag', badge:'YZ', icon:<svg viewBox="0 0 12 12" width="14" height="14"><circle cx="2" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="2" r="1.5" fill="#06b6d4"/><circle cx="10" cy="6" r="1.5" fill="#06b6d4"/><circle cx="6" cy="10" r="1.5" fill="#06b6d4"/><line x1="2" y1="6" x2="6" y2="2" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="2" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/><line x1="2" y1="6" x2="6" y2="10" stroke="#06b6d4" strokeWidth="1"/><line x1="6" y1="10" x2="10" y2="6" stroke="#06b6d4" strokeWidth="1"/></svg> },
    { label:'Dergi Eşleştirme', href:'/dergi', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#34d399" width="14" height="14"><rect x="2" y="1" width="6" height="1"/><rect x="2" y="1" width="1" height="9"/><rect x="2" y="9" width="8" height="1"/><rect x="9" y="4" width="1" height="6"/><rect x="4" y="4" width="4" height="1"/><rect x="4" y="6" width="4" height="1"/></svg> },
    { label:'Makale Formatlama', href:'/format', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#f97316" width="14" height="14"><rect x="1" y="1" width="10" height="1"/><rect x="1" y="3" width="8" height="1"/><rect x="1" y="5" width="10" height="1"/><rect x="1" y="7" width="6" height="1"/></svg> },
    { label:'CV', href:'/cv', badge:'YZ', icon:<svg viewBox="0 0 12 12" fill="#fbbf24" width="14" height="14"><rect x="2" y="1" width="8" height="10"/><rect x="4" y="0" width="4" height="2"/><rect x="4" y="3" width="4" height="1"/><rect x="4" y="5" width="5" height="1"/></svg> },
    { label:'Mesajlar', href:'/mesajlar', badge:'7', badgeRed:true, icon:<svg viewBox="0 0 12 12" fill="rgba(255,255,255,0.45)" width="14" height="14"><rect x="1" y="2" width="10" height="7"/><rect x="1" y="9" width="2" height="2"/><rect x="2" y="8" width="8" height="1"/></svg> },
    { label:'Profilim', href:'/profil', icon:<svg viewBox="0 0 12 12" fill="#94a3b8" width="14" height="14"><rect x="4" y="1" width="4" height="4"/><rect x="1" y="8" width="10" height="3"/><rect x="2" y="7" width="2" height="1"/><rect x="8" y="7" width="2" height="1"/></svg> },
    { label:'Profil Düzenle', href:'/profil/duzenle', icon:<svg viewBox="0 0 12 12" fill="#00c48c" width="14" height="14"><rect x="1" y="9" width="10" height="1"/><path d="M2 7l5-5 2 2-5 5z" fill="#00c48c"/></svg> },
  ]

  if (yukleniyor) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:"'DM Sans',sans-serif",fontSize:'13px',color:'rgba(0,0,0,0.4)'}}>
      Yükleniyor...
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: css}}/>

      <svg ref={curRef} style={{position:'fixed',top:-20,left:-20,zIndex:9999,pointerEvents:'none',display:'block'}} width="20" height="20" viewBox="0 0 10 10">
        <rect x="0" y="0" width="2" height="2" fill="#00c48c"/><rect x="0" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="4" width="2" height="2" fill="#00c48c"/><rect x="0" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="8" width="2" height="2" fill="#00c48c"/><rect x="2" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="4" width="2" height="2" fill="#00c48c"/><rect x="4" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="6" width="2" height="2" fill="#00c48c"/><rect x="6" y="8" width="2" height="2" fill="#00c48c"/>
      </svg>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',height:'100vh'}}>

        <aside style={{background:'linear-gradient(180deg,#0d1117 0%,#0a0f0c 100%)',display:'flex',flexDirection:'column',height:'100vh',overflowY:'auto',borderRight:'1px solid rgba(0,196,140,0.15)'}}>
          <div style={{padding:'16px 20px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px'}}>
              <canvas ref={mncRef} width="26" height="26" style={{flexShrink:0}}/>
              <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'21px',fontWeight:700,background:'linear-gradient(90deg,#00c48c,#fff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>tais.tr</span>
            </div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,0.2)',letterSpacing:'1px'}}>Akademik Ekosistem</div>
          </div>
          <div style={{padding:'10px 0',flex:1}}>
            {navItems.map((item, i) => (
              <div key={i} onClick={() => router.push(item.href)}
                className={'nav-row' + (item.href === '/profil/duzenle' ? ' active' : '')}>
                <span style={iS}>{item.icon}</span>
                <span style={{flex:1}}>{item.label}</span>
                {item.badge && <span style={{background:(item as any).badgeRed?'#ee5533':'#00c48c',color:(item as any).badgeRed?'#fff':'#0a0a0a',fontSize:'8px',fontWeight:800,padding:'2px 5px',borderRadius:(item as any).badgeRed?'8px':'0',fontFamily:"'Pixelify Sans',monospace"}}>{item.badge}</span>}
              </div>
            ))}
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'34px',height:'34px',background:'#00c48c',borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'#0a0a0a',fontFamily:"'Pixelify Sans',monospace"}}>
                {ad[0]}{soyad[0]}
              </div>
              <div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.8)',fontWeight:500}}>{ad} {soyad}</div>
                <div style={{fontSize:'9px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>{unvan}</div>
              </div>
            </div>
          </div>
        </aside>

        <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden'}}>
          <div style={{background:'#fff',borderBottom:'1px solid rgba(0,0,0,0.07)',padding:'0 32px',height:'52px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <span onClick={() => router.push('/profil')} style={{display:'flex',alignItems:'center',gap:'5px',cursor:'pointer',color:'rgba(0,0,0,0.4)',fontSize:'12px',fontWeight:500}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                Profilim
              </span>
              <span style={{color:'rgba(0,0,0,0.2)'}}>›</span>
              <span style={{fontFamily:"'Pixelify Sans',monospace",fontSize:'15px',fontWeight:700}}>Profil Düzenle</span>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <button className="tbtn-ol" onClick={() => router.push('/profil')}>İptal</button>
              <button className={kayit==='tamam'?'tbtn-ok':'tbtn-dk'} onClick={kaydet}>
                {kayit==='tamam' ? '✓ Kaydedildi' : kayit==='yukleniyor' ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>

          <div style={{flex:1,overflowY:'auto',padding:'24px 32px',display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.07)'}}>
              <div style={{display:'flex',borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
                <button className={'sek-btn'+(sekme==='genel'?' ak':'')} onClick={() => setSekme('genel')}>Genel Bilgiler</button>
                <button className={'sek-btn'+(sekme==='akademik'?' ak':'')} onClick={() => setSekme('akademik')}>Akademik Bilgiler</button>
                <button className={'sek-btn'+(sekme==='guvenlik'?' ak':'')} onClick={() => setSekme('guvenlik')}>Güvenlik</button>
              </div>

              <div style={{padding:'24px',maxWidth:'600px'}}>
                {sekme==='genel' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'16px',padding:'16px',background:'#f8f9fa',border:'1px solid rgba(0,0,0,0.06)'}}>
                      <div style={{width:'60px',height:'60px',background:'#00c48c',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Pixelify Sans',monospace",fontSize:'20px',fontWeight:700,color:'#0a0a0a',flexShrink:0,overflow:'hidden'}}>
                        {avatarUrl ? <img src={avatarUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : `${ad[0]}${soyad[0]}`}
                      </div>
                      <div>
                        <div style={{fontSize:'12px',fontWeight:600,marginBottom:'3px'}}>Profil Fotoğrafı</div>
                        <div style={{fontSize:'11px',color:'rgba(0,0,0,0.35)',marginBottom:'8px'}}>JPG veya PNG · Maks 2MB</div>
                        <label style={{fontSize:'11px',fontWeight:600,color:'#00c48c',border:'1px solid #00c48c',padding:'4px 10px',cursor:'pointer'}}>
                          {avatarYukleniyor ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                          <input type="file" accept="image/*" style={{display:'none'}} onChange={avataryukle}/>
                        </label>
                      </div>
                    </div>
                    <div className="grid2">
                      <div><label className="f-lbl">Ad</label><input className="f-inp" value={ad} onChange={e=>setAd(e.target.value)}/></div>
                      <div><label className="f-lbl">Soyad</label><input className="f-inp" value={soyad} onChange={e=>setSoyad(e.target.value)}/></div>
                    </div>
                    <div><label className="f-lbl">E-posta</label><input className="f-inp" type="email" value={eposta} onChange={e=>setEposta(e.target.value)}/></div>
                    <div className="grid2">
                      <div><label className="f-lbl">Telefon</label><input className="f-inp" value={telefon} onChange={e=>setTelefon(e.target.value)} placeholder="+90 5xx xxx xx xx"/></div>
                      <div><label className="f-lbl">Şehir</label><input className="f-inp" value={sehir} onChange={e=>setSehir(e.target.value)}/></div>
                    </div>
                    <div><label className="f-lbl">Biyografi</label><textarea className="f-ta" rows={4} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Kendinizi kısaca tanıtın..."/></div>
                    <div><label className="f-lbl">Uzmanlık Alanları</label><textarea className="f-ta" rows={2} value={uzmanlik} onChange={e=>setUzmanlik(e.target.value)} placeholder="Virgülle ayırın..."/></div>
                  </div>
                )}

                {sekme==='akademik' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <div>
                      <label className="f-lbl">Unvan</label>
                      <select className="f-sel" value={unvan} onChange={e=>setUnvan(e.target.value)}>
                        <option>Profesör Doktor</option>
                        <option>Doçent Doktor</option>
                        <option>Doktor Öğretim Üyesi</option>
                        <option>Araştırma Görevlisi</option>
                        <option>Öğretim Görevlisi</option>
                      </select>
                    </div>
                    <div><label className="f-lbl">Üniversite</label><input className="f-inp" value={uni} onChange={e=>setUni(e.target.value)}/></div>
                    <div className="grid2">
                      <div><label className="f-lbl">Fakülte</label><input className="f-inp" value={fakulte} onChange={e=>setFakulte(e.target.value)}/></div>
                      <div><label className="f-lbl">Bölüm</label><input className="f-inp" value={bolum} onChange={e=>setBolum(e.target.value)}/></div>
                    </div>
                    <div style={{borderTop:'1px solid rgba(0,0,0,0.07)',paddingTop:'16px',display:'flex',flexDirection:'column',gap:'12px'}}>
                      <div style={{fontSize:'10px',fontWeight:700,color:'rgba(0,0,0,0.35)',textTransform:'uppercase',letterSpacing:'0.5px'}}>Akademik Profil Linkleri</div>
                      <div><label className="f-lbl">ORCID ID</label><input className="f-inp" value={orcid} onChange={e=>setOrcid(e.target.value)} placeholder="0000-0000-0000-0000"/></div>
                      <div><label className="f-lbl">Google Scholar URL</label><input className="f-inp" value={scholar} onChange={e=>setScholar(e.target.value)} placeholder="https://scholar.google.com/..."/></div>
                    </div>
                    <div className="info-box">💡 Yayınlar, preprint'ler ve projeler ilgili sayfalardan yönetilir.</div>
                  </div>
                )}

                {sekme==='guvenlik' && (
                  <div style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'420px'}}>
                    <div style={{padding:'12px 14px',background:'#f8f9fa',border:'1px solid rgba(0,0,0,0.06)',fontSize:'13px',color:'rgba(0,0,0,0.5)',lineHeight:1.7}}>
                      Şifrenizi değiştirmek için önce mevcut şifrenizi girin.
                    </div>
                    <div><label className="f-lbl">Mevcut Şifre</label><input className="f-inp" type="password" value={s1} onChange={e=>setS1(e.target.value)}/></div>
                    <div><label className="f-lbl">Yeni Şifre</label><input className="f-inp" type="password" value={s2} onChange={e=>setS2(e.target.value)}/></div>
                    <div><label className="f-lbl">Yeni Şifre (Tekrar)</label><input className="f-inp" type="password" value={s3} onChange={e=>setS3(e.target.value)}/></div>
                    {s2 && s3 && s2!==s3 && <div style={{fontSize:'12px',color:'#e53333',padding:'10px 12px',background:'rgba(229,51,51,0.05)',border:'1px solid rgba(229,51,51,0.15)'}}>✕ Şifreler eşleşmiyor.</div>}
                    {s2 && s3 && s2===s3 && s2.length>=8 && <div style={{fontSize:'12px',color:'#008a64',padding:'10px 12px',background:'rgba(0,196,140,0.05)',border:'1px solid rgba(0,196,140,0.15)'}}>✓ Şifreler eşleşiyor.</div>}
                    <div style={{paddingTop:'16px',borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                      <div style={{fontSize:'10px',color:'rgba(0,0,0,0.3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:'10px'}}>Hesap İşlemleri</div>
                      <button style={{background:'transparent',border:'1px solid rgba(229,51,51,0.3)',color:'#e53333',padding:'7px 14px',fontSize:'11px',fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:'pointer'}}>Hesabı Sil</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',paddingBottom:'8px'}}>
              <button className="tbtn-ol" onClick={() => router.push('/profil')}>İptal</button>
              <button className={kayit==='tamam'?'tbtn-ok':'tbtn-dk'} onClick={kaydet}>
                {kayit==='tamam' ? '✓ Kaydedildi' : kayit==='yukleniyor' ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
