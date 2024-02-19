import {
  Box,
  Button,
  Checkbox,
  Grid,
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
  Typography,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import khuyenMaiApi from '../../../api/admin/khuyenmai/khuyenMaiApi'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import confirmSatus from '../../../components/comfirmSwal'
import { toast } from 'react-toastify'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import bradApi from '../../../api/admin/sanpham/bradApi'
import materialApi from '../../../api/admin/sanpham/materialApi'
import colorApi from '../../../api/admin/sanpham/colorApi'
import soleApi from '../../../api/admin/sanpham/soleApi'
import categoryApi from '../../../api/admin/sanpham/categoryApi'
import sizeApi from '../../../api/admin/sanpham/sizeApi'
import useDebounce from '../../../services/hook/useDebounce'
const listBreadcrumbs = [{ name: 'Đợt giảm giá', link: '/admin/promotion' }]

export default function AdPromotionDetail() {
  const theme = useTheme()
  const [getProduct, setGetProduct] = useState([])
  const [selectAllProduct, setSelectAllProduct] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedRowsProduct, setSelectedRowsProduct] = useState([])
  const [filter, setFilter] = useState({ page: 1, size: 5, nameProduct: '' })

  const [selectAll, setSelectAll] = useState(false)
  const [getProductDetailByProduct, setGetProductDetailByProduct] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [totalPagesDetailByProduct, setTotalPagesDetailByProduct] = useState(0)
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [errorName, setErrorName] = useState('')
  const [errorValue, setErrorValue] = useState('')
  const [errorTimeStart, settimeStart] = useState('')
  const [errorTimeEnd, setTimeend] = useState('')
  // -------------------------- filters --------------------------------
  const [listBrand, setListBrand] = useState([])
  const [listMaterial, setListMaterial] = useState([])
  const [listColor, setListColor] = useState([])
  const [listSole, setListSole] = useState([])
  const [listCategory, setListCategory] = useState([])
  const [listSize, setListSize] = useState([])

  const [filterProductDetail, setFilterProductDetail] = useState({
    page: 1,
    size: 5,
    brand: null,
    material: null,
    color: null,
    sole: null,
    category: null,
    nameProduct: null,
  })

  useEffect(() => {
    bradApi.findAll().then((response) => {
      setListBrand(response.data.data)
    })
    materialApi.findAll().then((response) => {
      setListMaterial(response.data.data)
    })
    colorApi.findAll().then((response) => {
      setListColor(response.data.data)
    })
    soleApi.findAll().then((response) => {
      setListSole(response.data.data)
    })
    categoryApi.findAll().then((response) => {
      setListCategory(response.data.data)
    })
    sizeApi.findAll().then((response) => {
      setListSize(response.data.data)
    })
  }, [])

  let navigate = useNavigate()
  const { id } = useParams()
  const [updatePromotion, setUpdatePromotion] = useState({
    name: '',
    value: '',
    type: '',
    // status: 0,
    timeStart: '',
    timeEnd: '',
    idProductDetail: selectedRows,
  })
  const handleSelectAllChange = (event) => {
    const selectedIds = event.target.checked
      ? getProductDetailByProduct.map((row) => row.productDetail)
      : []
    setSelectedRows(selectedIds)
    setSelectAll(event.target.checked)
  }

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
    setSelectAll(newSelected.length === getProductDetailByProduct.length)
  }

  const handleSelectAllChangeProduct = (event) => {
    const selectedIds = event.target.checked ? getProduct.map((row) => row.id) : []
    setSelectedRowsProduct(selectedIds)
    setSelectAllProduct(event.target.checked)
    getProductDetailById(filterProductDetail, selectedIds)
  }

  const handleRowCheckboxChange1 = (event, ProductId) => {
    const selectedIndex = selectedRowsProduct.indexOf(ProductId)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = [...selectedRowsProduct, ProductId]
    } else {
      newSelected = [
        ...selectedRowsProduct.slice(0, selectedIndex),
        ...selectedRowsProduct.slice(selectedIndex + 1),
      ]
    }

    setSelectedRowsProduct(newSelected)
    setSelectAllProduct(newSelected.length === getProduct.length)

    const selectedProductIds = getProduct
      .filter((row) => newSelected.includes(row.id))
      .map((selectedProduct) => selectedProduct.id)
    setSelectedProductIds(selectedProductIds)
  }

  const getProductDetailById = (filterProductDetail, selectedProductIds) => {
    if (selectedProductIds.length > 0) {
      khuyenMaiApi
        .getAllProductDetailByProduct(filterProductDetail, selectedProductIds)
        .then((response) => {
          setGetProductDetailByProduct(response.data.data.data)
          setTotalPagesDetailByProduct(response.data.data.totalPages)
          if (filterProductDetail.page > response.data.data.totalPages)
            if (response.data.data.totalPages > 0) {
              setFilterProductDetail({
                ...filterProductDetail,
                page: response.data.data.totalPages,
              })
            }
        })
    } else {
      setGetProductDetailByProduct([])
      setTotalPagesDetailByProduct(0)
    }
  }

  useEffect(() => {
    getProductDetailById(filterProductDetail, selectedProductIds)
  }, [filterProductDetail, selectedProductIds])

  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, nameProduct: inputValue })
  }, [debouncedValue])

  const [inputValue1, setInputValue1] = useState('')
  const debouncedValue1 = useDebounce(inputValue1, 1000)

  useEffect(() => {
    setFilterProductDetail({
      ...filterProductDetail,
      nameProduct: inputValue1,
    })
  }, [debouncedValue1])

  const validate = () => {
    const timeStart = dayjs(updatePromotion.timeStart, 'DD/MM/YYYY')
    const timeEnd = dayjs(updatePromotion.timeEnd, 'DD/MM/YYYY')

    const currentDate = dayjs()
    let check = 0
    const errors = {
      name: '',
      value: '',
      timeStart: '',
      timeEnd: '',
    }
    const minBirthYear = 1900

    if (updatePromotion.name.trim() === '') {
      errors.name = 'Vui lòng nhập tên đợt giảm giá'
    } else if (!isNaN(updatePromotion.name)) {
      errors.name = 'Tên đợt giảm giá phải là chữ'
    } else if (updatePromotion.name.length > 50) {
      errors.name = 'Tên không được dài hơn 50 ký tự'
    } else if (updatePromotion.name.length < 5) {
      errors.name = 'Tên không được bé hơn 5 ký tự'
    } else if (updatePromotion.name !== updatePromotion.name.trim()) {
      errors.name = 'Tên không được chứa khoảng trắng thừa'
    }

    if (updatePromotion.value === '') {
      errors.value = 'Vui lòng nhập giá trị'
    } else if (!Number.isInteger(Number(updatePromotion.value))) {
      errors.value = 'Giá trị phải là số nguyên'
    } else if (Number(updatePromotion.value) < 0 || Number(updatePromotion.value) > 100) {
      errors.value = 'Giá trị phải lớn hơn 0% và nhở hơn 100%'
    }

    if (updatePromotion.timeStart === '') {
      errors.timeStart = 'Vui lòng nhập thời gian bắt đầu'
    }
    if (updatePromotion.timeEnd === '') {
      errors.timeEnd = 'Vui lòng nhập thời gian kết thúc'
    } else if (timeEnd.isBefore(currentDate)) {
      errors.timeEnd = 'Ngày kết thúc phải lớn hơn ngày hiện tại'
    } else if (
      dayjs(updatePromotion.timeEnd, 'DD-MM-YYYY HH:mm:ss').isBefore(`${minBirthYear}-01-01`) ||
      !dayjs(updatePromotion.timeEnd, 'DD-MM-YYYY HH:mm:ss').isValid()
    ) {
      errors.timeEnd = 'Ngày kết thúc không hợp lệ'
    }

    if (!timeStart.isValid() || !timeEnd.isValid() || timeStart.isAfter(timeEnd)) {
      errors.timeStart = 'Ngày bắt đầu phải bé hơn ngày kêt thúc'
    } else if (
      dayjs(updatePromotion.timeStart, 'DD-MM-YYYY HH:mm:ss').isBefore(`${minBirthYear}-01-01`) ||
      !dayjs(updatePromotion.timeStart, 'DD-MM-YYYY HH:mm:ss').isValid()
    ) {
      errors.timeStart = 'Ngày bắt đầu không hợp lệ'
    }

    for (const key in errors) {
      if (errors[key]) {
        check++
      }
    }

    setErrorName(errors.name)
    setErrorValue(errors.value)
    settimeStart(errors.timeStart)
    setTimeend(errors.timeEnd)

    return check
  }
  const onSubmit = (e, id) => {
    const check = validate()
    if (check < 1) {
      const title = 'bạn có muốn update không?'
      const text = ''
      confirmSatus(title, text, theme).then((result) => {
        if (result.isConfirmed) {
          khuyenMaiApi.UpdayePromotion(e, id).then(() => {
            toast.success('update thành công', { position: toast.POSITION.TOP_RIGHT })
            navigate('/admin/promotion')
          })
        }
      })
    } else {
      toast.error('Sửa khuyện mại không thành công', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const detail = (id) => {
    khuyenMaiApi.getById(id).then((response) => {
      const formattedStartDate = dayjs(response.data.data.timeStart).format('DD-MM-YYYY HH:mm:ss')
      const formattedEndDate = dayjs(response.data.data.timeEnd).format('DD-MM-YYYY HH:mm:ss')
      const convertStatus = parseInt(response.data.data.status, 10)

      setUpdatePromotion({
        ...response.data.data,
        timeStart: formattedStartDate,
        timeEnd: formattedEndDate,
        status: convertStatus,
      })
    })
  }
  const getLisProduct = (id) => {
    khuyenMaiApi
      .getProductAndProductDetailById(id)
      .then((response) => {
        setSelectedRowsProduct(response.data.data)
        getProductDetailById(filterProductDetail, response.data.data)
      })
      .catch((error) => {})
  }

  const getLisProductDetail = (id) => {
    khuyenMaiApi
      .getProductDetailById(id)
      .then((response) => {
        setSelectedRows(response.data.data)
      })
      .catch((error) => {})
  }

  useEffect(() => {
    detail(id)
  }, [id])

  useEffect(() => {
    getLisProduct(id)
  }, [id, filterProductDetail])

  useEffect(() => {
    getLisProductDetail(id)
  }, [id])

  useEffect(() => {
    setUpdatePromotion({ ...updatePromotion, idProductDetail: selectedRows })
  }, [updatePromotion, selectedRows])

  const getAllProduct = (filter) => {
    khuyenMaiApi.getAllProduct(filter).then((response) => {
      setGetProduct(response.data.data.data)
      setTotalPages(response.data.data.totalPages)
    })
  }
  useEffect(() => {
    getAllProduct(filter)
  }, [filter])

  const handleTodayClick = () => {
    const currentDateTime = new Date()
    setUpdatePromotion({
      ...updatePromotion,
      timeStart: dayjs(currentDateTime).format('DD-MM-YYYY HH:mm:ss'),
    })
    settimeStart('')
  }
  return (
    <>
      <div className="promotionUpdate">
        <BreadcrumbsCustom nameHere={'Chi tiết đợt giảm giá'} listLink={listBreadcrumbs} />
        <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2, width: '100%', pb: 7 }}>
          <Grid container spacing={2} sx={{ pl: 2 }}>
            <Grid item xs={5.5} sx={{ mt: 4 }}>
              <div style={{ marginBottom: '20px' }}>
                <Typography>
                  <span style={{ color: 'red', fontWeight: 'bold' }}> *</span>Tên đợt giảm giá
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  className="text-field-css"
                  size="small"
                  sx={{ width: '100%' }}
                  name="name"
                  value={updatePromotion?.name}
                  onChange={(e) => {
                    setUpdatePromotion({ ...updatePromotion, name: e.target.value })
                    setErrorName('')
                  }}
                  error={Boolean(errorName)}
                  helperText={errorName}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <Typography>
                  <span style={{ color: 'red', fontWeight: 'bold' }}> *</span>Giá trị
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  className="text-field-css"
                  size="small"
                  type="number"
                  sx={{ width: '100%' }}
                  name="value"
                  value={updatePromotion?.value}
                  onChange={(e) => {
                    setUpdatePromotion({ ...updatePromotion, value: e.target.value })
                    setErrorValue('')
                  }}
                  error={Boolean(errorValue)}
                  helperText={errorValue}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <Typography>
                  <span style={{ color: 'red', fontWeight: 'bold' }}> *</span>Từ ngày
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                      size="small"
                      format={'DD-MM-YYYY HH:mm:ss'}
                      sx={{ width: '100%' }}
                      name="timeStart"
                      ampm={false}
                      minDateTime={dayjs()}
                      className="dateTimePro "
                      value={dayjs(updatePromotion?.timeStart, 'DD-MM-YYYY HH:mm:ss')}
                      onChange={(e) => {
                        setUpdatePromotion({
                          ...updatePromotion,
                          timeStart: dayjs(e).format('DD-MM-YYYY HH:mm:ss'),
                        })
                        settimeStart('')
                      }}
                      slotProps={{
                        actionBar: {
                          actions: ['clear', 'today'],
                          onClick: (action) => {
                            if (action === 'clear') {
                              setUpdatePromotion({ ...updatePromotion, timeStart: '' })
                            } else if (action === 'today') {
                              handleTodayClick()
                            }
                          },
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <span className="error">{errorTimeStart}</span>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <Typography>
                  <span style={{ color: 'red', fontWeight: 'bold' }}> *</span>Đến ngày
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                      format={'DD-MM-YYYY HH:mm:ss'}
                      size="small"
                      sx={{ width: '100%' }}
                      name="timeEnd"
                      ampm={false}
                      minDateTime={dayjs()}
                      className="dateTimePro "
                      value={dayjs(updatePromotion?.timeEnd, 'DD-MM-YYYY HH:mm:ss')}
                      onChange={(e) => {
                        setUpdatePromotion({
                          ...updatePromotion,
                          timeEnd: dayjs(e).format('DD-MM-YYYY HH:mm:ss'),
                        })
                        setTimeend('')
                      }}
                      slotProps={{
                        actionBar: {
                          actions: ['clear', 'today'],
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <span className="error">{errorTimeEnd}</span>
                {selectedRowsProduct.length > 0 ? (
                  ''
                ) : (
                  <Button
                    variant="outlined"
                    color="cam"
                    sx={{ marginTop: '30px' }}
                    onClick={() => onSubmit(updatePromotion, id)}>
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </Grid>

            <Grid item xs={6.5}>
              <div style={{ height: 400, width: '100%' }}>
                <div style={{ float: 'right' }}>
                  <TextField
                    id="outlined-basic"
                    className="text-field-css"
                    label="Tìm tên sản phẩm"
                    variant="outlined"
                    size="small"
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
                  />
                </div>
                <Table sx={{ minWidth: '100%' }} aria-label="simple table" className="tableCss">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '8%' }}>
                        <Checkbox
                          checked={selectAllProduct}
                          onChange={handleSelectAllChangeProduct}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ width: '8%' }}>
                        STT
                      </TableCell>

                      <TableCell align="center" sx={{ width: '30%' }}>
                        Tên sản phẩm
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getProduct.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Checkbox
                            key={row.id}
                            checked={selectedRowsProduct.indexOf(row.id) !== -1}
                            onChange={(event) => handleRowCheckboxChange1(event, row.id)}
                          />
                        </TableCell>
                        <TableCell align="center" scope="row">
                          {index + 1}
                        </TableCell>

                        <TableCell align="center">{row.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px',
                    marginBottom: '30px',
                  }}>
                  <Pagination
                    page={filter.page}
                    color="cam"
                    onChange={(e, value) => {
                      e.preventDefault()
                      setFilter({
                        ...filter,
                        page: value,
                      })
                    }}
                    count={totalPages}
                    variant="outlined"
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>
        {selectedRowsProduct.length > 0 && (
          <Paper elevation={3} sx={{ mt: 2, mb: 2, padding: 2, width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              {' '}
              <Typography
                sx={{
                  fontSize: '25px',
                  fontWeight: 600,
                  marginBottom: '10px',
                  marginTop: '10px',
                }}>
                CHI TIẾT SẢN PHẨM
              </Typography>
              <Button
                variant="outlined"
                color="cam"
                sx={{ marginTop: '30px' }}
                onClick={() => onSubmit(updatePromotion, id)}>
                Chỉnh sửa
              </Button>
            </Stack>

            <Grid item xs={12}>
              <div style={{ height: '100%', width: '100%' }}>
                <Box>
                  <TextField
                    sx={{
                      width: '50%',
                      '.MuiInputBase-input': { py: '7.5px' },
                    }}
                    size="small"
                    variant="outlined"
                    placeholder="Tên sản phẩm, thể loại, thương hiệu, chất liệu, màu sắc"
                    className="text-field-css"
                    // onChange={(e) => {
                    //   setInputValue1(e.target.value)
                    // }}
                    onChange={(e) => {
                      const valueNhap = e.target.value
                      if (validateSearchInput(valueNhap)) {
                        setInputValue1(valueNhap)
                      } else {
                        setInputValue1('')
                        toast.warning('Tìm kiếm không được có kí tự đặc biệt')
                      }
                    }}
                  />
                </Box>
                <Box>
                  <b>Danh mục:</b>
                  <Select
                    displayEmpty
                    sx={{
                      '.MuiSelect-select': {
                        pl: 1,
                        color: 'orange',
                        fontWeight: 'bold',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none!important',
                      },
                    }}
                    value={filterProductDetail.category}
                    onChange={(e) => {
                      setFilterProductDetail({ ...filterProductDetail, category: e.target.value })
                    }}>
                    <MenuItem value={null}>Tất cả</MenuItem>
                    {listCategory?.map((item) => (
                      <MenuItem value={item?.id} key={item?.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <b>Màu sắc:</b>
                  <Select
                    displayEmpty
                    sx={{
                      '.MuiSelect-select': {
                        pl: 1,
                        color: 'orange',
                        fontWeight: 'bold',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none!important',
                      },
                    }}
                    value={filterProductDetail.color}
                    onChange={(e) => {
                      setFilterProductDetail({ ...filterProductDetail, color: e.target.value })
                    }}>
                    <MenuItem value={null}>Tất cả</MenuItem>
                    {listColor?.map((item) => (
                      <MenuItem value={item?.id} key={item?.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <b>Chất liệu:</b>
                  <Select
                    displayEmpty
                    sx={{
                      '.MuiSelect-select': {
                        pl: 1,
                        color: 'orange',
                        fontWeight: 'bold',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none!important',
                      },
                    }}
                    value={filterProductDetail.material}
                    onChange={(e) => {
                      setFilterProductDetail({ ...filterProductDetail, material: e.target.value })
                    }}>
                    <MenuItem value={null}>Tất cả</MenuItem>
                    {listMaterial?.map((item) => (
                      <MenuItem value={item?.id} key={item?.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <b>Kích cỡ:</b>
                  <Select
                    displayEmpty
                    sx={{
                      '.MuiSelect-select': {
                        pl: 1,
                        color: 'orange',
                        fontWeight: 'bold',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none!important',
                      },
                    }}
                    value={filterProductDetail.size}
                    onChange={(e) => {
                      setFilterProductDetail({ ...filterProductDetail, size: e.target.value })
                    }}>
                    <MenuItem value={null}>Tất cả</MenuItem>
                    {listSize?.map((item) => (
                      <MenuItem value={item?.id} key={item?.id}>
                        {item.size}
                      </MenuItem>
                    ))}
                  </Select>

                  <b>Đế giày:</b>
                  <Select
                    displayEmpty
                    sx={{
                      '.MuiSelect-select': {
                        pl: 1,
                        color: 'orange',
                        fontWeight: 'bold',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none!important',
                      },
                    }}
                    value={filterProductDetail.sole}
                    onChange={(e) => {
                      setFilterProductDetail({ ...filterProductDetail, sole: e.target.value })
                    }}>
                    <MenuItem value={null}>Tất cả</MenuItem>
                    {listSole?.map((item) => (
                      <MenuItem value={item?.id} key={item?.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <b>Thương hiệu:</b>
                  <Select
                    displayEmpty
                    sx={{
                      '.MuiSelect-select': {
                        pl: 1,
                        color: 'orange',
                        fontWeight: 'bold',
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none!important',
                      },
                    }}
                    value={filterProductDetail.brand}
                    onChange={(e) => {
                      setFilterProductDetail({ ...filterProductDetail, brand: e.target.value })
                    }}>
                    <MenuItem value={null}>Tất cả</MenuItem>
                    {listBrand?.map((item) => (
                      <MenuItem value={item?.id} key={item?.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" className="tableCss">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '8%' }}>
                        <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                      </TableCell>
                      <TableCell align="center" sx={{ width: '8%' }}>
                        STT
                      </TableCell>

                      <TableCell align="center" sx={{ width: '30%' }}>
                        Tên sản phẩm
                      </TableCell>
                      <TableCell align="center" sx={{ width: '30%' }}>
                        Thể loại
                      </TableCell>
                      <TableCell align="center" sx={{ width: '30%' }}>
                        Thương hiệu
                      </TableCell>
                      <TableCell align="center" sx={{ width: '30%' }}>
                        Chất liệu
                      </TableCell>
                      <TableCell align="center" sx={{ width: '30%' }}>
                        Màu sắc
                      </TableCell>
                      <TableCell align="center" sx={{ width: '30%' }}>
                        Đế giày
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getProductDetailByProduct.map((row, index) => (
                      <TableRow
                        key={row.productDetail}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Checkbox
                            key={row.productDetailCB}
                            checked={
                              selectAll
                                ? selectedRows.indexOf(row.productDetail) !== -1
                                : selectedRows.indexOf(row.productDetailCB) !== -1
                            }
                            onChange={(event) =>
                              handleRowCheckboxChange(event, row.productDetailCB)
                            }
                          />
                        </TableCell>
                        <TableCell align="center" scope="row">
                          {index + 1}
                        </TableCell>

                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.category}</TableCell>
                        <TableCell align="center">{row.brand}</TableCell>
                        <TableCell align="center">{row.material}</TableCell>
                        <TableCell align="center">{row.color}</TableCell>
                        <TableCell align="center">{row.sole}</TableCell>
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
                    <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>
                      Xem
                    </Typography>
                    <Select
                      color="cam"
                      onChange={(e) => {
                        setFilterProductDetail({ ...filterProductDetail, size: e.target.value })
                      }}
                      sx={{ height: '25px', mx: 0.5 }}
                      size="small"
                      value={filterProductDetail.size}>
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
                    page={filterProductDetail.page}
                    color="cam"
                    onChange={(e, value) => {
                      e.preventDefault()
                      setFilterProductDetail({
                        ...filterProductDetail,
                        page: value,
                      })
                    }}
                    count={totalPagesDetailByProduct}
                    variant="outlined"
                  />
                </Stack>
              </div>
            </Grid>
          </Paper>
        )}
      </div>
    </>
  )
}
