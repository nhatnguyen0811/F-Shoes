package com.fshoes.infrastructure.constant;

import com.fshoes.util.PropertiesReader;
import lombok.Getter;

@Getter
public enum Message {

    SUCCESS("Success"),

    // viết các lỗi ở đây
    API_ERROR(PropertiesReader.getProperty(PropertyKeys.API_ERROR)),
    PRODUCT_DETAIL_NOT_EXIST(PropertiesReader.getProperty(PropertyKeys.PRODUCT_DETAIL_NOT_EXIST));
    private String message;

    Message(String message) {
        this.message = message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
