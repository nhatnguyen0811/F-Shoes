export const getStatusProfile = (status) => {
  switch (status) {
    case 0:
      return 'Đã hủy'
    case 1:
      return 'Chờ xác nhận'
    case 2:
      return 'Đã xác nhận'
    case 3:
      return 'Đang vận chuyển'
    case 7:
      return 'Hoàn thành'
    default:
      console.error('Trạng thái hóa đơn không hợp lệ')
      break
  }
}
