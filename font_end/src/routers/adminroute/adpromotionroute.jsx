import AutGuardAdmin from '../../layout/AutGuardAdmin'
import AdPromotionAdd from '../../pages/admin/khuyenmai/AdPromotionAdd'
import AdPromotionPage from '../../pages/admin/khuyenmai/AdPromotionPage'
import AdPromotionDetail from '../../pages/admin/khuyenmai/AdpromotionDetail'

const adPromotionRoute = [
  {
    path: '/admin/promotion',
    element: (
      <AutGuardAdmin>
        <AdPromotionPage />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Đợi giảm giá'
      return null
    },
  },
  {
    path: '/admin/promotion/add',
    element: (
      <AutGuardAdmin>
        <AdPromotionAdd />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Thêm đợi giảm giá'
      return null
    },
  },
  {
    path: '/admin/promotion/get-one/:id',
    element: (
      <AutGuardAdmin>
        <AdPromotionDetail />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Đợi giảm giá chi tiết'
      return null
    },
  },
]

export default adPromotionRoute
