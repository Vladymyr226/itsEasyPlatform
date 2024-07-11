import s from './CourseDescription.module.css'

import Button from '../Button/Button'
import CourseControlls from '../CourseControlls/CourseControlls'
import SlateView from '../../components/SlateEditor/View'
import CourseImage from '../CourseImage/CourseImage'
import ru from '../../assets/ru.svg'
import en from '../../assets/en.svg'
import ua from '../../assets/ua.svg'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getLocale } from '@/utils/getLocale'
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
  createdAt: string
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
  const t = getLocale()
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
          <p className={s.infoItemTitle}>{t.language}</p>
          <p className={s.infoItemContent}>
            {props.language == 'RU' && (
              <div style={{ height: '20px', width: '20px' }}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6' width='35' height='20'>
                  <rect fill='#fff' width='9' height='3' />
                  <rect fill='#d52b1e' y='3' width='9' height='3' />
                  <rect fill='#0039a6' y='2' width='9' height='2' />
                </svg>
              </div>
            )}
            {props.language == 'UA' && (
              <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                <svg xmlns='http://www.w3.org/2000/svg' width='35' height='20'>
                  <rect width='1200' height='10' fill='#0057B7' />
                  <rect width='1200' height='10' y='10' fill='#FFD700' />
                </svg>
              </div>
            )}
            {props.language == 'EN' && (
              <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 30' width='35' height='20'>
                  <clipPath id='t'>
                    <path d='M25,15h25v15zv15h-25zh-25v-15zv-15h25z' />
                  </clipPath>
                  <path d='M0,0v30h50v-30z' fill='#012169' />
                  <path d='M0,0 50,30M50,0 0,30' stroke='#fff' stroke-width='6' />
                  <path
                    d='M0,0 50,30M50,0 0,30'
                    clip-path='url(#t)'
                    stroke='#C8102E'
                    stroke-width='4'
                  />
                  <path
                    d='M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z'
                    fill='#C8102E'
                    stroke='#FFF'
                    stroke-width='2'
                  />
                </svg>
              </div>
            )}
          </p>
        </li>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>{t.level}</p>
          <p className={s.infoItemContent}>{props.level}</p>
        </li>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>{t.created_date}</p>
          <p className={s.infoItemContent}>{new Date().toISOString().split('T')[0]}</p>
        </li>
        {props.type == 'with-lector' && (
          <li className={s.infoItem}>
            <p className={s.infoItemTitle}>{t.start_date}</p>
            <p className={s.infoItemContent}>{props.date}</p>
          </li>
        )}
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>{t.type}</p>
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
            maxHeight: '10rem',
            overflowY: 'auto',
          }}
        >
          <SlateView value={props.description} />
        </p>
      ) : (
        <p
          className={s.descText}
          style={{
            width: '100%',
            maxHeight: '10rem',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <SlateView value={props.description} />
        </p>
      )}

      <Link
        href={'/course-details?id=' + props.id}
        onClick={(e) => {
          localStorage.setItem('SelectedCourseIndex', props.id + '')
        }}
      >
        <Button text={t.learn_more} />
      </Link>
    </div>
  )
}

export default CourseDescription
