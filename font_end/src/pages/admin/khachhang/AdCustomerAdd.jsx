import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import khachHangApi from '../../../api/admin/khachhang/KhachHangApi'
import DiaChiApi from '../../../api/admin/khachhang/DiaChiApi'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import confirmSatus from '../../../components/comfirmSwal'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import './AdCustomerAdd.css'
import ghnAPI from '../../../api/admin/ghn/ghnApi'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
const listBreadcrumbs = [{ name: 'Khách hàng', link: '/admin/customer' }]

export default function AdCustomerAdd() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [confirmClicked, setConfirmClicked] = useState(false)
  const [list, setList] = useState([])
  const [tinh, setTinh] = useState([])
  const [huyen, setHuyen] = useState([])
  const [xa, setXa] = useState([])
  const [image, setImage] = useState(null)
  const [khachHang, setKhachHang] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateBirth: '',
    role: 2,
    gender: '',
    avatar: null,
  })
  const [diaChi, setDiaChi] = useState({
    name: '',
    phoneNumber: '',
    specificAddress: '',
    type: true,
    provinceId: null,
    districtId: null,
    wardId: null,
    idCustomer: '',
  })

  const [errors, setErrors] = useState({
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
    loadTinh()
    loadList()
  }, [])

  const loadList = () => {
    khachHangApi.getAll().then((response) => {
      setList(response.data)
    })
  }

  const loadTinh = () => {
    ghnAPI.getProvince().then((response) => {
      setTinh(response.data)
    })
  }

  const loadHuyen = (idProvince) => {
    ghnAPI.getDistrict(idProvince).then((response) => {
      setHuyen(response.data)
    })
  }

  const loadXa = (idDistrict) => {
    ghnAPI.getWard(idDistrict).then((response) => {
      setXa(response.data)
    })
  }

  const [selectedTinh, setSelectedTinh] = useState(null)
  const handleTinhChange = (_, newValue) => {
    setErrors({ ...errors, provinceId: '' })
    setSelectedTinh(newValue)
    setSelectedHuyen(null)
    setSelectedXa(null)
    if (newValue) {
      loadHuyen(newValue.id)
      setDiaChi({ ...diaChi, provinceId: newValue.id })
      setErrors({ ...errors, provinceId: '' })
    } else {
      setHuyen([])
      setDiaChi({ ...diaChi, provinceId: null })
      setErrors({ ...errors, provinceId: 'Vui lòng chọn Tỉnh/Thành phố.' })
    }
  }

  const [selectedHuyen, setSelectedHuyen] = useState(null)
  const [selectedXa, setSelectedXa] = useState(null)
  const handleHuyenChange = (_, newValue) => {
    setErrors({ ...errors, districtId: '' })
    setSelectedHuyen(newValue)
    setSelectedXa(null)
    if (newValue) {
      loadXa(newValue.id)
      setDiaChi({ ...diaChi, districtId: newValue.id })
      setErrors({ ...errors, districtId: '' })
    } else {
      setXa([])
      setDiaChi({ ...diaChi, districtId: null })
      setErrors({ ...errors, districtId: 'Vui lòng chọn Quận/Huyện.' })
    }
  }
  const handleXaChange = (_, newValue) => {
    setErrors({ ...errors, wardId: '' })
    setSelectedXa(newValue)
    setDiaChi({ ...diaChi, wardId: newValue?.id })
    setErrors({ ...errors, wardId: '' })
  }

  const updateDiaChi = () => {
    setDiaChi({
      ...diaChi,
      name: khachHang.fullName,
      phoneNumber: khachHang.phoneNumber,
      type: true,
    })
  }

  const handleImageChange = (event) => {
    let file = event.target.files[0]
    if (file) {
      setKhachHang({ ...khachHang, avatar: file })
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setKhachHang({ ...khachHang, avatar: null })
      setImage(null)
    }
  }

  const handleGenderChange = (event) => {
    setErrors({ ...errors, gender: '' })
    setKhachHang({ ...khachHang, gender: event.target.value })
  }

  const isPhoneNumberDuplicate = (phoneNumber) => {
    return list.some((customer) => customer.phoneNumber === phoneNumber)
  }

  const isEmailDuplicate = (email) => {
    return list.some((customer) => customer.email === email)
  }

  const onSubmit = (khachHang) => {
    const newErrors = {}
    const currentDate = dayjs()
    const dateBirth = dayjs(khachHang.dateBirth, 'DD/MM/YYYY')
    const minBirthYear = 1900
    let check = 0

    const trimmedFullName = khachHang.fullName.trim()
    const hasExtraSpaces = khachHang.fullName !== trimmedFullName

    if (hasExtraSpaces) {
      newErrors.fullName = 'Tên không được chứa khoảng trắng thừa.'
      check++
    } else if (!trimmedFullName) {
      newErrors.fullName = 'Vui lòng nhập Họ và Tên.'
      check++
    } else if (trimmedFullName.length > 100) {
      newErrors.fullName = 'Họ và Tên không được quá 100 kí tự.'
      check++
    } else if (trimmedFullName.length < 5) {
      newErrors.fullName = 'Họ và Tên không được ít hơn 5 kí tự.'
      check++
    } else {
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
      if (specialCharsRegex.test(trimmedFullName)) {
        newErrors.fullName = 'Họ và Tên không được chứa kí tự đặc biệt.'
        check++
      } else {
        newErrors.fullName = ''
      }
    }

    const specificAddressParts = diaChi.specificAddress.split(', ')
    const [diaChiCuThe] = specificAddressParts
    if (!diaChi.specificAddress.trim()) {
      newErrors.specificAddress = 'Vui lòng nhập địa chỉ cụ thể.'
      check++
    } else if (diaChi.specificAddress.length > 225) {
      newErrors.specificAddress = 'Địa chỉ không được quá 225 kí tự.'
      check++
    } else if (diaChiCuThe.length < 5) {
      newErrors.specificAddress = 'Địa chỉ không được ít hơn 5 kí tự.'
      check++
    } else {
      newErrors.specificAddress = ''
    }

    if (!khachHang.email) {
      newErrors.email = 'Vui lòng nhập Email.'
      check++
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      if (!emailRegex.test(khachHang.email)) {
        newErrors.email = 'Vui lòng nhập một địa chỉ email hợp lệ.'
        check++
      } else if (khachHang.email.length > 50) {
        newErrors.email = 'Email không được quá 50 kí tự.'
        check++
      } else if (isEmailDuplicate(khachHang.email)) {
        newErrors.email = 'Email đã tồn tại trong danh sách.'
        check++
      } else {
        newErrors.email = ''
      }
    }

    if (!khachHang.phoneNumber) {
      newErrors.phoneNumber = 'Vui lòng nhập Số điện thoại.'
      check++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(khachHang.phoneNumber)) {
        newErrors.phoneNumber = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
        check++
      } else if (isPhoneNumberDuplicate(khachHang.phoneNumber)) {
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

    if (!khachHang.gender) {
      newErrors.gender = 'Vui lòng chọn Giới tính.'
      check++
    } else {
      newErrors.gender = ''
    }

    if (!selectedTinh) {
      newErrors.provinceId = 'Vui lòng chọn Tỉnh/Thành phố.'
      check++
    } else {
      newErrors.provinceId = ''
    }

    if (!selectedHuyen) {
      newErrors.districtId = 'Vui lòng chọn Quận/Huyện.'
      check++
    } else {
      newErrors.districtId = ''
    }

    if (!selectedXa) {
      newErrors.wardId = 'Vui lòng chọn Xã/Phường/Thị trấn.'
      check++
    } else {
      newErrors.wardId = ''
    }

    if (check > 0) {
      setErrors(newErrors)
      return
    }
    setConfirmClicked(true)
    const title = 'Xác nhận Thêm mới khách hàng?'
    const text = ''
    confirmSatus(title, text, theme).then((result) => {
      if (result.isConfirmed) {
        setLoading(true)
        khachHangApi
          .addKhachHang(khachHang)
          .then((response) => {
            let khachHangId = response.data.data.id
            const obj = {
              name: diaChi.name,
              phoneNumber: khachHang.phoneNumber,
              specificAddress:
                diaChi.specificAddress +
                ', ' +
                selectedXa.label +
                ', ' +
                selectedHuyen.label +
                ', ' +
                selectedTinh.label,
              type: true,
              idCustomer: khachHangId,
              provinceId: diaChi.provinceId,
              districtId: diaChi.districtId,
              wardId: diaChi.wardId,
            }
            DiaChiApi.add(obj).then(() => {
              toast.success('Thêm khách hàng thành công', {
                position: toast.POSITION.TOP_RIGHT,
              })
              navigate('/admin/customer')
            })
          })
          .finally(() => {
            setLoading(false)
          })
      }
    })
  }

  return (
    <div className="khachhangadd">
      <BreadcrumbsCustom nameHere={'Thêm khách hàng'} listLink={listBreadcrumbs} />
      <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2, width: '97%' }}>
        <Box sx={{ pt: 4 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <h3>Thông tin khách hàng</h3>
              <hr />
              <div
                onClick={() => {
                  document.getElementById('select-avatar').click()
                }}
                className="image-container">
                {image ? <img src={image} alt="Chọn ảnh" /> : 'Chọn ảnh'}
              </div>
              <input
                hidden
                id="select-avatar"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Typography>
                <span className="required"> *</span>Họ Và Tên
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                size="small"
                fullWidth
                onChange={(e) => {
                  setKhachHang({ ...khachHang, fullName: e.target.value })
                  updateDiaChi()
                  setErrors({ ...errors, fullName: '' })
                }}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
              />

              <FormControl sx={{ mt: 3 }} size="small">
                <Typography>
                  <span className="required"> *</span>Giới tính
                </Typography>
                <RadioGroup row value={khachHang.gender} onChange={handleGenderChange}>
                  <FormControlLabel
                    name="genderUpdate"
                    value="true"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    name="genderUpdate"
                    value="false"
                    control={<Radio />}
                    label="Nữ"
                  />
                </RadioGroup>
              </FormControl>
              <Typography variant="body2" color="error">
                {errors.gender}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <h3>Thông tin chi tiết</h3>
              <hr />
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography>
                    <span className="required"> *</span>Email
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    size="small"
                    fullWidth
                    onChange={(e) => {
                      setKhachHang({ ...khachHang, email: e.target.value.trim() })
                      updateDiaChi()
                      setErrors({ ...errors, email: '' })
                    }}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <span className="required"> *</span>Số điện thoại
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    size="small"
                    fullWidth
                    onChange={(e) => {
                      setKhachHang({ ...khachHang, phoneNumber: e.target.value.trim() })
                      updateDiaChi()
                      setErrors({ ...errors, phoneNumber: '' })
                    }}
                    error={Boolean(errors.phoneNumber)}
                    helperText={errors.phoneNumber}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Typography>
                    <span className="required"> *</span>Tỉnh/thành phố
                  </Typography>
                  <Box sx={{ minWidth: 120 }}>
                    <Autocomplete
                      clearIcon={null}
                      fullWidth
                      size="small"
                      className="search-field"
                      id="combo-box-demo"
                      value={selectedTinh}
                      onChange={handleTinhChange}
                      options={tinh.map((item) => ({
                        label: item.provinceName,
                        id: item.provinceID,
                      }))}
                      getOptionLabel={(options) => options.label}
                      renderInput={(params) => (
                        <TextField placeholder="nhập tên tỉnh" color="cam" {...params} />
                      )}
                    />
                  </Box>
                  <Typography variant="body2" color="error">
                    {errors.provinceId}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>
                    <span className="required"> *</span>Quận/huyện
                  </Typography>
                  <Box sx={{ minWidth: 120 }}>
                    <Autocomplete
                      clearIcon={null}
                      fullWidth
                      size="small"
                      className="search-field"
                      id="huyen-autocomplete"
                      value={selectedHuyen}
                      onChange={handleHuyenChange}
                      options={huyen.map((item) => ({
                        label: item.districtName,
                        id: item.districtID,
                      }))}
                      getOptionLabel={(options) => options.label}
                      renderInput={(params) => (
                        <TextField placeholder="nhập tên huyện" color="cam" {...params} />
                      )}
                    />
                  </Box>
                  <Typography variant="body2" color="error">
                    {errors.districtId}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>
                    <span className="required"> *</span>Xã/phường/thị trấn
                  </Typography>
                  <Box sx={{ minWidth: 120 }}>
                    <Autocomplete
                      clearIcon={null}
                      fullWidth
                      size="small"
                      className="search-field"
                      id="xa-autocomplete"
                      value={selectedXa}
                      onChange={handleXaChange}
                      options={xa.map((item) => ({ label: item.wardName, id: item.wardCode }))}
                      getOptionLabel={(options) => options.label}
                      renderInput={(params) => (
                        <TextField placeholder="nhập tên Xã" color="cam" {...params} />
                      )}
                    />
                  </Box>
                  <Typography variant="body2" color="error">
                    {errors.wardId}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography>
                    <span className="required"> *</span>Ngày sinh
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        format="DD-MM-YYYY"
                        sx={{ width: '100%' }}
                        className="small-datepicker"
                        onChange={(e) => {
                          setKhachHang({ ...khachHang, dateBirth: dayjs(e).format('DD-MM-YYYY') })
                          setErrors({ ...errors, dateBirth: '' })
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <Typography variant="body2" color="error">
                    {errors.dateBirth}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <span className="required"> *</span>Địa chỉ cụ thể
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    size="small"
                    fullWidth
                    onChange={(e) => {
                      setDiaChi({
                        ...diaChi,
                        specificAddress: e.target.value,
                      })
                      setErrors({ ...errors, specificAddress: '' })
                    }}
                    error={Boolean(errors.specificAddress)}
                    helperText={errors.specificAddress}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ pl: 10, pr: 10, mt: 3 }}>
            <Grid item xs={12}>
              {confirmClicked && loading && (
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
              <Button
                onClick={() => onSubmit(khachHang)}
                variant="outlined"
                color="cam"
                sx={{ float: 'right' }}
                disabled={loading}>
                {loading ? 'Đang thêm...' : 'Thêm mới'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  )
}
