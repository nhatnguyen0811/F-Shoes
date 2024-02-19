package com.fshoes.infrastructure.constant;

public final class Regex {
    public static final String REGEX_EMAIL = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\\\.[A-Za-z0-9-]+)*(\\\\.[A-Za-z]{2,})$";
    public static final String REGEX_PHONE = "(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}";
    public static final String REGEX_DATE = "^(0[1-9]|1[012])/(0[1-9]|[12][0-9]|[3][01])/\\\\\\\\d{4}$";

}
