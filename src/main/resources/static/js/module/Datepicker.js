/**
 * Pikaday 기반의 데이트피커 유틸리티 클래스
 *
 * @example
 * // 1. HTML에서 Pikaday 라이브러리 추가
 * <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
 * <script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>
 *
 * // 2. HTML에서 입력 필드 정의
 * <input type="text" ref="singleDate">
 *
 * <div class="d:flex gap:4">
 *   <input type="text" ref="startDate">
 *   <input type="text" ref="endDate">
 * </div>
 *
 * // 3. JavaScript에서 사용 예시
 * // 단일 데이트피커
 * const datePicker = DatePicker.create(
 *     this.$refs.date,
 *     //날짜 선택시 필요한 콜백 함수 정의
 *     (date) => {
 *         this.date = date;  // YYYY-MM-DD 형식
 *     }
 * );
 *
 * // 범위 데이트피커
 * const { start, end } = DatePicker.createRange(
 *     this.$refs.startDate,
 *     this.$refs.endDate,
 *     //날짜 선택시 필요한 콜백 함수 정의
 *     (date, type) => {
 *         if (type === 'start') {
 *             this.startDt = formattedDate;
 *         } else {
 *             this.endDt = formattedDate;
 *         }
 *     }
 *     this.startPicker =  start;
 *     this.endPicker = end;
 * );
 *
 * // 4. 컴포넌트 제거 시 정리
 * unmounted() => {
 *    if (this.startPicker)
 *      this.startPicker.destroy();
 *
 *    if (this.endPicker)
 *      this.endPicker.destroy();
 *
 * });
 *
 * @class DatePicker
 */
export default class DatePicker {

    static #i18n = {
        months: [
            '1월', '2월', '3월', '4월',
            '5월', '6월', '7월', '8월',
            '9월', '10월', '11월', '12월'
        ],
        weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        weekdaysShort: ['일', '월', '화', '수', '목', '금', '토']
    };

    static #defaultConfig = {
        format: 'YYYY-MM-DD',
        i18n: this.#i18n,
        firstDay: 1,
        showMonthAfterYear: true,
        yearRange: [1900, 2030],
        yearSuffix: '년',
        monthSelector: true,
        yearSelector: true,
    };

    static formatDate(date) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    static create(field, callback, additionalConfig = {}) {
        return new Pikaday({
            ...this.#defaultConfig,
            field,
            toString(date) {
                return DatePicker.formatDate(date);
            },
            onSelect: (date) => {
                const formattedDate = this.formatDate(date);
                callback(formattedDate);
            },
            ...additionalConfig
        });
    }

    static createRange(start, end, callback) {
        const startPicker = this.create(start, (formattedDate) => {
            callback(formattedDate, 'start');
        });

        const endPicker = this.create(end, (formattedDate) => {
            callback(formattedDate, 'end');
        });

        return { start: startPicker, end: endPicker };
    }
}