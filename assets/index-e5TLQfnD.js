import{r as i,j as t,d as e}from"./index-CHwc8rib.js";import{P as n}from"./ProductGrid-C_3PYOr7.js";const x=()=>{const[o,a]=i.useState([]);return i.useEffect(()=>{const c=Array.from({length:20},(r,s)=>({id:s+1,title:`Product ${s+1}`,price:Math.floor(Math.random()*100)+10,image:`https://via.placeholder.com/300?text=Product+${s+1}`,category:["Electronics","Clothing","Home","Books"][Math.floor(Math.random()*4)]})),l=JSON.parse(localStorage.getItem("wishlist")||"[]"),d=c.filter(r=>l.includes(r.id));a(d)},[]),t.jsxs(h,{children:[t.jsx("h1",{children:"My Wishlist"}),o.length===0?t.jsx(m,{children:"Your wishlist is empty."}):t.jsx(n,{products:o})]})},h=e.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
`,m=e.div`
  text-align: center;
  color: #888;
  margin: 40px 0;
`;export{x as default};
