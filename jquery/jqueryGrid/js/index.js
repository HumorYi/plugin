(function(root, factory, plug){
	factory(root.jQuery, plug);
})(window, function($, plug){
	var __DEFAULTS__ = {
		header: [],
		order: {},
		ajaxConfig: {},
	};

	var __PRIVATE__ = {
		//排序：需要传一个配置对象过来，对象中数据为：{data, type, name}
		_sort: function(opts) {
			var data = opts.data;
			var name = opts.name;

			// 默认排序为降序
			var dir_num = opts.type === "asc" ? 1 : -1;

			// 数字类型排序
			if (typeof (data[0][name]) === "number") {
				return data.sort(function(obj1, obj2){
					return dir_num * (obj1[name] - obj2[name]);
				});
			}

			// 字符串类型本地比较
			return data.sort (function(obj1, obj2){
				return dir_num * obj1[name].localeCompare(obj2[name]);
			});
		},
		// 格式化数字
		_formatNumber: function (num) {
      var strNum = String(num),
      	strNumlen = strNum.length;
      ;

			return strNum.replace(/\d{3}/g, function($, index){
				return $ + (strNumlen - index >3 ? "," : "");
			});
		},
	};

	var __PROTO__ = {
		_init: function() {
			return this._render()._handle();
		},
		// 渲染Dom
		_render: function () {
			var cols = "";
			var order_type = this.order.type || "";
			var order_name = this.order.name || "";

			$.each(this.header, function(header_index, header_obj){
				var name = header_obj.name || "";
				var isOrder = header_obj.isOrder || false;
				var width = header_obj.width;
				var orderIcon = "";
				var isAsc = false;
				var isDesc = false;

				if (isOrder) {
					if (order_name === name) {
						if (order_type === "asc") {
							isAsc = true;
						}
						else if (order_type === "desc") {
							isDesc = true;
						}
					}

					orderIcon = '<i class="_asc'+(isAsc ? " _active" : "")+'"></i>'
										+'<i class="_desc'+(isDesc ? " _active" : "")+'"></i>'
					;
				}

				cols += '<div class="_col" name="'+name+'" is_order="'+isOrder+'" col_index="'+header_index+'" style="'+(width ? "width="(width+"px") : "")+'">'
								+'<div class="_header">'
									+'<h6>'+(header_obj.text||"")+'</h6>'
									+ orderIcon
								+'</div>'
								+'<ul></ul>'
							+'</div>';

				isDesc = null;
				isAsc = null;
				orderIcon = null;
				isOrder = null;
				name = null;
			});

			var grid = '<div class="_data" order_type="'+order_type+'" order_name="'+order_name+'"z>'+cols+'</div>'
							  +'<div class="_toolbar">'
								  +'<div class="_tool">'					  	
									  +'<div class="_dir _left">'
									  	+'<div class="_prev">'
										  	+'<i></i>'
									  	+'</div>'
									  	+'<div class="_backward">'
										  	+'<i></i>'
										  	+'<i></i>'
									  	+'</div>'
									  +'</div>'
									  +'<div class="_page">'
									  		+'Page <input type="text" class="_content">'
									  		+' of <span class="_totalPage"></span>'
									  +'</div>'					  	
									  +'<div class="_dir _right">'
									  	+'<div class="_next">'
										  	+'<i></i>'
									  	+'</div>'
									  	+'<div class="_forward">'
										  	+'<i></i>'
										  	+'<i></i>'
									  	+'</div>'
									  +'</div>'
								  +'</div>'
								  +'<div class="_view">'
								  	+' View <span class="_count"></span>'
								  	+' of <span class="_totalCount"></span>'
								  +'</div>'
							  +'</div>'
							  +'<div class="_loading">'
							  	+'<span class="_left"></span>'
							  	+'<span class="_right"></span>'
							  +'</div>'
			;
			
			this.$data = this.addClass("_grid").html(grid).find(">._data");
			this.$toolbar = this.find(">._toolbar");
			this.$loading = this.find(">._loading");
			this.dragging = false;//这个状态用来标示当前表格是不是正在拖拽表头

			grid = null;
			isOpen = null;
			order_type = null;
			order_name = null;
			cols = null;

			return this._ajax(this.ajaxConfig);
		},
		// 添加行数据
		_appendRow: function () {
			var _this = this;

			$.each(_this.header, function(header_index, header_obj){
				var name = header_obj.name || "";
				var dataItems = "";
				$.each(_this.pagination.data, function (data_index, data_obj) {
					dataItems += "<li class='"+(data_obj.active ? "_active" : "")+"' row_index='"+data_index+"'>"+(data_obj[name]||"")+"</li>";		
				});

				_this.$data.find(">._col[name="+name+"] >ul").html(dataItems);

				dataItems = null;
				name = null;
			});
		},
		// 事件处理
		_handle: function () {
			var _this = this,
					$data = this.$data,
					$ul = $data.find(">._col >ul"),
					$headers = $data.find(">._col >._header")
			;

			// 数据项事件
			$ul.on("mouseover", ">li", function(e) {
				if(_this.dragging) { return; }

				$ul.find(">li[row_index="+$(this).index()+"]").addClass("_hover");
			})
			.on("mouseout", ">li", function(e){
				if(_this.dragging) { return; }

				$ul.find(">li[row_index="+$(this).index()+"]").removeClass("_hover");
			})
			.on("click", ">li", function(e) {
				if(_this.dragging) { return; }

				var index = $(this).index();
				_this.pagination.data[index].active = $ul.find(">li[row_index="+index+"]").toggleClass("_active").hasClass("_active");
			});


			// 鼠标右键点击头部拖拽事件
			$headers.on("contextmenu", function(e) {
				e.preventDefault();
			})
			.on("mousedown", function (e) {
				// 只允许鼠标右键点击
				if(!(e.buttons === 2)) return;

				// 左键点击排序
				var $col = $(this).parent().addClass("_drag");
				var offsetX = -10;
				var offsetY = -10;
				_this.dragging = true;
				_this.darggingTargetCol = $col[0];

				$col.css({left:e.clientX-offsetX+"px", top:e.clientY-offsetY+"px"});
				_this.$toolbar.find(">._tool").css("marginLeft", -$col.width()/2+"px");

				$(document).on("mousemove", function (e) {
					$col.css({left:e.clientX-offsetX+"px", top:e.clientY-offsetY+"px"});
				}).on("mouseup", function (e) {
					if (_this.draggingInTragetCol) {
						var header = _this.draggingInTragetCol.find(">._header");
						if (header.hasClass("_dragInLeft")) {
							_this.draggingInTragetCol.before(_this.darggingTargetCol);
						}
						else if (header.hasClass("_dragInRight")){
							_this.draggingInTragetCol.after(_this.darggingTargetCol);	
						}
					}

					_this.dragging = false;
					_this.darggingTargetCol = null;
					_this.draggingInTragetCol = null;
					_this.$toolbar.find(">._tool").css("marginLeft", 0);
					$(document).off("mousemove mouseup");
					$col.removeClass("_drag");
					$headers.removeClass("_dragInLeft _dragInRight");
				});
			})
			.on("mouseenter", function (e) {
				var $this = $(this);
				_this.draggingInTragetCol = $this.parent();

				if (_this.dragging && _this.draggingInTragetCol[0] !== _this.darggingTargetCol) {
					$this.off("mousemove").on("mousemove", function (e) {
						var addClass = "_dragInLeft";
						if (e.offsetX > $this.parent().width()/2) { addClass = "_dragInRight"; }

						$headers.removeClass("_dragInLeft _dragInRight");
						$this.addClass(addClass);
					});
				}
			})
			.find("h6").on("click", function(e) {
				// 排序图标事件
				var $this = $(this),
						$col = $this.parent().parent(),
						order_name = $col.attr("name"),
						order_type = $data.attr("order_type")
				;

				// 当前列是否开启排序
				if (!($col.attr("is_order") && order_type && order_name)) { return $this; }

				var nextSort = order_type === "asc" ? "desc" : "asc";
				// 更新排序需求信息并把之前列中已经激活排序图标类名清除
				$data.attr({
					"order_name": order_name,
					"order_type": nextSort
				}).find(">._col >._header >i._active").removeClass("_active");


				$this.nextAll("i._" + nextSort).addClass("_active").siblings("i").removeClass("_active");

				// 启用数据排序
				__PRIVATE__._sort({
					data: _this.pagination.data,
					name: order_name,
					type: order_type
				});

				// 重新渲染数据
				_this._appendRow();
			});

			// 工具栏事件
			_this.$toolbar.find(">._tool >._dir._left >._prev").on("click", function(e) {
				var $left = $(this).parent();
				if (_this.pagination.page <= 1) { return;	}

				_this.pagination.page--;
				if (_this.pagination.page === 1) {
					$left.removeClass("_active");
				}
				else {
					$left.nextAll("._dir._right").addClass("_active");
				}

				_this.ajaxConfig.page = _this.pagination.page;
				_this._ajax(_this.ajaxConfig);
			})
			.parent().nextAll("._dir._right").find("._next").on("click", function(e) {
				var $right = $(this).parent();
				var totalPage = _this.pagination.totalPage;
				if (_this.pagination.page >= totalPage) { return;	}

				_this.pagination.page++;
				if (_this.pagination.page === totalPage) {
					$right.removeClass("_active");
				}
				else {
					$right.prevAll("._dir._left").addClass("_active");
				}

				_this.ajaxConfig.page = _this.pagination.page;
				_this._ajax(_this.ajaxConfig);
			});

			return this;
		},
		// ajax请求
		_ajax: function (opts) {
			var _this = this;
			$.ajax({
				type: "GET",
				url: opts.url,
				data: opts.data,
				dataType: opts.dataType || "json",
				beforeSend: function(XHR){
					_this.$loading.fadeIn().show().find(">span._left").css("left", 0).next().css("right", 0);
				},
				success: function(obj, textStatus, jqXHR){
						var page = obj.page;
						var offset = (page-1)*obj.pageCount;
						var data = obj.data;

						if (page === 1 && obj.totalPage >page) {
							_this.$toolbar.find(">._tool >._dir._right").addClass("_active");
						}

				 		_this.$toolbar.find(">._tool >._page >input._content").val(page)
											 		.next().text(__PRIVATE__._formatNumber(obj.totalPage))
											 		.parent().parent().next().find(">span._count")
											 		.text((page === 1 ? 1 : offset) +" - "+ (offset+data.length))
											 		.next().text(__PRIVATE__._formatNumber(obj.totalCount))
						;

						_this.pagination = obj;
						_this._appendRow();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
						console.log(textStatus);
						console.log(errorThrown);
				},
				complete: function(XHR, TS) {
					setTimeout(function(){
						_this.$loading.find(">span._left").animate({left: "-50%"}, 1100)
							.next().animate({right: "-50%"}, 1000, function(){
								_this.$loading.fadeOut().hide();
							});
					}, 0);
				}
			});

			return this;
		}
	};
	
	// 判断插件是否已存在，避免同名插件被覆盖
	if ($.fn.hasOwnProperty(plug)) { throw new Error("插件 " + plug + " 已存在"); }

	$.fn[plug] = function(opts) { return $.extend(this, __DEFAULTS__, opts || {}, __PROTO__)._init();	}
}, "jqueryGrid");