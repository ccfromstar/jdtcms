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
	UpdateRedpacket:function(){
		var redpacket_min = $("#redpacket_min").val();
		var redpacket_max = $("#redpacket_max").val();
		if(isNaN(redpacket_min) || isNaN(redpacket_max)){
			$('.errorinfo').html('<p>只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		var that = this;

		$.ajax({
			type: "post",
			url: hosts + "/settings/updateRedPacketSettings",
			data: {
				redpacket_min:redpacket_min,
				redpacket_max:redpacket_max
			},
			success: function(data) {
				that.setSettings();
				$('.successinfo').html('<p>设置成功</p>').removeClass("none");
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
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
			url: hosts + "/redpacket/getRecord",
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
	setSettings:function(){
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/settings/getSettings",
			data: {
				
			},
			success: function(data) {
				$("#redpacket_min").val(data[0].redpacket_min);
				$("#redpacket_max").val(data[0].redpacket_max);
				$modal.modal('close');
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
			url: hosts + "/redpacket/getRecord",
			data: {
				indexPage:indexPage
			},
			success: function(data) {
				o.setState({data:data.record});
				o.setState({total:data.total});
				o.setState({totalpage:data.totalpage});
				o.setState({isFirst:(data.isFirstPage?"am-disabled":"")});
				o.setState({isLast:(data.isLastPage?"am-disabled":"")});
				o.setSettings();
				$modal.modal('close');
			}
		});
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		return(
				React.createElement("tr", null, 
	              React.createElement("td", null, c.money==-1?"随机金额":c.money+"元"), 
	              React.createElement("td", null, c.score), 
	              React.createElement("td", null, 
	                React.createElement("div", {className: "am-hide-sm-only am-btn-toolbar"}, 
	                  React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
	                    React.createElement("button", {onClick: o.editDoc.bind(o,c.id,c.startDate), className: "am-btn am-btn-default am-btn-xs am-text-secondary"}, React.createElement("span", {className: "am-icon-pencil-square-o"}), " 编辑"), 
	                    React.createElement("button", {onClick: o.delDoc.bind(o,c.id), className: "am-btn am-btn-default am-btn-xs am-text-danger"}, React.createElement("span", {className: "am-icon-trash-o"}), " 删除")
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
			      React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "红包设定"), " / ", React.createElement("small", null, "列表"))
				), 
				
				
				React.createElement("div", {className: "am-tabs am-margin", "data-am-tabs": true}, 
				    React.createElement("ul", {className: "am-tabs-nav am-nav am-nav-tabs"}, 
				      React.createElement("li", {className: "am-active"}, React.createElement("a", {href: "#tab1"}, "固定金额红包")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab2"}, "随机金额红包"))
				    ), 
				
				    React.createElement("div", {className: "am-tabs-bd"}, 
				      React.createElement("div", {className: "am-tab-panel am-fade am-in am-active", id: "tab1"}, 
				      		React.createElement("div", {className: "am-g"}, 
						      React.createElement("div", {className: "am-u-sm-12 am-u-md-12"}, 
						        React.createElement("div", {className: "am-btn-toolbar"}, 
						          React.createElement("div", {className: "am-btn-group am-btn-group-xs"}, 
						            React.createElement("button", {id: "btn_add", type: "button", onClick: this.newDoc, className: "am-btn am-btn-default"}, React.createElement("span", {className: "am-icon-plus"}), " 新增")
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
							                React.createElement("th", null, "红包金额"), 
							                React.createElement("th", null, "所需积分"), 
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
							)
				      ), 
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab2"}, 
				      		React.createElement("div", {className: "am-form"}, 
				      			"金额范围：", React.createElement("input", {type: "text", id: "redpacket_min", className: "am-input-sm settings_input", defaultValue: "0"}), " ~ ", React.createElement("input", {type: "text", id: "redpacket_max", className: "am-input-sm settings_input", defaultValue: "0"}), 
				      			React.createElement("button", {type: "button", onClick: this.UpdateRedpacket, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "保存")
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