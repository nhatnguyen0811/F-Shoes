import AutGuardAdmin from '../../layout/AutGuardAdmin'
import AdCategoryPage from '../../pages/admin/theloai/AdCategoryPage'

const adCategoryRoute = [
  {
    path: '/admin/category',
    element: (
      <AutGuardAdmin>
        <AdCategoryPage />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Thể loại'
      return null
    },
  },
]

export default adCategoryRoute
