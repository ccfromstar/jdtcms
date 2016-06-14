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

function rd(n,m){
    var c = m-n+1;  
    return (Math.random() * c + n).toFixed(2);
}

function sendRecord(req, res) {
	var id = req.param("id");
	var openid = req.param("openid");
	var money = req.param("money");
	var order_no = req.param("order_no");
	var money_max = req.param("money_max");
	var type_id = req.param("type_id");
	var subject = req.param("subject");
	var description = req.param("description");
	var send_name = req.param("send_name");
	var body = req.param("body");
	//var timestamp=Math.round(new Date().getTime()/1000);
	order_no = order_no + "";
	if(Number(type_id)==1){
		//随机金额红包
		var sql0 = "select * from settings";
		mysql.query(sql0, function(err, row0) {
			if (err) return console.error(err.stack);
			//生成金额
			var rnd_money = rd(Number(money),(Number(money_max)-1));
			console.log("rnd_money:"+rnd_money);
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
					amount: Number(rnd_money) * 100, //金额在 100-20000 之间
					currency: "cny",
					subject: subject,
					body: body,
					extra: { //extra 需填入的参数请参阅[API 文档]()
						nick_name: "建定通",
						send_name: send_name
					},
					recipient: openid, //指定用户的 open_id
					description: description
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
		});
	}else{
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
				subject: subject,
				body: body,
				extra: { //extra 需填入的参数请参阅[API 文档]()
					nick_name: "建定通",
					send_name: send_name
				},
				recipient: openid, //指定用户的 open_id
				description: description
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
}

function changeRecord(req, res) {
	var money = req.param("money");
	var money_max = req.param("money_max");
	var score = req.param("score");
	var openid = req.param("openid");
	var name = req.param("name");
	var type_id = req.param("type_id");
	var subject = req.param("subject");
	var description = req.param("description");
	var send_name = req.param("send_name");
	var body = req.param("body");
	var timestamp = Math.round(new Date().getTime() / 1000);
	timestamp = timestamp;
	//创建红包兑换记录表
	var sql1 = "insert into redpacket_record(openid,score,money,time,order_no,name,type_id,money_max,subject,description,send_name,body) values('" + openid + "'," + score + "," + money + ",now(),'" + timestamp + "','" + name + "'," + type_id + "," + money_max + ",'"+subject+"','"+description+"','"+send_name+"','"+body+"')";
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
	var money_max = req.param("money_max");
	var score = req.param("score");
	var editid = req.param("editid");
	var type_id = req.param("type_id");
	var state_id = req.param("state_id");
	var redname = req.param("redname");
	var sort_id = req.param("sort_id");
	
	var subject = req.param("subject");
	var description = req.param("description");
	var send_name = req.param("send_name");
	var body = req.param("body");
	/*编辑模式*/
	if (mode == "edit") {
		var sql = "update redpacket set ";
		sql += " money = " + money + ",";
		sql += " money_max = " + money_max + ",";
		sql += " state_id = " + state_id + ",";
		sql += " type_id = " + type_id + ",";
		sql += " name = '" + redname + "',";
		sql += " subject = '" + subject + "',";
		sql += " description = '" + description + "',";
		sql += " send_name = '" + send_name + "',";
		sql += " body = '" + body + "',";
		sql += " sort_id = " + sort_id + ",";
		sql += " score = " + score + "";
		sql += " where id = " + editid;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (result.affectedRows == 1) {
				res.send("300");
			}
		});
	} else {
		var sql = "insert into redpacket (money,score,state_id,type_id,name,money_max,sort_id,subject,description,send_name,body) values (" + money + "," + score + "," + state_id + "," + type_id + ",'" + redname + "'," + money_max + ","+sort_id+",'"+subject+"','"+description+"','"+send_name+"','"+body+"')";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (result.affectedRows == 1) {
				res.send("300");
			}
		});
	}
}

function GetDateStr_end(time,AddDayCount) { 
	var dd = new Date(time); 
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear(); 
  //var m = dd.getMonth()+1;//获取当前月份的日期 
  //var d = dd.getDate(); 
  var m = (((dd.getMonth()+1)+"").length==1)?"0"+(dd.getMonth()+1):(dd.getMonth()+1);
  var d = (((dd.getDate())+"").length==1)?"0"+(dd.getDate()):(dd.getDate());
  var hh = dd.getHours();
  var mm = dd.getMinutes();
  var ss = dd.getSeconds(); 
  console.log(y+"-"+m+"-"+d + " " + hh+":"+mm+":"+ss);
  return y+"-"+m+"-"+d +" " + hh+":"+mm+":"+ss; 
}

function getAllgetchangeRecord(req, res) {
	var page = parseInt(req.param("indexPage"));
	
	var openid = req.param("openid");
	var nickname = req.param("nickname");
	var name = req.param("name");
	var k_type_id = req.param("k_type_id");
	var start_time = req.param("start_time");
	var end_time = req.param("end_time");
	
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	
	var change = "";
	if(start_time != ""){
		change += " and time >= '"+start_time+"'";
	}
	if(end_time != ""){
		change += " and time <= '"+GetDateStr_end(end_time,1)+"'";
	}
	if(openid != ""){
		change += " and openid like '%"+openid+"%'";
	}
	if(nickname != ""){
		change += " and nickname like '%"+nickname+"%'";
	}
	if(name != ""){
		change += " and name like '%"+name+"%'";
	}
	if(k_type_id != ""){
		var change_type = "";
		var arr = k_type_id.split('*');
		for(var i=0;i<arr.length;i++){
			if(change_type == ""){
				change_type = " status_id = "+arr[i];
			}else{
				change_type += " or status_id = "+arr[i];
			}
		}
		change += " and ("+change_type+")";
	}
		
	var sql1 = "select * from view_redpacket_record_status where 1=1 "+change+" order by id desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from view_redpacket_record_status where 1=1 "+change;
	console.log(sql1);
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
				//console.log(result);
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
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select * from redpacket order by sort_id desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from redpacket";
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