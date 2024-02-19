import React from 'react'

import { Box, Typography, Button, Stack } from '@mui/material'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { removeCookie } from '../../services/cookie'

export default function Forbidden403() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}>
      <img
        src="https://cdn.discordapp.com/attachments/1114210224874721394/1170382618370514964/image.png?ex=6558d6c0&is=654661c0&hm=21beb97f347cb11c970a70dde1b3a8800bf84789c03588bd476ee3f7a8febf16&" // Thay đổi đường dẫn hình ảnh
        alt="403 Error"
        style={{ maxWidth: '100%', marginBottom: '2rem' }}
      />
      <Typography variant="h1" gutterBottom>
        403 - Access Denied
      </Typography>
      <Typography variant="h6" gutterBottom>
        Rất tiếc, bạn không có quyền truy cập trang này.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate(-2)
          }}>
          <IoMdArrowRoundBack />
          &nbsp; Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            removeCookie('AdminToken')
            navigate('/admin/login')
          }}>
          Đăng nhập tài khoản khác
        </Button>
      </Stack>
    </Box>
  )
}
