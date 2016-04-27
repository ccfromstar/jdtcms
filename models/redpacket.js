var mysql = require('../models/db');
var debug = require('debug')('myapp:user');
var async = require('async');
var settings = require('../settings');
var fs = require("fs") ;

RedPacket = function(action, req, res) {
	switch (action) {
		case "getRecord":
			getRecord(req, res);
			break;
		case "delRecord":
			delRecord(req, res);
			break;
		case "createPacket":
			createPacket(req, res);
			break;
		case "getPacketById":
			getPacketById(req, res);
			break;
		case "changeRecord":
			changeRecord(req, res);
			break;
		case "getchangeRecord":
			getchangeRecord(req, res);
			break;
		case "getAllgetchangeRecord":
			getAllgetchangeRecord(req, res);
			break;
		case "backRecord":
			backRecord(req, res);
			break;
		case "sendRecord":
			sendRecord(req, res);
			break;
		case "getXls":
			getXls(req, res);
			break;
		default:
			//do something
	}
}

function getXls(req, res) {
	var sql1 = "select openid from wx_user where isNew = 1";
	mysql.query(sql1, function(err, rows1) {
		if (err) return console.error(err.stack);
		var sql2 = "update wx_user set isNew = 0 where isNew = 1";
		mysql.query(sql2, function(err, result2) {
			if (err) return console.error(err.stack);
			var txt = settings.AppID+"\r\n";
			for(var i in rows1){
				txt += rows1[i].openid + "\r\n";
			}
			if(rows1[0]){
				//写入文件
				fs.writeFile('public/txt/openlist.txt', txt, function(err) {
					if (err) throw err;
					console.log("File Saved !"); //文件被保存
					res.send("300");
				});
			}else{
				res.send("300");
			}
		});
	});
}

function backRecord(req, res) {
	var id = req.param("id");
	var openid = req.param("openid");
	var score = req.param("score");
	var money = req.param("money");
	//兑换记录状态变为兑换失败
	var sql1 = "update redpacket_record set status_id = 3 where id = " + id;
	mysql.query(sql1, function(err, result1) {
		if (err) return console.error(err.stack);
		/*退还用户表中对应的积分*/
		var sql2 = "update wx_user set score_unused = score_unused + " + score + " where openid = '" + openid + "'";
		mysql.query(sql2, function(err, result2) {
			if (err) return console.error(err.stack);
			/*生成积分记录表*/
			var sql3 = "insert into wx_user_score(wx_openid,score,type_id,time,rp_money) values('" + openid + "'," + score + ",8,now()," + money + ")";
			mysql.query(sql3, function(err, result3) {
				if (err) return console.error(err.stack);
				res.send("300");
			});
		});
	});
}

function sendRecord(req, res) {
	var id = req.param("id");
	var openid = req.param("openid");
	var money = req.param("money");
	var order_no = req.param("order_no");
	//var timestamp=Math.round(new Date().getTime()/1000);
	order_no = order_no + "";
	//兑换记录状态变为已发放
	var sql1 = "update redpacket_record set status_id = 2 where id = " + id;
	mysql.query(sql1, function(err, result1) {
		if (err) return console.error(err.stack);
		//发送红包API
		var pingpp = require('pingpp')(settings.livekey);
		pingpp.setPrivateKeyPath(__dirname + "/pem/rsa_private_key.pem");
		pingpp.redEnvelopes.create({
			order_no: order_no,
			app: {
				id: settings.app_id
			},
			channel: "wx_pub", //红包基于微信公众帐号，所以渠道是 wx_pub
			amount: Number(money) * 100, //金额在 100-20000 之间
			currency: "cny",
			subject: "建定通现金红包",
			body: "感谢您长久以来对建定通的支持！",
			extra: { //extra 需填入的参数请参阅[API 文档]()
				nick_name: "建定通",
				send_name: "积分兑换"
			},
			recipient: openid, //指定用户的 open_id
			description: "感谢您长久以来对建定通的支持！"
		}, function(err, redEnvelope) {
			//YOUR CODE
			if (!err) {
				console.log(redEnvelope);
				res.send("300");
			} else {
				console.log(err);
			}
		});
	});
}

