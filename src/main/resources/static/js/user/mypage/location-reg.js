// 카테고리 버튼
let section = document.querySelector(".n-dropdown");        //드롭다운 전체 영역
let btn = section.querySelector(".dropdown-btn");           //드롭다운 버튼
let list = section.querySelector(".dropdown-list");         //드롭다운 리스트
let input = section.querySelector("input[type='hidden']");    //드롭다운 input(hidden)


//드롭다운 버튼 선택 했을 때(리스트 숨겼다 보여졌다)
btn.onclick = function (e) {

    list.classList.toggle("active");
}

//드롭다운 리스트에서 옵션 하나 선택 했을 때
list.onclick = function (e) {

    //선택한 옵션 값 보여주기
    btn.textContent = e.target.textContent;

    //input에 값 넣어주기
    input.value = e.target.dataset.note  // 필요한 값 dataset으로 꺼내옴

    //리스트 숨기기
    list.classList.remove("active");
}

//-----------------------------------------------------------------------------------------------------
//기본 배송지 등록 누르면 색 들어오도록

const isCheck = document.querySelector(".check-default");
const iconCheck = document.querySelector(".icon-check");

isCheck.onclick = function (e){

   if(isCheck.checked) {
       iconCheck.classList.replace("icon-color:base-6","icon-color:main-6");
       return;
   }

   iconCheck.classList.replace("icon-color:main-6","icon-color:base-6");

}

//----------------------------------------------





