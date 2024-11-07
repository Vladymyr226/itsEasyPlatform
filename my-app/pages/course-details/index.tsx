'use client'
import s from './CourseDetails.module.css'
import { useEffect, useRef, useState } from 'react'
import Comments from '@/components/Comments/Comments'
import CourseControlls from '@/components/CourseControlls/CourseControlls'
import CourseMaterials from '@/components/CourseMaterials/CourseMaterials'
import CourseSidebar from '@/components/CourseSidebar/CourseSidebar'
import PlayButton from '@/components/PlayButton/PlayButton'
import { PauseButton } from '@/components/PlayButton/PlayButton'

import PopularCourses from '@/components/PopularCourses/PopularCourses'
import SkillsList from '@/components/SkillsList/SkillsList'
import Layout from '@/components/Layout/Layout'
import '../../app/globals.css'
import SlateView from '@/components/SlateEditor/View'
import { Box, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { getLocale } from '@/utils/getLocale'
import CourseLessonMaterials from '@/components/CourseMaterials/CourseLessonMaterials'
import axios from 'axios'
import { Course, LessonData } from '@/utils/interfaces'

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`
const urlLessonsById = `${process.env.NEXT_BACK_HOST_API}/cabinet/lessons-by-id`
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`

interface Module {
  title: string
  lessons: Array<Lesson>
}
interface Lesson {
  id: string
  data: LessonData
}

const CourseDetails = () => {
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<Course>()
  const [userData, setUserData] = useState<any>()
  const [popularCoursesData, setPopularCoursesData] = useState<Array<any>>()
  const [lessSum, setLessSum] = useState<number>()
  const [play, setPlay] = useState(false)
  const router = useRouter()

  const videoRef = useRef(null)

  async function getPageData() {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href

      const userId = localStorage.getItem('UserID')
      if (userId) {
        const responseUser = await fetch(urlUser + '/' + userId, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const resultUser = await responseUser.json()

        setUserData(resultUser)
      }

      if (fullUrl.split('id=')[1]) {
        const responseAll = await fetch(url + 's?isActive=true', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const resultAll = await responseAll.json()

        const response = await fetch(url + '/' + fullUrl.split('id=')[1], {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
        if (!result.is_active) {
          router.push('./')
        }
        const responseViewed = await axios.put(
          url +
            '?id=' +
            fullUrl.split('id=')[1] +
            '&views=' +
            Number(Number(result.views) + 1),
          {
            ...result.data,
          },
        )

        const allLessonIds = result.data.modules.flatMap(
          (module: any) => module.lessons,
        )
        const responseLessons = await fetch(
          urlLessonsById + '?idArr=' + allLessonIds.join(','),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        const lessonsResponse = await responseLessons.json()

        const lessonsById = lessonsResponse.reduce((acc: any, lesson: any) => {
          acc[lesson.id] = lesson
          return acc
        }, {})

        const modules = result.data.modules.map((module: any) => ({
          title: module.title,
          lessons: module.lessons.map(
            (lessonId: string) => lessonsById[lessonId] ?? null,
          ),
        }))
        setModules(modules)
        localStorage.setItem('SelectedCourse', result.id)

        const filter = resultAll.getCourses.filter(
          (dataFilter: any, i: number) =>
            arraysHaveCommonElements(
              dataFilter.data.category,
              result.data.category,
            ) && result.id != dataFilter.id,
        )

        setPopularCoursesData(filter)
        setLessSum(allLessonIds.length)
        setData({ ...result, data: { ...result.data, modules: modules } })
      } else {
      }
    }
  }
  function arraysHaveCommonElements(array1: any, array2: any) {
    return array1.some((element: any) => array2.includes(element))
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)

      getPageData()
    }
  }, [])

  const imgRef = useRef(null)
  const t = getLocale()

  const [modules, setModules] = useState<Array<Module>>()
  console.log(data)
  return (
    <Layout>
      {data ? (
        <div className={s.coursePage}>
          <div className={s.leftSide}>
            <div className={s.courseTitle}>
              <h2>{data && data.data.title}</h2>
              {data && (
                <CourseControlls
                  courseId={data.id}
                  isFavoriteStart={
                    userData && userData.favourite_courses_id
                      ? userData.favourite_courses_id.indexOf(data.id) != -1
                      : false
                  }
                  userData={userData}
                />
              )}
            </div>

            <div className={s.courseImageWrapper}>
              {typeof data?.data.mediaValue?.content == 'string' && (
                <>
                  {data?.data.mediaValue.type == 'image' ? (
                    <>
                      <Box
                        sx={{
                          background: '#000000',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          className={s.courseImage}
                          src={data?.data.mediaValue.content}
                          style={{ maxHeight: '650px' }}
                          alt="course"
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        src={data?.data.mediaValue.content}
                        style={{ width: '100%' }}
                      />
                      {!play && (
                        <PlayButton onClickPlay={setPlay} videoRef={videoRef} />
                      )}
                      {play && (
                        <PauseButton
                          onClickPlay={setPlay}
                          videoRef={videoRef}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            <p className={s.courseSubTitle}>
              <span className={s.accentuated}>{t.course_description}</span>
            </p>

            <ul className={s.descInfo}>
              <li className={s.infoItem}>
                <p className={s.infoItemTitle}>{t.language}</p>
                <p className={s.infoItemContent}>
                  {data && (
                    <>
                      {data.data.language == 'RU' && (
                        <div style={{ height: '20px', width: '20px' }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 9 6"
                            width="35"
                            height="20"
                          >
                            <rect fill="#c7c6c6" width="9" height="3" />
                            <rect fill="#d52b1e" y="3" width="9" height="3" />
                            <rect fill="#0039a6" y="2" width="9" height="2" />
                          </svg>
                        </div>
                      )}
                      {data.data.language == 'UA' && (
                        <div
                          style={{
                            height: '20px',
                            width: '20px',
                            position: 'relative',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="20"
                          >
                            <rect width="1200" height="10" fill="#0057B7" />
                            <rect
                              width="1200"
                              height="10"
                              y="10"
                              fill="#FFD700"
                            />
                          </svg>
                        </div>
                      )}
                      {data.data.language == 'EN' && (
                        <div
                          style={{
                            height: '20px',
                            width: '20px',
                            position: 'relative',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 50 30"
                            width="35"
                            height="20"
                          >
                            <clipPath id="t">
                              <path d="M25,15h25v15zv15h-25zh-25v-15zv-15h25z" />
                            </clipPath>
                            <path d="M0,0v30h50v-30z" fill="#012169" />
                            <path
                              d="M0,0 50,30M50,0 0,30"
                              stroke="#c7c6c6"
                              stroke-width="6"
                            />
                            <path
                              d="M0,0 50,30M50,0 0,30"
                              clip-path="url(#t)"
                              stroke="#C8102E"
                              stroke-width="4"
                            />
                            <path
                              d="M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z"
                              fill="#C8102E"
                              stroke="#c7c6c6"
                              stroke-width="2"
                            />
                          </svg>
                        </div>
                      )}
                    </>
                  )}
                </p>
              </li>
              <li className={s.infoItem}>
                <p className={s.infoItemTitle}>{t.level}</p>
                <p className={s.infoItemContent}>{data && data.data.level}</p>
              </li>
              {data.data.type == 'with-lector' && (
                <li className={s.infoItem}>
                  <p className={s.infoItemTitle}>{t.start_date}</p>
                  <p className={s.infoItemContent}>{data && data.data.date}</p>
                </li>
              )}
              {data.data.type == 'self-education' && (
                <li className={s.infoItem}>
                  <p className={s.infoItemTitle}>{t.created_date}</p>
                  <p className={s.infoItemContent}>
                    {data &&
                      new Date(data.created_at).toISOString().split('T')[0]}
                  </p>
                </li>
              )}
            </ul>
            {data && (
              <div className={s.descText}>
                <SlateView value={data && data.data.description} />
              </div>
            )}

            <p
              style={{
                textAlign: `${width < 1200 ? 'center' : 'left'}`,
                marginBottom: '24px',
              }}
              className={s.courseSubTitle}
            >
              <span className={s.accentuated}>{t.course_materials}</span>
            </p>
            {data &&
              userData?.purchased_courses_id.filter(
                (courseId: any) => courseId == data?.id,
              ).length == 0 && <CourseMaterials modules={data.data.modules} />}
            {width < 1200 && (
              <div className={s.rightSide}>
                {userData?.purchased_courses_id.filter(
                  (courseId: any) => courseId == data?.id,
                ).length > 0 ? (
                  <Box>
                    {modules && data && userData && (
                      <CourseLessonMaterials
                        setId={-1}
                        modules={modules}
                        selectedLesson={-1}
                        completedLessonTrigger={false}
                        userDataStart={userData}
                        courseStart={data}
                      />
                    )}
                  </Box>
                ) : (
                  <CourseSidebar
                    duration={data?.data.duration ?? 0}
                    lessonsNum={lessSum ?? 0}
                    price={data?.data.price ?? 0}
                    priceDiscount={data?.data.priceDiscount ?? 0}
                    modules={data?.data.modules}
                    rating={data?.data.rating ?? 0}
                    views={data?.views ?? 0}
                    title={data?.data.title ?? 'Course payment'}
                  />
                )}
              </div>
            )}
            <p style={{ fontSize: '24px' }} className={s.courseSubTitle}>
              <span className={s.accentuated}>{t.what_alumni_say}</span>
            </p>

            <Comments />

            <p
              style={{ textAlign: `${width < 1200 ? 'center' : 'left'}` }}
              className={s.courseSubTitle}
            >
              <span className={s.accentuated}>{t.what_you_learn}</span>
            </p>
            <SkillsList />

            {popularCoursesData && popularCoursesData.length > 0 && (
              <>
                <p
                  style={{
                    fontSize: '24px',
                    textAlign: `${width < 1200 ? 'center' : 'left'}`,
                  }}
                  className={s.courseSubTitle}
                >
                  <span className={s.accentuated}>{t.you_interested}</span>
                </p>
                <div
                  style={{
                    marginTop: '20px',
                    maxWidth: '100%',
                    width: '100%',
                    height: '700px',
                  }}
                >
                  <Box
                    sx={{
                      position: { xs: 'absolute', md: 'relative' },
                      left: { xs: 0, md: null },
                      right: { xs: 0, md: null },
                    }}
                  >
                    <PopularCourses data={popularCoursesData} smallScreen />
                  </Box>
                </div>
              </>
            )}
          </div>

          {width >= 1200 && (
            <div className={s.rightSide}>
              {userData?.purchased_courses_id.filter(
                (courseId: any) => courseId == data?.id,
              ).length > 0 ? (
                <Box sx={{ marginTop: 2, minWidth: '375px', width: '100%' }}>
                  {modules && data && userData && (
                    <CourseLessonMaterials
                      setId={-1}
                      modules={modules}
                      selectedLesson={-1}
                      completedLessonTrigger={false}
                      userDataStart={userData}
                      courseStart={data}
                    />
                  )}
                </Box>
              ) : (
                <CourseSidebar
                  duration={data?.data.duration ?? 0}
                  lessonsNum={lessSum ?? 0}
                  price={data?.data.price ?? 0}
                  priceDiscount={data?.data.priceDiscount ?? 0}
                  modules={data?.data.modules}
                  rating={data?.data.rating ?? 0}
                  views={data?.views ?? 0}
                  title={data?.data.title ?? 'Course payment'}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 40,
            marginBottom: 70,
          }}
        >
          <CircularProgress sx={{ color: '#ffec3e' }} />
        </Box>
      )}
    </Layout>
  )
}

export default CourseDetails
