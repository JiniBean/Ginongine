const { createApp } = Vue


createApp({
    data() {
        return {
            coupon: {},
            couponCategory: [
                // { id: 1, name: '이벤트' }
            ],
            discountCategory: [
                { id: 1, name: '원' },
                { id: 2, name: '%' },
            ],
            showCouponDropdown: false,
            showUnitDropdown: false,

        }
    },
    methods:{
        goList() {
            location.href = `/admin/coupon/list`;
        },

        goUpdate(coupon) {
            let couponId = coupon.id;
            location.href = `/admin/coupon/update?couponId=${couponId}`;
        },

        clickCouponDropdown() {
            this.showCouponDropdown = !this.showCouponDropdown;
        },

        clickUnitDropdown() {
            this.showUnitDropdown = !this.showUnitDropdown;
        },

        clickCouponDropdownElement(c) {
            //this.selectedCategory = c;
            this.coupon.categoryId = c.id;
            this.showCouponDropdown = !this.showCouponDropdown;
        },

        clickUnitDropdownElement(c) {
            //this.selectedCategory = c;
            this.coupon.discountUnit = c.name;
            this.showUnitDropdown = !this.showUnitDropdown;
        },

        getCouponCategoryName() {
            for (let item of this.couponCategory) {
                if (this.coupon.couponCategoryId == item.id)
                    return item.name;
            }
            return '선택';
        },

        getUnitCategoryName() {
            for (let item of this.discountCategory) {
                if (this.coupon.discountUnit == item.name)
                    return item.name;
            }
            return '선택';
        },

        async deleteCoupon() {
            let requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.coupon),
            };

            await fetch(`/api/coupons/${this.coupon.id}`, requestOptions);
            this.goList();
        },

    },
    async created() {
        let params = new URLSearchParams(location.search);
        let couponId = params.get('couponId');

        let response = await fetch(`/api/coupons/${couponId}`);
        let coupon = await response.json();
        console.log(coupon);
        this.coupon = coupon;

        response = await fetch(`/api/coupons/coupon-category`);
        let category = await response.json();
        this.couponCategory = category;

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
}).mount('main');


