var fun = [
	{"href":"search.html","icon":"am-icon-search","text":"模糊查询"},
	{"href":"combox.html","icon":"am-icon-search-plus","text":"组合查询"},
	{"href":"option.html","icon":"am-icon-wrench","text":"设置"}
];
var default_info = React.createElement("div", {id: "result"}, React.createElement("p", {class: "p_top"}, "搜索关键字提示"), React.createElement("p", null, "邮轮公司（如：歌诗达）"), React.createElement("p", null, "船名（如：维多利亚）"), React.createElement("p", null, "途径港口（如：福冈）"));
var load = React.createElement("ul", {id: "ajax_list", className: "am-list"}, React.createElement("li", null, "数据查询中... ", React.createElement("i", {className: "am-icon-spinner am-icon-pulse"})));

/*
 * 底部菜单栏组件
 * */
var R_footer = React.createClass({displayName: "R_footer",
	render:function(){
		return(
			React.createElement("footer", null, 
				React.createElement("hr", null), 
				React.createElement("p", {className: "am-padding-left"}, "© 2016 建定通微信管理系统."), 
				React.createElement("div", {className: "am-alert am-alert-danger none errorinfo", "data-am-alert": true}), 
				React.createElement("div", {className: "am-alert am-alert-success none successinfo", "data-am-alert": true}), 
				React.createElement("div", {className: "am-alert am-alert-warning none loadinfo", "data-am-alert": true})
			)
		);
	}
});
/*
 * 顶部标题栏组件
 * */
var R_header = React.createClass({displayName: "R_header",
	componentDidMount:function(){
		$('#cname').html(window.sessionStorage.getItem('cname')+"（"+window.sessionStorage.getItem('crole')+"）");
	},
	exit:function(e){
		e.preventDefault();
		window.sessionStorage.removeItem("cname");
		window.sessionStorage.removeItem('cid');
		window.sessionStorage.removeItem("crole");
		window.location = 'login.html';
	},
	render:function(){
		return(
			React.createElement("header", {className: "am-topbar admin-header"}, 
			  React.createElement("div", {className: "am-topbar-brand"}, 
			    React.createElement("strong", null, "荟邮云"), " ", React.createElement("small", null, "内部管理系统")
			  ), 
			
			  React.createElement("button", {className: "am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-success am-show-sm-only", "data-am-collapse": "{target: '#topbar-collapse'}"}, React.createElement("span", {className: "am-sr-only"}, "导航切换"), " ", React.createElement("span", {className: "am-icon-bars"})), 
			
			  React.createElement("div", {className: "am-collapse am-topbar-collapse", id: "topbar-collapse"}, 
			
			    React.createElement("ul", {className: "am-nav am-nav-pills am-topbar-nav am-topbar-right admin-header-list"}, 
			      React.createElement("li", null, React.createElement("a", {href: "javascript:;"}, React.createElement("span", {className: "am-icon-user"}), " 当前用户：", React.createElement("span", {id: "cname"}), " ")), 
			      React.createElement("li", null, React.createElement("a", {onClick: this.exit, href: "#"}, React.createElement("span", {className: "am-icon-power-off"}), " 退出"))
			    )
			  )
			)
		);
	}
});
/*
 * 左侧导航组件
 * */
var R_sidebar = React.createClass({displayName: "R_sidebar",
	componentDidMount:function(){
		var role = window.sessionStorage.getItem('crole');
		if(role == "业务员"){
			$('.admin-sidebar-list').find('li').eq(1).addClass('none');
		}
	},
	render:function(){
		return(
			React.createElement("div", {className: "admin-sidebar am-offcanvas", id: "admin-offcanvas"}, 
			    React.createElement("div", {className: "am-offcanvas-bar admin-offcanvas-bar"}, 
			      React.createElement("ul", {className: "am-list admin-sidebar-list"}, 
			       	React.createElement("li", null, React.createElement("a", {href: "index.html"}, React.createElement("span", {className: "am-icon-table"}), " 销售订单")), 
					React.createElement("li", null, React.createElement("a", {href: "user.html"}, React.createElement("span", {className: "am-icon-user"}), " 用户管理"))
			      ), 
			      React.createElement("div", {className: "fix_bottom"})
			    )
			)
		);
	}
});
/*
 * 内容组件
 * */
