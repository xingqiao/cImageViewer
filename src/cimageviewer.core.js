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
    }());

    //#endregion

    //#region 工具方法库

    var utils = {
        touch: "ontouchend" in doc ? true : false,
        $: function (s, p, fun) {
            let func = fun || "querySelector";
            return p && p[func] ? p[func](s) : doc[func](s);
        },
        $$: function (s, p) {
            return this.$(s, p, "querySelectorAll");
        },
        /**
         * HTML编码
         */
        encodeHTML: function (s, br) {
            return (s == null ? "" : "" + s)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/ /g, "&nbsp;")
                .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
                .replace(/\'/g, "&#39;")
                .replace(/\"/g, "&quot;")
                .replace(/\r?\n/g, br || " ");
        },
        /**
         * 设置transition
         */
        transition: function (elem, style) {
            elem.style.transition = elem.style.webkitTransition = style;
        },
        /**
         * 设置transform-origin
         */
        transformOrigin: function (elem, x, y) {
            x = x == null ? 0 : x;
            y = y == null ? 0 : y;
            elem.style.transformOrigin = elem.style.webkitTransformOrigin = x + "px " + y + "px";
        },
        /**
         * 设置transform
         */
        transform: function (elem, x, y, scale) {
            x = x == null ? 0 : x;
            y = y == null ? 0 : y;
            elem.style.transform = elem.style.webkitTransform = "translate3d(" + x + "px," + y + "px,0)" + (scale > 0 ? " scale(" + scale + ")" : "");
        },
        /**
         * 兼容 touchstart 和 mousedown
         */
        ondown: function (elem, callback) {
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
        onmove: function (elem, callback) {
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
        onup: function (elem, callback) {
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
        ontap: function (elem, callback) {
            if (utils.touch) {
                let x1 = null, y1 = null, x2 = null, y2 = null;
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
        extend: function () {
            let options, name, src, copy, copyIsArray, clone,
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
        toggle: function (elem, show) {
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
    class CIV {

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
        constructor(opts) {
            this._initData(opts);
        }

        //#endregion

        //#region private

        /**
         * 事件在打开弹窗时触发
         * @private
         */
        __showHandler() { }

        /**
         * 事件在关闭弹窗时触发
         * @private
         */
        __hideHandler() { }

        /**
         * 事件在开始滑动时触发
         * @private
         */
        __slidestartHandler() { }

        /**
         * 事件在滑动停止时触发
         * @private
         */
        __slideendHandler() { }

        /**
         * 事件在页面切换时触发
         * @private
         */
        __slidechangeHandler() { }

        /**
         * 事件在点击图片时触发
         * @private
         */
        __clickHandler() { }

        /**
         * 事件在保存图片时触发
         * @private
         */
        __downloadHandler() { }

        //#endregion

        //#region protected

        /**
         * 派发事件
         * @param {String} evt 事件名
         * @param {Object} args 跟随事件传递的信息
         * @protected
         */
        _trigger(evt, args) {
            let self = this;
            let __ = self.__;
            let { opts } = __;
            if (evt && utils.isString(evt)) {
                let handlers = [
                    self["__" + evt + "Handler"], // 内部定义的事件处理逻辑
                    self["_" + evt + "Handler"], // 继承的事件处理逻辑
                    opts["on" + evt.toLowerCase()] // 外部绑定的事件
                ];

                handlers.forEach(handler => {
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
        _initData(opts) {
            let self = this;

            let isShow = 0;
            if (self.__ && self.__.state && self.__.state.show) {
                isShow = 1;
                self.hide();
            }

            // 用来放一些私有属性
            let __ = {
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
                for (let key in opts) {
                    if (/^on\w/.test(key) && utils.isFunction(opts[key])) {
                        __.opts[key.toLowerCase()] = opts[key];
                    } else if (/^list$/i.test(key)) {
                        if (utils.isArray(opts[key])) {
                            let src, desc;
                            opts[key].forEach((item, index) => {
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
                            })
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
        _initDlg() {
            let self = this;
            let __ = self.__;
            let { opts, view, elem, items, content, transform, state } = __;
            let { iframe } = elem;

            // 初始化iframe
            if (!iframe) {
                // 裁剪弹窗
                iframe = doc.createElement("iframe");
                iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:0;z-index:" + (isNaN(opts.zIndex) ? CIV.defaultOptions.zIndex : opts.zIndex);
                content = `<style>
                    *{margin:0;padding:0;border:0}
                    body{background-color:#000;font:16px/1.5 sans-serif}
                    body{background-color:${opts.background}}
                    a,a:hover{text-decoration:none}
                    .civ,.civ-cont,.civ-item,.civ-item>div{position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden}
                    .civ-ft{position:absolute;right:15px;bottom:20px;left:15px;z-index:10;display:-webkit-box;-webkit-box-align:center;overflow:hidden;font-size:14px;color:rgba(255,255,255,.6);}     
                    .civ-page__cur{font-size:20px;font-weight:normal;color:#fff;}
                    .civ-page__line{font-size:12px;font-style:normal;}
                    .civ-tit{-webkit-box-flex:1;margin:2px 0 0 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
                    .civ-arrow{position:absolute;top:50%;width:40px;height:40px;margin-top:-20px;color:#fff;}
                    .civ-arrow::before,
                    .civ-arrow::after{content:"";position:absolute;border-radius:3px;background:currentColor;}
                    .civ-arrow::before{width:3px;height:32px;}
                    .civ-arrow::after{width:32px;height:3px;}
                    .civ-arrow--left{left:25px;-webkit-transform:rotate(-45deg);}
                    .civ-arrow--right{right:25px;-webkit-transform:rotate(135deg);}
                    </style>
                    <div class="civ js_civ">
                        <div class="civ-cont js_civ_list">
                            <div class="civ-item js_civ_item prev"><div><img></div></div>
                            <div class="civ-item js_civ_item cur"><div><img></div></div>
                            <div class="civ-item js_civ_item next"><div><img></div></div>
                        </div>
                        <div class="civ-ft">
                            <div class="civ-page js_civ_num">
                                <strong class="civ-page__cur js_civ_num_cur"></strong> <i class="civ-page__line">⁄</i> <span class="civ-page__all js_civ_num_all"></span>
                            </div>
                            <h6 class="civ-tit js_civ_desc"></h6>
                        </div>
                        <a href="javascript:;" class="civ-arrow civ-arrow--left js_civ_prev"></a>
                        <a href="javascript:;" class="civ-arrow civ-arrow--right js_civ_next"></a>
                    </div>`;
                elem.iframe = iframe;
                __.content = content;
            }
            doc.body.appendChild(iframe);
            let iDoc = iframe.contentDocument;
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
            let width = parseInt(win.innerWidth);
            let height = parseInt(win.innerHeight);
            view.width = width;
            view.height = height;
            // view.padding = parseInt(width / 5);

            // 获取items
            for (let key in items) {
                let item = items[key] = {};
                item.wrap = utils.$(".js_civ_item." + key, iDoc);
                item.div = utils.$("div", item.wrap);
                item.img = utils.$("img", item.wrap);
            }

            // 设置缩放
            let _setZoom = function (x, y, scale) {
                let item = items.cur;
                let zoom = item.zoom;

                // 缩放后的大小
                let _width = width * scale;
                let _height = height * scale;
                let mx = (_width - width) / scale;
                let my = (_height - height) / scale;

                // 尝试移动覆盖整个窗口
                x = Math.min(Math.max(x, 0), mx);
                y = Math.min(Math.max(y, 0), my);

                // 判断是否可以覆盖
                if (
                    scale <= 4 &&
                    (x >= 0) &&
                    (x <= mx) &&
                    (y >= 0) &&
                    (y <= my)
                ) {
                    zoom.width = _width;
                    zoom.height = _height;
                    zoom.x = x;
                    zoom.y = y;
                    zoom.scale = scale;
                    utils.transformOrigin(item.div, x, y);
                    utils.transform(item.div, -x, -y, scale);
                }
            };

            let oList = utils.$(".js_civ_list", iDoc);
            let touches = [];
            let needReset = 0;
            utils
                // 平移及缩放
                .ondown(oList, function (e) {
                    if (state.show) {
                        touches.length = 0;
                        if (e.touches.length) {
                            Array.prototype.forEach.call(e.touches, point => {
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
                })
                .onmove(oList, function (e) {
                    let touche = e.touches[0];
                    if (touche) {
                        let x, y;
                        let zoom = items.cur.zoom;
                        let scale = zoom.scale;
                        let x1 = touche.pageX;
                        let y1 = touche.pageY;

                        if (touches.length == 2 && e.touches.length == 2) { // 缩放
                            let x2 = e.touches[1].pageX;
                            let y2 = e.touches[1].pageY;

                            let cx = (touches[0].x + touches[1].x) / 2;
                            let cy = (touches[0].y + touches[1].y) / 2;

                            // 双指距离改变量
                            let l1 = Math.sqrt(Math.pow(touches[1].x - touches[0].x, 2) + Math.pow(touches[1].y - touches[0].y, 2));
                            let l2 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                            let sl = l2 / l1;

                            // 将绕 cx,cy 缩放转换成绕可视区域左上角缩放
                            scale *= sl;
                            let ds = (sl - 1) / scale;
                            x = zoom.x + cx * ds;
                            y = zoom.y + cy * ds;

                            _setZoom(x, y, scale);

                            touches[0].x = x1;
                            touches[0].y = y1;
                            touches[1].x = x2;
                            touches[1].y = y2;
                        } else if (touches.length && opts.list.length > 1) { // 平移
                            let dx = x1 - touches[0].x;
                            let dy = y1 - touches[0].y;
                            x = zoom.x - dx / scale;
                            // 判断是切换还是图片查看
                            if (x > 0 && x < (zoom.width - width) / scale) {
                                y = zoom.y - dy / scale;
                                _setZoom(x, y, scale);
                            } else{
                                if (dx) {
                                    let move = parseInt(transform.move + dx);
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
                })
                .onup(oList, function () {
                    touches.length = 0;
                    if (needReset) {
                        self._reset();
                    }
                })
                .ontap(oList, function () {
                    self._trigger("click");
                })
                // 左右切换
                .ontap(elem.prev, function () {
                    self.prev();
                })
                .ontap(elem.next, function () {
                    self.next();
                });
            // 滚轮缩放
            oList.addEventListener("mousewheel", function (e) {
                if (state.show) {
                    let zoom = items.cur.zoom;
                    let scale = zoom.scale * (e.deltaY > 0 ? 0.9 : 1 / 0.9);
                    let cx = e.clientX;
                    let cy = e.clientY;
                    let ds = scale - zoom.scale;
                    let x = zoom.x + cx * ds / scale;
                    let y = zoom.y + cy * ds / scale;
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
        _preloadImage(list, callback) {
            if (!utils.isArray(list)) {
                list = [list];
            }
            if (!utils.isFunction(callback)) {
                callback = null;
            }
            if (utils.isArray(list)) {
                list.forEach(function (item, index) {
                    if (item && item.src && !item.width) {
                        let img = new Image();
                        img.onload = img.onerror = img.onabort = (e) => {
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
        _initItems() {
            let self = this;
            let __ = self.__;
            let { opts, elem, view, items, transform } = __;

            // 设置图片
            let length = opts.list.length;
            let index = opts.index > 0 && opts.index < length ? parseInt(opts.index) : 0;
            let setItem = function (key, no) {
                let item = items[key];
                let data = opts.list[no] || {};
                item.data = data;
                if (item.index !== data.index) {
                    item.index = data.index;
                    // 加载图片
                    if (data.src) {
                        item.img.src = data.src;
                    } else {
                        item.img.removeAttribute("src");
                    }
                    self._preloadImage(data, (img) => {
                        // 重置缩放
                        let scale = 1;
                        let x = 0;
                        let y = 0;
                        if (img.width) {
                            let sw = view.width / img.width;
                            let sh = view.height / img.height;
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
            self._update()
                ._updateViewScroll();

            return self;
        }

        /**
         * 更新图片位置
         * @param {Boolean} ani 是否采用动画过渡
         * @protected
         */
        _update(ani, callback) {
            let self = this;
            let __ = self.__;
            let { view, items, transform } = __;
            let size = view.width + view.margin;
            let x = transform.move;

            if (!utils.isFunction(callback)) {
                callback = null;
            }

            let deal = (values, act) => {
                if (!utils.isArray(values)) {
                    values = [];
                }
                act(items.prev, values[0]);
                act(items.cur, values[1]);
                act(items.next, values[2]);
            };

            // 判断是否需要移动
            deal([x - size, x, x + size], (item, value) => {
                item._needMove = 0;
                let left = item.left;
                if (left != value) {
                    item.left = value;
                    if ((left >= -size && left <= size) || (value >= -size && value <= size)) {
                        item._needMove = 1;
                    }
                }
            });

            // 设置动画
            let setAni = (enable) => {
                let style = enable ? "all " + transform.duration + "ms ease" : "";
                deal(null, (item, value) => {
                    if (item._needMove) {
                        utils.transition(item.wrap, style);
                    }
                });
            };

            // 移动
            let move = () => {
                deal(null, (item, value) => {
                    if (item._needMove) {
                        utils.transform(item.wrap, item.left);
                    }
                });
            };

            if (ani) {
                setAni(true);
                setTimeout(move, 0);
                setTimeout(() => {
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
        _updateViewScroll() {
            let self = this;
            let __ = self.__;
            let { opts, view } = __;
            let size = view.width + view.margin;
            view.left = !opts.loop && opts.index == 0 ? 0 : -size;
            view.right = !opts.loop && opts.index == opts.list.length - 1 ? 0 : size;
            return self;
        }

        /**
         * 图片复位
         * @param {Number} move 当前位移
         * @protected
         */
        _reset(move) {
            let self = this;
            let __ = self.__;
            let { opts, state, view, items, transform } = __;
            let act = null;

            if (!state.ani) {
                state.ani = 1;

                if (move != null && (-move >= view.left || -move <= view.right)) {
                    self._trigger("slidestart");
                } else {
                    move = transform.move;
                }
                if (Math.abs(move) > view.padding) {
                    let size = view.width + view.margin;
                    if (move > 0) { // 上一页
                        move = size;
                        act = -1;
                    } else { // 下一页
                        move = -size;
                        act = 1;
                    }
                } else { // 复位
                    move = 0;
                }

                // 移动
                transform.move = move;
                self._update(true, () => {
                    // 交换位置
                    if (act) {
                        let size = view.width + view.margin;
                        let swap = (prev, cur, next) => {
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
                    setTimeout(() => {
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
        _setArrow() {
            let self = this;
            let __ = self.__;
            let { opts, elem } = __;
            let { prev, next } = elem;

            let length = opts.list.length;
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
        show() {
            let self = this;
            let __ = self.__;
            let { state } = __;

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
        hide(type) {
            let self = this;
            let __ = self.__;
            let { state, elem } = __;
            let { iframe } = elem;

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
        prev() {
            let self = this;
            let __ = self.__;
            let { opts, state, view } = __;

            let length = opts.list.length;
            if (state.show && length > 1 && (opts.loop || opts.index > 0)) {
                self._reset(view.width);
            }
            return self;
        }

        /**
         * 查看下一页
         * @public
         */
        next() {
            let self = this;
            let __ = self.__;
            let { opts, state, view } = __;

            let length = opts.list.length;
            if (state.show && length > 1 && (opts.loop || opts.index < length - 1)) {
                self._reset(-view.width);
            }
            return self;
        }

        /**
         * 获取或设置图片列表
         */
        get list() {
            let self = this;
            let __ = self.__;
            let { opts } = __;
            let _list = opts.list.map(img => img.src);
            return _list;
        }
        set list(value) {
            let self = this;
            let __ = self.__;
            let { opts } = __;
            if (utils.isArray(value)) {
                let curList = self.list;
                if (curList.join(",") != value.join(",")) {
                    opts.list = value;
                    opts.index = 0;
                    self._initData(opts)
                        ._reset();
                }
            }
        }

        /**
         * 返回当前的图片序号
         */
        get index() {
            return this.__.opts.index;
        }
        set index(value) {
            let self = this;
            let __ = self.__;
            let { opts } = __;
            value = parseInt(value);
            if (value >= 0 && value <= opts.list.length - 1) {
                opts.index = value;
                self._initItems();
            }
        }

        /**
         * 获取或设置循环查看
         */
        get loop() {
            return this.__.opts.loop;
        }
        set loop(value) {
            let self = this;
            let __ = self.__;
            let { opts } = __;
            value == !!value;
            if (value != opts.loop) {
                opts.loop = value;
                self._updateViewScroll();
            }
        }

        /**
         * 返回版本号
         */
        get version() {
            return this.__.version;
        }

        //#endregion
    }

    CIV.utils = utils;

    win.CIV = win.cImageViewer = CIV;
})(window, document);