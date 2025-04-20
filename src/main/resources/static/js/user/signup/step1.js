import Toast from "/js/module/Toast.js";

const {createApp} = Vue;

createApp({
    data() {
        return {
            agree: {
                all:false,
                age:false,
                info:false,
                email:false
            }

        }
    },

    computed :{
        valid(){
            return this.agree.age && this.agree.info
        }
    },

    methods: {
        initData(){
            let localAgree = localStorage.getItem("agree");
            if(localAgree) this.agree = JSON.parse(localAgree);
        },

        checkAll(e) {
            for(let key in this.agree)
                this.agree[key] = e.target.checked
        },

        submit(){

            //필수동의 항목 유효성검사
            if(!(this.agree.age && this.agree.info)){
                Toast.info("모든 필수 동의 항목에 체크해주세요");
                return;
            }
            localStorage.setItem("agree", JSON.stringify(this.agree));
            location.href ='/signup/step2';
        }

    },

    mounted() {
        this.initData();
    }

}).mount('main');


