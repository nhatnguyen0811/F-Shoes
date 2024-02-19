import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import './AddressUser.css'
import ClientAddressApi from '../../../api/client/clientAddressApi'
import { toast } from 'react-toastify'
import confirmSatus from '../../../components/comfirmSwal'
import ghnAPI from '../../../api/admin/ghn/ghnApi'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
}
export default function AddressUser() {
  const [listDiaChi, setListDiaChi] = useState([])
  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
    setErrors({
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
  }

  const [tinh, setTinh] = useState([])
  const [huyen, setHuyen] = useState([])
  const [xa, setXa] = useState([])

  const [diaChi, setDiaChi] = useState({
    name: '',
    phoneNumber: '',
    specificAddress: '',
    type: false,
    provinceId: null,
    districtId: null,
    wardId: null,
  })

  const handleOpen = (address) => {
    if (address !== null) {
      const { id, name, phoneNumber, specificAddress, provinceId, districtId, wardId, type } =
        address

      loadTinh()
      loadHuyen(provinceId)
      loadXa(districtId)

      const addressParts = specificAddress.split(', ')
      if (addressParts.length === 4) {
        const [dcct, xaDetail, huyenDetail, tinhDetail] = addressParts
        setSelectedTinh({ label: tinhDetail, id: provinceId })
        setSelectedHuyen({ label: huyenDetail, id: districtId })
        setSelectedXa({ label: xaDetail, id: wardId })
        setDiaChi((prev) => ({
          ...prev,
          id: id,
          name: name,
          phoneNumber: phoneNumber,
          specificAddress: dcct,
          provinceId: provinceId,
          districtId: districtId,
          wardId: wardId,
          type: type,
        }))
      }
    }
    setOpen(true)
  }
  const handleAddAddress = () => {
    resetAddressState()
    handleOpen(null)
  }

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
    loadDiaChi()
  }, [])

  const resetAddressState = () => {
    setDiaChi({
      name: '',
      phoneNumber: '',
      specificAddress: '',
      type: false,
      provinceId: null,
      districtId: null,
      wardId: null,
    })

    setErrors({
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
    setSelectedTinh(null)
    setSelectedHuyen(null)
    setSelectedXa(null)
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

  const loadDiaChi = () => {
    ClientAddressApi.getAll(0).then((response) => {
      setListDiaChi(response.data.data.content)
    })
  }

  const handleUpdateType = (idDC) => {
    ClientAddressApi.updateStatus(idDC).then(() => {
      loadDiaChi()
      toast.success('Xét địa chỉ mặc định thành công thành công', {
        position: toast.POSITION.TOP_RIGHT,
      })
    })
  }

  const onCreateDiaChi = () => {
    const newErrors = {}
    let check = 0

    if (!diaChi.name) {
      newErrors.fullName = 'Vui lòng nhập Họ và Tên.'
      check++
    } else if (diaChi.name.length > 100) {
      newErrors.fullName = 'Họ và Tên không được quá 100 kí tự.'
      check++
    } else {
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
      if (specialCharsRegex.test(diaChi.name)) {
        newErrors.fullName = 'Họ và Tên không được chứa kí tự đặc biệt.'
        check++
      } else {
        newErrors.fullName = ''
      }
    }

    if (!diaChi.specificAddress.trim()) {
      newErrors.specificAddress = 'Vui lòng nhập địa chỉ cụ thể.'
      check++
    } else if (diaChi.specificAddress.length > 225) {
      newErrors.specificAddress = 'Địa chỉ không được quá 225 kí tự.'
      check++
    } else {
      newErrors.specificAddress = ''
    }

    if (!diaChi.phoneNumber) {
      newErrors.phoneNumber = 'Vui lòng nhập Số điện thoại.'
      check++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(diaChi.phoneNumber)) {
        newErrors.phoneNumber = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
        check++
      } else {
        newErrors.phoneNumber = ''
      }
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
    const title = diaChi.id ? 'Xác nhận Cập nhật địa chỉ?' : 'Xác nhận Thêm mới địa chỉ?'
    const text = ''

    const updatedDiaChi = {
      name: diaChi.name,
      phoneNumber: diaChi.phoneNumber,
      email: diaChi.email,
      provinceId: selectedTinh ? selectedTinh.id : diaChi.provinceId,
      districtId: selectedHuyen ? selectedHuyen.id : diaChi.districtId,
      wardId: selectedXa ? selectedXa.id : diaChi.wardId,
      specificAddress:
        diaChi.specificAddress +
        (selectedXa ? `, ${selectedXa.label}` : '') +
        (selectedHuyen ? `, ${selectedHuyen.label}` : '') +
        (selectedTinh ? `, ${selectedTinh.label}` : ''),
      type: diaChi.type === null ? 0 : diaChi.type,
    }
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed) {
        if (diaChi.id) {
          updatedDiaChi.specificAddress = `${diaChi.specificAddress}, ${selectedXa.label}, ${selectedHuyen.label}, ${selectedTinh.label}`
          ClientAddressApi.update(diaChi.id, updatedDiaChi).then(() => {
            toast.success('Cập nhật địa chỉ thành công', {
              position: toast.POSITION.TOP_RIGHT,
            })
            loadDiaChi(0)
            handleClose()
          })
        } else {
          ClientAddressApi.add(updatedDiaChi).then(() => {
            toast.success('Thêm địa chỉ thành công', {
              position: toast.POSITION.TOP_RIGHT,
            })
            loadDiaChi(0)
            handleClose()
          })
        }
      }
    })
  }

  const deleteDiaChi = (idDC) => {
    const title = 'Xác nhận xóa địa chỉ?'
    const text = ''
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed) {
        ClientAddressApi.delete(idDC).then(() => {
          loadDiaChi(0)
          toast.success('xóa địa chỉ thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
        })
      }
    })
  }
  return (
    <div>
      <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2, width: '97%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="hs-user">Địa Chỉ của tôi</p>
          <Button onClick={handleAddAddress} className="btn-xnck" startIcon={<AddIcon />}>
            Thêm địa chỉ
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
              <p className="hs-user">{diaChi.id ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}</p>
              <hr />
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
                    value={diaChi.name}
                    onChange={(e) => {
                      setDiaChi({ ...diaChi, name: e.target.value })
                      setErrors({ ...errors, fullName: '' })
                    }}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName}
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
                    value={diaChi.phoneNumber}
                    onChange={(e) => {
                      setDiaChi({ ...diaChi, phoneNumber: e.target.value.trim() })
                      setErrors({ ...errors, phoneNumber: '' })
                    }}
                    error={Boolean(errors.phoneNumber)}
                    helperText={errors.phoneNumber}
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
                      value={selectedTinh}
                      onChange={handleTinhChange}
                      options={tinh.map((item) => ({
                        label: item.provinceName,
                        id: item.provinceID,
                      }))}
                      getOptionLabel={(options) => options.label}
                      renderInput={(params) => (
                        <TextField placeholder="nhập tên tỉnh" {...params} />
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
                      id="huyen-autocomplete"
                      value={selectedHuyen}
                      onChange={handleHuyenChange}
                      options={huyen.map((item) => ({
                        label: item.districtName,
                        id: item.districtID,
                      }))}
                      getOptionLabel={(options) => options.label}
                      renderInput={(params) => (
                        <TextField placeholder="nhập tên huyện" {...params} />
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
                      id="xa-autocomplete"
                      value={selectedXa}
                      onChange={handleXaChange}
                      options={xa.map((item) => ({ label: item.wardName, id: item.wardCode }))}
                      getOptionLabel={(options) => options.label}
                      renderInput={(params) => <TextField placeholder="nhập tên Xã" {...params} />}
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
                    value={diaChi.specificAddress}
                    fullWidth
                    onChange={(e) => {
                      const updatedDiaChi = { ...diaChi }
                      updatedDiaChi.specificAddress = e.target.value
                      setDiaChi(updatedDiaChi)
                      setErrors({ ...errors, specificAddress: '' })
                    }}
                    error={Boolean(errors.specificAddress)}
                    helperText={errors.specificAddress}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                  <Button onClick={onCreateDiaChi} className="btn-xnck" sx={{ float: 'right' }}>
                    Hoàn tất
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </div>
        <hr />
        <p className="hs-user">Địa Chỉ</p>
        <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
          {listDiaChi.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} md={7}>
                <Typography className="title-ac-name">{item.name}</Typography>
                <Typography className="title-ac-ps">{item.phoneNumber}</Typography>
                <Typography className="title-ac-ps1">{item.specificAddress}</Typography>
                {item.type === true ? <span class="mac-dinh-ac">Mặc định</span> : ''}
              </Grid>
              <Grid item xs={12} md={5}>
                <div className="btn-adr-ac" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      onClick={() => {
                        handleOpen(item)
                      }}
                      className="btn-xoa-cn">
                      Cập nhật
                    </Button>
                    {item.type !== true ? (
                      <Button onClick={() => deleteDiaChi(item.id)} className="btn-xoa-cn">
                        Xóa
                      </Button>
                    ) : null}
                  </div>
                  <Button
                    onClick={() => handleUpdateType(item.id)}
                    disabled={item.type === true}
                    className="btn-mac-dinh-ad">
                    Thiết lập mặc định
                  </Button>
                </div>
              </Grid>
              {index < listDiaChi.length - 1 && (
                <Grid item xs={12}>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </div>
  )
}
