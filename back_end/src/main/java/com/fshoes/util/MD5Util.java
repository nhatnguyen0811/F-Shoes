package com.fshoes.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util {
    public static String getMD5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            return convertByteToHex(messageDigest);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private static String convertByteToHex(byte[] data) {
        StringBuilder sb = new StringBuilder();
        for (byte datum : data) {
            sb.append(Integer.toString((datum & 0xff) + 0x100, 16).substring(1));
        }
        return sb.toString();
    }
}
