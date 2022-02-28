var me=Object.defineProperty,ge=Object.defineProperties;var ve=Object.getOwnPropertyDescriptors;var G=Object.getOwnPropertySymbols;var we=Object.prototype.hasOwnProperty,xe=Object.prototype.propertyIsEnumerable;var I=(e,t,n)=>t in e?me(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,j=(e,t)=>{for(var n in t||(t={}))we.call(t,n)&&I(e,n,t[n]);if(G)for(var n of G(t))xe.call(t,n)&&I(e,n,t[n]);return e},U=(e,t)=>ge(e,ve(t));var C=(e,t,n)=>(I(e,typeof t!="symbol"?t+"":t,n),n);import{L as w,D as ye,c as be,s as Le,d as Se,r as u,a as E,B as Ee,M as P,j as A,R as Re,b as te,e as ke,f as Te,u as je,g as Ue,h as Z,i as Ce,S as ze,k as Oe,l as Me,m as ee}from"./vendor.7e21e345.js";const Pe=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const c of o)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const c={};return o.integrity&&(c.integrity=o.integrity),o.referrerpolicy&&(c.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?c.credentials="include":o.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(o){if(o.ep)return;o.ep=!0;const c=n(o);fetch(o.href,c)}};Pe();function ne(){const e=URL.createObjectURL(new Blob),t=e.toString();return URL.revokeObjectURL(e),t.slice(t.lastIndexOf("/")+1)}async function Be(e){return w(await Promise.all(e))}function De({path:e,root:t}){return t?"/"+e.join("/"):e.join("/")}class He extends ye{constructor(){super("Book");C(this,"kv");C(this,"bookKeys");C(this,"books");C(this,"session");this.version(1).stores({kv:"key",bookKeys:"id",books:"id",session:"id"})}}const v=new He,K=v.books,Q=v.bookKeys,z=v.session;async function Ie(e){const t=await v.kv.get(e);return t==null?void 0:t.val}async function Ne(e,t){await v.kv.put({key:e,val:t,timestamp:Date.now()})}const Ae={get:Ie,set:Ne},[Ke,Qe]=be();Ke.pipe(Le((e,t)=>e.timestamp>t.timestamp?e:t),Se());function oe(e,t){const[n,s]=u.exports.useState(t);return u.exports.useEffect(()=>{const o=sessionStorage.getItem(e);o&&s(JSON.parse(o).val)},[e]),u.exports.useEffect(()=>{sessionStorage.setItem(e,JSON.stringify({key:e,val:n}))},[e,n]),[n,s]}function _e(e,t){const[n,s]=u.exports.useState(void 0),o=E.exports.useLiveQuery(()=>z.get(e),[e]);return o&&(!n||o.timestamp>n.timestamp)&&(console.log("db new session",o),s(o)),u.exports.useEffect(()=>{(async()=>{if(await z.get(e)||!t)return;const a=await Q.get(t);if(!a)return null;await z.put({id:e,name:a.title,size:a.size,book:t,pos:0,per:0,timestamp:0})})()},[e,t]),u.exports.useEffect(()=>{n&&(!o||n.timestamp>o.timestamp)&&(z.put(n),Qe(n))},[n,o]),[n,s]}const $e=(e,t)=>{const[n,s]=u.exports.useState(t),[o,c]=u.exports.useState(0),a=E.exports.useLiveQuery(()=>v.kv.get(e),[e]);a&&a.timestamp>o&&(s(a.val),c(a.timestamp)),u.exports.useEffect(()=>{v.transaction("rw",v.kv,async()=>{const d=await v.kv.get(e);(!d||d.timestamp<o)&&await v.kv.put({key:e,val:n,timestamp:o})})},[e,n]);function r(d){s(typeof d=="function"?d(n):d),c(Date.now())}return[n,o,r]};function se(e,t,n){var c;const s=e.nodeName.toLowerCase(),o=a=>De({path:t.path.concat(w(a.split("/"))),root:t.root});return{label:s=="image"?"img":s,data:s=="img"?e.src:s=="a"?e.href:s=="image"?o(e.href.baseVal):void 0,content:e.childNodes.length?(()=>{let a=Array.from(e.childNodes).map(r=>se(r,t)).filter(r=>r.label!="#text"||r.content);return a.length==1&&a[0].label=="#text"?a[0].content:a})():((c=e.textContent)==null?void 0:c.trim())?e.textContent.trim():void 0}}function re(e,t){return e.map(n=>{const s=n.label,o=n.href.split("#")[0].split("?")[0];return{label:s,pos:t.get(o)||0,sub:n.subitems?re(w(n.subitems),t):void 0}}).toArray()}async function Ve(e,t){return(await Be(e.map(async n=>{const s=n.href||n.url;if(s==null)return;const o={path:w(s.split("/")).pop(),root:s.length>0&&s[0]=="/"};let a=(await t.load(s)).body;for(;a.childElementCount==1&&a.firstElementChild.childElementCount;)a=a.firstElementChild;const r=Array.from(a.childNodes).map(d=>se(d,o)).filter(d=>d.label!="#text"||d.content);return{href:s,elem:r}}))).reduce((n,s)=>{if(!s)return n;const o=n.elem.length;return{table:n.table.set(s.href,o),elem:n.elem.concat(s.elem)}},{table:P(),elem:new Array})}async function N(e,t){if(!!e)try{const n=new URL(e);return n.host==location.host?await t(n.pathname.slice(1)):e}catch(n){return console.log(n),await t(e.split("#")[0].split("?")[0])}}async function ie(e,t){let n=w();for(const s of e){if(s.label=="img"){const o=await N(s.data,async a=>a);if(!o)continue;const c=await t.archive.request(t.resolve(o),"blob");n=n.push([o,{type:c.type,data:new Uint8Array(await c.arrayBuffer())}])}typeof s.content=="object"&&(n=n.concat(await ie(s.content,t)))}return n}async function ae(e,t,n){return await Promise.all(e.map(async o=>{const c=o.label=="img"?await N(o.data,async r=>r).catch(()=>o.data):o.label=="a"?await N(o.data,async r=>"pos://"+t.get(r)):void 0,a=typeof o.content=="object"?await ae(o.content,t):o.content;return U(j({},o),{data:c,content:a})}))}async function Fe(e,t,n){const s=new Ee;await s.open(e,"epub"),console.log(s);const o=await s.loaded.metadata,c=await s.loaded.navigation,a=await s.loaded.spine,r=await Ve(w(a.items),s),d=await ae(r.elem,r.table),p=(await ie(d,s)).toArray(),O=re(w(c.toc),r.table),R=ne(),x=(o.title||n).replace(`
`,""),M=d.length;K.add({id:R,title:x,elem:d,menu:O,pic:p,size:M}),Q.add({id:R,title:x,size:M}),t("Successfully imported "+x),t("Book ID: "+R)}const i=A.exports.jsx,L=A.exports.jsxs,ce=A.exports.Fragment;function We({setRemote:e}){const[t,n]=u.exports.useState(""),[s,o]=u.exports.useState(""),[c,a]=u.exports.useState("");let r=!0;try{new URL(t),r=!1}catch{}function d(){r||(new URL(t),e({url:t,auth:{username:s,password:c}}))}return L("div",{children:[i("p",{children:"Server:"}),L("p",{children:[i("input",{type:"url",onChange:p=>n(p.target.value)}),r?"plz enter valid URL":""]}),i("p",{children:"User:"}),i("p",{children:i("input",{type:"text",onChange:p=>o(p.target.value)})}),i("p",{children:"Password:"}),i("p",{children:i("input",{type:"password",onChange:p=>a(p.target.value)})}),i("p",{children:i("button",{onClick:d,children:"Login!"})})]})}function Ye(){const[e,t]=oe("remote");return e?i("div",{children:"Logined"}):i(We,{setRemote:t})}const{useState:B}=Re;function qe(){const e=E.exports.useLiveQuery(()=>z.toArray());return i("ul",{children:e==null?void 0:e.map((t,n)=>i("li",{children:i(te,{to:`view/${t.id}`,children:"[ "+Math.floor(t.pos/t.size*100*10)/10+"% ] -> "+t.name})},n))})}async function Je(e,t){const n=await K.get(t);if(!n)return;const s=ke(n);console.log(s.byteLength),console.log(Te(s));const o=new URL(e.url);await fetch(o.toString(),{method:"POST",headers:{operation:"upload",username:e.auth.username,password:e.auth.password,bid:n.id,title:n.title,size:n.size.toString()},body:s})}function Xe(){const e=E.exports.useLiveQuery(()=>Q.toArray()),[t]=oe("remote");return i("ul",{children:e==null?void 0:e.map((n,s)=>L("li",{children:[t?i("a",{href:"#",onClick:()=>Je(t,n.id),children:"Upload"}):i(ce,{}),i(te,{to:`view/${ne()}?book=${n.id}`,children:n.title})]},s))})}function Ge(){const[e,t,n]=$e("injection",""),[s,o]=B(""),[c,a]=B(0);return t>c&&(o(e),a(t)),L("div",{children:[i("textarea",{value:s,onChange:r=>o(r.target.value),style:{width:"100%",height:"20em",maxWidth:"100%"}}),i("br",{}),i("button",{onClick:()=>{a(Date.now()),n(s)},children:"Save"})]})}function Ze(){return i("div",{children:i("p",{children:i("button",{onClick:()=>{v.delete()},children:"Reset Database"})})})}function et(){const[e,t]=B(w()),[n,s]=B("Sessions"),o=P({Sessions:i(qe,{}),Books:i(Xe,{}),Injection:i(Ge,{}),Remote:i(Ye,{}),Setting:i(Ze,{})});u.exports.useEffect(()=>{document.title="Scrolled Reader"});const c=a=>t(r=>r.push(a));return L("div",{style:{margin:"100px auto",width:"90%",maxWidth:"650px",fontSize:"0.8em"},children:[L("p",{style:{},children:[i("span",{children:"Import .epub: "}),i("span",{children:i("input",{title:" ",type:"file",accept:".epub",onChange:a=>{const r=a.target.files;r&&r.length>0&&Fe(URL.createObjectURL(r[0]),c,r[0].name)}})})]}),i("ul",{style:{fontSize:"11px"},children:e.map((a,r)=>i("li",{children:a},r))}),i("p",{children:o.keySeq().map(a=>i("button",{onClick:()=>s(a),children:a},a))}),o.get(n)]})}function ue(e,t,n,s,o,c){var a;return e.label=="#text"?o?i("p",{ref:o,children:e.content},s):i(Z.Fragment,{children:e.content},s):Z.createElement(e.label,{key:s,ref:o,src:e.label=="img"?t.get(e.data):void 0,href:e.label=="a"?"#":void 0,onClick:e.label=="a"?r=>{r.preventDefault(),n(parseInt(e.data.slice(6)))}:void 0},typeof e.content=="string"?e.content:(a=e.content)==null?void 0:a.map((r,d)=>ue(r,t,n,d)))}function tt(){var X;const[e,t]=u.exports.useState(1),s=je().id,[o,c]=Ue(),a=o.get("book"),[r,d]=_e(s,a),p=E.exports.useLiveQuery(async()=>{if(!!r)return K.get(r.book)},[r==null?void 0:r.book]),[O,R]=u.exports.useState(10),[x,M]=r&&p?[Math.max(0,r.pos-O),Math.min(r.pos+O,p.elem.length-1)]:[0,0],D=p?p.elem.slice(x,M+1):void 0;let y=w();const[_,le]=u.exports.useState(0),m=u.exports.useRef(null),$=u.exports.useRef(null),[de,H]=u.exports.useState(0),[it,pe]=u.exports.useState(0),[at,fe]=u.exports.useState(0);u.exports.useEffect(()=>{function l(){pe(window.innerHeight),fe(window.innerWidth)}return window.addEventListener("resize",l),()=>{window.removeEventListener("resize",l)}});function V(l){let h=Math.max(0,_+l);for(let f=0;f<y.size-1;f++){const k=y.get(f),S=y.get(f+1);if(!k||!S)return;if(h<S.offsetTop){d(T=>T&&U(j({},T),{pos:x+f,per:(h-k.offsetTop)/(S.offsetTop-k.offsetTop),timestamp:Date.now()}));return}}const g=y.last();!g||d(f=>f&&U(j({},f),{pos:x+y.size-1,per:Math.min(1,(h-g.offsetTop)/g.offsetHeight),timestamp:Date.now()}))}const he=()=>{var S;if(!r)return;const l=r.pos-x,h=((S=$.current)==null?void 0:S.offsetHeight)||0;if(h==0)return;t(0),e==0&&h<m.current.offsetHeight*3&&R(T=>T+5);const g=y.get(l),f=y.get(l+1);if(!g)return;const k=g.offsetTop+r.per*(f?f.offsetTop-g.offsetTop:g.offsetHeight);le(k)};u.exports.useEffect(he);const b=u.exports.useRef({id:null,x:0,y:0});function F(l){V(l.deltaY)}function W(l){b.current.id||(H(0),b.current.id=l.changedTouches[0].identifier,b.current.x=l.changedTouches[0].screenX,b.current.y=l.changedTouches[0].screenY)}function Y(l){l.preventDefault(),w(l.changedTouches).forEach(h=>{h.identifier==b.current.id&&H(b.current.y-h.screenY)})}function q(l){w(l.changedTouches).forEach(h=>{h.identifier==b.current.id&&(b.current.id=null,V(b.current.y-h.screenY),H(0))})}u.exports.useEffect(()=>(m.current&&(m.current.addEventListener("wheel",F,{passive:!0}),m.current.addEventListener("touchstart",W,{passive:!0}),m.current.addEventListener("touchmove",Y),m.current.addEventListener("touchend",q,{passive:!0})),()=>{!m.current||(m.current.removeEventListener("wheel",F),m.current.removeEventListener("touchstart",W),m.current.removeEventListener("touchmove",Y),m.current.removeEventListener("touchend",q))}));const J=u.exports.useMemo(()=>p?P(p.pic).map(l=>URL.createObjectURL(new Blob([l.data],{type:l.type}))):P(),[p]);return u.exports.useEffect(()=>()=>{J.forEach(l=>URL.revokeObjectURL(l))},[]),u.exports.useEffect(()=>{document.title=(r==null?void 0:r.name)||"Scrolled Reader"},[r==null?void 0:r.name]),!r||!p?i("div",{children:i("p",{children:"Loading..."})}):L("div",{ref:m,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden"},children:[i("div",{style:{position:"relative",left:0,top:"50%",padding:"1em",borderTop:"1px solid #ff000080",fontSize:"0.5em",lineHeight:0,color:"#ff0000"},children:r.pos}),i("div",{ref:$,className:"viewer",style:{position:"relative",top:(((X=m.current)==null?void 0:X.offsetHeight)||0)/2-_-de},children:D==null?void 0:D.map((l,h)=>ue(l,J,g=>d(f=>f&&U(j({},f),{pos:g,per:0,timestamp:Date.now()})),h+x,g=>{g&&(y=y.push(g))}))})]})}function nt(){const e=E.exports.useLiveQuery(()=>Ae.get("injection"));return u.exports.useEffect(()=>{const t=document.head.innerHTML;return e&&(document.head.innerHTML=t+e),()=>{document.head.innerHTML=t}},[e]),i(ce,{})}async function ot(){return await(navigator.storage&&navigator.storage.persist&&navigator.storage.persist())}async function st(){return await(navigator.storage&&navigator.storage.persisted&&navigator.storage.persisted())}function rt(){return u.exports.useEffect(()=>{st().then(e=>{e||ot()})},[]),L(ze,{children:[i(nt,{}),i(Oe,{children:L(Me,{children:[i(ee,{path:"/",element:i(et,{})}),i(ee,{path:"/view/:id",element:i(tt,{})})]})})]})}Ce.exports.render(i(u.exports.StrictMode,{children:i(rt,{})}),document.getElementById("root"));
