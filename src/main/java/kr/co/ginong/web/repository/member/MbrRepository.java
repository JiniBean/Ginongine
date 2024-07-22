package kr.co.ginong.web.repository.member;

import kr.co.ginong.web.entity.member.Mbr;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MbrRepository {

    Mbr findByUsername(String username);
    Mbr findByEmail(String email);
    Mbr findByMbrNo(Integer mbrNo);
}
