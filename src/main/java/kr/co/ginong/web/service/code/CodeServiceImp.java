package kr.co.ginong.web.service.code;

import kr.co.ginong.web.entity.code.CodeDetail;
import kr.co.ginong.web.repository.code.CodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CodeServiceImp implements CodeService {
    @Autowired
    private CodeRepository repository;
    @Override
    public List<CodeDetail> getList(String groupCode) {
        return repository.find(groupCode);
    }
}
