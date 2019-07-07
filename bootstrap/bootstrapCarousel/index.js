/**
 * @desc 渲染轮播图方法
 * @param options 配置选项对象 {
 *          data : [],               // array require default []
 *          divIdSelector: '',       // string require 'div标签的id选择器'
 *          interval: 5000,          // number 间隔时间
 *          isOpenArrow: false,      // boolean 是否启动左右箭头切换功能
 *          indicatorClass: '',      // string 自定义小圆点的样式类名
 *        }
 */
function bootstrapCarousel(options) {
  var divIdSelector = options.divIdSelector;

  // 小圆点html
  var html_carouselIndicators = `<ol class="carousel-indicators">`;
  // 图片html
  var html_carouselInner = `<div class="carousel-inner" role="listbox">`;
  // 左右箭头html
  var html_arrow = ``;

  // 遍历数据，拼接 小圆点和图片的 html
  options.data.forEach((img_src, index) => {
    html_carouselIndicators += `<li data-target="${divIdSelector}" data-slide-to="${index}" class="${options.activeIndex === index ? 'active' : ''} ${options.indicatorClass ? options.indicatorClass : ''}"></li>`;

    html_carouselInner += `
      <div class="item ${options.activeIndex === index ? 'active' : ''}">
        <img src=${img_src}>
      </div>
    `;
  });

  html_carouselIndicators += `</ol>`;
  html_carouselInner += `</div>`;

  // 判断是否启动左右箭头切换功能
  if (options.isOpenArrow) {
    html_arrow += `
      <!-- Controls -->
      <a class="left carousel-control" href="${divIdSelector}" role="button" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" href="${divIdSelector}" role="button" data-slide="next">
        <span class="glyphicon gdlyphicon-chevron-right" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    `;
  }

  // 轮播图总html内容
  var html_carouse = html_carouselIndicators + html_carouselInner + html_arrow;

  // 给当前元素添加内部默认配置、替换内部、启动轮播操作
  $(divIdSelector).addClass('carousel slide').attr('data-ride', 'carousel').html(html_carouse).carousel({
    interval: options.interval || 5000
  });
}

bootstrapCarousel({
  // 轮播图片数据
  data: [
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg'
  ],
  // 默认激活的索引，即要显示哪个下标对应的图片
  activeIndex: 0,
  // 图片轮播间隔时间
  interval: 5000,
  // id选择器，要给哪个div元素添加轮播功能
  divIdSelector: '#my-index-carousel',
  // 自定义小圆点的样式类名
  indicatorClass: 'myIndicator'
});