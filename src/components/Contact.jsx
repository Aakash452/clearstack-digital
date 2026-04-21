import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const contactInfo = [
  { icon: '📍', label: 'Norman, Oklahoma', sub: 'Greater OKC area' },
  { icon: '📞', label: 'Free 30-min Discovery Call', sub: 'No commitment required' },
]

const businessTypes = ['Restaurant / Food', 'Home Services', 'Retail / E-Commerce', 'Health & Wellness', 'Professional Services', 'Real Estate', 'Other']
const serviceOptions = ['Website Design', 'Logo Design', 'Social Media Marketing', 'SEO Optimization', 'E-Commerce System', 'CRM System', 'AI Chatbot', 'AI Receptionist', 'Auto Marketing Agent', 'Not sure yet']

export default function Contact() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const formRef = useRef(null)
  const successRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [fields, setFields] = useState({
    firstName: '', lastName: '', email: '', businessType: '', service: '', message: '',
  })

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    if (labelRef.current) {
      gsap.fromTo(labelRef.current, { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 85%', once: true } })
    }

    const heading = sectionRef.current?.querySelector('.contact-h2')
    if (heading) {
      gsap.fromTo(heading, { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true } })
    }

    const leftEls = sectionRef.current?.querySelectorAll('.contact-left-el')
    if (leftEls?.length) {
      gsap.fromTo(leftEls, { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } })
    }

    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 80%', once: true } })
    }
  }, [])

  const handleChange = (e) => setFields({ ...fields, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formRef.current || !successRef.current) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setSubmitted(true); return }

    gsap.to(formRef.current, {
      opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        setSubmitted(true)
        gsap.fromTo(successRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }
        )
      },
    })
  }

  return (
    <section id="contact" ref={sectionRef} style={styles.section}>
      <div className="container section-pad">
        <div style={styles.grid}>
          {/* Left */}
          <div style={styles.left}>
            <span ref={labelRef} className="section-label" style={{ opacity: 0 }}>Get in Touch</span>
            <h2 className="display-heading contact-h2 contact-left-el" style={styles.h2}>
              Let's build something<br />together
            </h2>
            <p className="contact-left-el" style={styles.subtext}>
              Tell us about your business and what you're looking to build. We'll get back to you
              within 24 hours with a tailored plan.
            </p>

            <div style={styles.contactList} className="contact-left-el">
              {contactInfo.map((item) => (
                <div key={item.label} style={styles.contactItem}>
                  <div style={styles.contactIcon}>{item.icon}</div>
                  <div>
                    <div style={styles.contactLabel}>{item.label}</div>
                    <div style={styles.contactSub}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div style={styles.formWrap}>
            {!submitted ? (
              <form ref={formRef} onSubmit={handleSubmit} style={{ ...styles.formCard, opacity: 0 }}>
                <div style={styles.nameRow}>
                  <Field label="First Name" name="firstName" value={fields.firstName} onChange={handleChange} placeholder="Jane" required />
                  <Field label="Last Name" name="lastName" value={fields.lastName} onChange={handleChange} placeholder="Smith" required />
                </div>
                <Field label="Email Address" name="email" type="email" value={fields.email} onChange={handleChange} placeholder="jane@yourcompany.com" required />
                <SelectField label="Business Type" name="businessType" value={fields.businessType} onChange={handleChange} options={businessTypes} />
                <SelectField label="Service Interested In" name="service" value={fields.service} onChange={handleChange} options={serviceOptions} />
                <Field label="Message" name="message" value={fields.message} onChange={handleChange} placeholder="Tell us about your project, goals, or timeline..." multiline required />
                <button type="submit" style={styles.submitBtn} data-hover>
                  Send Message →
                </button>
              </form>
            ) : (
              <div ref={successRef} style={styles.successState}>
                <CheckmarkSVG />
                <p style={styles.successText}>Message sent!</p>
                <p style={styles.successSub}>We'll be in touch within 24 hours.</p>
              </div>
            )}
            {submitted && <div ref={formRef} />}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder, required, multiline }) {
  const [focused, setFocused] = useState(false)
  const baseInputStyle = {
    ...inputStyles.input,
    ...(focused ? inputStyles.inputFocused : {}),
  }
  return (
    <div style={inputStyles.group}>
      <label style={inputStyles.label}>{label}</label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          style={{ ...baseInputStyle, resize: 'vertical', minHeight: '100px' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={baseInputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </div>
  )
}

function SelectField({ label, name, value, onChange, options }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={inputStyles.group}>
      <label style={inputStyles.label}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{ ...inputStyles.input, ...(focused ? inputStyles.inputFocused : {}), cursor: 'none' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="" disabled>Select an option</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function CheckmarkSVG() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ marginBottom: '1rem' }}>
      <circle cx="32" cy="32" r="30" stroke="#6ee87a" strokeWidth="2" fill="rgba(40,200,64,0.1)" />
      <polyline
        points="20,33 28,42 45,24"
        stroke="#6ee87a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ strokeDasharray: 40, strokeDashoffset: 0, animation: 'drawCheck 0.6s ease-out 0.3s both' }}
      />
    </svg>
  )
}

const styles = {
  section: { background: 'var(--navy)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' },
  left: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  h2: {
    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
    color: '#fff',
    marginTop: '0.5rem',
    lineHeight: 1.25,
  },
  subtext: { fontSize: '0.92rem', fontWeight: 300, color: 'rgba(181,212,244,0.65)', lineHeight: 1.7, opacity: 0 },
  contactList: { display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0 },
  contactItem: { display: 'flex', alignItems: 'flex-start', gap: '0.9rem' },
  contactIcon: {
    width: '40px', height: '40px',
    background: 'rgba(55,138,221,0.15)',
    border: '0.5px solid rgba(55,138,221,0.25)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  contactLabel: { fontSize: '0.88rem', fontWeight: 400, color: '#fff', fontFamily: 'var(--font-sans)' },
  contactSub: { fontSize: '0.75rem', fontWeight: 300, color: 'rgba(181,212,244,0.5)', fontFamily: 'var(--font-sans)' },
  formWrap: {},
  formCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '0.5px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1.75rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  nameRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  submitBtn: {
    width: '100%',
    height: '50px',
    background: 'var(--blue)',
    color: '#fff',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    border: 'none',
    transition: 'background 200ms ease, transform 200ms ease, color 200ms ease',
    marginTop: '0.25rem',
    cursor: 'none',
  },
  successState: {
    background: 'rgba(255,255,255,0.05)',
    border: '0.5px solid rgba(255,255,255,0.15)',
    borderRadius: '16px',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    textAlign: 'center',
    gap: '0.4rem',
  },
  successText: { fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', letterSpacing: '-0.02em' },
  successSub: { fontSize: '0.9rem', fontWeight: 300, color: 'rgba(181,212,244,0.65)', fontFamily: 'var(--font-sans)' },
}

const inputStyles = {
  group: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' },
  input: {
    background: 'rgba(255,255,255,0.07)',
    border: '0.5px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
    padding: '0.65rem 0.9rem',
    outline: 'none',
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
    width: '100%',
  },
  inputFocused: {
    borderColor: 'var(--blue)',
    boxShadow: '0 0 0 3px rgba(55,138,221,0.15)',
  },
}

const contactStyle = document.createElement('style')
contactStyle.textContent = `
  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
  select option { background: #042C53; color: #fff; }
  button[type="submit"]:hover { background: #fff !important; color: var(--navy) !important; transform: scale(1.01) !important; }
  button[type="submit"]:active { transform: scale(0.98) !important; }
  @keyframes drawCheck {
    from { stroke-dashoffset: 40; }
    to { stroke-dashoffset: 0; }
  }
  @media (max-width: 900px) {
    .contact-grid { grid-template-columns: 1fr !important; }
    .contact-name-row { grid-template-columns: 1fr !important; }
  }
`
document.head.appendChild(contactStyle)
