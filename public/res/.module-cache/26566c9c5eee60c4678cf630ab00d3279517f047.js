var R_content = React.createClass({displayName: "R_content",
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
				$("#title").html(data[0].title);
				$modal.modal('close');
			}
		});
	},
	render:function(){
		return(
			React.createElement("div", {className: "am-g am-g-fixed blog-g-fixed"}, 
				React.createElement("div", {className: "am-u-md-12"}, 
					React.createElement("article", {className: "post-main"}, 
						React.createElement("h3", {id: "title", className: "am-article-title"}), 
						React.createElement("h4", {id: "date", className: "am-article-meta blog-meta"}), 
						React.createElement("div", {className: "am-g"}, 
							React.createElement("div", {className: "am-u-sm-12"}, 
								"文章内容"
							)
						)
					)
				)
			)
		);
	}
});

/*
 * 数据加载组件
 * */
var R_loading = React.createClass({displayName: "R_loading",
	render:function(){
		return(
			React.createElement("div", {className: "am-modal am-modal-loading am-modal-no-btn", tabIndex: "-1", id: "my-modal-loading"}, 
				React.createElement("div", {className: "am-modal-dialog"}, 
					React.createElement("div", {className: "am-modal-hd"}, "数据加载中..."), 
					React.createElement("div", {className: "am-modal-bd"}, 
						React.createElement("span", {className: "am-icon-spinner am-icon-spin"})
					)
				)
			)
		);
	}
});