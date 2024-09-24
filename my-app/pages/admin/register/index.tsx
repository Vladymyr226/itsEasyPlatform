'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import '../../../app/globals.css'
import { Box } from '@mui/material'
import Register from '@/components/Register'
const AdminRegister = () => {
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
          <Register />
        </Box>
      </Box>
    </Layout>
  )
}

export default AdminRegister
