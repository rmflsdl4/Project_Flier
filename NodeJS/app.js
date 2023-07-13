// 사용 모듈 로드
var express = require('express');
var app = express();
var fs = require('fs');
const normalization = require('./JavaScript/Normalization_Check.js');
const signup = require('./JavaScript/SignUp.js');

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
    
    res.send("<script>alert('회원가입이 완료되었습니다.'); location.href='Login.html';</script>");
});
// 포트 설정
app.listen(2098, function(){
    console.log('서버 구동');
})