import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Box } from '@mui/material'
import { getStatus } from '../../../services/constants/statusHoaDon'
import './Dashboard.css'

ChartJS.register()

export default function LineChartDashBoard(props) {
  const { dataBieuDo } = props
  const totalQuantity = dataBieuDo.reduce((total, item) => total + item.soLuong, 0)

  const rainbowColors = [
    'rgba(255, 0, 0, 0.7)', // Red
    'rgba(255, 69, 0, 0.7)', // Red-Orange
    'rgba(255, 140, 0, 0.7)', // Dark Orange
    'rgba(255, 215, 0, 0.7)', // Gold
    'rgba(173, 255, 47, 0.7)', // Green-Yellow
    'rgba(0, 255, 0, 0.7)', // Lime Green
    'rgba(0, 191, 255, 0.7)', // Sky Blue
    'rgba(0, 128, 0, 0.7)', // Green
    'rgba(148, 0, 211, 0.7)', // Violet
  ]

  const data = {
    labels: dataBieuDo.map(
      (d) =>
        getStatus(d.status) +
        ' - ' +
        (d.soLuong === 0 ? 0 : ((d.soLuong / totalQuantity) * 100).toFixed(2)) +
        '% ',
    ),
    datasets: [
      {
        label: 'Số lượng',
        data: dataBieuDo.map((d) => d.soLuong),
        backgroundColor: rainbowColors,
        borderColor: rainbowColors.map((color) => color.replace('0.7', '1')),
        borderWidth: 1,
      },
    ],
  }

  const legendOptions = {
    display: true,
    position: 'bottom',
    align: 'start',
  }

  const options = {
    plugins: {
      legend: legendOptions,
    },
    layout: {
      padding: {
        bottom: 10,
      },
    },
    aspectRatio: 1,
    maintainAspectRatio: false,
  }

  return (
    <Box mt={2} width={'99%'} height={400}>
      {dataBieuDo.filter((d) => d.soLuong > 0).length > 0 ? (
        <Pie
          className="legend-container"
          style={{ paddingTop: '20px' }}
          data={data}
          options={options}
        />
      ) : (
        <div
          style={{
            height: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <img width={'400px'} src={require('../../../assets/image/no-data.png')} alt="No-data" />
        </div>
      )}
    </Box>
  )
}
