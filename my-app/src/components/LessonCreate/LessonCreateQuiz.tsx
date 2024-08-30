import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useRef, useState } from 'react'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import Swal from 'sweetalert2'
import { Box, Button, TextField, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { getLocale } from '@/utils/getLocale'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import DeleteIcon from '@mui/icons-material/Delete'

const textFieldColors = {
  // '& label.Mui-focused': {
  //   color: '#ffec3e',
  // },
  // '& .MuiOutlinedInput-root': {
  //   '& fieldset': { borderColor: '#ffec3e' },
  //   '&:hover fieldset': {
  //     borderColor: '#ffec3e',
  //   },
  //   '&.Mui-focused fieldset': {
  //     borderColor: '#ffec3e',
  //   },
  // },
  // color: '#c7c6c6',
  // input: {
  //   color: '#c7c6c6',
  //   borderColor: '#c7c6c6',
  // },
}
const url = `${process.env.NEXT_BACK_HOST_API}/auth/login?`
const urlReset = `${process.env.NEXT_BACK_HOST_API}/auth/request-reset-password?`
const urlReset2 = `${process.env.NEXT_BACK_HOST_API}/auth/reset-password?`
const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`

interface quizCreation {
  setValue: any
  idLessonEdit: any
  setIdLessonEdit: any
  createLessonIndx: any
  setCreateLessonIndx: any
  modules: any
  setModules: any
  setEditTrigger: any
  setError: any
  storedModules: any
  startData?: any
}
const LessonCreateQuiz = ({
  setValue,
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
}: quizCreation) => {
  const [lessonForm, setLessonForm] = useState({
    title: startData ? startData.title : '',
    hours: startData ? startData.hours : 0,
    minutes: startData ? startData.minutes : 0,
  })
  const [questionModules, setQuestionModules] = useState<any>(
    startData && startData.questions ? startData.questions : []
  )

  function compareIsLessonEdited(lessonId: string, moduleI: number) {
    const lessonToCompare = modules[moduleI].lessons.filter(
      (less: any) => (less.id ?? -1) == lessonId
    )
    return (
      lessonToCompare[0].title === lessonForm.title &&
      lessonToCompare[0].questions.length === questionModules.length
    )
  }

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)
  function handleSort(lessonsGet: any, i: number) {
    const lessonClone = [...lessonsGet]
    let draggedIdx = -1
    const temp = lessonClone.filter((less, i) => {
      if (less.title == dragLesson.current) {
        draggedIdx = i
        return less
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
    setQuestionModules(
      questionModules.map((module: any, moduleIndex: any) => {
        if (moduleIndex == i) {
          return {
            title: module.title,
            options: lessonClone.filter(
              (less, i) =>
                less.title != dragLesson.current ||
                i ==
                  (draggedOverLesson.current > draggedIdx
                    ? draggedOverLesson.current + 1
                    : draggedOverLesson.current)
            ),
          }
        }
        return module
      })
    )
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
          sx={{ ...textFieldColors }}
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
          sx={{ ...textFieldColors }}
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
          sx={{ ...textFieldColors }}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {questionModules.map((element: any, i: any) => {
            return (
              <Box key={'mainModuleContainer_' + i} sx={{ boxShadow: 2, border: '1px solid' }}>
                <Accordion defaultExpanded={true} sx={{}}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{}}>
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        gap: '10px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <TextField
                        autoComplete='off'
                        margin='normal'
                        required
                        fullWidth
                        id={'module' + i}
                        type='text'
                        label={'Question ' + (i + 1) + ' text'}
                        name={'question' + i}
                        autoFocus
                        onChange={(e) => {
                          setEditTrigger(true)
                          setError({})
                          setQuestionModules(
                            questionModules.map((module: any, moduleIndex: any) => {
                              if (i == moduleIndex) {
                                return { ...module, title: e.target.value }
                              } else {
                                return module
                              }
                            })
                          )
                        }}
                        value={element.title}
                        sx={{ ...textFieldColors, marginRight: 10 }}
                      />
                      <IconButton
                        color='error'
                        sx={{
                          marginTop: 3,
                          width: '40px',
                          height: '40px',
                          marginRight: 4,
                        }}
                        onClick={(e) => {
                          setEditTrigger(true)
                          setError({})
                          setQuestionModules(
                            questionModules.filter((moduleElem: any, index: number) => {
                              if (i !== index) {
                                return moduleElem
                              }
                            })
                          )
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
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
                        {element.options.map((option: any, index: any) => {
                          return (
                            <div
                              key={'mainModuleContainer_' + i}
                              style={{
                                color: '#0f0e16',
                                width: '100%',
                                background: '#cccccc',
                                marginTop: '16px',
                                padding: '16px',
                                boxShadow:
                                  '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
                              }}
                              draggable
                              onDragStart={() => (dragLesson.current = option.title)}
                              onDragEnter={() => (draggedOverLesson.current = index)}
                              onDragEnd={(e) => handleSort(element.options, i)}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <DragIndicatorIcon />
                                <Checkbox
                                  onChange={(e) => {
                                    setEditTrigger(true)
                                    setError({})
                                    setQuestionModules(
                                      questionModules.map(
                                        (question: any, indexQuestion: number) => {
                                          if (indexQuestion == i) {
                                            return {
                                              ...element,
                                              options: question.options.map(
                                                (opt: any, optInx: number) => {
                                                  if (optInx == index) {
                                                    return { ...opt, correct: e.target.checked }
                                                  } else {
                                                    return opt
                                                  }
                                                }
                                              ),
                                            }
                                          } else {
                                            return question
                                          }
                                        }
                                      )
                                    )
                                  }}
                                  checked={option.correct}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                  sx={{
                                    color: 'inherit',
                                    '&.Mui-checked': {
                                      color: 'inherit',
                                    },
                                  }}
                                />
                                <TextField
                                  autoComplete='off'
                                  margin='normal'
                                  required
                                  fullWidth
                                  id={'option' + i + ' ' + index}
                                  type='text'
                                  label={'Option ' + (index + 1) + ' text'}
                                  name={'option' + i + ' ' + index}
                                  autoFocus
                                  onChange={(e) => {
                                    setEditTrigger(true)
                                    setError({})
                                    setQuestionModules(
                                      questionModules.map(
                                        (question: any, indexQuestion: number) => {
                                          if (indexQuestion == i) {
                                            return {
                                              ...element,
                                              options: question.options.map(
                                                (opt: any, optInx: number) => {
                                                  if (optInx == index) {
                                                    return { ...opt, title: e.target.value }
                                                  } else {
                                                    return opt
                                                  }
                                                }
                                              ),
                                            }
                                          } else {
                                            return question
                                          }
                                        }
                                      )
                                    )
                                  }}
                                  value={option.title}
                                  sx={{ ...textFieldColors, marginRight: 10 }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                <IconButton
                                  onClick={async (e) => {
                                    setEditTrigger(true)
                                    setError({})
                                    setQuestionModules(
                                      questionModules.map(
                                        (question: any, indexQuestion: number) => {
                                          if (indexQuestion == i) {
                                            return {
                                              ...element,
                                              options: question.options.filter(
                                                (opt: any, optInx: number) => {
                                                  if (optInx == index) {
                                                    return
                                                  } else {
                                                    return opt
                                                  }
                                                }
                                              ),
                                            }
                                          } else {
                                            return question
                                          }
                                        }
                                      )
                                    )
                                  }}
                                >
                                  <DeleteIcon color='error' />
                                </IconButton>
                              </Box>
                            </div>
                          )
                        })}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 4 }}>
                      <Button
                        variant='contained'
                        onClick={() => {
                          setQuestionModules(
                            questionModules.map((question: any, index: number) => {
                              if (index == i) {
                                return {
                                  ...element,
                                  options: [...element.options, { title: '', correct: false }],
                                }
                              } else {
                                return question
                              }
                            })
                          )
                        }}
                      >
                        Add option
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )
          })}
        </Box>
        <Button
          variant='contained'
          onClick={(e) => {
            setQuestionModules([...questionModules, { title: '', options: [] }])
          }}
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
            borderRadius: '0px',
          }}
        >
          Add Question
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
            if (idLessonEdit && compareIsLessonEdited(idLessonEdit, createLessonIndx)) {
              setValue(1)
              return
            }
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
                if (!found) {
                  const response = await axios.put(urlLesson + '?id=' + idLessonEdit, {
                    title: lessonForm.title,
                    questions: questionModules,
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
                                questions: questionModules,
                                type: 'quiz',
                              }
                            }),
                          }
                        }
                        return elem
                      })
                    )
                    setLessonForm({
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
                storedModules.map((less: any) => {
                  if (less.title == lessonForm.title.trim()) found = true
                })
                modules.map((module: any) => {
                  module.lessons.map((less: any) => {
                    if (less.title == lessonForm.title.trim()) found = true
                  })
                })
                if (!found) {
                  const response = await axios.post(urlLesson + '?type=quiz', {
                    title: lessonForm.title,
                    questions: questionModules,
                    hours: lessonForm.hours,
                    minutes: lessonForm.minutes,
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
                                questions: questionModules,
                                type: 'quiz',
                              },
                            ],
                          }
                        }
                        return modulesElem
                      })
                    )
                    setLessonForm({
                      title: '',
                      hours: 0,
                      minutes: 0,
                    })
                  }
                  setCreateLessonIndx(-1)
                  setValue(1)
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
          {idLessonEdit
            ? compareIsLessonEdited(idLessonEdit, createLessonIndx)
              ? 'Cancel'
              : 'Save'
            : 'Create'}
        </Button>
      </Box>
    </Box>
  )
}

export default LessonCreateQuiz
