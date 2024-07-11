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
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import Swal from 'sweetalert2'
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
  link: string
  description: any
}
interface Lesson {
  id: string
  data: LessonData
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
        setData(result)
        if (localStorage.getItem('SelectedCourse') && localStorage.getItem('SelectedModuleIndex')) {
          console.log(123)
          const responseCourse = await fetch(url + '/' + localStorage.getItem('SelectedCourse'), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const resultCourse = await responseCourse.json()
          console.log(resultCourse)
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
          console.log(modules)
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
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }
  function ExampleYouTube(props: YouTubeProp) {
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
      // access to player in all event handlers via event.target
      event.target.pauseVideo()
    }

    const opts: YouTubeProps['opts'] = {
      height: '500',
      width: '100%',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    }

    return <YouTube videoId={props.url} opts={opts} onReady={onPlayerReady} />
  }
  function getLessonIndx() {
    return moduleLessons?.indexOf(data ? data.id : '-1') ?? -1
  }
  const router = useRouter()
  const [completedLessonTrigger, setCompletedLessonTrigger] = useState(false)
  console.log(userData)

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '140vb' }}>
        {data && (
          <Box
            sx={{
              width: '100%',

              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <Box sx={{ height: '140vb', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ width: '100%' }}>
                <ExampleYouTube url={data.data.link.split('?v=')[1]} />
              </Box>
              <h1 style={{ textAlign: 'left', color: '#ffec3e', marginBottom: '20px' }}>
                <b>{data && data.data.title}</b>
              </h1>
              <Box sx={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
                <Box sx={{ width: '100%', height: 'max-content', color: '#fff', padding: '15px' }}>
                  <SlateView value={data && data.data.description} />
                </Box>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  gap: 1,
                  marginTop: 2,
                }}
              >
                {getLessonIndx() > 0 && (
                  <Button
                    variant='text'
                    onClick={(e) => {
                      if (getLessonIndx() > 0) {
                        if (moduleLessons) {
                          router.replace('/lesson?id=' + moduleLessons[getLessonIndx() - 1])
                          setId(Number(moduleLessons[getLessonIndx() - 1]))
                        }
                      }
                    }}
                    startIcon={<ArrowBackIosIcon />}
                  ></Button>
                )}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  {userData &&
                    userData?.purchased_courses_id &&
                    userData?.purchased_courses_id.indexOf(Number(selectedCourse)) != -1 &&
                    userData?.comleted_lessons_id &&
                    userData?.comleted_lessons_id.indexOf(id) == -1 && (
                      <Button
                        variant='contained'
                        sx={{ maxWidth: '500px', width: '50%' }}
                        onClick={async (e) => {
                          const response = await axios.put(urlUser + '?id=' + userData.id, {
                            purchasedCoursesId: [...userData.purchased_courses_id],
                            favouriteCoursesId: [...userData.favourite_courses_id],
                            comletedLessonsId: [...userData.comleted_lessons_id, id],
                          })
                          const resultResponse = response.data
                          setCompletedLessonTrigger(!completedLessonTrigger)
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
                              router.replace('/lesson?id=' + moduleLessons[getLessonIndx() + 1])
                              setId(Number(moduleLessons[getLessonIndx() + 1]))
                            }
                          }
                        }}
                      >
                        Complete
                      </Button>
                    )}
                </Box>

                {moduleLessons &&
                  getLessonIndx() >= 0 &&
                  getLessonIndx() < moduleLessons?.length - 1 && (
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
                        }
                      }}
                      endIcon={<ArrowForwardIosIcon />}
                    ></Button>
                  )}
              </Box>
            </Box>
          </Box>
        )}
        {data && (
          <Box
            sx={{
              height: '140vb',
              paddingLeft: 1,
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              width: '380px',
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
              <h3>Your rate:</h3>
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
                          input: 'textarea',
                          inputLabel: 'Message',
                          inputPlaceholder: 'Type your message here...',
                          inputAttributes: {
                            'aria-label': 'Type your message here',
                          },
                          showCancelButton: true,
                        })
                        const response = await axios.post(
                          urlFeedback +
                            '?userId=' +
                            userData.id +
                            '&lessonId=' +
                            id +
                            '&feedbackName=' +
                            text
                        )
                        Swal.fire('Thank you for your feedback!')
                      }
                    } else {
                      Swal.fire('Thank you for your feedback!')
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
              {modules && (
                <CourseLessonMaterials
                  setId={setId}
                  modules={modules}
                  selectedLesson={id ?? -1}
                  completedLessonTrigger={completedLessonTrigger}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default LessonDetails
