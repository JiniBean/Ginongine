function Cookie() {
    this.map = {};

    if (document.cookie) {
        let cookieDecoded = decodeURIComponent(document.cookie);
        let tokens = cookieDecoded.split(";");

        for (let c of tokens) {
            let tmp = c.split("=");
            let key = tmp[0];
            let value = tmp[1];
            if(key==='cartList')
                this.map[key] = JSON.parse(value);
            else
                this.map[key] = value;
        }
    }

}

Cookie.prototype = {
    get: function (name) {
        return this.map[name];
    },

    save: function () {
        // document.cookie = "menus=hh; path=/;";
        let list = this.map["cartList"];
        let size = list.length;
        let lastIdx = size - 1;

        let str = "[";

        for (m of list) {
            str += JSON.stringify(m);
            if (m !== list[lastIdx]) str += ",";
        }

        str = "]";
        let encoded = encodeURIComponent(str);
        document.cookie = `menus=${encoded}; path=/;`;

    },

    remove: function (name) {

    },

    add: function (name, value) {

    },

    addItem: function (name, item) {
        let list = this.map[name];
        list.push(item);
    },

    set: function (name, value) {
        let s = `${name}=${value}; path=/;`;
        document.cookie = s;
    }
}

function cartBYCookie(prdId, qty,header) {
    let cookie = new Cookie();
    let cookieList = cookie.get("cartList");

    let check = false;

    //기존 쿠키가 없다면 쿠키에 "cartList" 새로 생성
    if (!cookieList) {
        let cart = {
            prdId   : parseInt(prdId),
            quantity: parseInt(qty)
        }

        let list = [];
        list.push(cart);
        // cookie.set("cartList", JSON.stringify(list));
        document.cookie = `cartList=${encodeURIComponent(JSON.stringify(list))}; path=/`;
        qty = cart.quantity;

    }

    //기존의 쿠키가 있다면 리스트 검사
    if (cookieList) {
        for (let c of cookieList)
            // 만약 클릭한 상품이 이미 있다면 기존 수량 + 선택수량
            if (c.prdId === prdId) {
                let q = c.quantity;
                c.quantity = q+qty;
                check = true;
            }
        //기존 쿠키가 없다면 기존 리스트에 추가
        if (!check) {
            let cart = {
                prdId   : parseInt(prdId),
                quantity:  parseInt(qty)
            }
            cookieList.push(cart);
            document.cookie = `cartList=${encodeURIComponent(JSON.stringify(cookieList))}; path=/`;
            qty = cart.quantity;
            check = true;
        }
        document.cookie = `cartList=${encodeURIComponent(JSON.stringify(cookieList))}; path=/`;
    }

    //헤더 바꾸기
    header.renewCart();
    return true;
}

async function cartByDB(prdId,qty,header) {
    let cartRepository = new CartRepository();

    // 해당 상품 아이디로 장바구니 목록에 있는지 체크
    let valid = false;
    let item = await cartRepository.findItem(prdId);

    // 없다면 추가, 있다면 수량 증가
    if (item == null)
        valid = await cartRepository.add(prdId,qty);
    else
        qty = item.quantity + qty;
        valid = await cartRepository.updateQty(prdId,qty);

    // DB 저장 잘 됐다면 헤더와 상품 카드의 장바구니 바꾸기
    if (valid) {
        //해당 상품 수량 DB에서 다시 갖고오기
        await cartRepository.findItem(prdId);

        //헤더 바꾸기
        await header.renewCart();
        return true;
    }
}

import CartRepository from "/js/module/CartRepository.js";
import Header from '/js/module/header.js';

/* (최근 본 상품)  local storage에 상품 id값 저장 */

window.addEventListener("load", function(){

    let productId = document.querySelector(".product-id").value;
    let title = document.querySelector(".product-title").value;
    let price = document.querySelector(".product-price").value;

    let detailArray = {productId,title, price};

    save(detailArray);

    function save(detailArray){

        let localStorage = window.localStorage;
        let localData = localStorage.getItem("recentList");
        let recentList;

        //recentList가 존재하지않는 경우
        if(localData===null){
            recentList = [];
            recentList.push(detailArray);

            localStorage.setItem("recentList",JSON.stringify(recentList));
            return;
        }

        //recentList가 존재하는 경우 push 안함
        {
            // 객체로 바꾸기
            recentList = JSON.parse(localData);

            //상품 중복체크
            for(let num=0; num < recentList.length; num++)
                if(detailArray.productId===recentList[num].productId){
                    return;
                }

            //없다면 push
           recentList.push(detailArray);

          localStorage.setItem("recentList",JSON.stringify(recentList));

        }


    }

});

