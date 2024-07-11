const { createApp } = Vue

createApp({
    data() {
        return {
            notice: {
                regDate: new Date().toISOString().slice(0,10),
            },
            category: [
                // { id: 1, name: '이벤트' }
            ],
            showDropdown: false,
        }
    },
    computed: {
    },
    methods: {
        clickDropdown() {
            this.showDropdown = !this.showDropdown;
        },

        clickDropdownElement(c) {
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
        
        async regNotice() {
            let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.notice),
            };

            // let nnnotice = {"id": 0, "title": null, "regDate": null};
            // let dddotice = {"data":{"title":"공지3","regDate":"2024-05-22","startDate":"2024-05-25"}}
            // let fffotice = {"title":"공지3","regDate":"2024-05-22","startDate":"2024-05-25"}


            await fetch(`/api/notices`, requestOptions);
            this.goList();
        },
    },
    async created() {
        try {
            response = await fetch(`/api/notices/notice-category`);
        
            if (!response.ok) {
                return // https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch#%EC%B7%A8%EB%93%9D_%EC%84%B1%EA%B3%B5_%EC%97%AC%EB%B6%80_%ED%99%95%EC%9D%B8
            }
        
            let category = await response.json();
            this.category = category;
        } catch(ex) {
            console.log(ex)
        }
    }
}).mount('main');

