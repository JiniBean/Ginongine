
const { createApp } = Vue;

createApp({
    data() {
        return {
            list: []
            ,count :0
            ,categoryList:[]

        }
    },
    async created(){
        await this.fetchInquiries();
    },
    methods: {
        async deleteInquiry(inquiryId) {
            let requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            };

            await fetch(`/api/inquiries/${inquiryId}`, requestOptions);

            // 삭제 후 리스트 갱신
            this.list = this.list.filter(inquiry => inquiry.id !== inquiryId);
            this.count = this.list.length; // 갱신된 목록의 길이 업데이트
        },
        goUpdate(inquiry) {
            let inquiryId = inquiry;
            location.href = `/inquiry/update?inquiryId=${inquiryId}`;
        },
        async fetchInquiries() {
            let response = await fetch(`/api/inquiries/list`);
            let list = await response.json();
            this.list = list;
            this.count = this.list.length;

            response = await fetch(`/api/inquiries/category`);
            let categoryList = await response.json();
            this.categoryList = categoryList;
        },
        getCategoryName(categoryId) {
            let category = this.categoryList.find(c => c.id === categoryId);
            return category ? category.name : 'Unknown';
        },
        getStateText(state) {
            return state === 1 ? '답변 완료' : '답변 대기중';
        }
    }
}).mount('main');
