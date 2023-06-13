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

const Prices = () => {
  return (
    <>
      <h3 className={s.sidebarTitle}>Самообучение</h3>
      <div className={s.priceWrapper}>
        <span className={s.prevPrice}>$250</span>
        <span className={s.currentPrice}>$199</span>
      </div>
      <button className={s.sidebarFillButton}>Купить сейчас</button>

      <div className={s.divide}></div>

      <h3 className={s.sidebarTitle}>Групповые занятия</h3>
      <span className={s.currentPrice}>от $99/мес</span>

      <button className={s.sidebarOutlinedButton}>Записаться</button>

      <div className={s.divide}></div>
    </>
  )
}

const CourseSidebar = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  return (
    <div className={s.sidebar}>
      {width >= 1200 && <Prices />}
      <p className={s.sidebarSubTitle}>Этот курс включает</p>
      <div className={s.courseContent}>
        <Image src={video} alt='video' /> 22 часа видео лекций
      </div>
      <div className={s.courseContent}>
        <Image src={certificate} alt='certificate' /> Сертификат об окончании курсов
      </div>
      <div className={s.courseContent}>
        <Image src={calendar} alt='calendar' /> Длительность курса 3 месяца
      </div>
      <div className={s.courseContent}>
        <Image src={notes} alt='notes' /> 24 урока
      </div>
      <div className={s.courseContent}>
        <Image src={USB} alt='USB' /> 10 разделов
      </div>
      <div className={s.courseContent}>
        <Image src={exercises} alt='exercises' /> 42 текстовых заданий
      </div>
      <div className={s.courseContent}>
        <Image src={notebook} alt='notebook' /> 100 лекций
      </div>
      <div className={s.courseContent}>
        <Image src={watch} alt='watch' /> 38 часов консультации ментора
      </div>
      <div className={s.courseContent}>
        <Image src={time} alt='time' /> Общая продолжительность 29 ч 48 мин
      </div>

      <div className={s.courseStatsWrapper}>
        <Rating isBig={true} />
        <ViewsCount />
      </div>

      <div className={s.divide}></div>

      {width < 1200 && <Prices />}

      <p className={s.footerTitle}>Планируете обучение 5 или более человек?</p>
      <p className={s.footerText}>
        Получите доступ к более чем 57 лучших курсов на IT’s easy для своей команды - когда угодно,
        где угодно.
      </p>
      <button className={s.footerButton}>Получить IT’s easy business </button>
    </div>
  )
}

export default CourseSidebar
