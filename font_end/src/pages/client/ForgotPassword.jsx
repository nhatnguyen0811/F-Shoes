import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import authenticationAPi from '../../api/authentication/authenticationAPi'
import { Navigate, useNavigate } from 'react-router-dom'
import { getCookie } from '../../services/cookie'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otp2, setOtp2] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRobot, setIsRobot] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })

  async function checkMail(email) {
    const response = await authenticationAPi.checkMail(email)
    return response.data.success
  }
  async function sendOtp(email) {
    const response = await authenticationAPi.sendOtp(email)
    return response.data
  }

  const handleSendOtp = async () => {
    if (!email) {
      setErrors({ ...errors, email: 'Vui lòng nhập địa chỉ email' })
      return
    }

    const isEmailValid = await checkMail(email)

    if (!isEmailValid) {
      toast.error('Email không tồn tại trong hệ thống')
      return
    }

    const sendma = await sendOtp(email)
    if (sendma.success) {
      setOtp2(sendma.data)
    }

    setErrors({ ...errors, email: '' })
    setStep(2)
  }

  const navigate = useNavigate()
  const handleResetPassword = () => {
    let hasError = false
    const newErrors = {}

    if (!otp) {
      newErrors.otp = 'Vui lòng nhập mã OTP'
      hasError = true
    }

    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
      hasError = true
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      hasError = true
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu không khớp'
      hasError = true
    }

    if (hasError) {
      setErrors({ ...errors, ...newErrors })
      return
    }
    if (!isRobot) {
      toast.success('Vui lòng xác minh không phải robot')
    }

    if (isRobot && otp === otp2 && newPassword === confirmPassword) {
      authenticationAPi.change(email, newPassword).then((result) => {
        if (result.data.success) {
          toast.success('Đặt lại mật khẩu thành công')
          navigate('/login')
        }
      })
    } else {
      toast.error('Xác nhận không thành công')
    }
  }

  const token = getCookie('ClientToken')
  return token ? (
    <Navigate to={'/home'} />
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography component="h1" variant="h5">
          Quên Mật Khẩu
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          {step === 1 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
                onClick={handleSendOtp}>
                Gửi Mã OTP
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Mã OTP"
                name="otp"
                autoComplete="off"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={Boolean(errors.otp)}
                helperText={errors.otp}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="Mật Khẩu Mới"
                name="newPassword"
                type="password"
                autoComplete="off"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Xác Nhận Mật Khẩu"
                name="confirmPassword"
                type="password"
                autoComplete="off"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
              />
              <ReCAPTCHA
                sitekey="6Lf3KwwpAAAAAJriNTbY4LqBvuI1aiRzTNb14cVd"
                onChange={() => setIsRobot(true)}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleResetPassword}>
                Đặt Lại Mật Khẩu
              </Button>
            </>
          )}
        </Box>
        <ToastContainer />
      </Box>
    </Container>
  )
}

export default ForgotPassword
