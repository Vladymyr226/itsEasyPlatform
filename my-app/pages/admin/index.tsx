'use client'
import { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Link from 'next/link'
import axios from 'axios'
import Swal from 'sweetalert2'
import { deleteCookie } from 'cookies-next'
import '../../app/globals.css'

const tableColumn = {
  minWidth: '10rem',
  width: '100%',
  textAlign: 'center',
  fontWeight: 'bold',
  background: '#cccccc',
}

const url = `${process.env.NEXT_BACK_HOST_API}/cabinet/course`

const TableColumns = () => {
  return (
    <>
      <Box sx={{ ...tableColumn }}>Title</Box>

      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Language
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Level
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Type
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Price
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Control buttons
      </Box>
    </>
  )
}
const AdminTable = () => {
  const [data, setData] = useState<Array<any>>()
  async function getPageData() {
    if (typeof window !== 'undefined') {
      const response = await fetch(url + 's', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      setData(result.getCourses)
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      getPageData()
    }
  }, [])

  // sweetalert
  function showDeleteAlert(id: number) {
    Swal.fire({
      title: 'Do you want to delete the course?',

      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d8342c',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(url + '?id=' + id)
        const resultResponse = response.data
        if (resultResponse) {
          setData(data?.filter((course) => course.id != id))
          Swal.fire('Deleted!', '', 'success')
        }
      }
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#fff', paddingBottom: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'end', padding: 4 }}>
        <Link href={'/admin'}>
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
          marginTop: 8,
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
                borderLeft: '2px solid #000',
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
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'end', marginBottom: 2 }}>
            <Link href={'./admin/create'}>
              <Button
                variant='contained'
                sx={{
                  padding: 1,
                  borderRadius: '10px',
                  paddingLeft: 2,
                  paddingRight: 2,
                  fontWeight: 'bold',
                }}
              >
                Add
              </Button>
            </Link>
          </Box>
          <Box
            sx={{
              width: '100%',

              boxShadow: 2,
              borderRadius: '10px',

              border: '1px solid #000',
              borderTop: '4px solid #000',
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
                minWidth: '60rem',
              }}
            >
              <TableColumns />
            </Box>
            {data ? (
              data.map((element) => {
                return (
                  <div key={'MainelementContainer_' + element.id}>
                    <Box
                      key={'rowDividerWide_'}
                      sx={{
                        width: '100%',
                        background: '#000',
                        minWidth: '60rem',
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
                        color: '#000',
                      }}
                    >
                      <Box
                        sx={{
                          borderRight: '2px solid #000',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {element.data.title}
                      </Box>

                      <Box
                        sx={{
                          borderRight: '2px solid #000',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {element.data.language}
                      </Box>
                      <Box
                        sx={{
                          borderRight: '2px solid #000',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {element.data.level}
                      </Box>
                      <Box
                        sx={{
                          borderRight: '2px solid #000',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {element.data.type}
                      </Box>
                      <Box
                        sx={{
                          borderRight: '2px solid #000',
                          minWidth: '10rem',
                          textAlign: 'center',
                          paddingTop: 1,
                          paddingBottom: 1,
                          width: '100%',
                        }}
                      >
                        {element.data.price}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          minWidth: '10rem',
                          width: '100%',
                        }}
                      >
                        <Link href={'./admin/create?_id=' + element.id}>
                          <IconButton key={'editButton_'} aria-label='edit'>
                            <EditIcon key={'editIcon_'} color='primary' />
                          </IconButton>
                        </Link>
                        <IconButton
                          key={'deleteButton_'}
                          aria-label='delete'
                          onClick={(e) => showDeleteAlert(element.id)}
                        >
                          <DeleteIcon key={'deleteIcon_'} color='primary' />
                        </IconButton>
                      </Box>
                    </Box>
                  </div>
                )
              })
            ) : (
              <div>
                <LinearProgress
                  sx={{
                    minWidth: '60rem',
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
