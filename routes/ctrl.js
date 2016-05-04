module.exports = function (app, routes) {
    app.post('/user/:sql',routes.userdo);
    app.post('/post/:sql',routes.postdo);
    app.post('/wx_user/:sql',routes.wx_userdo);
    app.post('/wx_record/:sql',routes.wx_recorddo);
    app.post('/settings/:sql',routes.settingsdo);
    app.post('/uploadImg',routes.uploadImg);
    app.get('/getopenid',routes.getopenid);
    app.get('/weixin_js',routes.weixin_js);
    app.get('/reg',routes.reg);
    app.get('/myinfo',routes.myinfo);
    app.post('/jdtuser/:sql',routes.jdtuserdo);
    app.post('/redpacket/:sql',routes.redpacketdo);
    app.get('/sendredpack',routes.sendredpack);
    app.get('/regsuccess',routes.regsuccess);
    app.get('/WXprobase',routes.WXprobase);
};