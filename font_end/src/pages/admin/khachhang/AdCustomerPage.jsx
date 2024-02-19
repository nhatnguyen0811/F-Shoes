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
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import ExcelJS from 'exceljs'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import khachHangApi from '../../../api/admin/khachhang/KhachHangApi'
import dayjs from 'dayjs'
import Toast from '../../../components/Toast'
import { toast } from 'react-toastify'
import confirmSatus from '../../../components/comfirmSwal'
import { useTheme } from '@emotion/react'
import './AdCustomerPage.css'
import { TbEyeEdit } from 'react-icons/tb'
import SearchIcon from '@mui/icons-material/Search'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import useDebounce from '../../../services/hook/useDebounce'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'

export default function AdCustomerPage() {
  const theme = useTheme()
  const [listKhachHang, setListKhachHang] = useState([])
  const [listKhachHangEx, setListKhachHangEx] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [searchKhachHang, setSearchKhachHang] = useState({
    nameSearch: '',
    gender: '',
    statusSearch: '',
    size: 5,
    page: 1,
  })

  useEffect(() => {
    fetchData(searchKhachHang)
    getAllKhachHang()
  }, [searchKhachHang])

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setSearchKhachHang({ ...searchKhachHang, nameSearch: inputValue })
  }, [debouncedValue])

  const fetchData = (searchKhachHang) => {
    khachHangApi.get(searchKhachHang).then((response) => {
      setListKhachHang(response.data.data.content)
      setTotalPages(response.data.data.totalPages)
      if (searchKhachHang.page > response.data.data.totalPages)
        if (response.data.data.totalPages > 0) {
          setSearchKhachHang({ ...searchKhachHang, page: response.data.data.totalPages })
        }
    })
  }

  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  const getAllKhachHang = () => {
    khachHangApi.getAll().then((response) => {
      setListKhachHangEx(response.data)
    })
  }

  const deleteKhachHang = (id) => {
    const title = 'Xác nhận thay đổi trạng thái hoạt động?'
    const text = ''
    confirmSatus(title, text, theme).then((result) => {
      if (result.isConfirmed) {
        khachHangApi.delete(id).then(() => {
          toast.success('Thay đổi trạng thái hoạt động thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
          fetchData(searchKhachHang)
        })
      }
    })
  }

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('KhachHangData')

    const columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Code', key: 'code', width: 10 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Status', key: 'status', width: 15 },
    ]

    worksheet.columns = columns

    listKhachHangEx.forEach((row, index) => {
      worksheet.addRow({
        stt: row.stt,
        code: row.code,
        email: row.email,
        fullName: row.fullName,
        dateOfBirth: dayjs(row.dateBirth).format('MM/DD/YYYY'),
        phoneNumber: row.phoneNumber,
        gender: row.gender ? 'Nam' : 'Nữ',
        status: row.status === 0 ? 'Hoạt động' : 'Không hoạt động',
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
      link.download = 'khachhang_data.xlsx'
      link.click()
    })
  }

  const listBreadcrumbs = [{ name: 'Khách hàng', link: '/admin/customer' }]
  return (
    <div className="khachhang">
      <BreadcrumbsCustom listLink={listBreadcrumbs} />
      <Box>
        <Toast />
        <Paper elevation={3} sx={{ mb: 2, padding: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <TextField
              onChange={(e) => {
                const valueNhap = e.target.value
                if (validateSearchInput(valueNhap)) {
                  setInputValue(valueNhap)
                } else {
                  setInputValue('')
                  toast.warning('Tìm kiếm không được có kí tự đặc biệt')
                }
              }}
              sx={{ width: '40%' }}
              className="search-field"
              size="small"
              color="cam"
              placeholder="Tìm kiếm tên hoặc sđt hoặc email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="cam" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              style={{ float: 'right' }}
              color="cam"
              className="them-moi"
              component={Link}
              to="/admin/customer/add">
              <AiOutlinePlusSquare style={{ marginRight: '5px', fontSize: '17px' }} />
              <Typography sx={{ ml: 1 }}>Tạo khách hàng</Typography>
            </Button>
          </Stack>
          <Stack my={2} direction="row" justifyContent="start" alignItems="center" spacing={1}>
            <div className="filter">
              <b>Giới tính: </b>
              <Select
                displayEmpty
                size="small"
                value={searchKhachHang.gender}
                onChange={(e) =>
                  setSearchKhachHang({ ...searchKhachHang, gender: e.target.value })
                }>
                <MenuItem value={''}>Tất cả</MenuItem>
                <MenuItem value={'true'}>Nam</MenuItem>
                <MenuItem value={'false'}>Nữ</MenuItem>
              </Select>
            </div>

            <div className="filter">
              <b>Trạng thái: </b>
              <Select
                displayEmpty
                size="small"
                value={searchKhachHang.statusSearch}
                onChange={(e) =>
                  setSearchKhachHang({ ...searchKhachHang, statusSearch: e.target.value })
                }>
                <MenuItem value={''}>Tất cả</MenuItem>
                <MenuItem value={'0'}>Hoạt động</MenuItem>
                <MenuItem value={'1'}>Không hoạt động</MenuItem>
                <MenuItem></MenuItem>
              </Select>
            </div>
            <Button
              variant="outlined"
              color="cam"
              startIcon={<AiOutlinePlusSquare />}
              onClick={exportToExcel}>
              Xuất Excel
            </Button>
          </Stack>

          <Table className="tableCss mt-5">
            <TableHead>
              <TableRow>
                <TableCell align="center" width={'4%'}>
                  <span className="head-table">STT</span>
                </TableCell>
                <TableCell align="center" width={'5%'}>
                  <span className="head-table">Code</span>
                </TableCell>
                <TableCell align="center" width={'15%'}>
                  <span className="head-table">Email</span>
                </TableCell>
                <TableCell align="center" width={'18%'}>
                  <span className="head-table">Họ tên</span>
                </TableCell>
                <TableCell align="center" width={'11%'}>
                  <span className="head-table">Ngày sinh</span>
                </TableCell>
                <TableCell align="center" width={'11%'}>
                  <span className="head-table">Số điện thoại</span>
                </TableCell>
                <TableCell align="center" width={'10%'}>
                  <span className="head-table">Giới tính</span>
                </TableCell>
                <TableCell align="center" width={'15%'}>
                  <span className="head-table">Trạng thái</span>
                </TableCell>
                <TableCell align="center" width={'11%'}>
                  <span className="head-table">Thao tác</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listKhachHang.map((row) => {
                return (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center">{row.stt}</TableCell>
                    <TableCell align="center">{row.code}</TableCell>
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
                          onClick={() => deleteKhachHang(row.id)}
                          className="chip-hoat-dong"
                          size="small"
                          label="Hoạt động"
                        />
                      ) : (
                        <Chip
                          onClick={() => deleteKhachHang(row.id)}
                          className="chip-khong-hoat-dong"
                          size="small"
                          label="Không hoạt động"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="cam"
                          component={Link}
                          to={`/admin/customer/getOne/${row.id}`}
                          sx={{ fontSize: 20 }}>
                          <TbEyeEdit fontSize={'25px'} color="#FC7C27" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
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
        </Paper>
      </Box>
    </div>
  )
}
