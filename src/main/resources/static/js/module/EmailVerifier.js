import Toast from "/js/module/Toast.js";
let baseUrl = window.location.origin;
export default class EmailVerifier {

    timerInterval;     //interval id
    confirmSection;    //이메일 인증 영역
    confirmBtn;        //인증 확인 버튼
    sendBtn;           //이메일 발송 버튼
    timer;             //인증번호 유효기간
    result;            //인증결과 메세지


    constructor(confirm) {
        this.confirmSection = confirm;
        this.confirmBtn = this.confirmSection.querySelector("#confirm");
        this.sendBtn = this.confirmSection.querySelector("#send");
        this.timer = this.confirmSection.querySelector("#timer");
        this.result = this.confirmSection.querySelector("#result");
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

    async send(email, isNew = false, expireCallback = null){

        //유효성 검사
        if(!email){
            Toast.error("이메일 주소를 입력해주세요");
            return false;
        }

        if(!this.checkFormat(email, 'email')){
            Toast.error("이메일 형식이 맞지 않습니다");
            return false;
        }


        const info = JSON.stringify({email, isNew}); //isNew = 신규회원인지
        const url = `${baseUrl}/rest/mail/send`;
        const method = 'POST';
        const response = await this.findPromise(url, method, info);
        const result = await response.json();

        Toast.info(result.msg, true);

        //이메일 전송 성공이 아닐 경우 return
        if(result.code !==200)
            return false;

        //인증번호 확인 버튼 disabled 제거
        this.confirmBtn.classList.remove("disabled");
        this.confirmBtn.disabled = false;

        //전송버튼 텍스트 변경
        this.sendBtn.textContent = '재전송';

        //인증 유효시간 타이머 시작
        this.startTimer(expireCallback);
        return true;
    }

    startTimer(expireCallback){
        // const VALID_TIME  = 3 * 60 * 1000;
        const VALID_TIME  = 30 *1000;
        const expireTime  = new Date().getTime() + VALID_TIME ;

        // 1초마다 타이머 업데이트
        this.timerInterval = setInterval(() => this.updateTimer(expireTime , expireCallback), 1000);

    }

    updateTimer(expireTime, expireCallback) {
        const now = new Date().getTime();
        const timeRemaining = expireTime  - now;

        if (timeRemaining < 1000) {
            this.timer.classList.add("d:none");
            this.confirmBtn.classList.add("disabled");
            this.confirmBtn.disabled = true;
            this.result.textContent = '[인증시간 만료] 이메일을 재발송 해주세요';
            this.result.classList.add('color:accent-3');
            clearInterval(this.timerInterval);
            if(expireCallback) expireCallback();
        } else {
            this.timer.classList.remove("d:none");
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            this.timer.textContent = `${minutes} : ${seconds}`;
        }
    }

    async confirm() {
        const code = this.confirmSection.querySelector("input").value;

        // 인증 가능한 상태인지 검사
        if (this.confirmBtn.disable || this.timer.classList.contains("d:none"))
            return false;

        //입력이 제대로 되어있는지 검사
        if (!code) {
            Toast.error("인증번호를 입력해주세요");
            this.result.textContent("인증번호를 입력해주세요");
            this.result.classList.add('color:accent-3');
            return false;
        }
        if(!this.checkFormat(code, 'code')){
            Toast.error("인증번호 형식이 맞지 않습니다");
            this.result.textContent("인증번호 형식이 맞지 않습니다");
            this.result.classList.add('color:accent-3');
            return false;
        }

        const url = `${baseUrl}/rest/mail/confirm?c=${code}`;
        const response = await this.findPromise(url);
        const result = await response.json();
        const isOk = result.code === 200


        //성공이라면 타이며 비활성화
        if(isOk){
            timer.classList.add('d:none');
            clearInterval(this.timerInterval );
        }

        //결과 출력
        this.result.classList.remove("d:none");
        this.result.classList.remove("color:accent-3");
        this.result.textContent = result.msg;
        this.result.style.color = isOk ? 'green' : 'red';
        this.confirmBtn.disable = isOk;
        this.confirmBtn.textContent = isOk? '인증 완료' : this.confirmBtn.textContent;

        return isOk;

    }



}