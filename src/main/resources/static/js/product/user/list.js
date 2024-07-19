// ========== 장바구니 담기 =========================================================
import CartRepository from "/js/module/CartRepository.js";
import Header from "/js/module/header.js";

document.addEventListener('click', function (e) {


    const cartBox = e.target.closest(".cart-box");       // 장바구니 아이콘 영역

    if (!cartBox)
        return;
    const prdNo = parseInt(cartBox.dataset.no); // 상품 번호

    // a 태그 막기
    e.preventDefault();


    let header = new Header();

    //로그인 되어있는지 판별
    let isMember = header.checkUser();

    // 로그인 되어있다면 DB로, 아니라면 쿠키로
    if (isMember)
        cartByDB();
    else
        cartBYCookie();

    function cartBYCookie() {
        let cookie = new Cookie();
        let cookieList = cookie.get("cartList");

        let check = false;
        let qty;

        //기존 쿠키가 없다면 쿠키에 "cartList" 새로 생성
        if (!cookieList) {
            let cart = {
                prdId   : prdId,
                quantity: 1
            }

            let list = [];
            list.push(cart);
            document.cookie = `cartList=${encodeURIComponent(JSON.stringify(list))}; path=/`;
            qty = cart.quantity;

        }

        //기존의 쿠키가 있다면 리스트 검사
        if (cookieList) {
            for (let c of cookieList)
                // 만약 클릭한 상품이 이미 있다면 수량+1
                if (c.prdId === prdId) {
                    let q = c.quantity;
                    c.quantity = ++q;
                    qty = q;
                    check = true;
                }
            //기존 쿠키가 없다면 기존 리스트에 추가
            if (!check) {
                let cart = {
                    prdId   : prdId,
                    quantity: 1
                }
                cookieList.push(cart);
                document.cookie = `cartList=${encodeURIComponent(JSON.stringify(cookieList))}; path=/`;
                qty = cart.quantity;
                check = true;
            }
            document.cookie = `cartList=${encodeURIComponent(JSON.stringify(cookieList))}; path=/`;
        }


        // 상품카드의 장바구니 바꾸기
        cartBox.textContent = qty;
        cartBox.classList.add('bg-color:main-6');
        cartBox.classList.add('color:base-1');

        //헤더 바꾸기
        header.renewCart();

    }


    async function cartByDB() {
        let cartRepository = new CartRepository();

        // 해당 상품 아이디로 장바구니 목록에 있는지 체크
        let valid = false;
        let item = await cartRepository.findItem(prdId);

        // 없다면 추가, 있다면 수량 증가
        if (item == null)
            valid = await cartRepository.add(prdId);
        else
            valid = await cartRepository.updateQty(prdId);

        // DB 저장 잘 됐다면 헤더와 상품 카드의 장바구니 바꾸기
        if (valid) {
            //해당 상품 수량 DB에서 다시 갖고오기
            item = await cartRepository.findItem(prdId);
            let qty = item.quantity;

            // 상품카드의 장바구니 바꾸기
            cartBox.textContent = qty;
            cartBox.classList.add('bg-color:main-6');
            cartBox.classList.add('color:base-1');

            //헤더 바꾸기
            await header.renewCart();
        }

    }
});


// ========== 정렬 =========================================================
window.addEventListener("load", function (e) {

    const sortSection = document.querySelector("#sort");                //정렬 영역

    const colBtn = sortSection.querySelector(".icon\\:squares_four");   //모바일 버전 세로 정렬 버튼
    const rowBtn = sortSection.querySelector(".icon\\:list_bullets");   //모바일 버전 가로 정렬 버튼

    const prdSection =document.querySelector("#prd");                   //모바일 상품 영역
    const colSection = prdSection.querySelector(".col");                //세로형 카드 섹션
    const rowSection = prdSection.querySelector(".row");                //가로형 카드 섹션

    // // 이전에 선택한 버튼 상태를 쿠키에서 불러옴
    // let cookie = new Cookie();
    // let previousBtn = cookie.get("previousBtn");
    //
    // if (previousBtn === "colBtn")
    //     col();
    // else if (previousBtn === "rowBtn")
    //     row();


    // 세로형 상품 카드로 바꾸기
    colBtn.onclick = function (e) {
        console.log('눌림');
        col();
        // cookie.set("previousBtn", "colBtn");
        e.preventDefault();
    }

    // 가로형 상품 카드로 바꾸기
    rowBtn.onclick = function (e) {
        row();
        // cookie.set("previousBtn", "rowBtn");
        e.preventDefault();
    }

    function col() {
        rowBtn.classList.remove("d:none");
        colSection.classList.remove("d:none");

        colBtn.classList.add("d:none");
        rowSection.classList.add("d:none");
    }

    function row() {
        colBtn.classList.remove("d:none");
        rowSection.classList.remove("d:none");

        rowBtn.classList.add("d:none");
        colSection.classList.add("d:none");
    }



});


