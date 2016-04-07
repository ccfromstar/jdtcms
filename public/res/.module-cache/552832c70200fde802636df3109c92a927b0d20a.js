var R_content = React.createClass({displayName: "R_content",
	getInitialState: function() { 
		
	},
	cancleDoc:function(){
		history.go(-1);
	},
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var readdocid = window.sessionStorage.getItem("readdocid");
		$.ajax({
			type: "post",
			url: hosts + "/post/getPostById",
			data: {
				id:readdocid
			},
			success: function(data) {
				o.setState({bookingno:data[0].bookingno});
	
				$modal.modal('close');
			}
		});
	},
	render:function(){
		return(
			React.createElement("div", {className: "admin-content"}, 
			
			   	React.createElement("div", {className: "am-cf am-padding"}, 
					React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "软文"), " / ", React.createElement("small", null, "预览"))
				), 
			    
			    React.createElement("div", {className: "am-tabs am-margin", "data-am-tabs": true}, 
				    React.createElement("ul", {className: "am-tabs-nav am-nav am-nav-tabs"}, 
				      React.createElement("li", {className: "am-active"}, React.createElement("a", {href: "#tab1"}, "销售填写")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab2"}, "客户信息")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab3"}, "供应商信息")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab4", className: this.state.finish}, "结团信息")), 
				      React.createElement("li", null, React.createElement("a", {href: "#tab5"}, "说明"))
				    ), 
				
				    React.createElement("div", {className: "am-tabs-bd"}, 
				      React.createElement("div", {className: "am-tab-panel am-fade am-in am-active", id: "tab1"}, 
				       	React.createElement("form", {className: "am-form"}, 
				       	
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "订单编号"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              this.state.bookingno
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "销售人"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              this.state.saler
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "操作人"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              this.state.operator
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "出发日期"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              	this.state.startDate
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "邮轮名称"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              	this.state.ShipName
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "天数"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              this.state.numDay
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "航线"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				            	this.state.txtLine
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "房型数量"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				            	this.state.txtRoom
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "总人数"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				            	this.state.numPerson
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "订单利润"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				            	this.state.profit
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "订单利润率"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				            	this.state.profitRate
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "订单说明"
				            ), 
				            React.createElement("div", {id: "remark", className: "am-u-sm-8 am-u-md-10"}
				            	
				            )
				          )
				          
				        )
				      ), 
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab2"}, 
				       	React.createElement("div", {className: "am-form"}, 
				       	
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "客户类型"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_type
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "客户公司"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_company
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "联系人"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_name
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "联系人电话"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_tel
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "采购金额(应收金额)"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_total
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "收款时限"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_deadline
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "提供合同"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_contract
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "合同编号"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_contractNo
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "提供对方发票"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_invoice
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "发票抬头/金额"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_invoiceHead
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "购买保险"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_insure
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "保险名称/金额"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.buy_insureHead
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 

				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "客户确认单"
				            ), 
				            React.createElement("div", {id: "buyfile", className: "am-u-sm-8 am-u-md-4"}					
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 

				          	React.createElement("div", null, 
								React.createElement("table", {className: "am-table am-table-striped am-table-hover table-main"}, 
									React.createElement("thead", null, 
									   	React.createElement("tr", null, 
									        React.createElement("th", null, "款项类型"), 
								            React.createElement("th", null, "付款日期"), 
								            React.createElement("th", null, "付款金额"), 
								            React.createElement("th", null, "付款人"), 
								            React.createElement("th", null, "收款方(华夏/3055)")
									    )
									), 
									React.createElement("tbody", {id: "buybody"}
									    
									)
								)
							)
				          
				        )
				      ), 
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab3"}, 
				      	React.createElement("div", {className: "am-form"}, 
				       	
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "供应商公司"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.supply_company
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "联系姓名"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.supply_name
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "联系电话"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.supply_tel
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "总金额"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.supply_total
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "付款时限"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.supply_deadline
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 

				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "供应商发票"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.supply_invoice
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 

				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "发票抬头/金额"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            	this.state.supply_invoiceHead
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-3 am-text-left"}, 
				              "供应商确认单"
				            ), 
				            React.createElement("div", {id: "supplyfile", className: "am-u-sm-8 am-u-md-4"}					
				            ), 
				            React.createElement("div", {className: "am-hide-sm-only am-u-md-5"})
				          ), 
				          
				          	React.createElement("div", null, 
								React.createElement("table", {className: "am-table am-table-striped am-table-hover table-main"}, 
									React.createElement("thead", null, 
									   	React.createElement("tr", null, 
									        React.createElement("th", null, "款项类型"), 
								            React.createElement("th", null, "付款日期"), 
								            React.createElement("th", null, "付款金额"), 
								            React.createElement("th", null, "付款人(华夏/3055)"), 
								            React.createElement("th", null, "收款方")
									    )
									), 
									React.createElement("tbody", {id: "supplybody"}
									    
									)
								)
							)
				          
				        )
				      ), 
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab4"}, 
				       	React.createElement("form", {className: "am-form"}, 
				       	
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "利润核对"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              this.state.fin_change
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "发票情况"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              this.state.fin_invoice
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "结团月份"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              this.state.fin_month
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				            	"收付方非华夏是否结算清楚"
				            ), 
				            React.createElement("div", {className: "am-u-sm-8 am-u-md-10"}, 
				              this.state.fin_nohx
				            )
				          ), 
				          
				          React.createElement("div", {className: "am-g am-margin-top"}, 
				            React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-left"}, 
				              "其他说明"
				            ), 
				            React.createElement("div", {id: "fin_remark", className: "am-u-sm-8 am-u-md-10"}
				              
				            )
				          )
				          
				        )
				      ), 
				      React.createElement("div", {className: "am-tab-panel am-fade", id: "tab5"}, 
				       	React.createElement("div", {className: "am-panel am-panel-default admin-sidebar-panel"}, 
					        React.createElement("div", {className: "am-panel-bd"}, 
					          React.createElement("p", null, React.createElement("span", {className: "am-icon-bookmark"}), " 说明"), 
					          React.createElement("p", null, "1、销售在提交《付款申请单》时候，填写本单（打星号部分为必填），并附上与下家的订单确认单（需有下家确认盖章或签字）。交由财务确认留底。"), 
					          React.createElement("p", null, "2、如收付为其他，需其他方负责人在本单上签字方有效。如在订单未结团前，出现金额更改，订单变动，退款等情况，销售需到财务处，在本单上一并修改。"), 
					          React.createElement("p", null, "3、在订单出行后，需办理结团。按照以下规则完成结团：除需退款订单之外，如订单结束日为当月20日之前，则当月结团。如订单结束日为当月20日之后，则次月结团。如无法按时完成结团的。将统一汇报给领导处理。"), 
					          React.createElement("p", null, "4、财务填写结团信息，销售需配合完成应结团订单相关操作，包括帐款，上家需要提供的发票等均需收齐。完后后财务和销售共同签字。"), 
					          React.createElement("p", null, "5、订单在完成结团后方可给予销售提成。提成月份为结团次月。")
					        )
					    )
				      )
				    )
				), 
				
				React.createElement("div", {className: "am-margin"}, 
				    React.createElement("button", {type: "button", onClick: this.cancleDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "关闭")
				)
			)
		);
	}
});