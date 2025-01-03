export default class Toast {
    static #defaultOptions = {
        duration: 3000,
        gravity: "bottom",
        position: "center",
        stopOnFocus: true,
        className: "custom-toast",
        offset: {
            y: 100  // 바닥에서 60px 띄우기
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

    static #currentToast = null;

    static #showToast(options) {
        // 모바일 환경에서만 토스트 표시 (화면 너비가 780px 미만일 때)
        if (window.innerWidth >= 780) return;

        // 이전 토스트가 있으면 즉시 제거
        if (this.#currentToast) {
            this.#currentToast.hideToast();
        }

        // 새로운 토스트 표시
        this.#currentToast = Toastify({
            ...this.#defaultOptions,
            ...options
        }).showToast();
    }

    static success(message, options = {}) {
        this.#showToast({
            text: message,
            style: this.#successStyle,
            ...options
        });
    }

    static error(message, options = {}) {
        this.#showToast({
            text: message,
            style: this.#errorStyle,
            ...options
        });
    }

    static info(message, options = {}) {
        this.#showToast({
            text: message,
            style: this.#infoStyle,
            ...options
        });
    }
}