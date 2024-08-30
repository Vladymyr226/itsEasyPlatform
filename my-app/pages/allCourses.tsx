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
import { useRouter as detailedRouter } from 'next/router'
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
import { InputLabel, IconButton, Chip, ToggleButtonGroup, ToggleButton, Grid } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import { TabPanelProps, Module, Tag } from '@/utils/interfaces'
import OutlinedInput from '@mui/material/OutlinedInput'
import CourseCard from '@/components/CourseCard/CourseCard'
import ClearIcon from '@mui/icons-material/Clear'
import { styled } from '@mui/material/styles'

import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewStreamIcon from '@mui/icons-material/ViewStream'
import CourseGridCard from '@/components/CourseGridCard/CourseGridCard'
import { getLocale } from '@/utils/getLocale'
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
  created_at: string
  views: number
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
      const layoutType = localStorage.getItem('layoutType')
      if (layoutType == 'list') {
        setView('list')
      }
      if (layoutType == 'grid') {
        setView('grid')
      }
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
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      getPageData()
    }
  }, [])

  const router = useRouter()
  const routerLocale = detailedRouter()

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
  const CustomPopper = (props: any) => {
    return (
      <Popper
        {...props}
        sx={{ width: { xs: '', md: 'fit-content !important' } }}
        placement='bottom-start'
      />
    )
  }
  const CustomPaper = styled(Paper)(({ theme }) => ({
    '& .MuiAutocomplete-listbox': {
      padding: 0,
    },
    '&& .Mui-selected': {
      color: '#c7c6c6',
      background: '#45444e',
    },
  }))
  const [view, setView] = useState('list')
  const t = getLocale()
  const DrawerList = (
    // <Box sx={{ width: 250 }} role='presentation'>
    <Box
      sx={{
        padding: 2,
        paddingTop: 1,

        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        background: '#171622',
        borderRadius: 2,
        width: '100%',
        gap: 2,
      }}
    >
      <Box sx={{ width: '100%', minWidth: '15rem' }}>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>{t.category_label}</InputLabel>
        <Autocomplete
          disablePortal
          fullWidth
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
          PopperComponent={CustomPopper}
          PaperComponent={CustomPaper}
          sx={{
            maxWidth: '100%',
            color: '#c7c6c6',
            '&[aria-selected="true"]': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '& .MuiChip-label': {
              color: '#c7c6c6',
            },
            '& .MuiChip-deleteIcon': {
              color: '#c7c6c6',
            },
            '& .MuiSvgIcon-root': {
              color: 'rgba(255, 255, 255, 0.3)',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.3)', // Label color
            },
            '.MuiInputBase-input': {
              height: '0px',
              padding: '0px',
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
            '& .MuiInputBase-root': {
              height: categorySelect.length == 0 ? '40px' : 'auto', // Set the height of the input base
            },
            '& .MuiOutlinedInput-root': {
              height: categorySelect.length == 0 ? '40px' : 'auto',
            },
            '& .MuiAutocomplete-inputRoot': {
              height: categorySelect.length == 0 ? '40px' : 'auto',
            },
            '&.Mui-focused .MuiInputBase-root, &.Mui-focused .MuiOutlinedInput-root, &.Mui-focused .MuiAutocomplete-inputRoot':
              {
                minHeight: '40px',
                height: 'auto', // Set the height to auto when focused
              },
          }}
          renderTags={(value, getTagProps) =>
            value.map((item, index) => (
              <Chip
                key={'selectedChip_' + item._id}
                variant='filled'
                label={item.name_of_tag}
                sx={{
                  color: '#c7c6c6',
                  height: '22px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '& .MuiChip-label': {},
                  '& .MuiChip-deleteIcon': {
                    color: 'rgba(255, 255, 255, 0.2)',
                    height: '15px',
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
              sx={{
                '.MuiInputBase-input': {
                  height: '8px',
                  color: '#c7c6c6',
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
                color: '#c7c6c6',
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
      <Box sx={{ width: '100%', minWidth: '10rem', maxWidth: { xs: '100%', md: '14rem' } }}>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>{t.level}</InputLabel>
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
                color: '#c7c6c6',
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: '#2e2d38',
              },
              '&& .Mui-selected': {
                color: '#c7c6c6',
                background: '#45444e',
              },
            },
          }}
          sx={{
            maxWidth: '100%',
            color: '#c7c6c6',
            height: 40,
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
      <Box sx={{ width: '100%', minWidth: '10rem', maxWidth: { xs: '100%', md: '14rem' } }}>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>{t.language}</InputLabel>
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
                color: '#c7c6c6',
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: '#2e2d38',
              },
              '&& .Mui-selected': {
                color: '#c7c6c6',
                background: '#45444e',
              },
            },
          }}
          sx={{
            maxWidth: '100%',
            color: '#c7c6c6',
            height: 40,
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
          renderValue={(selected: any) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selected.map((value: any) => (
                <Box key={value} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {value === 'RU' && (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 9 6'
                      width='20'
                      height='12'
                    >
                      <rect fill='#c7c6c6' width='9' height='3' />
                      <rect fill='#d52b1e' y='3' width='9' height='3' />
                      <rect fill='#0039a6' y='2' width='9' height='2' />
                    </svg>
                  )}
                  {value === 'UA' && (
                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='12'>
                      <rect width='1200' height='10' fill='#0057B7' />
                      <rect width='1200' height='10' y='6' fill='#FFD700' />
                    </svg>
                  )}
                  {value === 'EN' && (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 50 30'
                      width='20'
                      height='12'
                    >
                      <clipPath id='t'>
                        <path d='M25,15h25v15zv15h-25zh-25v-15zv-15h25z' />
                      </clipPath>
                      <path d='M0,0v30h50v-30z' fill='#012169' />
                      <path d='M0,0 50,30M50,0 0,30' stroke='#c7c6c6' stroke-width='6' />
                      <path
                        d='M0,0 50,30M50,0 0,30'
                        clip-path='url(#t)'
                        stroke='#C8102E'
                        stroke-width='4'
                      />
                      <path
                        d='M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z'
                        fill='#C8102E'
                        stroke='#c7c6c6'
                        stroke-width='2'
                      />
                    </svg>
                  )}
                  <span>{value}</span>
                </Box>
              ))}
            </Box>
          )}
        >
          <MenuItem value={'RU'}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6' width='35' height='20'>
                  <rect fill='#c7c6c6' width='9' height='3' />
                  <rect fill='#d52b1e' y='3' width='9' height='3' />
                  <rect fill='#0039a6' y='2' width='9' height='2' />
                </svg>
              </div>
              <p style={{ marginLeft: '20px' }}>RU</p>
            </Box>
          </MenuItem>
          <MenuItem value={'UA'}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                <svg xmlns='http://www.w3.org/2000/svg' width='35' height='20'>
                  <rect width='1200' height='10' fill='#0057B7' />
                  <rect width='1200' height='10' y='10' fill='#FFD700' />
                </svg>
              </div>
              <p style={{ marginLeft: '20px' }}>UA</p>
            </Box>
          </MenuItem>
          <MenuItem value={'EN'}>
            <div style={{ display: 'flex' }}>
              <div style={{ height: '20px', width: '20px', position: 'relative' }}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 30' width='35' height='20'>
                  <clipPath id='t'>
                    <path d='M25,15h25v15zv15h-25zh-25v-15zv-15h25z' />
                  </clipPath>
                  <path d='M0,0v30h50v-30z' fill='#012169' />
                  <path d='M0,0 50,30M50,0 0,30' stroke='#c7c6c6' stroke-width='6' />
                  <path
                    d='M0,0 50,30M50,0 0,30'
                    clip-path='url(#t)'
                    stroke='#C8102E'
                    stroke-width='4'
                  />
                  <path
                    d='M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z'
                    fill='#C8102E'
                    stroke='#c7c6c6'
                    stroke-width='2'
                  />
                </svg>
              </div>
              <p style={{ marginLeft: '20px' }}>EN</p>
            </div>
          </MenuItem>
        </Select>
      </Box>

      <Box sx={{ width: '100%', minWidth: '10rem', maxWidth: { xs: '100%', md: '14rem' } }}>
        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>{t.type}</InputLabel>
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
                color: '#c7c6c6',
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: '#2e2d38',
              },
              '&& .Mui-selected': {
                color: '#c7c6c6',
                background: '#45444e',
              },
            },
          }}
          sx={{
            maxWidth: '100%',
            color: '#c7c6c6',
            height: 40,
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
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '20rem' },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          variant='text'
          sx={{ borderRadius: 0, marginTop: 3, width: '20rem', color: '#c7c6c6' }}
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
          <b>{t.clear}</b>
        </Button>
      </Box>
    </Box>
    // </Box>
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

  useEffect(() => {
    handleApply()
  }, [categorySelect])
  useEffect(() => {
    handleApply()
  }, [level])
  useEffect(() => {
    handleApply()
  }, [language])
  useEffect(() => {
    handleApply()
  }, [type])
  return (
    <Layout>
      <Box sx={{ display: 'inline' }}>
        {DrawerList}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 2,
          }}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => {
              if (newView !== null) {
                localStorage.setItem('layoutType', newView)
                setView(newView)
              }
            }}
            sx={{ height: '60px', background: '#171622', borderRadius: 2 }}
          >
            <ToggleButton value='list' aria-label='list' sx={{}}>
              <ViewStreamIcon
                sx={{
                  fontSize: 20,
                  color: view == 'list' ? '#c7c6c6' : 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </ToggleButton>
            <ToggleButton value='grid' aria-label='grid' sx={{}}>
              <GridViewIcon
                sx={{
                  fontSize: 20,
                  color: view == 'grid' ? '#c7c6c6' : 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ width: '100%', color: '#c7c6c6', minHeight: '40rem', marginTop: -7 }}>
          {view == 'list' && (
            <>
              {dataDisplay ? (
                dataDisplay.length > 0 ? (
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
                          createdAt={course.created_at}
                          views={course.views}
                        />
                      </>
                    )
                  })
                ) : (
                  <h1 style={{ color: '#c7c6c6', textAlign: 'center', marginTop: '100px' }}>
                    Nothing was found
                  </h1>
                )
              ) : (
                <></>
              )}
            </>
          )}
          {view == 'grid' && (
            <>
              {dataDisplay ? (
                dataDisplay.length > 0 ? (
                  <Grid
                    container
                    sx={{ gap: 20, justifyContent: { xs: 'center', md: 'left' }, paddingTop: 10 }}
                  >
                    {dataDisplay.map((course: Course, index: number) => {
                      return (
                        <>
                          <Grid item sx={{}}>
                            <CourseGridCard course={course} />
                          </Grid>
                        </>
                      )
                    })}
                  </Grid>
                ) : (
                  <h1 style={{ color: '#c7c6c6', textAlign: 'center', marginTop: '100px' }}>
                    Nothing was found
                  </h1>
                )
              ) : (
                <></>
              )}
            </>
          )}
        </Box>
      </Box>
    </Layout>
  )
}

export default AllCoursesDetails
