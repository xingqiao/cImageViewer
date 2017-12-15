/**
 * @fileOverview 图片浏览器 - QQ音乐下载定制封装
 * @author ctchen
 * @version 1.0.0
 */

(function (win, doc, CIV_CORE) {

    let utils = CIV_CORE.utils;

    class CIV extends CIV_CORE {

        /**
         * 构造函数
         * @constructor
         * @param {Boolean} opts.save 是否展示保存按钮，默认为 false
         * @param {String} opts.saveBtn 保存按钮文本，默认为 "保存图片"
         * @param {Function} opts.onsave 保存按钮文本，默认为 "保存图片"
         */
        constructor(opts) {
            super(opts);

            let __ = this.__;

            __.elem.save = null; // 保存按钮dom节点
            __.version.build = "CIV_QM";
        }

        _showHandler() {
            let self = this;
            let __ = self.__;
            let { opts, elem } = __;
            let { iframe } = elem;

            let iDoc = iframe.contentDocument;
            let div = iDoc.createElement("div");
            div.innerHTML = `<style>
                .civ-btn{position:absolute;padding:0 1em;bottom:50px;width:140px;line-height:40px;left:50%;margin-left:-70px;background:rgba(0,0,0,.5);color:#fff;border:2px solid #fff;border-radius:20px;overflow:hidden;text-overflow:ellipsis;}
                </style>
                <button class="civ-btn js_save" style="${opts.save ? "" : "display:none"}">${opts.saveBtn}</button>`;
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
        _save() {
            let self = this;
            let __ = self.__;
            let { opts, items } = __;
            let { cur } = items;

            if (cur.img) {
                let src = cur.img.src;
                if (src) {
                    let next = (r) => {
                        let data = { img: src, index: cur.index };
                        if (r && r.code != 0) {
                            data.error = r;
                        }
                        self._trigger("save", data);
                    };

                    if (!opts.noSave) {
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
                        let a = doc.createElement("a");
                        a.href = src;
                        a.target = "_blank";
                        let filename = src.split(/[#?]/);
                        filename = filename[0].match(/[\w.]+$/);
                        a.download = filename && filename[0] || "save.jpg";
                        a.click();
                    }
                    next();
                }
            }

            return self;
        }

        /**
         * 获取或设置保存按钮设置
         */
        get save() {
            return this.__.opts.save;
        }
        set save(value) {
            let self = this;
            let __ = self.__;
            let { opts, elem } = __;
            opts.save = !!value;
            elem.btn.style.display = opts.save ? "block" : "none";
        }

        /**
         * 获取或设置保存按钮文本
         */
        get saveBtn() {
            return this.__.opts.saveBtn;
        }
        set saveBtn(value) {
            let self = this;
            let __ = self.__;
            let { opts, elem } = __;
            value = "" + value;
            if (value != opts.saveBtn) {
                opts.saveBtn = value;
                elem.btn.innerText = value;
            }
        }

    }

    CIV.defaultOptions.save = false;
    CIV.defaultOptions.saveBtn = "保存图片";

    win.CIV = win.cImageViewer = CIV;

})(window, document, window.CIV);