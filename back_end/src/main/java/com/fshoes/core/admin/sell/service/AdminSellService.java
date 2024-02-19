package com.fshoes.core.admin.sell.service;

import com.fshoes.core.admin.sanpham.model.respone.ProductMaxPriceResponse;
import com.fshoes.core.admin.sell.model.request.*;
import com.fshoes.core.admin.sell.model.response.*;
import com.fshoes.core.common.PageReponse;
import com.fshoes.entity.Bill;
import com.fshoes.entity.BillDetail;

import java.math.BigDecimal;
import java.util.List;

public interface AdminSellService {

    List<Bill> getAllBillTaoDonHang();

    Bill getOneBillByIdBill(String idBill);

    List<GetAllProductResponse> getAllProduct(FilterProductDetailRequest request);

    List<GetAllProductResponse> getAllProductCart();

    PageReponse<GetALlCustomerResponse> getAllCustomer(AdCustomerRequest request);

    List<GetProductDetailBillSellResponse> getProductDetailBillSell(String id);

    Bill createBill();


    Boolean deleteBill(String id);

    Boolean addBill(AddBillRequest request, String id);

    Boolean addAdressBill(AdAddressBillRequest request, String id);

    Bill PayOrder(AddBillRequest request, String id);

    BillDetail addBillDetail(CreateBillRequest request, String id);

    BillDetail addBillDetailByIdProduct(String idProductDetail, String id);

    List<CartDetailResponse> getCartDetail();

    List<GetSizeResponse> getListSize();

    List<GetColorResponse> getListColor();

    GetAmountProductResponse getAmount(String id);

    Boolean updateQuantityProductDetail(String idPrDetail, Integer quantity);

    Boolean rollBackQuantityProductDetail(String idBill, String idPrDetail);

    Boolean increaseQuantityBillDetail(String idBillDetail, String idPrDetail);

    Boolean decreaseQuantityBillDetail(String idBillDetail, String idPrDetail);

    Boolean inputQuantityBillDetail(String idBillDetail, String idProDetail, Integer quantity);

    List<ProductMaxPriceResponse> getMaxPriceProductId();

    Boolean deleteProductsDetail(String idBill, List<String> idPrDetail);

    GetAllProductResponse getProduct(String id);

    List<PayOrderResponse> getPayOrder(String idBill);

    Boolean deleteTransaction(String idBill);

    BigDecimal getTotalMoneyPayOrder(String idBill);

    AdminMinMaxPrice getMinMaxPrice();
}
