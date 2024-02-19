import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  CircularProgress,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Box,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import confirmSatus from '../../components/comfirmSwal'
import DiaChiApi from '../../api/admin/khachhang/DiaChiApi'
import ghnAPI from '../../api/admin/ghn/ghnApi'
import informationApi from '../../api/admin/nhanvien/informationApi'

export default function AdminInformation() {
  const { id } = useParams()
  const [staffDetail, setStaffDetail] = useState({ code: '', avatar: null, gender: '', role: '' })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [diaChi, setDiaChi] = useState([])
  // eslint-disable-next-line
  const [initPage, setInitPage] = useState(1)
  const [tinh, setTinh] = useState([])
  const [huyen, setHuyen] = useState([])
  const [xa, setXa] = useState([])
  const [list, setList] = useState([])

  useEffect(() => {
    loadData(id)
    loadDiaChi(initPage - 1, id)
    loadTinh()
    loadList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initPage])

  const loadData = (id) => {
    setLoading(true)

    informationApi
      .getOne(id)
      .then((response) => {
        const formatDateBirth = dayjs(response.data.dateBirth).format('DD-MM-YYYY')
        setStaffDetail({
          ...response.data,
          dateBirth: formatDateBirth,
        })
      })
      .catch(() => {
        console.error('Error')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const loadList = () => {
    informationApi.getAll().then((response) => {
      setList(response.data)
    })
  }

  const handleGenderRadioChange = (event) => {
    setErrors({ ...errors, gender: '' })
    setStaffDetail({
      ...staffDetail,
      gender: event.target.value,
    })
  }

  const handleImageChange = (event) => {
    let file = event.target.files[0]
    if (file) {
      setStaffDetail({ ...staffDetail, avatar: file })
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const [errors, setErrors] = useState({
    fullName: '',
    name: '',
    email: '',
    phoneNumber: '',
    phoneNumberAd: '',
    dateBirth: '',
    gender: '',
    citizenId: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    specificAddress: '',
  })

  const isPhoneNumberDuplicate = (phoneNumber, currentId) => {
    return list.some(
      (customer) => customer.phoneNumber === phoneNumber && customer.id !== currentId,
    )
  }
  const isEmailDuplicate = (email, currentId) => {
    return list.some((customer) => customer.email === email && customer.id !== currentId)
  }
  const isCitizenIdDuplicate = (citizenId, currentId) => {
    return list.some((customer) => customer.citizenId === citizenId && customer.id !== currentId)
  }
  const handleButtonUpdateStaff = () => {
    const newErrors = {}
    const currentDate = dayjs()
    const dateBirth = dayjs(staffDetail.dateBirth, 'DD/MM/YYYY')
    const minBirthYear = 1900
    let check = 0

    if (!staffDetail.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập Họ và Tên.'
      check++
    } else if (staffDetail.fullName.trim().length > 100) {
      newErrors.fullName = 'Họ và Tên không được quá 100 kí tự.'
      check++
    } else if (staffDetail.fullName.trim().length < 5) {
      newErrors.fullName = 'Họ và Tên không được ít hơn 5 kí tự.'
      check++
    } else {
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
      if (specialCharsRegex.test(staffDetail.fullName)) {
        newErrors.fullName = 'Họ và Tên không được chứa kí tự đặc biệt.'
        check++
      } else {
        newErrors.fullName = ''
      }
    }

    if (!staffDetail.email.trim()) {
      newErrors.email = 'Vui lòng nhập Email.'
      check++
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      if (!emailRegex.test(staffDetail.email.trim())) {
        newErrors.email = 'Vui lòng nhập một địa chỉ email hợp lệ.'
        check++
      } else if (staffDetail.email.trim().length > 50) {
        newErrors.email = 'Email không được quá 50 kí tự.'
        check++
      } else if (isEmailDuplicate(staffDetail.email, staffDetail.id)) {
        newErrors.email = 'Email đã tồn tại trong danh sách.'
        check++
      } else {
        newErrors.email = ''
      }
    }

    if (!staffDetail.citizenId.trim()) {
      newErrors.citizenId = 'Vui lòng nhập Số CCCD.'
      check++
    } else {
      const citizenIdRegex = /^(?:\d{9}|\d{12})$/
      if (!citizenIdRegex.test(staffDetail.citizenId.trim())) {
        newErrors.citizenId = 'Số CCCD không hợp lệ.'
        check++
      } else if (isCitizenIdDuplicate(staffDetail.citizenId, staffDetail.id)) {
        newErrors.citizenId = 'CCCD đã tồn tại trong danh sách.'
        check++
      } else {
        newErrors.citizenId = ''
      }
    }

    if (!staffDetail.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập Số điện thoại.'
      check++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(staffDetail.phoneNumber.trim())) {
        newErrors.phoneNumber = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
        check++
      } else if (isPhoneNumberDuplicate(staffDetail.phoneNumber, staffDetail.id)) {
        newErrors.phoneNumber = 'Số điện thoại đã tồn tại trong danh sách.'
        check++
      } else {
        newErrors.phoneNumber = ''
      }
    }

    if (!staffDetail.dateBirth) {
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

    if (!detailDiaChi.name.trim()) {
      newErrors.name = 'Tên người nhận không được để trống'
      check++
    } else if (detailDiaChi.name.trim().length > 100) {
      newErrors.name = 'Tên người nhận không được quá 100 kí tự.'
      check++
    } else {
      newErrors.name = ''
    }

    if (!detailDiaChi.phoneNumber.trim()) {
      newErrors.phoneNumberAd = 'Vui lòng nhập Số điện thoại.'
      check++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(detailDiaChi.phoneNumber.trim())) {
        newErrors.phoneNumberAd = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
        check++
      } else {
        newErrors.phoneNumberAd = ''
      }
    }

    if (!tinhName) {
      newErrors.provinceId = 'Vui lòng chọn tỉnh.'
      check++
    }
    if (!huyenName) {
      newErrors.districtId = 'Vui lòng chọn huyện.'
      check++
    }
    if (!xaName) {
      newErrors.wardId = 'Vui lòng chọn xã.'
      check++
    }

    if (!detailDiaChi.specificAddress.trim()) {
      newErrors.specificAddress = 'Vui lòng nhập địa chỉ cụ thể.'
      check++
    } else if (detailDiaChi.specificAddress.trim().length > 225) {
      newErrors.specificAddress = 'Địa chỉ cụ thể không được quá 225 kí tự.'
      check++
    } else if (detailDiaChi.specificAddress.trim().length < 5) {
      newErrors.specificAddress = 'Địa chỉ cụ thể không được ít hơn 5 kí tự.'
      check++
    } else {
      newErrors.specificAddress = ''
    }

    if (check > 0) {
      setErrors(newErrors)
      return
    }

    const title = 'Xác nhận cập nhật thông tin?'
    const text = ''
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed) {
        informationApi
          .update(id, staffDetail)
          .then(() => {
            onUpdateDiaChi(detailDiaChi)
            toast.success('Cập nhật thông tin thành công!', {
              position: toast.POSITION.TOP_RIGHT,
            })
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
  const loadDiaChi = (initPage, idCustomer) => {
    DiaChiApi.getAll(initPage, idCustomer).then((response) => {
      setDiaChi(response.data.data.content)
      fillDetailDiaChi(response.data.data.content[0].id)
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

  const handleTinhChange = (_, newValue) => {
    setXa([])
    setDetailDiaChi({ ...detailDiaChi, districtId: '' })
    setHuyenName('')
    setDetailDiaChi({ ...detailDiaChi, wardId: '' })
    setXaName('')
    setErrors({ ...errors, provinceId: '' })
    if (newValue) {
      loadHuyen(newValue.id)
      setTinhName(newValue.label)
      setDetailDiaChi({ ...detailDiaChi, provinceId: newValue.id })
    } else {
      setHuyen([])
      setDetailDiaChi({ ...detailDiaChi, provinceId: '' })
    }
  }

  const handleHuyenChange = (_, newValue) => {
    setDetailDiaChi({ ...detailDiaChi, wardId: '' })
    setXaName('')
    setErrors({ ...errors, districtId: '' })
    if (newValue) {
      loadXa(newValue.id)
      setHuyenName(newValue.label)
      setDetailDiaChi({ ...detailDiaChi, districtId: newValue.id })
    } else {
      setXa([])
      setDetailDiaChi({ ...detailDiaChi, districtId: '' })
    }
  }

  const handleXaChange = (_, newValue) => {
    setErrors({ ...errors, wardId: '' })
    if (newValue) {
      setXaName(newValue.label)
      setDetailDiaChi({ ...detailDiaChi, wardId: newValue.id })
    } else {
      setDetailDiaChi({ ...detailDiaChi, wardId: '' })
    }
  }

  const [detailDiaChi, setDetailDiaChi] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    specificAddress: '',
    type: 0,
    idCustomer: id,
  })
  const [xaName, setXaName] = useState('')
  const [huyenName, setHuyenName] = useState('')
  const [tinhName, setTinhName] = useState('')

  const fillDetailDiaChi = (idDiaChi) => {
    DiaChiApi.getById(idDiaChi).then((response) => {
      const { name, email, phoneNumber, specificAddress, provinceId, districtId, wardId, type } =
        response.data.data

      loadTinh()
      loadHuyen(provinceId)
      loadXa(districtId)
      const addressParts = specificAddress.split(', ')
      if (addressParts.length === 4) {
        const [address, xaDetail, huyenDetail, tinhDetail] = addressParts
        setXaName(xaDetail)
        setHuyenName(huyenDetail)
        setTinhName(tinhDetail)

        setDetailDiaChi({
          id: idDiaChi,
          name: name,
          type: type,
          phoneNumber: phoneNumber,
          email: email,
          specificAddress: address,
          provinceId: provinceId,
          districtId: districtId,
          wardId: wardId,
        })
      }
    })
  }

  const onUpdateDiaChi = (detailDiaChi) => {
    detailDiaChi.specificAddress = `${detailDiaChi.specificAddress}, ${xaName}, ${huyenName}, ${tinhName}`

    DiaChiApi.update(detailDiaChi.id, detailDiaChi)
      .then(() => {
        loadDiaChi(initPage - 1, id)
      })
      .catch(() => {
        toast.error('Đã xảy ra lỗi khi cập nhật địa chỉ', {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }
  return (
    <div className="nhanvienadd">
      <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2, width: '97%' }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <h3>Thông tin cá nhân</h3>
            <hr />
            <div
              onClick={() => {
                document.getElementById('select-avatar').click()
              }}
              className="image-container">
              {staffDetail.avatar || image ? (
                <img
                  src={image || staffDetail.avatar}
                  alt="Ảnh cá  nhân"
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
            <Grid sx={{ mb: 3 }}>
              <TextField
                size="small"
                type="text"
                value={staffDetail.code || ''}
                onChange={(e) => {
                  setStaffDetail({
                    ...staffDetail,
                    code: e.target.value,
                  })
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ display: 'none' }}
              />
            </Grid>
            <Grid sx={{ mb: 3 }}>
              <Typography>
                <span className="required"> *</span>Họ và tên
              </Typography>
              <TextField
                size="small"
                type="text"
                value={staffDetail.fullName || ''}
                onChange={(e) => {
                  setStaffDetail({
                    ...staffDetail,
                    fullName: e.target.value,
                  })
                  setErrors({ ...errors, fullName: '' })
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid sx={{ mb: 3 }}>
              <Typography>
                <span className="required"> *</span>Số CCCD
              </Typography>
              <TextField
                size="small"
                type="text"
                value={staffDetail.citizenId || ''}
                onChange={(e) => {
                  setStaffDetail({
                    ...staffDetail,
                    citizenId: e.target.value,
                  })
                  setErrors({ ...errors, citizenId: '' })
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.citizenId)}
                helperText={errors.citizenId}
              />
            </Grid>
            <Grid sx={{ mb: 3 }}>
              <Typography>
                <span className="required"> *</span>Email
              </Typography>
              <TextField
                size="small"
                type="text"
                value={staffDetail.email || ''}
                onChange={(e) => {
                  setStaffDetail({
                    ...staffDetail,
                    email: e.target.value,
                  })
                  setErrors({ ...errors, email: '' })
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>
            <Grid sx={{ mb: 3 }}>
              <Typography>
                <span className="required"> *</span>Số Điện Thoại
              </Typography>
              <TextField
                type="text"
                size="small"
                value={staffDetail.phoneNumber || ''}
                onChange={(e) => {
                  setStaffDetail({
                    ...staffDetail,
                    phoneNumber: e.target.value,
                  })
                  setErrors({ ...errors, phoneNumber: '' })
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber}
              />
            </Grid>
            <Typography>
              <span className="required"> *</span>Ngày sinh
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD-MM-YYYY"
                className="small-datepicker"
                sx={{ width: '100%' }}
                value={dayjs(staffDetail.dateBirth, 'DD-MM-YYYY')}
                onChange={(e) => {
                  setStaffDetail({
                    ...staffDetail,
                    dateBirth: dayjs(e).format('DD-MM-YYYY'),
                  })
                  setErrors({ ...errors, dateBirth: '' })
                }}
              />
            </LocalizationProvider>
            <Typography variant="body2" color="error">
              {errors.dateBirth}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Typography>
                  <span className="required"> *</span>Giới tính
                </Typography>
                <FormControl size="small">
                  <RadioGroup
                    name="gender"
                    row
                    value={staffDetail.gender}
                    onChange={handleGenderRadioChange}>
                    <FormControlLabel value={true} control={<Radio />} label="Nam" />
                    <FormControlLabel value={false} control={<Radio />} label="Nữ" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <h3>Thông tin địa chỉ</h3>
            <hr />
            {diaChi.map((item, index) => (
              <div key={index} className="custom-accordion">
                <Accordion expanded={true}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}>
                    <Typography>Địa chỉ</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          <span className="required"> *</span>Tên
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          type="text"
                          size="small"
                          fullWidth
                          name="name"
                          value={detailDiaChi.name}
                          onChange={(e) => {
                            setDetailDiaChi({ ...detailDiaChi, name: e.target.value })
                          }}
                          error={Boolean(errors.name)}
                          helperText={errors.name}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                          value={detailDiaChi.phoneNumber}
                          onChange={(e) => {
                            setDetailDiaChi({ ...detailDiaChi, phoneNumber: e.target.value })
                          }}
                          error={Boolean(errors.phoneNumberAd)}
                          helperText={errors.phoneNumberAd}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ minWidth: 120 }}>
                          <Typography>
                            <span className="required"> *</span>Tỉnh/thành phố
                          </Typography>
                          <Autocomplete
                            clearIcon={null}
                            fullWidth
                            size="small"
                            className="search-field"
                            id="combo-box-demo"
                            value={{ label: tinhName, id: detailDiaChi.provinceId }}
                            onChange={handleTinhChange}
                            options={
                              tinh &&
                              tinh.map((item) => ({
                                label: item.provinceName,
                                id: item.provinceID,
                              }))
                            }
                            getOptionLabel={(options) => options.label}
                            renderInput={(params) => (
                              <TextField placeholder="nhập tên tỉnh" color="cam" {...params} />
                            )}
                          />
                          <Typography variant="body2" color="error">
                            {errors.provinceId}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ minWidth: 120 }}>
                          <Typography>
                            <span className="required"> *</span>Quận/huyện
                          </Typography>
                          <Autocomplete
                            clearIcon={null}
                            fullWidth
                            size="small"
                            className="search-field"
                            value={{ label: huyenName, id: detailDiaChi.districtId }}
                            onChange={handleHuyenChange}
                            options={
                              huyen &&
                              huyen.map((item) => ({
                                label: item.districtName,
                                id: item.districtID,
                              }))
                            }
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField placeholder="Chọn huyện" color="cam" {...params} />
                            )}
                          />
                          <Typography variant="body2" color="error">
                            {errors.districtId}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ minWidth: 120 }}>
                          <Typography>
                            <span className="required"> *</span>Xã/phường/thị trấn
                          </Typography>
                          <Autocomplete
                            clearIcon={null}
                            fullWidth
                            size="small"
                            className="search-field"
                            value={{ label: xaName, id: detailDiaChi.wardId }}
                            onChange={handleXaChange}
                            options={
                              xa && xa.map((item) => ({ label: item.wardName, id: item.wardCode }))
                            }
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField placeholder="Chọn xã" color="cam" {...params} />
                            )}
                          />
                          <Typography variant="body2" color="error">
                            {errors.wardId}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 3 }}>
                      <Grid item xs={12} md={12}>
                        <Typography>
                          <span className="required"> *</span>Địa chỉ cụ thể
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          type="text"
                          size="small"
                          fullWidth
                          name="specificAddress"
                          value={detailDiaChi.specificAddress}
                          onChange={(e) => {
                            const updatedDetailDiaChi = { ...detailDiaChi }
                            updatedDetailDiaChi.specificAddress = e.target.value
                            setDetailDiaChi(updatedDetailDiaChi)
                            setErrors({ ...errors, specificAddress: '' })
                          }}
                          error={Boolean(errors.specificAddress)}
                          helperText={errors.specificAddress}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={0.5}></Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={5}></Grid>
          <Grid item xs={3}>
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
              <Button onClick={handleButtonUpdateStaff} variant="outlined" fullWidth color="cam">
                {loading ? 'Đang cập nhật...' : 'Cập Nhật thông tin'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
