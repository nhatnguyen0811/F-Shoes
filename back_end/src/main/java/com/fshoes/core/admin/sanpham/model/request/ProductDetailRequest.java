package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.entity.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class ProductDetailRequest {

    private String idSole;

    private String idBrand;

    private String idCategory;

    private String idMaterial;

    private String idSize;

    private String idColor;

    private String nameProduct;

    private String idProduct;

    private String price;

    private String amount;

    private String weight;

    private String description;

    private List<String> listImage;


    public ProductDetail tranDetail(ProductDetail productDetail) {

        Sole sole = new Sole();
        sole.setId(this.getIdSole());
        productDetail.setSole(sole);

        Brand brand = new Brand();
        brand.setId(this.getIdBrand());
        productDetail.setBrand(brand);

        Category category = new Category();
        category.setId(this.getIdCategory());
        productDetail.setCategory(category);

        Material material = new Material();
        material.setId(this.getIdMaterial());
        productDetail.setMaterial(material);

        Size size = new Size();
        size.setId(this.getIdSize());
        productDetail.setSize(size);

        Color color = new Color();
        color.setId(this.idColor);
        productDetail.setColor(color);

        productDetail.setPrice(BigDecimal.valueOf(Long.parseLong(this.price)));

        productDetail.setAmount(Integer.valueOf(this.amount));

        productDetail.setWeight(Integer.parseInt(this.weight));

        productDetail.setDescription(this.description);

        return productDetail;
    }

}
