package com.fshoes.core.admin.khuyenmai.service;

import com.fshoes.core.admin.khuyenmai.model.request.ProductPromotionAddRequest;
import com.fshoes.core.admin.khuyenmai.model.request.PromotionSearch;
import com.fshoes.core.admin.khuyenmai.model.respone.PromotionRespone;
import com.fshoes.entity.Promotion;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public interface PromotionService {

    Promotion getOne(String id);

    List<PromotionRespone> getAllPromotion();

    Promotion deleteKhuyenMai(String id) throws ParseException;

    Promotion updateKhuyenMai(ProductPromotionAddRequest request, String id) throws ParseException;

    Promotion addKhuyenMaiOnProduct(ProductPromotionAddRequest request) throws ParseException;

    //=======================================================================

    Page<PromotionRespone> getAllPromotion(PromotionSearch filter);

    Boolean exportExcel() throws IOException;

}
