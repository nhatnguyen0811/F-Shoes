import React, { useState, useEffect } from 'react'
import '../hoadon/hoaDonStyle.css'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Button,
  TextField,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Stack,
  InputAdornment,
  Typography,
  Tabs,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Modal,
} from '@mui/material'
import Tab from '@mui/material/Tab'
import hoaDonApi from '../../../api/admin/hoadon/hoaDonApi'
import dayjs from 'dayjs'
import ExcelJS from 'exceljs'
import { getStatus } from '../../../services/constants/statusHoaDon'
import Tooltip from '@mui/material/Tooltip'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import SearchIcon from '@mui/icons-material/Search'
import { Link, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../../services/common/formatCurrency '
import { getStatusStyle } from './getStatusStyle'
import { TbEyeEdit } from 'react-icons/tb'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import Empty from '../../../components/Empty'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { socketUrl } from '../../../services/url'
import { toast } from 'react-toastify'
import sellApi from '../../../api/admin/sell/SellApi'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import { MdOutlineDocumentScanner } from 'react-icons/md'
import returnApi from '../../../api/admin/return/returnApi'
import useDebounce from '../../../services/hook/useDebounce'
import Scanner from '../../../layout/Scanner'

var stompClient = null
export default function AdBillPage() {
  const [listHoaDon, setListHoaDon] = useState([])
  const [hoaDonUpdate, setHoaDonUpdate] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [inputSearch, setInputSearch] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [listBill, setlistBill] = useState([])
  // const [statusBill, setStatusBill] = useState('all')
  const [typeBill, setTypeBill] = useState('all')
  const [filter, setFilter] = useState({
    page: 1,
    size: 5,
    startDate: '',
    endDate: '',
    status: '',
    type: '',
    inputSearch: '',
  })
  const [valueTabHD, setValueTabHD] = React.useState('all')
  const listSttHD = [0, 1, 2, 3, 4, 5, 6, 7]

  useEffect(() => {
    filterBill(filter)
  }, [filter])

  const handleChangeTab = (event, newValue) => {
    setValueTabHD(newValue)
    const updatedFilter = { ...filter, status: newValue, page: 1 }
    setFilter(updatedFilter)
  }

  const handlePageChange = (event, newPage) => {
    const updatedFilter = { ...filter, page: newPage }
    setFilter(updatedFilter)
    setCurrentPage(newPage)
  }
  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, inputSearch: inputValue })
  }, [debouncedValue])

  // const handleChangeSelectStatusBill = (event) => {
  //   const updatedFilter = { ...filter, status: event.target.value, page: 1 }
  //   setStatusBill(event.target.value)
  //   setFilter(updatedFilter)
  // }

  const handleChangeSelectTypeBill = (event) => {
    const updatedFilter = { ...filter, type: event.target.value, page: 1 }
    setTypeBill(event.target.value)
    setFilter(updatedFilter)
  }

  const handleStartDateChange = (newValue) => {
    const formattedStartDate = dayjs(newValue).format('DD-MM-YYYY')
    const startDateString = `${formattedStartDate} `
    const updatedFilter = { ...filter, startDate: startDateString, page: 1 }
    setFilter(updatedFilter)
    setStartDate(newValue)
  }

  const handleEndDateChange = (newValue) => {
    const formattedEndDate = dayjs(newValue).add(1, 'day').format('DD-MM-YYYY')
    const updatedFilter = { ...filter, endDate: formattedEndDate, page: 1 }
    setFilter(updatedFilter)
    setEndDate(newValue)
  }

  const filterBill = (filter) => {
    hoaDonApi
      .getBillFilter(filter)
      .then((response) => {
        setListHoaDon(response.data.data)
        setTotalPages(response.data.totalPages)
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu API get filter: ', error)
      })
  }

  useEffect(() => {
    const preListHoaDon = [...listHoaDon]
    setListHoaDon([
      { ...hoaDonUpdate },
      ...preListHoaDon
        .slice(0, preListHoaDon.length === 5 ? preListHoaDon.length - 1 : preListHoaDon.length)
        .map((hd) => {
          hd.stt = hd.stt + 1
          return hd
        }),
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoaDonUpdate])

  useEffect(() => {
    const socket = new SockJS(socketUrl)
    stompClient = Stomp.over(socket)
    stompClient.debug = () => {}
    stompClient.connect({}, onConnect)

    return () => {
      stompClient.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listHoaDon])

  const onConnect = () => {
    stompClient.subscribe('/topic/bill-update', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        setHoaDonUpdate(data)
      }
    })
    stompClient.subscribe('/topic/real-time-huy-don-bill-page-admin', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        billRealTime(data)
      }
    })
    stompClient.subscribe('/topic/real-time-xac-nhan-bill-page-admin', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        billRealTime(data)
      }
    })
    stompClient.subscribe('/topic/real-time-update-status-bill-page-admin', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        billRealTime(data)
      }
    })
    stompClient.subscribe('/topic/real-time-payment-bill-page-admin', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        billRealTime(data)
      }
    })
    stompClient.subscribe('/topic/real-time-huy-don-bill-page-admin-by-customer', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        billRealTime(data)
      }
    })
  }

  const billRealTime = (data) => {
    const preProduct = [...listHoaDon]
    const index = preProduct.findIndex((p) => p.id === data.id)
    if (index !== -1) {
      preProduct[index] = data
      setListHoaDon(preProduct)
    }
  }
  const getAllBillTaoDonHang = () => {
    sellApi.getAllBillTaoDonHang().then((response) => {
      setlistBill(response.data.data)
    })
  }
  let navigate = useNavigate()
  const handleAddSellClick = async () => {
    if (listBill.length === 5) {
      toast.warning('Tối đa 5 hóa đơn', { position: toast.POSITION.TOP_CENTER })
      return
    }
    sellApi
      .createBill()
      .then((res) => {
        if (res.data.success) {
          setlistBill([...listBill, res.data.data])
        }
      })
      .finally(() => {
        navigate('/admin/sell')
      })
  }
  useEffect(() => {
    getAllBillTaoDonHang()
  }, [])

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('BillData')

    const columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Mã', key: 'code', width: 8 },
      { header: 'Tổng SP', key: 'totalProduct', width: 8 },
      { header: 'Tổng số tiền', key: 'moneyAfter', width: 15 },
      { header: 'Tên khách hàng', key: 'fullName', width: 15 },
      { header: 'Ngày tạo', key: 'createdAt', width: 17.5 },
      { header: 'Loại hoá đơn', key: 'type', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 20 },
    ]

    worksheet.columns = columns

    listHoaDon.forEach((row, index) => {
      worksheet.addRow({
        stt: row.stt,
        code: row.code,
        totalProduct: row.totalProduct !== null ? row.totalProduct : 0,
        moneyAfter: row.moneyAfter !== null ? row.moneyAfter : 0,
        fullName: row.fullName !== null ? row.fullName : 'Khách lẻ',
        createdAt: dayjs(row.createdAt).format('DD/MM/YYYY HH:mm'),
        type: row.type === 1 ? 'Trực tuyến' : 'Tại quầy',
        status: getStatus(row.status),
      })
    })

    const titleStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF008080' },
      },
    }

    worksheet.getRow(1).eachCell((cell) => {
      cell.style = titleStyle
    })

    worksheet.columns.forEach((column) => {
      const { width } = column
      column.width = width
    })

    const blob = workbook.xlsx.writeBuffer().then(
      (buffer) =>
        new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
    )

    blob.then((blobData) => {
      const url = window.URL.createObjectURL(blobData)
      const link = document.createElement('a')
      link.href = url
      link.download = 'bill_data.xlsx'
      link.click()
    })
  }

  const [qrScannerVisible, setQrScannerVisible] = useState(false)

  function scanQr(code) {
    returnApi.getBill({ codeBill: code }).then((result) => {
      if (result.data.success) {
        navigate('/admin/bill-detail/' + result.data.data)
        setQrScannerVisible(false)
      } else {
        toast.warning('Hóa đơn không tồn tại, vui lòng thử lại')
      }
    })
  }

  const listBreadcrumbs = [{ name: 'Quản lý đơn hàng', link: '/admin/bill' }]
  return (
    <div className="hoa-don">
      <BreadcrumbsCustom listLink={listBreadcrumbs} />
      <Modal
        open={qrScannerVisible}
        onClose={() => {
          setQrScannerVisible(false)
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
          <Scanner handleScan={scanQr} setOpen={setQrScannerVisible} />
        </Box>
      </Modal>
      <Paper elevation={3} sx={{ mb: 2, padding: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
          style={{ marginBottom: '20px' }}>
          <TextField
            // onChange={(e) => {
            //   setInputValue(e.target.value)
            // }}
            onChange={(e) => {
              const valueNhap = e.target.value
              if (validateSearchInput(valueNhap)) {
                setInputValue(valueNhap)
              } else {
                setInputValue('')
                toast.warning('Tìm kiếm không được có kí tự đặc biệt')
              }
            }}
            id="hd-input-search"
            sx={{ width: '50%' }}
            className="search-field"
            size="small"
            color="cam"
            placeholder="Tìm kiếm hoá đơn"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="cam" />
                </InputAdornment>
              ),
            }}
          />
          <div>
            <Button
              onClick={() => {
                setQrScannerVisible(true)
              }}
              color="cam"
              variant="outlined">
              <MdOutlineDocumentScanner style={{ marginRight: '5px', fontSize: '17px' }} />
              Quét mã
            </Button>
            &nbsp; &nbsp;
            <Button
              onClick={handleAddSellClick}
              color="cam"
              variant="outlined"
              className="them-moi">
              <AiOutlinePlusSquare style={{ marginRight: '5px', fontSize: '17px' }} />
              Tạo hoá đơn
            </Button>
          </div>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          style={{ marginTop: '10px' }}>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs} style={{ flexBasis: '40%' }}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <div style={{ marginBottom: '10px' }}>
                  <DatePicker
                    id="start-date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    slotProps={{
                      actionBar: {
                        actions: ['clear', 'today'],
                      },
                    }}
                    style={{
                      borderRadius: '5px',
                      width: '100%',
                    }}
                    className="dateTime"
                    label="Từ ngày"
                  />
                </div>
                <div>
                  <DatePicker
                    id="end-date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    slotProps={{
                      actionBar: {
                        actions: ['clear', 'today'],
                      },
                    }}
                    style={{
                      borderRadius: '5px',
                      width: '100%',
                    }}
                    className="dateTime"
                    label="Đến ngày"
                  />
                </div>
              </DemoContainer>
            </LocalizationProvider>
          </div>

          <div
            my={2}
            direction="row"
            style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center' }}
            spacing={2}>
            <div className="filter">
              <b style={{ marginRight: '10px' }}>Loại:</b>
            </div>
            <RadioGroup
              row
              aria-label="status"
              name="status"
              value={typeBill}
              onChange={handleChangeSelectTypeBill}>
              <FormControlLabel
                value={'all'}
                control={<Radio color="cam" size="small" />}
                label="Tất cả"
              />
              <FormControlLabel
                value={true}
                control={<Radio color="cam" size="small" />}
                label="Trực tuyến"
              />
              <FormControlLabel
                value={false}
                control={<Radio color="cam" size="small" />}
                label="Tại quầy"
              />
            </RadioGroup>
          </div>
          <Button
            onClick={exportToExcel}
            disableElevation
            color="cam"
            variant="outlined"
            style={{ marginLeft: '10px' }}>
            Export Excel
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={3}>
        {listHoaDon.length === 0 ? (
          <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={valueTabHD} onChange={handleChangeTab} className="tabSttHD">
                <Tab label={'Tất cả'} key={'tabSttHd all'} value={'all'}></Tab>
                {listSttHD.map((row, i) => (
                  <Tab label={getStatus(row)} key={'tabSttHd' + i} value={row}></Tab>
                ))}
              </Tabs>
            </Box>
            <Empty />
          </div>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={valueTabHD} onChange={handleChangeTab} className="tabSttHD">
                <Tab label={'Tất cả'} key={'tabSttHd all'} value={'all'}></Tab>
                {listSttHD.map((row, i) => (
                  <Tab label={getStatus(row)} key={'tabSttHd' + i} value={row}></Tab>
                ))}
              </Tabs>
            </Box>
            <Table className="tableCss">
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ width: '5%' }}>
                    #
                  </TableCell>
                  <TableCell align="center" style={{ width: '8%' }}>
                    Mã
                  </TableCell>
                  <TableCell align="center" style={{ width: '8%' }}>
                    Tổng SP
                  </TableCell>
                  <TableCell align="center">Tổng số tiền</TableCell>
                  <TableCell align="center">Tên khách hàng</TableCell>
                  <TableCell align="center">Ngày tạo</TableCell>
                  <TableCell align="center">Loại hoá đơn</TableCell>
                  <TableCell align="center">Trạng thái</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listHoaDon.map((row, index) => (
                  <TableRow key={row.code}>
                    <TableCell align="center" style={{ width: '5%' }}>
                      {row.stt}
                    </TableCell>
                    <TableCell align="center" style={{ width: '8%' }}>
                      {row.code}
                    </TableCell>
                    <TableCell align="center" style={{ width: '8%' }}>
                      {row.totalProduct !== null ? row.totalProduct : 0}
                    </TableCell>
                    <TableCell align="center">
                      {row.moneyAfter !== null ? formatCurrency(row.moneyAfter) : 0}
                    </TableCell>
                    <TableCell align="center">
                      {row.fullName !== null ? (
                        row.fullName
                      ) : (
                        <Chip className="chip-khach-le" label="Khách lẻ" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {dayjs(row.createdAt).format('DD/MM/YYYY  HH:mm')}
                    </TableCell>
                    <TableCell align="center">
                      {row.type === 1 ? (
                        <Chip className="chip-giao-hang" label="Trực tuyến" size="small" />
                      ) : (
                        <Chip className="chip-tai-quay" label="Tại quầy" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        className={getStatusStyle(row.status)}
                        label={getStatus(row.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/admin/bill-detail/${row.id}`}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton>
                            <TbEyeEdit fontSize={'25px'} color="#FC7C27" />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        <Stack
          mt={2}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={0}
          style={{ padding: '10px' }}>
          <Typography component="span" variant={'body2'} mt={0.5}>
            <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>Xem</Typography>
            <Select
              color="cam"
              onChange={(e) => {
                setFilter({ ...filter, size: e.target.value, page: 1 })
              }}
              sx={{ height: '25px', mx: 0.5 }}
              size="small"
              value={filter.size}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
            <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>Hoá đơn</Typography>
          </Typography>
          <Pagination
            defaultPage={1}
            page={currentPage}
            onChange={handlePageChange}
            count={totalPages}
            variant="outlined"
            color="cam"
          />
        </Stack>
      </Paper>
    </div>
  )
}
