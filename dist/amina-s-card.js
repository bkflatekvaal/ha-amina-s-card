/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, F = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, I = Symbol(), et = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== I) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = et.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && et.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const zt = (i) => new mt(typeof i == "string" ? i : i + "", void 0, I), Wt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, a) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[a + 1], i[0]);
  return new mt(e, i, I);
}, Dt = (i, t) => {
  if (F) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = H.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, it = F ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return zt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: jt, defineProperty: Vt, getOwnPropertyDescriptor: Bt, getOwnPropertyNames: Ft, getOwnPropertySymbols: It, getPrototypeOf: Zt } = Object, f = globalThis, st = f.trustedTypes, Jt = st ? st.emptyScript : "", Yt = f.reactiveElementPolyfillSupport, S = (i, t) => i, R = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Jt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Z = (i, t) => !jt(i, t), nt = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), f.litPropertyMetadata ?? (f.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = nt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Vt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: a } = Bt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const c = n?.call(this);
      a?.call(this, r), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = Zt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const e = this.properties, s = [...Ft(e), ...It(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(it(n));
    } else t !== void 0 && e.push(it(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Dt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : R).toAttribute(e, s.type);
      this._$Em = t, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = s.getPropertyOptions(n), r = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : R;
      this._$Em = n;
      const c = r.fromAttribute(e, a.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, a) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (a = this[t]), s ?? (s = r.getPropertyOptions(t)), !((s.hasChanged ?? Z)(a, e) || s.useDefault && s.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: a }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), a !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, a] of s) {
        const { wrapped: r } = a, c = this[n];
        r !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, a, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[S("elementProperties")] = /* @__PURE__ */ new Map(), w[S("finalized")] = /* @__PURE__ */ new Map(), Yt?.({ ReactiveElement: w }), (f.reactiveElementVersions ?? (f.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis, rt = (i) => i, q = k.trustedTypes, at = q ? q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, gt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, ft = "?" + g, Gt = `<${ft}>`, v = document, O = () => v.createComment(""), N = (i) => i === null || typeof i != "object" && typeof i != "function", J = Array.isArray, Kt = (i) => J(i) || typeof i?.[Symbol.iterator] == "function", V = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, lt = />/g, _ = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, ht = /"/g, _t = /^(?:script|style|textarea|title)$/i, Qt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), C = Qt(1), A = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), dt = /* @__PURE__ */ new WeakMap(), y = v.createTreeWalker(v, 129);
function yt(i, t) {
  if (!J(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return at !== void 0 ? at.createHTML(t) : t;
}
const Xt = (i, t) => {
  const e = i.length - 1, s = [];
  let n, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = E;
  for (let c = 0; c < e; c++) {
    const o = i[c];
    let d, h, l = -1, u = 0;
    for (; u < o.length && (r.lastIndex = u, h = r.exec(o), h !== null); ) u = r.lastIndex, r === E ? h[1] === "!--" ? r = ot : h[1] !== void 0 ? r = lt : h[2] !== void 0 ? (_t.test(h[2]) && (n = RegExp("</" + h[2], "g")), r = _) : h[3] !== void 0 && (r = _) : r === _ ? h[0] === ">" ? (r = n ?? E, l = -1) : h[1] === void 0 ? l = -2 : (l = r.lastIndex - h[2].length, d = h[1], r = h[3] === void 0 ? _ : h[3] === '"' ? ht : ct) : r === ht || r === ct ? r = _ : r === ot || r === lt ? r = E : (r = _, n = void 0);
    const m = r === _ && i[c + 1].startsWith("/>") ? " " : "";
    a += r === E ? o + Gt : l >= 0 ? (s.push(d), o.slice(0, l) + gt + o.slice(l) + g + m) : o + g + (l === -2 ? c : m);
  }
  return [yt(i, a + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class U {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let a = 0, r = 0;
    const c = t.length - 1, o = this.parts, [d, h] = Xt(t, e);
    if (this.el = U.createElement(d, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (n = y.nextNode()) !== null && o.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const l of n.getAttributeNames()) if (l.endsWith(gt)) {
          const u = h[r++], m = n.getAttribute(l).split(g), $ = /([.?@])?(.*)/.exec(u);
          o.push({ type: 1, index: a, name: $[2], strings: m, ctor: $[1] === "." ? ee : $[1] === "?" ? ie : $[1] === "@" ? se : j }), n.removeAttribute(l);
        } else l.startsWith(g) && (o.push({ type: 6, index: a }), n.removeAttribute(l));
        if (_t.test(n.tagName)) {
          const l = n.textContent.split(g), u = l.length - 1;
          if (u > 0) {
            n.textContent = q ? q.emptyScript : "";
            for (let m = 0; m < u; m++) n.append(l[m], O()), y.nextNode(), o.push({ type: 2, index: ++a });
            n.append(l[u], O());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ft) o.push({ type: 2, index: a });
      else {
        let l = -1;
        for (; (l = n.data.indexOf(g, l + 1)) !== -1; ) o.push({ type: 7, index: a }), l += g.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(i, t, e = i, s) {
  if (t === A) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const a = N(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = n : e._$Cl = n), n !== void 0 && (t = x(i, n._$AS(i, t.values), n, s)), t;
}
class te {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? v).importNode(e, !0);
    y.currentNode = n;
    let a = y.nextNode(), r = 0, c = 0, o = s[0];
    for (; o !== void 0; ) {
      if (r === o.index) {
        let d;
        o.type === 2 ? d = new L(a, a.nextSibling, this, t) : o.type === 1 ? d = new o.ctor(a, o.name, o.strings, this, t) : o.type === 6 && (d = new ne(a, this, t)), this._$AV.push(d), o = s[++c];
      }
      r !== o?.index && (a = y.nextNode(), r++);
    }
    return y.currentNode = v, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class L {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), N(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = U.createElement(yt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const a = new te(n, this), r = a.u(this.options);
      a.p(e), this.T(r), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = dt.get(t.strings);
    return e === void 0 && dt.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const a of t) n === e.length ? e.push(s = new L(this.O(O()), this.O(O()), this, this.options)) : s = e[n], s._$AI(a), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = rt(t).nextSibling;
      rt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, a) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, n) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) t = x(this, t, e, 0), r = !N(t) || t !== this._$AH && t !== A, r && (this._$AH = t);
    else {
      const c = t;
      let o, d;
      for (t = a[0], o = 0; o < a.length - 1; o++) d = x(this, c[s + o], e, o), d === A && (d = this._$AH[o]), r || (r = !N(d) || d !== this._$AH[o]), d === p ? t = p : t !== p && (t += (d ?? "") + a[o + 1]), this._$AH[o] = d;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ee extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class ie extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class se extends j {
  constructor(t, e, s, n, a) {
    super(t, e, s, n, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? p) === A) return;
    const s = this._$AH, n = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, a = t !== p && (s === p || n);
    n && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ne {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const re = k.litHtmlPolyfillSupport;
re?.(U, L), (k.litHtmlVersions ?? (k.litHtmlVersions = [])).push("3.3.2");
const ae = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const a = e?.renderBefore ?? null;
    s._$litPart$ = n = new L(t.insertBefore(O(), a), a, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis;
class M extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ae(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
M._$litElement$ = !0, M.finalized = !0, P.litElementHydrateSupport?.({ LitElement: M });
const oe = P.litElementPolyfillSupport;
oe?.({ LitElement: M });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: Z }, he = (i = ce, t, e) => {
  const { kind: s, metadata: n } = e;
  let a = globalThis.litPropertyMetadata.get(n);
  if (a === void 0 && globalThis.litPropertyMetadata.set(n, a = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), a.set(e.name, i), s === "accessor") {
    const { name: r } = e;
    return { set(c) {
      const o = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, o, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(c) {
      const o = this[r];
      t.call(this, c), this.requestUpdate(r, o, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function de(i) {
  return (t, e) => typeof e == "object" ? he(i, t, e) : ((s, n, a) => {
    const r = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, s), r ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(i, t, e);
}
const ut = /* @__PURE__ */ new WeakMap(), ue = 6e4, pe = 3e4;
function Y(i) {
  const t = i?.connection ?? i;
  if (!t || typeof t != "object") return;
  let e = ut.get(t);
  return e || (e = { entities: {}, devices: {}, expires: 0, statusLookups: /* @__PURE__ */ new Map() }, ut.set(t, e)), e;
}
function G(i) {
  const t = Y(i)?.entities ?? {}, e = { ...t };
  for (const [s, n] of Object.entries(i?.entities ?? {}))
    e[s] = { ...t[s], ...n, entity_id: s };
  return e;
}
function T(i, t) {
  return G(t)[i];
}
function K(i, t) {
  const e = T(i, t)?.device_id;
  return e ? t?.devices?.[e] ?? Y(t)?.devices[e] : void 0;
}
function me(i, t) {
  const e = T(i, t)?.platform;
  if (e) return e === "zha" ? "zha" : "mqtt";
  const s = K(i, t)?.identifiers ?? [], n = new Set(s.map(([a]) => a).filter((a) => a === "zha" || a === "mqtt"));
  return n.size === 1 && n.has("zha") ? "zha" : "mqtt";
}
async function vt(i, t) {
  if (!i || !t?.callWS) return;
  const e = Y(t);
  if (!e) return;
  !e.promise && Date.now() >= e.expires && (e.promise = (async () => {
    const [n, a] = await Promise.allSettled([
      Promise.resolve().then(() => t.callWS({ type: "config/entity_registry/list" })),
      Promise.resolve().then(() => t.callWS({ type: "config/device_registry/list" }))
    ]);
    n.status === "fulfilled" && Array.isArray(n.value) && (e.entities = Object.fromEntries(n.value.filter((r) => r?.entity_id).map((r) => [r.entity_id, r]))), a.status === "fulfilled" && Array.isArray(a.value) && (e.devices = Object.fromEntries(a.value.filter((r) => r?.id).map((r) => [r.id, r]))), e.statusLookups.clear(), e.expires = Date.now() + (n.status === "fulfilled" && Array.isArray(n.value) ? ue : pe);
  })().finally(() => {
    e.promise = void 0;
  })), e.promise && await e.promise;
  const s = T(i, t);
  if ((!s?.device_id || !s?.platform) && !e.statusLookups.has(i)) {
    const n = Promise.resolve().then(() => t.callWS({ type: "config/entity_registry/get", entity_id: i })).then((a) => {
      a && typeof a == "object" && (e.entities[i] = { ...a, entity_id: i });
    }).catch(() => {
    });
    e.statusLookups.set(i, n);
  }
  await e.statusLookups.get(i);
}
function ge(i, t = "mqtt") {
  const e = i.split(".").pop()?.replace(/_status$/i, "").replace(/_ev$/i, "").replace(/_charger$/i, "").trim();
  if (!e) return {};
  const s = t === "zha";
  return {
    power_entity: `sensor.${e}_${s ? "total_power" : "total_active_power"}`,
    current_entity: `sensor.${e}_current`,
    voltage_entity: `sensor.${e}_voltage`,
    linkquality_entity: `sensor.${e}_${s ? "lqi" : "linkquality"}`,
    energy_entity: `sensor.${e}_last_session_energy`,
    charge_limit_entity: `number.${e}_${s ? "charge_current_limit" : "charge_limit"}`,
    charger_entity: `switch.${e}`,
    alarm_entity: `binary_sensor.${e}_alarm_active`,
    alarms_entity: `sensor.${e}_alarms`,
    derated_entity: `binary_sensor.${e}_derated`
  };
}
const pt = {
  power_entity: { domain: "sensor", labels: ["total active power", "total power"] },
  current_entity: { domain: "sensor", labels: ["current", "rms current", "current phase a"], deviceClass: "current", unit: "A" },
  voltage_entity: { domain: "sensor", labels: ["voltage", "rms voltage", "voltage phase a"], deviceClass: "voltage", unit: "V" },
  linkquality_entity: { domain: "sensor", labels: ["linkquality", "link quality", "lqi"] },
  energy_entity: { domain: "sensor", labels: ["last session energy", "session energy"] },
  charge_limit_entity: { domain: "number", labels: ["charge current limit", "charge limit"] },
  charger_entity: { domain: "switch", labels: ["state", "switch", "on off", "charger", "charger control", "charging enabled"] },
  alarm_entity: { domain: "binary_sensor", labels: ["alarm active"] },
  alarms_entity: { domain: "sensor", labels: ["alarms"] },
  derated_entity: { domain: "binary_sensor", labels: ["derated", "thermal derating"] },
  current_phase_b: { domain: "sensor", labels: ["current phase b", "rms current phase b"] },
  current_phase_c: { domain: "sensor", labels: ["current phase c", "rms current phase c"] },
  voltage_phase_b: { domain: "sensor", labels: ["voltage phase b", "rms voltage phase b"] },
  voltage_phase_c: { domain: "sensor", labels: ["voltage phase c", "rms voltage phase c"] }
}, fe = (i) => i.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(), B = (i, t) => i === t || i.endsWith(` ${t}`);
function _e(i, t, e) {
  const s = pt[t];
  if (i.entity_id.split(".")[0] !== s.domain) return 0;
  const n = [i.translation_key, i.original_name, i.unique_id, i.name, i.entity_id.split(".")[1]].map((l) => typeof l == "string" ? fe(l).replace(/ zigbee2mqtt$/, "") : ""), a = n.slice(0, 3).find((l) => Object.values(pt).some((u) => u.labels.some((m) => B(l, m))));
  if (a && !s.labels.some((l) => B(a, l))) return 0;
  const r = a ? [a] : n;
  if (["current_entity", "voltage_entity"].includes(t) && r.some((l) => /\b(phase [bc]|limit|frequency)\b/.test(l)) || t === "charge_limit_entity" && r.some((l) => /\b(offline|hardware)\b/.test(l)) || t === "charger_entity" && r.some((l) => /\b(offline|single phase|force|restart)\b/.test(l)) || t === "energy_entity" && r.some((l) => /\btotal\b/.test(l))) return 0;
  let c = 0;
  n.forEach((l, u) => {
    s.labels.some((m) => B(l, m)) && (c = Math.max(c, [100, 95, 90, 70, 60][u]));
  });
  const o = e?.states?.[i.entity_id]?.attributes ?? {}, d = i.original_device_class ?? i.device_class ?? o.device_class, h = i.unit_of_measurement ?? o.unit_of_measurement;
  return s.deviceClass && (d === s.deviceClass || h === s.unit) && (c = Math.max(c, 30)), c;
}
function $t(i, t) {
  return !!(t.device_id && i.device_id === t.device_id) && (!t.platform || !i.platform || i.platform === t.platform) && (!t.config_entry_id || !i.config_entry_id || i.config_entry_id === t.config_entry_id);
}
function ye(i, t, e) {
  const s = e[i];
  if (!s) return i;
  if (s.device_id) return t && $t(s, t) ? i : void 0;
  if (!(t?.device_id || t?.platform && s.platform && t.platform !== s.platform))
    return i;
}
function bt(i, t, e, s, n) {
  if (e?.device_id) {
    const a = Object.values(s).filter((r) => $t(r, e)).map((r) => ({ entry: r, score: _e(r, i, n) })).filter(({ score: r }) => r > 0).sort((r, c) => c.score - r.score);
    if (a.length && (a.length === 1 || a[0].score > a[1].score))
      return a[0].entry.entity_id;
  }
  return ye(t, e, s);
}
function Q(i, t) {
  const e = ge(i, me(i, t)), s = G(t), n = s[i];
  return Object.fromEntries(Object.entries(e).map(([a, r]) => [a, bt(a, r, n, s, t)]));
}
function z(i, t, e, s, n) {
  const a = G(t), r = a[i];
  return [s, ...["b", "c"].map((c) => {
    if (!s) return;
    const o = `${s}_phase_${c}`;
    return n ? o : bt(`${e}_phase_${c}`, o, r, a, t);
  })];
}
function W(i, t) {
  const e = Q(i, t);
  return JSON.stringify({
    entities: e,
    device: K(i, t),
    current: z(i, t, "current", e.current_entity, !1),
    voltage: z(i, t, "voltage", e.voltage_entity, !1)
  });
}
function ve(i, t, e) {
  const s = t.map((o, d) => Number.isFinite(o) && o > 0 ? d : -1).filter((o) => o >= 0), n = i && s.length > 1, a = i && s.length === 1 ? s[0] : 0, r = (o) => o.every(Number.isFinite) ? o.reduce((d, h) => d + h, 0) : NaN, c = (!i || n) && e.every((o) => Number.isFinite(o) && o > 0);
  return {
    threePhase: n,
    threePhaseVoltage: c,
    currents: n ? t : [t[0]],
    voltage: c ? r(e) / 3 : n ? NaN : e[a]
  };
}
var $e = Object.defineProperty, be = Object.getOwnPropertyDescriptor, wt = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? be(t, e) : t, a = i.length - 1, r; a >= 0; a--)
    (r = i[a]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && $e(t, e, n), n;
};
class we extends HTMLElement {
  constructor() {
    super(...arguments), this._config = {}, this._inputs = {}, this._showOptional = !1;
  }
  set hass(t) {
    this._hass = t;
    const e = this._config.status_entity ?? "", s = W(e, t);
    vt(e, t).then(() => {
      this._config.status_entity === e && W(e, this.hass) !== s && this.render();
    }), this.isConnected && this.querySelectorAll("ha-entity-picker").forEach((n) => {
      n.hass = t;
    });
  }
  get hass() {
    return this._hass;
  }
  setConfig(t) {
    this._config = t || {}, this.render(), this._hass && (this.hass = this._hass);
  }
  getEntityOptions(t) {
    const e = this.hass?.states ?? {}, s = Object.keys(e), a = {
      status_entity: (r) => r ? r.entity_id.startsWith("sensor.") : !1,
      power_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "power" || r.attributes.unit_of_measurement === "kW" || r.attributes.unit_of_measurement === "W") : !1,
      current_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "current" || r.attributes.unit_of_measurement === "A") : !1,
      voltage_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "voltage" || r.attributes.unit_of_measurement === "V") : !1,
      linkquality_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "signal_strength" || r.attributes.device_class === "signal" || ["lqi", "dB", "dBm"].includes(r.attributes.unit_of_measurement) || r.entity_id.toLowerCase().includes("linkquality") || r.entity_id.toLowerCase().endsWith("_lqi")) : !1,
      energy_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "energy" || r.attributes.unit_of_measurement === "kWh" || r.attributes.unit_of_measurement === "Wh") : !1,
      charge_limit_entity: (r) => r ? r.entity_id.startsWith("number.") : !1,
      charger_entity: (r) => r ? r.entity_id.startsWith("switch.") : !1,
      alarm_entity: (r) => r ? r.entity_id.startsWith("binary_sensor.") : !1,
      alarms_entity: (r) => r ? r.entity_id.startsWith("sensor.") : !1,
      derated_entity: (r) => r ? r.entity_id.startsWith("binary_sensor.") : !1
    }[t] || (() => !0);
    return s.filter((r) => a(this.hass.states[r])).sort();
  }
  getDefaultEntity(t) {
    return Q(this._config.status_entity ?? "", this.hass)[t];
  }
  appendFieldHelper(t, e) {
    const s = document.createElement("div"), n = this.getDefaultEntity(e);
    s.textContent = n ? `Default: ${n}` : "Select a status entity to calculate the default", s.style.fontSize = "12px", s.style.color = "var(--secondary-text-color)", t.appendChild(s);
  }
  renderEntityField(t, e, s = !1) {
    if (customElements.get("ha-entity-picker")) {
      const h = document.createElement("div");
      h.style.display = "grid", h.style.gap = "4px";
      const l = document.createElement("label");
      l.textContent = e + (s ? " *" : ""), l.style.fontSize = "12px", l.style.color = "var(--primary-text-color)", h.appendChild(l), t !== "status_entity" && this.appendFieldHelper(h, t);
      const u = document.createElement("ha-entity-picker");
      return u.dataset.key = t, u.hass = this._hass, u.value = this._config[t] ?? "", u.includeDomains = this.getDomainForField(t), u.includeDeviceClasses = this.getDeviceClassesForField(t), u.includeUnitOfMeasurement = this.getUnitsForField(t), u.style.width = "100%", u.addEventListener("value-changed", (m) => {
        this.updateConfig(t, m.detail?.value);
      }), h.appendChild(u), h;
    }
    const n = document.createElement("div");
    n.style.display = "grid", n.style.gap = "4px";
    const a = document.createElement("label");
    a.textContent = e + (s ? " *" : ""), a.style.fontSize = "12px", a.style.color = "var(--primary-text-color)", n.appendChild(a), t !== "status_entity" && this.appendFieldHelper(n, t);
    const r = document.createElement("select");
    r.dataset.key = t, r.style.width = "100%", r.style.padding = "8px 10px", r.style.border = "1px solid var(--divider-color)", r.style.borderRadius = "8px", r.style.background = "var(--card-background-color)", r.style.color = "var(--primary-text-color)";
    const c = this._config[t] ?? "", o = this.getEntityOptions(t), d = document.createElement("option");
    return d.value = "", d.textContent = "Select entity", r.appendChild(d), o.forEach((h) => {
      const l = document.createElement("option");
      l.value = h, l.textContent = h, l.selected = h === c, r.appendChild(l);
    }), r.addEventListener("change", () => this.updateConfig(t, r.value)), n.appendChild(r), n;
  }
  getDeviceClassesForField(t) {
    const e = {
      power_entity: "power",
      current_entity: "current",
      voltage_entity: "voltage",
      energy_entity: "energy"
    };
    return e[t] ? [e[t]] : void 0;
  }
  getUnitsForField(t) {
  }
  renderTextField(t, e) {
    const s = document.createElement("div");
    s.style.display = "grid", s.style.gap = "4px";
    const n = document.createElement("label");
    n.textContent = e, n.style.fontSize = "12px", n.style.color = "var(--primary-text-color)", s.appendChild(n);
    const a = document.createElement("input");
    return a.dataset.key = t, a.value = this._config[t] ?? "", a.style.padding = "8px 10px", a.style.border = "1px solid var(--divider-color)", a.style.borderRadius = "8px", a.style.background = "var(--card-background-color)", a.style.color = "var(--primary-text-color)", a.addEventListener("input", () => this.updateConfig()), s.appendChild(a), s;
  }
  getDomainForField(t) {
    return {
      status_entity: ["sensor"],
      power_entity: ["sensor"],
      current_entity: ["sensor"],
      voltage_entity: ["sensor"],
      linkquality_entity: ["sensor"],
      energy_entity: ["sensor"],
      charge_limit_entity: ["number"],
      charger_entity: ["switch"],
      alarm_entity: ["binary_sensor"],
      alarms_entity: ["sensor"],
      derated_entity: ["binary_sensor"]
    }[t];
  }
  updateConfig(t, e) {
    const s = { ...this._config };
    this.querySelectorAll("[data-key]").forEach((a) => {
      const r = a.getAttribute("data-key");
      if (!r) return;
      const c = a.value ?? a.getAttribute("value") ?? "";
      c ? s[r] = c : delete s[r];
    }), t && (e ? s[t] = e : delete s[t]), this._config = s, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: s },
        bubbles: !0,
        composed: !0
      })
    ), t === "status_entity" && (this.render(), this._hass && (this.hass = this._hass));
  }
  render() {
    const t = document.createElement("div");
    t.style.display = "grid", t.style.gap = "12px", t.style.padding = "12px 0", t.appendChild(this.renderTextField("title", "Title")), t.appendChild(this.renderEntityField("status_entity", "Status entity", !0));
    const e = document.createElement("div");
    e.style.display = "flex", e.style.alignItems = "center", e.style.justifyContent = "space-between", e.style.marginTop = "4px";
    const s = document.createElement("div");
    s.textContent = "Optional override", s.style.fontSize = "12px", s.style.fontWeight = "600", s.style.color = "var(--primary-text-color)", e.appendChild(s);
    const n = document.createElement("button");
    n.type = "button", n.textContent = this._showOptional ? "Hide" : "Show", n.style.border = "1px solid var(--divider-color)", n.style.borderRadius = "999px", n.style.background = "transparent", n.style.color = "var(--primary-text-color)", n.style.padding = "4px 10px", n.style.cursor = "pointer", n.addEventListener("click", () => {
      this._showOptional = !this._showOptional, this.render();
    }), e.appendChild(n), t.appendChild(e), this._showOptional && [
      ["sub_status_entity", "Sub-status entity"],
      ["power_entity", "Power entity"],
      ["current_entity", "Current entity"],
      ["voltage_entity", "Voltage entity"],
      ["linkquality_entity", "Link quality entity"],
      ["energy_entity", "Session energy entity"],
      ["charge_limit_entity", "Charge limit entity"],
      ["charger_entity", "Switch entity"],
      ["alarm_entity", "Alarm entity"],
      ["alarms_entity", "Alarm list entity"],
      ["derated_entity", "Derated entity"]
    ].forEach(([a, r]) => {
      t.appendChild(this.renderEntityField(a, r, !1));
    }), this.innerHTML = "", this.appendChild(t);
  }
}
let D = class extends M {
  get config() {
    if (this._config)
      return {
        ...Q(this._config.status_entity, this.hass),
        ...this._config,
        title: this.getTitle()
      };
  }
  willUpdate() {
    const i = this._config?.status_entity;
    if (!i) return;
    const t = W(i, this.hass);
    vt(i, this.hass).then(() => {
      this._config?.status_entity === i && W(i, this.hass) !== t && this.requestUpdate();
    });
  }
  setConfig(i) {
    if (!i.status_entity)
      throw new Error("You must set status_entity");
    this._config = { ...i }, this.requestUpdate();
  }
  getEntity(i) {
    if (!(!i || !this.hass?.states?.[i]))
      return this.hass.states[i];
  }
  getState(i) {
    return this.getEntity(i)?.state ?? "-";
  }
  getEntityIcon(i) {
    const t = this.getEntity(i)?.attributes?.icon;
    return typeof t == "string" && t.trim() ? t : "";
  }
  getEntityUnit(i) {
    const t = this.getEntity(i)?.attributes?.unit_of_measurement;
    return typeof t == "string" && t.trim() ? t : "";
  }
  getNumberValue(i) {
    const t = this.getEntity(i)?.state;
    if (t == null || typeof t == "string" && !t.trim()) return NaN;
    const e = Number(t);
    return Number.isFinite(e) ? e : NaN;
  }
  getTitle() {
    const i = this._config?.title?.trim();
    if (i) return i;
    const t = this._config?.status_entity, e = K(t, this.hass);
    return e?.name_by_user || e?.name || this.getEntity(t)?.attributes?.friendly_name || t || "";
  }
  formatReading(i, t, e) {
    return Number.isFinite(i) ? `${this.formatNumber(i, t)}${e ? ` ${e}` : ""}` : "-";
  }
  getBooleanValue(i) {
    const t = this.getState(i).toLowerCase();
    return t === "on" || t === "true" || t === "enabled" || t === "enable";
  }
  normaliseStatus(i) {
    return i?.trim() || "Unknown";
  }
  getAlarmList(i) {
    const t = this.getEntity(i)?.state;
    if (Array.isArray(t)) return t.map(String);
    if (typeof t == "string") {
      const e = t.replace(/\[|\]|'/g, "").trim();
      return e ? e.split(",").map((s) => s.trim()).filter(Boolean) : [];
    }
    return [];
  }
  getAlarmMessage() {
    const i = this.getBooleanValue(this.config.alarm_entity), t = this.getBooleanValue(this.config.derated_entity);
    if (!i && !t) return "";
    const e = this.getAlarmList(this.config.alarms_entity).map((s) => s.trim()).filter((s) => !!s).filter((s) => !["unknown", "none", "normal", "idle", "no alarm", "no_alarm", "-"].includes(s.toLowerCase()));
    return e.length ? e.join(", ") : t ? "Power reduced" : "Warning";
  }
  showMoreInfo(i) {
    i && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: i },
        bubbles: !0,
        composed: !0
      })
    );
  }
  formatNumber(i, t = 1) {
    if (!Number.isFinite(i)) return "-";
    const e = this.hass?.config?.locale || this.hass?.locale || void 0;
    return new Intl.NumberFormat(e, {
      minimumFractionDigits: t,
      maximumFractionDigits: t,
      useGrouping: !1
    }).format(i);
  }
  async toggleCharger() {
    if (!this.getStatusMeta().available) return;
    const i = this.config.charger_entity;
    if (!i) return;
    if (this.getState(i).toLowerCase() === "on") {
      await this.hass.callService("switch", "turn_off", { entity_id: i });
      return;
    }
    await this.hass.callService("switch", "turn_on", { entity_id: i });
  }
  getLedColor() {
    const i = this.normaliseStatus(this.getState(this.config.status_entity)).toLowerCase(), t = this.getBooleanValue(this.config.alarm_entity), e = this.getBooleanValue(this.config.derated_entity);
    return i === "charging" ? "#52d98f" : t || e ? "#ffb35c" : i === "ev connected" ? "#7ec8ff" : "#dfe7f2";
  }
  getStatusMeta() {
    const i = this.normaliseStatus(this.getState(this.config.status_entity)), t = this.getEntity(this.config.sub_status_entity)?.state, e = i.toLowerCase(), s = !!this.getEntity(this.config.status_entity) && !["unavailable", "unknown", "-", ""].includes(e), n = e === "charging", a = e === "ev connected", r = this.getBooleanValue(this.config.alarm_entity), c = this.getBooleanValue(this.config.derated_entity), o = this.getAlarmMessage(), d = !!o;
    let h = i, l = "status-connected";
    s ? e === "charging" ? (h = "Charging", l = "status-charging") : e === "ev connected" ? (h = "EV Connected", l = "status-connected") : e === "not connected" ? (h = "Not Connected", l = "status-connected") : (e === "unavailable" || e === "unknown") && (h = i, l = "status-warning") : (h = e === "unavailable" ? "Unavailable" : "Unknown", l = "status-warning");
    const u = s ? t ? String(t) : d ? o : n ? "Power is being delivered" : a ? "Vehicle connected" : "Waiting for vehicle" : "Waiting for charger to come online";
    return { status: i, available: s, connected: a, charging: n, alarmActive: r, derated: c, alarmText: o, mainStatus: h, statusClass: l, secondary: u };
  }
  render() {
    const i = this.config;
    if (!this.hass || !i)
      return C``;
    const t = this.getNumberValue(i.charge_limit_entity), e = z(i.status_entity, this.hass, "current", i.current_entity, !!this._config?.current_entity), s = z(i.status_entity, this.hass, "voltage", i.voltage_entity, !!this._config?.voltage_entity), n = ve(
      this.getStatusMeta().charging,
      e.map((b) => this.getNumberValue(b)),
      s.map((b) => this.getNumberValue(b))
    ), a = i.power_entity, r = this.getEntityUnit(a) || T(a, this.hass)?.unit_of_measurement, c = r === "kW" || !r && a?.endsWith("_total_active_power"), o = this.getNumberValue(a) / (c ? 1 : 1e3), d = n.threePhase ? e : [i.current_entity], h = n.voltage, l = n.threePhaseVoltage ? "3p " : "", u = this.getNumberValue(i.linkquality_entity), m = !!this.getEntity(i.linkquality_entity) && !T(i.linkquality_entity, this.hass)?.disabled_by, $ = this.getEntityIcon(i.voltage_entity) || "mdi:sine-wave", At = this.getEntityIcon(i.charge_limit_entity) || "mdi:ev-station", xt = this.getEntityIcon(i.linkquality_entity) || "mdi:signal", Et = this.getEntityUnit(i.linkquality_entity) || "", { mainStatus: Ct, statusClass: St, secondary: kt, available: Pt, charging: Mt, connected: Ot, alarmActive: Nt, derated: Ut, alarmText: Ae } = this.getStatusMeta(), Tt = Mt, Lt = Ot, X = this.getNumberValue(i.energy_entity), Ht = Tt || Lt ? X : Math.max(X, 0), tt = this.getState(i.charger_entity).toLowerCase() === "on", Rt = this.getLedColor();
    return C`
      <ha-card>
        <div class="card">
          <div class="card-header">${i.title}</div>
          <div class="header">
            <div class="charger-visual" aria-label="Amina S charger icon" @click=${() => this.showMoreInfo(i.status_entity)} style="cursor:pointer;">
              <svg class="charger-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path fill="${Rt}" d="M9.611 2c-.575 0-1.038.463-1.038 1.039v8.953h6.854V3.04c0-.577-.464-1.039-1.038-1.039Zm4.587.609a.596.596 0 0 1 .598.596.596.596 0 0 1-.598.596.596.596 0 0 1-.598-.596.596.596 0 0 1 .598-.596M8.573 12.3v4.136c0 .575.463 1.038 1.038 1.038h4.777c.575 0 1.038-.463 1.038-1.038v-4.135Zm2.077 5.487v1.266a.623.623 0 0 0 .624.623h.205V22h1.042v-2.325h.206a.623.623 0 0 0 .623-.623v-1.266Z"/>
              </svg>
            </div>
            <div class="status-wrap">
              <div class="status-main ${St}" @click=${() => this.showMoreInfo(i.status_entity)} style="cursor:pointer;">${Ct}</div>
              <div class="status-secondary ${Nt || Ut ? "status-warning" : ""}">${kt}</div>
              ${Pt ? C`<button class="action-toggle" @click=${() => this.toggleCharger()} aria-label="${tt ? "Stop charging" : "Start charging"}">
                ${tt ? "Stop ■" : "Start ▶"}
              </button>` : ""}
            </div>
            <div class="top-right">
              <div class="telemetry-row" @click=${() => this.showMoreInfo(i.voltage_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${l}${this.formatReading(h, 1, "V")}</span>
                <ha-icon class="telemetry-icon" .icon=${$}></ha-icon>
              </div>
              <div class="telemetry-row" @click=${() => this.showMoreInfo(i.charge_limit_entity)} style="cursor:pointer;">
                <span class="telemetry-value">Max ${this.formatReading(t, 0, "A")}</span>
                <ha-icon class="telemetry-icon" .icon=${At}></ha-icon>
              </div>
              ${m ? C`<div class="telemetry-row" @click=${() => this.showMoreInfo(i.linkquality_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatReading(u, 0, Et)}</span>
                <ha-icon class="telemetry-icon" .icon=${xt}></ha-icon>
              </div>` : ""}
            </div>
          </div>

          <div class="metrics">
            <div class="metric" @click=${() => this.showMoreInfo(a)} style="cursor:pointer;">
              <div class="metric-label">Power</div>
              <div class="metric-value">${this.formatReading(o, 1, "kW")}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Current</div>
              ${d.map((b, qt) => C`
                <div class="metric-value" @click=${() => this.showMoreInfo(b)} style="cursor:pointer;">
                  ${d.length > 1 ? `${["A", "B", "C"][qt]}: ` : ""}${this.formatReading(this.getNumberValue(b), 1, "A")}
                </div>
              `)}
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(i.energy_entity)} style="cursor:pointer;">
              <div class="metric-label">Session</div>
              <div class="metric-value">${this.formatReading(Ht, 2, "kWh")}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }
  getCardSize() {
    return 4;
  }
  static getStubConfig() {
    return {
      status_entity: "sensor.amina_s_ev_status",
      advanced: !1
    };
  }
  static getConfigElement() {
    return document.createElement("amina-s-card-config-editor");
  }
};
D.styles = Wt`
    :host {
      display: block;
      --amina-card-bg: var(--card-background-color, #ffffff);
      --amina-card-surface: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      --amina-card-surface-strong: var(--ha-card-background, rgba(0, 0, 0, 0.06));
      --amina-text: var(--primary-text-color, #1d1d1f);
      --amina-muted: var(--secondary-text-color, #666c74);
      --amina-border: var(--divider-color, rgba(0, 0, 0, 0.12));
      --amina-accent: var(--state-icon-active-color, #3b82f6);
      --amina-accent-2: var(--success-color, #2eae69);
      --amina-warning: var(--warning-color, #d58f1b);
      --amina-danger: var(--error-color, #d64545);
      --amina-shadow: rgba(0, 0, 0, 0.12);
    }

    ha-card {
      display: block;
      background: var(--amina-card-bg);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 8px 20px var(--amina-shadow);
      border: 1px solid var(--amina-border);
    }

    .card {
      padding: 0 14px 10px;
      color: var(--amina-text);
      position: relative;
    }

    .card-header {
      padding: 16px 6px 12px;
      color: var(--amina-text);
      font-size: 1.5rem;
      line-height: 1.2;
      font-weight: 400;
    }

    .header {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 10px;
      margin-bottom: 12px;
    }

    .top-right {
      justify-self: end;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      padding-top: 2px;
      min-width: 72px;
    }

    .telemetry-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      font-size: 0.9rem;
      line-height: 1.15;
      letter-spacing: 0.04em;
      color: var(--amina-text);
      white-space: nowrap;
    }

    .telemetry-value {
      font-weight: 700;
      color: var(--amina-text);
    }

    .telemetry-icon {
      --mdc-icon-size: 16px;
      width: 16px;
      height: 16px;
      display: inline-block;
      color: var(--amina-muted);
      opacity: 0.9;
      flex-shrink: 0;
    }

    .charger-visual {
      width: 78px;
      height: 114px;
      margin: 0;
      position: relative;
      display: grid;
      place-items: center;
    }

    .charger-icon {
      width: 100%;
      height: 100%;
      display: block;
      filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.18));
    }

    .status-wrap {
      text-align: left;
      margin: 0;
      min-width: 0;
    }

    .status-main {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 4px;
      color: var(--amina-text);
    }

    .status-secondary {
      font-size: 0.8rem;
      color: var(--amina-muted);
      letter-spacing: 0.02em;
      min-height: 1.2em;
    }

    .status-warning {
      color: var(--amina-warning);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0;
      margin-top: 6px;
      margin-bottom: 0;
      border-top: 1px solid var(--amina-border);
      border-bottom: 1px solid var(--amina-border);
    }

    .metric {
      padding: 10px 6px 8px;
      min-height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
      text-align: center;
      border-right: 1px solid var(--amina-border);
      background: rgba(255,255,255,0.01);
    }

    .metric:last-child {
      border-right: none;
    }

    .action-toggle {
      appearance: none;
      border: 1px solid var(--amina-border);
      background: rgba(255,255,255,0.02);
      color: var(--amina-text);
      font-size: 0.8rem;
      line-height: 1;
      padding: 6px 10px 6px 8px;
      margin-top: 8px;
      cursor: pointer;
      opacity: 0.95;
      border-radius: 7px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }

    .metric-label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      color: var(--amina-muted);
    }

    .metric-value {
      font-size: 0.98rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--amina-text);
    }

    @media (max-width: 420px) {
      .metrics {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  `;
wt([
  de({ attribute: !1 })
], D.prototype, "hass", 2);
D = wt([
  le("amina-s-card")
], D);
customElements.define("amina-s-card-config-editor", we);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "amina-s-card",
  name: "Amina S Card",
  description: "Amina S EV charger card for Zigbee2MQTT and ZHA with the Amina S quirk."
});
export {
  D as AminaSCard
};
