let idc, pwc, cpwc, nnc;

function Input_Check(element){
    Input_Data_Check_To_Submit();
    // 패턴 체크
    let div = document.createElement("div");
    let img = document.createElement("img");
    let span = document.createElement("span");
    let parentElement = element.parentNode;
    let textNode = document.createTextNode("");
    
    let childElement = parentElement.firstElementChild;

    var len = element.value.length;

    let pw = document.getElementById('pw');
    let confirm_pw = document.getElementById('confirm_pw');

    div.setAttribute('class', 'MessageBox');

    while (childElement !== null) {
        const nextElement = childElement.nextElementSibling;
        
        if (nextElement !== null) {
          parentElement.removeChild(nextElement);
        }
      
        childElement = nextElement;
    }
    // 빈칸이면 더 이상 실행하지 않고 margin 값 주고 종료
    if(len <= 0){
        element.style.marginBottom = "10px";
        return;
    }
    else{
        element.style.marginBottom = "0px";
    }
    // 분기별 함수 실행

    if(element.name === "id"){
        Value_Check(element.name, element.value, null)
            .then(result => {
                idc = result;
                console.log(idc, pwc, cpwc, nnc);
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 아이디입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "사용 불가능한 아이디입니다.";
                }
            });
    }
    else if(element.name === "pw"){
        pw.value = element.value;
        Value_Check(element.name, element.value, null)
            .then(result => {
                pwc = result;
                console.log(idc, pwc, cpwc, nnc);
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용 가능한 비밀번호입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "사용 불가능한 비밀번호입니다.";
                }
            });
    }
    else if(element.name === "confirm_pw"){
        confirm_pw = element.value;
        Value_Check(element.name, pw.value, element.value)
            .then(result => {
                cpwc = result;
                console.log(idc, pwc, cpwc, nnc);
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "비밀번호가 일치합니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "비밀번호가 일치하지 않습니다.";
                }
            });
    }
    else if(element.name === "nick_name"){
        Value_Check(element.name, element.value, null)
            .then(result => {
                nnc = result;
                console.log(idc, pwc, cpwc, nnc);
                if(result){
                    img.src = "Image/check.png";
                    textNode.nodeValue = "사용할 수 있는 별명입니다.";
                }
                else{
                    img.src = "Image/dcheck.png";
                    textNode.nodeValue = "중복된 별명입니다.";
                }
            });
    }

    if(pw.value !== confirm_pw.value && pw.value !== null && confirm_pw.value !== null){
        cpwc = false;
    }
    else{
        cpwc = true;
    }

    parentElement.appendChild(div);
    div.appendChild(img);
    div.appendChild(span);
    span.appendChild(textNode);
}
function InitForm(){
    let arr = document.getElementsByTagName("input");
    
    for(let i = 0; i < arr.length; i++){
        arr[i].style.marginBottom = "10px";
    }
}
function Input_Data_Check_To_Submit(){
    let inputData = document.getElementsByTagName("input");
    let submitButton = document.getElementById("sign_up");

    for(let i = 0; i < inputData.length; i++){
        if(inputData[i].value === ""){
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "#347236";
            return;
        }
    }
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#4CAF50";
    submitButton.style.cursor = "pointer";
}
function Value_Check(name, value1, value2) {
    return new Promise((resolve, reject) => {
        fetch('/check-input', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, value1, value2 })
        })
            .then(response => response.json())
            .then(data => {
                const result = data.result;
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function All_Values_Check(){
    if(idc && pwc && cpwc && nnc){
        return true;
    }
    alert('입력값을 다시 확인해 주세요.');
    return false;
}
  
