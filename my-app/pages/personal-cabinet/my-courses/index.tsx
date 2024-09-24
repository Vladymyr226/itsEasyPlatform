'use client'
import { useEffect, useRef, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import '../../../app/globals.css'
import { Box, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'
import { CourseData, Module } from '@/utils/interfaces'
import CircularProgress from '@mui/material/CircularProgress'
import { getLocale } from '@/utils/getLocale'
import CourseGridCard from '@/components/CourseGridCard/CourseGridCard'

const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/user`

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`

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

  return (
    <Layout>
      <Box sx={{ display: 'inline' }}>
        <Box sx={{ width: '100%', color: '#c7c6c6', minHeight: '40rem' }}>
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
                <h1 style={{ color: '#c7c6c6', textAlign: 'center', marginTop: '100px' }}>
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
