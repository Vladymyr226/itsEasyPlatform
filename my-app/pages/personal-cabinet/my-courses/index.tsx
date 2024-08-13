'use client'
import s from './MyCourse.module.css'
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
import '../../../app/globals.css'
import SlateView from '@/components/SlateEditor/View'
import { Box, Button, Grid } from '@mui/material'
import YouTube, { YouTubeProps } from 'react-youtube'

import { YouTubeProp } from '@/utils/interfaces'
import { useRouter } from 'next/navigation'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import TextField from '@mui/material/TextField'
import Slider from '@mui/material/Slider'
import { InputLabel, IconButton, Chip } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import { TabPanelProps, Module, Tag } from '@/utils/interfaces'
import OutlinedInput from '@mui/material/OutlinedInput'
import CourseCard from '@/components/CourseCard/CourseCard'
import ClearIcon from '@mui/icons-material/Clear'
import CircularProgress from '@mui/material/CircularProgress'
import Link from 'next/link'
import ForwardIcon from '@mui/icons-material/Forward'
import { styled } from '@mui/material/styles'
import popularCourseImage from '../../../src/assets/popularCourse.png'
import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import sBlock from '../../../src/components/PopularCourses/PopularCourses.module.css'

import { getLocale } from '@/utils/getLocale'
import CourseGridCard from '@/components/CourseGridCard/CourseGridCard'

const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`

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
interface mediaDataValue {
  type: string
  content: string
}
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
  mediaValue: mediaDataValue
}
interface Course {
  id: string
  data: CourseData
  is_active: boolean
}
const MyCourses = () => {
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<any>()
  const t = getLocale()

  const [dataDisplay, setDataDisplay] = useState<any>()

  const [moduleLessons, setModuleLessons] = useState<Array<string>>()
  const [play, setPlay] = useState(false)
  const videoRef = useRef(null)
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

      const responseTag = await fetch(urlTag + 's', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resultTag = await responseTag.json()

      const responseCourse = await fetch(url + 's?isActive=true', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await responseCourse.json()
      const resultData = result.getCourses.filter(
        (course: any) => resultUser?.purchased_courses_id.indexOf(course.id) != -1
      )
      setData(resultData)
      setDataDisplay(resultData)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      getPageData()
    }
  }, [])

  const router = useRouter()

  const [open, setOpen] = useState(false)

  const toggleDrawer = (newOpen: any) => () => {
    setOpen(newOpen)
  }
  const [date, setDate] = useState('')

  function arraysHaveCommonElements(array1: any, array2: any) {
    return array1.some((element: any) => array2.includes(element))
  }

  function countLessons(course: any) {
    let summ = 0
    let summCompleted = 0
    course.modules.map((module: Module) => {
      module.lessons.map((lesson) => {
        summ += 1
        if (userData.comleted_lessons_id.indexOf(lesson) != -1) {
          summCompleted += 1
        }
      })
    })
    return summCompleted + '/' + summ
  }

  return (
    <Layout>
      <Box sx={{ display: 'inline' }}>
        <Box sx={{ width: '100%', color: '#fff', minHeight: '40rem' }}>
          <Grid
            container
            sx={{ gap: 20, justifyContent: { xs: 'center', md: 'left' }, paddingTop: 10 }}
          >
            {dataDisplay ? (
              dataDisplay.length > 0 ? (
                dataDisplay.map((course: Course, index: number) => {
                  return (
                    <>
                      <Grid item sx={{}}>
                        <CourseGridCard showProgress course={course} />
                      </Grid>
                    </>
                  )
                })
              ) : (
                <h1 style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>
                  Nothing was found
                </h1>
              )
            ) : (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 40, marginBottom: 70 }}
              >
                <CircularProgress sx={{ color: '#ffec3e' }} />
              </Box>
            )}
          </Grid>
        </Box>
      </Box>
    </Layout>
  )
}

export default MyCourses
