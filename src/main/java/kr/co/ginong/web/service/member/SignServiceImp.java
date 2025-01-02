package kr.co.ginong.web.service.member;
import kr.co.ginong.web.entity.member.Mbr;
import kr.co.ginong.web.repository.member.MbrRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
public class SignServiceImp implements SignService{

    @Autowired
    private MbrRepository mbrRepository;

    @Autowired
    private AuthenticationManager authManager;

    @Override
    @Transactional
    public Boolean addMember(Mbr member) {
        Mbr mbr;
        int num;

        // 회원번호 생성 및 중복 확인
        do {
            Random random = new Random();
            num = 10000000 + random.nextInt(90000000);  // 8자리 난수 생성 (10000000 ~ 99999999)

            mbr = mbrRepository.findByMbrNo(num);
        } while (mbr != null);

        //비밀번호 암호화
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String pwd = member.getPwd();
        member.setPwd(encoder.encode(pwd));

        member.setMbrNo(num);
        boolean isValid = mbrRepository.save(member);
        if (isValid) {
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(member.getUserNm(), pwd);
            Authentication auth = authManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        return isValid;
    }

    @Override
    public Boolean checkMember(Mbr member) {
        Mbr mbr;
        if(member.getMbrNo()!=null)
            mbr = mbrRepository.findByMbrNo(member.getMbrNo());
        else if (member.getUserNm()!=null)
            mbr = mbrRepository.findByUsername(member.getUserNm());
        else
            mbr = mbrRepository.findByEmail(member.getEmail());

        return mbr != null;
    }

    @Override
    public Mbr getMember(String username) {
        return mbrRepository.findByUsername(username);
    }
}
