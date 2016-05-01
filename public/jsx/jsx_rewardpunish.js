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
	jqchk:function(name){ //jquery获取复选框值
	    var chk_value = '';
	    $('input[name="' + name + '"]:checked').each(function (){
	        if (chk_value == ""){
	            chk_value = $(this).val();
	        }else{
	            chk_value = chk_value + "*" + $(this).val();
	        }
	    }
	    );
	    return chk_value;
	},
	resetKey:function(){
		window.location.reload();
	},
	ShowWin:function(){
		$("#action_type").modal();
	},
	setType:function(){
		$('#k_type_id').val(this.jqchk('type_id'));
		$("#action_type").modal('close');
		this.toPage(1);
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
		var k_openid = $("#k_openid").val();
		var k_nickname = $("#k_nickname").val();
		var start_time = $("#start_time").val();
		var end_time = $("#end_time").val();
		var wx_group = $("#wx_group").val();
		var k_remark = $("#k_remark").val();
		var k_area = $("#k_area").val();
		var wx_user = $("#wx_user").val();
		var k_type_id = $("#k_type_id").val();
		
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getAllRPScore",
			data: {
				indexPage:indexPage,
				openid:k_openid,
				nickname:k_nickname,
				start_time:start_time,
				end_time:end_time,
				wx_group:wx_group,
				k_remark:k_remark,
				k_area:k_area,
				wx_user:wx_user,
				k_type_id:k_type_id,
				role_manage:role_manage,
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
	getXls:function(){
		/*生成openid.txt*/
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/getXls",
			data: {
				
			},
			success: function(data) {
				$('.successinfo').html('<p>导出成功</p>').removeClass("none");
				setTimeout(function() {
					$('.successinfo').addClass("none");
				}, 2000);
				$("#file").html('<span class="am-icon-file-o"></span> <a target="_blank" href="'+hosts+'/txt/openlist.txt">openlist.txt</a>');
			}
		});
	},
	checkRole:function(){
		if(role_manage == 0){
			//如果没有管理员权限，只能看到自己的客户
			$("#wx_user").addClass("none");
		}
		if(role_send == 0){
			//没有派发权限
			$("#li_tab2").addClass("none");
		}
	},
	componentDidMount:function(){
		var o = this;
		/*权限判断*/
		this.checkRole();
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		this.toPage(1);
		$("#start_time").bind("click",function(){
			$('#start_time').datepicker('open');
		});
		$("#end_time").bind("click",function(){
			$('#end_time').datepicker('open');
		});
		/*获取分组*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getWxGroup",
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
		/*获取客服*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUser",
			data: {
				
			},
			success: function(data) {
				var option = "<option value='-'>所属客服</option>";
				for(var i in data){
					option += "<option value='"+data[i].id+"'>"+data[i].name+"</option>";
				}
				$("#wx_user").html(option);
			}
		});
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		return(
				<tr>
				  <td>{c.openid}</td>
				  <td>{c.nickname}</td>
	              <td>{c.name}</td>
				  <td>{c.number}</td>
			      <td>{new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")}</td>
			      <td>{c.txtRemark}</td>
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
			      <div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">奖罚统计</strong> / <small>列表</small></div>
				</div>
				
			
				<div className="am-tabs am-margin" data-am-tabs>
				    <ul className="am-tabs-nav am-nav am-nav-tabs">
				      <li className="am-active"><a href="#tab1">奖罚情况</a></li>
				      <li id="li_tab2"><a href="#tab2">群发新手红包</a></li>
				    </ul>
				    
				    <div className="am-tabs-bd">
				      <div className="am-tab-panel am-fade am-in am-active" id="tab1">
				      
				      		<div className="am-g">
						      <div className="am-u-sm-12 am-u-md-12 menu-search">
						        <div className="am-btn-toolbar">  
						          		<input type="text" id="k_openid" className="am-input-sm search_input" placeholder="openid" />
						          		<input type="text" id="k_nickname" className="am-input-sm search_input" placeholder="昵称" />
						          		<input type="text" id="k_remark" className="am-input-sm search_input" placeholder="用户备注" />
						          		<select id="wx_group" className="sel_user"></select>
						          		<input type="text" id="k_area" className="am-input-sm search_input" placeholder="地域" />
						          		<select id="wx_user" className="sel_user"></select>
						          		<input type="text" id="start_time" className="am-form-field date_sel" placeholder="开始日期" data-am-datepicker readOnly required />
						          		<input type="text" id="end_time" className="am-form-field date_sel" placeholder="结束日期" data-am-datepicker readOnly required />
						          		<input type="hidden" id="k_type_id" onClick={this.ShowWin} className="am-input-sm search_input" placeholder="行为分类" readOnly />
			          					<button type="button" onClick={this.ShowWin} className="btn-c am-btn am-btn-default am-btn-xs btn-search"><span className="am-icon-hand-pointer-o"></span> 选择奖罚行为</button>
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
							              	<th>openid</th>
							              	<th>昵称</th>
							                <th>奖罚行为</th>
						              		<th>奖罚内容</th>
						              		<th>时间</th>
						              		<th>备注</th>
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
				      </div>
				      <div className="am-tab-panel am-fade" id="tab2">
				      	<button type="button" onClick={this.getXls} className="am-btn am-btn-default"><span className="am-icon-file-excel-o"></span> 导出openid列表</button>						        
				      	<div id="file"></div>
				      	<div className="am-panel am-panel-default admin-sidebar-panel">
					        <div className="am-panel-bd">
					          <p><span className="am-icon-bookmark"></span> 说明：</p>
					          <p>1.先点击导出openid.txt</p>
					          <p>2.进入微信支付商户平台-营销中心-现金红包-管理红包</p>
					          <p>3.点击发送红包，上传openid.txt</p>
							</div>
					    </div> 
				      </div>
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
				    <div className="am-modal-hd">选择奖罚行为
				      <a href="javascript: void(0)" className="am-close am-close-spin" data-am-modal-close>&times;</a>
				    </div>
				    <div className="am-modal-bd">
				      	<div className="action_check">
						   	<label for="type_1">
								<input type="checkbox" name="type_id" value="1" id="type_1" data-am-ucheck />	奖励积分
							</label>
							<label for="type_2">
								<input type="checkbox" name="type_id" value="2" id="type_2" data-am-ucheck />	惩罚积分
							</label>
							<label for="type_3">
								<input type="checkbox" name="type_id" value="3" id="type_3" data-am-ucheck />	奖励红包
							</label>
							<label for="type_4">
								<input type="checkbox" name="type_id" value="4" id="type_4" data-am-ucheck />	奖励建定通天数
							</label>
							<label for="type_5">
								<input type="checkbox" name="type_id" value="5" id="type_5" data-am-ucheck />	惩罚建定通天数
							</label>
						</div>
						<button type="button" onClick={this.setType} className="btn-c am-btn am-btn-primary am-btn-xs btn-search">确定</button>
			          		
				    </div>
				  </div>
				</div>
				
			</div>
		);
	}
});