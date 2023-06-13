import s from './CourseDescription.module.css'

import Button from '../Button/Button'
import CourseControlls from '../CourseControlls/CourseControlls'
import CourseImage from '../CourseImage/CourseImage'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CourseDescription = () => {
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
          <span className={s.accentuated}>Backend</span> разработчик
        </h2>
        <CourseControlls />
      </div>
      <ul className={s.descInfo}>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Язык</p>
          <p className={s.infoItemContent}>RU, ENG</p>
        </li>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Уровень</p>
          <p className={s.infoItemContent}>Средний</p>
        </li>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Создан</p>
          <p className={s.infoItemContent}>01.02.2023</p>
        </li>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Старт группы</p>
          <p className={s.infoItemContent}>12.05.2023</p>
        </li>
        <li className={s.infoItem}>
          <p className={s.infoItemTitle}>Тип</p>
          <p className={s.infoItemContent}>Самообучение</p>
        </li>
      </ul>

      {width < 1200 && <CourseImage />}

      <p className={s.descText}>
        Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в
        электронный дизайн. <br />
        <br /> Его популяризации в новое время послужили публикация листов Letraset с образцами
        Lorem Ipsum в 60-х годах и, в более недавнее время.
      </p>

      <Link href='/course-details'>
        <Button text='Узнать больше' />
      </Link>
    </div>
  )
}

export default CourseDescription
