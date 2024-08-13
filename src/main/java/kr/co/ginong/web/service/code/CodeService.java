package kr.co.ginong.web.service.code;

import kr.co.ginong.web.entity.code.CodeDetail;

import java.util.List;

public interface CodeService {
    List<CodeDetail> getList(String groupCode);
}
