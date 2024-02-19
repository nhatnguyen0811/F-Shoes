import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Divider,
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
import hoaDonApi from '../../../api/admin/hoadon/hoaDonApi'
import { toast } from 'react-toastify'
import DiaChiApi from '../../../api/admin/khachhang/DiaChiApi'

const styleModalAddress = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '50vw', md: '45vw' },
  height: '650px',
  bgcolor: 'white',
  borderRadius: '10px',
}

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

export default function ModalAdBillUpdateAddress({
  open,
  setOPen,
  billDetail,
  listBillDetail,
  load,
  setDetailDiaChi,
  detailDiaChi,
}) {
  const [giaoHang, setGiaoHang] = useState()
  const [selectedTinh, setSelectedTinh] = useState(null)
  const [selectedHuyen, setSelectedHuyen] = useState(null)
  const [selectedXa, setSelectedXa] = useState(null)
  const [selectedTinhValue, setSelectedTinhValue] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [timeShip, setTimeShip] = useState('')
  const [phiShip, setPhiShip] = useState()
  const [listDiaChiDetail, setListDiaChiDetail] = useState([])
  const [iddcSelected, setiddcSelected] = useState('')
  const [diaChiCuThe, setDiaChiCuThe] = useState('')
  const [isShowDiaChi, setIsShowDiaChi] = useState(false)
  const [errorsAA, setErrorsAA] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    specificAddress: '',
  })

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
    billDetail ? setGiaoHang(billDetail.receivingMethod === 1) : setGiaoHang(false)
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

  const loadDiaChi = () => {
    DiaChiApi.getAll(0, billDetail.idCustomer).then((response) => {
      setListDiaChiDetail(response.data.data.content)
    })
  }
  const handleRadioChange = (id) => {
    setSelectedAddress(id)
  }

  const handleTinhChange = (_, newValue) => {
    setSelectedTinh(newValue)
    setSelectedTinhValue(newValue)
    setSelectedHuyen(null)
    setHuyenName('')
    setSelectedXa(null)
    setXaName('')
    setXa([])
    setErrorsAA({ ...errorsAA, provinceId: '' })
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
    setErrorsAA({ ...errorsAA, districtId: '' })
    if (newValue) {
      loadXa(newValue.id)
      setHuyenName(newValue.label)
      setDetailDiaChi({ ...detailDiaChi, districtId: newValue.id })
    } else {
      setXa([])
      setDetailDiaChi({ ...detailDiaChi, districtId: '' })
    }
  }
  const handleDetailDiaChi = (idDiaChi) => {
    setiddcSelected(idDiaChi)
    DiaChiApi.getById(idDiaChi).then((response) => {
      const { name, phoneNumber, specificAddress, provinceId, districtId, wardId } =
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
        setDetailDiaChi({
          ...detailDiaChi,
          specificAddress: address,
          provinceId: tinhValue ? tinhValue.id : null,
          districtId: huyenValue ? huyenValue.id : null,
          wardId: xaValue ? xaValue.id : null,
        })
        const filtelService = {
          shop_id: '3911708',
          from_district: '3440',
          to_district: districtId,
        }

        ghnAPI.getServiceId(filtelService).then((response) => {
          const serviceId = response.data.body.serviceId
          const totalWeight = listBillDetail.reduce((acc, item) => acc + parseInt(item.weight), 0)
          const filterTotal = {
            from_district_id: '3440',
            service_id: serviceId,
            to_district_id: districtId,
            to_ward_code: wardId,
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
              to_district_id: districtId,
              to_ward_code: wardId,
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

        setHdBillReq({
          ...hdBillReq,
          fullName: name ? name : null,
          phoneNumber: phoneNumber ? phoneNumber : null,
        })
      }
    })
  }
  const handleConfirm = () => {
    if (selectedAddress !== iddcSelected) {
      handleDetailDiaChi(selectedAddress)
      setIsShowDiaChi(false)
    }
  }

  const handleXaChange = (_, newValue) => {
    setErrorsAA({ ...errorsAA, wardId: '' })
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
    hoaDonApi
      .update(billDetail.id, hdBillReq)
      .then(() => {
        toast.success('Đã cập nhật thông tin đơn hàng', {
          position: toast.POSITION.TOP_RIGHT,
        })
        load(true)
        setOPen(false)
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API cập nhật thông tin đơn hàng: ', error)
      })
  }

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
            <div style={{ flexShrink: 0 }}>
              <Button
                variant="outlined"
                className="them-moi"
                color="cam"
                style={{
                  marginLeft: 'auto',
                  marginRight: '25px',
                  alignSelf: 'flex-end',
                  marginBottom: '10px',
                }}
                onClick={() => {
                  loadDiaChi()
                  setIsShowDiaChi(true)
                  setSelectedAddress(iddcSelected)
                }}>
                Chọn địa chỉ
              </Button>
              <Modal
                open={isShowDiaChi}
                onClose={() => {
                  setIsShowDiaChi(false)
                }}>
                <Box sx={styleModalAddress}>
                  <p style={{ marginLeft: '20px' }} className="hs-user">
                    Địa Chỉ của {billDetail.fullName}
                  </p>
                  <hr />
                  <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2, ml: 1, mr: 1, width: '97%', height: '65%' }}
                    className="gird-dcco">
                    {listDiaChiDetail.map((item, index) => (
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
                            {item.type === true ? (
                              <span className="mac-dinh-ac">Mặc định</span>
                            ) : (
                              ''
                            )}
                          </label>
                        </Grid>
                        {index < listDiaChiDetail.length - 1 && (
                          <Grid item xs={12}>
                            <Divider sx={{ mt: 2, mb: 2 }} />
                          </Grid>
                        )}
                      </React.Fragment>
                    ))}
                  </Grid>
                  <hr />
                  <div className="btn-adck">
                    <Button
                      className="btn-xnck"
                      disabled={!selectedAddress}
                      onClick={handleConfirm}>
                      Xác Nhận
                    </Button>
                    <Button className="btn-huyckad" onClick={() => setIsShowDiaChi(false)}>
                      Hủy
                    </Button>
                  </div>
                </Box>
              </Modal>
            </div>
          </div>
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
                      setErrorsAA({ ...errorsAA, name: '' })
                    }}
                    error={Boolean(errorsAA.name)}
                    helperText={errorsAA.name}
                  />
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
                      setErrorsAA({ ...errorsAA, phoneNumber: '' })
                    }}
                    error={Boolean(errorsAA.phoneNumber)}
                    helperText={errorsAA.phoneNumber}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={4}>
                  <Autocomplete
                    clearIcon={null}
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
                    clearIcon={null}
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
                    clearIcon={null}
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
                    onChange={(event) => {
                      setDiaChiCuThe(event.target.value)
                      setErrorsAA({ ...errorsAA, specificAddress: '' })
                    }}
                    error={Boolean(errorsAA.specificAddress)}
                    helperText={errorsAA.specificAddress}
                  />
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
