var R_content = React.createClass({displayName: "R_content",
	getInitialState: function() { 
		return {data: [],total:0,totalpage: [],isFirst:"am-disabled",isLast:"am-disabled"};
	},
	cancleDoc:function(){
		history.go(-1);
	},
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var openid = window.sessionStorage.getItem("openid");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserByopenid",
			data: {
				id:openid
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
		/*获取操作详情*/
		var id = window.sessionStorage.getItem("readdocid");
		$.ajax({
			type: "post",
			url: hosts + "/wx_record/getUserByopenid",
			data: {
				id:openid
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

		return(
			React.createElement("div", {className: "admin-content"}, 
			
			   	React.createElement("div", {className: "am-cf am-padding"}, 
					React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "关注者详情"), " / ", React.createElement("small", null, "查看"))
				), 
			    
			    React.createElement("div", {className: "am-tabs am-margin", "data-am-tabs": true}, 
				    React.createElement("ul", {className: "am-tabs-nav am-nav am-nav-tabs"}, 
				      React.createElement("li", {className: "am-active"}, React.createElement("a", {href: "#tab1"}, "关注者基本信息")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab2"}, "操作详情"))
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
					            React.createElement("div", {id: "remark", className: "am-u-sm-8 am-u-md-10"})
					            
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 
					            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "分组"
					            ), 
					            React.createElement("div", {id: "groupid", className: "am-u-sm-8 am-u-md-10"}
					            )
					            
					        ), 

					        React.createElement("div", {className: "am-g am-margin-top"}, 

							    React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
					              "所属客服"
					            ), 
					            React.createElement("div", {id: "user_id", className: "am-u-sm-8 am-u-md-10"})
					            

					        )
				        )
				      ), 
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab2"}, 
				       	React.createElement("div", {className: "am-form"}
				      
				        )
				      )
				    )
				), 
				
				React.createElement("div", {className: "am-margin"}, 
				    React.createElement("button", {type: "button", onClick: this.cancleDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "关闭")
				)
			)
		);
	}
});