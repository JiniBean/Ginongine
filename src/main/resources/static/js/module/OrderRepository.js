let baseUrl = window.location.origin;
export default class OrderRepository{

    findPromise(url,method="GET", data = null){

        let header = {
            "Content-Type": "application/json",
        }

        // 메소드가 GET이 아니라면 option 넣음
        let option = method === 'GET' ? null : {method:method, headers:header, body:data}

        return fetch(url, option);

    }

    async findAll(query,sortType,isUser){
        let url = `${baseUrl}/api/order?`;

        if(query)
            url += `q=${query}&`

        if(sortType)
            url += `s=${sortType}&`

        if(isUser)
            url += `u=${isUser}`

        let response = await this.findPromise(url);
        return await response.json();
    }

    async findCancelAll(query,isUser){

        let url = `${baseUrl}/api/order/all?`;

        if(query)
            url += `q=${query}&`
        if(isUser)
            url += `u=${isUser}`

        let response = await this.findPromise(url);
        return await response.json();
    }

    async findCancel(query,isUser){

        let url = `${baseUrl}/api/order/cncl?`;

        if(query)
            url += `q=${query}&`
        if(isUser)
            url += `u=${isUser}`

        let response = await this.findPromise(url);
        return await response.json();
    }

    async findExchange(query,sortType,isUser){
        let url = `${baseUrl}/api/order/exch?`;

        if(query)
            url += `q=${query}&`

        if(sortType)
            url += `s=${sortType}&`

        if(isUser)
            url += `u=${isUser}&`

        let response = await this.findPromise(url);
        return await response.json();
    }

    async findRefund(query,sortType,isUser){
        let url = `${baseUrl}/api/order/rfnd?`;

        if(query)
            url += `q=${query}&`

        if(sortType)
            url += `s=${sortType}&`

        if(isUser)
            url += `u=${isUser}&`

        let response = await this.findPromise(url);
        return await response.json();
    }

    async findItems(id){
        let url = `${baseUrl}/api/order/${id}`;


        let response = await this.findPromise(url);
        return await response.json();
    }

    async findCategories(){
        let url = `${baseUrl}/api/order/c`;


        let response = await this.findPromise(url);
        return await response.json();
    }

    async findPayment(orderId){
        let url = `${baseUrl}/api/order/p?o=${orderId}`;

        let response = await this.findPromise(url);
        return await response.json();
    }

    async findLocation(orderId){
        let url = `${baseUrl}/api/order/l?o=${orderId}`;

        let response = await this.findPromise(url);
        return await response.json();
    }


    async update(order){
        let url = `${baseUrl}/api/order/u`;
        let method = 'POST';
        let response = await this.findPromise(url,method, JSON.stringify(order));

        return await response.json();
    }

    async addCancel(order){
        let url = `${baseUrl}/api/order/cancel`;
        let method = 'POST';
        let response = await this.findPromise(url,method,JSON.stringify(order));
        return await response.json();
    }

}

