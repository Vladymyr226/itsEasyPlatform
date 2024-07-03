import s from './CourseDescription.module.css'

import Button from '../Button/Button'
import CourseControlls from '../CourseControlls/CourseControlls'
import SlateView from '../../components/SlateEditor/View'
import CourseImage from '../CourseImage/CourseImage'
import Link from 'next/link'
import { useEffect, useState } from 'react'
interface CourseDescriptionProps {
  title: string
  language: string
  level: string
  date: string
  type: string
  description: any
  rating: number
  id: string
  mediaValue: any
}
const CourseDescription = (props: CourseDescriptionProps) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={s.courseDescription}>
      <div className={s.descHeader}>
        <h2 className={s.descTitle}>
          {props.title}
          {/* <span className={s.accentuated}>Backend</span> разработчик */}
        </h2>
        <CourseControlls />
      </div>
      <ul className={s.descInfo}>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Язык</p>
          <p className={s.infoItemContent}> {props.language}</p>
        </li>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Уровень</p>
          <p className={s.infoItemContent}>{props.level}</p>
        </li>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Создан</p>
          <p className={s.infoItemContent}>01.02.2023</p>
        </li>
        {props.type == 'with-lector' && (
          <li className={s.infoItem}>
            <p className={s.infoItemTitle}>Старт группы</p>
            <p className={s.infoItemContent}>{props.date}</p>
          </li>
        )}
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Тип</p>
          <p className={s.infoItemContent}>{props.type}</p>
        </li>
      </ul>

      {width < 1200 && <CourseImage mediaValue={props.mediaValue} rating={props.rating} />}

      {width > 1200 ? (
        <p
          className={s.descText}
          style={{
            minWidth: '50rem',
            maxWidth: '90rem',
            maxHeight: '7rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <SlateView value={props.description} />
        </p>
      ) : (
        <p
          className={s.descText}
          style={{
            width: '100%',
            maxHeight: '7rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <SlateView value={props.description} />
        </p>
      )}

      <Link href={'/course-details?id=' + props.id}>
        <Button text='Узнать больше' />
      </Link>
    </div>
  )
}

export default CourseDescription
