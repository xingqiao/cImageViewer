'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview 图片浏览器
 * @author ctchen
 * @version 1.0.0
 *
 * 命名规范
 *  以两个下划线开头的为 private，不允许外部访问
 *  一个下划线开头的为 protected，只能在内部或者插件中访问
 *  其他为 public
 */

(function (win, doc) {
    var body = doc.body;

    //#region requestAnimationFrame & cancelAnimationFrame

    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    })();

    //#endregion

    //#region 工具方法库

    var utils = {
        touch: "ontouchend" in doc ? true : false,
        $: function $(s, p, fun) {
            var func = fun || "querySelector";
            return p && p[func] ? p[func](s) : doc[func](s);
        },
        $$: function $$(s, p) {
            return this.$(s, p, "querySelectorAll");
        },
        /**
         * HTML编码
         */
        encodeHTML: function encodeHTML(s, br) {
            return (s == null ? "" : "" + s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\r?\n/g, br || " ");
        },
        /**
         * 设置transition
         */
        transition: function transition(elem, style) {
            elem.style.transition = elem.style.webkitTransition = style;
        },
        /**
         * 设置transform-origin
         */
        transformOrigin: function transformOrigin(elem, x, y) {
            x = x == null ? 0 : x;
            y = y == null ? 0 : y;
            elem.style.transformOrigin = elem.style.webkitTransformOrigin = x + "px " + y + "px";
        },
        /**
         * 设置transform
         */
        transform: function transform(elem, x, y, scale) {
            x = x == null ? 0 : x;
            y = y == null ? 0 : y;
            elem.style.transform = elem.style.webkitTransform = "translate3d(" + x + "px," + y + "px,0)" + (scale > 0 ? " scale(" + scale + ")" : "");
        },
        /**
         * 兼容 touchstart 和 mousedown
         */
        ondown: function ondown(elem, callback) {
            if (utils.touch) {
                elem.addEventListener("touchstart", callback);
            } else {
                elem.addEventListener("mousedown", function (e) {
                    e.touches = [{
                        pageX: e.pageX,
                        pageY: e.pageY
                    }];
                    callback.call(this, e);
                });
            }
            return this;
        },
        /**
         * 兼容 touchmove 和 mousemove
         */
        onmove: function onmove(elem, callback) {
            if (utils.touch) {
                elem.addEventListener("touchmove", callback);
            } else {
                elem.addEventListener("mousemove", function (e) {
                    e.touches = [{
                        pageX: e.pageX,
                        pageY: e.pageY
                    }];
                    callback.call(this, e);
                });
            }
            return this;
        },
        /**
         * 兼容 touchend 和 mouseup
         */
        onup: function onup(elem, callback) {
            if (utils.touch) {
                elem.addEventListener("touchend", callback);
                elem.addEventListener("touchcancel", callback);
            } else {
                elem.addEventListener("mouseup", callback);
            }
            return this;
        },
        /**
         * tap点击
         */
        ontap: function ontap(elem, callback) {
            if (utils.touch) {
                var x1 = null,
                    y1 = null,
                    x2 = null,
                    y2 = null;
                elem.addEventListener("touchstart", function (e) {
                    if (e.touches.length == 1) {
                        x1 = x2 = e.touches[0].pageX;
                        y1 = y2 = e.touches[0].pageY;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                });
                elem.addEventListener("touchmove", function (e) {
                    if (x1 != null) {
                        x2 = e.touches[0].pageX;
                        y2 = e.touches[0].pageY;
                    }
                });
                elem.addEventListener("touchend", function (e) {
                    if (Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) < 400) {
                        callback.call(elem, e);
                    }
                    x1 = null;
                });
            } else {
                elem.addEventListener("click", callback);
            }
            return this;
        },
        /**
         * 扩展对象
         */
        extend: function extend() {
            var options = void 0,
                name = void 0,
                src = void 0,
                copy = void 0,
                copyIsArray = void 0,
                clone = void 0,
                args = arguments,
                target = args[0] || {},
                i = 1,
                length = args.length,
                deep = false;

            if (utils.isBoolean(target)) {
                deep = target;
                target = args[i] || {};
                i++;
            }

            if (i === length) {
                target = {};
                i--;
            } else if (!utils.isObject(target) && !utils.isFunction(target)) {
                target = {};
            }

            for (; i < length; i++) {
                if ((options = args[i]) != null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue;
                        }
                        if (deep && copy && ((copyIsArray = Array.isArray(copy)) || utils.isObject(copy))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && Array.isArray(src) ? src : [];
                            } else {
                                clone = src && utils.isObject(src) ? src : {};
                            }
                            target[name] = utils.extend(deep, clone, copy);
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            return target;
        },
        /**
         * 切换标签显示状态
         */
        toggle: function toggle(elem, show) {
            elem.style.display = show ? "" : "none";
        }
    };
    Array.prototype.forEach.call(["Object", "Function", "String", "Number", "Array", "Boolean", { type: "Img", key: "HTMLImageElement" }], function (item) {
        utils["is" + (item.type || item)] = function (obj) {
            return Object.prototype.toString.call(obj) === "[object " + (item.key || item) + "]";
        };
    });

    //#endregion

    /**
     * 播放器核心类
     * @class CIV
     * @example new CIV({shape: CIV.SHAPE.SQUARE})
     */

    var CIV = function () {

        //#region 静态方法

        /**
         * 构造函数
         * @constructor
         * @param {Object} opts 初始化参数
         * @param {Array} opts.list 图片列表
         * @param {Number} opts.index 查看的图片序号
         * @param {Boolean} opts.loop 是否循环查看，默认为 true
         * @param {Boolean} opts.preload 是否预加载图片，默认为 false
         * @param {String} opts.background 弹窗背景色，默认为黑色 "#000"
         * @param {String} opts.animation 切换动画，默认是平移 "translate"，值在 CIV.ANIMATION 中定义
         * @param {String} opts.zIndex 浮层层级，默认是 99999
         */
        function CIV(opts) {
            _classCallCheck(this, CIV);

            this._initData(opts);
        }

        //#endregion

        //#region private

        /**
         * 事件在打开弹窗时触发
         * @private
         */


        _createClass(CIV, [{
            key: '__showHandler',
            value: function __showHandler() {}

            /**
             * 事件在关闭弹窗时触发
             * @private
             */

        }, {
            key: '__hideHandler',
            value: function __hideHandler() {}

            /**
             * 事件在开始滑动时触发
             * @private
             */

        }, {
            key: '__slidestartHandler',
            value: function __slidestartHandler() {}

            /**
             * 事件在滑动停止时触发
             * @private
             */

        }, {
            key: '__slideendHandler',
            value: function __slideendHandler() {}

            /**
             * 事件在页面切换时触发
             * @private
             */

        }, {
            key: '__slidechangeHandler',
            value: function __slidechangeHandler() {}

            /**
             * 事件在点击图片时触发
             * @private
             */

        }, {
            key: '__clickHandler',
            value: function __clickHandler() {}

            /**
             * 事件在保存图片时触发
             * @private
             */

        }, {
            key: '__downloadHandler',
            value: function __downloadHandler() {}

            //#endregion

            //#region protected

            /**
             * 派发事件
             * @param {String} evt 事件名
             * @param {Object} args 跟随事件传递的信息
             * @protected
             */

        }, {
            key: '_trigger',
            value: function _trigger(evt, args) {
                var self = this;
                var __ = self.__;
                var opts = __.opts;

                if (evt && utils.isString(evt)) {
                    var handlers = [self["__" + evt + "Handler"], // 内部定义的事件处理逻辑
                    self["_" + evt + "Handler"], // 继承的事件处理逻辑
                    opts["on" + evt.toLowerCase()] // 外部绑定的事件
                    ];

                    handlers.forEach(function (handler) {
                        if (utils.isFunction(handler)) {
                            handler.call(self, args);
                        }
                    });
                }
                return self;
            }

            /**
             * 设初始化数据
             * @param {Object} opts 初始化参数
             * @protected
             */

        }, {
            key: '_initData',
            value: function _initData(opts) {
                var self = this;

                var isShow = 0;
                if (self.__ && self.__.state && self.__.state.show) {
                    isShow = 1;
                    self.hide();
                }

                // 用来放一些私有属性
                var __ = {
                    opts: utils.extend({}, CIV.defaultOptions), // 初始化参数
                    state: { // 状态
                        show: 0, // 展示弹窗
                        ani: 0 // 是否处于动画状态
                    },
                    elem: { // 缓存dom节点
                        iframe: null, // 浮层dom节点
                        prev: null, // 向左箭头
                        next: null, // 向右箭头
                        num: null, // 图片序号
                        curNum: null, // 当前图片序号
                        allNum: null, // 总图片数
                        desc: null // 图片描述
                    },
                    content: "", // 浮层html
                    items: {
                        prev: {},
                        cur: {},
                        next: {}
                    },
                    view: { // 操作区
                        margin: 10, // 间隔大小
                        padding: 50, // 位移超过该比例时进行切换
                        left: 0, // 当前可滑动左边界
                        right: 0, // 当前可滑动右边界
                        width: 0,
                        height: 0
                    },
                    transform: {
                        duration: 250, // 复位动画时间
                        move: 0 // 切换位移
                    },
                    version: {
                        build: "CIV",
                        version: "1.0.0"
                    }
                };
                self.__ = __;

                // 初始化参数
                __.opts.list = [];
                if (utils.isObject(opts)) {
                    for (var key in opts) {
                        if (/^on\w/.test(key) && utils.isFunction(opts[key])) {
                            __.opts[key.toLowerCase()] = opts[key];
                        } else if (/^list$/i.test(key)) {
                            if (utils.isArray(opts[key])) {
                                (function () {
                                    var src = void 0,
                                        desc = void 0;
                                    opts[key].forEach(function (item, index) {
                                        if (utils.isImg(item)) {
                                            src = item.src;
                                            desc = item.getAttribute("data-civ-desc");
                                        } else {
                                            src = item.src || item;
                                            desc = item.desc;
                                        }
                                        __.opts.list.push({
                                            index: index,
                                            desc: desc ? utils.encodeHTML(desc) : "",
                                            src: src,
                                            left: NaN,
                                            x: 0,
                                            y: 0,
                                            scale: 1
                                        });
                                    });
                                })();
                            }
                        } else if (/^index$/i.test(key)) {
                            __.opts.index = parseInt(opts[key]);
                        } else {
                            __.opts[key] = opts[key];
                        }
                    }
                }
                if (!(__.opts.index >= 0 && __.opts.index < __.opts.list.length)) {
                    __.opts.index = 0;
                }

                // 预加载
                if (__.opts.preload) {
                    self._preloadImage(__.opts.list);
                }

                // 重置裁剪弹窗状态
                if (isShow) {
                    self.show();
                }

                return self;
            }

            /**
             * 初始化弹窗
             * @protected
             */

        }, {
            key: '_initDlg',
            value: function _initDlg() {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    view = __.view,
                    elem = __.elem,
                    items = __.items,
                    content = __.content,
                    transform = __.transform,
                    state = __.state;
                var iframe = elem.iframe;

                // 初始化iframe

                if (!iframe) {
                    // 裁剪弹窗
                    iframe = doc.createElement("iframe");
                    iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:0;z-index:" + (isNaN(opts.zIndex) ? CIV.defaultOptions.zIndex : opts.zIndex);
                    content = '<style>\n                    *{margin:0;padding:0;border:0}\n                    body{background-color:#000;font:16px/1.5 sans-serif}\n                    body{background-color:' + opts.background + '}\n                    a,a:hover{text-decoration:none}\n                    .civ,.civ-cont,.civ-item,.civ-item>div{position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden}\n                    .civ-ft{position:absolute;right:15px;bottom:20px;left:15px;z-index:10;display:-webkit-box;-webkit-box-align:center;overflow:hidden;font-size:14px;color:rgba(255,255,255,.6);}     \n                    .civ-page__cur{font-size:20px;font-weight:normal;color:#fff;}\n                    .civ-page__line{font-size:12px;font-style:normal;}\n                    .civ-tit{-webkit-box-flex:1;margin:2px 0 0 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}\n                    .civ-arrow{position:absolute;top:50%;width:40px;height:40px;margin-top:-20px;color:#fff;}\n                    .civ-arrow::before,\n                    .civ-arrow::after{content:"";position:absolute;border-radius:3px;background:currentColor;}\n                    .civ-arrow::before{width:3px;height:32px;}\n                    .civ-arrow::after{width:32px;height:3px;}\n                    .civ-arrow--left{left:25px;-webkit-transform:rotate(-45deg);}\n                    .civ-arrow--right{right:25px;-webkit-transform:rotate(135deg);}\n                    </style>\n                    <div class="civ js_civ">\n                        <div class="civ-cont js_civ_list">\n                            <div class="civ-item js_civ_item prev"><div><img></div></div>\n                            <div class="civ-item js_civ_item cur"><div><img></div></div>\n                            <div class="civ-item js_civ_item next"><div><img></div></div>\n                        </div>\n                        <div class="civ-ft">\n                            <div class="civ-page js_civ_num">\n                                <strong class="civ-page__cur js_civ_num_cur"></strong> <i class="civ-page__line">\u2044</i> <span class="civ-page__all js_civ_num_all"></span>\n                            </div>\n                            <h6 class="civ-tit js_civ_desc"></h6>\n                        </div>\n                        <a href="javascript:;" class="civ-arrow civ-arrow--left js_civ_prev"></a>\n                        <a href="javascript:;" class="civ-arrow civ-arrow--right js_civ_next"></a>\n                    </div>';
                    elem.iframe = iframe;
                    __.content = content;
                }
                doc.body.appendChild(iframe);
                var iDoc = iframe.contentDocument;
                iDoc.write(content);
                iDoc.close();

                // 展示序号及简介
                elem.num = utils.$(".js_civ_num", iDoc);
                elem.curNum = utils.$(".js_civ_num_cur", iDoc);
                elem.allNum = utils.$(".js_civ_num_all", iDoc);
                elem.desc = utils.$(".js_civ_desc", iDoc);
                elem.allNum.innerHTML = opts.list.length;
                utils.toggle(elem.num, !!opts.orderNumber);

                // 切换按钮
                elem.prev = utils.$(".js_civ_prev", iDoc);
                elem.next = utils.$(".js_civ_next", iDoc);

                // 获取弹窗大小
                var width = parseInt(win.innerWidth);
                var height = parseInt(win.innerHeight);
                view.width = width;
                view.height = height;
                // view.padding = parseInt(width / 5);

                // 获取items
                for (var key in items) {
                    var item = items[key] = {};
                    item.wrap = utils.$(".js_civ_item." + key, iDoc);
                    item.div = utils.$("div", item.wrap);
                    item.img = utils.$("img", item.wrap);
                }

                // 设置缩放
                var _setZoom = function _setZoom(x, y, scale) {
                    var item = items.cur;
                    var zoom = item.zoom;

                    // 缩放后的大小
                    var _width = width * scale;
                    var _height = height * scale;
                    var mx = (_width - width) / scale;
                    var my = (_height - height) / scale;

                    // 尝试移动覆盖整个窗口
                    x = Math.min(Math.max(x, 0), mx);
                    y = Math.min(Math.max(y, 0), my);

                    // 判断是否可以覆盖
                    if (scale <= 4 && x >= 0 && x <= mx && y >= 0 && y <= my) {
                        zoom.width = _width;
                        zoom.height = _height;
                        zoom.x = x;
                        zoom.y = y;
                        zoom.scale = scale;
                        utils.transformOrigin(item.div, x, y);
                        utils.transform(item.div, -x, -y, scale);
                    }
                };

                var oList = utils.$(".js_civ_list", iDoc);
                var touches = [];
                var needReset = 0;
                utils
                // 平移及缩放
                .ondown(oList, function (e) {
                    if (state.show) {
                        touches.length = 0;
                        if (e.touches.length) {
                            Array.prototype.forEach.call(e.touches, function (point) {
                                touches.push({
                                    x: point.pageX,
                                    y: point.pageY
                                });
                            });
                        }
                        self._trigger("slidestart");
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }).onmove(oList, function (e) {
                    var touche = e.touches[0];
                    if (touche) {
                        var x = void 0,
                            y = void 0;
                        var zoom = items.cur.zoom;
                        var scale = zoom.scale;
                        var x1 = touche.pageX;
                        var y1 = touche.pageY;

                        if (touches.length == 2 && e.touches.length == 2) {
                            // 缩放
                            var x2 = e.touches[1].pageX;
                            var y2 = e.touches[1].pageY;

                            var cx = (touches[0].x + touches[1].x) / 2;
                            var cy = (touches[0].y + touches[1].y) / 2;

                            // 双指距离改变量
                            var l1 = Math.sqrt(Math.pow(touches[1].x - touches[0].x, 2) + Math.pow(touches[1].y - touches[0].y, 2));
                            var l2 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                            var sl = l2 / l1;

                            // 将绕 cx,cy 缩放转换成绕可视区域左上角缩放
                            scale *= sl;
                            var ds = (sl - 1) / scale;
                            x = zoom.x + cx * ds;
                            y = zoom.y + cy * ds;

                            _setZoom(x, y, scale);

                            touches[0].x = x1;
                            touches[0].y = y1;
                            touches[1].x = x2;
                            touches[1].y = y2;
                        } else if (touches.length && opts.list.length > 1) {
                            // 平移
                            var dx = x1 - touches[0].x;
                            var dy = y1 - touches[0].y;
                            x = zoom.x - dx / scale;
                            // 判断是切换还是图片查看
                            if (x > 0 && x < (zoom.width - width) / scale) {
                                y = zoom.y - dy / scale;
                                _setZoom(x, y, scale);
                            } else {
                                if (dx) {
                                    var move = parseInt(transform.move + dx);
                                    if (-move >= view.left && -move <= view.right) {
                                        transform.move = move;
                                        self._update();
                                        needReset = 1;
                                    }
                                }
                            }
                            touches[0].x = x1;
                            touches[0].y = y1;
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }).onup(oList, function () {
                    touches.length = 0;
                    if (needReset) {
                        self._reset();
                    }
                }).ontap(oList, function () {
                    self._trigger("click");
                })
                // 左右切换
                .ontap(elem.prev, function () {
                    self.prev();
                }).ontap(elem.next, function () {
                    self.next();
                });
                // 滚轮缩放
                oList.addEventListener("mousewheel", function (e) {
                    if (state.show) {
                        var zoom = items.cur.zoom;
                        var scale = zoom.scale * (e.deltaY > 0 ? 0.9 : 1 / 0.9);
                        var cx = e.clientX;
                        var cy = e.clientY;
                        var ds = scale - zoom.scale;
                        var x = zoom.x + cx * ds / scale;
                        var y = zoom.y + cy * ds / scale;
                        _setZoom(x, y, scale);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                });

                self._initItems();
                return self;
            }

            /**
             * 预加载图片列表
             * @param {Array} list 图片列表
             * @param {Function} callback 回掉函数，没加载完一个都会触发
             * @protected
             */

        }, {
            key: '_preloadImage',
            value: function _preloadImage(list, callback) {
                if (!utils.isArray(list)) {
                    list = [list];
                }
                if (!utils.isFunction(callback)) {
                    callback = null;
                }
                if (utils.isArray(list)) {
                    list.forEach(function (item, index) {
                        if (item && item.src && !item.width) {
                            var img = new Image();
                            img.onload = img.onerror = img.onabort = function (e) {
                                if (e && e.type == "load") {
                                    item.width = img.width;
                                    item.height = img.height;
                                } else {
                                    item.src = null;
                                }
                                img = null;
                                callback && callback(item, index);
                            };
                            img.src = item.src;
                        } else {
                            callback && callback(item, index);
                        }
                    });
                }
                return self;
            }

            /**
             * 初始化图片展示
             * @protected
             */

        }, {
            key: '_initItems',
            value: function _initItems() {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    elem = __.elem,
                    view = __.view,
                    items = __.items,
                    transform = __.transform;

                // 设置图片

                var length = opts.list.length;
                var index = opts.index > 0 && opts.index < length ? parseInt(opts.index) : 0;
                var setItem = function setItem(key, no) {
                    var item = items[key];
                    var data = opts.list[no] || {};
                    item.data = data;
                    if (item.index !== data.index) {
                        item.index = data.index;
                        // 加载图片
                        if (data.src) {
                            item.img.src = data.src;
                        } else {
                            item.img.removeAttribute("src");
                        }
                        self._preloadImage(data, function (img) {
                            // 重置缩放
                            var scale = 1;
                            var x = 0;
                            var y = 0;
                            if (img.width) {
                                var sw = view.width / img.width;
                                var sh = view.height / img.height;
                                if (sw < sh) {
                                    scale = sw;
                                    y = (img.height - view.height / scale) / 2;
                                } else {
                                    scale = sh;
                                    x = (img.width - view.width / scale) / 2;
                                }
                            }
                            item.x = x = parseInt(x);
                            item.y = y = parseInt(y);
                            item.scale = scale;
                            item.zoom = {
                                width: 0,
                                height: 0,
                                x: 0,
                                y: 0,
                                scale: 1
                            };
                            utils.transformOrigin(item.img, x, y);
                            utils.transform(item.img, -x, -y, scale);
                            utils.transformOrigin(item.div, 0, 0);
                            utils.transform(item.div, 0, 0, 1);
                        });
                    }
                };
                setItem("prev", (index - 1 + length) % length);
                setItem("cur", index);
                setItem("next", (index + 1) % length);

                // 序号、简介及切换箭头
                elem.curNum.innerHTML = index + 1;
                elem.desc.innerHTML = items.cur.data.desc || "";
                self._setArrow();

                // 复位
                transform.move = 0;
                self._update()._updateViewScroll();

                return self;
            }

            /**
             * 更新图片位置
             * @param {Boolean} ani 是否采用动画过渡
             * @protected
             */

        }, {
            key: '_update',
            value: function _update(ani, callback) {
                var self = this;
                var __ = self.__;
                var view = __.view,
                    items = __.items,
                    transform = __.transform;

                var size = view.width + view.margin;
                var x = transform.move;

                if (!utils.isFunction(callback)) {
                    callback = null;
                }

                var deal = function deal(values, act) {
                    if (!utils.isArray(values)) {
                        values = [];
                    }
                    act(items.prev, values[0]);
                    act(items.cur, values[1]);
                    act(items.next, values[2]);
                };

                // 判断是否需要移动
                deal([x - size, x, x + size], function (item, value) {
                    item._needMove = 0;
                    var left = item.left;
                    if (left != value) {
                        item.left = value;
                        if (left >= -size && left <= size || value >= -size && value <= size) {
                            item._needMove = 1;
                        }
                    }
                });

                // 设置动画
                var setAni = function setAni(enable) {
                    var style = enable ? "all " + transform.duration + "ms ease" : "";
                    deal(null, function (item, value) {
                        if (item._needMove) {
                            utils.transition(item.wrap, style);
                        }
                    });
                };

                // 移动
                var move = function move() {
                    deal(null, function (item, value) {
                        if (item._needMove) {
                            utils.transform(item.wrap, item.left);
                        }
                    });
                };

                if (ani) {
                    setAni(true);
                    setTimeout(move, 0);
                    setTimeout(function () {
                        setAni(false);
                        callback && callback();
                    }, transform.duration);
                } else {
                    move();
                    callback && callback();
                }

                return self;
            }

            /**
             * 更新滚动边界
             * @protected
             */

        }, {
            key: '_updateViewScroll',
            value: function _updateViewScroll() {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    view = __.view;

                var size = view.width + view.margin;
                view.left = !opts.loop && opts.index == 0 ? 0 : -size;
                view.right = !opts.loop && opts.index == opts.list.length - 1 ? 0 : size;
                return self;
            }

            /**
             * 图片复位
             * @param {Number} move 当前位移
             * @protected
             */

        }, {
            key: '_reset',
            value: function _reset(move) {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    state = __.state,
                    view = __.view,
                    items = __.items,
                    transform = __.transform;

                var act = null;

                if (!state.ani) {
                    state.ani = 1;

                    if (move != null && (-move >= view.left || -move <= view.right)) {
                        self._trigger("slidestart");
                    } else {
                        move = transform.move;
                    }
                    if (Math.abs(move) > view.padding) {
                        var size = view.width + view.margin;
                        if (move > 0) {
                            // 上一页
                            move = size;
                            act = -1;
                        } else {
                            // 下一页
                            move = -size;
                            act = 1;
                        }
                    } else {
                        // 复位
                        move = 0;
                    }

                    // 移动
                    transform.move = move;
                    self._update(true, function () {
                        // 交换位置
                        if (act) {
                            var _size = view.width + view.margin;
                            var swap = function swap(prev, cur, next) {
                                items.prev = prev;
                                items.cur = cur;
                                items.next = next;
                                opts.index = cur.index;
                            };
                            if (act == 1) {
                                swap(items.cur, items.next, items.prev);
                            } else if (act == -1) {
                                swap(items.next, items.prev, items.cur);
                            }
                            transform.move = 0;
                            self._initItems();
                        }
                        setTimeout(function () {
                            state.ani = 0;
                        }, 10);
                        self._trigger("slideend");
                        if (act) {
                            self._trigger("slidechange");
                        }
                    });
                }

                return self;
            }

            /**
             * 更新切换箭头展示状态
             */

        }, {
            key: '_setArrow',
            value: function _setArrow() {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    elem = __.elem;
                var prev = elem.prev,
                    next = elem.next;


                var length = opts.list.length;
                utils.toggle(elem.prev, length > 1 && (opts.loop || opts.index > 0));
                utils.toggle(elem.next, length > 1 && (opts.loop || opts.index < length - 1));

                return self;
            }

            //#endregion

            //#region public

            /**
             * 打开裁剪弹窗
             * @public
             */

        }, {
            key: 'show',
            value: function show() {
                var self = this;
                var __ = self.__;
                var state = __.state;


                if (!state.show) {
                    // 初始化弹窗
                    self._initDlg();

                    // 标记弹窗已打开
                    state.show = 1;
                    self._trigger("show");
                }

                return self;
            }

            /**
             * 关闭裁剪弹窗
             * @param {String} type 触发关闭操作的来源，会透传给hide事件
             * @public
             */

        }, {
            key: 'hide',
            value: function hide(type) {
                var self = this;
                var __ = self.__;
                var state = __.state,
                    elem = __.elem;
                var iframe = elem.iframe;


                if (state.show) {
                    doc.body.removeChild(iframe);

                    // 标记弹窗已关闭
                    state.show = 0;
                    self._trigger("hide", type || "hide");
                }
                return self;
            }

            /**
             * 查看上一页
             * @public
             */

        }, {
            key: 'prev',
            value: function prev() {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    state = __.state,
                    view = __.view;


                var length = opts.list.length;
                if (state.show && length > 1 && (opts.loop || opts.index > 0)) {
                    self._reset(view.width);
                }
                return self;
            }

            /**
             * 查看下一页
             * @public
             */

        }, {
            key: 'next',
            value: function next() {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    state = __.state,
                    view = __.view;


                var length = opts.list.length;
                if (state.show && length > 1 && (opts.loop || opts.index < length - 1)) {
                    self._reset(-view.width);
                }
                return self;
            }

            /**
             * 获取或设置图片列表
             */

        }, {
            key: 'list',
            get: function get() {
                var self = this;
                var __ = self.__;
                var opts = __.opts;

                var _list = opts.list.map(function (img) {
                    return img.src;
                });
                return _list;
            },
            set: function set(value) {
                var self = this;
                var __ = self.__;
                var opts = __.opts;

                if (utils.isArray(value)) {
                    var curList = self.list;
                    if (curList.join(",") != value.join(",")) {
                        opts.list = value;
                        opts.index = 0;
                        self._initData(opts)._reset();
                    }
                }
            }

            /**
             * 返回当前的图片序号
             */

        }, {
            key: 'index',
            get: function get() {
                return this.__.opts.index;
            },
            set: function set(value) {
                var self = this;
                var __ = self.__;
                var opts = __.opts;

                value = parseInt(value);
                if (value >= 0 && value <= opts.list.length - 1) {
                    opts.index = value;
                    self._initItems();
                }
            }

            /**
             * 获取或设置循环查看
             */

        }, {
            key: 'loop',
            get: function get() {
                return this.__.opts.loop;
            },
            set: function set(value) {
                var self = this;
                var __ = self.__;
                var opts = __.opts;

                value == !!value;
                if (value != opts.loop) {
                    opts.loop = value;
                    self._updateViewScroll();
                }
            }

            /**
             * 返回版本号
             */

        }, {
            key: 'version',
            get: function get() {
                return this.__.version;
            }

            //#endregion

        }]);

        return CIV;
    }();

    CIV.utils = utils;

    win.CIV = win.cImageViewer = CIV;
})(window, document);
/**
 * @fileOverview 图片浏览器 - 常量定义
 * @author ctchen
 * @version 1.0.0
 */

(function (CIV) {
    var _CIV$defaultOptions;

    /**
     * 切换动画类型
     */
    CIV.ANIMATION = {
        /**
         * 平移
         */
        TRANSLATE: "translate"
    };

    /**
     * 默认初始化参数
     */
    CIV.defaultOptions = (_CIV$defaultOptions = {
        /**
         * 图片列表，参数可以是图片链接或者img标签
         */
        list: null,

        /**
         * 查看的图片序号
         */
        index: 0,

        /**
         * 是否循环查看，默认为 true
         */
        loop: true,

        /**
         * 是否展示图片序号，默认为 true
         */
        orderNumber: true,

        /**
         * 是否展示左右切换箭头，默认为 true
         */
        arrow: true,

        /**
         * 是否预加载图片，默认为 false
         */
        preload: false,

        /**
         * 保存按钮文本，默认为 "保存图片"
         */
        saveBtn: "保存图片",

        /**
         * 是否展示保存按钮，默认为 false
         */
        save: false

    }, _defineProperty(_CIV$defaultOptions, 'saveBtn', "保存图片"), _defineProperty(_CIV$defaultOptions, 'background', "#000"), _defineProperty(_CIV$defaultOptions, 'animation', CIV.ANIMATION.TRANSLATE), _defineProperty(_CIV$defaultOptions, 'zIndex', 99999), _CIV$defaultOptions);
})(window.CIV);
/**
 * @fileOverview 图片浏览器 - QQ音乐下载定制封装
 * @author ctchen
 * @version 1.0.0
 */

(function (win, doc, CIV_CORE) {

    var utils = CIV_CORE.utils;

    var CIV = function (_CIV_CORE) {
        _inherits(CIV, _CIV_CORE);

        /**
         * 构造函数
         * @constructor
         * @param {Boolean} opts.save 是否展示保存按钮，默认为 false
         * @param {String} opts.saveBtn 保存按钮文本，默认为 "保存图片"
         */
        function CIV(opts) {
            _classCallCheck(this, CIV);

            var _this = _possibleConstructorReturn(this, (CIV.__proto__ || Object.getPrototypeOf(CIV)).call(this, opts));

            var __ = _this.__;

            __.elem.save = null; // 保存按钮dom节点
            __.version.build = "CIV_QM";
            return _this;
        }

        _createClass(CIV, [{
            key: '_showHandler',
            value: function _showHandler() {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    elem = __.elem;
                var iframe = elem.iframe;


                var iDoc = iframe.contentDocument;
                var div = iDoc.createElement("div");
                div.innerHTML = '<style>\n                .civ-btn{position:absolute;padding:0 1em;bottom:50px;width:140px;line-height:40px;left:50%;margin-left:-70px;background:rgba(0,0,0,.5);color:#fff;border:2px solid #fff;border-radius:20px;overflow:hidden;text-overflow:ellipsis;}\n                </style>\n                <button class="civ-btn js_save" style="' + (opts.save ? "" : "display:none") + '">' + opts.saveBtn + '</button>';
                iDoc.body.appendChild(div);

                elem.save = utils.$(".js_save", iDoc);

                // 保存图片
                utils.ontap(elem.save, function () {
                    self._save();
                });
            }

            /**
             * 保存图片
             * @protected
             */

        }, {
            key: '_save',
            value: function _save() {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    items = __.items;
                var cur = items.cur;


                if (cur.img) {
                    var src = cur.img.src;
                    if (src) {
                        var next = function next(r) {
                            var data = { img: src, index: cur.index };
                            if (r && r.code != 0) {
                                data.error = r;
                            }
                            self._trigger("save", data);
                        };

                        // 调用QQ音乐客户端保存图片
                        if (win.M && M.client) {
                            if (utils.isFunction(M.client.open)) {
                                M.client.open("media", "saveImage", { content: src }, next);
                                return self;
                            } else if (utils.isFunction(M.client.invoke)) {
                                M.client.invoke("media", "saveImage", { content: src }, next);
                                return self;
                            }
                        }

                        // 利用a标签保存
                        var a = doc.createElement("a");
                        a.href = src;
                        a.target = "_blank";
                        var filename = src.split(/[#?]/);
                        filename = filename[0].match(/[\w.]+$/);
                        a.download = filename && filename[0] || "save.jpg";
                        a.click();
                        next();
                    }
                }

                return self;
            }

            /**
             * 获取或设置保存按钮设置
             */

        }, {
            key: 'save',
            get: function get() {
                return this.__.opts.save;
            },
            set: function set(value) {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    elem = __.elem;

                opts.save = !!value;
                elem.btn.style.display = opts.save ? "block" : "none";
            }

            /**
             * 获取或设置保存按钮文本
             */

        }, {
            key: 'saveBtn',
            get: function get() {
                return this.__.opts.saveBtn;
            },
            set: function set(value) {
                var self = this;
                var __ = self.__;
                var opts = __.opts,
                    elem = __.elem;

                value = "" + value;
                if (value != opts.saveBtn) {
                    opts.saveBtn = value;
                    elem.btn.innerText = value;
                }
            }
        }]);

        return CIV;
    }(CIV_CORE);

    CIV.defaultOptions.save = false;
    CIV.defaultOptions.saveBtn = "保存图片";

    win.CIV = win.cImageViewer = CIV;
})(window, document, window.CIV);