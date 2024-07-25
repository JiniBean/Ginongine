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

    async send(email, isNew = false) {
        let info = {
            "email": email,
            "isNew": isNew
        }
        let url = `${baseUrl}/rest/mail/send`;
        let method = 'POST';
        let response = await this.findPromise(url, method, JSON.stringify(info));
        return await response.json();
    }

    async verify(email, sendBtn, confirm, valid, isNew = false) {

        const confirmBtn = confirm.querySelector("button");
        const timer = confirm.querySelector("div.timer");
        const resultMsg = confirm.querySelector("div.timer");
        let result = await this.send(email, isNew);
        alert(result.msg);
        if(!(result.code===200))
            return;

        confirmBtn.classList.remove("disabled");
        confirmBtn.disabled = false;

        valid.email = true;

        confirm.querySelector("div.timer").classList.remove("d:none");
    }

}