let baseUrl = window.location.origin;
export default class StockRepository{

    findPromise(url,method="GET", data = null){

        let header = {
            "Content-Type": "application/json",
        }

        // 메소드가 GET이 아니라면 option 넣음
        let option = method === 'GET' ? null : {method:method, headers:header, body:data}

        return fetch(url, option);

    }

    async findAll(query,amount, current){
        let url = `${baseUrl}/api/stock?`;

        if(query)
            url += `q=${query}&`

        if(amount !=null)
            url += `a=${amount}`
        else
            url += `c=${current}`

        let response = await this.findPromise(url);
        let list =  await response.json();
        return list;
    }

    async findItem(prdId){
        let url = `${baseUrl}/api/stock/${prdId}`;

        let response = await this.findPromise(url);

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

    async count(){
        let url = `${baseUrl}/api/stock/c`;

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


    async add(prdId){
        let url = `${baseUrl}/api/stock`;
        let method = 'POST';
        let response = await this.findPromise(url,method, prdId); // Controller에서 Long 타입으로 받기 때문에 stringify() 하면 안됨
        return await response.json();
    }



    async delete(data){
        let url = `${baseUrl}/api/stock`;
        let method = 'DELETE';
        let response = await this.findPromise(url,method,JSON.stringify(data));
        return await response.json();

    }




}

