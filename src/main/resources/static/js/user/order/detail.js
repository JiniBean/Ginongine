import Repository from "/js/module/OrderRepository.js";
import MemberRepository from "/js/module/MemberRepository.js";
import CartRepository from "/js/module/CartRepository.js";

const { createApp } = Vue;

createApp({
    data() {
        return {
            list: [],
            order: {},
            payment: {},
            location: {},
            state:[],
            member: {},
            isChecked:false
        }
    },
    methods:{
        // 전체선택
        checkAll(check) {
            this.isChecked = check;
        },
        formatDate(date) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 월은 0부터 시작하기 때문에 1을 더함
            let day = date.getDate();

            //결과값 2024.05.24
            return `${year}.${month < 10 ? '0' : ''}${month}.${day < 10 ? '0' : ''}${day}`;
        },
        async addCart() {
            let inputs = document.querySelectorAll("input[name='prdIds']:checked");
            if (!inputs.length) {
                alert("주문하실 상품을 선택해주세요");
                return;
            }
            let list = [];
            inputs.forEach(i => list.push(i.value));

            let cartRepository = new CartRepository;
            let valid = await cartRepository.addList(list);
            if(valid)
                location.href='/cart';
        },
        goInfo(){
            let inputs = document.querySelectorAll("input[name='prdIds']:checked");
            if(!inputs.length){
                alert("주문하실 상품을 선택해주세요");
                return;
            }

            this.$refs.form.submit();
        },
        async cancel(order) {
            let isTrue = confirm("정말로 취소하시겠어요?");
            if (!isTrue)
                return;
            let repository = new Repository;
            let data = {
                id: order.id
            }
            let valid = await repository.addCancel(data);
            if(valid){
                alert("주문이 취소되었어요");
                this.$refs.btn.disabled = true;
            }

        }
    },
    async created(){
        let params = new URLSearchParams(location.search);
        let orderId = params.get('orderId')

        let repository = new Repository();
        this.list = await repository.findItems(orderId);
        this.order = this.list[0];
        this.state = await repository.findCategories();
        this.payment = await repository.findPayment(orderId)
        this.location = await repository.findLocation(orderId)

        let memberRepository = new MemberRepository();
        this.member = await memberRepository.findUser();

        this.order.date = this.formatDate(new Date(this.order.date));

    },
}).mount('main');





// const { createApp } = Vue
//
// createApp({
//     data() {
//         return {
//             order: {},
//             itemList: [],
//             address: [],
//             member: [],
//             info: [],
//             state: [],
//         }
//     },
//     methods:{
//         // 전체선택
//         checkAll(e) {
//             let checked = e.target.checked
//             // this.order.orderItems.forEach(item => item.checked = checked)
//             this.itemList.forEach(itemList => itemList.checked = checked)
//         }
//     },
//     async created(){
//         let params = new URLSearchParams(location.search);
//         console.log(params.get('orderId'));
//         let orderId = params.get('orderId');
//
//         let response = await fetch(`/user/api/order/${orderId}/items`);
//         let itemList = await response.json();
//         this.itemList = itemList;
//
//         response = await fetch(`/user/api/order/${orderId}/location`);
//         let address = await response.json();
//         this.address = address;
//
//         response = await fetch(`/user/api/order/${orderId}/member`);
//         let member = await response.json();
//         this.member = member;
//
//         response = await fetch(`/user/api/order/${orderId}/orderInfo`);
//         let info = await response.json();
//         this.info = info;
//
//         const dateIdx = info.orderDate.search("T");
//         const subDate = info.orderDate.substring(0, dateIdx);
//         this.info.orderDate = subDate;
//
//         response = await fetch("/user/api/order/delivery-status");
//         let state = await response.json();
//         this.state = state;
//     },
// }).mount('main');
//
//
