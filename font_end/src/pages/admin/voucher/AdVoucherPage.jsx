import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Pagination from '@mui/material/Pagination'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import voucherApi from '../../../api/admin/voucher/VoucherApi'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import SearchIcon from '@mui/icons-material/Search'
import { AiOutlinePlus } from 'react-icons/ai'
import { TbEyeEdit } from 'react-icons/tb'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import confirmSatus from '../../../components/comfirmSwal'
import './voucher.css'
import Empty from '../../../components/Empty'
import { formatCurrency } from '../../../services/common/formatCurrency '
import { Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import { socketUrl } from '../../../services/url'
import useDebounce from '../../../services/hook/useDebounce'
import ExcelJS from 'exceljs'

var stompClient = null

export default function AdVoucherPage() {
  const [listVoucher, setListVoucher] = useState([])
  const [listVoucherEx, setListVoucherEx] = useState([])
  const [listVoucherUpdate, setListVoucherUpdate] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [dataFetched, setDataFetched] = useState(false)
  const [searchVoucher, setSearchVoucher] = useState({
    nameSearch: '',
    startDateSearch: '',
    endDateSearch: '',
    typeSearch: '',
    typeValueSearch: '',
    statusSearch: '',
    page: 1,
    size: 5,
  })

  useEffect(() => {
    const socket = new SockJS(socketUrl)
    stompClient = Stomp.over(socket)
    stompClient.debug = () => {}
    stompClient.debug = () => {}

    stompClient.connect({}, onConnect)

    return () => {
      stompClient.disconnect()
    }
  }, [])

  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setSearchVoucher({
      ...searchVoucher,
      nameSearch: inputValue,
    })
  }, [debouncedValue])

  const onConnect = () => {
    stompClient.subscribe('/topic/voucherUpdates', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        setListVoucherUpdate(data)
      }
    })
  }

  useEffect(() => {
    const updatedVouchers = listVoucher.map((voucher) => {
      const matchedData = listVoucherUpdate.find((item) => item.id === voucher.id)
      if (matchedData) {
        return {
          ...voucher,
          code: matchedData.code,
          name: matchedData.name,
          value: matchedData.value,
          maximumValue: matchedData.maximumValue,
          type: matchedData.type,
          minimumAmount: matchedData.minimumAmount,
          quantity: matchedData.quantity,
          startDate: matchedData.startDate,
          endDate: matchedData.endDate,
          status: matchedData.status,
        }
      } else {
        return voucher
      }
    })
    setListVoucher(updatedVouchers)
  }, [listVoucher, listVoucherUpdate])

  const handelOnchangePage = (page) => {
    setSearchVoucher({ ...searchVoucher, page: page })
    fetchData(searchVoucher)
  }

  const fetchData = (searchVoucher) => {
    voucherApi
      .searchVoucher(searchVoucher)
      .then((response) => {
        setListVoucher(response.data.data.content)
        setTotalPages(response.data.data.totalPages)
        setDataFetched(true)
      })
      .catch(() => {
        setDataFetched(false)
        toast.warning('Vui lòng f5 tải lại dữ liệu', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const handelDeleteVoucher = (idDelete) => {
    const title = 'Xác nhận hủy phiếu giảm giá?'
    const text = ''
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed) {
        voucherApi
          .deleteVoucher(idDelete)
          .then(() => {
            toast.success('Hủy phiếu giảm giá thành công', {
              position: toast.POSITION.TOP_RIGHT,
            })
            fetchData(searchVoucher)
          })
          .catch(() => {
            toast.error('Hủy phiếu giảm giá thất bại', {
              position: toast.POSITION.TOP_RIGHT,
            })
          })
      }
    })
  }

  useEffect(() => {
    fetchData(searchVoucher)
    getAllVoucherKH()
  }, [searchVoucher])

  const getAllVoucherKH = () => {
    voucherApi.getAllVoucher().then((response) => {
      setListVoucherEx(response.data.data)
    })
  }
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('VoucherData')

    const columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Mã', key: 'code', width: 8 },
      { header: 'Tên', key: 'name', width: 15 },
      { header: 'Kiểu', key: 'type', width: 15 },
      { header: 'Loại', key: 'typeValue', width: 15 },
      { header: 'Ngày bắt đầu', key: 'startDate', width: 17.5 },
      { header: 'Ngày kết thúc', key: 'endDate', width: 17.5 },
      { header: 'Trạng thái', key: 'status', width: 20 },
    ]

    worksheet.columns = columns

    listVoucherEx.forEach((row, index) => {
      worksheet.addRow({
        stt: row.stt,
        code: row.code,
        name: row.name,
        type: row.type === 0 ? 'Công khai' : 'Cá nhân',
        typeValue: row.typeValue === 0 ? 'Phần trăm' : 'Giá tiền',
        startDate: dayjs(row.startDate).format('DD/MM/YYYY HH:mm'),
        endDate: dayjs(row.endDate).format('DD/MM/YYYY HH:mm'),
        status:
          row.status === 2 ? 'Đã kết thúc' : row.status === 1 ? 'Đang diễn ra' : 'Sắp diễn ra',
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
      link.download = 'voucher_data.xlsx'
      link.click()
    })
  }

  const listBreadcrumbs = [{ name: 'Phiếu giảm giá', link: '/admin/voucher' }]
  return listVoucher ? (
    <div className="voucher-css">
      <BreadcrumbsCustom listLink={listBreadcrumbs} />
      <Paper elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              className="search-voucher"
              placeholder="Tìm phiếu giảm giá theo mã hoặc tên"
              type="text"
              size="small"
              fullWidth
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={3.5}></Grid>
          <Grid item xs={2.5} className="icon-css">
            <Link to={'/admin/voucher/add'}>
              <Button
                variant="outlined"
                color="cam"
                style={{ borderRadius: '8px ', borderColor: '#fc7c27' }}>
                <AiOutlinePlus className="icon-css" />
                <Typography>Tạo mới</Typography>
              </Button>
            </Link>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 1 }} spacing={2}>
          <Grid item xs={3} className="dateTime">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                format={'DD-MM-YYYY HH:mm'}
                onChange={(e) => {
                  setSearchVoucher({
                    ...searchVoucher,
                    startDateSearch: dayjs(e).toDate().getTime(),
                  })
                }}
                ampm={false}
                slotProps={{
                  actionBar: {
                    actions: ['clear', 'today'],
                  },
                }}
                label="Từ ngày"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={3} className="dateTime">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                format={'DD-MM-YYYY HH:mm'}
                onChange={(e) => {
                  setSearchVoucher({
                    ...searchVoucher,
                    endDateSearch: dayjs(e).toDate().getTime(),
                  })
                }}
                ampm={false}
                slotProps={{
                  actionBar: {
                    actions: ['clear', 'today'],
                  },
                }}
                label="Đến ngày"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" justifyContent="start" alignItems="center" spacing={1}>
              <div className="filter">
                <b>Kiểu</b>
                <Select
                  displayEmpty
                  size="small"
                  value={searchVoucher.typeSearch}
                  onChange={(e) =>
                    setSearchVoucher({ ...searchVoucher, typeSearch: e.target.value })
                  }>
                  <MenuItem value={''}>Kiểu</MenuItem>
                  <MenuItem value={0}>Công khai</MenuItem>
                  <MenuItem value={1}>Cá nhân</MenuItem>
                </Select>
                <b>Loại</b>
                <Select
                  displayEmpty
                  size="small"
                  value={searchVoucher.typeValueSearch}
                  onChange={(e) =>
                    setSearchVoucher({ ...searchVoucher, typeValueSearch: e.target.value })
                  }>
                  <MenuItem value={''}>Loại</MenuItem>
                  <MenuItem value={0}>Phần trăm</MenuItem>
                  <MenuItem value={1}>Giá tiền</MenuItem>
                </Select>
                <b>Trạng thái</b>
                <Select
                  displayEmpty
                  size="small"
                  value={searchVoucher.statusSearch}
                  onChange={(e) =>
                    setSearchVoucher({ ...searchVoucher, statusSearch: e.target.value })
                  }>
                  <MenuItem value={''}>Trạng thái</MenuItem>
                  <MenuItem value={0}>Sắp diễn ra</MenuItem>
                  <MenuItem value={1}>Đang diễn ra</MenuItem>
                  <MenuItem value={2}>Đã kết thúc</MenuItem>
                </Select>
              </div>
              <Button variant="outlined" color="cam" onClick={exportToExcel}>
                Xuất Excel
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Grid sx={{ mt: 1 }}>
          {dataFetched && (
            <Table className="tableCss" sx={{ mt: 4 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={'5%'}>
                    STT
                  </TableCell>
                  <TableCell align="center" width={'10.5%'}>
                    Mã
                  </TableCell>
                  <TableCell align="center" width={'15%'}>
                    Tên
                  </TableCell>
                  <TableCell align="center" width={'12.5%'}>
                    Kiểu
                  </TableCell>
                  <TableCell align="center" width={'15%'}>
                    Loại
                  </TableCell>
                  <TableCell align="center" width={'10%'}>
                    Số lượng
                  </TableCell>
                  <TableCell align="center" width={'15%'}>
                    Ngày bắt đầu
                  </TableCell>
                  <TableCell align="center" width={'15%'}>
                    Ngày kết thúc
                  </TableCell>
                  <TableCell align="center" width={'15%'}>
                    Trạng thái
                  </TableCell>
                  <TableCell align="center" width={'10%'}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listVoucher.map((row) => (
                  <TableRow>
                    <TableCell align="center">{row.stt}</TableCell>
                    <TableCell align="center">{row.code}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">
                      {row.type === 0 ? (
                        <Chip className="chip-tat-ca" size="small" label="Công khai" />
                      ) : (
                        <Chip className="chip-gioi-han" size="small" label="Cá nhân" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.typeValue === 0 ? row.value + '%' : formatCurrency(row.value)}
                    </TableCell>
                    <TableCell align="center">{row.quantity}</TableCell>
                    <TableCell align="center">
                      {dayjs(row.startDate).format('DD/MM/YYYY HH:mm')}
                    </TableCell>
                    <TableCell align="center">
                      {dayjs(row.endDate).format('DD/MM/YYYY HH:mm')}
                    </TableCell>
                    <TableCell align="center">
                      {row.status === 2 ? (
                        <Chip className="chip-khong-hoat-dong" size="small" label="Đã kết thúc" />
                      ) : row.status === 1 ? (
                        <Chip
                          className="chip-hoat-dong"
                          size="small"
                          label="Đang diễn ra"
                          onClick={() => handelDeleteVoucher(row.id)}
                        />
                      ) : (
                        <Chip
                          className="chip-sap-hoat-dong"
                          size="small"
                          label="Sắp diễn ra"
                          onClick={() => handelDeleteVoucher(row.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/admin/voucher/${row.id}/detail`}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton color="cam">
                            <TbEyeEdit style={{ fontSize: '30px' }} />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!dataFetched && (
            <p>
              <Empty />
            </p>
          )}
          {/* <Grid container sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}> */}
          <Stack
            mt={2}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={0}>
            <Typography component="span" variant={'body2'} mt={0.5}>
              <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>Xem</Typography>
              <Select
                onChange={(e) => {
                  setSearchVoucher({ ...searchVoucher, size: e.target.value, page: 1 })
                }}
                sx={{ height: '25px', mx: 0.5 }}
                size="small"
                value={searchVoucher.size}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
              <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>sản phẩm</Typography>
            </Typography>
            <Pagination
              variant="outlined"
              color="cam"
              page={searchVoucher.page}
              onChange={(_, page) => handelOnchangePage(page)}
              count={totalPages}
            />
          </Stack>
          {/* </Grid> */}
        </Grid>
      </Paper>
    </div>
  ) : (
    <div></div>
  )
}
