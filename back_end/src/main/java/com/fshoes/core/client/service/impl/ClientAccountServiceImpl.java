package com.fshoes.core.client.service.impl;

import com.fshoes.core.admin.hoadon.repository.HDBillDetailRepository;
import com.fshoes.core.admin.hoadon.repository.HDBillHistoryRepository;
import com.fshoes.core.admin.hoadon.repository.HDBillRepository;
import com.fshoes.core.client.model.request.*;
import com.fshoes.core.client.model.response.*;
import com.fshoes.core.client.repository.*;
import com.fshoes.core.client.service.ClientAccountService;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.*;
import com.fshoes.infrastructure.cloudinary.CloudinaryImage;
import com.fshoes.infrastructure.constant.StatusBillDetail;
import com.fshoes.repository.ProductDetailRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

@Service
public class ClientAccountServiceImpl implements ClientAccountService {
    @Autowired
    private ClientAccountRepository repository;

    @Autowired
    private CloudinaryImage cloudinaryImage;

    @Autowired
    private ClientBillRepository billRepository;

    @Autowired
    private ClientBillDetailRepository billDetailRepository;

    @Autowired
    private ClientBillHistoryRepository billHistoryRepository;

    @Autowired
    private ClientTransactionRepository transactionRepository;

    @Autowired
    private UserLogin userLogin;

    @Autowired
    private ClientBillRepository clientBillRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private HDBillRepository hdBillRepository;
    @Autowired
    private HDBillDetailRepository hdBillDetailRepository;

    @Autowired
    private HDBillHistoryRepository hdBillHistoryRepository;


    @Override
    public Account getOneCustomerClient(UserLogin userLogin) {
        return repository.findById(userLogin.getUserLogin().getId()).orElse(null);
    }

    @Override
    public Boolean update(UserLogin userLogin, ClientAccountRequest request) throws ParseException {
        Optional<Account> optionalCustomer = repository.findById(userLogin.getUserLogin().getId());
        if (optionalCustomer.isPresent()) {
            Account customer = request.newCustomer(optionalCustomer.get());
            if (request.getAvatar() != null) {
                customer.setAvatar(cloudinaryImage.uploadAvatar(request.getAvatar()));
            }
            repository.save(customer);
            return true;

        } else {
            return false;
        }
    }

    @Override
    public List<ClientCustomerResponse> getAll() {
        return repository.getAllAccount();
    }

    @Override
    public List<ClientBillAccountResponse> getALlBill(ClientBillAccountRequest status) {
        return billRepository.getALlBill(status, userLogin.getUserLogin().getId());
    }

    @Override
    public List<ClientGetAllBillTableResponse> getALlBillTable(ClientBillAccountRequest status) {
        return billRepository.getALlBillTable(status, userLogin.getUserLogin().getId());
    }

    @Override
    public List<String> getALlBillReturn() {
        Long currentDate = Calendar.getInstance().getTimeInMillis();
        Calendar sevenDaysAgo = Calendar.getInstance();
        sevenDaysAgo.setTimeInMillis(currentDate);
        sevenDaysAgo.add(Calendar.DAY_OF_YEAR, -7);
        Long sevenDaysAgoTimestamp = sevenDaysAgo.getTimeInMillis();
        return billRepository.getBillReturn(sevenDaysAgoTimestamp, userLogin.getUserLogin().getId());
    }

    @Override
    public List<ClientBillDetailResponse> getBillDetailsByBillId(String idBill) {
        return billDetailRepository.getBillDetailsByBillId(idBill);
    }

    @Override
    public List<CLientBillHistoryResponse> getListBillHistoryByIdBill(String idBill) {
        return billHistoryRepository.getListBillHistoryByIdBill(idBill);
    }

    @Override
    public List<ClientTransactionResponse> getListTransactionByIdBill(String idBill) {
        return transactionRepository.getTransactionByBillId(idBill);
    }

    @Override
    public List<ClientBillDetailResponse> getBillDetailsByCode(String code) {
        return billDetailRepository.getBillDetailsByCode(code);
    }

    @Override
    public List<CLientBillHistoryResponse> getListBillHistoryByCode(String code) {
        return billHistoryRepository.getListBillHistoryByCode(code);
    }

    @Override
    public ClientBillResponse getClientBillResponse(String id) {
        return clientBillRepository.getClientBillResponse(id);
    }

