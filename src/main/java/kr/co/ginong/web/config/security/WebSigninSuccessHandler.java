package kr.co.ginong.web.config.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class WebSigninSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    static final String REQUEST_PARAM_NAME = "rememberUsername";            //signin.html 아이디 저장 체크박스 name

    static final String COOKIE_NAME = "saved_username";                     //쿠키 이름

    static final int DEFAULT_MAX_AGE = 60*60*24*90;                         //60초*60분*24시간*90일=>90일의 생명주기

    private int maxAge = DEFAULT_MAX_AGE;                                   //쿠키의 생명주기 설정

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();


    //인증에 성공 했을때 처리할 로직 작성할 메소드
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        String targetUrl="/";
        WebUserDetails userDetails = (WebUserDetails) authentication.getPrincipal();

    // ======================= 비회원 소셜 로그인 시 =========================================

        if(userDetails.getAuthorities() == null) {
            targetUrl = "/signup/social";
            redirectStrategy.sendRedirect(request,response,targetUrl);
        }
    // ======================= 일반 로그인 및 기존 회원 신규 소셜 로그인 시(권한이 있다면) =========================================
        else{
            String remember = request.getParameter(REQUEST_PARAM_NAME);                             //signin 페이지에 아이디 저장 체크 박스를 누르면 "on"이 들어옴
            if ("on".equals(remember)) {                                                            //체크박스를 체크 했으면
                String username = ((WebUserDetails) authentication.getPrincipal()).getUsername();   //로그인시 사용했던 username 을 꺼내온다.
                Cookie cookie = new Cookie(COOKIE_NAME, username);                                  //Cookie 생성 후 saved_username 이라는 이름으로 username 을 담아준다.
                cookie.setMaxAge(maxAge);                                                           //생명주기를 2달로 설정
                cookie.setPath("/signin");                                                          //saved_username cookie 를 사용할 url 설정
                response.addCookie(cookie);                                                         //HttpServletResponse response에 cookie 추가
            } else {                                                                                //signin 페이지 아이디 저장 체크 박스를 누르지 않는다면
                Cookie cookie = new Cookie(COOKIE_NAME, "");                                  //빈 문자열의 cookie 를 생성, 생명주기도 없는체 만든다.
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
            targetUrl = "/cart/add";  //쿠키에 담긴 장바구니 목록 저장하기 위한 url
            getRedirectStrategy().sendRedirect(request, response, targetUrl);                       //cart/add로 리다이렉트
            super.onAuthenticationSuccess(request, response, authentication);                       //onAuthenticationSuccess 에 정의 된 나머지 동작들을 수행
        }

    }



}
