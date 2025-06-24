import{e as p,a as h,r as n,j as e,B as g,d as r,i as j}from"./index-RwLj0z44.js";import{u as b}from"./index.esm-CAtgcwRR.js";import{F as o}from"./FormInput-ClwZzpXE.js";const v=()=>{const{user:s}=p(c=>c.auth),{register:a,handleSubmit:d,formState:{errors:t}}=b({defaultValues:s||{}}),i=h(),[l,m]=n.useState(!1),f=c=>{i(j(c)),m(!0),setTimeout(()=>m(!1),2e3)};return e.jsxs(y,{children:[e.jsx("h2",{children:"Profile Information"}),e.jsxs(w,{onSubmit:d(f),children:[e.jsxs(x,{children:[e.jsx(o,{label:"First Name",...a("firstName",{required:"First name is required"}),error:t.firstName}),e.jsx(o,{label:"Last Name",...a("lastName",{required:"Last name is required"}),error:t.lastName})]}),e.jsx(o,{label:"Email",type:"email",...a("email",{required:"Email is required",pattern:{value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:"Invalid email address"}}),error:t.email,disabled:!0}),e.jsx(o,{label:"Phone",...a("phone"),error:t.phone}),e.jsx(o,{label:"Address",...a("address"),error:t.address}),e.jsxs(x,{children:[e.jsx(o,{label:"City",...a("city"),error:t.city}),e.jsx(o,{label:"State",...a("state"),error:t.state})]}),e.jsxs(x,{children:[e.jsx(o,{label:"Country",...a("country"),error:t.country}),e.jsx(o,{label:"Postal Code",...a("postalCode"),error:t.postalCode})]}),e.jsx(g,{type:"submit",children:"Update Profile"})]}),l&&e.jsx(P,{children:"Profile saved successfully!"})]})},y=r.div`
  h2 {
    margin-bottom: 20px;
  }
`,w=r.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
`,x=r.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`,P=r.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #27ae60;
  color: #fff;
  padding: 14px 30px;
  border-radius: 6px;
  font-size: 16px;
  z-index: 9999;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  animation: fadeInOut 2s;

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(20px);}
    10% { opacity: 1; transform: translateX(-50%) translateY(0);}
    90% { opacity: 1; transform: translateX(-50%) translateY(0);}
    100% { opacity: 0; transform: translateX(-50%) translateY(20px);}
  }
`,O=()=>{const[s,a]=n.useState([]),{user:d}=p(t=>t.auth);return n.useEffect(()=>{const i=(JSON.parse(localStorage.getItem("orders"))||[]).filter(l=>l.customer.email===d.email);a(i)},[d.email]),e.jsxs(S,{children:[e.jsx("h2",{children:"Your Orders"}),s.length===0?e.jsx(C,{children:"You haven't placed any orders yet."}):e.jsx(F,{children:s.map(t=>e.jsxs(I,{children:[e.jsxs(k,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:"Order #"})," ",t.date]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Date:"})," ",new Date(t.date).toLocaleDateString()]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Total:"})," $",t.total.toFixed(2)]}),e.jsx("div",{children:e.jsx(N,{status:t.status,children:t.status})})]}),e.jsx(T,{children:t.items.map(i=>e.jsxs(q,{children:[e.jsx($,{src:i.image,alt:i.title}),e.jsxs(A,{children:[e.jsx(D,{children:i.title}),e.jsxs(E,{children:["$",i.price.toFixed(2)]}),e.jsxs(Y,{children:["Qty: ",i.quantity]})]})]},i.id))})]},t.date))})]})},S=r.div`
  h2 {
    margin-bottom: 20px;
  }
`,C=r.p`
  text-align: center;
  color: #666;
  margin-top: 40px;
`,F=r.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`,I=r.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
`,k=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`,N=r.span`
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  background: ${({status:s})=>s==="completed"?"#d4edda":s==="cancelled"?"#f8d7da":"#fff3cd"};
  color: ${({status:s})=>s==="completed"?"#155724":s==="cancelled"?"#721c24":"#856404"};
`,T=r.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`,q=r.div`
  display: flex;
  gap: 15px;
`,$=r.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`,A=r.div`
  flex: 1;
`,D=r.div`
  font-weight: 500;
`,E=r.div`
  color: #666;
  font-size: 14px;
  margin: 5px 0;
`,Y=r.div`
  color: #666;
  font-size: 14px;
`,G=()=>{const[s,a]=n.useState("profile"),{user:d}=p(t=>t.auth);return e.jsxs(z,{children:[e.jsxs(X,{children:[e.jsx(u,{active:s==="profile",onClick:()=>a("profile"),children:"Profile"}),e.jsx(u,{active:s==="orders",onClick:()=>a("orders"),children:"Orders"})]}),e.jsx(L,{children:s==="profile"?e.jsx(v,{user:d}):e.jsx(O,{})})]})},z=r.div`
  display: flex;
  min-height: calc(100vh - 150px);
  padding: 30px;
  max-width: 1320px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`,X=r.div`
  width: 250px;
  padding-right: 30px;
  
  @media (max-width: 768px) {
    width: 100%;
    padding-right: 0;
    display: flex;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
`,u=r.button`
  display: block;
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  background: ${({active:s})=>s?"#f0f0f0":"transparent"};
  border: none;
  text-align: left;
  cursor: pointer;
  font-weight: ${({active:s})=>s?"bold":"normal"};
  border-radius: 5px;
  
  @media (max-width: 768px) {
    text-align: center;
    margin-bottom: 0;
  }
`,L=r.div`
  flex: 1;
`;export{G as default};
