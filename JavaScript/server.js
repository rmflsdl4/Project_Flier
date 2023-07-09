const express = require('express');
const server = express();
const port = 3000;

server.get('/', (req, res) => {
    res.send('Hello');
});

server.listen(port, () => {
    console.log('서버가 실행됩니다.');
});