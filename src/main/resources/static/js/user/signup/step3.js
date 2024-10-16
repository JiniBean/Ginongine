
window.addEventListener("load", function () {

    const form = document.forms['member'];
    const username = form['userNm'];
    const pwd = form['pwd'];
    const checkPwd = form['check'];
    // const joinRoute = form['joinRtCd'];
    const ref = form['ref'];

    // --------- 다음 버튼 눌렀을 때 유효성 검사 ---------------
    form.onsubmit = (e) => {
        e.preventDefault();

        // 필수 항목에 입력 되어있는지 확인
        const inputs = form.querySelectorAll("input.required");
        const invalid = [];

        inputs.forEach(i => {
            if(!i.value){
                form.querySelector(`div.${i.name}`).classList.remove("d:none");
                invalid.push(i.name);
            }
            i.addEventListener("input", toggle);

        });

        // 입력 안된 항목 중 가장 첫번째에 커서 focus
        if(invalid.length > 0)
            form[`${invalid[0]}`].focus() ;

        // 가입경로 항목에 입력 되어있는지 확인
        const radios = form.querySelectorAll("input[type='radio']");
        let isChecked =  Array.from(radios).some(r => {
            r.checked;
            r.addEventListener("input", toggle);
        });

        if(!isChecked)
            form.querySelector(`div.${radios[0].name}`).classList.remove("d:none");

        // 필수 항목 및 가입 경로 체크 안되어있다면 종료
        if(invalid.length > 0 || !isChecked)
            return;

        // 유효성 검사
        const isUsernameValid =  usernameValidation();
        const isPwdValid = pwdValidation();
        const isPwdMatch = pwdMatchValidation();

        if(![isUsernameValid, isPwdValid, isPwdMatch].every(Boolean))
            return;



    };

    // --------- 각 항목별 유효성 검사 ---------------
    username.oninput = usernameValidation;
    pwd.addEventListener("input", pwdValidation);
    pwd.addEventListener("input", pwdMatchValidation);
    checkPwd.oninput = pwdMatchValidation;


    // --------- 추가 기능 ---------------

    // 입력 시작 시 에러 문구 지우기(다음 버튼 누른 후)
    function toggle(e) {
        const error = e.target.closest("div:has(div)").querySelector(`div.${e.target.name}`);
        console.log((e.target.checked || e.target.value));
        error.classList.toggle('d:none', (e.target.checked || e.target.value));
    }

    // 패턴 유효성 검사
    function checkFormat(name, args) {
        const pattern =
            {
                username : /^[a-z0-9]{5,20}$/,
                pwd : /^[a-zA-Z0-9]{7,}$/
            }
        return pattern[name].test(args);
    }


    // 아이디 유효성 검사
    function usernameValidation() {
        const isValid =  checkFormat('username', username);
        const error = username.closest("div:has(div)").querySelector(`div.format`);

        error.classList.toggle('d:none', isValid);
        return isValid;

    }

    // 비밀번호 유효성 검사
    function pwdValidation() {
        const isValid =  checkFormat('pwd', pwd);
        const error = pwd.closest("div:has(div)").querySelector(`div.format`);

        error.classList.toggle('d:none', !isValid);
        return isValid;

    }

    // 비밀번호 확인 유효성 검사
    function pwdMatchValidation() {
        const isValid = pwd.value && ( pwd.value === checkPwd.value ) ;
        const match = checkPwd.closest("div:has(input)").querySelector(`span.check`);

        const className = isValid ? 'color:sub-5' : 'color:sub-1';
        const msg = isValid ? '[ 일치 ]' : '[ 불일치 ]';

        match.classList.remove('color:sub-1', 'color:sub-5'); // 기존 클래스 제거
        match.classList.add(className);
        match.textContent = msg;


        match.classList.remove('d:none');
        return isValid;
    }



});