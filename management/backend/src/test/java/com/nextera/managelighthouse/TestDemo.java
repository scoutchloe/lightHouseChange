package com.nextera.managelighthouse;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.regex.Pattern;

/**
 * @author Scout
 * @date 2025-06-13 7:58
 * @since 1.0
 */
public class TestDemo {
    public static void main(String[] args) {
        Pattern BCRYPT_PATTERN = Pattern.compile("\\A\\$2(a|y|b)?\\$(\\d\\d)\\$[./0-9A-Za-z]{53}");
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        System.out.println(passwordEncoder.encode("admin123"));
        String encodedPassword = "$2a$10$mftlUpb4WrCeta0WXQkjSOto79bhs7i23Os.AysRuGVX7cVZgPbCS";

        System.out.println(BCRYPT_PATTERN.matcher(encodedPassword).matches());
        System.out.println(passwordEncoder.matches("admin123", encodedPassword));
    }
}