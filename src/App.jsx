import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import Services from './components/Services'
import Projects from './components/Projects'
import Pricing from './components/Pricing'
import AIDemo from './components/AIDemo'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    })

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <Services />
        <Projects />
        <Pricing />
        <AIDemo />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
