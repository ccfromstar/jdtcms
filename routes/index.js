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
var Jdtuser = require('../models/jdtuser');
var Redpacket = require('../models/redpacket');
var Iconv = require('iconv-lite');

exports.userdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var user = new User(req.params.sql, req, res);
}

exports.redpacketdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var redpacket = new Redpacket(req.params.sql, req, res);
}

exports.jdtuserdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var jdtuser = new Jdtuser(req.params.sql, req, res);
}

exports.wx_userdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var wx_user = new WxUser(req.params.sql, req, res);
}

exports.postdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var post = new Post(req.params.sql, req, res);
}

exports.wx_recorddo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var wx_record = new WxRecord(req.params.sql, req, res);
}

exports.settingsdo = function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	var settings = new Settings(req.params.sql, req, res);
}

function GetDateStr(time, AddDayCount) {
	var dd = time;
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
	var y = dd.getFullYear();
	//var m = dd.getMonth()+1;//获取当前月份的日期 
	//var d = dd.getDate(); 
	var m = (((dd.getMonth() + 1) + "").length == 1) ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
	var d = (((dd.getDate()) + "").length == 1) ? "0" + (dd.getDate()) : (dd.getDate());
	var hh = dd.getHours();
	var mm = dd.getMinutes();
	var ss = dd.getSeconds();
	console.log(y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss);
	return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
}

exports.getopenid = function(req, res) {
	var code = req.query.code;
	var id = req.query.id;
	var appId = settings.AppID;
	var appSecret = settings.AppSecret;
	var url = "https://api.weixin.qq.com/sns/oauth2/access_token?grant_type=authorization_code&appid=" + appId + "&secret=" + appSecret + "&code=" + code;
	request(url, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			if (JSON.parse(body).errcode != null) {
				console.log(body);
				res.redirect(req.url);
				return false;
			}
			console.log(body);
			var openid = JSON.parse(body).openid;
			var sql = "select id from wx_user_record where type_id = 3 and wx_openid = '" + openid + "' and post_id = " + id;
			mysql.query(sql, function(err, rows) {
				if (err) return console.error(err.stack);
				if (!rows[0]) {
					/*记录用户阅读行为*/
					setLog("insert into wx_user_record(wx_openid,operation_time,type_id,remark,post_id) values('" + openid + "',now(),3,''," + id + ")");
					/*获取系统设定*/
					var sql_settings = "select * from settings";
					mysql.query(sql_settings, function(err, settings) {
						if (err) return console.error(err.stack);
						/*记录微信用户积分行为*/
						var sql_score = "insert into wx_user_score(wx_openid,time,score,type_id,post_id) values('" + openid + "',now()," + settings[0].score_read + ",3," + id + ")";
						setLog(sql_score);
						/*给用户增加积分*/
						var sql_wx_user = "update wx_user set score_unused = score_unused + " + settings[0].score_read + ",score_total = score_total + " + settings[0].score_read + " where openid = '" + openid + "'";
						setLog(sql_wx_user);
						/*给用户的建定通账户增加使用天数*/
						var sql_admin = "select * from admin where username ='" + openid + "'";
						mysql.query(sql_admin, function(err, admin) {
							if (err) return console.error(err.stack);
							if (admin[0]) {
								var d = admin[0].limited + "";
								var limited = GetDateStr(new Date(d), settings[0].day_read);
								var sql_adday = "update admin set limited = '" + limited + "' where username ='" + openid + "'";
								setLog(sql_adday);
							}
						});
					});
					/*文章的阅读数+1*/
					var sql2 = "update post set read_count = read_count + 1 where id = " + id;
					mysql.query(sql2, function(err, rows) {
						if (err) return console.error(err.stack);
					});
				}
				res.redirect(settings.hosts + "/weixin_js?id=" + id + "&openid=" + openid);
			});
		}
	});
}

var strat_time = new Date();

exports.regsuccess = function(req, res) {
	res.render("regsuccess");
}

