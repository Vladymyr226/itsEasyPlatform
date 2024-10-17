import { useEffect, useState } from 'react'
import s from './CourseMaterials.module.css'

import arrowTop from '../../assets/arrowTop.svg'
import arrowBottom from '../../assets/arrowBottom.svg'
import notebook from '../../assets/greyNotebook.svg'
import Image from 'next/image'
import Link from 'next/link'
import { Checkbox, Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { getLocale } from '@/utils/getLocale'

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`

const CourseLessonMaterials = ({
  modules,
  selectedLesson,
  setId,
  completedLessonTrigger,
  userDataStart,
  courseStart
}: {
  modules: any
  selectedLesson: number
  setId: any
  completedLessonTrigger: boolean
  userDataStart: any,
  courseStart: any
}) => {
  const [selected, setSelected] = useState<number | null>(0)

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(null)
    }

    setSelected(i)
  }
  const [userData, setUserData] = useState<any>(userDataStart)
  const [course, setCourse] = useState<any>(courseStart)

  async function getPageData() {
    // if (typeof window !== 'undefined') {
    //   if (localStorage.getItem('SelectedCourse')) {
    //     const responseCourse = await fetch(url + '/' + localStorage.getItem('SelectedCourse'), {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     })
    //     const resultCourse = await responseCourse.json()
    //     setCourse(resultCourse)
    //   }
    //   const fullUrl = window.location.href
    //   const userId = localStorage.getItem('UserID')
    //   const responseUser = await fetch(urlUser + '/' + userId, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //   const resultUser = await responseUser.json()

    //   setUserData(resultUser)
    // }
  }
  useEffect(() => {
    getPageData()
    const SelectedModuleIndex = localStorage.getItem('SelectedModuleIndex')
    if (SelectedModuleIndex) {
      setSelected(Number(SelectedModuleIndex))
    }
  }, [])
  useEffect(() => {
    getPageData()
    const SelectedModuleIndex = localStorage.getItem('SelectedModuleIndex')
    if (SelectedModuleIndex) {
      setSelected(Number(SelectedModuleIndex))
    }
  }, [completedLessonTrigger])

  const router = useRouter()
  const t = getLocale()
  return (
    <>
      {course && (
        <div className={s.materialsAccordion} style={{ marginTop: '0px' }}>
          <div style={{ padding: '16px' }}>
            <Link href={'/course-details?id=' + course.id}>
              <h2 style={{ color: '#ffec3e' }}>{course.data.title}</h2>
            </Link>
          </div>
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
                        if (setId != -1) {
                          setId(lesson.id)
                        }
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
                            checked={
                              typeof userData.comleted_lessons_id !== 'undefined' &&
                              userData.comleted_lessons_id.indexOf(lesson.id) != -1
                            }
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={{
                              color: 'inherit',
                              '&.Mui-checked': {
                                color: 'inherit',
                              },
                            }}
                          />
                        )}
                        <Box sx={{ marginTop: { xs: '10px', lg: '0px' } }}>
                          {lesson && lesson.data.title}
                        </Box>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={s.divide}></div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CourseLessonMaterials
