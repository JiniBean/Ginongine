document.addEventListener("DOMContentLoaded", function() {
    var selectedOptionDesc = document.getElementById('selectedOptionDesc');
    var optionsDesc = document.querySelectorAll('.optionDesc');
    var selectedDescInput = document.getElementById('selectedDesc');

    selectedOptionDesc.addEventListener('click', function() {
        var optionDescList = this.nextElementSibling;
        optionDescList.style.display = (optionDescList.style.display === 'block') ? 'none' : 'block';
    });

    optionsDesc.forEach(function(option) {
        option.addEventListener('click', function() {
            var selectedValueDesc = this.getAttribute('data-value');
            selectedOptionDesc.textContent = this.textContent;
            selectedDescInput.value = selectedValueDesc; // hidden input에 선택된 값을 설정
            this.parentNode.style.display = 'none';
        });
    });

    // 드롭다운 닫기
    document.addEventListener('click', function(event) {
        if (!selectedOptionDesc.contains(event.target)) {
            optionsDesc.forEach(function(option) {
                option.parentNode.style.display = 'none';
            });
        }
    });
});

const form = document.getElementById("form");

// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const formData = new FormData(form);
// });