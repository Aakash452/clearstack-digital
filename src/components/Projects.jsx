import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    name: 'Homex Renovations',
    url: 'https://homexok.com',
    type: 'Business Website',
    desc: 'A conversion-focused website for a local home renovation company in Norman, OK. Built mobile-first with lead generation forms, service showcase, and Google Maps integration.',
    tags: ['Web Design', 'Lead Gen', 'Mobile-First', 'SEO'],
    color: '#1a3a5c',
  },
  {
    name: 'Startup Sahay',
    url: 'https://startupsahay.com',
    type: 'Corporate Website',
    desc: 'Multi-service corporate site for a business consultancy serving entrepreneurs across India. Features a multi-page structure, service catalog, and professional brand identity.',
    tags: ['Corporate Site', 'Multi-Service', 'Branding', 'React'],
    color: '#0d2b45',
  },
  {
    name: 'C-Checkers',
    url: 'https://c-checkers.com',
    type: 'E-Commerce + Inventory',
    desc: 'Full-stack e-commerce and inventory management platform built with React and PocketBase. Handles product listings, real-time stock tracking, and customer checkout flows.',
    tags: ['React', 'PocketBase', 'E-Commerce', 'Full Stack'],
    color: '#1e3a5f',
  }
]

export default function Projects() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const rowRefs = useRef([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    if (labelRef.current) {
      gsap.fromTo(labelRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 85%', once: true } }
      )
    }

    const heading = sectionRef.current?.querySelector('.projects-h2')
    if (heading) {
      gsap.fromTo(heading,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true } }
      )
    }

    rowRefs.current.forEach((row, i) => {
      if (!row) return
      const isEven = i % 2 === 0
      const imgEl = row.querySelector('.proj-img')
      const detailEl = row.querySelector('.proj-detail')

      gsap.fromTo(imgEl,
        { opacity: 0, x: isEven ? -60 : 60 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 75%', once: true } }
      )
      gsap.fromTo(detailEl,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 75%', once: true } }
      )
    })
  }, [])

  return (
    <section id="projects" ref={sectionRef} style={styles.section}>
      <div className="container section-pad">
        <span ref={labelRef} className="section-label on-light" style={{ opacity: 0 }}>Our Work</span>
        <h2 className="display-heading projects-h2" style={styles.h2}>
          Real projects, live today
        </h2>
        <p style={styles.subtext}>
          Every site we ship is custom-built, performance-tuned, and live in the real world.
        </p>

        <div style={styles.rows}>
          {projects.map((proj, i) => {
            const isEven = i % 2 === 0
            return (
              <div
                key={proj.name}
                ref={(el) => (rowRefs.current[i] = el)}
                className="proj-row"
                style={{ ...styles.row, flexDirection: isEven ? 'row' : 'row-reverse' }}
              >
                {/* Image side */}
                <div className="proj-img" style={{ ...styles.imgWrap, opacity: 0 }}>
                  <div style={{ ...styles.imgInner, background: proj.color }}>
                    <img
                      src={`https://api.microlink.io/?url=${encodeURIComponent(proj.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                      alt={`${proj.name} screenshot`}
                      style={styles.img}
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <div style={styles.imgOverlay} />
                    <span style={styles.liveBadge}>
                      <span style={styles.greenDot} />
                      Live
                    </span>
                  </div>
                </div>

                {/* Details side */}
                <div className="proj-detail" style={{ ...styles.detail, opacity: 0 }}>
                  <span style={styles.typeLabel}>{proj.type}</span>
                  <h3 className="display-heading" style={styles.projName}>{proj.name}</h3>
                  <p style={styles.projDesc}>{proj.desc}</p>
                  <div style={styles.tags}>
                    {proj.tags.map((tag) => (
                      <span key={tag} style={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.visitLink}
                    data-hover
                  >
                    Visit site ↗
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: { background: '#fff' },
  h2: {
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    color: 'var(--navy)',
    marginTop: '1rem',
    marginBottom: '0.75rem',
  },
  subtext: {
    fontSize: '0.95rem',
    fontWeight: 300,
    color: 'var(--muted)',
    marginBottom: '3rem',
  },
  rows: { display: 'flex', flexDirection: 'column', gap: '5rem' },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '3.5rem',
  },
  imgWrap: { flex: '0 0 60%', maxWidth: '60%' },
  imgInner: {
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: '16/9',
    border: '0.5px solid rgba(4,44,83,0.15)',
    transition: 'transform 400ms ease',
    cursor: 'default',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top',
    display: 'block',
  },
  imgOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(transparent, rgba(4,44,83,0.6))',
    pointerEvents: 'none',
  },
  liveBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.3rem 0.75rem',
    background: 'rgba(4,44,83,0.85)',
    backdropFilter: 'blur(8px)',
    border: '0.5px solid rgba(255,255,255,0.2)',
    borderRadius: '20px',
    fontSize: '0.72rem',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
  },
  greenDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#28C840', display: 'inline-block' },
  detail: { flex: '0 0 40%', maxWidth: '40%', display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  typeLabel: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: 'var(--blue)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: 'var(--font-sans)',
  },
  projName: {
    fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
    color: 'var(--navy)',
    lineHeight: 1.2,
  },
  projDesc: {
    fontSize: '0.9rem',
    fontWeight: 300,
    color: 'var(--muted)',
    lineHeight: 1.75,
  },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
  tag: {
    padding: '0.25rem 0.65rem',
    background: 'rgba(4,44,83,0.07)',
    border: '0.5px solid rgba(4,44,83,0.15)',
    borderRadius: '20px',
    fontSize: '0.72rem',
    color: 'var(--blue)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
  },
  visitLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: 'var(--blue)',
    fontFamily: 'var(--font-sans)',
    transition: 'color 200ms ease',
    borderBottom: '1px solid transparent',
    paddingBottom: '1px',
    width: 'fit-content',
  },
}

const projStyle = document.createElement('style')
projStyle.textContent = `
  .proj-img > div:hover { transform: scale(1.02) !important; }
  a[style*="var(--blue)"]:hover { border-bottom-color: var(--blue) !important; }
  @media (max-width: 900px) {
    .proj-row { flex-direction: column !important; }
    .proj-img, .proj-detail { max-width: 100% !important; flex: 1 1 100% !important; }
  }
`
document.head.appendChild(projStyle)
