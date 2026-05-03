'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AkademikAg() {
  const curRef = useRef<SVGSVGElement>(null)
  const mncRef = useRef<HTMLCanvasElement>(null)
  const ncRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab')
    if (tab === 'oneriler') return 1
    if (tab === 'yayinlar') return 2
    return 0
  })
  const [searchQ, setSearchQ] = useState('')
  const [activeFilter, setActiveFilter] = useState('tumu')
  const [filterLabel, setFilterLabel] = useState('Tümü')
  const [filterOpen, setFilterOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [miniChatOpen, setMiniChatOpen] = useState(false)
  const [chatPerson, setChatPerson] = useState({ av: 'MD', name: 'Prof. Dr. Mehmet Demir', color: '#3b82f6' })
  const [chatMsg, setChatMsg] = useState('')
  const [chatMsgs, setChatMsgs] = useState([{ me: false, text: 'Merhaba, federated learning projeniz hakkında konuşmak isterim.' }, { me: true, text: 'Tabii, ne zaman uygunsunuz?' }])
  const [connectedCards, setConnectedCards] = useState<number[]>([])
  const [hoveredProfile, setHoveredProfile] = useState<{x:number,y:number,node:typeof nodeDataStatic[0]} | null>(null)

  const nodeDataStatic = [
    { label: 'AY', name: 'Dr. Ayşe Yılmaz', sub: 'İTÜ · Biyomedikal', tag: 'Ana Düğüm', color: '#00c48c', score: '', pub: 18, isSelf: true },
    { label: 'MD', name: 'Prof. Mehmet Demir', sub: 'ODTÜ · Biyomedikal', tag: '%94 uyum', color: '#3b82f6', score: '%94', pub: 42, isSelf: false },
    { label: 'SK', name: 'Doç. Selin Kaya', sub: 'Boğaziçi · NLP', tag: '%88 uyum', color: '#06b6d4', score: '%88', pub: 28, isSelf: false },
    { label: 'AK', name: 'Dr. Ali Kaya', sub: 'Boğaziçi · Yazılım', tag: '%82 uyum', color: '#f97316', score: '%82', pub: 15, isSelf: false },
    { label: 'KY', name: 'Prof. Kemal Yıldız', sub: 'İTÜ · YZ Lab', tag: '%79 uyum', color: '#0ea5e9', score: '%79', pub: 55, isSelf: false },
    { label: 'NŞ', name: 'Doç. Neslihan Şahin', sub: 'Hacettepe · Onkoloji', tag: '%76 uyum', color: '#ee5533', score: '%76', pub: 31, isSelf: false },
    { label: 'OA', name: 'Dr. Okan Aydın', sub: 'ODTÜ · Biyoinformatik', tag: 'Öneri %91', color: '#10b981', score: '%91', pub: 22, isSelf: false },
    { label: 'ZD', name: 'Prof. Zeynep Doğan', sub: 'İTÜ · Tıp Bilişimi', tag: 'Öneri %87', color: '#3b82f6', score: '%87', pub: 38, isSelf: false },
    { label: 'BK', name: 'Doç. Baran Kurt', sub: 'Bilkent · Robotik', tag: 'Öneri %83', color: '#f59e0b', score: '%83', pub: 19, isSelf: false },
    { label: 'SA', name: 'Doç. Selin Arslan', sub: 'Hacettepe · Onkoloji', tag: '3. derece', color: '#6366f1', score: '', pub: 12, isSelf: false },
    { label: 'CK', name: 'Dr. Can Kara', sub: 'ODTÜ · Veri', tag: '3. derece', color: '#14b8a6', score: '', pub: 9, isSelf: false },
    { label: 'EA', name: 'Dr. Ece Arslan', sub: 'Bilkent · ML', tag: '3. derece', color: '#84cc16', score: '', pub: 7, isSelf: false },
  ]

  const filters = ['tumu', 'yz', 'biyomedikal', 'muhendislik', 'sanat', 'enerji', 'hukuk', 'egitim', 'fizik', 'kimya', 'malzeme']
  const filterLabels = ['Tümü', 'YZ / ML', 'Biyomedikal', 'Mühendislik', 'Sanat', 'Enerji', 'Hukuk', 'Eğitim', 'Fizik', 'Kimya', 'Malzeme']

  const connections = [
    { av: 'MD', color: '#3b82f6', name: 'Prof. Dr. Mehmet Demir', sub: 'ODTÜ · Biyomedikal', score: '%94', online: true, cats: ['biyomedikal'] },
    { av: 'SK', color: '#06b6d4', name: 'Doç. Dr. Selin Kaya', sub: 'Boğaziçi · NLP', score: '%88', online: false, cats: ['yz'] },
    { av: 'AK', color: '#f97316', name: 'Dr. Ali Kaya', sub: 'Boğaziçi · Yazılım', score: '%82', online: true, cats: ['muhendislik', 'yz'] },
    { av: 'KY', color: '#0ea5e9', name: 'Prof. Dr. Kemal Yıldız', sub: 'İTÜ · YZ Lab', score: '%79', online: true, cats: ['yz'] },
    { av: 'NŞ', color: '#ee5533', name: 'Doç. Dr. Neslihan Şahin', sub: 'Hacettepe · Onkoloji', score: '%76', online: false, cats: ['biyomedikal'] },
  ]

  const recommendations = [
    { av: 'OA', color: '#10b981', name: 'Dr. Okan Aydın', sub: 'ODTÜ · Biyoinformatik', score: '%91', reason: '3 ortak yayın alanı · Federated learning üzerine çalışıyor', tags: ['Biyoinformatik', 'Python', 'ML'] },
    { av: 'ZD', color: '#3b82f6', name: 'Prof. Dr. Zeynep Doğan', sub: 'İTÜ · Tıp Bilişimi', score: '%87', reason: 'Aynı TÜBİTAK çağrısına başvurmuş · Klinik veri alanında uzman', tags: ['Tıp Bilişimi', 'EHR', 'FHIR'] },
    { av: 'BK', color: '#f59e0b', name: 'Doç. Dr. Baran Kurt', sub: 'Bilkent · Robotik', score: '%83', reason: 'Computer vision alanında 8 ortak yayın potansiyeli', tags: ['Robotik', 'CV', 'ROS'] },
  ]

  const publications = [
    { title: 'Deep Learning for Early Cancer Detection: A Multi-Center Study', journal: 'Nature Medicine', year: '2024', q1: true, ortak: true },
    { title: 'Federated Learning in Clinical Settings: Privacy-Preserving Analytics', journal: 'Computers in Biology', year: '2023', q1: true, ortak: true },
    { title: 'Transformer Networks in Medical Image Segmentation', journal: 'IEEE Trans. Medical', year: '2024', q1: true, ortak: false },
    { title: 'Privacy-Preserving Multi-Modal Learning Framework', journal: 'AI in Medicine', year: '2023', q1: true, ortak: true },
    { title: 'Benchmark Dataset for Medical Image Segmentation Tasks', journal: 'Nature Data', year: '2024', q1: true, ortak: false },
  ]

  // CURSOR
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

  // MİKRO NETWORK
  useEffect(() => {
    const mn = mncRef.current
    if (!mn) return
    const mc = mn.getContext('2d')!
    const mnp = [{x:4,y:4},{x:13,y:3},{x:22,y:4},{x:13,y:13},{x:13,y:22},{x:7,y:18},{x:19,y:18}]
    const mph = mnp.map(() => mnp.map(() => Math.random() * Math.PI * 2))
    let mt = 0, raf: number
    const drawMn = () => {
      mc.clearRect(0, 0, 26, 26)
      for (let i = 0; i < mnp.length; i++) for (let j = i + 1; j < mnp.length; j++) {
        const a = mnp[i], b = mnp[j], dx = a.x-b.x, dy = a.y-b.y, d = Math.sqrt(dx*dx+dy*dy)
        if (d < 16) {
          const f = Math.max(0, Math.sin(mt * 0.9 + mph[i][j]))
          mc.beginPath(); mc.moveTo(a.x, a.y); mc.lineTo(b.x, b.y)
          mc.strokeStyle = `rgba(0,196,140,${f*0.7*(1-d/16)})`; mc.lineWidth = 0.9; mc.stroke()
        }
      }
      mnp.forEach((p, i) => {
        const pulse = Math.sin(mt * 1.5 + i * 0.7)
        const g = 0.5 + 0.5 * Math.sin(mt * 0.8 + i * 1.2)
        mc.beginPath(); mc.arc(p.x, p.y, 1.8 + pulse * 0.5, 0, Math.PI * 2)
        mc.fillStyle = `rgba(${Math.round(240*(1-g))},${Math.round(244*(1-g)+196*g)},${Math.round(255*(1-g)+140*g)},${0.7+0.3*pulse})`
        mc.fill()
      })
      mt += 0.022; raf = requestAnimationFrame(drawMn)
    }
    drawMn()
    return () => cancelAnimationFrame(raf)
  }, [])

  // NETWORK CANVAS
  useEffect(() => {
    const nc = ncRef.current
    if (!nc) return
    const nx = nc.getContext('2d')!
    let scale = 1, offsetX = 0, offsetY = 0
    let dragging = false, dragStart = { x: 0, y: 0 }
    let nt = 0, hoveredNode = -1, raf: number

    const nodeData = [
      { label: 'AY', name: 'Dr. Ayşe Yılmaz', sub: 'İTÜ · Biyomedikal', tag: 'Ana Düğüm', color: '#00c48c', r: 22, isSelf: true, cat: ['biyomedikal', 'yz'] },
      { label: 'MD', name: 'Prof. Mehmet Demir', sub: 'ODTÜ · Biyomedikal', tag: '%94 uyum', color: '#3b82f6', r: 16, cat: ['biyomedikal'] },
      { label: 'SK', name: 'Doç. Selin Kaya', sub: 'Boğaziçi · NLP', tag: '%88 uyum', color: '#06b6d4', r: 13, cat: ['yz'] },
      { label: 'AK', name: 'Dr. Ali Kaya', sub: 'Boğaziçi · Yazılım', tag: '%82 uyum', color: '#f97316', r: 12, cat: ['muhendislik', 'yz'] },
      { label: 'KY', name: 'Prof. Kemal Yıldız', sub: 'İTÜ · YZ Lab', tag: '%79 uyum', color: '#0ea5e9', r: 14, cat: ['yz'] },
      { label: 'NŞ', name: 'Doç. Neslihan Şahin', sub: 'Hacettepe · Onkoloji', tag: '%76 uyum', color: '#ee5533', r: 11, cat: ['biyomedikal'] },
      { label: 'OA', name: 'Dr. Okan Aydın', sub: 'ODTÜ · Biyoinformatik', tag: 'Öneri %91', color: '#10b981', r: 11, cat: ['biyomedikal', 'yz'] },
      { label: 'ZD', name: 'Prof. Zeynep Doğan', sub: 'İTÜ · Tıp Bilişimi', tag: 'Öneri %87', color: '#3b82f6', r: 10, cat: ['biyomedikal', 'yz'] },
      { label: 'BK', name: 'Doç. Baran Kurt', sub: 'Bilkent · Robotik', tag: 'Öneri %83', color: '#f59e0b', r: 10, cat: ['muhendislik', 'yz'] },
      { label: 'SA', name: 'Doç. Selin Arslan', sub: 'Hacettepe · Onkoloji', tag: '3. derece', color: '#6366f1', r: 9, cat: ['biyomedikal'] },
      { label: 'CK', name: 'Dr. Can Kara', sub: 'ODTÜ · Veri', tag: '3. derece', color: '#14b8a6', r: 8, cat: ['yz', 'muhendislik'] },
      { label: 'EA', name: 'Dr. Ece Arslan', sub: 'Bilkent · ML', tag: '3. derece', color: '#84cc16', r: 8, cat: ['yz'] },
    ]
    const links = [
      {a:0,b:1,w:3,shared:true},{a:0,b:2,w:2,shared:true},{a:0,b:3,w:2,shared:false},{a:0,b:4,w:2,shared:false},{a:0,b:5,w:1.5,shared:false},
      {a:1,b:6,w:1,shared:false},{a:1,b:9,w:1,shared:false},{a:2,b:7,w:1,shared:false},{a:3,b:10,w:1,shared:false},{a:4,b:8,w:1,shared:false},{a:4,b:11,w:1,shared:false},
      {a:6,b:7,w:0.8,shared:false},{a:8,b:9,w:0.8,shared:false},{a:5,b:7,w:0.8,shared:false}
    ]

    const sizeNC = () => { nc.width = nc.offsetWidth; nc.height = nc.offsetHeight }
    sizeNC()
    window.addEventListener('resize', sizeNC)

    let nodes: {x:number,y:number,ox:number,oy:number,ph:number,label:string,name:string,sub:string,tag:string,color:string,r:number,isSelf?:boolean,cat:string[]}[] = []

    const initNodes = () => {
      const W = nc.width, H = nc.height, cx = W/2, cy = H/2
      nodes = nodeData.map((d, i) => {
        let x = cx, y = cy
        if (i === 0) { x = cx; y = cy }
        else if (i <= 5) { const a = (i-1)/5*Math.PI*2-Math.PI/2; x = cx+Math.cos(a)*160; y = cy+Math.sin(a)*120 }
        else if (i <= 8) { const a = (i-6)/3*Math.PI*2; x = cx+Math.cos(a)*280; y = cy+Math.sin(a)*200 }
        else { const a = (i-9)/3*Math.PI*2+0.5; x = cx+Math.cos(a)*380; y = cy+Math.sin(a)*260 }
        return { ...d, x, y, ox: x, oy: y, ph: Math.random()*Math.PI*2 }
      })
    }
    initNodes()

    const profileCardRef = { current: -1 }
    nc.addEventListener('mousemove', e => {
      const r = nc.getBoundingClientRect()
      const mx = (e.clientX - r.left - offsetX) / scale
      const my = (e.clientY - r.top - offsetY) / scale
      let found = -1
      nodes.forEach((n, i) => { const dx = mx-n.x, dy = my-n.y; if (Math.sqrt(dx*dx+dy*dy) < n.r+6) found = i })
      hoveredNode = found
      if (found >= 0 && found !== profileCardRef.current) {
        profileCardRef.current = found
        const rect = nc.getBoundingClientRect()
        const nd = nodeData[found]
        const cardX = e.clientX - rect.left + 16
        const cardY = e.clientY - rect.top - 40
        const event = new CustomEvent('nodeHover', { detail: { x: cardX, y: cardY, node: nd, idx: found } })
        nc.dispatchEvent(event)
      } else if (found < 0 && profileCardRef.current >= 0) {
        profileCardRef.current = -1
        nc.dispatchEvent(new CustomEvent('nodeLeave'))
      }
      if (dragging) { offsetX += e.clientX - dragStart.x; offsetY += e.clientY - dragStart.y; dragStart = {x:e.clientX, y:e.clientY} }
    })
    nc.addEventListener('mousedown', e => { dragging = true; dragStart = {x:e.clientX, y:e.clientY} })
    nc.addEventListener('mouseup', () => dragging = false)
    nc.addEventListener('mouseleave', () => dragging = false)
    nc.addEventListener('wheel', e => { e.preventDefault(); const f = e.deltaY > 0 ? 0.9 : 1.1; scale = Math.max(0.3, Math.min(3, scale*f)) }, {passive:false})

    const drawNetwork = () => {
      nx.clearRect(0, 0, nc.width, nc.height)
      nx.save()
      nx.translate(offsetX, offsetY)
      nx.scale(scale, scale)

      // Daha hızlı ve geniş hareket
      nodes.forEach(n => {
        n.x = n.ox + Math.sin(nt*0.5+n.ph)*12 + Math.cos(nt*0.3+n.ph*1.3)*6
        n.y = n.oy + Math.cos(nt*0.4+n.ph+1)*10 + Math.sin(nt*0.35+n.ph*0.8)*5
      })

      // Uzay yıldızları
      if (nt < 0.1) {
        (nc as any)._stars = Array.from({length: 120}, () => ({
          x: Math.random() * nc.width / scale,
          y: Math.random() * nc.height / scale,
          r: Math.random() * 1.2 + 0.2,
          ph: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.2
        }))
      }
      const stars = (nc as any)._stars || []
      stars.forEach((s: any) => {
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(nt * s.speed + s.ph))
        nx.beginPath(); nx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        nx.fillStyle = `rgba(255,255,255,${twinkle * 0.6})`; nx.fill()
      })

      // Nebula efekti
      const nebula = nx.createRadialGradient(nc.width/scale*0.3, nc.height/scale*0.4, 0, nc.width/scale*0.3, nc.height/scale*0.4, nc.width/scale*0.5)
      nebula.addColorStop(0, 'rgba(30,0,80,0.15)')
      nebula.addColorStop(0.5, 'rgba(0,30,80,0.08)')
      nebula.addColorStop(1, 'rgba(0,0,0,0)')
      nx.fillStyle = nebula; nx.fillRect(0, 0, nc.width/scale, nc.height/scale)

      // Izgara arka plan çizgileri
      nx.strokeStyle = 'rgba(0,196,140,0.04)'
      nx.lineWidth = 1
      for(let gx2 = 0; gx2 < nc.width/scale; gx2 += 60) {
        nx.beginPath(); nx.moveTo(gx2, 0); nx.lineTo(gx2, nc.height/scale); nx.stroke()
      }
      for(let gy2 = 0; gy2 < nc.height/scale; gy2 += 60) {
        nx.beginPath(); nx.moveTo(0, gy2); nx.lineTo(nc.width/scale, gy2); nx.stroke()
      }

      links.forEach(l => {
        const a = nodes[l.a], b = nodes[l.b]
        const pulse = l.shared ? 0.6+0.4*Math.sin(nt*1.5) : 0.25+0.15*Math.sin(nt*0.8+l.a)
        nx.beginPath(); nx.moveTo(a.x, a.y); nx.lineTo(b.x, b.y)
        nx.strokeStyle = l.shared ? `rgba(0,196,140,${pulse})` : `rgba(100,200,160,${pulse*0.5})`
        nx.lineWidth = l.shared ? l.w*1.5 : 1.2; nx.stroke()
        // Akan partiküller
        if (l.shared) {
          const t2 = (nt * 0.8) % 1
          const px = a.x + (b.x - a.x) * t2
          const py = a.y + (b.y - a.y) * t2
          nx.beginPath(); nx.arc(px, py, 3, 0, Math.PI*2)
          nx.fillStyle = 'rgba(0,255,160,0.9)'; nx.fill()
          const mx2 = (a.x+b.x)/2, my2 = (a.y+b.y)/2
          nx.beginPath(); nx.arc(mx2, my2, 2.5+Math.sin(nt*3), 0, Math.PI*2)
          nx.fillStyle = `rgba(0,196,140,${0.5+0.4*Math.sin(nt*2)})`; nx.fill()
        }
      })

      nodes.forEach((n, i) => {
        const isHov = hoveredNode === i
        const pulse = Math.sin(nt*1.5+n.ph)
        const r = n.r + (isHov ? 6 : 0) + (n.isSelf ? 2+Math.abs(Math.sin(nt*1.5))*3 : 0)
        
        // Dış hale (glow)
        if (n.isSelf) {
          const glow = nx.createRadialGradient(n.x, n.y, r, n.x, n.y, r+20)
          glow.addColorStop(0, 'rgba(0,196,140,0.3)')
          glow.addColorStop(1, 'rgba(0,196,140,0)')
          nx.beginPath(); nx.arc(n.x, n.y, r+20, 0, Math.PI*2); nx.fillStyle = glow; nx.fill()
        } else {
          const glow = nx.createRadialGradient(n.x, n.y, r, n.x, n.y, r+10)
          glow.addColorStop(0, n.color+'44')
          glow.addColorStop(1, 'rgba(0,0,0,0)')
          nx.beginPath(); nx.arc(n.x, n.y, r+10, 0, Math.PI*2); nx.fillStyle = glow; nx.fill()
        }

        // Dış çember
        if (i > 8) {
          nx.beginPath(); nx.arc(n.x, n.y, r+7, 0, Math.PI*2)
          nx.strokeStyle = 'rgba(255,255,255,0.15)'; nx.lineWidth = 1; nx.setLineDash([4,4]); nx.stroke(); nx.setLineDash([])
        }

        const grd = nx.createRadialGradient(n.x-r*.3, n.y-r*.3, 1, n.x, n.y, r)
        grd.addColorStop(0, n.color+'ff'); grd.addColorStop(1, n.color+'99')
        nx.beginPath(); nx.arc(n.x, n.y, r, 0, Math.PI*2); nx.fillStyle = grd; nx.fill()

        // Çerçeve
        nx.beginPath(); nx.arc(n.x, n.y, r, 0, Math.PI*2)
        nx.strokeStyle = n.isSelf ? `rgba(0,255,160,${0.7+0.3*pulse})` : `rgba(255,255,255,${0.2+0.1*pulse})`
        nx.lineWidth = n.isSelf ? 2.5 : 1.5; nx.stroke()

        if (isHov) {
          nx.beginPath(); nx.arc(n.x, n.y, r+4, 0, Math.PI*2)
          nx.strokeStyle = 'rgba(255,255,255,0.5)'; nx.lineWidth = 1.5; nx.stroke()
        }

        // Profil resmi veya baş harf
        if (i === 1) {
          // MD - mavi gradient avatar
          const ag = nx.createRadialGradient(n.x-2, n.y-2, 1, n.x, n.y, r-2)
          ag.addColorStop(0, '#60a5fa'); ag.addColorStop(1, '#1d4ed8')
          nx.beginPath(); nx.arc(n.x, n.y, r-2, 0, Math.PI*2); nx.fillStyle = ag; nx.fill()
          nx.fillStyle = '#fff'; nx.font = 'bold 10px DM Sans, sans-serif'
          nx.textAlign = 'center'; nx.textBaseline = 'middle'
          nx.fillText('MD', n.x, n.y-1)
        } else if (i === 2) {
          // SK - mor gradient avatar
          const ag = nx.createRadialGradient(n.x-2, n.y-2, 1, n.x, n.y, r-2)
          ag.addColorStop(0, '#c084fc'); ag.addColorStop(1, '#7c3aed')
          nx.beginPath(); nx.arc(n.x, n.y, r-2, 0, Math.PI*2); nx.fillStyle = ag; nx.fill()
          nx.fillStyle = '#fff'; nx.font = 'bold 9px DM Sans, sans-serif'
          nx.textAlign = 'center'; nx.textBaseline = 'middle'
          nx.fillText('SK', n.x, n.y-1)
        } else {
          nx.fillStyle = '#fff'
          nx.font = `${n.isSelf ? '700' : '600'} ${n.isSelf ? 12 : 10}px Pixelify Sans, monospace`
          nx.textAlign = 'center'; nx.textBaseline = 'middle'
          nx.fillText(n.label, n.x, n.y)
        }

        // İsim etiketi
        if (n.isSelf || isHov) {
          nx.fillStyle = n.isSelf ? 'rgba(0,255,160,0.9)' : 'rgba(255,255,255,0.8)'
          nx.font = `${n.isSelf ? '700' : '500'} ${n.isSelf ? 11 : 9}px DM Sans, sans-serif`
          nx.textAlign = 'center'; nx.textBaseline = 'top'
          nx.fillText(n.name.split(' ').slice(-1)[0], n.x, n.y + r + 4)
        }
      })

      nx.restore()
      nt += 0.018; raf = requestAnimationFrame(drawNetwork)
    }
    drawNetwork()
    nc.addEventListener('nodeHover', (e: any) => {
      const { x, y, node, idx } = e.detail
      setHoveredProfile({ x, y, node: nodeDataStatic[idx] || node })
    })
    nc.addEventListener('nodeLeave', () => setHoveredProfile(null))

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', sizeNC) }
  }, [])

  const openMiniChat = (av: string, name: string, color: string) => {
    setChatPerson({ av, name, color })
    setChatMsgs([{ me: false, text: 'Merhaba, sizinle iş birliği hakkında konuşmak isterim.' }])
    setMiniChatOpen(true)
  }

  const sendChatMsg = () => {
    if (!chatMsg.trim()) return
    setChatMsgs(p => [...p, { me: true, text: chatMsg }])
    setChatMsg('')
  }

  const filteredConns = connections.filter(c => {
    const matchesFilter = activeFilter === 'tumu' || c.cats.includes(activeFilter)
    const matchesSearch = !searchQ || c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.sub.toLowerCase().includes(searchQ.toLowerCase())
    return matchesFilter && matchesSearch
  })


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
        * { margin: 0; padding: 0; box-sizing: border-box; cursor: none !important; }
        :root { --g: #00c48c; --ink: #0a0a0a; --gray: #f2f2f0; --white: #fff; --border: rgba(0,0,0,0.07); }
        body { font-family: 'DM Sans', sans-serif; background: var(--gray); color: var(--ink); height: 100vh; overflow: hidden; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 18px; font-size: 13px; color: rgba(255,255,255,0.5); transition: all 0.2s; border-left: 2px solid transparent; cursor: pointer; }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
        .nav-item.active { color: var(--g); border-left-color: var(--g); background: rgba(0,196,140,0.07); font-weight: 600; }
        .chip { padding: 5px 12px; border: 1.5px solid var(--border); font-size: 11px; font-weight: 600; color: rgba(0,0,0,0.45); transition: all 0.2s; background: transparent; cursor: pointer; }
        .chip.on { border-color: var(--g); background: rgba(0,196,140,0.08); color: var(--g); }
        .rp-tab { flex: 1; padding: 11px 6px; font-size: 11px; font-weight: 600; color: rgba(0,0,0,0.4); text-align: center; border-bottom: 2px solid transparent; transition: all 0.2s; cursor: pointer; }
        .rp-tab.active { color: var(--g); border-bottom-color: var(--g); }
        .conn-item { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid rgba(0,0,0,0.04); transition: background 0.15s; }
        .conn-item:hover { background: rgba(0,0,0,0.02); }
        .msg-btn { width: 26px; height: 26px; background: var(--gray); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; cursor: pointer; }
        .msg-btn:hover { background: var(--g); border-color: var(--g); }
        .rec-btn { padding: 6px 14px; font-size: 11px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s; border: none; }
        .rec-btn.outline { background: transparent; border: 1.5px solid var(--border); color: rgba(0,0,0,0.5); }
        .rec-btn.outline:hover { border-color: var(--ink); color: var(--ink); }
        .rec-btn.primary { background: var(--ink); color: #fff; }
        .rec-btn.primary:hover { background: var(--g); color: var(--ink); }
        .rec-tag { background: rgba(0,0,0,0.05); color: rgba(0,0,0,0.5); font-size: 10px; padding: 2px 8px; font-weight: 500; }
        .pub-item { padding: 12px 14px; border-bottom: 1px solid rgba(0,0,0,0.04); }
        .mc-msg { max-width: 80%; padding: 8px 12px; font-size: 12px; line-height: 1.5; margin-bottom: 8px; }
        .mc-msg.other { background: rgba(0,0,0,0.05); color: var(--ink); border-radius: 0 8px 8px 8px; }
        .mc-msg.me { background: var(--g); color: var(--ink); border-radius: 8px 0 8px 8px; margin-left: auto; font-weight: 500; }
        .map-ctrl-btn { width: 32px; height: 32px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; font-family: 'Pixelify Sans', monospace; font-weight: 700; cursor: pointer; }
        .map-ctrl-btn:hover { background: rgba(0,196,140,0.3); border-color: var(--g); }
        .dd-item { padding: 8px 16px; font-size: 12px; font-weight: 500; color: rgba(0,0,0,0.6); transition: background 0.15s; cursor: pointer; }
        .dd-item:hover { background: var(--gray); }
        .dd-item.active { color: var(--g); font-weight: 700; background: rgba(0,196,140,0.04); }
        .nd-item { display: flex; align-items: flex-start; gap: 10px; padding: 11px 18px; border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer; }
        .nd-item:hover { background: #f8fffe; }
        .nd-item.new { background: linear-gradient(90deg,rgba(0,196,140,0.2) 0%,rgba(0,196,140,0.04) 50%,transparent 100%); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) { .sidebar { position: fixed; left: -220px; z-index: 200; } }
      `}</style>

      {/* CURSOR */}
      <svg ref={curRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 10 10">
        <rect x="0" y="0" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="4" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="0" y="8" width="2" height="2" fill="#00c48c"/>
        <rect x="2" y="2" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="4" width="2" height="2" fill="#00c48c"/>
        <rect x="4" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="6" width="2" height="2" fill="#00c48c"/>
        <rect x="6" y="8" width="2" height="2" fill="#00c48c"/>
        <rect x="8" y="10" width="2" height="2" fill="#00c48c"/>
      </svg>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', height: '100vh' }}>

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
                const isActive = '/ag' === item.href
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


        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

          {/* TOPBAR */}
          <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '16px', fontWeight: 700 }}>Akademik Ağ</div>

            {/* ARAMA */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
              <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Akademisyen, kurum veya alan ara..."
                style={{ width: '100%', border: '1.5px solid rgba(0,0,0,0.07)', padding: '7px 12px 7px 34px', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#f2f2f0', transition: 'border 0.2s' }}
              />
            </div>

            {/* FİLTRE */}
            <div style={{ position: 'relative' }}>
              <button className="chip on" onClick={() => setFilterOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{filterLabel}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {filterOpen && (
                <div style={{ position: 'absolute', top: 'calc(100%+6px)', left: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '160px', animation: 'fadeIn 0.15s ease' }}>
                  {filters.map((f, i) => (
                    <div key={f} className={`dd-item${activeFilter === f ? ' active' : ''}`} onClick={() => { setActiveFilter(f); setFilterLabel(filterLabels[i]); setFilterOpen(false) }}>
                      {filterLabels[i]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
              <div onClick={() => setNotifOpen(p => !p)} style={{ width: '32px', height: '32px', background: '#f2f2f0', border: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '2px', cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ee5533', color: '#fff', fontSize: '9px', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>7</span>
              </div>

              {notifOpen && (
                <div style={{ position: 'absolute', top: '46px', right: 0, width: '280px', background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 999, animation: 'fadeIn 0.15s ease' }}>
                  <div style={{ padding: '12px 18px 8px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', fontWeight: 700 }}>Bildirimler</span>
                    <span style={{ fontSize: '10px', color: '#00c48c', fontWeight: 600 }}>7 okunmamış</span>
                  </div>
                  {[
                    { text: '<strong>Prof. Mehmet Demir</strong> bağlantı isteği gönderdi', time: '1 saat önce', isNew: true },
                    { text: 'Ağınızda <strong>3 yeni akademisyen</strong>', time: '5 saat önce', isNew: true },
                    { text: 'Ortak yayın önerisi: <strong>Dr. Okan Aydın</strong>', time: '2 gün önce', isNew: false },
                  ].map((n, i) => (
                    <div key={i} className={`nd-item${n.isNew ? ' new' : ''}`}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.isNew ? '#00c48c' : 'rgba(0,0,0,0.15)', flexShrink: 0, marginTop: '5px' }}/>
                      <div>
                        <div style={{ fontSize: '12px', color: '#0a0a0a', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: n.text }}/>
                        <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', marginTop: '2px' }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(0,0,0,0.07)', fontSize: '11px', color: '#00c48c', fontWeight: 600, cursor: 'pointer' }}>Tümünü gör →</div>
                </div>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', overflow: 'hidden', minHeight: 0 }}>

            {/* AĞ HARİTASI */}
            <div style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at center, #0f1f17 0%, #040d08 60%, #000 100%)' }}>
              <canvas ref={ncRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}/>

              {/* STATS */}
              <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10, display: 'flex', gap: '8px' }}>
                {[{n:'18', l:'Bağlantı', c:'#00c48c'},{n:'6.240', l:'Ağ Üyesi', c:'#fff'},{n:'47', l:'Ortak Yayın', c:'#fcd34d'}].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', backdropFilter: 'blur(4px)' }}>
                    <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '16px', fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* KONTROLLER */}
              <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 10 }}>
                <div className="map-ctrl-btn">+</div>
                <div className="map-ctrl-btn">−</div>
                <div className="map-ctrl-btn" style={{ fontSize: '12px' }}>⌂</div>
              </div>
            </div>

            {/* SAĞ PANEL */}
            <div style={{ borderLeft: '1px solid rgba(0,0,0,0.07)', background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}>
                {['Bağlantılar', 'Öneriler', 'Yayınlar'].map((t, i) => (
                  <div key={i} className={`rp-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>

                {/* BAĞLANTILAR */}
                {activeTab === 0 && (
                  <div>
                    {filteredConns.map((c, i) => (
                      <div key={i} className="conn-item">
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', fontFamily: "'Pixelify Sans', monospace", position: 'relative', flexShrink: 0 }}>
                          {c.av}
                          {c.online && <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '9px', height: '9px', background: '#00c48c', borderRadius: '50%', border: '2px solid #fff' }}/>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a' }}>{c.name}</div>
                          <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)', marginTop: '1px' }}>{c.sub}</div>
                        </div>
                        <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '11px', fontWeight: 700, color: '#00c48c', flexShrink: 0 }}>{c.score}</div>
                        <div className="msg-btn" onClick={() => { openMiniChat(c.av, c.name, c.color) }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ÖNERİLER */}
                {activeTab === 1 && (
                  <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(0,196,140,0.04)', borderBottom: '1px solid rgba(0,196,140,0.1)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#00c48c' }}>🤖 YZ Önerileri · Profilinize göre</div>
                    </div>
                    {recommendations.map((r, i) => (
                      <div key={i} style={{ padding: '12px 14px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', fontFamily: "'Pixelify Sans', monospace", flexShrink: 0 }}>{r.av}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a' }}>{r.name}</div>
                            <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)' }}>{r.sub}</div>
                          </div>
                          <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '13px', fontWeight: 700, color: '#00c48c' }}>{r.score}</div>
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', marginBottom: '8px', lineHeight: 1.5 }}>{r.reason}</div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {r.tags.map((t, j) => <span key={j} className="rec-tag">{t}</span>)}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="rec-btn outline">Profil</button>
                          <button className={`rec-btn primary${connectedCards.includes(i) ? ' connected' : ''}`}
                            style={connectedCards.includes(i) ? { background: 'rgba(0,196,140,0.1)', color: '#00c48c', border: '1px solid rgba(0,196,140,0.2)' } : {}}
                            onClick={() => setConnectedCards(p => [...p, i])}>
                            {connectedCards.includes(i) ? '✓ Bağlandı' : 'Bağlan'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* YAYINLAR */}
                {activeTab === 2 && (
                  <div>
                    {publications.map((p, i) => (
                      <div key={i} className="pub-item">
                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a', marginBottom: '6px', lineHeight: 1.4 }}>{p.title}</div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', color: '#00c48c', fontWeight: 600 }}>{p.journal}</span>
                          <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)' }}>{p.year}</span>
                          {p.q1 && <span style={{ background: 'rgba(0,196,140,0.1)', color: '#008a64', fontSize: '9px', padding: '2px 6px', fontWeight: 600 }}>Q1</span>}
                          {p.ortak && <span style={{ background: 'rgba(99,102,241,0.1)', color: '#4338ca', fontSize: '9px', padding: '2px 6px', fontWeight: 600 }}>Ortak</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOVER PROFİL KARTI */}
      {hoveredProfile && (
        <div style={{
          position: 'fixed',
          left: `${hoveredProfile.x}px`,
          top: `${hoveredProfile.y}px`,
          width: '220px',
          background: 'rgba(10,10,20,0.95)',
          border: `1px solid ${hoveredProfile.node.color}44`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${hoveredProfile.node.color}22`,
          zIndex: 9998,
          backdropFilter: 'blur(12px)',
          animation: 'fadeIn 0.15s ease',
          pointerEvents: 'none',
        }}>
          {/* Üst renkli şerit */}
          <div style={{ height: '3px', background: `linear-gradient(90deg, ${hoveredProfile.node.color}, transparent)` }}/>
          <div style={{ padding: '14px' }}>
            {/* Avatar + isim */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${hoveredProfile.node.color}dd, ${hoveredProfile.node.color}66)`,
                border: `2px solid ${hoveredProfile.node.color}88`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700, color: '#fff',
                fontFamily: "'Pixelify Sans', monospace", flexShrink: 0,
                boxShadow: `0 0 12px ${hoveredProfile.node.color}44`
              }}>
                {hoveredProfile.node.label}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{hoveredProfile.node.name}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{hoveredProfile.node.sub}</div>
              </div>
            </div>
            {/* Uyum skoru */}
            {hoveredProfile.node.score && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Uyum Skoru</span>
                <span style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '16px', fontWeight: 700, color: hoveredProfile.node.color }}>{hoveredProfile.node.score}</span>
              </div>
            )}
            {/* Skor bar */}
            {hoveredProfile.node.score && (
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', marginBottom: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: hoveredProfile.node.score, background: `linear-gradient(90deg, ${hoveredProfile.node.color}, ${hoveredProfile.node.color}88)`, transition: 'width 0.5s ease' }}/>
              </div>
            )}
            {/* Yayın sayısı */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '14px', fontWeight: 700, color: hoveredProfile.node.color }}>{hoveredProfile.node.pub}</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yayın</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Pixelify Sans', monospace", fontSize: '14px', fontWeight: 700, color: '#fff' }}>{hoveredProfile.node.tag}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MİNİ CHAT */}
      {miniChatOpen && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '280px', background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 9000, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ background: '#0a0a0a', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: chatPerson.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', fontFamily: "'Pixelify Sans', monospace", flexShrink: 0 }}>{chatPerson.av}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{chatPerson.name}</div>
              <div style={{ fontSize: '10px', color: '#00c48c' }}>● Çevrimiçi</div>
            </div>
            <button onClick={() => setMiniChatOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ height: '180px', overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {chatMsgs.map((m, i) => (
              <div key={i} className={`mc-msg ${m.me ? 'me' : 'other'}`}>{m.text}</div>
            ))}
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.07)', padding: '8px' }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChatMsg()}
              placeholder="Mesaj..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', padding: '4px 8px' }}
            />
            <button onClick={sendChatMsg} style={{ background: '#00c48c', border: 'none', padding: '6px 10px', cursor: 'pointer' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
