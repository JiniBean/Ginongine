const { createApp } = Vue;
import Repository from "/js/module/StockRepository.js";
createApp({
    data(){
        return{
            current:false,
            amount:false,
            list:[],
            query: ""
        }
    },
    methods:{
        currentHandler(){
            this.current = !this.current;
            this.amount = null;
            this.getList();

        },
        amountHandler(){
            this.amount = !this.amount;
            this.current = false;
            this.getList();
        },
        move(id){
            //클릭한 상품의 상품 id를 인자로 받음
            location.href = `detail?p=${id}`;
        },
        async getList(){
            let repository = new Repository;
            this.list = await repository.findAll(this.query, this.amount, this.current);
        }
    },
    mounted(){
        this.getList();
    }
}).mount('main');