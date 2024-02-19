import AutGuardAdmin from '../../layout/AutGuardAdmin'
import AdSolePage from '../../pages/admin/sole/AdSolePage'

const adSoleRoute = [
  {
    path: '/admin/sole',
    element: (
      <AutGuardAdmin>
        <AdSolePage />
      </AutGuardAdmin>
    ),
    loader: () => {
      document.title = 'Admin - Đế giày'
      return null
    },
  },
]

export default adSoleRoute
