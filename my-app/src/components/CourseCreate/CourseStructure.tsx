import { useState } from 'react'
import Swal from 'sweetalert2'
import YouTube, { YouTubeProps } from 'react-youtube'
import axios from 'axios'

import SlateView from '@/components/SlateEditor/View'
import { removeLessonIds } from '@/utils/removeAllLessonId'
import { Lesson, Module, YouTubeProp } from '@/utils/interfaces'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField
} from '@mui/material'

import {
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material'

const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`

const ExampleYouTube = (props: YouTubeProp) => {
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo()
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  }

  return <YouTube videoId={props.url} opts={opts} onReady={onPlayerReady} />
}

const CourseStructure = ({
  dragLesson,
  draggedOverLesson,
  modules, setModules,
  allModules, setAllModules,
  idLessonEdit, setIdLessonEdit,
  createLessonIndx, setCreateLessonIndx,
  storedModules, setStoredModules,
  setEditTrigger,
  setError,
  setLessonForm,
  setLessonType,
  setTabValue,
}: {
  dragLesson: React.MutableRefObject<any>,
  draggedOverLesson: React.MutableRefObject<any>,

  modules: Module[],
  setModules: React.Dispatch<React.SetStateAction<Module[]>>,
  allModules: Lesson[],
  setAllModules: React.Dispatch<React.SetStateAction<Lesson[]>>,
  idLessonEdit: string | null,
  setIdLessonEdit: React.Dispatch<React.SetStateAction<string | null>>,
  createLessonIndx: number,
  setCreateLessonIndx: React.Dispatch<React.SetStateAction<number>>,
  storedModules: Lesson[],
  setStoredModules: React.Dispatch<React.SetStateAction<Lesson[]>>,

  setEditTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<any>,
  setLessonForm: React.Dispatch<any>,
  setLessonType: React.Dispatch<React.SetStateAction<string>>,
  setTabValue: React.Dispatch<React.SetStateAction<number>>,
}) => {

  const [preview, setPreview] = useState('-1')

  const countModuleNameMeet = (str: string) => {
    const result = modules.filter((module) => module.title.trim() == str.trim())

    return result.length
  }

  const handleSort = (lessonsGet: any, i: number) => {
    const lessonClone = [...lessonsGet]
    let draggedIdx = -1
    const temp = lessonClone.filter((less, i) => {
      if (less.id == dragLesson.current) {
        draggedIdx = i
        return less
      }
    })[0]
    lessonClone.splice(
      draggedOverLesson.current > draggedIdx
        ? draggedOverLesson.current + 1
        : draggedOverLesson.current,
      0,
      temp,
    )
    setEditTrigger(true)
    setModules(
      modules.map((module: any, moduleIndex) => {
        if (moduleIndex == i) {
          return {
            title: module.title,
            lessons: lessonClone.filter(
              (less, i) =>
                less.id != dragLesson.current ||
                i ==
                  (draggedOverLesson.current > draggedIdx
                    ? draggedOverLesson.current + 1
                    : draggedOverLesson.current),
            ),
          }
        }
        return module
      }),
    )
  }

  return <Box sx={{ width: '100%' }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {modules.map((element, i) => {
        return (
          <Box
            key={'mainModuleContainer_' + i}
            sx={{ boxShadow: 2, border: '1px solid' }}
          >
            <Accordion defaultExpanded={true} sx={{}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{}}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    gap: '10px',
                    justifyContent: 'space-between',
                  }}
                >
                  <TextField
                    autoComplete="off"
                    margin="normal"
                    fullWidth
                    required
                    error={
                      countModuleNameMeet(element.title) > 1
                    }
                    id={'module' + i}
                    type="text"
                    label={'Module ' + (i + 1) + ' name'}
                    name={'module' + i}
                    autoFocus
                    onChange={(e) => {
                      setEditTrigger(true)
                      setError({})
                      setModules(
                        modules.map((module, moduleIndex) => {
                          if (i == moduleIndex) {
                            return {
                              ...module,
                              title: e.target.value,
                            }
                          } else {
                            return module
                          }
                        }),
                      )
                    }}
                    value={element.title}
                  />

                  <IconButton
                    color="error"
                    sx={{
                      marginTop: 3,
                      width: '40px',
                      height: '40px',
                      marginRight: 4,
                    }}
                    onClick={(e) => {
                      setEditTrigger(true)
                      setError({})
                      setModules(
                        modules.filter(
                          (moduleElem, index) => {
                            if (i !== index) {
                              return moduleElem
                            }
                            setAllModules([
                              ...allModules,
                              ...moduleElem.lessons,
                            ])
                          },
                        ),
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
                    {element.lessons.map((lesson, index) => {
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
                          onDragStart={() =>
                            (dragLesson.current = lesson.id)
                          }
                          onDragEnter={() =>
                            (draggedOverLesson.current =
                              index)
                          }
                          onDragEnd={(e) =>
                            handleSort(element.lessons, i)
                          }
                          onDragOver={(e) =>
                            e.preventDefault()
                          }
                        >
                          <Box
                            sx={{ display: 'flex', gap: 1 }}
                          >
                            <DragIndicatorIcon />
                            <Box sx={{ fontWeight: 'bold' }}>
                              {lesson.title ?? ''}
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'end',
                            }}
                          >
                            {lesson.type == 'defaultOld' && (
                              <IconButton
                                onClick={(e) => {
                                  setPreview(
                                    lesson.id == preview
                                      ? '-1'
                                      : (lesson.id ?? '-1'),
                                  )
                                }}
                              >
                                <PreviewIcon />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={(e) => {
                                setIdLessonEdit(
                                  idLessonEdit == lesson.id
                                    ? null
                                    : lesson.id
                                      ? lesson.id
                                      : null,
                                )
                                setLessonForm(lesson)
                                setCreateLessonIndx(i)
                                setLessonType(lesson.type)
                                setTabValue(2)
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={async (e) => {
                                setEditTrigger(true)
                                setError({})
                                setStoredModules([
                                  ...storedModules,
                                  lesson,
                                ])
                                setModules(
                                  modules.map(
                                    (elem, index) => {
                                      if (i === index) {
                                        return {
                                          title: elem.title,
                                          lessons:
                                            elem.lessons.filter(
                                              (
                                                lessonFilter,
                                                lessonIndex,
                                              ) => {
                                                if (
                                                  lessonFilter.id !==
                                                  lesson.id
                                                ) {
                                                  return lessonFilter
                                                }
                                                setStoredModules(
                                                  [
                                                    ...storedModules,
                                                    lessonFilter,
                                                  ],
                                                )
                                              },
                                            ),
                                        }
                                      }
                                      return elem
                                    },
                                  ),
                                )
                              }}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Box>
                          {preview == lesson.id &&
                            idLessonEdit != lesson.id && (
                              <>
                                <Box
                                  sx={{
                                    paddingLeft: '16px',
                                    maxHeight: '10rem',
                                    overflow: 'auto',
                                    scrollbarWidth: 'none',
                                  }}
                                >
                                  <SlateView
                                    value={lesson.description}
                                  />
                                </Box>
                                <Box
                                  sx={{
                                    overflow: 'auto',
                                    scrollbarWidth: 'none',
                                    marginTop: 2,
                                  }}
                                >
                                  <ExampleYouTube
                                    url={
                                      lesson.link.split(
                                        '?v=',
                                      )[1]
                                    }
                                  />
                                </Box>
                              </>
                            )}
                        </div>
                      )
                    })}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    marginTop: 4,
                  }}
                >
                  <Box
                    sx={{ maxWidth: '100%', width: '100%' }}
                  >
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      getOptionLabel={(option: any) =>
                        option.title
                      }
                      options={storedModules}
                      value={{ title: '' }}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Stored lessons"
                        />
                      )}
                      onChange={(event, value: any) => {
                        setEditTrigger(true)
                        setError({})
                        if (value) {
                          setModules(
                            modules.map(
                              (modulesElem, index) => {
                                if (
                                  index == i &&
                                  modulesElem.lessons.filter(
                                    (reDropElem) =>
                                      reDropElem.id ===
                                      value.id,
                                  ).length === 0
                                ) {
                                  setStoredModules(
                                    storedModules.filter(
                                      (storedModule) =>
                                        storedModule.id !=
                                        value.id,
                                    ),
                                  )
                                  return {
                                    title: modulesElem.title,
                                    lessons: [
                                      ...modulesElem.lessons,
                                      {
                                        ...value,
                                      },
                                    ],
                                  }
                                }
                                return modulesElem
                              },
                            ),
                          )
                        }
                      }}
                      renderOption={(
                        props: object,
                        option: any,
                        state: object,
                      ) => (
                        <div
                          // {...props}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            {...props}
                            style={{ width: '100%' }}
                          >
                            {option.title}
                          </div>
                          <IconButton
                            key={'deleteButton_' + option.id}
                            aria-label="delete"
                            onClick={async (e) => {
                              Swal.fire({
                                title:
                                  'Do you want to delete the lesson?',
                                background: '#171622',
                                color: '#ffec3e',
                                confirmButtonColor: '#ff2052',
                                showCancelButton: true,
                                confirmButtonText: 'Delete',
                              }).then(async (result) => {
                                if (result.isConfirmed) {
                                  removeLessonIds(option.id)
                                  const response =
                                    await axios.delete(
                                      urlLesson +
                                        '?id=' +
                                        option.id,
                                    )
                                  const resultResponse =
                                    response.data
                                  if (resultResponse) {
                                    setStoredModules(
                                      storedModules.filter(
                                        (lesson) =>
                                          lesson.id !=
                                          option.id,
                                      ),
                                    )
                                  }
                                }
                              })
                            }}
                            sx={{}}
                          >
                            <DeleteIcon
                              key={'deleteIcon_'}
                              color="primary"
                            />
                          </IconButton>
                        </div>
                      )}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    marginTop: 4,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      setCreateLessonIndx(
                        createLessonIndx === i ? -1 : i,
                      )
                      setLessonForm({
                        title: '',
                        image: null,
                        hours: 0,
                        minutes: 0,
                      })
                      setTabValue(2)
                    }}
                  >
                    Create lesson
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        )
      })}
    </Box>
    <Button
      variant="contained"
      onClick={(e) => {
        setModules([...modules, { title: '', lessons: [] }])
      }}
      sx={{
        marginTop: 2,
        fontWeight: 'bold',
        borderRadius: '0px',
      }}
    >
      Add Module
    </Button>
  </Box>
}

export default CourseStructure
