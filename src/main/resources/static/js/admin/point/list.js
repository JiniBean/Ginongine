const {createApp} = Vue;
import Repository from "/js/module/PointRepository.js";

createApp({
    data() {
        return {
            list: [],
            tabIndex: 0,
            //todo 현재는 고정으로 박아놨는데, DB 연동 시 실제 index부여해야 함
            isRotated: [false, false, false]
        }
    },
    methods: {
        async getList(orderType, sortType) {
            this.orderType = orderType;
            this.sortType = sortType
            let repository = new Repository;
            this.list = await repository.findAll(this.query, sortType, false);

            // switch (orderType) {
            //     case 1:
            //         this.list = await repository.findAll(this.query,sortType,false);
            //         break;
            //     case 2:
            //         this.list = await repository.findExRef(this.query,sortType,false,1);
            //         break;
            //     case 3:
            //         this.list = await repository.findExRef(this.query,sortType,false,2)
            //         break;
            //     case 4:
            //         this.list = await repository.findCancel(this.query,false)
            //
            // }

        },

        redirectToDetail(id) {
            window.location.href = `/admin/point/history/detail?id=${id}`;
        },

        // 탭바꾸기
        clickTab(selectedIndex) {
            this.tabIndex = selectedIndex;

            // tabIndex가 바뀌면 api를 새로 호출해야함
            if (this.tabIndex == 0) {
                // 주문상태가 주문완료 배송준비중 배송중 배송완료 구매확정 상태
                // this.loadList();
            }
            else if (this.tabIndex == 1) {
                // 취소요청중 취소완료 상태
                // this.loadCancelList();
            }
        },
        // clickTab(selectedTab) {
        //     this.selectedTab = selectedTab;
        // },
        formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        toggleArrow(index) {
            this.isRotated[index] = !this.isRotated[index];
        },

        test(){
            console.log(this.list);
        }

    },
    mounted() {
        this.getList();
        this.test();

        // this.getList().then(() => {
        //     this.test();
        // });
    }
}).mount('main');