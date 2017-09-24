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

    // requestAnimationFrame & cancelAnimationFrame
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

    // 工具方法库
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
            scale = scale == null ? 1 : scale;
            elem.style.transform = elem.style.webkitTransform = "translate3d(" + x + "px," + y + "px,0) scale(" + scale + ")";
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
                elem.addEventListener("touchend", function () {
                    if (Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) < 400) {
                        callback.call(elem);
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

            if (!utils.isObject(target) && !utils.isFunction(target)) {
                target = {};
            }

            if (i === length) {
                target = this;
                i--;
            }

            for (; i < length; i++) {
                if ((options = args[i]) != null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue;
                        }
                        if (deep && copy && (jQuery.isPlainObject(copy) ||
                            (copyIsArray = Array.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && Array.isArray(src) ? src : [];
                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }
                            target[name] = jQuery.extend(deep, clone, copy);
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },
        /**
         * 计算过渡值
         * @param {Number} t 当前时间
         * @param {Number} b 初始值
         * @param {Number} c 变化量
         * @param {Number} d 持续时间
         */
        easeInOut: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        /**
         * 动画过渡
         */
        transition: function (opts, iterator, callback) {
            let { from, to, time } = opts;
            let change = to - from;
            let startTime = + new Date();
            let run = () => {
                let curTime = new Date() - startTime;
                if (curTime < time) {
                    let value = utils.easeInOut(Math.min(curTime, time), from, change, time);
                    let active = iterator(value, curTime);
                    if (active !== false) {
                        requestAnimationFrame(run);
                    }
                } else {
                    iterator(to, curTime);
                    callback();
                }
            };
            run();
        }
    };
    Array.prototype.forEach.call(["Object", "Function", "String", "Number", "Array", "Boolean", { type: "Img", key: "HTMLImageElement" }], function (item) {
        utils["is" + (item.type || item)] = function (obj) {
            return Object.prototype.toString.call(obj) === "[object " + (item.key || item) + "]";
        };
    });

    /**
     * 播放器核心类
     * @class CIV
     * @example new CIV({shape: CIV.SHAPE.SQUARE})
     */
    class CIV {
        // ================================ 静态方法 ================================

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

        // ================================ private ================================

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
         * 事件在点击图片时触发
         * @private
         */
        __clickHandler() { }

        /**
         * 事件在保存图片时触发
         * @private
         */
        __downloadHandler() { }

        // =========================================================================


        // ================================ protected ==============================

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
                iframe: null, // 浮层dom节点
                btn: null, // 保存按钮dom节点
                content: "", // 浮层html
                items: {
                    prev: {},
                    cur: {},
                    next: {}
                },
                view: { // 操作区
                    margin: 10, // 间隔大小
                    padding: 100, // 位移超过该比例时进行切换
                    left: 0, // 当前可滑动左边界
                    right: 0, // 当前可滑动右边界
                    width: 0,
                    height: 0
                },
                transform: {
                    resetDelay: 250, // 复位动画时间
                    aniIndex: 0, // 动画序号
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
                            opts[key].forEach((item, index) => {
                                if (utils.isImg(item)) {
                                    item = item.src;
                                }
                                __.opts.list.push({
                                    index: index,
                                    src: item,
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
            let { opts, view, iframe, items, content, transform, state } = __;

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
                    .civ,.civ-cont,.civ-item{position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden}
                    </style>
                    <div class="civ js_civ">
                        <div class="civ-cont js_civ_list">
                            <div class="civ-item js_civ_item prev"><img></div>
                            <div class="civ-item js_civ_item cur"><img></div>
                            <div class="civ-item js_civ_item next"><img></div>
                        </div>
                    </div>`;
                __.iframe = iframe;
                __.content = content;
            }
            doc.body.appendChild(iframe);
            let iDoc = iframe.contentDocument;
            iDoc.write(content);
            iDoc.close();

            // 获取弹窗大小
            let width = parseInt(win.innerWidth);
            let height = parseInt(win.innerHeight);
            view.width = width;
            view.height = height;
            view.padding = parseInt(width / 3);

            // 获取items
            for (let key in items) {
                let item = items[key] = {};
                item.inZoom = 0;
                item.div = utils.$(".js_civ_item." + key, iDoc);
                item.img = utils.$("img", item.div);
            }

            let oList = utils.$(".js_civ_list", iDoc);
            let pos = [];
            let isTouch = 0;
            utils
                // 平移及缩放
                .ondown(oList, function (e) {
                    if (state.show) {
                        isTouch = 1;
                        pos.length = 0;
                        transform.aniIndex++;
                        if (e.touches.length) {
                            Array.prototype.forEach.call(e.touches, point => {
                                pos.push({
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
                    let point = pos[0];
                    let touche = e.touches[0];
                    if (isTouch && point && touche) {
                        let x = touche.pageX;
                        let y = touche.pageY;
                        let dx = x - point.x;
                        if (dx) {
                            let move = parseInt(transform.move + dx);
                            if (-move >= view.left && -move <= view.right) {
                                transform.move = move;
                                self._update();
                            }
                        }
                        point.x = x;
                        point.y = y;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                })
                .onup(oList, function () {
                    isTouch = 0;
                    pos.length = 0;
                    self._reset();
                })
                .ontap(oList, function () {
                    self._trigger("click");
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
            let { opts, view, items, transform } = __;

            // 设置图片
            let length = opts.list.length;
            let index = opts.index > 0 && opts.index < length ? parseInt(opts.index) : 0;
            let setItem = function (key, no) {
                let item = items[key];
                let img = opts.list[no] || {};
                if (item.index !== img.index) {
                    item.index = img.index;
                    // 加载图片
                    if (img.src) {
                        item.img.src = img.src;
                    } else {
                        item.img.removeAttribute("src");
                    }
                    self._preloadImage(img, (img) => {
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
                        utils.transformOrigin(item.img, x, y);
                        utils.transform(item.img, -x, -y, scale);
                    });
                }
            };
            setItem("prev", (index - 1 + length) % length);
            setItem("cur", index);
            setItem("next", (index + 1) % length);

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
        _update(ani) {
            let self = this;
            let __ = self.__;
            let { view, items, transform } = __;
            let size = view.width + view.margin;
            let x = transform.move;
            let move = (item, x) => {
                let left = item.left;
                if (left != x) {
                    item.left = x;
                    if ((left >= -size && left <= size) || (x >= -size && x <= size)) {
                        utils.transform(item.div, x);
                    }
                }
            };
            move(items.prev, x - size);
            move(items.cur, x);
            move(items.next, x + size);
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
            let { opts, view, items, transform } = __;
            let act = null;

            transform.aniIndex++;
            let aniIndex = transform.aniIndex;

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

            utils.transition({
                from: transform.move,
                to: move,
                time: transform.resetDelay
            }, (value, time) => {
                let active = aniIndex == transform.aniIndex; // 判断动画是否过时
                if (active) {
                    transform.move = value;
                    self._update();
                }
                return active;
            }, () => {
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
                self._trigger("slideend");
                if (act) {
                    self._trigger("slidechange");
                }
            });

            return self;
        }

        // =========================================================================


        // ================================ public =================================

        // 播放器方法

        /**
         * 打开裁剪弹窗
         * @public
         */
        show() {
            let self = this;
            let __ = self.__;
            let { state, iframe } = __;

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
            let { state, iframe } = __;
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
            if (state.show) {
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
            if (state.show) {
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

        // =========================================================================
    }

    CIV.utils = utils;

    win.CIV = win.cImageViewer = CIV;
})(window, document);