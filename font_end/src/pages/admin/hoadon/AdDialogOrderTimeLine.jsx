import '../hoadon/hoaDonStyle.css'
import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import dayjs from 'dayjs'
import { getStatus } from '../../../services/constants/statusHoaDon'
import { getStatusStyle } from './getStatusStyle'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export default function BillHistoryDialog({ openDialog, setOpenDialog, listOrderTimeLine }) {
  const handleClose = () => {
    setOpenDialog(false)
  }
  function genOrderHistory(listOrderTimeLine) {
    if (listOrderTimeLine[0]) {
      let tempStatus = listOrderTimeLine[0].statusBill
      return listOrderTimeLine.map((his, index) => {
        if (
          (his.statusBill === null || his.statusBill === 10) &&
          listOrderTimeLine[index - 1].statusBill !== null &&
          (his.statusBill === null || his.statusBill === 10) &&
          listOrderTimeLine[index - 1].statusBill !== 10
        ) {
          tempStatus = listOrderTimeLine[index - 1].statusBill
        }

        // Add a condition to treat statusBill === 10 as null
        if (his.statusBill === null || his.statusBill === 10) {
          return { ...his, statusBill: tempStatus }
        } else {
          return his
        }
      })
    }
  }

  return (
    <div className="hoa-don">
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        PaperProps={{
          style: {
            maxWidth: 'none',
          },
        }}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Lịch sử đơn hàng
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Thời gian</TableCell>
                  <TableCell align="center">Người chỉnh sửa</TableCell>
                  <TableCell align="center">Trạng thái HĐ</TableCell>
                  <TableCell align="center">Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {genOrderHistory(listOrderTimeLine).map((row, index) => (
                  <TableRow key={'dialog timeline' + row.id}>
                    <TableCell align="center">
                      {dayjs(row.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </TableCell>
                    <TableCell align="center">
                      {row.role === 2 ? 'Khách hàng - ' : 'Nhân viên - '}
                      {row.fullName} - {row.codeAccount}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        className={getStatusStyle(row.statusBill)}
                        label={getStatus(row.statusBill)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{row.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
