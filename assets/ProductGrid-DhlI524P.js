import{a as k,r as d,c as P,j as t,F as m,o as z,L as w,d as i,e as C}from"./index-CPOJE-Ok.js";const R=({product:e})=>{const n=k(),[l,f]=d.useState([]),c=l.includes(e.id),[p,a]=d.useState(null),y=P();d.useEffect(()=>{const o=JSON.parse(localStorage.getItem("wishlist")||"[]");f(o)},[]);const g=o=>{o.stopPropagation();let r,x;c?(r=l.filter(v=>v!==e.id),x="Removed from wishlist"):(r=[...l,e.id],x="Added to wishlist"),f(r),localStorage.setItem("wishlist",JSON.stringify(r)),a(x),setTimeout(()=>a(null),1500)},j=()=>{n(C({...e,quantity:1})),a("Added to cart"),setTimeout(()=>a(null),1500)};d.useEffect(()=>{if(!p)return;const o=document.createElement("div");return o.className="global-toast-message",o.textContent=p,document.body.appendChild(o),setTimeout(()=>{o.classList.add("hide")},1200),setTimeout(()=>{o.parentNode&&document.body.removeChild(o)},1500),()=>{o.parentNode&&document.body.removeChild(o)}},[p]);const h=e.offerPrice&&e.offerPrice<e.price?Math.round((e.price-e.offerPrice)/e.price*100):null;let s=e.image;return s&&!s.includes("/")&&s&&(s=`${y}/${s}`),t.jsxs(I,{children:[t.jsxs(S,{children:[t.jsx(G,{"aria-label":"Add to wishlist",wished:c?1:0,onClick:g,children:t.jsx(m,{})}),t.jsx(T,{src:s,alt:e.title})]}),t.jsxs(A,{children:[t.jsx(F,{title:e.title,children:e.title}),t.jsxs($,{children:[t.jsx(B,{children:"★"}),t.jsx(E,{children:e.rating?e.rating.toFixed(1):"4.0"})]}),t.jsxs(X,{children:[t.jsx(O,{children:"80g"}),h&&t.jsxs(M,{children:[h,"% Off"]})]}),t.jsx(N,{children:e.offerPrice&&e.offerPrice<e.price?t.jsxs(t.Fragment,{children:[t.jsxs(W,{children:["MRP: ",t.jsxs(D,{children:["$",e.price.toFixed(0)]})]}),t.jsxs(u,{children:["$",e.offerPrice.toFixed(0)]})]}):t.jsxs(u,{children:["$",e.price.toFixed(0)]})})]}),t.jsxs(L,{children:[t.jsx(b,{"aria-label":"Add to wishlist",wished:c?1:0,onClick:g,style:{display:"none"},children:t.jsx(m,{})}),t.jsx(b,{"aria-label":"Add to cart",onClick:j,children:t.jsx(z,{})}),t.jsx(V,{as:w,to:`/products/${e.id}`,children:"View Product"})]})]})},I=i.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.10);
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  position: relative;
  min-width: 0;
  transition: box-shadow 0.18s, transform 0.18s;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    transform: translateY(-2px) scale(1.01);
  }
`,S=i.div`
  width: 100%;
  aspect-ratio:1/1;
  background: #fff;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
  padding-top: 18px;
`,T=i.img`
  aspect-ratio:1/1;
  width: 100%;
  object-fit: contain;
  margin-bottom: 0;
  margin-top: auto;
  display: block;
`,A=i.div`
  padding: 12px 18px 0 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 auto;
`,F=i.h3`
  font-size: 15px;
  margin: 0 0 2px 0;
  font-weight: 500;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,$=i.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  margin-bottom: 2px;
`,B=i.span`
  color: #ffc107;
  font-size: 15px;
`,E=i.span`
  color: #e74c3c;
  font-size: 15px;
  font-weight: 600;
`,X=i.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
`,O=i.span`
  font-size: 13px;
  color: #888;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 2px 8px;
  font-weight: 500;
`,M=i.span`
  font-size: 13px;
  color: #fff;
  background: #e74c3c;
  border-radius: 4px;
  padding: 2px 8px;
  font-weight: 500;
  margin-left: 4px;
`,N=i.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 0 0;
`,W=i.span`
  font-size: 13px;
  color: #888;
`,D=i.span`
  text-decoration: line-through;
  color: #888;
  font-size: 13px;
`,u=i.span`
  color: #222;
  font-size: 18px;
  font-weight: 700;
`,L=i.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px 14px 14px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  border-radius: 0 0 14px 14px;
  margin-top: 10px;
`,b=i.button`
  background: #f7f7f7;
  border: 1.5px solid #eee;
  border-radius: 8px;
  color: ${({wished:e})=>e?"#e74c3c":"#888"};
  font-size: 18px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.18s, border 0.18s, background 0.18s;
  &:hover {
    color: #e74c3c;
    border-color: #e74c3c;
    background: #fff7f5;
  }
`,V=i(w)`
  flex: 1;
  background: #fff;
  color: #222;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  padding: 0 0;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background 0.18s, color 0.18s, border 0.18s;
  &:hover {
    background: #f5f5f5;
    color: #e74c3c;
    border-color: #e74c3c;
  }
`,G=i.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 8px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.18s, transform 0.18s;
  color: ${({wished:e})=>e?"#e74c3c":"#888"};
  &:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
`;if(typeof document<"u"&&!document.getElementById("global-toast-style")){const e=document.createElement("style");e.id="global-toast-style",e.innerHTML=`
    .global-toast-message {
      position: fixed;
      top: 300px;
      right: 0;
      transform: translateX(110%);
      background: #222;
      color: #fff;
      padding: 10px 22px;
      border-radius: 6px 0 0 6px;
      font-size: 14px;
      z-index: 2000;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12);
      animation: slideInRight 1.5s forwards;
      pointer-events: none;
    }
    .global-toast-message.hide {
      animation: slideOutRight 0.3s forwards;
    }
    @keyframes slideInRight {
      0% {
        opacity: 0;
        transform: translateX(110%);
      }
      10% {
        opacity: 1;
        transform: translateX(0%);
      }
      90% {
        opacity: 1;
        transform: translateX(0%);
      }
      100% {
        opacity: 1;
        transform: translateX(0%);
      }
    }
    @keyframes slideOutRight {
      0% {
        opacity: 1;
        transform: translateX(0%);
      }
      100% {
        opacity: 0;
        transform: translateX(110%);
      }
    }
  `,document.head.appendChild(e)}const q=({products:e})=>t.jsx(H,{children:e.map(n=>t.jsx(R,{product:n},n.id))}),H=i.div`
  width: 100%;
  min-width: 100%;
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;export{q as P};
