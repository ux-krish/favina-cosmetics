import{u as ee,a as te,b as ie,r as w,p as $,j as t,B as V,d as i,c as ne}from"./index-CHwc8rib.js";import{g as F,S as G,P as H,a as Q}from"./pagination-DM4-F6wJ.js";import{u as ae}from"./index.esm-DayzJvye.js";import{P as oe}from"./ProductGrid-C_3PYOr7.js";function _(D){let{swiper:e,extendParams:L,on:n,emit:d,params:l}=D;e.autoplay={running:!1,paused:!1,timeLeft:0},L({autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!1,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}});let u,j,T=l&&l.autoplay?l.autoplay.delay:3e3,g=l&&l.autoplay?l.autoplay.delay:3e3,r,f=new Date().getTime(),S,b,c,I,R,p,P;function k(a){!e||e.destroyed||!e.wrapperEl||a.target===e.wrapperEl&&(e.wrapperEl.removeEventListener("transitionend",k),!(P||a.detail&&a.detail.bySwiperTouchMove)&&y())}const o=()=>{if(e.destroyed||!e.autoplay.running)return;e.autoplay.paused?S=!0:S&&(g=r,S=!1);const a=e.autoplay.paused?r:f+g-new Date().getTime();e.autoplay.timeLeft=a,d("autoplayTimeLeft",a,a/T),j=requestAnimationFrame(()=>{o()})},m=()=>{let a;return e.virtual&&e.params.virtual.enabled?a=e.slides.find(s=>s.classList.contains("swiper-slide-active")):a=e.slides[e.activeIndex],a?parseInt(a.getAttribute("data-swiper-autoplay"),10):void 0},h=a=>{if(e.destroyed||!e.autoplay.running)return;cancelAnimationFrame(j),o();let x=typeof a>"u"?e.params.autoplay.delay:a;T=e.params.autoplay.delay,g=e.params.autoplay.delay;const s=m();!Number.isNaN(s)&&s>0&&typeof a>"u"&&(x=s,T=s,g=s),r=x;const z=e.params.speed,q=()=>{!e||e.destroyed||(e.params.autoplay.reverseDirection?!e.isBeginning||e.params.loop||e.params.rewind?(e.slidePrev(z,!0,!0),d("autoplay")):e.params.autoplay.stopOnLastSlide||(e.slideTo(e.slides.length-1,z,!0,!0),d("autoplay")):!e.isEnd||e.params.loop||e.params.rewind?(e.slideNext(z,!0,!0),d("autoplay")):e.params.autoplay.stopOnLastSlide||(e.slideTo(0,z,!0,!0),d("autoplay")),e.params.cssMode&&(f=new Date().getTime(),requestAnimationFrame(()=>{h()})))};return x>0?(clearTimeout(u),u=setTimeout(()=>{q()},x)):requestAnimationFrame(()=>{q()}),x},N=()=>{f=new Date().getTime(),e.autoplay.running=!0,h(),d("autoplayStart")},E=()=>{e.autoplay.running=!1,clearTimeout(u),cancelAnimationFrame(j),d("autoplayStop")},v=(a,x)=>{if(e.destroyed||!e.autoplay.running)return;clearTimeout(u),a||(p=!0);const s=()=>{d("autoplayPause"),e.params.autoplay.waitForTransition?e.wrapperEl.addEventListener("transitionend",k):y()};if(e.autoplay.paused=!0,x){R&&(r=e.params.autoplay.delay),R=!1,s();return}r=(r||e.params.autoplay.delay)-(new Date().getTime()-f),!(e.isEnd&&r<0&&!e.params.loop)&&(r<0&&(r=0),s())},y=()=>{e.isEnd&&r<0&&!e.params.loop||e.destroyed||!e.autoplay.running||(f=new Date().getTime(),p?(p=!1,h(r)):h(),e.autoplay.paused=!1,d("autoplayResume"))},W=()=>{if(e.destroyed||!e.autoplay.running)return;const a=F();a.visibilityState==="hidden"&&(p=!0,v(!0)),a.visibilityState==="visible"&&y()},A=a=>{a.pointerType==="mouse"&&(p=!0,P=!0,!(e.animating||e.autoplay.paused)&&v(!0))},M=a=>{a.pointerType==="mouse"&&(P=!1,e.autoplay.paused&&y())},U=()=>{e.params.autoplay.pauseOnMouseEnter&&(e.el.addEventListener("pointerenter",A),e.el.addEventListener("pointerleave",M))},K=()=>{e.el&&typeof e.el!="string"&&(e.el.removeEventListener("pointerenter",A),e.el.removeEventListener("pointerleave",M))},X=()=>{F().addEventListener("visibilitychange",W)},Z=()=>{F().removeEventListener("visibilitychange",W)};n("init",()=>{e.params.autoplay.enabled&&(U(),X(),N())}),n("destroy",()=>{K(),Z(),e.autoplay.running&&E()}),n("_freeModeStaticRelease",()=>{(c||p)&&y()}),n("_freeModeNoMomentumRelease",()=>{e.params.autoplay.disableOnInteraction?E():v(!0,!0)}),n("beforeTransitionStart",(a,x,s)=>{e.destroyed||!e.autoplay.running||(s||!e.params.autoplay.disableOnInteraction?v(!0,!0):E())}),n("sliderFirstMove",()=>{if(!(e.destroyed||!e.autoplay.running)){if(e.params.autoplay.disableOnInteraction){E();return}b=!0,c=!1,p=!1,I=setTimeout(()=>{p=!0,c=!0,v(!0)},200)}}),n("touchEnd",()=>{if(!(e.destroyed||!e.autoplay.running||!b)){if(clearTimeout(I),clearTimeout(u),e.params.autoplay.disableOnInteraction){c=!1,b=!1;return}c&&e.params.cssMode&&y(),c=!1,b=!1}}),n("slideChange",()=>{e.destroyed||!e.autoplay.running||(R=!0)}),Object.assign(e.autoplay,{start:N,stop:E,pause:v,resume:y})}const ct=()=>{const{id:D}=ee(),e=te(),L=ie(),[n,d]=w.useState(null),[l,u]=w.useState(1),[j,T]=w.useState(!0),[g,r]=w.useState([]),{register:f,handleSubmit:S,reset:b,formState:{errors:c}}=ae();w.useEffect(()=>{const o=($.products||[]).find(m=>String(m.id)===String(D));d(o||null),T(!1)},[D]),w.useEffect(()=>{if(n){const o=JSON.parse(localStorage.getItem(`reviews_${n.id}`)||"[]");r(o)}},[n]);const I=()=>{n&&e(ne({...n,quantity:l}))},R=o=>{const h=[{name:o.name,text:o.text,avatar:`https://randomuser.me/api/portraits/lego/${Math.floor(Math.random()*10)}.jpg`},...g];r(h),localStorage.setItem(`reviews_${n.id}`,JSON.stringify(h)),b()};if(j)return t.jsx("div",{children:"Loading..."});if(!n)return t.jsx("div",{children:"Product not found"});const p=($.products||[]).filter(o=>o.category===n.category&&o.id!==n.id).slice(0,4),P=[{rating:5,quote:"Perfect nude colour",text:"First-ever purchase from kay beauty...and it is so good. ROCKY ROAD beautiful nude colour as you can see in the pictures...I want this colour and finally got this. Luxurious finish gives a nice shine colour pay-off is excellent...but one thing is it takes a lot of time to dry otherwise, I love this ❤️",user:"Juhi Bhaskar",verified:!0},{rating:4.8,quote:"Amazing texture",text:"The texture is so smooth and blends perfectly. Will buy again!",user:"Aarti P.",verified:!0},{rating:4.9,quote:"Long lasting",text:"Stayed on my lips all day, even after meals. Highly recommend.",user:"Priya S.",verified:!0},{rating:5,quote:"Best purchase",text:"Absolutely love the color and finish. Worth every penny.",user:"Sneha T.",verified:!0},{rating:4.7,quote:"Great for daily use",text:"Perfect for my daily makeup routine. Not heavy at all.",user:"Tanvi P.",verified:!0}],k=[...g,...n.testimonials||[]];return t.jsxs(t.Fragment,{children:[t.jsxs(re,{className:"container",children:[t.jsxs(se,{children:[t.jsx(we,{type:"button",onClick:()=>L(-1),children:"← Back"}),t.jsx(de,{src:n.image?n.image.startsWith("/")?n.image:n.image.startsWith("products/")?`/images/${n.image.replace(/^products\//,"")}`:!n.image.includes("/")&&n.image?`/images/${n.image}`:`/images/${n.image}`:"",alt:n.title})]}),t.jsxs(le,{children:[t.jsx(ce,{children:n.title}),t.jsx(pe,{children:n.category}),t.jsxs(ue,{children:[t.jsx(xe,{children:"★"}),t.jsx(fe,{children:n.rating?n.rating.toFixed(1):"4.0"})]}),t.jsx(me,{children:n.offerPrice&&n.offerPrice<n.price?t.jsxs(t.Fragment,{children:[t.jsxs(ge,{children:["$",n.price.toFixed(2)]}),t.jsxs(he,{children:["$",n.offerPrice.toFixed(2)]})]}):t.jsxs(t.Fragment,{children:["$",n.price.toFixed(2)]})}),t.jsx(ye,{children:"This is a detailed description of the product."}),t.jsxs(be,{children:[t.jsx(Y,{onClick:()=>u(Math.max(1,l-1)),children:"-"}),t.jsx(ve,{type:"number",value:l,onChange:o=>u(Math.max(1,parseInt(o.target.value)||1)),min:"1"}),t.jsx(Y,{onClick:()=>u(l+1),children:"+"})]}),t.jsx(V,{onClick:I,fullWidth:!0,children:"Add to Cart"})]})]}),t.jsxs(De,{className:"container",children:[t.jsx(Ie,{}),t.jsxs(Le,{children:[t.jsx(Fe,{children:"Discount"}),t.jsx(Oe,{children:"Nourish your skin with toxin-free cosmetic products. With the offers that you can’t refuse."}),t.jsxs(Be,{children:[t.jsx("span",{children:"Get Your"})," ",t.jsx(Ce,{children:"50% Off"})]}),t.jsxs(Ne,{children:["on your first purchase",t.jsx("br",{}),"for the next ",t.jsx("b",{children:"24 hours only!"})]}),t.jsx(V,{variant:"outline",style:{marginTop:24,minWidth:120},children:"Get Now"})]})]}),t.jsxs(je,{className:"container",children:[t.jsx(Te,{children:"Customer Reviews & Ratings"}),k.length>0?t.jsx(G,{modules:[H,_],spaceBetween:24,slidesPerView:1,pagination:{clickable:!0},loop:!0,speed:600,autoplay:{delay:3500,disableOnInteraction:!1},style:{paddingBottom:40,maxWidth:600},children:k.map((o,m)=>t.jsx(Q,{children:t.jsxs(Se,{children:[t.jsx(Re,{src:o.avatar,alt:o.name}),t.jsxs(Pe,{children:[t.jsx(ke,{children:o.name}),t.jsxs(Ee,{children:['"',o.text,'"']})]})]})},m))}):t.jsx(ze,{children:"No reviews yet for this product."}),t.jsxs(Ke,{children:[t.jsx(Xe,{children:"Write a Review"}),t.jsxs(Ze,{onSubmit:S(R),children:[t.jsx(et,{type:"text",placeholder:"Your Name",...f("name",{required:"Name is required"})}),c.name&&t.jsx(J,{children:c.name.message}),t.jsx(tt,{placeholder:"Your Review",...f("text",{required:"Review is required",minLength:{value:5,message:"Review must be at least 5 characters"}}),rows:3}),c.text&&t.jsx(J,{children:c.text.message}),t.jsx(it,{type:"submit",children:"Submit Review"})]})]})]}),t.jsxs(We,{className:"container",children:[t.jsx(Ae,{children:t.jsx(G,{modules:[H,_],spaceBetween:24,slidesPerView:1,pagination:{clickable:!0},loop:!0,speed:600,autoplay:{delay:3500,disableOnInteraction:!1},style:{maxWidth:600,width:"100%"},children:P.map((o,m)=>t.jsx(Q,{children:t.jsxs(nt,{children:[t.jsx(Me,{children:t.jsxs(qe,{children:[o.rating.toFixed(1)," ",t.jsx($e,{children:"★"})]})}),t.jsxs(Ve,{children:['"',o.quote,'"']}),t.jsx(Ge,{children:o.text}),t.jsxs(He,{children:["~ ",o.user,o.verified&&t.jsxs(Qe,{children:[t.jsx(_e,{}),"Verified Buyers"]})]})]})},m))})}),t.jsxs(Ye,{children:[t.jsx(Je,{src:n.image?n.image.startsWith("/")?n.image:n.image.startsWith("products/")?`/images/${n.image.replace(/^products\//,"")}`:!n.image.includes("/")&&n.image?`/images/${n.image}`:n.image:"",alt:"Product"}),t.jsxs(Ue,{children:[t.jsxs(O,{children:[t.jsx(B,{src:"https://cdn-icons-png.flaticon.com/512/1828/1828884.png",alt:"30H Wear"}),t.jsx(C,{children:"30H WEAR"})]}),t.jsxs(O,{children:[t.jsx(B,{src:"https://cdn-icons-png.flaticon.com/512/1828/1828885.png",alt:"Weightless"}),t.jsx(C,{children:"WEIGHTLESS"})]}),t.jsxs(O,{children:[t.jsx(B,{src:"https://cdn-icons-png.flaticon.com/512/1828/1828886.png",alt:"Sweatproof"}),t.jsx(C,{children:"SWEATPROOF"})]})]})]})]}),t.jsxs(at,{className:"container",children:[t.jsx(ot,{children:"Related Products"}),t.jsx(oe,{products:p})]})]})},re=i.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px 0;
  max-width: 1320px;
  margin: 0 auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`,se=i.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`,de=i.img`
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
`,le=i.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,ce=i.h1`
  font-size: 28px;
  margin: 0;
`,pe=i.span`
  color: #666;
  text-transform: capitalize;
`,ue=i.div`
  display: flex;
  align-items: center;
  gap: 5px;
`,xe=i.span`
  color: #ffc107;
  font-size: 18px;
`,fe=i.span`
  color: #333;
  font-size: 16px;
  font-weight: 500;
`,me=i.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
`,ge=i.span`
  color: #888;
  text-decoration: line-through;
  font-size: 18px;
