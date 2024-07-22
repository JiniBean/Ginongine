package kr.co.ginong.web.entity.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Cart {
    private Integer prdNo;	/** 상품_번호 */
    private Integer mbrNo;	/** 회원_번호 */
    private Integer qty;	/** 수량 */

}
