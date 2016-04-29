var editor;
/*表单信息*/
var R_content = React.createClass({
	getInitialState:function(){
		var mode = window.sessionStorage.getItem('mode');
		var smallname = (mode == "edit")?"编辑":"新建";
		var role = window.sessionStorage.getItem('crole');
        return {smallname:smallname};
    },
	createDoc:function(){
		var title = $('#title').val();

		html = editor.html();
      	editor.sync();

      	var post = $('#post').val();
		
		var mode = window.sessionStorage.getItem('mode');
		
		if (!title) {
			$('.errorinfo').html('<p>软文标题不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		
		$.ajax({
			type: "post",
			url: hosts + "/post/createPost",
			data: {
				mode:mode,
				title:title,
				post:post,
				editid: window.sessionStorage.getItem("editid")
			},
			success: function(data) {
				if(data == "300"){
					$('.successinfo').html('<p>保存成功</p>').removeClass("none");
					setTimeout(function() {
						window.location = 'post.html';
					}, 1000);
				}
			}
		});
	},
	cancleDoc:function(){
		history.go(-1);
	},
	componentDidMount:function(){
		var options = {
            uploadJson: '/uploadImg'
        };
	    KindEditor.ready(function(k){
	        editor = k.create('#post',options);
	        var o = this;
			var mode = window.sessionStorage.getItem('mode');
			if(mode == "edit"){
				var editid = window.sessionStorage.getItem("editid");
				$.ajax({
					type: "post",
					url: hosts + "/post/getPostById",
					data: {
						id:editid
					},
					success: function(data) {
						$('#title').val(data[0].title);
						editor.html(data[0].post);
						
					}
				});
			}
	    });
	},
	render:function(){
		return(
			<div className="admin-content">
			
			   	<div className="am-cf am-padding">
					<div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">软文信息表</strong> / <small>{this.state.smallname}</small></div>
				</div>
			    
			    <div className="am-form">
				   
				    <div className="am-g am-margin-top">
				        <div className="am-u-sm-4 am-u-md-2 am-text-right">
				            软文标题
				        </div>
				        <div className="am-u-sm-8 am-u-md-4">
				            <input type="text" id="title" className="am-input-sm" />
				        </div>
				        <div className="am-hide-sm-only am-u-md-6">*必填</div>
				    </div>
				    
				    <div className="am-g am-margin-top">
				        <div className="am-u-sm-12 am-u-md-12">
				            <textarea id="post" name="post"></textarea>
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