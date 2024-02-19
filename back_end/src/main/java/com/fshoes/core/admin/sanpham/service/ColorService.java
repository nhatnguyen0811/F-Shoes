package com.fshoes.core.admin.sanpham.service;

import com.fshoes.core.admin.sanpham.model.request.ColorFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.ColorRequest;
import com.fshoes.core.admin.sanpham.model.respone.ColorResponse;
import com.fshoes.entity.Color;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ColorService {
    List<Color> findAll();

    List<Color> getListColor();

    Page<ColorResponse> getColor(ColorFilterRequest colorFilterRequest);

    Color addColor(ColorRequest colorRequest);

    Color updateColor(String id, ColorRequest colorRequest);

    Boolean swapColor(String id);

    List<String> getAllCodeColor();

    List<String> getAllNameColor();
}
