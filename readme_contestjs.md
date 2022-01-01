content-scripts和原始页面共享DOM，但是不共享JS
如要访问页面JS（例如某个JS变量），只能通过injected js来实现。content-scripts不能访问绝大部分chrome.xxx.api，除了下面这4种：
chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
chrome.i18n
chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
chrome.storage


//感觉俩者现在已经结合
在content-script中通过DOM方式向页面注入inject-script代码示例：
这里的injected-script是我给它取的，指的是通过DOM操作的方式向页面注入的一种JS。为什么要把这种JS单独拿出来讨论呢？又或者说为什么需要通过这种方式注入JS呢？
这是因为content-script有一个很大的“缺陷”，也就是无法访问页面中的JS，虽然它可以操作DOM，但是DOM却不能调用它，也就是无法在DOM中通过绑定事件的方式调用content-script中的代码（包括直接写onclick和addEventListener2种方式都不行），但是，“在页面上添加一个按钮并调用插件的扩展API”是一个很常见的需求，那该怎么办呢？其实这就是本小节要讲的。

在content-script中通过DOM方式向页面注入inject-script代码示例：
至于inject-script如何调用content-script中的代码，后面我会在专门的一个消息通信章节详细介绍。

不过需要注意的是，如果想在网页访问调用该js，需要在
web_accessible_resources解决跨域问题
