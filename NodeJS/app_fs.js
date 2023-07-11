const http = require('http');
var fs = require('fs');

const hostname = 'https://port-0-node-k19y2kljvm1qyo.sel4.cloudtype.app/';
const port = '3000';

http.createServer(function (req, res){
    fs.readFile('../Login.html', 'utf8', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });

}).listen(port, hostname, () => {
    console.log('서버 구동');
});