var mysql = require('../models/db');
var debug = require('debug')('myapp:WxUser');
var settings = require('../settings');
var request = require("request");
var async = require('async');

var access_token = "";
var strat_time = new Date();

WxUser = function(action,req,res){
    switch(action){
		case "updateWxUser":
	  		updateWxUser(req,res);
	  		break;
		case "getWxUser":
	  		getWxUser(req,res);
	  		break;
	  	case "updateWxGroup":
	  		updateWxGroup(req,res);
	  		break;
	  	case "getUserByKey":
	  		getUserByKey(req,res);
	  		break;
	  	case "getWxGroup":
	  		getWxGroup(req,res);
	  		break;
	  	case "getUserById":
	  		getUserById(req,res);
	  		break;
	  	case "getUserByopenid":
	  		getUserByopenid(req,res);
	  		break;
	  	case "getUser":
	  		getUser(req,res);
	  		break;
	  	case "getGroup":
	  		getGroup(req,res);
	  		break;
	  	case "setUser":
	  		setUser(req,res);
	  		break;
	  	case "setGroup":
	  		setGroup(req,res);
	  		break;
	  	case "getScore":
	  		getScore(req,res);
	  		break;
	  	case "getParentScore":
	  		getParentScore(req,res);
	  		break;
	  	case "setRemark":
	  		setRemark(req,res);
	  		break;
	  	case "createAdmin":
	  		createAdmin(req,res);
	  		break;
	  	case "setRP":
	  		setRP(req,res);
	  		break;
	  	case "getRPScore":
	  		getRPScore(req,res);
	  		break;
	  	case "getAllRPScore":
	  		getAllRPScore(req,res);
	  		break;
	  	case "UpdateWxUserInfo":
	  		UpdateWxUserInfo(req,res);
	  		break;
		default:
	  		//do something
	}
}

/*奖罚发放*/
function setRP(req,res){
	var score_sel = parseInt(req.param("score_sel"));
	var score_number = parseInt(req.param("score_number"));
	var score_remark = (req.param("score_remark"));
	var openid = (req.param("openid"));
	/*插入奖罚记录表*/
	var sql1 = "insert into rp_record(openid,type_id,number,txtRemark,time) values('"+openid+"',"+score_sel+","+score_number+",'"+score_remark+"',now())";
	mysql.query(sql1, function(err, result1) {
		if (err) return console.error(err.stack);
		if(score_sel == 1){
			//奖励积分
			//生成积分规则表
			/*记录微信用户积分行为*/
			var sql_score = "insert into wx_user_score(wx_openid,time,score,type_id) values('"+openid+"',now(),"+score_number+",9)";
			setLog(sql_score);
			/*给用户增加积分*/
			var sql_wx_user = "update wx_user set score_unused = score_unused + "+score_number+",score_total = score_total + "+score_number+" where openid = '" +openid+"'";
			setLog(sql_wx_user);
		}else if(score_sel == 2){
			//惩罚积分
			//生成积分规则表
			/*记录微信用户积分行为*/
			var sql_score = "insert into wx_user_score(wx_openid,time,score,type_id) values('"+openid+"',now(),-"+score_number+",10)";
			setLog(sql_score);
			/*给用户增加积分*/
			var sql_wx_user = "update wx_user set score_unused = score_unused - "+score_number+",score_total = score_total - "+score_number+" where openid = '" +openid+"'";
			setLog(sql_wx_user);
		}else if(score_sel == 3){
			//奖励红包
			/*给用户发送红包*/
			//发送红包API
			var timestamp=Math.round(new Date().getTime()/1000);
			timestamp = timestamp + "";
			var pingpp = require('pingpp')(settings.livekey);
			pingpp.setPrivateKeyPath(__dirname + "/pem/rsa_private_key.pem");
			pingpp.redEnvelopes.create({
				order_no: timestamp,
				app: {
					id: settings.app_id
				},
				channel: "wx_pub", //红包基于微信公众帐号，所以渠道是 wx_pub
				amount: Number(score_number) * 100, //金额在 100-20000 之间
				currency: "cny",
				subject: "建定通现金红包",
				body: "感谢您长久以来对建定通的支持！",
				extra: { //extra 需填入的参数请参阅[API 文档]()
					nick_name: "建定通",
					send_name: "现金奖励"
				},
				recipient: openid, //指定用户的 open_id
				description: "感谢您长久以来对建定通的支持！"
			}, function(err, redEnvelope) {
				//YOUR CODE
				if (!err) {
					console.log(redEnvelope);
				} else {
					console.log(err);
				}
			});
		}else if(score_sel == 4){
			//奖励建定通天数
			/*给用户的建定通账户增加使用天数*/
		    var sql_admin = "select * from admin where username ='"+openid+"'";
		    mysql.query(sql_admin, function(err, admin) {
		        if (err) return console.error(err.stack);
		        if(admin[0]){
		            var d = admin[0].limited + "";
		            var limited = GetDateStr(new Date(d),score_number);
		            var sql_adday = "update admin set limited = '"+limited+"' where username ='"+openid+"'";
		            setLog(sql_adday);
		        }
		    });
		}else if(score_sel == 5){
			score_number = 0 - score_number;
			//惩罚建定通天数
			/*给用户的建定通账户减少使用天数*/
		    var sql_admin = "select * from admin where username ='"+openid+"'";
		    mysql.query(sql_admin, function(err, admin) {
		        if (err) return console.error(err.stack);
		        if(admin[0]){
		            var d = admin[0].limited + "";
		            var limited = GetDateStr(new Date(d),score_number);
		            var sql_adday = "update admin set limited = '"+limited+"' where username ='"+openid+"'";
		            setLog(sql_adday);
		        }
		    });
		}
		res.send("300");
	});
}

