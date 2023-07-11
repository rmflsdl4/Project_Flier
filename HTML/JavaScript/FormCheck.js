function Input_Check(element){
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
    if(len <= 0){
        element.style.marginBottom = "10px";
        return;
    }
    else{
        element.style.marginBottom = "0px";
    }
    if(len > 0){
        img.src = "Image/check.png";
        textNode.nodeValue = "올바른 입력입니다.";
    }
    else{
        img.src = "Image/dcheck.png";
        textNode.nodeValue = "올바르지 않은 입력입니다.";
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