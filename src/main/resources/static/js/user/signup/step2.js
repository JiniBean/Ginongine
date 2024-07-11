// ========================social login 여부 확인 후 email 부분 변경====================
document.addEventListener('DOMContentLoaded', function() {
    const {createApp} = Vue;
    createApp({
        data() {
            return {
                socialuserinfo: {}
            }
        },
        async created() {
            await this.fetchProducts();
        },
        methods: {
            async fetchProducts() {
                let response;
                try {
                    response = await fetch(`/api/member/socialuserinfo`);
                    if (response.ok) {
                        let socialuserinfo = await response.json();
                        if (socialuserinfo) {
                            this.socialuserinfo = socialuserinfo;
                        } else {
                            this.socialuserinfo = null;
                        }
                    } else {
                        this.socialuserinfo = null;
                    }
                } catch (error) {
                    this.socialuserinfo = null;
                }
                console.log(this.socialuserinfo);
            }
        }
    }).mount('main');
});

//============================================  모바일  ============================================

//세션에 임시저장한 값 가져오기
window.addEventListener("load", function(e){

    // sec1
    let sec1 = document.querySelector("#sec1");

    let name = sec1.querySelector(".name");
    let phone = sec1.querySelector(".phone");
    let birthDate = sec1.querySelector(".birthDate");
    let email = sec1.querySelector(".email");

    let cookie = new Cookie();
    let userInfoData = cookie.get("userInfo");

    if(userInfoData[1]!==undefined){
        name.value = userInfoData[1].name;
        phone.value = userInfoData[1].phone;
        birthDate.value =userInfoData[1].birthDate;
        email.value = userInfoData[1].email;
    }

    //전화번호 입력 시 11자리만 입력되도록
    {
        phone.oninput = function (){
            // 숫자만 입력 가능하게 만들기
            this.value = this.value.replace(/[^0-9]/g, "");
            // 11자리 이상 입력하면 11자리까지 잘라내기
            this.value = this.value.length <= 11 ? this.value : this.value.slice(0, 11);
        }
    }

    //만 14살 이하 유효성 검사
    {
        let birthDate = sec1.querySelector(".birthDate");

        birthDate.onchange = function (){
            let birthDateValue = new Date(birthDate.value);
            let today = new Date();
            let age = today.getFullYear() - birthDateValue.getFullYear();
            let verifyAge = sec1.querySelector(".verify-age");
            let nextBtn = document.querySelector(".next-button");


            if(age < 14){
                verifyAge.classList.remove("d:none");
                nextBtn.disabled = true;
            }else{
                verifyAge.classList.add("d:none");
                nextBtn.disabled = false;

            }

        }

    }


});


