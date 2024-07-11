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
        let list = this.map["menus"];
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
        let s = `${name}=${value}; path=/; SameSite=None; Secure`;
        document.cookie = s;
    }
}


// ========== 장바구니 담기 =========================================================
import CartRepository from "/js/module/CartRepository.js";
import Header from "/js/module/header.js";

document.addEventListener('click', function (e) {


    const cartBox = e.target.closest(".cart-box"); // 장바구니 아이콘 영역

    if (!cartBox)
        return;

    // a 태그 막기
    e.preventDefault();

    const prdId = parseInt(cartBox.dataset.id);

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
window.addEventListener("load", function () {

    const sortSection = document.getElementById("sort");
    const prdList = document.getElementById("prd-list");

    const colBtn = sortSection.querySelector(".icon\\:squares_four"); //모바일 버전 세로 정렬 버튼
    const rowBtn = sortSection.querySelector(".icon\\:list_bullets"); //모바일 버전 가로 정렬 버튼
    const colSection = prdList.querySelector(".menu-card-col"); //세로형 카드 섹션
    const rowSection = prdList.querySelector(".menu-card-row"); //가로형 카드 섹션
    const pcSection = document.querySelector(".prd-list-pc"); //PC 카드 섹션

    const alignNumberBox = sortSection.querySelector(".align-number");        // 데이터 표시 갯수 체크

    let pagerSection = document.querySelector(".pager");       // Pager 섹션
    let pagerButtons = pagerSection.querySelectorAll("li a");

    // URLSearchParams를 사용하여 현재 URL의 파라미터 가져오기
    let params = new URLSearchParams(window.location.search);
    // 현재 페이지의 도메인, 포트를 가져오기. (application.yaml에서 port변경하는 경우를 위함)
    let baseUrl = window.location.origin;

    // 특정 파라미터 값 가져오기
    let c = params.get('c') || 1;
    let p = params.get('p') || 1;


    const priceBtn = sortSection.querySelector(".price"); //가격순
    const recommendBtn = sortSection.querySelector(".recommend"); //추천순

    const content = prdList.getElementsByClassName("content");

    // 이전에 선택한 버튼 상태를 쿠키에서 불러옴
    let cookie = new Cookie();
    let previousBtn = cookie.get("previousBtn");

    if (previousBtn === "colBtn")
        col();
    else if (previousBtn === "rowBtn")
        row();

    // 세로형 상품 카드로 바꾸기
    colBtn.onclick = function (e) {
        col();
        cookie.set("previousBtn", "colBtn");
        e.preventDefault();
    }

    // 가로형 상품 카드로 바꾸기
    rowBtn.onclick = function (e) {
        row();
        cookie.set("previousBtn", "rowBtn");
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


    // priceBtn.onclick = function (e) {
    //     e.preventDefault();
    //
    //     priceBtn.classList.add("color:main-6");
    //     recommendBtn.classList.remove("color:main-6");
    //
    //     let sortType = 1;
    //     let url = `${baseUrl}/user/api/product?p=1&s=${sortType}&c=${c}`;
    //
    //     request(url, function (list) {
    //         bind(list);
    //     });
    // }
    //
    // recommendBtn.onclick = function (e) {
    //     e.preventDefault();
    //
    //     priceBtn.classList.remove("color:main-6");
    //     recommendBtn.classList.add("color:main-6");
    //     let sortType = 2;
    //     let url = `${baseUrl}/user/api/product?p=1&s=${sortType}&c=${c}`;
    //     //let url = `${baseUrl}/user/api/product?p=${p}&s=${sortType}&c=${c}&r=${alignNumberBox.value}`;
    //
    //     request(url, function (list) {
    //         bind(list);
    //     });
    // }

    /* 상품 display 갯수 선택, default 20*/
    // function loadData() {
    //     let alignNumber = alignNumberBox.value;
    //
    //     let url = `${baseUrl}/user/api/product?p=${p}&c=${c}&r=${alignNumber}`;
    //
    //     request(url, function (list) {
    //         bind(list);
    //         updatePagerLink(alignNumber);
    //     });
    // }

    // alignNumberBox.onchange = function (e) {
    //     // e.stopPropagation();
    //     // e.preventDefault();
    //
    //     loadData();
    // }

    // loadData();

    function updatePagerLink(size) {
        // console.log(pagerButtons);
        for (let a of pagerButtons) {
            // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            let parts = a.href.split('?'); // ['/list', 'p=1&r=1']
            let params = new URLSearchParams(parts[1] || '');
            params.set('r', size);
            a.href = `${parts[0]}?${params.toString()}`;
        }
    }


    // 가격,추천순 정렬 작업 중 ...
    function request(url, callback, method) {

        method = method || "GET";

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.onload = function () {
            let list = JSON.parse(this.responseText);
            // callback(list);
        };

        xhr.open(method, url);
        xhr.send();
    }

    function bind(data) {
        let list = data.list;

        rowSection.innerHTML = "";
        colSection.innerHTML = "";
        pcSection.innerHTML = "";
        pagerSection.innerHTML = "";

        // 가로형 카드 렌더링
        for (let m of list) {

            let rowSectiondHTML = `
<!--                <div class="menu-card-row">-->
                <div>
                    <div class="d:flex w:10p gap:3">
                        <div class="pos:relative">
                            <a href="/user/product/detail?id=${m.id}">
                                <img src="${m.thumbnailPath}/Meongmeong.jpg" height="110px" width="110px" alt="상품 이미지" class="bd-radius:4"/>
                            </a>
                            <div class="cart-section">
                                <div>
                                    <a href="" class="icon-shopping_cart icon icon:shopping_cart_simple icon-color:base-1 icon-size:4">장바구니아이콘 </a>
                                </div>
                            </div>
                        </div>
                        <div class="d:flex fl-dir:column jc:center gap:3">
                            <div class="d:flex fl-dir:column jc:center gap:1">
                                <a href="/user/product/detail?id=${m.id}">
                                    <span>${m.name}</span>
                                    <span>, </span>
                                    <span>${m.quantity}</span>
                                    <span>${m.quantityCategory}</span>
                                    <span>(</span>
                                    <span>${m.weight}</span>
                                    <span>${m.weightCategory}</span>
                                    <span>)</span>
                                </a>
                                <a href="">
                                    <span class="fw:3">${m.price}</span>
                                    <span class="fw:3">원</span>
                                </a>
                            </div>
                            <div class="deco icon:smile deco-color:sub-4 deco-size:1">${m.likeCount}</div>
                        </div>
                    </div>
                </div>`;

            rowSection.insertAdjacentHTML("beforeend", rowSectiondHTML);
        }

        // 세로형 카드 렌더링
        for (let m of list) {

            let colSectionHTML = `
<!--                <div class="menu-card-col">-->
                <div>
                    <div class="d:flex fl-dir:column gap:3" style="width: 180px; height: 294px">
                        <div class="pos:relative">
                            <a href="/user/product/detail?id=${m.id}" class="">
                                <img src="${m.thumbnailPath}/Meongmeong.jpg" height="180px" width="180px" alt="상품 이미지" class="bd-radius:2"/>
                            </a>
                            <div class="cart-section">
                                <div>
                                    <a href="" class="icon-shopping_cart icon icon:shopping_cart_simple icon-color:base-1 icon-size:4">장바구니아이콘</a>
                                </div>
                            </div>
                        </div>
                        <div class="d:flex fl-dir:column jc:center gap:2">
                            <div class="d:flex fl-dir:column jc:center gap:1">
                                <a href="/user/product/detail?id=${m.id}" style="height: 34px;">
                                    <span>${m.name}</span>
                                    <span>, </span>
                                    <span>${m.quantity}</span>
                                    <span>${m.quantityCategory}</span>
                                    <span>(</span>
                                    <span>${m.weight}</span>
                                    <span>${m.weightCategory}</span>
                                    <span>)</span>
                                </a>
                                <a href="/user/product/detail?id=${m.id}">
                                
                                    <span class="fw:3">${m.price}</span>
                                    <span class="fw:3">원</span>
                                </a>
                            </div>
                            <div class="deco icon:smile deco-color:sub-4 deco-size:1">${m.likeCount}</div>
                        </div>
                    </div>
                </div>`;

            colSection.insertAdjacentHTML("beforeend", colSectionHTML);
        }

        // PC버전 카드 렌더링
        for (let m of list) {

            let pcSectiondHTML = `
<!--                <div class="menu-card-row">-->
                <section class="font-size:3" style="width:280px; height:404px">
                    <h1 class="d:none">상품 영역</h1>
                    <div class="d:flex fl-dir:column w:10p h:10p jc:space-between">
                        <div class="pos:relative">
                            <a href="/user/product/detail?id=${m.id}" class=""><img src="${m.thumbnailPath}/Meongmeong.jpg" height="280px" width="280px" alt="상품 이미지" class="bd-radius:2"/></a>
                            <div class="cart-section">
                                <div>
                                    <a href="" class="icon-shopping_cart icon icon:shopping_cart_simple icon-color:base-1 icon-size:4 color:base-1">장바구니 아이콘</a>
                                </div>
                            </div>
                        </div>
                        <div class="d:flex fl-dir:column jc:center gap:4">
                            <div class="d:flex fl-dir:column jc:center gap:2">
                                <a href="/user/product/detail?id=${m.id}" class="h:2" >
                                    <span>${m.name}</span>
                                    <span>, </span>
                                    <span>${m.quantity}</span>
                                    <span>${m.quantityCategory}</span>
                                    <span>(</span>
                                    <span>${m.weight}</span>
                                    <span>${m.weightCategory}</span>
                                    <span>)</span>
                                </a>
                                <a href="/user/product/detail?id=${m.id}">
                                    <span class="fw:3">${m.price}</span>
                                    <span>원</span>
                                </a>
                            </div>
                            <div class="deco icon:smile deco-color:sub-4 deco-size:4">${m.likeCount}</div>
                        </div>
                    </div>
                </section>`;

            pcSection.insertAdjacentHTML("beforeend", pcSectiondHTML);
        }

        let page = params.get('p') || 1;
        let count = data.count;
        let size = alignNumberBox.value;

        let startnum = Math.floor((page - 1) / 5) * 5 + 1;
        let lastnum = startnum + 4;
        let next = lastnum + 1;
        let prev = Math.max(startnum - 1, 1);
        let maxPage = Math.ceil(count / size);

        lastnum = Math.min(maxPage, lastnum);
        next = Math.min(maxPage, next);
        // let count = 30;//cookie.map.length;
        // let temp = Math.floor((page - 1) / 5);
        // let startnum = temp * 5 + 1;
        // let temp1 = Math.floor(count / 6);
        // let lastnum = count % 6 === 0 ? temp1 : temp1 + 1;

        let sequence = [];
        for (let i = startnum; i <= lastnum; i++)
            sequence.push(i);

        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
        let linkParam = `&c=${c}&r=${size}`;
        let prevLink = `./list?p=${prev}${linkParam}`;
        let nextLink = `./list?p=${next}${linkParam}`;

        let pagerSectionHTML =
            `<section id="pager" class="d:flex w:10p mb:5 jc:center">
                <h1 class="d:none">페이저</h1>
    
                <ul class="n-pager d:flex">
                    <li><a href="${prevLink}">이전</a></li>`;

        for (let n of sequence) {
            let cssClass = page == n ? 'active' : '';
            pagerSectionHTML +=
                `<li class="${cssClass}">
                    <a href="./list?p=${n}${linkParam}">${n}</a>
                </li>`;
        }

        pagerSectionHTML +=
            `<li><a href="${nextLink}">다음</a></li>
                </ul>
            </section>`;

        pcSection.insertAdjacentHTML("beforeend", pagerSectionHTML);

    }
});


// 페이지 당 상품 수
window.addEventListener("load", function () {
    const dropdownBtn = document.querySelector(".dropdown-btn");
    const dropdownContent = document.querySelector(".dropdown-content");
    const dropdownLinks = document.querySelectorAll(".dropdown-content a");

    // 드롭다운 클릭 시 아이템 출력
    dropdownBtn.addEventListener("click", function () {
        dropdownContent.classList.toggle("show");
        dropdownBtn.classList.toggle("active");
    });

    // 드롭다운 링크 클릭 이벤트 추가
    dropdownLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const rows = this.getAttribute("data-value");

            // 현재 URL에서 쿼리스트링 parameter 가져오기
            const currentParams = new URLSearchParams(window.location.search);

            const params = new URLSearchParams({
                c: currentParams.get("c") || '', // 현재 URL에서 카테고리 ID 가져오기, 없으면 '' (empty-string)
                s: currentParams.get("s") || '', // 정렬 유형 가져오기, 없으면 '' (empty-string)
                r: rows, // 사용자가 선택한 행 수
            });

            // get 요청 보내기
            window.location.href = `/product/list?${params.toString()}`;
        });
    });
});


