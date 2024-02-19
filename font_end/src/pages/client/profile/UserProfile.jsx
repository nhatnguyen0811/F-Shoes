import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import React, { useEffect, useState } from 'react'
import ClientAccountApi from '../../../api/client/clientAccountApi'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './UserProfile.css'
import { toast } from 'react-toastify'
import confirmSatus from '../../../components/comfirmSwal'

export default function UserProfile() {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [khachHang, setKhachHang] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateBirth: null,
    gender: '',
    avatar: '',
  })

  const [errorsKH, setErrorsKH] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateBirth: '',
    gender: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    specificAddress: '',
  })

  useEffect(() => {
    loadData()
    loadList()
  }, [])

  const handleImageChange = (event) => {
    let file = event.target.files[0]
    if (file) {
      setKhachHang({ ...khachHang, avatar: file })
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const loadList = () => {
    ClientAccountApi.getAll().then((response) => {
      setList(response.data)
    })
  }

  const loadData = () => {
    ClientAccountApi.getOne().then((response) => {
      const formattedBirthDate = dayjs(response.data.data.dateBirth).format('DD-MM-YYYY')
      setKhachHang({ ...response.data.data, dateBirth: formattedBirthDate })
    })
  }

  const handleGenderRadioChange = (event) => {
    setErrorsKH({ ...errorsKH, gender: '' })
    setKhachHang({
      ...khachHang,
      gender: event.target.value,
    })
  }

  const isPhoneNumberDuplicate = (phoneNumber, currentId) => {
    return list.some(
      (customer) => customer.phoneNumber === phoneNumber && customer.id !== currentId,
    )
  }
  const isEmailDuplicate = (email, currentId) => {
    return list.some((customer) => customer.email === email && customer.id !== currentId)
  }

  const handleButtonUpdateStaff = () => {
    const newErrors = {}
    const currentDate = dayjs()
    const dateBirth = dayjs(khachHang.dateBirth, 'DD/MM/YYYY')
    const minBirthYear = 1900
    let check = 0

    const cleanedFullName = khachHang.fullName.trim()

    if (!cleanedFullName) {
      newErrors.fullName = 'Vui lòng nhập Họ và Tên.'
      check++
    } else if (cleanedFullName.length > 100) {
      newErrors.fullName = 'Họ và Tên không được quá 100 kí tự.'
      check++
    } else if (cleanedFullName.length < 5) {
      newErrors.fullName = 'Họ và Tên không được ít hơn 5 kí tự.'
      check++
    } else {
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
      if (specialCharsRegex.test(cleanedFullName)) {
        newErrors.fullName = 'Họ và Tên không được chứa kí tự đặc biệt.'
        check++
      } else {
        newErrors.fullName = ''
      }
    }

    if (!khachHang.email.trim()) {
      newErrors.email = 'Vui lòng nhập Email.'
      check++
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      if (!emailRegex.test(khachHang.email.trim())) {
        newErrors.email = 'Vui lòng nhập một địa chỉ email hợp lệ.'
        check++
      } else if (isEmailDuplicate(khachHang.email, khachHang.id)) {
        newErrors.email = 'Email đã tồn tại trong danh sách.'
        check++
      } else if (khachHang.email.trim().length > 50) {
        newErrors.email = 'Email không được quá 50 kí tự.'
        check++
      } else {
        newErrors.email = ''
      }
    }

    if (!khachHang.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập Số điện thoại.'
      check++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(khachHang.phoneNumber.trim())) {
        newErrors.phoneNumber = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
        check++
      } else if (isPhoneNumberDuplicate(khachHang.phoneNumber, khachHang.id)) {
        newErrors.phoneNumber = 'Số điện thoại đã tồn tại trong danh sách.'
        check++
      } else {
        newErrors.phoneNumber = ''
      }
    }

    if (!khachHang.dateBirth) {
      newErrors.dateBirth = 'Ngày sinh không được để trống.'
      check++
    } else {
      if (dateBirth.isBefore(`${minBirthYear}-01-01`) || !dateBirth.isValid()) {
        newErrors.dateBirth = 'Ngày sinh không hợp lệ.'
        check++
      } else {
        if (dateBirth.isAfter(currentDate)) {
          newErrors.dateBirth = 'Ngày sinh không được lớn hơn ngày hiện tại.'
          check++
        } else {
          newErrors.dateBirth = ''
        }
      }
    }

    if (khachHang.gender === null) {
      newErrors.gender = 'Vui lòng chọn Giới tính.'
      check++
    } else {
      newErrors.gender = ''
    }

    if (check > 0) {
      setErrorsKH(newErrors)
      return
    }
    const title = 'Xác nhận cập nhật thông tin?'
    const text = ''
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed) {
        ClientAccountApi.update(khachHang)
          .then(() => {
            toast.success('Cập nhật thông tin thành công!', {
              position: toast.POSITION.TOP_RIGHT,
            })
            loadData()
          })
          .catch(() => {
            toast.error('Cập nhật thông tin thất bại', {
              position: toast.POSITION.TOP_RIGHT,
            })
          })
          .finally(() => {
            setLoading(false)
          })
      }
    })
  }
  return (
    <div>
      <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2, width: '97%' }}>
        <p className="hs-user">Hồ sơ của tôi</p>
        <p className="title-user">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        <hr />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={7}>
            <Grid item xs={12} md={12} sx={{ pr: 5 }}>
              <Typography>
                <span className="required"> *</span>Tên khách hàng
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                size="small"
                fullWidth
                name="fullName"
                value={khachHang.fullName || ''}
                onChange={(e) => {
                  setKhachHang({ ...khachHang, fullName: e.target.value })
                  setErrorsKH({ ...errorsKH, fullName: '' })
                }}
                error={Boolean(errorsKH.fullName)}
                helperText={errorsKH.fullName}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ pr: 5, mt: 3 }}>
              <Typography>
                <span className="required"> *</span>Email
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                size="small"
                fullWidth
                name="email"
                value={khachHang.email || ''}
                onChange={(e) => {
                  setKhachHang({ ...khachHang, email: e.target.value })
                  setErrorsKH({ ...errorsKH, email: '' })
                }}
                error={Boolean(errorsKH.email)}
                helperText={errorsKH.email}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ pr: 5, mt: 3 }}>
              <Typography>
                <span className="required"> *</span>Số điện thoại
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                size="small"
                fullWidth
                name="phoneNumber"
                value={khachHang.phoneNumber || ''}
                onChange={(e) => {
                  setKhachHang({ ...khachHang, phoneNumber: e.target.value })
                  setErrorsKH({ ...errorsKH, phoneNumber: '' })
                }}
                error={Boolean(errorsKH.phoneNumber)}
                helperText={errorsKH.phoneNumber}
              />
              <Typography variant="body2" color="error">
                {errorsKH.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} sx={{ pr: 5, mt: 3 }}>
              <Typography>
                <span className="required"> *</span>Ngày sinh
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format={'DD-MM-YYYY'}
                    className="small-datepicker"
                    name="dateBirth"
                    value={dayjs(khachHang.dateBirth, 'DD-MM-YYYY')}
                    onChange={(e) => {
                      setKhachHang({
                        ...khachHang,
                        dateBirth: dayjs(e).format('DD-MM-YYYY'),
                      })
                      setErrorsKH({ ...errorsKH, dateBirth: '' })
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Typography variant="body2" color="error">
                {errorsKH.dateBirth}
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} sx={{ pr: 5, mt: 3 }}>
              <Typography>
                <span className="required"> *</span>Giới tính
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name="gender"
                  value={khachHang.gender}
                  onChange={handleGenderRadioChange}>
                  <FormControlLabel value="true" control={<Radio />} label="Nam" />
                  <FormControlLabel value="false" control={<Radio />} label="Nữ" />
                </RadioGroup>
              </FormControl>
              <Typography variant="body2" color="error">
                {errorsKH.gender}
              </Typography>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
              <Grid item xs={6}>
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {loading && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                      }}>
                      <CircularProgress size={50} />
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
            <Button
              onClick={handleButtonUpdateStaff}
              variant="outlined"
              className="btn-luupf"
              size="small">
              Lưu
            </Button>
          </Grid>
          <hr className="hr-pcuser" />
          <Grid item xs={12} md={4}>
            <div className="img-user">
              <div
                onClick={() => {
                  document.getElementById('select-avatar').click()
                }}
                className="image-container">
                {khachHang.avatar || image ? (
                  <img
                    src={image || khachHang.avatar}
                    alt="Ảnh nhân viên"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  'Chọn ảnh'
                )}
              </div>
              <input
                hidden
                id="select-avatar"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                className="btn-img-us"
                onClick={() => {
                  document.getElementById('select-avatar').click()
                }}>
                Chọn ảnh
              </Button>
            </div>
            <div className="img-title-user">
              <p className="tt-img">Dụng lượng file tối đa 1 MB</p>
              <p className="tt-img">Định dạng:.JPEG, .PNG</p>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
