package kr.co.ginong.web.controller.order;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.ginong.web.config.security.WebUserDetails;
import kr.co.ginong.web.entity.order.Cart;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("cart")
@Controller
public class CartController {

    @GetMapping("/add")
    public String add(HttpServletRequest req
                    , HttpServletResponse res
                    , @CookieValue("cartList") List<Cart> cookieList
                    , @AuthenticationPrincipal WebUserDetails userDetails){


        String targetUrl = "/"; // 기본 페이지 설정

        SavedRequest savedRequest = new HttpSessionRequestCache().getRequest(req, null);     // 세션에서 원래의 요청 URL 가져오기
        if (savedRequest != null) {                                                                   // 세션에서 저장된 targetUrl이 있다면 그것을 반환
            targetUrl = savedRequest.getRedirectUrl();
        }

        return targetUrl;
    }
}
