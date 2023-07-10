const mysql = require('mysql');

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'svc.sel4.cloudtype.app',
    user: 'root',
    password: 'tkfkdgo3@',
    database: 'flier'
});

// 데이터베이스 연결
connection.connect(function(err){
    if(err){
        console.error('데이터베이스에 연결할 수 없습니다.');
        return;
    }

    console.log('데이터베이스 연결 성공!');
});

// 데이터 저장