package kr.co.ginong.web.config.security;

import kr.co.ginong.web.entity.member.Member;
import kr.co.ginong.web.entity.member.MemberRole;
import kr.co.ginong.web.repository.member.MemberRepository;
import kr.co.ginong.web.repository.member.MemberRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class WebOAuth2UserDetailsService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private MemberRepository repository;

    @Autowired
    private MemberRoleRepository memberRoleRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> service = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = service.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        String email = "";
        String username = "";

//        ========================구글 로그인======================
        if ("google".equals(registrationId)) {
            email = oAuth2User.getAttribute("email");
            username = oAuth2User.getAttribute("name");
        }
//        =========================네이버 로그인=======================
        else if ("naver".equals(registrationId)) {
            Map<String, Object> attributes = oAuth2User.getAttributes();
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");

            email = (String) response.get("email");
            username = (String) response.get("name");
        }
//        =========================카카오 로그인===========================
        else if("kakao".equals(registrationId)) {
            Map<String, Object> attributes = oAuth2User.getAttributes();

            Map<String, Object> responseName = (Map<String, Object>) attributes.get("properties");
            Map<String, Object> responseEmail = (Map<String, Object>) attributes.get("kakao_account");

            email = (String) responseEmail.get("email");
            username = (String) responseName.get("nickname");
        }

        Member member = repository.findByEmail(email);

        System.out.println("member: " + member);
        WebUserDetails userDetails = new WebUserDetails();
        if(member == null) {
            userDetails.setAttributes(oAuth2User.getAttributes());
            userDetails.setName(oAuth2User.getName());
            userDetails.setUsername("임시로그인");
            userDetails.setEmail(email);

            return userDetails;
        }
//        ----------------------security info--------------------
        List<MemberRole> roles = memberRoleRepository.findAllByMemberId(member.getId());

        List<GrantedAuthority> authorities = new ArrayList<>();

        for(MemberRole role : roles) //권한 정보들을 꺼내서 authorities에 넣어준다.
            authorities.add(new SimpleGrantedAuthority(role.getRoleName()));

        userDetails.setId(member.getId());
        userDetails.setUsername(member.getUserName());
        userDetails.setPassword(member.getPwd());
        userDetails.setEmail(member.getEmail());
        userDetails.setPhone(member.getPhone());
        userDetails.setState(member.isState());
        userDetails.setName(member.getName());
        userDetails.setAuthorities(authorities);

        return userDetails;
    }
}
