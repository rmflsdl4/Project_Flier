const menu = document.getElementsByClassName('Board_Menu');
const table = document.getElementById('Board');
let tr = document.createElement("tr");
let td = document.createElement("td");


function Board_Select(){
    const clickElement = event.target;

    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
        }
        else{
            menu[idx].style.opacity = 0.2;
        }
    }
}
function Board_State_Init(){
    for(let idx = 0; idx < menu.length; idx++){
        if(idx === 0){
            menu[idx].style.opacity = 1;
        }
        else{
            menu[idx].style.opacity = 0.2;
        }
    }
    let posts = Posts_Import();
    console.log(posts);
    //table.appendChild(tr);
    //tr.appendChild(td);
}

function Posts_Import() {
    return new Promise((resolve, reject) => {
        fetch('/posts-import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const result = data;
                
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}