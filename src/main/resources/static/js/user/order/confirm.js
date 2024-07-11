
const urlParams = new URLSearchParams(window.location.search);

async function confirm() {


    var requestData = {
        paymentKey: urlParams.get("paymentKey"),
        orderId: urlParams.get("orderId"),
        amount: urlParams.get("amount"),
    };
    console.log(requestData)

    const response = await fetch("/confirm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    const json = await response.json();

    if (!response.ok)
        window.location.href = `/order/fail?message=${json.message}&code=${json.code}`;

    window.location.href = `/order/success`;


}
confirm();