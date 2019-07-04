const NeDB = require('nedb');
const db = new NeDB({
    filename: 'users.db',
    autoload: true
});

module.exports = app => {

    const route = app.route('/users');

    route.get((req, res) => {
        db.find({}).sort({name: 1}).exec((err, users) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json({users: users});
            }
        });
    });
    
    route.post((req, res) => {
        db.insert(req.body, (err, user) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });
};