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
import Rating from '@/components/Rating/Rating'
import SkillsList from '@/components/SkillsList/SkillsList'
import ViewsCount from '@/components/ViewsCount/ViewsCount'
import Layout from '@/components/Layout/Layout'
import '../../app/globals.css'
import SlateView from '@/components/SlateEditor/View'
import { Box, Button } from '@mui/material'
import YouTube, { YouTubeProps } from 'react-youtube'

import { YouTubeProp } from '@/utils/interfaces'
import { useRouter } from 'next/navigation'
import { Accordion, AccordionDetails, AccordionSummary, Checkbox } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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

  const [play, setPlay] = useState(false)
  const videoRef = useRef(null)

  async function getPageData() {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href

      if (fullUrl.split('id=')[1]) {
        const response = await fetch(urlLesson + '/' + fullUrl.split('id=')[1], {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
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

  const [expanded, setExpanded] = useState<string | false>(false)
  const handleChangeExpanded =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  return (
    <Layout>
      {data && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                          router.push('/lesson?id=' + moduleLessons[getLessonIndx() - 1])
                          setTimeout(() => {
                            router.refresh()
                          }, 100)
                        }
                      }
                    }}
                    startIcon={<ArrowBackIosIcon />}
                  ></Button>
                )}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Button variant='contained' sx={{ maxWidth: '500px', width: '50%' }}>
                    Complete
                  </Button>
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
                            router.push('/lesson?id=' + moduleLessons[getLessonIndx() + 1])
                            setTimeout(() => {
                              router.refresh()
                            }, 100)
                          }
                        }
                      }}
                      endIcon={<ArrowForwardIosIcon />}
                    ></Button>
                  )}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: '380px',
              height: '140vb',
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              paddingLeft: 1,
            }}
          >
            {modules && <CourseLessonMaterials modules={modules} />}

            {/* {modules &&
              modules.map((element: Module, i: number) => {
                return (
                  <Box key={'mainModuleContainer_' + i} sx={{ boxShadow: 2, marginTop: 1 }}>
                    <Accordion defaultExpanded={true} sx={{}}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          borderBottom: expanded === 'panel' + i ? '2px solid' : '',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            width: '100%',
                            gap: '10px',
                            justifyContent: 'space-between',
                          }}
                        >
                          <p>{element.title}</p>
                        </div>
                      </AccordionSummary>

                      <AccordionDetails style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                        {element.lessons.map((lesson: any, index: number) => {
                          return (
                            <div
                              key={'mainModuleContainer_' + i}
                              style={{
                                color: '#0f0e16',
                                width: '100%',
                                background: '#cccccc',
                                marginTop: '16px',
                                padding: '16px',
                                boxShadow:
                                  '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
                                display: 'flex',
                              }}
                              onClick={(e) => {
                                if (moduleLessons) {
                                  localStorage.setItem('SelectedModuleIndex', i + '')
                                  router.push('/lesson?id=' + lesson.id)

                                  setTimeout(() => {
                                    router.refresh()
                                  }, 100)
                                }
                              }}
                            >
                              <Checkbox
                                checked={false}
                                disabled
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                              <Box sx={{ fontWeight: 'bold', marginTop: 1.3 }}>
                                {lesson.data.title ?? ''}
                              </Box>
                            </div>
                          )
                        })}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )
              })} */}
          </Box>
        </Box>
      )}
    </Layout>
  )
}

export default LessonDetails
