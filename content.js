//加在manifest中 content_scripts的 js 和 css 是用来在某个网页扩展的功能，在打开满足运行规则的网页时就会执行

// 如要访问页面JS（例如某个JS变量），只能通过injected js来实现。content-scripts不能访问绝大部分chrome.xxx.api，除了下面这4种：
// chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
// chrome.i18n
// chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
// chrome.storage

// content.js
let button = document.createElement("a");
button.innerText = "啥玩意";
button.setAttribute("id","imagebutton");
button.setAttribute("target","_blank");
button.setAttribute("class","mnav c-font-normal c-color-t");
button.addEventListener("click",handleImageLoad);
document.querySelector(".s-top-left-new").append(button);
var iframeURL = chrome.runtime.getURL('htmls/buttonHtml.html');
// console.log(document.querySelector("#head_wrapper .soutu-env-mac #kw, #head_wrapper .soutu-env-nomac #kw ").innerText);

function handleImageLoad(){
    let element = document.getElementById("imagebutton");
    element.src = chrome.runtime.getURL(`images/1.png`);
    button.setAttribute("href",iframeURL);
}

chrome.runtime.sendMessage({greeting: '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
	console.log('收到来自后台的回复：' + response);
});
// alert("hello world")