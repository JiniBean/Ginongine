package kr.co.ginong.web.entity.product;


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
    private String prdCtgCd;
    private String prdCtgNm;
    private Integer prdImgNo;
    private Integer likeCount;
    private Integer cartQty;

}