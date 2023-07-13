const mysql = require('mysql');

let connection;

function DB_Connect(){
    if(!connection){
        connection = mysql.createConnection({
            host: 'svc.sel4.cloudtype.app',
            user: 'root',
            password: 'tkfkdgo3@',
            database: 'flier',
            port: '32388'
        });

        return new Promise((resolve, reject) => {
            connection.connect(error => {
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                }
            });
        });
    } 
    else{
        return Promise.resolve();
    }
    
}
function DB_Close(){
    if (connection) {
        connection.end();
        connection = null;
    }
}
async function DB_Query(query, value){
    return await new Promise((resolve, reject) => {
        connection.query(query, value, function(error, rows){
            if(error){
                reject(error);
                return;
            }
            resolve(rows);
        });
    });
}
module.exports = {
    Connect: DB_Connect,
    Close: DB_Close,
    Query: DB_Query
};