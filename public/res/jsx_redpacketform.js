/*表单信息*/
var R_content = React.createClass({displayName: "R_content",
	getInitialState:function(){
		var mode = window.sessionStorage.getItem('mode');
		var smallname = (mode == "edit")?"编辑":"新建";
		var role = window.sessionStorage.getItem('crole');
        return {smallname:smallname};
    },
	createDoc:function(){
		var money = $('#money').val();
		var money_max = $('#money_max').val();
		var score = $('#score').val();
		var redname = $('#redname').val();
		
		var type_id = jqradio('type_id');
		var state_id = jqradio('state_id');
		
		var sort_id = $('#sort_id').val();
		var nick_name = $('#nick_name').val();
		
		var mode = window.sessionStorage.getItem('mode');
		
		if (isNaN(money) || isNaN(money_max)) {
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
		
		if (isNaN(sort_id)) {
			$('.errorinfo').html('<p>排序id只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		
		if(!redname){
			$('.errorinfo').html('<p>红包名称不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		
		if(!nick_name){
			$('.errorinfo').html('<p>红包文字不能为空</p>').removeClass("none");
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
				money_max:money_max,
				score:score,
				type_id:type_id,
				state_id:state_id,
				redname:redname,
				sort_id:sort_id,
				nick_name:nick_name,
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
					$('#money_max').val(data[0].money_max);
					$('#redname').val(data[0].name);
					$('#score').val(data[0].score);
					$('#sort_id').val(data[0].sort_id);
					$('#nick_name').val(data[0].nick_name);
					var i = 0;
					i = data[0].type_id;
					$("#type_id_div").find("label").eq(i).addClass("am-active");
					$("#type_id_div").find("input").eq(i).attr("checked","checked");
					
					i = data[0].state_id;
					$("#state_id_div").find("label").eq(i).addClass("am-active");
					$("#state_id_div").find("input").eq(i).attr("checked","checked");
				}
			});
		}else{
			$("#type_id_div").find("label").eq(0).addClass("am-active");
			$("#type_id_div").find("input").eq(0).attr("checked","checked");
			
			$("#state_id_div").find("label").eq(1).addClass("am-active");
			$("#state_id_div").find("input").eq(1).attr("checked","checked");
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
				            "红包类别"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				        	React.createElement("div", {className: "am-btn-group", id: "type_id_div", "data-am-button": true}, 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "type_id", value: "0"}, "固定金额")
					            ), 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "type_id", value: "1"}, "随机金额")
					            )
					        )
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "红包名称"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "redname", className: "am-input-sm settings_input"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
			    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "红包金额"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "money", className: "am-input-sm settings_input"}), "元" + ' ' +
				            "~", React.createElement("input", {type: "text", id: "money_max", className: "am-input-sm settings_input"}), "元"
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填，如果是固定金额，两个填写一样的")
				    ), 
				

				
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "所需积分"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "score", className: "am-input-sm settings_input"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
			
				
					React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "红包状态"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				        	React.createElement("div", {className: "am-btn-group", id: "state_id_div", "data-am-button": true}, 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "state_id", value: "0"}, "未发布")
					            ), 
					            React.createElement("label", {className: "am-btn am-btn-default am-btn-xs"}, 
					              React.createElement("input", {type: "radio", name: "state_id", value: "1"}, "已发布")
					            )
					        )
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"})
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "排序id"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "sort_id", className: "am-input-sm settings_input"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "红包文字"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "nick_name", className: "am-input-sm settings_input"})
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