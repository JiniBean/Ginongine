let baseUrl = window.location.origin;
export default class
CartRepository{

    findPromise(url,method="GET", data = null){

        let header = {
            "Content-Type": "application/json",
        }

        // 메소드가 GET이 아니라면 option 넣음
        let option = method === 'GET' ? null : {method:method, headers:header, body:data}

        return fetch(url, option);

    }

    async findAll(){
        let url = `${baseUrl}/api/cart`;

        let response = await this.findPromise(url)

        // 응답의 상태 코드 확인
        if (response.status === 200) {
            //response가 비었는지 확인
            if (response.headers.get('content-length') === '0') {
                return null;
            }
            let item = await response.json();
            return item;
        }
    }

    async findItem(prdId){
        let url = `${baseUrl}/api/cart/${prdId}`;

        let response = await this.findPromise(url)

        // 응답의 상태 코드 확인
        if (response.status === 200) {
            //response가 비었는지 확인
            if (response.headers.get('content-length') === '0') {
                return null;
            }
            let item = await response.json();
            return item;
        }
    }

    async findAvailableQty(memberId){
        let url = `${baseUrl}/api/cart/available-qty`;

        let response = await this.findPromise(url);

        // 응답의 상태 코드 확인
        if (response.status === 200) {
            //response가 비었는지 확인
            if (response.headers.get('content-length') === '0') {
                return null;
            }
            let items = await response.json();
            return items;
        }
    }

    async findLocationByMemberId(memberId){

        // memberId가 null이면 memberId = 2L => 테스트용
        if(memberId == null) memberId = 2;

        let url = `${baseUrl}/api/cart/location/${memberId}`;
        let response = await this.findPromise(url);

        // 응답의 상태 코드 확인
        if (response.status === 200) {
            //response가 비었는지 확인
            if (response.headers.get('content-length') === '0') {
                return null;
            }
            let items = await response.json();
            return items;
        }
    }


    async count(){
        let url = `${baseUrl}/api/cart/c`;

        let response = await this.findPromise(url);

        // 응답의 상태 코드 확인
        if (response.status === 200) {
            //response가 비었는지 확인
            if (response.headers.get('content-length') === '0') {
                return null;
            }
            // 잘왔다면 장바구니 수량 보내기
            let count = await response.json();
            return count;
        }
    }


    //장바구니에 상품 한 개 담을 때
    async add(prdId,qty){
        let url = `${baseUrl}/api/cart`;
        let method = 'POST';

        let cart ={
            productId:prdId,
            quantity:qty
        }
        let response = await this.findPromise(url,method,JSON.stringify(cart))
        return await response.json();
    }

    // 장바구니에 여러 개 담을 때
    async addList(list){
        let url = `${baseUrl}/api/cart/list`;
        let method = 'POST';
        let response = await this.findPromise(url,method, JSON.stringify(list))
        return await response.json();
    }

    async updateQty(productId, quantity= null){
        let url = `${baseUrl}/api/cart/u`;
        let method = 'POST';
        let data = {productId, quantity};
        let response = await this.findPromise(url,method, JSON.stringify(data));

        return await response.json();
    }

    async delete(data){
        let url = `${baseUrl}/api/cart`;
        let method = 'DELETE';
        let response = await this.findPromise(url,method,JSON.stringify(data));
        return await response.json();

    }




}

