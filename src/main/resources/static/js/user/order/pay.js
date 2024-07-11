
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.addEventListener("load",  function () {
    //쿠폰 사용 영역
    let couponSection = document.querySelector(".n-dropdown");              //드롭다운 전체 영역
    let couponBtn = couponSection.querySelector("#dropdown-btn");           //드롭다운 버튼
    let couponList = couponSection.querySelector("#dropdown-list");         //드롭다운 리스트

    //적립금 사용 영역
    const pointSection = document.querySelector("#point-section");          //적립금 영역
    const pointInput = pointSection.querySelector("input[name='point']");   //적립금 입력 칸
    const remainPoint = pointSection.querySelector(".remain-point");        //사용자 보유 적립금
    const usePointBtn = pointSection.querySelector(".use-point-btn");       //전액 사용 버튼
    const minCheck = pointSection.querySelector(".min-check");              //최소 금액 유효성 검사 문구
    const maxCheck = pointSection.querySelector(".max-check");              //최대 금액 유효성 검사 문구

    // 결제 정보 관련 영역
    const prdTotalSpan = document.querySelector("#total-price");            //총 상품금액 dataSet 영역
    const paySummary = document.querySelector("#payment-summary");          //결제정보 섹션
    const couponAmt = paySummary.querySelector(".coupon");                  //쿠폰 적용 금액 영역
    const pointAmt = paySummary.querySelector(".point");                    //포인트 적용 금액 영역
    const totalAmt = paySummary.querySelector(".total");

    // 환불 수단 영역
    const refundPoint = document.querySelector("input[id='refund-point']");
    const refundPayment = document.querySelector("input[id='refund-payment']");

    // 총 상품 금액과 배송비
    const totalProductPrice = parseInt(prdTotalSpan.dataset.total);
    const dlvryAmt = totalProductPrice > 30000? 0 : 5000;


    let orderId = prdTotalSpan.dataset.oid;

    // 결제정보 데이터 영역 -> fetch 로 컨트롤러에 보낸 후 결제 성공시 DB 저장
    let payment = {
        type: 1,
        totalAmt: 0,
        refundType: true,
        categoryId: 0,
        deliveryFeeCategoryId: 0,
        orderId: orderId
    }
    let couponHistory = {
        id: 0,
        couponId: 0,
        usedAmt: 0,
        orderId: orderId
    }
    let pointHistory = { plma: -1, amount: 0, orderId: orderId}


    let couponDisc; //쿠폰 할인 금액
    let pointDisc;  //포인트 할인 금액

// -------------- 쿠폰 관련 로직 ----------------------

    //드롭다운 버튼 선택 했을 때
    couponBtn.onclick = function (e) {
        //쿠폰 리스트 보였다 안보였다
        couponList.classList.toggle("active");
    }

    //드롭다운 리스트에서 옵션 하나 선택 했을 때
    couponList.onclick = function (e) {

        //선택한 쿠폰 보여주기
        couponBtn.textContent = e.target.textContent;
        couponList.classList.remove("active");

        //쿠폰의 데이터로 할인 가격 계산하기
        let amt = parseInt(e.target.dataset.amut);
        if (e.target.dataset.unit === '%')
            couponDisc = totalProductPrice * (amt / 100);
        else
            couponDisc = amt;

        //쿠폰 가격 뿌려주기
        couponAmt.textContent = formatNumber(couponDisc);
        total(couponDisc, pointDisc);

        //사용한 쿠폰 정보 input에 뿌려주기
        couponHistory.id = e.target.dataset.id;
        couponHistory.couponId = e.target.dataset.cid;
        couponHistory.usedAmt = couponDisc;
    }

// -------------- 포인트 관련 로직 ----------------------

    pointInput.oninput = function (e) {

        // 사용자가 입력한 포인트와 잔여 포인트 비교
        let inputValue = parseInt(e.target.value);
        let point = parseInt(remainPoint.dataset.point);
        let check = validate(inputValue, point);
        if (check) {

            //인풋 영역에 금액 뿌려주기
            let remain = point - inputValue;
            remainPoint.textContent = formatNumber(remain) + ' P';
            pointInput.textContent = formatNumber(inputValue);
            pointInput.value = inputValue;

            //결제정보 영역에 적립금 뿌려주기
            pointDisc = inputValue;
            pointAmt.textContent = formatNumber(pointDisc);
            total(couponDisc, pointDisc);
            pointHistory.amount = pointDisc;
        }

    }

    // 포인트 전액 사용 버튼 눌렀을 때
    usePointBtn.onclick = function (e) {

        let point = parseInt(remainPoint.dataset.point);
        let inputValue = point;

        let check = validate(inputValue, point);
        if (check) {
            //인풋 영역에 금액 뿌려주기
            remainPoint.textContent = "0 P";
            pointInput.value = formatNumber(point);

            //결제정보 영역에 적립금 뿌려주기
            pointDisc = inputValue;
            pointAmt.textContent = formatNumber(pointDisc);
            total(couponDisc, pointDisc);
            pointHistory.amount = pointDisc;
        }
    };

    // 적립금 1000원 이상, 잔여 적립금 이상 못 쓰게 Validation Check
    function validate(inputValue, point) {

        //1,000원 이상, 보유 적립금 이하
        if (1000 <= inputValue && inputValue <= point) {
            minCheck.classList.add("d:none");
            maxCheck.classList.add("d:none");
            return true;
        }

        //1,000원 이하
        if (inputValue < 1000) {
            minCheck.classList.remove("d:none");
            maxCheck.classList.add("d:none");
            return false;
        }

        //보유 적립금 이상
        if (inputValue > point) {
            minCheck.classList.add("d:none");
            maxCheck.classList.remove("d:none");
            return false;
        }
        return false;
    }

    //총 결제금액 꽂아주기
    function total(couponDisc = 0, pointDisc = 0) {

        let cost = totalProductPrice - (couponDisc + pointDisc) + dlvryAmt;
        totalAmt.textContent = formatNumber(cost);
        payment.totalAmt = cost;

    }

// -------------- 환불 방법 관련 로직 ----------------------

    //적립금으로 환불하기 눌렀을 때
    refundPoint.onclick = function () {
        payment.refundType = true;
    }

    //결제수단으로 환불하기 눌렀을 때
    refundPayment.onclick = function () {
        payment.refundType = false;
    }



// ==================== 결제 API =============================================

    const button = document.getElementById("payment-button");

    let memberId = prdTotalSpan.dataset.memberId;
    let memberName = prdTotalSpan.dataset.memberName;
    let memberEmail = prdTotalSpan.dataset.memberEmail;
    let memberPhone = prdTotalSpan.dataset.memberPhone;


    // ------  결제위젯 초기화 ------
    const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
    const customerKey = `M-${memberId}-${orderId}`;
    const paymentWidget = PaymentWidget(clientKey, customerKey); // 회원 결제

// ------  결제 UI 렌더링 ------
    let amount= payment.totalAmt || totalProductPrice - dlvryAmt;
    let value ={value: amount}
    paymentMethodWidget = paymentWidget.renderPaymentMethods(
        "#payment-method", value,
        {variantKey: "DEFAULT"}
    );
// ------  이용약관 UI 렌더링 ------
    paymentWidget.renderAgreement("#agreement", {variantKey: "AGREEMENT"});


// ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
    button.onclick= function (e) {
        e.preventDefault();

        payment.totalAmt = payment.totalAmt || totalProductPrice - dlvryAmt;
        value.value = payment.totalAmt;
        // request 정보
        let orderName = prdTotalSpan.dataset.oname
        let orderSize = prdTotalSpan.dataset.size
        if (parseInt(orderSize) > 0)
            orderName += ` 외 ${orderSize}건`

        payment.deliveryFeeCategoryId = dlvryAmt  ? 1 : 2


        let data = {payment,couponHistory, pointHistory};
        let url =window.location.origin + '/api/order/tmp'
        let header = {"Content-Type": "application/json",}
        let option = {headers:header, method:'POST', body:JSON.stringify(data)}
        fetch(url, option);

        paymentWidget.requestPayment({
            orderId: orderId,
            orderName: orderName,
            successUrl: window.location.origin + "/order/confirm",
            failUrl: window.location.origin + "/order/fail",
            customerEmail:memberEmail,
            customerName: memberName,
            customerMobilePhone: memberPhone,
        });
    };

});
