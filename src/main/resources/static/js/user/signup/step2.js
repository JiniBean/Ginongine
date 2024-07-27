import EmailVerifier from "/js/module/EmailVerifier.js";

window.addEventListener("load", function () {
    const form = document.querySelector("form[name='member']");
    const phone = form.querySelector("input[name='phone']");
    const birthDate = form.querySelector("input[name='birthDd']");
    const email = form.querySelector("input[name='email']");
    const sendBtn = form.querySelector("#email-send");
    const submitBtn = form.querySelector("button.submit");
    const confirm = form.querySelector("#email-confirm");
    const confirmBtn = confirm.querySelector("button");

    const verifier = new EmailVerifier(confirm);
    let valid = {email:false, birth:false};

    // --------- 다음 버튼 눌렀을 때 유효성 검사 ---------------

    // 입력 시작 시 에러 문구 지우기
    function toggle(e) {
        let error = e.target.closest("section").querySelector(`div.${e.target.name}`);
        if (e.target.value)
            error.classList.add("d:none");
        else
            error.classList.remove("d:none");
    }

    submitBtn.onclick = function (e) {
        e.preventDefault();
        const inputs = form.querySelectorAll("input");
        let invalid = [];

        // 모든 항목에 입력 되어있는지 확인
        inputs.forEach(i => {

            if(!i.value){
                form.querySelector(`div.${i.name}`).classList.remove("d:none");
                invalid.push(i.name);
                i.addEventListener("input", toggle);
            }

        });

        // 입력 안된 항목 중 가장 첫번째에 커서 focus
        if(invalid.length > 0){
            form.querySelector(`input[name=${invalid[0]}]`).focus() ;
            return;
        }

    }



    // --------- 각 항목별 유효성 검사 ---------------

    phone.oninput = function (){
        // 숫자만 입력 가능하게 만들기
        this.value = this.value.replace(/[^0-9]/g, "");
        // 11자리 이상 입력하면 11자리까지 잘라내기
        this.value = this.value.length <= 11 ? this.value : this.value.slice(0, 11);
    }


    birthDate.onchange = function (){
        const birth = new Date(birthDate.value);
        const today = new Date();
        const birthMonth = birth.getMonth();
        const todayMonth = today.getMonth();
        const birthDay = birth.getDate();
        const todayDay = today.getDate();

        let age = today.getFullYear() - birth.getFullYear();

        // 생일이 지나지 않았다면 한 살 더 빼기
        if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay))
            age -= 1;


        //만 14세 이상 유효검사
        const error = form.querySelector("div.age");
        if(age < 14){
            submitBtn.disabled = false;
            error.classList.remove("d:none");
            return;
        }
        error.classList.add("d:none");
        valid.birth = true;


    }

    email.oninput = function () {
        const error = form.querySelector("div.format");

        if(!email.value){
            error.classList.add("d:none");
            return;
        }
        // 형식 유효검사
        let isValid = verifier.checkFormat(email.value);

        if (!isValid) {
            error.classList.remove("d:none");
            valid.birth = false;
            return;
        }
        error.classList.add("d:none");
    }


    // --------- 이메일 인증 ---------------
    sendBtn.onclick = function (e) {
        e.preventDefault();
        let isSend = verifier.send(email.value,sendBtn, true);

    }

    confirmBtn.onclick = function (e) {
        e.preventDefault();

        // 형식 유효검사


        let isConfirm = verifier.confirm(valid);
    }





})
