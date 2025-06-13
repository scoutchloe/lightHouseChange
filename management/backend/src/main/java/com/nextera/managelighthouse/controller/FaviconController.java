package com.nextera.managelighthouse.controller;//...

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class FaviconController {
 
    @GetMapping("favicon.ico")
    @ResponseBody
    public void returnNoFavicon() {
    }
}