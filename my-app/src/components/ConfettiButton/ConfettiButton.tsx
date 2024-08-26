import { getLocale } from '@/utils/getLocale'
import { useEffect, useRef, useState } from 'react'

type Confetto = {
  color: { front: string; back: string }
  x: number
  y: number
  radius: number
  velocity: { x: number; y: number }
  update: () => void
}

type Sequin = {
  color: string
  x: number
  y: number
  radius: number
  velocity: { x: number; y: number }
  update: () => void
}

const colors = [
  { front: '#7b5cff', back: '#6245e0' }, // Purple
  { front: '#b3c7ff', back: '#8fa5e5' }, // Light Blue
  { front: '#5c86ff', back: '#345dd1' }, // Darker Blue
]

const ConfettiButton = ({
  onClickFunction,
  completeButtonState,
}: {
  onClickFunction: any
  completeButtonState: any
}) => {
  const t = getLocale()
  const [buttonState, setButtonState] = useState<'ready' | 'loading' | 'complete'>('ready')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [confetti, setConfetti] = useState<Confetto[]>([])
  const [sequins, setSequins] = useState<Sequin[]>([])
  useEffect(() => {
    setTimeout(() => {
      setButtonState(completeButtonState)
      if (completeButtonState == 'complete') {
        initBurst()
      }
    }, 1800)
  }, [completeButtonState])
  useEffect(() => {
    function handleResize() {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      confetti.forEach((confetto, index) => {
        ctx.fillStyle = confetto.color.front
        ctx.beginPath()
        ctx.arc(confetto.x, confetto.y, confetto.radius, 0, Math.PI * 2)
        confetto.update()
        ctx.fill()
        if (confetto.y > ctx.canvas.height) confetti.splice(index, 1)
      })
      sequins.forEach((sequin, index) => {
        ctx.fillStyle = sequin.color
        ctx.beginPath()
        ctx.arc(sequin.x, sequin.y, sequin.radius, 0, Math.PI * 2)
        sequin.update()
        ctx.fill()
        if (sequin.y > ctx.canvas.height) sequins.splice(index, 1)
      })
      requestAnimationFrame(render)
    }
    render()
  }, [confetti, sequins])

  const handleClick = () => {
    onClickFunction()
    setButtonState('loading')
  }

  const initBurst = () => {
    const newConfetti: Confetto[] = []
    const newSequins: Sequin[] = []
    for (let i = 0; i < 20; i++) {
      newConfetti.push(createConfetto())
    }
    for (let i = 0; i < 10; i++) {
      newSequins.push(createSequin())
    }
    setConfetti(newConfetti)
    setSequins(newSequins)
  }

  const createConfetto = (): Confetto => {
    const buttonRect = buttonRef.current?.getBoundingClientRect()
    const buttonCenterX = (buttonRect?.left || 0) + (buttonRect?.width || 0) / 2
    const buttonCenterY = (buttonRect?.top || 0) + (buttonRect?.height || 0) / 2

    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      x: buttonCenterX,
      y: buttonCenterY,
      radius: Math.random() * 4 + 1,
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * -10 - 5,
      },
      update() {
        this.velocity.y += 0.5 // gravity
        this.x += this.velocity.x
        this.y += this.velocity.y
      },
    }
  }

  const createSequin = (): Sequin => {
    const buttonRect = buttonRef.current?.getBoundingClientRect()
    const buttonCenterX = (buttonRect?.left || 0) + (buttonRect?.width || 0) / 2
    const buttonCenterY = (buttonRect?.top || 0) + (buttonRect?.height || 0) / 2

    return {
      color: colors[Math.floor(Math.random() * colors.length)].back,
      x: buttonCenterX,
      y: buttonCenterY,
      radius: Math.random() * 2 + 1,
      velocity: {
        x: (Math.random() - 0.5) * 5,
        y: Math.random() * -5 - 2,
      },
      update() {
        this.velocity.y += 0.3 // gravity
        this.x += this.velocity.x
        this.y += this.velocity.y
      },
    }
  }

  return (
    <div className='confetti-button-container'>
      <button ref={buttonRef} onClick={handleClick} className={`confetti-button ${buttonState}`}>
        <span className='button-content'>
          {buttonState === 'ready' && (
            <>
              <div style={{ display: 'flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 13 12.2'
                  fill='none'
                  stroke='#5c86ff' // Blue for ready
                  className='icon'
                >
                  <polyline points='2,7.1 6.5,11.1 11,7.1' />
                  <line x1='6.5' y1='1.2' x2='6.5' y2='10.3' />
                </svg>
                <span>{t.complete}</span>
              </div>
            </>
          )}
          {buttonState === 'loading' && (
            <span>Loading...</span> // No icon for loading state
          )}
          {buttonState === 'complete' && (
            <>
              <div style={{ display: 'flex' }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 13 11'
                  fill='none'
                  stroke='#5cffa1' // Green for success
                  className='icon'
                  style={{
                    opacity: 1,
                    transform: 'translateY(0)',
                  }}
                >
                  <polyline points='1.4,5.8 5.1,9.5 11.6,2.1' />
                </svg>
                <span>Success!</span>
              </div>
            </>
          )}
        </span>
      </button>
      <canvas ref={canvasRef} className='confetti-canvas' />
      <style jsx>{`
        .confetti-button-container {
          position: relative;
          width: 100px;
          height: 50px;
        }
        .confetti-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: none;
          background-color: #1f2335; // Dark background
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s ease;
        }
        .confetti-button.ready .icon {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .confetti-button.loading .button-content span {
          animation: blink-animation 1s linear infinite;
        }
        .confetti-button.complete .icon {
          opacity: 1; // Ensure visibility
          transform: translateY(0); // Reset any transform
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        @keyframes blink-animation {
          50% {
            opacity: 0;
          }
        }
        .confetti-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .icon {
          width: 14px; // Adjusted SVG size
          height: auto;
          margin-right: 8px;
        }
      `}</style>
    </div>
  )
}

export default ConfettiButton
