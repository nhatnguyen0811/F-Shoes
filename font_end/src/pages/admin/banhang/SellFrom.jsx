import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { AiOutlineDisconnect } from 'react-icons/ai'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import CloseIcon from '@mui/icons-material/Close'
import Person4Icon from '@mui/icons-material/Person4'
import AddIcon from '@mui/icons-material/Add'
// import RemoveIcon from '@mui/icons-material/Remove'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { LocalShipping } from '@mui/icons-material'
import sellApi from '../../../api/admin/sell/SellApi'
import SearchIcon from '@mui/icons-material/Search'
import dayjs from 'dayjs'
import './sell.css'
import ModelSell from './ModelSell'
import ghnAPI from '../../../api/admin/ghn/ghnApi'
import DiaChiApi from '../../../api/admin/khachhang/DiaChiApi'
import { toast } from 'react-toastify'
import Empty from '../../../components/Empty'
import khachHangApi from '../../../api/admin/khachhang/KhachHangApi'
import { useTheme } from '@emotion/react'
import confirmSatus from '../../../components/comfirmSwal'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import PaymentIcon from '@mui/icons-material/Payment'
import DeleteIcon from '@mui/icons-material/Delete'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { RiDeleteBin6Line } from 'react-icons/ri'
import QrCodeIcon from '@mui/icons-material/QrCode'
import Scanner from '../../../layout/Scanner'
import axios from 'axios'
import { socketUrl, url } from '../../../services/url'
import printJS from 'print-js'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import InputQuantity from './InputQuantity'
import { useDispatch, useSelector } from 'react-redux'
import { GetApp, setApp } from '../../../services/slices/appSlice'
import Swal from 'sweetalert2'

