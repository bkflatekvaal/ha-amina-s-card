/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, B = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, I = Symbol(), K = /* @__PURE__ */ new WeakMap();
let at = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== I) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const St = (s) => new at(typeof s == "string" ? s : s + "", void 0, I), Pt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, n, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + s[o + 1], s[0]);
  return new at(e, s, I);
}, kt = (s, t) => {
  if (B) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = R.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, s.appendChild(i);
  }
}, Q = B ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return St(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Nt, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Ot, getOwnPropertySymbols: Tt, getPrototypeOf: Ht } = Object, y = globalThis, Y = y.trustedTypes, Rt = Y ? Y.emptyScript : "", Lt = y.reactiveElementPolyfillSupport, P = (s, t) => s, L = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Rt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, j = (s, t) => !Mt(s, t), X = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: j };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = X) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && Nt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: o } = Ut(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const c = n?.call(this);
      o?.call(this, r), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? X;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = Ht(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, i = [...Ot(e), ...Tt(e)];
      for (const n of i) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, n] of e) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) e.unshift(Q(n));
    } else t !== void 0 && e.push(Q(t));
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
    return kt(t, this.constructor.elementStyles), t;
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
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : L).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = i.getPropertyOptions(n), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : L;
      this._$Em = n;
      const c = r.fromAttribute(e, o.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (o = this[t]), i ?? (i = r.getPropertyOptions(t)), !((i.hasChanged ?? j)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: o }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: r } = o, c = this[n];
        r !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[P("elementProperties")] = /* @__PURE__ */ new Map(), x[P("finalized")] = /* @__PURE__ */ new Map(), Lt?.({ ReactiveElement: x }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis, tt = (s) => s, z = k.trustedTypes, et = z ? z.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, lt = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, ct = "?" + f, zt = `<${ct}>`, b = document, U = () => b.createComment(""), O = (s) => s === null || typeof s != "object" && typeof s != "function", Z = Array.isArray, Wt = (s) => Z(s) || typeof s?.[Symbol.iterator] == "function", V = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, st = />/g, _ = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, rt = /"/g, ht = /^(?:script|style|textarea|title)$/i, qt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), S = qt(1), A = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), v = b.createTreeWalker(b, 129);
function dt(s, t) {
  if (!Z(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return et !== void 0 ? et.createHTML(t) : t;
}
const Vt = (s, t) => {
  const e = s.length - 1, i = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = C;
  for (let c = 0; c < e; c++) {
    const a = s[c];
    let d, h, l = -1, u = 0;
    for (; u < a.length && (r.lastIndex = u, h = r.exec(a), h !== null); ) u = r.lastIndex, r === C ? h[1] === "!--" ? r = it : h[1] !== void 0 ? r = st : h[2] !== void 0 ? (ht.test(h[2]) && (n = RegExp("</" + h[2], "g")), r = _) : h[3] !== void 0 && (r = _) : r === _ ? h[0] === ">" ? (r = n ?? C, l = -1) : h[1] === void 0 ? l = -2 : (l = r.lastIndex - h[2].length, d = h[1], r = h[3] === void 0 ? _ : h[3] === '"' ? rt : nt) : r === rt || r === nt ? r = _ : r === it || r === st ? r = C : (r = _, n = void 0);
    const g = r === _ && s[c + 1].startsWith("/>") ? " " : "";
    o += r === C ? a + zt : l >= 0 ? (i.push(d), a.slice(0, l) + lt + a.slice(l) + f + g) : a + f + (l === -2 ? c : g);
  }
  return [dt(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class T {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const c = t.length - 1, a = this.parts, [d, h] = Vt(t, e);
    if (this.el = T.createElement(d, i), v.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (n = v.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const l of n.getAttributeNames()) if (l.endsWith(lt)) {
          const u = h[r++], g = n.getAttribute(l).split(f), w = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: w[2], strings: g, ctor: w[1] === "." ? Ft : w[1] === "?" ? Bt : w[1] === "@" ? It : q }), n.removeAttribute(l);
        } else l.startsWith(f) && (a.push({ type: 6, index: o }), n.removeAttribute(l));
        if (ht.test(n.tagName)) {
          const l = n.textContent.split(f), u = l.length - 1;
          if (u > 0) {
            n.textContent = z ? z.emptyScript : "";
            for (let g = 0; g < u; g++) n.append(l[g], U()), v.nextNode(), a.push({ type: 2, index: ++o });
            n.append(l[u], U());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ct) a.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = n.data.indexOf(f, l + 1)) !== -1; ) a.push({ type: 7, index: o }), l += f.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = b.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(s, t, e = s, i) {
  if (t === A) return t;
  let n = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = O(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(s), n._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = E(s, n._$AS(s, t.values), n, i)), t;
}
class Dt {
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
    const { el: { content: e }, parts: i } = this._$AD, n = (t?.creationScope ?? b).importNode(e, !0);
    v.currentNode = n;
    let o = v.nextNode(), r = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new H(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new jt(o, this, t)), this._$AV.push(d), a = i[++c];
      }
      r !== a?.index && (o = v.nextNode(), r++);
    }
    return v.currentNode = b, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    t = E(this, t, e), O(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Wt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = T.createElement(dt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const o = new Dt(n, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const o of t) n === e.length ? e.push(i = new H(this.O(U()), this.O(U()), this, this.options)) : i = e[n], i._$AI(o), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = tt(t).nextSibling;
      tt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, e = this, i, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = E(this, t, e, 0), r = !O(t) || t !== this._$AH && t !== A, r && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = E(this, c[i + a], e, a), d === A && (d = this._$AH[a]), r || (r = !O(d) || d !== this._$AH[a]), d === p ? t = p : t !== p && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ft extends q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Bt extends q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class It extends q {
  constructor(t, e, i, n, o) {
    super(t, e, i, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? p) === A) return;
    const i = this._$AH, n = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== p && (i === p || n);
    n && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class jt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Zt = k.litHtmlPolyfillSupport;
Zt?.(T, H), (k.litHtmlVersions ?? (k.litHtmlVersions = [])).push("3.3.2");
const Jt = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = n = new H(t.insertBefore(U(), o), o, void 0, e ?? {});
  }
  return n._$AI(s), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis;
class N extends x {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(e, this.renderRoot, this.renderOptions);
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
N._$litElement$ = !0, N.finalized = !0, M.litElementHydrateSupport?.({ LitElement: N });
const Gt = M.litElementPolyfillSupport;
Gt?.({ LitElement: N });
(M.litElementVersions ?? (M.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: j }, Yt = (s = Qt, t, e) => {
  const { kind: i, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(e.name, s), i === "accessor") {
    const { name: r } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, s, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, s, c), c;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, s, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Xt(s) {
  return (t, e) => typeof e == "object" ? Yt(s, t, e) : ((i, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(s, t, e);
}
const D = /* @__PURE__ */ new WeakMap();
function te(s, t) {
  return D.get(t?.connection ?? t)?.get(s);
}
function $(s, t) {
  return (t?.entities?.[s]?.platform ?? te(s, t)?.platform) === "zha" ? "zha" : "mqtt";
}
function ut(s, t) {
  if (!s || !t?.callWS || t.entities?.[s]?.platform) return Promise.resolve();
  const e = t.connection ?? t;
  let i = D.get(e);
  i || D.set(e, i = /* @__PURE__ */ new Map());
  const n = i.get(s);
  if (n) return n.promise;
  const o = { platform: void 0, promise: void 0 };
  return o.promise = Promise.resolve().then(() => t.callWS({
    type: "config/entity_registry/get",
    entity_id: s
  })).then((r) => {
    o.platform = r?.platform;
  }).catch(() => {
  }), i.set(s, o), o.promise;
}
function F(s, t = "mqtt") {
  const e = s.split(".").pop()?.replace(/_status$/i, "").replace(/_ev$/i, "").replace(/_charger$/i, "").trim();
  if (!e) return {};
  const i = t === "zha";
  return {
    power_entity: `sensor.${e}_${i ? "total_power" : "total_active_power"}`,
    current_entity: `sensor.${e}_current`,
    voltage_entity: `sensor.${e}_voltage`,
    linkquality_entity: `sensor.${e}_${i ? "lqi" : "linkquality"}`,
    energy_entity: `sensor.${e}_last_session_energy`,
    charge_limit_entity: `number.${e}_${i ? "charge_current_limit" : "charge_limit"}`,
    charger_entity: `switch.${e}`,
    alarm_entity: `binary_sensor.${e}_alarm_active`,
    alarms_entity: `sensor.${e}_alarms`,
    derated_entity: `binary_sensor.${e}_derated`
  };
}
function ee(s, t, e) {
  const i = t.map((a, d) => Number.isFinite(a) && a > 0 ? d : -1).filter((a) => a >= 0), n = s && i.length > 1, o = s && i.length === 1 ? i[0] : 0, r = (a) => a.every(Number.isFinite) ? a.reduce((d, h) => d + h, 0) : NaN, c = (!s || n) && e.every((a) => Number.isFinite(a) && a > 0);
  return {
    threePhase: n,
    threePhaseVoltage: c,
    currents: n ? t : [t[0]],
    voltage: c ? r(e) / 3 : n ? NaN : e[o]
  };
}
var ie = Object.defineProperty, se = Object.getOwnPropertyDescriptor, pt = (s, t, e, i) => {
  for (var n = i > 1 ? void 0 : i ? se(t, e) : t, o = s.length - 1, r; o >= 0; o--)
    (r = s[o]) && (n = (i ? r(t, e, n) : r(n)) || n);
  return i && n && ie(t, e, n), n;
};
class ne extends HTMLElement {
  constructor() {
    super(...arguments), this._config = {}, this._inputs = {}, this._showOptional = !1;
  }
  set hass(t) {
    this._hass = t;
    const e = this._config.status_entity ?? "", i = $(e, t);
    ut(e, t).then(() => {
      this._config.status_entity === e && $(e, this.hass) !== i && this.render();
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
    return F(this._config.status_entity ?? "", $(this._config.status_entity ?? "", this.hass))[t];
  }
  appendFieldHelper(t, e) {
    const i = document.createElement("div"), n = this.getDefaultEntity(e);
    i.textContent = n ? `Default: ${n}` : "Select a status entity to calculate the default", i.style.fontSize = "12px", i.style.color = "var(--secondary-text-color)", t.appendChild(i);
  }
  renderEntityField(t, e, i = !1) {
    if (customElements.get("ha-entity-picker")) {
      const h = document.createElement("div");
      h.style.display = "grid", h.style.gap = "4px";
      const l = document.createElement("label");
      l.textContent = e + (i ? " *" : ""), l.style.fontSize = "12px", l.style.color = "var(--primary-text-color)", h.appendChild(l), t !== "status_entity" && this.appendFieldHelper(h, t);
      const u = document.createElement("ha-entity-picker");
      return u.dataset.key = t, u.hass = this._hass, u.value = this._config[t] ?? "", u.includeDomains = this.getDomainForField(t), u.includeDeviceClasses = this.getDeviceClassesForField(t), u.includeUnitOfMeasurement = this.getUnitsForField(t), u.style.width = "100%", u.addEventListener("value-changed", (g) => {
        this.updateConfig(t, g.detail?.value);
      }), h.appendChild(u), h;
    }
    const n = document.createElement("div");
    n.style.display = "grid", n.style.gap = "4px";
    const o = document.createElement("label");
    o.textContent = e + (i ? " *" : ""), o.style.fontSize = "12px", o.style.color = "var(--primary-text-color)", n.appendChild(o), t !== "status_entity" && this.appendFieldHelper(n, t);
    const r = document.createElement("select");
    r.dataset.key = t, r.style.width = "100%", r.style.padding = "8px 10px", r.style.border = "1px solid var(--divider-color)", r.style.borderRadius = "8px", r.style.background = "var(--card-background-color)", r.style.color = "var(--primary-text-color)";
    const c = this._config[t] ?? "", a = this.getEntityOptions(t), d = document.createElement("option");
    return d.value = "", d.textContent = "Select entity", r.appendChild(d), a.forEach((h) => {
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
    const i = document.createElement("div");
    i.style.display = "grid", i.style.gap = "4px";
    const n = document.createElement("label");
    n.textContent = e, n.style.fontSize = "12px", n.style.color = "var(--primary-text-color)", i.appendChild(n);
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
      const c = o.value ?? o.getAttribute("value") ?? "";
      c ? i[r] = c : delete i[r];
    }), t && (e ? i[t] = e : delete i[t]), this._config = i, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: i },
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
    const i = document.createElement("div");
    i.textContent = "Optional override", i.style.fontSize = "12px", i.style.fontWeight = "600", i.style.color = "var(--primary-text-color)", e.appendChild(i);
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
    ].forEach(([o, r]) => {
      t.appendChild(this.renderEntityField(o, r, !1));
    }), this.innerHTML = "", this.appendChild(t);
  }
}
let W = class extends N {
  get config() {
    if (this._config)
      return {
        ...F(this._config.status_entity, $(this._config.status_entity, this.hass)),
        ...this._config,
        title: this.getTitle()
      };
  }
  willUpdate() {
    const s = this._config?.status_entity;
    if (!s) return;
    const t = $(s, this.hass);
    ut(s, this.hass).then(() => {
      this._config?.status_entity === s && $(s, this.hass) !== t && this.requestUpdate();
    });
  }
  setConfig(s) {
    if (!s.status_entity)
      throw new Error("You must set status_entity");
    this._config = { ...s }, this.requestUpdate();
  }
  getEntity(s) {
    if (!(!s || !this.hass?.states?.[s]))
      return this.hass.states[s];
  }
  getState(s) {
    return this.getEntity(s)?.state ?? "-";
  }
  getEntityIcon(s) {
    const t = this.getEntity(s)?.attributes?.icon;
    return typeof t == "string" && t.trim() ? t : "";
  }
  getEntityUnit(s) {
    const t = this.getEntity(s)?.attributes?.unit_of_measurement;
    return typeof t == "string" && t.trim() ? t : "";
  }
  getNumberValue(s) {
    const t = this.getEntity(s)?.state;
    if (t == null || typeof t == "string" && !t.trim()) return NaN;
    const e = Number(t);
    return Number.isFinite(e) ? e : NaN;
  }
  getTitle() {
    const s = this._config?.title?.trim();
    if (s) return s;
    const t = this._config?.status_entity, e = this.hass?.entities?.[t]?.device_id, i = this.hass?.devices?.[e];
    return i?.name_by_user || i?.name || this.getEntity(t)?.attributes?.friendly_name || t || "";
  }
  formatReading(s, t, e) {
    return Number.isFinite(s) ? `${this.formatNumber(s, t)}${e ? ` ${e}` : ""}` : "-";
  }
  getBooleanValue(s) {
    const t = this.getState(s).toLowerCase();
    return t === "on" || t === "true" || t === "enabled" || t === "enable";
  }
  normaliseStatus(s) {
    return s?.trim() || "Unknown";
  }
  getAlarmList(s) {
    const t = this.getEntity(s)?.state;
    if (Array.isArray(t)) return t.map(String);
    if (typeof t == "string") {
      const e = t.replace(/\[|\]|'/g, "").trim();
      return e ? e.split(",").map((i) => i.trim()).filter(Boolean) : [];
    }
    return [];
  }
  getAlarmMessage() {
    const s = this.getBooleanValue(this.config.alarm_entity), t = this.getBooleanValue(this.config.derated_entity);
    if (!s && !t) return "";
    const e = this.getAlarmList(this.config.alarms_entity).map((i) => i.trim()).filter((i) => !!i).filter((i) => !["unknown", "none", "normal", "idle", "no alarm", "no_alarm", "-"].includes(i.toLowerCase()));
    return e.length ? e.join(", ") : t ? "Power reduced" : "Warning";
  }
  showMoreInfo(s) {
    s && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: s },
        bubbles: !0,
        composed: !0
      })
    );
  }
  formatNumber(s, t = 1) {
    if (!Number.isFinite(s)) return "-";
    const e = this.hass?.config?.locale || this.hass?.locale || void 0;
    return new Intl.NumberFormat(e, {
      minimumFractionDigits: t,
      maximumFractionDigits: t,
      useGrouping: !1
    }).format(s);
  }
  async toggleCharger() {
    if (!this.getStatusMeta().available) return;
    const s = this.config.charger_entity;
    if (!s) return;
    if (this.getState(s).toLowerCase() === "on") {
      await this.hass.callService("switch", "turn_off", { entity_id: s });
      return;
    }
    await this.hass.callService("switch", "turn_on", { entity_id: s });
  }
  getLedColor() {
    const s = this.normaliseStatus(this.getState(this.config.status_entity)).toLowerCase(), t = this.getBooleanValue(this.config.alarm_entity), e = this.getBooleanValue(this.config.derated_entity);
    return s === "charging" ? "#52d98f" : t || e ? "#ffb35c" : s === "ev connected" ? "#7ec8ff" : "#dfe7f2";
  }
  getStatusMeta() {
    const s = this.normaliseStatus(this.getState(this.config.status_entity)), t = this.getEntity(this.config.sub_status_entity)?.state, e = s.toLowerCase(), i = !!this.getEntity(this.config.status_entity) && !["unavailable", "unknown", "-", ""].includes(e), n = e === "charging", o = e === "ev connected", r = this.getBooleanValue(this.config.alarm_entity), c = this.getBooleanValue(this.config.derated_entity), a = this.getAlarmMessage(), d = !!a;
    let h = s, l = "status-connected";
    i ? e === "charging" ? (h = "Charging", l = "status-charging") : e === "ev connected" ? (h = "EV Connected", l = "status-connected") : e === "not connected" ? (h = "Not Connected", l = "status-connected") : (e === "unavailable" || e === "unknown") && (h = s, l = "status-warning") : (h = e === "unavailable" ? "Unavailable" : "Unknown", l = "status-warning");
    const u = i ? t ? String(t) : d ? a : n ? "Power is being delivered" : o ? "Vehicle connected" : "Waiting for vehicle" : "Waiting for charger to come online";
    return { status: s, available: i, connected: o, charging: n, alarmActive: r, derated: c, alarmText: a, mainStatus: h, statusClass: l, secondary: u };
  }
  render() {
    if (!this.hass || !this.config)
      return S``;
    const s = this.getNumberValue(this.config.charge_limit_entity);
    F(this.config.status_entity, $(this.config.status_entity, this.hass));
    const t = (m) => [
      this.getNumberValue(m),
      this.getNumberValue(m ? `${m}_phase_b` : void 0),
      this.getNumberValue(m ? `${m}_phase_c` : void 0)
    ], e = ee(
      this.getStatusMeta().charging,
      t(this.config.current_entity),
      t(this.config.voltage_entity)
    ), i = this.config.power_entity, n = this.getEntityUnit(i) === "kW" || !this.getEntityUnit(i) && i?.endsWith("_total_active_power"), o = this.getNumberValue(i) / (n ? 1 : 1e3), r = e.threePhase ? [this.config.current_entity, `${this.config.current_entity}_phase_b`, `${this.config.current_entity}_phase_c`] : [this.config.current_entity], c = e.voltage, a = e.threePhaseVoltage ? "3p " : "", d = this.getNumberValue(this.config.linkquality_entity), h = !!this.getEntity(this.config.linkquality_entity) && !this.hass.entities?.[this.config.linkquality_entity]?.disabled_by, l = this.getEntityIcon(this.config.voltage_entity) || "mdi:sine-wave", u = this.getEntityIcon(this.config.charge_limit_entity) || "mdi:ev-station", g = this.getEntityIcon(this.config.linkquality_entity) || "mdi:signal", w = this.getEntityUnit(this.config.linkquality_entity) || "", { mainStatus: gt, statusClass: mt, secondary: ft, available: yt, charging: _t, connected: vt, alarmActive: $t, derated: bt, alarmText: re } = this.getStatusMeta(), wt = _t, xt = vt, J = this.getNumberValue(this.config.energy_entity), At = wt || xt ? J : Math.max(J, 0), G = this.getState(this.config.charger_entity).toLowerCase() === "on", Et = this.getLedColor();
    return S`
      <ha-card>
        <div class="card">
          <div class="card-header">${this.config.title}</div>
          <div class="header">
            <div class="charger-visual" aria-label="Amina S charger icon" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">
              <svg class="charger-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path fill="${Et}" d="M9.611 2c-.575 0-1.038.463-1.038 1.039v8.953h6.854V3.04c0-.577-.464-1.039-1.038-1.039Zm4.587.609a.596.596 0 0 1 .598.596.596.596 0 0 1-.598.596.596.596 0 0 1-.598-.596.596.596 0 0 1 .598-.596M8.573 12.3v4.136c0 .575.463 1.038 1.038 1.038h4.777c.575 0 1.038-.463 1.038-1.038v-4.135Zm2.077 5.487v1.266a.623.623 0 0 0 .624.623h.205V22h1.042v-2.325h.206a.623.623 0 0 0 .623-.623v-1.266Z"/>
              </svg>
            </div>
            <div class="status-wrap">
              <div class="status-main ${mt}" @click=${() => this.showMoreInfo(this.config.status_entity)} style="cursor:pointer;">${gt}</div>
              <div class="status-secondary ${$t || bt ? "status-warning" : ""}">${ft}</div>
              ${yt ? S`<button class="action-toggle" @click=${() => this.toggleCharger()} aria-label="${G ? "Stop charging" : "Start charging"}">
                ${G ? "Stop ■" : "Start ▶"}
              </button>` : ""}
            </div>
            <div class="top-right">
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.voltage_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${a}${this.formatReading(c, 1, "V")}</span>
                <ha-icon class="telemetry-icon" .icon=${l}></ha-icon>
              </div>
              <div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.charge_limit_entity)} style="cursor:pointer;">
                <span class="telemetry-value">Max ${this.formatReading(s, 0, "A")}</span>
                <ha-icon class="telemetry-icon" .icon=${u}></ha-icon>
              </div>
              ${h ? S`<div class="telemetry-row" @click=${() => this.showMoreInfo(this.config.linkquality_entity)} style="cursor:pointer;">
                <span class="telemetry-value">${this.formatReading(d, 0, w)}</span>
                <ha-icon class="telemetry-icon" .icon=${g}></ha-icon>
              </div>` : ""}
            </div>
          </div>

          <div class="metrics">
            <div class="metric" @click=${() => this.showMoreInfo(i)} style="cursor:pointer;">
              <div class="metric-label">Power</div>
              <div class="metric-value">${this.formatReading(o, 1, "kW")}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Current</div>
              ${r.map((m, Ct) => S`
                <div class="metric-value" @click=${() => this.showMoreInfo(m)} style="cursor:pointer;">
                  ${r.length > 1 ? `${["A", "B", "C"][Ct]}: ` : ""}${this.formatReading(this.getNumberValue(m), 1, "A")}
                </div>
              `)}
            </div>
            <div class="metric" @click=${() => this.showMoreInfo(this.config.energy_entity)} style="cursor:pointer;">
              <div class="metric-label">Session</div>
              <div class="metric-value">${this.formatReading(At, 2, "kWh")}</div>
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
W.styles = Pt`
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
pt([
  Xt({ attribute: !1 })
], W.prototype, "hass", 2);
W = pt([
  Kt("amina-s-card")
], W);
customElements.define("amina-s-card-config-editor", ne);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "amina-s-card",
  name: "Amina S Card",
  description: "Amina S EV charger card for Zigbee2MQTT and ZHA with the Amina S quirk."
});
export {
  W as AminaSCard
};
