import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slices/accountSlice'
import addressReducer from './slices/addressSlice'
import billDetailReducer from './slices/billDetailSlice'
import billHistoryReducer from './slices/billHistorySlice'
import billReducer from './slices/billSlice'
import brandReducer from './slices/brandSlice'
import cartDetailReducer from './slices/cartDetailSlice'
import cartReducer from './slices/cartSlice'
import categoryReducer from './slices/categorySlice'
import colorReducer from './slices/colorSilce'
import customerVoucherReducer from './slices/customerVoucherSlice'
import imageReducer from './slices/imageSlice'
import materialReducer from './slices/materialSlice'
import productDetailReducer from './slices/productDetailSlice'
import productPromotionReducer from './slices/productPromotionSlice'
import productReducer from './slices/productSlice'
import promotionReducer from './slices/promotionSlice'
import sellReducer from './slices/sellSlice'
import sizeReducer from './slices/sizeSlice'
import appReducer from './slices/appSlice'
import soleReducer from './slices/soleSlice'
import transactionReducer from './slices/transactionSlice'
import voucherReducer from './slices/voucherSlice'
import checkoutReducer from './slices/checkoutSlice'
import loadingReducer from './slices/loadingSlice'
import userSlice from './slices/userSlice'
import userAdminSlice from './slices/userAdminSlice'

const store = configureStore({
  reducer: {
    account: accountReducer,
    address: addressReducer,
    billDetail: billDetailReducer,
    billHistory: billHistoryReducer,
    bill: billReducer,
    brand: brandReducer,
    cartDetail: cartDetailReducer,
    cart: cartReducer,
    category: categoryReducer,
    color: colorReducer,
    customerVoucher: customerVoucherReducer,
    image: imageReducer,
    material: materialReducer,
    productDetail: productDetailReducer,
    productPromotion: productPromotionReducer,
    product: productReducer,
    promotion: promotionReducer,
    sell: sellReducer,
    size: sizeReducer,
    app: appReducer,
    sole: soleReducer,
    transaction: transactionReducer,
    voucher: voucherReducer,
    checkout: checkoutReducer,
    loading: loadingReducer,
    user: userSlice,
    userAdmin: userAdminSlice,
  },
})
export default store
