maniftest 文件内容解析:
// 插件版本信息，必须要写，值必须为2
"manifest_version": 3,
//插件名字
"name"：""
//插件版本
"version":""
// 插件图标
 "icons":{
        "16": "images/1.png",
		"48": "images/1.png",
		"128": "images/1.png"
    },
//常驻后台的js
    "background": {
        // 如果指定JS，会自动生成一个选项卡 ,如果在action中设置了default_popup 就不会使用默认选项卡
        "service_worker": "background.js"
    },
// 浏览器右上角图标设置，browser_action、page_action、app必须三选一
// Action图标只会在特定网站执行，可以在background.js中使用 PageStateMatcher 去定义规则 ，而ICON会在所有情况下执行
    "action": {
        //悬停时插件名字
        "default_title": "Click to show an alert",
        //图标
        "default_icon": "images/3.png",
        //悬停时插件页面
		"default_popup": "popup.html"
    },
# content_scripts
## content-scripts 直接注入网页的资源，注意这里注入的资源是打开网页就会执行的
## 原始页面共享DOM树，但是不共享JS，如要访问页面JS（例如某个JS变量），只能通过injected js
"content_scripts": [
        {
            //"<all_urls>" 表示匹配所有地址;匹配成功的页面才会注入js
            "matches": [
                "https://www.baidu.com/*","http://www.baidu.com/*"
            ],
            "css": [
                "contentCss/mystyles.css"
            ],
            "js":["content.js"],
            // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
            //document_start 时更改页面按钮的东西不会执行
			"run_at": "document_start"
        }
    ]
	// 权限申请
	"permissions":
	[
		"contextMenus", // 右键菜单
		"tabs", // 标签
		"notifications", // 通知
		"webRequest", // web请求
		"storage", // 插件本地存储
        "activeTab",
        "scripting",
        "declarativeContent",
        "contextMenus"  //右键菜单，可以在background.js设置
	],
    //网络权限设置单独放到下面，符合的网页才能执行插件
	//	"http://*/*", // 可以通过executeScript或者insertCSS访问的网站
	//	"https://*/*" // 可以通过executeScript或者insertCSS访问的网站
    "host_permissions": [
        "https://www.baidu.com/*" ,"http://www.baidu.com/*" 
      ],
    
    //网页想访问的插件资源都需要放在这个key下面
    "web_accessible_resources": [{
        "resources": [ "images/*.png","htmls/*","bkjs/*","contentCss/*" ],
        //一样，可以设置起作用的网页
         "matches": ["https://www.baidu.com/*" ,"http://www.baidu.com/*"]
      }],


	// 插件主页，这个很重要，不要浪费了这个免费广告位，还没理解怎么起作用，感觉和pop冲突
	"homepage_url": "https://www.baidu.com",


    	// 插件配置页写法,插件右击，然后点击选项，触发的页面,打开整个页面
        "options_page": "options.html",
        // 插件配置页写法,插件右击，然后点击选项，触发的页面，触发弹窗一样的页面
"options_ui":
	{
		"page": "options.html"
	},
    // 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字， 浏览器输入 go 空格，加搜索内容，就会访问插件bkground中的监听逻辑
	"omnibox": { "keyword" : "go" },

    // devtools页面入口，注意只能指向一个HTML文件，不能是JS文件,F12会多一个调试器
	"devtools_page": "devtools.html"

//快捷键
    "commands": {
        "run-foo": {
          "suggested_key": {
            "default": "Ctrl+Shift+Y",
            "mac": "Command+Shift+Y"
          },
          "description": "Run \"foo\" on the current page."
        }
    },
# chrome_url_overrides
## 用于改变，新开标签的默认页面
    "chrome_url_overrides":
	{
		"newtab": "htmls/over.html"
	},
# omnibox
	"omnibox": { "keyword" : "go" },
## 浏览器输入关键字，启动控件逻辑 ,background js中使用 chrome.omnibox.onInputEntered.addListener监听
chrome.omnibox.onInputEntered.addListener((text) => {
  // Encode user input for special characters , / ? : @ & = + $ #
  var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
  chrome.tabs.create({ url: newURL });
});
