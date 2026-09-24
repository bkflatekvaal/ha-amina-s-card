/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, z = T.ShadowRoot && (T.ShadyCSS === void 0 || T.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), j = /* @__PURE__ */ new WeakMap();
let nt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (z && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = j.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && j.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (n) => new nt(typeof n == "string" ? n : n + "", void 0, q), gt = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, a) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[a + 1], n[0]);
  return new nt(e, n, q);
}, yt = (n, t) => {
  if (z) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = T.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, Z = z ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return mt(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _t, defineProperty: ft, getOwnPropertyDescriptor: vt, getOwnPropertyNames: $t, getOwnPropertySymbols: bt, getPrototypeOf: wt } = Object, y = globalThis, J = y.trustedTypes, xt = J ? J.emptyScript : "", At = y.reactiveElementPolyfillSupport, E = (n, t) => n, H = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? xt : null;
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
} }, V = (n, t) => !_t(n, t), G = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: V };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = G) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && ft(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = vt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: s, set(r) {
      const l = s?.call(this);
      a?.call(this, r), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? G;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties"))) return;
    const t = wt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const e = this.properties, i = [...$t(e), ...bt(e)];
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
      for (const s of i) e.unshift(Z(s));
    } else t !== void 0 && e.push(Z(t));
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
    return yt(t, this.constructor.elementStyles), t;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : H).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), r = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : H;
      this._$Em = s;
      const l = r.fromAttribute(e, a.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    if (t !== void 0) {
      const r = this.constructor;
      if (s === !1 && (a = this[t]), i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? V)(a, e) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: a }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), a !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [s, a] of this._$Ep) this[s] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, a] of i) {
        const { wrapped: r } = a, l = this[s];
        r !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, a, l);
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
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[E("elementProperties")] = /* @__PURE__ */ new Map(), b[E("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: b }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, Q = (n) => n, L = C.trustedTypes, Y = L ? L.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, rt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, at = "?" + g, Et = `<${at}>`, v = document, P = () => v.createComment(""), M = (n) => n === null || typeof n != "object" && typeof n != "function", B = Array.isArray, Ct = (n) => B(n) || typeof n?.[Symbol.iterator] == "function", D = `[ 	
\f\r]`, A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, K = />/g, _ = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), tt = /'/g, et = /"/g, ot = /^(?:script|style|textarea|title)$/i, St = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), it = St(1), w = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), st = /* @__PURE__ */ new WeakMap(), f = v.createTreeWalker(v, 129);
function lt(n, t) {
  if (!B(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Y !== void 0 ? Y.createHTML(t) : t;
}
const kt = (n, t) => {
  const e = n.length - 1, i = [];
  let s, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = A;
  for (let l = 0; l < e; l++) {
    const o = n[l];
    let h, d, c = -1, u = 0;
    for (; u < o.length && (r.lastIndex = u, d = r.exec(o), d !== null); ) u = r.lastIndex, r === A ? d[1] === "!--" ? r = X : d[1] !== void 0 ? r = K : d[2] !== void 0 ? (ot.test(d[2]) && (s = RegExp("</" + d[2], "g")), r = _) : d[3] !== void 0 && (r = _) : r === _ ? d[0] === ">" ? (r = s ?? A, c = -1) : d[1] === void 0 ? c = -2 : (c = r.lastIndex - d[2].length, h = d[1], r = d[3] === void 0 ? _ : d[3] === '"' ? et : tt) : r === et || r === tt ? r = _ : r === X || r === K ? r = A : (r = _, s = void 0);
    const m = r === _ && n[l + 1].startsWith("/>") ? " " : "";
    a += r === A ? o + Et : c >= 0 ? (i.push(h), o.slice(0, c) + rt + o.slice(c) + g + m) : o + g + (c === -2 ? l : m);
  }
  return [lt(n, a + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class N {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let a = 0, r = 0;
    const l = t.length - 1, o = this.parts, [h, d] = kt(t, e);
    if (this.el = N.createElement(h, i), f.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = f.nextNode()) !== null && o.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(rt)) {
          const u = d[r++], m = s.getAttribute(c).split(g), $ = /([.?@])?(.*)/.exec(u);
          o.push({ type: 1, index: a, name: $[2], strings: m, ctor: $[1] === "." ? Mt : $[1] === "?" ? Nt : $[1] === "@" ? Ot : R }), s.removeAttribute(c);
        } else c.startsWith(g) && (o.push({ type: 6, index: a }), s.removeAttribute(c));
        if (ot.test(s.tagName)) {
          const c = s.textContent.split(g), u = c.length - 1;
          if (u > 0) {
            s.textContent = L ? L.emptyScript : "";
            for (let m = 0; m < u; m++) s.append(c[m], P()), f.nextNode(), o.push({ type: 2, index: ++a });
            s.append(c[u], P());
          }
        }
      } else if (s.nodeType === 8) if (s.data === at) o.push({ type: 2, index: a });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(g, c + 1)) !== -1; ) o.push({ type: 7, index: a }), c += g.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = v.createElement("template");
    return i.innerHTML = t, i;
  }
}
function x(n, t, e = n, i) {
  if (t === w) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const a = M(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = x(n, s._$AS(n, t.values), s, i)), t;
}
class Pt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? v).importNode(e, !0);
    f.currentNode = s;
    let a = f.nextNode(), r = 0, l = 0, o = i[0];
    for (; o !== void 0; ) {
      if (r === o.index) {
        let h;
        o.type === 2 ? h = new U(a, a.nextSibling, this, t) : o.type === 1 ? h = new o.ctor(a, o.name, o.strings, this, t) : o.type === 6 && (h = new Ut(a, this, t)), this._$AV.push(h), o = i[++l];
      }
      r !== o?.index && (a = f.nextNode(), r++);
    }
    return f.currentNode = v, s;
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
    t = x(this, t, e), M(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ct(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = N.createElement(lt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const a = new Pt(s, this), r = a.u(this.options);
      a.p(e), this.T(r), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = st.get(t.strings);
    return e === void 0 && st.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    B(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const a of t) s === e.length ? e.push(i = new U(this.O(P()), this.O(P()), this, this.options)) : i = e[s], i._$AI(a), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Q(t).nextSibling;
      Q(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class R {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, a) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, e = this, i, s) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) t = x(this, t, e, 0), r = !M(t) || t !== this._$AH && t !== w, r && (this._$AH = t);
    else {
      const l = t;
      let o, h;
      for (t = a[0], o = 0; o < a.length - 1; o++) h = x(this, l[i + o], e, o), h === w && (h = this._$AH[o]), r || (r = !M(h) || h !== this._$AH[o]), h === p ? t = p : t !== p && (t += (h ?? "") + a[o + 1]), this._$AH[o] = h;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Mt extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Nt extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Ot extends R {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? p) === w) return;
    const i = this._$AH, s = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== p && (i === p || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ut {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const Tt = C.litHtmlPolyfillSupport;
Tt?.(N, U), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.3.2");
const Ht = (n, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = e?.renderBefore ?? null;
    i._$litPart$ = s = new U(t.insertBefore(P(), a), a, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class k extends b {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
k._$litElement$ = !0, k.finalized = !0, S.litElementHydrateSupport?.({ LitElement: k });
const Lt = S.litElementPolyfillSupport;
Lt?.({ LitElement: k });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rt = (n) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(n, t);
  }) : customElements.define(n, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: V }, zt = (n = Dt, t, e) => {
  const { kind: i, metadata: s } = e;
  let a = globalThis.litPropertyMetadata.get(s);
  if (a === void 0 && globalThis.litPropertyMetadata.set(s, a = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), a.set(e.name, n), i === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const o = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, o, n, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, n, l), l;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(l) {
      const o = this[r];
      t.call(this, l), this.requestUpdate(r, o, n, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ct(n) {
  return (t, e) => typeof e == "object" ? zt(n, t, e) : ((i, s, a) => {
    const r = s.hasOwnProperty(a);
    return s.constructor.createProperty(a, i), r ? Object.getOwnPropertyDescriptor(s, a) : void 0;
  })(n, t, e);
}
var qt = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, I = (n, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? Vt(t, e) : t, a = n.length - 1, r; a >= 0; a--)
    (r = n[a]) && (s = (i ? r(t, e, s) : r(s)) || s);
  return i && s && qt(t, e, s), s;
};
class Bt extends HTMLElement {
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
    const e = this.hass?.states ?? {}, i = Object.keys(e), a = {
      status_entity: (r) => r ? r.entity_id.startsWith("sensor.") : !1,
      power_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "power" || r.attributes.unit_of_measurement === "kW" || r.attributes.unit_of_measurement === "W") : !1,
      current_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "current" || r.attributes.unit_of_measurement === "A") : !1,
      voltage_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "voltage" || r.attributes.unit_of_measurement === "V") : !1,
      linkquality_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "signal_strength" || r.attributes.device_class === "signal" || ["lqi", "dB", "dBm"].includes(r.attributes.unit_of_measurement) || r.entity_id.toLowerCase().includes("linkquality")) : !1,
      energy_entity: (r) => r ? r.entity_id.startsWith("sensor.") && (r.attributes.device_class === "energy" || r.attributes.unit_of_measurement === "kWh" || r.attributes.unit_of_measurement === "Wh") : !1,
      charge_limit_entity: (r) => r ? r.entity_id.startsWith("number.") : !1,
      charger_entity: (r) => r ? r.entity_id.startsWith("switch.") : !1,
      alarm_entity: (r) => r ? r.entity_id.startsWith("binary_sensor.") : !1,
      alarms_entity: (r) => r ? r.entity_id.startsWith("sensor.") : !1,
      derated_entity: (r) => r ? r.entity_id.startsWith("binary_sensor.") : !1
    }[t] || (() => !0);
    return i.filter((r) => a(this.hass.states[r])).sort();
  }
  getDefaultEntity(t) {
    const s = ((this._config.status_entity ?? "").trim().split(".").pop() ?? "").replace(/_status$/i, "").replace(/_ev$/i, "").replace(/_charger$/i, "").trim();
    return s ? {
      power_entity: `sensor.${s}_power`,
      current_entity: `sensor.${s}_current`,
      voltage_entity: `sensor.${s}_voltage`,
      linkquality_entity: `sensor.${s}_linkquality`,
      energy_entity: `sensor.${s}_last_session_energy`,
      charge_limit_entity: `number.${s}_charge_limit`,
      charger_entity: `switch.${s}`,
      alarm_entity: `binary_sensor.${s}_alarm_active`,
      alarms_entity: `sensor.${s}_alarms`,
      derated_entity: `binary_sensor.${s}_derated`
    }[t] : void 0;
  }
  appendFieldHelper(t, e) {
    const i = document.createElement("div"), s = this.getDefaultEntity(e);
    i.textContent = s ? `Default: ${s}` : "Select a status entity to calculate the default", i.style.fontSize = "12px", i.style.color = "var(--secondary-text-color)", t.appendChild(i);
  }
  renderEntityField(t, e, i = !1) {
    if (customElements.get("ha-entity-picker")) {
      const d = document.createElement("div");
      d.style.display = "grid", d.style.gap = "4px";
      const c = document.createElement("label");
      c.textContent = e + (i ? " *" : ""), c.style.fontSize = "12px", c.style.color = "var(--primary-text-color)", d.appendChild(c), t !== "status_entity" && this.appendFieldHelper(d, t);
      const u = document.createElement("ha-entity-picker");
      return u.dataset.key = t, u.hass = this._hass, u.value = this._config[t] ?? "", u.includeDomains = this.getDomainForField(t), u.includeDeviceClasses = this.getDeviceClassesForField(t), u.includeUnitOfMeasurement = this.getUnitsForField(t), u.style.width = "100%", u.addEventListener("value-changed", (m) => {
        this.updateConfig(t, m.detail?.value);
      }), d.appendChild(u), d;
    }
    const s = document.createElement("div");
    s.style.display = "grid", s.style.gap = "4px";
    const a = document.createElement("label");
    a.textContent = e + (i ? " *" : ""), a.style.fontSize = "12px", a.style.color = "var(--primary-text-color)", s.appendChild(a), t !== "status_entity" && this.appendFieldHelper(s, t);
    const r = document.createElement("select");
    r.dataset.key = t, r.style.width = "100%", r.style.padding = "8px 10px", r.style.border = "1px solid var(--divider-color)", r.style.borderRadius = "8px", r.style.background = "var(--card-background-color)", r.style.color = "var(--primary-text-color)";
    const l = this._config[t] ?? "", o = this.getEntityOptions(t), h = document.createElement("option");
    return h.value = "", h.textContent = "Select entity", r.appendChild(h), o.forEach((d) => {
      const c = document.createElement("option");
      c.value = d, c.textContent = d, c.selected = d === l, r.appendChild(c);
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
    return t === "linkquality_entity" ? ["lqi"] : void 0;
  }
  renderTextField(t, e) {
    const i = document.createElement("div");
    i.style.display = "grid", i.style.gap = "4px";
    const s = document.createElement("label");
    s.textContent = e, s.style.fontSize = "12px", s.style.color = "var(--primary-text-color)", i.appendChild(s);
    const a = document.createElement("input");
    return a.dataset.key = t, a.value = this._config[t] ?? "", a.style.padding = "8px 10px", a.style.border = "1px solid var(--divider-color)", a.style.borderRadius = "8px", a.style.background = "var(--card-background-color)", a.style.color = "var(--primary-text-color)", a.addEventListener("input", () => this.updateConfig()), i.appendChild(a), i;
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
    }[t] || ["sensor", "binary_sensor", "number", "switch"];
  }
  updateConfig(t, e) {
    const i = { ...this._config };
    this.querySelectorAll("[data-key]").forEach((a) => {
      const r = a.getAttribute("data-key");
      if (!r) return;
      const l = a.value ?? a.getAttribute("value") ?? "";
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
let O = class extends k {
  setConfig(n) {
    if (!n.status_entity)
      throw new Error("You must set status_entity");
    const t = n.status_entity, e = this.extractStatusBaseName(t), i = {
      title: "Amina S Charger",
      status_entity: t,
      power_entity: e ? `sensor.${e}_power` : void 0,
      current_entity: e ? `sensor.${e}_current` : void 0,
      voltage_entity: e ? `sensor.${e}_voltage` : void 0,
      linkquality_entity: e ? `sensor.${e}_linkquality` : void 0,
      energy_entity: e ? `sensor.${e}_last_session_energy` : void 0,
      charge_limit_entity: e ? `number.${e}_charge_limit` : void 0,
      charger_entity: e ? `switch.${e}` : void 0,
      alarm_entity: e ? `binary_sensor.${e}_alarm_active` : void 0,
      alarms_entity: e ? `sensor.${e}_alarms` : void 0,
      derated_entity: e ? `binary_sensor.${e}_derated` : void 0
    };
    this.config = {
      ...i,
      ...n
    };
  }
  extractStatusBaseName(n) {
    const t = n.split(".").pop() ?? n;
    return t ? t.replace(/_status$/i, "").replace(/_ev$/i, "").replace(/_charger$/i, "").trim() : "";
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
    const t = this.getEntity(n)?.state, e = Number(t);
    return Number.isFinite(e) ? e : 0;
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
    const n = this.normaliseStatus(this.getState(this.config.status_entity)), t = n.toLowerCase(), e = t === "charging", i = t === "ev connected", s = this.getBooleanValue(this.config.alarm_entity), a = this.getBooleanValue(this.config.derated_entity), r = this.getAlarmMessage(), l = !!r;
    let o = n, h = "status-connected";
    return t === "charging" ? (o = "Charging", h = "status-charging") : t === "ev connected" ? (o = "EV Connected", h = "status-connected") : t === "not connected" ? (o = "Not Connected", h = "status-connected") : (t === "unavailable" || t === "unknown") && (o = n, h = "status-warning"), { status: n, connected: i, charging: e, alarmActive: s, derated: a, alarmText: r, mainStatus: o, statusClass: h, secondary: l ? r : e ? "Power is being delivered" : i ? "Vehicle connected" : "Waiting for vehicle" };
  }
  render() {
    if (!this.hass || !this.config)
      return it``;
    const n = this.getNumberValue(this.config.charge_limit_entity), t = this.getNumberValue(this.config.power_entity), e = this.getNumberValue(this.config.current_entity), i = this.getNumberValue(this.config.voltage_entity), s = this.getNumberValue(this.config.linkquality_entity), a = this.getEntityIcon(this.config.voltage_entity) || "mdi:sine-wave", r = this.getEntityIcon(this.config.linkquality_entity) || "mdi:signal", l = this.getEntityUnit(this.config.linkquality_entity) || "", { mainStatus: o, statusClass: h, secondary: d, charging: c, connected: u, alarmActive: m, derated: $, alarmText: It } = this.getStatusMeta(), ht = c, dt = u, W = this.getNumberValue(this.config.energy_entity), ut = ht || dt ? W : Math.max(W, 0), F = this.getState(this.config.charger_entity).toLowerCase() === "on", pt = this.getLedColor();
    return it`
      <ha-card>
        <div class="card">
          <div class="card-header">${this.config.title}</div>
          <div class="header">
            <div class="charger-visual" aria-label="Amina S charger icon" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">
              <svg class="charger-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path fill="${pt}" d="M9.611 2c-.575 0-1.038.463-1.038 1.039v8.953h6.854V3.04c0-.577-.464-1.039-1.038-1.039Zm4.587.609a.596.596 0 0 1 .598.596.596.596 0 0 1-.598.596.596.596 0 0 1-.598-.596.596.596 0 0 1 .598-.596M8.573 12.3v4.136c0 .575.463 1.038 1.038 1.038h4.777c.575 0 1.038-.463 1.038-1.038v-4.135Zm2.077 5.487v1.266a.623.623 0 0 0 .624.623h.205V22h1.042v-2.325h.206a.623.623 0 0 0 .623-.623v-1.266Z"/>
              </svg>
            </div>
            <div class="status-wrap">
              <div class="status-main ${h}" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">${o}</div>
              <div class="status-secondary ${m || $ ? "status-warning" : ""}">${d}</div>
              <button class="action-toggle" @click=${() => this.toggleCharger()} aria-label="${F ? "Stop charging" : "Start charging"}">
                ${F ? "Stop ■" : "Start ▶"}
              </button>
            </div>
            <div class="top-right">
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.voltage_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatNumber(i, 1)} V</span>
                <ha-icon class="telemetry-icon" .icon=${a}></ha-icon>
              </div>
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.linkquality_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatNumber(s, 0)}${l ? ` ${l}` : ""}</span>
                <ha-icon class="telemetry-icon" .icon=${r}></ha-icon>
              </div>
            </div>
          </div>

          <div class="metrics">
            <div class="metric" @click=${() => this.showMoreInfo(this.config.charge_limit_entity)} style="cursor:pointer;">
              <div class="metric-label">Charge limit</div>
              <div class="metric-value">${this.formatNumber(n, 0)} A</div>
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(this.config.power_entity)} style="cursor:pointer;">
              <div class="metric-label">Power</div>
              <div class="metric-value">${this.formatNumber(t / 1e3, 1)} kW</div>
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(this.config.current_entity)} style="cursor:pointer;">
              <div class="metric-label">Current</div>
              <div class="metric-value">${this.formatNumber(e, 1)} A</div>
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(this.config.energy_entity)} style="cursor:pointer;">
              <div class="metric-label">Session</div>
              <div class="metric-value">${this.formatNumber(ut, 2)} kWh</div>
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
      title: "Amina S Charger",
      status_entity: "sensor.amina_s_ev_status",
      power_entity: "sensor.amina_s_power",
      current_entity: "sensor.amina_s_current",
      voltage_entity: "sensor.amina_s_voltage",
      linkquality_entity: "sensor.amina_s_linkquality",
      energy_entity: "sensor.amina_s_last_session_energy",
      charge_limit_entity: "number.amina_s_charge_limit",
      charger_entity: "switch.amina_s",
      alarm_entity: "binary_sensor.amina_s_alarm_active",
      alarms_entity: "sensor.amina_s_alarms",
      derated_entity: "binary_sensor.amina_s_derated",
      advanced: !1
    };
  }
  static getConfigElement() {
    return document.createElement("amina-s-card-config-editor");
  }
};
O.styles = gt`
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
      grid-template-columns: repeat(4, minmax(0, 1fr));
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
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;
I([
  ct({ attribute: !1 })
], O.prototype, "hass", 2);
I([
  ct({ attribute: !1 })
], O.prototype, "config", 2);
O = I([
  Rt("amina-s-card")
], O);
customElements.define("amina-s-card-config-editor", Bt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "amina-s-card",
  name: "Amina S Card",
  description: "Amina S EV charger card using the native Zigbee2MQTT exposes."
});
export {
  O as AminaSCard
};
