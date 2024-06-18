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
import '../../../app/globals.css'
import { Box, Grid, Button, Typography } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Link from 'next/link'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateField } from '@mui/x-date-pickers/DateField'
import { InputLabel } from '@mui/material'

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import dayjs from 'dayjs'
import axios from 'axios'
// import Tiptap from '@/components/Tiptap'

const url = 'https://its-easy-platform-back-end.vercel.app/api/cabinet/courses'

const textFieldColors = {
  '& label.Mui-focused': {
    color: '#ffec3e',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#ffec3e' },
    '&:hover fieldset': {
      borderColor: '#ffec3e',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffec3e',
    },
  },
  color: '#fff',
  input: {
    color: '#fff',
    borderColor: '#fff',
  },
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const CourseCreate = () => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

  //  bg-dark shadow-lg p-5 rounded-lg border-t-4 border-yellow w-full max-w-[30rem]')
  //   dropModal
  const [value, setValue] = useState(0)
  const [imageUrl, setImageUrl] = useState('')

  const [language, setLanguage] = useState('')
  const [level, setLevel] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string)
  }
  const handleChangeLevel = (event: SelectChangeEvent) => {
    setLevel(event.target.value as string)
  }
  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as string)
  }
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string)
  }

  interface Lesson {
    name: string
    description: string
    duration: number
    fields: Array<any>
  }

  const [modules, setModules] = useState<Array<Array<Lesson>>>([])
  const [allModules, setAllModules] = useState<Array<Lesson>>([])
  const [expanded, setExpanded] = useState<string | false>(false)
  const [reDropBlock, setReDropBlock] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    richtext: '',
    imagePreview: '',
    date: '',
    lecturesAmount: 0,
    practicAmount: 0,
    priceCourse: 0,
    priceDiscount: 0,
  })
  const [lessonForm, setLessonForm] = useState({
    name: '',
    description: '',
    duration: 0,
    fields: [{}, {}],
  })

  const handleChangeExpanded =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const handleOnDragOver = (e: any) => {
    e.preventDefault()
    setReDropBlock(false)
  }
  const handleOnDropDel = (e: any) => {
    const delField = JSON.parse(e.dataTransfer.getData('ID'))
    setModules(
      modules.map((elem, index) => {
        if (delField.moduleI === index) {
          return elem.filter((lesson, lessonIndex) => {
            if (lessonIndex !== delField._i) {
              return lesson
            }
            setAllModules([...allModules, lesson])
          })
        }
        return elem
      })
    )
  }
  const handleOnDrop = (e: any, i: number) => {
    if (!reDropBlock) {
      setModules(
        modules.map((modulesElem, index) => {
          if (index == i) {
            setAllModules(
              allModules.filter(
                (allModulesElem, modulesIndex) =>
                  modulesIndex != JSON.parse(e.dataTransfer.getData('ID'))._i
              )
            )
            return [
              ...modulesElem,
              {
                name: JSON.parse(e.dataTransfer.getData('ID')).name,
                description: JSON.parse(e.dataTransfer.getData('ID')).description,
                duration: JSON.parse(e.dataTransfer.getData('ID')).duration,
                fields: JSON.parse(e.dataTransfer.getData('ID')).fields,
              },
            ]
          }
          return modulesElem
        })
      )
    }

    setReDropBlock(false)
  }
  const handleSubmit = async (e: any) => {
    console.log(modules.toString())
    const json = {
      ...form,
      language: language,
      level: level,
      type: type,
      modules: modules,
    }
    console.log(json)

    try {
      const response = await axios.post(url + '?isActive=' + status, json)
      const resultResponse = response.data
      if (resultResponse) {
        console.log('Success')
      }
    } catch (error) {
      alert(error)
      console.error(error)
      return
    }
  }

  async function getPageData() {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href

      if (fullUrl.split('_id=')[1]) {
        console.log(fullUrl.split('_id=')[1])
        const response = await fetch(url + '?_id=' + fullUrl.split('_id=')[1], {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.log(response)
      }
      // const response = await fetch(urlGet, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })

      // const result = await response.json()
      // if (result.myIndustrialHubTools.length) {
      //   const fetchedData = result?.myIndustrialHubTools?.at(-1)
      // }
    }
  }
  useEffect(() => {
    getPageData()
  }, [])

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
          }}
        >
          <Box
            sx={{
              maxWidth: '900px',
              width: '100%',
              boxShadow: 2,
              borderRadius: '10px',

              border: '1px solid #ffec3e',
              borderTop: '4px solid #ffec3e',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label='basic tabs example'
                textColor={'primary'}
                sx={{
                  maxWidth: '100%',
                }}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: '#ffec3e',
                  },
                }}
              >
                <Tab
                  value={0}
                  label='General'
                  sx={{
                    width: '33%',
                    color: '#ffec3e',
                    '&.Mui-selected': {
                      color: '#ffec3e',
                      fontWeight: 'bold',
                    },
                  }}
                />
                <Tab
                  value={1}
                  label='Structure'
                  sx={{
                    width: '34%',
                    color: '#ffec3e',
                    '&.Mui-selected': {
                      color: '#ffec3e',
                      fontWeight: 'bold',
                    },
                  }}
                />
                <Tab
                  value={2}
                  label='Create lesson'
                  sx={{
                    width: '33%',
                    color: '#ffec3e',
                    '&.Mui-selected': {
                      color: '#ffec3e',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </Tabs>
              <CustomTabPanel value={value} index={0}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ color: '#fff' }}>
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='title'
                      type='text'
                      label='Title'
                      name='title'
                      autoFocus
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      onChange={(e) => {
                        setForm({ ...form, title: e.target.value })
                      }}
                      value={form.title}
                      sx={{ ...textFieldColors }}
                    />
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='description'
                      type='text'
                      label='Description'
                      name='description'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      onChange={(e) => {
                        setForm({ ...form, description: e.target.value })
                      }}
                      value={form.description}
                      sx={{ ...textFieldColors }}
                    />
                    {/* <Tiptap /> */}
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='richtext'
                      type='text'
                      label='Rich-text'
                      name='richtext'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      onChange={(e) => {
                        setForm({ ...form, richtext: e.target.value })
                      }}
                      value={form.richtext}
                      sx={{ ...textFieldColors }}
                    />
                    <Box>
                      {imageUrl && <Image src={imageUrl} fill alt={'Preview image'} />}
                      <TextField
                        onChange={(e) => {
                          setForm({ ...form, imagePreview: e.target.value })
                        }}
                        value={form.imagePreview}
                        margin='normal'
                        required
                        fullWidth
                        id='imagePreview'
                        type='text'
                        label='Image preview'
                        name='imagePreview'
                        InputLabelProps={{
                          sx: {
                            color: '#ffec3e',
                          },
                        }}
                        sx={{ ...textFieldColors }}
                      />
                    </Box>
                    {/* TODO Normal color */}
                    <Box sx={{ marginTop: 2 }}>
                      <InputLabel sx={{ color: '#ffec3e' }}>Language</InputLabel>
                      <Select
                        fullWidth
                        id='languageSelect'
                        value={language}
                        onChange={handleChangeLanguage}
                        sx={{
                          color: '#fff',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                        }}
                      >
                        <MenuItem value={'RU'}>RU</MenuItem>
                        <MenuItem value={'UA'}>UA</MenuItem>
                        <MenuItem value={'EN'}>EN</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                      <InputLabel sx={{ color: '#ffec3e' }}>Level</InputLabel>
                      <Select
                        fullWidth
                        id='levelSelect'
                        value={level}
                        onChange={handleChangeLevel}
                        sx={{
                          color: '#fff',

                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                        }}
                      >
                        <MenuItem value={'Beginner'}>Beginner</MenuItem>
                        <MenuItem value={'Junior'}>Junior</MenuItem>
                        <MenuItem value={'Middle'}>Middle</MenuItem>
                        <MenuItem value={'Senior'}>Senior</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                      <InputLabel sx={{ color: '#ffec3e' }}>Type</InputLabel>
                      <Select
                        fullWidth
                        id='typeSelect'
                        value={type}
                        onChange={handleChangeType}
                        sx={{
                          color: '#fff',

                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                        }}
                      >
                        <MenuItem value={'self-education'}>Self education</MenuItem>
                        <MenuItem value={'with-lector'}>With lector</MenuItem>
                      </Select>
                    </Box>
                    <DateField
                      label={type === 'with-lector' ? 'Start date' : 'Creation date'}
                      fullWidth
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      onChange={(newValue) =>
                        setForm({ ...form, date: newValue?.toString() ?? '' })
                      }
                      sx={{ ...textFieldColors, marginTop: 2 }}
                    />
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='lectures-amount'
                      type='number'
                      label='Lectures amount'
                      name='lecturesAmount'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      onChange={(e) => {
                        setForm({ ...form, lecturesAmount: Number(e.target.value) })
                      }}
                      value={form.lecturesAmount}
                      sx={{ ...textFieldColors, marginTop: 3 }}
                    />
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='practic-amount'
                      type='number'
                      label='Practic amount'
                      name='practicAmount'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      onChange={(e) => {
                        setForm({ ...form, practicAmount: Number(e.target.value) })
                      }}
                      value={form.practicAmount}
                      sx={{ ...textFieldColors }}
                    />

                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='price-course'
                      type='number'
                      label='Price for course'
                      name='priceCourse'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      onChange={(e) => {
                        setForm({ ...form, priceCourse: Number(e.target.value) })
                      }}
                      value={form.priceCourse}
                      sx={{ ...textFieldColors }}
                    />

                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      id='price-discount'
                      type='number'
                      label='Price for course with discount'
                      name='priceDiscount'
                      InputLabelProps={{
                        sx: {
                          color: '#ffec3e',
                        },
                      }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      onChange={(e) => {
                        setForm({ ...form, priceDiscount: Number(e.target.value) })
                      }}
                      value={form.priceDiscount}
                      sx={{ ...textFieldColors }}
                    />
                    <Box sx={{ marginTop: 2 }}>
                      <InputLabel sx={{ color: '#ffec3e' }}>Status</InputLabel>
                      <Select
                        fullWidth
                        id='statusSelect'
                        value={status}
                        onChange={handleChangeStatus}
                        sx={{
                          color: '#fff',

                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ffec3e',
                          },
                        }}
                      >
                        <MenuItem value={'active'}>Active</MenuItem>
                        <MenuItem value={'draft'}>Draft</MenuItem>
                      </Select>
                    </Box>
                    <Button
                      variant='contained'
                      fullWidth
                      sx={{
                        marginTop: 2,
                        background: '#ffec3e',
                        color: '#0f0e16',
                        fontWeight: 'bold',
                        border: '2px solid #ffec3e',
                        '&:hover': {
                          backgroundColor: '#0f0e16',
                          color: '#ffec3e',
                        },
                      }}
                      onClick={handleSubmit}
                    >
                      Create
                    </Button>
                  </Box>
                </LocalizationProvider>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Box sx={{ width: '30%', border: '2px solid #ffec3e', minHeight: '20rem' }}>
                    <Button
                      fullWidth
                      variant='contained'
                      onClick={(e) => {
                        setModules([...modules, []])
                      }}
                      sx={{
                        background: '#ffec3e',
                        color: '#0f0e16',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #ffec3e',
                        borderRadius: '0px',
                        '&:hover': {
                          backgroundColor: '#0f0e16',
                          borderBottom: '2px solid #ffec3e',
                          color: '#ffec3e',
                        },
                      }}
                    >
                      Add Module
                    </Button>

                    {modules.map((element, i) => {
                      return (
                        <Box
                          onDragOver={handleOnDragOver}
                          onDrop={(e) => handleOnDrop(e, i)}
                          onDragStart={() => {
                            setReDropBlock(true)
                          }}
                          key={'mainModuleContainer_' + i}
                          sx={{ color: '#ffec3e' }}
                        >
                          <Accordion
                            expanded={expanded === 'panel' + i}
                            onChange={handleChangeExpanded('panel' + i)}
                            sx={{
                              borderBottom: '2px solid #ffec3e',
                              background: '#0f0e16',
                              color: '#ffec3e',
                              '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
                                color: '#ffec3e',
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                minHeight: '58px',
                                borderBottom: expanded === 'panel' + i ? '2px solid' : '',
                              }}
                            >
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <Typography
                                  sx={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Module {' ' + (i + 1)}
                                </Typography>
                              </div>
                            </AccordionSummary>

                            <AccordionDetails style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                              {element.map((lesson, index) => {
                                return (
                                  <div
                                    key={'lessonElement_' + i + '_' + index}
                                    style={{ display: 'flex', marginTop: '8px' }}
                                  >
                                    <Box
                                      key={'mainModuleContainer_' + i}
                                      sx={{
                                        color: '#0f0e16',
                                        width: '15rem',
                                        background: '#ffec3e',
                                        height: '7rem',
                                        padding: '16px',
                                      }}
                                      onDragStart={(e) => {
                                        e.dataTransfer.setData(
                                          'ID',
                                          JSON.stringify({
                                            ...lesson,
                                            _i: index,
                                            moduleI: i,
                                          })
                                        )
                                      }}
                                      draggable
                                    >
                                      <Box sx={{ fontWeight: 'bold' }}>{lesson.name}</Box>
                                      <Box sx={{ paddingLeft: '16px' }}>{lesson.description}</Box>
                                      <Box sx={{}}>{lesson.duration}</Box>
                                    </Box>
                                  </div>
                                )
                              })}
                              <Button
                                fullWidth
                                variant='contained'
                                color='error'
                                sx={{ marginTop: 2 }}
                                onClick={(e) => {
                                  setModules(
                                    modules.filter((moduleElem, index) => {
                                      if (i !== index) {
                                        return moduleElem
                                      }
                                      setAllModules([...allModules, ...moduleElem])
                                      setExpanded('')
                                    })
                                  )
                                }}
                              >
                                Delete
                              </Button>
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      )
                    })}
                  </Box>
                  <Grid
                    onDragOver={handleOnDragOver}
                    onDrop={handleOnDropDel}
                    container
                    sx={{ width: '70%', gap: 2, justifyContent: 'center' }}
                  >
                    {allModules.map((element, i) => {
                      return (
                        <Grid
                          item
                          key={'mainModuleContainer_' + i}
                          sx={{
                            color: '#0f0e16',
                            width: '15rem',
                            background: '#ffec3e',
                            height: '7rem',
                            padding: '16px',
                          }}
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              'ID',
                              JSON.stringify({
                                ...element,
                                _i: i,
                              })
                            )
                          }}
                          draggable
                        >
                          <Box sx={{ fontWeight: 'bold' }}>{element.name}</Box>
                          <Box sx={{ paddingLeft: '16px' }}>{element.description}</Box>
                          <Box sx={{}}>{element.duration}</Box>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Box sx={{ color: '#fff' }}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='lessonName'
                    type='text'
                    label='Name'
                    name='name'
                    autoFocus
                    InputLabelProps={{
                      sx: {
                        color: '#ffec3e',
                      },
                    }}
                    onChange={(e) => {
                      setLessonForm({ ...lessonForm, name: e.target.value })
                    }}
                    value={lessonForm.name}
                    sx={{ ...textFieldColors }}
                  />
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='lessonDescription'
                    type='text'
                    label='Description'
                    name='description'
                    InputLabelProps={{
                      sx: {
                        color: '#ffec3e',
                      },
                    }}
                    onChange={(e) => {
                      setLessonForm({ ...lessonForm, description: e.target.value })
                    }}
                    value={lessonForm.description}
                    sx={{ ...textFieldColors }}
                  />
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='lessonDuration'
                    type='number'
                    label='Duration'
                    name='duration'
                    InputLabelProps={{
                      sx: {
                        color: '#ffec3e',
                      },
                    }}
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    onChange={(e) => {
                      setLessonForm({ ...lessonForm, duration: Number(e.target.value) })
                    }}
                    value={lessonForm.duration}
                    sx={{ ...textFieldColors }}
                  />
                  <Button
                    variant='contained'
                    fullWidth
                    sx={{
                      marginTop: 2,
                      background: '#ffec3e',
                      color: '#0f0e16',
                      fontWeight: 'bold',
                      border: '2px solid #ffec3e',
                      '&:hover': {
                        backgroundColor: '#0f0e16',
                        color: '#ffec3e',
                      },
                    }}
                    onClick={(e) => {
                      setAllModules([...allModules, { ...lessonForm }])
                      setLessonForm({
                        name: '',
                        description: '',
                        duration: 0,
                        fields: [{}, {}],
                      })
                      setValue(1)
                    }}
                  >
                    Create
                  </Button>
                </Box>
              </CustomTabPanel>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default CourseCreate
