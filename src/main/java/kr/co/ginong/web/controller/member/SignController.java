package kr.co.ginong.web.controller.member;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping()
@Controller
public class SignController {

    @GetMapping("signin")
    public String signin() {
        return "member/sign/signin";
    }

    @GetMapping("signup/step1")
    public String step1() {
        return "member/sign/step1";
    }
}
