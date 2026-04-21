import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 10,  suffix: '+',     label: 'Projects Delivered' },
  { value: 4,   suffix: '+',     label: 'Years Experience' },
  { value: 100, suffix: '%',     label: 'Client Satisfaction' },
  { value: 7,   suffix: ' Days', label: 'Average Turnaround' },
]

export default function StatsBar() {
  const sectionRef = useRef(null)
  const numRefs = useRef([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Set final values immediately so they're never stuck at 0 */
    numRefs.current.forEach((el, i) => {
      if (el) el.textContent = stats[i].value + stats[i].suffix
    })

    if (prefersReduced) return

    /* Fade-in the columns */
    const cols = sectionRef.current?.querySelectorAll('.stat-col')
    if (cols?.length) {
      gsap.fromTo(cols,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        }
      )
    }

    /* Counter animation — gsap.to(proxy, toVars) — correct 2-arg form */
    numRefs.current.forEach((el, i) => {
      if (!el) return
      const stat = stats[i]
      const proxy = { val: 0 }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(proxy, {
            val: stat.value,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate() {
              el.textContent = Math.round(proxy.val) + stat.suffix
            },
            onComplete() {
              el.textContent = stat.value + stat.suffix
            },
          })
        },
      })
    })
  }, [])

  return (
    <section ref={sectionRef} style={styles.section}>
      <div style={styles.grid} className="stats-grid">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="stat-col"
            style={{
              ...styles.col,
              borderRight: i < stats.length - 1 ? '0.5px solid rgba(4,44,83,0.12)' : 'none',
            }}
          >
            <div style={styles.number}>
              <span ref={(el) => (numRefs.current[i] = el)}>
                {stat.value}{stat.suffix}
              </span>
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