/*获取微信关注者列表*/
function updateWxUser(req,res){
	var timestamp = parseInt(new Date().getTime() / 1000) + '';
    var nonceStr = Math.random().toString(36).substr(2, 15);
    var appId = settings.AppID;
    var appSecret = settings.AppSecret;
    //判断access_token是否已经获得，并且时效在2小时(7200s)以内
    var end_time = new Date();
    var timediff=end_time.getTime()-strat_time.getTime()  //时间差的毫秒数
    timediff = timediff/1000;
    //if(access_token == "" || Number(timediff) > 7200){
    if(1 == 1){
        debug("first access_token");
        async.waterfall([function(callback) {
        	/*获取access_token*/
        	var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appSecret;
			request(url,function(err,response,body){
	            if(response.statusCode == 200){
	                var o = JSON.parse(body);
	                access_token = o.access_token;
	                debug("access_token:"+access_token);
	                callback(err,access_token);
	            }
	        });
		},function(access_token,callback) {
        	/*得到数据库里已获取的openid*/
        	var openidlist = "";
        	var sql = "select openid from wx_user where subscribe = 1";
        	mysql.query(sql, function(err, rows) {
				if (err) return console.error(err.stack);
				openidlist = JSON.stringify(rows);
				callback(err,access_token,openidlist);
			});

		}, function(access_token,openidlist, callback) {
			var list = [];
			var url_get = "https://api.weixin.qq.com/cgi-bin/user/get?access_token="+access_token+"&next_openid=";
			request(url_get,function(err,response,body){
	            if(response.statusCode == 200){
					var o = JSON.parse(body);
					var len = Number(o.count);
					for(var i=0;i<len;i++){
						list.push(o.data.openid[i]);
					}
					/*根据openid获取用户基本信息*/
					var count = 0;
					async.eachSeries(list, function(record, callback) {
						count += 1;
						/*如果在数据库里没有找到*/
						if(openidlist.indexOf(record) == -1){
							/*如果原来关注过，直接把subscribe设为1*/
							var _sql = "select id from wx_user where openid = '" +record+ "'";
							mysql.query(_sql, function(_err, _row) {
								if (_err) return console.error(_err.stack);
								if(_row[0]){
									var sql = 'update wx_user set subscribe = 1 where id = '+_row[0].id;
										mysql.query(sql, function(err, info) {
											if (err) return console.error(err.stack);
											if (info.affectedRows == 1) {
												callback(err);
											}
									});
								}else{
									console.log('正在获取第' + count + '个用户的信息，共有' + list.length + '个用户...');
									var url_basic = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token+"&openid="+record+"&lang=zh_CN";
									request(url_basic,function(err,response,body){
							            if(response.statusCode == 200){
							                var record = JSON.parse(body);
							                /*写入数据库*/
							                console.log('正在写入第' + count + '条数据，共有' + list.length + '条...');
							                var sql = 'insert into wx_user(openid,subscribe,nickname,sex,language,city,province,country,headimgurl,subscribe_time,unionid,remark,groupid) values("' +record.openid+',",'+record.subscribe+',"'+record.nickname+'",'+record.sex+',"'+record.language+'","'+record.city+'","'+record.province+'","'+record.country+'","'+record.headimgurl+'",'+record.subscribe_time+',"'+record.unionid+'","'+record.remark+'",'+record.groupid+');';
											mysql.query(sql, function(err, info) {
												if (err) return console.error(err.stack);
												if (info.affectedRows == 1) {
													/*用户记录插入完执行*/
													/*记录用户关注操作*/
						        					var sql1 = "insert into wx_user_record(wx_openid,operation_time,type_id,remark) values('"+record.openid+"',now(),1,'')";
						        					setLog(sql1);
						        					/*获取系统设定*/
						        					var sql_settings = "select * from settings";
						        					mysql.query(sql_settings, function(err, settings) {
														if (err) return console.error(err.stack);
														/*记录微信用户积分行为*/
						        						var sql_score = "insert into wx_user_score(wx_openid,time,score,type_id) values('"+record.openid+"',now(),"+settings[0].score_focus+",1)";
						        						setLog(sql_score);
						        						/*给用户增加积分*/
						        						var sql_wx_user = "update wx_user set score_unused = score_unused + "+settings[0].score_focus+",score_total = score_total + "+settings[0].score_focus+" where openid = '" +record.openid+"'";
						        						setLog(sql_wx_user);
													});

													callback(err);
												}
											});
							            }
							        });
								}
							});
						}else{
							/*找到了，在列表openidlist删除*/
							openidlist = openidlist.replace(record,null);
							callback(null);
						}
					}, function(err) {
						if (err) return console.error(err.stack);
						callback(err,openidlist);
					});
	            }
	        });
		},function(openidlist,callback) {
        	/*如果openid还在，用户取消了关注，需要在数据库中把subscribe设为0*/
        	var del_openid = [];
        	var o = JSON.parse(openidlist);
        	for(var i in o){
        		if(o[i].openid != "null"){
        			del_openid.push(o[i].openid);
        		}
        	}
        	async.eachSeries(del_openid, function(record, callback) {
        		/*记录用户操作*/
        		var sql1 = "insert into wx_user_record(wx_openid,operation_time,type_id,remark) values('"+record+"',now(),2,'')";
        		setLog(sql1);
				var sql = 'update wx_user set subscribe = 0 where openid = "'+record+'"';
				mysql.query(sql, function(err, info) {
					if (err) return console.error(err.stack);
					if (info.affectedRows == 1) {
						callback(err);
					}
				});			
			}, function(err) {
				if (err) return console.error(err.stack);
				callback(err);
			});
		}], function(err) {
			if(err){
			    res.send(err);
			}else{
				res.send("200");
			}
		});	
    }else{
        debug("not first access_token");
    }
}

