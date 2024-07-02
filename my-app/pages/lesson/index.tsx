'use client'
import s from '../CourseDetails.module.css'
import skillsImage from '../../../src/assets/skillsImage.png'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Comments from '@/components/Comments/Comments'
import CourseControlls from '@/components/CourseControlls/CourseControlls'
import CourseMaterials from '@/components/CourseMaterials/CourseMaterials'
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
        }
      } else {
      }
    }
  }

  useEffect(() => {
    console.log('render')
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      getPageData()
    }
  }, [])

  console.log(data)
  console.log(moduleLessons)
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
      height: '390',
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
  return (
    <Layout>
      <h1 style={{ textAlign: 'center', color: '#ffec3e', marginBottom: '20px' }}>
        <b>{data && data.data.title}</b>
      </h1>
      {data && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              maxWidth: '800px',
              width: '100%',

              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ffec3e',
              borderRadius: 2,
              paddingTop: 1,
            }}
          >
            <Box sx={{ width: '100%' }}>
              <ExampleYouTube url={data.data.link.split('?v=')[1]} />
            </Box>
            <Box sx={{ width: '100%', height: 'max-content', background: '#fff', padding: '15px' }}>
              <SlateView value={data && data.data.description} />
            </Box>
            <Box sx={{ width: '100%', display: 'flex', gap: 1, marginTop: 2, marginBottom: 2 }}>
              {getLessonIndx() > 0 && (
                <Button
                  variant='contained'
                  fullWidth
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
                >
                  Previous
                </Button>
              )}
              <Button variant='contained' fullWidth>
                Complete
              </Button>
              {moduleLessons &&
                getLessonIndx() >= 0 &&
                getLessonIndx() < moduleLessons?.length - 1 && (
                  <Button
                    variant='contained'
                    fullWidth
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
                  >
                    Next
                  </Button>
                )}
            </Box>
          </Box>
        </Box>
      )}
    </Layout>
  )
}

export default LessonDetails
