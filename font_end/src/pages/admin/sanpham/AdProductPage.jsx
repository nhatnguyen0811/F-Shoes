import React, { Fragment, useEffect, useState } from 'react'
import './index.css'
import {
  Button,
  Chip,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableHead,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { TbEyeEdit } from 'react-icons/tb'
import sanPhamApi from '../../../api/admin/sanpham/sanPhamApi'
import { Link } from 'react-router-dom'
import Empty from '../../../components/Empty'
import dayjs from 'dayjs'
import confirmSatus from '../../../components/comfirmSwal'
import { toast } from 'react-toastify'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import ExcelJS from 'exceljs'
import useDebounce from '../../../services/hook/useDebounce'

export default function AdProductPage() {
  const [listProduct, setListProduct] = useState([])
  const [listProductEx, setListProductEx] = useState([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState({
    status: '',
    name: '',
    size: 5,
    page: 1,
  })

  useEffect(() => {
    fetchData(filter)
    getAllSanPham()
  }, [filter])

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, name: inputValue })
  }, [debouncedValue])

  function fetchData(filter) {
    sanPhamApi.get(filter).then((response) => {
      setListProduct(response.data.data.data)
      setTotal(response.data.data.totalPages)
      if (filter.page > response.data.data.totalPages)
        if (response.data.data.totalPages > 0) {
          setFilter({ ...filter, page: response.data.data.totalPages })
        }
    })
  }

  const getAllSanPham = () => {
    sanPhamApi.getList().then((response) => {
      setListProductEx(response.data.data)
    })
  }

  const handleDelete = (id) => {
    const title = 'Bạn có muốn chuyển trạng thái không'
    const text = ''
    confirmSatus(title, text).then((result) => {
      if (result.isConfirmed) {
        sanPhamApi.deleteProduct(id).then(() => {
          fetchData(filter)
          toast.success('Chuyển trạng thái thành công', {
            position: toast.POSITION.TOP_RIGHT,
          })
        })
      }
    })
  }

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('ProductData')

    const columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Tên sản phẩm', key: 'name', width: 30 },
      { header: 'Ngày thêm', key: 'createdAt', width: 15 },
      { header: 'Số lượng', key: 'amount', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 10 },
    ]

    worksheet.columns = columns

    listProductEx.forEach((product, index) => {
      worksheet.addRow({
        stt: product.stt,
        name: product.name,
        createdAt: dayjs(product.createdAt).format('DD/MM/YYYY'),
        amount: product.amount,
        status: product.status === 0 ? 'Đang bán' : 'Ngừng bán',
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
      link.download = 'product_data.xlsx'
      link.click()
    })
  }

  const listBreadcrumbs = [{ name: 'Sản phẩm', link: '/admin/product' }]
  return (
    <div className="san-pham">
      <BreadcrumbsCustom listLink={listBreadcrumbs} />
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <TextField
            onChange={(e) => {
              setInputValue(e.target.value)
            }}
            sx={{ width: '50%' }}
            className="search-field"
            size="small"
            color="cam"
            placeholder="Nhập tên sản phẩm để tìm..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="cam" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            component={Link}
            to="/admin/product/add"
            color="cam"
            variant="outlined"
            className="them-moi">
            <AiOutlinePlusSquare style={{ marginRight: '5px', fontSize: '17px' }} />
            Thêm mới
          </Button>
        </Stack>
        <Stack my={2} direction="row" justifyContent="start" alignItems="center" spacing={1}>
          <div className="filter">
            <b>Trạng thái:</b>
          </div>
          <RadioGroup
            row
            aria-label="status"
            name="status"
            value={filter.status}
            onChange={(e) => {
              setFilter({ ...filter, status: e.target.value })
            }}>
            <FormControlLabel
              value={''}
              control={<Radio color="cam" size="small" />}
              label="Tất cả"
            />
            <FormControlLabel
              value={0}
              control={<Radio color="cam" size="small" />}
              label="Đang bán"
            />
            <FormControlLabel
              value={1}
              control={<Radio color="cam" size="small" />}
              label="Ngừng bán"
            />
          </RadioGroup>
          <Button
            onClick={exportToExcel}
            disableElevation
            color="cam"
            variant="outlined"
            style={{ marginLeft: '10px' }}>
            Export Excel
          </Button>
        </Stack>
        {listProduct.length > 0 ? (
          <Fragment>
            <Table className="tableCss">
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={'7%'}>
                    STT
                  </TableCell>
                  <TableCell width={'30%'}>Tên sản phẩm</TableCell>
                  <TableCell width={'15%'}>Ngày thêm</TableCell>
                  <TableCell align="center" width={'15%'}>
                    Số lượng
                  </TableCell>
                  <TableCell width={'10%'} align="center">
                    Trạng thái
                  </TableCell>
                  <TableCell width={'10%'} align="center">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listProduct.map((product) => {
                  return (
                    <TableRow key={product.id}>
                      <TableCell align="center">{product.stt}</TableCell>
                      <TableCell sx={{ maxWidth: '0px' }}>{product.name}</TableCell>
                      <TableCell>{dayjs(product.createdAt).format('DD-MM-YYYY')}</TableCell>
                      <TableCell align="center">{product.amount}</TableCell>
                      <TableCell align="center">
                        <Chip
                          onClick={() => handleDelete(product.id)}
                          className={
                            product.status === 0 ? 'chip-hoat-dong' : 'chip-khong-hoat-dong'
                          }
                          label={product.status === 0 ? 'Đang bán' : 'Ngừng bán'}
                          size="small"
                        />
                      </TableCell>
                      <Tooltip title="Xem chi tiết">
                        <TableCell align="center">
                          <IconButton
                            color="cam"
                            component={Link}
                            to={`/admin/product/${product.id}`}>
                            <TbEyeEdit fontSize={'25px'} />
                          </IconButton>
                        </TableCell>
                      </Tooltip>
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
                    setFilter({ ...filter, size: e.target.value })
                  }}
                  sx={{ height: '25px', mx: 0.5 }}
                  size="small"
                  value={filter.size}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
                <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>
                  sản phẩm
                </Typography>
              </Typography>
              <Pagination
                variant="outlined"
                color="cam"
                count={total}
                page={filter.page}
                onChange={(e, value) => {
                  e.preventDefault()
                  setFilter({ ...filter, page: value })
                }}
              />
            </Stack>
          </Fragment>
        ) : (
          <Empty />
        )}
      </Paper>
    </div>
  )
}
