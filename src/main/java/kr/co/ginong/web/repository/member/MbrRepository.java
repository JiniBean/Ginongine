package kr.co.ginong.web.repository.member;

import kr.co.ginong.web.entity.member.Mbr;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MbrRepository {

    List<Mbr> findAll();
}