//이전다음 버튼
window.addEventListener("load", function(e){

    // sec1의 버튼
    let sec1 = document.querySelector("#sec1");

    //sec1 이전 다음 버튼들
    let btnBox = sec1.querySelector(".btn-box");
    let prevBtn = btnBox.querySelector(".prev");
    let nextBtn = btnBox.querySelector(".next");

    //유효성 값 검사
    let name = sec1.querySelector(".name");
    let verifyName = sec1.querySelector(".verify-name");
    let phone = sec1.querySelector(".phone");
    let verifyPhone = sec1.querySelector(".verify-phone");
    let birthDate = sec1.querySelector(".birthDate")
    let verifyBirth = sec1.querySelector(".verify-birth")

    //이전 버튼
    prevBtn.onclick = function (e){

        e.preventDefault();

        //쿠키에 입력했던 내용 저장
        {
            const cookie = new Cookie();
            cookie.save();

            save();
        }

        location.href="/signup/step1";

    }

    //다음버튼
    nextBtn.onclick = function (e){

        e.preventDefault();

        if (nextBtn.classList.contains('disabled'))
            return;

        //초기화
        verifyName.classList.add("d:none");
        verifyPhone.classList.add("d:none");

        //값이 다 있는 지 유효성 검사

        //이름 유효성 검사
        if(!name.value){
            name.setAttribute('autofocus',true);
            verifyName.classList.remove("d:none");
            return;
        }

        //전화번호 유효성 검사
        if(!phone.value){
            phone.setAttribute('autofocus',true);
            verifyPhone.classList.remove("d:none");
            return;
        }

        if(!birthDate.value){
            birthDate.setAttribute('autofocus',true);
            verifyBirth.classList.remove("d:none");
            return;
        }

        //이메일 유효성 검사
        {
            let verifyAge = sec1.querySelector(".verify-age");
            let isValid = verifyAge.classList.contains("d:none");

            if(!isValid){
                nextBtn.disabled = true;
                return;
            }

        }

        save();

        location.href="/signup/step3";
    }

    function save(){

        let sec1 = document.querySelector("#sec1");

        let name = sec1.querySelector(".name").value;
        let phone = sec1.querySelector(".phone").value;
        let birthDate = sec1.querySelector(".birthDate").value;
        let email = sec1.querySelector(".email").value;

        //step2의 data
        let step2Data = {name,phone,birthDate,email};

        //세션에 이름 저장
        sessionStorage.setItem("name",name);

        //쿠키에 데이터 저장
        let cookie = new Cookie();
        let userInfoData = cookie.get("userInfo");

        if(userInfoData[1]!=null&&userInfoData[2]==null){
            //step1의 data
            let agree = userInfoData[0].agree;
            let step1Data = {agree};

            //쿠키 지우기
            cookie.remove("userInfo");

            //쿠키에 새로 넣기
            cookie.addItem("userInfo",step1Data);
            cookie.addItem("userInfo",step2Data);

            cookie.save();

        }
        else if(userInfoData[1]!=null&&userInfoData[2]!=null){
            //step1의 data
            let agree = userInfoData[0].agree;
            let step1Data = {agree};

            //step3의 Data
            let userName = userInfoData[2].userName;
            let pwd = userInfoData[2].pwd;
            let joinRoute = userInfoData[2].joinRoute;

            let step3Data = {userName, pwd, joinRoute};

            //쿠키 지우기
            cookie.remove("userInfo");

            //쿠키에 새로 넣기
            cookie.addItem("userInfo",step1Data);
            cookie.addItem("userInfo",step2Data);
            cookie.addItem("userInfo",step3Data);

            cookie.save();
        }
        else{
            cookie.addItem("userInfo", step2Data);
            cookie.save();
        }

    }

});

class Cookie{

    constructor() {
        this.map={};
        this.initCookie();
    }

    initCookie() {
        // 쿠키가 존재하는 경우, 파싱하여 map에 저장
        if (document.cookie) {
            // 쿠키가 존재하는 경우, 파싱하여 map에 저장
            this.parseCookie();
        }
        else {
            // 쿠키가 존재하지 않으면 Product : 빈 배열로 초기화
            this.map["userInfo"] = [];
        }

    }

    parseCookie() {
        const cookieDecoded = decodeURIComponent(document.cookie);
        const cookieTokens = cookieDecoded.split(";");

        for (const c of cookieTokens) {
            const tmp = c.split("=");
            const key = tmp[0].trim();
            const value = JSON.parse(tmp[1]);

            this.map[key] = value;
        }
    }

    get(name) {
        return this.map[name];
    }

    save() {
        const productList = this.map["userInfo"];
        const encodedProducts = encodeURIComponent(JSON.stringify(productList));
        document.cookie = `userInfo=${encodedProducts}; path=/signup;`;
    }

    remove(name) {
        document.cookie = `${name}=; path=/signup;`;
        delete this.map[name];
    }

    addItem(name, item) {
        //this.map[product]가 undefined 인 경우, 빈 배열로 초기화
        const existingItems = this.map[name] || [];
        existingItems.push(item);
        this.map[name] = existingItems;
    }

    size(){
        let size = Object.keys(this.map).length;
        return size;
    }

}