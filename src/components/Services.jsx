import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  // Tier 1 — 2 cards
  {
    tier: 1,
    name: 'Website Design',
    description: 'Custom, mobile-first websites that convert visitors into customers. Built for speed, SEO, and long-term growth.',
    icon: '🌐',
    priceType: 'one-time',
    price: 'from $500',
    ai: false,
  },
  {
    tier: 1,
    name: 'Logo Design',
    description: 'Professional brand identity designed to make your business instantly recognizable and memorable.',
    icon: '✏️',
    priceType: 'one-time',
    price: '$100',
    ai: false,
  },
  // Tier 2 — 4 cards
  {
    tier: 2,
    name: 'Social Media Marketing',
    description: 'Content creation, scheduling, and analytics management across all major platforms to grow your audience.',
    icon: '📱',
    priceType: 'monthly',
    price: '$499/mo',
    ai: false,
  },
  {
    tier: 2,
    name: 'SEO Optimization',
    description: 'On-page and technical SEO that gets your business ranking on Google for the keywords that matter.',
    icon: '🔍',
    priceType: 'one-time',
    price: 'from $500',
    ai: false,
  },
  {
    tier: 2,
    name: 'E-Commerce System',
    description: 'Full-featured online store with inventory management, payment processing, and customer accounts.',
    icon: '🛒',
    priceType: 'one-time',
    price: 'from $1,500',
    ai: false,
  },
  {
    tier: 2,
    name: 'CRM System',
    description: 'Custom customer relationship management built from scratch — track leads, clients, and revenue in one place.',
    icon: '📊',
    priceType: 'one-time',
    price: 'from $1,200',
    ai: false,
  },
  // Tier 3 — 2 cards
  {
    tier: 3,
    name: 'AI Chatbot',
    description: 'Intelligent conversational agent trained on your business — answers questions, qualifies leads 24/7.',
    icon: '🤖',
    priceType: 'monthly',
    price: 'from $79/mo',
    ai: true,
  },
  {
    tier: 3,
    name: 'AI Receptionist',
    description: 'An always-on virtual receptionist that books appointments, routes calls, and handles FAQs automatically.',
    icon: '📞',
    priceType: 'dual',
    price: '$699 one-time',
    priceAlt: '$149/mo',
    ai: true,
  },
  // Tier 4 — featured full-width
  {
    tier: 4,
    name: 'Auto Marketing Agent',
    description: 'A fully autonomous AI agent that generates content, schedules posts, sends follow-ups, tracks leads, and reports results — all without you lifting a finger.',
    icon: '⚡',
    priceType: 'dual',
    price: '$499/mo',
    priceAlt: '$2,499 one-time',
    ai: true,
    featured: true,
    includes: [
      'AI content generation (posts, emails, ads)',
      'Automated social media scheduling',
      'Lead follow-up sequences',
      'Weekly performance reports',
      'Multi-channel campaign management',
      'Continuous learning & optimization',
    ],
  },
]

const tierLabels = {
  1: 'TIER 1: FOUNDATION',
  2: 'TIER 2: GROWTH',
  3: 'TIER 3: AI-POWERED',
  4: 'TIER 4: ELITE',
}