exports.WXprobase = function(req, res) {
	var page = parseInt(req.param("p"));
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var id_min = (page - 1) * limit;
	var id_max = id_min + LIMIT;
	var sql1 = "select top " + limit + " * from dbo.project_inforbase where id not in ( select top " + id_min + " id from dbo.project_inforbase order by id desc) order by id desc";
	var sql2 = "select count(*) as count from dbo.project_inforbase";
	console.log(sql1);
	async.waterfall([function(callback) {
		request({
			encoding: null,
			url: "http://www.jdjs.com.cn/jdtcms/WXprobase.asp?p=" + sql1
		}, function(error, res, body) {
			if (!error && res.statusCode == 200) {
				var body_zh = (Iconv.decode(body, 'gb2312').toString());
				//console.log(body_zh);
				callback(null, (body_zh));
			}
		});
	}, function(result, callback) {
		request("http://www.jdjs.com.cn/jdtcms/getCount.asp?p=" + sql2, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				//输出返回的内容
				//console.log(body);
				callback(null, result, body);
			}
		});
	}], function(err, rows, result) {
		if (err) {
			console.log(err);
		} else {
			rows = rows.replace(/"/g, "“");
			var str = '[';
			var arr1 = rows.split("#");
			for (var i = 0; i < arr1.length; i++) {
				var arr2 = arr1[i].split("@");
				if (i == 0) {
					str += '{"proname":"' + arr2[0] + '","prostate":"' + arr2[1] + '","inforptime":"' + arr2[2] + '"}';
				} else {
					str += ',{"proname":"' + arr2[0] + '","prostate":"' + arr2[1] + '","inforptime":"' + arr2[2] + '"}';
				}
			}
			str += ']';

			//console.log(str);

			var total = result;

			var totalpage = Math.ceil(total / limit);
			var isFirstPage = page == 1;
			var isLastPage = ((page - 1) * limit + result.length) == total;
			/*
			var ret = {
				total: total,
				totalpage: totalpage,
				isFirstPage: isFirstPage,
				isLastPage: isLastPage,
				record: JSON.parse(str)
			};
			res.json(ret);
			*/
			res.render("WXprobase",{
				record:JSON.parse(str),
				page: page,
				total: total,
				totalpage: totalpage,
				isFirstPage: isFirstPage,
				isLastPage: isLastPage
			});
		}
	});
	
}

exports.reg = function(req, res) {
	var code = req.query.code;
	var appId = settings.AppID;
	var appSecret = settings.AppSecret;
	var url = "https://api.weixin.qq.com/sns/oauth2/access_token?grant_type=authorization_code&appid=" + appId + "&secret=" + appSecret + "&code=" + code;
	request(url, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			if (JSON.parse(body).errcode != null) {
				console.log(body);
				res.redirect(req.url);
				return false;
			}
			console.log(body);
			var openid = JSON.parse(body).openid;
			res.render("reg", {
				openid: openid
			});
		}
	});
}

exports.myinfo = function(req, res) {
	var code = req.query.code;
	var appId = settings.AppID;
	var appSecret = settings.AppSecret;
	var url = "https://api.weixin.qq.com/sns/oauth2/access_token?grant_type=authorization_code&appid=" + appId + "&secret=" + appSecret + "&code=" + code;
	request(url, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			if (JSON.parse(body).errcode != null) {
				console.log(body);
				res.redirect(req.url);
				return false;
			}
			console.log(body);
			var openid = JSON.parse(body).openid;
			/*根据openid得到未兑换的积分*/
			var sql1 = "select score_unused from wx_user where openid = '" + openid + "'";
			mysql.query(sql1, function(err, rows1) {
				if (err) return console.error(err.stack);
				/*根据openid得到账号有效期*/
				var sql2 = "select limited from admin where username = '" + openid + "'";
				mysql.query(sql2, function(err, rows2) {
					if (err) return console.error(err.stack);
					var d = "未激活";
					if (rows2[0]) {
						d = rows2[0].limited;
						d = d ? d.Format("yyyy-MM-dd hh:mm:ss") : "未激活";
					}
					/*得到所有的红包的分类*/
					var sql3 = "select * from redpacket";
					mysql.query(sql3, function(err, rows3) {
						if (err) return console.error(err.stack);
						var sql4 = "select * from settings";
						mysql.query(sql4, function(err, rows4) {
							if (err) return console.error(err.stack);
							res.render("myinfo", {
								openid: openid,
								score_unused: rows1[0].score_unused,
								limited: d,
								redpacket: rows3,
								settings: rows4
							});
						});
					});
				});
			});
		}
	});
	//res.render("myinfo");
}

