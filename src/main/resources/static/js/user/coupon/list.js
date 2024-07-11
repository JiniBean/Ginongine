const { createApp } = Vue

createApp({
    data() {
        return {            
            tabIndex: 0,
            list: [],
            now: new Date(),
        }
    },
    methods:{
        // 탭바꾸기
        clickTab(selectedIndex) {
            this.tabIndex = selectedIndex;

            // tabIndex가 바뀌면 api를 새로 호출해야함
            if (this.tabIndex == 0) {
                // 사용 가능한 쿠폰 목록 조회
                this.loadAvailableList();
            }
            else if (this.tabIndex == 1) {
                // 사용 불가능한 쿠폰 목록 조회
                this.loadUnavailableList();
            }

        },


        // 주문내역(배송요청중~구매확정)
        async loadAvailableList() {
            let memberId = 3;
            let response = await fetch(`/api/coupons/available/${memberId}`);
            let list = await response.json();
            this.list = list;

            for (item of list) {
                if(item.endDate != null) {
                    const dateIdx = item.endDate.search("T");
                    const subDate = item.endDate.substring(0, dateIdx);
                    item.endDate = subDate;
                }
            }

            // const ids = this.list.map(order => order.id);
            // response = await fetch(`/user/api/order/items?ids=${ids}`);
            // let itemsMap = await response.json();
            // this.itemsMap = itemsMap;

        },

        // 주문취소내역(취소요청중, 취소완료)
        async loadUnavailableList() {
            let memberId = 3;
            let response = await fetch(`/api/coupons/unavailable/${memberId}`);
            let list = await response.json();
            this.list = list;

            for (item of list) {
                if(item.endDate != null) {
                    const dateIdx = item.endDate.search("T");
                    const subDate = item.endDate.substring(0, dateIdx);
                    item.endDate = subDate;
                }
            }

            // const ids = this.list.map(order => order.id);
            // response = await fetch(`/user/api/order/items?ids=${ids}`);
            // let itemsMap = await response.json();
            // this.itemsMap = itemsMap;

        },
    },
    async created(){
        this.loadAvailableList();

        // response = await fetch("/user/api/order/status");
        // let state = await response.json();

        // list를 object(map)으로 변경한다. {id, name}
        // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        // let obj = {};

        // state.forEach((o, i) => {
        //     console.log(i, '++++', o);
        //     obj[o.id] = o.name;
        // });

        // this.state = obj;
    },
}).mount('main');
