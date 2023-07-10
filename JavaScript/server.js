const express = require('express');
const server = express();
const port = 3000;

server.post('./JavaScript/server.js', (req, res) => {
    const data = req.body.name;

    res.send(data);
});

server.listen(port, () => {
    console.log('서버가 실행됩니다.');
});