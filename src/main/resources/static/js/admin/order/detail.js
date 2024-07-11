window.addEventListener('load', function () {
    const modal = document.querySelector('#modal');
    const openButton = document.querySelector('#modal-btn');
    const closeButton = modal.querySelector('#close-btn');
    const submitButton = modal.querySelector('#submit-btn');
    const form = modal.querySelector('form');
    const h1 = modal.querySelector('h1');
    const input = modal.querySelector('input');

    openButton.addEventListener('click', function () {
        //이전 입력 값 초기화
        h1.textContent = '운송장 번호를 입력해주세요';
        input.classList.remove('n-textbox-status:warning');
        input.value='';

        modal.classList.remove('d:none');
        modal.classList.add('modal-fade-in');
        input.focus();

    });

    closeButton.addEventListener('click', function (e) {
        e.preventDefault();
        modal.classList.replace('modal-fade-in', 'modal-fade-out');

        setTimeout(() => {
            modal.classList.add('d:none');
            modal.classList.remove('modal-fade-out');
        }, 130);
    });

    submitButton.addEventListener('click', function (e) {

        e.preventDefault();

        if(isNaN(parseInt(input.value))){
            h1.textContent = '숫자만 입력 가능해요';
            input.classList.add('n-textbox-status:warning');
            return;
        }

        if(input.value.length < 10){
            h1.textContent = '운송장 번호가 유효하지 않아요';
            input.classList.add('n-textbox-status:warning');
            return;
        }

        modal.classList.replace('modal-fade-in', 'modal-fade-out');

        setTimeout(() => {
            modal.classList.add('d:none');
            modal.classList.remove('modal-fade-out');
        }, 130);

        form.submit();
    });

});