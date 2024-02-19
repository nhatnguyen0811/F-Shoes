import React, { useState } from 'react'
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { toast } from 'react-toastify'
import { Navigate, useNavigate } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import authenticationAPi from '../../api/authentication/authenticationAPi'
import { getCookie } from '../../services/cookie'
export default function ChangePassword() {
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
      const response = await authenticationAPi.changePasswordAdmin(currentPassword, newPassword)

      if (response.data.success) {
        toast.success('Đổi mật khẩu thành công')
        navigate('/admin')
      } else {
        toast.error('Đổi mật khẩu không thành công. Vui lòng kiểm tra lại mật khẩu cũ.')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại sau.')
    }
  }

  const token = getCookie('AdminToken')
  return !token ? (
    <Navigate to={'/admin'} />
  ) : (
    <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2, width: '450px', mx: 'auto' }}>
      <p className="hs-user">Đổi mật khẩu</p>
      <hr />
      <Box
        component="form"
        noValidate
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <Typography sx={{ textAlign: 'left' }}>
          <span className="required"> *</span>Mật khẩu hiện tại
        </Typography>
        <TextField
          required
          fullWidth
          size="small"
          type={showCurrentPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value)
            setErrors({ ...errors, passOld: '' })
          }}
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
        <Typography sx={{ textAlign: 'left', mt: 3 }}>
          <span className="required"> *</span>Mật khẩu mới
        </Typography>
        <TextField
          required
          fullWidth
          size="small"
          name="newPassword"
          type={showNewPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={newPassword}
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
        <Typography sx={{ textAlign: 'left', mt: 3 }}>
          <span className="required"> *</span>Nhập lại mật khẩu mới
        </Typography>
        <TextField
          required
          fullWidth
          size="small"
          name="confirmNewPassword"
          type={showConfirmNewPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirmNewPassword}
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
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleChangePassword}>
          Đổi Mật Khẩu
        </Button>
      </Box>
    </Paper>
  )
}
