import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React, { useEffect, useState } from 'react'
import voucherApi from '../../../api/admin/voucher/VoucherApi'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import confirmSatus from '../../../components/comfirmSwal'
import { toast } from 'react-toastify'
import { useTheme } from '@emotion/react'
import '../../../assets/styles/admin.css'
import './voucher.css'
import Empty from '../../../components/Empty'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import { AiOutlineDollar, AiOutlineNumber, AiOutlinePercentage } from 'react-icons/ai'
import SearchIcon from '@mui/icons-material/Search'
import useDebounce from '../../../services/hook/useDebounce'
import { formatCurrency } from '../../../services/common/formatCurrency '

const listBreadcrumbs = [{ name: 'Phiếu giảm giá', link: '/admin/voucher' }]

const initialVoucher = {
  code: '',
  name: '',
  value: null,
  maximumValue: null,
  type: 0,
  typeValue: 0,
  minimumAmount: null,
  quantity: null,
  startDate: '',
  endDate: '',
  status: 0,
  listIdCustomer: [],
}

export default function AdVoucherAdd() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [isSelectVisible, setIsSelectVisible] = useState(false)
  const [listCustomer, setListCustomer] = useState([])
  const [initPage, setInitPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [dataFetched, setDataFetched] = useState(false)
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [errorCode, setErrorCode] = useState('')
  const [errorName, setErrorName] = useState('')
  const [errorValue, setErrorValue] = useState('')
  const [errorMaximumValue, setErrorMaximumValue] = useState('')
  const [errorMinimumAmount, setErrorMinimumAmount] = useState('')
  const [errorQuantity, setErrorQuantity] = useState('')
  const [errorStartDate, setErrorStartDate] = useState('')
  const [errorEndDate, setErrorEndDate] = useState('')
  const [allCodeVoucher, setAllCodeVoucher] = useState([])
  const [allNameVoucher, setAllNameVoucher] = useState([])
  const [voucherAdd, setVoucherAdd] = useState(initialVoucher)
  const [allCustomer, setAllCustomer] = useState([])
  const [findCustomer, setFindCustomer] = useState({ page: 1, size: 5, textSearch: '' })

  const listCode = []
  allCodeVoucher.map((m) => listCode.push(m.toLowerCase()))
  const listName = []
  allNameVoucher.map((m) => listName.push(m.toLowerCase()))

  const [valueDefault, setValueDefault] = useState(0)
  const [maximumValueDefault, setMaximumValueDefault] = useState(0)
  const [minimumvalueDefault, setMinimumValueDefault] = useState(0)
  const [quantityDefault, setQuantityDefault] = useState(0)

  useEffect(() => {
    handelCustomeFill(findCustomer)
    haldleAllCodeVoucher()
    haldleAllNameVoucher()
    haldleAllCustomer()
  }, [findCustomer])

  const validateSearchInput = (value) => {
    const specialCharsRegex = /[!@#\$%\^&*\(\),.?":{}|<>[\]]/
    return !specialCharsRegex.test(value)
  }

  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 1000)

  useEffect(() => {
    setFindCustomer({ ...findCustomer, textSearch: inputValue })
  }, [debouncedValue])

  const haldleAllCodeVoucher = () => {
    voucherApi
      .getAllCodeVoucher()
      .then((response) => {
        setAllCodeVoucher(response.data.data)
      })
      .catch(() => {
        toast.warning('Vui lòng f5 tải lại dữ liệu', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const haldleAllCustomer = () => {
    voucherApi
      .getAllCustomer()
      .then((response) => {
        setAllCustomer(response.data.data)
      })
      .catch(() => {
        toast.warning('Vui lòng f5 tải lại dữ liệu', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const haldleAllNameVoucher = () => {
    voucherApi
      .getAllNameVoucher()
      .then((response) => {
        setAllNameVoucher(response.data.data)
      })
      .catch(() => {
        toast.warning('Vui lòng f5 tải lại dữ liệu', {
          position: toast.POSITION.TOP_CENTER,
        })
      })
  }

  const handleSetValue = (value) => {
    if (voucherAdd.typeValue === 0) {
      setVoucherAdd({
        ...voucherAdd,
        value: formatCurrency(value).replace(/\D/g, ''),
      })
      setValueDefault(formatCurrency(value).replace(/\D/g, ''))
    } else {
      setVoucherAdd({
        ...voucherAdd,
        value: formatCurrency(value).replace(/\D/g, ''),
        maximumValue: formatCurrency(value).replace(/\D/g, ''),
      })
      setValueDefault(formatCurrency(value))
      setMaximumValueDefault(formatCurrency(value))
    }
    setErrorValue('')
  }

  const handleValidation = () => {
    let check = 0
    const errors = {
      code: '',
      name: '',
      value: '',
      maximumValue: '',
      quantity: '',
      minimumAmount: '',
      startDate: '',
      endDate: '',
    }

    const minBirthYear = 1900
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/

    if (voucherAdd.code.trim() === '') {
      errors.code = 'Mã không được để trống'
    } else if (voucherAdd.code !== voucherAdd.code.trim()) {
      errors.code = 'Mã không được chứa khoảng trắng thừa'
    } else if (voucherAdd.code.length > 30) {
      errors.code = 'Mã không được dài hơn 30 ký tự'
    } else if (voucherAdd.code.length < 5) {
      errors.code = 'Mã không được bé hơn 5 ký tự'
    } else if (listCode.includes(voucherAdd.code.toLowerCase())) {
      errors.code = 'Mã đã tồn tại'
    } else if (specialCharsRegex.test(voucherAdd.code)) {
      errors.code = 'Mã không được chứa ký tự đặc biệt'
    }

    if (voucherAdd.name.trim() === '') {
      errors.name = 'Tên không được để trống'
    } else if (voucherAdd.name !== voucherAdd.name.trim()) {
      errors.name = 'Tên không được chứa khoảng trắng thừa'
    } else if (voucherAdd.name.length > 100) {
      errors.name = 'Tên không được dài hơn 100 ký tự'
    } else if (voucherAdd.name.length < 5) {
      errors.name = 'Tên không được bé hơn 5 ký tự'
    } else if (listName.includes(voucherAdd.name.toLowerCase())) {
      errors.name = 'Tên đã tồn tại'
    } else if (specialCharsRegex.test(voucherAdd.name)) {
      errors.name = 'Tên không được chứa ký tự đặc biệt'
    }

    if (voucherAdd.typeValue === 0) {
      if (voucherAdd.value === null) {
        setVoucherAdd({ ...voucherAdd, value: 0 })
        errors.value = 'giá trị tối thiểu 1%'
      } else if (!Number.isInteger(parseInt(voucherAdd.value))) {
        errors.value = 'giá trị chỉ được nhập số nguyên'
      } else if (voucherAdd.value < 1) {
        errors.value = 'giá trị tối thiểu 1%'
      } else if (voucherAdd.value > 100) {
        errors.value = 'giá trị tối đa 100%'
      }
    } else {
      if (voucherAdd.value === null) {
        setVoucherAdd({ ...voucherAdd, value: 0 })
        errors.value = 'giá trị tối thiểu 1 ₫'
      } else if (!Number.isInteger(parseInt(voucherAdd.value))) {
        errors.value = 'giá trị chỉ được nhập số nguyên'
      } else if (voucherAdd.value < 1) {
        errors.value = 'giá trị tối thiểu 1 ₫'
      } else if (voucherAdd.value > 50000000) {
        errors.value = 'giá trị tối đa 50,000,000 ₫'
      }
    }

    if (voucherAdd.maximumValue === null) {
      setVoucherAdd({ ...voucherAdd, maximumValue: 0 })
      errors.maximumValue = 'giá trị tối đa tối thiểu 1 ₫'
    } else if (!Number.isInteger(parseInt(voucherAdd.maximumValue))) {
      errors.maximumValue = 'giá trị tối đa chỉ được nhập số nguyên'
    } else if (voucherAdd.maximumValue < 1) {
      errors.maximumValue = 'giá trị tối đa tối thiểu 1 ₫'
    } else if (voucherAdd.maximumValue > 50000000) {
      errors.maximumValue = 'giá trị tối đa tối đa 50,000,000 ₫'
    } else if (voucherAdd.typeValue === 1 && voucherAdd.maximumValue !== voucherAdd.value) {
      errors.maximumValue = 'giá trị tối đa phải bằng giá trị'
    }

    if (voucherAdd.quantity === null) {
      setVoucherAdd({ ...voucherAdd, quantity: 0 })
      errors.quantity = 'Số lượng tối thiểu 1'
    } else if (!Number.isInteger(parseInt(voucherAdd.quantity))) {
      errors.quantity = 'Số lượng chỉ được nhập số nguyên'
    } else if (voucherAdd.quantity < 1) {
      errors.quantity = 'Số lượng tối thiểu 1'
    }

    if (voucherAdd.minimumAmount === null) {
      setVoucherAdd({ ...voucherAdd, minimumAmount: 0 })
      errors.minimumAmount = 'Điều kiện tối thiểu 1 ₫'
    } else if (!Number.isInteger(parseInt(voucherAdd.minimumAmount))) {
      errors.minimumAmount = 'Điều kiện chỉ được nhập số nguyên'
    } else if (voucherAdd.minimumAmount < 1) {
      errors.minimumAmount = 'Điều kiện tối thiểu 1 ₫'
    } else if (voucherAdd.minimumAmount > 50000000) {
      errors.minimumAmount = 'Điều kiện tối thiểu tối đa 50,000,000 ₫'
    }

    if (voucherAdd.startDate.trim() === '') {
      errors.startDate = 'Ngày bắt đầu không được để trống'
    } else if (
      dayjs(voucherAdd.startDate, 'DD-MM-YYYY HH:mm:ss').isAfter(
        dayjs(voucherAdd.endDate, 'DD-MM-YYYY HH:mm:ss'),
      )
    ) {
      errors.startDate = 'Ngày bắt đầu không được lớn hơn ngày kết thúc'
    } else if (
      dayjs(voucherAdd.startDate, 'DD-MM-YYYY HH:mm:ss').isBefore(`${minBirthYear}-01-01`) ||
      !dayjs(voucherAdd.startDate, 'DD-MM-YYYY HH:mm:ss').isValid()
    ) {
      errors.startDate = 'Ngày bắt đầu không hợp lệ'
    }

    if (voucherAdd.endDate.trim() === '') {
      errors.endDate = 'Ngày kết thúc không được để trống'
    } else if (
      dayjs(voucherAdd.endDate, 'DD-MM-YYYY HH:mm:ss').isBefore(`${minBirthYear}-01-01`) ||
      !dayjs(voucherAdd.endDate, 'DD-MM-YYYY HH:mm:ss').isValid()
    ) {
      errors.endDate = 'Ngày kết thúc không hợp lệ'
    }

    for (const key in errors) {
      if (errors[key]) {
        check++
      }
    }

    setErrorCode(errors.code)
    setErrorName(errors.name)
    setErrorValue(errors.value)
    setErrorMaximumValue(errors.maximumValue)
    setErrorMinimumAmount(errors.minimumAmount)
    setErrorQuantity(errors.quantity)
    setErrorStartDate(errors.startDate)
    setErrorEndDate(errors.endDate)
    return check
  }

  const handleVoucherAdd = () => {
    const check = handleValidation()

    if (check < 1) {
      const title = 'Xác nhận thêm mới phiếu giảm giá?'
      const text = ''
      confirmSatus(title, text, theme).then((result) => {
        if (result.isConfirmed) {
          const updatedVoucherAdd = { ...voucherAdd, listIdCustomer: selectedCustomerIds }
          voucherApi
            .addVoucher(updatedVoucherAdd)
            .then(() => {
              toast.success('Thêm mới phiếu giảm giá thành công', {
                position: toast.POSITION.TOP_RIGHT,
              })
              navigate('/admin/voucher')
            })
            .catch(() => {
              toast.error('Thêm mới phiếu giảm giá thất bại', {
                position: toast.POSITION.TOP_RIGHT,
              })
            })
        }
      })
    } else {
      toast.error('Không thể thêm mới phiếu giảm giá', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handelCustomeFill = (findCustomer) => {
    voucherApi
      .getPageCustomer(findCustomer)
      .then((response) => {
        setListCustomer(response.data.data.content)
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

  const handelOnchangePage = (page) => {
    setInitPage(page)
    setFindCustomer({ ...findCustomer, page: page })
  }

  const handleSelectAllChange = (event) => {
    const allCustomerIds = allCustomer.map((row) => row.id)
    const selectedIds = event.target.checked ? [...selectedCustomerIds, ...allCustomerIds] : []

    setSelectedCustomerIds(selectedIds)
    setSelectAll(event.target.checked)
  }

  const handleRowCheckboxChange = (event, customerId) => {
    const selectedIndex = selectedCustomerIds.indexOf(customerId)
    let newSelectedIds = []

    if (selectedIndex === -1) {
      newSelectedIds = [...selectedCustomerIds, customerId]
    } else {
      newSelectedIds = [
        ...selectedCustomerIds.slice(0, selectedIndex),
        ...selectedCustomerIds.slice(selectedIndex + 1),
      ]
    }

    setSelectedCustomerIds(newSelectedIds)
    setSelectAll(newSelectedIds.length === allCustomer.length)
  }

  return (
    <div className="voucher-add">
      <BreadcrumbsCustom nameHere={'Tạo phiếu giảm giá'} listLink={listBreadcrumbs} />
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={5}>
            <div style={{ marginBottom: '16px' }}>
              <TextField
                className="input-css"
                label="Mã phiếu giảm giá"
                type="text"
                size="small"
                fullWidth
                onChange={(e) => {
                  setVoucherAdd({ ...voucherAdd, code: e.target.value })
                  setErrorCode('')
                }}
                error={Boolean(errorCode)}
                helperText={errorCode}
              />
            </div>
            {/* -------------------------------------------------------------------------------------------------------- */}
            <div style={{ marginBottom: '16px' }}>
              <TextField
                className="input-css"
                label="Tên phiếu giảm giá"
                type="text"
                size="small"
                fullWidth
                onChange={(e) => {
                  setVoucherAdd({ ...voucherAdd, name: e.target.value })
                  setErrorName('')
                }}
                error={Boolean(errorName)}
                helperText={errorName}
              />
            </div>
            {/* -------------------------------------------------------------------------------------------------------- */}
            <Stack
              direction="row"
              spacing={2}
              style={{ marginBottom: '16px', justifyContent: 'space-between', display: 'flex' }}>
              <div>
                <TextField
                  className="input-css"
                  label="Giá trị"
                  size="small"
                  fullWidth
                  value={valueDefault}
                  onChange={(e) => handleSetValue(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AiOutlinePercentage
                          color={voucherAdd.typeValue === 0 ? '#fc7c27' : ''}
                          className="icons-css"
                          onClick={() => {
                            setVoucherAdd({ ...voucherAdd, typeValue: 0, value: 0 })
                            setValueDefault(0)
                          }}
                        />
                        <AiOutlineDollar
                          color={voucherAdd.typeValue === 1 ? '#fc7c27' : ''}
                          className="icons-css"
                          onClick={() => {
                            setVoucherAdd({ ...voucherAdd, typeValue: 1, value: 0 })
                            setErrorValue('')
                            setValueDefault(formatCurrency(0))
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(errorValue)}
                  helperText={errorValue}
                />
              </div>
              {/* -------------------------------------------------------------------------------------------------------- */}
              <div>
                <TextField
                  disabled={voucherAdd.typeValue === 1 ? true : false}
                  className="input-css"
                  label="Giá trị tối đa"
                  size="small"
                  fullWidth
                  value={formatCurrency(maximumValueDefault)}
                  onChange={(e) => {
                    setVoucherAdd({
                      ...voucherAdd,
                      maximumValue: formatCurrency(e.target.value).replace(/\D/g, ''),
                    })
                    setErrorMaximumValue('')
                    setMaximumValueDefault(formatCurrency(e.target.value))
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AiOutlineDollar className="icons-css" />
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(errorMaximumValue)}
                  helperText={errorMaximumValue}
                />
              </div>
            </Stack>
            {/* -------------------------------------------------------------------------------------------------------- */}
            <Stack
              direction="row"
              spacing={2}
              style={{ marginBottom: '16px', justifyContent: 'space-between', display: 'flex' }}>
              <div>
                <TextField
                  className="input-css"
                  label="Số lượng"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={quantityDefault}
                  onChange={(e) => {
                    setVoucherAdd({
                      ...voucherAdd,
                      quantity: formatCurrency(e.target.value).replace(/\D/g, ''),
                    })
                    setErrorQuantity('')
                    setQuantityDefault(formatCurrency(e.target.value).replace(/\D/g, ''))
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AiOutlineNumber className="icons-css" />
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(errorQuantity)}
                  helperText={errorQuantity}
                />
              </div>
              {/* -------------------------------------------------------------------------------------------------------- */}
              <div>
                <TextField
                  className="input-css"
                  label="Điều kiện"
                  size="small"
                  fullWidth
                  value={formatCurrency(minimumvalueDefault)}
                  onChange={(e) => {
                    setVoucherAdd({
                      ...voucherAdd,
                      minimumAmount: formatCurrency(e.target.value).replace(/\D/g, ''),
                    })
                    setErrorMinimumAmount('')
                    setMinimumValueDefault(formatCurrency(e.target.value))
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AiOutlineDollar className="icons-css" />
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(errorMinimumAmount)}
                  helperText={errorMinimumAmount}
                />
              </div>
            </Stack>
            {/* -------------------------------------------------------------------------------------------------------- */}
            <div style={{ marginBottom: '16px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="dateTime"
                  format={'DD-MM-YYYY HH:mm:ss'}
                  onChange={(e) => {
                    setVoucherAdd({
                      ...voucherAdd,
                      startDate: dayjs(e).format('DD-MM-YYYY HH:mm:ss'),
                    })
                    setErrorStartDate('')
                  }}
                  ampm={false}
                  minutesStep={1}
                  minDateTime={dayjs()}
                  slotProps={{
                    actionBar: {
                      actions: ['clear', 'today'],
                    },
                  }}
                  label="Từ ngày"
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
              <span className="error">{errorStartDate}</span>
            </div>
            {/* -------------------------------------------------------------------------------------------------------- */}
            <div style={{ marginBottom: '16px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  className="dateTime"
                  format={'DD-MM-YYYY HH:mm:ss'}
                  onChange={(e) => {
                    setVoucherAdd({
                      ...voucherAdd,
                      endDate: dayjs(e).format('DD-MM-YYYY HH:mm:ss'),
                    })
                    setErrorEndDate('')
                  }}
                  ampm={false}
                  minDateTime={dayjs()}
                  slotProps={{
                    actionBar: {
                      actions: ['clear', 'today'],
                    },
                  }}
                  label="Đến ngày"
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
              <span className="error">{errorEndDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
              <FormLabel>Kiểu</FormLabel>
              <FormControl size="small" sx={{ flex: 1, ml: 2 }}>
                <RadioGroup row>
                  <FormControlLabel
                    name="typeAdd"
                    value={0}
                    control={<Radio />}
                    label="Công khai"
                    onClick={(e) => {
                      setIsSelectVisible(false)
                      setVoucherAdd({ ...voucherAdd, type: 0 })
                    }}
                    checked={isSelectVisible === false}
                  />
                  <FormControlLabel
                    name="typeAdd"
                    value={1}
                    control={<Radio />}
                    label="Cá nhân"
                    onClick={() => {
                      setIsSelectVisible(true)
                      setVoucherAdd({ ...voucherAdd, type: 1 })
                      setSelectAll(false)
                    }}
                    checked={isSelectVisible === true}
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </Grid>
          <Grid item xs={7}>
            <TextField
              className="search-customer-voucher"
              placeholder="Tìm kiếm khách hàng"
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
            {dataFetched && (
              <Table className="tableCss" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell width={'7%'}>
                      <Checkbox
                        disabled={voucherAdd.type === 0 ? true : false}
                        name="tất cả"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                    </TableCell>
                    <TableCell width={'25%'}>Tên</TableCell>
                    <TableCell width={'24%'}>Số điện thoại</TableCell>
                    <TableCell width={'29%'}>Email</TableCell>
                    <TableCell width={'15%'}>Ngày sinh</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listCustomer.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Checkbox
                          disabled={voucherAdd.type === 0 ? true : false}
                          key={row.id}
                          checked={selectedCustomerIds.indexOf(row.id) !== -1}
                          onChange={(event) => handleRowCheckboxChange(event, row.id)}
                        />
                      </TableCell>
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.phoneNumber}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{dayjs(row.dateBirth).format('DD-MM-YYYY')}</TableCell>
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
            <Grid container sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                page={initPage}
                onChange={(_, page) => handelOnchangePage(page)}
                count={totalPages}
                variant="outlined"
                color="cam"
              />
            </Grid>
          </Grid>
        </Grid>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <Button
            style={{
              width: '150px',
              borderRadius: '8px ',
              borderColor: '#fc7c27',
              color: '#fc7c27',
            }}
            onClick={() => handleVoucherAdd(voucherAdd, selectedCustomerIds)}
            variant="outlined">
            Thêm mới
          </Button>
        </div>
      </Paper>
    </div>
  )
}
