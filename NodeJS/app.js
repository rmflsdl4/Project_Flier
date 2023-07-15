// 사용 모듈 로드
const express = require('express');
const wsModule = require('ws');
const normalization = require('./JavaScript/Normalization_Check.js');
const signup = require('./JavaScript/SignUp.js');
const login = require('./JavaScript/Login.js');
const posts = require('./JavaScript/Get_Post.js');
const database = require('./database.js');

// 모듈에서 사용할 로직들
const app = express();
var fs = require('fs');

app.use(express.static('HTML'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 서버 구동
const httpServer = app.listen(2098, function(){
    console.log('서버 구동');
});

const webSocketServer = new wsModule.Server({ server: httpServer });

const clients = new Set();

// 소켓 설정
webSocketServer.on('connection', (ws, request) => {
    if(clients.has(ws)){
        ws.close();
        return;
    }

    clients.add(ws);
    ws.send('현재 접속자 수 - ' + clients.size);

    database.Connect();

    ws.on('close', () => {
        clients.delete(ws);
        database.Close();
    })
})

// 라우팅 설정

app.use((req, res, next) => {
    if(!req.session.ip){
        req.session.ip = req.ip;
    }
    next();
})

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

    signup.Add_User(id, pw, nick_name);
    
    console.log(`신규 회원 정보 [ ID - ${id} / NAME - ${nick_name} ]`);

    res.send("<script>alert('회원가입이 완료되었습니다.'); location.href='Login.html';</script>");
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
                console.log(`회원 [ ${id} ] 접속.... 접속 시간 : ${formattedDate}`);
        
                res.send("<script>alert('로그인에 성공하였습니다.'); location.href='Main.html';</script>");
            }
            else{
                res.send("<script>alert('로그인에 실패하였습니다.'); location.href='Login.html';</script>");
            }
        })
})
app.post('/posts-import', async (req, res) => {
    const data = await posts.Get();
    

    res.send(data);
})
