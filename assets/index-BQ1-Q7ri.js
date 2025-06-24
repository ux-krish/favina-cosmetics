import{r as a,j as e,d as t}from"./index-CHwc8rib.js";const y=()=>{const[o,i]=a.useState({name:"",email:"",message:""}),[d,p]=a.useState(!1),n=r=>{i({...o,[r.target.name]:r.target.value})},x=r=>{r.preventDefault(),p(!0)};return e.jsx(c,{children:e.jsxs(l,{children:[e.jsxs(m,{children:[e.jsx("h1",{children:"Contact Us"}),e.jsx(h,{children:"We'd love to hear from you! Fill out the form below and we'll get back to you soon."}),e.jsxs(f,{onSubmit:x,children:[e.jsx(s,{type:"text",name:"name",placeholder:"Your Name",value:o.name,onChange:n,required:!0}),e.jsx(s,{type:"email",name:"email",placeholder:"Your Email",value:o.email,onChange:n,required:!0}),e.jsx(b,{name:"message",placeholder:"Your Message",value:o.message,onChange:n,required:!0}),e.jsx(j,{type:"submit",children:"Send Message"}),d&&e.jsx(w,{children:"Thank you for contacting us!"})]})]}),e.jsx(u,{children:e.jsx(g,{title:"ShopEase Location",src:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019019228767!2d-122.41941518468153!3d37.7749297797597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7e6b1b0b%3A0x4a0f0e4d9e8e8e8e!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus",allowFullScreen:"",loading:"lazy",referrerPolicy:"no-referrer-when-downgrade"})})]})})},c=t.div`
  max-width: 1100px;
  margin: 40px auto;
  padding: 30px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
`,l=t.div`
  display: flex;
  gap: 40px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
  }
`,m=t.div`
  flex: 1;
  min-width: 300px;
`,u=t.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`,g=t.iframe`
  width: 100%;
  min-height: 350px;
  border: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`,h=t.p`
  color: #666;
  margin-bottom: 25px;
`,f=t.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`,s=t.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
`,b=t.textarea`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  min-height: 100px;
  resize: vertical;
`,j=t.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #c0392b;
  }
`,w=t.div`
  color: #27ae60;
  margin-top: 10px;
  text-align: center;
`;export{y as default};
