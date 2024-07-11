// 카테고리 버튼
window.addEventListener("load", function () {
    const category = this.document.querySelector('#category');
    const selectedOptionCategory = category.querySelector('.selected-option-category');
    const optionsCategory = category.querySelectorAll('.option-category');
    const selectedCategory = category.querySelector('.selected-category');
    const optionCategoryList = category.querySelector('.option-category-list');

    //드롭다운 최초 클릭 시 이벤트 처리
    selectedOptionCategory.addEventListener('click', function (e) {
        e.stopPropagation(); //이벤트 버블링 방지
        optionCategoryList.classList.toggle('active'); // 카테고리 옵션 목록의 표시/숨김을 토글
    });

    // 드롭다운 클릭하여 아래로 펼쳐졌을 때 카테고리 옵션 항목 클릭 시 이벤트 처리
    optionsCategory.forEach(function (option) {
        option.addEventListener('click', function (e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            const selectedValueCategory = this.getAttribute('data-value'); // 선택된 카테고리 값
            selectedOptionCategory.textContent = this.textContent; // 선택된 카테고리 표시 업데이트
            selectedCategory.value = selectedValueCategory; // 선택된 카테고리 값 업데이트 (hidden 되어있음)
            optionCategoryList.classList.remove('active'); // 원하는 값 클릭 후 펼쳐진 목록 사라짐
        });
    });

    // 문서의 다른 부분을 클릭했을 때 드롭다운 메뉴가 열려있는 경우 드롭다운 메뉴를 닫음
    window.addEventListener('click', function (e) {
        if (!selectedOptionCategory.contains(e.target)) { // 클릭한 요소가 선택된 카테고리 영역이 아니라면
            optionCategoryList.classList.remove('active'); // 카테고리 옵션 목록을 숨김
        }
    })
});

// weightCategory 선택 버튼
window.addEventListener("load", function () {
    const weight = this.document.querySelector('#weight');
    const selectedOptionWeight = weight.querySelector('.selected-option-weight');
    const optionsWeight = weight.querySelectorAll('.option-weight');
    const selectedWeight = weight.querySelector('.selected-weight');
    const optionWeightList = weight.querySelector('.option-weight-list');

    //드롭다운 최초 클릭 시 이벤트 처리
    selectedOptionWeight.addEventListener('click', function (e) {
        e.stopPropagation(); //이벤트 버블링 방지
        optionWeightList.classList.toggle('active'); // 카테고리 옵션 목록의 표시/숨김을 토글
    });

    // 드롭다운 클릭하여 아래로 펼쳐졌을 때 카테고리 옵션 항목 클릭 시 이벤트 처리
    optionsWeight.forEach(function (option) {
        option.addEventListener('click', function (e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            const selectedValueWeight = this.getAttribute('data-value'); // 선택된 카테고리 값
            selectedOptionWeight.textContent = this.textContent; // 선택된 카테고리 표시 업데이트
            selectedWeight.value = selectedValueWeight; // 선택된 카테고리 값 업데이트 (hidden 되어있음)
            optionWeightList.classList.remove('active'); // 원하는 값 클릭 후 펼쳐진 목록 사라짐
        });
    });

    // 문서의 다른 부분을 클릭했을 때 드롭다운 메뉴가 열려있는 경우 드롭다운 메뉴를 닫음
    window.addEventListener('click', function (e) {
        if (!selectedOptionWeight.contains(e.target)) { // 클릭한 요소가 선택된 카테고리 영역이 아니라면
            optionWeightList.classList.remove('active'); // 카테고리 옵션 목록을 숨김
        }
    })
});

