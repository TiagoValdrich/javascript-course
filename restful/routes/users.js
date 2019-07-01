module.exports = app => {
    app.get('/users', (req, res) => {
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
    
    app.post('/users', (req, res) => {
        res.json(req.body);
    });
};