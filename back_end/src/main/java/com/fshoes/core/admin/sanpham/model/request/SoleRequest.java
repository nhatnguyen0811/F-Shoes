package com.fshoes.core.admin.sanpham.model.request;

import com.fshoes.entity.Sole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SoleRequest {

    @NotBlank(message = "Không được để trống tên đế giày")
    @Size(max = 100, message = "Tên đế giày không được vượt quá 100 ký tự")
    private String name;


    public Sole tranSole(Sole sole) {
        sole.setName(this.name.trim());
        return sole;
    }
}
