const { createApp } = Vue

createApp({
    data() {
        return {
            list: [],
            query: "",
        }
    },
    methods: {
        goDetail(notice) {
            let noticeId = notice.id;
            location.href = `/admin/notice/detail?noticeId=${noticeId}`;
        },

        goReg() {
            location.href = `/admin/notice/reg`;
        },

        async loadData() {
            let response = await fetch(`/api/notices?query=${this.query}`);
            let list = await response.json();
            this.list = list;
    
            for (let notice of list) {
                let dateIdx = notice.startDate.search("T");
                let subDate = notice.startDate.substring(0, dateIdx);
                notice.startDate = subDate;
    
                dateIdx = notice.endDate.search("T");
                subDate = notice.endDate.substring(0, dateIdx);
                notice.endDate = subDate;
    
            }
        }
    },
    async created() {
        await this.loadData();
    }
}).mount('main');

