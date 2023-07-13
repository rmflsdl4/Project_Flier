// 사용 모듈 로드
var express = require('express');
var app = express();
var fs = require('fs');
const normalization = require('./JavaScript/Normalization_Check.js');
const signup = require('./JavaScript/SignUp.js');
const login = require('./JavaScript/Login.js');

app.use(express.static('HTML'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
// 포트 설정
app.listen(2098, function(){
    console.log('서버 구동');
})