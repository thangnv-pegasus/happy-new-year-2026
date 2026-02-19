import { memo } from 'react';
import './FloatingElements.css';

export const FloatingElements = memo(function FloatingElements() {
  const elements = [
    { icon: '🌸', delay: 0, duration: 8 },
    { icon: '💖', delay: 1, duration: 10 },
    { icon: '✨', delay: 2, duration: 7 },
    { icon: '🌸', delay: 3, duration: 9 },
    { icon: '💝', delay: 4, duration: 11 },
    { icon: '🌺', delay: 5, duration: 8 },
    { icon: '💫', delay: 6, duration: 10 },
    { icon: '🌸', delay: 2.5, duration: 9 },
    { icon: '❤️', delay: 4.5, duration: 8 },
    { icon: '✨', delay: 1.5, duration: 10 },
    { icon: '🌸', delay: 3.5, duration: 7 },
    { icon: '💕', delay: 5.5, duration: 9 },
  ];

  return (
    <div className="floating-elements-container">
      {elements.map((element, index) => (
        <div
          key={index}
          className="floating-element"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
            fontSize: `${1.5 + Math.random() * 1.5}rem`,
          }}
        >
          {element.icon}
        </div>
      ))}
      
      {/* Falling sakura petals */}
      {Array.from({ length: 15 }).map((_, index) => (
        <div
          key={`petal-${index}`}
          className="sakura-petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        >
          🌸
        </div>
      ))}
      
      {/* Twinkling stars */}
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={`star-${index}`}
          className="twinkling-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
});
