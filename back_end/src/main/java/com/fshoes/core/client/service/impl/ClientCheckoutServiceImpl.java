package com.fshoes.core.client.service.impl;

import com.fshoes.core.admin.hoadon.repository.HDBillRepository;
import com.fshoes.core.admin.notification.model.NotificationRequest;
import com.fshoes.core.admin.voucher.model.respone.AdCustomerVoucherRespone;
import com.fshoes.core.admin.voucher.repository.AdCustomerVoucherRepository;
import com.fshoes.core.admin.voucher.repository.AdVoucherRepository;
import com.fshoes.core.authentication.service.AuthenticationService;
import com.fshoes.core.client.model.request.ClientBillDetaillRequest;
import com.fshoes.core.client.model.request.ClientCheckoutRequest;
import com.fshoes.core.client.repository.ClientBillDetailRepository;
import com.fshoes.core.client.service.ClientCheckoutService;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Account;
import com.fshoes.entity.Address;
import com.fshoes.entity.Bill;
import com.fshoes.entity.BillDetail;
import com.fshoes.entity.BillHistory;
import com.fshoes.entity.ProductDetail;
import com.fshoes.entity.Transaction;
import com.fshoes.entity.Voucher;
import com.fshoes.infrastructure.constant.TypeNotification;
import com.fshoes.infrastructure.email.Email;
import com.fshoes.infrastructure.email.EmailSender;
import com.fshoes.infrastructure.vnpay.VNPayConfig;
import com.fshoes.repository.AccountRepository;
import com.fshoes.repository.AddressRepository;
import com.fshoes.repository.BillHistoryRepository;
import com.fshoes.repository.BillRepository;
import com.fshoes.repository.TransactionRepository;
import com.fshoes.util.DateUtil;
import com.fshoes.util.MD5Util;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

@Service
public class ClientCheckoutServiceImpl implements ClientCheckoutService {

    @Value("${client.domain}")
    private String domain;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ClientBillDetailRepository billDetailRepository;

    @Autowired
    private BillHistoryRepository billHistoryRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AdVoucherRepository voucherRepository;
    @Autowired
    private EmailSender emailSender;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private HDBillRepository hdBillRepository;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private AdCustomerVoucherRepository adCustomerVoucherRepository;

    @Autowired
    private UserLogin userLogin;