/*同步微信用户的昵称和头像信息*/
function UpdateWxUserInfo(req,res){
	var timestamp = parseInt(new Date().getTime() / 1000) + '';
    var nonceStr = Math.random().toString(36).substr(2, 15);
    var appId = settings.AppID;
    var appSecret = settings.AppSecret;
    //判断access_token是否已经获得，并且时效在2小时(7200s)以内
    var end_time = new Date();
    var timediff=end_time.getTime()-strat_time.getTime()  //时间差的毫秒数
    timediff = timediff/1000;
    //if(access_token == "" || Number(timediff) > 7200){
    if(1 == 1){
        debug("first access_token");
        async.waterfall([function(callback) {
        	/*获取access_token*/
        	var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appSecret;
			request(url,function(err,response,body){
	            if(response.statusCode == 200){
	                var o = JSON.parse(body);
	                access_token = o.access_token;
	                debug("access_token:"+access_token);
	                callback(err,access_token);
	            }
	        });
		},function(access_token,callback) {
        	/*得到数据库里已获取的openid*/
        	var openidlist = "";
        	var sql = "select openid from wx_user where subscribe = 1";
        	mysql.query(sql, function(err, rows) {
				if (err) return console.error(err.stack);
				openidlist = (rows);
				callback(err,access_token,openidlist);
			});

		}, function(access_token,openidlist, callback) {
					var list = [];
					for(var i in openidlist){
						list.push(openidlist[i]);
					}
					/*根据openid获取用户基本信息*/
					var count = 0;
					async.eachSeries(list, function(record, callback) {
						count += 1;	
						//console.log('正在获取第' + count + '个用户的信息，共有' + list.length + '个用户...');
						var url_basic = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token+"&openid="+record.openid+"&lang=zh_CN";
						request(url_basic,function(err,response,body){
							if(response.statusCode == 200){
							    var record1 = JSON.parse(body);
							    /*同步数据库*/
							    console.log('正在同步第' + count + '条数据，共有' + list.length + '条...');
							    record1.nickname = (record1.nickname).replace(/'/g, "\\'");
							    var sql = "update wx_user set nickname = '"+record1.nickname+"',headimgurl = '"+record1.headimgurl+"' where openid = '"+record.openid+"'";
								mysql.query(sql, function(err, info) {
									if (err) return console.error(err.stack);
									if (info.affectedRows == 1) {
										callback(err);
									}
								});
							}
						});
							
					}, function(err) {
						if (err) return console.error(err.stack);
						callback(err);
					});
		}], function(err) {
			if(err){
			    res.send(err);
			}else{
				res.send("200");
			}
		});	
    }else{
        debug("not first access_token");
    }
    res.send("200");
}

/*记录微信用户行为,微信用户积分增加减少记录，微信用户信息表积分变化*/
function setLog(sql){
	mysql.query(sql, function(err, info) {
		if (err) return console.error(err.stack);
		// do something
	});	
}

/*获取微信分组*/
function updateWxGroup(req,res){
	var timestamp = parseInt(new Date().getTime() / 1000) + '';
    var nonceStr = Math.random().toString(36).substr(2, 15);
    var appId = settings.AppID;
    var appSecret = settings.AppSecret;
    //判断access_token是否已经获得，并且时效在2小时(7200s)以内
    var end_time = new Date();
    var timediff=end_time.getTime()-strat_time.getTime()  //时间差的毫秒数
    timediff = timediff/1000;
    //if(access_token == "" || Number(timediff) > 7200){
    if(1 == 1){
        debug("first access_token");
        async.waterfall([function(callback) {
        	/*获取access_token*/
        	var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appSecret;
			request(url,function(err,response,body){
	            if(response.statusCode == 200){
	                var o = JSON.parse(body);
	                access_token = o.access_token;
	                debug("access_token:"+access_token);
	                callback(err,access_token);
	            }
	        });
		},function(access_token,callback) {
        	/*得到数据库里已获取的 group_id*/
        	var groupidlist = "";
        	var sql = "select group_id from wx_group";
        	mysql.query(sql, function(err, rows) {
				if (err) return console.error(err.stack);
				groupidlist = JSON.stringify(rows);
				callback(err,access_token,groupidlist);
			});

		}, function(access_token,groupidlist, callback) {
			var list = [];
			var url_get = "https://api.weixin.qq.com/cgi-bin/groups/get?access_token="+access_token;
			request(url_get,function(err,response,body){
	            if(response.statusCode == 200){
	            	debug(body);
					var o = JSON.parse(body);
					var len = o.groups.length;
					for(var i=0;i<len;i++){
						list.push(o.groups[i]);
					}
					/*根据openid获取用户基本信息*/
					var count = 0;
					async.eachSeries(list, function(record, callback) {
						count += 1;
						/*如果在数据库里没有找到*/
						if(groupidlist.indexOf(record.id) == -1){
					        /*写入数据库*/
					        console.log('正在写入第' + count + '条数据，共有' + list.length + '条...');
					        var sql = 'insert into wx_group(group_id,group_name,group_count) values('+record.id+',"'+record.name+'",'+record.count+');';
							mysql.query(sql, function(err, info) {
								if (err) return console.error(err.stack);
								if (info.affectedRows == 1) {
									callback(err);
								}
							});
						}else{
							/*找到了，在列表groupidlist删除*/
							groupidlist = groupidlist.replace(record.id,null);
							callback(null);
						}
					}, function(err) {
						if (err) return console.error(err.stack);
						callback(err,groupidlist);
					});
	            }
	        });
		},function(groupidlist,callback) {
        	/*如果openid还在，用户取消了关注，需要在数据库中把subscribe设为0*/
        	var del_id = [];
        	var o = JSON.parse(groupidlist);
        	for(var i in o){
        		if(o[i].group_id){
        			del_id.push(o[i].group_id);
        		}
        	}
        	async.eachSeries(del_id, function(record, callback) {
				var sql = 'delete wx_group where group_id = "'+record+'"';
				mysql.query(sql, function(err, info) {
					if (err) return console.error(err.stack);
					if (info.affectedRows == 1) {
						callback(err);
					}
				});			
			}, function(err) {
				if (err) return console.error(err.stack);
				callback(err);
			});
		}], function(err) {
			if(err){
			    res.send(err);
			}else{
				res.send("200");
			}
		});	
    }else{
        debug("not first access_token");
    }
}

function getUserById(req,res){
		var id = req.param("id");
		var sql = "select * from view_user_group where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
}

function getUserByopenid(req,res){
		var id = req.param("id");
		var sql = "select * from view_user_group where openid = '" + id + "'";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
}

function setUser(req,res){
		var userid = req.param("userid");
		var id = req.param("id");
		var sql = "update wx_user set user_id = "+userid+" where id = " + id;
		var sql1 = "select name from view_user_group where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			mysql.query(sql1, function(err, rows) {
				if (err) return console.error(err.stack);
				res.json(rows[0]);
			});
		});
}

