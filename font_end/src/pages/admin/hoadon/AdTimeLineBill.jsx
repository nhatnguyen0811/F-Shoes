import React from 'react'
import { FaRegFileAlt, FaTrash, FaTruck } from 'react-icons/fa'
import { MdPaid } from 'react-icons/md'
import { GiConfirmed } from 'react-icons/gi'
import { IoCloudDoneSharp } from 'react-icons/io5'
import { getStatus } from '../../../services/constants/statusHoaDon'
import { Box, Step, StepLabel, Stepper } from '@mui/material'
import dayjs from 'dayjs'

const AdTimeLineBill = (props) => {
  const { orderTimeLine } = props
  const getStatusInfo = (status) => {
    switch (status) {
      case 1:
        return {
          color: '#00CC00',
          icon: <FaRegFileAlt />,
        }
      case 2:
        return {
          color: '#FFD700',
          icon: <GiConfirmed />,
        }
      case 3:
        return {
          color: '#FF5733',
          icon: <FaTruck />,
        }
      case 4:
        return {
          color: '#FF9933',
          icon: <FaRegFileAlt />,
        }
      case 5:
        return {
          color: '#FFC733',
          icon: <MdPaid />,
        }
      case 6:
        return {
          color: '#FFAA33',
          icon: <FaRegFileAlt />,
        }
      case 7:
        return {
          color: '#FF1233',
          icon: <IoCloudDoneSharp />,
        }
      case 0:
        return {
          color: 'gray',
          icon: <FaTrash />,
        }
      default:
        return {
          color: '#000000',
          icon: <FaRegFileAlt />,
        }
    }
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={orderTimeLine.length - 1}>
        {orderTimeLine.map((order, index) => {
          const statusInfo = getStatusInfo(order.statusBill) // Lấy thông tin màu và biểu tượng
          return (
            <Step key={'timeline-order' + order.id}>
              <StepLabel
                icon={statusInfo.icon}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: statusInfo.color,
                  fontSize: '35px',
                  marginTop: '8px',
                  marginBottom: '20px',
                  minWidth: '48px',
                }}>
                {getStatus(order.statusBill)}
                <br />
                {dayjs(order.createdAt).format('DD-MM-YYYY HH:mm:ss')}
              </StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </Box>
  )
}

export default AdTimeLineBill
