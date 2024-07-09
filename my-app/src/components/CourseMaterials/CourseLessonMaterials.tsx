import { useEffect, useState } from 'react'
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
import { Accordion, AccordionDetails, AccordionSummary, Checkbox } from '@mui/material'
import { useRouter } from 'next/navigation'
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`
const CourseLessonMaterials = ({
  modules,
  selectedLesson,
  setId,
}: {
  modules: any
  selectedLesson: number
  setId: any
}) => {
  const [selected, setSelected] = useState<number | null>(null)

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(null)
    }

    setSelected(i)
  }
  const [userData, setUserData] = useState<any>()
  async function getPageData() {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href
      const userId = localStorage.getItem('UserID')
      const responseUser = await fetch(urlUser + '/' + userId, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resultUser = await responseUser.json()

      setUserData(resultUser)
    }
  }
  useEffect(() => {
    getPageData()
    const SelectedModuleIndex = localStorage.getItem('SelectedModuleIndex')
    if (SelectedModuleIndex) {
      setSelected(Number(SelectedModuleIndex))
    }
  }, [])

  const router = useRouter()
  return (
    <div className={s.materialsAccordion} style={{ marginTop: '0px' }}>
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
                  {module.lessons.length} лекций
                </div>
              </div>
            </div>

            <ul
              className={`${s.accordionContent} ${selected === index ? s.show : ''}`}
              style={{ padding: 0, gap: 0 }}
            >
              {module.lessons.map((lesson: any, idx: number) => (
                <li
                  className={s.materialItemLesson}
                  key={idx}
                  onClick={(e) => {
                    localStorage.setItem('SelectedModuleIndex', index + '')
                    router.replace('/lesson?id=' + lesson.id)
                    setId(lesson.id)
                  }}
                  style={{
                    background: selectedLesson == lesson.id ? 'rgba(197, 142, 254, 0.1)' : '',
                    padding: '12px',
                    paddingLeft: '25px',
                  }}
                >
                  <div className={s.materialItemTitle}>
                    {userData && (
                      <Checkbox
                        checked={userData && userData.comleted_lessons_id.indexOf(lesson.id) != -1}
                        inputProps={{ 'aria-label': 'controlled' }}
                        sx={{
                          color: 'inherit',
                          '&.Mui-checked': {
                            color: 'inherit',
                          },
                        }}
                      />
                    )}
                    <span>{lesson && lesson.data.title}</span>
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

export default CourseLessonMaterials
