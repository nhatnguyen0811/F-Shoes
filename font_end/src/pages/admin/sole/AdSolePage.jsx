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
import { spButton } from '../sanpham/sanPhamStyle'
import dayjs from 'dayjs'
import SearchIcon from '@mui/icons-material/Search'
import { toast } from 'react-toastify'
import { useTheme } from '@emotion/react'
import confirmSatus from '../../../components/comfirmSwal'
import { TbEyeEdit } from 'react-icons/tb'
import DialogAddUpdate from '../../../components/DialogAddUpdate'
import soleApi from '../../../api/admin/sanpham/soleApi'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import * as ExcelJS from 'exceljs'
import useDebounce from '../../../services/hook/useDebounce'

const listBreadcrumb = [{ name: 'Quản lý đế giày' }]
export default function AdSolePage() {
  const theme = useTheme()
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [sole, setSole] = useState({ name: '' })
  const [errorSole, setErrorSole] = useState('')
  const [soleUpdate, setSoleUpdate] = useState({ id: 0, name: '' })
  const [allNameSole, setAllNameSole] = useState([])
  const [listSole, setListSole] = useState([])
  const [listSoleEx, setListSoleEx] = useState([])
  const [isBackdrop, setIsBackdrop] = useState(true)
  const [filter, setFilter] = useState({ page: 1, size: 5, name: '' })
  const [totalPages, setTotalPages] = useState(0)

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFilter({ ...filter, name: inputValue })
  }, [debouncedValue])

  useEffect(() => {
    fetchData(filter)
    getAllSole()
    haldleAllNameSole()
  }, [filter])

  const fetchData = (filter) => {
    setIsBackdrop(true)
    soleApi
      .getSole(filter)
      .then((response) => {
        const res = response.data
        setListSole(res.data.content)
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

  const getAllSole = () => {
    soleApi.getList().then((res) => {
      setListSoleEx(res.data.data)
    })
  }

  const haldleAllNameSole = () => {
    soleApi
      .getAllNameSole()
      .then((response) => {
        setAllNameSole(response.data.data)
      })
      .catch(() => {
        toast.warning('Vui lòng f5 tải lại dữ liệu', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const addSole = () => {
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
    if (!sole.name) {
      setErrorSole('Tên không được để trống.')
      return
    }
    if (sole.name.length > 100) {
      setErrorSole('Tên đế giày không được dài hơn 100 ký tự')
      return
    }
    if (allNameSole.includes(sole.name)) {
      setErrorSole('Tên đã tồn tại, vui lòng chọn tên khác.')
      return
    }
    if (specialCharsRegex.test(sole.name)) {
      setErrorSole('Tên không được chứa kí tự đặc biệt.')
      return
    }
    setIsBackdrop(true)
    const title = 'Xác nhận Thêm mới đế giày?'
    const text = ''
    setOpenAdd(false)
    confirmSatus(title, text, theme).then((result) => {
      if (result.isConfirmed) {
        soleApi
          .addSole(sole)
          .then((res) => {
            if (res.data.success) {
              setIsBackdrop(false)
              setOpenAdd(false)
              setSole({ name: '' })
              toast.success('Thêm đế giày thành công', {
                position: toast.POSITION.TOP_RIGHT,
              })
              fetchData(filter)
              haldleAllNameSole()
            } else {
              setOpenAdd(true)
              toast.error('Thêm đế giày thất bại', {
                position: toast.POSITION.TOP_RIGHT,
              })
            }
          })
          .catch((error) => {})
      } else {
        setOpenAdd(true)
      }
    })
    setIsBackdrop(false)
  }

  const isSoleNameDuplicate = (soleName, currentId) => {
    return listSole.some((sole) => sole.name === soleName && sole.id !== currentId)
  }
  const updateSole = () => {
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/
    if (!soleUpdate.name) {
      setErrorSole('Tên không được để trống.')
      return
    } else if (soleUpdate.name.length > 100) {
      setErrorSole('Tên đế giày không được dài hơn 100 ký tự')
      return
    } else if (isSoleNameDuplicate(soleUpdate.name, soleUpdate.id)) {
      setErrorSole('Tên đế giày đã tồn tại')
      return
    } else if (specialCharsRegex.test(soleUpdate.name)) {
      setErrorSole('Tên không được chứa kí tự đặc biệt.')
      return
    }
    setIsBackdrop(true)
    const title = 'Xác nhận cập nhập đế giày?'
    const text = ''
    setOpenUpdate(false)
    confirmSatus(title, text, theme).then((result) => {
      if (result.isConfirmed) {
        soleApi.updateSole(soleUpdate.id, { name: soleUpdate.name }).then((res) => {
          if (res.data.success) {
            setIsBackdrop(false)
            setSole({ name: '' })
            toast.success('Cập nhập đế giày thành công', {
              position: toast.POSITION.TOP_RIGHT,
            })
            fetchData(filter)
            haldleAllNameSole()
          } else {
            setOpenUpdate(true)
            toast.error('Cập nhập đế giày thất bại', {
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

  const chageName = (e) => {
    if (openAdd) setSole({ ...sole, name: e.target.value })
    else setSoleUpdate({ ...soleUpdate, name: e.target.value })
  }
  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  // const setDeleted = (id) => {
  //   const title = 'Xác nhận thay đổi hoạt động?'
  //   const text = 'Thay đổi hoạt động của đế giày'
  //   confirmSatus(title, text, theme).then((result) => {
  //     if (result.isConfirmed) {
  //       soleApi
  //         .swapSole(id)
  //         .then((res) => {
  //           if (res.data.success) {
  //             setIsBackdrop(false)
  //             toast.success('Thay đổi trạng thái thành công', {
  //               position: toast.POSITION.TOP_RIGHT,
  //             })
  //             fetchData(filter)
  //           }
  //         })
  //         .catch(() => {
  //           toast.error('Thay đổi trạng thái thất bại', {
  //             position: toast.POSITION.TOP_RIGHT,
  //           })
  //         })
  //     }
  //   })
  // }
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('SoleData')

    const columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Tên', key: 'name', width: 15 },
      { header: 'Ngày thêm', key: 'createAt', width: 17.5 },
      { header: 'Hoạt động', key: 'deleted', width: 20 },
    ]

    worksheet.columns = columns

    listSoleEx.forEach((row, index) => {
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
      link.download = 'sole_data.xlsx'
      link.click()
    })
  }

  return listSole ? (
    <div>
      <Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <BreadcrumbsCustom nameHere={'đế giày'} listLink={listBreadcrumb} />
        <Container component={Paper} elevation={3} sx={{ py: 3, borderRadius: '10px' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <TextField
              className="search-field"
              size="small"
              color="cam"
              id="seachSole"
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
              placeholder="Tìm đế giày"
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
                setErrorSole('')
                setSole({ ...sole, name: '' })
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
                title={'Thêm mới đế giày'}
                buttonSubmit={
                  <Button
                    onClick={() => {
                      openAdd ? addSole() : updateSole()
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
                    setErrorSole('')
                  }}
                  defaultValue={sole.name}
                  fullWidth
                  size="small"
                  placeholder="Nhập tên đế giày"
                  error={Boolean(errorSole)}
                  helperText={errorSole}
                />
              </DialogAddUpdate>
            )}
            {openUpdate && (
              <DialogAddUpdate
                open={openUpdate}
                setOpen={setOpenUpdate}
                title={'Chỉnh sửa đế giày'}
                buttonSubmit={
                  <Button
                    onClick={() => {
                      updateSole()
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
                    setErrorSole('')
                  }}
                  defaultValue={soleUpdate.name}
                  fullWidth
                  size="small"
                  placeholder="Nhập tên đế giày"
                  error={Boolean(errorSole)}
                  helperText={errorSole}
                />
              </DialogAddUpdate>
            )}
          </Stack>
          {listSole.length === 0 ? (
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
                  {listSole.map((row, index) => (
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
                              setSoleUpdate({ ...soleUpdate, id: row.id, name: row.name })
                              setOpenUpdate(true)
                              setErrorSole('')
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
                    đế giày
                  </Typography>
                </Typography>

                <Pagination
                  page={filter.page}
                  onChange={(e, value) => {
                    e.preventDefault()
                    setFilter({ ...filter, page: value })
                  }}
                  count={totalPages}
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
