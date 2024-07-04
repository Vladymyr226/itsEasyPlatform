'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import s from './HomePage.module.css'
import CourseCard from '@/components/CourseCard/CourseCard'
import FaqSection from '@/components/FaqSection/FaqSection'
import PopularArticles from '@/components/PopularArticles/PopularArticles'
import PromoSlider from '@/components/PromoSlider/PromoSlider'
import plus from '../src/assets/plus.svg'
import loadMoreButton from '../src/assets/loadMoreButton.png'
import Layout from '@/components/Layout/Layout'
import './globals.css'
import Link from 'next/link'
const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
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
  mediaValue: mediaDataValue
}
interface mediaDataValue {
  type: string
  content: string
}
interface Course {
  id: string
  data: CourseData
  is_active: boolean
}
export default function HomePage() {
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<Array<Course>>()

  async function getPageData() {
    if (typeof window !== 'undefined') {
      const response = await fetch(url + 's?isActive=true', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      setData(result.getCourses)
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
      <div className={s.homePage}>
        <PromoSlider />

        <h1 className={s.coursesTitle}>Курсы</h1>
        {data &&
          data.map((course: Course, index: number) => {
            return (
              <>
                <CourseCard
                  title={course.data.title}
                  language={course.data.language}
                  level={course.data.level}
                  date={course.data.date}
                  type={course.data.type}
                  description={course.data.description}
                  rating={course.data.rating}
                  toLeft={index % 2 == 1 ? true : false}
                  id={course.id}
                  mediaValue={course.data.mediaValue}
                />
              </>
            )
          })}

        {width >= 1200 ? (
          <Link href={'/allCourses'}>
            <button className={s.loadMoreButton}>
              Смотреть ещё курсы <Image src={plus} alt='plus' />
            </button>
          </Link>
        ) : (
          <div className={s.loadMoreImageWrapper}>
            <Image className={s.mobileLoadMoreButton} src={loadMoreButton} alt='load more' />
          </div>
        )}

        <FaqSection />

        <PopularArticles />
      </div>
    </Layout>
  )
}
