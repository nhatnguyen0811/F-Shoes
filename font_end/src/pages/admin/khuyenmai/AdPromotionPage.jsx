import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { TbEyeEdit } from 'react-icons/tb'

import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import AddIcon from '@mui/icons-material/Add'
import { Link } from 'react-router-dom'
import khuyenMaiApi from '../../../api/admin/khuyenmai/khuyenMaiApi'
import dayjs from 'dayjs'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import SearchIcon from '@mui/icons-material/Search'
import './home.css'
import confirmSatus from '../../../components/comfirmSwal'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import { socketUrl } from '../../../services/url'
import * as ExcelJS from 'exceljs'
import useDebounce from '../../../services/hook/useDebounce'
import FileUploadIcon from '@mui/icons-material/FileUpload'

var stompClient = null
export default function AdPromotionPage() {
  const theme = useTheme()
  const [listKhuyenMai, setListKhuyenMai] = useState([])
  const [listKhuyenMaiEx, setListKhuyenMaiEx] = useState([])
  const [listKhuyenMaiUpdate, setListKhuyenMaiUpdate] = useState([])
  const [totalPages, setTotalPages] = useState(0)

  const [filter, setFilter] = useState({
    page: 1,
    size: 5,
    name: '',
    timeStart: '',
    timeEnd: '',
    status: null,
    type: null,
    sortOrder: null,
  })

  useEffect(() => {
    const socket = new SockJS(socketUrl)
    stompClient = Stomp.over(socket)
    stompClient.debug = () => {}
    stompClient.connect({}, onConnect)

    return () => {
      stompClient.disconnect()
    }
  }, [])

  const onConnect = () => {
    stompClient.subscribe('/topic/promotionUpdates', (message) => {
      if (message.body) {
        const data = JSON.parse(message.body)
        setListKhuyenMaiUpdate(data)
      }
    })
  }

  useEffect(() => {
    const updatedKhuyenMai = listKhuyenMai.map((khuyenMai) => {
      const matchedData = listKhuyenMaiUpdate.find((item) => item.id === khuyenMai.id)
      if (matchedData) {
        return {
          ...khuyenMai,
          status: matchedData.status,
        }
      } else {
        return khuyenMai
      }
    })
    setListKhuyenMai(updatedKhuyenMai)
  }, [listKhuyenMaiUpdate, listKhuyenMai])

  const handleDelete = (id) => {
    if (listKhuyenMai?.status === 2) {
      toast.success('Đợt giảm giá đã kết thúc', {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else {
      const title = 'Bạn có muốn kết thúc đợt giảm giá không ?'
      const text = ''

      confirmSatus(title, text, theme).then((result) => {
        if (result.isConfirmed) {
          khuyenMaiApi.deletePromotion(id).then(() => {
            fecthData(filter)
            toast.success('Đợt giảm giá đã kết thúc', {
              position: toast.POSITION.TOP_RIGHT,
            })
          })
        }
      })
    }
  }

  useEffect(() => {
    fecthData(filter)
    getAllKhuyenMai()
  }, [filter])

  const fecthData = (filter) => {
    khuyenMaiApi.getAllPromotion(filter).then((response) => {
      let sortedListKhuyenMai = response.data.data

      if (filter.sortOrder === 'ascending') {
        sortedListKhuyenMai.sort((a, b) => a.value - b.value)
      } else if (filter.sortOrder === 'descending') {
        sortedListKhuyenMai.sort((a, b) => b.value - a.value)
      }

      setListKhuyenMai(response.data.data)
      setTotalPages(response.data.totalPages)
      if (filter.page > response.data.totalPages)
        if (response.data.totalPages > 0) {
          setFilter({
            ...filter,
            page: response.data.totalPages,
          })
        }
    })
  }

  const getAllKhuyenMai = () => {
    khuyenMaiApi.getAll().then((response) => {
      setListKhuyenMaiEx(response.data.data)
    })
  }
  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, name: inputValue })
  }, [debouncedValue])

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('PromotionData')

    const columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Tên', key: 'name', width: 15 },
      { header: 'Giá trị', key: 'value', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 20 },
      { header: 'Thời gian bắt đầu', key: 'timeStart', width: 17.5 },
      { header: 'Thời gian kết thúc', key: 'timeEnd', width: 17.5 },
    ]

    worksheet.columns = columns

    listKhuyenMaiEx.forEach((row, index) => {
      worksheet.addRow({
        stt: index + 1,
        name: row.name,
        value: `${row.value}%`,
        status:
          row.status === 2 ? 'Đã kết thúc' : row.status === 1 ? 'Đang diễn ra' : 'Sắp diễn ra',
        timeStart: dayjs(row.timeStart).format('DD/MM/YYYY HH:mm'),
        timeEnd: dayjs(row.timeEnd).format('DD/MM/YYYY HH:mm'),
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
      link.download = 'promotion_data.xlsx'
      link.click()
    })
  }

  const listBreadcrumbs = [{ name: 'Đợt giảm giá', link: '/admin/promotion' }]
  return (
    <>
      <div className="promotion">
        <BreadcrumbsCustom listLink={listBreadcrumbs} />
        <Paper elevation={3} sx={{ mb: 2, padding: 2 }}>
          <Box sx={{ width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <TextField
                sx={{ width: '48%' }}
                placeholder="Tìm kiếm theo tên đợt giảm giá"
                className="text-field-css"
                size="small"
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
                      <SearchIcon color="cam" />
                    </InputAdornment>
                  ),
                }}
              />
              <div>
                {/* <Button
                sx={{ borderRadius: '8px' }}
                color="cam"
                variant="outlined"
                onClick={handleExportTemplate}>
                <FileUploadIcon />
              </Button>
              <Button
                sx={{ borderRadius: '8px' }}
                color="cam"
                variant="outlined"
                onClick={handleExportTemplate}>
                <FileDownloadIcon />
              </Button> */}
                <Button
                  onClick={exportToExcel}
                  disableElevation
                  color="cam"
                  variant="outlined"
                  style={{ marginRight: '10px' }}>
                  <FileUploadIcon /> Export Excel
                </Button>
                <Button
                  sx={{ borderRadius: '8px' }}
                  color="cam"
                  variant="outlined"
                  component={Link}
                  to="/admin/promotion/add">
                  <AddIcon />
                  <Typography sx={{ ml: 0, fontWeight: '500' }}>Thêm mới</Typography>
                </Button>
              </div>
            </Stack>
            <Stack
              my={2}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    className="dateTimePro"
                    format="DD/MM/YYYY HH:mm:ss"
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        timeStart: dayjs(e).toDate().getTime(),
                      })
                    }
                    slotProps={{
                      actionBar: {
                        actions: ['clear', 'today'],
                      },
                    }}
                    label="Ngày bắt đầu"
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    className="dateTimePro"
                    format={'DD/MM/YYYY HH:mm:ss'}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        timeEnd: dayjs(e).toDate().getTime(),
                      })
                    }
                    slotProps={{
                      actionBar: {
                        actions: ['clear', 'today'],
                      },
                    }}
                    label="Ngày kết thúc"
                  />
                </DemoContainer>
              </LocalizationProvider>
              <div className="filter">
                <b>Trạng Thái: </b>
                <Select
                  displayEmpty
                  size="small"
                  value={filter.status}
                  onChange={(e) => {
                    setFilter({ ...filter, status: e.target.value })
                  }}>
                  <MenuItem value={null}>Trạng thái</MenuItem>
                  <MenuItem value={0}>Sắp diễn ra</MenuItem>
                  <MenuItem value={1}>Đang diễn ra</MenuItem>
                  <MenuItem value={2}>Đã kết thúc</MenuItem>
                  <MenuItem></MenuItem>
                </Select>
              </div>

              <div className="filter">
                <b>Giá trị: </b>
                <Select
                  displayEmpty
                  size="small"
                  value={filter.sortOrder}
                  onChange={(e) => {
                    setFilter({ ...filter, sortOrder: e.target.value })
                  }}>
                  <MenuItem value={null}>Giá trị</MenuItem>
                  <MenuItem value="ascending">Tăng dần</MenuItem>
                  <MenuItem value="descending">Giảm dần</MenuItem>
                  <MenuItem></MenuItem>
                </Select>
              </div>
            </Stack>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2 }}>
          <Table aria-label="simple table" className="tableCss">
            <TableHead>
              <TableRow>
                <TableCell align="center" width={'5%'}>
                  STT
                </TableCell>
                <TableCell align="left" width={'20%'}>
                  Tên Đợt giảm giá
                </TableCell>
                <TableCell align="center" width={'6%'}>
                  Giá trị
                </TableCell>
                <TableCell align="center" width={'13%'}>
                  Trạng thái
                </TableCell>
                <TableCell align="center" width={'15%'}>
                  Thời gian bắt đầu
                </TableCell>
                <TableCell align="center" width={'15%'}>
                  Thời gian kết thúc
                </TableCell>
                <TableCell align="center" width={'10%'}>
                  Hoạt động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listKhuyenMai.map((promotion, index) => (
                <TableRow
                  key={promotion.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{promotion.stt}</TableCell>

                  <TableCell align="left">{promotion.name}</TableCell>
                  <TableCell align="center">{promotion.value}%</TableCell>
                  <TableCell align="center">
                    <Chip
                      onClick={() => {
                        if (promotion.status === 0 || promotion.status === 1) {
                          handleDelete(promotion.id)
                        }
                      }}
                      className={
                        promotion.status === 0
                          ? 'chip-sap-hoat-dong'
                          : promotion.status === 1
                            ? 'chip-hoat-dong'
                            : 'chip-khong-hoat-dong'
                      }
                      size="small"
                      label={
                        promotion.status === 0
                          ? 'Sắp diễn ra'
                          : promotion.status === 1
                            ? 'Đang diễn ra'
                            : 'Đã kết thúc'
                      }
                    />
                  </TableCell>

                  <TableCell align="center">
                    {dayjs(promotion.timeStart).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(promotion.timeEnd).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/promotion/get-one/${promotion.id}`}>
                      <Tooltip title="Xem chi tiết đợt giảm giá">
                        <IconButton sx={{ marginLeft: '30px' }} color="cam">
                          <TbEyeEdit />
                        </IconButton>
                      </Tooltip>
                    </Link>
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
                  setFilter({ ...filter, size: e.target.value })
                }}
                sx={{ height: '25px', mx: 0.5 }}
                size="small"
                value={filter.size}>
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
              count={totalPages}
              page={filter.page}
              onChange={(e, value) => {
                e.preventDefault()
                setFilter({ ...filter, page: value })
              }}
            />
          </Stack>
        </Paper>
      </div>
    </>
  )
}
