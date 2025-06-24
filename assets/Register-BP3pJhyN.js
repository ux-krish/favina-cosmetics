import{a as p,b as x,e as u,j as e,B as g,L as h,d as r,m as f}from"./index-CHwc8rib.js";import{u as b}from"./index.esm-DayzJvye.js";import{F as i}from"./FormInput-BXyy2NRF.js";const S=()=>{const{register:s,handleSubmit:n,formState:{errors:a},watch:d}=b(),l=p(),c=x(),{error:o}=u(t=>t.auth),m=t=>{l(f(t)).unwrap().then(()=>{c("/account")})};return e.jsx(w,{children:e.jsxs(j,{children:[e.jsx("h2",{children:"Create Account"}),o&&e.jsx(q,{children:o}),e.jsxs(v,{onSubmit:n(m),children:[e.jsxs(y,{children:[e.jsx(i,{label:"First Name",...s("firstName",{required:"First name is required"}),error:a.firstName}),e.jsx(i,{label:"Last Name",...s("lastName",{required:"Last name is required"}),error:a.lastName})]}),e.jsx(i,{label:"Email",type:"email",...s("email",{required:"Email is required",pattern:{value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message:"Invalid email address"}}),error:a.email}),e.jsx(i,{label:"Password",type:"password",...s("password",{required:"Password is required",minLength:{value:6,message:"Password must be at least 6 characters"}}),error:a.password}),e.jsx(i,{label:"Confirm Password",type:"password",...s("confirmPassword",{required:"Please confirm your password",validate:t=>t===d("password")||"Passwords do not match"}),error:a.confirmPassword}),e.jsx(g,{type:"submit",fullWidth:!0,children:"Register"})]}),e.jsxs(P,{children:["Already have an account? ",e.jsx(h,{to:"/login",children:"Sign in"})]})]})})},w=r.div`
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
  max-width: 500px;

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
`,v=r.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,y=r.div`
  display: flex;
  gap: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`,q=r.div`
  color: #ff6b6b;
  background: #ffecec;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
`,P=r.p`
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
`;export{S as default};
