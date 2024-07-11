const { createApp } = Vue


createApp({
    data() {
        return {            
            tabIndex: 0,
            showDropdown: false,
            list: [],
            query: "",
        }
    },
    methods:{
        // 전체선택
        checkAll(e) {
            let checked = e.target.checked
            this.list.forEach(itemList => itemList.checked = checked);
        },

        // 탭바꾸기
        clickTab(selectedIndex) {
            this.tabIndex = selectedIndex;

            // tabIndex가 바뀌면 api를 새로 호출해야함
            if (this.tabIndex == 0) {
                // 주문상태가 주문완료 배송준비중 배송중 배송완료 구매확정 상태
                // this.loadList();
            }
            else if (this.tabIndex == 1) {
                // 취소요청중 취소완료 상태
                // this.loadCancelList();
            }
        },

        // 점 버튼 누르기
        clickDropdown(coupon) {
            // 특정 카드의 showDropdown이 true/false로 바뀌어야 함
            let dropdownStatus = !coupon.showDropdown;

            // 일단 모든 점 버튼 메뉴를 닫음
            for(let item of this.list) {
                item.showDropdown = false;
            }
            coupon.showDropdown = dropdownStatus;
        },

        goReg() {
            location.href = `/admin/coupon/reg`;
        },

        goUpdate(coupon) {
            let couponId = coupon.id;
            location.href = `/admin/coupon/update?couponId=${couponId}`;
        },

        goDetail(coupon) {
            let couponId = coupon.id;
            location.href = `/admin/coupon/detail?couponId=${couponId}`;
        },

        async deleteCoupon(coupon) {
            let requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(coupon),
            };

            await fetch(`/api/coupons/${coupon.id}`, requestOptions);
            this.loadData();
        },

        async loadData() {
            let response = await fetch(`/api/coupons?query=${this.query}`);
            let list = await response.json();
            this.list = list;

            for (let coupon of list) {
                if (coupon.startDate != null) {
                    let dateIdx = coupon.startDate.search("T");
                    let subDate = coupon.startDate.substring(0, dateIdx);
                    coupon.startDate = subDate;
                }

                if (coupon.endDate != null) {
                    let dateIdx = coupon.endDate.search("T");
                    let subDate = coupon.endDate.substring(0, dateIdx);
                    coupon.endDate = subDate;
                }
            }
        },

        // 쿠폰 활성화 하기
        async makeCouponEnable() {
            // 쿠폰 리스트에서 선택한 쿠폰들의 id를 배열로 만든다
            let ids = [];
            for (let item of this.list) {
                if (item.checked == true)
                    ids.push(item.id);
            }

            console.log(ids);

            // fetch 호출을 위한 option 객체를 만든다 (PUT, /api/coupons/enable)
            let requestOptions = {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                // 활성화 하려는 쿠폰의 id 배열을 option의 body에 JSON string으로 넣는다
                body: JSON.stringify(ids)
            }

            // fetch api를 호출한다
            await fetch(`/api/coupons/enable`, requestOptions);

            // 리스트를 갱신한다
            this.loadData();

        }

    },
    async created() {
        await this.loadData();
    },
}).mount('main');