/*모바일 버전 구매정보 수량증감*/
window.addEventListener("load", function(){

    /*orderInfo section*/
    let orderInfo = this.document.querySelector("#order-info");

    /*증감버튼영역*/
    let numberBox = orderInfo.querySelector(".numberBox");
    let quantityInput = numberBox.querySelector(".quantity-input");

    /*구매총합영역*/
    let total = this.document.querySelector(".total");

    //총 수량
    let totalQuantity = total.querySelector(".total-quantity");

    //상품 가격
    let productPriceValue= this.document.querySelector(".product-price").value;
    let productPrice = parseInt(productPriceValue);

    //총 금액
    let totalPrice = total.querySelector(".total-price");
    let totalPriceInput = total.querySelector(".total-price-input");

    /*증감버튼 계산*/
    numberBox.onclick = function (e) {

        e.preventDefault();

        if(e.target.tagName!='A')
            return;

        //수량 -> int
        let quantity = parseInt(quantityInput.value);

        //클릭한 버튼 구별
        let state = e.target.dataset.btn;

        switch (state) {
            case 'minus' :
                if(quantity<=1)
                     return;
                quantityInput.value = quantity-1;
                break;
            case 'plus' :
                if(quantity>=10) //최대 재고수량까지(나중에 재고값 가져오기)
                     return;
                quantityInput.value = quantity+1;
                break;
        }

        //총 수량
        totalQuantity.innerText = quantityInput.value;

        // 총금액(수량*상품가격)

        let totalSum = quantityInput.value * productPrice;
        totalPrice.innerText=totalSum.toLocaleString('ko-KR')+"원";
        totalPriceInput.value=totalSum;

    }

    quantityInput.oninput = function (e){
    };


});


// 구매하기 및 장바구니 PC 버전
window.addEventListener("load", function() {

    let payBox = document.querySelector(".l-pay-box");
    let orderBtn = payBox.querySelector(".l-order");
    /*cartBtn 추후 구현 예정*/
    let cartBtn = payBox.querySelector(".l-cart");
    let productId = payBox.querySelector(".l-product-id").value;

    let quantityInput = document.querySelector(".l-quantity-input").value;
    let quantity = parseInt(quantityInput);

    orderBtn.onclick = function (){


        let url = new URL ("/order/info", location.origin);

        url = url + "?p=" + productId + "&q=" + quantity;

        location.href = url.toString();
    };

    cartBtn.onclick = function () {
        let header = new Header();
        let vaild = false;

        //로그인 되어있는지 판별
        let isMember = header.checkUser();

        // 로그인 되어있다면 DB로, 아니라면 쿠키로
        if(isMember)
           vaild = cartByDB(productId, quantity, header);
        else
            vaild = cartBYCookie(productId, quantity, header);

        if(vaild)
            alert("장바구니에 담았어요!");
    }

});


/* pc버전 구매정보 수량증감*/
window.addEventListener("load", function(){

    /* l-order-info section */
    let orderInfo = this.document.querySelector("#l-order-info");

    /*증감버튼영역*/
    let numberBox = orderInfo.querySelector(".l-numberBox");
    let quantityInput = numberBox.querySelector(".l-quantity-input");

    /*구매총합영역*/
    let total = orderInfo.querySelector(".l-total");

    //총 수량
    let totalQuantity = total.querySelector(".l-total-quantity");

    //상품 가격
    let productPriceValue= this.document.querySelector(".l-price").value;
    let productPrice = parseInt(productPriceValue);

    //총 금액
    let totalPrice = total.querySelector(".l-total-price");
    let totalPriceInput = total.querySelector(".l-total-price-input");

    numberBox.onclick = function (e) {

        e.preventDefault();

        if(e.target.tagName!='A')
            return;

        //수량 -> int
        let quantity = parseInt(quantityInput.value);

        //클릭한 버튼 구별
        let state = e.target.dataset.btn;

        switch (state) {
            case 'minus' :
                if(quantity<=1)
                    return;
                quantityInput.value = quantity-1;
                break;
            case 'plus' :
                if(quantity>=10) //최대 재고수량까지(나중에 재고값 가져오기)
                    return;
                quantityInput.value = quantity+1;
                break;
        }

        //총 수량
        totalQuantity.innerText = quantityInput.value;

        // 총금액(수량*상품가격)
        let totalSum = quantityInput.value * productPrice;
        totalPrice.innerText=totalSum.toLocaleString('ko-KR')+"원";
        totalPriceInput.value=totalSum;

    }

});

