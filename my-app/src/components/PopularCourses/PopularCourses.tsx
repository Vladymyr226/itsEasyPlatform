import s from './PopularCourses.module.css'

import popularCourseImage from '../../assets/popularCourse.png'
import clock from '../../assets/greyClock.svg'
import notebook from '../../assets/greyNotebook.svg'
import stat from '../../assets/statistics.svg'
import Image from 'next/image'

import Rating from '../Rating/Rating'

const PopularCourses = () => {
  return (
    <ul className={s.popularCoursesList}>
      <li className={s.courseItem}>
        <div className={s.courseItemHeader}>
          <Image src={popularCourseImage} alt='programmer' />
        </div>
        <div className={s.courseItemFooter}>
          <p className={s.courseTitle}>
            <span className={s.accentuated}>javaScript Advamced</span> - продвинутые концепции...
          </p>
          <ul className={s.courseInfo}>
            <li>
              <span className={s.accentuated}>Язык</span> ru, eng
            </li>
            <li>
              <span className={s.accentuated}>Преподаёт</span> Артем Лаврентев
            </li>
          </ul>
          <Rating isBig={true} isSmall={true} />
          <ul className={s.courseDetails}>
            <li>
              <Image src={clock} alt='clock' /> 16 ч
            </li>
            <li>
              <Image src={notebook} alt='notebook' /> 84 лекций
            </li>
            <li>
              <Image src={stat} alt='stat' /> Начальный
            </li>
          </ul>
          <button className={s.courseButton}>Узнать больше</button>
        </div>
      </li>
      <li className={s.courseItem}>
        <div className={s.courseItemHeader}>
          <Image src={popularCourseImage} alt='programmer' />
        </div>
        <div className={s.courseItemFooter}>
          <p className={s.courseTitle}>
            <span className={s.accentuated}>javaScript Advamced</span> - продвинутые концепции...
          </p>
          <ul className={s.courseInfo}>
            <li>
              <span className={s.accentuated}>Язык</span> ru, eng
            </li>
            <li>
              <span className={s.accentuated}>Преподаёт</span> Артем Лаврентев
            </li>
          </ul>
          <Rating isBig={true} isSmall={true} />
          <ul className={s.courseDetails}>
            <li>
              <Image src={clock} alt='clock' /> 16 ч
            </li>
            <li>
              <Image src={notebook} alt='notebook' /> 84 лекций
            </li>
            <li>
              <Image src={stat} alt='stat' /> Начальный
            </li>
          </ul>
          <button className={s.courseButton}>Узнать больше</button>
        </div>
      </li>
      <li className={s.courseItem}>
        <div className={s.courseItemHeader}>
          <Image src={popularCourseImage} alt='programmer' />
        </div>
        <div className={s.courseItemFooter}>
          <p className={s.courseTitle}>
            <span className={s.accentuated}>javaScript Advamced</span> - продвинутые концепции...
          </p>
          <ul className={s.courseInfo}>
            <li>
              <span className={s.accentuated}>Язык</span> ru, eng
            </li>
            <li>
              <span className={s.accentuated}>Преподаёт</span> Артем Лаврентев
            </li>
          </ul>
          <Rating isBig={true} isSmall={true} />

          <ul className={s.courseDetails}>
            <li>
              <Image src={clock} alt='clock' /> 16 ч
            </li>
            <li>
              <Image src={notebook} alt='notebook' /> 84 лекций
            </li>
            <li>
              <Image src={stat} alt='stat' /> Начальный
            </li>
          </ul>
          <button className={s.courseButton}>Узнать больше</button>
        </div>
      </li>
    </ul>
  )
}

export default PopularCourses
