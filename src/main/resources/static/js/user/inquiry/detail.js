const { createApp } = Vue

createApp({
    data() {
        return {
            inquiry: {}
            ,categoryList:[]
        }
    },
    computed: {
    },
    methods: {
        goUpdate(inquiry) {
            let inquiryId = inquiry;
            location.href = `/inquiry/update?inquiryId=${inquiryId}`;
        },
        goList() {
            location.href = `/inquiry/list`;
        },
        getCategoryName(categoryId) {
            let category = this.categoryList.find(c => c.id === categoryId);
            return category ? category.name : 'Unknown';
        }
    },
    async created() {
        let params = new URLSearchParams(location.search);
        let inquiryId = params.get('inquiryId');

        let response = await fetch(`/api/inquiries/${inquiryId}`);
        let inquiry = await response.json();
        this.inquiry = inquiry;

        response = await fetch(`/api/inquiries/category`);
        let categoryList = await response.json();
        this.categoryList = categoryList;

    }
}).mount('main');



