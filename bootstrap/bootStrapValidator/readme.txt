1、what: 这是一个基于bootstrap插件开发的表单验证插件
2、when: 表单需要验证时使用
3、where: 登录、注册之类的表单验证
4、how:
    4.1、html
        4.1.1、在header里面引入bootstrap.css
        4.1.2、
            <form class="form-horizontal registerOrLogin" id="formRegister">
                  <!--用户名 S-->
                  <div class="form-group">
                      <div class="input-group">
                          <div class="input-group-addon">
														<span class="glyphicon glyphicon-user"></span>
													</div>
													<input  type="text" class="form-control" 
                            id="username" name="loginParam.userNameOrEmailOrPhone" placeholder="用户名">
                      </div>
                  </div>
                  <!--用户名 E-->
            </form>

            解析：使用form标签作为父元素，内部的表单元素必须包裹在 css类名为 form-group 中，表单元素类名必须含有 form-control
    4.2、js
        4.2.1、bootstrap是基于jQuery开发的，所以先引入jquery.js，再引入bootStrapValidator.js
        4.2.2、首先为需要验证的表单元素配置规则：（规则验证顺序即书写顺序）						
            $("#username").data("bv", {
                "require": {
                    "val" : true, // 规则
                    "msg" : "用户名必须填写" // 错误提示信息
                },
                "regex": {
                    "val" : "^\w+$",
                    "msg" : "用户应该是由字母数字下划线所组成"
                },
                "betweenlength": {
                    "val" : "6-12",
                    "msg" : "用户名长度必须是在6-12位字符之间"
                }
            });

            解析：通过设置一个 名必须为 "bv" 的数据名，
                内部数据必须是一个对象（如果不是对象，不管为什么值，都验证失败，如果是一个空对象，则默认验证成功），
                在对象中配置规则，把规则数据缓存到该表单元素中；
                这里只需执行一次即可，建议使用立即执行函数，
                * 规则默认是升序验证，用户可自定义规则验证的优先级

            注意：插件内部只提供了以下的验证规则，如果满足不了您的需求，请使用4.2.4扩展您的自定义规则或覆盖插件已实现的规则
                require // 当前值不为空
                regexp // 指定正则验证当前值
                length // 指定长度验证当前值长度
                minlength // 当前值长度是否大于指定长度
                maxlength // 当前值长度是否小于指定长度
                betweenlength // 前值长度是否位于指定两个长度之间，两个长度用 - 连接
                number // 当前值是否为数字类型
                integer // 当前值是否为整数
                equalto // 当前值是否与指定选择器值相等
                lessthan // 当前值是否小于指定值
                greaterthan // 当前值是否大于指定值
                middle // 当前值是否位于指定两个值之间，两个值用 - 连接
                url // 当前值是否为 url
                phone // 当前值是否为 固话
                mobile // 当前值是否为 用户名
                email // 当前值是否为 email
                amount // 当前值是否为 金额
                date // 当前值是否为日期格式
                    （验证日期格式为 YYYY-MM-DD | YYYY/MM/DD）
                datetime // 当前值是否为日期时间格式
                    （验证日期时间格式为 YYYY-MM-DD hh:mm:ss | YYYY/MM/DD hh:mm:ss）

        4.2.3、调用元素必须是form元素，调用方式为：
            注意：如果要传递options参数，必须传一个对象，否则插件内部会自动把该参数置为空对象
                options用于传递用户配置，如果不传options，则使用插件内部默认配置，
                只有传递与默认值同名属性才有效，其它属性名不做处理。

            默认配置为：
							{
								triggerEvent : "blur", // 触发事件类型
								errorMessage : "You entered a wrong" // 默认错误提示消息
							}

            $(form).bootStrapValidator(options)
                    .on("error", function(e, msg){
                        console.log("错误事件处理");
                    })
                    .on("success", function(e, msg){
                        console.log("成功事件处理");
                    })
            ;

        4.2.4、还提供了一个可扩展验证规则的方法
            4.2.4.1、what: $.fn.bambooBootStrapValidator.extendRules
            4.2.4.2、how:
                注意：
                    1、如果要传递参数，必须传一个对象，否则插件内部会自动把该参数置为空对象
                    2、规则参数名请必须按照下面的规则定义，
                        第一个参数为表单元素去掉前后空格的值，
                        第二个参数为验证规则（如果不用，则不需要定义或传递；为了格式统一性，强烈建议定义该参数）

                $.fn.bambooBootStrapValidator.extendRules({
                    //只有银行系统才会有这样的验证规则
                    //必须是小数，正数，1-24之间的两位小数
                    rate : function(originalVal, ruleVal){
                        return /^([\d]+)(\.[\d]{1,2})?$/.test(originalVal) && (Number(originalVal)<=24);
                    }
                });
        4.2.5、注意：有的时候，当输入值时，则按照规则验证，
                             当值为空时（可能作为筛选条件），则视为通过，
                                这个时候传入对象参数中需要传入一个属性名为 nullValueSuccess，可以是任意值
                                首先验证：当传入对象参数中有nullValueSuccess属性名 并且 原始值为 空时，视为通过，
                                    不再对其它规则做验证操作