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

		$.ajax({
			type: "post",
			url: hosts + "/settings/setSettings",
			data: {
				score_focus:score_focus,
				score_read:score_read,
				score_like:score_like,
				score_like:score_like,
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
				    )

				), 
			    
			  
				
				React.createElement("div", {className: "am-margin"}, 
				   React.createElement("button", {type: "button", onClick: this.UpdateDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "保存")
				)
			)
		);
	}
});