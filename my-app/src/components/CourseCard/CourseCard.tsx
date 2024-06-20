import React, { useEffect, useState } from 'react'
import CourseDescription from '../CourseDescription/CourseDescription'
import CourseImage from '../CourseImage/CourseImage'
import s from './CourseCard.module.css'

interface CourseCardProps {
  title: string
  language: string
  level: string
  date: string
  type: string
  description: any
  rating: number
  toLeft: boolean
  id: string
}
const CourseCard = (props: CourseCardProps) => {
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
    <div className={`${s.courseCard} ${props.toLeft ? s.reverse : ''}`}>
      <CourseDescription
        title={props.title}
        language={props.language}
        level={props.level}
        date={props.date}
        type={props.type}
        description={props.description}
        rating={props.rating}
        id={props.id}
      />

      {width >= 1200 && <CourseImage rating={props.rating} />}
    </div>
  )
}

export default CourseCard
