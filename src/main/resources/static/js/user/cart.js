const {createApp} = Vue;
import Repository from '/js/module/CartRepository.js';
import ProductRepository from '/js/module/ProductRepository.js';
import Header from '/js/module/header.js';

createApp({
    data() {
        return {
            total         : 0
            , cartDataList: []
            , location    : []
            , isLogin     : false
        }
    },
    methods: {
        async deleteHandler(isAll) {
            let isTrue = confirm("정말로 삭제하시겠어요?");
            if (!isTrue)
                return;

            let inputs;
            if (isAll)   // 전체 삭제인지 판별
                inputs = document.querySelectorAll("input[name='chkId']");
            else         // 선택삭제라면 체크된 노드만
                inputs = document.querySelectorAll("input[name='chkId']:checked");

            let ids = Array.from(inputs).map(i => i.dataset.id);
            if (this.isLogin) { // 회원인 경우:  DB에서 상품 삭제
                let repository = new Repository;
                let valid = await repository.delete(ids);
                if (valid) {
                    const header = new Header;
                    header.renewCart();
                    window.location.reload();
                }
            } else {           // 비회원인 경우: 쿠키에서 상품 삭제
                this.deleteCartItemsFromCookies(ids);
                window.location.reload();
            }
        },

        async qtyHandler(item, amount) {
            // 장바구니 + 또는 - 클릭 한 만큼 수량 계산
            item.cartQuantity += amount;

            if (item.cartQuantity <= 0) {
                // 1 아래로 내려가지 못하도록 막기
                item.cartQuantity = 1;
            } else if (item.cartQuantity > item.stockQuantity) {
                // 주문 가능 수량 보다 많지 않도록 막기
                return item.cartQuantity = item.stockQuantity;
            }

            if (this.isLogin) {
                // 회원: 데이터 베이스에 수량 업데이트하기
                let repository = new Repository;
                let s = await repository.updateQty(item.productId, item.cartQuantity);
            } else {
                // 비회원: 쿠키에 수량 업데이트하기
                this.updateCartListInCookies(item.productId, item.cartQuantity);
            }
        },

        async cartDataHandler() {
            let header = new Header;
            this.isLogin = header.checkUser();
            let repository = new Repository;
            let productRepository = new ProductRepository;

            // 로그인 여부에 따라 DB 또는 쿠키에서 장바구니 데이터 가져오기
            let temp;                                                           // 임시 변수
            if (this.isLogin) {
                // 로그인 => DB에서 데이터 추출
                temp = await repository.findAvailableQty();                     // DB -> 임시변수 데이터 담기
                this.cartDataList = temp.map(item => ({                         // 임시변수 ->  cartDataList(화면과 바인딩된 변수) 담기
                    productId    : item.PRODUCT_ID,
                    prettyName   : item.PRETTY_PRODUCT_NAME,
                    productPrice : item.PRODUCT_PRICE,
                    cartQuantity : item.CART_QUANTITY,
                    stockQuantity: item.STOCK_QUANTITY,
                    stockStatus  : item.STOCK_STATUS,
                    discountRate : item.DISCOUNT_RATE,
                    disCountPrice: item.DISCOUNT_PRICE
                }));

                // 회원인 경우 배송지 데이터 가져오기
                const locationData = await repository.findLocationByMemberId();
                this.location = locationData;

            } else {
                // 비-로그인 => 쿠키에서 상품 ID 출력하여 해당 상품 정보 출력
                // 비회원의 경우 쿠키에서 장바구니 정보를 가져오는데, 쿠키에는 상품ID와 개수만 존재 합니다.
                // 따라서, view단에 정보를 출력하기 위해서는 상품ID에 대한 정보(이름, 가격 등..)를 DB에서 가져온 뒤. 쿠키의 정보와 합쳐서 사용하기 위한 코드 입니다.

                let temp = this.getCartListFromCookies();                                             // 쿠키->임시변수 데이터 담기
                let ids = temp.map(item => item.prdId);                                      // 쿠키에서 id 값만 꺼내기

                if (ids.length === 0) return;                                                         // 장바구니 비었으면 return;
                let products = await productRepository.findAllCartItem(ids);                          // 쿠키에서 꺼낸 id 값을 이용해서 상품 정보 가져오기
                this.cartDataList = products.map(product => {
                    let foundItem = temp.find(item => item.prdId === product.PRODUCT_ID);      // 임시변수 id == 상품정보 id 찾기
                    let stockStatus = (product.STOCK_QUANTITY - (foundItem ? foundItem.quantity : 0)) > 0 ? 'valid' : 'invalid'; // (현재고량 - 장바구니 담은 수) > 0 ? vaild : invaild --> 상품주문가능여부
                    return {
                        productId    : product.PRODUCT_ID,
                        prettyName   : product.PRETTY_PRODUCT_NAME,
                        productPrice : product.PRODUCT_PRICE,
                        cartQuantity : foundItem.quantity,                                            // 비회원이 장바구니에 담은 수량 넣기
                        stockQuantity: product.STOCK_QUANTITY,
                        stockStatus  : stockStatus,
                        discountRate : product.DISCOUNT_RATE,
                        disCountPrice: product.DISCOUNT_PRICE
                    };
                });
                // 비회원인 경우 배송지 데이터 빈 값으로 초기화
                this.location = locationData;
            }



        },

        submitHandler(e) {
            if (this.isCartEmpty) {
                e.preventDefault();
                alert("장바구니가 비었어요!");
            }
        },

        // 쿠키에서 'cartList' 데이터를 읽어오기
        getCartListFromCookies() {
            const cookies = decodeURIComponent(document.cookie).split('; ');
            const cartCookie = cookies.find(cookie => cookie.startsWith('cartList='));
            if (cartCookie) {
                return JSON.parse(cartCookie.split('=')[1]);
            }
            return [];
        },

        // 쿠키에 장바구니 정보를 업데이트
        updateCartListInCookies(productId, newQuantity) {
            let cartList = this.getCartListFromCookies();
            let itemIndex = cartList.findIndex(item => item.prdId === productId);
            if (itemIndex !== -1) {
                cartList[itemIndex].quantity = newQuantity;
                this.setCartListToCookies(cartList);
            }
        },

        // 쿠키에 'cartList' 데이터를 저장하거나 삭제
        setCartListToCookies(cartList) {
            if (cartList.length === 0) {
                // 데이터가 없을 경우 쿠키 삭제
                document.cookie = "cartList=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            } else {
                // 데이터가 있을 경우 쿠키 업데이트
                const dateString = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30)).toUTCString(); // 30일 후
                document.cookie = `cartList=${encodeURIComponent(JSON.stringify(cartList))}; expires=${dateString}; path=/`;
            }
        },


        // 쿠키 정보 삭제
        deleteCartItemsFromCookies(ids) {
            let cartList = this.getCartListFromCookies();
            cartList = cartList.filter(item => !ids.includes(item.prdId.toString()));
            this.setCartListToCookies(cartList);
        },

    },

    computed: {
        totalPrice() {
            // 총 상품금액 (할인x)
            return this.cartDataList
                .reduce((sum, item) => sum + (item.productPrice * item.cartQuantity), 0);
        },
        // totalDiscount() {
        //     // 할인된 금액이 존재하는 경우, 각 항목의 할인된 가격과 원래 가격의 차이를 합산
        //     return this.cartDataList.reduce((sum, item) => sum + ((item.disCountPrice > 0 ? item.disCountPrice : item.productPrice) - item.productPrice), 0);
        // },
        totalDiscount() {
            // 할인된 금액이 존재하는 경우, 각 항목의 할인된 가격과 원래 가격의 차이를 수량만큼 합산
            return this.cartDataList.reduce((sum, item) => {
                let discountPerItem = item.disCountPrice > 0 ? item.productPrice - item.disCountPrice : 0;
                return sum + (discountPerItem * item.cartQuantity);
            }, 0);
        },



        deliveryPrice() {
            // 배송비: 50,000원↑ 0 else 3000원
            let price = this.totalPrice - this.totalDiscount;
            return price >= 50000 ? 0 : 3000;
        },
        finalPrice() {
            // 총 주문 금액
            return (this.totalPrice - this.totalDiscount) + this.deliveryPrice;
        },
        isCartEmpty() {
            return this.cartDataList.length === 0;
        }

        // reduce() 함수는 네 개의 인자를 가집니다.
        // 1. 누산기 (acc)
        // 2. 현재 값 (cur)
        // 3. 현재 인덱스 (idx)
        // 4. 원본 배열 (src)

        // 누산기 인자(여기선 sum)에 item의 계산 결과를 누적해서 return 시키므로,
        // 배열에 여러 값이 있을 경우 총 합산 값을 구하는데 자주 사용하는 듯 합니다.
        // 참고 => https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

        // 따라서 sum 이라는 인자에 item의 계산 결과를 계속 누적하여 합산할 수 있는 함수 입니다.(item = cart)
        // item.productPrice * item.cartQuantity의 값을 계속 누적시켜 최종 합을 구하는 함수 입니다.
    },

    mounted() {
        let header = new Header;
        this.isLogin = header.checkUser();
        this.cartDataHandler();
    }

}).mount('main');