function setGroup(req,res){
	var appId = settings.AppID;
    var appSecret = settings.AppSecret;
    //1.获取access_token
    var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appSecret;
    	request(url,function(err,response,body){
            if(!err && response.statusCode == 200){
            	var o = JSON.parse(body);
                var access_token = o.access_token;
                var groupid = req.param("groupid");
				var openid = req.param("openid");
				var formData = {
					openid:openid,
					to_groupid:groupid
				};
				formData = JSON.stringify(formData);
				console.log(access_token);
				var url = "https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token="+access_token;
				request({
				    url: url,
				    method: 'POST',
				    body: formData
				}, function(err, response, body) {
				    if (!err && response.statusCode == 200) {
				    	console.log(body);
				    	/*修改wx_user*/
				    	var id = req.param("id");
						var sql = "update wx_user set groupid = "+groupid+" where id = " + id;
						var sql1 = "select group_name from view_user_group where id = " + id;
						mysql.query(sql, function(err, result) {
							if (err) return console.error(err.stack);
							mysql.query(sql1, function(err, rows) {
								if (err) return console.error(err.stack);
								res.json(rows[0]);
							});
						});
				    }
				});
            }
        });
}

function setRemark(req,res){
	var appId = settings.AppID;
    var appSecret = settings.AppSecret;
    //1.获取access_token
    var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appSecret;
    	request(url,function(err,response,body){
            if(!err && response.statusCode == 200){
            	var o = JSON.parse(body);
                var access_token = o.access_token;
                var remark = req.param("remark");
				var openid = req.param("openid");
				var formData = {
					openid:openid,
					remark:remark
				};
				formData = JSON.stringify(formData);
				console.log(access_token);
				var url = "https://api.weixin.qq.com/cgi-bin/user/info/updateremark?access_token="+access_token;
				request({
				    url: url,
				    method: 'POST',
				    body: formData
				}, function(err, response, body) {
				    if (!err && response.statusCode == 200) {
				    	console.log(body);
				    	/*修改wx_user*/
				    	var sql_update = "update wx_user set remark = '"+remark+"' where openid = '"+openid+"'";
				    	mysql.query(sql_update, function(err, rows) {
							if (err) return console.error(err.stack);
							res.send("300");
						});
				    }
				});
            }
        });
}

