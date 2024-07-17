package kr.co.ginong.web.service.product;

import kr.co.ginong.web.entity.product.Prd;
import kr.co.ginong.web.repository.product.PrdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrdServiceImp implements PrdService{

    @Autowired
    private PrdRepository repository;

    @Override
    public List<Prd> getList() {
        return repository.findAll();
    }
}
