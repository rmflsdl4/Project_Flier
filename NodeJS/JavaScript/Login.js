const database = require('../database.js');

async function _Login(id, pw){
    await database.Connect();
    
    const query = 'SELECT * FROM users WHERE id = ? AND pw = ?';
    const values = [id, pw];

    const result = await database.Query(query, values);

    if (result instanceof Error) {
        return;
    }
        
    
    database.Close();
}

module.exports = {
    Login: _Login
};