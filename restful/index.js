const http = require('http');

let server = http.createServer((req, res) => {

    switch (req.url) {

        case '/':

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1>Olá Mundo!</h1>');

        break;

        case '/users':

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                users: [
                    {
                        id: 1,
                        name: 'Tiago',
                        email: 'tiago@batata.com'
                    }
                ]
            }));

        break;

    }

});

server.listen(3000, '127.0.0.1', () => {

    console.log('Running');

});