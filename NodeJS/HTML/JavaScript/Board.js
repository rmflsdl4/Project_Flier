const menu = document.getElementsByClassName('Board_Menu');

async function Board_Select(){
    const clickElement = event.target;

    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = '#e6e6e6';
            await Posts_Output(menu[idx].textContent);
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
        }
    }
}
async function Board_State_Init(){
    
    for(let idx = 0; idx < menu.length; idx++){
        if(idx === 0){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = '#e6e6e6';
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
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
        tr.setAttribute('class', 'add_tr_tag');
        tr.setAttribute('onclick', `window.location.href='Post.html?post_id=${row['post_id']}'`);

        let structure = `
            <td class='add_td_Tag' colspan='1'>${idx + 1}</td>
            <td class='add_td_Tag' colspan='4'>${row['title']}</td>
            <td class='add_td_Tag' colspan='2'>${row['author_id']}</td>
            <td class='add_td_Tag' colspan='2'>${row['date']}</td>
            <td class='add_td_Tag' colspan='1'>${row['view_count']}</td>`;
        
        tr.style.opacity = '0';
        board.appendChild(tr);
        tr.innerHTML = structure;

        await new Promise((resolve) => setTimeout(resolve, 200 * 0.7));
        tr.style.opacity = '1';
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
async function View_Post(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const post_id = urlParams.get('post_id');
    console.log(post_id);
    const post = await new Promise((resolve, reject) => {
        fetch('/view-post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post_id })
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

    const postById = document.getElementById('post');

    postById.innerHTML =
    `<table>
        <tr>
            <td colspan='6'><b>${post[0]['board_type']}</b></td>
        </tr>
        <tr>
            <td colspan='6'>${post[0]['title']}</td>
        </tr>
        <tr>
            <th width=10%>작성자</th>
            <td width=30%>${post[0]['author_id']}</td>
            <th width=10%>작성일</th>
            <td width=30%>${post[0]['date']}</td>
            <th width=10%>조회수</th>
            <td width=10%>${post[0]['view_count']}</td>
        </tr>
        <tr>
            <td colspan='6' height='300'>${post[0]['content']}</td>
        </tr>
    </table>`;
}