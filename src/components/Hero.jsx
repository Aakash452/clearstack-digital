import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const canvasRef = useRef(null)
  const heroRef = useRef(null)
  const badgeRef = useRef(null)
  const headingRef = useRef(null)
  const subtextRef = useRef(null)
  const credRef = useRef(null)
  const btnsRef = useRef(null)
  const imageRef = useRef(null)
  const scrollIndRef = useRef(null)

  /* ── Three.js particle field ── */
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile || !canvasRef.current) return

    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    camera.position.z = 5

    const COUNT = 120
    const positions = new Float32Array(COUNT * 3)
    const velocities = []
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      velocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: 0,
      })
    }

    const dotGeo = new THREE.BufferGeometry()
    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const dotMat = new THREE.PointsMaterial({
      color: 0x378ADD,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })
    const dots = new THREE.Points(dotGeo, dotMat)
    scene.add(dots)

    /* Connection lines geometry — rebuilt each frame */
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x378ADD,
      transparent: true,
      opacity: 0.15,
    })

    let mouse = { x: 0, y: 0 }
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    const lineObjects = []
    const MAX_LINES = 200

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)

      const pos = dotGeo.attributes.position.array
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     += velocities[i].x
        pos[i * 3 + 1] += velocities[i].y
        if (pos[i * 3] > 6)  pos[i * 3] = -6
        if (pos[i * 3] < -6) pos[i * 3] = 6
        if (pos[i * 3 + 1] > 4)  pos[i * 3 + 1] = -4
        if (pos[i * 3 + 1] < -4) pos[i * 3 + 1] = 4
      }
      dotGeo.attributes.position.needsUpdate = true

      /* Parallax offset */
      dots.position.x = mouse.x * -0.3
      dots.position.y = mouse.y * -0.3

      /* Remove old lines */
      lineObjects.forEach((l) => scene.remove(l))
      lineObjects.length = 0

      /* Draw new lines */
      let lineCount = 0
      for (let i = 0; i < COUNT && lineCount < MAX_LINES; i++) {
        for (let j = i + 1; j < COUNT && lineCount < MAX_LINES; j++) {
          const dx = pos[i * 3] - pos[j * 3]
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 1.8) {
            const lGeo = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(pos[i * 3] + dots.position.x, pos[i * 3 + 1] + dots.position.y, 0),
              new THREE.Vector3(pos[j * 3] + dots.position.x, pos[j * 3 + 1] + dots.position.y, 0),
            ])
            const line = new THREE.Line(lGeo, lineMat)
            scene.add(line)
            lineObjects.push(line)
            lineCount++
          }
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      dotGeo.dispose()
      dotMat.dispose()
      lineMat.dispose()
    }
  }, [])

  /* ── GSAP entrance animation ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const words = headingRef.current?.querySelectorAll('.word')
    const tl = gsap.timeline({ delay: 0.15 })

    tl.fromTo(badgeRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.1
    )
    if (words?.length) {
      tl.fromTo(words,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 }, 0.2
      )
    }
    tl.fromTo(subtextRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.55
    )
    tl.fromTo(credRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.7
    )
    tl.fromTo(btnsRef.current?.children || [],
      { opacity: 0, scale: 0.9, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1 }, 0.8
    )
    if (imageRef.current) {
      tl.fromTo(imageRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' }, 0.6
      )
    }
  }, [])

  /* ── Scroll: parallax image + fade scroll indicator ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }
    if (scrollIndRef.current) {
      gsap.to(scrollIndRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: '80px top',
          end: '160px top',
          scrub: true,
        },
      })
    }
  }, [])

  const wrapWords = (text) =>
    text.split(' ').map((w, i) => (
      <span key={i} className="word" style={{ display: 'inline-block', opacity: 0 }}>
        {w}&nbsp;
      </span>
    ))

  return (
    <section ref={heroRef} style={styles.section}>
      {/* Three.js canvas */}
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.inner} className="hero-inner">
        {/* Left */}
        <div style={styles.left}>
          <div ref={badgeRef} style={{ opacity: 0 }}>
            <span className="badge-pill">
              <span style={styles.locDot} />
              Norman, OK — Local Business Specialists
            </span>
          </div>

          <h1 ref={headingRef} className="display-heading" style={styles.h1}>
            <span style={styles.h1Line}>{wrapWords('Websites, Systems & AI')}</span>
            <span style={{ ...styles.h1Line, display: 'block' }}>
              <span className="word" style={{ display: 'inline-block', opacity: 0 }}>that&nbsp;</span>
              <em className="word" style={{ color: 'var(--blue-accent)', fontStyle: 'italic', display: 'inline-block', opacity: 0 }}>work for you</em>
            </span>
          </h1>

          <p ref={subtextRef} style={{ ...styles.subtext, opacity: 0 }}>
            We build professional web presence and intelligent automation tools so your business
            runs smarter — even when you're not at the desk.
          </p>

          <p ref={credRef} style={{ ...styles.cred, opacity: 0 }}>
            <span style={styles.credItem}>MS Computer Science</span>
            <span style={styles.credDivider}>·</span>
            <span style={styles.credItem}>University of Oklahoma</span>
            <span style={styles.credDivider}>·</span>
            <span style={styles.credItem}>AI Research</span>
          </p>

          <div ref={btnsRef} style={styles.btns}>
            <a href="#projects" className="btn-primary" style={{ opacity: 0 }}
              onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}>
              View Our Work
            </a>
            <a href="#contact" className="btn-secondary" style={{ opacity: 0 }}
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Book a Free Call
            </a>
          </div>
        </div>

        {/* Right — visual mockup */}
        <div ref={imageRef} className="hero-right" style={{ ...styles.right, opacity: 0 }}>
          <HeroVisual />
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndRef} style={styles.scrollInd}>
        <ChevronDown />
        <span style={styles.scrollText}>Scroll to explore</span>
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <div style={vStyles.wrap}>
      {/* Browser chrome mockup */}
      <div style={vStyles.browser}>
        <div style={vStyles.browserBar}>
          <span style={vStyles.dot1} />
          <span style={vStyles.dot2} />
          <span style={vStyles.dot3} />
          <span style={vStyles.urlBar}>clearstackdigital.com</span>
        </div>
        <div style={vStyles.browserBody}>
          {/* Simulated website header */}
          <div style={vStyles.siteNav} />
          <div style={vStyles.siteHero}>
            <div style={vStyles.siteHeroText}>
              <div style={vStyles.lineXL} />
              <div style={vStyles.lineL} />
              <div style={vStyles.lineSm} />
              <div style={vStyles.btnRow}>
                <div style={vStyles.fakeBtnPrimary} />
                <div style={vStyles.fakeBtnSecondary} />
              </div>
            </div>
          </div>
          {/* Cards row */}
          <div style={vStyles.cardsRow}>
            {[0,1,2].map(i => (
              <div key={i} style={vStyles.card}>
                <div style={vStyles.cardIcon} />
                <div style={vStyles.cardLine1} />
                <div style={vStyles.cardLine2} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating metric card */}
      <div style={vStyles.floatCard}>
        <div style={vStyles.floatLabel}>Monthly Leads</div>
        <div style={vStyles.floatNum}>+247%</div>
        <div style={vStyles.floatSpark}>
          {[20,45,30,60,40,80,65,90].map((h,i) => (
            <span key={i} style={{ ...vStyles.sparkBar, height: `${h * 0.4}px`, background: i > 5 ? 'var(--blue)' : 'rgba(55,138,221,0.3)' }} />
          ))}
        </div>
      </div>

      {/* AI badge */}
      <div style={vStyles.aiBadge}>
        <span style={vStyles.aiPulse} />
        AI Active
      </div>
    </div>
  )
}

