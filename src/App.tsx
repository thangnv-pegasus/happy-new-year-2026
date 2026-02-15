import { useState } from 'react'
import { Scene } from './components/Scene'
import { Card } from './components/Card'
import { Confetti } from './components/Confetti'
import { Fireworks2D } from './components/Fireworks2D'
import './App.css'

function App() {
  const [cardOpened, setCardOpened] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleCardOpen = () => {
    setCardOpened(true)
    setShowConfetti(true)
    setTimeout(() => setShowMessage(true), 500)
  }

  return (
    <>
      {cardOpened && (
        <>
          <Scene />
          <Fireworks2D />
        </>
      )}
      
      {!cardOpened && <Card onOpen={handleCardOpen} />}
      
      {showConfetti && <Confetti />}
      
      {cardOpened && (
        <div className="content">
          <div className={`message-container ${showMessage ? 'visible' : ''}`}>
            <h1 className="title">Chúc Mừng Năm Mới 2026</h1>
            <div className="subtitle-container">
              <h2 className="subtitle">Gửi Vợ Hư Của Chồng</h2>
              <div className="heart">❤️</div>
            </div>
            
            <div className="message">
              <p>Năm mới rồi, anh mong vợ luôn khỏe mạnh, vui vẻ và bớt lo nghĩ lại. Cảm ơn em vì đã luôn đồng hành cùng anh suốt một năm qua, từ những chuyện nhỏ nhặt nhất đến những lúc khó khăn. Có em ở bên, mọi thứ với anh đều nhẹ nhàng hơn rất nhiều. Năm mới, chúc vợ yêu của anh luôn bình an, công việc thuận lợi, gia đình mình lúc nào cũng ấm áp và đầy tiếng cười.</p>
            </div>
            
            <div className="wishes">
              <div className="wish-item">
                <span className="icon">🌸</span>
                <p>Năm mới an khang, hạnh phúc</p>
              </div>
              <div className="wish-item">
                <span className="icon">💝</span>
                <p>Tình yêu của chúng ta mãi bền lâu</p>
              </div>
              <div className="wish-item">
                <span className="icon">✨</span>
                <p>Mọi ước mơ đều trở thành hiện thực</p>
              </div>
            </div>
            
            <div className="signature">
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
