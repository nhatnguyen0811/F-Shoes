import AdBillDetail from '../../pages/admin/hoadon/AdBillDetail'
import AdBillPage from '../../pages/admin/hoadon/AdBillPage'

const adBillRoute = [
  {
    path: '/admin/bill',
    element: <AdBillPage />,
    loader: () => {
      document.title = 'Admin - Đơn hàng'
      return null
    },
  },
  {
    path: '/admin/bill-detail/:id',
    element: <AdBillDetail />,
    loader: () => {
      document.title = 'Admin - Chi tiết đơn hàng'
      return null
    },
  },
]

export default adBillRoute
