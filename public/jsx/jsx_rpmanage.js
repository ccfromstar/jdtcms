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
		window.location = 'redpacketform.html';
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
		window.location = 'redpacketform.html';
	},
	delsql:function(){
		var o = this;
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/delRecord",
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
	backDoc:function(id,openid,score,money,e){
		var o = this;
		e.preventDefault();
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/backRecord",
			data: {
				id:id,
				openid:openid,
				score:score,
				money:money
			},
			success: function(data) {
				if(data == "300"){
					o.toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>退回成功</p>').removeClass("none");
					setTimeout(function() {
						$('.successinfo').addClass("none");
					}, 2000);
				}
			}
		});
	},
	sendDoc:function(id,openid,money,order_no,e){
		var o = this;
		e.preventDefault();
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/sendRecord",
			data: {
				id:id,
				openid:openid,
				money:money,
				order_no:order_no
			},
			success: function(data) {
				if(data == "300"){
					o.toPage(window.sessionStorage.getItem("indexPage"));
					$('.successinfo').html('<p>发放成功</p>').removeClass("none");
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
		window.sessionStorage.setItem("indexPage",page);
		var indexPage = window.sessionStorage.getItem("indexPage");
		var id = window.sessionStorage.getItem('cid');
		
		indexPage = indexPage?indexPage:1;
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/getAllgetchangeRecord",
			data: {
				indexPage:indexPage
			},
			success: function(data) {
				o.setState({data:data.record});
				o.setState({total:data.total});
				o.setState({totalpage:data.totalpage});
				o.setState({isFirst:(data.isFirstPage?"am-disabled":"")});
				o.setState({isLast:(data.isLastPage?"am-disabled":"")});
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
		
		$.ajax({
			type: "post",
			url: hosts + "/redpacket/getAllgetchangeRecord",
			data: {
				indexPage:indexPage
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
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		if(c.status_id == 1){
			return(
					<tr>
		              <td>{c.openid}</td>
		              <td>{c.score}</td>
		              <td>{c.money+"元"}</td>
		              <td>{new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")}</td>
		              <td>{c.name}</td>
		              <td>
		                <div className="am-hide-sm-only am-btn-toolbar">
		                  <div className="am-btn-group am-btn-group-xs">
		                    <button onClick={o.sendDoc.bind(o,c.id,c.openid,c.money,c.order_no)} className="am-btn am-btn-default am-btn-xs am-text-secondary"><span className="am-icon-gavel"></span> 发放</button>
		                    <button onClick={o.backDoc.bind(o,c.id,c.openid,c.score,c.money)} className="am-btn am-btn-default am-btn-xs am-text-danger"><span className="am-icon-reply"></span> 退回</button>
		                  </div>
		                </div>
		              </td>
		            </tr>
			);	
		}else{
			return(
					<tr>
		              <td>{c.openid}</td>
		              <td>{c.score}</td>
		              <td>{c.money+"元"}</td>
		              <td>{new Date(c.time).Format("yyyy-MM-dd hh:mm:ss")}</td>
		              <td>{c.name}</td>
		              <td>
		                <div className="am-hide-sm-only am-btn-toolbar">
		                  <div className="am-btn-group am-btn-group-xs">
		                    </div>
		                </div>
		              </td>
		            </tr>
			);	
		}
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
			      <div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">红包发放</strong> / <small>列表</small></div>
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
				    <div className="am-u-sm-12">
				        <form className="am-form">
				          <table className="am-table am-table-striped am-table-hover table-main">
				            <thead>
				              <tr>
				                <th>兑换人openid</th>
				                <th>兑换积分</th>
				                <th>兑换金额</th>
				                <th>兑换时间</th>
				                <th>状态</th>
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