function changeRecord(req, res) {
	var money = req.param("money");
	var score = req.param("score");
	var openid = req.param("openid");
	var timestamp = Math.round(new Date().getTime() / 1000);
	timestamp = timestamp;
	//创建红包兑换记录表
	var sql1 = "insert into redpacket_record(openid,score,money,time,order_no) values('" + openid + "'," + score + "," + money + ",now(),'" + timestamp + "')";
	mysql.query(sql1, function(err, result) {
		if (err) return console.error(err.stack);
		/*扣除用户表中对应的积分*/
		var sql2 = "update wx_user set score_unused = score_unused - " + score + " where openid = '" + openid + "'";
		mysql.query(sql2, function(err, result2) {
			if (err) return console.error(err.stack);
			/*生成积分记录表*/
			var sql3 = "insert into wx_user_score(wx_openid,score,type_id,time,rp_money) values('" + openid + "',-" + score + ",7,now()," + money + ")";
			mysql.query(sql3, function(err, result3) {
				if (err) return console.error(err.stack);
				res.send("300");
			});
		});
	});
}

function getchangeRecord(req, res) {
	var openid = req.param("openid");
	var sql1 = "select * from view_redpacket_record_status where openid = '" + openid + "' order by id desc";
	mysql.query(sql1, function(err, rows) {
		if (err) return console.error(err.stack);
		res.json(rows);
	});
}

function delRecord(req, res) {
	var id = req.param("id");
	var sql = "delete from redpacket where id = " + id;
	debug(sql);
	mysql.query(sql, function(err, result) {
		if (err) return console.error(err.stack);
		if (result.affectedRows == 1) {
			res.send("300");
		}
	});
}

function getPacketById(req, res) {
	var id = req.param("id");
	var sql = "select * from redpacket where id = " + id;
	debug(sql);
	mysql.query(sql, function(err, result) {
		if (err) return console.error(err.stack);
		res.json(result);
	});
}

function createPacket(req, res) {
	var mode = req.param("mode");
	var money = req.param("money");
	var score = req.param("score");
	var editid = req.param("editid");
	/*编辑模式*/
	if (mode == "edit") {
		var sql = "update redpacket set ";
		sql += " money = " + money + ",";
		sql += " score = " + score + "";
		sql += " where id = " + editid;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else {
		var sql = "insert into redpacket (money,score) values (" + money + "," + score + ")";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (result.affectedRows == 1) {
				res.send("300");
			}
		});
	}
}

function getAllgetchangeRecord(req, res) {
	var page = parseInt(req.param("indexPage"));
	var LIMIT = 6;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select * from view_redpacket_record_status order by id desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from view_redpacket_record_status";
	debug(sql1);
	async.waterfall([function(callback) {
		mysql.query(sql1, function(err, result) {
			if (err) return console.error(err.stack);
			callback(null, result);
		});
	}, function(result, callback) {
		mysql.query(sql2, function(err, rows) {
			if (err) return console.error(err.stack);
			callback(err, rows, result);
		});
	}], function(err, rows, result) {
		if (err) {
			console.log(err);
		} else {

			var total = rows[0].count;
			var totalpage = Math.ceil(total / limit);
			var isFirstPage = page == 1;
			var isLastPage = ((page - 1) * limit + result.length) == total;

			var ret = {
				total: total,
				totalpage: totalpage,
				isFirstPage: isFirstPage,
				isLastPage: isLastPage,
				record: result
			};
			res.json(ret);
		}
	});
}

function getRecord(req, res) {
	var page = parseInt(req.param("indexPage"));
	var LIMIT = 6;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select * from redpacket order by id desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from redpacket";
	debug(sql1);
	async.waterfall([function(callback) {
		mysql.query(sql1, function(err, result) {
			if (err) return console.error(err.stack);
			callback(null, result);
		});
	}, function(result, callback) {
		mysql.query(sql2, function(err, rows) {
			if (err) return console.error(err.stack);
			callback(err, rows, result);
		});
	}], function(err, rows, result) {
		if (err) {
			console.log(err);
		} else {

			var total = rows[0].count;
			var totalpage = Math.ceil(total / limit);
			var isFirstPage = page == 1;
			var isLastPage = ((page - 1) * limit + result.length) == total;

			var ret = {
				total: total,
				totalpage: totalpage,
				isFirstPage: isFirstPage,
				isLastPage: isLastPage,
				record: result
			};
			res.json(ret);
		}
	});
}

module.exports = RedPacket;