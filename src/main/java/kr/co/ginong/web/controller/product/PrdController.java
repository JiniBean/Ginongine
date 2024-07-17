package kr.co.ginong.web.controller.product;


import kr.co.ginong.web.entity.product.Prd;
import kr.co.ginong.web.service.product.PrdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("prd")
public class PrdController {

    @Autowired
    private PrdService service;

    @GetMapping("list")
    public String list(Model model){

        List<Prd> list = service.getList();
        System.out.println(list);
        for(Prd p : list){
            p.setLikeCount(0);
            p.setCartQty(1);
        }
        model.addAttribute("list",list);
        return "product/product/user/list";
//        return null;
    }
}
