(function(root, factory, plug){
	factory(root.jQuery, plug);
})(window, function($, plug){
	var __DEFAULTS__ = {
		header: [],
		toolbar: {},
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
				return $ + (strNumlen - index > 3 ? "," : "");
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
			var header_height = this.height && this.height.header ? this.height.header : "";

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

					orderIcon = '<i class="asc'+(isAsc ? " active" : "")+'"></i>'
										+'<i class="desc'+(isDesc ? " active" : "")+'"></i>'
					;
				}

				cols += '<div class="col" name="'+name+'" is_order="'+isOrder+'" col_index="'+header_index+'" style="'+(width ? "width="(width+"px") : "")+'">'
								+'<div class="header">'
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

			var grid = '<div class="data" order_type="'+order_type+'" order_name="'+order_name+'"z>'+cols+'</div>'
					  +'<div class="toolbar">'
						  +'<div class="tool">'					  	
							  +'<div class="dir left">'
							  	+'<div class="prev">'
								  	+'<i></i>'
							  	+'</div>'
							  	+'<div class="backward">'
								  	+'<i></i>'
								  	+'<i></i>'
							  	+'</div>'
							  +'</div>'
							  +'<div class="page">'
							  		+'Page <input type="text" class="content">'
							  		+' of <span class="totalPage"></span>'
							  +'</div>'					  	
							  +'<div class="dir right">'
							  	+'<div class="next">'
								  	+'<i></i>'
							  	+'</div>'
							  	+'<div class="forward">'
								  	+'<i></i>'
								  	+'<i></i>'
							  	+'</div>'
							  +'</div>'
						  +'</div>'
						  +'<div class="view">'
						  	+' View <span class="count"></span>'
						  	+' of <span class="totalCount"></span>'
						  +'</div>'
					  +'</div>'
					  +'<div class="loading">'
					  	+'<span class="left"></span>'
					  	+'<span class="right"></span>'
					  +'</div>'
			;

			this.$data = this.addClass("grid").html(grid).find(">div.data");
			this.$toolbar = this.find(">div.toolbar");
			this.$loading = this.find(">div.loading");

			header_height && this.$data.find(">div.col >div.header").css({"height": header_height+"px", "line-height": header_height+"px"});

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
			var dataItem_height = this.height && this.height.dataItem ? this.height.dataItem : "";

			$.each(_this.header, function(header_index, header_obj){
				var name = header_obj.name || "";
				var dataItems = "";
				$.each(_this.pagination.data, function (data_index, data_obj) {
					dataItems += "<li class='"+(data_obj.active ? "active" : "")+"' row_index='"+data_index+"'>"+(data_obj[name]||"")+"</li>";		
				});

				var $uls = _this.$data.find(">div.col[name="+name+"] > ul").html(dataItems);

				$uls = null;
				dataItems = null;
				name = null;
			});

			dataItem_height && this.$data.find(">div.col >ul >li").css({"height": dataItem_height+"px", "line-height": dataItem_height+"px"});	
		},
		// 事件处理
		_handle: function () {
			var _this = this;
			var $data = _this.$data;
			var $ul = $data.find(">div.col > ul");
			var $headers = $data.find(">div.col > div.header");

			// 数据项事件
			$ul.on("mouseover", ">li", function(e) {
				!_this.dragging && $ul.find(">li[row_index="+$(this).index()+"]").addClass("hover");
			})
			.on("mouseout", ">li", function(e){
				$ul.find(">li[row_index="+$(this).index()+"]").removeClass("hover");
			})
			.on("click", ">li", function(e) {
				var index = $(this).index();
				_this.pagination.data[index].active = $ul.find(">li[row_index="+index+"]").toggleClass("active").hasClass("active");
			});

			// 头部拖拽事件
			$headers.on("mouseenter", function (e) {
				var $tragetIn = $(e.currentTarget);
				_this.draggingInTragetCol = $tragetIn.parent();
				if (_this.dragging && _this.draggingInTragetCol[0] !== _this.darggingTargetCol) {
					$tragetIn.off("mousemove").on("mousemove", function (e) {
						var addClass = "drag-in-left";
						if (e.offsetX > $tragetIn.parent().width()/2) {
							addClass = "drag-in-right";
						}

						$headers.removeClass("drag-in-left drag-in-right");
						$tragetIn.addClass(addClass);
					});
				}
			})
			.find(">h6").on("mousedown", function (e) {
				// 禁用鼠标右键点击
				if(e.buttons===2) return;

				var $col = $(e.currentTarget.parentNode.parentNode).addClass("drag");
				var offsetX = -10;
				var offsetY = -10;
				_this.dragging = true;
				_this.darggingTargetCol = $col[0];

				$headers.addClass("cursor");
				$col.css({left:e.clientX-offsetX+"px", top:e.clientY-offsetY+"px"});
				_this.$toolbar.find(">div.tool").css("marginLeft", -$col.width()/2+"px");

				$(document).on("mousemove", function (e) {
					$col.css({left:e.clientX-offsetX+"px", top:e.clientY-offsetY+"px"});
				}).on("mouseup", function (e) {
					if (_this.draggingInTragetCol) {
						var header = _this.draggingInTragetCol.find(">div.header");
						if (header.hasClass("drag-in-left")) {
							_this.draggingInTragetCol.before(_this.darggingTargetCol);
						}
						else if (header.hasClass("drag-in-right")){
							_this.draggingInTragetCol.after(_this.darggingTargetCol);	
						}
					}

					_this.dragging = false;
					_this.darggingTargetCol = null;
					_this.draggingInTragetCol = null;
					_this.$toolbar.find(">div.tool").css("marginLeft", 0);
					$(document).off("mousemove mouseup");
					$col.removeClass("drag");
					$headers.removeClass("cursor drag-in-left drag-in-right").off("mousemove");
				});
			})
			.next("i").on("click", function(e) {
				// 排序图标事件
				var $this = $(this);

				// 当前列是否开启排序
				var $col = $this.parent().parent();
				var order_name = $col.attr("name");
				var order_type = $data.attr("order_type");
				if (!($col.attr("is_order") && order_type && order_name)) {
					return $this;
				}

				// 做到当前头部排序图标只有一个是激活状态
				if ($this.siblings("i").hasClass("active")) {
					$this.addClass("active").siblings("i").removeClass("active");
				}
				else if ($this.hasClass("active")) {
					$this.removeClass("active").siblings("i").addClass("active");	
				}else {
					$data.find(">div.col >div.header >i").removeClass("active");
					$this.addClass("active");
				}

				// 更新排序需求信息
				$data.attr("order_type", order_type === "asc" ? "desc" : "asc");
				$data.attr("order_name", order_name);

				// 启用数据排序
				__PRIVATE__._sort({
					data: _this.pagination.data,
					type: order_type,
					name: order_name
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
				dataType: "json",
				beforeSend: function(XHR){
					_this.$loading.fadeIn().show().find(">span.left").css("left", 0).next().css("right", 0);
				},
				success: function(obj, textStatus, jqXHR){
						var page = obj.page;
						var offset = (page-1)*obj.pageCount;
						var data = obj.data;

						if (page === 1 && obj.totalPage > page) {
							_this.$toolbar.find(">div.tool >div.dir.right").addClass("active");
						}

				 		_this.$toolbar.find(">div.tool >div.page >input.content").val(page)
				 		.next().text(__PRIVATE__._formatNumber(obj.totalPage)).parent().parent().next()
				 		.find(">span.count").text((page === 1 ? 1 : offset) +" - "+ (offset+data.length))
				 		.next().text(__PRIVATE__._formatNumber(obj.totalCount));

						_this.pagination = obj;
						_this._appendRow();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert(textStatus);
						alert(errorThrown);
				},
				complete: function(XHR, TS) {
					setTimeout(function(){
						_this.$loading.find(">span.left").animate({left: "-50%"}, 1100)
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
	if ($.fn.hasOwnProperty(plug)) {
		throw new Error("插件 " + plug + " 已存在");
	}

	$.fn[plug] = function(opts) {
		if (!this.is("div")) {
			throw new Array("必须使用div元素调用");
		}
		else if (this.hasClass("grid")) {
			throw new Array("类名grid插件内部已使用");
		}
		else if (this.length > 1) {
			throw new Array("调用的div元素必须是唯一的");
		}

		opts = opts || {};

		return $.extend(this, __DEFAULTS__, opts, __PROTO__)._init();
	}
}, "jqueryGrid");