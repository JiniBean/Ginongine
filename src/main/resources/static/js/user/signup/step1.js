window.addEventListener("load", function (e) {
    const checkAllInput = document.querySelector("input[name='all']");
    const submitBtn = document.querySelector("button.n-btn");

    // 전체 동의에 따른 모든 체크박스 toggle
    checkAllInput.onclick = function () {
        const checks = document.querySelectorAll("input[type='checkbox']");
        checks.forEach(c => c.checked=this.checked);
    }

    // 필수 동의 체크박스 유효성 검사
    submitBtn.onclick = function (e) {
        e.preventDefault();
        const requiredInputs = document.querySelectorAll(".required");
        const error = document.querySelector(".error");
        let isAllChecked = true;

        requiredInputs.forEach(r=> {
            if(!r.checked) return isAllChecked=false;
        });

        if (!isAllChecked){
            error.classList.remove("d:none");
            return;
        }
        error.classList.add("d:none");
        this.form.submit();
    }


});
