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
import { spButton } from './chatlieuStyle'
import dayjs from 'dayjs'
import SearchIcon from '@mui/icons-material/Search'
import { toast } from 'react-toastify'
import { useTheme } from '@emotion/react'
import confirmSatus from '../../../components/comfirmSwal'
import { TbEyeEdit } from 'react-icons/tb'
import DialogAddUpdate from '../../../components/DialogAddUpdate'
import materialApi from '../../../api/admin/sanpham/materialApi'
import * as ExcelJS from 'exceljs'

import useDebounce from '../../../services/hook/useDebounce'

const listBreadcrumb = [{ name: 'Quản lý chất liệu' }]

export default function AdMaterialPage() {
  const theme = useTheme()
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [material, setMaterial] = useState({ name: '' })
  const [errorMaterial, setErrorMaterial] = useState('')
  const [errorMaterialUpdate, setErrorMaterialUpdate] = useState('')
  const [materialUpdate, setMaterialUpdate] = useState({ id: 0, name: '' })
  const [allNameMaterial, setAllNameMaterial] = useState([])
  const [listMaterial, setListMaterial] = useState([])
  const [listMaterialEx, setListMaterialEx] = useState([])
  const [isBackdrop, setIsBackdrop] = useState(true)
  const [filter, setFilter] = useState({ page: 1, size: 5, name: '' })
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchData(filter)
    getAllmaterial()
    haldleAllNameMaterial()
  }, [filter])
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, name: inputValue })
  }, [debouncedValue])

  const fetchData = (filter) => {
    setIsBackdrop(true)
    materialApi
      .getMaterial(filter)
      .then((response) => {
        const res = response.data
        setListMaterial(res.data.content)
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

  const getAllmaterial = () => {
    materialApi.getList().then((res) => {
      setListMaterialEx(res.data.data)
    })
  }

  const haldleAllNameMaterial = () => {
    materialApi
      .getAllNameMaterial()
      .then((response) => {
        setAllNameMaterial(response.data.data)
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

    if (material.name.trim() === '') {
      errors.name = 'Không được để trống tên chất liệu'
    } else if (material.name.length > 100) {
      errors.name = 'Tên chất liệu không được dài hơn 100 ký tự'
    } else if (allNameMaterial.includes(material.name)) {
      errors.name = 'Tên chất liệu đã tồn tại'
    } else if (specialCharsRegex.test(material.name)) {
      errors.name = 'Tên chất liệu chứa kí tự đặc biệt'
    }

    for (const key in errors) {
      if (errors[key]) {
        check++
      }
    }

    setErrorMaterial(errors.name)

    return check
  }

  const isMatirialNameDuplicate = (matirialName, currentId) => {
    return listMaterial.some(
      (material) => material.name === matirialName && material.id !== currentId,
    )
  }

  const handleValidateUpdate = () => {
    let check = 0
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
    const errors = {
      nameUpdate: '',
    }

    if (materialUpdate.name.trim() === '') {
      errors.nameUpdate = 'Không được để trống tên chất liệu'
    } else if (materialUpdate.name.length > 100) {
      errors.nameUpdate = 'Tên chất liệu không được dài hơn 100 ký tự'
    } else if (isMatirialNameDuplicate(materialUpdate.name, materialUpdate.id)) {
      errors.nameUpdate = 'Tên chất liệu đã tồn tại'
    } else if (specialCharsRegex.test(materialUpdate.name)) {
      errors.nameUpdate = 'Tên chất liệu chứa kí tự đặc biệt'
    }

    for (const key in errors) {
      if (errors[key]) {
        check++
      }
    }

    setErrorMaterialUpdate(errors.nameUpdate)

    return check
  }

  const addProduct = () => {
    const check = handleValidateAdd()
    if (check < 1) {
      setIsBackdrop(true)
      const title = 'Xác nhận Thêm mới chất liệu?'
      const text = ''
      setOpenAdd(false)
      confirmSatus(title, text, theme).then((result) => {
        if (result.isConfirmed) {
          materialApi.addMaterial(material).then((res) => {
            if (res.data.success) {
              setIsBackdrop(false)
              setOpenAdd(false)
              setMaterial({ name: '' })
              toast.success('Thêm chất liệu thành công', {
                position: toast.POSITION.TOP_RIGHT,
              })
              fetchData(filter)
              haldleAllNameMaterial()
            } else {
              setOpenAdd(true)
              toast.error('Thêm chất liệu thất bại', {
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
      const title = 'Xác nhận cập nhập chất liệu?'
      const text = ''
      setOpenUpdate(false)
      confirmSatus(title, text, theme).then((result) => {
        if (result.isConfirmed) {
          materialApi
            .updateMaterial(materialUpdate.id, { name: materialUpdate.name })
            .then((res) => {
              if (res.data.success) {
                setIsBackdrop(false)
                setMaterial({ name: '' })
                toast.success('Cập nhập chất liệu thành công', {
                  position: toast.POSITION.TOP_RIGHT,
                })
                fetchData(filter)
                haldleAllNameMaterial()
              } else {
                setOpenUpdate(true)
                toast.error('Cập nhập chất liệu thất bại', {
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
  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }
  const chageName = (e) => {
    if (openAdd) setMaterial({ ...material, name: e.target.value })
    else setMaterialUpdate({ ...materialUpdate, name: e.target.value })
  }
  // const setDeleted = (id) => {
  //   const title = 'Xác nhận thay đổi hoạt động?'
  //   const text = 'Ẩn hoạt động sẽ làm ẩn chất liệu khỏi nơi khác'
  //   confirmSatus(title, text, theme).then((result) => {
  //     if (result.isConfirmed) {
  //       materialApi
  //         .swapMaterial(id)
  //         .then((res) => {
  //           if (res.data.success) {
  //             setIsBackdrop(false)
  //             toast.success('Thay đổi trạng thái hoạt động thành công', {
  //               position: toast.POSITION.TOP_RIGHT,
  //             })
  //             fetchData(filter)
  //           }
  //         })
  //         .catch(() => {
  //           toast.error('Thay đổi trạng thái hoạt động thất bại', {
  //             position: toast.POSITION.TOP_RIGHT,
  //           })
  //         })
  //     }
  //   })
  // }

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('MaterialData')

    const columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Tên', key: 'name', width: 15 },
      { header: 'Ngày thêm', key: 'createAt', width: 17.5 },
      { header: 'Hoạt động', key: 'deleted', width: 20 },
    ]

    worksheet.columns = columns

    listMaterialEx.forEach((row, index) => {
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
      link.download = 'material_data.xlsx'
      link.click()
    })
  }

  return listMaterial ? (
    <div>
      <Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <BreadcrumbsCustom nameHere={'chất liệu'} listLink={listBreadcrumb} />
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
              placeholder="Tìm chất liệu"
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
                setMaterial({ ...material, name: '' })
                setErrorMaterial('')
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
                title={'Thêm mới chất liệu'}
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
                    setErrorMaterial('')
                  }}
                  defaultValue={material.name}
                  fullWidth
                  inputProps={{
                    required: true,
                  }}
                  size="small"
                  placeholder="Nhập tên chất liệu"
                  error={Boolean(errorMaterial)}
                  helperText={errorMaterial}
                />
              </DialogAddUpdate>
            )}
            {openUpdate && (
              <DialogAddUpdate
                open={openUpdate}
                setOpen={setOpenUpdate}
                title={'Chỉnh sửa chất liệu'}
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
                    setErrorMaterialUpdate('')
                  }}
                  defaultValue={materialUpdate.name}
                  fullWidth
                  inputProps={{
                    required: true,
                  }}
                  size="small"
                  placeholder="Nhập tên chất liệu"
                  error={Boolean(errorMaterialUpdate)}
                  helperText={errorMaterialUpdate}
                />
              </DialogAddUpdate>
            )}
          </Stack>
          {listMaterial.length === 0 ? (
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
                  {listMaterial.map((row, index) => (
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
                              setMaterialUpdate({ ...materialUpdate, id: row.id, name: row.name })
                              setOpenUpdate(true)
                              setErrorMaterialUpdate('')
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
                    chất liệu
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
