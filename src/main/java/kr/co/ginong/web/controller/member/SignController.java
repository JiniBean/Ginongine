package kr.co.ginong.web.controller.member;

import jakarta.servlet.http.HttpSession;
import kr.co.ginong.web.entity.member.Mbr;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RequestMapping()
@Controller
public class SignController {

    @GetMapping("signin")
    public String signin() {
        return "member/sign/signin";
    }

    @GetMapping("signup/step1")
    public String step1(HttpSession session, Model model) {
        Boolean age = (Boolean) session.getAttribute("age");
        Boolean agree = (Boolean) session.getAttribute("agree");
        Boolean email = (Boolean) session.getAttribute("email");
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
    public String step2(@RequestParam Mbr member
            ,HttpSession session) {

        Boolean rxEmail = (Boolean) session.getAttribute("email");
        member.setEmailRxYn(rxEmail);
        session.setAttribute("member",member);
        return "redirect:step3";
    }
}
