package kr.co.ginong.web.config.security;

import kr.co.ginong.web.entity.member.Mbr;
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
        Mbr member = repository.findByUsername(username);                                //username 으로 member 테이블에서 찾은 member 객체 생성
        List<MemberRole> roles = memberRoleRepository.findAllByMemberId(member.getId());    //MEMBER_ROLE 테이블의 외래키 member_id 를 이용하여 권한을 List 로 담음

        List<GrantedAuthority> authorities = new ArrayList<>();

        for(MemberRole role : roles) //권한 정보들을 꺼내서 authorities에 넣어준다.
            authorities.add(new SimpleGrantedAuthority(role.getRoleName()));

        WebUserDetails userDetails = new WebUserDetails();

        //userDetails 에 정보를 담아줌. 이 정보는 세션으로 로그인 한 페이지에 들고 다니고, 필요정보를 빼다 쓸수 있음
        //기농이네 트렐로 Study 참고
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