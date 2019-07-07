1、what: 这是一个基于jquery开发的网格组件插件
2、when: 点击head头部可排序数据，表头可拖拽，行可选择，数据可分页
3、where: 数据后台系统
4、how:
		4.0、鼠标左键点击表头可排序，鼠标右键点击表头可拖拽
    4.1、html
        4.1.1、在header里面引入css/index.min.css
    4.3、js
        4.3.1、先引入jquery.js，再引入js/index.min.js				
        4.3.2、直接调用：
           	$("#grid").grid({
           		// 头部数据,里面每个对象必须传name，name值匹配的是data里面每个对象的属性名称
							header: [
								{
									text: "Order ID", // 头部文本
									name: "orderId", // 用来关联data中的对象属性名
									width: 100, // 如果有宽度，则使用用户自定义的宽度
									isOrder: true  // 是否启用排序
								},
								{
									text: "Customer ID",
									name: "customerId",
									isOrder: true,
									width: 130
								},
								{
									text: "Order Date",
									name: "orderDate",
									isOrder: true,
									width: 200
								},
								{
									text: "Freight",
									name: "freight",
									isOrder: true,
									width: 130
								},
								{
									text: "Ship Name",
									name: "shipName",
									isOrder: false,
									width: 130
								}
							],
							// 显示数据，注意：需要排序的字段，目前只设置了数字类型和字符串类型的排序，字段值类型要设置好
							// 这里的数据只是作为实例展示，实际数据需要ajax请求，如果没有配置服务器环境，请使用firefox浏览器
							// 这个key不需要传，框架内部已定义，只需要配置后面的ajax即可
							pagination: {
								"page": 1, // 页码
								"pageCount": 0, // 一页显示数据数
								"totalPage": 1, // 总页数
								"totalCount": 0, // 总数据数
								"data": data: [
																{
																	orderId: 1,
																	customerId: 1,
																	orderDate: "2012-09-03 00:00:00",
																	freight: 32.3800,
																	shipName: "afsasfd"
																},
																{
																	orderId: 2,
																	customerId: 2,
																	orderDate: "2012-11-03 00:00:00",
																	freight: 31.3800,
																	shipName: "司法官"
																},
																{
																	orderId: 3,
																	customerId: 3,
																	orderDate: "2010-12-03 00:00:00",
																	freight: 33.3800,
																	shipName: "使得ert法国"
																},
																{
																	orderId: 4,
																	customerId: 4,
																	orderDate: "2012-12-03 00:00:00",
																	freight: 35.3800,
																	shipName: "hgf使得法国"
																},
																{
																	orderId: 5,
																	customerId: 5,
																	orderDate: "2013-12-03 00:00:00",
																	freight: 34.3800,
																	shipName: "afds使得法国"
																} // 数据
															],
							}
							// 排序规则信息
							order: {
								name: "freight", // 与头部中的name相匹配，排序列名字
								type: "desc" // 排序类型，有两种类型（升序("asc")和倒叙("desc")）
							},
							// ajax请求数据，内部信息: type: "GET"，下面为可传配置
							ajaxConfig: {
								url: "gridData.json",
								data: "page=1&pageCount=2",
								dataType: "json" // 默认
							}
						});