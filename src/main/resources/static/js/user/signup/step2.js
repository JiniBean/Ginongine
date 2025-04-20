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
        checkEmail(){

        },

        checkFormat(type){
            let form = {
                nm: {reg: /[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, slice: 20},
                phone: {reg: /\D/g , slice: 11},
                code: {reg: /\D/g , slice: 6},
                format : /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            }
            this.mbr[type] = this.mbr[type].replace(form[type].reg, "").slice(0, form[type].slice);
            if(!this.retry) return;
            this.valid[type] = this.mbr[type].length;
        },

        async send(){
            if(this.isSend) return;

            this.isSend = await this.verifier.send(
                this.mbr.email,
                true,
                (format)=>{
                    this.valid.format = format;
                },
                ()=> {
                    this.isSend = false;
                })
        },

        async confirm(){
            this.isConfirm= await this.verifier.confirm();
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
        openDatePicker(){
            this.datePicker.show();
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

            this.retry = true;

            //모든 항목 입력되었는지 체크
            for (let key in this.mbr)
                if(!this.mbr[key])
                    this.valid[key] = false;

            //인증 완료되었는지 체크
            this.valid.code = this.isConfirm;

            //유효성체크
            if (Object.values(this.valid).includes(false)) return;

            let agree =  localStorage.getItem('agree')
            if(agree){
                agree = JSON.parse(agree);
                this.mbr.emailRxYn = agree.email;
            }

            localStorage.setItem("mbr", JSON.stringify(this.mbr));
            location.href ='/signup/step3';
        }

    },

    mounted() {
        this.initData();
        this.initDatePickers();
    }

}).mount('main');