//quantityCategory 선택 버튼
window.addEventListener("load", function () {
    const quantity = this.document.querySelector('#quantity');
    const selectedOptionQuantity = quantity.querySelector('.selected-option-quantity');
    const optionsQuantity = quantity.querySelectorAll('.option-quantity');
    const selectedQuantity = quantity.querySelector('.selected-quantity');
    const optionQuantityList = quantity.querySelector('.option-quantity-list');

    //드롭다운 최초 클릭 시 이벤트 처리
    selectedOptionQuantity.addEventListener('click', function (e) {
        e.stopPropagation(); //이벤트 버블링 방지
        optionQuantityList.classList.toggle('active'); // 카테고리 옵션 목록의 표시/숨김을 토글
    });

    // 드롭다운 클릭하여 아래로 펼쳐졌을 때 카테고리 옵션 항목 클릭 시 이벤트 처리
    optionsQuantity.forEach(function (option) {
        option.addEventListener('click', function (e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            const selectedValueQuantity = this.getAttribute('data-value'); // 선택된 카테고리 값
            selectedOptionQuantity.textContent = this.textContent; // 선택된 카테고리 표시 업데이트
            selectedQuantity.value = selectedValueQuantity; // 선택된 카테고리 값 업데이트 (hidden 되어있음)
            optionQuantityList.classList.remove('active'); // 원하는 값 클릭 후 펼쳐진 목록 사라짐
        });
    });

    // 문서의 다른 부분을 클릭했을 때 드롭다운 메뉴가 열려있는 경우 드롭다운 메뉴를 닫음
    window.addEventListener('click', function (e) {
        if (!selectedOptionQuantity.contains(e.target)) { // 클릭한 요소가 선택된 카테고리 영역이 아니라면
            optionQuantityList.classList.remove('active'); // 카테고리 옵션 목록을 숨김
        }
    })
});

//상품 보관유형 선택 버튼
window.addEventListener("load", function () {
    const storage = this.document.querySelector('#storage');
    const selectedOptionStorage = storage.querySelector('.selected-option-storage');
    const optionsStorage = storage.querySelectorAll('.option-storage');
    const selectedStorage = storage.querySelector('.selected-storage');
    const optionStorageList = storage.querySelector('.option-storage-list');

    //드롭다운 최초 클릭 시 이벤트 처리
    selectedOptionStorage.addEventListener('click', function (e) {
        e.stopPropagation(); //이벤트 버블링 방지
        optionStorageList.classList.toggle('active'); // 카테고리 옵션 목록의 표시/숨김을 토글
    });

    // 드롭다운 클릭하여 아래로 펼쳐졌을 때 카테고리 옵션 항목 클릭 시 이벤트 처리
    optionsStorage.forEach(function (option) {
        option.addEventListener('click', function (e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            const selectedValueStorage = this.getAttribute('data-value'); // 선택된 카테고리 값
            selectedOptionStorage.textContent = this.textContent; // 선택된 카테고리 표시 업데이트
            selectedStorage.value = selectedValueStorage; // 선택된 카테고리 값 업데이트 (hidden 되어있음)
            optionStorageList.classList.remove('active'); // 원하는 값 클릭 후 펼쳐진 목록 사라짐
        });
    });

    // 문서의 다른 부분을 클릭했을 때 드롭다운 메뉴가 열려있는 경우 드롭다운 메뉴를 닫음
    window.addEventListener('click', function (e) {
        if (!selectedOptionStorage.contains(e.target)) { // 클릭한 요소가 선택된 카테고리 영역이 아니라면
            optionStorageList.classList.remove('active'); // 카테고리 옵션 목록을 숨김
        }
    })
});


function getImageFiles(e) {
    const uploadFiles = [];
    const files = e.currentTarget.files;
    const imagePreview = document.querySelector('.image-preview');
    const docFrag = new DocumentFragment();

    const uploadedImagesCount = imagePreview.querySelectorAll('li').length;

    if (uploadedImagesCount + files.length > 4) {
        alert('이미지는 최대 4개 까지 업로드가 가능합니다.');
        return;
    }


    // 파일 타입 검사
    [...files].forEach(file => {
        if (!file.type.match("image/.*")) {
            alert('이미지 파일만 업로드가 가능합니다.');
            return
        }

        // 파일 갯수 검사
        if ([...files].length < 4) {
            uploadFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = createElement(e, file);
                imagePreview.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}

function createElement(e, file) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.setAttribute('src', e.target.result);
    img.setAttribute('data-file', file.name);
    li.appendChild(img);

    const removeBtn = document.createElement('span');
    removeBtn.innerText = 'x';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => removeImage(li));
    li.appendChild(removeBtn);

    return li;
}

function removeImage(li) {
    li.parentNode.removeChild(li);
}

const realUpload = document.querySelector('.real-upload');
const upload = document.querySelector('.upload');

upload.addEventListener('click', () => realUpload.click());

realUpload.addEventListener('change', getImageFiles);

