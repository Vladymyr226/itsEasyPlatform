'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import s from './HomePage.module.css'
import CourseCard from '@/components/CourseCard/CourseCard'
import FaqSection from '@/components/FaqSection/FaqSection'
import PromoSlider from '@/components/PromoSlider/PromoSlider'
import plus from '../src/assets/plus.svg'
import Layout from '@/components/Layout/Layout'
import '../app/globals.css'
import Link from 'next/link'
import { Box, TextField, IconButton, CircularProgress } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Course, Tag } from '@/utils/interfaces'
import courseShadow from '../src/assets/shadows/courseHoverShadow.png'
import { getLocale } from '@/utils/getLocale'
import PopularCourses from '@/components/PopularCourses/PopularCourses'

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`
const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`
const urlFavourite = `${process.env.NEXT_BACK_HOST_API}/auth/favorite`
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`

export default function HomePage() {
  const t = getLocale()

  const [width, setWidth] = useState(0)
  const [data, setData] = useState<Array<Course>>()
  const [userData, setUserData] = useState<any>()

  const [dataDisplay, setDataDisplay] = useState<any>()
  const [selectedTag, setSelectedTag] = useState<Array<String>>([])
  const [allCategorySelect, setAllCategorySelect] = useState<Array<Tag>>([])
  const [searchField, setSearchField] = useState<string>('')
  const [favouriteCourses, setFavouriteCourses] = useState<Array<string>>([])

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
        }),
      )

      const userId = localStorage.getItem('UserID')
      const responseUser = await fetch(urlUser + '/' + userId, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resultUser = await responseUser.json()
      setFavouriteCourses(resultUser.favourite_courses_id)
      setUserData(resultUser)
      const response = await fetch(url + 's?isActive=true', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      const dataRes = result.getCourses.sort(function(a: any, b: any) {
        return b.data.rating - a.data.rating
      })
      setData(dataRes)
      setDataDisplay(dataRes)
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
  useEffect(() => {
    handleApply()
  }, [searchField])

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
            }),
          ),
        )
      }
      if (searchField.length >= 2) {
        filteredRes = filteredRes.filter((dataFilter: any) =>
          dataFilter.data.title.toLowerCase().includes(searchField.trim().toLowerCase()),
        )
      }
    }
    if (filteredRes) {
      filteredRes = filteredRes.sort(function(a: any, b: any) {
        return b.data.rating - a.data.rating
      })
    }
    setDataDisplay(filteredRes)
  }
  const [isShownHints, setIsShownHints] = useState(false)

  return (
    <Layout>
      <div className={s.homePage}>
        <PromoSlider />
        <h1 className={s.coursesTitle}>{t.courses}</h1>
        <Box sx={{ paddingTop: 4, display: 'flex', justifyContent: 'center' }}>
          <form
            style={{ maxWidth: '700px', width: '100%', position: 'relative' }}
            onSubmit={(e) => {
              e.preventDefault()
              handleApply()
            }}
          >
            <TextField
              autoComplete={'off'}
              id="standard-name"
              fullWidth
              placeholder={t.find_course}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              onBlur={(e) => {
                setTimeout(() => {
                  setIsShownHints(false)
                }, 500)
              }}
              onFocus={(e) => {
                setIsShownHints(true)
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={(e) => {
                      handleApply()
                    }}
                  >
                    <SearchIcon sx={{ color: '#45454e' }} fontSize="medium" />
                  </IconButton>
                ),
              }}
              inputProps={{ style: { fontSize: 18 } }}
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
            {searchField.trim().length >= 2 && isShownHints && (
              <div
                style={{
                  width: '100%',
                  background: '#171622',
                  position: 'absolute',
                  zIndex: 4,
                  border: '1px solid #28263a',
                }}
              >
                {dataDisplay.filter((dataFilter: any) =>
                  dataFilter.data.title.toLowerCase().includes(searchField.trim().toLowerCase()),
                ).length === 0 && (
                  <Box
                    sx={{
                      padding: '10px',
                      cursor: 'pointer',
                      '&:hover': {
                        background: '#28263a',
                      },
                    }}
                  >
                    {t.nothing_found}
                  </Box>
                )}
                {dataDisplay
                  .filter((dataFilter: any) =>
                    dataFilter.data.title.toLowerCase().includes(searchField.trim().toLowerCase()),
                  )
                  .map((result: any) => {
                    return (
                      <Box
                        key={result.id}
                        onClick={(e) => {
                          setSearchField(result.data.title)
                        }}
                        sx={{
                          padding: '10px',
                          cursor: 'pointer',
                          '&:hover': {
                            background: '#28263a',
                          },
                        }}
                      >
                        {result.data.title}
                      </Box>
                    )
                  })}
              </div>
            )}
          </form>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'left', md: 'center' },
            marginTop: 2,
            marginBottom: -6,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              maxWidth: '1200px',
              width: '100%',
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
                      alt="shadow"
                      style={selectedTag.indexOf(tag.id) == -1 ? {} : { opacity: 1 }}
                    />
                    <img
                      src={tag.icon_url}
                      alt={'tagIcon_' + tag.id}
                      style={{ width: 30, height: 30 }}
                    />
                    <div
                      style={{
                        marginLeft: 8,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tag.name_of_tag}
                    </div>
                  </Box>
                )
              }
            })}
          </Box>
        </Box>
        {dataDisplay ? (
          dataDisplay.length > 0 ? (
            dataDisplay.map((course: Course, index: number) => {
              return (
                <>
                  <CourseCard
                    title={course.data.title}
                    language={course.language}
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
                    isFavoriteStart={favouriteCourses ? favouriteCourses.indexOf(course.id) != -1 : false}
                    userData={userData}
                  />
                </>
              )
            })
          ) : (
            <h1 style={{ color: '#c7c6c6', textAlign: 'center', marginTop: '150px' }}>
              {t.nothing_found}
            </h1>
          )
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <CircularProgress sx={{ color: '#ffec3e' }} />
          </Box>
        )}

        {width >= 1200 ? (
          <Link href={'/allCourses'}>
            <button className={s.loadMoreButton}>
              {t.see_more}
              <Image src={plus} alt="plus" />
            </button>
          </Link>
        ) : (
          <Link href={'/allCourses'}>
            <button className={s.loadMoreButton}>
              {t.see_more}
              <Image src={plus} alt="plus" />
            </button>
          </Link>
        )}

        <FaqSection />
        {dataDisplay && (
          <>
            <div
              style={{
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
                <PopularCourses data={dataDisplay} />
              </Box>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
