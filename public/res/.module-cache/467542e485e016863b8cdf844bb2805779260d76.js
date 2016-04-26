var R_content = React.createClass({displayName: "R_content",
	componentDidMount:function(){
		this.setSettings();
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
				$("#score_focus").val(data[0].score_focus);
				$("#score_read").val(data[0].score_read);
				$("#score_like").val(data[0].score_like);
				$("#score_transpond").val(data[0].score_transpond);
				$modal.modal('close');
			}
		});
	},
	UpdateDoc:function(e){
		e.preventDefault();

		var score_focus = $("#score_focus").val();
		var score_read = $("#score_read").val();
		var score_like = $("#score_like").val();
		var score_transpond = $("#score_transpond").val();

		var that = this;

		$.ajax({
			type: "post",
			url: hosts + "/settings/updateSettings",
			data: {
				score_focus:score_focus,
				score_read:score_read,
				score_like:score_like,
				score_transpond:score_transpond,
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
	render:function(){
		return(
			React.createElement("div", {className: "admin-content"}, 
			
			   	React.createElement("div", {className: "am-cf am-padding"}, 
					React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "系统设定"), " / ", React.createElement("small", null, "设置"))
				), 

				React.createElement("div", {className: "am-form"}, 
				   
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				    	React.createElement("div", {className: "am-u-sm-12 am-u-md-12 am-text-left"}, 
				       		"首次关注获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_focus", className: "am-input-sm settings_input"})
				       		
				       	)
				    ), 

				    React.createElement("div", {className: "am-g am-margin-top"}, 
				    	React.createElement("div", {className: "am-u-sm-12 am-u-md-12 am-text-left"}, 
				       		"阅读软文获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_read", className: "am-input-sm settings_input"})
				       		
				       	)
				    ), 

				    React.createElement("div", {className: "am-g am-margin-top"}, 
				    	React.createElement("div", {className: "am-u-sm-12 am-u-md-12 am-text-left"}, 
				       		"点赞软文获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_like", className: "am-input-sm settings_input"})
				       		
				       	)
				    ), 

				    React.createElement("div", {className: "am-g am-margin-top"}, 
				    	React.createElement("div", {className: "am-u-sm-12 am-u-md-12 am-text-left"}, 
				       		"转发软文获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_transpond", className: "am-input-sm settings_input"})
				       		
				       	)
				    ), 

				    React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
				        React.createElement("div", {className: "am-panel-bd"}, 
				          React.createElement("p", null, React.createElement("span", {className: "am-icon-bookmark"}), " 说明"), 
				          React.createElement("p", null, "基础权限：可登录管理系统，修改自身帐号密码，仅可查询自己所辖关注者基本信息及行为记录或激活建定通帐号。"), 
						  React.createElement("p", null, "管理权限：可查询所有关注者基本信息及行为记录，为关注者分配客服。"), 	
						  React.createElement("p", null, "派发权限：可派发新手红包，批准关注者积分兑换红包请求。"), 
						  React.createElement("p", null, "自定义派发权限：可自定义增减关注者积分、建定通使用天数、红包金额。"), 
						  React.createElement("p", null, "系统权限：可进入“系统参数”页面定义系统各关键参数，管理所有管理帐号（添加帐号、停权帐号、修改密码、增删权限），也可进入“服务号管理”页面发送服务号软文，向关注者群发信息。")
				        )
				    )

				), 
			    
			  
				
				React.createElement("div", {className: "am-margin"}, 
				   React.createElement("button", {type: "button", onClick: this.UpdateDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "保存")
				)
			)
		);
	}
});