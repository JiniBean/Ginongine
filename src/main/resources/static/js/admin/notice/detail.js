const { createApp } = Vue

createApp({
    data() {
        return {
            notice: {},
            category: [],
            showDropdown: false,
            // selectedCategory: {
            //     id: '',
            //     name: '선택',
            // }
        }
    },
    computed: {
        formattedStartDate() {
            // timestamp를 Date 객체로 변환
            const date = new Date(this.notice.startDate);
            // Date 객체를 ISO 날짜 문자열로 변환 (YYYY-MM-DD)
            return date.toISOString().split('T')[0];
        },
        formattedEndDate() {
            // timestamp를 Date 객체로 변환
            const date = new Date(this.notice.endDate);
            return date.toISOString().split('T')[0];
        },
        formattedRegDate() {
            // timestamp를 Date 객체로 변환
            const date = new Date(this.notice.regDate);
            return date.toISOString().split('T')[0];
        }
    },
    methods: {
        clickDropdown() {
            this.showDropdown = !this.showDropdown;
        },

        clickDropdownElement(c) {
            console.log(c);
            //this.selectedCategory = c;
            this.notice.categoryId = c.id;
            this.showDropdown = !this.showDropdown;
        },

        getCategoryName() {
            for (let item of this.category) {
                if (this.notice.categoryId == item.id)
                    return item.name;
            }
            return '선택';
        },

        goList() {
            location.href = `/admin/notice/list`;
        },

        async updateNotice() {
            let requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.notice),
            };

            console.log(requestOptions);
            console.log("id:", this.notice.id);
            await fetch(`/api/notices/${this.notice.id}`, requestOptions);
            this.goList();
        },

        async deleteNotice() {
            let requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.notice),
            };

            console.log(requestOptions);
            console.log("id:", this.notice.id);
            await fetch(`/api/notices/${this.notice.id}`, requestOptions);
            this.goList();
        },
    },
    async created() {

        let params = new URLSearchParams(location.search);
        let noticeId = params.get('noticeId');

        let response = await fetch(`/api/notices/${noticeId}`);
        let notice = await response.json();
        this.notice = notice;

        response = await fetch(`/api/notices/notice-category`);
        let category = await response.json();
        this.category = category;
    }
}).mount('main');

