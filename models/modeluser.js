var mysql = require('../models/db');
var debug = require('debug')('myapp:jdtuser');
var async = require('async');

User = function(action,req,res){
    switch(action){
		case "getUser":
	  		getUser(req,res);
	  		break;
	  	case "activeUser":
	  		activeUser(req,res);
	  		break;
	  	case "disactiveUser":
	  		disactiveUser(req,res);
	  		break;
		default:
	  		//do something
	}
}

function getUser(req,res){
		var page = parseInt(req.param("indexPage"));
		var LIMIT = 6;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;
		
		var name = req.param("name");
		var mobile = req.param("mobile");
		var company = req.param("company");
		var address = req.param("address");
		var job = req.param("job");
		var start_time = req.param("start_time");
		var end_time = req.param("end_time");
		
		//查询条件
		var change = "";
		if(name != ""){
			change += " and name like '%"+name+"%'";
		}
		if(mobile != ""){
			change += " and mobile like '%"+mobile+"%'";
		}
		if(company != ""){
			change += " and company like '%"+company+"%'";
		}
		if(address != ""){
			change += " and address like '%"+address+"%'";
		}
		if(job != ""){
			change += " and job like '%"+job+"%'";
		}
		if(start_time != ""){
			change += " and applytime >= '"+start_time+"'";
		}
		if(end_time != ""){
			change += " and applytime <= '"+GetDateStr_end(end_time,1)+"'";
		}
		
		var sql1 = "select * from modeladmin where 1=1 "+change+" order by id desc limit " + (page - 1) * limit + "," + limit;
		var sql2 = "select count(*) as count from modeladmin where 1=1 "+change;
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

function activeUser(req,res){
	var id = parseInt(req.param("id"));
	var username = (req.param("username"));
	/*查出初始化天数*/
	var sql1 = "select day_initial from settings";
	mysql.query(sql1, function(err, rows) {
		if (err) return console.error(err.stack);
		var iday = rows[0].day_initial;
		var limited = GetDateStr(new Date(),iday);
		var sql2 = "update modeladmin set state_id = 1,limited = '"+limited+"' where id = "+id;
		mysql.query(sql2, function(err, result) {
			if (err) return console.error(err.stack);
			//微信用户表里的active激活
			var sql_wxuser = "update wx_user set active = 1 where openid = '"+username+"'";
			setLog(sql_wxuser);
			/*插入奖罚记录表*/
			var sql_score = "insert into rp_record(openid,type_id,number,txtRemark,time) values('"+username+"',10,0,'',now())";
			setLog(sql_score);
			res.send("300");
		});
	});
}

function disactiveUser(req,res){
		var id = parseInt(req.param("id"));
		var username = (req.param("username"));
		var sql2 = "update modeladmin set state_id = 0 where id = "+id;
		mysql.query(sql2, function(err, result) {
			if (err) return console.error(err.stack);
			/*插入奖罚记录表*/
			var sql_score = "insert into rp_record(openid,type_id,number,txtRemark,time) values('"+username+"',7,0,'',now())";
			setLog(sql_score);
			res.send("300");
		});
}

/*记录微信用户行为,微信用户积分增加减少记录，微信用户信息表积分变化*/
function setLog(sql){
	mysql.query(sql, function(err, info) {
		if (err) return console.error(err.stack);
		// do something
	});	
}

module.exports = User;