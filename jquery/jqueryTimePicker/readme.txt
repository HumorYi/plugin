1、what: 这是一个基于jquery开发的时间插件
2、when: 需要时间控件时
3、where: 时钟
4、how:
    4.1、html
        4.1.1、在header里面引入jqueryTimePicker.css
    4.3、js
        4.3.1、先引入jquery.js，再引入jqueryTimePicker.js
        4.3.2、直接调用：
            $(".timePicker").timePicker({
							placeholder: "choice time", //时间文本框提示 默认值为 请选择时间
							times: "13:34:54" //时间文本框时间 默认值为 当前系统时间
						});