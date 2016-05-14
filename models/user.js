var mysql = require('../models/db');
var debug = require('debug')('myapp:user');
var async = require('async');
var request = require("request");
var Iconv = require('iconv-lite');

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
	  	case "getMeeting":
	  		getMeeting(req,res);
	  		break;
	  	case "changePwd":
	  		changePwd(req,res);
	  		break;
	  	case "updateMeeting":
	  		updateMeeting(req,res);
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

function changePwd(req,res){
	var oldpwd = req.param("oldpwd");
	var newpwd = req.param("newpwd");
	var id = req.param("id");
	var sql1 = "select * from user where id = "+ id+" and password = '"+oldpwd+"'";
	mysql.query(sql1, function(err, result) {
		if (err) return console.error(err.stack);
		if (!result[0]) {
			res.send("400");
			return;
		}
		var sql2  = "update user set password = '"+newpwd+"' where id  = " + id;
		mysql.query(sql2, function(err, result2) {
			if (err) return console.error(err.stack);
			res.send("300");
		});
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

function updateMeeting(req,res){
	var meetingid = req.param("meetingid");
	var w_remark = req.param("w_remark");
	var w_state_id = req.param("w_state_id");
	var sql1 = "update dbo.Meeting_signup set state_id = "+w_state_id+",remark='"+w_remark+"' where id="+meetingid;
	console.log(sql1);
			request({
			    encoding: null,
			    url: "http://www.jdjs.com.cn/jdtcms/update.asp?p="+sql1
			}, function(error, res1, body) {
			    if (!error && res1.statusCode == 200) {
			    	console.log("success");
			        res.send("300");
			    }
			});
}

function getMeeting(req,res){
		var page = parseInt(req.param("indexPage"));
		var meetingname = req.param("meetingname");
		var company = req.param("company");
		var start_time = req.param("start_time");
		var end_time = req.param("end_time");
		var linkman = req.param("linkman");
		var address = req.param("address");
		var phone = req.param("phone");
		var remark = req.param("remark");
		var state_id = req.param("state_id");
		
		var LIMIT = 20;
		page = (page && page > 0) ? page : 1;
		var limit = (limit && limit > 0) ? limit : LIMIT;
		var id_min = (page - 1) * limit;
		var id_max = id_min + LIMIT;
		
		//查询条件
		var change = "";
		if(meetingname != ""){
			change += " and meetingname like '@"+meetingname+"@'";
		}
		if(company != ""){
			change += " and company like '@"+company+"@'";
		}
		if(linkman != ""){
			change += " and linkman like '@"+linkman+"@'";
		}
		if(address != ""){
			change += " and address like '@"+address+"@'";
		}
		if(phone != ""){
			change += " and phone like '@"+phone+"@'";
		}
		if(remark != ""){
			change += " and remark like '@"+remark+"@'";
		}
		
		if(state_id != "-" && state_id != ""){
			change += " and state_id = '"+state_id+"'";
		}
		var timestamp_start = Date.parse(new Date(start_time));
		timestamp_start = timestamp_start / 1000;
		if(start_time != ""){
			change += " and signDate >= '"+timestamp_start+"'";
		}
		var timestamp_end = Date.parse(new Date(GetDateStr_end(end_time,1)));
		timestamp_end = timestamp_end / 1000;
		if(end_time != ""){
			change += " and signDate <= '"+timestamp_end+"'";
		}
		
		var sql1 = "select top "+limit+" * from dbo.Meeting_signup where id not in ( select top "+id_min+" id from dbo.Meeting_signup order by id desc) "+change+" order by id desc";
		var sql2 = "select count(*) as count from dbo.Meeting_signup where 1 = 1 "+change;
		console.log(sql1);
		async.waterfall([function(callback) {
			request({
			    encoding: null,
			    url: "http://www.jdjs.com.cn/jdtcms/Meeting_signup.asp?p="+sql1
			}, function(error, res, body) {
			    if (!error && res.statusCode == 200) {
			        //var body_zh = (Iconv.decode(body, 'gb2312').toString());
			        var body_zh = (Iconv.decode(body, 'utf-8').toString());
			        //console.log(body_zh);
			        callback(null, (body_zh));
			    }
			});
		}, function(result, callback) {
		    request("http://www.jdjs.com.cn/jdtcms/getCount.asp?p="+sql2,function(error,response,body){
			    if(!error && response.statusCode == 200){
			        //输出返回的内容
			        //console.log(body);
			        callback(null, result,body);
			    }
			});
		}], function(err,rows,result) {
		    if(err){
		    	console.log(err);
		    }else{
		    	rows = rows.replace(/"/g,"“");
		    	var str = '[';
		    	var arr1 = rows.split("#");
		    	for(var i=0;i<arr1.length;i++){
		    		var arr2 = arr1[i].split("@");
		    		if(i==0){
		    			str += '{"meetingname":"'+arr2[0]+'","company":"'+arr2[1]+'","linkman":"'+arr2[2]+'","address":"'+arr2[3]+'","phone":"'+arr2[4]+'","custfrom":"'+arr2[5]+'","signDate":"'+arr2[6]+'","state_id":"'+arr2[7]+'","remark":"'+arr2[8]+'","id":"'+arr2[9]+'"}';
		    		}else{
		    			str += ',{"meetingname":"'+arr2[0]+'","company":"'+arr2[1]+'","linkman":"'+arr2[2]+'","address":"'+arr2[3]+'","phone":"'+arr2[4]+'","custfrom":"'+arr2[5]+'","signDate":"'+arr2[6]+'","state_id":"'+arr2[7]+'","remark":"'+arr2[8]+'","id":"'+arr2[9]+'"}';
		    		}
		    	}
		    	str += ']';
		    	
		    	//console.log(str);
		    	
		    	var total = result;
		    	
		    	var totalpage = Math.ceil(total/limit);
                var isFirstPage = page == 1 ;
                var isLastPage = ((page -1) * limit + result.length) == total;
                
		    	var ret = {
		    		total:total,
		    		totalpage:totalpage,
		    		isFirstPage:isFirstPage,
		    		isLastPage:isLastPage,
					record:JSON.parse(str)
				};
				res.json(ret);
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
		var LIMIT = 10;
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