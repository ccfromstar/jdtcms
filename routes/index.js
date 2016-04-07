var settings = require('../settings');
var mysql = require('../models/db');
var User = require('../models/user');
var Post = require('../models/post');
var WxUser = require('../models/wx_user');
var WxRecord = require('../models/wx_record');
var async = require('async');
var debug = require('debug')('myapp:index');
var ejsExcel = require("./ejsExcel");
var fs = require("fs");
var formidable = require('formidable');
var request = require("request");

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
            var openid = JSON.parse(body).openid;
            var sql = "select id from wx_user_record where type_id = 3 and wx_openid = '"+openid+"' and post_id = "+id;
            mysql.query(sql, function(err, rows) {
				if (err) return console.error(err.stack);
				if(!rows[0]){
					/*记录用户阅读行为*/
					setLog("insert into wx_user_record(wx_openid,operation_time,type_id,remark,post_id) values('"+openid+"',now(),3,'',"+id+")");
					/*文章的阅读数+1*/
					var sql2 = "update post set read_count = read_count + 1 where id = "+id;
					mysql.query(sql2, function(err, rows) {
						if (err) return console.error(err.stack);
					});
				}
				res.redirect(settings.hosts+"/post_read.html?id="+id+"&openid="+openid);
			});	
        }
    });
}

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