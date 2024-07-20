export default class Cookie {

    constructor(name) {
        this.map = {};
        this.initCookie(name);
    }

    initCookie(name) {
        if (document.cookie) {
            // 쿠키가 존재하는 경우, 파싱하여 map에 저장
            this.parseCookie(name);
        } else {
            // 쿠키가 존재하지 않으면 Product : 빈 배열로 초기화
            this.map[name] = [];
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
        return this.map[name];
    }

    save(name) {
        const list = this.map[name];
        const encoded = encodeURIComponent(JSON.stringify(list));
        document.cookie = `${name}=${encoded}; path=/;`;
    }

    add(name, item) {
        // const list = this.map[name];
        // list.push(item);
        // this.map[name] = list;
        this.map[name].push(item);
    }

    remove(name) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        delete this.map[name];
    }


}