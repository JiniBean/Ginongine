import Header from "/js/module/header.js";


window.addEventListener("load", function (){
    //헤더의 장바구니와 검색창
    let header = new Header();
    header.renewCart();
    header.searchBar();

    //전체 메뉴 토글
    const drawerBtn = document.querySelector("#drawer");
    const drawerAside = document.querySelector('aside.n-drawer');
    const removeIcon = drawerAside.querySelector(".icon");

    drawerBtn.onclick = drawerToggle;
    removeIcon.onclick = drawerToggle;
    function drawerToggle(){
        drawerAside.classList.toggle('active');
    }
})