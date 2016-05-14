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
	ActiveDoc:function(id,e){
		e.preventDefault();
		var o = this;
		$.ajax({
			type: "post",
			url: hosts + "/jdtuser/activeUser",
			data: {
				id:id
			},
			success: function(data) {
				if(data == "300"){
					o.toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>激活成功</p>').removeClass("none");
					setTimeout(function() {
						$('.successinfo').addClass("none");
					}, 2000);
				}
			}
		});
	},
	disActiveDoc:function(id,e){
		e.preventDefault();
		var o = this;
		$.ajax({
			type: "post",
			url: hosts + "/jdtuser/disactiveUser",
			data: {
				id:id
			},
			success: function(data) {
				if(data == "300"){
					o.toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>停权成功</p>').removeClass("none");
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
		$.ajax({
			type: "post",
			url: hosts + "/jdtuser/getUser",
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
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		$.ajax({
			type: "post",
			url: hosts + "/jdtuser/getUser",
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
			var limited = c.limited?new Date(c.limited).Format("yyyy-MM-dd hh:mm:ss"):"";
			if(c.state_id == 0){
				return(
					React.createElement("tr", null, 
		              React.createElement("td", null, c.name), 
		              React.createElement("td", null, c.mobile), 
		              React.createElement("td", null, c.company), 
		              React.createElement("td", null, c.address), 
		              React.createElement("td", null, c.job), 
		              React.createElement("td", null, c.type), 
		              React.createElement("td", null, limited), 
		              React.createElement("td", null, c.username), 
		              React.createElement("td", null, c.password), 
		              React.createElement("td", null, c.applytime?new Date(c.applytime).Format("yyyy-MM-dd hh:mm:ss"):""), 
		              React.createElement("td", null, c.state_id == 0?'未激活':'已激活'), 
		              React.createElement("td", null, 
		                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
		                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
		                    React.createElement("button", {onClick: o.ActiveDoc.bind(o,c.id), className: "am-btn am-btn-default am-btn-xs am-text-secondary"}, React.createElement("span", {className: "am-icon-bell"}), " 激活")
		                  )
		                )
		              )
		            )
				);
			}else{
				return(
					React.createElement("tr", null, 
		              React.createElement("td", null, c.name), 
		              React.createElement("td", null, c.mobile), 
		              React.createElement("td", null, c.company), 
		              React.createElement("td", null, c.address), 
		              React.createElement("td", null, c.job), 
		              React.createElement("td", null, c.type), 
		              React.createElement("td", null, limited), 
		              React.createElement("td", null, c.username), 
		              React.createElement("td", null, c.password), 
		              React.createElement("td", null, c.applytime?new Date(c.applytime).Format("yyyy-MM-dd hh:mm:ss"):""), 
		              React.createElement("td", null, c.state_id == 0?'未激活':'已激活'), 
		              React.createElement("td", null, 
		                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
		                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
		                  	React.createElement("button", {onClick: o.disActiveDoc.bind(o,c.id), className: "am-btn am-btn-default am-btn-xs am-text-danger"}, React.createElement("span", {className: "am-icon-ban"}), " 停权")
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
			      React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "建定通账户管理"), " / ", React.createElement("small", null, "列表"))
				), 
			    React.createElement("div", {className: "am-g"}, 
			      React.createElement("div", {className: "am-u-sm-12 am-u-md-12"}, 
			        React.createElement("div", {className: "am-btn-toolbar"}, 
			          React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
			            React.createElement("button", {id: "btn_add", type: "button", onClick: this.newDoc, className: "am-btn am-btn-default none"}, React.createElement("span", {className: "am-icon-plus"}), " 新增")
			          )
			        )
			      )
			    ), 
			    
			    React.createElement("div", {className: "am-g"}, 
				    React.createElement("div", {className: "am-u-sm-12"}, 
				        React.createElement("form", {className: "am-form"}, 
				          React.createElement("table", {className: "am-table am-table-striped am-table-hover table-main jdt-table"}, 
				            React.createElement("thead", null, 
				              React.createElement("tr", null, 
				                React.createElement("th", null, "姓名"), 
			            		React.createElement("th", null, "手机"), 
			            		React.createElement("th", null, "所属公司"), 
			            		React.createElement("th", null, "地址"), 
			            		React.createElement("th", null, "职务"), 
			            		React.createElement("th", null, "帐户类型"), 
			            		React.createElement("th", null, "账号有效期"), 
			            		React.createElement("th", null, "账号"), 
			            		React.createElement("th", null, "密码"), 
			            		React.createElement("th", null, "激活时间"), 
			            		React.createElement("th", null, "激活状态"), 
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