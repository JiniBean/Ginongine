let baseUrl = window.location.origin;
export default class EmailVerifier {

    #timerInterval; //interval id
    #confirmDiv;    //인증번호 영역


    constructor(confirmDiv) {
        this.#confirmDiv = confirmDiv;
    }

    findPromise(url,method="GET", data = null){

        let header = {
            "Content-Type": "application/json",
        }

        // 메소드가 GET이 아니라면 option 넣음
        let option = method === 'GET' ? null : {method:method, headers:header, body:data}

        return fetch(url, option);

    }

    checkEmail(email){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    checkCode(code){
        const codePattern = /^\d{6}$/;
        return codePattern.test(code);
    }

    async send(email, sendBtn, isNew = false) {
        const confirmBtn = this.#confirmDiv.querySelector("button");

        //유효성 검사
        if(!email){
            alert("이메일 주소를 입력해주세요");
            return false;
        }

        let isValid = this.checkEmail(email);
        if(!isValid){
            alert("이메일 형식이 맞지 않습니다");
            return false;
        }

        //메일 전송에 필요한 정보 Json 객체
        let info = {
            "email": email,
            "isNew": isNew
        }

        let url = `${baseUrl}/rest/mail/send`;
        let method = 'POST';
        let response = await this.findPromise(url, method, JSON.stringify(info));
        let result = await response.json();

        alert(result.msg);

        //이메일 전송 성공이 아닐 경우 return
        if(!(result.code===200))
            return false;

        //인증번호 전송 버튼 disabled 제거
        confirmBtn.classList.remove("disabled");
        confirmBtn.disabled = false;

        //이메일 전송 버튼 text 변경
        sendBtn.textContent = '재전송';

        //인증 유효시간 타이머 시작
        this.count();
        return true;
    }

    count(){
        const timer = this.#confirmDiv.querySelector("div.timer");
        const confirmBtn = this.#confirmDiv.querySelector("button");

        // 인증 유효시간 (3)
        const VALID_TIME  = 1 * 60 * 1000; // 5분을 밀리초로 변환

        // 현재 시간과 유효시간을 더하여 만료 시간을 설정
        const expireTime  = new Date().getTime() + VALID_TIME ;

        updateTimer();

        // 1초마다 타이머 업데이트
        const timerInterval = setInterval(updateTimer, 1000);
        this.#timerInterval = timerInterval;


        function updateTimer() {
            const now = new Date().getTime();
            const timeRemaining = expireTime  - now;

            if (timeRemaining < 1000) {
                timer.classList.add("d:none");
                confirmBtn.classList.add("disabled");
                confirmBtn.disabled = true;
                clearInterval(timerInterval);
            } else {
                timer.classList.remove("d:none");
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                timer.textContent = `${minutes} : ${seconds}`;
            }
        }

    }

    async confirm(valid, submitBtn) {
        const confirmBtn = this.#confirmDiv.querySelector("button");
        const code = this.#confirmDiv.querySelector("input").value;
        const timer = this.#confirmDiv.querySelector("div.timer");
        const resultMsg = this.#confirmDiv.querySelector("div.result");

        // 인증 가능한 상태인지 검사
        if (confirmBtn.disable || timer.classList.contains("d:none"))
            return;

        //입력이 제대로 되어있는지 검사
        if (!code) {
            alert("인증번호를 입력해주세요");
            return;
        }
        if(!this.checkCode(code)){
            alert("인증번호 형식이 맞지 않습니다");
            return;
        }

        let url = `${baseUrl}/rest/mail/confirm?c=${code}`;
        let response = await this.findPromise(url);
        let result = await response.json();

        resultMsg.classList.remove("d:none");

        //인증 성공이 아닐 경우 return
        if(!(result.code===200)){
            submitBtn.classList.add("disabled");
            submitBtn.disabled = true;
            resultMsg.textContent = result.msg;
            resultMsg.style.color = 'red';
            return false;
        }

        //성공일 경우

        //다음버튼 활성화
        submitBtn.classList.remove('disabled');
        submitBtn.disabled = false;
        //결과 출력
        resultMsg.textContent = result.msg;
        resultMsg.style.color = 'green';
        confirmBtn.disable = true;
        confirmBtn.textContent = '인증 완료';

        //타이머 비활성화
        timer.classList.add('d:none');
        clearInterval(this.#timerInterval );

        valid.email = true;
        return true;

    }



}