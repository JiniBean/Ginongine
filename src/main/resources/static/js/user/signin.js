document.addEventListener("DOMContentLoaded",(e)=>{

    // ================비밀번호 표시 및 숨기기=====================
    const password = document.querySelector('#password');
    const iconEye = password.querySelector('.icon-eye');
    const iconEyeSlash = password.querySelector('.icon-eye-slash');
    const passwordInput = password.querySelector('.password-input');
    iconEye.addEventListener('click',()=>{

        iconEye.classList.add("d:none");
        iconEyeSlash.classList.remove("d:none");
        passwordInput.type="text";
    });

    iconEyeSlash.addEventListener('click',()=>{

        iconEyeSlash.classList.add("d:none");
        iconEye.classList.remove("d:none");
        passwordInput.type="password";
    });

    //=====================로그인 실패 시 text 출력======================
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorMessage = password.querySelector('.error-message');

    if (error) {
        errorMessage.textContent = "아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.";
    }

    //==========아이디 저장 시 username 을 username inputbox에 출력===========
    const username = document.querySelector('#username');
    let savedUsername = getCookie("saved_username");

    if(savedUsername !== ""){
        username.querySelector('.input-username').value = savedUsername;
    }
});

// ======================아이디 저장 cookie 함수======================
function getCookie(name){                                       //쿠키이름을 매개변수로 넘겨받음
    let value ="; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if(parts.length == 2){
        return parts.pop().split(";").shift();
    }
    return "";
}