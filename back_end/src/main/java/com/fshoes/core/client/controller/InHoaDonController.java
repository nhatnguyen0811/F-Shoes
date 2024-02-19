package com.fshoes.core.client.controller;

import com.fshoes.core.admin.hoadon.service.HDBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/in-hoa-don")
public class InHoaDonController {

    @Autowired
    private HDBillService hdBillService;


    @GetMapping("/{id}")
    public ResponseEntity<byte[]> inHoaDon(@PathVariable("id") String id) throws IOException {
        File pdfFile = hdBillService.xuatHoaDon(id);
        if (pdfFile != null) {
            byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename(pdfFile.getName()).build());

            pdfFile.delete();

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);
        } else {
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/hd-giao-hang/{id}")
    public ResponseEntity<byte[]> inHoaDonGiaoHang(@PathVariable("id") String id) throws IOException {
        File pdfFile = hdBillService.xuatHoaDonGiaoHang(id);
        if (pdfFile != null) {
            byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename(pdfFile.getName()).build());

            pdfFile.delete();

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);
        } else {
            return ResponseEntity.status(500).body(null);
        }
    }

}
