import AutGuardAdmin from '../../layout/AutGuardAdmin'
import AdVoucherAdd from '../../pages/admin/voucher/AdVoucherAdd'
import AdVoucherDetail from '../../pages/admin/voucher/AdVoucherDetail'
import AdVoucherPage from '../../pages/admin/voucher/AdVoucherPage'

const adVoucherRoute = [
  {
    path: '/admin/voucher',
    element: (
      <AutGuardAdmin>
        <AdVoucherPage />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Phiếu giảm giá'
      return null
    },
  },
  {
    path: '/admin/voucher/add',
    element: (
      <AutGuardAdmin>
        <AdVoucherAdd />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Thêm phiếu giảm giá'
      return null
    },
  },
  {
    path: '/admin/voucher/:id/detail',
    element: (
      <AutGuardAdmin>
        <AdVoucherDetail />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Phiếu giảm giá chi tiết'
      return null
    },
  },
]

export default adVoucherRoute
