import React, { useState } from 'react'
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material'
import { toast } from 'react-toastify'
import authenticationAPi from '../../../api/authentication/authenticationAPi'
import { Navigate, useNavigate } from 'react-router-dom'
import { getCookie } from '../../../services/cookie'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const navigate = useNavigate()

  const handleTogglePasswordVisibility = (field) => {
    switch (field) {
      case 'currentPassword':
        setShowCurrentPassword(!showCurrentPassword)
        break
      case 'newPassword':
        setShowNewPassword(!showNewPassword)
        break
      case 'confirmNewPassword':
        setShowConfirmNewPassword(!showConfirmNewPassword)
        break
      default:
        break
    }
  }
  const [errors, setErrors] = useState({
    passOld: '',
    newPass: '',
    confirmPass: '',
  })

  const handleChangePassword = async () => {
    const newErrors = {}
    let check = 0
    if (!currentPassword) {
      newErrors.passOld = 'Vui lòng nhập mật khẩu cũ.'
      check++
    }

    if (!newPassword) {
      newErrors.newPass = 'Vui lòng nhập mật khẩu mới.'
      check++
    } else if (newPassword.length < 5) {
      newErrors.newPass = 'Mật khẩu mới phải lớn hơn 5 kí tự.'
      check++
    }

    if (!confirmNewPassword) {
      newErrors.confirmPass = 'Vui lòng xác nhận lại mật khẩu mới'
      check++
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmPass = 'Mật khẩu mới và xác nhận mật khẩu mới không khớp'
      check++
    }
    if (check > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await authenticationAPi.changePassword(currentPassword, newPassword)

      if (response.data.success) {
        toast.success('Đổi mật khẩu thành công')
        navigate('/profile/user')
      } else {
        toast.error('Đổi mật khẩu không thành công. Vui lòng kiểm tra lại mật khẩu cũ.')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại sau.')
    }
  }

  const token = getCookie('ClientToken')

  return !token ? (
    <Navigate to={'/home'} />
  ) : (
    <Paper elevation={3} sx={{ mt: 2, padding: 2, width: '100%', mx: 'auto', height: 'auto' }}>
      <p className="hs-user">Đổi mật khẩu</p>
      <Typography>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</Typography>
      <hr />
      <Box
        component="form"
        noValidate
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3 }}>
          {' '}
          <Typography sx={{ textAlign: 'left' }}>
            <span className="required"> *</span>Mật khẩu hiện tại
          </Typography>
          <TextField
            required
            size="small"
            type={showCurrentPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value)
              setErrors({ ...errors, passOld: '' })
            }}
            sx={{ width: '400px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePasswordVisibility('currentPassword')}
                    edge="end">
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(errors.passOld)}
            helperText={errors.passOld}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3, ml: 4 }}>
          <Typography sx={{ textAlign: 'left', mt: 3 }}>
            <span className="required"> *</span>Mật khẩu mới
          </Typography>
          <TextField
            required
            size="small"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={newPassword}
            sx={{ width: '400px' }}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setErrors({ ...errors, newPass: '' })
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePasswordVisibility('newPassword')}
                    edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(errors.newPass)}
            helperText={errors.newPass}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3, mr: 4 }}>
          <Typography sx={{ textAlign: 'left', mt: 3 }}>
            <span className="required"> *</span>Nhập lại mật khẩu mới
          </Typography>
          <TextField
            required
            size="small"
            name="confirmNewPassword"
            type={showConfirmNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmNewPassword}
            sx={{ width: '400px' }}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value)
              setErrors({ ...errors, confirmPass: '' })
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePasswordVisibility('confirmNewPassword')}
                    edge="end">
                    {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(errors.confirmPass)}
            helperText={errors.confirmPass}
          />
        </Stack>
        <Button
          type="button"
          variant="contained"
          className="btn-luupf"
          sx={{ mt: 3, mb: 2, width: '200px' }}
          onClick={handleChangePassword}>
          Đổi Mật Khẩu
        </Button>
      </Box>
    </Paper>
  )
}

export default ChangePassword
