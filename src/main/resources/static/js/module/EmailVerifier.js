let baseUrl = window.location.origin;
export default class EmailVerifier {

    findPromise(url,method="GET", data = null){

        let header = {
            "Content-Type": "application/json",
        }

        // 메소드가 GET이 아니라면 option 넣음
        let option = method === 'GET' ? null : {method:method, headers:header, body:data}

        return fetch(url, option);

    }

    checkFormat(email){
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    async send(email, sendBtn, isNew = false) {
        let info = {
            "email": email,
            "isNew": isNew
        }
        let url = `${baseUrl}/rest/mail/send`;
        let method = 'POST';
        let response = await this.findPromise(url, method, JSON.stringify(info));
        let result = await response.json();
        alert(result.msg);
        if(!(result.code===200))
            return;

        sendBtn.textContent = '재전송';
        return true;
    }

    confirm(confirm, valid){
        const confirmBtn = confirm.querySelector("button");
        if(confirmBtn.hasClass("d:none"))
            return;
    }

    count(confirm){
        const timer = confirm.querySelector("div.timer");
        confirm.querySelector("div.timer").classList.remove("d:none");
        const confirmBtn = confirm.querySelector("button");
        confirmBtn.addEventListener("click", code);

        // 인증 유효시간 (예: 5분)
        const VALIDITY_PERIOD = 5 * 60 * 1000; // 5분을 밀리초로 변환

// 현재 시간과 유효시간을 더하여 만료 시간을 설정
        const expirationTime = new Date().getTime() + VALIDITY_PERIOD;

// 타이머 업데이트 함수
        function updateTimer() {
            const now = new Date().getTime();
            const timeRemaining = expirationTime - now;

            if (timeRemaining < 0) {
                document.getElementById("timer").innerText = "인증 유효시간이 만료되었습니다.";
                clearInterval(timerInterval);
            } else {
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                document.getElementById("timer").innerText = `${minutes}분 ${seconds}초`;
            }
        }

// 1초마다 타이머 업데이트
        const timerInterval = setInterval(updateTimer, 1000);

// 페이지 로드 시 타이머를 즉시 업데이트
        updateTimer();
    }

    code(e){
        let code = e.target.closest("input").value;
        console.log(code);
    }

    async verify(email, sendBtn, confirm, valid, isNew = false) {

        const resultMsg = confirm.querySelector("div.timer");

        let result = await this.send(email, isNew);

        let code =  this.count(confirm);


        valid.email = true;


    }

}