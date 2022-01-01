    "action": {
        "default_title": "Click to show an alert",
        "default_icon": "images/3.png",
		"default_popup": "htmls/popup.html"
    },
需要特别注意的是，由于单击图标打开popup，焦点离开又立即关闭，所以popup页面的生命周期一般很短，需要长时间运行的代码千万不要写在popup里面。

在权限上，它和background非常类似，它们之间最大的不同是生命周期的不同，popup中可以直接通过chrome.extension.getBackgroundPage()获取background的window对象。