let express = require('express');
let routes = express.Router();

routes.get('/', (req, res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        users: [
            {
                id: 1,
                name: 'Tiago',
                email: 'tiago@batata.com'
            }
        ]
    });

});

routes.get('/admin', (req, res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        users: []
    });

})

module.exports = routes;