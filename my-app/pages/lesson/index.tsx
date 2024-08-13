'use client'
import s from '../CourseDetails.module.css'
import skillsImage from '../../../src/assets/skillsImage.png'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Comments from '@/components/Comments/Comments'
import CourseControlls from '@/components/CourseControlls/CourseControlls'
import CourseLessonMaterials from '@/components/CourseMaterials/CourseLessonMaterials'
import CourseSidebar from '@/components/CourseSidebar/CourseSidebar'
import PlayButton from '@/components/PlayButton/PlayButton'
import { PauseButton } from '@/components/PlayButton/PlayButton'

import PopularCourses from '@/components/PopularCourses/PopularCourses'
import Rating from '@mui/material/Rating'
import SkillsList from '@/components/SkillsList/SkillsList'
import ViewsCount from '@/components/ViewsCount/ViewsCount'
import Layout from '@/components/Layout/Layout'
import '../../app/globals.css'
import SlateView from '@/components/SlateEditor/View'
import { Box, Button } from '@mui/material'
import YouTube, { YouTubeProps } from 'react-youtube'

import { YouTubeProp } from '@/utils/interfaces'
import { useRouter } from 'next/navigation'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Checkbox,
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import Swal from 'sweetalert2'
import { getLocale } from '@/utils/getLocale'
interface CourseData {
  title: string
  language: string
  level: string
  date: string
  type: string
  description: any
  rating: number
  duration: number
  lector: string
  modules: any
  price: number
  mediaValue: any
}
interface Course {
  id: string
  data: CourseData
  is_active: boolean
}
interface Module {
  title: string
  lessons: Array<Lesson>
}
const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`
const urlFeedback = `${process.env.NEXT_BACK_HOST_API}/cabinet/feedback`
interface LessonData {
  title: string
  link?: string
  description?: any
  image?: any
  questions?: any
  fields?: any
}
interface Lesson {
  id: string
  data: LessonData
  type: string
}
const LessonDetails = () => {
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<Lesson>()
  const [moduleLessons, setModuleLessons] = useState<Array<string>>()
  const [modules, setModules] = useState<Array<Module>>()

  const [id, setId] = useState<number>()
  const videoRef = useRef(null)
  const [userData, setUserData] = useState<any>()
  const [selectedCourse, setSelectedCourse] = useState<any>()

  async function getPageData() {
    if (typeof window !== 'undefined') {
      setSelectedCourse(localStorage.getItem('SelectedCourse'))
      const fullUrl = window.location.href
      const userId = localStorage.getItem('UserID')
      const responseUser = await fetch(urlUser + '/' + userId, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resultUser = await responseUser.json()

      setUserData(resultUser)
      if (fullUrl.split('id=')[1]) {
        setId(Number(fullUrl.split('id=')[1]))
        const response = await fetch(urlLesson + '/' + fullUrl.split('id=')[1], {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
        if (result.type === 'quiz') {
          setAnswerForm(
            result.data.questions.map((question: any) => {
              return question.options.map((option: any) => {
                return false
              })
            })
          )
        }
        setData(result)
        if (localStorage.getItem('SelectedCourse') && localStorage.getItem('SelectedModuleIndex')) {
          const responseCourse = await fetch(url + '/' + localStorage.getItem('SelectedCourse'), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const resultCourse = await responseCourse.json()

          setModuleLessons(
            resultCourse.data.modules[Number(localStorage.getItem('SelectedModuleIndex'))].lessons
          )
          const modules = await Promise.all(
            resultCourse.data.modules.map(async (module: any) => {
              const lessons = await Promise.all(
                module.lessons.map(async (lessonId: string) => {
                  const responseLesson = await fetch(urlLesson + '/' + lessonId, {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                  const resultLesson = await responseLesson.json()
                  return { id: resultLesson.id, data: resultLesson.data }
                })
              )

              return {
                title: module.title,
                lessons: lessons,
              }
            })
          )
          setModules(modules)
        }
      } else {
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      getPageData()
    }
  }, [])
  useEffect(() => {
    if (id && modules) {
      modules.map((module: any) => {
        module.lessons.map((less: any) => {
          if (less.id == id) {
            setData(less)
          }
        })
      })
    }
  }, [id])

  const imgRef = useRef(null)
  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      controls: 0,
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }
  function ExampleYouTube(props: YouTubeProp) {
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
      // access to player in all event handlers via event.target
    }

    const opts: YouTubeProps['opts'] = {
      height: '500',
      width: '100%',
      playerVars: {
        rel: 0,
        iv_load_policy: 0,
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    }

    return <YouTube videoId={props.url} opts={opts} onReady={onPlayerReady} />
  }
  function getLessonIndx() {
    return moduleLessons?.indexOf(data ? data.id : '-1') ?? -1
  }
  const router = useRouter()
  const [completedLessonTrigger, setCompletedLessonTrigger] = useState(false)
  const [answerForm, setAnswerForm] = useState<any>()
  const [checkAnswers, setCheckAnswers] = useState(false)
  const [resetAnswersBtn, setResetAnswersBtn] = useState(false)
  const [clearCheckBoxes, setClearCheckBoxes] = useState(false)

  const t = getLocale()
  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',

          flexDirection: { xs: 'column-reverse', md: 'row' },
          gap: { xs: '50px', md: null },
        }}
      >
        <Box
          sx={{
            width: '100%',

            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
          }}
        >
          {data ? (
            <Box
              sx={{ height: { xs: null, md: '140vb' }, display: 'flex', flexDirection: 'column' }}
            >
              {data.type == 'default' && (
                <Box sx={{ width: '100%' }}>
                  {data.data.link ? (
                    <>
                      <ExampleYouTube url={data.data.link.split('?v=')[1]} />
                    </>
                  ) : data.data.image ? (
                    <img src={data.data.image}></img>
                  ) : (
                    <></>
                  )}
                </Box>
              )}
              <h1 style={{ textAlign: 'left', color: '#ffec3e', marginBottom: '20px' }}>
                <b>{data && data.data.title}</b>
              </h1>
              {data.type == 'default' && (
                <Box sx={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
                  <Box
                    sx={{ width: '100%', height: 'max-content', color: '#fff', padding: '15px' }}
                  >
                    <SlateView value={data && data.data.description} />
                  </Box>
                </Box>
              )}
              {data.type == 'quiz' && (
                <Box>
                  {data.data.questions.map((question: any, indx: number) => {
                    return (
                      <Box key={'Question_' + indx}>
                        <h1 style={{ textAlign: 'left', color: '#fff', marginBottom: '20px' }}>
                          <b>{indx + 1 + '. ' + question.title}</b>
                        </h1>
                        {question.options.map((option: any, optionIndx: number) => {
                          return (
                            <Box
                              key={'QuestionOption_' + indx}
                              sx={{ display: 'flex', color: '#fff', marginTop: 1 }}
                            >
                              {!clearCheckBoxes && (
                                <Checkbox
                                  defaultChecked={answerForm[indx][optionIndx]}
                                  disabled={checkAnswers}
                                  onChange={(e) => {
                                    let tmpArr: any = answerForm
                                    tmpArr[indx][optionIndx] = e.target.checked
                                    setAnswerForm(tmpArr)
                                  }}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                  sx={{
                                    background:
                                      checkAnswers &&
                                      answerForm &&
                                      (answerForm[indx][optionIndx] || option.correct)
                                        ? answerForm[indx][optionIndx] == option.correct
                                          ? '#008000'
                                          : '#FF0000'
                                        : null,
                                    color: '#fff',
                                    '&.Mui-checked': {
                                      color: '#fff',
                                    },
                                  }}
                                />
                              )}
                              <b style={{ marginTop: '10px', marginLeft: '10px' }}>
                                {option.title}
                              </b>
                            </Box>
                          )
                        })}
                      </Box>
                    )
                  })}
                </Box>
              )}
              {data.type == 'practice' && (
                <Box>
                  {data.data.fields.map((field: any, indx: number) => {
                    return (
                      <Box key={'Field' + indx}>
                        {field.type == 'slate' && (
                          <Box
                            sx={{
                              width: '100%',
                              height: 'max-content',
                              color: '#fff',
                              padding: '15px',
                            }}
                          >
                            <SlateView value={field && field.value} />
                          </Box>
                        )}
                        {field.type == 'code' && (
                          <Box
                            sx={{
                              width: '100%',
                              height: 'max-content',
                              color: '#fff',
                              padding: '15px',
                            }}
                          >
                            <iframe
                              src={field ? field.value : 'https://codesandbox.io/'}
                              style={{
                                width: '100%',
                                height: '90vh',
                                border: '0',
                                borderRadius: '4px',
                                overflow: 'hidden',
                              }}
                              title='React'
                              allow='accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
                              sandbox='allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
                            ></iframe>
                          </Box>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              )}
              {/* Botom buttons */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  gap: 1,
                  marginTop: 2,
                }}
              >
                {(getLessonIndx() > 0 ||
                  Number(
                    typeof window !== 'undefined' ? localStorage.getItem('SelectedModuleIndex') : 0
                  ) > 0) && (
                  <Button
                    variant='text'
                    onClick={(e) => {
                      const getLessIndx = getLessonIndx()
                      if (getLessIndx > 0) {
                        if (moduleLessons) {
                          router.replace('/lesson?id=' + moduleLessons[getLessonIndx() - 1])
                          setId(Number(moduleLessons[getLessonIndx() - 1]))
                        }
                      } else {
                        if (Number(localStorage.getItem('SelectedModuleIndex')) > 0) {
                          const currentIndex = Number(localStorage.getItem('SelectedModuleIndex'))
                          localStorage.setItem('SelectedModuleIndex', '' + (currentIndex - 1))
                          setCompletedLessonTrigger(!completedLessonTrigger)
                          const lessIndex = Number(
                            modules
                              ? modules[currentIndex - 1].lessons[
                                  modules[currentIndex - 1].lessons.length - 1
                                ].id
                              : 0
                          )
                          router.replace('/lesson?id=' + lessIndex)
                          setId(lessIndex)
                        }
                      }
                    }}
                    startIcon={<ArrowBackIosIcon />}
                    sx={{ color: '#fff' }}
                  >
                    {t.previous}
                  </Button>
                )}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  {userData &&
                    userData?.purchased_courses_id &&
                    userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1 &&
                    userData?.comleted_lessons_id &&
                    userData?.comleted_lessons_id.indexOf(id) == -1 && (
                      <>
                        {!resetAnswersBtn && (
                          <Button
                            variant='contained'
                            sx={{ maxWidth: '500px', width: '50%' }}
                            onClick={async (e) => {
                              if (data.type == 'default' || data.type == 'practice') {
                                const response = await axios.put(urlUser + '?id=' + userData.id, {
                                  purchasedCoursesId: [...userData.purchased_courses_id],
                                  favouriteCoursesId: [...userData.favourite_courses_id],
                                  comletedLessonsId: [...userData.comleted_lessons_id, id],
                                })
                                const resultResponse = response.data
                                const userId = localStorage.getItem('UserID')
                                const responseUser = await fetch(urlUser + '/' + userId, {
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                })
                                const resultUser = await responseUser.json()
                                setCompletedLessonTrigger(!completedLessonTrigger)
                                setUserData(resultUser)
                                if (
                                  resultResponse &&
                                  moduleLessons &&
                                  getLessonIndx() >= 0 &&
                                  getLessonIndx() < moduleLessons?.length - 1
                                ) {
                                  setUserData({
                                    ...userData,
                                    comleted_lessons_id: [...userData.comleted_lessons_id, id],
                                  })
                                  if (moduleLessons) {
                                    router.replace(
                                      '/lesson?id=' + moduleLessons[getLessonIndx() + 1]
                                    )
                                    setId(Number(moduleLessons[getLessonIndx() + 1]))
                                  }
                                } else {
                                  if (
                                    resultResponse &&
                                    Number(localStorage.getItem('SelectedModuleIndex')) <
                                      (modules?.length ?? 0) - 1
                                  ) {
                                    const currentIndex = Number(
                                      localStorage.getItem('SelectedModuleIndex')
                                    )
                                    localStorage.setItem(
                                      'SelectedModuleIndex',
                                      '' + (currentIndex + 1)
                                    )
                                    setCompletedLessonTrigger(!completedLessonTrigger)
                                    const lessIndex = Number(
                                      modules ? modules[currentIndex + 1].lessons[0].id : 0
                                    )
                                    router.replace('/lesson?id=' + lessIndex)
                                    setId(lessIndex)
                                  }
                                }
                              }
                              if (data.type == 'quiz') {
                                setCheckAnswers(true)
                                let result = true
                                data.data.questions.map((question: any, indx: number) => {
                                  question.options.map((option: any, optionIndx: number) => {
                                    if (option.correct != answerForm[indx][optionIndx]) {
                                      result = false
                                    }
                                  })
                                })
                                if (result) {
                                  const response = await axios.put(urlUser + '?id=' + userData.id, {
                                    purchasedCoursesId: [...userData.purchased_courses_id],
                                    favouriteCoursesId: [...userData.favourite_courses_id],
                                    comletedLessonsId: [...userData.comleted_lessons_id, id],
                                  })
                                  const resultResponse = response.data
                                  const userId = localStorage.getItem('UserID')
                                  const responseUser = await fetch(urlUser + '/' + userId, {
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                  })
                                  const resultUser = await responseUser.json()
                                  setCompletedLessonTrigger(!completedLessonTrigger)
                                  setUserData(resultUser)
                                  Swal.fire({
                                    title: 'Great job!',
                                    background: '#171622',
                                    color: '#ffec3e',
                                    confirmButtonColor: '#c58efe',
                                  })
                                } else {
                                  setResetAnswersBtn(true)
                                }
                              }
                            }}
                          >
                            {t.complete}
                          </Button>
                        )}
                        {resetAnswersBtn && (
                          <Button
                            variant='contained'
                            sx={{ maxWidth: '200px', width: '50%', marginLeft: 2 }}
                            onClick={(e) => {
                              setAnswerForm(
                                answerForm.map((ansForm: any) => {
                                  return ansForm.map((opt: any) => {
                                    return false
                                  })
                                })
                              )
                              setClearCheckBoxes(true)
                              setTimeout(() => setClearCheckBoxes(false), 1)
                              setCheckAnswers(false)
                              setResetAnswersBtn(false)
                            }}
                          >
                            Reset quiz
                          </Button>
                        )}
                      </>
                    )}
                </Box>

                {((moduleLessons &&
                  getLessonIndx() >= 0 &&
                  getLessonIndx() < moduleLessons?.length - 1) ||
                  Number(
                    typeof window !== 'undefined' ? localStorage.getItem('SelectedModuleIndex') : 0
                  ) <
                    (modules?.length ?? 0) - 1) && (
                  <Button
                    variant='text'
                    onClick={(e) => {
                      if (
                        moduleLessons &&
                        getLessonIndx() >= 0 &&
                        getLessonIndx() < moduleLessons?.length - 1
                      ) {
                        if (moduleLessons) {
                          router.replace('/lesson?id=' + moduleLessons[getLessonIndx() + 1])

                          setId(Number(moduleLessons[getLessonIndx() + 1]))
                        }
                      } else {
                        if (
                          Number(localStorage.getItem('SelectedModuleIndex')) <
                          (modules?.length ?? 0) - 1
                        ) {
                          const currentIndex = Number(localStorage.getItem('SelectedModuleIndex'))
                          localStorage.setItem('SelectedModuleIndex', '' + (currentIndex + 1))
                          setCompletedLessonTrigger(!completedLessonTrigger)
                          const lessIndex = Number(
                            modules ? modules[currentIndex + 1].lessons[0].id : 0
                          )
                          router.replace('/lesson?id=' + lessIndex)
                          setId(lessIndex)
                        }
                      }
                    }}
                    endIcon={<ArrowForwardIosIcon />}
                    sx={{ color: '#fff' }}
                  >
                    {t.next}
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', marginTop: 40, marginBottom: 70 }}
            >
              <CircularProgress sx={{ color: '#ffec3e' }} />
            </Box>
          )}
        </Box>

        <Box
          sx={{
            height: { xs: null, md: '140vb' },
            paddingLeft: 1,
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            width: { xs: '100%', md: '500px' },
          }}
        >
          <Box
            sx={{
              borderRadius: 2,
              background: 'rgba(197, 142, 254, 0.1)',
              color: '#fff',
              padding: 2,
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <h3>{t.your_rating}</h3>
            <Rating
              disabled={
                !(
                  selectedCourse &&
                  userData &&
                  userData?.purchased_courses_id &&
                  userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1
                )
              }
              onChange={async (event, newValue) => {
                if (newValue) {
                  if (newValue < 5) {
                    if (
                      selectedCourse &&
                      userData &&
                      userData?.purchased_courses_id &&
                      userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1
                    ) {
                      const { value: text } = await Swal.fire({
                        background: '#171622',
                        color: '#ffec3e',
                        confirmButtonColor: '#c58efe',

                        input: 'textarea',
                        title: t.feedbackTitle,
                        inputPlaceholder: t.typeMessage,
                        inputAttributes: {
                          'aria-label': t.typeMessage,
                        },
                        showCancelButton: true,
                        confirmButtonText: t.submit,
                        cancelButtonText: t.skip,
                      })
                      const response = await axios.post(
                        urlFeedback +
                          '?userId=' +
                          userData.id +
                          '&rating=' +
                          newValue +
                          '&lessonId=' +
                          id +
                          '&feedbackName=' +
                          text
                      )
                      Swal.fire({
                        title: t.thanks,
                        background: '#171622',
                        color: '#ffec3e',
                        confirmButtonColor: '#c58efe',
                      })
                    }
                  } else {
                    Swal.fire({
                      title: t.thanks,
                      background: '#171622',
                      color: '#ffec3e',
                      confirmButtonColor: '#c58efe',
                    })
                  }
                }
              }}
              emptyIcon={<StarBorderIcon fontSize='inherit' sx={{ color: '#45454e' }} />}
              sx={{
                fontSize: 22,
                '& .MuiRating-iconFilled': {
                  color: '#fff', // Color of selected stars
                },
              }}
            />
          </Box>
          <Box sx={{ marginTop: 2 }}>
            {modules ? (
              <CourseLessonMaterials
                setId={setId}
                modules={modules}
                selectedLesson={id ?? -1}
                completedLessonTrigger={completedLessonTrigger}
              />
            ) : selectedCourse ? (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 70 }}
              >
                <CircularProgress sx={{ color: '#fff' }} />
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default LessonDetails
