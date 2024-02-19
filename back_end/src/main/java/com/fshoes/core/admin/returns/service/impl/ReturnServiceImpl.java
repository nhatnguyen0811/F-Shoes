package com.fshoes.core.admin.returns.service.impl;

import com.fshoes.core.admin.returns.model.request.GetBillRequest;
import com.fshoes.core.admin.returns.model.request.ReturnDetailRequest;
import com.fshoes.core.admin.returns.model.request.ReturnRequest;
import com.fshoes.core.admin.returns.model.response.BillDetailReturnResponse;
import com.fshoes.core.admin.returns.repository.BillDetailReturnRepository;
import com.fshoes.core.admin.returns.repository.BillReturnRepository;
import com.fshoes.core.admin.returns.service.ReturnService;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.*;
import com.fshoes.infrastructure.constant.StatusBillDetail;
import com.fshoes.infrastructure.exception.RestApiException;
import com.fshoes.repository.BillHistoryRepository;
import com.fshoes.repository.ProductDetailRepository;
import com.fshoes.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReturnServiceImpl implements ReturnService {
    @Autowired
    private BillReturnRepository billRepository;
    @Autowired
    private BillDetailReturnRepository billDetailRepository;
    @Autowired
    private BillHistoryRepository billHistoryRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private UserLogin userLogin;
    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public String getBill(GetBillRequest request) {
        Long currentDate = Calendar.getInstance().getTimeInMillis();
        Calendar sevenDaysAgo = Calendar.getInstance();
        sevenDaysAgo.setTimeInMillis(currentDate);
        sevenDaysAgo.add(Calendar.DAY_OF_YEAR, -7);
        Long sevenDaysAgoTimestamp = sevenDaysAgo.getTimeInMillis();
        return billRepository.getBillReturn(request.getCodeBill(), sevenDaysAgoTimestamp);
    }

    @Override
    public Bill getBillId(String id) {
        Long currentDate = Calendar.getInstance().getTimeInMillis();
        Calendar sevenDaysAgo = Calendar.getInstance();
        sevenDaysAgo.setTimeInMillis(currentDate);
        sevenDaysAgo.add(Calendar.DAY_OF_YEAR, -7);
        Long sevenDaysAgoTimestamp = sevenDaysAgo.getTimeInMillis();
        return billRepository.findBillId(id, sevenDaysAgoTimestamp, StatusBillDetail.TRA_HANG).orElse(null);
    }

    @Override
    public List<BillDetailReturnResponse> getBillDetail(String id) {
        return billDetailRepository.getBillDetailReturn(id);
    }

    @Override
    public Boolean acceptReturn(ReturnRequest request) {
        try {
            Bill bill = billRepository.findById(request.getIdBill()).orElseThrow(() -> new RestApiException("Hóa đơn không tồn tại"));
            BigDecimal returnMoney = new BigDecimal(request.getReturnMoney());
            bill.setTotalMoney(bill.getTotalMoney().subtract(returnMoney));
            bill.setMoneyAfter(bill.getMoneyAfter().subtract(returnMoney));
            bill.setStatus(9);
            billRepository.save(bill);

            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill);
            billHistory.setStatusBill(9);
            billHistory.setAccount(userLogin.getUserLogin());
            billHistory.setNote("Hoàn sản phẩm: " +
                                request.getListDetail().stream()
                                        .map(e -> "x" + e.getQuantity() + " " + e.getName())
                                        .collect(Collectors.joining(", ")));
            billHistoryRepository.save(billHistory);

            Transaction transaction = new Transaction();
            transaction.setType(1);
            transaction.setStatus(0);
            transaction.setPaymentMethod(0);
            transaction.setAccount(userLogin.getUserLogin());
            transaction.setBill(bill);
            transaction.setNote("Hoàn trả tiền khách trả hàng");
            transaction.setTotalMoney(new BigDecimal(request.getReturnMoney()));
            transactionRepository.save(transaction);
            List<BillDetail> billDetails = new ArrayList<>();
            for (ReturnDetailRequest req : request.getListDetail()) {
                BillDetail billDetail = billDetailRepository.findById(req.getIdBillDetail()).get();
                billDetail.setQuantity(billDetail.getQuantity() - req.getQuantity());

                ProductDetail productDetail = billDetail.getProductDetail();

                BillDetail newBillDetail = new BillDetail();
                newBillDetail.setQuantity(req.getQuantity());
                newBillDetail.setStatus(2);
                newBillDetail.setBill(billDetail.getBill());
                newBillDetail.setProductDetail(productDetail);
                newBillDetail.setPrice(billDetail.getPrice());
                newBillDetail.setNote(req.getNote());
                billDetails.add(newBillDetail);

                if (billDetail.getQuantity() <= 0) {
                    billDetailRepository.delete(billDetail);
                } else {
                    billDetails.add(billDetail);
                }

                productDetail.setQuantityReturn(productDetail.getQuantityReturn() + req.getQuantity());
                productDetailRepository.save(productDetail);
            }
            billDetailRepository.saveAll(billDetails);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
