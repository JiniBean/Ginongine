export default class EmailVerifier {

    checkFormat(email){
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    verify(email, confirm, valid){
        valid.email = true;
        confirm.querySelector("div.timer").textContent ="test";
    }

}