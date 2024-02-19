package com.fshoes.infrastructure.constant;

public class Constants {

    public static final String VERSION = "v1.0.0";
    public static final String ENCODING_UTF8 = "UTF-8";

    public static final String LOGO_WEB_PATH = "/static/images/logoweb.png";

    public static final String LOGO_GHN_PATH = "/static/images/logo-ghn.png";

    private Constants() {

    }

    public class FileProperties {
        public static final String PROPERTIES_APPLICATION = "application.properties";
        public static final String PROPERTIES_VALIDATION = "messages.properties";

        private FileProperties() {
        }
    }
}
