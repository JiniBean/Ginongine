import CartRepository from "./CartRepository.js";

function Cookie() {
    this.map = {};

    if (document.cookie) {
        let cookieDecoded = decodeURIComponent(document.cookie);
        let tokens = cookieDecoded.split(";");

        for (let c of tokens) {
            let tmp = c.split("=");
            let key = tmp[0];
            key = key.trimStart();
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
    }

}

export default class Header {
    #header     //header 전체 영역
    #cartCircle //장바구니 아이콘의 숫자 들어가는 동그라미 부분
    #user       //로그인시에만 존재하는 username span 영역

    constructor() {
        this.#header = document.querySelector("header");
        this.#cartCircle = this.#header.querySelector(".cart-circle");
        this.#user = this.#header.querySelector(".user");
    }

    // 장바구니에 담겨 있는 상품 수 갱신하기
    async renewCart() {
        let count;

        if(this.#user){
            // DB에 있는 상품 개수 가져오기
            let cartRepository = new CartRepository();
            count = await cartRepository.count();
        }
        else {
            // 쿠키에 있는 상품 개수 가져오기
            let cookie = new Cookie();
            count = cookie.get("cartList");
            count = count.length;
        }

        // 있다면 장바구니에 개수 표시
        if(count > 0){
            this.#cartCircle.classList.remove("d:none")
            this.#cartCircle.textContent = count;
        }
    }

    //로그인 되어있는지 판별하기
    checkUser(){
        if(this.#user)
            return true;
        return false;
    }

    // 검색창 script, 상품만 검색 가능
    searchBar() {
        const headerSearchIcon = this.#header.querySelector('.h-search-icon'); // 헤더(장바구니쪽)에 붙어 있는 검색 아이콘
        const searchBar = document.querySelector('.search-bar'); // 검색창에 붙어 있는 검색 아이콘
        const searchInput = document.querySelector('.search-bar input'); // 검색창에 붙어 있는 검색 아이콘


        headerSearchIcon.addEventListener('click', function(e) {
            // URL 경로를 찾기 위한 코드 => 경로에 따라 상품페이지가 아닐 시, 검색창이 열리지 않도록 하기 위함(현재 상품만 검색 가능)
            const pathname = window.location.pathname;
            const splitPathname = pathname.split('/');
            // console.log(splitPathname); //=> ['', 'notice', 'list']
            const path = splitPathname[1]; // notice

            // 헤더에 있는 검색 아이콘 클릭 이벤트
            e.preventDefault();

            if(path !== 'product') return;
            if (searchBar.classList.contains('d:none')) {
                // 검색 창 화면 출력 및 아이콘 X 로 변경
                searchBar.classList.remove('d:none');
                headerSearchIcon.classList.remove('icon:magnifying_glass');
                headerSearchIcon.classList.add('icon:close');
                searchInput.focus();
            } else {
                // 검색 창 화면 제거 및 아이콘 돋보기 로 변경
                searchBar.classList.add('d:none');
                headerSearchIcon.classList.add('icon:magnifying_glass');
                headerSearchIcon.classList.remove('icon:close');
            }
        });
    }





}