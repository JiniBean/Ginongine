import Header from "/js/module/header.js";


window.addEventListener("load", function (){
    //헤더의 장바구니와 검색창
    let header = new Header();
    header.renewCart();
    header.searchBar();

    //전체 메뉴 토글
    const drawerBtn = document.querySelector("#drawer");
    const drawerAside = document.querySelector('aside.n-drawer');
    const removeIcon = drawerAside.querySelector(".icon");

    drawerBtn.onclick = drawerToggle;
    removeIcon.onclick = drawerToggle;
    function drawerToggle(){
        drawerAside.classList.toggle('active');
    }
})

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
    console.log('serviceWorker' in navigator);
    // 서비스 워커 지원 여부 확인
    window.addEventListener('load', function() {
        // 페이지 로드 완료 시 이벤트 처리기 등록
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                // 서비스 워커 등록 성공 시 콜백 함수
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(error) {
                // 서비스 워커 등록 실패 시 콜백 함수
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// 서비스 워커 등록
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('preinstallation', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // 설치 버튼 표시
    installButton.style.display = 'block';
});

installButton.addEventListener('click', () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt().then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
});

// if ('serviceWorker' in navigator) {
//     // Register a service worker hosted at the root of the
//     // site using the default scope.
//     navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
//         console.log('Service worker registration succeeded:', registration);
//     }, /*catch*/ function(error) {
//         console.log('Service worker registration failed:', error);
//     });
// } else {
//     console.log('Service workers are not supported.');
// }