import { useState, useEffect } from 'react'

export const useTypewriter = (text: string, speed: number = 30, startDelay: number = 0, enabled: boolean = true) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setDisplayedText('')
      setIsComplete(false)
      return
    }

    setDisplayedText('')
    setIsComplete(false)

    const startTimeout = setTimeout(() => {
      let currentIndex = 0

      const intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          setIsComplete(true)
          clearInterval(intervalId)
        }
      }, speed)

      return () => clearInterval(intervalId)
    }, startDelay)

    return () => clearTimeout(startTimeout)
  }, [text, speed, startDelay, enabled])

  return { displayedText, isComplete }
}