`,he=i.span`
  color: #e74c3c;
  font-size: 24px;
  font-weight: bold;
`,ye=i.p`
  line-height: 1.6;
  color: #333;
`,be=i.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`,Y=i.button`
  width: 30px;
  height: 30px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`,ve=i.input`
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
`,we=i.button`
  position: absolute;
 
  left: 10px;
  background: #fff;
  border: 1px solid #eee;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  padding: 7px 18px 7px 10px;
  border-radius: 22px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10;
  display: flex;
  align-items: center;
  transition: color 0.18s, border 0.18s, background 0.18s;
  &:hover {
    color: #e74c3c;
    border-color: #e74c3c;
    background: #fff7f5;
  }
`,je=i.div`
  margin-top: 32px;
  padding: 24px 0 0 0;
  border-top: 1px solid #eee;
  max-width: 1320px;
  margin-left: auto;
  margin-right: auto;
`,Te=i.h3`
  font-size: 20px;
  color: #e74c3c;
  margin:0 a 18px;
  text-align: center;
`;i.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;const Se=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  padding: 14px 16px;
`,Re=i.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e74c3c;
`,Pe=i.div`
  flex: 1;
`,ke=i.div`
  font-weight: 500;
  color: #222;
  margin-bottom: 3px;
  font-size: 15px;
`,Ee=i.div`
  color: #444;
  font-size: 15px;
  font-style: italic;
`,ze=i.div`
  color: #888;
  font-size: 15px;
  padding: 10px 0;
`,De=i.div`
  display: flex;
  align-items: stretch;
  background: #fdf3f1;
  border-radius: 14px;
  margin: 40px auto 0 auto;
  overflow: hidden;
  min-height: 320px;
  box-shadow: 0 2px 12px rgba(231,76,60,0.06);
  max-width: 1320px;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
  }
`,Ie=i.div`
  flex: 1.2;
  min-width: 260px;
  background: url('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80') center/cover no-repeat;
  @media (max-width: 900px) {
    min-height: 180px;
    min-width: 0;
    height: 180px;
  }
`,Le=i.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 38px 38px 38px 38px;
  background: #fdf3f1;
  @media (max-width: 900px) {
    padding: 24px 18px;
  }
