import AutGuardAdmin from '../../layout/AutGuardAdmin'
import AdProductAdd from '../../pages/admin/sanpham/AdProductAdd'
import AdProductPage from '../../pages/admin/sanpham/AdProductPage'
import AdProductPageDetail from '../../pages/admin/sanpham/AdProductPageDetail'

const adProductRoute = [
  {
    path: '/admin/product',
    element: <AdProductPage />,
    loader: () => {
      document.title = 'Admin - Sản phẩm'
      return null
    },
  },
  {
    path: '/admin/product/:id',
    element: <AdProductPageDetail />,
    loader: () => {
      document.title = 'Admin - Sản phẩm chi tiết'
      return null
    },
  },
  {
    path: '/admin/product/add',
    element: (
      <AutGuardAdmin>
        <AdProductAdd />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Thêm sản phẩm'
      return null
    },
  },
]

export default adProductRoute
