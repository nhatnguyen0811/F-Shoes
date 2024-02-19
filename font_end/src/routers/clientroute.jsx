import Cart from '../pages/client/Cart'
import Login from '../pages/client/Login'
import Checkout from '../pages/client/Checkout'
import DetailProduct from '../pages/client/DetailProduct'
import Home from '../pages/client/Home'
import Product from '../pages/client/Product'
import News from '../pages/client/News'
import Contact from '../pages/client/Contact'
import AboutUs from '../pages/client/AboutUs'
import Profile from '../pages/client/profile/Profile'
import MyVoucher from '../pages/client/MyVoucher'
import UserProfile from '../pages/client/profile/UserProfile'
import AddressUser from '../pages/client/profile/AddressUser'
import Order from '../pages/client/profile/Order'
import OrderDetail from '../pages/client/profile/OrderDetail'
import Tracking from '../pages/client/Tracking'
import TrackingDetail from '../pages/client/TrackingDetail'
import ForgotPassword from '../pages/client/ForgotPassword'
import ChangePassword from '../pages/client/profile/ChangePassword'
import ReturnPolicy from '../pages/client/ReturnPolicy'

const clientRoute = [
  { path: '/home', element: <Home />, index: true },
  {
    path: '/products',
    element: <Product />,
    loader: () => {
      document.title = 'F-Shoes - Sản phẩm'
      return null
    },
  },
  {
    path: '/news',
    element: <News />,
    loader: () => {
      document.title = 'F-Shoes - Tin tức'
      return null
    },
  },
  {
    path: '/contact',
    element: <Contact />,
    loader: () => {
      document.title = 'F-Shoes - Liên hệ'
      return null
    },
  },
  {
    path: '/about-us',
    element: <AboutUs />,
    loader: () => {
      document.title = 'F-Shoes - Giới thiệu'
      return null
    },
  },
  {
    path: '/cart',
    element: <Cart />,
    loader: () => {
      document.title = 'F-Shoes - Giỏ hàng'
      return null
    },
  },
  {
    path: '/login',
    element: <Login />,
    loader: () => {
      document.title = 'F-Shoes - Đăng nhập'
      return null
    },
  },
  {
    path: '/checkout',
    element: <Checkout />,
    loader: () => {
      document.title = 'F-Shoes - Thanh toán'
      return null
    },
  },
  {
    path: '/profile',
    element: <Profile />,
    loader: () => {
      document.title = 'F-Shoes - Thông tin cá nhân'
      return null
    },
  },
  {
    path: '/return-policy-client',
    element: <ReturnPolicy />,
    loader: () => {
      document.title = 'F-Shoes - Chính sách trả hàng'
      return null
    },
  },
  // { path: `/profile/get-by-idBill/:id`, element: <OrderDetail /> },
  {
    path: `/tracking/:code`,
    element: <TrackingDetail />,
    loader: () => {
      document.title = 'F-Shoes - Tra cứu đơn hàng'
      return null
    },
  },
  {
    path: `/tracking`,
    element: <Tracking />,
    loader: () => {
      document.title = 'F-Shoes - Tra cứu đơn hàng'
      return null
    },
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    loader: () => {
      document.title = 'F-Shoes - Quên mật khẩu'
      return null
    },
  },
  {
    path: '/profile/change-password',
    element: (
      <Profile>
        <ChangePassword />
      </Profile>
    ),
    loader: () => {
      document.title = 'F-Shoes - Đổi mật khẩu'
      return null
    },
  },
  {
    path: `/profile/get-by-idBill/:id`,
    element: (
      <Profile>
        <OrderDetail />
      </Profile>
    ),
    loader: () => {
      document.title = 'F-Shoes - Chi tiết đơn hàng'
      return null
    },
  },

  {
    path: '/profile/user',
    element: (
      <Profile>
        <UserProfile />
      </Profile>
    ),
    loader: () => {
      document.title = 'F-Shoes - Thông tin'
      return null
    },
  },
  {
    path: '/profile/order',
    element: (
      <Profile>
        <Order />
      </Profile>
    ),
    loader: () => {
      document.title = 'F-Shoes - Đơn hàng'
      return null
    },
  },
  {
    path: '/profile/address',
    element: (
      <Profile>
        <AddressUser />
      </Profile>
    ),
    loader: () => {
      document.title = 'F-Shoes - Địa chỉ'
      return null
    },
  },

  {
    path: '/profile/my-voucher',
    element: (
      <Profile>
        <MyVoucher />
      </Profile>
    ),
    loader: () => {
      document.title = 'F-Shoes - Phiếu giảm giá'
      return null
    },
  },
  {
    path: '/product/:id',
    element: <DetailProduct />,
    loader: () => {
      document.title = 'F-Shoes - Chi tiết sản phẩm'
      return null
    },
  },
]

export default clientRoute
