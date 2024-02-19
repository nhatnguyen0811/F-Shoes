package com.fshoes.core.admin.thongke.Service.impl;

import com.fshoes.core.admin.thongke.Modal.Response.DoanhThuCuRespone;
import com.fshoes.core.admin.thongke.Modal.Response.DoanhThuCustomRespone;
import com.fshoes.core.admin.thongke.Modal.Response.DoanhThuResponse;
import com.fshoes.core.admin.thongke.Modal.Response.GetDataDashBoardResponse;
import com.fshoes.core.admin.thongke.Modal.Response.ThongKeSanPhamResponse;
import com.fshoes.core.admin.thongke.Modal.request.GetDataDashBoardRequest;
import com.fshoes.core.admin.thongke.Modal.request.GetDataDashBoarhByDateRequest;
import com.fshoes.core.admin.thongke.Repository.adminThongKeRepository;
import com.fshoes.core.admin.thongke.Service.ThongKeService;
import com.fshoes.core.common.PageReponse;
import com.fshoes.infrastructure.email.Email;
import com.fshoes.infrastructure.email.EmailSender;
import com.fshoes.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.List;

@Service
public class ThongKeServiceImpl implements ThongKeService {
    @Autowired
    private EmailSender emailSender;
    @Autowired
    private adminThongKeRepository thongKeRepository;

    @Override
    public PageReponse<GetDataDashBoardResponse> getProductInDay(GetDataDashBoardRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        return new PageReponse<>(thongKeRepository.getProductInDay(request, pageable));
    }

    @Override
    public PageReponse<GetDataDashBoardResponse> getProductInWeek(GetDataDashBoardRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        return new PageReponse<>(thongKeRepository.getProductInWeek(request, pageable));
    }

    @Override
    public PageReponse<GetDataDashBoardResponse> getProductInMonth(GetDataDashBoardRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        return new PageReponse<>(thongKeRepository.getProductInMonth(request, pageable));
    }

    @Override
    public PageReponse<GetDataDashBoardResponse> getProductInYear(GetDataDashBoardRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        return new PageReponse<>(thongKeRepository.getProductInYear(request, pageable));
    }

    @Override
    public List<DoanhThuResponse> getDoanhThu() {
        return thongKeRepository.getDoanhThu();
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void cronJobSend() {
        List<DoanhThuResponse> list = thongKeRepository.getDoanhThu();
        BigDecimal tongTien = (BigDecimal) getValue(list.get(0), "getDoanhSoNgay");
        Integer donHang = (Integer) getValue(list.get(0), "getSoDonHangNgay");
        Integer sanPham = (Integer) getValue(list.get(0), "getSoLuongSanPhamNgay");
        Integer donHuy = (Integer) getValue(list.get(0), "getSoDonHuyNgay");
        Integer traHang = (Integer) getValue(list.get(0), "getSoDonTraHangNgay");
        String[] toMail = {"gaupanda567@gmail.com"};
        Email email = new Email();
        email.setBody("");
        email.setToEmail(toMail);
        email.setTitleEmail("<p style=\"text-align: center; color: #fc7c27;font-weight: bold;font-size: 25px;\">Báo cáo thống kê:</p>" +
                            "<p style=\"text-align: center;\">Tổng tiền: " + formatCurrency(tongTien) + "</p>" +
                            "<p style=\"text-align: center;\">Tổng số đơn: " + donHang + "</p>" +
                            "<p style=\"text-align: center;\">Sản phẩm bán được: " + sanPham + "</p>" +
                            "<p style=\"text-align: center;\">Số lượng đơn hủy: " + donHuy + "</p>" +
                            "<p style=\"text-align: center;\">Số đơn trả: " + traHang + "</p>");
        email.setSubject("Báo cáo thống kê ngày: " + DateUtil.converDateString(DateUtil.getCurrentTimeNow() - 50));
        emailSender.sendEmail(email);
    }

    private String formatCurrency(BigDecimal amount) {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance();
        return currencyFormat.format(amount);
    }


    private Object getValue(DoanhThuResponse response, String nameMethod) {
        try {
            Method method = response.getClass().getMethod(nameMethod);
            return method.invoke(response);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<DoanhThuCuRespone> getDoanhThuCu() {
        return thongKeRepository.getDoanhThuCu();
    }

    @Override
    public List<DoanhThuCustomRespone> getDoanhThuCustom(GetDataDashBoarhByDateRequest request) throws ParseException {
        Long startDate = request.getStartDate() != null ? request.converDate(request.getStartDate()) : null;
        Long endDate = request.getEndDate() != null ? request.converDate(request.getEndDate()) : null;
        return thongKeRepository.getDoanhThuCustom(startDate, endDate);
    }

    @Override
    public List<ThongKeSanPhamResponse> getThongKeDonHang(GetDataDashBoarhByDateRequest request) throws ParseException {
        Long startDate = request.getStartDate() != null ? request.converDate(request.getStartDate()) : null;
        Long endDate = request.getEndDate() != null ? request.converDate(request.getEndDate()) : null;
        return thongKeRepository.getThongKeDonhang(startDate, endDate);
    }

    @Override
    public List<ThongKeSanPhamResponse> getThongKeDonHangTrongNgay() {
        return thongKeRepository.getThongKeDonhangTrongNgay();
    }

    @Override
    public List<ThongKeSanPhamResponse> getThongKeDonHangTrongTuan() {
        return thongKeRepository.getThongKeDonhangTrongTuan();
    }

    @Override
    public List<ThongKeSanPhamResponse> getThongKeDonHangTrongThang() {
        return thongKeRepository.getThongKeDonhangTrongThang();
    }

    @Override
    public List<ThongKeSanPhamResponse> getThongKeDonHangTrongNam() {
        return thongKeRepository.getThongKeDonhangTrongNam();
    }

    @Override
    public PageReponse<GetDataDashBoardResponse> getProductTakeOut(GetDataDashBoardRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        return new PageReponse<>(thongKeRepository.getProductTakeOut(request, pageable));
    }

    @Override
    public PageReponse<GetDataDashBoardResponse> getProductInCustom(GetDataDashBoarhByDateRequest request) throws ParseException {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSize());
        Long startDate = request.getStartDate() != null ? request.converDate(request.getStartDate()) : null;
        Long endDate = request.getEndDate() != null ? request.converDate(request.getEndDate()) : null;
        return new PageReponse<>(thongKeRepository.getProductInCustom(startDate, endDate, pageable));
    }
}
