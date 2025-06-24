import{e as x,a as q,b as v,r as h,j as e,B as C,d as a,i as P,k as S,f as F}from"./index-RwLj0z44.js";import{u as N}from"./index.esm-CAtgcwRR.js";import{F as s}from"./FormInput-ClwZzpXE.js";const k=()=>{const{user:o,isAuthenticated:n}=x(i=>i.auth),{items:c}=x(i=>i.cart),l=q(),f=v(),j=h.useRef(null),{register:r,handleSubmit:y,formState:{errors:t},reset:p}=N({defaultValues:n&&o?o:{}});h.useEffect(()=>{n&&o&&p(o)},[n,o,p]);const b=i=>{n&&l(P(i));const g={customer:i,items:c,total:c.reduce((d,m)=>d+m.price*m.quantity,0),date:new Date().toISOString(),status:"pending"};l(S(g)).unwrap().then(d=>{l(F()),j.current=d.id,f(`/order-confirmation/${d.id}`)})};return e.jsxs(A,{onSubmit:y(b),children:[e.jsxs(u,{children:[e.jsx(s,{label:"First Name",...r("firstName",{required:"First name is required"}),error:t.firstName}),e.jsx(s,{label:"Last Name",...r("lastName",{required:"Last name is required"}),error:t.lastName})]}),e.jsx(s,{label:"Email",type:"email",...r("email",{required:"Email is required",pattern:{value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:"Invalid email address"}}),error:t.email}),e.jsx(s,{label:"Phone",...r("phone",{required:"Phone is required",pattern:{value:/^[0-9]{10,15}$/,message:"Invalid phone number"}}),error:t.phone}),e.jsx(s,{label:"Address",...r("address",{required:"Address is required"}),error:t.address}),e.jsxs(u,{children:[e.jsx(s,{label:"City",...r("city",{required:"City is required"}),error:t.city}),e.jsx(s,{label:"State",...r("state",{required:"State is required"}),error:t.state})]}),e.jsxs(u,{children:[e.jsx(s,{label:"Country",...r("country",{required:"Country is required"}),error:t.country}),e.jsx(s,{label:"Postal Code",...r("postalCode",{required:"Postal code is required"}),error:t.postalCode})]}),e.jsx(C,{type:"submit",fullWidth:!0,children:"Place Order"})]})},A=a.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,u=a.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`,$=()=>e.jsxs(w,{children:[e.jsx("h1",{children:"Checkout"}),e.jsx(k,{}),e.jsxs(E,{children:[e.jsx("h2",{children:"Payment Method"}),e.jsxs(I,{children:[e.jsx("input",{type:"radio",id:"cod",name:"payment",checked:!0,readOnly:!0}),e.jsx("label",{htmlFor:"cod",children:"Cash on Delivery"})]}),e.jsx(O,{children:"Only Cash on Delivery is available at this time."})]})]}),w=a.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 30px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
`,E=a.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`,I=a.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input[type="radio"] {
    margin-right: 10px;
    accent-color: #e74c3c;
  }
`,O=a.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 8px;
`;export{$ as default};
