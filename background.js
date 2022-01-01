//background中可以定义插件的图标，选项卡，以及运行规则等等

// chrome.runtime.id：获取插件id
// chrome.runtime.getURL('xxx.html')：获取xxx.html在插件中的地址

// 后台（姑且这么翻译吧），是一个常驻的页面，
// 它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭，
// 所以通常把需要一直运行的、启动就运行的、全局的代码放在background里面。

// Declare a rule to enable the action on example.com pages
let exampleRule = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: 'www.baidu.com', schemes: ['https'] },
      css: ["input[type='submit']"]
    }),
    new chrome.declarativeContent.PageStateMatcher({
      css: ["img[src='ab1xz.jpg']"],
    })
  ],
  actions: [new chrome.declarativeContent.ShowAction()],
};

chrome.runtime.onInstalled.addListener(() => {

  // Page actions are disabled by default and enabled on select tabs
  chrome.action.disable();

  // Clear all rules to ensure only our expected rules are set
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {

    // Finally, apply our new array of rules
    let rules = [exampleRule];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

//background中执行的action.onclick是点击插件时才会执行的js文件
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['bkjs/init.js']
  });
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('收到来自content-script的消息：');
  console.log(request, sender, sendResponse);
  sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));


});







//设置图标，也可以在manifest中设置 (失效，可以看官网对3的api)
//chrome.browserAction.setIcon("images/1.png");
//chrome.browserAction.setBadgeText({text: 'new'});
//chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});



//设置右键菜单，继续看API应该弃用了 https://developer.chrome.com/extensions/contextMenus
///onClicked click 监听
//对于按钮事件的点击，我们如果希望能够收到消息，这个时候就需要使用 chrome.contextMenus.onClicked.addEventListener((iknfo) => {}) 去监听，每次点击之后都会发过消息来。
const menu = {
  "menus": [
    { "id": "main", "visible": true, "title": "main" },
    { "id": "sub1", "visible": true, "title": "sub1", "parentId": "main" },
    { "id": "sub11", "visible": true, "title": "sub11", "parentId": "sub1" },
    { "id": "sub12", "visible": true, "title": "抖音", "parentId": "sub1" },
    { "id": "sub2", "visible": true, "title": "百度", "parentId": "main" },
    //documentUrlPatterns 匹配成功的网站才会显示选项
    { "id": "sub3", "visible": true, "title": "sub3", "parentId": "main", "documentUrlPatterns": ["http://www.zhihu.com/*", "https://www.zhihu.com/*"] },
    { "id": "llw1", "visible": true, "checked": true, "type": "checkbox", "title": "llw1", "parentId": "main" },
    { "id": "llw2", "visible": true, "checked": true, "type": "checkbox", "title": "llw2", "parentId": "main" },
    // contexts只在选定的格式上显示选项
    { "id": "llw3", "visible": true, "contexts": ["image", "selection", "link", "editable", "page"], "title": "llw3", "parentId": "main" },
    { "id": "llw4", "visible": true, "title": "llw4", "parentId": "main", "type": "radio" },
    { "id": "llw5", "visible": true, "title": "llw5", "parentId": "main", "type": "radio" },
    { "id": "llw6", "visible": true, "title": "llw6", "parentId": "main", "type": "separator" },//separator 这是一个分割线，不是选项 
  ]
};


const createMenu = () => {
  menu.menus.forEach(value => {
    chrome.contextMenus.create(value);
  })
};
createMenu();

// 获取网站cookie

//执行效果可以在work service中的console中看到
chrome.contextMenus.onClicked.addListener((info) => {
  console.log(info.menuItemId)
  if (info.menuItemId == 'sub2') {
    info.pageUrl = "https://www.baidu.com/";
    //打开新的标签页
    chrome.tabs.create(
      {
        "url": info.pageUrl
      }
    );
  } else if (info.menuItemId == 'llw5') {
    const url = 'https://www.zhihu.com';
    chrome.cookies.getAll({ url }, cookies => {
      console.log(cookies);
    });
  } else if (info.menuItemId == "sub12") {
    const url = 'https://www.douyin.com';
    chrome.cookies.getAll({ url }, cookies => {
      console.log(cookies);
    });
  }

  // ,
}
)

// 右键添加百度搜索
// chrome.contextMenus.create({
// 	title: '使用度娘搜索：%s', // %s表示选中的文字
// 	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
// 	onclick: function(params)
// 	{
// 		// 注意不能使用location.href，因为location是属于background的window对象
// 		chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
// 	}
// });

// omnibox 演示
chrome.omnibox.onInputEntered.addListener((text) => {
  // Encode user input for special characters , / ? : @ & = + $ #
  var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
  chrome.tabs.create({ url: newURL });
});

chrome.omnibox.onInputChanged.addListener(
  (text, suggest) => {
    if (!text) return;
    if (text == '美女') {
      suggest([
        { content: '中国' + text, description: '你要找“中国美女”吗？' },
        { content: '日本' + text, description: '你要找“日本美女”吗？' },
        { content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？' },
        { content: '韩国' + text, description: '你要找“韩国美女”吗？' }
      ])
    }
  }
)
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});

// chrome.omnibox.onInputChanged.addListener((text, suggest) => {
// 	console.log('inputChanged: ' + text);
// 	if(!text) return;
// 	if(text == '美女') {
// 		suggest([
// 			{content: '中国' + text, description: '你要找“中国美女”吗？'},
// 			{content: '日本' + text, description: '你要找“日本美女”吗？'},
// 			{content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？'},
// 			{content: '韩国' + text, description: '你要找“韩国美女”吗？'}
// 		]);
// 	}
// 	else if(text == '微博') {
// 		suggest([
// 			{content: '新浪' + text, description: '新浪' + text},
// 			{content: '腾讯' + text, description: '腾讯' + text},
// 			{content: '搜狐' + text, description: '搜索' + text},
// 		]);
// 	}
// 	else {
// 		suggest([
// 			{content: '百度搜索 ' + text, description: '百度搜索 ' + text},
// 			{content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text},
// 		]);
// 	}
// });

// // 当用户接收关键字建议时触发
// chrome.omnibox.onInputEntered.addListener((text) => {
// 	console.log('inputEntered: ' + text);
// 	if(!text) return;
// 	var href = '';
// 	if(text.endsWith('美女')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
// 	else if(text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
// 	else if(text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
// 	else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
// 	openUrlCurrentTab(href);
// });
// // 获取当前选项卡ID
// function getCurrentTabId(callback)
// {
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
// 	{
// 		if(callback) callback(tabs.length ? tabs[0].id: null);
// 	});
// }

// // 当前标签打开某个链接
// function openUrlCurrentTab(url)
// {
// 	getCurrentTabId(tabId => {
// 		chrome.tabs.update(tabId, {url: url});
// 	})
// }



//不会用，桌面提醒
// chrome.notifications.create(null, {
// 	type: 'basic',
// 	iconUrl: 'img/icon.png',
// 	title: '这是标题',
// 	message: '您刚才点击了自定义右键菜单！'
// });