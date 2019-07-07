/**
 * @desc 生成放大镜dom和事件监听
 * @param {
 *  dom Element require
 *  activeIndex number default 0 默认要显示的指定下标图片
 *  productImgs array 商品图片数组，数据格式为 [ {small:'', middle: '', big: ''} ],
 *  customClass string 自定义的样式，用于控制边框的颜色和大小
 * } options 
 */
function generateMagnifier(options) {
    // 为了撑开ul占据的空间
    options.dom.style.marginBottom = '100px';
    // 渲染dom模板内容
    options.dom.innerHTML = `
                <div class="bamboo-zoom-box ${options.customClass ? options.customClass : 'default'}">
                    <div class="bamboo-middle-box">
                        <img src="" alt="">
                        <div class="bamboo-middle-square"></div>
                        <div class="bamboo-middle-mask"></div>
                    </div>

                    <div class="bamboo-big-box">
                        <img src="" alt="">
                    </div>

                    <ul class="bamboo-imgs"></ul>
                </div>
            `;

    var html_imgs = ``;
    var activeIndex = options.activeIndex || 0;
    var activeImgsSrc = options.productImgs[activeIndex];
    options.productImgs.forEach(function (src, index) {
        html_imgs += `<li class="${activeIndex === index ? 'active' : ''}"><img src="${src.small}" alt="" data-middle="${src.middle}" data-big="${src.big}"></li>`;
    });

    var zoomBox = options.dom.querySelector('.bamboo-zoom-box');
    var smallBox = zoomBox.querySelector('.bamboo-middle-box .bamboo-middle-mask');
    var middleImg = zoomBox.querySelector('.bamboo-middle-box img');
    var square = zoomBox.querySelector('.bamboo-middle-square');
    var bigBox = zoomBox.querySelector('.bamboo-big-box');
    var bigImg = bigBox.querySelector('img');

    middleImg.src = activeImgsSrc.middle;
    bigImg.src = activeImgsSrc.big;
    zoomBox.querySelector('.bamboo-imgs').innerHTML = html_imgs;

    var imgs = zoomBox.querySelectorAll('ul.bamboo-imgs >li >img');

    //选项卡切换
    for (var i = 0; i < imgs.length; i++) {
        (function (index) {
            imgs[index].onmouseover = function () {
                for (var j = 0; j < imgs.length; j++) {
                    imgs[j].parentNode.className = '';
                }

                this.parentNode.className = 'active';
                bigImg.src = this.getAttribute('data-big');
                middleImg.src = this.getAttribute('data-middle');
            }
        })(i);
    }

    //鼠标移进事件
    smallBox.onmouseover = function () {
        square.style.display = 'block';
        bigBox.style.display = 'block';
        //利用比例公式计算square的宽高
        //square的宽/middleImg的宽 = bigBox的宽/bigIma的宽
        square.style.width = middleImg.offsetWidth * bigBox.offsetWidth / bigImg.offsetWidth + 'px';
        square.style.height = middleImg.offsetHeight * bigBox.offsetHeight / bigImg.offsetHeight + 'px';
    };

    //鼠标移动事件
    smallBox.onmousemove = function (e) {
        var e = e || window.event;
        var x, y;
        //x和y的坐标
        x = e.offsetX - square.offsetWidth / 2;
        y = e.offsetY - square.offsetHeight / 2;
        if (x < 0) {
            x = 0;
        }
        if (x > smallBox.offsetWidth - square.offsetWidth) {
            x = smallBox.offsetWidth - square.offsetWidth;
        }
        if (y < 0) {
            y = 0;
        }
        if (y > smallBox.offsetHeight - square.offsetHeight) {
            y = smallBox.offsetHeight - square.offsetHeight;
        }
        square.style.left = x + 'px';
        square.style.top = y + 'px';

        //利用公式计算大图的坐标
        //<!--// x/?=middleImg.w/bigimg.w-->
        //<!--// y/?=middleImg.h/bigimg.h-->

        bigImg.style.left = -x * bigImg.offsetWidth / middleImg.offsetWidth + 'px';
        bigImg.style.top = -y * bigImg.offsetHeight / middleImg.offsetHeight + 'px';
    };

    //鼠标移出事件
    smallBox.onmouseout = function () {
        square.style.display = 'none';
        bigBox.style.display = 'none';
    };
}