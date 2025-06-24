import{j as e,d as t,r as a,p,B as f}from"./index-CHwc8rib.js";import{P as m}from"./ProductGrid-C_3PYOr7.js";import{S as u,P as w,a as b}from"./pagination-DM4-F6wJ.js";const j=({testimonials:i=[],title:d="What Our Customers Say",loop:l=!0,autoplay:x=!0})=>i.length?e.jsxs(v,{children:[e.jsx(y,{children:d}),e.jsx(u,{modules:[w],spaceBetween:24,slidesPerView:4,pagination:{clickable:!0},breakpoints:{0:{slidesPerView:1},480:{slidesPerView:2},900:{slidesPerView:4}},style:{paddingBottom:40},loop:l,speed:600,autoplay:x?{delay:3500,disableOnInteraction:!1}:!1,children:i.map((o,c)=>e.jsx(b,{children:e.jsxs(P,{children:[e.jsx(T,{src:o.avatar,alt:o.name}),e.jsxs(S,{children:['"',o.text,'"']}),e.jsxs(k,{children:["- ",o.name,o.category&&` (${o.category})`]})]})},c))})]}):null,v=t.section`
  max-width: 1320px;
  margin: 50px auto 0 auto;
  padding: 30px 20px;
  overflow: hidden;
  width: 100%;
`,y=t.h3`
  font-size: 24px;
  color: #e74c3c;
  margin-bottom: 18px;
  text-align: center;
`,P=t.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: center;
  text-align: center;
  background: #fff;
  border-radius: 10px;
  padding: 24px 16px 18px 16px;
  min-height: 220px;
  height: 220px;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.08);
`,T=t.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 18px;
  border: 2px solid #e74c3c;
  display: block;
  margin-left: auto;
  margin-right: auto;
`,S=t.div`
  font-size: 16px;
  color: #444;
  margin-bottom: 12px;
  font-style: italic;
`,k=t.div`
  font-size: 15px;
  color: #e74c3c;
  font-weight: 500;
`,z="/favina-cosmetics/assets/Banner-3yRzI3qQ.jpg",O="/favina-cosmetics/assets/main-bg1-D7WuQl3P.png",h=[{text:"Limited Time Only",highlight:!0},{text:"Flat 30% Off",highlight:!1},{text:"Free Gift Inside",highlight:!0},{text:"Hot Deal Alert",highlight:!1},{text:"Exclusive Online Offer",highlight:!0},{text:"Glow & Save",highlight:!1}],re=()=>{const[i,d]=a.useState([]),[l,x]=a.useState([]),[o,c]=a.useState(!0);return a.useEffect(()=>{d(p.products||[]);const r=[];(p.products||[]).forEach(n=>{n.testimonials&&n.testimonials.length>0&&n.testimonials.forEach(g=>r.push({...g,productId:n.id,productTitle:n.title,category:n.category}))}),x(r),c(!1)},[]),o?e.jsx("div",{children:"Loading..."}):e.jsxs(e.Fragment,{children:[e.jsx(H,{children:e.jsx(s,{children:e.jsxs(F,{children:[e.jsxs(B,{children:["Unleash Your ",e.jsx(I,{children:"Natural Glow"})]}),e.jsx(E,{children:"Discover skincare and makeup that loves you back."}),e.jsxs(G,{children:[e.jsx(D,{children:"Get 25% OFF"}),e.jsx(L,{children:"on your first purchase!"})]}),e.jsx(N,{to:"/products",children:"Shop Now"})]})})}),e.jsx(C,{children:e.jsx(s,{children:e.jsx(U,{children:e.jsx(V,{children:[...h,...h].map((r,n)=>e.jsx(M,{$highlight:r.highlight,children:r.text},n))})})})}),e.jsx(s,{children:e.jsxs(R,{children:[e.jsx(W,{src:O,alt:"Limited Edition Unlimited Glam"}),e.jsxs(A,{children:[e.jsxs(Q,{children:[e.jsx(X,{children:"Limited Edition"}),e.jsx(q,{children:"Unlimited Glam"})]}),e.jsx(Y,{children:"Unveil your beauty with our exclusive launch offer on premium nail polish shades."}),e.jsxs(J,{children:[e.jsx(K,{children:"Flat"}),e.jsx(Z,{children:"30% OFF"})]}),e.jsxs(_,{children:["on your first purchase",e.jsx("br",{}),"for the next ",e.jsx(ee,{children:"24 hours"})," only!"]}),e.jsx(te,{to:"/products",children:"Shop Now"})]})]})}),e.jsx($,{children:e.jsxs(s,{children:[e.jsx("h2",{children:"Featured Products"}),e.jsx(m,{products:i.slice(0,8)})]})}),e.jsx(j,{testimonials:l})]})},s=t.div`
  max-width: 1320px;
  width: 100%;
  margin: 0 auto;
  padding: 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  & > * {
    flex: 1;
    width: 100%;
   }
`,H=t.section`
  overflow: hidden;
  width: 100%;
  min-height: 40vh;
  padding: 100px 30px 100px;
  background: url(${z}) center center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 900px) {
    padding-top:50px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 200px;
    min-height: 420px;
    justify-content: center;
    background-position: center;
  }
`,F=t.div`
  max-width: 480px;
  border-radius: 12px;
  padding: 48px 0 40px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 600px) {
    padding: 28px 0 24px 0;
    max-width: 100%;
  }
`,B=t.h1`
  font-size: 48px;
  font-weight: 700;
  color: #5b4a44;
  margin: 0 0 12px 0;
  line-height: 1.1;
  letter-spacing: -1px;
  @media (max-width: 600px) {
    font-size: 32px;
  }
`,I=t.span`
  color: #e5a6a6;
`,E=t.p`
  font-size: 22px;
  color: #5b4a44;
  margin: 0 0 18px 0;
  font-weight: 400;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`,G=t.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
