'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import '../../../app/globals.css'
import { Box, Button, Typography } from '@mui/material'
import ResetPassword from '@/components/ResetPassword'
import { useRouter } from 'next/router'
import axios from 'axios'
const url = `${process.env.NEXT_BACK_HOST_API}/auth/user`

const AdminLogin = () => {
  const [width, setWidth] = useState(0)

  const router = useRouter()
  const { id } = router.query
  async function verify() {
    const response = await axios.put(url + '?id=' + id + '&isVerified=true&isAdmin=false', {})
    const resultResponse = response.data
    if (resultResponse) {
      localStorage.setItem('UserID', id as string)
      setTimeout(() => {
        router.push('/')
      }, 10000)
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])
  useEffect(() => {
    if (typeof id !== 'undefined') {
      verify()
    }
  }, [id])

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            maxWidth: '600px',
            width: '100%',
            height: '80vh',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {id && (
            <Box sx={{ color: '#ffec3e', textAlign: 'center' }}>
              <h1>Ваш аккаунт успешно подтвержден!</h1>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <h4 style={{ maxWidth: '500px' }}>
                  Вы будете автоматически переведены на стартовую страницу через 10 секунд
                </h4>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  )
}

export default AdminLogin
