import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material'
import ghnAPI from '../../api/admin/ghn/ghnApi'
import DiaChiApi from '../../api/admin/khachhang/DiaChiApi'
import './ModalAddress.css'
import ClientAddressApi from '../../api/client/clientAddressApi'
import { toast } from 'react-toastify'
import confirmSatus from '../../components/comfirmSwal'
import AddIcon from '@mui/icons-material/Add'

const styleModalAddress = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '50vw', md: '45vw' },
  Height: '650px',
  bgcolor: 'white',
  borderRadius: '10px',
}
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

export default function ModalAddress({
  open,
  setOpen,
  setRequest,
  setPhiShip,
  listAddress,
  setSelectedTinh,
  setSelectedHuyen,
  setSelectedXa,
  loadTinh,
  loadHuyen,
  loadXa,
  loadListAd,
  arrData,
  iddcSelected,
  setiddcSelected,
  setTimeShip,
}) {
  const [initialSelectedAddress, setInitialSelectedAddress] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [updateModalOpen, setUpdateModalOpen] = React.useState(false)

  useEffect(() => {
    setInitialSelectedAddress(iddcSelected)
    setSelectedAddress(iddcSelected)
  }, [iddcSelected])

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

  const handleClose = () => {
    setUpdateModalOpen(false)
    setOpen(true)
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

  const handleRadioChange = (id) => {
    setSelectedAddress(id)
  }

  const handleUpdateType = (idDC) => {
    ClientAddressApi.updateStatus(idDC).then(() => {
      loadListAd()
      toast.success('Xét địa chỉ mặc định thành công thành công', {
        position: toast.POSITION.TOP_RIGHT,
      })
    })
  }

  const handleDetailDiaChi = (idDiaChi) => {
    setOpen(false)
    setiddcSelected(idDiaChi)
    DiaChiApi.getById(idDiaChi).then((response) => {
      const { idDiaChi, name, phoneNumber, specificAddress, provinceId, districtId, wardId } =
        response.data.data

      loadTinh()
      loadHuyen(provinceId)
      loadXa(districtId)

      const addressParts = specificAddress.split(', ')
      if (addressParts.length === 4) {
        const [address, xaDetail, huyenDetail, tinhDetail] = addressParts

        setSelectedTinh({ label: tinhDetail, id: provinceId })
        setSelectedHuyen({ label: huyenDetail, id: districtId })
        setSelectedXa({ label: xaDetail, id: wardId })

        setRequest({
          fullName: name,
          phone: phoneNumber,
          xa: xaDetail,
          huyen: huyenDetail,
          tinh: tinhDetail,
          address: address,
        })
        const filtelService = {
          shop_id: '3911708',
          from_district: '3440',
          to_district: districtId,
        }

        ghnAPI.getServiceId(filtelService).then((response) => {
          const serviceId = response.data.body.serviceId
          const filterTotal = {
            from_district_id: '3440',
            service_id: serviceId,
            to_district_id: districtId,
            to_ward_code: wardId,
            weight: arrData.reduce((totalWeight, e) => totalWeight + parseInt(e.weight), 0),
            insurance_value: '10000',
          }

          ghnAPI.getTotal(filterTotal).then((response) => {
            setPhiShip(response.data.body.total)

            const filtelTime = {
              from_district_id: '3440',
              from_ward_code: '13010',
              to_district_id: districtId,
              to_ward_code: wardId,
              service_id: serviceId,
            }
            ghnAPI.getime(filtelTime).then((response) => {
              setTimeShip(response.data.body.leadtime * 1000)
            })
          })
        })
      }
    })
  }

  const loadTinh1 = () => {
    ghnAPI.getProvince().then((response) => {
      setTinh(response.data)
    })
  }

  const loadHuyen1 = (idProvince) => {
    ghnAPI.getDistrict(idProvince).then((response) => {
      setHuyen(response.data)
    })
  }

  const loadXa1 = (idDistrict) => {
    ghnAPI.getWard(idDistrict).then((response) => {
      setXa(response.data)
    })
  }

  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedWard, setSelectedWard] = useState(null)
  const handleTinhChange = (_, newValue) => {
    setErrors({ ...errors, provinceId: '' })
    setSelectedProvince(newValue)
    setSelectedDistrict(null)
    setSelectedWard(null)
    if (newValue) {
      loadHuyen1(newValue.id)
      setDiaChi({ ...diaChi, provinceId: newValue.id })
      setErrors({ ...errors, provinceId: '' })
    } else {
      setHuyen([])
      setDiaChi({ ...diaChi, provinceId: null })
      setErrors({ ...errors, provinceId: 'Vui lòng chọn Tỉnh/Thành phố.' })
    }
  }

  const handleHuyenChange = (_, newValue) => {
    setErrors({ ...errors, districtId: '' })
    setSelectedDistrict(newValue)
    setSelectedWard(null)
    if (newValue) {
      loadXa1(newValue.id)
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
    setSelectedWard(newValue)
    setDiaChi({ ...diaChi, wardId: newValue?.id })
    setErrors({ ...errors, wardId: '' })
  }

  const handleConfirm = () => {
    if (selectedAddress !== iddcSelected) {
      handleDetailDiaChi(selectedAddress)
      setOpen(false)
    }
  }

  const handleModalClose = () => {
    setSelectedAddress(initialSelectedAddress)
    setOpen(false)
  }

  const handleUpdateDC = (address) => {
    setUpdateModalOpen(true)
    setOpen(false)
    loadTinh1()
    if (address !== null) {
      const { id, name, phoneNumber, specificAddress, provinceId, districtId, wardId, type } =
        address

      loadTinh1()
      loadHuyen1(provinceId)
      loadXa1(districtId)

      const addressParts = specificAddress.split(', ')
      if (addressParts.length === 4) {
        const [dcct, xaDetail, huyenDetail, tinhDetail] = addressParts
        setSelectedProvince({ label: tinhDetail, id: provinceId })
        setSelectedDistrict({ label: huyenDetail, id: districtId })
        setSelectedWard({ label: xaDetail, id: wardId })
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
  }

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
    setSelectedProvince(null)
    setSelectedDistrict(null)
    setSelectedWard(null)
  }

  const handleAddAddress = () => {
    resetAddressState()
    handleUpdateDC(null)
  }
  const onCreateDiaChi = () => {
    const newErrors = {}
    let check = 0

    if (!diaChi.name.trim()) {
      newErrors.fullName = 'Vui lòng nhập tên người nhận.'
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

    if (!selectedProvince) {
      newErrors.provinceId = 'Vui lòng chọn Tỉnh/Thành phố.'
      check++
    } else {
      newErrors.provinceId = ''
    }

    if (!selectedDistrict) {
      newErrors.districtId = 'Vui lòng chọn Quận/Huyện.'
      check++
    } else {
      newErrors.districtId = ''
    }

    if (!selectedWard) {
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
      provinceId: selectedProvince ? selectedProvince.id : diaChi.provinceId,
      districtId: selectedDistrict ? selectedDistrict.id : diaChi.districtId,
      wardId: selectedWard ? selectedWard.id : diaChi.wardId,
      specificAddress:
        diaChi.specificAddress +
        (selectedWard ? `, ${selectedWard.label}` : '') +
        (selectedDistrict ? `, ${selectedDistrict.label}` : '') +
        (selectedProvince ? `, ${selectedProvince.label}` : ''),
      type: diaChi.type === null ? 0 : diaChi.type,
    }
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed) {
        if (diaChi.id) {
          updatedDiaChi.specificAddress = `${diaChi.specificAddress}, ${selectedWard.label}, ${selectedDistrict.label}, ${selectedProvince.label}`
          ClientAddressApi.update(diaChi.id, updatedDiaChi).then(() => {
            toast.success('Cập nhật địa chỉ thành công', {
              position: toast.POSITION.TOP_RIGHT,
            })
            loadListAd()
            setOpen(true)
            handleClose()
          })
        } else {
          ClientAddressApi.add(updatedDiaChi).then(() => {
            toast.success('Thêm địa chỉ thành công', {
              position: toast.POSITION.TOP_RIGHT,
            })
            loadListAd()
            setOpen(true)
            handleClose()
          })
        }
      }
    })
  }

  return (
    <div className="client-modal-address">
      <Modal open={open} onClose={handleModalClose}>
        <Box sx={styleModalAddress}>
          <div>
            <p style={{ marginLeft: '20px' }} className="hs-user">
              Địa Chỉ của tôi
            </p>
            <hr />
          </div>
          <div style={{ overflow: 'auto', top: 0, maxHeight: '400px' }}>
            <Grid
              container
              spacing={2}
              sx={{ mb: 2, ml: 1, mr: 1, width: '97%', height: '65%' }}
              className="gird-dcco">
              {listAddress.map((item, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12} md={1}>
                    <label htmlFor={`address-${index}`}>
                      <input
                        type="radio"
                        style={{ marginTop: '35px' }}
                        id={`address-${index}`}
                        name="selectedAddress"
                        checked={selectedAddress === item.id}
                        onChange={() => handleRadioChange(item.id)}
                      />
                    </label>
                  </Grid>
                  <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                    <label htmlFor={`address-${index}`}>
                      <Typography className="title-ac-name">{item.name}</Typography>
                      <Typography className="title-ac-ps">{item.phoneNumber}</Typography>
                      <Typography className="title-ac-ps1">{item.specificAddress}</Typography>
                      {item.type === true ? <span className="mac-dinh-ac">Mặc định</span> : ''}
                    </label>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <div
                      className="btn-adr-ac"
                      style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          disabled={selectedAddress === item.id ? true : false}
                          className="btn-xoa-cn"
                          onClick={() => {
                            handleUpdateDC(item)
                          }}>
                          Cập nhật
                        </Button>
                      </div>
                      <Button
                        disabled={item.type === true}
                        className="btn-mac-dinh-ad"
                        onClick={() => handleUpdateType(item.id)}>
                        Thiết lập mặc định
                      </Button>
                    </div>
                  </Grid>
                  {index < listAddress.length - 1 && (
                    <Grid item xs={12}>
                      <Divider sx={{ mt: 2, mb: 2 }} />
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </Grid>
          </div>
          <div>
            <Button onClick={handleAddAddress} className="btn-adcck" startIcon={<AddIcon />}>
              Thêm địa chỉ
            </Button>
            <hr />
            <div style={{ marginBottom: '10px' }}>
              <Button className="btn-xnck" disabled={!selectedAddress} onClick={handleConfirm}>
                Xác Nhận
              </Button>
              <Button className="btn-huyckad" onClick={handleModalClose}>
                Hủy
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {updateModalOpen && (
        <Modal open={updateModalOpen} onClose={handleClose}>
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
                    value={selectedProvince}
                    onChange={handleTinhChange}
                    options={tinh.map((item) => ({
                      label: item.provinceName,
                      id: item.provinceID,
                    }))}
                    getOptionLabel={(options) => options.label}
                    renderInput={(params) => <TextField placeholder="nhập tên tỉnh" {...params} />}
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
                    value={selectedDistrict}
                    onChange={handleHuyenChange}
                    options={huyen.map((item) => ({
                      label: item.districtName,
                      id: item.districtID,
                    }))}
                    getOptionLabel={(options) => options.label}
                    renderInput={(params) => <TextField placeholder="nhập tên huyện" {...params} />}
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
                    value={selectedWard}
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
      )}
    </div>
  )
}
