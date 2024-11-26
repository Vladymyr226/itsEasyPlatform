import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Box, Button, TextField, IconButton } from '@mui/material'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'
import MyEditor from '@/components/SlateEditor/Editor'

const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`

interface practiceCreation {
  setValue: any
  idLessonEdit: any
  setIdLessonEdit: any
  moduleIndexCreate: any
  setModuleIndexCreate: any
  modules: any
  setModules: any
  setEditTrigger: any
  setError: any
  storedLessons: any
  lessonForm?: any
}
const LessonCreatePractice = ({
  setValue,
  idLessonEdit,
  setIdLessonEdit,
  moduleIndexCreate,
  setModuleIndexCreate,
  modules,
  setModules,
  setEditTrigger,
  setError,
  storedLessons,
  lessonForm,
}: practiceCreation) => {
  const [lessonFormCurrent, setLessonFormCurrent] = useState({
    title: lessonForm ? lessonForm.title : '',
    hours: lessonForm ? lessonForm.hours : 0,
    minutes: lessonForm ? lessonForm.minutes : 0,
  })
  const [taskModules, setTaskModules] = useState<any>(
    lessonForm && lessonForm.fields ? lessonForm.fields : []
  )
  const [displayDrag, setDisplayDrag] = useState<any>(true)

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)
  function handleSort() {
    const taskClone = [...taskModules]
    let draggedIdx = -1
    const temp = taskClone.filter((module, i) => {
      if (module.tmpId == dragLesson.current) {
        draggedIdx = i
        return module
      }
    })[0]
    taskClone.splice(
      draggedOverLesson.current > draggedIdx
        ? draggedOverLesson.current + 1
        : draggedOverLesson.current,
      0,
      temp
    )
    setEditTrigger(true)
    setTaskModules(
      taskClone.filter(
        (less, i) =>
          less.tmpId != dragLesson.current ||
          i ==
            (draggedOverLesson.current > draggedIdx
              ? draggedOverLesson.current + 1
              : draggedOverLesson.current)
      )
    )
  }
  useEffect(() => {
    if (lessonForm && lessonForm.fields) {
      setTaskModules(
        lessonForm.fields.map((module: any, i: number) => {
          return { ...module, tmpId: new Date().getTime() + i }
        })
      )
    }
  }, [lessonForm])
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
            setLessonFormCurrent({ ...lessonFormCurrent, hours: e.target.value })
          }}
          value={lessonFormCurrent.hours}
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
            setLessonFormCurrent({ ...lessonFormCurrent, minutes: e.target.value })
          }}
          value={lessonFormCurrent.minutes}
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
            setLessonFormCurrent({ ...lessonFormCurrent, title: e.target.value })
          }}
          value={lessonFormCurrent.title}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {taskModules.map((element: any, i: any) => {
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
                          setTaskModules(
                            taskModules.filter((moduleElem: any, index: number) => {
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
                                  setTaskModules(
                                    taskModules.map((module: any, index: number) => {
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
                                setTaskModules(
                                  taskModules.map((module: any, index: number) => {
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
                                setTaskModules(
                                  taskModules.map((module: any, index: number) => {
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
            setTaskModules([
              ...taskModules,
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
            setTaskModules([
              ...taskModules,
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
            setTaskModules([
              ...taskModules,
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
            setValue(1)
          }}
        >
          Ruturn
        </Button>
        <Button
          variant='contained'
          fullWidth
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
          }}
          onClick={async (e) => {
            if (lessonFormCurrent.title == '') {
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
                storedLessons.map((less: any) => {
                  if (less.title == lessonFormCurrent.title.trim()) found = true
                })
                modules.map((module: any) => {
                  module.lessons.map((less: any) => {
                    if (less.title == lessonFormCurrent.title.trim() && idLessonEdit != less.id)
                      found = true
                  })
                })
                if (!found) {
                  const response = await axios.put(urlLesson + '?id=' + idLessonEdit, {
                    title: lessonFormCurrent.title,
                    fields: taskModules,
                    hours: lessonFormCurrent.hours,
                    minutes: lessonFormCurrent.minutes,
                  })
                  const resultResponse = response.data
                  if (resultResponse) {
                    setModules(
                      modules.map((elem: any, index: any) => {
                        if (moduleIndexCreate === index) {
                          return {
                            title: elem.title,
                            lessons: elem.lessons.map((lessonFilter: any, lessonIndex: any) => {
                              if (lessonFilter.id !== idLessonEdit) {
                                return lessonFilter
                              }
                              return {
                                ...lessonFormCurrent,
                                id: idLessonEdit,
                                title: lessonFormCurrent.title,
                                fields: taskModules.map((module: any) => {
                                  return { type: module.type, value: module.value }
                                }),
                                type: 'practice',
                              }
                            }),
                          }
                        }
                        return elem
                      })
                    )
                    setLessonFormCurrent({
                      title: '',
                      hours: 0,
                      minutes: 0,
                    })
                    setIdLessonEdit(null)
                    setValue(1)
                  }
                } else {
                  Swal.fire({
                    title: 'Course name is already taken!',
                    background: '#171622',
                    color: '#ffec3e',
                    confirmButtonColor: '#c58efe',
                    icon: 'error',
                  })
                }
              } else {
                let found = false
                storedLessons.map((less: any) => {
                  if (less.title == lessonFormCurrent.title.trim()) found = true
                })
                modules.map((module: any) => {
                  module.lessons.map((less: any) => {
                    if (less.title == lessonFormCurrent.title.trim()) found = true
                  })
                })
                if (!found) {
                  const response = await axios.post(urlLesson + '?type=practice', {
                    title: lessonFormCurrent.title,
                    hours: lessonFormCurrent.hours,
                    minutes: lessonFormCurrent.minutes,
                    fields: taskModules.map((module: any) => {
                      return { type: module.type, value: module.value }
                    }),
                  })
                  const resultResponse = response.data
                  if (resultResponse) {
                    setModules(
                      modules.map((modulesElem: any, index: any) => {
                        if (
                          index == moduleIndexCreate &&
                          modulesElem.lessons.filter(
                            (reDropElem: any) => reDropElem.id === resultResponse.lessonId
                          ).length === 0
                        ) {
                          return {
                            title: modulesElem.title,
                            lessons: [
                              ...modulesElem.lessons,
                              {
                                ...lessonFormCurrent,
                                id: resultResponse.lessonId,
                                title: lessonFormCurrent.title,
                                fields: taskModules.map((module: any) => {
                                  return { type: module.type, value: module.value }
                                }),
                                type: 'practice',
                              },
                            ],
                          }
                        }
                        return modulesElem
                      })
                    )
                    setLessonFormCurrent({
                      title: '',
                      hours: 0,
                      minutes: 0,
                    })
                    setModuleIndexCreate(-1)
                    setValue(1)
                  }
                } else {
                  Swal.fire({
                    title: 'Course name is already taken!',
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
          }}
        >
          {idLessonEdit ? 'Save' : 'Create'}
        </Button>
      </Box>
    </Box>
  )
}

export default LessonCreatePractice
