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

const data = [
  {
    chapteer: 'Введение',
    materials: [
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
    ],
  },
  {
    chapteer: 'Введение',
    materials: [
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
    ],
  },
  {
    chapteer: 'Введение',
    materials: [
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
    ],
  },
  {
    chapteer: 'Введение',
    materials: [
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
    ],
  },
  {
    chapteer: 'Введение',
    materials: [
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
    ],
  },
  {
    chapteer: 'Введение',
    materials: [
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
    ],
  },
  {
    chapteer: 'Введение',
    materials: [
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
    ],
  },
  {
    chapteer: 'Введение',
    materials: [
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
      'Почему nodeJS для backend?',
    ],
  },
]

const CourseMaterials = () => {
  const [selected, setSelected] = useState<number | null>(null)

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(null)
    }

    setSelected(i)
  }

  return (
    <div className={s.materialsAccordion}>
      {data.map((item, index, arr) => (
        <div key={index}>
          <div className={s.accordoinItem}>
            <div
              onClick={() => toggle(index)}
              className={`${s.accordionTitle} ${selected === index ? s.active : ''}`}
            >
              <div className={s.titleLeft}>
                <Image src={selected === index ? arrowTop : arrowBottom} alt='arrow' />

                {item.chapteer}
              </div>

              <div className={s.titleRight}>
                <div>
                  <Image src={notebook} alt='notebook' />6 лекций
                </div>
                <div>
                  <Image src={clock} alt='clock' />
                  33 ч 48 мин
                </div>
              </div>
            </div>

            <ul className={`${s.accordionContent} ${selected === index ? s.show : ''}`}>
              {item.materials.map((material, idx) => (
                <li className={s.materialItem} key={idx}>
                  <div className={s.materialItemTitle}>
                    <Image src={video} alt='video' />
                    <span>{material}</span>
                  </div>

                  <div className={s.materialItemInfo}>
                    <div>
                      <Image src={idx === 0 ? openLock : closedLock} alt='lock' />
                      <span style={{ cursor: 'pointer' }}>Предосмотр</span>
                    </div>
                    <span>15:22</span>
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
