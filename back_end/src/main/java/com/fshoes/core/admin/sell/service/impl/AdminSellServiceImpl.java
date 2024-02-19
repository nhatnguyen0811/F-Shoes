package com.fshoes.core.admin.sell.service.impl;

import com.fshoes.core.admin.hoadon.model.respone.HDProductDetailResponse;
import com.fshoes.core.admin.hoadon.repository.HDBillHistoryRepository;
import com.fshoes.core.admin.hoadon.repository.HDBillRepository;
import com.fshoes.core.admin.hoadon.repository.HDProductDetailRepository;
import com.fshoes.core.admin.khachhang.repository.KhachHangRepository;
import com.fshoes.core.admin.sanpham.model.respone.ProductMaxPriceResponse;
import com.fshoes.core.admin.sell.model.request.AdAddressBillRequest;
import com.fshoes.core.admin.sell.model.request.AdCustomerRequest;
import com.fshoes.core.admin.sell.model.request.AddBillRequest;
import com.fshoes.core.admin.sell.model.request.CreateBillRequest;
import com.fshoes.core.admin.sell.model.request.FilterProductDetailRequest;
import com.fshoes.core.admin.sell.model.response.AdminMinMaxPrice;
import com.fshoes.core.admin.sell.model.response.CartDetailResponse;
import com.fshoes.core.admin.sell.model.response.GetALlCustomerResponse;
import com.fshoes.core.admin.sell.model.response.GetAllProductResponse;
import com.fshoes.core.admin.sell.model.response.GetAmountProductResponse;
import com.fshoes.core.admin.sell.model.response.GetColorResponse;
import com.fshoes.core.admin.sell.model.response.GetProductDetailBillSellResponse;
import com.fshoes.core.admin.sell.model.response.GetSizeResponse;
import com.fshoes.core.admin.sell.model.response.PayOrderResponse;
import com.fshoes.core.admin.sell.repository.AdminBillDetailRepositoty;
import com.fshoes.core.admin.sell.repository.AdminBillRepository;
import com.fshoes.core.admin.sell.repository.AdminCreateCartRepository;
import com.fshoes.core.admin.sell.repository.AdminProductDetailRepository;
import com.fshoes.core.admin.sell.repository.AdminSellGetCustomerRepository;
import com.fshoes.core.admin.sell.repository.AdminSellGetProductRepository;
import com.fshoes.core.admin.sell.repository.AdminTransactionRepository;
import com.fshoes.core.admin.sell.service.AdminSellService;
import com.fshoes.core.admin.voucher.model.respone.AdCustomerVoucherRespone;
import com.fshoes.core.admin.voucher.repository.AdCustomerVoucherRepository;
import com.fshoes.core.admin.voucher.repository.AdVoucherRepository;
import com.fshoes.core.common.PageReponse;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Account;
import com.fshoes.entity.Bill;
import com.fshoes.entity.BillDetail;
import com.fshoes.entity.BillHistory;
import com.fshoes.entity.ProductDetail;
import com.fshoes.entity.Transaction;
import com.fshoes.entity.Voucher;
import com.fshoes.infrastructure.constant.Message;
import com.fshoes.infrastructure.exception.RestApiException;
import com.fshoes.repository.ProductDetailRepository;
import com.fshoes.repository.TransactionRepository;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminSellServiceImpl implements AdminSellService {

    @Autowired
    private AdminSellGetProductRepository getProductRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private AdminProductDetailRepository adminproductDetailRepository;

    @Autowired
    private AdminSellGetCustomerRepository getCustomerRepository;
    @Autowired
    private TransactionRepository transactionRepository;


    @Autowired
    private AdminCreateCartRepository cartRepository;

    @Autowired
    private AdminBillDetailRepositoty billDetailRepositoty;

    @Autowired
    private AdminProductDetailRepository getProduct;

    @Autowired
    private AdminBillRepository billRepository;

    @Autowired
    private AdVoucherRepository voucherRepository;

    @Autowired
    private AdCustomerVoucherRepository customerVoucherRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private AdminTransactionRepository adminTransactionRepository;

    @Autowired
    private HDBillHistoryRepository billHistoryRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private HDBillRepository hdBillRepository;

    @Autowired
    private HDProductDetailRepository hdPoductDetailRepository;

    @Autowired
    private UserLogin userLogin;

    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void cronJobCheckOrder() {
        List<Bill> listBill = billRepository.getAllBillTaoDonHang();
        List<String> idBills = listBill.stream().map(Bill::getId).collect(Collectors.toList());

        List<BillDetail> listBillDetail = billDetailRepositoty.getAllBillDetails(idBills);
        List<Transaction> listTransaction = transactionRepository.getAllTransactions(idBills);
        List<BillHistory> listBillHistory = billHistoryRepository.getAllBillHistorys(idBills);

        billDetailRepositoty.deleteAll(listBillDetail);
        transactionRepository.deleteAll(listTransaction);
        billHistoryRepository.deleteAll(listBillHistory);
        billRepository.deleteAll(listBill);
    }


    @Override
    public PageReponse<GetALlCustomerResponse> getAllCustomer(AdCustomerRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        return new PageReponse<>(getCustomerRepository.FindKhachHang(pageable, request));
    }

    @Override
    public List<GetProductDetailBillSellResponse> getProductDetailBillSell(String id) {
        return getProduct.getlistProductBilllSell(id);
    }


    @Override
    public Bill createBill() {
        Bill bill = new Bill();
        bill.setCode(generateUniqueBillCode());
        bill.setType(0);
        bill.setStatus(8);
        billRepository.save(bill);

        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill);
        billHistory.setStatusBill(8);
        billHistoryRepository.save(billHistory);
        return bill;
    }


    @Override
    public Boolean deleteBill(String id) {
        try {
            Bill bill = billRepository.findById(id).get();
            List<String> listIdProductDetail = billDetailRepositoty.findByProductDetailBYBillId(id);
            for (String idPd : listIdProductDetail) {
                Optional<ProductDetail> optionalProductDetail = productDetailRepository.findById(idPd);
                if (optionalProductDetail.isPresent()) {
                    ProductDetail productDetail = optionalProductDetail.get();
                    BillDetail billDetail = billDetailRepositoty.findByProductIdAndBillId(productDetail.getId(), id);
                    productDetail.setAmount(productDetail.getAmount() + billDetail.getQuantity());
                } else {
                    continue;
                }
            }
            List<String> billDetail = billDetailRepositoty.findByBillId(id);
            for (String bd : billDetail) {
                billDetailRepositoty.deleteById(bd);
            }

            List<String> billHistory = billHistoryRepository.getIdHistoryByIdBill(id);
            for (String bh : billHistory) {
                billHistoryRepository.deleteById(bh);
            }
            billRepository.delete(bill);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Boolean addBill(AddBillRequest request, String id) {
        try {
            Bill bill = billRepository.findById(id).orElseThrow(() -> {
                throw new RestApiException(Message.API_ERROR);
            });
            if (request.getIdVourcher() == null) {
                bill.setVoucher(null);
            } else {
                Voucher voucher = voucherRepository.findById(request.getIdVourcher()).orElse(null);
                assert voucher != null;
                voucher.setQuantity(voucher.getQuantity() - 1);
                voucherRepository.save(voucher);
                bill.setVoucher(voucher);
                AdCustomerVoucherRespone adCustomerVoucherRespone = voucherRepository.getOneCustomerVoucherByIdVoucherAndIdCustomer(voucher.getId(), request.getIdCustomer());
                if (adCustomerVoucherRespone != null) {
                    customerVoucherRepository.deleteById(adCustomerVoucherRespone.getId());
                }
            }

            if (request.getIdCustomer() == null) {
                bill.setCustomer(null);
            } else {
                Account account = khachHangRepository.findById(request.getIdCustomer()).orElse(null);
                assert account != null;
                bill.setCustomer(account);
            }
            bill.setNote(request.getNote());
            bill.setAddress(request.getAddress());
            bill.setPhoneNumber(request.getPhoneNumber());
            bill.setFullName(request.getFullName());
            bill.setTotalMoney(request.getTotalMoney());
            bill.setMoneyShip(request.getMoneyShip());
            bill.setMoneyReduced(request.getMoneyReduce());
            bill.setMoneyAfter(request.getMoneyAfter());
            bill.setDesiredReceiptDate(request.getDesiredReceiptDate());
            if (request.getType() == 0) {
                bill.setStatus(7);
            } else {
                bill.setStatus(1);
            }
            bill.setReceivingMethod(request.getReceivingMethod());
            if (request.getType() == 0) {
                bill.setCompleteDate(Calendar.getInstance().getTimeInMillis());
            } else {
                bill.setCompleteDate(null);
            }
            bill.setPercentMoney(request.getPercentMoney());
            billRepository.save(bill);
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill);
            if (request.getType() == 0) {
                billHistory.setStatusBill(7);
            } else {
                billHistory.setStatusBill(1);
            }
            billHistoryRepository.save(billHistory);
            // lấy list bill detail theo bill
            //lay ra dá trấnc theo id bill
            List<Transaction> listTransaction = transactionRepository.getTransactions(bill.getId());
            if (!listTransaction.isEmpty()){
                BigDecimal totalKhach = listTransaction.stream()
                        .map(Transaction::getTotalMoney)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                if (totalKhach.longValue() > bill.getMoneyAfter().longValue()){
                    Transaction newTran = new Transaction();
                    newTran.setTotalMoney(totalKhach);
                    newTran.setStatus(0);
                    newTran.setBill(bill);
                    newTran.setType(1);
                    newTran.setNote("Trả tiền thừa khách hàng");
                    newTran.setPaymentMethod(1);
                    newTran.setAccount(userLogin.getUserLogin());
                    transactionRepository.save(newTran);
                }
            }

            List<BillDetail> billDetails = billDetailRepositoty.getBillDetailsByBillId(bill.getId());
            billDetails.forEach((billDetail -> {
                ProductDetail productDetail = productDetailRepository.findById(billDetail.getProductDetail().getId()).get();
                HDProductDetailResponse hdProductDetailResponse = hdPoductDetailRepository.getPrdVsKM(productDetail.getId());
                if (hdProductDetailResponse == null) {
                    // nếu sản phẩm không có khuyến mại => set lại đơn giá trong bill detail là giá của sp
                    billDetail.setPrice(productDetail.getPrice());
                    billDetailRepositoty.save(billDetail);
                } else {
                    // nếu có KM: hàm getPrdVsKM(String id) sẽ trả ra id prd, giá trị của KM, giá của sản phẩm
                    // tính lại tiền được KM và set lại đơn giá cho bill detail
                    BigDecimal valueKM = (productDetail.getPrice().multiply(BigDecimal.valueOf(hdProductDetailResponse.getValue()))).divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
                    BigDecimal priceAfterKM = productDetail.getPrice().subtract(valueKM);
                    billDetail.setPrice(priceAfterKM);
                    billDetailRepositoty.save(billDetail);
                }
            }));
            messagingTemplate.convertAndSend("/topic/bill-update", hdBillRepository.findBill(bill.getId()));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Boolean addAdressBill(AdAddressBillRequest request, String id) {
        try {
            Bill bill = billRepository.findById(id).orElseThrow(() -> {
                throw new RestApiException(Message.API_ERROR);
            });
            if (request.getIdCustomer() != null) {
                Account account = khachHangRepository.findById(request.getIdCustomer()).orElse(null);
                assert account != null;
                bill.setCustomer(account);
            }
            if (request.getAddress() != null) {
                bill.setAddress(request.getAddress());
            }
            if (request.getPhoneNumber() != null) {
                bill.setPhoneNumber(request.getPhoneNumber());
            }
            if (request.getFullName() != null) {
                bill.setFullName(request.getFullName());
            }
            billRepository.save(bill);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Bill PayOrder(AddBillRequest request, String id) {

        Bill bill = billRepository.findById(id).orElseThrow(() -> {
            throw new RestApiException(Message.API_ERROR);
        });
        if (request.getIdVourcher() == null) {
            bill.setVoucher(null);
        } else {
            Voucher voucher = voucherRepository.findById(request.getIdVourcher()).orElse(null);
            assert voucher != null;
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
            bill.setVoucher(voucher);
            AdCustomerVoucherRespone adCustomerVoucherRespone = voucherRepository.getOneCustomerVoucherByIdVoucherAndIdCustomer(voucher.getId(), request.getIdCustomer());
            if (adCustomerVoucherRespone != null) {
                customerVoucherRepository.deleteById(adCustomerVoucherRespone.getId());
            }
        }

        if (request.getIdCustomer() == null) {
            bill.setCustomer(null);
        } else {
            Account account = khachHangRepository.findById(request.getIdCustomer()).orElse(null);
            assert account != null;
            bill.setCustomer(account);
        }
        ;
        bill.setNote(request.getNote());
        bill.setCustomerAmount(request.getCustomerAmount());
        bill.setReceivingMethod(request.getReceivingMethod());
        bill.setPercentMoney(request.getPercentMoney());
        billRepository.save(bill);

        Transaction transaction = new Transaction();
        transaction.setBill(bill);
        transaction.setTransactionCode(request.getTransactionCode());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setType(0);
        transaction.setStatus(0);
        transaction.setTotalMoney(request.getTotalMoney());
        transaction.setAccount(userLogin.getUserLogin());
        transaction.setNote(request.getNoteTransaction());
        transactionRepository.save(transaction);


//        messagingTemplate.convertAndSend("/topic/bill-update", hdBillRepository.findBill(bill.getId()));
        return bill;
    }


    @Override
    public BillDetail addBillDetail(CreateBillRequest request, String id) {
        BillDetail existingBillDetail = billDetailRepositoty.findByProductIdAndBillId(
                request.getProductDetailId(),
                request.getBillId()
        );

        if (existingBillDetail != null) {
            int newQuantity = existingBillDetail.getQuantity() + request.getQuantity();
            existingBillDetail.setQuantity(newQuantity);
            return billDetailRepositoty.save(existingBillDetail);
        } else {
            ProductDetail productDetail = productDetailRepository.findById(request.getProductDetailId()).orElse(null);
            Bill bill = billRepository.findById(request.getBillId()).orElse(null);

            BillDetail billDetail = new BillDetail();
            billDetail.setQuantity(request.getQuantity());
            billDetail.setProductDetail(productDetail);
            billDetail.setPrice(request.getPrice());
            billDetail.setBill(bill);
            billDetail.setStatus(0);


            return billDetailRepositoty.save(billDetail);
        }


    }

    @Override
    public BillDetail addBillDetailByIdProduct(String idProductDetail, String id) {
        BillDetail existingBillDetail = billDetailRepositoty.findByProductIdAndBillId(
                idProductDetail,
                id
        );

        if (existingBillDetail != null) {
            int newQuantity = existingBillDetail.getQuantity() + 1;
            existingBillDetail.setQuantity(newQuantity);
            return billDetailRepositoty.save(existingBillDetail);
        } else {
            ProductDetail productDetail = productDetailRepository.findById(idProductDetail).orElse(null);
            Bill bill = billRepository.findById(id).orElse(null);
            BillDetail billDetail = new BillDetail();
            billDetail.setQuantity(1);
            billDetail.setProductDetail(productDetail);
            billDetail.setPrice(productDetail.getPrice());
            billDetail.setBill(bill);
            billDetail.setStatus(0);
            return billDetailRepositoty.save(billDetail);
        }
    }


    @Override
    public List<CartDetailResponse> getCartDetail() {
        return null;
    }

    @Override
    public List<GetSizeResponse> getListSize() {
        return getProduct.getlistSize();
    }

    @Override
    public List<GetColorResponse> getListColor() {
        return getProduct.getlistColor();
    }

    @Override
    public GetAmountProductResponse getAmount(String id) {
        return getProduct.getAmount(id);
    }

    @Override
    public Boolean updateQuantityProductDetail(String idPrDetail, Integer quantity) {
        Optional<ProductDetail> optionalProductDetail = productDetailRepository.findById(idPrDetail);
        if (optionalProductDetail.isPresent()) {
            ProductDetail productDetail = optionalProductDetail.get();
            productDetail.setAmount(productDetail.getAmount() - quantity);
            productDetailRepository.save(productDetail);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Boolean rollBackQuantityProductDetail(String idBill, String idPrDetail) {
        Optional<ProductDetail> optionalProductDetail = productDetailRepository.findById(idPrDetail);
        if (optionalProductDetail.isPresent()) {
            ProductDetail productDetail = optionalProductDetail.get();
            Integer quantity = billDetailRepositoty.quantityProductDetail(idBill, productDetail.getId());
            productDetail.setAmount(productDetail.getAmount() + quantity);
            productDetailRepository.save(productDetail);
            String idBillDetail = billDetailRepositoty.idBillDetailProductDetail(idBill, productDetail.getId());
            billDetailRepositoty.deleteById(idBillDetail);
            return true;
        } else {
            return false;
        }
    }


    @Override
    public Boolean increaseQuantityBillDetail(String idBillDetail, String idPrDetail) {
        Optional<BillDetail> optionalBillDetail = billDetailRepositoty.findById(idBillDetail);
        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            billDetail.setQuantity(billDetail.getQuantity() + 1);
            billDetailRepositoty.save(billDetail);
            Optional<ProductDetail> optionalProductDetail = productDetailRepository.findById(idPrDetail);
            if (optionalProductDetail.isPresent()) {
                ProductDetail productDetail = optionalProductDetail.get();
                productDetail.setAmount(productDetail.getAmount() - 1);
                productDetailRepository.save(productDetail);
            } else {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Boolean decreaseQuantityBillDetail(String idBillDetail, String idPrDetail) {
        Optional<BillDetail> optionalBillDetail = billDetailRepositoty.findById(idBillDetail);
        if (optionalBillDetail.isPresent()) {
            BillDetail billDetail = optionalBillDetail.get();
            billDetail.setQuantity(billDetail.getQuantity() - 1);
            billDetailRepositoty.save(billDetail);
            Optional<ProductDetail> optionalProductDetail = productDetailRepository.findById(idPrDetail);
            if (optionalProductDetail.isPresent()) {
                ProductDetail productDetail = optionalProductDetail.get();
                productDetail.setAmount(productDetail.getAmount() + 1);
                productDetailRepository.save(productDetail);
            } else {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    @Synchronized
    public Boolean inputQuantityBillDetail(String idBillDetail, String idProDetail, Integer quantity) {
        Optional<BillDetail> optionalBillDetail = billDetailRepositoty.findById(idBillDetail);
        Optional<ProductDetail> optionalProductDetail = productDetailRepository.findById(idProDetail);
        if (optionalProductDetail.isPresent()) {
            if (optionalBillDetail.isPresent()) {
                ProductDetail productDetail = optionalProductDetail.get();
                BillDetail billDetail1 = optionalBillDetail.get();
                productDetail.setAmount(productDetail.getAmount() + billDetail1.getQuantity() - quantity);
                billDetail1.setQuantity(quantity);
                billDetailRepositoty.save(billDetail1);
                productDetailRepository.save(productDetail);
            } else {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<ProductMaxPriceResponse> getMaxPriceProductId() {
        return getProduct.getProductMaxPrice();
    }

    @Override
    public Boolean deleteProductsDetail(String idBill, List<String> idPrDetail) {
        try {
            for (String idpd : idPrDetail) {
                Optional<ProductDetail> optionalProductDetail = productDetailRepository.findById(idpd);
                if (optionalProductDetail.isPresent()) {
                    ProductDetail productDetail = optionalProductDetail.get();
                    Integer quantity = billDetailRepositoty.quantityProductDetail(idBill, productDetail.getId());
                    productDetail.setAmount(productDetail.getAmount() + quantity);
                    productDetailRepository.save(productDetail);
                    String idBillDetail = billDetailRepositoty.idBillDetailProductDetail(idBill, productDetail.getId());
                    billDetailRepositoty.deleteById(idBillDetail);
                } else {
                    continue;
                }
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    @Override
    public List<Bill> getAllBillTaoDonHang() {
        return billRepository.getAllBillTaoDonHang();
    }

    @Override
    public Bill getOneBillByIdBill(String idBill) {
        return billRepository.findById(idBill).orElse(null);
    }

    @Override
    public List<GetAllProductResponse> getAllProduct(FilterProductDetailRequest request) {
        return adminproductDetailRepository.getAllProduct(request);
    }

    @Override
    public GetAllProductResponse getProduct(String id) {
        return getProductRepository.getProduct(id);
    }

    @Override
    public List<PayOrderResponse> getPayOrder(String idBill) {
        return billRepository.getPayOrder(idBill);
    }

    @Override
    public Boolean deleteTransaction(String idBill) {
        try {
//            Transaction getONe = adminTransactionRepository.getTransactionByIdBill(idBill);
            transactionRepository.deleteById(idBill);
            return true;
        } catch (Exception e) {
            return false;
        }

    }

    @Override
    public BigDecimal getTotalMoneyPayOrder(String idBill) {
        return adminTransactionRepository.getTotalMoneyPayOrder(idBill);
    }

    @Override
    public AdminMinMaxPrice getMinMaxPrice() {
        return getProductRepository.getMinMaxPriceProductAdmin();
    }

    @Override
    public List<GetAllProductResponse> getAllProductCart() {
        return getProductRepository.getAllProductCart();
    }

    private String generateUniqueBillCode() {
        String baseCode = "HD";
        int counter = 1;
        String uniqueCode = baseCode + counter;

        while (billRepository.existsByCode(uniqueCode)) {
            counter++;
            uniqueCode = baseCode + counter;
        }

        return uniqueCode;

    }
}
