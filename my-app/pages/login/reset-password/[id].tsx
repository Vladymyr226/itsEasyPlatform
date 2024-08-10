'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import '../../../app/globals.css'
import { Box, Button, Typography } from '@mui/material'
import ResetPassword from '@/components/ResetPassword'
import { useRouter } from 'next/router'
const AdminLogin = () => {
  const [width, setWidth] = useState(0)

  const router = useRouter()
  const { id } = router.query
  console.log(id)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth)
    }
  }, [])

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
          {id && <ResetPassword id={id as string} />}
        </Box>
      </Box>
    </Layout>
  )
}

export default AdminLogin