    @Override
    public Bill thanhToan(ClientCheckoutRequest request, UserLogin userLogin) {
        Bill newBill = new Bill();
        if (request.getIdVoucher() != null) {
            Voucher voucher = voucherRepository.findById(request.getIdVoucher()).orElse(null);
            if (voucher != null) {
                voucher.setQuantity(voucher.getQuantity() - 1);
                voucherRepository.save(voucher);
                newBill.setVoucher(voucher);
                if (userLogin.getUserLogin().getId() != null) {
                    Account account = accountRepository.findById(userLogin.getUserLogin().getId()).orElse(null);
                    AdCustomerVoucherRespone adCustomerVoucherRespone = voucherRepository.getOneCustomerVoucherByIdVoucherAndIdCustomer(voucher.getId(), account.getId());
                    if (adCustomerVoucherRespone != null) {
                        adCustomerVoucherRepository.deleteById(adCustomerVoucherRespone.getId());
                    }
                }
            }
        }
        newBill.setReceivingMethod(1);
        newBill.setStatus(request.getStatus());
        newBill.setNote(request.getNote());
        newBill.setFullName(request.getFullName());
        newBill.setPhoneNumber(request.getPhone());
        StringBuilder diaChi = new StringBuilder();
        newBill.setAddress(diaChi.append(request.getAddress())
                .append(", ")
                .append(request.getXa())
                .append(", ")
                .append(request.getHuyen())
                .append(", ")
                .append(request.getTinh())
                .toString());
        newBill.setTotalMoney(new BigDecimal(request.getTotalMoney()));
        Long dateNow = Calendar.getInstance().getTimeInMillis();
        newBill.setCode("HD" + dateNow);
        newBill.setEmail(request.getEmail());
        newBill.setType(1);
        newBill.setMoneyReduced(new BigDecimal(request.getMoneyReduced()));
        newBill.setMoneyShip(new BigDecimal(request.getShipMoney()));
        newBill.setMoneyAfter(new BigDecimal(request.getTotalMoney()).add(new BigDecimal(request.getShipMoney()).subtract(new BigDecimal(request.getMoneyReduced()))));
        newBill.setDesiredReceiptDate(request.getDuKien());
        String password = generatePassword();
        Account account;
        if (userLogin.getUserLogin() != null) {
            account = authenticationService.checkMail(userLogin.getUserLogin().getEmail());
        } else {
            account = authenticationService.checkMail(request.getEmail());
        }
        if (account == null) {
            String setCodeCustomer = "KH" + accountRepository.findAll().size();
            account = new Account();
            account.setCode(setCodeCustomer);
            account.setRole(2);
            account.setGender(true);
            account.setFullName(request.getFullName());
            account.setPhoneNumber(request.getPhone());
            account.setDateBirth(631126800000L);
            account.setEmail(request.getEmail());
            account.setPassword(MD5Util.getMD5(password));
            accountRepository.save(account);
            Address address = new Address();
            address.setAccount(account);
            address.setName(request.getFullName());
            address.setPhoneNumber(request.getPhone());
            address.setType(true);
            address.setProvinceId(request.getProvinceId());
            address.setDistrictId(request.getDistrictId());
            address.setWardId(request.getWardId());
            address.setSpecificAddress(request.getAddress() + ", " + request.getXa() + ", " + request.getHuyen() + ", " + request.getTinh());
            addressRepository.save(address);
        } else {
            password = null;
        }
        newBill.setCustomer(account);
        billRepository.save(newBill);
        List<BillDetail> billDetails = request.getBillDetail().stream().map(bd -> {
            BillDetail billDetail = new BillDetail();
            billDetail.setBill(newBill);
            billDetail.setQuantity(bd.getQuantity());
            billDetail.setStatus(0);
            billDetail.setPrice(new BigDecimal(bd.getPrice()));
            ProductDetail productDetail = new ProductDetail();
            productDetail.setId(bd.getIdProduct());
            billDetail.setProductDetail(productDetail);
            return billDetail;
        }).toList();
        billDetailRepository.saveAll(billDetails);
        if (request.getStatus() == 1) {
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(newBill);
            billHistory.setStatusBill(newBill.getStatus());
            billHistory.setNote(request.getNote());
            billHistory.setAccount(account);
            billHistoryRepository.save(billHistory);
            sendMail(request, newBill.getCode(), dateNow, password);
            messagingTemplate.convertAndSend("/topic/bill-update", hdBillRepository.findBill(newBill.getId()));
        }
        NotificationRequest notification = new NotificationRequest();
        notification.setContent(newBill.getCode());
        notification.setTitle("Có đơn hàng mới ");
        notification.setImage(account.getAvatar());
        notification.setCreatedAt(Calendar.getInstance().getTimeInMillis());
        notification.setType(TypeNotification.HOA_DON);
        notification.setIdRedirect(newBill.getId());
        messagingTemplate.convertAndSend("/topic/thong-bao", notification);
        return newBill;
    }

