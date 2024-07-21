package kr.co.ginong.web.entity.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Mbr {
    private Integer mbrNo;	    /** 회원_번호 */
    private String  nm;	        /** 이름 */
    private String  userNm;	    /** ID */
    private String  pwd;	    /** 비밀번호 */
    private String  email;	    /** 이메일 */
    private String  phone;	    /** 연락처 */
    private Boolean emailRxYn;	/** 이메일_수신_여부 */
    private Boolean mbrStatus;	/** 회원_상태 */
    private Date    joinDt;	    /** 가입_일시 */
    private Date    cxlDt;	    /** 탈퇴_일시 */


}
