'use client'

import courseImage from '../../src/assets/courseImage.png'
import skillsImage from '../../src/assets/skillsImage.png'
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
import '../../app/globals.css'
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
  background: '#ffec3e',
}
const tableElement = {
  minWidth: '10rem',
  width: '100%',
  textAlign: 'center',
  fontWeight: 'bold',
  background: '#ffec3e',
}

const TableColumns = () => {
  return (
    <>
      <Box sx={{ ...tableColumn }}>Name</Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Description
      </Box>
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
        Is for group
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Start date
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Duration
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Group price
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
        Lecturer
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
        Lessons number
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Practical tasks
      </Box>
      <Box
        sx={{
          ...tableColumn,
        }}
      >
        Total time
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
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  //  bg-dark shadow-lg p-5 rounded-lg border-t-4 border-yellow w-full max-w-[30rem]')
  //   dropModal
  return (
    <Layout>
      <Box sx={{ minHeight: '80vh' }}>
        <Box
          sx={{
            paddingLeft: '2rem',
            paddingRight: '2rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'end', marginBottom: 2 }}>
            <Link href={'./admin/create'}>
              <Button
                sx={{
                  background: '#ffec3e',
                  padding: 1,
                  borderRadius: '10px',
                  paddingLeft: 2,
                  paddingRight: 2,
                  fontWeight: 'bold',
                  color: '#0f0e16',
                  border: '2px solid #ffec3e',
                  '&:hover': {
                    backgroundColor: '#0f0e16',
                    border: '2px solid #ffec3e',
                    color: '#ffec3e',
                    boxShadow: 'none',
                  },
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

              border: '1px solid #ffec3e',
              borderTop: '4px solid #ffec3e',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                background: '#ffec3e',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                paddingTop: 1,
                paddingBottom: 1,
                width: '100%',
                minWidth: '140rem',
              }}
            >
              <TableColumns />
            </Box>
            {true ? (
              <>
                <div>
                  <Box
                    key={'rowDividerWide_'}
                    sx={{
                      width: '100%',
                      background: '#ffec3e',
                      minWidth: '140rem',
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
                      color: '#ffec3e',
                    }}
                  >
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{
                        borderRight: '2px solid #ffec3e',
                        minWidth: '10rem',
                        textAlign: 'center',
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      info
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-around', minWidth: '10rem' }}
                    >
                      <IconButton key={'editButton_'} aria-label='edit'>
                        <EditIcon key={'editIcon_'} color='primary' />
                      </IconButton>
                      <IconButton key={'deleteButton_'} aria-label='edit'>
                        <DeleteIcon key={'deleteIcon_'} color='primary' />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* <div
                            key={"rowContainerWide_" + i}
                            className="hidden md:flex py-2  w-full justify-between divide-x-2 divide-yellow"
                          >
                            <div
                              key={"rowNameValueWide_" + i}
                              className="min-w-[12rem]  w-full py-2 text-center overflow-auto px-1"
                            >
                              {worker.name}
                            </div>
                            <div
                              key={"rowCreatorValueWide_" + i}
                              className="min-w-[12rem]  w-full py-2 text-center overflow-auto px-1"
                            >
                              {worker.creator}
                            </div>
                            <div
                              key={"rowIsAvailableValueWide_" + i}
                              className="min-w-[12rem]  w-full py-2 text-center overflow-auto px-1"
                            >
                              {worker.isAvailable ? "true" : "false"}
                            </div>
                            <div
                              key={"rowPermissionsValueWide_" + i}
                              className="min-w-[24rem] w-full p-2 flex text-center overflow-auto px-1"
                            >
                              {worker.permissions
                                ? worker.permissions.map((perm: any) => {
                                    return (
                                      <Chip
                                        key={
                                          "workerPermissionWideChip_" +
                                          i +
                                          "_" +
                                          perm
                                        }
                                        variant="filled"
                                        color="primary"
                                        label={perm}
                                        sx={{ margin: "2px" }}
                                      />
                                    );
                                  })
                                : "-"}
                            </div>
                            <div
                              key={"rowLastLoginValueWide_" + i}
                              className="min-w-[12rem]  w-full py-2 text-center overflow-auto px-1"
                            >
                              {worker.lastLogin
                                ? new Date(worker.lastLogin).toLocaleString()
                                : "-"}
                            </div>

                            <div
                              key={"rowButtonsContainerWide_" + i}
                              className="min-w-24 flex justify-end"
                            >
                              <IconButton
                                key={"deleteButtonWide_" + i}
                                aria-label="delete"
                                onClick={async (e: any) => {
                                  e.preventDefault();
                                  try {
                                    const res = await fetch(
                                      process.env.NEXT_PUBLIC_API_HOST +
                                        `/Worker?id=${worker._id}`,
                                      {
                                        method: "DELETE",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                      }
                                    );
                                    if (res.ok) {
                                      setWorkers(
                                        workers.filter(
                                          (data: any) => data._id !== worker._id
                                        )
                                      );
                                    } else {
                                      console.log("Worker update failed.");
                                    }
                                  } catch (error) {
                                    console.log(
                                      "Error during data update: ",
                                      error
                                    );
                                  }
                                }}
                              >
                                <DeleteIcon
                                  key={"deleteIconWide_" + i}
                                  color="error"
                                />
                              </IconButton>
                              <IconButton
                                key={"editButtonWide_" + i}
                                aria-label="edit"
                                onClick={() => {
                                  router.push("/admin/Worker/" + worker._id);
                                }}
                              >
                                <EditIcon
                                  key={"editIconWide_" + i}
                                  color="primary"
                                />
                              </IconButton>
                            </div>
                          </div> */}
                </div>
              </>
            ) : (
              <div>
                <LinearProgress
                  sx={{
                    minWidth: '140rem',
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
    </Layout>
  )
}

export default AdminTable
