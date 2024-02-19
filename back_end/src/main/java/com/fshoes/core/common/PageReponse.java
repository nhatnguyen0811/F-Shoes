package com.fshoes.core.common;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class PageReponse<T> {
    private List<T> data;
    private long totalPages;
    private int currentPage;

    public PageReponse(Page<T> page) {
        this.data = page.getContent();
        this.totalPages = page.getTotalPages();
        this.currentPage = page.getNumber();
    }
}
