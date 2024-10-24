function eo(e, t) {
  const n = /* @__PURE__ */ Object.create(null), o = e.split(",");
  for (let r = 0; r < o.length; r++)
    n[o[r]] = !0;
  return t ? (r) => !!n[r.toLowerCase()] : (r) => !!n[r];
}
const j = {}, bt = [], De = () => {
}, hi = () => !1, mn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), to = (e) => e.startsWith("onUpdate:"), ee = Object.assign, no = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, bi = Object.prototype.hasOwnProperty, H = (e, t) => bi.call(e, t), D = Array.isArray, gt = (e) => hn(e) === "[object Map]", fr = (e) => hn(e) === "[object Set]", N = (e) => typeof e == "function", ne = (e) => typeof e == "string", wt = (e) => typeof e == "symbol", G = (e) => e !== null && typeof e == "object", mr = (e) => (G(e) || N(e)) && N(e.then) && N(e.catch), hr = Object.prototype.toString, hn = (e) => hr.call(e), gi = (e) => hn(e).slice(8, -1), br = (e) => hn(e) === "[object Object]", oo = (e) => ne(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, tn = /* @__PURE__ */ eo(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), bn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, _i = /-(\w)/g, Be = bn((e) => e.replace(_i, (t, n) => n ? n.toUpperCase() : "")), xi = /\B([A-Z])/g, ye = bn(
  (e) => e.replace(xi, "-$1").toLowerCase()
), gr = bn((e) => e.charAt(0).toUpperCase() + e.slice(1)), On = bn((e) => e ? `on${gr(e)}` : ""), pt = (e, t) => !Object.is(e, t), An = (e, t) => {
  for (let n = 0; n < e.length; n++)
    e[n](t);
}, ln = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, yi = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Vn = (e) => {
  const t = ne(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Oo;
const Un = () => Oo || (Oo = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ro(e) {
  if (D(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], r = ne(o) ? Ci(o) : ro(o);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (ne(e) || G(e))
    return e;
}
const vi = /;(?![^(]*\))/g, wi = /:([^]+)/, Si = /\/\*[^]*?\*\//g;
function Ci(e) {
  const t = {};
  return e.replace(Si, "").split(vi).forEach((n) => {
    if (n) {
      const o = n.split(wi);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function jt(e) {
  let t = "";
  if (ne(e))
    t = e;
  else if (D(e))
    for (let n = 0; n < e.length; n++) {
      const o = jt(e[n]);
      o && (t += o + " ");
    }
  else if (G(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Ei = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Ti = /* @__PURE__ */ eo(Ei);
function _r(e) {
  return !!e || e === "";
}
const Ve = (e) => ne(e) ? e : e == null ? "" : D(e) || G(e) && (e.toString === hr || !N(e.toString)) ? JSON.stringify(e, xr, 2) : String(e), xr = (e, t) => t && t.__v_isRef ? xr(e, t.value) : gt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [o, r], i) => (n[Dn(o, i) + " =>"] = r, n),
    {}
  )
} : fr(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Dn(n))
} : wt(t) ? Dn(t) : G(t) && !D(t) && !br(t) ? String(t) : t, Dn = (e, t = "") => {
  var n;
  return wt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
};
let Te;
class Oi {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this.effects = [], this.cleanups = [], this.parent = Te, !t && Te && (this.index = (Te.scopes || (Te.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  run(t) {
    if (this._active) {
      const n = Te;
      try {
        return Te = this, t();
      } finally {
        Te = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    Te = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    Te = this.parent;
  }
  stop(t) {
    if (this._active) {
      let n, o;
      for (n = 0, o = this.effects.length; n < o; n++)
        this.effects[n].stop();
      for (n = 0, o = this.cleanups.length; n < o; n++)
        this.cleanups[n]();
      if (this.scopes)
        for (n = 0, o = this.scopes.length; n < o; n++)
          this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function Ai(e, t = Te) {
  t && t.active && t.effects.push(e);
}
function Di() {
  return Te;
}
const io = (e) => {
  const t = new Set(e);
  return t.w = 0, t.n = 0, t;
}, yr = (e) => (e.w & Ye) > 0, vr = (e) => (e.n & Ye) > 0, Pi = ({ deps: e }) => {
  if (e.length)
    for (let t = 0; t < e.length; t++)
      e[t].w |= Ye;
}, Ri = (e) => {
  const { deps: t } = e;
  if (t.length) {
    let n = 0;
    for (let o = 0; o < t.length; o++) {
      const r = t[o];
      yr(r) && !vr(r) ? r.delete(e) : t[n++] = r, r.w &= ~Ye, r.n &= ~Ye;
    }
    t.length = n;
  }
}, Bn = /* @__PURE__ */ new WeakMap();
let Rt = 0, Ye = 1;
const Fn = 30;
let Oe;
const ct = Symbol(""), $n = Symbol("");
class so {
  constructor(t, n = null, o) {
    this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, Ai(this, o);
  }
  run() {
    if (!this.active)
      return this.fn();
    let t = Oe, n = Xe;
    for (; t; ) {
      if (t === this)
        return;
      t = t.parent;
    }
    try {
      return this.parent = Oe, Oe = this, Xe = !0, Ye = 1 << ++Rt, Rt <= Fn ? Pi(this) : Ao(this), this.fn();
    } finally {
      Rt <= Fn && Ri(this), Ye = 1 << --Rt, Oe = this.parent, Xe = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    Oe === this ? this.deferStop = !0 : this.active && (Ao(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function Ao(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
let Xe = !0;
const wr = [];
function St() {
  wr.push(Xe), Xe = !1;
}
function Ct() {
  const e = wr.pop();
  Xe = e === void 0 ? !0 : e;
}
function he(e, t, n) {
  if (Xe && Oe) {
    let o = Bn.get(e);
    o || Bn.set(e, o = /* @__PURE__ */ new Map());
    let r = o.get(n);
    r || o.set(n, r = io()), Sr(r);
  }
}
function Sr(e, t) {
  let n = !1;
  Rt <= Fn ? vr(e) || (e.n |= Ye, n = !yr(e)) : n = !e.has(Oe), n && (e.add(Oe), Oe.deps.push(e));
}
function Fe(e, t, n, o, r, i) {
  const s = Bn.get(e);
  if (!s)
    return;
  let l = [];
  if (t === "clear")
    l = [...s.values()];
  else if (n === "length" && D(e)) {
    const c = Number(o);
    s.forEach((d, f) => {
      (f === "length" || !wt(f) && f >= c) && l.push(d);
    });
  } else
    switch (n !== void 0 && l.push(s.get(n)), t) {
      case "add":
        D(e) ? oo(n) && l.push(s.get("length")) : (l.push(s.get(ct)), gt(e) && l.push(s.get($n)));
        break;
      case "delete":
        D(e) || (l.push(s.get(ct)), gt(e) && l.push(s.get($n)));
        break;
      case "set":
        gt(e) && l.push(s.get(ct));
        break;
    }
  if (l.length === 1)
    l[0] && Kn(l[0]);
  else {
    const c = [];
    for (const d of l)
      d && c.push(...d);
    Kn(io(c));
  }
}
function Kn(e, t) {
  const n = D(e) ? e : [...e];
  for (const o of n)
    o.computed && Do(o);
  for (const o of n)
    o.computed || Do(o);
}
function Do(e, t) {
  (e !== Oe || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run());
}
const Li = /* @__PURE__ */ eo("__proto__,__v_isRef,__isVue"), Cr = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(wt)
), Po = /* @__PURE__ */ Ni();
function Ni() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const o = U(this);
      for (let i = 0, s = this.length; i < s; i++)
        he(o, "get", i + "");
      const r = o[t](...n);
      return r === -1 || r === !1 ? o[t](...n.map(U)) : r;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      St();
      const o = U(this)[t].apply(this, n);
      return Ct(), o;
    };
  }), e;
}
function Ii(e) {
  const t = U(this);
  return he(t, "has", e), t.hasOwnProperty(e);
}
class Er {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._shallow = n;
  }
  get(t, n, o) {
    const r = this._isReadonly, i = this._shallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return o === (r ? i ? Wi : Dr : i ? Ar : Or).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(o) ? t : void 0;
    const s = D(t);
    if (!r) {
      if (s && H(Po, n))
        return Reflect.get(Po, n, o);
      if (n === "hasOwnProperty")
        return Ii;
    }
    const l = Reflect.get(t, n, o);
    return (wt(n) ? Cr.has(n) : Li(n)) || (r || he(t, "get", n), i) ? l : pe(l) ? s && oo(n) ? l : l.value : G(l) ? r ? Pr(l) : co(l) : l;
  }
}
class Tr extends Er {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, o, r) {
    let i = t[n];
    if (!this._shallow) {
      const c = yt(i);
      if (!an(o) && !yt(o) && (i = U(i), o = U(o)), !D(t) && pe(i) && !pe(o))
        return c ? !1 : (i.value = o, !0);
    }
    const s = D(t) && oo(n) ? Number(n) < t.length : H(t, n), l = Reflect.set(t, n, o, r);
    return t === U(r) && (s ? pt(o, i) && Fe(t, "set", n, o) : Fe(t, "add", n, o)), l;
  }
  deleteProperty(t, n) {
    const o = H(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && o && Fe(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const o = Reflect.has(t, n);
    return (!wt(n) || !Cr.has(n)) && he(t, "has", n), o;
  }
  ownKeys(t) {
    return he(
      t,
      "iterate",
      D(t) ? "length" : ct
    ), Reflect.ownKeys(t);
  }
}
class ki extends Er {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const Mi = /* @__PURE__ */ new Tr(), Hi = /* @__PURE__ */ new ki(), Vi = /* @__PURE__ */ new Tr(
  !0
), lo = (e) => e, gn = (e) => Reflect.getPrototypeOf(e);
function Xt(e, t, n = !1, o = !1) {
  e = e.__v_raw;
  const r = U(e), i = U(t);
  n || (pt(t, i) && he(r, "get", t), he(r, "get", i));
  const { has: s } = gn(r), l = o ? lo : n ? po : Mt;
  if (s.call(r, t))
    return l(e.get(t));
  if (s.call(r, i))
    return l(e.get(i));
  e !== r && e.get(t);
}
function Zt(e, t = !1) {
  const n = this.__v_raw, o = U(n), r = U(e);
  return t || (pt(e, r) && he(o, "has", e), he(o, "has", r)), e === r ? n.has(e) : n.has(e) || n.has(r);
}
function Yt(e, t = !1) {
  return e = e.__v_raw, !t && he(U(e), "iterate", ct), Reflect.get(e, "size", e);
}
function Ro(e) {
  e = U(e);
  const t = U(this);
  return gn(t).has.call(t, e) || (t.add(e), Fe(t, "add", e, e)), this;
}
function Lo(e, t) {
  t = U(t);
  const n = U(this), { has: o, get: r } = gn(n);
  let i = o.call(n, e);
  i || (e = U(e), i = o.call(n, e));
  const s = r.call(n, e);
  return n.set(e, t), i ? pt(t, s) && Fe(n, "set", e, t) : Fe(n, "add", e, t), this;
}
function No(e) {
  const t = U(this), { has: n, get: o } = gn(t);
  let r = n.call(t, e);
  r || (e = U(e), r = n.call(t, e)), o && o.call(t, e);
  const i = t.delete(e);
  return r && Fe(t, "delete", e, void 0), i;
}
function Io() {
  const e = U(this), t = e.size !== 0, n = e.clear();
  return t && Fe(e, "clear", void 0, void 0), n;
}
function Jt(e, t) {
  return function(o, r) {
    const i = this, s = i.__v_raw, l = U(s), c = t ? lo : e ? po : Mt;
    return !e && he(l, "iterate", ct), s.forEach((d, f) => o.call(r, c(d), c(f), i));
  };
}
function qt(e, t, n) {
  return function(...o) {
    const r = this.__v_raw, i = U(r), s = gt(i), l = e === "entries" || e === Symbol.iterator && s, c = e === "keys" && s, d = r[e](...o), f = n ? lo : t ? po : Mt;
    return !t && he(
      i,
      "iterate",
      c ? $n : ct
    ), {
      // iterator protocol
      next() {
        const { value: g, done: x } = d.next();
        return x ? { value: g, done: x } : {
          value: l ? [f(g[0]), f(g[1])] : f(g),
          done: x
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Ke(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Ui() {
  const e = {
    get(i) {
      return Xt(this, i);
    },
    get size() {
      return Yt(this);
    },
    has: Zt,
    add: Ro,
    set: Lo,
    delete: No,
    clear: Io,
    forEach: Jt(!1, !1)
  }, t = {
    get(i) {
      return Xt(this, i, !1, !0);
    },
    get size() {
      return Yt(this);
    },
    has: Zt,
    add: Ro,
    set: Lo,
    delete: No,
    clear: Io,
    forEach: Jt(!1, !0)
  }, n = {
    get(i) {
      return Xt(this, i, !0);
    },
    get size() {
      return Yt(this, !0);
    },
    has(i) {
      return Zt.call(this, i, !0);
    },
    add: Ke("add"),
    set: Ke("set"),
    delete: Ke("delete"),
    clear: Ke("clear"),
    forEach: Jt(!0, !1)
  }, o = {
    get(i) {
      return Xt(this, i, !0, !0);
    },
    get size() {
      return Yt(this, !0);
    },
    has(i) {
      return Zt.call(this, i, !0);
    },
    add: Ke("add"),
    set: Ke("set"),
    delete: Ke("delete"),
    clear: Ke("clear"),
    forEach: Jt(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
    e[i] = qt(
      i,
      !1,
      !1
    ), n[i] = qt(
      i,
      !0,
      !1
    ), t[i] = qt(
      i,
      !1,
      !0
    ), o[i] = qt(
      i,
      !0,
      !0
    );
  }), [
    e,
    n,
    t,
    o
  ];
}
const [
  Bi,
  Fi,
  $i,
  Ki
] = /* @__PURE__ */ Ui();
function ao(e, t) {
  const n = t ? e ? Ki : $i : e ? Fi : Bi;
  return (o, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? o : Reflect.get(
    H(n, r) && r in o ? n : o,
    r,
    i
  );
}
const ji = {
  get: /* @__PURE__ */ ao(!1, !1)
}, Gi = {
  get: /* @__PURE__ */ ao(!1, !0)
}, zi = {
  get: /* @__PURE__ */ ao(!0, !1)
}, Or = /* @__PURE__ */ new WeakMap(), Ar = /* @__PURE__ */ new WeakMap(), Dr = /* @__PURE__ */ new WeakMap(), Wi = /* @__PURE__ */ new WeakMap();
function Xi(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Zi(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Xi(gi(e));
}
function co(e) {
  return yt(e) ? e : uo(
    e,
    !1,
    Mi,
    ji,
    Or
  );
}
function Yi(e) {
  return uo(
    e,
    !1,
    Vi,
    Gi,
    Ar
  );
}
function Pr(e) {
  return uo(
    e,
    !0,
    Hi,
    zi,
    Dr
  );
}
function uo(e, t, n, o, r) {
  if (!G(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = r.get(e);
  if (i)
    return i;
  const s = Zi(e);
  if (s === 0)
    return e;
  const l = new Proxy(
    e,
    s === 2 ? o : n
  );
  return r.set(e, l), l;
}
function _t(e) {
  return yt(e) ? _t(e.__v_raw) : !!(e && e.__v_isReactive);
}
function yt(e) {
  return !!(e && e.__v_isReadonly);
}
function an(e) {
  return !!(e && e.__v_isShallow);
}
function Rr(e) {
  return _t(e) || yt(e);
}
function U(e) {
  const t = e && e.__v_raw;
  return t ? U(t) : e;
}
function Lr(e) {
  return ln(e, "__v_skip", !0), e;
}
const Mt = (e) => G(e) ? co(e) : e, po = (e) => G(e) ? Pr(e) : e;
function Nr(e) {
  Xe && Oe && (e = U(e), Sr(e.dep || (e.dep = io())));
}
function Ir(e, t) {
  e = U(e);
  const n = e.dep;
  n && Kn(n);
}
function pe(e) {
  return !!(e && e.__v_isRef === !0);
}
function Ji(e) {
  return qi(e, !1);
}
function qi(e, t) {
  return pe(e) ? e : new Qi(e, t);
}
class Qi {
  constructor(t, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? t : U(t), this._value = n ? t : Mt(t);
  }
  get value() {
    return Nr(this), this._value;
  }
  set value(t) {
    const n = this.__v_isShallow || an(t) || yt(t);
    t = n ? t : U(t), pt(t, this._rawValue) && (this._rawValue = t, this._value = n ? t : Mt(t), Ir(this));
  }
}
function jn(e) {
  return pe(e) ? e.value : e;
}
const es = {
  get: (e, t, n) => jn(Reflect.get(e, t, n)),
  set: (e, t, n, o) => {
    const r = e[t];
    return pe(r) && !pe(n) ? (r.value = n, !0) : Reflect.set(e, t, n, o);
  }
};
function kr(e) {
  return _t(e) ? e : new Proxy(e, es);
}
class ts {
  constructor(t, n, o, r) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this._dirty = !0, this.effect = new so(t, () => {
      this._dirty || (this._dirty = !0, Ir(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !r, this.__v_isReadonly = o;
  }
  get value() {
    const t = U(this);
    return Nr(t), (t._dirty || !t._cacheable) && (t._dirty = !1, t._value = t.effect.run()), t._value;
  }
  set value(t) {
    this._setter(t);
  }
}
function ns(e, t, n = !1) {
  let o, r;
  const i = N(e);
  return i ? (o = e, r = De) : (o = e.get, r = e.set), new ts(o, r, i || !r, n);
}
function Ze(e, t, n, o) {
  let r;
  try {
    r = o ? e(...o) : e();
  } catch (i) {
    _n(i, t, n);
  }
  return r;
}
function ve(e, t, n, o) {
  if (N(e)) {
    const i = Ze(e, t, n, o);
    return i && mr(i) && i.catch((s) => {
      _n(s, t, n);
    }), i;
  }
  const r = [];
  for (let i = 0; i < e.length; i++)
    r.push(ve(e[i], t, n, o));
  return r;
}
function _n(e, t, n, o = !0) {
  const r = t ? t.vnode : null;
  if (t) {
    let i = t.parent;
    const s = t.proxy, l = n;
    for (; i; ) {
      const d = i.ec;
      if (d) {
        for (let f = 0; f < d.length; f++)
          if (d[f](e, s, l) === !1)
            return;
      }
      i = i.parent;
    }
    const c = t.appContext.config.errorHandler;
    if (c) {
      Ze(
        c,
        null,
        10,
        [e, s, l]
      );
      return;
    }
  }
  os(e, n, r, o);
}
function os(e, t, n, o = !0) {
  console.error(e);
}
let Ht = !1, Gn = !1;
const ae = [];
let ke = 0;
const xt = [];
let Ue = null, it = 0;
const Mr = /* @__PURE__ */ Promise.resolve();
let fo = null;
function Hr(e) {
  const t = fo || Mr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function rs(e) {
  let t = ke + 1, n = ae.length;
  for (; t < n; ) {
    const o = t + n >>> 1, r = ae[o], i = Vt(r);
    i < e || i === e && r.pre ? t = o + 1 : n = o;
  }
  return t;
}
function mo(e) {
  (!ae.length || !ae.includes(
    e,
    Ht && e.allowRecurse ? ke + 1 : ke
  )) && (e.id == null ? ae.push(e) : ae.splice(rs(e.id), 0, e), Vr());
}
function Vr() {
  !Ht && !Gn && (Gn = !0, fo = Mr.then(Br));
}
function is(e) {
  const t = ae.indexOf(e);
  t > ke && ae.splice(t, 1);
}
function ss(e) {
  D(e) ? xt.push(...e) : (!Ue || !Ue.includes(
    e,
    e.allowRecurse ? it + 1 : it
  )) && xt.push(e), Vr();
}
function ko(e, t, n = Ht ? ke + 1 : 0) {
  for (; n < ae.length; n++) {
    const o = ae[n];
    if (o && o.pre) {
      if (e && o.id !== e.uid)
        continue;
      ae.splice(n, 1), n--, o();
    }
  }
}
function Ur(e) {
  if (xt.length) {
    const t = [...new Set(xt)];
    if (xt.length = 0, Ue) {
      Ue.push(...t);
      return;
    }
    for (Ue = t, Ue.sort((n, o) => Vt(n) - Vt(o)), it = 0; it < Ue.length; it++)
      Ue[it]();
    Ue = null, it = 0;
  }
}
const Vt = (e) => e.id == null ? 1 / 0 : e.id, ls = (e, t) => {
  const n = Vt(e) - Vt(t);
  if (n === 0) {
    if (e.pre && !t.pre)
      return -1;
    if (t.pre && !e.pre)
      return 1;
  }
  return n;
};
function Br(e) {
  Gn = !1, Ht = !0, ae.sort(ls);
  const t = De;
  try {
    for (ke = 0; ke < ae.length; ke++) {
      const n = ae[ke];
      n && n.active !== !1 && Ze(n, null, 14);
    }
  } finally {
    ke = 0, ae.length = 0, Ur(), Ht = !1, fo = null, (ae.length || xt.length) && Br();
  }
}
function as(e, t, ...n) {
  if (e.isUnmounted)
    return;
  const o = e.vnode.props || j;
  let r = n;
  const i = t.startsWith("update:"), s = i && t.slice(7);
  if (s && s in o) {
    const f = `${s === "modelValue" ? "model" : s}Modifiers`, { number: g, trim: x } = o[f] || j;
    x && (r = n.map((E) => ne(E) ? E.trim() : E)), g && (r = n.map(yi));
  }
  let l, c = o[l = On(t)] || // also try camelCase event handler (#2249)
  o[l = On(Be(t))];
  !c && i && (c = o[l = On(ye(t))]), c && ve(
    c,
    e,
    6,
    r
  );
  const d = o[l + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, ve(
      d,
      e,
      6,
      r
    );
  }
}
function Fr(e, t, n = !1) {
  const o = t.emitsCache, r = o.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let s = {}, l = !1;
  if (!N(e)) {
    const c = (d) => {
      const f = Fr(d, t, !0);
      f && (l = !0, ee(s, f));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !i && !l ? (G(e) && o.set(e, null), null) : (D(i) ? i.forEach((c) => s[c] = null) : ee(s, i), G(e) && o.set(e, s), s);
}
function xn(e, t) {
  return !e || !mn(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), H(e, t[0].toLowerCase() + t.slice(1)) || H(e, ye(t)) || H(e, t));
}
let ce = null, $r = null;
function cn(e) {
  const t = ce;
  return ce = e, $r = e && e.type.__scopeId || null, t;
}
function Ut(e, t = ce, n) {
  if (!t || e._n)
    return e;
  const o = (...r) => {
    o._d && Wo(-1);
    const i = cn(t);
    let s;
    try {
      s = e(...r);
    } finally {
      cn(i), o._d && Wo(1);
    }
    return s;
  };
  return o._n = !0, o._c = !0, o._d = !0, o;
}
function Pn(e) {
  const {
    type: t,
    vnode: n,
    proxy: o,
    withProxy: r,
    props: i,
    propsOptions: [s],
    slots: l,
    attrs: c,
    emit: d,
    render: f,
    renderCache: g,
    data: x,
    setupState: E,
    ctx: L,
    inheritAttrs: A
  } = e;
  let V, W;
  const z = cn(e);
  try {
    if (n.shapeFlag & 4) {
      const P = r || o, q = P;
      V = Ie(
        f.call(
          q,
          P,
          g,
          i,
          E,
          x,
          L
        )
      ), W = c;
    } else {
      const P = t;
      V = Ie(
        P.length > 1 ? P(
          i,
          { attrs: c, slots: l, emit: d }
        ) : P(
          i,
          null
          /* we know it doesn't need it */
        )
      ), W = t.props ? c : cs(c);
    }
  } catch (P) {
    kt.length = 0, _n(P, e, 1), V = k(we);
  }
  let X = V;
  if (W && A !== !1) {
    const P = Object.keys(W), { shapeFlag: q } = X;
    P.length && q & 7 && (s && P.some(to) && (W = us(
      W,
      s
    )), X = Je(X, W));
  }
  return n.dirs && (X = Je(X), X.dirs = X.dirs ? X.dirs.concat(n.dirs) : n.dirs), n.transition && (X.transition = n.transition), V = X, cn(z), V;
}
const cs = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || mn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, us = (e, t) => {
  const n = {};
  for (const o in e)
    (!to(o) || !(o.slice(9) in t)) && (n[o] = e[o]);
  return n;
};
function ds(e, t, n) {
  const { props: o, children: r, component: i } = e, { props: s, children: l, patchFlag: c } = t, d = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return o ? Mo(o, s, d) : !!s;
    if (c & 8) {
      const f = t.dynamicProps;
      for (let g = 0; g < f.length; g++) {
        const x = f[g];
        if (s[x] !== o[x] && !xn(d, x))
          return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable) ? !0 : o === s ? !1 : o ? s ? Mo(o, s, d) : !0 : !!s;
  return !1;
}
function Mo(e, t, n) {
  const o = Object.keys(t);
  if (o.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < o.length; r++) {
    const i = o[r];
    if (t[i] !== e[i] && !xn(n, i))
      return !0;
  }
  return !1;
}
function ps({ vnode: e, parent: t }, n) {
  for (; t && t.subTree === e; )
    (e = t.vnode).el = n, t = t.parent;
}
const fs = Symbol.for("v-ndc"), ms = (e) => e.__isSuspense;
function hs(e, t) {
  t && t.pendingBranch ? D(e) ? t.effects.push(...e) : t.effects.push(e) : ss(e);
}
const Qt = {};
function nn(e, t, n) {
  return Kr(e, t, n);
}
function Kr(e, t, { immediate: n, deep: o, flush: r, onTrack: i, onTrigger: s } = j) {
  var l;
  const c = Di() === ((l = se) == null ? void 0 : l.scope) ? se : null;
  let d, f = !1, g = !1;
  if (pe(e) ? (d = () => e.value, f = an(e)) : _t(e) ? (d = () => e, o = !0) : D(e) ? (g = !0, f = e.some((P) => _t(P) || an(P)), d = () => e.map((P) => {
    if (pe(P))
      return P.value;
    if (_t(P))
      return at(P);
    if (N(P))
      return Ze(P, c, 2);
  })) : N(e) ? t ? d = () => Ze(e, c, 2) : d = () => {
    if (!(c && c.isUnmounted))
      return x && x(), ve(
        e,
        c,
        3,
        [E]
      );
  } : d = De, t && o) {
    const P = d;
    d = () => at(P());
  }
  let x, E = (P) => {
    x = z.onStop = () => {
      Ze(P, c, 4), x = z.onStop = void 0;
    };
  }, L;
  if ($t)
    if (E = De, t ? n && ve(t, c, 3, [
      d(),
      g ? [] : void 0,
      E
    ]) : d(), r === "sync") {
      const P = dl();
      L = P.__watcherHandles || (P.__watcherHandles = []);
    } else
      return De;
  let A = g ? new Array(e.length).fill(Qt) : Qt;
  const V = () => {
    if (z.active)
      if (t) {
        const P = z.run();
        (o || f || (g ? P.some((q, Se) => pt(q, A[Se])) : pt(P, A))) && (x && x(), ve(t, c, 3, [
          P,
          // pass undefined as the old value when it's changed for the first time
          A === Qt ? void 0 : g && A[0] === Qt ? [] : A,
          E
        ]), A = P);
      } else
        z.run();
  };
  V.allowRecurse = !!t;
  let W;
  r === "sync" ? W = V : r === "post" ? W = () => fe(V, c && c.suspense) : (V.pre = !0, c && (V.id = c.uid), W = () => mo(V));
  const z = new so(d, W);
  t ? n ? V() : A = z.run() : r === "post" ? fe(
    z.run.bind(z),
    c && c.suspense
  ) : z.run();
  const X = () => {
    z.stop(), c && c.scope && no(c.scope.effects, z);
  };
  return L && L.push(X), X;
}
function bs(e, t, n) {
  const o = this.proxy, r = ne(e) ? e.includes(".") ? jr(o, e) : () => o[e] : e.bind(o, o);
  let i;
  N(t) ? i = t : (i = t.handler, n = t);
  const s = se;
  vt(this);
  const l = Kr(r, i.bind(o), n);
  return s ? vt(s) : dt(), l;
}
function jr(e, t) {
  const n = t.split(".");
  return () => {
    let o = e;
    for (let r = 0; r < n.length && o; r++)
      o = o[n[r]];
    return o;
  };
}
function at(e, t) {
  if (!G(e) || e.__v_skip || (t = t || /* @__PURE__ */ new Set(), t.has(e)))
    return e;
  if (t.add(e), pe(e))
    at(e.value, t);
  else if (D(e))
    for (let n = 0; n < e.length; n++)
      at(e[n], t);
  else if (fr(e) || gt(e))
    e.forEach((n) => {
      at(n, t);
    });
  else if (br(e))
    for (const n in e)
      at(e[n], t);
  return e;
}
function Ot(e, t) {
  const n = ce;
  if (n === null)
    return e;
  const o = Cn(n) || n.proxy, r = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [s, l, c, d = j] = t[i];
    s && (N(s) && (s = {
      mounted: s,
      updated: s
    }), s.deep && at(l), r.push({
      dir: s,
      instance: o,
      value: l,
      oldValue: void 0,
      arg: c,
      modifiers: d
    }));
  }
  return e;
}
function et(e, t, n, o) {
  const r = e.dirs, i = t && t.dirs;
  for (let s = 0; s < r.length; s++) {
    const l = r[s];
    i && (l.oldValue = i[s].value);
    let c = l.dir[o];
    c && (St(), ve(c, n, 8, [
      e.el,
      l,
      e,
      t
    ]), Ct());
  }
}
const ze = Symbol("_leaveCb"), en = Symbol("_enterCb");
function gs() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return ho(() => {
    e.isMounted = !0;
  }), Zr(() => {
    e.isUnmounting = !0;
  }), e;
}
const xe = [Function, Array], Gr = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: xe,
  onEnter: xe,
  onAfterEnter: xe,
  onEnterCancelled: xe,
  // leave
  onBeforeLeave: xe,
  onLeave: xe,
  onAfterLeave: xe,
  onLeaveCancelled: xe,
  // appear
  onBeforeAppear: xe,
  onAppear: xe,
  onAfterAppear: xe,
  onAppearCancelled: xe
}, _s = {
  name: "BaseTransition",
  props: Gr,
  setup(e, { slots: t }) {
    const n = ol(), o = gs();
    let r;
    return () => {
      const i = t.default && Wr(t.default(), !0);
      if (!i || !i.length)
        return;
      let s = i[0];
      if (i.length > 1) {
        for (const A of i)
          if (A.type !== we) {
            s = A;
            break;
          }
      }
      const l = U(e), { mode: c } = l;
      if (o.isLeaving)
        return Rn(s);
      const d = Ho(s);
      if (!d)
        return Rn(s);
      const f = zn(
        d,
        l,
        o,
        n
      );
      Wn(d, f);
      const g = n.subTree, x = g && Ho(g);
      let E = !1;
      const { getTransitionKey: L } = d.type;
      if (L) {
        const A = L();
        r === void 0 ? r = A : A !== r && (r = A, E = !0);
      }
      if (x && x.type !== we && (!st(d, x) || E)) {
        const A = zn(
          x,
          l,
          o,
          n
        );
        if (Wn(x, A), c === "out-in")
          return o.isLeaving = !0, A.afterLeave = () => {
            o.isLeaving = !1, n.update.active !== !1 && n.update();
          }, Rn(s);
        c === "in-out" && d.type !== we && (A.delayLeave = (V, W, z) => {
          const X = zr(
            o,
            x
          );
          X[String(x.key)] = x, V[ze] = () => {
            W(), V[ze] = void 0, delete f.delayedLeave;
          }, f.delayedLeave = z;
        });
      }
      return s;
    };
  }
}, xs = _s;
function zr(e, t) {
  const { leavingVNodes: n } = e;
  let o = n.get(t.type);
  return o || (o = /* @__PURE__ */ Object.create(null), n.set(t.type, o)), o;
}
function zn(e, t, n, o) {
  const {
    appear: r,
    mode: i,
    persisted: s = !1,
    onBeforeEnter: l,
    onEnter: c,
    onAfterEnter: d,
    onEnterCancelled: f,
    onBeforeLeave: g,
    onLeave: x,
    onAfterLeave: E,
    onLeaveCancelled: L,
    onBeforeAppear: A,
    onAppear: V,
    onAfterAppear: W,
    onAppearCancelled: z
  } = t, X = String(e.key), P = zr(n, e), q = (I, Y) => {
    I && ve(
      I,
      o,
      9,
      Y
    );
  }, Se = (I, Y) => {
    const K = Y[1];
    q(I, Y), D(I) ? I.every((le) => le.length <= 1) && K() : I.length <= 1 && K();
  }, Ce = {
    mode: i,
    persisted: s,
    beforeEnter(I) {
      let Y = l;
      if (!n.isMounted)
        if (r)
          Y = A || l;
        else
          return;
      I[ze] && I[ze](
        !0
        /* cancelled */
      );
      const K = P[X];
      K && st(e, K) && K.el[ze] && K.el[ze](), q(Y, [I]);
    },
    enter(I) {
      let Y = c, K = d, le = f;
      if (!n.isMounted)
        if (r)
          Y = V || c, K = W || d, le = z || f;
        else
          return;
      let C = !1;
      const Z = I[en] = (be) => {
        C || (C = !0, be ? q(le, [I]) : q(K, [I]), Ce.delayedLeave && Ce.delayedLeave(), I[en] = void 0);
      };
      Y ? Se(Y, [I, Z]) : Z();
    },
    leave(I, Y) {
      const K = String(e.key);
      if (I[en] && I[en](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return Y();
      q(g, [I]);
      let le = !1;
      const C = I[ze] = (Z) => {
        le || (le = !0, Y(), Z ? q(L, [I]) : q(E, [I]), I[ze] = void 0, P[K] === e && delete P[K]);
      };
      P[K] = e, x ? Se(x, [I, C]) : C();
    },
    clone(I) {
      return zn(I, t, n, o);
    }
  };
  return Ce;
}
function Rn(e) {
  if (yn(e))
    return e = Je(e), e.children = null, e;
}
function Ho(e) {
  return yn(e) ? (
    // #7121 ensure get the child component subtree in case
    // it's been replaced during HMR
    e.children ? e.children[0] : void 0
  ) : e;
}
function Wn(e, t) {
  e.shapeFlag & 6 && e.component ? Wn(e.component.subTree, t) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Wr(e, t = !1, n) {
  let o = [], r = 0;
  for (let i = 0; i < e.length; i++) {
    let s = e[i];
    const l = n == null ? s.key : String(n) + String(s.key != null ? s.key : i);
    s.type === me ? (s.patchFlag & 128 && r++, o = o.concat(
      Wr(s.children, t, l)
    )) : (t || s.type !== we) && o.push(l != null ? Je(s, { key: l }) : s);
  }
  if (r > 1)
    for (let i = 0; i < o.length; i++)
      o[i].patchFlag = -2;
  return o;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Gt(e, t) {
  return N(e) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => ee({ name: e.name }, t, { setup: e }))()
  ) : e;
}
const Nt = (e) => !!e.type.__asyncLoader, yn = (e) => e.type.__isKeepAlive;
function ys(e, t) {
  Xr(e, "a", t);
}
function vs(e, t) {
  Xr(e, "da", t);
}
function Xr(e, t, n = se) {
  const o = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (vn(t, o, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      yn(r.parent.vnode) && ws(o, t, n, r), r = r.parent;
  }
}
function ws(e, t, n, o) {
  const r = vn(
    t,
    e,
    o,
    !0
    /* prepend */
  );
  Yr(() => {
    no(o[t], r);
  }, n);
}
function vn(e, t, n = se, o = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...s) => {
      if (n.isUnmounted)
        return;
      St(), vt(n);
      const l = ve(t, n, e, s);
      return dt(), Ct(), l;
    });
    return o ? r.unshift(i) : r.push(i), i;
  }
}
const $e = (e) => (t, n = se) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!$t || e === "sp") && vn(e, (...o) => t(...o), n)
), Ss = $e("bm"), ho = $e("m"), Cs = $e("bu"), Es = $e("u"), Zr = $e("bum"), Yr = $e("um"), Ts = $e("sp"), Os = $e(
  "rtg"
), As = $e(
  "rtc"
);
function Ds(e, t = se) {
  vn("ec", e, t);
}
function Vo(e, t, n, o) {
  let r;
  const i = n && n[o];
  if (D(e) || ne(e)) {
    r = new Array(e.length);
    for (let s = 0, l = e.length; s < l; s++)
      r[s] = t(e[s], s, void 0, i && i[s]);
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let s = 0; s < e; s++)
      r[s] = t(s + 1, s, void 0, i && i[s]);
  } else if (G(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (s, l) => t(s, l, void 0, i && i[l])
      );
    else {
      const s = Object.keys(e);
      r = new Array(s.length);
      for (let l = 0, c = s.length; l < c; l++) {
        const d = s[l];
        r[l] = t(e[d], d, l, i && i[l]);
      }
    }
  else
    r = [];
  return n && (n[o] = r), r;
}
function ue(e, t, n = {}, o, r) {
  if (ce.isCE || ce.parent && Nt(ce.parent) && ce.parent.isCE)
    return t !== "default" && (n.name = t), k("slot", n, o && o());
  let i = e[t];
  i && i._c && (i._d = !1), re();
  const s = i && Jr(i(n)), l = _e(
    me,
    {
      key: n.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      s && s.key || `_${t}`
    },
    s || (o ? o() : []),
    s && e._ === 1 ? 64 : -2
  );
  return !r && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), i && i._c && (i._d = !0), l;
}
function Jr(e) {
  return e.some((t) => pn(t) ? !(t.type === we || t.type === me && !Jr(t.children)) : !0) ? e : null;
}
const Xn = (e) => e ? ai(e) ? Cn(e) || e.proxy : Xn(e.parent) : null, It = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ ee(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Xn(e.parent),
    $root: (e) => Xn(e.root),
    $emit: (e) => e.emit,
    $options: (e) => bo(e),
    $forceUpdate: (e) => e.f || (e.f = () => mo(e.update)),
    $nextTick: (e) => e.n || (e.n = Hr.bind(e.proxy)),
    $watch: (e) => bs.bind(e)
  })
), Ln = (e, t) => e !== j && !e.__isScriptSetup && H(e, t), Ps = {
  get({ _: e }, t) {
    const { ctx: n, setupState: o, data: r, props: i, accessCache: s, type: l, appContext: c } = e;
    let d;
    if (t[0] !== "$") {
      const E = s[t];
      if (E !== void 0)
        switch (E) {
          case 1:
            return o[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Ln(o, t))
          return s[t] = 1, o[t];
        if (r !== j && H(r, t))
          return s[t] = 2, r[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (d = e.propsOptions[0]) && H(d, t)
        )
          return s[t] = 3, i[t];
        if (n !== j && H(n, t))
          return s[t] = 4, n[t];
        Zn && (s[t] = 0);
      }
    }
    const f = It[t];
    let g, x;
    if (f)
      return t === "$attrs" && he(e, "get", t), f(e);
    if (
      // css module (injected by vue-loader)
      (g = l.__cssModules) && (g = g[t])
    )
      return g;
    if (n !== j && H(n, t))
      return s[t] = 4, n[t];
    if (
      // global properties
      x = c.config.globalProperties, H(x, t)
    )
      return x[t];
  },
  set({ _: e }, t, n) {
    const { data: o, setupState: r, ctx: i } = e;
    return Ln(r, t) ? (r[t] = n, !0) : o !== j && H(o, t) ? (o[t] = n, !0) : H(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: o, appContext: r, propsOptions: i }
  }, s) {
    let l;
    return !!n[s] || e !== j && H(e, s) || Ln(t, s) || (l = i[0]) && H(l, s) || H(o, s) || H(It, s) || H(r.config.globalProperties, s);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : H(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Uo(e) {
  return D(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Zn = !0;
function Rs(e) {
  const t = bo(e), n = e.proxy, o = e.ctx;
  Zn = !1, t.beforeCreate && Bo(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: i,
    methods: s,
    watch: l,
    provide: c,
    inject: d,
    // lifecycle
    created: f,
    beforeMount: g,
    mounted: x,
    beforeUpdate: E,
    updated: L,
    activated: A,
    deactivated: V,
    beforeDestroy: W,
    beforeUnmount: z,
    destroyed: X,
    unmounted: P,
    render: q,
    renderTracked: Se,
    renderTriggered: Ce,
    errorCaptured: I,
    serverPrefetch: Y,
    // public API
    expose: K,
    inheritAttrs: le,
    // assets
    components: C,
    directives: Z,
    filters: be
  } = t;
  if (d && Ls(d, o, null), s)
    for (const J in s) {
      const F = s[J];
      N(F) && (o[J] = F.bind(n));
    }
  if (r) {
    const J = r.call(n, n);
    G(J) && (e.data = co(J));
  }
  if (Zn = !0, i)
    for (const J in i) {
      const F = i[J], qe = N(F) ? F.bind(n, n) : N(F.get) ? F.get.bind(n, n) : De, zt = !N(F) && N(F.set) ? F.set.bind(n) : De, Qe = rt({
        get: qe,
        set: zt
      });
      Object.defineProperty(o, J, {
        enumerable: !0,
        configurable: !0,
        get: () => Qe.value,
        set: (Pe) => Qe.value = Pe
      });
    }
  if (l)
    for (const J in l)
      qr(l[J], o, n, J);
  if (c) {
    const J = N(c) ? c.call(n) : c;
    Reflect.ownKeys(J).forEach((F) => {
      Vs(F, J[F]);
    });
  }
  f && Bo(f, e, "c");
  function oe(J, F) {
    D(F) ? F.forEach((qe) => J(qe.bind(n))) : F && J(F.bind(n));
  }
  if (oe(Ss, g), oe(ho, x), oe(Cs, E), oe(Es, L), oe(ys, A), oe(vs, V), oe(Ds, I), oe(As, Se), oe(Os, Ce), oe(Zr, z), oe(Yr, P), oe(Ts, Y), D(K))
    if (K.length) {
      const J = e.exposed || (e.exposed = {});
      K.forEach((F) => {
        Object.defineProperty(J, F, {
          get: () => n[F],
          set: (qe) => n[F] = qe
        });
      });
    } else
      e.exposed || (e.exposed = {});
  q && e.render === De && (e.render = q), le != null && (e.inheritAttrs = le), C && (e.components = C), Z && (e.directives = Z);
}
function Ls(e, t, n = De) {
  D(e) && (e = Yn(e));
  for (const o in e) {
    const r = e[o];
    let i;
    G(r) ? "default" in r ? i = on(
      r.from || o,
      r.default,
      !0
      /* treat default function as factory */
    ) : i = on(r.from || o) : i = on(r), pe(i) ? Object.defineProperty(t, o, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (s) => i.value = s
    }) : t[o] = i;
  }
}
function Bo(e, t, n) {
  ve(
    D(e) ? e.map((o) => o.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function qr(e, t, n, o) {
  const r = o.includes(".") ? jr(n, o) : () => n[o];
  if (ne(e)) {
    const i = t[e];
    N(i) && nn(r, i);
  } else if (N(e))
    nn(r, e.bind(n));
  else if (G(e))
    if (D(e))
      e.forEach((i) => qr(i, t, n, o));
    else {
      const i = N(e.handler) ? e.handler.bind(n) : t[e.handler];
      N(i) && nn(r, i, e);
    }
}
function bo(e) {
  const t = e.type, { mixins: n, extends: o } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: s }
  } = e.appContext, l = i.get(t);
  let c;
  return l ? c = l : !r.length && !n && !o ? c = t : (c = {}, r.length && r.forEach(
    (d) => un(c, d, s, !0)
  ), un(c, t, s)), G(t) && i.set(t, c), c;
}
function un(e, t, n, o = !1) {
  const { mixins: r, extends: i } = t;
  i && un(e, i, n, !0), r && r.forEach(
    (s) => un(e, s, n, !0)
  );
  for (const s in t)
    if (!(o && s === "expose")) {
      const l = Ns[s] || n && n[s];
      e[s] = l ? l(e[s], t[s]) : t[s];
    }
  return e;
}
const Ns = {
  data: Fo,
  props: $o,
  emits: $o,
  // objects
  methods: Lt,
  computed: Lt,
  // lifecycle
  beforeCreate: de,
  created: de,
  beforeMount: de,
  mounted: de,
  beforeUpdate: de,
  updated: de,
  beforeDestroy: de,
  beforeUnmount: de,
  destroyed: de,
  unmounted: de,
  activated: de,
  deactivated: de,
  errorCaptured: de,
  serverPrefetch: de,
  // assets
  components: Lt,
  directives: Lt,
  // watch
  watch: ks,
  // provide / inject
  provide: Fo,
  inject: Is
};
function Fo(e, t) {
  return t ? e ? function() {
    return ee(
      N(e) ? e.call(this, this) : e,
      N(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Is(e, t) {
  return Lt(Yn(e), Yn(t));
}
function Yn(e) {
  if (D(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function de(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Lt(e, t) {
  return e ? ee(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function $o(e, t) {
  return e ? D(e) && D(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : ee(
    /* @__PURE__ */ Object.create(null),
    Uo(e),
    Uo(t ?? {})
  ) : t;
}
function ks(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  const n = ee(/* @__PURE__ */ Object.create(null), e);
  for (const o in t)
    n[o] = de(e[o], t[o]);
  return n;
}
function Qr() {
  return {
    app: null,
    config: {
      isNativeTag: hi,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Ms = 0;
function Hs(e, t) {
  return function(o, r = null) {
    N(o) || (o = ee({}, o)), r != null && !G(r) && (r = null);
    const i = Qr(), s = /* @__PURE__ */ new WeakSet();
    let l = !1;
    const c = i.app = {
      _uid: Ms++,
      _component: o,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: pl,
      get config() {
        return i.config;
      },
      set config(d) {
      },
      use(d, ...f) {
        return s.has(d) || (d && N(d.install) ? (s.add(d), d.install(c, ...f)) : N(d) && (s.add(d), d(c, ...f))), c;
      },
      mixin(d) {
        return i.mixins.includes(d) || i.mixins.push(d), c;
      },
      component(d, f) {
        return f ? (i.components[d] = f, c) : i.components[d];
      },
      directive(d, f) {
        return f ? (i.directives[d] = f, c) : i.directives[d];
      },
      mount(d, f, g) {
        if (!l) {
          const x = k(o, r);
          return x.appContext = i, f && t ? t(x, d) : e(x, d, g), l = !0, c._container = d, d.__vue_app__ = c, Cn(x.component) || x.component.proxy;
        }
      },
      unmount() {
        l && (e(null, c._container), delete c._container.__vue_app__);
      },
      provide(d, f) {
        return i.provides[d] = f, c;
      },
      runWithContext(d) {
        dn = c;
        try {
          return d();
        } finally {
          dn = null;
        }
      }
    };
    return c;
  };
}
let dn = null;
function Vs(e, t) {
  if (se) {
    let n = se.provides;
    const o = se.parent && se.parent.provides;
    o === n && (n = se.provides = Object.create(o)), n[e] = t;
  }
}
function on(e, t, n = !1) {
  const o = se || ce;
  if (o || dn) {
    const r = o ? o.parent == null ? o.vnode.appContext && o.vnode.appContext.provides : o.parent.provides : dn._context.provides;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && N(t) ? t.call(o && o.proxy) : t;
  }
}
function Us(e, t, n, o = !1) {
  const r = {}, i = {};
  ln(i, Sn, 1), e.propsDefaults = /* @__PURE__ */ Object.create(null), ei(e, t, r, i);
  for (const s in e.propsOptions[0])
    s in r || (r[s] = void 0);
  n ? e.props = o ? r : Yi(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function Bs(e, t, n, o) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: s }
  } = e, l = U(r), [c] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (o || s > 0) && !(s & 16)
  ) {
    if (s & 8) {
      const f = e.vnode.dynamicProps;
      for (let g = 0; g < f.length; g++) {
        let x = f[g];
        if (xn(e.emitsOptions, x))
          continue;
        const E = t[x];
        if (c)
          if (H(i, x))
            E !== i[x] && (i[x] = E, d = !0);
          else {
            const L = Be(x);
            r[L] = Jn(
              c,
              l,
              L,
              E,
              e,
              !1
              /* isAbsent */
            );
          }
        else
          E !== i[x] && (i[x] = E, d = !0);
      }
    }
  } else {
    ei(e, t, r, i) && (d = !0);
    let f;
    for (const g in l)
      (!t || // for camelCase
      !H(t, g) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((f = ye(g)) === g || !H(t, f))) && (c ? n && // for camelCase
      (n[g] !== void 0 || // for kebab-case
      n[f] !== void 0) && (r[g] = Jn(
        c,
        l,
        g,
        void 0,
        e,
        !0
        /* isAbsent */
      )) : delete r[g]);
    if (i !== l)
      for (const g in i)
        (!t || !H(t, g)) && (delete i[g], d = !0);
  }
  d && Fe(e, "set", "$attrs");
}
function ei(e, t, n, o) {
  const [r, i] = e.propsOptions;
  let s = !1, l;
  if (t)
    for (let c in t) {
      if (tn(c))
        continue;
      const d = t[c];
      let f;
      r && H(r, f = Be(c)) ? !i || !i.includes(f) ? n[f] = d : (l || (l = {}))[f] = d : xn(e.emitsOptions, c) || (!(c in o) || d !== o[c]) && (o[c] = d, s = !0);
    }
  if (i) {
    const c = U(n), d = l || j;
    for (let f = 0; f < i.length; f++) {
      const g = i[f];
      n[g] = Jn(
        r,
        c,
        g,
        d[g],
        e,
        !H(d, g)
      );
    }
  }
  return s;
}
function Jn(e, t, n, o, r, i) {
  const s = e[n];
  if (s != null) {
    const l = H(s, "default");
    if (l && o === void 0) {
      const c = s.default;
      if (s.type !== Function && !s.skipFactory && N(c)) {
        const { propsDefaults: d } = r;
        n in d ? o = d[n] : (vt(r), o = d[n] = c.call(
          null,
          t
        ), dt());
      } else
        o = c;
    }
    s[
      0
      /* shouldCast */
    ] && (i && !l ? o = !1 : s[
      1
      /* shouldCastTrue */
    ] && (o === "" || o === ye(n)) && (o = !0));
  }
  return o;
}
function ti(e, t, n = !1) {
  const o = t.propsCache, r = o.get(e);
  if (r)
    return r;
  const i = e.props, s = {}, l = [];
  let c = !1;
  if (!N(e)) {
    const f = (g) => {
      c = !0;
      const [x, E] = ti(g, t, !0);
      ee(s, x), E && l.push(...E);
    };
    !n && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f);
  }
  if (!i && !c)
    return G(e) && o.set(e, bt), bt;
  if (D(i))
    for (let f = 0; f < i.length; f++) {
      const g = Be(i[f]);
      Ko(g) && (s[g] = j);
    }
  else if (i)
    for (const f in i) {
      const g = Be(f);
      if (Ko(g)) {
        const x = i[f], E = s[g] = D(x) || N(x) ? { type: x } : ee({}, x);
        if (E) {
          const L = zo(Boolean, E.type), A = zo(String, E.type);
          E[
            0
            /* shouldCast */
          ] = L > -1, E[
            1
            /* shouldCastTrue */
          ] = A < 0 || L < A, (L > -1 || H(E, "default")) && l.push(g);
        }
      }
    }
  const d = [s, l];
  return G(e) && o.set(e, d), d;
}
function Ko(e) {
  return e[0] !== "$";
}
function jo(e) {
  const t = e && e.toString().match(/^\s*(function|class) (\w+)/);
  return t ? t[2] : e === null ? "null" : "";
}
function Go(e, t) {
  return jo(e) === jo(t);
}
function zo(e, t) {
  return D(t) ? t.findIndex((n) => Go(n, e)) : N(t) && Go(t, e) ? 0 : -1;
}
const ni = (e) => e[0] === "_" || e === "$stable", go = (e) => D(e) ? e.map(Ie) : [Ie(e)], Fs = (e, t, n) => {
  if (t._n)
    return t;
  const o = Ut((...r) => go(t(...r)), n);
  return o._c = !1, o;
}, oi = (e, t, n) => {
  const o = e._ctx;
  for (const r in e) {
    if (ni(r))
      continue;
    const i = e[r];
    if (N(i))
      t[r] = Fs(r, i, o);
    else if (i != null) {
      const s = go(i);
      t[r] = () => s;
    }
  }
}, ri = (e, t) => {
  const n = go(t);
  e.slots.default = () => n;
}, $s = (e, t) => {
  if (e.vnode.shapeFlag & 32) {
    const n = t._;
    n ? (e.slots = U(t), ln(t, "_", n)) : oi(
      t,
      e.slots = {}
    );
  } else
    e.slots = {}, t && ri(e, t);
  ln(e.slots, Sn, 1);
}, Ks = (e, t, n) => {
  const { vnode: o, slots: r } = e;
  let i = !0, s = j;
  if (o.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? i = !1 : (ee(r, t), !n && l === 1 && delete r._) : (i = !t.$stable, oi(t, r)), s = t;
  } else
    t && (ri(e, t), s = { default: 1 });
  if (i)
    for (const l in r)
      !ni(l) && s[l] == null && delete r[l];
};
function qn(e, t, n, o, r = !1) {
  if (D(e)) {
    e.forEach(
      (x, E) => qn(
        x,
        t && (D(t) ? t[E] : t),
        n,
        o,
        r
      )
    );
    return;
  }
  if (Nt(o) && !r)
    return;
  const i = o.shapeFlag & 4 ? Cn(o.component) || o.component.proxy : o.el, s = r ? null : i, { i: l, r: c } = e, d = t && t.r, f = l.refs === j ? l.refs = {} : l.refs, g = l.setupState;
  if (d != null && d !== c && (ne(d) ? (f[d] = null, H(g, d) && (g[d] = null)) : pe(d) && (d.value = null)), N(c))
    Ze(c, l, 12, [s, f]);
  else {
    const x = ne(c), E = pe(c);
    if (x || E) {
      const L = () => {
        if (e.f) {
          const A = x ? H(g, c) ? g[c] : f[c] : c.value;
          r ? D(A) && no(A, i) : D(A) ? A.includes(i) || A.push(i) : x ? (f[c] = [i], H(g, c) && (g[c] = f[c])) : (c.value = [i], e.k && (f[e.k] = c.value));
        } else
          x ? (f[c] = s, H(g, c) && (g[c] = s)) : E && (c.value = s, e.k && (f[e.k] = s));
      };
      s ? (L.id = -1, fe(L, n)) : L();
    }
  }
}
const fe = hs;
function js(e) {
  return Gs(e);
}
function Gs(e, t) {
  const n = Un();
  n.__VUE__ = !0;
  const {
    insert: o,
    remove: r,
    patchProp: i,
    createElement: s,
    createText: l,
    createComment: c,
    setText: d,
    setElementText: f,
    parentNode: g,
    nextSibling: x,
    setScopeId: E = De,
    insertStaticContent: L
  } = e, A = (a, u, p, m = null, h = null, y = null, w = !1, _ = null, v = !!u.dynamicChildren) => {
    if (a === u)
      return;
    a && !st(a, u) && (m = Wt(a), Pe(a, h, y, !0), a = null), u.patchFlag === -2 && (v = !1, u.dynamicChildren = null);
    const { type: b, ref: T, shapeFlag: S } = u;
    switch (b) {
      case wn:
        V(a, u, p, m);
        break;
      case we:
        W(a, u, p, m);
        break;
      case rn:
        a == null && z(u, p, m, w);
        break;
      case me:
        C(
          a,
          u,
          p,
          m,
          h,
          y,
          w,
          _,
          v
        );
        break;
      default:
        S & 1 ? q(
          a,
          u,
          p,
          m,
          h,
          y,
          w,
          _,
          v
        ) : S & 6 ? Z(
          a,
          u,
          p,
          m,
          h,
          y,
          w,
          _,
          v
        ) : (S & 64 || S & 128) && b.process(
          a,
          u,
          p,
          m,
          h,
          y,
          w,
          _,
          v,
          ft
        );
    }
    T != null && h && qn(T, a && a.ref, y, u || a, !u);
  }, V = (a, u, p, m) => {
    if (a == null)
      o(
        u.el = l(u.children),
        p,
        m
      );
    else {
      const h = u.el = a.el;
      u.children !== a.children && d(h, u.children);
    }
  }, W = (a, u, p, m) => {
    a == null ? o(
      u.el = c(u.children || ""),
      p,
      m
    ) : u.el = a.el;
  }, z = (a, u, p, m) => {
    [a.el, a.anchor] = L(
      a.children,
      u,
      p,
      m,
      a.el,
      a.anchor
    );
  }, X = ({ el: a, anchor: u }, p, m) => {
    let h;
    for (; a && a !== u; )
      h = x(a), o(a, p, m), a = h;
    o(u, p, m);
  }, P = ({ el: a, anchor: u }) => {
    let p;
    for (; a && a !== u; )
      p = x(a), r(a), a = p;
    r(u);
  }, q = (a, u, p, m, h, y, w, _, v) => {
    w = w || u.type === "svg", a == null ? Se(
      u,
      p,
      m,
      h,
      y,
      w,
      _,
      v
    ) : Y(
      a,
      u,
      h,
      y,
      w,
      _,
      v
    );
  }, Se = (a, u, p, m, h, y, w, _) => {
    let v, b;
    const { type: T, props: S, shapeFlag: O, transition: R, dirs: M } = a;
    if (v = a.el = s(
      a.type,
      y,
      S && S.is,
      S
    ), O & 8 ? f(v, a.children) : O & 16 && I(
      a.children,
      v,
      null,
      m,
      h,
      y && T !== "foreignObject",
      w,
      _
    ), M && et(a, null, m, "created"), Ce(v, a, a.scopeId, w, m), S) {
      for (const B in S)
        B !== "value" && !tn(B) && i(
          v,
          B,
          null,
          S[B],
          y,
          a.children,
          m,
          h,
          Me
        );
      "value" in S && i(v, "value", null, S.value), (b = S.onVnodeBeforeMount) && Le(b, m, a);
    }
    M && et(a, null, m, "beforeMount");
    const $ = zs(h, R);
    $ && R.beforeEnter(v), o(v, u, p), ((b = S && S.onVnodeMounted) || $ || M) && fe(() => {
      b && Le(b, m, a), $ && R.enter(v), M && et(a, null, m, "mounted");
    }, h);
  }, Ce = (a, u, p, m, h) => {
    if (p && E(a, p), m)
      for (let y = 0; y < m.length; y++)
        E(a, m[y]);
    if (h) {
      let y = h.subTree;
      if (u === y) {
        const w = h.vnode;
        Ce(
          a,
          w,
          w.scopeId,
          w.slotScopeIds,
          h.parent
        );
      }
    }
  }, I = (a, u, p, m, h, y, w, _, v = 0) => {
    for (let b = v; b < a.length; b++) {
      const T = a[b] = _ ? We(a[b]) : Ie(a[b]);
      A(
        null,
        T,
        u,
        p,
        m,
        h,
        y,
        w,
        _
      );
    }
  }, Y = (a, u, p, m, h, y, w) => {
    const _ = u.el = a.el;
    let { patchFlag: v, dynamicChildren: b, dirs: T } = u;
    v |= a.patchFlag & 16;
    const S = a.props || j, O = u.props || j;
    let R;
    p && tt(p, !1), (R = O.onVnodeBeforeUpdate) && Le(R, p, u, a), T && et(u, a, p, "beforeUpdate"), p && tt(p, !0);
    const M = h && u.type !== "foreignObject";
    if (b ? K(
      a.dynamicChildren,
      b,
      _,
      p,
      m,
      M,
      y
    ) : w || F(
      a,
      u,
      _,
      null,
      p,
      m,
      M,
      y,
      !1
    ), v > 0) {
      if (v & 16)
        le(
          _,
          u,
          S,
          O,
          p,
          m,
          h
        );
      else if (v & 2 && S.class !== O.class && i(_, "class", null, O.class, h), v & 4 && i(_, "style", S.style, O.style, h), v & 8) {
        const $ = u.dynamicProps;
        for (let B = 0; B < $.length; B++) {
          const Q = $[B], Ee = S[Q], mt = O[Q];
          (mt !== Ee || Q === "value") && i(
            _,
            Q,
            Ee,
            mt,
            h,
            a.children,
            p,
            m,
            Me
          );
        }
      }
      v & 1 && a.children !== u.children && f(_, u.children);
    } else
      !w && b == null && le(
        _,
        u,
        S,
        O,
        p,
        m,
        h
      );
    ((R = O.onVnodeUpdated) || T) && fe(() => {
      R && Le(R, p, u, a), T && et(u, a, p, "updated");
    }, m);
  }, K = (a, u, p, m, h, y, w) => {
    for (let _ = 0; _ < u.length; _++) {
      const v = a[_], b = u[_], T = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        v.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (v.type === me || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !st(v, b) || // - In the case of a component, it could contain anything.
        v.shapeFlag & 70) ? g(v.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      A(
        v,
        b,
        T,
        null,
        m,
        h,
        y,
        w,
        !0
      );
    }
  }, le = (a, u, p, m, h, y, w) => {
    if (p !== m) {
      if (p !== j)
        for (const _ in p)
          !tn(_) && !(_ in m) && i(
            a,
            _,
            p[_],
            null,
            w,
            u.children,
            h,
            y,
            Me
          );
      for (const _ in m) {
        if (tn(_))
          continue;
        const v = m[_], b = p[_];
        v !== b && _ !== "value" && i(
          a,
          _,
          b,
          v,
          w,
          u.children,
          h,
          y,
          Me
        );
      }
      "value" in m && i(a, "value", p.value, m.value);
    }
  }, C = (a, u, p, m, h, y, w, _, v) => {
    const b = u.el = a ? a.el : l(""), T = u.anchor = a ? a.anchor : l("");
    let { patchFlag: S, dynamicChildren: O, slotScopeIds: R } = u;
    R && (_ = _ ? _.concat(R) : R), a == null ? (o(b, p, m), o(T, p, m), I(
      u.children,
      p,
      T,
      h,
      y,
      w,
      _,
      v
    )) : S > 0 && S & 64 && O && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    a.dynamicChildren ? (K(
      a.dynamicChildren,
      O,
      p,
      h,
      y,
      w,
      _
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (u.key != null || h && u === h.subTree) && ii(
      a,
      u,
      !0
      /* shallow */
    )) : F(
      a,
      u,
      p,
      T,
      h,
      y,
      w,
      _,
      v
    );
  }, Z = (a, u, p, m, h, y, w, _, v) => {
    u.slotScopeIds = _, a == null ? u.shapeFlag & 512 ? h.ctx.activate(
      u,
      p,
      m,
      w,
      v
    ) : be(
      u,
      p,
      m,
      h,
      y,
      w,
      v
    ) : Et(a, u, v);
  }, be = (a, u, p, m, h, y, w) => {
    const _ = a.component = nl(
      a,
      m,
      h
    );
    if (yn(a) && (_.ctx.renderer = ft), rl(_), _.asyncDep) {
      if (h && h.registerDep(_, oe), !a.el) {
        const v = _.subTree = k(we);
        W(null, v, u, p);
      }
      return;
    }
    oe(
      _,
      a,
      u,
      p,
      h,
      y,
      w
    );
  }, Et = (a, u, p) => {
    const m = u.component = a.component;
    if (ds(a, u, p))
      if (m.asyncDep && !m.asyncResolved) {
        J(m, u, p);
        return;
      } else
        m.next = u, is(m.update), m.update();
    else
      u.el = a.el, m.vnode = u;
  }, oe = (a, u, p, m, h, y, w) => {
    const _ = () => {
      if (a.isMounted) {
        let { next: T, bu: S, u: O, parent: R, vnode: M } = a, $ = T, B;
        tt(a, !1), T ? (T.el = M.el, J(a, T, w)) : T = M, S && An(S), (B = T.props && T.props.onVnodeBeforeUpdate) && Le(B, R, T, M), tt(a, !0);
        const Q = Pn(a), Ee = a.subTree;
        a.subTree = Q, A(
          Ee,
          Q,
          // parent may have changed if it's in a teleport
          g(Ee.el),
          // anchor may have changed if it's in a fragment
          Wt(Ee),
          a,
          h,
          y
        ), T.el = Q.el, $ === null && ps(a, Q.el), O && fe(O, h), (B = T.props && T.props.onVnodeUpdated) && fe(
          () => Le(B, R, T, M),
          h
        );
      } else {
        let T;
        const { el: S, props: O } = u, { bm: R, m: M, parent: $ } = a, B = Nt(u);
        if (tt(a, !1), R && An(R), !B && (T = O && O.onVnodeBeforeMount) && Le(T, $, u), tt(a, !0), S && Tn) {
          const Q = () => {
            a.subTree = Pn(a), Tn(
              S,
              a.subTree,
              a,
              h,
              null
            );
          };
          B ? u.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !a.isUnmounted && Q()
          ) : Q();
        } else {
          const Q = a.subTree = Pn(a);
          A(
            null,
            Q,
            p,
            m,
            a,
            h,
            y
          ), u.el = Q.el;
        }
        if (M && fe(M, h), !B && (T = O && O.onVnodeMounted)) {
          const Q = u;
          fe(
            () => Le(T, $, Q),
            h
          );
        }
        (u.shapeFlag & 256 || $ && Nt($.vnode) && $.vnode.shapeFlag & 256) && a.a && fe(a.a, h), a.isMounted = !0, u = p = m = null;
      }
    }, v = a.effect = new so(
      _,
      () => mo(b),
      a.scope
      // track it in component's effect scope
    ), b = a.update = () => v.run();
    b.id = a.uid, tt(a, !0), b();
  }, J = (a, u, p) => {
    u.component = a;
    const m = a.vnode.props;
    a.vnode = u, a.next = null, Bs(a, u.props, m, p), Ks(a, u.children, p), St(), ko(a), Ct();
  }, F = (a, u, p, m, h, y, w, _, v = !1) => {
    const b = a && a.children, T = a ? a.shapeFlag : 0, S = u.children, { patchFlag: O, shapeFlag: R } = u;
    if (O > 0) {
      if (O & 128) {
        zt(
          b,
          S,
          p,
          m,
          h,
          y,
          w,
          _,
          v
        );
        return;
      } else if (O & 256) {
        qe(
          b,
          S,
          p,
          m,
          h,
          y,
          w,
          _,
          v
        );
        return;
      }
    }
    R & 8 ? (T & 16 && Me(b, h, y), S !== b && f(p, S)) : T & 16 ? R & 16 ? zt(
      b,
      S,
      p,
      m,
      h,
      y,
      w,
      _,
      v
    ) : Me(b, h, y, !0) : (T & 8 && f(p, ""), R & 16 && I(
      S,
      p,
      m,
      h,
      y,
      w,
      _,
      v
    ));
  }, qe = (a, u, p, m, h, y, w, _, v) => {
    a = a || bt, u = u || bt;
    const b = a.length, T = u.length, S = Math.min(b, T);
    let O;
    for (O = 0; O < S; O++) {
      const R = u[O] = v ? We(u[O]) : Ie(u[O]);
      A(
        a[O],
        R,
        p,
        null,
        h,
        y,
        w,
        _,
        v
      );
    }
    b > T ? Me(
      a,
      h,
      y,
      !0,
      !1,
      S
    ) : I(
      u,
      p,
      m,
      h,
      y,
      w,
      _,
      v,
      S
    );
  }, zt = (a, u, p, m, h, y, w, _, v) => {
    let b = 0;
    const T = u.length;
    let S = a.length - 1, O = T - 1;
    for (; b <= S && b <= O; ) {
      const R = a[b], M = u[b] = v ? We(u[b]) : Ie(u[b]);
      if (st(R, M))
        A(
          R,
          M,
          p,
          null,
          h,
          y,
          w,
          _,
          v
        );
      else
        break;
      b++;
    }
    for (; b <= S && b <= O; ) {
      const R = a[S], M = u[O] = v ? We(u[O]) : Ie(u[O]);
      if (st(R, M))
        A(
          R,
          M,
          p,
          null,
          h,
          y,
          w,
          _,
          v
        );
      else
        break;
      S--, O--;
    }
    if (b > S) {
      if (b <= O) {
        const R = O + 1, M = R < T ? u[R].el : m;
        for (; b <= O; )
          A(
            null,
            u[b] = v ? We(u[b]) : Ie(u[b]),
            p,
            M,
            h,
            y,
            w,
            _,
            v
          ), b++;
      }
    } else if (b > O)
      for (; b <= S; )
        Pe(a[b], h, y, !0), b++;
    else {
      const R = b, M = b, $ = /* @__PURE__ */ new Map();
      for (b = M; b <= O; b++) {
        const ge = u[b] = v ? We(u[b]) : Ie(u[b]);
        ge.key != null && $.set(ge.key, b);
      }
      let B, Q = 0;
      const Ee = O - M + 1;
      let mt = !1, Co = 0;
      const Tt = new Array(Ee);
      for (b = 0; b < Ee; b++)
        Tt[b] = 0;
      for (b = R; b <= S; b++) {
        const ge = a[b];
        if (Q >= Ee) {
          Pe(ge, h, y, !0);
          continue;
        }
        let Re;
        if (ge.key != null)
          Re = $.get(ge.key);
        else
          for (B = M; B <= O; B++)
            if (Tt[B - M] === 0 && st(ge, u[B])) {
              Re = B;
              break;
            }
        Re === void 0 ? Pe(ge, h, y, !0) : (Tt[Re - M] = b + 1, Re >= Co ? Co = Re : mt = !0, A(
          ge,
          u[Re],
          p,
          null,
          h,
          y,
          w,
          _,
          v
        ), Q++);
      }
      const Eo = mt ? Ws(Tt) : bt;
      for (B = Eo.length - 1, b = Ee - 1; b >= 0; b--) {
        const ge = M + b, Re = u[ge], To = ge + 1 < T ? u[ge + 1].el : m;
        Tt[b] === 0 ? A(
          null,
          Re,
          p,
          To,
          h,
          y,
          w,
          _,
          v
        ) : mt && (B < 0 || b !== Eo[B] ? Qe(Re, p, To, 2) : B--);
      }
    }
  }, Qe = (a, u, p, m, h = null) => {
    const { el: y, type: w, transition: _, children: v, shapeFlag: b } = a;
    if (b & 6) {
      Qe(a.component.subTree, u, p, m);
      return;
    }
    if (b & 128) {
      a.suspense.move(u, p, m);
      return;
    }
    if (b & 64) {
      w.move(a, u, p, ft);
      return;
    }
    if (w === me) {
      o(y, u, p);
      for (let S = 0; S < v.length; S++)
        Qe(v[S], u, p, m);
      o(a.anchor, u, p);
      return;
    }
    if (w === rn) {
      X(a, u, p);
      return;
    }
    if (m !== 2 && b & 1 && _)
      if (m === 0)
        _.beforeEnter(y), o(y, u, p), fe(() => _.enter(y), h);
      else {
        const { leave: S, delayLeave: O, afterLeave: R } = _, M = () => o(y, u, p), $ = () => {
          S(y, () => {
            M(), R && R();
          });
        };
        O ? O(y, M, $) : $();
      }
    else
      o(y, u, p);
  }, Pe = (a, u, p, m = !1, h = !1) => {
    const {
      type: y,
      props: w,
      ref: _,
      children: v,
      dynamicChildren: b,
      shapeFlag: T,
      patchFlag: S,
      dirs: O
    } = a;
    if (_ != null && qn(_, null, p, a, !0), T & 256) {
      u.ctx.deactivate(a);
      return;
    }
    const R = T & 1 && O, M = !Nt(a);
    let $;
    if (M && ($ = w && w.onVnodeBeforeUnmount) && Le($, u, a), T & 6)
      mi(a.component, p, m);
    else {
      if (T & 128) {
        a.suspense.unmount(p, m);
        return;
      }
      R && et(a, null, u, "beforeUnmount"), T & 64 ? a.type.remove(
        a,
        u,
        p,
        h,
        ft,
        m
      ) : b && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (y !== me || S > 0 && S & 64) ? Me(
        b,
        u,
        p,
        !1,
        !0
      ) : (y === me && S & 384 || !h && T & 16) && Me(v, u, p), m && wo(a);
    }
    (M && ($ = w && w.onVnodeUnmounted) || R) && fe(() => {
      $ && Le($, u, a), R && et(a, null, u, "unmounted");
    }, p);
  }, wo = (a) => {
    const { type: u, el: p, anchor: m, transition: h } = a;
    if (u === me) {
      fi(p, m);
      return;
    }
    if (u === rn) {
      P(a);
      return;
    }
    const y = () => {
      r(p), h && !h.persisted && h.afterLeave && h.afterLeave();
    };
    if (a.shapeFlag & 1 && h && !h.persisted) {
      const { leave: w, delayLeave: _ } = h, v = () => w(p, y);
      _ ? _(a.el, y, v) : v();
    } else
      y();
  }, fi = (a, u) => {
    let p;
    for (; a !== u; )
      p = x(a), r(a), a = p;
    r(u);
  }, mi = (a, u, p) => {
    const { bum: m, scope: h, update: y, subTree: w, um: _ } = a;
    m && An(m), h.stop(), y && (y.active = !1, Pe(w, a, u, p)), _ && fe(_, u), fe(() => {
      a.isUnmounted = !0;
    }, u), u && u.pendingBranch && !u.isUnmounted && a.asyncDep && !a.asyncResolved && a.suspenseId === u.pendingId && (u.deps--, u.deps === 0 && u.resolve());
  }, Me = (a, u, p, m = !1, h = !1, y = 0) => {
    for (let w = y; w < a.length; w++)
      Pe(a[w], u, p, m, h);
  }, Wt = (a) => a.shapeFlag & 6 ? Wt(a.component.subTree) : a.shapeFlag & 128 ? a.suspense.next() : x(a.anchor || a.el), So = (a, u, p) => {
    a == null ? u._vnode && Pe(u._vnode, null, null, !0) : A(u._vnode || null, a, u, null, null, null, p), ko(), Ur(), u._vnode = a;
  }, ft = {
    p: A,
    um: Pe,
    m: Qe,
    r: wo,
    mt: be,
    mc: I,
    pc: F,
    pbc: K,
    n: Wt,
    o: e
  };
  let En, Tn;
  return t && ([En, Tn] = t(
    ft
  )), {
    render: So,
    hydrate: En,
    createApp: Hs(So, En)
  };
}
function tt({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n;
}
function zs(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ii(e, t, n = !1) {
  const o = e.children, r = t.children;
  if (D(o) && D(r))
    for (let i = 0; i < o.length; i++) {
      const s = o[i];
      let l = r[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[i] = We(r[i]), l.el = s.el), n || ii(s, l)), l.type === wn && (l.el = s.el);
    }
}
function Ws(e) {
  const t = e.slice(), n = [0];
  let o, r, i, s, l;
  const c = e.length;
  for (o = 0; o < c; o++) {
    const d = e[o];
    if (d !== 0) {
      if (r = n[n.length - 1], e[r] < d) {
        t[o] = r, n.push(o);
        continue;
      }
      for (i = 0, s = n.length - 1; i < s; )
        l = i + s >> 1, e[n[l]] < d ? i = l + 1 : s = l;
      d < e[n[i]] && (i > 0 && (t[o] = n[i - 1]), n[i] = o);
    }
  }
  for (i = n.length, s = n[i - 1]; i-- > 0; )
    n[i] = s, s = t[s];
  return n;
}
const Xs = (e) => e.__isTeleport, me = Symbol.for("v-fgt"), wn = Symbol.for("v-txt"), we = Symbol.for("v-cmt"), rn = Symbol.for("v-stc"), kt = [];
let Ae = null;
function re(e = !1) {
  kt.push(Ae = e ? null : []);
}
function Zs() {
  kt.pop(), Ae = kt[kt.length - 1] || null;
}
let Bt = 1;
function Wo(e) {
  Bt += e;
}
function si(e) {
  return e.dynamicChildren = Bt > 0 ? Ae || bt : null, Zs(), Bt > 0 && Ae && Ae.push(e), e;
}
function Ft(e, t, n, o, r, i) {
  return si(
    ie(
      e,
      t,
      n,
      o,
      r,
      i,
      !0
      /* isBlock */
    )
  );
}
function _e(e, t, n, o, r) {
  return si(
    k(
      e,
      t,
      n,
      o,
      r,
      !0
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function pn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function st(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Sn = "__vInternal", li = ({ key: e }) => e ?? null, sn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ne(e) || pe(e) || N(e) ? { i: ce, r: e, k: t, f: !!n } : e : null);
function ie(e, t = null, n = null, o = 0, r = null, i = e === me ? 0 : 1, s = !1, l = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && li(t),
    ref: t && sn(t),
    scopeId: $r,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: o,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: ce
  };
  return l ? (_o(c, n), i & 128 && e.normalize(c)) : n && (c.shapeFlag |= ne(n) ? 8 : 16), Bt > 0 && // avoid a block node from tracking itself
  !s && // has current parent block
  Ae && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && Ae.push(c), c;
}
const k = Ys;
function Ys(e, t = null, n = null, o = 0, r = null, i = !1) {
  if ((!e || e === fs) && (e = we), pn(e)) {
    const l = Je(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && _o(l, n), Bt > 0 && !i && Ae && (l.shapeFlag & 6 ? Ae[Ae.indexOf(e)] = l : Ae.push(l)), l.patchFlag |= -2, l;
  }
  if (al(e) && (e = e.__vccOpts), t) {
    t = Js(t);
    let { class: l, style: c } = t;
    l && !ne(l) && (t.class = jt(l)), G(c) && (Rr(c) && !D(c) && (c = ee({}, c)), t.style = ro(c));
  }
  const s = ne(e) ? 1 : ms(e) ? 128 : Xs(e) ? 64 : G(e) ? 4 : N(e) ? 2 : 0;
  return ie(
    e,
    t,
    n,
    o,
    r,
    s,
    i,
    !0
  );
}
function Js(e) {
  return e ? Rr(e) || Sn in e ? ee({}, e) : e : null;
}
function Je(e, t, n = !1) {
  const { props: o, ref: r, patchFlag: i, children: s } = e, l = t ? Qs(o || {}, t) : o;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: l,
    key: l && li(l),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? D(r) ? r.concat(sn(t)) : [r, sn(t)] : sn(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: s,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== me ? i === -1 ? 16 : i | 16 : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Je(e.ssContent),
    ssFallback: e.ssFallback && Je(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
}
function ut(e = " ", t = 0) {
  return k(wn, null, e, t);
}
function qs(e, t) {
  const n = k(rn, null, e);
  return n.staticCount = t, n;
}
function He(e = "", t = !1) {
  return t ? (re(), _e(we, null, e)) : k(we, null, e);
}
function Ie(e) {
  return e == null || typeof e == "boolean" ? k(we) : D(e) ? k(
    me,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : typeof e == "object" ? We(e) : k(wn, null, String(e));
}
function We(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Je(e);
}
function _o(e, t) {
  let n = 0;
  const { shapeFlag: o } = e;
  if (t == null)
    t = null;
  else if (D(t))
    n = 16;
  else if (typeof t == "object")
    if (o & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), _o(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !(Sn in t) ? t._ctx = ce : r === 3 && ce && (ce.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else
    N(t) ? (t = { default: t, _ctx: ce }, n = 32) : (t = String(t), o & 64 ? (n = 16, t = [ut(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Qs(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (const r in o)
      if (r === "class")
        t.class !== o.class && (t.class = jt([t.class, o.class]));
      else if (r === "style")
        t.style = ro([t.style, o.style]);
      else if (mn(r)) {
        const i = t[r], s = o[r];
        s && i !== s && !(D(i) && i.includes(s)) && (t[r] = i ? [].concat(i, s) : s);
      } else
        r !== "" && (t[r] = o[r]);
  }
  return t;
}
function Le(e, t, n, o = null) {
  ve(e, t, 7, [
    n,
    o
  ]);
}
const el = Qr();
let tl = 0;
function nl(e, t, n) {
  const o = e.type, r = (t ? t.appContext : e.appContext) || el, i = {
    uid: tl++,
    vnode: e,
    type: o,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new Oi(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: ti(o, r),
    emitsOptions: Fr(o, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: j,
    // inheritAttrs
    inheritAttrs: o.inheritAttrs,
    // state
    ctx: j,
    data: j,
    props: j,
    attrs: j,
    slots: j,
    refs: j,
    setupState: j,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = as.bind(null, i), e.ce && e.ce(i), i;
}
let se = null;
const ol = () => se || ce;
let xo, ht, Xo = "__VUE_INSTANCE_SETTERS__";
(ht = Un()[Xo]) || (ht = Un()[Xo] = []), ht.push((e) => se = e), xo = (e) => {
  ht.length > 1 ? ht.forEach((t) => t(e)) : ht[0](e);
};
const vt = (e) => {
  xo(e), e.scope.on();
}, dt = () => {
  se && se.scope.off(), xo(null);
};
function ai(e) {
  return e.vnode.shapeFlag & 4;
}
let $t = !1;
function rl(e, t = !1) {
  $t = t;
  const { props: n, children: o } = e.vnode, r = ai(e);
  Us(e, n, r, t), $s(e, o);
  const i = r ? il(e, t) : void 0;
  return $t = !1, i;
}
function il(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = Lr(new Proxy(e.ctx, Ps));
  const { setup: o } = n;
  if (o) {
    const r = e.setupContext = o.length > 1 ? ll(e) : null;
    vt(e), St();
    const i = Ze(
      o,
      e,
      0,
      [e.props, r]
    );
    if (Ct(), dt(), mr(i)) {
      if (i.then(dt, dt), t)
        return i.then((s) => {
          Zo(e, s, t);
        }).catch((s) => {
          _n(s, e, 0);
        });
      e.asyncDep = i;
    } else
      Zo(e, i, t);
  } else
    ci(e, t);
}
function Zo(e, t, n) {
  N(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : G(t) && (e.setupState = kr(t)), ci(e, n);
}
let Yo;
function ci(e, t, n) {
  const o = e.type;
  if (!e.render) {
    if (!t && Yo && !o.render) {
      const r = o.template || bo(e).template;
      if (r) {
        const { isCustomElement: i, compilerOptions: s } = e.appContext.config, { delimiters: l, compilerOptions: c } = o, d = ee(
          ee(
            {
              isCustomElement: i,
              delimiters: l
            },
            s
          ),
          c
        );
        o.render = Yo(r, d);
      }
    }
    e.render = o.render || De;
  }
  {
    vt(e), St();
    try {
      Rs(e);
    } finally {
      Ct(), dt();
    }
  }
}
function sl(e) {
  return e.attrsProxy || (e.attrsProxy = new Proxy(
    e.attrs,
    {
      get(t, n) {
        return he(e, "get", "$attrs"), t[n];
      }
    }
  ));
}
function ll(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    get attrs() {
      return sl(e);
    },
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Cn(e) {
  if (e.exposed)
    return e.exposeProxy || (e.exposeProxy = new Proxy(kr(Lr(e.exposed)), {
      get(t, n) {
        if (n in t)
          return t[n];
        if (n in It)
          return It[n](e);
      },
      has(t, n) {
        return n in t || n in It;
      }
    }));
}
function al(e) {
  return N(e) && "__vccOpts" in e;
}
const rt = (e, t) => ns(e, t, $t);
function cl(e, t, n) {
  const o = arguments.length;
  return o === 2 ? G(t) && !D(t) ? pn(t) ? k(e, null, [t]) : k(e, t) : k(e, null, t) : (o > 3 ? n = Array.prototype.slice.call(arguments, 2) : o === 3 && pn(n) && (n = [n]), k(e, t, n));
}
const ul = Symbol.for("v-scx"), dl = () => on(ul), pl = "3.3.13", fl = "http://www.w3.org/2000/svg", lt = typeof document < "u" ? document : null, Jo = lt && /* @__PURE__ */ lt.createElement("template"), ml = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, o) => {
    const r = t ? lt.createElementNS(fl, e) : lt.createElement(e, n ? { is: n } : void 0);
    return e === "select" && o && o.multiple != null && r.setAttribute("multiple", o.multiple), r;
  },
  createText: (e) => lt.createTextNode(e),
  createComment: (e) => lt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => lt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, o, r, i) {
    const s = n ? n.previousSibling : t.lastChild;
    if (r && (r === i || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); )
        ;
    else {
      Jo.innerHTML = o ? `<svg>${e}</svg>` : e;
      const l = Jo.content;
      if (o) {
        const c = l.firstChild;
        for (; c.firstChild; )
          l.appendChild(c.firstChild);
        l.removeChild(c);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      s ? s.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, je = "transition", At = "animation", Kt = Symbol("_vtc"), fn = (e, { slots: t }) => cl(xs, hl(e), t);
fn.displayName = "Transition";
const ui = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
fn.props = /* @__PURE__ */ ee(
  {},
  Gr,
  ui
);
const nt = (e, t = []) => {
  D(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, qo = (e) => e ? D(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function hl(e) {
  const t = {};
  for (const C in e)
    C in ui || (t[C] = e[C]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: o,
    duration: r,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: s = `${n}-enter-active`,
    enterToClass: l = `${n}-enter-to`,
    appearFromClass: c = i,
    appearActiveClass: d = s,
    appearToClass: f = l,
    leaveFromClass: g = `${n}-leave-from`,
    leaveActiveClass: x = `${n}-leave-active`,
    leaveToClass: E = `${n}-leave-to`
  } = e, L = bl(r), A = L && L[0], V = L && L[1], {
    onBeforeEnter: W,
    onEnter: z,
    onEnterCancelled: X,
    onLeave: P,
    onLeaveCancelled: q,
    onBeforeAppear: Se = W,
    onAppear: Ce = z,
    onAppearCancelled: I = X
  } = t, Y = (C, Z, be) => {
    ot(C, Z ? f : l), ot(C, Z ? d : s), be && be();
  }, K = (C, Z) => {
    C._isLeaving = !1, ot(C, g), ot(C, E), ot(C, x), Z && Z();
  }, le = (C) => (Z, be) => {
    const Et = C ? Ce : z, oe = () => Y(Z, C, be);
    nt(Et, [Z, oe]), Qo(() => {
      ot(Z, C ? c : i), Ge(Z, C ? f : l), qo(Et) || er(Z, o, A, oe);
    });
  };
  return ee(t, {
    onBeforeEnter(C) {
      nt(W, [C]), Ge(C, i), Ge(C, s);
    },
    onBeforeAppear(C) {
      nt(Se, [C]), Ge(C, c), Ge(C, d);
    },
    onEnter: le(!1),
    onAppear: le(!0),
    onLeave(C, Z) {
      C._isLeaving = !0;
      const be = () => K(C, Z);
      Ge(C, g), xl(), Ge(C, x), Qo(() => {
        C._isLeaving && (ot(C, g), Ge(C, E), qo(P) || er(C, o, V, be));
      }), nt(P, [C, be]);
    },
    onEnterCancelled(C) {
      Y(C, !1), nt(X, [C]);
    },
    onAppearCancelled(C) {
      Y(C, !0), nt(I, [C]);
    },
    onLeaveCancelled(C) {
      K(C), nt(q, [C]);
    }
  });
}
function bl(e) {
  if (e == null)
    return null;
  if (G(e))
    return [Nn(e.enter), Nn(e.leave)];
  {
    const t = Nn(e);
    return [t, t];
  }
}
function Nn(e) {
  return Vn(e);
}
function Ge(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Kt] || (e[Kt] = /* @__PURE__ */ new Set())).add(t);
}
function ot(e, t) {
  t.split(/\s+/).forEach((o) => o && e.classList.remove(o));
  const n = e[Kt];
  n && (n.delete(t), n.size || (e[Kt] = void 0));
}
function Qo(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let gl = 0;
function er(e, t, n, o) {
  const r = e._endId = ++gl, i = () => {
    r === e._endId && o();
  };
  if (n)
    return setTimeout(i, n);
  const { type: s, timeout: l, propCount: c } = _l(e, t);
  if (!s)
    return o();
  const d = s + "end";
  let f = 0;
  const g = () => {
    e.removeEventListener(d, x), i();
  }, x = (E) => {
    E.target === e && ++f >= c && g();
  };
  setTimeout(() => {
    f < c && g();
  }, l + 1), e.addEventListener(d, x);
}
function _l(e, t) {
  const n = window.getComputedStyle(e), o = (L) => (n[L] || "").split(", "), r = o(`${je}Delay`), i = o(`${je}Duration`), s = tr(r, i), l = o(`${At}Delay`), c = o(`${At}Duration`), d = tr(l, c);
  let f = null, g = 0, x = 0;
  t === je ? s > 0 && (f = je, g = s, x = i.length) : t === At ? d > 0 && (f = At, g = d, x = c.length) : (g = Math.max(s, d), f = g > 0 ? s > d ? je : At : null, x = f ? f === je ? i.length : c.length : 0);
  const E = f === je && /\b(transform|all)(,|$)/.test(
    o(`${je}Property`).toString()
  );
  return {
    type: f,
    timeout: g,
    propCount: x,
    hasTransform: E
  };
}
function tr(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, o) => nr(n) + nr(e[o])));
}
function nr(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function xl() {
  return document.body.offsetHeight;
}
function yl(e, t, n) {
  const o = e[Kt];
  o && (t = (t ? [t, ...o] : [...o]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const yo = Symbol("_vod"), Dt = {
  beforeMount(e, { value: t }, { transition: n }) {
    e[yo] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Pt(e, t);
  },
  mounted(e, { value: t }, { transition: n }) {
    n && t && n.enter(e);
  },
  updated(e, { value: t, oldValue: n }, { transition: o }) {
    !t != !n && (o ? t ? (o.beforeEnter(e), Pt(e, !0), o.enter(e)) : o.leave(e, () => {
      Pt(e, !1);
    }) : Pt(e, t));
  },
  beforeUnmount(e, { value: t }) {
    Pt(e, t);
  }
};
function Pt(e, t) {
  e.style.display = t ? e[yo] : "none";
}
const vl = Symbol("");
function wl(e, t, n) {
  const o = e.style, r = ne(n);
  if (n && !r) {
    if (t && !ne(t))
      for (const i in t)
        n[i] == null && Qn(o, i, "");
    for (const i in n)
      Qn(o, i, n[i]);
  } else {
    const i = o.display;
    if (r) {
      if (t !== n) {
        const s = o[vl];
        s && (n += ";" + s), o.cssText = n;
      }
    } else
      t && e.removeAttribute("style");
    yo in e && (o.display = i);
  }
}
const or = /\s*!important$/;
function Qn(e, t, n) {
  if (D(n))
    n.forEach((o) => Qn(e, t, o));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const o = Sl(e, t);
    or.test(n) ? e.setProperty(
      ye(o),
      n.replace(or, ""),
      "important"
    ) : e[o] = n;
  }
}
const rr = ["Webkit", "Moz", "ms"], In = {};
function Sl(e, t) {
  const n = In[t];
  if (n)
    return n;
  let o = Be(t);
  if (o !== "filter" && o in e)
    return In[t] = o;
  o = gr(o);
  for (let r = 0; r < rr.length; r++) {
    const i = rr[r] + o;
    if (i in e)
      return In[t] = i;
  }
  return t;
}
const ir = "http://www.w3.org/1999/xlink";
function Cl(e, t, n, o, r) {
  if (o && t.startsWith("xlink:"))
    n == null ? e.removeAttributeNS(ir, t.slice(6, t.length)) : e.setAttributeNS(ir, t, n);
  else {
    const i = Ti(t);
    n == null || i && !_r(n) ? e.removeAttribute(t) : e.setAttribute(t, i ? "" : n);
  }
}
function El(e, t, n, o, r, i, s) {
  if (t === "innerHTML" || t === "textContent") {
    o && s(o, r, i), e[t] = n ?? "";
    return;
  }
  const l = e.tagName;
  if (t === "value" && l !== "PROGRESS" && // custom elements may use _value internally
  !l.includes("-")) {
    e._value = n;
    const d = l === "OPTION" ? e.getAttribute("value") : e.value, f = n ?? "";
    d !== f && (e.value = f), n == null && e.removeAttribute(t);
    return;
  }
  let c = !1;
  if (n === "" || n == null) {
    const d = typeof e[t];
    d === "boolean" ? n = _r(n) : n == null && d === "string" ? (n = "", c = !0) : d === "number" && (n = 0, c = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  c && e.removeAttribute(t);
}
function Tl(e, t, n, o) {
  e.addEventListener(t, n, o);
}
function Ol(e, t, n, o) {
  e.removeEventListener(t, n, o);
}
const sr = Symbol("_vei");
function Al(e, t, n, o, r = null) {
  const i = e[sr] || (e[sr] = {}), s = i[t];
  if (o && s)
    s.value = o;
  else {
    const [l, c] = Dl(t);
    if (o) {
      const d = i[t] = Ll(o, r);
      Tl(e, l, d, c);
    } else
      s && (Ol(e, l, s, c), i[t] = void 0);
  }
}
const lr = /(?:Once|Passive|Capture)$/;
function Dl(e) {
  let t;
  if (lr.test(e)) {
    t = {};
    let o;
    for (; o = e.match(lr); )
      e = e.slice(0, e.length - o[0].length), t[o[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : ye(e.slice(2)), t];
}
let kn = 0;
const Pl = /* @__PURE__ */ Promise.resolve(), Rl = () => kn || (Pl.then(() => kn = 0), kn = Date.now());
function Ll(e, t) {
  const n = (o) => {
    if (!o._vts)
      o._vts = Date.now();
    else if (o._vts <= n.attached)
      return;
    ve(
      Nl(o, n.value),
      t,
      5,
      [o]
    );
  };
  return n.value = e, n.attached = Rl(), n;
}
function Nl(e, t) {
  if (D(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map((o) => (r) => !r._stopped && o && o(r));
  } else
    return t;
}
const ar = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Il = (e, t, n, o, r = !1, i, s, l, c) => {
  t === "class" ? yl(e, o, r) : t === "style" ? wl(e, n, o) : mn(t) ? to(t) || Al(e, t, n, o, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : kl(e, t, o, r)) ? El(
    e,
    t,
    o,
    i,
    s,
    l,
    c
  ) : (t === "true-value" ? e._trueValue = o : t === "false-value" && (e._falseValue = o), Cl(e, t, o, r));
};
function kl(e, t, n, o) {
  if (o)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ar(t) && N(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return ar(t) && ne(n) ? !1 : t in e;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Ml(e, t) {
  const n = /* @__PURE__ */ Gt(e);
  class o extends vo {
    constructor(i) {
      super(n, i, t);
    }
  }
  return o.def = n, o;
}
const Hl = typeof HTMLElement < "u" ? HTMLElement : class {
};
class vo extends Hl {
  constructor(t, n = {}, o) {
    super(), this._def = t, this._props = n, this._instance = null, this._connected = !1, this._resolved = !1, this._numberProps = null, this._ob = null, this.shadowRoot && o ? o(this._createVNode(), this.shadowRoot) : (this.attachShadow({ mode: "open" }), this._def.__asyncLoader || this._resolveProps(this._def));
  }
  connectedCallback() {
    this._connected = !0, this._instance || (this._resolved ? this._update() : this._resolveDef());
  }
  disconnectedCallback() {
    this._connected = !1, this._ob && (this._ob.disconnect(), this._ob = null), Hr(() => {
      this._connected || (ur(null, this.shadowRoot), this._instance = null);
    });
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    this._resolved = !0;
    for (let o = 0; o < this.attributes.length; o++)
      this._setAttr(this.attributes[o].name);
    this._ob = new MutationObserver((o) => {
      for (const r of o)
        this._setAttr(r.attributeName);
    }), this._ob.observe(this, { attributes: !0 });
    const t = (o, r = !1) => {
      const { props: i, styles: s } = o;
      let l;
      if (i && !D(i))
        for (const c in i) {
          const d = i[c];
          (d === Number || d && d.type === Number) && (c in this._props && (this._props[c] = Vn(this._props[c])), (l || (l = /* @__PURE__ */ Object.create(null)))[Be(c)] = !0);
        }
      this._numberProps = l, r && this._resolveProps(o), this._applyStyles(s), this._update();
    }, n = this._def.__asyncLoader;
    n ? n().then((o) => t(o, !0)) : t(this._def);
  }
  _resolveProps(t) {
    const { props: n } = t, o = D(n) ? n : Object.keys(n || {});
    for (const r of Object.keys(this))
      r[0] !== "_" && o.includes(r) && this._setProp(r, this[r], !0, !1);
    for (const r of o.map(Be))
      Object.defineProperty(this, r, {
        get() {
          return this._getProp(r);
        },
        set(i) {
          this._setProp(r, i);
        }
      });
  }
  _setAttr(t) {
    let n = this.getAttribute(t);
    const o = Be(t);
    this._numberProps && this._numberProps[o] && (n = Vn(n)), this._setProp(o, n, !1);
  }
  /**
   * @internal
   */
  _getProp(t) {
    return this._props[t];
  }
  /**
   * @internal
   */
  _setProp(t, n, o = !0, r = !0) {
    n !== this._props[t] && (this._props[t] = n, r && this._instance && this._update(), o && (n === !0 ? this.setAttribute(ye(t), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(ye(t), n + "") : n || this.removeAttribute(ye(t))));
  }
  _update() {
    ur(this._createVNode(), this.shadowRoot);
  }
  _createVNode() {
    const t = k(this._def, ee({}, this._props));
    return this._instance || (t.ce = (n) => {
      this._instance = n, n.isCE = !0;
      const o = (i, s) => {
        this.dispatchEvent(
          new CustomEvent(i, {
            detail: s
          })
        );
      };
      n.emit = (i, ...s) => {
        o(i, s), ye(i) !== i && o(ye(i), s);
      };
      let r = this;
      for (; r = r && (r.parentNode || r.host); )
        if (r instanceof vo) {
          n.parent = r._instance, n.provides = r._instance.provides;
          break;
        }
    }), t;
  }
  _applyStyles(t) {
    t && t.forEach((n) => {
      const o = document.createElement("style");
      o.textContent = n, this.shadowRoot.appendChild(o);
    });
  }
}
const Vl = ["ctrl", "shift", "alt", "meta"], Ul = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => Vl.some((n) => e[`${n}Key`] && !t.includes(n))
}, te = (e, t) => {
  const n = e._withMods || (e._withMods = {}), o = t.join(".");
  return n[o] || (n[o] = (r, ...i) => {
    for (let s = 0; s < t.length; s++) {
      const l = Ul[t[s]];
      if (l && l(r, t))
        return;
    }
    return e(r, ...i);
  });
}, Bl = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, Ne = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), o = t.join(".");
  return n[o] || (n[o] = (r) => {
    if (!("key" in r))
      return;
    const i = ye(r.key);
    if (t.some((s) => s === i || Bl[s] === i))
      return e(r);
  });
}, Fl = /* @__PURE__ */ ee({ patchProp: Il }, ml);
let cr;
function $l() {
  return cr || (cr = js(Fl));
}
const ur = (...e) => {
  $l().render(...e);
};
function Mn(e) {
  return e === 0 ? !1 : Array.isArray(e) && e.length === 0 ? !0 : !e;
}
function Kl(e) {
  return (...t) => !e(...t);
}
function jl(e, t) {
  return e === void 0 && (e = "undefined"), e === null && (e = "null"), e === !1 && (e = "false"), e.toString().toLowerCase().indexOf(t.trim()) !== -1;
}
function di(e, t, n, o) {
  return t ? e.filter((r) => jl(o(r, n), t)).sort((r, i) => o(r, n).length - o(i, n).length) : e;
}
function Gl(e) {
  return e.filter((t) => !t.$isLabel);
}
function Hn(e, t) {
  return (n) => n.reduce((o, r) => r[e] && r[e].length ? (o.push({
    $groupLabel: r[t],
    $isLabel: !0
  }), o.concat(r[e])) : o, []);
}
function zl(e, t, n, o, r) {
  return (i) => i.map((s) => {
    if (!s[n])
      return console.warn("Options passed to vue-multiselect do not contain groups, despite the config."), [];
    const l = di(s[n], e, t, r);
    return l.length ? {
      [o]: s[o],
      [n]: l
    } : [];
  });
}
const dr = (...e) => (t) => e.reduce((n, o) => o(n), t);
var Wl = {
  data() {
    return {
      search: "",
      isOpen: !1,
      preferredOpenDirection: "below",
      optimizedHeight: this.maxHeight
    };
  },
  props: {
    /**
     * Decide whether to filter the results based on search query.
     * Useful for async filtering, where we search through more complex data.
     * @type {Boolean}
     */
    internalSearch: {
      type: Boolean,
      default: !0
    },
    /**
     * Array of available options: Objects, Strings or Integers.
     * If array of objects, visible label will default to option.label.
     * If `labal` prop is passed, label will equal option['label']
     * @type {Array}
     */
    options: {
      type: Array,
      required: !0
    },
    /**
     * Equivalent to the `multiple` attribute on a `<select>` input.
     * @default false
     * @type {Boolean}
     */
    multiple: {
      type: Boolean,
      default: !1
    },
    /**
     * Key to compare objects
     * @default 'id'
     * @type {String}
     */
    trackBy: {
      type: String
    },
    /**
     * Label to look for in option Object
     * @default 'label'
     * @type {String}
     */
    label: {
      type: String
    },
    /**
     * Enable/disable search in options
     * @default true
     * @type {Boolean}
     */
    searchable: {
      type: Boolean,
      default: !0
    },
    /**
     * Clear the search input after `)
     * @default true
     * @type {Boolean}
     */
    clearOnSelect: {
      type: Boolean,
      default: !0
    },
    /**
     * Hide already selected options
     * @default false
     * @type {Boolean}
     */
    hideSelected: {
      type: Boolean,
      default: !1
    },
    /**
     * Equivalent to the `placeholder` attribute on a `<select>` input.
     * @default 'Select option'
     * @type {String}
     */
    placeholder: {
      type: String,
      default: "Select option"
    },
    /**
     * Allow to remove all selected values
     * @default true
     * @type {Boolean}
     */
    allowEmpty: {
      type: Boolean,
      default: !0
    },
    /**
     * Reset this.internalValue, this.search after this.internalValue changes.
     * Useful if want to create a stateless dropdown.
     * @default false
     * @type {Boolean}
     */
    resetAfter: {
      type: Boolean,
      default: !1
    },
    /**
     * Enable/disable closing after selecting an option
     * @default true
     * @type {Boolean}
     */
    closeOnSelect: {
      type: Boolean,
      default: !0
    },
    /**
     * Function to interpolate the custom label
     * @default false
     * @type {Function}
     */
    customLabel: {
      type: Function,
      default(e, t) {
        return Mn(e) ? "" : t ? e[t] : e;
      }
    },
    /**
     * Disable / Enable tagging
     * @default false
     * @type {Boolean}
     */
    taggable: {
      type: Boolean,
      default: !1
    },
    /**
     * String to show when highlighting a potential tag
     * @default 'Press enter to create a tag'
     * @type {String}
    */
    tagPlaceholder: {
      type: String,
      default: "Press enter to create a tag"
    },
    /**
     * By default new tags will appear above the search results.
     * Changing to 'bottom' will revert this behaviour
     * and will proritize the search results
     * @default 'top'
     * @type {String}
    */
    tagPosition: {
      type: String,
      default: "top"
    },
    /**
     * Number of allowed selected options. No limit if 0.
     * @default 0
     * @type {Number}
    */
    max: {
      type: [Number, Boolean],
      default: !1
    },
    /**
     * Will be passed with all events as second param.
     * Useful for identifying events origin.
     * @default null
     * @type {String|Integer}
    */
    id: {
      default: null
    },
    /**
     * Limits the options displayed in the dropdown
     * to the first X options.
     * @default 1000
     * @type {Integer}
    */
    optionsLimit: {
      type: Number,
      default: 1e3
    },
    /**
     * Name of the property containing
     * the group values
     * @default 1000
     * @type {String}
    */
    groupValues: {
      type: String
    },
    /**
     * Name of the property containing
     * the group label
     * @default 1000
     * @type {String}
    */
    groupLabel: {
      type: String
    },
    /**
     * Allow to select all group values
     * by selecting the group label
     * @default false
     * @type {Boolean}
     */
    groupSelect: {
      type: Boolean,
      default: !1
    },
    /**
     * Array of keyboard keys to block
     * when selecting
     * @default 1000
     * @type {String}
    */
    blockKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * Prevent from wiping up the search value
     * @default false
     * @type {Boolean}
    */
    preserveSearch: {
      type: Boolean,
      default: !1
    },
    /**
     * Select 1st options if value is empty
     * @default false
     * @type {Boolean}
    */
    preselectFirst: {
      type: Boolean,
      default: !1
    },
    /**
     * Prevent autofocus
     * @default false
     * @type {Boolean}
    */
    preventAutofocus: {
      type: Boolean,
      default: !1
    }
  },
  mounted() {
    !this.multiple && this.max && console.warn("[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false."), this.preselectFirst && !this.internalValue.length && this.options.length && this.select(this.filteredOptions[0]);
  },
  computed: {
    internalValue() {
      return this.modelValue || this.modelValue === 0 ? Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue] : [];
    },
    filteredOptions() {
      const e = this.search || "", t = e.toLowerCase().trim();
      let n = this.options.concat();
      return this.internalSearch ? n = this.groupValues ? this.filterAndFlat(n, t, this.label) : di(n, t, this.label, this.customLabel) : n = this.groupValues ? Hn(this.groupValues, this.groupLabel)(n) : n, n = this.hideSelected ? n.filter(Kl(this.isSelected)) : n, this.taggable && t.length && !this.isExistingOption(t) && (this.tagPosition === "bottom" ? n.push({ isTag: !0, label: e }) : n.unshift({ isTag: !0, label: e })), n.slice(0, this.optionsLimit);
    },
    valueKeys() {
      return this.trackBy ? this.internalValue.map((e) => e[this.trackBy]) : this.internalValue;
    },
    optionKeys() {
      return (this.groupValues ? this.flatAndStrip(this.options) : this.options).map((t) => this.customLabel(t, this.label).toString().toLowerCase());
    },
    currentOptionLabel() {
      return this.multiple ? this.searchable ? "" : this.placeholder : this.internalValue.length ? this.getOptionLabel(this.internalValue[0]) : this.searchable ? "" : this.placeholder;
    }
  },
  watch: {
    internalValue: {
      handler() {
        this.resetAfter && this.internalValue.length && (this.search = "", this.$emit("update:modelValue", this.multiple ? [] : null));
      },
      deep: !0
    },
    search() {
      this.$emit("search-change", this.search);
    }
  },
  emits: ["open", "search-change", "close", "select", "update:modelValue", "remove", "tag"],
  methods: {
    /**
     * Returns the internalValue in a way it can be emited to the parent
     * @returns {Object||Array||String||Integer}
     */
    getValue() {
      return this.multiple ? this.internalValue : this.internalValue.length === 0 ? null : this.internalValue[0];
    },
    /**
     * Filters and then flattens the options list
     * @param  {Array}
     * @return {Array} returns a filtered and flat options list
     */
    filterAndFlat(e, t, n) {
      return dr(
        zl(t, n, this.groupValues, this.groupLabel, this.customLabel),
        Hn(this.groupValues, this.groupLabel)
      )(e);
    },
    /**
     * Flattens and then strips the group labels from the options list
     * @param  {Array}
     * @return {Array} returns a flat options list without group labels
     */
    flatAndStrip(e) {
      return dr(
        Hn(this.groupValues, this.groupLabel),
        Gl
      )(e);
    },
    /**
     * Updates the search value
     * @param  {String}
     */
    updateSearch(e) {
      this.search = e;
    },
    /**
     * Finds out if the given query is already present
     * in the available options
     * @param  {String}
     * @return {Boolean} returns true if element is available
     */
    isExistingOption(e) {
      return this.options ? this.optionKeys.indexOf(e) > -1 : !1;
    },
    /**
     * Finds out if the given element is already present
     * in the result value
     * @param  {Object||String||Integer} option passed element to check
     * @returns {Boolean} returns true if element is selected
     */
    isSelected(e) {
      const t = this.trackBy ? e[this.trackBy] : e;
      return this.valueKeys.indexOf(t) > -1;
    },
    /**
     * Finds out if the given option is disabled
     * @param  {Object||String||Integer} option passed element to check
     * @returns {Boolean} returns true if element is disabled
     */
    isOptionDisabled(e) {
      return !!e.$isDisabled;
    },
    /**
     * Returns empty string when options is null/undefined
     * Returns tag query if option is tag.
     * Returns the customLabel() results and casts it to string.
     *
     * @param  {Object||String||Integer} Passed option
     * @returns {Object||String}
     */
    getOptionLabel(e) {
      if (Mn(e))
        return "";
      if (e.isTag)
        return e.label;
      if (e.$isLabel)
        return e.$groupLabel;
      const t = this.customLabel(e, this.label);
      return Mn(t) ? "" : t;
    },
    /**
     * Add the given option to the list of selected options
     * or sets the option as the selected option.
     * If option is already selected -> remove it from the results.
     *
     * @param  {Object||String||Integer} option to select/deselect
     * @param  {Boolean} block removing
     */
    select(e, t) {
      if (e.$isLabel && this.groupSelect) {
        this.selectGroup(e);
        return;
      }
      if (!(this.blockKeys.indexOf(t) !== -1 || this.disabled || e.$isDisabled || e.$isLabel) && !(this.max && this.multiple && this.internalValue.length === this.max) && !(t === "Tab" && !this.pointerDirty)) {
        if (e.isTag)
          this.$emit("tag", e.label, this.id), this.search = "", this.closeOnSelect && !this.multiple && this.deactivate();
        else {
          if (this.isSelected(e)) {
            t !== "Tab" && this.removeElement(e);
            return;
          }
          this.multiple ? this.$emit("update:modelValue", this.internalValue.concat([e])) : this.$emit("update:modelValue", e), this.$emit("select", e, this.id), this.clearOnSelect && (this.search = "");
        }
        this.closeOnSelect && this.deactivate();
      }
    },
    /**
     * Add the given group options to the list of selected options
     * If all group optiona are already selected -> remove it from the results.
     *
     * @param  {Object||String||Integer} group to select/deselect
     */
    selectGroup(e) {
      const t = this.options.find((n) => n[this.groupLabel] === e.$groupLabel);
      if (t) {
        if (this.wholeGroupSelected(t)) {
          this.$emit("remove", t[this.groupValues], this.id);
          const n = this.internalValue.filter(
            (o) => t[this.groupValues].indexOf(o) === -1
          );
          this.$emit("update:modelValue", n);
        } else {
          let n = t[this.groupValues].filter(
            (o) => !(this.isOptionDisabled(o) || this.isSelected(o))
          );
          this.max && n.splice(this.max - this.internalValue.length), this.$emit("select", n, this.id), this.$emit(
            "update:modelValue",
            this.internalValue.concat(n)
          );
        }
        this.closeOnSelect && this.deactivate();
      }
    },
    /**
     * Helper to identify if all values in a group are selected
     *
     * @param {Object} group to validated selected values against
     */
    wholeGroupSelected(e) {
      return e[this.groupValues].every(
        (t) => this.isSelected(t) || this.isOptionDisabled(t)
      );
    },
    /**
     * Helper to identify if all values in a group are disabled
     *
     * @param {Object} group to check for disabled values
     */
    wholeGroupDisabled(e) {
      return e[this.groupValues].every(this.isOptionDisabled);
    },
    /**
     * Removes the given option from the selected options.
     * Additionally checks this.allowEmpty prop if option can be removed when
     * it is the last selected option.
     *
     * @param  {type} option description
     * @return {type}        description
     */
    removeElement(e, t = !0) {
      if (this.disabled || e.$isDisabled)
        return;
      if (!this.allowEmpty && this.internalValue.length <= 1) {
        this.deactivate();
        return;
      }
      const n = typeof e == "object" ? this.valueKeys.indexOf(e[this.trackBy]) : this.valueKeys.indexOf(e);
      if (this.multiple) {
        const o = this.internalValue.slice(0, n).concat(this.internalValue.slice(n + 1));
        this.$emit("update:modelValue", o);
      } else
        this.$emit("update:modelValue", null);
      this.$emit("remove", e, this.id), this.closeOnSelect && t && this.deactivate();
    },
    /**
     * Calls this.removeElement() with the last element
     * from this.internalValue (selected element Array)
     *
     * @fires this#removeElement
     */
    removeLastElement() {
      this.blockKeys.indexOf("Delete") === -1 && this.search.length === 0 && Array.isArray(this.internalValue) && this.internalValue.length && this.removeElement(this.internalValue[this.internalValue.length - 1], !1);
    },
    /**
     * Opens the multiselect’s dropdown.
     * Sets this.isOpen to TRUE
     */
    activate() {
      this.isOpen || this.disabled || (this.adjustPosition(), this.groupValues && this.pointer === 0 && this.filteredOptions.length && (this.pointer = 1), this.isOpen = !0, this.searchable ? (this.preserveSearch || (this.search = ""), this.preventAutofocus || this.$nextTick(() => this.$refs.search && this.$refs.search.focus())) : this.preventAutofocus || typeof this.$el < "u" && this.$el.focus(), this.$emit("open", this.id));
    },
    /**
     * Closes the multiselect’s dropdown.
     * Sets this.isOpen to FALSE
     */
    deactivate() {
      this.isOpen && (this.isOpen = !1, this.searchable ? this.$refs.search !== null && typeof this.$refs.search < "u" && this.$refs.search.blur() : typeof this.$el < "u" && this.$el.blur(), this.preserveSearch || (this.search = ""), this.$emit("close", this.getValue(), this.id));
    },
    /**
     * Call this.activate() or this.deactivate()
     * depending on this.isOpen value.
     *
     * @fires this#activate || this#deactivate
     * @property {Boolean} isOpen indicates if dropdown is open
     */
    toggle() {
      this.isOpen ? this.deactivate() : this.activate();
    },
    /**
     * Updates the hasEnoughSpace variable used for
     * detecting where to expand the dropdown
     */
    adjustPosition() {
      if (typeof window > "u")
        return;
      const e = this.$el.getBoundingClientRect().top, t = window.innerHeight - this.$el.getBoundingClientRect().bottom;
      t > this.maxHeight || t > e || this.openDirection === "below" || this.openDirection === "bottom" ? (this.preferredOpenDirection = "below", this.optimizedHeight = Math.min(t - 40, this.maxHeight)) : (this.preferredOpenDirection = "above", this.optimizedHeight = Math.min(e - 40, this.maxHeight));
    }
  }
}, Xl = {
  data() {
    return {
      pointer: 0,
      pointerDirty: !1
    };
  },
  props: {
    /**
     * Enable/disable highlighting of the pointed value.
     * @type {Boolean}
     * @default true
     */
    showPointer: {
      type: Boolean,
      default: !0
    },
    optionHeight: {
      type: Number,
      default: 40
    }
  },
  computed: {
    pointerPosition() {
      return this.pointer * this.optionHeight;
    },
    visibleElements() {
      return this.optimizedHeight / this.optionHeight;
    }
  },
  watch: {
    filteredOptions() {
      this.pointerAdjust();
    },
    isOpen() {
      this.pointerDirty = !1;
    },
    pointer() {
      this.$refs.search && this.$refs.search.setAttribute("aria-activedescendant", this.id + "-" + this.pointer.toString());
    }
  },
  methods: {
    optionHighlight(e, t) {
      return {
        "multiselect__option--highlight": e === this.pointer && this.showPointer,
        "multiselect__option--selected": this.isSelected(t)
      };
    },
    groupHighlight(e, t) {
      if (!this.groupSelect)
        return [
          "multiselect__option--disabled",
          { "multiselect__option--group": t.$isLabel }
        ];
      const n = this.options.find((o) => o[this.groupLabel] === t.$groupLabel);
      return n && !this.wholeGroupDisabled(n) ? [
        "multiselect__option--group",
        { "multiselect__option--highlight": e === this.pointer && this.showPointer },
        { "multiselect__option--group-selected": this.wholeGroupSelected(n) }
      ] : "multiselect__option--disabled";
    },
    addPointerElement({ key: e } = "Enter") {
      this.filteredOptions.length > 0 && this.select(this.filteredOptions[this.pointer], e), this.pointerReset();
    },
    pointerForward() {
      this.pointer < this.filteredOptions.length - 1 && (this.pointer++, this.$refs.list.scrollTop <= this.pointerPosition - (this.visibleElements - 1) * this.optionHeight && (this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight), this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect && this.pointerForward()), this.pointerDirty = !0;
    },
    pointerBackward() {
      this.pointer > 0 ? (this.pointer--, this.$refs.list.scrollTop >= this.pointerPosition && (this.$refs.list.scrollTop = this.pointerPosition), this.filteredOptions[this.pointer] && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect && this.pointerBackward()) : this.filteredOptions[this.pointer] && this.filteredOptions[0].$isLabel && !this.groupSelect && this.pointerForward(), this.pointerDirty = !0;
    },
    pointerReset() {
      this.closeOnSelect && (this.pointer = 0, this.$refs.list && (this.$refs.list.scrollTop = 0));
    },
    pointerAdjust() {
      this.pointer >= this.filteredOptions.length - 1 && (this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : 0), this.filteredOptions.length > 0 && this.filteredOptions[this.pointer].$isLabel && !this.groupSelect && this.pointerForward();
    },
    pointerSet(e) {
      this.pointer = e, this.pointerDirty = !0;
    }
  }
}, pi = {
  name: "vue-multiselect",
  mixins: [Wl, Xl],
  compatConfig: {
    MODE: 3,
    ATTR_ENUMERATED_COERCION: !1
  },
  props: {
    /**
       * name attribute to match optional label element
       * @default ''
       * @type {String}
       */
    name: {
      type: String,
      default: ""
    },
    /**
       * Presets the selected options value.
       * @type {Object||Array||String||Integer}
       */
    modelValue: {
      type: null,
      default() {
        return [];
      }
    },
    /**
       * String to show when pointing to an option
       * @default 'Press enter to select'
       * @type {String}
       */
    selectLabel: {
      type: String,
      default: "Press enter to select"
    },
    /**
       * String to show when pointing to an option
       * @default 'Press enter to select'
       * @type {String}
       */
    selectGroupLabel: {
      type: String,
      default: "Press enter to select group"
    },
    /**
       * String to show next to selected option
       * @default 'Selected'
       * @type {String}
       */
    selectedLabel: {
      type: String,
      default: "Selected"
    },
    /**
       * String to show when pointing to an already selected option
       * @default 'Press enter to remove'
       * @type {String}
       */
    deselectLabel: {
      type: String,
      default: "Press enter to remove"
    },
    /**
       * String to show when pointing to an already selected option
       * @default 'Press enter to remove'
       * @type {String}
       */
    deselectGroupLabel: {
      type: String,
      default: "Press enter to deselect group"
    },
    /**
       * Decide whether to show pointer labels
       * @default true
       * @type {Boolean}
       */
    showLabels: {
      type: Boolean,
      default: !0
    },
    /**
       * Limit the display of selected options. The rest will be hidden within the limitText string.
       * @default 99999
       * @type {Integer}
       */
    limit: {
      type: Number,
      default: 99999
    },
    /**
       * Sets maxHeight style value of the dropdown
       * @default 300
       * @type {Integer}
       */
    maxHeight: {
      type: Number,
      default: 300
    },
    /**
       * Function that process the message shown when selected
       * elements pass the defined limit.
       * @default 'and * more'
       * @param {Int} count Number of elements more than limit
       * @type {Function}
       */
    limitText: {
      type: Function,
      default: (e) => `and ${e} more`
    },
    /**
       * Set true to trigger the loading spinner.
       * @default False
       * @type {Boolean}
       */
    loading: {
      type: Boolean,
      default: !1
    },
    /**
       * Disables the multiselect if true.
       * @default false
       * @type {Boolean}
       */
    disabled: {
      type: Boolean,
      default: !1
    },
    /**
       * Fixed opening direction
       * @default ''
       * @type {String}
       */
    openDirection: {
      type: String,
      default: ""
    },
    /**
       * Shows slot with message about empty options
       * @default true
       * @type {Boolean}
       */
    showNoOptions: {
      type: Boolean,
      default: !0
    },
    showNoResults: {
      type: Boolean,
      default: !0
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    hasOptionGroup() {
      return this.groupValues && this.groupLabel && this.groupSelect;
    },
    isSingleLabelVisible() {
      return (this.singleValue || this.singleValue === 0) && (!this.isOpen || !this.searchable) && !this.visibleValues.length;
    },
    isPlaceholderVisible() {
      return !this.internalValue.length && (!this.searchable || !this.isOpen);
    },
    visibleValues() {
      return this.multiple ? this.internalValue.slice(0, this.limit) : [];
    },
    singleValue() {
      return this.internalValue[0];
    },
    deselectLabelText() {
      return this.showLabels ? this.deselectLabel : "";
    },
    deselectGroupLabelText() {
      return this.showLabels ? this.deselectGroupLabel : "";
    },
    selectLabelText() {
      return this.showLabels ? this.selectLabel : "";
    },
    selectGroupLabelText() {
      return this.showLabels ? this.selectGroupLabel : "";
    },
    selectedLabelText() {
      return this.showLabels ? this.selectedLabel : "";
    },
    inputStyle() {
      return this.searchable || this.multiple && this.modelValue && this.modelValue.length ? this.isOpen ? { width: "100%" } : { width: "0", position: "absolute", padding: "0" } : "";
    },
    contentStyle() {
      return this.options.length ? { display: "inline-block" } : { display: "block" };
    },
    isAbove() {
      return this.openDirection === "above" || this.openDirection === "top" ? !0 : this.openDirection === "below" || this.openDirection === "bottom" ? !1 : this.preferredOpenDirection === "above";
    },
    showSearchInput() {
      return this.searchable && (this.hasSingleSelectedSlot && (this.visibleSingleValue || this.visibleSingleValue === 0) ? this.isOpen : !0);
    }
  }
};
const Zl = {
  ref: "tags",
  class: "multiselect__tags"
}, Yl = { class: "multiselect__tags-wrap" }, Jl = { class: "multiselect__spinner" }, ql = { key: 0 }, Ql = { class: "multiselect__option" }, ea = { class: "multiselect__option" }, ta = /* @__PURE__ */ ut("No elements found. Consider changing the search query."), na = { class: "multiselect__option" }, oa = /* @__PURE__ */ ut("List is empty.");
function ra(e, t, n, o, r, i) {
  return re(), _e("div", {
    tabindex: e.searchable ? -1 : n.tabindex,
    class: [{ "multiselect--active": e.isOpen, "multiselect--disabled": n.disabled, "multiselect--above": i.isAbove, "multiselect--has-options-group": i.hasOptionGroup }, "multiselect"],
    onFocus: t[14] || (t[14] = (s) => e.activate()),
    onBlur: t[15] || (t[15] = (s) => e.searchable ? !1 : e.deactivate()),
    onKeydown: [
      t[16] || (t[16] = Ne(te((s) => e.pointerForward(), ["self", "prevent"]), ["down"])),
      t[17] || (t[17] = Ne(te((s) => e.pointerBackward(), ["self", "prevent"]), ["up"]))
    ],
    onKeypress: t[18] || (t[18] = Ne(te((s) => e.addPointerElement(s), ["stop", "self"]), ["enter", "tab"])),
    onKeyup: t[19] || (t[19] = Ne((s) => e.deactivate(), ["esc"])),
    role: "combobox",
    "aria-owns": "listbox-" + e.id
  }, [
    ue(e.$slots, "caret", { toggle: e.toggle }, () => [
      k(
        "div",
        {
          onMousedown: t[1] || (t[1] = te((s) => e.toggle(), ["prevent", "stop"])),
          class: "multiselect__select"
        },
        null,
        32
        /* HYDRATE_EVENTS */
      )
    ]),
    ue(e.$slots, "clear", { search: e.search }),
    k(
      "div",
      Zl,
      [
        ue(e.$slots, "selection", {
          search: e.search,
          remove: e.removeElement,
          values: i.visibleValues,
          isOpen: e.isOpen
        }, () => [
          Ot(k(
            "div",
            Yl,
            [
              (re(!0), _e(
                me,
                null,
                Vo(i.visibleValues, (s, l) => ue(e.$slots, "tag", {
                  option: s,
                  search: e.search,
                  remove: e.removeElement
                }, () => [
                  (re(), _e("span", {
                    class: "multiselect__tag",
                    key: l
                  }, [
                    k("span", {
                      textContent: Ve(e.getOptionLabel(s))
                    }, null, 8, ["textContent"]),
                    k("i", {
                      tabindex: "1",
                      onKeypress: Ne(te((c) => e.removeElement(s), ["prevent"]), ["enter"]),
                      onMousedown: te((c) => e.removeElement(s), ["prevent"]),
                      class: "multiselect__tag-icon"
                    }, null, 40, ["onKeypress", "onMousedown"])
                  ]))
                ])),
                256
                /* UNKEYED_FRAGMENT */
              ))
            ],
            512
            /* NEED_PATCH */
          ), [
            [Dt, i.visibleValues.length > 0]
          ]),
          e.internalValue && e.internalValue.length > n.limit ? ue(e.$slots, "limit", { key: 0 }, () => [
            k("strong", {
              class: "multiselect__strong",
              textContent: Ve(n.limitText(e.internalValue.length - n.limit))
            }, null, 8, ["textContent"])
          ]) : He("v-if", !0)
        ]),
        k(fn, { name: "multiselect__loading" }, {
          default: Ut(() => [
            ue(e.$slots, "loading", {}, () => [
              Ot(k(
                "div",
                Jl,
                null,
                512
                /* NEED_PATCH */
              ), [
                [Dt, n.loading]
              ])
            ])
          ]),
          _: 3
          /* FORWARDED */
        }),
        e.searchable ? (re(), _e("input", {
          key: 0,
          ref: "search",
          name: n.name,
          id: e.id,
          type: "text",
          autocomplete: "off",
          spellcheck: !1,
          placeholder: e.placeholder,
          style: i.inputStyle,
          value: e.search,
          disabled: n.disabled,
          tabindex: n.tabindex,
          onInput: t[2] || (t[2] = (s) => e.updateSearch(s.target.value)),
          onFocus: t[3] || (t[3] = te((s) => e.activate(), ["prevent"])),
          onBlur: t[4] || (t[4] = te((s) => e.deactivate(), ["prevent"])),
          onKeyup: t[5] || (t[5] = Ne((s) => e.deactivate(), ["esc"])),
          onKeydown: [
            t[6] || (t[6] = Ne(te((s) => e.pointerForward(), ["prevent"]), ["down"])),
            t[7] || (t[7] = Ne(te((s) => e.pointerBackward(), ["prevent"]), ["up"])),
            t[9] || (t[9] = Ne(te((s) => e.removeLastElement(), ["stop"]), ["delete"]))
          ],
          onKeypress: t[8] || (t[8] = Ne(te((s) => e.addPointerElement(s), ["prevent", "stop", "self"]), ["enter"])),
          class: "multiselect__input",
          "aria-controls": "listbox-" + e.id
        }, null, 44, ["name", "id", "placeholder", "value", "disabled", "tabindex", "aria-controls"])) : He("v-if", !0),
        i.isSingleLabelVisible ? (re(), _e(
          "span",
          {
            key: 1,
            class: "multiselect__single",
            onMousedown: t[10] || (t[10] = te((...s) => e.toggle && e.toggle(...s), ["prevent"]))
          },
          [
            ue(e.$slots, "singleLabel", { option: i.singleValue }, () => [
              ut(
                Ve(e.currentOptionLabel),
                1
                /* TEXT */
              )
            ])
          ],
          32
          /* HYDRATE_EVENTS */
        )) : He("v-if", !0),
        i.isPlaceholderVisible ? (re(), _e(
          "span",
          {
            key: 2,
            class: "multiselect__placeholder",
            onMousedown: t[11] || (t[11] = te((...s) => e.toggle && e.toggle(...s), ["prevent"]))
          },
          [
            ue(e.$slots, "placeholder", {}, () => [
              ut(
                Ve(e.placeholder),
                1
                /* TEXT */
              )
            ])
          ],
          32
          /* HYDRATE_EVENTS */
        )) : He("v-if", !0)
      ],
      512
      /* NEED_PATCH */
    ),
    k(fn, { name: "multiselect" }, {
      default: Ut(() => [
        Ot(k(
          "div",
          {
            class: "multiselect__content-wrapper",
            onFocus: t[12] || (t[12] = (...s) => e.activate && e.activate(...s)),
            tabindex: "-1",
            onMousedown: t[13] || (t[13] = te(() => {
            }, ["prevent"])),
            style: { maxHeight: e.optimizedHeight + "px" },
            ref: "list"
          },
          [
            k("ul", {
              class: "multiselect__content",
              style: i.contentStyle,
              role: "listbox",
              id: "listbox-" + e.id
            }, [
              ue(e.$slots, "beforeList"),
              e.multiple && e.max === e.internalValue.length ? (re(), _e("li", ql, [
                k("span", Ql, [
                  ue(e.$slots, "maxElements", {}, () => [
                    ut(
                      "Maximum of " + Ve(e.max) + " options selected. First remove a selected option to select another.",
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ])) : He("v-if", !0),
              !e.max || e.internalValue.length < e.max ? (re(!0), _e(
                me,
                { key: 1 },
                Vo(e.filteredOptions, (s, l) => (re(), _e("li", {
                  class: "multiselect__element",
                  key: l,
                  id: e.id + "-" + l,
                  role: s && (s.$isLabel || s.$isDisabled) ? null : "option"
                }, [
                  s && (s.$isLabel || s.$isDisabled) ? He("v-if", !0) : (re(), _e("span", {
                    key: 0,
                    class: [e.optionHighlight(l, s), "multiselect__option"],
                    onClick: te((c) => e.select(s), ["stop"]),
                    onMouseenter: te((c) => e.pointerSet(l), ["self"]),
                    "data-select": s && s.isTag ? e.tagPlaceholder : i.selectLabelText,
                    "data-selected": i.selectedLabelText,
                    "data-deselect": i.deselectLabelText
                  }, [
                    ue(e.$slots, "option", {
                      option: s,
                      search: e.search,
                      index: l
                    }, () => [
                      k(
                        "span",
                        null,
                        Ve(e.getOptionLabel(s)),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 42, ["onClick", "onMouseenter", "data-select", "data-selected", "data-deselect"])),
                  s && (s.$isLabel || s.$isDisabled) ? (re(), _e("span", {
                    key: 1,
                    "data-select": e.groupSelect && i.selectGroupLabelText,
                    "data-deselect": e.groupSelect && i.deselectGroupLabelText,
                    class: [e.groupHighlight(l, s), "multiselect__option"],
                    onMouseenter: te((c) => e.groupSelect && e.pointerSet(l), ["self"]),
                    onMousedown: te((c) => e.selectGroup(s), ["prevent"])
                  }, [
                    ue(e.$slots, "option", {
                      option: s,
                      search: e.search,
                      index: l
                    }, () => [
                      k(
                        "span",
                        null,
                        Ve(e.getOptionLabel(s)),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 42, ["data-select", "data-deselect", "onMouseenter", "onMousedown"])) : He("v-if", !0)
                ], 8, ["id", "role"]))),
                128
                /* KEYED_FRAGMENT */
              )) : He("v-if", !0),
              Ot(k(
                "li",
                null,
                [
                  k("span", ea, [
                    ue(e.$slots, "noResult", { search: e.search }, () => [
                      ta
                    ])
                  ])
                ],
                512
                /* NEED_PATCH */
              ), [
                [Dt, n.showNoResults && e.filteredOptions.length === 0 && e.search && !n.loading]
              ]),
              Ot(k(
                "li",
                null,
                [
                  k("span", na, [
                    ue(e.$slots, "noOptions", {}, () => [
                      oa
                    ])
                  ])
                ],
                512
                /* NEED_PATCH */
              ), [
                [Dt, n.showNoOptions && (e.options.length === 0 || i.hasOptionGroup === !0 && e.filteredOptions.length === 0) && !e.search && !n.loading]
              ]),
              ue(e.$slots, "afterList")
            ], 12, ["id"])
          ],
          36
          /* STYLE, HYDRATE_EVENTS */
        ), [
          [Dt, e.isOpen]
        ])
      ]),
      _: 3
      /* FORWARDED */
    })
  ], 42, ["tabindex", "aria-owns"]);
}
pi.render = ra;
const ia = ["width", "height", "viewBox"], sa = {
  id: "Alerts & Feedback/alert-circle",
  "clip-path": "url(#clip0_1523_165)"
}, la = ["stroke"], aa = { id: "clip0_1523_165" }, ca = ["width", "height"], ua = /* @__PURE__ */ Gt({
  __name: "icExclamationMark",
  props: {
    viewBox: { default: "0 0 20 20" },
    width: { default: 20 },
    height: { default: 20 },
    stroke: { default: "#9fef00" }
  },
  setup(e) {
    return (t, n) => (re(), Ft("svg", {
      width: t.width,
      height: t.height,
      viewBox: t.viewBox,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      ie("g", sa, [
        ie("path", {
          id: "Icon",
          d: "M9.99996 6.6665V9.99984M9.99996 13.3332H10.0083M18.3333 9.99984C18.3333 14.6022 14.6023 18.3332 9.99996 18.3332C5.39759 18.3332 1.66663 14.6022 1.66663 9.99984C1.66663 5.39746 5.39759 1.6665 9.99996 1.6665C14.6023 1.6665 18.3333 5.39746 18.3333 9.99984Z",
          stroke: t.stroke,
          "stroke-width": "1.66667",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, null, 8, la)
      ]),
      ie("defs", null, [
        ie("clipPath", aa, [
          ie("rect", {
            width: t.width,
            height: t.height,
            fill: "white"
          }, null, 8, ca)
        ])
      ])
    ], 8, ia));
  }
}), da = ["width", "height", "viewBox"], pa = /* @__PURE__ */ qs('<g id="Frame 36"><path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M15.1432 6.447C15.1363 6.04084 15.0475 5.64024 14.8822 5.26916C14.717 4.89809 14.4785 4.56416 14.1812 4.28735C13.8839 4.01055 13.5338 3.79655 13.1519 3.65816C12.77 3.51977 12.3641 3.45983 11.9585 3.48193C11.5977 2.76147 11.0424 2.15647 10.3554 1.73548C9.66845 1.3145 8.87728 1.09437 8.07158 1.10005C6.99334 1.08448 5.94962 1.48003 5.15255 2.20633C4.35547 2.93264 3.86484 3.93518 3.78038 5.01022C3.45056 4.93726 3.10868 4.93827 2.7793 5.01317C2.44992 5.08807 2.14122 5.235 1.87538 5.4434C1.60955 5.65181 1.39318 5.91651 1.24182 6.21849C1.09046 6.52048 1.00788 6.85224 1 7.18993C1 9.4545 3.45925 9.41956 3.45925 9.41956H12.3761C12.3761 9.41956 15.1432 9.06931 15.1432 6.447Z" stroke="white" stroke-width="0.998341" stroke-linecap="round" stroke-linejoin="round"></path><path id="Vector_2" fill-rule="evenodd" clip-rule="evenodd" d="M15.1432 18.987C15.1432 19.318 15.0117 19.6354 14.7777 19.8694C14.5436 20.1035 14.2262 20.2349 13.8952 20.2349H2.24793C1.91696 20.2349 1.59954 20.1035 1.36551 19.8694C1.13148 19.6354 1 19.318 1 18.987V17.3231C1 16.9922 1.13148 16.6747 1.36551 16.4407C1.59954 16.2067 1.91696 16.0752 2.24793 16.0752H13.8952C14.2262 16.0752 14.5436 16.2067 14.7777 16.4407C15.0117 16.6747 15.1432 16.9922 15.1432 17.3231V18.987Z" stroke="#9FEF00" stroke-width="0.998341" stroke-linecap="round" stroke-linejoin="round"></path><path id="Vector_3" fill-rule="evenodd" clip-rule="evenodd" d="M15.1432 14.8269C15.1432 15.1578 15.0117 15.4753 14.7777 15.7093C14.5436 15.9433 14.2262 16.0748 13.8952 16.0748H2.24793C1.91696 16.0748 1.59954 15.9433 1.36551 15.7093C1.13148 15.4753 1 15.1578 1 14.8269V13.163C1 12.832 1.13148 12.5146 1.36551 12.2805C1.59954 12.0465 1.91696 11.915 2.24793 11.915H13.8952C14.2262 11.915 14.5436 12.0465 14.7777 12.2805C15.0117 12.5146 15.1432 12.832 15.1432 13.163V14.8269Z" stroke="#9FEF00" stroke-width="0.998341" stroke-linecap="round" stroke-linejoin="round"></path><circle id="Ellipse 120" cx="3.70098" cy="13.9998" r="0.7" fill="#9FEF00"></circle><circle id="Ellipse 122" cx="3.70098" cy="18.2" r="0.5" stroke="#9FEF00" stroke-width="0.4"></circle><circle id="Ellipse 121" cx="5.80059" cy="13.9998" r="0.7" fill="#9FEF00"></circle><circle id="Ellipse 123" cx="5.80059" cy="18.2" r="0.5" stroke="#9FEF00" stroke-width="0.4"></circle></g>', 1), fa = [
  pa
], ma = /* @__PURE__ */ Gt({
  __name: "IcPwnboxConnect",
  props: {
    width: { default: 30 },
    height: { default: 30 },
    viewBox: { default: "0 0 30 30" }
  },
  setup(e) {
    return (t, n) => (re(), Ft("svg", {
      width: t.width,
      height: t.height,
      viewBox: t.viewBox,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, fa, 8, da));
  }
}), ha = {
  class: "latency-container",
  "data-testid": "pwnbox-option-item"
}, ba = { "data-testid": "option-name" }, pr = /* @__PURE__ */ Gt({
  __name: "PwnboxOptionItem",
  props: {
    option: {}
  },
  setup(e) {
    function t(n) {
      return n > 100 && n <= 150 ? "warning" : n > 150 ? "danger" : "success";
    }
    return (n, o) => (re(), Ft("div", ha, [
      ie("span", ba, Ve(n.option.name), 1),
      ie("span", {
        "data-testid": "option-latency",
        class: jt(["badge", t(n.option.latency)])
      }, Ve(n.option.latency) + "ms", 3)
    ]));
  }
}), ga = { class: "d-flex align-items-center" }, _a = { class: "card-icon-wrapper mr-3" }, xa = /* @__PURE__ */ ie("div", { class: "d-flex flex-column align-items-start" }, [
  /* @__PURE__ */ ie("h1", {
    class: "card-title htb-text-primary my-0",
    "data-testid": "card-title"
  }, "Connect to Pwnbox"),
  /* @__PURE__ */ ie("p", {
    class: "card-subtitle my-0",
    "data-testid": "card-subtitle"
  }, " Your own web-based Parrot Linux instance to play our labs. ")
], -1), ya = { class: "mt-4 text-left" }, va = /* @__PURE__ */ ie("label", {
  class: "selector-label mb-2",
  "data-testid": "label"
}, "Pwnbox Location", -1), wa = { class: "d-flex" }, Sa = ["disabled"], Ca = {
  class: "d-flex align-items-center htb-text-secondary",
  "data-testid": "location-switch-warning"
}, Ea = /* @__PURE__ */ Gt({
  __name: "PwnboxSelectionCard.ce",
  props: {
    regions: { default: null, type: String },
    disabledSpawnButton: { default: "true", type: String },
    spawnButton: { default: "false", type: String },
    currentPwnbox: { default: null, type: String },
    disableCard: { default: "false", type: String },
    pwnboxActive: { default: "false", type: String }
  },
  emits: ["getSelectedPwnboxLocation", "spawnPwnbox", "actionNotAllowed"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = rt(() => n.regions ? JSON.parse(n.regions) : []), i = rt(() => n.disableCard === "true"), s = rt(() => n.disabledSpawnButton === "true"), l = rt(() => n.spawnButton === "true"), c = rt(() => n.pwnboxActive === "true"), d = rt(() => JSON.parse(n.currentPwnbox));
    let f = Ji({});
    nn(
      d,
      () => {
        g();
      },
      {
        immediate: !0
      }
    ), ho(() => {
      g();
    });
    function g() {
      f.value = r.value.find(
        (L) => L.value === d.value.value
      );
    }
    function x(L) {
      f.value = {}, setTimeout(() => {
        if (c.value) {
          o("actionNotAllowed", L);
          return;
        }
        f.value = L, o("getSelectedPwnboxLocation", L);
      }, 1);
    }
    function E() {
      o("spawnPwnbox", f.value);
    }
    return (L, A) => (re(), Ft("div", {
      class: jt(["text-center my-5 p-4 pwnbox-card", { disabled: i.value }])
    }, [
      ie("div", ga, [
        ie("div", _a, [
          k(ma, {
            width: 32,
            height: 32,
            class: "card-icon"
          })
        ]),
        xa
      ]),
      ie("div", ya, [
        va,
        ie("div", wa, [
          k(jn(pi), {
            modelValue: jn(f),
            "onUpdate:modelValue": A[0] || (A[0] = (V) => pe(f) ? f.value = V : f = V),
            "data-testid": "pwnbox-location-selector",
            label: "name",
            class: "my-1 mr-2",
            options: r.value,
            "show-labels": !0,
            "allow-empty": !1,
            "select-label": "",
            "deselect-label": "",
            searchable: !1,
            placeholder: "Pwnbox Location",
            onSelect: x
          }, {
            singleLabel: Ut((V) => [
              k(pr, {
                option: V.option
              }, null, 8, ["option"])
            ]),
            option: Ut((V) => [
              k(pr, {
                option: V.option
              }, null, 8, ["option"])
            ]),
            _: 1
          }, 8, ["modelValue", "options"]),
          l.value ? (re(), Ft("button", {
            key: 0,
            class: "spawn-btn ml-2",
            "data-testid": "spawn-button",
            disabled: s.value,
            onClick: E
          }, " Spawn Pwnbox ", 8, Sa)) : He("", !0)
        ]),
        ie("p", Ca, [
          k(ua, {
            stroke: "#4589FF",
            class: "mr-1"
          }),
          ut("Terminate Pwnbox to switch location ")
        ])
      ])
    ], 2));
  }
}), Ta = `@import"https://use.typekit.net/ryt3opf.css";.htb-border-subtle-00{border:1px solid #182232}.htb-border-subtle-00-top{border-top:1px solid #182232}.htb-border-subtle-00-bottom{border-bottom:1px solid #182232}.htb-border-subtle-00-left{border-left:1px solid #182232}.htb-border-subtle-00-right{border-right:1px solid #182232}.htb-border-subtle-bg{border:1px solid #1e2939}.htb-border-subtle-bg-top{border-top:1px solid #1e2939}.htb-border-subtle-bg-bottom{border-bottom:1px solid #1e2939}.htb-border-subtle-bg-left{border-left:1px solid #1e2939}.htb-border-subtle-bg-right{border-right:1px solid #1e2939}.htb-border-subtle-01{border:1px solid #242f40}.htb-border-subtle-01-top{border-top:1px solid #242f40}.htb-border-subtle-01-bottom{border-bottom:1px solid #242f40}.htb-border-subtle-01-left{border-left:1px solid #242f40}.htb-border-subtle-01-right{border-right:1px solid #242f40}.htb-border-subtle-02{border:1px solid #293547}.htb-border-subtle-02-top{border-top:1px solid #293547}.htb-border-subtle-02-bottom{border-bottom:1px solid #293547}.htb-border-subtle-02-left{border-left:1px solid #293547}.htb-border-subtle-02-right{border-right:1px solid #293547}.htb-border-subtle-03{border:1px solid #2f3b4e}.htb-border-subtle-03-top{border-top:1px solid #2f3b4e}.htb-border-subtle-03-bottom{border-bottom:1px solid #2f3b4e}.htb-border-subtle-03-left{border-left:1px solid #2f3b4e}.htb-border-subtle-03-right{border-right:1px solid #2f3b4e}.htb-border-strong-00{border:1px solid #1e2939}.htb-border-strong-00-top{border-top:1px solid #1e2939}.htb-border-strong-00-bottom{border-bottom:1px solid #1e2939}.htb-border-strong-00-left{border-left:1px solid #1e2939}.htb-border-strong-00-right{border-right:1px solid #1e2939}.htb-border-strong-bg{border:1px solid #242f40}.htb-border-strong-bg-top{border-top:1px solid #242f40}.htb-border-strong-bg-bottom{border-bottom:1px solid #242f40}.htb-border-strong-bg-left{border-left:1px solid #242f40}.htb-border-strong-bg-right{border-right:1px solid #242f40}.htb-border-strong-01{border:1px solid #293547}.htb-border-strong-01-top{border-top:1px solid #293547}.htb-border-strong-01-bottom{border-bottom:1px solid #293547}.htb-border-strong-01-left{border-left:1px solid #293547}.htb-border-strong-01-right{border-right:1px solid #293547}.htb-border-strong-02{border:1px solid #2f3b4e}.htb-border-strong-02-top{border-top:1px solid #2f3b4e}.htb-border-strong-02-bottom{border-bottom:1px solid #2f3b4e}.htb-border-strong-02-left{border-left:1px solid #2f3b4e}.htb-border-strong-02-right{border-right:1px solid #2f3b4e}.htb-border-strong-03{border:1px solid #354154}.htb-border-strong-03-top{border-top:1px solid #354154}.htb-border-strong-03-bottom{border-bottom:1px solid #354154}.htb-border-strong-03-left{border-left:1px solid #354154}.htb-border-strong-03-right{border-right:1px solid #354154}.htb-border-active{border:1px solid #9fef00}.htb-border-active-top{border-top:1px solid #9fef00}.htb-border-active-bottom{border-bottom:1px solid #9fef00}.htb-border-active-left{border-left:1px solid #9fef00}.htb-border-active-right{border-right:1px solid #9fef00}.htb-border-focus{border:1px solid #f4f4f4}.htb-border-focus-top{border-top:1px solid #f4f4f4}.htb-border-focus-bottom{border-bottom:1px solid #f4f4f4}.htb-border-focus-left{border-left:1px solid #f4f4f4}.htb-border-focus-right{border-right:1px solid #f4f4f4}.htb-border-pressed{border:1px solid #354154}.htb-border-pressed-top{border-top:1px solid #354154}.htb-border-pressed-bottom{border-bottom:1px solid #354154}.htb-border-pressed-left{border-left:1px solid #354154}.htb-border-pressed-right{border-right:1px solid #354154}.htb-border-disabled{border:1px solid #526177}.htb-border-disabled-top{border-top:1px solid #526177}.htb-border-disabled-bottom{border-bottom:1px solid #526177}.htb-border-disabled-left{border-left:1px solid #526177}.htb-border-disabled-right{border-right:1px solid #526177}.htb-layer-00-bg{background-color:#101927!important}.htb-layer-00-bg-hoverable{cursor:pointer;background-color:#101927}.htb-layer-00-bg-hoverable:hover{background-color:#121c2b}.htb-layer-00-bg-hoverable:active{background-color:#182232}.htb-layer-00-bg-hoverable.selected{background-color:#0f1623}.htb-layer-background-bg{background-color:#121c2b!important}.htb-layer-background-bg-hoverable{cursor:pointer;background-color:#121c2b}.htb-layer-background-bg-hoverable:hover{background-color:#182232}.htb-layer-background-bg-hoverable:active{background-color:#1e2939}.htb-layer-background-bg-hoverable.selected{background-color:#101927}.htb-layer-01-bg{background-color:#182232!important}.htb-layer-01-bg-hoverable{cursor:pointer;background-color:#182232}.htb-layer-01-bg-hoverable:hover{background-color:#1e2939}.htb-layer-01-bg-hoverable:active{background-color:#242f40}.htb-layer-01-bg-hoverable.selected{background-color:#121c2b}.htb-layer-02-bg{background-color:#1e2939!important}.htb-layer-02-bg-hoverable{cursor:pointer;background-color:#1e2939}.htb-layer-02-bg-hoverable:hover{background-color:#242f40}.htb-layer-02-bg-hoverable:active{background-color:#293547}.htb-layer-02-bg-hoverable.selected{background-color:#182232}.htb-layer-03-bg{background-color:#242f40!important}.htb-layer-03-bg-hoverable{cursor:pointer;background-color:#242f40}.htb-layer-03-bg-hoverable:hover{background-color:#293547}.htb-layer-03-bg-hoverable:active{background-color:#2f3b4e}.htb-layer-03-bg-hoverable.selected{background-color:#1e2939}.htb-uppercase{text-transform:uppercase!important}.htb-lowercase{text-transform:lowercase!important}.htb-capitalize{text-transform:capitalize!important}.htb-text-left{text-align:left!important}.htb-text-center{text-align:center!important}.htb-text-right{text-align:right!important}.htb-text-justify{text-align:justify!important}.htb-text-transform-none{text-transform:none!important}.htb-text-underline{text-decoration:underline!important}.htb-text-primary{color:#f4f4f4!important}.htb-text-secondary{color:#8799b5!important}.htb-text-accent{color:#9fef00!important}.htb-text-primary-inverse{color:#121c2b!important}.htb-text-disabled{color:#526177!important}.htb-link{color:#b2f233!important}.htb-text-information{color:#4589ff!important}.htb-text-warning{color:#ffc744!important}.htb-text-error{color:#e4423b!important}.htb-text-placeholder{color:#526177!important}.htb-text-helper{color:#8799b5!important}.htb-link-hover{color:#7fbf00!important}.htb-link-pressed{color:#5f8f00!important}fieldset[disabled] .multiselect{pointer-events:none}.multiselect__spinner{position:absolute;right:1px;top:1px;width:40px;height:38px;background:#fff;display:block}.multiselect__spinner:before,.multiselect__spinner:after{position:absolute;content:"";top:50%;left:50%;margin:-8px 0 0 -8px;width:16px;height:16px;border-radius:100%;border-color:#41b883 transparent transparent;border-style:solid;border-width:2px;box-shadow:0 0 0 1px transparent}.multiselect__spinner:before{animation:spinning 2.4s cubic-bezier(.41,.26,.2,.62);animation-iteration-count:infinite}.multiselect__spinner:after{animation:spinning 2.4s cubic-bezier(.51,.09,.21,.8);animation-iteration-count:infinite}.multiselect__loading-enter-active,.multiselect__loading-leave-active{transition:opacity .4s ease-in-out;opacity:1}.multiselect__loading-enter,.multiselect__loading-leave-active{opacity:0}.multiselect,.multiselect__input,.multiselect__single{font-family:inherit;font-size:16px;touch-action:manipulation}.multiselect{box-sizing:content-box;display:block;position:relative;width:100%;min-height:40px;text-align:left;color:#35495e}.multiselect *{box-sizing:border-box}.multiselect:focus{outline:none}.multiselect--disabled{background:#ededed;pointer-events:none;opacity:.6}.multiselect--active{z-index:50}.multiselect--active:not(.multiselect--above) .multiselect__current,.multiselect--active:not(.multiselect--above) .multiselect__input,.multiselect--active:not(.multiselect--above) .multiselect__tags{border-bottom-left-radius:0;border-bottom-right-radius:0}.multiselect--active .multiselect__select{transform:rotate(180deg)}.multiselect--above.multiselect--active .multiselect__current,.multiselect--above.multiselect--active .multiselect__input,.multiselect--above.multiselect--active .multiselect__tags{border-top-left-radius:0;border-top-right-radius:0}.multiselect__input,.multiselect__single{position:relative;display:inline-block;min-height:20px;line-height:20px;border:none;border-radius:5px;background:#fff;padding:0 0 0 5px;width:100%;transition:border .1s ease;box-sizing:border-box;margin-bottom:8px;vertical-align:top}.multiselect__input::placeholder{color:#35495e}.multiselect__tag~.multiselect__input,.multiselect__tag~.multiselect__single{width:auto}.multiselect__input:hover,.multiselect__single:hover{border-color:#cfcfcf}.multiselect__input:focus,.multiselect__single:focus{border-color:#a8a8a8;outline:none}.multiselect__single{padding-left:5px;margin-bottom:8px}.multiselect__tags-wrap{display:inline}.multiselect__tags{min-height:40px;display:block;padding:8px 40px 0 8px;border-radius:5px;border:1px solid #e8e8e8;background:#fff;font-size:14px}.multiselect__tag{position:relative;display:inline-block;padding:4px 26px 4px 10px;border-radius:5px;margin-right:10px;color:#fff;line-height:1;background:#41b883;margin-bottom:5px;white-space:nowrap;overflow:hidden;max-width:100%;text-overflow:ellipsis}.multiselect__tag-icon{cursor:pointer;margin-left:7px;position:absolute;right:0;top:0;bottom:0;font-weight:700;font-style:initial;width:22px;text-align:center;line-height:22px;transition:all .2s ease;border-radius:5px}.multiselect__tag-icon:after{content:"×";color:#266d4d;font-size:14px}.multiselect__tag-icon:focus:after,.multiselect__tag-icon:hover:after{color:#fff}.multiselect__current{line-height:16px;min-height:40px;box-sizing:border-box;display:block;overflow:hidden;padding:8px 30px 0 12px;white-space:nowrap;margin:0;text-decoration:none;border-radius:5px;border:1px solid #e8e8e8;cursor:pointer}.multiselect__select{line-height:16px;display:block;position:absolute;box-sizing:border-box;width:40px;height:38px;right:1px;top:1px;padding:4px 8px;margin:0;text-decoration:none;text-align:center;cursor:pointer;transition:transform .2s ease}.multiselect__select:before{position:relative;right:0;top:65%;color:#999;margin-top:4px;border-style:solid;border-width:5px 5px 0 5px;border-color:#999 transparent transparent transparent;content:""}.multiselect__placeholder{color:#adadad;display:inline-block;margin-bottom:10px;padding-top:2px}.multiselect--active .multiselect__placeholder{display:none}.multiselect__content-wrapper{position:absolute;display:block;background:#fff;width:100%;max-height:240px;overflow:auto;border:1px solid #e8e8e8;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;z-index:50;-webkit-overflow-scrolling:touch}.multiselect__content{list-style:none;display:inline-block;padding:0;margin:0;min-width:100%;vertical-align:top}.multiselect--above .multiselect__content-wrapper{bottom:100%;border-radius:5px 5px 0 0;border-bottom:none;border-top:1px solid #e8e8e8}.multiselect__content::-webkit-scrollbar{display:none}.multiselect__element{display:block}.multiselect__option{display:block;padding:12px;min-height:40px;line-height:16px;text-decoration:none;text-transform:none;vertical-align:middle;position:relative;cursor:pointer;white-space:nowrap}.multiselect__option:after{top:0;right:0;position:absolute;line-height:40px;padding-right:12px;padding-left:20px;font-size:13px}.multiselect__option--highlight{background:#41b883;outline:none;color:#fff}.multiselect__option--highlight:after{content:attr(data-select);background:#41b883;color:#fff}.multiselect__option--selected{background:#f3f3f3;color:#35495e;font-weight:700}.multiselect__option--selected:after{content:attr(data-selected);color:silver;background:inherit}.multiselect__option--selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect--disabled .multiselect__current,.multiselect--disabled .multiselect__select{background:#ededed;color:#a6a6a6}.multiselect__option--disabled{background:#ededed!important;color:#a6a6a6!important;cursor:text;pointer-events:none}.multiselect__option--group{background:#ededed;color:#35495e}.multiselect__option--group.multiselect__option--highlight{background:#35495e;color:#fff}.multiselect__option--group.multiselect__option--highlight:after{background:#35495e}.multiselect__option--disabled.multiselect__option--highlight{background:#dedede}.multiselect__option--group-selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--group-selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect-enter-active,.multiselect-leave-active{transition:all .15s ease}.multiselect-enter,.multiselect-leave-active{opacity:0}.multiselect__strong{margin-bottom:8px;line-height:20px;display:inline-block;vertical-align:top}*[dir=rtl] .multiselect{text-align:right}*[dir=rtl] .multiselect__select{right:auto;left:1px}*[dir=rtl] .multiselect__tags{padding:8px 8px 0 40px}*[dir=rtl] .multiselect__content{text-align:right}*[dir=rtl] .multiselect__option:after{right:auto;left:0}*[dir=rtl] .multiselect__clear{right:auto;left:12px}*[dir=rtl] .multiselect__spinner{right:auto;left:1px}@keyframes spinning{0%{transform:rotate(0)}to{transform:rotate(2turn)}}.m-0{margin:0rem!important}.p-0{padding:0rem!important}.mt-0{margin-top:0rem!important}.pt-0{padding-top:0rem!important}.mr-0{margin-right:0rem!important}.pr-0{padding-right:0rem!important}.mb-0{margin-bottom:0rem!important}.pb-0{padding-bottom:0rem!important}.ml-0{margin-left:0rem!important}.pl-0{padding-left:0rem!important}.mx-0{margin-left:0rem!important;margin-right:0rem!important}.my-0{margin-top:0rem!important;margin-bottom:0rem!important}.px-0{padding-left:0rem!important;padding-right:0rem!important}.py-0{padding-top:0rem!important;padding-bottom:0rem!important}.m-1{margin:.25rem!important}.p-1{padding:.25rem!important}.mt-1{margin-top:.25rem!important}.pt-1{padding-top:.25rem!important}.mr-1{margin-right:.25rem!important}.pr-1{padding-right:.25rem!important}.mb-1{margin-bottom:.25rem!important}.pb-1{padding-bottom:.25rem!important}.ml-1{margin-left:.25rem!important}.pl-1{padding-left:.25rem!important}.mx-1{margin-left:.25rem!important;margin-right:.25rem!important}.my-1{margin-top:.25rem!important;margin-bottom:.25rem!important}.px-1{padding-left:.25rem!important;padding-right:.25rem!important}.py-1{padding-top:.25rem!important;padding-bottom:.25rem!important}.m-2{margin:.5rem!important}.p-2{padding:.5rem!important}.mt-2{margin-top:.5rem!important}.pt-2{padding-top:.5rem!important}.mr-2{margin-right:.5rem!important}.pr-2{padding-right:.5rem!important}.mb-2{margin-bottom:.5rem!important}.pb-2{padding-bottom:.5rem!important}.ml-2{margin-left:.5rem!important}.pl-2{padding-left:.5rem!important}.mx-2{margin-left:.5rem!important;margin-right:.5rem!important}.my-2{margin-top:.5rem!important;margin-bottom:.5rem!important}.px-2{padding-left:.5rem!important;padding-right:.5rem!important}.py-2{padding-top:.5rem!important;padding-bottom:.5rem!important}.m-3{margin:.75rem!important}.p-3{padding:.75rem!important}.mt-3{margin-top:.75rem!important}.pt-3{padding-top:.75rem!important}.mr-3{margin-right:.75rem!important}.pr-3{padding-right:.75rem!important}.mb-3{margin-bottom:.75rem!important}.pb-3{padding-bottom:.75rem!important}.ml-3{margin-left:.75rem!important}.pl-3{padding-left:.75rem!important}.mx-3{margin-left:.75rem!important;margin-right:.75rem!important}.my-3{margin-top:.75rem!important;margin-bottom:.75rem!important}.px-3{padding-left:.75rem!important;padding-right:.75rem!important}.py-3{padding-top:.75rem!important;padding-bottom:.75rem!important}.m-4{margin:1rem!important}.p-4{padding:1rem!important}.mt-4{margin-top:1rem!important}.pt-4{padding-top:1rem!important}.mr-4{margin-right:1rem!important}.pr-4{padding-right:1rem!important}.mb-4{margin-bottom:1rem!important}.pb-4{padding-bottom:1rem!important}.ml-4{margin-left:1rem!important}.pl-4{padding-left:1rem!important}.mx-4{margin-left:1rem!important;margin-right:1rem!important}.my-4{margin-top:1rem!important;margin-bottom:1rem!important}.px-4{padding-left:1rem!important;padding-right:1rem!important}.py-4{padding-top:1rem!important;padding-bottom:1rem!important}.m-5{margin:1.5rem!important}.p-5{padding:1.5rem!important}.mt-5{margin-top:1.5rem!important}.pt-5{padding-top:1.5rem!important}.mr-5{margin-right:1.5rem!important}.pr-5{padding-right:1.5rem!important}.mb-5{margin-bottom:1.5rem!important}.pb-5{padding-bottom:1.5rem!important}.ml-5{margin-left:1.5rem!important}.pl-5{padding-left:1.5rem!important}.mx-5{margin-left:1.5rem!important;margin-right:1.5rem!important}.my-5{margin-top:1.5rem!important;margin-bottom:1.5rem!important}.px-5{padding-left:1.5rem!important;padding-right:1.5rem!important}.py-5{padding-top:1.5rem!important;padding-bottom:1.5rem!important}.m-6{margin:3rem!important}.p-6{padding:3rem!important}.mt-6{margin-top:3rem!important}.pt-6{padding-top:3rem!important}.mr-6{margin-right:3rem!important}.pr-6{padding-right:3rem!important}.mb-6{margin-bottom:3rem!important}.pb-6{padding-bottom:3rem!important}.ml-6{margin-left:3rem!important}.pl-6{padding-left:3rem!important}.mx-6{margin-left:3rem!important;margin-right:3rem!important}.my-6{margin-top:3rem!important;margin-bottom:3rem!important}.px-6{padding-left:3rem!important;padding-right:3rem!important}.py-6{padding-top:3rem!important;padding-bottom:3rem!important}body{font-family:neue-haas-unica,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.text-center{text-align:center}.text-left{text-align:left}.border-radius-6{border-radius:6px}.d-flex{display:flex;flex-direction:row}@media (max-width: 600px){.d-flex{flex-direction:column}}.flex-column{flex-direction:column}.align-items-center{align-items:center}.align-items-start{align-items:start}.multiselect__option{color:#b0bbd4!important;font-size:14px;font-style:normal;font-weight:500;line-height:20px;letter-spacing:.14px}.multiselect__option:hover{color:#f2f4f8!important;font-weight:700!important}.multiselect__option--highlight{background-color:#9fef001a!important;outline:none;color:#f2f4f8!important}.multiselect__option--highlight:after{content:attr(data-select);background:#9fef00!important;color:#182432!important;font-weight:300!important}.multiselect__option--selected{background-color:#212e3e!important;color:#f2f4f8!important}.multiselect__tags{background-color:#121c2b!important;color:#a4b1cd!important;border:none!important}.multiselect__tag{background-color:#9fef00!important;color:#182432!important}.multiselect__content-wrapper{background-color:#121c2b!important;border:none!important}.multiselect__placeholder{color:#f4f4f4!important}.multiselect__tag-icon:hover{background-color:#86c903!important}.multiselect__option--selected.multiselect__option--highlight{background-color:#9fef001a!important;color:#f2f4f8!important}.multiselect__option--selected.multiselect__option--highlight:after{background:#ff6a6a!important;content:attr(data-deselect);color:#fff!important}.multiselect .multiselect__input,.multiselect__single{font-size:14px;background-color:#121c2b!important;color:#f4f4f4!important}.has-error .multiselect__tags{color:#e4423b!important;border-radius:5px!important;border:2px solid #e4423b!important}.has-success .multiselect__tags{color:#9fef00!important;border-radius:5px;border-color:2px solid #9fef00!important}.pwnbox-card{background:#1A2332;border-radius:8px}.pwnbox-card.disabled{pointer-events:none}.pwnbox-card .card-icon-wrapper{border:2px solid #9fef00;border-radius:50%;display:flex;width:44px;height:44px;justify-content:center;align-items:center}.pwnbox-card .card-icon{position:relative;left:8px;top:4px}.pwnbox-card .card-title{font-weight:700;font-size:16px;line-height:24px}.pwnbox-card .card-subtitle{color:#8799b5;font-size:14px;font-weight:500;line-height:20px;letter-spacing:.14px;text-align:left}.pwnbox-card .selector-label{color:#8799b5;font-size:12px;font-style:normal;font-weight:500;line-height:18px;letter-spacing:.24px}.pwnbox-card .spawn-btn{font-family:neue-haas-unica,sans-serif;font-size:10px;text-wrap:nowrap;color:#121c2b;background-color:#9fef00;border:none;border-radius:.4rem;padding:10px 30px;cursor:pointer;text-align:center;text-decoration:none;text-transform:uppercase;display:inline-block;margin:4px 2px;letter-spacing:1.2px!important}.pwnbox-card .spawn-btn:hover{background-color:#b2f233}.pwnbox-card .spawn-btn:disabled{pointer-events:none;background-color:#7fbf00;border-color:#7fbf00}.pwnbox-card .latency-container{display:flex;justify-content:space-between}.badge{margin-left:16px;font-size:10px;padding:3px 10px;border-radius:400px;height:18px;justify-content:center;display:flex;align-items:center}.badge.success{color:#9fef00;background-color:#9fef0033}.badge.warning{color:#ffc744;background-color:#ffc74433}.badge.danger{color:#e4423b;background-color:#e4423b33}
`, Oa = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, Aa = /* @__PURE__ */ Oa(Ea, [["styles", [Ta]]]), Da = /* @__PURE__ */ Ml(Aa);
function Pa() {
  customElements.define("wc-htb-pwnbox-selection-card", Da);
}
export {
  Da as pwnboxSelectionCard,
  Pa as register
};
