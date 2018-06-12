const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer( (req, res) => {

  switch (req.method) {
    case 'GET':
      if(req.url === '/'){
        sendHTML();
      }
      break;

    case 'POST':
      if(req.url === '/'){
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        }).on('end', () => {
          let data = querystring.parse(body);
          data = JSON.stringify(data);
          fs.appendFile('db.json', `${data},\n`, (err) => {
            if(err) throw err;
          });
          sendHTML();
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented')
  }

  function sendHTML() {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('./index.html').pipe(res);
  }

});

server.listen(8080, console.log('server is running'));