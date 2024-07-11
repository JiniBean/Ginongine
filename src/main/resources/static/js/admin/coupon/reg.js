const { createApp } = Vue


createApp({
    data() {
        return {
            coupon: {
                startDate: new Date().toISOString().slice(0,10),
            },
            couponCategory: [],
            discountCategory: [
                { id: 1, name: '원' },
                { id: 2, name: '%' },
            ],
            showCouponDropdown: false,
            showUnitDropdown: false,
            radioIndex: 0,
            periodDays: 15,
        }

    },
    methods:{
        goList() {
            location.href = `/admin/coupon/list`;
        },

        clickCouponDropdown() {
            this.showCouponDropdown = !this.showCouponDropdown;
        },

        clickUnitDropdown() {
            this.showUnitDropdown = !this.showUnitDropdown;
        },

        clickCouponDropdownElement(c) {
            //this.selectedCategory = c;
            this.coupon.couponCategoryId = c.id;
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

        resetEndDate() {
            this.coupon.endDate = null;
        },

        changeEndDate() {
            let timestamp = Date.parse(this.coupon.startDate);  // YYYY-MM-DD -> UNIX TIMESTAMP
            let startDate = new Date(timestamp);                // UNIX TIMESTAMP -> Date object
            let endDate = new Date();
            endDate.setDate(startDate.getDate() + Number.parseInt(this.periodDays));    // periodDays : String -> number
            this.coupon.endDate = endDate.toISOString().slice(0,10);
        },

        async regCoupon() {
            let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.coupon),
            };

            await fetch(`/api/coupons`, requestOptions);
            this.goList();
        },

    },
    async created() {
        try {
            response = await fetch(`/api/coupons/coupon-category`);

            if (!response.ok) {
                return
            }

            let category = await response.json();
            this.couponCategory = category;
        } catch(ex) {
            console.log(ex)
        }
    },
}).mount('main');


