const menu = document.getElementsByClassName('Board_Menu');

async function Board_Select(){
    const clickElement = event.target;

    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
            await Posts_Output(menu[idx].textContent);
        }
        else{
            menu[idx].style.opacity = 0.2;
        }
    }
}
async function Board_State_Init(){
    
    for(let idx = 0; idx < menu.length; idx++){
        if(idx === 0){
            menu[idx].style.opacity = 1;
        }
        else{
            menu[idx].style.opacity = 0.2;
        }
    }
    await Posts_Output('공지사항');
}
async function Posts_Output(board_type){
    const board = document.getElementById('Board');
    const tds = document.getElementsByClassName('add_td_Tag');

    let posts = await Posts_Import();
    let rows = [];
    while(tds.length > 0){
        tds[0].remove();
    }
    for(let idx = 0; idx < posts.length; idx++){
        let row = posts[idx];
        if(row['board_type'] === board_type){
            rows.push(row);
        }
    }
    for(let idx = 0; idx < rows.length; idx++){
        const tr = document.createElement('tr');
        const row = rows[idx];
        let structure = `
            <td class='add_td_Tag' colspan='1'>${idx + 1}</td>
            <td class='add_td_Tag' colspan='4'>${row['title']}</td>
            <td class='add_td_Tag' colspan='2'>${row['author_id']}</td>
            <td class='add_td_Tag' colspan='2'>${row['date']}</td>
            <td class='add_td_Tag' colspan='1'>${row['view_count']}</td>`;
        board.appendChild(tr);
        tr.innerHTML = structure;
    }
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