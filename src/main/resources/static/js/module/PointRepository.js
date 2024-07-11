let baseUrl = window.location.origin;
export default class PointRepository{

    findPromise(url,method="GET", data = null){

        let header = {
            "Content-Type": "application/json",
        }

        // 메소드가 GET이 아니라면 option 넣음
        let option = method === 'GET' ? null : {method:method, headers:header, body:data}

        return fetch(url, option);

    }

    async findAll(query,sortType,isUser){
        let url = `${baseUrl}/api/point/history/list?`;

        if(query)
            url += `q=${query}&`

        if(sortType)
            url += `s=${sortType}&`

        if(isUser)
            url += `u=${isUser}`

        let response = await this.findPromise(url);
        return await response.json();
    }


}

