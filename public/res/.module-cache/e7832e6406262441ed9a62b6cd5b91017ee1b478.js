/*表单信息*/
var R_content = React.createClass({displayName: "R_content",
	getInitialState:function(){
		var mode = window.sessionStorage.getItem('mode');
		var smallname = (mode == "edit")?"编辑":"新建";
		var role = window.sessionStorage.getItem('crole');
        return {smallname:smallname};
    },
	createDoc:function(){
		var username = $('#username').val();
		var password = $('#password').val();
		var name = $('#name').val();
		var role = jqradio('role');
		
		var mode = window.sessionStorage.getItem('mode');
		
		if (!username) {
			$('.errorinfo').html('<p>手机号不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!password) {
			$('.errorinfo').html('<p>密码不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!name) {
			$('.errorinfo').html('<p>姓名不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!role) {
			$('.errorinfo').html('<p>权限不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		
		$.ajax({
			type: "post",
			url: hosts + "/service/createUser",
			data: {
				mode:mode,
				username:username,
				password:password,
				name:name,
				role:role,
				editid: window.sessionStorage.getItem("editid")
			},
			success: function(data) {
				console.log(data);
				if(data == "300"){
					$('.successinfo').html('<p>保存成功</p>').removeClass("none");
					setTimeout(function() {
						window.location = 'user.html';
					}, 1000);
				}else if(data == "400"){
					$('.errorinfo').html('<p>手机号码重复</p>').removeClass("none");
					setTimeout(function() {
						$('.errorinfo').addClass("none");
					}, 2000);
				}
			}
		});
	},
	cancleDoc:function(){
		window.location = 'user.html';
	},
	componentDidMount:function(){
		var o = this;
		var mode = window.sessionStorage.getItem('mode');
		if(mode == "edit"){
			var editid = window.sessionStorage.getItem("editid");
			$.ajax({
				type: "post",
				url: hosts + "/service/getUserById",
				data: {
					id:editid
				},
				success: function(data) {
					$('#username').val(data[0].username);
					$('#password').val(data[0].password);
					$('#name').val(data[0].name);
					if(data[0].role == "业务员"){
						$("#role_div").find("label").eq(0).addClass("am-active");
						$("#role_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].role == "管理员"){
						$("#role_div").find("label").eq(1).addClass("am-active");
						$("#role_div").find("input").eq(1).attr("checked","checked");
					}
				}
			});
		}
	},
	render:function(){
		return(
			React.createElement("div", {className: "admin-content"}, 
			
			   	React.createElement("div", {className: "am-cf am-padding"}, 
					React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "用户信息表"), " / ", React.createElement("small", null, this.state.smallname))
				), 
			    
			    React.createElement("div", {className: "am-form"}, 
				   
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "手机号"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "username", className: "am-input-sm"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "密码"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "password", className: "am-input-sm"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "姓名"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "name", className: "am-input-sm"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "基础权限"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				        	React.createElement("div", {className: "am-btn-group", id: "role_basic_div", "data-am-button": true}, 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_basic", value: "开"}, "开")
					            ), 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_basic", value: "关"}, "关")
					            )
					        )
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
				    ), 

				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "管理权限"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				        	React.createElement("div", {className: "am-btn-group", id: "role_manage_div", "data-am-button": true}, 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_manage", value: "开"}, "开")
					            ), 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_manage", value: "关"}, "关")
					            )
					        )
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
				    ), 

				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "派发权限"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				        	React.createElement("div", {className: "am-btn-group", id: "role_send_div", "data-am-button": true}, 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_send", value: "开"}, "开")
					            ), 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_send", value: "关"}, "关")
					            )
					        )
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
				    ), 

				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "自定义派发权限"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				        	React.createElement("div", {className: "am-btn-group", id: "role_custom_div", "data-am-button": true}, 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_custom", value: "开"}, "开")
					            ), 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_custom", value: "关"}, "关")
					            )
					        )
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
				    ), 

				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "系统权限"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				        	React.createElement("div", {className: "am-btn-group", id: "role_option_div", "data-am-button": true}, 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_option", value: "开"}, "开")
					            ), 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "role_option", value: "关"}, "关")
					            )
					        )
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
				    ), 
				  	
				  	React.createElement("div", {class: "am-panel am-panel-default admin-sidebar-panel"}, 
				        React.createElement("div", {class: "am-panel-bd"}, 
				          React.createElement("p", null, React.createElement("span", {class: "am-icon-bookmark"}), " 说明"), 
				          React.createElement("p", null)
				        )
				    )
				), 
				
				React.createElement("div", {className: "am-margin"}, 
				    React.createElement("button", {type: "button", onClick: this.createDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "保存"), 
				    React.createElement("button", {type: "button", onClick: this.cancleDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "关闭")
				)
			)
		);
	}
});