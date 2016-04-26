var mysql = require('../models/db');
var debug = require('debug')('myapp:user');
var async = require('async');

RedPacket = function(action,req,res){
    switch(action){
		case "getRecord":
	  		getRecord(req,res);
	  		break;
	  	case "delRecord":
	  		delRecord(req,res);
	  		break;
	  	case "createPacket":
	  		createPacket(req,res);
	  		break;
	  	case "getPacketById":
	  		getPacketById(req,res);
	  		break;
		default:
	  		//do something
	}
}

function delRecord(req,res){
		var id = req.param("id");
		var sql = "delete from redpacket where id = " + id;
		debug(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			if(result.affectedRows == 1){
				res.send("300");
			}
		});
}

function getPacketById(req,res){
		var id = req.param("id");
		var sql = "select * from redpacket where id = " + id;
		debug(sql);
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
}

function createPacket(req,res){
		var mode = req.param("mode");
		var money = req.param("money");
		var score = req.param("score");
		var editid = req.param("editid");
		/*编辑模式*/
		if(mode == "edit"){
			var sql = "update redpacket set ";
			sql += " money = "+money+",";
			sql += " score = "+score+"";
			sql += " where id = "+editid;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if(result.affectedRows == 1){
					res.send("300");
				}
			});
		}else{
			var sql = "insert into redpacket (money,score) values ("+money+","+score+")";
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if(result.affectedRows == 1){
					res.send("300");
				}
			});
		}
}

function getRecord(req,res){
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

module.exports = RedPacket;