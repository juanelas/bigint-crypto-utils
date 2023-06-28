"use strict";function n(n){return n>=0?n:-n}function e(n){if("number"==typeof n&&(n=BigInt(n)),1n===n)return 1;let e=1;do{e++}while((n>>=1n)>1n);return e}function t(n,e){if("number"==typeof n&&(n=BigInt(n)),"number"==typeof e&&(e=BigInt(e)),n<=0n||e<=0n)throw new RangeError("a and b MUST be > 0");let t=0n,r=1n,o=1n,i=0n;for(;0n!==n;){const u=e/n,s=e%n,c=t-o*u,f=r-i*u;e=n,n=s,t=o,r=i,o=c,i=f}return{g:e,x:t,y:r}}function r(n,e){if("number"==typeof n&&(n=BigInt(n)),"number"==typeof e&&(e=BigInt(e)),e<=0n)throw new RangeError("n must be > 0");const t=n%e;return t<0n?t+e:t}function o(n,e){const o=t(r(n,e),e);if(1n!==o.g)throw new RangeError(`${n.toString()} does not have inverse modulo ${e.toString()}`);return r(o.x,e)}function i(n,e,t){if(n.length!==e.length)throw new RangeError("The remainders and modulos arrays should have the same length");const i=t??e.reduce(((n,e)=>n*e),1n);return e.reduce(((e,t,u)=>{const s=i/t;return r(e+s*o(s,t)%i*n[u]%i,i)}),0n)}function u(e,t){let r="number"==typeof e?BigInt(n(e)):n(e),o="number"==typeof t?BigInt(n(t)):n(t);if(0n===r)return o;if(0n===o)return r;let i=0n;for(;0n===(1n&(r|o));)r>>=1n,o>>=1n,i++;for(;0n===(1n&r);)r>>=1n;do{for(;0n===(1n&o);)o>>=1n;if(r>o){const n=r;r=o,o=n}o-=r}while(0n!==o);return r<<i}function s(n){return n.map((n=>n[0]**(n[1]-1n)*(n[0]-1n))).reduce(((n,e)=>e*n),1n)}function c(e,t,u,f){if("number"==typeof e&&(e=BigInt(e)),"number"==typeof t&&(t=BigInt(t)),"number"==typeof u&&(u=BigInt(u)),u<=0n)throw new RangeError("n must be > 0");if(1n===u)return 0n;if(e=r(e,u),t<0n)return o(c(e,n(t),u,f),u);if(void 0!==f)return function(n,e,t,r){const o=r.map((n=>n[0]**n[1])),u=r.map((n=>s([n]))),f=u.map(((t,r)=>c(n,e%t,o[r])));return i(f,o,t)}(e,t,u,function(n){const e={};return n.forEach((n=>{if("bigint"==typeof n||"number"==typeof n){const t=String(n);void 0===e[t]?e[t]={p:BigInt(n),k:1n}:e[t].k+=1n}else{const t=String(n[0]);void 0===e[t]?e[t]={p:BigInt(n[0]),k:BigInt(n[1])}:e[t].k+=BigInt(n[1])}})),Object.values(e).map((n=>[n.p,n.k]))}(f));let a=1n;for(;t>0;)t%2n===1n&&(a=a*e%u),t/=2n,e=e**2n%u;return a}function f(n){let e=0n;for(const t of n.values()){e=(e<<8n)+BigInt(t)}return e}var a=require("crypto");function g(n,e=!1){if(n<1)throw new RangeError("byteLength MUST be > 0");return new Promise((function(t,r){a.randomBytes(n,(function(n,o){null!==n&&r(n),e&&(o[0]=128|o[0]),t(o)}))}))}function p(n,e=!1){if(n<1)throw new RangeError("byteLength MUST be > 0");{const t=a.randomBytes(n);return e&&(t[0]=128|t[0]),t}}function d(n,e=!1){if(n<1)throw new RangeError("bitLength MUST be > 0");const t=Math.ceil(n/8),r=n%8;return new Promise(((n,o)=>{g(t,!1).then((function(t){if(0!==r&&(t[0]=t[0]&2**r-1),e){const n=0!==r?2**(r-1):128;t[0]=t[0]|n}n(t)}))}))}function h(n,e=!1){if(n<1)throw new RangeError("bitLength MUST be > 0");const t=p(Math.ceil(n/8),!1),r=n%8;if(0!==r&&(t[0]=t[0]&2**r-1),e){const n=0!==r?2**(r-1):128;t[0]=t[0]|n}return t}function l(n,t=1n){if(n<=t)throw new RangeError("Arguments MUST be: max > min");const r=n-t,o=e(r);let i;do{i=f(h(o))}while(i>r);return i+t}let m=!1;try{require("worker_threads"),m=!0}catch(r){console.log("[bigint-crypto-utils] WARNING:\nThis node version doesn't support worker_threads. You should enable them in order to greatly speedup the generation of big prime numbers.\n  · With Node >=11 it is enabled by default (consider upgrading).\n  · With Node 10, starting with 10.5.0, you can enable worker_threads at runtime executing node --experimental-worker ")}function b(n,e){if(2n===n)return!0;if(0n===(1n&n)||1n===n)return!1;const t=[3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n,41n,43n,47n,53n,59n,61n,67n,71n,73n,79n,83n,89n,97n,101n,103n,107n,109n,113n,127n,131n,137n,139n,149n,151n,157n,163n,167n,173n,179n,181n,191n,193n,197n,199n,211n,223n,227n,229n,233n,239n,241n,251n,257n,263n,269n,271n,277n,281n,283n,293n,307n,311n,313n,317n,331n,337n,347n,349n,353n,359n,367n,373n,379n,383n,389n,397n,401n,409n,419n,421n,431n,433n,439n,443n,449n,457n,461n,463n,467n,479n,487n,491n,499n,503n,509n,521n,523n,541n,547n,557n,563n,569n,571n,577n,587n,593n,599n,601n,607n,613n,617n,619n,631n,641n,643n,647n,653n,659n,661n,673n,677n,683n,691n,701n,709n,719n,727n,733n,739n,743n,751n,757n,761n,769n,773n,787n,797n,809n,811n,821n,823n,827n,829n,839n,853n,857n,859n,863n,877n,881n,883n,887n,907n,911n,919n,929n,937n,941n,947n,953n,967n,971n,977n,983n,991n,997n,1009n,1013n,1019n,1021n,1031n,1033n,1039n,1049n,1051n,1061n,1063n,1069n,1087n,1091n,1093n,1097n,1103n,1109n,1117n,1123n,1129n,1151n,1153n,1163n,1171n,1181n,1187n,1193n,1201n,1213n,1217n,1223n,1229n,1231n,1237n,1249n,1259n,1277n,1279n,1283n,1289n,1291n,1297n,1301n,1303n,1307n,1319n,1321n,1327n,1361n,1367n,1373n,1381n,1399n,1409n,1423n,1427n,1429n,1433n,1439n,1447n,1451n,1453n,1459n,1471n,1481n,1483n,1487n,1489n,1493n,1499n,1511n,1523n,1531n,1543n,1549n,1553n,1559n,1567n,1571n,1579n,1583n,1597n];for(let e=0;e<t.length&&t[e]<=n;e++){const r=t[e];if(n===r)return!0;if(n%r===0n)return!1}let r=0n;const o=n-1n;let i=o;for(;i%2n===0n;)i/=2n,++r;const u=o/2n**r;do{let e=c(l(o,2n),u,n);if(1n===e||e===o)continue;let t=1;for(;t<r&&(e=c(e,2n,n),e!==o);){if(1n===e)return!1;t++}if(e!==o)return!1}while(0!=--e);return!0}if(m)try{var w=require("worker_threads");if(!w.isMainThread&&null!==w.parentPort){const n=w.parentPort;n.on("message",(function(e){if(void 0!==e?._bcu?.iterations&&void 0!==e?._bcu?.rnd){const t={_bcu:{isPrime:b(e._bcu.rnd,e._bcu.iterations),value:e._bcu.rnd,id:e._bcu.id}};n.postMessage(t)}}))}}catch(n){}var y=require("os");try{var B=require("worker_threads")}catch{}exports.abs=n,exports.bitLength=e,exports.crt=i,exports.eGcd=t,exports.gcd=u,exports.isProbablyPrime=function(n,e=16,t=!1){if("number"==typeof n&&(n=BigInt(n)),n<0n)throw RangeError("w MUST be >= 0");return new Promise(!t&&m?(t,r)=>{const o=new w.Worker(__filename);o.on("message",(n=>{void 0!==n?._bcu?.isPrime&&(o.terminate().catch(r),t(n._bcu.isPrime))})),o.on("error",r);const i={_bcu:{rnd:n,iterations:e,id:0}};o.postMessage(i)}:t=>{t(b(n,e))})},exports.lcm=function(e,t){return"number"==typeof e&&(e=BigInt(e)),"number"==typeof t&&(t=BigInt(t)),0n===e&&0n===t?BigInt(0):n(e/u(e,t)*t)},exports.max=function(n,e){return n>=e?n:e},exports.min=function(n,e){return n>=e?e:n},exports.modAdd=function(n,e){const t=BigInt(e);return r(n.map((n=>BigInt(n)%t)).reduce(((n,e)=>n+e%t),0n),t)},exports.modInv=o,exports.modMultiply=function(n,e){const t=BigInt(e);return r(n.map((n=>BigInt(n)%t)).reduce(((n,e)=>n*e%t),1n),t)},exports.modPow=c,exports.phi=s,exports.prime=function(n,e=16){if(n<1)throw new RangeError("bitLength MUST be > 0");if(!m){let t=0n;do{t=f(h(n,!0))}while(!b(t,e));return new Promise((n=>{n(t)}))}return new Promise(((t,r)=>{const o=[],i=(r,i)=>{if(r._bcu.isPrime){for(let n=0;n<o.length;n++)o[n].terminate();for(;o.length>0;)o.pop();t(r._bcu.value)}else{const t=f(h(n,!0));try{const n={_bcu:{rnd:t,iterations:e,id:r._bcu.id}};i.postMessage(n)}catch(n){}}};for(let n=0;n<y.cpus().length-1;n++){const n=new B.Worker(__filename);n.on("message",(e=>i(e,n))),o.push(n)}for(let t=0;t<o.length;t++)d(n,!0).then((function(n){const r=f(n);o[t].postMessage({_bcu:{rnd:r,iterations:e,id:t}})})).catch(r)}))},exports.primeSync=function(n,e=16){if(n<1)throw new RangeError("bitLength MUST be > 0");let t=0n;do{t=f(h(n,!0))}while(!b(t,e));return t},exports.randBetween=l,exports.randBits=d,exports.randBitsSync=h,exports.randBytes=g,exports.randBytesSync=p,exports.toZn=r;
