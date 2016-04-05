module.exports = function (app, routes) {
    app.post('/user/:sql',routes.userdo);
    app.post('/wx_user/:sql',routes.wx_userdo);
};