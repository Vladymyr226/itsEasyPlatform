import { useState } from 'react'
import Image from 'next/image'

import { Language, Lesson, Module, Skill, Tag } from '@/utils/interfaces'
import MyEditor from '@/components/SlateEditor/Editor'
import Swal from 'sweetalert2'
import axios from 'axios'
import { uploadFileToS3 } from '@/utils'
import { Delete as DeleteIcon } from '@mui/icons-material'

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'

const urlTag = `${process.env.NEXT_BACK_HOST_API}/cabinet/tag`
const urlSkill = `${process.env.NEXT_BACK_HOST_API}/cabinet/skill`

const CourseCreate = ({
  id,
  error, setError,
  form, setForm,
  editTrigger, setEditTrigger,
  richValue, setRichValue,
  level, setLevel,
  type, setType,
  status, setStatus,
  rating, setRating,
  mediaValue, setMediaValue,
  categorySelect, setCategorySelect,
  allCategorySelect, setAllCategorySelect,
  allSkillSelect, setAllSkillSelect,
  modules, setModules,
  allModules, setAllModules,
  setLessonForm,
  setLanguage,
  setTabValue,
  isEdited,
  handleSubmit,
}: {
  id: string | undefined,
  
  error: any,
  setError: React.Dispatch<any>,
  form: any,
  setForm: React.Dispatch<any>,
  editTrigger: boolean,
  setEditTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  richValue: any[],
  setRichValue: React.Dispatch<React.SetStateAction<any[]>>,
  level: string,
  setLevel: React.Dispatch<React.SetStateAction<string>>,
  type: string,
  setType: React.Dispatch<React.SetStateAction<string>>,
  status: string,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  rating: number,
  setRating: React.Dispatch<React.SetStateAction<number>>,
  mediaValue: { type: string; content: File; } | undefined,
  setMediaValue: React.Dispatch<React.SetStateAction<{ type: string; content: File; } | undefined>>,
  categorySelect: Tag[],
  setCategorySelect: React.Dispatch<React.SetStateAction<Tag[]>>,
  allCategorySelect: Tag[],
  setAllCategorySelect: React.Dispatch<React.SetStateAction<Tag[]>>,
  allSkillSelect: Skill[],
  setAllSkillSelect: React.Dispatch<React.SetStateAction<Skill[]>>,
  modules: Module[],
  setModules: React.Dispatch<React.SetStateAction<Module[]>>,
  allModules: Lesson[],
  setAllModules: React.Dispatch<React.SetStateAction<Lesson[]>>,

  setLanguage: React.Dispatch<React.SetStateAction<Language>>,
  setTabValue: React.Dispatch<React.SetStateAction<number>>,
  setLessonForm: React.Dispatch<any>,
  isEdited: () => boolean,
  handleSubmit: (e: any) => Promise<void>,
}) => {

  const [skillsSelect, setSkillsSelect] = useState<Array<Skill>>([])
  
  const handleChangeLevel = (event: SelectChangeEvent) => {
    setEditTrigger(true)
    setError({})
    setLevel(event.target.value as string)
  }

  const handleChangeType = (event: SelectChangeEvent) => {
    setEditTrigger(true)
    setError({})
    setType(event.target.value as string)
  }

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setEditTrigger(true)
    setError({})
    setStatus(event.target.value as string)
  }

  const handlePreviewMediaChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setEditTrigger(true)
      setError({})
      setMediaValue({
        type: event.target.files[0].type.split('/')[0],
        content: event.target.files[0],
      })
    }
  }

  const showSwalSkill = () => {
    Swal.fire({
      title: 'Create Skill',
      html: `
          <input type="text" id="textInput" class="swal2-input" placeholder="Enter title">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const textInput = (
          Swal.getPopup()?.querySelector('#textInput') as HTMLInputElement
        ).value

        if (!textInput || textInput.trim() == '') {
          Swal.showValidationMessage(`Please enter text`)
        }

        return { textInput: textInput }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(
          urlSkill + '?title=' + result.value.textInput + '&iconUrl=' + '',
        )
        const resultResponse = response.data
        if (resultResponse) {
          Swal.fire('Created!', '', 'success')
          setEditTrigger(true)
          setError({})
          setAllSkillSelect([
            ...allSkillSelect,
            {
              name_skill: result.value.textInput,
              id: resultResponse.skillId,
              icon_url: '',
            },
          ])
        }
      }
    })
  }

  const showSwalTag = () => {
    Swal.fire({
      title: 'Create tag',
      html: `
          <input type="text" id="textInput" class="swal2-input" placeholder="Enter title">
          <input type="file" id="fileInput" class="swal2-file">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const textInput = (
          Swal.getPopup()?.querySelector('#textInput') as HTMLInputElement
        ).value
        const fileInput = (
          Swal.getPopup()?.querySelector('#fileInput') as HTMLInputElement
        ).files

        if (!textInput || textInput.trim() == '') {
          Swal.showValidationMessage(`Please enter text`)
        }

        return { textInput: textInput, fileInput: fileInput }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const selectedFileURL =
          result.value.fileInput.length > 0
            ? await uploadFileToS3(result.value.fileInput[0])
            : ''

        const response = await axios.post(
          urlTag +
            '?title=' +
            result.value.textInput +
            '&iconUrl=' +
            selectedFileURL,
        )
        const resultResponse = response.data
        if (resultResponse) {
          Swal.fire('Created!', '', 'success')
          setEditTrigger(true)
          setError({})

          setAllCategorySelect([
            ...allCategorySelect,
            {
              name_of_tag: result.value.textInput,
              id: resultResponse.tagId,
              icon_url: selectedFileURL as string,
            },
          ])
        }
      }
    })
  }

  return <Box sx={{ color: '#fff' }}>
    <TextField
      autoComplete="off"
      margin="normal"
      required
      fullWidth
      id="title"
      type="text"
      label="Title"
      name="title"
      error={(error && error.title) ?? false}
      autoFocus
      onChange={(e) => {
        setForm({ ...form, title: e.target.value })
        setEditTrigger(true)
        setError({})
      }}
      value={form.title}
    />
    <Box sx={{ color: '#000000' }}>
      <MyEditor value={richValue} setValue={setRichValue} />
    </Box>
    <TextField
      autoComplete="off"
      margin="normal"
      required
      fullWidth
      error={(error && error.duration) ?? false}
      id="duration"
      type="number"
      label="Duration"
      name="duration"
      InputProps={{
        inputProps: { min: 1 },
      }}
      onChange={(e) => {
        setForm({ ...form, duration: Number(e.target.value) })
        setEditTrigger(true)
        setError({})
      }}
      value={form.duration || ''}
      sx={{ marginTop: 3 }}
    />
    <TextField
      autoComplete="off"
      margin="normal"
      required
      fullWidth
      error={(error && error.price) ?? false}
      id="price"
      type="number"
      label="Price"
      name="price"
      InputProps={{
        inputProps: { min: 1 },
      }}
      onChange={(e) => {
        setForm({ ...form, price: Number(e.target.value) })
        setEditTrigger(true)
        setError({})
      }}
      value={form.price || ''}
    />
    <TextField
      autoComplete="off"
      margin="normal"
      fullWidth
      id="priceDiscount"
      type="number"
      label="Price with discount"
      name="priceDiscount"
      InputProps={{
        inputProps: { min: 1 },
      }}
      onChange={(e) => {
        setForm({
          ...form,
          priceDiscount: Number(e.target.value),
        })
        setEditTrigger(true)
      }}
      value={form.priceDiscount || ''}
    />
    <Box sx={{ marginTop: 2 }}>
      <InputLabel>Level</InputLabel>
      <Select
        error={(error && error.level) ?? false}
        fullWidth
        id="levelSelect"
        value={level}
        onChange={handleChangeLevel}
      >
        <MenuItem value={'Beginner'}>Beginner</MenuItem>
        <MenuItem value={'Junior'}>Junior</MenuItem>
        <MenuItem value={'Middle'}>Middle</MenuItem>
        <MenuItem value={'Senior'}>Senior</MenuItem>
      </Select>
    </Box>
    <Box sx={{ marginTop: 2 }}>
      <InputLabel>Type</InputLabel>
      <Select
        error={(error && error.type) ?? false}
        fullWidth
        id="typeSelect"
        value={type}
        onChange={handleChangeType}
      >
        <MenuItem value={'self-education'}>
          Self education
        </MenuItem>
        <MenuItem value={'with-lector'}>With lector</MenuItem>
      </Select>
    </Box>
    {type == 'with-lector' && (
      <TextField
        autoComplete="off"
        margin="normal"
        required
        fullWidth
        error={(error && error.lector) ?? false}
        id="lector"
        type="text"
        label="Lector"
        name="lector"
        onChange={(e) => {
          setForm({ ...form, lector: e.target.value })
          setEditTrigger(true)
          setError({})
        }}
        value={form.lector}
      />
    )}
    {type == 'with-lector' && (
      <TextField
        autoComplete="off"
        margin="normal"
        required
        fullWidth
        id="date"
        type="date"
        label="Date"
        name="date"
        onChange={(e) => {
          setForm({ ...form, date: e.target.value })
          setEditTrigger(true)
          setError({})
        }}
        value={
          form.date || new Date().toISOString().split('T')[0]
        }
        sx={{
          marginTop: 3,
        }}
      />
    )}
    <Box sx={{ marginTop: 2 }}>
      <InputLabel>Status</InputLabel>
      <Select
        error={(error && error.status) ?? false}
        fullWidth
        id="statusSelect"
        value={status}
        onChange={handleChangeStatus}
      >
        <MenuItem value={'active'}>Active</MenuItem>
        <MenuItem value={'draft'}>Draft</MenuItem>
      </Select>
    </Box>
    <Box sx={{ display: 'flex', marginTop: 1 }}>
      <Box
        sx={{
          marginTop: 1,
          fontWeight: 'bold',
          color: '#000',
        }}
      >
        Rating
      </Box>
      <Rating
        name="rating"
        precision={0.1}
        onChange={(event, newValue) => {
          setRating(newValue ?? 5.0)
          setEditTrigger(true)
          setError({})
        }}
        value={rating || 0}
        sx={{
          marginLeft: 4,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      />
    </Box>
    <Autocomplete
      disablePortal
      multiple
      id="combo-box-demo"
      value={categorySelect}
      onChange={(event, value: any) => {
        setCategorySelect(value)
        setEditTrigger(true)
        setError({})
      }}
      getOptionLabel={(option: any) => option.name_of_tag}
      options={allCategorySelect}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} label="Category" />
      )}
      renderOption={(
        props: object,
        option: any,
        state: object,
      ) => (
        <div
          {...props}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {option.icon_url && (
            <Image
              src={option.icon_url}
              alt={'tagIcon_' + option.id}
              style={{ width: 20, height: 20 }}
              width={20}
              height={20}
            ></Image>
          )}
          <div
            style={{
              textAlign: 'left',
              width: '100%',
              paddingLeft: '10px',
            }}
          >
            {option.name_of_tag}
          </div>
          <IconButton
            key={'deleteButton_' + option.id}
            aria-label="delete"
            onClick={async (e) => {
              const deletingOption = option
              const response = await axios.delete(
                urlTag + '?id=' + option.id,
              )
              const resultResponse = response.data
              if (resultResponse) {
                setAllCategorySelect(
                  allCategorySelect.filter(
                    (category) =>
                      category.id !== deletingOption.id,
                  ),
                )
                setCategorySelect(
                  categorySelect.filter(
                    (category) =>
                      category.id !== deletingOption.id,
                  ),
                )
                Swal.fire({
                  title: 'Deleted!',
                  background: '#171622',
                  color: '#ffec3e',
                  confirmButtonColor: '#c58efe',
                  icon: 'success',
                })
              }
            }}
          >
            <DeleteIcon key={'deleteIcon_'} color="primary" />
          </IconButton>
        </div>
      )}
    />
    <Button onClick={showSwalTag}>Create Tag</Button>

    <Autocomplete
      disablePortal
      multiple
      id="skills"
      value={skillsSelect}
      onChange={(event, value: any) => {
        setSkillsSelect(value)
        setEditTrigger(true)
        setError({})
      }}
      getOptionLabel={(option: any) => option.name_skill}
      options={allSkillSelect}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} label="Skill" />
      )}
      renderOption={(
        props: object,
        option: any,
        state: object,
      ) => (
        <div
          {...props}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>{option.name_skill}</div>
          <IconButton
            key={'deleteButtonSkill_' + option.id}
            aria-label="delete"
            onClick={async (e) => {
              const deletingOption = option
              const response = await axios.delete(
                urlSkill + '?id=' + option.id,
              )
              const resultResponse = response.data
              if (resultResponse) {
                setAllSkillSelect(
                  allSkillSelect.filter(
                    (skill) => skill.id !== deletingOption.id,
                  ),
                )
                setSkillsSelect(
                  skillsSelect.filter(
                    (skill) => skill.id !== deletingOption.id,
                  ),
                )
                Swal.fire({
                  title: 'Deleted!',
                  background: '#171622',
                  color: '#ffec3e',
                  confirmButtonColor: '#c58efe',
                  icon: 'success',
                })
              }
            }}
          >
            <DeleteIcon
              key={'deleteIconSkill_'}
              color="primary"
            />
          </IconButton>
        </div>
      )}
    />
    <Button onClick={showSwalSkill}>Create skill</Button>
    <TextField
      fullWidth
      required
      autoComplete="off"
      margin="normal"
      id="QuestionLimit"
      type="number"
      label="Question Limit"
      name="questionLimit"
      InputProps={{
        inputProps: { min: -1 },
      }}
      onChange={(e) => {
        setEditTrigger(true)
        setForm({
          ...form,
          questionLimit: Number(e.target.value),
        })
      }}
      value={form.questionLimit ? form.questionLimit : null}
    />
    {typeof mediaValue?.content == 'string' && (
      <>
        {mediaValue.type == 'image' ? (
          <>
            <Image src={mediaValue?.content} alt="" width={1200} height={675} />
          </>
        ) : (
          <>
            <video
              controls
              src={mediaValue?.content}
              style={{ width: '100%' }}
            />
          </>
        )}
      </>
    )}
    <Box sx={{ display: 'flex' }}>
      <Button
        variant="contained"
        component="label"
        onClick={() => {
          setEditTrigger(true)
          setError({})
          setMediaValue(undefined)
        }}
        sx={{ mt: 1, mr: 1 }}
      >
        Remove
      </Button>

      <Button
        fullWidth
        variant="contained"
        component="label"
        sx={{ mt: 1 }}
      >
        <input
          type="file"
          accept="video/mp4, image/png, image/jpeg"
          onChange={handlePreviewMediaChange}
        />
      </Button>
    </Box>
    <Box sx={{ display: 'flex' }}>
      {isEdited() && (
        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            fontWeight: 'bold',
            width: '12rem',
            marginRight: 2,
          }}
          onClick={(e) => {
            setForm({
              title: '',
              questionLimit: null,
              date: new Date().toISOString().split('T')[0],
              duration: null,
              lector: '',
              price: null,
              priceDiscount: null,
            })
            setLessonForm({
              title: '',
              link: '',
              image: '',
              hours: 0,
              minutes: 0,
            })
            let selectedModulesArr: Array<Lesson> = []
            modules.map((module: Module) => {
              module.lessons.map((less: Lesson) => {
                selectedModulesArr.push(less)
              })
            })
            setAllModules([
              ...allModules,
              ...selectedModulesArr,
            ])
            setModules([])

            setRichValue([
              {
                type: 'paragaph',
                children: [{ text: '' }],
              },
            ])
            setLanguage('EN')
            setLevel('')
            setType('')
            setStatus('')
            setRating(0.0)
            setCategorySelect([])
            setTabValue(1)
            setTimeout(() => {
              setTabValue(0)
            }, 10)
          }}
        >
          Clear draft
        </Button>
      )}
      <Button
        variant="contained"
        fullWidth
        sx={{
          marginTop: 2,
          fontWeight: 'bold',
        }}
        onClick={(e) => {
          if (!id && editTrigger) {
            handleSubmit('')
          }
          setTabValue(1)
        }}
      >
        Go to structure
      </Button>
    </Box>
  </Box>
}

export default CourseCreate
