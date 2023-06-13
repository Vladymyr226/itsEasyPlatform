import s from './DropModal.module.css'
import cross from '../../assets/cross.svg'
import crossHover from '../../assets/crossHover.svg'
import shadow from '../../assets/shadows/courseHoverShadow.png'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type DropModalProps = {
  children: React.ReactNode
  setIsDropModalShown: (isShown: boolean) => void
  indents?: { top: number; right: number }
  isUsermenu?: boolean
}

const DropModal = ({ children, setIsDropModalShown, indents, isUsermenu }: DropModalProps) => {
  const [isCrossHover, setIsCrossHover] = useState(false)

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsDropModalShown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsDropModalShown])

  return (
    <>
      <div
        ref={divRef}
        style={indents && indents}
        className={`${s.dropModal} ${isUsermenu ? s.userDropModal : ''}`}
      >
        <Image
          onMouseEnter={() => {
            setIsCrossHover(true)
          }}
          onMouseLeave={() => {
            setIsCrossHover(false)
          }}
          onClick={() => {
            setIsDropModalShown(false)
            setIsCrossHover(false)
          }}
          className={s.dropModalClose}
          src={isCrossHover ? crossHover : cross}
          alt='cross'
        />
        {children}
      </div>

      <Image
        className={`${s.shadow} ${isUsermenu ? s.userShadow : ''}`}
        src={shadow}
        alt='shadow'
      />
    </>
  )
}

export default DropModal
