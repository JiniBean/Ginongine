window.addEventListener("load", function (){
    let tbody = document.querySelector("tbody"); // 테이블 바디 부분
    let checkAll = document.querySelector(".all");              //전체 선택 체크 박스

    // 셀 클릭 했을 때 update 페이지로 이동
    tbody.onclick = function (e) {
        if(e.target.classList.contains('input') || e.target.tagName === 'INPUT')
            return;
        let tr = e.target.closest("tr");
        if (!tr)
            return;

        let id = tr.dataset.id;
        location.href = `update?id=${id}`;
    }


    //전체 선택 눌렀을 때 체크박스 전체 상태 변화
    checkAll.onclick = function () {
        let checkboxes = tbody.querySelectorAll(".n-toggle-type\\:check");

        // 전체 선택 버튼의 상태 값에 따라 모든 체크 박스 체크 상태 바꾸기
        checkboxes .forEach(check => check.checked = this.checked)

    }
})