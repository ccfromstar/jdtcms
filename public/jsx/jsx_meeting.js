var R_content = React.createClass({
	getInitialState: function() { 
		var role = window.sessionStorage.getItem("crole");
		var isAdmin = (role=="管理员")?"":"none";
		return {data: [],total:0,totalpage: [],isFirst:"am-disabled",isLast:"am-disabled",isAdmin:isAdmin};
	},
	newDoc:function(){
		window.sessionStorage.setItem("mode","new");
		window.sessionStorage.removeItem("editid");
		window.sessionStorage.removeItem("startDate");
		window.location = 'userform.html';
	},
	readDoc:function(id){
		window.sessionStorage.setItem("readdocid",id);
		window.location = 'booking_read.html';
	},
	delDoc:function(id,e){
		var o = this;
		e.preventDefault();
		window.sessionStorage.setItem("delid",id);
		$("#del-confirm").modal();
	},
	editDoc:function(id,startDate,e){
		var o = this;
		e.preventDefault();
		window.sessionStorage.setItem("editid",id);
		window.sessionStorage.setItem("mode","edit");
		window.location = 'userform.html';
	},
	delsql:function(){
		var o = this;
		$.ajax({
			type: "post",
			url: hosts + "/user/delUser",
			data: {
				id:window.sessionStorage.getItem("delid")
			},
			success: function(data) {
				if(data == "300"){
					o.toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>删除成功</p>').removeClass("none");
					setTimeout(function() {
						$('.successinfo').addClass("none");
					}, 2000);
				}
			}
		});
	},
	resetKey:function(){
		window.location.reload();
	},
	toPage:function(page,e){
		var o = this;
		if(e){
			e.preventDefault();
		}
		var $modal = $('#my-modal-loading');
		$modal.modal();
		window.sessionStorage.setItem("indexPage",page);
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		
		/*查询参数*/
		var meetingname = $("#meetingname").val();
		var company = $("#company").val();
		var start_time = $("#start_time").val();
		var end_time = $("#end_time").val();
		var linkman = $("#linkman").val();
		var address = $("#address").val();
		var phone = $("#phone").val();
		var remark = $("#remark").val();
		var state_id = $("#state_id").val();
		
		$.ajax({
			type: "post",
			url: hosts + "/user/getMeeting",
			data: {
				indexPage:indexPage,
				cid:id,
				meetingname:meetingname,
				company:company,
				start_time:start_time,
				end_time:end_time,
				linkman:linkman,
				address:address,
				phone:phone,
				remark:remark,
				state_id:state_id
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
	componentDidMount:function(){
		var o = this;
		$("#start_time").bind("click",function(){
			$('#start_time').datepicker('open');
		});
		$("#end_time").bind("click",function(){
			$('#end_time').datepicker('open');
		});
		this.toPage(1);
	},
	ShowWin:function(id,state_id,remark,e){
		if(e){
			e.preventDefault();
		}
		window.sessionStorage.setItem("meetingid",id);
		
		$("#w_state_id").val(state_id);
		$("#w_remark").val(remark);
		$("#action_type").modal();
	},
	setMeeting:function(e){
		var o = this;
		if(e){
			e.preventDefault();
		}
		var meetingid = window.sessionStorage.getItem('meetingid');
		var w_remark = $("#w_remark").val();
		var w_state_id = $("#w_state_id").val();
		$("#action_type").modal('close');
		$.ajax({
			type: "post",
			url: hosts + "/user/updateMeeting",
			data: {
				meetingid:meetingid,
				w_remark:w_remark,
				w_state_id:w_state_id
			},
			success: function(data) {
				o.toPage(window.sessionStorage.getItem("indexPage"));
				$('.successinfo').html('<p>修改成功</p>').removeClass("none");
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
			}
		});
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		return(
				<tr>
	              <td>{c.meetingname}</td>
	              <td>{c.company}</td>
	              <td>{c.linkman}</td>
	              <td>{c.address}</td>
	              <td>{c.phone}</td>
	              <td>{c.custfrom}</td>
	              <td>{c.state_id==0?"未处理":"已联系"}</td>
	              <td>{c.remark}</td>
	              <td>{c.signDate}</td>
	              <td>
	                <div className="am-hide-sm-only am-btn-toolbar">
	                  <div className="am-btn-group am-btn-group-xs">
	                    <button onClick={o.ShowWin.bind(o,c.id,c.state_id,c.remark)} className="am-btn am-btn-default am-btn-xs am-text-secondary"><span className="am-icon-edit"></span> 修改</button>
	                  </div>
	                </div>
	              </td>
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
		return(
			<div className="admin-content">
			
			    <div className="am-cf am-padding">
			      <div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">报名管理</strong> / <small>列表</small></div>
				</div>
			    <div className="am-g">
			      <div className="am-u-sm-12 am-u-md-12">
			        <div className="am-btn-toolbar">
			          <div className="am-btn-group am-btn-group-xs">
			          </div>
			        </div>
			      </div>
			    </div>
			    
			    <div className="am-g">
			      <div className="am-u-sm-12 am-u-md-12 menu-search">
			        <div className="am-btn-toolbar">  
			          		<input type="text" id="meetingname" className="am-input-sm search_input" placeholder="会议名" />
			          		<input type="text" id="company" className="am-input-sm search_input" placeholder="公司" />
			          		<input type="text" id="linkman" className="am-input-sm search_input" placeholder="联系人" />
			          		<input type="text" id="address" className="am-input-sm search_input" placeholder="地址" />
			          		<input type="text" id="phone" className="am-input-sm search_input" placeholder="手机号" />
			          		<input type="text" id="remark" className="am-input-sm search_input" placeholder="备注" />
			          		申请日期：
			          		<input type="text" id="start_time" className="am-form-field date_sel" placeholder="开始日期" data-am-datepicker readOnly required />
			          		<input type="text" id="end_time" className="am-form-field date_sel" placeholder="结束日期" data-am-datepicker readOnly required />
			          		<select id="state_id" className="sel_user">
			          			<option value='-'>状态</option>
			          			<option value='0'>未处理</option>
			          			<option value='1'>已联系</option>
			          		</select>
			          		<button type="button" onClick={this.toPage.bind(o,1)} className="btn-c am-btn am-btn-primary am-btn-xs btn-search"><span className="am-icon-search"></span> 查询</button>
			          		<button type="button" onClick={this.resetKey} className="btn-c am-btn am-btn-default am-btn-xs btn-search"><span className="am-icon-bitbucket"></span> 清空</button>
			        </div>
			      </div>
			    </div>
			    
			    <div className="am-g">
				    <div className="am-u-sm-12">
				        <form className="am-form">
				          <table className="am-table am-table-striped am-table-hover table-main jdt-table">
				            <thead>
				              <tr>
				                <th>会议名</th>
				                <th>公司</th>
				                <th>联系人</th>
				                <th>地址</th>
				                <th>手机号</th>
				                <th>类型</th>
				                <th>状态</th>
				                <th>备注</th>
				                <th>申请日期</th>
				                <th>操作</th>
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
				        </form>
				    </div>
				</div>
				<div className="am-modal am-modal-confirm" tabIndex="-1" id="del-confirm">
				  <div className="am-modal-dialog">
				    <div className="am-modal-hd">提示</div>
				    <div className="am-modal-bd">
				      你，确定要删除这条记录吗？
				    </div>
				    <div className="am-modal-footer">
				      <span className="am-modal-btn" data-am-modal-cancel>取消</span>
				      <span className="am-modal-btn" data-am-modal-confirm onClick={this.delsql}>确定</span>
				    </div>
				  </div>
				</div>
				
				<div className="am-modal am-modal-no-btn" tabindex="-1" id="action_type">
				  <div className="am-modal-dialog">
				    <div className="am-modal-hd">修改状态和备注
				      <a href="javascript: void(0)" className="am-close am-close-spin" data-am-modal-close>&times;</a>
				    </div>
				    
				    <div className="am-modal-bd">
				    	<div className="am-form">
				    		<div className="am-g am-margin-top">
						        <div className="am-u-sm-4 am-u-md-2 am-text-right">
						            备注
						        </div>
						        <div className="am-u-sm-8 am-u-md-4">
						            <input type="text" id="w_remark" className="am-input-sm" />
						        </div>
						        <div className="am-hide-sm-only am-u-md-6"></div>
						    </div>
						    
						    <div className="am-g am-margin-top">
						        <div className="am-u-sm-4 am-u-md-2 am-text-right">
						            状态
						        </div>
						        <div className="am-u-sm-8 am-u-md-4">
						        	<select id="w_state_id" className="sel_user">
					          			<option value='0'>未处理</option>
					          			<option value='1'>已联系</option>
					          		</select>
						        </div>
						        <div className="am-hide-sm-only am-u-md-6"></div>
						    </div>
				    	</div>  
					    
					    <p>&nbsp;</p>
						<button type="button" onClick={this.setMeeting}  className="btn-c am-btn am-btn-primary am-btn-xs btn-search">确定</button>
			          		
				    </div>
				  </div>
				</div>
			</div>
		);
	}
});