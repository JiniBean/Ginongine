window.addEventListener("load", function () {
    // submitButton 요소를 가져옵니다.
    const submitButton = document.getElementById("submitButton");
    // 수정 가능한 모든 텍스트 입력 필드를 가져옵니다.
    const inputs = document.querySelectorAll("input[type='text']:not([readonly])");
    // 기존 값들을 저장할 객체를 생성합니다.
    const originalValues = {};

    // 각 입력 필드의 기존 값들을 저장합니다.
    inputs.forEach(input => {
        originalValues[input.id] = input.value.trim();
    });

    // 입력 필드가 변경될 때마다 호출되는 함수:
    inputs.forEach(input => {
        input.addEventListener("input", function () {
            // 하나라도 변경되었는지 확인합니다.
            const allFieldsChanged = Array.from(inputs).some(input => originalValues[input.id] !== input.value.trim());
            // 변경되었다면 수정 완료 버튼을 활성화합니다.
            if (allFieldsChanged) {
                submitButton.classList.remove("disabled");
            } else {
                submitButton.classList.add("disabled");
            }
        });
    });

    // Enter 키를 눌렀을 때 호출되는 함수:
    inputs.forEach(input => {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // 기본 동작인 submit 방지
                submitForm(); // 폼 제출 함수 호출
            }
        });
    });

    // 수정 완료 버튼이 클릭되었을 때 호출되는 함수:
    function submitForm() {
        // memberForm의 submit 이벤트를 발생시켜서 폼을 제출합니다.
        document.getElementById("memberForm").submit();
    }
});

