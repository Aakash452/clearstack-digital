import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: '📅', name: 'Appointment Agent', desc: 'Books meetings automatically, 24/7' },
  { icon: '💬', name: 'Lead Chatbot', desc: 'Qualifies prospects before they reach you' },
  { icon: '🔄', name: 'Auto Follow-Up', desc: 'Nurtures leads without manual outreach' },
  { icon: '📈', name: 'Weekly Reports', desc: 'Insights on performance, sent to your inbox' },
]

const conversation = [
  { role: 'bot', text: 'Hi! I\'m the ClearStack assistant. How can I help your business today?' },
  { role: 'user', text: 'Can you help me get more leads from my website?' },
  { role: 'bot', text: 'Absolutely! I can set up a 24/7 AI chatbot that captures leads, answers FAQs, and books discovery calls — all automatically.' },
  { role: 'user', text: 'How long does setup take?' },
  { role: 'bot', text: 'Most businesses are live within 48 hours. Want me to schedule a free call to get started? 🚀' },
]

const TIMINGS = [0, 1500, 2800, 4200, 5600]

export default function AIDemo() {
  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const [visibleMessages, setVisibleMessages] = useState([])
  const [showTyping, setShowTyping] = useState(false)
  const timersRef = useRef([])
  const activeRef = useRef(false)

  const runConversation = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setVisibleMessages([])
    setShowTyping(false)

    conversation.forEach((msg, i) => {
      const preDelay = TIMINGS[i]
      const typingDelay = preDelay - 600

      if (msg.role === 'bot' && i > 0) {
        const t1 = setTimeout(() => setShowTyping(true), typingDelay)
        timersRef.current.push(t1)
      }

      const t2 = setTimeout(() => {
        setShowTyping(false)
        setVisibleMessages((prev) => [...prev, i])
      }, preDelay)
      timersRef.current.push(t2)
    })

    const loopTimer = setTimeout(() => {
      if (activeRef.current) runConversation()
    }, 9500)
    timersRef.current.push(loopTimer)
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (labelRef.current) {
      gsap.fromTo(labelRef.current, { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out',
          scrollTrigger: { trigger: labelRef.current, start: 'top 85%', once: true } })
    }

    const heading = sectionRef.current?.querySelector('.aidemo-h2')
    if (heading) {
      gsap.fromTo(heading, { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 85%', once: true } })
    }

    const featureCards = sectionRef.current?.querySelectorAll('.ai-feature-card')
    if (featureCards?.length) {
      gsap.fromTo(featureCards, { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: featureCards[0], start: 'top 80%', once: true } })
    }

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'bottom 10%',
      onEnter: () => {
        activeRef.current = true
        if (!prefersReduced) runConversation()
      },
      onLeave: () => { activeRef.current = false; timersRef.current.forEach(clearTimeout) },
      onEnterBack: () => {
        activeRef.current = true
        if (!prefersReduced) runConversation()
      },
      onLeaveBack: () => { activeRef.current = false; timersRef.current.forEach(clearTimeout) },
    })

    return () => {
      timersRef.current.forEach(clearTimeout)
      activeRef.current = false
    }
  }, [])

  return (
    <section ref={sectionRef} style={styles.section}>
      <div style={styles.divider} />
      <div className="container section-pad">
        <div style={styles.grid}>
          {/* Left */}
          <div style={styles.left}>
            <span ref={labelRef} className="section-label" style={{ opacity: 0 }}>AI-Powered Services</span>
            <h2 className="display-heading aidemo-h2" style={styles.h2}>
              Your business,<br />running on autopilot
            </h2>
            <p style={styles.subtext}>
              Our AI systems work around the clock — booking appointments, following up with leads,
              answering questions, and sending you reports. No extra staff required.
            </p>

            <div style={styles.featuresGrid}>
              {features.map((f) => (
                <div key={f.name} className="ai-feature-card glass-card" style={featureCardStyles.card} data-hover>
                  <div style={featureCardStyles.iconWrap}>
                    <span style={featureCardStyles.icon}>{f.icon}</span>
                  </div>
                  <div>
                    <div style={featureCardStyles.name}>{f.name}</div>
                    <div style={featureCardStyles.desc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — chat mockup */}
          <div style={styles.right}>
            <div style={chatStyles.window}>
              <div style={chatStyles.header}>
                <div style={chatStyles.headerDot} />
                <span style={chatStyles.headerTitle}>ClearStack AI</span>
                <span style={chatStyles.headerStatus}>● Online</span>
              </div>
              <div style={chatStyles.body}>
                {conversation.map((msg, i) => {
                  const visible = visibleMessages.includes(i)
                  return (
                    <div
                      key={i}
                      style={{
                        ...chatStyles.msgRow,
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'opacity 400ms ease, transform 400ms ease',
                      }}
                    >
                      {msg.role === 'bot' && <div style={chatStyles.avatar}>CS</div>}
                      <div style={{
                        ...chatStyles.bubble,
                        ...(msg.role === 'user' ? chatStyles.userBubble : chatStyles.botBubble),
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  )
                })}

                {showTyping && (
                  <div style={{ ...chatStyles.msgRow, justifyContent: 'flex-start' }}>
                    <div style={chatStyles.avatar}>CS</div>
                    <div style={{ ...chatStyles.bubble, ...chatStyles.botBubble, ...chatStyles.typingBubble }}>
                      <span style={chatStyles.dot} />
                      <span style={{ ...chatStyles.dot, animationDelay: '0.2s' }} />
                      <span style={{ ...chatStyles.dot, animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>
              <div style={chatStyles.inputRow}>
                <div style={chatStyles.fakeInput}>Type a message...</div>
                <div style={chatStyles.sendBtn}>↑</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: { background: 'var(--navy)' },
  divider: { height: '0.5px', background: 'rgba(255,255,255,0.08)', marginBottom: 0 },
  grid: { display: 'grid', gridTemplateColumns: '55fr 45fr', gap: '4rem', alignItems: 'center' },
  left: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  right: {},
  h2: {
    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
    color: '#fff',
    marginTop: '0.5rem',
    lineHeight: 1.2,
  },
  subtext: { fontSize: '0.92rem', fontWeight: 300, color: 'rgba(181,212,244,0.65)', lineHeight: 1.7 },
  featuresGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
}

const featureCardStyles = {
  card: {
    padding: '1.1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
    opacity: 0,
    transition: 'border-color 200ms ease, background 200ms ease',
    cursor: 'default',
  },
  iconWrap: {
    width: '36px', height: '36px',
    background: 'rgba(55,138,221,0.15)',
    border: '0.5px solid rgba(55,138,221,0.2)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '1rem',
    transition: 'transform 300ms ease',
  },
  icon: {},
  name: { fontSize: '0.85rem', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-sans)' },
  desc: { fontSize: '0.75rem', fontWeight: 300, color: 'rgba(181,212,244,0.6)', marginTop: '0.15rem' },
}

const chatStyles = {
  window: {
    background: 'rgba(2,27,56,0.95)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.9rem 1.2rem',
    background: 'rgba(55,138,221,0.12)',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
  },
  headerDot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--blue)' },
  headerTitle: { fontSize: '0.82rem', fontWeight: 500, color: '#fff', fontFamily: 'var(--font-sans)', flex: 1 },
  headerStatus: { fontSize: '0.68rem', color: '#6ee87a', fontFamily: 'var(--font-sans)' },
  body: {
    padding: '1.2rem',
    minHeight: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: '0.5rem' },
  avatar: {
    width: '28px', height: '28px',
    borderRadius: '50%',
    background: 'var(--blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.6rem',
    fontWeight: 600,
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '78%',
    padding: '0.6rem 0.9rem',
    borderRadius: '12px',
    fontSize: '0.82rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
    lineHeight: 1.55,
  },
  botBubble: {
    background: 'rgba(55,138,221,0.15)',
    border: '0.5px solid rgba(55,138,221,0.25)',
    color: 'rgba(255,255,255,0.9)',
    borderBottomLeftRadius: '4px',
  },
  userBubble: {
    background: 'var(--blue)',
    color: '#fff',
    borderBottomRightRadius: '4px',
  },
  typingBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0.7rem 0.9rem',
  },
  dot: {
    width: '6px', height: '6px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.5)',
    display: 'inline-block',
    animation: 'typingBounce 1.2s ease-in-out infinite',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.2rem',
    borderTop: '0.5px solid rgba(255,255,255,0.08)',
  },
  fakeInput: {
    flex: 1,
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.25)',
    fontFamily: 'var(--font-sans)',
    background: 'rgba(255,255,255,0.05)',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '0.45rem 0.75rem',
  },
  sendBtn: {
    width: '30px', height: '30px',
    background: 'var(--blue)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.8rem',
    flexShrink: 0,
  },
}

const aiDemoStyle = document.createElement('style')
aiDemoStyle.textContent = `
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-5px); opacity: 1; }
  }
  .ai-feature-card:hover { border-color: rgba(55,138,221,0.5) !important; background: rgba(55,138,221,0.08) !important; }
  .ai-feature-card:hover > div:first-child { transform: scale(1.1) !important; }
  @media (max-width: 900px) {
    .aidemo-grid { grid-template-columns: 1fr !important; }
    .ai-features-grid { grid-template-columns: repeat(2,1fr) !important; }
  }
`
document.head.appendChild(aiDemoStyle)