function getUser(req,res){
		var sql = "select id,name from user";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
}

function getGroup(req,res){
		var sql = "select group_id,group_name from wx_group";
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
}

/*获取wx_user*/
function getWxUser(req,res){
	var page = parseInt(req.param("indexPage"));
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT
	var sql1 = "select * from view_user_group where subscribe = 1 order by subscribe_time desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from view_user_group where subscribe = 1";
	debug(sql1);
	async.waterfall([function(callback) {
		mysql.query(sql1, function(err, result) {
		    if (err) return console.error(err.stack);
		    callback(null, result);
		});
	}, function(result, callback) {
		mysql.query(sql2, function(err, rows) {
		    if (err) return console.error(err.stack);
		    callback(err, rows,result);
		});
	}], function(err,rows,result) {
		if(err){
		    console.log(err);
		}else{	
		    var total = rows[0].count;
		    var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + result.length) == total;
                
		   	var ret = {
		    	total:total,
		    	totalpage:totalpage,
		    	isFirstPage:isFirstPage,
		    	isLastPage:isLastPage,
				record:result
			};
			res.json(ret);
		}
	});
}

function getScore(req,res){
	var page = parseInt(req.param("indexPage"));
	var openid = req.param("cid");
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT
	var sql1 = "select * from view_score_user_type_post where wx_openid = '"+openid+"' order by time desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from view_score_user_type_post where wx_openid = '"+openid+"'";
	debug(sql1);
	async.waterfall([function(callback) {
		mysql.query(sql1, function(err, result) {
		    if (err) return console.error(err.stack);
		    callback(null, result);
		});
	}, function(result, callback) {
		mysql.query(sql2, function(err, rows) {
		    if (err) return console.error(err.stack);
		    callback(err, rows,result);
		});
	}], function(err,rows,result) {
		if(err){
		    console.log(err);
		}else{	
		    var total = rows[0].count;
		    var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + result.length) == total;
		   	var ret = {
		    	total:total,
		    	totalpage:totalpage,
		    	isFirstPage:isFirstPage,
		    	isLastPage:isLastPage,
				record:result
			};
			res.json(ret);
		}
	});
}

