import{a as p,b as x,e as m,j as e,B as u,L as g,d as r,l as h}from"./index-D7LUjQTs.js";import{u as b}from"./index.esm-BG1gs7nH.js";import{F as o}from"./FormInput-BFFANX5A.js";const k=()=>{const{register:s,handleSubmit:n,formState:{errors:a}}=b(),d=p(),c=x(),{error:i}=m(t=>t.auth),l=t=>{d(h(t)).unwrap().then(()=>{c("/account")})};return e.jsx(f,{children:e.jsxs(j,{children:[e.jsx("h2",{children:"Login"}),i&&e.jsx(v,{children:i}),e.jsxs(w,{onSubmit:n(l),children:[e.jsx(o,{label:"Email",type:"email",...s("email",{required:"Email is required",pattern:{value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:"Invalid email address"}}),error:a.email}),e.jsx(o,{label:"Password",type:"password",...s("password",{required:"Password is required",minLength:{value:6,message:"Password must be at least 6 characters"}}),error:a.password}),e.jsx(u,{type:"submit",fullWidth:!0,children:"Login"})]}),e.jsxs(L,{children:["Don't have an account? ",e.jsx(g,{to:"/register",children:"Sign up"})]})]})})},f=r.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 20px;
`,j=r.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
`,w=r.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,v=r.div`
  color: #ff6b6b;
  background: #ffecec;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
`,L=r.p`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;

  a {
    color: #333;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;export{k as default};
