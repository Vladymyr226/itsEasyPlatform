'use client'
import s from './CourseControlls.module.css'
import heart from '../../assets/heart.svg'
import emptyHeart from '../../assets/greyHeart.svg'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const CourseControlls = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  const [isFavorite, setIsFavorite] = useState(false)
  const [isFavoriteHover, setIsFavoriteHover] = useState(false)

  return (
    <div className={s.iconsWrapper}>
      <Image
        onMouseEnter={() => width >= 1200 && setIsFavoriteHover(true)}
        onMouseLeave={() => width >= 1200 && setIsFavoriteHover(false)}
        onClick={() => setIsFavorite((prev) => !prev)}
        src={isFavorite || isFavoriteHover ? heart : emptyHeart}
        alt='heart'
      />
    </div>
  )
}

export default CourseControlls
