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
	toPage:function(page,e){
		var o = this;
		if(e){
			e.preventDefault();
		}
		window.sessionStorage.setItem("indexPage",page);
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		var role = window.sessionStorage.getItem("crole");
		indexPage = indexPage?indexPage:1;
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getAllRPScore",
			data: {
				indexPage:indexPage
			},
			success: function(data) {
				o.setState({data:data.record});
				o.setState({total:data.total});
				o.setState({totalpage:data.totalpage});
				o.setState({isFirst:(data.isFirstPage?"am-disabled":"")});
				o.setState({isLast:(data.isLastPage?"am-disabled":"")});
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
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getAllRPScore",
			data: {
				indexPage:indexPage
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
			      React.createElement("td", null, c.txtRemark), 
	              React.createElement("td", null, 
	                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
	                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}
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
			      React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "奖罚统计"), " / ", React.createElement("small", null, "列表"))
				), 
				
			
				React.createElement("div", {className: "am-tabs am-margin", "data-am-tabs": true}, 
				    React.createElement("ul", {className: "am-tabs-nav am-nav am-nav-tabs"}, 
				      React.createElement("li", {className: "am-active"}, React.createElement("a", {href: "#tab1"}, "奖罚情况")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab2"}, "群发新手红包"))
				    ), 
				    
				    React.createElement("div", {className: "am-tabs-bd"}, 
				      React.createElement("div", {className: "am-tab-panel am-fade am-in am-active", id: "tab1"}, 
				      		
						    React.createElement("div", {className: "am-g"}, 
							    React.createElement("div", {className: "am-u-sm-12"}, 
							        React.createElement("form", {className: "am-form"}, 
							          React.createElement("table", {className: "am-table am-table-striped am-table-hover table-main"}, 
							            React.createElement("thead", null, 
							              React.createElement("tr", null, 
							              	React.createElement("th", null, "openid"), 
							              	React.createElement("th", null, "昵称"), 
							                React.createElement("th", null, "奖罚行为"), 
						              		React.createElement("th", null, "奖罚内容"), 
						              		React.createElement("th", null, "时间"), 
						              		React.createElement("th", null, "备注"), 
						            		React.createElement("th", {className: "am-hide-sm-only table-set"})
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
				)
			)
		);
	}
});