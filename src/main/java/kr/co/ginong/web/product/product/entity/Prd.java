package kr.co.ginong.web.product.product.entity;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Prd {
    private Integer prdNo;
    private String prdNm;
    private Integer price;
    private String Desc;
    private Integer qty;
    private String qtyCtgCd;
    private String qtyCtgNm;
    private Integer wt;
    private String wtCtgCd;
    private String wtCtgNm;
    private String exp;
    private String stgTypeCd;
    private String stgTypeNm;
    private Date startDd;
    private Date endDd;
    private String thmbNm;
    private String thmbPath;
    private Boolean useYn;
    private String prdCtgNo;
    private String prdCtgNm;
    private Integer prdImgNo;

}