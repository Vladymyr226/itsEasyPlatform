import s from './PopularCourses.module.css'

import popularCourseImage from '../../assets/popularCourse.png'
import clock from '../../assets/greyClock.svg'
import notebook from '../../assets/greyNotebook.svg'
import stat from '../../assets/statistics.svg'
import Image from 'next/image'

import Rating from '../Rating/Rating'
import { useRouter } from 'next/navigation'

const PopularCourses = ({ data }: { data: any }) => {
  const router = useRouter()
  return (
    <ul className={s.popularCoursesList}>
      {data.slice(0, 3).map((course: any) => {
        // console.log(course)
        let tmpSum = 0
        course.data.modules.map(async (module: any) => {
          module.lessons.map(async (lessonId: string) => {
            tmpSum += 1
          })
        })
        return (
          <li className={s.courseItem} key={'popularCourse_' + course.id}>
            <div style={{ maxWidth: '330px' }}>
              <div className={s.courseItemHeader} style={{ width: '100%' }}>
                <Image src={popularCourseImage} alt='programmer' />
              </div>
              <div className={s.courseItemFooter}>
                <p className={s.courseTitle}>
                  <span className={s.accentuated} style={{ textWrap: 'wrap' }}>
                    {course.data.title}
                  </span>
                </p>
                <ul className={s.courseInfo}>
                  <li style={{ display: 'flex', gap: '10px' }}>
                    <span className={s.accentuated}>Язык</span>
                    {course.data.language == 'RU' && (
                      <div style={{ height: '20px', width: '10px' }}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 9 6'
                          width='20'
                          height='10'
                        >
                          <rect fill='#fff' width='9' height='3' />
                          <rect fill='#d52b1e' y='3' width='9' height='3' />
                          <rect fill='#0039a6' y='2' width='9' height='2' />
                        </svg>
                      </div>
                    )}
                    {course.data.language == 'UA' && (
                      <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='10'>
                          <rect width='1200' height='5' fill='#0057B7' />
                          <rect width='1200' height='5' y='5' fill='#FFD700' />
                        </svg>
                      </div>
                    )}
                    {course.data.language == 'EN' && (
                      <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 50 30'
                          width='20'
                          height='10'
                        >
                          <clipPath id='t'>
                            <path d='M25,15h25v15zv15h-25zh-25v-15zv-15h25z' />
                          </clipPath>
                          <path d='M0,0v30h50v-30z' fill='#012169' />
                          <path d='M0,0 50,30M50,0 0,30' stroke='#fff' stroke-width='6' />
                          <path
                            d='M0,0 50,30M50,0 0,30'
                            clip-path='url(#t)'
                            stroke='#C8102E'
                            stroke-width='4'
                          />
                          <path
                            d='M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z'
                            fill='#C8102E'
                            stroke='#FFF'
                            stroke-width='2'
                          />
                        </svg>
                      </div>
                    )}
                  </li>
                  <li>
                    <span className={s.accentuated}>Тип</span>
                    {course.data.type == 'with-lector' ? ' С лектором' : ' Самообучение'}
                  </li>
                  {course.data.type == 'with-lector' ? (
                    <li>
                      <span className={s.accentuated}>Преподаёт</span> {course.data.lector}
                    </li>
                  ) : (
                    <li>&nbsp;</li>
                  )}
                </ul>
                <Rating isBig={true} isSmall={true} rating={course.data.rating} />
                <ul className={s.courseDetails}>
                  <li>
                    <Image src={notebook} alt='notebook' /> {tmpSum} лекций
                  </li>
                  <li>
                    <Image src={stat} alt='stat' /> {course.data.level}
                  </li>
                </ul>
                <div style={{ display: 'flex' }}>
                  <button
                    className={s.courseButton}
                    onClick={(e) => {
                      localStorage.setItem('SelectedCourseIndex', course.id)
                      router.replace('/course-details?id=' + course.id)
                      setTimeout(() => {
                        router.refresh()
                      }, 1)
                    }}
                  >
                    Узнать больше
                  </button>
                  <div className={s.priceWrapper}>
                    {course.data.priceDiscount && course.data.priceDiscount > 0 ? (
                      <span className={s.prevPrice}>${course.data.price}</span>
                    ) : (
                      <></>
                    )}
                    <span className={s.currentPrice}>
                      $
                      {course.data.priceDiscount && course.data.priceDiscount > 0
                        ? course.data.priceDiscount
                        : course.data.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default PopularCourses
