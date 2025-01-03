package kr.co.ginong.web.controller.member;

import jakarta.servlet.http.HttpSession;
import kr.co.ginong.web.config.security.WebUserDetails;
import kr.co.ginong.web.entity.code.CodeDetail;
import kr.co.ginong.web.entity.member.Mbr;
import kr.co.ginong.web.service.code.CodeService;
import kr.co.ginong.web.service.member.SignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping()
@Controller
public class SignController {
    @Autowired
    private SignService service;

    @Autowired
    private CodeService codeService;

    @GetMapping("signin")
    public String signin() {
        return "member/sign/signin";
    }

    @GetMapping("signup/step1")
    public String step1() {

        return "member/sign/step1";
    }


    @GetMapping("signup/step2")
    public String step2(){
        return "member/sign/step2";
    }

    @PostMapping("signup/step2")
    public String step2(@ModelAttribute Mbr member, HttpSession session) {

        Boolean rxEmail = (Boolean) session.getAttribute("email");
        member.setEmailRxYn(rxEmail);

        session.setAttribute("member", member);
        return "redirect:step3";
    }

    @GetMapping("signup/step3")
    public String step3(Model model){
        List<CodeDetail> routeList = codeService.getList("MBR_JOIN_RT");
        model.addAttribute("routeList", routeList);
        return "member/sign/step3";
    }

    @PostMapping("signup/step3")
    public String step3(@ModelAttribute Mbr member, HttpSession session) {
        Mbr mbr = (Mbr)session.getAttribute("member");
        mbr.setMbrNo(member.getMbrNo());
        mbr.setUserNm(member.getUserNm());
        mbr.setPwd(member.getPwd());
        mbr.setJoinRtCd(member.getJoinRtCd());

        session.removeAttribute("member");
        boolean save = service.addMember(mbr);
        if(!save){
            return "redirect:step3";
        }
        return "redirect:complete";
    }

    @GetMapping("signup/complete")
    public String complete(Model model,
                           @AuthenticationPrincipal WebUserDetails user) {

        model.addAttribute("name", user.getName());

        return "member/sign/complete";
    }
}
