import '../hoadon/hoaDonStyle.css'
import {
  Paper,
  Grid,
  Button,
  Chip,
  Stack,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Box,
  IconButton,
  TextField,
  Typography,
  FormControlLabel,
  Radio,
  FormLabel,
  RadioGroup,
  FormControl,
  Divider,
  Tooltip,
  Switch,
  Modal,
  Toolbar,
  Container,
  TableHead,
  Select,
  MenuItem,
  Pagination,
  InputAdornment,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { CiCircleRemove } from 'react-icons/ci'
import React, { useState, useEffect } from 'react'
import hoaDonApi from '../../../api/admin/hoadon/hoaDonApi'
import { getStatus } from '../../../services/constants/statusHoaDon'
import { useNavigate, useParams } from 'react-router-dom'
import lichSuGiaoDichApi from '../../../api/admin/hoadon/lichSuGiaoDich'
import AdBillTransaction from './AdBillTransaction'
import lichSuHoaDonApi from '../../../api/admin/hoadon/lichSuHoaDonApi'
import hoaDonChiTietApi from '../../../api/admin/hoadon/hoaDonChiTiet'
import BillHistoryDialog from './AdDialogOrderTimeLine'
import { getStatusStyle } from './getStatusStyle'
import { setLoading as setLoad } from '../../../services/slices/loadingSlice'

import Empty from '../../../components/Empty'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import DialogAddUpdate from '../../../components/DialogAddUpdate'
import TimeLine from './TimeLine'
import AdBillModalThemSP from './AdBillModalThemSP'
import confirmSatus from '../../../components/comfirmSwal'
import ModalAdBillUpdateAddress from './AdBillModalUpdateAddress'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { socketUrl, url } from '../../../services/url'
import axios from 'axios'
import { IoReturnUpBack } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { GetUserAdmin } from '../../../services/slices/userAdminSlice'
import printJS from 'print-js'
import dayjs from 'dayjs'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { TbTruckReturn } from 'react-icons/tb'
import { IoIosAdd } from 'react-icons/io'
import sellApi from '../../../api/admin/sell/SellApi'
import ghnAPI from '../../../api/admin/ghn/ghnApi'
import checkStartApi from '../../../api/checkStartApi'

const listHis = [{ link: '/admin/bill', name: 'Quản lý đơn hàng' }]

var stompClient = null
export default function AdBillDetail() {
  const { id } = useParams()
  const userAdmin = useSelector(GetUserAdmin)
  const [billDetail, setBillDetail] = useState()
  const [loading, setLoading] = useState(true)
  const [listOrderTimeLine, setListOrderTimeLine] = useState([])
  const [loadingTimeline, setLoadingTimeline] = useState(true)
  const [listTransaction, setListTransaction] = useState([])
  const [loadingTransaction, setLoadinTransaction] = useState(true)
  const [listBillDetail, setListBillDetail] = useState([])
  const [loadingListBillDetail, setLoadingListBillDetail] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [moneyAfter, setMoneyAfter] = useState(0)
  const [tienShip, setTienShip] = useState(0)
  const [tienShip2, setTienShip2] = useState(0)
  const [openModalConfirm, setOpenModalConfirm] = useState(false)
  const [openModalConfirmDelive, setOpenModalConfirmDelive] = useState(false)
  const [openModalConfirmPayment, setOpenModalConfirmPayment] = useState(false)
  const [openModalConfirmComplete, setOpenModalConfirmComplete] = useState(false)
  const [openModalReturnProduct, setOpenModalReturnProduct] = useState(false)
  const [openCodalConfirmReceived, setOpenModalConfirmReceived] = useState(false)
  const [openmodalReturnStt, setOpenModalReturnStt] = useState(false)
  const [openModalCancelBill, setOpenModalCancelBill] = useState(false)
  const [isUpdateBill, setIsUpdateBill] = useState(false)
  const [openModalThemSP, setOpenModalThemSP] = useState(false)
  const [billDetailReturn, setBillDetailReturn] = useState()

  const [openModalUpdateAdd, setopenModalUpdateAdd] = useState(false)

  const [checkPreBill, setCheckPreBill] = useState(false)
  const [checkMoney, setCheckMoney] = useState(true)

  const totalProductsCost = listBillDetail
    .filter((row) => row.status === 0)
    .reduce((total, row) => {
      return total + row.quantity * row.price
    }, 0)
  const navigate = useNavigate()

  const [isCheckBillExist, setIsCheckBillExist] = useState(false)
  const checkBillExist = (id) => {
    hoaDonApi
      .checkBillExist(id)
      .then((response) => {
        if (response.data.data.id === null) {
          navigate(-1)
          toast.warning('Hoá đơn không xác định !!')
        } else {
          setIsCheckBillExist(true)
        }
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API check billexist: ', error)
        setLoadinTransaction(false)
      })
  }

  useEffect(() => {
    checkBillExist(id)
  }, [id])

  useEffect(() => {
    if (!checkMoney && tienShip !== tienShip2) {
      setTienShip2(tienShip)
      const data = {
        idVoucher: voucherMax.id === '' ? '' : voucherMax.id,
        moneyReducer: totalMoneyReducerVoucher,
        moneyAfter: totalMoneyAfter,
      }
      hoaDonApi.changeMoneyBill(id, data).then(() => {
        fetchVoucherByIdBill(id)
      })
    }
  }, [checkMoney, tienShip, tienShip2])

  const handleIncrementQuantity = async (row, index) => {
    try {
      const res = await checkStartApi.checkQuantiy(row.productDetailId, 1)
      if (res.status === 200) {
        if (res.data) {
          hoaDonChiTietApi.isCheckDonGiaVsPricePrd(row.id).then((response) => {
            if (response.data.data === false) {
              confirmSatus(
                'Đơn giá sản phẩm đã thay đổi',
                'Vui lòng chọn "Thêm sản phẩm" để biết thêm thông tin chi tiết!',
              )
            } else {
              if (row.quantity >= 0) {
                const updatedList = listBillDetail.map((item, i) =>
                  i === index ? { ...item, quantity: item.quantity + 1 } : item,
                )
                const updatedRow = { ...row, quantity: row.quantity + 1 }
                updatedList[index] = updatedRow
                setListBillDetail(updatedList)
                tinhLaiShip(updatedList)
                incrementQuantity(row.id)
                if (billDetail.moneyReduced != null) {
                  const newMoneyAfter =
                    updatedList.reduce(
                      (totalMoney, item) =>
                        billDetail.moneyShip + totalMoney + item.quantity * item.price,
                      0,
                    ) - billDetail.moneyReduced
                  const conditionMoney = updatedList.reduce(
                    (totalMoney, item) => totalMoney + item.quantity * item.price,
                    0,
                  )
                  setMoneyAfter(newMoneyAfter)
                  setAdCallVoucherOfSell({ ...adCallVoucherOfSell, condition: conditionMoney })
                  setCheckPreBill(true)
                } else {
                  const newMoneyAfter = updatedList.reduce(
                    (totalMoney, item) =>
                      billDetail.moneyShip + totalMoney + item.quantity * item.price,
                    0,
                  )
                  const conditionMoney = updatedList.reduce(
                    (totalMoney, item) => totalMoney + item.quantity * item.price,
                    0,
                  )
                  setMoneyAfter(newMoneyAfter)
                  setAdCallVoucherOfSell({ ...adCallVoucherOfSell, condition: conditionMoney })
                  setCheckPreBill(true)
                }
              }
            }
          })
        } else {
          toast.error('Số lượng sản phẩm không đủ, vui lòng kiểm tra lại')
        }
      }
    } catch (error) {
      toast.error('Không thể tăng sản phẩm')
    }

    // if (row.quantity >= 0) {
    //   const updatedList = listBillDetail.map((item, i) =>
    //     i === index ? { ...item, quantity: item.quantity + 1 } : item,
    //   )
    //   const updatedRow = { ...row, quantity: row.quantity + 1 }
    //   updatedList[index] = updatedRow
    //   setListBillDetail(updatedList)
    //   incrementQuantity(row.id)
    //   if (billDetail.moneyReduced != null) {
    //     const newMoneyAfter =
    //       updatedList.reduce(
    //         (totalMoney, item) => billDetail.moneyShip + totalMoney + item.quantity * item.price,
    //         0,
    //       ) - billDetail.moneyReduced
    //     setMoneyAfter(newMoneyAfter)
    //   } else {
    //     const newMoneyAfter = updatedList.reduce(
    //       (totalMoney, item) => billDetail.moneyShip + totalMoney + item.quantity * item.price,
    //       0,
    //     )
    //     setMoneyAfter(newMoneyAfter)
    //   }
    // }
  }

  const handleDecrementQuantity = (row, index) => {
    if (row.quantity >= 0) {
      const updatedList = listBillDetail.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity - 1 } : item,
      )
      const updatedRow = { ...row, quantity: row.quantity - 1 }
      updatedList[index] = updatedRow
      setListBillDetail(updatedList)
      tinhLaiShip(updatedList)
      decrementQuantity(row.id)
      if (billDetail.moneyReduced != null) {
        const newMoneyAfter =
          updatedList.reduce(
            (totalMoney, item) => billDetail.moneyShip + totalMoney + item.quantity * item.price,
            0,
          ) - billDetail.moneyReduced
        const conditionMoney = updatedList.reduce(
          (totalMoney, item) => totalMoney + item.quantity * item.price,
          0,
        )
        setMoneyAfter(newMoneyAfter)
        setAdCallVoucherOfSell({ ...adCallVoucherOfSell, condition: conditionMoney })
        setCheckPreBill(true)
      } else {
        const newMoneyAfter = updatedList.reduce(
          (totalMoney, item) => billDetail.moneyShip + totalMoney + item.quantity * item.price,
          0,
        )
        const conditionMoney = updatedList.reduce(
          (totalMoney, item) => totalMoney + item.quantity * item.price,
          0,
        )
        setMoneyAfter(newMoneyAfter)
        setAdCallVoucherOfSell({ ...adCallVoucherOfSell, condition: conditionMoney })
        setCheckPreBill(true)
      }
    }
  }

  const handleTextFieldQuantityChange = (row, index, newValue) => {
    let soLuong = ''
    if (!isNaN(newValue) && newValue > 0) {
      soLuong = newValue
    }
    const updatedList = listBillDetail.map((item, i) =>
      i === index ? { ...item, quantity: parseInt(soLuong, 10) || 0 } : item,
    )
    setListBillDetail(updatedList)
    tinhLaiShip(updatedList)
    changeQuantity(row.id, soLuong)
    if (billDetail.moneyReduced != null) {
      const newMoneyAfter =
        updatedList.reduce(
          (totalMoney, item) => billDetail.moneyShip + totalMoney + item.quantity * item.price,
          0,
        ) - billDetail.moneyReduced
      const conditionMoney = updatedList.reduce(
        (totalMoney, item) => totalMoney + item.quantity * item.price,
        0,
      )
      setMoneyAfter(newMoneyAfter)
      setAdCallVoucherOfSell({ ...adCallVoucherOfSell, condition: conditionMoney })
      setCheckPreBill(true)
    } else {
      const newMoneyAfter = updatedList.reduce(
        (totalMoney, item) => billDetail.moneyShip + totalMoney + item.quantity * item.price,
        0,
      )
      const conditionMoney = updatedList.reduce(
        (totalMoney, item) => totalMoney + item.quantity * item.price,
        0,
      )
      setMoneyAfter(newMoneyAfter)
      setAdCallVoucherOfSell({ ...adCallVoucherOfSell, condition: conditionMoney })
      setCheckPreBill(true)
    }
  }

  const handleTextFieldQuanityFocus = (event, index) => {
    if (!isNaN(event.target.value)) {
      if (event.target.value !== '' && event.target.value !== '0') {
        const updatedList = listBillDetail.map((item, i) =>
          i === index ? { ...item, quantity: 1 } : item,
        )
        setListBillDetail(updatedList)
        const conditionMoney = updatedList.reduce(
          (totalMoney, item) => totalMoney + item.quantity * item.price,
          0,
        )
        setAdCallVoucherOfSell({ ...adCallVoucherOfSell, condition: conditionMoney })
      }
    }
  }
  const capNhatTienShip = (idBill, phiShip) => {
    hoaDonApi.capNhatPhiShip(idBill, phiShip)
  }
  useEffect(() => {
    if (billDetail !== null && billDetail !== undefined) {
      capNhatTienShip(billDetail.id, tienShip)
    }
  }, [tienShip, billDetail])

  useEffect(() => {
    loadTinh()
    if (!billDetail) {
      getOneBill(id)
      getBillHistoryByIdBill(id)
      getTransactionByIdBill(id)
      getBillDetailByIdBill(id)
    }

    if (isUpdateBill) {
      getOneBill(id)
      getBillHistoryByIdBill(id)
      getTransactionByIdBill(id)
      getBillDetailByIdBill(id)
      setIsUpdateBill(false)
    }
  }, [id, billDetail, isUpdateBill, listTransaction])

  const getBillHistoryByIdBill = (id) => {
    setLoadingTimeline(true)
    lichSuHoaDonApi
      .getByIdBill(id)
      .then((response) => {
        setListOrderTimeLine(response.data.data)
        setLoadingTimeline(false)
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API get orderTimeline: ', error)
        setLoadingTimeline(false)
      })
  }

  const [voucherInBill, setVoucherInBill] = useState({
    id: '',
    code: '',
    name: '',
    value: '',
    maximumValue: '',
    type: '',
    typeValue: '',
    minimumAmount: '',
    startDate: '',
    endDate: '',
  })

  const [voucherMax, setVoucherMax] = useState({
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
  const [adCallVoucherOfSell, setAdCallVoucherOfSell] = useState({
    idCustomer: null,
    condition: 0,
    textSearch: '',
    typeSearch: null,
    typeValueSearch: null,
    page: 1,
    size: 5,
  })
  const [percentInBill, setPercentInBill] = useState(null)
  const fetchVoucherByIdBill = (idBill) => {
    hoaDonChiTietApi.getVoucherByIdBill(idBill).then((response) => {
      const dataVoucher = response.data.data
      if (dataVoucher === null || dataVoucher === undefined) {
        setVoucherInBill({
          id: '',
          code: '',
          name: '',
          value: '',
          maximumValue: '',
          type: '',
          typeValue: '',
          minimumAmount: '',
          startDate: '',
          endDate: '',
        })
      } else {
        setVoucherInBill({
          id: dataVoucher.id,
          code: dataVoucher.code,
          name: dataVoucher.name,
          value: dataVoucher.value,
          maximumValue: dataVoucher.maximumValue,
          type: dataVoucher.type,
          typeValue: dataVoucher.typeValue,
          minimumAmount: dataVoucher.minimumAmount,
          startDate: dayjs(dataVoucher.startDate).format('DD-MM-YYYY HH:mm:ss'),
          endDate: dayjs(dataVoucher.endDate).format('DD-MM-YYYY HH:mm:ss'),
        })
      }
    })
  }

  const fetchPercentByIdBill = (idBill) => {
    hoaDonChiTietApi.getPercentByIdBill(idBill).then((response) => {
      setPercentInBill(response.data.data)
    })
  }

  const fecthListVoucherByIdCustomer = (adCallVoucherOfSell, totalProductsCost, voucherInBill) => {
    sellApi
      .getListVoucherByIdCustomer(adCallVoucherOfSell)
      .then((response) => {
        findMaxValueElement(response.data.data, totalProductsCost, voucherInBill)
      })
      .catch(() => {
        toast.error('Vui Lòng f5 tải lại trang', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const findMaxValueElement = (lstVoucher, totalProductsCost, voucherInBill) => {
    const lstVoucherMax =
      voucherInBill.id === ''
        ? [...lstVoucher]
        : voucherInBill.id !== '' && voucherInBill.minimumAmount > totalProductsCost
          ? [...lstVoucher]
          : [...lstVoucher, voucherInBill]

    if (lstVoucherMax.length < 1) {
      setVoucherMax({
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
    let maxElement = lstVoucherMax[0]
    lstVoucherMax.forEach((element) => {
      if (element.maximumValue > maxElement.maximumValue) {
        maxElement = element
      }
    })
    return handleVoucher(maxElement.id)
  }

  const handleVoucher = async (idVoucher) => {
    try {
      setCheckMoney(true)
      const response = await sellApi.getOneVoucherById(idVoucher)
      if (response.status === 200) {
        setVoucherMax(response.data.data)
        setCheckPreBill(false)
        setCheckMoney(false)
      }
    } catch (error) {
      toast.error('Vui Lòng f5 tải lại trang', {
        position: toast.POSITION.TOP_CENTER,
      })
      setCheckPreBill(false)
    }
  }

  useEffect(() => {
    fetchVoucherByIdBill(id)
    fetchPercentByIdBill(id)
    if (checkPreBill === true) {
      fecthListVoucherByIdCustomer(adCallVoucherOfSell, totalProductsCost, voucherInBill)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, adCallVoucherOfSell, totalProductsCost, checkPreBill])

  const moneyVoucherInBill =
    voucherInBill.id === ''
      ? 0
      : voucherInBill.typeValue === 0
        ? (totalProductsCost * voucherInBill.value) / 100
        : voucherInBill.value

  const moneyVoucherMax =
    voucherMax.id === ''
      ? 0
      : voucherMax.typeValue === 0
        ? (totalProductsCost * voucherMax.value) / 100
        : voucherMax.value

  const totalMoneyVoucherInBill =
    moneyVoucherInBill > totalProductsCost ? totalProductsCost : moneyVoucherInBill
  const totalMoneyVoucherMax =
    moneyVoucherMax > totalProductsCost ? totalProductsCost : moneyVoucherMax

  const totalMoneyReducerVoucher =
    totalMoneyVoucherMax === 0
      ? totalMoneyVoucherInBill
      : billDetail && billDetail.status !== 1
        ? totalMoneyVoucherInBill
        : totalMoneyVoucherMax

  const totalMoneyShip = totalProductsCost > 999999 ? 0 : tienShip
  const totalMoneyAfter =
    Number(totalProductsCost) - Number(totalMoneyReducerVoucher) + Number(totalMoneyShip)
  useEffect(() => {
    const socket = new SockJS(socketUrl)
    stompClient = Stomp.over(socket)
    stompClient.debug = () => {}
    stompClient.connect({}, onConnect)

    return () => {
      stompClient.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billDetail])

  const onConnect = () => {
    stompClient.subscribe('/topic/real-time-thong-tin-don-hang-by-client-update', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeDiaChiMuaHang(data)
      }
    })
    stompClient.subscribe('/topic/real-time-huy-don-bill-detail-admin-by-customer', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        updateRealTimeHuyDonByCustomer(data)
      }
    })
    stompClient.subscribe(
      '/topic/real-time-huy-don-bill-detail-admin-by-customer-and-update-bill-detail',
      (message) => {
        if (message.body) {
          const data = JSON.parse(message.body)
          updateRealTimeDiaChiMuaHang(data)
        }
      },
    )
    // stompClient.subscribe(
    //   '/topic/realtime-san-pham-detail-modal-add-client-by-add-in-bill-detail',
    //   (message) => {
    //     if (message.body) {
    //       const data = JSON.parse(message.body)
    //       updateRealTimeListBillDetailByCustomer(data)
    //     }
    //   },
    // )
  }

  function updateRealTimeDiaChiMuaHang(data) {
    const index = id === data.id ? 0 : -1
    if (index !== -1) {
      setBillDetail(data)
    }
  }

  function updateRealTimeHuyDonByCustomer(data) {
    const index = id === data[0].idBill ? 0 : -1
    if (index !== -1) {
      setListOrderTimeLine(data)
    }
  }

  // function updateRealTimeListBillDetailByCustomer(data) {
  //   const index = id === data[0].idBill ? 0 : -1
  //   if (index !== -1) {
  //     setListBillDetail(data)
  //   }
  // }
  // const isCheckThanhToan = (lstBillDetail, lstTrans) => {
  //   var tongTien = 0
  //   var tonhTienThanhToan
  //   lstBillDetail
  //     .filter((item) => item.status !== 1)
  //     .map((item) => {
  //       tongTien = tongTien + item.price
  //     })
  //   lstTrans
  //     .filter((item) => item.status === 0)
  //     .map((item) => {
  //       tongTien = tongTien + item.price
  //     })
  // }

  const checkTongTransTT = (lstTransTT, billDetail) => {
    var tongTT = lstTransTT
      .filter((item) => item.type === 0)
      .reduce((acc, item) => acc + item.totalMoney, 0)

    if (billDetail != null && billDetail.moneyAfter === tongTT) {
      return true
    } else {
      return false
    }
  }

  const genBtnHandleBill = (billDetail, listTransaction) => {
    if (
      listTransaction.filter((item) => item.type === 0).length > 0 &&
      billDetail.status > 3 &&
      billDetail.status < 7 &&
      billDetail.status !== 0
    ) {
      return (
        <Button
          variant="outlined"
          className="them-moi"
          color="cam"
          style={{ marginRight: '5px' }}
          onClick={() => setOpenModalConfirmComplete(true)}
          sx={{ minWidth: '30px' }}>
          Hoàn thành
        </Button>
      )
    }
    //billDetail.type: giao hàng
    if (billDetail.receivingMethod === 1) {
      if (billDetail.status !== 0) {
        switch (billDetail.status) {
          case 1:
            return (
              <div>
                <Button
                  variant="outlined"
                  className="them-moi"
                  color="cam"
                  style={{ marginRight: '5px' }}
                  onClick={() => setOpenModalConfirm(true)}
                  sx={{ minWidth: '30px' }}>
                  Xác nhận đơn hàng
                </Button>
                <Button
                  variant="contained"
                  className="them-moi"
                  color="error"
                  style={{ marginRight: '5px' }}
                  onClick={() => setOpenModalCancelBill(true)}
                  sx={{ minWidth: '30px' }}>
                  Huỷ đơn
                </Button>
              </div>
            )
          case 2:
            return (
              <div>
                <Button
                  variant="outlined"
                  className="them-moi"
                  color="cam"
                  style={{ marginRight: '5px' }}
                  onClick={() => setOpenModalConfirmDelive(true)}
                  sx={{ minWidth: '30px' }}>
                  Xác nhận giao hàng
                </Button>
                <Button
                  variant="contained"
                  className="them-moi"
                  color="error"
                  style={{ marginRight: '5px' }}
                  onClick={() => setOpenModalCancelBill(true)}
                  sx={{ minWidth: '30px' }}>
                  Huỷ đơn
                </Button>
              </div>
            )
          case 3:
            return (
              <div>
                <Button
                  variant="outlined"
                  className="them-moi"
                  color="cam"
                  style={{ marginRight: '5px' }}
                  onClick={() => setOpenModalConfirmReceived(true)}
                  sx={{ minWidth: '30px' }}>
                  Xác nhận lấy hàng
                </Button>
                <Button
                  variant="contained"
                  className="them-moi"
                  color="error"
                  style={{ marginRight: '5px' }}
                  onClick={() => setOpenModalCancelBill(true)}
                  sx={{ minWidth: '30px' }}>
                  Huỷ đơn
                </Button>
              </div>
            )
          default:
            return null
        }
      }
    } else {
      switch (billDetail.status) {
        case 2:
          return null
        default:
          return null
      }
    }
  }
  // const checkSoLuongPrd = (lstBillDetail) => {
  //   lstBillDetail.map((item) =>{
  //     if(!checkStartApi.checkQuantiy(item.productDetailId, item.quantity)){

  //     }
  //   })
  // }

  function ModalConfirmBill({ open, setOpen, billDetail, listHDCT }) {
    const [ghiChu, setGhiChu] = useState('')
    var moneyShip = tienShip
    if (totalProductsCost >= 1000000) {
      moneyShip = 0
    } else {
      moneyShip = tienShip
    }

    const handleConfirmOrder = () => {
      const updatedBillConfirmRequest = {
        fullName: billDetail.fullName,
        phoneNumber: billDetail.phoneNumber,
        address: billDetail.address,
        note: billDetail.note,
        status: 2,
        noteBillHistory: ghiChu,
        idVoucher: voucherMax.id === '' ? null : voucherMax.id,
        moneyShip: moneyShip,
        moneyReducer: totalMoneyReducerVoucher,

        listHdctReq: listHDCT.map((item) => ({
          productDetailId: item.productDetailId,
          idBill: billDetail.id,
          quantity: item.quantity,
          price: item.price,
          status: 0,
        })),
      }

      confirmSatus('Xác nhận ', 'Xác nhận hoá đơn?').then((result) => {
        if (result.isConfirmed) {
          hoaDonApi
            .confirmBill(billDetail.id, updatedBillConfirmRequest)
            .then((response) => {
              if (response.status === 200) {
                // toast.success('Đã xác nhận hoá đơn', {
                //   position: toast.POSITION.TOP_RIGHT,
                // })
                confirmPrintBillGiaoHang(billDetail.id)
                setIsUpdateBill(true)
                setOpen(false)
              } else {
                setOpenModalConfirm(false)
              }
            })
            .catch((error) => {
              toast.error('Có sản phẩm hết hàng, vui lòng kiểm tra lại', {
                position: toast.POSITION.TOP_RIGHT,
              })
              console.error('Lỗi xác nhận đơn hàng', error)
            })
        }
      })
    }
    return (
      <DialogAddUpdate
        open={open}
        setOpen={setOpen}
        title={'Xác nhận hoá đơn'}
        buttonSubmit={
          <Button
            style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
            color="cam"
            variant="contained"
            onClick={handleConfirmOrder}>
            Lưu
          </Button>
        }>
        <div>
          <TextField
            color="cam"
            className="search-field"
            size="small"
            fullWidth
            label="Ghi chú"
            multiline
            rows={4}
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    )
  }

  function ModalConfirmDeliver({ open, setOpen, billDetail }) {
    const [ghiChu, setGhiChu] = useState('')
    const updateStatusBillRequest = {
      noteBillHistory: ghiChu,
      status: 3,
    }

    const handleConfirmDeliver = (id, updateStatusBillRequest) => {
      hoaDonApi
        .updateStatusBill(id, updateStatusBillRequest)
        .then((response) => {
          toast.success('Xác nhận giao hàng thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
          setIsUpdateBill(true)
          setOpen(false)
        })
        .catch((error) => {
          toast.error('Xác nhận giao hàng không thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
          console.error('Lỗi khi gửi yêu cầu API update status bill: ', error)
        })
    }

    return (
      <DialogAddUpdate
        open={open}
        setOpen={setOpen}
        title={'Xác nhận giao hàng'}
        buttonSubmit={
          <Button
            style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
            color="cam"
            variant="contained"
            onClick={() => handleConfirmDeliver(billDetail.id, updateStatusBillRequest)}>
            Lưu
          </Button>
        }>
        <div>
          <TextField
            color="cam"
            className="search-field"
            size="small"
            fullWidth
            label="Ghi chú"
            multiline
            rows={4}
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    )
  }

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code',
    })
    return formatter.format(value)
  }

  function ModalConfirmPayment({ open, setOpen, billDetail, listTransaction }) {
    const totalMoneyTrans = listTransaction
      .filter((transaction) => transaction.type === 0)
      .reduce((total, transaction) => total + transaction.totalMoney, 0)
    let tienCanHoanTra = 0
    billDetail ? (tienCanHoanTra = totalMoneyTrans - billDetail.moneyAfter) : (tienCanHoanTra = 0)
    const [ghiChu, setGhiChu] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('0')
    const [paymentAmount, setPaymentAmount] = useState(0)
    const [transactionCode, setTransactionCode] = useState('')

    const handleConfirmPayment = () => {
      const confirmPaymentRequest = {
        noteBillHistory: ghiChu,
        type: isRefundMode ? 1 : 0,
        status: 0,
        paymentMethod: paymentMethod,
        paymentAmount: paymentAmount,
        transactionCode: transactionCode,
      }
      if (!isRefundMode) {
        if (paymentAmount < billDetail.totalMoney) {
          toast.error('Không đủ tiền để xác nhận thanh toán', {
            position: toast.POSITION.TOP_CENTER,
          })
          return
        }
        if (paymentMethod === '0' && transactionCode.trim() === '') {
          toast.error('Vui lòng nhập mã giao dịch', {
            position: toast.POSITION.TOP_CENTER,
          })
          return
        }
      }
      hoaDonApi
        .confirmPayment(billDetail.id, confirmPaymentRequest)
        .then((response) => {
          toast.success('Đã xác nhận thanh toán', {
            position: toast.POSITION.TOP_RIGHT,
          })
          setIsUpdateBill(true)
          setOpen(false)
        })
        .catch((error) => {
          console.error('Lỗi xác nhận thanh toán', error)
        })
    }
    const [cashReceived, setCashReceived] = useState(0)
    const [changeAmount, setChangeAmount] = useState(0)
    const [isRefundMode, setIsRefundMode] = useState(false)

    return (
      <DialogAddUpdate
        open={open}
        setOpen={setOpen}
        title={'Xác nhận thanh toán'}
        buttonSubmit={
          <Button
            style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
            color="cam"
            variant="contained"
            onClick={handleConfirmPayment}>
            Lưu
          </Button>
        }
        buttonCancel={
          <Button
            style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
            color="cam"
            variant="contained">
            Huỷ
          </Button>
        }>
        <div>
          <Box display={'inline'} sx={{ float: 'right', marginRight: 5 }}>
            <b>Hoàn tiền</b>
            <Switch
              color="warning"
              size="small"
              checked={isRefundMode}
              onChange={(e) => setIsRefundMode(e.target.checked)}
              disabled={tienCanHoanTra <= 0}
            />
          </Box>

          {isRefundMode ? (
            <>
              <TextField
                style={{ marginBottom: '10px' }}
                color="cam"
                value={formatCurrency(tienCanHoanTra)}
                className="search-field"
                size="small"
                fullWidth
                label="Số tiền cần hoàn trả"
              />

              <TextField
                style={{ marginBottom: '10px' }}
                color="cam"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="search-field"
                size="small"
                fullWidth
                label="Tiền hoàn trả"
              />
              <TextField
                color="cam"
                className="search-field"
                size="small"
                fullWidth
                label="Ghi chú"
                multiline
                rows={4}
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <FormControl component="fieldset">
                <FormLabel component="legend">Phương thức thanh toán:</FormLabel>
                <RadioGroup
                  row
                  aria-label="payment-method"
                  name="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}>
                  <FormControlLabel value="0" control={<Radio />} label="Chuyển khoản" />
                  <FormControlLabel value="1" control={<Radio />} label="Tiền mặt" />
                </RadioGroup>
              </FormControl>
              <TextField
                color="cam"
                className="search-field"
                size="small"
                fullWidth
                label="Mã giao dịch"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value)}
                style={{ marginBottom: '10px' }}
                disabled={paymentMethod !== '0'}
                required={paymentMethod === '0'}
              />

              {paymentMethod === '0' && transactionCode.trim() === '' && (
                <span style={{ color: 'red', marginBottom: '5px' }}>
                  Vui lòng nhập mã giao dịch
                </span>
              )}
            </>
          ) : (
            <>
              <TextField
                style={{ marginBottom: '10px' }}
                color="cam"
                value={(billDetail && formatCurrency(billDetail.moneyAfter)) || '0'}
                className="search-field"
                size="small"
                fullWidth
                label="Tổng tiền"
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                style={{ marginBottom: '10px' }}
                color="cam"
                value={cashReceived}
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/\D/g, '')

                  setCashReceived(formatCurrency(inputValue))

                  const totalAmount = parseFloat(billDetail ? billDetail.moneyAfter : 0)
                  setChangeAmount(formatCurrency(inputValue).replace(/\D/g, '') - totalAmount)
                  setPaymentAmount(formatCurrency(inputValue).replace(/\D/g, ''))
                }}
                className="search-field"
                size="small"
                fullWidth
                label="Tiền khách đưa"
              />

              <TextField
                style={{ marginBottom: '10px' }}
                color="cam"
                value={formatCurrency(changeAmount)}
                className="search-field"
                size="small"
                fullWidth
                label="Tiền thừa"
                InputProps={{
                  readOnly: true,
                  style: {
                    color: changeAmount < 0 ? 'red' : 'black',
                  },
                }}
              />

              <TextField
                color="cam"
                className="search-field"
                size="small"
                fullWidth
                label="Ghi chú"
                multiline
                rows={4}
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <FormControl component="fieldset">
                <FormLabel component="legend">Phương thức thanh toán:</FormLabel>
                <RadioGroup
                  row
                  aria-label="payment-method"
                  name="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}>
                  <FormControlLabel value="0" control={<Radio />} label="Chuyển khoản" />
                  <FormControlLabel value="1" control={<Radio />} label="Tiền mặt" />
                </RadioGroup>
              </FormControl>
              <TextField
                color="cam"
                className="search-field"
                size="small"
                fullWidth
                label="Mã giao dịch"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value)}
                style={{ marginBottom: '10px' }}
                disabled={paymentMethod !== '0'}
                required={paymentMethod === '0'}
              />

              {paymentMethod === '0' && transactionCode.trim() === '' && (
                <span style={{ color: 'red', marginBottom: '5px' }}>
                  Vui lòng nhập mã giao dịch
                </span>
              )}
            </>
          )}
        </div>
      </DialogAddUpdate>
    )
  }

  function ModalConfirmComplete({ open, setOpen, billDetail }) {
    const [ghiChu, setGhiChu] = useState('')

    const updateStatusBillRequest = {
      noteBillHistory: ghiChu,
      status: 7,
    }
    const handleConfirmComplete = (id, updateStatusBillRequest) => {
      hoaDonApi
        .updateStatusBill(id, updateStatusBillRequest)
        .then((response) => {
          toast.success('Xác nhận hoàn thành đơn hàng', {
            position: toast.POSITION.TOP_RIGHT,
          })
          setIsUpdateBill(true)
          setOpen(false)
        })
        .catch((error) => {
          toast.error('Xác nhận hoàn thành đơn hàng không thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
          console.error('Lỗi khi gửi yêu cầu API update status bill: ', error)
        })
    }

    return (
      <DialogAddUpdate
        open={open}
        setOpen={setOpen}
        title={'Xác nhận hoàn thành đơn hàng'}
        buttonSubmit={
          <Button
            style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
            color="cam"
            variant="contained"
            onClick={() => handleConfirmComplete(billDetail.id, updateStatusBillRequest)}>
            Lưu
          </Button>
        }>
        <div>
          <TextField
            color="cam"
            className="search-field"
            size="small"
            fullWidth
            label="Ghi chú"
            multiline
            rows={4}
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    )
  }

  function ModalReturnSttBill({ open, setOpen, billDetail }) {
    const [ghiChu, setGhiChu] = useState('')
    const updateStatusBillRequest = {
      noteBillHistory: ghiChu,
    }
    const handleConfirmReturnStt = (id, hdBillReq) => {
      if (ghiChu.trim().length >= 50) {
        confirmSatus('Xác nhận ', 'Xác nhận quay lại?').then((result) => {
          if (result.isConfirmed) {
            hoaDonApi
              .returnStt(id, hdBillReq)
              .then((response) => {
                if (response.status === 200) {
                  toast.success('Đã thay đổi trạng thái', {
                    position: toast.POSITION.TOP_RIGHT,
                  })
                  setIsUpdateBill(true)
                  setOpen(false)
                }
              })
              .catch((error) => {
                toast.error('Đã xảy ra lỗi', {
                  position: toast.POSITION.TOP_RIGHT,
                })
                console.error('Lỗi khi gửi yêu cầu API return status bill: ', error)
              })
          }
        })
      } else {
        toast.error('Vui lòng nhập ghi chú tối thiểu 50 ký tự', {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    }
    return (
      <DialogAddUpdate
        open={open}
        setOpen={setOpen}
        title={'Quay lại trạng thái trước'}
        buttonSubmit={
          <Button
            style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
            color="cam"
            variant="contained"
            onClick={() => handleConfirmReturnStt(billDetail.id, updateStatusBillRequest)}>
            Lưu
          </Button>
        }>
        <div>
          <TextField
            color="cam"
            className="search-field"
            size="small"
            fullWidth
            label="Ghi chú"
            multiline
            rows={4}
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    )
  }
  function ModalReturnProduct({ open, setOpen, billDetailReturn, idBill }) {
    const [ghiChu, setGhiChu] = useState('')
    const [soLuong, setSoLuong] = useState(billDetailReturn ? billDetailReturn.quantity : 0)

    const hdBillDetailReq = {
      productDetailId: billDetailReturn ? billDetailReturn.productDetailId : null,
      idBill: idBill,
      quantity: soLuong,
      note: ghiChu,
    }
    const handleReturnProduct = (billDetailReturn, hdBillDetailReq) => {
      hoaDonChiTietApi
        .returnProduct(billDetailReturn.id, hdBillDetailReq)
        .then(() => {
          toast.success('Đã xác nhận hoàn trả', {
            position: toast.POSITION.TOP_RIGHT,
          })
          setIsUpdateBill(true)
          setOpenModalReturnProduct(false)
        })
        .catch(() => {
          toast.error('Đã xảy ra lỗi', {
            position: toast.POSITION.TOP_RIGHT,
          })
        })
    }
    const confirmReturnProduct = () => {
      if (isNaN(soLuong) || soLuong <= 0) {
        toast.error('Số lượng không hợp lệ', {
          position: toast.POSITION.TOP_CENTER,
        })
        return
      }
      if (soLuong > billDetailReturn.quantity) {
        toast.error('Số lượng hoàn trả lớn hơn số sản phẩm đã mua', {
          position: toast.POSITION.TOP_CENTER,
        })
        return
      }
      if (ghiChu.trim().length === 0) {
        toast.error('Vui lòng nhập ghi chú', {
          position: toast.POSITION.TOP_CENTER,
        })
        return
      }
      confirmSatus('Xác nhận ', 'Xác nhận hoàn hàng?').then((result) => {
        if (result.isConfirmed) {
          handleReturnProduct(billDetailReturn, hdBillDetailReq)
        }
      })
    }

    return (
      <Modal
        open={open}
        setOpen={setOpen}
        title={'Xác nhận hoàn hàng'}
        onClose={() => {
          setOpen(false)
        }}>
        <div>
          <Box sx={styleModalReturnProduct}>
            <Toolbar>
              <Box
                sx={{
                  color: 'black',
                  flexGrow: 1,
                }}>
                <Typography variant="h6" component="div">
                  Xác nhận hoàn hàng
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setOpen(false)
                }}
                aria-label="close"
                color="error"
                style={{
                  boxShadow: '1px 2px 3px 1px rgba(0,0,0,.05)',
                }}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
            {billDetailReturn && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TableContainer
                    sx={{ maxHeight: 300, marginBottom: 5 }}
                    className="table-container-custom-scrollbar">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableBody>
                        <TableRow key={'billDetail' + billDetailReturn.id}>
                          <TableCell align="center">
                            <img src={billDetailReturn.productImg} alt="" width={'100px'} />
                          </TableCell>
                          <TableCell>
                            {billDetailReturn.productName} <br></br>
                            {/* {billDetailReturn.price !== billDetailReturn.productPrice ? (
                              <span>
                                <del
                                  style={{
                                    color: 'gray',
                                    textDecorationColor: 'gray',
                                    textDecorationLine: 'line-through',
                                  }}>
                                  {formatCurrency(billDetailReturn.productPrice)}
                                </del>

                                <span
                                  style={{
                                    color: 'red',
                                    marginLeft: 15,
                                  }}>
                                  {formatCurrency(billDetailReturn.price)}
                                </span>
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: 'red',
                                  marginLeft: 15,
                                }}>
                                {formatCurrency(billDetailReturn.productPrice)}
                              </span>
                            )} */}
                            <span
                              style={{
                                color: 'red',
                                marginLeft: 15,
                              }}>
                              {formatCurrency(billDetailReturn.productPrice)}
                            </span>
                            <br />
                            Size: {billDetailReturn.size}
                            <br />x{billDetailReturn.quantity}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <TextField
                              color="cam"
                              className="search-field"
                              size="small"
                              fullWidth
                              label="Số lượng:"
                              value={soLuong}
                              onChange={(e) => setSoLuong(e.target.value)}
                              sx={{ marginBottom: 2 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              color="cam"
                              className="search-field"
                              size="small"
                              fullWidth
                              label="Ghi chú"
                              multiline
                              rows={4}
                              value={ghiChu}
                              onChange={(e) => setGhiChu(e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box>
                    <Button
                      variant="outlined"
                      color="cam"
                      style={{ width: '90%', marginLeft: '5%', marginBottom: 10 }}
                      onClick={() => confirmReturnProduct()}>
                      <b>Xác nhận</b>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </div>
      </Modal>
    )
  }
  const styleModalReturnProduct = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '50vw', md: '50vw' },
    bgcolor: 'white',
    borderRadius: 1.5,
    boxShadow: 24,
  }
  function ModalCancelBill({ open, setOpen, billDetail }) {
    const [ghiChu, setGhiChu] = useState('')

    const updateStatusBillRequest = {
      noteBillHistory: ghiChu,
      status: 0,
    }
    const handlecancelBill = (id, updateStatusBillRequest) => {
      if (billDetail.status !== 0 && billDetail.status !== 7 && billDetail.status !== 4) {
        if (ghiChu.trim() === '') {
          toast.error('Vui lòng nhập ghi chú', {
            position: toast.POSITION.TOP_CENTER,
          })
          return
        }
        hoaDonApi
          .cancelBill(id, updateStatusBillRequest)
          .then((response) => {
            toast.success('Đã huỷ đơn hàng', {
              position: toast.POSITION.TOP_RIGHT,
            })
            setIsUpdateBill(true)
            setOpen(false)
          })
          .catch((error) => {
            toast.error('Đã xảy ra lỗi', {
              position: toast.POSITION.TOP_RIGHT,
            })
            console.error('Lỗi khi gửi yêu cầu API huỷ đơn hàng: ', error)
          })
      }
    }

    return (
      <DialogAddUpdate
        open={open}
        setOpen={setOpen}
        title={'Huỷ đơn hàng'}
        buttonSubmit={
          <Button
            style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
            color="cam"
            variant="contained"
            onClick={() => handlecancelBill(billDetail.id, updateStatusBillRequest)}>
            Lưu
          </Button>
        }>
        <div>
          <TextField
            color="cam"
            className="search-field"
            size="small"
            fullWidth
            label="Ghi chú"
            multiline
            rows={4}
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    )
  }

  function ModalConfirmReceived({ open, setOpen, billDetail }) {
    const [ghiChu, setGhiChu] = useState('')

    const updateStatusBillRequest = {
      noteBillHistory: ghiChu,
      status: 4,
    }
    const handleConfirmReceived = (id, updateStatusBillRequest) => {
      hoaDonApi
        .updateStatusBill(id, updateStatusBillRequest)
        .then((response) => {
          toast.success('Xác nhận đã nhận được hàng thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
          setIsUpdateBill(true)
          setOpen(false)
        })
        .catch((error) => {
          toast.error('Đã xảy ra lỗi', {
            position: toast.POSITION.TOP_RIGHT,
          })
          console.error('Lỗi khi gửi yêu cầu API update status bill: ', error)
        })
    }

    return (
      <DialogAddUpdate
        open={open}
        setOpen={setOpen}
        title={'Xác nhận đã giao hàng'}
        buttonSubmit={
          <Button
            style={{ boxShadow: 'none', textTransform: 'none', borderRadius: '8px' }}
            color="cam"
            variant="contained"
            onClick={() => handleConfirmReceived(billDetail.id, updateStatusBillRequest)}>
            Lưu
          </Button>
        }>
        <div>
          <TextField
            color="cam"
            className="search-field"
            size="small"
            fullWidth
            label="Ghi chú"
            multiline
            rows={4}
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
      </DialogAddUpdate>
    )
  }

  const getOneBill = (id) => {
    hoaDonApi
      .getOne(id)
      .then((response) => {
        setBillDetail(response.data.data)
        setMoneyAfter(response.data.data.moneyAfter)
        setTienShip(response.data.data.moneyShip)
        setAdCallVoucherOfSell({
          ...adCallVoucherOfSell,
          condition: response.data.data.totalMoney,
          idCustomer: response.data.data.idCustomer === null ? '' : response.data.data.idCustomer,
        })
        setLoading(false)
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API get bill: ', error)
        setLoading(false)
      })
  }

  const getTransactionByIdBill = (id) => {
    setLoadinTransaction(true)
    lichSuGiaoDichApi
      .getByIdBill(id)
      .then((response) => {
        setListTransaction(response.data.data)
        setLoadinTransaction(false)
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API get orderTimeline: ', error)
        setLoadinTransaction(false)
      })
  }

  const [tinh, setTinh] = useState([])
  const [huyen, setHuyen] = useState([])
  const [xa, setXa] = useState([])

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

  const getBillDetailByIdBill = (id) => {
    setLoadingListBillDetail(true)
    hoaDonChiTietApi
      .getByIdBill(id)
      .then((response) => {
        setListBillDetail(response.data.data)
        setLoadingListBillDetail(false)
        if (billDetail !== null && billDetail !== undefined) {
          tinhLaiShip(response.data.data)
        }
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API get bill detail by bill ', error)
        setLoadingListBillDetail(false)
      })
  }
  const dispatch = useDispatch()

  const tinhLaiShip = (listBillDetail) => {
    dispatch(setLoad(true))
    if (billDetail !== null && billDetail !== undefined) {
      ghnAPI.getProvince().then((response) => {
        const addressParts = billDetail.address.split(', ')
        if (addressParts.length === 4) {
          const [specificAddress, wardLabel, districtLabel, provinceLabel] = addressParts

          const selectTinh =
            response.data.find((item) => item.provinceName === provinceLabel) || null

          if (selectTinh) {
            ;(async () => {
              const huyenData = await loadHuyen(selectTinh.provinceID)
              const selectHuyen =
                huyenData.find((item) => item.districtName.includes(districtLabel)) || null

              if (selectHuyen) {
                ;(async () => {
                  const xaData = await loadXa(selectHuyen.districtID)
                  const selectXa = xaData.find((item) => item.wardName.includes(wardLabel)) || null
                  const filtelService = {
                    shop_id: '3911708',
                    from_district: '3440',
                    to_district: selectHuyen.districtID,
                  }

                  ghnAPI.getServiceId(filtelService).then((response) => {
                    const serviceId = response.data.body.serviceId

                    const totalWeight = listBillDetail
                      .filter((item) => item.status !== 1)
                      .reduce(
                        (acc, item) => acc + parseInt(item.weight) * parseInt(item.quantity),
                        0,
                      )
                    const filterTotal = {
                      from_district_id: '3440',
                      service_id: serviceId,
                      to_district_id: selectHuyen.districtID,
                      to_ward_code: selectXa.wardCode,
                      weight: totalWeight,
                      insurance_value: '10000',
                    }
                    ghnAPI.getTotal(filterTotal).then((response) => {
                      setTienShip(response.data.body.total)
                    })
                  })
                })()
              }
            })()
          }
        }
      })
    }
    dispatch(setLoad(false))
  }

  //

  //

  const decrementQuantity = (idBillDetail) => {
    hoaDonChiTietApi.decrementQuantity(idBillDetail).catch((error) => {
      console.error('NO ok', error)
      setCheckPreBill(true)
    })
  }

  const incrementQuantity = (idBillDetail) => {
    hoaDonChiTietApi.incrementQuantity(idBillDetail).catch((error) => {
      console.error('NO ok', error)
      setCheckPreBill(true)
    })
  }

  const changeQuantity = (idBillDetail, quantity) => {
    if (!isNaN(quantity) && quantity > 0) {
      hoaDonChiTietApi.changeQuantity(idBillDetail, quantity).catch((error) => {
        console.error('NO ok', error)
        setCheckPreBill(true)
      })
    } else {
      hoaDonChiTietApi.changeQuantity(idBillDetail, 1).catch((error) => {
        console.error('NO ok', error)
        setCheckPreBill(true)
      })
    }
  }

  const deleteBillDetail = (hdct) => {
    hoaDonChiTietApi
      .delete(hdct.id)
      .then(() => {
        toast.success('Đã xoá sản phẩm khỏi đơn hàng', {
          position: toast.POSITION.TOP_RIGHT,
        })
        setIsUpdateBill(true)
        setCheckPreBill(true)
      })
      .catch(() => {
        toast.error('Đã sảy ra lỗi', {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const handleDeleteSPConfirmation = (hdct) => {
    confirmSatus('Xác nhận xoá', 'Bạn có chắc chắn muốn xoá sản phẩm này?').then((result) => {
      if (result.isConfirmed) {
        deleteBillDetail(hdct)
      }
    })
  }

  const handleReturnProduct = (item) => {
    setBillDetailReturn(item)
    setOpenModalReturnProduct(true)
  }

  const confirmPrintBill = async (idBill) => {
    const comfirm = await confirmSatus(
      'Xác nhận in hoá đơn',
      'Bạn có chắc chắn muốn in hoá đơn này?',
    )
    if (comfirm.isConfirmed) {
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
  }

  const confirmPrintBillGiaoHang = async (idBill) => {
    try {
      const response = await axios.get(url + '/in-hoa-don/hd-giao-hang/' + idBill, {
        responseType: 'blob',
      })
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

  const PDFViewerModal = ({ open, handleClose, pdfContent }) => {
    const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' })
    const pdfUrl = URL.createObjectURL(pdfBlob)

    return (
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Paper style={{ width: '80%', height: '90%' }}>
          <iframe
            style={{ borderRadius: '10px', width: '100%', height: '100%' }}
            src={pdfUrl}
            title="PDF Viewer"></iframe>
        </Paper>
      </Modal>
    )
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [pdfContent, setPdfContent] = useState('')
  const [detailDiaChi, setDetailDiaChi] = useState({})

  const handleOpenModal = (pdfContent) => {
    setPdfContent(pdfContent)
    setModalOpen(true)
  }
  const handleTypingMoneyShip = (newValueMoneyShip) => {
    if (isNaN(newValueMoneyShip)) {
      toast.error('Phí vận chuyển không hợp lệ', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else if (newValueMoneyShip < 0) {
      toast.error('Phí vận chuyển không hợp lệ', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else if (newValueMoneyShip > 1000000) {
      toast.error('Phí vận chuyển tối đa là 1.000.000 VNĐ', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else {
      setTienShip(Number(newValueMoneyShip))
    }
  }

  const handleCloseModal = () => {
    setPdfContent('')
    setModalOpen(false)
  }
  const [isShowModalChonNhanVien, setIsShowModalChonNhanVien] = useState(false, false)

  const styleModalChonNhanVien = {
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
  const [searchNhanVien, setSearchNhanVien] = useState({
    txtSearch: '',
    size: 5,
    page: 1,
  })
  const [totalPages, setTotalPages] = useState(0)
  const [listNhanVien, setListNhanVien] = useState([])
  const fetchDataNhanVien = () => {
    hoaDonApi.getNhanVien(id, searchNhanVien).then((response) => {
      setListNhanVien(response.data.data.content)
      setTotalPages(response.data.data.totalPages)
      if (searchNhanVien.page > response.data.data.totalPages)
        if (response.data.data.totalPages > 0) {
          setSearchNhanVien({ ...searchNhanVien, page: response.data.data.totalPages })
        }
    })
  }

  const themNhanVienTiepNhan = (idBill, idAcc) => {
    confirmSatus('Xác nhận ', 'Xác nhận thêm nhân viên tiếp nhận?').then((result) => {
      if (result.isConfirmed) {
        hoaDonApi
          .addStaffReception(idBill, idAcc)
          .then((response) => {
            toast.success('Đã thêm nhân viên xác nhận', {
              position: toast.POSITION.TOP_RIGHT,
            })
            handleCloseModalChonNhanVien()
            setIsUpdateBill(true)
          })
          .catch((error) => {
            toast.error('Đã xảy ra lỗi', {
              position: toast.POSITION.TOP_RIGHT,
            })
            console.error('Lỗi thêm nhân viên tiếp nhận', error)
          })
      }
    })
  }
  const handleCloseModalChonNhanVien = () => {
    setIsShowModalChonNhanVien(false)
    setSearchNhanVien({ ...searchNhanVien, txtSearch: '', page: 1, size: 5 })
  }
  const handleOpenModalChonNhanVien = () => {
    fetchDataNhanVien(searchNhanVien)
    setIsShowModalChonNhanVien(true)
    setSearchNhanVien({ ...searchNhanVien, txtSearch: '', page: 1, size: 5 })
  }
  return (
    isCheckBillExist && (
      <div className="hoa-don">
        {modalOpen && (
          <PDFViewerModal open={modalOpen} handleClose={handleCloseModal} pdfContent={pdfContent} />
        )}
        {openModalConfirm && (
          <ModalConfirmBill
            setOpen={setOpenModalConfirm}
            open={openModalConfirm}
            billDetail={billDetail}
            listHDCT={listBillDetail}
          />
        )}
        {openModalConfirmDelive && (
          <ModalConfirmDeliver
            setOpen={setOpenModalConfirmDelive}
            open={openModalConfirmDelive}
            billDetail={billDetail}
          />
        )}
        {openModalConfirmPayment && (
          <ModalConfirmPayment
            setOpen={setOpenModalConfirmPayment}
            open={openModalConfirmPayment}
            billDetail={billDetail}
            listTransaction={listTransaction}
          />
        )}
        {openModalConfirmComplete && (
          <ModalConfirmComplete
            setOpen={setOpenModalConfirmComplete}
            open={openModalConfirmComplete}
            billDetail={billDetail}
          />
        )}
        <ModalReturnProduct
          setOpen={setOpenModalReturnProduct}
          open={openModalReturnProduct}
          billDetailReturn={billDetailReturn}
          idBill={billDetail ? billDetail.id : null}
        />
        {openModalCancelBill && (
          <ModalCancelBill
            setOpen={setOpenModalCancelBill}
            open={openModalCancelBill}
            billDetail={billDetail}
          />
        )}
        {openCodalConfirmReceived && (
          <ModalConfirmReceived
            setOpen={setOpenModalConfirmReceived}
            open={openCodalConfirmReceived}
            billDetail={billDetail}
          />
        )}
        {openmodalReturnStt && (
          <ModalReturnSttBill
            setOpen={setOpenModalReturnStt}
            open={openmodalReturnStt}
            billDetail={billDetail}
          />
        )}
        {openModalThemSP && (
          <AdBillModalThemSP
            load={setIsUpdateBill}
            open={openModalThemSP}
            setOPen={setOpenModalThemSP}
            billDetail={billDetail ? billDetail : null}
            idBill={billDetail ? billDetail.id : null}
            setCheckPreBill={setCheckPreBill}
          />
        )}
        {openModalUpdateAdd && (
          <ModalAdBillUpdateAddress
            load={setIsUpdateBill}
            open={openModalUpdateAdd}
            setOPen={setopenModalUpdateAdd}
            billDetail={billDetail}
            listBillDetail={listBillDetail}
            setDetailDiaChi={setDetailDiaChi}
            detailDiaChi={detailDiaChi}
          />
        )}
        <Modal
          open={isShowModalChonNhanVien}
          onClose={() => {
            handleCloseModalChonNhanVien()
          }}>
          <Box sx={styleModalChonNhanVien}>
            <Toolbar sx={{ mb: 1 }}>
              <Box
                sx={{
                  color: 'black',
                  flexGrow: 1,
                }}>
                <Typography variant="h6" component="div">
                  Chọn nhân viên
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  handleCloseModalChonNhanVien()
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
                  value={searchNhanVien.txtSearch || ''}
                  placeholder="Tìm kiếm tên hoặc sđt hoặc email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="cam" />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setSearchNhanVien({ ...searchNhanVien, txtSearch: e.target.value })
                  }}
                />
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
                <TableBody>
                  {listNhanVien.map((row) => (
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
                          className="them-moi"
                          color="cam"
                          style={{ marginRight: '5px' }}
                          onClick={() => themNhanVienTiepNhan(id, row.id)}>
                          Chọn
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Stack
                mt={2}
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={0}>
                <Typography component="span" variant={'body2'} mt={0.5}>
                  <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>Xem</Typography>
                  <Select
                    color="cam"
                    onChange={(e) => {
                      setSearchNhanVien({ ...searchNhanVien, size: e.target.value })
                    }}
                    sx={{ height: '25px', mx: 0.5 }}
                    size="small"
                    value={searchNhanVien.size}>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                  <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>
                    nhân viên
                  </Typography>
                </Typography>
                <Pagination
                  page={searchNhanVien.page}
                  onChange={(e, value) => {
                    e.preventDefault()
                    setSearchNhanVien({ ...searchNhanVien, page: value })
                  }}
                  count={totalPages}
                  color="cam"
                  variant="outlined"
                />
              </Stack>
            </Container>
          </Box>
        </Modal>
        <BreadcrumbsCustom listLink={listHis} nameHere={billDetail?.code} />
        <Paper
          className="time-line"
          elevation={3}
          sx={{ mt: 2, mb: 2, paddingLeft: 1, paddingBottom: 2 }}>
          <h3>Lịch sử đơn hàng</h3>
          <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
            {loadingTimeline ? (
              <div>Loading...</div>
            ) : (
              <TimeLine orderTimeLine={listOrderTimeLine} />
            )}
          </Stack>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
            <div style={{ flexShrink: 0 }}>
              {billDetail &&
                billDetail.status > 1 &&
                billDetail.receivingMethod === 1 &&
                billDetail.status <= 7 && (
                  <Button
                    variant="outlined"
                    className="them-moi"
                    color="cam"
                    style={{
                      marginLeft: 'auto',
                      marginRight: '5px',
                      alignSelf: 'flex-end',
                      cursor: billDetail && billDetail.status === 1 ? 'not-allowed' : 'pointer',
                      opacity: billDetail && billDetail.status === 1 ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (!(billDetail && billDetail.status === 1)) {
                        setOpenModalReturnStt(true)
                      }
                    }}>
                    <IoReturnUpBack style={{ fontSize: '20px' }} />
                    Quay lại trạng thái trước
                  </Button>
                )}
            </div>

            <div style={{ flexShrink: 0 }}>
              {userAdmin &&
                userAdmin.role === 1 &&
                billDetail &&
                billDetail.status < 7 &&
                billDetail.status > 1 && (
                  <Button
                    variant="outlined"
                    className="them-moi"
                    color="cam"
                    style={{
                      marginLeft: 'auto',
                      marginRight: '5px',
                      alignSelf: 'flex-end',
                    }}
                    onClick={() => handleOpenModalChonNhanVien()}>
                    <IoIosAdd style={{ fontSize: '20px' }} />
                    Thêm nhân viên tiếp nhận
                  </Button>
                )}
            </div>
          </div>
        </Paper>

        <Paper elevation={3} sx={{ mt: 2, mb: 2, paddingTop: 2, paddingBottom: 2, paddingLeft: 2 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            {!loading && genBtnHandleBill(billDetail, listTransaction)}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}>
              <Button
                variant="outlined"
                className="them-moi"
                color="cam"
                style={{ marginRight: '5px' }}
                onClick={() => setOpenDialog(true)}>
                Chi tiết
              </Button>
              {billDetail && billDetail.status === 7 ? (
                <Button
                  variant="outlined"
                  className="them-moi"
                  color="cam"
                  style={{ marginRight: '5px' }}
                  onClick={() => confirmPrintBill(billDetail.id)}>
                  In hoá đơn
                </Button>
              ) : null}
              {loading ? (
                <div>Loading...</div>
              ) : (
                openDialog && (
                  <BillHistoryDialog
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    listOrderTimeLine={listOrderTimeLine}
                  />
                )
              )}
            </Stack>
          </Grid>
        </Paper>
        {/* Thông tin đơn hàng */}
        <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <h3>
              Thông tin đơn hàng - {billDetail?.type === 0 ? 'Đơn tại quầy' : 'Đơn trực tuyến'}
            </h3>
            {billDetail && (billDetail.status === 1 || billDetail.status === 2) && (
              <Button
                variant="outlined"
                className="them-moi"
                color="cam"
                style={{ marginRight: '5px' }}
                onClick={() => setopenModalUpdateAdd(true)}>
                Cập nhật
              </Button>
            )}
          </Stack>

          <Divider
            style={{ backgroundColor: 'black', height: '1px', marginTop: 10, marginBottom: 10 }}
          />
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <Grid container spacing={2} className="billDetailInfo">
                <Grid item xs={12} sm={4}>
                  <Typography variant="p">
                    <label>Mã: </label>
                    {billDetail?.code}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="p">
                    <label>Tên khách hàng: </label>
                    {billDetail?.fullName ? billDetail.fullName : 'Khách lẻ'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="p">
                    <Stack direction="row" spacing={1}>
                      <label>Trạng thái: </label>
                      <Chip
                        className={getStatusStyle(billDetail.status)}
                        label={getStatus(billDetail.status)}
                        size="small"
                      />
                    </Stack>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="p">
                    <label>Sđt người nhận: </label>
                    {billDetail?.recipientPhoneNumber ? billDetail.recipientPhoneNumber : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="p" fontFamily={'Inter'}>
                    <Stack direction="row" spacing={1}>
                      <label>Loại:</label>
                      {billDetail.receivingMethod === 1 ? (
                        <Chip className="chip-giao-hang" label="Giao hàng" size="small" />
                      ) : (
                        <Chip className="chip-tai-quay" label=" Tại quầy" size="small" />
                      )}
                    </Stack>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="p">
                    <label>Tên người nhận: </label>
                    {billDetail?.recipientName ? billDetail.recipientName : ''}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          )}
        </Paper>
        {loadingTransaction ? (
          <div>Loading...</div>
        ) : (
          <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}>
              <h3>Lịch sửa thanh toán</h3>
              {billDetail?.status > 3 &&
                billDetail?.status < 7 &&
                listTransaction.filter((item) => item.type === 0).length === 0 && (
                  <Button
                    onClick={() => setOpenModalConfirmPayment(true)}
                    variant="outlined"
                    className="them-moi"
                    color="cam"
                    style={{ marginRight: '5px' }}>
                    Xác nhận thanh toán
                  </Button>
                )}
            </Stack>
            {listTransaction.length > 0 ? (
              <>
                <Divider style={{ backgroundColor: 'black', height: '1px', marginTop: 10 }} />
                <AdBillTransaction listTransaction={listTransaction} />
              </>
            ) : (
              <Empty />
            )}
          </Paper>
        )}

        {/* Hoá đơn chi tiết */}
        {listBillDetail.filter((row) => row.status === 0).length > 0 && (
          <Paper
            elevation={3}
            sx={{ mt: 2, mb: 2, paddingTop: 2, paddingBottom: 2, paddingLeft: 2 }}>
            <div>
              {billDetail && listBillDetail.filter((row) => row.status === 0).length > 0 && (
                <div>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}>
                    <h3>Danh sách sản phẩm</h3>
                    {billDetail &&
                      listTransaction.filter((item) => item.type === 0).length === 0 &&
                      (billDetail.status === 1 ||
                        billDetail.status === 2 ||
                        billDetail.status === 6) && (
                        <Button
                          variant="outlined"
                          className="them-moi"
                          color="cam"
                          style={{ marginRight: '5px' }}
                          onClick={() => setOpenModalThemSP(true)}>
                          Thêm sản phẩm
                        </Button>
                      )}
                  </Stack>

                  <Divider style={{ backgroundColor: 'black', height: '1px', marginTop: 10 }} />
                  {loadingListBillDetail ? (
                    <div>Loading BillDetail...</div>
                  ) : (
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TableContainer
                            sx={{ maxHeight: 300, marginBottom: 5 }}
                            className="table-container-custom-scrollbar">
                            {/* billDetail.stt === 0 */}
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableBody>
                                {listBillDetail
                                  .filter((row) => row.status === 0)
                                  .map((row, index) => (
                                    <TableRow key={row.id}>
                                      <TableCell align="center">
                                        <img src={row.productImg} alt="" width={'100px'} />
                                      </TableCell>
                                      <TableCell>
                                        {row.productName} <br></br>
                                        <span style={{ color: 'red' }}>
                                          {formatCurrency(row.price)}
                                        </span>
                                        {/* {row.productPrice !== row.price ? (
                                        <>
                                          <span
                                            style={{
                                              color: 'grey',
                                              textDecoration: 'line-through',
                                            }}>
                                            {formatCurrency(row.productPrice)}
                                          </span>{' '}
                                          <br />
                                          <span style={{ color: 'red' }}>
                                            {formatCurrency(row.price)}
                                          </span>
                                        </>
                                      ) : (
                                        <span style={{ color: 'red' }}>
                                          {formatCurrency(row.price)}
                                        </span>
                                      )} */}
                                        <br />
                                        Size: {row.size}
                                        <br />x{row.quantity}
                                      </TableCell>
                                      <TableCell align="center">
                                        <Box
                                          width={'65px'}
                                          display="flex"
                                          alignItems="center"
                                          sx={{
                                            border: '1px solid gray',
                                            borderRadius: '20px',
                                          }}
                                          p={'3px'}>
                                          <IconButton
                                            sx={{ p: 0 }}
                                            size="small"
                                            onClick={() => handleDecrementQuantity(row, index)}
                                            disabled={
                                              (billDetail &&
                                                listTransaction.filter((item) => item.type === 0)
                                                  .length > 0) ||
                                              (billDetail.status !== 6 && billDetail.status > 2) ||
                                              billDetail.status === 0 ||
                                              row.quantity - 1 === 0
                                            }>
                                            <RemoveIcon fontSize="1px" />
                                          </IconButton>
                                          <TextField
                                            value={row.quantity}
                                            inputProps={{ min: 1 }}
                                            size="small"
                                            sx={{
                                              width: '30px',
                                              '& input': { p: 0, textAlign: 'center' },
                                              '& fieldset': {
                                                border: 'none',
                                              },
                                            }}
                                            onChange={(e) =>
                                              handleTextFieldQuantityChange(
                                                row,
                                                index,
                                                e.target.value,
                                              )
                                            }
                                            onFocus={(e) => handleTextFieldQuanityFocus(e, index)}
                                            disabled={
                                              (billDetail &&
                                                listTransaction.filter((item) => item.type === 0)
                                                  .length > 0) ||
                                              (billDetail.status !== 6 && billDetail.status > 2) ||
                                              billDetail.status === 0
                                            }
                                          />

                                          <IconButton
                                            sx={{ p: 0 }}
                                            size="small"
                                            onClick={() => handleIncrementQuantity(row, index)}
                                            disabled={
                                              (billDetail &&
                                                listTransaction.filter((item) => item.type === 0)
                                                  .length > 0) ||
                                              (billDetail.status !== 6 && billDetail.status > 2) ||
                                              billDetail.status === 0 ||
                                              row.quantity + 1 > 5
                                            }>
                                            <AddIcon fontSize="1px" />
                                          </IconButton>
                                        </Box>
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        style={{ fontWeight: 'bold', color: 'red' }}>
                                        {row.price !== null
                                          ? formatCurrency(row.price * row.quantity)
                                          : 0}
                                        <br />
                                      </TableCell>
                                      <TableCell>
                                        {billDetail &&
                                          listBillDetail.length > 1 &&
                                          billDetail.status !== 0 &&
                                          billDetail.status < 3 && (
                                            <Tooltip title="Xoá sản phẩm">
                                              <IconButton
                                                onClick={() => handleDeleteSPConfirmation(row)}>
                                                <CiCircleRemove />
                                              </IconButton>
                                            </Tooltip>
                                          )}
                                        {billDetail &&
                                          listTransaction.length < 1 &&
                                          listBillDetail.length > 1 &&
                                          billDetail.status === 3 && (
                                            <Tooltip title="Hoàn hàng">
                                              <IconButton onClick={() => handleReturnProduct(row)}>
                                                <TbTruckReturn />
                                              </IconButton>
                                            </Tooltip>
                                          )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Paper>
        )}

        {billDetail && listBillDetail.filter((row) => row.status === 2).length > 0 && (
          <div>
            <Paper
              elevation={3}
              sx={{ mt: 2, mb: 2, paddingTop: 2, paddingBottom: 2, paddingLeft: 2 }}>
              {/* list chờ hoàn trả */}
              <div>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}>
                  <h3>Danh sách sản phẩm hoàn trả</h3>
                </Stack>
                <Divider
                  style={{
                    backgroundColor: 'black',
                    height: '1px',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
                <div>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid item xs={12}>
                        {listBillDetail
                          .filter((row) => row.status === 2)
                          .map((row) => (
                            <Grid container spacing={2}>
                              <Grid item xs={2} sx={{ float: 'right' }}>
                                <img src={row.productImg} alt="" style={{ width: '50%' }} />
                              </Grid>
                              <Grid item xs={4} sx={{ float: 'left' }}>
                                {row.productName} <br />
                                <span style={{ color: 'red' }}>
                                  {formatCurrency(row.price || 0)}
                                </span>
                                <br />
                                Size: {row.size}
                                <br />x{row.quantity}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                {row.note}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                sx={{
                                  width: '10%',
                                  fontWeight: 'bold',
                                  color: 'red',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                {formatCurrency((row.price || 0) * row.quantity)}
                              </Grid>
                            </Grid>
                          ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Paper>
          </div>
        )}

        {billDetail && listBillDetail.filter((row) => row.status === 1).length > 0 && (
          <div>
            <Paper
              elevation={3}
              sx={{ mt: 2, mb: 2, paddingTop: 2, paddingBottom: 2, paddingLeft: 2 }}>
              <div>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}>
                  <h3>Danh sách sản phẩm hoàn hàng</h3>
                </Stack>
                <Divider
                  style={{
                    backgroundColor: 'black',
                    height: '1px',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
                <div>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {listBillDetail
                        .filter((row) => row.status === 1)
                        .map((row) => (
                          <Grid container spacing={2}>
                            <Grid item xs={2} sx={{ float: 'right' }}>
                              <img src={row.productImg} alt="" style={{ width: '50%' }} />
                            </Grid>
                            <Grid item xs={4} sx={{ float: 'left' }}>
                              {row.productName} <br />
                              <span style={{ color: 'red' }}>{formatCurrency(row.price || 0)}</span>
                              <br />
                              Size: {row.size}
                              <br />x{row.quantity}
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              {row.note}
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              sx={{
                                width: '10%',
                                fontWeight: 'bold',
                                color: 'red',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              {formatCurrency((row.price || 0) * row.quantity)}
                            </Grid>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Paper>
          </div>
        )}

        <Paper elevation={3} sx={{ mt: 2, mb: 2, paddingTop: 2, paddingBottom: 2, paddingLeft: 2 }}>
          <div>
            <Grid spacing={2} container>
              <Grid item xs={6}>
                <Stack sx={{ marginRight: 'auto', width: 300, paddingRight: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}>
                    Phiếu giảm giá:
                    <span style={{ fontWeight: 'bold' }}>
                      {billDetail && billDetail.status !== 1
                        ? voucherInBill.id === ''
                          ? ''
                          : voucherInBill.code
                        : voucherMax.id === ''
                          ? voucherInBill.id === ''
                            ? ''
                            : voucherInBill.code
                          : voucherMax.code}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}>
                    <span>Giảm giá từ cửa hàng:</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {percentInBill === null || percentInBill === '' || percentInBill === undefined
                        ? 0 + '%'
                        : percentInBill + '%'}
                    </span>
                  </div>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack sx={{ marginLeft: 'auto', width: 300, paddingRight: 5 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}>
                    Tổng tiền hàng:
                    <span style={{ fontWeight: 'bold' }}>{formatCurrency(totalProductsCost)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}>
                    <span>Giảm giá:</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalMoneyReducerVoucher)}
                    </span>
                  </div>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <div>Phí vận chuyển: </div>
                    {billDetail && totalProductsCost >= 1000000 ? (
                      <div>0 VND</div>
                    ) : (
                      <>
                        <TextField
                          size="small"
                          fullWidth
                          value={tienShip}
                          onChange={(e) => handleTypingMoneyShip(e.target.value)}
                          disabled={
                            (billDetail && billDetail.status > 2) ||
                            (billDetail && billDetail.status <= 0)
                          }
                        />
                        {/* <span>
                          {billDetail && billDetail.moneyShip
                            ? formatCurrency(billDetail.moneyShip)
                            : formatCurrency(0)}
                        </span> */}
                      </>
                    )}
                  </Stack>
                  {totalProductsCost >= 1000000 && (
                    <i style={{ fontSize: '9' }}>
                      Miễn phí vận chuyển với đơn hàng có tổng tiền trên 1.000.000 VNĐ
                    </i>
                  )}

                  <Divider style={{ backgroundColor: 'black', height: '2px', marginTop: 5 }} />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}>
                    <span style={{ fontWeight: 'bold' }}>Tổng tiền:</span>
                    <span style={{ fontWeight: 'bold', color: 'red' }}>
                      {formatCurrency(totalMoneyAfter)}
                    </span>
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </div>
    )
  )
}
