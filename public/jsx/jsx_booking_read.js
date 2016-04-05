var R_content = React.createClass({
	getInitialState: function() { 
		var finish = '';
		var role = window.sessionStorage.getItem('crole');
		if(role == "业务员"){
			finish = 'none';
		}
		return {finish:finish,bookingno: "",saler:"",operator:"",startDate:"",ShipName:"",numDay:"",txtLine:"",txtRoom:"",numPerson:"",remark:"",
		supply_company:"",supply_name:"",supply_tel:"",supply_total:"",supply_deadline:"",
		buy_type:"",buy_company:"",buy_name:"",buy_tel:"",buy_total:"",buy_deadline:"",buy_contractNo:"",buy_invoiceHead:"",buy_contract:"",buy_invoice:"",
		profit:"",profitRate:"",fin_change:"",fin_invoice:"",fin_month:"",fin_nohx:"",supply_invoice:"",supply_invoiceHead:""
		};
	},
	cancleDoc:function(){
		window.location = 'index.html';
	},
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var readdocid = window.sessionStorage.getItem("readdocid");
		$.ajax({
			type: "post",
			url: hosts + "/service/getBookingById",
			data: {
				id:readdocid
			},
			success: function(data) {
				o.setState({bookingno:data[0].bookingno});
				o.setState({saler:data[0].saler});
				o.setState({operator:data[0].operator});
				o.setState({startDate:data[0].startDate});
				o.setState({ShipName:data[0].ShipName});
				o.setState({numDay:data[0].numDay});
				o.setState({txtLine:data[0].txtLine});
				o.setState({txtRoom:data[0].txtRoom});
				o.setState({numPerson:data[0].numPerson});
				$('#remark').html(data[0].remark);
				
				o.setState({supply_company:data[0].supply_company});
				o.setState({supply_name:data[0].supply_name});
				o.setState({supply_tel:data[0].supply_tel});
				o.setState({supply_total:data[0].supply_total});
				o.setState({supply_deadline:data[0].supply_deadline});
				if(data[0].supplyfile){
					var files = '<span class="am-icon-file-o"></span> <a target="_blank" href="'+hosts+'/files/'+data[0].supplyfile+'">供应商确认单</a>';
					$('#supplyfile').html(files);
				}
				if(data[0].buyfile){
					var files = '<span class="am-icon-file-o"></span> <a target="_blank" href="'+hosts+'/files/'+data[0].buyfile+'">客户确认单</a>';
					$('#buyfile').html(files);
				}
				
				o.setState({buy_type:(data[0].buy_type !="undefined")?(data[0].buy_type):""});
				o.setState({buy_contract:(data[0].buy_contract !="undefined")?(data[0].buy_contract):""});
				o.setState({buy_invoice:(data[0].buy_invoice !="undefined")?(data[0].buy_invoice):""});
				o.setState({buy_insure:(data[0].buy_insure !="undefined")?(data[0].buy_insure):""});
				
				o.setState({buy_company:data[0].buy_company});
				o.setState({buy_name:data[0].buy_name});
				o.setState({buy_tel:data[0].buy_tel});
				o.setState({buy_total:data[0].buy_total});
				o.setState({buy_deadline:data[0].buy_deadline});
				o.setState({buy_contractNo:data[0].buy_contractNo});
				o.setState({buy_invoiceHead:data[0].buy_invoiceHead});
				o.setState({buy_insureHead:data[0].buy_insureHead});
				
				o.setState({profit:data[0].profit});
				o.setState({profitRate:(Number(data[0].profitRate)*100).toFixed(2)+"%"});
				
				o.setState({fin_change:data[0].fin_change});
				o.setState({fin_invoice:data[0].fin_invoice});
				o.setState({fin_month:data[0].fin_month});
				o.setState({fin_nohx:data[0].fin_nohx});

				o.setState({supply_invoice:(data[0].supply_invoice !="undefined")?(data[0].supply_invoice):""});
				o.setState({supply_invoiceHead:data[0].supply_invoiceHead});

				$('#fin_remark').html(data[0].fin_remark);
				$modal.modal('close');
			}
		});
		$.ajax({
			type: "post",
			url: hosts + "/service/getSupplyrecordById",
			data: {
				id:readdocid
			},
			success: function(data) {
				var html = '';
				for(var i in data){
					html += '<tr>';
					html += '<td>'+data[i].sp_type+'</td>';
					html += '<td>'+data[i].sp_paydate+'</td>';
					html += '<td>'+data[i].sp_paynum+'</td>';
					html += '<td>'+data[i].sp_payer+'</td>';
					html += '<td>'+data[i].sp_geter+'</td>';
					html += '</tr>';
				}
				$('#supplybody').html(html);
			}
		});
		$.ajax({
			type: "post",
			url: hosts + "/service/getBuyrecordById",
			data: {
				id:readdocid
			},
			success: function(data) {
				var html = '';
				for(var i in data){
					html += '<tr>';
					html += '<td>'+data[i].by_type+'</td>';
					html += '<td>'+data[i].by_paydate+'</td>';
					html += '<td>'+data[i].by_paynum+'</td>';
					html += '<td>'+data[i].by_payer+'</td>';
					html += '<td>'+data[i].by_geter+'</td>';
					html += '</tr>';
				}
				$('#buybody').html(html);
			}
		});
	},
	render:function(){
		return(
			<div className="admin-content">
			
			   	<div className="am-cf am-padding">
					<div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">销售订单</strong> / <small>查看</small></div>
				</div>
			    
			    <div className="am-tabs am-margin" data-am-tabs>
				    <ul className="am-tabs-nav am-nav am-nav-tabs">
				      <li className="am-active"><a href="#tab1">销售填写</a></li>
				      <li><a href="#tab2">客户信息</a></li>
				      <li><a href="#tab3">供应商信息</a></li>
				      <li><a href="#tab4" className={this.state.finish} >结团信息</a></li>
				      <li><a href="#tab5">说明</a></li>
				    </ul>
				
				    <div className="am-tabs-bd">
				      <div className="am-tab-panel am-fade am-in am-active" id="tab1">
				       	<form className="am-form">
				       	
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              订单编号
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              {this.state.bookingno}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              销售人
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              {this.state.saler}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              操作人
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              {this.state.operator}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              出发日期
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              	{this.state.startDate}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              邮轮名称
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              	{this.state.ShipName}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              天数
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              {this.state.numDay}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              航线
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				            	{this.state.txtLine}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              房型数量
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				            	{this.state.txtRoom}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              总人数
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				            	{this.state.numPerson}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              订单利润
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				            	{this.state.profit}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              订单利润率
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				            	{this.state.profitRate}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              订单说明
				            </div>
				            <div id="remark" className="am-u-sm-8 am-u-md-10">
				            	
				            </div>
				          </div>
				          
				        </form>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab2">
				       	<div className="am-form">
				       	
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              客户类型
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_type}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              客户公司
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_company}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              联系人
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_name}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              联系人电话
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_tel}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              采购金额(应收金额)
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_total}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              收款时限
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_deadline}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              提供合同
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_contract}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              合同编号
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_contractNo}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              提供对方发票
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_invoice}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              发票抬头/金额
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_invoiceHead}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              购买保险
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_insure}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              保险名称/金额
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.buy_insureHead}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>

				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              客户确认单
				            </div>
				            <div id="buyfile" className="am-u-sm-8 am-u-md-4">					
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>

				          	<div>
								<table className="am-table am-table-striped am-table-hover table-main">
									<thead>
									   	<tr>
									        <th>款项类型</th>
								            <th>付款日期</th>
								            <th>付款金额</th>
								            <th>付款人</th>
								            <th>收款方(华夏/3055)</th>
									    </tr>
									</thead>
									<tbody id="buybody">
									    
									</tbody>
								</table>
							</div>
				          
				        </div>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab3">
				      	<div className="am-form">
				       	
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              供应商公司
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.supply_company}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              联系姓名
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.supply_name}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              联系电话
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.supply_tel}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              总金额
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.supply_total}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              付款时限
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.supply_deadline}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>

				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              供应商发票
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.supply_invoice}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>

				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              发票抬头/金额
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				            	{this.state.supply_invoiceHead}
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-left">
				              供应商确认单
				            </div>
				            <div id="supplyfile" className="am-u-sm-8 am-u-md-4">					
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          	<div>
								<table className="am-table am-table-striped am-table-hover table-main">
									<thead>
									   	<tr>
									        <th>款项类型</th>
								            <th>付款日期</th>
								            <th>付款金额</th>
								            <th>付款人(华夏/3055)</th>
								            <th>收款方</th>
									    </tr>
									</thead>
									<tbody id="supplybody">
									    
									</tbody>
								</table>
							</div>
				          
				        </div>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab4">
				       	<form className="am-form">
				       	
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              利润核对
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              {this.state.fin_change}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              发票情况
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              {this.state.fin_invoice}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              结团月份
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              {this.state.fin_month}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				            	收付方非华夏是否结算清楚
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				              {this.state.fin_nohx}
				            </div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-left">
				              其他说明
				            </div>
				            <div id="fin_remark" className="am-u-sm-8 am-u-md-10">
				              
				            </div>
				          </div>
				          
				        </form>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab5">
				       	<div className="am-panel am-panel-default admin-sidebar-panel">
					        <div className="am-panel-bd">
					          <p><span className="am-icon-bookmark"></span> 说明</p>
					          <p>1、销售在提交《付款申请单》时候，填写本单（打星号部分为必填），并附上与下家的订单确认单（需有下家确认盖章或签字）。交由财务确认留底。</p>
					          <p>2、如收付为其他，需其他方负责人在本单上签字方有效。如在订单未结团前，出现金额更改，订单变动，退款等情况，销售需到财务处，在本单上一并修改。</p>
					          <p>3、在订单出行后，需办理结团。按照以下规则完成结团：除需退款订单之外，如订单结束日为当月20日之前，则当月结团。如订单结束日为当月20日之后，则次月结团。如无法按时完成结团的。将统一汇报给领导处理。</p>
					          <p>4、财务填写结团信息，销售需配合完成应结团订单相关操作，包括帐款，上家需要提供的发票等均需收齐。完后后财务和销售共同签字。</p>
					          <p>5、订单在完成结团后方可给予销售提成。提成月份为结团次月。</p>
					        </div>
					    </div>
				      </div>
				    </div>
				</div>
				
				<div className="am-margin">
				    <button type="button" onClick={this.cancleDoc} className="btn-c am-btn am-btn-primary am-btn-xs">关闭</button>
				</div>
			</div>
		);
	}
});