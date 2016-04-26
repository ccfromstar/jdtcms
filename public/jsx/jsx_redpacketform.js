/*表单信息*/
var R_content = React.createClass({
	getInitialState:function(){
		var mode = window.sessionStorage.getItem('mode');
		var smallname = (mode == "edit")?"编辑":"新建";
		var role = window.sessionStorage.getItem('crole');
        return {smallname:smallname};
    },
	createDoc:function(){
		var money = $('#money').val();
		var score = $('#score').val();
		
		var mode = window.sessionStorage.getItem('mode');
		
		if (isNaN(money)) {
			$('.errorinfo').html('<p>红包金额只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (isNaN(score)) {
			$('.errorinfo').html('<p>所需积分只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/createPacket",
			data: {
				mode:mode,
				money:money,
				score:score,
				editid: window.sessionStorage.getItem("editid")
			},
			success: function(data) {
				console.log(data);
				if(data == "300"){
					$('.successinfo').html('<p>保存成功</p>').removeClass("none");
					setTimeout(function() {
						window.location = 'redpacket.html';
					}, 1000);
				}
			}
		});
	},
	cancleDoc:function(){
		window.location = 'redpacket.html';
	},
	componentDidMount:function(){
		var o = this;
		var mode = window.sessionStorage.getItem('mode');
		if(mode == "edit"){
			var editid = window.sessionStorage.getItem("editid");
			$.ajax({
				type: "post",
				url: hosts + "/redpacket/getPacketById",
				data: {
					id:editid
				},
				success: function(data) {
					$('#money').val(data[0].money);
					$('#score').val(data[0].score);
				}
			});
		}
	},
	render:function(){
		return(
			<div className="admin-content">
			
			   	<div className="am-cf am-padding">
					<div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">红包表</strong> / <small>{this.state.smallname}</small></div>
				</div>
			    
			    <div className="am-form">
				    <div className="am-g am-margin-top">
				        <div className="am-u-sm-4 am-u-md-2 am-text-right">
				            红包金额
				        </div>
				        <div className="am-u-sm-8 am-u-md-4">
				            <input type="text" id="money" className="am-input-sm settings_input" />元
				        </div>
				        <div className="am-hide-sm-only am-u-md-6">*必填</div>
				    </div>   
				</div>

				<div className="am-form">
				    <div className="am-g am-margin-top">
				        <div className="am-u-sm-4 am-u-md-2 am-text-right">
				            所需积分
				        </div>
				        <div className="am-u-sm-8 am-u-md-4">
				            <input type="text" id="score" className="am-input-sm settings_input" />
				        </div>
				        <div className="am-hide-sm-only am-u-md-6">*必填</div>
				    </div>   
				</div>
				
				<div className="am-margin">
				    <button type="button" onClick={this.createDoc} className="btn-c am-btn am-btn-primary am-btn-xs">保存</button>
				    <button type="button" onClick={this.cancleDoc} className="btn-c am-btn am-btn-primary am-btn-xs">关闭</button>
				</div>
			</div>
		);
	}
});