`,Fe=i.div`
  font-size: 2rem;
  font-weight: 700;
  color: #b49be0;
  margin-bottom: 10px;
  font-style: italic;
`,Oe=i.div`
  font-size: 20px;
  color: #444;
  margin-bottom: 18px;
  max-width: 480px;
`,Be=i.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
  span {
    font-weight: 700;
  }
`,Ce=i.span`
  color: #f08a6b;
  font-weight: 900;
`,Ne=i.div`
  font-size: 18px;
  color: #444;
  margin-bottom: 18px;
  b {
    color: #222;
    font-weight: 700;
  }
`,We=i.section`
  display: flex;
  background: linear-gradient(120deg, #fbeaec 0%, #f8f3fa 100%);
  border-radius: 16px;
  margin: 40px auto 0 auto;
  overflow: hidden;
  min-height: 340px;
  box-shadow: 0 2px 12px rgba(231,76,60,0.06);
  max-width: 1320px;
  @media (max-width: 900px) {
    flex-direction: column;
    min-height: 0;
  }
`,Ae=i.div`
  flex: 1.2;
  padding: 48px 38px 38px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 900px) {
    padding: 28px 18px 18px 18px;
  }
`,Me=i.div`
  margin-bottom: 18px;
`,qe=i.div`
  display: inline-flex;
  align-items: center;
  background: #fff;
  color: #222;
  font-weight: 700;
  font-size: 20px;
  border-radius: 8px;
  padding: 6px 18px;
  box-shadow: 0 2px 8px rgba(231,76,60,0.08);
`,$e=i.span`
  color: #ffc107;
  font-size: 20px;
  margin-left: 6px;
`,Ve=i.div`
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 18px;
  font-family: 'Montserrat', sans-serif;
`,Ge=i.div`
  font-size: 17px;
  color: #444;
  margin-bottom: 22px;
  max-width: 600px;
`,He=i.div`
  font-size: 16px;
  color: #222;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
`,Qe=i.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #e7b86a;
  font-size: 14px;
  margin-left: 8px;
