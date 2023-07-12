// 사용 모듈 로드
var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static('../HTML'))
// 라우팅 설정
app.get('/', function(req, res){
    fs.readFile('../HTML/Login.html', function(error, data){
        if(error){
            console.log(error);
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
});

// 포트 설정
app.listen(3000, function(){
    console.log('서버 구동');
})