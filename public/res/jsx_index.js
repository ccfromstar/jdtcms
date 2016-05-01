var R_content = React.createClass({displayName: "R_content",
	getInitialState: function() { 
		var role = window.sessionStorage.getItem("crole");
		var isAdmin = (role=="管理员")?"":"none";
		return {data: [],total:0,totalpage: [],isFirst:"am-disabled",isLast:"am-disabled",isAdmin:isAdmin};
	},
	newDoc:function(){
		window.sessionStorage.setItem("mode","new");
		window.sessionStorage.removeItem("editid");
		window.sessionStorage.removeItem("startDate");
		window.location = 'booking.html';
	},
	readDoc:function(id,openid,e){
		e.preventDefault();
		window.sessionStorage.setItem("readdocid",id);
		window.sessionStorage.setItem("openid",openid);
		window.location = 'wx_user_read.html';
	},
	delDoc:function(id,e){
		var o = this;
		e.preventDefault();
		window.sessionStorage.setItem("delid",id);
		$("#del-confirm").modal();
	},
	editDoc:function(id,startDate,e){
		var o = this;
		e.preventDefault();
		window.sessionStorage.setItem("editid",id);
		window.sessionStorage.setItem("startDate",startDate);
		window.sessionStorage.setItem("mode","edit");
		window.location = 'booking.html';
	},
	delsql:function(){
		var o = this;
		$.ajax({
			type: "post",
			url: hosts + "/service/delBooking",
			data: {
				id:window.sessionStorage.getItem("delid")
			},
			success: function(data) {
				if(data == "300"){
					o.toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>删除成功</p>').removeClass("none");
					setTimeout(function() {
						$('.successinfo').addClass("none");
					}, 2000);
				}
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
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		
		/*查询参数*/
		var k_openid = $("#k_openid").val();
		var k_nickname = $("#k_nickname").val();
		var start_time = $("#start_time").val();
		var end_time = $("#end_time").val();
		var wx_group = $("#wx_group").val();
		var k_remark = $("#k_remark").val();
		var k_area = $("#k_area").val();
		var wx_user = $("#wx_user").val();
		
		var score_unused1 = $("#score_unused1").val();
		var score_unused2 = $("#score_unused2").val();
		var score_total1 = $("#score_total1").val();
		var score_total2 = $("#score_total2").val();
		
		if(isNaN(score_unused1) || isNaN(score_unused2) || isNaN(score_total1) || isNaN(score_total2)){
			$('.errorinfo').html('<p>积分范围只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserByKey",
			data: {
				indexPage:indexPage,
				cid:id,
				openid:k_openid,
				nickname:k_nickname,
				start_time:start_time,
				end_time:end_time,
				wx_group:wx_group,
				k_remark:k_remark,
				k_area:k_area,
				wx_user:wx_user,
				score_unused1:score_unused1,
				score_unused2:score_unused2,
				score_total1:score_total1,
				score_total2:score_total2,
				role_manage:role_manage
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
	resetKey:function(){
		window.location.reload();
	},
	exportXls:function(){
		var id = window.sessionStorage.getItem('cid');
		var role = window.sessionStorage.getItem("crole");
		$.ajax({
			type: "post",
			url: hosts + "/service/exportBooking",
			data: {
				cid:id,
				role:role
			},
			success: function(data) {
				window.open(hosts + "/excelop/temp/"+data);
				$('.loadinfo').html("<a href='"+hosts + "/excelop/temp/"+data+"'>如果没有自动弹出下载报表，说明您的浏览器禁止了弹出框，您可以点击这里下载报表(10秒后自动关闭)</a>").removeClass("none");
				setTimeout(function() {
					$('.loadinfo').addClass("none");
				}, 10000);
			}
		});
	},
	search:function(){
		var o = this;
		/*昵称*/
		var key = $("#key").val();
		/*分组*/
		var groupid = $("#wx_group").val();
		groupid = (groupid=='-')?null:groupid;
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		var role = window.sessionStorage.getItem("crole");
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserByKey",
			data: {
				key:key,
				indexPage:indexPage,
				cid:id,
				role:role,
				groupid:groupid
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
	UpdateWxUser:function(){
		$('.loadinfo').html('<p>更新中...</p>').removeClass("none");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/updateWxUser",
			data: {

			},
			success: function(data) {
				if(data == "200"){
					$('.loadinfo').addClass("none");
					$('.successinfo').html('<p>关注者列表更新成功</p>').removeClass("none");
					window.location = "index.html";
				}
			}
		});
	},	
	UpdateWxGroup:function(){
		$('.loadinfo').html('<p>更新中...</p>').removeClass("none");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/updateWxGroup",
			data: {

			},
			success: function(data) {
				if(data == "200"){
					$('.loadinfo').addClass("none");
					$('.successinfo').html('<p>分组更新成功</p>').removeClass("none");
					window.location = "index.html";
				}
			}
		});
	},	
	UpdateWxUserInfo:function(){
		$('.loadinfo').html('<p>同步中...</p>').removeClass("none");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/UpdateWxUserInfo",
			data: {

			},
			success: function(data) {
				if(data == "200"){
					setTimeout(function() {
						$('.loadinfo').addClass("none");
						$('.successinfo').html('<p>同步用户信息成功</p>').removeClass("none");
						window.location = "index.html";
					}, 120000);
				}
			}
		});
	},
	checkRole:function(){
		if(role_manage == 0){
			//如果没有管理员权限，只能看到自己的客户
			$("#wx_user").addClass("none");
		}
	},
	componentDidMount:function(){
		/*权限判断*/
		this.checkRole();
		var o = this;
		$("#start_time").bind("click",function(){
			$('#start_time').datepicker('open');
		});
		$("#end_time").bind("click",function(){
			$('#end_time').datepicker('open');
		});
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		var role = window.sessionStorage.getItem("crole");
		/*获取用户列表*/
		this.toPage(1);
		/*获取分组*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getWxGroup",
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
		/*获取客服*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUser",
			data: {
				
			},
			success: function(data) {
				var option = "<option value='-'>所属客服</option>";
				for(var i in data){
					option += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
				}
				$("#wx_user").html(option);
			}
		});
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		var sex = "";
		switch(c.sex){
			case 0:
				sex = "";break;
			case 1:
				sex = "男";break;
			case 2:
				sex = "女";break;
		}
		var _subtime = new Date(c.subscribe_time*1000).Format("yyyy-MM-dd hh:mm:ss");
		return(
				React.createElement("tr", null, 
				  React.createElement("td", null, c.group_name), 
				  React.createElement("td", null, React.createElement("a", {href: c.headimgurl, target: "_blank"}, React.createElement("img", {className: "wx_user_header_img", src: c.headimgurl}))), 
				  React.createElement("td", null, c.nickname), 
				  React.createElement("td", null, sex), 
				  React.createElement("td", null, c.province, c.city), 
				  React.createElement("td", null, c.country), 
				  React.createElement("td", {className: "wx_user_remark"}, c.remark), 
				  React.createElement("td", null, _subtime), 
				  React.createElement("td", null, c.name), 
				  React.createElement("td", null, c.score_unused), 
				  React.createElement("td", null, c.score_total), 
	              React.createElement("td", null, 
	                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
	                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
	                    React.createElement("button", {onClick: o.readDoc.bind(o,c.id,c.openid), className: "am-btn am-btn-default am-btn-xs am-text-secondary"}, React.createElement("span", {className: "am-icon-search"}), " 查看详情")
	                  )
	                )
	              )
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
		return(
			React.createElement("div", {className: "admin-content"}, 
			
			    React.createElement("div", {className: "am-cf am-padding"}, 
			      React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "关注者查询"), " / ", React.createElement("small", null, "列表"))
				), 
			    React.createElement("div", {className: "am-g"}, 
			      React.createElement("div", {className: "am-u-sm-12 am-u-md-12"}, 
			        React.createElement("div", {className: "am-btn-toolbar"}, 
			          React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
			            React.createElement("button", {type: "button", onClick: this.UpdateWxUser, className: "am-btn am-btn-default btn-getDate"}, React.createElement("span", {className: "am-icon-refresh"}), " 更新关注者"), 
			          	React.createElement("button", {type: "button", onClick: this.UpdateWxGroup, className: "am-btn am-btn-default btn-getDate"}, React.createElement("span", {className: "am-icon-refresh"}), " 更新分组"), 
			          	React.createElement("button", {type: "button", onClick: this.UpdateWxUserInfo, className: "am-btn am-btn-default btn-getDate"}, React.createElement("span", {className: "am-icon-refresh"}), " 同步用户信息")
			          )
			        )
			      )
			    ), 
			    
			    React.createElement("div", {className: "am-g"}, 
			      React.createElement("div", {className: "am-u-sm-12 am-u-md-12 menu-search"}, 
			        React.createElement("div", {className: "am-btn-toolbar"}, 
			          		React.createElement("input", {type: "text", id: "k_openid", className: "am-input-sm search_input", placeholder: "openid"}), 
			          		React.createElement("input", {type: "text", id: "k_nickname", className: "am-input-sm search_input", placeholder: "昵称"}), 
			          		React.createElement("input", {type: "text", id: "k_remark", className: "am-input-sm search_input", placeholder: "用户备注"}), 
			          		React.createElement("select", {id: "wx_group", className: "sel_user"}), 
			          		React.createElement("input", {type: "text", id: "k_area", className: "am-input-sm search_input", placeholder: "地域"}), 
			          		React.createElement("select", {id: "wx_user", className: "sel_user"}), 
			          		React.createElement("br", null), "首次关注时间：", 
			          		React.createElement("input", {type: "text", id: "start_time", className: "am-form-field date_sel", placeholder: "开始日期", "data-am-datepicker": true, readOnly: true, required: true}), 
			          		React.createElement("input", {type: "text", id: "end_time", className: "am-form-field date_sel", placeholder: "结束日期", "data-am-datepicker": true, readOnly: true, required: true}), 
			          		"未兑换的积分：", 
			          		React.createElement("input", {type: "text", id: "score_unused1", className: "am-input-sm search_input_num", defaultValue: "0"}), "~  ", 
			          		 React.createElement("input", {type: "text", id: "score_unused2", className: "am-input-sm search_input_num", defaultValue: "0"}), 
			          		"总积分：", 
			          		React.createElement("input", {type: "text", id: "score_total1", className: "am-input-sm search_input_num", defaultValue: "0"}), "~  ", 
			          		 React.createElement("input", {type: "text", id: "score_total2", className: "am-input-sm search_input_num", defaultValue: "0"}), 
			          		React.createElement("button", {type: "button", onClick: this.toPage.bind(o,1), className: "btn-c am-btn am-btn-primary am-btn-xs btn-search"}, React.createElement("span", {className: "am-icon-search"}), " 查询"), 
			          		React.createElement("button", {type: "button", onClick: this.resetKey, className: "btn-c am-btn am-btn-default am-btn-xs btn-search"}, React.createElement("span", {className: "am-icon-bitbucket"}), " 清空")
			        )
			      )
			    ), 
			    
			    React.createElement("div", {className: "am-g"}, 
				    React.createElement("div", {className: "am-u-sm-12"}, 
				        React.createElement("form", {className: "am-form"}, 
				          React.createElement("table", {className: "am-table am-table-striped am-table-hover table-main jdt-table"}, 
				            React.createElement("thead", null, 
				              React.createElement("tr", null, 
				              	React.createElement("th", null, "分组"), 
				              	React.createElement("th", null, "用户头像"), 
				              	React.createElement("th", null, "昵称"), 
				              	React.createElement("th", null, "性别"), 
				              	React.createElement("th", null, "省市"), 
				              	React.createElement("th", null, "国家"), 
				              	React.createElement("th", null, "备注"), 
				              	React.createElement("th", null, "首次关注时间"), 
				              	React.createElement("th", null, "所属客服"), 
				              	React.createElement("th", null, "未兑换的积分"), 
				              	React.createElement("th", null, "总积分"), 
			            		React.createElement("th", {className: "am-hide-sm-only table-set"}, "操作")
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
				), 
				React.createElement("div", {className: "am-modal am-modal-confirm", tabIndex: "-1", id: "del-confirm"}, 
				  React.createElement("div", {className: "am-modal-dialog"}, 
				    React.createElement("div", {className: "am-modal-hd"}, "提示"), 
				    React.createElement("div", {className: "am-modal-bd"}, 
				      "你，确定要删除这条记录吗？"
				    ), 
				    React.createElement("div", {className: "am-modal-footer"}, 
				      React.createElement("span", {className: "am-modal-btn", "data-am-modal-cancel": true}, "取消"), 
				      React.createElement("span", {className: "am-modal-btn", "data-am-modal-confirm": true, onClick: this.delsql}, "确定")
				    )
				  )
				)
			)
		);
	}
});