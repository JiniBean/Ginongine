const { createApp } = Vue;
createApp({
    data(){
        return{
            orderStats:[],
            stockStats:[],
            inquiryStats:[],
            inquiryList:[],
            baseUrl:window.location.origin,
            list : [],
            query: ""
        }
    },
    methods:{
        moveStock(id){
            //클릭한 상품의 상품 id를 인자로 받음
            location.href = `/admin/stock/detail?p=${id}`;
        },
        moveInquiry(){

        },
        async getOrderStats(){
            let res = await fetch('/api/stats/order');
            this.orderStats = await res.json();
        },
        async getStockStats(){
            let res = await fetch('/api/stats/stock');
            this.stockStats = await res.json();
        },
        async getInquiryStats(){
            let res = await fetch('/api/stats/inquiry');
            this.inquiryStats = await res.json();
            // this.inquiryStats.forEach(l => l.date = this.formatDate(new Date(l.date) ) );
            this.inquiryStats.forEach(i => i.date = this.formatDate(new Date(i.date)));
        },

        formatDate(date) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 월은 0부터 시작하기 때문에 1을 더함
            let day = date.getDate();

            //결과값 2024.05.24
            return `${year}.${month < 10 ? '0' : ''}${month}.${day < 10 ? '0' : ''}${day}`;
        },

    },
    mounted(){
        this.getOrderStats();
        this.getStockStats();
        this.getInquiryStats();

    }
}).mount('main');