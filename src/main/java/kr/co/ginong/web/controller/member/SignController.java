package kr.co.ginong.web.controller.member;

import jakarta.servlet.http.HttpSession;
import kr.co.ginong.web.entity.member.Mbr;
import kr.co.ginong.web.service.member.SignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequestMapping()
@Controller
public class SignController {
    @Autowired
    private SignService service;

    @GetMapping("signin")
    public String signin() {
        return "member/sign/signin";
    }

    @GetMapping("signup/step1")
    public String step1(HttpSession session, Model model) {
        Boolean age = Optional.ofNullable((Boolean) session.getAttribute("age")).orElse(false);
        Boolean agree = Optional.ofNullable((Boolean) session.getAttribute("agree")).orElse(false);
        Boolean email = Optional.ofNullable((Boolean) session.getAttribute("email")).orElse(false);

        Boolean all = age && agree && email;

        model.addAttribute("all", all);
        model.addAttribute("age", age);
        model.addAttribute("agree", agree);
        model.addAttribute("email", email);
        return "member/sign/step1";
    }

    @PostMapping("signup/step1")
    public String step1(@RequestParam Boolean age
                        , @RequestParam Boolean agree
                        , @RequestParam(defaultValue = "false") Boolean email
                        , HttpSession session) {

        session.setAttribute("age",age);
        session.setAttribute("agree",agree);
        session.setAttribute("email",email);
        return "redirect:step2";
    }

    @GetMapping("signup/step2")
    public String step2(){
        return "member/sign/step2";
    }

    @PostMapping("signup/step2")
    public String step2(@ModelAttribute Mbr member, HttpSession session) {
        Boolean rxEmail = (Boolean) session.getAttribute("email");
        member.setEmailRxYn(rxEmail);
        System.out.println(member);
        member.setMbrNo(1111);
        member.setPwd("sldk");
        member.setUserNm("admin");

       boolean test = service.addMember(member);
        System.out.println(test);
        session.setAttribute("member", member);
        return "redirect:step3";
    }

    @GetMapping("signup/step3")
    public String step3(@SessionAttribute("member") Mbr member){
        return "member/sign/step3";
    }
}
