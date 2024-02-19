package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.entity.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    private String name;

    public Category tranCategory(Category category) {
        category.setName(this.name.trim());
        return category;
    }
}
