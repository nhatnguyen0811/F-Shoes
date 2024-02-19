import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import ghnAPI from '../../../api/admin/ghn/ghnApi'
import dayjs from 'dayjs'
import { formatCurrency } from '../../../services/common/formatCurrency '
import { toast } from 'react-toastify'
import ClientAccountApi from '../../../api/client/clientAccount'

const styleAdBillModalUpdateAdd = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '70vw', md: '60vw' },
  bgcolor: 'white',
  borderRadius: 1.5,
  boxShadow: 24,
}

export default function ModalUpdateAddressBillClient({
  loading,
  open,
  setOPen,
  billDetail,
  listBillDetail,
}) {
  const [giaoHang, setGiaoHang] = useState()
  const [selectedTinh, setSelectedTinh] = useState(null)
  const [selectedHuyen, setSelectedHuyen] = useState(null)
  const [selectedXa, setSelectedXa] = useState(null)
  const [selectedTinhValue, setSelectedTinhValue] = useState(null)
  const [timeShip, setTimeShip] = useState('')
  const [phiShip, setPhiShip] = useState()
  const [diaChiCuThe, setDiaChiCuThe] = useState('')

  const [hdBillReq, setHdBillReq] = useState({
    fullName: billDetail ? billDetail.fullName : '',
    phoneNumber: billDetail ? billDetail.phoneNumber : '',
    address: billDetail ? billDetail.address : '',
    note: billDetail ? billDetail.note : '',
    noteBillHistory: 'Thay đổi  thông tin đơn hàng',
    desiredReceiptDate: new Date(),
    moneyShip: 0,
  })

  useEffect(() => {
    loadTinh()
    if (billDetail && billDetail.address) {
      const addressParts = billDetail.address.split(', ')
      if (addressParts.length === 4) {
        const [address, xaDetail, huyenDetail, tinhDetail] = addressParts
        setXaName(xaDetail)
        setHuyenName(huyenDetail)
        setTinhName(tinhDetail)
        setDiaChiCuThe(address)

        const tinhValue = tinh.find((item) => item.provinceName === tinhDetail)
        const huyenValue = huyen.find((item) => item.districtName === huyenDetail)
        const xaValue = xa.find((item) => item.wardName === xaDetail)

        if (tinhValue) {
          loadHuyen(tinhValue.provinceID)
        }

        setSelectedTinh(tinhValue)
        setSelectedHuyen(huyenValue)
        setSelectedXa(xaValue)
        console.log('tỉnh value:')
        console.log(tinhValue)
        setDetailDiaChi({
          ...detailDiaChi,
          specificAddress: address,
          provinceId: tinhValue ? tinhValue.id : null,
          districtId: huyenValue ? huyenValue.id : null,
          wardId: xaValue ? xaValue.id : null,
        })

        if (selectedTinhValue) {
          loadHuyen(selectedTinhValue.id)
          setSelectedTinh(selectedTinhValue)
        }
      }
    }
    billDetail ? setGiaoHang(billDetail.type === 1) : setGiaoHang(false)
    billDetail ? setPhiShip(billDetail.moneyShip) : setPhiShip(0)
    billDetail ? setTimeShip(billDetail.desiredReceiptDate) : setTimeShip(null)
    setHdBillReq({
      fullName: billDetail ? billDetail.recipientName : '',
      phoneNumber: billDetail ? billDetail.recipientPhoneNumber : '',
      address: billDetail ? billDetail.address : '',
      note: billDetail ? billDetail.note : '',
      noteBillHistory: 'Thay đổi  thông tin đơn hàng',
      desiredReceiptDate: billDetail ? billDetail.desiredReceiptDate : null,
      moneyShip: billDetail ? billDetail.moneyShip : 0,
    })
  }, [open, billDetail])

  const [tinh, setTinh] = useState([])
  const [huyen, setHuyen] = useState([])
  const [xa, setXa] = useState([])

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
    setSelectedTinh(newValue)
    setSelectedTinhValue(newValue)
    setSelectedHuyen(null)
    setHuyenName('')
    setSelectedXa(null)
    setXaName('')
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
    setSelectedHuyen(newValue)
    setSelectedXa(null)
    setXaName('')
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
    if (newValue) {
      setSelectedXa(newValue)
      setXaName(newValue.label)
      setDetailDiaChi({ ...detailDiaChi, wardId: newValue.id })
      const filtelService = {
        shop_id: '3911708',
        from_district: '3440',
        to_district: selectedHuyen.id,
      }

      ghnAPI.getServiceId(filtelService).then((response) => {
        const serviceId = response.data.body.serviceId
        const totalWeight = listBillDetail.reduce((acc, item) => acc + parseInt(item.weight), 0)
        const filterTotal = {
          from_district_id: '3440',
          service_id: serviceId,
          to_district_id: selectedHuyen.id,
          to_ward_code: newValue.id,
          weight: totalWeight,
          insurance_value: '10000',
        }
        ghnAPI.getTotal(filterTotal).then((response) => {
          setPhiShip(response.data.body.total)
          const moneyShip = response.data.body.total

          setHdBillReq((hdBillReq) => ({
            ...hdBillReq,
            moneyShip: moneyShip,
          }))
          const filtelTime = {
            from_district_id: '3440',
            from_ward_code: '13010',
            to_district_id: selectedHuyen.id,
            to_ward_code: newValue.id,
            service_id: serviceId,
          }
          ghnAPI.getime(filtelTime).then((response) => {
            setTimeShip(response.data.body.leadtime * 1000)
            const desiredReceiptDate = response.data.body.leadtime * 1000
            setHdBillReq((hdBillReq) => ({
              ...hdBillReq,
              desiredReceiptDate: desiredReceiptDate,
            }))
          })
        })
      })
    } else {
      setDetailDiaChi({ ...detailDiaChi, wardId: '' })
    }
  }

  const [errorsAA, setErrorsAA] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    specificAddress: '',
  })
  const confirmUpdateBill = () => {
    const newErrors = {}
    let checkAA = 0

    if (!hdBillReq.fullName.trim()) {
      newErrors.name = 'Tên người nhận không được để trống'
      checkAA++
    } else if (hdBillReq.fullName.trim().length > 100) {
      newErrors.name = 'Tên người nhận không được quá 100 kí tự.'
      checkAA++
    } else {
      newErrors.name = ''
    }

    if (!diaChiCuThe) {
      newErrors.specificAddress = 'Địa chỉ cụ thể không được để trống'
      checkAA++
    } else if (diaChiCuThe.trim().length > 225) {
      newErrors.specificAddress = 'Địa chỉ cụ thể không được quá 225 kí tự.'
      checkAA++
    } else {
      newErrors.specificAddress = ''
    }

    if (!hdBillReq.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập Số điện thoại.'
      checkAA++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(hdBillReq.phoneNumber.trim())) {
        newErrors.phoneNumber = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
        checkAA++
      } else {
        newErrors.phoneNumber = ''
      }
    }

    if (!tinhName) {
      newErrors.provinceId = 'Vui lòng chọn tỉnh'
      checkAA++
    }
    if (!huyenName) {
      newErrors.districtId = 'Vui lòng chọn huyện'
      checkAA++
    }
    if (!xaName) {
      newErrors.wardId = 'Vui lòng chọn xã'
      checkAA++
    }
    if (checkAA > 0) {
      setErrorsAA(newErrors)
      return
    }

    const diaChi = diaChiCuThe + ', ' + xaName + ', ' + huyenName + ', ' + tinhName
    hdBillReq.address = diaChi
    console.log(hdBillReq)
    ClientAccountApi.updateInfBill(billDetail.id, hdBillReq)
      .then(() => {
        loading(true)
        toast.success('Đã cập nhật thông tin đơn hàng', {
          position: toast.POSITION.TOP_RIGHT,
        })
        setOPen(false)
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API cập nhật thông tin đơn hàng: ', error)
      })
  }

  const [detailDiaChi, setDetailDiaChi] = useState({})
  const [xaName, setXaName] = useState('')
  const [huyenName, setHuyenName] = useState('')
  const [tinhName, setTinhName] = useState('')

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOPen(false)
        }}>
        <Paper sx={styleAdBillModalUpdateAdd}>
          <Toolbar>
            <Box
              sx={{
                color: 'black',
                flexGrow: 1,
              }}>
              <Typography variant="h6" component="div">
                Cập nhật thông tin
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setOPen(false)
              }}
              aria-label="close"
              color="error"
              style={{
                boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)',
              }}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Stack>
            <Box p={3} pt={0} pb={2}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    id="bill_full_name"
                    fullWidth
                    color="cam"
                    label="Tên người nhận"
                    size="small"
                    value={hdBillReq.fullName}
                    onChange={(event) => {
                      const newFullName = event.target.value
                      setHdBillReq({ ...hdBillReq, fullName: newFullName })
                    }}
                  />
                  <Typography variant="body2" color="error">
                    {errorsAA.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    color="cam"
                    variant="outlined"
                    label="Số điện thoại"
                    type="text"
                    size="small"
                    fullWidth
                    name="phoneNumber"
                    value={hdBillReq.phoneNumber}
                    onChange={(event) => {
                      const newPhoneNum = event.target.value
                      setHdBillReq({ ...hdBillReq, phoneNumber: newPhoneNum })
                    }}
                  />
                  <Typography variant="body2" color="error">
                    {errorsAA.phoneNumber}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={4}>
                  <Autocomplete
                    sx={{ mt: 1, width: '100%' }}
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
                      <TextField
                        placeholder="nhập tên tỉnh"
                        label="Tỉnh/thành phố"
                        color="cam"
                        {...params}
                      />
                    )}
                  />
                  <Typography variant="body2" color="error">
                    {errorsAA.provinceId}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    sx={{ mt: 1, width: '100%' }}
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
                      <TextField
                        placeholder="Chọn huyện"
                        label="Quận/huyện"
                        color="cam"
                        {...params}
                      />
                    )}
                  />
                  <Typography variant="body2" color="error">
                    {errorsAA.districtId}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Autocomplete
                    sx={{ mt: 1, width: '100%' }}
                    size="small"
                    className="search-field"
                    value={{ label: xaName, id: detailDiaChi.wardId }}
                    onChange={handleXaChange}
                    options={xa && xa.map((item) => ({ label: item.wardName, id: item.wardCode }))}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        placeholder="Chọn xã"
                        label="Xã/phường/thị trấn"
                        color="cam"
                        {...params}
                      />
                    )}
                  />
                  <Typography variant="body2" color="error">
                    {errorsAA.wardId}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    color="cam"
                    variant="outlined"
                    label="Địa chỉ cụ thể"
                    type="text"
                    size="small"
                    fullWidth
                    name="specificAddress"
                    value={diaChiCuThe}
                    onChange={(event) => setDiaChiCuThe(event.target.value)}
                  />
                  <Typography variant="body2" color="error">
                    {errorsAA.specificAddress}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="bill_note"
                    color="cam"
                    fullWidth
                    label="Ghi chú"
                    size="small"
                    value={hdBillReq.note}
                    onChange={(event) => {
                      const newNote = event.target.value
                      setHdBillReq({ ...hdBillReq, note: newNote })
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box display={'inline'} sx={{ marginLeft: 5 }}>
              <b>Giao hàng</b>
              <Switch
                onChange={() => {
                  setGiaoHang(!giaoHang)
                }}
                color="warning"
                checked={giaoHang}
                size="small"
              />
            </Box>
          </Stack>
          <Stack sx={{ padding: 6 }}>
            {giaoHang ? (
              <>
                <p>Thời gian giao hàng dự kiến: {dayjs(timeShip).format('DD-MM-YYYY')}</p>
                <p>Phí giao hàng: {formatCurrency(phiShip)}</p>
              </>
            ) : (
              <>
                <p style={{ color: '#999', fontStyle: 'italic' }}>
                  Thời gian giao hàng dự kiến: N/A
                </p>
                <p style={{ color: '#999', fontStyle: 'italic' }}>Phí giao hàng: N/A</p>
              </>
            )}
          </Stack>
          <Stack sx={{ margin: 2 }}>
            <Button
              variant="outlined"
              className="them-moi"
              color="cam"
              onClick={() => confirmUpdateBill()}>
              Xác nhận
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </>
  )
}
