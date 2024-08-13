package kr.co.ginong.web.entity.code;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CodeDetail {
    private String  groupCd;	/** 그룹_코드 */
    private String  detailCd;	/** 상세_코드 */
    private String  detailNm;	/** 상세_명 */
    private Integer orderNo;	/** 정렬_번호 */

}