    @Override
    public Bill  updateBill(String idBill, ClientBillRequest hdBillRequest) {
        try {
            Bill bill = billRepository.findById(idBill).orElseThrow(() -> new RuntimeException("khong tim thay bill co id: " + idBill));
            bill.setFullName(hdBillRequest.getFullName());
            bill.setPhoneNumber(hdBillRequest.getPhoneNumber());
            bill.setAddress(hdBillRequest.getAddress());
            bill.setNote(hdBillRequest.getNote());
            bill.setMoneyShip(hdBillRequest.getMoneyShip());
            if (bill.getMoneyReduced() != null) {
                bill.setMoneyAfter((bill.getTotalMoney().add(hdBillRequest.getMoneyShip())).subtract(bill.getMoneyReduced()));
            } else {
                bill.setMoneyAfter(bill.getTotalMoney().add(hdBillRequest.getMoneyShip()));
            }
            //thêm history:
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill);
            billHistory.setNote(hdBillRequest.getNoteBillHistory());
            billHistory.setAccount(userLogin.getUserLogin());
            billHistoryRepository.save(billHistory);
            Bill billSave = clientBillRepository.save(bill);
            messagingTemplate.convertAndSend("/topic/real-time-thong-tin-don-hang-by-client-update",
                    hdBillRepository.getBillResponse(bill.getId()));
            return billSave;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Transactional
    @Override
    public BillDetail saveBillDetail(ClientBillDetailRequest clientBillDetailRequest) {
        System.out.println("");
        Bill bill = billRepository.findById(clientBillDetailRequest.getIdBill()).get();
        ProductDetail productDetail = productDetailRepository.findById(clientBillDetailRequest.getProductDetailId()).get();

        BillDetail billDetail = billDetailRepository.getBillDetailByBillIdAndProductDetailId(clientBillDetailRequest.getIdBill(), clientBillDetailRequest.getProductDetailId());
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill);
        billHistory.setAccount(userLogin.getUserLogin());
        if (billDetail == null) {

            BillDetail newBillDetail = BillDetail.builder()
                    .bill(bill)
                    .productDetail(productDetail)
                    .price(clientBillDetailRequest.getPrice())
                    .quantity(clientBillDetailRequest.getQuantity())
                    .status(StatusBillDetail.values()[clientBillDetailRequest.getStatus()])
                    .build();
            billHistory.setNote("Đã thêm " + clientBillDetailRequest.getQuantity() + " sản phẩm" + productDetail.getProduct().getName() + " - " + productDetail.getColor().getName() + " - " + productDetail.getSize().getSize());
//            messagingTemplate.convertAndSend("/topic/realtime-san-pham-detail-modal-add-client-by-add-in-bill-detail",
//                    hdBillDetailRepository.getBillDetailsByBillIdAndStatus(bill.getId(),0));
            billDetail = billDetailRepository.save(newBillDetail);
        } else {
            billDetail.setStatus(clientBillDetailRequest.getStatus());
            billDetail.setPrice(clientBillDetailRequest.getPrice());
            int differenceQuantity = billDetail.getQuantity() - clientBillDetailRequest.getQuantity();
            if (differenceQuantity > 0) {
                billHistory.setNote("Đã xoá " + differenceQuantity + " sản phẩm " + productDetail.getProduct().getName() + " - " + productDetail.getColor().getName() + " - " + productDetail.getSize().getSize());
            } else if (differenceQuantity < 0) {
                billHistory.setNote("Đã thêm " + (clientBillDetailRequest.getQuantity() - billDetail.getQuantity()) + " sản phẩm " + productDetail.getProduct().getName() + " - " + productDetail.getColor().getName() + " - " + productDetail.getSize().getSize());
            } else {
                billHistory.setNote("Đã thay đổi sp trong đơn hàng");
            }
//            messagingTemplate.convertAndSend("/topic/realtime-san-pham-detail-modal-add-client-by-add-in-bill-detail",
//                    hdBillDetailRepository.getBillDetailsByBillIdAndStatus(bill.getId(),0));
            billDetail.setQuantity(clientBillDetailRequest.getQuantity());
            billDetail = billDetailRepository.save(billDetail);

        }
        billHistoryRepository.save(billHistory);
        List<BillDetail> listBillDetail = billDetailRepository.findAllByBillId(bill.getId());
        BigDecimal totalAmount = listBillDetail.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        bill.setTotalMoney(totalAmount);
        BigDecimal tienCanThanhToan = totalAmount;
        if (bill.getMoneyReduced() != null) {
            tienCanThanhToan = totalAmount.subtract(bill.getMoneyReduced());
        }
        if (bill.getMoneyShip() != null) {
            tienCanThanhToan = tienCanThanhToan.add(bill.getMoneyShip());
        }
        bill.setMoneyAfter(tienCanThanhToan);
        billRepository.save(bill);
        return billDetail;
    }

    @Transactional
    @Override
    public Boolean delete(String id) {
        try {
            BillDetail billDetail = billDetailRepository.findById(id).get();
            Bill bill = billDetail.getBill();
            billDetailRepository.delete(billDetail);
            List<BillDetail> listBillDetail = billDetailRepository.findAllByBillId(bill.getId());
            BigDecimal totalAmount = listBillDetail.stream()
                    .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            bill.setTotalMoney(totalAmount);
            BigDecimal tienCanThanhToan = totalAmount;
            if (bill.getMoneyReduced() != null) {
                tienCanThanhToan = totalAmount.subtract(bill.getMoneyReduced());
            }
            if (bill.getMoneyShip() != null) {
                tienCanThanhToan = tienCanThanhToan.add(bill.getMoneyShip());
            }
            bill.setMoneyAfter(tienCanThanhToan);
            billRepository.save(bill);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    @Override
    public Boolean cancelBill(String idBill, ClientCancelBillRequest clientCancelBillRequest) {
        try {
            Bill bill = billRepository.findById(idBill).get();
            bill.setStatus(0);
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill);
            billHistory.setNote(clientCancelBillRequest.getNoteBillHistory());
            billHistory.setAccount(userLogin.getUserLogin());
            billHistory.setStatusBill(0);
            billHistoryRepository.save(billHistory);
            bill.setNote(clientCancelBillRequest.getNoteBillHistory());
            billRepository.save(bill);
            messagingTemplate.convertAndSend("/topic/real-time-huy-don-bill-page-admin-by-customer",
                    hdBillRepository.realTimeBill(bill.getId()));
            messagingTemplate.convertAndSend("/topic/real-time-huy-don-bill-detail-admin-by-customer",
                    hdBillHistoryRepository.getListBillHistoryByIdBill(bill.getId()));
            messagingTemplate.convertAndSend("/topic/real-time-huy-don-bill-detail-admin-by-customer-and-update-bill-detail",
                    hdBillRepository.getBillResponse(bill.getId()));
            return true;
        } catch (Exception exception) {
            return false;
        }
    }


}
