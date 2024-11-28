import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { initialLesson } from '.'
import { Lesson, LessonQuestion, LessonQuestionOption, Module } from '@/utils/interfaces'

import {
  Box,
  Button,
  TextField,
  IconButton,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
} from '@mui/material'

import {
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`

const LessonCreateQuiz = ({
  storedLessons,
  lessonForm, setLessonForm,
  lessonFormCurrent, setLessonFormCurrent,
  idLessonEdit, setIdLessonEdit,
  moduleIndexCreate, setModuleIndexCreate,
  modules, setModules,
  lessonQuestions, setLessonQuestions,
  setTabValue,
  setEditTrigger,
  setError,
}: {
  storedLessons: Lesson[]

  lessonForm: Lesson
  setLessonForm: React.Dispatch<React.SetStateAction<Lesson>>
  lessonFormCurrent: Lesson
  setLessonFormCurrent: React.Dispatch<React.SetStateAction<Lesson>>
  idLessonEdit: string | null
  setIdLessonEdit: React.Dispatch<React.SetStateAction<string | null>>
  moduleIndexCreate: number
  setModuleIndexCreate: React.Dispatch<React.SetStateAction<number>>
  modules: Module[]
  setModules: React.Dispatch<React.SetStateAction<Module[]>>
  lessonQuestions: LessonQuestion[]
  setLessonQuestions: React.Dispatch<React.SetStateAction<LessonQuestion[]>>

  setTabValue: React.Dispatch<React.SetStateAction<number>>
  setEditTrigger: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<any>
}) => {

  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)

  useEffect(() => {
    setLessonFormCurrent(lessonForm)
    setLessonQuestions(lessonForm.questions || [])
  }, [lessonForm, setLessonFormCurrent, setLessonQuestions])

  function compareIsLessonEdited(lessonId: string, moduleI: number) {
    const lessonToCompare = modules[moduleI].lessons.filter(
      (less: any) => (less.id ?? -1) == lessonId
    )
    let check = false
    if ((lessonToCompare[0].questions as LessonQuestion[]).length === lessonQuestions.length) {
      lessonQuestions.map((data: any, i: number) => {
        let checkOptions = false
        if (data.title !== (lessonToCompare[0].questions as LessonQuestion[])[i].title) {
          check = true
          return
        }
        data.options.map((dataOption: any, j: number) => {
          if ((lessonToCompare[0].questions as LessonQuestion[])[i].options[j]) {
            if (dataOption.correct !== (lessonToCompare[0].questions as LessonQuestion[])[i].options[j].correct) {
              checkOptions = true
              return
            }
            if (dataOption.title !== (lessonToCompare[0].questions as LessonQuestion[])[i].options[j].title) {
              checkOptions = true
              return
            }
          } else {
            checkOptions = true
          }
        })
        if (checkOptions) {
          check = true
          return
        }
      })
    } else {
      check = true
    }
    return (
      lessonToCompare[0].hours === lessonFormCurrent.hours &&
      lessonToCompare[0].minutes === lessonFormCurrent.minutes &&
      lessonToCompare[0].title === lessonFormCurrent.title &&
      !check
    )
  }

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
    setLessonQuestions(
      lessonQuestions.map((question: any, index: any) => {
        if (index == i) {
          return {
            title: question.title,
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
        return question
      })
    )
  }

  const handleSubmit = async (e: any) => {
    if (idLessonEdit && compareIsLessonEdited(idLessonEdit, moduleIndexCreate)) {
      setTabValue(1)
      return
    }

    if (lessonFormCurrent.title.trim() == '') {
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
        const found = storedLessons.some((l: Lesson) => l.title === lessonFormCurrent.title.trim()) ||
          modules.some((m: Module) =>
            m.lessons.some((l: Lesson) =>
              l.title.trim() === lessonFormCurrent.title.trim() && idLessonEdit !== l.id))

        if (!found) {
          const response = await axios.put(urlLesson + '?id=' + idLessonEdit, {
            title: lessonFormCurrent.title,
            hours: lessonFormCurrent.hours,
            minutes: lessonFormCurrent.minutes,
            questions: lessonQuestions,
          })
          const resultResponse = response.data
          if (resultResponse) {
            setModules(
              modules.map((m: Module, i: number) => {
                if (moduleIndexCreate === i) {
                  return {
                    title: m.title,
                    lessons: m.lessons.map((l: any,) => {
                      if (l.en_id === lessonFormCurrent.en_id) return {
                        ...lessonFormCurrent,
                        id: idLessonEdit,
                        questions: lessonQuestions,
                        type: 'quiz',
                      }
                      else return l
                    }),
                  }
                }
                return m
              })
            )

            setLessonForm(initialLesson)
            setLessonFormCurrent(initialLesson)
            setLessonQuestions([])
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
        const found = storedLessons.some((l: Lesson) => l.title === lessonFormCurrent.title.trim()) ||
          modules.some((m: Module) =>
            m.lessons.some((l: Lesson) =>
              l.title.trim() === lessonFormCurrent.title.trim()))

        if (!found) {
          let urlLessonFull = `${urlLesson}?type=quiz&language=${lessonFormCurrent.language}`
          if (lessonFormCurrent.en_id) urlLessonFull += `&en_id=${lessonFormCurrent.en_id}`

          const response = await axios.post(urlLessonFull, {
            title: lessonFormCurrent.title,
            hours: lessonFormCurrent.hours,
            minutes: lessonFormCurrent.minutes,
            questions: lessonQuestions,
          })

          const resultResponse = response.data
          if (resultResponse) {
            setModules(
              modules.map((module: any, index: any) => {
                if (
                  index == moduleIndexCreate &&
                  module.lessons.filter(
                    (reDropElem: any) => reDropElem.id === resultResponse.lessonId
                  ).length === 0
                ) {
                  return {
                    title: module.title,
                    lessons: [
                      ...module.lessons.filter((lesson: any) => lesson.id !== lessonFormCurrent.en_id),
                      {
                        ...lessonFormCurrent,
                        id: resultResponse.lessonId,
                        questions: lessonQuestions,
                        type: 'quiz',
                        en_id: lessonFormCurrent.en_id || resultResponse.lessonId,
                      },
                    ],
                  }
                } else return module
              })
            )

            setLessonFormCurrent(initialLesson)
            setLessonForm(initialLesson)
            setLessonQuestions([])
            setModuleIndexCreate(-1)
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
            setLessonFormCurrent({ ...lessonFormCurrent, hours: parseInt(e.target.value) })
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
            setLessonFormCurrent({ ...lessonFormCurrent, minutes: parseInt(e.target.value) })
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
          {lessonQuestions.map((question: LessonQuestion, qIndex: number) => {
            return (
              <Box key={'mainModuleContainer_' + qIndex} sx={{ boxShadow: 2, border: '1px solid' }}>
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
                        id={'module' + qIndex}
                        type='text'
                        label={'Question ' + (qIndex + 1) + ' text'}
                        name={'question' + qIndex}
                        autoFocus
                        onChange={(e) => {
                          setEditTrigger(true)
                          setError({})
                          setLessonQuestions(
                            lessonQuestions.map((q: LessonQuestion, i: number) => i === qIndex ? { ...q, title: e.target.value } : q)
                          )
                        }}
                        value={question.title}
                        sx={{ marginRight: 10 }}
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
                          setLessonQuestions(
                            lessonQuestions.filter((q: LessonQuestion, i: number) => i !== qIndex)
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
                        {question.options.map((option: LessonQuestionOption, oIndex: number) => {
                          return (
                            <div
                              key={'mainModuleContainer_' + qIndex}
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
                              onDragEnter={() => (draggedOverLesson.current = oIndex)}
                              onDragEnd={(e) => handleSort(question.options, qIndex)}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <DragIndicatorIcon />
                                <Checkbox
                                  onChange={(e) => {
                                    setEditTrigger(true)
                                    setError({})
                                    setLessonQuestions(
                                      lessonQuestions.map(
                                        (q: LessonQuestion, qi: number) => {
                                          if (qi == qIndex) {
                                            return {
                                              ...question,
                                              options: q.options.map((o: LessonQuestionOption, oi: number) =>
                                                oi === oIndex ? { ...o, correct: e.target.checked } : o),
                                            }
                                          } else {
                                            return q
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
                                  id={'option' + qIndex + ' ' + oIndex}
                                  type='text'
                                  label={'Option ' + (oIndex + 1) + ' text'}
                                  name={'option' + qIndex + ' ' + oIndex}
                                  autoFocus
                                  onChange={(e) => {
                                    setEditTrigger(true)
                                    setError({})
                                    setLessonQuestions(
                                      lessonQuestions.map(
                                        (q: LessonQuestion, qi: number) => {
                                          if (qi === qIndex) {
                                            return {
                                              ...question,
                                              options: q.options.map((o: LessonQuestionOption, oi: number) =>
                                                oi === oIndex ? { ...o, title: e.target.value } : o),
                                            }
                                          } else {
                                            return q
                                          }
                                        }
                                      )
                                    )
                                  }}
                                  value={option.title}
                                  sx={{ marginRight: 10 }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                <IconButton
                                  onClick={async (e) => {
                                    setEditTrigger(true)
                                    setError({})
                                    setLessonQuestions(
                                      lessonQuestions.map(
                                        (q: LessonQuestion, qi: number) => {
                                          if (qi === qIndex) {
                                            return {
                                              ...question,
                                              options: q.options.filter(
                                                (o: LessonQuestionOption, oi: number) => oi !== oIndex),
                                            }
                                          } else {
                                            return q
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
                          setLessonQuestions(
                            lessonQuestions.map((q: LessonQuestion, i: number) => {
                              if (i === qIndex) {
                                return {
                                  ...question,
                                  options: [...question.options, { title: '', correct: false }],
                                }
                              } else {
                                return q
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
            setLessonQuestions([...lessonQuestions, { title: '', options: [] }])
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
          onClick={async e => {
            setLessonForm(initialLesson)
            setLessonFormCurrent(initialLesson)
            setLessonQuestions([])
            setIdLessonEdit(null)
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
          {idLessonEdit
            ? compareIsLessonEdited(idLessonEdit, moduleIndexCreate)
              ? 'Cancel'
              : 'Save'
            : 'Create'}
        </Button>
      </Box>
    </Box>
  )
}

export default LessonCreateQuiz
