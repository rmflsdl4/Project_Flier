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
    // 분기점 별 함수 실행
    if(element.name === "id"){
        if(Normalization_Check(element.value)){
            img.src = "Image/check.png";
            textNode.nodeValue = "사용 가능한 아이디입니다.";
        }
        else{
            img.src = "Image/dcheck.png";
            textNode.nodeValue = "사용 불가능한 아이디입니다.";
        }
    }
    else if(element.name === "pw"){

    }
    else if(element.name === "nick_name"){

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
function Normalization_Check(value){
    let id_normal = /^[A-Za-z]{1}[A-Za-z0-9_-]{3,19}$/ // 반드시 영문으로 시작 숫자+언더바/하이픈 허용 4~20자리

    if(id_normal.test(value)){
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://port-9000-php-k19y2kljvm1qyo.sel4.cloudtype.app/SignUp.php?value=' + encodeURIComponent(value), true);
       
        xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            return response;
        }
        };
        xhr.send();
    }
    return false;
}