    @Override
    @Transactional
    public String createOrder(ClientCheckoutRequest request, UserLogin userLogin) {
        Bill bill = thanhToan(request, userLogin);
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = bill.getCode();
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String orderType = "order-type";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(bill.getMoneyAfter().multiply(BigDecimal.valueOf(100))));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", bill.getId());
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);

        vnp_Params.put("vnp_ReturnUrl", domain + VNPayConfig.vnp_Returnurl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return VNPayConfig.vnp_PayUrl + "?" + queryUrl;
    }

    @Override
    public List<ProductDetail> orderReturn(HttpServletRequest request) {
        String password = generatePassword();
        Map fields = new HashMap();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode((String) params.nextElement(), StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VNPayConfig.hashAllFields(fields);
        Bill bill = billRepository.findById((String) fields.get("vnp_OrderInfo")).orElse(null);
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                if (bill != null && bill.getStatus() == 8) {
                    bill.setStatus(1);
                    Account account;
                    if (userLogin.getUserLogin() != null) {
                        account = authenticationService.checkMail(userLogin.getUserLogin().getEmail());
                    } else {
                        account = authenticationService.checkMail(bill.getEmail());
                    }

                    if (account == null) {
                        String setCodeCustomer = "KH" + accountRepository.findAll().size();
                        account = new Account();
                        account.setCode(setCodeCustomer);
                        account.setRole(2);
                        account.setGender(true);
                        account.setPhoneNumber(bill.getPhoneNumber());
                        account.setDateBirth(631126800000L);
                        account.setFullName(bill.getFullName());
                        account.setEmail(bill.getEmail());
                        account.setPassword(MD5Util.getMD5(password));
                        accountRepository.save(account);
                    } else {
                        password = null;
                    }
                    bill.setCustomer(account);
                    bill.setReceivingMethod(1);
                    billRepository.save(bill);
                    Transaction transaction = new Transaction();
                    transaction.setTransactionCode((String) fields.get("vnp_BankTranNo"));
                    transaction.setBill(bill);
                    transaction.setType(0);
                    transaction.setTotalMoney(bill.getMoneyAfter());
                    transaction.setPaymentMethod(0);
                    transaction.setStatus(0);
                    transactionRepository.save(transaction);
                    ClientCheckoutRequest newRequest = new ClientCheckoutRequest();
                    newRequest.setFullName(bill.getFullName());
                    newRequest.setEmail(bill.getEmail());
                    newRequest.setPhone(bill.getPhoneNumber());
                    String[] arrAddress = bill.getAddress().split(",");
                    newRequest.setAddress(arrAddress[0]);
                    newRequest.setXa(arrAddress[1]);
                    newRequest.setHuyen(arrAddress[2]);
                    newRequest.setTinh(arrAddress[3]);
                    newRequest.setNote(bill.getNote());
                    newRequest.setShipMoney(String.valueOf(bill.getMoneyShip().intValue()));
                    newRequest.setTypePayment("1");
                    if (bill.getVoucher() != null) {
                        newRequest.setIdVoucher(bill.getVoucher().getId());
                    }
                    newRequest.setMoneyReduced(String.valueOf(bill.getMoneyReduced().intValue()));
                    newRequest.setDuKien(bill.getDesiredReceiptDate());
                    newRequest.setStatus(bill.getStatus());
                    newRequest.setTotalMoney(String.valueOf(bill.getTotalMoney().intValue()));

                    List<BillDetail> listBillDetails = billDetailRepository.findAllByBillId(bill.getId());
                    newRequest.setBillDetail(listBillDetails.stream().map(billDetail ->
                            new ClientBillDetaillRequest(
                                    billDetail.getProductDetail().getProduct().getName() + "" +
                                            billDetail.getProductDetail().getColor().getName() + "" +
                                            billDetail.getProductDetail().getMaterial().getName() + "" +
                                            billDetail.getProductDetail().getSole().getName() + "" +
                                            billDetail.getProductDetail().getCategory().getName() + "" +
                                            billDetail.getProductDetail().getBrand().getName(),
                                    billDetail.getProductDetail().getId(),
                                    billDetail.getQuantity(), String.valueOf(billDetail.getPrice().intValue()))
                    ).toList());
                    BillHistory billHistory = new BillHistory();
                    billHistory.setBill(bill);
                    billHistory.setAccount(account);
                    billHistory.setStatusBill(bill.getStatus());
                    billHistory.setNote(bill.getNote());
                    billHistoryRepository.save(billHistory);
                    sendMail(newRequest, bill.getCode(), Calendar.getInstance().getTimeInMillis(), password);
                    messagingTemplate.convertAndSend("/topic/bill-update", hdBillRepository.findBill(bill.getId()));

                    NotificationRequest notification = new NotificationRequest();
                    notification.setContent(bill.getCode());
                    notification.setTitle("Có đơn hàng mới ");
                    notification.setImage(account.getAvatar());
                    notification.setCreatedAt(Calendar.getInstance().getTimeInMillis());
                    notification.setType(TypeNotification.HOA_DON);
                    notification.setIdRedirect(bill.getId());
                    messagingTemplate.convertAndSend("/topic/thong-bao", notification);
                    return listBillDetails.stream().map(BillDetail::getProductDetail).toList();
                }else if(bill != null){
                    return new ArrayList<>();
                }
            }
        }
        if (bill != null) {
            List<BillDetail> listBillDetail = billDetailRepository.getBillDetails(bill.getId());
            List<Transaction> listTransaction = transactionRepository.getTransactions(bill.getId());
            List<BillHistory> listBillHistory = billHistoryRepository.getBillHistorys(bill.getId());

            billDetailRepository.deleteAll(listBillDetail);
            transactionRepository.deleteAll(listTransaction);
            billHistoryRepository.deleteAll(listBillHistory);
            billRepository.delete(bill);
        }
        return null;
    }

    @Async
    protected void sendMail(ClientCheckoutRequest request, String codeBill, Long dateNow, String password) {
        Email newEmail = new Email();
        String[] toMail = {request.getEmail()};

        StringBuilder htmlTable = new StringBuilder("<table><tr style=\"background-color: #F2904F; border: 1px solid #ddd;\">\n" +
                "    <th style=\"width: 70%; border: 1px solid #ddd;\">Tên sản phẩm</th>\n" +
                "    <th style=\"width: 10%; border: 1px solid #ddd;\">Số lượng</th>\n" +
                "    <th style=\"width: 20%; border: 1px solid #ddd;\">Đơn giá</th></tr>");
        for (ClientBillDetaillRequest detail : request.getBillDetail()) {
            String formattedPrice = String.format("%,d VNĐ", Integer.parseInt(detail.getPrice()));

            htmlTable.append("<tr><td style=\"border: 1px solid #ddd; padding: 8px;\">")
                    .append(detail.getNameProduct())
                    .append("</td><td style=\"border: 1px solid #ddd; padding: 8px;\">")
                    .append(detail.getQuantity())
                    .append("</td><td style=\"border: 1px solid #ddd; padding: 8px;\">")
                    .append(formattedPrice)
                    .append("</td></tr>");
        }

        String valueType = request.getTypePayment().equals("0") ? "Tại quầy" : "Đặt hàng";

        htmlTable.append("</table>");

        String htmlContent =
                "<div class=\"container\">" +
                        "<h1 style=\"text-align: center; \">Thông Tin Đơn Hàng</h1>" +
                        "<div class=\"email-container\">" +
                        "<br/>" +
                        htmlTable.toString() +
                        "        <div class=\"total-section\">" +
                        "            <p>Thành tiền: <strong>" + formatCurrency(String.valueOf(new BigDecimal(request.getTotalMoney()))) + " VNĐ</strong></p>" +
                        "            <p>Phí vận chuyển: <strong>" + formatCurrency(request.getShipMoney()) + " VNĐ</strong></p>" +
                        "            <p>Giảm giá: <strong>" + formatCurrency(request.getMoneyReduced()) + " VNĐ</strong></p>" +
                        "            <p>Tổng cộng: <strong>" + formatCurrency(String.valueOf((Integer.parseInt(request.getTotalMoney()) - Integer.parseInt(request.getMoneyReduced()) + Integer.parseInt(request.getShipMoney())))) + " VNĐ</strong></p>" +
                        "        </div>" +
                        "<div>" +
                        "<br/>" +
                        "<p><b>THÔNG TIN ĐƠN HÀNG:</b></p>" +
                        "<ul>" +
                        "<li>Mã đơn hàng: <strong>" + codeBill + "</strong></li>" +
                        "<li>Ngày đặt hàng: <strong>" + DateUtil.converDateTimeString(dateNow) + "</strong></li>" +
                        "<li>Ngày nhận dự kiến: <strong>" + DateUtil.converDateTimeString(request.getDuKien()) + "</strong></li>" +
                        "<li>Hình thức thanh toán: <strong>" + valueType + "</strong></li>" +
                        "</ul>" +
                        "<p><b>ĐỊA CHỈ GIAO HÀNG:</b></p>" +
                        "<ul>" +
                        "<li>Họ và tên: <strong>" + request.getFullName() + "</strong></li>" +
                        "<li>Số điện thoại: <strong>" + request.getPhone() + "</strong></li>" +
                        "<li>Địa chỉ: <strong>" + request.getAddress() + ", " + request.getXa() + ", " + request.getHuyen() + ", " + request.getTinh() + "</strong></li>" +
                        "</ul>" +
                        "</div>" +
                        "<hr/>" +
                        "<p>" +
                        "Cảm ơn bạn đã tin tưởng và mua hàng tại cửa hàng của chúng tôi. " +
                        "Chúng tôi sẽ liên hệ với bạn sớm nhất có thể." +
                        "</p>" +
                        "</div>" +
                        "<a href='" + domain + "/tracking/" + codeBill + "' style=\"display: inline-block; text-align: center; text-decoration: none;\">" +
                        " <button style=\"background-color: #000; color: #fff; padding: 10px 20px; border: none; cursor: pointer;\">Xem Chi Tiết</button>" +
                        "</div>" +
                        (password == null ? "" : "</div>" +
                                "        <p style=\"color: #555;\">Hoặc đăng nhập vào hệ thống:</p>\n" +
                                "        <p><strong>Email:</strong> " + request.getEmail() + "</p>\n" +
                                "        <p><strong>Mật khẩu:</strong> " + password + "</p>\n" +
                                "</div>");
        newEmail.setBody(htmlContent);
        newEmail.setToEmail(toMail);
        newEmail.setSubject("Đơn hàng F-Shoes của bạn " + codeBill);
        newEmail.setTitleEmail("<h1 style=\"text-align: center; color: #333;\">Cảm ơn bạn đã đặt hàng tại F-Shoes</h1>");
        emailSender.sendEmail(newEmail);
    }

    private String formatCurrency(String amount) {
        int amountInt = Integer.parseInt(amount);
        return String.format("%,d", amountInt);
    }

    private String generatePassword() {
        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        StringBuilder password = new StringBuilder();

        SecureRandom random = new SecureRandom();

        for (int i = 0; i < 12; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            char randomChar = CHARACTERS.charAt(randomIndex);
            password.append(randomChar);
        }

        return password.toString();
    }

}