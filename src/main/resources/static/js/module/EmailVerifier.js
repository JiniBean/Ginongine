let baseUrl = window.location.origin;
export default class EmailVerifier {

    #timerInterval; //interval id
    #confirmDiv;    //인증번호 영역
    confirmBtn;     //인증 확인 버튼


    constructor(confirmDiv) {
        this.#confirmDiv = confirmDiv;
        this.confirmBtn = this.#confirmDiv.querySelector("button");
    }

    findPromise(url,method="GET", data = null){

        let header = {
            "Content-Type": "application/json",
        }

        // 메소드가 GET이 아니라면 option 넣음
        let option = method === 'GET' ? null : {method:method, headers:header, body:data}

        return fetch(url, option);

    }

   checkFormat(args, name) {
        const pattern =
            {
                email : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                code : /^\d{6}$/
            }
        return pattern[name].test(args);
    }

    async send(email, sendBtn, isNew = false) {

        //유효성 검사
        if(!email){
            alert("이메일 주소를 입력해주세요");
            return false;
        }

        if(!this.checkFormat(email, 'email')){
            alert("이메일 형식이 맞지 않습니다");
            return false;
        }


        const info = JSON.stringify({email, isNew});
        const url = `${baseUrl}/rest/mail/send`;
        const method = 'POST';
        const response = await this.findPromise(url, method, info);
        const result = await response.json();

        alert(result.msg);

        //이메일 전송 성공이 아닐 경우 return
        if(result.code !==200)
            return false;

        //인증번호 전송 버튼 disabled 제거
        this.confirmBtn.classList.remove("disabled");
        this.confirmBtn.disabled = false;

        //인증 유효시간 타이머 시작
        this.startTimer();
        return true;
    }

    startTimer(){
        const VALID_TIME  = 3 * 60 * 1000;
        const expireTime  = new Date().getTime() + VALID_TIME ;

        // 1초마다 타이머 업데이트
        this.#timerInterval = setInterval(() => this.updateTimer(expireTime), 1000);

    }

    updateTimer(expireTime) {
        const timer = this.#confirmDiv.querySelector("div.timer");
        const now = new Date().getTime();
        const timeRemaining = expireTime  - now;

        if (timeRemaining < 1000) {
            timer.classList.add("d:none");
            this.confirmBtn.classList.add("disabled");
            this.confirmBtn.disabled = true;
            clearInterval(this.#timerInterval);
        } else {
            timer.classList.remove("d:none");
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            timer.textContent = `${minutes} : ${seconds}`;
        }
    }

    async confirm() {
        const code = this.#confirmDiv.querySelector("input").value;
        const timer = this.#confirmDiv.querySelector("div.timer");
        const resultMsg = this.#confirmDiv.querySelector("div.result");

        // 인증 가능한 상태인지 검사
        if (this.confirmBtn.disable || timer.classList.contains("d:none"))
            return false;

        //입력이 제대로 되어있는지 검사
        if (!code) {
            alert("인증번호를 입력해주세요");
            return false;
        }
        if(!this.checkFormat(code, 'code')){
            alert("인증번호 형식이 맞지 않습니다");
            return false;
        }

        const url = `${baseUrl}/rest/mail/confirm?c=${code}`;
        const response = await this.findPromise(url);
        const result = await response.json();
        const isOk = result.code === 200


        //성공이라면 타이며 비활성화
        if(isOk){
            timer.classList.add('d:none');
            clearInterval(this.#timerInterval );
        }

        //결과 출력
        resultMsg.classList.remove("d:none");
        resultMsg.textContent = result.msg;
        resultMsg.style.color = isOk ? 'green' : 'red';

        this.confirmBtn.disable = isOk;
        this.confirmBtn.textContent = isOk? '인증 완료' : this.confirmBtn.textContent;

        return isOk;

    }



}