`,D=t.span`
  background: #c8bfe7;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  border-radius: 7px;
  padding: 7px 22px;
  display: inline-block;
  margin-right: 8px;
`,L=t.span`
  color: #5b4a44;
  font-size: 18px;
  font-weight: 400;
`,N=t(f)`
  margin-top: 10px;
  font-size: 20px;
  font-weight: 700;
  padding: 12px 38px;
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  background: #fff;
  color: #5b4a44;
  border: none;
  &:hover {
    background: #f7f7f7;
    color: #e5a6a6;
  }
`,$=t.section`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 32px;
    width: 100%;
  }
`,C=t.div`
  width: 100%;
  margin: 0 0 32px 0;
  overflow: hidden;
  background: #fff;
  display: flex;
  justify-content: center;
  padding: 30px 0;
`,U=t.div`
  width: 100vw;
  max-width: 1320px;
  overflow: hidden;
  position: relative;
  height: 54px;
  display: flex;
  align-items: center;
`,V=t.div`
  display: flex;
  align-items: center;
  animation: scrollTextSlider 22s linear infinite;
  @keyframes scrollTextSlider {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`,M=t.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({$highlight:i})=>i?"#f7b7a3":"#5b4a44"};
  margin: 0 60px;
  font-family: 'Montserrat', sans-serif;
  opacity: ${({$highlight:i})=>i?1:.85};
  transition: color 0.2s;
  white-space: nowrap;
  letter-spacing: -1px;
  @media (max-width: 700px) {
    font-size: 1.1rem;
    margin: 0 24px;
  }
`,R=t.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto 40px auto;
  display: flex;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 18px rgba(0,0,0,0.06);
  overflow: hidden;
  min-height: 380px;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
  }
`,W=t.img`
  flex: 1;
  min-width: 320px;
  object-fit: cover;
  background: #f9f9f9;
  @media (max-width: 900px) {
    width: 100%;
    height: 180px;
    min-width: 0;
  }
`,A=t.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 48px 48px 48px;
  background: #fff;
  @media (max-width: 900px) {
    padding: 28px 18px;
  }
`,Q=t.div`
  font-size: 2.3rem;
  font-weight: 900;
  margin-bottom: 10px;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  gap: 0;
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`,X=t.span`
  color: #e5a6a6;
  font-weight: 900;
  font-family: 'Montserrat', sans-serif;
`,q=t.span`
  color: #b49be0;
  font-weight: 900;
  margin-top: -2px;
`,Y=t.div`
  font-size: 18px;
  color: #444;
  margin-bottom: 18px;
  max-width: 480px;
  font-weight: 400;
`,J=t.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: #222;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
`,K=t.span`
  font-weight: 900;
  color: #222;
`,Z=t.span`
  color: #e5a6a6;
  font-weight: 900;
  margin-left: 8px;
`,_=t.div`
  font-size: 18px;
  color: #444;
  margin-bottom: 22px;
  b {
    color: #222;
    font-weight: 700;
  }
`,ee=t.span`
  color: #b49be0;
  font-weight: 700;
`,te=t(f)`
  margin-top: 18px;
  min-width: 140px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 7px;
  background: #fff;
  color: #5b4a44;
  border: 1.5px solid #e5a6a6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  &:hover {
    background: #f7f7f7;
    color: #e5a6a6;
    border-color: #e5a6a6;
  }
`;export{re as default};
