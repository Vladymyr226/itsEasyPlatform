'use client'
import s from './CourseSidebar.module.css'
import video from '../../assets/video.svg'
import certificate from '../../assets/certificate.svg'
import calendar from '../../assets/calendar.svg'
import exercises from '../../assets/exercises.svg'
import notes from '../../assets/notes.svg'
import time from '../../assets/time.svg'
import USB from '../../assets/USB.svg'
import watch from '../../assets/watch.svg'
import notebook from '../../assets/notebook.svg'
import Rating from '../Rating/Rating'
import ViewsCount from '../ViewsCount/ViewsCount'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getLocale } from '@/utils/getLocale'

const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`

const Prices = ({
  price,
  priceDiscount,
  groupPrice,
}: {
  price: number
  priceDiscount?: number
  groupPrice?: number
}) => {
  const [userData, setUserData] = useState<any>()
  async function getPageData() {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('UserID')
      const responseUser = await fetch(urlUser + '/' + userId, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resultUser = await responseUser.json()
      setUserData(resultUser)
    }
  }
  useEffect(() => {
    getPageData()
  }, [])
  const t = getLocale()
  return (
    <>
      <h3 className={s.sidebarTitle}>{t.self_education}</h3>
      <div className={s.priceWrapper}>
        {priceDiscount && priceDiscount > 0 ? <span className={s.prevPrice}>${price}</span> : <></>}
        <span className={s.currentPrice}>
          ${priceDiscount && priceDiscount > 0 ? priceDiscount : price}
        </span>
      </div>
      <button
        className={s.sidebarFillButton}
        onClick={async (e) => {
          const response = await axios.put(urlUser + '?id=' + userData.id, {
            purchasedCoursesId: [
              ...userData.purchased_courses_id,
              Number(localStorage.getItem('SelectedCourseIndex')),
            ],
            favouriteCoursesId: [...userData.favourite_courses_id],
            comletedLessonsId: [...userData.comleted_lessons_id],
          })

          const resultResponse = response.data
        }}
      >
        Купить сейчас
      </button>
      {groupPrice && (
        <div>
          <div className={s.divide}></div>

          <h3 className={s.sidebarTitle}>Групповые занятия</h3>
          <span className={s.currentPrice}>от $99/мес</span>

          <button className={s.sidebarOutlinedButton}>Записаться</button>
        </div>
      )}

      <div className={s.divide}></div>
    </>
  )
}

const CourseSidebar = ({
  price,
  priceDiscount,
  modules,
  lessonsNum,
  groupPrice,
  rating,
  duration,
  views,
}: {
  duration: number
  price: number
  priceDiscount?: number
  modules: any
  lessonsNum: number
  groupPrice?: number
  rating: number
  views: number
}) => {
  const [width, setWidth] = useState(0)
  const [lessonsSum, setLessonsSum] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  function declOfNum(number: number, titles: any) {
    const cases = [2, 0, 1, 1, 1, 2]
    return titles[
      number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
    ]
  }
  const t = getLocale()
  return (
    <div className={s.sidebar}>
      <Prices price={price} priceDiscount={priceDiscount} />
      <p className={s.sidebarSubTitle}>{t.this_course_includes}</p>
      {/* <div className={s.courseContent}>
        <Image src={video} alt='video' /> 22 часа видео лекций
      </div> */}
      {/* <div className={s.courseContent}>
        <Image src={certificate} alt='certificate' /> Сертификат об окончании курсов
      </div> */}
      <div className={s.courseContent}>
        <Image src={calendar} alt='calendar' /> {t.course_duration} {duration}
        {declOfNum(duration, [t.day1, t.day2, t.day3])}
      </div>
      <div className={s.courseContent}>
        <Image src={notes} alt='notes' />
        {lessonsNum} {t.lessons}
      </div>
      <div className={s.courseContent}>
        <Image src={USB} alt='USB' /> {modules && modules.length} {t.sections}
      </div>
      {/* <div className={s.courseContent}>
        <Image src={exercises} alt='exercises' /> 42 текстовых заданий
      </div> */}
      {/* <div className={s.courseContent}>
        <Image src={notebook} alt='notebook' /> 100 лекций
      </div> */}
      {/* <div className={s.courseContent}>
        <Image src={watch} alt='watch' /> 38 часов консультации ментора
      </div> */}
      {/* <div className={s.courseContent}>
        <Image src={time} alt='time' /> Общая продолжительность 29 ч 48 мин
      </div> */}

      <div className={s.courseStatsWrapper}>
        <Rating rating={rating} isBig={true} />
        <ViewsCount views={views} />
        {/* <ViewsCount /> */}
      </div>

      {/* <div className={s.divide}></div>

      {width < 1200 && <Prices price={price} priceDiscount={priceDiscount} />}

      <p className={s.footerTitle}>Планируете обучение 5 или более человек?</p>
      <p className={s.footerText}>
        Получите доступ к более чем 57 лучших курсов на IT’s easy для своей команды - когда угодно,
        где угодно.
      </p>
      <button className={s.footerButton}>Получить IT’s easy business </button> */}
    </div>
  )
}

export default CourseSidebar
