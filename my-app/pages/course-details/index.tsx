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

const CourseDetails = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  return (
    <Layout>
      <div className={s.coursePage}>
        <div className={s.leftSide}>
          <div className={s.courseTitle}>
            <h1>
              <span className={s.accentuated}>Frontend</span> разработчик
            </h1>
            <CourseControlls />
          </div>

          <div className={s.courseImageWrapper}>
            <Image className={s.courseImage} src={courseImage} alt='course' />
            <PlayButton />
            <div className={s.courseStatsWrapper}>
              <Rating />
              <ViewsCount />
            </div>
          </div>

          {width < 1200 && <CourseSidebar />}

          <p className={s.courseSubTitle}>
            <span className={s.accentuated}>Описание</span> курса
          </p>

          <ul className={s.descInfo}>
            <li className={s.infoItem}>
              <p className={s.infoItemTitle}>Язык</p>
              <p className={s.infoItemContent}>ru, eng</p>
            </li>
            <li className={s.infoItem}>
              <p className={s.infoItemTitle}>Уровень</p>
              <p className={s.infoItemContent}>средний</p>
            </li>
            <li className={s.infoItem}>
              <p className={s.infoItemTitle}>Дата начала курса</p>
              <p className={s.infoItemContent}>01.02.2023</p>
            </li>
          </ul>
          <p className={s.descText}>
            Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул
            в электронный дизайн. <br />
            <br /> Его популяризации в новое время послужили публикация листов Letraset с образцами
            Lorem Ipsum в 60-х годах и, в более недавнее время. <br />
            <br /> Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet
            orci. Aenean dignissim pellentesque felis.
            <br />
            <br /> Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in,
            pharetra a, ultricies in, diam. Sed arcu. Cras consequat.
          </p>

          <p
            style={{ textAlign: `${width < 1200 ? 'center' : 'left'}` }}
            className={s.courseSubTitle}
          >
            <span className={s.accentuated}>Материалы</span> курса
          </p>
          <CourseMaterials />

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
            <CourseSidebar />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default CourseDetails
