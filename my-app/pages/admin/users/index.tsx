'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Comments from '@/components/Comments/Comments'
import CourseControlls from '@/components/CourseControlls/CourseControlls'
import CourseMaterials from '@/components/CourseMaterials/CourseMaterials'
import CourseSidebar from '@/components/CourseSidebar/CourseSidebar'
import PlayButton from '@/components/PlayButton/PlayButton'
import PopularCourses from '@/components/PopularCourses/PopularCourses'
import Rating from '@/components/Rating/Rating'
import SkillsList from '@/components/SkillsList/SkillsList'
import ViewsCount from '@/components/ViewsCount/ViewsCount'
import Layout from '@/components/Layout/Layout'
import '../../../app/globals.css'
import { Box, Button, Typography } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Link from 'next/link'
const tableColumn = {
  minWidth: '10rem',
  width: '100%',
  textAlign: 'center',
  fontWeight: 'bold',
  background: '#cccccc',
}
const tableElement = {
  minWidth: '10rem',
  width: '100%',
  textAlign: 'center',
  fontWeight: 'bold',
  background: '#ffec3e',
}
const url = 'https://its-easy-platform-back-end.vercel.app/api/auth/users'

const TableColumns = () => {
  return (
    <>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Username
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Email
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Created at
      </Box>
    </>
  )
}
const AdminTable = () => {
  const [width, setWidth] = useState(0)

  const [data, setData] = useState<Array<any>>()
  async function getPageData() {
    if (typeof window !== 'undefined') {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      setData(result.getLessons)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
      getPageData()
    }
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', background: '#fff', paddingTop: 8, paddingBottom: 8 }}>
      <Box
        sx={{
          paddingLeft: '2rem',
          paddingRight: '2rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ marginRight: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Link href={'/admin'}>
            <Box
              sx={{
                fontWeight: 'bold',
                paddingLeft: 2,
                paddingRight: 2,
                color: '#000',

                fontSize: 20,
              }}
            >
              Courses
            </Box>
          </Link>
          <Link href={'/users'}>
            <Box
              sx={{
                fontWeight: 'bold',
                paddingLeft: 2,
                paddingRight: 2,
                color: '#000',
                borderLeft: '2px solid #000',
                fontSize: 20,
              }}
            >
              Users
            </Box>
          </Link>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: '100%',

              boxShadow: 2,
              borderRadius: '10px',

              border: '1px solid #000',
              borderTop: '4px solid #000',
              overflowX: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                background: '#cccccc',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                paddingTop: 1,
                paddingBottom: 1,
                width: '100%',
                minWidth: '30rem',
              }}
            >
              <TableColumns />
            </Box>
            {data ? (
              data.map((element) => {
                return (
                  <div key={'MainelementContainer'}>
                    <Box
                      key={'rowDividerWide_'}
                      sx={{
                        width: '100%',
                        background: '#000',
                        minWidth: '30rem',
                        height: '2px',
                      }}
                    ></Box>
                    <Box
                      key={'rowContainerWide_'}
                      sx={{
                        display: 'flex',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          borderRight: '2px solid #000',
                          minWidth: '10rem',
                          width: '100%',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                        }}
                      >
                        {element.user_name}
                      </Box>
                      <Box
                        sx={{
                          borderRight: '2px solid #000',
                          minWidth: '10rem',
                          width: '100%',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                        }}
                      >
                        {element.email}
                      </Box>
                      <Box
                        sx={{
                          minWidth: '10rem',
                          width: '100%',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                        }}
                      >
                        {new Date(element.created_at).toLocaleDateString() +
                          ' , ' +
                          new Date(element.created_at).toLocaleTimeString()}
                      </Box>
                    </Box>
                  </div>
                )
              })
            ) : (
              <div>
                <LinearProgress
                  sx={{
                    minWidth: '110rem',
                  }}
                />
                <Box
                  sx={{
                    color: '#ffec3e',
                    marginTop: 2,
                    width: '100%',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                ></Box>
              </div>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminTable
