window.addEventListener("load", function () {
    let tableRows = document.querySelectorAll(".table-row");

    tableRows.forEach(function(row) {
        row.addEventListener("click", function() {
            // 클릭된 행에서 회원 ID를 추출
            let memberId = row.dataset.id;

            // 회원 디테일 페이지 URL을 생성
            let detailPageUrl = "/admin/member/detail?id=" + memberId;

            // 디테일 페이지로 이동
            window.location.href = detailPageUrl;
        });
    });
});
