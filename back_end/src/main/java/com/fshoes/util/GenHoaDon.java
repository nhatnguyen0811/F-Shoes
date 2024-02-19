package com.fshoes.util;

import com.fshoes.entity.Account;
import com.fshoes.entity.Bill;
import com.fshoes.entity.BillDetail;
import com.fshoes.entity.BillHistory;
import com.fshoes.infrastructure.constant.Constants;
import com.fshoes.infrastructure.constant.MailConstant;
import com.fshoes.repository.ProductDetailRepository;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BarcodeQRCode;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class GenHoaDon {
    @Autowired
    private ProductDetailRepository productDetailRepository;

    public File genHoaDon(Bill bill, List<BillDetail> billDetails, BillHistory billHistory, Account account) {
        Document document = new Document();
        File pdfFile = null;

        try {
            pdfFile = new File(bill.getCode() + ".pdf");
            PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
            document.open();

            BaseFont unicodeFont = BaseFont.createFont(MailConstant.FONT_INVOICE, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font titleFont = new Font(unicodeFont, 25, Font.BOLD);
            Font headerFont = new Font(unicodeFont, 12, Font.BOLD);
            Font normalFont = new Font(unicodeFont, 12);

            ClassPathResource resource = new ClassPathResource(MailConstant.LOGO_PATH);
            Image img = Image.getInstance(resource.getURL());
            float pageWidth = document.getPageSize().getWidth();
            float pageHeight = document.getPageSize().getHeight();
            float imageWidth = img.getWidth();
            float imageHeight = img.getHeight();
            float aspectRatio = imageWidth / imageHeight;
            float newWidth = 500;
            float newHeight = newWidth / aspectRatio;

            // Đặt vị trí và kích thước mới cho ảnh
            float x = (pageWidth - newWidth) / 2;
            float y = (pageHeight - newHeight) / 2;

            img.setAbsolutePosition(x, y);
            img.scaleAbsolute(newWidth, newHeight);

            // Thêm ảnh vào tài liệu
            document.add(img);

            // Đầu trang: F-Shoes, Số điện thoại, Email, Địa chỉ, QR Code
            Paragraph fShoes = new Paragraph("F-Shoes", titleFont);
            fShoes.setAlignment(Element.ALIGN_CENTER);
            fShoes.setSpacingAfter(10f);
            document.add(fShoes);

            Paragraph contactInfo = new Paragraph("Số điện thoại: 0123456789", normalFont);
            Paragraph contactInfo2 = new Paragraph("Email: fshoesweb@gmail.com", normalFont);
            Paragraph contactInfo3 = new Paragraph("Địa chỉ: FPT POLYTECHNIC Cơ Sở Kiều Mai Tunzo, P. Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội", normalFont);
            contactInfo.setAlignment(Element.ALIGN_CENTER);
            contactInfo2.setAlignment(Element.ALIGN_CENTER);
            contactInfo3.setAlignment(Element.ALIGN_CENTER);
            document.add(contactInfo);
            document.add(contactInfo2);
            document.add(contactInfo3);

            // Tạo mã QR Code và thêm vào tài liệu
            BarcodeQRCode qrcode = new BarcodeQRCode(bill.getCode(), 1, 1, null);
            Image qrcodeImage = qrcode.getImage();
            qrcodeImage.scaleAbsolute(100, 100);  // Điều chỉnh kích thước của mã QR Code
            qrcodeImage.setAbsolutePosition(30, 710);
            document.add(qrcodeImage);

            // Thêm dòng trống
            document.add(new Paragraph(""));

            // Thông tin hóa đơn
            Paragraph invoiceHeader = new Paragraph("HÓA ĐƠN BÁN HÀNG", new Font(unicodeFont, 20, Font.BOLD));
            invoiceHeader.setAlignment(Element.ALIGN_CENTER);
            invoiceHeader.setSpacingBefore(10f);
            invoiceHeader.setSpacingAfter(10f);
            document.add(invoiceHeader);

            PdfPTable invoiceTable = new PdfPTable(2);
            invoiceTable.setWidthPercentage(100);

            String fullName;
            if (bill.getFullName() != null && !bill.getFullName().isEmpty()) {
                fullName = bill.getFullName();
            } else {
                fullName = "Khách lẻ";
            }

            PdfPCell cell3 = new PdfPCell(new Paragraph("Tên khách hàng: " + fullName, normalFont));
            cell3.setHorizontalAlignment(Element.ALIGN_LEFT);
            cell3.setBorder(Rectangle.NO_BORDER);
            invoiceTable.addCell(cell3);
            PdfPCell cell1 = new PdfPCell(new Paragraph("Mã Hóa Đơn: " + bill.getCode(), normalFont));
            cell1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            cell1.setBorder(Rectangle.NO_BORDER);
            invoiceTable.addCell(cell1);
            PdfPCell cell4 = new PdfPCell(new Paragraph("Địa chỉ nhận hàng: " +
                    (bill.getReceivingMethod() == 0 ? "Tại cửa hàng" : bill.getAddress()), normalFont));
            cell4.setHorizontalAlignment(Element.ALIGN_LEFT);
            cell4.setBorder(Rectangle.NO_BORDER);
            invoiceTable.addCell(cell4);

            PdfPCell cell2 = new PdfPCell(new Paragraph("Ngày tạo: " + DateUtil.converDateTimeString(bill.getCreatedAt()), normalFont));
            cell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            cell2.setBorder(Rectangle.NO_BORDER);
            invoiceTable.addCell(cell2);

            PdfPCell cell5 = new PdfPCell(new Paragraph("Nhân viên: " +
                    account.getCode() + " - " +
                    account.getFullName(), normalFont));
            cell5.setHorizontalAlignment(Element.ALIGN_LEFT);
            cell5.setBorder(Rectangle.NO_BORDER);
            invoiceTable.addCell(cell5);

            PdfPCell cell6 = new PdfPCell(new Paragraph("Trạng thái: Hoàn thành", normalFont));
            cell6.setHorizontalAlignment(Element.ALIGN_RIGHT);
            cell6.setBorder(Rectangle.NO_BORDER);
            invoiceTable.addCell(cell6);

            // Thêm bảng vào tài liệu
            document.add(invoiceTable);

            Paragraph invoiceHeader2 = new Paragraph("DANH SÁCH SẢN PHẨM", new Font(unicodeFont, 15, Font.BOLD));
            invoiceHeader2.setAlignment(Element.ALIGN_CENTER);
            invoiceHeader2.setSpacingBefore(5f);
            invoiceHeader2.setSpacingAfter(5f);
            document.add(invoiceHeader2);
            // Thêm bảng sản phẩm
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            DecimalFormat decimalFormat = new DecimalFormat("###,###.## VND");

            table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);

            int sttCounter = 1;
            PdfPCell cell = new PdfPCell(new Phrase("STT", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Tên sản phẩm", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Số lượng", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Đơn giá", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Thành tiền", headerFont));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Trạng thái", headerFont));
            table.addCell(cell);
            for (BillDetail billDetail : billDetails) {
                // Thêm dữ liệu sản phẩm
                table.addCell(String.valueOf(sttCounter));
                table.addCell(productDetailRepository.getName(billDetail.getProductDetail().getId()));
                table.addCell(String.valueOf(billDetail.getQuantity()));
                table.addCell(decimalFormat.format(billDetail.getPrice()));
                table.addCell(decimalFormat.format(billDetail.getPrice().multiply(BigDecimal.valueOf(billDetail.getQuantity()))));
                table.addCell(billDetail.getStatus() == 1 ? "Hàng trả" : "");
                sttCounter++;
            }


            // Thêm bảng vào tài liệu
            document.add(table);

            // Thêm tổng cộng
            PdfPTable invoiceTable3 = new PdfPTable(2);
            invoiceTable3.setWidthPercentage(100);

            PdfPCell totalcell = new PdfPCell(new Paragraph("Tổng tiền hàng:", normalFont));
            totalcell.setHorizontalAlignment(Element.ALIGN_LEFT);
            totalcell.setBorder(Rectangle.NO_BORDER);
            invoiceTable3.addCell(totalcell);
            PdfPCell totalcell2 = new PdfPCell(new Paragraph(decimalFormat.format(bill.getTotalMoney()), headerFont));
            totalcell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalcell2.setBorder(Rectangle.NO_BORDER);
            invoiceTable3.addCell(totalcell2);

            PdfPCell totalcell3 = new PdfPCell(new Paragraph("Giảm giá:", normalFont));
            totalcell3.setHorizontalAlignment(Element.ALIGN_LEFT);
            totalcell3.setBorder(Rectangle.NO_BORDER);
            invoiceTable3.addCell(totalcell3);
            if (bill.getMoneyReduced() != null) {
                PdfPCell totalcell4 = new PdfPCell(new Paragraph(decimalFormat.format(bill.getMoneyReduced().longValue()), headerFont));
                totalcell4.setHorizontalAlignment(Element.ALIGN_RIGHT);
                totalcell4.setBorder(Rectangle.NO_BORDER);
                invoiceTable3.addCell(totalcell4);
            } else {
                PdfPCell totalcell4 = new PdfPCell(new Paragraph(decimalFormat.format(0), headerFont));
                totalcell4.setHorizontalAlignment(Element.ALIGN_RIGHT);
                totalcell4.setBorder(Rectangle.NO_BORDER);
                invoiceTable3.addCell(totalcell4);
            }

            PdfPCell totalcell5 = new PdfPCell(new Paragraph("Phí giao hàng:", normalFont));
            totalcell5.setHorizontalAlignment(Element.ALIGN_LEFT);
            totalcell5.setBorder(Rectangle.NO_BORDER);
            invoiceTable3.addCell(totalcell5);
            if (bill.getMoneyShip() != null) {
                PdfPCell totalcell6 = new PdfPCell(new Paragraph(decimalFormat.format(bill.getMoneyShip().longValue()), headerFont));
                totalcell6.setHorizontalAlignment(Element.ALIGN_RIGHT);
                totalcell6.setBorder(Rectangle.NO_BORDER);
                invoiceTable3.addCell(totalcell6);
            } else {
                PdfPCell totalcell6 = new PdfPCell(new Paragraph(decimalFormat.format(0), headerFont));
                totalcell6.setHorizontalAlignment(Element.ALIGN_RIGHT);
                totalcell6.setBorder(Rectangle.NO_BORDER);
                invoiceTable3.addCell(totalcell6);
            }

            PdfPCell totalcell7 = new PdfPCell(new Paragraph("Tổng tiền cần thanh toán:", normalFont));
            totalcell7.setHorizontalAlignment(Element.ALIGN_LEFT);
            totalcell7.setBorder(Rectangle.NO_BORDER);
            invoiceTable3.addCell(totalcell7);
            PdfPCell totalcell8 = new PdfPCell(
                    new Paragraph(decimalFormat.format(bill.getMoneyAfter() != null ? (bill.getMoneyAfter().longValue()) : 0), headerFont));
            totalcell8.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalcell8.setBorder(Rectangle.NO_BORDER);
            invoiceTable3.addCell(totalcell8);
            document.add(invoiceTable3);

        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        } finally {
            document.close();
        }
        return pdfFile;
    }

    public File genHoaDonGiaoHang(Bill bill, List<BillDetail> billDetails, BillHistory billHistory, Account account) {
        Document document = new Document();
        document.setMargins(30, 30, 30, 30);
        document.setMarginMirroring(true); // Bật đối xứng viền

        File pdfFile = null;

        try {
            DecimalFormat decimalFormat = new DecimalFormat("###,###.## VND");

            pdfFile = new File(bill.getCode() + ".pdf");
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
            document.open();

            // Thiết lập đường viền cho toàn bộ document
            PdfContentByte canvas = writer.getDirectContent();
            canvas.rectangle(30, 30, PageSize.A4.getWidth() - 60, PageSize.A4.getHeight() - 60);
            canvas.stroke();

            BaseFont unicodeFont = BaseFont.createFont(MailConstant.FONT_INVOICE, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font titleFont = new Font(unicodeFont, 25, Font.BOLD);
            Font headerFont = new Font(unicodeFont, 12, Font.BOLD);
            Font normalFont = new Font(unicodeFont, 12);


            ClassPathResource resourceLogoWeb = new ClassPathResource(Constants.LOGO_WEB_PATH);
            ClassPathResource resourceLogoGhn = new ClassPathResource(Constants.LOGO_GHN_PATH);
            Image imgLogoWeb = Image.getInstance(resourceLogoWeb.getURL());
            Image imgLogoGhn = Image.getInstance(resourceLogoGhn.getURL());

            //Hàng 1: Logo
            PdfPTable logoTable = new PdfPTable(2);
            logoTable.setWidthPercentage(100);
            logoTable.getDefaultCell().setBorder(Rectangle.NO_BORDER); // Remove border

            //Cột 1: logoWeb
            imgLogoWeb.scaleAbsolute(200f, 100f); // căn chỉnh kích thước logo

            PdfPCell logoWebCell = new PdfPCell(new Phrase(new Chunk(imgLogoWeb, 0, 0, true)));
            logoWebCell.setBorder(Rectangle.NO_BORDER); // Remove border
            logoWebCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            logoTable.addCell(logoWebCell);

            //Cột 2: LogoGhn
            imgLogoGhn.scaleAbsolute(200f, 100f); // căn chỉnh kích thước logo

            PdfPCell logoGhnCell = new PdfPCell(new Phrase(new Chunk(imgLogoGhn, 0, 0, true)));
            logoGhnCell.setBorder(Rectangle.NO_BORDER); // Remove border
            logoGhnCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            logoTable.addCell(logoGhnCell);

            document.add(logoTable);

            document.add(new Paragraph(" "));

            //Hàng 2: From - To
            PdfPTable row2_info = new PdfPTable(2);
            row2_info.setWidthPercentage(100);

            //Cột 1: From
            String row2Column1TextContent = "Từ: \n + " +
                    "Shop giày thể thao sneaker F-Shoes \n\n " +
                    "Đ/c: FPT PolyTechnic cơ sở Kiều Mai Tunzo, P.Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội \n\n" +
                    "Sđt: 0987676767";
            Phrase row2_info_cell1Content = new Phrase(row2Column1TextContent, normalFont);
            PdfPCell row2_info_cell1 = new PdfPCell(row2_info_cell1Content);
            row2_info_cell1.setPaddingBottom(10);
            row2_info_cell1.setPaddingTop(10);
            row2_info_cell1.setPaddingLeft(10);

            row2_info_cell1.setHorizontalAlignment(Element.ALIGN_LEFT);
            row2_info.addCell(row2_info_cell1);

            // Cột 2: Text "Cột 2"
            String row2Column2TextContent = "Đến: \n" +
                    bill.getFullName() + "\n\n"
                    + "Đ/c: " + bill.getAddress() + "\n\n" +
                    "Sđt: " + bill.getPhoneNumber();
            Phrase row2_info_cell2Content = new Phrase(row2Column2TextContent, normalFont);
            PdfPCell row2_info_cell2 = new PdfPCell(row2_info_cell2Content);
            row2_info_cell2.setPaddingBottom(10);
            row2_info_cell2.setPaddingTop(10);
            row2_info_cell2.setPaddingLeft(10);

            row2_info.addCell(row2_info_cell2);

            document.add(row2_info);

//            document.add(new Paragraph(" "));

// Hàng 3: From - To
            PdfPTable row3_info = new PdfPTable(2);
            row3_info.setWidthPercentage(100);

// Cột 1: QR Code
            BarcodeQRCode qrcode = new BarcodeQRCode(bill.getCode(), 1, 1, null);
            Image qrcodeImage = qrcode.getImage();
            qrcodeImage.scaleAbsolute(100, 100);  // Điều chỉnh kích thước của mã QR Code

// Tính tỉ lệ giữa kích thước QR Code và phần còn lại
            float qrCodeWidthPercentage = 35;  // Điều chỉnh tỉ lệ
            float contentWidthPercentage = 100 - qrCodeWidthPercentage;

// Thêm QR Code vào Cột 1
            PdfPCell row3_info_cell1 = new PdfPCell(qrcodeImage);
            row3_info_cell1.setHorizontalAlignment(Element.ALIGN_CENTER);

// Đặt viền cho cột 1
            row3_info_cell1.setBorder(Rectangle.NO_BORDER); // Xoá hết viền
            row3_info_cell1.setPaddingBottom(10);
            row3_info_cell1.setPaddingTop(10);
            row3_info_cell1.setBorder(Rectangle.BOTTOM | Rectangle.RIGHT);

// Tính chiều rộng tương đối của cột 1 và cột 2
            float[] relativeWidths = {qrCodeWidthPercentage, contentWidthPercentage};
            row3_info.setWidths(relativeWidths);

            row3_info.addCell(row3_info_cell1);

            AtomicReference<String> dsachSP = new AtomicReference<>("");
            billDetails.forEach(billDetail -> {
                dsachSP.set(dsachSP + "+ " + billDetail.getProductDetail().getProduct().getName() + " "
                        + billDetail.getProductDetail().getMaterial().getName() + " " +
                        billDetail.getProductDetail().getSole().getName() + " " +
                        billDetail.getProductDetail().getColor().getName() + " " +
                        "[" + billDetail.getProductDetail().getSize().getSize() + "]  SL: " + billDetail.getQuantity() + "\n");
            });

// Cột 2: Dsach SP
            String row3Column2TextContent = "Nội dung hàng (Tổng SL sản phẩm: " + billDetails.size() + ") \n\n" + dsachSP;
            Phrase row3_info_cell2Content = new Phrase(row3Column2TextContent, normalFont);
            PdfPCell row3_info_cell2 = new PdfPCell(row3_info_cell2Content);
            row3_info_cell2.setPaddingBottom(10);
            row3_info_cell2.setPaddingTop(10);
            row3_info_cell2.setPaddingLeft(10);
            row3_info_cell2.setHorizontalAlignment(Element.ALIGN_LEFT);

// Đặt viền cho cột 2
            row3_info_cell2.setBorder(Rectangle.NO_BORDER); // Xoá hết viền
            row3_info_cell2.setBorder(Rectangle.BOTTOM); // Giữ lại viền dưới


            row3_info.addCell(row3_info_cell2);

            document.add(row3_info);


            document.add(new Paragraph(" "));

            // Hàng 4: Cột 1: From
            PdfPTable row4_info = new PdfPTable(2);
            row4_info.setWidthPercentage(90);

            String row4Column1TextContent = "Tiền thu người nhận: \n\n \t\t" + decimalFormat.format(bill.getMoneyAfter().longValue());
            Phrase row4_info_cell1Content = new Phrase();
            row4_info_cell1Content.add(new Chunk(row4Column1TextContent, new Font(unicodeFont, 12, Font.BOLD))); // Đặt in đậm ở đây
            PdfPCell row4_info_cell1 = new PdfPCell(row4_info_cell1Content);

            row4_info_cell1.setHorizontalAlignment(Element.ALIGN_LEFT);
            row4_info_cell1.setPaddingBottom(10); // Thêm khoảng trắng ở dưới
            row4_info_cell1.setBorder(Rectangle.NO_BORDER); // Remove border
            row4_info.addCell(row4_info_cell1);

// Cột 2: Text "Cột 2"
            String row4Column2TextContent = "Chữ ký người nhận \n (Xác nhận hàng nguyên vẹn, không móp/méo)";
            Phrase row4_info_cell2Content = new Phrase(row4Column2TextContent, normalFont);
            PdfPCell row4_info_cell2 = new PdfPCell(row4_info_cell2Content);
            row4_info_cell2.setHorizontalAlignment(Element.ALIGN_CENTER);
            row4_info_cell2.setPaddingBottom(80); // Thêm khoảng trắng ở dưới
            row4_info.addCell(row4_info_cell2);

            document.add(row4_info);

        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        } finally {
            document.close();
        }
        return pdfFile;
    }


}
