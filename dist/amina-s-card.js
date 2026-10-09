/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, W = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = Symbol(), J = /* @__PURE__ */ new WeakMap();
let rt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (W && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = J.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && J.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (n) => new rt(typeof n == "string" ? n : n + "", void 0, F), Ct = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[o + 1], n[0]);
  return new rt(e, n, F);
}, St = (n, t) => {
  if (W) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = H.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, G = W ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Et(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Pt, defineProperty: kt, getOwnPropertyDescriptor: Mt, getOwnPropertyNames: Nt, getOwnPropertySymbols: Ot, getPrototypeOf: Ut } = Object, y = globalThis, K = y.trustedTypes, Tt = K ? K.emptyScript : "", Ht = y.reactiveElementPolyfillSupport, C = (n, t) => n, R = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Tt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, B = (n, t) => !Pt(n, t), Q = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: B };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Q) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && kt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = Mt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: s, set(r) {
      const l = s?.call(this);
      o?.call(this, r), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = Ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, i = [...Nt(e), ...Ot(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(G(s));
    } else t !== void 0 && e.push(G(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return St(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : R).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : R;
      this._$Em = s;
      const l = r.fromAttribute(e, o.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? B)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, o] of i) {
        const { wrapped: r } = o, l = this[s];
        r !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[C("elementProperties")] = /* @__PURE__ */ new Map(), w[C("finalized")] = /* @__PURE__ */ new Map(), Ht?.({ ReactiveElement: w }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis, Y = (n) => n, L = S.trustedTypes, X = L ? L.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ot = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, at = "?" + f, Rt = `<${at}>`, $ = document, M = () => $.createComment(""), N = (n) => n === null || typeof n != "object" && typeof n != "function", j = Array.isArray, Lt = (n) => j(n) || typeof n?.[Symbol.iterator] == "function", q = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tt = /-->/g, et = />/g, _ = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, st = /"/g, lt = /^(?:script|style|textarea|title)$/i, Vt = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), T = Vt(1), x = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), nt = /* @__PURE__ */ new WeakMap(), v = $.createTreeWalker($, 129);
function ct(n, t) {
  if (!j(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(t) : t;
}
const Dt = (n, t) => {
  const e = n.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = E;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let c, d, h = -1, u = 0;
    for (; u < a.length && (r.lastIndex = u, d = r.exec(a), d !== null); ) u = r.lastIndex, r === E ? d[1] === "!--" ? r = tt : d[1] !== void 0 ? r = et : d[2] !== void 0 ? (lt.test(d[2]) && (s = RegExp("</" + d[2], "g")), r = _) : d[3] !== void 0 && (r = _) : r === _ ? d[0] === ">" ? (r = s ?? E, h = -1) : d[1] === void 0 ? h = -2 : (h = r.lastIndex - d[2].length, c = d[1], r = d[3] === void 0 ? _ : d[3] === '"' ? st : it) : r === st || r === it ? r = _ : r === tt || r === et ? r = E : (r = _, s = void 0);
    const g = r === _ && n[l + 1].startsWith("/>") ? " " : "";
    o += r === E ? a + Rt : h >= 0 ? (i.push(c), a.slice(0, h) + ot + a.slice(h) + f + g) : a + f + (h === -2 ? l : g);
  }
  return [ct(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class O {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [c, d] = Dt(t, e);
    if (this.el = O.createElement(c, i), v.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = v.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(ot)) {
          const u = d[r++], g = s.getAttribute(h).split(f), b = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: b[2], strings: g, ctor: b[1] === "." ? zt : b[1] === "?" ? Wt : b[1] === "@" ? Ft : D }), s.removeAttribute(h);
        } else h.startsWith(f) && (a.push({ type: 6, index: o }), s.removeAttribute(h));
        if (lt.test(s.tagName)) {
          const h = s.textContent.split(f), u = h.length - 1;
          if (u > 0) {
            s.textContent = L ? L.emptyScript : "";
            for (let g = 0; g < u; g++) s.append(h[g], M()), v.nextNode(), a.push({ type: 2, index: ++o });
            s.append(h[u], M());
          }
        }
      } else if (s.nodeType === 8) if (s.data === at) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(f, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += f.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = $.createElement("template");
    return i.innerHTML = t, i;
  }
}
function A(n, t, e = n, i) {
  if (t === x) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = N(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = A(n, s._$AS(n, t.values), s, i)), t;
}
class qt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? $).importNode(e, !0);
    v.currentNode = s;
    let o = v.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new U(o, o.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (c = new Bt(o, this, t)), this._$AV.push(c), a = i[++l];
      }
      r !== a?.index && (o = v.nextNode(), r++);
    }
    return v.currentNode = $, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    t = A(this, t, e), N(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T($.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = O.createElement(ct(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const o = new qt(s, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = nt.get(t.strings);
    return e === void 0 && nt.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    j(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new U(this.O(M()), this.O(M()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Y(t).nextSibling;
      Y(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = A(this, t, e, 0), r = !N(t) || t !== this._$AH && t !== x, r && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = o[0], a = 0; a < o.length - 1; a++) c = A(this, l[i + a], e, a), c === x && (c = this._$AH[a]), r || (r = !N(c) || c !== this._$AH[a]), c === p ? t = p : t !== p && (t += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class zt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Wt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Ft extends D {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = A(this, t, e, 0) ?? p) === x) return;
    const i = this._$AH, s = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== p && (i === p || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Bt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    A(this, t);
  }
}
const jt = S.litHtmlPolyfillSupport;
jt?.(O, U), (S.litHtmlVersions ?? (S.litHtmlVersions = [])).push("3.3.2");
const It = (n, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = s = new U(t.insertBefore(M(), o), o, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis;
class k extends w {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = It(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
}
k._$litElement$ = !0, k.finalized = !0, P.litElementHydrateSupport?.({ LitElement: k });
const Zt = P.litElementPolyfillSupport;
Zt?.({ LitElement: k });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = (n) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(n, t);
  }) : customElements.define(n, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gt = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: B }, Kt = (n = Gt, t, e) => {
  const { kind: i, metadata: s } = e;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), o.set(e.name, n), i === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, a, n, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, n, l), l;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(l) {
      const a = this[r];
      t.call(this, l), this.requestUpdate(r, a, n, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Qt(n) {
  return (t, e) => typeof e == "object" ? Kt(n, t, e) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(n, t, e);
}
function z(n, t = {}) {
  const e = n.split(".").pop()?.replace(/_status$/i, "").replace(/_ev$/i, "").replace(/_charger$/i, "").trim();
  if (!e) return {};
  const i = (...s) => s.find((o) => o in t) ?? s[0];
  return {
    power_entity: `sensor.${e}_total_active_power`,
    current_entity: `sensor.${e}_current`,
    voltage_entity: `sensor.${e}_voltage`,
    linkquality_entity: i(`sensor.${e}_linkquality`, `sensor.${e}_lqi`),
    energy_entity: `sensor.${e}_last_session_energy`,
    charge_limit_entity: i(`number.${e}_charge_limit`, `number.${e}_charge_current_limit`),
    charger_entity: `switch.${e}`,
    alarm_entity: `binary_sensor.${e}_alarm_active`,
    alarms_entity: `sensor.${e}_alarms`,
    derated_entity: `binary_sensor.${e}_derated`
  };
}
function Yt(n, t, e, i) {
  const s = t.map((c, d) => c > 0 ? d : -1).filter((c) => c >= 0), o = n && s.length > 1, r = n && s.length === 1 ? s[0] : 0, l = (c) => c.every(Number.isFinite) ? c.reduce((d, h) => d + h, 0) : NaN, a = o && i.every((c) => Number.isFinite(c) && c > 0);
  return {
    threePhase: o,
    threePhaseVoltage: a,
    currents: o ? e : [e[0]],
    voltage: o ? a ? l(i) / 3 : NaN : i[r]
  };
}
var Xt = Object.defineProperty, te = Object.getOwnPropertyDescriptor, ht = (n, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? te(t, e) : t, o = n.length - 1, r; o >= 0; o--)
    (r = n[o]) && (s = (i ? r(t, e, s) : r(s)) || s);
  return i && s && Xt(t, e, s), s;
};
class ee extends HTMLElement {
  constructor() {
    super(...arguments), this._config = {}, this._inputs = {}, this._showOptional = !1;
  }
  set hass(t) {
    this._hass = t, this.isConnected && this.querySelectorAll("ha-entity-picker").forEach((e) => {
      e.hass = t;
    });
  }
  get hass() {
    return this._hass;
  }
  setConfig(t) {
    this._config = t || {}, this.render();
  }
  getEntityOptions(t) {
    const e = this.hass?.states ?? {}, i = Object.keys(e), o = {
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
    return i.filter((r) => o(this.hass.states[r])).sort();
  }
  getDefaultEntity(t) {
    return z(this._config.status_entity ?? "", this.hass?.states)[t];
  }
  appendFieldHelper(t, e) {
    const i = document.createElement("div"), s = this.getDefaultEntity(e);
    i.textContent = s ? `Default: ${s}` : "Select a status entity to calculate the default", i.style.fontSize = "12px", i.style.color = "var(--secondary-text-color)", t.appendChild(i);
  }
  renderEntityField(t, e, i = !1) {
    if (customElements.get("ha-entity-picker")) {
      const d = document.createElement("div");
      d.style.display = "grid", d.style.gap = "4px";
      const h = document.createElement("label");
      h.textContent = e + (i ? " *" : ""), h.style.fontSize = "12px", h.style.color = "var(--primary-text-color)", d.appendChild(h), t !== "status_entity" && this.appendFieldHelper(d, t);
      const u = document.createElement("ha-entity-picker");
      return u.dataset.key = t, u.hass = this._hass, u.value = this._config[t] ?? "", u.includeDomains = this.getDomainForField(t), u.includeDeviceClasses = this.getDeviceClassesForField(t), u.includeUnitOfMeasurement = this.getUnitsForField(t), u.style.width = "100%", u.addEventListener("value-changed", (g) => {
        this.updateConfig(t, g.detail?.value);
      }), d.appendChild(u), d;
    }
    const s = document.createElement("div");
    s.style.display = "grid", s.style.gap = "4px";
    const o = document.createElement("label");
    o.textContent = e + (i ? " *" : ""), o.style.fontSize = "12px", o.style.color = "var(--primary-text-color)", s.appendChild(o), t !== "status_entity" && this.appendFieldHelper(s, t);
    const r = document.createElement("select");
    r.dataset.key = t, r.style.width = "100%", r.style.padding = "8px 10px", r.style.border = "1px solid var(--divider-color)", r.style.borderRadius = "8px", r.style.background = "var(--card-background-color)", r.style.color = "var(--primary-text-color)";
    const l = this._config[t] ?? "", a = this.getEntityOptions(t), c = document.createElement("option");
    return c.value = "", c.textContent = "Select entity", r.appendChild(c), a.forEach((d) => {
      const h = document.createElement("option");
      h.value = d, h.textContent = d, h.selected = d === l, r.appendChild(h);
    }), r.addEventListener("change", () => this.updateConfig(t, r.value)), s.appendChild(r), s;
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
    const i = document.createElement("div");
    i.style.display = "grid", i.style.gap = "4px";
    const s = document.createElement("label");
    s.textContent = e, s.style.fontSize = "12px", s.style.color = "var(--primary-text-color)", i.appendChild(s);
    const o = document.createElement("input");
    return o.dataset.key = t, o.value = this._config[t] ?? "", o.style.padding = "8px 10px", o.style.border = "1px solid var(--divider-color)", o.style.borderRadius = "8px", o.style.background = "var(--card-background-color)", o.style.color = "var(--primary-text-color)", o.addEventListener("input", () => this.updateConfig()), i.appendChild(o), i;
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
    const i = { ...this._config };
    this.querySelectorAll("[data-key]").forEach((o) => {
      const r = o.getAttribute("data-key");
      if (!r) return;
      const l = o.value ?? o.getAttribute("value") ?? "";
      l ? i[r] = l : delete i[r];
    }), t && (e ? i[t] = e : delete i[t]), this._config = i, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: i },
        bubbles: !0,
        composed: !0
      })
    ), t === "status_entity" && this.render();
  }
  render() {
    const t = document.createElement("div");
    t.style.display = "grid", t.style.gap = "12px", t.style.padding = "12px 0", t.appendChild(this.renderTextField("title", "Title")), t.appendChild(this.renderEntityField("status_entity", "Status entity", !0));
    const e = document.createElement("div");
    e.style.display = "flex", e.style.alignItems = "center", e.style.justifyContent = "space-between", e.style.marginTop = "4px";
    const i = document.createElement("div");
    i.textContent = "Optional override", i.style.fontSize = "12px", i.style.fontWeight = "600", i.style.color = "var(--primary-text-color)", e.appendChild(i);
    const s = document.createElement("button");
    s.type = "button", s.textContent = this._showOptional ? "Hide" : "Show", s.style.border = "1px solid var(--divider-color)", s.style.borderRadius = "999px", s.style.background = "transparent", s.style.color = "var(--primary-text-color)", s.style.padding = "4px 10px", s.style.cursor = "pointer", s.addEventListener("click", () => {
      this._showOptional = !this._showOptional, this.render();
    }), e.appendChild(s), t.appendChild(e), this._showOptional && [
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
    ].forEach(([o, r]) => {
      t.appendChild(this.renderEntityField(o, r, !1));
    }), this.innerHTML = "", this.appendChild(t);
  }
}
let V = class extends k {
  get config() {
    if (this._config)
      return {
        ...z(this._config.status_entity, this.hass?.states),
        ...this._config,
        title: this.getTitle()
      };
  }
  setConfig(n) {
    if (!n.status_entity)
      throw new Error("You must set status_entity");
    this._config = { ...n }, this.requestUpdate();
  }
  getEntity(n) {
    if (!(!n || !this.hass?.states?.[n]))
      return this.hass.states[n];
  }
  getState(n) {
    return this.getEntity(n)?.state ?? "-";
  }
  getEntityIcon(n) {
    const t = this.getEntity(n)?.attributes?.icon;
    return typeof t == "string" && t.trim() ? t : "";
  }
  getEntityUnit(n) {
    const t = this.getEntity(n)?.attributes?.unit_of_measurement;
    return typeof t == "string" && t.trim() ? t : "";
  }
  getNumberValue(n) {
    const t = this.getEntity(n)?.state;
    if (t == null || typeof t == "string" && !t.trim()) return NaN;
    const e = Number(t);
    return Number.isFinite(e) ? e : NaN;
  }
  getTitle() {
    const n = this._config?.title?.trim();
    if (n) return n;
    const t = this._config?.status_entity, e = this.hass?.entities?.[t]?.device_id, i = this.hass?.devices?.[e];
    return i?.name_by_user || i?.name || this.getEntity(t)?.attributes?.friendly_name || t || "";
  }
  formatReading(n, t, e) {
    return Number.isFinite(n) ? `${this.formatNumber(n, t)}${e ? ` ${e}` : ""}` : "-";
  }
  getBooleanValue(n) {
    const t = this.getState(n).toLowerCase();
    return t === "on" || t === "true" || t === "enabled" || t === "enable";
  }
  normaliseStatus(n) {
    return n?.trim() || "Unknown";
  }
  getAlarmList(n) {
    const t = this.getEntity(n)?.state;
    if (Array.isArray(t)) return t.map(String);
    if (typeof t == "string") {
      const e = t.replace(/\[|\]|'/g, "").trim();
      return e ? e.split(",").map((i) => i.trim()).filter(Boolean) : [];
    }
    return [];
  }
  getAlarmMessage() {
    const n = this.getBooleanValue(this.config.alarm_entity), t = this.getBooleanValue(this.config.derated_entity);
    if (!n && !t) return "";
    const e = this.getAlarmList(this.config.alarms_entity).map((i) => i.trim()).filter((i) => !!i).filter((i) => !["unknown", "none", "normal", "idle", "no alarm", "no_alarm", "-"].includes(i.toLowerCase()));
    return e.length ? e.join(", ") : t ? "Power reduced" : "Warning";
  }
  showMoreInfo(n) {
    n && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: n },
        bubbles: !0,
        composed: !0
      })
    );
  }
  formatNumber(n, t = 1) {
    if (!Number.isFinite(n)) return "-";
    const e = this.hass?.config?.locale || this.hass?.locale || void 0;
    return new Intl.NumberFormat(e, {
      minimumFractionDigits: t,
      maximumFractionDigits: t,
      useGrouping: !1
    }).format(n);
  }
  async toggleCharger() {
    const n = this.config.charger_entity;
    if (!n) return;
    if (this.getState(n).toLowerCase() === "on") {
      await this.hass.callService("switch", "turn_off", { entity_id: n });
      return;
    }
    await this.hass.callService("switch", "turn_on", { entity_id: n });
  }
  getLedColor() {
    const n = this.normaliseStatus(this.getState(this.config.status_entity)).toLowerCase(), t = this.getBooleanValue(this.config.alarm_entity), e = this.getBooleanValue(this.config.derated_entity);
    return n === "charging" ? "#52d98f" : t || e ? "#ffb35c" : n === "ev connected" ? "#7ec8ff" : "#dfe7f2";
  }
  getStatusMeta() {
    const n = this.normaliseStatus(this.getState(this.config.status_entity)), t = this.getEntity(this.config.sub_status_entity)?.state, e = n.toLowerCase(), i = e === "charging", s = e === "ev connected", o = this.getBooleanValue(this.config.alarm_entity), r = this.getBooleanValue(this.config.derated_entity), l = this.getAlarmMessage(), a = !!l;
    let c = n, d = "status-connected";
    e === "charging" ? (c = "Charging", d = "status-charging") : e === "ev connected" ? (c = "EV Connected", d = "status-connected") : e === "not connected" ? (c = "Not Connected", d = "status-connected") : (e === "unavailable" || e === "unknown") && (c = n, d = "status-warning");
    const h = t ? String(t) : a ? l : i ? "Power is being delivered" : s ? "Vehicle connected" : "Waiting for vehicle";
    return { status: n, connected: s, charging: i, alarmActive: o, derated: r, alarmText: l, mainStatus: c, statusClass: d, secondary: h };
  }
  render() {
    if (!this.hass || !this.config)
      return T``;
    const n = this.getNumberValue(this.config.charge_limit_entity), t = z(this.config.status_entity), e = (m) => [
      this.getNumberValue(m),
      this.getNumberValue(m ? `${m}_phase_b` : void 0),
      this.getNumberValue(m ? `${m}_phase_c` : void 0)
    ], i = t.power_entity?.replace(/_total_active_power$/, "_power"), s = Yt(
      this.getStatusMeta().charging,
      e(i),
      e(this.config.current_entity),
      e(this.config.voltage_entity)
    ), o = this.config.power_entity, r = this.getEntityUnit(o) === "kW" || !this.getEntityUnit(o) && o === t.power_entity, l = this.getNumberValue(o) / (r ? 1 : 1e3), a = s.threePhase ? [this.config.current_entity, `${this.config.current_entity}_phase_b`, `${this.config.current_entity}_phase_c`] : [this.config.current_entity], c = s.voltage, d = s.threePhaseVoltage ? "3p " : "", h = this.getNumberValue(this.config.linkquality_entity), u = !!this.getEntity(this.config.linkquality_entity) && !this.hass.entities?.[this.config.linkquality_entity]?.disabled_by, g = this.getEntityIcon(this.config.voltage_entity) || "mdi:sine-wave", b = this.getEntityIcon(this.config.charge_limit_entity) || "mdi:ev-station", dt = this.getEntityIcon(this.config.linkquality_entity) || "mdi:signal", ut = this.getEntityUnit(this.config.linkquality_entity) || "", { mainStatus: pt, statusClass: gt, secondary: mt, charging: ft, connected: yt, alarmActive: _t, derated: vt, alarmText: ie } = this.getStatusMeta(), $t = ft, bt = yt, I = this.getNumberValue(this.config.energy_entity), wt = $t || bt ? I : Math.max(I, 0), Z = this.getState(this.config.charger_entity).toLowerCase() === "on", xt = this.getLedColor();
    return T`
      <ha-card>
        <div class="card">
          <div class="card-header">${this.config.title}</div>
          <div class="header">
            <div class="charger-visual" aria-label="Amina S charger icon" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">
              <svg class="charger-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path fill="${xt}" d="M9.611 2c-.575 0-1.038.463-1.038 1.039v8.953h6.854V3.04c0-.577-.464-1.039-1.038-1.039Zm4.587.609a.596.596 0 0 1 .598.596.596.596 0 0 1-.598.596.596.596 0 0 1-.598-.596.596.596 0 0 1 .598-.596M8.573 12.3v4.136c0 .575.463 1.038 1.038 1.038h4.777c.575 0 1.038-.463 1.038-1.038v-4.135Zm2.077 5.487v1.266a.623.623 0 0 0 .624.623h.205V22h1.042v-2.325h.206a.623.623 0 0 0 .623-.623v-1.266Z"/>
              </svg>
            </div>
            <div class="status-wrap">
              <div class="status-main ${gt}" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">${pt}</div>
              <div class="status-secondary ${_t || vt ? "status-warning" : ""}">${mt}</div>
              <button class="action-toggle" @click=${() => this.toggleCharger()} aria-label="${Z ? "Stop charging" : "Start charging"}">
                ${Z ? "Stop ■" : "Start ▶"}
              </button>
            </div>
            <div class="top-right">
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.voltage_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${d}${this.formatReading(c, 1, "V")}</span>
                <ha-icon class="telemetry-icon" .icon=${g}></ha-icon>
              </div>
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.charge_limit_entity)} style="cursor:pointer;">
                <span class="telemetry-value">Max ${this.formatReading(n, 0, "A")}</span>
                <ha-icon class="telemetry-icon" .icon=${b}></ha-icon>
              </div>
              ${u ? T`<div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.linkquality_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatReading(h, 0, ut)}</span>
                <ha-icon class="telemetry-icon" .icon=${dt}></ha-icon>
              </div>` : ""}
            </div>
          </div>

          <div class="metrics">
            <div class="metric" @click=${() => this.showMoreInfo(o)} style="cursor:pointer;">
              <div class="metric-label">Power</div>
              <div class="metric-value">${this.formatReading(l, 1, "kW")}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Current</div>
              ${a.map((m, At) => T`
                <div class="metric-value" @click=${() => this.showMoreInfo(m)} style="cursor:pointer;">
                  ${a.length > 1 ? `${["A", "B", "C"][At]}: ` : ""}${this.formatReading(this.getNumberValue(m), 1, "A")}
                </div>
              `)}
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(this.config.energy_entity)} style="cursor:pointer;">
              <div class="metric-label">Session</div>
              <div class="metric-value">${this.formatReading(wt, 2, "kWh")}</div>
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
V.styles = Ct`
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
ht([
  Qt({ attribute: !1 })
], V.prototype, "hass", 2);
V = ht([
  Jt("amina-s-card")
], V);
customElements.define("amina-s-card-config-editor", ee);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "amina-s-card",
  name: "Amina S Card",
  description: "Amina S EV charger card for Zigbee2MQTT and ZHA with the Amina S quirk."
});
export {
  V as AminaSCard
};