var R_main = React.createClass({displayName: "R_main",
	render:function(){
		return(
			React.createElement("div", {className: "am-cf admin-main"}, 
				this.props.children
			)
		);
	}
});
/*
 * 移动端菜单组件
 * */
var R_menu = React.createClass({displayName: "R_menu",
	render:function(){
		return(
			React.createElement("a", {href: "#", className: "am-icon-btn am-icon-th-list am-show-sm-only admin-menu", "data-am-offcanvas": "{target: '#admin-offcanvas'}"})
		);
	}
});
/*
 * 返回顶部组件
 * */
var R_totop = React.createClass({displayName: "R_totop",
	render:function(){
		return(
			React.createElement("div", {"data-am-widget": "gotop", className: "am-gotop am-gotop-fixed"}, 
				React.createElement("a", {href: "#top", title: "回到顶部"}, 
					React.createElement("span", {className: "am-gotop-title"}, "回到顶部"), 
					React.createElement("i", {className: "am-gotop-icon am-icon-chevron-up"})
				)
			)
		);
	}
});
/*
 * 查询输入框组件
 * */
var R_Input = React.createClass({displayName: "R_Input",
	getInitialState: function() { 
		return {close:""};
	},
	searchKey:function(){
		var key = this.refs.key.getDOMNode().value.trim();
		if(!key || key.indexOf("'")!=-1){
			this.props.onsearchKey([]);
			this.setState({close:""});
			return;
		}
		this.setState({close:React.createElement("i", {className: "am-icon-close close", onclick: this.close})});
		//this.props.onsearchKey(load);
		$.ajax({
			type: "POST",
			url: "/service/SearchByKey",
			data: {
				key: key,
				option_2: window.localStorage.getItem('option_2')
			},
			success: function(data) {
				this.props.onsearchKey(data);
			}.bind(this)
		});
	},
	render:function(){
		return(
			React.createElement("div", {className: "fixed"}, 
				React.createElement("div", {className: "am-form-icon"}, 
					React.createElement("i", {className: "am-icon-search"}), 
					React.createElement("input", {type: "text", className: "am-form-field", ref: "key", onInput: this.searchKey, placeholder: "邮轮公司/船名/途径港口"}), 
					this.state.close
				)
			)
		);
	}
});
/*
 * 查询结果组件
 * */
var R_Result = React.createClass({displayName: "R_Result",
	showDetail:function(url){
		window.open(url);
	},
	render:function(){
		var o = this;
		var list = this.props.date.map(function(c){
		return(
				React.createElement("li", {onClick: o.showDetail(c.txtUrl)}, 
					React.createElement("h1", null, React.createElement("span", {className: "am-badge am-badge-success am-radius "}, c.txtSource), c.title), 
					React.createElement("span", {className: "price am-badge am-badge-warning am-radius "}, c.numPrice)
				)
			);
		});
		return(
			React.createElement("div", {id: "result"}, 
				React.createElement("ul", {className: "am-list"}, 
					list
				)
			)
		);
	}
});
/*
 * 查询组件
 * */
var R_Search = React.createClass({displayName: "R_Search",
	getInitialState: function() { 
		return {res: []};
	},
	handlesearch:function(c){
		this.setState({res: c}); 
	},
	render:function(){
		return(
			
			React.createElement("form", {action: "", className: "am-form am-form-inline"}, 
				React.createElement(R_Input, {onsearchKey: this.handlesearch}), 
				React.createElement(R_Result, {date: this.state.res})
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
			React.createElement("div", {className: "am-modal am-modal-loading am-modal-no-btn", tabindex: "-1", id: "my-modal-loading"}, 
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
