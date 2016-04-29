var R_content = React.createClass({displayName: "R_content",
	getInitialState: function() { 
		return {data: [],total:0,totalpage: [],isFirst:"am-disabled",isLast:"am-disabled",data1: [],total1:0,totalpage1: [],isFirst1:"am-disabled",isLast1:"am-disabled"};
	},
	cancleDoc:function(){
		history.go(-1);
	},
	getTotalScore:function(){
		var readdocid = window.sessionStorage.getItem("readdocid");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserById",
			data: {
				id:readdocid
			},
			success: function(data) {
				$("#score_unused").html(data[0].score_unused);
				$("#score_total").html(data[0].score_total);
			}
		});
	},
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var readdocid = window.sessionStorage.getItem("readdocid");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserById",
			data: {
				id:readdocid
			},
			success: function(data) {
				$("#nickname").html(data[0].nickname);
				$("#openid").html(data[0].openid);
				$("#sex").html(data[0].sex);
				$("#language").html(data[0].language);
				$("#city").html(data[0].city);
				$("#province").html(data[0].province);
				$("#country").html(data[0].country);
				$("#headimgurl").html('<a href="'+data[0].headimgurl+'" target="_blank"><img class="wx_user_header_img_large" src="'+data[0].headimgurl+'"></img></a>');
				$("#subscribe_time").html(new Date(data[0].subscribe_time*1000).Format("yyyy-MM-dd hh:mm:ss"));
				$("#remark").html(data[0].remark);
				$("#groupid").html(data[0].group_name);
				$("#user_id").html(data[0].name);
				$("#score_unused").html(data[0].score_unused);
				$("#score_total").html(data[0].score_total);
				$modal.modal('close');
			}
		});
		/*获取客服*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUser",
			data: {
				
			},
			success: function(data) {
				var option = "<option value='-'>分配客服</option>";
				for(var i in data){
					option += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
				}
				$("#wx_user").html(option);
			}
		});
		/*获取分组*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getGroup",
			data: {
				
			},
			success: function(data) {
				var option = "<option value='-'>分组</option>";
				for(var i in data){
					option += "<option value='"+data[i].group_id+"'>"+data[i].group_name+"</option>";
				}
				$("#wx_group").html(option);
			}
		});
		/*获取积分明细*/
		this.toPage();
		this.toPage1();
	},
	setUser:function(e){
		e.preventDefault();
		var userid = $("#wx_user").val();
		var readdocid = window.sessionStorage.getItem("readdocid");
		if(userid == "-"){
			return false;
		}
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/setUser",
			data: {
				userid:userid,
				id:readdocid
			},
			success: function(data) {
				$('.successinfo').html('<p>分配成功</p>').removeClass("none");
				$("#user_id").html(data.name);
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
			}
		});
	},
	setGroup:function(e){
		e.preventDefault();
		var groupid = $("#wx_group").val();
		var openid = window.sessionStorage.getItem("openid");
		var readdocid = window.sessionStorage.getItem("readdocid");
		if(groupid == "-"){
			return false;
		}
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/setGroup",
			data: {
				groupid:groupid,
				id:readdocid,
				openid:openid
			},
			success: function(data) {
				$('.successinfo').html('<p>分组成功</p>').removeClass("none");
				$("#groupid").html(data.group_name);
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
			}
		});
	},
	setRemark:function(e){
		/*修改用户备注*/
		e.preventDefault();
		var _remark = $("#input_remark").val();
		var openid = window.sessionStorage.getItem("openid");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/setRemark",
			data: {
				remark:_remark,
				openid:openid
			},
			success: function(data) {
				$('.successinfo').html('<p>备注修改成功</p>').removeClass("none");
				$("#remark").html(_remark);
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
			}
		});
	},
	setRPconfirm:function(e){
		var o = this;
		e.preventDefault();
		$("#rp-confirm").modal();
	},
	setRP:function(e){
		/*奖罚确认*/
		var that = this;
		e.preventDefault();
		var openid = window.sessionStorage.getItem("openid");
		var score_sel = $("#score_sel").val();
		var score_number = $("#score_number").val();
		var score_remark = $("#score_remark").val();
		if(isNaN(score_number)){
			$('.errorinfo').html('<p>只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if(score_sel == "-"){
			$('.errorinfo').html('<p>请选择奖罚类型</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		/*判断如果是发红包，1分钟内只能发送一次红包给一个用户*/
		if(Number(score_sel) == 3){
			var last_redpacket_sendtime = new Date(window.sessionStorage.getItem("last_redpacket_sendtime"));
			if(last_redpacket_sendtime){
				var this_redpacket_sendtime = new Date();
				var date_difference=this_redpacket_sendtime.getTime()-last_redpacket_sendtime.getTime();
				if(parseInt(date_difference/1000) < 61){
					$('.errorinfo').html('<p>1分钟内只能发送一次红包给一个用户</p>').removeClass("none");
					setTimeout(function() {
						$('.errorinfo').addClass("none");
					}, 2000);
					return false;
				}
			}
			window.sessionStorage.setItem("last_redpacket_sendtime",new Date());
		}
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/setRP",
			data: {
				score_sel:score_sel,
				score_number:score_number,
				score_remark:score_remark,
				openid:openid
			},
			success: function(data) {
				$('.successinfo').html('<p>发放成功</p>').removeClass("none");
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
				that.toPage();
				that.toPage1();
				that.getTotalScore();
			}
		});
	},
	toPage:function(page,e){
		var o = this;
		if(e){
			e.preventDefault();
		}
		window.sessionStorage.setItem("indexPage",page);
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('openid');
		indexPage = indexPage?indexPage:1;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getScore",
			data: {
				indexPage:indexPage,
				cid:id
			},
			success: function(data) {
				o.setState({data:data.record});
				o.setState({total:data.total});
				o.setState({totalpage:data.totalpage});
				o.setState({isFirst:(data.isFirstPage?"am-disabled":"")});
				o.setState({isLast:(data.isLastPage?"am-disabled":"")});
				$modal.modal('close');
			}
		});
	},
	toPage1:function(page,e){
		var o = this;
		if(e){
			e.preventDefault();
		}
		window.sessionStorage.setItem("indexPage1",page);
		var indexPage = window.sessionStorage.getItem("indexPage1");
		var id = window.sessionStorage.getItem('openid');
		indexPage = indexPage?indexPage:1;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getRPScore",
			data: {
				indexPage:indexPage,
				cid:id
			},
			success: function(data) {
				o.setState({data1:data.record});
				o.setState({total1:data.total});
				o.setState({totalpage1:data.totalpage});
				o.setState({isFirst1:(data.isFirstPage?"am-disabled":"")});
				o.setState({isLast1:(data.isLastPage?"am-disabled":"")});
				$modal.modal('close');
			}
		});
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
			var cname = c.name;
			if(c.type_id == 3 || c.type_id == 4  || c.type_id == 5  || c.type_id == 6){
				cname += "《"+c.title+"》";
			}
			var cscore = c.score + "";
			if(cscore.indexOf("-")==-1){
				cscore = "+" + cscore;
			}
			return(
					React.createElement("tr", null, 
					  React.createElement("td", null, cname), 
					  React.createElement("td", null, cscore), 
					  React.createElement("td", null, new Date(c.time).Format("yyyy-MM-dd hh:mm:ss"))
		            )
			);
		});
		var pager=[];
		var iPa = Number(window.sessionStorage.getItem("indexPage"));
		iPa = iPa?iPa:1;
        for(var i=1;i<(this.state.totalpage)+1;i++){
        	var hasClass = "";
        	if(i == iPa){
        		hasClass = "am-active";
        	}
            pager.push(
                React.createElement("li", {className: hasClass}, React.createElement("a", {href: "#", onClick: o.toPage.bind(o,i)}, i))
            )
        }
        
        var list1 = this.state.data1.map(function(c){
			return(
					React.createElement("tr", null, 
					  React.createElement("td", null, c.name), 
					  React.createElement("td", null, c.number), 
					  React.createElement("td", null, new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")), 
					  React.createElement("td", null, c.txtRemark)
		            )
			);
		});
		
		var pager1=[];
		var iPa1 = Number(window.sessionStorage.getItem("indexPage1"));
		iPa1 = iPa1?iPa1:1;
        for(var i=1;i<(this.state.totalpage1)+1;i++){
        	var hasClass = "";
        	if(i == iPa1){
        		hasClass = "am-active";
        	}
            pager1.push(
                React.createElement("li", {className: hasClass}, React.createElement("a", {href: "#", onClick: o.toPage1.bind(o,i)}, i))
            )
        }

		return(
			React.createElement("div", {className: "admin-content"}, 
			
			   	React.createElement("div", {className: "am-cf am-padding"}, 
					React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "关注者详情"), " / ", React.createElement("small", null, "查看"))
				), 
			    
			    React.createElement("div", {className: "am-tabs am-margin", "data-am-tabs": true}, 
				    React.createElement("ul", {className: "am-tabs-nav am-nav am-nav-tabs"}, 
				      React.createElement("li", {className: "am-active"}, React.createElement("a", {href: "#tab1"}, "关注者基本信息")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab2"}, "积分信息")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab3"}, "奖罚管理"))
				    ), 
				
				    React.createElement("div", {className: "am-tabs-bd"}, 
				      React.createElement("div", {className: "am-tab-panel am-fade am-in am-active", id: "tab1"}, 
				       	React.createElement("div", {className: "am-form"}, 

				       		React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "用户头像"
					            ), 
					            React.createElement("div", {id: "headimgurl", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

				       		React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "昵称"
					            ), 
					            React.createElement("div", {id: "nickname", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "用户的标识"
					            ), 
					            React.createElement("div", {id: "openid", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "性别"
					            ), 
					            React.createElement("div", {id: "sex", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "语言"
					            ), 
					            React.createElement("div", {id: "language", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "城市"
					            ), 
					            React.createElement("div", {id: "city", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "省份"
					            ), 
					            React.createElement("div", {id: "province", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "国家"
					            ), 
					            React.createElement("div", {id: "country", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "首次关注时间"
					            ), 
					            React.createElement("div", {id: "subscribe_time", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "备注"
					            ), 
					            React.createElement("div", {id: "remark", className: "am-u-sm-8 am-u-md-4"}), 
					            React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, 
									React.createElement("input", {type: "text", id: "input_remark", className: "am-input-sm wx_user_input"}), 
									React.createElement("button", {type: "button", onClick: this.setRemark, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "确定")
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "分组"
					            ), 
					            React.createElement("div", {id: "groupid", className: "am-u-sm-8 am-u-md-4"}
					            ), 
					             React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, 
									React.createElement("select", {id: "wx_group", onChange: this.setGroup.bind(this)})
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 

							    React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "所属客服"
					            ), 
					            React.createElement("div", {id: "user_id", className: "am-u-sm-8 am-u-md-4"}), 
					            React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, 
									React.createElement("select", {id: "wx_user", onChange: this.setUser.bind(this)})
					            )

					        )
				        )
				      ), 
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab2"}, 
				       	React.createElement("div", {className: "am-form"}, 
				       		React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "未兑换的积分"
					            ), 
					            React.createElement("div", {id: "score_unused", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "总积分"
					            ), 
					            React.createElement("div", {id: "score_total", className: "am-u-sm-8 am-u-md-10"}
					            )
					        ), 

					        React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
						        React.createElement("div", {className: "am-panel-bd"}, 
						          React.createElement("p", null, React.createElement("span", {className: "am-icon-list"}), " 积分明细："), 
						          React.createElement("table", {className: "am-table am-table-striped am-table-hover table-main"}, 
						            React.createElement("thead", null, 
						              React.createElement("tr", null, 
						              	React.createElement("th", null, "积分行为"), 
						              	React.createElement("th", null, "积分变化"), 
						              	React.createElement("th", null, "时间")
						              )
						          	), 
						          	React.createElement("tbody", null, 
						          		list
						          	)
						          ), 
						          	React.createElement("div", {className: "am-cf"}, 
									  "共 ", this.state.total, " 条记录", 
									  React.createElement("div", {className: "am-fr"}, 
									    React.createElement("ul", {className: "am-pagination"}, 
									      React.createElement("li", {className: this.state.isFirst}, React.createElement("a", {href: "#", onClick: this.toPage.bind(this,Number(window.sessionStorage.getItem("indexPage"))-1)}, "«")), 
									      pager, 
									      React.createElement("li", {className: this.state.isLast}, React.createElement("a", {href: "#", onClick: this.toPage.bind(this,Number(window.sessionStorage.getItem("indexPage"))+1)}, "»"))
									    )
									  )
									)
										)
								    )
				        )
				      ), 
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab3"}, 
				      	React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
					        React.createElement("div", {className: "am-panel-bd"}, 
					          React.createElement("p", null, React.createElement("span", {className: "am-icon-bookmark"}), " 相关操作："), 
					          React.createElement("p", null, React.createElement("select", {id: "score_sel"}, 
					          		React.createElement("option", {value: "-"}, "奖罚类型"), 
					          		React.createElement("option", {value: "1"}, "奖励积分"), 
					          		React.createElement("option", {value: "2"}, "惩罚积分"), 
					          		React.createElement("option", {value: "3"}, "奖励红包"), 
					          		React.createElement("option", {value: "4"}, "奖励建定通天数"), 
					          		React.createElement("option", {value: "5"}, "惩罚建定通天数")
					          ), 
					       		React.createElement("input", {type: "text", id: "score_number", className: "am-input-sm settings_input", defaultValue: "0"})), 
					       		React.createElement("p", null, "备注说明" + ' ' + 
					       		"  ", React.createElement("input", {type: "text", id: "score_remark", className: "am-input-sm wx_user_input"})
					       		), 
					       		React.createElement("button", {type: "button", onClick: this.setRPconfirm, className: "am-btn am-btn-default am-btn-xs"}, "确认")						        
							)
					    ), 
					    
					    React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
						        React.createElement("div", {className: "am-panel-bd"}, 
						          React.createElement("p", null, React.createElement("span", {className: "am-icon-list"}), " 奖罚明细："), 
						          React.createElement("table", {className: "am-table am-table-striped am-table-hover table-main"}, 
						            React.createElement("thead", null, 
						              React.createElement("tr", null, 
						              	React.createElement("th", null, "奖罚行为"), 
						              	React.createElement("th", null, "奖罚内容"), 
						              	React.createElement("th", null, "时间"), 
						              	React.createElement("th", null, "备注")
						              )
						          	), 
						          	React.createElement("tbody", null, 
						          		list1
						          	)
						          ), 
						          	React.createElement("div", {className: "am-cf"}, 
									  "共 ", this.state.total1, " 条记录", 
									  React.createElement("div", {className: "am-fr"}, 
									    React.createElement("ul", {className: "am-pagination"}, 
									      React.createElement("li", {className: this.state.isFirst1}, React.createElement("a", {href: "#", onClick: this.toPage1.bind(this,Number(window.sessionStorage.getItem("indexPage1"))-1)}, "«")), 
									      pager1, 
									      React.createElement("li", {className: this.state.isLast1}, React.createElement("a", {href: "#", onClick: this.toPage1.bind(this,Number(window.sessionStorage.getItem("indexPage1"))+1)}, "»"))
									    )
									  )
									)
										)
								    )
					    
				      )
				    )
				), 
				
				React.createElement("div", {className: "am-margin"}, 
				    React.createElement("button", {type: "button", onClick: this.cancleDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "关闭")
				), 
				
				React.createElement("div", {className: "am-modal am-modal-confirm", tabIndex: "-1", id: "rp-confirm"}, 
				  React.createElement("div", {className: "am-modal-dialog"}, 
				    React.createElement("div", {className: "am-modal-hd"}, "提示"), 
				    React.createElement("div", {className: "am-modal-bd"}, 
				      "是否确定执行操作？"
				    ), 
				    React.createElement("div", {className: "am-modal-footer"}, 
				      React.createElement("span", {className: "am-modal-btn", "data-am-modal-cancel": true}, "取消"), 
				      React.createElement("span", {className: "am-modal-btn", "data-am-modal-confirm": true, onClick: this.setRP}, "确定")
				    )
				  )
				)
			)
		);
	}
});