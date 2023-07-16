const database = require('../database.js');

async function Get_Post_List(){
    
    const query = 'SELECT post_id, title, author_id, DATE_FORMAT(added, \'%Y-%m-%d %H:%i:%s\') as date, view_count, board_type FROM posts';

    const result = await database.Query(query, null);

    if (result instanceof Error) {
        return;
    }

    return result;
}
async function Get_Post(post_id){
    const query = `SELECT title, author_id, DATE_FORMAT(added, \'%Y-%m-%d %H:%i:%s\') as date, view_count, board_type, content FROM posts WHERE post_id = ${post_id}`;

    const result = await database.Query(query, null);

    if (result instanceof Error) {
        return;
    }
    return result;
}
async function Add_View_Count(post_id){
    const query = `UPDATE posts SET view_count = view_count + 1 WHERE post_id = ?`;

    const result = await database.Query(query, post_id);

    if (result instanceof Error) {
        return;
    } 
}
async function Add_Post(board_type, title, content, user_id){
    const query = `INSERT INTO posts(title, author_id, board_type, content) VALUES (?, ?, ?, ?)`;

    const values = [title, user_id, board_type, content];

    result = await database.Query(query, values);
    

    if (result instanceof Error) {
        return;
    } 
}

module.exports = {
    Get_List: Get_Post_List,
    Get_Post: Get_Post,
    Add_View_Count: Add_View_Count,
    Add_Post: Add_Post
};
