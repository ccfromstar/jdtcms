var mysql = require('../models/db');
var debug = require('debug')('myapp:user');
var async = require('async');

User = function(action,req,res){
    switch(action){
		case "checkLogin":
	  		checkLogin(req,res);
	  		break;
		case "getUser":
	  		getUser(req,res);
	  		break;
	  	case "createUser":
	  		createUser(req,res);
	  		break;
	  	case "delUser":
	  		delUser(req,res);
	  		break;
	  	case "getUserById":
	  		getUserById(req,res);
	  		break;
		default:
	  		//do something
	}
}

function checkLogin(req,res){
		var uname = req.param("uname");
		var pwd = req.param("pwd");
		var sql = "select * from user where username = '" + uname + "'";
		debug(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if (!result[0]) {
				res.send("400");
				return;
			}
			if (result[0].password == pwd) {
				res.json(result[0]);
			} else {
				res.send("400");
			}
		});
}

function getUserById(req,res){
		var id = req.param("id");
		var sql = "select * from user where id = " + id;
		debug(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
}

function delUser(req,res){
		var id = req.param("id");
		var sql = "delete from user where id = " + id;
		debug(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if(result.affectedRows == 1){
				res.send("300");
			}
		});
}

function createUser(req,res){
		var mode = req.param("mode");
		var username = req.param("username");
		var password = req.param("password");
		var name = req.param("name");
		var role_basic = req.param("role_basic");
		var role_manage = req.param("role_manage");
		var role_send = req.param("role_send");
		var role_custom = req.param("role_custom");
		var role_option = req.param("role_option");
		var editid = req.param("editid");
		/*编辑模式*/
		if(mode == "edit"){
			var sql = "update user set ";
			sql += " username = '"+username+"',";
			sql += " password = '"+password+"',";
			sql += " name = '"+name+"',";
			sql += " role_basic = "+role_basic+",";
			sql += " role_manage = "+role_manage+",";
			sql += " role_send = "+role_send+",";
			sql += " role_custom = "+role_custom+",";
			sql += " role_option = "+role_option;
			sql += " where id = "+editid;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if(result.affectedRows == 1){
					res.send("300");
				}
			});
		}else{
			var sql = "insert into user (username,password,name,role_basic,role_manage,role_send,role_custom,role_option) values ('"+username+"','"+password+"','"+name+"',"+role_basic+","+role_manage+","+role_send+","+role_custom+","+role_option+")";
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if(result.affectedRows == 1){
					res.send("300");
				}
			});
		}
}

function getUser(req,res){
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 6;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT
		var sql1 = "select * from user order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from user";
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

module.exports = User;