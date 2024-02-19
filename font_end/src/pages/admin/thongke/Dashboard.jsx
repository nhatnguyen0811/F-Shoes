import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
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
} from '@mui/material'
import EventNoteIcon from '@mui/icons-material/EventNote'
import AssessmentIcon from '@mui/icons-material/Assessment'
import AssignmentIcon from '@mui/icons-material/Assignment'
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import LineChartDashBoard from './LineChartDashBoard'
import thongKeApi from '../../../api/admin/thongke/thongKeApi'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import './Dashboard.css'
import { formatCurrency } from '../../../services/common/formatCurrency '
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import BreadcrumbsCustom from '../../../components/BreadcrumbsCustom'
import ExcelJS from 'exceljs'

const DashboardCard = function ({
  iconCart,
  title,
  total,
  product,
  order,
  orderCancel,
  orderReturn,
  color,
}) {
  return (
    <Grid2 lg={3} md={6} xs={12} justifyContent={'center'}>
      <Card variant="elevation" sx={{ p: 2, backgroundColor: color, color: 'white' }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          {iconCart}
        </Box>
        <Typography mt={1} align="center" fontFamily={'monospace'} fontSize={'17px'}>
          {title}
        </Typography>
        <Typography
          my={1}
          fontWeight={'600'}
          align="center"
          fontSize={'20px'}
          fontFamily={'monospace'}>
          {formatCurrency(total)}
        </Typography>
        <table
          style={{
            textAlign: 'center',
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '15px',
          }}>
          <thead>
            <tr>
              <td>Sản phẩm</td>
              <td>Đơn thành công</td>
              <td>Đơn hủy</td>
              <td>Đơn trả</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold' }}>{product}</td>
              <td style={{ fontWeight: 'bold' }}>{order}</td>
              <td style={{ fontWeight: 'bold' }}>{orderCancel}</td>
              <td style={{ fontWeight: 'bold' }}>{orderReturn}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </Grid2>
  )
}

export default function Dashboard() {
  const [dataProductSelling, setDataProductSelling] = useState([])
  const [dataProductTakeOut, setDataProductTakeOut] = useState([])
  const [indexButton, setIndexButton] = useState(1)
  const [nameIndexButton, setNameIndexButton] = useState('ngày')
  const [doanhThu, setDoanhThu] = useState({})
  const [doanhThuCu, setDoanhThuCu] = useState({})
  const [doanhThuCustom, setDoanhThuCustom] = useState({})
  const [dataBieuDo, setDataBieuDo] = useState([])
  const [filter, setFilter] = useState({
    page: 1,
    size: 5,
  })
  const [filterInCustom, setFilterInCustom] = useState({
    startDate: null,
    endDate: null,
    page: 1,
    size: 5,
  })
  const [filterTakeOut, setFilterTakeOut] = useState({
    page: 1,
    size: 5,
    soLuongSearch: 10,
  })
  const [tkDoanhThuNgay, setTkDoanhThuNgay] = useState(null)
  const [tkDoanhThuTuan, setTkDoanhThuTuan] = useState(null)
  const [tkDoanhThuThang, setTkDoanhThuThang] = useState(null)
  const [tkDoanhThuNam, setTkDoanhThuNam] = useState(null)
  const [tkDonHangNgay, setTkDonHangNgay] = useState(null)
  const [tkDonHangTuan, setTkDonHangTuan] = useState(null)
  const [tkDonHangThang, setTkDonHangThang] = useState(null)
  const [tkDonHangNam, setTkDonHangNam] = useState(null)
  const [tkSanPhamNgay, setTkSanPhamNgay] = useState(null)
  const [tkSanPhamTuan, setTkSanPhamTuan] = useState(null)
  const [tkSanPhamThang, setTkSanPhamThang] = useState(null)
  const [tkSanPhamNam, setTkSanPhamNam] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalPagesTakeOut, setTotalPagesTakeOut] = useState(0)

  const fecthDataDay = (filter) => {
    thongKeApi.getAllProductInDay(filter).then((response) => {
      setDataProductSelling(
        response.data.data.data.map((e) => {
          return { ...e, image: e.image.split(',') }
        }),
      )
      setTotalPages(response.data.data.totalPages)
    })
  }

  const fecthDataWeek = (filter) => {
    thongKeApi.getAllProductInWeek(filter).then((response) => {
      setDataProductSelling(
        response.data.data.data.map((e) => {
          return { ...e, image: e.image.split(',') }
        }),
      )
      setTotalPages(response.data.data.totalPages)
    })
  }

  const fecthDataMonth = (filter) => {
    thongKeApi.getAllProductInMonth(filter).then((response) => {
      setDataProductSelling(
        response.data.data.data.map((e) => {
          return { ...e, image: e.image.split(',') }
        }),
      )
      setTotalPages(response.data.data.totalPages)
    })
  }

  const fecthDataYear = (filter) => {
    thongKeApi.getAllProductInYear(filter).then((response) => {
      setDataProductSelling(
        response.data.data.data.map((e) => {
          return { ...e, image: e.image.split(',') }
        }),
      )
      setTotalPages(response.data.data.totalPages)
    })
  }

  const fecthDataInCustom = (filter) => {
    thongKeApi.getProductInCustom(filter).then((response) => {
      setDataProductSelling(
        response.data.data.data.map((e) => {
          return { ...e, image: e.image.split(',') }
        }),
      )
      setTotalPages(response.data.data.totalPages)
    })
  }

  const fecthDoanhThu = () => {
    thongKeApi.getDoanhThu().then((response) => {
      setDoanhThu(response.data.data[0])
    })
  }

  const fecthDoanhThuCu = () => {
    thongKeApi.getDoanhThuCu().then((response) => {
      setDoanhThuCu(response.data.data[0])
    })
  }

  const fecthDoanhThuCustom = (filter) => {
    thongKeApi.getDoanhThuCustom(filter).then((response) => {
      setDoanhThuCustom(response.data.data[0])
    })
  }

  const fetchThongKeDonHang = (filterInCustom) => {
    thongKeApi.getThongKeDonHang(filterInCustom).then((response) => {
      setDataBieuDo(response.data.data)
    })
  }

  const fetchThongKeDonHangTrongNgay = () => {
    thongKeApi.getThongKeDonHangTrongNgay().then((response) => {
      setDataBieuDo(response.data.data)
    })
  }

  const fetchThongKeDonHangTrongTuan = () => {
    thongKeApi.getThongKeDonHangTrongTuan().then((response) => {
      setDataBieuDo(response.data.data)
    })
  }

  const fetchThongKeDonHangTrongThang = () => {
    thongKeApi.getThongKeDonHangTrongThang().then((response) => {
      setDataBieuDo(response.data.data)
    })
  }

  const fetchThongKeDonHangTrongNam = () => {
    thongKeApi.getThongKeDonHangTrongNam().then((response) => {
      setDataBieuDo(response.data.data)
    })
  }

  const fecthDataTakeOut = (filter) => {
    thongKeApi.getProductTakeOut(filter).then((response) => {
      setDataProductTakeOut(
        response.data.data.data.map((e) => {
          return { ...e, image: e.image.split(',') }
        }),
      )
      setTotalPagesTakeOut(response.data.data.totalPages)
    })
  }

  const handleRateCalculation = (a, b) => {
    const maxAbsoluteValue = Math.max(Math.abs(a), Math.abs(b))

    if (maxAbsoluteValue === 0) {
      return 0
    }

    const percentageDifference = ((a - b) / maxAbsoluteValue) * 100
    return parseFloat(percentageDifference.toFixed(2))
  }

  const handleGrowthRate = () => {
    const dateRevenue = handleRateCalculation(doanhThu.doanhSoNgay, doanhThuCu.doanhSoNgayTruoc)
    const weekRevenue = handleRateCalculation(doanhThu.doanhSoTuanNay, doanhThuCu.doanhSoTuanTruoc)
    const monthRevenue = handleRateCalculation(
      doanhThu.doanhSoThangNay,
      doanhThuCu.doanhSoThangTruoc,
    )
    const yearRevenue = handleRateCalculation(doanhThu.doanhSoNamNay, doanhThuCu.doanhSoNamTruoc)
    const dateOrder = handleRateCalculation(doanhThu.soDonHangNgay, doanhThuCu.soDonNgayTruoc)
    const weekOrder = handleRateCalculation(doanhThu.soDonHangTuanNay, doanhThuCu.soDonTuanTruoc)
    const monthOrder = handleRateCalculation(doanhThu.soDonHangThangNay, doanhThuCu.soDonThangTruoc)
    const yearOrder = handleRateCalculation(doanhThu.soDonHangNamNay, doanhThuCu.soDonNamTruoc)
    const dateProduct = handleRateCalculation(
      doanhThu.soLuongSanPhamNgay,
      doanhThuCu.soLuongSanPhamNgayTruoc,
    )
    const weekProduct = handleRateCalculation(
      doanhThu.soLuongSanPhamTuanNay,
      doanhThuCu.soLuongSanPhamTuanTruoc,
    )
    const monthProduct = handleRateCalculation(
      doanhThu.soLuongSanPhamThangNay,
      doanhThuCu.soLuongSanPhamThangTruoc,
    )
    const yearProduct = handleRateCalculation(
      doanhThu.soLuongSanPhamNamNay,
      doanhThuCu.soLuongSanPhamNamTruoc,
    )

    setTkDoanhThuNgay(dateRevenue)
    setTkDoanhThuTuan(weekRevenue)
    setTkDoanhThuThang(monthRevenue)
    setTkDoanhThuNam(yearRevenue)
    setTkDonHangNgay(dateOrder)
    setTkDonHangTuan(weekOrder)
    setTkDonHangThang(monthOrder)
    setTkDonHangNam(yearOrder)
    setTkSanPhamNgay(dateProduct)
    setTkSanPhamTuan(weekProduct)
    setTkSanPhamThang(monthProduct)
    setTkSanPhamNam(yearProduct)
  }

  useEffect(() => {
    handleGrowthRate()
  }, [doanhThu, doanhThuCu])

  useEffect(() => {
    if (indexButton === 1) {
      fecthDataDay(filter)
      fetchThongKeDonHangTrongNgay()
    } else if (indexButton === 2) {
      fecthDataWeek(filter)
      fetchThongKeDonHangTrongTuan()
    } else if (indexButton === 3) {
      fecthDataMonth(filter)
      fetchThongKeDonHangTrongThang()
    } else if (indexButton === 4) {
      fecthDataYear(filter)
      fetchThongKeDonHangTrongNam()
    } else if (indexButton === 5) {
      fecthDataInCustom(filterInCustom)
      fetchThongKeDonHang(filterInCustom)
      fecthDoanhThuCustom(filterInCustom)
    }
    fecthDataTakeOut(filterTakeOut)
  }, [filter, doanhThu, indexButton, filterTakeOut, filterInCustom])

  useEffect(() => {
    fecthDoanhThu()
    fecthDoanhThuCu()
  }, [])

  const handleIndexButton = (index, name) => {
    setIndexButton(index)
    setNameIndexButton(name)
    setFilterInCustom({ startDate: null, endDate: null })
  }

  const handleExportToExcel = () => {
    const workbook = new ExcelJS.Workbook()

    const exportSheet = (worksheet, title, total, product, order, orderCancel, orderReturn) => {
      worksheet.addRow([title])
      worksheet.addRow([''])
      worksheet.addRow(['Doanh số', total || 0])
      worksheet.addRow(['Số lượng sản phẩm', product || 0])
      worksheet.addRow(['Số đơn hàng', order || 0])
      worksheet.addRow(['Số đơn hủy', orderCancel || 0])
      worksheet.addRow(['Số đơn trả hàng', orderReturn || 0])

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
      worksheet.getColumn('A').width = 20
      worksheet.columns.forEach((column) => {
        const { width } = column
        column.width = width
      })
    }

    const todayWorksheet = workbook.addWorksheet('Hôm nay')
    const safeGetValue = (obj, prop) =>
      obj && obj[prop] !== undefined && obj[prop] !== null ? obj[prop] : 0
    exportSheet(
      todayWorksheet,
      'Hôm nay',
      safeGetValue(doanhThu, 'doanhSoNgay'),
      safeGetValue(doanhThu, 'soLuongSanPhamNgay'),
      safeGetValue(doanhThu, 'soDonHangNgay'),
      safeGetValue(doanhThu, 'soDonHuyNgay'),
      safeGetValue(doanhThu, 'soDonTraHangNgay'),
    )

    const thisWeekWorksheet = workbook.addWorksheet('Tuần này')
    exportSheet(
      thisWeekWorksheet,
      'Tuần này',
      safeGetValue(doanhThu, 'doanhSoTuanNay'),
      safeGetValue(doanhThu, 'soLuongSanPhamTuanNay'),
      safeGetValue(doanhThu, 'soDonHangTuanNay'),
      safeGetValue(doanhThu, 'soDonHuyTuanNay'),
      safeGetValue(doanhThu, 'soDonTraHangTuanNay'),
    )

    const thisMonthWorksheet = workbook.addWorksheet('Tháng này')
    exportSheet(
      thisMonthWorksheet,
      'Tháng này',
      safeGetValue(doanhThu, 'doanhSoThangNay'),
      safeGetValue(doanhThu, 'soLuongSanPhamThangNay'),
      safeGetValue(doanhThu, 'soDonHangThangNay'),
      safeGetValue(doanhThu, 'soDonHuyThangNay'),
      safeGetValue(doanhThu, 'soDonTraHangThangNay'),
    )

    const thisYearWorksheet = workbook.addWorksheet('Năm nay')
    exportSheet(
      thisYearWorksheet,
      'Năm nay',
      safeGetValue(doanhThu, 'doanhSoNamNay'),
      safeGetValue(doanhThu, 'soLuongSanPhamNamNay'),
      safeGetValue(doanhThu, 'soDonHangNamNay'),
      safeGetValue(doanhThu, 'soDonHuyNamNay'),
      safeGetValue(doanhThu, 'soDonTraHangNamNay'),
    )

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'thong_ke_doanh_so.xlsx'
      link.click()
    })
  }
  const listBreadcrumbs = [{ name: 'Thống kê', link: '  /admin/dashboard' }]
  return (
    <div>
      <BreadcrumbsCustom listLink={listBreadcrumbs} />
      <Grid container spacing={2} mb={2}>
        <Grid item xs={6}>
          <DashboardCard
            iconCart={<EventNoteIcon />}
            title={'Hôm nay'}
            total={doanhThu.doanhSoNgay === null ? 0 : doanhThu.doanhSoNgay}
            product={doanhThu.soLuongSanPhamNgay === null ? 0 : doanhThu.soLuongSanPhamNgay}
            order={doanhThu.soDonHangNgay}
            orderCancel={doanhThu.soDonHuyNgay}
            orderReturn={doanhThu.soDonTraHangNgay}
            color={'#0694a2'}
          />
        </Grid>
        <Grid item xs={6}>
          <DashboardCard
            iconCart={<AutoAwesomeMotionIcon />}
            title={'Tuần này'}
            total={doanhThu.doanhSoTuanNay === null ? 0 : doanhThu.doanhSoTuanNay}
            product={doanhThu.soLuongSanPhamTuanNay === null ? 0 : doanhThu.soLuongSanPhamTuanNay}
            order={doanhThu.soDonHangTuanNay}
            orderCancel={doanhThu.soDonHuyTuanNay}
            orderReturn={doanhThu.soDonTraHangTuanNay}
            color={'#ff8a4c'}
          />
        </Grid>
        <Grid item xs={6}>
          <DashboardCard
            iconCart={<AssignmentIcon />}
            title={'Tháng này'}
            total={doanhThu.doanhSoThangNay === null ? 0 : doanhThu.doanhSoThangNay}
            product={doanhThu.soLuongSanPhamThangNay === null ? 0 : doanhThu.soLuongSanPhamThangNay}
            order={doanhThu.soDonHangThangNay}
            orderCancel={doanhThu.soDonHuyThangNay}
            orderReturn={doanhThu.soDonTraHangThangNay}
            color={'#3f83f8'}
          />
        </Grid>
        <Grid item xs={6}>
          <DashboardCard
            iconCart={<AssessmentIcon />}
            title={'Năm nay'}
            total={doanhThu.doanhSoNamNay === null ? 0 : doanhThu.doanhSoNamNay}
            product={doanhThu.soLuongSanPhamNamNay === null ? 0 : doanhThu.soLuongSanPhamNamNay}
            order={doanhThu.soDonHangNamNay}
            orderCancel={doanhThu.soDonHuyNamNay}
            orderReturn={doanhThu.soDonTraHangNamNay}
            color={'#0e9f6e'}
          />
        </Grid>
      </Grid>
      {indexButton === 5 && (
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <DashboardCard
              iconCart={<AssessmentIcon />}
              title={
                filterInCustom.startDate === null && filterInCustom.endDate === null
                  ? 'Tùy chỉnh'
                  : filterInCustom.startDate !== null && filterInCustom.endDate === null
                    ? `${filterInCustom.startDate} ---`
                    : filterInCustom.startDate === null && filterInCustom.endDate !== null
                      ? `--- ${filterInCustom.endDate}`
                      : `${filterInCustom.startDate} --- ${filterInCustom.endDate}`
              }
              total={doanhThuCustom.doanhSo === null ? 0 : doanhThuCustom.doanhSo}
              product={doanhThuCustom.soLuong === null ? 0 : doanhThuCustom.soLuong}
              order={doanhThuCustom.donHang}
              orderCancel={doanhThuCustom.donHuy}
              orderReturn={doanhThuCustom.donTra}
              color={'#52a6b3'}
            />
          </Grid>
        </Grid>
      )}
      {/* ------------------------------------------------------------------------- */}
      <Paper elevation={3} className="paper-css">
        <Typography variant="h6" fontWeight={'bold'} my={1} px={1}>
          Bộ lọc
        </Typography>
        <Grid sx={{ px: 1 }}>
          <Button
            variant="outlined"
            color="cam"
            className="button-css"
            sx={{
              backgroundColor: indexButton === 1 ? '#f26b16' : 'white',
              color: indexButton === 1 ? 'white' : 'black',
            }}
            onClick={() => handleIndexButton(1, 'ngày')}>
            Ngày
          </Button>
          <Button
            variant="outlined"
            color="cam"
            className="button-css"
            sx={{
              backgroundColor: indexButton === 2 ? '#f26b16' : 'white',
              color: indexButton === 2 ? 'white' : 'black',
            }}
            onClick={() => handleIndexButton(2, 'tuần')}>
            Tuần
          </Button>
          <Button
            variant="outlined"
            color="cam"
            className="button-css"
            sx={{
              backgroundColor: indexButton === 3 ? '#f26b16' : 'white',
              color: indexButton === 3 ? 'white' : 'black',
            }}
            onClick={() => handleIndexButton(3, 'tháng')}>
            Tháng
          </Button>
          <Button
            variant="outlined"
            color="cam"
            className="button-css"
            sx={{
              backgroundColor: indexButton === 4 ? '#f26b16' : 'white',
              color: indexButton === 4 ? 'white' : 'black',
            }}
            onClick={() => handleIndexButton(4, 'năm')}>
            Năm
          </Button>
          <Button
            variant="outlined"
            color="cam"
            className="button-css"
            sx={{
              backgroundColor: indexButton === 5 ? '#f26b16' : 'white',
              color: indexButton === 5 ? 'white' : 'black',
            }}
            onClick={() => handleIndexButton(5, 'tùy chỉnh')}>
            Tùy chỉnh
          </Button>
          <Button
            variant="outlined"
            color="success"
            sx={{ float: 'right' }}
            onClick={handleExportToExcel}>
            Export to Excel
          </Button>
          {indexButton === 5 && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format={'DD-MM-YYYY'}
                ampm={false}
                onChange={(e) =>
                  setFilterInCustom({
                    ...filterInCustom,
                    startDate: dayjs(e).format('DD-MM-YYYY'),
                  })
                }
                slotProps={{
                  actionBar: {
                    actions: ['clear', 'today'],
                  },
                }}
                label="Từ ngày"
                className="dateTime-dashboard"
              />
            </LocalizationProvider>
          )}
          {indexButton === 5 && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format={'DD-MM-YYYY'}
                ampm={false}
                onChange={(e) =>
                  setFilterInCustom({
                    ...filterInCustom,
                    endDate: dayjs(e).format('DD-MM-YYYY'),
                  })
                }
                slotProps={{
                  actionBar: {
                    actions: ['clear', 'today'],
                  },
                }}
                label="Đến ngày"
                className="dateTime-dashboard"
              />
            </LocalizationProvider>
          )}
        </Grid>
        <Grid container spacing={2} sx={{ px: 1 }}>
          <Grid item xs={7}>
            <Typography variant="h6" fontWeight={'bold'} my={1} className="typography-css">
              Danh sách sản phẩm bán chạy theo {nameIndexButton}
            </Typography>

            <Table aria-label="simple table" className="table-css">
              <TableHead>
                <TableRow>
                  <TableCell width="5%">Ảnh</TableCell>
                  <TableCell width="45%">Tên sản phẩm</TableCell>
                  <TableCell align="center" width="15%">
                    Số lượng
                  </TableCell>
                  <TableCell align="center" width="20%">
                    Giá tiền
                  </TableCell>
                  <TableCell align="center" width="15%">
                    Kích cỡ
                  </TableCell>
                </TableRow>
              </TableHead>
              {dataProductSelling.length > 0 ? (
                <TableBody>
                  {dataProductSelling.map((row) => (
                    <TableRow
                      key={row.name}
                      // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left" width={'5%'}>
                        <img src={row.image[0]} width={'100%'} alt="error" />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.nameProduct}
                      </TableCell>
                      <TableCell align="center">{row.quantity}</TableCell>
                      <TableCell align="center">{formatCurrency(row.price)}</TableCell>
                      <TableCell align="center">{row.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <img
                          width={'400px'}
                          src={require('../../../assets/image/no-data.png')}
                          alt="No-data"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            {dataProductSelling.length > 0 && (
              <Stack
                sx={{ marginTop: '-5px', paddingTop: '10px', paddingBottom: '10px' }}
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={0}
                className="stack-css">
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
                  <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>
                    sản phẩm
                  </Typography>
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
            )}
          </Grid>
          <Grid item xs={5}>
            <Grid container spacing={2} mt={1}></Grid>
            <Typography variant="h6" fontWeight={'bold'} my={1} mt={3} className="typography-css">
              Biểu đồ trạng thái {nameIndexButton}
            </Typography>
            <Paper elevation={3} sx={{ height: '415px', border: '3px solid rgb(211, 211, 211)' }}>
              <LineChartDashBoard dataBieuDo={dataBieuDo} />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      {/* ------------------------------------------------------------------------- */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={7}>
          <Paper elevation={3} className="paper-css">
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
              <Typography variant="h6" fontWeight={'bold'} my={2} className="typography-css">
                Danh sách sản phẩm sắp hết hàng
              </Typography>
              <TextField
                size="small"
                type="number"
                sx={{ width: '15%' }}
                defaultValue={filterTakeOut.soLuongSearch}
                onChange={(e) =>
                  setFilterTakeOut({ ...filterTakeOut, soLuongSearch: e.target.value })
                }
              />
            </Stack>
            <Table aria-label="simple table" className="table-css">
              <TableHead>
                <TableRow>
                  <TableCell width="10%">Ảnh</TableCell>
                  <TableCell width="40%">Tên sản phẩm</TableCell>
                  <TableCell align="center" width="15%">
                    Số lượng
                  </TableCell>
                  <TableCell align="center" width="15%">
                    Giá tiền
                  </TableCell>
                  <TableCell align="center" width="10%">
                    Kích cỡ
                  </TableCell>
                </TableRow>
              </TableHead>
              {dataProductTakeOut.length > 0 ? (
                <TableBody>
                  {dataProductTakeOut.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="left" width={'10%'}>
                        <img src={row.image[0]} width={'100%'} alt="error" />
                      </TableCell>
                      <TableCell component="th" scope="row" width="40%">
                        {row.nameProduct}
                      </TableCell>
                      <TableCell align="center" width="15%">
                        {row.quantity}
                      </TableCell>
                      <TableCell align="center">{formatCurrency(row.price)}</TableCell>
                      <TableCell align="center">{row.size}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <img
                          width={'400px'}
                          src={require('../../../assets/image/no-data.png')}
                          alt="No-data"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            {dataProductTakeOut.length > 0 && (
              <Stack
                mt={2}
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={0}
                className="stack-css">
                <Typography component="span" variant={'body2'} mt={0.5}>
                  <Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>Xem</Typography>
                  <Select
                    color="cam"
                    onChange={(e) => {
                      setFilterTakeOut({ ...filterTakeOut, size: e.target.value })
                    }}
                    sx={{ height: '25px', mx: 0.5 }}
                    size="small"
                    value={filterTakeOut.size}>
                    <MenuItem value={1}>1</MenuItem>
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
                  count={totalPagesTakeOut}
                  page={filterTakeOut.page}
                  onChange={(e, value) => {
                    e.preventDefault()
                    setFilterTakeOut({ ...filterTakeOut, page: value })
                  }}
                />
              </Stack>
            )}
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper elevation={3} className="paper-css-1">
            <Stack
              mt={2}
              mb={2}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={0}>
              <Typography variant="h6" fontWeight={'bold'}>
                Tốc độ tăng trưởng của cửa hàng
              </Typography>
              <Button
                className="button-reload-css"
                color="warning"
                onClick={() => handleGrowthRate()}>
                <AutorenewIcon />
              </Button>
            </Stack>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboarh" />
                Doanh thu ngày
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {formatCurrency(doanhThu.doanhSoNgay)}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkDoanhThuNgay === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkDoanhThuNgay > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkDoanhThuNgay > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkDoanhThuNgay !== 0 ? Math.abs(tkDoanhThuNgay) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboarh" />
                Doanh thu Tuần
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {formatCurrency(doanhThu.doanhSoTuanNay)}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkDoanhThuTuan === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkDoanhThuTuan > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkDoanhThuTuan > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkDoanhThuTuan !== 0 ? Math.abs(tkDoanhThuTuan) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Doanh thu Tháng
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {formatCurrency(doanhThu.doanhSoThangNay)}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkDoanhThuThang === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkDoanhThuThang > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkDoanhThuThang > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkDoanhThuThang !== 0 ? Math.abs(tkDoanhThuThang) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Doanh thu năm
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {formatCurrency(doanhThu.doanhSoNamNay)}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkDoanhThuNam === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkDoanhThuNam > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkDoanhThuNam > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkDoanhThuNam !== 0 ? Math.abs(tkDoanhThuNam) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Đơn hàng ngày
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {doanhThu.soDonHangNgay}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkDonHangNgay === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkDonHangNgay > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkDonHangNgay > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkDonHangNgay !== 0 ? Math.abs(tkDonHangNgay) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Đơn hàng tuần
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {doanhThu.soDonHangTuanNay}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkDonHangTuan === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkDonHangTuan > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkDonHangTuan > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkDonHangTuan !== 0 ? Math.abs(tkDonHangTuan) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Đơn hàng tháng
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {doanhThu.soDonHangThangNay}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkDonHangThang === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkDonHangThang > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkDonHangThang > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkDonHangThang !== 0 ? Math.abs(tkDonHangThang) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Đơn hàng năm
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {doanhThu.soDonHangNamNay}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkDonHangNam === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkDonHangNam > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkDonHangNam > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkDonHangNam !== 0 ? Math.abs(tkDonHangNam) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Sản phẩm ngày
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {doanhThu.soLuongSanPhamNgay}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkSanPhamNgay === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkSanPhamNgay > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkSanPhamNgay > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkSanPhamNgay !== 0 ? Math.abs(tkSanPhamNgay) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Sản phẩm tuần
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {doanhThu.soLuongSanPhamTuanNay}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkSanPhamTuan === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkSanPhamTuan > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkSanPhamTuan > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkSanPhamTuan !== 0 ? Math.abs(tkSanPhamTuan) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Sản phẩm tháng
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {doanhThu.soLuongSanPhamThangNay}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkSanPhamThang === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkSanPhamThang > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkSanPhamThang > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkSanPhamThang !== 0 ? Math.abs(tkSanPhamThang) + '%' : ''}
                </span>
              </Grid>
            </Grid>
            <Grid container className="grid-tang-truong">
              <Grid item xs={5} className="grid-tang-truong-data">
                <EqualizerIcon className="icon-css-dashboard" />
                Sản phẩm năm
              </Grid>
              <Grid item xs={3} className="grid-tang-truong-data">
                {doanhThu.soLuongSanPhamNamNay}
              </Grid>
              <Grid item xs={4} className="grid-tang-truong-data">
                {tkSanPhamNam === 0 ? (
                  <span style={{ color: 'white' }}>---</span>
                ) : tkSanPhamNam > 0 ? (
                  <TrendingUpIcon className="icon-up-css" />
                ) : (
                  <TrendingDownIcon className="icon-down-css" />
                )}
                <span style={{ color: tkSanPhamNam > 0 ? '#00ff00' : '#ff0000' }}>
                  {tkSanPhamNam !== 0 ? Math.abs(tkSanPhamNam) + '%' : ''}
                </span>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}
