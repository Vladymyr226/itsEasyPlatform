import { useState } from 'react'
import s from './CourseMaterials.module.css'

import arrowTop from '../../assets/arrowTop.svg'
import arrowBottom from '../../assets/arrowBottom.svg'
import notebook from '../../assets/greyNotebook.svg'
import clock from '../../assets/greyClock.svg'
import openLock from '../../assets/openLock.svg'
import closedLock from '../../assets/closedLock.svg'
import video from '../../assets/greyVideo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { getLocale } from '@/utils/getLocale'

const CourseMaterials = ({ modules }: { modules: any }) => {
  const [closed, setClosed] = useState<Array<number> | null>([])

  const toggle = (i: number) => {
    if (closed?.indexOf(i) !== -1) {
      return setClosed(closed ? closed.filter((ind: number) => ind != i) : [])
    }

    setClosed([...closed, i])
  }
  const t = getLocale()
  function countTime(lessons: any) {
    const summ = lessons.map((lesson: any, idx: number) => {
      return (
        (lesson && lesson.data.hours ? Number(lesson.data.hours) : 0) * 60 +
        (lesson && lesson.data.minutes ? Number(lesson.data.minutes) : 0)
      )
    })
    return summ.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0)
  }
  function getModuleTime(minutes: number) {
    return (
      <>
        {(minutes - (minutes % 60)) / 60} {t.hourShort} {minutes % 60} {t.minuteShort}
      </>
    )
  }
  return (
    <div className={s.materialsAccordion}>
      {modules.map((module: any, index: number) => (
        <div key={index}>
          <div className={s.accordionItem}>
            <div
              onClick={() => toggle(index)}
              className={`${s.accordionTitle} ${closed?.indexOf(index) === -1 ? s.active : ''}`}
            >
              <div className={s.titleLeft}>
                <Image src={closed?.indexOf(index) === -1 ? arrowTop : arrowBottom} alt='arrow' />

                {module.title}
              </div>

              <div className={s.titleRight}>
                <div>
                  <Image src={notebook} alt='notebook' />
                  {module.lessons.length} {t.lectures}
                </div>
                <div>
                  <Image src={clock} alt='clock' />
                  {getModuleTime(countTime(module.lessons))}
                </div>
              </div>
            </div>

            <ul className={`${s.accordionContent} ${closed?.indexOf(index) === -1 ? s.show : ''}`}>
              {module.lessons.map((lesson: any, idx: number) => (
                <li className={s.materialItem} key={idx}>
                  <div className={s.materialItemTitle}>
                    <Image src={video} alt='video' />
                    <Link
                      href={'/lesson?id=' + lesson.id}
                      onClick={(e) => localStorage.setItem('SelectedModuleIndex', index + '')}
                    >
                      <span style={{ cursor: 'pointer', textDecoration: 'none', color: '#c7c6c6' }}>
                        {lesson.data.title}
                      </span>
                    </Link>
                  </div>

                  <div className={s.materialItemInfo}>
                    <div>
                      <Image src={idx === 0 ? openLock : closedLock} alt='lock' />
                    </div>
                    <span style={{ width: '50px' }}>
                      {lesson && lesson.data.hours
                        ? lesson.data.hours < 10
                          ? '0' + lesson.data.hours
                          : lesson.data.hours
                        : '00'}
                      :
                      {lesson && lesson.data.minutes
                        ? lesson.data.minutes < 10
                          ? '0' + lesson.data.minutes
                          : lesson.data.minutes
                        : '00'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.divide}></div>
        </div>
      ))}
    </div>
  )
}

export default CourseMaterials
