var editor;
/*表单信息*/
var R_content = React.createClass({displayName: "R_content",
	getInitialState:function(){
		var mode = window.sessionStorage.getItem('mode');
		var smallname = (mode == "edit")?"编辑":"新建";
		var role = window.sessionStorage.getItem('crole');
        return {smallname:smallname};
    },
    UploadSupplyer:function(){
		var path = document.all.fileUp.value;
		if(!path){return false;}
		$('.loadinfo').html('<p>文件上传中...</p>').removeClass("none");
        $('#supplyformFile').submit();
	},
	createDoc:function(){
		var title = $('#title').val();

		html = editor.html();
      	editor.sync();

      	var post = $('#post').val();
      	var sharetitle = $('#sharetitle').val();
		var supplyfile = $('#supplyfile').val();
		var mode = window.sessionStorage.getItem('mode');
		
		if (!title) {
			$('.errorinfo').html('<p>软文标题不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!sharetitle) {
			$('.errorinfo').html('<p>分享标题不能为空</p>').removeClass("none");
			setTimeout(function() {
				$('.errorinfo').addClass("none");
			}, 2000);
			return false;
		}
		if (!supplyfile) {
			$('.errorinfo').html('<p>分享图片不能为空</p>').removeClass("none");
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
				shareimg:supplyfile,
				sharetitle:sharetitle,
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
						$('#sharetitle').val(data[0].sharetitle);
						$('#title').val(data[0].title);
						editor.html(data[0].post);
						$('#supplyfile').val(data[0].shareimg);
						if(data[0].shareimg){
							var files = '<span class="am-icon-file-o"></span> <a target="_blank" href="'+hosts+'/upload/'+data[0].shareimg+'">供应商确认单</a>';
							$('#supplyfile_div').html(files);
						}
					}
				});
			}
	    });
	    $('#supplyformFile').attr('action',hosts + "/post/uploaddo");
	},
	render:function(){
		return(
			React.createElement("div", {className: "admin-content"}, 
			
			   	React.createElement("div", {className: "am-cf am-padding"}, 
					React.createElement("div", {className: "am-fl am-cf"}, React.createElement("strong", {className: "am-text-primary am-text-lg"}, "软文信息表"), " / ", React.createElement("small", null, this.state.smallname))
				), 
			    
			    React.createElement("div", {className: "am-form"}, 
				   
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "软文标题"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "title", className: "am-input-sm"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-12 am-u-md-12"}, 
				            React.createElement("textarea", {id: "post", name: "post"})
				        )
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				           	"分享图片上传"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				              	React.createElement("form", {id: "supplyformFile", name: "formFile", method: "post", target: "frameFile", 
    encType: "multipart/form-data"}, 
				              		React.createElement("div", {className: "am-form-file"}, 
									  React.createElement("button", {type: "button", className: "am-btn am-btn-default am-btn-sm"}, 
									    React.createElement("i", {className: "am-icon-cloud-upload"}), " 选择要上传的文件"
									  ), 
									  React.createElement("input", {type: "file", id: "fileUp", onChange: this.UploadSupplyer, name: "fileUp"})
									), 
									React.createElement("div", {id: "supplyfile_div"})
				              	), 
				              	React.createElement("iframe", {id: "frameFile", name: "frameFile", style: {display: 'none'}}), 
				              	React.createElement("input", {type: "hidden", id: "supplyfile"})
				            ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    ), 
				    
				    React.createElement("div", {className: "am-g am-margin-top"}, 
				        React.createElement("div", {className: "am-u-sm-4 am-u-md-2 am-text-right"}, 
				            "分享标题"
				        ), 
				        React.createElement("div", {className: "am-u-sm-8 am-u-md-4"}, 
				            React.createElement("input", {type: "text", id: "sharetitle", className: "am-input-sm"})
				        ), 
				        React.createElement("div", {className: "am-hide-sm-only am-u-md-6"}, "*必填")
				    )
				), 
				
				React.createElement("div", {className: "am-margin"}, 
				    React.createElement("button", {type: "button", onClick: this.createDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "保存"), 
				    React.createElement("button", {type: "button", onClick: this.cancleDoc, className: "btn-c am-btn am-btn-primary am-btn-xs"}, "关闭")
				)
			)
		);
	}
});