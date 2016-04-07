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
				/*文章点赞数+1*/
				var sql2 = "update post set like_count = like_count + 1 where id = "+id;
					mysql.query(sql2, function(err, rows) {
						if (err) return console.error(err.stack);
						res.send("300");
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