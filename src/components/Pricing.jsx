import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const bundles = [
  {
    name: 'Starter Pack',
    price: '$600',
    priceSub: 'one-time',
    tagline: 'Launch your brand online fast.',
    includes: ['Website Design', 'Logo Design'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Growth Pack',
    price: '$2,200',
    priceSub: '+ $499/mo',
    tagline: 'Everything you need to grow online.',
    includes: ['Website Design', 'E-Commerce System', 'AI Chatbot', 'Social Media Marketing'],
    cta: 'Most Popular',
    featured: true,
  },
  {
    name: 'Full Autopilot',
    price: 'Custom Quote',
    priceSub: 'tailored to your needs',
    tagline: 'Run your entire business on autopilot.',
    includes: ['CRM System', 'AI Receptionist', 'Auto Marketing Agent', 'SEO Optimization'],
    cta: 'Book a Call',
    featured: false,
  },
]

export default function Pricing() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const cardRefs = useRef([])

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

    const heading = sectionRef.current?.querySelector('.pricing-h2')
    if (heading) {
      gsap.fromTo(heading,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true } }
      )
    }

    /* Cards fan in — center card last with punch */
    const order = [0, 2, 1]
    order.forEach((idx, seq) => {
      const card = cardRefs.current[idx]
      if (!card) return
      const isFeatured = idx === 1
      gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, ease: 'expo.out',
          delay: seq * 0.12 + (isFeatured ? 0.15 : 0),
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          onComplete: isFeatured ? () => {
            gsap.to(card, { scale: 1.02, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' })
          } : undefined,
        }
      )
    })
  }, [])

  return (
    <section id="pricing" ref={sectionRef} style={styles.section}>
      <div className="container section-pad">
        <span ref={labelRef} className="section-label" style={{ opacity: 0 }}>Transparent Pricing</span>
        <h2 className="display-heading pricing-h2" style={styles.h2}>
          Simple packages, no surprises
        </h2>
        <p style={styles.subtext}>
          Straightforward pricing with everything spelled out. No hidden fees, no long-term lock-ins.
        </p>

        <div style={styles.grid} className="pricing-grid">
          {bundles.map((b, i) => (
            <div
              key={b.name}
              ref={(el) => (cardRefs.current[i] = el)}
              style={{
                ...styles.card,
                ...(b.featured ? styles.featuredCard : {}),
                opacity: 0,
              }}
              data-hover
            >
              {b.featured && <div style={styles.popularBadge}>Most Popular</div>}
              <div style={styles.cardTop}>
                <h3 style={styles.cardName}>{b.name}</h3>
                <p style={styles.cardTagline}>{b.tagline}</p>
              </div>
              <div style={styles.priceWrap}>
                <span style={styles.price}>{b.price}</span>
                <span style={styles.priceSub}>{b.priceSub}</span>
              </div>
              <ul style={styles.includes}>
                {b.includes.map((item) => (
                  <li key={item} style={styles.includeItem}>
                    <span style={styles.checkmark}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                style={{ ...styles.cta, ...(b.featured ? styles.featuredCta : {}) }}
                onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                data-hover
              >
                {b.cta === 'Most Popular' ? 'Get Growth Pack' : b.cta} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: { background: 'var(--navy)' },
  h2: {
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    color: '#fff',
    marginTop: '1rem',
    marginBottom: '0.75rem',
  },
  subtext: {
    fontSize: '0.95rem',
    fontWeight: 300,
    color: 'rgba(181,212,244,0.65)',
    marginBottom: '3rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    alignItems: 'start',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    position: 'relative',
    transition: 'border-color 200ms ease, transform 200ms ease',
  },
  featuredCard: {
    border: '2px solid var(--blue)',
    boxShadow: 'inset 0 0 40px rgba(55,138,221,0.08), 0 20px 60px rgba(55,138,221,0.12)',
    marginTop: '-1rem',
    paddingTop: '2.5rem',
  },
  popularBadge: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.25rem 1rem',
    background: 'var(--blue)',
    borderRadius: '20px',
    fontSize: '0.72rem',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  cardTop: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  cardName: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  cardTagline: {
    fontSize: '0.82rem',
    fontWeight: 300,
    color: 'rgba(181,212,244,0.65)',
    lineHeight: 1.5,
  },
  priceWrap: { display: 'flex', flexDirection: 'column', gap: '0.1rem' },
  price: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    color: '#fff',
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  priceSub: {
    fontSize: '0.8rem',
    color: 'rgba(181,212,244,0.55)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
  },
  includes: { display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 },
  includeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.88rem',
    fontWeight: 300,
    color: 'rgba(181,212,244,0.8)',
    fontFamily: 'var(--font-sans)',
  },
  checkmark: { color: '#6ee87a', fontWeight: 500, flexShrink: 0, fontSize: '0.8rem' },
  cta: {
    display: 'block',
    textAlign: 'center',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.08)',
    border: '0.5px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    transition: 'background 200ms ease, transform 200ms ease',
    marginTop: 'auto',
  },
  featuredCta: {
    background: 'var(--blue)',
    border: '0.5px solid var(--blue)',
  },
}

const pricingStyle = document.createElement('style')
pricingStyle.textContent = `
  .pricing-card:hover { transform: translateY(-4px) !important; border-color: rgba(55,138,221,0.5) !important; }
  @media (max-width: 900px) {
    .pricing-grid { grid-template-columns: 1fr !important; }
  }
`
document.head.appendChild(pricingStyle)