exports.weixin_js = function(req, res) {
	var id = req.query.id;
	var openid = req.query.openid;
	var timestamp = parseInt(new Date().getTime() / 1000) + '';
	var nonceStr = Math.random().toString(36).substr(2, 15);
	var appId = settings.AppID;
	var appSecret = settings.AppSecret;
	var wx_url = settings.hosts + req.url;
	console.log("wx_url:" + wx_url);
	//判断access_token和jsapi_ticket是否已经获得，并且时效在2小时(7200s)以内
	var end_time = new Date();
	var timediff = end_time.getTime() - strat_time.getTime() //时间差的毫秒数
		//console.log(end_time + "-->" + strat_time);
	timediff = timediff / 1000;
	//if(access_token == "" || jsapi_ticket == "" || Number(timediff) > 7200){
	if (1 == 1) {
		console.log("first access_token");
		//1.获取access_token
		var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret;
		request(url, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				console.log("body:" + body);
				var o = JSON.parse(body);
				access_token = o.access_token;
				console.log("access_token:" + access_token);
				//2.获取jsapi_ticket
				var url_jsapi = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi';
				request(url_jsapi, function(err_jsapi, response_jsapi, body_jsapi) {
					if (!err_jsapi && response_jsapi.statusCode == 200) {
						console.log("body_jsapi:" + body_jsapi);
						jsapi_ticket = (JSON.parse(body_jsapi)).ticket;
						console.log("jsapi_ticket:" + jsapi_ticket);
						strat_time = new Date();
						var signature = sign(jsapi_ticket, nonceStr, timestamp, wx_url);
						//var url_info = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid=oEDF2xBoerpEFGh3brZPkWfVRZZg&lang=zh_CN';
						var url_info = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + access_token + '&next_openid=';
						request(url_info, function(err_info, response_info, body_info) {
							if (!err_info && response_info.statusCode == 200) {

								res.render('weixin_js', {
									signature: signature,
									jsapi_ticket: jsapi_ticket,
									body_info: body_info,
									appId: appId,
									id: id,
									openid: openid
								});
							}
						});
					}
				});
			}
		});
	} else {
		console.log("not first access_token");
		var signature = sign(jsapi_ticket, nonceStr, timestamp, wx_url);
		//var url_info = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid=oEDF2xBoerpEFGh3brZPkWfVRZZg&lang=zh_CN';
		var url_info = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token=' + access_token + '&next_openid=';
		request(url_info, function(err_info, response_info, body_info) {
			if (!err_info && response_info.statusCode == 200) {
				res.render('weixin_js', {
					signature: signature,
					jsapi_ticket: jsapi_ticket,
					body_info: body_info
				});
			}
		});
	}
}

function sign(jsapi_ticket, nonceStr, timestamp, url) {
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

	console.log("jsapi_ticket=>" + jsapi_ticket);
	console.log("nonceStr=>" + nonceStr);
	console.log("timestamp=>" + timestamp);
	console.log("url=>" + url);
	console.log("ret=>" + ret.signature);
	return ret;
};

function raw(args) {
	var keys = Object.keys(args);
	keys = keys.sort()
	var newArgs = {};
	keys.forEach(function(key) {
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
function setLog(sql) {
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
		"url": "/upload/" + fname
	};
	res.send(info);
}

exports.sendredpack = function(req, res) {
	/*发送微信红包接口测试*/
	var pingpp = require('pingpp')('sk_live_4SqPiLHKiDKGiv1SSGa9mT4G');
	pingpp.setPrivateKeyPath(__dirname + "/pem/rsa_private_key.pem");
	pingpp.redEnvelopes.create({
		order_no: '23728937938129',
		app: {
			id: "app_1qHebLGCe5COOerH"
		},
		channel: "wx_pub", //红包基于微信公众帐号，所以渠道是 wx_pub
		amount: 100, //金额在 100-20000 之间
		currency: "cny",
		subject: "Your Subject",
		body: "Your Body",
		extra: { //extra 需填入的参数请参阅[API 文档]()
			nick_name: "建定通",
			send_name: "活动"
		},
		recipient: "oh822jvVXPrv6lILL5sZBkF8tLyM", //指定用户的 open_id
		description: "Your Description"
	}, function(err, redEnvelope) {
		//YOUR CODE
		console.log(err);
		console.log(redEnvelope);
	});
}

function sign(nonce_str, mch_billno, mch_id, wxappid, send_name, re_openid, total_amount, total_num, wishing, client_ip, act_name, remark) {
	var ret = {
		nonce_str: nonce_str,
		mch_billno: mch_billno,
		mch_id: mch_id,
		wxappid: wxappid,
		send_name: send_name,
		re_openid: re_openid,
		total_amount: total_amount,
		total_num: total_num,
		wishing: wishing,
		client_ip: client_ip,
		act_name: act_name,
		remark: remark
	};
	var string = raw(ret);
	string = string + '&key=1234567890abcdefghijklmnopqrstuv';
	var crypto = require('crypto');
	return crypto.createHash('md5').update(string, 'utf8').digest('hex');
};

function raw(args) {
	var keys = Object.keys(args);
	keys = keys.sort()
	var newArgs = {};
	keys.forEach(function(key) {
		newArgs[key.toLowerCase()] = args[key];
	});

	var string = '';
	for (var k in newArgs) {
		string += '&' + k + '=' + newArgs[k];
	}
	string = string.substr(1);
	return string;
};

Date.prototype.Format = function(fmt) {
	var d = this;
	var o = {
		"M+": d.getMonth() + 1, //月份
		"d+": d.getDate(), //日
		"h+": d.getHours(), //小时
		"m+": d.getMinutes(), //分
		"s+": d.getSeconds(), //秒
		"q+": Math.floor((d.getMonth() + 3) / 3), //季度
		"S": d.getMilliseconds() //毫秒
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