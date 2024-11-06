'use client'
import Layout from '@/components/Layout/Layout'
import '../app/globals.css'
import s from './AboutUs.module.css'
import Image from 'next/image'
import aboutUs1 from '../src/assets/aboutUs1.png'
import aboutUs2 from '../src/assets/aboutUs2.jpg'
import aboutUs3 from '../src/assets/aboutUs3.png'
import arrowTop from '../src/assets/arrowTop.svg'

const AboutUs = () => {
  
  return (
    <Layout>
      <div className={s.wrapper}>
        <h1>About Us</h1>
        <h2>Welcome to it-tutor.ai, your gateway to the future of learning in the<br/>
          rapidly evolving world of technology.</h2>
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
            <p>
              In today&apos;s fast-paced digital landscape, artificial intelligence (AI) is transforming every industry, and
              education is no exception. At it-tutor.ai, we believe that learning should be more than just acquiring
              knowledge—it should be an experience that adapts to you. That&apos;s why we&apos;ve integrated cutting-edge AI
              technology into our platform, making it easier, smarter, and more personalized for every learner.
            </p>
          </div>
        </section>

        <section>
          <div className={s.text}>
            <p>
              Our AI-driven courses are designed to adapt to your unique learning style and pace. Whether you&apos;re a
              complete beginner or advancing your career, AI helps create a tailored path for you. It provides real-time
              feedback, custom exercises, and learning recommendations based on your progress. With it-tutor.ai, you&apos;ll
              never feel lost or overwhelmed—our AI is like having a personal tutor guiding you at every step.
            </p>
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
            <p>
              We understand that the demand for tech skills is growing fast. That&apos;s why we&apos;ve built a platform
              that doesn&apos;t just teach; it empowers you to learn efficiently and effectively, equipping you with the
              skills you need to succeed in today&apos;s tech-driven world.
            </p>
          </div>
        </section>

        <div className={s.hero}>
          <p>
            Join us on this journey where technology<br/>meets learning, and let it-tutor.ai guide you<br/>toward mastering the
            skills of tomorrow—<br/>faster and smarter than ever before.
          </p>
          <button>
            Join
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default AboutUs
