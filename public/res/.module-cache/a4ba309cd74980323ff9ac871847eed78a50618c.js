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
		var role_basic = jqradio('role_basic');
		var role_manage = jqradio('role_manage');
		var role_send = jqradio('role_send');
		var role_custom = jqradio('role_custom');
		var role_option = jqradio('role_option');
		
		var mode = window.sessionStorage.getItem('mode');
		
		if (!username) {
			$('.errorinfo').html('<p>用户名不能为空</p>').removeClass("none");
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
		
		$.ajax({
			type: "post",
			url: hosts + "/user/createUser",
			data: {
				mode:mode,
				username:username,
				password:password,
				name:name,
				role_basic:role_basic,
				role_manage:role_manage,
				role_send:role_send,
				role_custom:role_custom,
				role_option:role_option,
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
					$('.errorinfo').html('<p>用户名重复</p>').removeClass("none");
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
				url: hosts + "/user/getUserById",
				data: {
					id:editid
				},
				success: function(data) {
					$('#username').val(data[0].username);
					$('#password').val(data[0].password);
					$('#name').val(data[0].name);
					if(data[0].role_basic == 1){
						$("#role_basic_div").find("label").eq(0).addClass("am-active");
						$("#role_basic_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].role_basic == 0){
						$("#role_basic_div").find("label").eq(1).addClass("am-active");
						$("#role_basic_div").find("input").eq(1).attr("checked","checked");
					}

					if(data[0].role_manage == 1){
						$("#role_manage_div").find("label").eq(0).addClass("am-active");
						$("#role_manage_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].role_manage == 0){
						$("#role_manage_div").find("label").eq(1).addClass("am-active");
						$("#role_manage_div").find("input").eq(1).attr("checked","checked");
					}

					if(data[0].role_send == 1){
						$("#role_send_div").find("label").eq(0).addClass("am-active");
						$("#role_send_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].role_send == 0){
						$("#role_send_div").find("label").eq(1).addClass("am-active");
						$("#role_send_div").find("input").eq(1).attr("checked","checked");
					}

					if(data[0].role_custom == 1){
						$("#role_custom_div").find("label").eq(0).addClass("am-active");
						$("#role_custom_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].role_custom == 0){
						$("#role_custom_div").find("label").eq(1).addClass("am-active");
						$("#role_custom_div").find("input").eq(1).attr("checked","checked");
					}

					if(data[0].role_option == 1){
						$("#role_option_div").find("label").eq(0).addClass("am-active");
						$("#role_option_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].role_option == 0){
						$("#role_option_div").find("label").eq(1).addClass("am-active");
						$("#role_option_div").find("input").eq(1).attr("checked","checked");
					}
				}
			});
		}else{
			$("#role_basic_div").find("label").eq(0).addClass("am-active");
			$("#role_basic_div").find("input").eq(0).attr("checked","checked");

			$("#role_manage_div").find("label").eq(1).addClass("am-active");
			$("#role_manage_div").find("input").eq(1).attr("checked","checked");

			$("#role_send_div").find("label").eq(1).addClass("am-active");
			$("#role_send_div").find("input").eq(1).attr("checked","checked");

			$("#role_custom_div").find("label").eq(1).addClass("am-active");
			$("#role_custom_div").find("input").eq(1).attr("checked","checked");

			$("#role_option_div").find("label").eq(1).addClass("am-active");
			$("#role_option_div").find("input").eq(1).attr("checked","checked");
		}
	},
	render:function(){
		return(
			React.createElement("div", {className: "admin-content"}, 
			
			   	React.createElement("div", {className: "am-cf am-padding"}, 
					React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "红包表"), " / ", React.createElement("small", null, this.state.smallname))
				), 
			    
			    React.createElement("div", {className: "am-form"}, 
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "红包金额"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "money", className: "am-input-sm"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
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