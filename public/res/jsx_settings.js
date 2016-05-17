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
				$("#day_initial").val(data[0].day_initial);
				$("#day_read").val(data[0].day_read);
				$("#day_like").val(data[0].day_like);
				$("#day_transpond").val(data[0].day_transpond);
				$("#day_share").val(data[0].day_share);
				$("#score_focus").val(data[0].score_focus);
				$("#score_read").val(data[0].score_read);
				$("#score_like").val(data[0].score_like);
				$("#score_transpond").val(data[0].score_transpond);
				$("#score_share").val(data[0].score_share);
				$("#score_admin_focus").val(data[0].score_admin_focus);
				$("#score_admin_read").val(data[0].score_admin_read);
				$("#score_admin_like").val(data[0].score_admin_like);
				$("#score_admin_transpond").val(data[0].score_admin_transpond);
				$("#score_admin_share").val(data[0].score_admin_share);
				$("#model").val(data[0].model);
				$modal.modal('close');
			}
		});
	},
	UpdateDoc:function(e){
		e.preventDefault();

		var day_initial = $("#day_initial").val();
		var day_read = $("#day_read").val();
		var day_like = $("#day_like").val();
		var day_transpond = $("#day_transpond").val();
		var day_share = $("#day_share").val();

		var score_focus = $("#score_focus").val();
		var score_read = $("#score_read").val();
		var score_like = $("#score_like").val();
		var score_transpond = $("#score_transpond").val();
		var score_share = $("#score_share").val();

		var score_admin_focus = $("#score_admin_focus").val();
		var score_admin_read = $("#score_admin_read").val();
		var score_admin_like = $("#score_admin_like").val();
		var score_admin_transpond = $("#score_admin_transpond").val();
		var score_admin_share = $("#score_admin_share").val();
		
		var model = $("#model").val();

		if(isNaN(day_share) || isNaN(score_share) || isNaN(day_initial) || isNaN(day_read) || isNaN(day_like) || isNaN(day_transpond) || isNaN(score_focus) || isNaN(score_read) || isNaN(score_like) || isNaN(score_transpond) || isNaN(score_admin_focus) || isNaN(score_admin_read) || isNaN(score_admin_like) || isNaN(score_admin_transpond) || isNaN(score_admin_share)){
			$('.errorinfo').html('<p>只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}

		var that = this;

		$.ajax({
			type: "post",
			url: hosts + "/settings/updateSettings",
			data: {
				day_initial:day_initial,
				day_read:day_read,
				day_like:day_like,
				day_transpond:day_transpond,
				day_share:day_share,
				score_focus:score_focus,
				score_read:score_read,
				score_like:score_like,
				score_transpond:score_transpond,
				score_share:score_share,
				score_admin_focus:score_admin_focus,
				score_admin_read:score_admin_read,
				score_admin_like:score_admin_like,
				score_admin_transpond:score_admin_transpond,
				score_admin_share:score_admin_share,
				model:model
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
					React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
				        React.createElement("div", {className: "am-panel-bd"}, 
				          React.createElement("p", null, React.createElement("span", {className: "am-icon-bookmark"}), " 基础参数："), 
				          React.createElement("p", null, "首次激活建定通帐号的初始使用天数", 
				       		React.createElement("input", {type: "text", id: "day_initial", className: "am-input-sm settings_input"})), 
				       	  React.createElement("p", null, "积分模式切换",  
				       	  React.createElement("select", {id: "model", className: "sel_model"}, 
				       	  		React.createElement("option", {value: "0"}, "非审核"), 
				       	  		React.createElement("option", {value: "1"}, "审核")
				       	  )
				       	  )		
						)
				    ), 
				    React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
				        React.createElement("div", {className: "am-panel-bd"}, 
				          React.createElement("p", null, React.createElement("span", {className: "am-icon-bookmark"}), " 关注者各类得益行为的数额："), 
				          React.createElement("p", null, "首次关注获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_focus", className: "am-input-sm settings_input"})), 
						  React.createElement("p", null, "阅读软文获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_read", className: "am-input-sm settings_input"}), 
				       		"建定通使用天数", 
				       		React.createElement("input", {type: "text", id: "day_read", className: "am-input-sm settings_input"})
				       		), 	
						  React.createElement("p", null, "点赞软文获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_like", className: "am-input-sm settings_input"}), 
				       		"建定通使用天数", 
				       		React.createElement("input", {type: "text", id: "day_like", className: "am-input-sm settings_input"})
				       		), 	
						  React.createElement("p", null, "转发软文获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_transpond", className: "am-input-sm settings_input"}), 
				       		"建定通使用天数", 
				       		React.createElement("input", {type: "text", id: "day_transpond", className: "am-input-sm settings_input"})
				       		), 	
				       	  React.createElement("p", null, "分享到朋友圈获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_share", className: "am-input-sm settings_input"}), 
				       		"建定通使用天数", 
				       		React.createElement("input", {type: "text", id: "day_share", className: "am-input-sm settings_input"})
				       		)	
						)
				    ), 
				    React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
				        React.createElement("div", {className: "am-panel-bd"}, 
				          React.createElement("p", null, React.createElement("span", {className: "am-icon-bookmark"}), " 管理员提成积分各种得益数额："), 
				          React.createElement("p", null, "所辖关注者首次关注后管理员获得的提成积分", 
				       		React.createElement("input", {type: "text", id: "score_admin_focus", className: "am-input-sm settings_input"})), 
						  React.createElement("p", null, "所辖关注者阅读新软文管理员获得的提成积分", 
				       		React.createElement("input", {type: "text", id: "score_admin_read", className: "am-input-sm settings_input"})), 	
						  React.createElement("p", null, "所辖关注者点赞新软文管理员获得的提成积分", 
				       		React.createElement("input", {type: "text", id: "score_admin_like", className: "am-input-sm settings_input"})), 
						  React.createElement("p", null, "所辖关注者转发新软文管理员获得的提成积分", 
				       		React.createElement("input", {type: "text", id: "score_admin_transpond", className: "am-input-sm settings_input"})), 
				       	  React.createElement("p", null, "所辖关注者分享新软文到朋友圈管理员获得的积分", 
				       		React.createElement("input", {type: "text", id: "score_admin_share", className: "am-input-sm settings_input"}))
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