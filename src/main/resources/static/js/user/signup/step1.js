//쿠키
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

    parseCookie(){
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


// 전체약관동의 checked
window.addEventListener("load", function(e){

    //선택 div[]
    let checkDivs = this.document.querySelectorAll(".check");
    //전체선택 check 영역 div
    let checkDiv = this.document.querySelector(".check");

    //전체선택 span
    let checkAll = checkDiv.querySelector(".check-all");

    //필수선택영역
    let chkRequired = this.document.querySelector(".check-required");
    let iconList= chkRequired.querySelectorAll(".icon");

    //선택영역
    let chkOption = this.document.querySelector(".check-option");
    let chk = chkOption.querySelector(".icon");


    //step2에서 이전 버튼을 누른 경우 - 쿠키에 담은 step1값 꺼내 줌
    // 만약 쿠키의 값이 있다면 이 함수 실행
    let cookie = new Cookie();

    if(cookie.get("userInfo")){

        const agree="N";

        if(cookie.get("userInfo")[0]!==undefined)
            this.agree= cookie.get("userInfo")[0].agree;

        // 선택 + 전체약관동의 체크해줌
        if(agree=="Y") {
            chk.classList.replace("icon:checkCircle","icon:check_circle_fill");
            chk.classList.replace("icon-color:base-6","icon-color:main-6");
            chk.classList.add("checked");

            checkAll.classList.replace("icon:checkCircle","icon:check_circle_fill");
            checkAll.classList.replace("icon-color:base-6","icon-color:main-6");
            checkAll.classList.add("checked");

        }

        //이전에서 왔다면 필수체크
        for(let i=0; i<2; i++){
            iconList[i].classList.replace("icon:checkCircle","icon:check_circle_fill");
            iconList[i].classList.replace("icon-color:base-6","icon-color:main-6");
            iconList[i].classList.add("checked");
        }

    }

    //checkDiv > icon을 클릭했을때
    checkAll.onclick = function (){

        //check 유무
        let isChecked = checkAll.classList.contains('checked');

        //전체 체크 O -> checked remove
        if(isChecked){
            for( let div of checkDivs){
                let iconDiv = div.querySelector(".icon");
                removeChecked(iconDiv);
            }

            return;
        }

        // 전체 체크 X -> checked add
        if(!isChecked)
            for( let div of checkDivs){
                let iconDiv = div.querySelector(".icon");
                addChecked(iconDiv);
            }

    }

});


//체크 클릭 했을 때 활성화/비활성화
window.addEventListener("load", function(e){

    //필수영역 - 필수영역 유효성검사 체크하려고 영역 나누어 놓음
    let chkRequired = this.document.querySelector(".check-required");

    chkRequired.onclick = function (e){

        if(!e.target.classList.contains("icon"))
            return;

        let targetChecked = e.target.classList.contains('checked');

        //선택된 경우
        if(targetChecked){
            removeChecked(e.target);
            return;
        }

        //선택되지 않은 경우
        if(!targetChecked)
            addChecked(e.target);

    }

    //선택영역
    let chkOption = this.document.querySelector(".check-option");

    chkOption.onclick = function (e){

        if(!e.target.classList.contains("icon"))
            return;

        let targetChecked = e.target.classList.contains('checked');

        if(targetChecked){
            removeChecked(e.target);
            return;
        }

        if(!targetChecked)
            addChecked(e.target);

    }

});

//버튼 활성화
function addChecked(element){
    element.classList.replace("icon:checkCircle","icon:check_circle_fill");
    element.classList.replace("icon-color:base-6","icon-color:main-6");
    element.classList.add("checked");
}


//버튼 비활성화
function removeChecked(element){
    element.classList.replace("icon:check_circle_fill","icon:checkCircle");
    element.classList.replace("icon-color:main-6","icon-color:base-6");
    element.classList.remove("checked");
}

//동의버튼 누르면 필수 선택했는지 유효성 검사
window.addEventListener("load", function(e){

    let btn = this.document.querySelector(".n-btn");
    let chkRequired = this.document.querySelector(".check-required");

    btn.onclick = function (e){

        e.preventDefault();

        //필수동의 영역
        {
            let iconList= chkRequired.querySelectorAll(".icon");

            let set = new Set();
            set.add(iconList[0].classList.contains("checked"));
            set.add(iconList[1].classList.contains("checked"));

            if(set.has(false)){
                alert("필수약관에 전부 동의해주세요");
                return;
            }
        }

        let chkOption = document.querySelector(".check-option");
        let icon= chkOption.querySelector(".icon");

        let isChecked = icon.classList.contains("checked");

        let agree = "N";

        if(isChecked)
            agree="Y";

        let cookie = new Cookie();

        {

            let name=undefined;
            let email=undefined;
            let phone=undefined;
            let birthDate=undefined;

            const cookieString = document.cookie;

            const cookies={};
            const cookiePairs = cookieString.split('; ');

            for (const cookiePair of cookiePairs) {
                const [key, value] = cookiePair.split('=');
                cookies[key] = value;
            }

            const cookieName = 'userInfo';
            const encodedValue  = cookies[cookieName];

            let decodedValue;
            let userInfoData;
            let step1Data = {agree : agree};

            if (encodedValue!==undefined) {
                //선택동의 영역 - 쿠키에 저장된 내용이 있는 경우
                decodedValue = decodeURIComponent(encodedValue);

                // JSON 객체로 변환
                try {
                    userInfoData = JSON.parse(decodedValue);

                    name = userInfoData[1].name;
                    email = userInfoData[1].email;
                    phone = userInfoData[1].phone;
                    birthDate =userInfoData[1].birthDate;

                    const step2Data = {name,phone,birthDate,email};

                    //쿠키지우기
                    cookie.remove("userInfo");

                    //쿠키에 새로 데이터 넣기
                    cookie.addItem("userInfo",step1Data);
                    cookie.addItem("userInfo",step2Data);

                    //쿠키 저장하기
                    cookie.save();

                    location.href="/signup/step2";

                } catch (error) {
                    console.error('쿠키 값 파싱 오류:', error);
                }
            } else {
                //쿠키값 없다면
                const step1DataString = JSON.stringify(step1Data);

                let str ="[" + step1DataString +"]";

                const encodedUserInfo = encodeURIComponent(str);

                document.cookie = `userInfo=${encodedUserInfo}; path=/signup`;

                location.href="/signup/step2";
            }

        }

    }

});


