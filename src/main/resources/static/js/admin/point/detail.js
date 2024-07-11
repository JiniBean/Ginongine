const { createApp } = Vue;

createApp({
    data() {
        return {
            point: {},
            loading: false, // 추가: API 요청 로딩 상태
            error: '' // 추가: 에러 메시지
        }
    },
    methods: {
        async findById(id) {
            try {
                this.loading = true; // 추가: API 요청 시작 시 로딩 상태 활성화
                let response = await fetch(`/api/point/history/detail/${id}`);
                let point = await response.json();
                this.point = point;
                this.error = ''; // 추가: 에러가 없을 경우 에러 메시지 초기화
            } catch (error) {
                console.error('Point 데이터를 가져오는 중 오류가 발생했습니다:', error);
                this.error = '포인트 데이터를 가져오는 중 오류가 발생했습니다.'; // 추가: 에러 메시지 설정
            } finally {
                this.loading = false; // 추가: API 요청 종료 시 로딩 상태 비활성화
            }
        },

        redirectToList() {
            window.location.href = `/admin/point/history/list`;
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

    },

    mounted() {
        let params = new URLSearchParams(location.search);
        let id = params.get('id');

        if (id) {
            this.findById(id);
        } else {
            this.error = 'URL에 memberId가 존재하지 않습니다.';
        }
    }
}).mount('main');
