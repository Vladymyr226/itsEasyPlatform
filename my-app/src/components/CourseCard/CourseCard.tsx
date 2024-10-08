import React, { useEffect, useState } from 'react'
import CourseDescription from '../CourseDescription/CourseDescription'
import CourseImage from '../CourseImage/CourseImage'
import s from './CourseCard.module.css'
import courseShadow from '../../../src/assets/shadows/courseHoverShadow.png'
import Image from 'next/image'

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
  mediaValue: any
  createdAt: string
  views: number
  isFavoriteStart: boolean
  userData: any
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
    <div className={`${s.courseImageWrapper} `}>
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
          mediaValue={props.mediaValue}
          createdAt={props.createdAt}
          views={props.views}
          isFavoriteStart={props.isFavoriteStart}
          userData={props.userData}
        />

        {width >= 1200 && (
          <CourseImage mediaValue={props.mediaValue} rating={props.rating} views={props.views} />
        )}
        <Image className={s.shadow} src={courseShadow} alt='shadow' />
      </div>
    </div>
  )
}

export default CourseCard
