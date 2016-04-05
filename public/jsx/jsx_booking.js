var supply_total_val = ""; /*保存上次的值*/
var buy_total_val = "";
var numPerson_val = ""; 

/*上家信息*/
var R_supplylist = React.createClass({
	getInitialState:function(){
		window.sessionStorage.setItem('numSupply',1);
        return {numSupply:1};
    },
    addsp:function(){
    	var n = Number(this.state.numSupply)+1;
    	window.sessionStorage.setItem('numSupply',n);
    	this.setState({numSupply:n});
    },
    plussp:function(){
    	var n = Number(this.state.numSupply)-1;
    	if(n == 0){
    		$('.errorinfo').html('<p>只剩一条记录不能删除</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
    	}
    	window.sessionStorage.setItem('numSupply',n);
    	this.setState({numSupply:n});
    },
    componentDidMount:function(){
		var o = this;
		$('#operator').val(window.sessionStorage.getItem('cname'));
		var mode = window.sessionStorage.getItem('mode');
		if(mode == "edit"){
			var editid = window.sessionStorage.getItem("editid");
			$.ajax({
				type: "post",
				url: hosts + "/service/getSupplyrecordById",
				data: {
					id:editid
				},
				success: function(data) {
					var num = 0;
					for(var i in data){
						num += 1;
					}
					window.sessionStorage.setItem('numSupply',num);
    				o.setState({numSupply:num});
    				for(var i in data){
						$('#sp_type_'+i).val(data[i].sp_type);
						$('#sp_paydate_'+i).val(data[i].sp_paydate);
						$('#sp_paynum_'+i).val(data[i].sp_paynum);
						$('#sp_payer_'+i).val(data[i].sp_payer);
						$('#sp_geter_'+i).val(data[i].sp_geter);
					}
				}
			});
		}
		$('#supplyformFile').attr('action',hosts + "/service/uploaddo");
	},
	render:function(){
		var list=[];
        for(var i=0;i<this.state.numSupply;i++){
            list.push(
               <tr>
	              <td><input type="text" id={"sp_type_"+i} className="am-input-sm" /></td>
	              <td><input type="text" id={"sp_paydate_"+i} className="am-input-sm" /></td>
	              <td><input type="text" id={"sp_paynum_"+i} className="am-input-sm" /></td>
	              <td><input type="text" id={"sp_payer_"+i} className="am-input-sm" /></td>
	              <td><input type="text" id={"sp_geter_"+i} className="am-input-sm" /></td>
	            </tr>
            )
        }
		return(
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
					<tbody>
					    {list}
					</tbody>
				</table>
				<button type="button" onClick={this.addsp} className="btn-c am-btn am-btn-primary am-btn-xs">增加</button>
				<button type="button" onClick={this.plussp} className="btn-c am-btn am-btn-primary am-btn-xs">删除</button>
			</div>
		);
	}
});
/*下家信息*/
var R_buylist = React.createClass({
	getInitialState:function(){
		window.sessionStorage.setItem('numBuy',1);
        return {numBuy:1};
    },
    addsp:function(){
    	var n = Number(this.state.numBuy)+1;
    	window.sessionStorage.setItem('numBuy',n);
    	this.setState({numBuy:n});
    },
    plussp:function(){
    	var n = Number(this.state.numBuy)-1;
    	if(n == 0){
    		$('.errorinfo').html('<p>只剩一条记录不能删除</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
    	}
    	window.sessionStorage.setItem('numBuy',n);
    	this.setState({numBuy:n});
    },
    componentDidMount:function(){
		var o = this;
		$('#operator').val(window.sessionStorage.getItem('cname'));
		var mode = window.sessionStorage.getItem('mode');
		if(mode == "edit"){
			var editid = window.sessionStorage.getItem("editid");
			
			$.ajax({
				type: "post",
				url: hosts + "/service/getBuyrecordById",
				data: {
					id:editid
				},
				success: function(data) {
					var num = 0;
					for(var i in data){
						num += 1;
					}
					window.sessionStorage.setItem('numBuy',num);
    				o.setState({numBuy:num});
    				for(var i in data){
						$('#by_type_'+i).val(data[i].by_type);
						$('#by_paydate_'+i).val(data[i].by_paydate);
						$('#by_paynum_'+i).val(data[i].by_paynum);
						$('#by_payer_'+i).val(data[i].by_payer);
						$('#by_geter_'+i).val(data[i].by_geter);
					}
				}
			});
		}
	},
	render:function(){
		var list=[];
        for(var i=0;i<this.state.numBuy;i++){
            list.push(
               <tr>
	              <td><input type="text" id={"by_type_"+i} className="am-input-sm" /></td>
	              <td><input type="text" id={"by_paydate_"+i} className="am-input-sm" /></td>
	              <td><input type="text" id={"by_paynum_"+i} className="am-input-sm" /></td>
	              <td><input type="text" id={"by_payer_"+i} className="am-input-sm" /></td>
	              <td><input type="text" id={"by_geter_"+i} className="am-input-sm" /></td>
	            </tr>
            )
        }
		return(
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
					<tbody>
					    {list}
					</tbody>
				</table>
				<button type="button" onClick={this.addsp} className="btn-c am-btn am-btn-primary am-btn-xs">增加</button>
				<button type="button" onClick={this.plussp} className="btn-c am-btn am-btn-primary am-btn-xs">删除</button>
			</div>
		);
	}
});
/*表单信息*/
var R_content = React.createClass({
	getInitialState:function(){
		var mode = window.sessionStorage.getItem('mode');
		var smallname = (mode == "edit")?"编辑":"新建";
		var role = window.sessionStorage.getItem('crole');
		var finish = '';
		if(role == "业务员"){
			finish = 'none';
		}
        return {finish:finish,numDay:"",startDate:window.sessionStorage.getItem('startDate'),supply_total:"",smallname:smallname};
    },
	createDoc:function(){
		var bookingno = $('#bookingno').val();
		var saler = $('#saler').val();
		var operator = $('#operator').val();
		var startDate = $('#startDate').val();
		var ShipName = $('#ShipName').val();
		var numDay = $('#numDay').val();
		var txtLine = $('#txtLine').val();
		var txtRoom = $('#txtRoom').val();
		var numPerson = $('#numPerson').val();
		var remark = $('#remark').val();
		
		var supplyfile = $('#supplyfile').val();
		var buyfile = $('#buyfile').val();
		var supply_company = $('#supply_company').val();
		var supply_name = $('#supply_name').val();
		var supply_tel = $('#supply_tel').val();
		var supply_total = $('#supply_total').val();
		var supply_deadline = $('#supply_deadline').val();

		var supply_invoice = jqradio('supply_invoice');
		var supply_invoiceHead = $('#supply_invoiceHead').val();
		
		var buy_type = jqradio('buy_type');
		var buy_contract = jqradio('buy_contract');
		var buy_invoice = jqradio('buy_invoice');
		
		var buy_company = $('#buy_company').val();
		var buy_name = $('#buy_name').val();
		var buy_tel = $('#buy_tel').val();
		var buy_total = $('#buy_total').val();
		var buy_deadline = $('#buy_deadline').val();
		var buy_contractNo = $('#buy_contractNo').val();
		var buy_invoiceHead = $('#buy_invoiceHead').val();

		var buy_insure = jqradio('buy_insure');
		var buy_insureHead = $('#buy_insureHead').val();
		
		var fin_change = $('#fin_change').val();
		var fin_invoice = $('#fin_invoice').val();
		var fin_month = $('#fin_month').val();
		var fin_nohx = $('#fin_nohx').val();
		var fin_remark = $('#fin_remark').val();
		
		var sp_type = null;
		var sp_paydate = null;
		var sp_paynum = null;
		var sp_payer = null;
		var sp_geter = null;
		
		var n = window.sessionStorage.getItem('numSupply');
		for(var i=0;i<n;i++){
			if(!sp_type){
				sp_type = $("#sp_type_"+i).val();
				sp_paydate = $("#sp_paydate_"+i).val();
				sp_paynum = $("#sp_paynum_"+i).val();
				sp_payer = $("#sp_payer_"+i).val();
				sp_geter = $("#sp_geter_"+i).val();
			}else{
				sp_type = sp_type + "@" + $("#sp_type_"+i).val();
				sp_paydate = sp_paydate + "@" + $("#sp_paydate_"+i).val();
				sp_paynum = sp_paynum + "@" + $("#sp_paynum_"+i).val();
				sp_payer = sp_payer + "@" + $("#sp_payer_"+i).val();
				sp_geter = sp_geter + "@" + $("#sp_geter_"+i).val();
			}
		}
		
		var by_type = null;
		var by_paydate = null;
		var by_paynum = null;
		var by_payer = null;
		var by_geter = null;
		
		var nb = window.sessionStorage.getItem('numBuy');
		for(var i=0;i<nb;i++){
			if(!by_type){
				by_type = $("#by_type_"+i).val();
				by_paydate = $("#by_paydate_"+i).val();
				by_paynum = $("#by_paynum_"+i).val();
				by_payer = $("#by_payer_"+i).val();
				by_geter = $("#by_geter_"+i).val();
			}else{
				by_type = by_type + "@" + $("#by_type_"+i).val();
				by_paydate = by_paydate + "@" + $("#by_paydate_"+i).val();
				by_paynum = by_paynum + "@" + $("#by_paynum_"+i).val();
				by_payer = by_payer + "@" + $("#by_payer_"+i).val();
				by_geter = by_geter + "@" + $("#by_geter_"+i).val();
			}
		}
		
		var mode = window.sessionStorage.getItem('mode');
		
		if (!bookingno) {
			$('.errorinfo').html('<p>订单编号不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!saler) {
			$('.errorinfo').html('<p>销售人不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!startDate) {
			$('.errorinfo').html('<p>出发日期不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!ShipName) {
			$('.errorinfo').html('<p>邮轮名称不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!numDay) {
			$('.errorinfo').html('<p>天数不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!txtLine) {
			$('.errorinfo').html('<p>航线不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!txtRoom) {
			$('.errorinfo').html('<p>房型数量不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!numPerson) {
			$('.errorinfo').html('<p>总人数不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		
		/*计算订单利润和利润率*/
		var profit = 0;
		var profitRate = 0;
		if(buy_total && supply_total && Number(buy_total) != 0){
			profit = Number(buy_total) - Number(supply_total);
			profitRate = (profit / Number(buy_total)).toFixed(4);
		}
		$("#profit").val(profit);
		$("#profitRate").val(profitRate);
		
		$.ajax({
			type: "post",
			url: hosts + "/service/createBooking",
			data: {
				mode:mode,
				bookingno: bookingno,
				saler: saler,
				operator:operator,
				startDate:startDate,
				ShipName:ShipName,
				numDay:numDay,
				txtLine:txtLine,
				txtRoom:txtRoom,
				numPerson:numPerson,
				remark:remark,
				supplyfile:supplyfile,
				buyfile:buyfile,
				supply_company:supply_company,
				supply_name:supply_name,
				supply_tel:supply_tel,
				supply_total:supply_total,
				supply_deadline:supply_deadline,
				sp_type:sp_type,
				sp_paydate:sp_paydate,
				sp_paynum:sp_paynum,
				sp_payer:sp_payer,
				sp_geter:sp_geter,
				by_type:by_type,
				by_paydate:by_paydate,
				by_paynum:by_paynum,
				by_payer:by_payer,
				by_geter:by_geter,
				numSupply:n,
				numBuy:nb,
				buy_type:buy_type,
				buy_company:buy_company,
				buy_name:buy_name,
				buy_tel:buy_tel,
				buy_total:buy_total,
				buy_deadline:buy_deadline,
				buy_contractNo:buy_contractNo,
				buy_invoiceHead:buy_invoiceHead,
				buy_contract:buy_contract,
				buy_invoice:buy_invoice,
				buy_insure:buy_insure,
				buy_insureHead:buy_insureHead,
				profit:profit,
				profitRate:profitRate,
				fin_change:fin_change,
				fin_invoice:fin_invoice,
				fin_month:fin_month,
				fin_nohx:fin_nohx,
				supply_invoice:supply_invoice,
				supply_invoiceHead:supply_invoiceHead,
				fin_remark:fin_remark,
				userid: window.sessionStorage.getItem('cid'),
				editid: window.sessionStorage.getItem("editid")
			},
			success: function(data) {
				console.log(data);
				if(data == "300"){
					$('.successinfo').html('<p>保存成功</p>').removeClass("none");
					setTimeout(function() {
						window.location = 'index.html';
					}, 1000);
				}else if(data == "400"){
					$('.errorinfo').html('<p>订单编号重复</p>').removeClass("none");
					setTimeout(function() {
						$('.errorinfo').addClass("none");
					}, 2000);
				}
			}
		});
	},
	cancleDoc:function(){
		window.location = 'index.html';
	},
	supply_total:function(e){
        var val = e.target.value;
        if(isNaN(val)){
            val = supply_total_val;
            $('.errorinfo').html('<p>只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
        }else{
            supply_total_val = val; 
        }
        this.setState({"supply_total":val});
    },
    buy_total:function(e){
        var val = e.target.value;
        if(isNaN(val)){
            val = buy_total_val;
            $('.errorinfo').html('<p>只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
        }else{
            buy_total_val = val; 
        }
        this.setState({"buy_total":val});
    },
    numPerson:function(e){
        var val = e.target.value;
        if(isNaN(val)){
            val = numPerson_val;
            $('.errorinfo').html('<p>只能填写数字</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
        }else{
            numPerson_val = val; 
        }
        this.setState({"numPerson":val});
    },
	showCal:function(){
		$('#startDate').datepicker('open');
	},
	UploadSupplyer:function(){
		var path = document.all.fileUp.value;
		if(!path){return false;}
		$('.loadinfo').html('<p>文件上传中...</p>').removeClass("none");
        $('#supplyformFile').submit();
	},
	UploadBuy:function(){
		var path = document.all.fileUpbuy.value;
		if(!path){return false;}
		$('.loadinfo').html('<p>文件上传中...</p>').removeClass("none");
        $('#buyformFile').submit();
	},
	componentDidMount:function(){
		var o = this;
		$('#operator').val(window.sessionStorage.getItem('cname'));
		var mode = window.sessionStorage.getItem('mode');
		if(mode == "edit"){
			var editid = window.sessionStorage.getItem("editid");
			$.ajax({
				type: "post",
				url: hosts + "/service/getBookingById",
				data: {
					id:editid
				},
				success: function(data) {
					$('#bookingno').val(data[0].bookingno).attr("readonly","readonly");
					$('#saler').val(data[0].saler);
					$('#operator').val(data[0].operator);
					//$('#startDate').val(data[0].startDate);
					$('#ShipName').val(data[0].ShipName);
					$('#numDay').val(data[0].numDay);
					$('#txtLine').val(data[0].txtLine);
					$('#txtRoom').val(data[0].txtRoom);
					$('#numPerson').val(data[0].numPerson);
					$('#remark').html(data[0].remark);
					
					$('#supply_company').val(data[0].supply_company);
					$('#supply_name').val(data[0].supply_name);
					$('#supply_tel').val(data[0].supply_tel);
					$('#supply_total').val(data[0].supply_total);
					supply_total_val = data[0].supply_total;
					o.setState({"supply_total":data[0].supply_total});
					
					$('#supply_deadline').val(data[0].supply_deadline);
					$('#supplyfile').val(data[0].supplyfile);
					if(data[0].supplyfile){
						var files = '<span class="am-icon-file-o"></span> <a target="_blank" href="'+hosts+'/files/'+data[0].supplyfile+'">供应商确认单</a>';
						$('#supplyfile_div').html(files);
					}
					$('#buyfile').val(data[0].buyfile);
					if(data[0].buyfile){
						var files = '<span class="am-icon-file-o"></span> <a target="_blank" href="'+hosts+'/files/'+data[0].buyfile+'">客户确认单</a>';
						$('#buyfile_div').html(files);
					}
					
					$('#buy_company').val(data[0].buy_company);
					$('#buy_name').val(data[0].buy_name);
					$('#buy_tel').val(data[0].buy_tel);
					$('#buy_total').val(data[0].buy_total);
					$('#buy_deadline').val(data[0].buy_deadline);
					$('#buy_contractNo').val(data[0].buy_contractNo);
					$('#buy_invoiceHead').val(data[0].buy_invoiceHead);
					
					$("#profit").val(data[0].profit);
					$("#profitRate").val(data[0].profitRate);
					
					$("#fin_change").val(data[0].fin_change);
					$("#fin_invoice").val(data[0].fin_invoice);
					$("#fin_month").val(data[0].fin_month);
					$("#fin_nohx").val(data[0].fin_nohx);
					$("#fin_remark").html(data[0].fin_remark);

					$("#buy_insureHead").val(data[0].buy_insureHead);
					$("#supply_invoiceHead").val(data[0].supply_invoiceHead);

					if(data[0].supply_invoice == "已开"){
						$("#supply_invoice_div").find("label").eq(0).addClass("am-active");
						$("#supply_invoice_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].supply_invoice == "未开"){
						$("#supply_invoice_div").find("label").eq(1).addClass("am-active");
						$("#supply_invoice_div").find("input").eq(1).attr("checked","checked");
					}
					
					if(data[0].buy_type == "同行"){
						$("#buy_type_div").find("label").eq(0).addClass("am-active");
						$("#buy_type_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].buy_type == "直客"){
						$("#buy_type_div").find("label").eq(1).addClass("am-active");
						$("#buy_type_div").find("input").eq(1).attr("checked","checked");
					}
					
					if(data[0].buy_contract == "是"){
						$("#buy_contract_div").find("label").eq(0).addClass("am-active");
						$("#buy_contract_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].buy_contract == "否"){
						$("#buy_contract_div").find("label").eq(1).addClass("am-active");
						$("#buy_contract_div").find("input").eq(1).attr("checked","checked");
					}
					
					if(data[0].buy_invoice == "是"){
						$("#buy_invoice_div").find("label").eq(0).addClass("am-active");
						$("#buy_invoice_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].buy_invoice == "否"){
						$("#buy_invoice_div").find("label").eq(1).addClass("am-active");
						$("#buy_invoice_div").find("input").eq(1).attr("checked","checked");
					}

					if(data[0].buy_insure == "是"){
						$("#buy_insure_div").find("label").eq(0).addClass("am-active");
						$("#buy_insure_div").find("input").eq(0).attr("checked","checked");
					}else if(data[0].buy_insure == "否"){
						$("#buy_insure_div").find("label").eq(1).addClass("am-active");
						$("#buy_insure_div").find("input").eq(1).attr("checked","checked");
					}
				}
			});
		}
		$('#supplyformFile').attr('action',hosts + "/service/uploaddo");
		$('#buyformFile').attr('action',hosts + "/service/uploadbuydo");
	},
	render:function(){
		return(
			<div className="admin-content">
			
			   	<div className="am-cf am-padding">
					<div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">销售订单</strong> / <small>{this.state.smallname}</small></div>
				</div>
			    
			    <div className="am-tabs am-margin" data-am-tabs>
				    <ul className="am-tabs-nav am-nav am-nav-tabs">
				      <li className="am-active"><a href="#tab1">销售填写</a></li>
				      <li><a href="#tab2">客户信息</a></li>
				      <li><a href="#tab3">供应商信息</a></li>
				      <li><a href="#tab4" className={this.state.finish}>结团信息</a></li>
				      <li><a href="#tab5">说明</a></li>
				    </ul>
				
				    <div className="am-tabs-bd">
				      <div className="am-tab-panel am-fade am-in am-active" id="tab1">
				       	<div className="am-form">
				       	
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              订单编号
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="bookingno" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">*必填，不可重复，格式：YLDJ-160105QJ1</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              销售人
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="saler" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">*必填</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              操作人
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="operator" className="am-input-sm" readOnly />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              出发日期
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              	<div className="am-input-group am-datepicker-date">
								  <input type="text" id="startDate" className="am-form-field" defaultValue={this.state.startDate} readOnly />
								  <span className="am-input-group-btn am-datepicker-add-on">
								    <button onClick={this.showCal} className="am-btn am-btn-default" type="button"><span className="am-icon-calendar"></span> </button>
								  </span>
								</div>
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">*必填</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              邮轮名称
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="ShipName" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">*必填</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              天数
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="numDay" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">*必填</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              航线
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="txtLine" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">*必填</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              房型数量
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="txtRoom" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">*必填</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              总人数
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="numPerson" className="am-input-sm" value={this.state.numPerson} onChange={this.numPerson} />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">*必填</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              订单利润
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="profit" className="am-input-sm" readOnly />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">自动计算(下家金额-上家金额)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              订单利润率
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="profitRate" className="am-input-sm" readOnly />
				            </div>
				            <div className="am-hide-sm-only am-u-md-6">自动计算(订单利润/下家金额)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-2 am-text-right">
				              订单说明
				            </div>
				            <div className="am-u-sm-8 am-u-md-10">
				            	<textarea id="remark" rows="3"></textarea>
				            </div>
				          </div>
				        </div>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab2">
				      	<div className="am-form">
				      	
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              客户类型
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              	<div className="am-btn-group" id="buy_type_div" data-am-button>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="buy_type" value="同行" >同行</input>
					              </label>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="buy_type" value="直客" >直客</input>
					              </label>
					            </div>
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              客户公司
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="buy_company" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*同行必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              联系人
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="buy_name" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              联系人电话
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="buy_tel" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              采购金额(应收金额)
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="buy_total" className="am-input-sm" value={this.state.buy_total} onChange={this.buy_total} />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              收款时限
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="buy_deadline" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              提供合同
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              	<div className="am-btn-group" id="buy_contract_div" data-am-button>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="buy_contract" value="是" >是</input>
					              </label>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="buy_contract" value="否" >否</input>
					              </label>
					            </div>
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              合同编号
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="buy_contractNo" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              提供对方发票
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              	<div className="am-btn-group" id="buy_invoice_div" data-am-button>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="buy_invoice" value="是" >是</input>
					              </label>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="buy_invoice" value="否" >否</input>
					              </label>
					            </div>
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              发票抬头/金额
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="buy_invoiceHead" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>

				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              购买保险
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              	<div className="am-btn-group" id="buy_insure_div" data-am-button>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="buy_insure" value="是" >是</input>
					              </label>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="buy_insure" value="否" >否</input>
					              </label>
					            </div>
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>

				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              保险名称/金额
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="buy_insureHead" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>

				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              客户确认单上传
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              	<form id="buyformFile" name="formFile1" method="post" target="frameFilebuy"
    encType="multipart/form-data">
				              		<div className="am-form-file">
									  <button type="button" className="am-btn am-btn-default am-btn-sm">
									    <i className="am-icon-cloud-upload"></i> 选择要上传的文件
									  </button>
									  <input type="file" id="fileUpbuy" onChange={this.UploadBuy} name="fileUpbuy" />
									</div>                                    
									<div id="buyfile_div"></div>
				              	</form>
				              	<iframe id="frameFile" name="frameFilebuy" style={{display: 'none'}}></iframe>
				              	<input type="hidden" id="buyfile" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <R_buylist />
				          
				        </div>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab3">
				       	<div className="am-form">
				       	
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              供应商公司
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="supply_company" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              联系姓名
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="supply_name" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              联系电话
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="supply_tel" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              总金额
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="supply_total" className="am-input-sm" value={this.state.supply_total} onChange={this.supply_total} />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              付款时限
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="supply_deadline" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>

				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              供应商发票
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              	<div className="am-btn-group" id="supply_invoice_div" data-am-button>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="supply_invoice" value="已开" >已开</input>
					              </label>
					              <label className="am-btn am-btn-default am-btn-xs">
					                <input type="radio" name="supply_invoice" value="未开" >未开</input>
					              </label>
					            </div>
				            </div>
				            <div className="am-hide-sm-only am-u-md-5">(*必填)</div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              发票抬头/金额
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="supply_invoiceHead" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              供应商确认单上传
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              	<form id="supplyformFile" name="formFile" method="post" target="frameFile"
    encType="multipart/form-data">
				              		<div className="am-form-file">
									  <button type="button" className="am-btn am-btn-default am-btn-sm">
									    <i className="am-icon-cloud-upload"></i> 选择要上传的文件
									  </button>
									  <input type="file" id="fileUp" onChange={this.UploadSupplyer} name="fileUp" />
									</div>                                    
									<div id="supplyfile_div"></div>
				              	</form>
				              	<iframe id="frameFile" name="frameFile" style={{display: 'none'}}></iframe>
				              	<input type="hidden" id="supplyfile" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <R_supplylist />
				          
				        </div>
				      </div>
				      <div className="am-tab-panel am-fade" id="tab4">
				       	<div className="am-form">
				      	
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              利润核对
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="fin_change" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              发票情况
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="fin_invoice" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              结团月份
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="fin_month" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              收付方非华夏是否结算清楚
				            </div>
				            <div className="am-u-sm-8 am-u-md-4">
				              <input type="text" id="fin_nohx" className="am-input-sm" />
				            </div>
				            <div className="am-hide-sm-only am-u-md-5"></div>
				          </div>
				          
				          <div className="am-g am-margin-top">
				            <div className="am-u-sm-4 am-u-md-3 am-text-right">
				              其他说明
				            </div>
				            <div className="am-u-sm-8 am-u-md-9">
				              <textarea id="fin_remark" rows="3"></textarea>
				            </div>
				          </div>
				          
				        </div>
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
				    <button type="button" onClick={this.createDoc} className="btn-c am-btn am-btn-primary am-btn-xs">保存</button>
				    <button type="button" onClick={this.cancleDoc} className="btn-c am-btn am-btn-primary am-btn-xs">关闭</button>
				</div>
			</div>
		);
	}
});