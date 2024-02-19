import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
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
import React, { useEffect, useState } from 'react'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { spButton } from './theloaiStyle'
import dayjs from 'dayjs'
import SearchIcon from '@mui/icons-material/Search'
import { toast } from 'react-toastify'
import { useTheme } from '@emotion/react'
import confirmSatus from '../../../components/comfirmSwal'
import { TbEyeEdit } from 'react-icons/tb'
import DialogAddUpdate from '../../../components/DialogAddUpdate'
import categoryApi from '../../../api/admin/sanpham/categoryApi'
import * as ExcelJS from 'exceljs'

import useDebounce from '../../../services/hook/useDebounce'

const listBreadcrumb = [{ name: 'Quản lý thể loại' }]
export default function AdCategoryPage() {
  const theme = useTheme()
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [category, setCategory] = useState({ name: '' })
  const [errorCategory, setErrorCategory] = useState('')
  const [errorCategoryUpdate, setErrorCategoryUpdate] = useState('')
  const [categoryUpdate, setCategoryUpdate] = useState({ id: 0, name: '' })
  const [allNameCategory, setAllNameCategory] = useState([])
  const [listCategory, setListCategory] = useState([])
  const [listCategoryEx, setListCategoryEx] = useState([])
  const [isBackdrop, setIsBackdrop] = useState(true)
  const [filter, setFilter] = useState({ page: 1, size: 5, name: '' })
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchData(filter)
    getAllCategory()
    haldleAllNameCategory()
  }, [filter])
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, name: inputValue })
  }, [debouncedValue])

  const fetchData = (filter) => {
    setIsBackdrop(true)
    categoryApi
      .getCategory(filter)
      .then((response) => {
        const res = response.data
        setListCategory(res.data.content)
        setTotalPages(res.data.totalPages)
        if (filter.page > res.data.totalPages) {
          if (res.data.totalPages > 0) {
            setFilter({ ...filter, page: res.data.totalPages })
          }
        }
      })
      .catch((error) => {})
    setIsBackdrop(false)
  }

  const getAllCategory = () => {
    categoryApi.getList().then((res) => {
      setListCategoryEx(res.data.data)
    })
  }


  const haldleAllNameCategory = () => {
    categoryApi
      .getAllNameCategory()
      .then((response) => {
        setAllNameCategory(response.data.data)
      })
      .catch(() => {
        toast.warning('Vui lòng f5 tải lại dữ liệu', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const handleValidateAdd = () => {
    let check = 0
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
    const errors = {
      name: '',
    }
    if (category.name.trim() === '') {
      errors.name = 'Không được để trống tên thể loại'
    } else if (category.name.length > 100) {
      errors.name = 'Tên thể loại không được dài hơn 100 ký tự'
    } else if (allNameCategory.includes(category.name)) {
      errors.name = 'Tên thể loại đã tồn tại'
    } else if (specialCharsRegex.test(category.name)) {
      errors.name = 'Tên thể loại chứa kí tự đặc biệt.'
    }

    for (const key in errors) {
      if (errors[key]) {
        check++
      }
    }

    setErrorCategory(errors.name)

    return check
  }
  const isCategoryNameDuplicate = (categoryName, currentId) => {
    return listCategory.some(
      (category) => category.name === categoryName && category.id !== currentId,
    )
  }

  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  const handleValidateUpdate = () => {
    let check = 0
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
    const errors = {
      nameUpdate: '',
    }

    if (categoryUpdate.name.trim() === '') {
      errors.nameUpdate = 'Không được để trống tên thể loại'
    } else if (categoryUpdate.name.length > 100) {
      errors.nameUpdate = 'Tên thể loại không được dài hơn 100 ký tự'
    } else if (isCategoryNameDuplicate(categoryUpdate.name, categoryUpdate.id)) {
      errors.nameUpdate = 'Tên thể loại đã tồn tại'
    } else if (specialCharsRegex.test(categoryUpdate.name)) {
      errors.nameUpdate = 'Tên thể loại chứa kí tự đặc biệt.'
    }

    for (const key in errors) {
      if (errors[key]) {
        check++
      }
    }

    setErrorCategoryUpdate(errors.nameUpdate)

    return check
  }

  const addProduct = () => {
    const check = handleValidateAdd()
    if (check < 1) {
      setIsBackdrop(true)
      const title = 'Xác nhận Thêm mới thể loại?'
      const text = ''
      setOpenAdd(false)
      confirmSatus(title, text, theme).then((result) => {
        if (result.isConfirmed) {
          categoryApi.addCategory(category).then((res) => {
            if (res.data.success) {
              setIsBackdrop(false)
              setOpenAdd(false)
              setCategory({ name: '' })
              toast.success('Thêm thể loại thành công', {
                position: toast.POSITION.TOP_RIGHT,
              })
              fetchData(filter)
              haldleAllNameCategory()
            } else {
              setOpenAdd(true)
              toast.error('Thêm thể loại thất bại', {
                position: toast.POSITION.TOP_RIGHT,
              })
            }
          })
        } else {
          setOpenAdd(true)
        }
      })
      setIsBackdrop(false)
    }
  }
  const updateProduct = () => {
    const check = handleValidateUpdate()
    if (check < 1) {
      setIsBackdrop(true)
      const title = 'Xác nhận cập nhập thể loại?'
      const text = ''
      setOpenUpdate(false)
      confirmSatus(title, text, theme).then((result) => {
        if (result.isConfirmed) {
          categoryApi
            .updateCategory(categoryUpdate.id, { name: categoryUpdate.name })
            .then((res) => {
              if (res.data.success) {
                setIsBackdrop(false)
                setCategory({ name: '' })
                toast.success('Cập nhập thể loại thành công', {
                  position: toast.POSITION.TOP_RIGHT,
                })
                fetchData(filter)
                haldleAllNameCategory()
              } else {
                setOpenUpdate(true)
                toast.error('Cập nhập thể loại thất bại', {
                  position: toast.POSITION.TOP_RIGHT,
                })
              }
            })
        } else {
          setOpenUpdate(true)
        }
      })
      setIsBackdrop(false)
    }
  }

  const chageName = (e) => {
    if (openAdd) setCategory({ ...category, name: e.target.value })
    else setCategoryUpdate({ ...categoryUpdate, name: e.target.value })
  }

  // const setDeleted = (id) => {
  //   const title = 'Xác nhận thay đổi hoạt động?'
  //   const text = 'Ẩn hoạt động sẽ làm ẩn thể loại khỏi nơi khác'
  //   confirmSatus(title, text, theme).then((result) => {
  //     if (result.isConfirmed) {
  //       categoryApi.swapCategory(id).then((res) => {
  //         if (res.data.success) {
  //           setIsBackdrop(false)
  //           toast.success('Đã bật trạng thái hoạt động', {
  //             position: toast.POSITION.TOP_RIGHT,
  //           })
  //           fetchData(filter)
  //         }
  //       })
  //     }
  //   })
  // }

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('CategoryData')

    const columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Tên', key: 'name', width: 15 },
      { header: 'Ngày thêm', key: 'createAt', width: 17.5 },
      { header: 'Hoạt động', key: 'deleted', width: 20 },
    ]

    worksheet.columns = columns

    listCategoryEx.forEach((row, index) => {
      worksheet.addRow({
        stt: index + 1,
        name: row.name,
        createAt: dayjs(row.createAt).format('DD/MM/YYYY'),
        deleted: row.deleted === 0 ? 'Hoạt động' : 'Không hoạt động',
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
      link.download = 'category_data.xlsx'
      link.click()
    })
  }

  return listCategory ? (
    <div>
      <Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <BreadcrumbsCustom nameHere={'Thể loại'} listLink={listBreadcrumb} />
        <Container component={Paper} elevation={3} sx={{ py: 3, borderRadius: '10px' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <TextField
              className="search-field"
              size="small"
              color="cam"
              id="seachProduct"
              InputProps={{
                required: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="cam" />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 0.5, width: '50%' }}
              onChange={(e) => {
                const valueNhap = e.target.value
                if (validateSearchInput(valueNhap)) {
                  setInputValue(valueNhap)
                } else {
                  setInputValue('')
                  toast.warning('Tìm kiếm không được có kí tự đặc biệt')
                }
              }}
              inputProps={{ style: { height: '20px' } }}
              placeholder="Tìm thể loại"
            />
            <Button
              onClick={exportToExcel}
              disableElevation
              sx={{ ...spButton }}
              color="cam"
              variant="outlined"
              style={{ marginLeft: '10px' }}>
              Export Excel
            </Button>
            <Button
              onClick={() => {
                setOpenAdd(true)
                setErrorCategory('')
                setCategory({ ...category, name: '' })
              }}
              disableElevation
              sx={{ ...spButton }}
              color="cam"
              variant="outlined">
              <AiOutlinePlusSquare style={{ marginRight: '5px', fontSize: '17px' }} />
              <Typography sx={{ ml: 1 }}>Thêm mới</Typography>
            </Button>
            {openAdd && (
              <DialogAddUpdate
                open={openAdd}
                setOpen={setOpenAdd}
                title={'Thêm mới thể loại'}
                buttonSubmit={
                  <Button
                    onClick={() => {
                      openAdd ? addProduct() : updateProduct()
                    }}
                    color="cam"
                    disableElevation
                    sx={{ ...spButton }}
                    variant="contained">
                    Thêm
                  </Button>
                }>
                <TextField
                  id={'nameInputAdd'}
                  onChange={(e) => {
                    chageName(e)
                    setErrorCategory('')
                  }}
                  defaultValue={category.name}
                  fullWidth
                  inputProps={{
                    required: true,
                  }}
                  size="small"
                  placeholder="Nhập tên thể loại"
                  error={Boolean(errorCategory)}
                  helperText={errorCategory}
                />
              </DialogAddUpdate>
            )}
            {openUpdate && (
              <DialogAddUpdate
                open={openUpdate}
                setOpen={setOpenUpdate}
                title={'Chỉnh sửa thể loại'}
                buttonSubmit={
                  <Button
                    onClick={() => {
                      updateProduct()
                    }}
                    color="cam"
                    disableElevation
                    sx={{ ...spButton }}
                    variant="contained">
                    Lưu
                  </Button>
                }>
                <TextField
                  id={'nameInputUpdate'}
                  onChange={(e) => {
                    chageName(e)
                    setErrorCategoryUpdate('')
                  }}
                  defaultValue={categoryUpdate.name}
                  fullWidth
                  inputProps={{
                    required: true,
                  }}
                  size="small"
                  placeholder="Nhập tên thể loại"
                  error={Boolean(errorCategoryUpdate)}
                  helperText={errorCategoryUpdate}
                />
              </DialogAddUpdate>
            )}
          </Stack>
          {listCategory.length === 0 ? (
            <Typography component="span" variant={'body2'} textAlign={'center'}>
              Không có dữ liệu
            </Typography>
          ) : (
            <>
              <Table className="tableCss mt-5">
                <TableHead sx={{ backgroundColor: 'sanPham.colorTable' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: '500' }} align="center">
                      STT
                    </TableCell>
                    <TableCell sx={{ fontWeight: '500' }} align="center">
                      Tên
                    </TableCell>
                    <TableCell sx={{ fontWeight: '500' }} align="center">
                      Ngày thêm
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: '500' }} align="center">
                      Hoạt động
                    </TableCell> */}
                    <TableCell sx={{ fontWeight: '500' }} align="center">
                      Chức năng
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listCategory.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="center">{row.stt}</TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">
                        {dayjs(row.createAt).format('DD/MM/YYYY')}
                      </TableCell>
                      {/* <TableCell align="center">
                        {row.deleted === 0 ? (
                          <Chip
                            onClick={() => setDeleted(row.id)}
                            className="chip-hoat-dong"
                            size="small"
                            label="Hoạt động"
                          />
                        ) : (
                          <Chip
                            onClick={() => setDeleted(row.id)}
                            className="chip-khong-hoat-dong"
                            size="small"
                            label="Không hoạt động"
                          />
                        )}
                      </TableCell> */}
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => {
                              setCategoryUpdate({ ...categoryUpdate, id: row.id, name: row.name })
                              setOpenUpdate(true)
                              setErrorCategoryUpdate('')
                            }}
                            color="warning">
                            <TbEyeEdit fontSize={'25px'} color="#FC7C27" />
                          </IconButton>
                        </Tooltip>
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
                    thể loại
                  </Typography>
                </Typography>
                <Pagination
                  count={totalPages}
                  page={filter.page}
                  onChange={(e, value) => {
                    e.preventDefault()
                    setFilter({ ...filter, page: value })
                  }}
                  color="cam"
                  variant="outlined"
                />
              </Stack>
            </>
          )}
        </Container>
      </Box>
    </div>
  ) : (
    <div></div>
  )
}
