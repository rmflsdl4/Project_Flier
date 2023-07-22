const menu = document.getElementsByClassName('Board_Menu');

function Board_Select(){
    const clickElement = event.target;

    for(let idx = 0; idx < menu.length; idx++){
        if(menu[idx] === clickElement){
            menu[idx].style.opacity = 1;
            menu[idx].style.backgroundColor = '#e6e6e6';
            Posts_Output(menu[idx].textContent);
            nowPage = 1; //현재 페이지를 1로 설정
			window.history.pushState({ page: nowPage }, '', `?page=1`); //목록을 누르면 page를 1로 업데이트
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
    const user_type = await Get_User_Type();
    const board = document.getElementById('Board');	//목록
    const tds = document.getElementsByClassName('add_td_Tag');	//게시물
	const pageContainer = document.getElementById('pageLink');	//페이지링크
    const postCheck = document.getElementsByClassName('postCheck'); // 포스트 선택

    let posts = await Posts_Import();	//모든 게시물 가져오기
    let rows = posts.filter((post) => post.board_type === board_type);	//[]변경, 목록에 맞게 게시물 개수
	
    while(tds.length > 0){	//기존 게시물 삭제
        tds[0].remove();
        if(postCheck.length > 0){
            postCheck[0].remove();
        }
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
	const selectAll = document.getElementById('selectAll');
    for(let idx = 0; idx < nowPagePosts.length; idx++){		//게시물 표시	//rows를 nowPagePosts 변경
        const tr = document.createElement('tr');
        const row = nowPagePosts[idx];	//rows를 nowPagePosts 변경
        tr.setAttribute('class', 'add_tr_tag');
        if(row['lock_bool'] === 'true'){
            tr.setAttribute('onclick', `Lock_Post_Check(${row['post_id']})`);
            row['title'] = '🔒︎ 비밀글입니다.';
        }
        else{
            if(user_type === "user"){
                tr.setAttribute('onclick', `window.location.href='Post.html?post_id=${row['post_id']}'`);
            }
        }
        let structure = ``;
        // structure에 admin과 user 분기점 나누기
        if(user_type === "admin"){
            selectAll.style.display = 'block';
            structure = `
            <td class='add_td_Tag' colspan='1'><input type='checkbox' class='postCheck' name='selectedPost' value='${row['post_id']}'>${startIndex + idx + 1}</td>
            <td class='add_td_Tag' colspan='4' onclick='window.location.href="Post.html?post_id=${row['post_id']}"'>${row['title']}</td>
            <td class='add_td_Tag' colspan='2' onclick='window.location.href="Post.html?post_id=${row['post_id']}"'>${row['author_id']}</td>
            <td class='add_td_Tag' colspan='2' onclick='window.location.href="Post.html?post_id=${row['post_id']}"'>${row['date']}</td>
            <td class='add_td_Tag' colspan='1' onclick='window.location.href="Post.html?post_id=${row['post_id']}"'>${row['view_count']}</td>`;
        }
        else{
            selectAll.style.display = 'none';
            structure = `
            <td class='add_td_Tag' colspan='1'>${startIndex + idx + 1}</td>
            <td class='add_td_Tag' colspan='4'>${row['title']}</td>
            <td class='add_td_Tag' colspan='2'>${row['author_id']}</td>
            <td class='add_td_Tag' colspan='2'>${row['date']}</td>
            <td class='add_td_Tag' colspan='1'>${row['view_count']}</td>`;
        }
        
        board.appendChild(tr);
        tr.innerHTML = structure;
    }
    const tr = document.createElement('tr');
    tr.setAttribute('class', 'add_tr_tag');
    tr.setAttribute('onclick', `window.location.href='Add_Post.html'`);
    board.appendChild(tr);
    if(user_type === 'admin'){
        tr.innerHTML = `<td class='add_td_Tag' colspan='10'><img src='Image/add_post.png' width='22px' height='22px' style="vertical-align: middle; margin-right: 10px;">글 작성하기</td>`;
        const tr2 = document.createElement('tr');
        tr2.setAttribute('class', 'add_tr_tag');
        tr2.setAttribute('onclick', `Checked_Post_To_Delete()`);
        board.appendChild(tr2);
        tr2.innerHTML = `
        <td class='add_td_Tag' colspan='10'><img src='Image/delete.png' width='22px' height='22px' style="vertical-align: middle; margin-right: 10px;">글 삭제하기</td>`;
    }
    else{
        if(board_type !== "공지사항"){
            tr.innerHTML = `<td class='add_td_Tag' colspan='10'><img src='Image/add_post.png' width='22px' height='22px' style="vertical-align: middle; margin-right: 10px;">글 작성하기</td>`;
        }
    }

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
// 작성자 본인이라면 수정, 삭제 아이콘 표시, 아니라면 표시 X (게시물 내용 자체는 전부 표시됨)
async function View_Post(){
    const post_id = await Get_Post_id();

    const result = await new Promise((resolve, reject) => {
        fetch('/view-post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post_id })
        })
        .then(response => response.json())
        .then(result => {
            
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
    });
    const post = result.data;
    const user_id = result.session_id;

    const postById = document.getElementById('post');
    const Delete_Button = document.getElementById('delete');
    const Update_Button = document.getElementById('update');

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

    if(post[0]['author_id'] === user_id){
        Delete_Button.style.display = 'block';
        Update_Button.style.display = 'block';
    }
    else{
        Delete_Button.style.display = 'none';
        Update_Button.style.display = 'none';
    }
}
async function Add_Post(values){
    event.preventDefault();

    const formData = new FormData(values);

    var lock = document.getElementById('lock');
    var state = lock.dataset.state;
    formData.append('lock_state', state);
    fetch('/add-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData: Object.fromEntries(formData) })
    })
    .then(res => {
        alert('게시글을 등록하였습니다.');
        location.href = 'Main.html';
    })
    .catch(error => {
        alert('게시글 등록에 실패하였습니다.');
        location.href = 'Main.html';
        console.log(error);
    });
}
// 질문 게시판이라면 비밀글 아이콘 표시, 아니라면 숨김
function Change_Values(){
    const board_type = document.getElementsByName('board_type');
    const lock = document.getElementById('lock');

    for(let i = 0; i <board_type.length; i++){
        if(board_type[i].checked){
            const label = document.querySelector(`label[for="${board_type[i].id}"]`);
            label.style.backgroundColor = '#e6e6e6';
            label.style.opacity = 1.0;
            if(board_type[i].value === '질문게시판'){
                lock.style.display = 'block';
            }
            else{
                lock.style.display = 'none';
            }
        }
        else{
            const label = document.querySelector(`label[for="${board_type[i].id}"]`);
            label.style.backgroundColor = 'none';
            label.style.opacity = 0.1;
        }
    }
}
// textarea 자동으로 줄 늘어남
function autoResize(textarea) {
    textarea.style.height = 'auto';
  
    textarea.style.height = textarea.scrollHeight + 'px';
}
// 비밀글 true/false 판단해서 투명도와 상태 변경
function Private_Post(lock){

    if(lock.dataset.state === 'true'){
        lock.style.opacity = 0.2;
        lock.dataset.state = 'false';
    }
    else{
        lock.style.opacity = 1.0;
        lock.dataset.state = 'true';
    }
}
// 비밀글인지 확인하는 함수
function Lock_Post_Check(post_id){
    fetch('/post-lock-check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id })
    })
    .then(data => {
        if(data !== 'true'){
            alert('개인/관리자 이외에는 열람하실 수 없습니다.');
        }
    })
    .catch(error => {
        alert('오류 발생');
        alert(error);
    });
}
// Get_Post_id()로 post_id를 찾고 delete-post로 전달	//게시글 삭제
async function Delete_Post() {
	const post_id = await Get_Post_id();
	const check = confirm("게시글을 삭제하겠습니까?");
	
	
	if (check) {
		fetch('/delete-post', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ post_id })
		})
		.then(post_id => {
			alert("삭제되었습니다.");
			location.href = 'Main.html';
		})
		.catch(error => {
			alert('오류 발생');
			console.log(error);
		});
	}
}
// post_id를 전달하면서 수정 페이지로 이동
async function Update_Post_Page(){
    const post_id = await Get_Post_id();
    window.location.href = 'Update_Post.html?post_id='+post_id;
}
// post_id를 반환하는 함수. 예시 ) const post_id = Get_Post_id();
function Get_Post_id(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const post_id = urlParams.get('post_id');

    return post_id;
}
// 수정할 글을 불러옴
async function Get_Update_Post(){
    const post_id = await Get_Post_id();

    const result = await new Promise((resolve, reject) => {
        fetch('/view-post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post_id })
        })
        .then(response => response.json())
        .then(result => {
            
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
    });
    const post = result.data;

    const postById = document.getElementById('Update_Post_Box');

    postById.innerHTML =
    `
    <form>
        <input type='text' value='${post[0]['board_type']}' id='update_board_type' readonly>
        <input type='text' value='${post[0]['title']}' name='title' id='update_title'>
        <textarea name='content' rows='1' oninput="autoResize(this)" id='update_content'>${post[0]['content'].replace(/\n/g, '<br/>')}</textarea>
        <input type='hidden' name='post_id' value='${post_id}'>
        <button type='submit' id='update_div'>
			<img id="update_button" src='Image/update.png' width='28px'>
            수정하기
		</button>
    </form>`;
}
// 유저 타입 가져오는 함수
async function Get_User_Type(){
    const result = await new Promise((resolve, reject) => {
        fetch('/get-user-type', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        });
    })

    const user_type = await result.text();

    return user_type;
}
// 현재 선택된 게시물
function Checked_Post_To_Delete(){
    const posts = document.getElementsByName('selectedPost');
    let posts_id = [];
    for(let i = 0; i < posts.length; i++){
        if(posts[i].checked){
            posts_id.push(posts[i].value);
        }
    }
    fetch('/selected-posts-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ posts_id })
    })
    .then(res => {
        alert('게시글을 삭제하였습니다.');
        window.location.href = 'Main.html';
    })
    .catch(error => {
        console.log(error);
    });
}
// 모든 게시물 선택 ( 관리자 )
function SelectAll(element){
    const postCheck = document.getElementsByClassName('postCheck');
    const isChecked = element.checked;

    for (let i = 0; i < postCheck.length; i++) {
        postCheck[i].checked = isChecked;
    }
}