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

const Prices = ({ price, groupPrice }: { price: number; groupPrice?: number }) => {
  return (
    <>
      <h3 className={s.sidebarTitle}>Самообучение</h3>
      <div className={s.priceWrapper}>
        <span className={s.prevPrice}>${price + 100}</span>
        <span className={s.currentPrice}>${price}</span>
      </div>
      <button className={s.sidebarFillButton}>Купить сейчас</button>
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
  modules,
  lessonsNum,
  groupPrice,
  rating,
}: {
  price: number
  modules: any
  lessonsNum: number
  groupPrice?: number
  rating: number
}) => {
  const [width, setWidth] = useState(0)
  const [lessonsSum, setLessonsSum] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])
  console.log(rating)
  return (
    <div className={s.sidebar}>
      {width >= 1200 && <Prices price={price} />}
      <p className={s.sidebarSubTitle}>Этот курс включает</p>
      {/* <div className={s.courseContent}>
        <Image src={video} alt='video' /> 22 часа видео лекций
      </div> */}
      {/* <div className={s.courseContent}>
        <Image src={certificate} alt='certificate' /> Сертификат об окончании курсов
      </div> */}
      <div className={s.courseContent}>
        <Image src={calendar} alt='calendar' /> Длительность курса 3 месяца
      </div>
      <div className={s.courseContent}>
        <Image src={notes} alt='notes' />
        {lessonsNum} урока
      </div>
      <div className={s.courseContent}>
        <Image src={USB} alt='USB' /> {modules && modules.length} разделов
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
        {/* <ViewsCount /> */}
      </div>

      <div className={s.divide}></div>

      {width < 1200 && <Prices price={price} />}

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
