'use client'
import s from './CourseSidebar.module.css'
import calendar from '../../assets/calendar.svg'
import notes from '../../assets/notes.svg'
import USB from '../../assets/USB.svg'
import Rating from '../Rating/Rating'
import ViewsCount from '../ViewsCount/ViewsCount'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {getLocale} from '@/utils/getLocale'

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


    // const [form, setForm] = useState('');

    // useEffect(() => {
    //     test();
    // }, []);

    // useEffect(() => {
    //     if (form) {
    //         // Знаходимо input[type="image"]
    //         const inputImage = document.querySelector('input[type="image"]');
    //         if (inputImage) {
    //             // Створюємо новий елемент кнопки
    //             const button = document.createElement('button');
    //             button.innerText = 'Сплатити';
    //             button.type = 'submit';  // Надаємо кнопці тип submit, щоб вона виконувала дію форми

    //             // Додаємо стилі для кнопки
    //             button.style.height = '60px';
    //             button.style.borderRadius = '8px';
    //             button.style.cursor = 'pointer';
    //             button.style.width = '100%';
    //             button.style.marginTop = '14px';
    //             button.style.paddingTop = '11px';
    //             button.style.paddingBottom = '11px';
    //             button.style.border = 'none';
    //             button.style.fontWeight = '700';
    //             button.style.fontSize = '16px';
    //             button.style.lineHeight = '20px';
    //             button.style.textAlign = 'center';
    //             button.style.background = 'red';
    //             button.style.color = 'white';
    //             button.style.borderRadius = '7px';

    //             // Замінюємо input[type="image"] на нашу кнопку
    //             inputImage.replaceWith(button);
    //         }
    //     }
    // }, [form]);

    // const test = async () => {
    //     const response = await axios.post('https://its-easy-platform-back-end.vercel.app/api/payment/liqpay');
    //     setForm(response.data);
    // };

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
          // dangerouslySetInnerHTML={{ __html: form }}
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

            // const response = await axios.post('https://its-easy-platform-back-end.vercel.app/api/payment/redirect')
            // console.log(response);
        }}
      >
        {t.buy_now}
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

      <div className={s.courseStatsWrapper}>
        <Rating rating={rating} isBig={true} />
        <ViewsCount views={views} />
      </div>
    </div>
  )
}

export default CourseSidebar
