import{r as n,p as v,j as e,d as i}from"./index-RwLj0z44.js";import{P as T}from"./ProductGrid-BBh2FSkA.js";const $=["All","Makeup","Skincare","Haircare","Fragrance","Tools"],c=500,a=0,b=9,V=()=>{const[d,P]=n.useState([]),[y,S]=n.useState(!0),[p,C]=n.useState("All"),[t,x]=n.useState([a,c]),[m,M]=n.useState([]),[s,h]=n.useState(1),[u,R]=n.useState("none"),[J,z]=n.useState([]);n.useEffect(()=>{P(v.products||[]),z(v.testimonials||[]),S(!1)},[]),n.useEffect(()=>{t[0]<a&&x([a,t[1]]),t[1]>c&&x([t[0],c]),t[0]>t[1]&&x([t[1],t[1]])},[t[0],t[1]]),n.useEffect(()=>{let o=d;p!=="All"&&(o=o.filter(r=>r.category===p)),o=o.filter(r=>r.price>=Math.min(t[0],t[1])&&r.price<=Math.max(t[0],t[1])),M(o)},[d,p,t]);const l=[...m];u==="lowToHigh"?l.sort((o,r)=>o.price-r.price):u==="highToLow"?l.sort((o,r)=>r.price-o.price):u==="nameAsc"?l.sort((o,r)=>o.title.localeCompare(r.title)):u==="nameDesc"&&l.sort((o,r)=>r.title.localeCompare(o.title));const g=Math.ceil(l.length/b),A=l.slice((s-1)*b,s*b);if(n.useEffect(()=>{h(1)},[p,t]),y)return e.jsx("div",{children:"Loading..."});const E=o=>{const r=Math.min(Number(o.target.value),t[1]-1);x([r,t[1]])},L=o=>{const r=Math.max(Number(o.target.value),t[0]+1);x([t[0],r])};return e.jsxs(D,{children:[e.jsxs(F,{children:[e.jsxs(j,{children:[e.jsx(w,{children:"Category"}),$.map(o=>e.jsxs(H,{children:[e.jsx("input",{type:"radio",id:`cat-${o}`,name:"category",value:o,checked:p===o,onChange:()=>C(o)}),e.jsx("label",{htmlFor:`cat-${o}`,children:o})]},o))]}),e.jsxs(j,{children:[e.jsx(w,{children:"Price Range"}),e.jsxs(I,{children:[e.jsxs(_,{children:[e.jsxs("span",{children:["Min: $",t[0]]}),e.jsxs("span",{children:["Max: $",t[1]]})]}),e.jsxs(N,{children:[e.jsx(O,{style:{left:`${(t[0]-a)/(c-a)*100}%`,width:`${(t[1]-t[0])/(c-a)*100}%`}}),e.jsx(k,{type:"range",min:a,max:t[1]-1,value:t[0],onChange:E,style:{zIndex:t[0]===t[1]?5:3}}),e.jsx(k,{type:"range",min:t[0]+1,max:c,value:t[1],onChange:L,style:{zIndex:4}})]})]})]})]}),e.jsxs(G,{children:[e.jsx(Z,{children:e.jsxs(U,{children:[e.jsxs("div",{children:[e.jsx("h1",{children:"All Cosmetics Products"}),e.jsxs("p",{children:[m.length," products available"]})]}),e.jsxs(W,{children:[e.jsx(X,{htmlFor:"sortOrder",children:"Sort by:"}),e.jsxs(q,{id:"sortOrder",value:u,onChange:o=>R(o.target.value),children:[e.jsx("option",{value:"none",children:"Default"}),e.jsx("option",{value:"lowToHigh",children:"Price: Low to High"}),e.jsx("option",{value:"highToLow",children:"Price: High to Low"}),e.jsx("option",{value:"nameAsc",children:"Name: A to Z"}),e.jsx("option",{value:"nameDesc",children:"Name: Z to A"})]})]})]})}),e.jsx(T,{products:A}),e.jsxs(B,{children:[e.jsx(f,{disabled:s===1,onClick:()=>h(s-1),children:"Prev"}),Array.from({length:g},(o,r)=>e.jsx(f,{active:s===r+1,onClick:()=>h(r+1),children:r+1},r+1)),e.jsx(f,{disabled:s===g||g===0,onClick:()=>h(s+1),children:"Next"})]})]})]})},D=i.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
`,F=i.aside`
  width: 250px;
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #eee;
  height: fit-content;

  @media (max-width: 900px) {
    display: none;
  }
`,j=i.div`
  margin-bottom: 30px;
`,w=i.div`
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
`,H=i.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;

  input[type="radio"] {
    margin-right: 8px;
  }
`,I=i.div`
  margin-top: 10px;
  width: 100%;
  padding: 16px 0 8px 0;
`,N=i.div`
  position: relative;
  height: 6px;
  background: #eee;
  border-radius: 3px;
`,O=i.div`
  position: absolute;
  height: 100%;
  background: #e74c3c;
  border-radius: 3px;
  z-index: 2;
`,k=i.input`
  position: absolute;
  width: 100%;
  height: 24px;
  top: -9px;
  left: 0;
  background: none;
  -webkit-appearance: none;
  z-index: 3;
  pointer-events: auto; /* <-- fix: always allow pointer events */

  &::-webkit-slider-thumb {
    pointer-events: auto;
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #e74c3c;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    margin-top: -7px;
    position: relative;
    transition: border 0.2s;
  }
  &::-webkit-slider-thumb:hover {
    border: 3px solid #c0392b;
  }
  &::-moz-range-thumb {
    pointer-events: auto;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #e74c3c;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    position: relative;
    transition: border 0.2s;
  }
  &::-moz-range-thumb:hover {
    border: 3px solid #c0392b;
  }
  &::-ms-thumb {
    pointer-events: auto;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #e74c3c;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    cursor: pointer;
    position: relative;
    transition: border 0.2s;
  }
  &::-ms-thumb:hover {
    border: 3px solid #c0392b;
  }
  &::-webkit-slider-runnable-track {
    height: 6px;
    background: transparent;
  }
  &::-ms-fill-lower, &::-ms-fill-upper {
    background: transparent;
  }
  &:focus {
    outline: none;
  }
  background: none;
`,_=i.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: #333;
`,G=i.div`
  flex: 1;
`,Z=i.div`
  margin-bottom: 30px;
  
  h1 {
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
  }
`,B=i.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 30px 0 0 0;
`,f=i.button`
  padding: 6px 14px;
  border-radius: 4px;
  border: none;
  background: ${({active:d})=>d?"#e74c3c":"#f0f0f0"};
  color: ${({active:d})=>d?"#fff":"#333"};
  font-weight: 500;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
  &:disabled {
    background: #eee;
    color: #aaa;
    cursor: not-allowed;
  }
`,U=i.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  flex-wrap: wrap;
  gap: 20px;
`,W=i.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,X=i.label`
  font-size: 15px;
  color: #333;
`,q=i.select`
  padding: 7px 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 15px;
  background: #fff;
  color: #333;
`;export{V as default};
