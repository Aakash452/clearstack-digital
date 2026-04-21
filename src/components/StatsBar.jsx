import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 15, suffix: '+', label: 'Projects Delivered' },
  { value: 4,  suffix: '',  label: 'Years Experience' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
  { value: 48,  suffix: 'h', label: 'Average Turnaround' },
]

export default function StatsBar() {
  const sectionRef = useRef(null)
  const numRefs = useRef([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    numRefs.current.forEach((el, i) => {
      if (!el) return
      const stat = stats[i]

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (prefersReduced) {
            el.textContent = stat.value + stat.suffix
            return
          }
          gsap.fromTo(
            { val: 0 },
            {
              val: stat.value,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate() {
                el.textContent = Math.round(this.targets()[0].val) + stat.suffix
              },
            }
          )
        },
      })
    })

    if (!prefersReduced && sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.stat-col'),
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      )
    }
  }, [])

  return (
    <section ref={sectionRef} style={styles.section}>
      <div style={styles.grid}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-col" style={{ ...styles.col, borderRight: i < stats.length - 1 ? '0.5px solid rgba(4,44,83,0.12)' : 'none' }}>
            <div style={styles.number}>
              <span ref={(el) => (numRefs.current[i] = el)}>0{stat.suffix}</span>
            </div>
            <div style={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

const styles = {
  section: {
    background: '#fff',
    width: '100%',
    borderTop: '0.5px solid rgba(4,44,83,0.08)',
    borderBottom: '0.5px solid rgba(4,44,83,0.08)',
  },
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '1rem',
    opacity: 0,
  },
  number: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    color: 'var(--navy)',
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  label: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.72rem',
    fontWeight: 300,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textAlign: 'center',
  },
}

const style = document.createElement('style')
style.textContent = `
  @media (max-width: 640px) {
    .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
  }
`
document.head.appendChild(style)
