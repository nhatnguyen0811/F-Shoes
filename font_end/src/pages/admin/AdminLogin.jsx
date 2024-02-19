import React, { Fragment, useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Avatar,
} from '@mui/material'
import { useNavigate, Navigate } from 'react-router-dom'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { toast } from 'react-toastify'
import { getCookie, setCookie } from '../../services/cookie'
import authenticationAPi from '../../api/authentication/authenticationAPi'

const theme = createTheme({
  typography: {
    fontFamily: 'Monospace',
  },
})

export default function AdminLogin() {
  const [staffLogin, setStaffLogin] = useState({
    email: 'admin@gmail.com',
    password: 'admin',
  })
  const [error, SetError] = useState(null)
  const navigate = useNavigate()
  const token = getCookie('AdminToken')

  const handleUsernameChange = (event) => {
    setStaffLogin({ ...staffLogin, email: event.target.value })
  }

  const handlePasswordChange = (event) => {
    setStaffLogin({ ...staffLogin, password: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    return authenticationAPi.loginAdmin(staffLogin.email, staffLogin.password).then(
      (response) => {
        if (response.data.success) {
          toast.success('Đăng nhập thành công!')
          SetError(null)
          setCookie('AdminToken', response.data.data, 7)
        } else {
          toast.error('Đăng nhập thất bại!')
          SetError('Tài khoản hoặc mật khẩu không chính xác')
        }
      },
      (err) => {
        toast.error('Lỗi hệ thống vui lòng thử lại!')
      },
    )
  }

  const handleForgotPassword = () => {
    // Xử lý chuyển hướng người dùng đến trang khôi phục mật khẩu
  }

  return (
    <Fragment>
      {token ? (
        <Navigate to={'/admin/sell'} />
      ) : (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container
            maxWidth="sm"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
            }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Tên đăng nhập"
                    variant="outlined"
                    fullWidth
                    value={staffLogin.email}
                    onChange={handleUsernameChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mật khẩu"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={staffLogin.password}
                    onChange={handlePasswordChange}
                  />
                </Grid>
              </Grid>
              {error && <Typography color={'red'}>{error}</Typography>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: '20px' }}>
                Đăng nhập
              </Button>
              <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
                <Button color="primary" onClick={handleForgotPassword}>
                  Quên mật khẩu?
                </Button>
              </Box>
            </form>
          </Container>
        </ThemeProvider>
      )}
    </Fragment>
  )
}
