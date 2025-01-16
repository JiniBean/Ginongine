import Toast from "/js/module/Toast.js";
import DatePicker from '/js/module/Datepicker.js';
import EmailVerifier from "/js/module/EmailVerifier.js";

const {createApp} = Vue;

createApp({
    data() {
        return {
            mbr: {
                nm: null,
                phone: null,
                birthDd: null,
                email: null
            },

            valid:{
                nm: true,
                phone: true,
                birthDd: true,
                age: true,
                email: true,
                format: true,
                code: true,
            },

            code:null,
            isSend:false,
            isConfirm:false,
            result: '',
            retry:false,
            datePicker: null,
            verifier:null

        }
    },

    computed :{
        valid(){
            return this.agree.age && this.agree.info
        }
    },

    methods: {
        initData(){
            let localMbr = localStorage.getItem("mbr");
            if(localMbr) this.mbr = JSON.parse(localMbr);
            this.verifier = new EmailVerifier(this.$refs.confirm);
        },

        checkFormat(type){

            let form = {
                nm: {reg: /[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, slice: 20},
                phone: {reg: /[^0-9]/g , slice: 11},
                code: {reg: /[^0-9]/g , slice: 6}
            }
            this.mbr[type] = this.mbr[type].replace(form[type].reg, "").slice(0, form[type].slice);
            this.valid[type] = !!(this.retry && !this.mbr[type].length);

        },

        async send(){
            this.valid.format = this.verifier.checkFormat(this.mbr.email, 'email')
            if(!this.valid.format || this.isSend) return;
            this.isSend = this.verifier.send(
                this.mbr.email,
                true,
                ()=> {
                    this.isSend = false;
                })


        },

        initDatePickers() {
            this.datePicker = DatePicker.create(
                this.$refs.date,
                (date)=>{
                    this.mbr.birthDd = date;
                    this.valid.birthDd = true;
                    this.valid.age = this.geValidation();
                }
            )
        },
        geValidation(){
            const birth = new Date(this.mbr.birthDd);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();

            if(today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()))
                age--;
            return age >= 14;
        },
        submit(){


            localStorage.setItem("agree", JSON.stringify(this.agree));
            location.href ='/signup/step2';
        }

    },

    mounted() {
        this.initData();
        this.initDatePickers();
    }

}).mount('main');


