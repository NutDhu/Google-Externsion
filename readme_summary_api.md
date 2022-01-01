API:
chrome.contextMenus

1:先看权限
Permissions：contextMenus
表示在manifest 中Permissions需要加上contextMenus

2：在看方法
Methods：
create
remove
removeAll
update

3：点击方法查看详情
chrome.contextMenus.create(
  createProperties: object, //第一个参数是object，所以需要用{}表示一个object
  callback?: function,      // ?：表示第二个参数是可选的参数
)

3.1: 接下来，可以看看参数包含哪些东西 createProperties
checked
boolean optional

contexts
[ContextType, ...ContextType[]] optional

documentUrlPatterns
string[] optional

....
可以看到，包含很多东西，有的属性有optional说明是可选参数。又由于createProperties是可选的，所以可以写成{}：

 { "id": "main", "visible": true, "title": "main"，"checked":值（true） },

 下面是对每个参数的熟悉


4：学习事件 event
chrome.contextMenus.onClicked.addListener(
  callback: function,
)
可以看到内部有一个回调函数：查看回调函数的说明：
(info: OnClickData, tab?: tabs.Tab) => void
匿名函数：（info,tab）=>{},info必填参数，tab ?:可选参数

查看 info说明：
OnClickData：点击查看OnClickData的说明：

checked
boolean optional

editable
boolean

.etc

例如：

//执行效果可以在work service中的console中看到
chrome.contextMenus.onClicked.addListener((info)=>{
  console.log(info.menuItemId)
}






