var de = Object.defineProperty;
var pe = (r, t, e) =>
  t in r
    ? de(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
    : (r[t] = e);
var h = (r, t, e) => (pe(r, typeof t != "symbol" ? t + "" : t, e), e);
function me(r) {
  let t = (e) => {
    var i;
    for (let s in e)
      ((i = e[s]) == null ? void 0 : i.constructor) === Object &&
        (e[s] = t(e[s]));
    return { ...e };
  };
  return t(r);
}
var y = class {
  constructor(t) {
    (this.uid = Symbol()),
      (this.name = t.name || null),
      t.schema.constructor === Object
        ? (this.store = me(t.schema))
        : ((this._storeIsProxy = !0), (this.store = t.schema)),
      (this.callbackMap = Object.create(null));
  }
  static warn(t, e) {
    console.warn(`Symbiote Data: cannot ${t}. Prop name: ` + e);
  }
  read(t) {
    return !this._storeIsProxy && !this.store.hasOwnProperty(t)
      ? (y.warn("read", t), null)
      : this.store[t];
  }
  has(t) {
    return this._storeIsProxy
      ? this.store[t] !== void 0
      : this.store.hasOwnProperty(t);
  }
  add(t, e, i = !0) {
    (!i && Object.keys(this.store).includes(t)) ||
      ((this.store[t] = e),
      this.callbackMap[t] &&
        this.callbackMap[t].forEach((s) => {
          s(this.store[t]);
        }));
  }
  pub(t, e) {
    if (!this._storeIsProxy && !this.store.hasOwnProperty(t)) {
      y.warn("publish", t);
      return;
    }
    this.add(t, e);
  }
  multiPub(t) {
    for (let e in t) this.pub(e, t[e]);
  }
  notify(t) {
    this.callbackMap[t] &&
      this.callbackMap[t].forEach((e) => {
        e(this.store[t]);
      });
  }
  sub(t, e, i = !0) {
    return !this._storeIsProxy && !this.store.hasOwnProperty(t)
      ? (y.warn("subscribe", t), null)
      : (this.callbackMap[t] || (this.callbackMap[t] = new Set()),
        this.callbackMap[t].add(e),
        i && e(this.store[t]),
        {
          remove: () => {
            this.callbackMap[t].delete(e),
              this.callbackMap[t].size || delete this.callbackMap[t];
          },
          callback: e,
        });
  }
  remove() {
    delete y.globalStore[this.uid];
  }
  static registerLocalCtx(t) {
    let e = new y({ schema: t });
    return (y.globalStore[e.uid] = e), e;
  }
  static registerNamedCtx(t, e) {
    let i = y.globalStore[t];
    return (
      i
        ? console.warn('State: context name "' + t + '" already in use')
        : ((i = new y({ name: t, schema: e })), (y.globalStore[t] = i)),
      i
    );
  }
  static clearNamedCtx(t) {
    delete y.globalStore[t];
  }
  static getNamedCtx(t, e = !0) {
    return (
      y.globalStore[t] ||
      (e && console.warn('State: wrong context name - "' + t + '"'), null)
    );
  }
};
y.globalStore = Object.create(null);
var _ = Object.freeze({
    BIND_ATTR: "set",
    ATTR_BIND_PRFX: "@",
    EXT_DATA_CTX_PRFX: "*",
    NAMED_DATA_CTX_SPLTR: "/",
    CTX_NAME_ATTR: "ctx-name",
    CSS_CTX_PROP: "--ctx-name",
    EL_REF_ATTR: "ref",
    AUTO_TAG_PRFX: "sym",
  }),
  Nt = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm",
  fe = Nt.length - 1,
  K = class {
    static generate(t = "XXXXXXXXX-XXX") {
      let e = "";
      for (let i = 0; i < t.length; i++)
        e += t[i] === "-" ? t[i] : Nt.charAt(Math.random() * fe);
      return e;
    }
  };
function ge(r, t) {
  if (t.renderShadow) return;
  let e = [...r.querySelectorAll("slot")];
  if (t.__initChildren.length && e.length) {
    let i = {};
    e.forEach((s) => {
      let n = s.getAttribute("name");
      n
        ? (i[n] = { slot: s, fr: document.createDocumentFragment() })
        : (i.__default__ = { slot: s, fr: document.createDocumentFragment() });
    }),
      t.__initChildren.forEach((s) => {
        var o;
        let n = (o = s.getAttribute) == null ? void 0 : o.call(s, "slot");
        n
          ? i[n].fr.appendChild(s)
          : i.__default__ && i.__default__.fr.appendChild(s);
      }),
      Object.values(i).forEach((s) => {
        s.slot.parentNode.insertBefore(s.fr, s.slot), s.slot.remove();
      });
  } else t.innerHTML = "";
}
function ve(r, t) {
  [...r.querySelectorAll(`[${_.EL_REF_ATTR}]`)].forEach((e) => {
    let i = e.getAttribute(_.EL_REF_ATTR);
    (t.ref[i] = e), e.removeAttribute(_.EL_REF_ATTR);
  });
}
function be(r, t) {
  [...r.querySelectorAll(`[${_.BIND_ATTR}]`)].forEach((e) => {
    e
      .getAttribute(_.BIND_ATTR)
      .split(";")
      .forEach((n) => {
        if (!n) return;
        let o = n.split(":").map((g) => g.trim()),
          a = o[0],
          c;
        a.indexOf(_.ATTR_BIND_PRFX) === 0 &&
          ((c = !0), (a = a.replace(_.ATTR_BIND_PRFX, "")));
        let u = o[1].split(",").map((g) => g.trim()),
          p,
          d,
          v,
          f;
        if (a.includes(".")) {
          p = !0;
          let g = a.split(".");
          (f = () => {
            (d = e),
              g.forEach((b, A) => {
                A < g.length - 1 ? (d = d[b]) : (v = b);
              });
          }),
            f();
        }
        for (let g of u)
          t.sub(g, (b) => {
            c
              ? (b == null ? void 0 : b.constructor) === Boolean
                ? b
                  ? e.setAttribute(a, "")
                  : e.removeAttribute(a)
                : e.setAttribute(a, b)
              : p
              ? d
                ? (d[v] = b)
                : window.setTimeout(() => {
                    f(), (d[v] = b);
                  })
              : (e[a] = b);
          });
      }),
      e.removeAttribute(_.BIND_ATTR);
  });
}
var ye = [ge, ve, be],
  Ft = 0,
  T = class extends HTMLElement {
    render(t, e = this.renderShadow) {
      let i;
      if (t || this.constructor.template) {
        for (
          this.constructor.template &&
          !this.constructor.__tpl &&
          ((this.constructor.__tpl = document.createElement("template")),
          (this.constructor.__tpl.innerHTML = this.constructor.template));
          this.firstChild;

        )
          this.firstChild.remove();
        if ((t == null ? void 0 : t.constructor) === DocumentFragment) i = t;
        else if ((t == null ? void 0 : t.constructor) === String) {
          let s = document.createElement("template");
          (s.innerHTML = t), (i = s.content.cloneNode(!0));
        } else
          this.constructor.__tpl &&
            (i = this.constructor.__tpl.content.cloneNode(!0));
        for (let s of this.tplProcessors) s(i, this);
      }
      e
        ? (this.shadowRoot || this.attachShadow({ mode: "open" }),
          i && this.shadowRoot.appendChild(i))
        : i && this.appendChild(i);
    }
    addTemplateProcessor(t) {
      this.tplProcessors.add(t);
    }
    constructor() {
      super();
      (this.init$ = Object.create(null)),
        (this.tplProcessors = new Set()),
        (this.ref = Object.create(null)),
        (this.allSubs = new Set()),
        (this.pauseRender = !1),
        (this.renderShadow = !1),
        (this.readyToDestroy = !0);
    }
    get autoCtxName() {
      return (
        this.__autoCtxName ||
          ((this.__autoCtxName = K.generate()),
          this.style.setProperty(_.CSS_CTX_PROP, `'${this.__autoCtxName}'`)),
        this.__autoCtxName
      );
    }
    get cssCtxName() {
      return this.getCssData(_.CSS_CTX_PROP, !0);
    }
    get ctxName() {
      var t;
      return (
        ((t = this.getAttribute(_.CTX_NAME_ATTR)) == null
          ? void 0
          : t.trim()) ||
        this.cssCtxName ||
        this.autoCtxName
      );
    }
    get localCtx() {
      return (
        this.__localCtx || (this.__localCtx = y.registerLocalCtx({})),
        this.__localCtx
      );
    }
    get nodeCtx() {
      return (
        y.getNamedCtx(this.ctxName, !1) || y.registerNamedCtx(this.ctxName, {})
      );
    }
    static __parseProp(t, e) {
      let i, s;
      if (t.startsWith(_.EXT_DATA_CTX_PRFX))
        (i = e.nodeCtx), (s = t.replace(_.EXT_DATA_CTX_PRFX, ""));
      else if (t.includes(_.NAMED_DATA_CTX_SPLTR)) {
        let n = t.split(_.NAMED_DATA_CTX_SPLTR);
        (i = y.getNamedCtx(n[0])), (s = n[1]);
      } else (i = e.localCtx), (s = t);
      return { ctx: i, name: s };
    }
    sub(t, e) {
      let i = T.__parseProp(t, this);
      this.allSubs.add(i.ctx.sub(i.name, e));
    }
    notify(t) {
      let e = T.__parseProp(t, this);
      e.ctx.notify(e.name);
    }
    has(t) {
      let e = T.__parseProp(t, this);
      return e.ctx.has(e.name);
    }
    add(t, e) {
      let i = T.__parseProp(t, this);
      i.ctx.add(i.name, e, !1);
    }
    add$(t) {
      for (let e in t) this.add(e, t[e]);
    }
    get $() {
      if (!this.__stateProxy) {
        let t = Object.create(null);
        this.__stateProxy = new Proxy(t, {
          set: (e, i, s) => {
            let n = T.__parseProp(i, this);
            return n.ctx.pub(n.name, s), !0;
          },
          get: (e, i) => {
            let s = T.__parseProp(i, this);
            return s.ctx.read(s.name);
          },
        });
      }
      return this.__stateProxy;
    }
    set$(t) {
      for (let e in t) this.$[e] = t[e];
    }
    initCallback() {}
    __initDataCtx() {
      let t = this.constructor.__attrDesc;
      if (t)
        for (let e of Object.values(t))
          Object.keys(this.init$).includes(e) || (this.init$[e] = "");
      for (let e in this.init$)
        if (e.startsWith(_.EXT_DATA_CTX_PRFX))
          this.nodeCtx.add(e.replace(_.EXT_DATA_CTX_PRFX, ""), this.init$[e]);
        else if (e.includes(_.NAMED_DATA_CTX_SPLTR)) {
          let i = e.split(_.NAMED_DATA_CTX_SPLTR),
            s = i[0].trim(),
            n = i[1].trim();
          if (s && n) {
            let o = y.getNamedCtx(s, !1);
            o || (o = y.registerNamedCtx(s, {})), o.add(n, this.init$[e]);
          }
        } else this.localCtx.add(e, this.init$[e]);
      this.__dataCtxInitialized = !0;
    }
    connectedCallback() {
      var t, e;
      if (
        (this.__disconnectTimeout &&
          window.clearTimeout(this.__disconnectTimeout),
        !this.connectedOnce)
      ) {
        let i =
          (t = this.getAttribute(_.CTX_NAME_ATTR)) == null ? void 0 : t.trim();
        i && this.style.setProperty(_.CSS_CTX_PROP, `'${i}'`),
          this.__initDataCtx(),
          (this.__initChildren = [...this.childNodes]);
        for (let s of ye) this.addTemplateProcessor(s);
        this.pauseRender || this.render(),
          (e = this.initCallback) == null || e.call(this);
      }
      this.connectedOnce = !0;
    }
    destroyCallback() {}
    disconnectedCallback() {
      this.dropCssDataCache(),
        !!this.readyToDestroy &&
          (this.__disconnectTimeout &&
            window.clearTimeout(this.__disconnectTimeout),
          (this.__disconnectTimeout = window.setTimeout(() => {
            this.destroyCallback();
            for (let t of this.allSubs) t.remove(), this.allSubs.delete(t);
            for (let t of this.tplProcessors) this.tplProcessors.delete(t);
          }, 100)));
    }
    static reg(t, e = !1) {
      if (
        (t || (Ft++, (t = `${_.AUTO_TAG_PRFX}-${Ft}`)),
        (this.__tag = t),
        window.customElements.get(t))
      ) {
        console.warn(`${t} - is already in "customElements" registry`);
        return;
      }
      window.customElements.define(t, e ? class extends this {} : this);
    }
    static get is() {
      return this.__tag || this.reg(), this.__tag;
    }
    static bindAttributes(t) {
      (this.observedAttributes = Object.keys(t)), (this.__attrDesc = t);
    }
    attributeChangedCallback(t, e, i) {
      if (e === i) return;
      let s = this.constructor.__attrDesc[t];
      s
        ? this.__dataCtxInitialized
          ? (this.$[s] = i)
          : (this.init$[s] = i)
        : (this[t] = i);
    }
    getCssData(t, e = !1) {
      if (
        (this.__cssDataCache || (this.__cssDataCache = Object.create(null)),
        !Object.keys(this.__cssDataCache).includes(t))
      ) {
        this.__computedStyle ||
          (this.__computedStyle = window.getComputedStyle(this));
        let i = this.__computedStyle.getPropertyValue(t).trim();
        i.startsWith("'") && i.endsWith("'") && (i = i.replace(/\'/g, '"'));
        try {
          this.__cssDataCache[t] = JSON.parse(i);
        } catch (s) {
          !e && console.warn(`CSS Data error: ${t}`),
            (this.__cssDataCache[t] = null);
        }
      }
      return this.__cssDataCache[t];
    }
    dropCssDataCache() {
      (this.__cssDataCache = null), (this.__computedStyle = null);
    }
    defineAccessor(t, e, i) {
      let s = "__" + t;
      (this[s] = this[t]),
        Object.defineProperty(this, t, {
          set: (n) => {
            (this[s] = n),
              i
                ? window.setTimeout(() => {
                    e == null || e(n);
                  })
                : e == null || e(n);
          },
          get: () => this[s],
        }),
        (this[t] = this[s]);
    }
  },
  Xt = "[Typed State] Wrong property name: ",
  _e = "[Typed State] Wrong property type: ",
  Vt = class {
    constructor(t, e) {
      (this.__typedSchema = t),
        (this.__ctxId = e || K.generate()),
        (this.__schema = Object.keys(t).reduce(
          (i, s) => ((i[s] = t[s].value), i),
          {}
        )),
        (this.__state = y.registerNamedCtx(this.__ctxId, this.__schema));
    }
    setValue(t, e) {
      if (!this.__typedSchema.hasOwnProperty(t)) {
        console.warn(Xt + t);
        return;
      }
      if ((e == null ? void 0 : e.constructor) !== this.__typedSchema[t].type) {
        console.warn(_e + t);
        return;
      }
      this.__state.pub(t, e);
    }
    setMultipleValues(t) {
      for (let e in t) this.setValue(e, t[e]);
    }
    getValue(t) {
      if (!this.__typedSchema.hasOwnProperty(t)) {
        console.warn(Xt + t);
        return;
      }
      return this.__state.read(t);
    }
    subscribe(t, e) {
      return this.__state.sub(t, e);
    }
    remove() {
      this.__state.remove();
    }
  },
  Ct = class {
    constructor(t) {
      (this.__typedSchema = t.typedSchema),
        (this.__ctxId = t.ctxName || K.generate()),
        (this.__state = y.registerNamedCtx(this.__ctxId, {})),
        (this.__watchList = t.watchList || []),
        (this.__handler = t.handler || null),
        (this.__subsMap = Object.create(null)),
        (this.__observers = new Set()),
        (this.__items = new Set());
      let e = Object.create(null);
      this.__notifyObservers = (i, s) => {
        this.__observeTimeout && window.clearTimeout(this.__observeTimeout),
          e[i] || (e[i] = new Set()),
          e[i].add(s),
          (this.__observeTimeout = window.setTimeout(() => {
            this.__observers.forEach((n) => {
              n({ ...e });
            }),
              (e = Object.create(null));
          }));
      };
    }
    notify() {
      this.__notifyTimeout && window.clearTimeout(this.__notifyTimeout),
        (this.__notifyTimeout = window.setTimeout(() => {
          var t;
          (t = this.__handler) == null || t.call(this, [...this.__items]);
        }));
    }
    add(t) {
      let e = new Vt(this.__typedSchema);
      for (let i in t) e.setValue(i, t[i]);
      return (
        this.__state.add(e.__ctxId, e),
        this.__watchList.forEach((i) => {
          this.__subsMap[e.__ctxId] || (this.__subsMap[e.__ctxId] = []),
            this.__subsMap[e.__ctxId].push(
              e.subscribe(i, () => {
                this.__notifyObservers(i, e.__ctxId);
              })
            );
        }),
        this.__items.add(e.__ctxId),
        this.notify(),
        e
      );
    }
    read(t) {
      return this.__state.read(t);
    }
    readProp(t, e) {
      return this.read(t).getValue(e);
    }
    publishProp(t, e, i) {
      this.read(t).setValue(e, i);
    }
    remove(t) {
      this.__items.delete(t),
        this.notify(),
        this.__state.pub(t, null),
        delete this.__subsMap[t];
    }
    clearAll() {
      this.__items.forEach((t) => {
        this.remove(t);
      });
    }
    observe(t) {
      this.__observers.add(t);
    }
    unobserve(t) {
      this.__observers.delete(t);
    }
    findItems(t) {
      let e = [];
      return (
        this.__items.forEach((i) => {
          let s = this.read(i);
          t(s) && e.push(i);
        }),
        e
      );
    }
    items() {
      return [...this.__items];
    }
    destroy() {
      this.__state.remove(), (this.__observers = null);
      for (let t in this.__subsMap)
        this.__subsMap[t].forEach((e) => {
          e.remove();
        }),
          delete this.__subsMap[t];
    }
  },
  P = class {
    static _print(t) {
      console.warn(t);
    }
    static setDefaultTitle(t) {
      this.defaultTitle = t;
    }
    static setRoutingMap(t) {
      Object.assign(this.appMap, t);
      for (let e in this.appMap)
        !this.defaultRoute && this.appMap[e].default === !0
          ? (this.defaultRoute = e)
          : !this.errorRoute &&
            this.appMap[e].error === !0 &&
            (this.errorRoute = e);
    }
    static set routingEventName(t) {
      this.__routingEventName = t;
    }
    static get routingEventName() {
      return this.__routingEventName || "sym-on-route";
    }
    static readAddressBar() {
      let t = { route: null, options: {} };
      return (
        window.location.search.split(this.separator).forEach((i) => {
          if (i.includes("?")) t.route = i.replace("?", "");
          else if (i.includes("=")) {
            let s = i.split("=");
            t.options[s[0]] = decodeURI(s[1]);
          } else t.options[i] = !0;
        }),
        t
      );
    }
    static notify() {
      let t = this.readAddressBar(),
        e = this.appMap[t.route];
      if (
        (e && e.title && (document.title = e.title),
        t.route === null && this.defaultRoute)
      ) {
        this.applyRoute(this.defaultRoute);
        return;
      } else if (!e && this.errorRoute) {
        this.applyRoute(this.errorRoute);
        return;
      } else if (!e && this.defaultRoute) {
        this.applyRoute(this.defaultRoute);
        return;
      } else if (!e) {
        this._print(`Route "${t.route}" not found...`);
        return;
      }
      let i = new CustomEvent(P.routingEventName, {
        detail: { route: t.route, options: Object.assign(e || {}, t.options) },
      });
      window.dispatchEvent(i);
    }
    static reflect(t, e = {}) {
      let i = this.appMap[t];
      if (!i) {
        this._print("Wrong route: " + t);
        return;
      }
      let s = "?" + t;
      for (let o in e)
        e[o] === !0
          ? (s += this.separator + o)
          : (s += this.separator + o + `=${e[o]}`);
      let n = i.title || this.defaultTitle || "";
      window.history.pushState(null, n, s), (document.title = n);
    }
    static applyRoute(t, e = {}) {
      this.reflect(t, e), this.notify();
    }
    static setSeparator(t) {
      this._separator = t;
    }
    static get separator() {
      return this._separator || "&";
    }
    static createRouterData(t, e) {
      this.setRoutingMap(e);
      let i = y.registerNamedCtx(t, {
        route: null,
        options: null,
        title: null,
      });
      return (
        window.addEventListener(this.routingEventName, (s) => {
          var n;
          i.multiPub({
            route: s.detail.route,
            options: s.detail.options,
            title:
              ((n = s.detail.options) == null ? void 0 : n.title) ||
              this.defaultTitle ||
              "",
          });
        }),
        P.notify(),
        i
      );
    }
  };
P.appMap = Object.create(null);
window.onpopstate = () => {
  P.notify();
};
function H(r, t) {
  for (let e in t)
    e.includes("-") ? r.style.setProperty(e, t[e]) : (r.style[e] = t[e]);
}
function R(r, t) {
  for (let e in t)
    t[e].constructor === Boolean
      ? t[e]
        ? r.setAttribute(e, "")
        : r.removeAttribute(e)
      : r.setAttribute(e, t[e]);
}
function wt(r = { tag: "div" }) {
  let t = document.createElement(r.tag);
  if (
    (r.attributes && R(t, r.attributes),
    r.styles && H(t, r.styles),
    r.properties)
  )
    for (let e in r.properties) t[e] = r.properties[e];
  return (
    r.processors &&
      r.processors.forEach((e) => {
        e(t);
      }),
    r.children &&
      r.children.forEach((e) => {
        let i = wt(e);
        t.appendChild(i);
      }),
    t
  );
}
var Ht = "idb-store-ready",
  Ce = "symbiote-db",
  we = "symbiote-idb-update_",
  zt = class {
    _notifyWhenReady(t = null) {
      window.dispatchEvent(
        new CustomEvent(Ht, {
          detail: { dbName: this.name, storeName: this.storeName, event: t },
        })
      );
    }
    get _updEventName() {
      return we + this.name;
    }
    _getUpdateEvent(t) {
      return new CustomEvent(this._updEventName, {
        detail: { key: this.name, newValue: t },
      });
    }
    _notifySubscribers(t) {
      window.localStorage.removeItem(this.name),
        window.localStorage.setItem(this.name, t),
        window.dispatchEvent(this._getUpdateEvent(t));
    }
    constructor(t, e) {
      (this.name = t),
        (this.storeName = e),
        (this.version = 1),
        (this.request = window.indexedDB.open(this.name, this.version)),
        (this.request.onupgradeneeded = (i) => {
          (this.db = i.target.result),
            (this.objStore = this.db.createObjectStore(e, { keyPath: "_key" })),
            (this.objStore.transaction.oncomplete = (s) => {
              this._notifyWhenReady(s);
            });
        }),
        (this.request.onsuccess = (i) => {
          (this.db = i.target.result), this._notifyWhenReady(i);
        }),
        (this.request.onerror = (i) => {
          console.error(i);
        }),
        (this._subscribtionsMap = {}),
        (this._updateHandler = (i) => {
          i.key === this.name &&
            this._subscribtionsMap[i.newValue] &&
            this._subscribtionsMap[i.newValue].forEach(async (n) => {
              n(await this.read(i.newValue));
            });
        }),
        (this._localUpdateHanler = (i) => {
          this._updateHandler(i.detail);
        }),
        window.addEventListener("storage", this._updateHandler),
        window.addEventListener(this._updEventName, this._localUpdateHanler);
    }
    read(t) {
      let i = this.db
        .transaction(this.storeName, "readwrite")
        .objectStore(this.storeName)
        .get(t);
      return new Promise((s, n) => {
        (i.onsuccess = (o) => {
          var a;
          ((a = o.target.result) == null ? void 0 : a._value)
            ? s(o.target.result._value)
            : (s(null), console.warn(`IDB: cannot read "${t}"`));
        }),
          (i.onerror = (o) => {
            n(o);
          });
      });
    }
    write(t, e, i = !1) {
      let s = { _key: t, _value: e },
        o = this.db
          .transaction(this.storeName, "readwrite")
          .objectStore(this.storeName)
          .put(s);
      return new Promise((a, c) => {
        (o.onsuccess = (u) => {
          i || this._notifySubscribers(t), a(u.target.result);
        }),
          (o.onerror = (u) => {
            c(u);
          });
      });
    }
    delete(t, e = !1) {
      let s = this.db
        .transaction(this.storeName, "readwrite")
        .objectStore(this.storeName)
        .delete(t);
      return new Promise((n, o) => {
        (s.onsuccess = (a) => {
          e || this._notifySubscribers(t), n(a);
        }),
          (s.onerror = (a) => {
            o(a);
          });
      });
    }
    getAll() {
      let e = this.db
        .transaction(this.storeName, "readwrite")
        .objectStore(this.storeName)
        .getAll();
      return new Promise((i, s) => {
        (e.onsuccess = (n) => {
          let o = n.target.result;
          i(o.map((a) => a._value));
        }),
          (e.onerror = (n) => {
            s(n);
          });
      });
    }
    subscribe(t, e) {
      this._subscribtionsMap[t] || (this._subscribtionsMap[t] = new Set());
      let i = this._subscribtionsMap[t];
      return (
        i.add(e),
        {
          remove: () => {
            i.delete(e), i.size || delete this._subscribtionsMap[t];
          },
        }
      );
    }
    stop() {
      window.removeEventListener("storage", this._updateHandler),
        (this.__subscribtionsMap = null),
        At.clear(this.name);
    }
  },
  At = class {
    static get readyEventName() {
      return Ht;
    }
    static open(t = Ce, e = "store") {
      let i = `${t}/${e}`;
      return this._reg[i] || (this._reg[i] = new zt(t, e)), this._reg[i];
    }
    static clear(t) {
      window.indexedDB.deleteDatabase(t);
      for (let e in this._reg) e.split("/")[0] === t && delete this._reg[e];
    }
  };
At._reg = Object.create(null);
var Wt = Object.freeze({
  file: { type: File, value: null },
  externalUrl: { type: String, value: null },
  fileName: { type: String, value: null },
  fileSize: { type: Number, value: null },
  lastModified: { type: Number, value: Date.now() },
  uploadProgress: { type: Number, value: 0 },
  uuid: { type: String, value: null },
  isImage: { type: Boolean, value: !1 },
  mimeType: { type: String, value: null },
  uploadErrorMsg: { type: String, value: null },
  validationErrorMsg: { type: String, value: null },
  ctxName: { type: String, value: null },
  transformationsUrl: { type: String, value: null },
});
var xt = "active",
  Tt = document.readyState === "complete";
Tt ||
  window.addEventListener("load", () => {
    Tt = !0;
  });
function Ae(r, t) {
  [...r.querySelectorAll("[l10n]")].forEach((e) => {
    let i = e.getAttribute("l10n"),
      s = "textContent";
    if (i.includes(":")) {
      let o = i.split(":");
      (s = o[0]), (i = o[1]);
    }
    let n = "l10n:" + i;
    t.__l10nKeys.push(n),
      t.add(n, i),
      t.sub(n, (o) => {
        e[s] = t.l10n(o);
      }),
      e.removeAttribute("l10n");
  }),
    [...r.querySelectorAll("*")].forEach((e) => {
      [...e.attributes].forEach((i) => {
        i.name.startsWith(".") &&
          (e.classList.add(i.name.replace(".", "")), e.removeAttribute(i.name));
      });
    });
}
var Gt = !1,
  l = class extends T {
    l10n(t) {
      return this.getCssData("--l10n-" + t);
    }
    constructor() {
      super();
      (this.activityType = null),
        this.addTemplateProcessor(Ae),
        (this.__l10nKeys = []),
        (this.__l10nUpdate = () => {
          this.dropCssDataCache();
          for (let t of this.__l10nKeys) this.notify(t);
        }),
        window.addEventListener("uc-l10n-update", this.__l10nUpdate);
    }
    applyL10nKey(t, e) {
      this.$["l10n:" + t] = e;
    }
    historyBack() {
      let t = this.$["*history"];
      t.pop();
      let e = t.pop();
      (this.$["*currentActivity"] = e),
        t.length > 10 && (t = t.slice(t.length - 11, t.length - 1)),
        (this.$["*history"] = t);
    }
    addFiles(t) {
      t.forEach((e) => {
        this.uploadCollection.add({
          file: e,
          isImage: e.type.includes("image"),
          mimeType: e.type,
          fileName: e.name,
          fileSize: e.size,
        });
      });
    }
    output() {
      let t = [];
      this.uploadCollection.items().forEach((i) => {
        t.push(y.getNamedCtx(i).store);
      }),
        (this.$["*outputData"] = t);
    }
    openSystemDialog() {
      (this.fileInput = document.createElement("input")),
        (this.fileInput.type = "file"),
        (this.fileInput.multiple = !!this.config.MULTIPLE),
        (this.fileInput.max = this.config.MAX_FILES + ""),
        (this.fileInput.accept = this.config.ACCEPT),
        this.fileInput.dispatchEvent(new MouseEvent("click")),
        (this.fileInput.onchange = () => {
          this.addFiles([...this.fileInput.files]),
            (this.$["*currentActivity"] = l.activities.UPLOAD_LIST),
            this.config.CONFIRM_UPLOAD || (this.$["*currentActivity"] = ""),
            (this.fileInput.value = ""),
            (this.fileInput = null);
        });
    }
    connectedCallback() {
      Tt
        ? this.connected()
        : window.addEventListener("load", () => {
            this.connected();
          });
    }
    connected() {
      if (this.__connectedOnce) super.connectedCallback();
      else {
        if (
          (Gt ||
            (this.add$({
              "*registry": Object.create(null),
              "*currentActivity": "",
              "*currentActivityParams": {},
              "*history": [],
              "*commonProgress": 0,
              "*pubkey": "demopublickey",
              "*uploadList": [],
              "*multiple": !0,
              "*accept": "image/*",
              "*files": [],
              "*outputData": null,
            }),
            (Gt = !0)),
          super.connectedCallback(),
          this.activityType)
        ) {
          this.hasAttribute("activity") ||
            this.setAttribute("activity", this.activityType);
          let t = this.$["*registry"];
          (t[this.tagName.toLowerCase()] = this),
            (this.$["*registry"] = t),
            this.sub("*currentActivity", (e) => {
              if (!e) {
                this.removeAttribute(xt);
                return;
              }
              if (this.activityType === e) {
                let i = this.$["*history"];
                e && i[i.length - 1] !== e && i.push(e),
                  this.setAttribute(xt, "");
              } else this.removeAttribute(xt);
            });
        }
        this.__connectedOnce = !0;
      }
    }
    get uploadCollection() {
      if (!this.has("*uploadCollection")) {
        let t = new Ct({
          typedSchema: Wt,
          watchList: ["uploadProgress", "uuid"],
          handler: (e) => {
            this.$["*uploadList"] = e;
          },
        });
        t.observe((e) => {
          if (e.uploadProgress) {
            let i = 0,
              s = t.findItems((n) => !n.getValue("uploadErrorMsg"));
            s.forEach((n) => {
              i += t.readProp(n, "uploadProgress");
            }),
              (this.$["*commonProgress"] = i / s.length);
          }
        }),
          this.add("*uploadCollection", t);
      }
      return this.$["*uploadCollection"];
    }
    get blockRegistry() {
      return this.$["*registry"];
    }
    get config() {
      if (!this._config) {
        this._config = {};
        for (let t in l.cfgCssMap) {
          let e = this.getCssData(l.cfgCssMap[t], !0);
          e !== null && (this._config[t] = e);
        }
      }
      return this._config;
    }
    dropCache() {
      this.dropCssDataCache(), (this._config = null);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), (this._config = null);
    }
    destroyCallback() {
      window.removeEventListener("uc-l10n-update", this.__l10nUpdate),
        (this.__l10nKeys = null);
    }
    static reg(t) {
      let e = "uc-";
      super.reg(t.startsWith(e) ? t : e + t);
    }
  };
l.activities = Object.freeze({
  SOURCE_SELECT: "source-select",
  CAMERA: "camera",
  DRAW: "draw",
  UPLOAD_LIST: "upload-list",
  URL: "url",
  CONFIRMATION: "confirmation",
  CLOUD_IMG_EDIT: "cloud-image-edit",
  EXTERNAL: "external",
  DETAILS: "details",
});
l.extSrcList = Object.freeze({
  FACEBOOK: "facebook",
  DROPBOX: "dropbox",
  GDRIVE: "gdrive",
  GPHOTOS: "gphotos",
  INSTAGRAM: "instagram",
  FLICKR: "flickr",
  VK: "vk",
  EVERNOTE: "evernote",
  BOX: "box",
  ONEDRIVE: "onedrive",
  HUDDLE: "huddle",
});
l.sourceTypes = Object.freeze({
  LOCAL: "local",
  URL: "url",
  CAMERA: "camera",
  DRAW: "draw",
  ...l.extSrcList,
});
l.cfgCssMap = Object.freeze({
  PUBKEY: "--cfg-pubkey",
  MULTIPLE: "--cfg-multiple",
  CONFIRM_UPLOAD: "--cfg-confirm-upload",
  IMG_ONLY: "--cfg-img-only",
  ACCEPT: "--cfg-accept",
  STORE: "--cfg-store",
  CAMERA_MIRROR: "--cfg-camera-mirror",
  SRC_LIST: "--cfg-source-list",
  MAX_FILES: "--cfg-max-files",
});
var w = class extends l {
  constructor() {
    super();
    h(this, "activityType");
    (this._isActive = !1), (this._activityParams = {});
  }
  initCallback() {
    this.sub("*currentActivity", (t) => {
      t === this.activityType && !this._isActive
        ? ((this._isActive = !0), setTimeout(() => this.onActivate(), 0))
        : t !== this.activityType &&
          this._isActive &&
          ((this._isActive = !1), this.onDeactivate());
    }),
      this.sub("*currentActivityParams", (t) => {
        this._activityParams = t;
      });
  }
  get activityParams() {
    return this._activityParams;
  }
  onActivate() {
    this.set$({
      "*modalDesiredWidth": window
        .getComputedStyle(this)
        .getPropertyValue("--activity-desired-w"),
      "*modalDesiredHeight": window
        .getComputedStyle(this)
        .getPropertyValue("--activity-desired-h"),
      "*modalDesiredMobileWidth": window
        .getComputedStyle(this)
        .getPropertyValue("--activity-desired-mobile-w"),
      "*modalDesiredMobileHeight": window
        .getComputedStyle(this)
        .getPropertyValue("--activity-desired-mobile-h"),
    });
  }
  onDeactivate() {}
};
var z = class extends T {
  constructor() {
    super(...arguments);
    h(this, "init$", { path: "" });
  }
  initCallback() {
    this.defineAccessor("name", (t) => {
      !t || (this.$.path = this.getCssData(`--icon-${t}`));
    });
  }
};
z.template = `
<svg
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg">
  <path set="@d: path"></path>
</svg>
`;
z.bindAttributes({ name: null });
var Q = class extends l {
  constructor() {
    super(...arguments);
    h(this, "init$", { "*simpleButtonText": "" });
  }
  initCallback() {
    (this.$["*simpleButtonText"] = this.config.MULTIPLE
      ? this.l10n("upload-files")
      : this.l10n("upload-file")),
      (this.onclick = () => {
        this.$["*uploadList"].length
          ? this.set$({ "*currentActivity": l.activities.UPLOAD_LIST })
          : this.set$({ "*currentActivity": l.activities.SOURCE_SELECT });
      });
  }
};
Q.template = `
<button>
  <uc-icon name="upload"></uc-icon>
  <span set="textContent: *simpleButtonText"></span>
  <slot></slot>
</button>`;
var Et = class extends w {
  initCallback() {
    (this.activityType = this.getAttribute("activity")), super.initCallback();
  }
};
var St = class extends l {
  initCallback() {
    this.addEventListener("dragover", (t) => {
      t.stopPropagation(), t.preventDefault();
    }),
      this.addEventListener(
        "drop",
        (t) => {
          t.stopPropagation(),
            t.preventDefault(),
            t.dataTransfer.files &&
              ([...t.dataTransfer.files].forEach((e) => {
                this.uploadCollection.add({
                  file: e,
                  isImage: e.type.includes("image"),
                  mimeType: e.type,
                  fileName: e.name,
                  fileSize: e.size,
                });
              }),
              this.set$({ "*currentActivity": l.activities.UPLOAD_LIST }));
        },
        !1
      );
  }
};
var xe = "src-type-",
  W = class extends l {
    constructor() {
      super();
      h(this, "init$", { iconName: "default" });
      this._registeredTypes = {};
    }
    initTypes() {
      this.registerType({
        type: l.sourceTypes.LOCAL,
        activity: "",
        onClick: () => {
          this.openSystemDialog();
        },
      }),
        this.registerType({
          type: l.sourceTypes.URL,
          activity: l.activities.URL,
          textKey: "from-url",
        }),
        this.registerType({
          type: l.sourceTypes.CAMERA,
          activity: l.activities.CAMERA,
        }),
        this.registerType({
          type: "draw",
          activity: l.activities.DRAW,
          icon: "edit-draw",
        });
      for (let t of Object.values(l.extSrcList))
        this.registerType({
          type: t,
          activity: l.activities.EXTERNAL,
          activityParams: { externalSourceType: t },
        });
    }
    initCallback() {
      this.initTypes(),
        this.setAttribute("role", "button"),
        this.defineAccessor("type", (t) => {
          !t || this.applyType(t);
        });
    }
    registerType(t) {
      this._registeredTypes[t.type] = t;
    }
    getType(t) {
      return this._registeredTypes[t];
    }
    applyType(t) {
      let e = this._registeredTypes[t],
        {
          textKey: i = t,
          icon: s = t,
          activity: n,
          onClick: o,
          activityParams: a = {},
        } = e;
      this.applyL10nKey("src-type", `${xe}${i}`),
        (this.$.iconName = s),
        (this.onclick = (c) => {
          this.set$({ "*currentActivityParams": a, "*currentActivity": n }),
            o && o(c);
        });
    }
  };
W.template = `
<uc-icon set="@name: iconName"></uc-icon>
<div .txt l10n="src-type"></div>
`;
W.bindAttributes({ type: null });
var Z = class extends w {
  constructor() {
    super(...arguments);
    h(this, "activityType", l.activities.SOURCE_SELECT);
  }
  onActivate() {
    super.onActivate(),
      this.set$({
        "*modalCaption": this.l10n("select-file-source"),
        "*modalIcon": "default",
      });
  }
};
Z.template = `
<slot></slot>
`;
var kt = class extends l {
  initCallback() {
    var i;
    console.log("initCallback", this, this.parentElement);
    let t =
        ((i = this.config.SRC_LIST) == null
          ? void 0
          : i.split(",").map((s) => s.trim())) || [],
      e = "";
    t.forEach((s) => {
      e += `<uc-source-btn type="${s}"></uc-source-btn>`;
    }),
      this.hasAttribute("wrap") ? (this.innerHTML = e) : (this.outerHTML = e);
  }
  connected() {
    console.log("connected", this, this.parentElement), super.connected();
  }
  connectedCallback() {
    console.log("connectedCallback", this, this.parentElement),
      super.connectedCallback();
  }
  disconnectedCallback() {
    console.log("disconnectedCallback", this, this.parentElement),
      super.disconnectedCallback();
  }
};
function qt(r, t = 40) {
  let e = document.createElement("canvas"),
    i = e.getContext("2d"),
    s = new Image(),
    n = new Promise((o, a) => {
      (s.onload = () => {
        let c = s.height / s.width;
        c > 1
          ? ((e.width = t), (e.height = t * c))
          : ((e.height = t), (e.width = t / c)),
          (i.fillStyle = "rgb(240, 240, 240)"),
          i.fillRect(0, 0, e.width, e.height),
          i.drawImage(s, 0, 0, e.width, e.height),
          e.toBlob((u) => {
            let p = URL.createObjectURL(u);
            o(p);
          }, "image/png");
      }),
        (s.onerror = (c) => {
          console.warn("Resize error..."), a(c);
        });
    });
  return (s.src = URL.createObjectURL(r)), n;
}
var S = class extends Error {
    constructor(t, e, i, s, n) {
      super();
      (this.name = "UploadClientError"),
        (this.message = t),
        (this.code = e),
        (this.request = i),
        (this.response = s),
        (this.headers = n),
        Object.setPrototypeOf(this, S.prototype);
    }
  },
  $t = (r = "Request canceled") => {
    let t = new S(r);
    return (t.isCancel = !0), t;
  },
  tt = (r, t) => {
    r &&
      (r.aborted
        ? Promise.resolve().then(t)
        : r.addEventListener("abort", () => t(), { once: !0 }));
  },
  O = ({
    method: r,
    url: t,
    data: e,
    headers: i = {},
    signal: s,
    onProgress: n,
  }) =>
    new Promise((o, a) => {
      let c = new XMLHttpRequest(),
        u = (r == null ? void 0 : r.toUpperCase()) || "GET",
        p = !1;
      c.open(u, t),
        i &&
          Object.entries(i).forEach((d) => {
            let [v, f] = d;
            typeof f != "undefined" &&
              !Array.isArray(f) &&
              c.setRequestHeader(v, f);
          }),
        (c.responseType = "text"),
        tt(s, () => {
          (p = !0), c.abort(), a($t());
        }),
        (c.onload = () => {
          if (c.status != 200)
            a(new Error(`Error ${c.status}: ${c.statusText}`));
          else {
            let d = {
                method: u,
                url: t,
                data: e,
                headers: i || void 0,
                signal: s,
                onProgress: n,
              },
              v = c
                .getAllResponseHeaders()
                .trim()
                .split(/[\r\n]+/),
              f = {};
            v.forEach(function (A) {
              let m = A.split(": "),
                x = m.shift(),
                M = m.join(": ");
              x && typeof x != "undefined" && (f[x] = M);
            });
            let g = c.response,
              b = c.status;
            o({ request: d, data: g, headers: f, status: b });
          }
        }),
        (c.onerror = () => {
          p || a(new Error("Network error"));
        }),
        n &&
          typeof n == "function" &&
          (c.upload.onprogress = (d) => {
            n({ value: d.loaded / d.total });
          }),
        e ? c.send(e) : c.send();
    });
function Te(r) {
  return r;
}
var Ee = Te,
  Se = () => new FormData(),
  ke = (r) => r[0] === "file";
function It(r) {
  let t = Se();
  for (let e of r)
    if (Array.isArray(e[1]))
      e[1].forEach((i) => i && t.append(e[0] + "[]", `${i}`));
    else if (ke(e)) {
      let i = e[2],
        s = Ee(e[1]);
      t.append(e[0], s, i);
    } else e[1] != null && t.append(e[0], `${e[1]}`);
  return t;
}
var Jt = (r, t) =>
    typeof t != "undefined" ? `${r}=${encodeURIComponent(t)}` : null,
  $e = (r) =>
    Object.entries(r)
      .reduce(
        (t, [e, i]) =>
          t.concat(Array.isArray(i) ? i.map((s) => Jt(`${e}[]`, s)) : Jt(e, i)),
        []
      )
      .filter((t) => !!t)
      .join("&"),
  j = (r, t, e) =>
    [r, t, e && Object.keys(e).length > 0 ? "?" : "", e && $e(e)]
      .filter(Boolean)
      .join(""),
  C = {
    baseCDN: "https://ucarecdn.com",
    baseURL: "https://upload.uploadcare.com",
    maxContentLength: 50 * 1024 * 1024,
    retryThrottledRequestMaxTimes: 1,
    multipartMinFileSize: 25 * 1024 * 1024,
    multipartChunkSize: 5 * 1024 * 1024,
    multipartMinLastPartSize: 1024 * 1024,
    maxConcurrentRequests: 4,
    multipartMaxAttempts: 3,
    pollingTimeoutMilliseconds: 1e4,
    pusherKey: "79ae88bd931ea68464d9",
  },
  Ie = "application/octet-stream",
  Yt = "original",
  Ue = "2.0.0";
function D({ userAgent: r, publicKey: t = "", integration: e = "" } = {}) {
  let i = "UploadcareUploadClient",
    s = Ue,
    n = "JavaScript";
  if (typeof r == "string") return r;
  if (typeof r == "function")
    return r({
      publicKey: t,
      libraryName: i,
      libraryVersion: s,
      languageName: n,
      integration: e,
    });
  let o = [i, s, t].filter(Boolean).join("/"),
    a = [n, e].filter(Boolean).join("; ");
  return `${o} (${a})`;
}
var Be = /\W|_/g;
function Re(r) {
  return r
    .split(Be)
    .map(
      (t, e) =>
        t.charAt(0)[e > 0 ? "toUpperCase" : "toLowerCase"]() + t.slice(1)
    )
    .join("");
}
function U(r) {
  return !r || typeof r != "object"
    ? r
    : Object.keys(r).reduce(
        (t, e) => ((t[Re(e)] = typeof r[e] == "object" ? U(r[e]) : r[e]), t),
        {}
      );
}
var Oe = (r) => new Promise((t) => setTimeout(t, r)),
  Me = { factor: 2, time: 100 };
function Kt(r, t = Me) {
  let e = 0;
  function i(s) {
    let n = Math.round(t.time * Math.pow(t.factor, e));
    return s({
      attempt: e,
      retry: (a) => Oe(a != null ? a : n).then(() => ((e += 1), i(s))),
    });
  }
  return i(r);
}
var Le = "RequestThrottledError",
  Pe = 15e3;
function je(r) {
  let { headers: t } = r || {};
  return (t && Number.parseInt(t["x-throttle-wait-seconds"]) * 1e3) || Pe;
}
function N(r, t) {
  return Kt(({ attempt: e, retry: i }) =>
    r().catch((s) => {
      if ("response" in s && (s == null ? void 0 : s.code) === Le && e < t)
        return i(je(s));
      throw s;
    })
  );
}
function De(
  r,
  {
    publicKey: t,
    fileName: e,
    baseURL: i = C.baseURL,
    secureSignature: s,
    secureExpire: n,
    store: o,
    signal: a,
    onProgress: c,
    source: u = "local",
    integration: p,
    userAgent: d,
    retryThrottledRequestMaxTimes: v = C.retryThrottledRequestMaxTimes,
  }
) {
  return N(() => {
    var f;
    return O({
      method: "POST",
      url: j(i, "/base/", { jsonerrors: 1 }),
      headers: {
        "X-UC-User-Agent": D({ publicKey: t, integration: p, userAgent: d }),
      },
      data: It([
        [
          "file",
          r,
          (f = e != null ? e : r.name) !== null && f !== void 0 ? f : Yt,
        ],
        ["UPLOADCARE_PUB_KEY", t],
        ["UPLOADCARE_STORE", typeof o == "undefined" ? "auto" : o ? 1 : 0],
        ["signature", s],
        ["expire", n],
        ["source", u],
      ]),
      signal: a,
      onProgress: c,
    }).then(({ data: g, headers: b, request: A }) => {
      let m = U(JSON.parse(g));
      if ("error" in m)
        throw new S(m.error.content, m.error.errorCode, A, m, b);
      return m;
    });
  }, v);
}
var Ut;
(function (r) {
  (r.Token = "token"), (r.FileInfo = "file_info");
})(Ut || (Ut = {}));
function Ne(
  r,
  {
    publicKey: t,
    baseURL: e = C.baseURL,
    store: i,
    fileName: s,
    checkForUrlDuplicates: n,
    saveUrlForRecurrentUploads: o,
    secureSignature: a,
    secureExpire: c,
    source: u = "url",
    signal: p,
    integration: d,
    userAgent: v,
    retryThrottledRequestMaxTimes: f = C.retryThrottledRequestMaxTimes,
  }
) {
  return N(
    () =>
      O({
        method: "POST",
        headers: {
          "X-UC-User-Agent": D({ publicKey: t, integration: d, userAgent: v }),
        },
        url: j(e, "/from_url/", {
          jsonerrors: 1,
          pub_key: t,
          source_url: r,
          store: typeof i == "undefined" ? "auto" : i ? 1 : void 0,
          filename: s,
          check_URL_duplicates: n ? 1 : void 0,
          save_URL_duplicates: o ? 1 : void 0,
          signature: a,
          expire: c,
          source: u,
        }),
        signal: p,
      }).then(({ data: g, headers: b, request: A }) => {
        let m = U(JSON.parse(g));
        if ("error" in m)
          throw new S(m.error.content, m.error.errorCode, A, m, b);
        return m;
      }),
    f
  );
}
var k;
(function (r) {
  (r.Unknown = "unknown"),
    (r.Waiting = "waiting"),
    (r.Progress = "progress"),
    (r.Error = "error"),
    (r.Success = "success");
})(k || (k = {}));
var Fe = (r) => "status" in r && r.status === k.Error;
function Xe(
  r,
  {
    publicKey: t,
    baseURL: e = C.baseURL,
    signal: i,
    integration: s,
    userAgent: n,
    retryThrottledRequestMaxTimes: o = C.retryThrottledRequestMaxTimes,
  } = {}
) {
  return N(
    () =>
      O({
        method: "GET",
        headers: t
          ? {
              "X-UC-User-Agent": D({
                publicKey: t,
                integration: s,
                userAgent: n,
              }),
            }
          : void 0,
        url: j(e, "/from_url/status/", { jsonerrors: 1, token: r }),
        signal: i,
      }).then(({ data: a, headers: c, request: u }) => {
        let p = U(JSON.parse(a));
        if ("error" in p && !Fe(p))
          throw new S(p.error.content, void 0, u, p, c);
        return p;
      }),
    o
  );
}
function Qt(
  r,
  {
    publicKey: t,
    baseURL: e = C.baseURL,
    signal: i,
    source: s,
    integration: n,
    userAgent: o,
    retryThrottledRequestMaxTimes: a = C.retryThrottledRequestMaxTimes,
  }
) {
  return N(
    () =>
      O({
        method: "GET",
        headers: {
          "X-UC-User-Agent": D({ publicKey: t, integration: n, userAgent: o }),
        },
        url: j(e, "/info/", {
          jsonerrors: 1,
          pub_key: t,
          file_id: r,
          source: s,
        }),
        signal: i,
      }).then(({ data: c, headers: u, request: p }) => {
        let d = U(JSON.parse(c));
        if ("error" in d)
          throw new S(d.error.content, d.error.errorCode, p, d, u);
        return d;
      }),
    a
  );
}
function Ve(
  r,
  {
    publicKey: t,
    contentType: e,
    fileName: i,
    multipartChunkSize: s = C.multipartChunkSize,
    baseURL: n = "",
    secureSignature: o,
    secureExpire: a,
    store: c,
    signal: u,
    source: p = "local",
    integration: d,
    userAgent: v,
    retryThrottledRequestMaxTimes: f = C.retryThrottledRequestMaxTimes,
  }
) {
  return N(
    () =>
      O({
        method: "POST",
        url: j(n, "/multipart/start/", { jsonerrors: 1 }),
        headers: {
          "X-UC-User-Agent": D({ publicKey: t, integration: d, userAgent: v }),
        },
        data: It([
          ["filename", i != null ? i : Yt],
          ["size", r],
          ["content_type", e != null ? e : Ie],
          ["part_size", s],
          ["UPLOADCARE_STORE", c ? "" : "auto"],
          ["UPLOADCARE_PUB_KEY", t],
          ["signature", o],
          ["expire", a],
          ["source", p],
        ]),
        signal: u,
      }).then(({ data: g, headers: b, request: A }) => {
        let m = U(JSON.parse(g));
        if ("error" in m)
          throw new S(m.error.content, m.error.errorCode, A, m, b);
        return (m.parts = Object.keys(m.parts).map((x) => m.parts[x])), m;
      }),
    f
  );
}
function He(r, t, { signal: e, onProgress: i }) {
  return O({ method: "PUT", url: t, data: r, onProgress: i, signal: e })
    .then((s) => (i && i({ value: 1 }), s))
    .then(({ status: s }) => ({ code: s }));
}
function ze(
  r,
  {
    publicKey: t,
    baseURL: e = C.baseURL,
    source: i = "local",
    signal: s,
    integration: n,
    userAgent: o,
    retryThrottledRequestMaxTimes: a = C.retryThrottledRequestMaxTimes,
  }
) {
  return N(
    () =>
      O({
        method: "POST",
        url: j(e, "/multipart/complete/", { jsonerrors: 1 }),
        headers: {
          "X-UC-User-Agent": D({ publicKey: t, integration: n, userAgent: o }),
        },
        data: It([
          ["uuid", r],
          ["UPLOADCARE_PUB_KEY", t],
          ["source", i],
        ]),
        signal: s,
      }).then(({ data: c, headers: u, request: p }) => {
        let d = U(JSON.parse(c));
        if ("error" in d)
          throw new S(d.error.content, d.error.errorCode, p, d, u);
        return d;
      }),
    a
  );
}
var G = class {
    constructor(t, { baseCDN: e, defaultEffects: i, fileName: s }) {
      (this.name = null),
        (this.size = null),
        (this.isStored = null),
        (this.isImage = null),
        (this.mimeType = null),
        (this.cdnUrl = null),
        (this.cdnUrlModifiers = null),
        (this.originalUrl = null),
        (this.originalFilename = null),
        (this.imageInfo = null),
        (this.videoInfo = null);
      let { uuid: n, s3Bucket: o } = t,
        a = o
          ? `https://${o}.s3.amazonaws.com/${n}/${t.filename}`
          : `${e}/${n}/`,
        c = i ? `-/${i}` : null,
        u = `${a}${c || ""}`,
        p = n ? a : null;
      (this.uuid = n),
        (this.name = s || t.filename),
        (this.size = t.size),
        (this.isStored = t.isStored),
        (this.isImage = t.isImage),
        (this.mimeType = t.mimeType),
        (this.cdnUrl = u),
        (this.cdnUrlModifiers = c),
        (this.originalUrl = p),
        (this.originalFilename = t.originalFilename),
        (this.imageInfo = U(t.imageInfo)),
        (this.videoInfo = U(t.videoInfo));
    }
  },
  We = 500,
  Zt = ({ check: r, interval: t = We, signal: e }) =>
    new Promise((i, s) => {
      let n;
      tt(e, () => {
        n && clearTimeout(n), s($t("Poll cancelled"));
      });
      let o = () => {
        try {
          Promise.resolve(r(e))
            .then((a) => {
              a ? i(a) : (n = setTimeout(o, t));
            })
            .catch((a) => s(a));
        } catch (a) {
          s(a);
        }
      };
      n = setTimeout(o, 0);
    });
function Bt({
  file: r,
  publicKey: t,
  baseURL: e,
  source: i,
  integration: s,
  userAgent: n,
  retryThrottledRequestMaxTimes: o,
  signal: a,
  onProgress: c,
}) {
  return Zt({
    check: (u) =>
      Qt(r, {
        publicKey: t,
        baseURL: e,
        signal: u,
        source: i,
        integration: s,
        userAgent: n,
        retryThrottledRequestMaxTimes: o,
      }).then((p) => (p.isReady ? p : (c && c({ value: 1 }), !1))),
    signal: a,
  });
}
var Ge = (
    r,
    {
      publicKey: t,
      fileName: e,
      baseURL: i,
      secureSignature: s,
      secureExpire: n,
      store: o,
      signal: a,
      onProgress: c,
      source: u,
      integration: p,
      userAgent: d,
      retryThrottledRequestMaxTimes: v,
      baseCDN: f,
    }
  ) =>
    De(r, {
      publicKey: t,
      fileName: e,
      baseURL: i,
      secureSignature: s,
      secureExpire: n,
      store: o,
      signal: a,
      onProgress: c,
      source: u,
      integration: p,
      userAgent: d,
      retryThrottledRequestMaxTimes: v,
    })
      .then(({ file: g }) =>
        Bt({
          file: g,
          publicKey: t,
          baseURL: i,
          source: u,
          integration: p,
          userAgent: d,
          retryThrottledRequestMaxTimes: v,
          onProgress: c,
          signal: a,
        })
      )
      .then((g) => new G(g, { baseCDN: f })),
  { AbortController: qe, AbortSignal: Fi } =
    typeof self != "undefined"
      ? self
      : typeof window != "undefined"
      ? window
      : void 0,
  Je = (r, { signal: t } = {}) => {
    let e = null,
      i = null,
      s = r.map(() => new qe()),
      n = (o) => () => {
        (i = o), s.forEach((a, c) => c !== o && a.abort());
      };
    return (
      tt(t, () => {
        s.forEach((o) => o.abort());
      }),
      Promise.all(
        r.map((o, a) => {
          let c = n(a);
          return Promise.resolve()
            .then(() => o({ stopRace: c, signal: s[a].signal }))
            .then((u) => (c(), u))
            .catch((u) => ((e = u), null));
        })
      ).then((o) => {
        if (i === null) throw e;
        return o[i];
      })
    );
  },
  Ye = window.WebSocket,
  te = class {
    constructor() {
      this.events = Object.create({});
    }
    emit(t, e) {
      var i;
      (i = this.events[t]) === null || i === void 0 || i.forEach((s) => s(e));
    }
    on(t, e) {
      (this.events[t] = this.events[t] || []), this.events[t].push(e);
    }
    off(t, e) {
      e
        ? (this.events[t] = this.events[t].filter((i) => i !== e))
        : (this.events[t] = []);
    }
  },
  Ke = (r, t) =>
    Object.assign(
      r === "success"
        ? { status: k.Success }
        : r === "progress"
        ? { status: k.Progress }
        : { status: k.Error },
      t
    ),
  ee = class {
    constructor(t, e = 3e4) {
      (this.ws = void 0),
        (this.queue = []),
        (this.isConnected = !1),
        (this.subscribers = 0),
        (this.emmitter = new te()),
        (this.disconnectTimeoutId = null),
        (this.key = t),
        (this.disconnectTime = e);
    }
    connect() {
      if (
        (this.disconnectTimeoutId && clearTimeout(this.disconnectTimeoutId),
        !this.isConnected && !this.ws)
      ) {
        let t = `wss://ws.pusherapp.com/app/${this.key}?protocol=5&client=js&version=1.12.2`;
        (this.ws = new Ye(t)),
          this.ws.addEventListener("error", (e) => {
            this.emmitter.emit("error", new Error(e.message));
          }),
          this.emmitter.on("connected", () => {
            (this.isConnected = !0),
              this.queue.forEach((e) => this.send(e.event, e.data)),
              (this.queue = []);
          }),
          this.ws.addEventListener("message", (e) => {
            let i = JSON.parse(e.data.toString());
            switch (i.event) {
              case "pusher:connection_established": {
                this.emmitter.emit("connected", void 0);
                break;
              }
              case "pusher:ping": {
                this.send("pusher:pong", {});
                break;
              }
              case "progress":
              case "success":
              case "fail":
                this.emmitter.emit(i.channel, Ke(i.event, JSON.parse(i.data)));
            }
          });
      }
    }
    disconnect() {
      let t = () => {
        var e;
        (e = this.ws) === null || e === void 0 || e.close(),
          (this.ws = void 0),
          (this.isConnected = !1);
      };
      this.disconnectTime
        ? (this.disconnectTimeoutId = setTimeout(() => {
            t();
          }, this.disconnectTime))
        : t();
    }
    send(t, e) {
      var i;
      let s = JSON.stringify({ event: t, data: e });
      (i = this.ws) === null || i === void 0 || i.send(s);
    }
    subscribe(t, e) {
      (this.subscribers += 1), this.connect();
      let i = `task-status-${t}`,
        s = { event: "pusher:subscribe", data: { channel: i } };
      this.emmitter.on(i, e),
        this.isConnected ? this.send(s.event, s.data) : this.queue.push(s);
    }
    unsubscribe(t) {
      this.subscribers -= 1;
      let e = `task-status-${t}`,
        i = { event: "pusher:unsubscribe", data: { channel: e } };
      this.emmitter.off(e),
        this.isConnected
          ? this.send(i.event, i.data)
          : (this.queue = this.queue.filter((s) => s.data.channel !== e)),
        this.subscribers === 0 && this.disconnect();
    }
    onError(t) {
      return this.emmitter.on("error", t), () => this.emmitter.off("error", t);
    }
  },
  Rt = null,
  Ot = (r) => {
    if (!Rt) {
      let t = typeof window == "undefined" ? 0 : 3e4;
      Rt = new ee(r, t);
    }
    return Rt;
  },
  Qe = (r) => {
    Ot(r).connect();
  };
function Ze({
  token: r,
  publicKey: t,
  baseURL: e,
  integration: i,
  userAgent: s,
  retryThrottledRequestMaxTimes: n,
  onProgress: o,
  signal: a,
}) {
  return Zt({
    check: (c) =>
      Xe(r, {
        publicKey: t,
        baseURL: e,
        integration: i,
        userAgent: s,
        retryThrottledRequestMaxTimes: n,
        signal: c,
      }).then((u) => {
        switch (u.status) {
          case k.Error:
            return new S(u.error, u.errorCode);
          case k.Waiting:
            return !1;
          case k.Unknown:
            return new S(`Token "${r}" was not found.`);
          case k.Progress:
            return o && o({ value: u.done / u.total }), !1;
          case k.Success:
            return o && o({ value: u.done / u.total }), u;
          default:
            throw new Error("Unknown status");
        }
      }),
    signal: a,
  });
}
var ti = ({ token: r, pusherKey: t, signal: e, onProgress: i }) =>
    new Promise((s, n) => {
      let o = Ot(t),
        a = o.onError(n),
        c = () => {
          a(), o.unsubscribe(r);
        };
      tt(e, () => {
        c(), n($t("pusher cancelled"));
      }),
        o.subscribe(r, (u) => {
          switch (u.status) {
            case k.Progress: {
              i && i({ value: u.done / u.total });
              break;
            }
            case k.Success: {
              c(), i && i({ value: u.done / u.total }), s(u);
              break;
            }
            case k.Error:
              c(), n(new S(u.msg, u.error_code));
          }
        });
    }),
  ei = (
    r,
    {
      publicKey: t,
      fileName: e,
      baseURL: i,
      baseCDN: s,
      checkForUrlDuplicates: n,
      saveUrlForRecurrentUploads: o,
      secureSignature: a,
      secureExpire: c,
      store: u,
      signal: p,
      onProgress: d,
      source: v,
      integration: f,
      userAgent: g,
      retryThrottledRequestMaxTimes: b,
      pusherKey: A = C.pusherKey,
    }
  ) =>
    Promise.resolve(Qe(A))
      .then(() =>
        Ne(r, {
          publicKey: t,
          fileName: e,
          baseURL: i,
          checkForUrlDuplicates: n,
          saveUrlForRecurrentUploads: o,
          secureSignature: a,
          secureExpire: c,
          store: u,
          signal: p,
          source: v,
          integration: f,
          userAgent: g,
          retryThrottledRequestMaxTimes: b,
        })
      )
      .catch((m) => {
        let x = Ot(A);
        return x == null || x.disconnect(), Promise.reject(m);
      })
      .then((m) =>
        m.type === Ut.FileInfo
          ? m
          : Je(
              [
                ({ signal: x }) =>
                  Ze({
                    token: m.token,
                    publicKey: t,
                    baseURL: i,
                    integration: f,
                    userAgent: g,
                    retryThrottledRequestMaxTimes: b,
                    onProgress: d,
                    signal: x,
                  }),
                ({ signal: x }) =>
                  ti({
                    token: m.token,
                    pusherKey: A,
                    signal: x,
                    onProgress: d,
                  }),
              ],
              { signal: p }
            )
      )
      .then((m) => {
        if (m instanceof S) throw m;
        return m;
      })
      .then((m) =>
        Bt({
          file: m.uuid,
          publicKey: t,
          baseURL: i,
          integration: f,
          userAgent: g,
          retryThrottledRequestMaxTimes: b,
          onProgress: d,
          signal: p,
        })
      )
      .then((m) => new G(m, { baseCDN: s })),
  ii = (
    r,
    {
      publicKey: t,
      fileName: e,
      baseURL: i,
      signal: s,
      onProgress: n,
      source: o,
      integration: a,
      userAgent: c,
      retryThrottledRequestMaxTimes: u,
      baseCDN: p,
    }
  ) =>
    Qt(r, {
      publicKey: t,
      baseURL: i,
      signal: s,
      source: o,
      integration: a,
      userAgent: c,
      retryThrottledRequestMaxTimes: u,
    })
      .then((d) => new G(d, { baseCDN: p, fileName: e }))
      .then((d) => (n && n({ value: 1 }), d)),
  Mt = (r) =>
    r !== void 0 &&
    ((typeof Blob != "undefined" && r instanceof Blob) ||
      (typeof File != "undefined" && r instanceof File) ||
      (typeof Buffer != "undefined" && r instanceof Buffer)),
  si = (r) => {
    let t = "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}",
      e = new RegExp(t);
    return !Mt(r) && e.test(r);
  },
  ri = (r) => {
    let t = "^(?:\\w+:)?\\/\\/([^\\s\\.]+\\.\\S{2}|localhost[\\:?\\d]*)\\S*$",
      e = new RegExp(t);
    return !Mt(r) && e.test(r);
  },
  ie = (r) => r.length || r.size,
  ni = (r, t = C.multipartMinFileSize) => r >= t,
  oi = (r, t, e, i) => {
    let s = i * t,
      n = Math.min(s + i, e);
    return r.slice(s, n);
  };
function ai(r, t, e) {
  return (i) => oi(r, i, t, e);
}
var li = (r, t) =>
    new Promise((e, i) => {
      let s = [],
        n = !1,
        o = t.length,
        a = [...t],
        c = () => {
          let u = t.length - a.length,
            p = a.shift();
          p &&
            p()
              .then((d) => {
                n || ((s[u] = d), (o -= 1), o ? c() : e(s));
              })
              .catch((d) => {
                (n = !0), i(d);
              });
        };
      for (let u = 0; u < r; u++) c();
    }),
  ci = (
    r,
    t,
    {
      publicKey: e,
      onProgress: i,
      signal: s,
      integration: n,
      multipartMaxAttempts: o,
    }
  ) =>
    Kt(({ attempt: a, retry: c }) =>
      He(r, t, {
        publicKey: e,
        onProgress: i,
        signal: s,
        integration: n,
      }).catch((u) => {
        if (a < o) return c();
        throw u;
      })
    ),
  ui = (
    r,
    {
      publicKey: t,
      fileName: e,
      fileSize: i,
      baseURL: s,
      secureSignature: n,
      secureExpire: o,
      store: a,
      signal: c,
      onProgress: u,
      source: p,
      integration: d,
      userAgent: v,
      retryThrottledRequestMaxTimes: f,
      contentType: g,
      multipartChunkSize: b = C.multipartChunkSize,
      maxConcurrentRequests: A = C.maxConcurrentRequests,
      multipartMaxAttempts: m = C.multipartMaxAttempts,
      baseCDN: x,
    }
  ) => {
    let M = i || ie(r),
      L,
      yt = ($, J) => {
        if (!u) return;
        L || (L = Array($).fill(0));
        let _t = (V) => V.reduce((Y, he) => Y + he, 0);
        return ({ value: V }) => {
          (L[J] = V), u({ value: _t(L) / $ });
        };
      };
    return Ve(M, {
      publicKey: t,
      contentType: g,
      fileName: e != null ? e : r.name,
      baseURL: s,
      secureSignature: n,
      secureExpire: o,
      store: a,
      signal: c,
      source: p,
      integration: d,
      userAgent: v,
      retryThrottledRequestMaxTimes: f,
    })
      .then(({ uuid: $, parts: J }) => {
        let _t = ai(r, M, b);
        return Promise.all([
          $,
          li(
            A,
            J.map(
              (V, Y) => () =>
                ci(_t(Y), V, {
                  publicKey: t,
                  onProgress: yt(J.length, Y),
                  signal: c,
                  integration: d,
                  multipartMaxAttempts: m,
                })
            )
          ),
        ]);
      })
      .then(([$]) =>
        ze($, {
          publicKey: t,
          baseURL: s,
          source: p,
          integration: d,
          userAgent: v,
          retryThrottledRequestMaxTimes: f,
        })
      )
      .then(($) =>
        $.isReady
          ? $
          : Bt({
              file: $.uuid,
              publicKey: t,
              baseURL: s,
              source: p,
              integration: d,
              userAgent: v,
              retryThrottledRequestMaxTimes: f,
              onProgress: u,
              signal: c,
            })
      )
      .then(($) => new G($, { baseCDN: x }));
  };
function F(
  r,
  {
    publicKey: t,
    fileName: e,
    baseURL: i = C.baseURL,
    secureSignature: s,
    secureExpire: n,
    store: o,
    signal: a,
    onProgress: c,
    source: u,
    integration: p,
    userAgent: d,
    retryThrottledRequestMaxTimes: v,
    contentType: f,
    multipartChunkSize: g,
    multipartMaxAttempts: b,
    maxConcurrentRequests: A,
    baseCDN: m = C.baseCDN,
    checkForUrlDuplicates: x,
    saveUrlForRecurrentUploads: M,
    pusherKey: L,
  }
) {
  if (Mt(r)) {
    let yt = ie(r);
    return ni(yt)
      ? ui(r, {
          publicKey: t,
          contentType: f,
          multipartChunkSize: g,
          multipartMaxAttempts: b,
          fileName: e,
          baseURL: i,
          secureSignature: s,
          secureExpire: n,
          store: o,
          signal: a,
          onProgress: c,
          source: u,
          integration: p,
          userAgent: d,
          maxConcurrentRequests: A,
          retryThrottledRequestMaxTimes: v,
          baseCDN: m,
        })
      : Ge(r, {
          publicKey: t,
          fileName: e,
          baseURL: i,
          secureSignature: s,
          secureExpire: n,
          store: o,
          signal: a,
          onProgress: c,
          source: u,
          integration: p,
          userAgent: d,
          retryThrottledRequestMaxTimes: v,
          baseCDN: m,
        });
  }
  if (ri(r))
    return ei(r, {
      publicKey: t,
      fileName: e,
      baseURL: i,
      baseCDN: m,
      checkForUrlDuplicates: x,
      saveUrlForRecurrentUploads: M,
      secureSignature: s,
      secureExpire: n,
      store: o,
      signal: a,
      onProgress: c,
      source: u,
      integration: p,
      userAgent: d,
      retryThrottledRequestMaxTimes: v,
      pusherKey: L,
    });
  if (si(r))
    return ii(r, {
      publicKey: t,
      fileName: e,
      baseURL: i,
      signal: a,
      onProgress: c,
      source: u,
      integration: p,
      userAgent: d,
      retryThrottledRequestMaxTimes: v,
      baseCDN: m,
    });
  throw new TypeError(`File uploading from "${r}" is not supported`);
}
var Lt = class {
    constructor() {
      h(this, "caption", "");
      h(this, "text", "");
      h(this, "iconName", "");
      h(this, "isError", !1);
    }
  },
  et = class extends l {
    constructor() {
      super(...arguments);
      h(this, "init$", {
        iconName: "info",
        captionTxt: "Message caption",
        msgTxt: "Message...",
        "*message": null,
        onClose: () => {
          this.$["*message"] = null;
        },
      });
    }
    initCallback() {
      this.sub("*message", (t) => {
        t
          ? (this.setAttribute("active", ""),
            this.set$({
              captionTxt: t.caption,
              msgTxt: t.text,
              iconName: t.isError ? "error" : "info",
            }),
            t.isError
              ? this.setAttribute("error", "")
              : this.removeAttribute("error"))
          : this.removeAttribute("active");
      });
    }
  };
et.template = `
<div .heading>
  <uc-icon set="@name: iconName"></uc-icon>
  <div .caption set="textContent: captionTxt"></div>
  <button set="onclick: onClose">
    <uc-icon name="close"></uc-icon>
  </button>
</div>
<div .msg set="textContent: msgTxt"></div>
`;
var Pt = "data:image/svg+xml;base64,";
function se(r = "#fff", t = "rgba(0, 0, 0, .1)") {
  return (
    Pt +
    btoa(`<svg height="20" width="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="20" height="20" fill="${r}" />
    <rect x="0" y="0" width="10" height="10" fill="${t}" />
    <rect x="10" y="10" width="10" height="10" fill="${t}" />
  </svg>`)
  );
}
function re(r = "rgba(0, 0, 0, .1)") {
  return (
    Pt +
    btoa(`<svg height="10" width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="10" x2="10" y2="0" stroke="${r}" />
  </svg>`)
  );
}
function ne() {
  return (
    Pt +
    btoa(`
    <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#a)">
        <path d="m10 8.00298 11-.00029 5 4.99711v15.0027l-16 .0002V8.00298Z" fill="#fff"/>
      </g>
      <g filter="url(#b)">
        <path d="m21 8 5 5h-5V8Z" fill="#fff"/>
      </g>
      <defs>
        <filter id="a" x="8" y="6.50269" width="20" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy=".5"/>
          <feGaussianBlur stdDeviation="1"/>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/>
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2684_2129"/>
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_2684_2129" result="shape"/>
        </filter>
        <filter id="b" x="19" y="7" width="8" height="8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-.5" dy=".5"/>
          <feGaussianBlur stdDeviation=".75"/>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2684_2129"/>
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_2684_2129" result="shape"/>
        </filter>
      </defs>
    </svg>`)
  );
}
var I = class extends l {
  constructor() {
    super(...arguments);
    h(this, "pauseRender", !0);
    h(this, "init$", {
      fileName: "",
      thumb: "",
      thumbUrl: "",
      progressWidth: 0,
      progressOpacity: 1,
      notImage: !0,
      badgeIcon: "check",
      onEdit: () => {
        this.set$({
          "*focusedEntry": this.entry,
          "*currentActivity": l.activities.DETAILS,
        });
      },
      onRemove: () => {
        this.uploadCollection.remove(this.entry.__ctxId);
      },
      "*focusedEntry": null,
      "*uploadTrigger": null,
    });
  }
  _observerCallback(t) {
    let [e] = t;
    e.intersectionRatio === 0
      ? (clearTimeout(this._thumbTimeoutId), (this._thumbTimeoutId = void 0))
      : this._thumbTimeoutId ||
        (this._thumbTimeoutId = setTimeout(
          () => this._generateThumbnail(),
          100
        ));
  }
  _generateThumbnail() {
    var t;
    this.$.thumbUrl ||
      (((t = this.file) == null ? void 0 : t.type.includes("image"))
        ? qt(this.file, 76).then((e) => {
            this.$.thumbUrl = `url(${e})`;
          })
        : (this.$.thumbUrl = `url(${ne()})`));
  }
  _revokeThumbUrl() {
    var t;
    ((t = this.$.thumbUrl) == null ? void 0 : t.startsWith("blob:")) &&
      URL.revokeObjectURL(this.$.thumbUrl);
  }
  initCallback() {
    this.defineAccessor("entry-id", (t) => {
      var e;
      !t ||
        ((this.entry =
          (e = this.uploadCollection) == null ? void 0 : e.read(t)),
        this.entry.subscribe("fileName", (i) => {
          this.$.fileName = i || this.l10n("file-no-name");
        }),
        this.entry.subscribe("uuid", (i) => {
          if (!i) return;
          this._observer.unobserve(this), this.setAttribute("loaded", "");
          let s = `https://ucarecdn.com/${i}/`;
          this._revokeThumbUrl(),
            (this.$.thumbUrl = `url(${s}-/scale_crop/76x76/)`);
        }),
        this.entry.subscribe("transformationsUrl", (i) => {
          !i ||
            (this._revokeThumbUrl(),
            (this.$.thumbUrl = `url(${i}-/scale_crop/76x76/)`));
        }),
        (this.file = this.entry.getValue("file")),
        this.config.CONFIRM_UPLOAD || this.upload(),
        (this._observer = new window.IntersectionObserver(
          this._observerCallback.bind(this),
          {
            root: this.parentElement,
            rootMargin: "50% 0px 50% 0px",
            threshold: [0, 1],
          }
        )),
        this._observer.observe(this));
    }),
      (this.$["*uploadTrigger"] = null),
      I.activeInstances.add(this),
      this.sub("*uploadTrigger", (t) => {
        !t || !this.isConnected || this.upload();
      }),
      (this.onclick = () => {
        I.activeInstances.forEach((t) => {
          t === this
            ? t.setAttribute("focused", "")
            : t.removeAttribute("focused");
        });
      });
  }
  destroyCallback() {
    I.activeInstances.delete(this),
      this._observer.unobserve(this),
      clearTimeout(this._thumbTimeoutId);
  }
  async upload() {
    if (this.hasAttribute("loaded") || this.entry.getValue("uuid")) return;
    (this.$.progressWidth = 0),
      this.removeAttribute("focused"),
      this.removeAttribute("error"),
      this.setAttribute("uploading", "");
    let t = {};
    Object.keys(this.config).includes("STORE") &&
      (t.store = !!this.config.STORE);
    try {
      let e = await F(this.file, {
        ...t,
        publicKey: this.config.PUBKEY,
        onProgress: (i) => {
          let s = i.value * 100;
          (this.$.progressWidth = s + "%"),
            this.entry.setValue("uploadProgress", s);
        },
      });
      (this.$.progressOpacity = 0),
        this.setAttribute("loaded", ""),
        this.removeAttribute("uploading"),
        (this.$.badgeIcon = "badge-success"),
        this.entry.setMultipleValues({ uuid: e.uuid, uploadProgress: 100 });
    } catch (e) {
      this.setAttribute("error", ""), this.removeAttribute("uploading");
      let i = new Lt();
      (i.caption = this.l10n("upload-error") + ": " + this.file.name),
        (i.text = e),
        (i.isError = !0),
        this.set$({ badgeIcon: "badge-error", "*message": i }),
        this.entry.setValue("uploadErrorMsg", e);
    }
  }
};
I.template = `
<div
  .thumb
  set="style.backgroundImage: thumbUrl">
  <div .badge>
    <uc-icon set="@name: badgeIcon"></uc-icon>
  </div>
</div>
<div .file-name set="textContent: fileName"></div>
<button .edit-btn set="onclick: onEdit;">
  <uc-icon name="edit-file"></uc-icon>
</button>
<button .remove-btn set="onclick: onRemove;">
  <uc-icon name="remove-file"></uc-icon>
</button>
<div
  .progress
  set="style.width: progressWidth; style.opacity: progressOpacity">
</div>
`;
I.activeInstances = new Set();
I.bindAttributes({ "entry-id": null });
var it = class extends l {
  constructor() {
    super(...arguments);
    h(this, "init$", {
      "*modalActive": !1,
      "*modalHeaderHidden": !1,
      "*modalDesiredWidth": "100%",
      "*modalDesiredHeight": "100%",
      "*modalDesiredMobileWidth": "100%",
      "*modalDesiredMobileHeight": "100%",
      closeClicked: () => {
        this.$["*currentActivity"] = "";
      },
    });
  }
  initCallback() {
    this.sub("*currentActivity", (t) => {
      this.set$({ "*modalActive": !!t });
    }),
      this.sub("*uploadList", (t) => {
        !t.length &&
          this.$["*modalActive"] &&
          (this.$["*currentActivity"] = l.activities.SOURCE_SELECT);
      }),
      this.sub("*modalActive", (t) => {
        t ? this.setAttribute("active", "") : this.removeAttribute("active");
      }),
      this.sub("*modalDesiredWidth", (t) => {
        this.style.setProperty("--modal-desired-w", t);
      }),
      this.sub("*modalDesiredHeight", (t) => {
        this.style.setProperty("--modal-desired-h", t);
      }),
      this.sub("*modalDesiredMobileWidth", (t) => {
        this.style.setProperty("--modal-desired-mobile-w", t);
      }),
      this.sub("*modalDesiredMobileHeight", (t) => {
        this.style.setProperty("--modal-desired-mobile-h", t);
      }),
      this.hasAttribute("strokes") &&
        (this.style.backgroundImage = `url(${re()})`);
  }
};
it.template = `
<div .dialog>
  <div .heading set="@hidden: *modalHeaderHidden">
    <uc-activity-icon></uc-activity-icon>
    <uc-activity-caption></uc-activity-caption>
    <button
      .close-btn
      set="onclick: closeClicked">
      <uc-icon name="close"></uc-icon>
    </button>
  </div>
  <div .content>
    <slot></slot>
  </div>
</div>
`;
var st = class extends l {
  initCallback() {
    this.sub("*uploadList", (t) => {
      t.length || this.set$({ "*currentActivity": l.activities.SOURCE_SELECT });
    }),
      this.sub("*currentActivity", (t) => {
        t || this.set$({ "*currentActivity": l.activities.SOURCE_SELECT });
      });
  }
};
st.template = `
<slot></slot>
`;
var rt = class {
    constructor() {
      h(this, "captionL10nStr", "confirm-your-action");
      h(this, "messageL10Str", "are-you-sure");
      h(this, "confirmL10nStr", "yes");
      h(this, "denyL10nStr", "no");
    }
    confirmAction() {
      console.log("Confirmed");
    }
    denyAction() {
      this.historyBack();
    }
  },
  nt = class extends w {
    constructor() {
      super(...arguments);
      h(this, "activityType", l.activities.CONFIRMATION);
      h(this, "_defaults", new rt());
      h(this, "init$", {
        messageTxt: "",
        confirmBtnTxt: "",
        denyBtnTxt: "",
        "*confirmation": null,
        onConfirm: this._defaults.confirmAction,
        onDeny: this._defaults.denyAction.bind(this),
      });
    }
    initCallback() {
      super.initCallback(),
        this.set$({
          messageTxt: this.l10n(this._defaults.messageL10Str),
          confirmBtnTxt: this.l10n(this._defaults.confirmL10nStr),
          denyBtnTxt: this.l10n(this._defaults.denyL10nStr),
        }),
        this.sub("*confirmation", (t) => {
          !t ||
            this.set$({
              "*modalHeaderHidden": !0,
              "*currentActivity": l.activities.CONFIRMATION,
              "*modalCaption": this.l10n(t.captionL10nStr),
              messageTxt: this.l10n(t.messageL10Str),
              confirmBtnTxt: this.l10n(t.confirmL10nStr),
              denyBtnTxt: this.l10n(t.denyL10nStr),
              onDeny: () => {
                (this.$["*modalHeaderHidden"] = !1), t.denyAction();
              },
              onConfirm: () => {
                (this.$["*modalHeaderHidden"] = !1), t.confirmAction();
              },
            });
        });
    }
  };
nt.template = `
<div
  .message
  set="textContent: messageTxt">
</div>
<div .toolbar>
  <button
    .deny-btn
    .secondary-btn
    set="textContent: denyBtnTxt; onclick: onDeny">
  </button>
  <button
    .confirm-btn
    .primary-btn
    set="textContent: confirmBtnTxt; onclick: onConfirm">
  </button>
</div>
`;
var ot = class extends w {
  constructor() {
    super(...arguments);
    h(this, "activityType", l.activities.UPLOAD_LIST);
    h(this, "init$", {
      doneBtnHidden: !0,
      uploadBtnHidden: !1,
      uploadBtnDisabled: !1,
      hasFiles: !1,
      moreBtnDisabled: !this.config.MULTIPLE,
      onAdd: () => {
        this.$["*currentActivity"] = l.activities.SOURCE_SELECT;
      },
      onUpload: () => {
        this.set$({ "*uploadTrigger": {} });
      },
      onDone: () => {
        this.set$({ "*currentActivity": "" }), this.output();
      },
      onCancel: () => {
        let t = new rt();
        (t.confirmAction = () => {
          (this.$["*currentActivity"] = ""), this.uploadCollection.clearAll();
        }),
          (t.denyAction = () => {
            this.historyBack();
          }),
          (this.$["*confirmation"] = t);
      },
    });
    h(this, "_renderMap", Object.create(null));
  }
  onActivate() {
    super.onActivate(),
      this.set$({
        "*modalCaption": this.l10n("selected"),
        "*modalIcon": "local",
      });
  }
  initCallback() {
    super.initCallback(),
      this.uploadCollection.observe(() => {
        let t = this.uploadCollection.findItems((n) => !n.getValue("uuid")),
          e = this.uploadCollection.findItems(
            (n) => !n.getValue("uuid") && n.getValue("uploadProgress") > 0
          ),
          i = t.length === 0,
          s = e.length > 0;
        this.set$({
          uploadBtnHidden: i,
          uploadBtnDisabled: s,
          doneBtnHidden: !i,
        });
      }),
      this.sub("*uploadList", (t) => {
        (this.$.hasFiles = t.length > 0),
          t.forEach((i) => {
            if (!this._renderMap[i]) {
              let s = new I();
              this._renderMap[i] = s;
            }
          });
        for (let i in this._renderMap)
          t.includes(i) ||
            (this._renderMap[i].remove(), delete this._renderMap[i]);
        let e = document.createDocumentFragment();
        Object.values(this._renderMap).forEach((i) => e.appendChild(i)),
          this.ref.files.replaceChildren(e),
          Object.entries(this._renderMap).forEach(([i, s]) => {
            setTimeout(() => {
              (s["entry-id"] = i), s.render();
            });
          });
      });
  }
};
ot.template = `
<div .no-files set="@hidden: hasFiles">
  <slot name="empty"><span l10n="no-files"></span></slot>
</div>
<div .files ref="files"></div>
<div .toolbar>
  <button
    .cancel-btn
    .secondary-btn
    set="onclick: onCancel;"
    l10n="clear"></button>
  <div></div>
  <button
    .add-more-btn
    .secondary-btn
    set="onclick: onAdd; @disabled: moreBtnDisabled"
    l10n="add-more"></button>
  <button
    .upload-btn
    .primary-btn
    set="@hidden: uploadBtnHidden; onclick: onUpload; @disabled: uploadBtnDisabled"
    l10n="upload"></button>
    <button
    .done-btn
    .primary-btn
    set="@hidden: doneBtnHidden; onclick: onDone"
    l10n="done"></button>
</div>
`;
var at = class extends w {
  constructor() {
    super(...arguments);
    h(this, "activityType", l.activities.URL);
    h(this, "init$", {
      onUpload: async () => {
        let t = this.ref.input.value,
          e = this.config.PUBKEY,
          i = this.uploadCollection.add({ externalUrl: t }),
          s = await F(t, {
            publicKey: e,
            onProgress: (n) => {
              let o = n.value;
              i.setValue("uploadProgress", o);
            },
          });
        console.log(s),
          i.setMultipleValues({
            uuid: s.uuid,
            fileName: s.name,
            fileSize: s.size,
            isImage: s.isImage,
            mimeType: s.mimeType,
          }),
          (this.$["*currentActivity"] = l.activities.UPLOAD_LIST);
      },
      onCancel: () => {
        this.set$({ "*currentActivity": l.activities.SOURCE_SELECT });
      },
    });
  }
  onActivate() {
    super.onActivate(),
      this.set$({
        "*modalCaption": this.l10n("caption-from-url"),
        "*modalIcon": "url",
      });
  }
};
at.template = `
<input placeholder="https://..." .url-input type="text" ref="input" />
<button .url-upload-btn .primary-btn set="onclick: onUpload"></button>
<button
  .cancel-btn
  .secondary-btn
  set="onclick: onCancel"
  l10n="cancel">
</button>
`;
var lt = class extends w {
  constructor() {
    super(...arguments);
    h(this, "activityType", l.activities.CAMERA);
    h(this, "init$", {
      video: null,
      videoTransformCss: this.config.CAMERA_MIRROR ? "scaleX(-1)" : null,
      onCancel: () => {
        this.set$({ "*currentActivity": l.activities.SOURCE_SELECT });
      },
      onShot: () => {
        this._shot();
      },
    });
  }
  async _init() {
    let t = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
      audio: !1,
    };
    (this._canvas = document.createElement("canvas")),
      (this._ctx = this._canvas.getContext("2d")),
      (this._stream = await navigator.mediaDevices.getUserMedia(t)),
      (this.$.video = this._stream);
  }
  _shot() {
    (this._canvas.height = this.ref.video.videoHeight),
      (this._canvas.width = this.ref.video.videoWidth),
      this._ctx.drawImage(this.ref.video, 0, 0);
    let t = Date.now(),
      e = `camera-${t}.png`;
    this._canvas.toBlob((i) => {
      let s = new File([i], e, { lastModified: t, type: "image/png" });
      this.uploadCollection.add({
        file: s,
        fileName: e,
        fileSize: s.size,
        isImage: !0,
        mimeType: s.type,
      }),
        this.set$({ "*currentActivity": l.activities.UPLOAD_LIST });
    });
  }
  onActivate() {
    super.onActivate(),
      this._init(),
      this.set$({
        "*modalCaption": this.l10n("caption-camera"),
        "*modalIcon": "camera",
      });
  }
  onDeactivate() {
    var t;
    super.onDeactivate(),
      (t = this._stream) == null || t.getTracks()[0].stop(),
      (this.$.video = null);
  }
};
lt.template = `
<div .video-wrapper>
  <video
    autoplay
    playsinline
    set="srcObject: video; style.transform: videoTransformCss"
    ref="video">
  </video>
</div>
<div .toolbar>
  <button
    .cancel-btn
    .secondary-btn
    set="onclick: onCancel"
    l10n="cancel">
  </button>
  <button
    .shot-btn
    .primary-btn
    set="onclick: onShot"
    l10n="camera-shot">
  </button>
</div>
`;
var ct = class extends w {
  constructor() {
    super(...arguments);
    h(this, "activityType", l.activities.DETAILS);
    h(this, "init$", {
      fileSize: 0,
      fileName: "",
      cdnUrl: "",
      errorTxt: "",
      editBtnHidden: !0,
      onNameInput: null,
      "*focusedEntry": null,
      onBack: () => {
        this.historyBack();
      },
      onRemove: () => {
        this.uploadCollection.remove(this.entry.__ctxId), this.historyBack();
      },
      onEdit: () => {
        this.entry.getValue("uuid") &&
          (this.$["*currentActivity"] = l.activities.CLOUD_IMG_EDIT);
      },
    });
  }
  onActivate() {
    super.onActivate(),
      this.set$({ "*modalCaption": this.l10n("caption-edit-file") });
  }
  initCallback() {
    super.initCallback(),
      (this.eCanvas = this.ref.canvas),
      this.sub("*focusedEntry", (t) => {
        if (!t) return;
        this._entrySubs
          ? this._entrySubs.forEach((s) => {
              this._entrySubs.delete(s), s.remove();
            })
          : (this._entrySubs = new Set()),
          (this.entry = t);
        let e = t.getValue("file");
        e &&
          ((this._file = e),
          this._file.type.includes("image") &&
            !t.getValue("transformationsUrl") &&
            (this.eCanvas.setImageFile(this._file),
            this.set$({ editBtnHidden: !1 })));
        let i = (s, n) => {
          this._entrySubs.add(this.entry.subscribe(s, n));
        };
        i("fileName", (s) => {
          (this.$.fileName = s),
            (this.$.onNameInput = () => {
              Object.defineProperty(this._file, "name", {
                writable: !0,
                value: this.ref.file_name_input.value,
              });
            });
        }),
          i("fileSize", (s) => {
            this.$.fileSize = s;
          }),
          i("uuid", (s) => {
            s
              ? (this.$.cdnUrl = `https://ucarecdn.com/${s}/`)
              : (this.$.cdnUrl = "Not uploaded yet...");
          }),
          i("uploadErrorMsg", (s) => {
            this.$.errorTxt = s;
          }),
          i("externalUrl", (s) => {
            !s ||
              (this.entry.getValue("isImage") &&
                !this.entry.getValue("transformationsUrl") &&
                this.eCanvas.setImageUrl(this.$.cdnUrl));
          }),
          i("transformationsUrl", (s) => {
            !s ||
              (this.entry.getValue("isImage") && this.eCanvas.setImageUrl(s));
          });
      });
  }
};
ct.template = `
<div .wrapper>
  <uc-tabs
    tab-list="tab-view, tab-details">
    <div tab-ctx="tab-details" ref="details" .details>

      <div .info-block>
        <div .info-block_name l10n="file-name"></div>
        <input
          name="name-input"
          ref="file_name_input"
          set="value: fileName; oninput: onNameInput"
          type="text" />
      </div>

      <div .info-block>
        <div .info-block_name l10n="file-size"></div>
        <div set="textContent: fileSize"></div>
      </div>

      <div .info-block>
        <div .info-block_name l10n="cdn-url"></div>
        <a
          target="_blank"
          set="textContent: cdnUrl; @href: cdnUrl;"></a>
      </div>

      <div set="textContent: errorTxt;"></div>

    </div>

    <div tab-ctx="tab-view" ref="viewport" .viewport>
      <uc-editable-canvas
        tab-ctx="tab-view"
        ref="canvas">
      </uc-editable-canvas>
    </div>
  </uc-tabs>

  <div .toolbar>
    <button
      .secondary-btn
      .edit-btn
      set="onclick: onEdit; @hidden: editBtnHidden;">
      <uc-icon name="edit"></uc-icon>
      <span l10n="edit-image"></span>
    </button>
    <button
      .secondary-btn
      .remove-btn
      set="onclick: onRemove">
      <uc-icon name="remove"></uc-icon>
      <span l10n="remove-from-list"></span>
    </button>
    <div></div>
    <button
      .primary-btn
      .back-btn
      set="onclick: onBack">
      <span l10n="done"></span>
    </button>
  </div>
</div>
`;
var ut = class extends l {
  constructor() {
    super(...arguments);
    h(this, "init$", { cssWidth: 0, "*commonProgress": 0 });
  }
  initCallback() {
    this.sub("*commonProgress", (t) => {
      t === 0 || t === 100
        ? this.removeAttribute("active")
        : this.setAttribute("active", ""),
        (this.$.cssWidth = t + "%");
    });
  }
};
ut.template = `
<div
  .bar
  set="style.width: cssWidth">
</div>
`;
var oe = "http://www.w3.org/2000/svg",
  X = class {
    _syncSvgSize() {
      let t = this.svgGroupEl.getBoundingClientRect();
      R(this.svgEl, {
        viewBox: `0, 0, ${t.width}, ${t.height}`,
        width: t.width,
        height: t.height,
      });
    }
    _syncCanvas() {
      return new Promise((t, e) => {
        let i = URL.createObjectURL(
          new Blob([this.svgEl.outerHTML], { type: "image/svg+xml" })
        );
        (this.vImg.onload = () => {
          (this.can.height = this.vImg.height),
            (this.can.width = this.vImg.width),
            this.ctx.drawImage(
              this.vImg,
              0,
              0,
              this.vImg.width,
              this.vImg.height
            ),
            t();
        }),
          (this.vImg.onerror = () => {
            e();
          }),
          (this.vImg.src = i);
      });
    }
    _backSyncSvg() {
      return (
        (this.svgGroupEl.style.transform = null),
        (this.svgGroupEl.style.filter = null),
        R(this.svgEl, {
          viewBox: `0, 0, ${this.can.width}, ${this.can.height}`,
          width: this.can.width,
          height: this.can.height,
        }),
        R(this.svgImgEl, {
          href: this.can.toDataURL("image/png"),
          width: this.can.width,
          height: this.can.height,
        }),
        this._addedObjects.forEach((t) => {
          t.remove();
        }),
        new Promise((t, e) => {
          (this.svgImgEl.onload = () => {
            t();
          }),
            (this.svgImgEl.onerror = () => {
              e();
            });
        })
      );
    }
    async _syncAll() {
      this._syncSvgSize(), await this._syncCanvas(), await this._backSyncSvg();
    }
    constructor(t) {
      (this.can = t.canvas),
        (this.svgEl = t.svg),
        (this.svgGroupEl = t.svgGroup),
        (this.svgImgEl = t.svgImg),
        (this.vImg = new Image()),
        (this.ctx = t.canvCtx),
        (this.currentColor = X.defaultColor),
        (this._addedObjects = new Set()),
        window.setTimeout(() => {
          this._backSyncSvg();
        }, 100);
    }
    applyCss(t) {
      H(this.svgGroupEl, t);
    }
    getImg() {
      let t = new Image();
      return (
        (t.src = this.can.toDataURL("image/png")),
        new Promise((e, i) => {
          (t.onload = () => {
            e(t);
          }),
            (t.onerror = () => {
              i(t);
            });
        })
      );
    }
    rotate() {
      this.applyCss({
        "transform-origin": "0 0",
        transform: `rotate(90deg) translateY(-${this.can.height}px)`,
      }),
        this._syncAll();
    }
    flip(t) {
      this.applyCss({
        "transform-origin": "50% 50%",
        transform: `scale(${t === "vertical" ? "1, -1" : "-1, 1"})`,
      }),
        this._syncAll();
    }
    brightness(t) {
      this.applyCss({ filter: `brightness(${t}%)` });
    }
    contrast(t) {
      this.applyCss({ filter: `contrast(${t}%)` });
    }
    saturate(t) {
      this.applyCss({ filter: `saturate(${t}%)` });
    }
    setColor(t) {
      this.currentColor = t;
    }
    startText() {
      let t = (e) => {
        let i = document.createElementNS(oe, "text");
        R(i, { fill: this.currentColor, x: e.offsetX, y: e.offsetY }),
          (i.textContent = "TEXT"),
          this.svgGroupEl.appendChild(i),
          this._addedObjects.add(i),
          i.focus(),
          this.svgEl.removeEventListener("mousedown", t);
      };
      this.svgEl.addEventListener("mousedown", t);
    }
    stopText() {
      this.bake();
    }
    startDraw() {
      this.svgEl.addEventListener("mousedown", (t) => {
        let e = document.createElementNS(oe, "polyline");
        R(e, {
          fill: "none",
          stroke: this.currentColor,
          "stroke-width": "4px",
        }),
          this.svgGroupEl.appendChild(e),
          this._addedObjects.add(e);
        let i = [];
        this.svgEl.onmousemove = (s) => {
          i.push(`${s.offsetX},${s.offsetY}`),
            e.setAttribute("points", i.join(" "));
        };
      }),
        window.addEventListener("mouseup", () => {
          (this.svgEl.onmousemove = null), this.bake();
        }),
        window.addEventListener("mouseleave", () => {
          (this.svgEl.onmousemove = null), this.bake();
        });
    }
    removeMode(t) {}
    resize() {}
    crop() {}
    bake() {
      this._syncAll();
    }
    restore() {}
  };
X.defaultColor = "#f00";
var ht = class extends l {
  constructor() {
    super(...arguments);
    h(this, "init$", {
      cssLeft: "50%",
      caption: "CAPTION",
      barActive: !1,
      "*rangeValue": 100,
      onChange: () => {
        this.$["*rangeValue"] = this.ref.range.value;
      },
    });
  }
  initCallback() {
    [...this.attributes].forEach((t) => {
      ["style", "ref"].includes(t.name) ||
        this.ref.range.setAttribute(t.name, t.value);
    }),
      this.sub("*rangeValue", (t) => {
        let e = (t / this.ref.range.max) * 100;
        this.$.cssLeft = `${e}%`;
      });
  }
};
ht.template = `
<datalist id="range-values">
  <option value="0" label="min"></option>
  <option value="100" label="0"></option>
  <option value="200" label="max"></option>
</datalist>
<div .track>
  <div .bar set="style.width: cssLeft; @active: barActive"></div>
  <div .slider set="style.left: cssLeft"></div>
  <div .center></div>
  <div .caption set="textContent: caption; @text: caption"></div>
</div>
<input 
  type="range"
  ref="range"
  list="range-values" 
  set="@value: *rangeValue; oninput: onChange">
`;
var dt = class extends l {
  constructor() {
    super(...arguments);
    h(this, "init$", {
      inputOpacity: 0,
      "*selectedColor": "#f00",
      onChange: () => {
        this.$["*selectedColor"] = this.ref.input.value;
      },
    });
  }
};
dt.template = `
<input 
  ref="input"
  type="color" 
  set="oninput: onChange; style.opacity: inputOpacity">
<div 
  .current-color 
  set="style.backgroundColor: *selectedColor">
</div>
`;
var hi = [
  {
    action: "fullscreen",
    icon: "",
    l10n_name: "toggle-fullscreen",
    set: "@name: fsIcon",
  },
  { action: "rotate_cw", icon: "edit-rotate", l10n_name: "rotate", set: "" },
  {
    action: "flip_v",
    icon: "edit-flip-v",
    l10n_name: "flip-vertical",
    set: "",
  },
  {
    action: "flip_h",
    icon: "edit-flip-h",
    l10n_name: "flip-horizontal",
    set: "",
  },
  {
    action: "brightness",
    icon: "edit-brightness",
    l10n_name: "brightness",
    set: "",
  },
  { action: "contrast", icon: "edit-contrast", l10n_name: "contrast", set: "" },
  {
    action: "saturation",
    icon: "edit-saturation",
    l10n_name: "saturation",
    set: "",
  },
  { clr: !0 },
  { action: "text", icon: "edit-text", l10n_name: "text", set: "" },
  { action: "draw", icon: "edit-draw", l10n_name: "draw", set: "" },
  { action: "cancel", icon: "close", l10n_name: "cancel-edit", set: "" },
];
function di(r) {
  return `<button 
  action="${r.action}" 
  ref="${r.ref}"
  l10n="title:${r.l10n_name}">
  <uc-icon
    set="${r.set}" 
    name="${r.icon}">
  </uc-icon>
</button>`.trim();
}
var pi = `<uc-color 
  ref="color" 
  action="color"
  set="onchange: onColor" 
  l10n="title:select-color"></uc-color>`;
function ae() {
  return hi.reduce((r, t) => (r += t.clr ? pi : di(t)), "");
}
ht.reg("range");
dt.reg("color");
var jt = { FS: "fullscreen", EXIT: "fullscreen-exit" },
  pt = class extends l {
    constructor() {
      super(...arguments);
      h(this, "init$", {
        fsIcon: jt.FS,
        rangeActive: !1,
        rangeCaption: "",
        onBtnClick: (t) => {
          this.canMan.stopText(),
            (this.rangeCtx = null),
            this.set$({
              rangeActive: !1,
              rangeCaption: "",
              "*rangeValue": 100,
            });
          let e = t.target.closest("[action]");
          e &&
            (this.buttons.add(e),
            this.buttons.forEach((s) => {
              s === e
                ? s.setAttribute("current", "")
                : s.removeAttribute("current", "");
            }));
          let i = e.getAttribute("action");
          console.log(i), !!i && this.actionsMap[i]();
        },
      });
      h(this, "buttons", new Set());
      h(this, "editor", null);
    }
    get actionsMap() {
      return {
        fullscreen: () => {
          document.fullscreenElement === this.rMap.parent
            ? (document.exitFullscreen(), (this.$.fsIcon = jt.FS))
            : (this.rMap.parent.requestFullscreen(), (this.$.fsIcon = jt.EXIT));
        },
        rotate_cw: () => {
          this.canMan.rotate();
        },
        flip_v: () => {
          this.canMan.flip("vertical");
        },
        flip_h: () => {
          this.canMan.flip("horizontal");
        },
        brightness: () => {
          (this.rangeCtx = "brightness"),
            this.set$({
              rangeActive: !0,
              rangeCaption: this.l10n("brightness"),
            });
        },
        contrast: () => {
          (this.rangeCtx = "contrast"),
            this.set$({ rangeActive: !0, rangeCaption: this.l10n("contrast") });
        },
        saturation: () => {
          (this.rangeCtx = "saturate"),
            this.set$({
              rangeActive: !0,
              rangeCaption: this.l10n("saturation"),
            });
        },
        resize: () => {
          this.canMan.resize();
        },
        crop: () => {
          this.canMan.crop();
        },
        color: () => {
          this.ref.color.dispatchEvent(new MouseEvent("click"));
        },
        text: () => {
          this.canMan.startText();
        },
        draw: () => {
          this.canMan.startDraw();
        },
        cancel: () => {
          this.canMan.restore();
        },
      };
    }
    initCallback() {
      this.defineAccessor("refMap", (t) => {
        !t || ((this.rMap = t), (this.canMan = new X(t)), console.log(t));
      }),
        this.sub("*rangeValue", (t) => {
          var e, i;
          (i = (e = this.canMan) == null ? void 0 : e[this.rangeCtx]) == null ||
            i.call(e, t);
        }),
        this.sub("*selectedColor", (t) => {
          var e;
          (e = this.canMan) == null || e.setColor(t);
        });
    }
  };
pt.template = `
<div 
  .btns 
  ref="btns" 
  set="onclick: onBtnClick">${ae()}</div>
<uc-range 
  min="0" 
  max="200" 
  ref="range"
  set="@visible: rangeActive; $.caption: rangeCaption">
</uc-range>
`;
pt.reg("editor-toolbar");
var mt = class extends l {
  constructor() {
    super();
    h(this, "init$", { refMap: null });
    H(this, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
  }
  initCallback() {
    (this.style.backgroundImage = `url(${se()})`),
      (this.canvas = this.ref.cvs),
      (this.canvCtx = this.canvas.getContext("2d")),
      (this.$.refMap = {
        parent: this,
        canvas: this.canvas,
        canvCtx: this.canvCtx,
        svg: this.ref.svg,
        svgGroup: this.ref.svg_g,
        svgImg: this.ref.svg_img,
      });
  }
  setImage(t) {
    t.height && t.width
      ? ((this.canvas.height = t.height),
        (this.canvas.width = t.width),
        this.canvCtx.drawImage(t, 0, 0, t.width, t.height))
      : (t.onload = () => {
          (this.canvas.height = t.height),
            (this.canvas.width = t.width),
            this.canvCtx.drawImage(t, 0, 0, t.width, t.height);
        });
  }
  setImageFile(t) {
    let e = new Image(),
      i = URL.createObjectURL(t);
    (e.src = i), this.setImage(e);
  }
  setImageUrl(t) {
    let e = new Image();
    (e.src = t), this.setImage(e);
  }
};
mt.template = `
<canvas .img-view ref="cvs"></canvas>
<svg .img-view xmlns="http://www.w3.org/2000/svg" ref="svg">
  <g ref="svg_g">
    <image ref="svg_img" x="0" y="0"></image>
  </g>
</svg>
<uc-editor-toolbar 
  set="refMap: refMap">
</uc-editor-toolbar>
`;
var mi =
    "https://ucarecdn.com/libs/editor/0.0.1-alpha.0.9/uploadcare-editor.js",
  Dt = class extends l {
    constructor() {
      super(...arguments);
      h(this, "activityType", l.activities.CLOUD_IMG_EDIT);
      h(this, "init$", { uuid: null });
    }
    loadScript() {
      let t = document.createElement("script");
      (t.src = mi),
        t.setAttribute("type", "module"),
        document.body.appendChild(t);
    }
    initCallback() {
      (this.style.display = "flex"),
        (this.style.position = "relative"),
        this.loadScript(),
        this.sub("*currentActivity", (t) => {
          t === l.activities.CLOUD_IMG_EDIT
            ? this.mountEditor()
            : this.unmountEditor();
        }),
        this.sub("*focusedEntry", (t) => {
          !t ||
            ((this.entry = t),
            this.entry.subscribe("uuid", (e) => {
              e && (this.$.uuid = e);
            }));
        });
    }
    handleApply(t) {
      let e = t.detail,
        { transformationsUrl: i } = e;
      this.entry.setValue("transformationsUrl", i), this.historyBack();
    }
    handleCancel() {
      this.historyBack();
    }
    mountEditor() {
      let t = window.customElements.get("uc-editor"),
        e = new t(),
        i = this.$.uuid,
        s = this.$["*pubkey"];
      e.setAttribute("uuid", i),
        e.setAttribute("public-key", s),
        e.addEventListener("apply", (n) => this.handleApply(n)),
        e.addEventListener("cancel", () => this.handleCancel()),
        (this.innerHTML = ""),
        (this.style.width = "600px"),
        (this.style.height = "400px"),
        this.appendChild(e);
    }
    unmountEditor() {
      (this.style.width = "0px"),
        (this.style.height = "0px"),
        (this.innerHTML = "");
    }
  };
var B = {};
window.addEventListener("message", (r) => {
  let t;
  try {
    t = JSON.parse(r.data);
  } catch (e) {
    return;
  }
  if ((t == null ? void 0 : t.type) in B) {
    let e = B[t.type];
    for (let [i, s] of e) r.source === i && s(t);
  }
});
var le = function (r, t, e) {
    r in B || (B[r] = []), B[r].push([t, e]);
  },
  ce = function (r, t) {
    r in B && (B[r] = B[r].filter((e) => e[0] !== t));
  };
var fi = (r) =>
    Object.keys(r).reduce((e, i) => {
      let s = r[i],
        n = Object.keys(s).reduce((o, a) => {
          let c = s[a];
          return o + `${a}: ${c};`;
        }, "");
      return e + `${i}{${n}}`;
    }, ""),
  ft = class extends w {
    constructor() {
      super(...arguments);
      h(this, "activityType", l.activities.EXTERNAL);
      h(this, "init$", {
        counter: 0,
        onDone: () => {
          this.$["*currentActivity"] = l.activities.UPLOAD_LIST;
        },
        onCancel: () => {
          this.set$({ "*currentActivity": l.activities.SOURCE_SELECT });
        },
      });
      h(this, "_iframe", null);
    }
    onActivate() {
      super.onActivate();
      let { externalSourceType: t } = this.activityParams;
      this.set$({
        "*modalCaption": `${t[0].toUpperCase()}${t.slice(1)}`,
        "*modalIcon": t,
      }),
        (this.$.counter = 0),
        this.mountIframe();
    }
    onDeactivate() {
      super.onDeactivate(), this.unmountIframe();
    }
    sendMessage(t) {
      this._iframe.contentWindow.postMessage(JSON.stringify(t), "*");
    }
    async handleFileSelected(t) {
      this.$.counter = this.$.counter + 1;
      let { url: e } = t,
        i = this.config.PUBKEY,
        s = this.uploadCollection.add({ externalUrl: e }),
        n = await F(e, {
          publicKey: i,
          onProgress: (o) => {
            let a = o.value * 100;
            s.setValue("uploadProgress", a);
          },
        });
      console.log(n),
        s.setMultipleValues({
          uuid: n.uuid,
          fileName: n.name,
          fileSize: n.size,
          isImage: n.isImage,
          mimeType: n.mimeType,
        });
    }
    handleIframeLoad(t) {
      this.applyStyles();
    }
    getCssValue(t) {
      return window.getComputedStyle(this).getPropertyValue(t).trim();
    }
    applyStyles() {
      let t = {
        body: { color: this.getCssValue("--clr-txt") },
        ".side-bar": {
          "background-color": this.getCssValue("--clr-background-light"),
        },
        ".list-table-row": { color: this.getCssValue("--clr-txt") },
        ".list-table-row:hover": {
          background: this.getCssValue("--clr-shade-lv1"),
        },
      };
      this.sendMessage({ type: "embed-css", style: fi(t) });
    }
    remoteUrl() {
      let t = this.config.PUBKEY,
        e = "3.11.3",
        i = (!1).toString(),
        { externalSourceType: s } = this.activityParams;
      return `https://social.uploadcare.com/window3/${s}?lang=en&public_key=${t}&widget_version=${e}&images_only=${i}&pass_window_open=false`;
    }
    mountIframe() {
      let t = document.createElement("iframe");
      t.addEventListener("load", this.handleIframeLoad.bind(this)),
        t.setAttribute("src", this.remoteUrl()),
        t.setAttribute("marginheight", "0"),
        t.setAttribute("marginwidth", "0"),
        t.setAttribute("frameborder", "0"),
        t.setAttribute("allowTransparency", "true");
      let e = this.ref["iframe-wrapper"];
      (e.innerHTML = ""),
        e.appendChild(t),
        le(
          "file-selected",
          t.contentWindow,
          this.handleFileSelected.bind(this)
        ),
        (this._iframe = t);
    }
    unmountIframe() {
      ce("file-selected", this._iframe.contentWindow);
      let t = this.ref["iframe-wrapper"];
      (t.innerHTML = ""), (this._iframe = void 0);
    }
  };
ft.template = `
<div ref="iframe-wrapper" .iframe-wrapper>
</div>
<div .toolbar>
  <button
    .cancel-btn
    .secondary-btn
    set="onclick: onCancel"
    l10n="cancel">
  </button>
  <div></div>
  <div .selected-counter>
    <span l10n="selected-count"></span>
    <span set="textContent: counter"></span>
  </div>
  <button .done-btn .primary-btn set="onclick: onDone">
    <uc-icon name="check"></uc-icon>
  </button>
</div>
`;
var q = class extends l {
  setCurrentTab(t) {
    if (!t) return;
    [...this.ref.context.querySelectorAll("[tab-ctx]")].forEach((i) => {
      i.getAttribute("tab-ctx") === t
        ? i.removeAttribute("hidden")
        : i.setAttribute("hidden", "");
    });
    for (let i in this._tabMap)
      i === t
        ? this._tabMap[i].setAttribute("current", "")
        : this._tabMap[i].removeAttribute("current");
  }
  initCallback() {
    (this._tabMap = {}),
      this.defineAccessor("tab-list", (t) => {
        if (!t) return;
        t.split(",")
          .map((i) => i.trim())
          .forEach((i) => {
            let s = wt({
              tag: "div",
              attributes: { class: "tab" },
              properties: {
                onclick: () => {
                  this.setCurrentTab(i);
                },
              },
            });
            (s.textContent = this.l10n(i)),
              this.ref.row.appendChild(s),
              (this._tabMap[i] = s);
          });
      }),
      this.defineAccessor("default", (t) => {
        this.setCurrentTab(t);
      }),
      this.hasAttribute("default") ||
        this.setCurrentTab(Object.keys(this._tabMap)[0]);
  }
};
q.bindAttributes({ "tab-list": null, default: null });
q.template = `
<div ref="row" .tabs-row></div>
<div ref="context" .tabs-context>
  <slot></slot>
</div>
`;
var E = class extends l {
  initCallback() {
    let t = this.getAttribute("from");
    this.sub(t || E.defaultFrom, (e) => {
      if (!!e) {
        if (
          (this.hasAttribute(E.fireEventAttrName) &&
            this.dispatchEvent(
              new CustomEvent(E.outputEventName, {
                bubbles: !0,
                composed: !0,
                detail: {
                  timestamp: Date.now(),
                  ctxName: this.ctxName,
                  data: e,
                },
              })
            ),
          this.hasAttribute(E.templateAttrName))
        ) {
          let i = this.getAttribute(E.templateAttrName),
            s = "";
          e.forEach((n) => {
            let o = i;
            for (let a in n) o = o.split(`{{${a}}}`).join(n[a]);
            s += o;
          }),
            (this.innerHTML = s);
        }
        (this.value = e),
          this.hasAttribute(E.formValueAttrName) &&
            (this._input ||
              ((this._input = document.createElement("input")),
              (this._input.type = "text"),
              this.appendChild(this._input)),
            (this._input.value = JSON.stringify(e)));
      }
    });
  }
};
E.outputEventName = "data-output";
E.templateAttrName = "item-template";
E.fireEventAttrName = "fire-event";
E.formValueAttrName = "form-value";
E.defaultFrom = "*outputData";
var gt = class extends l {
  constructor() {
    super(...arguments);
    h(this, "init$", { "*modalCaption": void 0 });
  }
};
gt.template = `
<div
  .caption
  set="textContent: *modalCaption">
</div>
`;
var vt = class extends l {
  constructor() {
    super(...arguments);
    h(this, "init$", { "*modalIcon": "default" });
  }
};
vt.template = `
<uc-icon set="@name: *modalIcon"></uc-icon>
`;
var bt = class extends T {
  constructor() {
    super(...arguments);
    h(this, "pauseRender", !0);
    h(this, "renderShadow", !0);
  }
  set "css-src"(t) {
    if (!t) return;
    this.attachShadow({ mode: "open" });
    let e = document.createElement("link");
    (e.rel = "stylesheet"),
      (e.type = "text/css"),
      (e.href = t),
      (e.onload = () => {
        window.requestAnimationFrame(() => {
          this.render();
        });
      }),
      this.shadowRoot.appendChild(e);
  }
};
bt.bindAttributes({ "css-src": null });
var ue = class extends bt {};
function gi() {
  z.reg("uc-icon"),
    Q.reg("simple-btn"),
    Et.reg("activity-wrapper"),
    St.reg("drop-area"),
    W.reg("source-btn"),
    Z.reg("source-select"),
    kt.reg("source-list"),
    I.reg("file-item"),
    it.reg("modal"),
    st.reg("inline"),
    ot.reg("upload-list"),
    gt.reg("activity-caption"),
    vt.reg("activity-icon"),
    at.reg("url-source"),
    lt.reg("camera-source"),
    ft.reg("external-source"),
    ct.reg("upload-details"),
    et.reg("message-box"),
    nt.reg("confirmation-dialog"),
    ut.reg("progress-bar"),
    mt.reg("editable-canvas"),
    Dt.reg("cloud-image-editor"),
    E.reg("data-output"),
    q.reg("tabs");
}
typeof window != "undefined" && gi();
export {
  gt as ActivityCaption,
  w as ActivityComponent,
  vt as ActivityIcon,
  Et as ActivityWrapper,
  T as BaseComponent,
  lt as CameraSource,
  Dt as CloudImageEditor,
  nt as ConfirmationDialog,
  E as DataOutput,
  St as DropArea,
  mt as EditableCanvas,
  ft as ExternalSource,
  I as FileItem,
  z as Icon,
  st as Inline,
  et as MessageBox,
  it as Modal,
  ut as ProgressBar,
  Q as SimpleBtn,
  W as SourceBtn,
  kt as SourceList,
  q as Tabs,
  ct as UploadDetails,
  ot as UploadList,
  ue as UploadWidget,
  at as UrlSource,
  gi as register,
};