`,_e=i.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('https://cdn-icons-png.flaticon.com/512/190/190411.png') center/cover no-repeat;
`;i.div`
  display: flex;
  gap: 10px;
  margin-top: 18px;
`;i.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #fff;
  border: none;
  font-size: 20px;
  color: #e74c3c;
  box-shadow: 0 2px 8px rgba(231,76,60,0.08);
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #ffecec;
  }
`;const Ye=i.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 38px 28px;
  background: #fff;
  @media (max-width: 900px) {
    padding: 24px 12px;
  }
`,Je=i.img`
  width: 180px;
  height: 220px;
  object-fit: contain;
  margin-bottom: 28px;
  border-radius: 12px;
  background: #f8f3fa;
  box-shadow: 0 2px 8px rgba(231,76,60,0.08);
`,Ue=i.div`
  display: flex;
  gap: 24px;
  justify-content: center;
`,O=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`,B=i.img`
  width: 54px;
  height: 54px;
  object-fit: contain;
  margin-bottom: 4px;
`,C=i.div`
  font-size: 15px;
  color: #b49be0;
  font-weight: 600;
  text-align: center;
`,Ke=i.div`
  padding: 24px 18px;
  background: #f8f8f8;
  border-radius: 10px;
  max-width: 600px;
  margin: 24px auto 0;
`,Xe=i.div`
  font-size: 18px;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 12px;
`,Ze=i.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`,et=i.input`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;
`,tt=i.textarea`
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;
  min-height: 70px;
  resize: vertical;
`,it=i.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.18s;
  &:hover {
    background: #c0392b;
  }
`,J=i.div`
  color: #e74c3c;
  font-size: 13px;
  margin-top: -6px;
`,nt=i.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 320px;
  padding: 0 10px;
`,at=i.section`
  margin: 40px auto 0 auto;
  max-width: 1320px;
  padding-bottom: 40px;
`,ot=i.h3`
  font-size: 22px;
  color: #e74c3c;
  margin-bottom: 24px;
  text-align: center;
`;export{ct as default};
