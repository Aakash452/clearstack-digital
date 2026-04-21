import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let curX = mouseX
    let curY = mouseY
    let rafId = null

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`
    }

    const animate = () => {
      curX += (mouseX - curX) * 0.12
      curY += (mouseY - curY) * 0.12
      ring.style.transform = `translate(${curX - 20}px, ${curY - 20}px)`
      rafId = requestAnimationFrame(animate)
    }

    const onOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        ring.classList.add('cursor-hover')
      }
    }
    const onOut = (e) => {
      if (!e.relatedTarget?.closest('a, button, [data-hover]')) {
        ring.classList.remove('cursor-hover')
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  )
}
