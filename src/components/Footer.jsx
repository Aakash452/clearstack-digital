import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const quickLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !footerRef.current) return

    gsap.fromTo(footerRef.current,
      { y: 40 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'top 60%',
          scrub: true,
        },
      }
    )
  }, [])

  const scrollTo = (href) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer ref={footerRef} style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          {/* Left */}
          <div style={styles.col}>
            <a
              href="#"
              style={styles.logo}
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            >
              ClearStack<span style={styles.logoDot}>.</span>Digital
            </a>
            <p style={styles.tagline}>
              Websites, Systems & AI<br />that work for you.
            </p>
            <p style={styles.location}>Norman, Oklahoma</p>
          </div>

          {/* Center */}
          <div style={styles.col}>
            <div style={styles.colTitle}>Quick Links</div>
            <ul style={styles.linkList}>
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    style={styles.footerLink}
                    onClick={(e) => { e.preventDefault(); scrollTo(href) }}
                    data-hover
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div style={styles.col}>
            <div style={styles.colTitle}>Contact</div>
            <a href="mailto:hello@clearstackdigital.com" style={styles.contactLink} data-hover>
              hello@clearstackdigital.com
            </a>
            <p style={styles.contactLocation}>Norman, OK</p>
            <a
              href="#contact"
              style={styles.ctaBtn}
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              data-hover
            >
              Book a Free Call →
            </a>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <span style={styles.copyright}>© 2026 ClearStack Digital. All rights reserved.</span>
          <span style={styles.builtWith}>Built with React + GSAP</span>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: 'var(--navy-deep)',
    borderTop: '0.5px solid rgba(255,255,255,0.08)',
    paddingTop: '4rem',
    willChange: 'transform',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '3rem',
    paddingBottom: '3rem',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
  },
  col: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    color: '#fff',
    letterSpacing: '-0.02em',
    display: 'inline-block',
  },
  logoDot: { color: 'var(--blue)' },
  tagline: {
    fontSize: '0.82rem',
    fontWeight: 300,
    color: 'rgba(181,212,244,0.6)',
    fontFamily: 'var(--font-sans)',
    lineHeight: 1.65,
  },
  location: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.35)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
  },
  colTitle: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: 'var(--font-sans)',
    marginBottom: '0.25rem',
  },
  linkList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  footerLink: {
    fontSize: '0.88rem',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
    transition: 'color 200ms ease',
    display: 'inline-block',
  },
  contactLink: {
    fontSize: '0.82rem',
    color: 'var(--blue-accent)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
    transition: 'color 200ms ease',
    wordBreak: 'break-word',
  },
  contactLocation: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    marginTop: '0.5rem',
    padding: '0.5rem 1.1rem',
    background: 'var(--blue)',
    color: '#fff',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    transition: 'background 200ms ease, transform 200ms ease',
    width: 'fit-content',
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 0',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  copyright: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
  },
  builtWith: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
  },
}

const footerStyle = document.createElement('style')
footerStyle.textContent = `
  footer a:hover { color: var(--blue-accent) !important; }
  footer a[style*="var(--blue)"]:hover { background: var(--blue-accent) !important; transform: scale(1.03) !important; }
  @media (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
  }
`
document.head.appendChild(footerStyle)
