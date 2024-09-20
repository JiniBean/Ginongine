import EmailVerifier from "/js/module/EmailVerifier.js";

window.addEventListener("load", function () {
    const form = document.forms['member'];
    const phone = form['phone'];
    const birthDate = form['birthDd'];
    const email = form['email'];
    const code = form['code'];
    const sendBtn = form.querySelector("#email-send");
    const confirm = form.querySelector("#email-confirm");
    const confirmBtn = confirm.querySelector("button");
    const result = confirm.querySelector("div.result");

    const verifier = new EmailVerifier(confirm);
    let valid = {email:false, birth:false};

    // --------- 다음 버튼 눌렀을 때 유효성 검사 ---------------

    form.onsubmit = (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll("input");
        let invalid = [];

        // 모든 항목에 입력 되어있는지 확인
        inputs.forEach(i => {
            if(!i.value){
                form.querySelector(`div.${i.name}`).classList.remove("d:none");
                invalid.push(i.name);
            }
            i.addEventListener("input", toggle);

        });

        // 입력 안된 항목 중 가장 첫번째에 커서 focus
        if(invalid.length > 0){
            form[`${invalid[0]}`].focus() ;
            return;
        }

        // 인증 완료 및 14세 이상일 경우에만 제출
        valid.birth = ageValidation();
        valid.email = confirmBtn.disable;

        if(valid.email && valid.birth)
            form.submit();
    }


    // --------- 각 항목별 유효성 검사 ---------------

    // 11자리 숫자만 입력
    phone.oninput = () => {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 11);
    }

    //만 14세 이상 유효검사
    birthDate.onchange = () => {
        const isValid = ageValidation();
        const error = form.querySelector("div.age");
        error.classList.toggle('d:none', isValid);

    }

    // 형식 유효검사
    email.oninput = () =>  {
        const error = form.querySelector("div.format");

        if(!email.value){
            error.classList.add("d:none");
            return;
        }

        let isValid = verifier.checkFormat(email.value, 'email');
        error.classList.toggle('d:none', isValid);
    }


    // 6자리 숫자만 입력
    code.oninput = () =>  {

        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 6);
    }


    // --------- 이메일 인증 ---------------

    sendBtn.onclick = async function (e) {
        e.preventDefault();
        if(valid.email || email.readOnly)
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

        result.classList.toggle('d:none', confirmBtn.disable);
        if (valid.email)
            return;
        valid.email = await verifier.confirm();
        if (valid.email)
            code.readOnly = true;
    }


    // --------- 추가 기능 ---------------

    // 입력 시작 시 에러 문구 지우기(다음 버튼 누른 후)
    function toggle(e) {
        const error = e.target.closest("section").querySelector(`div.${e.target.name}`);
        error.classList.toggle('d:none', e.target.value);
    }

    // 만 14이상 인지 유효성 검사
    function ageValidation(){
        const birth = new Date(birthDate.value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();

        if(today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()))
            age--;
        return age >= 14;
    }



});
