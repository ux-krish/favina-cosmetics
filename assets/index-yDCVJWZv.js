import{a as l,e as c,j as t,B as p,L as a,f as x,C as h,g as u,h as m,d as n}from"./index-D7LUjQTs.js";const w=()=>{const o=l(),{items:i}=c(e=>e.cart),s=i.reduce((e,r)=>e+r.price*r.quantity,0);return i.length===0?t.jsxs(v,{children:[t.jsx("h2",{children:"Your Cart is Empty"}),t.jsx("p",{children:"Looks like you haven't added anything to your cart yet"}),t.jsx(p,{as:a,to:"/products",children:"Continue Shopping"})]}):t.jsxs(g,{children:[t.jsxs(j,{children:[t.jsxs("h2",{children:["Your Cart (",i.length,")"]}),t.jsx(C,{onClick:()=>o(x()),"data-tooltip":"Clear all items from cart",children:"Clear Cart"})]}),t.jsx(f,{children:i.map(e=>t.jsx(h,{item:e,onRemove:()=>o(m(e.id)),onQuantityChange:r=>o(u({id:e.id,quantity:r}))},e.id))}),t.jsxs(y,{children:[t.jsxs(d,{children:[t.jsx("span",{children:"Subtotal"}),t.jsxs("span",{children:["$",s.toFixed(2)]})]}),t.jsxs(d,{children:[t.jsx("span",{children:"Shipping"}),t.jsx("span",{children:"Free"})]}),t.jsxs(d,{total:!0,children:[t.jsx("span",{children:"Total"}),t.jsxs("span",{children:["$",s.toFixed(2)]})]}),t.jsx(p,{as:a,to:"/checkout",fullWidth:!0,tooltip:"Proceed to Checkout",children:"Proceed to Checkout"}),t.jsx(b,{as:a,to:"/products","data-tooltip":"Continue shopping",children:"Continue Shopping"})]})]})},g=n.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`,j=n.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`,C=n.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: #333;
    text-decoration: underline;
  }
`,f=n.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-column: 1;
  }
`,y=n.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (min-width: 768px) {
    grid-column: 2;
    position: sticky;
    top: 20px;
  }
`,d=n.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-weight: ${o=>o.total?"bold":"normal"};
  font-size: ${o=>o.total?"18px":"16px"};
  border-top: ${o=>o.total?"1px solid #ddd":"none"};
  margin-top: ${o=>o.total?"10px":"0"};
  padding-top: ${o=>o.total?"10px":"0"};
`,b=n(a)`
  text-align: center;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`,v=n.div`
  text-align: center;
  padding: 40px 20px;
  max-width: 500px;
  margin: 0 auto;
  
  h2 {
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
`;export{w as default};
