package com.fshoes.entity;

import com.fshoes.entity.base.PrimaryEntity;
import com.fshoes.infrastructure.constant.EntityProperties;
import com.fshoes.infrastructure.constant.Status;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_detail")
public class ProductDetail extends PrimaryEntity {

    @Column(length = EntityProperties.LENGTH_CODE)
    private String code;

    private BigDecimal price;

    private Integer weight;

    private Status deleted = Status.HOAT_DONG;

    private Integer amount;

    private Integer quantityReturn = 0;


    @Column(columnDefinition = EntityProperties.DEFINITION_DESCRIPTION)
    private String description;
    @ManyToOne
    @JoinColumn(name = "id_brand", referencedColumnName = "id")
    private Brand brand;
    @ManyToOne
    @JoinColumn(name = "id_sole", referencedColumnName = "id")
    private Sole sole;
    @ManyToOne
    @JoinColumn(name = "id_material", referencedColumnName = "id")
    private Material material;
    @ManyToOne
    @JoinColumn(name = "id_category", referencedColumnName = "id")
    private Category category;
    @ManyToOne
    @JoinColumn(name = "id_product", referencedColumnName = "id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "id_size", referencedColumnName = "id")
    private Size size;
    @ManyToOne
    @JoinColumn(name = "id_color", referencedColumnName = "id")
    private Color color;

    public Integer getDeleted() {
        return deleted.ordinal();
    }

    public void setDeleted(Integer deleted) {
        this.deleted = Status.values()[deleted];
    }
}
