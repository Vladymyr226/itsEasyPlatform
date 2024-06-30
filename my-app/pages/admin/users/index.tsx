'use client'

import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import Link from 'next/link'
import { deleteCookie } from 'cookies-next'
import '../../../app/globals.css'

const tableColumn = {
  minWidth: '10rem',
  width: '100%',
  textAlign: 'center',
  fontWeight: 'bold',
  background: '#cccccc',
}
const url = `${process.env.NEXT_BACK_HOST_API}/auth/users`

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
      getPageData()
    }
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', background: '#fff', paddingTop: 8, paddingBottom: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'end', padding: 4 }}>
        <Link href={'/admin/login'}>
          <Button
            variant='contained'
            color='error'
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
                  <div key={'MainelementContainerUsers'}>
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
