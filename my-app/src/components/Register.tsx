import Typography from '@mui/material/Typography'
import { createTheme } from '@mui/material/styles'
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

const url = `${process.env.NEXT_BACK_HOST_API}/auth/register`

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
const Registration = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  })

  function validateString(input: string) {
    const trimmedInput = input.trim()
    const pattern = /^[a-zA-Z0-9]{4,100}$/
    const isValidLength = trimmedInput.length >= 4 && trimmedInput.length <= 100
    const matchesPattern = pattern.test(trimmedInput)
    return isValidLength && matchesPattern
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (form.userName.indexOf(' ') != -1) {
        Swal.fire({
          title: 'Username cannot contain spaces inside!',
          background: '#171622',
          color: '#ffec3e',
          confirmButtonColor: '#c58efe',
          icon: 'error',
        })
        return
      }
      if (form.userName.trim().length < 3 || form.userName.trim().length >= 32) {
        Swal.fire({
          title: 'Username must be longer than 3 and shorter than 32 characters!',
          background: '#171622',
          color: '#ffec3e',
          confirmButtonColor: '#c58efe',
          icon: 'error',
        })
        return
      }
      if (form.email.trim().length > 40) {
        Swal.fire({
          title: 'Email must be shorter than 40 characters!',
          background: '#171622',
          color: '#ffec3e',
          confirmButtonColor: '#c58efe',
          icon: 'error',
        })
        return
      }
      if (!validateString(form.password)) {
        Swal.fire({
          title: 'Password must be at least 4 characters long and contain only digits and letters!',
          background: '#171622',
          color: '#ffec3e',
          confirmButtonColor: '#c58efe',
          icon: 'error',
        })
        return
      }

      const response = await axios.post(
        url + '?userName=' + form.userName + '&email=' + form.email + '&password=' + form.password,
        {}
      )
      const resultResponse = response.data
      if (resultResponse) {
        setCookie('jwt', resultResponse.token, { maxAge: 100 * 24 * 60 * 60 * 1000 })
        localStorage.setItem('UserID', resultResponse.user.id)
        Swal.fire({
          title: 'You signed up successfully!',
          background: '#171622',
          color: '#ffec3e',
          confirmButtonColor: '#c58efe',
          icon: 'success',
        })
        router.push('/')
      }
    } catch (error) {
      alert(error)
      Swal.fire({
        title: 'Sign up failure!',
        background: '#171622',
        color: '#ffec3e',
        confirmButtonColor: '#c58efe',
        icon: 'error',
      })
      return
    }
  }
  const [showPass, setShowPass] = useState(false)
  const t = getLocale()
  return (
    <Box sx={{ background: 'none', width: '100%' }}>
      <Typography component='h1' variant='h5' sx={{ color: '#ffec3e' }}>
        {t.sign_up}
      </Typography>
      <Box component='form' id='formSignIn' onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          required
          fullWidth
          id='username'
          type='text'
          label={t.username}
          name='username'
          autoComplete='login'
          autoFocus
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          sx={{ ...textFieldColors }}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          type='email'
          label='Email'
          name='email'
          autoComplete='email'
          autoFocus
          InputLabelProps={{
            sx: {
              color: '#ffec3e',
            },
          }}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ ...textFieldColors }}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          name='password'
          label={t.password}
          type={showPass ? 'text' : 'password'}
          id='password'
          autoComplete='current-password'
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
          onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          {t.sign_up}
        </Button>
        <Link href={'./login'}>
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
            {t.login_now}
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default Registration
