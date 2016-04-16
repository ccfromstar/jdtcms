var mysql = require('../models/db');
var debug = require('debug')('myapp:settings');
var async = require('async');

Settings = function(action,req,res){
    switch(action){
		case "getSettings":
	  		getSettings(req,res);
	  		break;
	  	case "updateSettings":
	  		updateSettings(req,res);
	  		break;
		default:
	  		//do something
	}
}

function getSettings(req,res){
		var sql = "select * from settings";
		mysql.query(sql, function(err, row) {
			if (err) return console.error(err.stack);
			res.json(row);
		});
}

function updateSettings(req,res){
	var score_focus = req.param("score_focus");
	var score_read = req.param("score_read");
	var score_like = req.param("score_like");
	var score_transpond = req.param("score_transpond");
	var score_admin_focus = req.param("score_admin_focus");
	var score_admin_read = req.param("score_admin_read");
	var score_admin_like = req.param("score_admin_like");
	var score_admin_transpond = req.param("score_admin_transpond");
	var day_initial = req.param("day_initial");
	var day_read = req.param("day_read");
	var day_like = req.param("day_like");
	var day_transpond = req.param("day_transpond");

			var sql = "update settings set ";
			sql += " day_initial = "+day_initial+",";
			sql += " day_read = "+day_read+",";
			sql += " day_like = "+day_like+",";
			sql += " day_transpond = "+day_transpond+",";
			sql += " score_focus = "+score_focus+",";
			sql += " score_read = "+score_read+",";
			sql += " score_like = "+score_like+",";
			sql += " score_transpond = "+score_transpond+",";
			sql += " score_admin_focus = "+score_admin_focus+",";
			sql += " score_admin_read = "+score_admin_read+",";
			sql += " score_admin_like = "+score_admin_like+",";
			sql += " score_admin_transpond = "+score_admin_transpond;
			mysql.query(sql, function(err, result) {
				if (err) return console.error(err.stack);
				if(result.affectedRows == 1){
					res.send("300");
				}
			});
}

module.exports = Settings;