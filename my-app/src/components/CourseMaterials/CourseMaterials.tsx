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
  const [selected, setSelected] = useState<number | null>(0)

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(null)
    }

    setSelected(i)
  }
  const t = getLocale()
  return (
    <div className={s.materialsAccordion}>
      {modules.map((module: any, index: number) => (
        <div key={index}>
          <div className={s.accordoinItem}>
            <div
              onClick={() => toggle(index)}
              className={`${s.accordionTitle} ${selected === index ? s.active : ''}`}
            >
              <div className={s.titleLeft}>
                <Image src={selected === index ? arrowTop : arrowBottom} alt='arrow' />

                {module.title}
              </div>

              <div className={s.titleRight}>
                <div>
                  <Image src={notebook} alt='notebook' />
                  {module.lessons.length} {t.lectures}
                </div>
                {/* <div>
                  <Image src={clock} alt='clock' />
                  33 ч 48 мин
                </div> */}
              </div>
            </div>

            <ul className={`${s.accordionContent} ${selected === index ? s.show : ''}`}>
              {module.lessons.map((lesson: any, idx: number) => (
                <li className={s.materialItem} key={idx}>
                  <div className={s.materialItemTitle}>
                    <Image src={video} alt='video' />
                    <span>{lesson && lesson.data.title}</span>
                  </div>

                  <div className={s.materialItemInfo}>
                    <div>
                      <Image src={idx === 0 ? openLock : closedLock} alt='lock' />

                      <Link
                        href={'/lesson?id=' + lesson.id}
                        onClick={(e) => localStorage.setItem('SelectedModuleIndex', index + '')}
                      >
                        <span
                          style={{ cursor: 'pointer', textDecoration: 'none', color: '#ffec3e' }}
                        >
                          {t.preview}
                        </span>
                      </Link>
                    </div>
                    {/* <span>15:22</span> */}
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
