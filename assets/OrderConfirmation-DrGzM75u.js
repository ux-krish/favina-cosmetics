import{u as p,r as d,j as s,B as n,L as i,d as t}from"./index-RwLj0z44.js";const O=()=>{const{orderId:o}=p(),[e,c]=d.useState(null);return d.useEffect(()=>{const x=JSON.parse(localStorage.getItem("orders")||"[]").find(l=>l.id===o);c(x||null)},[o]),e?s.jsxs(a,{children:[s.jsx("h1",{children:"Order Confirmed!"}),s.jsxs(u,{children:["Order #",e.id]}),s.jsxs(f,{children:[s.jsx("strong",{children:"Status:"})," ",e.status==="pending"?"Processing":e.status]}),s.jsxs(h,{children:[s.jsx("h3",{children:"Products"}),s.jsx(g,{children:e.items.map(r=>s.jsxs(j,{children:[s.jsx(m,{src:r.image,alt:r.title}),s.jsxs(b,{children:[s.jsx("div",{children:r.title}),s.jsxs("div",{children:["Qty: ",r.quantity]}),s.jsxs("div",{children:["$",(r.price*r.quantity).toFixed(2)]})]})]},r.id))}),s.jsxs(v,{children:[s.jsx("span",{children:"Total:"}),s.jsxs("span",{children:["$",e.total.toFixed(2)]})]})]}),s.jsx(n,{as:i,to:"/account/orders",style:{marginTop:30},children:"View My Orders"})]}):s.jsxs(a,{children:[s.jsx("h2",{children:"Order Not Found"}),s.jsx(n,{as:i,to:"/products",children:"Shop Now"})]})},a=t.div`
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  padding: 30px 20px;
  text-align: center;
`,u=t.div`
  font-size: 18px;
  color: #888;
  margin-bottom: 10px;
`,f=t.div`
  font-size: 16px;
  color: #27ae60;
  margin-bottom: 20px;
`,h=t.div`
  margin: 30px 0 20px 0;
  text-align: left;
`,g=t.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`,j=t.div`
  display: flex;
  gap: 18px;
  align-items: center;
`,m=t.img`
  width: 56px;
  height: 56px;
  border-radius: 6px;
  object-fit: cover;
  background: #f5f5f5;
`,b=t.div`
  flex: 1;
  font-size: 15px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 2px;
`,v=t.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 12px;
`;export{O as default};
