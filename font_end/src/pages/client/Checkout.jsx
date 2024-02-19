import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import ghnAPI from '../../api/admin/ghn/ghnApi'
import './Checkout.css'
import { useDispatch, useSelector } from 'react-redux'
import { GetCheckout, setCheckout } from '../../services/slices/checkoutSlice'
import { Link, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import clientCheckoutApi from '../../api/client/clientCheckoutApi'
import { toast } from 'react-toastify'
import confirmSatus from '../../components/comfirmSwal'
import { removeCart } from '../../services/slices/cartSlice'
import ModalVoucher from './ModalVoucher'
import ModalAddress from './ModalAddress'
import { setLoading } from '../../services/slices/loadingSlice'
import ClientAddressApi from '../../api/client/clientAddressApi'
import { GetUser } from '../../services/slices/userSlice'
import ReplyIcon from '@mui/icons-material/Reply'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import clientCartApi from '../../api/client/clientCartApi'
import { socketUrl } from '../../services/url'
import checkStartApi from '../../api/checkStartApi'

var stompClient = null
export default function Checkout() {
  const userLogin = useSelector(GetUser)
  const [request, setRequest] = useState({
    fullName: '',
    email: '',
    phone: '',
    tinh: '',
    provinceId: '',
    huyen: '',
    districtId: '',
    xa: '',
    wardId: '',
    address: '',
    note: '',
    typePayment: '',
    idVoucher: '',
    moneyReduced: '',
    shipMoney: '',
    totalMoney: '',
    duKien: '',
    billDetail: [],
  })
  useEffect(() => {
    if (userLogin) {
      setRequest({ ...request, email: userLogin.email })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogin])
  const [tinh, setTinh] = useState([])
  const [huyen, setHuyen] = useState([])
  const [xa, setXa] = useState([])
  const [isShowDiaChi, setIsShowDiaChi] = useState(false)
  const [listAddress, setListAddress] = useState([])
  const [openModalVoucher, setOpenModalVoucher] = useState(false)
  const [promotionByProductDetail, setGromotionByProductDetail] = useState([])

  const [voucher, setVoucher] = useState(null)
  const [voucherFilter, setVoucherFilter] = useState({
    idCustomer: null,
    condition: 0,
    page: 1,
    size: 5,
  })

  const loadDetailAddress = () => {
    ClientAddressApi.getDefault().then((response) => {
      if (response.data.data !== null) {
        const { id, name, phoneNumber, specificAddress, provinceId, districtId, wardId } =
          response.data.data

        loadTinh()
        loadHuyen(provinceId)
        loadXa(districtId)
        setiddcSelected(id)

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
      }
    })
  }

  const loadListAd = () => {
    ClientAddressApi.getAll(0).then((response) => {
      setListAddress(response.data.data.content)
    })
  }

  const navigate = useNavigate()

  const arrData = useSelector(GetCheckout)

  const product = useSelector(GetCheckout)

  const productIds = product.map((cart) => cart.id)

  const getPromotionProductDetails = (id) => {
    clientCartApi.getPromotionByProductDetail(id).then((response) => {
      setGromotionByProductDetail(response.data.data)
      console.log(response.data.data)
    })
  }

  useEffect(() => {
    if (arrData.length === 0) {
      navigate('/cart')
      return
    }
    loadDetailAddress()
    loadTinh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, arrData])

  useEffect(() => {
    if (productIds.length === 0) {
      navigate('/cart')
      return
    }
    getPromotionProductDetails(productIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  const [selectedHuyen, setSelectedHuyen] = useState(null)
  const [selectedXa, setSelectedXa] = useState(null)
  const [giamGia, setGiamGia] = useState('')
  const [timeShip, setTimeShip] = useState('')
  const [phiShip, setPhiShip] = useState('')
  const [iddcSelected, setiddcSelected] = useState('')
  const dispatch = useDispatch()

  const handleTinhChange = (_, newValue) => {
    setErrors({ ...errors, provinceId: '' })
    setSelectedTinh(newValue)
    setSelectedHuyen(null)
    setSelectedXa(null)
    setXa([])
    setRequest({ ...request, tinh: newValue.label, provinceId: newValue.id })
    if (newValue) {
      loadHuyen(newValue.id)
    } else {
      setHuyen([])
    }
  }

  const handleHuyenChange = (_, newValue) => {
    setErrors({ ...errors, districtId: '' })
    setSelectedHuyen(newValue)
    setSelectedXa(null)
    setRequest({ ...request, huyen: newValue.label, districtId: newValue.id })
    if (newValue) {
      loadXa(newValue.id)
    } else {
      setXa([])
    }
  }
  const handleXaChange = (_, newValue) => {
    setErrors({ ...errors, wardId: '' })
    setSelectedXa(newValue)
    setRequest({ ...request, xa: newValue.label, wardId: newValue.id })
    const filtelService = {
      shop_id: '3911708',
      from_district: '3440',
      to_district: selectedHuyen.id,
    }

    ghnAPI.getServiceId(filtelService).then((response) => {
      const serviceId = response.data.body.serviceId
      const filterTotal = {
        from_district_id: '3440',
        service_id: serviceId,
        to_district_id: selectedHuyen.id,
        to_ward_code: newValue.id,
        weight: arrData.reduce((totalWeight, e) => totalWeight + parseInt(e.weight), 0),
        insurance_value: '10000',
      }

      ghnAPI.getTotal(filterTotal).then((response) => {
        setPhiShip(response.data.body.total)

        const filtelTime = {
          from_district_id: '3440',
          from_ward_code: '13010',
          to_district_id: selectedHuyen.id,
          to_ward_code: newValue.id,
          service_id: serviceId,
        }
        ghnAPI.getime(filtelTime).then((response) => {
          setTimeShip(response.data.body.leadtime * 1000)
        })
      })
    })
  }

  const [selectedValue, setSelectedValue] = useState('0')

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value)
  }
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    address: '',
  })
  function renderRawPrice(cart, promotionByProductDetail) {
    return <div style={{ color: 'red' }}>{`${cart.gia} `}</div>
  }

  async function finishCheckout() {
    const newErrors = {}
    let check = 0

    if (!userLogin) {
      if (!request.email) {
        newErrors.email = 'Vui lòng nhập Email.'
        check++
      } else {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        if (!emailRegex.test(request.email)) {
          newErrors.email = 'Vui lòng nhập một địa chỉ email hợp lệ.'
          check++
        } else if (request.email.length > 50) {
          newErrors.email = 'Email không được quá 50 kí tự.'
          check++
        } else {
          newErrors.email = ''
        }
      }
    }
    if (!request.fullName) {
      newErrors.fullName = 'Vui lòng nhập Họ và Tên.'
      check++
    } else if (request.fullName.length > 100) {
      newErrors.fullName = 'Họ và Tên không được quá 100 kí tự.'
      check++
    } else {
      newErrors.fullName = ''
    }

    if (!request.phone) {
      newErrors.phone = 'Vui lòng nhập Số điện thoại.'
      check++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(request.phone)) {
        newErrors.phone = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
        check++
      } else {
        newErrors.phone = ''
      }
    }

    if (!request.address) {
      newErrors.address = 'Vui lòng nhập địa chỉ.'
      check++
    } else if (request.address.length > 255) {
      newErrors.address = 'Địa chỉ không được quá 255 kí tự.'
      check++
    } else {
      newErrors.address = ''
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
    if (arrData) {
      let allProductsAvailable = true

      for (const e of arrData) {
        const check = (await checkStartApi.checkQuantiy(e.id, e.soLuong)).data

        if (!check) {
          allProductsAvailable = false
          break
        }
      }

      if (!allProductsAvailable) {
        navigate('/cart')
        toast.warning('Có sản phẩm đã hết hàng, vui lòng chọn lại!')
        return
      }
    }

    const title = 'Xác nhận đặt hàng?'
    confirmSatus(title, '').then((result) => {
      if (result.isConfirmed) {
        const preRequest = {
          ...request,
          shipMoney:
            arrData.reduce((total, cart) => {
              const productTotal = calculateProductTotalPayment(cart, promotionByProductDetail) || 0
              return total + productTotal
            }, 0) -
              giamGia <
            1000000
              ? phiShip
              : 0,
          duKien: timeShip,
          totalMoney: arrData.reduce(
            (total, cart) => total + calculateProductTotalPayment(cart, promotionByProductDetail),
            0,
          ),
          billDetail: arrData.map((product) => {
            return {
              nameProduct: product.name + ' - ' + product.size,
              idProduct: product.id,
              quantity: product.soLuong,
              price: calculateProductTotalPaymentBillDetail(product, promotionByProductDetail),
            }
          }),
          idVoucher: voucher === null ? null : voucher.id,
          moneyReduced: giamGia ? giamGia : '0',
          typePayment: selectedValue,
          email: userLogin ? userLogin.email : request.email,
        }

        if (selectedValue === '0') {
          dispatch(setLoading(true))
          clientCheckoutApi
            .datHang({ ...preRequest, status: 1 })
            .then((response) => {
              if (response.data.success) {
                arrData.forEach((e) => {
                  dispatch(removeCart(e))
                })
                toast.success('Đặt hàng thành công')
                navigate('/home')
              }
            })
            .finally(() => {
              dispatch(setLoading(false))
            })
        } else {
          dispatch(setLoading(true))
          clientCheckoutApi
            .submitOrder({ ...preRequest, status: 8 })
            .then((response) => {
              window.location.href = response.data
            })
            .finally(() => {
              dispatch(setLoading(false))
            })
        }
      }
    })
  }

  const handleFilterVoucher = () => {
    setVoucherFilter({
      ...voucherFilter,
      condition: arrData.reduce((tong, e) => tong + e.gia * e.soLuong, 0),
    })
    setOpenModalVoucher(true)
  }

  useEffect(() => {
    const socket = new SockJS(socketUrl)
    stompClient = Stomp.over(socket)
    stompClient.debug = () => {}
    stompClient.connect({}, onConnect)

    return () => {
      stompClient.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrData])

  const onConnect = () => {
    stompClient.subscribe('/topic/realtime-san-pham-checkout', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeProductCart(data)
      }
    })
  }

  function updateRealTimeProductCart(data) {
    const preProduct = [...arrData]
    const index = preProduct.findIndex((p) => p.id === data.id)
    const sl = preProduct[index].soLuong
    if (index !== -1) {
      preProduct[index] = { ...data, gia: data.price, soLuong: sl, image: data.image.split(',') }
      dispatch(setCheckout(preProduct))
    }
  }

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
  }

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * originalPrice
    const discountedPrice = originalPrice - discountAmount
    return discountedPrice
  }

  function calculateProductTotalPayment(cart, promotionByProductDetail) {
    const isDiscounted = promotionByProductDetail.some(
      (item) => item.idProductDetail === cart.id && item.value,
    )

    if (isDiscounted) {
      const discountedPrice = promotionByProductDetail
        .filter((item) => item.idProductDetail === cart.id && item.value)
        .map((item) => cart.soLuong * calculateDiscountedPrice(cart.gia, item.value))
        .reduce((total, price) => total + price, 0)
      console.log('')
      return discountedPrice
    } else {
      return cart.soLuong * cart.gia
    }
  }
  function calculateProductTotalPaymentBillDetail(cart, promotionByProductDetail) {
    const isDiscounted = promotionByProductDetail.some(
      (item) => item.idProductDetail === cart.id && item.value,
    )

    if (isDiscounted) {
      const discountedPrice = promotionByProductDetail
        .filter((item) => item.idProductDetail === cart.id && item.value)
        .map((item) => calculateDiscountedPrice(cart.gia, item.value))
        .reduce((total, price) => total + price, 0)
      console.log('')
      return discountedPrice
    } else {
      return cart.gia
    }
  }

  return (
    <div className="check-out">
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 3, mb: 3 }}>
          <Typography
            color="inherit"
            component={Link}
            to="/cart"
            sx={{
              color: 'black',
              textDecoration: 'none',
              fontWeight: '600 !important',
              fontSize: 'calc(0.9rem + 0.15vw) !important',
            }}>
            Giỏ hàng
          </Typography>

          <Typography color="text.primary"> Thông tin thanh toán</Typography>
        </Breadcrumbs>
        <Paper
          sx={{
            padding: '40px',
            paddingTop: 0,
            minHeight: '68vh',
            py: 2,
            backgroundColor: 'rgba(249, 249, 246, 0.985)',
          }}>
          <Grid container spacing={2}>
            <Grid
              item
              lg={7}
              sx={{ px: { lg: '40px' }, backgroundColor: 'white', mt: '20px' }}
              width={'100%'}>
              <div className="button-lbtt">
                <span className="checkout-info-label">Thông tin giao hàng</span>
                {userLogin && (
                  <Button
                    style={{ float: 'right' }}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setIsShowDiaChi(true)
                      loadListAd()
                      setErrors({ ...errors, provinceId: '', districtId: '', wardId: '' })
                    }}>
                    <b>Chọn Địa chỉ</b>
                  </Button>
                )}
                <ModalAddress
                  open={isShowDiaChi}
                  setOpen={setIsShowDiaChi}
                  setRequest={setRequest}
                  setPhiShip={setPhiShip}
                  listAddress={listAddress}
                  setSelectedTinh={setSelectedTinh}
                  setSelectedHuyen={setSelectedHuyen}
                  setSelectedXa={setSelectedXa}
                  loadTinh={loadTinh}
                  loadHuyen={loadHuyen}
                  loadXa={loadXa}
                  arrData={arrData}
                  setTimeShip={setTimeShip}
                  loadListAd={loadListAd}
                  iddcSelected={iddcSelected}
                  setiddcSelected={setiddcSelected}
                />
              </div>
              <Grid container mt={0} spacing={3}>
                <Grid item xs={6}>
                  <Typography>
                    <span className="required"> *</span>Họ và tên
                  </Typography>
                  <TextField
                    value={request.fullName}
                    onChange={(e) => {
                      setRequest({ ...request, fullName: e.target.value })
                      setErrors({ ...errors, fullName: '' })
                    }}
                    size="small"
                    fullWidth
                    id="fullname"
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <span className="required"> *</span>Số điện thoại
                  </Typography>
                  <TextField
                    value={request.phone}
                    onChange={(e) => {
                      setRequest({ ...request, phone: e.target.value })
                      setErrors({ ...errors, phone: '' })
                    }}
                    size="small"
                    fullWidth
                    id="phone"
                    error={Boolean(errors.phone)}
                    helperText={errors.phone}
                  />
                </Grid>
                {!userLogin && (
                  <Grid item xs={12}>
                    <Typography>
                      <span className="required"> *</span>Email
                    </Typography>
                    <TextField
                      value={request.email}
                      onChange={(e) => {
                        setRequest({ ...request, email: e.target.value })
                        setErrors({ ...errors, email: '' })
                      }}
                      size="small"
                      fullWidth
                      id="email"
                    />
                    <Typography variant="body2" color="error">
                      {errors.email}
                      {errors.email === 'Địa chỉ email đã tồn tại trong hệ thống.' && (
                        <Typography
                          style={{ textDecoration: 'none', fontWeight: 'bold' }}
                          component={Link}
                          to={'/login'}
                          variant="body2"
                          color="green">
                          {' '}
                          Đăng nhập ngay
                        </Typography>
                      )}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid container mt={0} spacing={3}>
                <Grid item xs={12} lg={4}>
                  <Typography>
                    <span className="required"> *</span>Tỉnh/thành phố
                  </Typography>
                  <Autocomplete
                    fullWidth
                    clearIcon={null}
                    size="small"
                    id="combo-box-demo"
                    value={selectedTinh}
                    onChange={handleTinhChange}
                    options={tinh.map((item) => ({
                      label: item.provinceName,
                      id: item.provinceID,
                    }))}
                    getOptionLabel={(options) => options.label}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Typography variant="body2" color="error">
                    {errors.provinceId}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Typography>
                    <span className="required"> *</span>Quận/huyện
                  </Typography>
                  <Autocomplete
                    clearIcon={null}
                    fullWidth
                    size="small"
                    className="search-field"
                    id="combo-box-demo"
                    value={selectedHuyen}
                    onChange={handleHuyenChange}
                    options={huyen.map((item) => ({
                      label: item.districtName,
                      id: item.districtID,
                    }))}
                    getOptionLabel={(options) => options.label}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Typography variant="body2" color="error">
                    {errors.districtId}
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Typography>
                    <span className="required"> *</span>Xã/thị trấn
                  </Typography>
                  <Autocomplete
                    clearIcon={null}
                    fullWidth
                    size="small"
                    className="search-field"
                    id="combo-box-demo"
                    value={selectedXa}
                    onChange={handleXaChange}
                    options={xa.map((item) => ({ label: item.wardName, id: item.wardCode }))}
                    getOptionLabel={(options) => options.label}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Typography variant="body2" color="error">
                    {errors.wardId}
                  </Typography>
                </Grid>
              </Grid>
              <Grid sx={{ mt: 2 }}>
                <Typography>
                  <span className="required"> *</span>Địa chỉ cụ thể
                </Typography>
                <TextField
                  value={request.address}
                  onChange={(e) => {
                    setRequest({ ...request, address: e.target.value })
                    setErrors({ ...errors, address: '' })
                  }}
                  size="small"
                  fullWidth
                  id="dia-chi"
                />
                <Typography variant="body2" color="error">
                  {errors.address}
                </Typography>
              </Grid>
              <Grid sx={{ mt: 2 }}>
                <Typography>Ghi chú</Typography>
                <TextField
                  onChange={(e) => {
                    setRequest({ ...request, note: e.target.value })
                  }}
                  size="small"
                  fullWidth
                  id="dia-chi"
                />
              </Grid>
              <h3>Phương thức thanh toán</h3>
              <FormControl sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedValue}
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group">
                  <div className="pay">
                    <div className="ck-pttt">
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <Radio size="small" onChange={handleRadioChange} value={'0'} />
                        <img
                          alt="error"
                          src={require('../../assets/image/thanhtoan.jpg')}
                          style={{
                            maxWidth: '40px',
                            maxHeight: '40px',
                            verticalAlign: 'middle',
                          }}
                        />
                        Thanh toán khi nhận hàng
                      </label>
                    </div>
                    <div className="ck-pttt">
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <Radio size="small" onChange={handleRadioChange} value={'1'} />
                        <img
                          alt="error"
                          src={require('../../assets/image/vnpay.jpg')}
                          style={{
                            maxWidth: '70px',
                            maxHeight: '70px',
                            verticalAlign: 'middle',
                          }}
                        />
                        Thanh toán ngay
                      </label>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <Button
                onClick={() => {
                  finishCheckout()
                }}
                size="small"
                variant="contained"
                sx={{
                  width: '100%',
                  my: 2,
                  mr: 2,
                  height: '40px',
                  color: '#FF9900',
                  backgroundColor: '#333',
                  ':hover': {
                    backgroundColor: '#000',
                  },
                }}>
                <b style={{ color: 'white' }}>Hoàn thành đặt hàng</b>
              </Button>
              <div>
                <Link to="/cart" style={{ textDecoration: 'none' }}>
                  <ReplyIcon />
                  <b>Quay lại giỏ hàng</b>
                </Link>
              </div>
            </Grid>
            <Grid className="detail-checkout" item lg={5} width={'100%'}>
              <Table>
                {arrData.map((cart) => (
                  <TableBody>
                    <TableCell style={{ verticalAlign: 'middle' }} sx={{ px: 0 }}>
                      <div>
                        <img src={cart.image[0]} alt={cart.name} className="image-ck" />
                        <div className="quantity-badge">{cart.soLuong}</div>
                      </div>
                    </TableCell>
                    <TableCell
                      to={`/product/${cart.id}`}
                      style={{ verticalAlign: 'middle' }}
                      sx={{ px: 0 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          marginLeft: '10px',
                          fontWeight: 700,
                        }}>
                        <p style={{ margin: 0 }}>{cart.name}</p>
                        <div
                          style={{
                            width: '75px',
                            height: '22px',
                            backgroundColor: 'orange',
                            borderRadius: '10px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <b style={{ margin: 0 }}>
                            size:{' '}
                            {parseFloat(cart.size) % 1 === 0
                              ? parseFloat(cart.size).toFixed(0)
                              : parseFloat(cart.size).toFixed(1)}
                          </b>
                        </div>
                      </span>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { md: 'table-cell', xs: 'none' },
                        color: 'red',
                        fontWeight: 'bold',
                        textAlign: 'left',
                      }}>
                      {promotionByProductDetail.map((item, index) => {
                        const isDiscounted = item.idProductDetail === cart.id && item.value

                        return (
                          <div key={index}>
                            {isDiscounted ? (
                              <div>
                                <div>
                                  <span style={{ color: 'red', fontWeight: 'bold' }}>
                                    {`${formatPrice(
                                      cart.soLuong * calculateDiscountedPrice(cart.gia, item.value),
                                    )} `}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )
                      })}

                      {!promotionByProductDetail.some(
                        (item) => item.idProductDetail === cart.id && item.value,
                      ) && (
                        <div style={{ color: 'red' }}>{`${formatPrice(
                          cart.soLuong * cart.gia,
                        )} `}</div>
                      )}
                    </TableCell>
                  </TableBody>
                ))}
              </Table>
              <Grid sx={{ mt: 2, ml: 2, mr: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  sx={{ flex: 1, minWidth: '100px', width: '100%' }}
                  value={voucher === null ? 'Phiếu giảm giá' : voucher.name}
                  size="small"
                  className="input-voucher"
                  disabled
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant="contained"
                        onClick={() => handleFilterVoucher()}
                        style={{ backgroundColor: 'black' }}>
                        <b>Chọn </b>
                      </Button>
                    ),
                  }}
                />

                <ModalVoucher
                  open={openModalVoucher}
                  setOpen={setOpenModalVoucher}
                  setVoucher={setVoucher}
                  arrData={arrData}
                  setGiamGia={setGiamGia}
                  voucherFilter={voucherFilter}
                />
              </Grid>
              <Box sx={{ m: 1, ml: 2, mr: 2 }}>
                <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                  <Typography>Phí vận chuyển</Typography>
                  <Typography color={'red'}>
                    <b className="ck-phi">
                      {arrData.reduce((total, cart) => {
                        const productTotal =
                          calculateProductTotalPayment(cart, promotionByProductDetail) || 0
                        return total + productTotal
                      }, 0) -
                        giamGia <
                      1000000
                        ? phiShip.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                        : 0}
                    </b>
                  </Typography>
                </Stack>
                <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                  <Typography>Giảm giá</Typography>
                  <Typography color={'red'}>
                    <b className="ck-phi">
                      {giamGia
                        ? giamGia.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                        : 0}
                    </b>
                  </Typography>
                </Stack>
                <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                  <Typography>Ngày nhận dự kiến: </Typography>
                  <Typography color={'red'}>
                    <b className="ck-phi">{timeShip ? dayjs(timeShip).format('DD-MM-YYYY') : ''}</b>
                  </Typography>
                </Stack>
                <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                  <Typography>
                    <b className="ck-tong-tien">Tổng số tiền</b>
                  </Typography>
                  <Typography color={'red'}>
                    <b className="ck-tong-tien">
                      {formatPrice(
                        arrData.reduce((total, cart) => {
                          const productTotal =
                            calculateProductTotalPayment(cart, promotionByProductDetail) || 0
                          return total + productTotal
                        }, 0) -
                          giamGia +
                          (arrData.reduce((total, cart) => {
                            const productTotal =
                              calculateProductTotalPayment(cart, promotionByProductDetail) || 0
                            return total + productTotal
                          }, 0) > 1000000
                            ? 0
                            : phiShip),
                      )}
                    </b>
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  )
}
