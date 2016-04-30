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
	  	case "getRecordById":
	  		getRecordById(req,res);
	  		break;
	  	case "setRemark":
	  		setRemark(req,res);
	  		break;
		default:
	  		//do something
	}
}

function setRemark(req,res){
		var remark = req.param("remark");
		var id = req.param("id");
		var sql = "update wx_user_record set remark = '"+remark+"' where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.send("300");
		});
}

function getRecordById(req,res){
		var id = req.param("id");
		var sql = "select * from view_record_user_type_post where id = " + id;
		mysql.query(sql, function(err, result) {
			if (err) return console.error(err.stack);
			res.json(result);
		});
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

/*获取view_record_user_type*/
function getRecord(req,res){
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
		change += " and operation_time >= '"+start_time+"'";
	}
	if(end_time != ""){
		change += " and operation_time <= '"+GetDateStr_end(end_time,1)+"'";
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
	
	var sql1 = "select * from view_record_user_type_post where 1=1 "+change+" order by operation_time desc limit " + (page - 1) * limit + "," + limit;
	var sql2 = "select count(*) as count from view_record_user_type_post where 1=1 "+change;
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


module.exports = WxRecord;