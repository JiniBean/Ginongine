const { createApp } = Vue

createApp({
    data() {
        return {
            list: [],
        }
    },
    methods: {
        goDetail(notice) {
            let noticeId = notice.id;
            location.href = `/notice/detail?noticeId=${noticeId}`;
        },
    },
    async created() {
        let response = await fetch(`/api/notices`);
        let list = await response.json();
        this.list = list;

        for (let item of list) {
            const dateIdx = item.regDate.search("T");
            const subDate = item.regDate.substring(0, dateIdx);
            item.regDate = subDate;
        }
    }
}).mount('main');