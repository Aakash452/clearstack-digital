import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const credentials = [
  { text: 'MS Computer Science — Univ. of Oklahoma (2026)', color: '#6ee87a' },
  { text: 'Graduate Research Assistant — AI & ML Fine-Tuning', color: '#6ee87a' },
  { text: 'Full Stack Developer — 4+ years, US + India', color: '#6ee87a' },
  { text: 'Built CRM, E-Commerce + AI systems from scratch', color: '#6ee87a' },
]

const techStack = ['React', 'Python', 'SQL', 'AI/ML', 'Node.js', 'PocketBase']

export default function About() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    if (labelRef.current) {
      gsap.fromTo(labelRef.current, { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 85%', once: true } })
    }

    const heading = sectionRef.current?.querySelector('.about-h2')
    if (heading) {
      gsap.fromTo(heading, { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true } })
    }

    const leftContent = sectionRef.current?.querySelectorAll('.about-body-el')
    if (leftContent?.length) {
      gsap.fromTo(leftContent, { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } })
    }

    /* Card flip-in */
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, rotateY: 15, perspective: 1000 },
        { opacity: 1, rotateY: 0, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 75%', once: true } }
      )
    }
  }, [])

  return (
    <section ref={sectionRef} style={styles.section}>
      <div className="container section-pad">
        <div style={styles.grid} className="about-grid">
          {/* Left */}
          <div style={styles.left}>
            <span ref={labelRef} className="section-label on-light" style={{ opacity: 0 }}>Why ClearStack</span>
            <h2 className="display-heading about-h2 about-body-el" style={styles.h2}>
              Not a generic agency
            </h2>
            <p className="about-body-el" style={styles.body}>
              Most web agencies hand your project to a junior freelancer and deliver a template.
              We don't. Every system we build is designed from the ground up by a graduate researcher
              with real AI and engineering experience — the same thinking used to build enterprise
              software, applied to your local business.
            </p>
            <blockquote className="about-body-el" style={styles.quote}>
              "Enterprise-level engineering. Local business prices."
            </blockquote>
            <p className="about-body-el" style={styles.bodySecond}>
              Whether you need a fast-loading website, a custom CRM, or a fully autonomous marketing agent,
              we bring the rigor of serious software engineering to every project — no matter the size.
            </p>
          </div>

          {/* Right — credential card */}
          <div ref={cardRef} style={{ ...styles.credCard, opacity: 0 }}>
            {/* Avatar row */}
            <div style={credStyles.avatarRow}>
              <div style={credStyles.avatar}>BP</div>
              <div>
                <div style={credStyles.name}>Bhagyesh Parmar</div>
                <div style={credStyles.title}>Founder & Lead Developer</div>
              </div>
            </div>

            <div style={credStyles.divider} />

            {/* Credentials */}
            <div style={credStyles.credList}>
              {credentials.map((c, i) => (
                <div key={i} style={credStyles.credItem}>
                  <span style={credStyles.checkmark}>✓</span>
                  <span style={credStyles.credText}>{c.text}</span>
                </div>
              ))}
            </div>

            <div style={credStyles.divider} />

            {/* Tech stack */}
            <div>
              <div style={credStyles.stackLabel}>Tech Stack</div>
              <div style={credStyles.stackTags}>
                {techStack.map((tech) => (
                  <span key={tech} style={credStyles.stackTag}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: { background: '#fff' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' },
  left: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  h2: {
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    color: 'var(--navy)',
    marginTop: '0.5rem',
  },
  body: {
    fontSize: '0.95rem',
    fontWeight: 300,
    color: 'var(--text)',
    lineHeight: 1.8,
    opacity: 0,
  },
  bodySecond: {
    fontSize: '0.92rem',
    fontWeight: 300,
    color: 'var(--muted)',
    lineHeight: 1.75,
    opacity: 0,
  },
  quote: {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
    color: 'var(--navy)',
    borderLeft: '4px solid var(--blue)',
    paddingLeft: '1.25rem',
    lineHeight: 1.5,
    opacity: 0,
  },
  credCard: {
    background: 'var(--navy)',
    borderRadius: '20px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
}

const credStyles = {
  avatarRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  avatar: {
    width: '52px', height: '52px',
    borderRadius: '50%',
    background: 'var(--blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    color: '#fff',
    flexShrink: 0,
    letterSpacing: '-0.02em',
  },
  name: { fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.02em' },
  title: { fontSize: '0.78rem', color: 'rgba(181,212,244,0.65)', fontFamily: 'var(--font-sans)', fontWeight: 300 },
  divider: { height: '0.5px', background: 'rgba(255,255,255,0.1)' },
  credList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  credItem: { display: 'flex', alignItems: 'flex-start', gap: '0.6rem' },
  checkmark: { color: '#6ee87a', fontWeight: 600, fontSize: '0.8rem', flexShrink: 0, marginTop: '2px' },
  credText: { fontSize: '0.85rem', fontWeight: 300, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-sans)', lineHeight: 1.5 },
  stackLabel: { fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem', fontFamily: 'var(--font-sans)' },
  stackTags: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
  stackTag: {
    padding: '0.25rem 0.65rem',
    background: 'rgba(55,138,221,0.15)',
    border: '0.5px solid rgba(55,138,221,0.3)',
    borderRadius: '20px',
    fontSize: '0.75rem',
    color: 'var(--blue-accent)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 400,
  },
}

const aboutStyle = document.createElement('style')
aboutStyle.textContent = `
  @media (max-width: 900px) {
    .about-grid { grid-template-columns: 1fr !important; }
  }
`
document.head.appendChild(aboutStyle)
