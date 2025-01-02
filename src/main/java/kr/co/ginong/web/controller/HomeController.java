package kr.co.ginong.web.controller;

import kr.co.ginong.web.entity.product.Prd;
import kr.co.ginong.web.service.product.PrdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping(value = {"/", "/index", "/home"})
public class HomeController {

    @Autowired
    private PrdService service;

    @GetMapping()
    public String list(
            @RequestParam(name = "c", required = false) String ctgCd
            , @RequestParam(name = "q", required = false) String query
            , @RequestParam(name = "s", required = false) Integer sortType
//            , @AuthenticationPrincipal WebUserDetails userDetails
            , Model model){

        List<Prd> list = service.getList(ctgCd,query,sortType);
        model.addAttribute("list",list);
        return "product/product/user/list";
//        return null;
    }
}
