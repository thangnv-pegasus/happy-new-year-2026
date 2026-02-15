import { useState } from 'react';
import './Card.css';

interface CardProps {
  onOpen: () => void;
}

export function Card({ onOpen }: CardProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenCard = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpened(true);
      onOpen();
    }, 1500);
  };

  if (isOpened) return null;

  return (
    <div className="card-container">
      <div className={`greeting-card ${isOpening ? 'opening' : ''}`}>
        {/* Card Front */}
        <div className="card-front">
          <div className="card-border">
            <div className="peach-blossom-decoration top-left"></div>
            <div className="peach-blossom-decoration top-right"></div>
            <div className="peach-blossom-decoration bottom-left"></div>
            <div className="peach-blossom-decoration bottom-right"></div>
            
            <div className="card-content-front">
              <div className="year-badge">2026</div>
              <h2 className="card-title-front">Chúc Mừng<br/>Năm Mới</h2>
              <div className="blossom-icon">🌸</div>
              <p className="card-subtitle">Xuân Bính Ngọ</p>
              
              {!isOpening && (
                <button className="open-button" onClick={handleOpenCard}>
                  <span className="button-text">Mở Thiệp</span>
                  <span className="button-icon">💌</span>
                </button>
              )}
            </div>
            
            <div className="wax-seal">
              <div className="seal-inner">❤️</div>
            </div>
          </div>
        </div>

        {/* Card Back */}
        <div className="card-back">
          <div className="card-inner-content">
            <div className="inner-decoration"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