function getRPScore(req,res){
	var page = parseInt(req.param("indexPage"));
	var openid = req.param("cid");
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	var sql1 = "select * from view_rp_status where openid = '"+openid+"' order by time desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from view_rp_status where openid = '"+openid+"'";
	debug(sql1);
	async.waterfall([function(callback) {
		mysql.query(sql1, function(err, result) {
		    if (err) return console.error(err.stack);
		    callback(null, result);
		});
	}, function(result, callback) {
		mysql.query(sql2, function(err, rows) {
		    if (err) return console.error(err.stack);
		    callback(err, rows,result);
		});
	}], function(err,rows,result) {
		if(err){
		    console.log(err);
		}else{	
		    var total = rows[0].count;
		    var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + result.length) == total;
		   	var ret = {
		    	total:total,
		    	totalpage:totalpage,
		    	isFirstPage:isFirstPage,
		    	isLastPage:isLastPage,
				record:result
			};
			res.json(ret);
		}
	});
}

function getAllRPScore(req,res){
	var page = parseInt(req.param("indexPage"));
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	
	var openid = req.param("openid");
	var nickname = req.param("nickname");
	var wx_group = req.param("wx_group");
	var start_time = req.param("start_time");
	var end_time = req.param("end_time");
	var k_remark = req.param("k_remark");
	var k_area = req.param("k_area");
	var wx_user = req.param("wx_user");
	var k_type_id = req.param("k_type_id");
	
	var cid = parseInt(req.param("cid"));
	var role_manage = parseInt(req.param("role_manage"));
	
	//查询条件
	var change = "";
	if(openid != ""){
		change += " and openid = '"+openid+"'";
	}
	if(nickname != ""){
		change += " and nickname like '%"+nickname+"%'";
	}
	if(wx_group != "-" && wx_group != ""){
		change += " and groupid = '"+wx_group+"'";
	}
	if(start_time != ""){
		change += " and time >= '"+start_time+"'";
	}
	if(end_time != ""){
		change += " and time <= '"+GetDateStr_end(end_time,1)+"'";
	}
	if(k_remark != ""){
		change += " and wx_remark like '%"+k_remark+"%'";
	}
	if(k_area != ""){
		change += " and (province like '%"+k_area+"%' or city like '%"+k_area+"%')";
	}
	if(wx_user != "-" && wx_user !=""){
		change += " and user_id = "+wx_user;
	}
	if(k_type_id && k_type_id != ""){
		var change_type = "";
		var arr = k_type_id.split('*');
		for(var i=0;i<arr.length;i++){
			if(change_type == ""){
				change_type = " type_id = "+arr[i];
			}else{
				change_type += " or type_id = "+arr[i];
			}
		}
		change += " and ("+change_type+")";
	}
	
	//如果没有管理员权限，只能看到自己负责的客户
	if(role_manage == 0){
		change += " and user_id = "+cid;
	}
	
	var sql1 = "select * from view_rp_status where 1=1 "+change+" order by time desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from view_rp_status where 1=1 "+change;
	debug(sql1);
	async.waterfall([function(callback) {
		mysql.query(sql1, function(err, result) {
		    if (err) return console.error(err.stack);
		    callback(null, result);
		});
	}, function(result, callback) {
		mysql.query(sql2, function(err, rows) {
		    if (err) return console.error(err.stack);
		    callback(err, rows,result);
		});
	}], function(err,rows,result) {
		if(err){
		    console.log(err);
		}else{	
		    var total = rows[0].count;
		    var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + result.length) == total;
		   	var ret = {
		    	total:total,
		    	totalpage:totalpage,
		    	isFirstPage:isFirstPage,
		    	isLastPage:isLastPage,
				record:result
			};
			res.json(ret);
		}
	});
}


