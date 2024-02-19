import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'
import { formatCurrency } from '../../../services/common/formatCurrency '
import dayjs from 'dayjs'

const AdBillTransaction = (props) => {
  const { listTransaction } = props
  const tableRowStyle = {
    '&:hover': {
      backgroundColor: 'lightgray',
      cursor: 'pointer',
    },
  }
  return (
    <div>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Số tiền</TableCell>
              <TableCell align="center">Thời gian</TableCell>
              <TableCell align="center">Loại giao dịch</TableCell>
              <TableCell align="center">PTTT</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Ghi chú</TableCell>
              <TableCell align="center">Nhân viên xác nhận</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listTransaction.map((row, index) => (
              <TableRow key={'transaction' + row.id} sx={tableRowStyle}>
                <TableCell align="center">
                  {row.totalMoney !== null ? formatCurrency(row.totalMoney) : 0}
                </TableCell>
                <TableCell align="center">
                  {dayjs(row.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    className={row.type ? 'chip-hoan-tien' : 'chip-thanh-toan'}
                    label={row.type ? 'Hoàn tiền' : 'Thanh toán'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    className={row.paymentMethod === 1 ? 'chip-tien-mat' : 'chip-chuyen-khoan'}
                    label={row.paymentMethod === 1 ? 'Tiền mặt' : 'Chuyển khoản'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    className={row.status === 0 ? 'chip-hoat-dong' : 'chip-khong-hoat-dong'}
                    label={row.status === 0 ? 'Thành công' : 'Không thành công'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{row.note}</TableCell>
                <TableCell align="center">{row.fullName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AdBillTransaction
