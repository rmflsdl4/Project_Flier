import express from 'express';
import mysql from 'mysql';
const app = express();

app.use(express.json());

app.post('/check-input', (req, res) => {
    const { name, value } = req.body;

    let result = false;
    
    // 분기별로 처리 로직 수행
    if (name === 'id') {
        ID_Normalization_Check('rmflsdl')
            .then(result => {
                console.log(result);
            });
    } else if (name === 'pw') {
        // 비밀번호 처리 로직
    } else if (name === 'confirm_pw') {
        // 비밀번호 확인 처리 로직
    } else if (name === 'nick_name') {
        // 별명 처리 로직
    }

    res.json({ result });
});

app.listen(2098, () => {
  console.log('서버가 실행되었습니다.');
});

async function ID_Normalization_Check(value){

    var connection = mysql.createConnection({
        host: 'svc.sel4.cloudtype.app',
        user: 'root',
        password: 'tkfkdgo3@',
        database: 'flier',
        port: '32388'
    });

    connection.connect();

    // 반드시 영문으로 시작 숫자+언더바/하이픈 허용 4~20자리
    let id_normal = /^[A-Za-z]{1}[A-Za-z0-9_-]{3,19}$/
    let bool;
    if(id_normal.test(value)){
        const query = 'SELECT COUNT(*) AS count FROM users WHERE id = ?';

        // MySQL 쿼리를 Promise로 감싸고 await를 사용하여 결과를 기다림
        const count = await new Promise((resolve, reject) => {
            connection.query(query, value, function(error, rows){
                if(error){
                    reject(error);
                    return;
                }
                 resolve(rows[0].count);
            });
        });
       
        bool = count === 0;
    }
    
    connection.end();
    return bool;
}