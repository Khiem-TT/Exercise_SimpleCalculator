const http = require('http');
const fs = require('fs');
const qs = require('qs');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        fs.readFile('./calculator.html', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    } else {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let value = qs.parse(data);
            fs.readFile('./calculator.html', 'utf8', (err, dataHtml) => {
                if (err) {
                    console.log(err);
                }
                let calculation = value.calculation;
                let result = 0;
                switch (calculation) {
                    case '+':
                        result = +value.parameter1 + +value.parameter2;
                        break;
                    case '-':
                        result = +value.parameter1 - +value.parameter2;
                        break;
                    case '*':
                        result = +value.parameter1 * +value.parameter2;
                        break;
                    case '/':
                        result = +value.parameter1 / +value.parameter2;
                        break;
                }
                dataHtml = dataHtml.replace('{result}', result.toString());
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(dataHtml);
                return res.end();
            });
        });
        req.on('error', () => {
            console.log('error');
        });
    }
})

server.listen(8080, () => {
    console.log('server running at localhost:8080');
});