function GetDateStr(time,AddDayCount) { 
	var dd = time; 
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


function getParentScore(req,res){
	var page = parseInt(req.param("indexPage"));
	var openid = req.param("openid");
	var nickname = req.param("nickname");
	var wx_group = req.param("wx_group");
	var start_time = req.param("start_time");
	var end_time = req.param("end_time");
	var k_remark = req.param("k_remark");
	var k_area = req.param("k_area");
	var wx_user = req.param("wx_user");
	var k_type_id = req.param("k_type_id");
	var cid = parseInt(req.param("cid"));
	var role_manage = parseInt(req.param("role_manage"));
	
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT;
	
	//查询条件
	var change = "";
	if(openid != ""){
		change += " and wx_openid = '"+openid+"'";
	}
	if(nickname != ""){
		change += " and nickname like '%"+nickname+"%'";
	}
	if(wx_group != "-" && wx_group != ""){
		change += " and groupid = '"+wx_group+"'";
	}
	if(start_time != ""){
		change += " and time >= '"+start_time+"'";
	}
	if(end_time != ""){
		change += " and time <= '"+GetDateStr_end(end_time,1)+"'";
	}
	if(k_remark != ""){
		change += " and wx_remark like '%"+k_remark+"%'";
	}
	if(k_area != ""){
		change += " and (province like '%"+k_area+"%' or city like '%"+k_area+"%')";
	}
	if(wx_user != "-" && wx_user !=""){
		change += " and user_id = "+wx_user;
	}
	if(k_type_id != ""){
		var change_type = "";
		var arr = k_type_id.split('*');
		for(var i=0;i<arr.length;i++){
			if(change_type == ""){
				change_type = " type_id = "+arr[i];
			}else{
				change_type += " or type_id = "+arr[i];
			}
		}
		change += " and ("+change_type+")";
	}
	//如果没有管理员权限，只能看到自己负责的客户
	if(role_manage == 0){
		change += " and user_id = "+cid;
	}
	
	var sql1 = "select * from view_score_user_type_post where (type_id = 1 or type_id = 3 or type_id = 4 or type_id = 5 or type_id = 6) "+change+" order by time desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select type_id from view_score_user_type_post where (type_id = 1 or type_id = 3 or type_id = 4 or type_id = 5 or type_id = 6) "+change;
	var sql3 = "select * from settings";
	console.log(sql1);
	async.waterfall([function(callback) {
		mysql.query(sql1, function(err, result) {
		    if (err) return console.error(err.stack);
		    callback(null, result);
		});
	}, function(result, callback) {
		mysql.query(sql2, function(err, rows) {
		    if (err) return console.error(err.stack);
		    callback(err, rows,result);
		});
	}, function(rows,result, callback) {
		mysql.query(sql3, function(err, settings) {
		    if (err) return console.error(err.stack);
		    callback(err, rows,result,settings);
		});
	}], function(err,rows,result,settings) {
		if(err){
		    console.log(err);
		}else{	
			console.log(rows);
			var count = 0;
			for(var i in rows){
				count += 1;
			}
		    var total = count;
		    var totalpage = Math.ceil(total/limit);
            var isFirstPage = page == 1 ;
            var isLastPage = ((page -1) * limit + result.length) == total;
            var total_score = 0; /*提成积分总计*/
            /*计算提成积分*/
            for(var i in result){
            	if(result[i].type_id == 1){
            		result[i].score_1 = settings[0].score_admin_focus;
            		//total_score += settings[0].score_admin_focus;
            	}else if(result[i].type_id == 3){
            		result[i].score_1 = settings[0].score_admin_read;
            		//total_score += settings[0].score_admin_read;
            	}else if(result[i].type_id == 4){
            		result[i].score_1 = settings[0].score_admin_like;
            		//total_score += settings[0].score_admin_like;
            	}else if(result[i].type_id == 5 || result[i].type_id == 6){
            		result[i].score_1 = settings[0].score_admin_transpond;
            		//total_score += settings[0].score_admin_transpond;
            	}
            }
            for(var i in rows){
            	if(rows[i].type_id == 1){
            		//result[i].score_1 = settings[0].score_admin_focus;
            		total_score += settings[0].score_admin_focus;
            	}else if(rows[i].type_id == 3){
            		//result[i].score_1 = settings[0].score_admin_read;
            		total_score += settings[0].score_admin_read;
            	}else if(rows[i].type_id == 4){
            		//result[i].score_1 = settings[0].score_admin_like;
            		total_score += settings[0].score_admin_like;
            	}else if(rows[i].type_id == 5 || rows[i].type_id == 6){
            		//result[i].score_1 = settings[0].score_admin_transpond;
            		total_score += settings[0].score_admin_transpond;
            	}
            }
		   	var ret = {
		    	total:total,
		    	totalpage:totalpage,
		    	isFirstPage:isFirstPage,
		    	isLastPage:isLastPage,
				record:result,
				total_score:total_score
			};
			res.json(ret);
		}
	});
}

/*获取wx_group*/
function getWxGroup(req,res){
	var sql = "select * from wx_group where group_id != 1";
	mysql.query(sql, function(err, result) {
		if (err) return console.error(err.stack);
		res.json(result);
	});
}

/*申请建定通账号*/
function createAdmin(req,res){
	var name = req.param("name");
	var mobile = req.param("mobile");
	var company = req.param("company");
	var address = req.param("address");
	var job = req.param("job");
	var openid = req.param("openid");
	var sql1 = "select id from admin where username = '"+openid+"'";
	var sql2 = "insert into admin (name,mobile,company,address,job,username,password) values('"+name+"','"+mobile+"','"+company+"','"+address+"','"+job+"','"+openid+"','"+openid+"')";
	mysql.query(sql1, function(err, result) {
		if (err) return console.error(err.stack);
		if(result[0]){
			res.send("400");
		}else{
			mysql.query(sql2, function(err, rows) {
		        if (err) return console.error(err.stack);
		        res.send("300");
		    });
		}
	});
}


/*组合查询*/
function getUserByKey(req,res){
		var page = parseInt(req.param("indexPage"));
		var openid = req.param("openid");
		var nickname = req.param("nickname");
		var wx_group = req.param("wx_group");
		var start_time = req.param("start_time");
		var end_time = req.param("end_time");
		var k_remark = req.param("k_remark");
		var k_area = req.param("k_area");
		var wx_user = req.param("wx_user");
		
		var score_unused1 = Number(req.param("score_unused1"));
		var score_unused2 = Number(req.param("score_unused2"));
		var score_total1 = Number(req.param("score_total1"));
		var score_total2 = Number(req.param("score_total2"));
		
		var cid = parseInt(req.param("cid"));
		var role_manage = parseInt(req.param("role_manage"));
		
		var LIMIT = 20;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;
		
		//查询条件
		var change = "";
		if(openid != ""){
			change += " and openid = '"+openid+"'";
		}
		if(nickname != ""){
			change += " and nickname like '%"+nickname+"%'";
		}
		if(wx_group != "-" && wx_group != ""){
			change += " and groupid = '"+wx_group+"'";
		}
		var timestamp_start = Date.parse(new Date(start_time));
		timestamp_start = timestamp_start / 1000;
		if(start_time != ""){
			change += " and subscribe_time >= '"+timestamp_start+"'";
		}
		var timestamp_end = Date.parse(new Date(GetDateStr_end(end_time,1)));
		timestamp_end = timestamp_end / 1000;
		if(end_time != ""){
			change += " and subscribe_time <= '"+timestamp_end+"'";
		}
		if(k_remark != ""){
			change += " and remark like '%"+k_remark+"%'";
		}
		if(k_area != ""){
			change += " and (province like '%"+k_area+"%' or city like '%"+k_area+"%')";
		}
		if(wx_user != "-" && wx_user !=""){
			change += " and user_id = "+wx_user;
		}
		if(score_unused1 !=0 || score_unused2 !=0){
			change += " and score_unused >= "+score_unused1+" and score_unused <= "+score_unused2;
		}
		if(score_total1 !=0 || score_total2 !=0){
			change += " and score_total >= "+score_total1+" and score_total <= "+score_total2;
		}
		
		//如果没有管理员权限，只能看到自己负责的客户
		if(role_manage == 0){
			change += " and user_id = "+cid;
		}
		
		var sql1 = "select * from view_user_group where subscribe = 1 "+change+" order by subscribe_time desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from view_user_group where subscribe = 1 "+change;
		
		console.log(sql1);
		
		async.waterfall([function(callback) {
		    mysql.query(sql1, function(err, result) {
		        if (err) return console.error(err.stack);
		        callback(null, result);
		    });
		}, function(result, callback) {
		    mysql.query(sql2, function(err, rows) {
		       if (err) return console.error(err.stack);
		        callback(err, rows,result);
		    });
		}], function(err,rows,result) {
		    if(err){
		    	console.log(err);
		    }else{
		    	var total = rows[0].count;
		    	var totalpage = Math.ceil(total/limit);
                var isFirstPage = page == 1 ;
                var isLastPage = ((page -1) * limit + result.length) == total;
                
		    	var ret = {
		    		total:total,
		    		totalpage:totalpage,
		    		isFirstPage:isFirstPage,
		    		isLastPage:isLastPage,
					record:result
				};
				res.json(ret);
			}
		});
}

module.exports = WxUser;