import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced && navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.1 }
      )
    }

    // Track active section via IntersectionObserver
    const sections = ['services', 'projects', 'pricing', 'contact']
    const observers = sections.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -50% 0px' }
      )
      obs.observe(el)
      return obs
    })

    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  const scrollTo = (href) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav ref={navRef} style={styles.nav}>
        {/* Logo */}
        <a href="#" style={styles.logo} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          ClearStack<span style={styles.logoDot}>.</span>Digital
        </a>

        {/* Desktop links */}
        <div style={styles.links}>
          {links.map(({ label, href }) => {
            const id = href.replace('#', '')
            return (
              <a
                key={id}
                href={href}
                style={{ ...styles.link, ...(active === id ? styles.linkActive : {}) }}
                onClick={(e) => { e.preventDefault(); scrollTo(href) }}
              >
                {label}
                {active === id && <span style={styles.activeDot} />}
              </a>
            )
          })}
        </div>

        {/* CTA */}
        <a href="#contact" style={styles.cta} onClick={(e) => { e.preventDefault(); scrollTo('#contact') }}>
          Book a Call
        </a>

        {/* Hamburger */}
        <button
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ ...styles.bar, transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ ...styles.bar, opacity: menuOpen ? 0 : 1 }} />
          <span style={{ ...styles.bar, transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div style={{ ...styles.overlay, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'all' : 'none' }}>
        <button style={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        <div style={styles.mobileLinks}>
          {links.map(({ label, href }, i) => (
            <a
              key={href}
              href={href}
              style={{ ...styles.mobileLink, transitionDelay: menuOpen ? `${i * 0.08}s` : '0s', transform: menuOpen ? 'translateY(0)' : 'translateY(30px)', opacity: menuOpen ? 1 : 0 }}
              onClick={(e) => { e.preventDefault(); scrollTo(href) }}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            style={{ ...styles.mobileCta, transitionDelay: menuOpen ? '0.32s' : '0s', transform: menuOpen ? 'translateY(0)' : 'translateY(30px)', opacity: menuOpen ? 1 : 0 }}
            onClick={(e) => { e.preventDefault(); scrollTo('#contact') }}
          >
            Book a Call
          </a>
        </div>
      </div>
    </>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    top: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    padding: '0.6rem 1.5rem',
    background: 'rgba(4,44,83,0.88)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '50px',
    opacity: 0,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    color: '#fff',
    fontWeight: 400,
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap',
  },
  logoDot: { color: 'var(--blue)' },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    position: 'relative',
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.8)',
    transition: 'color 200ms ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
  },
  linkActive: { color: 'var(--blue-accent)' },
  activeDot: {
    width: '4px', height: '4px',
    borderRadius: '50%',
    background: 'var(--blue)',
    display: 'block',
  },
  cta: {
    padding: '0.45rem 1.1rem',
    background: 'var(--white)',
    color: 'var(--navy)',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    transition: 'background 200ms ease, transform 200ms ease',
    whiteSpace: 'nowrap',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    padding: '4px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  bar: {
    width: '22px', height: '1.5px',
    background: '#fff',
    display: 'block',
    transition: 'transform 250ms ease, opacity 250ms ease',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 999,
    background: 'rgba(4,44,83,0.97)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 300ms ease',
  },
  closeBtn: {
    position: 'absolute',
    top: '2rem', right: '2rem',
    color: '#fff',
    fontSize: '1.4rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  mobileLinks: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  mobileLink: {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    color: '#fff',
    transition: 'transform 350ms var(--ease-out-expo), opacity 350ms ease',
  },
  mobileCta: {
    marginTop: '1rem',
    padding: '0.7rem 2rem',
    background: 'var(--blue)',
    color: '#fff',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    transition: 'transform 350ms var(--ease-out-expo), opacity 350ms ease',
  },
}

/* Inject responsive styles */
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @media (max-width: 768px) {
      nav > div { display: none !important; }
      nav > a:last-of-type:not(:first-of-type) { display: none !important; }
      nav button[aria-label="Toggle menu"] { display: flex !important; }
    }
    nav a:hover { color: var(--blue-accent) !important; }
    nav > a[href="#contact"]:hover { background: var(--blue-accent) !important; transform: scale(1.03) !important; }
  `
  document.head.appendChild(style)
}
