'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import s from './HomePage.module.css'
import CourseCard from '@/components/CourseCard/CourseCard'
import FaqSection from '@/components/FaqSection/FaqSection'
import PopularArticles from '@/components/PopularArticles/PopularArticles'
import PromoSlider from '@/components/PromoSlider/PromoSlider'
import plus from '../src/assets/plus.svg'
import loadMoreButton from '../src/assets/loadMoreButton.png'
import Layout from '@/components/Layout/Layout'
import './globals.css'
import Link from 'next/link'
const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
import Autocomplete from '@mui/material/Autocomplete'
import { Box, Button, TextField, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Tag } from '@/utils/interfaces'
import courseShadow from '../src/assets/shadows/courseHoverShadow.png'
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
interface mediaDataValue {
  type: string
  content: string
}
interface Course {
  id: string
  data: CourseData
  is_active: boolean
}
const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`
export default function HomePage() {
  const [width, setWidth] = useState(0)
  const [data, setData] = useState<Array<Course>>()
  const [dataDisplay, setDataDisplay] = useState<any>()
  const [selectedTag, setSelectedTag] = useState<Array<String>>([])
  const [allCategorySelect, setAllCategorySelect] = useState<Array<Tag>>([])
  const [searchField, setSearchField] = useState<string>('')
  async function getPageData() {
    if (typeof window !== 'undefined') {
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

      const response = await fetch(url + 's?isActive=true', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      setData(result.getCourses)
      setDataDisplay(result.getCourses)
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      getPageData()
    }
  }, [])
  useEffect(() => {
    handleApply()
  }, [selectedTag])
  function arraysHaveCommonElements(array1: any, array2: any) {
    return array1.some((element: any) => array2.includes(element))
  }

  const handleApply = () => {
    let filteredRes = data
    if (filteredRes) {
      if (selectedTag.length) {
        filteredRes = filteredRes.filter((dataFilter: any) =>
          arraysHaveCommonElements(
            dataFilter.data.category,
            selectedTag.map((tag: any) => {
              return tag
            })
          )
        )
      }
      if (searchField.length > 0) {
        filteredRes = filteredRes.filter((dataFilter: any) =>
          dataFilter.data.title.includes(searchField.trim())
        )
      }
    }

    setDataDisplay(filteredRes)
  }

  return (
    <Layout>
      <div className={s.homePage}>
        <PromoSlider />

        <h1 className={s.coursesTitle}>Курсы</h1>
        <Box sx={{ paddingTop: 10, display: 'flex', justifyContent: 'center' }}>
          <form
            style={{ maxWidth: '1000px', width: '100%' }}
            onSubmit={(e) => {
              e.preventDefault()
              handleApply()
            }}
          >
            <TextField
              autoComplete={'off'}
              id='standard-name'
              fullWidth
              placeholder='Find course'
              onChange={(e) => setSearchField(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={(e) => {
                      handleApply()
                    }}
                  >
                    <SearchIcon sx={{ color: '#45454e' }} fontSize='large' />
                  </IconButton>
                ),
              }}
              inputProps={{ style: { fontSize: 25 } }}
              sx={{
                background: '#171622',
                '& .MuiInputBase-root': {
                  color: '#8b8b92',
                },
                '& .MuiInputLabel-root': {
                  color: '#8b8b92',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#28263a',
                  },
                  '&:hover fieldset': {
                    borderColor: '#28263a',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#28263a',
                  },
                },
              }}
            />
          </form>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'left', md: 'center' },
            marginTop: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              maxWidth: '1000px',
              gap: 2,
              padding: 2,
            }}
          >
            {allCategorySelect.map((tag: Tag) => {
              if (tag.icon_url) {
                return (
                  <Box
                    key={tag.id}
                    className={s.courseImageWrapper}
                    sx={{
                      display: 'flex',
                      background: '#171622',
                      alignItems: 'center',
                      padding: '20px',
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      borderRadius: 4,
                      position: 'relative',
                    }}
                    onClick={(e) => {
                      if (selectedTag.indexOf(tag.id) == -1) {
                        setSelectedTag([...selectedTag, tag.id])
                      } else {
                        setSelectedTag(selectedTag.filter((tagFilter) => tagFilter != tag.id))
                      }
                    }}
                  >
                    <Image
                      className={s.shadow}
                      src={courseShadow}
                      alt='shadow'
                      style={selectedTag.indexOf(tag.id) == -1 ? {} : { opacity: 1 }}
                    />
                    <img
                      src={tag.icon_url}
                      alt={'tagIcon_' + tag.id}
                      style={{ width: 45, height: 45 }}
                    />
                    <div style={{ marginLeft: 8, paddingRight: '50px', whiteSpace: 'nowrap' }}>
                      {tag.name_of_tag}
                    </div>
                  </Box>
                )
              }
            })}
          </Box>
        </Box>
        {dataDisplay &&
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
          })}

        {width >= 1200 ? (
          <Link href={'/allCourses'}>
            <button className={s.loadMoreButton}>
              Смотреть ещё курсы <Image src={plus} alt='plus' />
            </button>
          </Link>
        ) : (
          <div className={s.loadMoreImageWrapper}>
            <Image className={s.mobileLoadMoreButton} src={loadMoreButton} alt='load more' />
          </div>
        )}

        <FaqSection />

        <PopularArticles />
      </div>
    </Layout>
  )
}
