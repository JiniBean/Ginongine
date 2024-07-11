const { createApp } = Vue

createApp({
    data() {
        return {
            // 베스트, 특가, 추천 중 기본 값 설정
            selectedProduct: 'best',
        }
    },
    methods: {
        // 클릭 이벤트 발생 시, [베스트, 특가, 추천] 변경
        selectProduct(product) {
            this.selectedProduct = product;
        },

    },
}).mount('main')
