import s from './CourseGridCard.module.css'

import notebook from '../../assets/greyNotebook.svg'
import stat from '../../assets/statistics.svg'
import Image from 'next/image'
import courseShadow from '../../../src/assets/shadows/courseHoverShadow.png'
import Rating from '../Rating/Rating'
import { useRouter } from 'next/navigation'
import { getLocale } from '@/utils/getLocale'
import { Module } from '@/utils/interfaces'
import { useEffect, useRef, useState } from 'react'
import { LinearProgress } from '@mui/material'
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`

const CourseGridCard = ({ course, showProgress }: { course: any; showProgress?: boolean }) => {
  const router = useRouter()
  let tmpSum = 0
  course.data.modules.map(async (module: any) => {
    module.lessons.map(async (lessonId: string) => {
      tmpSum += 1
    })
  })
  const t = getLocale()

  const [userData, setUserData] = useState<any>()

  async function getPageData() {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href
      const userId = localStorage.getItem('UserID')
      if (userId) {
        const responseUser = await fetch(urlUser + '/' + userId, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const resultUser = await responseUser.json()

        setUserData(resultUser)
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getPageData()
    }
  }, [])

  function getProgress(course: any) {
    let summ = 0
    let summCompleted = 0
    course.modules.map((module: Module) => {
      module.lessons.map((lesson) => {
        summ += 1
        if (userData.comleted_lessons_id.indexOf(lesson) != -1) {
          summCompleted += 1
        }
      })
    })

    return summ == 0 ? 0 : (summCompleted * 100) / summ
  }
  const refImg = useRef<any>(null)
  const refContainer = useRef<any>(null)
  return (
    <div className={`${s.courseImageWrapper} `}>
      <li className={s.courseItem}>
        <div ref={refContainer} style={{ maxWidth: '330px' }}>
          <div
            className={s.courseItemHeader}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {course.data.mediaValue.type == 'image' ? (
              <img
                ref={refImg}
                className={s.courseItemHeader}
                src={course.data.mediaValue.content}
                style={{
                  objectFit: 'cover',
                }}
                alt='programmer'
              />
            ) : (
              <video
                className={s.courseItemHeader}
                src={course.data.mediaValue.content}
                style={{
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>
          <div className={s.courseItemFooter}>
            <p className={s.courseTitle}>
              <span
                className={s.accentuated}
                style={{
                  textWrap: 'wrap',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {course.data.title}
              </span>
            </p>
            <ul className={s.courseInfo}>
              <li style={{ display: 'flex', gap: '10px' }}>
                <span className={s.accentuated}>{t.language}</span>
                {course.language == 'RU' && (
                  <div style={{ height: '20px', width: '10px' }}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 9 6'
                      width='20'
                      height='10'
                    >
                      <rect fill='#c7c6c6' width='9' height='3' />
                      <rect fill='#d52b1e' y='3' width='9' height='3' />
                      <rect fill='#0039a6' y='2' width='9' height='2' />
                    </svg>
                  </div>
                )}
                {course.language == 'UA' && (
                  <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='10'>
                      <rect width='1200' height='5' fill='#0057B7' />
                      <rect width='1200' height='5' y='5' fill='#FFD700' />
                    </svg>
                  </div>
                )}
                {course.language == 'EN' && (
                  <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 50 30'
                      width='20'
                      height='10'
                    >
                      <clipPath id='t'>
                        <path d='M25,15h25v15zv15h-25zh-25v-15zv-15h25z' />
                      </clipPath>
                      <path d='M0,0v30h50v-30z' fill='#012169' />
                      <path d='M0,0 50,30M50,0 0,30' stroke='#c7c6c6' stroke-width='6' />
                      <path
                        d='M0,0 50,30M50,0 0,30'
                        clip-path='url(#t)'
                        stroke='#C8102E'
                        stroke-width='4'
                      />
                      <path
                        d='M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z'
                        fill='#C8102E'
                        stroke='#c7c6c6'
                        stroke-width='2'
                      />
                    </svg>
                  </div>
                )}
              </li>
              <li>
                <span className={s.accentuated}>{t.type}</span>
                {course.data.type == 'with-lector' ? ' ' + t.with_lector : ' ' + t.self_education}
              </li>
              {course.data.type == 'with-lector' ? (
                <li>
                  <span className={s.accentuated}>Преподаёт</span> {course.data.lector}
                </li>
              ) : (
                <li>&nbsp;</li>
              )}
            </ul>
            <Rating isBig={true} isSmall={true} rating={course.data.rating} />
            <ul className={s.courseDetails}>
              <li>
                <Image src={notebook} alt='notebook' /> {tmpSum} {t.lectures}
              </li>
              <li>
                <Image src={stat} alt='stat' /> {course.data.level}
              </li>
            </ul>
            {userData && showProgress && (
              <LinearProgress
                variant='determinate'
                sx={{
                  marginTop: 2,
                  backgroundColor: 'white',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'green',
                  },
                }}
                value={getProgress(course.data)}
              />
            )}

            <div style={{ display: 'flex' }}>
              <button
                className={s.courseButton}
                onClick={(e) => {
                  localStorage.setItem('SelectedCourseIndex', course.id)
                  router.push('/course-details?id=' + course.id)
                }}
              >
                {t.learn_more}
              </button>
              <div className={s.priceWrapper}>
                {course.data.priceDiscount && course.data.priceDiscount > 0 ? (
                  <span className={s.prevPrice}>${course.data.price}</span>
                ) : (
                  <></>
                )}
                <span className={s.currentPrice}>
                  $
                  {course.data.priceDiscount && course.data.priceDiscount > 0
                    ? course.data.priceDiscount
                    : course.data.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
      <Image className={s.shadow} src={courseShadow} alt='shadow' />
    </div>
  )
}

export default CourseGridCard
