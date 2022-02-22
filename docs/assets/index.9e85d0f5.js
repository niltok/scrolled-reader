var ce=Object.defineProperty,ue=Object.defineProperties;var le=Object.getOwnPropertyDescriptors;var Q=Object.getOwnPropertySymbols;var fe=Object.prototype.hasOwnProperty,de=Object.prototype.propertyIsEnumerable;var P=(e,t,n)=>t in e?ce(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,E=(e,t)=>{for(var n in t||(t={}))fe.call(t,n)&&P(e,n,t[n]);if(Q)for(var n of Q(t))de.call(t,n)&&P(e,n,t[n]);return e},R=(e,t)=>ue(e,le(t));var T=(e,t,n)=>(P(e,typeof t!="symbol"?t+"":t,n),n);import{L as b,D as pe,j as W,M as O,R as X,B as he,d as z,a as G,r as h,u as me,b as ge,c as ve,e as ye,f as be,g as we,h as V}from"./vendor.6ab4cc94.js";const xe=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerpolicy&&(s.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?s.credentials="include":o.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}};xe();function J(){const e=URL.createObjectURL(new Blob),t=e.toString();return URL.revokeObjectURL(e),t.slice(t.lastIndexOf("/")+1)}async function Le(e){return b(await Promise.all(e))}function ke({path:e,root:t}){return t?"/"+e.join("/"):e.join("/")}class Ee extends pe{constructor(){super("Book");T(this,"kv");T(this,"bookKeys");T(this,"books");T(this,"session");this.version(1).stores({kv:"key",bookKeys:"id",books:"id",session:"id"})}}const H=new Ee,I=H.books,Z=H.bookKeys,j=H.session,a=W.exports.jsx,U=W.exports.jsxs,{useState:A}=X;function ee(e,t,n){const r=e.nodeName.toLowerCase(),o=s=>ke({path:t.path.concat(b(s.split("/"))),root:t.root});return{label:r=="image"?"img":r,data:r=="img"?e.src:r=="a"?e.href:r=="image"?o(e.href.baseVal):void 0,content:e.childElementCount?Array.from(e.children).map(s=>ee(s,t)):e.textContent?e.textContent:void 0}}function te(e,t){return e.map(n=>{const r=n.label,o=n.href.split("#")[0].split("?")[0];return{label:r,pos:t.get(o)||0,sub:n.subitems?te(b(n.subitems),t):void 0}}).toArray()}async function Re(e,t){return(await Le(e.map(async n=>{const r=n.href||n.url;if(r==null)return;const o={path:b(r.split("/")).pop(),root:r.length>0&&r[0]=="/"};let c=(await t.load(r)).body;for(;c.childElementCount==1&&c.firstElementChild.childElementCount;)c=c.firstElementChild;const i=Array.from(c.children).map(u=>ee(u,o));return{href:r,elem:i}}))).reduce((n,r)=>{if(!r)return n;const o=n.elem.length;return{table:n.table.set(r.href,o),elem:n.elem.concat(r.elem)}},{table:O(),elem:new Array})}async function D(e,t){if(!!e)try{const n=new URL(e);return n.host==location.host?await t(n.pathname.slice(1)):e}catch(n){return console.log(n),await t(e.split("#")[0].split("?")[0])}}async function ne(e,t){let n=O();for(const r of e){if(r.label=="img"){const o=await D(r.data,async c=>c);if(!o)continue;const s=await t.archive.request(t.resolve(o),"blob");n=n.set(o,s)}typeof r.content=="object"&&(n=n.merge(await ne(r.content,t)))}return n}async function oe(e,t,n){return await Promise.all(e.map(async o=>{const s=o.label=="img"?await D(o.data,async i=>i).catch(()=>o.data):o.label=="a"?await D(o.data,async i=>"pos://"+t.get(i)):void 0,c=typeof o.content=="object"?await oe(o.content,t):o.content;return R(E({},o),{data:s,content:c})}))}async function F(e,t,n){const r=new he;await r.open(e,"epub"),console.log(r);const o=await r.loaded.metadata,s=await r.loaded.navigation,c=await r.loaded.spine,i=await Re(b(c.items),r),u=await oe(i.elem,i.table),f=(await ne(u,r)).toObject(),C=te(b(s.toc),i.table),S=J(),L=o.title||n;I.add({id:S,title:L,elem:u,menu:C,pic:f}),Z.add({id:S,title:L}),t("Successfully imported "+L),t("Book ID: "+S)}function Se(){const e=z.exports.useLiveQuery(()=>j.toArray());return a("ul",{children:e==null?void 0:e.map((t,n)=>a("li",{children:a(G,{to:`view/${t.id}`,children:"[ "+t.pos+" / "+t.size+" ] -> "+t.name})},n))})}function Te(){const e=z.exports.useLiveQuery(()=>Z.toArray());return a("ul",{children:e==null?void 0:e.map((t,n)=>a("li",{children:a(G,{to:`view/${J()}?book=${t.id}`,children:t.title})},n))})}function je(){const[e,t]=A(""),[n,r]=A(b()),[o,s]=A("Sessions"),c=O({Sessions:a(Se,{}),Books:a(Te,{})}),i=u=>r(f=>f.push(u));return U("div",{style:{margin:"100px auto",width:"90%",maxWidth:"650px"},children:[U("p",{style:{display:"flex"},children:[U("span",{children:[a("input",{type:"text",value:e,onChange:u=>t(u.target.value)}),a("button",{onClick:()=>F(e,i,e),children:"Import from URL"})]}),a("span",{children:a("input",{title:" ",type:"file",accept:".epub",onChange:u=>{const f=u.target.files;f&&f.length>0&&F(URL.createObjectURL(f[0]),i,f[0].name)}})})]}),a("div",{children:n.map((u,f)=>a("p",{children:u},f))}),a("p",{children:c.keySeq().map(u=>a("button",{onClick:()=>s(u),children:u},u))}),c.get(o)]})}function Oe(e,t){const[n,r]=h.exports.useState(void 0);return h.exports.useEffect(()=>{(async()=>{const o=await j.get(e);if(o)return o;if(!t)return null;const s=await I.get(t);return s?(await j.put({id:e,name:s.title,size:s.elem.length,book:t,pos:0,per:0,timestamp:Date.now()}),await j.get(e)):null})().then(o=>{o&&r(o)})},[e,t]),h.exports.useEffect(()=>{n&&j.put(R(E({},n),{timestamp:Date.now()}))},[n]),[n,r]}function re(e,t,n,r,o){var s;return ve.createElement(e.label,{key:r,ref:o,src:e.label=="img"?t.get(e.data):void 0,href:e.label=="a"?"#":void 0,onClick:e.label=="a"?c=>{c.preventDefault(),n(parseInt(e.data.slice(6)))}:void 0},typeof e.content=="string"?e.content:(s=e.content)==null?void 0:s.map((c,i)=>re(c,t,n,i)))}function Ce(){var q;const[e,t]=h.exports.useState(1),r=me().id,[o,s]=ge(),c=o.get("book"),[i,u]=Oe(r,c),f=z.exports.useLiveQuery(async()=>{if(!!i)return I.get(i.book)},[i==null?void 0:i.book]),[C,S]=h.exports.useState(10),[L,se]=i&&f?[Math.max(0,i.pos-C),Math.min(i.pos+C,f.elem.length-1)]:[0,0],B=f?f.elem.slice(L,se+1):void 0;let w=b();const[_,ie]=h.exports.useState(0),m=h.exports.useRef(null),K=h.exports.useRef(null),[ae,M]=h.exports.useState(0);async function N(g){let y=Math.max(0,_+g);for(let l=0;l<w.size-1;l++){const d=w.get(l),v=w.get(l+1);if(!d||!v)return;if(y<v.offsetTop){u(k=>k&&R(E({},k),{pos:L+l,per:(y-d.offsetTop)/(v.offsetTop-d.offsetTop)}));return}}const p=w.last();!p||u(l=>l&&R(E({},l),{pos:L+w.size-1,per:Math.min(1,(y-p.offsetTop)/p.offsetHeight)}))}const $=()=>{var v;if(!i)return;const g=i.pos-L,y=((v=K.current)==null?void 0:v.offsetHeight)||0;y==0?t(k=>k+1):t(0),e==0&&y<m.current.offsetHeight*2&&S(k=>k+5);const p=w.get(g),l=w.get(g+1);if(!p)return;const d=p.offsetTop+i.per*(l?l.offsetTop-p.offsetTop:p.offsetHeight);ie(d)};h.exports.useEffect($);const x=h.exports.useRef({id:null,x:0,y:0});h.exports.useEffect(()=>{function g(d){N(d.deltaY)}function y(d){x.current.id||(M(0),x.current.id=d.changedTouches[0].identifier,x.current.x=d.changedTouches[0].screenX,x.current.y=d.changedTouches[0].screenY)}function p(d){d.preventDefault(),b(d.changedTouches).forEach(v=>{v.identifier==x.current.id&&M(x.current.y-v.screenY)})}function l(d){b(d.changedTouches).forEach(v=>{v.identifier==x.current.id&&(x.current.id=null,N(x.current.y-v.screenY).then(()=>{$(),M(0)}))})}return m.current&&(m.current.addEventListener("wheel",g,{passive:!0}),m.current.addEventListener("touchstart",y,{passive:!0}),m.current.addEventListener("touchmove",p),m.current.addEventListener("touchend",l,{passive:!0})),()=>{!m.current||(m.current.removeEventListener("wheel",g),m.current.removeEventListener("touchstart",y),m.current.removeEventListener("touchmove",p),m.current.removeEventListener("touchend",l))}});const Y=h.exports.useMemo(()=>f?O(f.pic).map(g=>URL.createObjectURL(g)):O(),[f]);return h.exports.useEffect(()=>()=>{Y.forEach(g=>URL.revokeObjectURL(g))},[]),i===null?a("div",{children:"Bad Parameters"}):a("div",{ref:m,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden"},children:a("div",{ref:K,className:"viewer",style:{position:"relative",top:(((q=m.current)==null?void 0:q.offsetHeight)||0)/2-_-ae},children:B==null?void 0:B.map((g,y)=>re(g,Y,p=>u(l=>l&&R(E({},l),{pos:p,per:0})),y,p=>{w=w.push(p)}))})})}const{StrictMode:Ue}=X;function Be(){return a(be,{basename:"/",children:U(we,{children:[a(V,{path:"/",element:a(je,{})}),a(V,{path:"/view/:id",element:a(Ce,{})})]})})}ye.exports.render(a(Ue,{children:a(Be,{})}),document.getElementById("root"));
