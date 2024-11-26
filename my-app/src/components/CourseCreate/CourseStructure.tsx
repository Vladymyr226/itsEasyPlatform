import Swal from 'sweetalert2'
import axios from 'axios'

import { removeLessonIds } from '@/utils/removeAllLessonId'
import { Lesson, Module } from '@/utils/interfaces'
import LessonBox from './LessonBox'

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
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

const urlLesson = `${process.env.NEXT_BACK_HOST_API}/cabinet/lesson`

const CourseStructure = ({
  dragLesson,
  draggedOverLesson,
  modules, setModules,
  allLessons, setAllLessons,
  idLessonEdit, setIdLessonEdit,
  createLessonIndx, setCreateLessonIndx,
  storedLessons, setStoredLessons,
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
  allLessons: Lesson[],
  setAllLessons: React.Dispatch<React.SetStateAction<Lesson[]>>,
  idLessonEdit: string | null,
  setIdLessonEdit: React.Dispatch<React.SetStateAction<string | null>>,
  createLessonIndx: number,
  setCreateLessonIndx: React.Dispatch<React.SetStateAction<number>>,
  storedLessons: Lesson[],
  setStoredLessons: React.Dispatch<React.SetStateAction<Lesson[]>>,

  setEditTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<any>,
  setLessonForm: React.Dispatch<React.SetStateAction<Lesson>>,
  setLessonType: React.Dispatch<React.SetStateAction<string>>,
  setTabValue: React.Dispatch<React.SetStateAction<number>>,
}) => {

  const countModuleNameMeet = (str: string) => {
    const result = modules.filter((module) => module.title.trim() == str.trim())

    return result.length
  }

  const handleChangeStoredLessons = (value: any, i: number) => {
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
              setStoredLessons(storedLessons.filter(l => l.id != value.id))
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
  }

  const renderOptionStoredLessons = (props: object, option: any, state: object) => (
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
                setStoredLessons(storedLessons.filter(l => l.id != option.id))
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
  )

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
                            setAllLessons([
                              ...allLessons,
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
                    {element.lessons.map((lesson, index) =>
                      <LessonBox
                        key={'mainLessonContainer_' + index}
                        element={element}
                        i={i}
                        lesson={lesson}
                        index={index}
                        dragLesson={dragLesson}
                        draggedOverLesson={draggedOverLesson}
                        modules={modules}
                        setModules={setModules}
                        idLessonEdit={idLessonEdit}
                        setIdLessonEdit={setIdLessonEdit}
                        storedLessons={storedLessons}
                        setStoredLessons={setStoredLessons}
                        setEditTrigger={setEditTrigger}
                        setLessonForm={setLessonForm}
                        setCreateLessonIndx={setCreateLessonIndx}
                        setLessonType={setLessonType}
                        setTabValue={setTabValue}
                        setError={setError}
                      />
                    )}
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
                      options={storedLessons}
                      value={{ title: '' }}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Stored lessons"
                        />
                      )}
                      onChange={(event: any, value: any) => handleChangeStoredLessons(value, i)}
                      renderOption={renderOptionStoredLessons}
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
                        link: '',
                        image: '',
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
