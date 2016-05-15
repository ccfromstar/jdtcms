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
		window.location = 'userform.html';
	},
	readDoc:function(id){
		window.sessionStorage.setItem("readdocid",id);
		window.location = 'booking_read.html';
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
		window.sessionStorage.setItem("mode","edit");
		window.location = 'userform.html';
	},
	delsql:function(){
		var o = this;
		$.ajax({
			type: "post",
			url: hosts + "/user/delUser",
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
	toPage:function(page,e){
		var o = this;
		if(e){
			e.preventDefault();
		}
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
		
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getAllRPScore",
			data: {
				indexPage:indexPage,
				openid:k_openid,
				nickname:k_nickname,
				start_time:start_time,
				end_time:end_time,
				wx_group:wx_group,
				k_remark:k_remark,
				k_area:k_area,
				wx_user:wx_user,
				k_type_id:k_type_id,
				role_manage:role_manage,
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
	getXls:function(){
		/*生成openid.txt*/
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/getXls",
			data: {
				
			},
			success: function(data) {
				$('.successinfo').html('<p>导出成功</p>').removeClass("none");
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
				$("#file").html('<span class="am-icon-file-o"></span> <a target="_blank" href="'+hosts+'/txt/openlist.txt">openlist.txt</a>');
			}
		});
	},
	checkRole:function(){
		if(role_manage == 0){
			//如果没有管理员权限，只能看到自己的客户
			$("#wx_user").addClass("none");
		}
		if(role_send == 0){
			//没有派发权限
			$("#li_tab2").addClass("none");
		}
	},
	componentDidMount:function(){
		var o = this;
		/*权限判断*/
		this.checkRole();
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		this.toPage(1);
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
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		return(
				React.createElement("tr", null, 
				  React.createElement("td", null, c.openid), 
				  React.createElement("td", null, c.nickname), 
	              React.createElement("td", null, c.name), 
				  React.createElement("td", null, c.number), 
			      React.createElement("td", null, new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")), 
			      React.createElement("td", null, c.txtRemark)
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
			      React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "奖罚统计"), " / ", React.createElement("small", null, "列表"))
				), 
				
			
				React.createElement("div", {className: "am-tabs am-margin", "data-am-tabs": true}, 
				    React.createElement("ul", {className: "am-tabs-nav am-nav am-nav-tabs"}, 
				      React.createElement("li", {className: "am-active"}, React.createElement("a", {href: "#tab1"}, "奖罚情况")), 
				      React.createElement("li", {id: "li_tab2"}, React.createElement("a", {href: "#tab2"}, "群发新手红包"))
				    ), 
				    
				    React.createElement("div", {className: "am-tabs-bd"}, 
				      React.createElement("div", {className: "am-tab-panel am-fade am-in am-active", id: "tab1"}, 
				      
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
			          					React.createElement("button", {type: "button", onClick: this.ShowWin, className: "btn-c am-btn am-btn-default am-btn-xs btn-search"}, React.createElement("span", {className: "am-icon-hand-pointer-o"}), " 选择奖罚行为"), 
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
							                React.createElement("th", null, "奖罚行为"), 
						              		React.createElement("th", null, "奖罚内容"), 
						              		React.createElement("th", null, "时间"), 
						              		React.createElement("th", null, "备注")
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
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab2"}, 
				      	React.createElement("button", {type: "button", onClick: this.getXls, className: "am-btn am-btn-default"}, React.createElement("span", {className: "am-icon-file-excel-o"}), " 导出openid列表"), 						        
				      	React.createElement("div", {id: "file"}), 
				      	React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
					        React.createElement("div", {className: "am-panel-bd"}, 
					          React.createElement("p", null, React.createElement("span", {className: "am-icon-bookmark"}), " 说明："), 
					          React.createElement("p", null, "1.先点击导出openid.txt"), 
					          React.createElement("p", null, "2.进入微信支付商户平台-营销中心-现金红包-管理红包"), 
					          React.createElement("p", null, "3.点击发送红包，上传openid.txt")
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
				    React.createElement("div", {className: "am-modal-hd"}, "选择奖罚行为", 
				      React.createElement("a", {href: "javascript: void(0)", className: "am-close am-close-spin", "data-am-modal-close": true}, "×")
				    ), 
				    React.createElement("div", {className: "am-modal-bd"}, 
				      	React.createElement("div", {className: "action_check"}, 
						   	React.createElement("label", {for: "type_1"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "1", id: "type_1", "data-am-ucheck": true}), " 奖励积分"
							), 
							React.createElement("label", {for: "type_2"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "2", id: "type_2", "data-am-ucheck": true}), " 惩罚积分"
							), 
							React.createElement("label", {for: "type_3"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "3", id: "type_3", "data-am-ucheck": true}), " 奖励红包"
							), 
							React.createElement("label", {for: "type_4"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "4", id: "type_4", "data-am-ucheck": true}), " 奖励建定通天数"
							), 
							React.createElement("label", {for: "type_5"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "5", id: "type_5", "data-am-ucheck": true}), " 惩罚建定通天数"
							), 
							React.createElement("label", {for: "type_6"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "6", id: "type_6", "data-am-ucheck": true}), " 激活建定通账号"
							), 
							React.createElement("label", {for: "type_7"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "7", id: "type_7", "data-am-ucheck": true}), " 停用建定通账号"
							), 
							React.createElement("label", {for: "type_8"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "8", id: "type_8", "data-am-ucheck": true}), " 账号设置正常"
							), 
							React.createElement("label", {for: "type_9"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "9", id: "type_9", "data-am-ucheck": true}), " 账号设置异常"
							), 
							React.createElement("label", {for: "type_10"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "10", id: "type_10", "data-am-ucheck": true}), " 积分账户批准"
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