const styleModalProduct = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90vw', md: '80vw' },
  height: '600px',
  bgcolor: 'white',
  borderRadius: 1.5,
  boxShadow: 24,
}
const styleModalAddCustomer = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '85vw', sm: '65vw', md: '55vw', lg: '45vw' },
  height: 'auto',
  bgcolor: 'white',
  borderRadius: 1.5,
  boxShadow: 24,
}
const styleCustomerPays = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  height: 580,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
}
var stompClient = null
export default function SellFrom({
  idBill,
  getAllBillTaoDonHang,
  setSelectBill,
  setSoluong,
  setNameCustomer,
  nameCustomer,
  setDetailDiaChi,
  detailDiaChi,
  setXaName,
  xaName,
  setHuyenName,
  huyenName,
  setTinhName,
  tinhName,
  giaoHang,
  setGiaoHang,
  listBill,
}) {
  const theme = useTheme()
  const [isShowCustomer, setIsShowCustomer] = useState(false)
  // const [isShowVoucher, setIsShowVoucher] = useState(false)
  const [isShowDiaChi, setIsShowDiaChi] = useState(false)
  const [isShowAddCustomer, setIsShowAddCustomer] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])

  const [isShowAddDiaChi, setIsShowAddDiaChi] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [initPage, setInitPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [totalPagesAd, setTotalPagesAd] = useState(0)

  const [listKhachHang, setlistKhachHang] = useState([])
  const [listVoucher, setListVoucher] = useState([])
  const [listProductDetailBill, setListProductDetailBill] = useState([])
  const [listDiaChiDetail, setListDiaChiDetail] = useState([])

  const [totalPagesVoucher, setTotalPagesVoucher] = useState(0)
  const [shipTotal, setShipTotal] = useState('')
  const [timeShip, setTimeShip] = useState('')
  const [list, setList] = useState([])

  const [customerAmount, setCustomerAmount] = useState(0)
  const [percentMoney, setPercentMoney] = useState(null)

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setErrorAddBill({ customerAmount: '', payMent: '' })
  }
  const [paymentMethod, setPaymentMethod] = useState('0')
  const [payOrderByIdBill, setPayOrderByIdBill] = useState([])
  const [totalMoneyPayOrderByIdBill, setTotalMoneyPayOrderByIdBill] = useState('')
  const [transactionCode, setTransactionCode] = useState('')
  const [isTextFieldDisabled, setIsTextFieldDisabled] = useState(false)
  const [noteTransaction, setNoteTransaction] = useState('')

  // const [errorPercentMoney, setErrorPercentMoney] = useState('')

  const handlePaymentMethodChange = (event) => {
    const selectedPaymentMethod = event.target.value
    setPaymentMethod(selectedPaymentMethod)
    setIsTextFieldDisabled(selectedPaymentMethod === '1')
  }

  const fetchPayOrderByIdBill = (idBill) => {
    sellApi.getPayOrderByIdBill(idBill).then((response) => {
      setPayOrderByIdBill(response.data.data)
    })
  }

  const fetchTotalMoneyPayOrderByIdBill = (idBill) => {
    sellApi.getTotalMoneyPayOrderByIdBill(idBill).then((response) => {
      setTotalMoneyPayOrderByIdBill(response.data.data)
    })
  }
  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code',
    })
    return formatter.format(value)
  }

  useEffect(() => {
    fetchPayOrderByIdBill(idBill)
    fetchTotalMoneyPayOrderByIdBill(idBill)
  }, [idBill])

  const [searchKhachHang, setSearchKhachHang] = useState({
    nameSearch: '',
    gender: '',
    statusSearch: 0,
    size: 5,
    page: 1,
  })

  const [adCallVoucherOfSell, setAdCallVoucherOfSell] = useState({
    idCustomer: null,
    condition: 0,
    textSearch: '',
    typeSearch: null,
    typeValueSearch: null,
    page: 1,
    size: 5,
  })
  const [khachHang, setKhachHang] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateBirth: '',
    role: 2,
    gender: '',
    avatar: null,
    note: '',
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
    provinceId: '',
    districtId: '',
    wardId: '',
    specificAddress: '',
    gender: '',
  })
  const [selectedProductIds, setSelectedProductIds] = useState([])

  const handleRowCheckboxChange = (event, ProductDetailId) => {
    const selectedIndex = selectedRows.indexOf(ProductDetailId)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, ProductDetailId]
    } else {
      newSelected = [
        ...selectedRows.slice(0, selectedIndex),
        ...selectedRows.slice(selectedIndex + 1),
      ]
    }

    setSelectedRows(newSelected)

    const selectedProductIds = listProductDetailBill
      .filter((row) => newSelected.includes(row.id))
      .map((selectedProduct) => selectedProduct.id)
    setSelectedProductIds(selectedProductIds)
  }

  const deleteProductDetail = (idBill, idPrDetail) => {
    if (idPrDetail.length <= 0) {
      toast.error('Bạn chưa chọn sản phẩm để xóa hoặc không có sản phẩm trong giỏ hàng', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else {
      sellApi
        .deleteProductDetail(idBill, idPrDetail)
        .then((response) => {
          toast.success('Bạn đã bỏ sản phẩm ra thành công', { position: toast.POSITION.TOP_CENTER })
          fectchProductBillSell(idBill)
        })
        .catch((error) => {
          toast.error('Bạn đã bỏ sản phẩm ra thất bại', { position: toast.POSITION.TOP_CENTER })
        })
    }
  }

  const openAddProductModal = () => {
    setShowModal(true)
  }
  const closeAddProductModal = () => {
    // setAdCallVoucherOfSell({ ...adCallVoucherOfSell, condition: totalSum })
    setShowModal(false)
  }
  useEffect(() => {
    fectchProductBillSell(idBill)
  }, [idBill])

  const fectchProductBillSell = (id) => {
    sellApi.getProductDetailBill(id).then((response) => {
      setListProductDetailBill(response.data.data)

      if (stompClient !== null && stompClient.connected) {
        const mess = { appLoad: true }
        stompClient.send(`/topic/app-load/${idBill}`, {}, JSON.stringify(mess))
      }
      const conditionMoney = response.data.data.reduce((sum, cart) => {
        if (cart.value) {
          return sum + calculateDiscountedPrice(cart.price, cart.value) * cart.quantity
        } else {
          return sum + cart.price * cart.quantity
        }
      }, 0)
      if (Number(conditionMoney) >= 1000000) {
        setShipTotal(0)
      } else {
        tinhLaiShip(response.data.data)
      }

      setAdCallVoucherOfSell({
        ...adCallVoucherOfSell,
        condition: parseFloat(conditionMoney),
      })
    })
  }

  const fecthDataCustomer = () => {
    khachHangApi.get(searchKhachHang).then((response) => {
      setlistKhachHang(response.data.data.content)
      setTotalPages(response.data.data.totalPages)
      if (searchKhachHang.page > response.data.data.totalPages)
        if (response.data.data.totalPages > 0) {
          setSearchKhachHang({ ...searchKhachHang, page: response.data.data.totalPages })
        }
    })
  }
  const handleOnChangePage = (page) => {
    setInitPage(page)
  }

  const tinhLaiShip = (listPrBill) => {
    const filtelService = {
      shop_id: '3911708',
      from_district: '3440',
      to_district: detailDiaChi.districtId,
    }
    if (detailDiaChi.districtId && listPrBill.length > 0) {
      ghnAPI.getServiceId(filtelService).then((response) => {
        const serviceId = response.data.body.serviceId
        const totalWeight = listPrBill
          .filter((item) => item.status !== 1)
          .reduce((acc, item) => acc + parseInt(item.weight) * parseInt(item.quantity), 0)
        const filterTotal = {
          from_district_id: '3440',
          service_id: serviceId,
          to_district_id: detailDiaChi.districtId,
          to_ward_code: detailDiaChi.wardId,
          weight: totalWeight,
          insurance_value: '10000',
        }
        ghnAPI.getTotal(filterTotal).then((response) => {
          setShipTotal(response.data.body.total)
        })
      })
    }
  }

  const rollBackQuantityProductDetail = (idBill, idPrDetail) => {
    sellApi
      .rollBackQuantityProductDetail(idBill, idPrDetail)
      .then((response) => {
        toast.success('Bạn đã bỏ sản phẩm ra thành công', { position: toast.POSITION.TOP_CENTER })
        fectchProductBillSell(idBill)
      })
      .catch((error) => {
        toast.error('Bạn đã bỏ sản phẩm ra thất bại', { position: toast.POSITION.TOP_CENTER })
      })
  }

  const increaseQuantityBillDetail = (idBillDetail, idPrDetail, currentQuantity) => {
    const updatedQuantity = currentQuantity + 1
    sellApi.increaseQuantityBillDetail(idBillDetail, idPrDetail, updatedQuantity).then(() => {
      fectchProductBillSell(idBill)
    })
  }

  const decreaseQuantityBillDetail = (idBillDetail, idPrDetail, currentQuantity) => {
    const updatedQuantity = Math.max(currentQuantity - 1, 1)

    sellApi.decreaseQuantityBillDetail(idBillDetail, idPrDetail, updatedQuantity).then(() => {
      fectchProductBillSell(idBill)
    })
  }

  const inputQuantityBillDetail = (idBillDetail, idPrDetail, quantity, cart) => {
    let sum = 0
    if (cart.value) {
      sum = calculateDiscountedPrice(cart.price, cart.value) * quantity
    } else {
      sum = cart.price * quantity
    }
    if (Number(sum) < 500000000) {
      sellApi.inputQuantityBillDetail(idBillDetail, idPrDetail, quantity).then(() => {
        fectchProductBillSell(idBill)
      })
    } else {
      toast.error('Vượt quá số lượng cho phép')
    }
  }

  const fecthDataVoucherByIdCustomer = (adCallVoucherOfSell) => {
    sellApi
      .getAllVoucherByIdCustomer(adCallVoucherOfSell)
      .then((response) => {
        setListVoucher(response.data.data.content)
        setTotalPagesVoucher(response.data.data.totalPages)
      })
      .catch((error) => {
        toast.error('Vui Lòng f5 tải lại trang', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const fecthListVoucherByIdCustomer = (adCallVoucherOfSell) => {
    sellApi
      .getListVoucherByIdCustomer(adCallVoucherOfSell)
      .then((response) => {
        findMaxValueElement(response.data.data)
      })
      .catch((error) => {
        toast.error('Vui Lòng f5 tải lại trang', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const fecthListVoucherByIdCustomerUnqualified = (adCallVoucherOfSell) => {
    sellApi
      .getListVoucherByIdCustomerUnqualified(adCallVoucherOfSell)
      .then((response) => {
        findMinValueElement(response.data.data)
      })
      .catch(() => {
        toast.error('Vui Lòng f5 tải lại trang', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const findMaxValueElement = (lstVoucher) => {
    if (lstVoucher.length < 1) {
      setVoucher({
        id: '',
        code: '',
        name: '',
        value: '',
        maximumValue: '',
        minimumAmount: '',
        type: '',
        typeValue: '',
        startDate: '',
        endDate: '',
      })
      return null
    }

    let maxElement = lstVoucher[0]

    lstVoucher.forEach((element) => {
      if (element.maximumValue > maxElement.maximumValue) {
        maxElement = element
      }
    })

    return handleVoucher(maxElement.id)
  }

  const findMinValueElement = (lstVoucher) => {
    if (lstVoucher.length < 1) {
      return null
    }

    let minElement = lstVoucher[0]
    if (voucher.id === '') {
      lstVoucher.forEach((element) => {
        if (element.minimumAmount < minElement.minimumAmount) {
          minElement = element
        }
      })
    } else {
      lstVoucher.forEach((element) => {
        if (
          element.minimumAmount < minElement.minimumAmount &&
          element.maximumValue > voucher.maximumValue
        ) {
          minElement = element
        }
      })
    }

    return handleVoucherUnqualified(minElement.id)
  }

  // const handelOnchangePage = (page) => {
  //   setAdCallVoucherOfSell({ ...adCallVoucherOfSell, page: page })
  //   fecthDataVoucherByIdCustomer(adCallVoucherOfSell)
  // }

  useEffect(() => {
    const fetchData = async () => {
      await loadTinh()
      fecthDataCustomer(searchKhachHang)
      fecthDataVoucherByIdCustomer(adCallVoucherOfSell)
      fecthListVoucherByIdCustomer(adCallVoucherOfSell)
      fecthListVoucherByIdCustomerUnqualified(adCallVoucherOfSell)
      loadList()
      detailAddress()
    }

    fetchData()
  }, [adCallVoucherOfSell, searchKhachHang])

  const loadDiaChi = (initPage, idCustomer) => {
    DiaChiApi.getAll(initPage - 1, idCustomer).then((response) => {
      setListDiaChiDetail(response.data.data.content)
      setTotalPagesAd(response.data.data.totalPages)
    })
  }

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * originalPrice
    const discountedPrice = originalPrice - discountAmount
    return discountedPrice
  }

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
  }

  const handleChangeShip = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, '')
    setShipTotal(input)
  }

  const [tinh, setTinh] = useState([])
  const [huyen, setHuyen] = useState([])
  const [xa, setXa] = useState([])

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

  async function loadHuyen(idProvince) {
    const response = await ghnAPI.getDistrict(idProvince)
    setHuyen(response.data)
    return response.data
  }

  async function loadXa(idDistrict) {
    const response = await ghnAPI.getWard(idDistrict)
    setXa(response.data)
    return response.data
  }

  const [selectedTinh, setSelectedTinh] = useState(null)
  const [selectedHuyen, setSelectedHuyen] = useState(null)
  const [selectedXa, setSelectedXa] = useState(null)
  const handleTinhChange = (_, newValue) => {
    setErrorAddBill({ ...errorAddBill, provinceId: '' })
    setErrors({ ...errors, provinceId: '' })
    setSelectedTinh(newValue)
    setSelectedHuyen(null)
    setSelectedXa(null)
    setHuyenName('')
    setXaName('')
    setNewDiaChi({ ...newDiaChi, districtId: { id: '', label: '' } })
    setDetailDiaChi({ ...detailDiaChi, districtId: '' })
    setDetailDiaChi({ ...detailDiaChi, wardId: '' })
    setNewDiaChi({ ...newDiaChi, wardId: { id: '', label: '' } })
    setXa([])
    if (newValue) {
      loadHuyen(newValue.id)
      setTinhName(newValue.label)
      setDiaChi({ ...diaChi, provinceId: newValue.id })
      setDetailDiaChi({ ...detailDiaChi, provinceId: newValue.id })
      setNewDiaChi({ ...newDiaChi, provinceId: { id: newValue.id, label: newValue.label } })
    } else {
      setHuyen([])
      setDiaChi({ ...diaChi, provinceId: null })
      setNewDiaChi({ ...newDiaChi, provinceId: { id: '', label: '' } })
      setDetailDiaChi({ ...detailDiaChi, provinceId: '' })
    }
  }

  const handleHuyenChange = (_, newValue) => {
    setErrorAddBill({ ...errorAddBill, districtId: '' })
    setErrors({ ...errors, districtId: '' })
    setSelectedHuyen(newValue)
    setSelectedXa(null)
    setXaName('')
    setDetailDiaChi({ ...detailDiaChi, wardId: '' })
    setNewDiaChi({ ...newDiaChi, wardId: { id: '', label: '' } })
    if (newValue) {
      loadXa(newValue.id)
      setDiaChi({ ...diaChi, districtId: newValue.id })
      setNewDiaChi({ ...newDiaChi, districtId: { id: newValue.id, label: newValue.label } })
      setHuyenName(newValue.label)
      setDetailDiaChi({ ...detailDiaChi, districtId: newValue.id })
    } else {
      setXa([])
      setNewDiaChi({ ...newDiaChi, districtId: { id: '', label: '' } })
      setDetailDiaChi({ ...detailDiaChi, districtId: '' })
    }
  }

  const handleXaChange = (_, newValue) => {
    setErrorAddBill({ ...errorAddBill, wardId: '' })
    setErrors({ ...errors, wardId: '' })
    if (newValue) {
      setSelectedXa(newValue)
      setDiaChi({ ...diaChi, wardId: newValue?.id })
      setXaName(newValue.label)
      setDetailDiaChi({ ...detailDiaChi, wardId: newValue.id })
      setNewDiaChi({ ...newDiaChi, wardId: { id: newValue.id, label: newValue.label } })
    } else {
      setDetailDiaChi({ ...detailDiaChi, wardId: '' })
      setNewDiaChi({ ...newDiaChi, wardId: { id: '', label: '' } })
    }
    const filtelService = {
      shop_id: '3911708',
      from_district: '3440',
      to_district: detailDiaChi.districtId,
    }
    ghnAPI.getServiceId(filtelService).then((response) => {
      const serviceId = response.data.body.serviceId
      const filterTotal = {
        from_district_id: '3440',
        service_id: serviceId,
        to_district_id: detailDiaChi.districtId,
        to_ward_code: newValue.id,
        weight: listProductDetailBill.reduce(
          (totalWeight, e) => totalWeight + parseInt(e.weight),
          0,
        ),
        insurance_value: '10000',
      }
      ghnAPI.getTotal(filterTotal).then((response) => {
        setShipTotal(response.data.body.total)

        const filtelTime = {
          from_district_id: '3440',
          from_ward_code: '13010',
          to_district_id: detailDiaChi.districtId,
          to_ward_code: newValue.id,
          service_id: serviceId,
        }
        ghnAPI.getime(filtelTime).then((response) => {
          setTimeShip(response.data.body.leadtime * 1000)
        })
      })
    })
  }

  const detailAddress = () => {
    sellApi.getAllBillId(idBill).then((result) => {
      if (result.data.data.customer !== null) {
        setNameCustomer(result.data.data.customer.fullName)
        loadDiaChi(initPage, result.data.data.customer.id)
        if (
          result.data.data.fullName !== null &&
          result.data.data.address !== null &&
          result.data.data.phoneNumber !== null
        ) {
          const [specificAddress, wardLabel, districtLabel, provinceLabel] =
            result.data.data.address.split(', ')
          setTinhName(provinceLabel)
          setHuyenName(districtLabel)
          setXaName(wardLabel)
          const selectTinh = tinh.find((item) => item.provinceName === provinceLabel) || null

          if (selectTinh) {
            setSelectedTinh({ id: selectTinh.provinceID, label: selectTinh.provinceName })
            ;(async () => {
              const huyenData = await loadHuyen(selectTinh.provinceID)
              const selectHuyen =
                huyenData.find((item) => item.districtName === districtLabel) || null
              setSelectedHuyen({ id: selectHuyen.districtID, label: selectHuyen.districtName })

              if (selectHuyen) {
                ;(async () => {
                  const xaData = await loadXa(selectHuyen.districtID)
                  const selectXa = xaData.find((item) => item.wardName === wardLabel) || null
                  setSelectedXa({ id: selectXa.wardCode, label: selectXa.wardName })
                  setDetailDiaChi({
                    ...detailDiaChi,
                    name: result.data.data.fullName,
                    phoneNumber: result.data.data.phoneNumber,
                    provinceId: selectTinh.provinceID,
                    districtId: selectHuyen.districtID,
                    wardId: selectXa.wardCode,
                    specificAddress: specificAddress,
                  })
                })()
              }
            })()
          }
        }
      } else {
        setNameCustomer('khách lẻ')
      }
    })
  }

  const clearSelectAddress = () => {
    setSelectedTinh(null)
    setSelectedHuyen(null)
    setSelectedXa(null)
    setHuyen([])
    setXa([])
  }
  const updateDiaChi = () => {
    setDiaChi({
      ...diaChi,
      name: khachHang.fullName,
      phoneNumber: khachHang.phoneNumber,
      type: true,
    })
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
    let check = 0
    const currentDate = dayjs()
    const dateBirth = dayjs(khachHang.dateBirth, 'DD/MM/YYYY')
    const minBirthYear = 1900
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/

    if (!khachHang.fullName) {
      newErrors.fullName = 'Vui lòng nhập Họ và Tên.'
      check++
    } else if (khachHang.fullName.length > 100) {
      newErrors.fullName = 'Họ và Tên không được quá 100 kí tự.'
      check++
    } else if (khachHang.fullName.length < 5) {
      newErrors.fullName = 'Họ và Tên không được bé hơn 5 kí tự.'
      check++
    } else if (specialCharsRegex.test(khachHang.fullName)) {
      newErrors.fullName = 'Họ và Tên không được có kí tự đặc biệt.'
      check++
    } else {
      newErrors.fullName = ''
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
      newErrors.dateBirth = 'Vui lòng chọn Ngày sinh.'
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
      newErrors.wardId = 'Vui lòng chọn Xã/Thị trấn.'
      check++
    } else {
      newErrors.wardId = ''
    }

    if (check > 0) {
      setErrors(newErrors)
      return
    }
    const title = 'Xác nhận Thêm mới khách hàng?'
    const text = ''
    confirmSatus(title, text, theme).then((result) => {
      if (result.isConfirmed) {
        khachHangApi.addKhachHang(khachHang).then((response) => {
          let khachHangId = response.data.data.id
          const obj = {
            name: diaChi.name,
            phoneNumber: khachHang.phoneNumber,
            specificAddress: diaChi.specificAddress,
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
            setIsShowAddCustomer(false)
            fecthDataCustomer()
            setSelectedTinh(null)
            setSelectedHuyen(null)
            setSelectedXa(null)
          })
        })
      }
    })
  }

  const fillDetailDiaChi = (idCustomer) => {
    DiaChiApi.getAddressDefault(idCustomer).then((response) => {
      const {
        idDiaChi,
        name,
        email,
        phoneNumber,
        specificAddress,
        provinceId,
        districtId,
        wardId,
        type,
      } = response.data.data

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

        if (giaoHang) {
          const data = {
            fullName: name,
            phoneNumber: phoneNumber,
            idCustomer: idCustomer,
            address: specificAddress,
          }
          sellApi.addAddressBill(data, idBill).then(() => {
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
                weight: listProductDetailBill.reduce(
                  (totalWeight, e) => totalWeight + parseInt(e.weight),
                  0,
                ),
                insurance_value: '10000',
              }

              ghnAPI.getTotal(filterTotal).then((response) => {
                setShipTotal(response.data.body.total)

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
            detailAddress()
          })
        } else {
          const data = {
            idCustomer: idCustomer,
          }

          sellApi.addAddressBill(data, idBill).then(() => {
            detailAddress()
          })
        }
      }
    })
  }

  const handleDetailDiaChi = (idDiaChi) => {
    setIsShowDiaChi(false)
    DiaChiApi.getById(idDiaChi).then((response) => {
      const {
        idDiaChi,
        name,
        email,
        phoneNumber,
        specificAddress,
        provinceId,
        districtId,
        wardId,
        type,
      } = response.data.data

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

        const data = {
          fullName: name,
          phoneNumber: phoneNumber,
          address: specificAddress,
        }

        sellApi.addAddressBill(data, idBill).then(() => {
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
              weight: listProductDetailBill.reduce(
                (totalWeight, e) => totalWeight + parseInt(e.weight),
                0,
              ),
              insurance_value: '10000',
            }

            ghnAPI.getTotal(filterTotal).then((response) => {
              setShipTotal(response.data.body.total)

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
        })
      }
    })
  }

  const saveAddressKH = () => {
    if (!giaoHang) {
      const data = {
        fullName: detailDiaChi.name,
        phoneNumber: detailDiaChi.phoneNumber,
        address: detailDiaChi.specificAddress + ', ' + xaName + ', ' + huyenName + ', ' + tinhName,
      }

      sellApi.addAddressBill(data, idBill).then(() => {
        const filtelService = {
          shop_id: '3911708',
          from_district: '3440',
          to_district: detailDiaChi.districtId,
        }
        if (filtelService.to_district) {
          ghnAPI.getServiceId(filtelService).then((response) => {
            const serviceId = response.data.body.serviceId
            const filterTotal = {
              from_district_id: '3440',
              service_id: serviceId,
              to_district_id: detailDiaChi.districtId,
              to_ward_code: detailDiaChi.wardId,
              weight: listProductDetailBill.reduce(
                (totalWeight, e) => totalWeight + parseInt(e.weight),
                0,
              ),
              insurance_value: '10000',
            }
            ghnAPI.getTotal(filterTotal).then((response) => {
              setShipTotal(response.data.body.total)
              const filtelTime = {
                from_district_id: '3440',
                from_ward_code: '13010',
                to_district_id: detailDiaChi.districtId,
                to_ward_code: detailDiaChi.wardId,
                service_id: serviceId,
              }
              ghnAPI.getime(filtelTime).then((response) => {
                setTimeShip(response.data.body.leadtime * 1000)
              })
            })
          })
        }
      })
    } else {
      const data = {
        fullName: '',
        phoneNumber: '',
        address: '',
      }

      sellApi.addAddressBill(data, idBill).then(() => {})
    }
  }

  const [newDiaChi, setNewDiaChi] = useState({
    name: '',
    phoneNumber: '',
    specificAddress: '',
    provinceId: { id: '', label: '' },
    districtId: { id: '', label: '' },
    wardId: { id: '', label: '' },
    type: null,
    idCustomer: '',
  })
  const [errorsAA, setErrorsAA] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    specificAddress: '',
  })

  const [btnad, setBtnad] = useState(false)

  const handleDiaChi = (idCustomer) => {
    setBtnad(true)
    setIsShowCustomer(false)
    loadDiaChi(initPage, idCustomer)
    fillDetailDiaChi(idCustomer)
    setAdCallVoucherOfSell({ ...adCallVoucherOfSell, idCustomer: idCustomer })
    setNewDiaChi({
      ...newDiaChi,
      idCustomer: idCustomer,
    })
    setErrorAddBill({
      name: '',
      email: '',
      phoneNumber: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      specificAddress: '',
    })
  }

  const onCreateDiaChi = (newDiaChi) => {
    const newErrors = {}
    let checkAA = 0
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
    if (!newDiaChi.name.trim()) {
      newErrors.name = 'Tên người nhận không được để trống'
      checkAA++
    } else if (newDiaChi.name.trim().length > 100) {
      newErrors.fullName = 'Tên người nhận không được quá 100 kí tự.'
      checkAA++
    } else if (newDiaChi.name.trim().length < 5) {
      newErrors.fullName = 'Tên người nhận không được bé hơn 5 kí tự.'
      checkAA++
    } else if (specialCharsRegex.test(newDiaChi.name)) {
      newErrors.fullName = 'Tên người nhận không được có kí tự đặc biệt.'
      checkAA++
    } else {
      newErrors.name = ''
    }

    if (!newDiaChi.specificAddress.trim()) {
      newErrors.specificAddress = 'Vui lòng nhập địa chỉ cụ thể.'
      checkAA++
    } else if (newDiaChi.specificAddress.length > 225) {
      newErrors.specificAddress = 'Địa chỉ không được quá 225 kí tự.'
      checkAA++
    } else if (newDiaChi.specificAddress.length < 5) {
      newErrors.specificAddress = 'Địa chỉ không được ít hơn 5 kí tự.'
      checkAA++
    } else {
      newErrors.specificAddress = ''
    }

    if (!newDiaChi.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập Số điện thoại.'
      checkAA++
    } else {
      const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
      if (!phoneNumberRegex.test(newDiaChi.phoneNumber.trim())) {
        newErrors.phoneNumber = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
        checkAA++
      } else {
        newErrors.phoneNumber = ''
      }
    }

    if (!selectedTinh) {
      newErrors.provinceId = 'Vui lòng chọn Tỉnh/Thành phố.'
      checkAA++
    } else {
      newErrors.provinceId = ''
    }

    if (!selectedHuyen) {
      newErrors.districtId = 'Vui lòng chọn Quận/Huyện.'
      checkAA++
    } else {
      newErrors.districtId = ''
    }

    if (!selectedXa) {
      newErrors.wardId = 'Vui lòng chọn Xã/Phường/Thị trấn.'
      checkAA++
    } else {
      newErrors.wardId = ''
    }
    if (checkAA > 0) {
      setErrorsAA(newErrors)
      return
    }

    const title = 'Xác nhận Thêm mới địa chỉ?'
    const text = ''
    const obj = {
      name: newDiaChi.name,
      phoneNumber: newDiaChi.phoneNumber,
      email: newDiaChi.email,
      provinceId: selectedTinh ? selectedTinh.id : null,
      districtId: selectedHuyen ? selectedHuyen.id : null,
      wardId: selectedXa ? selectedXa.id : null,
      specificAddress:
        newDiaChi.specificAddress +
        (selectedXa ? `, ${selectedXa.label}` : '') +
        (selectedHuyen ? `, ${selectedHuyen.label}` : '') +
        (selectedTinh ? `, ${selectedTinh.label}` : ''),
      type: 0,
      idCustomer: newDiaChi.idCustomer,
    }
    confirmSatus(title, text, theme).then((result) => {
      if (result.isConfirmed) {
        DiaChiApi.add(obj).then(() => {
          loadDiaChi(initPage, obj.idCustomer)
          toast.success('Thêm địa chỉ thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
          setIsShowAddDiaChi(false)
        })
      }
    })
  }

  const [voucher, setVoucher] = useState({
    id: '',
    code: '',
    name: '',
    value: '',
    maximumValue: '',
    minimumAmount: '',
    type: '',
    typeValue: '',
    startDate: '',
    endDate: '',
  })

  const [voucherUnqualified, setVoucherUnqualified] = useState({
    id: '',
    code: '',
    name: '',
    value: '',
    maximumValue: '',
    minimumAmount: '',
    type: '',
    typeValue: '',
    startDate: '',
    endDate: '',
  })

  const handleVoucher = (idVoucher) => {
    sellApi
      .getOneVoucherById(idVoucher)
      .then((response) => {
        setVoucher(response.data.data)
      })
      .catch(() => {
        toast.error(`Không tồn tại phiếu giảm giá với id : ${idVoucher}`, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const handleVoucherUnqualified = (idVoucher) => {
    sellApi
      .getOneVoucherById(idVoucher)
      .then((response) => {
        setVoucherUnqualified(response.data.data)
      })
      .catch(() => {
        toast.error(`Không tồn tại phiếu giảm giá với id : ${idVoucher}`, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const [errorAddBill, setErrorAddBill] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    specificAddress: '',
    customerAmount: '',
    payMent: '',
  })
  const addBill = (id) => {
    const newErrors = {}
    let checkAA = 0
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
    if (giaoHang) {
      if (!detailDiaChi.name.trim()) {
        newErrors.name = 'Tên người nhận không được để trống'
        checkAA++
      } else if (detailDiaChi.name.trim().length > 100) {
        newErrors.name = 'Tên người nhận không được quá 100 kí tự.'
        checkAA++
      } else if (detailDiaChi.name.trim().length < 5) {
        newErrors.name = 'Tên người nhận không được bé hơn 5 kí tự.'
        checkAA++
      } else if (specialCharsRegex.test(detailDiaChi.name)) {
        newErrors.name = 'Tên người nhận không được có kí tự đặc biệt.'
        checkAA++
      } else {
        newErrors.name = ''
      }

      if (!detailDiaChi.specificAddress.trim()) {
        newErrors.specificAddress = 'Địa chỉ cụ thể không được để trống'
        checkAA++
      } else if (detailDiaChi.name.trim().length > 225) {
        newErrors.specificAddress = 'Địa chỉ cụ thể không được quá 225 kí tự.'
        checkAA++
      } else {
        newErrors.specificAddress = ''
      }

      if (!detailDiaChi.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Vui lòng nhập Số điện thoại.'
        checkAA++
      } else {
        const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
        if (!phoneNumberRegex.test(detailDiaChi.phoneNumber.trim())) {
          newErrors.phoneNumber = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
          checkAA++
        } else {
          newErrors.phoneNumber = ''
        }
      }

      if (!detailDiaChi.provinceId) {
        newErrors.provinceId = 'Vui lòng chọn Tỉnh/Thành phố.'
        checkAA++
      } else {
        newErrors.provinceId = ''
      }

      if (!detailDiaChi.districtId) {
        newErrors.districtId = 'Vui lòng chọn Quận/Huyện.'
        checkAA++
      } else {
        newErrors.districtId = ''
      }

      if (!detailDiaChi.wardId) {
        newErrors.wardId = 'Vui lòng chọn Xã/Phường/Thị trấn.'
        checkAA++
      } else {
        newErrors.wardId = ''
      }
      if (checkAA > 0) {
        setErrorAddBill(newErrors)
        return
      }
    }
    if (listProductDetailBill.length === 0) {
      toast.error('Giỏ hàng chưa có sản phẩm', {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }
    if (!giaoHang) {
      if (totalMoneyPayOrderByIdBill < totalPrice) {
        toast.error('Khách thanh toán chưa đủ tiền', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
    }

    if (percentMoney === null || percentMoney === '') {
      setPercentMoney(0)
    } else if (percentMoney !== null && !Number.isInteger(parseInt(percentMoney))) {
      toast.error('Phần trăm giảm chưa phù hợp', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else if (percentMoney < 0 || percentMoney > 100) {
      toast.error('Phần trăm giảm chưa phù hợp', {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }

    const data = {
      fullName: detailDiaChi.name ? detailDiaChi.name : '',
      phoneNumber: detailDiaChi.phoneNumber ? detailDiaChi.phoneNumber : '',
      idVourcher: voucher.id ? voucher.id : null,
      idCustomer: newDiaChi.idCustomer ? newDiaChi.idCustomer : null,
      address: detailDiaChi.specificAddress
        ? detailDiaChi.specificAddress + ', ' + xaName + ', ' + huyenName + ', ' + tinhName
        : '',
      note: khachHang.note ? khachHang.note : '',
      moneyShip: giaoHang ? shipTotal : 0,
      moneyReduce: totalMoneyVoucher ? totalMoneyVoucher : '',
      totalMoney: totalPriceCart ? totalPriceCart : '',
      moneyAfter: totalPrice ? totalPrice : '',
      type: giaoHang === true ? 1 : 0,
      receivingMethod: giaoHang === true ? 1 : 0,
      percentMoney: percentMoney === 0 ? 0 : percentMoney,
      desiredReceiptDate: timeShip ? timeShip : '',
    }

    const title = 'Xác nhận đặt hàng ?'
    const text = ''
    confirmSatus(title, text, theme).then((result) => {
      if (result.isConfirmed) {
        const handleSuccessfulConfirmation = () => {
          sellApi.addBill(data, id).then((response) => {
            if (response.data.success) {
              disconnectApp()
              toast.success('Xác nhận thành công', {
                position: toast.POSITION.TOP_RIGHT,
              })
              if (!giaoHang) {
                printBill(id)
              }
              getAllBillTaoDonHang()
              setSelectBill('')
            }
          })
        }

        const filteredApp = app.filter((a) => a.idBill === idBill)
        if (filteredApp.length > 0) {
          const idApp = filteredApp[0].idApp

          const subscribeToTopic = stompClient.subscribe(
            `/topic/bill-comfirm/${idBill}`,
            (response) => {
              const result = JSON.parse(response.body)
              handleBillConfirmation(result)
            },
          )
          stompClient.send(
            `/topic/app-comfirm/${idApp}`,
            {},
            JSON.stringify({ data: data, giaoDich: payOrderByIdBill }),
          )
          let timerInterval
          Swal.fire({
            title: 'Đang chờ khách hàng xác nhận...',
            html: 'Trong <b>10</b> giây khách hàng không phản hồi coi như đồng ý',
            showConfirmButton: false,
            timer: 10000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              const timer = Swal.getPopup().querySelector('b')
              let remainingTime = Math.ceil(Swal.getTimerLeft() / 1000) // Chuyển đổi từ mili giây sang giây và làm tròn lên
              timer.textContent = `${remainingTime}`
              timerInterval = setInterval(() => {
                remainingTime = Math.ceil(Swal.getTimerLeft() / 1000)
                timer.textContent = `${remainingTime}`
              }, 1000)
            },
            willClose: () => {
              clearInterval(timerInterval)
            },
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              subscribeToTopic.unsubscribe()
              handleSuccessfulConfirmation()
            }
          })

          const handleBillConfirmation = (result) => {
            Swal.close()
            subscribeToTopic.unsubscribe()
            if (result === false) {
              toast.warning('Xác nhận đơn hàng bị khách hàng từ chối!')
            } else {
              handleSuccessfulConfirmation()
            }
          }
        } else {
          handleSuccessfulConfirmation()
        }
      }
    })
  }

  const printBill = async (idBill) => {
    try {
      const response = await axios.get(url + '/in-hoa-don/' + idBill, { responseType: 'blob' })
      const pdfContent = await new Response(response.data).blob()

      // Tạo URL từ Blob
      const pdfUrl = URL.createObjectURL(pdfContent)

      // In PDF khi lấy được nội dung
      printJS({ printable: pdfUrl, type: 'pdf', header: 'Header for the PDF' })

      // Đảm bảo giải phóng tài nguyên khi không cần thiết
      URL.revokeObjectURL(pdfUrl)
    } catch (error) {
      console.error('Error fetching or printing PDF:', error)
    }
  }
  const totalSum = listProductDetailBill.reduce((sum, cart) => {
    if (cart.value) {
      return sum + calculateDiscountedPrice(cart.price, cart.value) * cart.quantity
    } else {
      return sum + cart.price * cart.quantity
    }
  }, 0)

  const totalPriceCart = totalSum
  const ShipingFree = giaoHang ? shipTotal : 0
  // const moneyReducedVoucher = 0

  const moneyVoucher =
    voucher.typeValue === 0 ? (voucher.value * totalPriceCart) / 100 : voucher.value
  const totalMoneyReduce = moneyVoucher > voucher.maximumValue ? voucher.maximumValue : moneyVoucher
  const totalMoneyVoucher = totalMoneyReduce > totalSum ? totalSum : totalMoneyReduce // giảm gia
  const moneyPercent =
    percentMoney < 0 || percentMoney > 100
      ? 0
      : ((totalPriceCart + ShipingFree - totalMoneyReduce) * percentMoney) / 100
  const totalPrice = totalPriceCart + Number(ShipingFree) - totalMoneyVoucher - moneyPercent

  const moneyUnqualified =
    voucherUnqualified.minimumAmount > voucher.minimumAmount &&
    voucherUnqualified.maximumValue > voucher.maximumValue
      ? Number(voucherUnqualified.minimumAmount) - Number(totalSum)
      : 0

  // const moneyVoucherUnqualified =
  //   voucherUnqualified.typeValue === 0
  //     ? (voucherUnqualified.value * totalSum) / 100
  //     : voucherUnqualified.value
  // const moneyReducerUnqualified =
  //   moneyVoucherUnqualified > voucherUnqualified.maximumValue
  //     ? voucherUnqualified.maximumValue
  //     : moneyVoucherUnqualified

  const [qrScannerVisible, setQrScannerVisible] = useState(false)
  const handleOpenQRScanner = () => {
    setQrScannerVisible(true)
  }
  const handleCloseQRScanner = () => {
    setQrScannerVisible(false)
  }
  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const handleScan = (qrData) => {
    sellApi
      .addBillDetailByIdProductDetail(qrData, idBill)
      .then(() => {
        toast.success('Thêm sản phẩm thành công', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .finally(() => {
        fectchProductBillSell(idBill)
        setQrScannerVisible(false)
      })
  }

  const deleteTransaction = (id) => {
    sellApi
      .deleteTransaction(id)
      .then(() => {
        toast.warning('Huỷ thanh toán thành công', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .finally(() => {
        fetchPayOrderByIdBill(idBill)
        fetchTotalMoneyPayOrderByIdBill(idBill)
      })
  }
  const isAmountNegative = totalPrice - totalMoneyPayOrderByIdBill <= 0

  const addBillorder = (id) => {
    const newErrors = {}
    let checkAA = 0
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
    if (!customerAmount) {
      newErrors.customerAmount = 'Tiền khách đưa không được để trống'
      checkAA++
    } else if (Number(customerAmount) <= 0) {
      newErrors.customerAmount = 'Tiền khách đưa phải lớn hơn 0'
      checkAA++
    } else {
      const sanitizedCustomerAmount = parseInt(customerAmount.replace(/\D/g, ''), 10)
      if (Number(sanitizedCustomerAmount) === 0) {
        newErrors.customerAmount = 'Tiền khách đưa phải lớn hơn 0'
        checkAA++
      } else if (paymentMethod === '1' && Number(sanitizedCustomerAmount) > 50000000) {
        newErrors.customerAmount = 'Tiền khách đưa không lớn hơn 50tr VNĐ'
        checkAA++
      } else {
        newErrors.customerAmount = ''
      }
    }

    if (paymentMethod === '0' && !transactionCode) {
      newErrors.payMent = 'Vui lòng nhập mã giao dịch'
      checkAA++
    } else {
      newErrors.payMent = ''
    }

    if (giaoHang) {
      if (!detailDiaChi.name.trim()) {
        newErrors.name = 'Tên người nhận không được để trống'
        checkAA++
      } else if (detailDiaChi.name.trim().length > 100) {
        newErrors.name = 'Tên người nhận không được quá 100 kí tự.'
        checkAA++
      } else if (detailDiaChi.name.trim().length < 5) {
        newErrors.name = 'Tên người nhận không được bé hơn 5 kí tự.'
        checkAA++
      } else if (specialCharsRegex.test(detailDiaChi.name)) {
        newErrors.name = 'Tên người nhận không được có kí tự đặc biệt.'
        checkAA++
      } else {
        newErrors.name = ''
      }

      if (!detailDiaChi.specificAddress.trim()) {
        newErrors.specificAddress = 'Địa chỉ cụ thể không được để trống'
        checkAA++
      } else if (detailDiaChi.name.trim().length > 225) {
        newErrors.specificAddress = 'Địa chỉ cụ thể không được quá 225 kí tự.'
        checkAA++
      } else {
        newErrors.specificAddress = ''
      }

      if (!detailDiaChi.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Vui lòng nhập Số điện thoại.'
        checkAA++
      } else {
        const phoneNumberRegex = /^(0[1-9][0-9]{8})$/
        if (!phoneNumberRegex.test(detailDiaChi.phoneNumber.trim())) {
          newErrors.phoneNumber = 'Vui lòng nhập một số điện thoại hợp lệ (VD: 0987654321).'
          checkAA++
        } else {
          newErrors.phoneNumber = ''
        }
      }

      if (!detailDiaChi.provinceId) {
        newErrors.provinceId = 'Vui lòng chọn Tỉnh/Thành phố.'
        checkAA++
      } else {
        newErrors.provinceId = ''
      }

      if (!detailDiaChi.districtId) {
        newErrors.districtId = 'Vui lòng chọn Quận/Huyện.'
        checkAA++
      } else {
        newErrors.districtId = ''
      }

      if (!detailDiaChi.wardId) {
        newErrors.wardId = 'Vui lòng chọn Xã/Phường/Thị trấn.'
        checkAA++
      } else {
        newErrors.wardId = ''
      }
    }
    if (checkAA > 0) {
      setErrorAddBill(newErrors)
      return
    }
    if (listProductDetailBill.length === 0) {
      toast.error('Giỏ hàng chưa có sản phẩm', {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }
    const calculateDesiredValue = (customerAmount, totalPrice, totalMoneyPayOrderByIdBill) => {
      const sanitizedCustomerAmount = parseInt(customerAmount.replace(/\D/g, ''), 10)

      const remainingAmount = totalPrice - totalMoneyPayOrderByIdBill

      return sanitizedCustomerAmount > remainingAmount ? remainingAmount : sanitizedCustomerAmount
    }

    const dataPay = {
      note: noteTransaction ? noteTransaction : '',
      moneyAfter: totalPrice ? totalPrice : '',
      customerAmount: customerAmount.replace(/\D/g, ''),
      transactionCode: transactionCode ? transactionCode : null,
      paymentMethod: paymentMethod === '1' ? 1 : 0,
      noteTransaction: noteTransaction ? noteTransaction : null,
      totalMoney: customerAmount.replace(/\D/g, ''),
      percentMoney: percentMoney === 0 ? 0 : percentMoney,
    }

    sellApi.payOrder(dataPay, id).then((response) => {
      // getAllBillTaoDonHang()
      // setSelectBill('')

      setCustomerAmount(0)
      setTransactionCode('')
      fetchPayOrderByIdBill(idBill)
      fetchTotalMoneyPayOrderByIdBill(idBill)
    })
  }

  useEffect(() => {
    setSoluong({
      idBill: idBill,
      quantity: listProductDetailBill.reduce((count, cart) => {
        return count + parseInt(cart.quantity)
      }, 0),
    })
  }, [listProductDetailBill, idBill])

  const ExcessMoney = (customerAmount, totalPrice, totalMoneyPayOrderByIdBill) => {
    const sanitizedCustomerAmount = parseInt(String(customerAmount).replace(/\D/g, ''), 10)

    const remainingAmount = totalPrice - totalMoneyPayOrderByIdBill

    return sanitizedCustomerAmount - remainingAmount
  }
  useEffect(() => {
    stompClient = Stomp.over(() => new SockJS(socketUrl))
    stompClient.connect({}, onConnect)

    return () => {
      stompClient.disconnect()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idBill, listProductDetailBill])

  const app = useSelector(GetApp)
  const onConnect = () => {
    stompClient.subscribe(`/topic/online-bill/${idBill}`, (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        switch (data.method) {
          case 'PUT':
            if (data.data) {
              const updatedList = listProductDetailBill.map((e) => {
                return e.idBillDetail === data.data.idBillDetail ? data.data : e
              })
              setListProductDetailBill(updatedList)
            }
            break
          case 'DELETE':
            if (data.id) {
              const updatedList = listProductDetailBill.filter((e) => e.id !== data.id)
              setListProductDetailBill(updatedList)
            }
            break
          case 'POST':
            if (data.data) {
              const updatedList = listProductDetailBill.filter((e) => e.id !== data.data.id)
              setListProductDetailBill([...updatedList, data.data])
            }
            break
          default:
            break
        }
      }
    })
  }

  const dispatch = useDispatch()
  const disconnectApp = () => {
    const mess = { idOrder: null }
    const idApp = app.find((e) => e.idBill === idBill)
    if (idApp) {
      dispatch(setApp([...app.filter((e) => e.idApp !== idApp.idApp)]))
      stompClient.send(`/topic/app-online/${idApp.idApp}`, {}, JSON.stringify(mess))
    }
  }

  return (
    <>
      <TableContainer component={Paper} variant="elevation" sx={{ mb: 4 }}>
        <Box
          p={2}
          sx={{
            borderBottom: '1px dotted gray',
          }}>
          <Tooltip title="Xóa sản phẩm">
            <DeleteForeverIcon
              style={{ paddingTop: '8px', color: 'red' }}
              onClick={() => deleteProductDetail(idBill, selectedProductIds)}
            />
          </Tooltip>
          <Typography fontWeight={'bold'} variant="h6" display={'inline'}>
            Sản phẩm
          </Typography>
          {app.filter((a) => a.idBill === idBill).length > 0 && (
            <Tooltip title="Ngắt kết nối">
              <Button
                onClick={disconnectApp}
                sx={{ float: 'right', borderRadius: '8px', ml: 3 }}
                size="small"
                variant="contained"
                color="error">
                <AiOutlineDisconnect size={20} />
              </Button>
            </Tooltip>
          )}
          <Button
            onClick={openAddProductModal}
            sx={{ float: 'right', borderRadius: '8px' }}
            size="small"
            variant="outlined"
            color="cam">
            Thêm sản phẩm
          </Button>
          <Button
            sx={{
              float: 'right',
              mr: 3,
            }}
            color="cam"
            className="btnqr"
            size="small"
            variant="outlined"
            onClick={handleOpenQRScanner}>
            <QrCodeIcon /> Quét QR sản phẩm
          </Button>
          <Modal open={qrScannerVisible} onClose={handleCloseQRScanner}>
            <Box sx={styleModal}>
              <Scanner handleScan={handleScan} setOpen={setQrScannerVisible} />
            </Box>
          </Modal>
        </Box>

        {showModal && (
          <ModelSell
            load={fectchProductBillSell}
            idBill={idBill}
            open={showModal}
            setOPen={closeAddProductModal}
            totalSum={totalSum}
          />
        )}

        <Box>
          <Box sx={{ maxHeight: '55vh', overflow: 'auto' }}>
            {listProductDetailBill.length > 0 ? (
              listProductDetailBill.map((cart, index) => (
                <Table>
                  <TableRow sx={{ border: 0 }} key={cart.id}>
                    <TableCell width={'5%'}>
                      <Checkbox
                        key={cart.id}
                        checked={selectedRows.indexOf(cart.id) !== -1}
                        onChange={(event) => handleRowCheckboxChange(event, cart.id)}
                        style={{ color: selectedRows.indexOf(cart.id) !== -1 ? 'orange' : 'black' }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell style={{ verticalAlign: 'middle' }} sx={{ px: 0 }} width={'40%'}>
                      <Box
                        component="span"
                        display={{ sm: 'inline', xs: 'none' }}
                        style={{ position: 'relative' }}>
                        <img
                          alt="error"
                          src={cart.image}
                          style={{
                            height: '120px',
                            width: '120px',
                            verticalAlign: 'middle',
                            borderRadius: '10px',
                          }}
                        />
                        {cart.value && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '-270%',
                              left: '0',
                              marginLeft: '10px',
                              backgroundColor:
                                cart.value >= 1 && cart.value <= 50
                                  ? '#66CC00'
                                  : cart.value >= 51 && cart.value <= 80
                                    ? '#FF9900'
                                    : '#FF0000',
                              color: 'white',
                              padding: '3px 15px',
                              borderRadius: '10px',
                            }}
                            className="discount">
                            {cart.value}%
                          </div>
                        )}
                      </Box>
                      <span
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          marginLeft: '10px',
                          maxWidth: '70%',
                        }}>
                        <p style={{ margin: 0 }}>
                          <b>{cart.nameProduct}</b>
                        </p>
                        <p style={{ color: 'red', margin: '5px 0' }}>
                          {cart.value ? (
                            <div>
                              <div className="promotion-price">{`${formatCurrency(
                                cart.price,
                              )}`}</div>{' '}
                              <div>
                                <span style={{ color: 'red', fontWeight: 'bold' }}>
                                  {`${formatCurrency(
                                    calculateDiscountedPrice(cart.price, cart.value),
                                  )}`}
                                </span>{' '}
                              </div>
                            </div>
                          ) : (
                            <div>{`${formatCurrency(cart.price)}`}</div>
                          )}
                        </p>
                        <p style={{ margin: 0 }}>size:{cart.size}</p>
                      </span>
                    </TableCell>
                    <TableCell sx={{ px: 0 }} width={'5%'}>
                      <InputQuantity
                        cart={cart}
                        decreaseQuantityBillDetail={decreaseQuantityBillDetail}
                        increaseQuantityBillDetail={increaseQuantityBillDetail}
                        inputQuantityBillDetail={inputQuantityBillDetail}
                        totalSum={totalSum}
                        key={'input' + cart.id}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'red',
                        fontWeight: 'bold',
                      }}
                      width={'20%'}
                      align="center">
                      {cart.value ? (
                        formatCurrency(
                          calculateDiscountedPrice(cart.price, cart.value) * cart.quantity,
                        )
                      ) : (
                        <span>{`${formatCurrency(cart.price * cart.quantity)}`}</span>
                      )}
                    </TableCell>
                    <TableCell align="center" width={'10%'}>
                      <Tooltip title="Xóa sản phẩm">
                        <div
                          style={{
                            backgroundColor: 'red',
                            color: 'white',
                            width: '45px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => rollBackQuantityProductDetail(idBill, cart.id)}>
                          <RiDeleteBin6Line />
                        </div>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </Table>
              ))
            ) : (
              <Empty />
            )}
          </Box>
          <Stack
            m={2}
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-start"
            spacing={12}>
            <Typography sx={{ marginRight: '30px' }} fontWeight={'bold'}>
              Tổng tiền
            </Typography>
            <Box>
              <Typography fontWeight={'bold'} style={{ color: 'red' }}>
                {formatCurrency(totalSum)}
              </Typography>
            </Box>
          </Stack>
        </Box>
        {/* ) : (
          'Không có sản phẩm nào '
        )} */}
      </TableContainer>
      <Paper sx={{ mb: 7 }}>
        <Box p={2} sx={{ borderBottom: '1px dotted gray' }}>
          <Typography fontWeight={'bold'} variant="h6" display={'inline'}>
            Khách hàng
          </Typography>
          <Button
            onClick={() => {
              setIsShowCustomer(true)
            }}
            sx={{ float: 'right', borderRadius: '8px' }}
            size="small"
            variant="outlined"
            color="cam">
            <Person4Icon fontSize="small" /> Chọn khách hàng
          </Button>
          <Modal
            open={isShowCustomer}
            onClose={() => {
              setIsShowCustomer(false)
            }}>
            <Box sx={styleModalProduct}>
              <Toolbar sx={{ mb: 1 }}>
                <Box
                  sx={{
                    color: 'black',
                    flexGrow: 1,
                  }}>
                  <Typography variant="h6" component="div">
                    Tìm kiếm khách hàng
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => {
                    setIsShowCustomer(false)
                  }}
                  aria-label="close"
                  color="error"
                  style={{
                    boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)',
                  }}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>
              <Container>
                <Box>
                  <TextField
                    sx={{ width: '40%' }}
                    className="search-field"
                    size="small"
                    color="cam"
                    value={searchKhachHang.nameSearch || ''}
                    placeholder="Tìm kiếm tên hoặc sđt hoặc email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="cam" />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      setSearchKhachHang({ ...searchKhachHang, nameSearch: e.target.value })
                    }}
                  />
                  <Button
                    onClick={() => {
                      setIsShowAddCustomer(true)
                      setErrors({
                        fullName: '',
                        email: '',
                        phoneNumber: '',
                        dateBirth: '',
                        provinceId: '',
                        districtId: '',
                        wardId: '',
                        specificAddress: '',
                      })
                      clearSelectAddress()
                    }}
                    sx={{ ml: 2 }}
                    variant="outlined"
                    color="cam">
                    <AddIcon fontSize="small" /> Thêm khách hàng
                  </Button>
                </Box>
                <Box
                  sx={{
                    mt: 3,
                    maxHeight: '400px',
                    overflow: 'auto',
                  }}></Box>
                <Modal
                  open={isShowAddCustomer}
                  onClose={() => {
                    setIsShowAddCustomer(false)
                  }}>
                  <Box sx={styleModalAddCustomer}>
                    <Toolbar>
                      <Box
                        sx={{
                          color: 'black',
                          flexGrow: 1,
                        }}>
                        <Typography variant="h6" component="div">
                          Thêm khách hàng
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => {
                          setIsShowAddCustomer(false)
                        }}
                        aria-label="close"
                        color="error"
                        style={{
                          boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)',
                        }}>
                        <CloseIcon />
                      </IconButton>
                    </Toolbar>
                    <Container>
                      <TextField
                        sx={{ mt: 2 }}
                        label="Tên khách hàng"
                        id="outlined-basic"
                        variant="outlined"
                        type="text"
                        size="small"
                        fullWidth
                        onChange={(e) => {
                          setKhachHang({ ...khachHang, fullName: e.target.value.trim() })
                          updateDiaChi()
                          setErrors({ ...errors, fullName: '' })
                        }}
                        error={Boolean(errors.fullName)}
                        helperText={errors.fullName}
                      />
                      <TextField
                        sx={{ mt: 2 }}
                        label="Email"
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
                      <TextField
                        sx={{ mt: 2 }}
                        label="Số điện thoại"
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

                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={8}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker
                                format={'DD-MM-YYYY'}
                                label="Ngày sinh"
                                sx={{ width: '100%' }}
                                className="small-datepicker"
                                onChange={(e) => {
                                  setKhachHang({
                                    ...khachHang,
                                    dateBirth: dayjs(e).format('DD-MM-YYYY'),
                                  })
                                  setErrors({ ...errors, dateBirth: '' })
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                          <Typography variant="body2" color="error">
                            {errors.dateBirth}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl size="small">
                            <RadioGroup
                              label
                              row
                              value={khachHang.gender}
                              onChange={handleGenderChange}>
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
                      </Grid>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={4}>
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
                                <TextField placeholder="Tỉnh/thành phố" color="cam" {...params} />
                              )}
                            />
                          </Box>
                          <Typography variant="body2" color="error">
                            {errors.provinceId}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
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
                                <TextField placeholder="Quận/huyện" color="cam" {...params} />
                              )}
                            />
                          </Box>
                          <Typography variant="body2" color="error">
                            {errors.districtId}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ minWidth: 120 }}>
                            <Autocomplete
                              clearIcon={null}
                              fullWidth
                              size="small"
                              className="search-field"
                              id="xa-autocomplete"
                              value={selectedXa}
                              onChange={handleXaChange}
                              options={xa.map((item) => ({
                                label: item.wardName,
                                id: item.wardCode,
                              }))}
                              getOptionLabel={(options) => options.label}
                              renderInput={(params) => (
                                <TextField
                                  placeholder="Xã/phường/thị trấn"
                                  color="cam"
                                  {...params}
                                />
                              )}
                            />
                          </Box>
                          <Typography variant="body2" color="error">
                            {errors.wardId}
                          </Typography>
                        </Grid>
                      </Grid>
                      <TextField
                        sx={{ mt: 2 }}
                        label="Địa chỉ"
                        id="outlined-basic"
                        variant="outlined"
                        type="text"
                        size="small"
                        fullWidth
                        onChange={(e) => {
                          setDiaChi({
                            ...diaChi,
                            specificAddress:
                              e.target.value.trim() +
                              ', ' +
                              selectedXa.label +
                              ', ' +
                              selectedHuyen.label +
                              ', ' +
                              selectedTinh.label,
                          })
                          setErrors({ ...errors, specificAddress: '' })
                        }}
                        error={Boolean(errors.specificAddress)}
                        helperText={errors.specificAddress}
                      />
                      <Stack
                        mt={2}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        spacing={2}>
                        <Button onClick={() => onSubmit(khachHang)} variant="outlined" color="cam">
                          <b>Thêm</b>
                        </Button>
                      </Stack>
                    </Container>
                  </Box>
                </Modal>
              </Container>
              <Container>
                <Table className="tableCss mt-5">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" width={'7%'}>
                        STT
                      </TableCell>
                      <TableCell align="center" width={'25%'}>
                        Email
                      </TableCell>
                      <TableCell align="center" width={'12%'}>
                        Họ tên
                      </TableCell>
                      <TableCell align="center" width={'15%'}>
                        Ngày sinh
                      </TableCell>
                      <TableCell align="center" width={'15%'}>
                        Số điện thoại
                      </TableCell>
                      <TableCell align="center" width={'15%'}>
                        Giới tính
                      </TableCell>
                      <TableCell align="center" width={'15%'}>
                        Trạng thái
                      </TableCell>
                      <TableCell align="center" width={'10%'}>
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {listKhachHang.length > 0 ? (
                    <TableBody>
                      {listKhachHang.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="center">{row.stt}</TableCell>
                          <TableCell align="center">{row.email}</TableCell>
                          <TableCell align="center">{row.fullName}</TableCell>
                          <TableCell align="center">
                            {dayjs(row.dateBirth).format('MM/DD/YYYY')}
                          </TableCell>
                          <TableCell align="center">{row.phoneNumber}</TableCell>
                          <TableCell align="center">{row.gender ? 'Nam' : 'Nữ'}</TableCell>
                          <TableCell align="center">
                            {row.status === 0 ? (
                              <Chip
                                // onClick={() => deleteKhachHang(row.id)}
                                className="chip-hoat-dong"
                                size="small"
                                label="Hoạt động"
                              />
                            ) : (
                              <Chip
                                className="chip-khong-hoat-dong"
                                size="small"
                                label="Không hoạt động"
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              color="cam"
                              onClick={() => {
                                handleDiaChi(row.id)
                                setNameCustomer(row.fullName)
                              }}>
                              <b>chọn</b>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" style={{ width: '100%' }}>
                          <img
                            style={{ width: '1100px', height: '300px' }}
                            src={require('../../../assets/image/no-data.png')}
                            alt="No-data"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>

                <Stack
                  mt={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={0}>
                  <Typography component="span" variant={'body2'} mt={0.5}>
                    <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>
                      Xem
                    </Typography>
                    <Select
                      color="cam"
                      onChange={(e) => {
                        setSearchKhachHang({ ...searchKhachHang, size: e.target.value })
                      }}
                      sx={{ height: '25px', mx: 0.5 }}
                      size="small"
                      value={searchKhachHang.size}>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={15}>15</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                    </Select>
                    <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>
                      Khách hàng
                    </Typography>
                  </Typography>
                  <Pagination
                    page={searchKhachHang.page}
                    onChange={(e, value) => {
                      e.preventDefault()
                      setSearchKhachHang({ ...searchKhachHang, page: value })
                    }}
                    count={totalPages}
                    color="cam"
                    variant="outlined"
                  />
                </Stack>
              </Container>
            </Box>
          </Modal>
        </Box>
        <Box p={2}>
          <Box display={'inline'}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                width={'57%'}
                alignItems="center"
                spacing={2}>
                <b>Tên Khách hàng </b>
                <span
                  style={{
                    padding: '5px 10px',
                    borderRadius: '50px',
                    marginLeft: '20px',
                    backgroundColor: 'rgb(240,240,240)',
                  }}>
                  {nameCustomer !== '' ? nameCustomer : 'khách lẻ'}
                </span>
                <Button
                  sx={{ py: '6.7px', ml: 1 }}
                  color="cam"
                  size="small"
                  variant="outlined"
                  style={{ display: btnad && giaoHang ? 'block' : 'none' }}
                  onClick={() => setIsShowDiaChi(true)}>
                  <b>Chọn Địa chỉ</b>
                </Button>
              </Stack>

              <Box display={'inline'} sx={{ marginLeft: '350px' }}>
                <b>Giao hàng</b>
                <Switch
                  onChange={() => {
                    if (listProductDetailBill.length > 0) {
                      setGiaoHang(!giaoHang)
                      saveAddressKH()
                    } else {
                      toast.warning('Vui lòng thêm sản phẩm trước!')
                    }
                  }}
                  color="secondary"
                  checked={giaoHang}
                  size="small"
                />
              </Box>
            </Box>
            <Modal
              open={isShowDiaChi}
              onClose={() => {
                setIsShowDiaChi(false)
              }}>
              <Box sx={styleModalProduct}>
                <Toolbar sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      color: 'black',
                      flexGrow: 1,
                    }}>
                    <Typography variant="h6" component="div">
                      Danh sách Địa chỉ
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => {
                      setIsShowDiaChi(false)
                    }}
                    aria-label="close"
                    color="error"
                    style={{
                      boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)',
                    }}>
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
                <Container>
                  <Table className="tableCss mt-5">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" width={'7%'}>
                          STT
                        </TableCell>
                        <TableCell align="center" width={'25%'}>
                          Tên người nhận
                        </TableCell>
                        <TableCell align="center" width={'12%'}>
                          Số điện thoại
                        </TableCell>
                        <TableCell align="center" width={'15%'}>
                          Địa chỉ
                        </TableCell>
                        <TableCell align="center" width={'10%'}>
                          Thao tác
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listDiaChiDetail.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="center">{row.stt}</TableCell>
                          <TableCell align="center">{row.name}</TableCell>
                          <TableCell align="center">{row.phoneNumber}</TableCell>
                          <TableCell align="center">{row.specificAddress}</TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() => handleDetailDiaChi(row.id)}
                              variant="outlined"
                              color="cam">
                              <b>chọn</b>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button
                    variant="outlined"
                    color="cam"
                    sx={{ mt: 3 }}
                    onClick={() => {
                      setIsShowAddDiaChi(true)
                      setErrorsAA({
                        name: '',
                        email: '',
                        phoneNumber: '',
                        provinceId: '',
                        districtId: '',
                        wardId: '',
                        specificAddress: '',
                      })
                      clearSelectAddress()
                    }}>
                    Thêm địa chỉ
                  </Button>
                  <Pagination
                    page={initPage}
                    onChange={(_, page) => handleOnChangePage(page)}
                    count={totalPagesAd}
                    color="cam"
                    sx={{ float: 'right', mt: 3 }}
                    variant="outlined"
                  />
                  <Box
                    sx={{
                      mt: 3,
                      maxHeight: '400px',
                      overflow: 'auto',
                    }}></Box>
                  <Modal
                    open={isShowAddDiaChi}
                    onClose={() => {
                      setIsShowAddDiaChi(false)
                    }}>
                    <Box sx={styleModalAddCustomer}>
                      <Toolbar>
                        <Box
                          sx={{
                            color: 'black',
                            flexGrow: 1,
                          }}>
                          <Typography variant="h6" component="div">
                            Thêm địa chỉ
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => {
                            setIsShowAddDiaChi(false)
                          }}
                          aria-label="close"
                          color="error"
                          style={{
                            boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)',
                          }}>
                          <CloseIcon />
                        </IconButton>
                      </Toolbar>
                      <Container>
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <span className="required"> *</span>Tên người nhận
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              type="text"
                              size="small"
                              name="name"
                              fullWidth
                              onChange={(e) => {
                                setNewDiaChi({ ...newDiaChi, name: e.target.value })
                                setErrorsAA({ ...errorsAA, name: '' })
                              }}
                              error={Boolean(errorsAA.name)}
                              helperText={errorsAA.name}
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
                              name="phoneNumber"
                              fullWidth
                              onChange={(e) => {
                                setNewDiaChi({ ...newDiaChi, phoneNumber: e.target.value })
                                setErrorsAA({ ...errorsAA, phoneNumber: '' })
                              }}
                              error={Boolean(errorsAA.phoneNumber)}
                              helperText={errorsAA.phoneNumber}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                          <Grid item xs={12} md={4}>
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
                            </Box>
                            <Typography variant="body2" color="error">
                              {errorsAA.provinceId}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={4}>
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
                                options={
                                  huyen &&
                                  huyen.map((item) => ({
                                    label: item.districtName,
                                    id: item.districtID,
                                  }))
                                }
                                getOptionLabel={(options) => options.label}
                                renderInput={(params) => (
                                  <TextField placeholder="nhập tên huyện" color="cam" {...params} />
                                )}
                              />
                            </Box>
                            <Typography variant="body2" color="error">
                              {errorsAA.districtId}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
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
                                options={
                                  xa &&
                                  xa.map((item) => ({ label: item.wardName, id: item.wardCode }))
                                }
                                getOptionLabel={(options) => options.label}
                                renderInput={(params) => (
                                  <TextField placeholder="nhập tên Xã" color="cam" {...params} />
                                )}
                              />
                            </Box>
                            <Typography variant="body2" color="error">
                              {errorsAA.wardId}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                          <Typography>
                            <span className="required"> *</span>Địa chỉ cụ thể
                          </Typography>
                          <Grid item xs={12} md={12}>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              type="text"
                              size="small"
                              fullWidth
                              onChange={(e) => {
                                setNewDiaChi({
                                  ...newDiaChi,
                                  specificAddress: e.target.value,
                                })
                                setErrorsAA({ ...errorsAA, specificAddress: '' })
                              }}
                              error={Boolean(errorsAA.specificAddress)}
                              helperText={errorsAA.specificAddress}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mt: 3 }}>
                          <Grid item xs={12}>
                            <Button
                              onClick={() => onCreateDiaChi(newDiaChi)}
                              variant="outlined"
                              color="cam"
                              sx={{ float: 'right' }}>
                              Tạo Mới
                            </Button>
                          </Grid>
                        </Grid>
                      </Container>
                    </Box>
                  </Modal>
                </Container>
              </Box>
            </Modal>
          </Box>
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 md={7} xs={12} p={0}>
            <Box p={3} pt={0} pb={2} sx={{ display: !giaoHang ? 'none' : 'block' }}>
              <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Tên người nhận"
                    type="text"
                    fullWidth
                    size="small"
                    name="name"
                    value={detailDiaChi.name}
                    onChange={(e) => {
                      setDetailDiaChi({ ...detailDiaChi, name: e.target.value })
                      setErrorAddBill({ ...errorAddBill, name: '' })
                    }}
                    error={Boolean(errorAddBill.name)}
                    helperText={errorAddBill.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Số điện thoại"
                    type="text"
                    size="small"
                    fullWidth
                    name="phoneNumber"
                    value={detailDiaChi.phoneNumber}
                    onChange={(e) => {
                      setDetailDiaChi({ ...detailDiaChi, phoneNumber: e.target.value })
                      setErrorAddBill({ ...errorAddBill, phoneNumber: '' })
                    }}
                    error={Boolean(errorAddBill.phoneNumber)}
                    helperText={errorAddBill.phoneNumber}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 3 }}>
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
                    {errorAddBill.provinceId}
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
                    {errorAddBill.districtId}
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
                    {errorAddBill.wardId}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Địa chỉ cụ thể"
                    type="text"
                    fullWidth
                    size="small"
                    name="specificAddress"
                    value={detailDiaChi.specificAddress}
                    onChange={(e) => {
                      const updatedDetailDiaChi = { ...detailDiaChi }
                      updatedDetailDiaChi.specificAddress = e.target.value
                      setDetailDiaChi(updatedDetailDiaChi)
                      setErrorAddBill({ ...errorAddBill, specificAddress: '' })
                    }}
                    error={Boolean(errorAddBill.specificAddress)}
                    helperText={errorAddBill.specificAddress}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled={!giaoHang}
                    label="Ghi chú"
                    size="small"
                    fullWidth
                    onChange={(e) => setKhachHang({ ...khachHang, note: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>
            <Grid container>
              <Grid item xs={6} sx={{ display: !giaoHang ? 'none' : 'block' }}>
                <Box ml={3} color={!giaoHang ? '#E0E0E0' : ''}>
                  <LocalShipping sx={{ mb: '-5px', mr: '5px' }} />
                  <b>Đơn vị vận chuyển: </b>
                  <b style={{ color: !giaoHang ? '#E0E0E0' : 'rgb(20, 95, 227)' }}>
                    Giao hàng nhanh
                  </b>
                </Box>

                <Box ml={3} color={!giaoHang ? '#E0E0E0' : ''}>
                  <LocalShipping sx={{ mr: '5px' }} />
                  <b>Thời gian dự kiến: </b>
                  <b style={{ color: !giaoHang ? '#E0E0E0' : 'rgb(20, 95, 227)' }}>
                    {' '}
                    {timeShip !== '' ? dayjs(timeShip).format('DD/MM/YYYY') : ''}
                  </b>
                </Box>
              </Grid>
              <Grid item xs={6}>
                {giaoHang && (
                  <Box sx={{ float: 'right' }}>
                    <img
                      style={{ width: '200px', mb: '-5px', height: '110px' }}
                      src={require('../../../assets/image/ghnlogo.png')}
                      alt=""
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid2>
          <Grid2 md={5} xs={12} p={0}>
            <Box sx={{ ml: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Phiếu giảm giá"
                    value={voucher?.code}
                    size="small"
                    className="input-voucher-sell"
                    disabled
                    // InputProps={{
                    //   endAdornment: (
                    //     <Button
                    //       variant="contained"
                    //       color="cam"
                    //       onClick={() => {
                    //         setIsShowVoucher(true)
                    //         setAdCallVoucherOfSell({
                    //           ...adCallVoucherOfSell,
                    //           condition: parseFloat(totalSum),
                    //         })
                    //       }}>
                    //       <b>Chọn </b>
                    //     </Button>
                    //   ),
                    // }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Phần trăm giảm"
                    defaultValue={percentMoney}
                    size="small"
                    className="input-voucher-sell"
                    onChange={(e) => setPercentMoney(e.target.value)}
                  />
                  <span style={{ color: 'red', fontSize: '12px' }}>
                    {percentMoney === null || percentMoney === ''
                      ? ''
                      : !Number.isInteger(parseInt(percentMoney))
                        ? 'Giá trị nhập phải là số nguyên'
                        : percentMoney < 0
                          ? '* Phần trăm giẳm nhỏ nhất 0%'
                          : percentMoney > 100
                            ? '* Phần trăm giảm lớn nhất 100%'
                            : ''}
                  </span>
                </Grid>
              </Grid>
              {/* <Modal
                className="modal-voucher"
                open={isShowVoucher}
                onClose={() => {
                  setIsShowVoucher(false)
                }}>
                <Box sx={styleModalProduct}>
                  <Toolbar sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        color: 'black',
                        flexGrow: 1,
                      }}>
                      <Typography variant="h6" component="div">
                        Danh sách phiếu giảm giá
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => {
                        setIsShowVoucher(false)
                      }}
                      aria-label="close"
                      color="error"
                      style={{
                        boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)',
                      }}>
                      <CloseIcon />
                    </IconButton>
                  </Toolbar>
                  <Container className="modal-voucher-container-filter">
                    <Box>
                      <Grid container sx={{ mt: 1 }} spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            sx={{
                              '.MuiInputBase-input': { py: '7.5px' },
                            }}
                            size="small"
                            variant="outlined"
                            placeholder="Tìm phiếu giảm giá"
                            onChange={(e) =>
                              setAdCallVoucherOfSell({
                                ...adCallVoucherOfSell,
                                textSearch: e.target.value,
                                page: 1,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Stack
                            direction="row"
                            justifyContent="start"
                            alignItems="center"
                            spacing={1}>
                            <div className="filter-voucher">
                              <b>Kiểu</b>
                              <Select
                                displayEmpty
                                size="small"
                                value={adCallVoucherOfSell.typeSearch}
                                onChange={(e) =>
                                  setAdCallVoucherOfSell({
                                    ...adCallVoucherOfSell,
                                    typeSearch: e.target.value,
                                    page: 1,
                                  })
                                }>
                                <MenuItem value={null}>Kiểu</MenuItem>
                                <MenuItem value={0}>Công khai</MenuItem>
                                <MenuItem value={1}>Cá nhân</MenuItem>
                              </Select>
                              <b>Loại</b>
                              <Select
                                displayEmpty
                                size="small"
                                value={adCallVoucherOfSell.typeValueSearch}
                                onChange={(e) =>
                                  setAdCallVoucherOfSell({
                                    ...adCallVoucherOfSell,
                                    typeValueSearch: e.target.value,
                                    page: 1,
                                  })
                                }>
                                <MenuItem value={null}>Loại</MenuItem>
                                <MenuItem value={0}>Phần trăm</MenuItem>
                                <MenuItem value={1}>Giá tiền</MenuItem>
                              </Select>
                            </div>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box
                      sx={{
                        mt: 3,
                        maxHeight: '400px',
                        overflow: 'auto',
                      }}></Box>
                  </Container>
                  <Container>
                    <Table className="tableCss mt-5">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" width={'6%'}>
                            STT
                          </TableCell>
                          <TableCell align="center" width={'10%'}>
                            Mã
                          </TableCell>
                          <TableCell align="center" width={'10%'}>
                            Tên
                          </TableCell>
                          <TableCell align="center" width={'15%'}>
                            Giá trị
                          </TableCell>
                          <TableCell align="center" width={'15%'}>
                            Giá trị tối đa
                          </TableCell>
                          <TableCell align="center" width={'15%'}>
                            Điều kiện
                          </TableCell>
                          <TableCell align="center" width={'15%'}>
                            Kiểu
                          </TableCell>
                          <TableCell align="center" width={'15%'}>
                            Loại
                          </TableCell>
                          <TableCell align="center" width={'12%'}>
                            Ngày bắt đầu
                          </TableCell>
                          <TableCell align="center" width={'12%'}>
                            Ngày kết thúc
                          </TableCell>
                          <TableCell align="center" width={'10%'}>
                            Thao tác
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {listVoucher.length > 0 ? (
                        <TableBody>
                          {listVoucher.map((row) => (
                            <TableRow
                              key={row.id}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="center">{row.stt}</TableCell>
                              <TableCell align="center">{row.code}</TableCell>
                              <TableCell align="center">{row.name}</TableCell>
                              <TableCell align="center">
                                {row.typeValue === 0 ? row.value + '%' : formatCurrency(row.value)}
                              </TableCell>
                              <TableCell align="center">
                                {formatCurrency(row.maximumValue)}
                              </TableCell>
                              <TableCell align="center">
                                {formatCurrency(row.minimumAmount)}
                              </TableCell>
                              <TableCell align="center">
                                {row.type === 0 ? (
                                  <Chip className="chip-tat-ca" size="small" label="Công khai" />
                                ) : (
                                  <Chip className="chip-gioi-han" size="small" label="Cá nhân" />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {row.typeValue === 0 ? (
                                  <Chip className="chip-tat-ca" size="small" label="Phần trăm" />
                                ) : (
                                  <Chip className="chip-gioi-han" size="small" label="Giá tiền" />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs(row.startDate).format('DD/MM/YYYY HH:mm')}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs(row.endDate).format('DD/MM/YYYY HH:mm')}
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  variant="contained"
                                  onClick={() => handleVoucher(row.id)}
                                  color="success">
                                  <b>chọn</b>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      ) : (
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" style={{ width: '100%' }}>
                              <img
                                style={{ width: '1100px', height: '300px' }}
                                src={require('../../../assets/image/no-data.png')}
                                alt="No-data"
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                    <Pagination
                      variant="outlined"
                      color="cam"
                      page={adCallVoucherOfSell.page}
                      onChange={(_, page) => handelOnchangePage(page)}
                      count={totalPagesVoucher}
                    />
                  </Container>
                </Box>
              </Modal> */}
            </Box>
            <Box sx={{ m: 1, ml: 3, mr: 3 }}>
              {totalSum > 0 && moneyUnqualified > 0 && (
                <Typography className="notification-add-voucher">
                  Mua thêm {formatPrice(moneyUnqualified)} để được giảm{' '}
                  {voucherUnqualified.typeValue === 0
                    ? voucherUnqualified.value +
                      '% tối đa ' +
                      formatPrice(voucherUnqualified.maximumValue)
                    : formatPrice(voucherUnqualified.value)}
                </Typography>
              )}
              <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                <Typography>Tiền hàng</Typography>
                <Typography>{formatCurrency(totalSum)}</Typography>
              </Stack>
              <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                <Typography>Phí vận chuyển</Typography>
                <TextField
                  value={giaoHang ? formatPrice(shipTotal) : '0 VND '}
                  onChange={handleChangeShip}
                  variant="standard"
                  sx={{ width: '100px' }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  size="small"
                />
              </Stack>
              <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                <Typography>Giảm giá</Typography>
                <Typography>{formatCurrency(totalMoneyVoucher)}</Typography>
              </Stack>
              <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                <Typography>
                  <b>Tổng số tiền</b>
                </Typography>
                <Typography color={'red'}>
                  <b>{formatCurrency(totalPrice)}</b>
                </Typography>
              </Stack>

              <Stack sx={{ my: '29px' }} direction={'row'} justifyContent={'space-between'}>
                <Typography>
                  <b>Khách thanh toán:</b>
                  <Button
                    style={{
                      color: 'black',
                      border: '1px solid black',
                      width: '25px',
                      height: '30px',
                      marginLeft: '30px',
                    }}
                    onClick={handleOpen}>
                    <PaymentIcon />
                  </Button>
                </Typography>
                <Typography style={{ fontWeight: 700, color: 'red' }}>
                  {totalMoneyPayOrderByIdBill
                    ? formatCurrency(totalMoneyPayOrderByIdBill)
                    : '0 VNĐ'}
                </Typography>
              </Stack>
              {totalMoneyPayOrderByIdBill - totalPrice !== 0 && (
                // <Stack
                //   sx={{ marginTop: '20px' }}
                //   direction="row"
                //   justifyContent="space-between"
                //   alignItems="center"
                //   spacing={2}>
                //   <Typography style={{ fontSize: '20px', fontWeight: 700 }}>Tiền thừa</Typography>
                //   <Typography style={{ color: 'red', fontWeight: 700 }}>
                //     {formatCurrency(
                //       ExcessMoney(customerAmount, totalPrice, totalMoneyPayOrderByIdBill),
                //     )}
                //   </Typography>
                // </Stack>
                <Stack
                  sx={{ marginTop: '20px' }}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}>
                  <Typography style={{ fontSize: '16px', fontWeight: 700 }}>
                    {totalPrice < totalMoneyPayOrderByIdBill ? 'Tiền thừa:' : 'Tiền thiếu'}
                  </Typography>
                  <Typography style={{ color: 'red', fontWeight: 700 }}>
                    {formatCurrency(
                      totalPrice - totalMoneyPayOrderByIdBill < 0
                        ? Math.abs(totalPrice - totalMoneyPayOrderByIdBill)
                        : totalPrice - totalMoneyPayOrderByIdBill,
                    )}{' '}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Grid2>
        </Grid2>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={styleCustomerPays}>
              <HighlightOffIcon onClick={() => handleClose()} sx={{ float: 'right' }} />
              <Typography
                id="modal-modal-title"
                sx={{
                  fontSize: '30px',
                  fontWeight: 1000,
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
                component="h2">
                THANH TOÁN
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography style={{ fontSize: '20px', fontWeight: 700 }}>
                  Tổng tiền hàng{' '}
                </Typography>
                <Typography style={{ color: 'red', fontWeight: 700 }}>
                  {formatCurrency(totalPrice)}{' '}
                </Typography>
              </Stack>
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Button
                  style={{
                    backgroundColor: isAmountNegative
                      ? '#808080'
                      : paymentMethod === '0'
                        ? '#FF3333'
                        : 'pink',
                    borderRadius: '20px',
                    width: '200px',
                    color: 'white',
                  }}
                  disabled={isAmountNegative}
                  onClick={() => setPaymentMethod('0')}>
                  Chuyển khoản
                </Button>
                <Button
                  style={{
                    backgroundColor: isAmountNegative
                      ? '#808080'
                      : paymentMethod === '1'
                        ? '#32CD32'
                        : 'pink',
                    borderRadius: '20px',
                    width: '200px',
                    color: 'white',
                  }}
                  disabled={isAmountNegative}
                  onClick={() => setPaymentMethod('1')}>
                  Tiền mặt
                </Button>
              </div>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                style={{ marginTop: '20px' }}>
                <TextField
                  color="cam"
                  label="Tiền khách đưa"
                  variant="standard"
                  fullWidth
                  disabled={isAmountNegative}
                  sx={{
                    width: paymentMethod === '0' ? '45%' : '100%',
                    marginTop: '10px',
                    display: paymentMethod === '0' || paymentMethod === '1' ? 'block' : 'none',
                  }}
                  size="small"
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/\D/g, '')

                    setCustomerAmount(formatCurrency(inputValue))
                    setErrorAddBill({ ...errorAddBill, customerAmount: '' })
                  }}
                  // onChange={(e) => {
                  //   setCustomerAmount(e.target.value)
                  // }}
                  value={customerAmount}
                  error={Boolean(errorAddBill.customerAmount)}
                  helperText={errorAddBill.customerAmount}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  color="cam"
                  label="Mã giao dịch"
                  variant="standard"
                  disabled={isAmountNegative}
                  fullWidth
                  sx={{
                    width: '45%',
                    marginTop: '10px',
                    display: paymentMethod === '0' ? 'block' : 'none',
                  }}
                  size="small"
                  value={transactionCode}
                  onChange={(e) => {
                    setTransactionCode(e.target.value)
                    setErrorAddBill({ ...errorAddBill, payMent: '' })
                  }}
                  error={Boolean(errorAddBill.payMent)}
                  helperText={errorAddBill.payMent}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
              <div className="css-table-sell">
                <TableContainer component={Paper}>
                  <Table aria-label="simple table" style={{ height: '150px' }}>
                    <TableHead sx={{ backgroundColor: '#FFA500' }}>
                      <TableRow>
                        <TableCell align="center">STT</TableCell>
                        <TableCell align="center">Mã giao dịch</TableCell>
                        <TableCell align="center">Phương thức</TableCell>
                        <TableCell align="center">Số tiền</TableCell>
                        <TableCell align="center">Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payOrderByIdBill.map((item, index) => (
                        <TableRow
                          key={item.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{item.transactionCode}</TableCell>
                          <TableCell align="center">
                            {item.paymentMethod === 1 ? 'Tiền mặt' : 'Chuyển khoản'}{' '}
                          </TableCell>
                          <TableCell align="center">
                            {item.totalMoney ? formatCurrency(item.totalMoney) : 0}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Hủy thanh toán">
                              <DeleteIcon
                                style={{
                                  color: 'red',
                                  pointerEvents: isAmountNegative ? 'none' : 'auto',
                                }}
                                onClick={() => deleteTransaction(item.idTransaction)}
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              {totalMoneyPayOrderByIdBill - totalPrice !== 0 && (
                // <Stack
                //   sx={{ marginTop: '20px' }}
                //   direction="row"
                //   justifyContent="space-between"
                //   alignItems="center"
                //   spacing={2}>
                //   <Typography style={{ fontSize: '20px', fontWeight: 700 }}>Tiền thừa</Typography>
                //   <Typography style={{ color: 'red', fontWeight: 700 }}>
                //     {formatCurrency(
                //       ExcessMoney(customerAmount, totalPrice, totalMoneyPayOrderByIdBill),
                //     )}
                //   </Typography>
                // </Stack>
                <Stack
                  sx={{ marginTop: '20px' }}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}>
                  <Typography style={{ fontSize: '16px', fontWeight: 700 }}>
                    {totalPrice < totalMoneyPayOrderByIdBill ? 'Tiền thừa:' : 'Tiền thiếu'}
                  </Typography>
                  <Typography style={{ color: 'red', fontWeight: 700 }}>
                    {formatCurrency(
                      totalPrice - totalMoneyPayOrderByIdBill < 0
                        ? Math.abs(totalPrice - totalMoneyPayOrderByIdBill)
                        : totalPrice - totalMoneyPayOrderByIdBill,
                    )}{' '}
                  </Typography>
                </Stack>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}>
                <Button
                  disabled={isAmountNegative}
                  variant="contained"
                  sx={{ marginLeft: '20px' }}
                  color="success"
                  onClick={() => addBillorder(idBill)}>
                  Xác nhận
                </Button>
              </div>
            </Box>
          </Modal>
        </div>
        <Box p={2}>
          <Stack direction={'row'} justifyContent={'right'}>
            <Button
              variant="outlined"
              style={{ borderRadius: '8px' }}
              color="cam"
              onClick={() => addBill(idBill)}>
              Xác nhận đặt hàng
            </Button>
          </Stack>
        </Box>
      </Paper>
    </>
  )
}
