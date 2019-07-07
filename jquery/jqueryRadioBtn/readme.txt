1、what: 这是一个基于jquery开发的 单选按钮插件
2、when: 开关按钮
3、where: 性别等单选开关操作
4、how:
    4.1、html
        4.1.1、在header里面引入jqueryRadioBtn目录下的 css/index.min.css
    4.3、js
        4.3.1、先引入jquery.js，再引入jqueryRadioBtn目录下的 js/index.min.js
        4.3.2、直接调用：
            // 注意：调用元素必须是一个 button 元素
           	$(".btnSwitch").jqueryRadioBtn({
                isOpen: true // 开关状态(true | false) 默认值true
            });

5、demo
    进入demo 目录下 的 index.html 查看如何使用