import { useState, useEffect, lazy, Suspense } from 'react'
import { Card } from './components/Card'
import { FloatingElements } from './components/FloatingElements'
import { useTypewriter } from './hooks/useTypewriter'
import './App.css'

// Lazy load heavy components
const Scene = lazy(() => import('./components/Scene').then(m => ({ default: m.Scene })))
const Confetti = lazy(() => import('./components/Confetti').then(m => ({ default: m.Confetti })))
const Fireworks2D = lazy(() => import('./components/Fireworks2D').then(m => ({ default: m.Fireworks2D })))

function App() {
  const [cardOpened, setCardOpened] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showWishes, setShowWishes] = useState(false)
  const [showSignature, setShowSignature] = useState(false)

  const messageText = "Năm mới rồi, anh mong vợ luôn khỏe mạnh, vui vẻ và bớt lo nghĩ lại. Cảm ơn em vì đã luôn đồng hành cùng anh suốt một năm qua, từ những chuyện nhỏ nhặt nhất đến những lúc khó khăn. Có em ở bên, mọi thứ với anh đều nhẹ nhàng hơn rất nhiều. Năm mới, chúc vợ yêu của anh luôn bình an, công việc thuận lợi, gia đình lúc nào cũng ấm áp và đầy tiếng cười nhó! hehe."
  const { displayedText, isComplete } = useTypewriter(messageText, 50, 800, showMessage)
  
  useEffect(() => {
    if (isComplete) {
      setTimeout(() => setShowWishes(true), 500)
      setTimeout(() => setShowSignature(true), 1500)
    }
  }, [isComplete])

  const handleCardOpen = () => {
    setCardOpened(true)
    setShowConfetti(true)
    setTimeout(() => setShowMessage(true), 500)
  }

  return (
    <>
      <FloatingElements />
      
      {cardOpened && (
        <Suspense fallback={<div />}>
          <Scene />
          <Fireworks2D />
        </Suspense>
      )}
      
      {!cardOpened && <Card onOpen={handleCardOpen} />}
      
      {showConfetti && (
        <Suspense fallback={<div />}>
          <Confetti />
        </Suspense>
      )}
      
      {cardOpened && (
        <div className="content">
          <div className={`message-container ${showMessage ? 'visible' : ''}`}>
            <h1 className={`title ${showMessage ? 'animate-in' : ''}`}>Chúc Mừng Năm Mới 2026</h1>
            <div className={`subtitle-container ${showMessage ? 'animate-in' : ''}`}>
              <h2 className="subtitle">Gửi Vợ Hư Của Chồng</h2>
              <div className="heart">❤️</div>
            </div>
            
            <div className={`message ${showMessage ? 'animate-in' : ''}`}>
              <p>{displayedText}{!isComplete && <span className="cursor">|</span>}</p>
            </div>
            
            <div className={`wishes ${showWishes ? 'show' : ''}`}>
              <div className="wish-item" style={{ animationDelay: '0s' }}>
                <span className="icon">🌸</span>
                <p>Năm mới an khang, hạnh phúc</p>
              </div>
              <div className="wish-item" style={{ animationDelay: '0.2s' }}>
                <span className="icon">💝</span>
                <p>Tình yêu của chúng ta mãi bền lâu</p>
              </div>
              <div className="wish-item" style={{ animationDelay: '0.4s' }}>
                <span className="icon">✨</span>
                <p>Mọi ước mơ đều trở thành hiện thực</p>
              </div>
            </div>
            
            <div className={`signature ${showSignature ? 'show' : ''}`}>
              <p>Mãi yêu em ❤️</p>
              <p className="date">Xuân Bính Ngọ 2026</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
