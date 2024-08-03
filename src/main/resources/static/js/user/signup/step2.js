import EmailVerifier from "/js/module/EmailVerifier.js";

window.addEventListener("load", function () {
    const form = document.querySelector("form[name='member']");
    const phone = form.querySelector("input[name='phone']");
    const birthDate = form.querySelector("input[name='birthDd']");
    const email = form.querySelector("input[name='email']");
    const code = form.querySelector("input[name='code']");
    const sendBtn = form.querySelector("#email-send");
    const submitBtn = form.querySelector("button.submit");
    const confirm = form.querySelector("#email-confirm");
    const confirmBtn = confirm.querySelector("button");
    const result = confirm.querySelector("div.result");

    const verifier = new EmailVerifier(confirm);
    let valid = {email:false, birth:false};

    // --------- 다음 버튼 눌렀을 때 유효성 검사 ---------------

    // 입력 시작 시 에러 문구 지우기
    function toggle(e) {
        const error = e.target.closest("section").querySelector(`div.${e.target.name}`);
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

        // 인증 완료 및 14세 이상일 경우에만 제출
        if(valid.email && valid.birth)
            this.form.submit();

    }


    // --------- 각 항목별 유효성 검사 ---------------

    phone.oninput = function (){
        // 11자리 숫자만 입력
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 11);
    }

    birthDate.onchange = function (){
        const birth = new Date(birthDate.value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();

        if(today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()))
            age--;
        valid.birth = age >= 14;

        //만 14세 이상 유효검사
        const error = form.querySelector("div.age");
        error.classList.toggle('d:none', valid.birth);

    }

    email.oninput = function () {
        const error = form.querySelector("div.format");

        if(!email.value){
            error.classList.add("d:none");
            return;
        }

        // 형식 유효검사
        let isValid = verifier.checkEmail(email.value);
        error.classList.toggle('d:none', isValid);
    }

    code.oninput = function () {
        // 6자리 숫자만 입력 가능하게 만들기
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 6);
    }


    // --------- 이메일 인증 ---------------
    sendBtn.onclick = async function (e) {
        e.preventDefault();
        if(valid.email)
            return;

        result.classList.add('d:none');
        let isSend = await verifier.send(email.value, sendBtn, true);
        if (isSend){
            email.readOnly = true;
            sendBtn.textContent = '재전송';
        }

    }

    confirmBtn.onclick = async function (e) {
        e.preventDefault();

        result.classList.add('d:none');
        valid.email = await verifier.confirm(submitBtn);
        if (valid.email)
            code.readOnly = true;
    }





})
