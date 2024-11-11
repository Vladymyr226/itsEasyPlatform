'use client'
import Layout from '@/components/Layout/Layout'
import '../app/globals.css'
import s from './AboutUs.module.css'
import Image from 'next/image'
import aboutUs1 from '../src/assets/aboutUs1.png'
import aboutUs2 from '../src/assets/aboutUs2.jpg'
import aboutUs3 from '../src/assets/aboutUs3.png'
import JoinUs from '@/components/JoinUs'
import { getLocale } from '@/utils/getLocale'

const AboutUs = () => {
  const t = getLocale()
  
  return (
    <Layout>
      <div className={s.wrapper}>
        <h1>{t.aboutUs}</h1>
        <h2>{t.aboutUs1}<br/>{t.aboutUs2}</h2>
        <div className={s.image}>
          <Image
            src={aboutUs1}
            alt="About Us Image 1"
            width={1200}
            height={400}
          ></Image>
        </div>

        <section>
          <div className={s.image}>
            <Image
              src={aboutUs2}
              alt="About Us Image 2"
              width={400}
              height={400}
            ></Image>
          </div>
          <div className={s.text}>
            <p>{t.aboutUs3}</p>
          </div>
        </section>

        <section>
          <div className={s.text}>
            <p>{t.aboutUs4}</p>
          </div>
          <div className={s.image}>
            <Image
              src={aboutUs3}
              alt="About Us Image 3"
              width={400}
              height={400}
            ></Image>
          </div>
        </section>

        <section>
          <div className={s.image}>
            <Image
              src={aboutUs1}
              alt="About Us Image 4"
              width={400}
              height={400}
            ></Image>
          </div>
          <div className={s.text}>
            <p>{t.aboutUs5}</p>
          </div>
        </section>

        <JoinUs></JoinUs>
      </div>
    </Layout>
  )
}

export default AboutUs
