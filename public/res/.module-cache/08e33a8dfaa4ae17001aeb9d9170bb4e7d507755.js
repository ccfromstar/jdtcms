/*表单信息*/
var R_content = React.createClass({displayName: "R_content",
	getInitialState:function(){
		var mode = window.sessionStorage.getItem('mode');
		var smallname = (mode == "edit")?"编辑":"新建";
		var role = window.sessionStorage.getItem('crole');
        return {smallname:smallname};
    },
	createDoc:function(){
		var title = $('#title').val();
		var password = $('#password').val();
		
		var mode = window.sessionStorage.getItem('mode');
		
		if (!title) {
			$('.errorinfo').html('<p>软文标题不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		
		$.ajax({
			type: "post",
			url: hosts + "/post/createPost",
			data: {
				mode:mode,
				title:title,
				
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
		history.go(-1);
	},
	componentDidMount:function(){
		var editor;
	    KindEditor.ready(function(k){
	        editor = k.create('#post');
	    });
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
					React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "软文信息表"), " / ", React.createElement("small", null, this.state.smallname))
				), 
			    
			    React.createElement("div", {className: "am-form"}, 
				   
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2"}, 
				            "软文标题"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "title", className: "am-input-sm"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-12 am-u-md-12"}, 
				            React.createElement("textarea", {id: "post", name: "post"})
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