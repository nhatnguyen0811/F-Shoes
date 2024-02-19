import AdCustomerAdd from '../../pages/admin/khachhang/AdCustomerAdd'
import AdCustomerDetail from '../../pages/admin/khachhang/AdCustomerDetail'
import AdCustomerPage from '../../pages/admin/khachhang/AdCustomerPage'

const adCustomerRoute = [
  {
    path: '/admin/customer',
    element: <AdCustomerPage />,
    loader: () => {
      document.title = 'Admin - Khách hàng'
      return null
    },
  },
  {
    path: '/admin/customer/add',
    element: <AdCustomerAdd />,
    loader: () => {
      document.title = 'Admin - Thêm khách hàng'
      return null
    },
  },
  {
    path: '/admin/customer/getOne/:id',
    element: <AdCustomerDetail />,
    loader: () => {
      document.title = 'Admin - Khách hàng chi tiết'
      return null
    },
  },
]

export default adCustomerRoute
