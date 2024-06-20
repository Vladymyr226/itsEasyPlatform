'use client'
import s from './CourseDetails.module.css'
import courseImage from '../../src/assets/courseImage.png'
import skillsImage from '../../src/assets/skillsImage.png'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Comments from '@/components/Comments/Comments'
import CourseControlls from '@/components/CourseControlls/CourseControlls'
import CourseMaterials from '@/components/CourseMaterials/CourseMaterials'
import CourseSidebar from '@/components/CourseSidebar/CourseSidebar'
import PlayButton from '@/components/PlayButton/PlayButton'
import PopularCourses from '@/components/PopularCourses/PopularCourses'
import Rating from '@/components/Rating/Rating'
import SkillsList from '@/components/SkillsList/SkillsList'
import ViewsCount from '@/components/ViewsCount/ViewsCount'
import Layout from '@/components/Layout/Layout'
import '../../app/globals.css'
import SlateView from '@/components/SlateEditor/View'

const url = 'https://its-easy-platform-back-end.vercel.app/api/cabinet/course'
const urlLesson = 'https://its-easy-platform-back-end.vercel.app/api/cabinet/lesson'
interface CourseData {
  title: string
  language: string
  level: string
  date: string
  type: string
  description: any
  rating: number
  duration: number
  lector: string
  modules: any
  price: number
}
interface Course {
  id: string
  data: CourseData
  is_active: boolean
}
const CourseDetails = () => {
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<Course>()
  console.log(data)
  async function getPageData() {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href

      if (fullUrl.split('id=')[1]) {
        const response = await fetch(url + '/' + fullUrl.split('id=')[1], {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
        const modules = await Promise.all(
          result.data.modules.map(async (module: any) => {
            const lessons = await Promise.all(
              module.lessons.map(async (lessonId: string) => {
                const responseLesson = await fetch(urlLesson + '/' + lessonId, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                const resultLesson = await responseLesson.json()
                return { id: resultLesson.id, data: resultLesson.data }
              })
            )
            return {
              title: module.title,
              lessons: lessons,
            }
          })
        )
        setData({ ...result, data: { ...result.data, modules: modules } })
      } else {
      }
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      getPageData()
    }
  }, [])

  return (
    <Layout>
      <div className={s.coursePage}>
        <div className={s.leftSide}>
          <div className={s.courseTitle}>
            <h1>
              {data && data.data.title}
              {/* <span className={s.accentuated}>Frontend</span> разработчик */}
            </h1>
            <CourseControlls />
          </div>

          <div className={s.courseImageWrapper}>
            <Image className={s.courseImage} src={courseImage} alt='course' />
            <PlayButton />
            <div className={s.courseStatsWrapper}>
              {data && <Rating rating={data?.data.rating} />}
              <ViewsCount />
            </div>
          </div>

          {width < 1200 && (
            <CourseSidebar price={data?.data.price ?? 0} rating={data?.data.price ?? 0} />
          )}

          <p className={s.courseSubTitle}>
            <span className={s.accentuated}>Описание</span> курса
          </p>

          <ul className={s.descInfo}>
            <li className={s.infoItem}>
              <p className={s.infoItemTitle}>Язык</p>
              <p className={s.infoItemContent}>{data && data.data.language}</p>
            </li>
            <li className={s.infoItem}>
              <p className={s.infoItemTitle}>Уровень</p>
              <p className={s.infoItemContent}>{data && data.data.level}</p>
            </li>
            <li className={s.infoItem}>
              <p className={s.infoItemTitle}>Дата начала курса</p>
              <p className={s.infoItemContent}>{data && data.data.date}</p>
            </li>
          </ul>
          {data && (
            <p className={s.descText}>
              <SlateView value={data && data.data.description} />
            </p>
          )}

          <p
            style={{ textAlign: `${width < 1200 ? 'center' : 'left'}` }}
            className={s.courseSubTitle}
          >
            <span className={s.accentuated}>Материалы</span> курса
          </p>
          {data && <CourseMaterials modules={data.data.modules} />}

          <p className={s.courseSubTitle}>
            <span className={s.accentuated}>Набор</span> навыков
          </p>

          <div
            style={{
              marginTop: 50,
            }}
            className={s.courseImageWrapper}
          >
            <Image className={s.courseImage} src={skillsImage} alt='skills' />
            <PlayButton />
          </div>

          <p style={{ fontSize: '24px' }} className={s.courseSubTitle}>
            <span className={s.accentuated}>Что говорят</span> выпускники
          </p>

          <Comments />

          <p
            style={{ textAlign: `${width < 1200 ? 'center' : 'left'}` }}
            className={s.courseSubTitle}
          >
            Чему вы <span className={s.accentuated}>научитесь</span>
          </p>
          <SkillsList />

          <p
            style={{
              fontSize: '24px',
              textAlign: `${width < 1200 ? 'center' : 'left'}`,
            }}
            className={s.courseSubTitle}
          >
            Вас может <span className={s.accentuated}>заинтересовать</span>
          </p>
          <PopularCourses />
        </div>

        {width >= 1200 && (
          <div className={s.rightSide}>
            <CourseSidebar price={data?.data.price ?? 0} rating={data?.data.price ?? 0} />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default CourseDetails
