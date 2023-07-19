// 사용 모듈 로드
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const normalization = require('./JavaScript/Normalization_Check.js');
const signup = require('./JavaScript/SignUp.js');
const login = require('./JavaScript/Login.js');
const posts = require('./JavaScript/Post.js');
const database = require('./database.js');

// 데이터베이스 연결
database.Connect();
// 모듈에서 사용할 로직들
const app = express();
var fs = require('fs');
const sessionStore = new MySQLStore({
    host: 'svc.sel4.cloudtype.app',
    user: 'root',
    password: 'tkfkdgo3@',
    database: 'flier',
    port: '32388',
    charset: 'UTF8MB4',
    expiration: 24 * 60 * 60 * 1000
});

app.use(express.static('HTML'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
}));

// 서버 구동
app.listen(2098, function(){
    console.log('서버 구동');
});

// 서버 오류 처리
process.on('uncaughtException', (err) => {
    console.error('오류가 발생했습니다:', err);
  
    database.Close();
    
    process.exit(1); // 0이 아닌 값은 비정상적인 종료를 나타냄
});


// 라우팅 설정

app.get('/', function(req, res){
    fs.readFile('HTML/Login.html', function(error, data){
        if(error){
            console.log(error);
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
});
// 회원가입 입력값 검사
app.post('/check-input', (req, res) => {
    const { name, value1, value2 } = req.body;
    
    // 분기별로 처리 로직 수행
    if (name === 'id') {
        normalization.ID_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'pw') {
        normalization.PW_Check(value1, value2)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'confirm_pw') {
        normalization.Confirm_Pw_Check(value1, value2)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'nick_name') {
        console.log(value1);
        normalization.Nick_Name_Check(value1)
            .then(result => {
                res.json({ result });
            });
    }
});
app.post('/sign-up', (req, res) => {
    const { id, pw, nick_name } = req.body;

    try{
        signup.Add_User(id, pw, nick_name);
    
        console.log(`신규 회원 정보 [ ID - ${id} / NAME - ${nick_name} ]`);

        res.send("<script>alert('회원가입이 완료되었습니다.'); location.href='Login.html';</script>");
    }
    catch(error){
        console.error('회원가입 오류:', error);
        res.status(500).send("<script>alert('회원가입에 실패하였습니다.'); location.href='SignUp.html';</script>");
    }
});
app.post('/login', (req, res) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;

    const { id, pw } = req.body;

    login.Login(id, pw)
        .then((state) => {
            if(state === 1){
                req.session.session_id = id;
                console.log(`회원 [ ${id} ] 접속.... 접속 시간 : ${formattedDate}`);
                console.log(`세션에 ID 저장: ${req.session.session_id}`);
                console.log(`현재 남아있는 세션 데이터: ${req.session}`);
                res.send("<script>alert('로그인에 성공하였습니다.'); location.href='Main.html';</script>");
            }
            else{
                res.send("<script>alert('로그인에 실패하였습니다.'); location.href='Login.html';</script>");
            }
        })
})
app.post('/posts-import', async (req, res) => {
    const data = await posts.Get_List();
    

    res.send(data);
})
app.post('/view-post', async (req, res) => {
    const { post_id } = req.body;
    await posts.Add_View_Count(post_id);
    const data = await posts.Get_Post(post_id);
    const session_id = req.session.session_id;
    res.send( { data, session_id });
})

app.post('/add-post', async (req, res) => {
    const { formData } = req.body;
    const { board_type, title, content, lock_state } = formData;
    console.log(board_type, title, content, lock_state);
    try{
        await posts.Add_Post(board_type, title, content, req.session.session_id, lock_state);
        res.send("<script>alert('게시글을 등록하였습니다.'); location.href='Main.html';</script>");
    }
    catch(error){
        console.log(error);
        res.send("<script>alert('게시글 등록에 실패하였습니다.'); location.href='Main.html';</script>");
    }
})
app.post('/post-lock-check', async (req, res) => {
    const { post_id } = req.body;
    
    try{
        const isLock = await posts.Lock_Check(post_id, req.session.session_id);
        console.log(isLock);
        res.send(isLock);
    }
    catch(error){
        console.log(error);
        res.send('false');
    }
})
app.post('/update-post', async (req, res) => {

})
