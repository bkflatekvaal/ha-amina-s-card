/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, z = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, V = Symbol(), F = /* @__PURE__ */ new WeakMap();
let st = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== V) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (z && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = F.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && F.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (r) => new st(typeof r == "string" ? r : r + "", void 0, V), ft = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[o + 1], r[0]);
  return new st(e, r, V);
}, yt = (r, t) => {
  if (z) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = U.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, j = z ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return mt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _t, defineProperty: vt, getOwnPropertyDescriptor: $t, getOwnPropertyNames: bt, getOwnPropertySymbols: xt, getPrototypeOf: wt } = Object, f = globalThis, Z = f.trustedTypes, At = Z ? Z.emptyScript : "", Et = f.reactiveElementPolyfillSupport, E = (r, t) => r, T = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? At : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, W = (r, t) => !_t(r, t), J = { attribute: !0, type: String, converter: T, reflect: !1, useDefault: !1, hasChanged: W };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), f.litPropertyMetadata ?? (f.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = J) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && vt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = $t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const l = s?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? J;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties"))) return;
    const t = wt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const e = this.properties, i = [...bt(e), ...xt(e)];
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
      for (const s of i) e.unshift(j(s));
    } else t !== void 0 && e.push(j(t));
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
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : T).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : T;
      this._$Em = s;
      const l = n.fromAttribute(e, o.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = n.getPropertyOptions(t)), !((i.hasChanged ?? W)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        const { wrapped: n } = o, l = this[s];
        n !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
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
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[E("elementProperties")] = /* @__PURE__ */ new Map(), b[E("finalized")] = /* @__PURE__ */ new Map(), Et?.({ ReactiveElement: b }), (f.reactiveElementVersions ?? (f.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, G = (r) => r, H = C.trustedTypes, Q = H ? H.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, nt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, rt = "?" + m, Ct = `<${rt}>`, v = document, k = () => v.createComment(""), M = (r) => r === null || typeof r != "object" && typeof r != "function", q = Array.isArray, St = (r) => q(r) || typeof r?.[Symbol.iterator] == "function", D = `[ 	
\f\r]`, A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Y = /-->/g, X = />/g, y = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), K = /'/g, tt = /"/g, ot = /^(?:script|style|textarea|title)$/i, Pt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), et = Pt(1), x = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), _ = v.createTreeWalker(v, 129);
function at(r, t) {
  if (!q(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(t) : t;
}
const kt = (r, t) => {
  const e = r.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = A;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let d, h, c = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, h = n.exec(a), h !== null); ) u = n.lastIndex, n === A ? h[1] === "!--" ? n = Y : h[1] !== void 0 ? n = X : h[2] !== void 0 ? (ot.test(h[2]) && (s = RegExp("</" + h[2], "g")), n = y) : h[3] !== void 0 && (n = y) : n === y ? h[0] === ">" ? (n = s ?? A, c = -1) : h[1] === void 0 ? c = -2 : (c = n.lastIndex - h[2].length, d = h[1], n = h[3] === void 0 ? y : h[3] === '"' ? tt : K) : n === tt || n === K ? n = y : n === Y || n === X ? n = A : (n = y, s = void 0);
    const g = n === y && r[l + 1].startsWith("/>") ? " " : "";
    o += n === A ? a + Ct : c >= 0 ? (i.push(d), a.slice(0, c) + nt + a.slice(c) + m + g) : a + m + (c === -2 ? l : g);
  }
  return [at(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class O {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [d, h] = kt(t, e);
    if (this.el = O.createElement(d, i), _.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = _.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(nt)) {
          const u = h[n++], g = s.getAttribute(c).split(m), $ = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: $[2], strings: g, ctor: $[1] === "." ? Ot : $[1] === "?" ? Nt : $[1] === "@" ? Ut : R }), s.removeAttribute(c);
        } else c.startsWith(m) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (ot.test(s.tagName)) {
          const c = s.textContent.split(m), u = c.length - 1;
          if (u > 0) {
            s.textContent = H ? H.emptyScript : "";
            for (let g = 0; g < u; g++) s.append(c[g], k()), _.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[u], k());
          }
        }
      } else if (s.nodeType === 8) if (s.data === rt) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(m, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += m.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = v.createElement("template");
    return i.innerHTML = t, i;
  }
}
function w(r, t, e = r, i) {
  if (t === x) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = M(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = w(r, s._$AS(r, t.values), s, i)), t;
}
class Mt {
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
    _.currentNode = s;
    let o = _.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let d;
        a.type === 2 ? d = new N(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new Tt(o, this, t)), this._$AV.push(d), a = i[++l];
      }
      n !== a?.index && (o = _.nextNode(), n++);
    }
    return _.currentNode = v, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class N {
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
    t = w(this, t, e), M(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
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
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = O.createElement(at(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const o = new Mt(s, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = it.get(t.strings);
    return e === void 0 && it.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new N(this.O(k()), this.O(k()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = G(t).nextSibling;
      G(t).remove(), t = i;
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
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = w(this, t, e, 0), n = !M(t) || t !== this._$AH && t !== x, n && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = w(this, l[i + a], e, a), d === x && (d = this._$AH[a]), n || (n = !M(d) || d !== this._$AH[a]), d === p ? t = p : t !== p && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ot extends R {
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
class Ut extends R {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? p) === x) return;
    const i = this._$AH, s = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== p && (i === p || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Tt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const Ht = C.litHtmlPolyfillSupport;
Ht?.(O, N), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.3.2");
const Lt = (r, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = s = new N(t.insertBefore(k(), o), o, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class P extends b {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(e, this.renderRoot, this.renderOptions);
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
P._$litElement$ = !0, P.finalized = !0, S.litElementHydrateSupport?.({ LitElement: P });
const Rt = S.litElementPolyfillSupport;
Rt?.({ LitElement: P });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = { attribute: !0, type: String, converter: T, reflect: !1, hasChanged: W }, Vt = (r = zt, t, e) => {
  const { kind: i, metadata: s } = e;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(e.name, r), i === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, r, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, r, l), l;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, r, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Wt(r) {
  return (t, e) => typeof e == "object" ? Vt(r, t, e) : ((i, s, o) => {
    const n = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(r, t, e);
}
function lt(r, t = {}) {
  const e = r.split(".").pop()?.replace(/_status$/i, "").replace(/_ev$/i, "").replace(/_charger$/i, "").trim();
  if (!e) return {};
  const i = (...s) => s.find((o) => o in t) ?? s[0];
  return {
    power_entity: `sensor.${e}_power`,
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
var qt = Object.defineProperty, It = Object.getOwnPropertyDescriptor, ct = (r, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? It(t, e) : t, o = r.length - 1, n; o >= 0; o--)
    (n = r[o]) && (s = (i ? n(t, e, s) : n(s)) || s);
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
    const e = this.hass?.states ?? {}, i = Object.keys(e), o = {
      status_entity: (n) => n ? n.entity_id.startsWith("sensor.") : !1,
      power_entity: (n) => n ? n.entity_id.startsWith("sensor.") && (n.attributes.device_class === "power" || n.attributes.unit_of_measurement === "kW" || n.attributes.unit_of_measurement === "W") : !1,
      current_entity: (n) => n ? n.entity_id.startsWith("sensor.") && (n.attributes.device_class === "current" || n.attributes.unit_of_measurement === "A") : !1,
      voltage_entity: (n) => n ? n.entity_id.startsWith("sensor.") && (n.attributes.device_class === "voltage" || n.attributes.unit_of_measurement === "V") : !1,
      linkquality_entity: (n) => n ? n.entity_id.startsWith("sensor.") && (n.attributes.device_class === "signal_strength" || n.attributes.device_class === "signal" || ["lqi", "dB", "dBm"].includes(n.attributes.unit_of_measurement) || n.entity_id.toLowerCase().includes("linkquality") || n.entity_id.toLowerCase().endsWith("_lqi")) : !1,
      energy_entity: (n) => n ? n.entity_id.startsWith("sensor.") && (n.attributes.device_class === "energy" || n.attributes.unit_of_measurement === "kWh" || n.attributes.unit_of_measurement === "Wh") : !1,
      charge_limit_entity: (n) => n ? n.entity_id.startsWith("number.") : !1,
      charger_entity: (n) => n ? n.entity_id.startsWith("switch.") : !1,
      alarm_entity: (n) => n ? n.entity_id.startsWith("binary_sensor.") : !1,
      alarms_entity: (n) => n ? n.entity_id.startsWith("sensor.") : !1,
      derated_entity: (n) => n ? n.entity_id.startsWith("binary_sensor.") : !1
    }[t] || (() => !0);
    return i.filter((n) => o(this.hass.states[n])).sort();
  }
  getDefaultEntity(t) {
    return lt(this._config.status_entity ?? "", this.hass?.states)[t];
  }
  appendFieldHelper(t, e) {
    const i = document.createElement("div"), s = this.getDefaultEntity(e);
    i.textContent = s ? `Default: ${s}` : "Select a status entity to calculate the default", i.style.fontSize = "12px", i.style.color = "var(--secondary-text-color)", t.appendChild(i);
  }
  renderEntityField(t, e, i = !1) {
    if (customElements.get("ha-entity-picker")) {
      const h = document.createElement("div");
      h.style.display = "grid", h.style.gap = "4px";
      const c = document.createElement("label");
      c.textContent = e + (i ? " *" : ""), c.style.fontSize = "12px", c.style.color = "var(--primary-text-color)", h.appendChild(c), t !== "status_entity" && this.appendFieldHelper(h, t);
      const u = document.createElement("ha-entity-picker");
      return u.dataset.key = t, u.hass = this._hass, u.value = this._config[t] ?? "", u.includeDomains = this.getDomainForField(t), u.includeDeviceClasses = this.getDeviceClassesForField(t), u.includeUnitOfMeasurement = this.getUnitsForField(t), u.style.width = "100%", u.addEventListener("value-changed", (g) => {
        this.updateConfig(t, g.detail?.value);
      }), h.appendChild(u), h;
    }
    const s = document.createElement("div");
    s.style.display = "grid", s.style.gap = "4px";
    const o = document.createElement("label");
    o.textContent = e + (i ? " *" : ""), o.style.fontSize = "12px", o.style.color = "var(--primary-text-color)", s.appendChild(o), t !== "status_entity" && this.appendFieldHelper(s, t);
    const n = document.createElement("select");
    n.dataset.key = t, n.style.width = "100%", n.style.padding = "8px 10px", n.style.border = "1px solid var(--divider-color)", n.style.borderRadius = "8px", n.style.background = "var(--card-background-color)", n.style.color = "var(--primary-text-color)";
    const l = this._config[t] ?? "", a = this.getEntityOptions(t), d = document.createElement("option");
    return d.value = "", d.textContent = "Select entity", n.appendChild(d), a.forEach((h) => {
      const c = document.createElement("option");
      c.value = h, c.textContent = h, c.selected = h === l, n.appendChild(c);
    }), n.addEventListener("change", () => this.updateConfig(t, n.value)), s.appendChild(n), s;
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
      const n = o.getAttribute("data-key");
      if (!n) return;
      const l = o.value ?? o.getAttribute("value") ?? "";
      l ? i[n] = l : delete i[n];
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
    ].forEach(([o, n]) => {
      t.appendChild(this.renderEntityField(o, n, !1));
    }), this.innerHTML = "", this.appendChild(t);
  }
}
let L = class extends P {
  get config() {
    if (this._config)
      return {
        title: "Amina S Charger",
        ...lt(this._config.status_entity, this.hass?.states),
        ...this._config
      };
  }
  setConfig(r) {
    if (!r.status_entity)
      throw new Error("You must set status_entity");
    this._config = { ...r }, this.requestUpdate();
  }
  getEntity(r) {
    if (!(!r || !this.hass?.states?.[r]))
      return this.hass.states[r];
  }
  getState(r) {
    return this.getEntity(r)?.state ?? "-";
  }
  getEntityIcon(r) {
    const t = this.getEntity(r)?.attributes?.icon;
    return typeof t == "string" && t.trim() ? t : "";
  }
  getEntityUnit(r) {
    const t = this.getEntity(r)?.attributes?.unit_of_measurement;
    return typeof t == "string" && t.trim() ? t : "";
  }
  getNumberValue(r) {
    const t = this.getEntity(r)?.state, e = Number(t);
    return Number.isFinite(e) ? e : 0;
  }
  getBooleanValue(r) {
    const t = this.getState(r).toLowerCase();
    return t === "on" || t === "true" || t === "enabled" || t === "enable";
  }
  normaliseStatus(r) {
    return r?.trim() || "Unknown";
  }
  getAlarmList(r) {
    const t = this.getEntity(r)?.state;
    if (Array.isArray(t)) return t.map(String);
    if (typeof t == "string") {
      const e = t.replace(/\[|\]|'/g, "").trim();
      return e ? e.split(",").map((i) => i.trim()).filter(Boolean) : [];
    }
    return [];
  }
  getAlarmMessage() {
    const r = this.getBooleanValue(this.config.alarm_entity), t = this.getBooleanValue(this.config.derated_entity);
    if (!r && !t) return "";
    const e = this.getAlarmList(this.config.alarms_entity).map((i) => i.trim()).filter((i) => !!i).filter((i) => !["unknown", "none", "normal", "idle", "no alarm", "no_alarm", "-"].includes(i.toLowerCase()));
    return e.length ? e.join(", ") : t ? "Power reduced" : "Warning";
  }
  showMoreInfo(r) {
    r && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: r },
        bubbles: !0,
        composed: !0
      })
    );
  }
  formatNumber(r, t = 1) {
    if (!Number.isFinite(r)) return "-";
    const e = this.hass?.config?.locale || this.hass?.locale || void 0;
    return new Intl.NumberFormat(e, {
      minimumFractionDigits: t,
      maximumFractionDigits: t,
      useGrouping: !1
    }).format(r);
  }
  async toggleCharger() {
    const r = this.config.charger_entity;
    if (!r) return;
    if (this.getState(r).toLowerCase() === "on") {
      await this.hass.callService("switch", "turn_off", { entity_id: r });
      return;
    }
    await this.hass.callService("switch", "turn_on", { entity_id: r });
  }
  getLedColor() {
    const r = this.normaliseStatus(this.getState(this.config.status_entity)).toLowerCase(), t = this.getBooleanValue(this.config.alarm_entity), e = this.getBooleanValue(this.config.derated_entity);
    return r === "charging" ? "#52d98f" : t || e ? "#ffb35c" : r === "ev connected" ? "#7ec8ff" : "#dfe7f2";
  }
  getStatusMeta() {
    const r = this.normaliseStatus(this.getState(this.config.status_entity)), t = this.getEntity(this.config.sub_status_entity)?.state, e = r.toLowerCase(), i = e === "charging", s = e === "ev connected", o = this.getBooleanValue(this.config.alarm_entity), n = this.getBooleanValue(this.config.derated_entity), l = this.getAlarmMessage(), a = !!l;
    let d = r, h = "status-connected";
    e === "charging" ? (d = "Charging", h = "status-charging") : e === "ev connected" ? (d = "EV Connected", h = "status-connected") : e === "not connected" ? (d = "Not Connected", h = "status-connected") : (e === "unavailable" || e === "unknown") && (d = r, h = "status-warning");
    const c = t ? String(t) : a ? l : i ? "Power is being delivered" : s ? "Vehicle connected" : "Waiting for vehicle";
    return { status: r, connected: s, charging: i, alarmActive: o, derated: n, alarmText: l, mainStatus: d, statusClass: h, secondary: c };
  }
  render() {
    if (!this.hass || !this.config)
      return et``;
    const r = this.getNumberValue(this.config.charge_limit_entity), t = this.getNumberValue(this.config.power_entity), e = this.getNumberValue(this.config.current_entity), i = this.getNumberValue(this.config.voltage_entity), s = this.getNumberValue(this.config.linkquality_entity), o = this.getEntityIcon(this.config.voltage_entity) || "mdi:sine-wave", n = this.getEntityIcon(this.config.charge_limit_entity) || "mdi:ev-station", l = this.getEntityIcon(this.config.linkquality_entity) || "mdi:signal", a = this.getEntityUnit(this.config.linkquality_entity) || "", { mainStatus: d, statusClass: h, secondary: c, charging: u, connected: g, alarmActive: $, derated: ht, alarmText: Ft } = this.getStatusMeta(), dt = u, ut = g, I = this.getNumberValue(this.config.energy_entity), pt = dt || ut ? I : Math.max(I, 0), B = this.getState(this.config.charger_entity).toLowerCase() === "on", gt = this.getLedColor();
    return et`
      <ha-card>
        <div class="card">
          <div class="card-header">${this.config.title}</div>
          <div class="header">
            <div class="charger-visual" aria-label="Amina S charger icon" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">
              <svg class="charger-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path fill="${gt}" d="M9.611 2c-.575 0-1.038.463-1.038 1.039v8.953h6.854V3.04c0-.577-.464-1.039-1.038-1.039Zm4.587.609a.596.596 0 0 1 .598.596.596.596 0 0 1-.598.596.596.596 0 0 1-.598-.596.596.596 0 0 1 .598-.596M8.573 12.3v4.136c0 .575.463 1.038 1.038 1.038h4.777c.575 0 1.038-.463 1.038-1.038v-4.135Zm2.077 5.487v1.266a.623.623 0 0 0 .624.623h.205V22h1.042v-2.325h.206a.623.623 0 0 0 .623-.623v-1.266Z"/>
              </svg>
            </div>
            <div class="status-wrap">
              <div class="status-main ${h}" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">${d}</div>
              <div class="status-secondary ${$ || ht ? "status-warning" : ""}">${c}</div>
              <button class="action-toggle" @click=${() => this.toggleCharger()} aria-label="${B ? "Stop charging" : "Start charging"}">
                ${B ? "Stop ■" : "Start ▶"}
              </button>
            </div>
            <div class="top-right">
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.voltage_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatNumber(i, 1)} V</span>
                <ha-icon class="telemetry-icon" .icon=${o}></ha-icon>
              </div>
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.charge_limit_entity)} style="cursor:pointer;">
                <span class="telemetry-value">Max ${this.formatNumber(r, 0)} A</span>
                <ha-icon class="telemetry-icon" .icon=${n}></ha-icon>
              </div>
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.linkquality_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatNumber(s, 0)}${a ? ` ${a}` : ""}</span>
                <ha-icon class="telemetry-icon" .icon=${l}></ha-icon>
              </div>
            </div>
          </div>

          <div class="metrics">
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
              <div class="metric-value">${this.formatNumber(pt, 2)} kWh</div>
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
      advanced: !1
    };
  }
  static getConfigElement() {
    return document.createElement("amina-s-card-config-editor");
  }
};
L.styles = ft`
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
ct([
  Wt({ attribute: !1 })
], L.prototype, "hass", 2);
L = ct([
  Dt("amina-s-card")
], L);
customElements.define("amina-s-card-config-editor", Bt);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "amina-s-card",
  name: "Amina S Card",
  description: "Amina S EV charger card for Zigbee2MQTT and ZHA with the Amina S quirk."
});
export {
  L as AminaSCard
};
