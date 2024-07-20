export default class Cookie {

    constructor(name) {
        this.map = {};
        this.initCookie(name);
    }

    initCookie(name) {
        if (document.cookie) {
            // 쿠키가 존재하는 경우 map에 저장, value 파싱이 필요한 경우 name 값 제공
            this.parseCookie(name);
        }
    }

    parseCookie(name) {
        const cookieDecoded = decodeURIComponent(document.cookie);
        const cookieTokens = cookieDecoded.split(";");

        for (const c of cookieTokens) {
            let tmp = c.split("=");
            let key = tmp[0].trim();
            let value = tmp[1];
            if(key===name)
                this.map[key] = JSON.parse(value);
            else
                this.map[key] = value;
        }
    }

    get(name) {
        return this.map[name] || [];
    }

    save(name) {
        const list = this.map[name];
        const encoded = encodeURIComponent(JSON.stringify(list));
        document.cookie = `${name}=${encoded}; path=/;`;
    }

    addItem(name, item) {
        this.map[name] = this.map[name] || [];
        this.map[name].push(item);
    }

    add(name, list) {
        this.map[name] = list;
    }

    set(name, value) {
        document.cookie  = `${name}=${value}; path=/;`;
    }


    remove(name) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        delete this.map[name];
    }


}