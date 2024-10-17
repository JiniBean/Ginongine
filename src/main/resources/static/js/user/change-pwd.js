// 비밀번호 유효성 검사
window.addEventListener("DOMContentLoaded", function(e){
    let confirmPwd = document.querySelector("#confirm-pwd");
    // 비밀번호 input
    let pwdInput = confirmPwd.querySelector(".password");

    //사용불가
    let disableDiv= confirmPwd.querySelector(".check-pwd")[0];

    //사용가능
    let usableDiv = confirmPwd.querySelector(".check-pwd")[1];

    let timeoutId;

    //비밀번호 조건 정규식
    let regExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{7,}$/;

    pwdInput.oninput = function (e) {

        if(timeoutId!==undefined){
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(()=>{
            let  pwdValue = pwdInput.value;

            if(pwdValue!==""){
                let isValid = regExp.test(pwdValue);
                checkPwd(isValid);
            }else {
                disableDiv.classList.add("d:none");
                usableDiv.classList.add("d:none");
            }

        },500);

    }

    function checkPwd(isValid){

        if(!isValid){ //사용불가
            disableDiv.classList.remove("d:none");
            usableDiv.classList.add("d:none");
            return false;
        }

        //사용가능
        disableDiv.classList.add("d:none");
        usableDiv.classList.remove("d:none");

    }
});



//비밀번호 일치 불일치 검사
window.addEventListener("DOMContentLoaded", function(){
    let confirmPwd = document.querySelector("#confirm-pwd");
// 비밀번호 input
    let pwdInput = confirmPwd.querySelector(".password");
// 비밀번호 확인
    let verifyPwdInput = confirmPwd.querySelector(".verify-password");

    let submitButton = confirmPwd.querySelector('.submit-button');



    let timeoutId;

    verifyPwdInput.oninput = function () {

        if(timeoutId!==undefined){
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(()=>{
            let pwdValue = pwdInput.value;
            let verifyPwdValue = verifyPwdInput.value;
            checkVerify(pwdValue,verifyPwdValue);

        },500);

    }

    pwdInput.oninput = function () {

        if(timeoutId!==undefined){
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(()=>{
            let pwdValue = pwdInput.value;
            let verifyPwdValue = verifyPwdInput.value;


            if(verifyPwdValue!=="")
                checkVerify(pwdValue,verifyPwdValue);

        },500);

    }
    //비밀번호 값 확인
    function checkVerify(pwdValue,verifyPwdValue){
        let match = document.getElementsByClassName("check-password")[0];
        let mismatch = document.getElementsByClassName("check-password")[1];

        if(pwdValue!==verifyPwdValue){
            match.classList.add("d:none");
            mismatch.classList.remove("d:none");
            sessionStorage.setItem('pwdYn','N');
            return false;
        }

        match.classList.remove("d:none");
        mismatch.classList.add("d:none");
        sessionStorage.setItem('pwdYn','Y');


    }

    submitButton.addEventListener("click",(e)=>{
        let pwdValue = pwdInput.value;
        let verifyPwdValue = verifyPwdInput.value;
        //패스워드와 패스워드 확인이 일치하지 않을 시
        if(pwdValue!==verifyPwdValue){
            e.preventDefault();
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }
        //패스워드와 패스워드 확인 일치 시 redirect signin
        alert("비밀번호 변경이 완료되었습니다.");
    });
});



