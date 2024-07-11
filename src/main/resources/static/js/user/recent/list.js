const { createApp } = Vue;

createApp({
    data(){
        return{
            checkVisible : false,
            btnStatus : 'delete',
            list : []
        }
    }
    ,methods: {
        confirmDelete(productId){
            if(confirm("정말 삭제하시겠습니까?"))
                this.removeItem(productId)
        },
        removeItem(productId){
            // list 배열에서 해당 productId를 가진 항목을 제거
            this.list = this.list.filter(item => item.productId !== productId);

            // localStorage 업데이트
            window.localStorage.removeItem('recentList');
            window.localStorage.setItem('recentList', JSON.stringify(this.list));
        },
        addItem(productId){
            let url= "/order/info?p="+productId+"&q=1";
            location.href = url.toString();
        }
    },
    created (){
        const localStorage = window.localStorage;
        const localData = localStorage.getItem("recentList");

        const localDataJson = JSON.parse(localData);

        this.list = JSON.parse(localData);

    }
}).mount('main');