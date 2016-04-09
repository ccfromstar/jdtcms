var settings = require('../settings');
var mysql = require('../models/db');
var User = require('../models/user');
var Settings = require('../models/settings');
var Post = require('../models/post');
var WxUser = require('../models/wx_user');
var WxRecord = require('../models/wx_record');
var async = require('async');
var debug = require('debug')('myapp:index');
var ejsExcel = require("./ejsExcel");
var fs = require("fs");
var formidable = require('formidable');
var request = require("request");
var crypto = require("crypto");

exports.userdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var user = new User(req.params.sql,req,res);
}

exports.wx_userdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var wx_user = new WxUser(req.params.sql,req,res);
}

exports.postdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var post = new Post(req.params.sql,req,res);
}

exports.wx_recorddo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var wx_record = new WxRecord(req.params.sql,req,res);
}

exports.settingsdo = function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  var settings = new Settings(req.params.sql,req,res);
}

exports.getopenid = function(req, res) {
	var code = req.query.code;
	var id = req.query.id;
	var appId = settings.AppID;
    var appSecret = settings.AppSecret;
    var url = "https://api.weixin.qq.com/sns/oauth2/access_token?grant_type=authorization_code&appid=" + appId + "&secret=" + appSecret + "&code=" + code;
    request(url,function(err,response,body){
        if(!err && response.statusCode == 200){
            if(JSON.parse(body).errcode != null){
                console.log(body);
                res.redirect(req.url);
                return false;
            }
            console.log(body);
            var openid = JSON.parse(body).openid;
            var sql = "select id from wx_user_record where type_id = 3 and wx_openid = '"+openid+"' and post_id = "+id;
            mysql.query(sql, function(err, rows) {
				if (err) return console.error(err.stack);
				if(!rows[0]){
					/*记录用户阅读行为*/
					setLog("insert into wx_user_record(wx_openid,operation_time,type_id,remark,post_id) values('"+openid+"',now(),3,'',"+id+")");
          /*获取系统设定*/
          var sql_settings = "select * from settings";
          mysql.query(sql_settings, function(err, settings) {
              if (err) return console.error(err.stack);
              /*记录微信用户积分行为*/
              var sql_score = "insert into wx_user_score(wx_openid,time,score,type_id,post_id) values('"+openid+"',now(),"+settings[0].score_read+",3,"+id+")";
              setLog(sql_score);
              /*给用户增加积分*/
              var sql_wx_user = "update wx_user set score_unused = score_unused + "+settings[0].score_read+",score_total = score_total + "+settings[0].score_read+" where openid = '" +openid+"'";
              setLog(sql_wx_user);
          });
					/*文章的阅读数+1*/
					var sql2 = "update post set read_count = read_count + 1 where id = "+id;
					mysql.query(sql2, function(err, rows) {
						if (err) return console.error(err.stack);
					});
				}
				res.redirect(settings.hosts+"/weixin_js?id="+id+"&openid="+openid);
			});	
        }
    });
}

var strat_time = new Date();

exports.weixin_js = function (req, res) {
	var id = req.query.id;
	var openid = req.query.openid;
    var timestamp = parseInt(new Date().getTime() / 1000) + '';
    var nonceStr = Math.random().toString(36).substr(2, 15);
    var appId = settings.AppID;
    var appSecret = settings.AppSecret;
    var wx_url = settings.hosts+req.url;
    console.log("wx_url:"+wx_url);
    //判断access_token和jsapi_ticket是否已经获得，并且时效在2小时(7200s)以内
    var end_time = new Date();
    var timediff=end_time.getTime()-strat_time.getTime()  //时间差的毫秒数
    //console.log(end_time + "-->" + strat_time);
    timediff = timediff/1000;
    //if(access_token == "" || jsapi_ticket == "" || Number(timediff) > 7200){
    if(1 == 1){
        console.log("first access_token");
        //1.获取access_token
        var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appSecret;
        request(url,function(err,response,body){
            if(!err && response.statusCode == 200){
                console.log("body:"+body);
                var o = JSON.parse(body);
                access_token = o.access_token;
                console.log("access_token:"+access_token);
                //2.获取jsapi_ticket
                var url_jsapi = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi';
                request(url_jsapi,function(err_jsapi,response_jsapi,body_jsapi){
                    if(!err_jsapi && response_jsapi.statusCode == 200){
                        console.log("body_jsapi:"+body_jsapi);
                        jsapi_ticket = (JSON.parse(body_jsapi)).ticket;
                        console.log("jsapi_ticket:"+jsapi_ticket);
                        strat_time = new Date();
                        var signature = sign(jsapi_ticket,nonceStr,timestamp,wx_url);
                        //var url_info = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid=oEDF2xBoerpEFGh3brZPkWfVRZZg&lang=zh_CN';
                        var url_info = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+access_token+'&next_openid=';
                        request(url_info,function(err_info,response_info,body_info){
                            if(!err_info && response_info.statusCode == 200){
                            	
                               res.render('weixin_js',{signature:signature,jsapi_ticket:jsapi_ticket,body_info:body_info,appId:appId,id:id,openid:openid});
                            }
                        });
                    }
                });
            }
        });
    }else{
        console.log("not first access_token");
        var signature = sign(jsapi_ticket,nonceStr,timestamp,wx_url);
        //var url_info = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid=oEDF2xBoerpEFGh3brZPkWfVRZZg&lang=zh_CN';
        var url_info = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+access_token+'&next_openid=';
        request(url_info,function(err_info,response_info,body_info){
            if(!err_info && response_info.statusCode == 200){
                res.render('weixin_js',{signature:signature,jsapi_ticket:jsapi_ticket,body_info:body_info});
            }
        });
    }
}

function sign(jsapi_ticket, nonceStr,timestamp,url) {
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: nonceStr,
    timestamp: timestamp,
    url: url
  };
  var string = raw(ret);
      jsSHA = require('jssha');
      shaObj = new jsSHA(string, 'TEXT');
  ret.signature = shaObj.getHash('SHA-1', 'HEX');

  console.log("jsapi_ticket=>"+jsapi_ticket);
  console.log("nonceStr=>"+nonceStr);
  console.log("timestamp=>"+timestamp);
  console.log("url=>"+url);
  console.log("ret=>"+ret.signature);
  return ret;
};

function raw(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/*记录用户行为*/
function setLog(sql){
	mysql.query(sql, function(err, info) {
		if (err) return console.error(err.stack);
		// do something
	});	
}

function getToday() {
	var myDate = new Date();
	var y = myDate.getFullYear();
	var m = (((myDate.getMonth() + 1) + "").length == 1) ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
	var d = (((myDate.getDate()) + "").length == 1) ? "0" + (myDate.getDate()) : (myDate.getDate());
	return y + "-" + m + "-" + d;
}

exports.uploadImg = function(req, res) {
    var fname = req.files.imgFile.path.replace("public\\upload\\", "").replace("public/upload/", "");
    var info = {
        "error": 0,
        "url": "/upload/"+fname
    };
    res.send(info);
}

Date.prototype.Format = function(fmt) {
		var d = this;
		var o = {
			"M+": d.getMonth() + 1, //月份
			"d+": d.getDate(), //日
			"h+": d.getHours(), //小时
			"m+": d.getMinutes(), //分
			"s+": d.getSeconds(), //秒
			"q+": Math.floor((d.getMonth() + 3) / 3), //季度
			"S" : d.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
}