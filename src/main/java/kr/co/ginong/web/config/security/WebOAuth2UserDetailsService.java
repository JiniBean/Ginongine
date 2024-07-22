package kr.co.ginong.web.config.security;

import kr.co.ginong.web.entity.member.Mbr;
import kr.co.ginong.web.entity.member.MbrRole;
import kr.co.ginong.web.repository.member.MbrRepository;
import kr.co.ginong.web.repository.member.MbrRoleRepository;
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
    private MbrRepository repository;

    @Autowired
    private MbrRoleRepository roleRepository;

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

        WebUserDetails userDetails = new WebUserDetails();
        Mbr member = repository.findByEmail(email);

        //기존 정보가 없을 때
        if(member == null) {
            userDetails.setAttributes(oAuth2User.getAttributes());
            userDetails.setNm(oAuth2User.getName());
            userDetails.setUserNm("임시로그인");
            userDetails.setEmail(email);

            return userDetails;
        }

        // 해당 email이 DB에 있을 때 (이미 회원가입 되어있을 때)
        List<MbrRole> roles = roleRepository.findByMbrNo(member.getMbrNo());

        List<GrantedAuthority> authorities = new ArrayList<>();

        for(MbrRole role : roles) //권한 정보들을 꺼내서 authorities에 넣어준다.
            authorities.add(new SimpleGrantedAuthority(role.getRoleNm()));


        //userDetails 에 정보를 담아줌. 이 정보는 세션으로 로그인 한 페이지에 들고 다니고, 필요정보를 빼다 쓸수 있음
        userDetails.setMbrNo(member.getMbrNo());
        userDetails.setNm(member.getNm());
        userDetails.setUserNm(member.getUserNm());
        userDetails.setPwd(member.getPwd());
        userDetails.setEmail(member.getEmail());
        userDetails.setPhone(member.getPhone());
        userDetails.setMbrStatus(member.getMbrStatus());
        userDetails.setAuthorities(authorities);

        return userDetails;
    }
}
