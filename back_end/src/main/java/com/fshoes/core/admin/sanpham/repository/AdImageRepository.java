package com.fshoes.core.admin.sanpham.repository;

import com.fshoes.entity.Image;
import com.fshoes.repository.ImageRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdImageRepository extends ImageRepository {
    List<Image> getImageByProductDetailId(String productDetailId);
}
