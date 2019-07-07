1、what: 这是一个基于jquery开发的 单选按钮插件
2、when: 开关按钮
3、where: 性别等单选开关操作
4、how:
    4.1、html
        4.1.1、在header里面引入jqueryRadioBtn.css
    4.3、js
        4.3.1、先引入jquery.js，再引入jqueryRadioBtn.js
        4.3.2、直接调用：
           	$("button.btnSwitch").jqueryRadioBtn({
							isOpen: true // 开关状态(true | false) 默认值true
						});