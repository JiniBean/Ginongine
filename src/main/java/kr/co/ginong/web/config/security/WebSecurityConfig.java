package kr.co.ginong.web.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
public class WebSecurityConfig{


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
		.anyRequest().permitAll());

		return http.build();
	}

}

