package kr.co.ginong.web.service.product;

import kr.co.ginong.web.entity.product.Prd;

import java.util.List;

public interface PrdService {
    List<Prd> getList(String ctgCd, String query, Integer sortType);
}
