package kr.co.ginong.web.config.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;

@Component
public class WebSigninFailureHandler extends SimpleUrlAuthenticationFailureHandler {                                //로그인 실패 헨들러
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
            throws IOException, ServletException {
        String errorMessage;

        if(exception instanceof BadCredentialsException) {                              //비밀번호 불일치 예외처리
            errorMessage = "아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.";
        } else if (exception instanceof InternalAuthenticationServiceException) {       //내부적 오류 예외 처리
            errorMessage = "내부 시스템 문제로 로그인 요청을 처리할 수 없습니다. 관리자에게 문의하세요. ";
        } else if (exception instanceof UsernameNotFoundException) {                    //ID가 DB에 없을 시 예외처리
            errorMessage = "아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.";
        } else if (exception instanceof AuthenticationCredentialsNotFoundException) {   //인증되지 않은 사용자 예외처리
            errorMessage = "인증 요청이 거부되었습니다. 관리자에게 문의하세요.";
        } else {                                                                        //기타
            errorMessage = "알 수 없는 오류로 로그인 요청을 처리할 수 없습니다. 관리자에게 문의하세요.";
        }

        errorMessage = URLEncoder.encode(errorMessage, "UTF-8"); /* 한글 인코딩 깨진 문제 방지 */
        setDefaultFailureUrl("/signin?error=true&exception="+errorMessage);
        super.onAuthenticationFailure(request, response, exception);            //onAuthenticationFailure 메소드의 나머지 기능을 수행
    }


}
