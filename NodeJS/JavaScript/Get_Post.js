const database = require('../database.js');

async function Get_Post(){
    await database.Connect();
    
    const query = 'SELECT post_id, title, author_id, DATE_FORMAT(added, \'%Y-%m-%d %H:%i:%s\') as date, view_count, board_type FROM posts';

    const result = await database.Query(query, null);

    if (result instanceof Error) {
        return;
    }

    database.Close();
    return result;
}


module.exports = {
    Get: Get_Post
};
