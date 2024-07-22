package kr.co.ginong.web.config.security;

import kr.co.ginong.web.entity.member.Mbr;
import kr.co.ginong.web.entity.member.MbrRole;
import kr.co.ginong.web.repository.member.MbrRepository;
import kr.co.ginong.web.repository.member.MbrRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WebUserDetailsService implements UserDetailsService {

    @Autowired
    private MbrRepository repository;

    @Autowired
    private MbrRoleRepository roleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Mbr member = repository.findByUsername(username);
        List<MbrRole> roles = roleRepository.findByMbrNo(member.getMbrNo());

        List<GrantedAuthority> authorities = new ArrayList<>();

        for(MbrRole role : roles) //권한 정보들을 꺼내서 authorities에 넣어준다.
            authorities.add(new SimpleGrantedAuthority(role.getRoleNm()));

        WebUserDetails userDetails = new WebUserDetails();

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