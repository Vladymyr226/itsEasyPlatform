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

import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'

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
      const resultData = result.getCourses.filter(
        (course: any) => resultUser.purchased_courses_id.indexOf(course.id) != -1
      )
      setData(resultData)
      setDataDisplay(resultData)
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

  const CustomPopper = (props: any) => {
    return <Popper {...props} placement='bottom-start' />
  }

  // Custom Paper Component
  const CustomPaper = styled(Paper)(({ theme }) => ({
    '& .MuiAutocomplete-listbox': {
      padding: 0,
    },
    '&& .Mui-selected': {
      color: '#fff',
      background: '#45444e',
    },
  }))

  const DrawerList = (
    // <Box sx={{ width: 250 }} role='presentation'>
    <Box
      sx={{
        padding: 2,
        paddingTop: 1,

        display: 'flex',
        background: '#171622',
        borderRadius: 2,
        width: '100%',
        gap: 2,
      }}
    >
      <Box sx={{ width: '100%', minWidth: '15rem' }}>
        <InputLabel>&nbsp;</InputLabel>
        <Autocomplete
          disablePortal
          limitTags={3}
          multiple
          id='combo-box-demo'
          value={categorySelect}
          onChange={(event, value: any) => {
            setCategorySelect(value)
          }}
          getOptionLabel={(option: any) => option.name_of_tag}
          options={allCategorySelect.filter((tag: any) => {
            if (categorySelect.filter((selectedtag: any) => selectedtag.id == tag.id).length == 0) {
              return tag
            }
          })}
          fullWidth
          PopperComponent={CustomPopper}
          PaperComponent={CustomPaper}
          sx={{
            color: '#fff',
            '& .MuiChip-label': {
              color: '#fff',
            },
            '&[aria-selected="true"]': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '& .MuiChip-deleteIcon': {
              color: '#fff',
            },
            '& .MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.3)', // Label color
            },
            '.MuiInputBase-input': {
              height: '1.5rem',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
          renderTags={(value, getTagProps) =>
            value.map((item, index) => (
              <Chip
                key={'selectedChip_' + item._id}
                variant='filled'
                label={item.name_of_tag}
                sx={{
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '& .MuiChip-deleteIcon': {
                    color: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
                onDelete={(e) => {
                  setCategorySelect(categorySelect.filter((tag: any) => tag.id != item.id))
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label='Category'
              sx={{
                '.MuiInputBase-input': {
                  height: '1.5rem',
                  color: '#fff',
                },
              }}
            />
          )}
          renderOption={(props: object, option: any, state: object) => (
            <Box
              {...props}
              className=''
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#171622',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#2e2d38',
                },
                padding: 2,
                paddingTop: 1,
                paddingBottom: 1,
              }}
            >
              <div>{option.name_of_tag}</div>
            </Box>
          )}
        />
      </Box>
      <Box sx={{ width: '100%', minWidth: '10rem', maxWidth: '14rem' }}>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>Level</InputLabel>
        <Select
          multiple
          fullWidth
          id='levelSelect'
          value={level}
          onChange={handleChangeLevel}
          MenuProps={{
            MenuListProps: {
              sx: {
                padding: 0,
              },
            },
            PaperProps: {
              sx: {
                backgroundColor: '#2e2d38',
              },
            },
            sx: {
              '& .MuiMenuItem-root': {
                background: '#171622',
                color: '#fff',
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: '#2e2d38',
              },
              '&& .Mui-selected': {
                color: '#fff',
                background: '#45444e',
              },
            },
          }}
          sx={{
            color: '#fff',
            '& .MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <MenuItem value={'Beginner'}>Beginner</MenuItem>
          <MenuItem value={'Junior'}>Junior</MenuItem>
          <MenuItem value={'Middle'}>Middle</MenuItem>
          <MenuItem value={'Senior'}>Senior</MenuItem>
        </Select>
      </Box>
      <Box sx={{ width: '100%', minWidth: '10rem', maxWidth: '14rem' }}>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>Language</InputLabel>
        <Select
          multiple
          fullWidth
          id='languageSelect'
          value={language}
          onChange={handleChangeLanguage}
          MenuProps={{
            MenuListProps: {
              sx: {
                padding: 0,
              },
            },
            PaperProps: {
              sx: {
                backgroundColor: '#2e2d38',
              },
            },
            sx: {
              '& .MuiMenuItem-root': {
                background: '#171622',
                color: '#fff',
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: '#2e2d38',
              },
              '&& .Mui-selected': {
                color: '#fff',
                background: '#45444e',
              },
            },
          }}
          sx={{
            color: '#fff',
            '& .MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <MenuItem value={'RU'}>RU</MenuItem>
          <MenuItem value={'UA'}>UA</MenuItem>
          <MenuItem value={'EN'}>EN</MenuItem>
        </Select>
      </Box>

      <Box sx={{ width: '100%', minWidth: '10rem', maxWidth: '14rem' }}>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>Type</InputLabel>
        <Select
          multiple
          fullWidth
          value={type}
          onChange={handleChangeType}
          id='typeSelect'
          MenuProps={{
            MenuListProps: {
              sx: {
                padding: 0,
              },
            },
            PaperProps: {
              sx: {
                backgroundColor: '#2e2d38',
              },
            },
            sx: {
              '& .MuiMenuItem-root': {
                background: '#171622',
                color: '#fff',
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: '#2e2d38',
              },
              '&& .Mui-selected': {
                color: '#fff',
                background: '#45444e',
              },
            },
          }}
          sx={{
            color: '#fff',
            '& .MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <MenuItem value={'self-education'}>Self education</MenuItem>
          <MenuItem value={'with-lector'}>With lector</MenuItem>
        </Select>
      </Box>

      <IconButton
        aria-label='delete'
        sx={{ marginTop: 3, width: '50px', marginRight: -2 }}
        onClick={(e) => {
          setDate('')
          setPrice([0, maxPrice ?? 1000])
          setLanguage([])
          setLevel([])
          setType([])
          setCategorySelect([])

          setDataDisplay(data)
        }}
      >
        <ClearIcon sx={{ color: '#fff' }} />
      </IconButton>
      <Button
        variant='text'
        sx={{ borderRadius: 0, marginTop: 3, width: '20rem', color: '#fff' }}
        onClick={(e) => {
          handleApply()
        }}
      >
        <b>Apply</b>
      </Button>
    </Box>
    // </Box>
  )
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
  function getProgress(course: any) {
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

    return summ == 0 ? 0 : (summCompleted * 100) / summ
  }

  return (
    <Layout>
      <Box sx={{ display: 'inline' }}>
        {DrawerList}
        <Box sx={{ width: '100%', color: '#fff', minHeight: '40rem' }}>
          {dataDisplay && dataDisplay.length > 0 ? (
            dataDisplay.map((course: Course, index: number) => {
              return (
                <>
                  <div key={'MainelementContainer_' + course.id}>
                    {index != 0 && (
                      <Box
                        key={'rowDividerWide_'}
                        sx={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.3)',
                          minWidth: '60rem',
                          height: '2px',
                        }}
                      ></Box>
                    )}
                    <Box
                      key={'rowContainerWide_'}
                      sx={{
                        display: 'flex',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        width: '100%',
                        color: '#fff',
                      }}
                    >
                      <Box
                        sx={{
                          borderRight: '2px solid rgba(255, 255, 255, 0.3)',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {course.data.title}
                      </Box>

                      <Box
                        sx={{
                          borderRight: '2px solid rgba(255, 255, 255, 0.3)',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {course.data.language}
                      </Box>
                      <Box
                        sx={{
                          borderRight: '2px solid rgba(255, 255, 255, 0.3)',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {course.data.level}
                      </Box>
                      <Box
                        sx={{
                          borderRight: '2px solid rgba(255, 255, 255, 0.3)',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {course.data.type}
                      </Box>

                      <Box
                        sx={{
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <CircularProgress
                          variant='determinate'
                          size={20}
                          sx={{ color: '#0B6623' }}
                          value={getProgress(course.data)}
                        />
                        <Box sx={{ marginLeft: 2 }}>{countLessons(course.data)}</Box>
                        <Link href={'/course-details?id=' + course.id}>
                          <ForwardIcon sx={{ marginLeft: 2, color: 'rgba(255, 255, 255, 0.3)' }} />
                        </Link>
                      </Box>
                    </Box>
                  </div>
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

export default MyCourses
