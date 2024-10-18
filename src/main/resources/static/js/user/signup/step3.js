import SignRepository from "/js/module/SignRepository.js";
import debounce from "/js/module/Debounce.js";

window.addEventListener("load", function () {

    const form = document.forms['member'];
    const username = form['userNm'];
    const pwd = form['pwd'];
    const checkPwd = form['check'];
    const joinRoute = form['joinRtCd'];
    const ref = form['ref'];

    // --------- 다음 버튼 눌렀을 때 유효성 검사 ---------------
    form.onsubmit = async (e) => {
        e.preventDefault();

        // 필수 항목에 입력 되어있는지 확인
        const inputs = form.querySelectorAll("input.required");
        const invalid = [];

        inputs.forEach(i => {
            if (!i.value) {
                form.querySelector(`div.${i.name}`).classList.remove("d:none");
                invalid.push(i.name);
            }
            i.addEventListener("input", toggle);

        });

        // 입력 안된 항목 중 가장 첫번째에 커서 focus
        if (invalid.length > 0)
            form[`${invalid[0]}`].focus();

        // 가입경로 항목에 입력 되어있는지 확인
        const radios = form.querySelectorAll("input[type='radio']");
        let isChecked = Array.from(radios).some(r => {
            return r.checked;
        });
        radios.forEach(r => {
            r.addEventListener("input", toggle);
        })

        if (!isChecked)
            form.querySelector(`div.${radios[0].name}`).classList.remove("d:none");

        // 필수 항목 및 가입 경로 체크 안되어있다면 종료
        if (invalid.length > 0 || !isChecked)
            return;

        // 유효성 검사
        const isUsernameValid = await usernameValidation();
        const isPwdValid = pwdValidation();
        const isPwdMatch = pwdMatchValidation();
        const isMember = await refValidation();
        console.log('ref', isMember);

        console.log(isUsernameValid, isPwdValid, isPwdMatch);

        const isValid = [isUsernameValid, isPwdValid, isPwdMatch, isMember].every(Boolean);
        if (!isValid)
            return;

        form.submit();

    };

    // --------- 각 항목별 유효성 검사 ---------------

    username.oninput = debounce(usernameValidation);
    // pwd.addEventListener("input", debounce(pwdValidation));
    // pwd.addEventListener("input", debounce(pwdMatchValidation));
    // checkPwd.oninput = debounce(pwdMatchValidation);
    pwd.addEventListener("input", pwdValidation);
    pwd.addEventListener("input", pwdMatchValidation);
    checkPwd.oninput = debounce(pwdMatchValidation);
    ref.oninput = debounce(refValidation);


    // --------- 추가 기능 ---------------

    // 입력 시작 시 에러 문구 지우기(다음 버튼 누른 후)
    function toggle(e) {
        const error = e.target.closest("div:has(div)").parentElement.querySelector(`div.${e.target.name}`);
        let isTrue = e.target.checked || e.target.value
        error.classList.toggle('d:none', isTrue);
    }

    // 패턴 유효성 검사
    function checkFormat(name, args) {
        const pattern = {
            username: /^[a-z0-9]{5,20}$/,
            pwd: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{7,}$/
        }
        return pattern[name].test(args);
    }



    // 아이디 유효성 검사
    async function usernameValidation() {

        const error = username.closest("div:has(div)").querySelector(`div.format`);
        const check = username.closest('div').querySelector('span.check');

        // 포맷 검사
        const isValid = checkFormat('username', username.value);

        error.classList.toggle('d:none', isValid);
        check.classList.toggle('d:none', !isValid);

        if (!isValid)
            return isValid;

        // 중복 검사

        let signRepository = new SignRepository;
        let isMember = await signRepository.checkMember(username.value);

        check.classList.remove('color:sub-1', 'color:sub-5'); // 기존 클래스 제거
        const className = isMember ? 'color:sub-1' : 'color:sub-5' ;
        const msg = isMember ? '[ 사용불가능 ]' : '[ 사용가능 ]';

        check.classList.add(className);
        check.textContent = msg;


        check.classList.remove('d:none');
        return !isMember;

        }



    // 비밀번호 유효성 검사
    function pwdValidation() {
        const isValid =  checkFormat('pwd', pwd.value);
        const error = pwd.closest("div:has(div)").querySelector(`div.format`);

        error.classList.toggle('d:none', isValid);
        return isValid;

    }

    // 비밀번호 확인 유효성 검사
    function pwdMatchValidation() {
        const isValid = pwd.value && ( pwd.value === checkPwd.value ) ;
        const check = checkPwd.closest("div:has(input)").querySelector(`span.check`);

        check.classList.remove('color:sub-1', 'color:sub-5'); // 기존 클래스 제거
        const className = isValid ? 'color:sub-5' : 'color:sub-1';
        const msg = isValid ? '[ 일치 ]' : '[ 불일치 ]';

        check.classList.add(className);
        check.textContent = msg;


        check.classList.remove('d:none');
        return isValid;
    }

    //추천인 유효성 검사
    async function refValidation() {
        const refNo = ref.nextElementSibling;
        const check = refNo.nextElementSibling;

        if(!ref.value){
            check.classList.add('d:none');
            return true;
        }

        let signRepository = new SignRepository;
        const refMember = await signRepository.getMember(ref.value);

        check.classList.remove('color:sub-1', 'color:sub-5'); // 기존 클래스 제거
        const className = refMember ? 'color:sub-5' : 'color:sub-1';
        const msg = refMember ? '[ 확인되었어요 ]' : '[ 존재하지않는 회원이에요 ]';

        check.classList.add(className);
        check.textContent = msg;

        check.classList.remove('d:none');

        if(refMember)
            refNo.value = refMember.mbrNo;

        return refMember !==null;


    }


});