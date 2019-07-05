module.exports = {
    user: (app, req, res) => {
        req.assert('name', 'Name is required').notEmpty();
        req.assert('email', 'E-mail is required').notEmpty().isEmail();

        const errors = req.validationErrors();

        if (errors) {
            app.utils.error.send(errors, req, res);
            return false;
        }

        return true;
    }
};