// ===================================================================================================
// /* 모바일 버전 하단 navi */
window.addEventListener("load", function(){



    //popup open
    let navi = this.document.querySelector(".navi");

    //popup close

    let orderInfo = this.document.querySelector("#order-info");
    let close = orderInfo.getElementsByClassName("close")[0];

    let productId = navi.querySelector(".product-id").value;
    let numberBox = orderInfo.querySelector(".numberBox");
    let quantityInput = numberBox.querySelector(".quantity-input");

    navi.onclick = function(e){
        if(e.target.tagName!='BUTTON')
            return;

        if(!orderInfo.classList.contains("on")) {
            orderInfo.classList.remove("d:none");
            orderInfo.classList.add("on");
            return;
        }

        let state = e.target.dataset.btn;

        switch (state) {
            case 'cart' :

                break;

            case 'order' :
                let url = new URL ("/order/info", location.origin);

                let quantity = parseInt(quantityInput.value);

                url = url + "?p=" + productId + "&q=" + quantity;

                location.href = url.toString();

                break;
        }

    }

    //popup close
    close.onclick = function(){
        orderInfo.classList.add("d:none");
        orderInfo.classList.remove("on");
    }

});

/* pc 버전 하단 navi */
window.addEventListener("load", function(){

    //popup open
    let navi = this.document.querySelector(".navi");
    let orderInfo = this.document.querySelector("#order-info");
    let productId = navi.querySelector(".product-id").value;
    let numberBox = orderInfo.querySelector(".numberBox");
    let quantityInput = numberBox.querySelector(".quantity-input").value;
    let quantity = parseInt(quantityInput);

    //popup close
    let close = orderInfo.getElementsByClassName("close")[0];


    navi.onclick = function(e){
        if(e.target.tagName!='BUTTON')
            return;

        if(!orderInfo.classList.contains("on")){
            orderInfo.classList.remove("d:none");
            orderInfo.classList.add("on");
        }else{
            let state = e.target.dataset.btn;

            switch (state) {
                case 'cart' :
                    let header = new Header();
                    let vaild = false;

                    //로그인 되어있는지 판별
                    let isMember = header.checkUser();

                    // 로그인 되어있다면 DB로, 아니라면 쿠키로
                    if(isMember)
                        vaild = cartByDB(productId, quantity, header);
                    else
                        vaild = cartBYCookie(productId, quantity, header);

                    if(vaild)
                        alert("장바구니에 담았어요!");
                    break;
                case 'order' :
                    let url = new URL ("/order/info", location.origin);



                    url = url + "?p=" + productId + "&q=" + quantity;

                    break;
            }
        }

    }

    //popup close
    close.onclick = function(){
        orderInfo.classList.add("d:none");
        orderInfo.classList.remove("on");
    }



});




//찜 눌렀을때
window.addEventListener("load", function(e){

    e.preventDefault();

    let payBox = this.document.querySelector('.pay-box');
    let icon = payBox.querySelector('.icon');

    icon.onclick = function(){

        let isClick = icon.classList.contains('icon:heart_fill')

        if(!isClick)
            icon.classList.replace('icon:heart','icon:heart_fill');
        else
            icon.classList.replace('icon:heart_fill','icon:heart');
    }

});

// 탭바 클릭 시 해당 정보만 출력
window.addEventListener("load", function () {
    var tabbar = document.querySelector("#tabbar");
    var mInfoSection = document.querySelector(".m-info");
    var mReviewSection = document.querySelector(".m-review");
    var pcReviewSection = document.querySelector(".pc-review");
    var mQnaSection = document.querySelector(".m-qna");
    var pcQnaSection = document.querySelector(".pc-qna");

    tabbar.onclick = function (e) {
        var tabLinks = tabbar.querySelectorAll("a");

        if(e.target.tagName != 'A')
            return

        e.preventDefault();

        tabLinks.forEach(function (tabLink) {
            tabLink.classList.remove("bd-bottom");
            tabLink.classList.remove("bd-color:main-6");
        });

        e.target.classList.add("bd-bottom");
        e.target.classList.add("bd-color:main-6");


        if (e.target.innerText == '상품정보') {

            mInfoSection.classList.remove("d:none");

            mReviewSection.classList.add("d:none");
            pcReviewSection.classList.add("md:d:none");
            mQnaSection.classList.add("d:none");
            pcQnaSection.classList.add("md:d:none");


        } else if(e.target.innerText == '후기') {

            mReviewSection.classList.remove("d:none");
            pcReviewSection.classList.remove("md:d:none");

            mInfoSection.classList.add("d:none");
            mQnaSection.classList.add("d:none");
            pcQnaSection.classList.add("md:d:none");


        } else {
            //QNA 정보 출력

            mQnaSection.classList.remove("d:none");
            pcQnaSection.classList.remove("md:d:none");

            mReviewSection.classList.add("d:none");
            pcReviewSection.classList.add("md:d:none");
            mInfoSection.classList.add("d:none");
            // pcInfoSection.classList.add("md:d:none");


        }


    }

});