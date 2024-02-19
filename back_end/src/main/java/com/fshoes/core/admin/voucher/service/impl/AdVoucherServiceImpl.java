package com.fshoes.core.admin.voucher.service.impl;

import com.fshoes.core.admin.khachhang.model.respone.KhachHangRespone;
import com.fshoes.core.admin.khachhang.repository.KhachHangRepository;
import com.fshoes.core.admin.voucher.model.request.*;
import com.fshoes.core.admin.voucher.model.respone.AdFindCustomerRespone;
import com.fshoes.core.admin.voucher.model.respone.AdVoucherRespone;
import com.fshoes.core.admin.voucher.repository.AdCustomerVoucherRepository;
import com.fshoes.core.admin.voucher.repository.AdVoucherRepository;
import com.fshoes.core.admin.voucher.service.AdVoucherService;
import com.fshoes.core.client.repository.ClientVoucherRepository;
import com.fshoes.core.common.UserLogin;
import com.fshoes.entity.Account;
import com.fshoes.entity.CustomerVoucher;
import com.fshoes.entity.Voucher;
import com.fshoes.infrastructure.constant.StatusVoucher;
import com.fshoes.infrastructure.email.Email;
import com.fshoes.infrastructure.email.EmailSender;
import com.fshoes.util.DateUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class AdVoucherServiceImpl implements AdVoucherService {
    @Autowired
    private AdVoucherRepository adVoucherRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private AdCustomerVoucherRepository adCustomerVoucherRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private EmailSender emailSender;
    @Autowired
    private ClientVoucherRepository clientVoucherRepository;
    @Autowired
    private UserLogin userLogin;

    @Override
    public List<AdVoucherRespone> getAllVoucher() {
        return adVoucherRepository.getAllVoucher();
    }

    @Override
    public List<KhachHangRespone> getAllCustomer() {
        return adVoucherRepository.getAllCustomer();
    }

    @Override
    public AdVoucherRespone getVoucherById(String id) {
        return adVoucherRepository.getVoucherById(id).orElse(null);
    }

    @Override
    public Page<AdVoucherRespone> getPageVoucher(Integer page) {
        Sort sort = Sort.by("code");
        Pageable pageable = PageRequest.of(page - 1, 5, sort);
        return adVoucherRepository.getPageVoucher(pageable);
    }

    @Override
    public Page<AdFindCustomerRespone> getFindAllCustomer(AdFindCustomerVoucherRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        return adVoucherRepository.getFindAllCustomer(request.getTextSearch(), pageable);
    }

    @Override
    public Voucher addVoucher(AdVoucherRequest voucherRequest) {
        try {
            Voucher voucher = voucherRequest.newVoucher(new Voucher());
            adVoucherRepository.save(voucher);
            List<Account> accountList = khachHangRepository.findAll();
            List<CustomerVoucher> customerVoucherList = new ArrayList<>();
            if (voucherRequest.getType() == 0) {
                return voucher;
            } else {
                for (String idCustomer : voucherRequest.getListIdCustomer()) {
                    Account customer = khachHangRepository.findById(idCustomer).get();
                    AdCustomerVoucherRequest adCustomerVoucherRequest = new AdCustomerVoucherRequest();
                    adCustomerVoucherRequest.setVoucher(voucher);
                    adCustomerVoucherRequest.setAccount(customer);
                    CustomerVoucher customerVoucher = adCustomerVoucherRequest.newCustomerVoucher(new CustomerVoucher());
                    customerVoucherList.add(customerVoucher);
                    adCustomerVoucherRepository.save(customerVoucher);

                    String valueText = voucher.getTypeValue() == 0 ? (voucher.getValue() + "%") : (voucher.getValue() + "(VNĐ)");
                    String[] toMail = {customer.getEmail()};
                    Email email = new Email();
                    email.setBody("<!DOCTYPE html>\n" +
                            "<html>\n" +
                            "  <head>\n" +
                            "    <style>\n" +
                            "      body {\n" +
                            "        font-family: Arial, sans-serif;\n" +
                            "        background-color: #f5f5f5;\n" +
                            "      }\n" +
                            "\n" +
                            "      .container {\n" +
                            "        background-color: #fff;\n" +
                            "        max-width: 600px;\n" +
                            "        margin: 0 auto;\n" +
                            "        padding: 20px;\n" +
                            "        border: 1px solid #ccc;\n" +
                            "        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                            "      }\n" +
                            "\n" +
                            "      h1 {\n" +
                            "        color: #333;\n" +
                            "        text-align: center;\n" +
                            "      }\n" +
                            "\n" +
                            "      .voucher {\n" +
                            "        background-image: url(\"https://shorturl.at/uBKU6\");\n" +
                            "        background-size: auto;\n" +
                            "        background-repeat: no-repeat;\n" +
                            "        background-position: center center;\n" +
                            "        color: #fff;\n" +
                            "        text-align: center;\n" +
                            "        padding: 20px;\n" +
                            "        margin: 20px 0;\n" +
                            "        border-radius: 5px;\n" +
                            "        display: flex;\n" +
                            "      }\n" +
                            "\n" +
                            "      .voucher p {\n" +
                            "        font-size: 18px;\n" +
                            "        font-weight: bold;\n" +
                            "        color: #333;\n" +
                            "        flex: 2;\n" +
                            "      }\n" +
                            "\n" +
                            "      button {\n" +
                            "        background-color: #333;\n" +
                            "        color: #fff;\n" +
                            "        padding: 10px 20px;\n" +
                            "        border: none;\n" +
                            "        border-radius: 5px;\n" +
                            "        font-size: 16px;\n" +
                            "        cursor: pointer;\n" +
                            "      }\n" +
                            "\n" +
                            "      button:hover {\n" +
                            "        background-color: #555;\n" +
                            "      }\n" +
                            "    </style>\n" +
                            "  </head>\n" +
                            "  <body>\n" +
                            "    <div class=\"container\">\n" +
                            "      <h1>Thông Báo Phiếu Giảm Giá</h1>\n" +
                            "      <p>Xin chào quý khách hàng thân yêu,</p>\n" +
                            "      <p>\n" +
                            "        Chúng tôi vô cùng vui mừng thông báo rằng bạn có một phiếu giảm giá đặc biệt.\n" +
                            "      </p>\n" +
                            "      <div class=\"voucher\">\n" +
                            "        <p>Giảm " + valueText + "</p>\n" +
                            "        <p>Có hiệu lực từ: " + DateUtil.converDateString(voucher.getStartDate()) + "</p>\n" +
                            "      </div>\n" +
                            "\n" +
                            "      <p>\n" +
                            "        Hãy sử dụng phiếu giảm giá này khi bạn mua sắm trên trang web của chúng tôi\n" +
                            "        để nhận được ưu đãi đặc biệt.\n" +
                            "      </p>\n" +
                            "       <a href='http://localhost:3000/home'><button>Xem Chi Tiết</button></a>" +
                            "      <p>Cảm ơn bạn đã ủng hộ chúng tôi!</p>\n" +
                            "    </div>\n" +
                            "  </body>\n" +
                            "</html>\n");
                    email.setToEmail(toMail);
                    email.setSubject("FSHOES WEBSITE BÁN GIÀY THỂ THAO SNEAKER");
                    email.setTitleEmail("<b style=\"text-align: left;\">Bạn có một phiếu giảm giá: </b><span>" + voucher.getName() + "</span>");
                    emailSender.sendEmail(email);
                }
            }
            return voucher;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    @Transactional
    public Voucher updateVoucher(String id, AdVoucherRequest voucherRequest) throws ParseException {
        Optional<Voucher> optionalVoucher = adVoucherRepository.findById(id);
        List<Account> accountList = khachHangRepository.findAll();
        List<CustomerVoucher> customerVouchers = adCustomerVoucherRepository.getListCustomerVoucherByIdVoucher(id);
        for (CustomerVoucher customerVoucher : customerVouchers) {
            adCustomerVoucherRepository.deleteById(customerVoucher.getId());
        }
        if (optionalVoucher.isPresent()) {
            Voucher voucher = optionalVoucher.get();
            Voucher voucherUpdate = adVoucherRepository.save(voucherRequest.newVoucher(voucher));
            messagingTemplate.convertAndSend("/topic/my-voucher-realtime",
                    clientVoucherRepository.getVoucherReal(voucherUpdate.getId()));
            List<CustomerVoucher> customerVoucherList = new ArrayList<>();
            if (voucherRequest.getType() == 0) {
                return voucherUpdate;
            } else {
                for (String idCustomer : voucherRequest.getListIdCustomer()) {
                    Account customer = khachHangRepository.findById(idCustomer).get();
                    AdCustomerVoucherRequest adCustomerVoucherRequest = new AdCustomerVoucherRequest();
                    adCustomerVoucherRequest.setVoucher(voucherUpdate);
                    adCustomerVoucherRequest.setAccount(customer);
                    CustomerVoucher customerVoucher = adCustomerVoucherRequest.newCustomerVoucher(new CustomerVoucher());
                    customerVoucherList.add(customerVoucher);

                    String valueText = voucher.getTypeValue() == 0 ? (voucher.getValue() + "%") : (voucher.getValue() + "(VNĐ)");
                    String[] toMail = {customer.getEmail()};
                    Email email = new Email();
                    email.setBody("<!DOCTYPE html>\n" +
                            "<html>\n" +
                            "  <head>\n" +
                            "    <style>\n" +
                            "      body {\n" +
                            "        font-family: Arial, sans-serif;\n" +
                            "        background-color: #f5f5f5;\n" +
                            "      }\n" +
                            "\n" +
                            "      .container {\n" +
                            "        background-color: #fff;\n" +
                            "        max-width: 600px;\n" +
                            "        margin: 0 auto;\n" +
                            "        padding: 20px;\n" +
                            "        border: 1px solid #ccc;\n" +
                            "        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                            "      }\n" +
                            "\n" +
                            "      h1 {\n" +
                            "        color: #333;\n" +
                            "        text-align: center;\n" +
                            "      }\n" +
                            "\n" +
                            "      .voucher {\n" +
                            "        background-image: url(\"https://shorturl.at/uBKU6\");\n" +
                            "        background-size: auto;\n" +
                            "        background-repeat: no-repeat;\n" +
                            "        background-position: center center;\n" +
                            "        color: #fff;\n" +
                            "        text-align: center;\n" +
                            "        padding: 20px;\n" +
                            "        margin: 20px 0;\n" +
                            "        border-radius: 5px;\n" +
                            "        display: flex;\n" +
                            "      }\n" +
                            "\n" +
                            "      .voucher p {\n" +
                            "        font-size: 18px;\n" +
                            "        font-weight: bold;\n" +
                            "        color: #333;\n" +
                            "        flex: 2;\n" +
                            "      }\n" +
                            "\n" +
                            "      button {\n" +
                            "        background-color: #333;\n" +
                            "        color: #fff;\n" +
                            "        padding: 10px 20px;\n" +
                            "        border: none;\n" +
                            "        border-radius: 5px;\n" +
                            "        font-size: 16px;\n" +
                            "        cursor: pointer;\n" +
                            "      }\n" +
                            "\n" +
                            "      button:hover {\n" +
                            "        background-color: #555;\n" +
                            "      }\n" +
                            "    </style>\n" +
                            "  </head>\n" +
                            "  <body>\n" +
                            "    <div class=\"container\">\n" +
                            "      <h1>Thông Báo Phiếu Giảm Giá</h1>\n" +
                            "      <p>Xin chào quý khách hàng thân yêu,</p>\n" +
                            "      <p>\n" +
                            "        Chúng tôi vô cùng vui mừng thông báo rằng bạn có một phiếu giảm giá đặc biệt.\n" +
                            "      </p>\n" +
                            "      <div class=\"voucher\">\n" +
                            "        <p>Giảm " + valueText + "</p>\n" +
                            "        <p>Có hiệu lực từ: " + DateUtil.converDateString(voucher.getStartDate()) + "</p>\n" +
                            "      </div>\n" +
                            "\n" +
                            "      <p>\n" +
                            "        Hãy sử dụng phiếu giảm giá này khi bạn mua sắm trên trang web của chúng tôi\n" +
                            "        để nhận được ưu đãi đặc biệt.\n" +
                            "      </p>\n" +
                            "       <a href='http://localhost:3000/home'><button>Xem Chi Tiết</button></a>" +
                            "      <p>Cảm ơn bạn đã ủng hộ chúng tôi!</p>\n" +
                            "    </div>\n" +
                            "  </body>\n" +
                            "</html>\n");
                    email.setToEmail(toMail);
                    email.setSubject("FSHOES WEBSITE BÁN GIÀY THỂ THAO SNEAKER");
                    email.setTitleEmail("<b style=\"text-align: left;\">Bạn có một phiếu giảm giá: </b><span>" + voucher.getName() + "</span>");
                    emailSender.sendEmail(email);
                }
            }
            adCustomerVoucherRepository.saveAll(customerVoucherList);
            List<Voucher> listVoucher = new ArrayList<>();
            listVoucher.add(voucherUpdate);
            messagingTemplate.convertAndSend("/topic/voucherUpdates", listVoucher);
            return voucherUpdate;
        } else {
            return null;
        }
    }

    @Override
    public Boolean deleteVoucher(String id) throws ParseException {
        Date currentDate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        String formattedDate = dateFormat.format(currentDate);
        Long dateUpdate = DateUtil.parseDateTimeLong(formattedDate);
        Optional<Voucher> optionalVoucher = adVoucherRepository.findById(id);
        if (optionalVoucher.isPresent()) {
            Voucher voucher = optionalVoucher.get();
            voucher.setEndDate(dateUpdate);
            voucher.setStatus(2);
            adVoucherRepository.save(voucher);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<String> getAllCodeVoucher() {
        return adVoucherRepository.getAllCodeVoucher();
    }

    @Override
    public List<String> getAllNameVoucher() {
        return adVoucherRepository.getAllNameVoucher();
    }

    @Override
    public Page<AdVoucherRespone> getAllVoucherByIdCustomer(AdCallVoucherOfSell adCallVoucherOfSell) {
        Pageable pageable = PageRequest.of(adCallVoucherOfSell.getPage() - 1, adCallVoucherOfSell.getSize());
        return adVoucherRepository.getAllVoucherByIdCustomer(adCallVoucherOfSell, pageable);
    }

    @Override
    public List<AdVoucherRespone> getListVoucherByIdCustomer(AdCallVoucherOfSell adCallVoucherOfSell) {
        return adVoucherRepository.getListVoucherByIdCustomer(adCallVoucherOfSell);
    }

    @Override
    public List<AdVoucherRespone> getListVoucherByIdCustomerUnqualified(AdCallVoucherOfSell adCallVoucherOfSell) {
        return adVoucherRepository.getListVoucherByIdCustomerUnqualified(adCallVoucherOfSell);
    }

    @Override
    public Page<AdVoucherRespone> getSearchVoucher(AdVoucherSearch voucherSearch) {
        Sort sort = Sort.by("code");
        Pageable pageable = PageRequest.of(voucherSearch.getPage() - 1, voucherSearch.getSize(), sort);
        return adVoucherRepository.pageSearchVoucher(pageable, voucherSearch);
    }

    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void cornJobCheckVoucher() {
        boolean flag = true;
        Long dateNow = Calendar.getInstance().getTimeInMillis();
        List<Voucher> voucherList = adVoucherRepository.getAllVoucherWrong(dateNow);

        for (Voucher voucher : voucherList) {
            if (voucher.getStartDate() > dateNow
                    && voucher.getStatus() != StatusVoucher.SAP_DIEN_RA.ordinal()) {
                voucher.setStatus(StatusVoucher.SAP_DIEN_RA.ordinal());
                flag = true;
            } else if (voucher.getEndDate() <= dateNow
                    && voucher.getStatus() != StatusVoucher.DA_KET_THUC.ordinal()) {
                voucher.setStatus(StatusVoucher.DA_KET_THUC.ordinal());
                flag = true;
            } else if (voucher.getStartDate() <= dateNow
                    && voucher.getEndDate() > dateNow
                    && voucher.getStatus() != StatusVoucher.DANG_DIEN_RA.ordinal()) {
                voucher.setStatus(StatusVoucher.DANG_DIEN_RA.ordinal());
                flag = true;
            }
        }
        if (flag) {
            messagingTemplate.convertAndSend("/topic/voucherUpdates",
                    adVoucherRepository.saveAll(voucherList));
        }
    }
}
