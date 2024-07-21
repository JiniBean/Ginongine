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
public class MbrRole {
    private Integer roleNo;	/** 권한_번호 */
    private String  roleNm;	/** 권한_명 */
    private Integer mbrNo;	/** 회원_번호 */

}
