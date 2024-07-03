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
import '../app/globals.css'
import SlateView from '@/components/SlateEditor/View'
import { Box, Button } from '@mui/material'
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
import { InputLabel } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import { TabPanelProps, Module, Tag } from '@/utils/interfaces'
import OutlinedInput from '@mui/material/OutlinedInput'
import CourseCard from '@/components/CourseCard/CourseCard'

const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`

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
const AllCoursesDetails = () => {
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<any>()
  const [dataDisplay, setDataDisplay] = useState<any>()

  const [moduleLessons, setModuleLessons] = useState<Array<string>>()
  const [play, setPlay] = useState(false)
  const videoRef = useRef(null)

  async function getPageData() {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href

      const responseTag = await fetch(urlTag + 's', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resultTag = await responseTag.json()
      setAllCategorySelect(
        resultTag.getTags.map((tag: any) => {
          return tag
        })
      )

      const responseCourse = await fetch(url + 's?isActive=true', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await responseCourse.json()
      setData(result.getCourses)
      setDataDisplay(result.getCourses)
      setMaxPrice(
        result.getCourses
          .map((course: any) => {
            return course.data.price
          })
          .sort(function (a: number, b: number) {
            return a + b
          })[0]
      )
    }
  }

  useEffect(() => {
    console.log('render')
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

  const [price, setPrice] = useState([0, 10000])
  console.log(price)
  const [maxPrice, setMaxPrice] = useState()
  const [language, setLanguage] = useState<any>([])
  const [level, setLevel] = useState<any>([])
  const [type, setType] = useState<any>([])
  const [categorySelect, setCategorySelect] = useState<Array<Tag>>([])
  const [allCategorySelect, setAllCategorySelect] = useState<Array<Tag>>([])

  const handleChangeLanguage = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event
    setLanguage(typeof language === 'string' ? language.split(',') : value)
  }
  const handleChangeLevel = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event
    setLevel(typeof level === 'string' ? level.split(',') : value)
  }
  const handleChangeType = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event
    setType(typeof type === 'string' ? type.split(',') : value)
  }
  const handlePriceChange = (event: any, newValue: any) => {
    setPrice(newValue)
  }

  const handleApply = () => {
    let filteredRes = data
    if (date) {
      filteredRes = filteredRes.filter((dataFilter: any) =>
        isSecondDateAfterFirst(date, dataFilter.data.date)
      )
    }
    if (price) {
      filteredRes = filteredRes.filter(
        (dataFilter: any) => dataFilter.data.price >= price[0] && dataFilter.data.price <= price[1]
      )
    }
    if (language.length) {
      filteredRes = filteredRes.filter(
        (dataFilter: any) => language.indexOf(dataFilter.data.language) != -1
      )
    }
    if (level.length) {
      filteredRes = filteredRes.filter(
        (dataFilter: any) => level.indexOf(dataFilter.data.level) != -1
      )
    }
    if (type.length) {
      filteredRes = filteredRes.filter(
        (dataFilter: any) => type.indexOf(dataFilter.data.type) != -1
      )
    }
    if (categorySelect.length) {
      filteredRes = filteredRes.filter((dataFilter: any) =>
        arraysHaveCommonElements(
          dataFilter.data.category,
          categorySelect.map((category: any) => {
            return category.id
          })
        )
      )
    }
    setDataDisplay(filteredRes)
  }
  const DrawerList = (
    <Box sx={{ width: 250 }} role='presentation'>
      <Box sx={{ padding: 2 }}>
        <Box>
          <h3>Start date</h3>
          <TextField
            autoComplete='off'
            margin='normal'
            required
            fullWidth
            id='date'
            value={date}
            type='date'
            name='date'
            onChange={(e) => {
              setDate(e.target.value)
            }}
            sx={{
              marginTop: 0,
            }}
          />
        </Box>
        <Box>
          <h3>Price</h3>
          <Slider
            getAriaLabel={() => 'Temperature range'}
            value={price}
            max={maxPrice}
            onChange={handlePriceChange}
            valueLabelDisplay='auto'
          />
        </Box>
        <Box>
          <InputLabel>Language</InputLabel>
          <Select
            multiple
            fullWidth
            id='languageSelect'
            value={language}
            onChange={handleChangeLanguage}
          >
            <MenuItem value={'RU'}>RU</MenuItem>
            <MenuItem value={'UA'}>UA</MenuItem>
            <MenuItem value={'EN'}>EN</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel>Level</InputLabel>
          <Select multiple fullWidth id='levelSelect' value={level} onChange={handleChangeLevel}>
            <MenuItem value={'Beginner'}>Beginner</MenuItem>
            <MenuItem value={'Junior'}>Junior</MenuItem>
            <MenuItem value={'Middle'}>Middle</MenuItem>
            <MenuItem value={'Senior'}>Senior</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel>Type</InputLabel>
          <Select multiple fullWidth value={type} onChange={handleChangeType} id='typeSelect'>
            <MenuItem value={'self-education'}>Self education</MenuItem>
            <MenuItem value={'with-lector'}>With lector</MenuItem>
          </Select>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Autocomplete
            disablePortal
            multiple
            id='combo-box-demo'
            value={categorySelect}
            onChange={(event, value: any) => {
              setCategorySelect(value)
            }}
            getOptionLabel={(option: any) => option.name_of_tag}
            options={allCategorySelect}
            fullWidth
            renderInput={(params) => <TextField {...params} label='Category' />}
            renderOption={(props: object, option: any, state: object) => (
              <div {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{option.name_of_tag}</div>
              </div>
            )}
          />
        </Box>
        <Box sx={{ position: 'absolute', display: 'flex', bottom: 0, left: 0, width: 250 }}>
          <Button
            variant='outlined'
            sx={{ borderRadius: 0 }}
            onClick={(e) => {
              setDate('')
              setPrice([0, maxPrice ?? 1000])
              setLanguage([])
              setLevel([])
              setType([])
              setCategorySelect([])
              setAllCategorySelect([])
              setDataDisplay(data)
            }}
          >
            Clear
          </Button>
          <Button
            fullWidth
            variant='contained'
            sx={{ borderRadius: 0 }}
            onClick={(e) => {
              handleApply()
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Box>
  )

  function isSecondDateAfterFirst(date1: string, date2: string) {
    const firstDate = new Date(date1)
    const secondDate = new Date(date2)

    return secondDate > firstDate
  }
  function arrayContainsAll(superset: any, subset: any) {
    return subset.every((element: any) => superset.includes(element))
  }
  function arraysHaveCommonElements(array1: any, array2: any) {
    return array1.some((element: any) => array2.includes(element))
  }

  return (
    <Layout>
      <Box sx={{ display: 'inline' }}>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
        <Button
          variant='contained'
          onClick={toggleDrawer(true)}
          endIcon={<FilterAltIcon />}
          sx={{
            background: '#ffec3e',
            border: '2px solid #ffec3e',
            color: '#000',
            maxHeight: '56px',
            '&:hover': {
              backgroundColor: '#0f0e16',
              border: '2px solid #ffec3e',
              color: '#ffec3e',
              boxShadow: 'none',
            },
          }}
        >
          Filter
        </Button>
        <Box sx={{ width: '100%', color: '#fff', minHeight: '40rem' }}>
          {dataDisplay && dataDisplay.length > 0 ? (
            dataDisplay.map((course: Course, index: number) => {
              return (
                <>
                  <CourseCard
                    title={course.data.title}
                    language={course.data.language}
                    level={course.data.level}
                    date={course.data.date}
                    type={course.data.type}
                    description={course.data.description}
                    rating={course.data.rating}
                    toLeft={index % 2 == 1 ? true : false}
                    id={course.id}
                    mediaValue={course.data.mediaValue}
                  />
                </>
              )
            })
          ) : (
            <h1 style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>
              No data found
            </h1>
          )}
        </Box>
      </Box>
    </Layout>
  )
}

export default AllCoursesDetails
