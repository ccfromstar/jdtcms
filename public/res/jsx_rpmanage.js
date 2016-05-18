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
		window.location = 'redpacketform.html';
	},
	readDoc:function(id){
		window.sessionStorage.setItem("readdocid",id);
		window.location = 'booking_read.html';
	},
	ShowWin:function(){
		$("#action_type").modal();
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
		window.location = 'redpacketform.html';
	},
	resetKey:function(){
		window.location.reload();
	},
	setType:function(){
		$('#k_type_id').val(this.jqchk('type_id'));
		$("#action_type").modal('close');
		this.toPage(1);
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
	delsql:function(){
		var o = this;
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/delRecord",
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
	backDoc:function(id,openid,score,money,e){
		var o = this;
		e.preventDefault();
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/backRecord",
			data: {
				id:id,
				openid:openid,
				score:score,
				money:money
			},
			success: function(data) {
				if(data == "300"){
					o.toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>退回成功</p>').removeClass("none");
					setTimeout(function() {
						$('.successinfo').addClass("none");
					}, 2000);
				}
			}
		});
	},
	sendDoc:function(id,openid,money,order_no,money_max,type_id,subject,description,send_name,body,e){
		var o = this;
		e.preventDefault();
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/sendRecord",
			data: {
				id:id,
				openid:openid,
				money:money,
				order_no:order_no,
				money_max:money_max,
				type_id:type_id,
				subject:subject,
				description:description,
				send_name:send_name,
				body:body
			},
			success: function(data) {
				if(data == "300"){
					o.toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>发放成功</p>').removeClass("none");
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
		
		var $modal = $('#my-modal-loading');
		$modal.modal();
		
		/*查询参数*/
		var k_openid = $("#k_openid").val();
		var k_nickname = $("#k_nickname").val();
		var k_name = $("#k_name").val();
		var start_time = $("#start_time").val();
		var end_time = $("#end_time").val();
		var k_type_id = $("#k_type_id").val();
		
		window.sessionStorage.setItem("indexPage",page);
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		
		indexPage = indexPage?indexPage:1;
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/getAllgetchangeRecord",
			data: {
				indexPage:indexPage,
				openid:k_openid,
				nickname:k_nickname,
				name:k_name,
				start_time:start_time,
				k_type_id:k_type_id,
				end_time:end_time
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
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		if(c.status_id == 1){
			return(
					React.createElement("tr", null, 
		              React.createElement("td", null, c.openid), 
		              React.createElement("td", null, c.nickname), 
		              React.createElement("td", null, c.score), 
		              React.createElement("td", null, c.name), 
		              React.createElement("td", null, new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")), 
		              React.createElement("td", null, c.sname), 
		              React.createElement("td", null, 
		                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
		                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
		                    React.createElement("button", {onClick: o.sendDoc.bind(o,c.id,c.openid,c.money,c.order_no,c.money_max,c.type_id,c.subject,c.description,c.send_name,c.body), className: "am-btn am-btn-default am-btn-xs am-text-secondary"}, React.createElement("span", {className: "am-icon-gavel"}), " 发放"), 
		                    React.createElement("button", {onClick: o.backDoc.bind(o,c.id,c.openid,c.score,c.money), className: "am-btn am-btn-default am-btn-xs am-text-danger"}, React.createElement("span", {className: "am-icon-reply"}), " 退回")
		                  )
		                )
		              )
		            )
			);	
		}else{
			return(
					React.createElement("tr", null, 
		              React.createElement("td", null, c.openid), 
		              React.createElement("td", null, c.nickname), 
		              React.createElement("td", null, c.score), 
		              React.createElement("td", null, c.name), 
		              React.createElement("td", null, new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")), 
		              React.createElement("td", null, c.sname), 
		              React.createElement("td", null, 
		                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
		                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}
		                    )
		                )
		              )
		            )
			);	
		}
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
			      React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "红包发放"), " / ", React.createElement("small", null, "列表"))
				), 
			    
			    React.createElement("div", {className: "am-g"}, 
			      React.createElement("div", {className: "am-u-sm-12 am-u-md-12 menu-search"}, 
			        React.createElement("div", {className: "am-btn-toolbar"}, 
			          	React.createElement("input", {type: "text", id: "k_openid", className: "am-input-sm search_input", placeholder: "openid"}), 
			          	React.createElement("input", {type: "text", id: "k_nickname", className: "am-input-sm search_input", placeholder: "昵称"}), 
			          	React.createElement("input", {type: "text", id: "k_name", className: "am-input-sm search_input", placeholder: "红包名称"}), 
			          	"兑换时间：", 
			          	React.createElement("input", {type: "text", id: "start_time", className: "am-form-field date_sel", placeholder: "开始日期", "data-am-datepicker": true, readOnly: true, required: true}), 
			          	React.createElement("input", {type: "text", id: "end_time", className: "am-form-field date_sel", placeholder: "结束日期", "data-am-datepicker": true, readOnly: true, required: true}), 
			          	React.createElement("input", {type: "hidden", id: "k_type_id", onClick: this.ShowWin, className: "am-input-sm search_input", placeholder: "状态", readOnly: true}), 	
			          	React.createElement("button", {type: "button", onClick: this.ShowWin, className: "btn-c am-btn am-btn-default am-btn-xs btn-search"}, React.createElement("span", {className: "am-icon-hand-pointer-o"}), " 选择状态"), 
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
				                React.createElement("th", null, "兑换人openid"), 
				                React.createElement("th", null, "兑换人昵称"), 
				                React.createElement("th", null, "兑换积分"), 
				                React.createElement("th", null, "兑换名称"), 
				                React.createElement("th", null, "兑换时间"), 
				                React.createElement("th", null, "状态"), 
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
				    React.createElement("div", {className: "am-modal-hd"}, "选择状态", 
				      React.createElement("a", {href: "javascript: void(0)", className: "am-close am-close-spin", "data-am-modal-close": true}, "×")
				    ), 
				    React.createElement("div", {className: "am-modal-bd"}, 
				      	React.createElement("div", {className: "action_check"}, 
						   	React.createElement("label", {for: "type_1"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "1", id: "type_1", "data-am-ucheck": true}), " 审核中"
							), 
							React.createElement("label", {for: "type_2"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "2", id: "type_2", "data-am-ucheck": true}), " 已发放"
							), 
							React.createElement("label", {for: "type_3"}, 
								React.createElement("input", {type: "checkbox", name: "type_id", value: "3", id: "type_3", "data-am-ucheck": true}), " 兑换失败"
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