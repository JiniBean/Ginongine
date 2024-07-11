let baseUrl = window.location.origin;
export default class MemberRepository{

    findPromise(url,method="GET", data = null){

        let header = {
            "Content-Type": "application/json",
        }

        // 메소드가 GET이 아니라면 option 넣음
        let option = method === 'GET' ? null : {method:method, headers:header, body:data}

        return fetch(url, option);

    }

    async findUser(){
        let url = `${baseUrl}/api/member/userinfo`;

        let response = await this.findPromise(url)

        // 응답의 상태 코드 확인
        if (response.status === 200) {
            //response가 비었는지 확인
            if (response.headers.get('content-length') === '0') {
                return null;
            }
            let member = await response.json();
            return member;
        }
    }






}

