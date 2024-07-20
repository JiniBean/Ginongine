package kr.co.ginong.web.controller.product;


import kr.co.ginong.web.entity.product.Prd;
import kr.co.ginong.web.service.product.PrdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("prd")
public class PrdController {

    @Autowired
    private PrdService service;

    @GetMapping("list")
    public String list(
            @RequestParam(name = "c", required = false) String ctgCd
            , @RequestParam(name = "q", required = false) String query
            , @RequestParam(name = "s", required = false) Integer sortType
//            , @AuthenticationPrincipal WebUserDetails userDetails
            ,Model model){

        List<Prd> list = service.getList(ctgCd,query,sortType);
        model.addAttribute("list",list);
        return "product/product/user/list";
//        return null;
    }
}
