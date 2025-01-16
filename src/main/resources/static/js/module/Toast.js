export default class Toast {
    static #defaultOptions = {
        duration: 2000,
        gravity: "bottom",
        position: "center",
        stopOnFocus: true,
        className: "custom-toast",
        offset: {
            y: 100
        }
    }

    static #successStyle = {
        background: "var(--color-sub-4)",
        color: "var(--color-base-1)"
    }

    static #errorStyle = {
        background: "var(--color-sub-1)",
        color: "var(--color-base-1)"
    }

    static #infoStyle = {
        background: "var(--color-main-5)",
        color: "var(--color-base-1)"
    }

    static #pcStyle = {
        modal: {
            position: 'fixed',
            top: '40%',  // 화면 상단에서 40% 위치
            left: '50%',
            transform: 'translate(-50%, -50%)',  // 중앙 정렬
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '260px',
            maxWidth: '320px',
            textAlign: 'center',
            zIndex: 9999
        },
        message: {
            margin: '0 0 20px 0',
            fontSize: 'var(--font-size-3)',
            color: 'var(--color-base-9)',
            wordBreak: 'break-word'
        },
        button: {
            width: '100%',
            height: '40px',
            backgroundColor: 'var(--color-main-6)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: 'var(--font-size-3)',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
        },
        buttonHover: {
            backgroundColor: 'var(--color-main-5)'
        }
    }
    

    static #currentToast = null;
    static #currentModal = null;
    static #modalTimeout = null;

    static #showToast(message, PC = false, options = {}) {
        // PC 화면일 때 (780px 이상)
        if (window.innerWidth >= 780) {
            if (PC) {
                // PC 옵션이 true일 때는 항상 pcStyle로 표시
                this.#showpc(message, {
                    ...options,
                    style: this.#pcStyle.modal // 스타일 덮어쓰기
                });
            }
            return;
        }

        // 모바일 화면일 때는 기존 스타일 사용
        if (this.#currentToast) {
            this.#currentToast.hideToast();
        }

        this.#currentToast = Toastify({
            ...this.#defaultOptions,
            ...options,
            text: message
        }).showToast();
    }
    
    static #showpc(message, options = {}) {
        this.#removepc();
    
        const modal = document.createElement('div');
        Object.assign(modal.style, this.#pcStyle.modal, options.style || {});
    
        const messageEl = document.createElement('p');
        Object.assign(messageEl.style, this.#pcStyle.message);
        messageEl.textContent = message;
        modal.appendChild(messageEl);
    
        const button = document.createElement('button');
        button.textContent = '확인';
        Object.assign(button.style, this.#pcStyle.button);
        
        button.addEventListener('mouseover', () => {
            Object.assign(button.style, this.#pcStyle.buttonHover);
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = this.#pcStyle.button.backgroundColor;
        });
    
        button.onclick = () => this.#removepc();
        modal.appendChild(button);
    
        document.body.appendChild(modal);
        this.#currentModal = modal;
    
        const duration = options.duration || this.#defaultOptions.duration;
        this.#modalTimeout = setTimeout(() => this.#removepc(), duration);
    }

    static #removepc() {
        if (this.#currentModal) {
            document.body.removeChild(this.#currentModal);
            this.#currentModal = null;
        }
        if (this.#modalTimeout) {
            clearTimeout(this.#modalTimeout);
            this.#modalTimeout = null;
        }
    }

    static success(message, PC = false, options = {}) {
        const style = (window.innerWidth >= 780 && PC) ? {} : { style: this.#successStyle };
        this.#showToast(message, PC, {
            ...style,
            ...options
        });
    }

    static error(message, PC = false, options = {}) {
        const style = (window.innerWidth >= 780 && PC) ? {} : { style: this.#errorStyle };
        this.#showToast(message, PC, {
            ...style,
            ...options
        });
    }

    static info(message, PC = false, options = {}) {
        const style = (window.innerWidth >= 780 && PC) ? {} : { style: this.#infoStyle };
        this.#showToast(message, PC, {
            ...style,
            ...options
        });
    }
}