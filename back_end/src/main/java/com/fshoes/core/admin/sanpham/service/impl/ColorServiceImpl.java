package com.fshoes.core.admin.sanpham.service.impl;

import com.fshoes.core.admin.sanpham.model.request.ColorFilterRequest;
import com.fshoes.core.admin.sanpham.model.request.ColorRequest;
import com.fshoes.core.admin.sanpham.model.respone.ColorResponse;
import com.fshoes.core.admin.sanpham.repository.AdColorRepository;
import com.fshoes.core.admin.sanpham.service.ColorService;
import com.fshoes.entity.Color;
import com.fshoes.infrastructure.cloudinary.CloudinaryImage;
import com.fshoes.infrastructure.constant.Status;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorServiceImpl implements ColorService {

    @Autowired
    private AdColorRepository colorRepository;

    @Autowired
    private CloudinaryImage cloudinaryImage;

    public List<Color> findAll() {
        return colorRepository.findAll();
    }

    @Override
    public List<Color> getListColor() {
        return colorRepository.findAllByDeletedOrderByCreatedAtAsc(Status.HOAT_DONG);
    }

    @Override
    public Page<ColorResponse> getColor(ColorFilterRequest colorFilterRequest) {
        Pageable pageable = PageRequest.of(colorFilterRequest.getPage() - 1, colorFilterRequest.getSize());
        return colorRepository.getColorByFilter(colorFilterRequest, pageable);
    }

    @Override
    @Transactional
    public Color addColor(ColorRequest colorRequest) {
        Color color = colorRequest.tranColor(new Color());
        color.setDeleted(0);
        cloudinaryImage.createFolder(colorRepository.save(color).getId());
        return color;
    }

    @Override
    public Color updateColor(String id, ColorRequest colorRequest) {
        Optional<Color> colorOptional = colorRepository.findById(id);
        if (colorOptional.isPresent()) {
            Color color = colorRequest.tranColor(colorOptional.get());
            return colorRepository.save(color);
        } else {
            return null;
        }
    }

    @Override
    public Boolean swapColor(String id) {
        Optional<Color> colorOptional = colorRepository.findById(id);
        if (colorOptional.isPresent()) {
            Color color = colorOptional.get();
            if (color.getDeleted() == 0) {
                color.setDeleted(1);
            } else {
                color.setDeleted(0);
            }
            colorRepository.save(color);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<String> getAllCodeColor() {
        return colorRepository.getAllCodeColor();
    }

    @Override
    public List<String> getAllNameColor() {
        return colorRepository.getAllNameColor();
    }
}
