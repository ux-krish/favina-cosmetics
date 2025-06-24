import{j as e,p as c,L as i,d as r}from"./index-RwLj0z44.js";import{P as d}from"./ProductGrid-BBh2FSkA.js";const p=[{key:"makeup",name:"Makeup",banner:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",description:"Explore our wide range of makeup products for every occasion."},{key:"haircare",name:"Haircare",banner:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",description:"Nourish and style your hair with our premium haircare collection."},{key:"fragrance",name:"Fragrance",banner:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",description:"Discover signature scents and perfumes for every mood."},{key:"skincare",name:"Skincare",banner:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",description:"Pamper your skin with our effective skincare essentials."}],j=()=>{const n=c.products||[];return e.jsxs(l,{children:[e.jsx(x,{children:"All Categories"}),e.jsx(m,{children:p.map((o,a)=>{const s=n.filter(t=>t.category&&t.category.toLowerCase()===o.key).slice(0,4);return e.jsxs(f,{$even:a%2===1,children:[e.jsx(g,{style:{backgroundImage:`url(${o.banner})`},children:e.jsxs(u,{children:[e.jsx(h,{children:e.jsx(i,{to:`/category/${o.key}`,children:o.name})}),e.jsx(y,{children:o.description})]})}),e.jsxs(k,{children:[e.jsx(d,{products:s}),e.jsxs(b,{to:`/category/${o.key}`,children:["View all ",o.name," products →"]})]})]},o.key)})})]})},l=r.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`,x=r.h1`
  text-align: center;
  margin-bottom: 50px;
  font-size: 2.5rem;
  letter-spacing: 1px;
  color: #222;
`,m=r.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`,f=r.section`
  display: flex;
  flex-direction: ${({$even:n})=>n?"row-reverse":"row"};
  gap: 40px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 24px;
  }
`,g=r.div`
  flex: 1;
  min-width: 320px;
  height: 220px;
  background-size: cover;
  background-position: center;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
`,u=r.div`
  width: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 100%);
  padding: 30px 28px 24px 28px;
  border-radius: 0 0 14px 14px;
  color: #fff;
`,h=r.h2`
  font-size: 2rem;
  margin: 0 0 10px 0;
  font-weight: bold;
  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: #e74c3c;
      text-decoration: underline;
    }
  }
`,y=r.p`
  font-size: 1.1rem;
  margin: 0;
  color: #f5f5f5;
`,k=r.div`
  flex: 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`,b=r(i)`
  display: inline-block;
  margin-top: 10px;
  color: #e74c3c;
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;export{j as default};
