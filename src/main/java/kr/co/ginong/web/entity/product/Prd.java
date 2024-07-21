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
    private Integer prdNo;	    /** 상품_번호 */
    private String  prdNm;	    /** 상품_이름 */
    private Integer price;	    /** 가격 */
    private String  desc;	    /** 설명 */
    private Integer qty;	    /** 수량 */
    private String  qtyCtgCd;	/** 수량_카테고리_코드 */
    private String  qtyCtgNm;   /** 수량_카테고리_값 */
    private Integer wt;	        /** 중량 */
    private String  wtCtgCd;    /** 중량_카테고리_코드 */
    private String  wtCtgNm;    /** 중량_카테고리_값 */
    private String  exp;	    /** 유통기한 */
    private String  stgTypeCd;	/** 보관_유형_코드 */
    private String  stgTypeNm;  /** 보관_유형_값 */
    private Date    startDd;	/** (시즌)시작_일자 */
    private Date    endDd;	    /** (시즌)종료_일자 */
    private String  thmbNm;	    /** 썸네일_이름 */
    private String  thmbPath;	/** 썸네일_경로 */
    private Boolean useYn;	    /** 사용_여부 */
    private String  prdCtgCd;	/** 상품_카테고리_코드 */
    private String  prdCtgNm;   /** 상품_카테고리_이름 */
    private Integer likeCnt;    /** 추천수 */
    private Integer cartQty;    /** 장바구니 수량 */ /* 로그인 시에만 사용 */

}