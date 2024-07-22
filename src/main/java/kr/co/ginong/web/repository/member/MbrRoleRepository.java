package kr.co.ginong.web.repository.member;

import kr.co.ginong.web.entity.member.MbrRole;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MbrRoleRepository {

    List<MbrRole> findByMbrNo(Integer mbrNO);
}
