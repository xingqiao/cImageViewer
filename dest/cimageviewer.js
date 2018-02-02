"use strict";var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}!function(e,t){t.body;!function(){for(var e=0,t=["webkit","moz"],n=0;n<t.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t,n){var i=(new Date).getTime(),o=Math.max(0,16.7-(i-e)),r=window.setTimeout(function(){t(i+o)},o);return e=i+o,r}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})}();var n={touch:"ontouchend"in t,ios:/(iPhone|iPod|iPad)/i.test(navigator.userAgent),$:function(e,n,i){var o=i||"querySelector";return n&&n[o]?n[o](e):t[o](e)},$$:function(e,t){return this.$(e,t,"querySelectorAll")},encodeHTML:function(e,t){return(null==e?"":""+e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\'/g,"&#39;").replace(/\"/g,"&quot;").replace(/\r?\n/g,t||" ")},transition:function(e,t){e.style.transition=e.style.webkitTransition=t},transformOrigin:function(e,t,n){t=null==t?0:t,n=null==n?0:n,e.style.transformOrigin=e.style.webkitTransformOrigin=t+"px "+n+"px"},transform:function(e,t,n,i){t=null==t?0:t,n=null==n?0:n,e.style.transform=e.style.webkitTransform=(this.ios?"translate("+t+"px,"+n+"px)":"translate3d("+t+"px,"+n+"px,0)")+(i>0?" scale("+i+")":"")},ondown:function(e,t){return n.touch?e.addEventListener("touchstart",t):e.addEventListener("mousedown",function(e){e.touches=[{pageX:e.pageX,pageY:e.pageY}],t.call(this,e)}),this},onmove:function(e,t){return n.touch?e.addEventListener("touchmove",t):e.addEventListener("mousemove",function(e){e.touches=[{pageX:e.pageX,pageY:e.pageY}],t.call(this,e)}),this},onup:function(e,t){return n.touch?(e.addEventListener("touchend",t),e.addEventListener("touchcancel",t)):e.addEventListener("mouseup",t),this},ontap:function(e,t){if(n.touch){var i=null,o=null,r=null,s=null;e.addEventListener("touchstart",function(e){1==e.touches.length&&(i=r=e.touches[0].pageX,o=s=e.touches[0].pageY),e.preventDefault(),e.stopPropagation()}),e.addEventListener("touchmove",function(e){null!=i&&(e.touches.length>1?i=null:(r=e.touches[0].pageX,s=e.touches[0].pageY))}),e.addEventListener("touchend",function(n){null!=i&&Math.pow(i-r,2)+Math.pow(o-s,2)<400&&t.call(e,n),i=null})}else e.addEventListener("click",t);return this},extend:function(){var e=void 0,t=void 0,i=void 0,o=void 0,r=void 0,s=void 0,a=arguments,l=a[0]||{},c=1,u=a.length,v=!1;for(n.isBoolean(l)&&(v=l,l=a[c]||{},c++),c===u?(l={},c--):n.isObject(l)||n.isFunction(l)||(l={});c<u;c++)if(null!=(e=a[c]))for(t in e)i=l[t],l!==(o=e[t])&&(v&&o&&((r=Array.isArray(o))||n.isObject(o))?(r?(r=!1,s=i&&Array.isArray(i)?i:[]):s=i&&n.isObject(i)?i:{},l[t]=n.extend(v,s,o)):void 0!==o&&(l[t]=o));return l},toggle:function(e,t){e.style.display=t?"":"none"}};Array.prototype.forEach.call(["Object","Function","String","Number","Array","Boolean",{type:"Img",key:"HTMLImageElement"}],function(e){n["is"+(e.type||e)]=function(t){return Object.prototype.toString.call(t)==="[object "+(e.key||e)+"]"}});var i=function(){function i(e){_classCallCheck(this,i),this._initData(e)}return _createClass(i,[{key:"__showHandler",value:function(){}},{key:"__hideHandler",value:function(){}},{key:"__slidestartHandler",value:function(){}},{key:"__slideendHandler",value:function(){}},{key:"__slidechangeHandler",value:function(){}},{key:"__clickHandler",value:function(){}},{key:"__downloadHandler",value:function(){}},{key:"_trigger",value:function(e,t){var i=this,o=i.__.opts;e&&n.isString(e)&&[i["__"+e+"Handler"],i["_"+e+"Handler"],o["on"+e.toLowerCase()]].forEach(function(e){n.isFunction(e)&&e.call(i,t)});return i}},{key:"_initData",value:function(e){var t=0;this.__&&this.__.state&&this.__.state.show&&(t=1,this.hide());var o={opts:n.extend({},i.defaultOptions),state:{show:0,ani:0},elem:{iframe:null,prev:null,next:null,num:null,curNum:null,allNum:null,desc:null},content:"",items:{prev:{},cur:{},next:{}},view:{margin:10,padding:50,left:0,right:0,width:0,height:0},transform:{duration:250,move:0},version:{build:"CIV",version:"1.0.0"}};if(this.__=o,o.opts.list=[],n.isObject(e))for(var r in e)/^on\w/.test(r)&&n.isFunction(e[r])?o.opts[r.toLowerCase()]=e[r]:/^list$/i.test(r)?n.isArray(e[r])&&function(){var t=void 0,i=void 0;e[r].forEach(function(e,r){n.isImg(e)?(t=e.src,i=e.getAttribute("data-civ-desc")):(t=e.src||e,i=e.desc),o.opts.list.push({index:r,desc:i?n.encodeHTML(i):"",src:t,left:NaN,x:0,y:0,scale:1})})}():/^index$/i.test(r)?o.opts.index=parseInt(e[r]):o.opts[r]=e[r];return o.opts.index>=0&&o.opts.index<o.opts.list.length||(o.opts.index=0),o.opts.preload&&this._preloadImage(o.opts.list),t&&this.show(),this}},{key:"_initDlg",value:function(){var o=this,r=o.__,s=r.opts,a=r.view,l=r.elem,c=r.items,u=r.content,v=r.transform,d=r.state,p=l.iframe;p||((p=t.createElement("iframe")).style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;border:0;z-index:"+(isNaN(s.zIndex)?i.defaultOptions.zIndex:s.zIndex),u="<style>\n                    *{margin:0;padding:0;border:0}\n                    body{background-color:#000;font:16px/1.5 sans-serif}\n                    body{background-color:"+s.background+'}\n                    a,a:hover{text-decoration:none}\n                    button{font-size:14px}\n                    .civ,.civ-cont,.civ-item,.civ-item>div{position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden}\n                    .civ-ft{position:absolute;right:15px;bottom:20px;left:15px;z-index:10;display:-webkit-box;-webkit-box-align:center;overflow:hidden;font-size:14px;color:rgba(255,255,255,.6);}\n                    .civ-page__cur{font-size:20px;font-weight:normal;color:#fff;}\n                    .civ-page__line{font-size:12px;font-style:normal;}\n                    .civ-tit{-webkit-box-flex:1;margin:2px 0 0 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}\n                    .civ-arrow,.civ-close{position:absolute;top:50%;width:40px;height:40px;margin-top:-20px;color:rgba(255,255,255,.8);}\n                    .civ-arrow::before,.civ-arrow::after,.civ-close::before,.civ-close::after{content:"";position:absolute;border-radius:3px;background:currentColor;box-shadow:#000 0 0 20px;}\n                    .civ-arrow::before{width:3px;height:32px;}\n                    .civ-arrow::after{width:32px;height:3px;}\n                    .civ-arrow--left{left:25px;-webkit-transform:rotate(-45deg);}\n                    .civ-arrow--right{right:25px;-webkit-transform:rotate(135deg);}\n                    .civ-close{top:40px;right:20px;-webkit-transform:rotate(135deg);}\n                    .civ-close::before{width:3px;height:32px;margin-left:14px;}\n                    .civ-close::after{width:32px;height:3px;margin-top:14px;}\n                    </style>\n                    <div class="civ js_civ">\n                        <div class="civ-cont js_civ_list">\n                            <div class="civ-item js_civ_item prev"><div><img></div></div>\n                            <div class="civ-item js_civ_item cur"><div><img></div></div>\n                            <div class="civ-item js_civ_item next"><div><img></div></div>\n                        </div>\n                        <div class="civ-ft">\n                            <div class="civ-page js_civ_num">\n                                <strong class="civ-page__cur js_civ_num_cur"></strong> <i class="civ-page__line">⁄</i> <span class="civ-page__all js_civ_num_all"></span>\n                            </div>\n                            <h6 class="civ-tit js_civ_desc"></h6>\n                        </div>\n                        <a href="javascript:;" class="civ-arrow civ-arrow--left js_civ_prev"></a>\n                        <a href="javascript:;" class="civ-arrow civ-arrow--right js_civ_next"></a>\n                        <a href="javascript:;" class="civ-close js_civ_close"></a>\n                    </div>',l.iframe=p,r.content=u),t.body.appendChild(p);var h=p.contentDocument;h.write(u),h.close(),l.num=n.$(".js_civ_num",h),l.curNum=n.$(".js_civ_num_cur",h),l.allNum=n.$(".js_civ_num_all",h),l.desc=n.$(".js_civ_desc",h),l.allNum.innerHTML=s.list.length,n.toggle(l.num,!!s.orderNumber),l.prev=n.$(".js_civ_prev",h),l.next=n.$(".js_civ_next",h),l.close=n.$(".js_civ_close",h);var f=parseInt(e.innerWidth),_=parseInt(e.innerHeight);a.width=f,a.height=_;for(var g in c){var m=c[g]={};m.wrap=n.$(".js_civ_item."+g,h),m.div=n.$("div",m.wrap),m.img=n.$("img",m.wrap)}var w=function(e,t,i){var o=c.cur,r=o.zoom,s=f*i,a=_*i,l=(s-f)/i,u=(a-_)/i;e=Math.min(Math.max(e,0),l),t=Math.min(Math.max(t,0),u),i<=4&&e>=0&&e<=l&&t>=0&&t<=u&&(r.width=s,r.height=a,r.x=e,r.y=t,r.scale=i,n.transformOrigin(o.div,e,t),n.transform(o.div,-e,-t,i))},x=n.$(".js_civ_list",h),y=[],b=0;return n.ondown(x,function(e){d.show&&(y.length=0,e.touches.length&&Array.prototype.forEach.call(e.touches,function(e){y.push({x:e.pageX,y:e.pageY})}),o._trigger("slidestart")),e.preventDefault(),e.stopPropagation()}).onmove(x,function(e){var t=e.touches[0];if(t){var n=void 0,i=void 0,r=c.cur.zoom;if(!r)return;var l=r.scale,u=t.pageX,d=t.pageY;if(2==y.length&&2==e.touches.length){var p=e.touches[1].pageX,h=e.touches[1].pageY,_=(y[0].x+y[1].x)/2,g=(y[0].y+y[1].y)/2,m=Math.sqrt(Math.pow(y[1].x-y[0].x,2)+Math.pow(y[1].y-y[0].y,2)),x=Math.sqrt(Math.pow(p-u,2)+Math.pow(h-d,2))/m,k=(x-1)/(l*=x);n=r.x+_*k,i=r.y+g*k,w(n,i,l),y[0].x=u,y[0].y=d,y[1].x=p,y[1].y=h}else if(y.length){var j=u-y[0].x,I=d-y[0].y;if((n=r.x-j/l)>0&&n<(r.width-f)/l)i=r.y-I/l,w(n,i,l);else if(s.list.length>1&&j){var A=parseInt(v.move+j);-A>=a.left&&-A<=a.right&&(v.move=A,o._update(),b=1)}y[0].x=u,y[0].y=d}}e.preventDefault(),e.stopPropagation()}).onup(x,function(){y.length=0,b&&o._reset()}).ontap(x,function(){o._trigger("click")}).ontap(l.prev,function(){o.prev()}).ontap(l.next,function(){o.next()}).ontap(l.close,function(){o.hide()}),x.addEventListener("mousewheel",function(e){if(d.show){var t=c.cur.zoom,n=t.scale*(e.deltaY>0?.9:1/.9),i=e.clientX,o=e.clientY,r=n-t.scale,s=t.x+i*r/n,a=t.y+o*r/n;w(s,a,n)}e.preventDefault(),e.stopPropagation()}),o._initItems(),o}},{key:"_preloadImage",value:function(e,t){return n.isArray(e)||(e=[e]),n.isFunction(t)||(t=null),n.isArray(e)&&e.forEach(function(e,n){if(e&&e.src&&!e.width){var i=new Image;i.onload=i.onerror=i.onabort=function(o){o&&"load"==o.type?(e.width=i.width,e.height=i.height):e.src=null,i=null,t&&t(e,n)},i.src=e.src}else t&&t(e,n)}),self}},{key:"_initItems",value:function(){var e=this,t=e.__,i=t.opts,o=t.elem,r=t.view,s=t.items,a=t.transform,l=i.list.length,c=i.index>0&&i.index<l?parseInt(i.index):0,u=function(t,o){var a=s[t],l=i.list[o]||{};a.data=l,a.index!==l.index&&(a.index=l.index,l.src?a.img.src=l.src:a.img.removeAttribute("src"),e._preloadImage(l,function(e){var t=1,i=0,o=0;if(e.width){var s=r.width/e.width,l=r.height/e.height;s<l?(t=s,o=(e.height-r.height/t)/2):(t=l,i=(e.width-r.width/t)/2)}a.x=i=parseInt(i),a.y=o=parseInt(o),a.scale=t,a.zoom={width:0,height:0,x:0,y:0,scale:1},n.transformOrigin(a.img,i,o),n.transform(a.img,-i,-o,t),n.transformOrigin(a.div,0,0),n.transform(a.div,0,0,1)}))};return u("prev",(c-1+l)%l),u("cur",c),u("next",(c+1)%l),o.curNum.innerHTML=c+1,o.desc.innerHTML=s.cur.data.desc||"",e._setArrow(),e.close=i.close,a.move=0,e._update()._updateViewScroll(),e}},{key:"_update",value:function(e,t){var i=this.__,o=i.view,r=i.items,s=i.transform,a=o.width+o.margin,l=s.move;n.isFunction(t)||(t=null);var c=function(e,t){n.isArray(e)||(e=[]),t(r.prev,e[0]),t(r.cur,e[1]),t(r.next,e[2])};c([l-a,l,l+a],function(e,t){e._needMove=0;var n=e.left;n!=t&&(e.left=t,(n>=-a&&n<=a||t>=-a&&t<=a)&&(e._needMove=1))});var u=function(e){var t=e?"all "+s.duration+"ms ease":"";c(null,function(e,i){e._needMove&&n.transition(e.wrap,t)})},v=function(){c(null,function(e,t){e._needMove&&n.transform(e.wrap,e.left)})};return e?(u(!0),setTimeout(v,0),setTimeout(function(){u(!1),t&&t()},s.duration)):(v(),t&&t()),this}},{key:"_updateViewScroll",value:function(){var e=this.__,t=e.opts,n=e.view,i=n.width+n.margin;return n.left=t.loop||0!=t.index?-i:0,n.right=t.loop||t.index!=t.list.length-1?i:0,this}},{key:"_reset",value:function(e){var t=this,n=t.__,i=n.opts,o=n.state,r=n.view,s=n.items,a=n.transform,l=null;if(!o.ani){if(o.ani=1,null!=e&&(-e>=r.left||-e<=r.right)?t._trigger("slidestart"):e=a.move,Math.abs(e)>r.padding){var c=r.width+r.margin;e>0?(e=c,l=-1):(e=-c,l=1)}else e=0;a.move=e,t._update(!0,function(){if(l){r.width,r.margin;var e=function(e,t,n){s.prev=e,s.cur=t,s.next=n,i.index=t.index};1==l?e(s.cur,s.next,s.prev):-1==l&&e(s.next,s.prev,s.cur),a.move=0,t._initItems()}setTimeout(function(){o.ani=0},10),t._trigger("slideend"),l&&t._trigger("slidechange")})}return t}},{key:"_setArrow",value:function(){var e=this.__,t=e.opts,i=e.elem,o=(i.prev,i.next,t.list.length);return n.toggle(i.prev,t.arrow&&o>1&&(t.loop||t.index>0)),n.toggle(i.next,t.arrow&&o>1&&(t.loop||t.index<o-1)),this}},{key:"show",value:function(){var e=this.__.state;return e.show||(this._initDlg(),e.show=1,this._trigger("show")),this}},{key:"hide",value:function(e){var n=this.__,i=n.state,o=n.elem.iframe;return i.show&&(t.body.removeChild(o),i.show=0,this._trigger("hide",e||"hide")),this}},{key:"prev",value:function(){var e=this.__,t=e.opts,n=e.state,i=e.view,o=t.list.length;return n.show&&o>1&&(t.loop||t.index>0)&&this._reset(i.width),this}},{key:"next",value:function(){var e=this.__,t=e.opts,n=e.state,i=e.view,o=t.list.length;return n.show&&o>1&&(t.loop||t.index<o-1)&&this._reset(-i.width),this}},{key:"list",get:function(){return this.__.opts.list.map(function(e){return e.src})},set:function(e){var t=this.__,i=t.opts,o=t.state;n.isArray(e)&&(this.list.join(",")!=e.join(",")&&(i.list=e,i.index=0,o.show&&this._initData(i)._reset()))}},{key:"close",get:function(){return!!this.__.opts.close},set:function(e){var t=this.__,i=t.opts,o=t.elem;i.close=!!e,n.toggle(o.close,i.close)}},{key:"index",get:function(){return this.__.opts.index},set:function(e){var t=this.__,n=t.opts,i=t.state;(e=parseInt(e))>=0&&e<=n.list.length-1&&(n.index=e,i.show&&this._initItems())}},{key:"loop",get:function(){return this.__.opts.loop},set:function(e){var t=this.__,n=t.opts,i=t.state;e!=n.loop&&(n.loop=e,i.show&&this._updateViewScroll())}},{key:"version",get:function(){return this.__.version}}]),i}();i.utils=n,e.CIV=e.cImageViewer=i}(window,document),function(e){e.ANIMATION={TRANSLATE:"translate"},e.defaultOptions={list:null,index:0,loop:!0,orderNumber:!0,close:!0,arrow:!0,preload:!1,save:!1,saveBtn:"保存图片",noSave:!1,background:"#000",animation:e.ANIMATION.TRANSLATE,zIndex:99999}}(window.CIV),function(e,t,n){var i=n.utils,o=function(o){function r(e){_classCallCheck(this,r);var t=_possibleConstructorReturn(this,(r.__proto__||Object.getPrototypeOf(r)).call(this,e)),n=t.__;return n.elem.save=null,n.version.build="CIV_QM",t}return _inherits(r,n),_createClass(r,[{key:"_showHandler",value:function(){var e=this,t=e.__,n=t.opts,o=t.elem,r=o.iframe.contentDocument,s=r.createElement("div");s.innerHTML='<style>\n                .civ-btn{position:absolute;padding:0 1em;bottom:50px;width:140px;line-height:40px;left:50%;margin-left:-70px;background:rgba(0,0,0,.5);color:#fff;border:2px solid #fff;border-radius:20px;overflow:hidden;text-overflow:ellipsis;}\n                </style>\n                <button class="civ-btn js_save" style="'+(n.save?"":"display:none")+'">'+n.saveBtn+"</button>",r.body.appendChild(s),o.save=i.$(".js_save",r),i.ontap(o.save,function(){e._save()})}},{key:"_save",value:function(){var n=this,o=n.__,r=o.opts,s=o.items.cur;if(s.img){var a=s.img.src;if(a){var l=function(e){var t={img:a,index:s.index};e&&0!=e.code&&(t.error=e),n._trigger("save",t)};if(!r.noSave){if(e.M&&M.client){if(i.isFunction(M.client.open))return M.client.open("media","saveImage",{content:a},l),n;if(i.isFunction(M.client.invoke))return M.client.invoke("media","saveImage",{content:a},l),n}var c=t.createElement("a");c.href=a,c.target="_blank";var u=a.split(/[#?]/);u=u[0].match(/[\w.]+$/),c.download=u&&u[0]||"save.jpg",c.click()}l()}}return n}},{key:"save",get:function(){return this.__.opts.save},set:function(e){var t=this.__,n=t.opts,i=t.elem;n.save=!!e,i.btn.style.display=n.save?"block":"none"}},{key:"saveBtn",get:function(){return this.__.opts.saveBtn},set:function(e){var t=this.__,n=t.opts,i=t.elem;(e=""+e)!=n.saveBtn&&(n.saveBtn=e,i.btn.innerText=e)}}]),r}();o.defaultOptions.save=!1,o.defaultOptions.saveBtn="保存图片",e.CIV=e.cImageViewer=o}(window,document,window.CIV);