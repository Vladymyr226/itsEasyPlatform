'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import Link from 'next/link'
import { deleteCookie } from 'cookies-next'
import '../../../app/globals.css'
import Logo from '@/components/Logo/Logo'
import axios from 'axios'

const tableColumn = {
  minWidth: '10rem',
  width: '100%',
  textAlign: 'center',
  fontWeight: 'bold',
  background: '#cccccc',
}
const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/feedbacks`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`
const urlUser = `${process.env.NEXT_BACK_HOST_API}/auth/users`
const urlPayments = `${process.env.NEXT_BACK_HOST_API}/payment/payments`

const TableColumns = () => {
  return (
    <>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        User
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Course Name
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Costs
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Order Status
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Order Time
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Order ID
      </Box>
    </>
  )
}
const Index = () => {
  const [data, setData] = useState<Array<any>>()

  async function getPageData() {
    if (typeof window !== 'undefined') {
      const data = await axios.get(
        `https://its-easy-platform-back-end.vercel.app/api/payment/payments`,
      )
      setData([...data.data.getPayments])
      console.log(data.data.getPayments)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getPageData()
    }
  }, [])
  return (
    <Box sx={{ minHeight: '100vh', background: '#fff', paddingBottom: 8 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'between',
          padding: 4,
          background: '#000',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Logo />
        </Box>

        <Link href={'/admin/login'}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteCookie('jwt')
            }}
          >
            Logout
          </Button>
        </Link>
      </Box>
      <Box
        sx={{
          marginTop: '2rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            marginRight: 4,
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
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
          <Link href={'/admin/users'}>
            <Box
              sx={{
                fontWeight: 'bold',
                paddingLeft: 2,
                paddingRight: 2,
                color: '#000',

                fontSize: 20,
              }}
            >
              Users
            </Box>
          </Link>
          <Link href={'/admin/feedback'}>
            <Box
              sx={{
                fontWeight: 'bold',
                paddingLeft: 2,
                paddingRight: 2,
                color: '#000',
                fontSize: 20,
              }}
            >
              Feedback
            </Box>
          </Link>
          <Link href={'/admin/payments'}>
            <Box
              sx={{
                fontWeight: 'bold',
                paddingLeft: 2,
                paddingRight: 2,
                color: '#000',
                fontSize: 20,
                borderLeft: '2px solid #000',
              }}
            >
              Payments
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
                minWidth: '50rem',
              }}
            >
              <TableColumns />
            </Box>
            {data ? (
              data.map((element) => {
                return (
                  <div key={'MainelementContainerUsers'}>
                    <Box
                      key={'rowDividerWide_'}
                      sx={{
                        width: '100%',
                        background: '#000',
                        minWidth: '50rem',
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
                        <br />
                        {element.email}
                      </Box>

                      <Box
                        sx={{
                          borderRight: '2px solid #000',
                          minWidth: '10rem',
                          width: '100%',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          maxHeight: '80px',
                          overflowY: 'auto',
                          scrollbarWidth: 'none',
                        }}
                      >
                        {element.course_title}
                      </Box>
                      <Box
                        sx={{
                          minWidth: '2rem',
                          width: '100%',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          borderRight: '2px solid #000',
                        }}
                      >
                        {element.price}$
                      </Box>
                      <Box
                        sx={{
                          minWidth: '10rem',
                          width: '100%',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          borderRight: '2px solid #000',
                        }}
                      >
                        {element.order_status}
                      </Box>
                      <Box
                        sx={{
                          minWidth: '10rem',
                          width: '100%',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          borderRight: '2px solid #000',
                        }}
                      >
                        {element.order_time}
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
                        {element.order_id}
                      </Box>
                    </Box>
                  </div>
                )
              })
            ) : (
              <div>
                <LinearProgress
                  sx={{
                    minWidth: '50rem',
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

export default Index
