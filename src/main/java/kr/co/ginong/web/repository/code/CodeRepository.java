package kr.co.ginong.web.repository.code;

import kr.co.ginong.web.entity.code.CodeDetail;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CodeRepository {
    List<CodeDetail> find(String groupCode);
}
