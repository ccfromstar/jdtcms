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
	resetKey:function(){
		window.location.reload();
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
		var meetingname = $("#meetingname").val();
		var company = $("#company").val();
		var start_time = $("#start_time").val();
		var end_time = $("#end_time").val();
		var linkman = $("#linkman").val();
		var address = $("#address").val();
		var phone = $("#phone").val();
		var remark = $("#remark").val();
		var state_id = $("#state_id").val();
		
		$.ajax({
			type: "post",
			url: hosts + "/user/getMeeting",
			data: {
				indexPage:indexPage,
				cid:id,
				meetingname:meetingname,
				company:company,
				start_time:start_time,
				end_time:end_time,
				linkman:linkman,
				address:address,
				phone:phone,
				remark:remark,
				state_id:state_id
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
	componentDidMount:function(){
		var o = this;
		$("#start_time").bind("click",function(){
			$('#start_time').datepicker('open');
		});
		$("#end_time").bind("click",function(){
			$('#end_time').datepicker('open');
		});
		this.toPage(1);
	},
	ShowWin:function(id,state_id,remark,e){
		if(e){
			e.preventDefault();
		}
		window.sessionStorage.setItem("meetingid",id);
		
		$("#w_state_id").val(state_id);
		$("#w_remark").val(remark);
		$("#action_type").modal();
	},
	setMeeting:function(e){
		var o = this;
		if(e){
			e.preventDefault();
		}
		var meetingid = window.sessionStorage.getItem('meetingid');
		var w_remark = $("#w_remark").val();
		var w_state_id = $("#w_state_id").val();
		$("#action_type").modal('close');
		$.ajax({
			type: "post",
			url: hosts + "/user/updateMeeting",
			data: {
				meetingid:meetingid,
				w_remark:w_remark,
				w_state_id:w_state_id
			},
			success: function(data) {
				o.toPage(window.sessionStorage.getItem("indexPage"));
				$('.successinfo').html('<p>修改成功</p>').removeClass("none");
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
			}
		});
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		return(
				React.createElement("tr", null, 
	              React.createElement("td", null, c.meetingname), 
	              React.createElement("td", null, c.company), 
	              React.createElement("td", null, c.linkman), 
	              React.createElement("td", null, c.address), 
	              React.createElement("td", null, c.phone), 
	              React.createElement("td", null, c.custfrom), 
	              React.createElement("td", null, c.state_id==0?"未处理":"已联系"), 
	              React.createElement("td", null, c.remark), 
	              React.createElement("td", null, c.signDate), 
	              React.createElement("td", null, 
	                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
	                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
	                    React.createElement("button", {onClick: o.ShowWin.bind(o,c.id,c.state_id,c.remark), className: "am-btn am-btn-default am-btn-xs am-text-secondary"}, React.createElement("span", {className: "am-icon-edit"}), " 修改")
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
			      React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "报名管理"), " / ", React.createElement("small", null, "列表"))
				), 
			    React.createElement("div", {className: "am-g"}, 
			      React.createElement("div", {className: "am-u-sm-12 am-u-md-12"}, 
			        React.createElement("div", {className: "am-btn-toolbar"}, 
			          React.createElement("div", {className: "am-btn-group am-btn-group-xs"}
			          )
			        )
			      )
			    ), 
			    
			    React.createElement("div", {className: "am-g"}, 
			      React.createElement("div", {className: "am-u-sm-12 am-u-md-12 menu-search"}, 
			        React.createElement("div", {className: "am-btn-toolbar"}, 
			          		React.createElement("input", {type: "text", id: "meetingname", className: "am-input-sm search_input", placeholder: "会议名"}), 
			          		React.createElement("input", {type: "text", id: "company", className: "am-input-sm search_input", placeholder: "公司"}), 
			          		React.createElement("input", {type: "text", id: "linkman", className: "am-input-sm search_input", placeholder: "联系人"}), 
			          		React.createElement("input", {type: "text", id: "address", className: "am-input-sm search_input", placeholder: "地址"}), 
			          		React.createElement("input", {type: "text", id: "phone", className: "am-input-sm search_input", placeholder: "手机号"}), 
			          		React.createElement("input", {type: "text", id: "remark", className: "am-input-sm search_input", placeholder: "备注"}), 
			          		"申请日期：", 
			          		React.createElement("input", {type: "text", id: "start_time", className: "am-form-field date_sel", placeholder: "开始日期", "data-am-datepicker": true, readOnly: true, required: true}), 
			          		React.createElement("input", {type: "text", id: "end_time", className: "am-form-field date_sel", placeholder: "结束日期", "data-am-datepicker": true, readOnly: true, required: true}), 
			          		React.createElement("select", {id: "state_id", className: "sel_user"}, 
			          			React.createElement("option", {value: "-"}, "状态"), 
			          			React.createElement("option", {value: "0"}, "未处理"), 
			          			React.createElement("option", {value: "1"}, "已联系")
			          		), 
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
				                React.createElement("th", null, "会议名"), 
				                React.createElement("th", null, "公司"), 
				                React.createElement("th", null, "联系人"), 
				                React.createElement("th", null, "地址"), 
				                React.createElement("th", null, "手机号"), 
				                React.createElement("th", null, "类型"), 
				                React.createElement("th", null, "状态"), 
				                React.createElement("th", null, "备注"), 
				                React.createElement("th", null, "申请日期"), 
				                React.createElement("th", null, "操作")
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
				    React.createElement("div", {className: "am-modal-hd"}, "修改状态和备注", 
				      React.createElement("a", {href: "javascript: void(0)", className: "am-close am-close-spin", "data-am-modal-close": true}, "×")
				    ), 
				    
				    React.createElement("div", {className: "am-modal-bd"}, 
				    	React.createElement("div", {className: "am-form"}, 
				    		React.createElement("div", {className: "am-g am-margin-top"}, 
						        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
						            "备注"
						        ), 
						        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
						            React.createElement("input", {type: "text", id: "w_remark", className: "am-input-sm"})
						        ), 
						        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
						    ), 
						    
						    React.createElement("div", {className: "am-g am-margin-top"}, 
						        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
						            "状态"
						        ), 
						        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
						        	React.createElement("select", {id: "w_state_id", className: "sel_user"}, 
					          			React.createElement("option", {value: "0"}, "未处理"), 
					          			React.createElement("option", {value: "1"}, "已联系")
					          		)
						        ), 
						        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
						    )
				    	), 
					    
					    React.createElement("p", null, " "), 
						React.createElement("button", {type: "button", onClick: this.setMeeting, className: "btn-c am-btn am-btn-primary am-btn-xs btn-search"}, "确定")
			          		
				    )
				  )
				)
			)
		);
	}
});