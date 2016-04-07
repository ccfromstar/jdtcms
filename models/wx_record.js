var mysql = require('../models/db');
var debug = require('debug')('myapp:WxUser');
var settings = require('../settings');
var request = require("request");
var async = require('async');

var access_token = "";
var strat_time = new Date();

WxRecord = function(action,req,res){
    switch(action){
		case "getRecord":
	  		getRecord(req,res);
	  		break;
		default:
	  		//do something
	}
}

/*获取view_record_user_type*/
function getRecord(req,res){
	var page = parseInt(req.param("indexPage"));
	var LIMIT = 20;
	page = (page && page > 0) ? page : 1;
	var limit = (limit && limit > 0) ? limit : LIMIT
	var sql1 = "select * from view_record_user_type order by operation_time desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from view_record_user_type";
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


module.exports = WxRecord;