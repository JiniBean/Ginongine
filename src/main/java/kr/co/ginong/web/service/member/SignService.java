package kr.co.ginong.web.service.member;

import kr.co.ginong.web.entity.member.Mbr;
import org.springframework.stereotype.Service;


public interface SignService {

    Boolean addMember(Mbr member);
}
