import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import Swal from 'sweetalert2'
import { Box, Button, TextField, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { getLocale } from '@/utils/getLocale'

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
const url = `${process.env.NEXT_BACK_HOST_API}/auth/login?`
const urlReset = `${process.env.NEXT_BACK_HOST_API}/auth/request-reset-password?`
const urlReset2 = `${process.env.NEXT_BACK_HOST_API}/auth/reset-password?`

const ResetPassword = ({ id }: { id: string }) => {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  function validateString(input: string) {
    const trimmedInput = input.trim()
    const pattern = /^[a-zA-Z0-9]{4,100}$/
    const isValidLength = trimmedInput.length >= 4 && trimmedInput.length <= 100
    const matchesPattern = pattern.test(trimmedInput)
    return isValidLength && matchesPattern
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateString(password)) {
      Swal.fire({
        title: 'Password must be at least 4 characters long and contain only digits and letters!',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
      return
    }
    if (password !== password2) {
      Swal.fire({
        title: 'Passwords do not match!',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
      return
    }

    try {
      const response = await axios.put(urlReset2 + 'id=' + id + '&password=' + password)
      const resultResponse = response.data
      if (resultResponse) {
        router.push('/admin/login')
      }
    } catch (error) {
      Swal.fire({
        title: 'Update failed!',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
    }
  }
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const t = getLocale()
  return (
    <Box sx={{ background: 'none', width: '100%' }}>
      <Typography component='h1' variant='h5' sx={{ color: '#ffec3e' }}>
        {t.reset_password}
      </Typography>
      <Box component='form' id='formSignIn' onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          name='password'
          label={t.password}
          type={showPass ? 'text' : 'password'}
          id='password'
          autoComplete='current-password'
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={(e) => {
                  setShowPass(!showPass)
                }}
              >
                {showPass ? (
                  <VisibilityOffIcon sx={{ color: '#ffec3e' }} fontSize='medium' />
                ) : (
                  <VisibilityIcon sx={{ color: '#ffec3e' }} fontSize='medium' />
                )}
              </IconButton>
            ),
          }}
          sx={{ ...textFieldColors }}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          name='password'
          label={t.password_repeat}
          type={showPass2 ? 'text' : 'password'}
          id='password'
          autoComplete='current-password'
          onChange={(e) => setPassword2(e.target.value)}
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={(e) => {
                  setShowPass2(!showPass2)
                }}
              >
                {showPass2 ? (
                  <VisibilityOffIcon sx={{ color: '#ffec3e' }} fontSize='medium' />
                ) : (
                  <VisibilityIcon sx={{ color: '#ffec3e' }} fontSize='medium' />
                )}
              </IconButton>
            ),
          }}
          sx={{ ...textFieldColors }}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{
            mt: 2,
            mb: 2,
            background: '#ffec3e',
            color: '#0f0e16',
            fontWeight: 'bold',
            border: '2px solid #ffec3e',
            '&:hover': {
              backgroundColor: '#0f0e16',
              border: '2px solid #ffec3e',
              color: '#ffec3e',
              boxShadow: 'none',
            },
          }}
        >
          {t.confirm}
        </Button>
        {/* {!passwordForgot && (
          <Link href={'./register'}>
            <Box
              sx={{
                color: '#ffec3e',
                textAlign: 'right',
                fontSize: '14px',
                '&:hover': {
                  color: '#fff',
                  cursor: 'pointer',
                },
              }}
            >
              {t.register_now}
            </Box>
          </Link>
        )} */}
      </Box>
    </Box>
  )
}

export default ResetPassword
