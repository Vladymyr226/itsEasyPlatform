import React, { useEffect, useState } from 'react'
import CourseDescription from '../CourseDescription/CourseDescription'
import CourseImage from '../CourseImage/CourseImage'
import s from './CourseCard.module.css'

const CourseCard = ({ toLeft = false }: { toLeft?: boolean }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={`${s.courseCard} ${toLeft ? s.reverse : ''}`}>
      <CourseDescription />

      {width >= 1200 && <CourseImage />}
    </div>
  )
}

export default CourseCard
