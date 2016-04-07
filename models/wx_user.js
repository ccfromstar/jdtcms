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
		default:
	  		//do something
	}
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

/*获取wx_group*/
function getWxGroup(req,res){
	var sql = "select * from wx_group where group_id != 1";
	mysql.query(sql, function(err, result) {
		if (err) return console.error(err.stack);
		res.json(result);
	});
}

/*按昵称查询*/
function getUserByKey(req,res){
		var key = req.param("key");
		var groupid = req.param("groupid");
		var page = parseInt(req.param("indexPage"));
		var cid = parseInt(req.param("cid"));
		var role = req.param("role");
		var LIMIT = 20;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;
		var sql1 = "select * from view_user_group where subscribe = 1 and nickname like '%"+key+"%' ";
		var sql2 = "select count(*) as count from view_user_group where subscribe = 1 and nickname like '%"+key+"%'";
		if(groupid){
			sql1 += " and groupid = "+groupid;
			sql2 += " and groupid = "+groupid;
		}
		sql1 += " order by subscribe_time desc limit " + (page - 1) * limit + "," + limit;
		
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