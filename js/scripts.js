(function (window) {
    var Logger = {};
    Logger.VERSION = "0.9.2";
    var logHandler;
    var contextualLoggersByNameMap = {};
    var bind = function (scope, func) {
        return function () {
            return func.apply(scope, arguments);
        };
    };
    var merge = function () {
        var args = arguments, target = args[0], key, i;
        for (i = 1; i < args.length; i++) {
            for (key in args[i]) {
                if (!(key in target) && args[i].hasOwnProperty(key)) {
                    target[key] = args[i][key];
                }
            }
        }
        return target;
    };
    var defineLogLevel = function (value, name) {
        return{value: value, name: name};
    };
    Logger.DEBUG = defineLogLevel(1, "DEBUG");
    Logger.INFO = defineLogLevel(2, "INFO");
    Logger.WARN = defineLogLevel(4, "WARN");
    Logger.ERROR = defineLogLevel(8, "ERROR");
    Logger.OFF = defineLogLevel(99, "OFF");
    var ContextualLogger = function (defaultContext) {
        this.context = defaultContext;
        this.setLevel(defaultContext.filterLevel);
        this.log = this.info;
    };
    ContextualLogger.prototype = {setLevel: function (newLevel) {
        if (newLevel && "value" in newLevel) {
            this.context.filterLevel = newLevel;
        }
    }, enabledFor: function (lvl) {
        var filterLevel = this.context.filterLevel;
        return lvl.value >= filterLevel.value;
    }, debug: function () {
        this.invoke(Logger.DEBUG, arguments);
    }, info: function () {
        this.invoke(Logger.INFO, arguments);
    }, warn: function () {
        this.invoke(Logger.WARN, arguments);
    }, error: function () {
        this.invoke(Logger.ERROR, arguments);
    }, invoke: function (level, msgArgs) {
        if (logHandler && this.enabledFor(level)) {
            logHandler(msgArgs, merge({level: level}, this.context));
        }
    }};
    var globalLogger = new ContextualLogger({filterLevel: Logger.OFF});
    (function () {
        var L = Logger;
        L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
        L.debug = bind(globalLogger, globalLogger.debug);
        L.info = bind(globalLogger, globalLogger.info);
        L.warn = bind(globalLogger, globalLogger.warn);
        L.error = bind(globalLogger, globalLogger.error);
        L.log = L.info;
    }());
    Logger.setHandler = function (func) {
        logHandler = func;
    };
    Logger.setLevel = function (level) {
        globalLogger.setLevel(level);
        for (var key in contextualLoggersByNameMap) {
            if (contextualLoggersByNameMap.hasOwnProperty(key)) {
                contextualLoggersByNameMap[key].setLevel(level);
            }
        }
    };
    Logger.get = function (name) {
        return contextualLoggersByNameMap[name] || (contextualLoggersByNameMap[name] = new ContextualLogger(merge({name: name}, globalLogger.context)));
    };
    Logger.useDefaults = function (defaultLevel) {
        if (!("console" in window)) {
            return;
        }
        Logger.setLevel(defaultLevel || Logger.DEBUG);
        Logger.setHandler(function (messages, context) {
            var console = window.console;
            var hdlr = console.log;
            if (context.name) {
                messages[0] = "[" + context.name + "] " + messages[0];
            }
            if (context.level === Logger.WARN && console.warn) {
                hdlr = console.warn;
            } else {
                if (context.level === Logger.ERROR && console.error) {
                    hdlr = console.error;
                }
            }
            hdlr.apply(console, messages);
        });
    };
    if (typeof define === "function" && define.amd) {
        define(Logger);
    } else {
        if (typeof module !== "undefined" && module.exports) {
            module.exports = Logger;
        } else {
            window.Logger = Logger;
        }
    }
}(window));
/*! jQuery v1.8.2 jquery.com | jquery.org/license */
(function (a, b) {
    function G(a) {
        var b = F[a] = {};
        return p.each(a.split(s), function (a, c) {
            b[c] = !0
        }), b
    }

    function J(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = "data-" + c.replace(I, "-$1").toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == "string") {
                try {
                    d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : +d + "" === d ? +d : H.test(d) ? p.parseJSON(d) : d
                } catch (f) {
                }
                p.data(a, c, d)
            } else d = b
        }
        return d
    }

    function K(a) {
        var b;
        for (b in a) {
            if (b === "data" && p.isEmptyObject(a[b]))continue;
            if (b !== "toJSON")return!1
        }
        return!0
    }

    function ba() {
        return!1
    }

    function bb() {
        return!0
    }

    function bh(a) {
        return!a || !a.parentNode || a.parentNode.nodeType === 11
    }

    function bi(a, b) {
        do a = a[b]; while (a && a.nodeType !== 1);
        return a
    }

    function bj(a, b, c) {
        b = b || 0;
        if (p.isFunction(b))return p.grep(a, function (a, d) {
            var e = !!b.call(a, d, a);
            return e === c
        });
        if (b.nodeType)return p.grep(a, function (a, d) {
            return a === b === c
        });
        if (typeof b == "string") {
            var d = p.grep(a, function (a) {
                return a.nodeType === 1
            });
            if (be.test(b))return p.filter(b, d, !c);
            b = p.filter(b, d)
        }
        return p.grep(a, function (a, d) {
            return p.inArray(a, b) >= 0 === c
        })
    }

    function bk(a) {
        var b = bl.split("|"), c = a.createDocumentFragment();
        if (c.createElement)while (b.length)c.createElement(b.pop());
        return c
    }

    function bC(a, b) {
        return a.getElementsByTagName(b)[0] || a.appendChild(a.ownerDocument.createElement(b))
    }

    function bD(a, b) {
        if (b.nodeType !== 1 || !p.hasData(a))return;
        var c, d, e, f = p._data(a), g = p._data(b, f), h = f.events;
        if (h) {
            delete g.handle, g.events = {};
            for (c in h)for (d = 0, e = h[c].length; d < e; d++)p.event.add(b, c, h[c][d])
        }
        g.data && (g.data = p.extend({}, g.data))
    }

    function bE(a, b) {
        var c;
        if (b.nodeType !== 1)return;
        b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === "object" ? (b.parentNode && (b.outerHTML = a.outerHTML), p.support.html5Clone && a.innerHTML && !p.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : c === "input" && bv.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text), b.removeAttribute(p.expando)
    }

    function bF(a) {
        return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
    }

    function bG(a) {
        bv.test(a.type) && (a.defaultChecked = a.checked)
    }

    function bY(a, b) {
        if (b in a)return b;
        var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = bW.length;
        while (e--) {
            b = bW[e] + c;
            if (b in a)return b
        }
        return d
    }

    function bZ(a, b) {
        return a = b || a, p.css(a, "display") === "none" || !p.contains(a.ownerDocument, a)
    }

    function b$(a, b) {
        var c, d, e = [], f = 0, g = a.length;
        for (; f < g; f++) {
            c = a[f];
            if (!c.style)continue;
            e[f] = p._data(c, "olddisplay"), b ? (!e[f] && c.style.display === "none" && (c.style.display = ""), c.style.display === "" && bZ(c) && (e[f] = p._data(c, "olddisplay", cc(c.nodeName)))) : (d = bH(c, "display"), !e[f] && d !== "none" && p._data(c, "olddisplay", d))
        }
        for (f = 0; f < g; f++) {
            c = a[f];
            if (!c.style)continue;
            if (!b || c.style.display === "none" || c.style.display === "")c.style.display = b ? e[f] || "" : "none"
        }
        return a
    }

    function b_(a, b, c) {
        var d = bP.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }

    function ca(a, b, c, d) {
        var e = c === (d ? "border" : "content") ? 4 : b === "width" ? 1 : 0, f = 0;
        for (; e < 4; e += 2)c === "margin" && (f += p.css(a, c + bV[e], !0)), d ? (c === "content" && (f -= parseFloat(bH(a, "padding" + bV[e])) || 0), c !== "margin" && (f -= parseFloat(bH(a, "border" + bV[e] + "Width")) || 0)) : (f += parseFloat(bH(a, "padding" + bV[e])) || 0, c !== "padding" && (f += parseFloat(bH(a, "border" + bV[e] + "Width")) || 0));
        return f
    }

    function cb(a, b, c) {
        var d = b === "width" ? a.offsetWidth : a.offsetHeight, e = !0, f = p.support.boxSizing && p.css(a, "boxSizing") === "border-box";
        if (d <= 0 || d == null) {
            d = bH(a, b);
            if (d < 0 || d == null)d = a.style[b];
            if (bQ.test(d))return d;
            e = f && (p.support.boxSizingReliable || d === a.style[b]), d = parseFloat(d) || 0
        }
        return d + ca(a, b, c || (f ? "border" : "content"), e) + "px"
    }

    function cc(a) {
        if (bS[a])return bS[a];
        var b = p("<" + a + ">").appendTo(e.body), c = b.css("display");
        b.remove();
        if (c === "none" || c === "") {
            bI = e.body.appendChild(bI || p.extend(e.createElement("iframe"), {frameBorder: 0, width: 0, height: 0}));
            if (!bJ || !bI.createElement)bJ = (bI.contentWindow || bI.contentDocument).document, bJ.write("<!doctype html><html><body>"), bJ.close();
            b = bJ.body.appendChild(bJ.createElement(a)), c = bH(b, "display"), e.body.removeChild(bI)
        }
        return bS[a] = c, c
    }

    function ci(a, b, c, d) {
        var e;
        if (p.isArray(b))p.each(b, function (b, e) {
            c || ce.test(a) ? d(a, e) : ci(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d)
        }); else if (!c && p.type(b) === "object")for (e in b)ci(a + "[" + e + "]", b[e], c, d); else d(a, b)
    }

    function cz(a) {
        return function (b, c) {
            typeof b != "string" && (c = b, b = "*");
            var d, e, f, g = b.toLowerCase().split(s), h = 0, i = g.length;
            if (p.isFunction(c))for (; h < i; h++)d = g[h], f = /^\+/.test(d), f && (d = d.substr(1) || "*"), e = a[d] = a[d] || [], e[f ? "unshift" : "push"](c)
        }
    }

    function cA(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h, i = a[f], j = 0, k = i ? i.length : 0, l = a === cv;
        for (; j < k && (l || !h); j++)h = i[j](c, d, e), typeof h == "string" && (!l || g[h] ? h = b : (c.dataTypes.unshift(h), h = cA(a, c, d, e, h, g)));
        return(l || !h) && !g["*"] && (h = cA(a, c, d, e, "*", g)), h
    }

    function cB(a, c) {
        var d, e, f = p.ajaxSettings.flatOptions || {};
        for (d in c)c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
        e && p.extend(!0, a, e)
    }

    function cC(a, c, d) {
        var e, f, g, h, i = a.contents, j = a.dataTypes, k = a.responseFields;
        for (f in k)f in d && (c[k[f]] = d[f]);
        while (j[0] === "*")j.shift(), e === b && (e = a.mimeType || c.getResponseHeader("content-type"));
        if (e)for (f in i)if (i[f] && i[f].test(e)) {
            j.unshift(f);
            break
        }
        if (j[0]in d)g = j[0]; else {
            for (f in d) {
                if (!j[0] || a.converters[f + " " + j[0]]) {
                    g = f;
                    break
                }
                h || (h = f)
            }
            g = g || h
        }
        if (g)return g !== j[0] && j.unshift(g), d[g]
    }

    function cD(a, b) {
        var c, d, e, f, g = a.dataTypes.slice(), h = g[0], i = {}, j = 0;
        a.dataFilter && (b = a.dataFilter(b, a.dataType));
        if (g[1])for (c in a.converters)i[c.toLowerCase()] = a.converters[c];
        for (; e = g[++j];)if (e !== "*") {
            if (h !== "*" && h !== e) {
                c = i[h + " " + e] || i["* " + e];
                if (!c)for (d in i) {
                    f = d.split(" ");
                    if (f[1] === e) {
                        c = i[h + " " + f[0]] || i["* " + f[0]];
                        if (c) {
                            c === !0 ? c = i[d] : i[d] !== !0 && (e = f[0], g.splice(j--, 0, e));
                            break
                        }
                    }
                }
                if (c !== !0)if (c && a["throws"])b = c(b); else try {
                    b = c(b)
                } catch (k) {
                    return{state: "parsererror", error: c ? k : "No conversion from " + h + " to " + e}
                }
            }
            h = e
        }
        return{state: "success", data: b}
    }

    function cL() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {
        }
    }

    function cM() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {
        }
    }

    function cU() {
        return setTimeout(function () {
            cN = b
        }, 0), cN = p.now()
    }

    function cV(a, b) {
        p.each(b, function (b, c) {
            var d = (cT[b] || []).concat(cT["*"]), e = 0, f = d.length;
            for (; e < f; e++)if (d[e].call(a, b, c))return
        })
    }

    function cW(a, b, c) {
        var d, e = 0, f = 0, g = cS.length, h = p.Deferred().always(function () {
            delete i.elem
        }), i = function () {
            var b = cN || cU(), c = Math.max(0, j.startTime + j.duration - b), d = 1 - (c / j.duration || 0), e = 0, f = j.tweens.length;
            for (; e < f; e++)j.tweens[e].run(d);
            return h.notifyWith(a, [j, d, c]), d < 1 && f ? c : (h.resolveWith(a, [j]), !1)
        }, j = h.promise({elem: a, props: p.extend({}, b), opts: p.extend(!0, {specialEasing: {}}, c), originalProperties: b, originalOptions: c, startTime: cN || cU(), duration: c.duration, tweens: [], createTween: function (b, c, d) {
            var e = p.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
            return j.tweens.push(e), e
        }, stop: function (b) {
            var c = 0, d = b ? j.tweens.length : 0;
            for (; c < d; c++)j.tweens[c].run(1);
            return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
        }}), k = j.props;
        cX(k, j.opts.specialEasing);
        for (; e < g; e++) {
            d = cS[e].call(j, a, k, j.opts);
            if (d)return d
        }
        return cV(j, k), p.isFunction(j.opts.start) && j.opts.start.call(a, j), p.fx.timer(p.extend(i, {anim: j, queue: j.opts.queue, elem: a})), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }

    function cX(a, b) {
        var c, d, e, f, g;
        for (c in a) {
            d = p.camelCase(c), e = b[d], f = a[c], p.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = p.cssHooks[d];
            if (g && "expand"in g) {
                f = g.expand(f), delete a[d];
                for (c in f)c in a || (a[c] = f[c], b[c] = e)
            } else b[d] = e
        }
    }

    function cY(a, b, c) {
        var d, e, f, g, h, i, j, k, l = this, m = a.style, n = {}, o = [], q = a.nodeType && bZ(a);
        c.queue || (j = p._queueHooks(a, "fx"), j.unqueued == null && (j.unqueued = 0, k = j.empty.fire, j.empty.fire = function () {
            j.unqueued || k()
        }), j.unqueued++, l.always(function () {
            l.always(function () {
                j.unqueued--, p.queue(a, "fx").length || j.empty.fire()
            })
        })), a.nodeType === 1 && ("height"in b || "width"in b) && (c.overflow = [m.overflow, m.overflowX, m.overflowY], p.css(a, "display") === "inline" && p.css(a, "float") === "none" && (!p.support.inlineBlockNeedsLayout || cc(a.nodeName) === "inline" ? m.display = "inline-block" : m.zoom = 1)), c.overflow && (m.overflow = "hidden", p.support.shrinkWrapBlocks || l.done(function () {
            m.overflow = c.overflow[0], m.overflowX = c.overflow[1], m.overflowY = c.overflow[2]
        }));
        for (d in b) {
            f = b[d];
            if (cP.exec(f)) {
                delete b[d];
                if (f === (q ? "hide" : "show"))continue;
                o.push(d)
            }
        }
        g = o.length;
        if (g) {
            h = p._data(a, "fxshow") || p._data(a, "fxshow", {}), q ? p(a).show() : l.done(function () {
                p(a).hide()
            }), l.done(function () {
                var b;
                p.removeData(a, "fxshow", !0);
                for (b in n)p.style(a, b, n[b])
            });
            for (d = 0; d < g; d++)e = o[d], i = l.createTween(e, q ? h[e] : 0), n[e] = h[e] || p.style(a, e), e in h || (h[e] = i.start, q && (i.end = i.start, i.start = e === "width" || e === "height" ? 1 : 0))
        }
    }

    function cZ(a, b, c, d, e) {
        return new cZ.prototype.init(a, b, c, d, e)
    }

    function c$(a, b) {
        var c, d = {height: a}, e = 0;
        b = b ? 1 : 0;
        for (; e < 4; e += 2 - b)c = bV[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d
    }

    function da(a) {
        return p.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
    }

    var c, d, e = a.document, f = a.location, g = a.navigator, h = a.jQuery, i = a.$, j = Array.prototype.push, k = Array.prototype.slice, l = Array.prototype.indexOf, m = Object.prototype.toString, n = Object.prototype.hasOwnProperty, o = String.prototype.trim, p = function (a, b) {
        return new p.fn.init(a, b, c)
    }, q = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, r = /\S/, s = /\s+/, t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, u = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, w = /^[\],:{}\s]*$/, x = /(?:^|:|,)(?:\s*\[)+/g, y = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, z = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, A = /^-ms-/, B = /-([\da-z])/gi, C = function (a, b) {
        return(b + "").toUpperCase()
    }, D = function () {
        e.addEventListener ? (e.removeEventListener("DOMContentLoaded", D, !1), p.ready()) : e.readyState === "complete" && (e.detachEvent("onreadystatechange", D), p.ready())
    }, E = {};
    p.fn = p.prototype = {constructor: p, init: function (a, c, d) {
        var f, g, h, i;
        if (!a)return this;
        if (a.nodeType)return this.context = this[0] = a, this.length = 1, this;
        if (typeof a == "string") {
            a.charAt(0) === "<" && a.charAt(a.length - 1) === ">" && a.length >= 3 ? f = [null, a, null] : f = u.exec(a);
            if (f && (f[1] || !c)) {
                if (f[1])return c = c instanceof p ? c[0] : c, i = c && c.nodeType ? c.ownerDocument || c : e, a = p.parseHTML(f[1], i, !0), v.test(f[1]) && p.isPlainObject(c) && this.attr.call(a, c, !0), p.merge(this, a);
                g = e.getElementById(f[2]);
                if (g && g.parentNode) {
                    if (g.id !== f[2])return d.find(a);
                    this.length = 1, this[0] = g
                }
                return this.context = e, this.selector = a, this
            }
            return!c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a)
        }
        return p.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), p.makeArray(a, this))
    }, selector: "", jquery: "1.8.2", length: 0, size: function () {
        return this.length
    }, toArray: function () {
        return k.call(this)
    }, get: function (a) {
        return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
    }, pushStack: function (a, b, c) {
        var d = p.merge(this.constructor(), a);
        return d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"), d
    }, each: function (a, b) {
        return p.each(this, a, b)
    }, ready: function (a) {
        return p.ready.promise().done(a), this
    }, eq: function (a) {
        return a = +a, a === -1 ? this.slice(a) : this.slice(a, a + 1)
    }, first: function () {
        return this.eq(0)
    }, last: function () {
        return this.eq(-1)
    }, slice: function () {
        return this.pushStack(k.apply(this, arguments), "slice", k.call(arguments).join(","))
    }, map: function (a) {
        return this.pushStack(p.map(this, function (b, c) {
            return a.call(b, c, b)
        }))
    }, end: function () {
        return this.prevObject || this.constructor(null)
    }, push: j, sort: [].sort, splice: [].splice}, p.fn.init.prototype = p.fn, p.extend = p.fn.extend = function () {
        var a, c, d, e, f, g, h = arguments[0] || {}, i = 1, j = arguments.length, k = !1;
        typeof h == "boolean" && (k = h, h = arguments[1] || {}, i = 2), typeof h != "object" && !p.isFunction(h) && (h = {}), j === i && (h = this, --i);
        for (; i < j; i++)if ((a = arguments[i]) != null)for (c in a) {
            d = h[c], e = a[c];
            if (h === e)continue;
            k && e && (p.isPlainObject(e) || (f = p.isArray(e))) ? (f ? (f = !1, g = d && p.isArray(d) ? d : []) : g = d && p.isPlainObject(d) ? d : {}, h[c] = p.extend(k, g, e)) : e !== b && (h[c] = e)
        }
        return h
    }, p.extend({noConflict: function (b) {
        return a.$ === p && (a.$ = i), b && a.jQuery === p && (a.jQuery = h), p
    }, isReady: !1, readyWait: 1, holdReady: function (a) {
        a ? p.readyWait++ : p.ready(!0)
    }, ready: function (a) {
        if (a === !0 ? --p.readyWait : p.isReady)return;
        if (!e.body)return setTimeout(p.ready, 1);
        p.isReady = !0;
        if (a !== !0 && --p.readyWait > 0)return;
        d.resolveWith(e, [p]), p.fn.trigger && p(e).trigger("ready").off("ready")
    }, isFunction: function (a) {
        return p.type(a) === "function"
    }, isArray: Array.isArray || function (a) {
        return p.type(a) === "array"
    }, isWindow: function (a) {
        return a != null && a == a.window
    }, isNumeric: function (a) {
        return!isNaN(parseFloat(a)) && isFinite(a)
    }, type: function (a) {
        return a == null ? String(a) : E[m.call(a)] || "object"
    }, isPlainObject: function (a) {
        if (!a || p.type(a) !== "object" || a.nodeType || p.isWindow(a))return!1;
        try {
            if (a.constructor && !n.call(a, "constructor") && !n.call(a.constructor.prototype, "isPrototypeOf"))return!1
        } catch (c) {
            return!1
        }
        var d;
        for (d in a);
        return d === b || n.call(a, d)
    }, isEmptyObject: function (a) {
        var b;
        for (b in a)return!1;
        return!0
    }, error: function (a) {
        throw new Error(a)
    }, parseHTML: function (a, b, c) {
        var d;
        return!a || typeof a != "string" ? null : (typeof b == "boolean" && (c = b, b = 0), b = b || e, (d = v.exec(a)) ? [b.createElement(d[1])] : (d = p.buildFragment([a], b, c ? null : []), p.merge([], (d.cacheable ? p.clone(d.fragment) : d.fragment).childNodes)))
    }, parseJSON: function (b) {
        if (!b || typeof b != "string")return null;
        b = p.trim(b);
        if (a.JSON && a.JSON.parse)return a.JSON.parse(b);
        if (w.test(b.replace(y, "@").replace(z, "]").replace(x, "")))return(new Function("return " + b))();
        p.error("Invalid JSON: " + b)
    }, parseXML: function (c) {
        var d, e;
        if (!c || typeof c != "string")return null;
        try {
            a.DOMParser ? (e = new DOMParser, d = e.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
        } catch (f) {
            d = b
        }
        return(!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && p.error("Invalid XML: " + c), d
    }, noop: function () {
    }, globalEval: function (b) {
        b && r.test(b) && (a.execScript || function (b) {
            a.eval.call(a, b)
        })(b)
    }, camelCase: function (a) {
        return a.replace(A, "ms-").replace(B, C)
    }, nodeName: function (a, b) {
        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
    }, each: function (a, c, d) {
        var e, f = 0, g = a.length, h = g === b || p.isFunction(a);
        if (d) {
            if (h) {
                for (e in a)if (c.apply(a[e], d) === !1)break
            } else for (; f < g;)if (c.apply(a[f++], d) === !1)break
        } else if (h) {
            for (e in a)if (c.call(a[e], e, a[e]) === !1)break
        } else for (; f < g;)if (c.call(a[f], f, a[f++]) === !1)break;
        return a
    }, trim: o && !o.call("﻿ ") ? function (a) {
        return a == null ? "" : o.call(a)
    } : function (a) {
        return a == null ? "" : (a + "").replace(t, "")
    }, makeArray: function (a, b) {
        var c, d = b || [];
        return a != null && (c = p.type(a), a.length == null || c === "string" || c === "function" || c === "regexp" || p.isWindow(a) ? j.call(d, a) : p.merge(d, a)), d
    }, inArray: function (a, b, c) {
        var d;
        if (b) {
            if (l)return l.call(b, a, c);
            d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
            for (; c < d; c++)if (c in b && b[c] === a)return c
        }
        return-1
    }, merge: function (a, c) {
        var d = c.length, e = a.length, f = 0;
        if (typeof d == "number")for (; f < d; f++)a[e++] = c[f]; else while (c[f] !== b)a[e++] = c[f++];
        return a.length = e, a
    }, grep: function (a, b, c) {
        var d, e = [], f = 0, g = a.length;
        c = !!c;
        for (; f < g; f++)d = !!b(a[f], f), c !== d && e.push(a[f]);
        return e
    }, map: function (a, c, d) {
        var e, f, g = [], h = 0, i = a.length, j = a instanceof p || i !== b && typeof i == "number" && (i > 0 && a[0] && a[i - 1] || i === 0 || p.isArray(a));
        if (j)for (; h < i; h++)e = c(a[h], h, d), e != null && (g[g.length] = e); else for (f in a)e = c(a[f], f, d), e != null && (g[g.length] = e);
        return g.concat.apply([], g)
    }, guid: 1, proxy: function (a, c) {
        var d, e, f;
        return typeof c == "string" && (d = a[c], c = a, a = d), p.isFunction(a) ? (e = k.call(arguments, 2), f = function () {
            return a.apply(c, e.concat(k.call(arguments)))
        }, f.guid = a.guid = a.guid || p.guid++, f) : b
    }, access: function (a, c, d, e, f, g, h) {
        var i, j = d == null, k = 0, l = a.length;
        if (d && typeof d == "object") {
            for (k in d)p.access(a, c, k, d[k], 1, g, e);
            f = 1
        } else if (e !== b) {
            i = h === b && p.isFunction(e), j && (i ? (i = c, c = function (a, b, c) {
                return i.call(p(a), c)
            }) : (c.call(a, e), c = null));
            if (c)for (; k < l; k++)c(a[k], d, i ? e.call(a[k], k, c(a[k], d)) : e, h);
            f = 1
        }
        return f ? a : j ? c.call(a) : l ? c(a[0], d) : g
    }, now: function () {
        return(new Date).getTime()
    }}), p.ready.promise = function (b) {
        if (!d) {
            d = p.Deferred();
            if (e.readyState === "complete")setTimeout(p.ready, 1); else if (e.addEventListener)e.addEventListener("DOMContentLoaded", D, !1), a.addEventListener("load", p.ready, !1); else {
                e.attachEvent("onreadystatechange", D), a.attachEvent("onload", p.ready);
                var c = !1;
                try {
                    c = a.frameElement == null && e.documentElement
                } catch (f) {
                }
                c && c.doScroll && function g() {
                    if (!p.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (a) {
                            return setTimeout(g, 50)
                        }
                        p.ready()
                    }
                }()
            }
        }
        return d.promise(b)
    }, p.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (a, b) {
        E["[object " + b + "]"] = b.toLowerCase()
    }), c = p(e);
    var F = {};
    p.Callbacks = function (a) {
        a = typeof a == "string" ? F[a] || G(a) : p.extend({}, a);
        var c, d, e, f, g, h, i = [], j = !a.once && [], k = function (b) {
            c = a.memory && b, d = !0, h = f || 0, f = 0, g = i.length, e = !0;
            for (; i && h < g; h++)if (i[h].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
                c = !1;
                break
            }
            e = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable())
        }, l = {add: function () {
            if (i) {
                var b = i.length;
                (function d(b) {
                    p.each(b, function (b, c) {
                        var e = p.type(c);
                        e === "function" && (!a.unique || !l.has(c)) ? i.push(c) : c && c.length && e !== "string" && d(c)
                    })
                })(arguments), e ? g = i.length : c && (f = b, k(c))
            }
            return this
        }, remove: function () {
            return i && p.each(arguments, function (a, b) {
                var c;
                while ((c = p.inArray(b, i, c)) > -1)i.splice(c, 1), e && (c <= g && g--, c <= h && h--)
            }), this
        }, has: function (a) {
            return p.inArray(a, i) > -1
        }, empty: function () {
            return i = [], this
        }, disable: function () {
            return i = j = c = b, this
        }, disabled: function () {
            return!i
        }, lock: function () {
            return j = b, c || l.disable(), this
        }, locked: function () {
            return!j
        }, fireWith: function (a, b) {
            return b = b || [], b = [a, b.slice ? b.slice() : b], i && (!d || j) && (e ? j.push(b) : k(b)), this
        }, fire: function () {
            return l.fireWith(this, arguments), this
        }, fired: function () {
            return!!d
        }};
        return l
    }, p.extend({Deferred: function (a) {
        var b = [
            ["resolve", "done", p.Callbacks("once memory"), "resolved"],
            ["reject", "fail", p.Callbacks("once memory"), "rejected"],
            ["notify", "progress", p.Callbacks("memory")]
        ], c = "pending", d = {state: function () {
            return c
        }, always: function () {
            return e.done(arguments).fail(arguments), this
        }, then: function () {
            var a = arguments;
            return p.Deferred(function (c) {
                p.each(b, function (b, d) {
                    var f = d[0], g = a[b];
                    e[d[1]](p.isFunction(g) ? function () {
                        var a = g.apply(this, arguments);
                        a && p.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f + "With"](this === e ? c : this, [a])
                    } : c[f])
                }), a = null
            }).promise()
        }, promise: function (a) {
            return a != null ? p.extend(a, d) : d
        }}, e = {};
        return d.pipe = d.then, p.each(b, function (a, f) {
            var g = f[2], h = f[3];
            d[f[1]] = g.add, h && g.add(function () {
                c = h
            }, b[a ^ 1][2].disable, b[2][2].lock), e[f[0]] = g.fire, e[f[0] + "With"] = g.fireWith
        }), d.promise(e), a && a.call(e, e), e
    }, when: function (a) {
        var b = 0, c = k.call(arguments), d = c.length, e = d !== 1 || a && p.isFunction(a.promise) ? d : 0, f = e === 1 ? a : p.Deferred(), g = function (a, b, c) {
            return function (d) {
                b[a] = this, c[a] = arguments.length > 1 ? k.call(arguments) : d, c === h ? f.notifyWith(b, c) : --e || f.resolveWith(b, c)
            }
        }, h, i, j;
        if (d > 1) {
            h = new Array(d), i = new Array(d), j = new Array(d);
            for (; b < d; b++)c[b] && p.isFunction(c[b].promise) ? c[b].promise().done(g(b, j, c)).fail(f.reject).progress(g(b, i, h)) : --e
        }
        return e || f.resolveWith(j, c), f.promise()
    }}), p.support = function () {
        var b, c, d, f, g, h, i, j, k, l, m, n = e.createElement("div");
        n.setAttribute("className", "t"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", c = n.getElementsByTagName("*"), d = n.getElementsByTagName("a")[0], d.style.cssText = "top:1px;float:left;opacity:.5";
        if (!c || !c.length)return{};
        f = e.createElement("select"), g = f.appendChild(e.createElement("option")), h = n.getElementsByTagName("input")[0], b = {leadingWhitespace: n.firstChild.nodeType === 3, tbody: !n.getElementsByTagName("tbody").length, htmlSerialize: !!n.getElementsByTagName("link").length, style: /top/.test(d.getAttribute("style")), hrefNormalized: d.getAttribute("href") === "/a", opacity: /^0.5/.test(d.style.opacity), cssFloat: !!d.style.cssFloat, checkOn: h.value === "on", optSelected: g.selected, getSetAttribute: n.className !== "t", enctype: !!e.createElement("form").enctype, html5Clone: e.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", boxModel: e.compatMode === "CSS1Compat", submitBubbles: !0, changeBubbles: !0, focusinBubbles: !1, deleteExpando: !0, noCloneEvent: !0, inlineBlockNeedsLayout: !1, shrinkWrapBlocks: !1, reliableMarginRight: !0, boxSizingReliable: !0, pixelPosition: !1}, h.checked = !0, b.noCloneChecked = h.cloneNode(!0).checked, f.disabled = !0, b.optDisabled = !g.disabled;
        try {
            delete n.test
        } catch (o) {
            b.deleteExpando = !1
        }
        !n.addEventListener && n.attachEvent && n.fireEvent && (n.attachEvent("onclick", m = function () {
            b.noCloneEvent = !1
        }), n.cloneNode(!0).fireEvent("onclick"), n.detachEvent("onclick", m)), h = e.createElement("input"), h.value = "t", h.setAttribute("type", "radio"), b.radioValue = h.value === "t", h.setAttribute("checked", "checked"), h.setAttribute("name", "t"), n.appendChild(h), i = e.createDocumentFragment(), i.appendChild(n.lastChild), b.checkClone = i.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = h.checked, i.removeChild(h), i.appendChild(n);
        if (n.attachEvent)for (k in{submit: !0, change: !0, focusin: !0})j = "on" + k, l = j in n, l || (n.setAttribute(j, "return;"), l = typeof n[j] == "function"), b[k + "Bubbles"] = l;
        return p(function () {
            var c, d, f, g, h = "padding:0;margin:0;border:0;display:block;overflow:hidden;", i = e.getElementsByTagName("body")[0];
            if (!i)return;
            c = e.createElement("div"), c.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", i.insertBefore(c, i.firstChild), d = e.createElement("div"), c.appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", f = d.getElementsByTagName("td"), f[0].style.cssText = "padding:0;margin:0;border:0;display:none", l = f[0].offsetHeight === 0, f[0].style.display = "", f[1].style.display = "none", b.reliableHiddenOffsets = l && f[0].offsetHeight === 0, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", b.boxSizing = d.offsetWidth === 4, b.doesNotIncludeMarginInBodyOffset = i.offsetTop !== 1, a.getComputedStyle && (b.pixelPosition = (a.getComputedStyle(d, null) || {}).top !== "1%", b.boxSizingReliable = (a.getComputedStyle(d, null) || {width: "4px"}).width === "4px", g = e.createElement("div"), g.style.cssText = d.style.cssText = h, g.style.marginRight = g.style.width = "0", d.style.width = "1px", d.appendChild(g), b.reliableMarginRight = !parseFloat((a.getComputedStyle(g, null) || {}).marginRight)), typeof d.style.zoom != "undefined" && (d.innerHTML = "", d.style.cssText = h + "width:1px;padding:1px;display:inline;zoom:1", b.inlineBlockNeedsLayout = d.offsetWidth === 3, d.style.display = "block", d.style.overflow = "visible", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", b.shrinkWrapBlocks = d.offsetWidth !== 3, c.style.zoom = 1), i.removeChild(c), c = d = f = g = null
        }), i.removeChild(n), c = d = f = g = h = i = n = null, b
    }();
    var H = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, I = /([A-Z])/g;
    p.extend({cache: {}, deletedIds: [], uuid: 0, expando: "jQuery" + (p.fn.jquery + Math.random()).replace(/\D/g, ""), noData: {embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet: !0}, hasData: function (a) {
        return a = a.nodeType ? p.cache[a[p.expando]] : a[p.expando], !!a && !K(a)
    }, data: function (a, c, d, e) {
        if (!p.acceptData(a))return;
        var f, g, h = p.expando, i = typeof c == "string", j = a.nodeType, k = j ? p.cache : a, l = j ? a[h] : a[h] && h;
        if ((!l || !k[l] || !e && !k[l].data) && i && d === b)return;
        l || (j ? a[h] = l = p.deletedIds.pop() || p.guid++ : l = h), k[l] || (k[l] = {}, j || (k[l].toJSON = p.noop));
        if (typeof c == "object" || typeof c == "function")e ? k[l] = p.extend(k[l], c) : k[l].data = p.extend(k[l].data, c);
        return f = k[l], e || (f.data || (f.data = {}), f = f.data), d !== b && (f[p.camelCase(c)] = d), i ? (g = f[c], g == null && (g = f[p.camelCase(c)])) : g = f, g
    }, removeData: function (a, b, c) {
        if (!p.acceptData(a))return;
        var d, e, f, g = a.nodeType, h = g ? p.cache : a, i = g ? a[p.expando] : p.expando;
        if (!h[i])return;
        if (b) {
            d = c ? h[i] : h[i].data;
            if (d) {
                p.isArray(b) || (b in d ? b = [b] : (b = p.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
                for (e = 0, f = b.length; e < f; e++)delete d[b[e]];
                if (!(c ? K : p.isEmptyObject)(d))return
            }
        }
        if (!c) {
            delete h[i].data;
            if (!K(h[i]))return
        }
        g ? p.cleanData([a], !0) : p.support.deleteExpando || h != h.window ? delete h[i] : h[i] = null
    }, _data: function (a, b, c) {
        return p.data(a, b, c, !0)
    }, acceptData: function (a) {
        var b = a.nodeName && p.noData[a.nodeName.toLowerCase()];
        return!b || b !== !0 && a.getAttribute("classid") === b
    }}), p.fn.extend({data: function (a, c) {
        var d, e, f, g, h, i = this[0], j = 0, k = null;
        if (a === b) {
            if (this.length) {
                k = p.data(i);
                if (i.nodeType === 1 && !p._data(i, "parsedAttrs")) {
                    f = i.attributes;
                    for (h = f.length; j < h; j++)g = f[j].name, g.indexOf("data-") || (g = p.camelCase(g.substring(5)), J(i, g, k[g]));
                    p._data(i, "parsedAttrs", !0)
                }
            }
            return k
        }
        return typeof a == "object" ? this.each(function () {
            p.data(this, a)
        }) : (d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!", p.access(this, function (c) {
            if (c === b)return k = this.triggerHandler("getData" + e, [d[0]]), k === b && i && (k = p.data(i, a), k = J(i, a, k)), k === b && d[1] ? this.data(d[0]) : k;
            d[1] = c, this.each(function () {
                var b = p(this);
                b.triggerHandler("setData" + e, d), p.data(this, a, c), b.triggerHandler("changeData" + e, d)
            })
        }, null, c, arguments.length > 1, null, !1))
    }, removeData: function (a) {
        return this.each(function () {
            p.removeData(this, a)
        })
    }}), p.extend({queue: function (a, b, c) {
        var d;
        if (a)return b = (b || "fx") + "queue", d = p._data(a, b), c && (!d || p.isArray(c) ? d = p._data(a, b, p.makeArray(c)) : d.push(c)), d || []
    }, dequeue: function (a, b) {
        b = b || "fx";
        var c = p.queue(a, b), d = c.length, e = c.shift(), f = p._queueHooks(a, b), g = function () {
            p.dequeue(a, b)
        };
        e === "inprogress" && (e = c.shift(), d--), e && (b === "fx" && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
    }, _queueHooks: function (a, b) {
        var c = b + "queueHooks";
        return p._data(a, c) || p._data(a, c, {empty: p.Callbacks("once memory").add(function () {
            p.removeData(a, b + "queue", !0), p.removeData(a, c, !0)
        })})
    }}), p.fn.extend({queue: function (a, c) {
        var d = 2;
        return typeof a != "string" && (c = a, a = "fx", d--), arguments.length < d ? p.queue(this[0], a) : c === b ? this : this.each(function () {
            var b = p.queue(this, a, c);
            p._queueHooks(this, a), a === "fx" && b[0] !== "inprogress" && p.dequeue(this, a)
        })
    }, dequeue: function (a) {
        return this.each(function () {
            p.dequeue(this, a)
        })
    }, delay: function (a, b) {
        return a = p.fx ? p.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
            var d = setTimeout(b, a);
            c.stop = function () {
                clearTimeout(d)
            }
        })
    }, clearQueue: function (a) {
        return this.queue(a || "fx", [])
    }, promise: function (a, c) {
        var d, e = 1, f = p.Deferred(), g = this, h = this.length, i = function () {
            --e || f.resolveWith(g, [g])
        };
        typeof a != "string" && (c = a, a = b), a = a || "fx";
        while (h--)d = p._data(g[h], a + "queueHooks"), d && d.empty && (e++, d.empty.add(i));
        return i(), f.promise(c)
    }});
    var L, M, N, O = /[\t\r\n]/g, P = /\r/g, Q = /^(?:button|input)$/i, R = /^(?:button|input|object|select|textarea)$/i, S = /^a(?:rea|)$/i, T = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, U = p.support.getSetAttribute;
    p.fn.extend({attr: function (a, b) {
        return p.access(this, p.attr, a, b, arguments.length > 1)
    }, removeAttr: function (a) {
        return this.each(function () {
            p.removeAttr(this, a)
        })
    }, prop: function (a, b) {
        return p.access(this, p.prop, a, b, arguments.length > 1)
    }, removeProp: function (a) {
        return a = p.propFix[a] || a, this.each(function () {
            try {
                this[a] = b, delete this[a]
            } catch (c) {
            }
        })
    }, addClass: function (a) {
        var b, c, d, e, f, g, h;
        if (p.isFunction(a))return this.each(function (b) {
            p(this).addClass(a.call(this, b, this.className))
        });
        if (a && typeof a == "string") {
            b = a.split(s);
            for (c = 0, d = this.length; c < d; c++) {
                e = this[c];
                if (e.nodeType === 1)if (!e.className && b.length === 1)e.className = a; else {
                    f = " " + e.className + " ";
                    for (g = 0, h = b.length; g < h; g++)f.indexOf(" " + b[g] + " ") < 0 && (f += b[g] + " ");
                    e.className = p.trim(f)
                }
            }
        }
        return this
    }, removeClass: function (a) {
        var c, d, e, f, g, h, i;
        if (p.isFunction(a))return this.each(function (b) {
            p(this).removeClass(a.call(this, b, this.className))
        });
        if (a && typeof a == "string" || a === b) {
            c = (a || "").split(s);
            for (h = 0, i = this.length; h < i; h++) {
                e = this[h];
                if (e.nodeType === 1 && e.className) {
                    d = (" " + e.className + " ").replace(O, " ");
                    for (f = 0, g = c.length; f < g; f++)while (d.indexOf(" " + c[f] + " ") >= 0)d = d.replace(" " + c[f] + " ", " ");
                    e.className = a ? p.trim(d) : ""
                }
            }
        }
        return this
    }, toggleClass: function (a, b) {
        var c = typeof a, d = typeof b == "boolean";
        return p.isFunction(a) ? this.each(function (c) {
            p(this).toggleClass(a.call(this, c, this.className, b), b)
        }) : this.each(function () {
            if (c === "string") {
                var e, f = 0, g = p(this), h = b, i = a.split(s);
                while (e = i[f++])h = d ? h : !g.hasClass(e), g[h ? "addClass" : "removeClass"](e)
            } else if (c === "undefined" || c === "boolean")this.className && p._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : p._data(this, "__className__") || ""
        })
    }, hasClass: function (a) {
        var b = " " + a + " ", c = 0, d = this.length;
        for (; c < d; c++)if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(O, " ").indexOf(b) >= 0)return!0;
        return!1
    }, val: function (a) {
        var c, d, e, f = this[0];
        if (!arguments.length) {
            if (f)return c = p.valHooks[f.type] || p.valHooks[f.nodeName.toLowerCase()], c && "get"in c && (d = c.get(f, "value")) !== b ? d : (d = f.value, typeof d == "string" ? d.replace(P, "") : d == null ? "" : d);
            return
        }
        return e = p.isFunction(a), this.each(function (d) {
            var f, g = p(this);
            if (this.nodeType !== 1)return;
            e ? f = a.call(this, d, g.val()) : f = a, f == null ? f = "" : typeof f == "number" ? f += "" : p.isArray(f) && (f = p.map(f, function (a) {
                return a == null ? "" : a + ""
            })), c = p.valHooks[this.type] || p.valHooks[this.nodeName.toLowerCase()];
            if (!c || !("set"in c) || c.set(this, f, "value") === b)this.value = f
        })
    }}), p.extend({valHooks: {option: {get: function (a) {
        var b = a.attributes.value;
        return!b || b.specified ? a.value : a.text
    }}, select: {get: function (a) {
        var b, c, d, e, f = a.selectedIndex, g = [], h = a.options, i = a.type === "select-one";
        if (f < 0)return null;
        c = i ? f : 0, d = i ? f + 1 : h.length;
        for (; c < d; c++) {
            e = h[c];
            if (e.selected && (p.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !p.nodeName(e.parentNode, "optgroup"))) {
                b = p(e).val();
                if (i)return b;
                g.push(b)
            }
        }
        return i && !g.length && h.length ? p(h[f]).val() : g
    }, set: function (a, b) {
        var c = p.makeArray(b);
        return p(a).find("option").each(function () {
            this.selected = p.inArray(p(this).val(), c) >= 0
        }), c.length || (a.selectedIndex = -1), c
    }}}, attrFn: {}, attr: function (a, c, d, e) {
        var f, g, h, i = a.nodeType;
        if (!a || i === 3 || i === 8 || i === 2)return;
        if (e && p.isFunction(p.fn[c]))return p(a)[c](d);
        if (typeof a.getAttribute == "undefined")return p.prop(a, c, d);
        h = i !== 1 || !p.isXMLDoc(a), h && (c = c.toLowerCase(), g = p.attrHooks[c] || (T.test(c) ? M : L));
        if (d !== b) {
            if (d === null) {
                p.removeAttr(a, c);
                return
            }
            return g && "set"in g && h && (f = g.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ""), d)
        }
        return g && "get"in g && h && (f = g.get(a, c)) !== null ? f : (f = a.getAttribute(c), f === null ? b : f)
    }, removeAttr: function (a, b) {
        var c, d, e, f, g = 0;
        if (b && a.nodeType === 1) {
            d = b.split(s);
            for (; g < d.length; g++)e = d[g], e && (c = p.propFix[e] || e, f = T.test(e), f || p.attr(a, e, ""), a.removeAttribute(U ? e : c), f && c in a && (a[c] = !1))
        }
    }, attrHooks: {type: {set: function (a, b) {
        if (Q.test(a.nodeName) && a.parentNode)p.error("type property can't be changed"); else if (!p.support.radioValue && b === "radio" && p.nodeName(a, "input")) {
            var c = a.value;
            return a.setAttribute("type", b), c && (a.value = c), b
        }
    }}, value: {get: function (a, b) {
        return L && p.nodeName(a, "button") ? L.get(a, b) : b in a ? a.value : null
    }, set: function (a, b, c) {
        if (L && p.nodeName(a, "button"))return L.set(a, b, c);
        a.value = b
    }}}, propFix: {tabindex: "tabIndex", readonly: "readOnly", "for": "htmlFor", "class": "className", maxlength: "maxLength", cellspacing: "cellSpacing", cellpadding: "cellPadding", rowspan: "rowSpan", colspan: "colSpan", usemap: "useMap", frameborder: "frameBorder", contenteditable: "contentEditable"}, prop: function (a, c, d) {
        var e, f, g, h = a.nodeType;
        if (!a || h === 3 || h === 8 || h === 2)return;
        return g = h !== 1 || !p.isXMLDoc(a), g && (c = p.propFix[c] || c, f = p.propHooks[c]), d !== b ? f && "set"in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get"in f && (e = f.get(a, c)) !== null ? e : a[c]
    }, propHooks: {tabIndex: {get: function (a) {
        var c = a.getAttributeNode("tabindex");
        return c && c.specified ? parseInt(c.value, 10) : R.test(a.nodeName) || S.test(a.nodeName) && a.href ? 0 : b
    }}}}), M = {get: function (a, c) {
        var d, e = p.prop(a, c);
        return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
    }, set: function (a, b, c) {
        var d;
        return b === !1 ? p.removeAttr(a, c) : (d = p.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())), c
    }}, U || (N = {name: !0, id: !0, coords: !0}, L = p.valHooks.button = {get: function (a, c) {
        var d;
        return d = a.getAttributeNode(c), d && (N[c] ? d.value !== "" : d.specified) ? d.value : b
    }, set: function (a, b, c) {
        var d = a.getAttributeNode(c);
        return d || (d = e.createAttribute(c), a.setAttributeNode(d)), d.value = b + ""
    }}, p.each(["width", "height"], function (a, b) {
        p.attrHooks[b] = p.extend(p.attrHooks[b], {set: function (a, c) {
            if (c === "")return a.setAttribute(b, "auto"), c
        }})
    }), p.attrHooks.contenteditable = {get: L.get, set: function (a, b, c) {
        b === "" && (b = "false"), L.set(a, b, c)
    }}), p.support.hrefNormalized || p.each(["href", "src", "width", "height"], function (a, c) {
        p.attrHooks[c] = p.extend(p.attrHooks[c], {get: function (a) {
            var d = a.getAttribute(c, 2);
            return d === null ? b : d
        }})
    }), p.support.style || (p.attrHooks.style = {get: function (a) {
        return a.style.cssText.toLowerCase() || b
    }, set: function (a, b) {
        return a.style.cssText = b + ""
    }}), p.support.optSelected || (p.propHooks.selected = p.extend(p.propHooks.selected, {get: function (a) {
        var b = a.parentNode;
        return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
    }})), p.support.enctype || (p.propFix.enctype = "encoding"), p.support.checkOn || p.each(["radio", "checkbox"], function () {
        p.valHooks[this] = {get: function (a) {
            return a.getAttribute("value") === null ? "on" : a.value
        }}
    }), p.each(["radio", "checkbox"], function () {
        p.valHooks[this] = p.extend(p.valHooks[this], {set: function (a, b) {
            if (p.isArray(b))return a.checked = p.inArray(p(a).val(), b) >= 0
        }})
    });
    var V = /^(?:textarea|input|select)$/i, W = /^([^\.]*|)(?:\.(.+)|)$/, X = /(?:^|\s)hover(\.\S+|)\b/, Y = /^key/, Z = /^(?:mouse|contextmenu)|click/, $ = /^(?:focusinfocus|focusoutblur)$/, _ = function (a) {
        return p.event.special.hover ? a : a.replace(X, "mouseenter$1 mouseleave$1")
    };
    p.event = {add: function (a, c, d, e, f) {
        var g, h, i, j, k, l, m, n, o, q, r;
        if (a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(g = p._data(a)))return;
        d.handler && (o = d, d = o.handler, f = o.selector), d.guid || (d.guid = p.guid++), i = g.events, i || (g.events = i = {}), h = g.handle, h || (g.handle = h = function (a) {
            return typeof p != "undefined" && (!a || p.event.triggered !== a.type) ? p.event.dispatch.apply(h.elem, arguments) : b
        }, h.elem = a), c = p.trim(_(c)).split(" ");
        for (j = 0; j < c.length; j++) {
            k = W.exec(c[j]) || [], l = k[1], m = (k[2] || "").split(".").sort(), r = p.event.special[l] || {}, l = (f ? r.delegateType : r.bindType) || l, r = p.event.special[l] || {}, n = p.extend({type: l, origType: k[1], data: e, handler: d, guid: d.guid, selector: f, needsContext: f && p.expr.match.needsContext.test(f), namespace: m.join(".")}, o), q = i[l];
            if (!q) {
                q = i[l] = [], q.delegateCount = 0;
                if (!r.setup || r.setup.call(a, e, m, h) === !1)a.addEventListener ? a.addEventListener(l, h, !1) : a.attachEvent && a.attachEvent("on" + l, h)
            }
            r.add && (r.add.call(a, n), n.handler.guid || (n.handler.guid = d.guid)), f ? q.splice(q.delegateCount++, 0, n) : q.push(n), p.event.global[l] = !0
        }
        a = null
    }, global: {}, remove: function (a, b, c, d, e) {
        var f, g, h, i, j, k, l, m, n, o, q, r = p.hasData(a) && p._data(a);
        if (!r || !(m = r.events))return;
        b = p.trim(_(b || "")).split(" ");
        for (f = 0; f < b.length; f++) {
            g = W.exec(b[f]) || [], h = i = g[1], j = g[2];
            if (!h) {
                for (h in m)p.event.remove(a, h + b[f], c, d, !0);
                continue
            }
            n = p.event.special[h] || {}, h = (d ? n.delegateType : n.bindType) || h, o = m[h] || [], k = o.length, j = j ? new RegExp("(^|\\.)" + j.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            for (l = 0; l < o.length; l++)q = o[l], (e || i === q.origType) && (!c || c.guid === q.guid) && (!j || j.test(q.namespace)) && (!d || d === q.selector || d === "**" && q.selector) && (o.splice(l--, 1), q.selector && o.delegateCount--, n.remove && n.remove.call(a, q));
            o.length === 0 && k !== o.length && ((!n.teardown || n.teardown.call(a, j, r.handle) === !1) && p.removeEvent(a, h, r.handle), delete m[h])
        }
        p.isEmptyObject(m) && (delete r.handle, p.removeData(a, "events", !0))
    }, customEvent: {getData: !0, setData: !0, changeData: !0}, trigger: function (c, d, f, g) {
        if (!f || f.nodeType !== 3 && f.nodeType !== 8) {
            var h, i, j, k, l, m, n, o, q, r, s = c.type || c, t = [];
            if ($.test(s + p.event.triggered))return;
            s.indexOf("!") >= 0 && (s = s.slice(0, -1), i = !0), s.indexOf(".") >= 0 && (t = s.split("."), s = t.shift(), t.sort());
            if ((!f || p.event.customEvent[s]) && !p.event.global[s])return;
            c = typeof c == "object" ? c[p.expando] ? c : new p.Event(s, c) : new p.Event(s), c.type = s, c.isTrigger = !0, c.exclusive = i, c.namespace = t.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + t.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, m = s.indexOf(":") < 0 ? "on" + s : "";
            if (!f) {
                h = p.cache;
                for (j in h)h[j].events && h[j].events[s] && p.event.trigger(c, d, h[j].handle.elem, !0);
                return
            }
            c.result = b, c.target || (c.target = f), d = d != null ? p.makeArray(d) : [], d.unshift(c), n = p.event.special[s] || {};
            if (n.trigger && n.trigger.apply(f, d) === !1)return;
            q = [
                [f, n.bindType || s]
            ];
            if (!g && !n.noBubble && !p.isWindow(f)) {
                r = n.delegateType || s, k = $.test(r + s) ? f : f.parentNode;
                for (l = f; k; k = k.parentNode)q.push([k, r]), l = k;
                l === (f.ownerDocument || e) && q.push([l.defaultView || l.parentWindow || a, r])
            }
            for (j = 0; j < q.length && !c.isPropagationStopped(); j++)k = q[j][0], c.type = q[j][1], o = (p._data(k, "events") || {})[c.type] && p._data(k, "handle"), o && o.apply(k, d), o = m && k[m], o && p.acceptData(k) && o.apply && o.apply(k, d) === !1 && c.preventDefault();
            return c.type = s, !g && !c.isDefaultPrevented() && (!n._default || n._default.apply(f.ownerDocument, d) === !1) && (s !== "click" || !p.nodeName(f, "a")) && p.acceptData(f) && m && f[s] && (s !== "focus" && s !== "blur" || c.target.offsetWidth !== 0) && !p.isWindow(f) && (l = f[m], l && (f[m] = null), p.event.triggered = s, f[s](), p.event.triggered = b, l && (f[m] = l)), c.result
        }
        return
    }, dispatch: function (c) {
        c = p.event.fix(c || a.event);
        var d, e, f, g, h, i, j, l, m, n, o = (p._data(this, "events") || {})[c.type] || [], q = o.delegateCount, r = k.call(arguments), s = !c.exclusive && !c.namespace, t = p.event.special[c.type] || {}, u = [];
        r[0] = c, c.delegateTarget = this;
        if (t.preDispatch && t.preDispatch.call(this, c) === !1)return;
        if (q && (!c.button || c.type !== "click"))for (f = c.target; f != this; f = f.parentNode || this)if (f.disabled !== !0 || c.type !== "click") {
            h = {}, j = [];
            for (d = 0; d < q; d++)l = o[d], m = l.selector, h[m] === b && (h[m] = l.needsContext ? p(m, this).index(f) >= 0 : p.find(m, this, null, [f]).length), h[m] && j.push(l);
            j.length && u.push({elem: f, matches: j})
        }
        o.length > q && u.push({elem: this, matches: o.slice(q)});
        for (d = 0; d < u.length && !c.isPropagationStopped(); d++) {
            i = u[d], c.currentTarget = i.elem;
            for (e = 0; e < i.matches.length && !c.isImmediatePropagationStopped(); e++) {
                l = i.matches[e];
                if (s || !c.namespace && !l.namespace || c.namespace_re && c.namespace_re.test(l.namespace))c.data = l.data, c.handleObj = l, g = ((p.event.special[l.origType] || {}).handle || l.handler).apply(i.elem, r), g !== b && (c.result = g, g === !1 && (c.preventDefault(), c.stopPropagation()))
            }
        }
        return t.postDispatch && t.postDispatch.call(this, c), c.result
    }, props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: {props: "char charCode key keyCode".split(" "), filter: function (a, b) {
        return a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode), a
    }}, mouseHooks: {props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (a, c) {
        var d, f, g, h = c.button, i = c.fromElement;
        return a.pageX == null && c.clientX != null && (d = a.target.ownerDocument || e, f = d.documentElement, g = d.body, a.pageX = c.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = c.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? c.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0), a
    }}, fix: function (a) {
        if (a[p.expando])return a;
        var b, c, d = a, f = p.event.fixHooks[a.type] || {}, g = f.props ? this.props.concat(f.props) : this.props;
        a = p.Event(d);
        for (b = g.length; b;)c = g[--b], a[c] = d[c];
        return a.target || (a.target = d.srcElement || e), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, f.filter ? f.filter(a, d) : a
    }, special: {load: {noBubble: !0}, focus: {delegateType: "focusin"}, blur: {delegateType: "focusout"}, beforeunload: {setup: function (a, b, c) {
        p.isWindow(this) && (this.onbeforeunload = c)
    }, teardown: function (a, b) {
        this.onbeforeunload === b && (this.onbeforeunload = null)
    }}}, simulate: function (a, b, c, d) {
        var e = p.extend(new p.Event, c, {type: a, isSimulated: !0, originalEvent: {}});
        d ? p.event.trigger(e, null, b) : p.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
    }}, p.event.handle = p.event.dispatch, p.removeEvent = e.removeEventListener ? function (a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function (a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] == "undefined" && (a[d] = null), a.detachEvent(d, c))
    }, p.Event = function (a, b) {
        if (this instanceof p.Event)a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? bb : ba) : this.type = a, b && p.extend(this, b), this.timeStamp = a && a.timeStamp || p.now(), this[p.expando] = !0; else return new p.Event(a, b)
    }, p.Event.prototype = {preventDefault: function () {
        this.isDefaultPrevented = bb;
        var a = this.originalEvent;
        if (!a)return;
        a.preventDefault ? a.preventDefault() : a.returnValue = !1
    }, stopPropagation: function () {
        this.isPropagationStopped = bb;
        var a = this.originalEvent;
        if (!a)return;
        a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0
    }, stopImmediatePropagation: function () {
        this.isImmediatePropagationStopped = bb, this.stopPropagation()
    }, isDefaultPrevented: ba, isPropagationStopped: ba, isImmediatePropagationStopped: ba}, p.each({mouseenter: "mouseover", mouseleave: "mouseout"}, function (a, b) {
        p.event.special[a] = {delegateType: b, bindType: b, handle: function (a) {
            var c, d = this, e = a.relatedTarget, f = a.handleObj, g = f.selector;
            if (!e || e !== d && !p.contains(d, e))a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b;
            return c
        }}
    }), p.support.submitBubbles || (p.event.special.submit = {setup: function () {
        if (p.nodeName(this, "form"))return!1;
        p.event.add(this, "click._submit keypress._submit", function (a) {
            var c = a.target, d = p.nodeName(c, "input") || p.nodeName(c, "button") ? c.form : b;
            d && !p._data(d, "_submit_attached") && (p.event.add(d, "submit._submit", function (a) {
                a._submit_bubble = !0
            }), p._data(d, "_submit_attached", !0))
        })
    }, postDispatch: function (a) {
        a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && p.event.simulate("submit", this.parentNode, a, !0))
    }, teardown: function () {
        if (p.nodeName(this, "form"))return!1;
        p.event.remove(this, "._submit")
    }}), p.support.changeBubbles || (p.event.special.change = {setup: function () {
        if (V.test(this.nodeName)) {
            if (this.type === "checkbox" || this.type === "radio")p.event.add(this, "propertychange._change", function (a) {
                a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
            }), p.event.add(this, "click._change", function (a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1), p.event.simulate("change", this, a, !0)
            });
            return!1
        }
        p.event.add(this, "beforeactivate._change", function (a) {
            var b = a.target;
            V.test(b.nodeName) && !p._data(b, "_change_attached") && (p.event.add(b, "change._change", function (a) {
                this.parentNode && !a.isSimulated && !a.isTrigger && p.event.simulate("change", this.parentNode, a, !0)
            }), p._data(b, "_change_attached", !0))
        })
    }, handle: function (a) {
        var b = a.target;
        if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox")return a.handleObj.handler.apply(this, arguments)
    }, teardown: function () {
        return p.event.remove(this, "._change"), !V.test(this.nodeName)
    }}), p.support.focusinBubbles || p.each({focus: "focusin", blur: "focusout"}, function (a, b) {
        var c = 0, d = function (a) {
            p.event.simulate(b, a.target, p.event.fix(a), !0)
        };
        p.event.special[b] = {setup: function () {
            c++ === 0 && e.addEventListener(a, d, !0)
        }, teardown: function () {
            --c === 0 && e.removeEventListener(a, d, !0)
        }}
    }), p.fn.extend({on: function (a, c, d, e, f) {
        var g, h;
        if (typeof a == "object") {
            typeof c != "string" && (d = d || c, c = b);
            for (h in a)this.on(h, c, d, a[h], f);
            return this
        }
        d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
        if (e === !1)e = ba; else if (!e)return this;
        return f === 1 && (g = e, e = function (a) {
            return p().off(a), g.apply(this, arguments)
        }, e.guid = g.guid || (g.guid = p.guid++)), this.each(function () {
            p.event.add(this, a, e, d, c)
        })
    }, one: function (a, b, c, d) {
        return this.on(a, b, c, d, 1)
    }, off: function (a, c, d) {
        var e, f;
        if (a && a.preventDefault && a.handleObj)return e = a.handleObj, p(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this;
        if (typeof a == "object") {
            for (f in a)this.off(f, c, a[f]);
            return this
        }
        if (c === !1 || typeof c == "function")d = c, c = b;
        return d === !1 && (d = ba), this.each(function () {
            p.event.remove(this, a, d, c)
        })
    }, bind: function (a, b, c) {
        return this.on(a, null, b, c)
    }, unbind: function (a, b) {
        return this.off(a, null, b)
    }, live: function (a, b, c) {
        return p(this.context).on(a, this.selector, b, c), this
    }, die: function (a, b) {
        return p(this.context).off(a, this.selector || "**", b), this
    }, delegate: function (a, b, c, d) {
        return this.on(b, a, c, d)
    }, undelegate: function (a, b, c) {
        return arguments.length === 1 ? this.off(a, "**") : this.off(b, a || "**", c)
    }, trigger: function (a, b) {
        return this.each(function () {
            p.event.trigger(a, b, this)
        })
    }, triggerHandler: function (a, b) {
        if (this[0])return p.event.trigger(a, b, this[0], !0)
    }, toggle: function (a) {
        var b = arguments, c = a.guid || p.guid++, d = 0, e = function (c) {
            var e = (p._data(this, "lastToggle" + a.guid) || 0) % d;
            return p._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1
        };
        e.guid = c;
        while (d < b.length)b[d++].guid = c;
        return this.click(e)
    }, hover: function (a, b) {
        return this.mouseenter(a).mouseleave(b || a)
    }}), p.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
        p.fn[b] = function (a, c) {
            return c == null && (c = a, a = null), arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }, Y.test(b) && (p.event.fixHooks[b] = p.event.keyHooks), Z.test(b) && (p.event.fixHooks[b] = p.event.mouseHooks)
    }), function (a, b) {
        function bc(a, b, c, d) {
            c = c || [], b = b || r;
            var e, f, i, j, k = b.nodeType;
            if (!a || typeof a != "string")return c;
            if (k !== 1 && k !== 9)return[];
            i = g(b);
            if (!i && !d)if (e = P.exec(a))if (j = e[1]) {
                if (k === 9) {
                    f = b.getElementById(j);
                    if (!f || !f.parentNode)return c;
                    if (f.id === j)return c.push(f), c
                } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(j)) && h(b, f) && f.id === j)return c.push(f), c
            } else {
                if (e[2])return w.apply(c, x.call(b.getElementsByTagName(a), 0)), c;
                if ((j = e[3]) && _ && b.getElementsByClassName)return w.apply(c, x.call(b.getElementsByClassName(j), 0)), c
            }
            return bp(a.replace(L, "$1"), b, c, d, i)
        }

        function bd(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return c === "input" && b.type === a
            }
        }

        function be(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return(c === "input" || c === "button") && b.type === a
            }
        }

        function bf(a) {
            return z(function (b) {
                return b = +b, z(function (c, d) {
                    var e, f = a([], c.length, b), g = f.length;
                    while (g--)c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }

        function bg(a, b, c) {
            if (a === b)return c;
            var d = a.nextSibling;
            while (d) {
                if (d === b)return-1;
                d = d.nextSibling
            }
            return 1
        }

        function bh(a, b) {
            var c, d, f, g, h, i, j, k = C[o][a];
            if (k)return b ? 0 : k.slice(0);
            h = a, i = [], j = e.preFilter;
            while (h) {
                if (!c || (d = M.exec(h)))d && (h = h.slice(d[0].length)), i.push(f = []);
                c = !1;
                if (d = N.exec(h))f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = d[0].replace(L, " ");
                for (g in e.filter)(d = W[g].exec(h)) && (!j[g] || (d = j[g](d, r, !0))) && (f.push(c = new q(d.shift())), h = h.slice(c.length), c.type = g, c.matches = d);
                if (!c)break
            }
            return b ? h.length : h ? bc.error(a) : C(a, i).slice(0)
        }

        function bi(a, b, d) {
            var e = b.dir, f = d && b.dir === "parentNode", g = u++;
            return b.first ? function (b, c, d) {
                while (b = b[e])if (f || b.nodeType === 1)return a(b, c, d)
            } : function (b, d, h) {
                if (!h) {
                    var i, j = t + " " + g + " ", k = j + c;
                    while (b = b[e])if (f || b.nodeType === 1) {
                        if ((i = b[o]) === k)return b.sizset;
                        if (typeof i == "string" && i.indexOf(j) === 0) {
                            if (b.sizset)return b
                        } else {
                            b[o] = k;
                            if (a(b, d, h))return b.sizset = !0, b;
                            b.sizset = !1
                        }
                    }
                } else while (b = b[e])if (f || b.nodeType === 1)if (a(b, d, h))return b
            }
        }

        function bj(a) {
            return a.length > 1 ? function (b, c, d) {
                var e = a.length;
                while (e--)if (!a[e](b, c, d))return!1;
                return!0
            } : a[0]
        }

        function bk(a, b, c, d, e) {
            var f, g = [], h = 0, i = a.length, j = b != null;
            for (; h < i; h++)if (f = a[h])if (!c || c(f, d, e))g.push(f), j && b.push(h);
            return g
        }

        function bl(a, b, c, d, e, f) {
            return d && !d[o] && (d = bl(d)), e && !e[o] && (e = bl(e, f)), z(function (f, g, h, i) {
                if (f && e)return;
                var j, k, l, m = [], n = [], o = g.length, p = f || bo(b || "*", h.nodeType ? [h] : h, [], f), q = a && (f || !b) ? bk(p, m, a, h, i) : p, r = c ? e || (f ? a : o || d) ? [] : g : q;
                c && c(q, r, h, i);
                if (d) {
                    l = bk(r, n), d(l, [], h, i), j = l.length;
                    while (j--)if (k = l[j])r[n[j]] = !(q[n[j]] = k)
                }
                if (f) {
                    j = a && r.length;
                    while (j--)if (k = r[j])f[m[j]] = !(g[m[j]] = k)
                } else r = bk(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : w.apply(g, r)
            })
        }

        function bm(a) {
            var b, c, d, f = a.length, g = e.relative[a[0].type], h = g || e.relative[" "], i = g ? 1 : 0, j = bi(function (a) {
                return a === b
            }, h, !0), k = bi(function (a) {
                return y.call(b, a) > -1
            }, h, !0), m = [function (a, c, d) {
                return!g && (d || c !== l) || ((b = c).nodeType ? j(a, c, d) : k(a, c, d))
            }];
            for (; i < f; i++)if (c = e.relative[a[i].type])m = [bi(bj(m), c)]; else {
                c = e.filter[a[i].type].apply(null, a[i].matches);
                if (c[o]) {
                    d = ++i;
                    for (; d < f; d++)if (e.relative[a[d].type])break;
                    return bl(i > 1 && bj(m), i > 1 && a.slice(0, i - 1).join("").replace(L, "$1"), c, i < d && bm(a.slice(i, d)), d < f && bm(a = a.slice(d)), d < f && a.join(""))
                }
                m.push(c)
            }
            return bj(m)
        }

        function bn(a, b) {
            var d = b.length > 0, f = a.length > 0, g = function (h, i, j, k, m) {
                var n, o, p, q = [], s = 0, u = "0", x = h && [], y = m != null, z = l, A = h || f && e.find.TAG("*", m && i.parentNode || i), B = t += z == null ? 1 : Math.E;
                y && (l = i !== r && i, c = g.el);
                for (; (n = A[u]) != null; u++) {
                    if (f && n) {
                        for (o = 0; p = a[o]; o++)if (p(n, i, j)) {
                            k.push(n);
                            break
                        }
                        y && (t = B, c = ++g.el)
                    }
                    d && ((n = !p && n) && s--, h && x.push(n))
                }
                s += u;
                if (d && u !== s) {
                    for (o = 0; p = b[o]; o++)p(x, q, i, j);
                    if (h) {
                        if (s > 0)while (u--)!x[u] && !q[u] && (q[u] = v.call(k));
                        q = bk(q)
                    }
                    w.apply(k, q), y && !h && q.length > 0 && s + b.length > 1 && bc.uniqueSort(k)
                }
                return y && (t = B, l = z), x
            };
            return g.el = 0, d ? z(g) : g
        }

        function bo(a, b, c, d) {
            var e = 0, f = b.length;
            for (; e < f; e++)bc(a, b[e], c, d);
            return c
        }

        function bp(a, b, c, d, f) {
            var g, h, j, k, l, m = bh(a), n = m.length;
            if (!d && m.length === 1) {
                h = m[0] = m[0].slice(0);
                if (h.length > 2 && (j = h[0]).type === "ID" && b.nodeType === 9 && !f && e.relative[h[1].type]) {
                    b = e.find.ID(j.matches[0].replace(V, ""), b, f)[0];
                    if (!b)return c;
                    a = a.slice(h.shift().length)
                }
                for (g = W.POS.test(a) ? -1 : h.length - 1; g >= 0; g--) {
                    j = h[g];
                    if (e.relative[k = j.type])break;
                    if (l = e.find[k])if (d = l(j.matches[0].replace(V, ""), R.test(h[0].type) && b.parentNode || b, f)) {
                        h.splice(g, 1), a = d.length && h.join("");
                        if (!a)return w.apply(c, x.call(d, 0)), c;
                        break
                    }
                }
            }
            return i(a, m)(d, b, f, c, R.test(a)), c
        }

        function bq() {
        }

        var c, d, e, f, g, h, i, j, k, l, m = !0, n = "undefined", o = ("sizcache" + Math.random()).replace(".", ""), q = String, r = a.document, s = r.documentElement, t = 0, u = 0, v = [].pop, w = [].push, x = [].slice, y = [].indexOf || function (a) {
            var b = 0, c = this.length;
            for (; b < c; b++)if (this[b] === a)return b;
            return-1
        }, z = function (a, b) {
            return a[o] = b == null || b, a
        }, A = function () {
            var a = {}, b = [];
            return z(function (c, d) {
                return b.push(c) > e.cacheLength && delete a[b.shift()], a[c] = d
            }, a)
        }, B = A(), C = A(), D = A(), E = "[\\x20\\t\\r\\n\\f]", F = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", G = F.replace("w", "w#"), H = "([*^$|!~]?=)", I = "\\[" + E + "*(" + F + ")" + E + "*(?:" + H + E + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + G + ")|)|)" + E + "*\\]", J = ":(" + F + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + I + ")|[^:]|\\\\.)*|.*))\\)|)", K = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + E + "*((?:-\\d)?\\d*)" + E + "*\\)|)(?=[^-]|$)", L = new RegExp("^" + E + "+|((?:^|[^\\\\])(?:\\\\.)*)" + E + "+$", "g"), M = new RegExp("^" + E + "*," + E + "*"), N = new RegExp("^" + E + "*([\\x20\\t\\r\\n\\f>+~])" + E + "*"), O = new RegExp(J), P = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, Q = /^:not/, R = /[\x20\t\r\n\f]*[+~]/, S = /:not\($/, T = /h\d/i, U = /input|select|textarea|button/i, V = /\\(?!\\)/g, W = {ID: new RegExp("^#(" + F + ")"), CLASS: new RegExp("^\\.(" + F + ")"), NAME: new RegExp("^\\[name=['\"]?(" + F + ")['\"]?\\]"), TAG: new RegExp("^(" + F.replace("w", "w*") + ")"), ATTR: new RegExp("^" + I), PSEUDO: new RegExp("^" + J), POS: new RegExp(K, "i"), CHILD: new RegExp("^:(only|nth|first|last)-child(?:\\(" + E + "*(even|odd|(([+-]|)(\\d*)n|)" + E + "*(?:([+-]|)" + E + "*(\\d+)|))" + E + "*\\)|)", "i"), needsContext: new RegExp("^" + E + "*[>+~]|" + K, "i")}, X = function (a) {
            var b = r.createElement("div");
            try {
                return a(b)
            } catch (c) {
                return!1
            } finally {
                b = null
            }
        }, Y = X(function (a) {
            return a.appendChild(r.createComment("")), !a.getElementsByTagName("*").length
        }), Z = X(function (a) {
            return a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute !== n && a.firstChild.getAttribute("href") === "#"
        }), $ = X(function (a) {
            a.innerHTML = "<select></select>";
            var b = typeof a.lastChild.getAttribute("multiple");
            return b !== "boolean" && b !== "string"
        }), _ = X(function (a) {
            return a.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !a.getElementsByClassName || !a.getElementsByClassName("e").length ? !1 : (a.lastChild.className = "e", a.getElementsByClassName("e").length === 2)
        }), ba = X(function (a) {
            a.id = o + 0, a.innerHTML = "<a name='" + o + "'></a><div name='" + o + "'></div>", s.insertBefore(a, s.firstChild);
            var b = r.getElementsByName && r.getElementsByName(o).length === 2 + r.getElementsByName(o + 0).length;
            return d = !r.getElementById(o), s.removeChild(a), b
        });
        try {
            x.call(s.childNodes, 0)[0].nodeType
        } catch (bb) {
            x = function (a) {
                var b, c = [];
                for (; b = this[a]; a++)c.push(b);
                return c
            }
        }
        bc.matches = function (a, b) {
            return bc(a, null, null, b)
        }, bc.matchesSelector = function (a, b) {
            return bc(b, null, null, [a]).length > 0
        }, f = bc.getText = function (a) {
            var b, c = "", d = 0, e = a.nodeType;
            if (e) {
                if (e === 1 || e === 9 || e === 11) {
                    if (typeof a.textContent == "string")return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)c += f(a)
                } else if (e === 3 || e === 4)return a.nodeValue
            } else for (; b = a[d]; d++)c += f(b);
            return c
        }, g = bc.isXML = function (a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? b.nodeName !== "HTML" : !1
        }, h = bc.contains = s.contains ? function (a, b) {
            var c = a.nodeType === 9 ? a.documentElement : a, d = b && b.parentNode;
            return a === d || !!(d && d.nodeType === 1 && c.contains && c.contains(d))
        } : s.compareDocumentPosition ? function (a, b) {
            return b && !!(a.compareDocumentPosition(b) & 16)
        } : function (a, b) {
            while (b = b.parentNode)if (b === a)return!0;
            return!1
        }, bc.attr = function (a, b) {
            var c, d = g(a);
            return d || (b = b.toLowerCase()), (c = e.attrHandle[b]) ? c(a) : d || $ ? a.getAttribute(b) : (c = a.getAttributeNode(b), c ? typeof a[b] == "boolean" ? a[b] ? b : null : c.specified ? c.value : null : null)
        }, e = bc.selectors = {cacheLength: 50, createPseudo: z, match: W, attrHandle: Z ? {} : {href: function (a) {
            return a.getAttribute("href", 2)
        }, type: function (a) {
            return a.getAttribute("type")
        }}, find: {ID: d ? function (a, b, c) {
            if (typeof b.getElementById !== n && !c) {
                var d = b.getElementById(a);
                return d && d.parentNode ? [d] : []
            }
        } : function (a, c, d) {
            if (typeof c.getElementById !== n && !d) {
                var e = c.getElementById(a);
                return e ? e.id === a || typeof e.getAttributeNode !== n && e.getAttributeNode("id").value === a ? [e] : b : []
            }
        }, TAG: Y ? function (a, b) {
            if (typeof b.getElementsByTagName !== n)return b.getElementsByTagName(a)
        } : function (a, b) {
            var c = b.getElementsByTagName(a);
            if (a === "*") {
                var d, e = [], f = 0;
                for (; d = c[f]; f++)d.nodeType === 1 && e.push(d);
                return e
            }
            return c
        }, NAME: ba && function (a, b) {
            if (typeof b.getElementsByName !== n)return b.getElementsByName(name)
        }, CLASS: _ && function (a, b, c) {
            if (typeof b.getElementsByClassName !== n && !c)return b.getElementsByClassName(a)
        }}, relative: {">": {dir: "parentNode", first: !0}, " ": {dir: "parentNode"}, "+": {dir: "previousSibling", first: !0}, "~": {dir: "previousSibling"}}, preFilter: {ATTR: function (a) {
            return a[1] = a[1].replace(V, ""), a[3] = (a[4] || a[5] || "").replace(V, ""), a[2] === "~=" && (a[3] = " " + a[3] + " "), a.slice(0, 4)
        }, CHILD: function (a) {
            return a[1] = a[1].toLowerCase(), a[1] === "nth" ? (a[2] || bc.error(a[0]), a[3] = +(a[3] ? a[4] + (a[5] || 1) : 2 * (a[2] === "even" || a[2] === "odd")), a[4] = +(a[6] + a[7] || a[2] === "odd")) : a[2] && bc.error(a[0]), a
        }, PSEUDO: function (a) {
            var b, c;
            if (W.CHILD.test(a[0]))return null;
            if (a[3])a[2] = a[3]; else if (b = a[4])O.test(b) && (c = bh(b, !0)) && (c = b.indexOf(")", b.length - c) - b.length) && (b = b.slice(0, c), a[0] = a[0].slice(0, c)), a[2] = b;
            return a.slice(0, 3)
        }}, filter: {ID: d ? function (a) {
            return a = a.replace(V, ""), function (b) {
                return b.getAttribute("id") === a
            }
        } : function (a) {
            return a = a.replace(V, ""), function (b) {
                var c = typeof b.getAttributeNode !== n && b.getAttributeNode("id");
                return c && c.value === a
            }
        }, TAG: function (a) {
            return a === "*" ? function () {
                return!0
            } : (a = a.replace(V, "").toLowerCase(), function (b) {
                return b.nodeName && b.nodeName.toLowerCase() === a
            })
        }, CLASS: function (a) {
            var b = B[o][a];
            return b || (b = B(a, new RegExp("(^|" + E + ")" + a + "(" + E + "|$)"))), function (a) {
                return b.test(a.className || typeof a.getAttribute !== n && a.getAttribute("class") || "")
            }
        }, ATTR: function (a, b, c) {
            return function (d, e) {
                var f = bc.attr(d, a);
                return f == null ? b === "!=" : b ? (f += "", b === "=" ? f === c : b === "!=" ? f !== c : b === "^=" ? c && f.indexOf(c) === 0 : b === "*=" ? c && f.indexOf(c) > -1 : b === "$=" ? c && f.substr(f.length - c.length) === c : b === "~=" ? (" " + f + " ").indexOf(c) > -1 : b === "|=" ? f === c || f.substr(0, c.length + 1) === c + "-" : !1) : !0
            }
        }, CHILD: function (a, b, c, d) {
            return a === "nth" ? function (a) {
                var b, e, f = a.parentNode;
                if (c === 1 && d === 0)return!0;
                if (f) {
                    e = 0;
                    for (b = f.firstChild; b; b = b.nextSibling)if (b.nodeType === 1) {
                        e++;
                        if (a === b)break
                    }
                }
                return e -= d, e === c || e % c === 0 && e / c >= 0
            } : function (b) {
                var c = b;
                switch (a) {
                    case"only":
                    case"first":
                        while (c = c.previousSibling)if (c.nodeType === 1)return!1;
                        if (a === "first")return!0;
                        c = b;
                    case"last":
                        while (c = c.nextSibling)if (c.nodeType === 1)return!1;
                        return!0
                }
            }
        }, PSEUDO: function (a, b) {
            var c, d = e.pseudos[a] || e.setFilters[a.toLowerCase()] || bc.error("unsupported pseudo: " + a);
            return d[o] ? d(b) : d.length > 1 ? (c = [a, a, "", b], e.setFilters.hasOwnProperty(a.toLowerCase()) ? z(function (a, c) {
                var e, f = d(a, b), g = f.length;
                while (g--)e = y.call(a, f[g]), a[e] = !(c[e] = f[g])
            }) : function (a) {
                return d(a, 0, c)
            }) : d
        }}, pseudos: {not: z(function (a) {
            var b = [], c = [], d = i(a.replace(L, "$1"));
            return d[o] ? z(function (a, b, c, e) {
                var f, g = d(a, null, e, []), h = a.length;
                while (h--)if (f = g[h])a[h] = !(b[h] = f)
            }) : function (a, e, f) {
                return b[0] = a, d(b, null, f, c), !c.pop()
            }
        }), has: z(function (a) {
            return function (b) {
                return bc(a, b).length > 0
            }
        }), contains: z(function (a) {
            return function (b) {
                return(b.textContent || b.innerText || f(b)).indexOf(a) > -1
            }
        }), enabled: function (a) {
            return a.disabled === !1
        }, disabled: function (a) {
            return a.disabled === !0
        }, checked: function (a) {
            var b = a.nodeName.toLowerCase();
            return b === "input" && !!a.checked || b === "option" && !!a.selected
        }, selected: function (a) {
            return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
        }, parent: function (a) {
            return!e.pseudos.empty(a)
        }, empty: function (a) {
            var b;
            a = a.firstChild;
            while (a) {
                if (a.nodeName > "@" || (b = a.nodeType) === 3 || b === 4)return!1;
                a = a.nextSibling
            }
            return!0
        }, header: function (a) {
            return T.test(a.nodeName)
        }, text: function (a) {
            var b, c;
            return a.nodeName.toLowerCase() === "input" && (b = a.type) === "text" && ((c = a.getAttribute("type")) == null || c.toLowerCase() === b)
        }, radio: bd("radio"), checkbox: bd("checkbox"), file: bd("file"), password: bd("password"), image: bd("image"), submit: be("submit"), reset: be("reset"), button: function (a) {
            var b = a.nodeName.toLowerCase();
            return b === "input" && a.type === "button" || b === "button"
        }, input: function (a) {
            return U.test(a.nodeName)
        }, focus: function (a) {
            var b = a.ownerDocument;
            return a === b.activeElement && (!b.hasFocus || b.hasFocus()) && (!!a.type || !!a.href)
        }, active: function (a) {
            return a === a.ownerDocument.activeElement
        }, first: bf(function (a, b, c) {
            return[0]
        }), last: bf(function (a, b, c) {
            return[b - 1]
        }), eq: bf(function (a, b, c) {
            return[c < 0 ? c + b : c]
        }), even: bf(function (a, b, c) {
            for (var d = 0; d < b; d += 2)a.push(d);
            return a
        }), odd: bf(function (a, b, c) {
            for (var d = 1; d < b; d += 2)a.push(d);
            return a
        }), lt: bf(function (a, b, c) {
            for (var d = c < 0 ? c + b : c; --d >= 0;)a.push(d);
            return a
        }), gt: bf(function (a, b, c) {
            for (var d = c < 0 ? c + b : c; ++d < b;)a.push(d);
            return a
        })}}, j = s.compareDocumentPosition ? function (a, b) {
            return a === b ? (k = !0, 0) : (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4) ? -1 : 1
        } : function (a, b) {
            if (a === b)return k = !0, 0;
            if (a.sourceIndex && b.sourceIndex)return a.sourceIndex - b.sourceIndex;
            var c, d, e = [], f = [], g = a.parentNode, h = b.parentNode, i = g;
            if (g === h)return bg(a, b);
            if (!g)return-1;
            if (!h)return 1;
            while (i)e.unshift(i), i = i.parentNode;
            i = h;
            while (i)f.unshift(i), i = i.parentNode;
            c = e.length, d = f.length;
            for (var j = 0; j < c && j < d; j++)if (e[j] !== f[j])return bg(e[j], f[j]);
            return j === c ? bg(a, f[j], -1) : bg(e[j], b, 1)
        }, [0, 0].sort(j), m = !k, bc.uniqueSort = function (a) {
            var b, c = 1;
            k = m, a.sort(j);
            if (k)for (; b = a[c]; c++)b === a[c - 1] && a.splice(c--, 1);
            return a
        }, bc.error = function (a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, i = bc.compile = function (a, b) {
            var c, d = [], e = [], f = D[o][a];
            if (!f) {
                b || (b = bh(a)), c = b.length;
                while (c--)f = bm(b[c]), f[o] ? d.push(f) : e.push(f);
                f = D(a, bn(e, d))
            }
            return f
        }, r.querySelectorAll && function () {
            var a, b = bp, c = /'|\\/g, d = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, e = [":focus"], f = [":active", ":focus"], h = s.matchesSelector || s.mozMatchesSelector || s.webkitMatchesSelector || s.oMatchesSelector || s.msMatchesSelector;
            X(function (a) {
                a.innerHTML = "<select><option selected=''></option></select>", a.querySelectorAll("[selected]").length || e.push("\\[" + E + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), a.querySelectorAll(":checked").length || e.push(":checked")
            }), X(function (a) {
                a.innerHTML = "<p test=''></p>", a.querySelectorAll("[test^='']").length && e.push("[*^$]=" + E + "*(?:\"\"|'')"), a.innerHTML = "<input type='hidden'/>", a.querySelectorAll(":enabled").length || e.push(":enabled", ":disabled")
            }), e = new RegExp(e.join("|")), bp = function (a, d, f, g, h) {
                if (!g && !h && (!e || !e.test(a))) {
                    var i, j, k = !0, l = o, m = d, n = d.nodeType === 9 && a;
                    if (d.nodeType === 1 && d.nodeName.toLowerCase() !== "object") {
                        i = bh(a), (k = d.getAttribute("id")) ? l = k.replace(c, "\\$&") : d.setAttribute("id", l), l = "[id='" + l + "'] ", j = i.length;
                        while (j--)i[j] = l + i[j].join("");
                        m = R.test(a) && d.parentNode || d, n = i.join(",")
                    }
                    if (n)try {
                        return w.apply(f, x.call(m.querySelectorAll(n), 0)), f
                    } catch (p) {
                    } finally {
                        k || d.removeAttribute("id")
                    }
                }
                return b(a, d, f, g, h)
            }, h && (X(function (b) {
                a = h.call(b, "div");
                try {
                    h.call(b, "[test!='']:sizzle"), f.push("!=", J)
                } catch (c) {
                }
            }), f = new RegExp(f.join("|")), bc.matchesSelector = function (b, c) {
                c = c.replace(d, "='$1']");
                if (!g(b) && !f.test(c) && (!e || !e.test(c)))try {
                    var i = h.call(b, c);
                    if (i || a || b.document && b.document.nodeType !== 11)return i
                } catch (j) {
                }
                return bc(c, null, null, [b]).length > 0
            })
        }(), e.pseudos.nth = e.pseudos.eq, e.filters = bq.prototype = e.pseudos, e.setFilters = new bq, bc.attr = p.attr, p.find = bc, p.expr = bc.selectors, p.expr[":"] = p.expr.pseudos, p.unique = bc.uniqueSort, p.text = bc.getText, p.isXMLDoc = bc.isXML, p.contains = bc.contains
    }(a);
    var bc = /Until$/, bd = /^(?:parents|prev(?:Until|All))/, be = /^.[^:#\[\.,]*$/, bf = p.expr.match.needsContext, bg = {children: !0, contents: !0, next: !0, prev: !0};
    p.fn.extend({find: function (a) {
        var b, c, d, e, f, g, h = this;
        if (typeof a != "string")return p(a).filter(function () {
            for (b = 0, c = h.length; b < c; b++)if (p.contains(h[b], this))return!0
        });
        g = this.pushStack("", "find", a);
        for (b = 0, c = this.length; b < c; b++) {
            d = g.length, p.find(a, this[b], g);
            if (b > 0)for (e = d; e < g.length; e++)for (f = 0; f < d; f++)if (g[f] === g[e]) {
                g.splice(e--, 1);
                break
            }
        }
        return g
    }, has: function (a) {
        var b, c = p(a, this), d = c.length;
        return this.filter(function () {
            for (b = 0; b < d; b++)if (p.contains(this, c[b]))return!0
        })
    }, not: function (a) {
        return this.pushStack(bj(this, a, !1), "not", a)
    }, filter: function (a) {
        return this.pushStack(bj(this, a, !0), "filter", a)
    }, is: function (a) {
        return!!a && (typeof a == "string" ? bf.test(a) ? p(a, this.context).index(this[0]) >= 0 : p.filter(a, this).length > 0 : this.filter(a).length > 0)
    }, closest: function (a, b) {
        var c, d = 0, e = this.length, f = [], g = bf.test(a) || typeof a != "string" ? p(a, b || this.context) : 0;
        for (; d < e; d++) {
            c = this[d];
            while (c && c.ownerDocument && c !== b && c.nodeType !== 11) {
                if (g ? g.index(c) > -1 : p.find.matchesSelector(c, a)) {
                    f.push(c);
                    break
                }
                c = c.parentNode
            }
        }
        return f = f.length > 1 ? p.unique(f) : f, this.pushStack(f, "closest", a)
    }, index: function (a) {
        return a ? typeof a == "string" ? p.inArray(this[0], p(a)) : p.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
    }, add: function (a, b) {
        var c = typeof a == "string" ? p(a, b) : p.makeArray(a && a.nodeType ? [a] : a), d = p.merge(this.get(), c);
        return this.pushStack(bh(c[0]) || bh(d[0]) ? d : p.unique(d))
    }, addBack: function (a) {
        return this.add(a == null ? this.prevObject : this.prevObject.filter(a))
    }}), p.fn.andSelf = p.fn.addBack, p.each({parent: function (a) {
        var b = a.parentNode;
        return b && b.nodeType !== 11 ? b : null
    }, parents: function (a) {
        return p.dir(a, "parentNode")
    }, parentsUntil: function (a, b, c) {
        return p.dir(a, "parentNode", c)
    }, next: function (a) {
        return bi(a, "nextSibling")
    }, prev: function (a) {
        return bi(a, "previousSibling")
    }, nextAll: function (a) {
        return p.dir(a, "nextSibling")
    }, prevAll: function (a) {
        return p.dir(a, "previousSibling")
    }, nextUntil: function (a, b, c) {
        return p.dir(a, "nextSibling", c)
    }, prevUntil: function (a, b, c) {
        return p.dir(a, "previousSibling", c)
    }, siblings: function (a) {
        return p.sibling((a.parentNode || {}).firstChild, a)
    }, children: function (a) {
        return p.sibling(a.firstChild)
    }, contents: function (a) {
        return p.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : p.merge([], a.childNodes)
    }}, function (a, b) {
        p.fn[a] = function (c, d) {
            var e = p.map(this, b, c);
            return bc.test(a) || (d = c), d && typeof d == "string" && (e = p.filter(d, e)), e = this.length > 1 && !bg[a] ? p.unique(e) : e, this.length > 1 && bd.test(a) && (e = e.reverse()), this.pushStack(e, a, k.call(arguments).join(","))
        }
    }), p.extend({filter: function (a, b, c) {
        return c && (a = ":not(" + a + ")"), b.length === 1 ? p.find.matchesSelector(b[0], a) ? [b[0]] : [] : p.find.matches(a, b)
    }, dir: function (a, c, d) {
        var e = [], f = a[c];
        while (f && f.nodeType !== 9 && (d === b || f.nodeType !== 1 || !p(f).is(d)))f.nodeType === 1 && e.push(f), f = f[c];
        return e
    }, sibling: function (a, b) {
        var c = [];
        for (; a; a = a.nextSibling)a.nodeType === 1 && a !== b && c.push(a);
        return c
    }});
    var bl = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", bm = / jQuery\d+="(?:null|\d+)"/g, bn = /^\s+/, bo = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bp = /<([\w:]+)/, bq = /<tbody/i, br = /<|&#?\w+;/, bs = /<(?:script|style|link)/i, bt = /<(?:script|object|embed|option|style)/i, bu = new RegExp("<(?:" + bl + ")[\\s/>]", "i"), bv = /^(?:checkbox|radio)$/, bw = /checked\s*(?:[^=]|=\s*.checked.)/i, bx = /\/(java|ecma)script/i, by = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, bz = {option: [1, "<select multiple='multiple'>", "</select>"], legend: [1, "<fieldset>", "</fieldset>"], thead: [1, "<table>", "</table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], area: [1, "<map>", "</map>"], _default: [0, "", ""]}, bA = bk(e), bB = bA.appendChild(e.createElement("div"));
    bz.optgroup = bz.option, bz.tbody = bz.tfoot = bz.colgroup = bz.caption = bz.thead, bz.th = bz.td, p.support.htmlSerialize || (bz._default = [1, "X<div>", "</div>"]), p.fn.extend({text: function (a) {
        return p.access(this, function (a) {
            return a === b ? p.text(this) : this.empty().append((this[0] && this[0].ownerDocument || e).createTextNode(a))
        }, null, a, arguments.length)
    }, wrapAll: function (a) {
        if (p.isFunction(a))return this.each(function (b) {
            p(this).wrapAll(a.call(this, b))
        });
        if (this[0]) {
            var b = p(a, this[0].ownerDocument).eq(0).clone(!0);
            this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                var a = this;
                while (a.firstChild && a.firstChild.nodeType === 1)a = a.firstChild;
                return a
            }).append(this)
        }
        return this
    }, wrapInner: function (a) {
        return p.isFunction(a) ? this.each(function (b) {
            p(this).wrapInner(a.call(this, b))
        }) : this.each(function () {
            var b = p(this), c = b.contents();
            c.length ? c.wrapAll(a) : b.append(a)
        })
    }, wrap: function (a) {
        var b = p.isFunction(a);
        return this.each(function (c) {
            p(this).wrapAll(b ? a.call(this, c) : a)
        })
    }, unwrap: function () {
        return this.parent().each(function () {
            p.nodeName(this, "body") || p(this).replaceWith(this.childNodes)
        }).end()
    }, append: function () {
        return this.domManip(arguments, !0, function (a) {
            (this.nodeType === 1 || this.nodeType === 11) && this.appendChild(a)
        })
    }, prepend: function () {
        return this.domManip(arguments, !0, function (a) {
            (this.nodeType === 1 || this.nodeType === 11) && this.insertBefore(a, this.firstChild)
        })
    }, before: function () {
        if (!bh(this[0]))return this.domManip(arguments, !1, function (a) {
            this.parentNode.insertBefore(a, this)
        });
        if (arguments.length) {
            var a = p.clean(arguments);
            return this.pushStack(p.merge(a, this), "before", this.selector)
        }
    }, after: function () {
        if (!bh(this[0]))return this.domManip(arguments, !1, function (a) {
            this.parentNode.insertBefore(a, this.nextSibling)
        });
        if (arguments.length) {
            var a = p.clean(arguments);
            return this.pushStack(p.merge(this, a), "after", this.selector)
        }
    }, remove: function (a, b) {
        var c, d = 0;
        for (; (c = this[d]) != null; d++)if (!a || p.filter(a, [c]).length)!b && c.nodeType === 1 && (p.cleanData(c.getElementsByTagName("*")), p.cleanData([c])), c.parentNode && c.parentNode.removeChild(c);
        return this
    }, empty: function () {
        var a, b = 0;
        for (; (a = this[b]) != null; b++) {
            a.nodeType === 1 && p.cleanData(a.getElementsByTagName("*"));
            while (a.firstChild)a.removeChild(a.firstChild)
        }
        return this
    }, clone: function (a, b) {
        return a = a == null ? !1 : a, b = b == null ? a : b, this.map(function () {
            return p.clone(this, a, b)
        })
    }, html: function (a) {
        return p.access(this, function (a) {
            var c = this[0] || {}, d = 0, e = this.length;
            if (a === b)return c.nodeType === 1 ? c.innerHTML.replace(bm, "") : b;
            if (typeof a == "string" && !bs.test(a) && (p.support.htmlSerialize || !bu.test(a)) && (p.support.leadingWhitespace || !bn.test(a)) && !bz[(bp.exec(a) || ["", ""])[1].toLowerCase()]) {
                a = a.replace(bo, "<$1></$2>");
                try {
                    for (; d < e; d++)c = this[d] || {}, c.nodeType === 1 && (p.cleanData(c.getElementsByTagName("*")), c.innerHTML = a);
                    c = 0
                } catch (f) {
                }
            }
            c && this.empty().append(a)
        }, null, a, arguments.length)
    }, replaceWith: function (a) {
        return bh(this[0]) ? this.length ? this.pushStack(p(p.isFunction(a) ? a() : a), "replaceWith", a) : this : p.isFunction(a) ? this.each(function (b) {
            var c = p(this), d = c.html();
            c.replaceWith(a.call(this, b, d))
        }) : (typeof a != "string" && (a = p(a).detach()), this.each(function () {
            var b = this.nextSibling, c = this.parentNode;
            p(this).remove(), b ? p(b).before(a) : p(c).append(a)
        }))
    }, detach: function (a) {
        return this.remove(a, !0)
    }, domManip: function (a, c, d) {
        a = [].concat.apply([], a);
        var e, f, g, h, i = 0, j = a[0], k = [], l = this.length;
        if (!p.support.checkClone && l > 1 && typeof j == "string" && bw.test(j))return this.each(function () {
            p(this).domManip(a, c, d)
        });
        if (p.isFunction(j))return this.each(function (e) {
            var f = p(this);
            a[0] = j.call(this, e, c ? f.html() : b), f.domManip(a, c, d)
        });
        if (this[0]) {
            e = p.buildFragment(a, this, k), g = e.fragment, f = g.firstChild, g.childNodes.length === 1 && (g = f);
            if (f) {
                c = c && p.nodeName(f, "tr");
                for (h = e.cacheable || l - 1; i < l; i++)d.call(c && p.nodeName(this[i], "table") ? bC(this[i], "tbody") : this[i], i === h ? g : p.clone(g, !0, !0))
            }
            g = f = null, k.length && p.each(k, function (a, b) {
                b.src ? p.ajax ? p.ajax({url: b.src, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0}) : p.error("no ajax") : p.globalEval((b.text || b.textContent || b.innerHTML || "").replace(by, "")), b.parentNode && b.parentNode.removeChild(b)
            })
        }
        return this
    }}), p.buildFragment = function (a, c, d) {
        var f, g, h, i = a[0];
        return c = c || e, c = !c.nodeType && c[0] || c, c = c.ownerDocument || c, a.length === 1 && typeof i == "string" && i.length < 512 && c === e && i.charAt(0) === "<" && !bt.test(i) && (p.support.checkClone || !bw.test(i)) && (p.support.html5Clone || !bu.test(i)) && (g = !0, f = p.fragments[i], h = f !== b), f || (f = c.createDocumentFragment(), p.clean(a, c, f, d), g && (p.fragments[i] = h && f)), {fragment: f, cacheable: g}
    }, p.fragments = {}, p.each({appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith"}, function (a, b) {
        p.fn[a] = function (c) {
            var d, e = 0, f = [], g = p(c), h = g.length, i = this.length === 1 && this[0].parentNode;
            if ((i == null || i && i.nodeType === 11 && i.childNodes.length === 1) && h === 1)return g[b](this[0]), this;
            for (; e < h; e++)d = (e > 0 ? this.clone(!0) : this).get(), p(g[e])[b](d), f = f.concat(d);
            return this.pushStack(f, a, g.selector)
        }
    }), p.extend({clone: function (a, b, c) {
        var d, e, f, g;
        p.support.html5Clone || p.isXMLDoc(a) || !bu.test("<" + a.nodeName + ">") ? g = a.cloneNode(!0) : (bB.innerHTML = a.outerHTML, bB.removeChild(g = bB.firstChild));
        if ((!p.support.noCloneEvent || !p.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !p.isXMLDoc(a)) {
            bE(a, g), d = bF(a), e = bF(g);
            for (f = 0; d[f]; ++f)e[f] && bE(d[f], e[f])
        }
        if (b) {
            bD(a, g);
            if (c) {
                d = bF(a), e = bF(g);
                for (f = 0; d[f]; ++f)bD(d[f], e[f])
            }
        }
        return d = e = null, g
    }, clean: function (a, b, c, d) {
        var f, g, h, i, j, k, l, m, n, o, q, r, s = b === e && bA, t = [];
        if (!b || typeof b.createDocumentFragment == "undefined")b = e;
        for (f = 0; (h = a[f]) != null; f++) {
            typeof h == "number" && (h += "");
            if (!h)continue;
            if (typeof h == "string")if (!br.test(h))h = b.createTextNode(h); else {
                s = s || bk(b), l = b.createElement("div"), s.appendChild(l), h = h.replace(bo, "<$1></$2>"), i = (bp.exec(h) || ["", ""])[1].toLowerCase(), j = bz[i] || bz._default, k = j[0], l.innerHTML = j[1] + h + j[2];
                while (k--)l = l.lastChild;
                if (!p.support.tbody) {
                    m = bq.test(h), n = i === "table" && !m ? l.firstChild && l.firstChild.childNodes : j[1] === "<table>" && !m ? l.childNodes : [];
                    for (g = n.length - 1; g >= 0; --g)p.nodeName(n[g], "tbody") && !n[g].childNodes.length && n[g].parentNode.removeChild(n[g])
                }
                !p.support.leadingWhitespace && bn.test(h) && l.insertBefore(b.createTextNode(bn.exec(h)[0]), l.firstChild), h = l.childNodes, l.parentNode.removeChild(l)
            }
            h.nodeType ? t.push(h) : p.merge(t, h)
        }
        l && (h = l = s = null);
        if (!p.support.appendChecked)for (f = 0; (h = t[f]) != null; f++)p.nodeName(h, "input") ? bG(h) : typeof h.getElementsByTagName != "undefined" && p.grep(h.getElementsByTagName("input"), bG);
        if (c) {
            q = function (a) {
                if (!a.type || bx.test(a.type))return d ? d.push(a.parentNode ? a.parentNode.removeChild(a) : a) : c.appendChild(a)
            };
            for (f = 0; (h = t[f]) != null; f++)if (!p.nodeName(h, "script") || !q(h))c.appendChild(h), typeof h.getElementsByTagName != "undefined" && (r = p.grep(p.merge([], h.getElementsByTagName("script")), q), t.splice.apply(t, [f + 1, 0].concat(r)), f += r.length)
        }
        return t
    }, cleanData: function (a, b) {
        var c, d, e, f, g = 0, h = p.expando, i = p.cache, j = p.support.deleteExpando, k = p.event.special;
        for (; (e = a[g]) != null; g++)if (b || p.acceptData(e)) {
            d = e[h], c = d && i[d];
            if (c) {
                if (c.events)for (f in c.events)k[f] ? p.event.remove(e, f) : p.removeEvent(e, f, c.handle);
                i[d] && (delete i[d], j ? delete e[h] : e.removeAttribute ? e.removeAttribute(h) : e[h] = null, p.deletedIds.push(d))
            }
        }
    }}), function () {
        var a, b;
        p.uaMatch = function (a) {
            a = a.toLowerCase();
            var b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || a.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
            return{browser: b[1] || "", version: b[2] || "0"}
        }, a = p.uaMatch(g.userAgent), b = {}, a.browser && (b[a.browser] = !0, b.version = a.version), b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0), p.browser = b, p.sub = function () {
            function a(b, c) {
                return new a.fn.init(b, c)
            }

            p.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function c(c, d) {
                return d && d instanceof p && !(d instanceof a) && (d = a(d)), p.fn.init.call(this, c, d, b)
            }, a.fn.init.prototype = a.fn;
            var b = a(e);
            return a
        }
    }();
    var bH, bI, bJ, bK = /alpha\([^)]*\)/i, bL = /opacity=([^)]*)/, bM = /^(top|right|bottom|left)$/, bN = /^(none|table(?!-c[ea]).+)/, bO = /^margin/, bP = new RegExp("^(" + q + ")(.*)$", "i"), bQ = new RegExp("^(" + q + ")(?!px)[a-z%]+$", "i"), bR = new RegExp("^([-+])=(" + q + ")", "i"), bS = {}, bT = {position: "absolute", visibility: "hidden", display: "block"}, bU = {letterSpacing: 0, fontWeight: 400}, bV = ["Top", "Right", "Bottom", "Left"], bW = ["Webkit", "O", "Moz", "ms"], bX = p.fn.toggle;
    p.fn.extend({css: function (a, c) {
        return p.access(this, function (a, c, d) {
            return d !== b ? p.style(a, c, d) : p.css(a, c)
        }, a, c, arguments.length > 1)
    }, show: function () {
        return b$(this, !0)
    }, hide: function () {
        return b$(this)
    }, toggle: function (a, b) {
        var c = typeof a == "boolean";
        return p.isFunction(a) && p.isFunction(b) ? bX.apply(this, arguments) : this.each(function () {
            (c ? a : bZ(this)) ? p(this).show() : p(this).hide()
        })
    }}), p.extend({cssHooks: {opacity: {get: function (a, b) {
        if (b) {
            var c = bH(a, "opacity");
            return c === "" ? "1" : c
        }
    }}}, cssNumber: {fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0}, cssProps: {"float": p.support.cssFloat ? "cssFloat" : "styleFloat"}, style: function (a, c, d, e) {
        if (!a || a.nodeType === 3 || a.nodeType === 8 || !a.style)return;
        var f, g, h, i = p.camelCase(c), j = a.style;
        c = p.cssProps[i] || (p.cssProps[i] = bY(j, i)), h = p.cssHooks[c] || p.cssHooks[i];
        if (d === b)return h && "get"in h && (f = h.get(a, !1, e)) !== b ? f : j[c];
        g = typeof d, g === "string" && (f = bR.exec(d)) && (d = (f[1] + 1) * f[2] + parseFloat(p.css(a, c)), g = "number");
        if (d == null || g === "number" && isNaN(d))return;
        g === "number" && !p.cssNumber[i] && (d += "px");
        if (!h || !("set"in h) || (d = h.set(a, d, e)) !== b)try {
            j[c] = d
        } catch (k) {
        }
    }, css: function (a, c, d, e) {
        var f, g, h, i = p.camelCase(c);
        return c = p.cssProps[i] || (p.cssProps[i] = bY(a.style, i)), h = p.cssHooks[c] || p.cssHooks[i], h && "get"in h && (f = h.get(a, !0, e)), f === b && (f = bH(a, c)), f === "normal" && c in bU && (f = bU[c]), d || e !== b ? (g = parseFloat(f), d || p.isNumeric(g) ? g || 0 : f) : f
    }, swap: function (a, b, c) {
        var d, e, f = {};
        for (e in b)f[e] = a.style[e], a.style[e] = b[e];
        d = c.call(a);
        for (e in b)a.style[e] = f[e];
        return d
    }}), a.getComputedStyle ? bH = function (b, c) {
        var d, e, f, g, h = a.getComputedStyle(b, null), i = b.style;
        return h && (d = h[c], d === "" && !p.contains(b.ownerDocument, b) && (d = p.style(b, c)), bQ.test(d) && bO.test(c) && (e = i.width, f = i.minWidth, g = i.maxWidth, i.minWidth = i.maxWidth = i.width = d, d = h.width, i.width = e, i.minWidth = f, i.maxWidth = g)), d
    } : e.documentElement.currentStyle && (bH = function (a, b) {
        var c, d, e = a.currentStyle && a.currentStyle[b], f = a.style;
        return e == null && f && f[b] && (e = f[b]), bQ.test(e) && !bM.test(b) && (c = f.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), f.left = b === "fontSize" ? "1em" : e, e = f.pixelLeft + "px", f.left = c, d && (a.runtimeStyle.left = d)), e === "" ? "auto" : e
    }), p.each(["height", "width"], function (a, b) {
        p.cssHooks[b] = {get: function (a, c, d) {
            if (c)return a.offsetWidth === 0 && bN.test(bH(a, "display")) ? p.swap(a, bT, function () {
                return cb(a, b, d)
            }) : cb(a, b, d)
        }, set: function (a, c, d) {
            return b_(a, c, d ? ca(a, b, d, p.support.boxSizing && p.css(a, "boxSizing") === "border-box") : 0)
        }}
    }), p.support.opacity || (p.cssHooks.opacity = {get: function (a, b) {
        return bL.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
    }, set: function (a, b) {
        var c = a.style, d = a.currentStyle, e = p.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "", f = d && d.filter || c.filter || "";
        c.zoom = 1;
        if (b >= 1 && p.trim(f.replace(bK, "")) === "" && c.removeAttribute) {
            c.removeAttribute("filter");
            if (d && !d.filter)return
        }
        c.filter = bK.test(f) ? f.replace(bK, e) : f + " " + e
    }}), p(function () {
        p.support.reliableMarginRight || (p.cssHooks.marginRight = {get: function (a, b) {
            return p.swap(a, {display: "inline-block"}, function () {
                if (b)return bH(a, "marginRight")
            })
        }}), !p.support.pixelPosition && p.fn.position && p.each(["top", "left"], function (a, b) {
            p.cssHooks[b] = {get: function (a, c) {
                if (c) {
                    var d = bH(a, b);
                    return bQ.test(d) ? p(a).position()[b] + "px" : d
                }
            }}
        })
    }), p.expr && p.expr.filters && (p.expr.filters.hidden = function (a) {
        return a.offsetWidth === 0 && a.offsetHeight === 0 || !p.support.reliableHiddenOffsets && (a.style && a.style.display || bH(a, "display")) === "none"
    }, p.expr.filters.visible = function (a) {
        return!p.expr.filters.hidden(a)
    }), p.each({margin: "", padding: "", border: "Width"}, function (a, b) {
        p.cssHooks[a + b] = {expand: function (c) {
            var d, e = typeof c == "string" ? c.split(" ") : [c], f = {};
            for (d = 0; d < 4; d++)f[a + bV[d] + b] = e[d] || e[d - 2] || e[0];
            return f
        }}, bO.test(a) || (p.cssHooks[a + b].set = b_)
    });
    var cd = /%20/g, ce = /\[\]$/, cf = /\r?\n/g, cg = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, ch = /^(?:select|textarea)/i;
    p.fn.extend({serialize: function () {
        return p.param(this.serializeArray())
    }, serializeArray: function () {
        return this.map(function () {
            return this.elements ? p.makeArray(this.elements) : this
        }).filter(function () {
            return this.name && !this.disabled && (this.checked || ch.test(this.nodeName) || cg.test(this.type))
        }).map(function (a, b) {
            var c = p(this).val();
            return c == null ? null : p.isArray(c) ? p.map(c, function (a, c) {
                return{name: b.name, value: a.replace(cf, "\r\n")}
            }) : {name: b.name, value: c.replace(cf, "\r\n")}
        }).get()
    }}), p.param = function (a, c) {
        var d, e = [], f = function (a, b) {
            b = p.isFunction(b) ? b() : b == null ? "" : b, e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        c === b && (c = p.ajaxSettings && p.ajaxSettings.traditional);
        if (p.isArray(a) || a.jquery && !p.isPlainObject(a))p.each(a, function () {
            f(this.name, this.value)
        }); else for (d in a)ci(d, a[d], c, f);
        return e.join("&").replace(cd, "+")
    };
    var cj, ck, cl = /#.*$/, cm = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, cn = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, co = /^(?:GET|HEAD)$/, cp = /^\/\//, cq = /\?/, cr = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, cs = /([?&])_=[^&]*/, ct = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, cu = p.fn.load, cv = {}, cw = {}, cx = ["*/"] + ["*"];
    try {
        ck = f.href
    } catch (cy) {
        ck = e.createElement("a"), ck.href = "", ck = ck.href
    }
    cj = ct.exec(ck.toLowerCase()) || [], p.fn.load = function (a, c, d) {
        if (typeof a != "string" && cu)return cu.apply(this, arguments);
        if (!this.length)return this;
        var e, f, g, h = this, i = a.indexOf(" ");
        return i >= 0 && (e = a.slice(i, a.length), a = a.slice(0, i)), p.isFunction(c) ? (d = c, c = b) : c && typeof c == "object" && (f = "POST"), p.ajax({url: a, type: f, dataType: "html", data: c, complete: function (a, b) {
            d && h.each(d, g || [a.responseText, b, a])
        }}).done(function (a) {
            g = arguments, h.html(e ? p("<div>").append(a.replace(cr, "")).find(e) : a)
        }), this
    }, p.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (a, b) {
        p.fn[b] = function (a) {
            return this.on(b, a)
        }
    }), p.each(["get", "post"], function (a, c) {
        p[c] = function (a, d, e, f) {
            return p.isFunction(d) && (f = f || e, e = d, d = b), p.ajax({type: c, url: a, data: d, success: e, dataType: f})
        }
    }), p.extend({getScript: function (a, c) {
        return p.get(a, b, c, "script")
    }, getJSON: function (a, b, c) {
        return p.get(a, b, c, "json")
    }, ajaxSetup: function (a, b) {
        return b ? cB(a, p.ajaxSettings) : (b = a, a = p.ajaxSettings), cB(a, b), a
    }, ajaxSettings: {url: ck, isLocal: cn.test(cj[1]), global: !0, type: "GET", contentType: "application/x-www-form-urlencoded; charset=UTF-8", processData: !0, async: !0, accepts: {xml: "application/xml, text/xml", html: "text/html", text: "text/plain", json: "application/json, text/javascript", "*": cx}, contents: {xml: /xml/, html: /html/, json: /json/}, responseFields: {xml: "responseXML", text: "responseText"}, converters: {"* text": a.String, "text html": !0, "text json": p.parseJSON, "text xml": p.parseXML}, flatOptions: {context: !0, url: !0}}, ajaxPrefilter: cz(cv), ajaxTransport: cz(cw), ajax: function (a, c) {
        function y(a, c, f, i) {
            var k, s, t, u, w, y = c;
            if (v === 2)return;
            v = 2, h && clearTimeout(h), g = b, e = i || "", x.readyState = a > 0 ? 4 : 0, f && (u = cC(l, x, f));
            if (a >= 200 && a < 300 || a === 304)l.ifModified && (w = x.getResponseHeader("Last-Modified"), w && (p.lastModified[d] = w), w = x.getResponseHeader("Etag"), w && (p.etag[d] = w)), a === 304 ? (y = "notmodified", k = !0) : (k = cD(l, u), y = k.state, s = k.data, t = k.error, k = !t); else {
                t = y;
                if (!y || a)y = "error", a < 0 && (a = 0)
            }
            x.status = a, x.statusText = (c || y) + "", k ? o.resolveWith(m, [s, y, x]) : o.rejectWith(m, [x, y, t]), x.statusCode(r), r = b, j && n.trigger("ajax" + (k ? "Success" : "Error"), [x, l, k ? s : t]), q.fireWith(m, [x, y]), j && (n.trigger("ajaxComplete", [x, l]), --p.active || p.event.trigger("ajaxStop"))
        }

        typeof a == "object" && (c = a, a = b), c = c || {};
        var d, e, f, g, h, i, j, k, l = p.ajaxSetup({}, c), m = l.context || l, n = m !== l && (m.nodeType || m instanceof p) ? p(m) : p.event, o = p.Deferred(), q = p.Callbacks("once memory"), r = l.statusCode || {}, t = {}, u = {}, v = 0, w = "canceled", x = {readyState: 0, setRequestHeader: function (a, b) {
            if (!v) {
                var c = a.toLowerCase();
                a = u[c] = u[c] || a, t[a] = b
            }
            return this
        }, getAllResponseHeaders: function () {
            return v === 2 ? e : null
        }, getResponseHeader: function (a) {
            var c;
            if (v === 2) {
                if (!f) {
                    f = {};
                    while (c = cm.exec(e))f[c[1].toLowerCase()] = c[2]
                }
                c = f[a.toLowerCase()]
            }
            return c === b ? null : c
        }, overrideMimeType: function (a) {
            return v || (l.mimeType = a), this
        }, abort: function (a) {
            return a = a || w, g && g.abort(a), y(0, a), this
        }};
        o.promise(x), x.success = x.done, x.error = x.fail, x.complete = q.add, x.statusCode = function (a) {
            if (a) {
                var b;
                if (v < 2)for (b in a)r[b] = [r[b], a[b]]; else b = a[x.status], x.always(b)
            }
            return this
        }, l.url = ((a || l.url) + "").replace(cl, "").replace(cp, cj[1] + "//"), l.dataTypes = p.trim(l.dataType || "*").toLowerCase().split(s), l.crossDomain == null && (i = ct.exec(l.url.toLowerCase()) || !1, l.crossDomain = i && i.join(":") + (i[3] ? "" : i[1] === "http:" ? 80 : 443) !== cj.join(":") + (cj[3] ? "" : cj[1] === "http:" ? 80 : 443)), l.data && l.processData && typeof l.data != "string" && (l.data = p.param(l.data, l.traditional)), cA(cv, l, c, x);
        if (v === 2)return x;
        j = l.global, l.type = l.type.toUpperCase(), l.hasContent = !co.test(l.type), j && p.active++ === 0 && p.event.trigger("ajaxStart");
        if (!l.hasContent) {
            l.data && (l.url += (cq.test(l.url) ? "&" : "?") + l.data, delete l.data), d = l.url;
            if (l.cache === !1) {
                var z = p.now(), A = l.url.replace(cs, "$1_=" + z);
                l.url = A + (A === l.url ? (cq.test(l.url) ? "&" : "?") + "_=" + z : "")
            }
        }
        (l.data && l.hasContent && l.contentType !== !1 || c.contentType) && x.setRequestHeader("Content-Type", l.contentType), l.ifModified && (d = d || l.url, p.lastModified[d] && x.setRequestHeader("If-Modified-Since", p.lastModified[d]), p.etag[d] && x.setRequestHeader("If-None-Match", p.etag[d])), x.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + (l.dataTypes[0] !== "*" ? ", " + cx + "; q=0.01" : "") : l.accepts["*"]);
        for (k in l.headers)x.setRequestHeader(k, l.headers[k]);
        if (!l.beforeSend || l.beforeSend.call(m, x, l) !== !1 && v !== 2) {
            w = "abort";
            for (k in{success: 1, error: 1, complete: 1})x[k](l[k]);
            g = cA(cw, l, c, x);
            if (!g)y(-1, "No Transport"); else {
                x.readyState = 1, j && n.trigger("ajaxSend", [x, l]), l.async && l.timeout > 0 && (h = setTimeout(function () {
                    x.abort("timeout")
                }, l.timeout));
                try {
                    v = 1, g.send(t, y)
                } catch (B) {
                    if (v < 2)y(-1, B); else throw B
                }
            }
            return x
        }
        return x.abort()
    }, active: 0, lastModified: {}, etag: {}});
    var cE = [], cF = /\?/, cG = /(=)\?(?=&|$)|\?\?/, cH = p.now();
    p.ajaxSetup({jsonp: "callback", jsonpCallback: function () {
        var a = cE.pop() || p.expando + "_" + cH++;
        return this[a] = !0, a
    }}), p.ajaxPrefilter("json jsonp", function (c, d, e) {
        var f, g, h, i = c.data, j = c.url, k = c.jsonp !== !1, l = k && cG.test(j), m = k && !l && typeof i == "string" && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && cG.test(i);
        if (c.dataTypes[0] === "jsonp" || l || m)return f = c.jsonpCallback = p.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, g = a[f], l ? c.url = j.replace(cG, "$1" + f) : m ? c.data = i.replace(cG, "$1" + f) : k && (c.url += (cF.test(j) ? "&" : "?") + c.jsonp + "=" + f), c.converters["script json"] = function () {
            return h || p.error(f + " was not called"), h[0]
        }, c.dataTypes[0] = "json", a[f] = function () {
            h = arguments
        }, e.always(function () {
            a[f] = g, c[f] && (c.jsonpCallback = d.jsonpCallback, cE.push(f)), h && p.isFunction(g) && g(h[0]), h = g = b
        }), "script"
    }), p.ajaxSetup({accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents: {script: /javascript|ecmascript/}, converters: {"text script": function (a) {
        return p.globalEval(a), a
    }}}), p.ajaxPrefilter("script", function (a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), p.ajaxTransport("script", function (a) {
        if (a.crossDomain) {
            var c, d = e.head || e.getElementsByTagName("head")[0] || e.documentElement;
            return{send: function (f, g) {
                c = e.createElement("script"), c.async = "async", a.scriptCharset && (c.charset = a.scriptCharset), c.src = a.url, c.onload = c.onreadystatechange = function (a, e) {
                    if (e || !c.readyState || /loaded|complete/.test(c.readyState))c.onload = c.onreadystatechange = null, d && c.parentNode && d.removeChild(c), c = b, e || g(200, "success")
                }, d.insertBefore(c, d.firstChild)
            }, abort: function () {
                c && c.onload(0, 1)
            }}
        }
    });
    var cI, cJ = a.ActiveXObject ? function () {
        for (var a in cI)cI[a](0, 1)
    } : !1, cK = 0;
    p.ajaxSettings.xhr = a.ActiveXObject ? function () {
        return!this.isLocal && cL() || cM()
    } : cL, function (a) {
        p.extend(p.support, {ajax: !!a, cors: !!a && "withCredentials"in a})
    }(p.ajaxSettings.xhr()), p.support.ajax && p.ajaxTransport(function (c) {
        if (!c.crossDomain || p.support.cors) {
            var d;
            return{send: function (e, f) {
                var g, h, i = c.xhr();
                c.username ? i.open(c.type, c.url, c.async, c.username, c.password) : i.open(c.type, c.url, c.async);
                if (c.xhrFields)for (h in c.xhrFields)i[h] = c.xhrFields[h];
                c.mimeType && i.overrideMimeType && i.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                try {
                    for (h in e)i.setRequestHeader(h, e[h])
                } catch (j) {
                }
                i.send(c.hasContent && c.data || null), d = function (a, e) {
                    var h, j, k, l, m;
                    try {
                        if (d && (e || i.readyState === 4)) {
                            d = b, g && (i.onreadystatechange = p.noop, cJ && delete cI[g]);
                            if (e)i.readyState !== 4 && i.abort(); else {
                                h = i.status, k = i.getAllResponseHeaders(), l = {}, m = i.responseXML, m && m.documentElement && (l.xml = m);
                                try {
                                    l.text = i.responseText
                                } catch (a) {
                                }
                                try {
                                    j = i.statusText
                                } catch (n) {
                                    j = ""
                                }
                                !h && c.isLocal && !c.crossDomain ? h = l.text ? 200 : 404 : h === 1223 && (h = 204)
                            }
                        }
                    } catch (o) {
                        e || f(-1, o)
                    }
                    l && f(h, j, l, k)
                }, c.async ? i.readyState === 4 ? setTimeout(d, 0) : (g = ++cK, cJ && (cI || (cI = {}, p(a).unload(cJ)), cI[g] = d), i.onreadystatechange = d) : d()
            }, abort: function () {
                d && d(0, 1)
            }}
        }
    });
    var cN, cO, cP = /^(?:toggle|show|hide)$/, cQ = new RegExp("^(?:([-+])=|)(" + q + ")([a-z%]*)$", "i"), cR = /queueHooks$/, cS = [cY], cT = {"*": [function (a, b) {
        var c, d, e = this.createTween(a, b), f = cQ.exec(b), g = e.cur(), h = +g || 0, i = 1, j = 20;
        if (f) {
            c = +f[2], d = f[3] || (p.cssNumber[a] ? "" : "px");
            if (d !== "px" && h) {
                h = p.css(e.elem, a, !0) || c || 1;
                do i = i || ".5", h = h / i, p.style(e.elem, a, h + d); while (i !== (i = e.cur() / g) && i !== 1 && --j)
            }
            e.unit = d, e.start = h, e.end = f[1] ? h + (f[1] + 1) * c : c
        }
        return e
    }]};
    p.Animation = p.extend(cW, {tweener: function (a, b) {
        p.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
        var c, d = 0, e = a.length;
        for (; d < e; d++)c = a[d], cT[c] = cT[c] || [], cT[c].unshift(b)
    }, prefilter: function (a, b) {
        b ? cS.unshift(a) : cS.push(a)
    }}), p.Tween = cZ, cZ.prototype = {constructor: cZ, init: function (a, b, c, d, e, f) {
        this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (p.cssNumber[c] ? "" : "px")
    }, cur: function () {
        var a = cZ.propHooks[this.prop];
        return a && a.get ? a.get(this) : cZ.propHooks._default.get(this)
    }, run: function (a) {
        var b, c = cZ.propHooks[this.prop];
        return this.options.duration ? this.pos = b = p.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : cZ.propHooks._default.set(this), this
    }}, cZ.prototype.init.prototype = cZ.prototype, cZ.propHooks = {_default: {get: function (a) {
        var b;
        return a.elem[a.prop] == null || !!a.elem.style && a.elem.style[a.prop] != null ? (b = p.css(a.elem, a.prop, !1, ""), !b || b === "auto" ? 0 : b) : a.elem[a.prop]
    }, set: function (a) {
        p.fx.step[a.prop] ? p.fx.step[a.prop](a) : a.elem.style && (a.elem.style[p.cssProps[a.prop]] != null || p.cssHooks[a.prop]) ? p.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
    }}}, cZ.propHooks.scrollTop = cZ.propHooks.scrollLeft = {set: function (a) {
        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
    }}, p.each(["toggle", "show", "hide"], function (a, b) {
        var c = p.fn[b];
        p.fn[b] = function (d, e, f) {
            return d == null || typeof d == "boolean" || !a && p.isFunction(d) && p.isFunction(e) ? c.apply(this, arguments) : this.animate(c$(b, !0), d, e, f)
        }
    }), p.fn.extend({fadeTo: function (a, b, c, d) {
        return this.filter(bZ).css("opacity", 0).show().end().animate({opacity: b}, a, c, d)
    }, animate: function (a, b, c, d) {
        var e = p.isEmptyObject(a), f = p.speed(b, c, d), g = function () {
            var b = cW(this, p.extend({}, a), f);
            e && b.stop(!0)
        };
        return e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
    }, stop: function (a, c, d) {
        var e = function (a) {
            var b = a.stop;
            delete a.stop, b(d)
        };
        return typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []), this.each(function () {
            var b = !0, c = a != null && a + "queueHooks", f = p.timers, g = p._data(this);
            if (c)g[c] && g[c].stop && e(g[c]); else for (c in g)g[c] && g[c].stop && cR.test(c) && e(g[c]);
            for (c = f.length; c--;)f[c].elem === this && (a == null || f[c].queue === a) && (f[c].anim.stop(d), b = !1, f.splice(c, 1));
            (b || !d) && p.dequeue(this, a)
        })
    }}), p.each({slideDown: c$("show"), slideUp: c$("hide"), slideToggle: c$("toggle"), fadeIn: {opacity: "show"}, fadeOut: {opacity: "hide"}, fadeToggle: {opacity: "toggle"}}, function (a, b) {
        p.fn[a] = function (a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), p.speed = function (a, b, c) {
        var d = a && typeof a == "object" ? p.extend({}, a) : {complete: c || !c && b || p.isFunction(a) && a, duration: a, easing: c && b || b && !p.isFunction(b) && b};
        d.duration = p.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in p.fx.speeds ? p.fx.speeds[d.duration] : p.fx.speeds._default;
        if (d.queue == null || d.queue === !0)d.queue = "fx";
        return d.old = d.complete, d.complete = function () {
            p.isFunction(d.old) && d.old.call(this), d.queue && p.dequeue(this, d.queue)
        }, d
    }, p.easing = {linear: function (a) {
        return a
    }, swing: function (a) {
        return.5 - Math.cos(a * Math.PI) / 2
    }}, p.timers = [], p.fx = cZ.prototype.init, p.fx.tick = function () {
        var a, b = p.timers, c = 0;
        for (; c < b.length; c++)a = b[c], !a() && b[c] === a && b.splice(c--, 1);
        b.length || p.fx.stop()
    }, p.fx.timer = function (a) {
        a() && p.timers.push(a) && !cO && (cO = setInterval(p.fx.tick, p.fx.interval))
    }, p.fx.interval = 13, p.fx.stop = function () {
        clearInterval(cO), cO = null
    }, p.fx.speeds = {slow: 600, fast: 200, _default: 400}, p.fx.step = {}, p.expr && p.expr.filters && (p.expr.filters.animated = function (a) {
        return p.grep(p.timers,function (b) {
            return a === b.elem
        }).length
    });
    var c_ = /^(?:body|html)$/i;
    p.fn.offset = function (a) {
        if (arguments.length)return a === b ? this : this.each(function (b) {
            p.offset.setOffset(this, a, b)
        });
        var c, d, e, f, g, h, i, j = {top: 0, left: 0}, k = this[0], l = k && k.ownerDocument;
        if (!l)return;
        return(d = l.body) === k ? p.offset.bodyOffset(k) : (c = l.documentElement, p.contains(c, k) ? (typeof k.getBoundingClientRect != "undefined" && (j = k.getBoundingClientRect()), e = da(l), f = c.clientTop || d.clientTop || 0, g = c.clientLeft || d.clientLeft || 0, h = e.pageYOffset || c.scrollTop, i = e.pageXOffset || c.scrollLeft, {top: j.top + h - f, left: j.left + i - g}) : j)
    }, p.offset = {bodyOffset: function (a) {
        var b = a.offsetTop, c = a.offsetLeft;
        return p.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(p.css(a, "marginTop")) || 0, c += parseFloat(p.css(a, "marginLeft")) || 0), {top: b, left: c}
    }, setOffset: function (a, b, c) {
        var d = p.css(a, "position");
        d === "static" && (a.style.position = "relative");
        var e = p(a), f = e.offset(), g = p.css(a, "top"), h = p.css(a, "left"), i = (d === "absolute" || d === "fixed") && p.inArray("auto", [g, h]) > -1, j = {}, k = {}, l, m;
        i ? (k = e.position(), l = k.top, m = k.left) : (l = parseFloat(g) || 0, m = parseFloat(h) || 0), p.isFunction(b) && (b = b.call(a, c, f)), b.top != null && (j.top = b.top - f.top + l), b.left != null && (j.left = b.left - f.left + m), "using"in b ? b.using.call(a, j) : e.css(j)
    }}, p.fn.extend({position: function () {
        if (!this[0])return;
        var a = this[0], b = this.offsetParent(), c = this.offset(), d = c_.test(b[0].nodeName) ? {top: 0, left: 0} : b.offset();
        return c.top -= parseFloat(p.css(a, "marginTop")) || 0, c.left -= parseFloat(p.css(a, "marginLeft")) || 0, d.top += parseFloat(p.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(p.css(b[0], "borderLeftWidth")) || 0, {top: c.top - d.top, left: c.left - d.left}
    }, offsetParent: function () {
        return this.map(function () {
            var a = this.offsetParent || e.body;
            while (a && !c_.test(a.nodeName) && p.css(a, "position") === "static")a = a.offsetParent;
            return a || e.body
        })
    }}), p.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (a, c) {
        var d = /Y/.test(c);
        p.fn[a] = function (e) {
            return p.access(this, function (a, e, f) {
                var g = da(a);
                if (f === b)return g ? c in g ? g[c] : g.document.documentElement[e] : a[e];
                g ? g.scrollTo(d ? p(g).scrollLeft() : f, d ? f : p(g).scrollTop()) : a[e] = f
            }, a, e, arguments.length, null)
        }
    }), p.each({Height: "height", Width: "width"}, function (a, c) {
        p.each({padding: "inner" + a, content: c, "": "outer" + a}, function (d, e) {
            p.fn[e] = function (e, f) {
                var g = arguments.length && (d || typeof e != "boolean"), h = d || (e === !0 || f === !0 ? "margin" : "border");
                return p.access(this, function (c, d, e) {
                    var f;
                    return p.isWindow(c) ? c.document.documentElement["client" + a] : c.nodeType === 9 ? (f = c.documentElement, Math.max(c.body["scroll" + a], f["scroll" + a], c.body["offset" + a], f["offset" + a], f["client" + a])) : e === b ? p.css(c, d, e, h) : p.style(c, d, e, h)
                }, c, g ? e : b, g, null)
            }
        })
    }), a.jQuery = a.$ = p, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function () {
        return p
    })
})(window);
/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch (er) {
        }
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));
/*
 * jQuery spritely 0.6.7
 * http://spritely.net/
 *
 * Documentation:
 * http://spritely.net/documentation/
 *
 * Copyright 2010-2011, Peter Chater, Artlogic Media Ltd, http://www.artlogic.net/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
(function (e) {
    e._spritely = {animate: function (t) {
        var n = e(t.el), r = n.attr("id");
        if (!e._spritely.instances[r])return this;
        t = e.extend(t, e._spritely.instances[r] || {});
        if (t.type == "sprite" && t.fps) {
            t.play_frames && !e._spritely.instances[r].remaining_frames ? e._spritely.instances[r].remaining_frames = t.play_frames + 1 : t.do_once && !e._spritely.instances[r].remaining_frames && (e._spritely.instances[r].remaining_frames = t.no_of_frames);
            var i, s = function (n) {
                var s = t.width, o = t.height;
                if (!i) {
                    i = [];
                    total = 0;
                    for (var u = 0; u < t.no_of_frames; u++) {
                        i[i.length] = 0 - total;
                        total += s
                    }
                }
                e._spritely.instances[r]["current_frame"] == 0 ? t.on_first_frame && t.on_first_frame(n) : e._spritely.instances[r]["current_frame"] == i.length - 1 && t.on_last_frame && t.on_last_frame(n);
                t.on_frame && t.on_frame[e._spritely.instances[r].current_frame] && t.on_frame[e._spritely.instances[r].current_frame](n);
                t.rewind == 1 ? e._spritely.instances[r].current_frame <= 0 ? e._spritely.instances[r].current_frame = i.length - 1 : e._spritely.instances[r].current_frame = e._spritely.instances[r].current_frame - 1 : e._spritely.instances[r].current_frame >= i.length - 1 ? e._spritely.instances[r].current_frame = 0 : e._spritely.instances[r].current_frame = e._spritely.instances[r].current_frame + 1;
                var a = e._spritely.getBgY(n);
                n.css("background-position", i[e._spritely.instances[r].current_frame] + "px " + a);
                if (t.bounce && t.bounce[0] > 0 && t.bounce[1] > 0) {
                    var f = t.bounce[0], l = t.bounce[1], c = t.bounce[2];
                    n.animate({top: "+=" + f + "px", left: "-=" + l + "px"}, c).animate({top: "-=" + f + "px", left: "+=" + l + "px"}, c)
                }
            };
            if (e._spritely.instances[r].remaining_frames && e._spritely.instances[r].remaining_frames > 0) {
                e._spritely.instances[r].remaining_frames--;
                if (e._spritely.instances[r]["remaining_frames"] == 0) {
                    e._spritely.instances[r].remaining_frames = -1;
                    delete e._spritely.instances[r].remaining_frames;
                    return this
                }
                s(n)
            } else e._spritely.instances[r]["remaining_frames"] != -1 && s(n)
        } else if (t.type == "pan" && !e._spritely.instances[r]._stopped) {
            var o = t.speed || 1, u = e._spritely.instances[r].l || parseInt(e._spritely.getBgX(n).replace("px", ""), 10) || 0, a = e._spritely.instances[r].t || parseInt(e._spritely.getBgY(n).replace("px", ""), 10) || 0;
            if (t.do_once && !e._spritely.instances[r].remaining_frames || e._spritely.instances[r].remaining_frames <= 0) {
                switch (t.dir) {
                    case"up":
                    case"down":
                        e._spritely.instances[r].remaining_frames = Math.floor((t.img_height || 0) / o);
                        break;
                    case"left":
                    case"right":
                        e._spritely.instances[r].remaining_frames = Math.floor((t.img_width || 0) / o)
                }
                e._spritely.instances[r].remaining_frames++
            } else t.do_once && e._spritely.instances[r].remaining_frames--;
            switch (t.dir) {
                case"up":
                    o *= -1;
                case"down":
                    e._spritely.instances[r].l || (e._spritely.instances[r].l = u);
                    e._spritely.instances[r].t = a + o;
                    t.img_height && (e._spritely.instances[r].t %= t.img_height);
                    break;
                case"left":
                    o *= -1;
                case"right":
                    e._spritely.instances[r].t || (e._spritely.instances[r].t = a);
                    e._spritely.instances[r].l = u + o;
                    t.img_width && (e._spritely.instances[r].l %= t.img_width)
            }
            var f = e._spritely.instances[r].l.toString();
            f.indexOf("%") == -1 ? f += "px " : f += " ";
            var l = e._spritely.instances[r].t.toString();
            l.indexOf("%") == -1 ? l += "px " : l += " ";
            e(n).css("background-position", f + l);
            if (t.do_once && !e._spritely.instances[r].remaining_frames)return this
        }
        e._spritely.instances[r].options = t;
        e._spritely.instances[r].timeout = window.setTimeout(function () {
            e._spritely.animate(t)
        }, parseInt(1e3 / t.fps))
    }, randomIntBetween: function (e, t) {
        return parseInt(rand_no = Math.floor((t - (e - 1)) * Math.random()) + e)
    }, getBgUseXY: function () {
        try {
            return typeof e("body").css("background-position-x") == "string"
        } catch (t) {
            return!1
        }
    }(), getBgY: function (t) {
        return e._spritely.getBgUseXY ? e(t).css("background-position-y") || "0" : (e(t).css("background-position") || " ").split(" ")[1]
    }, getBgX: function (t) {
        return e._spritely.getBgUseXY ? e(t).css("background-position-x") || "0" : (e(t).css("background-position") || " ").split(" ")[0]
    }, get_rel_pos: function (e, t) {
        var n = e;
        if (e < 0)while (n < 0)n += t; else while (n > t)n -= t;
        return n
    }, _spStrip: function (e, t) {
        while (e.length) {
            var n, r, i = !1, s = !1;
            for (n = 0; n < t.length; n++) {
                var o = e.slice(0, 1);
                r = e.slice(1);
                t.indexOf(o) > -1 ? e = r : i = !0
            }
            for (n = 0; n < t.length; n++) {
                var u = e.slice(-1);
                r = e.slice(0, -1);
                t.indexOf(u) > -1 ? e = r : s = !0
            }
            if (i && s)return e
        }
        return""
    }};
    e.fn.extend({spritely: function (t) {
        var n = e(this), r = n.attr("id"), i = new Image, s = e._spritely._spStrip(n.css("background-image") || "", 'url("); ');
        i.onload = function () {
            t = e.extend({type: "sprite", do_once: !1, width: null, height: null, img_width: 0, img_height: 0, fps: 12, no_of_frames: 2, play_frames: 0}, t || {});
            t.img_width = i.width;
            t.img_height = i.height;
            t.img = i;
            e._spritely.instances || (e._spritely.instances = {});
            e._spritely.instances[r] || (t.start_at_frame ? e._spritely.instances[r] = {current_frame: t.start_at_frame - 1} : e._spritely.instances[r] = {current_frame: -1});
            e._spritely.instances[r].type = t.type;
            e._spritely.instances[r].depth = t.depth;
            t.el = n;
            t.width = t.width || n.width() || 100;
            t.height = t.height || n.height() || 100;
            var s = function () {
                return parseInt(1e3 / t.fps)
            };
            t.do_once ? setTimeout(function () {
                e._spritely.animate(t)
            }, 0) : setTimeout(function () {
                e._spritely.animate(t)
            }, s(t.fps))
        };
        i.src = s;
        return this
    }, sprite: function (t) {
        var t = e.extend({type: "sprite", bounce: [0, 0, 1e3]}, t || {});
        return e(this).spritely(t)
    }, pan: function (t) {
        var t = e.extend({type: "pan", dir: "left", continuous: !0, speed: 1}, t || {});
        return e(this).spritely(t)
    }, flyToTap: function (t) {
        var t = e.extend({el_to_move: null, type: "moveToTap", ms: 1e3, do_once: !0}, t || {});
        t.el_to_move && e(t.el_to_move).active();
        e._spritely.activeSprite && (window.Touch ? e(this)[0].ontouchstart = function (t) {
            var n = e._spritely.activeSprite, r = t.touches[0], i = r.pageY - n.height() / 2, s = r.pageX - n.width() / 2;
            n.animate({top: i + "px", left: s + "px"}, 1e3)
        } : e(this).click(function (t) {
            var n = e._spritely.activeSprite;
            e(n).stop(!0);
            var r = n.width(), i = n.height(), s = t.pageX - r / 2, o = t.pageY - i / 2;
            n.animate({top: o + "px", left: s + "px"}, 1e3)
        }));
        return this
    }, isDraggable: function (t) {
        if (!e(this).draggable)return this;
        var t = e.extend({type: "isDraggable", start: null, stop: null, drag: null}, t || {}), n = e(this).attr("id");
        if (!e._spritely.instances[n])return this;
        e._spritely.instances[n].isDraggableOptions = t;
        e(this).draggable({start: function () {
            var t = e(this).attr("id");
            e._spritely.instances[t].stop_random = !0;
            e(this).stop(!0);
            e._spritely.instances[t].isDraggableOptions.start && e._spritely.instances[t].isDraggableOptions.start(this)
        }, drag: t.drag, stop: function () {
            var t = e(this).attr("id");
            e._spritely.instances[t].stop_random = !1;
            e._spritely.instances[t].isDraggableOptions.stop && e._spritely.instances[t].isDraggableOptions.stop(this)
        }});
        return this
    }, active: function () {
        e._spritely.activeSprite = this;
        return this
    }, activeOnClick: function () {
        var t = e(this);
        window.Touch ? t[0].ontouchstart = function (n) {
            e._spritely.activeSprite = t
        } : t.click(function (n) {
            e._spritely.activeSprite = t
        });
        return this
    }, spRandom: function (t) {
        var t = e.extend({top: 50, left: 50, right: 290, bottom: 320, speed: 4e3, pause: 0}, t || {}), n = e(this).attr("id");
        if (!e._spritely.instances[n])return this;
        if (!e._spritely.instances[n].stop_random) {
            var r = e._spritely.randomIntBetween, i = r(t.top, t.bottom), s = r(t.left, t.right);
            e("#" + n).animate({top: i + "px", left: s + "px"}, t.speed)
        }
        window.setTimeout(function () {
            e("#" + n).spRandom(t)
        }, t.speed + t.pause);
        return this
    }, makeAbsolute: function () {
        return this.each(function () {
            var t = e(this), n = t.position();
            t.css({position: "absolute", marginLeft: 0, marginTop: 0, top: n.top, left: n.left}).remove().appendTo("body")
        })
    }, spSet: function (t, n) {
        var r = e(this).attr("id");
        e._spritely.instances[r][t] = n;
        return this
    }, spGet: function (t, n) {
        var r = e(this).attr("id");
        return e._spritely.instances[r][t]
    }, spStop: function (t) {
        this.each(function () {
            var n = e(this), r = n.attr("id");
            e._spritely.instances[r].options.fps && (e._spritely.instances[r]._last_fps = e._spritely.instances[r].options.fps);
            e._spritely.instances[r]["type"] == "sprite" && n.spSet("fps", 0);
            e._spritely.instances[r]._stopped = !0;
            e._spritely.instances[r]._stopped_f1 = t;
            if (t) {
                var i = e._spritely.getBgY(e(this));
                n.css("background-position", "0 " + i)
            }
        });
        return this
    }, spStart: function () {
        e(this).each(function () {
            var t = e(this).attr("id"), n = e._spritely.instances[t]._last_fps || 12;
            e._spritely.instances[t]["type"] == "sprite" && e(this).spSet("fps", n);
            e._spritely.instances[t]._stopped = !1
        });
        return this
    }, spToggle: function () {
        var t = e(this).attr("id"), n = e._spritely.instances[t]._stopped || !1, r = e._spritely.instances[t]._stopped_f1 || !1;
        n ? e(this).spStart() : e(this).spStop(r);
        return this
    }, fps: function (t) {
        e(this).each(function () {
            e(this).spSet("fps", t)
        });
        return this
    }, goToFrame: function (t) {
        var n = e(this).attr("id");
        e._spritely.instances && e._spritely.instances[n] && (e._spritely.instances[n].current_frame = t - 1);
        return this
    }, spSpeed: function (t) {
        e(this).each(function () {
            e(this).spSet("speed", t)
        });
        return this
    }, spRelSpeed: function (t) {
        e(this).each(function () {
            var n = e(this).spGet("depth") / 100;
            e(this).spSet("speed", t * n)
        });
        return this
    }, spChangeDir: function (t) {
        e(this).each(function () {
            e(this).spSet("dir", t)
        });
        return this
    }, spState: function (t) {
        e(this).each(function () {
            var r = (t - 1) * e(this).height() + "px", i = e._spritely.getBgX(e(this)), s = i + " -" + r;
            e(this).css("background-position", s)
        });
        return this
    }, lockTo: function (t, n) {
        e(this).each(function () {
            var r = e(this).attr("id");
            if (!e._spritely.instances[r])return this;
            e._spritely.instances[r].locked_el = e(this);
            e._spritely.instances[r].lock_to = e(t);
            e._spritely.instances[r].lock_to_options = n;
            e._spritely.instances[r].interval = window.setInterval(function () {
                if (e._spritely.instances[r].lock_to) {
                    var t = e._spritely.instances[r].locked_el, n = e._spritely.instances[r].lock_to, i = e._spritely.instances[r].lock_to_options, s = i.bg_img_width, o = n.height(), u = e._spritely.getBgY(n), a = e._spritely.getBgX(n), f = parseInt(a) + parseInt(i.left), l = parseInt(u) + parseInt(i.top);
                    f = e._spritely.get_rel_pos(f, s);
                    e(t).css({top: l + "px", left: f + "px"})
                }
            }, n.interval || 20)
        });
        return this
    }, destroy: function () {
        var t = e(this), n = e(this).attr("id");
        e._spritely.instances[n] && e._spritely.instances[n].timeout && window.clearTimeout(e._spritely.instances[n].timeout);
        e._spritely.instances[n] && e._spritely.instances[n].interval && window.clearInterval(e._spritely.instances[n].interval);
        delete e._spritely.instances[n];
        return this
    }})
})(jQuery);
try {
    document.execCommand("BackgroundImageCache", !1, !0)
} catch (err) {
}
;
(function () {
    var Loader = this.SpriteLoader = {};
    Loader.preload = function (images, callback) {
        if (typeof(images) === "string") {
            images = [images];
        }
        var i, data = {callback: callback, numLoaded: 0, numImages: images.length, images: []};
        for (i = 0; i < images.length; i += 1) {
            Loader.load(images[i], data);
        }
    };
    Loader.load = function (imageSource, data) {
        var image = new Image();
        data.images.push(image);
        image.onload = function () {
            data.numLoaded += 1;
            if (data.numLoaded === data.numImages) {
                data.callback(data.images);
            }
        };
        image.src = imageSource;
    };
}());
(function ($, window) {
    var Spin = window.SpriteSpin = {};
    var api = Spin.api = {};
    Spin.modules = {};
    Spin.behaviors = {};
    Spin.updateInput = function (e, data) {
        if (e.touches === undefined && e.originalEvent !== undefined) {
            e.touches = e.originalEvent.touches;
        }
        data.oldX = data.currentX;
        data.oldY = data.currentY;
        if (e.touches !== undefined && e.touches.length > 0) {
            data.currentX = e.touches[0].clientX;
            data.currentY = e.touches[0].clientY;
        } else {
            data.currentX = e.clientX;
            data.currentY = e.clientY;
        }
        if (data.startX === undefined || data.startY === undefined) {
            data.startX = data.currentX;
            data.startY = data.currentY;
            data.clickframe = data.frame;
        }
        if (data.oldX === undefined || data.oldY === undefined) {
            data.oldX = data.currentX;
            data.oldY = data.currentY;
        }
        data.dX = data.currentX - data.startX;
        data.dY = data.currentY - data.startY;
        data.dW = data.dX * data.dragDirX + data.dY * data.dragDirY;
        data.ddX = data.currentX - data.oldX;
        data.ddY = data.currentY - data.oldY;
        data.ddW = data.ddX * data.dragDirX + data.ddY * data.dragDirY;
        return false;
    };
    Spin.resetInput = function (data) {
        data.startX = undefined;
        data.startY = undefined;
        data.currentX = undefined;
        data.currentY = undefined;
        data.oldX = undefined;
        data.oldY = undefined;
        data.dX = 0;
        data.dY = 0;
        data.dW = 0;
        data.ddX = 0;
        data.ddY = 0;
        data.ddW = 0;
        if (typeof(data.module.resetInput) === "function") {
            data.module.resetInput(data);
        }
    };
    Spin.clamp = function (value, min, max) {
        return(value > max ? max : (value < min ? min : value));
    };
    Spin.wrap = function (value, min, max, size) {
        while (value > max) {
            value -= size;
        }
        while (value < min) {
            value += size;
        }
        return value;
    };
    Spin.reload = function (data, andInit) {
        if (andInit && data.module.initialize) {
            data.module.initialize(data);
        }
        Spin.prepareBackground(data);
        Spin.preloadImages(data, function () {
            Spin.rebindEvents(data);
            data.module.reload(data);
            data.target.trigger("onLoad", data);
        });
    };
    Spin.preloadImages = function (data, callback) {
        data.preload.fadeIn(250, function () {
            SpriteLoader.preload(data.source, function (images) {
                data.preload.fadeOut(250);
                data.stage.show();
                if (data.canvas) {
                    data.canvas.show();
                }
                data.images = images;
                callback.apply(data.target, [data]);
            });
        });
    };
    Spin.prepareBackground = function (data) {
        var w = [data.width, "px"].join("");
        var h = [data.height, "px"].join("");
        data.target.css({width: w, height: h, position: "relative"});
        var css = {width: w, height: h, top: "0px", left: "0px", position: "absolute"};
        $.extend(css, data.preloadCSS || {});
        data.preload.css(css).html(data.preloadHtml || "").hide();
        data.stage.css({width: w, height: h, top: "0px", left: "0px", position: "absolute"}).hide();
        if (data.canvas) {
            data.canvas[0].width = data.width;
            data.canvas[0].height = data.height;
            data.canvas.css({width: w, height: h, top: "0px", left: "0px", position: "absolute"}).hide();
        }
    };
    Spin.draw = function (data) {
        data.module.draw(data);
    };
    Spin.rebindEvents = function (data) {
        var target = data.target;
        target.unbind(".spritespin");
        var beh = data.behavior;
        if (typeof(data.behavior) === "string") {
            beh = Spin.behaviors[data.behavior];
        }
        beh = beh || {};
        var prevent = function (e) {
            if (e.cancelable) {
                e.preventDefault();
            }
            return false;
        };
        target.bind("mousedown.spritespin", beh.mousedown || $.noop);
        target.bind("mousemove.spritespin", beh.mousemove || $.noop);
        target.bind("mouseup.spritespin", beh.mouseup || $.noop);
        target.bind("mouseenter.spritespin", beh.mouseenter || $.noop);
        target.bind("mouseover.spritespin", beh.mouseover || $.noop);
        target.bind("mouseleave.spritespin", beh.mouseleave || $.noop);
        target.bind("dblclick.spritespin", beh.dblclick || $.noop);
        target.bind("onFrame.spritespin", beh.onFrame || $.noop);
        if (data.touchable) {
            target.bind("touchstart.spritespin", beh.mousedown || $.noop);
            target.bind("touchmove.spritespin", beh.mousemove || $.noop);
            target.bind("touchend.spritespin", beh.mouseup || $.noop);
            target.bind("touchcancel.spritespin", beh.mouseleave || $.noop);
            target.bind("click.spritespin", prevent);
            target.bind("gesturestart.spritespin", prevent);
            target.bind("gesturechange.spritespin", prevent);
            target.bind("gestureend.spritespin", prevent);
        }
        target.bind("mousedown.spritespin selectstart.spritespin", prevent);
        target.bind("onFrame.spritespin", function (event, data) {
            Spin.draw(data);
        });
        target.bind("onLoad.spritespin", function (event, data) {
            data.target.spritespin("animate", data.animate, data.loop);
        });
        if (typeof(data.onFrame) === "function") {
            target.bind("onFrame.spritespin", data.onFrame);
        }
        if (typeof(data.onLoad) === "function") {
            target.bind("onLoad.spritespin", data.onLoad);
        }
    };
    $.fn.spritespin = function (method) {
        if (api[method]) {
            return api[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof(method) === "object" || !method) {
            return api.init.apply(this, arguments);
        }
        $.error("Method " + method + " does not exist on jQuery.spritespin");
    };
    api.init = function (options) {
        var settings = {width: undefined, height: undefined, frames: 36, frame: 0, module: "360", behavior: "drag", animate: true, loop: false, loopFrame: 0, frameStep: 1, frameTime: 36, frameWrap: true, reverse: false, sense: 1, orientation: "horizontal", source: undefined, preloadHtml: undefined, preloadCSS: undefined, onFrame: undefined, onLoad: undefined, touchable: undefined};
        options = (options || {});
        $.extend(settings, options);
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("spritespin");
            if (!data) {
                var images = $this.find("img");
                var i = 0;
                if (images.length > 0) {
                    settings.source = [];
                    for (i = 0; i < images.length; i += 1) {
                        settings.source.push($(images[i]).attr("src"));
                    }
                }
                if (typeof(settings.source) === "string") {
                    settings.source = [settings.source];
                }
                $this.attr("unselectable", "on").css({overflow: "hidden", position: "relative"});
                $this.empty();
                $this.append($("<div class='spritespin-stage'/>"));
                $this.append($("<div class='spritespin-preload'/>"));
                $this.addClass("spritespin-instance");
                if (settings.enableCanvas) {
                    var canvas = $("<canvas class='spritespin-canvas'/>")[0];
                    var supported = !!(canvas.getContext && canvas.getContext("2d"));
                    if (supported) {
                        settings.canvas = $(canvas);
                        settings.context = canvas.getContext("2d");
                        $this.append(settings.canvas);
                    }
                }
                if (typeof(settings.module) === "string") {
                    settings.module = SpriteSpin.modules[settings.module];
                }
                settings.target = $this;
                settings.stage = $this.find(".spritespin-stage");
                settings.preload = $this.find(".spritespin-preload");
                settings.animation = null;
                settings.touchable = (settings.touchable || (/iphone|ipod|ipad|android/i).test(window.navigator.userAgent));
                $this.data("spritespin", settings);
                SpriteSpin.reload(settings, true);
            } else {
                $.extend(data, options);
                if (options.source) {
                    SpriteSpin.reload(data);
                } else {
                    $this.spritespin("animate", data.animate, data.loop);
                }
            }
        });
    };
    api.destroy = function () {
        return this.each(function () {
            var $this = $(this);
            $this.unbind(".spritespin");
            $this.removeData("spritespin");
        });
    };
    api.update = function (frame) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("spritespin");
            if (frame === undefined) {
                data.frame += ((data.animation && data.reverse) ? -data.frameStep : data.frameStep);
            } else {
                data.frame = frame;
            }
            if (data.animation || (!data.animation && data.frameWrap)) {
                data.frame = Spin.wrap(data.frame, 0, data.frames - 1, data.frames);
            } else {
                data.frame = Spin.clamp(data.frame, 0, data.frames - 1);
            }
            if (!data.loop && data.animation && (data.frame === data.loopFrame)) {
                api.animate.apply(data.target, [false]);
            }
            data.target.trigger("onFrame", data);
        });
    };
    api.animate = function (animate, loop) {
        if (animate === undefined) {
            return $(this).data("spritespin").animation !== null;
        }
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("spritespin");
            if (typeof(loop) === "boolean") {
                data.loop = loop;
            }
            if (animate === "toggle") {
                data.animate = !data.animate;
            }
            if (typeof(animate) === "boolean") {
                data.animate = animate;
            }
            if (data.animation) {
                window.clearInterval(data.animation);
                data.animation = null;
            }
            if (data.animate) {
                data.animation = window.setInterval(function () {
                    try {
                        $this.spritespin("update");
                    } catch (err) {
                    }
                }, data.frameTime);
            }
        });
    };
    api.frame = function (frame) {
        if (frame === undefined) {
            return $(this).data("spritespin").frame;
        }
        return this.each(function () {
            $(this).spritespin("update", frame);
        });
    };
    api.loop = function (value) {
        if (value === undefined) {
            return $(this).data("spritespin").loop;
        }
        return this.each(function () {
            var $this = $(this);
            $this.spritespin("animate", $this.data("spritespin").animate, value);
        });
    };
    api.next = function () {
        return this.each(function () {
            var $this = $(this);
            $this.spritespin("frame", $this.spritespin("frame") + 1);
        });
    };
    api.prev = function () {
        return this.each(function () {
            var $this = $(this);
            $this.spritespin("frame", $this.spritespin("frame") - 1);
        });
    };
    api.animateTo = function (frame) {
        return this.each(function () {
            var $this = $(this);
            $this.spritespin({animate: true, loop: false, loopFrame: frame});
        });
    };
    Spin.behaviors.none = {name: "none", mousedown: $.noop, mousemove: $.noop, mouseup: $.noop, mouseenter: $.noop, mouseover: $.noop, mouseleave: $.noop, dblclick: $.noop, onFrame: $.noop};
}(jQuery, window));
(function () {
    var Loader = this.SpriteLoader = {};
    Loader.preload = function (images, callback) {
        if (typeof(images) === "string") {
            images = [images];
        }
        var i, data = {callback: callback, numLoaded: 0, numImages: images.length, images: []};
        for (i = 0; i < images.length; i += 1) {
            Loader.load(images[i], data);
        }
    };
    Loader.load = function (imageSource, data) {
        var image = new Image();
        data.images.push(image);
        image.onload = function () {
            data.numLoaded += 1;
            if (data.numLoaded === data.numImages) {
                data.callback(data.images);
            }
        };
        image.src = imageSource;
    };
}());
(function ($, window, Spin) {
    Spin.behaviors.click = {name: "click", mouseup: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        Spin.updateInput(e, data);
        $this.spritespin("animate", false);
        var h, p, o = data.target.offset();
        if (data.orientation == "horizontal") {
            h = data.width / 2;
            p = data.currentX - o.left;
        } else {
            h = data.height / 2;
            p = data.currentY - o.top;
        }
        if (p > h) {
            $this.spritespin("frame", data.frame + 1);
            data.reverse = false;
        } else {
            $this.spritespin("frame", data.frame - 1);
            data.reverse = true;
        }
    }};
}(jQuery, window, window.SpriteSpin));
(function ($, window, Spin) {
    Spin.behaviors.drag = {name: "drag", mousedown: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        Spin.updateInput(e, data);
        data.onDrag = true;
    }, mousemove: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        if (data.onDrag) {
            Spin.updateInput(e, data);
            var d;
            if (data.orientation == "horizontal") {
                d = data.dX / data.width;
            } else {
                d = data.dY / data.height;
            }
            var dFrame = d * data.frames * data.sense;
            var frame = Math.round(data.clickframe + dFrame);
            $this.spritespin("update", frame);
            $this.spritespin("animate", false);
        }
    }, mouseup: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        Spin.resetInput(data);
        data.onDrag = false;
    }, mouseleave: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        Spin.resetInput(data);
        data.onDrag = false;
    }};
}(jQuery, window, window.SpriteSpin));
(function ($, window, Spin) {
    Spin.behaviors.hold = {name: "hold", mousedown: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        Spin.updateInput(e, data);
        data.onDrag = true;
        $this.spritespin("animate", true);
    }, mousemove: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        if (data.onDrag) {
            Spin.updateInput(e, data);
            var h, d, o = data.target.offset();
            if (data.orientation == "horizontal") {
                h = (data.width / 2);
                d = (data.currentX - o.left - h) / h;
            } else {
                h = (data.height / 2);
                d = (data.currentY - o.top - h) / h;
            }
            data.reverse = d < 0;
            d = d < 0 ? -d : d;
            data.frameTime = 80 * (1 - d) + 20;
        }
    }, mouseup: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        Spin.resetInput(data);
        data.onDrag = false;
        $this.spritespin("animate", false);
    }, mouseleave: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        Spin.resetInput(data);
        data.onDrag = false;
        $this.spritespin("animate", false);
    }, onFrame: function (e) {
        var $this = $(this);
        $this.spritespin("animate", true);
    }};
}(jQuery, window, window.SpriteSpin));
(function ($, window, Spin) {
    Spin.behaviors.swipe = {name: "swipe", mousedown: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        Spin.updateInput(e, data);
        data.onDrag = true;
    }, mousemove: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        if (data.onDrag) {
            Spin.updateInput(e, data);
            var frame = data.frame;
            var snap = data.snap || 0.25;
            var d, s;
            if (data.orientation == "horizontal") {
                d = data.dX;
                s = data.width * snap;
            } else {
                d = data.dY;
                s = data.height * snap;
            }
            if (d > s) {
                frame = data.frame - 1;
                data.onDrag = false;
            } else {
                if (d < -s) {
                    frame = data.frame + 1;
                    data.onDrag = false;
                }
            }
            $this.spritespin("update", frame);
            $this.spritespin("animate", false);
        }
    }, mouseup: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        data.onDrag = false;
        Spin.resetInput(data);
    }, mouseleave: function (e) {
        var $this = $(this), data = $this.data("spritespin");
        data.onDrag = false;
        Spin.resetInput(data);
    }};
}(jQuery, window, window.SpriteSpin));
(function ($, window) {
    var Module = window.SpriteSpin.modules["360"] = {};
    Module.reload = function (data) {
        data.stage.empty();
        data.modopts = {gridsheet: (data.images.length == 1), resX: (data.resolutionX || data.images[0].width), resY: (data.resolutionY || data.images[0].height), offX: (data.offsetX || 0), offY: (data.offsetY || 0), stepX: (data.stepX || data.width), stepY: (data.stepY || data.height), numFramesX: (data.framesX || data.frames), oldFrame: data.frame};
        Module.draw(data);
    };
    Module.draw = function (data) {
        var opts = data.modopts;
        if (!opts.gridsheet) {
            if (data.canvas) {
                data.context.drawImage(data.images[data.frame], 0, 0);
            } else {
                data.stage.css({width: [data.width, "px"].join(""), height: [data.height, "px"].join(""), "background-image": ["url('", data.source[data.frame], "')"].join(""), "background-repeat": "no-repeat", "-webkit-background-size": [opts.resX, "px ", opts.resY, "px"].join("")});
            }
        } else {
            var image = data.source[0];
            var frameX = (data.frame % opts.numFramesX);
            var frameY = (data.frame / opts.numFramesX) | 0;
            var x = opts.offX + frameX * opts.stepX;
            var y = opts.offY + frameY * opts.stepY;
            if (data.canvas) {
                data.context.drawImage(data.images[0], x, y, data.width, data.height, 0, 0, data.width, data.height);
            } else {
                data.stage.css({width: [data.width, "px"].join(""), height: [data.height, "px"].join(""), "background-image": ["url('", image, "')"].join(""), "background-repeat": "no-repeat", "background-position": [-x, "px ", -y, "px"].join(""), "-webkit-background-size": [opts.resX, "px ", opts.resY, "px"].join("")});
            }
        }
    };
}(window.jQuery, window));
(function ($, window) {
    var Module = window.SpriteSpin.modules.gallery = {};
    Module.reload = function (data) {
        data.images = [];
        data.offsets = [];
        data.stage.empty();
        data.speed = 500;
        data.opacity = 0.25;
        data.oldFrame = 0;
        var size = 0, i = 0;
        for (i = 0; i < data.source.length; i += 1) {
            var img = $("<img src='" + data.source[i] + "'/>");
            data.stage.append(img);
            data.images.push(img);
            data.offsets.push(-size + (data.width - img[0].width) / 2);
            size += img[0].width;
            img.css({opacity: 0.25});
        }
        data.stage.css({width: size});
        data.images[data.oldFrame].animate({opacity: 1}, data.speed);
    };
    Module.draw = function (data) {
        if ((data.oldFrame != data.frame) && data.offsets) {
            data.stage.stop(true, false);
            data.stage.animate({left: data.offsets[data.frame]}, data.speed);
            data.images[data.oldFrame].animate({opacity: data.opacity}, data.speed);
            data.oldFrame = data.frame;
            data.images[data.oldFrame].animate({opacity: 1}, data.speed);
        } else {
            data.stage.css({left: data.offsets[data.frame] + data.dX});
        }
    };
    Module.resetInput = function (data) {
        if (!data.onDrag) {
            data.stage.animate({left: data.offsets[data.frame]});
        }
    };
}(jQuery, window));
(function ($, window) {
    var Module = window.SpriteSpin.modules.panorama = {};
    Module.reload = function (data) {
        data.stage.empty();
        var opts = data.modopts = {};
        opts.resX = (data.resolutionX || data.images[0].width);
        opts.resY = (data.resolutionY || data.images[0].height);
        if (data.orientation == "horizontal") {
            opts.frames = (data.frames || opts.resX);
        } else {
            opts.frames = (data.frames || opts.resY);
        }
        Module.draw(data);
    };
    Module.draw = function (data) {
        var opts = data.modopts;
        var x, y;
        if (data.orientation == "horizontal") {
            x = (data.frame % opts.frames);
            y = 0;
        } else {
            x = 0;
            y = (data.frame % opts.frames);
        }
        data.stage.css({width: [data.width, "px"].join(""), height: [data.height, "px"].join(""), "background-image": ["url('", data.source[0], "')"].join(""), "background-repeat": "repeat-both", "background-position": [-x, "px ", -y, "px"].join(""), "-webkit-background-size": [opts.resX, "px ", opts.resY, "px"].join("")});
    };
}(window.jQuery, window));
(function () {
    var n = this, t = n._, r = {}, e = Array.prototype, u = Object.prototype, i = Function.prototype, a = e.push, o = e.slice, c = e.concat, l = u.toString, f = u.hasOwnProperty, s = e.forEach, p = e.map, v = e.reduce, h = e.reduceRight, g = e.filter, d = e.every, m = e.some, y = e.indexOf, b = e.lastIndexOf, x = Array.isArray, _ = Object.keys, j = i.bind, w = function (n) {
        return n instanceof w ? n : this instanceof w ? (this._wrapped = n, void 0) : new w(n)
    };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = w), exports._ = w) : n._ = w, w.VERSION = "1.4.3";
    var A = w.each = w.forEach = function (n, t, e) {
        if (null != n)if (s && n.forEach === s)n.forEach(t, e); else if (n.length === +n.length) {
            for (var u = 0, i = n.length; i > u; u++)if (t.call(e, n[u], u, n) === r)return
        } else for (var a in n)if (w.has(n, a) && t.call(e, n[a], a, n) === r)return
    };
    w.map = w.collect = function (n, t, r) {
        var e = [];
        return null == n ? e : p && n.map === p ? n.map(t, r) : (A(n, function (n, u, i) {
            e[e.length] = t.call(r, n, u, i)
        }), e)
    };
    var O = "Reduce of empty array with no initial value";
    w.reduce = w.foldl = w.inject = function (n, t, r, e) {
        var u = arguments.length > 2;
        if (null == n && (n = []), v && n.reduce === v)return e && (t = w.bind(t, e)), u ? n.reduce(t, r) : n.reduce(t);
        if (A(n, function (n, i, a) {
            u ? r = t.call(e, r, n, i, a) : (r = n, u = !0)
        }), !u)throw new TypeError(O);
        return r
    }, w.reduceRight = w.foldr = function (n, t, r, e) {
        var u = arguments.length > 2;
        if (null == n && (n = []), h && n.reduceRight === h)return e && (t = w.bind(t, e)), u ? n.reduceRight(t, r) : n.reduceRight(t);
        var i = n.length;
        if (i !== +i) {
            var a = w.keys(n);
            i = a.length
        }
        if (A(n, function (o, c, l) {
            c = a ? a[--i] : --i, u ? r = t.call(e, r, n[c], c, l) : (r = n[c], u = !0)
        }), !u)throw new TypeError(O);
        return r
    }, w.find = w.detect = function (n, t, r) {
        var e;
        return E(n, function (n, u, i) {
            return t.call(r, n, u, i) ? (e = n, !0) : void 0
        }), e
    }, w.filter = w.select = function (n, t, r) {
        var e = [];
        return null == n ? e : g && n.filter === g ? n.filter(t, r) : (A(n, function (n, u, i) {
            t.call(r, n, u, i) && (e[e.length] = n)
        }), e)
    }, w.reject = function (n, t, r) {
        return w.filter(n, function (n, e, u) {
            return!t.call(r, n, e, u)
        }, r)
    }, w.every = w.all = function (n, t, e) {
        t || (t = w.identity);
        var u = !0;
        return null == n ? u : d && n.every === d ? n.every(t, e) : (A(n, function (n, i, a) {
            return(u = u && t.call(e, n, i, a)) ? void 0 : r
        }), !!u)
    };
    var E = w.some = w.any = function (n, t, e) {
        t || (t = w.identity);
        var u = !1;
        return null == n ? u : m && n.some === m ? n.some(t, e) : (A(n, function (n, i, a) {
            return u || (u = t.call(e, n, i, a)) ? r : void 0
        }), !!u)
    };
    w.contains = w.include = function (n, t) {
        return null == n ? !1 : y && n.indexOf === y ? -1 != n.indexOf(t) : E(n, function (n) {
            return n === t
        })
    }, w.invoke = function (n, t) {
        var r = o.call(arguments, 2);
        return w.map(n, function (n) {
            return(w.isFunction(t) ? t : n[t]).apply(n, r)
        })
    }, w.pluck = function (n, t) {
        return w.map(n, function (n) {
            return n[t]
        })
    }, w.where = function (n, t) {
        return w.isEmpty(t) ? [] : w.filter(n, function (n) {
            for (var r in t)if (t[r] !== n[r])return!1;
            return!0
        })
    }, w.max = function (n, t, r) {
        if (!t && w.isArray(n) && n[0] === +n[0] && 65535 > n.length)return Math.max.apply(Math, n);
        if (!t && w.isEmpty(n))return-1 / 0;
        var e = {computed: -1 / 0, value: -1 / 0};
        return A(n, function (n, u, i) {
            var a = t ? t.call(r, n, u, i) : n;
            a >= e.computed && (e = {value: n, computed: a})
        }), e.value
    }, w.min = function (n, t, r) {
        if (!t && w.isArray(n) && n[0] === +n[0] && 65535 > n.length)return Math.min.apply(Math, n);
        if (!t && w.isEmpty(n))return 1 / 0;
        var e = {computed: 1 / 0, value: 1 / 0};
        return A(n, function (n, u, i) {
            var a = t ? t.call(r, n, u, i) : n;
            e.computed > a && (e = {value: n, computed: a})
        }), e.value
    }, w.shuffle = function (n) {
        var t, r = 0, e = [];
        return A(n, function (n) {
            t = w.random(r++), e[r - 1] = e[t], e[t] = n
        }), e
    };
    var F = function (n) {
        return w.isFunction(n) ? n : function (t) {
            return t[n]
        }
    };
    w.sortBy = function (n, t, r) {
        var e = F(t);
        return w.pluck(w.map(n,function (n, t, u) {
            return{value: n, index: t, criteria: e.call(r, n, t, u)}
        }).sort(function (n, t) {
            var r = n.criteria, e = t.criteria;
            if (r !== e) {
                if (r > e || void 0 === r)return 1;
                if (e > r || void 0 === e)return-1
            }
            return n.index < t.index ? -1 : 1
        }), "value")
    };
    var k = function (n, t, r, e) {
        var u = {}, i = F(t || w.identity);
        return A(n, function (t, a) {
            var o = i.call(r, t, a, n);
            e(u, o, t)
        }), u
    };
    w.groupBy = function (n, t, r) {
        return k(n, t, r, function (n, t, r) {
            (w.has(n, t) ? n[t] : n[t] = []).push(r)
        })
    }, w.countBy = function (n, t, r) {
        return k(n, t, r, function (n, t) {
            w.has(n, t) || (n[t] = 0), n[t]++
        })
    }, w.sortedIndex = function (n, t, r, e) {
        r = null == r ? w.identity : F(r);
        for (var u = r.call(e, t), i = 0, a = n.length; a > i;) {
            var o = i + a >>> 1;
            u > r.call(e, n[o]) ? i = o + 1 : a = o
        }
        return i
    }, w.toArray = function (n) {
        return n ? w.isArray(n) ? o.call(n) : n.length === +n.length ? w.map(n, w.identity) : w.values(n) : []
    }, w.size = function (n) {
        return null == n ? 0 : n.length === +n.length ? n.length : w.keys(n).length
    }, w.first = w.head = w.take = function (n, t, r) {
        return null == n ? void 0 : null == t || r ? n[0] : o.call(n, 0, t)
    }, w.initial = function (n, t, r) {
        return o.call(n, 0, n.length - (null == t || r ? 1 : t))
    }, w.last = function (n, t, r) {
        return null == n ? void 0 : null == t || r ? n[n.length - 1] : o.call(n, Math.max(n.length - t, 0))
    }, w.rest = w.tail = w.drop = function (n, t, r) {
        return o.call(n, null == t || r ? 1 : t)
    }, w.compact = function (n) {
        return w.filter(n, w.identity)
    };
    var R = function (n, t, r) {
        return A(n, function (n) {
            w.isArray(n) ? t ? a.apply(r, n) : R(n, t, r) : r.push(n)
        }), r
    };
    w.flatten = function (n, t) {
        return R(n, t, [])
    }, w.without = function (n) {
        return w.difference(n, o.call(arguments, 1))
    }, w.uniq = w.unique = function (n, t, r, e) {
        w.isFunction(t) && (e = r, r = t, t = !1);
        var u = r ? w.map(n, r, e) : n, i = [], a = [];
        return A(u, function (r, e) {
            (t ? e && a[a.length - 1] === r : w.contains(a, r)) || (a.push(r), i.push(n[e]))
        }), i
    }, w.union = function () {
        return w.uniq(c.apply(e, arguments))
    }, w.intersection = function (n) {
        var t = o.call(arguments, 1);
        return w.filter(w.uniq(n), function (n) {
            return w.every(t, function (t) {
                return w.indexOf(t, n) >= 0
            })
        })
    }, w.difference = function (n) {
        var t = c.apply(e, o.call(arguments, 1));
        return w.filter(n, function (n) {
            return!w.contains(t, n)
        })
    }, w.zip = function () {
        for (var n = o.call(arguments), t = w.max(w.pluck(n, "length")), r = Array(t), e = 0; t > e; e++)r[e] = w.pluck(n, "" + e);
        return r
    }, w.object = function (n, t) {
        if (null == n)return{};
        for (var r = {}, e = 0, u = n.length; u > e; e++)t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
        return r
    }, w.indexOf = function (n, t, r) {
        if (null == n)return-1;
        var e = 0, u = n.length;
        if (r) {
            if ("number" != typeof r)return e = w.sortedIndex(n, t), n[e] === t ? e : -1;
            e = 0 > r ? Math.max(0, u + r) : r
        }
        if (y && n.indexOf === y)return n.indexOf(t, r);
        for (; u > e; e++)if (n[e] === t)return e;
        return-1
    }, w.lastIndexOf = function (n, t, r) {
        if (null == n)return-1;
        var e = null != r;
        if (b && n.lastIndexOf === b)return e ? n.lastIndexOf(t, r) : n.lastIndexOf(t);
        for (var u = e ? r : n.length; u--;)if (n[u] === t)return u;
        return-1
    }, w.range = function (n, t, r) {
        1 >= arguments.length && (t = n || 0, n = 0), r = arguments[2] || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = 0, i = Array(e); e > u;)i[u++] = n, n += r;
        return i
    };
    var I = function () {
    };
    w.bind = function (n, t) {
        var r, e;
        if (n.bind === j && j)return j.apply(n, o.call(arguments, 1));
        if (!w.isFunction(n))throw new TypeError;
        return r = o.call(arguments, 2), e = function () {
            if (!(this instanceof e))return n.apply(t, r.concat(o.call(arguments)));
            I.prototype = n.prototype;
            var u = new I;
            I.prototype = null;
            var i = n.apply(u, r.concat(o.call(arguments)));
            return Object(i) === i ? i : u
        }
    }, w.bindAll = function (n) {
        var t = o.call(arguments, 1);
        return 0 == t.length && (t = w.functions(n)), A(t, function (t) {
            n[t] = w.bind(n[t], n)
        }), n
    }, w.memoize = function (n, t) {
        var r = {};
        return t || (t = w.identity), function () {
            var e = t.apply(this, arguments);
            return w.has(r, e) ? r[e] : r[e] = n.apply(this, arguments)
        }
    }, w.delay = function (n, t) {
        var r = o.call(arguments, 2);
        return setTimeout(function () {
            return n.apply(null, r)
        }, t)
    }, w.defer = function (n) {
        return w.delay.apply(w, [n, 1].concat(o.call(arguments, 1)))
    }, w.throttle = function (n, t) {
        var r, e, u, i, a = 0, o = function () {
            a = new Date, u = null, i = n.apply(r, e)
        };
        return function () {
            var c = new Date, l = t - (c - a);
            return r = this, e = arguments, 0 >= l ? (clearTimeout(u), u = null, a = c, i = n.apply(r, e)) : u || (u = setTimeout(o, l)), i
        }
    }, w.debounce = function (n, t, r) {
        var e, u;
        return function () {
            var i = this, a = arguments, o = function () {
                e = null, r || (u = n.apply(i, a))
            }, c = r && !e;
            return clearTimeout(e), e = setTimeout(o, t), c && (u = n.apply(i, a)), u
        }
    }, w.once = function (n) {
        var t, r = !1;
        return function () {
            return r ? t : (r = !0, t = n.apply(this, arguments), n = null, t)
        }
    }, w.wrap = function (n, t) {
        return function () {
            var r = [n];
            return a.apply(r, arguments), t.apply(this, r)
        }
    }, w.compose = function () {
        var n = arguments;
        return function () {
            for (var t = arguments, r = n.length - 1; r >= 0; r--)t = [n[r].apply(this, t)];
            return t[0]
        }
    }, w.after = function (n, t) {
        return 0 >= n ? t() : function () {
            return 1 > --n ? t.apply(this, arguments) : void 0
        }
    }, w.keys = _ || function (n) {
        if (n !== Object(n))throw new TypeError("Invalid object");
        var t = [];
        for (var r in n)w.has(n, r) && (t[t.length] = r);
        return t
    }, w.values = function (n) {
        var t = [];
        for (var r in n)w.has(n, r) && t.push(n[r]);
        return t
    }, w.pairs = function (n) {
        var t = [];
        for (var r in n)w.has(n, r) && t.push([r, n[r]]);
        return t
    }, w.invert = function (n) {
        var t = {};
        for (var r in n)w.has(n, r) && (t[n[r]] = r);
        return t
    }, w.functions = w.methods = function (n) {
        var t = [];
        for (var r in n)w.isFunction(n[r]) && t.push(r);
        return t.sort()
    }, w.extend = function (n) {
        return A(o.call(arguments, 1), function (t) {
            if (t)for (var r in t)n[r] = t[r]
        }), n
    }, w.pick = function (n) {
        var t = {}, r = c.apply(e, o.call(arguments, 1));
        return A(r, function (r) {
            r in n && (t[r] = n[r])
        }), t
    }, w.omit = function (n) {
        var t = {}, r = c.apply(e, o.call(arguments, 1));
        for (var u in n)w.contains(r, u) || (t[u] = n[u]);
        return t
    }, w.defaults = function (n) {
        return A(o.call(arguments, 1), function (t) {
            if (t)for (var r in t)null == n[r] && (n[r] = t[r])
        }), n
    }, w.clone = function (n) {
        return w.isObject(n) ? w.isArray(n) ? n.slice() : w.extend({}, n) : n
    }, w.tap = function (n, t) {
        return t(n), n
    };
    var S = function (n, t, r, e) {
        if (n === t)return 0 !== n || 1 / n == 1 / t;
        if (null == n || null == t)return n === t;
        n instanceof w && (n = n._wrapped), t instanceof w && (t = t._wrapped);
        var u = l.call(n);
        if (u != l.call(t))return!1;
        switch (u) {
            case"[object String]":
                return n == t + "";
            case"[object Number]":
                return n != +n ? t != +t : 0 == n ? 1 / n == 1 / t : n == +t;
            case"[object Date]":
            case"[object Boolean]":
                return+n == +t;
            case"[object RegExp]":
                return n.source == t.source && n.global == t.global && n.multiline == t.multiline && n.ignoreCase == t.ignoreCase
        }
        if ("object" != typeof n || "object" != typeof t)return!1;
        for (var i = r.length; i--;)if (r[i] == n)return e[i] == t;
        r.push(n), e.push(t);
        var a = 0, o = !0;
        if ("[object Array]" == u) {
            if (a = n.length, o = a == t.length)for (; a-- && (o = S(n[a], t[a], r, e)););
        } else {
            var c = n.constructor, f = t.constructor;
            if (c !== f && !(w.isFunction(c) && c instanceof c && w.isFunction(f) && f instanceof f))return!1;
            for (var s in n)if (w.has(n, s) && (a++, !(o = w.has(t, s) && S(n[s], t[s], r, e))))break;
            if (o) {
                for (s in t)if (w.has(t, s) && !a--)break;
                o = !a
            }
        }
        return r.pop(), e.pop(), o
    };
    w.isEqual = function (n, t) {
        return S(n, t, [], [])
    }, w.isEmpty = function (n) {
        if (null == n)return!0;
        if (w.isArray(n) || w.isString(n))return 0 === n.length;
        for (var t in n)if (w.has(n, t))return!1;
        return!0
    }, w.isElement = function (n) {
        return!(!n || 1 !== n.nodeType)
    }, w.isArray = x || function (n) {
        return"[object Array]" == l.call(n)
    }, w.isObject = function (n) {
        return n === Object(n)
    }, A(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (n) {
        w["is" + n] = function (t) {
            return l.call(t) == "[object " + n + "]"
        }
    }), w.isArguments(arguments) || (w.isArguments = function (n) {
        return!(!n || !w.has(n, "callee"))
    }), w.isFunction = function (n) {
        return"function" == typeof n
    }, w.isFinite = function (n) {
        return isFinite(n) && !isNaN(parseFloat(n))
    }, w.isNaN = function (n) {
        return w.isNumber(n) && n != +n
    }, w.isBoolean = function (n) {
        return n === !0 || n === !1 || "[object Boolean]" == l.call(n)
    }, w.isNull = function (n) {
        return null === n
    }, w.isUndefined = function (n) {
        return void 0 === n
    }, w.has = function (n, t) {
        return f.call(n, t)
    }, w.noConflict = function () {
        return n._ = t, this
    }, w.identity = function (n) {
        return n
    }, w.times = function (n, t, r) {
        for (var e = Array(n), u = 0; n > u; u++)e[u] = t.call(r, u);
        return e
    }, w.random = function (n, t) {
        return null == t && (t = n, n = 0), n + (0 | Math.random() * (t - n + 1))
    };
    var T = {escape: {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "/": "&#x2F;"}};
    T.unescape = w.invert(T.escape);
    var M = {escape: RegExp("[" + w.keys(T.escape).join("") + "]", "g"), unescape: RegExp("(" + w.keys(T.unescape).join("|") + ")", "g")};
    w.each(["escape", "unescape"], function (n) {
        w[n] = function (t) {
            return null == t ? "" : ("" + t).replace(M[n], function (t) {
                return T[n][t]
            })
        }
    }), w.result = function (n, t) {
        if (null == n)return null;
        var r = n[t];
        return w.isFunction(r) ? r.call(n) : r
    }, w.mixin = function (n) {
        A(w.functions(n), function (t) {
            var r = w[t] = n[t];
            w.prototype[t] = function () {
                var n = [this._wrapped];
                return a.apply(n, arguments), z.call(this, r.apply(w, n))
            }
        })
    };
    var N = 0;
    w.uniqueId = function (n) {
        var t = "" + ++N;
        return n ? n + t : t
    }, w.templateSettings = {evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g};
    var q = /(.)^/, B = {"'": "'", "\\": "\\", "\r": "r", "\n": "n", "	": "t", "\u2028": "u2028", "\u2029": "u2029"}, D = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    w.template = function (n, t, r) {
        r = w.defaults({}, r, w.templateSettings);
        var e = RegExp([(r.escape || q).source, (r.interpolate || q).source, (r.evaluate || q).source].join("|") + "|$", "g"), u = 0, i = "__p+='";
        n.replace(e, function (t, r, e, a, o) {
            return i += n.slice(u, o).replace(D, function (n) {
                return"\\" + B[n]
            }), r && (i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'"), e && (i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'"), a && (i += "';\n" + a + "\n__p+='"), u = o + t.length, t
        }), i += "';\n", r.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
        try {
            var a = Function(r.variable || "obj", "_", i)
        } catch (o) {
            throw o.source = i, o
        }
        if (t)return a(t, w);
        var c = function (n) {
            return a.call(this, n, w)
        };
        return c.source = "function(" + (r.variable || "obj") + "){\n" + i + "}", c
    }, w.chain = function (n) {
        return w(n).chain()
    };
    var z = function (n) {
        return this._chain ? w(n).chain() : n
    };
    w.mixin(w), A(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (n) {
        var t = e[n];
        w.prototype[n] = function () {
            var r = this._wrapped;
            return t.apply(r, arguments), "shift" != n && "splice" != n || 0 !== r.length || delete r[0], z.call(this, r)
        }
    }), A(["concat", "join", "slice"], function (n) {
        var t = e[n];
        w.prototype[n] = function () {
            return z.call(this, t.apply(this._wrapped, arguments))
        }
    }), w.extend(w.prototype, {chain: function () {
        return this._chain = !0, this
    }, value: function () {
        return this._wrapped
    }})
}).call(this);
/**
 * Seadragon Ajax 0.8.9 (build 64702 on 2011-01-28)
 * http://gallery.expression.microsoft.com/SeadragonAjax
 * This code is distributed under the license agreement at:
 * http://go.microsoft.com/fwlink/?LinkId=164943
 */
(function (h, r, g, N) {
    var l = "100%", p = 10, w = "absolute", u = "relative", o = "hidden", L = " while executing ", f = "function", D = "mousewheel", k = "px", C = "inline-block", F = "span", j = "0px", B = "none", s = "div", H = "fixed", J = "undefined", z = ",", n = "number", d = "", I = "string", b = null, a = true, t = .5, c = false;
    if (!h.Seadragon)h.Seadragon = {};
    var v = h.Seadragon, i = v.Config;
    (function () {
        if (i)return;
        i = v.Config = {debugMode: c, animationTime: 1.5, blendTime: t, alwaysBlend: c, autoHideControls: a, constrainDuringPan: a, immediateRender: c, logarithmicZoom: a, wrapHorizontal: c, wrapVertical: c, wrapOverlays: c, transformOverlays: c, minZoomDimension: b, minZoomImageRatio: .8, maxZoomPixelRatio: 2, visibilityRatio: .8, springStiffness: 5, imageLoaderLimit: 2, clickTimeThreshold: 200, clickDistThreshold: 5, zoomPerClick: 2, zoomPerScroll: g.pow(2, 1 / 3), zoomPerSecond: 2, proxyUrl: b, imagePath: "img/"}
    })();
    var x = v.Strings;
    (function () {
        var a = "Hmm, this doesn't appear to be a valid Deep Zoom Image.";
        if (x)return;
        x = v.Strings = {Errors: {Failure: "Sorry, but Seadragon Ajax can't run on your browser!\nPlease try using IE 8 or Firefox 3.\n", Dzc: "Sorry, we don't support Deep Zoom Collections!", Dzi: a, Xml: a, Empty: "You asked us to open nothing, so we did just that.", ImageFormat: "Sorry, we don't support {0}-based Deep Zoom Images.", Security: "It looks like a security restriction stopped us from loading this Deep Zoom Image.", Status: "This space unintentionally left blank ({0} {1}).", Unknown: "Whoops, something inexplicably went wrong. Sorry!"}, Messages: {Loading: "Loading..."}, Tooltips: {FullPage: "Toggle full page", Home: "Go home", ZoomIn: "Zoom in (you can also use your mouse's scroll wheel)", ZoomOut: "Zoom out (you can also use your mouse's scroll wheel)"}};
        x.getString = function (f) {
            for (var c = f.split("."), a = x, b = 0; b < c.length; b++)a = a[c[b]] || {};
            if (typeof a != I)a = d;
            var e = arguments;
            return a.replace(/\{\d+\}/g, function (b) {
                var a = parseInt(b.match(/\d+/)) + 1;
                return a < e.length ? e[a] : d
            })
        };
        x.setString = function (e, d) {
            for (var c = e.split("."), b = x, a = 0; a < c.length - 1; a++) {
                if (!b[c[a]])b[c[a]] = {};
                b = b[c[a]]
            }
            b[c[a]] = d
        }
    })();
    var q = function () {
        this.log = function (c, d) {
            var a = h.console || {}, b = i.debugMode;
            if (b && a.log)a.log(c); else b && d && alert(c)
        };
        this.error = function (b, d) {
            var c = h.console || {}, a = i.debugMode;
            if (a && c.error)c.error(b); else a && alert(b);
            if (a)throw d || new Error(b)
        };
        this.fail = function (a) {
            alert(x.getString("Errors.Failure"));
            throw new Error(a)
        }
    };
    q = v.Debug = new q;
    var U = v.Profiler = function () {
        var d = this, o = d, f = c, e = 0, h = b, l = b, j = Infinity, g = 0, i = 0, n = Infinity, k = 0, m = 0;
        d.getAvgUpdateTime = function () {
            return g
        };
        d.getMinUpdateTime = function () {
            return j
        };
        d.getMaxUpdateTime = function () {
            return i
        };
        d.getAvgIdleTime = function () {
            return k
        };
        d.getMinIdleTime = function () {
            return n
        };
        d.getMaxIdleTime = function () {
            return m
        };
        d.isMidUpdate = function () {
            return f
        };
        d.getNumUpdates = function () {
            return e
        };
        d.beginUpdate = function () {
            f && o.endUpdate();
            f = a;
            h = (new Date).getTime();
            if (e < 1)return;
            var b = h - l;
            k = (k * (e - 1) + b) / e;
            if (b < n)n = b;
            if (b > m)m = b
        };
        d.endUpdate = function () {
            if (!f)return;
            l = (new Date).getTime();
            f = c;
            var a = l - h;
            e++;
            g = (g * (e - 1) + a) / e;
            if (a < j)j = a;
            if (a > i)i = a
        };
        d.clearProfile = function () {
            f = c;
            e = 0;
            h = b;
            l = b;
            j = Infinity;
            g = 0;
            i = 0;
            n = Infinity;
            k = 0;
            m = 0
        }
    }, m = v.Point;
    (function () {
        if (m)return;
        m = v.Point = function (a, b) {
            this.x = typeof a == n ? a : 0;
            this.y = typeof b == n ? b : 0
        };
        var a = m.prototype;
        a.plus = function (a) {
            return new m(this.x + a.x, this.y + a.y)
        };
        a.minus = function (a) {
            return new m(this.x - a.x, this.y - a.y)
        };
        a.times = function (a) {
            return new m(this.x * a, this.y * a)
        };
        a.divide = function (a) {
            return new m(this.x / a, this.y / a)
        };
        a.negate = function () {
            return new m(-this.x, -this.y)
        };
        a.distanceTo = function (a) {
            return g.sqrt(g.pow(this.x - a.x, 2) + g.pow(this.y - a.y, 2))
        };
        a.apply = function (a) {
            return new m(a(this.x), a(this.y))
        };
        a.equals = function (a) {
            return a instanceof m && this.x === a.x && this.y === a.y
        };
        a.toString = function () {
            return "(" + this.x + z + this.y + ")"
        }
    })();
    var y = v.Rect;
    (function () {
        if (y)return;
        y = v.Rect = function (d, e, c, b) {
            var a = this;
            a.x = typeof d == n ? d : 0;
            a.y = typeof e == n ? e : 0;
            a.width = typeof c == n ? c : 0;
            a.height = typeof b == n ? b : 0
        };
        var a = y.prototype;
        a.getAspectRatio = function () {
            return this.width / this.height
        };
        a.getTopLeft = function () {
            return new m(this.x, this.y)
        };
        a.getBottomRight = function () {
            var a = this;
            return new m(a.x + a.width, a.y + a.height)
        };
        a.getCenter = function () {
            var a = this;
            return new m(a.x + a.width / 2, a.y + a.height / 2)
        };
        a.getSize = function () {
            return new m(this.width, this.height)
        };
        a.equals = function (a) {
            var b = this;
            return a instanceof y && b.x === a.x && b.y === a.y && b.width === a.width && b.height === a.height
        };
        a.toString = function () {
            var a = this;
            return "[" + a.x + z + a.y + z + a.width + "x" + a.height + "]"
        }
    })();
    var Q = v.Spring = function (j) {
        var c = this, d = typeof j == n ? j : 0, e = d, b = d, a = (new Date).getTime(), h = a, f = a;

        function k(b) {
            var a = i.springStiffness;
            return (1 - g.exp(-b * a)) / (1 - g.exp(-a))
        }

        c.getCurrent = function () {
            return d
        };
        c.getTarget = function () {
            return b
        };
        c.resetTo = function (c) {
            b = c;
            f = a;
            e = b;
            h = f
        };
        c.springTo = function (c) {
            e = d;
            h = a;
            b = c;
            f = h + 1e3 * i.animationTime
        };
        c.shiftBy = function (a) {
            e += a;
            b += a
        };
        c.update = function () {
            a = (new Date).getTime();
            d = a >= f ? b : e + (b - e) * k((a - h) / (f - h))
        }
    }, A = v.Browser = {UNKNOWN: 0, IE: 1, FIREFOX: 2, SAFARI: 3, CHROME: 4, OPERA: 5}, e = function () {
        var t = "DOMMouseScroll", l = this, o = l, x = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"], z = {bmp: c, jpeg: a, jpg: a, png: a, tif: c, wdp: c}, u = A.UNKNOWN, p = 0, v = c, y = {};
        (function () {
            var d = navigator.appName, o = navigator.appVersion, a = navigator.userAgent;
            if (d == "Microsoft Internet Explorer" && !!h.attachEvent && !!h.ActiveXObject) {
                var i = a.indexOf("MSIE");
                u = A.IE;
                p = parseFloat(a.substring(i + 5, a.indexOf(";", i)));
                var j = r.documentMode;
                if (typeof j !== J)p = j
            } else if (d == "Netscape" && !!h.addEventListener) {
                var g = a.indexOf("Firefox"), b = a.indexOf("Safari"), l = a.indexOf("Chrome");
                if (g >= 0) {
                    u = A.FIREFOX;
                    p = parseFloat(a.substring(g + 8))
                } else if (b >= 0) {
                    var n = a.substring(0, b).lastIndexOf("/");
                    u = l >= 0 ? A.CHROME : A.SAFARI;
                    p = parseFloat(a.substring(n + 1, b))
                }
            } else if (d == "Opera" && !!h.opera && !!h.attachEvent) {
                u = A.OPERA;
                p = parseFloat(o)
            }
            for (var m = h.location.search.substring(1), k = m.split("&"), f = 0; f < k.length; f++) {
                var c = k[f], e = c.indexOf("=");
                if (e > 0)y[c.substring(0, e)] = decodeURIComponent(c.substring(e + 1))
            }
            v = u == A.IE && p < 9 || u == A.CHROME && p < 2
        })();
        function w(a, b) {
            if (b && a != r.body)return r.body; else return a.offsetParent
        }

        l.getBrowser = function () {
            return u
        };
        l.getBrowserVersion = function () {
            return p
        };
        l.getElement = function (a) {
            if (typeof a == I)a = r.getElementById(a);
            return a
        };
        l.getElementPosition = function (a) {
            var a = o.getElement(a), b = new m, c = o.getElementStyle(a).position == H, d = w(a, c);
            while (d) {
                b.x += a.offsetLeft;
                b.y += a.offsetTop;
                if (c)b = b.plus(o.getPageScroll());
                a = d;
                c = o.getElementStyle(a).position == H;
                d = w(a, c)
            }
            return b
        };
        l.getElementSize = function (a) {
            var a = o.getElement(a);
            return new m(a.clientWidth, a.clientHeight)
        };
        l.getElementStyle = function (a) {
            var a = o.getElement(a);
            if (a.currentStyle)return a.currentStyle; else if (h.getComputedStyle)return h.getComputedStyle(a, d); else q.fail("Unknown element style, no known technique.")
        };
        l.getEvent = function (a) {
            return a ? a : h.event
        };
        l.getMousePosition = function (a) {
            var a = o.getEvent(a), b = new m;
            if (a.type == t && u == A.FIREFOX && p < 3) {
                b.x = a.screenX;
                b.y = a.screenY
            } else if (typeof a.pageX == n) {
                b.x = a.pageX;
                b.y = a.pageY
            } else if (typeof a.clientX == n) {
                b.x = a.clientX + r.body.scrollLeft + r.documentElement.scrollLeft;
                b.y = a.clientY + r.body.scrollTop + r.documentElement.scrollTop
            } else q.fail("Unknown event mouse position, no known technique.");
            return b
        };
        l.getMouseScroll = function (b) {
            var b = o.getEvent(b), a = 0;
            if (typeof b.wheelDelta == n)a = b.wheelDelta; else if (typeof b.detail == n)a = b.detail * -1; else q.fail("Unknown event mouse scroll, no known technique.");
            return a ? a / g.abs(a) : 0
        };
        l.getPageScroll = function () {
            var a = new m, b = r.documentElement || {}, c = r.body || {};
            if (typeof h.pageXOffset == n) {
                a.x = h.pageXOffset;
                a.y = h.pageYOffset
            } else if (c.scrollLeft || c.scrollTop) {
                a.x = c.scrollLeft;
                a.y = c.scrollTop
            } else if (b.scrollLeft || b.scrollTop) {
                a.x = b.scrollLeft;
                a.y = b.scrollTop
            }
            return a
        };
        l.getWindowSize = function () {
            var a = new m, b = r.documentElement || {}, c = r.body || {};
            if (typeof h.innerWidth == n) {
                a.x = h.innerWidth;
                a.y = h.innerHeight
            } else if (b.clientWidth || b.clientHeight) {
                a.x = b.clientWidth;
                a.y = b.clientHeight
            } else if (c.clientWidth || c.clientHeight) {
                a.x = c.clientWidth;
                a.y = c.clientHeight
            } else q.fail("Unknown window size, no known technique.");
            return a
        };
        l.imageFormatSupported = function (a) {
            var a = a ? a : d;
            return !!z[a.toLowerCase()]
        };
        l.makeCenteredNode = function (h) {
            var b = "border:none; margin:0px; padding:0px;", h = e.getElement(h), c = o.makeNeutralElement(s), a = [];
            a.push('<div style="display:table; height:100%; width:100%;');
            a.push(b);
            a.push('#position:relative; overflow:hidden; text-align:left;">');
            a.push('<div style="#position:absolute; #top:50%; width:100%; ');
            a.push(b);
            a.push('display:table-cell; vertical-align:middle;">');
            a.push('<div style="#position:relative; #top:-50%; width:100%; ');
            a.push(b);
            a.push('text-align:center;"></div></div></div>');
            c.innerHTML = a.join(d);
            c = c.firstChild;
            var g = c, f = c.getElementsByTagName(s);
            while (f.length > 0) {
                g = f[0];
                f = g.getElementsByTagName(s)
            }
            g.appendChild(h);
            return c
        };
        l.makeNeutralElement = function (c) {
            var b = r.createElement(c), a = b.style;
            a.background = "transparent none";
            a.border = B;
            a.margin = j;
            a.padding = j;
            a.position = "static";
            return b
        };
        l.makeTransparentImage = function (d) {
            var c = o.makeNeutralElement("img"), a = b;
            if (u == A.IE && p < 7) {
                a = o.makeNeutralElement(F);
                a.style.display = C;
                c.onload = function () {
                    a.style.width = a.style.width || c.width + k;
                    a.style.height = a.style.height || c.height + k;
                    c.onload = b;
                    c = b
                };
                c.src = d;
                a.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + d + "', sizingMethod='scale')"
            } else {
                a = c;
                a.src = d
            }
            return a
        };
        l.setElementOpacity = function (b, a, f) {
            var b = o.getElement(b);
            if (f && v)a = g.round(a);
            if (a < 1)b.style.opacity = a; else b.style.opacity = d;
            var c = b.style.filter || d;
            b.style.filter = c.replace(/[\s]*alpha\(.*?\)[\s]*/g, d);
            if (a >= 1)return;
            var e = g.round(100 * a), h = " alpha(opacity=" + e + ") ";
            b.style.filter += h
        };
        l.addEvent = function (a, c, d, b) {
            var a = o.getElement(a);
            if (a.addEventListener) {
                c == D && a.addEventListener(t, d, b);
                a.addEventListener(c, d, b)
            } else if (a.attachEvent) {
                a.attachEvent("on" + c, d);
                b && a.setCapture && a.setCapture()
            } else q.fail("Unable to attach event handler, no known technique.")
        };
        l.removeEvent = function (a, c, d, b) {
            var a = o.getElement(a);
            if (a.removeEventListener) {
                c == D && a.removeEventListener(t, d, b);
                a.removeEventListener(c, d, b)
            } else if (a.detachEvent) {
                a.detachEvent("on" + c, d);
                b && a.releaseCapture && a.releaseCapture()
            } else q.fail("Unable to detach event handler, no known technique.")
        };
        l.cancelEvent = function (b) {
            var b = o.getEvent(b);
            b.preventDefault && b.preventDefault();
            b.cancel = a;
            b.returnValue = c
        };
        l.stopEvent = function (b) {
            var b = o.getEvent(b);
            b.stopPropagation && b.stopPropagation();
            b.cancelBubble = a
        };
        l.createCallback = function (d, c) {
            for (var b = [], a = 2; a < arguments.length; a++)b.push(arguments[a]);
            return function () {
                for (var e = b.concat([]), a = 0; a < arguments.length; a++)e.push(arguments[a]);
                return c.apply(d, e)
            }
        };
        l.getUrlParameter = function (c) {
            var a = y[c];
            return a ? a : b
        };
        l.makeAjaxRequest = function (j, d) {
            var c = typeof d == f, a = b;
            if (c)var l = d, d = function () {
                h.setTimeout(e.createCallback(b, l, a), 1)
            };
            if (h.ActiveXObject)for (var k = 0; k < x.length; k++)try {
                a = new ActiveXObject(x[k]);
                break
            } catch (g) {
                continue
            } else if (h.XMLHttpRequest)a = new XMLHttpRequest;
            !a && q.fail("Browser doesn't support XMLHttpRequest.");
            if (i.proxyUrl)j = i.proxyUrl + j;
            if (c)a.onreadystatechange = function () {
                if (a.readyState == 4) {
                    a.onreadystatechange = new Function;
                    d()
                }
            };
            try {
                a.open("GET", j, c);
                a.send(b)
            } catch (g) {
                q.log(g.name + " while making AJAX request: " + g.message);
                a.onreadystatechange = b;
                a = b;
                c && d()
            }
            return c ? b : a
        };
        l.parseXml = function (e) {
            var d = b;
            if (h.ActiveXObject)try {
                d = new ActiveXObject("Microsoft.XMLDOM");
                d.async = c;
                d.loadXML(e)
            } catch (a) {
                q.log(a.name + " while parsing XML (ActiveX): " + a.message)
            } else if (h.DOMParser)try {
                var f = new DOMParser;
                d = f.parseFromString(e, "text/xml")
            } catch (a) {
                q.log(a.name + " while parsing XML (DOMParser): " + a.message)
            } else q.fail("Browser doesn't support XML DOM.");
            return d
        }
    };
    e = v.Utils = new e;
    var M = v.MouseTracker;
    (function () {
        var d = "mouseup", j = "mousedown";
        if (M)return;
        var l = e.getBrowser() == A.IE && e.getBrowserVersion() < 9, o = c, t = c, s = {}, m = [];

        function p(a) {
            return e.getMousePosition(a)
        }

        function k(b, d) {
            var c = e.getMousePosition(b), a = e.getElementPosition(d);
            return c.minus(a)
        }

        function n(b, a) {
            var d = r.body;
            while (a && b != a && d != a)try {
                a = a.parentNode
            } catch (e) {
                return c
            }
            return b == a
        }

        function u() {
            o = a
        }

        function w() {
            o = c
        }

        (function () {
            if (l) {
                e.addEvent(r, j, u, c);
                e.addEvent(r, d, w, c)
            } else {
                e.addEvent(h, j, u, a);
                e.addEvent(h, d, w, a)
            }
        })();
        M = v.MouseTracker = function (u) {
            var w = "mousemove", z = "mouseout", y = "mouseover", x = this, v = x, H = b, M = g.random(), u = e.getElement(u), F = c, A = c, C = c, E = c, G = b, O = b, N = b;
            x.target = u;
            x.enterHandler = b;
            x.exitHandler = b;
            x.pressHandler = b;
            x.releaseHandler = b;
            x.clickHandler = b;
            x.dragHandler = b;
            x.scrollHandler = b;
            function X() {
                if (!F) {
                    e.addEvent(u, y, K, c);
                    e.addEvent(u, z, L, c);
                    e.addEvent(u, j, U, c);
                    e.addEvent(u, d, B, c);
                    e.addEvent(u, D, R, c);
                    e.addEvent(u, "click", T, c);
                    F = a;
                    s[M] = H
                }
            }

            function Z() {
                if (F) {
                    e.removeEvent(u, y, K, c);
                    e.removeEvent(u, z, L, c);
                    e.removeEvent(u, j, U, c);
                    e.removeEvent(u, d, B, c);
                    e.removeEvent(u, D, R, c);
                    e.removeEvent(u, "click", T, c);
                    I();
                    F = c;
                    delete s[M]
                }
            }

            function Y() {
                if (!A) {
                    if (l) {
                        e.removeEvent(u, d, B, c);
                        e.addEvent(u, d, V, a);
                        e.addEvent(u, w, Q, a)
                    } else {
                        e.addEvent(h, d, P, a);
                        e.addEvent(h, w, J, a)
                    }
                    A = a
                }
            }

            function I() {
                if (A) {
                    if (l) {
                        e.removeEvent(u, w, Q, a);
                        e.removeEvent(u, d, V, a);
                        e.addEvent(u, d, B, c)
                    } else {
                        e.removeEvent(h, w, J, a);
                        e.removeEvent(h, d, P, a)
                    }
                    A = c
                }
            }

            function S(c, d) {
                var b = s;
                for (var a in b)b.hasOwnProperty(a) && M != a && b[a][c](d)
            }

            function ab() {
                return E
            }

            function K(b) {
                var b = e.getEvent(b);
                l && A && !n(b.srcElement, u) && S("onMouseOver", b);
                var g = b.target ? b.target : b.srcElement, d = b.relatedTarget ? b.relatedTarget : b.fromElement;
                if (!n(u, g) || n(u, d))return;
                E = a;
                if (typeof v.enterHandler == f)try {
                    v.enterHandler(v, k(b, u), C, o)
                } catch (c) {
                    q.error(c.name + " while executing enter handler: " + c.message, c)
                }
            }

            function L(a) {
                var a = e.getEvent(a);
                l && A && !n(a.srcElement, u) && S("onMouseOut", a);
                var d = a.target ? a.target : a.srcElement, g = a.relatedTarget ? a.relatedTarget : a.toElement;
                if (!n(u, d) || n(u, g))return;
                E = c;
                if (typeof v.exitHandler == f)try {
                    v.exitHandler(v, k(a, u), C, o)
                } catch (b) {
                    q.error(b.name + " while executing exit handler: " + b.message, b)
                }
            }

            function U(b) {
                var b = e.getEvent(b);
                if (b.button == 2)return;
                C = a;
                G = p(b);
                N = G;
                O = (new Date).getTime();
                if (typeof v.pressHandler == f)try {
                    v.pressHandler(v, k(b, u))
                } catch (c) {
                    q.error(c.name + " while executing press handler: " + c.message, c)
                }
                (v.pressHandler || v.dragHandler) && e.cancelEvent(b);
                if (!l || !t) {
                    Y();
                    t = a;
                    m = [H]
                } else l && m.push(H)
            }

            function B(a) {
                var a = e.getEvent(a), g = C, d = E;
                if (a.button == 2)return;
                C = c;
                if (typeof v.releaseHandler == f)try {
                    v.releaseHandler(v, k(a, u), g, d)
                } catch (b) {
                    q.error(b.name + " while executing release handler: " + b.message, b)
                }
                g && d && W(a)
            }

            function V(a) {
                var a = e.getEvent(a);
                if (a.button == 2)return;
                for (var b = 0; b < m.length; b++) {
                    var d = m[b];
                    !d.hasMouse() && d.onMouseUp(a)
                }
                I();
                t = c;
                a.srcElement.fireEvent("on" + a.type, r.createEventObject(a));
                e.stopEvent(a)
            }

            function P(a) {
                !E && B(a);
                I()
            }

            function T(a) {
                v.clickHandler && e.cancelEvent(a)
            }

            function W(a) {
                var a = e.getEvent(a);
                if (a.button == 2)return;
                var h = (new Date).getTime() - O, d = p(a), c = N.distanceTo(d), g = h <= i.clickTimeThreshold && c <= i.clickDistThreshold;
                if (typeof v.clickHandler == f)try {
                    v.clickHandler(v, k(a, u), g, a.shiftKey)
                } catch (b) {
                    q.error(b.name + " while executing click handler: " + b.message, b)
                }
            }

            function J(a) {
                var a = e.getEvent(a), c = p(a), d = c.minus(G);
                G = c;
                if (typeof v.dragHandler == f) {
                    try {
                        v.dragHandler(v, k(a, u), d, a.shiftKey)
                    } catch (b) {
                        q.error(b.name + " while executing drag handler: " + b.message, b)
                    }
                    e.cancelEvent(a)
                }
            }

            function Q(b) {
                for (var a = 0; a < m.length; a++)m[a].onMouseMove(b);
                e.stopEvent(b)
            }

            function R(a) {
                var a = e.getEvent(a), c = e.getMouseScroll(a);
                if (typeof v.scrollHandler == f) {
                    if (c)try {
                        v.scrollHandler(v, k(a, u), c, a.shiftKey)
                    } catch (b) {
                        q.error(b.name + " while executing scroll handler: " + b.message, b)
                    }
                    e.cancelEvent(a)
                }
            }

            (function () {
                H = {hasMouse: ab, onMouseOver: K, onMouseOut: L, onMouseUp: B, onMouseMove: J}
            })();
            x.isTracking = function () {
                return F
            };
            x.setTracking = function (a) {
                if (a)X(); else Z()
            }
        }
    })();
    var W = v.EventManager = function () {
        var b = this, a = {};
        b.addListener = function (b, c) {
            if (typeof c != f)return;
            if (!a[b])a[b] = [];
            a[b].push(c)
        };
        b.removeListener = function (e, d) {
            var b = a[e];
            if (typeof d != f)return; else if (!b)return;
            for (var c = 0; c < b.length; c++)if (d == b[c]) {
                b.splice(c, 1);
                return
            }
        };
        b.clearListeners = function (b) {
            if (a[b])delete a[b]
        };
        b.trigger = function (e) {
            var d = a[e], f = [];
            if (!d)return;
            for (var b = 1; b < arguments.length; b++)f.push(arguments[b]);
            for (var b = 0; b < d.length; b++)try {
                d[b].apply(h, f)
            } catch (c) {
                q.error(c.name + L + e + " handler: " + c.message, c)
            }
        }
    }, S;
    (function () {
        var d = 15000;

        function g(i, j) {
            var e = b, f = b;

            function g(a) {
                e.onload = b;
                e.onabort = b;
                e.onerror = b;
                f && h.clearTimeout(f);
                h.setTimeout(function () {
                    j(i, a ? e : b)
                }, 1)
            }

            this.start = function () {
                e = new Image;
                var j = function () {
                    g(a)
                }, b = function () {
                    g(c)
                }, k = function () {
                    q.log("Image timed out: " + i);
                    g(c)
                };
                e.onload = j;
                e.onabort = b;
                e.onerror = b;
                f = h.setTimeout(k, d);
                e.src = i
            }
        }

        S = v.ImageLoader = function () {
            var d = 0;

            function h(b, e, c) {
                d--;
                if (typeof b == f)try {
                    b(c)
                } catch (a) {
                    q.error(a.name + L + e + " callback: " + a.message, a)
                }
            }

            this.loadImage = function (l, f) {
                if (d >= i.imageLoaderLimit)return c;
                var j = e.createCallback(b, h, f), k = new g(l, j);
                d++;
                k.start();
                return a
            }
        }
    })();
    var O, R;
    (function () {
        var i = {REST: 0, GROUP: 1, HOVER: 2, DOWN: 3};
        O = v.Button = function (W, V, S, T, U, y, q, v, x, z) {
            var l = e.makeNeutralElement(F), k = i.GROUP, m = new M(l), H = e.makeTransparentImage(V), r = e.makeTransparentImage(S), s = e.makeTransparentImage(T), t = e.makeTransparentImage(U), y = typeof y == f ? y : b, q = typeof q == f ? q : b, v = typeof v == f ? v : b, x = typeof x == f ? x : b, z = typeof z == f ? z : b, G = 0, P = 2e3, D = b, B = c;
            this.elmt = l;
            function E() {
                h.setTimeout(R, 20)
            }

            function R() {
                if (B) {
                    var c = (new Date).getTime(), d = c - D, b = 1 - d / P;
                    b = g.min(1, b);
                    b = g.max(0, b);
                    e.setElementOpacity(r, b, a);
                    b > 0 && E()
                }
            }

            function N() {
                B = a;
                D = (new Date).getTime() + G;
                h.setTimeout(E, G)
            }

            function Q() {
                B = c;
                e.setElementOpacity(r, 1, a)
            }

            function p(a) {
                if (a >= i.GROUP && k == i.REST) {
                    Q();
                    k = i.GROUP
                }
                if (a >= i.HOVER && k == i.GROUP) {
                    s.style.visibility = d;
                    k = i.HOVER
                }
                if (a >= i.DOWN && k == i.HOVER) {
                    t.style.visibility = d;
                    k = i.DOWN
                }
            }

            function n(a) {
                if (a <= i.HOVER && k == i.DOWN) {
                    t.style.visibility = o;
                    k = i.HOVER
                }
                if (a <= i.GROUP && k == i.HOVER) {
                    s.style.visibility = o;
                    k = i.GROUP
                }
                if (a <= i.REST && k == i.GROUP) {
                    N();
                    k = i.REST
                }
            }

            function K(d, c, a, b) {
                if (a) {
                    p(i.DOWN);
                    x && x()
                } else!b && p(i.HOVER)
            }

            function O(d, c, a) {
                n(i.GROUP);
                a && z && z()
            }

            function L() {
                p(i.DOWN);
                y && y()
            }

            function I(d, c, a, b) {
                if (a && b) {
                    n(i.HOVER);
                    q && q()
                } else if (a)n(i.GROUP); else p(i.HOVER)
            }

            function J(c, b, a) {
                v && a && v()
            }

            this.notifyGroupEnter = function () {
                p(i.GROUP)
            };
            this.notifyGroupExit = function () {
                n(i.REST)
            };
            (function () {
                l.style.display = C;
                l.style.position = u;
                l.title = W;
                l.appendChild(H);
                l.appendChild(r);
                l.appendChild(s);
                l.appendChild(t);
                var g = H.style, f = r.style, b = s.style, c = t.style;
                f.position = b.position = c.position = w;
                f.top = b.top = c.top = j;
                f.left = b.left = c.left = j;
                b.visibility = c.visibility = o;
                if (e.getBrowser() == A.FIREFOX && e.getBrowserVersion() < 3)f.top = b.top = c.top = d;
                m.enterHandler = K;
                m.exitHandler = O;
                m.pressHandler = L;
                m.releaseHandler = I;
                m.clickHandler = J;
                m.setTracking(a);
                n(i.REST)
            })()
        };
        R = v.ButtonGroup = function (b) {
            var d = e.makeNeutralElement(F), b = b.concat([]), c = new M(d);
            this.elmt = d;
            function f() {
                for (var a = 0; a < b.length; a++)b[a].notifyGroupEnter()
            }

            function g(f, e, c) {
                if (!c)for (var a = 0; a < b.length; a++)b[a].notifyGroupExit()
            }

            function h(f, e, d, c) {
                if (!c)for (var a = 0; a < b.length; a++)b[a].notifyGroupExit()
            }

            this.emulateEnter = function () {
                f()
            };
            this.emulateExit = function () {
                g()
            };
            (function () {
                d.style.display = C;
                for (var e = 0; e < b.length; e++)d.appendChild(b[e].elmt);
                c.enterHandler = f;
                c.exitHandler = g;
                c.releaseHandler = h;
                c.setTracking(a)
            })()
        }
    })();
    var T = v.TileSource = function (d, c, i, e, h, f) {
        var b = this, a = b, j = c / d;
        b.width = d;
        b.height = c;
        b.aspectRatio = d / c;
        b.dimensions = new m(d, c);
        b.minLevel = h ? h : 0;
        b.maxLevel = f ? f : g.ceil(g.log(g.max(d, c)) / g.log(2));
        b.tileSize = i ? i : 0;
        b.tileOverlap = e ? e : 0;
        b.getLevelScale = function (b) {
            return 1 / (1 << a.maxLevel - b)
        };
        b.getNumTiles = function (e) {
            var b = a.getLevelScale(e), f = g.ceil(b * d / a.tileSize), h = g.ceil(b * c / a.tileSize);
            return new m(f, h)
        };
        b.getPixelRatio = function (c) {
            var b = a.dimensions.times(a.getLevelScale(c)), d = 1 / b.x, e = 1 / b.y;
            return new m(d, e)
        };
        b.getTileAtPoint = function (h, d) {
            var b = a.dimensions.times(a.getLevelScale(h)), c = d.times(b.x), e, f;
            if (d.x >= 0 && d.x <= 1)e = g.floor(c.x / a.tileSize); else e = g.ceil(b.x / a.tileSize) * g.floor(c.x / b.x) + g.floor((b.x + c.x % b.x) % b.x / a.tileSize);
            if (d.y >= 0 && d.y <= j)f = g.floor(c.y / a.tileSize); else f = g.ceil(b.y / a.tileSize) * g.floor(c.y / b.y) + g.floor((b.y + c.y % b.y) % b.y / a.tileSize);
            return new m(e, f)
        };
        b.getTileBounds = function (k, f, h) {
            var c = a.dimensions.times(a.getLevelScale(k)), i = f === 0 ? 0 : a.tileSize * f - a.tileOverlap, j = h === 0 ? 0 : a.tileSize * h - a.tileOverlap, d = a.tileSize + (f === 0 ? 1 : 2) * a.tileOverlap, e = a.tileSize + (h === 0 ? 1 : 2) * a.tileOverlap;
            d = g.min(d, c.x - i);
            e = g.min(e, c.y - j);
            var b = 1 / c.x;
            return new y(i * b, j * b, d * b, e * b)
        };
        b.getTileUrl = function () {
            throw new Error("Method not implemented.")
        };
        b.tileExists = function (b, d, e) {
            var c = a.getNumTiles(b);
            return b >= a.minLevel && b <= a.maxLevel && d >= 0 && e >= 0 && d < c.x && e < c.y
        }
    }, P = v.DisplayRect = function (e, f, d, c, b, a) {
        y.apply(this, arguments);
        this.minLevel = b;
        this.maxLevel = a
    };
    P.prototype = new y;
    var K = v.DziTileSource = function (m, l, e, j, k, i, f) {
        var b = this;
        T.apply(b, [m, l, e, j]);
        var n = b, h = {};
        b.fileFormat = i;
        b.tileFormat = i;
        b.displayRects = f;
        (function () {
            if (!f)return;
            for (var c = f.length - 1; c >= 0; c--)for (var b = f[c], a = b.minLevel; a <= b.maxLevel; a++) {
                if (!h[a])h[a] = [];
                h[a].push(b)
            }
        })();
        b.getTileUrl = function (a, b, c) {
            return [k, a, "/", b, "_", c, ".", i].join(d)
        };
        b.tileExists = function (d, p, q) {
            var f = h[d];
            if (!f || !f.length)return a;
            for (var i = n.getLevelScale(d), o = f.length - 1; o >= 0; o--) {
                var b = f[o];
                if (d < b.minLevel || d > b.maxLevel)continue;
                var j = b.x * i, k = b.y * i, l = j + b.width * i, m = k + b.height * i;
                j = g.floor(j / e);
                k = g.floor(k / e);
                l = g.ceil(l / e);
                m = g.ceil(m / e);
                if (j <= p && p < l && k <= q && q < m)return a
            }
            return c
        }
    };
    K.prototype = new T;
    (function () {
        var c = "Errors.Empty";

        function a(a) {
            Error.apply(this, arguments);
            this.message = a
        }

        a.prototype = new Error;
        function i(b) {
            if (!(b instanceof a)) {
                q.error(b.name + " while creating DZI from XML: " + b.message);
                b = new a(x.getString("Errors.Unknown"))
            }
            return b
        }

        function d(d) {
            var a = d.split("/"), b = a[a.length - 1], c = b.lastIndexOf(".");
            if (c > -1)a[a.length - 1] = b.slice(0, c);
            return a.join("/") + "_files/"
        }

        function j(c, i) {
            if (!c)throw new a(x.getString("Errors.Security")); else if (c.status !== 200 && c.status !== 0) {
                var f = c.status, h = f == 404 ? "Not Found" : c.statusText;
                throw new a(x.getString("Errors.Status", f, h))
            }
            var d = b;
            if (c.responseXML && c.responseXML.documentElement)d = c.responseXML; else if (c.responseText)d = e.parseXml(c.responseText);
            return g(d, i)
        }

        function g(d, g) {
            var b = "Errors.Dzi";
            if (!d || !d.documentElement)throw new a(x.getString("Errors.Xml"));
            var e = d.documentElement, c = e.tagName;
            if (c == "Image")try {
                return l(e, g)
            } catch (f) {
                var h = x.getString(b);
                throw f instanceof a ? f : new a(h)
            } else if (c == "Collection")throw new a(x.getString("Errors.Dzc")); else if (c == "Error")return k(e);
            throw new a(x.getString(b))
        }

        function l(b, m) {
            var f = b.getAttribute("Format");
            if (!e.imageFormatSupported(f))throw new a(x.getString("Errors.ImageFormat", f.toUpperCase()));
            for (var j = b.getElementsByTagName("Size")[0], h = b.getElementsByTagName("DisplayRect"), o = parseInt(j.getAttribute("Width"), p), n = parseInt(j.getAttribute("Height"), p), l = parseInt(b.getAttribute("TileSize")), k = parseInt(b.getAttribute("Overlap")), i = [], g = 0; g < h.length; g++) {
                var d = h[g], c = d.getElementsByTagName("Rect")[0];
                i.push(new P(parseInt(c.getAttribute("X"), p), parseInt(c.getAttribute("Y"), p), parseInt(c.getAttribute("Width"), p), parseInt(c.getAttribute("Height"), p), parseInt(d.getAttribute("MinLevel"), p), parseInt(d.getAttribute("MaxLevel"), p)))
            }
            return new K(o, n, l, k, m, f, i)
        }

        function k(c) {
            var b = c.getElementsByTagName("Message")[0], d = b.firstChild.nodeValue;
            throw new a(d)
        }

        K.getTilesUrl = d;
        K.createFromJson = function (q, o) {
            var r = typeof o == f, m, k, g = q;
            if (!g || !g.url && !g.tilesUrl)k = new a(x.getString(c)); else try {
                var l = g.displayRects;
                if (l && l.length)for (var n = 0, s = l.length; n < s; n++) {
                    var j = l[n];
                    l[n] = new P(j.x || j[0], j.y || j[1], j.width || j[2], j.height || j[3], j.minLevel || j[4], j.maxLevel || j[5])
                }
                m = new K(g.width, g.height, g.tileSize, g.tileOverlap, g.tilesUrl || d(g.url), g.tileFormat, g.displayRects);
                m.xmlUrl = g.url
            } catch (p) {
                k = i(p)
            }
            if (r)h.setTimeout(e.createCallback(b, o, m, k && k.message), 1); else if (k)throw k; else return m
        };
        K.createFromXml = function (l, m, n) {
            var p = typeof n == f, k = b;
            if (!l) {
                k = x.getString(c);
                if (p) {
                    h.setTimeout(function () {
                        n(b, k)
                    }, 1);
                    return b
                }
                throw new a(k)
            }
            var q = d(l);

            function o(d, e) {
                try {
                    var c = d(e, q);
                    c.xmlUrl = l;
                    return c
                } catch (a) {
                    if (p) {
                        k = i(a).message;
                        return b
                    } else throw i(a)
                }
            }

            if (p) {
                if (m)h.setTimeout(function () {
                    var a = o(g, e.parseXml(m));
                    n(a, k)
                }, 1); else e.makeAjaxRequest(l, function (b) {
                    var a = o(j, b);
                    n(a, k)
                });
                return b
            }
            if (m)return o(g, e.parseXml(m)); else return o(j, e.makeAjaxRequest(l))
        }
    })();
    var X = v.Viewport = function (e, n) {
        var d = this, c = d, e = new m(e.x, e.y), s = n.x / n.y, o = n.y / n.x, h = new Q(0), j = new Q(0), l = new Q(i.logarithmicZoom ? 0 : 1), f = b, k = new y(0, 0, 1, o), q = k.getCenter(), A = g.LN2;

        function z() {
            c.goHome(a);
            c.update()
        }

        function u(a) {
            return g.log(a) / A
        }

        function w(a) {
            return g.pow(2, a)
        }

        function r(c, b, a) {
            return g.min(g.max(c, b), a)
        }

        function x(b, a) {
            var d = b.x, f = b.y, c = r(d, a.x, a.x + a.width), e = r(f, a.y, a.y + a.height);
            return d === c && f === e ? b : new m(c, e)
        }

        function p(h) {
            var k = c.getZoom(h), g = 1 / k, j = g / c.getAspectRatio(), f = i.visibilityRatio, d = (f - t) * g, e = (f - t) * j, a = 1 - 2 * d, b = o - 2 * e;
            if (a < 0) {
                d += t * a;
                a = 0
            }
            if (b < 0) {
                e += t * b;
                b = 0
            }
            return new v.Rect(d, e, a, b)
        }

        d.getHomeBounds = function () {
            var b = c.getAspectRatio(), a = new y(k.x, k.y, k.width, k.height);
            if (s >= b) {
                a.height = k.width / b;
                a.y = q.y - a.height / 2
            } else {
                a.width = k.height * b;
                a.x = q.x - a.width / 2
            }
            return a
        };
        d.getHomeCenter = function () {
            return q
        };
        d.getHomeZoom = function () {
            var a = s / c.getAspectRatio();
            return a >= 1 ? 1 : a
        };
        d.getMinCenter = function (a) {
            return p(a).getTopLeft()
        };
        d.getMaxCenter = function (a) {
            return p(a).getBottomRight()
        };
        d.getMinZoom = function () {
            var a = c.getHomeZoom();
            if (i.minZoomDimension)var b = n.x <= n.y ? i.minZoomDimension / e.x : i.minZoomDimension / (e.x * o); else var b = i.minZoomImageRatio * a;
            return g.min(b, a)
        };
        d.getMaxZoom = function () {
            var a = n.x * i.maxZoomPixelRatio / e.x;
            return g.max(a, c.getHomeZoom())
        };
        d.getAspectRatio = function () {
            return e.x / e.y
        };
        d.getContainerSize = function () {
            return new m(e.x, e.y)
        };
        d.getBounds = function (b) {
            var d = c.getCenter(b), a = 1 / c.getZoom(b), e = a / c.getAspectRatio();
            return new y(d.x - a / 2, d.y - e / 2, a, e)
        };
        d.getCenter = function (r) {
            var b = new m(h.getCurrent(), j.getCurrent()), g = new m(h.getTarget(), j.getTarget());
            if (r)return b; else if (!f)return g;
            var l = c.getZoom(), d = 1 / l, k = d / c.getAspectRatio(), i = new y(b.x - d / 2, b.y - k / 2, d, k), q = c.pixelFromPoint(f, a), p = f.minus(i.getTopLeft()).times(e.x / i.width), n = p.minus(q), o = n.divide(e.x * l);
            return g.plus(o)
        };
        d.getZoom = function (b) {
            var a;
            if (b) {
                a = l.getCurrent();
                return i.logarithmicZoom ? w(a) : a
            } else {
                a = l.getTarget();
                return i.logarithmicZoom ? w(a) : a
            }
        };
        d.applyConstraints = function (g) {
            var h = c.getZoom(), d = r(h, c.getMinZoom(), c.getMaxZoom());
            h != d && c.zoomTo(d, f, g);
            var b = c.getCenter(), a = x(b, p());
            if (i.wrapHorizontal)a.x = b.x;
            if (i.wrapVertical)a.y = b.y;
            if (!b.equals(a)) {
                var e = 1 / d, j = e / c.getAspectRatio();
                c.fitBounds(new y(a.x - t * e, a.y - t * j, e, j), g)
            }
        };
        d.ensureVisible = function (a) {
            c.applyConstraints(a)
        };
        d.fitBounds = function (f, j) {
            var h = c.getAspectRatio(), i = f.getCenter(), d = new y(f.x, f.y, f.width, f.height);
            if (d.getAspectRatio() >= h) {
                d.height = f.width / h;
                d.y = i.y - d.height / 2
            } else {
                d.width = f.height * h;
                d.x = i.x - d.width / 2
            }
            c.panTo(c.getCenter(a), a);
            c.zoomTo(c.getZoom(a), b, a);
            var g = c.getBounds(), m = c.getZoom(), k = 1 / d.width;
            if (k == m || d.width == g.width) {
                c.panTo(i, j);
                return
            }
            var l = g.getTopLeft().times(e.x / g.width).minus(d.getTopLeft().times(e.x / d.width)).divide(e.x / g.width - e.x / d.width);
            c.zoomTo(k, l, j)
        };
        d.goHome = function (b) {
            var a = c.getCenter();
            if (i.wrapHorizontal) {
                a.x = (1 + a.x % 1) % 1;
                h.resetTo(a.x);
                h.update()
            }
            if (i.wrapVertical) {
                a.y = (o + a.y % o) % o;
                j.resetTo(a.y);
                j.update()
            }
            c.fitBounds(k, b)
        };
        d.panBy = function (b, a) {
            c.panTo(c.getCenter().plus(b), a)
        };
        d.panTo = function (b, q) {
            if (q) {
                h.resetTo(b.x);
                j.resetTo(b.y);
                return
            }
            if (!f) {
                h.springTo(b.x);
                j.springTo(b.y);
                return
            }
            var l = c.getZoom(), d = 1 / l, k = d / c.getAspectRatio(), i = new y(h.getCurrent() - d / 2, j.getCurrent() - k / 2, d, k), p = c.pixelFromPoint(f, a), o = f.minus(i.getTopLeft()).times(e.x / i.width), m = o.minus(p), n = m.divide(e.x * l), g = b.minus(n);
            h.springTo(g.x);
            j.springTo(g.y)
        };
        d.zoomBy = function (d, b, a) {
            c.zoomTo(c.getZoom() * d, b, a)
        };
        d.zoomTo = function (a, c, d) {
            if (d)l.resetTo(i.logarithmicZoom ? u(a) : a); else l.springTo(i.logarithmicZoom ? u(a) : a);
            f = c instanceof m ? c : b
        };
        d.resize = function (d, h) {
            var f = c.getBounds(), b = f, g = d.x / e.x;
            e = new m(d.x, d.y);
            if (h) {
                b.width = f.width * g;
                b.height = b.width / c.getAspectRatio()
            }
            c.fitBounds(b, a)
        };
        d.update = function () {
            var m = h.getCurrent(), n = j.getCurrent(), e = l.getCurrent();
            if (f)var k = c.pixelFromPoint(f, a);
            l.update();
            if (f && l.getCurrent() != e) {
                var i = c.pixelFromPoint(f, a), g = i.minus(k), d = c.deltaPointsFromPixels(g, a);
                h.shiftBy(d.x);
                j.shiftBy(d.y)
            } else f = b;
            h.update();
            j.update();
            return h.getCurrent() != m || j.getCurrent() != n || l.getCurrent() != e
        };
        d.deltaPixelsFromPoints = function (a, b) {
            return a.times(e.x * c.getZoom(b))
        };
        d.deltaPointsFromPixels = function (a, b) {
            return a.divide(e.x * c.getZoom(b))
        };
        d.pixelFromPoint = function (d, b) {
            var a = c.getBounds(b);
            return d.minus(a.getTopLeft()).times(e.x / a.width)
        };
        d.pointFromPixel = function (d, b) {
            var a = c.getBounds(b);
            return d.divide(e.x / a.width).plus(a.getTopLeft())
        };
        z()
    }, V, E;
    (function () {
        var n = "progid:DXImageTransform.Microsoft.Matrix(", j = " when it's not yet loaded.", h = "Attempting to draw tile ", W = 100, G = t, u = e.getBrowser(), P = e.getBrowserVersion(), bb = navigator.userAgent, R = !!r.createElement("canvas").getContext, T = r.documentElement || {}, H = T.style || {}, C = c, K = ["msTransform", "WebkitTransform", "MozTransform"], f, B;
        while (f = K.shift())if (typeof H[f] !== J) {
            C = a;
            B = /webkit/i.test(f);
            break
        }
        var X = "-webkit-transform", L = "WebkitTransition", Z = typeof H[L] !== J, O = "progid:DXImageTransform.Microsoft.Matrix", Y = new RegExp(O + "\\(.*?\\)", "g"), ab = function () {
            try {
                return u == A.IE && !!r.documentElement.filters
            } catch (a) {
                return c
            }
        }(), Q = u == A.SAFARI && P < 4 || u == A.CHROME, p = R && !Q, F = !p && C, I = c, M = typeof r.documentMode !== J ? "bicubic" : "nearest-neighbor";

        function o(f, h, i, d, e, g) {
            var a = this;
            a.level = f;
            a.x = h;
            a.y = i;
            a.bounds = d;
            a.exists = e;
            a.url = g;
            a.elmt = b;
            a.image = b;
            a.loaded = c;
            a.loading = c;
            a.style = b;
            a.position = b;
            a.size = b;
            a.blendStart = b;
            a.opacity = b;
            a.distance = b;
            a.visibility = b;
            a.beingDrawn = c;
            a.lastDrawnTime = 0;
            a.lastTouchTime = 0
        }

        o.prototype.toString = function () {
            return this.level + "/" + this.x + "_" + this.y
        };
        o.prototype.drawHTML = function (l) {
            var a = this;
            if (!a.loaded) {
                q.error(h + a.toString() + j);
                return
            }
            if (!a.elmt) {
                a.elmt = e.makeNeutralElement("img");
                a.elmt.src = a.url;
                a.style = a.elmt.style;
                a.style.position = w;
                a.style.msInterpolationMode = M;
                if (F)a.style[f + "Origin"] = "0px 0px"
            }
            var m = a.elmt, r = a.image, c = a.style, b = a.position, i = a.size;
            m.parentNode != l && l.appendChild(m);
            if (F)c[f] = ["matrix(", (i.x / r.width).toFixed(8), ",0,0,", (i.y / r.height).toFixed(8), z, b.x.toFixed(8), B ? z : "px,", b.y.toFixed(8), B ? ")" : "px)"].join(d); else if (I) {
                var p = l.clientWidth, o = l.clientHeight;
                c.width = p + k;
                c.height = o + k;
                c.filter = [n, "M11=", (i.x / p).toFixed(8), ",M22=", (i.y / o).toFixed(8), ",Dx=", b.x.toFixed(8), ",Dy=", b.y.toFixed(8), ")"].join(d)
            } else {
                b = b.apply(g.floor);
                i = i.apply(g.ceil);
                c.left = b.x + k;
                c.top = b.y + k;
                c.width = i.x + k;
                c.height = i.y + k
            }
            e.setElementOpacity(m, a.opacity)
        };
        o.prototype.drawCanvas = function (c) {
            var a = this;
            if (!a.loaded) {
                q.error(h + a.toString() + j);
                return
            }
            var b = a.position, d = a.size;
            c.globalAlpha = a.opacity;
            c.drawImage(a.image, b.x, b.y, d.x, d.y)
        };
        o.prototype.unload = function () {
            var a = this;
            a.elmt && a.elmt.parentNode && a.elmt.parentNode.removeChild(a.elmt);
            a.elmt = b;
            a.image = b;
            a.loaded = c;
            a.loading = c
        };
        E = v.OverlayPlacement = {CENTER: 0, TOP_LEFT: 1, TOP: 2, TOP_RIGHT: 3, RIGHT: 4, BOTTOM_RIGHT: 5, BOTTOM: 6, BOTTOM_LEFT: 7, LEFT: 8};
        function D(a) {
            switch (a) {
                case E.TOP_LEFT:
                    return function () {
                    };
                case E.TOP:
                    return function (a, b) {
                        a.x -= b.x / 2
                    };
                case E.TOP_RIGHT:
                    return function (a, b) {
                        a.x -= b.x
                    };
                case E.RIGHT:
                    return function (a, b) {
                        a.x -= b.x;
                        a.y -= b.y / 2
                    };
                case E.BOTTOM_RIGHT:
                    return function (a, b) {
                        a.x -= b.x;
                        a.y -= b.y
                    };
                case E.BOTTOM:
                    return function (a, b) {
                        a.x -= b.x / 2;
                        a.y -= b.y
                    };
                case E.BOTTOM_LEFT:
                    return function (a, b) {
                        a.y -= b.y
                    };
                case E.LEFT:
                    return function (a, b) {
                        a.y -= b.y / 2
                    };
                case E.CENTER:
                default:
                    return function (a, b) {
                        a.x -= b.x / 2;
                        a.y -= b.y / 2
                    }
            }
        }

        function x(c, a, d) {
            var b = this;
            b.elmt = c;
            b.scales = a instanceof y;
            b.bounds = new y(a.x, a.y, a.width, a.height);
            b.adjust = D(a instanceof m ? d : E.TOP_LEFT);
            b.position = new m(a.x, a.y);
            b.size = new m(a.width, a.height);
            b.style = c.style;
            b.naturalSize = new m(c.clientWidth, c.clientHeight)
        }

        x.prototype.destroy = function () {
            var b = this.elmt, a = this.style;
            b.parentNode && b.parentNode.removeChild(b);
            a.top = d;
            a.left = d;
            a.position = d;
            if (this.scales) {
                a.width = d;
                a.height = d
            }
        };
        x.prototype.drawHTML = function (m) {
            var h = this, c = h.elmt, a = h.style, o = h.scales, j = h.naturalSize;
            if (c.parentNode != m) {
                m.appendChild(c);
                a.position = w;
                j.x = c.clientWidth;
                j.y = c.clientHeight
            }
            var e = h.position, b = h.size;
            if (!o) {
                b.x = j.x = j.x || c.clientWidth;
                b.y = j.y = j.y || c.clientHeight
            }
            h.adjust(e, b);
            if (i.transformOverlays && C) {
                a[f + "Origin"] = "0px 0px";
                a[f] = ["translate(", e.x.toFixed(8), "px,", e.y.toFixed(8), "px)"].join(d);
                if (o) {
                    if (!c.clientWidth)a.width = l;
                    if (!c.clientHeight)a.height = l;
                    a[f] += [" scale(", (b.x / c.clientWidth).toFixed(8), z, (b.y / c.clientHeight).toFixed(8), ")"].join(d)
                }
            } else if (i.transformOverlays && I) {
                var q = m.clientWidth, p = m.clientHeight;
                a.width = q + k;
                a.height = p + k;
                a.filter = [n, "M11=", (b.x / q).toFixed(8), ",M22=", (b.y / p).toFixed(8), ",Dx=", e.x.toFixed(8), ",Dy=", e.y.toFixed(8), ")"].join(d)
            } else {
                e = e.apply(g.floor);
                b = b.apply(g.ceil);
                a.left = e.x + k;
                a.top = e.y + k;
                if (o) {
                    a.width = b.x + k;
                    a.height = b.y + k
                }
            }
        };
        x.prototype.update = function (a, b) {
            this.scales = a instanceof y;
            this.bounds = new y(a.x, a.y, a.width, a.height);
            this.adjust = D(a instanceof m ? b : E.TOP_LEFT)
        };
        V = v.Drawer = function (f, C, ib) {
            var h = this, B = e.getElement(ib), z = e.makeNeutralElement(p ? "canvas" : s), gb = p ? z.getContext("2d") : b, T = new S, J = new U, eb = f.minLevel, db = f.maxLevel, fb = f.tileSize, X = f.tileOverlap, H = f.height / f.width, F = {}, D = {}, r = {}, v = [], k = {}, n = [], bb = [], K = 0, L = 0, I = c, j = a;
            h.elmt = B;
            h.profiler = J;
            (function () {
                z.style.width = l;
                z.style.height = l;
                z.style.position = w;
                B.style.textAlign = "left";
                B.appendChild(z)
            })();
            function R(a) {
                if (!F[a])F[a] = f.getNumTiles(a);
                return F[a]
            }

            function M(a) {
                if (!D[a])D[a] = f.getPixelRatio(a);
                return D[a]
            }

            function hb(a, b, c, l, d, e) {
                if (!r[a])r[a] = {};
                if (!r[a][b])r[a][b] = {};
                if (!r[a][b][c]) {
                    var g = (d + b % d) % d, h = (e + c % e) % e, i = f.getTileBounds(a, g, h), k = f.tileExists(a, g, h), m = f.getTileUrl(a, g, h);
                    i.x += 1 * (b - g) / d;
                    i.y += H * (c - h) / e;
                    r[a][b][c] = new o(a, b, c, i, k, m)
                }
                var j = r[a][b][c];
                j.lastTouchTime = l;
                return j
            }

            function cb(a, c) {
                a.loading = T.loadImage(a.url, e.createCallback(b, Z, a, c))
            }

            function Z(d, s, n) {
                d.loading = c;
                if (I) {
                    q.error("Tile load callback in middle of drawing routine.");
                    return
                } else if (!n) {
                    q.log("Tile " + d + " failed to load: " + d.url);
                    d.exists = c;
                    return
                } else if (s < L) {
                    q.log("Ignoring tile " + d + " loaded before reset: " + d.url);
                    return
                }
                d.loaded = a;
                d.image = n;
                var k = v.length;
                if (v.length >= W) {
                    for (var r = g.ceil(g.log(fb) / g.log(2)), e = b, i = -1, h = v.length - 1; h >= 0; h--) {
                        var f = v[h];
                        if (f.level <= r || f.beingDrawn)continue; else if (!e) {
                            e = f;
                            i = h;
                            continue
                        }
                        var m = f.lastTouchTime, l = e.lastTouchTime, p = f.level, o = e.level;
                        if (m < l || m == l && p > o) {
                            e = f;
                            i = h
                        }
                    }
                    if (e && i >= 0) {
                        e.unload();
                        k = i
                    }
                }
                v[k] = d;
                j = a
            }

            function Y() {
                r = {};
                v = []
            }

            function y(b, d, g) {
                if (!k[b])return c;
                if (d === N || g === N) {
                    var f = k[b];
                    for (var h in f)if (f.hasOwnProperty(h)) {
                        var e = f[h];
                        for (var i in e)if (e.hasOwnProperty(i) && !e[i])return c
                    }
                    return a
                }
                return k[b][d] === N || k[b][d][g] === N || k[b][d][g] === a
            }

            function ab(a, b, c) {
                if (b === N || c === N)return y(a + 1); else return y(a + 1, 2 * b, 2 * c) && y(a + 1, 2 * b, 2 * c + 1) && y(a + 1, 2 * b + 1, 2 * c) && y(a + 1, 2 * b + 1, 2 * c + 1)
            }

            function V(a, b, d, c) {
                if (!k[a]) {
                    q.error("Setting coverage for a tile before its level's coverage has been reset: " + a);
                    return
                }
                if (!k[a][b])k[a][b] = {};
                k[a][b][d] = c
            }

            function O(a) {
                k[a] = {}
            }

            function P(b, a) {
                if (!b)return a;
                if (a.visibility > b.visibility)return a; else if (a.visibility == b.visibility)if (a.distance < b.distance)return a;
                return b
            }

            function E(b) {
                for (var a = n.length - 1; a >= 0; a--)if (n[a].elmt == b)return a;
                return -1
            }

            function Q() {
                j = c;
                var Q = z, Fb = gb, gc = B, xb = p, D = bb;
                while (D.length > 0) {
                    var e = D.pop();
                    e.beingDrawn = c
                }
                var ub = C.getContainerSize(), sb = ub.x, rb = ub.y;
                if (xb) {
                    Q.width = sb;
                    Q.height = rb;
                    Fb.clearRect(0, 0, sb, rb)
                } else Q.innerHTML = d;
                var qb = C.getBounds(a), s = qb.getTopLeft(), r = qb.getBottomRight();
                if (!i.wrapHorizontal && (r.x < 0 || s.x > 1))return; else if (!i.wrapVertical && (r.y < 0 || s.y > H))return;
                var Rb = R, F = M, cc = hb, Yb = ab, I = V, Ob = O, Kb = y, Sb = X, Nb = K, bc = u === A.CHROME, ec = g.abs, hc = g.ceil, jb = g.floor, T = g.log, lb = g.max, k = g.min, q = C.deltaPixelsFromPoints, E = C.pixelFromPoint, pb = f.getTileAtPoint, Tb = i.alwaysBlend, U = 1e3 * i.blendTime, Lb = i.immediateRender, Y = i.minZoomDimension, fc = i.minImageRatio, W = i.wrapHorizontal, Z = i.wrapVertical, vb = i.wrapOverlays;
                if (!W) {
                    s.x = lb(s.x, 0);
                    r.x = k(r.x, 1)
                }
                if (!Z) {
                    s.y = lb(s.y, 0);
                    r.y = k(r.y, H)
                }
                var S = b, L = c, v = (new Date).getTime(), mb = C.getCenter(), Ib = E(mb), Xb = q(F(0), c).x, nb = Lb ? 1 : Xb;
                Y = Y || 64;
                var J = lb(eb, jb(T(Y) / T(2))), Wb = q(F(0), a).x, tb = k(db, jb(T(Wb / G) / T(2)));
                J = k(J, tb);
                for (var h = tb; h >= J; h--) {
                    var zb = c, ob = q(F(h), a).x;
                    if (!L && ob >= G || h == J) {
                        zb = a;
                        L = a
                    } else if (!L)continue;
                    Ob(h);
                    var Pb = k(1, (ob - t) / t), Jb = q(F(h), c).x, Mb = nb / ec(nb - Jb), Hb = pb(h, s), w = pb(h, r), Eb = Rb(h), Ab = Eb.x, Bb = Eb.y;
                    if (!W)w.x = k(w.x, Ab - 1);
                    if (!Z)w.y = k(w.y, Bb - 1);
                    for (var l = Hb.x; l <= w.x; l++)for (var o = Hb.y; o <= w.y; o++) {
                        var e = cc(h, l, o, v, Ab, Bb), fb = zb;
                        I(h, l, o, c);
                        if (!e.exists)continue;
                        if (L && !fb)if (Yb(h, l, o))I(h, l, o, a); else fb = a;
                        if (!fb)continue;
                        var Db = e.bounds.getTopLeft(), wb = e.bounds.getSize(), Zb = E(Db, a), kb = q(wb, a);
                        if (!Sb)kb = kb.plus(new m(1, 1));
                        var ac = E(Db, c), dc = q(wb, c), Vb = ac.plus(dc.divide(2)), Qb = Ib.distanceTo(Vb);
                        e.position = Zb;
                        e.size = kb;
                        e.distance = Qb;
                        e.visibility = Mb;
                        if (e.loaded) {
                            if (!e.blendStart)e.blendStart = v;
                            var yb = v - e.blendStart, ib = U === 0 ? 1 : k(1, yb / U);
                            if (Tb)ib *= Pb;
                            e.opacity = ib;
                            D.push(e);
                            if (ib >= 1) {
                                I(h, l, o, a);
                                bc && e.lastDrawnTime !== Nb && I(h, l, o, c)
                            } else if (yb < U)j = a;
                            e.lastDrawnTime = v
                        } else if (!e.loading)S = P(S, e)
                    }
                    if (Kb(h))break
                }
                for (var x = D.length - 1; x >= 0; x--) {
                    var e = D[x];
                    if (xb)e.drawCanvas(Fb); else e.drawHTML(Q);
                    e.beingDrawn = a
                }
                for (var Ub = n.length, x = 0; x < Ub; x++) {
                    var N = n[x], Gb = N.bounds, Cb = Gb.getTopLeft();
                    if (vb && W)Cb.x += jb(mb.x);
                    if (vb && Z);
                    N.position = E(Cb, a);
                    N.size = q(Gb.getSize(), a);
                    N.drawHTML(B)
                }
                if (S) {
                    cb(S, v);
                    j = a
                }
                K = v
            }

            h.addOverlay = function (b, d, c) {
                var b = e.getElement(b);
                if (E(b) >= 0)return;
                n.push(new x(b, d, c));
                j = a
            };
            h.updateOverlay = function (b, f, d) {
                var b = e.getElement(b), c = E(b);
                if (c >= 0) {
                    n[c].update(f, d);
                    j = a
                }
            };
            h.removeOverlay = function (c) {
                var c = e.getElement(c), b = E(c);
                if (b >= 0) {
                    n[b].destroy();
                    n.splice(b, 1);
                    j = a
                }
            };
            h.clearOverlays = function () {
                while (n.length > 0) {
                    n.pop().destroy();
                    j = a
                }
            };
            h.needsUpdate = function () {
                return j
            };
            h.numTilesLoaded = function () {
                return v.length
            };
            h.reset = function () {
                Y();
                L = (new Date).getTime();
                j = a
            };
            h.update = function () {
                J.beginUpdate();
                I = a;
                Q();
                I = c;
                J.endUpdate()
            };
            h.idle = function () {
            }
        }
    })();
    var Y, G;
    (function () {
        var L = "----seadragon----", Q = e.getBrowser();
        G = v.ControlAnchor = {NONE: 0, TOP_LEFT: 1, TOP_RIGHT: 2, BOTTOM_RIGHT: 3, BOTTOM_LEFT: 4};
        function P(c, b, a) {
            if (b == G.TOP_RIGHT || b == G.BOTTOM_RIGHT)a.insertBefore(c, a.firstChild); else a.appendChild(c)
        }

        function f(f, c, d) {
            var b = this, a = e.makeNeutralElement(F);
            b.elmt = f;
            b.anchor = c;
            b.container = d;
            b.wrapper = a;
            a.style.display = C;
            a.appendChild(f);
            if (c == G.NONE)a.style.width = a.style.height = l;
            P(a, c, d)
        }

        f.prototype.destroy = function () {
            var a = this;
            a.wrapper.removeChild(a.elmt);
            a.container.removeChild(a.wrapper)
        };
        f.prototype.isVisible = function () {
            return this.wrapper.style.display != B
        };
        f.prototype.setVisible = function (a) {
            this.wrapper.style.display = a ? C : B
        };
        f.prototype.setOpacity = function (b) {
            if (this.elmt[L] && Q == A.IE)e.setElementOpacity(this.elmt, b, a); else e.setElementOpacity(this.wrapper, b, a)
        };
        var k = "fullpage", E = "home", t = "zoomin", n = "zoomout", J = "_rest.png", y = "_grouphover.png", z = "_hover.png", D = "_pressed.png";

        function N(d) {
            var j = b, f = c, q = b, l = b;

            function H() {
                d.viewport && d.viewport.goHome()
            }

            function w() {
                d.setFullPage(!d.isFullPage());
                j.emulateExit();
                d.viewport && d.viewport.applyConstraints()
            }

            function s() {
                l = (new Date).getTime();
                q = i.zoomPerSecond;
                f = a;
                o()
            }

            function r() {
                l = (new Date).getTime();
                q = 1 / i.zoomPerSecond;
                f = a;
                o()
            }

            function m() {
                f = c
            }

            function o() {
                h.setTimeout(F, p)
            }

            function F() {
                if (f && d.viewport) {
                    var a = (new Date).getTime(), c = a - l, b = g.pow(q, c / 1e3);
                    d.viewport.zoomBy(b);
                    d.viewport.applyConstraints();
                    l = a;
                    o()
                }
            }

            function v() {
                if (d.viewport) {
                    f = c;
                    d.viewport.zoomBy(i.zoomPerClick / 1);
                    d.viewport.applyConstraints()
                }
            }

            function u() {
                if (d.viewport) {
                    f = c;
                    d.viewport.zoomBy(1 / i.zoomPerClick);
                    d.viewport.applyConstraints()
                }
            }

            function B() {
                j.emulateEnter();
                j.emulateExit()
            }

            function e(b, a) {
                return i.imagePath + b + a
            }

            var I = new O(x.getString("Tooltips.ZoomIn"), e(t, J), e(t, y), e(t, z), e(t, D), s, m, v, s, m), C = new O(x.getString("Tooltips.ZoomOut"), e(n, J), e(n, y), e(n, z), e(n, D), r, m, u, r, m), G = new O(x.getString("Tooltips.Home"), e(E, J), e(E, y), e(E, z), e(E, D), b, H, b, b, b), A = new O(x.getString("Tooltips.FullPage"), e(k, J), e(k, y), e(k, z), e(k, D), b, w, b, b, b);
            j = new R([I, C, G, A]);
            j.elmt[L] = a;
            d.addEventListener("open", B);
            return j.elmt
        }

        Y = v.Viewer = function (v) {
            var n = this, t = n, P = e.getElement(v), v = e.makeNeutralElement(s), E = e.makeNeutralElement(s), eb = e.makeNeutralElement(s), fb = e.makeNeutralElement(s), db = e.makeNeutralElement(s), cb = e.makeNeutralElement(s), A = b, J = b, k = b, O = b, z = new W, D = new M(E), S = new M(v), y = [], ab = a, ib = b, L = b, kb = 1e3, Ab = 2e3, ib = b, ab = c, yb = r.body.style.width, wb = r.body.style.height, tb = r.body.style.overflow, ub = r.documentElement.style.overflow, bb = new m(1, 1), C = b, R = 0, nb = 0, qb = b, ob = b, F = c, T = c, Y = c;
            n.container = P;
            n.elmt = v;
            n.source = b;
            n.drawer = b;
            n.viewport = b;
            n.profiler = b;
            n.tracker = D;
            function Jb() {
                var c = E.style, b = v.style, g = eb.style, i = fb.style, f = db.style, e = cb.style;
                b.width = l;
                b.height = l;
                b.position = u;
                b.left = j;
                b.top = j;
                b.textAlign = "left";
                c.width = l;
                c.height = l;
                c.overflow = o;
                c.position = w;
                c.top = j;
                c.left = j;
                g.position = i.position = f.position = e.position = w;
                g.top = i.top = j;
                g.left = e.left = j;
                i.right = f.right = j;
                e.bottom = f.bottom = j;
                D.clickHandler = Fb;
                D.pressHandler = Gb;
                D.dragHandler = Hb;
                D.releaseHandler = Db;
                D.scrollHandler = Eb;
                D.setTracking(a);
                L = N(t);
                L.style.marginRight = "4px";
                L.style.marginBottom = "4px";
                t.addControl(L, G.BOTTOM_RIGHT);
                S.enterHandler = lb;
                S.exitHandler = pb;
                S.releaseHandler = Bb;
                S.setTracking(a);
                h.setTimeout(Q, 1);
                v.appendChild(E);
                v.appendChild(eb);
                v.appendChild(fb);
                v.appendChild(db);
                v.appendChild(cb);
                P.innerHTML = d;
                P.appendChild(v)
            }

            function Z(f) {
                var a = "normal", c = r.createTextNode(f);
                E.innerHTML = d;
                E.appendChild(e.makeCenteredNode(c));
                var b = c.parentNode.style;
                b.fontFamily = "verdana";
                b.fontSize = "13px";
                b.fontSizeAdjust = B;
                b.fontStyle = a;
                b.fontStretch = a;
                b.fontVariant = a;
                b.fontWeight = a;
                b.lineHeight = "1em";
                b.textAlign = "center";
                b.textDecoration = B
            }

            function vb() {
                A && zb();
                R = (new Date).getTime();
                h.setTimeout(function () {
                    R > nb && Z(x.getString("Messages.Loading"))
                }, 2e3);
                return R
            }

            function gb(g, b, f) {
                nb = (new Date).getTime();
                if (g < R) {
                    q.log("Ignoring out-of-date open.");
                    z.trigger("ignore", t);
                    return
                } else if (!b) {
                    Z(f);
                    z.trigger("error", t);
                    return
                }
                E.innerHTML = d;
                C = e.getElementSize(v);
                if (C.x === 0 || C.y === 0) {
                    h.setTimeout(function () {
                        gb(g, b, f)
                    }, p);
                    return
                }
                A = b;
                k = new X(C, A.dimensions);
                J = new V(A, k, E);
                O = new U;
                t.source = A;
                t.viewport = k;
                t.drawer = J;
                t.profiler = O;
                F = c;
                T = a;
                rb(Ib);
                z.trigger("open", t)
            }

            function zb() {
                t.source = A = b;
                t.viewport = k = b;
                t.drawer = J = b;
                t.profiler = O = b;
                E.innerHTML = d
            }

            function rb(c, a) {
                if (F)return h.setTimeout(c, 1);
                var b = (new Date).getTime(), a = a ? a : b, d = a + 1e3 / 60, e = g.max(1, d - b);
                return h.setTimeout(c, e)
            }

            function xb() {
                if (!A)return;
                O.beginUpdate();
                var b = e.getElementSize(v);
                if (!b.equals(C) && b.x > 0 && b.y > 0) {
                    k.resize(b, a);
                    C = b;
                    z.trigger("resize", t)
                }
                var d = k.update();
                if (!F && d) {
                    z.trigger("animationstart", t);
                    hb()
                }
                if (d) {
                    J.update();
                    z.trigger("animation", t)
                } else if (T || J.needsUpdate()) {
                    J.update();
                    T = c
                } else J.idle();
                if (F && !d) {
                    z.trigger("animationfinish", t);
                    !Y && Q()
                }
                F = d;
                O.endUpdate()
            }

            function Ib() {
                if (!A)return;
                var a = (new Date).getTime();
                xb();
                rb(arguments.callee, a)
            }

            function mb(b) {
                for (var a = y.length - 1; a >= 0; a--)if (y[a].elmt == b)return a;
                return -1
            }

            function jb() {
                h.setTimeout(Cb, 20)
            }

            function Cb() {
                if (ab) {
                    var c = (new Date).getTime(), d = c - ib, a = 1 - d / Ab;
                    a = g.min(1, a);
                    a = g.max(0, a);
                    for (var b = y.length - 1; b >= 0; b--)y[b].setOpacity(a);
                    a > 0 && jb()
                }
            }

            function hb() {
                ab = c;
                for (var a = y.length - 1; a >= 0; a--)y[a].setOpacity(1)
            }

            function Q() {
                if (!i.autoHideControls)return;
                ab = a;
                ib = (new Date).getTime() + kb;
                h.setTimeout(jb, kb)
            }

            function lb() {
                Y = a;
                hb()
            }

            function pb(e, d, a) {
                if (!a) {
                    Y = c;
                    !F && Q()
                }
            }

            function Bb(e, d, b, a) {
                if (!a) {
                    Y = c;
                    !F && Q()
                }
            }

            function Fb(g, c, e, f) {
                if (k && e) {
                    var b = i.zoomPerClick, d = f ? 1 / b : b;
                    k.zoomBy(d, k.pointFromPixel(c, a));
                    k.applyConstraints()
                }
            }

            function Gb(b, a) {
                if (k) {
                    qb = a;
                    ob = k.getCenter()
                }
            }

            function Hb(f, d, e) {
                if (k)if (i.constrainDuringPan) {
                    var b = d.minus(qb), c = k.deltaPointsFromPixels(b.negate(), a);
                    k.panTo(ob.plus(c));
                    k.applyConstraints()
                } else k.panBy(k.deltaPointsFromPixels(e.negate(), a))
            }

            function Db(d, c, a) {
                a && k && k.applyConstraints()
            }

            function Eb(e, b, d) {
                if (k) {
                    var c = g.pow(i.zoomPerScroll, d);
                    k.zoomBy(c, k.pointFromPixel(b, a));
                    k.applyConstraints()
                }
            }

            function sb(a) {
                a = e.getEvent(a);
                a.keyCode === 27 && t.setFullPage(c)
            }

            n.isOpen = function () {
                return !!A
            };
            n.openDzi = function (a, f) {
                var d = vb(), c = e.createCallback(b, gb, d);
                switch (typeof a) {
                    case I:
                        K.createFromXml(a, f, c);
                        break;
                    default:
                        K.createFromJson(a, c)
                }
            };
            n.openTileSource = function (b) {
                var a = vb();
                h.setTimeout(function () {
                    gb(a, b)
                }, 1)
            };
            n.close = function () {
                if (!A)return;
                zb()
            };
            n.addControl = function (a, d) {
                var a = e.getElement(a);
                if (mb(a) >= 0)return;
                var c = b;
                switch (d) {
                    case G.TOP_RIGHT:
                        c = fb;
                        a.style.position = u;
                        break;
                    case G.BOTTOM_RIGHT:
                        c = db;
                        a.style.position = u;
                        break;
                    case G.BOTTOM_LEFT:
                        c = cb;
                        a.style.position = u;
                        break;
                    case G.TOP_LEFT:
                        c = eb;
                        a.style.position = u;
                        break;
                    case G.NONE:
                    default:
                        c = v;
                        a.style.position = w
                }
                y.push(new f(a, d, c))
            };
            n.removeControl = function (b) {
                var b = e.getElement(b), a = mb(b);
                if (a >= 0) {
                    y[a].destroy();
                    y.splice(a, 1)
                }
            };
            n.clearControls = function () {
                while (y.length > 0)y.pop().destroy()
            };
            n.getNavControl = function () {
                return L
            };
            n.isDashboardEnabled = function () {
                for (var b = y.length - 1; b >= 0; b--)if (y[b].isVisible())return a;
                return c
            };
            n.isFullPage = function () {
                return v.parentNode == r.body
            };
            n.isMouseNavEnabled = function () {
                return D.isTracking()
            };
            n.isVisible = function () {
                return v.style.visibility != o
            };
            n.setDashboardEnabled = function (b) {
                for (var a = y.length - 1; a >= 0; a--)y[a].setVisible(b)
            };
            n.setFullPage = function (j) {
                if (j == t.isFullPage())return;
                var q = r.body, c = q.style, i = r.documentElement.style, f = v.style, h = E.style;
                if (j) {
                    tb = c.overflow;
                    ub = i.overflow;
                    c.overflow = o;
                    i.overflow = o;
                    yb = c.width;
                    wb = c.height;
                    c.width = l;
                    c.height = l;
                    h.backgroundColor = "white";
                    h.color = "white";
                    f.position = H;
                    f.zIndex = "99999999";
                    q.appendChild(v);
                    C = e.getWindowSize();
                    e.addEvent(r, "keydown", sb);
                    lb()
                } else {
                    c.overflow = tb;
                    i.overflow = ub;
                    c.width = yb;
                    c.height = wb;
                    h.backgroundColor = d;
                    h.color = d;
                    f.position = u;
                    f.zIndex = d;
                    P.appendChild(v);
                    C = e.getElementSize(P);
                    e.removeEvent(r, "keydown", sb);
                    pb()
                }
                if (k) {
                    var p = k.getBounds();
                    k.resize(C);
                    var n = k.getBounds();
                    if (j)bb = new m(n.width / p.width, n.height / p.height); else {
                        k.update();
                        k.zoomBy(g.max(bb.x, bb.y), b, a)
                    }
                    T = a;
                    z.trigger("resize", t);
                    xb()
                }
            };
            n.setMouseNavEnabled = function (a) {
                D.setTracking(a)
            };
            n.setVisible = function (a) {
                v.style.visibility = a ? d : o
            };
            n.showMessage = function (a, b) {
                if (!b) {
                    Z(a);
                    return
                }
                h.setTimeout(function () {
                    !t.isOpen() && Z(a)
                }, b)
            };
            n.addEventListener = function (a, b) {
                z.addListener(a, b)
            };
            n.removeEventListener = function (a, b) {
                z.removeListener(a, b)
            };
            Jb()
        }
    })()
})(window, document, Math);// Knockout JavaScript library v2.3.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function () {
    function F(q) {
        return function () {
            return q
        }
    };
    (function (q) {
        var w = this || (0, eval)("this"), s = w.document, H = w.navigator, t = w.jQuery, y = w.JSON;
        (function (q) {
            "function" === typeof require && "object" === typeof exports && "object" === typeof module ? q(module.exports || exports) : "function" === typeof define && define.amd ? define(["exports"], q) : q(w.ko = {})
        })(function (C) {
            function G(b, c, d, f) {
                a.d[b] = {init: function (b) {
                    a.a.f.set(b, I, {});
                    return{controlsDescendantBindings: !0}
                }, update: function (b, e, m, h, k) {
                    m = a.a.f.get(b, I);
                    e = a.a.c(e());
                    h = !d !== !e;
                    var l = !m.fb;
                    if (l || c || h !== m.vb)l && (m.fb =
                        a.a.Oa(a.e.childNodes(b), !0)), h ? (l || a.e.P(b, a.a.Oa(m.fb)), a.Ja(f ? f(k, e) : k, b)) : a.e.ba(b), m.vb = h
                }};
                a.g.S[b] = !1;
                a.e.L[b] = !0
            }

            function J(b, c, d) {
                d && c !== a.h.n(b) && a.h.W(b, c);
                c !== a.h.n(b) && a.q.I(a.a.Ga, null, [b, "change"])
            }

            var a = "undefined" !== typeof C ? C : {};
            a.b = function (b, c) {
                for (var d = b.split("."), f = a, g = 0; g < d.length - 1; g++)f = f[d[g]];
                f[d[d.length - 1]] = c
            };
            a.r = function (a, c, d) {
                a[c] = d
            };
            a.version = "2.3.0";
            a.b("version", a.version);
            a.a = function () {
                function b(a, b) {
                    for (var e in a)a.hasOwnProperty(e) && b(e, a[e])
                }

                function c(b, e) {
                    if ("input" !== a.a.u(b) || !b.type || "click" != e.toLowerCase())return!1;
                    var k = b.type;
                    return"checkbox" == k || "radio" == k
                }

                var d = {}, f = {};
                d[H && /Firefox\/2/i.test(H.userAgent) ? "KeyboardEvent" : "UIEvents"] = ["keyup", "keydown", "keypress"];
                d.MouseEvents = "click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");
                b(d, function (a, b) {
                    if (b.length)for (var e = 0, c = b.length; e < c; e++)f[b[e]] = a
                });
                var g = {propertychange: !0}, e = s && function () {
                    for (var a = 3, b = s.createElement("div"), e = b.getElementsByTagName("i"); b.innerHTML =
                        "\x3c!--[if gt IE " + ++a + "]><i></i><![endif]--\x3e", e[0];);
                    return 4 < a ? a : q
                }();
                return{Ta: ["authenticity_token", /^__RequestVerificationToken(_.*)?$/], p: function (a, b) {
                    for (var e = 0, c = a.length; e < c; e++)b(a[e])
                }, k: function (a, b) {
                    if ("function" == typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a, b);
                    for (var e = 0, c = a.length; e < c; e++)if (a[e] === b)return e;
                    return-1
                }, La: function (a, b, e) {
                    for (var c = 0, d = a.length; c < d; c++)if (b.call(e, a[c]))return a[c];
                    return null
                }, ka: function (b, e) {
                    var c = a.a.k(b, e);
                    0 <= c &&
                    b.splice(c, 1)
                }, Ma: function (b) {
                    b = b || [];
                    for (var e = [], c = 0, d = b.length; c < d; c++)0 > a.a.k(e, b[c]) && e.push(b[c]);
                    return e
                }, Z: function (a, b) {
                    a = a || [];
                    for (var e = [], c = 0, d = a.length; c < d; c++)e.push(b(a[c]));
                    return e
                }, Y: function (a, b) {
                    a = a || [];
                    for (var e = [], c = 0, d = a.length; c < d; c++)b(a[c]) && e.push(a[c]);
                    return e
                }, R: function (a, b) {
                    if (b instanceof Array)a.push.apply(a, b); else for (var e = 0, c = b.length; e < c; e++)a.push(b[e]);
                    return a
                }, ja: function (b, e, c) {
                    var d = b.indexOf ? b.indexOf(e) : a.a.k(b, e);
                    0 > d ? c && b.push(e) : c || b.splice(d, 1)
                },
                    extend: function (a, b) {
                        if (b)for (var e in b)b.hasOwnProperty(e) && (a[e] = b[e]);
                        return a
                    }, w: b, oa: function (b) {
                        for (; b.firstChild;)a.removeNode(b.firstChild)
                    }, Mb: function (b) {
                        b = a.a.N(b);
                        for (var e = s.createElement("div"), c = 0, d = b.length; c < d; c++)e.appendChild(a.H(b[c]));
                        return e
                    }, Oa: function (b, e) {
                        for (var c = 0, d = b.length, g = []; c < d; c++) {
                            var f = b[c].cloneNode(!0);
                            g.push(e ? a.H(f) : f)
                        }
                        return g
                    }, P: function (b, e) {
                        a.a.oa(b);
                        if (e)for (var c = 0, d = e.length; c < d; c++)b.appendChild(e[c])
                    }, eb: function (b, e) {
                        var c = b.nodeType ? [b] : b;
                        if (0 <
                            c.length) {
                            for (var d = c[0], g = d.parentNode, f = 0, r = e.length; f < r; f++)g.insertBefore(e[f], d);
                            f = 0;
                            for (r = c.length; f < r; f++)a.removeNode(c[f])
                        }
                    }, hb: function (a, b) {
                        7 > e ? a.setAttribute("selected", b) : a.selected = b
                    }, F: function (a) {
                        return null === a || a === q ? "" : a.trim ? a.trim() : a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
                    }, Wb: function (b, e) {
                        for (var c = [], d = (b || "").split(e), g = 0, f = d.length; g < f; g++) {
                            var r = a.a.F(d[g]);
                            "" !== r && c.push(r)
                        }
                        return c
                    }, Tb: function (a, b) {
                        a = a || "";
                        return b.length > a.length ? !1 : a.substring(0, b.length) ===
                            b
                    }, yb: function (a, b) {
                        if (b.compareDocumentPosition)return 16 == (b.compareDocumentPosition(a) & 16);
                        for (; null != a;) {
                            if (a == b)return!0;
                            a = a.parentNode
                        }
                        return!1
                    }, aa: function (b) {
                        return a.a.yb(b, b.ownerDocument)
                    }, pb: function (b) {
                        return!!a.a.La(b, a.a.aa)
                    }, u: function (a) {
                        return a && a.tagName && a.tagName.toLowerCase()
                    }, o: function (b, d, k) {
                        var f = e && g[d];
                        if (f || "undefined" == typeof t)if (f || "function" != typeof b.addEventListener)if ("undefined" != typeof b.attachEvent) {
                            var n = function (a) {
                                k.call(b, a)
                            }, p = "on" + d;
                            b.attachEvent(p, n);
                            a.a.C.ia(b, function () {
                                b.detachEvent(p, n)
                            })
                        } else throw Error("Browser doesn't support addEventListener or attachEvent"); else b.addEventListener(d, k, !1); else {
                            if (c(b, d)) {
                                var r = k;
                                k = function (a, b) {
                                    var e = this.checked;
                                    b && (this.checked = !0 !== b.sb);
                                    r.call(this, a);
                                    this.checked = e
                                }
                            }
                            t(b).bind(d, k)
                        }
                    }, Ga: function (a, b) {
                        if (!a || !a.nodeType)throw Error("element must be a DOM node when calling triggerEvent");
                        if ("undefined" != typeof t) {
                            var e = [];
                            c(a, b) && e.push({sb: a.checked});
                            t(a).trigger(b, e)
                        } else if ("function" == typeof s.createEvent)if ("function" == typeof a.dispatchEvent)e = s.createEvent(f[b] || "HTMLEvents"), e.initEvent(b, !0, !0, w, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, a), a.dispatchEvent(e); else throw Error("The supplied element doesn't support dispatchEvent"); else if ("undefined" != typeof a.fireEvent)c(a, b) && (a.checked = !0 !== a.checked), a.fireEvent("on" + b); else throw Error("Browser doesn't support triggering events");
                    }, c: function (b) {
                        return a.T(b) ? b() : b
                    }, ya: function (b) {
                        return a.T(b) ? b.t() : b
                    }, ga: function (b, e, c) {
                        if (e) {
                            var d = /\S+/g, g = b.className.match(d) || [];
                            a.a.p(e.match(d),
                                function (b) {
                                    a.a.ja(g, b, c)
                                });
                            b.className = g.join(" ")
                        }
                    }, ib: function (b, e) {
                        var c = a.a.c(e);
                        if (null === c || c === q)c = "";
                        var d = a.e.firstChild(b);
                        !d || 3 != d.nodeType || a.e.nextSibling(d) ? a.e.P(b, [s.createTextNode(c)]) : d.data = c;
                        a.a.Bb(b)
                    }, gb: function (a, b) {
                        a.name = b;
                        if (7 >= e)try {
                            a.mergeAttributes(s.createElement("<input name='" + a.name + "'/>"), !1)
                        } catch (c) {
                        }
                    }, Bb: function (a) {
                        9 <= e && (a = 1 == a.nodeType ? a : a.parentNode, a.style && (a.style.zoom = a.style.zoom))
                    }, zb: function (a) {
                        if (e) {
                            var b = a.style.width;
                            a.style.width = 0;
                            a.style.width =
                                b
                        }
                    }, Qb: function (b, e) {
                        b = a.a.c(b);
                        e = a.a.c(e);
                        for (var c = [], d = b; d <= e; d++)c.push(d);
                        return c
                    }, N: function (a) {
                        for (var b = [], e = 0, c = a.length; e < c; e++)b.push(a[e]);
                        return b
                    }, Ub: 6 === e, Vb: 7 === e, ca: e, Ua: function (b, e) {
                        for (var c = a.a.N(b.getElementsByTagName("input")).concat(a.a.N(b.getElementsByTagName("textarea"))), d = "string" == typeof e ? function (a) {
                            return a.name === e
                        } : function (a) {
                            return e.test(a.name)
                        }, g = [], f = c.length - 1; 0 <= f; f--)d(c[f]) && g.push(c[f]);
                        return g
                    }, Nb: function (b) {
                        return"string" == typeof b && (b = a.a.F(b)) ?
                            y && y.parse ? y.parse(b) : (new Function("return " + b))() : null
                    }, Ca: function (b, e, c) {
                        if (!y || !y.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
                        return y.stringify(a.a.c(b), e, c)
                    }, Ob: function (e, c, d) {
                        d = d || {};
                        var g = d.params || {}, f = d.includeFields || this.Ta, p = e;
                        if ("object" == typeof e && "form" === a.a.u(e))for (var p = e.action, r = f.length - 1; 0 <= r; r--)for (var z =
                            a.a.Ua(e, f[r]), D = z.length - 1; 0 <= D; D--)g[z[D].name] = z[D].value;
                        c = a.a.c(c);
                        var q = s.createElement("form");
                        q.style.display = "none";
                        q.action = p;
                        q.method = "post";
                        for (var v in c)e = s.createElement("input"), e.name = v, e.value = a.a.Ca(a.a.c(c[v])), q.appendChild(e);
                        b(g, function (a, b) {
                            var e = s.createElement("input");
                            e.name = a;
                            e.value = b;
                            q.appendChild(e)
                        });
                        s.body.appendChild(q);
                        d.submitter ? d.submitter(q) : q.submit();
                        setTimeout(function () {
                            q.parentNode.removeChild(q)
                        }, 0)
                    }}
            }();
            a.b("utils", a.a);
            a.b("utils.arrayForEach", a.a.p);
            a.b("utils.arrayFirst", a.a.La);
            a.b("utils.arrayFilter", a.a.Y);
            a.b("utils.arrayGetDistinctValues", a.a.Ma);
            a.b("utils.arrayIndexOf", a.a.k);
            a.b("utils.arrayMap", a.a.Z);
            a.b("utils.arrayPushAll", a.a.R);
            a.b("utils.arrayRemoveItem", a.a.ka);
            a.b("utils.extend", a.a.extend);
            a.b("utils.fieldsIncludedWithJsonPost", a.a.Ta);
            a.b("utils.getFormFields", a.a.Ua);
            a.b("utils.peekObservable", a.a.ya);
            a.b("utils.postJson", a.a.Ob);
            a.b("utils.parseJson", a.a.Nb);
            a.b("utils.registerEventHandler", a.a.o);
            a.b("utils.stringifyJson",
                a.a.Ca);
            a.b("utils.range", a.a.Qb);
            a.b("utils.toggleDomNodeCssClass", a.a.ga);
            a.b("utils.triggerEvent", a.a.Ga);
            a.b("utils.unwrapObservable", a.a.c);
            a.b("utils.objectForEach", a.a.w);
            a.b("utils.addOrRemoveItem", a.a.ja);
            a.b("unwrap", a.a.c);
            Function.prototype.bind || (Function.prototype.bind = function (a) {
                var c = this, d = Array.prototype.slice.call(arguments);
                a = d.shift();
                return function () {
                    return c.apply(a, d.concat(Array.prototype.slice.call(arguments)))
                }
            });
            a.a.f = new function () {
                var b = 0, c = "__ko__" + (new Date).getTime(),
                    d = {};
                return{get: function (b, c) {
                    var e = a.a.f.pa(b, !1);
                    return e === q ? q : e[c]
                }, set: function (b, c, e) {
                    if (e !== q || a.a.f.pa(b, !1) !== q)a.a.f.pa(b, !0)[c] = e
                }, pa: function (a, g) {
                    var e = a[c];
                    if (!e || "null" === e || !d[e]) {
                        if (!g)return q;
                        e = a[c] = "ko" + b++;
                        d[e] = {}
                    }
                    return d[e]
                }, clear: function (a) {
                    var b = a[c];
                    return b ? (delete d[b], a[c] = null, !0) : !1
                }}
            };
            a.b("utils.domData", a.a.f);
            a.b("utils.domData.clear", a.a.f.clear);
            a.a.C = new function () {
                function b(b, c) {
                    var g = a.a.f.get(b, d);
                    g === q && c && (g = [], a.a.f.set(b, d, g));
                    return g
                }

                function c(e) {
                    var d =
                        b(e, !1);
                    if (d)for (var d = d.slice(0), f = 0; f < d.length; f++)d[f](e);
                    a.a.f.clear(e);
                    "function" == typeof t && "function" == typeof t.cleanData && t.cleanData([e]);
                    if (g[e.nodeType])for (d = e.firstChild; e = d;)d = e.nextSibling, 8 === e.nodeType && c(e)
                }

                var d = "__ko_domNodeDisposal__" + (new Date).getTime(), f = {1: !0, 8: !0, 9: !0}, g = {1: !0, 9: !0};
                return{ia: function (a, c) {
                    if ("function" != typeof c)throw Error("Callback must be a function");
                    b(a, !0).push(c)
                }, cb: function (e, c) {
                    var g = b(e, !1);
                    g && (a.a.ka(g, c), 0 == g.length && a.a.f.set(e, d, q))
                }, H: function (b) {
                    if (f[b.nodeType] &&
                        (c(b), g[b.nodeType])) {
                        var d = [];
                        a.a.R(d, b.getElementsByTagName("*"));
                        for (var h = 0, k = d.length; h < k; h++)c(d[h])
                    }
                    return b
                }, removeNode: function (b) {
                    a.H(b);
                    b.parentNode && b.parentNode.removeChild(b)
                }}
            };
            a.H = a.a.C.H;
            a.removeNode = a.a.C.removeNode;
            a.b("cleanNode", a.H);
            a.b("removeNode", a.removeNode);
            a.b("utils.domNodeDisposal", a.a.C);
            a.b("utils.domNodeDisposal.addDisposeCallback", a.a.C.ia);
            a.b("utils.domNodeDisposal.removeDisposeCallback", a.a.C.cb);
            (function () {
                a.a.xa = function (b) {
                    var c;
                    if ("undefined" != typeof t)if (t.parseHTML)c =
                        t.parseHTML(b) || []; else {
                        if ((c = t.clean([b])) && c[0]) {
                            for (b = c[0]; b.parentNode && 11 !== b.parentNode.nodeType;)b = b.parentNode;
                            b.parentNode && b.parentNode.removeChild(b)
                        }
                    } else {
                        var d = a.a.F(b).toLowerCase();
                        c = s.createElement("div");
                        d = d.match(/^<(thead|tbody|tfoot)/) && [1, "<table>", "</table>"] || !d.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!d.indexOf("<td") || !d.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || [0, "", ""];
                        b = "ignored<div>" + d[1] + b + d[2] + "</div>";
                        for ("function" == typeof w.innerShiv ?
                                 c.appendChild(w.innerShiv(b)) : c.innerHTML = b; d[0]--;)c = c.lastChild;
                        c = a.a.N(c.lastChild.childNodes)
                    }
                    return c
                };
                a.a.fa = function (b, c) {
                    a.a.oa(b);
                    c = a.a.c(c);
                    if (null !== c && c !== q)if ("string" != typeof c && (c = c.toString()), "undefined" != typeof t)t(b).html(c); else for (var d = a.a.xa(c), f = 0; f < d.length; f++)b.appendChild(d[f])
                }
            })();
            a.b("utils.parseHtmlFragment", a.a.xa);
            a.b("utils.setHtml", a.a.fa);
            a.s = function () {
                function b(c, f) {
                    if (c)if (8 == c.nodeType) {
                        var g = a.s.$a(c.nodeValue);
                        null != g && f.push({xb: c, Kb: g})
                    } else if (1 == c.nodeType)for (var g =
                        0, e = c.childNodes, m = e.length; g < m; g++)b(e[g], f)
                }

                var c = {};
                return{va: function (a) {
                    if ("function" != typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");
                    var b = (4294967296 * (1 + Math.random()) | 0).toString(16).substring(1) + (4294967296 * (1 + Math.random()) | 0).toString(16).substring(1);
                    c[b] = a;
                    return"\x3c!--[ko_memo:" + b + "]--\x3e"
                }, mb: function (a, b) {
                    var g = c[a];
                    if (g === q)throw Error("Couldn't find any memo with ID " + a + ". Perhaps it's already been unmemoized.");
                    try {
                        return g.apply(null, b || []),
                            !0
                    } finally {
                        delete c[a]
                    }
                }, nb: function (c, f) {
                    var g = [];
                    b(c, g);
                    for (var e = 0, m = g.length; e < m; e++) {
                        var h = g[e].xb, k = [h];
                        f && a.a.R(k, f);
                        a.s.mb(g[e].Kb, k);
                        h.nodeValue = "";
                        h.parentNode && h.parentNode.removeChild(h)
                    }
                }, $a: function (a) {
                    return(a = a.match(/^\[ko_memo\:(.*?)\]$/)) ? a[1] : null
                }}
            }();
            a.b("memoization", a.s);
            a.b("memoization.memoize", a.s.va);
            a.b("memoization.unmemoize", a.s.mb);
            a.b("memoization.parseMemoText", a.s.$a);
            a.b("memoization.unmemoizeDomNodeAndDescendants", a.s.nb);
            a.Sa = {throttle: function (b, c) {
                b.throttleEvaluation =
                    c;
                var d = null;
                return a.j({read: b, write: function (a) {
                    clearTimeout(d);
                    d = setTimeout(function () {
                        b(a)
                    }, c)
                }})
            }, notify: function (b, c) {
                b.equalityComparer = "always" == c ? F(!1) : a.m.fn.equalityComparer;
                return b
            }};
            a.b("extenders", a.Sa);
            a.kb = function (b, c, d) {
                this.target = b;
                this.la = c;
                this.wb = d;
                a.r(this, "dispose", this.B)
            };
            a.kb.prototype.B = function () {
                this.Hb = !0;
                this.wb()
            };
            a.V = function () {
                this.G = {};
                a.a.extend(this, a.V.fn);
                a.r(this, "subscribe", this.Da);
                a.r(this, "extend", this.extend);
                a.r(this, "getSubscriptionsCount", this.Db)
            };
            a.V.fn = {Da: function (b, c, d) {
                d = d || "change";
                var f = new a.kb(this, c ? b.bind(c) : b, function () {
                    a.a.ka(this.G[d], f)
                }.bind(this));
                this.G[d] || (this.G[d] = []);
                this.G[d].push(f);
                return f
            }, notifySubscribers: function (b, c) {
                c = c || "change";
                this.G[c] && a.q.I(function () {
                    a.a.p(this.G[c].slice(0), function (a) {
                        a && !0 !== a.Hb && a.la(b)
                    })
                }, this)
            }, Db: function () {
                var b = 0;
                a.a.w(this.G, function (a, d) {
                    b += d.length
                });
                return b
            }, extend: function (b) {
                var c = this;
                b && a.a.w(b, function (b, f) {
                    var g = a.Sa[b];
                    "function" == typeof g && (c = g(c, f))
                });
                return c
            }};
            a.Wa = function (a) {
                return null != a && "function" == typeof a.Da && "function" == typeof a.notifySubscribers
            };
            a.b("subscribable", a.V);
            a.b("isSubscribable", a.Wa);
            a.q = function () {
                var b = [];
                return{rb: function (a) {
                    b.push({la: a, Ra: []})
                }, end: function () {
                    b.pop()
                }, bb: function (c) {
                    if (!a.Wa(c))throw Error("Only subscribable things can act as dependencies");
                    if (0 < b.length) {
                        var d = b[b.length - 1];
                        !d || 0 <= a.a.k(d.Ra, c) || (d.Ra.push(c), d.la(c))
                    }
                }, I: function (a, d, f) {
                    try {
                        return b.push(null), a.apply(d, f || [])
                    } finally {
                        b.pop()
                    }
                }}
            }();
            var L =
            {undefined: !0, "boolean": !0, number: !0, string: !0};
            a.m = function (b) {
                function c() {
                    if (0 < arguments.length)return c.equalityComparer && c.equalityComparer(d, arguments[0]) || (c.K(), d = arguments[0], c.J()), this;
                    a.q.bb(c);
                    return d
                }

                var d = b;
                a.V.call(c);
                c.t = function () {
                    return d
                };
                c.J = function () {
                    c.notifySubscribers(d)
                };
                c.K = function () {
                    c.notifySubscribers(d, "beforeChange")
                };
                a.a.extend(c, a.m.fn);
                a.r(c, "peek", c.t);
                a.r(c, "valueHasMutated", c.J);
                a.r(c, "valueWillMutate", c.K);
                return c
            };
            a.m.fn = {equalityComparer: function (a, c) {
                return null ===
                    a || typeof a in L ? a === c : !1
            }};
            var A = a.m.Pb = "__ko_proto__";
            a.m.fn[A] = a.m;
            a.qa = function (b, c) {
                return null === b || b === q || b[A] === q ? !1 : b[A] === c ? !0 : a.qa(b[A], c)
            };
            a.T = function (b) {
                return a.qa(b, a.m)
            };
            a.Xa = function (b) {
                return"function" == typeof b && b[A] === a.m || "function" == typeof b && b[A] === a.j && b.Eb ? !0 : !1
            };
            a.b("observable", a.m);
            a.b("isObservable", a.T);
            a.b("isWriteableObservable", a.Xa);
            a.U = function (b) {
                b = b || [];
                if ("object" != typeof b || !("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
                b = a.m(b);
                a.a.extend(b, a.U.fn);
                return b
            };
            a.U.fn = {remove: function (a) {
                for (var c = this.t(), d = [], f = "function" == typeof a ? a : function (e) {
                    return e === a
                }, g = 0; g < c.length; g++) {
                    var e = c[g];
                    f(e) && (0 === d.length && this.K(), d.push(e), c.splice(g, 1), g--)
                }
                d.length && this.J();
                return d
            }, removeAll: function (b) {
                if (b === q) {
                    var c = this.t(), d = c.slice(0);
                    this.K();
                    c.splice(0, c.length);
                    this.J();
                    return d
                }
                return b ? this.remove(function (c) {
                    return 0 <= a.a.k(b, c)
                }) : []
            }, destroy: function (a) {
                var c = this.t(), d = "function" == typeof a ? a : function (c) {
                    return c ===
                        a
                };
                this.K();
                for (var f = c.length - 1; 0 <= f; f--)d(c[f]) && (c[f]._destroy = !0);
                this.J()
            }, destroyAll: function (b) {
                return b === q ? this.destroy(F(!0)) : b ? this.destroy(function (c) {
                    return 0 <= a.a.k(b, c)
                }) : []
            }, indexOf: function (b) {
                var c = this();
                return a.a.k(c, b)
            }, replace: function (a, c) {
                var d = this.indexOf(a);
                0 <= d && (this.K(), this.t()[d] = c, this.J())
            }};
            a.a.p("pop push reverse shift sort splice unshift".split(" "), function (b) {
                a.U.fn[b] = function () {
                    var a = this.t();
                    this.K();
                    a = a[b].apply(a, arguments);
                    this.J();
                    return a
                }
            });
            a.a.p(["slice"],
                function (b) {
                    a.U.fn[b] = function () {
                        var a = this();
                        return a[b].apply(a, arguments)
                    }
                });
            a.b("observableArray", a.U);
            a.j = function (b, c, d) {
                function f() {
                    a.a.p(v, function (a) {
                        a.B()
                    });
                    v = []
                }

                function g() {
                    var a = m.throttleEvaluation;
                    a && 0 <= a ? (clearTimeout(t), t = setTimeout(e, a)) : e()
                }

                function e() {
                    if (!n)if (l && D())x(); else {
                        n = !0;
                        try {
                            var b = a.a.Z(v, function (a) {
                                return a.target
                            });
                            a.q.rb(function (e) {
                                var c;
                                0 <= (c = a.a.k(b, e)) ? b[c] = q : v.push(e.Da(g))
                            });
                            for (var e = p.call(c), d = b.length - 1; 0 <= d; d--)b[d] && v.splice(d, 1)[0].B();
                            l = !0;
                            m.notifySubscribers(k,
                                "beforeChange");
                            k = e;
                            m.notifySubscribers(k)
                        } finally {
                            a.q.end(), n = !1
                        }
                        v.length || x()
                    }
                }

                function m() {
                    if (0 < arguments.length) {
                        if ("function" === typeof r)r.apply(c, arguments); else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
                        return this
                    }
                    l || e();
                    a.q.bb(m);
                    return k
                }

                function h() {
                    return!l || 0 < v.length
                }

                var k, l = !1, n = !1, p = b;
                p && "object" == typeof p ? (d = p, p = d.read) : (d = d || {}, p || (p = d.read));
                if ("function" != typeof p)throw Error("Pass a function that returns the value of the ko.computed");
                var r = d.write, z = d.disposeWhenNodeIsRemoved || d.$ || null, D = d.disposeWhen || d.Qa || F(!1), x = f, v = [], t = null;
                c || (c = d.owner);
                m.t = function () {
                    l || e();
                    return k
                };
                m.Cb = function () {
                    return v.length
                };
                m.Eb = "function" === typeof d.write;
                m.B = function () {
                    x()
                };
                m.ta = h;
                a.V.call(m);
                a.a.extend(m, a.j.fn);
                a.r(m, "peek", m.t);
                a.r(m, "dispose", m.B);
                a.r(m, "isActive", m.ta);
                a.r(m, "getDependenciesCount", m.Cb);
                !0 !== d.deferEvaluation && e();
                if (z && h()) {
                    x = function () {
                        a.a.C.cb(z, x);
                        f()
                    };
                    a.a.C.ia(z, x);
                    var s = D, D = function () {
                        return!a.a.aa(z) || s()
                    }
                }
                return m
            };
            a.Gb = function (b) {
                return a.qa(b, a.j)
            };
            C = a.m.Pb;
            a.j[C] = a.m;
            a.j.fn = {};
            a.j.fn[C] = a.j;
            a.b("dependentObservable", a.j);
            a.b("computed", a.j);
            a.b("isComputed", a.Gb);
            (function () {
                function b(a, g, e) {
                    e = e || new d;
                    a = g(a);
                    if ("object" != typeof a || null === a || a === q || a instanceof Date || a instanceof String || a instanceof Number || a instanceof Boolean)return a;
                    var m = a instanceof Array ? [] : {};
                    e.save(a, m);
                    c(a, function (c) {
                        var d = g(a[c]);
                        switch (typeof d) {
                            case "boolean":
                            case "number":
                            case "string":
                            case "function":
                                m[c] = d;
                                break;
                            case "object":
                            case "undefined":
                                var l =
                                    e.get(d);
                                m[c] = l !== q ? l : b(d, g, e)
                        }
                    });
                    return m
                }

                function c(a, b) {
                    if (a instanceof Array) {
                        for (var e = 0; e < a.length; e++)b(e);
                        "function" == typeof a.toJSON && b("toJSON")
                    } else for (e in a)b(e)
                }

                function d() {
                    this.keys = [];
                    this.Ha = []
                }

                a.lb = function (c) {
                    if (0 == arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");
                    return b(c, function (b) {
                        for (var e = 0; a.T(b) && 10 > e; e++)b = b();
                        return b
                    })
                };
                a.toJSON = function (b, c, e) {
                    b = a.lb(b);
                    return a.a.Ca(b, c, e)
                };
                d.prototype = {save: function (b, c) {
                    var e = a.a.k(this.keys,
                        b);
                    0 <= e ? this.Ha[e] = c : (this.keys.push(b), this.Ha.push(c))
                }, get: function (b) {
                    b = a.a.k(this.keys, b);
                    return 0 <= b ? this.Ha[b] : q
                }}
            })();
            a.b("toJS", a.lb);
            a.b("toJSON", a.toJSON);
            (function () {
                a.h = {n: function (b) {
                    switch (a.a.u(b)) {
                        case "option":
                            return!0 === b.__ko__hasDomDataOptionValue__ ? a.a.f.get(b, a.d.options.wa) : 7 >= a.a.ca ? b.getAttributeNode("value") && b.getAttributeNode("value").specified ? b.value : b.text : b.value;
                        case "select":
                            return 0 <= b.selectedIndex ? a.h.n(b.options[b.selectedIndex]) : q;
                        default:
                            return b.value
                    }
                }, W: function (b, c) {
                    switch (a.a.u(b)) {
                        case "option":
                            switch (typeof c) {
                                case "string":
                                    a.a.f.set(b, a.d.options.wa, q);
                                    "__ko__hasDomDataOptionValue__"in b && delete b.__ko__hasDomDataOptionValue__;
                                    b.value = c;
                                    break;
                                default:
                                    a.a.f.set(b, a.d.options.wa, c), b.__ko__hasDomDataOptionValue__ = !0, b.value = "number" === typeof c ? c : ""
                            }
                            break;
                        case "select":
                            "" === c && (c = q);
                            if (null === c || c === q)b.selectedIndex = -1;
                            for (var d = b.options.length - 1; 0 <= d; d--)if (a.h.n(b.options[d]) == c) {
                                b.selectedIndex = d;
                                break
                            }
                            1 < b.size || -1 !== b.selectedIndex || (b.selectedIndex =
                                0);
                            break;
                        default:
                            if (null === c || c === q)c = "";
                            b.value = c
                    }
                }}
            })();
            a.b("selectExtensions", a.h);
            a.b("selectExtensions.readValue", a.h.n);
            a.b("selectExtensions.writeValue", a.h.W);
            a.g = function () {
                function b(a, b) {
                    for (var d = null; a != d;)d = a, a = a.replace(c, function (a, c) {
                        return b[c]
                    });
                    return a
                }

                var c = /\@ko_token_(\d+)\@/g, d = ["true", "false", "null", "undefined"], f = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;
                return{S: [], da: function (c) {
                    var e = a.a.F(c);
                    if (3 > e.length)return[];
                    "{" === e.charAt(0) && (e = e.substring(1, e.length -
                        1));
                    c = [];
                    for (var d = null, f, k = 0; k < e.length; k++) {
                        var l = e.charAt(k);
                        if (null === d)switch (l) {
                            case '"':
                            case "'":
                            case "/":
                                d = k, f = l
                        } else if (l == f && "\\" !== e.charAt(k - 1)) {
                            l = e.substring(d, k + 1);
                            c.push(l);
                            var n = "@ko_token_" + (c.length - 1) + "@", e = e.substring(0, d) + n + e.substring(k + 1), k = k - (l.length - n.length), d = null
                        }
                    }
                    f = d = null;
                    for (var p = 0, r = null, k = 0; k < e.length; k++) {
                        l = e.charAt(k);
                        if (null === d)switch (l) {
                            case "{":
                                d = k;
                                r = l;
                                f = "}";
                                break;
                            case "(":
                                d = k;
                                r = l;
                                f = ")";
                                break;
                            case "[":
                                d = k, r = l, f = "]"
                        }
                        l === r ? p++ : l === f && (p--, 0 === p && (l = e.substring(d,
                            k + 1), c.push(l), n = "@ko_token_" + (c.length - 1) + "@", e = e.substring(0, d) + n + e.substring(k + 1), k -= l.length - n.length, d = null))
                    }
                    f = [];
                    e = e.split(",");
                    d = 0;
                    for (k = e.length; d < k; d++)p = e[d], r = p.indexOf(":"), 0 < r && r < p.length - 1 ? (l = p.substring(r + 1), f.push({key: b(p.substring(0, r), c), value: b(l, c)})) : f.push({unknown: b(p, c)});
                    return f
                }, ea: function (b) {
                    var e = "string" === typeof b ? a.g.da(b) : b, c = [];
                    b = [];
                    for (var h, k = 0; h = e[k]; k++)if (0 < c.length && c.push(","), h.key) {
                        var l;
                        a:{
                            l = h.key;
                            var n = a.a.F(l);
                            switch (n.length && n.charAt(0)) {
                                case "'":
                                case '"':
                                    break a;
                                default:
                                    l = "'" + n + "'"
                            }
                        }
                        h = h.value;
                        c.push(l);
                        c.push(":");
                        c.push(h);
                        h = a.a.F(h);
                        0 <= a.a.k(d, a.a.F(h).toLowerCase()) ? h = !1 : (n = h.match(f), h = null === n ? !1 : n[1] ? "Object(" + n[1] + ")" + n[2] : h);
                        h && (0 < b.length && b.push(", "), b.push(l + " : function(__ko_value) { " + h + " = __ko_value; }"))
                    } else h.unknown && c.push(h.unknown);
                    e = c.join("");
                    0 < b.length && (e = e + ", '_ko_property_writers' : { " + b.join("") + " } ");
                    return e
                }, Jb: function (b, c) {
                    for (var d = 0; d < b.length; d++)if (a.a.F(b[d].key) == c)return!0;
                    return!1
                }, ha: function (b, c, d, f, k) {
                    if (b &&
                        a.T(b))!a.Xa(b) || k && b.t() === f || b(f); else if ((b = c()._ko_property_writers) && b[d])b[d](f)
                }}
            }();
            a.b("expressionRewriting", a.g);
            a.b("expressionRewriting.bindingRewriteValidators", a.g.S);
            a.b("expressionRewriting.parseObjectLiteral", a.g.da);
            a.b("expressionRewriting.preProcessBindings", a.g.ea);
            a.b("jsonExpressionRewriting", a.g);
            a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson", a.g.ea);
            (function () {
                function b(a) {
                    return 8 == a.nodeType && (g ? a.text : a.nodeValue).match(e)
                }

                function c(a) {
                    return 8 == a.nodeType &&
                        (g ? a.text : a.nodeValue).match(m)
                }

                function d(a, e) {
                    for (var d = a, g = 1, f = []; d = d.nextSibling;) {
                        if (c(d) && (g--, 0 === g))return f;
                        f.push(d);
                        b(d) && g++
                    }
                    if (!e)throw Error("Cannot find closing comment tag to match: " + a.nodeValue);
                    return null
                }

                function f(a, b) {
                    var c = d(a, b);
                    return c ? 0 < c.length ? c[c.length - 1].nextSibling : a.nextSibling : null
                }

                var g = s && "\x3c!--test--\x3e" === s.createComment("test").text, e = g ? /^\x3c!--\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*--\x3e$/ : /^\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*$/, m = g ? /^\x3c!--\s*\/ko\s*--\x3e$/ :
                    /^\s*\/ko\s*$/, h = {ul: !0, ol: !0};
                a.e = {L: {}, childNodes: function (a) {
                    return b(a) ? d(a) : a.childNodes
                }, ba: function (c) {
                    if (b(c)) {
                        c = a.e.childNodes(c);
                        for (var e = 0, d = c.length; e < d; e++)a.removeNode(c[e])
                    } else a.a.oa(c)
                }, P: function (c, e) {
                    if (b(c)) {
                        a.e.ba(c);
                        for (var d = c.nextSibling, g = 0, f = e.length; g < f; g++)d.parentNode.insertBefore(e[g], d)
                    } else a.a.P(c, e)
                }, ab: function (a, c) {
                    b(a) ? a.parentNode.insertBefore(c, a.nextSibling) : a.firstChild ? a.insertBefore(c, a.firstChild) : a.appendChild(c)
                }, Va: function (c, e, d) {
                    d ? b(c) ? c.parentNode.insertBefore(e,
                        d.nextSibling) : d.nextSibling ? c.insertBefore(e, d.nextSibling) : c.appendChild(e) : a.e.ab(c, e)
                }, firstChild: function (a) {
                    return b(a) ? !a.nextSibling || c(a.nextSibling) ? null : a.nextSibling : a.firstChild
                }, nextSibling: function (a) {
                    b(a) && (a = f(a));
                    return a.nextSibling && c(a.nextSibling) ? null : a.nextSibling
                }, ob: function (a) {
                    return(a = b(a)) ? a[1] : null
                }, Za: function (e) {
                    if (h[a.a.u(e)]) {
                        var d = e.firstChild;
                        if (d) {
                            do if (1 === d.nodeType) {
                                var g;
                                g = d.firstChild;
                                var m = null;
                                if (g) {
                                    do if (m)m.push(g); else if (b(g)) {
                                        var r = f(g, !0);
                                        r ? g = r : m =
                                            [g]
                                    } else c(g) && (m = [g]); while (g = g.nextSibling)
                                }
                                if (g = m)for (m = d.nextSibling, r = 0; r < g.length; r++)m ? e.insertBefore(g[r], m) : e.appendChild(g[r])
                            } while (d = d.nextSibling)
                        }
                    }
                }}
            })();
            a.b("virtualElements", a.e);
            a.b("virtualElements.allowedBindings", a.e.L);
            a.b("virtualElements.emptyNode", a.e.ba);
            a.b("virtualElements.insertAfter", a.e.Va);
            a.b("virtualElements.prepend", a.e.ab);
            a.b("virtualElements.setDomNodeChildren", a.e.P);
            (function () {
                a.M = function () {
                    this.Na = {}
                };
                a.a.extend(a.M.prototype, {nodeHasBindings: function (b) {
                    switch (b.nodeType) {
                        case 1:
                            return null !=
                                b.getAttribute("data-bind");
                        case 8:
                            return null != a.e.ob(b);
                        default:
                            return!1
                    }
                }, getBindings: function (a, c) {
                    var d = this.getBindingsString(a, c);
                    return d ? this.parseBindingsString(d, c, a) : null
                }, getBindingsString: function (b) {
                    switch (b.nodeType) {
                        case 1:
                            return b.getAttribute("data-bind");
                        case 8:
                            return a.e.ob(b);
                        default:
                            return null
                    }
                }, parseBindingsString: function (b, c, d) {
                    try {
                        var f;
                        if (!(f = this.Na[b])) {
                            var g = this.Na, e, m = "with($context){with($data||{}){return{" + a.g.ea(b) + "}}}";
                            e = new Function("$context", "$element", m);
                            f = g[b] = e
                        }
                        return f(c, d)
                    } catch (h) {
                        throw h.message = "Unable to parse bindings.\nBindings value: " + b + "\nMessage: " + h.message, h;
                    }
                }});
                a.M.instance = new a.M
            })();
            a.b("bindingProvider", a.M);
            (function () {
                function b(b, e, d) {
                    for (var f = a.e.firstChild(e); e = f;)f = a.e.nextSibling(e), c(b, e, d)
                }

                function c(c, e, f) {
                    var h = !0, k = 1 === e.nodeType;
                    k && a.e.Za(e);
                    if (k && f || a.M.instance.nodeHasBindings(e))h = d(e, null, c, f).Sb;
                    h && b(c, e, !k)
                }

                function d(b, c, d, h) {
                    function k(a) {
                        return function () {
                            return p[a]
                        }
                    }

                    function l() {
                        return p
                    }

                    var n = 0, p, r,
                        z = a.a.f.get(b, f);
                    if (!c) {
                        if (z)throw Error("You cannot apply bindings multiple times to the same element.");
                        a.a.f.set(b, f, !0)
                    }
                    a.j(function () {
                        var f = d && d instanceof a.A ? d : new a.A(a.a.c(d)), x = f.$data;
                        !z && h && a.jb(b, f);
                        if (p = ("function" == typeof c ? c(f, b) : c) || a.M.instance.getBindings(b, f))0 === n && (n = 1, a.a.w(p, function (c) {
                            var e = a.d[c];
                            if (e && 8 === b.nodeType && !a.e.L[c])throw Error("The binding '" + c + "' cannot be used with virtual elements");
                            if (e && "function" == typeof e.init && (e = (0, e.init)(b, k(c), l, x, f)) && e.controlsDescendantBindings) {
                                if (r !==
                                    q)throw Error("Multiple bindings (" + r + " and " + c + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                r = c
                            }
                        }), n = 2), 2 === n && a.a.w(p, function (c) {
                            var e = a.d[c];
                            e && "function" == typeof e.update && (0, e.update)(b, k(c), l, x, f)
                        })
                    }, null, {$: b});
                    return{Sb: r === q}
                }

                a.d = {};
                a.A = function (b, c, d) {
                    c ? (a.a.extend(this, c), this.$parentContext = c, this.$parent = c.$data, this.$parents = (c.$parents || []).slice(0), this.$parents.unshift(this.$parent)) : (this.$parents =
                        [], this.$root = b, this.ko = a);
                    this.$data = b;
                    d && (this[d] = b)
                };
                a.A.prototype.createChildContext = function (b, c) {
                    return new a.A(b, this, c)
                };
                a.A.prototype.extend = function (b) {
                    var c = a.a.extend(new a.A, this);
                    return a.a.extend(c, b)
                };
                var f = "__ko_boundElement";
                a.jb = function (b, c) {
                    if (2 == arguments.length)a.a.f.set(b, "__ko_bindingContext__", c); else return a.a.f.get(b, "__ko_bindingContext__")
                };
                a.Ka = function (b, c, f) {
                    1 === b.nodeType && a.e.Za(b);
                    return d(b, c, f, !0)
                };
                a.Ja = function (a, c) {
                    1 !== c.nodeType && 8 !== c.nodeType || b(a, c, !0)
                };
                a.Ia = function (a, b) {
                    if (b && 1 !== b.nodeType && 8 !== b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
                    b = b || w.document.body;
                    c(a, b, !0)
                };
                a.na = function (b) {
                    switch (b.nodeType) {
                        case 1:
                        case 8:
                            var c = a.jb(b);
                            if (c)return c;
                            if (b.parentNode)return a.na(b.parentNode)
                    }
                    return q
                };
                a.ub = function (b) {
                    return(b = a.na(b)) ? b.$data : q
                };
                a.b("bindingHandlers", a.d);
                a.b("applyBindings", a.Ia);
                a.b("applyBindingsToDescendants", a.Ja);
                a.b("applyBindingsToNode", a.Ka);
                a.b("contextFor", a.na);
                a.b("dataFor", a.ub)
            })();
            var K = {"class": "className", "for": "htmlFor"};
            a.d.attr = {update: function (b, c) {
                var d = a.a.c(c()) || {};
                a.a.w(d, function (c, d) {
                    d = a.a.c(d);
                    var e = !1 === d || null === d || d === q;
                    e && b.removeAttribute(c);
                    8 >= a.a.ca && c in K ? (c = K[c], e ? b.removeAttribute(c) : b[c] = d) : e || b.setAttribute(c, d.toString());
                    "name" === c && a.a.gb(b, e ? "" : d.toString())
                })
            }};
            a.d.checked = {init: function (b, c, d) {
                a.a.o(b, "click", function () {
                    var f;
                    if ("checkbox" == b.type)f = b.checked; else if ("radio" == b.type && b.checked)f =
                        b.value; else return;
                    var g = c(), e = a.a.c(g);
                    "checkbox" == b.type && e instanceof Array ? a.a.ja(g, b.value, b.checked) : a.g.ha(g, d, "checked", f, !0)
                });
                "radio" != b.type || b.name || a.d.uniqueName.init(b, F(!0))
            }, update: function (b, c) {
                var d = a.a.c(c());
                "checkbox" == b.type ? b.checked = d instanceof Array ? 0 <= a.a.k(d, b.value) : d : "radio" == b.type && (b.checked = b.value == d)
            }};
            a.d.css = {update: function (b, c) {
                var d = a.a.c(c());
                "object" == typeof d ? a.a.w(d, function (c, d) {
                    d = a.a.c(d);
                    a.a.ga(b, c, d)
                }) : (d = String(d || ""), a.a.ga(b, b.__ko__cssValue, !1),
                    b.__ko__cssValue = d, a.a.ga(b, d, !0))
            }};
            a.d.enable = {update: function (b, c) {
                var d = a.a.c(c());
                d && b.disabled ? b.removeAttribute("disabled") : d || b.disabled || (b.disabled = !0)
            }};
            a.d.disable = {update: function (b, c) {
                a.d.enable.update(b, function () {
                    return!a.a.c(c())
                })
            }};
            a.d.event = {init: function (b, c, d, f) {
                var g = c() || {};
                a.a.w(g, function (e) {
                    "string" == typeof e && a.a.o(b, e, function (b) {
                        var g, k = c()[e];
                        if (k) {
                            var l = d();
                            try {
                                var n = a.a.N(arguments);
                                n.unshift(f);
                                g = k.apply(f, n)
                            } finally {
                                !0 !== g && (b.preventDefault ? b.preventDefault() : b.returnValue = !1)
                            }
                            !1 === l[e + "Bubble"] && (b.cancelBubble = !0, b.stopPropagation && b.stopPropagation())
                        }
                    })
                })
            }};
            a.d.foreach = {Ya: function (b) {
                return function () {
                    var c = b(), d = a.a.ya(c);
                    if (!d || "number" == typeof d.length)return{foreach: c, templateEngine: a.D.sa};
                    a.a.c(c);
                    return{foreach: d.data, as: d.as, includeDestroyed: d.includeDestroyed, afterAdd: d.afterAdd, beforeRemove: d.beforeRemove, afterRender: d.afterRender, beforeMove: d.beforeMove, afterMove: d.afterMove, templateEngine: a.D.sa}
                }
            }, init: function (b, c) {
                return a.d.template.init(b, a.d.foreach.Ya(c))
            },
                update: function (b, c, d, f, g) {
                    return a.d.template.update(b, a.d.foreach.Ya(c), d, f, g)
                }};
            a.g.S.foreach = !1;
            a.e.L.foreach = !0;
            a.d.hasfocus = {init: function (b, c, d) {
                function f(e) {
                    b.__ko_hasfocusUpdating = !0;
                    var f = b.ownerDocument;
                    if ("activeElement"in f) {
                        var g;
                        try {
                            g = f.activeElement
                        } catch (l) {
                            g = f.body
                        }
                        e = g === b
                    }
                    f = c();
                    a.g.ha(f, d, "hasfocus", e, !0);
                    b.__ko_hasfocusLastValue = e;
                    b.__ko_hasfocusUpdating = !1
                }

                var g = f.bind(null, !0), e = f.bind(null, !1);
                a.a.o(b, "focus", g);
                a.a.o(b, "focusin", g);
                a.a.o(b, "blur", e);
                a.a.o(b, "focusout", e)
            },
                update: function (b, c) {
                    var d = !!a.a.c(c());
                    b.__ko_hasfocusUpdating || b.__ko_hasfocusLastValue === d || (d ? b.focus() : b.blur(), a.q.I(a.a.Ga, null, [b, d ? "focusin" : "focusout"]))
                }};
            a.d.hasFocus = a.d.hasfocus;
            a.d.html = {init: function () {
                return{controlsDescendantBindings: !0}
            }, update: function (b, c) {
                a.a.fa(b, c())
            }};
            var I = "__ko_withIfBindingData";
            G("if");
            G("ifnot", !1, !0);
            G("with", !0, !1, function (a, c) {
                return a.createChildContext(c)
            });
            a.d.options = {init: function (b) {
                if ("select" !== a.a.u(b))throw Error("options binding applies only to SELECT elements");
                for (; 0 < b.length;)b.remove(0);
                return{controlsDescendantBindings: !0}
            }, update: function (b, c, d) {
                function f(a, b, c) {
                    var d = typeof b;
                    return"function" == d ? b(a) : "string" == d ? a[b] : c
                }

                function g(b, c) {
                    if (p) {
                        var d = 0 <= a.a.k(p, a.h.n(c[0]));
                        a.a.hb(c[0], d)
                    }
                }

                var e = 0 == b.length, m = !e && b.multiple ? b.scrollTop : null;
                c = a.a.c(c());
                var h = d(), k = h.optionsIncludeDestroyed, l = {}, n, p;
                b.multiple ? p = a.a.Z(b.selectedOptions || a.a.Y(b.childNodes, function (b) {
                    return b.tagName && "option" === a.a.u(b) && b.selected
                }), function (b) {
                    return a.h.n(b)
                }) : 0 <=
                    b.selectedIndex && (p = [a.h.n(b.options[b.selectedIndex])]);
                if (c) {
                    "undefined" == typeof c.length && (c = [c]);
                    var r = a.a.Y(c, function (b) {
                        return k || b === q || null === b || !a.a.c(b._destroy)
                    });
                    "optionsCaption"in h && (n = a.a.c(h.optionsCaption), null !== n && n !== q && r.unshift(l))
                } else c = [];
                d = g;
                h.optionsAfterRender && (d = function (b, c) {
                    g(0, c);
                    a.q.I(h.optionsAfterRender, null, [c[0], b !== l ? b : q])
                });
                a.a.Aa(b, r, function (b, c, d) {
                    d.length && (p = d[0].selected && [a.h.n(d[0])]);
                    c = s.createElement("option");
                    b === l ? (a.a.fa(c, n), a.h.W(c, q)) : (d = f(b,
                        h.optionsValue, b), a.h.W(c, a.a.c(d)), b = f(b, h.optionsText, d), a.a.ib(c, b));
                    return[c]
                }, null, d);
                p = null;
                e && "value"in h && J(b, a.a.ya(h.value), !0);
                a.a.zb(b);
                m && 20 < Math.abs(m - b.scrollTop) && (b.scrollTop = m)
            }};
            a.d.options.wa = "__ko.optionValueDomData__";
            a.d.selectedOptions = {init: function (b, c, d) {
                a.a.o(b, "change", function () {
                    var f = c(), g = [];
                    a.a.p(b.getElementsByTagName("option"), function (b) {
                        b.selected && g.push(a.h.n(b))
                    });
                    a.g.ha(f, d, "selectedOptions", g)
                })
            }, update: function (b, c) {
                if ("select" != a.a.u(b))throw Error("values binding applies only to SELECT elements");
                var d = a.a.c(c());
                d && "number" == typeof d.length && a.a.p(b.getElementsByTagName("option"), function (b) {
                    var c = 0 <= a.a.k(d, a.h.n(b));
                    a.a.hb(b, c)
                })
            }};
            a.d.style = {update: function (b, c) {
                var d = a.a.c(c() || {});
                a.a.w(d, function (c, d) {
                    d = a.a.c(d);
                    b.style[c] = d || ""
                })
            }};
            a.d.submit = {init: function (b, c, d, f) {
                if ("function" != typeof c())throw Error("The value for a submit binding must be a function");
                a.a.o(b, "submit", function (a) {
                    var d, m = c();
                    try {
                        d = m.call(f, b)
                    } finally {
                        !0 !== d && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
                    }
                })
            }};
            a.d.text = {update: function (b, c) {
                a.a.ib(b, c())
            }};
            a.e.L.text = !0;
            a.d.uniqueName = {init: function (b, c) {
                if (c()) {
                    var d = "ko_unique_" + ++a.d.uniqueName.tb;
                    a.a.gb(b, d)
                }
            }};
            a.d.uniqueName.tb = 0;
            a.d.value = {init: function (b, c, d) {
                function f() {
                    m = !1;
                    var e = c(), f = a.h.n(b);
                    a.g.ha(e, d, "value", f)
                }

                var g = ["change"], e = d().valueUpdate, m = !1;
                e && ("string" == typeof e && (e = [e]), a.a.R(g, e), g = a.a.Ma(g));
                !a.a.ca || ("input" != b.tagName.toLowerCase() || "text" != b.type || "off" == b.autocomplete || b.form && "off" == b.form.autocomplete) || -1 != a.a.k(g, "propertychange") ||
                (a.a.o(b, "propertychange", function () {
                    m = !0
                }), a.a.o(b, "blur", function () {
                    m && f()
                }));
                a.a.p(g, function (c) {
                    var d = f;
                    a.a.Tb(c, "after") && (d = function () {
                        setTimeout(f, 0)
                    }, c = c.substring(5));
                    a.a.o(b, c, d)
                })
            }, update: function (b, c) {
                var d = "select" === a.a.u(b), f = a.a.c(c()), g = a.h.n(b);
                f !== g && (g = function () {
                    a.h.W(b, f)
                }, g(), d && setTimeout(g, 0));
                d && 0 < b.length && J(b, f, !1)
            }};
            a.d.visible = {update: function (b, c) {
                var d = a.a.c(c()), f = "none" != b.style.display;
                d && !f ? b.style.display = "" : !d && f && (b.style.display = "none")
            }};
            (function (b) {
                a.d[b] =
                {init: function (c, d, f, g) {
                    return a.d.event.init.call(this, c, function () {
                        var a = {};
                        a[b] = d();
                        return a
                    }, f, g)
                }}
            })("click");
            a.v = function () {
            };
            a.v.prototype.renderTemplateSource = function () {
                throw Error("Override renderTemplateSource");
            };
            a.v.prototype.createJavaScriptEvaluatorBlock = function () {
                throw Error("Override createJavaScriptEvaluatorBlock");
            };
            a.v.prototype.makeTemplateSource = function (b, c) {
                if ("string" == typeof b) {
                    c = c || s;
                    var d = c.getElementById(b);
                    if (!d)throw Error("Cannot find template with ID " + b);
                    return new a.l.i(d)
                }
                if (1 ==
                    b.nodeType || 8 == b.nodeType)return new a.l.Q(b);
                throw Error("Unknown template type: " + b);
            };
            a.v.prototype.renderTemplate = function (a, c, d, f) {
                a = this.makeTemplateSource(a, f);
                return this.renderTemplateSource(a, c, d)
            };
            a.v.prototype.isTemplateRewritten = function (a, c) {
                return!1 === this.allowTemplateRewriting ? !0 : this.makeTemplateSource(a, c).data("isRewritten")
            };
            a.v.prototype.rewriteTemplate = function (a, c, d) {
                a = this.makeTemplateSource(a, d);
                c = c(a.text());
                a.text(c);
                a.data("isRewritten", !0)
            };
            a.b("templateEngine", a.v);
            a.Ea = function () {
                function b(b, c, d, m) {
                    b = a.g.da(b);
                    for (var h = a.g.S, k = 0; k < b.length; k++) {
                        var l = b[k].key;
                        if (h.hasOwnProperty(l)) {
                            var n = h[l];
                            if ("function" === typeof n) {
                                if (l = n(b[k].value))throw Error(l);
                            } else if (!n)throw Error("This template engine does not support the '" + l + "' binding within its templates");
                        }
                    }
                    d = "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + a.g.ea(b) + " } })()},'" + d.toLowerCase() + "')";
                    return m.createJavaScriptEvaluatorBlock(d) + c
                }

                var c = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,
                    d = /\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;
                return{Ab: function (b, c, d) {
                    c.isTemplateRewritten(b, d) || c.rewriteTemplate(b, function (b) {
                        return a.Ea.Lb(b, c)
                    }, d)
                }, Lb: function (a, g) {
                    return a.replace(c,function (a, c, d, f, l) {
                        return b(l, c, d, g)
                    }).replace(d, function (a, c) {
                        return b(c, "\x3c!-- ko --\x3e", "#comment", g)
                    })
                }, qb: function (b, c) {
                    return a.s.va(function (d, m) {
                        var h = d.nextSibling;
                        h && h.nodeName.toLowerCase() === c && a.Ka(h, b, m)
                    })
                }}
            }();
            a.b("__tr_ambtns", a.Ea.qb);
            (function () {
                a.l = {};
                a.l.i = function (a) {
                    this.i = a
                };
                a.l.i.prototype.text =
                    function () {
                        var b = a.a.u(this.i), b = "script" === b ? "text" : "textarea" === b ? "value" : "innerHTML";
                        if (0 == arguments.length)return this.i[b];
                        var c = arguments[0];
                        "innerHTML" === b ? a.a.fa(this.i, c) : this.i[b] = c
                    };
                a.l.i.prototype.data = function (b) {
                    if (1 === arguments.length)return a.a.f.get(this.i, "templateSourceData_" + b);
                    a.a.f.set(this.i, "templateSourceData_" + b, arguments[1])
                };
                a.l.Q = function (a) {
                    this.i = a
                };
                a.l.Q.prototype = new a.l.i;
                a.l.Q.prototype.text = function () {
                    if (0 == arguments.length) {
                        var b = a.a.f.get(this.i, "__ko_anon_template__") ||
                        {};
                        b.Fa === q && b.ma && (b.Fa = b.ma.innerHTML);
                        return b.Fa
                    }
                    a.a.f.set(this.i, "__ko_anon_template__", {Fa: arguments[0]})
                };
                a.l.i.prototype.nodes = function () {
                    if (0 == arguments.length)return(a.a.f.get(this.i, "__ko_anon_template__") || {}).ma;
                    a.a.f.set(this.i, "__ko_anon_template__", {ma: arguments[0]})
                };
                a.b("templateSources", a.l);
                a.b("templateSources.domElement", a.l.i);
                a.b("templateSources.anonymousTemplate", a.l.Q)
            })();
            (function () {
                function b(b, c, d) {
                    var f;
                    for (c = a.e.nextSibling(c); b && (f = b) !== c;)b = a.e.nextSibling(f), 1 !==
                        f.nodeType && 8 !== f.nodeType || d(f)
                }

                function c(c, d) {
                    if (c.length) {
                        var f = c[0], g = c[c.length - 1];
                        b(f, g, function (b) {
                            a.Ia(d, b)
                        });
                        b(f, g, function (b) {
                            a.s.nb(b, [d])
                        })
                    }
                }

                function d(a) {
                    return a.nodeType ? a : 0 < a.length ? a[0] : null
                }

                function f(b, f, h, k, l) {
                    l = l || {};
                    var n = b && d(b), n = n && n.ownerDocument, p = l.templateEngine || g;
                    a.Ea.Ab(h, p, n);
                    h = p.renderTemplate(h, k, l, n);
                    if ("number" != typeof h.length || 0 < h.length && "number" != typeof h[0].nodeType)throw Error("Template engine must return an array of DOM nodes");
                    n = !1;
                    switch (f) {
                        case "replaceChildren":
                            a.e.P(b,
                                h);
                            n = !0;
                            break;
                        case "replaceNode":
                            a.a.eb(b, h);
                            n = !0;
                            break;
                        case "ignoreTargetNode":
                            break;
                        default:
                            throw Error("Unknown renderMode: " + f);
                    }
                    n && (c(h, k), l.afterRender && a.q.I(l.afterRender, null, [h, k.$data]));
                    return h
                }

                var g;
                a.Ba = function (b) {
                    if (b != q && !(b instanceof a.v))throw Error("templateEngine must inherit from ko.templateEngine");
                    g = b
                };
                a.za = function (b, c, h, k, l) {
                    h = h || {};
                    if ((h.templateEngine || g) == q)throw Error("Set a template engine before calling renderTemplate");
                    l = l || "replaceChildren";
                    if (k) {
                        var n = d(k);
                        return a.j(function () {
                            var g =
                                c && c instanceof a.A ? c : new a.A(a.a.c(c)), r = "function" == typeof b ? b(g.$data, g) : b, g = f(k, l, r, g, h);
                            "replaceNode" == l && (k = g, n = d(k))
                        }, null, {Qa: function () {
                            return!n || !a.a.aa(n)
                        }, $: n && "replaceNode" == l ? n.parentNode : n})
                    }
                    return a.s.va(function (d) {
                        a.za(b, c, h, d, "replaceNode")
                    })
                };
                a.Rb = function (b, d, g, k, l) {
                    function n(a, b) {
                        c(b, r);
                        g.afterRender && g.afterRender(b, a)
                    }

                    function p(c, d) {
                        r = l.createChildContext(a.a.c(c), g.as);
                        r.$index = d;
                        var k = "function" == typeof b ? b(c, r) : b;
                        return f(null, "ignoreTargetNode", k, r, g)
                    }

                    var r;
                    return a.j(function () {
                        var b =
                            a.a.c(d) || [];
                        "undefined" == typeof b.length && (b = [b]);
                        b = a.a.Y(b, function (b) {
                            return g.includeDestroyed || b === q || null === b || !a.a.c(b._destroy)
                        });
                        a.q.I(a.a.Aa, null, [k, b, p, g, n])
                    }, null, {$: k})
                };
                a.d.template = {init: function (b, c) {
                    var d = a.a.c(c());
                    "string" == typeof d || (d.name || 1 != b.nodeType && 8 != b.nodeType) || (d = 1 == b.nodeType ? b.childNodes : a.e.childNodes(b), d = a.a.Mb(d), (new a.l.Q(b)).nodes(d));
                    return{controlsDescendantBindings: !0}
                }, update: function (b, c, d, f, g) {
                    c = a.a.c(c());
                    d = {};
                    f = !0;
                    var n, p = null;
                    "string" != typeof c && (d =
                        c, c = a.a.c(d.name), "if"in d && (f = a.a.c(d["if"])), f && "ifnot"in d && (f = !a.a.c(d.ifnot)), n = a.a.c(d.data));
                    "foreach"in d ? p = a.Rb(c || b, f && d.foreach || [], d, b, g) : f ? (g = "data"in d ? g.createChildContext(n, d.as) : g, p = a.za(c || b, g, d, b)) : a.e.ba(b);
                    g = p;
                    (n = a.a.f.get(b, "__ko__templateComputedDomDataKey__")) && "function" == typeof n.B && n.B();
                    a.a.f.set(b, "__ko__templateComputedDomDataKey__", g && g.ta() ? g : q)
                }};
                a.g.S.template = function (b) {
                    b = a.g.da(b);
                    return 1 == b.length && b[0].unknown || a.g.Jb(b, "name") ? null : "This template engine does not support anonymous templates nested within its templates"
                };
                a.e.L.template = !0
            })();
            a.b("setTemplateEngine", a.Ba);
            a.b("renderTemplate", a.za);
            a.a.Pa = function () {
                function a(b, d, f, g, e) {
                    var m = Math.min, h = Math.max, k = [], l, n = b.length, p, r = d.length, q = r - n || 1, t = n + r + 1, s, v, w;
                    for (l = 0; l <= n; l++)for (v = s, k.push(s = []), w = m(r, l + q), p = h(0, l - 1); p <= w; p++)s[p] = p ? l ? b[l - 1] === d[p - 1] ? v[p - 1] : m(v[p] || t, s[p - 1] || t) + 1 : p + 1 : l + 1;
                    m = [];
                    h = [];
                    q = [];
                    l = n;
                    for (p = r; l || p;)r = k[l][p] - 1, p && r === k[l][p - 1] ? h.push(m[m.length] = {status: f, value: d[--p], index: p}) : l && r === k[l - 1][p] ? q.push(m[m.length] = {status: g, value: b[--l],
                        index: l}) : (m.push({status: "retained", value: d[--p]}), --l);
                    if (h.length && q.length) {
                        b = 10 * n;
                        var E;
                        for (d = f = 0; (e || d < b) && (E = h[f]); f++) {
                            for (g = 0; k = q[g]; g++)if (E.value === k.value) {
                                E.moved = k.index;
                                k.moved = E.index;
                                q.splice(g, 1);
                                d = g = 0;
                                break
                            }
                            d += g
                        }
                    }
                    return m.reverse()
                }

                return function (c, d, f) {
                    c = c || [];
                    d = d || [];
                    return c.length <= d.length ? a(c, d, "added", "deleted", f) : a(d, c, "deleted", "added", f)
                }
            }();
            a.b("utils.compareArrays", a.a.Pa);
            (function () {
                function b(b) {
                    for (; b.length && !a.a.aa(b[0]);)b.splice(0, 1);
                    if (1 < b.length) {
                        for (var c =
                            b[0], g = b[b.length - 1], e = [c]; c !== g;) {
                            c = c.nextSibling;
                            if (!c)return;
                            e.push(c)
                        }
                        Array.prototype.splice.apply(b, [0, b.length].concat(e))
                    }
                    return b
                }

                function c(c, f, g, e, m) {
                    var h = [];
                    c = a.j(function () {
                        var c = f(g, m, b(h)) || [];
                        0 < h.length && (a.a.eb(h, c), e && a.q.I(e, null, [g, c, m]));
                        h.splice(0, h.length);
                        a.a.R(h, c)
                    }, null, {$: c, Qa: function () {
                        return!a.a.pb(h)
                    }});
                    return{O: h, j: c.ta() ? c : q}
                }

                a.a.Aa = function (d, f, g, e, m) {
                    function h(a, c) {
                        u = n[c];
                        x !== c && (E[a] = u);
                        u.ra(x++);
                        b(u.O);
                        t.push(u);
                        w.push(u)
                    }

                    function k(b, c) {
                        if (b)for (var d = 0, e = c.length; d <
                            e; d++)c[d] && a.a.p(c[d].O, function (a) {
                            b(a, d, c[d].X)
                        })
                    }

                    f = f || [];
                    e = e || {};
                    var l = a.a.f.get(d, "setDomNodeChildrenFromArrayMapping_lastMappingResult") === q, n = a.a.f.get(d, "setDomNodeChildrenFromArrayMapping_lastMappingResult") || [], p = a.a.Z(n, function (a) {
                        return a.X
                    }), r = a.a.Pa(p, f, e.dontLimitMoves), t = [], s = 0, x = 0, v = [], w = [];
                    f = [];
                    for (var E = [], p = [], u, B = 0, y, A; y = r[B]; B++)switch (A = y.moved, y.status) {
                        case "deleted":
                            A === q && (u = n[s], u.j && u.j.B(), v.push.apply(v, b(u.O)), e.beforeRemove && (f[B] = u, w.push(u)));
                            s++;
                            break;
                        case "retained":
                            h(B,
                                s++);
                            break;
                        case "added":
                            A !== q ? h(B, A) : (u = {X: y.value, ra: a.m(x++)}, t.push(u), w.push(u), l || (p[B] = u))
                    }
                    k(e.beforeMove, E);
                    a.a.p(v, e.beforeRemove ? a.H : a.removeNode);
                    for (var B = 0, l = a.e.firstChild(d), C; u = w[B]; B++) {
                        u.O || a.a.extend(u, c(d, g, u.X, m, u.ra));
                        for (s = 0; r = u.O[s]; l = r.nextSibling, C = r, s++)r !== l && a.e.Va(d, r, C);
                        !u.Fb && m && (m(u.X, u.O, u.ra), u.Fb = !0)
                    }
                    k(e.beforeRemove, f);
                    k(e.afterMove, E);
                    k(e.afterAdd, p);
                    a.a.f.set(d, "setDomNodeChildrenFromArrayMapping_lastMappingResult", t)
                }
            })();
            a.b("utils.setDomNodeChildrenFromArrayMapping",
                a.a.Aa);
            a.D = function () {
                this.allowTemplateRewriting = !1
            };
            a.D.prototype = new a.v;
            a.D.prototype.renderTemplateSource = function (b) {
                var c = (9 > a.a.ca ? 0 : b.nodes) ? b.nodes() : null;
                if (c)return a.a.N(c.cloneNode(!0).childNodes);
                b = b.text();
                return a.a.xa(b)
            };
            a.D.sa = new a.D;
            a.Ba(a.D.sa);
            a.b("nativeTemplateEngine", a.D);
            (function () {
                a.ua = function () {
                    var a = this.Ib = function () {
                        if ("undefined" == typeof t || !t.tmpl)return 0;
                        try {
                            if (0 <= t.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2
                        } catch (a) {
                        }
                        return 1
                    }();
                    this.renderTemplateSource =
                        function (b, f, g) {
                            g = g || {};
                            if (2 > a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
                            var e = b.data("precompiled");
                            e || (e = b.text() || "", e = t.template(null, "{{ko_with $item.koBindingContext}}" + e + "{{/ko_with}}"), b.data("precompiled", e));
                            b = [f.$data];
                            f = t.extend({koBindingContext: f}, g.templateOptions);
                            f = t.tmpl(e, b, f);
                            f.appendTo(s.createElement("div"));
                            t.fragments = {};
                            return f
                        };
                    this.createJavaScriptEvaluatorBlock = function (a) {
                        return"{{ko_code ((function() { return " +
                            a + " })()) }}"
                    };
                    this.addTemplate = function (a, b) {
                        s.write("<script type='text/html' id='" + a + "'>" + b + "\x3c/script>")
                    };
                    0 < a && (t.tmpl.tag.ko_code = {open: "__.push($1 || '');"}, t.tmpl.tag.ko_with = {open: "with($1) {", close: "} "})
                };
                a.ua.prototype = new a.v;
                var b = new a.ua;
                0 < b.Ib && a.Ba(b);
                a.b("jqueryTmplTemplateEngine", a.ua)
            })()
        })
    })();
})();
!function ($) {
    $(function () {
        $.support.transition = (function () {
            var transitionEnd = (function () {
                var el = document.createElement("bootstrap"), transEndEventNames = {WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend"}, name;
                for (name in transEndEventNames) {
                    if (el.style[name] !== undefined) {
                        return transEndEventNames[name];
                    }
                }
            }());
            return transitionEnd && {end: transitionEnd};
        })();
    });
}(window.jQuery);
!function ($) {
    var Modal = function (element, options) {
        this.options = options;
        this.$element = $(element).delegate('[data-dismiss="modal"]', "click.dismiss.modal", $.proxy(this.hide, this));
        this.options.remote && this.$element.find(".modal-body").load(this.options.remote);
    };
    Modal.prototype = {constructor: Modal, toggle: function () {
        return this[!this.isShown ? "show" : "hide"]();
    }, show: function () {
        var that = this, e = $.Event("show");
        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented()) {
            return;
        }
        this.isShown = true;
        this.escape();
        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass("fade");
            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body);
            }
            that.$element.show();
            if (transition) {
                that.$element[0].offsetWidth;
            }
            that.$element.addClass("in").attr("aria-hidden", false);
            that.enforceFocus();
            transition ? that.$element.one($.support.transition.end, function () {
                that.$element.focus().trigger("shown");
            }) : that.$element.focus().trigger("shown");
        });
    }, hide: function (e) {
        e && e.preventDefault();
        var that = this;
        e = $.Event("hide");
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented()) {
            return;
        }
        this.isShown = false;
        this.escape();
        $(document).off("focusin.modal");
        this.$element.removeClass("in").attr("aria-hidden", true);
        $.support.transition && this.$element.hasClass("fade") ? this.hideWithTransition() : this.hideModal();
    }, enforceFocus: function () {
        var that = this;
        $(document).on("focusin.modal", function (e) {
            if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
                that.$element.focus();
            }
        });
    }, escape: function () {
        var that = this;
        if (this.isShown && this.options.keyboard) {
            this.$element.on("keyup.dismiss.modal", function (e) {
                e.which == 27 && that.hide();
            });
        } else {
            if (!this.isShown) {
                this.$element.off("keyup.dismiss.modal");
            }
        }
    }, hideWithTransition: function () {
        var that = this, timeout = setTimeout(function () {
            that.$element.off($.support.transition.end);
            that.hideModal();
        }, 500);
        this.$element.one($.support.transition.end, function () {
            clearTimeout(timeout);
            that.hideModal();
        });
    }, hideModal: function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.removeBackdrop();
            that.$element.trigger("hidden");
        });
    }, removeBackdrop: function () {
        this.$backdrop.remove();
        this.$backdrop = null;
    }, backdrop: function (callback) {
        var that = this, animate = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;
            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body);
            this.$backdrop.click(this.options.backdrop == "static" ? $.proxy(this.$element[0].focus, this.$element[0]) : $.proxy(this.hide, this));
            if (doAnimate) {
                this.$backdrop[0].offsetWidth;
            }
            this.$backdrop.addClass("in");
            if (!callback) {
                return;
            }
            doAnimate ? this.$backdrop.one($.support.transition.end, callback) : callback();
        } else {
            if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass("in");
                $.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one($.support.transition.end, callback) : callback();
            } else {
                if (callback) {
                    callback();
                }
            }
        }
    }};
    var old = $.fn.modal;
    $.fn.modal = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data("modal"), options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == "object" && option);
            if (!data) {
                $this.data("modal", (data = new Modal(this, options)));
            }
            if (typeof option == "string") {
                data[option]();
            } else {
                if (options.show) {
                    data.show();
                }
            }
        });
    };
    $.fn.modal.defaults = {backdrop: true, keyboard: true, show: true};
    $.fn.modal.Constructor = Modal;
    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this;
    };
    $(document).on("click.modal.data-api", '[data-toggle="modal"]', function (e) {
        var $this = $(this), href = $this.attr("href"), $target = $($this.attr("data-target") || (href && href.replace(/.*(?=#[^\s]+$)/, ""))), option = $target.data("modal") ? "toggle" : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());
        e.preventDefault();
        $target.modal(option).one("hide", function () {
            $this.focus();
        });
    });
}(window.jQuery);
!function ($) {
    var Collapse = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.collapse.defaults, options);
        if (this.options.parent) {
            this.$parent = $(this.options.parent);
        }
        this.options.toggle && this.toggle();
    };
    Collapse.prototype = {constructor: Collapse, dimension: function () {
        var hasWidth = this.$element.hasClass("width");
        return hasWidth ? "width" : "height";
    }, show: function () {
        var dimension, scroll, actives, hasData;
        if (this.transitioning || this.$element.hasClass("in")) {
            return;
        }
        dimension = this.dimension();
        scroll = $.camelCase(["scroll", dimension].join("-"));
        actives = this.$parent && this.$parent.find("> .accordion-group > .in");
        if (actives && actives.length) {
            hasData = actives.data("collapse");
            if (hasData && hasData.transitioning) {
                return;
            }
            actives.collapse("hide");
            hasData || actives.data("collapse", null);
        }
        this.$element[dimension](0);
        this.transition("addClass", $.Event("show"), "shown");
        $.support.transition && this.$element[dimension](this.$element[0][scroll]);
    }, hide: function () {
        var dimension;
        if (this.transitioning || !this.$element.hasClass("in")) {
            return;
        }
        dimension = this.dimension();
        this.reset(this.$element[dimension]());
        this.transition("removeClass", $.Event("hide"), "hidden");
        this.$element[dimension](0);
    }, reset: function (size) {
        var dimension = this.dimension();
        this.$element.removeClass("collapse")[dimension](size || "auto")[0].offsetWidth;
        this.$element[size !== null ? "addClass" : "removeClass"]("collapse");
        return this;
    }, transition: function (method, startEvent, completeEvent) {
        var that = this, complete = function () {
            if (startEvent.type == "show") {
                that.reset();
            }
            that.transitioning = 0;
            that.$element.trigger(completeEvent);
        };
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) {
            return;
        }
        this.transitioning = 1;
        this.$element[method]("in");
        $.support.transition && this.$element.hasClass("collapse") ? this.$element.one($.support.transition.end, complete) : complete();
    }, toggle: function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
    }};
    var old = $.fn.collapse;
    $.fn.collapse = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data("collapse"), options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == "object" && option);
            if (!data) {
                $this.data("collapse", (data = new Collapse(this, options)));
            }
            if (typeof option == "string") {
                data[option]();
            }
        });
    };
    $.fn.collapse.defaults = {toggle: true};
    $.fn.collapse.Constructor = Collapse;
    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old;
        return this;
    };
    $(document).on("click.collapse.data-api", "[data-toggle=collapse]", function (e) {
        var $this = $(this), href, target = $this.attr("data-target") || e.preventDefault() || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""), option = $(target).data("collapse") ? "toggle" : $this.data();
        $this[$(target).hasClass("in") ? "addClass" : "removeClass"]("collapsed");
        $(target).collapse(option);
    });
}(window.jQuery);
!function ($) {
    var Tooltip = function (element, options) {
        this.init("tooltip", element, options);
    };
    Tooltip.prototype = {constructor: Tooltip, init: function (type, element, options) {
        var eventIn, eventOut, triggers, trigger, i;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        this.enabled = true;
        triggers = this.options.trigger.split(" ");
        for (i = triggers.length; i--;) {
            trigger = triggers[i];
            if (trigger == "click") {
                this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this));
            } else {
                if (trigger != "manual") {
                    eventIn = trigger == "hover" ? "mouseenter" : "focus";
                    eventOut = trigger == "hover" ? "mouseleave" : "blur";
                    this.$element.on(eventIn + "." + this.type, this.options.selector, $.proxy(this.enter, this));
                    this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this));
                }
            }
        }
        this.options.selector ? (this._options = $.extend({}, this.options, {trigger: "manual", selector: ""})) : this.fixTitle();
    }, getOptions: function (options) {
        options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);
        if (options.delay && typeof options.delay == "number") {
            options.delay = {show: options.delay, hide: options.delay};
        }
        return options;
    }, enter: function (e) {
        var self = $(e.currentTarget)[this.type](this._options).data(this.type);
        if (!self.options.delay || !self.options.delay.show) {
            return self.show();
        }
        clearTimeout(this.timeout);
        self.hoverState = "in";
        this.timeout = setTimeout(function () {
            if (self.hoverState == "in") {
                self.show();
            }
        }, self.options.delay.show);
    }, leave: function (e) {
        var self = $(e.currentTarget)[this.type](this._options).data(this.type);
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (!self.options.delay || !self.options.delay.hide) {
            return self.hide();
        }
        self.hoverState = "out";
        this.timeout = setTimeout(function () {
            if (self.hoverState == "out") {
                self.hide();
            }
        }, self.options.delay.hide);
    }, show: function () {
        var $tip, pos, actualWidth, actualHeight, placement, tp, e = $.Event("show");
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return;
            }
            $tip = this.tip();
            this.setContent();
            if (this.options.animation) {
                $tip.addClass("fade");
            }
            placement = typeof this.options.placement == "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
            $tip.detach().css({top: 0, left: 0, display: "block"});
            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
            pos = this.getPosition();
            actualWidth = $tip[0].offsetWidth;
            actualHeight = $tip[0].offsetHeight;
            switch (placement) {
                case"bottom":
                    tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
                    break;
                case"top":
                    tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
                    break;
                case"left":
                    tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
                    break;
                case"right":
                    tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width};
                    break;
            }
            this.applyPlacement(tp, placement);
            this.$element.trigger("shown");
        }
    }, applyPlacement: function (offset, placement) {
        var $tip = this.tip(), width = $tip[0].offsetWidth, height = $tip[0].offsetHeight, actualWidth, actualHeight, delta, replace;
        $tip.offset(offset).addClass(placement).addClass("in");
        actualWidth = $tip[0].offsetWidth;
        actualHeight = $tip[0].offsetHeight;
        if (placement == "top" && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
            replace = true;
        }
        if (placement == "bottom" || placement == "top") {
            delta = 0;
            if (offset.left < 0) {
                delta = offset.left * -2;
                offset.left = 0;
                $tip.offset(offset);
                actualWidth = $tip[0].offsetWidth;
                actualHeight = $tip[0].offsetHeight;
            }
            this.replaceArrow(delta - width + actualWidth, actualWidth, "left");
        } else {
            this.replaceArrow(actualHeight - height, actualHeight, "top");
        }
        if (replace) {
            $tip.offset(offset);
        }
    }, replaceArrow: function (delta, dimension, position) {
        this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : "");
    }, setContent: function () {
        var $tip = this.tip(), title = this.getTitle();
        $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title);
        $tip.removeClass("fade in top bottom left right");
    }, hide: function () {
        var that = this, $tip = this.tip(), e = $.Event("hide");
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) {
            return;
        }
        $tip.removeClass("in");
        function removeWithAnimation() {
            var timeout = setTimeout(function () {
                $tip.off($.support.transition.end).detach();
            }, 500);
            $tip.one($.support.transition.end, function () {
                clearTimeout(timeout);
                $tip.detach();
            });
        }

        $.support.transition && this.$tip.hasClass("fade") ? removeWithAnimation() : $tip.detach();
        this.$element.trigger("hidden");
        return this;
    }, fixTitle: function () {
        var $e = this.$element;
        if ($e.attr("title") || typeof($e.attr("data-original-title")) != "string") {
            $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
        }
    }, hasContent: function () {
        return this.getTitle();
    }, getPosition: function () {
        var el = this.$element[0];
        return $.extend({}, (typeof el.getBoundingClientRect == "function") ? el.getBoundingClientRect() : {width: el.offsetWidth, height: el.offsetHeight}, this.$element.offset());
    }, getTitle: function () {
        var title, $e = this.$element, o = this.options;
        title = $e.attr("data-original-title") || (typeof o.title == "function" ? o.title.call($e[0]) : o.title);
        return title;
    }, tip: function () {
        return this.$tip = this.$tip || $(this.options.template);
    }, arrow: function () {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    }, validate: function () {
        if (!this.$element[0].parentNode) {
            this.hide();
            this.$element = null;
            this.options = null;
        }
    }, enable: function () {
        this.enabled = true;
    }, disable: function () {
        this.enabled = false;
    }, toggleEnabled: function () {
        this.enabled = !this.enabled;
    }, toggle: function (e) {
        var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this;
        self.tip().hasClass("in") ? self.hide() : self.show();
    }, destroy: function () {
        this.hide().$element.off("." + this.type).removeData(this.type);
    }};
    var old = $.fn.tooltip;
    $.fn.tooltip = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data("tooltip"), options = typeof option == "object" && option;
            if (!data) {
                $this.data("tooltip", (data = new Tooltip(this, options)));
            }
            if (typeof option == "string") {
                data[option]();
            }
        });
    };
    $.fn.tooltip.Constructor = Tooltip;
    $.fn.tooltip.defaults = {animation: true, placement: "top", selector: false, template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: false, container: false};
    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old;
        return this;
    };
}(window.jQuery);
!function ($) {
    var Popover = function (element, options) {
        this.init("popover", element, options);
    };
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {constructor: Popover, setContent: function () {
        var $tip = this.tip(), title = this.getTitle(), content = this.getContent();
        $tip.find(".popover-title")[this.options.html ? "html" : "text"](title);
        $tip.find(".popover-content")[this.options.html ? "html" : "text"](content);
        $tip.removeClass("fade top bottom left right in");
    }, hasContent: function () {
        return this.getTitle() || this.getContent();
    }, getContent: function () {
        var content, $e = this.$element, o = this.options;
        content = (typeof o.content == "function" ? o.content.call($e[0]) : o.content) || $e.attr("data-content");
        return content;
    }, tip: function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template);
        }
        return this.$tip;
    }, destroy: function () {
        this.hide().$element.off("." + this.type).removeData(this.type);
    }});
    var old = $.fn.popover;
    $.fn.popover = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data("popover"), options = typeof option == "object" && option;
            if (!data) {
                $this.data("popover", (data = new Popover(this, options)));
            }
            if (typeof option == "string") {
                data[option]();
            }
        });
    };
    $.fn.popover.Constructor = Popover;
    $.fn.popover.defaults = $.extend({}, $.fn.tooltip.defaults, {placement: "right", trigger: "click", content: "", template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'});
    $.fn.popover.noConflict = function () {
        $.fn.popover = old;
        return this;
    };
}(window.jQuery);
!function ($) {
    var Carousel = function (element, options) {
        this.$element = $(element);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = options;
        this.options.pause == "hover" && this.$element.on("mouseenter", $.proxy(this.pause, this)).on("mouseleave", $.proxy(this.cycle, this));
    };
    Carousel.prototype = {cycle: function (e) {
        if (!e) {
            this.paused = false;
        }
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));
        return this;
    }, getActiveIndex: function () {
        this.$active = this.$element.find(".item.active");
        this.$items = this.$active.parent().children();
        return this.$items.index(this.$active);
    }, to: function (pos) {
        var activeIndex = this.getActiveIndex(), that = this;
        if (pos > (this.$items.length - 1) || pos < 0) {
            return;
        }
        if (this.sliding) {
            return this.$element.one("slid", function () {
                that.to(pos);
            });
        }
        if (activeIndex == pos) {
            return this.pause().cycle();
        }
        return this.slide(pos > activeIndex ? "next" : "prev", $(this.$items[pos]));
    }, pause: function (e) {
        if (!e) {
            this.paused = true;
        }
        if (this.$element.find(".next, .prev").length && $.support.transition.end) {
            this.$element.trigger($.support.transition.end);
            this.cycle();
        }
        clearInterval(this.interval);
        this.interval = null;
        return this;
    }, next: function () {
        if (this.sliding) {
            return;
        }
        return this.slide("next");
    }, prev: function () {
        if (this.sliding) {
            return;
        }
        return this.slide("prev");
    }, slide: function (type, next) {
        var $active = this.$element.find(".item.active"), $next = next || $active[type](), isCycling = this.interval, direction = type == "next" ? "left" : "right", fallback = type == "next" ? "first" : "last", that = this, e;
        this.sliding = true;
        isCycling && this.pause();
        $next = $next.length ? $next : this.$element.find(".item")[fallback]();
        e = $.Event("slide", {relatedTarget: $next[0], direction: direction});
        if ($next.hasClass("active")) {
            return;
        }
        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            this.$element.one("slid", function () {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()]);
                $nextIndicator && $nextIndicator.addClass("active");
            });
        }
        if ($.support.transition && this.$element.hasClass("slide")) {
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return;
            }
            $next.addClass(type);
            $next[0].offsetWidth;
            $active.addClass(direction);
            $next.addClass(direction);
            this.$element.one($.support.transition.end, function () {
                $next.removeClass([type, direction].join(" ")).addClass("active");
                $active.removeClass(["active", direction].join(" "));
                that.sliding = false;
                setTimeout(function () {
                    that.$element.trigger("slid");
                }, 0);
            });
        } else {
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) {
                return;
            }
            $active.removeClass("active");
            $next.addClass("active");
            this.sliding = false;
            this.$element.trigger("slid");
        }
        isCycling && this.cycle();
        return this;
    }};
    var old = $.fn.carousel;
    $.fn.carousel = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data("carousel"), options = $.extend({}, $.fn.carousel.defaults, typeof option == "object" && option), action = typeof option == "string" ? option : options.slide;
            if (!data) {
                $this.data("carousel", (data = new Carousel(this, options)));
            }
            if (typeof option == "number") {
                data.to(option);
            } else {
                if (action) {
                    data[action]();
                } else {
                    if (options.interval) {
                        data.pause().cycle();
                    }
                }
            }
        });
    };
    $.fn.carousel.defaults = {interval: 5000, pause: "hover"};
    $.fn.carousel.Constructor = Carousel;
    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old;
        return this;
    };
    $(document).on("click.carousel.data-api", "[data-slide], [data-slide-to]", function (e) {
        var $this = $(this), href, $target = $($this.attr("data-target") || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "")), options = $.extend({}, $target.data(), $this.data()), slideIndex;
        $target.carousel(options);
        if (slideIndex = $this.attr("data-slide-to")) {
            $target.data("carousel").pause().to(slideIndex).cycle();
        }
        e.preventDefault();
    });
}(window.jQuery);
!function ($) {
    var Button = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.button.defaults, options);
    };
    Button.prototype.setState = function (state) {
        var d = "disabled", $el = this.$element, data = $el.data(), val = $el.is("input") ? "val" : "html";
        state = state + "Text";
        data.resetText || $el.data("resetText", $el[val]());
        $el[val](data[state] || this.options[state]);
        setTimeout(function () {
            state == "loadingText" ? $el.addClass(d).attr(d, d) : $el.removeClass(d).removeAttr(d);
        }, 0);
    };
    Button.prototype.toggle = function () {
        var $parent = this.$element.closest('[data-toggle="buttons-radio"]');
        $parent && $parent.find(".active").removeClass("active");
        this.$element.toggleClass("active");
    };
    var old = $.fn.button;
    $.fn.button = function (option) {
        return this.each(function () {
            var $this = $(this), data = $this.data("button"), options = typeof option == "object" && option;
            if (!data) {
                $this.data("button", (data = new Button(this, options)));
            }
            if (option == "toggle") {
                data.toggle();
            } else {
                if (option) {
                    data.setState(option);
                }
            }
        });
    };
    $.fn.button.defaults = {loadingText: "loading..."};
    $.fn.button.Constructor = Button;
    $.fn.button.noConflict = function () {
        $.fn.button = old;
        return this;
    };
    $(document).on("click.button.data-api", "[data-toggle^=button]", function (e) {
        var $btn = $(e.target);
        if (!$btn.hasClass("btn")) {
            $btn = $btn.closest(".btn");
        }
        $btn.button("toggle");
    });
}(window.jQuery);// Generated by CoffeeScript 1.6.1
(function () {
    $($(window).load(function () {
        $("#loading").addClass("hide");
        $(".page").addClass("zoom-transit");
        if (!$("#grimoire_page").is(":visible"))return $("#main_menu").removeClass("escamoted")
    }), $("html").hasClass("ie") ? void 0 : $(".if-ie").remove(), $("#newsletter").modal({show: !1}), $(".collapse").collapse({toggle: !1}), $("#reveal_brochure").click(function () {
        var e, t;
        e = $("#brochures").offset();
        t = e.top;
        return $(document).scrollTop(t)
    }))
}).call(this);
/*! pager.js - v1.0.1 - 2013-07-06
 * http://oscar.finnsson.nu/pagerjs/
 * Copyright (c) 2013 Oscar Finnsson; Licensed MIT */
(function (e) {
    var t = function (t, n) {
        "use strict";
        var r = function (e, t) {
            return function () {
                var r = arguments;
                return n.computed(function () {
                    return e.apply(t, r)
                })
            }
        }, i = {};
        i.page = null, i.now = function () {
            return Date.now ? Date.now() : (new Date).valueOf()
        }, i.extendWithPage = function (e) {
            var t = new i.Page;
            e.$__page__ = t, i.page = t, i.activePage$ = r(i.getActivePage, i)()
        };
        var s = function (e, t, n) {
            n = n || {}, n.page = e, i[t].fire(n), e.val(t) && e.val(t)(n)
        };
        t.each(["onBindingError", "onSourceError", "onNoMatch", "onMatch", "beforeRemove", "afterRemove", "beforeHide", "afterHide", "beforeShow", "afterShow"], function (e, n) {
            i[n] = t.Callbacks()
        }), i.showChild = function (e) {
            var t = e && e.length === 1 && e[0] === "" ? [] : e;
            i.page.showPage(t)
        }, i.getParentPage = function (e) {
            while (e) {
                if (e.$page && e.$page.val("urlToggle") !== "none")return e.$page;
                if (e.$data && e.$data.$__page__)return e.$data.$__page__;
                e = e.$parentContext
            }
            return null
        };
        var o = null, u = null, a = function (e) {
            u && u.reject({cancel: !0}), o = null, e.substring(0, i.Href.hash.length) === i.Href.hash && (e = e.slice(i.Href.hash.length));
            var t = f(e);
            i.showChild(t)
        };
        i.goTo = a, i.navigate = function (e) {
            i.useHTML5history ? i.Href5.history.pushState(null, null, e) : location.hash = e
        };
        var f = function (e) {
            return t.map(e.replace(/\+/g, " ").split("/"), decodeURIComponent)
        }, l = {};
        l.value = n.utils.unwrapObservable, l.arrayValue = function (e) {
            return t.map(e, function (e) {
                return l.value(e)
            })
        };
        var c = function (e) {
            var t, n = {}, r = /([^&=]+)=?([^&]*)/g;
            while (t = r.exec(e))n[t[1]] = t[2];
            return n
        }, h = function (e) {
            if (!e)return{name: null, params: {}};
            var t = e.split("?"), n = t[0], r = t[1], i = {};
            return r && (i = c(r)), {name: n, params: i}
        };
        i.ChildManager = function (e, r) {
            this.currentChildO = n.observable(null);
            var o = this;
            this.page = r, this.timeStamp = i.now(), this.hideChild = function () {
                var e = o.currentChildO();
                e && (e.isStartPage() || (e.hidePage(function () {
                }), o.currentChildO(null)))
            }, this.showChild = function (n) {
                var r = n.length === 0;
                this.timeStamp = i.now();
                var u = this.timeStamp, a = o.currentChildO(), f = null, c = !1, p = h(n[0]), d = p.name, v = null;
                t.each(e(), function (e, t) {
                    if (!c) {
                        var n = t.getId();
                        if (n === d || (d === "" || d == null) && t.isStartPage())c = !0, f = t;
                        n === "?" && (v = t)
                    }
                });
                var m = !1, g = o, y = function (e, t) {
                    if (!c) {
                        var n = t.getId(), r = t.getValue().modal;
                        if (r) {
                            if (n === d || (d === "" || d == null) && t.isStartPage())c = !0, f = t, m = !0;
                            n === "?" && !v && (v = t, m = !0)
                        }
                    }
                };
                while (!f && g.page.parentPage && !g.page.getValue().modal) {
                    var b = g.page.parentPage.children;
                    t.each(b(), y), f || (g = g.page.parentPage.childManager)
                }
                !f && v && !r && (f = v), o.currentChildO(f), f && (m ? f.currentParentPage(o.page) : f.currentParentPage(null));
                var w = function () {
                    s(o.page, "onNoMatch", {route: n})
                }, E = function () {
                    s(o.page, "onMatch", {route: n});
                    var e = l.value(f.getValue().guard);
                    e ? e(f, n, function () {
                        o.timeStamp === u && f.showPage(n.slice(1), p, n[0])
                    }, a) : f.showPage(n.slice(1), p, n[0])
                };
                a && a === f ? E() : a ? a.hidePage(function () {
                    f ? E() : w()
                }) : f ? E() : w()
            }
        }, i.Page = function (e, t, r, s, o) {
            this.element = e, this.valueAccessor = t, this.allBindingsAccessor = r, this.viewModel = s, this.bindingContext = o, this.children = n.observableArray([]), this.childManager = new i.ChildManager(this.children, this), this.parentPage = null, this.currentId = null, this.getCurrentId = n.observable(), this.ctx = null, this.currentParentPage = n.observable(null), this.isVisible = n.observable(!1), this.originalRoute = n.observable(null), this.route = null
        };
        var p = i.Page.prototype;
        p.val = function (e) {
            return l.value(this.getValue()[e])
        }, p.currentChildPage = function () {
            return this.childManager.currentChildO
        }, p.find = function (e) {
            var n = l.value(e), r = this;
            if (n.substring(0, 1) === "/")r = i.page, n = n.slice(1); else while (n.substring(0, 3) === "../")r = r.currentParentPage && r.currentParentPage() ? r.currentParentPage() : r.parentPage, n = n.slice(3);
            var s = f(n);
            return t.each(s, function (e, t) {
                r = r.child(t)()
            }), r
        }, p.find$ = function (e) {
            return r(this.find, this)(e)
        };
        var d = function (e) {
            return i.useHTML5history ? t("base").attr("href") + e : i.Href.hash + e
        };
        p.path = function (e) {
            var n = this, r = l.value(e);
            if (r && typeof r == "object" && r.path && r.params && !(r instanceof i.Page)) {
                var s = r.path, o = r.params;
                return n.path(s) + "?" + t.param(o)
            }
            var u;
            if (r == null || r === "")u = n; else {
                if (!(r instanceof i.Page)) {
                    if (r.substring(0, 1) === "/") {
                        var a = i.page.getFullRoute()().join("/") + r.substring(1);
                        return d(a)
                    }
                    var f = 0;
                    while (r.substring(0, 3) === "../")f++, r = r.slice(3);
                    var c = n.getFullRoute()(), h = c.slice(0, c.length - f).join("/"), p = (h === "" ? "" : h + "/") + r;
                    return d(p)
                }
                u = r
            }
            return d(u.getFullRoute()().join("/"))
        }, p.path$ = function (e) {
            return r(this.path, this)(e)
        }, p.async = function (e, t, n, r) {
            var s = this;
            return function () {
                u && u.reject({cancel: !0});
                var a = e();
                u = a, r && r(a.state());
                var f = Math.random();
                o = f, a.done(function () {
                    r && r(a.state()), f === o && i.navigate(s.path(t))
                }), a.fail(function (e) {
                    r && r(a.state());
                    var t = e && e.cancel;
                    f === o && !t && n && i.navigate(s.path(n))
                })
            }
        }, p.showPage = function (e, t, n) {
            var r = this, i = r.currentId, s = r.pageRoute ? r.pageRoute.params : null, o = r.isVisible();
            r.currentId = t ? t.name || "" : "", r.getCurrentId(r.currentId), r.isVisible(!0), n && r.originalRoute(n), r.route = e, r.pageRoute = t, o ? (r.getId() === "?" && i !== r.currentId && r.show(), t && s !== t.params && r.setParams()) : (r.setParams(), r.show()), r.childManager.showChild(e)
        }, p.setParams = function () {
            if (this.pageRoute && this.pageRoute.params) {
                var e = this.pageRoute.params, r = this.ctx, i = this.val("params") || {};
                t.isArray(i) ? t.each(i, function (t, i) {
                    var s = e[i];
                    r[i] ? r[i](s) : r[i] = n.observable(s)
                }) : t.each(i, function (t, i) {
                    var s = e[t], o;
                    s == null ? o = l.value(i) : o = s, r[t] ? r[t](o) : r[t] = n.observable(o)
                })
            }
            if (this.pageRoute) {
                var s = this.getValue().nameParam;
                s && (typeof s == "string" ? this.ctx[s] ? this.ctx[s](this.currentId) : this.ctx[s] = n.observable(this.currentId) : s(this.currentId))
            }
        }, p.hidePage = function (e) {
            var t = this;
            "show" !== t.val("urlToggle") ? (t.hideElementWrapper(e), t.childManager.hideChild()) : e && e()
        };
        var v = function (e) {
            try {
                n.applyBindingsToDescendants(e.childBindingContext, e.element)
            } catch (t) {
                s(e, "onBindingError", {error: t})
            }
        };
        p.init = function () {
            var e = this, r = e.val("urlToggle"), i = e.val("id");
            i !== "?" && e.getCurrentId(i);
            var o = n.utils.domData.get(e.element, "__ko_pagerjsBindingData");
            if (o)return{controlsDescendantBindings: !0};
            n.utils.domData.set(e.element, "__ko_pagerjsBindingData", e), n.utils.domNodeDisposal.addDisposeCallback(e.element, function () {
                s(e, "beforeRemove"), e.parentPage && e.parentPage.children.remove(e), s(e, "afterRemove")
            });
            var u = e.getValue();
            r !== "none" && (e.parentPage = e.getParentPage(), e.parentPage.children.push(this), e.hideElement()), e.val("source") && e.loadSource(e.val("source")), e.ctx = null;
            if (u.withOnShow)e.ctx = {}, e.childBindingContext = e.bindingContext.createChildContext(e.ctx), n.utils.extend(e.childBindingContext, {$page: this}); else {
                var a = u["with"] || e.bindingContext.$observableData || e.viewModel;
                e.ctx = l.value(a), e.augmentContext();
                if (n.isObservable(a)) {
                    var f = n.observable(e.ctx);
                    e.childBindingContext = e.bindingContext.createChildContext(f), n.utils.extend(e.childBindingContext, {$page: this, $observableData: a}), v(e), a.subscribe(function () {
                        f(l.value(a))
                    })
                } else e.childBindingContext = e.bindingContext.createChildContext(e.ctx), n.utils.extend(e.childBindingContext, {$page: this, $observableData: undefined}), v(e)
            }
            if (r !== "none") {
                var c = e.parentPage;
                c.route && (c.route[0] === e.getId() || c.route.length && e.getId() === "?") && setTimeout(function () {
                    c.showPage(c.route)
                }, 0)
            } else {
                var h = function () {
                    t(e.element).is(":visible") && e.showPage([])
                };
                setTimeout(h, 0), e.getParentPage().isVisible.subscribe(function (e) {
                    e && setTimeout(h, 0)
                })
            }
            var p = e.getValue().bind;
            return n.isObservable(p) && p(e), {controlsDescendantBindings: !0}
        }, p.augmentContext = function () {
            var e = this, r = e.val("params");
            r && (t.isArray(r) ? t.each(r, function (t, r) {
                e.ctx[r] || (e.ctx[r] = n.observable())
            }) : t.each(r, function (t, i) {
                e.ctx[t] || (n.isObservable(i) ? e.ctx[t] = i : i === null ? (r[t] = n.observable(null), e.ctx[t] = n.observable(null)) : e.ctx[t] = n.observable(i))
            })), this.val("vars") && t.each(this.val("vars"), function (t, r) {
                n.isObservable(r) ? e.ctx[t] = r : e.ctx[t] = n.observable(r)
            });
            var i = this.getValue().nameParam;
            i && typeof i == "string" && (e.ctx[i] = n.observable(null)), this.setParams()
        }, p.getValue = function () {
            return this.valueAccessor ? l.value(this.valueAccessor()) : {}
        }, p.getParentPage = function () {
            return i.getParentPage(this.bindingContext)
        }, p.getId = function () {
            return this.val("id")
        }, p.id = function () {
            var e = this.getCurrentId();
            return e == null || e === "" ? this.getId() : e
        }, p.sourceUrl = function (e) {
            var t = this;
            return this.getId() === "?" ? n.computed(function () {
                var n;
                return t.val("deep") ? n = [t.currentId].concat(t.route).join("/") : n = t.currentId, l.value(e).replace("{1}", n)
            }) : n.computed(function () {
                return l.value(e)
            })
        }, p.loadWithOnShow = function () {
            var e = this;
            if (!e.withOnShowLoaded || e.val("sourceCache") !== !0)e.withOnShowLoaded = !0, e.val("withOnShow")(function (t) {
                var r = e.bindingContext.createChildContext(t);
                e.ctx = t, e.childBindingContext = r, e.augmentContext(), n.utils.extend(r, {$page: e}), v(e), e.route && e.childManager.showChild(e.route)
            }, e)
        }, p.loadSource = function (e) {
            var r = this.getValue(), s = this, o = this.element, u = null, a = r.loader || i.loader;
            if (r.frame === "iframe") {
                var f = t("iframe", t(o));
                f.length === 0 && (f = t("<iframe></iframe>"), t(o).append(f)), a && (u = l.value(a)(s, f), u.load()), f.one("load", function () {
                    u && u.unload(), r.sourceLoaded && r.sourceLoaded(s)
                }), n.applyBindingsToNode(f[0], {attr: {src: this.sourceUrl(e)}})
            } else {
                a && (u = l.value(a)(s, s.element), u.load());
                var c = function () {
                    u && u.unload(), s.val("withOnShow") ? s.val("withOnShow") && s.loadWithOnShow() : v(s), r.sourceLoaded && r.sourceLoaded(s), s.route && s.childManager.showChild(s.route)
                };
                if (typeof l.value(e) == "string") {
                    var h = l.value(this.sourceUrl(e));
                    g(o, h, function () {
                        c()
                    }, s)
                } else {
                    var p = t(o).children();
                    l.value(e)(this, function () {
                        t.each(p, function (e, t) {
                            n.utils.domNodeDisposal.removeNode(t)
                        }), c()
                    })
                }
            }
        };
        var m = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, g = function (e, r, i, o) {
            var u, a, f = t(e), l = r.indexOf(" ");
            l >= 0 && (u = r.slice(l, r.length), r = r.slice(0, l));
            var c = jQuery.ajax({url: r, type: "GET", dataType: "html", complete: function (e, t) {
                i && f.each(i, a || [e.responseText, t, e])
            }}).done(function (e) {
                a = arguments, t.each(f.children(), function (e, t) {
                    n.utils.domNodeDisposal.removeNode(t)
                }), f.html(u ? jQuery("<div>").append(e.replace(m, "")).find(u) : e)
            });
            return c.fail(function () {
                s(o, "onSourceError", {url: r, xhrPromise: c})
            }), f
        };
        p.show = function (t) {
            var n = this.element, r = this;
            r.showElementWrapper(t), r.val("title") && (e.document.title = r.val("title"));
            if (r.val("sourceOnShow")) {
                if (!r.val("sourceCache") || !n.__pagerLoaded__ || typeof r.val("sourceCache") == "number" && n.__pagerLoaded__ + r.val("sourceCache") * 1e3 < i.now())n.__pagerLoaded__ = i.now(), r.loadSource(r.val("sourceOnShow"))
            } else r.val("withOnShow") && r.loadWithOnShow()
        }, p.titleOrId = function () {
            return this.val("title") || this.id()
        }, p.showElementWrapper = function (e) {
            var t = this;
            s(t, "beforeShow"), t.showElement(e), t.val("scrollToTop") && t.element.scrollIntoView(), s(t, "afterShow")
        }, p.showElement = function (e) {
            this.val("showElement") ? this.val("showElement")(this, e) : this.val("fx") ? i.fx[this.val("fx")].showElement(this, e) : i.showElement ? i.showElement(this, e) : t(this.element).show(e)
        }, p.hideElementWrapper = function (e) {
            this.isVisible(!1), s(this, "beforeHide"), this.hideElement(e), s(this, "afterHide")
        }, p.hideElement = function (e) {
            this.val("hideElement") ? this.val("hideElement")(this, e) : this.val("fx") ? i.fx[this.val("fx")].hideElement(this, e) : i.hideElement ? i.hideElement(this, e) : (t(this.element).hide(), e && e())
        }, p.getFullRoute = function () {
            return this._fullRoute ? this._fullRoute : (this._fullRoute = n.computed(function () {
                var e = null;
                return this.currentParentPage && this.currentParentPage() ? (e = this.currentParentPage().getFullRoute()().slice(0), e.push(this.originalRoute() || this.getId()), e) : this.parentPage ? (e = this.parentPage.getFullRoute()().slice(0), e.push(this.originalRoute() || this.getId()), e) : []
            }, this), this._fullRoute)
        }, p.getRole = function () {
            return this.val("role") || "next"
        }, p.isStartPage = function () {
            return this.getId() === "start" || this.getRole() === "start"
        }, p.nullObject = new i.Page, p.nullObject.children = n.observableArray([]), p.child = function (e) {
            var r = this;
            return r._child == null && (r._child = {}), r._child[e] || (r._child[e] = n.computed(function () {
                var n = t.grep(this.children(), function (t) {
                    return t.id() === e
                })[0];
                return n || this.nullObject
            }, this)), r._child[e]
        }, i.getActivePage = function () {
            var e = i.page;
            while (e.currentChildPage()() != null)e = e.currentChildPage()();
            return e
        }, n.bindingHandlers.page = {init: function (e, t, n, r, s) {
            var o = null;
            return l.value(t())instanceof i.Page ? (o = l.value(t()), o.element = e, o.allBindingsAccessor == null && (o.allBindingsAccessor = n), o.viewModel == null && (o.viewModel = r), o.bindingContext == null && (o.bindingContext = s)) : o = new i.Page(e, t, n, r, s), o.init()
        }}, i.useHTML5history = !1, i.rootURI = "/", i.Href = function (e, t, r, i, s) {
            this.element = e, this.bindingContext = s, this.path = n.observable(), this.pageOrRelativePath = n.observable(t)
        };
        var y = i.Href.prototype;
        return y.getParentPage = function () {
            return i.getParentPage(this.bindingContext)
        }, y.init = function () {
            var e = this, t = e.getParentPage();
            e.path = n.computed(function () {
                var n = l.value(e.pageOrRelativePath()());
                return t.path(n)
            })
        }, i.Href.hash = "#", y.bind = function () {
            n.applyBindingsToNode(this.element, {attr: {href: this.path}})
        }, y.update = function (e) {
            this.pageOrRelativePath(e)
        }, i.Href5 = function (e, t, n, r, s) {
            i.Href.apply(this, arguments)
        }, i.Href5.prototype = new i.Href, i.Href5.history = e.History, i.Href5.prototype.bind = function () {
            var e = this;
            n.applyBindingsToNode(e.element, {attr: {href: e.path}, click: function () {
                var n = e.path();
                if (n === "" || n === "/")n = t("base").attr("href");
                i.Href5.history.pushState(null, null, n)
            }})
        }, n.bindingHandlers["page-href"] = {init: function (e, t, n, r, s) {
            var o = i.useHTML5history ? i.Href5 : i.Href, u = new o(e, t, n, r, s);
            u.init(), u.bind(), e.__ko__page = u
        }, update: function (e, t) {
            e.__ko__page.update(t)
        }}, i.fx = {}, i.fx.cssAsync = function (e) {
            return{showElement: function (n, r) {
                var i = t(n.element);
                i.addClass(e), i.show();
                var s = setInterval(function () {
                    clearInterval(s), i.addClass(e + "-in")
                }, 10), o = setInterval(function () {
                    clearInterval(o), r && r()
                }, 300)
            }, hideElement: function (n, r) {
                var i = t(n.element);
                if (!n.pageHiddenOnce)n.pageHiddenOnce = !0, i.hide(); else {
                    i.removeClass(e + "-in");
                    var s = setInterval(function () {
                        clearInterval(s), r && r(), i.hide()
                    }, 300)
                }
            }}
        }, i.fx.zoom = i.fx.cssAsync("pagerjs-fx-zoom"), i.fx.flip = i.fx.cssAsync("pagerjs-fx-flip"), i.fx.popout = i.fx.cssAsync("pagerjs-fx-popout-modal"), i.fx.jQuerySync = function (e, n) {
            return{showElement: function (n, r) {
                e.call(t(n.element), 300, r)
            }, hideElement: function (e, r) {
                n.call(t(e.element), 300, function () {
                    t(e.element).hide()
                }), r && r()
            }}
        }, i.fx.slide = i.fx.jQuerySync(t.fn.slideDown, t.fn.slideUp), i.fx.fade = i.fx.jQuerySync(t.fn.fadeIn, t.fn.fadeOut), i.startHistoryJs = function (t) {
            var n = typeof t == "string" ? t : null;
            n && i.Href5.history.pushState(null, null, n), i.Href5.history.Adapter.bind(e, "statechange", function () {
                var e = i.Href5.history.getState().url.replace(i.Href5.history.getBaseUrl(), "");
                a(e)
            }), i.Href5.history.Adapter.bind(e, "anchorchange", function () {
                a(location.hash)
            }), (!t || !t.noGo) && a(i.Href5.history.getState().url.replace(i.Href5.history.getBaseUrl(), ""))
        }, i.start = function (n) {
            var r = typeof n == "string" ? n : null;
            r && (e.location.hash = i.Href.hash + r);
            var s = function () {
                a(e.location.hash)
            };
            t(e).bind("hashchange", s), (!n || !n.noGo) && s()
        }, i
    }, n = e.define;
    typeof n == "function" && typeof n.amd == "object" && n.amd ? n("pager", ["knockout", "jquery"], function (e) {
        return t($, e)
    }) : e.pager = t($, ko)
})(window);
/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function ($, e, b) {
    var c = "hashchange", h = document, f, g = $.event.special, i = h.documentMode, d = "on" + c in e && (i === b || i > 7);

    function a(j) {
        j = j || location.href;
        return"#" + j.replace(/^[^#]*#?(.*)$/, "$1")
    }

    $.fn[c] = function (j) {
        return j ? this.bind(c, j) : this.trigger(c)
    };
    $.fn[c].delay = 50;
    g[c] = $.extend(g[c], {setup: function () {
        if (d) {
            return false
        }
        $(f.start)
    }, teardown: function () {
        if (d) {
            return false
        }
        $(f.stop)
    }});
    f = (function () {
        var j = {}, p, m = a(), k = function (q) {
            return q
        }, l = k, o = k;
        j.start = function () {
            p || n()
        };
        j.stop = function () {
            p && clearTimeout(p);
            p = b
        };
        function n() {
            var r = a(), q = o(m);
            if (r !== m) {
                l(m = r, q);
                $(e).trigger(c)
            } else {
                if (q !== m) {
                    location.href = location.href.replace(/#.*/, "") + q
                }
            }
            p = setTimeout(n, $.fn[c].delay)
        }

        $.browser.msie && !d && (function () {
            var q, r;
            j.start = function () {
                if (!q) {
                    r = $.fn[c].src;
                    r = r && r + a();
                    q = $('<iframe tabindex="-1" title="empty"/>').hide().one("load",function () {
                        r || l(a());
                        n()
                    }).attr("src", r || "javascript:0").insertAfter("body")[0].contentWindow;
                    h.onpropertychange = function () {
                        try {
                            if (event.propertyName === "title") {
                                q.document.title = h.title
                            }
                        } catch (s) {
                        }
                    }
                }
            };
            j.stop = k;
            o = function () {
                return a(q.location.href)
            };
            l = function (v, s) {
                var u = q.document, t = $.fn[c].domain;
                if (v !== s) {
                    u.title = h.title;
                    u.open();
                    t && u.write('<script>document.domain="' + t + '"<\/script>');
                    u.close();
                    q.location.hash = v
                }
            }
        })();
        return j
    })()
})(jQuery, this);
/*!
 * Fresco - A Beautiful Responsive Lightbox - v1.1.2
 * (c) 2012 Nick Stakenburg
 *
 * http://www.frescojs.com
 *
 * License: http://www.frescojs.com/license
 */
;
var Fresco = {
    version: '1.1.2'
};

Fresco.skins = {
    // Don't modify! Its recommended to use custom skins for customization,
    // see: http://www.frescojs.com/documentation/skins
    'base': {
        effects: {
            content: { show: 0, hide: 0, sync: true },
            loading: { show: 0, hide: 300, delay: 250 },
            thumbnails: { show: 200, slide: 0, load: 300, delay: 250 },
            window: { show: 440, hide: 300, position: 180 },
            ui: { show: 250, hide: 200, delay: 3000 }
        },
        touchEffects: {
            ui: { show: 175, hide: 175, delay: 5000 }
        },
        fit: 'both',
        keyboard: {
            left: true,
            right: true,
            esc: true
        },
        loop: false,
        onClick: 'previous-next',
        overlay: { close: true },
        position: false,
        preload: true,
        spacing: {
            both: { horizontal: 20, vertical: 20 },
            width: { horizontal: 0, vertical: 0 },
            height: { horizontal: 0, vertical: 0 },
            none: { horizontal: 0, vertical: 0 }
        },
        thumbnails: true,
        ui: 'outside',
        vimeo: {
            autoplay: 1,
            title: 1,
            byline: 1,
            portrait: 0,
            loop: 0
        },
        youtube: {
            autoplay: 1,
            controls: 1,
            enablejsapi: 1,
            hd: 1,
            iv_load_policy: 3,
            loop: 0,
            modestbranding: 1,
            rel: 0
        },

        initialTypeOptions: {
            'image': { },
            'youtube': {
                width: 640,
                height: 360
            },
            'vimeo': {
                width: 640,
                height: 360
            }
        }
    },

    // reserved for resetting options on the base skin
    'reset': { },

    // the default skin
    'fresco': { },

    // IE6 fallback skin
    'IE6': { }
};

eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return(c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--)r[e(c)] = k[c] || e(c);
        k = [function (e) {
            return r[e]
        }];
        e = function () {
            return'\\w+'
        };
        c = 1
    }
    ;
    while (c--)if (k[c])p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('(D($){D 17(a){E b={};2f(E c 4n a)b[c]=a[c]+"17";M b}D 7V(a){M 6g.7W.2g(6g,a.3N(","))}D 4o(a){15.5b&&5b[5b.4o?"4o":"7X"](a)}D 4p(a,b){2f(E c 4n b)b[c]&&b[c].6h&&b[c].6h===7Y?(a[c]=$.13({},a[c])||{},4p(a[c],b[c])):a[c]=b[c];M a}D 2S(a,b){M 4p($.13({},a),b)}D 5c(){C.1n.2g(C,t.1W(1x))}D 3x(){C.1n.2g(C,t.1W(1x))}D 5d(){C.1n.2g(C,t.1W(1x))}D 5e(){C.1n.2g(C,t.1W(1x))}D 5f(){C.1n.2g(C,t.1W(1x))}D 3y(){C.1n.2g(C,t.1W(1x))}D 5g(){C.1n.2g(C,t.1W(1x))}D 4q(a){E b={V:"1o"};M $.1c(B,D(c,d){E e=d.1e(a);e&&(b=e,b.V=c,b.1p=a)}),b}D 4r(a){E b=(a||"").7Z(/\\?.*/g,"").5h(/\\.([^.]{3,4})$/);M b?b[1].5i():1i}(D(){D a(a){E b;R(a.2T.6i?b=a.2T.6i/80:a.2T.6j&&(b=-a.2T.6j/3),b){E c=$.81("1C:4s");$(a.2U).82(c,b),c.83()&&a.2a(),c.84()&&a.2V()}}$(24.3O).1y("4s 85",a)})();E t=86.2q.87,2h={4t:D(a){M a&&a.6k==1},P:{88:D(){D a(a){E b=a;4u(b&&b.6l)b=b.6l;M b}M D(b){E c=a(b);M!(!c||!c.3P)}}()}},Y=D(a){D b(b){E c=89(b+"([\\\\d.]+)").4v(a);M c?5j(c[1]):!0}M{19:!(!15.8a||a.2W("5k")!==-1)&&b("8b "),5k:a.2W("5k")>-1&&(!!15.5l&&5l.6m&&5j(5l.6m())||7.55),4w:a.2W("6n/")>-1&&b("6n/"),6o:a.2W("6o")>-1&&a.2W("8c")===-1&&b("8d:"),4x:!!a.5h(/8e.*8f.*8g/),5m:a.2W("5m")>-1&&b("5m/"),3z:a.2W("3z")>-1&&b("3z "),4y:a.2W("4y")>-1&&b("4y/")}}(6p.8h),3b={};(D(){E a={};$.1c(["8i","8j","8k","8l","8m"],D(b,c){a[c]=D(a){M Z.6q(a,b+2)}}),$.13(a,{8n:D(a){M 1-Z.8o(a*Z.8p/2)}}),$.1c(a,D(a,b){3b["8q"+a]=b,3b["8r"+a]=D(a){M 1-b(1-a)},3b["8s"+a]=D(a){M.5>a?b(a*2)/2:1-b(a*-2+2)/2}}),$.1c(3b,D(a,b){$.3b[a]||($.3b[a]=b)})})();E u={3c:{1D:{5n:"1.4.4",5o:15.1D&&1D.8t.8u}},6r:D(){D b(b){2f(E c=b.5h(a),d=c&&c[1]&&c[1].3N(".")||[],e=0,f=0,g=d.1g;g>f;f++)e+=3Q(d[f]*Z.6q(10,6-f*2));M c&&c[3]?e-1:e}E a=/^(\\d+(\\.?\\d+){0,3})([A-6s-8v-]+[A-6s-8w-9]+)?/;M D(a){(!C.3c[a].5o||b(C.3c[a].5n)>b(C.3c[a].5o)&&!C.3c[a].6t)&&(C.3c[a].6t=!0,4o("1M 8x "+a+" >= "+C.3c[a].5n))}}()},1X=D(){M{6u:D(){E a=24.8y("6u");M!(!a.6v||!a.6v("2d"))}(),3d:D(){6w{M!!("8z"4n 15||15.6x&&24 8A 6x)}6y(a){M!1}}()}}();1X.2i=1X.3d&&(Y.4x||Y.3z||Y.4y||!/^(8B|8C|8D)/.6z(6p.8E));E v;(D(a){D j(c,d){a(c).1e("1C-3A"+b)||a(c).1e("1C-3A",d),k(c)}D k(b){a(b).1y(e,l)}D l(e){D r(){R(l.6A(d),j&&q&&i>q-j&&Z.5p(m-o)>f&&g>Z.5p(n-p)){E b=l.1e("1C-3A");m>o?b&&b("1l"):b&&b("4z")}j=q=1i}D s(a){j&&(k=a.2T.4A?a.2T.4A[0]:a,q=(1N 6B).6C(),o=k.3e,p=k.3f,Z.5p(m-o)>h&&a.2V())}R(!a(C).3B("F-5q-3A")){E o,p,q,j=(1N 6B).6C(),k=e.2T.4A?e.2T.4A[0]:e,l=a(C).1y(d,s).8F(c,r),m=k.3e,n=k.3f;l.1e("2a"+b)&&e.8G()}}E b=".1C",c="8H",d="8I",e="8J",f=30,g=75,h=10,i=8K;M 1X.2i?(v=D(c,d,e){e&&a(c).1e("2a"+b,!0),d&&j(c,d)},2X 0):(v=D(){},2X 0)})(1D);E w=D(){D c(c,d,e){c=c||{},e=e||{},c.3g=c.3g||(1M.3C[x.3D]?x.3D:"1C"),Y.19&&7>Y.19&&(c.3g="8L");E f=c.3g?$.13({},1M.3C[c.3g]||1M.3C[x.3D]):{},g=2S(b,f);d&&g.5r[d]&&(g=2S(g.5r[d],g),3E g.5r);E h=2S(g,c);R(h.2j?$.V(h.2j)=="5s"&&(h.2j="6D"):h.2j="4B",h.2C&&(h.2C=$.V(h.2C)=="3R"?2S(g.2C||b.2C||a.2C,{V:h.2C}):2S(a.2C,h.2C)),!h.1j||1X.2i&&!h.5t?(h.1j={},$.1c(a.1j,D(a,b){$.1c(h.1j[a]=$.13({},b),D(b){h.1j[a][b]=0})})):1X.2i&&h.5t&&(h.1j=2S(h.1j,h.5t)),Y.19&&9>Y.19&&4p(h.1j,{1m:{1f:0,12:0},W:{2D:0},15:{1f:0,12:0},U:{1f:0,12:0}}),Y.19&&7>Y.19&&(h.W=!1),h.5u&&d!="1o"&&$.13(h.5u,{1l:!1,4z:!1}),!h.X&&$.V(h.X)!="5s"){E i=!1;2E(d){1I"1Y":i="4C://5v.1Y.3h/5w/"+e.3i+"/0.6E";3S;1I"1o":i=!0}h.X=i}M h}E a=1M.3C.8M,b=2S(a,1M.3C.8N);M{5x:c}}();$.13(5c.2q,{1n:D(a){C.J=$.13({1S:"F-1E"},1x[1]||{}),C.2F=a,C.2b(),Y.19&&9>Y.19&&$(15).1y("1O",$.Q(D(){C.P&&C.P.25(":1z")&&C.1q()},C)),C.5y()},2b:D(){R(C.P=$("<O>").K(C.J.1S).N(C.2r=$("<O>").K(C.J.1S+"-2r")),$(24.3P).3T(C.P),Y.19&&7>Y.19){C.P.16({1h:"5z"});E a=C.P[0].5A;a.3F("1t","((!!15.1D ? 1D(15).4D() : 0) + \'17\')"),a.3F("1l","((!!15.1D ? 1D(15).4E() : 0) + \'17\')")}C.P.12(),C.P.1y("1P",$.Q(D(){C.2F.I&&C.2F.I.J&&C.2F.I.J.1E&&!C.2F.I.J.1E.2c||C.2F.12()},C)),C.P.1y("1C:4s",D(a){a.2V()})},3G:D(a){C.P[0].1S=C.J.1S+" "+C.J.1S+"-"+a},8O:D(a){C.J=a,C.5y()},5y:D(){C.1q()},1f:D(a){C.1q(),C.P.1v(1,0);E b=L.T&&L.T[L.11-1];M C.3H(1,b?b.I.J.1j.15.1f:0,a),C},12:D(a){E b=L.T&&L.T[L.11-1];M C.P.1v(1,0).3U(b?b.I.J.1j.15.12||0:0,"6F",a),C},3H:D(a,b,c){C.P.3j(b||0,a,"6F",c)},6G:D(){E a={};M $.1c(["G","H"],D(b,c){E d=c.6H(0,1).8P()+c.6H(1),e=24.3O;a[c]=(Y.19?Z.1q(e["4F"+d],e["4G"+d]):Y.4w?24.3P["4G"+d]:e["4G"+d])||0}),a},1q:D(){Y.4x&&Y.4w&&8Q.18>Y.4w&&C.P.16(17(6G())),Y.19&&C.P.16(17({H:$(15).H(),G:$(15).G()}))}}),$.13(3x.2q,{1n:D(a){C.2F=a,C.J=$.13({W:z,1S:"F-1J"},1x[1]||{}),C.J.W&&(C.W=C.J.W),C.2b(),C.2Y()},2b:D(){R($(24.3P).N(C.P=$("<O>").K(C.J.1S).12().N(C.4F=$("<O>").K(C.J.1S+"-4F").N($("<O>").K(C.J.1S+"-2r")).N($("<O>").K(C.J.1S+"-2s")))),Y.19&&7>Y.19){E a=C.P[0].5A;a.1h="5z",a.3F("1t","((!!15.1D ? 1D(15).4D() + (.5 * 1D(15).H()) : 0) + \'17\')"),a.3F("1l","((!!15.1D ? 1D(15).4E() + (.5 * 1D(15).G()): 0) + \'17\')")}},3G:D(a){C.P[0].1S=C.J.1S+" "+C.J.1S+"-"+a},2Y:D(){C.P.1y("1P",$.Q(D(){C.2F.12()},C))},6I:D(a){C.5B();E b=L.T&&L.T[L.11-1];C.P.1v(1,0).3j(b?b.I.J.1j.1J.1f:0,1,a)},1v:D(a,b){E c=L.T&&L.T[L.11-1];C.P.1v(1,0).3k(b?0:c?c.I.J.1j.1J.8R:0).3U(c.I.J.1j.1J.12,a)},5B:D(){E a=0;R(C.W){C.W.2t();E a=C.W.1Q.W.H}C.4F.16({"2k-1t":(C.2F.I.J.W?a*-.5:0)+"17"})}});E x={3D:"1C",1n:D(){C.2Z=[],C.2Z.5C=$({}),C.2Z.6J=$({}),C.2l=1N 5f,C.31=1N 5e,C.2b(),C.2Y(),C.3G(C.3D)},2b:D(){R(C.1E=1N 5c(C),$(24.3P).3T(C.P=$("<O>").K("F-15").N(C.2u=$("<O>").K("F-2u").12().N(C.32=$("<O>").K("F-32")).N(C.W=$("<O>").K("F-W")))),C.1J=1N 3x(C),Y.19&&7>Y.19){E a=C.P[0].5A;a.1h="5z",a.3F("1t","((!!15.1D ? 1D(15).4D() : 0) + \'17\')"),a.3F("1l","((!!15.1D ? 1D(15).4E() : 0) + \'17\')")}R(Y.19){9>Y.19&&C.P.K("F-8S");2f(E b=6;9>=b;b++)b>Y.19&&C.P.K("F-8T"+b)}1X.3d&&C.P.K("F-3d-1K"),1X.2i&&C.P.K("F-8U-3d-1K"),C.P.1e("6K-6L",C.P[0].1S),z.1n(C.P),L.1n(C.P),3V.1n(),C.P.12()},3G:D(a,b){b=b||{},a&&(b.3g=a),C.1E.3G(a);E c=C.P.1e("6K-6L");M C.P[0].1S=c+" F-15-"+a,C},5D:D(a){1M.3C[a]&&(C.3D=a)},2Y:D(){$(24.3O).2G(".1C[3W]","1P",D(a,b){a.2a(),a.2V();E b=a.8V;L.33({x:a.3e,y:a.3f}),A.1f(b)}),$(24.3O).1y("1P",D(a){L.33({x:a.3e,y:a.3f})}),C.P.2G(".F-U-1R, .F-1F-1R","1P",$.Q(D(a){a.2a()},C)),$(24.3O).2G(".F-1E, .F-U, .F-1b, .F-2u","1P",$.Q(D(a){x.I&&x.I.J&&x.I.J.1E&&!x.I.J.1E.2c||(a.2V(),a.2a(),x.12())},C)),C.P.1y("1C:4s",D(a){a.2V()})},26:D(a,b){E c=$.13({},1x[2]||{});C.3I();E d=!1;R($.1c(a,D(a,b){M b.J.X?2X 0:(d=!0,!1)}),d&&$.1c(a,D(a,b){b.J.X=!1,b.J.W=!1}),2>a.1g){E e=a[0].J.3X;e&&e!="2c"&&(a[0].J.3X="2c")}C.4H=a,z.26(a),L.26(a),b&&C.2v(b,D(){c.3Y&&c.3Y()})},6M:D(){R(!C.2l.1A("3Z")){E a=$("4I, 5E, 8W"),b=[];a.1c(D(a,c){E d;$(c).25("5E, 4I")&&(d=$(c).3l(\'5F[8X="6N"]\')[0])&&d.6O&&d.6O.5i()=="6P"||$(c).25("[6N=\'6P\']")||b.22({P:c,2H:$(c).16("2H")})}),$.1c(b,D(a,b){$(b.P).16({2H:"8Y"})}),C.2l.1T("3Z",b)}},6Q:D(){E a=C.2l.1A("3Z");a&&a.1g>0&&$.1c(a,D(a,b){$(b.P).16({2H:b.2H})}),C.2l.1T("3Z",1i)},8Z:D(){E a=C.2l.1A("3Z");a&&$.1c(a,$.Q(D(a,b){E c;(c=$(b.P).5G(".90-1m")[0])&&c==C.1m[0]&&$(b.P).16({2H:b.2H})},C))},1f:D(){E a=D(){};M D(b){E c=L.T&&L.T[L.11-1],d=C.2Z.5C,e=c&&c.I.J.1j.15.12||0;R(C.2l.1A("1z"))M $.V(b)=="D"&&b(),2X 0;C.2l.1T("1z",!0),d.3m([]),C.6M(),c&&$.V(c.I.J.6R)=="D"&&c.I.J.6R.1W(1M);E f=2;d.3m($.Q(D(a){c.I.J.1E&&C.1E.1f($.Q(D(){1>--f&&a()},C)),C.31.1T("1f-15",$.Q(D(){C.6S(D(){1>--f&&a()})},C),e>1?Z.1Z(e*.5,50):1)},C)),a(),d.3m($.Q(D(a){3V.4J(),a()},C)),$.V(b)=="D"&&d.3m($.Q(D(a){b(),a()}),C)}}(),6S:D(a){L.1O(),C.P.1f(),C.2u.1v(!0);E b=L.T&&L.T[L.11-1];M C.3H(1,b.I.J.1j.15.1f,$.Q(D(){a&&a()},C)),C},12:D(){E a=L.T&&L.T[L.11-1],b=C.2Z.5C;b.3m([]),C.5H(),C.1J.1v(1i,!0);E c=1;b.3m($.Q(D(b){E d=a.I.J.1j.15.12||0;C.2u.1v(!0,!0).3U(d,"5I",$.Q(D(){C.P.12(),L.6T(),1>--c&&(C.5J(),b())},C)),a.I.J.1E&&(c++,C.31.1T("12-1E",$.Q(D(){C.1E.12($.Q(D(){1>--c&&(C.5J(),b())},C))},C),d>1?Z.1Z(d*.5,91):1))},C))},5J:D(){C.2l.1T("1z",!1),C.6Q(),3V.40();E a=L.T&&L.T[L.11-1];a&&$.V(a.I.J.6U)=="D"&&a.I.J.6U.1W(1M),C.31.2e(),C.3I()},3I:D(){E a=$.13({5K:!1,5L:!1},1x[0]||{});$.V(a.5L)=="D"&&a.5L.1W(1M),C.5H(),C.31.2e(),C.1h=-1,C.92=!1,x.2l.1T("41",!1),C.41&&($(C.41).1v().1G(),C.41=1i),C.5M&&($(C.5M).1v().1G(),C.5M=1i),$.V(a.5K)=="D"&&a.5K.1W(1M)},3H:D(a,b,c){C.2u.1v(!0,!0).3j(b||0,a||1,"5N",c)},5H:D(){C.2Z.6J.3m([]),C.2u.1v(!0)},2v:D(a,b){a&&C.1h!=a&&(C.31.2e("41"),C.11,C.1h=a,C.I=C.4H[a-1],C.3G(C.I.J&&C.I.J.3g,C.I.J),L.2v(a,b))}},2I={2J:D(){E a={H:$(15).H(),G:$(15).G()};M Y.4x&&(a.G=15.93,a.H=15.4K),a}},3n={3o:D(a){E b=$.13({2j:"6D",U:"2K"},1x[1]||{});b.2w||(b.2w=$.13({},L.28));E c=b.2w,d=$.13({},a),e=1,f=5;b.2L&&(c.G-=2*b.2L,c.H-=2*b.2L);E g={H:!0,G:!0};2E(b.2j){1I"4B":g={};1I"G":1I"H":g={},g[b.2j]=!0}4u(f>0&&(g.G&&d.G>c.G||g.H&&d.H>c.H)){E h=1,i=1;g.G&&d.G>c.G&&(h=c.G/d.G),g.H&&d.H>c.H&&(i=c.H/d.H);E e=Z.1Z(h,i);d={G:Z.42(a.G*e),H:Z.42(a.H*e)},f--}M d.G=Z.1q(d.G,0),d.H=Z.1q(d.H,0),d}},3V={1K:!1,43:{1l:37,4z:39,6V:27},4J:D(){C.5O()},40:D(){C.1K=!1},1n:D(){C.5O(),$(24).94($.Q(C.6W,C)).95($.Q(C.6X,C)),3V.40()},5O:D(){E a=L.T&&L.T[L.11-1];C.1K=a&&a.I.J.5u},6W:D(a){R(C.1K&&x.P.25(":1z")){E b=C.5P(a.43);R(b&&(!b||!C.1K||C.1K[b]))2E(a.2V(),a.2a(),b){1I"1l":L.1H();3S;1I"4z":L.1w()}}},6X:D(a){R(C.1K&&x.P.25(":1z")){E b=C.5P(a.43);R(b&&(!b||!C.1K||C.1K[b]))2E(b){1I"6V":x.12()}}},5P:D(a){2f(E b 4n C.43)R(C.43[b]==a)M b;M 1i}},L={1n:D(a){a&&(C.P=a,C.11=-1,C.2M=[],C.2m=0,C.2n=[],C.2Z=[],C.2Z.2x=$({}),C.32=C.P.3l(".F-32:4L"),C.6Y=C.P.3l(".F-6Y:4L"),C.4M(),C.2Y())},2Y:D(){$(15).1y("1O 96",$.Q(D(){x.2l.1A("1z")&&C.1O()},C)),C.32.2G(".F-1d","1P",$.Q(D(a){a.2a(),C.33({x:a.3e,y:a.3f});E b=$(a.2U).5G(".F-1d").1e("1d");C[b]()},C))},26:D(a){C.T&&($.1c(C.T,D(a,b){b.1G()}),C.T=1i,C.2n=[]),C.2m=0,C.T=[],$.1c(a,$.Q(D(a,b){C.T.22(1N 5d(b,a+1))},C)),C.4M()},6Z:D(a){Y.19&&9>Y.19?(C.33({x:a.3e,y:a.3f}),C.1h()):C.4N=44($.Q(D(){C.33({x:a.3e,y:a.3f}),C.1h()},C),30)},70:D(){C.4N&&(46(C.4N),C.4N=1i)},71:D(){1X.2i||C.47||C.P.1y("5Q",C.47=$.Q(C.6Z,C))},72:D(){!1X.2i&&C.47&&(C.P.6A("5Q",C.47),C.47=1i,C.70())},2v:D(a,b){C.73(),C.11=a;E c=C.T[a-1];C.32.N(c.1b),z.2v(a),c.26($.Q(D(){C.1f(a,D(){b&&b(),$.V(c.I.J.74)=="D"&&c.I.J.74.1W(1M,a)})},C)),C.76()},76:D(){R(C.T&&C.T.1g>1){E a=C.48(),b=a.1H,c=a.1w,d={1H:b!=C.11&&C.T[b-1].I,1w:c!=C.11&&C.T[c-1].I};C.11==1&&(d.1H=1i),C.11==C.T.1g&&(d.1w=1i),$.1c(d,D(a,b){b&&b.V=="1o"&&b.J.49&&y.49(d[a].1p,{5R:!0})})}},48:D(){R(!C.T)M{};E a=C.11,b=C.T.1g,c=1>=a?b:a-1,d=a>=b?1:a+1;M{1H:c,1w:d}},77:D(){E a=L.T&&L.T[L.11-1];M a&&a.I.J.34&&C.T&&C.T.1g>1||C.11!=1},1H:D(a){(a||C.77())&&x.2v(C.48().1H)},78:D(){E a=L.T&&L.T[L.11-1];M a&&a.I.J.34&&C.T&&C.T.1g>1||C.T&&C.T.1g>1&&C.48().1w!=1},1w:D(a){(a||C.78())&&x.2v(C.48().1w)},79:D(a){C.7a(a)||C.2M.22(a)},7b:D(a){C.2M=$.7c(C.2M,D(b){M b!=a})},7a:D(a){M $.7d(a,C.2M)>-1},1O:D(){Y.19&&7>Y.19||z.1O(),C.4M(),C.32.16(17(C.1r)),$.1c(C.T,D(a,b){b.1O()})},1h:D(){1>C.2n.1g||$.1c(C.2n,D(a,b){b.1h()})},33:D(a){a.y-=$(15).4D(),a.x-=$(15).4E();E b={y:Z.1Z(Z.1q(a.y/C.1r.H,0),1),x:Z.1Z(Z.1q(a.x/C.1r.G,0),1)},c=20,d={x:"G",y:"H"},e={};$.1c("x y".3N(" "),$.Q(D(a,f){e[f]=Z.1Z(Z.1q(c/C.1r[d[f]],0),1),b[f]*=1+2*e[f],b[f]-=e[f],b[f]=Z.1Z(Z.1q(b[f],0),1)},C)),C.7e(b)},7e:D(a){C.5S=a},4M:D(){E b=2I.2J();z.1z()&&(z.2t(),b.H-=z.1Q.W.H),C.2m=0,C.T&&$.1c(C.T,$.Q(D(a,b){R(b.I.J.U=="1U"){E c=b.2c;C.T.1g>1&&(b.5T&&(c=c.1B(b.5T)),b.3J&&(c=c.1B(b.3J)));E d=0;b.4O(D(){$.1c(c,D(a,b){d=Z.1q(d,$(b).2o(!0))})}),C.2m=Z.1q(C.2m,d)||0}},C));E c=$.13({},b,{G:b.G-2*(C.2m||0)});C.1r=b,C.28=c},97:D(){M{1H:C.11-1>0,1w:C.T.1g>=C.11+1}},1f:D(a,b){E c=[];$.1c(C.T,D(b,d){d.11!=a&&c.22(d)});E d=c.1g+1,e=C.T[C.11-1];z[e.I.J.W?"1f":"12"](),C.1O();E f=e.I.J.1j.1m.5U;$.1c(c,$.Q(D(c,e){e.12($.Q(D(){f?b&&1>=d--&&b():2>=d--&&C.T[a-1].1f(b)},C))},C)),f&&C.T[a-1].1f(D(){b&&1>=d--&&b()})},6T:D(){$.1c(C.2M,$.Q(D(a,b){C.T[b-1].12()},C)),z.12(),C.33({x:0,y:0})},98:D(a){$.1c(C.T,$.Q(D(b,c){c.1h!=a&&c.12()},C))},7f:D(a){C.7g(a)||(C.2n.22(C.T[a-1]),C.2n.1g==1&&C.71())},99:D(){C.2n=[]},5V:D(a){C.2n=$.7c(C.2n,D(b){M b.11!=a}),1>C.2n.1g&&C.72()},7g:D(a){E b=!1;M $.1c(C.2n,D(c,d){M d.11==a?(b=!0,!1):2X 0}),b},2w:D(){E a=C.1r;M x.9a&&(a.G-=9b),a},73:D(){$.1c(C.T,$.Q(D(a,b){b.7h()},C))}};$.13(5d.2q,{1n:D(a,b){C.I=a,C.11=b,C.1r={},C.2b()},1G:D(){C.4P(),C.4a&&(L.5V(C.11),C.4a=!1),C.1b.1G(),C.1b=1i,C.U.1G(),C.U=1i,C.I=1i,C.1r={},C.3I(),C.5W&&(9c(C.5W),C.5W=1i)},2b:D(){E a=C.I.J.U,b=x.4H.1g;L.32.N(C.1b=$("<O>").K("F-1b").N(C.1F=$("<O>").K("F-1F").K("F-1F-2y-U-"+C.I.J.U)).12());E c=C.I.J.3X;R(C.I.V=="1o"&&(c=="1w"&&(C.I.J.34||!C.I.J.34&&C.11!=x.4H.1g)||c=="2c")&&C.1b.K("F-1b-35-"+c.5i()),C.I.J.U=="1U"?C.1b.3T(C.U=$("<O>").K("F-U F-U-1U")):C.1b.N(C.U=$("<O>").K("F-U F-U-2K")),C.1F.N(C.3p=$("<O>").K("F-1F-1R").N(C.4Q=$("<O>").K("F-1F-2N").N(C.4R=$("<O>").K("F-1F-7i-2L").N(C.2O=$("<O>").K("F-1F-1k"))))),1X.2i&&v(C.1F,D(a){L[a=="1l"?"1w":"1H"]()},!1),C.3p.1y("1P",$.Q(D(a){a.2U==C.3p[0]&&C.I.J.1E&&C.I.J.1E.2c&&x.12()},C)),C.5X=C.3p,C.7j=C.2O,C.5Y=C.4Q,C.I.J.U=="1U"?C.U.N(C.1V=$("<O>").K("F-U-1k-1U")):(C.U.N(C.4S=$("<O>").K("F-U-1R").N(C.4b=$("<O>").K("F-U-2N").N(C.5Z=$("<O>").K("F-U-7i-2L").N(C.7k=$("<O>").K("F-U-9d").N(C.1V=$("<O>").K("F-U-1k")))))),C.5X=C.5X.1B(C.4S),C.1k=C.7j.1B(C.1V),C.5Y=C.5Y.1B(C.4b)),b>1&&(C.1V.N(C.3q=$("<O>").K("F-1d F-1d-1w").N(C.3J=$("<O>").K("F-1d-21").N($("<O>").K("F-1d-21-2s"))).1e("1d","1w")),C.11!=b||C.I.J.34||(C.3q.K("F-1d-4c"),C.3J.K("F-1d-21-4c")),C.1V.N(C.3r=$("<O>").K("F-1d F-1d-1H").N(C.4T=$("<O>").K("F-1d-21").N($("<O>").K("F-1d-21-2s"))).1e("1d","1H")),C.11!=1||C.I.J.34||(C.3r.K("F-1d-4c"),C.4T.K("F-1d-21-4c"))),C.1b.K("F-2p-1a"),(C.I.1a||C.I.J.U=="2K"&&!C.I.1a)&&(C[C.I.J.U=="2K"?"1V":"1b"].N(C.1u=$("<O>").K("F-1u F-1u-"+C.I.J.U).N(C.9e=$("<O>").K("F-1u-2r")).N(C.60=$("<O>").K("F-1u-2N"))),C.1u.1y("1P",D(a){a.2a()})),C.I.1a&&(C.1b.2P("F-2p-1a").K("F-2y-1a"),C.60.N(C.1a=$("<O>").K("F-1a").7l(C.I.1a))),b>1&&C.I.J.1h){E d=C.11+" / "+b;C.1b.K("F-2y-1h");E a=C.I.J.U;C[a=="2K"?"60":"1V"][a=="2K"?"3T":"N"](C.5T=$("<O>").K("F-1h").N($("<O>").K("F-1h-2r")).N($("<61>").K("F-1h-9f").7l(d)))}C.1V.N(C.2c=$("<O>").K("F-2c").1y("1P",D(){x.12()}).N($("<61>").K("F-2c-2r")).N($("<61>").K("F-2c-2s"))),C.I.V=="1o"&&C.I.J.3X=="2c"&&C[C.I.J.U=="1U"?"2O":"4b"].1y("1P",D(a){a.2V(),a.2a(),x.12()}),C.1b.12()},62:D(a){R(!C.I.1a)M 0;C.I.J.U=="1U"&&(a=Z.1Z(a,L.28.G));E b,c=C.1u.16("G");M C.1u.16({G:a+"17"}),b=5j(C.1u.16("H")),C.1u.16({G:c}),b},4O:D(a,b){E c=[],d=x.P.1B(x.2u).1B(C.1b).1B(C.U);b&&(d=d.1B(b)),$.1c(d,D(a,b){c.22({1z:$(b).25(":1z"),P:$(b).1f()})}),a(),$.1c(c,D(a,b){b.1z||b.P.12()})},3s:D(){C.2t();E a=C.1r.1q,b=C.I.J.U,c=C.63,d=C.7m,e=C.4U,f=3n.3o(a,{2j:c,U:b,2L:e}),g=$.13({},f);R(e&&(g=3n.3o(g,{2w:f,U:b}),f.G+=2*e,f.H+=2*e),d.7n||d.4V){E i=$.13({},L.28);e&&(i.G-=2*e,i.H-=2*e),i={G:Z.1q(i.G-2*d.7n,0),H:Z.1q(i.H-2*d.4V,0)},g=3n.3o(g,{2j:c,2w:i,U:b})}E j={1a:!0},k=!1;R(b=="1U"){E d={H:f.H-g.H,G:f.G-g.G},l=$.13({},g);C.1a&&C.1b.3B("F-2p-1a");E n;R(C.1a){n=C.1a,C.1u.2P("F-2p-1a");E o=C.1b.3B("F-2p-1a");C.1b.2P("F-2p-1a");E p=C.1b.3B("F-2y-1a");C.1b.K("F-2y-1a")}x.P.16({2H:"1z"}),C.4O($.Q(D(){E a=0,f=2;4u(f>a){j.H=C.62(g.G);E h=.5*(L.28.H-2*e-(d.4V?d.4V*2:0)-g.H);j.H>h&&(g=3n.3o(g,{2w:$.13({},{G:g.G,H:Z.1q(g.H-j.H,0)}),2j:c,U:b})),a++}j.H=C.62(g.G);E i=2I.2J();(4W>=i.H&&4X>=i.G||4W>=i.G&&4X>=i.H||j.H>=.5*g.H||j.H>=.6*g.G)&&(j.1a=!1,j.H=0,g=l)},C),n),x.P.16({2H:"1z"}),o&&C.1b.K("F-2p-1a"),p&&C.1b.K("F-2y-1a");E q={H:f.H-g.H,G:f.G-g.G};f.H+=d.H-q.H,f.G+=d.G-q.G,g.H!=l.H&&(k=!0)}29 j.H=0;E r={G:g.G+2*e,H:g.H+2*e};j.H&&(f.H+=j.H),b=="2K"&&(j.H=0);E s={1R:{14:f},2N:{14:r},1k:{14:g,2w:r,2k:{1t:.5*(f.H-r.H)-.5*j.H,1l:.5*(f.G-r.G)}},1m:{14:g},1u:j};b=="1U"&&(s.1u.1t=s.1k.2k.1t,j.G=Z.1Z(g.G,L.28.G));E i=$.13({},L.28);M b=="1U"&&(s.1F={14:{G:L.28.G},1h:{1l:.5*(L.1r.G-L.28.G)}}),s.U={1R:{14:{G:Z.1Z(f.G,i.G),H:Z.1Z(f.H,i.H)}},2N:{14:r},1k:{14:{G:Z.1Z(s.1k.14.G,i.G-2*e),H:Z.1Z(s.1k.14.H,i.H-2*e)},2k:{1t:s.1k.2k.1t+e,1l:s.1k.2k.1l+e}}},s},2t:D(){E a=$.13({},C.1r.1q),b=3Q(C.4R.16("2L-1t-G"));C.4U=b,b&&(a.G-=2*b,a.H-=2*b);E c=C.I.J.2j;c=="9g"?c=a.G>a.H?"H":a.H>a.G?"G":"4B":c||(c="4B"),C.63=c;E d=C.I.J.9h[C.63];C.7m=d},64:D(){C.4d&&(46(C.4d),C.4d=1i)},7h:D(){C.4d&&C.2z&&!C.36&&(C.64(),C.2z=!1)},26:D(a){M C.36||C.2z?(C.36&&C.4Y(a),2X 0):(y.1s.1A(C.I.1p)||y.38.7o(C.I.1p)||x.1J.6I(),C.2z=!0,C.4d=44($.Q(D(){2E(C.64(),C.I.V){1I"1o":y.1A(C.I.1p,$.Q(D(b){C.1r.7p=b,C.1r.1q=b,C.36=!0,C.2z=!1,C.2t();E d=C.3s();C.1r.1R=d.1R.14,C.1r.1m=d.1m.14,C.1m=$("<5v>").2A({3t:C.I.1p}),C.2O.N(C.1m.K("F-1m F-1m-1o")),C.2O.N($("<O>").K("F-1m-1o-1E "));E e;C.I.J.U=="1U"&&((e=C.I.J.3X)&&e=="1w"||e=="1H-1w")&&(C.I.J.34||C.11==L.T.1g||C.2O.N($("<O>").K("F-35-1d F-35-1w").1e("1d","1w")),e!="1H-1w"||C.I.J.34||C.11==1||C.2O.N($("<O>").K("F-35-1d F-35-1H").1e("1d","1H")),C.1b.2G(".F-35-1d","1P",$.Q(D(a){E b=$(a.2U).1e("1d");L[b]()},C)),C.1b.2G(".F-35-1d","7q",$.Q(D(a){E b=$(a.2U).1e("1d"),c=b&&C["2h"+b+"4Z"];c&&C["2h"+b+"4Z"].K("F-1d-21-51")},C)),C.1b.2G(".F-35-1d","7r",$.Q(D(a){E b=$(a.2U).1e("1d"),c=b&&C["2h"+b+"4Z"];c&&C["2h"+b+"4Z"].2P("F-1d-21-51")},C))),C.4Y(a)},C));3S;1I"1Y":1I"2Q":E b={G:C.I.J.G,H:C.I.J.H};C.I.V=="1Y"&&C.I.J.1Y&&C.I.J.1Y.7s&&(C.I.2B.7t=b.G>9i?"9j":"9k"),C.1r.7p=b,C.1r.1q=b,C.36=!0,C.2z=!1,C.2t();E c=C.3s();C.1r.1R=c.1R.14,C.1r.1m=c.1m.14,C.2O.N(C.1m=$("<O>").K("F-1m F-1m-"+C.I.V)),C.4Y(a)}},C),10),2X 0)},4Y:D(a){C.1O(),C.I.J.U=="2K"&&C.5Z.1y("7q",$.Q(C.4e,C)).1y("7r",$.Q(C.52,C)),1X.2i?C.1F.1y("1P",$.Q(D(){C.1V.25(":1z")||C.4e(),C.4f()},C)):C.U.2G(".F-U-2N","5Q",$.Q(D(){C.1V.25(":1z")||C.4e(),C.4f()},C));E b;L.T&&(b=L.T[L.11-1])&&b.I.1p==C.I.1p&&x.1J.1v(),a&&a()},1O:D(){R(C.1m){E a=C.3s();C.1r.1R=a.1R.14,C.1r.1m=a.1m.14,C.3p.16(17(a.1R.14)),C.I.J.U=="2K"&&C.4S.16(17(a.U.1R.14)),C.2O.1B(C.4R).16(17(a.1k.14));E b=0;R(C.I.J.U=="1U"&&a.1u.1a&&(b=a.1u.H),C.4R.16({"65-7u":b+"17"}),C.4Q.16(17({G:a.2N.14.G,H:a.2N.14.H+b})),a.1R.14.G>(C.I.J.U=="1U"?a.1F.14.G:2I.2J().G)?C.1F.K("F-5q-3A"):C.1F.2P("F-5q-3A"),C.I.J.U=="1U")C.1a&&C.1u.16(17({G:a.1u.G}));29{C.1V.1B(C.5Z).1B(C.7k).16(17(a.U.1k.14)),C.4b.16(17(a.U.2N.14));E c=0;R(C.1a){E d=C.1b.3B("F-2p-1a"),e=C.1b.3B("F-2y-1a");C.1b.2P("F-2p-1a"),C.1b.K("F-2y-1a");E c=0;C.4O($.Q(D(){c=C.1u.9l()},C),C.1V.1B(C.1a));E f=2I.2J();(c>=.45*a.1k.14.H||4W>=f.H&&4X>=f.G||4W>=f.G&&4X>=f.H)&&(a.1u.1a=!1),d&&C.1b.K("F-2p-1a"),e||C.1b.2P("F-2y-1a")}}R(C.1a){E g=a.1u.1a;C.1a[g?"1f":"12"](),C.1b[(g?"1G":"1B")+"53"]("F-2p-1a"),C.1b[(g?"1B":"1G")+"53"]("F-2y-1a")}C.4Q.1B(C.4b).16(17(a.1k.2k));E h=L.28,i=C.1r.1R;R(C.54={y:i.H-h.H,x:i.G-h.G},C.4a=C.54.x>0||C.54.y>0,L[(C.4a?"1T":"1G")+"9m"](C.11),Y.19&&8>Y.19&&C.I.V=="1o"&&C.1m.16(17(a.1k.14)),/^(2Q|1Y)$/.6z(C.I.V)){E j=a.1k.14;C.3u?C.3u.9n(j.G,j.H):C.3v&&C.3v.2A(j)}}C.1h()},1h:D(){R(C.1m){E a=L.5S,b=L.28,c=C.1r.1R,d={1t:0,1l:0},e=C.54;C.1b.2P("F-1b-3d"),(e.x||e.y)&&1X.4G&&C.1b.K("F-1b-3d"),d.1t=e.y>0?0-a.y*e.y:b.H*.5-c.H*.5,d.1l=e.x>0?0-a.x*e.x:b.G*.5-c.G*.5,1X.2i&&(e.y>0&&(d.1t=0),e.x>0&&(d.1l=0),C.3p.16({1h:"9o"})),C.9p=d,C.3p.16({1t:d.1t+"17",1l:d.1l+"17"});E f=$.13({},d);R(0>f.1t&&(f.1t=0),0>f.1l&&(f.1l=0),C.I.J.U=="1U"){E g=C.3s();R(C.1F.16(17(g.1F.14)).16(17(g.1F.1h)),C.I.1a){E h=d.1t+g.1k.2k.1t+g.1k.14.H+C.4U;h>L.28.H-g.1u.H&&(h=L.28.H-g.1u.H);E i=L.2m+d.1l+g.1k.2k.1l+C.4U;L.2m>i&&(i=L.2m),i+g.1u.G>L.2m+g.1F.14.G&&(i=L.2m),C.1u.16({1t:h+"17",1l:i+"17"})}}29 C.4S.16({1l:f.1l+"17",1t:f.1t+"17"})}},9q:D(a){C.14=a},7v:D(){2E(C.I.V){1I"1Y":E a=Y.19&&8>Y.19,b=C.3s(),c=b.1k.14;R(15.7w){E d;C.1m.N(C.56=$("<O>").N(d=$("<O>")[0])),C.3u=1N 7w.9r(d,{H:c.H,G:c.G,9s:C.I.2B.3i,9t:C.I.J.1Y,9u:a?{}:{9v:$.Q(D(a){R(C.I.J.1Y.7s)6w{a.2U.9w(C.I.2B.7t)}6y(b){}C.1O()},C)}})}29{E e=$.5F(C.I.J.1Y||{});C.1m.N(C.3v=$("<7x 7y 7z 7A>").2A({3t:"4C://9x.1Y.3h/4I/"+C.I.2B.3i+"?"+e,H:c.H,G:c.G,7B:0}))}3S;1I"2Q":E b=C.3s(),c=b.1k.14,e=$.5F(C.I.J.2Q||{});C.1m.N(C.3v=$("<7x 7y 7z 7A>").2A({3t:"4C://3u.2Q.3h/7C/"+C.I.2B.3i+"?"+e,H:c.H,G:c.G,7B:0}))}},1f:D(a){Y.19&&8>Y.19,C.7v(),L.79(C.11),C.1b.1v(1,0),C.U.1v(1,0),C.4e(1i,!0),C.4a&&L.7f(C.11),C.3H(1,Z.1q(C.I.J.1j.1m.1f,Y.19&&9>Y.19?0:10),$.Q(D(){a&&a()},C))},7D:D(){C.3v&&(C.3v.1G(),C.3v=1i),C.3u&&(C.3u.9y(),C.3u=1i),C.56&&(C.56.1G(),C.56=1i)},3I:D(){L.5V(C.11),L.7b(C.11),C.7D()},12:D(a){E b=Z.1q(C.I.J.1j.1m.12||0,Y.19&&9>Y.19?0:10),c=C.I.J.1j.1m.5U?"9z":"5N";C.1b.1v(1,0).3U(b,c,$.Q(D(){C.3I(),a&&a()},C))},3H:D(a,b,c){E d=C.I.J.1j.1m.5U?"9A":"5I";C.1b.1v(1,0).3j(b||0,a,d,c)},4e:D(a,b){b?(C.1V.1f(),C.4f(),$.V(a)=="D"&&a()):C.1V.1v(1,0).3j(b?0:C.I.J.1j.U.1f,1,"5I",$.Q(D(){C.4f(),$.V(a)=="D"&&a()},C))},52:D(a,b){C.I.J.U!="1U"&&(b?(C.1V.12(),$.V(a)=="D"&&a()):C.1V.1v(1,0).3U(b?0:C.I.J.1j.U.12,"5N",D(){$.V(a)=="D"&&a()}))},4P:D(){C.4g&&(46(C.4g),C.4g=1i)},4f:D(){C.4P(),C.4g=44($.Q(D(){C.52()},C),C.I.J.1j.U.3k)},9B:D(){C.4P(),C.4g=44($.Q(D(){C.52()},C),C.I.J.1j.U.3k)}}),$.13(5e.2q,{1n:D(){C.23={},C.57=0},1T:D(a,b,c){R($.V(a)=="3R"&&C.2e(a),$.V(a)=="D"){c=b,b=a;4u(C.23["7E"+C.57])C.57++;a="7E"+C.57}C.23[a]=15.44($.Q(D(){b&&b(),C.23[a]=1i,3E C.23[a]},C),c)},1A:D(a){M C.23[a]},2e:D(a){a||($.1c(C.23,$.Q(D(a,b){15.46(b),C.23[a]=1i,3E C.23[a]},C)),C.23={}),C.23[a]&&(15.46(C.23[a]),C.23[a]=1i,3E C.23[a])}}),$.13(5f.2q,{1n:D(){C.66={}},1T:D(a,b){C.66[a]=b},1A:D(a){M C.66[a]||!1}}),$.13(3y.2q,{1n:D(a){E b=1x[1]||{},d={};R($.V(a)=="3R")a={1p:a};29 R(a&&a.6k==1){E c=$(a);a={P:c[0],1p:c.2A("3W"),1a:c.1e("1C-1a"),3K:c.1e("1C-3K"),4h:c.1e("1C-4h"),V:c.1e("1C-V"),J:c.1e("1C-J")&&67("({"+c.1e("1C-J")+"})")||{}}}R(a&&(a.4h||(a.4h=4r(a.1p)),!a.V)){E d=4q(a.1p);a.2B=d,a.V=d.V}M a.2B||(a.2B=4q(a.1p)),a.J=a&&a.J?$.13(!0,$.13({},b),$.13({},a.J)):$.13({},b),a.J=w.5x(a.J,a.V,a.2B),$.13(C,a),C}});E y={1A:D(a,b,c){$.V(b)=="D"&&(c=b,b={}),b=$.13({58:!0,V:!1,9C:9D},b||{});E d=y.1s.1A(a),e=b.V||4q(a).V,f={V:e,3Y:c};R(!d&&e=="1o"){E g;(g=y.38.1A(a))&&g.14&&(d=g,y.1s.1T(a,g.14,g.1e))}R(d)c&&c($.13({},d.14),d.1e);29 2E(b.58&&y.1J.2e(a),e){1I"1o":E h=1N 7F;h.3L=D(){h.3L=D(){},d={14:{G:h.G,H:h.H}},f.1o=h,y.1s.1T(a,d.14,f),b.58&&y.1J.2e(a),c&&c(d.14,f)},h.3t=a,b.58&&y.1J.1T(a,{1o:h,V:e})}}};y.68=D(){M C.1n.2g(C,t.1W(1x))},$.13(y.68.2q,{1n:D(){C.1s=[]},1A:D(a){2f(E b=1i,c=0;C.1s.1g>c;c++)C.1s[c]&&C.1s[c].1p==a&&(b=C.1s[c]);M b},1T:D(a,b,c){C.1G(a),C.1s.22({1p:a,14:b,1e:c})},1G:D(a){2f(E b=0;C.1s.1g>b;b++)C.1s[b]&&C.1s[b].1p==a&&3E C.1s[b]},9E:D(a){E b=1A(a.1p);b?$.13(b,a):C.1s.22(a)}}),y.1s=1N y.68,y.3x=D(){M C.1n.2g(C,t.1W(1x))},$.13(y.3x.2q,{1n:D(){C.1s=[]},1T:D(a,b){C.2e(a),C.1s.22({1p:a,1e:b})},1A:D(a){2f(E b=1i,c=0;C.1s.1g>c;c++)C.1s[c]&&C.1s[c].1p==a&&(b=C.1s[c]);M b},2e:D(a){2f(E b=C.1s,c=0;b.1g>c;c++)R(b[c]&&b[c].1p==a&&b[c].1e){E d=b[c].1e;2E(d.V){1I"1o":d.1o&&d.1o.3L&&(d.1o.3L=D(){})}3E b[c]}}}),y.1J=1N y.3x,y.49=D(a,b,c){R($.V(b)=="D"&&(c=b,b={}),b=$.13({5R:!1},b||{}),!b.5R||!y.38.1A(a)){E d;R((d=y.38.1A(a))&&d.14)M $.V(c)=="D"&&c($.13({},d.14),d.1e),2X 0;E e={1p:a,1e:{V:"1o"}},f=1N 7F;e.1e.1o=f,f.3L=D(){f.3L=D(){},e.14={G:f.G,H:f.H},$.V(c)=="D"&&c(e.14,e.1e)},y.38.1s.1B(e),f.3t=a}},y.38={1A:D(a){M y.38.1s.1A(a)},7o:D(a){E b=C.1A(a);M b&&b.14}},y.38.1s=D(){D b(b){2f(E c=1i,d=0,e=a.1g;e>d;d++)a[d]&&a[d].1p&&a[d].1p==b&&(c=a[d]);M c}D c(b){a.22(b)}E a=[];M{1A:b,1B:c}}();E z={1n:D(a){C.P=a,C.1L=[],C.1Q={X:{H:0,2o:0},W:{H:0}},C.W=C.P.3l(".F-W:4L"),C.2b(),C.12(),C.2Y()},2b:D(){C.W.N(C.1k=$("<O>").K("F-W-1k").N(C.4i=$("<O>").K("F-W-4i").N(C.3r=$("<O>").K("F-W-1d F-W-1d-1H").N(C.4T=$("<O>").K("F-W-1d-21").N($("<O>").K("F-W-1d-21-2r")).N($("<O>").K("F-W-1d-21-2s")))).N(C.3w=$("<O>").K("F-W-9F").N(C.2D=$("<O>").K("F-W-2D"))).N(C.3q=$("<O>").K("F-W-1d F-W-1d-1w").N(C.3J=$("<O>").K("F-W-1d-21").N($("<O>").K("F-W-1d-21-2r")).N($("<O>").K("F-W-1d-21-2s")))))),C.1O()},2Y:D(){C.4i.2G(".F-X","1P",$.Q(D(a){a.2a();E b=$(a.2U).5G(".F-X")[0],c=-1;C.4i.3l(".F-X").1c(D(a,d){d==b&&(c=a+1)}),c&&(C.69(c),x.2v(c))},C)),C.4i.1y("1P",D(a){a.2a()}),C.3r.1y("1P",$.Q(C.7G,C)),C.3q.1y("1P",$.Q(C.7H,C)),1X.2i&&v(C.1k,$.Q(D(a){C[(a=="1l"?"1w":"1H")+"9G"]()},C),!1)},26:D(a){C.2e(),C.1L=[],$.1c(a,$.Q(D(a,b){C.1L.22(1N 5g(C.2D,b,a+1))},C)),Y.19&&7>Y.19||C.1O()},2e:D(){$.1c(C.1L,D(a,b){b.1G()}),C.1L=[],C.11=-1,C.2R=-1},2t:D(){E a=x.P,b=x.2u,c=C.1Q,d=a.25(":1z");d||a.1f();E e=b.25(":1z");e||b.1f();E f=C.W.4K()-(3Q(C.W.16("65-1t"))||0)-(3Q(C.W.16("65-7u"))||0);c.X.H=f;E g=C.2D.3l(".F-X:4L"),h=!!g[0],i=0;h||C.3w.N(g=$("<O>").K("F-X").N($("<O>").K("F-X-1k"))),i=3Q(g.16("2k-1l")),h||g.1G(),c.X.2o=f+i*2,c.W.H=C.W.4K(),c.2x={1H:C.3r.2o(!0),1w:C.3q.2o(!0)};E j=2I.2J().G,k=c.X.2o,l=C.1L.1g;c.2x.1K=l*k/j>1;E m=j,n=c.2x.1H+c.2x.1w;c.2x.1K&&(m-=n),m=Z.7I(m/k)*k;E o=l*k;m>o&&(m=o);E p=m+(c.2x.1K?n:0);c.3a=m/k,C.4j="59",1>=c.3a&&(m=j,p=j,c.2x.1K=!1,C.4j="5B"),c.6a=Z.4k(l*k/m),c.W.G=m,c.1k={G:p},e||b.12(),d||a.12()},40:D(){C.6b=!0},4J:D(){C.6b=!1},1K:D(){M!C.6b},1f:D(){2>C.1L.1g||(C.4J(),C.W.1f(),C.2M=!0)},12:D(){C.40(),C.W.12(),C.2M=!1},1z:D(){M!!C.2M},1O:D(){C.2t();E a=C.1Q;$.1c(C.1L,D(a,b){b.1O()}),C.3r[a.2x.1K?"1f":"12"](),C.3q[a.2x.1K?"1f":"12"]();E b=a.W.G;Y.19&&9>Y.19&&(x.31.2e("7J-7K-W"),x.31.1T("7J-7K-W",$.Q(D(){C.2t();E b=a.W.G;C.3w.16({G:b+"17"}),C.2D.16({G:C.1L.1g*a.X.2o+1+"17"})},C),9H)),C.3w.16({G:b+"17"}),C.2D.16({G:C.1L.1g*a.X.2o+1+"17"});E c=a.1k.G+1;R(C.1k.16({G:c+"17","2k-1l":-.5*c+"17"}),C.3r.1B(C.3q).16({H:a.X.H+"17"}),C.11&&C.5a(C.11,!0),Y.19&&9>Y.19){E d=x.P,e=x.2u,f=d.25(":1z");f||d.1f();E g=e.25(":1z");g||e.1f(),C.3w.H("9I%"),C.3w.16({H:C.3w.4K()+"17"}),C.W.3l(".F-X-1E-2L").12(),g||e.12(),f||d.12()}},6c:D(a){R(!(1>a||a>C.1Q.6a||a==C.2R)){E b=C.1Q.3a*(a-1)+1;C.5a(b)}},7G:D(){C.6c(C.2R-1)},7H:D(){C.6c(C.2R+1)},9J:D(){E a=2I.2J();M a},2v:D(a){R(!(Y.19&&7>Y.19)){E b=0>C.11;1>a&&(a=1);E c=C.1L.1g;a>c&&(a=c),C.11=a,C.69(a),(C.4j!="59"||C.2R!=Z.4k(a/C.1Q.3a))&&C.5a(a,b)}},5a:D(a,b){C.2t();E c,d=2I.2J().G,e=d*.5,f=C.1Q.X.2o;R(C.4j=="59"){E g=Z.4k(a/C.1Q.3a);C.2R=g,c=-1*f*(C.2R-1)*C.1Q.3a;E h="F-W-1d-21-4c";C.4T[(2>g?"1B":"1G")+"53"](h),C.3J[(g>=C.1Q.6a?"1B":"1G")+"53"](h)}29 c=e+-1*(f*(a-1)+f*.5);E i=L.T&&L.T[L.11-1];C.2D.1v(1,0).9K({1l:c+"17"},b?0:i?i.I.J.1j.W.2D:0,$.Q(D(){C.7L()},C))},7L:D(){E a,b;R(C.11&&C.1Q.X.2o&&!(1>C.1L.1g)){R(C.4j=="59"){R(1>C.2R)M;a=(C.2R-1)*C.1Q.3a+1,b=Z.1Z(a-1+C.1Q.3a,C.1L.1g)}29{E c=Z.4k(2I.2J().G/C.1Q.X.2o);a=Z.1q(Z.7I(Z.1q(C.11-c*.5,0)),1),b=Z.4k(Z.1Z(C.11+c*.5)),b>C.1L.1g&&(b=C.1L.1g)}2f(E d=a;b>=d;d++)C.1L[d-1].26()}},69:D(a){$.1c(C.1L,D(a,b){b.7M()});E b=a&&C.1L[a-1];b&&b.7N()},9L:D(){C.11&&C.2v(C.11)}};$.13(5g.2q,{1n:D(a,b,c){C.P=a,C.I=b,C.9M={},C.11=c,C.2b()},2b:D(){E a=C.I.J;C.P.N(C.X=$("<O>").K("F-X").N(C.7O=$("<O>").K("F-X-1k"))),C.I.V=="1o"&&C.X.K("F-26-X").1e("X",{I:C.I,3t:a.X||C.I.1p});E b=a.X&&a.X.2s;b&&C.X.N($("<O>").K("F-X-2s F-X-2s-"+b));E c;C.X.N(c=$("<O>").K("F-X-1E").N($("<O>").K("F-X-1E-2r")).N(C.1J=$("<O>").K("F-X-1J").N($("<O>").K("F-X-1J-2r")).N($("<O>").K("F-X-1J-2s"))).N($("<O>").K("F-X-1E-2L"))),C.X.N($("<O>").K("F-X-9N"))},1G:D(){C.X.1G(),C.X=1i,C.9O=1i},26:D(){R(!C.36&&!C.2z&&z.1z()){C.2z=!0;E a=C.I.J.X,b=a&&$.V(a)=="5s"?C.I.1p:a||C.I.1p;C.4l=b,b&&(C.I.V=="2Q"?$.9P("4C://2Q.3h/9Q/9R/7C/"+C.I.2B.3i+".9S?3Y=?",$.Q(D(a){a&&a[0]&&a[0].7P?(C.4l=a[0].7P,y.49(C.4l,{V:"1o"},$.Q(C.6d,C))):(C.36=!0,C.2z=!1,C.1J.1v(1,0).3k(C.I.J.1j.W.3k).3j(C.I.J.1j.W.26,0))},C)):y.49(C.4l,{V:"1o"},$.Q(C.6d,C)))}},6d:D(a){C.X&&(C.36=!0,C.2z=!1,C.1r=a,C.1o=$("<5v>").2A({3t:C.4l}),C.7O.3T(C.1o),C.1O(),C.1J.1v(1,0).3k(C.I.J.1j.W.3k).3j(C.I.J.1j.W.26,0))},1O:D(){E a=z.1Q.X.H;R(C.X.16({G:a+"17",H:a+"17"}),C.1o){E d,b={G:a,H:a},c=Z.1q(b.G,b.H),e=$.13({},C.1r);R(e.G>b.G&&e.H>b.H){d=3n.3o(e,{2w:b});E f=1,g=1;b.G>d.G&&(f=b.G/d.G),b.H>d.H&&(g=b.H/d.H);E h=Z.1q(f,g);h>1&&(d.G*=h,d.H*=h),$.1c("G H".3N(" "),D(a,b){d[b]=Z.42(d[b])})}29 d=3n.3o(b.G>e.G||b.H>e.H?{G:c,H:c}:b,{2w:C.1r});E i=Z.42(b.G*.5-d.G*.5),j=Z.42(b.H*.5-d.H*.5);C.1o.16(17(d)).16(17({1t:j,1l:i}))}},7N:D(){C.X.K("F-X-51")},7M:D(){C.X.2P("F-X-51")}});E A={1f:D(d){E e=1x[1]||{},1h=1x[2];1x[1]&&$.V(1x[1])=="9T"&&(1h=1x[1],e=w.5x({}));E f=[],7Q;2E(7Q=$.V(d)){1I"3R":1I"5E":E g=1N 3y(d,e),4m="1e-1C-3K-J";R(g.3K){R(2h.4t(d)){E h=$(\'.1C[1e-1C-3K="\'+$(d).1e("1C-3K")+\'"]\'),j={};h.9U("["+4m+"]").1c(D(i,a){$.13(j,67("({"+($(a).2A(4m)||"")+"})"))}),h.1c(D(a,b){1h||b!=d||(1h=a+1),f.22(1N 3y(b,$.13({},j,e)))})}}29{E j={};2h.4t(d)&&$(d).25("["+4m+"]")&&($.13(j,67("({"+($(d).2A(4m)||"")+"})")),g=1N 3y(d,$.13({},j,e))),f.22(g)}3S;1I"7R":$.1c(d,D(a,b){E c=1N 3y(b,e);f.22(c)})}(!1h||1>1h)&&(1h=1),1h>f.1g&&(1h=f.1g),L.5S||L.33({x:0,y:0}),x.26(f,1h,{3Y:D(){x.1f(D(){})}})}};$.13(1M,{1n:D(){u.6r("1D"),x.1n()},1f:D(){A.1f.2g(A,t.1W(1x))},12:D(){x.12()},5D:D(a){x.5D(a)}});E B={1o:{7S:"9V 9W 9X 6E 9Y",3M:D(a){M $.7d(4r(a),C.7S.3N(" "))>-1},1e:D(a){M C.3M()?{4h:4r(a)}:!1}},1Y:{3M:D(a){E b=/(1Y\\.3h|7T\\.7U)\\/9Z\\?(?=.*5w?=([a-6e-6f-9-2h]+))(?:\\S+)?$/.4v(a);M b&&b[2]?b[2]:(b=/(1Y\\.3h|7T\\.7U)\\/(5w?\\/|u\\/|4I\\/)?([a-6e-6f-9-2h]+)(?:\\S+)?$/i.4v(a),b&&b[3]?b[3]:!1)},1e:D(a){E b=C.3M(a);M b?{3i:b}:!1}},2Q:{3M:D(a){E b=/(2Q\\.3h)\\/([a-6e-6f-9-2h]+)(?:\\S+)?$/i.4v(a);M b&&b[2]?b[2]:!1},1e:D(a){E b=C.3M(a);M b?{3i:b}:!1}}};Y.3z&&3>Y.3z&&($.1c(x,D(a,b){$.V(b)=="D"&&(x[a]=D(){M C})}),1M.1f=D(){D a(b){E c,d=$.V(b);R(d=="3R")c=b;29 R(d=="7R"&&b[0])c=a(b[0]);29 R(2h.4t(b)&&$(b).2A("3W"))E c=$(b).2A("3W");29 c=b.1p?b.1p:!1;M c}M D(b){E c=a(b);c&&(15.a0.3W=c)}}()),15.1M=1M,$(24).a1(D(){1M.1n()})})(1D)', 62, 622, '||||||||||||||||||||||||||||||||||||||this|function|var|fr|width|height|view|options|addClass|Frames|return|append|div|element|proxy|if||_frames|ui|type|thumbnails|thumbnail|Browser|Math||_position|hide|extend|dimensions|window|css|px||IE|caption|frame|each|side|data|show|length|position|null|effects|wrapper|left|content|initialize|image|url|max|_dimensions|cache|top|info|stop|next|arguments|bind|visible|get|add|fresco|jQuery|overlay|box|remove|previous|case|loading|enabled|_thumbnails|Fresco|new|resize|click|_vars|spacer|className|set|outside|ui_wrapper|call|Support|youtube|min||button|push|_timeouts|document|is|load||_boxDimensions|else|stopPropagation|build|close||clear|for|apply|_|mobileTouch|fit|margin|states|_sideWidth|_tracking|outerWidth|no|prototype|background|icon|updateVars|bubble|setPosition|bounds|sides|has|_loading|attr|_data|controls|slide|switch|Window|delegate|visibility|Bounds|viewport|inside|border|_visible|padder|box_wrapper|removeClass|vimeo|_page|deepExtendClone|originalEvent|target|preventDefault|indexOf|void|startObserving|queues||timeouts|frames|setXY|loop|onclick|_loaded||preloaded||ipp|easing|scripts|touch|pageX|pageY|skin|com|id|fadeTo|delay|find|queue|Fit|within|box_spacer|_next|_previous|getLayout|src|player|player_iframe|_thumbs|Loading|View|Android|swipe|hasClass|skins|defaultSkin|delete|setExpression|setSkin|setOpacity|_reset|_next_button|group|onload|detect|split|documentElement|body|parseInt|string|break|prepend|fadeOut|Keyboard|href|onClick|callback|overlapping|disable|_m|round|keyCode|setTimeout||clearTimeout|_handleTracking|getSurroundingIndexes|preload|_track|ui_padder|disabled|_loadTimer|showUI|startUITimer|_ui_timer|extension|slider|_mode|ceil|_url|_dgo|in|warn|deepExtend|getURIData|detectExtension|mousewheel|isElement|while|exec|WebKit|MobileSafari|IEMobile|right|touches|none|http|scrollTop|scrollLeft|offset|scroll|views|embed|enable|innerHeight|first|updateDimensions|_tracking_timer|_whileVisible|clearUITimer|box_padder|box_outer_border|ui_spacer|_previous_button|_border|vertical|320|568|afterLoad|_button||active|hideUI|Class|overlap||player_div|_count|track|page|moveTo|console|Overlay|Frame|Timeouts|States|Thumbnail|match|toLowerCase|parseFloat|Opera|opera|Chrome|required|available|abs|prevent|initialTypeOptions|boolean|touchEffects|keyboard|img|vi|create|draw|absolute|style|center|showhide|setDefaultSkin|object|param|closest|stopQueues|easeInSine|_hide|after|before|_s|easeOutSine|fetchOptions|getKeyByKeyCode|mousemove|once|_xyp|_pos|sync|removeTracking|_interval_load|spacers|padders|ui_outer_border|info_padder|span|_getInfoHeight|_fit|clearLoadTimer|padding|_states|eval|Cache|setActive|pages|_disabled|moveToPage|_afterLoad|zA|Z0|String|constructor|wheelDelta|detail|nodeType|parentNode|version|AppleWebKit|Gecko|navigator|pow|check|Za|notified|canvas|getContext|try|DocumentTouch|catch|test|unbind|Date|getTime|both|jpg|easeInOutSine|getScrollDimensions|substr|start|update|class|skinless|hideOverlapping|wmode|value|transparent|restoreOverlapping|onShow|_show|hideAll|afterHide|esc|onkeydown|onkeyup|uis|handleTracking|clearTrackingTimer|startTracking|stopTracking|clearLoads|afterPosition||preloadSurroundingImages|mayPrevious|mayNext|setVisible|isVisible|setHidden|grep|inArray|setXYP|setTracking|isTracking|clearLoad|outer|wrappers|ui_toggle|html|_spacing|horizontal|getDimensions|_max|mouseenter|mouseleave|hd|quality|bottom|_preShow|YT|iframe|webkitAllowFullScreen|mozallowfullscreen|allowFullScreen|frameborder|video|_postHide|timeout_|Image|previousPage|nextPage|floor|ie|resizing|loadCurrentPage|deactivate|activate|thumbnail_wrapper|thumbnail_medium|object_type|array|extensions|youtu|be|sfcc|fromCharCode|log|Object|replace|120|Event|trigger|isPropagationStopped|isDefaultPrevented|DOMMouseScroll|Array|slice|isAttached|RegExp|attachEvent|MSIE|KHTML|rv|Apple|Mobile|Safari|userAgent|Quad|Cubic|Quart|Quint|Expo|Sine|cos|PI|easeIn|easeOut|easeInOut|fn|jquery|z_|z0|requires|createElement|ontouchstart|instanceof|Win|Mac|Linux|platform|one|stopImmediatePropagation|touchend|touchmove|touchstart|1e3|IE6|base|reset|setOptions|toUpperCase|533|dela|oldIE|ltIE|mobile|currentTarget|select|name|hidden|restoreOverlappingWithinContent|fs|150|_pinchZoomed|innerWidth|keydown|keyup|orientationchange|pn|hideAllBut|clearTracking|_scrollbarWidth|scrollbarWidth|clearInterval|toggle|info_background|text|smart|spacing|720|hd1080|hd720|outerHeight|Tracking|setSize|relative|_style|setDimensions|Player|videoId|playerVars|events|onReady|setPlaybackQuality|www|destroy|easeInQuad|easeOutQuart|hideUIDelayed|lifetime|3e5|inject|thumbs|Page|500|100|adjustToViewport|animate|refresh|_dimension|state|thumbnail_image|getJSON|api|v2|json|number|filter|bmp|gif|jpeg|png|watch|location|ready'.split('|'), 0, {}));
/*
 Copyright (c) 2010-2012, CloudMade, Vladimir Agafonkin
 Leaflet is an open-source JavaScript library for mobile-friendly interactive maps.
 http://leaflet.cloudmade.com
 */
(function (e, t) {
    var n, r;
    typeof exports != t + "" ? n = exports : (r = e.L, n = {}, n.noConflict = function () {
        return e.L = r, this
    }, e.L = n), n.version = "0.4.5", n.Util = {extend: function (e) {
        var t = Array.prototype.slice.call(arguments, 1);
        for (var n = 0, r = t.length, i; n < r; n++) {
            i = t[n] || {};
            for (var s in i)i.hasOwnProperty(s) && (e[s] = i[s])
        }
        return e
    }, bind: function (e, t) {
        var n = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
        return function () {
            return e.apply(t, n || arguments)
        }
    }, stamp: function () {
        var e = 0, t = "_leaflet_id";
        return function (n) {
            return n[t] = n[t] || ++e, n[t]
        }
    }(), limitExecByInterval: function (e, t, n) {
        var r, i;
        return function s() {
            var o = arguments;
            if (r) {
                i = !0;
                return
            }
            r = !0, setTimeout(function () {
                r = !1, i && (s.apply(n, o), i = !1)
            }, t), e.apply(n, o)
        }
    }, falseFn: function () {
        return!1
    }, formatNum: function (e, t) {
        var n = Math.pow(10, t || 5);
        return Math.round(e * n) / n
    }, splitWords: function (e) {
        return e.replace(/^\s+|\s+$/g, "").split(/\s+/)
    }, setOptions: function (e, t) {
        return e.options = n.Util.extend({}, e.options, t), e.options
    }, getParamString: function (e) {
        var t = [];
        for (var n in e)e.hasOwnProperty(n) && t.push(n + "=" + e[n]);
        return"?" + t.join("&")
    }, template: function (e, t) {
        return e.replace(/\{ *([\w_]+) *\}/g, function (e, n) {
            var r = t[n];
            if (!t.hasOwnProperty(n))throw Error("No value provided for variable " + e);
            return r
        })
    }, emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="}, function () {
        function t(t) {
            var n, r, i = ["webkit", "moz", "o", "ms"];
            for (n = 0; n < i.length && !r; n++)r = e[i[n] + t];
            return r
        }

        function r(t) {
            return e.setTimeout(t, 1e3 / 60)
        }

        var i = e.requestAnimationFrame || t("RequestAnimationFrame") || r, s = e.cancelAnimationFrame || t("CancelAnimationFrame") || t("CancelRequestAnimationFrame") || function (t) {
            e.clearTimeout(t)
        };
        n.Util.requestAnimFrame = function (t, s, o, u) {
            t = n.Util.bind(t, s);
            if (!o || i !== r)return i.call(e, t, u);
            t()
        }, n.Util.cancelAnimFrame = function (t) {
            t && s.call(e, t)
        }
    }(), n.Class = function () {
    }, n.Class.extend = function (e) {
        var t = function () {
            this.initialize && this.initialize.apply(this, arguments)
        }, r = function () {
        };
        r.prototype = this.prototype;
        var i = new r;
        i.constructor = t, t.prototype = i;
        for (var s in this)this.hasOwnProperty(s) && s !== "prototype" && (t[s] = this[s]);
        return e.statics && (n.Util.extend(t, e.statics), delete e.statics), e.includes && (n.Util.extend.apply(null, [i].concat(e.includes)), delete e.includes), e.options && i.options && (e.options = n.Util.extend({}, i.options, e.options)), n.Util.extend(i, e), t
    }, n.Class.include = function (e) {
        n.Util.extend(this.prototype, e)
    }, n.Class.mergeOptions = function (e) {
        n.Util.extend(this.prototype.options, e)
    };
    var i = "_leaflet_events";
    n.Mixin = {}, n.Mixin.Events = {addEventListener: function (e, t, r) {
        var s = this[i] = this[i] || {}, o, u, a;
        if (typeof e == "object") {
            for (o in e)e.hasOwnProperty(o) && this.addEventListener(o, e[o], t);
            return this
        }
        e = n.Util.splitWords(e);
        for (u = 0, a = e.length; u < a; u++)s[e[u]] = s[e[u]] || [], s[e[u]].push({action: t, context: r || this});
        return this
    }, hasEventListeners: function (e) {
        return i in this && e in this[i] && this[i][e].length > 0
    }, removeEventListener: function (e, t, r) {
        var s = this[i], o, u, a, f, l;
        if (typeof e == "object") {
            for (o in e)e.hasOwnProperty(o) && this.removeEventListener(o, e[o], t);
            return this
        }
        e = n.Util.splitWords(e);
        for (u = 0, a = e.length; u < a; u++)if (this.hasEventListeners(e[u])) {
            f = s[e[u]];
            for (l = f.length - 1; l >= 0; l--)(!t || f[l].action === t) && (!r || f[l].context === r) && f.splice(l, 1)
        }
        return this
    }, fireEvent: function (e, t) {
        if (!this.hasEventListeners(e))return this;
        var r = n.Util.extend({type: e, target: this}, t), s = this[i][e].slice();
        for (var o = 0, u = s.length; o < u; o++)s[o].action.call(s[o].context || this, r);
        return this
    }}, n.Mixin.Events.on = n.Mixin.Events.addEventListener, n.Mixin.Events.off = n.Mixin.Events.removeEventListener, n.Mixin.Events.fire = n.Mixin.Events.fireEvent, function () {
        var r = navigator.userAgent.toLowerCase(), i = !!e.ActiveXObject, s = i && !e.XMLHttpRequest, o = r.indexOf("webkit") !== -1, u = r.indexOf("gecko") !== -1, a = r.indexOf("chrome") !== -1, f = e.opera, l = r.indexOf("android") !== -1, c = r.search("android [23]") !== -1, h = typeof orientation != t + "" ? !0 : !1, p = document.documentElement, d = i && "transition"in p.style, v = o && "WebKitCSSMatrix"in e && "m11"in new e.WebKitCSSMatrix, m = u && "MozPerspective"in p.style, g = f && "OTransition"in p.style, y = !e.L_NO_TOUCH && function () {
            var e = "ontouchstart";
            if (e in p)return!0;
            var t = document.createElement("div"), n = !1;
            return t.setAttribute ? (t.setAttribute(e, "return;"), typeof t[e] == "function" && (n = !0), t.removeAttribute(e), t = null, n) : !1
        }(), b = "devicePixelRatio"in e && e.devicePixelRatio > 1 || "matchMedia"in e && e.matchMedia("(min-resolution:144dpi)").matches;
        n.Browser = {ua: r, ie: i, ie6: s, webkit: o, gecko: u, opera: f, android: l, android23: c, chrome: a, ie3d: d, webkit3d: v, gecko3d: m, opera3d: g, any3d: !e.L_DISABLE_3D && (d || v || m || g), mobile: h, mobileWebkit: h && o, mobileWebkit3d: h && v, mobileOpera: h && f, touch: y, retina: b}
    }(), n.Point = function (e, t, n) {
        this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t
    }, n.Point.prototype = {add: function (e) {
        return this.clone()._add(n.point(e))
    }, _add: function (e) {
        return this.x += e.x, this.y += e.y, this
    }, subtract: function (e) {
        return this.clone()._subtract(n.point(e))
    }, _subtract: function (e) {
        return this.x -= e.x, this.y -= e.y, this
    }, divideBy: function (e, t) {
        return new n.Point(this.x / e, this.y / e, t)
    }, multiplyBy: function (e, t) {
        return new n.Point(this.x * e, this.y * e, t)
    }, distanceTo: function (e) {
        e = n.point(e);
        var t = e.x - this.x, r = e.y - this.y;
        return Math.sqrt(t * t + r * r)
    }, round: function () {
        return this.clone()._round()
    }, _round: function () {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this
    }, floor: function () {
        return this.clone()._floor()
    }, _floor: function () {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this
    }, clone: function () {
        return new n.Point(this.x, this.y)
    }, toString: function () {
        return"Point(" + n.Util.formatNum(this.x) + ", " + n.Util.formatNum(this.y) + ")"
    }}, n.point = function (e, t, r) {
        return e instanceof n.Point ? e : e instanceof Array ? new n.Point(e[0], e[1]) : isNaN(e) ? e : new n.Point(e, t, r)
    }, n.Bounds = n.Class.extend({initialize: function (e, t) {
        if (!e)return;
        var n = t ? [e, t] : e;
        for (var r = 0, i = n.length; r < i; r++)this.extend(n[r])
    }, extend: function (e) {
        return e = n.point(e), !this.min && !this.max ? (this.min = e.clone(), this.max = e.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(e.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(e.y, this.max.y)), this
    }, getCenter: function (e) {
        return new n.Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, e)
    }, getBottomLeft: function () {
        return new n.Point(this.min.x, this.max.y)
    }, getTopRight: function () {
        return new n.Point(this.max.x, this.min.y)
    }, contains: function (e) {
        var t, r;
        return typeof e[0] == "number" || e instanceof n.Point ? e = n.point(e) : e = n.bounds(e), e instanceof n.Bounds ? (t = e.min, r = e.max) : t = r = e, t.x >= this.min.x && r.x <= this.max.x && t.y >= this.min.y && r.y <= this.max.y
    }, intersects: function (e) {
        e = n.bounds(e);
        var t = this.min, r = this.max, i = e.min, s = e.max, o = s.x >= t.x && i.x <= r.x, u = s.y >= t.y && i.y <= r.y;
        return o && u
    }}), n.bounds = function (e, t) {
        return!e || e instanceof n.Bounds ? e : new n.Bounds(e, t)
    }, n.Transformation = n.Class.extend({initialize: function (e, t, n, r) {
        this._a = e, this._b = t, this._c = n, this._d = r
    }, transform: function (e, t) {
        return this._transform(e.clone(), t)
    }, _transform: function (e, t) {
        return t = t || 1, e.x = t * (this._a * e.x + this._b), e.y = t * (this._c * e.y + this._d), e
    }, untransform: function (e, t) {
        return t = t || 1, new n.Point((e.x / t - this._b) / this._a, (e.y / t - this._d) / this._c)
    }}), n.DomUtil = {get: function (e) {
        return typeof e == "string" ? document.getElementById(e) : e
    }, getStyle: function (e, t) {
        var n = e.style[t];
        !n && e.currentStyle && (n = e.currentStyle[t]);
        if (!n || n === "auto") {
            var r = document.defaultView.getComputedStyle(e, null);
            n = r ? r[t] : null
        }
        return n === "auto" ? null : n
    }, getViewportOffset: function (e) {
        var t = 0, r = 0, i = e, s = document.body;
        do {
            t += i.offsetTop || 0, r += i.offsetLeft || 0;
            if (i.offsetParent === s && n.DomUtil.getStyle(i, "position") === "absolute")break;
            if (n.DomUtil.getStyle(i, "position") === "fixed") {
                t += s.scrollTop || 0, r += s.scrollLeft || 0;
                break
            }
            i = i.offsetParent
        } while (i);
        i = e;
        do {
            if (i === s)break;
            t -= i.scrollTop || 0, r -= i.scrollLeft || 0, i = i.parentNode
        } while (i);
        return new n.Point(r, t)
    }, create: function (e, t, n) {
        var r = document.createElement(e);
        return r.className = t, n && n.appendChild(r), r
    }, disableTextSelection: function () {
        document.selection && document.selection.empty && document.selection.empty(), this._onselectstart || (this._onselectstart = document.onselectstart, document.onselectstart = n.Util.falseFn)
    }, enableTextSelection: function () {
        document.onselectstart = this._onselectstart, this._onselectstart = null
    }, hasClass: function (e, t) {
        return e.className.length > 0 && RegExp("(^|\\s)" + t + "(\\s|$)").test(e.className)
    }, addClass: function (e, t) {
        n.DomUtil.hasClass(e, t) || (e.className += (e.className ? " " : "") + t)
    }, removeClass: function (e, t) {
        function n(e, n) {
            return n === t ? "" : e
        }

        e.className = e.className.replace(/(\S+)\s*/g, n).replace(/(^\s+|\s+$)/, "")
    }, setOpacity: function (e, t) {
        if ("opacity"in e.style)e.style.opacity = t; else if (n.Browser.ie) {
            var r = !1, i = "DXImageTransform.Microsoft.Alpha";
            try {
                r = e.filters.item(i)
            } catch (s) {
            }
            t = Math.round(t * 100), r ? (r.Enabled = t !== 100, r.Opacity = t) : e.style.filter += " progid:" + i + "(opacity=" + t + ")"
        }
    }, testProp: function (e) {
        var t = document.documentElement.style;
        for (var n = 0; n < e.length; n++)if (e[n]in t)return e[n];
        return!1
    }, getTranslateString: function (e) {
        var t = n.Browser.webkit3d, r = "translate" + (t ? "3d" : "") + "(", i = (t ? ",0" : "") + ")";
        return r + e.x + "px," + e.y + "px" + i
    }, getScaleString: function (e, t) {
        var r = n.DomUtil.getTranslateString(t.add(t.multiplyBy(-1 * e))), i = " scale(" + e + ") ";
        return r + i
    }, setPosition: function (e, t, r) {
        e._leaflet_pos = t, !r && n.Browser.any3d ? (e.style[n.DomUtil.TRANSFORM] = n.DomUtil.getTranslateString(t), n.Browser.mobileWebkit3d && (e.style.WebkitBackfaceVisibility = "hidden")) : (e.style.left = t.x + "px", e.style.top = t.y + "px")
    }, getPosition: function (e) {
        return e._leaflet_pos
    }}, n.Util.extend(n.DomUtil, {TRANSITION: n.DomUtil.testProp(["transition", "webkitTransition", "OTransition", "MozTransition", "msTransition"]), TRANSFORM: n.DomUtil.testProp(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"])}), n.LatLng = function (e, t, n) {
        var r = parseFloat(e), i = parseFloat(t);
        if (isNaN(r) || isNaN(i))throw Error("Invalid LatLng object: (" + e + ", " + t + ")");
        n !== !0 && (r = Math.max(Math.min(r, 90), -90), i = (i + 180) % 360 + (i < -180 || i === 180 ? 180 : -180)), this.lat = r, this.lng = i
    }, n.Util.extend(n.LatLng, {DEG_TO_RAD: Math.PI / 180, RAD_TO_DEG: 180 / Math.PI, MAX_MARGIN: 1e-9}), n.LatLng.prototype = {equals: function (e) {
        if (!e)return!1;
        e = n.latLng(e);
        var t = Math.max(Math.abs(this.lat - e.lat), Math.abs(this.lng - e.lng));
        return t <= n.LatLng.MAX_MARGIN
    }, toString: function () {
        return"LatLng(" + n.Util.formatNum(this.lat) + ", " + n.Util.formatNum(this.lng) + ")"
    }, distanceTo: function (e) {
        e = n.latLng(e);
        var t = 6378137, r = n.LatLng.DEG_TO_RAD, i = (e.lat - this.lat) * r, s = (e.lng - this.lng) * r, o = this.lat * r, u = e.lat * r, a = Math.sin(i / 2), f = Math.sin(s / 2), l = a * a + f * f * Math.cos(o) * Math.cos(u);
        return t * 2 * Math.atan2(Math.sqrt(l), Math.sqrt(1 - l))
    }}, n.latLng = function (e, t, r) {
        return e instanceof n.LatLng ? e : e instanceof Array ? new n.LatLng(e[0], e[1]) : isNaN(e) ? e : new n.LatLng(e, t, r)
    }, n.LatLngBounds = n.Class.extend({initialize: function (e, t) {
        if (!e)return;
        var n = t ? [e, t] : e;
        for (var r = 0, i = n.length; r < i; r++)this.extend(n[r])
    }, extend: function (e) {
        return typeof e[0] == "number" || e instanceof n.LatLng ? e = n.latLng(e) : e = n.latLngBounds(e), e instanceof n.LatLng ? !this._southWest && !this._northEast ? (this._southWest = new n.LatLng(e.lat, e.lng, !0), this._northEast = new n.LatLng(e.lat, e.lng, !0)) : (this._southWest.lat = Math.min(e.lat, this._southWest.lat), this._southWest.lng = Math.min(e.lng, this._southWest.lng), this._northEast.lat = Math.max(e.lat, this._northEast.lat), this._northEast.lng = Math.max(e.lng, this._northEast.lng)) : e instanceof n.LatLngBounds && (this.extend(e._southWest), this.extend(e._northEast)), this
    }, pad: function (e) {
        var t = this._southWest, r = this._northEast, i = Math.abs(t.lat - r.lat) * e, s = Math.abs(t.lng - r.lng) * e;
        return new n.LatLngBounds(new n.LatLng(t.lat - i, t.lng - s), new n.LatLng(r.lat + i, r.lng + s))
    }, getCenter: function () {
        return new n.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2)
    }, getSouthWest: function () {
        return this._southWest
    }, getNorthEast: function () {
        return this._northEast
    }, getNorthWest: function () {
        return new n.LatLng(this._northEast.lat, this._southWest.lng, !0)
    }, getSouthEast: function () {
        return new n.LatLng(this._southWest.lat, this._northEast.lng, !0)
    }, contains: function (e) {
        typeof e[0] == "number" || e instanceof n.LatLng ? e = n.latLng(e) : e = n.latLngBounds(e);
        var t = this._southWest, r = this._northEast, i, s;
        return e instanceof n.LatLngBounds ? (i = e.getSouthWest(), s = e.getNorthEast()) : i = s = e, i.lat >= t.lat && s.lat <= r.lat && i.lng >= t.lng && s.lng <= r.lng
    }, intersects: function (e) {
        e = n.latLngBounds(e);
        var t = this._southWest, r = this._northEast, i = e.getSouthWest(), s = e.getNorthEast(), o = s.lat >= t.lat && i.lat <= r.lat, u = s.lng >= t.lng && i.lng <= r.lng;
        return o && u
    }, toBBoxString: function () {
        var e = this._southWest, t = this._northEast;
        return[e.lng, e.lat, t.lng, t.lat].join(",")
    }, equals: function (e) {
        return e ? (e = n.latLngBounds(e), this._southWest.equals(e.getSouthWest()) && this._northEast.equals(e.getNorthEast())) : !1
    }}), n.latLngBounds = function (e, t) {
        return!e || e instanceof n.LatLngBounds ? e : new n.LatLngBounds(e, t)
    }, n.Projection = {}, n.Projection.SphericalMercator = {MAX_LATITUDE: 85.0511287798, project: function (e) {
        var t = n.LatLng.DEG_TO_RAD, r = this.MAX_LATITUDE, i = Math.max(Math.min(r, e.lat), -r), s = e.lng * t, o = i * t;
        return o = Math.log(Math.tan(Math.PI / 4 + o / 2)), new n.Point(s, o)
    }, unproject: function (e) {
        var t = n.LatLng.RAD_TO_DEG, r = e.x * t, i = (2 * Math.atan(Math.exp(e.y)) - Math.PI / 2) * t;
        return new n.LatLng(i, r, !0)
    }}, n.Projection.LonLat = {project: function (e) {
        return new n.Point(e.lng, e.lat)
    }, unproject: function (e) {
        return new n.LatLng(e.y, e.x, !0)
    }}, n.CRS = {latLngToPoint: function (e, t) {
        var n = this.projection.project(e), r = this.scale(t);
        return this.transformation._transform(n, r)
    }, pointToLatLng: function (e, t) {
        var n = this.scale(t), r = this.transformation.untransform(e, n);
        return this.projection.unproject(r)
    }, project: function (e) {
        return this.projection.project(e)
    }, scale: function (e) {
        return 256 * Math.pow(2, e)
    }}, n.CRS.EPSG3857 = n.Util.extend({}, n.CRS, {code: "EPSG:3857", projection: n.Projection.SphericalMercator, transformation: new n.Transformation(.5 / Math.PI, .5, -0.5 / Math.PI, .5), project: function (e) {
        var t = this.projection.project(e), n = 6378137;
        return t.multiplyBy(n)
    }}), n.CRS.EPSG900913 = n.Util.extend({}, n.CRS.EPSG3857, {code: "EPSG:900913"}), n.CRS.EPSG4326 = n.Util.extend({}, n.CRS, {code: "EPSG:4326", projection: n.Projection.LonLat, transformation: new n.Transformation(1 / 360, .5, -1 / 360, .5)}), n.Map = n.Class.extend({includes: n.Mixin.Events, options: {crs: n.CRS.EPSG3857, fadeAnimation: n.DomUtil.TRANSITION && !n.Browser.android23, trackResize: !0, markerZoomAnimation: n.DomUtil.TRANSITION && n.Browser.any3d}, initialize: function (e, r) {
        r = n.Util.setOptions(this, r), this._initContainer(e), this._initLayout(), this._initHooks(), this._initEvents(), r.maxBounds && this.setMaxBounds(r.maxBounds), r.center && r.zoom !== t && this.setView(n.latLng(r.center), r.zoom, !0), this._initLayers(r.layers)
    }, setView: function (e, t) {
        return this._resetView(n.latLng(e), this._limitZoom(t)), this
    }, setZoom: function (e) {
        return this.setView(this.getCenter(), e)
    }, zoomIn: function () {
        return this.setZoom(this._zoom + 1)
    }, zoomOut: function () {
        return this.setZoom(this._zoom - 1)
    }, fitBounds: function (e) {
        var t = this.getBoundsZoom(e);
        return this.setView(n.latLngBounds(e).getCenter(), t)
    }, fitWorld: function () {
        var e = new n.LatLng(-60, -170), t = new n.LatLng(85, 179);
        return this.fitBounds(new n.LatLngBounds(e, t))
    }, panTo: function (e) {
        return this.setView(e, this._zoom)
    }, panBy: function (e) {
        return this.fire("movestart"), this._rawPanBy(n.point(e)), this.fire("move"), this.fire("moveend")
    }, setMaxBounds: function (e) {
        e = n.latLngBounds(e), this.options.maxBounds = e;
        if (!e)return this._boundsMinZoom = null, this;
        var t = this.getBoundsZoom(e, !0);
        return this._boundsMinZoom = t, this._loaded && (this._zoom < t ? this.setView(e.getCenter(), t) : this.panInsideBounds(e)), this
    }, panInsideBounds: function (e) {
        e = n.latLngBounds(e);
        var t = this.getBounds(), r = this.project(t.getSouthWest()), i = this.project(t.getNorthEast()), s = this.project(e.getSouthWest()), o = this.project(e.getNorthEast()), u = 0, a = 0;
        return i.y < o.y && (a = o.y - i.y), i.x > o.x && (u = o.x - i.x), r.y > s.y && (a = s.y - r.y), r.x < s.x && (u = s.x - r.x), this.panBy(new n.Point(u, a, !0))
    }, addLayer: function (e) {
        var t = n.Util.stamp(e);
        if (this._layers[t])return this;
        this._layers[t] = e, e.options && !isNaN(e.options.maxZoom) && (this._layersMaxZoom = Math.max(this._layersMaxZoom || 0, e.options.maxZoom)), e.options && !isNaN(e.options.minZoom) && (this._layersMinZoom = Math.min(this._layersMinZoom || Infinity, e.options.minZoom)), this.options.zoomAnimation && n.TileLayer && e instanceof n.TileLayer && (this._tileLayersNum++, this._tileLayersToLoad++, e.on("load", this._onTileLayerLoad, this));
        var r = function () {
            e.onAdd(this), this.fire("layeradd", {layer: e})
        };
        return this._loaded ? r.call(this) : this.on("load", r, this), this
    }, removeLayer: function (e) {
        var t = n.Util.stamp(e);
        if (!this._layers[t])return;
        return e.onRemove(this), delete this._layers[t], this.options.zoomAnimation && n.TileLayer && e instanceof n.TileLayer && (this._tileLayersNum--, this._tileLayersToLoad--, e.off("load", this._onTileLayerLoad, this)), this.fire("layerremove", {layer: e})
    }, hasLayer: function (e) {
        var t = n.Util.stamp(e);
        return this._layers.hasOwnProperty(t)
    }, invalidateSize: function (e) {
        var t = this.getSize();
        this._sizeChanged = !0, this.options.maxBounds && this.setMaxBounds(this.options.maxBounds);
        if (!this._loaded)return this;
        var r = t.subtract(this.getSize()).divideBy(2, !0);
        return e === !0 ? this.panBy(r) : (this._rawPanBy(r), this.fire("move"), clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(n.Util.bind(this.fire, this, "moveend"), 200)), this
    }, addHandler: function (e, t) {
        if (!t)return;
        return this[e] = new t(this), this.options[e] && this[e].enable(), this
    }, getCenter: function () {
        return this.layerPointToLatLng(this._getCenterLayerPoint())
    }, getZoom: function () {
        return this._zoom
    }, getBounds: function () {
        var e = this.getPixelBounds(), t = this.unproject(e.getBottomLeft()), r = this.unproject(e.getTopRight());
        return new n.LatLngBounds(t, r)
    }, getMinZoom: function () {
        var e = this.options.minZoom || 0, t = this._layersMinZoom || 0, n = this._boundsMinZoom || 0;
        return Math.max(e, t, n)
    }, getMaxZoom: function () {
        var e = this.options.maxZoom === t ? Infinity : this.options.maxZoom, n = this._layersMaxZoom === t ? Infinity : this._layersMaxZoom;
        return Math.min(e, n)
    }, getBoundsZoom: function (e, t) {
        e = n.latLngBounds(e);
        var r = this.getSize(), i = this.options.minZoom || 0, s = this.getMaxZoom(), o = e.getNorthEast(), u = e.getSouthWest(), a, f, l, c = !0;
        t && i--;
        do i++, f = this.project(o, i), l = this.project(u, i), a = new n.Point(Math.abs(f.x - l.x), Math.abs(l.y - f.y)), t ? c = a.x < r.x || a.y < r.y : c = a.x <= r.x && a.y <= r.y; while (c && i <= s);
        return c && t ? null : t ? i : i - 1
    }, getSize: function () {
        if (!this._size || this._sizeChanged)this._size = new n.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1;
        return this._size
    }, getPixelBounds: function () {
        var e = this._getTopLeftPoint();
        return new n.Bounds(e, e.add(this.getSize()))
    }, getPixelOrigin: function () {
        return this._initialTopLeftPoint
    }, getPanes: function () {
        return this._panes
    }, getContainer: function () {
        return this._container
    }, getZoomScale: function (e) {
        var t = this.options.crs;
        return t.scale(e) / t.scale(this._zoom)
    }, getScaleZoom: function (e) {
        return this._zoom + Math.log(e) / Math.LN2
    }, project: function (e, r) {
        return r = r === t ? this._zoom : r, this.options.crs.latLngToPoint(n.latLng(e), r)
    }, unproject: function (e, r) {
        return r = r === t ? this._zoom : r, this.options.crs.pointToLatLng(n.point(e), r)
    }, layerPointToLatLng: function (e) {
        var t = n.point(e).add(this._initialTopLeftPoint);
        return this.unproject(t)
    }, latLngToLayerPoint: function (e) {
        var t = this.project(n.latLng(e))._round();
        return t._subtract(this._initialTopLeftPoint)
    }, containerPointToLayerPoint: function (e) {
        return n.point(e).subtract(this._getMapPanePos())
    }, layerPointToContainerPoint: function (e) {
        return n.point(e).add(this._getMapPanePos())
    }, containerPointToLatLng: function (e) {
        var t = this.containerPointToLayerPoint(n.point(e));
        return this.layerPointToLatLng(t)
    }, latLngToContainerPoint: function (e) {
        return this.layerPointToContainerPoint(this.latLngToLayerPoint(n.latLng(e)))
    }, mouseEventToContainerPoint: function (e) {
        return n.DomEvent.getMousePosition(e, this._container)
    }, mouseEventToLayerPoint: function (e) {
        return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e))
    }, mouseEventToLatLng: function (e) {
        return this.layerPointToLatLng(this.mouseEventToLayerPoint(e))
    }, _initContainer: function (e) {
        var t = this._container = n.DomUtil.get(e);
        if (t._leaflet)throw Error("Map container is already initialized.");
        t._leaflet = !0
    }, _initLayout: function () {
        var e = this._container;
        e.innerHTML = "", n.DomUtil.addClass(e, "leaflet-container"), n.Browser.touch && n.DomUtil.addClass(e, "leaflet-touch"), this.options.fadeAnimation && n.DomUtil.addClass(e, "leaflet-fade-anim");
        var t = n.DomUtil.getStyle(e, "position");
        t !== "absolute" && t !== "relative" && t !== "fixed" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos()
    }, _initPanes: function () {
        var e = this._panes = {};
        this._mapPane = e.mapPane = this._createPane("leaflet-map-pane", this._container), this._tilePane = e.tilePane = this._createPane("leaflet-tile-pane", this._mapPane), this._objectsPane = e.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane), e.shadowPane = this._createPane("leaflet-shadow-pane"), e.overlayPane = this._createPane("leaflet-overlay-pane"), e.markerPane = this._createPane("leaflet-marker-pane"), e.popupPane = this._createPane("leaflet-popup-pane");
        var t = " leaflet-zoom-hide";
        this.options.markerZoomAnimation || (n.DomUtil.addClass(e.markerPane, t), n.DomUtil.addClass(e.shadowPane, t), n.DomUtil.addClass(e.popupPane, t))
    }, _createPane: function (e, t) {
        return n.DomUtil.create("div", e, t || this._objectsPane)
    }, _initializers: [], _initHooks: function () {
        var e, t;
        for (e = 0, t = this._initializers.length; e < t; e++)this._initializers[e].call(this)
    }, _initLayers: function (e) {
        e = e ? e instanceof Array ? e : [e] : [], this._layers = {}, this._tileLayersNum = 0;
        var t, n;
        for (t = 0, n = e.length; t < n; t++)this.addLayer(e[t])
    }, _resetView: function (e, t, r, i) {
        var s = this._zoom !== t;
        i || (this.fire("movestart"), s && this.fire("zoomstart")), this._zoom = t, this._initialTopLeftPoint = this._getNewTopLeftPoint(e), r ? this._initialTopLeftPoint._add(this._getMapPanePos()) : n.DomUtil.setPosition(this._mapPane, new n.Point(0, 0)), this._tileLayersToLoad = this._tileLayersNum, this.fire("viewreset", {hard: !r}), this.fire("move"), (s || i) && this.fire("zoomend"), this.fire("moveend", {hard: !r}), this._loaded || (this._loaded = !0, this.fire("load"))
    }, _rawPanBy: function (e) {
        n.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(e))
    }, _initEvents: function () {
        if (!n.DomEvent)return;
        n.DomEvent.on(this._container, "click", this._onMouseClick, this);
        var t = ["dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave", "mousemove", "contextmenu"], r, i;
        for (r = 0, i = t.length; r < i; r++)n.DomEvent.on(this._container, t[r], this._fireMouseEvent, this);
        this.options.trackResize && n.DomEvent.on(e, "resize", this._onResize, this)
    }, _onResize: function () {
        n.Util.cancelAnimFrame(this._resizeRequest), this._resizeRequest = n.Util.requestAnimFrame(this.invalidateSize, this, !1, this._container)
    }, _onMouseClick: function (e) {
        if (!this._loaded || this.dragging && this.dragging.moved())return;
        this.fire("preclick"), this._fireMouseEvent(e)
    }, _fireMouseEvent: function (e) {
        if (!this._loaded)return;
        var t = e.type;
        t = t === "mouseenter" ? "mouseover" : t === "mouseleave" ? "mouseout" : t;
        if (!this.hasEventListeners(t))return;
        t === "contextmenu" && n.DomEvent.preventDefault(e);
        var r = this.mouseEventToContainerPoint(e), i = this.containerPointToLayerPoint(r), s = this.layerPointToLatLng(i);
        this.fire(t, {latlng: s, layerPoint: i, containerPoint: r, originalEvent: e})
    }, _onTileLayerLoad: function () {
        this._tileLayersToLoad--, this._tileLayersNum && !this._tileLayersToLoad && this._tileBg && (clearTimeout(this._clearTileBgTimer), this._clearTileBgTimer = setTimeout(n.Util.bind(this._clearTileBg, this), 500))
    }, _getMapPanePos: function () {
        return n.DomUtil.getPosition(this._mapPane)
    }, _getTopLeftPoint: function () {
        if (!this._loaded)throw Error("Set map center and zoom first.");
        return this._initialTopLeftPoint.subtract(this._getMapPanePos())
    }, _getNewTopLeftPoint: function (e, t) {
        var n = this.getSize().divideBy(2);
        return this.project(e, t)._subtract(n)._round()
    }, _latLngToNewLayerPoint: function (e, t, n) {
        var r = this._getNewTopLeftPoint(n, t).add(this._getMapPanePos());
        return this.project(e, t)._subtract(r)
    }, _getCenterLayerPoint: function () {
        return this.containerPointToLayerPoint(this.getSize().divideBy(2))
    }, _getCenterOffset: function (e) {
        return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint())
    }, _limitZoom: function (e) {
        var t = this.getMinZoom(), n = this.getMaxZoom();
        return Math.max(t, Math.min(n, e))
    }}), n.Map.addInitHook = function (e) {
        var t = Array.prototype.slice.call(arguments, 1), n = typeof e == "function" ? e : function () {
            this[e].apply(this, t)
        };
        this.prototype._initializers.push(n)
    }, n.map = function (e, t) {
        return new n.Map(e, t)
    }, n.Projection.Mercator = {MAX_LATITUDE: 85.0840591556, R_MINOR: 6356752.3142, R_MAJOR: 6378137, project: function (e) {
        var t = n.LatLng.DEG_TO_RAD, r = this.MAX_LATITUDE, i = Math.max(Math.min(r, e.lat), -r), s = this.R_MAJOR, o = this.R_MINOR, u = e.lng * t * s, a = i * t, f = o / s, l = Math.sqrt(1 - f * f), c = l * Math.sin(a);
        c = Math.pow((1 - c) / (1 + c), l * .5);
        var h = Math.tan(.5 * (Math.PI * .5 - a)) / c;
        return a = -o * Math.log(h), new n.Point(u, a)
    }, unproject: function (e) {
        var t = n.LatLng.RAD_TO_DEG, r = this.R_MAJOR, i = this.R_MINOR, s = e.x * t / r, o = i / r, u = Math.sqrt(1 - o * o), a = Math.exp(-e.y / i), f = Math.PI / 2 - 2 * Math.atan(a), l = 15, c = 1e-7, h = l, p = .1, d;
        while (Math.abs(p) > c && --h > 0)d = u * Math.sin(f), p = Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - d) / (1 + d), .5 * u)) - f, f += p;
        return new n.LatLng(f * t, s, !0)
    }}, n.CRS.EPSG3395 = n.Util.extend({}, n.CRS, {code: "EPSG:3395", projection: n.Projection.Mercator, transformation: function () {
        var e = n.Projection.Mercator, t = e.R_MAJOR, r = e.R_MINOR;
        return new n.Transformation(.5 / (Math.PI * t), .5, -0.5 / (Math.PI * r), .5)
    }()}), n.TileLayer = n.Class.extend({includes: n.Mixin.Events, options: {minZoom: 0, maxZoom: 18, tileSize: 256, subdomains: "abc", errorTileUrl: "", attribution: "", zoomOffset: 0, opacity: 1, unloadInvisibleTiles: n.Browser.mobile, updateWhenIdle: n.Browser.mobile}, initialize: function (e, t) {
        t = n.Util.setOptions(this, t), t.detectRetina && n.Browser.retina && t.maxZoom > 0 && (t.tileSize = Math.floor(t.tileSize / 2), t.zoomOffset++, t.minZoom > 0 && t.minZoom--, this.options.maxZoom--), this._url = e;
        var r = this.options.subdomains;
        typeof r == "string" && (this.options.subdomains = r.split(""))
    }, onAdd: function (e) {
        this._map = e, this._initContainer(), this._createTileProto(), e.on({viewreset: this._resetCallback, moveend: this._update}, this), this.options.updateWhenIdle || (this._limitedUpdate = n.Util.limitExecByInterval(this._update, 150, this), e.on("move", this._limitedUpdate, this)), this._reset(), this._update()
    }, addTo: function (e) {
        return e.addLayer(this), this
    }, onRemove: function (e) {
        e._panes.tilePane.removeChild(this._container), e.off({viewreset: this._resetCallback, moveend: this._update}, this), this.options.updateWhenIdle || e.off("move", this._limitedUpdate, this), this._container = null, this._map = null
    }, bringToFront: function () {
        var e = this._map._panes.tilePane;
        return this._container && (e.appendChild(this._container), this._setAutoZIndex(e, Math.max)), this
    }, bringToBack: function () {
        var e = this._map._panes.tilePane;
        return this._container && (e.insertBefore(this._container, e.firstChild), this._setAutoZIndex(e, Math.min)), this
    }, getAttribution: function () {
        return this.options.attribution
    }, setOpacity: function (e) {
        return this.options.opacity = e, this._map && this._updateOpacity(), this
    }, setZIndex: function (e) {
        return this.options.zIndex = e, this._updateZIndex(), this
    }, setUrl: function (e, t) {
        return this._url = e, t || this.redraw(), this
    }, redraw: function () {
        return this._map && (this._map._panes.tilePane.empty = !1, this._reset(!0), this._update()), this
    }, _updateZIndex: function () {
        this._container && this.options.zIndex !== t && (this._container.style.zIndex = this.options.zIndex)
    }, _setAutoZIndex: function (e, t) {
        var n = e.getElementsByClassName("leaflet-layer"), r = -t(Infinity, -Infinity), i;
        for (var s = 0, o = n.length; s < o; s++)n[s] !== this._container && (i = parseInt(n[s].style.zIndex, 10), isNaN(i) || (r = t(r, i)));
        this._container.style.zIndex = isFinite(r) ? r + t(1, -1) : ""
    }, _updateOpacity: function () {
        n.DomUtil.setOpacity(this._container, this.options.opacity);
        var e, t = this._tiles;
        if (n.Browser.webkit)for (e in t)t.hasOwnProperty(e) && (t[e].style.webkitTransform += " translate(0,0)")
    }, _initContainer: function () {
        var e = this._map._panes.tilePane;
        if (!this._container || e.empty)this._container = n.DomUtil.create("div", "leaflet-layer"), this._updateZIndex(), e.appendChild(this._container), this.options.opacity < 1 && this._updateOpacity()
    }, _resetCallback: function (e) {
        this._reset(e.hard)
    }, _reset: function (e) {
        var t, n = this._tiles;
        for (t in n)n.hasOwnProperty(t) && this.fire("tileunload", {tile: n[t]});
        this._tiles = {}, this._tilesToLoad = 0, this.options.reuseTiles && (this._unusedTiles = []), e && this._container && (this._container.innerHTML = ""), this._initContainer()
    }, _update: function (e) {
        if (this._map._panTransition && this._map._panTransition._inProgress)return;
        var t = this._map.getPixelBounds(), r = this._map.getZoom(), i = this.options.tileSize;
        if (r > this.options.maxZoom || r < this.options.minZoom)return;
        var s = new n.Point(Math.floor(t.min.x / i), Math.floor(t.min.y / i)), o = new n.Point(Math.floor(t.max.x / i), Math.floor(t.max.y / i)), u = new n.Bounds(s, o);
        this._addTilesFromCenterOut(u), (this.options.unloadInvisibleTiles || this.options.reuseTiles) && this._removeOtherTiles(u)
    }, _addTilesFromCenterOut: function (e) {
        var t = [], r = e.getCenter(), i, s, o;
        for (i = e.min.y; i <= e.max.y; i++)for (s = e.min.x; s <= e.max.x; s++)o = new n.Point(s, i), this._tileShouldBeLoaded(o) && t.push(o);
        var u = t.length;
        if (u === 0)return;
        t.sort(function (e, t) {
            return e.distanceTo(r) - t.distanceTo(r)
        });
        var a = document.createDocumentFragment();
        this._tilesToLoad || this.fire("loading"), this._tilesToLoad += u;
        for (s = 0; s < u; s++)this._addTile(t[s], a);
        this._container.appendChild(a)
    }, _tileShouldBeLoaded: function (e) {
        if (e.x + ":" + e.y in this._tiles)return!1;
        if (!this.options.continuousWorld) {
            var t = this._getWrapTileNum();
            if (this.options.noWrap && (e.x < 0 || e.x >= t) || e.y < 0 || e.y >= t)return!1
        }
        return!0
    }, _removeOtherTiles: function (e) {
        var t, n, r, i;
        for (i in this._tiles)this._tiles.hasOwnProperty(i) && (t = i.split(":"), n = parseInt(t[0], 10), r = parseInt(t[1], 10), (n < e.min.x || n > e.max.x || r < e.min.y || r > e.max.y) && this._removeTile(i))
    }, _removeTile: function (e) {
        var t = this._tiles[e];
        this.fire("tileunload", {tile: t, url: t.src}), this.options.reuseTiles ? (n.DomUtil.removeClass(t, "leaflet-tile-loaded"), this._unusedTiles.push(t)) : t.parentNode === this._container && this._container.removeChild(t), n.Browser.android || (t.src = n.Util.emptyImageUrl), delete this._tiles[e]
    }, _addTile: function (e, t) {
        var r = this._getTilePos(e), i = this._getTile();
        n.DomUtil.setPosition(i, r, n.Browser.chrome || n.Browser.android23), this._tiles[e.x + ":" + e.y] = i, this._loadTile(i, e), i.parentNode !== this._container && t.appendChild(i)
    }, _getZoomForUrl: function () {
        var e = this.options, t = this._map.getZoom();
        return e.zoomReverse && (t = e.maxZoom - t), t + e.zoomOffset
    }, _getTilePos: function (e) {
        var t = this._map.getPixelOrigin(), n = this.options.tileSize;
        return e.multiplyBy(n).subtract(t)
    }, getTileUrl: function (e) {
        return this._adjustTilePoint(e), n.Util.template(this._url, n.Util.extend({s: this._getSubdomain(e), z: this._getZoomForUrl(), x: e.x, y: e.y}, this.options))
    }, _getWrapTileNum: function () {
        return Math.pow(2, this._getZoomForUrl())
    }, _adjustTilePoint: function (e) {
        var t = this._getWrapTileNum();
        !this.options.continuousWorld && !this.options.noWrap && (e.x = (e.x % t + t) % t), this.options.tms && (e.y = t - e.y - 1)
    }, _getSubdomain: function (e) {
        var t = (e.x + e.y) % this.options.subdomains.length;
        return this.options.subdomains[t]
    }, _createTileProto: function () {
        var e = this._tileImg = n.DomUtil.create("img", "leaflet-tile");
        e.galleryimg = "no";
        var t = this.options.tileSize;
        e.style.width = t + "px", e.style.height = t + "px"
    }, _getTile: function () {
        if (this.options.reuseTiles && this._unusedTiles.length > 0) {
            var e = this._unusedTiles.pop();
            return this._resetTile(e), e
        }
        return this._createTile()
    }, _resetTile: function (e) {
    }, _createTile: function () {
        var e = this._tileImg.cloneNode(!1);
        return e.onselectstart = e.onmousemove = n.Util.falseFn, e
    }, _loadTile: function (e, t) {
        e._layer = this, e.onload = this._tileOnLoad, e.onerror = this._tileOnError, e.src = this.getTileUrl(t)
    }, _tileLoaded: function () {
        this._tilesToLoad--, this._tilesToLoad || this.fire("load")
    }, _tileOnLoad: function (e) {
        var t = this._layer;
        this.src !== n.Util.emptyImageUrl && (n.DomUtil.addClass(this, "leaflet-tile-loaded"), t.fire("tileload", {tile: this, url: this.src})), t._tileLoaded()
    }, _tileOnError: function (e) {
        var t = this._layer;
        t.fire("tileerror", {tile: this, url: this.src});
        var n = t.options.errorTileUrl;
        n && (this.src = n), t._tileLoaded()
    }}), n.tileLayer = function (e, t) {
        return new n.TileLayer(e, t)
    }, n.TileLayer.WMS = n.TileLayer.extend({defaultWmsParams: {service: "WMS", request: "GetMap", version: "1.1.1", layers: "", styles: "", format: "image/jpeg", transparent: !1}, initialize: function (e, t) {
        this._url = e;
        var r = n.Util.extend({}, this.defaultWmsParams);
        t.detectRetina && n.Browser.retina ? r.width = r.height = this.options.tileSize * 2 : r.width = r.height = this.options.tileSize;
        for (var i in t)this.options.hasOwnProperty(i) || (r[i] = t[i]);
        this.wmsParams = r, n.Util.setOptions(this, t)
    }, onAdd: function (e) {
        var t = parseFloat(this.wmsParams.version) >= 1.3 ? "crs" : "srs";
        this.wmsParams[t] = e.options.crs.code, n.TileLayer.prototype.onAdd.call(this, e)
    }, getTileUrl: function (e, t) {
        var r = this._map, i = r.options.crs, s = this.options.tileSize, o = e.multiplyBy(s), u = o.add(new n.Point(s, s)), a = i.project(r.unproject(o, t)), f = i.project(r.unproject(u, t)), l = [a.x, f.y, f.x, a.y].join(","), c = n.Util.template(this._url, {s: this._getSubdomain(e)});
        return c + n.Util.getParamString(this.wmsParams) + "&bbox=" + l
    }, setParams: function (e, t) {
        return n.Util.extend(this.wmsParams, e), t || this.redraw(), this
    }}), n.tileLayer.wms = function (e, t) {
        return new n.TileLayer.WMS(e, t)
    }, n.TileLayer.Canvas = n.TileLayer.extend({options: {async: !1}, initialize: function (e) {
        n.Util.setOptions(this, e)
    }, redraw: function () {
        var e, t = this._tiles;
        for (e in t)t.hasOwnProperty(e) && this._redrawTile(t[e])
    }, _redrawTile: function (e) {
        this.drawTile(e, e._tilePoint, e._zoom)
    }, _createTileProto: function () {
        var e = this._canvasProto = n.DomUtil.create("canvas", "leaflet-tile"), t = this.options.tileSize;
        e.width = t, e.height = t
    }, _createTile: function () {
        var e = this._canvasProto.cloneNode(!1);
        return e.onselectstart = e.onmousemove = n.Util.falseFn, e
    }, _loadTile: function (e, t, n) {
        e._layer = this, e._tilePoint = t, e._zoom = n, this.drawTile(e, t, n), this.options.async || this.tileDrawn(e)
    }, drawTile: function (e, t, n) {
    }, tileDrawn: function (e) {
        this._tileOnLoad.call(e)
    }}), n.tileLayer.canvas = function (e) {
        return new n.TileLayer.Canvas(e)
    }, n.ImageOverlay = n.Class.extend({includes: n.Mixin.Events, options: {opacity: 1}, initialize: function (e, t, r) {
        this._url = e, this._bounds = n.latLngBounds(t), n.Util.setOptions(this, r)
    }, onAdd: function (e) {
        this._map = e, this._image || this._initImage(), e._panes.overlayPane.appendChild(this._image), e.on("viewreset", this._reset, this), e.options.zoomAnimation && n.Browser.any3d && e.on("zoomanim", this._animateZoom, this), this._reset()
    }, onRemove: function (e) {
        e.getPanes().overlayPane.removeChild(this._image), e.off("viewreset", this._reset, this), e.options.zoomAnimation && e.off("zoomanim", this._animateZoom, this)
    }, addTo: function (e) {
        return e.addLayer(this), this
    }, setOpacity: function (e) {
        return this.options.opacity = e, this._updateOpacity(), this
    }, bringToFront: function () {
        return this._image && this._map._panes.overlayPane.appendChild(this._image), this
    }, bringToBack: function () {
        var e = this._map._panes.overlayPane;
        return this._image && e.insertBefore(this._image, e.firstChild), this
    }, _initImage: function () {
        this._image = n.DomUtil.create("img", "leaflet-image-layer"), this._map.options.zoomAnimation && n.Browser.any3d ? n.DomUtil.addClass(this._image, "leaflet-zoom-animated") : n.DomUtil.addClass(this._image, "leaflet-zoom-hide"), this._updateOpacity(), n.Util.extend(this._image, {galleryimg: "no", onselectstart: n.Util.falseFn, onmousemove: n.Util.falseFn, onload: n.Util.bind(this._onImageLoad, this), src: this._url})
    }, _animateZoom: function (e) {
        var t = this._map, r = this._image, i = t.getZoomScale(e.zoom), s = this._bounds.getNorthWest(), o = this._bounds.getSouthEast(), u = t._latLngToNewLayerPoint(s, e.zoom, e.center), a = t._latLngToNewLayerPoint(o, e.zoom, e.center).subtract(u), f = t.latLngToLayerPoint(o).subtract(t.latLngToLayerPoint(s)), l = u.add(a.subtract(f).divideBy(2));
        r.style[n.DomUtil.TRANSFORM] = n.DomUtil.getTranslateString(l) + " scale(" + i + ") "
    }, _reset: function () {
        var e = this._image, t = this._map.latLngToLayerPoint(this._bounds.getNorthWest()), r = this._map.latLngToLayerPoint(this._bounds.getSouthEast()).subtract(t);
        n.DomUtil.setPosition(e, t), e.style.width = r.x + "px", e.style.height = r.y + "px"
    }, _onImageLoad: function () {
        this.fire("load")
    }, _updateOpacity: function () {
        n.DomUtil.setOpacity(this._image, this.options.opacity)
    }}), n.imageOverlay = function (e, t, r) {
        return new n.ImageOverlay(e, t, r)
    }, n.Icon = n.Class.extend({options: {className: ""}, initialize: function (e) {
        n.Util.setOptions(this, e)
    }, createIcon: function () {
        return this._createIcon("icon")
    }, createShadow: function () {
        return this._createIcon("shadow")
    }, _createIcon: function (e) {
        var t = this._getIconUrl(e);
        if (!t) {
            if (e === "icon")throw Error("iconUrl not set in Icon options (see the docs).");
            return null
        }
        var n = this._createImg(t);
        return this._setIconStyles(n, e), n
    }, _setIconStyles: function (e, t) {
        var r = this.options, i = n.point(r[t + "Size"]), s;
        t === "shadow" ? s = n.point(r.shadowAnchor || r.iconAnchor) : s = n.point(r.iconAnchor), !s && i && (s = i.divideBy(2, !0)), e.className = "leaflet-marker-" + t + " " + r.className, s && (e.style.marginLeft = -s.x + "px", e.style.marginTop = -s.y + "px"), i && (e.style.width = i.x + "px", e.style.height = i.y + "px")
    }, _createImg: function (e) {
        var t;
        return n.Browser.ie6 ? (t = document.createElement("div"), t.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + e + '")') : (t = document.createElement("img"), t.src = e), t
    }, _getIconUrl: function (e) {
        return this.options[e + "Url"]
    }}), n.icon = function (e) {
        return new n.Icon(e)
    }, n.Icon.Default = n.Icon.extend({options: {iconSize: new n.Point(25, 41), iconAnchor: new n.Point(13, 41), popupAnchor: new n.Point(1, -34), shadowSize: new n.Point(41, 41)}, _getIconUrl: function (e) {
        var t = e + "Url";
        if (this.options[t])return this.options[t];
        var r = n.Icon.Default.imagePath;
        if (!r)throw Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
        return r + "/marker-" + e + ".png"
    }}), n.Icon.Default.imagePath = function () {
        var e = document.getElementsByTagName("script"), t = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/, n, r, i, s;
        for (n = 0, r = e.length; n < r; n++) {
            i = e[n].src, s = i.match(t);
            if (s)return i.split(t)[0] + "/images"
        }
    }(), n.Marker = n.Class.extend({includes: n.Mixin.Events, options: {icon: new n.Icon.Default, title: "", clickable: !0, draggable: !1, zIndexOffset: 0, opacity: 1}, initialize: function (e, t) {
        n.Util.setOptions(this, t), this._latlng = n.latLng(e)
    }, onAdd: function (e) {
        this._map = e, e.on("viewreset", this.update, this), this._initIcon(), this.update(), e.options.zoomAnimation && e.options.markerZoomAnimation && e.on("zoomanim", this._animateZoom, this)
    }, addTo: function (e) {
        return e.addLayer(this), this
    }, onRemove: function (e) {
        this._removeIcon(), this.closePopup && this.closePopup(), e.off({viewreset: this.update, zoomanim: this._animateZoom}, this), this._map = null
    }, getLatLng: function () {
        return this._latlng
    }, setLatLng: function (e) {
        this._latlng = n.latLng(e), this.update(), this._popup && this._popup.setLatLng(e)
    }, setZIndexOffset: function (e) {
        this.options.zIndexOffset = e, this.update()
    }, setIcon: function (e) {
        this._map && this._removeIcon(), this.options.icon = e, this._map && (this._initIcon(), this.update())
    }, update: function () {
        if (!this._icon)return;
        var e = this._map.latLngToLayerPoint(this._latlng).round();
        this._setPos(e)
    }, _initIcon: function () {
        var e = this.options, t = this._map, r = t.options.zoomAnimation && t.options.markerZoomAnimation, i = r ? "leaflet-zoom-animated" : "leaflet-zoom-hide", s = !1;
        this._icon || (this._icon = e.icon.createIcon(), e.title && (this._icon.title = e.title), this._initInteraction(), s = this.options.opacity < 1, n.DomUtil.addClass(this._icon, i)), this._shadow || (this._shadow = e.icon.createShadow(), this._shadow && (n.DomUtil.addClass(this._shadow, i), s = this.options.opacity < 1)), s && this._updateOpacity();
        var o = this._map._panes;
        o.markerPane.appendChild(this._icon), this._shadow && o.shadowPane.appendChild(this._shadow)
    }, _removeIcon: function () {
        var e = this._map._panes;
        e.markerPane.removeChild(this._icon), this._shadow && e.shadowPane.removeChild(this._shadow), this._icon = this._shadow = null
    }, _setPos: function (e) {
        n.DomUtil.setPosition(this._icon, e), this._shadow && n.DomUtil.setPosition(this._shadow, e), this._icon.style.zIndex = e.y + this.options.zIndexOffset
    }, _animateZoom: function (e) {
        var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
        this._setPos(t)
    }, _initInteraction: function () {
        if (!this.options.clickable)return;
        var e = this._icon, t = ["dblclick", "mousedown", "mouseover", "mouseout"];
        n.DomUtil.addClass(e, "leaflet-clickable"), n.DomEvent.on(e, "click", this._onMouseClick, this);
        for (var r = 0; r < t.length; r++)n.DomEvent.on(e, t[r], this._fireMouseEvent, this);
        n.Handler.MarkerDrag && (this.dragging = new n.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable())
    }, _onMouseClick: function (e) {
        n.DomEvent.stopPropagation(e);
        if (this.dragging && this.dragging.moved())return;
        if (this._map.dragging && this._map.dragging.moved())return;
        this.fire(e.type, {originalEvent: e})
    }, _fireMouseEvent: function (e) {
        this.fire(e.type, {originalEvent: e}), e.type !== "mousedown" && n.DomEvent.stopPropagation(e)
    }, setOpacity: function (e) {
        this.options.opacity = e, this._map && this._updateOpacity()
    }, _updateOpacity: function () {
        n.DomUtil.setOpacity(this._icon, this.options.opacity), this._shadow && n.DomUtil.setOpacity(this._shadow, this.options.opacity)
    }}), n.marker = function (e, t) {
        return new n.Marker(e, t)
    }, n.DivIcon = n.Icon.extend({options: {iconSize: new n.Point(12, 12), className: "leaflet-div-icon"}, createIcon: function () {
        var e = document.createElement("div"), t = this.options;
        return t.html && (e.innerHTML = t.html), t.bgPos && (e.style.backgroundPosition = -t.bgPos.x + "px " + -t.bgPos.y + "px"), this._setIconStyles(e, "icon"), e
    }, createShadow: function () {
        return null
    }}), n.divIcon = function (e) {
        return new n.DivIcon(e)
    }, n.Map.mergeOptions({closePopupOnClick: !0}), n.Popup = n.Class.extend({includes: n.Mixin.Events, options: {minWidth: 50, maxWidth: 300, maxHeight: null, autoPan: !0, closeButton: !0, offset: new n.Point(0, 6), autoPanPadding: new n.Point(5, 5), className: ""}, initialize: function (e, t) {
        n.Util.setOptions(this, e), this._source = t
    }, onAdd: function (e) {
        this._map = e, this._container || this._initLayout(), this._updateContent();
        var t = e.options.fadeAnimation;
        t && n.DomUtil.setOpacity(this._container, 0), e._panes.popupPane.appendChild(this._container), e.on("viewreset", this._updatePosition, this), n.Browser.any3d && e.on("zoomanim", this._zoomAnimation, this), e.options.closePopupOnClick && e.on("preclick", this._close, this), this._update(), t && n.DomUtil.setOpacity(this._container, 1)
    }, addTo: function (e) {
        return e.addLayer(this), this
    }, openOn: function (e) {
        return e.openPopup(this), this
    }, onRemove: function (e) {
        e._panes.popupPane.removeChild(this._container), n.Util.falseFn(this._container.offsetWidth), e.off({viewreset: this._updatePosition, preclick: this._close, zoomanim: this._zoomAnimation}, this), e.options.fadeAnimation && n.DomUtil.setOpacity(this._container, 0), this._map = null
    }, setLatLng: function (e) {
        return this._latlng = n.latLng(e), this._update(), this
    }, setContent: function (e) {
        return this._content = e, this._update(), this
    }, _close: function () {
        var e = this._map;
        e && (e._popup = null, e.removeLayer(this).fire("popupclose", {popup: this}))
    }, _initLayout: function () {
        var e = "leaflet-popup", t = this._container = n.DomUtil.create("div", e + " " + this.options.className + " leaflet-zoom-animated"), r;
        this.options.closeButton && (r = this._closeButton = n.DomUtil.create("a", e + "-close-button", t), r.href = "#close", r.innerHTML = "&#215;", n.DomEvent.on(r, "click", this._onCloseButtonClick, this));
        var i = this._wrapper = n.DomUtil.create("div", e + "-content-wrapper", t);
        n.DomEvent.disableClickPropagation(i), this._contentNode = n.DomUtil.create("div", e + "-content", i), n.DomEvent.on(this._contentNode, "mousewheel", n.DomEvent.stopPropagation), this._tipContainer = n.DomUtil.create("div", e + "-tip-container", t), this._tip = n.DomUtil.create("div", e + "-tip", this._tipContainer)
    }, _update: function () {
        if (!this._map)return;
        this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan()
    }, _updateContent: function () {
        if (!this._content)return;
        if (typeof this._content == "string")this._contentNode.innerHTML = this._content; else {
            while (this._contentNode.hasChildNodes())this._contentNode.removeChild(this._contentNode.firstChild);
            this._contentNode.appendChild(this._content)
        }
        this.fire("contentupdate")
    }, _updateLayout: function () {
        var e = this._contentNode, t = e.style;
        t.width = "", t.whiteSpace = "nowrap";
        var r = e.offsetWidth;
        r = Math.min(r, this.options.maxWidth), r = Math.max(r, this.options.minWidth), t.width = r + 1 + "px", t.whiteSpace = "", t.height = "";
        var i = e.offsetHeight, s = this.options.maxHeight, o = "leaflet-popup-scrolled";
        s && i > s ? (t.height = s + "px", n.DomUtil.addClass(e, o)) : n.DomUtil.removeClass(e, o), this._containerWidth = this._container.offsetWidth
    }, _updatePosition: function () {
        var e = this._map.latLngToLayerPoint(this._latlng), t = n.Browser.any3d, r = this.options.offset;
        t && n.DomUtil.setPosition(this._container, e), this._containerBottom = -r.y - (t ? 0 : e.y), this._containerLeft = -Math.round(this._containerWidth / 2) + r.x + (t ? 0 : e.x), this._container.style.bottom = this._containerBottom + "px", this._container.style.left = this._containerLeft + "px"
    }, _zoomAnimation: function (e) {
        var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
        n.DomUtil.setPosition(this._container, t)
    }, _adjustPan: function () {
        if (!this.options.autoPan)return;
        var e = this._map, t = this._container.offsetHeight, r = this._containerWidth, i = new n.Point(this._containerLeft, -t - this._containerBottom);
        n.Browser.any3d && i._add(n.DomUtil.getPosition(this._container));
        var s = e.layerPointToContainerPoint(i), o = this.options.autoPanPadding, u = e.getSize(), a = 0, f = 0;
        s.x < 0 && (a = s.x - o.x), s.x + r > u.x && (a = s.x + r - u.x + o.x), s.y < 0 && (f = s.y - o.y), s.y + t > u.y && (f = s.y + t - u.y + o.y), (a || f) && e.panBy(new n.Point(a, f))
    }, _onCloseButtonClick: function (e) {
        this._close(), n.DomEvent.stop(e)
    }}), n.popup = function (e, t) {
        return new n.Popup(e, t)
    }, n.Marker.include({openPopup: function () {
        return this._popup && this._map && (this._popup.setLatLng(this._latlng), this._map.openPopup(this._popup)), this
    }, closePopup: function () {
        return this._popup && this._popup._close(), this
    }, bindPopup: function (e, t) {
        var r = n.point(this.options.icon.options.popupAnchor) || new n.Point(0, 0);
        return r = r.add(n.Popup.prototype.options.offset), t && t.offset && (r = r.add(t.offset)), t = n.Util.extend({offset: r}, t), this._popup || this.on("click", this.openPopup, this), this._popup = (new n.Popup(t, this)).setContent(e), this
    }, unbindPopup: function () {
        return this._popup && (this._popup = null, this.off("click", this.openPopup)), this
    }}), n.Map.include({openPopup: function (e) {
        return this.closePopup(), this._popup = e, this.addLayer(e).fire("popupopen", {popup: this._popup})
    }, closePopup: function () {
        return this._popup && this._popup._close(), this
    }}), n.LayerGroup = n.Class.extend({initialize: function (e) {
        this._layers = {};
        var t, n;
        if (e)for (t = 0, n = e.length; t < n; t++)this.addLayer(e[t])
    }, addLayer: function (e) {
        var t = n.Util.stamp(e);
        return this._layers[t] = e, this._map && this._map.addLayer(e), this
    }, removeLayer: function (e) {
        var t = n.Util.stamp(e);
        return delete this._layers[t], this._map && this._map.removeLayer(e), this
    }, clearLayers: function () {
        return this.eachLayer(this.removeLayer, this), this
    }, invoke: function (e) {
        var t = Array.prototype.slice.call(arguments, 1), n, r;
        for (n in this._layers)this._layers.hasOwnProperty(n) && (r = this._layers[n], r[e] && r[e].apply(r, t));
        return this
    }, onAdd: function (e) {
        this._map = e, this.eachLayer(e.addLayer, e)
    }, onRemove: function (e) {
        this.eachLayer(e.removeLayer, e), this._map = null
    }, addTo: function (e) {
        return e.addLayer(this), this
    }, eachLayer: function (e, t) {
        for (var n in this._layers)this._layers.hasOwnProperty(n) && e.call(t, this._layers[n])
    }}), n.layerGroup = function (e) {
        return new n.LayerGroup(e)
    }, n.FeatureGroup = n.LayerGroup.extend({includes: n.Mixin.Events, addLayer: function (e) {
        return this._layers[n.Util.stamp(e)] ? this : (e.on("click dblclick mouseover mouseout mousemove contextmenu", this._propagateEvent, this), n.LayerGroup.prototype.addLayer.call(this, e), this._popupContent && e.bindPopup && e.bindPopup(this._popupContent), this)
    }, removeLayer: function (e) {
        return e.off("click dblclick mouseover mouseout mousemove contextmenu", this._propagateEvent, this), n.LayerGroup.prototype.removeLayer.call(this, e), this._popupContent ? this.invoke("unbindPopup") : this
    }, bindPopup: function (e) {
        return this._popupContent = e, this.invoke("bindPopup", e)
    }, setStyle: function (e) {
        return this.invoke("setStyle", e)
    }, bringToFront: function () {
        return this.invoke("bringToFront")
    }, bringToBack: function () {
        return this.invoke("bringToBack")
    }, getBounds: function () {
        var e = new n.LatLngBounds;
        return this.eachLayer(function (t) {
            e.extend(t instanceof n.Marker ? t.getLatLng() : t.getBounds())
        }, this), e
    }, _propagateEvent: function (e) {
        e.layer = e.target, e.target = this, this.fire(e.type, e)
    }}), n.featureGroup = function (e) {
        return new n.FeatureGroup(e)
    }, n.Path = n.Class.extend({includes: [n.Mixin.Events], statics: {CLIP_PADDING: n.Browser.mobile ? Math.max(0, Math.min(.5, (1280 / Math.max(e.innerWidth, e.innerHeight) - 1) / 2)) : .5}, options: {stroke: !0, color: "#0033ff", dashArray: null, weight: 5, opacity: .5, fill: !1, fillColor: null, fillOpacity: .2, clickable: !0}, initialize: function (e) {
        n.Util.setOptions(this, e)
    }, onAdd: function (e) {
        this._map = e, this._container || (this._initElements(), this._initEvents()), this.projectLatlngs(), this._updatePath(), this._container && this._map._pathRoot.appendChild(this._container), e.on({viewreset: this.projectLatlngs, moveend: this._updatePath}, this)
    }, addTo: function (e) {
        return e.addLayer(this), this
    }, onRemove: function (e) {
        e._pathRoot.removeChild(this._container), this._map = null, n.Browser.vml && (this._container = null, this._stroke = null, this._fill = null), e.off({viewreset: this.projectLatlngs, moveend: this._updatePath}, this)
    }, projectLatlngs: function () {
    }, setStyle: function (e) {
        return n.Util.setOptions(this, e), this._container && this._updateStyle(), this
    }, redraw: function () {
        return this._map && (this.projectLatlngs(), this._updatePath()), this
    }}), n.Map.include({_updatePathViewport: function () {
        var e = n.Path.CLIP_PADDING, t = this.getSize(), r = n.DomUtil.getPosition(this._mapPane), i = r.multiplyBy(-1)._subtract(t.multiplyBy(e)), s = i.add(t.multiplyBy(1 + e * 2));
        this._pathViewport = new n.Bounds(i, s)
    }}), n.Path.SVG_NS = "http://www.w3.org/2000/svg", n.Browser.svg = !!document.createElementNS && !!document.createElementNS(n.Path.SVG_NS, "svg").createSVGRect, n.Path = n.Path.extend({statics: {SVG: n.Browser.svg}, bringToFront: function () {
        return this._container && this._map._pathRoot.appendChild(this._container), this
    }, bringToBack: function () {
        if (this._container) {
            var e = this._map._pathRoot;
            e.insertBefore(this._container, e.firstChild)
        }
        return this
    }, getPathString: function () {
    }, _createElement: function (e) {
        return document.createElementNS(n.Path.SVG_NS, e)
    }, _initElements: function () {
        this._map._initPathRoot(), this._initPath(), this._initStyle()
    }, _initPath: function () {
        this._container = this._createElement("g"), this._path = this._createElement("path"), this._container.appendChild(this._path)
    }, _initStyle: function () {
        this.options.stroke && (this._path.setAttribute("stroke-linejoin", "round"), this._path.setAttribute("stroke-linecap", "round")), this.options.fill && this._path.setAttribute("fill-rule", "evenodd"), this._updateStyle()
    }, _updateStyle: function () {
        this.options.stroke ? (this._path.setAttribute("stroke", this.options.color), this._path.setAttribute("stroke-opacity", this.options.opacity), this._path.setAttribute("stroke-width", this.options.weight), this.options.dashArray ? this._path.setAttribute("stroke-dasharray", this.options.dashArray) : this._path.removeAttribute("stroke-dasharray")) : this._path.setAttribute("stroke", "none"), this.options.fill ? (this._path.setAttribute("fill", this.options.fillColor || this.options.color), this._path.setAttribute("fill-opacity", this.options.fillOpacity)) : this._path.setAttribute("fill", "none")
    }, _updatePath: function () {
        var e = this.getPathString();
        e || (e = "M0 0"), this._path.setAttribute("d", e)
    }, _initEvents: function () {
        if (this.options.clickable) {
            (n.Browser.svg || !n.Browser.vml) && this._path.setAttribute("class", "leaflet-clickable"), n.DomEvent.on(this._container, "click", this._onMouseClick, this);
            var e = ["dblclick", "mousedown", "mouseover", "mouseout", "mousemove", "contextmenu"];
            for (var t = 0; t < e.length; t++)n.DomEvent.on(this._container, e[t], this._fireMouseEvent, this)
        }
    }, _onMouseClick: function (e) {
        if (this._map.dragging && this._map.dragging.moved())return;
        this._fireMouseEvent(e), n.DomEvent.stopPropagation(e)
    }, _fireMouseEvent: function (e) {
        if (!this.hasEventListeners(e.type))return;
        e.type === "contextmenu" && n.DomEvent.preventDefault(e);
        var t = this._map, r = t.mouseEventToContainerPoint(e), i = t.containerPointToLayerPoint(r), s = t.layerPointToLatLng(i);
        this.fire(e.type, {latlng: s, layerPoint: i, containerPoint: r, originalEvent: e})
    }}), n.Map.include({_initPathRoot: function () {
        this._pathRoot || (this._pathRoot = n.Path.prototype._createElement("svg"), this._panes.overlayPane.appendChild(this._pathRoot), this.options.zoomAnimation && n.Browser.any3d ? (this._pathRoot.setAttribute("class", " leaflet-zoom-animated"), this.on({zoomanim: this._animatePathZoom, zoomend: this._endPathZoom})) : this._pathRoot.setAttribute("class", " leaflet-zoom-hide"), this.on("moveend", this._updateSvgViewport), this._updateSvgViewport())
    }, _animatePathZoom: function (e) {
        var t = this.getZoomScale(e.zoom), r = this._getCenterOffset(e.center).divideBy(1 - 1 / t), i = this.containerPointToLayerPoint(this.getSize().multiplyBy(-n.Path.CLIP_PADDING)), s = i.add(r).round();
        this._pathRoot.style[n.DomUtil.TRANSFORM] = n.DomUtil.getTranslateString(s.multiplyBy(-1).add(n.DomUtil.getPosition(this._pathRoot)).multiplyBy(t).add(s)) + " scale(" + t + ") ", this._pathZooming = !0
    }, _endPathZoom: function () {
        this._pathZooming = !1
    }, _updateSvgViewport: function () {
        if (this._pathZooming)return;
        this._updatePathViewport();
        var e = this._pathViewport, t = e.min, r = e.max, i = r.x - t.x, s = r.y - t.y, o = this._pathRoot, u = this._panes.overlayPane;
        n.Browser.mobileWebkit && u.removeChild(o), n.DomUtil.setPosition(o, t), o.setAttribute("width", i), o.setAttribute("height", s), o.setAttribute("viewBox", [t.x, t.y, i, s].join(" ")), n.Browser.mobileWebkit && u.appendChild(o)
    }}), n.Path.include({bindPopup: function (e, t) {
        if (!this._popup || this._popup.options !== t)this._popup = new n.Popup(t, this);
        return this._popup.setContent(e), this._openPopupAdded || (this.on("click", this._openPopup, this), this._openPopupAdded = !0), this
    }, openPopup: function (e) {
        return this._popup && (e = e || this._latlng || this._latlngs[Math.floor(this._latlngs.length / 2)], this._openPopup({latlng: e})), this
    }, _openPopup: function (e) {
        this._popup.setLatLng(e.latlng), this._map.openPopup(this._popup)
    }}), n.Browser.vml = function () {
        try {
            var e = document.createElement("div");
            e.innerHTML = '<v:shape adj="1"/>';
            var t = e.firstChild;
            return t.style.behavior = "url(#default#VML)", t && typeof t.adj == "object"
        } catch (n) {
            return!1
        }
    }(), n.Path = n.Browser.svg || !n.Browser.vml ? n.Path : n.Path.extend({statics: {VML: !0, CLIP_PADDING: .02}, _createElement: function () {
        try {
            return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function (e) {
                return document.createElement("<lvml:" + e + ' class="lvml">')
            }
        } catch (e) {
            return function (e) {
                return document.createElement("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')
            }
        }
    }(), _initPath: function () {
        var e = this._container = this._createElement("shape");
        n.DomUtil.addClass(e, "leaflet-vml-shape"), this.options.clickable && n.DomUtil.addClass(e, "leaflet-clickable"), e.coordsize = "1 1", this._path = this._createElement("path"), e.appendChild(this._path), this._map._pathRoot.appendChild(e)
    }, _initStyle: function () {
        this._updateStyle()
    }, _updateStyle: function () {
        var e = this._stroke, t = this._fill, n = this.options, r = this._container;
        r.stroked = n.stroke, r.filled = n.fill, n.stroke ? (e || (e = this._stroke = this._createElement("stroke"), e.endcap = "round", r.appendChild(e)), e.weight = n.weight + "px", e.color = n.color, e.opacity = n.opacity, n.dashArray ? e.dashStyle = n.dashArray.replace(/ *, */g, " ") : e.dashStyle = "") : e && (r.removeChild(e), this._stroke = null), n.fill ? (t || (t = this._fill = this._createElement("fill"), r.appendChild(t)), t.color = n.fillColor || n.color, t.opacity = n.fillOpacity) : t && (r.removeChild(t), this._fill = null)
    }, _updatePath: function () {
        var e = this._container.style;
        e.display = "none", this._path.v = this.getPathString() + " ", e.display = ""
    }}), n.Map.include(n.Browser.svg || !n.Browser.vml ? {} : {_initPathRoot: function () {
        if (this._pathRoot)return;
        var e = this._pathRoot = document.createElement("div");
        e.className = "leaflet-vml-container", this._panes.overlayPane.appendChild(e), this.on("moveend", this._updatePathViewport), this._updatePathViewport()
    }}), n.Browser.canvas = function () {
        return!!document.createElement("canvas").getContext
    }(), n.Path = n.Path.SVG && !e.L_PREFER_CANVAS || !n.Browser.canvas ? n.Path : n.Path.extend({statics: {CANVAS: !0, SVG: !1}, redraw: function () {
        return this._map && (this.projectLatlngs(), this._requestUpdate()), this
    }, setStyle: function (e) {
        return n.Util.setOptions(this, e), this._map && (this._updateStyle(), this._requestUpdate()), this
    }, onRemove: function (e) {
        e.off("viewreset", this.projectLatlngs, this).off("moveend", this._updatePath, this), this._requestUpdate(), this._map = null
    }, _requestUpdate: function () {
        this._map && (n.Util.cancelAnimFrame(this._fireMapMoveEnd), this._updateRequest = n.Util.requestAnimFrame(this._fireMapMoveEnd, this._map))
    }, _fireMapMoveEnd: function () {
        this.fire("moveend")
    }, _initElements: function () {
        this._map._initPathRoot(), this._ctx = this._map._canvasCtx
    }, _updateStyle: function () {
        var e = this.options;
        e.stroke && (this._ctx.lineWidth = e.weight, this._ctx.strokeStyle = e.color), e.fill && (this._ctx.fillStyle = e.fillColor || e.color)
    }, _drawPath: function () {
        var e, t, r, i, s, o;
        this._ctx.beginPath();
        for (e = 0, r = this._parts.length; e < r; e++) {
            for (t = 0, i = this._parts[e].length; t < i; t++)s = this._parts[e][t], o = (t === 0 ? "move" : "line") + "To", this._ctx[o](s.x, s.y);
            this instanceof n.Polygon && this._ctx.closePath()
        }
    }, _checkIfEmpty: function () {
        return!this._parts.length
    }, _updatePath: function () {
        if (this._checkIfEmpty())return;
        var e = this._ctx, t = this.options;
        this._drawPath(), e.save(), this._updateStyle(), t.fill && (t.fillOpacity < 1 && (e.globalAlpha = t.fillOpacity), e.fill()), t.stroke && (t.opacity < 1 && (e.globalAlpha = t.opacity), e.stroke()), e.restore()
    }, _initEvents: function () {
        this.options.clickable && this._map.on("click", this._onClick, this)
    }, _onClick: function (e) {
        this._containsPoint(e.layerPoint) && this.fire("click", e)
    }}), n.Map.include(n.Path.SVG && !e.L_PREFER_CANVAS || !n.Browser.canvas ? {} : {_initPathRoot: function () {
        var e = this._pathRoot, t;
        e || (e = this._pathRoot = document.createElement("canvas"), e.style.position = "absolute", t = this._canvasCtx = e.getContext("2d"), t.lineCap = "round", t.lineJoin = "round", this._panes.overlayPane.appendChild(e), this.options.zoomAnimation && (this._pathRoot.className = "leaflet-zoom-animated", this.on("zoomanim", this._animatePathZoom), this.on("zoomend", this._endPathZoom)), this.on("moveend", this._updateCanvasViewport), this._updateCanvasViewport())
    }, _updateCanvasViewport: function () {
        if (this._pathZooming)return;
        this._updatePathViewport();
        var e = this._pathViewport, t = e.min, r = e.max.subtract(t), i = this._pathRoot;
        n.DomUtil.setPosition(i, t), i.width = r.x, i.height = r.y, i.getContext("2d").translate(-t.x, -t.y)
    }}), n.LineUtil = {simplify: function (e, t) {
        if (!t || !e.length)return e.slice();
        var n = t * t;
        return e = this._reducePoints(e, n), e = this._simplifyDP(e, n), e
    }, pointToSegmentDistance: function (e, t, n) {
        return Math.sqrt(this._sqClosestPointOnSegment(e, t, n, !0))
    }, closestPointOnSegment: function (e, t, n) {
        return this._sqClosestPointOnSegment(e, t, n)
    }, _simplifyDP: function (e, n) {
        var r = e.length, i = typeof Uint8Array != t + "" ? Uint8Array : Array, s = new i(r);
        s[0] = s[r - 1] = 1, this._simplifyDPStep(e, s, n, 0, r - 1);
        var o, u = [];
        for (o = 0; o < r; o++)s[o] && u.push(e[o]);
        return u
    }, _simplifyDPStep: function (e, t, n, r, i) {
        var s = 0, o, u, a;
        for (u = r + 1; u <= i - 1; u++)a = this._sqClosestPointOnSegment(e[u], e[r], e[i], !0), a > s && (o = u, s = a);
        s > n && (t[o] = 1, this._simplifyDPStep(e, t, n, r, o), this._simplifyDPStep(e, t, n, o, i))
    }, _reducePoints: function (e, t) {
        var n = [e[0]];
        for (var r = 1, i = 0, s = e.length; r < s; r++)this._sqDist(e[r], e[i]) > t && (n.push(e[r]), i = r);
        return i < s - 1 && n.push(e[s - 1]), n
    }, clipSegment: function (e, t, n, r) {
        var i = n.min, s = n.max, o = r ? this._lastCode : this._getBitCode(e, n), u = this._getBitCode(t, n);
        this._lastCode = u;
        for (; ;) {
            if (!(o | u))return[e, t];
            if (o & u)return!1;
            var a = o || u, f = this._getEdgeIntersection(e, t, a, n), l = this._getBitCode(f, n);
            a === o ? (e = f, o = l) : (t = f, u = l)
        }
    }, _getEdgeIntersection: function (e, t, r, i) {
        var s = t.x - e.x, o = t.y - e.y, u = i.min, a = i.max;
        if (r & 8)return new n.Point(e.x + s * (a.y - e.y) / o, a.y);
        if (r & 4)return new n.Point(e.x + s * (u.y - e.y) / o, u.y);
        if (r & 2)return new n.Point(a.x, e.y + o * (a.x - e.x) / s);
        if (r & 1)return new n.Point(u.x, e.y + o * (u.x - e.x) / s)
    }, _getBitCode: function (e, t) {
        var n = 0;
        return e.x < t.min.x ? n |= 1 : e.x > t.max.x && (n |= 2), e.y < t.min.y ? n |= 4 : e.y > t.max.y && (n |= 8), n
    }, _sqDist: function (e, t) {
        var n = t.x - e.x, r = t.y - e.y;
        return n * n + r * r
    }, _sqClosestPointOnSegment: function (e, t, r, i) {
        var s = t.x, o = t.y, u = r.x - s, a = r.y - o, f = u * u + a * a, l;
        return f > 0 && (l = ((e.x - s) * u + (e.y - o) * a) / f, l > 1 ? (s = r.x, o = r.y) : l > 0 && (s += u * l, o += a * l)), u = e.x - s, a = e.y - o, i ? u * u + a * a : new n.Point(s, o)
    }}, n.Polyline = n.Path.extend({initialize: function (e, t) {
        n.Path.prototype.initialize.call(this, t), this._latlngs = this._convertLatLngs(e), n.Handler.PolyEdit && (this.editing = new n.Handler.PolyEdit(this), this.options.editable && this.editing.enable())
    }, options: {smoothFactor: 1, noClip: !1}, projectLatlngs: function () {
        this._originalPoints = [];
        for (var e = 0, t = this._latlngs.length; e < t; e++)this._originalPoints[e] = this._map.latLngToLayerPoint(this._latlngs[e])
    }, getPathString: function () {
        for (var e = 0, t = this._parts.length, n = ""; e < t; e++)n += this._getPathPartStr(this._parts[e]);
        return n
    }, getLatLngs: function () {
        return this._latlngs
    }, setLatLngs: function (e) {
        return this._latlngs = this._convertLatLngs(e), this.redraw()
    }, addLatLng: function (e) {
        return this._latlngs.push(n.latLng(e)), this.redraw()
    }, spliceLatLngs: function (e, t) {
        var n = [].splice.apply(this._latlngs, arguments);
        return this._convertLatLngs(this._latlngs), this.redraw(), n
    }, closestLayerPoint: function (e) {
        var t = Infinity, r = this._parts, i, s, o = null;
        for (var u = 0, a = r.length; u < a; u++) {
            var f = r[u];
            for (var l = 1, c = f.length; l < c; l++) {
                i = f[l - 1], s = f[l];
                var h = n.LineUtil._sqClosestPointOnSegment(e, i, s, !0);
                h < t && (t = h, o = n.LineUtil._sqClosestPointOnSegment(e, i, s))
            }
        }
        return o && (o.distance = Math.sqrt(t)), o
    }, getBounds: function () {
        var e = new n.LatLngBounds, t = this.getLatLngs();
        for (var r = 0, i = t.length; r < i; r++)e.extend(t[r]);
        return e
    }, onAdd: function (e) {
        n.Path.prototype.onAdd.call(this, e), this.editing && this.editing.enabled() && this.editing.addHooks()
    }, onRemove: function (e) {
        this.editing && this.editing.enabled() && this.editing.removeHooks(), n.Path.prototype.onRemove.call(this, e)
    }, _convertLatLngs: function (e) {
        var t, r;
        for (t = 0, r = e.length; t < r; t++) {
            if (e[t]instanceof Array && typeof e[t][0] != "number")return;
            e[t] = n.latLng(e[t])
        }
        return e
    }, _initEvents: function () {
        n.Path.prototype._initEvents.call(this)
    }, _getPathPartStr: function (e) {
        var t = n.Path.VML;
        for (var r = 0, i = e.length, s = "", o; r < i; r++)o = e[r], t && o._round(), s += (r ? "L" : "M") + o.x + " " + o.y;
        return s
    }, _clipPoints: function () {
        var e = this._originalPoints, t = e.length, r, i, s;
        if (this.options.noClip) {
            this._parts = [e];
            return
        }
        this._parts = [];
        var o = this._parts, u = this._map._pathViewport, a = n.LineUtil;
        for (r = 0, i = 0; r < t - 1; r++) {
            s = a.clipSegment(e[r], e[r + 1], u, r);
            if (!s)continue;
            o[i] = o[i] || [], o[i].push(s[0]);
            if (s[1] !== e[r + 1] || r === t - 2)o[i].push(s[1]), i++
        }
    }, _simplifyPoints: function () {
        var e = this._parts, t = n.LineUtil;
        for (var r = 0, i = e.length; r < i; r++)e[r] = t.simplify(e[r], this.options.smoothFactor)
    }, _updatePath: function () {
        if (!this._map)return;
        this._clipPoints(), this._simplifyPoints(), n.Path.prototype._updatePath.call(this)
    }}), n.polyline = function (e, t) {
        return new n.Polyline(e, t)
    }, n.PolyUtil = {}, n.PolyUtil.clipPolygon = function (e, t) {
        var r = t.min, i = t.max, s, o = [1, 4, 2, 8], u, a, f, l, c, h, p, d, v = n.LineUtil;
        for (u = 0, h = e.length; u < h; u++)e[u]._code = v._getBitCode(e[u], t);
        for (f = 0; f < 4; f++) {
            p = o[f], s = [];
            for (u = 0, h = e.length, a = h - 1; u < h; a = u++)l = e[u], c = e[a], l._code & p ? c._code & p || (d = v._getEdgeIntersection(c, l, p, t), d._code = v._getBitCode(d, t), s.push(d)) : (c._code & p && (d = v._getEdgeIntersection(c, l, p, t), d._code = v._getBitCode(d, t), s.push(d)), s.push(l));
            e = s
        }
        return e
    }, n.Polygon = n.Polyline.extend({options: {fill: !0}, initialize: function (e, t) {
        n.Polyline.prototype.initialize.call(this, e, t), e && e[0]instanceof Array && typeof e[0][0] != "number" && (this._latlngs = this._convertLatLngs(e[0]), this._holes = e.slice(1))
    }, projectLatlngs: function () {
        n.Polyline.prototype.projectLatlngs.call(this), this._holePoints = [];
        if (!this._holes)return;
        for (var e = 0, t = this._holes.length, r; e < t; e++) {
            this._holePoints[e] = [];
            for (var i = 0, s = this._holes[e].length; i < s; i++)this._holePoints[e][i] = this._map.latLngToLayerPoint(this._holes[e][i])
        }
    }, _clipPoints: function () {
        var e = this._originalPoints, t = [];
        this._parts = [e].concat(this._holePoints);
        if (this.options.noClip)return;
        for (var r = 0, i = this._parts.length; r < i; r++) {
            var s = n.PolyUtil.clipPolygon(this._parts[r], this._map._pathViewport);
            if (!s.length)continue;
            t.push(s)
        }
        this._parts = t
    }, _getPathPartStr: function (e) {
        var t = n.Polyline.prototype._getPathPartStr.call(this, e);
        return t + (n.Browser.svg ? "z" : "x")
    }}), n.polygon = function (e, t) {
        return new n.Polygon(e, t)
    }, function () {
        function e(e) {
            return n.FeatureGroup.extend({initialize: function (e, t) {
                this._layers = {}, this._options = t, this.setLatLngs(e)
            }, setLatLngs: function (t) {
                var n = 0, r = t.length;
                this.eachLayer(function (e) {
                    n < r ? e.setLatLngs(t[n++]) : this.removeLayer(e)
                }, this);
                while (n < r)this.addLayer(new e(t[n++], this._options));
                return this
            }})
        }

        n.MultiPolyline = e(n.Polyline), n.MultiPolygon = e(n.Polygon), n.multiPolyline = function (e, t) {
            return new n.MultiPolyline(e, t)
        }, n.multiPolygon = function (e, t) {
            return new n.MultiPolygon(e, t)
        }
    }(), n.Rectangle = n.Polygon.extend({initialize: function (e, t) {
        n.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(e), t)
    }, setBounds: function (e) {
        this.setLatLngs(this._boundsToLatLngs(e))
    }, _boundsToLatLngs: function (e) {
        return e = n.latLngBounds(e), [e.getSouthWest(), e.getNorthWest(), e.getNorthEast(), e.getSouthEast(), e.getSouthWest()]
    }}), n.rectangle = function (e, t) {
        return new n.Rectangle(e, t)
    }, n.Circle = n.Path.extend({initialize: function (e, t, r) {
        n.Path.prototype.initialize.call(this, r), this._latlng = n.latLng(e), this._mRadius = t
    }, options: {fill: !0}, setLatLng: function (e) {
        return this._latlng = n.latLng(e), this.redraw()
    }, setRadius: function (e) {
        return this._mRadius = e, this.redraw()
    }, projectLatlngs: function () {
        var e = this._getLngRadius(), t = new n.LatLng(this._latlng.lat, this._latlng.lng - e, !0), r = this._map.latLngToLayerPoint(t);
        this._point = this._map.latLngToLayerPoint(this._latlng), this._radius = Math.max(Math.round(this._point.x - r.x), 1)
    }, getBounds: function () {
        var e = this._map, t = this._radius * Math.cos(Math.PI / 4), r = e.project(this._latlng), i = new n.Point(r.x - t, r.y + t), s = new n.Point(r.x + t, r.y - t), o = e.unproject(i), u = e.unproject(s);
        return new n.LatLngBounds(o, u)
    }, getLatLng: function () {
        return this._latlng
    }, getPathString: function () {
        var e = this._point, t = this._radius;
        return this._checkIfEmpty() ? "" : n.Browser.svg ? "M" + e.x + "," + (e.y - t) + "A" + t + "," + t + ",0,1,1," + (e.x - .1) + "," + (e.y - t) + " z" : (e._round(), t = Math.round(t), "AL " + e.x + "," + e.y + " " + t + "," + t + " 0," + 23592600)
    }, getRadius: function () {
        return this._mRadius
    }, _getLngRadius: function () {
        var e = 40075017, t = e * Math.cos(n.LatLng.DEG_TO_RAD * this._latlng.lat);
        return this._mRadius / t * 360
    }, _checkIfEmpty: function () {
        if (!this._map)return!1;
        var e = this._map._pathViewport, t = this._radius, n = this._point;
        return n.x - t > e.max.x || n.y - t > e.max.y || n.x + t < e.min.x || n.y + t < e.min.y
    }}), n.circle = function (e, t, r) {
        return new n.Circle(e, t, r)
    }, n.CircleMarker = n.Circle.extend({options: {radius: 10, weight: 2}, initialize: function (e, t) {
        n.Circle.prototype.initialize.call(this, e, null, t), this._radius = this.options.radius
    }, projectLatlngs: function () {
        this._point = this._map.latLngToLayerPoint(this._latlng)
    }, setRadius: function (e) {
        return this._radius = e, this.redraw()
    }}), n.circleMarker = function (e, t) {
        return new n.CircleMarker(e, t)
    }, n.Polyline.include(n.Path.CANVAS ? {_containsPoint: function (e, t) {
        var r, i, s, o, u, a, f, l = this.options.weight / 2;
        n.Browser.touch && (l += 10);
        for (r = 0, o = this._parts.length; r < o; r++) {
            f = this._parts[r];
            for (i = 0, u = f.length, s = u - 1; i < u; s = i++) {
                if (!t && i === 0)continue;
                a = n.LineUtil.pointToSegmentDistance(e, f[s], f[i]);
                if (a <= l)return!0
            }
        }
        return!1
    }} : {}), n.Polygon.include(n.Path.CANVAS ? {_containsPoint: function (e) {
        var t = !1, r, i, s, o, u, a, f, l;
        if (n.Polyline.prototype._containsPoint.call(this, e, !0))return!0;
        for (o = 0, f = this._parts.length; o < f; o++) {
            r = this._parts[o];
            for (u = 0, l = r.length, a = l - 1; u < l; a = u++)i = r[u], s = r[a], i.y > e.y != s.y > e.y && e.x < (s.x - i.x) * (e.y - i.y) / (s.y - i.y) + i.x && (t = !t)
        }
        return t
    }} : {}), n.Circle.include(n.Path.CANVAS ? {_drawPath: function () {
        var e = this._point;
        this._ctx.beginPath(), this._ctx.arc(e.x, e.y, this._radius, 0, Math.PI * 2, !1)
    }, _containsPoint: function (e) {
        var t = this._point, n = this.options.stroke ? this.options.weight / 2 : 0;
        return e.distanceTo(t) <= this._radius + n
    }} : {}), n.GeoJSON = n.FeatureGroup.extend({initialize: function (e, t) {
        n.Util.setOptions(this, t), this._layers = {}, e && this.addData(e)
    }, addData: function (e) {
        var t = e instanceof Array ? e : e.features, r, i;
        if (t) {
            for (r = 0, i = t.length; r < i; r++)this.addData(t[r]);
            return this
        }
        var s = this.options;
        if (s.filter && !s.filter(e))return;
        var o = n.GeoJSON.geometryToLayer(e, s.pointToLayer);
        return o.feature = e, this.resetStyle(o), s.onEachFeature && s.onEachFeature(e, o), this.addLayer(o)
    }, resetStyle: function (e) {
        var t = this.options.style;
        t && this._setLayerStyle(e, t)
    }, setStyle: function (e) {
        this.eachLayer(function (t) {
            this._setLayerStyle(t, e)
        }, this)
    }, _setLayerStyle: function (e, t) {
        typeof t == "function" && (t = t(e.feature)), e.setStyle && e.setStyle(t)
    }}), n.Util.extend(n.GeoJSON, {geometryToLayer: function (e, t) {
        var r = e.type === "Feature" ? e.geometry : e, i = r.coordinates, s = [], o, u, a, f, l;
        switch (r.type) {
            case"Point":
                return o = this.coordsToLatLng(i), t ? t(e, o) : new n.Marker(o);
            case"MultiPoint":
                for (a = 0, f = i.length; a < f; a++)o = this.coordsToLatLng(i[a]), l = t ? t(e, o) : new n.Marker(o), s.push(l);
                return new n.FeatureGroup(s);
            case"LineString":
                return u = this.coordsToLatLngs(i), new n.Polyline(u);
            case"Polygon":
                return u = this.coordsToLatLngs(i, 1), new n.Polygon(u);
            case"MultiLineString":
                return u = this.coordsToLatLngs(i, 1), new n.MultiPolyline(u);
            case"MultiPolygon":
                return u = this.coordsToLatLngs(i, 2), new n.MultiPolygon(u);
            case"GeometryCollection":
                for (a = 0, f = r.geometries.length; a < f; a++)l = this.geometryToLayer(r.geometries[a], t), s.push(l);
                return new n.FeatureGroup(s);
            default:
                throw Error("Invalid GeoJSON object.")
        }
    }, coordsToLatLng: function (e, t) {
        var r = parseFloat(e[t ? 0 : 1]), i = parseFloat(e[t ? 1 : 0]);
        return new n.LatLng(r, i, !0)
    }, coordsToLatLngs: function (e, t, n) {
        var r, i = [], s, o;
        for (s = 0, o = e.length; s < o; s++)r = t ? this.coordsToLatLngs(e[s], t - 1, n) : this.coordsToLatLng(e[s], n), i.push(r);
        return i
    }}), n.geoJson = function (e, t) {
        return new n.GeoJSON(e, t)
    }, n.DomEvent = {addListener: function (e, t, r, i) {
        var s = n.Util.stamp(r), o = "_leaflet_" + t + s, u, a, f;
        return e[o] ? this : (u = function (t) {
            return r.call(i || e, t || n.DomEvent._getEvent())
        }, n.Browser.touch && t === "dblclick" && this.addDoubleTapListener ? this.addDoubleTapListener(e, u, s) : ("addEventListener"in e ? t === "mousewheel" ? (e.addEventListener("DOMMouseScroll", u, !1), e.addEventListener(t, u, !1)) : t === "mouseenter" || t === "mouseleave" ? (a = u, f = t === "mouseenter" ? "mouseover" : "mouseout", u = function (t) {
            if (!n.DomEvent._checkMouse(e, t))return;
            return a(t)
        }, e.addEventListener(f, u, !1)) : e.addEventListener(t, u, !1) : "attachEvent"in e && e.attachEvent("on" + t, u), e[o] = u, this))
    }, removeListener: function (e, t, r) {
        var i = n.Util.stamp(r), s = "_leaflet_" + t + i, o = e[s];
        if (!o)return;
        return n.Browser.touch && t === "dblclick" && this.removeDoubleTapListener ? this.removeDoubleTapListener(e, i) : "removeEventListener"in e ? t === "mousewheel" ? (e.removeEventListener("DOMMouseScroll", o, !1), e.removeEventListener(t, o, !1)) : t === "mouseenter" || t === "mouseleave" ? e.removeEventListener(t === "mouseenter" ? "mouseover" : "mouseout", o, !1) : e.removeEventListener(t, o, !1) : "detachEvent"in e && e.detachEvent("on" + t, o), e[s] = null, this
    }, stopPropagation: function (e) {
        return e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0, this
    }, disableClickPropagation: function (e) {
        var t = n.DomEvent.stopPropagation;
        return n.DomEvent.addListener(e, n.Draggable.START, t).addListener(e, "click", t).addListener(e, "dblclick", t)
    }, preventDefault: function (e) {
        return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this
    }, stop: function (e) {
        return n.DomEvent.preventDefault(e).stopPropagation(e)
    }, getMousePosition: function (e, t) {
        var r = document.body, i = document.documentElement, s = e.pageX ? e.pageX : e.clientX + r.scrollLeft + i.scrollLeft, o = e.pageY ? e.pageY : e.clientY + r.scrollTop + i.scrollTop, u = new n.Point(s, o);
        return t ? u._subtract(n.DomUtil.getViewportOffset(t)) : u
    }, getWheelDelta: function (e) {
        var t = 0;
        return e.wheelDelta && (t = e.wheelDelta / 120), e.detail && (t = -e.detail / 3), t
    }, _checkMouse: function (e, t) {
        var n = t.relatedTarget;
        if (!n)return!0;
        try {
            while (n && n !== e)n = n.parentNode
        } catch (r) {
            return!1
        }
        return n !== e
    }, _getEvent: function () {
        var t = e.event;
        if (!t) {
            var n = arguments.callee.caller;
            while (n) {
                t = n.arguments[0];
                if (t && e.Event === t.constructor)break;
                n = n.caller
            }
        }
        return t
    }}, n.DomEvent.on = n.DomEvent.addListener, n.DomEvent.off = n.DomEvent.removeListener, n.Draggable = n.Class.extend({includes: n.Mixin.Events, statics: {START: n.Browser.touch ? "touchstart" : "mousedown", END: n.Browser.touch ? "touchend" : "mouseup", MOVE: n.Browser.touch ? "touchmove" : "mousemove", TAP_TOLERANCE: 15}, initialize: function (e, t) {
        this._element = e, this._dragStartTarget = t || e
    }, enable: function () {
        if (this._enabled)return;
        n.DomEvent.on(this._dragStartTarget, n.Draggable.START, this._onDown, this), this._enabled = !0
    }, disable: function () {
        if (!this._enabled)return;
        n.DomEvent.off(this._dragStartTarget, n.Draggable.START, this._onDown), this._enabled = !1, this._moved = !1
    }, _onDown: function (e) {
        if (!n.Browser.touch && e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches)return;
        this._simulateClick = !0;
        if (e.touches && e.touches.length > 1) {
            this._simulateClick = !1;
            return
        }
        var t = e.touches && e.touches.length === 1 ? e.touches[0] : e, r = t.target;
        n.DomEvent.preventDefault(e), n.Browser.touch && r.tagName.toLowerCase() === "a" && n.DomUtil.addClass(r, "leaflet-active"), this._moved = !1;
        if (this._moving)return;
        this._startPos = this._newPos = n.DomUtil.getPosition(this._element), this._startPoint = new n.Point(t.clientX, t.clientY), n.DomEvent.on(document, n.Draggable.MOVE, this._onMove, this), n.DomEvent.on(document, n.Draggable.END, this._onUp, this)
    }, _onMove: function (e) {
        if (e.touches && e.touches.length > 1)return;
        var t = e.touches && e.touches.length === 1 ? e.touches[0] : e, r = new n.Point(t.clientX, t.clientY), i = r.subtract(this._startPoint);
        if (!i.x && !i.y)return;
        n.DomEvent.preventDefault(e), this._moved || (this.fire("dragstart"), this._moved = !0, n.Browser.touch || (n.DomUtil.disableTextSelection(), this._setMovingCursor())), this._newPos = this._startPos.add(i), this._moving = !0, n.Util.cancelAnimFrame(this._animRequest), this._animRequest = n.Util.requestAnimFrame(this._updatePosition, this, !0, this._dragStartTarget)
    }, _updatePosition: function () {
        this.fire("predrag"), n.DomUtil.setPosition(this._element, this._newPos), this.fire("drag")
    }, _onUp: function (e) {
        if (this._simulateClick && e.changedTouches) {
            var t = e.changedTouches[0], r = t.target, i = this._newPos && this._newPos.distanceTo(this._startPos) || 0;
            r.tagName.toLowerCase() === "a" && n.DomUtil.removeClass(r, "leaflet-active"), i < n.Draggable.TAP_TOLERANCE && this._simulateEvent("click", t)
        }
        n.Browser.touch || (n.DomUtil.enableTextSelection(), this._restoreCursor()), n.DomEvent.off(document, n.Draggable.MOVE, this._onMove), n.DomEvent.off(document, n.Draggable.END, this._onUp), this._moved && (n.Util.cancelAnimFrame(this._animRequest), this.fire("dragend")), this._moving = !1
    }, _setMovingCursor: function () {
        n.DomUtil.addClass(document.body, "leaflet-dragging")
    }, _restoreCursor: function () {
        n.DomUtil.removeClass(document.body, "leaflet-dragging")
    }, _simulateEvent: function (t, n) {
        var r = document.createEvent("MouseEvents");
        r.initMouseEvent(t, !0, !0, e, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null), n.target.dispatchEvent(r)
    }}), n.Handler = n.Class.extend({initialize: function (e) {
        this._map = e
    }, enable: function () {
        if (this._enabled)return;
        this._enabled = !0, this.addHooks()
    }, disable: function () {
        if (!this._enabled)return;
        this._enabled = !1, this.removeHooks()
    }, enabled: function () {
        return!!this._enabled
    }}), n.Map.mergeOptions({dragging: !0, inertia: !n.Browser.android23, inertiaDeceleration: 3e3, inertiaMaxSpeed: 1500, inertiaThreshold: n.Browser.touch ? 32 : 14, worldCopyJump: !0}), n.Map.Drag = n.Handler.extend({addHooks: function () {
        if (!this._draggable) {
            this._draggable = new n.Draggable(this._map._mapPane, this._map._container), this._draggable.on({dragstart: this._onDragStart, drag: this._onDrag, dragend: this._onDragEnd}, this);
            var e = this._map.options;
            e.worldCopyJump && (this._draggable.on("predrag", this._onPreDrag, this), this._map.on("viewreset", this._onViewReset, this))
        }
        this._draggable.enable()
    }, removeHooks: function () {
        this._draggable.disable()
    }, moved: function () {
        return this._draggable && this._draggable._moved
    }, _onDragStart: function () {
        var e = this._map;
        e.fire("movestart").fire("dragstart"), e._panTransition && e._panTransition._onTransitionEnd(!0), e.options.inertia && (this._positions = [], this._times = [])
    }, _onDrag: function () {
        if (this._map.options.inertia) {
            var e = this._lastTime = +(new Date), t = this._lastPos = this._draggable._newPos;
            this._positions.push(t), this._times.push(e), e - this._times[0] > 200 && (this._positions.shift(), this._times.shift())
        }
        this._map.fire("move").fire("drag")
    }, _onViewReset: function () {
        var e = this._map.getSize().divideBy(2), t = this._map.latLngToLayerPoint(new n.LatLng(0, 0));
        this._initialWorldOffset = t.subtract(e).x, this._worldWidth = this._map.project(new n.LatLng(0, 180)).x
    }, _onPreDrag: function () {
        var e = this._map, t = this._worldWidth, n = Math.round(t / 2), r = this._initialWorldOffset, i = this._draggable._newPos.x, s = (i - n + r) % t + n - r, o = (i + n + r) % t - n - r, u = Math.abs(s + r) < Math.abs(o + r) ? s : o;
        this._draggable._newPos.x = u
    }, _onDragEnd: function () {
        var e = this._map, r = e.options, i = +(new Date) - this._lastTime, s = !r.inertia || i > r.inertiaThreshold || this._positions[0] === t;
        if (s)e.fire("moveend"); else {
            var o = this._lastPos.subtract(this._positions[0]), u = (this._lastTime + i - this._times[0]) / 1e3, a = o.multiplyBy(.58 / u), f = a.distanceTo(new n.Point(0, 0)), l = Math.min(r.inertiaMaxSpeed, f), c = a.multiplyBy(l / f), h = l / r.inertiaDeceleration, p = c.multiplyBy(-h / 2).round(), d = {duration: h, easing: "ease-out"};
            n.Util.requestAnimFrame(n.Util.bind(function () {
                this._map.panBy(p, d)
            }, this))
        }
        e.fire("dragend"), r.maxBounds && n.Util.requestAnimFrame(this._panInsideMaxBounds, e, !0, e._container)
    }, _panInsideMaxBounds: function () {
        this.panInsideBounds(this.options.maxBounds)
    }}), n.Map.addInitHook("addHandler", "dragging", n.Map.Drag), n.Map.mergeOptions({doubleClickZoom: !0}), n.Map.DoubleClickZoom = n.Handler.extend({addHooks: function () {
        this._map.on("dblclick", this._onDoubleClick)
    }, removeHooks: function () {
        this._map.off("dblclick", this._onDoubleClick)
    }, _onDoubleClick: function (e) {
        this.setView(e.latlng, this._zoom + 1)
    }}), n.Map.addInitHook("addHandler", "doubleClickZoom", n.Map.DoubleClickZoom), n.Map.mergeOptions({scrollWheelZoom: !n.Browser.touch}), n.Map.ScrollWheelZoom = n.Handler.extend({addHooks: function () {
        n.DomEvent.on(this._map._container, "mousewheel", this._onWheelScroll, this), this._delta = 0
    }, removeHooks: function () {
        n.DomEvent.off(this._map._container, "mousewheel", this._onWheelScroll)
    }, _onWheelScroll: function (e) {
        var t = n.DomEvent.getWheelDelta(e);
        this._delta += t, this._lastMousePos = this._map.mouseEventToContainerPoint(e), clearTimeout(this._timer), this._timer = setTimeout(n.Util.bind(this._performZoom, this), 40), n.DomEvent.preventDefault(e)
    }, _performZoom: function () {
        var e = this._map, t = Math.round(this._delta), n = e.getZoom();
        t = Math.max(Math.min(t, 4), -4), t = e._limitZoom(n + t) - n, this._delta = 0;
        if (!t)return;
        var r = n + t, i = this._getCenterForScrollWheelZoom(this._lastMousePos, r);
        e.setView(i, r)
    }, _getCenterForScrollWheelZoom: function (e, t) {
        var n = this._map, r = n.getZoomScale(t), i = n.getSize().divideBy(2), s = e.subtract(i).multiplyBy(1 - 1 / r), o = n._getTopLeftPoint().add(i).add(s);
        return n.unproject(o)
    }}), n.Map.addInitHook("addHandler", "scrollWheelZoom", n.Map.ScrollWheelZoom), n.Util.extend(n.DomEvent, {addDoubleTapListener: function (e, t, n) {
        function l(e) {
            if (e.touches.length !== 1)return;
            var t = Date.now(), n = t - (r || t);
            o = e.touches[0], i = n > 0 && n <= s, r = t
        }

        function c(e) {
            i && (o.type = "dblclick", t(o), r = null)
        }

        var r, i = !1, s = 250, o, u = "_leaflet_", a = "touchstart", f = "touchend";
        return e[u + a + n] = l, e[u + f + n] = c, e.addEventListener(a, l, !1), e.addEventListener(f, c, !1), this
    }, removeDoubleTapListener: function (e, t) {
        var n = "_leaflet_";
        return e.removeEventListener(e, e[n + "touchstart" + t], !1), e.removeEventListener(e, e[n + "touchend" + t], !1), this
    }}), n.Map.mergeOptions({touchZoom: n.Browser.touch && !n.Browser.android23}), n.Map.TouchZoom = n.Handler.extend({addHooks: function () {
        n.DomEvent.on(this._map._container, "touchstart", this._onTouchStart, this)
    }, removeHooks: function () {
        n.DomEvent.off(this._map._container, "touchstart", this._onTouchStart, this)
    }, _onTouchStart: function (e) {
        var t = this._map;
        if (!e.touches || e.touches.length !== 2 || t._animatingZoom || this._zooming)return;
        var r = t.mouseEventToLayerPoint(e.touches[0]), i = t.mouseEventToLayerPoint(e.touches[1]), s = t._getCenterLayerPoint();
        this._startCenter = r.add(i).divideBy(2, !0), this._startDist = r.distanceTo(i), this._moved = !1, this._zooming = !0, this._centerOffset = s.subtract(this._startCenter), n.DomEvent.on(document, "touchmove", this._onTouchMove, this).on(document, "touchend", this._onTouchEnd, this), n.DomEvent.preventDefault(e)
    }, _onTouchMove: function (e) {
        if (!e.touches || e.touches.length !== 2)return;
        var t = this._map, r = t.mouseEventToLayerPoint(e.touches[0]), i = t.mouseEventToLayerPoint(e.touches[1]);
        this._scale = r.distanceTo(i) / this._startDist, this._delta = r.add(i).divideBy(2, !0).subtract(this._startCenter);
        if (this._scale === 1)return;
        this._moved || (n.DomUtil.addClass(t._mapPane, "leaflet-zoom-anim leaflet-touching"), t.fire("movestart").fire("zoomstart")._prepareTileBg(), this._moved = !0), n.Util.cancelAnimFrame(this._animRequest), this._animRequest = n.Util.requestAnimFrame(this._updateOnMove, this, !0, this._map._container), n.DomEvent.preventDefault(e)
    }, _updateOnMove: function () {
        var e = this._map, t = this._getScaleOrigin(), r = e.layerPointToLatLng(t);
        e.fire("zoomanim", {center: r, zoom: e.getScaleZoom(this._scale)}), e._tileBg.style[n.DomUtil.TRANSFORM] = n.DomUtil.getTranslateString(this._delta) + " " + n.DomUtil.getScaleString(this._scale, this._startCenter)
    }, _onTouchEnd: function (e) {
        if (!this._moved || !this._zooming)return;
        var t = this._map;
        this._zooming = !1, n.DomUtil.removeClass(t._mapPane, "leaflet-touching"), n.DomEvent.off(document, "touchmove", this._onTouchMove).off(document, "touchend", this._onTouchEnd);
        var r = this._getScaleOrigin(), i = t.layerPointToLatLng(r), s = t.getZoom(), o = t.getScaleZoom(this._scale) - s, u = o > 0 ? Math.ceil(o) : Math.floor(o), a = t._limitZoom(s + u);
        t.fire("zoomanim", {center: i, zoom: a}), t._runAnimation(i, a, t.getZoomScale(a) / this._scale, r, !0)
    }, _getScaleOrigin: function () {
        var e = this._centerOffset.subtract(this._delta).divideBy(this._scale);
        return this._startCenter.add(e)
    }}), n.Map.addInitHook("addHandler", "touchZoom", n.Map.TouchZoom), n.Map.mergeOptions({boxZoom: !0}), n.Map.BoxZoom = n.Handler.extend({initialize: function (e) {
        this._map = e, this._container = e._container, this._pane = e._panes.overlayPane
    }, addHooks: function () {
        n.DomEvent.on(this._container, "mousedown", this._onMouseDown, this)
    }, removeHooks: function () {
        n.DomEvent.off(this._container, "mousedown", this._onMouseDown)
    }, _onMouseDown: function (e) {
        if (!e.shiftKey || e.which !== 1 && e.button !== 1)return!1;
        n.DomUtil.disableTextSelection(), this._startLayerPoint = this._map.mouseEventToLayerPoint(e), this._box = n.DomUtil.create("div", "leaflet-zoom-box", this._pane), n.DomUtil.setPosition(this._box, this._startLayerPoint), this._container.style.cursor = "crosshair", n.DomEvent.on(document, "mousemove", this._onMouseMove, this).on(document, "mouseup", this._onMouseUp, this).preventDefault(e), this._map.fire("boxzoomstart")
    }, _onMouseMove: function (e) {
        var t = this._startLayerPoint, r = this._box, i = this._map.mouseEventToLayerPoint(e), s = i.subtract(t), o = new n.Point(Math.min(i.x, t.x), Math.min(i.y, t.y));
        n.DomUtil.setPosition(r, o), r.style.width = Math.abs(s.x) - 4 + "px", r.style.height = Math.abs(s.y) - 4 + "px"
    }, _onMouseUp: function (e) {
        this._pane.removeChild(this._box), this._container.style.cursor = "", n.DomUtil.enableTextSelection(), n.DomEvent.off(document, "mousemove", this._onMouseMove).off(document, "mouseup", this._onMouseUp);
        var t = this._map, r = t.mouseEventToLayerPoint(e), i = new n.LatLngBounds(t.layerPointToLatLng(this._startLayerPoint), t.layerPointToLatLng(r));
        t.fitBounds(i), t.fire("boxzoomend", {boxZoomBounds: i})
    }}), n.Map.addInitHook("addHandler", "boxZoom", n.Map.BoxZoom), n.Map.mergeOptions({keyboard: !0, keyboardPanOffset: 80, keyboardZoomOffset: 1}), n.Map.Keyboard = n.Handler.extend({keyCodes: {left: [37], right: [39], down: [40], up: [38], zoomIn: [187, 107, 61], zoomOut: [189, 109]}, initialize: function (e) {
        this._map = e, this._setPanOffset(e.options.keyboardPanOffset), this._setZoomOffset(e.options.keyboardZoomOffset)
    }, addHooks: function () {
        var e = this._map._container;
        e.tabIndex === -1 && (e.tabIndex = "0"), n.DomEvent.addListener(e, "focus", this._onFocus, this).addListener(e, "blur", this._onBlur, this).addListener(e, "mousedown", this._onMouseDown, this), this._map.on("focus", this._addHooks, this).on("blur", this._removeHooks, this)
    }, removeHooks: function () {
        this._removeHooks();
        var e = this._map._container;
        n.DomEvent.removeListener(e, "focus", this._onFocus, this).removeListener(e, "blur", this._onBlur, this).removeListener(e, "mousedown", this._onMouseDown, this), this._map.off("focus", this._addHooks, this).off("blur", this._removeHooks, this)
    }, _onMouseDown: function () {
        this._focused || this._map._container.focus()
    }, _onFocus: function () {
        this._focused = !0, this._map.fire("focus")
    }, _onBlur: function () {
        this._focused = !1, this._map.fire("blur")
    }, _setPanOffset: function (e) {
        var t = this._panKeys = {}, n = this.keyCodes, r, i;
        for (r = 0, i = n.left.length; r < i; r++)t[n.left[r]] = [-1 * e, 0];
        for (r = 0, i = n.right.length; r < i; r++)t[n.right[r]] = [e, 0];
        for (r = 0, i = n.down.length; r < i; r++)t[n.down[r]] = [0, e];
        for (r = 0, i = n.up.length; r < i; r++)t[n.up[r]] = [0, -1 * e]
    }, _setZoomOffset: function (e) {
        var t = this._zoomKeys = {}, n = this.keyCodes, r, i;
        for (r = 0, i = n.zoomIn.length; r < i; r++)t[n.zoomIn[r]] = e;
        for (r = 0, i = n.zoomOut.length; r < i; r++)t[n.zoomOut[r]] = -e
    }, _addHooks: function () {
        n.DomEvent.addListener(document, "keydown", this._onKeyDown, this)
    }, _removeHooks: function () {
        n.DomEvent.removeListener(document, "keydown", this._onKeyDown, this)
    }, _onKeyDown: function (e) {
        var t = e.keyCode;
        if (this._panKeys.hasOwnProperty(t))this._map.panBy(this._panKeys[t]); else {
            if (!this._zoomKeys.hasOwnProperty(t))return;
            this._map.setZoom(this._map.getZoom() + this._zoomKeys[t])
        }
        n.DomEvent.stop(e)
    }}), n.Map.addInitHook("addHandler", "keyboard", n.Map.Keyboard), n.Handler.MarkerDrag = n.Handler.extend({initialize: function (e) {
        this._marker = e
    }, addHooks: function () {
        var e = this._marker._icon;
        this._draggable || (this._draggable = (new n.Draggable(e, e)).on("dragstart", this._onDragStart, this).on("drag", this._onDrag, this).on("dragend", this._onDragEnd, this)), this._draggable.enable()
    }, removeHooks: function () {
        this._draggable.disable()
    }, moved: function () {
        return this._draggable && this._draggable._moved
    }, _onDragStart: function (e) {
        this._marker.closePopup().fire("movestart").fire("dragstart")
    }, _onDrag: function (e) {
        var t = n.DomUtil.getPosition(this._marker._icon);
        this._marker._shadow && n.DomUtil.setPosition(this._marker._shadow, t), this._marker._latlng = this._marker._map.layerPointToLatLng(t), this._marker.fire("move").fire("drag")
    }, _onDragEnd: function () {
        this._marker.fire("moveend").fire("dragend")
    }}), n.Handler.PolyEdit = n.Handler.extend({options: {icon: new n.DivIcon({iconSize: new n.Point(8, 8), className: "leaflet-div-icon leaflet-editing-icon"})}, initialize: function (e, t) {
        this._poly = e, n.Util.setOptions(this, t)
    }, addHooks: function () {
        this._poly._map && (this._markerGroup || this._initMarkers(), this._poly._map.addLayer(this._markerGroup))
    }, removeHooks: function () {
        this._poly._map && (this._poly._map.removeLayer(this._markerGroup), delete this._markerGroup, delete this._markers)
    }, updateMarkers: function () {
        this._markerGroup.clearLayers(), this._initMarkers()
    }, _initMarkers: function () {
        this._markerGroup || (this._markerGroup = new n.LayerGroup), this._markers = [];
        var e = this._poly._latlngs, t, r, i, s;
        for (t = 0, i = e.length; t < i; t++)s = this._createMarker(e[t], t), s.on("click", this._onMarkerClick, this), this._markers.push(s);
        var o, u;
        for (t = 0, r = i - 1; t < i; r = t++) {
            if (t === 0 && !(n.Polygon && this._poly instanceof n.Polygon))continue;
            o = this._markers[r], u = this._markers[t], this._createMiddleMarker(o, u), this._updatePrevNext(o, u)
        }
    }, _createMarker: function (e, t) {
        var r = new n.Marker(e, {draggable: !0, icon: this.options.icon});
        return r._origLatLng = e, r._index = t, r.on("drag", this._onMarkerDrag, this), r.on("dragend", this._fireEdit, this), this._markerGroup.addLayer(r), r
    }, _fireEdit: function () {
        this._poly.fire("edit")
    }, _onMarkerDrag: function (e) {
        var t = e.target;
        n.Util.extend(t._origLatLng, t._latlng), t._middleLeft && t._middleLeft.setLatLng(this._getMiddleLatLng(t._prev, t)), t._middleRight && t._middleRight.setLatLng(this._getMiddleLatLng(t, t._next)), this._poly.redraw()
    }, _onMarkerClick: function (e) {
        if (this._poly._latlngs.length < 3)return;
        var t = e.target, n = t._index;
        t._prev && t._next && (this._createMiddleMarker(t._prev, t._next), this._updatePrevNext(t._prev, t._next)), this._markerGroup.removeLayer(t), t._middleLeft && this._markerGroup.removeLayer(t._middleLeft), t._middleRight && this._markerGroup.removeLayer(t._middleRight), this._markers.splice(n, 1), this._poly.spliceLatLngs(n, 1), this._updateIndexes(n, -1), this._poly.fire("edit")
    }, _updateIndexes: function (e, t) {
        this._markerGroup.eachLayer(function (n) {
            n._index > e && (n._index += t)
        })
    }, _createMiddleMarker: function (e, t) {
        var n = this._getMiddleLatLng(e, t), r = this._createMarker(n), i, s, o;
        r.setOpacity(.6), e._middleRight = t._middleLeft = r, s = function () {
            var s = t._index;
            r._index = s, r.off("click", i).on("click", this._onMarkerClick, this), n.lat = r.getLatLng().lat, n.lng = r.getLatLng().lng, this._poly.spliceLatLngs(s, 0, n), this._markers.splice(s, 0, r), r.setOpacity(1), this._updateIndexes(s, 1), t._index++, this._updatePrevNext(e, r), this._updatePrevNext(r, t)
        }, o = function () {
            r.off("dragstart", s, this), r.off("dragend", o, this), this._createMiddleMarker(e, r), this._createMiddleMarker(r, t)
        }, i = function () {
            s.call(this), o.call(this), this._poly.fire("edit")
        }, r.on("click", i, this).on("dragstart", s, this).on("dragend", o, this), this._markerGroup.addLayer(r)
    }, _updatePrevNext: function (e, t) {
        e._next = t, t._prev = e
    }, _getMiddleLatLng: function (e, t) {
        var n = this._poly._map, r = n.latLngToLayerPoint(e.getLatLng()), i = n.latLngToLayerPoint(t.getLatLng());
        return n.layerPointToLatLng(r._add(i).divideBy(2))
    }}), n.Control = n.Class.extend({options: {position: "topright"}, initialize: function (e) {
        n.Util.setOptions(this, e)
    }, getPosition: function () {
        return this.options.position
    }, setPosition: function (e) {
        var t = this._map;
        return t && t.removeControl(this), this.options.position = e, t && t.addControl(this), this
    }, addTo: function (e) {
        this._map = e;
        var t = this._container = this.onAdd(e), r = this.getPosition(), i = e._controlCorners[r];
        return n.DomUtil.addClass(t, "leaflet-control"), r.indexOf("bottom") !== -1 ? i.insertBefore(t, i.firstChild) : i.appendChild(t), this
    }, removeFrom: function (e) {
        var t = this.getPosition(), n = e._controlCorners[t];
        return n.removeChild(this._container), this._map = null, this.onRemove && this.onRemove(e), this
    }}), n.control = function (e) {
        return new n.Control(e)
    }, n.Map.include({addControl: function (e) {
        return e.addTo(this), this
    }, removeControl: function (e) {
        return e.removeFrom(this), this
    }, _initControlPos: function () {
        function i(i, s) {
            var o = t + i + " " + t + s;
            e[i + s] = n.DomUtil.create("div", o, r)
        }

        var e = this._controlCorners = {}, t = "leaflet-", r = this._controlContainer = n.DomUtil.create("div", t + "control-container", this._container);
        i("top", "left"), i("top", "right"), i("bottom", "left"), i("bottom", "right")
    }}), n.Control.Zoom = n.Control.extend({options: {position: "topleft"}, onAdd: function (e) {
        var t = "leaflet-control-zoom", r = n.DomUtil.create("div", t);
        return this._createButton("Zoom in", t + "-in", r, e.zoomIn, e), this._createButton("Zoom out", t + "-out", r, e.zoomOut, e), r
    }, _createButton: function (e, t, r, i, s) {
        var o = n.DomUtil.create("a", t, r);
        return o.href = "#", o.title = e, n.DomEvent.on(o, "click", n.DomEvent.stopPropagation).on(o, "click", n.DomEvent.preventDefault).on(o, "click", i, s).on(o, "dblclick", n.DomEvent.stopPropagation), o
    }}), n.Map.mergeOptions({zoomControl: !0}), n.Map.addInitHook(function () {
        this.options.zoomControl && (this.zoomControl = new n.Control.Zoom, this.addControl(this.zoomControl))
    }), n.control.zoom = function (e) {
        return new n.Control.Zoom(e)
    }, n.Control.Attribution = n.Control.extend({options: {position: "bottomright", prefix: 'Powered by <a href="http://leaflet.cloudmade.com">Leaflet</a>'}, initialize: function (e) {
        n.Util.setOptions(this, e), this._attributions = {}
    }, onAdd: function (e) {
        return this._container = n.DomUtil.create("div", "leaflet-control-attribution"), n.DomEvent.disableClickPropagation(this._container), e.on("layeradd", this._onLayerAdd, this).on("layerremove", this._onLayerRemove, this), this._update(), this._container
    }, onRemove: function (e) {
        e.off("layeradd", this._onLayerAdd).off("layerremove", this._onLayerRemove)
    }, setPrefix: function (e) {
        return this.options.prefix = e, this._update(), this
    }, addAttribution: function (e) {
        if (!e)return;
        return this._attributions[e] || (this._attributions[e] = 0), this._attributions[e]++, this._update(), this
    }, removeAttribution: function (e) {
        if (!e)return;
        return this._attributions[e]--, this._update(), this
    }, _update: function () {
        if (!this._map)return;
        var e = [];
        for (var t in this._attributions)this._attributions.hasOwnProperty(t) && this._attributions[t] && e.push(t);
        var n = [];
        this.options.prefix && n.push(this.options.prefix), e.length && n.push(e.join(", ")), this._container.innerHTML = n.join(" &#8212; ")
    }, _onLayerAdd: function (e) {
        e.layer.getAttribution && this.addAttribution(e.layer.getAttribution())
    }, _onLayerRemove: function (e) {
        e.layer.getAttribution && this.removeAttribution(e.layer.getAttribution())
    }}), n.Map.mergeOptions({attributionControl: !0}), n.Map.addInitHook(function () {
        this.options.attributionControl && (this.attributionControl = (new n.Control.Attribution).addTo(this))
    }), n.control.attribution = function (e) {
        return new n.Control.Attribution(e)
    }, n.Control.Scale = n.Control.extend({options: {position: "bottomleft", maxWidth: 100, metric: !0, imperial: !0, updateWhenIdle: !1}, onAdd: function (e) {
        this._map = e;
        var t = "leaflet-control-scale", r = n.DomUtil.create("div", t), i = this.options;
        return this._addScales(i, t, r), e.on(i.updateWhenIdle ? "moveend" : "move", this._update, this), this._update(), r
    }, onRemove: function (e) {
        e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this)
    }, _addScales: function (e, t, r) {
        e.metric && (this._mScale = n.DomUtil.create("div", t + "-line", r)), e.imperial && (this._iScale = n.DomUtil.create("div", t + "-line", r))
    }, _update: function () {
        var e = this._map.getBounds(), t = e.getCenter().lat, n = 6378137 * Math.PI * Math.cos(t * Math.PI / 180), r = n * (e.getNorthEast().lng - e.getSouthWest().lng) / 180, i = this._map.getSize(), s = this.options, o = 0;
        i.x > 0 && (o = r * (s.maxWidth / i.x)), this._updateScales(s, o)
    }, _updateScales: function (e, t) {
        e.metric && t && this._updateMetric(t), e.imperial && t && this._updateImperial(t)
    }, _updateMetric: function (e) {
        var t = this._getRoundNum(e);
        this._mScale.style.width = this._getScaleWidth(t / e) + "px", this._mScale.innerHTML = t < 1e3 ? t + " m" : t / 1e3 + " km"
    }, _updateImperial: function (e) {
        var t = e * 3.2808399, n = this._iScale, r, i, s;
        t > 5280 ? (r = t / 5280, i = this._getRoundNum(r), n.style.width = this._getScaleWidth(i / r) + "px", n.innerHTML = i + " mi") : (s = this._getRoundNum(t), n.style.width = this._getScaleWidth(s / t) + "px", n.innerHTML = s + " ft")
    }, _getScaleWidth: function (e) {
        return Math.round(this.options.maxWidth * e) - 10
    }, _getRoundNum: function (e) {
        var t = Math.pow(10, (Math.floor(e) + "").length - 1), n = e / t;
        return n = n >= 10 ? 10 : n >= 5 ? 5 : n >= 3 ? 3 : n >= 2 ? 2 : 1, t * n
    }}), n.control.scale = function (e) {
        return new n.Control.Scale(e)
    }, n.Control.Layers = n.Control.extend({options: {collapsed: !0, position: "topright", autoZIndex: !0}, initialize: function (e, t, r) {
        n.Util.setOptions(this, r), this._layers = {}, this._lastZIndex = 0;
        for (var i in e)e.hasOwnProperty(i) && this._addLayer(e[i], i);
        for (i in t)t.hasOwnProperty(i) && this._addLayer(t[i], i, !0)
    }, onAdd: function (e) {
        return this._initLayout(), this._update(), this._container
    }, addBaseLayer: function (e, t) {
        return this._addLayer(e, t), this._update(), this
    }, addOverlay: function (e, t) {
        return this._addLayer(e, t, !0), this._update(), this
    }, removeLayer: function (e) {
        var t = n.Util.stamp(e);
        return delete this._layers[t], this._update(), this
    }, _initLayout: function () {
        var e = "leaflet-control-layers", t = this._container = n.DomUtil.create("div", e);
        n.Browser.touch ? n.DomEvent.on(t, "click", n.DomEvent.stopPropagation) : n.DomEvent.disableClickPropagation(t);
        var r = this._form = n.DomUtil.create("form", e + "-list");
        if (this.options.collapsed) {
            n.DomEvent.on(t, "mouseover", this._expand, this).on(t, "mouseout", this._collapse, this);
            var i = this._layersLink = n.DomUtil.create("a", e + "-toggle", t);
            i.href = "#", i.title = "Layers", n.Browser.touch ? n.DomEvent.on(i, "click", n.DomEvent.stopPropagation).on(i, "click", n.DomEvent.preventDefault).on(i, "click", this._expand, this) : n.DomEvent.on(i, "focus", this._expand, this), this._map.on("movestart", this._collapse, this)
        } else this._expand();
        this._baseLayersList = n.DomUtil.create("div", e + "-base", r), this._separator = n.DomUtil.create("div", e + "-separator", r), this._overlaysList = n.DomUtil.create("div", e + "-overlays", r), t.appendChild(r)
    }, _addLayer: function (e, t, r) {
        var i = n.Util.stamp(e);
        this._layers[i] = {layer: e, name: t, overlay: r}, this.options.autoZIndex && e.setZIndex && (this._lastZIndex++, e.setZIndex(this._lastZIndex))
    }, _update: function () {
        if (!this._container)return;
        this._baseLayersList.innerHTML = "", this._overlaysList.innerHTML = "";
        var e = !1, t = !1;
        for (var n in this._layers)if (this._layers.hasOwnProperty(n)) {
            var r = this._layers[n];
            this._addItem(r), t = t || r.overlay, e = e || !r.overlay
        }
        this._separator.style.display = t && e ? "" : "none"
    }, _createRadioElement: function (e, t) {
        var n = '<input type="radio" name="' + e + '"';
        t && (n += ' checked="checked"'), n += "/>";
        var r = document.createElement("div");
        return r.innerHTML = n, r.firstChild
    }, _addItem: function (e) {
        var t = document.createElement("label"), r, i = this._map.hasLayer(e.layer);
        e.overlay ? (r = document.createElement("input"), r.type = "checkbox", r.defaultChecked = i) : r = this._createRadioElement("leaflet-base-layers", i), r.layerId = n.Util.stamp(e.layer), n.DomEvent.on(r, "click", this._onInputClick, this);
        var s = document.createTextNode(" " + e.name);
        t.appendChild(r), t.appendChild(s);
        var o = e.overlay ? this._overlaysList : this._baseLayersList;
        o.appendChild(t)
    }, _onInputClick: function () {
        var e, t, n, r = this._form.getElementsByTagName("input"), i = r.length;
        for (e = 0; e < i; e++)t = r[e], n = this._layers[t.layerId], t.checked ? this._map.addLayer(n.layer, !n.overlay) : this._map.removeLayer(n.layer)
    }, _expand: function () {
        n.DomUtil.addClass(this._container, "leaflet-control-layers-expanded")
    }, _collapse: function () {
        this._container.className = this._container.className.replace(" leaflet-control-layers-expanded", "")
    }}), n.control.layers = function (e, t, r) {
        return new n.Control.Layers(e, t, r)
    }, n.Transition = n.Class.extend({includes: n.Mixin.Events, statics: {CUSTOM_PROPS_SETTERS: {position: n.DomUtil.setPosition}, implemented: function () {
        return n.Transition.NATIVE || n.Transition.TIMER
    }}, options: {easing: "ease", duration: .5}, _setProperty: function (e, t) {
        var r = n.Transition.CUSTOM_PROPS_SETTERS;
        e in r ? r[e](this._el, t) : this._el.style[e] = t
    }}), n.Transition = n.Transition.extend({statics: function () {
        var e = n.DomUtil.TRANSITION, t = e === "webkitTransition" || e === "OTransition" ? e + "End" : "transitionend";
        return{NATIVE: !!e, TRANSITION: e, PROPERTY: e + "Property", DURATION: e + "Duration", EASING: e + "TimingFunction", END: t, CUSTOM_PROPS_PROPERTIES: {position: n.Browser.any3d ? n.DomUtil.TRANSFORM : "top, left"}}
    }(), options: {fakeStepInterval: 100}, initialize: function (e, t) {
        this._el = e, n.Util.setOptions(this, t), n.DomEvent.on(e, n.Transition.END, this._onTransitionEnd, this), this._onFakeStep = n.Util.bind(this._onFakeStep, this)
    }, run: function (e) {
        var t, r = [], i = n.Transition.CUSTOM_PROPS_PROPERTIES;
        for (t in e)e.hasOwnProperty(t) && (t = i[t] ? i[t] : t, t = this._dasherize(t), r.push(t));
        this._el.style[n.Transition.DURATION] = this.options.duration + "s", this._el.style[n.Transition.EASING] = this.options.easing, this._el.style[n.Transition.PROPERTY] = "all";
        for (t in e)e.hasOwnProperty(t) && this._setProperty(t, e[t]);
        n.Util.falseFn(this._el.offsetWidth), this._inProgress = !0, n.Browser.mobileWebkit && (this.backupEventFire = setTimeout(n.Util.bind(this._onBackupFireEnd, this), this.options.duration * 1.2 * 1e3)), n.Transition.NATIVE ? (clearInterval(this._timer), this._timer = setInterval(this._onFakeStep, this.options.fakeStepInterval)) : this._onTransitionEnd()
    }, _dasherize: function () {
        function t(e) {
            return"-" + e.toLowerCase()
        }

        var e = /([A-Z])/g;
        return function (n) {
            return n.replace(e, t)
        }
    }(), _onFakeStep: function () {
        this.fire("step")
    }, _onTransitionEnd: function (e) {
        this._inProgress && (this._inProgress = !1, clearInterval(this._timer), this._el.style[n.Transition.TRANSITION] = "", clearTimeout(this.backupEventFire), delete this.backupEventFire, this.fire("step"), e && e.type && this.fire("end"))
    }, _onBackupFireEnd: function () {
        var e = document.createEvent("Event");
        e.initEvent(n.Transition.END, !0, !1), this._el.dispatchEvent(e)
    }}), n.Transition = n.Transition.NATIVE ? n.Transition : n.Transition.extend({statics: {getTime: Date.now || function () {
        return+(new Date)
    }, TIMER: !0, EASINGS: {linear: function (e) {
        return e
    }, "ease-out": function (e) {
        return e * (2 - e)
    }}, CUSTOM_PROPS_GETTERS: {position: n.DomUtil.getPosition}, UNIT_RE: /^[\d\.]+(\D*)$/}, options: {fps: 50}, initialize: function (e, t) {
        this._el = e, n.Util.extend(this.options, t), this._easing = n.Transition.EASINGS[this.options.easing] || n.Transition.EASINGS["ease-out"], this._step = n.Util.bind(this._step, this), this._interval = Math.round(1e3 / this.options.fps)
    }, run: function (e) {
        this._props = {};
        var t = n.Transition.CUSTOM_PROPS_GETTERS, r = n.Transition.UNIT_RE;
        this.fire("start");
        for (var i in e)if (e.hasOwnProperty(i)) {
            var s = {};
            if (i in t)s.from = t[i](this._el); else {
                var o = this._el.style[i].match(r);
                s.from = parseFloat(o[0]), s.unit = o[1]
            }
            s.to = e[i], this._props[i] = s
        }
        clearInterval(this._timer), this._timer = setInterval(this._step, this._interval), this._startTime = n.Transition.getTime()
    }, _step: function () {
        var e = n.Transition.getTime(), t = e - this._startTime, r = this.options.duration * 1e3;
        t < r ? this._runFrame(this._easing(t / r)) : (this._runFrame(1), this._complete())
    }, _runFrame: function (e) {
        var t = n.Transition.CUSTOM_PROPS_SETTERS, r, i, s;
        for (r in this._props)this._props.hasOwnProperty(r) && (i = this._props[r], r in t ? (s = i.to.subtract(i.from).multiplyBy(e).add(i.from), t[r](this._el, s)) : this._el.style[r] = (i.to - i.from) * e + i.from + i.unit);
        this.fire("step")
    }, _complete: function () {
        clearInterval(this._timer), this.fire("end")
    }}), n.Map.include(!n.Transition || !n.Transition.implemented() ? {} : {setView: function (e, t, n) {
        t = this._limitZoom(t);
        var r = this._zoom !== t;
        if (this._loaded && !n && this._layers) {
            var i = r ? this._zoomToIfClose && this._zoomToIfClose(e, t) : this._panByIfClose(e);
            if (i)return clearTimeout(this._sizeTimer), this
        }
        return this._resetView(e, t), this
    }, panBy: function (e, t) {
        return e = n.point(e), !e.x && !e.y ? this : (this._panTransition || (this._panTransition = new n.Transition(this._mapPane), this._panTransition.on({step: this._onPanTransitionStep, end: this._onPanTransitionEnd}, this)), n.Util.setOptions(this._panTransition, n.Util.extend({duration: .25}, t)), this.fire("movestart"), n.DomUtil.addClass(this._mapPane, "leaflet-pan-anim"), this._panTransition.run({position: n.DomUtil.getPosition(this._mapPane).subtract(e)}), this)
    }, _onPanTransitionStep: function () {
        this.fire("move")
    }, _onPanTransitionEnd: function () {
        n.DomUtil.removeClass(this._mapPane, "leaflet-pan-anim"), this.fire("moveend")
    }, _panByIfClose: function (e) {
        var t = this._getCenterOffset(e)._floor();
        return this._offsetIsWithinView(t) ? (this.panBy(t), !0) : !1
    }, _offsetIsWithinView: function (e, t) {
        var n = t || 1, r = this.getSize();
        return Math.abs(e.x) <= r.x * n && Math.abs(e.y) <= r.y * n
    }}), n.Map.mergeOptions({zoomAnimation: n.DomUtil.TRANSITION && !n.Browser.android23 && !n.Browser.mobileOpera}), n.DomUtil.TRANSITION && n.Map.addInitHook(function () {
        n.DomEvent.on(this._mapPane, n.Transition.END, this._catchTransitionEnd, this)
    }), n.Map.include(n.DomUtil.TRANSITION ? {_zoomToIfClose: function (e, t) {
        if (this._animatingZoom)return!0;
        if (!this.options.zoomAnimation)return!1;
        var r = this.getZoomScale(t), i = this._getCenterOffset(e).divideBy(1 - 1 / r);
        if (!this._offsetIsWithinView(i, 1))return!1;
        n.DomUtil.addClass(this._mapPane, "leaflet-zoom-anim"), this.fire("movestart").fire("zoomstart"), this.fire("zoomanim", {center: e, zoom: t});
        var s = this._getCenterLayerPoint().add(i);
        return this._prepareTileBg(), this._runAnimation(e, t, r, s), !0
    }, _catchTransitionEnd: function (e) {
        this._animatingZoom && this._onZoomTransitionEnd()
    }, _runAnimation: function (e, t, r, i, s) {
        this._animateToCenter = e, this._animateToZoom = t, this._animatingZoom = !0;
        var o = n.DomUtil.TRANSFORM, u = this._tileBg;
        clearTimeout(this._clearTileBgTimer), n.Util.falseFn(u.offsetWidth);
        var a = n.DomUtil.getScaleString(r, i), f = u.style[o];
        u.style[o] = s ? f + " " + a : a + " " + f
    }, _prepareTileBg: function () {
        var e = this._tilePane, t = this._tileBg;
        if (t && this._getLoadedTilesPercentage(t) > .5 && this._getLoadedTilesPercentage(e) < .5) {
            e.style.visibility = "hidden", e.empty = !0, this._stopLoadingImages(e);
            return
        }
        t || (t = this._tileBg = this._createPane("leaflet-tile-pane", this._mapPane), t.style.zIndex = 1), t.style[n.DomUtil.TRANSFORM] = "", t.style.visibility = "hidden", t.empty = !0, e.empty = !1, this._tilePane = this._panes.tilePane = t;
        var r = this._tileBg = e;
        n.DomUtil.addClass(r, "leaflet-zoom-animated"), this._stopLoadingImages(r)
    }, _getLoadedTilesPercentage: function (e) {
        var t = e.getElementsByTagName("img"), n, r, i = 0;
        for (n = 0, r = t.length; n < r; n++)t[n].complete && i++;
        return i / r
    }, _stopLoadingImages: function (e) {
        var t = Array.prototype.slice.call(e.getElementsByTagName("img")), r, i, s;
        for (r = 0, i = t.length; r < i; r++)s = t[r], s.complete || (s.onload = n.Util.falseFn, s.onerror = n.Util.falseFn, s.src = n.Util.emptyImageUrl, s.parentNode.removeChild(s))
    }, _onZoomTransitionEnd: function () {
        this._restoreTileFront(), n.Util.falseFn(this._tileBg.offsetWidth), this._resetView(this._animateToCenter, this._animateToZoom, !0, !0), n.DomUtil.removeClass(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1
    }, _restoreTileFront: function () {
        this._tilePane.innerHTML = "", this._tilePane.style.visibility = "", this._tilePane.style.zIndex = 2, this._tileBg.style.zIndex = 1
    }, _clearTileBg: function () {
        !this._animatingZoom && !this.touchZoom._zooming && (this._tileBg.innerHTML = "")
    }} : {}), n.Map.include({_defaultLocateOptions: {watch: !1, setView: !1, maxZoom: Infinity, timeout: 1e4, maximumAge: 0, enableHighAccuracy: !1}, locate: function (e) {
        e = this._locationOptions = n.Util.extend(this._defaultLocateOptions, e);
        if (!navigator.geolocation)return this._handleGeolocationError({code: 0, message: "Geolocation not supported."}), this;
        var t = n.Util.bind(this._handleGeolocationResponse, this), r = n.Util.bind(this._handleGeolocationError, this);
        return e.watch ? this._locationWatchId = navigator.geolocation.watchPosition(t, r, e) : navigator.geolocation.getCurrentPosition(t, r, e), this
    }, stopLocate: function () {
        return navigator.geolocation && navigator.geolocation.clearWatch(this._locationWatchId), this
    }, _handleGeolocationError: function (e) {
        var t = e.code, n = e.message || (t === 1 ? "permission denied" : t === 2 ? "position unavailable" : "timeout");
        this._locationOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {code: t, message: "Geolocation error: " + n + "."})
    }, _handleGeolocationResponse: function (e) {
        var t = 180 * e.coords.accuracy / 4e7, r = t * 2, i = e.coords.latitude, s = e.coords.longitude, o = new n.LatLng(i, s), u = new n.LatLng(i - t, s - r), a = new n.LatLng(i + t, s + r), f = new n.LatLngBounds(u, a), l = this._locationOptions;
        if (l.setView) {
            var c = Math.min(this.getBoundsZoom(f), l.maxZoom);
            this.setView(o, c)
        }
        this.fire("locationfound", {latlng: o, bounds: f, accuracy: e.coords.accuracy})
    }})
})(this);
L.Control.MiniMap = L.Control.extend({options: {position: "bottomright", zoomLevelOffset: -5, zoomLevelFixed: false, zoomAnimation: false, width: 150, height: 150}, initialize: function (layer, options) {
    L.Util.setOptions(this, options);
    this._layer = layer;
}, onAdd: function (map) {
    this._mainMap = map;
    this._container = L.DomUtil.create("div", "leaflet-control-minimap");
    this._container.style.width = this.options.width + "px";
    this._container.style.height = this.options.height + "px";
    L.DomEvent.disableClickPropagation(this._container);
    L.DomEvent.on(this._container, "mousewheel", L.DomEvent.stopPropagation);
    this._miniMap = new L.Map(this._container, {attributionControl: false, zoomControl: false, zoomAnimation: this.options.zoomAnimation, touchZoom: !this.options.zoomLevelFixed, scrollWheelZoom: !this.options.zoomLevelFixed, doubleClickZoom: !this.options.zoomLevelFixed, boxZoom: !this.options.zoomLevelFixed});
    this._miniMap.addLayer(L.Util.clone(this._layer));
    setTimeout(L.Util.bind(function () {
        this._miniMap.setView(this._mainMap.getCenter(), this._decideZoom(true));
        this._aimingRect = L.rectangle(this._mainMap.getBounds(), {color: "#ff7800", weight: 1, clickable: false}).addTo(this._miniMap);
    }, this), 1);
    this._mainMapMoving = false;
    this._miniMapMoving = false;
    this._mainMap.on("moveend", this._onMainMapMoved, this);
    this._mainMap.on("move", this._onMainMapMoving, this);
    this._miniMap.on("moveend", this._onMiniMapMoved, this);
    return this._container;
}, onRemove: function (map) {
    this._mainMap.off("moveend", this._onMainMapMoved, this);
    this._mainMap.off("move", this._onMainMapMoving, this);
    this._miniMap.off("moveend", this._onMiniMapMoved, this);
}, _onMainMapMoved: function (e) {
    if (!this._miniMapMoving) {
        this._mainMapMoving = true;
        this._miniMap.setView(this._mainMap.getCenter(), this._decideZoom(true));
    } else {
        this._miniMapMoving = false;
    }
    this._aimingRect.setBounds(this._mainMap.getBounds());
}, _onMainMapMoving: function (e) {
    this._aimingRect.setBounds(this._mainMap.getBounds());
}, _onMiniMapMoved: function (e) {
    if (!this._mainMapMoving) {
        this._miniMapMoving = true;
        this._mainMap.setView(this._miniMap.getCenter(), this._decideZoom(false));
    } else {
        this._mainMapMoving = false;
    }
}, _decideZoom: function (fromMaintoMini) {
    if (!this.options.zoomLevelFixed) {
        if (fromMaintoMini) {
            return this._mainMap.getZoom() + this.options.zoomLevelOffset;
        } else {
            return this._miniMap.getZoom() - this.options.zoomLevelOffset;
        }
    } else {
        if (fromMaintoMini) {
            return this.options.zoomLevelFixed;
        } else {
            return this._mainMap.getZoom();
        }
    }
}});
L.Map.mergeOptions({miniMapControl: false});
L.Map.addInitHook(function () {
    if (this.options.miniMapControl) {
        this.miniMapControl = (new L.Control.MiniMap()).addTo(this);
    }
});
L.control.minimap = function (options) {
    return new L.Control.MiniMap(options);
};
L.Util.clone = function (o) {
    if (o == null || typeof(o) != "object") {
        return o;
    }
    var c = new o.constructor();
    for (var k in o) {
        c[k] = L.Util.clone(o[k]);
    }
    return c;
};
/*
 string.js - Copyright (C) 2012, JP Richardson <jprichardson@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
 associated documentation files (the "Software"), to deal in the Software without restriction, including 
 without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is furnished to 
 do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 DEALINGS IN THE SOFTWARE.
 */
(function () {
    "use strict";
    function t(e) {
        e !== null && e !== undefined ? typeof e == "string" ? this.s = e : this.s = e.toString() : this.s = e, this.orig = e, e !== null && e !== undefined ? this.__defineGetter__ ? this.__defineGetter__("length", function () {
            return this.s.length
        }) : this.length = e.length : this.length = -1
    }

    function s() {
        for (var e in r)(function (e) {
            var t = r[e];
            n.hasOwnProperty(e) || (i.push(e), n[e] = function () {
                return String.prototype.s = this, t.apply(this, arguments)
            })
        })(e)
    }

    function o() {
        for (var e = 0; e < i.length; ++e)delete String.prototype[i[e]];
        i.length = 0
    }

    function f() {
        var e = l(), t = {};
        for (var r = 0; r < e.length; ++r) {
            var i = e[r], s = n[i];
            try {
                var o = typeof s.apply("teststring", []);
                t[i] = o
            } catch (u) {
            }
        }
        return t
    }

    function l() {
        var e = [];
        if (Object.getOwnPropertyNames)return e = Object.getOwnPropertyNames(n), e.splice(e.indexOf("valueOf"), 1), e.splice(e.indexOf("toString"), 1), e;
        var t = {}, r = [];
        for (var i in String.prototype)t[i] = i;
        for (var i in Object.prototype)delete t[i];
        for (var i in t)e.push(i);
        return e
    }

    function c(e) {
        return new t(e)
    }

    function h(e, t) {
        var n = [], r;
        for (r = 0; r < e.length; r++)n.push(e[r]), t && t.call(e, e[r], r);
        return n
    }

    function m(e, t) {
        var n = {}, r = {}, i, s = {}, o = {}, u = {}, a = {};
        s[0] = "HTML_SPECIALCHARS", s[1] = "HTML_ENTITIES", o[0] = "ENT_NOQUOTES", o[2] = "ENT_COMPAT", o[3] = "ENT_QUOTES", u = isNaN(e) ? e ? e.toUpperCase() : "HTML_SPECIALCHARS" : s[e], a = isNaN(t) ? t ? t.toUpperCase() : "ENT_COMPAT" : o[t];
        if (u !== "HTML_SPECIALCHARS" && u !== "HTML_ENTITIES")throw new Error("Table: " + u + " not supported");
        n[38] = "&amp;", u === "HTML_ENTITIES" && (n[160] = "&nbsp;", n[161] = "&iexcl;", n[162] = "&cent;", n[163] = "&pound;", n[164] = "&curren;", n[165] = "&yen;", n[166] = "&brvbar;", n[167] = "&sect;", n[168] = "&uml;", n[169] = "&copy;", n[170] = "&ordf;", n[171] = "&laquo;", n[172] = "&not;", n[173] = "&shy;", n[174] = "&reg;", n[175] = "&macr;", n[176] = "&deg;", n[177] = "&plusmn;", n[178] = "&sup2;", n[179] = "&sup3;", n[180] = "&acute;", n[181] = "&micro;", n[182] = "&para;", n[183] = "&middot;", n[184] = "&cedil;", n[185] = "&sup1;", n[186] = "&ordm;", n[187] = "&raquo;", n[188] = "&frac14;", n[189] = "&frac12;", n[190] = "&frac34;", n[191] = "&iquest;", n[192] = "&Agrave;", n[193] = "&Aacute;", n[194] = "&Acirc;", n[195] = "&Atilde;", n[196] = "&Auml;", n[197] = "&Aring;", n[198] = "&AElig;", n[199] = "&Ccedil;", n[200] = "&Egrave;", n[201] = "&Eacute;", n[202] = "&Ecirc;", n[203] = "&Euml;", n[204] = "&Igrave;", n[205] = "&Iacute;", n[206] = "&Icirc;", n[207] = "&Iuml;", n[208] = "&ETH;", n[209] = "&Ntilde;", n[210] = "&Ograve;", n[211] = "&Oacute;", n[212] = "&Ocirc;", n[213] = "&Otilde;", n[214] = "&Ouml;", n[215] = "&times;", n[216] = "&Oslash;", n[217] = "&Ugrave;", n[218] = "&Uacute;", n[219] = "&Ucirc;", n[220] = "&Uuml;", n[221] = "&Yacute;", n[222] = "&THORN;", n[223] = "&szlig;", n[224] = "&agrave;", n[225] = "&aacute;", n[226] = "&acirc;", n[227] = "&atilde;", n[228] = "&auml;", n[229] = "&aring;", n[230] = "&aelig;", n[231] = "&ccedil;", n[232] = "&egrave;", n[233] = "&eacute;", n[234] = "&ecirc;", n[235] = "&euml;", n[236] = "&igrave;", n[237] = "&iacute;", n[238] = "&icirc;", n[239] = "&iuml;", n[240] = "&eth;", n[241] = "&ntilde;", n[242] = "&ograve;", n[243] = "&oacute;", n[244] = "&ocirc;", n[245] = "&otilde;", n[246] = "&ouml;", n[247] = "&divide;", n[248] = "&oslash;", n[249] = "&ugrave;", n[250] = "&uacute;", n[251] = "&ucirc;", n[252] = "&uuml;", n[253] = "&yacute;", n[254] = "&thorn;", n[255] = "&yuml;"), a !== "ENT_NOQUOTES" && (n[34] = "&quot;"), a === "ENT_QUOTES" && (n[39] = "&#39;"), n[60] = "&lt;", n[62] = "&gt;";
        for (i in n)n.hasOwnProperty(i) && (r[String.fromCharCode(i)] = n[i]);
        return r
    }

    var e = "1.1.0", n = String.prototype, r = t.prototype = {camelize: function () {
        var e = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function (e, t, n) {
            return n ? n.toUpperCase() : ""
        });
        return new t(e)
    }, capitalize: function () {
        return new t(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase())
    }, charAt: function (e) {
        return this.s.charAt(e)
    }, collapseWhitespace: function () {
        var e = this.s.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
        return new t(e)
    }, contains: function (e) {
        return this.s.indexOf(e) >= 0
    }, dasherize: function () {
        var e = this.trim().s.replace(/[_\s]+/g, "-").replace(/([A-Z])/g, "-$1").replace(/-+/g, "-").toLowerCase();
        return new t(e)
    }, decodeHtmlEntities: function (e) {
        var n = "", r = "", i = {}, s = this.s;
        if (!1 === (i = m("HTML_ENTITIES", e)))return!1;
        delete i["&"], i["&"] = "&amp;";
        for (n in i)r = i[n], s = s.split(r).join(n);
        return s = s.split("&#039;").join("'"), new t(s)
    }, endsWith: function (e) {
        var t = this.s.length - e.length;
        return t >= 0 && this.s.indexOf(e, t) === t
    }, escapeHTML: function () {
        return new t(this.s.replace(/[&<>"']/g, function (e) {
            return"&" + d[e] + ";"
        }))
    }, isAlpha: function () {
        return!/[^a-zA-Z]/.test(this.s)
    }, isAlphaNumeric: function () {
        return!/[^a-zA-Z0-9]/.test(this.s)
    }, isEmpty: function () {
        return this.s === null || this.s === undefined ? !0 : /^[\s\xa0]*$/.test(this.s)
    }, isLower: function () {
        return!/[^a-z]/.test(this.s)
    }, isNumeric: function () {
        return!/[^0-9]/.test(this.s)
    }, isUpper: function () {
        return!/[^A-Z]/.test(this.s)
    }, left: function (e) {
        if (e >= 0) {
            var n = this.s.substr(0, e);
            return new t(n)
        }
        return this.right(-e)
    }, lines: function () {
        var e = this.s.split("\n");
        for (var t = 0; t < e.length; ++t)e[t] = e[t].replace(/(^\s*|\s*$)/g, "");
        return e
    }, pad: function (e, n) {
        n = n || " ";
        if (this.s.length >= e)return new t(this.s);
        e -= this.s.length;
        var r = Array(Math.ceil(e / 2) + 1).join(n), i = Array(Math.floor(e / 2) + 1).join(n);
        return new t(r + this.s + i)
    }, padLeft: function (e, n) {
        return n = n || " ", this.s.length >= e ? new t(this.s) : new t(Array(e - this.s.length + 1).join(n) + this.s)
    }, padRight: function (e, n) {
        return n = n || " ", this.s.length >= e ? new t(this.s) : new t(this.s + Array(e - this.s.length + 1).join(n))
    }, parseCSV: function (e, t) {
        e = e || ",", escape = "\\", typeof t == "undefined" && (t = '"');
        var n = 0, r = [], i = [], s = this.s.length, o = !1, u = this, a = function (e) {
            return u.s.charAt(e)
        };
        t || (o = !0);
        while (n < s) {
            var f = a(n);
            switch (f) {
                case t:
                    o ? a(n - 1) === escape ? r.push(f) : o = !1 : o = !0;
                    break;
                case e:
                    o && t ? r.push(f) : (i.push(r.join("")), r.length = 0);
                    break;
                case escape:
                    t && a(n + 1) !== t && r.push(f);
                    break;
                default:
                    o && r.push(f)
            }
            n += 1
        }
        return i.push(r.join("")), i
    }, replaceAll: function (e, n) {
        var r = this.s.replace(new RegExp(e, "g"), n);
        return new t(r)
    }, right: function (e) {
        if (e >= 0) {
            var n = this.s.substr(this.s.length - e, e);
            return new t(n)
        }
        return this.left(-e)
    }, slugify: function () {
        var e = (new t(this.s.replace(/[^\w\s-]/g, ""))).dasherize().s;
        return e.charAt(0) === "-" && (e = e.substr(1)), new t(e)
    }, startsWith: function (e) {
        return this.s.lastIndexOf(e, 0) === 0
    }, stripPunctuation: function () {
        return new t(this.s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "))
    }, stripTags: function () {
        var e = this.s, n = arguments.length > 0 ? arguments : [""];
        return h(n, function (t) {
            e = e.replace(RegExp("</?" + t + "[^<>]*>", "gi"), "")
        }), new t(e)
    }, times: function (e) {
        return new t((new Array(e + 1)).join(this.s))
    }, toBoolean: function () {
        if (typeof this.orig == "string") {
            var e = this.s.toLowerCase();
            return e === "true" || e === "yes" || e === "on"
        }
        return this.orig === !0 || this.orig === 1
    }, toFloat: function (e) {
        var t = parseFloat(this.s, 10);
        return e ? parseFloat(t.toFixed(e)) : t
    }, toInt: function () {
        return/^\s*-?0x/i.test(this.s) ? parseInt(this.s, 16) : parseInt(this.s, 10)
    }, trim: function () {
        var e;
        return typeof String.prototype.trim == "undefined" ? e = this.s.replace(/(^\s*|\s*$)/g, "") : e = this.s.trim(), new t(e)
    }, trimLeft: function () {
        var e;
        return n.trimLeft ? e = this.s.trimLeft() : e = this.s.replace(/(^\s*)/g, ""), new t(e)
    }, trimRight: function () {
        var e;
        return n.trimRight ? e = this.s.trimRight() : e = this.s.replace(/\s+$/, ""), new t(e)
    }, truncate: function (e, n) {
        var r = this.s;
        e = ~~e, n = n || "...";
        if (r.length <= e)return r;
        var i = function (e) {
            return e.toUpperCase() !== e.toLowerCase() ? "A" : " "
        }, s = r.slice(0, e + 1).replace(/.(?=\W*\w*$)/g, i);
        return s.slice(s.length - 2).match(/\w\w/) ? s = s.replace(/\s*\S+$/, "") : s = (new t(s.slice(0, s.length - 1))).trimRight().s, (s + n).length > r.length ? new t(r) : new t(r.slice(0, s.length) + n)
    }, toCSV: function () {
        function u(e) {
            return e !== null && e !== ""
        }

        var e = ",", n = '"', r = "\\", i = !0, s = !1, o = [];
        typeof arguments[0] == "object" ? (e = arguments[0].delimiter || e, e = arguments[0].separator || e, n = arguments[0].qualifier || n, i = !!arguments[0].encloseNumbers, r = arguments[0].escapeChar || r, s = !!arguments[0].keys) : typeof arguments[0] == "string" && (e = arguments[0]), typeof arguments[1] == "string" && (n = arguments[1]), arguments[1] === null && (n = null);
        if (this.orig instanceof Array)o = this.orig; else for (var a in this.orig)this.orig.hasOwnProperty(a) && (s ? o.push(a) : o.push(this.orig[a]));
        var f = r + n, l = [];
        for (var c = 0; c < o.length; ++c) {
            var h = u(n);
            typeof o[c] == "number" && (h &= i), h && l.push(n);
            var p = (new t(o[c])).replaceAll(n, f).s;
            l.push(p), h && l.push(n), e && l.push(e)
        }
        return l.length = l.length - 1, new t(l.join(""))
    }, toString: function () {
        return this.s
    }, underscore: function () {
        var e = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
        return(new t(this.s.charAt(0))).isUpper() && (e = "_" + e), new t(e)
    }, unescapeHTML: function () {
        return new t(this.s.replace(/\&([^;]+);/g, function (e, t) {
            var n;
            return t in p ? p[t] : (n = t.match(/^#x([\da-fA-F]+)$/)) ? String.fromCharCode(parseInt(n[1], 16)) : (n = t.match(/^#(\d+)$/)) ? String.fromCharCode(~~n[1]) : e
        }))
    }, valueOf: function () {
        return this.s.valueOf()
    }}, i = [], u = f();
    for (var a in u)(function (e) {
        var i = n[e];
        typeof i == "function" && (r[e] || (u[e] === "string" ? r[e] = function () {
            return new t(i.apply(this, arguments))
        } : r[e] = i))
    })(a);
    r.repeat = r.times, r.include = r.contains, r.toInteger = r.toInt, r.toBool = r.toBoolean, typeof module != "undefined" && typeof module.exports != "undefined" ? (module.exports = c, module.exports.extendPrototype = s, module.exports.restorePrototype = o, module.exports.VERSION = e) : (window.S = c, window.S.extendPrototype = s, window.S.restorePrototype = o, window.S.VERSION = e);
    var p = {lt: "<", gt: ">", quot: '"', apos: "'", amp: "&"}, d = {};
    for (var v in p)d[p[v]] = v
}).call(this);
/*

 Holder - 1.9 - client side image placeholders
 (c) 2012-2013 Ivan Malopinsky / http://imsky.co

 Provided under the Apache 2.0 License: http://www.apache.org/licenses/LICENSE-2.0
 Commercial use requires attribution.

 */

var Holder = Holder || {};
(function (app, win) {

    var preempted = false,
        fallback = false,
        canvas = document.createElement('canvas');

//getElementsByClassName polyfill
    document.getElementsByClassName || (document.getElementsByClassName = function (e) {
        var t = document, n, r, i, s = [];
        if (t.querySelectorAll)return t.querySelectorAll("." + e);
        if (t.evaluate) {
            r = ".//*[contains(concat(' ', @class, ' '), ' " + e + " ')]", n = t.evaluate(r, t, null, 0, null);
            while (i = n.iterateNext())s.push(i)
        } else {
            n = t.getElementsByTagName("*"), r = new RegExp("(^|\\s)" + e + "(\\s|$)");
            for (i = 0; i < n.length; i++)r.test(n[i].className) && s.push(n[i])
        }
        return s
    })

//getComputedStyle polyfill
    window.getComputedStyle || (window.getComputedStyle = function (e, t) {
        return this.el = e, this.getPropertyValue = function (t) {
            var n = /(\-([a-z]){1})/g;
            return t == "float" && (t = "styleFloat"), n.test(t) && (t = t.replace(n, function () {
                return arguments[2].toUpperCase()
            })), e.currentStyle[t] ? e.currentStyle[t] : null
        }, this
    })

//http://javascript.nwbox.com/ContentLoaded by Diego Perini with modifications
    function contentLoaded(n, t) {
        var l = "complete", s = "readystatechange", u = !1, h = u, c = !0, i = n.document, a = i.documentElement, e = i.addEventListener ? "addEventListener" : "attachEvent", v = i.addEventListener ? "removeEventListener" : "detachEvent", f = i.addEventListener ? "" : "on", r = function (e) {
            (e.type != s || i.readyState == l) && ((e.type == "load" ? n : i)[v](f + e.type, r, u), !h && (h = !0) && t.call(n, null))
        }, o = function () {
            try {
                a.doScroll("left")
            } catch (n) {
                setTimeout(o, 50);
                return
            }
            r("poll")
        };
        if (i.readyState == l)t.call(n, "lazy"); else {
            if (i.createEventObject && a.doScroll) {
                try {
                    c = !n.frameElement
                } catch (y) {
                }
                c && o()
            }
            i[e](f + "DOMContentLoaded", r, u), i[e](f + s, r, u), n[e](f + "load", r, u)
        }
    };

//https://gist.github.com/991057 by Jed Schmidt with modifications
    function selector(a) {
        a = a.match(/^(\W)?(.*)/);
        var b = document["getElement" + (a[1] ? a[1] == "#" ? "ById" : "sByClassName" : "sByTagName")](a[2]);
        var ret = [];
        b != null && (b.length ? ret = b : b.length == 0 ? ret = b : ret = [b]);
        return ret;
    }

//shallow object property extend
    function extend(a, b) {
        var c = {};
        for (var d in a)c[d] = a[d];
        for (var e in b)c[e] = b[e];
        return c
    }

//hasOwnProperty polyfill
    if (!Object.prototype.hasOwnProperty)
        Object.prototype.hasOwnProperty = function (prop) {
            var proto = this.__proto__ || this.constructor.prototype;
            return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
        }

    function text_size(width, height, template) {
        var dimension_arr = [height, width].sort();
        var maxFactor = Math.round(dimension_arr[1] / 16),
            minFactor = Math.round(dimension_arr[0] / 16);
        var text_height = Math.max(template.size, maxFactor);
        return {
            height: text_height
        }
    }

    function draw(ctx, dimensions, template, ratio) {
        var ts = text_size(dimensions.width, dimensions.height, template);
        var text_height = ts.height;
        var width = dimensions.width * ratio,
            height = dimensions.height * ratio;
        var font = template.font ? template.font : "sans-serif";
        canvas.width = width;
        canvas.height = height;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = template.background;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = template.foreground;
        ctx.font = "bold " + text_height + "px " + font;
        var text = template.text ? template.text : (dimensions.width + "x" + dimensions.height);
        if (ctx.measureText(text).width / width > 1) {
            text_height = template.size / (ctx.measureText(text).width / width);
        }
        //Resetting font size if necessary
        ctx.font = "bold " + (text_height * ratio) + "px " + font;
        ctx.fillText(text, (width / 2), (height / 2), width);
        return canvas.toDataURL("image/png");
    }

    function render(mode, el, holder, src) {
        var dimensions = holder.dimensions,
            theme = holder.theme,
            text = holder.text ? decodeURIComponent(holder.text) : holder.text;
        var dimensions_caption = dimensions.width + "x" + dimensions.height;

        theme = (text ? extend(theme, {
            text: text
        }) : theme);
        theme = (holder.font ? extend(theme, {
            font: holder.font
        }) : theme);

        var dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

        var ratio = dpr / bsr;


        if (mode == "image") {
            el.setAttribute("data-src", src);
            el.setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);

            if (fallback || !holder.auto) {
                el.style.width = dimensions.width + "px";
                el.style.height = dimensions.height + "px";
            }

            if (fallback) {
                el.style.backgroundColor = theme.background;

            } else {
                el.setAttribute("src", draw(ctx, dimensions, theme, ratio));
            }
        } else {
            if (!fallback) {
                el.style.backgroundImage = "url(" + draw(ctx, dimensions, theme, ratio) + ")";
                el.style.backgroundSize = dimensions.width + "px " + dimensions.height + "px";
            }
        }
    };

    function fluid(el, holder, src) {
        var dimensions = holder.dimensions,
            theme = holder.theme,
            text = holder.text;
        var dimensions_caption = dimensions.width + "x" + dimensions.height;
        theme = (text ? extend(theme, {
            text: text
        }) : theme);

        var fluid = document.createElement("div");

        if (el.fluidRef) {
            fluid = el.fluidRef;
        }

        fluid.style.backgroundColor = theme.background;
        fluid.style.color = theme.foreground;
        fluid.className = el.className + " holderjs-fluid";
        fluid.style.width = holder.dimensions.width + (holder.dimensions.width.indexOf("%") > 0 ? "" : "px");
        fluid.style.height = holder.dimensions.height + (holder.dimensions.height.indexOf("%") > 0 ? "" : "px");
        fluid.id = el.id;

        el.style.width = 0;
        el.style.height = 0;

        if (!el.fluidRef) {

            if (theme.text) {
                fluid.appendChild(document.createTextNode(theme.text))
            } else {
                fluid.appendChild(document.createTextNode(dimensions_caption))
                fluid_images.push(fluid);
                setTimeout(fluid_update, 0);
            }

        }

        el.fluidRef = fluid;
        el.parentNode.insertBefore(fluid, el.nextSibling)

        if (window.jQuery) {
            jQuery(function ($) {
                $(el).on("load", function () {
                    el.style.width = fluid.style.width;
                    el.style.height = fluid.style.height;
                    $(el).show();
                    $(fluid).remove();
                });
            })
        }
    }

    function fluid_update() {
        for (i in fluid_images) {
            if (!fluid_images.hasOwnProperty(i)) continue;
            var el = fluid_images[i],
                label = el.firstChild;

            el.style.lineHeight = el.offsetHeight + "px";
            label.data = el.offsetWidth + "x" + el.offsetHeight;
        }
    }

    function parse_flags(flags, options) {

        var ret = {
            theme: settings.themes.gray
        }, render = false;

        for (sl = flags.length, j = 0; j < sl; j++) {
            var flag = flags[j];
            if (app.flags.dimensions.match(flag)) {
                render = true;
                ret.dimensions = app.flags.dimensions.output(flag);
            } else if (app.flags.fluid.match(flag)) {
                render = true;
                ret.dimensions = app.flags.fluid.output(flag);
                ret.fluid = true;
            } else if (app.flags.colors.match(flag)) {
                ret.theme = app.flags.colors.output(flag);
            } else if (options.themes[flag]) {
                //If a theme is specified, it will override custom colors
                ret.theme = options.themes[flag];
            } else if (app.flags.text.match(flag)) {
                ret.text = app.flags.text.output(flag);
            } else if (app.flags.font.match(flag)) {
                ret.font = app.flags.font.output(flag);
            } else if (app.flags.auto.match(flag)) {
                ret.auto = true;
            }
        }

        return render ? ret : false;

    };

    if (!canvas.getContext) {
        fallback = true;
    } else {
        if (canvas.toDataURL("image/png")
            .indexOf("data:image/png") < 0) {
            //Android doesn't support data URI
            fallback = true;
        } else {
            var ctx = canvas.getContext("2d");
        }
    }

    var fluid_images = [];

    var settings = {
        domain: "holder.js",
        images: "img",
        bgnodes: ".holderjs",
        themes: {
            "gray": {
                background: "#eee",
                foreground: "#aaa",
                size: 12
            },
            "social": {
                background: "#3a5a97",
                foreground: "#fff",
                size: 12
            },
            "industrial": {
                background: "#434A52",
                foreground: "#C2F200",
                size: 12
            }
        },
        stylesheet: ".holderjs-fluid {font-size:16px;font-weight:bold;text-align:center;font-family:sans-serif;margin:0}"
    };


    app.flags = {
        dimensions: {
            regex: /^(\d+)x(\d+)$/,
            output: function (val) {
                var exec = this.regex.exec(val);
                return {
                    width: +exec[1],
                    height: +exec[2]
                }
            }
        },
        fluid: {
            regex: /^([0-9%]+)x([0-9%]+)$/,
            output: function (val) {
                var exec = this.regex.exec(val);
                return {
                    width: exec[1],
                    height: exec[2]
                }
            }
        },
        colors: {
            regex: /#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,
            output: function (val) {
                var exec = this.regex.exec(val);
                return {
                    size: settings.themes.gray.size,
                    foreground: "#" + exec[2],
                    background: "#" + exec[1]
                }
            }
        },
        text: {
            regex: /text\:(.*)/,
            output: function (val) {
                return this.regex.exec(val)[1];
            }
        },
        font: {
            regex: /font\:(.*)/,
            output: function (val) {
                return this.regex.exec(val)[1];
            }
        },
        auto: {
            regex: /^auto$/
        }
    }

    for (var flag in app.flags) {
        if (!app.flags.hasOwnProperty(flag)) continue;
        app.flags[flag].match = function (val) {
            return val.match(this.regex)
        }
    }

    app.add_theme = function (name, theme) {
        name != null && theme != null && (settings.themes[name] = theme);
        return app;
    };

    app.add_image = function (src, el) {
        var node = selector(el);
        if (node.length) {
            for (var i = 0, l = node.length; i < l; i++) {
                var img = document.createElement("img")
                img.setAttribute("data-src", src);
                node[i].appendChild(img);
            }
        }
        return app;
    };

    app.run = function (o) {
        var options = extend(settings, o),
            images = [];

        if (options.images instanceof window.NodeList) {
            imageNodes = options.images;
        } else if (options.images instanceof window.Node) {
            imageNodes = [options.images];
        } else {
            imageNodes = selector(options.images);
        }

        if (options.elements instanceof window.NodeList) {
            bgnodes = options.bgnodes;
        } else if (options.bgnodes instanceof window.Node) {
            bgnodes = [options.bgnodes];
        } else {
            bgnodes = selector(options.bgnodes);
        }

        preempted = true;

        for (i = 0, l = imageNodes.length; i < l; i++) images.push(imageNodes[i]);

        var holdercss = document.getElementById("holderjs-style");

        if (!holdercss) {
            holdercss = document.createElement("style");
            holdercss.setAttribute("id", "holderjs-style");
            holdercss.type = "text/css";
            document.getElementsByTagName("head")[0].appendChild(holdercss);
        }

        if (!options.nocss) {
            if (holdercss.styleSheet) {
                holdercss.styleSheet += options.stylesheet;
            } else {
                holdercss.textContent += options.stylesheet;
            }
        }

        var cssregex = new RegExp(options.domain + "\/(.*?)\"?\\)");

        for (var l = bgnodes.length, i = 0; i < l; i++) {
            var src = window.getComputedStyle(bgnodes[i], null)
                .getPropertyValue("background-image");
            var flags = src.match(cssregex);
            if (flags) {
                var holder = parse_flags(flags[1].split("/"), options);
                if (holder) {
                    render("background", bgnodes[i], holder, src);
                }
            }
        }

        for (var l = images.length, i = 0; i < l; i++) {
            var attr_src = images[i].getAttribute("src"),
                attr_datasrc = images[i].getAttribute("data-src");
            var src = null;
            if (attr_datasrc == null && !!attr_src && attr_src.indexOf(options.domain) >= 0) {
                src = attr_src;
            } else if (!!attr_datasrc && attr_datasrc.indexOf(options.domain) >= 0) {
                src = attr_datasrc;
            }

            if (src) {
                var holder = parse_flags(src.substr(src.lastIndexOf(options.domain) + options.domain.length + 1)
                    .split("/"), options);
                if (holder) {
                    if (holder.fluid) {
                        fluid(images[i], holder, src);
                    } else {
                        render("image", images[i], holder, src);
                    }
                }
            }
        }
        return app;
    };

    contentLoaded(win, function () {
        if (window.addEventListener) {
            window.addEventListener("resize", fluid_update, false);
            window.addEventListener("orientationchange", fluid_update, false);
        } else {
            window.attachEvent("onresize", fluid_update)
        }
        preempted || app.run();
    });

    if (typeof define === "function" && define.amd) {
        define("Holder", [], function () {
            return app;
        });
    }

})(Holder, window);
/*!
 * VERSION: beta 1.9.2
 * DATE: 2013-03-25
 * JavaScript 
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue || (window._gsQueue = [])).push(function () {
    "use strict";
    window._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (a, b) {
        var d, e, f, g, c = function () {
            a.call(this, "css"), this._overwriteProps.length = 0
        }, h = {}, i = c.prototype = new a("css");
        i.constructor = c, c.version = "1.9.2", c.API = 2, c.defaultTransformPerspective = 0, i = "px", c.suffixMap = {top: i, right: i, bottom: i, left: i, width: i, height: i, fontSize: i, padding: i, margin: i, perspective: i};
        var H, I, J, K, L, M, j = /(?:\d|\-\d|\.\d|\-\.\d)+/g, k = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g, l = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, m = /[^\d\-\.]/g, n = /(?:\d|\-|\+|=|#|\.)*/g, o = /opacity *= *([^)]*)/, p = /opacity:([^;]*)/, q = /alpha\(opacity *=.+?\)/i, r = /([A-Z])/g, s = /-([a-z])/gi, t = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, u = function (a, b) {
            return b.toUpperCase()
        }, v = /(?:Left|Right|Width)/i, w = /(M11|M12|M21|M22)=[\d\-\.e]+/gi, x = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i, y = /,(?=[^\)]*(?:\(|$))/gi, z = Math.PI / 180, A = 180 / Math.PI, B = {}, C = document, D = C.createElement("div"), E = C.createElement("img"), F = c._internals = {_specialProps: h}, G = navigator.userAgent, N = function () {
            var c, a = G.indexOf("Android"), b = C.createElement("div");
            return J = -1 !== G.indexOf("Safari") && -1 === G.indexOf("Chrome") && (-1 === a || Number(G.substr(a + 8, 1)) > 3), L = J && 6 > Number(G.substr(G.indexOf("Version/") + 8, 1)), K = -1 !== G.indexOf("Firefox"), /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(G), M = parseFloat(RegExp.$1), b.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>", c = b.getElementsByTagName("a")[0], c ? /^0.55/.test(c.style.opacity) : !1
        }(), O = function (a) {
            return o.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
        }, P = function (a) {
            window.console && console.log(a)
        }, Q = "", R = "", S = function (a, b) {
            b = b || D;
            var d, e, c = b.style;
            if (void 0 !== c[a])return a;
            for (a = a.charAt(0).toUpperCase() + a.substr(1), d = ["O", "Moz", "ms", "Ms", "Webkit"], e = 5; --e > -1 && void 0 === c[d[e] + a];);
            return e >= 0 ? (R = 3 === e ? "ms" : d[e], Q = "-" + R.toLowerCase() + "-", R + a) : null
        }, T = C.defaultView ? C.defaultView.getComputedStyle : function () {
        }, U = c.getStyle = function (a, b, c, d, e) {
            var f;
            return N || "opacity" !== b ? (!d && a.style[b] ? f = a.style[b] : (c = c || T(a, null)) ? (a = c.getPropertyValue(b.replace(r, "-$1").toLowerCase()), f = a || c.length ? a : c[b]) : a.currentStyle && (c = a.currentStyle, f = c[b]), null == e || f && "none" !== f && "auto" !== f && "auto auto" !== f ? f : e) : O(a)
        }, V = function (a, b, c) {
            var f, g, d = {}, e = a._gsOverwrittenClassNamePT;
            if (e && !c) {
                for (; e;)e.setRatio(0), e = e._next;
                a._gsOverwrittenClassNamePT = null
            }
            if (b = b || T(a, null))if (f = b.length)for (; --f > -1;)d[b[f].replace(s, u)] = b.getPropertyValue(b[f]); else for (f in b)d[f] = b[f]; else if (b = a.currentStyle || a.style)for (f in b)d[f.replace(s, u)] = b[f];
            return N || (d.opacity = O(a)), g = xb(a, b, !1), d.rotation = g.rotation * A, d.skewX = g.skewX * A, d.scaleX = g.scaleX, d.scaleY = g.scaleY, d.x = g.x, d.y = g.y, wb && (d.z = g.z, d.rotationX = g.rotationX * A, d.rotationY = g.rotationY * A, d.scaleZ = g.scaleZ), d.filters && delete d.filters, d
        }, W = function (a, b, c, d) {
            var g, h, i, e = {}, f = a.style;
            for (h in c)"cssText" !== h && "length" !== h && isNaN(h) && b[h] !== (g = c[h]) && -1 === h.indexOf("Origin") && ("number" == typeof g || "string" == typeof g) && (e[h] = "" !== g && "auto" !== g && "none" !== g || "string" != typeof b[h] || "" === b[h].replace(m, "") ? g : 0, void 0 !== f[h] && (i = new kb(f, h, f[h], i)));
            if (d)for (h in d)"className" !== h && (e[h] = d[h]);
            return{difs: e, firstMPT: i}
        }, X = {width: ["Left", "Right"], height: ["Top", "Bottom"]}, Y = ["marginLeft", "marginRight", "marginTop", "marginBottom"], Z = function (a, b, c) {
            var d = parseFloat("width" === b ? a.offsetWidth : a.offsetHeight), e = X[b], f = e.length;
            for (c = c || T(a, null); --f > -1;)d -= parseFloat(U(a, "padding" + e[f], c, !0)) || 0, d -= parseFloat(U(a, "border" + e[f] + "Width", c, !0)) || 0;
            return d
        }, $ = function (a, b, c, d, e) {
            if ("px" === d || !d)return c;
            if ("auto" === d || !c)return 0;
            var j, f = v.test(b), g = a, h = D.style, i = 0 > c;
            return i && (c = -c), "%" === d && -1 !== b.indexOf("border") ? j = c / 100 * (f ? a.clientWidth : a.clientHeight) : (h.cssText = "border-style:solid; border-width:0; position:absolute; line-height:0;", "%" !== d && g.appendChild ? h[f ? "borderLeftWidth" : "borderTopWidth"] = c + d : (g = a.parentNode || C.body, h[f ? "width" : "height"] = c + d), g.appendChild(D), j = parseFloat(D[f ? "offsetWidth" : "offsetHeight"]), g.removeChild(D), 0 !== j || e || (j = $(a, b, c, d, !0))), i ? -j : j
        }, _ = function (a, b) {
            (null == a || "" === a || "auto" === a || "auto auto" === a) && (a = "0 0");
            var c = a.split(" "), d = -1 !== a.indexOf("left") ? "0%" : -1 !== a.indexOf("right") ? "100%" : c[0], e = -1 !== a.indexOf("top") ? "0%" : -1 !== a.indexOf("bottom") ? "100%" : c[1];
            return null == e ? e = "0" : "center" === e && (e = "50%"), ("center" === d || isNaN(parseFloat(d))) && (d = "50%"), b && (b.oxp = -1 !== d.indexOf("%"), b.oyp = -1 !== e.indexOf("%"), b.oxr = "=" === d.charAt(1), b.oyr = "=" === e.charAt(1), b.ox = parseFloat(d.replace(m, "")), b.oy = parseFloat(e.replace(m, ""))), d + " " + e + (c.length > 2 ? " " + c[2] : "")
        }, ab = function (a, b) {
            return"string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(b)
        }, bb = function (a, b) {
            return null == a ? b : "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * Number(a.substr(2)) + b : parseFloat(a)
        }, cb = function (a, b, c, d) {
            var f, g, h, i, j, e = 1e-6;
            return null == a ? j = b : "number" == typeof a ? j = a * z : (f = 2 * Math.PI, g = a.split("_"), h = Number(g[0].replace(m, "")) * (-1 === a.indexOf("rad") ? z : 1) - ("=" === a.charAt(1) ? 0 : b), i = g[1], i && d && (d[c] = b + h), "short" === i ? (h %= f, h !== h % (f / 2) && (h = 0 > h ? h + f : h - f)) : "cw" === i && 0 > h ? h = (h + 9999999999 * f) % f - (0 | h / f) * f : "ccw" === i && h > 0 && (h = (h - 9999999999 * f) % f - (0 | h / f) * f), j = b + h), e > j && j > -e && (j = 0), j
        }, db = {aqua: [0, 255, 255], lime: [0, 255, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, 255], navy: [0, 0, 128], white: [255, 255, 255], fuchsia: [255, 0, 255], olive: [128, 128, 0], yellow: [255, 255, 0], orange: [255, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [255, 0, 0], pink: [255, 192, 203], cyan: [0, 255, 255], transparent: [255, 255, 255, 0]}, eb = function (a, b, c) {
            return a = 0 > a ? a + 1 : a > 1 ? a - 1 : a, 0 | 255 * (1 > 6 * a ? b + 6 * (c - b) * a : .5 > a ? c : 2 > 3 * a ? b + 6 * (c - b) * (2 / 3 - a) : b) + .5
        }, fb = function (a) {
            var b, c, d, e, f, g;
            return a && "" !== a ? "number" == typeof a ? [a >> 16, 255 & a >> 8, 255 & a] : ("," === a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1)), db[a] ? db[a] : "#" === a.charAt(0) ? (4 === a.length && (b = a.charAt(1), c = a.charAt(2), d = a.charAt(3), a = "#" + b + b + c + c + d + d), a = parseInt(a.substr(1), 16), [a >> 16, 255 & a >> 8, 255 & a]) : "hsl" === a.substr(0, 3) ? (a = a.match(j), e = Number(a[0]) % 360 / 360, f = Number(a[1]) / 100, g = Number(a[2]) / 100, c = .5 >= g ? g * (f + 1) : g + f - g * f, b = 2 * g - c, a.length > 3 && (a[3] = Number(a[3])), a[0] = eb(e + 1 / 3, b, c), a[1] = eb(e, b, c), a[2] = eb(e - 1 / 3, b, c), a) : (a = a.match(j) || db.transparent, a[0] = Number(a[0]), a[1] = Number(a[1]), a[2] = Number(a[2]), a.length > 3 && (a[3] = Number(a[3])), a)) : db.black
        }, gb = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
        for (i in db)gb += "|" + i + "\\b";
        gb = RegExp(gb + ")", "gi");
        var hb = function (a, b, c, d) {
            if (null == a)return function (a) {
                return a
            };
            var n, e = b ? (a.match(gb) || [""])[0] : "", f = a.split(e).join("").match(l) || [], g = a.substr(0, a.indexOf(f[0])), h = ")" === a.charAt(a.length - 1) ? ")" : "", i = -1 !== a.indexOf(" ") ? " " : ",", k = f.length, m = k > 0 ? f[0].replace(j, "") : "";
            return k ? n = b ? function (a) {
                var b, j, o, p;
                if ("number" == typeof a)a += m; else if (d && y.test(a)) {
                    for (p = a.replace(y, "|").split("|"), o = 0; p.length > o; o++)p[o] = n(p[o]);
                    return p.join(",")
                }
                if (b = (a.match(gb) || [e])[0], j = a.split(b).join("").match(l) || [], o = j.length, k > o--)for (; k > ++o;)j[o] = c ? j[(o - 1) / 2 >> 0] : f[o];
                return g + j.join(i) + i + b + h + (-1 !== a.indexOf("inset") ? " inset" : "")
            } : function (a) {
                var b, e, j;
                if ("number" == typeof a)a += m; else if (d && y.test(a)) {
                    for (e = a.replace(y, "|").split("|"), j = 0; e.length > j; j++)e[j] = n(e[j]);
                    return e.join(",")
                }
                if (b = a.match(l) || [], j = b.length, k > j--)for (; k > ++j;)b[j] = c ? b[(j - 1) / 2 >> 0] : f[j];
                return g + b.join(i) + h
            } : function (a) {
                return a
            }
        }, ib = function (a) {
            return a = a.split(","), function (b, c, d, e, f, g, h) {
                var j, i = (c + "").split(" ");
                for (h = {}, j = 0; 4 > j; j++)h[a[j]] = i[j] = i[j] || i[(j - 1) / 2 >> 0];
                return e.parse(b, h, f, g)
            }
        }, kb = (F._setPluginRatio = function (a) {
            this.plugin.setRatio(a);
            for (var f, g, h, i, b = this.data, c = b.proxy, d = b.firstMPT, e = 1e-6; d;)f = c[d.v], d.r ? f = f > 0 ? f + .5 >> 0 : f - .5 >> 0 : e > f && f > -e && (f = 0), d.t[d.p] = f, d = d._next;
            if (b.autoRotate && (b.autoRotate.rotation = c.rotation), 1 === a)for (d = b.firstMPT; d;) {
                if (g = d.t, g.type) {
                    if (1 === g.type) {
                        for (i = g.xs0 + g.s + g.xs1, h = 1; g.l > h; h++)i += g["xn" + h] + g["xs" + (h + 1)];
                        g.e = i
                    }
                } else g.e = g.s + g.xs0;
                d = d._next
            }
        }, function (a, b, c, d, e) {
            this.t = a, this.p = b, this.v = c, this.r = e, d && (d._prev = this, this._next = d)
        }), mb = (F._parseToProxy = function (a, b, c, d, e, f) {
            var l, m, n, o, p, g = d, h = {}, i = {}, j = c._transform, k = B;
            for (c._transform = null, B = b, d = p = c.parse(a, b, d, e), B = k, f && (c._transform = j, g && (g._prev = null, g._prev && (g._prev._next = null))); d && d !== g;) {
                if (1 >= d.type && (m = d.p, i[m] = d.s + d.c, h[m] = d.s, f || (o = new kb(d, "s", m, o, d.r), d.c = 0), 1 === d.type))for (l = d.l; --l > 0;)n = "xn" + l, m = d.p + "_" + n, i[m] = d.data[n], h[m] = d[n], f || (o = new kb(d, n, m, o, d.rxp[n]));
                d = d._next
            }
            return{proxy: h, end: i, firstMPT: o, pt: p}
        }, F.CSSPropTween = function (a, b, c, e, f, h, i, j, k, l, m) {
            this.t = a, this.p = b, this.s = c, this.c = e, this.n = i || "css_" + b, a instanceof mb || g.push(this.n), this.r = j, this.type = h || 0, k && (this.pr = k, d = !0), this.b = void 0 === l ? c : l, this.e = void 0 === m ? c + e : m, f && (this._next = f, f._prev = this)
        }), nb = c.parseComplex = function (a, b, c, d, e, f, g, h, i, l) {
            g = new mb(a, b, 0, 0, g, l ? 2 : 1, null, !1, h, c, d), d += "";
            var q, r, s, t, u, v, w, x, z, A, B, C, m = c.split(", ").join(",").split(" "), n = d.split(", ").join(",").split(" "), o = m.length, p = H !== !1;
            for ((-1 !== d.indexOf(",") || -1 !== c.indexOf(",")) && (m = m.join(" ").replace(y, ", ").split(" "), n = n.join(" ").replace(y, ", ").split(" "), o = m.length), o !== n.length && (m = (f || "").split(" "), o = m.length), g.plugin = i, g.setRatio = l, q = 0; o > q; q++)if (t = m[q], u = n[q], x = parseFloat(t), x || 0 === x)g.appendXtra("", x, ab(u, x), u.replace(k, ""), p && -1 !== u.indexOf("px"), !0); else if (e && ("#" === t.charAt(0) || 0 === t.indexOf("rgb") || db[t] || 0 === t.indexOf("hsl")))C = "," === u.charAt(u.length - 1) ? ")," : ")", t = fb(t), u = fb(u), z = t.length + u.length > 6, z && !N && 0 === u[3] ? (g["xs" + g.l] += g.l ? " transparent" : "transparent", g.e = g.e.split(n[q]).join("transparent")) : (N || (z = !1), g.appendXtra(z ? "rgba(" : "rgb(", t[0], u[0] - t[0], ",", !0, !0).appendXtra("", t[1], u[1] - t[1], ",", !0).appendXtra("", t[2], u[2] - t[2], z ? "," : C, !0), z && (t = 4 > t.length ? 1 : t[3], g.appendXtra("", t, (4 > u.length ? 1 : u[3]) - t, C, !1))); else if (v = t.match(j)) {
                if (w = u.match(k), !w || w.length !== v.length)return g;
                for (s = 0, r = 0; v.length > r; r++)B = v[r], A = t.indexOf(B, s), g.appendXtra(t.substr(s, A - s), Number(B), ab(w[r], B), "", p && "px" === t.substr(A + B.length, 2), 0 === r), s = A + B.length;
                g["xs" + g.l] += t.substr(s)
            } else g["xs" + g.l] += g.l ? " " + t : t;
            if (-1 !== d.indexOf("=") && g.data) {
                for (C = g.xs0 + g.data.s, q = 1; g.l > q; q++)C += g["xs" + q] + g.data["xn" + q];
                g.e = C + g["xs" + q]
            }
            return g.l || (g.type = -1, g.xs0 = g.e), g.xfirst || g
        }, ob = 9;
        for (i = mb.prototype, i.l = i.pr = 0; --ob > 0;)i["xn" + ob] = 0, i["xs" + ob] = "";
        i.xs0 = "", i._next = i._prev = i.xfirst = i.data = i.plugin = i.setRatio = i.rxp = null, i.appendXtra = function (a, b, c, d, e, f) {
            var g = this, h = g.l;
            return g["xs" + h] += f && h ? " " + a : a || "", c || 0 === h || g.plugin ? (g.l++, g.type = g.setRatio ? 2 : 1, g["xs" + g.l] = d || "", h > 0 ? (g.data["xn" + h] = b + c, g.rxp["xn" + h] = e, g["xn" + h] = b, g.plugin || (g.xfirst = new mb(g, "xn" + h, b, c, g.xfirst || g, 0, g.n, e, g.pr), g.xfirst.xs0 = 0), g) : (g.data = {s: b + c}, g.rxp = {}, g.s = b, g.c = c, g.r = e, g)) : (g["xs" + h] += b + (d || ""), g)
        };
        var pb = function (a, b) {
            b = b || {}, this.p = b.prefix ? S(a) || a : a, h[a] = h[this.p] = this, this.format = b.formatter || hb(b.defaultValue, b.color, b.collapsible, b.multi), b.parser && (this.parse = b.parser), this.clrs = b.color, this.multi = b.multi, this.keyword = b.keyword, this.dflt = b.defaultValue, this.pr = b.priority || 0
        }, qb = F._registerComplexSpecialProp = function (a, b, c) {
            "object" != typeof b && (b = {parser: c});
            var f, g, d = a.split(","), e = b.defaultValue;
            for (c = c || [e], f = 0; d.length > f; f++)b.prefix = 0 === f && b.prefix, b.defaultValue = c[f] || e, g = new pb(d[f], b)
        }, rb = function (a) {
            if (!h[a]) {
                var b = a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                qb(a, {parser: function (a, c, d, e, f, g, i) {
                    var j = (window.GreenSockGlobals || window).com.greensock.plugins[b];
                    return j ? (j._cssRegister(), h[d].parse(a, c, d, e, f, g, i)) : (P("Error: " + b + " js file not loaded."), f)
                }})
            }
        };
        i = pb.prototype, i.parseComplex = function (a, b, c, d, e, f) {
            var h, i, j, k, l, m, g = this.keyword;
            if (this.multi && (y.test(c) || y.test(b) ? (i = b.replace(y, "|").split("|"), j = c.replace(y, "|").split("|")) : g && (i = [b], j = [c])), j) {
                for (k = j.length > i.length ? j.length : i.length, h = 0; k > h; h++)b = i[h] = i[h] || this.dflt, c = j[h] = j[h] || this.dflt, g && (l = b.indexOf(g), m = c.indexOf(g), l !== m && (c = -1 === m ? j : i, c[h] += " " + g));
                b = i.join(", "), c = j.join(", ")
            }
            return nb(a, this.p, b, c, this.clrs, this.dflt, d, this.pr, e, f)
        }, i.parse = function (a, b, c, d, e, g) {
            return this.parseComplex(a.style, this.format(U(a, this.p, f, !1, this.dflt)), this.format(b), e, g)
        }, c.registerSpecialProp = function (a, b, c) {
            qb(a, {parser: function (a, d, e, f, g, h) {
                var j = new mb(a, e, 0, 0, g, 2, e, !1, c);
                return j.plugin = h, j.setRatio = b(a, d, f._tween, e), j
            }, priority: c})
        };
        var sb = "scaleX,scaleY,scaleZ,x,y,z,skewX,rotation,rotationX,rotationY,perspective".split(","), tb = S("transform"), ub = Q + "transform", vb = S("transformOrigin"), wb = null !== S("perspective"), xb = function (a, b, d) {
            var l, m, n, o, p, q, r, s, t, u, v, x, y, e = d ? a._gsTransform || {skewY: 0} : {skewY: 0}, f = 0 > e.scaleX, g = 2e-5, h = 1e5, i = -Math.PI + 1e-4, j = Math.PI - 1e-4, k = wb ? parseFloat(U(a, vb, b, !1, "0 0 0").split(" ")[2]) || e.zOrigin || 0 : 0;
            for (tb ? l = U(a, ub, b, !0) : a.currentStyle && (l = a.currentStyle.filter.match(w), l = l && 4 === l.length ? l[0].substr(4) + "," + Number(l[2].substr(4)) + "," + Number(l[1].substr(4)) + "," + l[3].substr(4) + "," + (e ? e.x : 0) + "," + (e ? e.y : 0) : null), m = (l || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], n = m.length; --n > -1;)o = Number(m[n]), m[n] = (p = o - (o |= 0)) ? (0 | p * h + (0 > p ? -.5 : .5)) / h + o : o;
            if (16 === m.length) {
                var z = m[8], A = m[9], B = m[10], C = m[12], D = m[13], E = m[14];
                if (e.zOrigin && (E = -e.zOrigin, C = z * E - m[12], D = A * E - m[13], E = B * E + e.zOrigin - m[14]), !d || C !== e.x || D !== e.y || E !== e.z) {
                    var Q, R, S, T, V, W, X, Y, F = m[0], G = m[1], H = m[2], I = m[3], J = m[4], K = m[5], L = m[6], M = m[7], N = m[11], O = e.rotationX = Math.atan2(L, B), P = i > O || O > j;
                    O && (V = Math.cos(-O), W = Math.sin(-O), Q = J * V + z * W, R = K * V + A * W, S = L * V + B * W, T = M * V + N * W, z = J * -W + z * V, A = K * -W + A * V, B = L * -W + B * V, N = M * -W + N * V, J = Q, K = R, L = S), O = e.rotationY = Math.atan2(z, F), O && (X = i > O || O > j, V = Math.cos(-O), W = Math.sin(-O), Q = F * V - z * W, R = G * V - A * W, S = H * V - B * W, T = I * V - N * W, A = G * W + A * V, B = H * W + B * V, N = I * W + N * V, F = Q, G = R, H = S), O = e.rotation = Math.atan2(G, K), O && (Y = i > O || O > j, V = Math.cos(-O), W = Math.sin(-O), F = F * V + J * W, R = G * V + K * W, K = G * -W + K * V, L = H * -W + L * V, G = R), Y && P ? e.rotation = e.rotationX = 0 : Y && X ? e.rotation = e.rotationY = 0 : X && P && (e.rotationY = e.rotationX = 0), e.scaleX = (Math.sqrt(F * F + G * G) * h + .5 >> 0) / h, e.scaleY = (Math.sqrt(K * K + A * A) * h + .5 >> 0) / h, e.scaleZ = (Math.sqrt(L * L + B * B) * h + .5 >> 0) / h, e.skewX = 0, e.perspective = N ? 1 / (0 > N ? -N : N) : 0, e.x = C, e.y = D, e.z = E
                }
            } else if (!wb || 0 === m.length || e.x !== m[4] || e.y !== m[5] || !e.rotationX && !e.rotationY) {
                var Z = m.length >= 6, $ = Z ? m[0] : 1, _ = m[1] || 0, ab = m[2] || 0, bb = Z ? m[3] : 1;
                e.x = m[4] || 0, e.y = m[5] || 0, q = Math.sqrt($ * $ + _ * _), r = Math.sqrt(bb * bb + ab * ab), s = $ || _ ? Math.atan2(_, $) : e.rotation || 0, t = ab || bb ? Math.atan2(ab, bb) + s : e.skewX || 0, u = q - Math.abs(e.scaleX || 0), v = r - Math.abs(e.scaleY || 0), Math.abs(t) > Math.PI / 2 && Math.abs(t) < 1.5 * Math.PI && (f ? (q *= -1, t += 0 >= s ? Math.PI : -Math.PI, s += 0 >= s ? Math.PI : -Math.PI) : (r *= -1, t += 0 >= t ? Math.PI : -Math.PI)), x = (s - e.rotation) % Math.PI, y = (t - e.skewX) % Math.PI, (void 0 === e.skewX || u > g || -g > u || v > g || -g > v || x > i && j > x && 0 !== x * h >> 0 || y > i && j > y && 0 !== y * h >> 0) && (e.scaleX = q, e.scaleY = r, e.rotation = s, e.skewX = t), wb && (e.rotationX = e.rotationY = e.z = 0, e.perspective = parseFloat(c.defaultTransformPerspective) || 0, e.scaleZ = 1)
            }
            e.zOrigin = k;
            for (n in e)g > e[n] && e[n] > -g && (e[n] = 0);
            return d && (a._gsTransform = e), e
        }, yb = function (a) {
            var l, m, b = this.data, c = -b.rotation, d = c + b.skewX, e = 1e5, f = (Math.cos(c) * b.scaleX * e >> 0) / e, g = (Math.sin(c) * b.scaleX * e >> 0) / e, h = (Math.sin(d) * -b.scaleY * e >> 0) / e, i = (Math.cos(d) * b.scaleY * e >> 0) / e, j = this.t.style, k = this.t.currentStyle;
            if (k) {
                m = g, g = -h, h = -m, l = k.filter, j.filter = "";
                var v, w, p = this.t.offsetWidth, q = this.t.offsetHeight, r = "absolute" !== k.position, s = "progid:DXImageTransform.Microsoft.Matrix(M11=" + f + ", M12=" + g + ", M21=" + h + ", M22=" + i, t = b.x, u = b.y;
                if (null != b.ox && (v = (b.oxp ? .01 * p * b.ox : b.ox) - p / 2, w = (b.oyp ? .01 * q * b.oy : b.oy) - q / 2, t += v - (v * f + w * g), u += w - (v * h + w * i)), r)v = p / 2, w = q / 2, s += ", Dx=" + (v - (v * f + w * g) + t) + ", Dy=" + (w - (v * h + w * i) + u) + ")"; else {
                    var z, A, B, y = 8 > M ? 1 : -1;
                    for (v = b.ieOffsetX || 0, w = b.ieOffsetY || 0, b.ieOffsetX = Math.round((p - ((0 > f ? -f : f) * p + (0 > g ? -g : g) * q)) / 2 + t), b.ieOffsetY = Math.round((q - ((0 > i ? -i : i) * q + (0 > h ? -h : h) * p)) / 2 + u), ob = 0; 4 > ob; ob++)A = Y[ob], z = k[A], m = -1 !== z.indexOf("px") ? parseFloat(z) : $(this.t, A, parseFloat(z), z.replace(n, "")) || 0, B = m !== b[A] ? 2 > ob ? -b.ieOffsetX : -b.ieOffsetY : 2 > ob ? v - b.ieOffsetX : w - b.ieOffsetY, j[A] = (b[A] = Math.round(m - B * (0 === ob || 2 === ob ? 1 : y))) + "px";
                    s += ", sizingMethod='auto expand')"
                }
                j.filter = -1 !== l.indexOf("DXImageTransform.Microsoft.Matrix(") ? l.replace(x, s) : s + " " + l, (0 === a || 1 === a) && 1 === f && 0 === g && 0 === h && 1 === i && (r && -1 === s.indexOf("Dx=0, Dy=0") || o.test(l) && 100 !== parseFloat(RegExp.$1) || -1 === l.indexOf("gradient(") && j.removeAttribute("filter"))
            }
        }, zb = function () {
            var x, y, z, A, B, C, D, E, F, b = this.data, c = this.t.style, d = b.perspective, e = b.scaleX, f = 0, g = 0, h = 0, i = 0, j = b.scaleY, k = 0, l = 0, m = 0, n = 0, o = b.scaleZ, p = 0, q = 0, r = 0, s = d ? -1 / d : 0, t = b.rotation, u = b.zOrigin, v = ",", w = 1e5;
            K && (D = c.top ? "top" : c.bottom ? "bottom" : parseFloat(U(this.t, "top", null, !1)) ? "bottom" : "top", z = U(this.t, D, null, !1), E = parseFloat(z) || 0, F = z.substr((E + "").length) || "px", b._ffFix = !b._ffFix, c[D] = (b._ffFix ? E + .05 : E - .05) + F), (t || b.skewX) && (z = e * Math.cos(t), A = j * Math.sin(t), t -= b.skewX, f = e * -Math.sin(t), j *= Math.cos(t), e = z, i = A), t = b.rotationY, t && (x = Math.cos(t), y = Math.sin(t), z = e * x, A = i * x, B = o * -y, C = s * -y, g = e * y, k = i * y, o *= x, s *= x, e = z, i = A, m = B, q = C), t = b.rotationX, t && (x = Math.cos(t), y = Math.sin(t), z = f * x + g * y, A = j * x + k * y, B = n * x + o * y, C = r * x + s * y, g = f * -y + g * x, k = j * -y + k * x, o = n * -y + o * x, s = r * -y + s * x, f = z, j = A, n = B, r = C), u && (p -= u, h = g * p, l = k * p, p = o * p + u), h = (z = (h += b.x) - (h |= 0)) ? (0 | z * w + (0 > z ? -.5 : .5)) / w + h : h, l = (z = (l += b.y) - (l |= 0)) ? (0 | z * w + (0 > z ? -.5 : .5)) / w + l : l, p = (z = (p += b.z) - (p |= 0)) ? (0 | z * w + (0 > z ? -.5 : .5)) / w + p : p, c[tb] = "matrix3d(" + (e * w >> 0) / w + v + (i * w >> 0) / w + v + (m * w >> 0) / w + v + (q * w >> 0) / w + v + (f * w >> 0) / w + v + (j * w >> 0) / w + v + (n * w >> 0) / w + v + (r * w >> 0) / w + v + (g * w >> 0) / w + v + (k * w >> 0) / w + v + (o * w >> 0) / w + v + (s * w >> 0) / w + v + h + v + l + v + p + v + (d ? 1 + -p / d : 1) + ")"
        }, Ab = function () {
            var e, f, g, h, i, j, k, l, m, b = this.data, c = this.t, d = c.style;
            K && (e = d.top ? "top" : d.bottom ? "bottom" : parseFloat(U(c, "top", null, !1)) ? "bottom" : "top", f = U(c, e, null, !1), g = parseFloat(f) || 0, h = f.substr((g + "").length) || "px", b._ffFix = !b._ffFix, d[e] = (b._ffFix ? g + .05 : g - .05) + h), b.rotation || b.skewX ? (i = b.rotation, j = i - b.skewX, k = 1e5, l = b.scaleX * k, m = b.scaleY * k, d[tb] = "matrix(" + (Math.cos(i) * l >> 0) / k + "," + (Math.sin(i) * l >> 0) / k + "," + (Math.sin(j) * -m >> 0) / k + "," + (Math.cos(j) * m >> 0) / k + "," + b.x + "," + b.y + ")") : d[tb] = "matrix(" + b.scaleX + ",0,0," + b.scaleY + "," + b.x + "," + b.y + ")"
        };
        qb("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation", {parser: function (a, b, c, d, e, g, h) {
            if (d._transform)return e;
            var o, p, q, r, s, t, u, i = d._transform = xb(a, f, !0), j = a.style, k = 1e-6, l = sb.length, m = h, n = {};
            if ("string" == typeof m.transform && tb)q = j.cssText, j[tb] = m.transform, j.display = "block", o = xb(a, null, !1), j.cssText = q; else if ("object" == typeof m) {
                if (o = {scaleX: bb(null != m.scaleX ? m.scaleX : m.scale, i.scaleX), scaleY: bb(null != m.scaleY ? m.scaleY : m.scale, i.scaleY), scaleZ: bb(null != m.scaleZ ? m.scaleZ : m.scale, i.scaleZ), x: bb(m.x, i.x), y: bb(m.y, i.y), z: bb(m.z, i.z), perspective: bb(m.transformPerspective, i.perspective)}, u = m.directionalRotation, null != u)if ("object" == typeof u)for (q in u)m[q] = u[q]; else m.rotation = u;
                o.rotation = cb("rotation"in m ? m.rotation : "shortRotation"in m ? m.shortRotation + "_short" : "rotationZ"in m ? m.rotationZ : i.rotation * A, i.rotation, "rotation", n), wb && (o.rotationX = cb("rotationX"in m ? m.rotationX : "shortRotationX"in m ? m.shortRotationX + "_short" : i.rotationX * A || 0, i.rotationX, "rotationX", n), o.rotationY = cb("rotationY"in m ? m.rotationY : "shortRotationY"in m ? m.shortRotationY + "_short" : i.rotationY * A || 0, i.rotationY, "rotationY", n)), o.skewX = null == m.skewX ? i.skewX : cb(m.skewX, i.skewX), o.skewY = null == m.skewY ? i.skewY : cb(m.skewY, i.skewY), (p = o.skewY - i.skewY) && (o.skewX += p, o.rotation += p)
            }
            for (s = i.z || i.rotationX || i.rotationY || o.z || o.rotationX || o.rotationY || o.perspective, s || null == m.scale || (o.scaleZ = 1); --l > -1;)c = sb[l], r = o[c] - i[c], (r > k || -k > r || null != B[c]) && (t = !0, e = new mb(i, c, i[c], r, e), c in n && (e.e = n[c]), e.xs0 = 0, e.plugin = g, d._overwriteProps.push(e.n));
            return r = m.transformOrigin, (r || wb && s && i.zOrigin) && (tb ? (t = !0, r = (r || U(a, c, f, !1, "50% 50%")) + "", c = vb, e = new mb(j, c, 0, 0, e, -1, "css_transformOrigin"), e.b = j[c], e.plugin = g, wb ? (q = i.zOrigin, r = r.split(" "), i.zOrigin = (r.length > 2 ? parseFloat(r[2]) : q) || 0, e.xs0 = e.e = j[c] = r[0] + " " + (r[1] || "50%") + " 0px", e = new mb(i, "zOrigin", 0, 0, e, -1, e.n), e.b = q, e.xs0 = e.e = i.zOrigin) : e.xs0 = e.e = j[c] = r) : _(r + "", i)), t && (d._transformType = s || 3 === this._transformType ? 3 : 2), e
        }, prefix: !0}), qb("boxShadow", {defaultValue: "0px 0px 0px 0px #999", prefix: !0, color: !0, multi: !0, keyword: "inset"}), qb("borderRadius", {defaultValue: "0px", parser: function (a, b, c, d, g) {
            b = this.format(b);
            var k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, i = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"], j = a.style;
            for (s = parseFloat(a.offsetWidth), t = parseFloat(a.offsetHeight), k = b.split(" "), l = 0; i.length > l; l++)this.p.indexOf("border") && (i[l] = S(i[l])), o = n = U(a, i[l], f, !1, "0px"), -1 !== o.indexOf(" ") && (n = o.split(" "), o = n[0], n = n[1]), p = m = k[l], q = parseFloat(o), v = o.substr((q + "").length), w = "=" === p.charAt(1), w ? (r = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), r *= parseFloat(p), u = p.substr((r + "").length - (0 > r ? 1 : 0)) || "") : (r = parseFloat(p), u = p.substr((r + "").length)), "" === u && (u = e[c] || v), u !== v && (x = $(a, "borderLeft", q, v), y = $(a, "borderTop", q, v), "%" === u ? (o = 100 * (x / s) + "%", n = 100 * (y / t) + "%") : "em" === u ? (z = $(a, "borderLeft", 1, "em"), o = x / z + "em", n = y / z + "em") : (o = x + "px", n = y + "px"), w && (p = parseFloat(o) + r + u, m = parseFloat(n) + r + u)), g = nb(j, i[l], o + " " + n, p + " " + m, !1, "0px", g);
            return g
        }, prefix: !0, formatter: hb("0px 0px 0px 0px", !1, !0)}), qb("backgroundPosition", {defaultValue: "0 0", parser: function (a, b, c, d, e, g) {
            var l, m, n, o, p, q, h = "background-position", i = f || T(a, null), j = this.format((i ? M ? i.getPropertyValue(h + "-x") + " " + i.getPropertyValue(h + "-y") : i.getPropertyValue(h) : a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0"), k = this.format(b);
            if (-1 !== j.indexOf("%") != (-1 !== k.indexOf("%")) && (q = U(a, "backgroundImage").replace(t, ""), q && "none" !== q)) {
                for (l = j.split(" "), m = k.split(" "), E.setAttribute("src", q), n = 2; --n > -1;)j = l[n], o = -1 !== j.indexOf("%"), o !== (-1 !== m[n].indexOf("%")) && (p = 0 === n ? a.offsetWidth - E.width : a.offsetHeight - E.height, l[n] = o ? parseFloat(j) / 100 * p + "px" : 100 * (parseFloat(j) / p) + "%");
                j = l.join(" ")
            }
            return this.parseComplex(a.style, j, k, e, g)
        }, formatter: _}), qb("backgroundSize", {defaultValue: "0 0", formatter: _}), qb("perspective", {defaultValue: "0px", prefix: !0}), qb("perspectiveOrigin", {defaultValue: "50% 50%", prefix: !0}), qb("transformStyle", {prefix: !0}), qb("backfaceVisibility", {prefix: !0}), qb("margin", {parser: ib("marginTop,marginRight,marginBottom,marginLeft")}), qb("padding", {parser: ib("paddingTop,paddingRight,paddingBottom,paddingLeft")}), qb("clip", {defaultValue: "rect(0px,0px,0px,0px)", parser: function (a, b, c, d, e, g) {
            var h, i, j;
            return 9 > M ? (i = a.currentStyle, j = 8 > M ? " " : ",", h = "rect(" + i.clipTop + j + i.clipRight + j + i.clipBottom + j + i.clipLeft + ")", b = this.format(b).split(",").join(j)) : (h = this.format(U(a, this.p, f, !1, this.dflt)), b = this.format(b)), this.parseComplex(a.style, h, b, e, g)
        }}), qb("textShadow", {defaultValue: "0px 0px 0px #999", color: !0, multi: !0}), qb("autoRound,strictUnits", {parser: function (a, b, c, d, e) {
            return e
        }}), qb("border", {defaultValue: "0px solid #000", parser: function (a, b, c, d, e, g) {
            return this.parseComplex(a.style, this.format(U(a, "borderTopWidth", f, !1, "0px") + " " + U(a, "borderTopStyle", f, !1, "solid") + " " + U(a, "borderTopColor", f, !1, "#000")), this.format(b), e, g)
        }, color: !0, formatter: function (a) {
            var b = a.split(" ");
            return b[0] + " " + (b[1] || "solid") + " " + (a.match(gb) || ["#000"])[0]
        }}), qb("float,cssFloat,styleFloat", {parser: function (a, b, c, d, e) {
            var g = a.style, h = "cssFloat"in g ? "cssFloat" : "styleFloat";
            return new mb(g, h, 0, 0, e, -1, c, !1, 0, g[h], b)
        }});
        var Bb = function (a) {
            var e, b = this.t, c = b.filter, d = this.s + this.c * a >> 0;
            100 === d && (-1 === c.indexOf("atrix(") && -1 === c.indexOf("radient(") ? (b.removeAttribute("filter"), e = !U(this.data, "filter")) : (b.filter = c.replace(q, ""), e = !0)), e || (this.xn1 && (b.filter = c = c || "alpha(opacity=100)"), -1 === c.indexOf("opacity") ? b.filter += " alpha(opacity=" + d + ")" : b.filter = c.replace(o, "opacity=" + d))
        };
        qb("opacity,alpha,autoAlpha", {defaultValue: "1", parser: function (a, b, c, d, e, g) {
            var j, h = parseFloat(U(a, "opacity", f, !1, "1")), i = a.style;
            return b = parseFloat(b), "autoAlpha" === c && (j = U(a, "visibility", f), 1 === h && "hidden" === j && 0 !== b && (h = 0), e = new mb(i, "visibility", 0, 0, e, -1, null, !1, 0, 0 !== h ? "visible" : "hidden", 0 === b ? "hidden" : "visible"), e.xs0 = "visible", d._overwriteProps.push(e.n)), N ? e = new mb(i, "opacity", h, b - h, e) : (e = new mb(i, "opacity", 100 * h, 100 * (b - h), e), e.xn1 = "autoAlpha" === c ? 1 : 0, i.zoom = 1, e.type = 2, e.b = "alpha(opacity=" + e.s + ")", e.e = "alpha(opacity=" + (e.s + e.c) + ")", e.data = a, e.plugin = g, e.setRatio = Bb), e
        }});
        var Cb = function (a) {
            if (1 === a || 0 === a) {
                this.t.className = 1 === a ? this.e : this.b;
                for (var b = this.data, c = this.t.style, d = c.removeProperty ? "removeProperty" : "removeAttribute"; b;)b.v ? c[b.p] = b.v : c[d](b.p.replace(r, "-$1").toLowerCase()), b = b._next
            } else this.t.className !== this.b && (this.t.className = this.b)
        };
        qb("className", {parser: function (a, b, c, e, g, h, i) {
            var l, m, j = a.className, k = a.style.cssText;
            return g = e._classNamePT = new mb(a, c, 0, 0, g, 2), g.setRatio = Cb, g.pr = -11, d = !0, g.b = j, g.e = "=" !== b.charAt(1) ? b : "+" === b.charAt(0) ? j + " " + b.substr(2) : j.split(b.substr(2)).join(""), e._tween._duration && (m = V(a, f, !0), a.className = g.e, l = W(a, m, V(a), i), a.className = j, g.data = l.firstMPT, a.style.cssText = k, g = g.xfirst = e.parse(a, l.difs, g, h)), g
        }});
        var Db = function (a) {
            if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration)for (var i, b = "all" === this.e, c = this.t.style, d = b ? c.cssText.split(";") : this.e.split(","), e = c.removeProperty ? "removeProperty" : "removeAttribute", f = d.length, g = h.transform.parse; --f > -1;)i = d[f], b && (i = i.substr(0, i.indexOf(":")).split(" ").join("")), h[i] && (i = h[i].parse === g ? tb : h[i].p), i && c[e](i.replace(r, "-$1").toLowerCase())
        };
        for (qb("clearProps", {parser: function (a, b, c, e, f) {
            return f = new mb(a, c, 0, 0, f, 2), f.setRatio = Db, f.e = b, f.pr = -10, f.data = e._tween, d = !0, f
        }}), i = "bezier,throwProps,physicsProps,physics2D".split(","), ob = i.length; ob--;)rb(i[ob]);
        i = c.prototype, i._firstPT = null, i._onInitTween = function (a, b, h) {
            if (!a.nodeType)return!1;
            this._target = a, this._tween = h, this._vars = b, H = b.autoRound, d = !1, e = b.suffixMap || c.suffixMap, f = T(a, ""), g = this._overwriteProps;
            var j, k, l, m, n, o, q, r, s, i = a.style;
            if (I && "" === i.zIndex && (j = U(a, "zIndex", f), ("auto" === j || "" === j) && (i.zIndex = 0)), "string" == typeof b && (m = i.cssText, j = V(a, f), i.cssText = m + ";" + b, j = W(a, j, V(a)).difs, !N && p.test(b) && (j.opacity = parseFloat(RegExp.$1)), b = j, i.cssText = m), this._firstPT = k = this.parse(a, b, null), this._transformType) {
                for (s = 3 === this._transformType, tb ? J && (I = !0, "" === i.zIndex && (q = U(a, "zIndex", f), ("auto" === q || "" === q) && (i.zIndex = 0)), L && (i.WebkitBackfaceVisibility = this._vars.WebkitBackfaceVisibility || (s ? "visible" : "hidden"))) : i.zoom = 1, l = k; l && l._next;)l = l._next;
                r = new mb(a, "transform", 0, 0, null, 2), this._linkCSSP(r, null, l), r.setRatio = s && wb ? zb : tb ? Ab : yb, r.data = this._transform || xb(a, f, !0), g.pop()
            }
            if (d) {
                for (; k;) {
                    for (o = k._next, l = m; l && l.pr > k.pr;)l = l._next;
                    (k._prev = l ? l._prev : n) ? k._prev._next = k : m = k, (k._next = l) ? l._prev = k : n = k, k = o
                }
                this._firstPT = m
            }
            return!0
        }, i.parse = function (a, b, c, d) {
            var i, j, k, l, m, o, p, q, r, s, g = a.style;
            for (i in b)o = b[i], j = h[i], j ? c = j.parse(a, o, i, this, c, d, b) : (m = U(a, i, f) + "", r = "string" == typeof o, "color" === i || "fill" === i || "stroke" === i || -1 !== i.indexOf("Color") || r && !o.indexOf("rgb") ? (r || (o = fb(o), o = (o.length > 3 ? "rgba(" : "rgb(") + o.join(",") + ")"), c = nb(g, i, m, o, !0, "transparent", c, 0, d)) : !r || -1 === o.indexOf(" ") && -1 === o.indexOf(",") ? (k = parseFloat(m), p = k || 0 === k ? m.substr((k + "").length) : "", ("" === m || "auto" === m) && ("width" === i || "height" === i ? (k = Z(a, i, f), p = "px") : (k = "opacity" !== i ? 0 : 1, p = "")), s = r && "=" === o.charAt(1), s ? (l = parseInt(o.charAt(0) + "1", 10), o = o.substr(2), l *= parseFloat(o), q = o.replace(n, "")) : (l = parseFloat(o), q = r ? o.substr((l + "").length) || "" : ""), "" === q && (q = e[i] || p), o = l || 0 === l ? (s ? l + k : l) + q : b[i], p !== q && "" !== q && (l || 0 === l) && (k || 0 === k) && (k = $(a, i, k, p), "%" === q ? (k /= $(a, i, 100, "%") / 100, k > 100 && (k = 100), b.strictUnits !== !0 && (m = k + "%")) : "em" === q ? k /= $(a, i, 1, "em") : (l = $(a, i, l, q), q = "px"), s && (l || 0 === l) && (o = l + k + q)), s && (l += k), !k && 0 !== k || !l && 0 !== l ? o || "NaN" != o + "" && null != o ? (c = new mb(g, i, l || k || 0, 0, c, -1, "css_" + i, !1, 0, m, o), c.xs0 = "display" === i && "none" === o ? m : o) : P("invalid " + i + " tween value: " + b[i]) : (c = new mb(g, i, k, l - k, c, 0, "css_" + i, H !== !1 && ("px" === q || "zIndex" === i), 0, m, o), c.xs0 = q)) : c = nb(g, i, m, o, !0, null, c, 0, d)), d && c && !c.plugin && (c.plugin = d);
            return c
        }, i.setRatio = function (a) {
            var d, e, f, b = this._firstPT, c = 1e-6;
            if (1 !== a || this._tween._time !== this._tween._duration && 0 !== this._tween._time)if (a || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)for (; b;) {
                if (d = b.c * a + b.s, b.r ? d = d > 0 ? d + .5 >> 0 : d - .5 >> 0 : c > d && d > -c && (d = 0), b.type)if (1 === b.type)if (f = b.l, 2 === f)b.t[b.p] = b.xs0 + d + b.xs1 + b.xn1 + b.xs2; else if (3 === f)b.t[b.p] = b.xs0 + d + b.xs1 + b.xn1 + b.xs2 + b.xn2 + b.xs3; else if (4 === f)b.t[b.p] = b.xs0 + d + b.xs1 + b.xn1 + b.xs2 + b.xn2 + b.xs3 + b.xn3 + b.xs4; else if (5 === f)b.t[b.p] = b.xs0 + d + b.xs1 + b.xn1 + b.xs2 + b.xn2 + b.xs3 + b.xn3 + b.xs4 + b.xn4 + b.xs5; else {
                    for (e = b.xs0 + d + b.xs1, f = 1; b.l > f; f++)e += b["xn" + f] + b["xs" + (f + 1)];
                    b.t[b.p] = e
                } else-1 === b.type ? b.t[b.p] = b.xs0 : b.setRatio && b.setRatio(a); else b.t[b.p] = d + b.xs0;
                b = b._next
            } else for (; b;)2 !== b.type ? b.t[b.p] = b.b : b.setRatio(a), b = b._next; else for (; b;)2 !== b.type ? b.t[b.p] = b.e : b.setRatio(a), b = b._next
        }, i._enableTransforms = function (a) {
            this._transformType = a || 3 === this._transformType ? 3 : 2
        }, i._linkCSSP = function (a, b, c, d) {
            return a && (b && (b._prev = a), a._next && (a._next._prev = a._prev), c ? c._next = a : d || null !== this._firstPT || (this._firstPT = a), a._prev ? a._prev._next = a._next : this._firstPT === a && (this._firstPT = a._next), a._next = b, a._prev = c), a
        }, i._kill = function (b) {
            var e, f, g, c = b, d = !1;
            if (b.css_autoAlpha || b.css_alpha) {
                c = {};
                for (f in b)c[f] = b[f];
                c.css_opacity = 1, c.css_autoAlpha && (c.css_visibility = 1)
            }
            return b.css_className && (e = this._classNamePT) && (g = e.xfirst, g && g._prev ? this._linkCSSP(g._prev, e._next, g._prev._prev) : g === this._firstPT && (this._firstPT = null), e._next && this._linkCSSP(e._next, e._next._next, g._prev), this._target._gsOverwrittenClassNamePT = this._linkCSSP(e, this._target._gsOverwrittenClassNamePT), this._classNamePT = null, d = !0), a.prototype._kill.call(this, c) || d
        };
        var Eb = function (a, b, c) {
            var d, e, f, g;
            if (a.slice)for (e = a.length; --e > -1;)Eb(a[e], b, c); else for (d = a.childNodes, e = d.length; --e > -1;)f = d[e], g = f.type, f.style && (b.push(V(f)), c && c.push(f)), 1 !== g && 9 !== g && 11 !== g || !f.childNodes.length || Eb(f, b, c)
        };
        return c.cascadeTo = function (a, c, d) {
            var k, l, m, e = b.to(a, c, d), f = [e], g = [], h = [], i = [], j = b._internals.reservedProps;
            for (a = e._targets || e.target, Eb(a, g, i), e.render(c, !0), Eb(a, h), e.render(0, !0), e._enabled(!0), k = i.length; --k > -1;)if (l = W(i[k], g[k], h[k]), l.firstMPT) {
                l = l.difs;
                for (m in d)j[m] && (l[m] = d[m]);
                f.push(b.to(i[k], c, l))
            }
            return f
        }, a.activate([c]), c
    }, !0)
}), window._gsDefine && window._gsQueue.pop()();
/*!
 * VERSION: beta 1.2.2
 * DATE: 2013-03-25
 * JavaScript (also available in AS3 and AS2)
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push(function () {
    "use strict";
    var a = 180 / Math.PI, b = Math.PI / 180, c = [], d = [], e = [], f = {}, g = function (a, b, c, d) {
        this.a = a, this.b = b, this.c = c, this.d = d, this.da = d - a, this.ca = c - a, this.ba = b - a
    }, h = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,", i = function (a, b, c, d) {
        var e = {a: a}, f = {}, g = {}, h = {c: d}, i = (a + b) / 2, j = (b + c) / 2, k = (c + d) / 2, l = (i + j) / 2, m = (j + k) / 2, n = (m - l) / 8;
        return e.b = i + (a - i) / 4, f.b = l + n, e.c = f.a = (e.b + f.b) / 2, f.c = g.a = (l + m) / 2, g.b = m - n, h.b = k + (d - k) / 4, g.c = h.a = (g.b + h.b) / 2, [e, f, g, h]
    }, j = function (a, b, f, g, h) {
        var m, n, o, p, q, r, s, t, u, v, w, x, y, j = a.length - 1, k = 0, l = a[0].a;
        for (m = 0; j > m; m++)q = a[k], n = q.a, o = q.d, p = a[k + 1].d, h ? (w = c[m], x = d[m], y = .25 * (x + w) * b / (g ? .5 : e[m] || .5), r = o - (o - n) * (g ? .5 * b : y / w), s = o + (p - o) * (g ? .5 * b : y / x), t = o - (r + (s - r) * (3 * w / (w + x) + .5) / 4)) : (r = o - .5 * (o - n) * b, s = o + .5 * (p - o) * b, t = o - (r + s) / 2), r += t, s += t, q.c = u = r, q.b = 0 !== m ? l : l = q.a + .6 * (q.c - q.a), q.da = o - n, q.ca = u - n, q.ba = l - n, f ? (v = i(n, l, u, o), a.splice(k, 1, v[0], v[1], v[2], v[3]), k += 4) : k++, l = s;
        q = a[k], q.b = l, q.c = l + .4 * (q.d - l), q.da = q.d - q.a, q.ca = q.c - q.a, q.ba = l - q.a, f && (v = i(q.a, l, q.c, q.d), a.splice(k, 1, v[0], v[1], v[2], v[3]))
    }, k = function (a, b, e, f) {
        var i, j, k, l, m, n, h = [];
        if (f)for (a = [f].concat(a), j = a.length; --j > -1;)"string" == typeof(n = a[j][b]) && "=" === n.charAt(1) && (a[j][b] = f[b] + Number(n.charAt(0) + n.substr(2)));
        if (i = a.length - 2, 0 > i)return h[0] = new g(a[0][b], 0, 0, a[-1 > i ? 0 : 1][b]), h;
        for (j = 0; i > j; j++)k = a[j][b], l = a[j + 1][b], h[j] = new g(k, 0, 0, l), e && (m = a[j + 2][b], c[j] = (c[j] || 0) + (l - k) * (l - k), d[j] = (d[j] || 0) + (m - l) * (m - l));
        return h[j] = new g(a[j][b], 0, 0, a[j + 1][b]), h
    }, l = function (a, b, g, i, l, m) {
        var q, r, s, t, u, v, w, x, n = {}, o = [], p = m || a[0];
        l = "string" == typeof l ? "," + l + "," : h, null == b && (b = 1);
        for (r in a[0])o.push(r);
        if (a.length > 1) {
            for (x = a[a.length - 1], w = !0, q = o.length; --q > -1;)if (r = o[q], Math.abs(p[r] - x[r]) > .05) {
                w = !1;
                break
            }
            w && (a = a.concat(), m && a.unshift(m), a.push(a[1]), m = a[a.length - 3])
        }
        for (c.length = d.length = e.length = 0, q = o.length; --q > -1;)r = o[q], f[r] = -1 !== l.indexOf("," + r + ","), n[r] = k(a, r, f[r], m);
        for (q = c.length; --q > -1;)c[q] = Math.sqrt(c[q]), d[q] = Math.sqrt(d[q]);
        if (!i) {
            for (q = o.length; --q > -1;)if (f[r])for (s = n[o[q]], v = s.length - 1, t = 0; v > t; t++)u = s[t + 1].da / d[t] + s[t].da / c[t], e[t] = (e[t] || 0) + u * u;
            for (q = e.length; --q > -1;)e[q] = Math.sqrt(e[q])
        }
        for (q = o.length, t = g ? 4 : 1; --q > -1;)r = o[q], s = n[r], j(s, b, g, i, f[r]), w && (s.splice(0, t), s.splice(s.length - t, t));
        return n
    }, m = function (a, b, c) {
        b = b || "soft";
        var i, j, k, l, m, n, o, p, q, r, s, d = {}, e = "cubic" === b ? 3 : 2, f = "soft" === b, h = [];
        if (f && c && (a = [c].concat(a)), null == a || e + 1 > a.length)throw"invalid Bezier data";
        for (q in a[0])h.push(q);
        for (n = h.length; --n > -1;) {
            for (q = h[n], d[q] = m = [], r = 0, p = a.length, o = 0; p > o; o++)i = null == c ? a[o][q] : "string" == typeof(s = a[o][q]) && "=" === s.charAt(1) ? c[q] + Number(s.charAt(0) + s.substr(2)) : Number(s), f && o > 1 && p - 1 > o && (m[r++] = (i + m[r - 2]) / 2), m[r++] = i;
            for (p = r - e + 1, r = 0, o = 0; p > o; o += e)i = m[o], j = m[o + 1], k = m[o + 2], l = 2 === e ? 0 : m[o + 3], m[r++] = s = 3 === e ? new g(i, j, k, l) : new g(i, (2 * j + i) / 3, (2 * j + k) / 3, k);
            m.length = r
        }
        return d
    }, n = function (a, b, c) {
        for (var f, g, h, i, j, k, l, m, n, o, p, d = 1 / c, e = a.length; --e > -1;)for (o = a[e], h = o.a, i = o.d - h, j = o.c - h, k = o.b - h, f = g = 0, m = 1; c >= m; m++)l = d * m, n = 1 - l, f = g - (g = (l * l * i + 3 * n * (l * j + n * k)) * l), p = e * c + m - 1, b[p] = (b[p] || 0) + f * f
    }, o = function (a, b) {
        b = b >> 0 || 6;
        var j, k, l, m, c = [], d = [], e = 0, f = 0, g = b - 1, h = [], i = [];
        for (j in a)n(a[j], c, b);
        for (l = c.length, k = 0; l > k; k++)e += Math.sqrt(c[k]), m = k % b, i[m] = e, m === g && (f += e, m = k / b >> 0, h[m] = i, d[m] = f, e = 0, i = []);
        return{length: f, lengths: d, segments: h}
    }, p = window._gsDefine.plugin({propName: "bezier", priority: -1, API: 2, init: function (a, b, c) {
        this._target = a, b instanceof Array && (b = {values: b}), this._func = {}, this._round = {}, this._props = [], this._timeRes = null == b.timeResolution ? 6 : parseInt(b.timeResolution, 10);
        var h, i, j, k, n, d = b.values || [], e = {}, f = d[0], g = b.autoRotate || c.vars.orientToBezier;
        this._autoRotate = g ? g instanceof Array ? g : [
            ["x", "y", "rotation", g === !0 ? 0 : Number(g) || 0]
        ] : null;
        for (h in f)this._props.push(h);
        for (j = this._props.length; --j > -1;)h = this._props[j], this._overwriteProps.push(h), i = this._func[h] = "function" == typeof a[h], e[h] = i ? a[h.indexOf("set") || "function" != typeof a["get" + h.substr(3)] ? h : "get" + h.substr(3)]() : parseFloat(a[h]), n || e[h] !== d[0][h] && (n = e);
        if (this._beziers = "cubic" !== b.type && "quadratic" !== b.type && "soft" !== b.type ? l(d, isNaN(b.curviness) ? 1 : b.curviness, !1, "thruBasic" === b.type, b.correlate, n) : m(d, b.type, e), this._segCount = this._beziers[h].length, this._timeRes) {
            var p = o(this._beziers, this._timeRes);
            this._length = p.length, this._lengths = p.lengths, this._segments = p.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length
        }
        if (g = this._autoRotate)for (g[0]instanceof Array || (this._autoRotate = g = [g]), j = g.length; --j > -1;)for (k = 0; 3 > k; k++)h = g[j][k], this._func[h] = "function" == typeof a[h] ? a[h.indexOf("set") || "function" != typeof a["get" + h.substr(3)] ? h : "get" + h.substr(3)] : !1;
        return!0
    }, set: function (b) {
        var f, g, h, i, j, k, l, m, n, o, c = this._segCount, d = this._func, e = this._target;
        if (this._timeRes) {
            if (n = this._lengths, o = this._curSeg, b *= this._length, h = this._li, b > this._l2 && c - 1 > h) {
                for (m = c - 1; m > h && b >= (this._l2 = n[++h]););
                this._l1 = n[h - 1], this._li = h, this._curSeg = o = this._segments[h], this._s2 = o[this._s1 = this._si = 0]
            } else if (this._l1 > b && h > 0) {
                for (; h > 0 && (this._l1 = n[--h]) >= b;);
                0 === h && this._l1 > b ? this._l1 = 0 : h++, this._l2 = n[h], this._li = h, this._curSeg = o = this._segments[h], this._s1 = o[(this._si = o.length - 1) - 1] || 0, this._s2 = o[this._si]
            }
            if (f = h, b -= this._l1, h = this._si, b > this._s2 && o.length - 1 > h) {
                for (m = o.length - 1; m > h && b >= (this._s2 = o[++h]););
                this._s1 = o[h - 1], this._si = h
            } else if (this._s1 > b && h > 0) {
                for (; h > 0 && (this._s1 = o[--h]) >= b;);
                0 === h && this._s1 > b ? this._s1 = 0 : h++, this._s2 = o[h], this._si = h
            }
            k = (h + (b - this._s1) / (this._s2 - this._s1)) * this._prec
        } else f = 0 > b ? 0 : b >= 1 ? c - 1 : c * b >> 0, k = (b - f * (1 / c)) * c;
        for (g = 1 - k, h = this._props.length; --h > -1;)i = this._props[h], j = this._beziers[i][f], l = (k * k * j.da + 3 * g * (k * j.ca + g * j.ba)) * k + j.a, this._round[i] && (l = l + (l > 0 ? .5 : -.5) >> 0), d[i] ? e[i](l) : e[i] = l;
        if (this._autoRotate) {
            var q, r, s, t, u, v, w, p = this._autoRotate;
            for (h = p.length; --h > -1;)i = p[h][2], v = p[h][3] || 0, w = p[h][4] === !0 ? 1 : a, j = this._beziers[p[h][0]][f], q = this._beziers[p[h][1]][f], r = j.a + (j.b - j.a) * k, t = j.b + (j.c - j.b) * k, r += (t - r) * k, t += (j.c + (j.d - j.c) * k - t) * k, s = q.a + (q.b - q.a) * k, u = q.b + (q.c - q.b) * k, s += (u - s) * k, u += (q.c + (q.d - q.c) * k - u) * k, l = Math.atan2(u - s, t - r) * w + v, d[i] ? e[i](l) : e[i] = l
        }
    }}), q = p.prototype;
    p.bezierThrough = l, p.cubicToQuadratic = i, p._autoCSS = !0, p.quadraticToCubic = function (a, b, c) {
        return new g(a, (2 * b + a) / 3, (2 * b + c) / 3, c)
    }, p._cssRegister = function () {
        var a = window._gsDefine.globals.CSSPlugin;
        if (a) {
            var c = a._internals, d = c._parseToProxy, e = c._setPluginRatio, f = c.CSSPropTween;
            c._registerComplexSpecialProp("bezier", {parser: function (a, c, g, h, i, j) {
                c instanceof Array && (c = {values: c}), j = new p;
                var o, q, r, k = c.values, l = k.length - 1, m = [], n = {};
                if (0 > l)return i;
                for (o = 0; l >= o; o++)r = d(a, k[o], h, i, j, l !== o), m[o] = r.end;
                for (q in c)n[q] = c[q];
                return n.values = m, i = new f(a, "bezier", 0, 0, r.pt, 2), i.data = r, i.plugin = j, i.setRatio = e, 0 === n.autoRotate && (n.autoRotate = !0), !n.autoRotate || n.autoRotate instanceof Array || (o = n.autoRotate === !0 ? 0 : Number(n.autoRotate) * b, n.autoRotate = null != r.end.left ? [
                    ["left", "top", "rotation", o, !0]
                ] : null != r.end.x ? [
                    ["x", "y", "rotation", o, !0]
                ] : !1), n.autoRotate && (h._transform || h._enableTransforms(!1), r.autoRotate = h._target._gsTransform), j._onInitTween(r.proxy, n, h._tween), i
            }})
        }
    }, q._roundProps = function (a, b) {
        for (var c = this._overwriteProps, d = c.length; --d > -1;)(a[c[d]] || a.bezier || a.bezierThrough) && (this._round[c[d]] = b)
    }, q._kill = function (a) {
        var c, d, b = this._props;
        for (c in this._beziers)if (c in a)for (delete this._beziers[c], delete this._func[c], d = b.length; --d > -1;)b[d] === c && b.splice(d, 1);
        return this._super._kill.call(this, a)
    }
}), window._gsDefine && window._gsQueue.pop()();
/*!
 * VERSION: beta 1.9.2
 * DATE: 2013-03-25
 * JavaScript (ActionScript 3 and 2 also available)
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, easing.EasePack, plugins.CSSPlugin, plugins.RoundPropsPlugin, plugins.BezierPlugin
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue || (window._gsQueue = [])).push(function () {
    "use strict";
    window._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (a, b, c) {
        var d = function (a, b, d) {
            c.call(this, a, b, d), this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._dirty = !0
        }, e = function (a) {
            return a.jquery || "function" == typeof a.each && a[0] && a[0].nodeType && a[0].style
        }, f = function (a) {
            var b = [];
            return a.each(function () {
                b.push(this)
            }), b
        }, g = d.prototype = c.to({}, .1, {}), h = [];
        d.version = "1.9.2", g.constructor = d, g.kill()._gc = !1, d.killTweensOf = d.killDelayedCallsTo = c.killTweensOf, d.getTweensOf = c.getTweensOf, d.ticker = c.ticker, g.invalidate = function () {
            return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), c.prototype.invalidate.call(this)
        }, g.updateTo = function (a, b) {
            var e, d = this.ratio;
            b && this.timeline && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
            for (e in a)this.vars[e] = a[e];
            if (this._initted)if (b)this._initted = !1; else if (this._notifyPluginsOfEnabled && this._firstPT && c._onPluginEvent("_onDisable", this), this._time / this._duration > .998) {
                var f = this._time;
                this.render(0, !0, !1), this._initted = !1, this.render(f, !0, !1)
            } else if (this._time > 0) {
                this._initted = !1, this._init();
                for (var i, g = 1 / (1 - d), h = this._firstPT; h;)i = h.s + h.c, h.c *= g, h.s = i - h.c, h = h._next
            }
            return this
        }, g.render = function (a, b, c) {
            var i, j, k, l, m, n, o, d = this._dirty ? this.totalDuration() : this._totalDuration, e = this._time, f = this._totalTime, g = this._cycle;
            if (a >= d ? (this._totalTime = d, this._cycle = this._repeat, this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = this._duration, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (i = !0, j = "onComplete"), 0 === this._duration && ((0 === a || 0 > this._rawPrevTime) && this._rawPrevTime !== a && (c = !0), this._rawPrevTime = a)) : 1e-7 > a ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== f || 0 === this._duration && this._rawPrevTime > 0) && (j = "onReverseComplete", i = this._reversed), 0 > a ? (this._active = !1, 0 === this._duration && (this._rawPrevTime >= 0 && (c = !0), this._rawPrevTime = a)) : this._initted || (c = !0)) : (this._totalTime = this._time = a, 0 !== this._repeat && (l = this._duration + this._repeatDelay, this._cycle = this._totalTime / l >> 0, 0 !== this._cycle && this._cycle === this._totalTime / l && this._cycle--, this._time = this._totalTime - this._cycle * l, this._yoyo && 0 !== (1 & this._cycle) && (this._time = this._duration - this._time), this._time > this._duration ? this._time = this._duration : 0 > this._time && (this._time = 0)), this._easeType ? (m = this._time / this._duration, n = this._easeType, o = this._easePower, (1 === n || 3 === n && m >= .5) && (m = 1 - m), 3 === n && (m *= 2), 1 === o ? m *= m : 2 === o ? m *= m * m : 3 === o ? m *= m * m * m : 4 === o && (m *= m * m * m * m), this.ratio = 1 === n ? 1 - m : 2 === n ? m : .5 > this._time / this._duration ? m / 2 : 1 - m / 2) : this.ratio = this._ease.getRatio(this._time / this._duration)), e === this._time && !c)return f !== this._totalTime && this._onUpdate && (b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || h)), void 0;
            if (!this._initted) {
                if (this._init(), !this._initted)return;
                this._time && !i ? this.ratio = this._ease.getRatio(this._time / this._duration) : i && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
            }
            for (this._active || this._paused || (this._active = !0), 0 === f && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : j || (j = "_dummyGS")), this.vars.onStart && (0 !== this._totalTime || 0 === this._duration) && (b || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || h))), k = this._firstPT; k;)k.f ? k.t[k.p](k.c * this.ratio + k.s) : k.t[k.p] = k.c * this.ratio + k.s, k = k._next;
            this._onUpdate && (0 > a && this._startAt && this._startAt.render(a, b, c), b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || h)), this._cycle !== g && (b || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || h)), j && (this._gc || (0 > a && this._startAt && !this._onUpdate && this._startAt.render(a, b, c), i && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[j] && this.vars[j].apply(this.vars[j + "Scope"] || this, this.vars[j + "Params"] || h)))
        }, d.to = function (a, b, c) {
            return new d(a, b, c)
        }, d.from = function (a, b, c) {
            return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, new d(a, b, c)
        }, d.fromTo = function (a, b, c, e) {
            return e.startAt = c, e.immediateRender = 0 != e.immediateRender && 0 != c.immediateRender, new d(a, b, e)
        }, d.staggerTo = d.allTo = function (a, b, g, i, j, k, l) {
            i = i || 0;
            var p, q, r, s, m = g.delay || 0, n = [], o = function () {
                g.onComplete && g.onComplete.apply(g.onCompleteScope || this, g.onCompleteParams || h), j.apply(l || this, k || h)
            };
            for (a instanceof Array || ("string" == typeof a && (a = c.selector(a) || a), e(a) && (a = f(a))), p = a.length, r = 0; p > r; r++) {
                q = {};
                for (s in g)q[s] = g[s];
                q.delay = m, r === p - 1 && j && (q.onComplete = o), n[r] = new d(a[r], b, q), m += i
            }
            return n
        }, d.staggerFrom = d.allFrom = function (a, b, c, e, f, g, h) {
            return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, d.staggerTo(a, b, c, e, f, g, h)
        }, d.staggerFromTo = d.allFromTo = function (a, b, c, e, f, g, h, i) {
            return e.startAt = c, e.immediateRender = 0 != e.immediateRender && 0 != c.immediateRender, d.staggerTo(a, b, e, f, g, h, i)
        }, d.delayedCall = function (a, b, c, e, f) {
            return new d(b, 0, {delay: a, onComplete: b, onCompleteParams: c, onCompleteScope: e, onReverseComplete: b, onReverseCompleteParams: c, onReverseCompleteScope: e, immediateRender: !1, useFrames: f, overwrite: 0})
        }, d.set = function (a, b) {
            return new d(a, 0, b)
        }, d.isTweening = function (a) {
            for (var e, b = c.getTweensOf(a), d = b.length; --d > -1;)if (e = b[d], e._active || e._startTime === e._timeline._time && e._timeline._active)return!0;
            return!1
        };
        var i = function (a, b) {
            for (var d = [], e = 0, f = a._first; f;)f instanceof c ? d[e++] = f : (b && (d[e++] = f), d = d.concat(i(f, b)), e = d.length), f = f._next;
            return d
        }, j = d.getAllTweens = function (b) {
            return i(a._rootTimeline, b).concat(i(a._rootFramesTimeline, b))
        };
        d.killAll = function (a, c, d, e) {
            null == c && (c = !0), null == d && (d = !0);
            var i, k, l, f = j(0 != e), g = f.length, h = c && d && e;
            for (l = 0; g > l; l++)k = f[l], (h || k instanceof b || (i = k.target === k.vars.onComplete) && d || c && !i) && (a ? k.totalTime(k.totalDuration()) : k._enabled(!1, !1))
        }, d.killChildTweensOf = function (a, b) {
            if (null != a) {
                var h, i, j, k, l, g = c._tweenLookup;
                if ("string" == typeof a && (a = c.selector(a) || a), e(a) && (a = f(a)), a instanceof Array)for (k = a.length; --k > -1;)d.killChildTweensOf(a[k], b); else {
                    h = [];
                    for (j in g)for (i = g[j].target.parentNode; i;)i === a && (h = h.concat(g[j].tweens)), i = i.parentNode;
                    for (l = h.length, k = 0; l > k; k++)b && h[k].totalTime(h[k].totalDuration()), h[k]._enabled(!1, !1)
                }
            }
        };
        var k = function (a, c, d, e) {
            void 0 === c && (c = !0), void 0 === d && (d = !0);
            for (var i, k, f = j(e), g = c && d && e, h = f.length; --h > -1;)k = f[h], (g || k instanceof b || (i = k.target === k.vars.onComplete) && d || c && !i) && k.paused(a)
        };
        return d.pauseAll = function (a, b, c) {
            k(!0, a, b, c)
        }, d.resumeAll = function (a, b, c) {
            k(!1, a, b, c)
        }, g.progress = function (a) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration()
        }, g.totalProgress = function (a) {
            return arguments.length ? this.totalTime(this.totalDuration() * a, !1) : this._totalTime / this.totalDuration()
        }, g.time = function (a, b) {
            return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(a, b)) : this._time
        }, g.duration = function (b) {
            return arguments.length ? a.prototype.duration.call(this, b) : this._duration
        }, g.totalDuration = function (a) {
            return arguments.length ? -1 === this._repeat ? this : this.duration((a - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
        }, g.repeat = function (a) {
            return arguments.length ? (this._repeat = a, this._uncache(!0)) : this._repeat
        }, g.repeatDelay = function (a) {
            return arguments.length ? (this._repeatDelay = a, this._uncache(!0)) : this._repeatDelay
        }, g.yoyo = function (a) {
            return arguments.length ? (this._yoyo = a, this) : this._yoyo
        }, d
    }, !0), window._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (a, b, c) {
        var d = function (a) {
            b.call(this, a), this._labels = {}, this.autoRemoveChildren = this.vars.autoRemoveChildren === !0, this.smoothChildTiming = this.vars.smoothChildTiming === !0, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
            for (var f, g, c = this.vars, d = e.length; --d > -1;)if (g = c[e[d]])for (f = g.length; --f > -1;)"{self}" === g[f] && (g = c[e[d]] = g.concat(), g[f] = this);
            c.tweens instanceof Array && this.add(c.tweens, 0, c.align, c.stagger)
        }, e = ["onStartParams", "onUpdateParams", "onCompleteParams", "onReverseCompleteParams", "onRepeatParams"], f = [], g = function (a) {
            var c, b = {};
            for (c in a)b[c] = a[c];
            return b
        }, h = d.prototype = new b;
        return d.version = "1.9.2", h.constructor = d, h.kill()._gc = !1, h.to = function (a, b, d, e) {
            return this.add(new c(a, b, d), e)
        }, h.from = function (a, b, d, e) {
            return this.add(c.from(a, b, d), e)
        }, h.fromTo = function (a, b, d, e, f) {
            return this.add(c.fromTo(a, b, d, e), f)
        }, h.staggerTo = function (a, b, e, f, h, i, j, k) {
            var m, n, l = new d({onComplete: i, onCompleteParams: j, onCompleteScope: k});
            for ("string" == typeof a && (a = c.selector(a) || a), !(a instanceof Array) && "function" == typeof a.each && a[0] && a[0].nodeType && a[0].style && (n = [], a.each(function () {
                n.push(this)
            }), a = n), f = f || 0, m = 0; a.length > m; m++)e.startAt && (e.startAt = g(e.startAt)), l.add(new c(a[m], b, g(e)), m * f);
            return this.add(l, h)
        }, h.staggerFrom = function (a, b, c, d, e, f, g, h) {
            return c.immediateRender = 0 != c.immediateRender, c.runBackwards = !0, this.staggerTo(a, b, c, d, e, f, g, h)
        }, h.staggerFromTo = function (a, b, c, d, e, f, g, h, i) {
            return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, this.staggerTo(a, b, d, e, f, g, h, i)
        }, h.call = function (a, b, d, e) {
            return this.add(c.delayedCall(0, a, b, d), e)
        }, h.set = function (a, b, d) {
            return d = this._parseTimeOrLabel(d, 0, !0), null == b.immediateRender && (b.immediateRender = d === this._time && !this._paused), this.add(new c(a, 0, b), d)
        }, d.exportRoot = function (a, b) {
            a = a || {}, null == a.smoothChildTiming && (a.smoothChildTiming = !0);
            var g, h, e = new d(a), f = e._timeline;
            for (null == b && (b = !0), f._remove(e, !0), e._startTime = 0, e._rawPrevTime = e._time = e._totalTime = f._time, g = f._first; g;)h = g._next, b && g instanceof c && g.target === g.vars.onComplete || e.add(g, g._startTime - g._delay), g = h;
            return f.add(e, 0), e
        }, h.add = function (e, f, g, h) {
            var i, j, k, l, m;
            if ("number" != typeof f && (f = this._parseTimeOrLabel(f, 0, !0, e)), !(e instanceof a)) {
                if (e instanceof Array) {
                    for (g = g || "normal", h = h || 0, i = f, j = e.length, k = 0; j > k; k++)(l = e[k])instanceof Array && (l = new d({tweens: l})), this.add(l, i), "string" != typeof l && "function" != typeof l && ("sequence" === g ? i = l._startTime + l.totalDuration() / l._timeScale : "start" === g && (l._startTime -= l.delay())), i += h;
                    return this._uncache(!0)
                }
                if ("string" == typeof e)return this.addLabel(e, f);
                if ("function" != typeof e)throw"Cannot add " + e + " into the timeline: it is neither a tween, timeline, function, nor a string.";
                e = c.delayedCall(0, e)
            }
            if (b.prototype.add.call(this, e, f), this._gc && !this._paused && this._time === this._duration && this._time < this.duration())for (m = this; m._gc && m._timeline;)m._timeline.smoothChildTiming ? m.totalTime(m._totalTime, !0) : m._enabled(!0, !1), m = m._timeline;
            return this
        }, h.remove = function (b) {
            if (b instanceof a)return this._remove(b, !1);
            if (b instanceof Array) {
                for (var c = b.length; --c > -1;)this.remove(b[c]);
                return this
            }
            return"string" == typeof b ? this.removeLabel(b) : this.kill(null, b)
        }, h.append = function (a, b) {
            return this.add(a, this._parseTimeOrLabel(null, b, !0, a))
        }, h.insert = h.insertMultiple = function (a, b, c, d) {
            return this.add(a, b || 0, c, d)
        }, h.appendMultiple = function (a, b, c, d) {
            return this.add(a, this._parseTimeOrLabel(null, b, !0, a), c, d)
        }, h.addLabel = function (a, b) {
            return this._labels[a] = this._parseTimeOrLabel(b), this
        }, h.removeLabel = function (a) {
            return delete this._labels[a], this
        }, h.getLabelTime = function (a) {
            return null != this._labels[a] ? this._labels[a] : -1
        }, h._parseTimeOrLabel = function (b, c, d, e) {
            var f;
            if (e instanceof a && e.timeline === this)this.remove(e); else if (e instanceof Array)for (f = e.length; --f > -1;)e[f]instanceof a && e[f].timeline === this && this.remove(e[f]);
            if ("string" == typeof c)return this._parseTimeOrLabel(c, d && "number" == typeof b && null == this._labels[c] ? b - this.duration() : 0, d);
            if (c = c || 0, "string" != typeof b || !isNaN(b) && null == this._labels[b])null == b && (b = this.duration()); else {
                if (f = b.indexOf("="), -1 === f)return null == this._labels[b] ? d ? this._labels[b] = this.duration() + c : c : this._labels[b] + c;
                c = parseInt(b.charAt(f - 1) + "1", 10) * Number(b.substr(f + 1)), b = f > 1 ? this._parseTimeOrLabel(b.substr(0, f - 1), 0, d) : this.duration()
            }
            return Number(b) + c
        }, h.seek = function (a, b) {
            return this.totalTime("number" == typeof a ? a : this._parseTimeOrLabel(a), b !== !1)
        }, h.stop = function () {
            return this.paused(!0)
        }, h.gotoAndPlay = function (a, b) {
            return this.play(a, b)
        }, h.gotoAndStop = function (a, b) {
            return this.pause(a, b)
        }, h.render = function (a, b, c) {
            this._gc && this._enabled(!0, !1), this._active = !this._paused;
            var j, k, l, m, n, d = this._dirty ? this.totalDuration() : this._totalDuration, e = this._time, g = this._startTime, h = this._timeScale, i = this._paused;
            if (a >= d ? (this._totalTime = this._time = d, this._reversed || this._hasPausedChild() || (k = !0, m = "onComplete", 0 === this._duration && (0 === a || 0 > this._rawPrevTime) && this._rawPrevTime !== a && (n = !0)), this._rawPrevTime = a, a = d + 1e-6) : 1e-7 > a ? (this._totalTime = this._time = 0, (0 !== e || 0 === this._duration && this._rawPrevTime > 0) && (m = "onReverseComplete", k = this._reversed), 0 > a ? (this._active = !1, 0 === this._duration && this._rawPrevTime >= 0 && (n = !0)) : this._initted || (n = !0), this._rawPrevTime = a) : this._totalTime = this._time = this._rawPrevTime = a, this._time !== e || c || n) {
                if (this._initted || (this._initted = !0), 0 === e && this.vars.onStart && 0 !== this._time && (b || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || f)), this._time >= e)for (j = this._first; j && (l = j._next, !this._paused || i);)(j._active || j._startTime <= this._time && !j._paused && !j._gc) && (j._reversed ? j.render((j._dirty ? j.totalDuration() : j._totalDuration) - (a - j._startTime) * j._timeScale, b, c) : j.render((a - j._startTime) * j._timeScale, b, c)), j = l; else for (j = this._last; j && (l = j._prev, !this._paused || i);)(j._active || e >= j._startTime && !j._paused && !j._gc) && (j._reversed ? j.render((j._dirty ? j.totalDuration() : j._totalDuration) - (a - j._startTime) * j._timeScale, b, c) : j.render((a - j._startTime) * j._timeScale, b, c)), j = l;
                this._onUpdate && (b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || f)), m && (this._gc || (g === this._startTime || h !== this._timeScale) && (0 === this._time || d >= this.totalDuration()) && (k && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[m] && this.vars[m].apply(this.vars[m + "Scope"] || this, this.vars[m + "Params"] || f)))
            }
        }, h._hasPausedChild = function () {
            for (var a = this._first; a;) {
                if (a._paused || a instanceof d && a._hasPausedChild())return!0;
                a = a._next
            }
            return!1
        }, h.getChildren = function (a, b, d, e) {
            e = e || -9999999999;
            for (var f = [], g = this._first, h = 0; g;)e > g._startTime || (g instanceof c ? b !== !1 && (f[h++] = g) : (d !== !1 && (f[h++] = g), a !== !1 && (f = f.concat(g.getChildren(!0, b, d)), h = f.length))), g = g._next;
            return f
        }, h.getTweensOf = function (a, b) {
            for (var d = c.getTweensOf(a), e = d.length, f = [], g = 0; --e > -1;)(d[e].timeline === this || b && this._contains(d[e])) && (f[g++] = d[e]);
            return f
        }, h._contains = function (a) {
            for (var b = a.timeline; b;) {
                if (b === this)return!0;
                b = b.timeline
            }
            return!1
        }, h.shiftChildren = function (a, b, c) {
            c = c || 0;
            for (var f, d = this._first, e = this._labels; d;)d._startTime >= c && (d._startTime += a), d = d._next;
            if (b)for (f in e)e[f] >= c && (e[f] += a);
            return this._uncache(!0)
        }, h._kill = function (a, b) {
            if (!a && !b)return this._enabled(!1, !1);
            for (var c = b ? this.getTweensOf(b) : this.getChildren(!0, !0, !1), d = c.length, e = !1; --d > -1;)c[d]._kill(a, b) && (e = !0);
            return e
        }, h.clear = function (a) {
            var b = this.getChildren(!1, !0, !0), c = b.length;
            for (this._time = this._totalTime = 0; --c > -1;)b[c]._enabled(!1, !1);
            return a !== !1 && (this._labels = {}), this._uncache(!0)
        }, h.invalidate = function () {
            for (var a = this._first; a;)a.invalidate(), a = a._next;
            return this
        }, h._enabled = function (a, c) {
            if (a === this._gc)for (var d = this._first; d;)d._enabled(a, !0), d = d._next;
            return b.prototype._enabled.call(this, a, c)
        }, h.progress = function (a) {
            return arguments.length ? this.totalTime(this.duration() * a, !1) : this._time / this.duration()
        }, h.duration = function (a) {
            return arguments.length ? (0 !== this.duration() && 0 !== a && this.timeScale(this._duration / a), this) : (this._dirty && this.totalDuration(), this._duration)
        }, h.totalDuration = function (a) {
            if (!arguments.length) {
                if (this._dirty) {
                    for (var e, f, b = 0, c = this._last, d = 999999999999; c;)e = c._prev, c._dirty && c.totalDuration(), c._startTime > d && this._sortChildren && !c._paused ? this.add(c, c._startTime - c._delay) : d = c._startTime, 0 > c._startTime && !c._paused && (b -= c._startTime, this._timeline.smoothChildTiming && (this._startTime += c._startTime / this._timeScale), this.shiftChildren(-c._startTime, !1, -9999999999), d = 0), f = c._startTime + c._totalDuration / c._timeScale, f > b && (b = f), c = e;
                    this._duration = this._totalDuration = b, this._dirty = !1
                }
                return this._totalDuration
            }
            return 0 !== this.totalDuration() && 0 !== a && this.timeScale(this._totalDuration / a), this
        }, h.usesFrames = function () {
            for (var b = this._timeline; b._timeline;)b = b._timeline;
            return b === a._rootFramesTimeline
        }, h.rawTime = function () {
            return this._paused || 0 !== this._totalTime && this._totalTime !== this._totalDuration ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
        }, d
    }, !0), window._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (a, b, c) {
        var d = function (b) {
            a.call(this, b), this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._cycle = 0, this._yoyo = this.vars.yoyo === !0, this._dirty = !0
        }, e = [], f = new c(null, null, 1, 0), g = function (a) {
            for (; a;) {
                if (a._paused)return!0;
                a = a._timeline
            }
            return!1
        }, h = d.prototype = new a;
        return h.constructor = d, h.kill()._gc = !1, d.version = "1.9.2", h.invalidate = function () {
            return this._yoyo = this.vars.yoyo === !0, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), a.prototype.invalidate.call(this)
        }, h.addCallback = function (a, c, d, e) {
            return this.add(b.delayedCall(0, a, d, e), c)
        }, h.removeCallback = function (a, b) {
            if (null == b)this._kill(null, a); else for (var c = this.getTweensOf(a, !1), d = c.length, e = this._parseTimeOrLabel(b); --d > -1;)c[d]._startTime === e && c[d]._enabled(!1, !1);
            return this
        }, h.tweenTo = function (a, c) {
            c = c || {};
            var g, h, d = {ease: f, overwrite: 2, useFrames: this.usesFrames(), immediateRender: !1};
            for (g in c)d[g] = c[g];
            return d.time = this._parseTimeOrLabel(a), h = new b(this, Math.abs(Number(d.time) - this._time) / this._timeScale || .001, d), d.onStart = function () {
                h.target.paused(!0), h.vars.time !== h.target.time() && h.duration(Math.abs(h.vars.time - h.target.time()) / h.target._timeScale), c.onStart && c.onStart.apply(c.onStartScope || h, c.onStartParams || e)
            }, h
        }, h.tweenFromTo = function (a, b, c) {
            c = c || {}, c.startAt = {time: this._parseTimeOrLabel(a)};
            var d = this.tweenTo(b, c);
            return d.duration(Math.abs(d.vars.time - d.vars.startAt.time) / this._timeScale || .001)
        }, h.render = function (a, b, c) {
            this._gc && this._enabled(!0, !1), this._active = !this._paused;
            var n, o, p, q, r, s, d = this._dirty ? this.totalDuration() : this._totalDuration, f = this._duration, g = this._time, h = this._totalTime, i = this._startTime, j = this._timeScale, k = this._rawPrevTime, l = this._paused, m = this._cycle;
            if (a >= d ? (this._locked || (this._totalTime = d, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (o = !0, q = "onComplete", 0 === f && (0 === a || 0 > this._rawPrevTime) && this._rawPrevTime !== a && (r = !0)), this._rawPrevTime = a, this._yoyo && 0 !== (1 & this._cycle) ? this._time = a = 0 : (this._time = f, a = f + 1e-6)) : 1e-7 > a ? (this._locked || (this._totalTime = this._cycle = 0), this._time = 0, (0 !== g || 0 === f && this._rawPrevTime > 0 && !this._locked) && (q = "onReverseComplete", o = this._reversed), 0 > a ? (this._active = !1, 0 === f && this._rawPrevTime >= 0 && (r = !0)) : this._initted || (r = !0), this._rawPrevTime = a, a = 0) : (this._time = this._rawPrevTime = a, this._locked || (this._totalTime = a, 0 !== this._repeat && (s = f + this._repeatDelay, this._cycle = this._totalTime / s >> 0, 0 !== this._cycle && this._cycle === this._totalTime / s && this._cycle--, this._time = this._totalTime - this._cycle * s, this._yoyo && 0 !== (1 & this._cycle) && (this._time = f - this._time), this._time > f ? (this._time = f, a = f + 1e-6) : 0 > this._time ? this._time = a = 0 : a = this._time))), this._cycle !== m && !this._locked) {
                var t = this._yoyo && 0 !== (1 & m), u = t === (this._yoyo && 0 !== (1 & this._cycle)), v = this._totalTime, w = this._cycle, x = this._rawPrevTime, y = this._time;
                this._totalTime = m * f, m > this._cycle ? t = !t : this._totalTime += f, this._time = g, this._rawPrevTime = 0 === f ? k - 1e-5 : k, this._cycle = m, this._locked = !0, g = t ? 0 : f, this.render(g, b, 0 === f), b || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || e), u && (g = t ? f + 1e-6 : -1e-6, this.render(g, !0, !1)), this._time = y, this._totalTime = v, this._cycle = w, this._rawPrevTime = x, this._locked = !1
            }
            if (this._time === g && !c && !r)return h !== this._totalTime && this._onUpdate && (b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || e)), void 0;
            if (this._initted || (this._initted = !0), 0 === h && this.vars.onStart && 0 !== this._totalTime && (b || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || e)), this._time >= g)for (n = this._first; n && (p = n._next, !this._paused || l);)(n._active || n._startTime <= this._time && !n._paused && !n._gc) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (a - n._startTime) * n._timeScale, b, c) : n.render((a - n._startTime) * n._timeScale, b, c)), n = p; else for (n = this._last; n && (p = n._prev, !this._paused || l);)(n._active || g >= n._startTime && !n._paused && !n._gc) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (a - n._startTime) * n._timeScale, b, c) : n.render((a - n._startTime) * n._timeScale, b, c)), n = p;
            this._onUpdate && (b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || e)), q && (this._locked || this._gc || (i === this._startTime || j !== this._timeScale) && (0 === this._time || d >= this.totalDuration()) && (o && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[q] && this.vars[q].apply(this.vars[q + "Scope"] || this, this.vars[q + "Params"] || e)))
        }, h.getActive = function (a, b, c) {
            null == a && (a = !0), null == b && (b = !0), null == c && (c = !1);
            var i, j, d = [], e = this.getChildren(a, b, c), f = 0, h = e.length;
            for (i = 0; h > i; i++)j = e[i], j._paused || j._timeline._time >= j._startTime && j._timeline._time < j._startTime + j._totalDuration / j._timeScale && (g(j._timeline) || (d[f++] = j));
            return d
        }, h.getLabelAfter = function (a) {
            a || 0 !== a && (a = this._time);
            var d, b = this.getLabelsArray(), c = b.length;
            for (d = 0; c > d; d++)if (b[d].time > a)return b[d].name;
            return null
        }, h.getLabelBefore = function (a) {
            null == a && (a = this._time);
            for (var b = this.getLabelsArray(), c = b.length; --c > -1;)if (a > b[c].time)return b[c].name;
            return null
        }, h.getLabelsArray = function () {
            var c, a = [], b = 0;
            for (c in this._labels)a[b++] = {time: this._labels[c], name: c};
            return a.sort(function (a, b) {
                return a.time - b.time
            }), a
        }, h.progress = function (a) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - a : a) + this._cycle * (this._duration + this._repeatDelay), !1) : this._time / this.duration()
        }, h.totalProgress = function (a) {
            return arguments.length ? this.totalTime(this.totalDuration() * a, !1) : this._totalTime / this.totalDuration()
        }, h.totalDuration = function (b) {
            return arguments.length ? -1 === this._repeat ? this : this.duration((b - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (a.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
        }, h.time = function (a, b) {
            return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this._yoyo && 0 !== (1 & this._cycle) ? a = this._duration - a + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (a += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(a, b)) : this._time
        }, h.repeat = function (a) {
            return arguments.length ? (this._repeat = a, this._uncache(!0)) : this._repeat
        }, h.repeatDelay = function (a) {
            return arguments.length ? (this._repeatDelay = a, this._uncache(!0)) : this._repeatDelay
        }, h.yoyo = function (a) {
            return arguments.length ? (this._yoyo = a, this) : this._yoyo
        }, h.currentLabel = function (a) {
            return arguments.length ? this.seek(a, !0) : this.getLabelBefore(this._time + 1e-8)
        }, d
    }, !0), function () {
        var a = 180 / Math.PI, b = Math.PI / 180, c = [], d = [], e = [], f = {}, g = function (a, b, c, d) {
            this.a = a, this.b = b, this.c = c, this.d = d, this.da = d - a, this.ca = c - a, this.ba = b - a
        }, h = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,", i = function (a, b, c, d) {
            var e = {a: a}, f = {}, g = {}, h = {c: d}, i = (a + b) / 2, j = (b + c) / 2, k = (c + d) / 2, l = (i + j) / 2, m = (j + k) / 2, n = (m - l) / 8;
            return e.b = i + (a - i) / 4, f.b = l + n, e.c = f.a = (e.b + f.b) / 2, f.c = g.a = (l + m) / 2, g.b = m - n, h.b = k + (d - k) / 4, g.c = h.a = (g.b + h.b) / 2, [e, f, g, h]
        }, j = function (a, b, f, g, h) {
            var m, n, o, p, q, r, s, t, u, v, w, x, y, j = a.length - 1, k = 0, l = a[0].a;
            for (m = 0; j > m; m++)q = a[k], n = q.a, o = q.d, p = a[k + 1].d, h ? (w = c[m], x = d[m], y = .25 * (x + w) * b / (g ? .5 : e[m] || .5), r = o - (o - n) * (g ? .5 * b : y / w), s = o + (p - o) * (g ? .5 * b : y / x), t = o - (r + (s - r) * (3 * w / (w + x) + .5) / 4)) : (r = o - .5 * (o - n) * b, s = o + .5 * (p - o) * b, t = o - (r + s) / 2), r += t, s += t, q.c = u = r, q.b = 0 !== m ? l : l = q.a + .6 * (q.c - q.a), q.da = o - n, q.ca = u - n, q.ba = l - n, f ? (v = i(n, l, u, o), a.splice(k, 1, v[0], v[1], v[2], v[3]), k += 4) : k++, l = s;
            q = a[k], q.b = l, q.c = l + .4 * (q.d - l), q.da = q.d - q.a, q.ca = q.c - q.a, q.ba = l - q.a, f && (v = i(q.a, l, q.c, q.d), a.splice(k, 1, v[0], v[1], v[2], v[3]))
        }, k = function (a, b, e, f) {
            var i, j, k, l, m, n, h = [];
            if (f)for (a = [f].concat(a), j = a.length; --j > -1;)"string" == typeof(n = a[j][b]) && "=" === n.charAt(1) && (a[j][b] = f[b] + Number(n.charAt(0) + n.substr(2)));
            if (i = a.length - 2, 0 > i)return h[0] = new g(a[0][b], 0, 0, a[-1 > i ? 0 : 1][b]), h;
            for (j = 0; i > j; j++)k = a[j][b], l = a[j + 1][b], h[j] = new g(k, 0, 0, l), e && (m = a[j + 2][b], c[j] = (c[j] || 0) + (l - k) * (l - k), d[j] = (d[j] || 0) + (m - l) * (m - l));
            return h[j] = new g(a[j][b], 0, 0, a[j + 1][b]), h
        }, l = function (a, b, g, i, l, m) {
            var q, r, s, t, u, v, w, x, n = {}, o = [], p = m || a[0];
            l = "string" == typeof l ? "," + l + "," : h, null == b && (b = 1);
            for (r in a[0])o.push(r);
            if (a.length > 1) {
                for (x = a[a.length - 1], w = !0, q = o.length; --q > -1;)if (r = o[q], Math.abs(p[r] - x[r]) > .05) {
                    w = !1;
                    break
                }
                w && (a = a.concat(), m && a.unshift(m), a.push(a[1]), m = a[a.length - 3])
            }
            for (c.length = d.length = e.length = 0, q = o.length; --q > -1;)r = o[q], f[r] = -1 !== l.indexOf("," + r + ","), n[r] = k(a, r, f[r], m);
            for (q = c.length; --q > -1;)c[q] = Math.sqrt(c[q]), d[q] = Math.sqrt(d[q]);
            if (!i) {
                for (q = o.length; --q > -1;)if (f[r])for (s = n[o[q]], v = s.length - 1, t = 0; v > t; t++)u = s[t + 1].da / d[t] + s[t].da / c[t], e[t] = (e[t] || 0) + u * u;
                for (q = e.length; --q > -1;)e[q] = Math.sqrt(e[q])
            }
            for (q = o.length, t = g ? 4 : 1; --q > -1;)r = o[q], s = n[r], j(s, b, g, i, f[r]), w && (s.splice(0, t), s.splice(s.length - t, t));
            return n
        }, m = function (a, b, c) {
            b = b || "soft";
            var i, j, k, l, m, n, o, p, q, r, s, d = {}, e = "cubic" === b ? 3 : 2, f = "soft" === b, h = [];
            if (f && c && (a = [c].concat(a)), null == a || e + 1 > a.length)throw"invalid Bezier data";
            for (q in a[0])h.push(q);
            for (n = h.length; --n > -1;) {
                for (q = h[n], d[q] = m = [], r = 0, p = a.length, o = 0; p > o; o++)i = null == c ? a[o][q] : "string" == typeof(s = a[o][q]) && "=" === s.charAt(1) ? c[q] + Number(s.charAt(0) + s.substr(2)) : Number(s), f && o > 1 && p - 1 > o && (m[r++] = (i + m[r - 2]) / 2), m[r++] = i;
                for (p = r - e + 1, r = 0, o = 0; p > o; o += e)i = m[o], j = m[o + 1], k = m[o + 2], l = 2 === e ? 0 : m[o + 3], m[r++] = s = 3 === e ? new g(i, j, k, l) : new g(i, (2 * j + i) / 3, (2 * j + k) / 3, k);
                m.length = r
            }
            return d
        }, n = function (a, b, c) {
            for (var f, g, h, i, j, k, l, m, n, o, p, d = 1 / c, e = a.length; --e > -1;)for (o = a[e], h = o.a, i = o.d - h, j = o.c - h, k = o.b - h, f = g = 0, m = 1; c >= m; m++)l = d * m, n = 1 - l, f = g - (g = (l * l * i + 3 * n * (l * j + n * k)) * l), p = e * c + m - 1, b[p] = (b[p] || 0) + f * f
        }, o = function (a, b) {
            b = b >> 0 || 6;
            var j, k, l, m, c = [], d = [], e = 0, f = 0, g = b - 1, h = [], i = [];
            for (j in a)n(a[j], c, b);
            for (l = c.length, k = 0; l > k; k++)e += Math.sqrt(c[k]), m = k % b, i[m] = e, m === g && (f += e, m = k / b >> 0, h[m] = i, d[m] = f, e = 0, i = []);
            return{length: f, lengths: d, segments: h}
        }, p = window._gsDefine.plugin({propName: "bezier", priority: -1, API: 2, init: function (a, b, c) {
            this._target = a, b instanceof Array && (b = {values: b}), this._func = {}, this._round = {}, this._props = [], this._timeRes = null == b.timeResolution ? 6 : parseInt(b.timeResolution, 10);
            var h, i, j, k, n, d = b.values || [], e = {}, f = d[0], g = b.autoRotate || c.vars.orientToBezier;
            this._autoRotate = g ? g instanceof Array ? g : [
                ["x", "y", "rotation", g === !0 ? 0 : Number(g) || 0]
            ] : null;
            for (h in f)this._props.push(h);
            for (j = this._props.length; --j > -1;)h = this._props[j], this._overwriteProps.push(h), i = this._func[h] = "function" == typeof a[h], e[h] = i ? a[h.indexOf("set") || "function" != typeof a["get" + h.substr(3)] ? h : "get" + h.substr(3)]() : parseFloat(a[h]), n || e[h] !== d[0][h] && (n = e);
            if (this._beziers = "cubic" !== b.type && "quadratic" !== b.type && "soft" !== b.type ? l(d, isNaN(b.curviness) ? 1 : b.curviness, !1, "thruBasic" === b.type, b.correlate, n) : m(d, b.type, e), this._segCount = this._beziers[h].length, this._timeRes) {
                var p = o(this._beziers, this._timeRes);
                this._length = p.length, this._lengths = p.lengths, this._segments = p.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length
            }
            if (g = this._autoRotate)for (g[0]instanceof Array || (this._autoRotate = g = [g]), j = g.length; --j > -1;)for (k = 0; 3 > k; k++)h = g[j][k], this._func[h] = "function" == typeof a[h] ? a[h.indexOf("set") || "function" != typeof a["get" + h.substr(3)] ? h : "get" + h.substr(3)] : !1;
            return!0
        }, set: function (b) {
            var f, g, h, i, j, k, l, m, n, o, c = this._segCount, d = this._func, e = this._target;
            if (this._timeRes) {
                if (n = this._lengths, o = this._curSeg, b *= this._length, h = this._li, b > this._l2 && c - 1 > h) {
                    for (m = c - 1; m > h && b >= (this._l2 = n[++h]););
                    this._l1 = n[h - 1], this._li = h, this._curSeg = o = this._segments[h], this._s2 = o[this._s1 = this._si = 0]
                } else if (this._l1 > b && h > 0) {
                    for (; h > 0 && (this._l1 = n[--h]) >= b;);
                    0 === h && this._l1 > b ? this._l1 = 0 : h++, this._l2 = n[h], this._li = h, this._curSeg = o = this._segments[h], this._s1 = o[(this._si = o.length - 1) - 1] || 0, this._s2 = o[this._si]
                }
                if (f = h, b -= this._l1, h = this._si, b > this._s2 && o.length - 1 > h) {
                    for (m = o.length - 1; m > h && b >= (this._s2 = o[++h]););
                    this._s1 = o[h - 1], this._si = h
                } else if (this._s1 > b && h > 0) {
                    for (; h > 0 && (this._s1 = o[--h]) >= b;);
                    0 === h && this._s1 > b ? this._s1 = 0 : h++, this._s2 = o[h], this._si = h
                }
                k = (h + (b - this._s1) / (this._s2 - this._s1)) * this._prec
            } else f = 0 > b ? 0 : b >= 1 ? c - 1 : c * b >> 0, k = (b - f * (1 / c)) * c;
            for (g = 1 - k, h = this._props.length; --h > -1;)i = this._props[h], j = this._beziers[i][f], l = (k * k * j.da + 3 * g * (k * j.ca + g * j.ba)) * k + j.a, this._round[i] && (l = l + (l > 0 ? .5 : -.5) >> 0), d[i] ? e[i](l) : e[i] = l;
            if (this._autoRotate) {
                var q, r, s, t, u, v, w, p = this._autoRotate;
                for (h = p.length; --h > -1;)i = p[h][2], v = p[h][3] || 0, w = p[h][4] === !0 ? 1 : a, j = this._beziers[p[h][0]][f], q = this._beziers[p[h][1]][f], r = j.a + (j.b - j.a) * k, t = j.b + (j.c - j.b) * k, r += (t - r) * k, t += (j.c + (j.d - j.c) * k - t) * k, s = q.a + (q.b - q.a) * k, u = q.b + (q.c - q.b) * k, s += (u - s) * k, u += (q.c + (q.d - q.c) * k - u) * k, l = Math.atan2(u - s, t - r) * w + v, d[i] ? e[i](l) : e[i] = l
            }
        }}), q = p.prototype;
        p.bezierThrough = l, p.cubicToQuadratic = i, p._autoCSS = !0, p.quadraticToCubic = function (a, b, c) {
            return new g(a, (2 * b + a) / 3, (2 * b + c) / 3, c)
        }, p._cssRegister = function () {
            var a = window._gsDefine.globals.CSSPlugin;
            if (a) {
                var c = a._internals, d = c._parseToProxy, e = c._setPluginRatio, f = c.CSSPropTween;
                c._registerComplexSpecialProp("bezier", {parser: function (a, c, g, h, i, j) {
                    c instanceof Array && (c = {values: c}), j = new p;
                    var o, q, r, k = c.values, l = k.length - 1, m = [], n = {};
                    if (0 > l)return i;
                    for (o = 0; l >= o; o++)r = d(a, k[o], h, i, j, l !== o), m[o] = r.end;
                    for (q in c)n[q] = c[q];
                    return n.values = m, i = new f(a, "bezier", 0, 0, r.pt, 2), i.data = r, i.plugin = j, i.setRatio = e, 0 === n.autoRotate && (n.autoRotate = !0), !n.autoRotate || n.autoRotate instanceof Array || (o = n.autoRotate === !0 ? 0 : Number(n.autoRotate) * b, n.autoRotate = null != r.end.left ? [
                        ["left", "top", "rotation", o, !0]
                    ] : null != r.end.x ? [
                        ["x", "y", "rotation", o, !0]
                    ] : !1), n.autoRotate && (h._transform || h._enableTransforms(!1), r.autoRotate = h._target._gsTransform), j._onInitTween(r.proxy, n, h._tween), i
                }})
            }
        }, q._roundProps = function (a, b) {
            for (var c = this._overwriteProps, d = c.length; --d > -1;)(a[c[d]] || a.bezier || a.bezierThrough) && (this._round[c[d]] = b)
        }, q._kill = function (a) {
            var c, d, b = this._props;
            for (c in this._beziers)if (c in a)for (delete this._beziers[c], delete this._func[c], d = b.length; --d > -1;)b[d] === c && b.splice(d, 1);
            return this._super._kill.call(this, a)
        }
    }(), window._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (a, b) {
        var d, e, f, g, c = function () {
            a.call(this, "css"), this._overwriteProps.length = 0
        }, h = {}, i = c.prototype = new a("css");
        i.constructor = c, c.version = "1.9.2", c.API = 2, c.defaultTransformPerspective = 0, i = "px", c.suffixMap = {top: i, right: i, bottom: i, left: i, width: i, height: i, fontSize: i, padding: i, margin: i, perspective: i};
        var H, I, J, K, L, M, j = /(?:\d|\-\d|\.\d|\-\.\d)+/g, k = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g, l = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, m = /[^\d\-\.]/g, n = /(?:\d|\-|\+|=|#|\.)*/g, o = /opacity *= *([^)]*)/, p = /opacity:([^;]*)/, q = /alpha\(opacity *=.+?\)/i, r = /([A-Z])/g, s = /-([a-z])/gi, t = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, u = function (a, b) {
            return b.toUpperCase()
        }, v = /(?:Left|Right|Width)/i, w = /(M11|M12|M21|M22)=[\d\-\.e]+/gi, x = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i, y = /,(?=[^\)]*(?:\(|$))/gi, z = Math.PI / 180, A = 180 / Math.PI, B = {}, C = document, D = C.createElement("div"), E = C.createElement("img"), F = c._internals = {_specialProps: h}, G = navigator.userAgent, N = function () {
            var c, a = G.indexOf("Android"), b = C.createElement("div");
            return J = -1 !== G.indexOf("Safari") && -1 === G.indexOf("Chrome") && (-1 === a || Number(G.substr(a + 8, 1)) > 3), L = J && 6 > Number(G.substr(G.indexOf("Version/") + 8, 1)), K = -1 !== G.indexOf("Firefox"), /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(G), M = parseFloat(RegExp.$1), b.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>", c = b.getElementsByTagName("a")[0], c ? /^0.55/.test(c.style.opacity) : !1
        }(), O = function (a) {
            return o.test("string" == typeof a ? a : (a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
        }, P = function (a) {
            window.console && console.log(a)
        }, Q = "", R = "", S = function (a, b) {
            b = b || D;
            var d, e, c = b.style;
            if (void 0 !== c[a])return a;
            for (a = a.charAt(0).toUpperCase() + a.substr(1), d = ["O", "Moz", "ms", "Ms", "Webkit"], e = 5; --e > -1 && void 0 === c[d[e] + a];);
            return e >= 0 ? (R = 3 === e ? "ms" : d[e], Q = "-" + R.toLowerCase() + "-", R + a) : null
        }, T = C.defaultView ? C.defaultView.getComputedStyle : function () {
        }, U = c.getStyle = function (a, b, c, d, e) {
            var f;
            return N || "opacity" !== b ? (!d && a.style[b] ? f = a.style[b] : (c = c || T(a, null)) ? (a = c.getPropertyValue(b.replace(r, "-$1").toLowerCase()), f = a || c.length ? a : c[b]) : a.currentStyle && (c = a.currentStyle, f = c[b]), null == e || f && "none" !== f && "auto" !== f && "auto auto" !== f ? f : e) : O(a)
        }, V = function (a, b, c) {
            var f, g, d = {}, e = a._gsOverwrittenClassNamePT;
            if (e && !c) {
                for (; e;)e.setRatio(0), e = e._next;
                a._gsOverwrittenClassNamePT = null
            }
            if (b = b || T(a, null))if (f = b.length)for (; --f > -1;)d[b[f].replace(s, u)] = b.getPropertyValue(b[f]); else for (f in b)d[f] = b[f]; else if (b = a.currentStyle || a.style)for (f in b)d[f.replace(s, u)] = b[f];
            return N || (d.opacity = O(a)), g = xb(a, b, !1), d.rotation = g.rotation * A, d.skewX = g.skewX * A, d.scaleX = g.scaleX, d.scaleY = g.scaleY, d.x = g.x, d.y = g.y, wb && (d.z = g.z, d.rotationX = g.rotationX * A, d.rotationY = g.rotationY * A, d.scaleZ = g.scaleZ), d.filters && delete d.filters, d
        }, W = function (a, b, c, d) {
            var g, h, i, e = {}, f = a.style;
            for (h in c)"cssText" !== h && "length" !== h && isNaN(h) && b[h] !== (g = c[h]) && -1 === h.indexOf("Origin") && ("number" == typeof g || "string" == typeof g) && (e[h] = "" !== g && "auto" !== g && "none" !== g || "string" != typeof b[h] || "" === b[h].replace(m, "") ? g : 0, void 0 !== f[h] && (i = new kb(f, h, f[h], i)));
            if (d)for (h in d)"className" !== h && (e[h] = d[h]);
            return{difs: e, firstMPT: i}
        }, X = {width: ["Left", "Right"], height: ["Top", "Bottom"]}, Y = ["marginLeft", "marginRight", "marginTop", "marginBottom"], Z = function (a, b, c) {
            var d = parseFloat("width" === b ? a.offsetWidth : a.offsetHeight), e = X[b], f = e.length;
            for (c = c || T(a, null); --f > -1;)d -= parseFloat(U(a, "padding" + e[f], c, !0)) || 0, d -= parseFloat(U(a, "border" + e[f] + "Width", c, !0)) || 0;
            return d
        }, $ = function (a, b, c, d, e) {
            if ("px" === d || !d)return c;
            if ("auto" === d || !c)return 0;
            var j, f = v.test(b), g = a, h = D.style, i = 0 > c;
            return i && (c = -c), "%" === d && -1 !== b.indexOf("border") ? j = c / 100 * (f ? a.clientWidth : a.clientHeight) : (h.cssText = "border-style:solid; border-width:0; position:absolute; line-height:0;", "%" !== d && g.appendChild ? h[f ? "borderLeftWidth" : "borderTopWidth"] = c + d : (g = a.parentNode || C.body, h[f ? "width" : "height"] = c + d), g.appendChild(D), j = parseFloat(D[f ? "offsetWidth" : "offsetHeight"]), g.removeChild(D), 0 !== j || e || (j = $(a, b, c, d, !0))), i ? -j : j
        }, _ = function (a, b) {
            (null == a || "" === a || "auto" === a || "auto auto" === a) && (a = "0 0");
            var c = a.split(" "), d = -1 !== a.indexOf("left") ? "0%" : -1 !== a.indexOf("right") ? "100%" : c[0], e = -1 !== a.indexOf("top") ? "0%" : -1 !== a.indexOf("bottom") ? "100%" : c[1];
            return null == e ? e = "0" : "center" === e && (e = "50%"), ("center" === d || isNaN(parseFloat(d))) && (d = "50%"), b && (b.oxp = -1 !== d.indexOf("%"), b.oyp = -1 !== e.indexOf("%"), b.oxr = "=" === d.charAt(1), b.oyr = "=" === e.charAt(1), b.ox = parseFloat(d.replace(m, "")), b.oy = parseFloat(e.replace(m, ""))), d + " " + e + (c.length > 2 ? " " + c[2] : "")
        }, ab = function (a, b) {
            return"string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * parseFloat(a.substr(2)) : parseFloat(a) - parseFloat(b)
        }, bb = function (a, b) {
            return null == a ? b : "string" == typeof a && "=" === a.charAt(1) ? parseInt(a.charAt(0) + "1", 10) * Number(a.substr(2)) + b : parseFloat(a)
        }, cb = function (a, b, c, d) {
            var f, g, h, i, j, e = 1e-6;
            return null == a ? j = b : "number" == typeof a ? j = a * z : (f = 2 * Math.PI, g = a.split("_"), h = Number(g[0].replace(m, "")) * (-1 === a.indexOf("rad") ? z : 1) - ("=" === a.charAt(1) ? 0 : b), i = g[1], i && d && (d[c] = b + h), "short" === i ? (h %= f, h !== h % (f / 2) && (h = 0 > h ? h + f : h - f)) : "cw" === i && 0 > h ? h = (h + 9999999999 * f) % f - (0 | h / f) * f : "ccw" === i && h > 0 && (h = (h - 9999999999 * f) % f - (0 | h / f) * f), j = b + h), e > j && j > -e && (j = 0), j
        }, db = {aqua: [0, 255, 255], lime: [0, 255, 0], silver: [192, 192, 192], black: [0, 0, 0], maroon: [128, 0, 0], teal: [0, 128, 128], blue: [0, 0, 255], navy: [0, 0, 128], white: [255, 255, 255], fuchsia: [255, 0, 255], olive: [128, 128, 0], yellow: [255, 255, 0], orange: [255, 165, 0], gray: [128, 128, 128], purple: [128, 0, 128], green: [0, 128, 0], red: [255, 0, 0], pink: [255, 192, 203], cyan: [0, 255, 255], transparent: [255, 255, 255, 0]}, eb = function (a, b, c) {
            return a = 0 > a ? a + 1 : a > 1 ? a - 1 : a, 0 | 255 * (1 > 6 * a ? b + 6 * (c - b) * a : .5 > a ? c : 2 > 3 * a ? b + 6 * (c - b) * (2 / 3 - a) : b) + .5
        }, fb = function (a) {
            var b, c, d, e, f, g;
            return a && "" !== a ? "number" == typeof a ? [a >> 16, 255 & a >> 8, 255 & a] : ("," === a.charAt(a.length - 1) && (a = a.substr(0, a.length - 1)), db[a] ? db[a] : "#" === a.charAt(0) ? (4 === a.length && (b = a.charAt(1), c = a.charAt(2), d = a.charAt(3), a = "#" + b + b + c + c + d + d), a = parseInt(a.substr(1), 16), [a >> 16, 255 & a >> 8, 255 & a]) : "hsl" === a.substr(0, 3) ? (a = a.match(j), e = Number(a[0]) % 360 / 360, f = Number(a[1]) / 100, g = Number(a[2]) / 100, c = .5 >= g ? g * (f + 1) : g + f - g * f, b = 2 * g - c, a.length > 3 && (a[3] = Number(a[3])), a[0] = eb(e + 1 / 3, b, c), a[1] = eb(e, b, c), a[2] = eb(e - 1 / 3, b, c), a) : (a = a.match(j) || db.transparent, a[0] = Number(a[0]), a[1] = Number(a[1]), a[2] = Number(a[2]), a.length > 3 && (a[3] = Number(a[3])), a)) : db.black
        }, gb = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";
        for (i in db)gb += "|" + i + "\\b";
        gb = RegExp(gb + ")", "gi");
        var hb = function (a, b, c, d) {
            if (null == a)return function (a) {
                return a
            };
            var n, e = b ? (a.match(gb) || [""])[0] : "", f = a.split(e).join("").match(l) || [], g = a.substr(0, a.indexOf(f[0])), h = ")" === a.charAt(a.length - 1) ? ")" : "", i = -1 !== a.indexOf(" ") ? " " : ",", k = f.length, m = k > 0 ? f[0].replace(j, "") : "";
            return k ? n = b ? function (a) {
                var b, j, o, p;
                if ("number" == typeof a)a += m; else if (d && y.test(a)) {
                    for (p = a.replace(y, "|").split("|"), o = 0; p.length > o; o++)p[o] = n(p[o]);
                    return p.join(",")
                }
                if (b = (a.match(gb) || [e])[0], j = a.split(b).join("").match(l) || [], o = j.length, k > o--)for (; k > ++o;)j[o] = c ? j[(o - 1) / 2 >> 0] : f[o];
                return g + j.join(i) + i + b + h + (-1 !== a.indexOf("inset") ? " inset" : "")
            } : function (a) {
                var b, e, j;
                if ("number" == typeof a)a += m; else if (d && y.test(a)) {
                    for (e = a.replace(y, "|").split("|"), j = 0; e.length > j; j++)e[j] = n(e[j]);
                    return e.join(",")
                }
                if (b = a.match(l) || [], j = b.length, k > j--)for (; k > ++j;)b[j] = c ? b[(j - 1) / 2 >> 0] : f[j];
                return g + b.join(i) + h
            } : function (a) {
                return a
            }
        }, ib = function (a) {
            return a = a.split(","), function (b, c, d, e, f, g, h) {
                var j, i = (c + "").split(" ");
                for (h = {}, j = 0; 4 > j; j++)h[a[j]] = i[j] = i[j] || i[(j - 1) / 2 >> 0];
                return e.parse(b, h, f, g)
            }
        }, kb = (F._setPluginRatio = function (a) {
            this.plugin.setRatio(a);
            for (var f, g, h, i, b = this.data, c = b.proxy, d = b.firstMPT, e = 1e-6; d;)f = c[d.v], d.r ? f = f > 0 ? f + .5 >> 0 : f - .5 >> 0 : e > f && f > -e && (f = 0), d.t[d.p] = f, d = d._next;
            if (b.autoRotate && (b.autoRotate.rotation = c.rotation), 1 === a)for (d = b.firstMPT; d;) {
                if (g = d.t, g.type) {
                    if (1 === g.type) {
                        for (i = g.xs0 + g.s + g.xs1, h = 1; g.l > h; h++)i += g["xn" + h] + g["xs" + (h + 1)];
                        g.e = i
                    }
                } else g.e = g.s + g.xs0;
                d = d._next
            }
        }, function (a, b, c, d, e) {
            this.t = a, this.p = b, this.v = c, this.r = e, d && (d._prev = this, this._next = d)
        }), mb = (F._parseToProxy = function (a, b, c, d, e, f) {
            var l, m, n, o, p, g = d, h = {}, i = {}, j = c._transform, k = B;
            for (c._transform = null, B = b, d = p = c.parse(a, b, d, e), B = k, f && (c._transform = j, g && (g._prev = null, g._prev && (g._prev._next = null))); d && d !== g;) {
                if (1 >= d.type && (m = d.p, i[m] = d.s + d.c, h[m] = d.s, f || (o = new kb(d, "s", m, o, d.r), d.c = 0), 1 === d.type))for (l = d.l; --l > 0;)n = "xn" + l, m = d.p + "_" + n, i[m] = d.data[n], h[m] = d[n], f || (o = new kb(d, n, m, o, d.rxp[n]));
                d = d._next
            }
            return{proxy: h, end: i, firstMPT: o, pt: p}
        }, F.CSSPropTween = function (a, b, c, e, f, h, i, j, k, l, m) {
            this.t = a, this.p = b, this.s = c, this.c = e, this.n = i || "css_" + b, a instanceof mb || g.push(this.n), this.r = j, this.type = h || 0, k && (this.pr = k, d = !0), this.b = void 0 === l ? c : l, this.e = void 0 === m ? c + e : m, f && (this._next = f, f._prev = this)
        }), nb = c.parseComplex = function (a, b, c, d, e, f, g, h, i, l) {
            g = new mb(a, b, 0, 0, g, l ? 2 : 1, null, !1, h, c, d), d += "";
            var q, r, s, t, u, v, w, x, z, A, B, C, m = c.split(", ").join(",").split(" "), n = d.split(", ").join(",").split(" "), o = m.length, p = H !== !1;
            for ((-1 !== d.indexOf(",") || -1 !== c.indexOf(",")) && (m = m.join(" ").replace(y, ", ").split(" "), n = n.join(" ").replace(y, ", ").split(" "), o = m.length), o !== n.length && (m = (f || "").split(" "), o = m.length), g.plugin = i, g.setRatio = l, q = 0; o > q; q++)if (t = m[q], u = n[q], x = parseFloat(t), x || 0 === x)g.appendXtra("", x, ab(u, x), u.replace(k, ""), p && -1 !== u.indexOf("px"), !0); else if (e && ("#" === t.charAt(0) || 0 === t.indexOf("rgb") || db[t] || 0 === t.indexOf("hsl")))C = "," === u.charAt(u.length - 1) ? ")," : ")", t = fb(t), u = fb(u), z = t.length + u.length > 6, z && !N && 0 === u[3] ? (g["xs" + g.l] += g.l ? " transparent" : "transparent", g.e = g.e.split(n[q]).join("transparent")) : (N || (z = !1), g.appendXtra(z ? "rgba(" : "rgb(", t[0], u[0] - t[0], ",", !0, !0).appendXtra("", t[1], u[1] - t[1], ",", !0).appendXtra("", t[2], u[2] - t[2], z ? "," : C, !0), z && (t = 4 > t.length ? 1 : t[3], g.appendXtra("", t, (4 > u.length ? 1 : u[3]) - t, C, !1))); else if (v = t.match(j)) {
                if (w = u.match(k), !w || w.length !== v.length)return g;
                for (s = 0, r = 0; v.length > r; r++)B = v[r], A = t.indexOf(B, s), g.appendXtra(t.substr(s, A - s), Number(B), ab(w[r], B), "", p && "px" === t.substr(A + B.length, 2), 0 === r), s = A + B.length;
                g["xs" + g.l] += t.substr(s)
            } else g["xs" + g.l] += g.l ? " " + t : t;
            if (-1 !== d.indexOf("=") && g.data) {
                for (C = g.xs0 + g.data.s, q = 1; g.l > q; q++)C += g["xs" + q] + g.data["xn" + q];
                g.e = C + g["xs" + q]
            }
            return g.l || (g.type = -1, g.xs0 = g.e), g.xfirst || g
        }, ob = 9;
        for (i = mb.prototype, i.l = i.pr = 0; --ob > 0;)i["xn" + ob] = 0, i["xs" + ob] = "";
        i.xs0 = "", i._next = i._prev = i.xfirst = i.data = i.plugin = i.setRatio = i.rxp = null, i.appendXtra = function (a, b, c, d, e, f) {
            var g = this, h = g.l;
            return g["xs" + h] += f && h ? " " + a : a || "", c || 0 === h || g.plugin ? (g.l++, g.type = g.setRatio ? 2 : 1, g["xs" + g.l] = d || "", h > 0 ? (g.data["xn" + h] = b + c, g.rxp["xn" + h] = e, g["xn" + h] = b, g.plugin || (g.xfirst = new mb(g, "xn" + h, b, c, g.xfirst || g, 0, g.n, e, g.pr), g.xfirst.xs0 = 0), g) : (g.data = {s: b + c}, g.rxp = {}, g.s = b, g.c = c, g.r = e, g)) : (g["xs" + h] += b + (d || ""), g)
        };
        var pb = function (a, b) {
            b = b || {}, this.p = b.prefix ? S(a) || a : a, h[a] = h[this.p] = this, this.format = b.formatter || hb(b.defaultValue, b.color, b.collapsible, b.multi), b.parser && (this.parse = b.parser), this.clrs = b.color, this.multi = b.multi, this.keyword = b.keyword, this.dflt = b.defaultValue, this.pr = b.priority || 0
        }, qb = F._registerComplexSpecialProp = function (a, b, c) {
            "object" != typeof b && (b = {parser: c});
            var f, g, d = a.split(","), e = b.defaultValue;
            for (c = c || [e], f = 0; d.length > f; f++)b.prefix = 0 === f && b.prefix, b.defaultValue = c[f] || e, g = new pb(d[f], b)
        }, rb = function (a) {
            if (!h[a]) {
                var b = a.charAt(0).toUpperCase() + a.substr(1) + "Plugin";
                qb(a, {parser: function (a, c, d, e, f, g, i) {
                    var j = (window.GreenSockGlobals || window).com.greensock.plugins[b];
                    return j ? (j._cssRegister(), h[d].parse(a, c, d, e, f, g, i)) : (P("Error: " + b + " js file not loaded."), f)
                }})
            }
        };
        i = pb.prototype, i.parseComplex = function (a, b, c, d, e, f) {
            var h, i, j, k, l, m, g = this.keyword;
            if (this.multi && (y.test(c) || y.test(b) ? (i = b.replace(y, "|").split("|"), j = c.replace(y, "|").split("|")) : g && (i = [b], j = [c])), j) {
                for (k = j.length > i.length ? j.length : i.length, h = 0; k > h; h++)b = i[h] = i[h] || this.dflt, c = j[h] = j[h] || this.dflt, g && (l = b.indexOf(g), m = c.indexOf(g), l !== m && (c = -1 === m ? j : i, c[h] += " " + g));
                b = i.join(", "), c = j.join(", ")
            }
            return nb(a, this.p, b, c, this.clrs, this.dflt, d, this.pr, e, f)
        }, i.parse = function (a, b, c, d, e, g) {
            return this.parseComplex(a.style, this.format(U(a, this.p, f, !1, this.dflt)), this.format(b), e, g)
        }, c.registerSpecialProp = function (a, b, c) {
            qb(a, {parser: function (a, d, e, f, g, h) {
                var j = new mb(a, e, 0, 0, g, 2, e, !1, c);
                return j.plugin = h, j.setRatio = b(a, d, f._tween, e), j
            }, priority: c})
        };
        var sb = "scaleX,scaleY,scaleZ,x,y,z,skewX,rotation,rotationX,rotationY,perspective".split(","), tb = S("transform"), ub = Q + "transform", vb = S("transformOrigin"), wb = null !== S("perspective"), xb = function (a, b, d) {
            var l, m, n, o, p, q, r, s, t, u, v, x, y, e = d ? a._gsTransform || {skewY: 0} : {skewY: 0}, f = 0 > e.scaleX, g = 2e-5, h = 1e5, i = -Math.PI + 1e-4, j = Math.PI - 1e-4, k = wb ? parseFloat(U(a, vb, b, !1, "0 0 0").split(" ")[2]) || e.zOrigin || 0 : 0;
            for (tb ? l = U(a, ub, b, !0) : a.currentStyle && (l = a.currentStyle.filter.match(w), l = l && 4 === l.length ? l[0].substr(4) + "," + Number(l[2].substr(4)) + "," + Number(l[1].substr(4)) + "," + l[3].substr(4) + "," + (e ? e.x : 0) + "," + (e ? e.y : 0) : null), m = (l || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [], n = m.length; --n > -1;)o = Number(m[n]), m[n] = (p = o - (o |= 0)) ? (0 | p * h + (0 > p ? -.5 : .5)) / h + o : o;
            if (16 === m.length) {
                var z = m[8], A = m[9], B = m[10], C = m[12], D = m[13], E = m[14];
                if (e.zOrigin && (E = -e.zOrigin, C = z * E - m[12], D = A * E - m[13], E = B * E + e.zOrigin - m[14]), !d || C !== e.x || D !== e.y || E !== e.z) {
                    var Q, R, S, T, V, W, X, Y, F = m[0], G = m[1], H = m[2], I = m[3], J = m[4], K = m[5], L = m[6], M = m[7], N = m[11], O = e.rotationX = Math.atan2(L, B), P = i > O || O > j;
                    O && (V = Math.cos(-O), W = Math.sin(-O), Q = J * V + z * W, R = K * V + A * W, S = L * V + B * W, T = M * V + N * W, z = J * -W + z * V, A = K * -W + A * V, B = L * -W + B * V, N = M * -W + N * V, J = Q, K = R, L = S), O = e.rotationY = Math.atan2(z, F), O && (X = i > O || O > j, V = Math.cos(-O), W = Math.sin(-O), Q = F * V - z * W, R = G * V - A * W, S = H * V - B * W, T = I * V - N * W, A = G * W + A * V, B = H * W + B * V, N = I * W + N * V, F = Q, G = R, H = S), O = e.rotation = Math.atan2(G, K), O && (Y = i > O || O > j, V = Math.cos(-O), W = Math.sin(-O), F = F * V + J * W, R = G * V + K * W, K = G * -W + K * V, L = H * -W + L * V, G = R), Y && P ? e.rotation = e.rotationX = 0 : Y && X ? e.rotation = e.rotationY = 0 : X && P && (e.rotationY = e.rotationX = 0), e.scaleX = (Math.sqrt(F * F + G * G) * h + .5 >> 0) / h, e.scaleY = (Math.sqrt(K * K + A * A) * h + .5 >> 0) / h, e.scaleZ = (Math.sqrt(L * L + B * B) * h + .5 >> 0) / h, e.skewX = 0, e.perspective = N ? 1 / (0 > N ? -N : N) : 0, e.x = C, e.y = D, e.z = E
                }
            } else if (!wb || 0 === m.length || e.x !== m[4] || e.y !== m[5] || !e.rotationX && !e.rotationY) {
                var Z = m.length >= 6, $ = Z ? m[0] : 1, _ = m[1] || 0, ab = m[2] || 0, bb = Z ? m[3] : 1;
                e.x = m[4] || 0, e.y = m[5] || 0, q = Math.sqrt($ * $ + _ * _), r = Math.sqrt(bb * bb + ab * ab), s = $ || _ ? Math.atan2(_, $) : e.rotation || 0, t = ab || bb ? Math.atan2(ab, bb) + s : e.skewX || 0, u = q - Math.abs(e.scaleX || 0), v = r - Math.abs(e.scaleY || 0), Math.abs(t) > Math.PI / 2 && Math.abs(t) < 1.5 * Math.PI && (f ? (q *= -1, t += 0 >= s ? Math.PI : -Math.PI, s += 0 >= s ? Math.PI : -Math.PI) : (r *= -1, t += 0 >= t ? Math.PI : -Math.PI)), x = (s - e.rotation) % Math.PI, y = (t - e.skewX) % Math.PI, (void 0 === e.skewX || u > g || -g > u || v > g || -g > v || x > i && j > x && 0 !== x * h >> 0 || y > i && j > y && 0 !== y * h >> 0) && (e.scaleX = q, e.scaleY = r, e.rotation = s, e.skewX = t), wb && (e.rotationX = e.rotationY = e.z = 0, e.perspective = parseFloat(c.defaultTransformPerspective) || 0, e.scaleZ = 1)
            }
            e.zOrigin = k;
            for (n in e)g > e[n] && e[n] > -g && (e[n] = 0);
            return d && (a._gsTransform = e), e
        }, yb = function (a) {
            var l, m, b = this.data, c = -b.rotation, d = c + b.skewX, e = 1e5, f = (Math.cos(c) * b.scaleX * e >> 0) / e, g = (Math.sin(c) * b.scaleX * e >> 0) / e, h = (Math.sin(d) * -b.scaleY * e >> 0) / e, i = (Math.cos(d) * b.scaleY * e >> 0) / e, j = this.t.style, k = this.t.currentStyle;
            if (k) {
                m = g, g = -h, h = -m, l = k.filter, j.filter = "";
                var v, w, p = this.t.offsetWidth, q = this.t.offsetHeight, r = "absolute" !== k.position, s = "progid:DXImageTransform.Microsoft.Matrix(M11=" + f + ", M12=" + g + ", M21=" + h + ", M22=" + i, t = b.x, u = b.y;
                if (null != b.ox && (v = (b.oxp ? .01 * p * b.ox : b.ox) - p / 2, w = (b.oyp ? .01 * q * b.oy : b.oy) - q / 2, t += v - (v * f + w * g), u += w - (v * h + w * i)), r)v = p / 2, w = q / 2, s += ", Dx=" + (v - (v * f + w * g) + t) + ", Dy=" + (w - (v * h + w * i) + u) + ")"; else {
                    var z, A, B, y = 8 > M ? 1 : -1;
                    for (v = b.ieOffsetX || 0, w = b.ieOffsetY || 0, b.ieOffsetX = Math.round((p - ((0 > f ? -f : f) * p + (0 > g ? -g : g) * q)) / 2 + t), b.ieOffsetY = Math.round((q - ((0 > i ? -i : i) * q + (0 > h ? -h : h) * p)) / 2 + u), ob = 0; 4 > ob; ob++)A = Y[ob], z = k[A], m = -1 !== z.indexOf("px") ? parseFloat(z) : $(this.t, A, parseFloat(z), z.replace(n, "")) || 0, B = m !== b[A] ? 2 > ob ? -b.ieOffsetX : -b.ieOffsetY : 2 > ob ? v - b.ieOffsetX : w - b.ieOffsetY, j[A] = (b[A] = Math.round(m - B * (0 === ob || 2 === ob ? 1 : y))) + "px";
                    s += ", sizingMethod='auto expand')"
                }
                j.filter = -1 !== l.indexOf("DXImageTransform.Microsoft.Matrix(") ? l.replace(x, s) : s + " " + l, (0 === a || 1 === a) && 1 === f && 0 === g && 0 === h && 1 === i && (r && -1 === s.indexOf("Dx=0, Dy=0") || o.test(l) && 100 !== parseFloat(RegExp.$1) || -1 === l.indexOf("gradient(") && j.removeAttribute("filter"))
            }
        }, zb = function () {
            var x, y, z, A, B, C, D, E, F, b = this.data, c = this.t.style, d = b.perspective, e = b.scaleX, f = 0, g = 0, h = 0, i = 0, j = b.scaleY, k = 0, l = 0, m = 0, n = 0, o = b.scaleZ, p = 0, q = 0, r = 0, s = d ? -1 / d : 0, t = b.rotation, u = b.zOrigin, v = ",", w = 1e5;
            K && (D = c.top ? "top" : c.bottom ? "bottom" : parseFloat(U(this.t, "top", null, !1)) ? "bottom" : "top", z = U(this.t, D, null, !1), E = parseFloat(z) || 0, F = z.substr((E + "").length) || "px", b._ffFix = !b._ffFix, c[D] = (b._ffFix ? E + .05 : E - .05) + F), (t || b.skewX) && (z = e * Math.cos(t), A = j * Math.sin(t), t -= b.skewX, f = e * -Math.sin(t), j *= Math.cos(t), e = z, i = A), t = b.rotationY, t && (x = Math.cos(t), y = Math.sin(t), z = e * x, A = i * x, B = o * -y, C = s * -y, g = e * y, k = i * y, o *= x, s *= x, e = z, i = A, m = B, q = C), t = b.rotationX, t && (x = Math.cos(t), y = Math.sin(t), z = f * x + g * y, A = j * x + k * y, B = n * x + o * y, C = r * x + s * y, g = f * -y + g * x, k = j * -y + k * x, o = n * -y + o * x, s = r * -y + s * x, f = z, j = A, n = B, r = C), u && (p -= u, h = g * p, l = k * p, p = o * p + u), h = (z = (h += b.x) - (h |= 0)) ? (0 | z * w + (0 > z ? -.5 : .5)) / w + h : h, l = (z = (l += b.y) - (l |= 0)) ? (0 | z * w + (0 > z ? -.5 : .5)) / w + l : l, p = (z = (p += b.z) - (p |= 0)) ? (0 | z * w + (0 > z ? -.5 : .5)) / w + p : p, c[tb] = "matrix3d(" + (e * w >> 0) / w + v + (i * w >> 0) / w + v + (m * w >> 0) / w + v + (q * w >> 0) / w + v + (f * w >> 0) / w + v + (j * w >> 0) / w + v + (n * w >> 0) / w + v + (r * w >> 0) / w + v + (g * w >> 0) / w + v + (k * w >> 0) / w + v + (o * w >> 0) / w + v + (s * w >> 0) / w + v + h + v + l + v + p + v + (d ? 1 + -p / d : 1) + ")"
        }, Ab = function () {
            var e, f, g, h, i, j, k, l, m, b = this.data, c = this.t, d = c.style;
            K && (e = d.top ? "top" : d.bottom ? "bottom" : parseFloat(U(c, "top", null, !1)) ? "bottom" : "top", f = U(c, e, null, !1), g = parseFloat(f) || 0, h = f.substr((g + "").length) || "px", b._ffFix = !b._ffFix, d[e] = (b._ffFix ? g + .05 : g - .05) + h), b.rotation || b.skewX ? (i = b.rotation, j = i - b.skewX, k = 1e5, l = b.scaleX * k, m = b.scaleY * k, d[tb] = "matrix(" + (Math.cos(i) * l >> 0) / k + "," + (Math.sin(i) * l >> 0) / k + "," + (Math.sin(j) * -m >> 0) / k + "," + (Math.cos(j) * m >> 0) / k + "," + b.x + "," + b.y + ")") : d[tb] = "matrix(" + b.scaleX + ",0,0," + b.scaleY + "," + b.x + "," + b.y + ")"
        };
        qb("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation", {parser: function (a, b, c, d, e, g, h) {
            if (d._transform)return e;
            var o, p, q, r, s, t, u, i = d._transform = xb(a, f, !0), j = a.style, k = 1e-6, l = sb.length, m = h, n = {};
            if ("string" == typeof m.transform && tb)q = j.cssText, j[tb] = m.transform, j.display = "block", o = xb(a, null, !1), j.cssText = q; else if ("object" == typeof m) {
                if (o = {scaleX: bb(null != m.scaleX ? m.scaleX : m.scale, i.scaleX), scaleY: bb(null != m.scaleY ? m.scaleY : m.scale, i.scaleY), scaleZ: bb(null != m.scaleZ ? m.scaleZ : m.scale, i.scaleZ), x: bb(m.x, i.x), y: bb(m.y, i.y), z: bb(m.z, i.z), perspective: bb(m.transformPerspective, i.perspective)}, u = m.directionalRotation, null != u)if ("object" == typeof u)for (q in u)m[q] = u[q]; else m.rotation = u;
                o.rotation = cb("rotation"in m ? m.rotation : "shortRotation"in m ? m.shortRotation + "_short" : "rotationZ"in m ? m.rotationZ : i.rotation * A, i.rotation, "rotation", n), wb && (o.rotationX = cb("rotationX"in m ? m.rotationX : "shortRotationX"in m ? m.shortRotationX + "_short" : i.rotationX * A || 0, i.rotationX, "rotationX", n), o.rotationY = cb("rotationY"in m ? m.rotationY : "shortRotationY"in m ? m.shortRotationY + "_short" : i.rotationY * A || 0, i.rotationY, "rotationY", n)), o.skewX = null == m.skewX ? i.skewX : cb(m.skewX, i.skewX), o.skewY = null == m.skewY ? i.skewY : cb(m.skewY, i.skewY), (p = o.skewY - i.skewY) && (o.skewX += p, o.rotation += p)
            }
            for (s = i.z || i.rotationX || i.rotationY || o.z || o.rotationX || o.rotationY || o.perspective, s || null == m.scale || (o.scaleZ = 1); --l > -1;)c = sb[l], r = o[c] - i[c], (r > k || -k > r || null != B[c]) && (t = !0, e = new mb(i, c, i[c], r, e), c in n && (e.e = n[c]), e.xs0 = 0, e.plugin = g, d._overwriteProps.push(e.n));
            return r = m.transformOrigin, (r || wb && s && i.zOrigin) && (tb ? (t = !0, r = (r || U(a, c, f, !1, "50% 50%")) + "", c = vb, e = new mb(j, c, 0, 0, e, -1, "css_transformOrigin"), e.b = j[c], e.plugin = g, wb ? (q = i.zOrigin, r = r.split(" "), i.zOrigin = (r.length > 2 ? parseFloat(r[2]) : q) || 0, e.xs0 = e.e = j[c] = r[0] + " " + (r[1] || "50%") + " 0px", e = new mb(i, "zOrigin", 0, 0, e, -1, e.n), e.b = q, e.xs0 = e.e = i.zOrigin) : e.xs0 = e.e = j[c] = r) : _(r + "", i)), t && (d._transformType = s || 3 === this._transformType ? 3 : 2), e
        }, prefix: !0}), qb("boxShadow", {defaultValue: "0px 0px 0px 0px #999", prefix: !0, color: !0, multi: !0, keyword: "inset"}), qb("borderRadius", {defaultValue: "0px", parser: function (a, b, c, d, g) {
            b = this.format(b);
            var k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, i = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"], j = a.style;
            for (s = parseFloat(a.offsetWidth), t = parseFloat(a.offsetHeight), k = b.split(" "), l = 0; i.length > l; l++)this.p.indexOf("border") && (i[l] = S(i[l])), o = n = U(a, i[l], f, !1, "0px"), -1 !== o.indexOf(" ") && (n = o.split(" "), o = n[0], n = n[1]), p = m = k[l], q = parseFloat(o), v = o.substr((q + "").length), w = "=" === p.charAt(1), w ? (r = parseInt(p.charAt(0) + "1", 10), p = p.substr(2), r *= parseFloat(p), u = p.substr((r + "").length - (0 > r ? 1 : 0)) || "") : (r = parseFloat(p), u = p.substr((r + "").length)), "" === u && (u = e[c] || v), u !== v && (x = $(a, "borderLeft", q, v), y = $(a, "borderTop", q, v), "%" === u ? (o = 100 * (x / s) + "%", n = 100 * (y / t) + "%") : "em" === u ? (z = $(a, "borderLeft", 1, "em"), o = x / z + "em", n = y / z + "em") : (o = x + "px", n = y + "px"), w && (p = parseFloat(o) + r + u, m = parseFloat(n) + r + u)), g = nb(j, i[l], o + " " + n, p + " " + m, !1, "0px", g);
            return g
        }, prefix: !0, formatter: hb("0px 0px 0px 0px", !1, !0)}), qb("backgroundPosition", {defaultValue: "0 0", parser: function (a, b, c, d, e, g) {
            var l, m, n, o, p, q, h = "background-position", i = f || T(a, null), j = this.format((i ? M ? i.getPropertyValue(h + "-x") + " " + i.getPropertyValue(h + "-y") : i.getPropertyValue(h) : a.currentStyle.backgroundPositionX + " " + a.currentStyle.backgroundPositionY) || "0 0"), k = this.format(b);
            if (-1 !== j.indexOf("%") != (-1 !== k.indexOf("%")) && (q = U(a, "backgroundImage").replace(t, ""), q && "none" !== q)) {
                for (l = j.split(" "), m = k.split(" "), E.setAttribute("src", q), n = 2; --n > -1;)j = l[n], o = -1 !== j.indexOf("%"), o !== (-1 !== m[n].indexOf("%")) && (p = 0 === n ? a.offsetWidth - E.width : a.offsetHeight - E.height, l[n] = o ? parseFloat(j) / 100 * p + "px" : 100 * (parseFloat(j) / p) + "%");
                j = l.join(" ")
            }
            return this.parseComplex(a.style, j, k, e, g)
        }, formatter: _}), qb("backgroundSize", {defaultValue: "0 0", formatter: _}), qb("perspective", {defaultValue: "0px", prefix: !0}), qb("perspectiveOrigin", {defaultValue: "50% 50%", prefix: !0}), qb("transformStyle", {prefix: !0}), qb("backfaceVisibility", {prefix: !0}), qb("margin", {parser: ib("marginTop,marginRight,marginBottom,marginLeft")}), qb("padding", {parser: ib("paddingTop,paddingRight,paddingBottom,paddingLeft")}), qb("clip", {defaultValue: "rect(0px,0px,0px,0px)", parser: function (a, b, c, d, e, g) {
            var h, i, j;
            return 9 > M ? (i = a.currentStyle, j = 8 > M ? " " : ",", h = "rect(" + i.clipTop + j + i.clipRight + j + i.clipBottom + j + i.clipLeft + ")", b = this.format(b).split(",").join(j)) : (h = this.format(U(a, this.p, f, !1, this.dflt)), b = this.format(b)), this.parseComplex(a.style, h, b, e, g)
        }}), qb("textShadow", {defaultValue: "0px 0px 0px #999", color: !0, multi: !0}), qb("autoRound,strictUnits", {parser: function (a, b, c, d, e) {
            return e
        }}), qb("border", {defaultValue: "0px solid #000", parser: function (a, b, c, d, e, g) {
            return this.parseComplex(a.style, this.format(U(a, "borderTopWidth", f, !1, "0px") + " " + U(a, "borderTopStyle", f, !1, "solid") + " " + U(a, "borderTopColor", f, !1, "#000")), this.format(b), e, g)
        }, color: !0, formatter: function (a) {
            var b = a.split(" ");
            return b[0] + " " + (b[1] || "solid") + " " + (a.match(gb) || ["#000"])[0]
        }}), qb("float,cssFloat,styleFloat", {parser: function (a, b, c, d, e) {
            var g = a.style, h = "cssFloat"in g ? "cssFloat" : "styleFloat";
            return new mb(g, h, 0, 0, e, -1, c, !1, 0, g[h], b)
        }});
        var Bb = function (a) {
            var e, b = this.t, c = b.filter, d = this.s + this.c * a >> 0;
            100 === d && (-1 === c.indexOf("atrix(") && -1 === c.indexOf("radient(") ? (b.removeAttribute("filter"), e = !U(this.data, "filter")) : (b.filter = c.replace(q, ""), e = !0)), e || (this.xn1 && (b.filter = c = c || "alpha(opacity=100)"), -1 === c.indexOf("opacity") ? b.filter += " alpha(opacity=" + d + ")" : b.filter = c.replace(o, "opacity=" + d))
        };
        qb("opacity,alpha,autoAlpha", {defaultValue: "1", parser: function (a, b, c, d, e, g) {
            var j, h = parseFloat(U(a, "opacity", f, !1, "1")), i = a.style;
            return b = parseFloat(b), "autoAlpha" === c && (j = U(a, "visibility", f), 1 === h && "hidden" === j && 0 !== b && (h = 0), e = new mb(i, "visibility", 0, 0, e, -1, null, !1, 0, 0 !== h ? "visible" : "hidden", 0 === b ? "hidden" : "visible"), e.xs0 = "visible", d._overwriteProps.push(e.n)), N ? e = new mb(i, "opacity", h, b - h, e) : (e = new mb(i, "opacity", 100 * h, 100 * (b - h), e), e.xn1 = "autoAlpha" === c ? 1 : 0, i.zoom = 1, e.type = 2, e.b = "alpha(opacity=" + e.s + ")", e.e = "alpha(opacity=" + (e.s + e.c) + ")", e.data = a, e.plugin = g, e.setRatio = Bb), e
        }});
        var Cb = function (a) {
            if (1 === a || 0 === a) {
                this.t.className = 1 === a ? this.e : this.b;
                for (var b = this.data, c = this.t.style, d = c.removeProperty ? "removeProperty" : "removeAttribute"; b;)b.v ? c[b.p] = b.v : c[d](b.p.replace(r, "-$1").toLowerCase()), b = b._next
            } else this.t.className !== this.b && (this.t.className = this.b)
        };
        qb("className", {parser: function (a, b, c, e, g, h, i) {
            var l, m, j = a.className, k = a.style.cssText;
            return g = e._classNamePT = new mb(a, c, 0, 0, g, 2), g.setRatio = Cb, g.pr = -11, d = !0, g.b = j, g.e = "=" !== b.charAt(1) ? b : "+" === b.charAt(0) ? j + " " + b.substr(2) : j.split(b.substr(2)).join(""), e._tween._duration && (m = V(a, f, !0), a.className = g.e, l = W(a, m, V(a), i), a.className = j, g.data = l.firstMPT, a.style.cssText = k, g = g.xfirst = e.parse(a, l.difs, g, h)), g
        }});
        var Db = function (a) {
            if ((1 === a || 0 === a) && this.data._totalTime === this.data._totalDuration)for (var i, b = "all" === this.e, c = this.t.style, d = b ? c.cssText.split(";") : this.e.split(","), e = c.removeProperty ? "removeProperty" : "removeAttribute", f = d.length, g = h.transform.parse; --f > -1;)i = d[f], b && (i = i.substr(0, i.indexOf(":")).split(" ").join("")), h[i] && (i = h[i].parse === g ? tb : h[i].p), i && c[e](i.replace(r, "-$1").toLowerCase())
        };
        for (qb("clearProps", {parser: function (a, b, c, e, f) {
            return f = new mb(a, c, 0, 0, f, 2), f.setRatio = Db, f.e = b, f.pr = -10, f.data = e._tween, d = !0, f
        }}), i = "bezier,throwProps,physicsProps,physics2D".split(","), ob = i.length; ob--;)rb(i[ob]);
        i = c.prototype, i._firstPT = null, i._onInitTween = function (a, b, h) {
            if (!a.nodeType)return!1;
            this._target = a, this._tween = h, this._vars = b, H = b.autoRound, d = !1, e = b.suffixMap || c.suffixMap, f = T(a, ""), g = this._overwriteProps;
            var j, k, l, m, n, o, q, r, s, i = a.style;
            if (I && "" === i.zIndex && (j = U(a, "zIndex", f), ("auto" === j || "" === j) && (i.zIndex = 0)), "string" == typeof b && (m = i.cssText, j = V(a, f), i.cssText = m + ";" + b, j = W(a, j, V(a)).difs, !N && p.test(b) && (j.opacity = parseFloat(RegExp.$1)), b = j, i.cssText = m), this._firstPT = k = this.parse(a, b, null), this._transformType) {
                for (s = 3 === this._transformType, tb ? J && (I = !0, "" === i.zIndex && (q = U(a, "zIndex", f), ("auto" === q || "" === q) && (i.zIndex = 0)), L && (i.WebkitBackfaceVisibility = this._vars.WebkitBackfaceVisibility || (s ? "visible" : "hidden"))) : i.zoom = 1, l = k; l && l._next;)l = l._next;
                r = new mb(a, "transform", 0, 0, null, 2), this._linkCSSP(r, null, l), r.setRatio = s && wb ? zb : tb ? Ab : yb, r.data = this._transform || xb(a, f, !0), g.pop()
            }
            if (d) {
                for (; k;) {
                    for (o = k._next, l = m; l && l.pr > k.pr;)l = l._next;
                    (k._prev = l ? l._prev : n) ? k._prev._next = k : m = k, (k._next = l) ? l._prev = k : n = k, k = o
                }
                this._firstPT = m
            }
            return!0
        }, i.parse = function (a, b, c, d) {
            var i, j, k, l, m, o, p, q, r, s, g = a.style;
            for (i in b)o = b[i], j = h[i], j ? c = j.parse(a, o, i, this, c, d, b) : (m = U(a, i, f) + "", r = "string" == typeof o, "color" === i || "fill" === i || "stroke" === i || -1 !== i.indexOf("Color") || r && !o.indexOf("rgb") ? (r || (o = fb(o), o = (o.length > 3 ? "rgba(" : "rgb(") + o.join(",") + ")"), c = nb(g, i, m, o, !0, "transparent", c, 0, d)) : !r || -1 === o.indexOf(" ") && -1 === o.indexOf(",") ? (k = parseFloat(m), p = k || 0 === k ? m.substr((k + "").length) : "", ("" === m || "auto" === m) && ("width" === i || "height" === i ? (k = Z(a, i, f), p = "px") : (k = "opacity" !== i ? 0 : 1, p = "")), s = r && "=" === o.charAt(1), s ? (l = parseInt(o.charAt(0) + "1", 10), o = o.substr(2), l *= parseFloat(o), q = o.replace(n, "")) : (l = parseFloat(o), q = r ? o.substr((l + "").length) || "" : ""), "" === q && (q = e[i] || p), o = l || 0 === l ? (s ? l + k : l) + q : b[i], p !== q && "" !== q && (l || 0 === l) && (k || 0 === k) && (k = $(a, i, k, p), "%" === q ? (k /= $(a, i, 100, "%") / 100, k > 100 && (k = 100), b.strictUnits !== !0 && (m = k + "%")) : "em" === q ? k /= $(a, i, 1, "em") : (l = $(a, i, l, q), q = "px"), s && (l || 0 === l) && (o = l + k + q)), s && (l += k), !k && 0 !== k || !l && 0 !== l ? o || "NaN" != o + "" && null != o ? (c = new mb(g, i, l || k || 0, 0, c, -1, "css_" + i, !1, 0, m, o), c.xs0 = "display" === i && "none" === o ? m : o) : P("invalid " + i + " tween value: " + b[i]) : (c = new mb(g, i, k, l - k, c, 0, "css_" + i, H !== !1 && ("px" === q || "zIndex" === i), 0, m, o), c.xs0 = q)) : c = nb(g, i, m, o, !0, null, c, 0, d)), d && c && !c.plugin && (c.plugin = d);
            return c
        }, i.setRatio = function (a) {
            var d, e, f, b = this._firstPT, c = 1e-6;
            if (1 !== a || this._tween._time !== this._tween._duration && 0 !== this._tween._time)if (a || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)for (; b;) {
                if (d = b.c * a + b.s, b.r ? d = d > 0 ? d + .5 >> 0 : d - .5 >> 0 : c > d && d > -c && (d = 0), b.type)if (1 === b.type)if (f = b.l, 2 === f)b.t[b.p] = b.xs0 + d + b.xs1 + b.xn1 + b.xs2; else if (3 === f)b.t[b.p] = b.xs0 + d + b.xs1 + b.xn1 + b.xs2 + b.xn2 + b.xs3; else if (4 === f)b.t[b.p] = b.xs0 + d + b.xs1 + b.xn1 + b.xs2 + b.xn2 + b.xs3 + b.xn3 + b.xs4; else if (5 === f)b.t[b.p] = b.xs0 + d + b.xs1 + b.xn1 + b.xs2 + b.xn2 + b.xs3 + b.xn3 + b.xs4 + b.xn4 + b.xs5; else {
                    for (e = b.xs0 + d + b.xs1, f = 1; b.l > f; f++)e += b["xn" + f] + b["xs" + (f + 1)];
                    b.t[b.p] = e
                } else-1 === b.type ? b.t[b.p] = b.xs0 : b.setRatio && b.setRatio(a); else b.t[b.p] = d + b.xs0;
                b = b._next
            } else for (; b;)2 !== b.type ? b.t[b.p] = b.b : b.setRatio(a), b = b._next; else for (; b;)2 !== b.type ? b.t[b.p] = b.e : b.setRatio(a), b = b._next
        }, i._enableTransforms = function (a) {
            this._transformType = a || 3 === this._transformType ? 3 : 2
        }, i._linkCSSP = function (a, b, c, d) {
            return a && (b && (b._prev = a), a._next && (a._next._prev = a._prev), c ? c._next = a : d || null !== this._firstPT || (this._firstPT = a), a._prev ? a._prev._next = a._next : this._firstPT === a && (this._firstPT = a._next), a._next = b, a._prev = c), a
        }, i._kill = function (b) {
            var e, f, g, c = b, d = !1;
            if (b.css_autoAlpha || b.css_alpha) {
                c = {};
                for (f in b)c[f] = b[f];
                c.css_opacity = 1, c.css_autoAlpha && (c.css_visibility = 1)
            }
            return b.css_className && (e = this._classNamePT) && (g = e.xfirst, g && g._prev ? this._linkCSSP(g._prev, e._next, g._prev._prev) : g === this._firstPT && (this._firstPT = null), e._next && this._linkCSSP(e._next, e._next._next, g._prev), this._target._gsOverwrittenClassNamePT = this._linkCSSP(e, this._target._gsOverwrittenClassNamePT), this._classNamePT = null, d = !0), a.prototype._kill.call(this, c) || d
        };
        var Eb = function (a, b, c) {
            var d, e, f, g;
            if (a.slice)for (e = a.length; --e > -1;)Eb(a[e], b, c); else for (d = a.childNodes, e = d.length; --e > -1;)f = d[e], g = f.type, f.style && (b.push(V(f)), c && c.push(f)), 1 !== g && 9 !== g && 11 !== g || !f.childNodes.length || Eb(f, b, c)
        };
        return c.cascadeTo = function (a, c, d) {
            var k, l, m, e = b.to(a, c, d), f = [e], g = [], h = [], i = [], j = b._internals.reservedProps;
            for (a = e._targets || e.target, Eb(a, g, i), e.render(c, !0), Eb(a, h), e.render(0, !0), e._enabled(!0), k = i.length; --k > -1;)if (l = W(i[k], g[k], h[k]), l.firstMPT) {
                l = l.difs;
                for (m in d)j[m] && (l[m] = d[m]);
                f.push(b.to(i[k], c, l))
            }
            return f
        }, a.activate([c]), c
    }, !0), function () {
        var a = window._gsDefine.plugin({propName: "roundProps", priority: -1, API: 2, init: function (a, b, c) {
            return this._tween = c, !0
        }}), b = a.prototype;
        b._onInitAllProps = function () {
            for (var f, g, h, a = this._tween, b = a.vars.roundProps instanceof Array ? a.vars.roundProps : a.vars.roundProps.split(","), c = b.length, d = {}, e = a._propLookup.roundProps; --c > -1;)d[b[c]] = 1;
            for (c = b.length; --c > -1;)for (f = b[c], g = a._firstPT; g;)h = g._next, g.pg ? g.t._roundProps(d, !0) : g.n === f && (this._add(g.t, f, g.s, g.c), h && (h._prev = g._prev), g._prev ? g._prev._next = h : a._firstPT === g && (a._firstPT = h), g._next = g._prev = null, a._propLookup[f] = e), g = h;
            return!1
        }, b._add = function (a, b, c, d) {
            this._addTween(a, b, c, c + d, b, !0), this._overwriteProps.push(b)
        }
    }(), window._gsDefine.plugin({propName: "attr", API: 2, init: function (a, b) {
        var d;
        if ("function" != typeof a.setAttribute)return!1;
        this._target = a, this._proxy = {};
        for (d in b)this._addTween(this._proxy, d, parseFloat(a.getAttribute(d)), b[d], d), this._overwriteProps.push(d);
        return!0
    }, set: function (a) {
        this._super.setRatio.call(this, a);
        for (var d, b = this._overwriteProps, c = b.length; --c > -1;)d = b[c], this._target.setAttribute(d, this._proxy[d] + "")
    }}), window._gsDefine.plugin({propName: "directionalRotation", API: 2, init: function (a, b) {
        "object" != typeof b && (b = {rotation: b}), this.finals = {};
        var e, f, g, h, i, j, k, d = b.useRadians === !0 ? 2 * Math.PI : 360;
        for (e in b)"useRadians" !== e && (j = (b[e] + "").split("_"), f = j[0], k = j[1], g = parseFloat("function" != typeof a[e] ? a[e] : a[e.indexOf("set") || "function" != typeof a["get" + e.substr(3)] ? e : "get" + e.substr(3)]()), h = this.finals[e] = "string" == typeof f && "=" === f.charAt(1) ? g + parseInt(f.charAt(0) + "1", 10) * Number(f.substr(2)) : Number(f) || 0, i = h - g, "short" === k ? (i %= d, i !== i % (d / 2) && (i = 0 > i ? i + d : i - d)) : "cw" === k && 0 > i ? i = (i + 9999999999 * d) % d - (0 | i / d) * d : "ccw" === k && i > 0 && (i = (i - 9999999999 * d) % d - (0 | i / d) * d), this._addTween(a, e, g, g + i, e), this._overwriteProps.push(e));
        return!0
    }, set: function (a) {
        var b;
        if (1 !== a)this._super.setRatio.call(this, a); else for (b = this._firstPT; b;)b.f ? b.t[b.p](this.finals[b.p]) : b.t[b.p] = this.finals[b.p], b = b._next
    }})._autoCSS = !0, window._gsDefine("easing.Back", ["easing.Ease"], function (a) {
        var n, o, b = window.GreenSockGlobals || window, c = b.com.greensock, d = 2 * Math.PI, e = Math.PI / 2, f = c._class, g = function (b, c) {
            var d = f("easing." + b, function () {
            }, !0), e = d.prototype = new a;
            return e.constructor = d, e.getRatio = c, d
        }, h = a.register || function () {
        }, i = function (a, b, c, d) {
            var g = f("easing." + a, {easeOut: new b, easeIn: new c, easeInOut: new d}, !0);
            return h(g, a), g
        }, j = function (b, c) {
            var d = f("easing." + b, function (a) {
                this._p1 = a || 0 === a ? a : 1.70158, this._p2 = 1.525 * this._p1
            }, !0), e = d.prototype = new a;
            return e.constructor = d, e.getRatio = c, e.config = function (a) {
                return new d(a)
            }, d
        }, k = i("Back", j("BackOut", function (a) {
            return(a -= 1) * a * ((this._p1 + 1) * a + this._p1) + 1
        }), j("BackIn", function (a) {
            return a * a * ((this._p1 + 1) * a - this._p1)
        }), j("BackInOut", function (a) {
            return 1 > (a *= 2) ? .5 * a * a * ((this._p2 + 1) * a - this._p2) : .5 * ((a -= 2) * a * ((this._p2 + 1) * a + this._p2) + 2)
        })), l = f("easing.SlowMo", function (a, b, c) {
            b = b || 0 === b ? b : .7, null == a ? a = .7 : a > 1 && (a = 1), this._p = 1 !== a ? b : 0, this._p1 = (1 - a) / 2, this._p2 = a, this._p3 = this._p1 + this._p2, this._calcEnd = c === !0
        }, !0), m = l.prototype = new a;
        return m.constructor = l, m.getRatio = function (a) {
            var b = a + (.5 - a) * this._p;
            return this._p1 > a ? this._calcEnd ? 1 - (a = 1 - a / this._p1) * a : b - (a = 1 - a / this._p1) * a * a * a * b : a > this._p3 ? this._calcEnd ? 1 - (a = (a - this._p3) / this._p1) * a : b + (a - b) * (a = (a - this._p3) / this._p1) * a * a * a : this._calcEnd ? 1 : b
        }, l.ease = new l(.7, .7), m.config = l.config = function (a, b, c) {
            return new l(a, b, c)
        }, n = f("easing.SteppedEase", function (a) {
            a = a || 1, this._p1 = 1 / a, this._p2 = a + 1
        }, !0), m = n.prototype = new a, m.constructor = n, m.getRatio = function (a) {
            return 0 > a ? a = 0 : a >= 1 && (a = .999999999), (this._p2 * a >> 0) * this._p1
        }, m.config = n.config = function (a) {
            return new n(a)
        }, i("Bounce", g("BounceOut", function (a) {
            return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
        }), g("BounceIn", function (a) {
            return 1 / 2.75 > (a = 1 - a) ? 1 - 7.5625 * a * a : 2 / 2.75 > a ? 1 - (7.5625 * (a -= 1.5 / 2.75) * a + .75) : 2.5 / 2.75 > a ? 1 - (7.5625 * (a -= 2.25 / 2.75) * a + .9375) : 1 - (7.5625 * (a -= 2.625 / 2.75) * a + .984375)
        }), g("BounceInOut", function (a) {
            var b = .5 > a;
            return a = b ? 1 - 2 * a : 2 * a - 1, a = 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375, b ? .5 * (1 - a) : .5 * a + .5
        })), i("Circ", g("CircOut", function (a) {
            return Math.sqrt(1 - (a -= 1) * a)
        }), g("CircIn", function (a) {
            return-(Math.sqrt(1 - a * a) - 1)
        }), g("CircInOut", function (a) {
            return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
        })), o = function (b, c, e) {
            var g = f("easing." + b, function (a, b) {
                this._p1 = a || 1, this._p2 = b || e, this._p3 = this._p2 / d * (Math.asin(1 / this._p1) || 0)
            }, !0), h = g.prototype = new a;
            return h.constructor = g, h.getRatio = c, h.config = function (a, b) {
                return new g(a, b)
            }, g
        }, i("Elastic", o("ElasticOut", function (a) {
            return this._p1 * Math.pow(2, -10 * a) * Math.sin((a - this._p3) * d / this._p2) + 1
        }, .3), o("ElasticIn", function (a) {
            return-(this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * d / this._p2))
        }, .3), o("ElasticInOut", function (a) {
            return 1 > (a *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - this._p3) * d / this._p2) : .5 * this._p1 * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - this._p3) * d / this._p2) + 1
        }, .45)), i("Expo", g("ExpoOut", function (a) {
            return 1 - Math.pow(2, -10 * a)
        }), g("ExpoIn", function (a) {
            return Math.pow(2, 10 * (a - 1)) - .001
        }), g("ExpoInOut", function (a) {
            return 1 > (a *= 2) ? .5 * Math.pow(2, 10 * (a - 1)) : .5 * (2 - Math.pow(2, -10 * (a - 1)))
        })), i("Sine", g("SineOut", function (a) {
            return Math.sin(a * e)
        }), g("SineIn", function (a) {
            return-Math.cos(a * e) + 1
        }), g("SineInOut", function (a) {
            return-.5 * (Math.cos(Math.PI * a) - 1)
        })), f("easing.EaseLookup", {find: function (b) {
            return a.map[b]
        }}, !0), h(b.SlowMo, "SlowMo", "ease,"), h(n, "SteppedEase", "ease,"), k
    }, !0)
}), function (a) {
    "use strict";
    var f, g, h, i, j, b = a.GreenSockGlobals || a, c = function (a) {
        var e, c = a.split("."), d = b;
        for (e = 0; c.length > e; e++)d[c[e]] = d = d[c[e]] || {};
        return d
    }, d = c("com.greensock"), e = function () {
    }, k = {}, l = function (d, e, f, g) {
        this.sc = k[d] ? k[d].sc : [], k[d] = this, this.gsClass = null, this.func = f;
        var h = [];
        this.check = function (i) {
            for (var n, o, p, q, j = e.length, m = j; --j > -1;)(n = k[e[j]] || new l(e[j], [])).gsClass ? (h[j] = n.gsClass, m--) : i && n.sc.push(this);
            if (0 === m && f)for (o = ("com.greensock." + d).split("."), p = o.pop(), q = c(o.join("."))[p] = this.gsClass = f.apply(f, h), g && (b[p] = q, "function" == typeof define && define.amd ? define((a.GreenSockAMDPath ? a.GreenSockAMDPath + "/" : "") + d.split(".").join("/"), [], function () {
                return q
            }) : "undefined" != typeof module && module.exports && (module.exports = q)), j = 0; this.sc.length > j; j++)this.sc[j].check()
        }, this.check(!0)
    }, m = a._gsDefine = function (a, b, c, d) {
        return new l(a, b, c, d)
    }, n = d._class = function (a, b, c) {
        return b = b || function () {
        }, m(a, [], function () {
            return b
        }, c), b
    };
    m.globals = b;
    var o = [0, 0, 1, 1], p = [], q = n("easing.Ease", function (a, b, c, d) {
        this._func = a, this._type = c || 0, this._power = d || 0, this._params = b ? o.concat(b) : o
    }, !0), r = q.map = {}, s = q.register = function (a, b, c, e) {
        for (var i, j, k, l, f = b.split(","), g = f.length, h = (c || "easeIn,easeOut,easeInOut").split(","); --g > -1;)for (j = f[g], i = e ? n("easing." + j, null, !0) : d.easing[j] || {}, k = h.length; --k > -1;)l = h[k], r[j + "." + l] = r[l + j] = i[l] = a.getRatio ? a : a[l] || new a
    };
    for (h = q.prototype, h._calcEnd = !1, h.getRatio = function (a) {
        if (this._func)return this._params[0] = a, this._func.apply(null, this._params);
        var b = this._type, c = this._power, d = 1 === b ? 1 - a : 2 === b ? a : .5 > a ? 2 * a : 2 * (1 - a);
        return 1 === c ? d *= d : 2 === c ? d *= d * d : 3 === c ? d *= d * d * d : 4 === c && (d *= d * d * d * d), 1 === b ? 1 - d : 2 === b ? d : .5 > a ? d / 2 : 1 - d / 2
    }, f = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], g = f.length; --g > -1;)h = f[g] + ",Power" + g, s(new q(null, null, 1, g), h, "easeOut", !0), s(new q(null, null, 2, g), h, "easeIn" + (0 === g ? ",easeNone" : "")), s(new q(null, null, 3, g), h, "easeInOut");
    r.linear = d.easing.Linear.easeIn, r.swing = d.easing.Quad.easeInOut;
    var t = n("events.EventDispatcher", function (a) {
        this._listeners = {}, this._eventTarget = a || this
    });
    h = t.prototype, h.addEventListener = function (a, b, c, d, e) {
        e = e || 0;
        var h, k, f = this._listeners[a], g = 0;
        for (null == f && (this._listeners[a] = f = []), k = f.length; --k > -1;)h = f[k], h.c === b && h.s === c ? f.splice(k, 1) : 0 === g && e > h.pr && (g = k + 1);
        f.splice(g, 0, {c: b, s: c, up: d, pr: e}), this !== i || j || i.wake()
    }, h.removeEventListener = function (a, b) {
        var d, c = this._listeners[a];
        if (c)for (d = c.length; --d > -1;)if (c[d].c === b)return c.splice(d, 1), void 0
    }, h.dispatchEvent = function (a) {
        var c, d, e, b = this._listeners[a];
        if (b)for (c = b.length, d = this._eventTarget; --c > -1;)e = b[c], e.up ? e.c.call(e.s || d, {type: a, target: d}) : e.c.call(e.s || d)
    };
    var u = a.requestAnimationFrame, v = a.cancelAnimationFrame, w = Date.now || function () {
        return(new Date).getTime()
    };
    for (f = ["ms", "moz", "webkit", "o"], g = f.length; --g > -1 && !u;)u = a[f[g] + "RequestAnimationFrame"], v = a[f[g] + "CancelAnimationFrame"] || a[f[g] + "CancelRequestAnimationFrame"];
    n("Ticker", function (a, b) {
        var g, h, k, l, m, c = this, d = w(), f = b !== !1 && u, n = function (a) {
            c.time = (w() - d) / 1e3, (!g || c.time >= m || a === !0) && (c.frame++, m = c.time + l, c.dispatchEvent("tick")), a !== !0 && (k = h(n))
        };
        t.call(c), this.time = this.frame = 0, this.tick = function () {
            n(!0)
        }, this.sleep = function () {
            null != k && (f && v ? v(k) : clearTimeout(k), h = e, k = null, c === i && (j = !1))
        }, this.wake = function () {
            k && c.sleep(), h = 0 === g ? e : f && u ? u : function (a) {
                return setTimeout(a, 1e3 * l)
            }, c === i && (j = !0), n()
        }, this.fps = function (a) {
            return arguments.length ? (g = a, l = 1 / (g || 60), m = this.time + l, c.wake(), void 0) : g
        }, this.useRAF = function (a) {
            return arguments.length ? (f = a, c.fps(g), void 0) : f
        }, c.fps(a), setTimeout(function () {
            f && !k && c.useRAF(!1)
        }, 1e3)
    }), h = d.Ticker.prototype = new d.events.EventDispatcher, h.constructor = d.Ticker;
    var x = n("core.Animation", function (a, b) {
        if (this.vars = b || {}, this._duration = this._totalDuration = a || 0, this._delay = Number(this.vars.delay) || 0, this._timeScale = 1, this._active = this.vars.immediateRender === !0, this.data = this.vars.data, this._reversed = this.vars.reversed === !0, K) {
            j || i.wake();
            var c = this.vars.useFrames ? J : K;
            c.add(this, c._time), this.vars.paused && this.paused(!0)
        }
    });
    i = x.ticker = new d.Ticker, h = x.prototype, h._dirty = h._gc = h._initted = h._paused = !1, h._totalTime = h._time = 0, h._rawPrevTime = -1, h._next = h._last = h._onUpdate = h._timeline = h.timeline = null, h._paused = !1, h.play = function (a, b) {
        return arguments.length && this.seek(a, b), this.reversed(!1), this.paused(!1)
    }, h.pause = function (a, b) {
        return arguments.length && this.seek(a, b), this.paused(!0)
    }, h.resume = function (a, b) {
        return arguments.length && this.seek(a, b), this.paused(!1)
    }, h.seek = function (a, b) {
        return this.totalTime(Number(a), b !== !1)
    }, h.restart = function (a, b) {
        return this.reversed(!1), this.paused(!1), this.totalTime(a ? -this._delay : 0, b !== !1)
    }, h.reverse = function (a, b) {
        return arguments.length && this.seek(a || this.totalDuration(), b), this.reversed(!0), this.paused(!1)
    }, h.render = function () {
    }, h.invalidate = function () {
        return this
    }, h._enabled = function (a, b) {
        return j || i.wake(), this._gc = !a, this._active = a && !this._paused && this._totalTime > 0 && this._totalTime < this._totalDuration, b !== !0 && (a && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !a && this.timeline && this._timeline._remove(this, !0)), !1
    }, h._kill = function () {
        return this._enabled(!1, !1)
    }, h.kill = function (a, b) {
        return this._kill(a, b), this
    }, h._uncache = function (a) {
        for (var b = a ? this : this.timeline; b;)b._dirty = !0, b = b.timeline;
        return this
    }, h.eventCallback = function (a, b, c, d) {
        if (null == a)return null;
        if ("on" === a.substr(0, 2)) {
            var f, e = this.vars;
            if (1 === arguments.length)return e[a];
            if (null == b)delete e[a]; else if (e[a] = b, e[a + "Params"] = c, e[a + "Scope"] = d, c)for (f = c.length; --f > -1;)"{self}" === c[f] && (c = e[a + "Params"] = c.concat(), c[f] = this);
            "onUpdate" === a && (this._onUpdate = b)
        }
        return this
    }, h.delay = function (a) {
        return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + a - this._delay), this._delay = a, this) : this._delay
    }, h.duration = function (a) {
        return arguments.length ? (this._duration = this._totalDuration = a, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== a && this.totalTime(this._totalTime * (a / this._duration), !0), this) : (this._dirty = !1, this._duration)
    }, h.totalDuration = function (a) {
        return this._dirty = !1, arguments.length ? this.duration(a) : this._totalDuration
    }, h.time = function (a, b) {
        return arguments.length ? (this._dirty && this.totalDuration(), a > this._duration && (a = this._duration), this.totalTime(a, b)) : this._time
    }, h.totalTime = function (a, b) {
        if (j || i.wake(), !arguments.length)return this._totalTime;
        if (this._timeline) {
            if (0 > a && (a += this.totalDuration()), this._timeline.smoothChildTiming) {
                this._dirty && this.totalDuration();
                var c = this._totalDuration, d = this._timeline;
                if (a > c && (a = c), this._startTime = (this._paused ? this._pauseTime : d._time) - (this._reversed ? c - a : a) / this._timeScale, d._dirty || this._uncache(!1), !d._active)for (; d._timeline;)d.totalTime(d._totalTime, !0), d = d._timeline
            }
            this._gc && this._enabled(!0, !1), this._totalTime !== a && this.render(a, b, !1)
        }
        return this
    }, h.startTime = function (a) {
        return arguments.length ? (a !== this._startTime && (this._startTime = a, this.timeline && this.timeline._sortChildren && this.timeline.add(this, a - this._delay)), this) : this._startTime
    }, h.timeScale = function (a) {
        if (!arguments.length)return this._timeScale;
        if (a = a || 1e-6, this._timeline && this._timeline.smoothChildTiming) {
            var b = this._pauseTime, c = b || 0 === b ? b : this._timeline.totalTime();
            this._startTime = c - (c - this._startTime) * this._timeScale / a
        }
        return this._timeScale = a, this._uncache(!1)
    }, h.reversed = function (a) {
        return arguments.length ? (a != this._reversed && (this._reversed = a, this.totalTime(this._totalTime, !0)), this) : this._reversed
    }, h.paused = function (a) {
        if (!arguments.length)return this._paused;
        if (a != this._paused && this._timeline) {
            j || a || i.wake();
            var b = this._timeline.rawTime(), c = b - this._pauseTime;
            !a && this._timeline.smoothChildTiming && (this._startTime += c, this._uncache(!1)), this._pauseTime = a ? b : null, this._paused = a, this._active = !a && this._totalTime > 0 && this._totalTime < this._totalDuration, a || 0 === c || this.render(this._time, !0, !0)
        }
        return this._gc && !a && this._enabled(!0, !1), this
    };
    var y = n("core.SimpleTimeline", function (a) {
        x.call(this, 0, a), this.autoRemoveChildren = this.smoothChildTiming = !0
    });
    h = y.prototype = new x, h.constructor = y, h.kill()._gc = !1, h._first = h._last = null, h._sortChildren = !1, h.add = function (a, b) {
        var e, f;
        if (a._startTime = Number(b || 0) + a._delay, a._paused && this !== a._timeline && (a._pauseTime = a._startTime + (this.rawTime() - a._startTime) / a._timeScale), a.timeline && a.timeline._remove(a, !0), a.timeline = a._timeline = this, a._gc && a._enabled(!0, !0), e = this._last, this._sortChildren)for (f = a._startTime; e && e._startTime > f;)e = e._prev;
        return e ? (a._next = e._next, e._next = a) : (a._next = this._first, this._first = a), a._next ? a._next._prev = a : this._last = a, a._prev = e, this._timeline && this._uncache(!0), this
    }, h.insert = h.add, h._remove = function (a, b) {
        return a.timeline === this && (b || a._enabled(!1, !0), a.timeline = null, a._prev ? a._prev._next = a._next : this._first === a && (this._first = a._next), a._next ? a._next._prev = a._prev : this._last === a && (this._last = a._prev), this._timeline && this._uncache(!0)), this
    }, h.render = function (a, b, c) {
        var e, d = this._first;
        for (this._totalTime = this._time = this._rawPrevTime = a; d;)e = d._next, (d._active || a >= d._startTime && !d._paused) && (d._reversed ? d.render((d._dirty ? d.totalDuration() : d._totalDuration) - (a - d._startTime) * d._timeScale, b, c) : d.render((a - d._startTime) * d._timeScale, b, c)), d = e
    }, h.rawTime = function () {
        return j || i.wake(), this._totalTime
    };
    var z = n("TweenLite", function (a, b, c) {
        if (x.call(this, b, c), null == a)throw"Cannot tween a null target.";
        this.target = a = "string" != typeof a ? a : z.selector(a) || a;
        var f, g, h, d = a.jquery || "function" == typeof a.each && a[0] && a[0].nodeType && a[0].style, e = this.vars.overwrite;
        if (this._overwrite = e = null == e ? I[z.defaultOverwrite] : "number" == typeof e ? e >> 0 : I[e], (d || a instanceof Array) && "number" != typeof a[0])for (this._targets = h = d && !a.slice ? B(a) : a.slice(0), this._propLookup = [], this._siblings = [], f = 0; h.length > f; f++)g = h[f], g ? "string" != typeof g ? "function" == typeof g.each && g[0] && g[0].nodeType && g[0].style ? (h.splice(f--, 1), this._targets = h = h.concat(B(g))) : (this._siblings[f] = L(g, this, !1), 1 === e && this._siblings[f].length > 1 && M(g, this, null, 1, this._siblings[f])) : (g = h[f--] = z.selector(g), "string" == typeof g && h.splice(f + 1, 1)) : h.splice(f--, 1); else this._propLookup = {}, this._siblings = L(a, this, !1), 1 === e && this._siblings.length > 1 && M(a, this, null, 1, this._siblings);
        (this.vars.immediateRender || 0 === b && 0 === this._delay && this.vars.immediateRender !== !1) && this.render(-this._delay, !1, !0)
    }, !0), A = function (a) {
        return"function" == typeof a.each && a[0] && a[0].nodeType && a[0].style
    }, B = function (a) {
        var b = [];
        return a.each(function () {
            b.push(this)
        }), b
    }, C = function (a, b) {
        var d, c = {};
        for (d in a)H[d] || d in b && "x" !== d && "y" !== d && "width" !== d && "height" !== d && "className" !== d || !(!E[d] || E[d] && E[d]._autoCSS) || (c[d] = a[d], delete a[d]);
        a.css = c
    };
    h = z.prototype = new x, h.constructor = z, h.kill()._gc = !1, h.ratio = 0, h._firstPT = h._targets = h._overwrittenProps = h._startAt = null, h._notifyPluginsOfEnabled = !1, z.version = "1.9.2", z.defaultEase = h._ease = new q(null, null, 1, 1), z.defaultOverwrite = "auto", z.ticker = i, z.autoSleep = !0, z.selector = a.$ || a.jQuery || function (b) {
        return a.$ ? (z.selector = a.$, a.$(b)) : a.document ? a.document.getElementById("#" === b.charAt(0) ? b.substr(1) : b) : b
    };
    var D = z._internals = {}, E = z._plugins = {}, F = z._tweenLookup = {}, G = 0, H = D.reservedProps = {ease: 1, delay: 1, overwrite: 1, onComplete: 1, onCompleteParams: 1, onCompleteScope: 1, useFrames: 1, runBackwards: 1, startAt: 1, onUpdate: 1, onUpdateParams: 1, onUpdateScope: 1, onStart: 1, onStartParams: 1, onStartScope: 1, onReverseComplete: 1, onReverseCompleteParams: 1, onReverseCompleteScope: 1, onRepeat: 1, onRepeatParams: 1, onRepeatScope: 1, easeParams: 1, yoyo: 1, orientToBezier: 1, immediateRender: 1, repeat: 1, repeatDelay: 1, data: 1, paused: 1, reversed: 1, autoCSS: 1}, I = {none: 0, all: 1, auto: 2, concurrent: 3, allOnStart: 4, preexisting: 5, "true": 1, "false": 0}, J = x._rootFramesTimeline = new y, K = x._rootTimeline = new y;
    K._startTime = i.time, J._startTime = i.frame, K._active = J._active = !0, x._updateRoot = function () {
        if (K.render((i.time - K._startTime) * K._timeScale, !1, !1), J.render((i.frame - J._startTime) * J._timeScale, !1, !1), !(i.frame % 120)) {
            var a, b, c;
            for (c in F) {
                for (b = F[c].tweens, a = b.length; --a > -1;)b[a]._gc && b.splice(a, 1);
                0 === b.length && delete F[c]
            }
            if (c = K._first, (!c || c._paused) && z.autoSleep && !J._first && 1 === i._listeners.tick.length) {
                for (; c && c._paused;)c = c._next;
                c || i.sleep()
            }
        }
    }, i.addEventListener("tick", x._updateRoot);
    var L = function (a, b, c) {
        var e, f, d = a._gsTweenID;
        if (F[d || (a._gsTweenID = d = "t" + G++)] || (F[d] = {target: a, tweens: []}), b && (e = F[d].tweens, e[f = e.length] = b, c))for (; --f > -1;)e[f] === b && e.splice(f, 1);
        return F[d].tweens
    }, M = function (a, b, c, d, e) {
        var f, g, h, i;
        if (1 === d || d >= 4) {
            for (i = e.length, f = 0; i > f; f++)if ((h = e[f]) !== b)h._gc || h._enabled(!1, !1) && (g = !0); else if (5 === d)break;
            return g
        }
        var n, j = b._startTime + 1e-10, k = [], l = 0, m = 0 === b._duration;
        for (f = e.length; --f > -1;)(h = e[f]) === b || h._gc || h._paused || (h._timeline !== b._timeline ? (n = n || N(b, 0, m), 0 === N(h, n, m) && (k[l++] = h)) : j >= h._startTime && h._startTime + h.totalDuration() / h._timeScale + 1e-10 > j && ((m || !h._initted) && 2e-10 >= j - h._startTime || (k[l++] = h)));
        for (f = l; --f > -1;)h = k[f], 2 === d && h._kill(c, a) && (g = !0), (2 !== d || !h._firstPT && h._initted) && h._enabled(!1, !1) && (g = !0);
        return g
    }, N = function (a, b, c) {
        for (var d = a._timeline, e = d._timeScale, f = a._startTime; d._timeline;) {
            if (f += d._startTime, e *= d._timeScale, d._paused)return-100;
            d = d._timeline
        }
        return f /= e, f > b ? f - b : c && f === b || !a._initted && 2e-10 > f - b ? 1e-10 : (f += a.totalDuration() / a._timeScale / e) > b ? 0 : f - b - 1e-10
    };
    h._init = function () {
        var e, f, g, a = this.vars, b = this._overwrittenProps, c = this._duration, d = a.ease;
        if (a.startAt) {
            if (a.startAt.overwrite = 0, a.startAt.immediateRender = !0, this._startAt = z.to(this.target, 0, a.startAt), a.immediateRender && (this._startAt = null, 0 === this._time && 0 !== c))return
        } else if (a.runBackwards && a.immediateRender && 0 !== c)if (this._startAt)this._startAt.render(-1, !0), this._startAt = null; else if (0 === this._time)return a.overwrite = a.delay = 0, a.runBackwards = !1, this._startAt = z.to(this.target, 0, a), a.overwrite = this._overwrite, a.runBackwards = !0, a.delay = this._delay, void 0;
        if (this._ease = d ? d instanceof q ? a.easeParams instanceof Array ? d.config.apply(d, a.easeParams) : d : "function" == typeof d ? new q(d, a.easeParams) : r[d] || z.defaultEase : z.defaultEase, this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)for (e = this._targets.length; --e > -1;)this._initProps(this._targets[e], this._propLookup[e] = {}, this._siblings[e], b ? b[e] : null) && (f = !0); else f = this._initProps(this.target, this._propLookup, this._siblings, b);
        if (f && z._onPluginEvent("_onInitAllProps", this), b && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), a.runBackwards)for (g = this._firstPT; g;)g.s += g.c, g.c = -g.c, g = g._next;
        this._onUpdate = a.onUpdate, this._initted = !0
    }, h._initProps = function (a, b, c, d) {
        var e, f, g, h, i, j, k;
        if (null == a)return!1;
        this.vars.css || a.style && a.nodeType && E.css && this.vars.autoCSS !== !1 && C(this.vars, a);
        for (e in this.vars) {
            if (H[e]) {
                if (("onStartParams" === e || "onUpdateParams" === e || "onCompleteParams" === e || "onReverseCompleteParams" === e || "onRepeatParams" === e) && (i = this.vars[e]))for (f = i.length; --f > -1;)"{self}" === i[f] && (i = this.vars[e] = i.concat(), i[f] = this)
            } else if (E[e] && (h = new E[e])._onInitTween(a, this.vars[e], this)) {
                for (this._firstPT = j = {_next: this._firstPT, t: h, p: "setRatio", s: 0, c: 1, f: !0, n: e, pg: !0, pr: h._priority}, f = h._overwriteProps.length; --f > -1;)b[h._overwriteProps[f]] = this._firstPT;
                (h._priority || h._onInitAllProps) && (g = !0), (h._onDisable || h._onEnable) && (this._notifyPluginsOfEnabled = !0)
            } else this._firstPT = b[e] = j = {_next: this._firstPT, t: a, p: e, f: "function" == typeof a[e], n: e, pg: !1, pr: 0}, j.s = j.f ? a[e.indexOf("set") || "function" != typeof a["get" + e.substr(3)] ? e : "get" + e.substr(3)]() : parseFloat(a[e]), k = this.vars[e], j.c = "string" == typeof k && "=" === k.charAt(1) ? parseInt(k.charAt(0) + "1", 10) * Number(k.substr(2)) : Number(k) - j.s || 0;
            j && j._next && (j._next._prev = j)
        }
        return d && this._kill(d, a) ? this._initProps(a, b, c, d) : this._overwrite > 1 && this._firstPT && c.length > 1 && M(a, this, b, this._overwrite, c) ? (this._kill(b, a), this._initProps(a, b, c, d)) : g
    }, h.render = function (a, b, c) {
        var e, f, g, d = this._time;
        if (a >= this._duration)this._totalTime = this._time = this._duration, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (e = !0, f = "onComplete"), 0 === this._duration && ((0 === a || 0 > this._rawPrevTime) && this._rawPrevTime !== a && (c = !0), this._rawPrevTime = a); else if (1e-7 > a)this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== d || 0 === this._duration && this._rawPrevTime > 0) && (f = "onReverseComplete", e = this._reversed), 0 > a ? (this._active = !1, 0 === this._duration && (this._rawPrevTime >= 0 && (c = !0), this._rawPrevTime = a)) : this._initted || (c = !0); else if (this._totalTime = this._time = a, this._easeType) {
            var h = a / this._duration, i = this._easeType, j = this._easePower;
            (1 === i || 3 === i && h >= .5) && (h = 1 - h), 3 === i && (h *= 2), 1 === j ? h *= h : 2 === j ? h *= h * h : 3 === j ? h *= h * h * h : 4 === j && (h *= h * h * h * h), this.ratio = 1 === i ? 1 - h : 2 === i ? h : .5 > a / this._duration ? h / 2 : 1 - h / 2
        } else this.ratio = this._ease.getRatio(a / this._duration);
        if (this._time !== d || c) {
            if (!this._initted) {
                if (this._init(), !this._initted)return;
                this._time && !e ? this.ratio = this._ease.getRatio(this._time / this._duration) : e && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
            }
            for (this._active || this._paused || (this._active = !0), 0 === d && (this._startAt && (a >= 0 ? this._startAt.render(a, b, c) : f || (f = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === this._duration) && (b || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || p))), g = this._firstPT; g;)g.f ? g.t[g.p](g.c * this.ratio + g.s) : g.t[g.p] = g.c * this.ratio + g.s, g = g._next;
            this._onUpdate && (0 > a && this._startAt && this._startAt.render(a, b, c), b || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || p)), f && (this._gc || (0 > a && this._startAt && !this._onUpdate && this._startAt.render(a, b, c), e && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !b && this.vars[f] && this.vars[f].apply(this.vars[f + "Scope"] || this, this.vars[f + "Params"] || p)))
        }
    }, h._kill = function (a, b) {
        if ("all" === a && (a = null), null == a && (null == b || b === this.target))return this._enabled(!1, !1);
        b = "string" != typeof b ? b || this._targets || this.target : z.selector(b) || b;
        var c, d, e, f, g, h, i, j;
        if ((b instanceof Array || A(b)) && "number" != typeof b[0])for (c = b.length; --c > -1;)this._kill(a, b[c]) && (h = !0); else {
            if (this._targets) {
                for (c = this._targets.length; --c > -1;)if (b === this._targets[c]) {
                    g = this._propLookup[c] || {}, this._overwrittenProps = this._overwrittenProps || [], d = this._overwrittenProps[c] = a ? this._overwrittenProps[c] || {} : "all";
                    break
                }
            } else {
                if (b !== this.target)return!1;
                g = this._propLookup, d = this._overwrittenProps = a ? this._overwrittenProps || {} : "all"
            }
            if (g) {
                i = a || g, j = a !== d && "all" !== d && a !== g && (null == a || a._tempKill !== !0);
                for (e in i)(f = g[e]) && (f.pg && f.t._kill(i) && (h = !0), f.pg && 0 !== f.t._overwriteProps.length || (f._prev ? f._prev._next = f._next : f === this._firstPT && (this._firstPT = f._next), f._next && (f._next._prev = f._prev), f._next = f._prev = null), delete g[e]), j && (d[e] = 1);
                this._firstPT || this._enabled(!1, !1)
            }
        }
        return h
    }, h.invalidate = function () {
        return this._notifyPluginsOfEnabled && z._onPluginEvent("_onDisable", this), this._firstPT = null, this._overwrittenProps = null, this._onUpdate = null, this._startAt = null, this._initted = this._active = this._notifyPluginsOfEnabled = !1, this._propLookup = this._targets ? {} : [], this
    }, h._enabled = function (a, b) {
        if (j || i.wake(), a && this._gc) {
            var d, c = this._targets;
            if (c)for (d = c.length; --d > -1;)this._siblings[d] = L(c[d], this, !0); else this._siblings = L(this.target, this, !0)
        }
        return x.prototype._enabled.call(this, a, b), this._notifyPluginsOfEnabled && this._firstPT ? z._onPluginEvent(a ? "_onEnable" : "_onDisable", this) : !1
    }, z.to = function (a, b, c) {
        return new z(a, b, c)
    }, z.from = function (a, b, c) {
        return c.runBackwards = !0, c.immediateRender = 0 != c.immediateRender, new z(a, b, c)
    }, z.fromTo = function (a, b, c, d) {
        return d.startAt = c, d.immediateRender = 0 != d.immediateRender && 0 != c.immediateRender, new z(a, b, d)
    }, z.delayedCall = function (a, b, c, d, e) {
        return new z(b, 0, {delay: a, onComplete: b, onCompleteParams: c, onCompleteScope: d, onReverseComplete: b, onReverseCompleteParams: c, onReverseCompleteScope: d, immediateRender: !1, useFrames: e, overwrite: 0})
    }, z.set = function (a, b) {
        return new z(a, 0, b)
    }, z.killTweensOf = z.killDelayedCallsTo = function (a, b) {
        for (var c = z.getTweensOf(a), d = c.length; --d > -1;)c[d]._kill(b, a)
    }, z.getTweensOf = function (a) {
        if (null != a) {
            a = "string" != typeof a ? a : z.selector(a) || a;
            var b, c, d, e;
            if ((a instanceof Array || A(a)) && "number" != typeof a[0]) {
                for (b = a.length, c = []; --b > -1;)c = c.concat(z.getTweensOf(a[b]));
                for (b = c.length; --b > -1;)for (e = c[b], d = b; --d > -1;)e === c[d] && c.splice(b, 1)
            } else for (c = L(a).concat(), b = c.length; --b > -1;)c[b]._gc && c.splice(b, 1);
            return c
        }
    };
    var O = n("plugins.TweenPlugin", function (a, b) {
        this._overwriteProps = (a || "").split(","), this._propName = this._overwriteProps[0], this._priority = b || 0, this._super = O.prototype
    }, !0);
    if (h = O.prototype, O.version = "1.9.1", O.API = 2, h._firstPT = null, h._addTween = function (a, b, c, d, e, f) {
        var g, h;
        null != d && (g = "number" == typeof d || "=" !== d.charAt(1) ? Number(d) - c : parseInt(d.charAt(0) + "1", 10) * Number(d.substr(2))) && (this._firstPT = h = {_next: this._firstPT, t: a, p: b, s: c, c: g, f: "function" == typeof a[b], n: e || b, r: f}, h._next && (h._next._prev = h))
    }, h.setRatio = function (a) {
        for (var d, b = this._firstPT, c = 1e-6; b;)d = b.c * a + b.s, b.r ? d = d + (d > 0 ? .5 : -.5) >> 0 : c > d && d > -c && (d = 0), b.f ? b.t[b.p](d) : b.t[b.p] = d, b = b._next
    }, h._kill = function (a) {
        var d, b = this._overwriteProps, c = this._firstPT;
        if (null != a[this._propName])this._overwriteProps = []; else for (d = b.length; --d > -1;)null != a[b[d]] && b.splice(d, 1);
        for (; c;)null != a[c.n] && (c._next && (c._next._prev = c._prev), c._prev ? (c._prev._next = c._next, c._prev = null) : this._firstPT === c && (this._firstPT = c._next)), c = c._next;
        return!1
    }, h._roundProps = function (a, b) {
        for (var c = this._firstPT; c;)(a[this._propName] || null != c.n && a[c.n.split(this._propName + "_").join("")]) && (c.r = b), c = c._next
    }, z._onPluginEvent = function (a, b) {
        var d, e, f, g, h, c = b._firstPT;
        if ("_onInitAllProps" === a) {
            for (; c;) {
                for (h = c._next, e = f; e && e.pr > c.pr;)e = e._next;
                (c._prev = e ? e._prev : g) ? c._prev._next = c : f = c, (c._next = e) ? e._prev = c : g = c, c = h
            }
            c = b._firstPT = f
        }
        for (; c;)c.pg && "function" == typeof c.t[a] && c.t[a]() && (d = !0), c = c._next;
        return d
    }, O.activate = function (a) {
        for (var b = a.length; --b > -1;)a[b].API === O.API && (E[(new a[b])._propName] = a[b]);
        return!0
    }, m.plugin = function (a) {
        if (!(a && a.propName && a.init && a.API))throw"illegal plugin definition.";
        var h, b = a.propName, c = a.priority || 0, d = a.overwriteProps, e = {init: "_onInitTween", set: "setRatio", kill: "_kill", round: "_roundProps", initAll: "_onInitAllProps"}, f = n("plugins." + b.charAt(0).toUpperCase() + b.substr(1) + "Plugin", function () {
            O.call(this, b, c), this._overwriteProps = d || []
        }, a.global === !0), g = f.prototype = new O(b);
        g.constructor = f, f.API = a.API;
        for (h in e)"function" == typeof a[h] && (g[e[h]] = a[h]);
        return f.version = a.version, O.activate([f]), f
    }, f = a._gsQueue) {
        for (g = 0; f.length > g; g++)f[g]();
        for (h in k)k[h].func || a.console.log("GSAP encountered missing dependency: com.greensock." + h)
    }
    j = !1
}(window);
!function () {
    var t, i, e = function (t, i) {
        return function () {
            return t.apply(i, arguments)
        }
    };
    t = function () {
        function t(t) {
            var i, e, o, s;
            if (this.area = t, !this.area)throw new Error("area argument is missing");
            this.position = this.area.position || "auto", "object" == typeof this.position && (null == (o = (i = this.position).x) && (i.x = "auto"), null == (s = (e = this.position).y) && (e.y = "auto"), "auto" === this.position.x && "auto" === this.position.y && (this.position = "auto")), this.attachment = this.area.attachment || "fixed", this.assertValid(), this.processActiveArea()
        }

        var i, e;
        return i = /^\d+(%|px)?$/gi, e = function (t) {
            var e;
            return i.lastIndex = 0, e = i.test(t), i.lastIndex = 0, e
        }, t.prototype.assertValid = function () {
            var t, i;
            if (t = ["The following validation errors occured:"], "object" != typeof this.position ? "auto" !== this.position && t.push("area.position is not valid (" + this.position + ")") : ("auto" === this.position.x || e(this.position.x) || t.push("area.position.x is not valid (" + this.position.x + "})"), "auto" === this.position.y || e(this.position.y) || t.push("area.position.y is not valid (" + this.position.y + "})")), "fixed" !== (i = this.attachment) && "scroll" !== i && t.push("area.attachment is not valid (" + this.attachment + ")"), e(this.area.width) || t.push("area.width is not valid (" + this.area.width + ")"), e(this.area.height) || t.push("area.height is not valid (" + this.area.height + ")"), t.length > 1)throw new Error(t.join("\n"))
        }, t.prototype.processActiveArea = function () {
            return this.width = parseInt(this.area.width, 10), this.widthIsFluid = "%" === i.exec(this.area.width)[1], i.lastIndex = 0, this.height = parseInt(this.area.height, 10), this.heightIsFluid = "%" === i.exec(this.area.height)[1], i.lastIndex = 0, "object" == typeof this.position && ("auto" !== this.position.x && (this.x = parseInt(this.position.x, 10)), "auto" !== this.position.y) ? this.y = parseInt(this.position.y, 10) : void 0
        }, t.prototype.init = function (t) {
            var i, e, o, s, n, r, a, h = this;
            if (this.frame = t, !this.frame)throw new Error("frame argument cannot be null");
            return this.xBase = (r = this.getXBaseComputation())(), this.yBase = (a = this.getYBaseComputation())(), this.xMaxComputation = this.widthIsFluid ? function () {
                return this.xMin + this.width / 100 * this.frame.width()
            } : function () {
                return this.xMin + this.width
            }, this.yMaxComputation = this.heightIsFluid ? function () {
                return this.yMin + this.height / 100 * this.frame.height()
            } : function () {
                return this.yMin + this.height
            }, "fixed" === this.attachment ? (this.xPadding = this.frame.prop("scrollLeft"), this.yPadding = this.frame.prop("scrollTop"), this.debug === !0 ? (console.log("Listen to scroll event"), s = this, o = function () {
                return console.log("Scroll : @xPadding = " + s.xPadding + ", @yPadding = " + s.yPadding)
            }) : o = function () {
            }, n = 0, $(window).scroll(function () {
                return++n % 5 > 0 ? void 0 : (h.xPadding = $(window).prop("pageXOffset"), h.yPadding = $(window).prop("pageYOffset"), h.refreshBounds(), o())
            }), i = 0, this.frame.scroll(function () {
                return++i % 5 > 0 ? void 0 : (h.xPadding = h.frame.prop("scrollLeft"), h.yPadding = h.frame.prop("scrollTop"), h.refreshBounds(), o())
            })) : this.xPadding = this.yPadding = 0, this.debug === !0 ? (s = this, e = function () {
                return console.log("Resize : @frame.width() = " + s.frame.width() + ", @frame.height() = " + s.frame.height())
            }) : e = function () {
            }, $(window).resize(function () {
                return h.xBase = r(), h.yBase = a(), h.refreshBounds(), e()
            }), this.refreshBounds()
        }, t.prototype.refreshBounds = function () {
            return this.xMin = this.xBase + this.xPadding, this.xMax = this.xMaxComputation(), this.yMin = this.yBase + this.yPadding, this.yMax = this.yMaxComputation()
        }, t.prototype.bounds = function () {
            return{xMin: this.xMin, xMax: this.xMax, yMin: this.yMin, yMax: this.yMax}
        }, t.prototype.getXBaseComputation = function () {
            var t, e = this;
            return this.position.x && "auto" !== this.position.x ? (t = "%" === i.exec(this.position.x)[1] ? function () {
                return e.x / 100 * e.frame.width()
            } : function () {
                return e.x
            }, i.lastIndex = 0) : t = this.widthIsFluid ? function () {
                return(50 - e.width / 2) / 100 * e.frame.width()
            } : function () {
                return e.frame.width() / 2 - e.width / 2
            }, t
        }, t.prototype.getYBaseComputation = function () {
            var t, e = this;
            return this.position.y && "auto" !== this.position.y ? (t = "%" === i.exec(this.position.y)[1] ? function () {
                return e.y / 100 * e.frame.height()
            } : function () {
                return e.y
            }, i.lastIndex = 0) : t = this.heightIsFluid ? function () {
                return(50 - e.height / 2) / 100 * e.frame.height()
            } : function () {
                return e.frame.height() / 2 - e.height / 2
            }, t
        }, t.prototype.mouseover = function (t) {
            var i, e;
            return this.xMin <= (i = t.pageX) && i <= this.xMax && this.yMin <= (e = t.pageY) && e <= this.yMax
        }, t
    }(), i = function () {
        function i(t, i) {
            this.id = t, null == i && (i = {}), this.zRefreshChild = e(this.zRefreshChild, this), this.mousemove = e(this.mousemove, this), this.mouseout = e(this.mouseout, this), this.debug = i.debug, n(), this.debug === !0 && console.log("transformStyleIsSupported: " + h), h ? this.init(i) : this.flatten = this.cancelRotationEvent = this.disable = this.start = this.enable = this.refresh = this.setZOf = this.zRefreshChild = this.zRefresh = this.untrackMouseMovements = this.trackMouseMovements = this.addPerspective = this.removePerspective = function () {
            }
        }

        var o, s, n, r, a, h, u;
        return u = .75, a = function (t) {
            return t
        }, h = null, o = "data-css-backup", n = function () {
            var t, i, e, o, s, n, a;
            return null === h && (e = "avalona-detection-element", t = $("body").prepend("<b id='" + e + "' style='position:absolute; top:0; left:0;'></b>"), i = $("#" + e), null != (o = i[0].style) && (o.webkitTransformStyle = "preserve-3d"), null != (s = i[0].style) && (s.MozTransformStyle = "preserve-3d"), null != (n = i[0].style) && (n.msTransformStyle = "preserve-3d"), null != (a = i[0].style) && (a.transformStyle = "preserve-3d"), h = "preserve-3d" === r(i[0]), i.remove()), h
        }, r = function (t) {
            var i;
            return i = getComputedStyle(t, null), i.getPropertyValue("-webkit-transform-style") || i.getPropertyValue("-moz-transform-style") || i.getPropertyValue("-ms-transform-style") || i.getPropertyValue("transform-style")
        }, s = function (t) {
            return"" + t.prop("tagName") + "(" + (t.attr("id") || t.attr("class") || t.attr("href")) + ")"
        }, i.prototype.find3dFrames = function () {
            if (this.frame = $("#" + this.id), this.transformedLayer = $("." + this.cssClass, this.frame).eq(0), this.debug === !0 && (console.log("@deepnessAttribute: " + this.deepnessAttribute), console.log("@cssClass: " + this.cssClass)), !this.frame.size())throw new Error("Cannot find 3d frame '#" + this.id + "' in dom");
            if (!this.transformedLayer.size())throw new Error("Cannot find 3d inner frame '#" + this.id + " ." + this.cssClass + "' in dom")
        }, i.prototype.addPerspective = function () {
            return TweenLite.set(this.transformedLayer[0], {css: {transformPerspective: 1e3}})
        }, i.prototype.removePerspective = function () {
            return TweenLite.set(this.transformedLayer[0], {css: {transformPerspective: "none"}})
        }, i.prototype.trackMouseMovements = function () {
            var t;
            return this.debug === !0 ? ($("body").append("<div id='avalona-active-area' style='background-color:hotpink;opacity:0.75;pointer-events:none;position:absolute;visibility:hidden;z-index:10000;'>AvalonA Active Area</div>"), t = $("#avalona-active-area"), this.debugMouseMove = function () {
                var i;
                return console.log("rotationX: " + this.rotationX + ", rotationY: " + this.rotationY), i = this.activeArea.bounds(), t.css({visibility: "visible", left: "" + i.xMin + "px", top: "" + i.yMin + "px", width: "" + (i.xMax - i.xMin) + "px", height: "" + (i.yMax - i.yMin) + "px"})
            }) : this.debugMouseMove = function () {
            }, this.activeArea ? this.activeArea.init(this.frame) : this.frame.on("mouseout", "#" + this.id, this.mouseout), this.frame.mousemove(this.mousemove)
        }, i.prototype.mouseout = function () {
            return this.cancelRotation()
        }, i.prototype.mouseMoveCount = 0, i.prototype.mousemove = function (t) {
            return++this.mouseMoveCount % 5 > 0 ? void 0 : !this.activeArea || this.activeArea.mouseover(t) ? (this.onrotation(), this.rotationY = (t.pageX - $(window).prop("innerWidth") / 2) / 25, this.rotationX = -1 * (t.pageY - $(window).prop("innerHeight") / 2) / 15, this.debugMouseMove(), TweenLite.to(this.transformedLayer[0], .1, {css: {rotationX: this.fy(this.rotationX), rotationY: this.fx(this.rotationY)}})) : this.rotationX || this.rotationY ? this.cancelRotation() : void 0
        }, i.prototype.onrotation = function () {
            var t, i = this;
            return clearTimeout(this.rotationTimeoutId), this.rotating || (null != (t = this.animation) && t.pause(), "function" == typeof this.onstartrotation && this.onstartrotation(), this.rotating = !0), this.rotationTimeoutId = setTimeout(function () {
                var t;
                return i.rotating = !1, "function" == typeof i.onendrotation && i.onendrotation(), null != (t = i.animation) ? t.play() : void 0
            }, 1e3)
        }, i.prototype.cancelRotation = function (t) {
            return null == t && (t = 1), this.rotationX = this.rotationY = 0, TweenLite.to(this.transformedLayer[0], t, {css: {rotationX: 0, rotationY: 0}})
        }, i.prototype.untrackMouseMovements = function () {
            var t, i;
            return null != (t = this.frame) && t.off("mousemove", this.mousemove), null != (i = this.frame) ? i.off("mouseout", this.mouseout) : void 0
        }, i.prototype.zRefresh = function (t) {
            var i, e, o;
            return null == t && (t = null), this.disabled !== !0 ? (e = this, null == t && (t = this.transformedLayer), o = "string" == typeof t ? $(o, this.transformedLayer) : $(t), this.debug === !0 && console.log("target: " + s(o)), this.setZOf(o), i = o.children().eq(0), this.debug === !0 && console.log("zRefresh firstChild: " + s(i)), this.zRefreshChild(i).siblings().each(function () {
                return e.zRefreshChild($(this))
            })) : void 0
        }, i.prototype.zRefreshChild = function (t) {
            if (!t)throw new Error("zRefreshChild child argument cannot be null");
            return $("[" + this.deepnessAttribute + "]", t).length ? (this.debug === !0 && console.log("zRefresh child " + s(t) + " has children"), this.zRefresh(t)) : t.attr(this.deepnessAttribute) && (this.debug === !0 && console.log("zRefresh child " + s(t) + " has '" + this.deepnessAttribute + "'"), this.setZOf(t)), t
        }, i.prototype.setZOf = function (t) {
            var i, e;
            if (!t)throw new Error("setZOf target argument cannot be null");
            return t.attr(o) || (i = {transformStyle: r(t[0]) || "flat", overflow: t.css("overflow") || "inherit"}, t.attr(o, JSON.stringify(i))), TweenLite.set(t[0], {css: {transformStyle: "preserve-3d", overflow: "visible"}}), e = t.attr(this.deepnessAttribute), e ? TweenLite.to(t[0], u, {css: {z: e}}) : void 0
        }, i.prototype.refresh = function () {
            var t, i;
            return this.disabled = !1, this.frame && (this.untrackMouseMovements(), null != (t = this.animation) && t.pause()), this.find3dFrames(), this.addPerspective(), this.zRefresh(), this.trackMouseMovements(), null != (i = this.animation) ? i.play(this.transformedLayer[0]) : void 0
        }, i.prototype.start = function () {
            return this.refresh()
        }, i.prototype.enable = function () {
            return this.refresh()
        }, i.prototype.disable = function () {
            var t;
            return this.frame && (this.untrackMouseMovements(), this.cancelRotationEvent(), null != (t = this.animation) && t.pause(), this.flatten(), this.removePerspective()), this.disabled = !0
        }, i.prototype.cancelRotationEvent = function () {
            return clearTimeout(this.rotationTimeoutId), this.rotating = !1, "function" == typeof this.onendrotation ? this.onendrotation() : void 0
        }, i.prototype.flatten = function () {
            var t;
            return this.cancelRotation(0), t = this, $("[" + o + "]").each(function () {
                var i;
                return t.debug === !0 && console.log("flattening layer '" + s($(this)) + "'"), i = JSON.parse($(this).attr(o)), $(this).attr(t.deepnessAttribute) && (i.z = 0), TweenLite.set(this, {css: i})
            })
        }, i.prototype.init = function (i) {
            var e, o, s;
            return this.deepnessAttribute = i.zAttr || "data-avalonA-deepness", this.cssClass = i["class"] || "avalona-inner-frame", this.fx = "function" == typeof i.fx ? i.fx : a, this.fy = "function" == typeof i.fy ? i.fy : a, i.activeArea && (this.activeArea = new t(i.activeArea)), null != (e = this.activeArea) && (e.debug = this.debug), this.onstartrotation = null != (o = i.on) ? o.startrotation : void 0, this.onendrotation = null != (s = i.on) ? s.endrotation : void 0, this.animation = i.animation, this.animation ? this.assertAnimatorValid() : void 0
        }, i.prototype.assertAnimatorValid = function () {
            if (!this.animation.play || "function" != typeof this.animation.play)throw new Error("animation.play must be a function");
            if (!this.animation.pause || "function" != typeof this.animation.pause)throw new Error("animation.pause must be a function")
        }, i
    }(), window.AvalonA = function (t, e) {
        return null == e && (e = !1), new i(t, e)
    }
}.call(this);
;
!function () {
    window.AvalonAnimation = {Balance: function (t) {
        var e, n, r;
        if (null == t && (t = {}), n = t.from, r = t.to, e = t.duration, null == n && (n = {rx: 0, ry: -20}), null == r && (r = {rx: -n.rx, ry: -n.ry}), e = null == e ? 2.75 : parseFloat(e), null == n.rx)throw new Error("Balance.from.rx cannot be null");
        if (null == n.ry)throw new Error("Balance.from.ry cannot be null");
        if (null == r.rx)throw new Error("Balance.to.rx cannot be null");
        if (null == r.ry)throw new Error("Balance.to.ry cannot be null");
        if (!e)throw new Error("Balance.duration is not valid");
        return{getTimeline: function () {
            return this.timeline = new TweenMax(this.animatedObject, e, {paused: !0, css: {rotationX: r.rx, rotationY: r.ry}, repeat: -1, yoyo: !0, ease: Power1.easeInOut})
        }, play: function (t) {
            var r = this;
            return t && (this.animatedObject = t), this.animatedObject ? this.timeline = TweenLite.to(this.animatedObject, e, {overwrite: !0, css: {rotationX: n.rx, rotationY: n.ry}, ease: Power1.easeInOut, onComplete: function () {
                return r.getTimeline().play()
            }}) : void 0
        }, pause: function () {
            var t;
            return null != (t = this.timeline) ? t.pause() : void 0
        }}
    }, Spotlight: function (t) {
        var e, n, r, i, o;
        if (null == t && (t = {}), n = t.direction, r = t.duration, e = t.angle, null == n && (n = "cw"), r = null == r ? 8 : parseFloat(r), e = null == e ? 20 : parseFloat(e), "cw" !== n && "ccw" !== n)throw new Error("Spotlight.direction must be either 'cw'(clockwise) or 'ccw'(counter-clockwise)");
        if (!r)throw new Error("Spotlight.duration is not valid");
        if (!(e && e >= 0 && 180 >= e))throw new Error("Spotlight.angle is not valid");
        return o = [
            {rotationX: e, rotationY: 0},
            {rotationX: 0, rotationY: e},
            {rotationX: -e, rotationY: 0},
            {rotationX: 0, rotationY: -e},
            {rotationX: e, rotationY: 0}
        ], "ccw" === n && (o = o.reverse()), i = o[o.length - 1], {getTimeline: function () {
            return this.timeline = new TweenMax(this.animatedObject, r, {paused: !0, overwrite: !0, repeat: -1, ease: Linear.easeNone, bezier: o})
        }, play: function (t) {
            var e = this;
            return t && (this.animatedObject = t), this.animatedObject ? this.timeline = TweenLite.to(this.animatedObject, r / 4, {overwrite: !0, ease: Linear.easeNone, bezier: [i], onComplete: function () {
                return e.getTimeline().play()
            }}) : void 0
        }, pause: function () {
            var t;
            return null != (t = this.timeline) ? t.pause() : void 0
        }}
    }}
}.call(this);
;