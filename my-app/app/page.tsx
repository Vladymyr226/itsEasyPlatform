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

export default function HomePage() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])

  return (
    <Layout>
      <div className={s.homePage}>
        <PromoSlider />

        <h1 className={s.coursesTitle}>Курсы</h1>

        <CourseCard />
        <CourseCard toLeft={true} />
        <CourseCard />

        {width >= 1200 ? (
          <button className={s.loadMoreButton}>
            Смотреть ещё курсы <Image src={plus} alt='plus' />
          </button>
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
