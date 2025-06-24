import{j as e,p as s,L as n,d as t}from"./index-CPOJE-Ok.js";import{P as c}from"./ProductGrid-DhlI524P.js";const d=[{key:"makeup",name:"Makeup",banner:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80"},{key:"haircare",name:"Haircare",banner:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80"},{key:"fragrance",name:"Fragrance",banner:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"},{key:"skincare",name:"Skincare",banner:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"}],b=()=>{const a=s.products||[];return e.jsxs(p,{children:[e.jsx("h1",{style:{textAlign:"center",marginBottom:40},children:"Shop by Category"}),d.map(o=>{const i=a.filter(r=>r.category&&r.category.toLowerCase()===o.key).slice(0,4);return e.jsxs(l,{children:[e.jsx(g,{style:{backgroundImage:`url(${o.banner})`},children:e.jsx(h,{children:e.jsx(m,{children:e.jsx(n,{to:`/category/${o.key}`,children:o.name})})})}),e.jsx(c,{products:i}),e.jsxs(x,{to:`/category/${o.key}`,children:["View all ",o.name," products →"]})]},o.key)})]})},p=t.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
`,l=t.section`
  margin-bottom: 60px;
`,g=t.div`
  width: 100%;
  height: 220px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
`,h=t.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 100%);
  display: flex;
  align-items: flex-end;
  padding: 30px;
`,m=t.h2`
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);

  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      color: #e74c3c;
    }
  }
`,x=t(n)`
  display: inline-block;
  margin-top: 10px;
  color: #e74c3c;
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;export{b as default};
