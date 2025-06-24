import{r as o,c as m,j as s,d as r}from"./index-CPOJE-Ok.js";import{P as h}from"./ProductGrid-DhlI524P.js";const f=()=>{const[i,c]=o.useState([]),a=m();return o.useEffect(()=>{const l=Array.from({length:20},(t,e)=>({id:e+1,title:`Product ${e+1}`,price:Math.floor(Math.random()*100)+10,image:`https://via.placeholder.com/300?text=Product+${e+1}`,category:["Electronics","Clothing","Home","Books"][Math.floor(Math.random()*4)]})),d=JSON.parse(localStorage.getItem("wishlist")||"[]"),n=l.filter(t=>d.includes(t.id)).map(t=>({...t,image:t.image&&!t.image.includes("/")&&t.image?`${a}/${t.image}`:t.image}));c(n)},[a]),s.jsxs(g,{children:[s.jsx("h1",{children:"My Wishlist"}),i.length===0?s.jsx(u,{children:"Your wishlist is empty."}):s.jsx(h,{products:i})]})},g=r.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
`,u=r.div`
  text-align: center;
  color: #888;
  margin: 40px 0;
`;export{f as default};
