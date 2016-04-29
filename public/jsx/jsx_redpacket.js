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
	UpdateRedpacket:function(){
		var redpacket_min = $("#redpacket_min").val();
		var redpacket_max = $("#redpacket_max").val();
		if(isNaN(redpacket_min) || isNaN(redpacket_max)){
			$('.errorinfo').html('<p>只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		var that = this;

		$.ajax({
			type: "post",
			url: hosts + "/settings/updateRedPacketSettings",
			data: {
				redpacket_min:redpacket_min,
				redpacket_max:redpacket_max
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
			url: hosts + "/redpacket/getRecord",
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
	setSettings:function(){
		var $modal = $('#my-modal-loading');
		$modal.modal();
		$.ajax({
			type: "post",
			url: hosts + "/settings/getSettings",
			data: {
				
			},
			success: function(data) {
				$("#redpacket_min").val(data[0].redpacket_min);
				$("#redpacket_max").val(data[0].redpacket_max);
				$modal.modal('close');
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
			url: hosts + "/redpacket/getRecord",
			data: {
				indexPage:indexPage
			},
			success: function(data) {
				o.setState({data:data.record});
				o.setState({total:data.total});
				o.setState({totalpage:data.totalpage});
				o.setState({isFirst:(data.isFirstPage?"am-disabled":"")});
				o.setState({isLast:(data.isLastPage?"am-disabled":"")});
				o.setSettings();
				$modal.modal('close');
			}
		});
	},
	render:function(){
		var o = this;
		var list = this.state.data.map(function(c){
		return(
				<tr>
	              <td>{c.money==-1?"随机金额":c.money+"元"}</td>
	              <td>{c.score}</td>
	              <td>
	                <div className="am-hide-sm-only am-btn-toolbar">
	                  <div className="am-btn-group am-btn-group-xs">
	                    <button onClick={o.editDoc.bind(o,c.id,c.startDate)} className="am-btn am-btn-default am-btn-xs am-text-secondary"><span className="am-icon-pencil-square-o"></span> 编辑</button>
	                    <button onClick={o.delDoc.bind(o,c.id)} className="am-btn am-btn-default am-btn-xs am-text-danger"><span className="am-icon-trash-o"></span> 删除</button>
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
			      <div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">红包设定</strong> / <small>列表</small></div>
				</div>
				
				
				<div className="am-tabs am-margin" data-am-tabs>
				    <ul className="am-tabs-nav am-nav am-nav-tabs">
				      <li className="am-active"><a href="#tab1">固定金额红包</a></li>
				      <li><a href="#tab2">随机金额红包</a></li>
				    </ul>
				
				    <div className="am-tabs-bd">
				      <div className="am-tab-panel am-fade am-in am-active" id="tab1">
				      		<div className="am-g">
						      <div className="am-u-sm-12 am-u-md-12">
						        <div className="am-btn-toolbar">
						          <div className="am-btn-group am-btn-group-xs">
						            <button id="btn_add" type="button" onClick={this.newDoc} className="am-btn am-btn-default"><span className="am-icon-plus"></span> 新增</button>
						          </div>
						        </div>
						      </div>
						    </div>
						    
						    <div className="am-g">
							    <div className="am-u-sm-12">
							        <form className="am-form">
							          <table className="am-table am-table-striped am-table-hover table-main jdt-table">
							            <thead>
							              <tr>
							                <th>红包金额</th>
							                <th>所需积分</th>
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
				      </div>
				      <div className="am-tab-panel am-fade" id="tab2">
				      		<div className="am-form">
				      			金额范围：<input type="text" id="redpacket_min" className="am-input-sm settings_input" defaultValue="0" /> ~ <input type="text" id="redpacket_max" className="am-input-sm settings_input" defaultValue="0" />
				      			<button type="button" onClick={this.UpdateRedpacket} className="btn-c am-btn am-btn-primary am-btn-xs">保存</button>
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
			</div>
		);
	}
});