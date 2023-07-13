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
        if(checkInput(element.name, element.value)){
            img.src = "Image/check.png";
            textNode.nodeValue = "사용 가능한 아이디입니다.";
        }
        else{
            img.src = "Image/dcheck.png";
            textNode.nodeValue = "사용 불가능한 아이디입니다.";
        }
    }
    else if(element.name === "pw"){
        img.src = "Image/dcheck.png";
        textNode.nodeValue = "사용 불가능한 비밀번호입니다.";
    }
    else if(element.name === "confirm_pw"){
        img.src = "Image/dcheck.png";
        textNode.nodeValue = "비밀번호가 일치하지 않습니다.";
    }
    else if(element.name === "nick_name"){
        img.src = "Image/dcheck.png";
        textNode.nodeValue = "별명에 사용할 수 없는 문자입니다.";
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
function checkInput(name, value) {
    fetch('/check-input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, value })
    })
      .then(response => response.json())
      .then(data => {
        const result = data.result;
        
        return result;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  