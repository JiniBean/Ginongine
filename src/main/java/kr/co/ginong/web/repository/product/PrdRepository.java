package kr.co.ginong.web.repository.product;

import kr.co.ginong.web.entity.product.Prd;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PrdRepository {

    List<Prd> findAll();
}
