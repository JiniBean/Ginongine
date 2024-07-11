
const { createApp } = Vue

createApp({
    data() {
        return {
            list: [],
            notice: [],
        }
    },
    methods: {
        goList() {
            location.href = `/notice/list`;
        },
    },
    async created() {
        let params = new URLSearchParams(location.search);
        let noticeId = params.get('noticeId');

        let response = await fetch(`/api/notices/${noticeId}`);
        let notice = await response.json();
        this.notice = notice;

        let dateIdx = notice.regDate.search("T");
        let subDate = notice.regDate.substring(0, dateIdx);
        notice.regDate = subDate;
    }
}).mount('main');

