package kr.co.ginong.web.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
public class WebSecurityConfig{

	@Autowired
	private DataSource dataSource;


	@Autowired
	private WebOAuth2UserDetailsService oAuth2UserDetailsService;


	@Bean
	public PasswordEncoder passwordEncoder(){
		PasswordEncoder encoder = new BCryptPasswordEncoder();

		return encoder;
	}
    @Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http
		.csrf((csrf) -> csrf.disable())
		.authorizeHttpRequests((requests) -> requests
		.requestMatchers("/admin/**").hasRole("ADMIN")
		.requestMatchers("/mypage/**").hasAnyRole("ADMIN","MEMBER")
		.requestMatchers("/order/**").hasAnyRole("ADMIN","MEMBER")
		.requestMatchers("/review/**").hasAnyRole("ADMIN","MEMBER")
		.requestMatchers("/inquiry/**").hasAnyRole("ADMIN","MEMBER")
		.anyRequest().permitAll())
		.formLogin((form)->form
				.loginPage("/signin")
				.permitAll()
				.successHandler(webSigninSuccessHandler())					//로그인 성공 시 처리 로직
				.failureHandler(new WebSigninFailureHandler())				//로그인 실패 시 처리 로직
				)
		.oauth2Login(config->config
				.userInfoEndpoint(userInfo->userInfo
				.userService(oAuth2UserDetailsService))
				.successHandler(webSigninSuccessHandler())
				)
		.logout((logout)->logout
				.logoutUrl("/signsout")
				.logoutSuccessUrl("/index")									//로그아웃 성공시 보낼 url
				.permitAll());

		return http.build();
	}
	@Bean
	public WebSigninSuccessHandler webSigninSuccessHandler(){
		WebSigninSuccessHandler handler = new WebSigninSuccessHandler();		//로그인 성공 시 수행할 WebSigninSuccessHandler 객체 생성

		handler.setAlwaysUseDefaultTargetUrl(true);								//WebSigninSuccessHandler의 determineTargetUrl 메소드에 설정한 주소로 항상 리다이렉트
		return handler;
	}
}

