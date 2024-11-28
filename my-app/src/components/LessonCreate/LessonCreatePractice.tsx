import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import MyEditor from '@/components/SlateEditor/Editor'
import { initialRichText } from '../CourseCreate'
import { initialLesson } from '.'
import { Lesson, LessonField, Module } from '@/utils/interfaces'

import {
  Box,
  Button,
  TextField,
  IconButton,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material'

import {
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`

const LessonCreatePractice = ({
  storedLessons,
  lessonForm, setLessonForm,
  lessonFormCurrent, setLessonFormCurrent,
  idLessonEdit, setIdLessonEdit,
  moduleIndexCreate, setModuleIndexCreate,
  modules, setModules,
  lessonFields, setLessonFields,
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
  lessonFields: LessonField[]
  setLessonFields: React.Dispatch<React.SetStateAction<LessonField[]>>

  setTabValue: React.Dispatch<React.SetStateAction<number>>
  setEditTrigger: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<any>
}) => {

  const [displayDrag, setDisplayDrag] = useState<any>(true)
  const dragLesson = useRef<any>(0)
  const draggedOverLesson = useRef<any>(0)

  useEffect(() => {
    setLessonFormCurrent(lessonForm)
    setLessonFields(lessonForm.fields || [])
  }, [lessonForm, setLessonFields, setLessonFormCurrent])

  function handleSort() {
    const lessonFieldsClone = [...lessonFields]
    let draggedIdx = -1
    const temp = lessonFieldsClone.filter((module, i) => {
      if (module.tmpId == dragLesson.current) {
        draggedIdx = i
        return module
      }
    })[0]
    lessonFieldsClone.splice(
      draggedOverLesson.current > draggedIdx
        ? draggedOverLesson.current + 1
        : draggedOverLesson.current,
      0,
      temp
    )
    setEditTrigger(true)
    setLessonFields(
      lessonFieldsClone.filter(
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
            fields: lessonFields,
          })
          const resultResponse = response.data
          if (resultResponse) {
            setModules(
              modules.map((m: Module, i: number) => {
                if (moduleIndexCreate === i) {
                  return {
                    title: m.title,
                    lessons: m.lessons.map((l: any) => {
                      if (l.en_id === lessonFormCurrent.en_id) {
                        return {
                          ...lessonFormCurrent,
                          id: idLessonEdit,
                          fields: lessonFields.map((f: LessonField) => ({ type: f.type, value: f.value })),
                          type: 'practice',
                        }
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
            setLessonFields([])
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
          let urlLessonFull = `${urlLesson}?type=practice&language=${lessonFormCurrent.language}`
          if (lessonFormCurrent.en_id) urlLessonFull += `&en_id=${lessonFormCurrent.en_id}`

          const response = await axios.post(urlLessonFull, {
            title: lessonFormCurrent.title,
            hours: lessonFormCurrent.hours,
            minutes: lessonFormCurrent.minutes,
            fields: lessonFields.map((f: LessonField) => ({ type: f.type, value: f.value })),
          })

          const resultResponse = response.data
          if (resultResponse) {
            setModules(
              modules.map((module: any, index: any) => {
                if (
                  index == moduleIndexCreate &&
                  module.lessons.filtemodulesElemr(
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
                        fields: lessonFields.map((f: LessonField) => ({ type: f.type, value: f.value })),
                        type: 'practice',
                        en_id: lessonFormCurrent.en_id || resultResponse.lessonId,
                      },
                    ],
                  }
                } else return module
              })
            )

            setLessonForm(initialLesson)
            setLessonFormCurrent(initialLesson)
            setLessonFields([])
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
          {lessonFields.map((field: LessonField, index: number) =>
            <Box key={'mainModuleContainer_' + index} sx={{ boxShadow: 2, border: '1px solid' }}>
              <Accordion
                defaultExpanded={true}
                sx={{}}
                draggable
                onDragStart={() => ((dragLesson.current = field.tmpId), setDisplayDrag(false))}
                onDragEnter={() => (draggedOverLesson.current = index)}
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
                        setLessonFields(lessonFields.filter((f: LessonField, i: number) => i !== index)
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
                      {field.type == 'slate' && displayDrag && (
                        <Box>
                          <Box sx={{ color: '#000000' }}>
                            <MyEditor
                              value={field.value}
                              setValue={function (data: any) {
                                setLessonFields(
                                  lessonFields.map((f: LessonField, i: number) => i === index ? { ...f, value: data } : f)
                                )
                              }}
                            />
                          </Box>
                        </Box>
                      )}

                      {field.type == 'code' && displayDrag && (
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
                              setLessonFields(
                                lessonFields.map((f: LessonField, i: number) => i === index ? { ...f, value: e.target.value } : f)
                              )
                            }}
                            value={field.value}
                          />
                        </Box>
                      )}

                      {field.type == 'codeHtml' && displayDrag && (
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
                              setLessonFields(
                                lessonFields.map((f: LessonField, i: number) => i === index ? { ...f, value: e.target.value } : f)
                              )
                            }}
                            value={field.value}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 4 }}></Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Box>

        <Button
          variant='contained'
          onClick={(e) => {
            setLessonFields([
              ...lessonFields,
              {
                tmpId: new Date().getTime(),
                type: 'slate',
                value: initialRichText,
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
            setLessonFields([
              ...lessonFields,
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
            setLessonFields([
              ...lessonFields,
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
          onClick={async e => {
            setLessonForm(initialLesson)
            setLessonFormCurrent(initialLesson)
            setLessonFields([])
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
          {idLessonEdit ? 'Save' : 'Create'}
        </Button>
      </Box>
    </Box>
  )
}

export default LessonCreatePractice
