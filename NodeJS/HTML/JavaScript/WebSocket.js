const webSocket = new WebSocket(`ws://${window.location.hostname}:2098`);

webSocket.onopen =  function(){
    console.log('접속 성공');
}

function Client_Count(){
    const clists = document.getElementById('client_cnt');
    webSocket.onmessage = (event) => {
        let message = event.data;
        clists.textContent = message;
    }
}
