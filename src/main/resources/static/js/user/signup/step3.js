
window.addEventListener("load", function () {

    const form = document.forms['member'];
    const username = form['userNm'];
    const pwd = form['pwd'];
    const checkPwd = form['check'];
    const joinRoute = form['joinRtCd'];
    const ref = form['ref'];


    // 입력 시작 시 에러 문구 지우기(다음 버튼 누른 후)
    function toggle(e) {
        const error = e.target.closest("div:has(div)").querySelector(`div.${e.target.name}`);
        error.classList.toggle('d:none', e.target.value || form.querySelector(`input[name=${e.target.name}]:checked`));
    }

    // 패턴 유효성 검사
    function checkFormat(args, name) {
        const pattern =
        {
            username : /^[a-z0-9]{5,20}$/,
            pwd : /^[a-zA-Z0-9]{7,}$/
        }
        return pattern[name].test(args);
    }

    // --------- 다음 버튼 눌렀을 때 유효성 검사 ---------------
    form.addEventListener("submit", function (e) {
        e.preventDefault();

    });

});