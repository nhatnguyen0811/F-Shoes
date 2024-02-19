package com.fshoes.core.admin.returns.model.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class ReturnDetailRequest {
    private String name;
    private Integer quantity;
    private String price;
    private String idBillDetail;
    private String note;
    private List<MultipartFile> images;
}
