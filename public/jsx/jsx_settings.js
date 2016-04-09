var R_content = React.createClass({
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
				$("#score_admin_focus").val(data[0].score_admin_focus);
				$("#score_admin_read").val(data[0].score_admin_read);
				$("#score_admin_like").val(data[0].score_admin_like);
				$("#score_admin_transpond").val(data[0].score_admin_transpond);
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

		var score_admin_focus = $("#score_admin_focus").val();
		var score_admin_read = $("#score_admin_read").val();
		var score_admin_like = $("#score_admin_like").val();
		var score_admin_transpond = $("#score_admin_transpond").val();

		if(isNaN(score_focus) || isNaN(score_read) || isNaN(score_like) || isNaN(score_transpond) || isNaN(score_admin_focus) || isNaN(score_admin_read) || isNaN(score_admin_like) || isNaN(score_admin_transpond)){
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
				score_focus:score_focus,
				score_read:score_read,
				score_like:score_like,
				score_transpond:score_transpond,
				score_admin_focus:score_admin_focus,
				score_admin_read:score_admin_read,
				score_admin_like:score_admin_like,
				score_admin_transpond:score_admin_transpond,
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
			<div className="admin-content">
			
			   	<div className="am-cf am-padding">
					<div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">系统设定</strong> / <small>设置</small></div>
				</div>

				<div className="am-form">

				    <div className="am-panel am-panel-default admin-sidebar-panel">
				        <div className="am-panel-bd">
				          <p><span className="am-icon-bookmark"></span> 关注者各类得益行为的数额：</p>
				          <p>首次关注获得的积分
				       		<input type="text" id="score_focus" className="am-input-sm settings_input" /></p>
						  <p>阅读软文获得的积分
				       		<input type="text" id="score_read" className="am-input-sm settings_input" /></p>	
						  <p>点赞软文获得的积分
				       		<input type="text" id="score_like" className="am-input-sm settings_input" /></p>
						  <p>转发软文获得的积分
				       		<input type="text" id="score_transpond" className="am-input-sm settings_input" /></p>
						</div>
				    </div>    
				    <div className="am-panel am-panel-default admin-sidebar-panel">
				        <div className="am-panel-bd">
				          <p><span className="am-icon-bookmark"></span> 管理员提成积分各种得益数额：</p>
				          <p>所辖关注者首次关注后管理员获得的提成积分
				       		<input type="text" id="score_admin_focus" className="am-input-sm settings_input" /></p>
						  <p>所辖关注者阅读新软文管理员获得的提成积分
				       		<input type="text" id="score_admin_read" className="am-input-sm settings_input" /></p>	
						  <p>所辖关注者点赞新软文管理员获得的提成积分
				       		<input type="text" id="score_admin_like" className="am-input-sm settings_input" /></p>
						  <p>所辖关注者转发新软文管理员获得的提成积分
				       		<input type="text" id="score_admin_transpond" className="am-input-sm settings_input" /></p>
						</div>
				    </div>   

				</div>
			    
			  
				
				<div className="am-margin">
				   <button type="button" onClick={this.UpdateDoc} className="btn-c am-btn am-btn-primary am-btn-xs">保存</button>
				</div>
			</div>
		);
	}
});