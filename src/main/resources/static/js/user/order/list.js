import Repository from "/js/module/OrderRepository.js";
import CartRepository from '/js/module/CartRepository.js';
import Header from '/js/module/header.js';

const { createApp } = Vue

createApp({
    data() {
        return {
            list: [],
            tabIndex: 0,
            query: null,
            code:{
                1:'요청',
                2:'진행중',
                3:'완료',
                4:'거절'
            }
        }
    },
    methods:{
        async getList(idx, isReset) {
            //클릭한 인덱스로 탭 바꾸기(active)

            if(isReset)
                this.query = '';
            this.tabIndex = idx;
            let repository = new Repository;

            //취소내역(1)
            if(idx){
                this.list = await repository.findCancel(this.query,true);
                this.list.forEach(l=> {
                    l.cnclDate = this.formatDate(new Date(l.cnclDate))
                })
            }
            //주문내역(0)
            else{
                this.list = await repository.findAll(this.query,null,true);
                this.list.forEach(l=> {
                    l.date = this.formatDate(new Date(l.date))
                })
            }
        },

        // 주문 상세내역 페이지로 이동하기
        goDetail(orderId) {
            location.href = `/order/detail?orderId=${orderId}`;
        },
        // 구매확정하기
        async confirmOrder(o) {

            let isTrue = confirm("구매확정 후에는 교환과 환불이 어려워요\n정말로 구매확정 하시겠어요?");
            if(!isTrue)
                return;

            let order={
                id:o.id,
                categoryId:5,
            }
            let repository = new Repository;

            let s = await repository.update(order);
            if (s){
                o.categoryId = 5;
                o.category = '구매확정';
            }
        },
        // 장바구니 담기
        async addCart(order){

            let cartRepository = new CartRepository;
            let valid = false;

            //주문 취소건이라면
            if(order.cancelId){

                // 주문 번호로 주문 상세 목록 갖고 오기
                let repository = new Repository;
                let items = await repository.findItems(order.id);

                //주문한 상품 아이디들 배열로 만들기
                let list = [];
                items.forEach(i => list.push(i.productId));

                //현재 장바구니 리스트 가져오기
                let cartList = await cartRepository.findAll();

                //장바구니에 해당 상품 있는지 확인
                cartList.forEach(cart => {
                    let idx = list.indexOf(cart.productId)

                    //만약 있다면 리스트에서 지워버리기
                    if(idx>-1)
                        list.splice(idx,1);
                })

                //지우고 남은 상품 있다면 장바구니에 저장하기
                if(list.length >0)
                    valid = await cartRepository.addList(list);
            }
            //교환, 환불건이라면
            else {
                //장바구니에 해당 상품 있는지 판별
                let item = await cartRepository.findItem(order.productId)

                //없으면 장바구니에 추가
                if(!item)
                    valid = await cartRepository.add(order.productId)
            }

            // 성공하면 헤더의 장바구니 상품 숫자 바꾸기
            if(valid){
                let header = new Header;
                header.renewCart();
            }

            alert("이미 있는 상품을 제외하고 장바구니에 담았어요!");

        },
        formatDate(date) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 월은 0부터 시작하기 때문에 1을 더함
            let day = date.getDate();

            //결과값 2024.05.24
            return `${year}.${month < 10 ? '0' : ''}${month}.${day < 10 ? '0' : ''}${day}`;
        }
    },
    created() {
        this.getList();
    }
}).mount('main');




// const { createApp } = Vue
//
// createApp({
//     data() {
//         return {
//             list: [],
//             itemsMap: {},
//             //info: [],
//             state: {},
//             tabIndex: 0,
//         }
//     },
//     methods:{
//         // 탭바꾸기
//         clickTab(selectedIndex) {
//             this.tabIndex = selectedIndex;
//
//             // tabIndex가 바뀌면 api를 새로 호출해야함
//             if (this.tabIndex == 0) {
//                 // 주문상태가 주문완료 배송준비중 배송중 배송완료 구매확정 상태
//                 this.loadList();
//             }
//             else if (this.tabIndex == 1) {
//                 // 취소요청중 취소완료 상태
//                 this.loadCancelList();
//             }
//
//         },
//
//         // 주문 상세내역 페이지로 이동하기
//         goDetail(orderId) {
//             location.href = `/order/detail?orderId=${orderId}`;
//         },
//
//         // 구매확정하기
//         async confirmOrder(order) {
//             console.log(order);
//             let orderId = order.id;
//             let requestOptions = {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: 5
//             };
//             await fetch(`/user/api/order/${orderId}`, requestOptions)
//                 // .then(response => response.json());
//             this.loadList();
//         },
//
//         // 주문내역(배송요청중~구매확정)
//         async loadList() {
//             let memberId = 40;
//             let response = await fetch(`/user/api/order/${memberId}/list`);
//             let list = await response.json();
//             this.list = list;
//
//             for (item of list) {
//                 const dateIdx = item.date.search("T");
//                 const subDate = item.date.substring(0, dateIdx);
//                 item.date = subDate;
//             }
//
//             const ids = this.list.map(order => order.id);
//             response = await fetch(`/user/api/order/items?ids=${ids}`);
//             let itemsMap = await response.json();
//             this.itemsMap = itemsMap;
//
//             // let valuesArray = Object.values(itemsMap);
//             //
//             // this.calcTotalPrice(valuesArray)
//             //     .then(total => {
//             //         const totalPriceElement = document.querySelector('.total-price');
//             //         totalPriceElement.textContent = `${total}`;
//             //     })
//
//         },
//
//         // 주문취소내역(취소요청중, 취소완료)
//         async loadCancelList() {
//             let memberId = 40;
//             let response = await fetch(`/user/api/order/${memberId}/canceledList`);
//             let list = await response.json();
//             this.list = list;
//
//             for (item of list) {
//                 const dateIdx = item.date.search("T");
//                 const subDate = item.date.substring(0, dateIdx);
//                 item.date = subDate;
//             }
//
//             const ids = this.list.map(order => order.id);
//             response = await fetch(`/user/api/order/items?ids=${ids}`);
//             let itemsMap = await response.json();
//             this.itemsMap = itemsMap;
//
//         },
//
//         // 주문당 총 금액 구하기
//         calcTotalPrice(list) {
//             if (!list)
//                 return 0;
//
//             let totalPrice = 0;
//
//             for (item of list)
//                 totalPrice += item.price;
//
//             if (totalPrice < 30000)
//                 totalPrice += 5000;
//
//             return Number(totalPrice).toLocaleString();
//         }
//     },
//     async created(){
//         this.loadList();
//
//         response = await fetch("/user/api/order/status");
//         let state = await response.json();
//
//         // list를 object(map)으로 변경한다. {id, name}
//         // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
//         let obj = {};
//
//         state.forEach((o, i) => {
//             console.log(i, '++++', o);
//             obj[o.id] = o.name;
//         });
//
//         this.state = obj;
//     },
// }).mount('main');
//
//
