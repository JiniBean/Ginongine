const { createApp } = Vue


createApp({
    data() {
        return {
            tabIndex: 0,
            //todo 현재는 고정으로 박아놨는데, DB 연동 시 실제 index부여해야 함
            isRotated: [false, false, false]
        }
    },
    methods:{
        // 탭바꾸기
        clickTab(selectedIndex) {
            this.tabIndex = selectedIndex;
        },
        toggleArrow(index) {
            this.isRotated[index] = !this.isRotated[index];
        }

    },
}).mount('main');


