const { createApp } = Vue;
import Repository from "/js/module/OrderRepository.js";
createApp({
    data(){
        return{
            orderType:1,//기본값
            sortType:null,
            list:[],
            query: "",
            category:{
                1:'주문',
                2:'교환',
                3:'환불',
                4:'취소'
            },
            code:{
                1:'요청',
                2:'진행중',
                3:'완료',
                4:'거절'
            }
        }
    },
    methods:{
        async getList(orderType, sortType){
            if(this.orderType !== orderType)
                this.query = null;
            this.orderType = orderType;
            this.sortType = sortType

            let repository = new Repository;

            switch (orderType) {
                case 1:
                    this.list = await repository.findAll(this.query,sortType,false);
                    break;
                case 2:
                    this.list = await repository.findExchange(this.query,sortType,false);
                    break;
                case 3:
                    this.list = await repository.findRefund(this.query,sortType,false)
                    break;
                case 4:
                    this.list = await repository.findCancel(this.query,false)

            }

            this.list.forEach(l => l.date=this.formatDate(new Date(l.date)));

        },
        goDetail(order){

            switch (this.orderType) {
                case 1:
                    location.href=`detail?id=${order.id}`;
                    break;
                case 2:
                    location.href=`detail?id=${order.id}&e=${order.exchangeId}`;
                    break;
                case 3:
                    location.href=`detail?id=${order.id}&r=${order.refundId}`;
                    break;
                case 4:
                    location.href=`detail?id=${order.id}&c=${order.cancelId}`;

            }
        },
        formatDate(date) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 월은 0부터 시작하기 때문에 1을 더함
            let day = date.getDate();

            //결과값 2024-05-24
            return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        },
    },
    mounted(){
        this.getList(1);
    }
}).mount('main');