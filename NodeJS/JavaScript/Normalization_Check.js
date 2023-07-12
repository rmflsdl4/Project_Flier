function ID_Normalization_Check(value){
    var mysql = require('mysql');

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
        
    }
    const query = 'SELECT COUNT(*) AS count FROM users WHERE id = ?';
    connection.query(query, value, function(error, rows){
        if(error){
            throw error;
        }
        if(rows[0].count > 0){
            bool = false;
        }
        else{
            bool = true;
        }
    })
    connection.end();
    return bool;
}

module.exports = {
    ID_Normalization_Check: ID_Normalization_Check
};