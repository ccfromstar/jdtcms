var R_content = React.createClass({
	getInitialState: function() { 
		return {data: [],total:0,totalpage: [],isFirst:"am-disabled",isLast:"am-disabled",data1: [],total1:0,totalpage1: [],isFirst1:"am-disabled",isLast1:"am-disabled"};
	},
	cancleDoc:function(){
		history.go(-1);
	},
	getTotalScore:function(){
		var readdocid = window.sessionStorage.getItem("readdocid");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserById",
			data: {
				id:readdocid
			},
			success: function(data) {
				$("#score_unused").html(data[0].score_unused);
				$("#score_total").html(data[0].score_total);
			}
		});
	},
	checkRole:function(){
		if(role_manage == 0){
			//如果没有管理员权限
			$("#wx_user").addClass("none");
			$("#wx_group").addClass("none");
			$("#input_remark").removeClass("wx_user_input").addClass("none");
			$("#btn_remark").addClass("none");
		}
		if(role_custom == 0){
			//没有自定义派发权限
			$("#li_tab3").addClass("none");
		}
	},
	componentDidMount:function(){
		var o = this;
		/*权限判断*/
		this.checkRole();
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var readdocid = window.sessionStorage.getItem("readdocid");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserById",
			data: {
				id:readdocid
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
				$("#state_id").html(data[0].state_id==1?"正常":"异常");
				$("#wx_state").val(data[0].state_id);
				$modal.modal('close');
			}
		});
		/*获取客服*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUser",
			data: {
				
			},
			success: function(data) {
				var option = "<option value='-'>分配客服</option>";
				for(var i in data){
					option += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
				}
				$("#wx_user").html(option);
			}
		});
		/*获取分组*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getGroup",
			data: {
				
			},
			success: function(data) {
				var option = "<option value='-'>分组</option>";
				for(var i in data){
					option += "<option value='"+data[i].group_id+"'>"+data[i].group_name+"</option>";
				}
				$("#wx_group").html(option);
			}
		});
		/*获取积分明细*/
		this.toPage();
		this.toPage1();
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
	setwxState:function(e){
		e.preventDefault();
		var wx_state = $("#wx_state").val();
		var readdocid = window.sessionStorage.getItem("readdocid");
		if(wx_state == "-"){
			return false;
		}
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/setUserState",
			data: {
				wx_state:wx_state,
				id:readdocid
			},
			success: function(data) {
				$('.successinfo').html('<p>设置成功</p>').removeClass("none");
				$("#state_id").html(wx_state==1?"正常":"异常");
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
	setRPconfirm:function(e){
		var o = this;
		e.preventDefault();
		$("#rp-confirm").modal();
	},
	setRP:function(e){
		/*奖罚确认*/
		var that = this;
		e.preventDefault();
		var openid = window.sessionStorage.getItem("openid");
		var score_sel = $("#score_sel").val();
		var score_number = $("#score_number").val();
		var score_remark = $("#score_remark").val();
		if(isNaN(score_number)){
			$('.errorinfo').html('<p>只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if(score_sel == "-"){
			$('.errorinfo').html('<p>请选择奖罚类型</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		/*判断如果是发红包，1分钟内只能发送一次红包给一个用户*/
		if(Number(score_sel) == 3){
			var last_redpacket_sendtime = new Date(window.sessionStorage.getItem("last_redpacket_sendtime"));
			if(last_redpacket_sendtime){
				var this_redpacket_sendtime = new Date();
				var date_difference=this_redpacket_sendtime.getTime()-last_redpacket_sendtime.getTime();
				if(parseInt(date_difference/1000) < 61){
					$('.errorinfo').html('<p>1分钟内只能发送一次红包给一个用户</p>').removeClass("none");
					setTimeout(function() {
						$('.errorinfo').addClass("none");
					}, 2000);
					return false;
				}
			}
			window.sessionStorage.setItem("last_redpacket_sendtime",new Date());
		}
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/setRP",
			data: {
				score_sel:score_sel,
				score_number:score_number,
				score_remark:score_remark,
				openid:openid
			},
			success: function(data) {
				$('.successinfo').html('<p>发放成功</p>').removeClass("none");
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
				that.toPage();
				that.toPage1();
				that.getTotalScore();
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
	toPage1:function(page,e){
		var o = this;
		if(e){
			e.preventDefault();
		}
		window.sessionStorage.setItem("indexPage1",page);
		var indexPage = window.sessionStorage.getItem("indexPage1");
		var id = window.sessionStorage.getItem('openid');
		indexPage = indexPage?indexPage:1;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getRPScore",
			data: {
				indexPage:indexPage,
				cid:id
			},
			success: function(data) {
				o.setState({data1:data.record});
				o.setState({total1:data.total});
				o.setState({totalpage1:data.totalpage});
				o.setState({isFirst1:(data.isFirstPage?"am-disabled":"")});
				o.setState({isLast1:(data.isLastPage?"am-disabled":"")});
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
					<tr>
					  <td>{cname}</td>
					  <td>{cscore}</td>
					  <td>{new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")}</td>
		            </tr>
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
                <li className={hasClass}><a href="#" onClick={o.toPage.bind(o,i)}>{i}</a></li>
            )
        }
        
        var list1 = this.state.data1.map(function(c){
			return(
					<tr>
					  <td>{c.name}</td>
					  <td>{c.number}</td>
					  <td>{new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")}</td>
					  <td>{c.txtRemark}</td>
		            </tr>
			);
		});
		
		var pager1=[];
		var iPa1 = Number(window.sessionStorage.getItem("indexPage1"));
		iPa1 = iPa1?iPa1:1;
        for(var i=1;i<(this.state.totalpage1)+1;i++){
        	var hasClass = "";
        	if(i == iPa1){
        		hasClass = "am-active";
        	}
            pager1.push(
                <li className={hasClass}><a href="#" onClick={o.toPage1.bind(o,i)}>{i}</a></li>
            )
        }

		return(
			<div className="admin-content">
			
			   	<div className="am-cf am-padding">
					<div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">关注者详情</strong> / <small>查看</small></div>
				</div>
			    
			    <div className="am-tabs am-margin" data-am-tabs>
				    <ul className="am-tabs-nav am-nav am-nav-tabs">
				      <li className="am-active"><a href="#tab1">关注者基本信息</a></li>
				      <li><a href="#tab2">积分信息</a></li>
				      <li id="li_tab3"><a href="#tab3">奖罚管理</a></li>
				    </ul>
				
				    <div className="am-tabs-bd">
				      <div className="am-tab-panel am-fade am-in am-active" id="tab1">
				       	<div className="am-form">

				       		<div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              用户头像
					            </div>
					            <div id="headimgurl" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

				       		<div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              昵称
					            </div>
					            <div id="nickname" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              用户的标识
					            </div>
					            <div id="openid" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              性别
					            </div>
					            <div id="sex" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              语言
					            </div>
					            <div id="language" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              城市
					            </div>
					            <div id="city" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              省份
					            </div>
					            <div id="province" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              国家
					            </div>
					            <div id="country" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              首次关注时间
					            </div>
					            <div id="subscribe_time" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              备注
					            </div>
					            <div id="remark" className="am-u-sm-8 am-u-md-4"></div>
					            <div className="am-hide-sm-only am-u-md-6">
									<input type="text" id="input_remark" className="am-input-sm wx_user_input" />
									<button id="btn_remark" type="button" onClick={this.setRemark} className="btn-c am-btn am-btn-primary am-btn-xs">确定</button>
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              分组
					            </div>
					            <div id="groupid" className="am-u-sm-8 am-u-md-4">
					            </div>
					             <div className="am-hide-sm-only am-u-md-6">
									<select id="wx_group" onChange={this.setGroup.bind(this)}></select>
					            </div>
					        </div>

					        <div className="am-g am-margin-top">

							    <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              所属客服
					            </div>
					            <div id="user_id" className="am-u-sm-8 am-u-md-4"></div>
					            <div className="am-hide-sm-only am-u-md-6">
									<select id="wx_user" onChange={this.setUser.bind(this)}></select>
					            </div>

					        </div>
					        
					        <div className="am-g am-margin-top">

							    <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              账号状态
					            </div>
					            <div id="state_id" className="am-u-sm-8 am-u-md-4"></div>
					            <div className="am-hide-sm-only am-u-md-6">
									<select id="wx_state" onChange={this.setwxState}>
										<option value="1">正常</option>
										<option value="0">异常</option>
									</select>
					            </div>

					        </div>
				        </div>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab2">
				       	<div className="am-form">
				       		<div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              未兑换的积分
					            </div>
					            <div id="score_unused" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-g am-margin-top">
					            <div className="am-u-sm-4 am-u-md-2 am-text-left">
					              总积分
					            </div>
					            <div id="score_total" className="am-u-sm-8 am-u-md-10">
					            </div>
					        </div>

					        <div className="am-panel am-panel-default admin-sidebar-panel">
						        <div className="am-panel-bd">
						          <p><span className="am-icon-list"></span> 积分明细：</p>
						          <table className="am-table am-table-striped am-table-hover table-main">
						            <thead>
						              <tr>
						              	<th>积分行为</th>
						              	<th>积分变化</th>
						              	<th>时间</th>
						              </tr>
						          	</thead>
						          	<tbody>
						          		{list}
						          	</tbody>
						          </table>
						          	<div className="am-cf">
									  共 {this.state.total} 条记录
									  <div className="am-fr">
									    <ul className="am-pagination">
									      <li className={this.state.isFirst}><a href="#" onClick={this.toPage.bind(this,Number(window.sessionStorage.getItem("indexPage"))-1)}>«</a></li>
									      {pager}
									      <li className={this.state.isLast}><a href="#" onClick={this.toPage.bind(this,Number(window.sessionStorage.getItem("indexPage"))+1)}>»</a></li>
									    </ul>
									  </div>
									</div>
										</div>
								    </div>  
				        </div>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab3">
				      	<div className="am-panel am-panel-default admin-sidebar-panel">
					        <div className="am-panel-bd">
					          <p><span className="am-icon-bookmark"></span> 相关操作：</p>
					          <p><select id="score_sel">
					          		<option value="-">奖罚类型</option>
					          		<option value="1">奖励积分</option>
					          		<option value="2">惩罚积分</option>
					          		<option value="3">奖励红包</option>
					          		<option value="4">奖励建定通天数</option>
					          		<option value="5">惩罚建定通天数</option>
					          </select>
					       		<input type="text" id="score_number" className="am-input-sm settings_input" defaultValue="0" /></p>
					       		<p>备注说明 
					       		&nbsp;&nbsp;<input type="text" id="score_remark" className="am-input-sm wx_user_input" />
					       		</p>
					       		<button type="button" onClick={this.setRPconfirm} className="am-btn am-btn-default am-btn-xs">确认</button>						        
							</div>
					    </div>  
					    
					    <div className="am-panel am-panel-default admin-sidebar-panel">
						        <div className="am-panel-bd">
						          <p><span className="am-icon-list"></span> 奖罚明细：</p>
						          <table className="am-table am-table-striped am-table-hover table-main">
						            <thead>
						              <tr>
						              	<th>奖罚行为</th>
						              	<th>奖罚内容</th>
						              	<th>时间</th>
						              	<th>备注</th>
						              </tr>
						          	</thead>
						          	<tbody>
						          		{list1}
						          	</tbody>
						          </table>
						          	<div className="am-cf">
									  共 {this.state.total1} 条记录
									  <div className="am-fr">
									    <ul className="am-pagination">
									      <li className={this.state.isFirst1}><a href="#" onClick={this.toPage1.bind(this,Number(window.sessionStorage.getItem("indexPage1"))-1)}>«</a></li>
									      {pager1}
									      <li className={this.state.isLast1}><a href="#" onClick={this.toPage1.bind(this,Number(window.sessionStorage.getItem("indexPage1"))+1)}>»</a></li>
									    </ul>
									  </div>
									</div>
										</div>
								    </div>  
					    
				      </div>
				    </div>
				</div>
				
				<div className="am-margin">
				    <button type="button" onClick={this.cancleDoc} className="btn-c am-btn am-btn-primary am-btn-xs">关闭</button>
				</div>
				
				<div className="am-modal am-modal-confirm" tabIndex="-1" id="rp-confirm">
				  <div className="am-modal-dialog">
				    <div className="am-modal-hd">提示</div>
				    <div className="am-modal-bd">
				      是否确定执行操作？
				    </div>
				    <div className="am-modal-footer">
				      <span className="am-modal-btn" data-am-modal-cancel>取消</span>
				      <span className="am-modal-btn" data-am-modal-confirm onClick={this.setRP}>确定</span>
				    </div>
				  </div>
				</div>
			</div>
		);
	}
});