export default function Services() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    /* Section label slides in */
    if (labelRef.current) {
      gsap.fromTo(labelRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 85%', once: true },
        }
      )
    }

    /* Heading reveal */
    const heading = sectionRef.current?.querySelector('.services-h2')
    if (heading) {
      gsap.fromTo(heading,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)', opacity: 1,
          duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
        }
      )
    }

    /* Cards fan in */
    const cards = sectionRef.current?.querySelectorAll('.service-card')
    if (cards?.length) {
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        }
      )
    }
  }, [])

  const tierGroups = [1, 2, 3, 4]
  const byTier = (t) => services.filter((s) => s.tier === t)

  return (
    <section id="services" ref={sectionRef} style={styles.section}>
      <div className="container section-pad">
        <span ref={labelRef} className="section-label" style={{ opacity: 0 }}>What We Build</span>
        <h2 className="display-heading services-h2" style={styles.h2}>
          Services built for local businesses
        </h2>
        <p style={styles.subtext}>
          From a first website to a fully automated marketing engine — we build what you need, when you need it.
        </p>

        {tierGroups.map((tier) => (
          <div key={tier}>
            <TierDivider label={tierLabels[tier]} />
            {tier === 4 ? (
              byTier(4).map((svc) => <FeaturedCard key={svc.name} svc={svc} />)
            ) : (
              <div style={{ ...styles.grid, gridTemplateColumns: tier === 2 ? 'repeat(4,1fr)' : 'repeat(2,1fr)' }}>
                {byTier(tier).map((svc) => <ServiceCard key={svc.name} svc={svc} />)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function TierDivider({ label }) {
  return (
    <div style={dStyles.wrap}>
      <span style={dStyles.line} />
      <span style={dStyles.pill}>{label}</span>
      <span style={dStyles.line} />
    </div>
  )
}

function ServiceCard({ svc }) {
  return (
    <div className="service-card glass-card" style={cardStyles.card} data-hover>
      <div style={cardStyles.top}>
        <div style={cardStyles.iconBox}>{svc.icon}</div>
        {svc.ai && <AiBadge />}
      </div>
      <h3 style={cardStyles.name}>{svc.name}</h3>
      <p style={cardStyles.desc}>{svc.description}</p>
      <div style={cardStyles.footer}>
        {svc.priceType === 'dual' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <PricePill label={svc.price} monthly={false} />
            <PricePill label={svc.priceAlt} monthly={true} />
          </div>
        ) : (
          <PricePill label={svc.price} monthly={svc.priceType === 'monthly'} />
        )}
      </div>
    </div>
  )
}

function FeaturedCard({ svc }) {
  return (
    <div className="service-card glass-card" style={featStyles.card} data-hover>
      <div style={featStyles.inner}>
        <div style={featStyles.left}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <div style={cardStyles.iconBox}>{svc.icon}</div>
            <span style={featStyles.autonomousBadge}>Fully Autonomous</span>
            <AiBadge />
          </div>
          <h3 style={featStyles.name}>{svc.name}</h3>
          <p style={featStyles.desc}>{svc.description}</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <PricePill label={svc.price} monthly />
            <PricePill label={svc.priceAlt} monthly={false} />
          </div>
        </div>
        <div style={featStyles.right}>
          <p style={featStyles.includesLabel}>What's included:</p>
          <ul style={featStyles.list}>
            {svc.includes.map((item) => (
              <li key={item} style={featStyles.listItem}>
                <span style={featStyles.check}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function AiBadge() {
  return (
    <span style={aiStyles.badge}>
      <span style={aiStyles.dot} />
      AI
    </span>
  )
}

function PricePill({ label, monthly }) {
  return (
    <span style={{
      ...pillStyles.pill,
      background: monthly ? 'rgba(55,138,221,0.25)' : 'rgba(255,255,255,0.1)',
      color: monthly ? 'var(--blue-light)' : 'rgba(255,255,255,0.85)',
      border: monthly ? '0.5px solid rgba(55,138,221,0.4)' : '0.5px solid rgba(255,255,255,0.15)',
    }}>
      {label}
    </span>
  )
}

/* ── Style objects ── */
const styles = {
  section: { background: 'var(--navy)' },
  h2: {
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    color: '#fff',
    marginTop: '1rem',
    marginBottom: '0.75rem',
    maxWidth: '520px',
  },
  subtext: {
    fontSize: '0.95rem',
    fontWeight: 300,
    color: 'rgba(181,212,244,0.7)',
    marginBottom: '2rem',
    maxWidth: '500px',
  },
  grid: {
    display: 'grid',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
}

const dStyles = {
  wrap: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '2.5rem 0 1.2rem' },
  line: { flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.15)', display: 'block' },
  pill: {
    padding: '0.25rem 0.75rem',
    background: 'rgba(255,255,255,0.07)',
    border: '0.5px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'var(--font-sans)',
    letterSpacing: '0.1em',
    whiteSpace: 'nowrap',
  },
}

const cardStyles = {
  card: {
    padding: '1.5rem',
    opacity: 0,
    transition: 'border-color 200ms ease, background 200ms ease, transform 200ms ease, box-shadow 200ms ease',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' },
  iconBox: {
    width: '40px', height: '40px',
    background: 'rgba(55,138,221,0.15)',
    border: '0.5px solid rgba(55,138,221,0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    transition: 'box-shadow 200ms ease',
  },
  name: { fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.02em' },
  desc: { fontSize: '0.85rem', fontWeight: 300, color: 'rgba(181,212,244,0.7)', lineHeight: 1.65, flex: 1 },
  footer: { marginTop: '0.5rem' },
}

const featStyles = {
  card: { padding: '2rem', opacity: 0, transition: 'border-color 200ms ease, background 200ms ease, transform 200ms ease' },
  inner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' },
  left: {},
  right: {},
  name: { fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.6rem' },
  desc: { fontSize: '0.9rem', fontWeight: 300, color: 'rgba(181,212,244,0.75)', lineHeight: 1.7 },
  autonomousBadge: {
    padding: '0.2rem 0.6rem',
    background: 'rgba(40,200,64,0.15)',
    border: '0.5px solid rgba(40,200,64,0.35)',
    borderRadius: '20px',
    fontSize: '0.7rem',
    color: '#6ee87a',
    fontFamily: 'var(--font-sans)',
  },
  includesLabel: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.8rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  listItem: { fontSize: '0.88rem', fontWeight: 300, color: 'rgba(181,212,244,0.8)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' },
  check: { color: '#6ee87a', flexShrink: 0, fontWeight: 500 },
}

const aiStyles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.2rem 0.55rem',
    background: 'rgba(127,119,221,0.2)',
    border: '0.5px solid rgba(175,169,236,0.4)',
    borderRadius: '20px',
    fontSize: '0.65rem',
    color: '#AFA9EC',
    fontFamily: 'var(--font-sans)',
    letterSpacing: '0.06em',
  },
  dot: { width: '5px', height: '5px', borderRadius: '50%', background: '#AFA9EC', display: 'inline-block' },
}

const pillStyles = {
  pill: {
    display: 'inline-block',
    padding: '0.25rem 0.7rem',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
  },
}

/* Hover effects via stylesheet */
const svcStyle = document.createElement('style')
svcStyle.textContent = `
  .service-card:hover {
    border-color: rgba(55,138,221,0.6) !important;
    background: rgba(55,138,221,0.08) !important;
    transform: translateY(-4px) !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
  }
  .service-card:hover .card-icon-box {
    box-shadow: 0 0 0 4px rgba(55,138,221,0.15) !important;
  }
  @media (max-width: 900px) {
    .services-tier2-grid { grid-template-columns: repeat(2,1fr) !important; }
    .services-feat-inner { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 640px) {
    .services-tier1-grid, .services-tier2-grid, .services-tier3-grid { grid-template-columns: 1fr !important; }
  }
`
document.head.appendChild(svcStyle)
