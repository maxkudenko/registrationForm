const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer( (req, res) => {

  if(req.method === 'GET' && req.url === '/') {
    sendHTML();
  }

  if(req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    }).on('end', () => {
      let data = querystring.parse(body);
      data = JSON.stringify(data);
      let writeStream = fs.createWriteStream('db.json', {flags: 'a'});
      writeStream.write(`${data}\n`);
      writeStream.end();
      sendHTML();
    });
  }

  function sendHTML() {
    let readStream = fs.createReadStream('./index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    readStream.on('data', chunk => {
      res.write(chunk);
    });
    readStream.on('end', () => {
      res.end();
    });
  }

});

server.listen(8080, console.log('server is running'));