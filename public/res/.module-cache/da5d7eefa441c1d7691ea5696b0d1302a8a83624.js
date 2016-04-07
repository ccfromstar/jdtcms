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
				$("")
				$modal.modal('close');
			}
		});
	},
	render:function(){
		return(
			React.createElement("div", {className: "am-g am-g-fixed blog-g-fixed"}, 
				React.createElement("div", {className: "am-u-md-12"}, 
					React.createElement("article", {className: "post-main"}, 
						React.createElement("h3", {id: "title", className: "am-article-title blog-title"}), 
						React.createElement("h4", {className: "am-article-meta blog-meta"}, "by ", React.createElement("a", {href: ""}, "陈叔叔"), " posted on 2016-04-07"), 
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