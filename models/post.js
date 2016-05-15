var mysql = require('../models/db');
var debug = require('debug')('myapp:post');
var async = require('async');

Post = function(action,req,res){
    switch(action){
		case "getPost":
	  		getPost(req,res);
	  		break;
	  	case "createPost":
	  		createPost(req,res);
	  		break;
	  	case "getPostById":
	  		getPostById(req,res);
	  		break;
	  	case "delPost":
	  		delPost(req,res);
	  		break;
	  	case "getPostById":
	  		getPostById(req,res);
	  		break;
	  	case "setPost":
	  		setPost(req,res);
	  		break;
	  	case "shareToFriend":
	  		shareToFriend(req,res);
	  		break;
	  	case "shareToCricle":
	  		shareToCricle(req,res);
	  		break;
		default:
	  		//do something
	}
}

function getPost(req,res){
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 6;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT
		var sql1 = "select * from post order by created_at desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from post";
		debug(sql1);
		async.waterfall([function(callback) {
		    mysql.query(sql1, function(err, result) {
		        if (err) return console.error(err.stack);
		        for(var i in result){
		        	result[i].created_at = (result[i].created_at).Format("yyyy-MM-dd hh:mm:ss");
		        }
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

function createPost(req,res){
		var mode = req.param("mode");
		var title = req.param("title");
		var post = req.param("post");
		var editid = req.param("editid");
		/*对单引号进行转义*/
		title = title.replace(/'/g, "\\'");
		post = post.replace(/'/g, "\\'");
		/*编辑模式*/
		if(mode == "edit"){
			var sql = "update post set ";
			sql += " title = '"+title+"',";
			sql += " post = '"+post+"'";
			sql += " where id = "+editid;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if(result.affectedRows == 1){
					res.send("300");
				}
			});
		}else{
			var sql = "insert into post (title,post,created_at) values ('"+title+"','"+post+"',now())";
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if(result.affectedRows == 1){
					res.send("300");
				}
			});
		}
}

function getPostById(req,res){
		var id = req.param("id");
		var sql = "select * from post where id = " + id;
		debug(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
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

function setPost(req,res){
		var id = req.param("id");
		var openid = req.param("openid");
		var sql = "select id from wx_user_record where type_id = 4 and wx_openid = '"+openid+"' and post_id = "+id;
		mysql.query(sql, function(err, rows) {
			if (err) return console.error(err.stack);
			if(rows[0]){
				res.send("400");
			}else{
				setLog("insert into wx_user_record(wx_openid,operation_time,type_id,remark,post_id) values('"+openid+"',now(),4,'',"+id+")");
				 /*获取系统设定*/
		          var sql_settings = "select * from settings";
		          mysql.query(sql_settings, function(err, settings) {
		              if (err) return console.error(err.stack);
		              /*记录微信用户积分行为*/
		              var sql_score = "insert into wx_user_score(wx_openid,time,score,type_id,post_id) values('"+openid+"',now(),"+settings[0].score_like+",4,"+id+")";
		              setLog(sql_score);
		              /*给用户增加积分*/
		              var sql_wx_user = "update wx_user set score_unused = score_unused + "+settings[0].score_like+",score_total = score_total + "+settings[0].score_like+" where openid = '" +openid+"'";
		              setLog(sql_wx_user);
		              /*给用户的建定通账户增加使用天数*/
		              var sql_admin = "select * from admin where username ='"+openid+"'";
		              mysql.query(sql_admin, function(err, admin) {
		                if (err) return console.error(err.stack);
		                if(admin[0]){
		                    var d = admin[0].limited + "";
		                    var limited = GetDateStr(new Date(d),settings[0].day_like);
		                    var sql_adday = "update admin set limited = '"+limited+"' where username ='"+openid+"'";
		                    setLog(sql_adday);
		                }
		              });
		          });
				/*文章点赞数+1*/
				var sql2 = "update post set like_count = like_count + 1 where id = "+id;
					mysql.query(sql2, function(err, rows) {
						if (err) return console.error(err.stack);
						res.send("300");
				});
			}
		});	
}

function shareToFriend(req,res){
		var id = req.param("id");
		var openid = req.param("openid");
		var obj = {
			name:'shareToFriend'
		};
		var sql = "select id from wx_user_record where type_id = 5 and wx_openid = '"+openid+"' and post_id = "+id;
		mysql.query(sql, function(err, rows) {
			if (err) return console.error(err.stack);
			if(rows[0]){
				obj.hasShared = 1;
				res.json(obj);
			}else{
				obj.hasShared = 0;
				/*判断用户是否关注了公众号*/
				var sql2 = "select * from wx_user where openid = '"+openid+"'";
				mysql.query(sql2, function(err, rows2) {
					if (err) return console.error(err.stack);
					if(rows2[0]){
						obj.hasFocus = 1;
						//判断是否是取消关注了
						if(rows2[0].subscribe == 1){
							obj.hasCancelFocus = 0;
						}else{
							obj.hasCancelFocus = 1;
						}
						//判断账号是否异常
						if(rows2[0].state_id == 1){
							obj.hasCatch = 0;
							setLog("insert into wx_user_record(wx_openid,operation_time,type_id,remark,post_id) values('"+openid+"',now(),5,'',"+id+")");
							/*获取系统设定*/
					          var sql_settings = "select * from settings";
					          mysql.query(sql_settings, function(err, settings) {
					              if (err) return console.error(err.stack);
					              obj.score = settings[0].score_transpond;
					              obj.day = settings[0].day_transpond;
					              /*记录微信用户积分行为*/
					              var sql_score = "insert into wx_user_score(wx_openid,time,score,type_id,post_id) values('"+openid+"',now(),"+settings[0].score_transpond+",5,"+id+")";
					              setLog(sql_score);
					              /*给用户增加积分*/
					              var sql_wx_user = "update wx_user set score_unused = score_unused + "+settings[0].score_transpond+",score_total = score_total + "+settings[0].score_transpond+" where openid = '" +openid+"'";
					              setLog(sql_wx_user);
					              /*给用户的建定通账户增加使用天数*/
					              var sql_admin = "select * from admin where username ='"+openid+"' and state_id = 1";
					              mysql.query(sql_admin, function(err, admin) {
					                if (err) return console.error(err.stack);
					                if(admin[0]){
					                    var d = admin[0].limited + "";
					                    var limited = GetDateStr(new Date(d),settings[0].day_transpond);
					                    var sql_adday = "update admin set limited = '"+limited+"' where username ='"+openid+"'";
					                    setLog(sql_adday);
					                    obj.ActivedJDT = 1;
					                    res.json(obj);
					                }else{
					                	obj.ActivedJDT = 0;
					              		res.json(obj);
					                }
					              });	
					          });
						}else{
							obj.hasCatch = 1;
							res.json(obj);
						}
					}else{
						obj.hasFocus = 0;
						res.json(obj);
					}
				});	
			}
			
		});	
}

function shareToCricle(req,res){
		var id = req.param("id");
		var openid = req.param("openid");
		var obj = {
			name:'shareToFriend'
		};
		var sql = "select id from wx_user_record where type_id = 6 and wx_openid = '"+openid+"' and post_id = "+id;
		mysql.query(sql, function(err, rows) {
			if (err) return console.error(err.stack);
			if(rows[0]){
				obj.hasShared = 1;
				res.json(obj);
			}else{
				obj.hasShared = 0;
				/*判断用户是否关注了公众号*/
				var sql2 = "select * from wx_user where openid = '"+openid+"'";
				mysql.query(sql2, function(err, rows2) {
					if (err) return console.error(err.stack);
					if(rows2[0]){
						obj.hasFocus = 1;
						//判断是否是取消关注了
						if(rows2[0].subscribe == 1){
							obj.hasCancelFocus = 0;
						}else{
							obj.hasCancelFocus = 1;
						}
						//判断账号是否异常
						if(rows2[0].state_id == 1){
							obj.hasCatch = 0;
							setLog("insert into wx_user_record(wx_openid,operation_time,type_id,remark,post_id) values('"+openid+"',now(),6,'',"+id+")");
							/*获取系统设定*/
					          var sql_settings = "select * from settings";
					          mysql.query(sql_settings, function(err, settings) {
					              if (err) return console.error(err.stack);
					              obj.score = settings[0].score_share;
					              obj.day = settings[0].day_share;
					              /*记录微信用户积分行为*/
					              var sql_score = "insert into wx_user_score(wx_openid,time,score,type_id,post_id) values('"+openid+"',now(),"+settings[0].score_share+",6,"+id+")";
					              setLog(sql_score);
					              /*给用户增加积分*/
					              var sql_wx_user = "update wx_user set score_unused = score_unused + "+settings[0].score_share+",score_total = score_total + "+settings[0].score_share+" where openid = '" +openid+"'";
					              setLog(sql_wx_user);
					              /*给用户的建定通账户增加使用天数*/
					              var sql_admin = "select * from admin where username ='"+openid+"' and state_id = 1";
					              mysql.query(sql_admin, function(err, admin) {
					                if (err) return console.error(err.stack);
					                if(admin[0]){
					                    var d = admin[0].limited + "";
					                    var limited = GetDateStr(new Date(d),settings[0].day_share);
					                    var sql_adday = "update admin set limited = '"+limited+"' where username ='"+openid+"'";
					                    setLog(sql_adday);
					                    obj.ActivedJDT = 1;
					                    res.json(obj);
					                }else{
					                	obj.ActivedJDT = 0;
					              		res.json(obj);
					                }
					              });
					          });	
						}else{
							obj.hasCatch = 1;
							res.json(obj);
						}
					}else{
						obj.hasFocus = 0;
						res.json(obj);
					}
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

function delPost(req,res){
		var id = req.param("id");
		var sql = "delete from post where id = " + id;
		debug(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if(result.affectedRows == 1){
				res.send("300");
			}
		});
}

function getPostById(req,res){
		var id = req.param("id");
		var sql = "select * from post where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
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

module.exports = Post;