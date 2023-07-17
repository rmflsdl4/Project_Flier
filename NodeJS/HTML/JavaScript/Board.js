const menu = document.getElementsByClassName('Board_Menu');

function Board_Select(){
    const clickElement = event.target;

    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = '#e6e6e6';
            Posts_Output(menu[idx].textContent);
        }
        else{
            menu[idx].style.opacity = 0.1;
            menu[idx].style.backgroundColor = 'none';
        }
    }
}
function Board_State_Init(){
    
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
    Posts_Output('공지사항');
}
async function Posts_Output(board_type){
    const board = document.getElementById('Board');	//목록
    const tds = document.getElementsByClassName('add_td_Tag');	//게시물
	const pageContainer = document.getElementById('pageLink');	//페이지링크

    let posts = await Posts_Import();	//모든 게시물 가져오기
    let rows = posts.filter((post) => post.board_type === board_type);	//[]변경, 목록에 맞게 게시물 개수
	
    while(tds.length > 0){	//기존 게시물 삭제
        tds[0].remove();
    }
	
	let pageSize = 10;	//10개씩
	let pageCount = Math.ceil(rows.length / pageSize); // 게시물 전체 크기
	let nowPage = 1;	//현재 페이지
	
	if (window.location.search) {	
		const urlParams = new URLSearchParams(window.location.search);
		const urlBoardType = urlParams.get('board_type');
		nowPage = (board_type === urlBoardType) ? parseInt(urlParams.get('page')) || 1 : 1;	//게시물이 없다면 1로
		if (nowPage < 1) {	//페이지는 1이상
			nowPage = 1;
		}
		if (nowPage > pageCount) {	//현재페이지가 전체페이지 보다 큰경우 현재 페이지가 전체페이지가 된다
			nowPage = pageCount;
		}
	}
	else {
		nowPage = 1;
	}
	
	let startIndex = (nowPage - 1) * pageSize;	//첫 페이지
	let endIndex = Math.min(startIndex + pageSize, rows.length);	//마지막 페이지
	let nowPagePosts = rows.slice(startIndex, endIndex);	//페이지에 맞는 게시물
	
    for(let idx = 0; idx < nowPagePosts.length; idx++){		//게시물 표시	//rows를 nowPagePosts 변경
        const tr = document.createElement('tr');
        const row = nowPagePosts[idx];	//rows를 nowPagePosts 변경
        tr.setAttribute('class', 'add_tr_tag');
        tr.setAttribute('onclick', `window.location.href='Post.html?post_id=${row['post_id']}'`);

        let structure = `
            <td class='add_td_Tag' colspan='1'>${startIndex + idx + 1}</td>
            <td class='add_td_Tag' colspan='4'>${row['title']}</td>
            <td class='add_td_Tag' colspan='2'>${row['author_id']}</td>
            <td class='add_td_Tag' colspan='2'>${row['date']}</td>
            <td class='add_td_Tag' colspan='1'>${row['view_count']}</td>`;
        
        board.appendChild(tr);
        tr.innerHTML = structure;
    }
    const tr = document.createElement('tr');
    tr.setAttribute('class', 'add_tr_tag');
    tr.setAttribute('onclick', `window.location.href='Add_Post.html'`);
    board.appendChild(tr);
    tr.innerHTML = `<td class='add_td_Tag' colspan='10'><img src='Image/add_post.png' width='22px' height='22px' style="vertical-align: middle; margin-right: 10px;">글 작성하기</td>`;

	pageContainer.innerHTML = '';	//기존 페이지링크 삭제
	
	for (let i = 1; i <= pageCount; i++) {	//pageLink
		const pageLink = document.createElement('a');
		pageLink.classList.add('pageLink');
		 pageLink.href = `?board_type=${board_type}&page=${i}`;
		pageLink.textContent = i;	//숫자를 텍스트로
		
		if (i === nowPage) {
			pageLink.classList.add('active');
		}
		
		pageLink.addEventListener('click', (event) => {
			event.preventDefault();		//기본동작 취소
			const urlParams = new URLSearchParams(event.target.href);
            nowPage = parseInt(urlParams.get('page')) || 1;
			window.history.pushState({ page: nowPage }, '', `?board_type=${board_type}&page=${nowPage}`);	//페이지 변경시 nowPage 업데이트 
			Posts_Output(board_type);	//게시물 불러옴
		});
		
		pageContainer.appendChild(pageLink);
	}
	console.log('지금 페이지:', nowPage);
	console.log('지금 페이지 게시물:', nowPagePosts);
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
            <td colspan='6' height='300'>${post[0]['content'].replace(/\n/g, '<br/>')}</td>
        </tr>
    </table>`;
}
function Add_Post(){
    const board_type = document.getElementsByName('board_type');
    for(let i = 0; i <board_type.length; i++){
        if(board_type[i].checked){
            const label = document.querySelector(`label[for="${board_type[i].id}"]`);
            label.style.backgroundColor = '#e6e6e6';
            label.style.opacity = 1.0;
        }
        else{
            const label = document.querySelector(`label[for="${board_type[i].id}"]`);
            label.style.backgroundColor = 'none';
            label.style.opacity = 0.1;
        }
    }
}
function autoResize(textarea) {
    textarea.style.height = 'auto';
  
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  