const vStyles = {
  wrap: { position: 'relative', width: '100%', maxWidth: '520px', marginLeft: 'auto' },
  browser: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '0.5px solid rgba(255,255,255,0.15)',
    boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
  },
  browserBar: {
    background: 'rgba(255,255,255,0.08)',
    padding: '0.55rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
  },
  dot1: { width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', flexShrink: 0 },
  dot2: { width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E', flexShrink: 0 },
  dot3: { width: 10, height: 10, borderRadius: '50%', background: '#28C840', flexShrink: 0 },
  urlBar: {
    marginLeft: '0.5rem',
    flex: 1,
    textAlign: 'center',
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '6px',
    padding: '0.2rem 0.6rem',
    fontFamily: 'var(--font-sans)',
  },
  browserBody: { background: 'var(--navy)', padding: '1rem' },
  siteNav: { height: '28px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', marginBottom: '1rem' },
  siteHero: { marginBottom: '1rem' },
  siteHeroText: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  lineXL: { height: '12px', width: '72%', background: 'rgba(255,255,255,0.25)', borderRadius: '4px' },
  lineL:  { height: '10px', width: '55%', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' },
  lineSm: { height: '7px', width: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '0.25rem' },
  btnRow: { display: 'flex', gap: '0.5rem', marginTop: '0.6rem' },
  fakeBtnPrimary: { height: '24px', width: '80px', background: 'var(--blue)', borderRadius: '20px' },
  fakeBtnSecondary: { height: '24px', width: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '0.5px solid rgba(255,255,255,0.2)' },
  cardsRow: { display: 'flex', gap: '0.5rem' },
  card: { flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.6rem', border: '0.5px solid rgba(255,255,255,0.08)' },
  cardIcon: { width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(55,138,221,0.3)', marginBottom: '0.4rem' },
  cardLine1: { height: '6px', width: '80%', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', marginBottom: '0.25rem' },
  cardLine2: { height: '5px', width: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' },
  floatCard: {
    position: 'absolute',
    bottom: '-24px',
    left: '-32px',
    background: 'rgba(4,44,83,0.95)',
    border: '0.5px solid rgba(55,138,221,0.35)',
    borderRadius: '12px',
    padding: '0.9rem 1.1rem',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
    minWidth: '160px',
  },
  floatLabel: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sans)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  floatNum: { fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: '#28C840', letterSpacing: '-0.02em' },
  floatSpark: { display: 'flex', alignItems: 'flex-end', gap: '3px', marginTop: '0.5rem', height: '36px' },
  sparkBar: { width: '6px', borderRadius: '2px', display: 'block', transition: 'height 0.3s ease' },
  aiBadge: {
    position: 'absolute',
    top: '-16px',
    right: '-16px',
    background: 'rgba(127,119,221,0.18)',
    border: '0.5px solid rgba(175,169,236,0.4)',
    borderRadius: '20px',
    padding: '0.35rem 0.8rem',
    fontSize: '0.72rem',
    color: '#AFA9EC',
    fontFamily: 'var(--font-sans)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backdropFilter: 'blur(8px)',
  },
  aiPulse: {
    width: '7px', height: '7px',
    borderRadius: '50%',
    background: '#AFA9EC',
    boxShadow: '0 0 0 3px rgba(175,169,236,0.25)',
    animation: 'pulse 2s ease-in-out infinite',
    display: 'inline-block',
  },
}

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={{ animation: 'bounce 2s ease-in-out infinite' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const styles = {
  section: {
    position: 'relative',
    minHeight: '100vh',
    background: 'var(--navy)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '8rem 2rem 5rem',
    display: 'grid',
    gridTemplateColumns: '55fr 45fr',
    alignItems: 'center',
    gap: '4rem',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  locDot: {
    width: '7px', height: '7px',
    borderRadius: '50%',
    background: 'var(--blue)',
    display: 'inline-block',
    flexShrink: 0,
  },
  h1: {
    fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
    color: '#fff',
    maxWidth: '560px',
  },
  h1Line: { display: 'block' },
  subtext: {
    fontSize: '1rem',
    fontWeight: 300,
    color: 'var(--blue-accent)',
    maxWidth: '440px',
    lineHeight: 1.7,
  },
  cred: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.45)',
    fontFamily: 'var(--font-sans)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  credItem: { whiteSpace: 'nowrap' },
  credDivider: { color: 'rgba(255,255,255,0.25)', fontSize: '1rem' },
  btns: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  right: { display: 'flex', justifyContent: 'flex-end' },
  scrollInd: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
  },
  scrollText: { fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' },
}

/* Inject keyframes */
const kfStyle = document.createElement('style')
kfStyle.textContent = `
@keyframes bounce {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 3px rgba(175,169,236,0.25); }
  50% { box-shadow: 0 0 0 6px rgba(175,169,236,0.1); }
}
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr !important; }
}
`
document.head.appendChild(kfStyle)
