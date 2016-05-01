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
		window.location = 'wx_record_read.html';
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
		this.getRecord(page);
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
	jqchk:function(name){ //jquery获取复选框值
	    var chk_value = '';
	    $('input[name="' + name + '"]:checked').each(function (){
	        if (chk_value == ""){
	            chk_value = $(this).val();
	        }else{
	            chk_value = chk_value + "*" + $(this).val();
	        }
	    }
	    );
	    return chk_value;
	},
	resetKey:function(){
		window.location.reload();
	},
	ShowWin:function(){
		$("#action_type").modal();
	},
	setType:function(){
		$('#k_type_id').val(this.jqchk('type_id'));
		$("#action_type").modal('close');
		this.toPage(1);
	},
	getRecord:function(page){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
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
		var k_type_id = $("#k_type_id").val();
		/*获取列表*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_record/getRecord",
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
				k_type_id:k_type_id,
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
	checkRole:function(){
		if(role_manage == 0){
			//如果没有管理员权限，只能看到自己的客户
			$("#wx_user").addClass("none");
		}
	},
	componentDidMount:function(){
		/*权限判断*/
		this.checkRole();
		$("#start_time").bind("click",function(){
			$('#start_time').datepicker('open');
		});
		$("#end_time").bind("click",function(){
			$('#end_time').datepicker('open');
		});
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
		this.getRecord();
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		var _subtime = new Date(c.operation_time).Format("yyyy-MM-dd hh:mm:ss");
		var cname = c.name;
		if(c.type_id == 3 || c.type_id == 4  || c.type_id == 5  || c.type_id == 6){
			cname += "《"+c.title+"》";
		}
		return(
				React.createElement("tr", null, 
				  React.createElement("td", null, c.wx_openid), 
				  React.createElement("td", null, c.nickname?c.nickname:"未关注者"), 
				  React.createElement("td", null, _subtime), 
				  React.createElement("td", null, cname), 
				  React.createElement("td", null, c.remark), 
	              React.createElement("td", null, 
	                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
	                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
	                    React.createElement("button", {onClick: o.readDoc.bind(o,c.id,c.wx_openid), className: "am-btn am-btn-default am-btn-xs am-text-secondary"}, React.createElement("span", {className: "am-icon-search"}), " 查看详情")
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
			      React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "关注者行为查询"), " / ", React.createElement("small", null, "列表"))
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
			          		React.createElement("input", {type: "text", id: "start_time", className: "am-form-field date_sel", placeholder: "开始日期", "data-am-datepicker": true, readOnly: true, required: true}), 
			          		React.createElement("input", {type: "text", id: "end_time", className: "am-form-field date_sel", placeholder: "结束日期", "data-am-datepicker": true, readOnly: true, required: true}), 
			          		React.createElement("input", {type: "hidden", id: "k_type_id", onClick: this.ShowWin, className: "am-input-sm search_input", placeholder: "行为分类", readOnly: true}), 
			          		React.createElement("button", {type: "button", onClick: this.ShowWin, className: "btn-c am-btn am-btn-default am-btn-xs btn-search"}, React.createElement("span", {className: "am-icon-hand-pointer-o"}), " 选择行为分类"), 
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
				              	React.createElement("th", null, "openid"), 
				              	React.createElement("th", null, "昵称"), 
				              	React.createElement("th", null, "操作时间"), 
				              	React.createElement("th", null, "行为分类"), 
				              	React.createElement("th", null, "记录备注"), 
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
				), 
				
				React.createElement("div", {className: "am-modal am-modal-no-btn", tabindex: "-1", id: "action_type"}, 
				  React.createElement("div", {className: "am-modal-dialog"}, 
				    React.createElement("div", {className: "am-modal-hd"}, "选择行为分类", 
				      React.createElement("a", {href: "javascript: void(0)", className: "am-close am-close-spin", "data-am-modal-close": true}, "×")
				    ), 
				    React.createElement("div", {className: "am-modal-bd"}, 
				      	React.createElement("div", {className: "action_check"}, 
						   	React.createElement("label", {for: "type_1"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "1", id: "type_1", "data-am-ucheck": true}), " 关注"	
							), 
							React.createElement("label", {for: "type_2"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "2", id: "type_2", "data-am-ucheck": true}), " 取消关注"
							), 
							React.createElement("label", {for: "type_3"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "3", id: "type_3", "data-am-ucheck": true}), " 阅读文章"
							), 
							React.createElement("label", {for: "type_4"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "4", id: "type_4", "data-am-ucheck": true}), " 点赞"
							), 
							React.createElement("label", {for: "type_5"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "5", id: "type_5", "data-am-ucheck": true}), " 分享好友"
							), 
							React.createElement("label", {for: "type_6"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "6", id: "type_6", "data-am-ucheck": true}), " 分享朋友圈"
							)
						), 
						React.createElement("button", {type: "button", onClick: this.setType, className: "btn-c am-btn am-btn-primary am-btn-xs btn-search"}, "确定")
			          		
				    )
				  )
				)
				
			)
		);
	}
});