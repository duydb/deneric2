!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("Deneric",[],r):"object"==typeof exports?exports.Deneric=r():t.Deneric=r()}(this,(function(){return(()=>{var t={8552:(t,r,e)=>{var n=e(852)(e(5639),"DataView");t.exports=n},1989:(t,r,e)=>{var n=e(1789),o=e(401),a=e(7667),u=e(1327),c=e(1866);function i(t){var r=-1,e=null==t?0:t.length;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}i.prototype.clear=n,i.prototype.delete=o,i.prototype.get=a,i.prototype.has=u,i.prototype.set=c,t.exports=i},8407:(t,r,e)=>{var n=e(7040),o=e(4125),a=e(2117),u=e(7518),c=e(4705);function i(t){var r=-1,e=null==t?0:t.length;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}i.prototype.clear=n,i.prototype.delete=o,i.prototype.get=a,i.prototype.has=u,i.prototype.set=c,t.exports=i},7071:(t,r,e)=>{var n=e(852)(e(5639),"Map");t.exports=n},3369:(t,r,e)=>{var n=e(4785),o=e(1285),a=e(6e3),u=e(9916),c=e(5265);function i(t){var r=-1,e=null==t?0:t.length;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}i.prototype.clear=n,i.prototype.delete=o,i.prototype.get=a,i.prototype.has=u,i.prototype.set=c,t.exports=i},3818:(t,r,e)=>{var n=e(852)(e(5639),"Promise");t.exports=n},8525:(t,r,e)=>{var n=e(852)(e(5639),"Set");t.exports=n},6384:(t,r,e)=>{var n=e(8407),o=e(7465),a=e(3779),u=e(7599),c=e(4758),i=e(4309);function s(t){var r=this.__data__=new n(t);this.size=r.size}s.prototype.clear=o,s.prototype.delete=a,s.prototype.get=u,s.prototype.has=c,s.prototype.set=i,t.exports=s},2705:(t,r,e)=>{var n=e(5639).Symbol;t.exports=n},1149:(t,r,e)=>{var n=e(5639).Uint8Array;t.exports=n},577:(t,r,e)=>{var n=e(852)(e(5639),"WeakMap");t.exports=n},7412:t=>{t.exports=function(t,r){for(var e=-1,n=null==t?0:t.length;++e<n&&!1!==r(t[e],e,t););return t}},4963:t=>{t.exports=function(t,r){for(var e=-1,n=null==t?0:t.length,o=0,a=[];++e<n;){var u=t[e];r(u,e,t)&&(a[o++]=u)}return a}},4636:(t,r,e)=>{var n=e(2545),o=e(5694),a=e(1469),u=e(4144),c=e(5776),i=e(6719),s=Object.prototype.hasOwnProperty;t.exports=function(t,r){var e=a(t),p=!e&&o(t),f=!e&&!p&&u(t),l=!e&&!p&&!f&&i(t),v=e||p||f||l,y=v?n(t.length,String):[],b=y.length;for(var h in t)!r&&!s.call(t,h)||v&&("length"==h||f&&("offset"==h||"parent"==h)||l&&("buffer"==h||"byteLength"==h||"byteOffset"==h)||c(h,b))||y.push(h);return y}},9932:t=>{t.exports=function(t,r){for(var e=-1,n=null==t?0:t.length,o=Array(n);++e<n;)o[e]=r(t[e],e,t);return o}},2488:t=>{t.exports=function(t,r){for(var e=-1,n=r.length,o=t.length;++e<n;)t[o+e]=r[e];return t}},4865:(t,r,e)=>{var n=e(9465),o=e(7813),a=Object.prototype.hasOwnProperty;t.exports=function(t,r,e){var u=t[r];a.call(t,r)&&o(u,e)&&(void 0!==e||r in t)||n(t,r,e)}},8470:(t,r,e)=>{var n=e(7813);t.exports=function(t,r){for(var e=t.length;e--;)if(n(t[e][0],r))return e;return-1}},4037:(t,r,e)=>{var n=e(8363),o=e(3674);t.exports=function(t,r){return t&&n(r,o(r),t)}},3886:(t,r,e)=>{var n=e(8363),o=e(1704);t.exports=function(t,r){return t&&n(r,o(r),t)}},9465:(t,r,e)=>{var n=e(8777);t.exports=function(t,r,e){"__proto__"==r&&n?n(t,r,{configurable:!0,enumerable:!0,value:e,writable:!0}):t[r]=e}},5990:(t,r,e)=>{var n=e(6384),o=e(7412),a=e(4865),u=e(4037),c=e(3886),i=e(4626),s=e(278),p=e(8805),f=e(1911),l=e(8234),v=e(6904),y=e(4160),b=e(3824),h=e(9148),_=e(8517),x=e(1469),j=e(4144),d=e(6688),g=e(3218),m=e(2928),O=e(3674),w=e(1704),A="[object Arguments]",S="[object Function]",T="[object Object]",F={};F[A]=F["[object Array]"]=F["[object ArrayBuffer]"]=F["[object DataView]"]=F["[object Boolean]"]=F["[object Date]"]=F["[object Float32Array]"]=F["[object Float64Array]"]=F["[object Int8Array]"]=F["[object Int16Array]"]=F["[object Int32Array]"]=F["[object Map]"]=F["[object Number]"]=F[T]=F["[object RegExp]"]=F["[object Set]"]=F["[object String]"]=F["[object Symbol]"]=F["[object Uint8Array]"]=F["[object Uint8ClampedArray]"]=F["[object Uint16Array]"]=F["[object Uint32Array]"]=!0,F["[object Error]"]=F[S]=F["[object WeakMap]"]=!1,t.exports=function t(r,e,z,D,P,V){var M,E=1&e,I=2&e,U=4&e;if(z&&(M=P?z(r,D,P,V):z(r)),void 0!==M)return M;if(!g(r))return r;var B=x(r);if(B){if(M=b(r),!E)return s(r,M)}else{var k=y(r),$=k==S||"[object GeneratorFunction]"==k;if(j(r))return i(r,E);if(k==T||k==A||$&&!P){if(M=I||$?{}:_(r),!E)return I?f(r,c(M,r)):p(r,u(M,r))}else{if(!F[k])return P?r:{};M=h(r,k,E)}}V||(V=new n);var C=V.get(r);if(C)return C;V.set(r,M),m(r)?r.forEach((function(n){M.add(t(n,e,z,n,r,V))})):d(r)&&r.forEach((function(n,o){M.set(o,t(n,e,z,o,r,V))}));var N=B?void 0:(U?I?v:l:I?w:O)(r);return o(N||r,(function(n,o){N&&(n=r[o=n]),a(M,o,t(n,e,z,o,r,V))})),M}},3118:(t,r,e)=>{var n=e(3218),o=Object.create,a=function(){function t(){}return function(r){if(!n(r))return{};if(o)return o(r);t.prototype=r;var e=new t;return t.prototype=void 0,e}}();t.exports=a},7786:(t,r,e)=>{var n=e(1811),o=e(327);t.exports=function(t,r){for(var e=0,a=(r=n(r,t)).length;null!=t&&e<a;)t=t[o(r[e++])];return e&&e==a?t:void 0}},8866:(t,r,e)=>{var n=e(2488),o=e(1469);t.exports=function(t,r,e){var a=r(t);return o(t)?a:n(a,e(t))}},4239:(t,r,e)=>{var n=e(2705),o=e(9607),a=e(2333),u=n?n.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":u&&u in Object(t)?o(t):a(t)}},9454:(t,r,e)=>{var n=e(4239),o=e(7005);t.exports=function(t){return o(t)&&"[object Arguments]"==n(t)}},5588:(t,r,e)=>{var n=e(4160),o=e(7005);t.exports=function(t){return o(t)&&"[object Map]"==n(t)}},8458:(t,r,e)=>{var n=e(3560),o=e(5346),a=e(3218),u=e(346),c=/^\[object .+?Constructor\]$/,i=Function.prototype,s=Object.prototype,p=i.toString,f=s.hasOwnProperty,l=RegExp("^"+p.call(f).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return!(!a(t)||o(t))&&(n(t)?l:c).test(u(t))}},9221:(t,r,e)=>{var n=e(4160),o=e(7005);t.exports=function(t){return o(t)&&"[object Set]"==n(t)}},8749:(t,r,e)=>{var n=e(4239),o=e(1780),a=e(7005),u={};u["[object Float32Array]"]=u["[object Float64Array]"]=u["[object Int8Array]"]=u["[object Int16Array]"]=u["[object Int32Array]"]=u["[object Uint8Array]"]=u["[object Uint8ClampedArray]"]=u["[object Uint16Array]"]=u["[object Uint32Array]"]=!0,u["[object Arguments]"]=u["[object Array]"]=u["[object ArrayBuffer]"]=u["[object Boolean]"]=u["[object DataView]"]=u["[object Date]"]=u["[object Error]"]=u["[object Function]"]=u["[object Map]"]=u["[object Number]"]=u["[object Object]"]=u["[object RegExp]"]=u["[object Set]"]=u["[object String]"]=u["[object WeakMap]"]=!1,t.exports=function(t){return a(t)&&o(t.length)&&!!u[n(t)]}},280:(t,r,e)=>{var n=e(5726),o=e(6916),a=Object.prototype.hasOwnProperty;t.exports=function(t){if(!n(t))return o(t);var r=[];for(var e in Object(t))a.call(t,e)&&"constructor"!=e&&r.push(e);return r}},313:(t,r,e)=>{var n=e(3218),o=e(5726),a=e(3498),u=Object.prototype.hasOwnProperty;t.exports=function(t){if(!n(t))return a(t);var r=o(t),e=[];for(var c in t)("constructor"!=c||!r&&u.call(t,c))&&e.push(c);return e}},611:(t,r,e)=>{var n=e(4865),o=e(1811),a=e(5776),u=e(3218),c=e(327);t.exports=function(t,r,e,i){if(!u(t))return t;for(var s=-1,p=(r=o(r,t)).length,f=p-1,l=t;null!=l&&++s<p;){var v=c(r[s]),y=e;if("__proto__"===v||"constructor"===v||"prototype"===v)return t;if(s!=f){var b=l[v];void 0===(y=i?i(b,v,l):void 0)&&(y=u(b)?b:a(r[s+1])?[]:{})}n(l,v,y),l=l[v]}return t}},2545:t=>{t.exports=function(t,r){for(var e=-1,n=Array(t);++e<t;)n[e]=r(e);return n}},531:(t,r,e)=>{var n=e(2705),o=e(9932),a=e(1469),u=e(3448),c=n?n.prototype:void 0,i=c?c.toString:void 0;t.exports=function t(r){if("string"==typeof r)return r;if(a(r))return o(r,t)+"";if(u(r))return i?i.call(r):"";var e=r+"";return"0"==e&&1/r==-1/0?"-0":e}},1717:t=>{t.exports=function(t){return function(r){return t(r)}}},1811:(t,r,e)=>{var n=e(1469),o=e(5403),a=e(5514),u=e(9833);t.exports=function(t,r){return n(t)?t:o(t,r)?[t]:a(u(t))}},4318:(t,r,e)=>{var n=e(1149);t.exports=function(t){var r=new t.constructor(t.byteLength);return new n(r).set(new n(t)),r}},4626:(t,r,e)=>{t=e.nmd(t);var n=e(5639),o=r&&!r.nodeType&&r,a=o&&t&&!t.nodeType&&t,u=a&&a.exports===o?n.Buffer:void 0,c=u?u.allocUnsafe:void 0;t.exports=function(t,r){if(r)return t.slice();var e=t.length,n=c?c(e):new t.constructor(e);return t.copy(n),n}},7157:(t,r,e)=>{var n=e(4318);t.exports=function(t,r){var e=r?n(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.byteLength)}},3147:t=>{var r=/\w*$/;t.exports=function(t){var e=new t.constructor(t.source,r.exec(t));return e.lastIndex=t.lastIndex,e}},419:(t,r,e)=>{var n=e(2705),o=n?n.prototype:void 0,a=o?o.valueOf:void 0;t.exports=function(t){return a?Object(a.call(t)):{}}},7133:(t,r,e)=>{var n=e(4318);t.exports=function(t,r){var e=r?n(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.length)}},278:t=>{t.exports=function(t,r){var e=-1,n=t.length;for(r||(r=Array(n));++e<n;)r[e]=t[e];return r}},8363:(t,r,e)=>{var n=e(4865),o=e(9465);t.exports=function(t,r,e,a){var u=!e;e||(e={});for(var c=-1,i=r.length;++c<i;){var s=r[c],p=a?a(e[s],t[s],s,e,t):void 0;void 0===p&&(p=t[s]),u?o(e,s,p):n(e,s,p)}return e}},8805:(t,r,e)=>{var n=e(8363),o=e(9551);t.exports=function(t,r){return n(t,o(t),r)}},1911:(t,r,e)=>{var n=e(8363),o=e(1442);t.exports=function(t,r){return n(t,o(t),r)}},4429:(t,r,e)=>{var n=e(5639)["__core-js_shared__"];t.exports=n},8777:(t,r,e)=>{var n=e(852),o=function(){try{var t=n(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();t.exports=o},1957:(t,r,e)=>{var n="object"==typeof e.g&&e.g&&e.g.Object===Object&&e.g;t.exports=n},8234:(t,r,e)=>{var n=e(8866),o=e(9551),a=e(3674);t.exports=function(t){return n(t,a,o)}},6904:(t,r,e)=>{var n=e(8866),o=e(1442),a=e(1704);t.exports=function(t){return n(t,a,o)}},5050:(t,r,e)=>{var n=e(7019);t.exports=function(t,r){var e=t.__data__;return n(r)?e["string"==typeof r?"string":"hash"]:e.map}},852:(t,r,e)=>{var n=e(8458),o=e(7801);t.exports=function(t,r){var e=o(t,r);return n(e)?e:void 0}},5924:(t,r,e)=>{var n=e(5569)(Object.getPrototypeOf,Object);t.exports=n},9607:(t,r,e)=>{var n=e(2705),o=Object.prototype,a=o.hasOwnProperty,u=o.toString,c=n?n.toStringTag:void 0;t.exports=function(t){var r=a.call(t,c),e=t[c];try{t[c]=void 0;var n=!0}catch(t){}var o=u.call(t);return n&&(r?t[c]=e:delete t[c]),o}},9551:(t,r,e)=>{var n=e(4963),o=e(479),a=Object.prototype.propertyIsEnumerable,u=Object.getOwnPropertySymbols,c=u?function(t){return null==t?[]:(t=Object(t),n(u(t),(function(r){return a.call(t,r)})))}:o;t.exports=c},1442:(t,r,e)=>{var n=e(2488),o=e(5924),a=e(9551),u=e(479),c=Object.getOwnPropertySymbols?function(t){for(var r=[];t;)n(r,a(t)),t=o(t);return r}:u;t.exports=c},4160:(t,r,e)=>{var n=e(8552),o=e(7071),a=e(3818),u=e(8525),c=e(577),i=e(4239),s=e(346),p="[object Map]",f="[object Promise]",l="[object Set]",v="[object WeakMap]",y="[object DataView]",b=s(n),h=s(o),_=s(a),x=s(u),j=s(c),d=i;(n&&d(new n(new ArrayBuffer(1)))!=y||o&&d(new o)!=p||a&&d(a.resolve())!=f||u&&d(new u)!=l||c&&d(new c)!=v)&&(d=function(t){var r=i(t),e="[object Object]"==r?t.constructor:void 0,n=e?s(e):"";if(n)switch(n){case b:return y;case h:return p;case _:return f;case x:return l;case j:return v}return r}),t.exports=d},7801:t=>{t.exports=function(t,r){return null==t?void 0:t[r]}},1789:(t,r,e)=>{var n=e(4536);t.exports=function(){this.__data__=n?n(null):{},this.size=0}},401:t=>{t.exports=function(t){var r=this.has(t)&&delete this.__data__[t];return this.size-=r?1:0,r}},7667:(t,r,e)=>{var n=e(4536),o=Object.prototype.hasOwnProperty;t.exports=function(t){var r=this.__data__;if(n){var e=r[t];return"__lodash_hash_undefined__"===e?void 0:e}return o.call(r,t)?r[t]:void 0}},1327:(t,r,e)=>{var n=e(4536),o=Object.prototype.hasOwnProperty;t.exports=function(t){var r=this.__data__;return n?void 0!==r[t]:o.call(r,t)}},1866:(t,r,e)=>{var n=e(4536);t.exports=function(t,r){var e=this.__data__;return this.size+=this.has(t)?0:1,e[t]=n&&void 0===r?"__lodash_hash_undefined__":r,this}},3824:t=>{var r=Object.prototype.hasOwnProperty;t.exports=function(t){var e=t.length,n=new t.constructor(e);return e&&"string"==typeof t[0]&&r.call(t,"index")&&(n.index=t.index,n.input=t.input),n}},9148:(t,r,e)=>{var n=e(4318),o=e(7157),a=e(3147),u=e(419),c=e(7133);t.exports=function(t,r,e){var i=t.constructor;switch(r){case"[object ArrayBuffer]":return n(t);case"[object Boolean]":case"[object Date]":return new i(+t);case"[object DataView]":return o(t,e);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return c(t,e);case"[object Map]":case"[object Set]":return new i;case"[object Number]":case"[object String]":return new i(t);case"[object RegExp]":return a(t);case"[object Symbol]":return u(t)}}},8517:(t,r,e)=>{var n=e(3118),o=e(5924),a=e(5726);t.exports=function(t){return"function"!=typeof t.constructor||a(t)?{}:n(o(t))}},5776:t=>{var r=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var n=typeof t;return!!(e=null==e?9007199254740991:e)&&("number"==n||"symbol"!=n&&r.test(t))&&t>-1&&t%1==0&&t<e}},5403:(t,r,e)=>{var n=e(1469),o=e(3448),a=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,u=/^\w*$/;t.exports=function(t,r){if(n(t))return!1;var e=typeof t;return!("number"!=e&&"symbol"!=e&&"boolean"!=e&&null!=t&&!o(t))||u.test(t)||!a.test(t)||null!=r&&t in Object(r)}},7019:t=>{t.exports=function(t){var r=typeof t;return"string"==r||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==t:null===t}},5346:(t,r,e)=>{var n,o=e(4429),a=(n=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"";t.exports=function(t){return!!a&&a in t}},5726:t=>{var r=Object.prototype;t.exports=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||r)}},7040:t=>{t.exports=function(){this.__data__=[],this.size=0}},4125:(t,r,e)=>{var n=e(8470),o=Array.prototype.splice;t.exports=function(t){var r=this.__data__,e=n(r,t);return!(e<0||(e==r.length-1?r.pop():o.call(r,e,1),--this.size,0))}},2117:(t,r,e)=>{var n=e(8470);t.exports=function(t){var r=this.__data__,e=n(r,t);return e<0?void 0:r[e][1]}},7518:(t,r,e)=>{var n=e(8470);t.exports=function(t){return n(this.__data__,t)>-1}},4705:(t,r,e)=>{var n=e(8470);t.exports=function(t,r){var e=this.__data__,o=n(e,t);return o<0?(++this.size,e.push([t,r])):e[o][1]=r,this}},4785:(t,r,e)=>{var n=e(1989),o=e(8407),a=e(7071);t.exports=function(){this.size=0,this.__data__={hash:new n,map:new(a||o),string:new n}}},1285:(t,r,e)=>{var n=e(5050);t.exports=function(t){var r=n(this,t).delete(t);return this.size-=r?1:0,r}},6e3:(t,r,e)=>{var n=e(5050);t.exports=function(t){return n(this,t).get(t)}},9916:(t,r,e)=>{var n=e(5050);t.exports=function(t){return n(this,t).has(t)}},5265:(t,r,e)=>{var n=e(5050);t.exports=function(t,r){var e=n(this,t),o=e.size;return e.set(t,r),this.size+=e.size==o?0:1,this}},4523:(t,r,e)=>{var n=e(8306);t.exports=function(t){var r=n(t,(function(t){return 500===e.size&&e.clear(),t})),e=r.cache;return r}},4536:(t,r,e)=>{var n=e(852)(Object,"create");t.exports=n},6916:(t,r,e)=>{var n=e(5569)(Object.keys,Object);t.exports=n},3498:t=>{t.exports=function(t){var r=[];if(null!=t)for(var e in Object(t))r.push(e);return r}},1167:(t,r,e)=>{t=e.nmd(t);var n=e(1957),o=r&&!r.nodeType&&r,a=o&&t&&!t.nodeType&&t,u=a&&a.exports===o&&n.process,c=function(){try{return a&&a.require&&a.require("util").types||u&&u.binding&&u.binding("util")}catch(t){}}();t.exports=c},2333:t=>{var r=Object.prototype.toString;t.exports=function(t){return r.call(t)}},5569:t=>{t.exports=function(t,r){return function(e){return t(r(e))}}},5639:(t,r,e)=>{var n=e(1957),o="object"==typeof self&&self&&self.Object===Object&&self,a=n||o||Function("return this")();t.exports=a},7465:(t,r,e)=>{var n=e(8407);t.exports=function(){this.__data__=new n,this.size=0}},3779:t=>{t.exports=function(t){var r=this.__data__,e=r.delete(t);return this.size=r.size,e}},7599:t=>{t.exports=function(t){return this.__data__.get(t)}},4758:t=>{t.exports=function(t){return this.__data__.has(t)}},4309:(t,r,e)=>{var n=e(8407),o=e(7071),a=e(3369);t.exports=function(t,r){var e=this.__data__;if(e instanceof n){var u=e.__data__;if(!o||u.length<199)return u.push([t,r]),this.size=++e.size,this;e=this.__data__=new a(u)}return e.set(t,r),this.size=e.size,this}},5514:(t,r,e)=>{var n=e(4523),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,a=/\\(\\)?/g,u=n((function(t){var r=[];return 46===t.charCodeAt(0)&&r.push(""),t.replace(o,(function(t,e,n,o){r.push(n?o.replace(a,"$1"):e||t)})),r}));t.exports=u},327:(t,r,e)=>{var n=e(3448);t.exports=function(t){if("string"==typeof t||n(t))return t;var r=t+"";return"0"==r&&1/t==-1/0?"-0":r}},346:t=>{var r=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return r.call(t)}catch(t){}try{return t+""}catch(t){}}return""}},361:(t,r,e)=>{var n=e(5990);t.exports=function(t){return n(t,5)}},7813:t=>{t.exports=function(t,r){return t===r||t!=t&&r!=r}},7361:(t,r,e)=>{var n=e(7786);t.exports=function(t,r,e){var o=null==t?void 0:n(t,r);return void 0===o?e:o}},5694:(t,r,e)=>{var n=e(9454),o=e(7005),a=Object.prototype,u=a.hasOwnProperty,c=a.propertyIsEnumerable,i=n(function(){return arguments}())?n:function(t){return o(t)&&u.call(t,"callee")&&!c.call(t,"callee")};t.exports=i},1469:t=>{var r=Array.isArray;t.exports=r},8612:(t,r,e)=>{var n=e(3560),o=e(1780);t.exports=function(t){return null!=t&&o(t.length)&&!n(t)}},4144:(t,r,e)=>{t=e.nmd(t);var n=e(5639),o=e(5062),a=r&&!r.nodeType&&r,u=a&&t&&!t.nodeType&&t,c=u&&u.exports===a?n.Buffer:void 0,i=(c?c.isBuffer:void 0)||o;t.exports=i},3560:(t,r,e)=>{var n=e(4239),o=e(3218);t.exports=function(t){if(!o(t))return!1;var r=n(t);return"[object Function]"==r||"[object GeneratorFunction]"==r||"[object AsyncFunction]"==r||"[object Proxy]"==r}},1780:t=>{t.exports=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}},6688:(t,r,e)=>{var n=e(5588),o=e(1717),a=e(1167),u=a&&a.isMap,c=u?o(u):n;t.exports=c},3218:t=>{t.exports=function(t){var r=typeof t;return null!=t&&("object"==r||"function"==r)}},7005:t=>{t.exports=function(t){return null!=t&&"object"==typeof t}},2928:(t,r,e)=>{var n=e(9221),o=e(1717),a=e(1167),u=a&&a.isSet,c=u?o(u):n;t.exports=c},3448:(t,r,e)=>{var n=e(4239),o=e(7005);t.exports=function(t){return"symbol"==typeof t||o(t)&&"[object Symbol]"==n(t)}},6719:(t,r,e)=>{var n=e(8749),o=e(1717),a=e(1167),u=a&&a.isTypedArray,c=u?o(u):n;t.exports=c},3674:(t,r,e)=>{var n=e(4636),o=e(280),a=e(8612);t.exports=function(t){return a(t)?n(t):o(t)}},1704:(t,r,e)=>{var n=e(4636),o=e(313),a=e(8612);t.exports=function(t){return a(t)?n(t,!0):o(t)}},8306:(t,r,e)=>{var n=e(3369);function o(t,r){if("function"!=typeof t||null!=r&&"function"!=typeof r)throw new TypeError("Expected a function");var e=function(){var n=arguments,o=r?r.apply(this,n):n[0],a=e.cache;if(a.has(o))return a.get(o);var u=t.apply(this,n);return e.cache=a.set(o,u)||a,u};return e.cache=new(o.Cache||n),e}o.Cache=n,t.exports=o},6968:(t,r,e)=>{var n=e(611);t.exports=function(t,r,e){return null==t?t:n(t,r,e)}},479:t=>{t.exports=function(){return[]}},5062:t=>{t.exports=function(){return!1}},9833:(t,r,e)=>{var n=e(531);t.exports=function(t){return null==t?"":n(t)}},882:function(t,r,e){"use strict";var n,o=this&&this.__extends||(n=function(t,r){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(t[e]=r[e])},n(t,r)},function(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function e(){this.constructor=t}n(t,r),t.prototype=null===r?Object.create(r):(e.prototype=r.prototype,new e)}),a=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(r,"__esModule",{value:!0});var u=a(e(7361)),c=a(e(6968)),i=a(e(361)),s=a(e(3218)),p=[String,Number,Boolean,Array,Object],f=function(){this.isArray=!1,this.isMap=!1},l=function(t){function r(r){var e=t.call(this)||this;return e.itemType=r,e.isArray=!0,e}return o(r,t),r}(f),v=function(t){function r(r){var e=t.call(this)||this;return e.itemType=r,e.isMap=!0,e}return o(r,t),r}(f),y=Object.freeze({getValueFromJson:function(t,r,e,n){if(r.prototype instanceof b)return new r(t);if(r instanceof f){var o=r;return o.isArray?Array.isArray(t)?t.map((function(t){return y.getValueFromJson(t,o.itemType,y.getDefaultValue(o.itemType),n)})):e:o.isMap&&(0,s.default)(t)?Object.keys(t).reduce((function(r,e){return(0,c.default)(r,e,y.getValueFromJson((0,u.default)(t,e),o.itemType,y.getDefaultValue(o.itemType),n)),r}),{}):e}var a=null==t;if(!p.includes(r))return a?e:t;if(n)switch(r){case String:return"string"==typeof t?t:e;case Number:return"number"==typeof t?t:e;case Boolean:return"boolean"==typeof t?t:e;case Array:return Array.isArray(t)?t:e;case Object:return(0,s.default)(t)?t:e}return a?e:r(t)},getValueFromDeneric:function(t,r,e){switch(r){case String:return"string"==typeof t?t:e;case Number:return"number"==typeof t?t:e;case Boolean:return"boolean"==typeof t?t:e;case Array:return Array.isArray(t)?t:e;case Object:return(0,s.default)(t)?t:e}if(r instanceof f){var n=r;if(n.isArray)return Array.isArray(t)?t.map((function(t){return y.getValueFromDeneric(t,n.itemType,y.getDefaultValue(n.itemType))})):e;if(n.isMap)return t=(0,s.default)(t)?t:{},Object.keys(t).reduce((function(r,e){return(0,c.default)(r,e,y.getValueFromDeneric(t[e],n.itemType,y.getDefaultValue(n.itemType))),r}),{})}return r.prototype instanceof b?t.toJson():t},getDefaultValue:function(t){switch(t){case String:return"";case Number:return 0;case Boolean:return!1;case Array:return[];case Object:return{}}}}),b=function(){function t(t){if(!t)throw new TypeError("Invalid schema: "+this.constructor.name);this.__proto__.schema=t}return t.prototype.clone=function(){return(0,i.default)(this)},t.prototype.fromJson=function(t,r){var e=this;return void 0===r&&(r=!0),this.__proto__.schema&&Object.keys(this.__proto__.schema).forEach((function(n){var o,a=e.__proto__.schema[n],s=a[0],p=a[1],f=null!==(o=(0,u.default)(e,n))&&void 0!==o?o:y.getDefaultValue(p),l=y.getValueFromJson((0,i.default)((0,u.default)(t,s)),p,f,r);(0,c.default)(e,n,l)})),this},t.prototype.toJson=function(){var t=this,r={};return this.__proto__.schema&&Object.keys(this.__proto__.schema).forEach((function(e){if(t.__proto__.schema){var n=t.__proto__.schema[e],o=n[0],a=n[1];n[2]||(0,c.default)(r,o,y.getValueFromDeneric((0,i.default)((0,u.default)(t,e)),a,e))}})),r},t.Array=function(t){return new l(t)},t.Map=function(t){return new v(t)},t}();r.default=b}},r={};function e(n){var o=r[n];if(void 0!==o)return o.exports;var a=r[n]={id:n,loaded:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}return e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),e.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),e(882)})()}));