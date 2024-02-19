package com.fshoes.core.admin.thongke.Controller;

import com.fshoes.core.admin.thongke.Modal.request.GetDataDashBoardRequest;
import com.fshoes.core.admin.thongke.Modal.request.GetDataDashBoarhByDateRequest;
import com.fshoes.core.admin.thongke.Service.ThongKeService;
import com.fshoes.core.common.ObjectRespone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/api/admin/statistical")
public class ThongKeController {

    @Autowired
    private ThongKeService thongKeService;

    @GetMapping("/get-product-in-day")
    public ObjectRespone getProductInDay(GetDataDashBoardRequest request) {
        return new ObjectRespone(thongKeService.getProductInDay(request));
    }

    @GetMapping("/get-product-in-week")
    public ObjectRespone getProductInWeek(GetDataDashBoardRequest request) {
        return new ObjectRespone(thongKeService.getProductInWeek(request));
    }

    @GetMapping("/get-product-in-month")
    public ObjectRespone getProductInMonth(GetDataDashBoardRequest request) {
        return new ObjectRespone(thongKeService.getProductInMonth(request));
    }

    @GetMapping("/get-product-in-year")
    public ObjectRespone getProductInYear(GetDataDashBoardRequest request) {
        return new ObjectRespone(thongKeService.getProductInYear(request));
    }

    @GetMapping("/doanh-thu")
    public ObjectRespone getDoanhThu() {
        return new ObjectRespone(thongKeService.getDoanhThu());
    }

    @GetMapping("/doanh-thu-cu")
    public ObjectRespone getDoanhThuCu() {
        return new ObjectRespone(thongKeService.getDoanhThuCu());
    }

    @GetMapping("/doanh-thu-custom")
    public ObjectRespone getDoanhThuCustom(@ModelAttribute GetDataDashBoarhByDateRequest request) throws ParseException {
        return new ObjectRespone(thongKeService.getDoanhThuCustom(request));
    }

    @GetMapping("/view/thong-ke-don-hang")
    public ObjectRespone getThongKeDonHang(GetDataDashBoarhByDateRequest request) throws ParseException {
        return new ObjectRespone(thongKeService.getThongKeDonHang(request));
    }

    @GetMapping("/view/thong-ke-don-hang-trong-ngay")
    public ObjectRespone getThongKeDonHangTrongNgay() {
        return new ObjectRespone(thongKeService.getThongKeDonHangTrongNgay());
    }

    @GetMapping("/view/thong-ke-don-hang-trong-tuan")
    public ObjectRespone getThongKeDonHangTrongTuan() {
        return new ObjectRespone(thongKeService.getThongKeDonHangTrongTuan());
    }

    @GetMapping("/view/thong-ke-don-hang-trong-thang")
    public ObjectRespone getThongKeDonHangTrongThang() {
        return new ObjectRespone(thongKeService.getThongKeDonHangTrongThang());
    }

    @GetMapping("/view/thong-ke-don-hang-trong-nam")
    public ObjectRespone getThongKeDonHangTrongNam() {
        return new ObjectRespone(thongKeService.getThongKeDonHangTrongNam());
    }

    @GetMapping("/get-product-take-out")
    public ObjectRespone getProductTakeOut(GetDataDashBoardRequest request) {
        return new ObjectRespone(thongKeService.getProductTakeOut(request));
    }

    @GetMapping("/get-product-in-custom")
    public ObjectRespone getProductInCustom(GetDataDashBoarhByDateRequest request) throws ParseException {
        return new ObjectRespone(thongKeService.getProductInCustom(request));
    }
}
