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
		window.location = 'booking.html';
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
		window.sessionStorage.setItem("startDate",startDate);
		window.sessionStorage.setItem("mode","edit");
		window.location = 'booking.html';
	},
	delsql:function(){
		var o = this;
		$.ajax({
			type: "post",
			url: hosts + "/service/delBooking",
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
	toPage:function(page,e){
		var o = this;
		if(e){
			e.preventDefault();
		}
		/*昵称*/
		var key = $("#key").val();
		/*分组*/
		var groupid = $("#wx_group").val();
		groupid = (groupid=='-')?null:groupid;
		window.sessionStorage.setItem("indexPage",page);
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		var role = window.sessionStorage.getItem("crole");
		indexPage = indexPage?indexPage:1;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserByKey",
			data: {
				key:key,
				indexPage:indexPage,
				cid:id,
				role:role,
				groupid:groupid
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
	exportXls:function(){
		var id = window.sessionStorage.getItem('cid');
		var role = window.sessionStorage.getItem("crole");
		$.ajax({
			type: "post",
			url: hosts + "/service/exportBooking",
			data: {
				cid:id,
				role:role
			},
			success: function(data) {
				window.open(hosts + "/excelop/temp/"+data);
				$('.loadinfo').html("<a href='"+hosts + "/excelop/temp/"+data+"'>如果没有自动弹出下载报表，说明您的浏览器禁止了弹出框，您可以点击这里下载报表(10秒后自动关闭)</a>").removeClass("none");
				setTimeout(function() {
					$('.loadinfo').addClass("none");
				}, 10000);
			}
		});
	},
	search:function(){
		var o = this;
		/*昵称*/
		var key = $("#key").val();
		/*分组*/
		var groupid = $("#wx_group").val();
		groupid = (groupid=='-')?null:groupid;
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		var role = window.sessionStorage.getItem("crole");
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getUserByKey",
			data: {
				key:key,
				indexPage:indexPage,
				cid:id,
				role:role,
				groupid:groupid
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
	UpdateWxUser:function(){
		$('.loadinfo').html('<p>更新中...</p>').removeClass("none");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/updateWxUser",
			data: {

			},
			success: function(data) {
				if(data == "200"){
					$('.loadinfo').addClass("none");
					$('.successinfo').html('<p>关注者列表更新成功</p>').removeClass("none");
					window.location = "index.html";
				}
			}
		});
	},	
	UpdateWxGroup:function(){
		$('.loadinfo').html('<p>更新中...</p>').removeClass("none");
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/updateWxGroup",
			data: {

			},
			success: function(data) {
				if(data == "200"){
					$('.loadinfo').addClass("none");
					$('.successinfo').html('<p>分组更新成功</p>').removeClass("none");
					window.location = "index.html";
				}
			}
		});
	},	
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		indexPage = indexPage?indexPage:1;
		var role = window.sessionStorage.getItem("crole");
		/*获取用户列表*/
		$.ajax({
			type: "post",
			url: hosts + "/wx_user/getWxUser",
			data: {
				indexPage:indexPage,
				cid:id,
				role:role
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
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		var sex = "";
		switch(c.sex){
			case 0:
				sex = "";break;
			case 1:
				sex = "男";break;
			case 2:
				sex = "女";break;
		}
		var _subtime = new Date(c.subscribe_time*1000).Format("yyyy-MM-dd hh:mm:ss");
		return(
				<tr>
				  <td>{c.group_name}</td>
				  <td><a href={c.headimgurl} target="_blank"><img className="wx_user_header_img" src={c.headimgurl}></img></a></td>
				  <td>{c.nickname}</td>
				  <td>{sex}</td>
				  <td>{c.province}{c.city}</td>
				  <td>{c.country}</td>
				  <td className="wx_user_remark">{c.remark}</td>
				  <td>{_subtime}</td>
	              <td>
	                <div className="am-hide-sm-only am-btn-toolbar">
	                  <div className="am-btn-group am-btn-group-xs">
	                    
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
			      <div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">关注者查询</strong> / <small>列表</small></div>
				</div>
			    <div className="am-g">
			      <div className="am-u-sm-12 am-u-md-9">
			        <div className="am-btn-toolbar">
			          <div className="am-btn-group am-btn-group-xs">
			            <button type="button" onClick={this.UpdateWxUser} className="am-btn am-btn-default "><span className="am-icon-refresh"></span> 更新关注者</button>
			          	<button type="button" onClick={this.UpdateWxGroup} className="am-btn am-btn-default"><span className="am-icon-refresh"></span> 更新分组</button>
			          </div>
			        </div>
			      </div>
			      <div className="am-u-sm-12 am-u-md-3">
			        <div className="am-input-group am-input-group-sm">
			          <input type="text" id="key" className="am-form-field" placeholder="用户昵称" />
			          <span className="am-input-group-btn">
			            <button onClick={this.search} className="am-btn am-btn-default" type="button">搜索</button>
			          </span>
			        </div>
			      </div>
			    </div>
			    
			    <div className="am-g">
				    <div className="am-u-sm-12">
				        <form className="am-form">
				          <table className="am-table am-table-striped am-table-hover table-main">
				            <thead>
				              <tr>
				              	<th>
									<select id="wx_group" onChange={this.toPage.bind(this,1)}>
							       
							        </select>
				              	</th>
				              	<th>用户头像</th>
				              	<th>昵称</th>
				              	<th>性别</th>
				              	<th>省市</th>
				              	<th>国家</th>
				              	<th>备注</th>
				              	<th>关注时间</th>
			            		<th className="am-hide-sm-only table-set">操作</th>
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
			</div>
		);
	}
});