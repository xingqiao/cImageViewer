"use strict";function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();!function(e,t){t.body;!function(){for(var e=0,t=["webkit","moz"],n=0;n<t.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t,n){var i=(new Date).getTime(),r=Math.max(0,16.7-(i-e)),o=window.setTimeout(function(){t(i+r)},r);return e=i+r,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})}();var n={touch:"ontouchend"in t,$:function(e,n,i){var r=i||"querySelector";return n&&n[r]?n[r](e):t[r](e)},$$:function(e,t){return this.$(e,t,"querySelectorAll")},encodeHTML:function(e,t){return(null==e?"":""+e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;").replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\'/g,"&#39;").replace(/\"/g,"&quot;").replace(/\r?\n/g,t||" ")},transformOrigin:function(e,t,n){t=null==t?0:t,n=null==n?0:n,e.style.transformOrigin=e.style.webkitTransformOrigin=t+"px "+n+"px"},transform:function(e,t,n,i){t=null==t?0:t,n=null==n?0:n,i=null==i?1:i,e.style.transform=e.style.webkitTransform="translate3d("+t+"px,"+n+"px,0) scale("+i+")"},ondown:function(e,t){return n.touch?e.addEventListener("touchstart",t):e.addEventListener("mousedown",function(e){e.touches=[{pageX:e.pageX,pageY:e.pageY}],t.call(this,e)}),this},onmove:function(e,t){return n.touch?e.addEventListener("touchmove",t):e.addEventListener("mousemove",function(e){e.touches=[{pageX:e.pageX,pageY:e.pageY}],t.call(this,e)}),this},onup:function(e,t){return n.touch?(e.addEventListener("touchend",t),e.addEventListener("touchcancel",t)):e.addEventListener("mouseup",t),this},ontap:function(e,t){if(n.touch){var i=null,r=null,o=null,a=null;e.addEventListener("touchstart",function(e){1==e.touches.length&&(i=o=e.touches[0].pageX,r=a=e.touches[0].pageY),e.preventDefault(),e.stopPropagation()}),e.addEventListener("touchmove",function(e){null!=i&&(o=e.touches[0].pageX,a=e.touches[0].pageY)}),e.addEventListener("touchend",function(){Math.pow(i-o,2)+Math.pow(r-a,2)<400&&t.call(e),i=null})}else e.addEventListener("click",t);return this},extend:function(){var e=void 0,t=void 0,i=void 0,r=void 0,o=void 0,a=void 0,s=arguments,l=s[0]||{},u=1,c=s.length,d=!1;for(n.isBoolean(l)&&(d=l,l=s[u]||{},u++),n.isObject(l)||n.isFunction(l)||(l={}),u===c&&(l=this,u--);u<c;u++)if(null!=(e=s[u]))for(t in e)i=l[t],l!==(r=e[t])&&(d&&r&&(jQuery.isPlainObject(r)||(o=Array.isArray(r)))?(o?(o=!1,a=i&&Array.isArray(i)?i:[]):a=i&&jQuery.isPlainObject(i)?i:{},l[t]=jQuery.extend(d,a,r)):void 0!==r&&(l[t]=r));return l},easeInOut:function(e,t,n,i){return-n/2*(Math.cos(Math.PI*e/i)-1)+t},transition:function(e,t,i){var r=e.from,o=e.to,a=e.time,s=o-r,l=+new Date;!function e(){var u=new Date-l;if(u<a){var c=n.easeInOut(Math.min(u,a),r,s,a);!1!==t(c,u)&&requestAnimationFrame(e)}else t(o,u),i()}()}};Array.prototype.forEach.call(["Object","Function","String","Number","Array","Boolean",{type:"Img",key:"HTMLImageElement"}],function(e){n["is"+(e.type||e)]=function(t){return Object.prototype.toString.call(t)==="[object "+(e.key||e)+"]"}});var i=function(){function i(e){_classCallCheck(this,i),this._initData(e)}return _createClass(i,[{key:"__showHandler",value:function(){}},{key:"__hideHandler",value:function(){}},{key:"__slidestartHandler",value:function(){}},{key:"__slideendHandler",value:function(){}},{key:"__clickHandler",value:function(){}},{key:"__downloadHandler",value:function(){}},{key:"_trigger",value:function(e,t){var i=this,r=i.__.opts;return e&&n.isString(e)&&[i["__"+e+"Handler"],i["_"+e+"Handler"],r["on"+e.toLowerCase()]].forEach(function(e){n.isFunction(e)&&e.call(i,t)}),i}},{key:"_initData",value:function(e){var t=this,r=0;t.__&&t.__.state&&t.__.state.show&&(r=1,t.hide());var o={opts:n.extend({},i.defaultOptions),state:{show:0,ani:0},iframe:null,btn:null,content:"",items:{prev:{},cur:{},next:{}},view:{margin:10,padding:100,left:0,right:0,width:0,height:0},transform:{resetDelay:250,aniIndex:0,move:0},version:{build:"CIV",version:"1.0.0"}};if(t.__=o,o.opts.list=[],n.isObject(e))for(var a in e)/^on\w/.test(a)&&n.isFunction(e[a])?o.opts[a.toLowerCase()]=e[a]:/^list$/i.test(a)?n.isArray(e[a])&&e[a].forEach(function(e,t){n.isImg(e)&&(e=e.src),o.opts.list.push({index:t,src:e,left:NaN,x:0,y:0,scale:1})}):/^index$/i.test(a)?o.opts.index=parseInt(e[a]):o.opts[a]=e[a];return o.opts.index>=0&&o.opts.index<o.opts.list.length||(o.opts.index=0),o.opts.preload&&t._preloadImage(o.opts.list),r&&t.show(),t}},{key:"_initDlg",value:function(){var r=this,o=r.__,a=o.opts,s=o.view,l=o.iframe,u=o.items,c=o.content,d=o.transform,v=o.state;l||((l=t.createElement("iframe")).style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;border:0;z-index:"+(isNaN(a.zIndex)?i.defaultOptions.zIndex:a.zIndex),c="<style>\n                    *{margin:0;padding:0;border:0}\n                    body{background-color:#000;font:16px/1.5 sans-serif}\n                    body{background-color:"+a.background+'}\n                    a,a:hover{text-decoration:none}\n                    .civ,.civ-cont,.civ-item{position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden}\n                    </style>\n                    <div class="civ js_civ">\n                        <div class="civ-cont js_civ_list">\n                            <div class="civ-item js_civ_item prev"><img></div>\n                            <div class="civ-item js_civ_item cur"><img></div>\n                            <div class="civ-item js_civ_item next"><img></div>\n                        </div>\n                    </div>',o.iframe=l,o.content=c),t.body.appendChild(l);var f=l.contentDocument;f.write(c),f.close();var p=parseInt(e.innerWidth),h=parseInt(e.innerHeight);s.width=p,s.height=h,s.padding=parseInt(p/3);for(var m in u){var _=u[m]={};_.inZoom=0,_.div=n.$(".js_civ_item."+m,f),_.img=n.$("img",_.div)}var g=n.$(".js_civ_list",f),w=[],y=0;return n.ondown(g,function(e){v.show&&(y=1,w.length=0,d.aniIndex++,e.touches.length&&Array.prototype.forEach.call(e.touches,function(e){w.push({x:e.pageX,y:e.pageY})}),r._trigger("slidestart")),e.preventDefault(),e.stopPropagation()}).onmove(g,function(e){var t=w[0],n=e.touches[0];if(y&&t&&n){var i=n.pageX,o=n.pageY,a=i-t.x;if(a){var l=parseInt(d.move+a);-l>=s.left&&-l<=s.right&&(d.move=l,r._update())}t.x=i,t.y=o}e.preventDefault(),e.stopPropagation()}).onup(g,function(){y=0,w.length=0,r._reset()}).ontap(g,function(){r._trigger("click")}),r._initItems(),r}},{key:"_preloadImage",value:function(e,t){return n.isArray(e)||(e=[e]),n.isFunction(t)||(t=null),n.isArray(e)&&e.forEach(function(e,n){if(e&&e.src&&!e.width){var i=new Image;i.onload=i.onerror=i.onabort=function(r){r&&"load"==r.type?(e.width=i.width,e.height=i.height):e.src=null,i=null,t&&t(e,n)},i.src=e.src}else t&&t(e,n)}),self}},{key:"_initItems",value:function(){var e=this,t=e.__,i=t.opts,r=t.view,o=t.items,a=t.transform,s=i.list.length,l=i.index>0&&i.index<s?parseInt(i.index):0,u=function(t,a){var s=o[t],l=i.list[a]||{};s.index!==l.index&&(s.index=l.index,l.src?s.img.src=l.src:s.img.removeAttribute("src"),e._preloadImage(l,function(e){var t=1,i=0,o=0;if(e.width){var a=r.width/e.width,l=r.height/e.height;a<l?(t=a,o=(e.height-r.height/t)/2):(t=l,i=(e.width-r.width/t)/2)}s.x=i=parseInt(i),s.y=o=parseInt(o),s.scale=t,n.transformOrigin(s.img,i,o),n.transform(s.img,-i,-o,t)}))};return u("prev",(l-1+s)%s),u("cur",l),u("next",(l+1)%s),a.move=0,e._update()._updateViewScroll(),e}},{key:"_update",value:function(e){var t=this,i=t.__,r=i.view,o=i.items,a=i.transform,s=r.width+r.margin,l=a.move,u=function(e,t){var i=e.left;i!=t&&(e.left=t,(i>=-s&&i<=s||t>=-s&&t<=s)&&n.transform(e.div,t))};return u(o.prev,l-s),u(o.cur,l),u(o.next,l+s),t}},{key:"_updateViewScroll",value:function(){var e=this,t=e.__,n=t.opts,i=t.view,r=i.width+i.margin;return i.left=n.loop||0!=n.index?-r:0,i.right=n.loop||n.index!=n.list.length-1?r:0,e}},{key:"_reset",value:function(e){var t=this,i=t.__,r=i.opts,o=i.view,a=i.items,s=i.transform,l=null;s.aniIndex++;var u=s.aniIndex;if(null!=e&&(-e>=o.left||-e<=o.right)?t._trigger("slidestart"):e=s.move,Math.abs(e)>o.padding){var c=o.width+o.margin;e>0?(e=c,l=-1):(e=-c,l=1)}else e=0;return n.transition({from:s.move,to:e,time:s.resetDelay},function(e,n){var i=u==s.aniIndex;return i&&(s.move=e,t._update()),i},function(){if(l){o.width,o.margin;var e=function(e,t,n){a.prev=e,a.cur=t,a.next=n,r.index=t.index};1==l?e(a.cur,a.next,a.prev):-1==l&&e(a.next,a.prev,a.cur),s.move=0,t._initItems()}t._trigger("slideend"),l&&t._trigger("slidechange")}),t}},{key:"show",value:function(){var e=this,t=e.__,n=t.state;t.iframe;return n.show||(e._initDlg(),n.show=1,e._trigger("show")),e}},{key:"hide",value:function(e){var n=this,i=n.__,r=i.state,o=i.iframe;return r.show&&(t.body.removeChild(o),r.show=0,n._trigger("hide",e||"hide")),n}},{key:"prev",value:function(){var e=this,t=e.__,n=(t.opts,t.state),i=t.view;return n.show&&e._reset(i.width),e}},{key:"next",value:function(){var e=this,t=e.__,n=(t.opts,t.state),i=t.view;return n.show&&e._reset(-i.width),e}},{key:"list",get:function(){return this.__.opts.list.map(function(e){return e.src})},set:function(e){var t=this,i=t.__.opts;n.isArray(e)&&t.list.join(",")!=e.join(",")&&(i.list=e,i.index=0,t._initData(i)._reset())}},{key:"index",get:function(){return this.__.opts.index},set:function(e){var t=this,n=t.__.opts;(e=parseInt(e))>=0&&e<=n.list.length-1&&(n.index=e,t._initItems())}},{key:"loop",get:function(){return this.__.opts.loop},set:function(e){var t=this,n=t.__.opts;e!=n.loop&&(n.loop=e,t._updateViewScroll())}},{key:"version",get:function(){return this.__.version}}]),i}();i.utils=n,e.CIV=e.cImageViewer=i}(window,document),function(e){e.ANIMATION={TRANSLATE:"translate"},e.defaultOptions={list:null,index:0,loop:!0,preload:!1,save:!1,saveBtn:"保存图片",background:"#000",animation:e.ANIMATION.TRANSLATE,zIndex:99999}}(window.CIV),function(e,t,n){var i=n.utils,r=function(r){function o(e){_classCallCheck(this,o);var t=_possibleConstructorReturn(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e));return t.__.version.build="CIV_QM",t}return _inherits(o,n),_createClass(o,[{key:"_showHandler",value:function(){var e=this,t=e.__,n=t.opts,r=t.iframe.contentDocument,o=r.createElement("div");o.innerHTML='<style>\n                .civ-btn{position:absolute;padding:0 1em;bottom:50px;width:140px;line-height:40px;left:50%;margin-left:-70px;background:rgba(0,0,0,.5);color:#fff;border:2px solid #fff;border-radius:20px;overflow:hidden;text-overflow:ellipsis;}\n                </style>\n                <button class="civ-btn js_save" style="'+(n.save?"":"display:none")+'">'+n.saveBtn+"</button>",r.body.appendChild(o),t.btn=i.$(".js_save",r),i.ontap(t.btn,function(){e._save()})}},{key:"_save",value:function(){var n=this,r=n.__,o=(r.opts,r.items.cur);if(o.img){var a=o.img.src;if(a){var s=function(e){var t={img:a,index:o.index};e&&0!=e.code&&(t.error=e),n._trigger("save",t)};if(e.M&&M.client){if(i.isFunction(M.client.open))return M.client.open("media","saveImage",{content:a},s),n;if(i.isFunction(M.client.invoke))return M.client.invoke("media","saveImage",{content:a},s),n}var l=t.createElement("a");l.href=a,l.target="_blank";var u=a.split(/[#?]/);u=u[0].match(/[\w.]+$/),l.download=u&&u[0]||"save.jpg",l.click(),s()}}return n}},{key:"save",get:function(){return this.__.opts.save},set:function(e){var t=this.__,n=t.opts;n.save=!!e,t.btn.style.display=n.save?"block":"none"}},{key:"saveBtn",get:function(){return this.__.opts.saveBtn},set:function(e){var t=this.__,n=t.opts;(e=""+e)!=n.saveBtn&&(n.saveBtn=e,t.btn.innerText=e)}}]),o}();r.defaultOptions.save=!1,r.defaultOptions.saveBtn="保存图片",e.CIV=e.cImageViewer=r}(window,document,window.CIV);