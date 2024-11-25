import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Box, Button, TextField, IconButton } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'
import MyEditor from '@/components/SlateEditor/Editor'
import YouTube, { YouTubeProps } from 'react-youtube'
import { DefaultLessonCreation, YouTubeProp } from '@/utils/interfaces'
import { uploadFileToS3 } from '@/utils'

function ExampleYouTube(props: YouTubeProp) {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }

  return <YouTube videoId={props.url} opts={opts} onReady={onPlayerReady} />
}
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`

const LessonCreateDefault = ({
  setTabValue,
  idLessonEdit,
  setIdLessonEdit,
  createLessonIndx,
  setCreateLessonIndx,
  modules,
  setModules,
  setEditTrigger,
  setError,
  storedModules,
  startData,
}: DefaultLessonCreation) => {
  const [lessonForm, setLessonForm] = useState({
    title: startData ? startData.title : '',
    image: startData ? startData.image : null,
    hours: startData ? startData.hours : 0,
    minutes: startData ? startData.minutes : 0,
  })
  const startLessonTitle = startData ? startData.title : null

  const [lessonModules, setLessonModules] = useState<any>(
    startData && startData.fields ? startData.fields : []
  )
  const [displayDrag, setDisplayDrag] = useState<any>(true)

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)

  useEffect(() => {
    if (startData && startData.fields) {
      setLessonModules(
        startData.fields.map((module: any, i: number) => {
          return { ...module, tmpId: new Date().getTime() + i }
        })
      )
    }
  }, [startData])

  function handleSort() {
    const lessonClone = [...lessonModules]
    let draggedIdx = -1
    const temp = lessonClone.filter((module, i) => {
      if (module.tmpId == dragLesson.current) {
        draggedIdx = i
        return module
      }
    })[0]
    lessonClone.splice(
      draggedOverLesson.current > draggedIdx
        ? draggedOverLesson.current + 1
        : draggedOverLesson.current,
      0,
      temp
    )
    setEditTrigger(true)
    setLessonModules(
      lessonClone.filter(
        (less, i) =>
          less.tmpId != dragLesson.current ||
          i ==
            (draggedOverLesson.current > draggedIdx
              ? draggedOverLesson.current + 1
              : draggedOverLesson.current)
      )
    )
  }

  const handleSubmit = async (e: any) => {
    if (lessonForm.title == '') {
      Swal.fire({
        title: 'Lesson title can not be empty!',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
      return
    }

    try {
      setEditTrigger(true)
      setError({})
      if (idLessonEdit) {
        let found = false
        storedModules.map((less: any) => {
          if (less.title == lessonForm.title.trim()) found = true
        })

        modules.map((module: any) => {
          module.lessons.map((less: any) => {
            if (less.title == lessonForm.title.trim() && idLessonEdit != less.id)
              found = true
          })
        })

        if (!found || (startData && startLessonTitle == lessonForm.title)) {
          const response = await axios.put(urlLesson + '?id=' + idLessonEdit, {
            title: lessonForm.title,
            fields: lessonModules,
            image: lessonForm.image,
            hours: lessonForm.hours,
            minutes: lessonForm.minutes,
          })
          const resultResponse = response.data
          if (resultResponse) {
            setModules(
              modules.map((elem: any, index: any) => {
                if (createLessonIndx === index) {
                  return {
                    title: elem.title,
                    lessons: elem.lessons.map((lessonFilter: any, lessonIndex: any) => {
                      if (lessonFilter.id !== idLessonEdit) {
                        return lessonFilter
                      }
                      return {
                        ...lessonForm,
                        id: idLessonEdit,
                        title: lessonForm.title,
                        fields: lessonModules.map((module: any) => {
                          return { type: module.type, value: module.value }
                        }),
                        type: 'default',
                      }
                    }),
                    image: elem.image,
                  }
                }
                return elem
              })
            )
            setLessonForm({
              title: '',
              image: null,
              hours: 0,
              minutes: 0,
            })
            setIdLessonEdit(null)
            setTabValue(1)
          }

        } else {
          Swal.fire({
            title: 'Lesson name is already taken!',
            background: '#171622',
            color: '#ffec3e',
            confirmButtonColor: '#c58efe',
            icon: 'error',
          })
        }

      } else {
        let found = false
        storedModules.map((less: any) => {
          if (less.title == lessonForm.title.trim()) found = true
        })

        modules.map((module: any) => {
          module.lessons.map((less: any) => {
            if (less.title == lessonForm.title.trim()) found = true
          })
        })

        if (!found) {
          const response = await axios.post(urlLesson + '?type=default', {
            title: lessonForm.title,
            image: lessonForm.image,
            hours: lessonForm.hours,
            minutes: lessonForm.minutes,
            fields: lessonModules.map((module: any) => {
              return { type: module.type, value: module.value }
            }),
          })

          const resultResponse = response.data
          if (resultResponse) {
            setModules(
              modules.map((modulesElem: any, index: any) => {
                if (
                  index == createLessonIndx &&
                  modulesElem.lessons.filter(
                    (reDropElem: any) => reDropElem.id === resultResponse.lessonId
                  ).length === 0
                ) {
                  return {
                    title: modulesElem.title,
                    lessons: [
                      ...modulesElem.lessons,
                      {
                        ...lessonForm,
                        id: resultResponse.lessonId,
                        title: lessonForm.title,
                        fields: lessonModules.map((module: any) => {
                          return { type: module.type, value: module.value }
                        }),
                        image: lessonForm.image,
                        type: 'default',
                      },
                    ],
                  }
                }
                return modulesElem
              })
            )

            setLessonForm({
              title: '',
              image: null,
              hours: 0,
              minutes: 0,
            })
            setCreateLessonIndx(-1)
            setTabValue(1)
          }
        } else {
          Swal.fire({
            title: 'Lesson name is already taken!',
            background: '#171622',
            color: '#ffec3e',
            confirmButtonColor: '#c58efe',
            icon: 'error',
          })
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Something went wrong!',
        text: error + '',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
      return
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='hours'
          type='number'
          label='Hours'
          name='hours'
          autoFocus
          autoComplete='off'
          onChange={(e) => {
            setLessonForm({ ...lessonForm, hours: e.target.value })
          }}
          value={lessonForm.hours}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='minutes'
          type='number'
          label='Minutes'
          name='minutes'
          autoFocus
          autoComplete='off'
          onChange={(e) => {
            setLessonForm({ ...lessonForm, minutes: e.target.value })
          }}
          value={lessonForm.minutes}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='lessonTitle'
          type='title'
          label='Title'
          name='title'
          autoFocus
          autoComplete='off'
          onChange={(e) => {
            setLessonForm({ ...lessonForm, title: e.target.value })
          }}
          value={lessonForm.title}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {lessonModules.map((element: any, i: any) => {
            return (
              <Box key={'mainModuleContainer_' + i} sx={{ boxShadow: 2, border: '1px solid' }}>
                <Accordion
                  defaultExpanded={true}
                  sx={{}}
                  draggable
                  onDragStart={() => ((dragLesson.current = element.tmpId), setDisplayDrag(false))}
                  onDragEnter={() => (draggedOverLesson.current = i)}
                  onDragEnd={(e) => {
                    handleSort()
                    setDisplayDrag(true)
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <DragIndicatorIcon sx={{ marginTop: 1, color: '#808080' }} />
                      <IconButton
                        color='error'
                        sx={{
                          width: '40px',
                          height: '40px',
                          marginRight: 4,
                        }}
                        onClick={(e) => {
                          setEditTrigger(true)
                          setError({})
                          setLessonModules(
                            lessonModules.filter((moduleElem: any, index: number) => {
                              if (i !== index) {
                                return moduleElem
                              }
                            })
                          )
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails
                    style={{
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      borderTop: '2px solid',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        {element.type == 'slate' && displayDrag && (
                          <Box>
                            <Box sx={{ color: '#000000' }}>
                              <MyEditor
                                value={element.value}
                                setValue={function (data: any) {
                                  setLessonModules(
                                    lessonModules.map((module: any, index: number) => {
                                      if (index == i) {
                                        return { ...module, value: data }
                                      } else {
                                        return module
                                      }
                                    })
                                  )
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                        {element.type == 'code' && displayDrag && (
                          <Box>
                            <TextField
                              margin='normal'
                              required
                              fullWidth
                              id='lessonTitle'
                              type='title'
                              label='Url'
                              name='title'
                              autoFocus
                              autoComplete='off'
                              onChange={(e) => {
                                setLessonModules(
                                  lessonModules.map((module: any, index: number) => {
                                    if (index == i) {
                                      return { ...module, value: e.target.value }
                                    } else {
                                      return module
                                    }
                                  })
                                )
                              }}
                              value={element.value}
                            />
                          </Box>
                        )}

                        {element.type == 'codeHtml' && displayDrag && (
                          <Box>
                            <TextField
                              margin='normal'
                              required
                              fullWidth
                              id='htmlTitle'
                              label='HTML'
                              multiline
                              name='title'
                              autoFocus
                              autoComplete='off'
                              onChange={(e) => {
                                setLessonModules(
                                  lessonModules.map((module: any, index: number) => {
                                    if (index == i) {
                                      return { ...module, value: e.target.value }
                                    } else {
                                      return module
                                    }
                                  })
                                )
                              }}
                              value={element.value}
                            />
                          </Box>
                        )}

                        {element.type == 'youTube' && displayDrag && (
                          <Box>
                            <Box sx={{ width: '100%', marginTop: 2 }}>
                              <ExampleYouTube url={element.value.split('?v=')[1]} />
                            </Box>
                            <TextField
                              margin='normal'
                              required
                              fullWidth
                              id='youTube'
                              label='url'
                              multiline
                              name='title'
                              autoFocus
                              autoComplete='off'
                              onChange={(e) => {
                                setLessonModules(
                                  lessonModules.map((module: any, index: number) => {
                                    if (index == i) {
                                      return { ...module, value: e.target.value }
                                    } else {
                                      return module
                                    }
                                  })
                                )
                              }}
                              value={element.value}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 4 }}></Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )
          })}
        </Box>
        <Button
          variant='contained'
          onClick={(e) => {
            setLessonModules([
              ...lessonModules,
              {
                tmpId: new Date().getTime(),
                type: 'slate',
                value: [
                  {
                    type: 'paragaph',
                    children: [{ text: '' }],
                  },
                ],
              },
            ])
          }}
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add richtext
        </Button>
        <Button
          variant='contained'
          onClick={(e) => {
            setLessonModules([
              ...lessonModules,
              {
                tmpId: new Date().getTime(),
                type: 'code',
                value: [],
              },
            ])
          }}
          sx={{
            marginLeft: 2,
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add Code (Link)
        </Button>
        <Button
          variant='contained'
          onClick={(e) => {
            setLessonModules([
              ...lessonModules,
              {
                tmpId: new Date().getTime(),
                type: 'codeHtml',
                value: [],
              },
            ])
          }}
          sx={{
            marginLeft: 2,
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add Code (HTML)
        </Button>
        <Button
          variant='contained'
          onClick={(e) => {
            setLessonModules([
              ...lessonModules,
              {
                tmpId: new Date().getTime(),
                type: 'youTube',
                value: '',
              },
            ])
          }}
          sx={{
            marginLeft: 2,
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add YouTube (Link)
        </Button>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Button
          variant='contained'
          component='label'
          onClick={() => {
            setLessonForm({ ...lessonForm, image: '' })
          }}
          sx={{ mt: 1, mr: 1 }}
        >
          Remove
        </Button>

        <Button fullWidth variant='contained' component='label' sx={{ mt: 1 }}>
          <input
            type='file'
            accept='image/png, image/jpeg'
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.files) {
                try {
                  setLessonForm({
                    ...lessonForm,
                    image: ((await uploadFileToS3(event.target.files[0])) as string) ?? '',
                  })
                } catch (error) {
                  Swal.fire({
                    title: 'Some error has occurred!',
                    text: '' + error,
                    background: '#171622',
                    color: '#ffec3e',
                    confirmButtonColor: '#c58efe',
                    icon: 'error',
                  })
                }
              }
            }}
          />
        </Button>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Button
          variant='contained'
          sx={{
            marginTop: 2,
            marginRight: 2,
            fontWeight: 'bold',
          }}
          onClick={async (e) => {
            setTabValue(1)
          }}
        >
          Return
        </Button>
        <Button
          variant='contained'
          fullWidth
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
          }}
          onClick={handleSubmit}
        >
          {idLessonEdit ? 'Save' : 'Create'}
        </Button>
      </Box>
    </Box>
  )
}

export default LessonCreateDefault
