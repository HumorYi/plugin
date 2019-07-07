// 右边轮播展示区域
$(function() {
	let data = [
		{
			title: "态度",
			href: "https://www.baidu.com",		
			src: "./images/0.jpg",
			alt: "0.jpg"
		},
		{
			title: "最前沿",
			href: "http://it.kaikeba.com",		
			src: "./images/1.jpg",
			alt: "1.jpg"
		},
		{
			title: "最话题",
			href: "https://mail.126.com/",		
			src: "./images/2.jpg",
			alt: "2.jpg"
		},
		{
			title: "事件",
			href: "https://www.baidu.com",		
			src: "./images/3.jpg",
			alt: "3.jpg"
		},
		{
			title: "推荐",
			href: "https://www.baidu.com",		
			src: "./images/4.jpg",
			alt: "4.jpg"
		},
		{
			title: "尚惠",
			href: "https://www.baidu.com",		
			src: "./images/5.jpg",
			alt: "5.jpg"
		},
	];

	var $wrap = $("#wrap"),
			$exhibition = $("#exhibition")
	;

	// 左边功能自定义展示区域(这里的代码只做演示)

	// 是否开启自动轮播
	$exhibition.find(">.isOpenAutoPlay >button").jqueryRadioBtn().click(function(e){
		$wrap.isOpenAutoPlay = $(this).hasClass("_open");
		$wrap._init();
	});

	// 是否开启自定义监听事件
	$exhibition.find(">.isOpenCustomEvent >button").jqueryRadioBtn({isOpen: false}).click(function(e){
		$wrap.isOpenCustomEvent = $(this).hasClass("_open");
		$wrap._init();
		
		customEvent();
	});

	// 标题触发事件类型
	$exhibition.find(">.eventType >button").click(function(e){
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
		$wrap.titleConfig.eventType = $this.attr("class").split(" ")[0];
		$wrap._init();
		customEvent();
	});

	// 标题显示形状类型
	$exhibition.find(">.shape >button").click(function(e){
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
		$wrap.titleConfig.showType = $this.attr("class").split(" ")[0];
		$wrap._init();
	});

	// 标题显示方向类型
	$exhibition.find(">.direction >button").click(function(e){
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
		$wrap.titleConfig.direction = $this.attr("class").split(" ")[0];
		$wrap._init();	
	});

	// 图片特效
	$exhibition.find(">.effect >button").click(function(e){
		var $this = $(this);
		$this.addClass("active").siblings().removeClass("active");
		$wrap.carouselConfig.time = Number($this.prevAll("input").val());
		$wrap.carouselConfig.type = $(this).attr("class").split(" ")[0];
		$wrap._init();
	});

	// 间隔定时器时间
	$exhibition.find(">.timer >button").click(function(e){
		$wrap.intervalTime = Number($(this).prev().val());
		$wrap._init();
	});

	// 初始激活索引
	$exhibition.find(">.activeIndex >button").click(function(e){
		$wrap.activeIndex = Number($(this).prev().val());
		$wrap._init();
	});

	// 自定义事件监听
	function customEvent() {
		if ($wrap.isOpenCustomEvent) {	
			$wrap.off("beforeContentHover afterContentHover beforeContentLeave afterContentLeave beforeTitleHover afterTitleHover titleLeave beforeTitleClick afterTitleClick");
			
			if ($wrap.titleConfig.eventType === "click") {
				$wrap.on("beforeTitleClick", function(e, msg) {
					alert("beforeTitleClick");
					alert("msg", msg);
				}).on("afterTitleClick", function(e, msg) {
					alert("afterTitleClick");
					alert("msg", msg);
				});
			}
			else if ($wrap.titleConfig.eventType === "hover") {
				if ($wrap.isOpenAutoPlay) {
					$wrap.on("beforeContentHover", function(e, msg) {
						alert("beforeContentHover");
						alert("msg", msg);
					}).on("afterContentHover", function(e, msg) {
						alert("AfterContentHover");
						alert("msg", msg);
					}).on("beforeContentLeave", function(e, msg) {
						alert("beforeContentLeave");
						alert("msg", msg);
					}).on("afterContentLeave", function(e, msg) {
						alert("afterContentLeave");
						alert("msg", msg);
					})
				}
				
				$wrap.on("beforeTitleHover", function(e, msg) {
					alert("beforeTitleHover");
					alert("msg", msg);
				}).on("afterTitleHover", function(e, msg) {
					alert("AfterTitleHover");
					alert("msg", msg);
				}).on("titleLeave", function(e, msg) {
					alert("titleLeave");
					alert("msg", msg);
				});
			}
		}
	}

	// 最精简调用方式
	$wrap.jqueryBanner({data: data});	
	
	/* $("#wrap").jqueryBanner({
		data: data,
		activeIndex: 0,
		intervalTime: 1,
		isOpenAutoPlay: true,
		isOpenCustomEvent: true,
		titleConfig: {
			eventType: "hover",
			showType: "square",
			direction: "left",
			borderLeftWidth: 5,
			totalWidth: undefined
		},
		carouselConfig: {
			isInit: true,
			fn: function() {
				this._$lis_title.eq(this.prevActiveIndex).removeClass("_active");
				this._$lis_title.eq(this.activeIndex).addClass("_active");
				// 初始化结束
				if (!this.carouselConfig.isInit) {
					this._$lis_picture.eq(this.prevActiveIndex).fadeOut(1000);
					this._$lis_picture.eq(this.activeIndex).fadeIn(1000);
				}
			},
			time: undefined,
			type: "toogle"
		}
	}).on("beforeContentHover", function(e, msg) {
		console.log("beforeContentHover");
		console.log("msg", msg);
	}).on("afterContentHover", function(e, msg) {
		console.log("AfterContentHover");
		console.log("msg", msg);
	}).on("beforeContentLeave", function(e, msg) {
		console.log("beforeContentLeave");
		console.log("msg", msg);
	}).on("afterContentLeave", function(e, msg) {
		console.log("afterContentLeave");
		console.log("msg", msg);
	}).on("beforeTitleHover", function(e, msg) {
		console.log("beforeTitleHover");
		console.log("msg", msg);
	}).on("afterTitleHover", function(e, msg) {
		console.log("AfterTitleHover");
		console.log("msg", msg);
	}).on("titleLeave", function(e, msg) {
		console.log("titleLeave");
		console.log("msg", msg);
	}); */
	
	/* $("#wrap").jqueryBanner({
		data: data,
		activeIndex: 0,
		intervalTime: 1,
		isOpenCustomEvent: true,
		titleConfig: {
			eventType: "click",
			showType: "square",
			direction: "left",
			borderLeftWidth: 5,
			totalWidth: undefined
		},
		carouselConfig: {
			isInit: true,
			fn: function() {
				this._$lis_title.eq(this.prevActiveIndex).removeClass("_active");
				this._$lis_title.eq(this.activeIndex).addClass("_active");
				if (!this.carouselConfig.isInit) {
					this._$lis_picture.eq(this.prevActiveIndex).slideUp();
					this._$lis_picture.eq(this.activeIndex).slideDown();
				}
			},
			time: undefined,
			type: "toogle"
		}
	}).on("beforeTitleClick", function(e, msg) {
		console.log("beforeTitleClick");
		console.log("msg", msg);
	}).on("afterTitleClick", function(e, msg) {
		console.log("afterTitleClick");
		console.log("msg", msg);
	}); */
});