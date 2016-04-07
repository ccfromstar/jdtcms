module.exports = function (app, routes) {
    app.post('/user/:sql',routes.userdo);
    app.post('/post/:sql',routes.postdo);
    app.post('/wx_user/:sql',routes.wx_userdo);
    app.post('/wx_record/:sql',routes.wx_recorddo);
    app.post('/uploadImg',routes.uploadImg);
    app.get('/getopenid',routes.getopenid);
};