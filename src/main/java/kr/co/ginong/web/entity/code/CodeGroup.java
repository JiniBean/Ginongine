package kr.co.ginong.web.entity.code;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CodeGroup {
    private String  groupCd;	/** 그룹_코드 */
    private String  groupNm;	/** 그룹_명 */
    private Date    regDt;	    /** 등록_일시 */
    private Date    modiDt;	    /** 수정_일시 */

}
