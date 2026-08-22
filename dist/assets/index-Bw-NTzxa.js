const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-DTaQav9T.js","assets/vendor-react-Cy653LfT.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-BZ7-8imq.js","assets/ClientList-BduV8eP7.js","assets/Table-DewUDxHh.js","assets/FormFields-DEm8TLqC.js","assets/DepartmentList-Cu0LkYqI.js","assets/ManagerList-DxagmWMq.js","assets/EmployeeList-D8KbVfRk.js","assets/ProjectList-BDbP_MeS.js","assets/ContentCalendarView-BirxE0t7.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-8Y78bGlC.js","assets/ReportDashboard-_gZfpw_w.js","assets/SuperadminReports-BA12_nZ0.js","assets/ActivityTypeList-Bq94YXa6.js","assets/LoginCredentials-BMa81oQo.js","assets/WorkUpdates-C5GcBbUw.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-CWRhz69H.js","assets/ManagerDashboard-D-2HqljN.js","assets/ManagerCalendar-tQgA7IBF.js","assets/ManagerDailyTodo-kP1v4Dfh.js","assets/DesignerWorkload-DJ78C7VT.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-DRZvM3Ek.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-YSwQ4NQp.js","assets/ManagerClientRework-Bna9Ucrj.js","assets/ManagerJobWorks-QL0cMB9D.js","assets/ManagerSubDepartmentList-C8lQGkFV.js","assets/ManagerEmployeeList-D5YJfQKp.js","assets/ManagerEfficiency-hxr8z3vp.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-Cih9EBIg.js","assets/SMMMonthlyPosting-D2a7Qt8e.js","assets/SMMPosted-BgGhei5S.js","assets/WritersAssignment-Bhih03gr.js","assets/EmployeeDashboard-DWk-a-VL.js","assets/EmployeeCalendar-Cl7LrEey.js","assets/EmployeeEventCalendar-B8mitxS4.js","assets/EmployeeAssignedWork-CrtRj4R1.js","assets/EmployeeReassignedWork-CkExQm-w.js","assets/EmployeeApprovedWork-U3KOozR9.js","assets/EmployeeTodayDeliverables-BemjL0eC.js","assets/EmployeeRework-P7Yof3Mu.js","assets/EmployeeOverallWork-Xj7i5cwn.js","assets/SuperAdminDashboard-BFDhv1xp.js","assets/SuperAdminClients-h2akV5Ua.js","assets/SuperAdminEfficiency-CdFdFbJg.js","assets/SuperAdminBranches-m2spi3jJ.js","assets/SuperAdminBranchDetail-C4-gAkwZ.js","assets/SuperAdminProfile-DBHRkJdA.js"])))=>i.map(i=>d[i]);
var oe=Object.defineProperty;var re=(l,t,s)=>t in l?oe(l,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[t]=s;var H=(l,t,s)=>re(l,typeof t!="symbol"?t+"":t,s);import{r as _,j as e,N as ae,L as ie,a as S,C as A,F as I,B as W,P as le,b as G,U as P,c as z,d as ce,e as D,f as $,g as Y,R as F,h as de,K as pe,A as ee,i as me,G as ue,X as xe,S as he,k as fe,l as ge,m as te,n as je,o as be,p as r,q as w,O as T,s as _e}from"./vendor-react-Cy653LfT.js";import{f as ye}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}})();const ve="modulepreload",we=function(l){return"/"+l},K={},m=function(t,s,i){let n=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),h=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(s.map(g=>{if(g=we(g),g in K)return;K[g]=!0;const b=g.endsWith(".css"),p=b?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${p}`))return;const x=document.createElement("link");if(x.rel=b?"stylesheet":ve,b||(x.as="script"),x.crossOrigin="",x.href=g,h&&x.setAttribute("nonce",h),document.head.appendChild(x),b)return new Promise((o,j)=>{x.addEventListener("load",o),x.addEventListener("error",()=>j(new Error(`Unable to preload CSS for ${g}`)))})}))}function c(a){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=a,window.dispatchEvent(h),!h.defaultPrevented)throw a}return n.then(a=>{for(const h of a||[])h.status==="rejected"&&c(h.reason);return t().catch(c)})},Ee=()=>{const l="https://api.reachskyline.com/api";{const t=l.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},E=ye.create({baseURL:Ee(),timeout:3e4,headers:{"Content-Type":"application/json"}});E.interceptors.request.use(l=>{const t=localStorage.getItem("erp_token");return t&&(l.headers.Authorization=`Bearer ${t}`),l},l=>Promise.reject(l));E.interceptors.response.use(l=>l,async l=>{var h,g,b;const{config:t,response:s}=l,i=((h=t==null?void 0:t.method)==null?void 0:h.toLowerCase())==="get",n=!s,c=s&&s.status>=500;if(t&&i&&(n||c)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const p=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,p),console.warn(`API call failed: ${l.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${p}ms...`),await new Promise(x=>setTimeout(x,p)),E(t)}if(s&&(s.status===401||s.status===403&&(((g=s.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((b=s.data)==null?void 0:b.errors)&&s.data.errors.some(p=>/jwt expired|invalid signature|jwt malformed/i.test(String(p)))))){const p=localStorage.getItem("erp_user");p&&(p.includes('"role":"client"')||p.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(l)});const se=_.createContext(null),ke=({children:l})=>{const[t,s]=_.useState(()=>{try{const p=localStorage.getItem("erp_user");return p?JSON.parse(p):null}catch{return null}}),[i,n]=_.useState(!1),c=p=>{if(p)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(x){var j,v;const o=async()=>{var f,d;try{const y=(d=(f=x.User)==null?void 0:f.PushSubscription)==null?void 0:d.id;y&&await E.post("/notifications/subscribe",{subscriptionId:y}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{x.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(f=>{console.warn("[OneSignal] Domain initialization deferred:",(f==null?void 0:f.message)||f)}),window.__oneSignalInitialized=!0}catch(f){console.warn("[OneSignal] Init warning:",f.message)}o();try{(v=(j=x.User)==null?void 0:j.PushSubscription)==null||v.addEventListener("change",function(f){var d;(d=f==null?void 0:f.current)!=null&&d.optedIn&&o()})}catch{}})}catch{}};_.useEffect(()=>{(async()=>{const x=localStorage.getItem("erp_token"),o=localStorage.getItem("erp_user");let j=null;try{j=o?JSON.parse(o):null}catch{}if(!x){if(j&&j.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(j),n(!1);return}s(null),n(!1);return}try{const v=await E.get("/auth/session");if(v.data&&v.data.success){const f=v.data.data.user;s(f),localStorage.setItem("erp_user",JSON.stringify(f))}else j&&j.role==="client"?s(j):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{j&&j.role==="client"&&s(j)}finally{n(!1)}})()},[]),_.useEffect(()=>{t&&c(t)},[t]);const a=async(p,x,o)=>{var j,v;try{const f=await E.post("/auth/login",{username:p,password:x},{onRetry:o});if(f.data&&f.data.success){const{token:d,user:y}=f.data.data;return localStorage.setItem("erp_token",d||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(y)),s(y),n(!1),{success:!0}}}catch(f){const d=(p||"").trim().toLowerCase();try{const R=localStorage.getItem("erp_client_passwords"),ne=(R?JSON.parse(R):{})[d];if((d==="gem"||d==="rk"||ne||((j=f.response)==null?void 0:j.status)===401||((v=f.response)==null?void 0:v.status)===400)&&!["admin","superadmin","dharsan","madace","kishore","praveen","nihassini","lokesh","vishalam","pradeep"].includes(d)){const J={id:d==="gem"?1:2,user_id:d==="gem"?1:2,username:(p||"").trim(),full_name:d==="gem"?"rajesh kumar":(p||"").trim(),email:`${d}@gem.com`,role:"client",user_type:"client"};return localStorage.setItem("erp_token","client-session-token"),localStorage.setItem("erp_user",JSON.stringify(J)),s(J),n(!1),{success:!0}}}catch{}const y=f.response&&f.response.data&&f.response.data.message?f.response.data.message:"Invalid username or password.",V=f.response&&f.response.data&&f.response.data.errors?f.response.data.errors:[];return{success:!1,message:y,errors:V}}},h=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(p){var x,o;try{const j=(o=(x=p.User)==null?void 0:x.PushSubscription)==null?void 0:o.id;j&&await E.post("/notifications/unsubscribe",{subscriptionId:j}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),n(!1)},g=p=>{s(x=>{if(!x)return null;const o={...x,...p};return localStorage.setItem("erp_user",JSON.stringify(o)),o})},b={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:i,login:a,logout:h,updateCurrentUser:g};return e.jsx(se.Provider,{value:b,children:l})},C=()=>{const l=_.useContext(se);return l||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Se=_.createContext(null),Ce=({children:l})=>{const[t,s]=_.useState([]),[i,n]=_.useState(0),{isAuthenticated:c}=C(),a=_.useCallback(async()=>{if(c)try{const p=await E.get("/notifications");if(p.data&&p.data.success){const x=p.data.data.notifications;s(x);const o=x.filter(j=>!j.is_read).length;n(o)}}catch{}},[c]),h=async p=>{try{await E.patch(`/notifications/${p}/read`),s(x=>x.map(o=>o.id===parseInt(p)?{...o,is_read:1}:o)),n(x=>Math.max(0,x-1))}catch(x){console.error("Failed to mark notification as read:",x.message)}},g=async()=>{try{await E.post("/notifications/read-all"),s(p=>p.map(x=>({...x,is_read:1}))),n(0)}catch(p){console.error("Failed to mark all notifications as read:",p.message)}};_.useEffect(()=>{if(c){a();const p=setInterval(a,3e4);return()=>clearInterval(p)}else s([]),n(0)},[c,a]);const b={notifications:t,unreadCount:i,fetchNotifications:a,markAsRead:h,markAllRead:g};return e.jsx(Se.Provider,{value:b,children:l})},N=()=>{const{logout:l,user:t}=C(),s=()=>{const c=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(G,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(Y,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(ee,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(P,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(me,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(z,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(W,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(ue,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&c.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(I,{size:20})}),c.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(de,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(pe,{size:20})}),c},n=(()=>{var h,g,b;const c=window.location.pathname.startsWith("/client");return(t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||c?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(S,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(A,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(I,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(W,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(le,{size:20})}]:(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(G,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(P,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(W,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(ce,{size:20})}]:(t==null?void 0:t.role)==="manager"?((h=t==null?void 0:t.managerProfile)==null?void 0:h.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(P,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(A,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(D,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(A,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx($,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(z,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(P,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(Y,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(P,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(W,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(I,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(F,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(I,{size:20})}]:(t==null?void 0:t.role)==="employee"?((g=t==null?void 0:t.employeeProfile)==null?void 0:g.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(A,{size:20})}]:((b=t==null?void 0:t.employeeProfile)==null?void 0:b.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(z,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(I,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx($,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(A,{size:20})}]:s()})();return e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:n.map((c,a)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(ae,{to:c.path,state:c.state,className:({isActive:h})=>`sidebar-link ${h?"active":""}`,children:[c.icon,e.jsx("span",{children:c.label})]})},a))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:l,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:c=>{c.currentTarget.style.color="#f87171"},onMouseLeave:c=>{c.currentTarget.style.color="var(--danger)"},children:[e.jsx(ie,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})},Le=({isOpen:l,onClose:t,title:s,children:i,footer:n=null})=>(_.useEffect(()=>(l?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[l]),l?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:c=>c.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(xe,{size:20})})]}),e.jsx("div",{className:"modal-body",children:i}),n&&e.jsx("div",{className:"modal-footer",children:n})]})}):null),M=()=>{var f;const{user:l,logout:t}=C(),[s,i]=_.useState(""),[n,c]=_.useState(!1),[a,h]=_.useState(null),[g,b]=_.useState(!1),p=async d=>{if(d.preventDefault(),!!s.trim()){c(!0),b(!0);try{const y=await E.get(`/search?q=${encodeURIComponent(s)}`);y.data&&y.data.success&&h(y.data.data)}catch(y){console.error("Global search error:",y.message)}finally{c(!1)}}},x=window.location.pathname.startsWith("/client"),o=x?l&&(l.role==="client"||l.user_type==="client")?l:{username:"gem",full_name:"rajesh kumar",role:"client"}:l,j=o&&o.username?o.username.slice(0,2).toUpperCase():"CL",v=()=>{var d,y,V,R;return x||(o==null?void 0:o.role)==="client"?"Client Partner":(o==null?void 0:o.role)==="manager"?((d=o==null?void 0:o.managerProfile)==null?void 0:d.department_code)==="SMM-RS"?"SMM Manager":(y=o==null?void 0:o.managerProfile)!=null&&y.department_name?`${o.managerProfile.department_name} Manager`:"Brand Manager":(o==null?void 0:o.role)==="employee"?((V=o==null?void 0:o.employeeProfile)==null?void 0:V.department_code)==="SMM-RS"?"SMM Employee":(R=o==null?void 0:o.employeeProfile)!=null&&R.department_name?`${o.employeeProfile.department_name} Employee`:"Employee":(o==null?void 0:o.role)==="admin"?"Administrator":(o==null?void 0:o.role)==="super_admin"?"Super Administrator":(o==null?void 0:o.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsx("form",{onSubmit:p,children:e.jsxs("div",{className:"header-search",children:[e.jsx(he,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:s,onChange:d=>i(d.target.value)})]})}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:j}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((f=o==null?void 0:o.clientProfile)==null?void 0:f.company_name)||(o==null?void 0:o.full_name)||(o==null?void 0:o.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:v()})]})]})}),e.jsx(Le,{isOpen:g,onClose:()=>{b(!1),h(null)},title:`Search Results for "${s}"`,children:n?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):a?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[a.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(fe,{size:16,className:"text-primary"})," Clients (",a.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.clients.map(d=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${d.id}`,style:{fontWeight:600},children:d.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[d.client_name," • ",d.client_id_code]})]},d.id))})]}),a.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(Y,{size:16,className:"text-teal"})," Departments (",a.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.departments.map(d=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${d.id}`,style:{fontWeight:600},children:d.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:d.code})]},d.id))})]}),a.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ee,{size:16,className:"text-secondary"})," Managers (",a.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.managers.map(d=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${d.id}`,style:{fontWeight:600},children:d.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[d.manager_id_code," • ",d.department_name]})]},d.id))})]}),a.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(P,{size:16,className:"text-purple"})," Employees (",a.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.employees.map(d=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${d.id}`,style:{fontWeight:600},children:d.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[d.employee_id_code," • ",d.department_name]})]},d.id))})]}),a.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ge,{size:16,className:"text-orange"})," Projects (",a.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.projects.map(d=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${d.id}`,style:{fontWeight:600},children:d.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",d.client_name," • Manager: ",d.manager_name]})]},d.id))})]}),a.clients.length===0&&a.departments.length===0&&a.managers.length===0&&a.employees.length===0&&a.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',s,'".']})})]}):null})]})};class L extends te.Component{constructor(s){super(s);H(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,i){var c,a,h;if(console.error("ErrorBoundary caught an error:",s,i),this.setState({errorInfo:i}),s&&(s.name==="ChunkLoadError"||((c=s.message)==null?void 0:c.includes("Failed to fetch dynamically imported module"))||((a=s.message)==null?void 0:a.includes("Importing a module script failed"))||((h=s.message)==null?void 0:h.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,i;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((i=this.state.errorInfo)==null?void 0:i.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const u=l=>_.lazy(()=>l().catch(t=>{var i,n,c;throw t&&(t.name==="ChunkLoadError"||((i=t.message)==null?void 0:i.includes("Failed to fetch dynamically imported module"))||((n=t.message)==null?void 0:n.includes("Importing a module script failed"))||((c=t.message)==null?void 0:c.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Re=u(()=>m(()=>import("./Login-DTaQav9T.js"),__vite__mapDeps([0,1,2]))),Pe=u(()=>m(()=>import("./AdminDashboard-BZ7-8imq.js"),__vite__mapDeps([3,1,2]))),Ae=u(()=>m(()=>import("./ClientList-BduV8eP7.js"),__vite__mapDeps([4,1,2,5,6]))),Ie=u(()=>m(()=>import("./DepartmentList-Cu0LkYqI.js"),__vite__mapDeps([7,1,2,5,6]))),ze=u(()=>m(()=>import("./ManagerList-DxagmWMq.js"),__vite__mapDeps([8,1,2,5,6]))),De=u(()=>m(()=>import("./EmployeeList-D8KbVfRk.js"),__vite__mapDeps([9,1,2,5,6]))),Oe=u(()=>m(()=>import("./ProjectList-BDbP_MeS.js"),__vite__mapDeps([10,1,2,11,12,6]))),Te=u(()=>m(()=>import("./DeliverableList-8Y78bGlC.js"),__vite__mapDeps([13,1,2,5,6]))),Ne=u(()=>m(()=>import("./ReportDashboard-_gZfpw_w.js"),__vite__mapDeps([14,1,2]))),Me=u(()=>m(()=>import("./SuperadminReports-BA12_nZ0.js"),__vite__mapDeps([15,1,2,5]))),Be=u(()=>m(()=>import("./ActivityTypeList-Bq94YXa6.js"),__vite__mapDeps([16,1,2,6]))),Ve=u(()=>m(()=>import("./LoginCredentials-BMa81oQo.js"),__vite__mapDeps([17,1,2,5]))),We=u(()=>m(()=>import("./WorkUpdates-C5GcBbUw.js"),__vite__mapDeps([18,1,2,19]))),O=u(()=>m(()=>import("./ClientPortal-CWRhz69H.js"),__vite__mapDeps([20,1,2]))),$e=u(()=>m(()=>import("./ManagerDashboard-D-2HqljN.js"),__vite__mapDeps([21,1,2]))),qe=u(()=>m(()=>import("./ManagerCalendar-tQgA7IBF.js"),__vite__mapDeps([22,1,2,11,12,6]))),Fe=u(()=>m(()=>import("./ManagerDailyTodo-kP1v4Dfh.js"),__vite__mapDeps([23,1,2]))),Ye=u(()=>m(()=>import("./DesignerWorkload-DJ78C7VT.js"),__vite__mapDeps([24,1,2,25]))),Ue=u(()=>m(()=>import("./CompletedWorks-DRZvM3Ek.js"),__vite__mapDeps([26,1,2,27]))),Je=u(()=>m(()=>import("./ManagerSubmissionsReview-YSwQ4NQp.js"),__vite__mapDeps([28,1,2]))),He=u(()=>m(()=>import("./ManagerClientRework-Bna9Ucrj.js"),__vite__mapDeps([29,1,2]))),Ge=u(()=>m(()=>import("./ManagerJobWorks-QL0cMB9D.js"),__vite__mapDeps([30,1,2,5]))),Ke=u(()=>m(()=>import("./ManagerSubDepartmentList-C8lQGkFV.js"),__vite__mapDeps([31,1,2]))),Qe=u(()=>m(()=>import("./ManagerEmployeeList-D5YJfQKp.js"),__vite__mapDeps([32,1,2,5,33,34]))),Xe=u(()=>m(()=>import("./ManagerEfficiency-hxr8z3vp.js"),__vite__mapDeps([33,1,2,34]))),Q=u(()=>m(()=>import("./SMMTodayPosting-Cih9EBIg.js"),__vite__mapDeps([35,1,2]))),X=u(()=>m(()=>import("./SMMMonthlyPosting-D2a7Qt8e.js"),__vite__mapDeps([36,1,2,5]))),Z=u(()=>m(()=>import("./SMMPosted-BgGhei5S.js"),__vite__mapDeps([37,1,2,5]))),Ze=u(()=>m(()=>import("./WritersAssignment-Bhih03gr.js"),__vite__mapDeps([38,1,2]))),et=u(()=>m(()=>import("./EmployeeDashboard-DWk-a-VL.js"),__vite__mapDeps([39,1,2]))),tt=u(()=>m(()=>import("./EmployeeCalendar-Cl7LrEey.js"),__vite__mapDeps([40,1,2,11,12,6]))),q=u(()=>m(()=>import("./EmployeeEventCalendar-B8mitxS4.js"),__vite__mapDeps([41,1,2]))),st=u(()=>m(()=>import("./EmployeeAssignedWork-CrtRj4R1.js"),__vite__mapDeps([42,1,2]))),nt=u(()=>m(()=>import("./EmployeeReassignedWork-CkExQm-w.js"),__vite__mapDeps([43,1,2]))),ot=u(()=>m(()=>import("./EmployeeApprovedWork-U3KOozR9.js"),__vite__mapDeps([44,1,2,5]))),rt=u(()=>m(()=>import("./EmployeeTodayDeliverables-BemjL0eC.js"),__vite__mapDeps([45,1,2]))),at=u(()=>m(()=>import("./EmployeeRework-P7Yof3Mu.js"),__vite__mapDeps([46,1,2]))),it=u(()=>m(()=>import("./EmployeeOverallWork-Xj7i5cwn.js"),__vite__mapDeps([47,1,2]))),lt=u(()=>m(()=>import("./SuperAdminDashboard-BFDhv1xp.js"),__vite__mapDeps([48,1,2]))),ct=u(()=>m(()=>import("./SuperAdminClients-h2akV5Ua.js"),__vite__mapDeps([49,1,2,5]))),dt=u(()=>m(()=>import("./SuperAdminEfficiency-CdFdFbJg.js"),__vite__mapDeps([50,1,2,5]))),pt=u(()=>m(()=>import("./SuperAdminBranches-m2spi3jJ.js"),__vite__mapDeps([51,1,2,5]))),mt=u(()=>m(()=>import("./SuperAdminBranchDetail-C4-gAkwZ.js"),__vite__mapDeps([52,1,2,5]))),ut=u(()=>m(()=>import("./SuperAdminProfile-DBHRkJdA.js"),__vite__mapDeps([53,1,2]))),k=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),B=()=>{try{const l=localStorage.getItem("erp_user");return l?JSON.parse(l):null}catch{return null}},xt=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||B();return s?e.jsx(k,{}):!i||i.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},ht=()=>{const{isAuthenticated:l,user:t,isAdmin:s,loading:i}=C(),n=t||B(),c=s||n&&(n.role==="admin"||n.role==="super_admin");return i?e.jsx(k,{}):!n||!c?e.jsx(w,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},ft=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||B();return s?e.jsx(k,{}):!i||i.role!=="manager"&&i.role!=="admin"&&i.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},gt=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||B(),n=((i==null?void 0:i.username)||"").trim().toLowerCase(),c=i&&(i.role==="client"||i.user_type==="client"||n==="gem"||n==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(k,{}):c?e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]}):e.jsx(w,{to:"/login",replace:!0})},jt=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||B();return s?e.jsx(k,{}):!i||i.role!=="employee"?e.jsx(w,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})};function bt(){return e.jsx(je,{children:e.jsx(ke,{children:e.jsx(Ce,{children:e.jsx(L,{children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsxs(be,{children:[e.jsx(r,{path:"/login",element:e.jsx(Re,{})}),e.jsxs(r,{path:"/super-admin",element:e.jsx(xt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(lt,{})}),e.jsx(r,{path:"clients",element:e.jsx(ct,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(dt,{})}),e.jsx(r,{path:"branches",element:e.jsx(pt,{})}),e.jsx(r,{path:"branches/:id",element:e.jsx(mt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx(q,{})})}),e.jsx(r,{path:"profile",element:e.jsx(ut,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/admin",element:e.jsx(ht,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Pe,{})}),e.jsx(r,{path:"clients",element:e.jsx(Ae,{})}),e.jsx(r,{path:"departments",element:e.jsx(Ie,{})}),e.jsx(r,{path:"managers",element:e.jsx(ze,{})}),e.jsx(r,{path:"employees",element:e.jsx(De,{})}),e.jsx(r,{path:"projects",element:e.jsx(Oe,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx(q,{})})}),e.jsx(r,{path:"deliverables",element:e.jsx(Te,{})}),e.jsx(r,{path:"reports",element:e.jsx(Ne,{})}),e.jsx(r,{path:"superadmin-reports",element:e.jsx(Me,{})}),e.jsx(r,{path:"activity-types",element:e.jsx(Be,{})}),e.jsx(r,{path:"credentials",element:e.jsx(Ve,{})}),e.jsx(r,{path:"work-updates",element:e.jsx(We,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/manager",element:e.jsx(ft,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx($e,{})}),e.jsx(r,{path:"calendar",element:e.jsx(qe,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx(q,{})})}),e.jsx(r,{path:"daily-todo",element:e.jsx(Fe,{})}),e.jsx(r,{path:"designer-workload",element:e.jsx(Ye,{})}),e.jsx(r,{path:"completed-works",element:e.jsx(Ue,{})}),e.jsx(r,{path:"sub-departments",element:e.jsx(Ke,{})}),e.jsx(r,{path:"employees",element:e.jsx(Qe,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(Xe,{})}),e.jsx(r,{path:"submissions-review",element:e.jsx(L,{children:e.jsx(Je,{})})}),e.jsx(r,{path:"client-reworks",element:e.jsx(He,{})}),e.jsx(r,{path:"job-works",element:e.jsx(Ge,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Q,{})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(X,{})}),e.jsx(r,{path:"posted",element:e.jsx(Z,{})}),e.jsx(r,{path:"writers-assignment",element:e.jsx(L,{children:e.jsx(Ze,{})})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/employee",element:e.jsx(jt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(et,{})}),e.jsx(r,{path:"calendar",element:e.jsx(tt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx(q,{})})}),e.jsx(r,{path:"assigned-work",element:e.jsx(st,{})}),e.jsx(r,{path:"reassigned-work",element:e.jsx(nt,{})}),e.jsx(r,{path:"approved-work",element:e.jsx(ot,{})}),e.jsx(r,{path:"overall-work",element:e.jsx(it,{})}),e.jsx(r,{path:"today",element:e.jsx(rt,{})}),e.jsx(r,{path:"rework",element:e.jsx(at,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Q,{isEmployee:!0})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(X,{isEmployee:!0})}),e.jsx(r,{path:"posted",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/client",element:e.jsx(gt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(O,{activeTabProp:"dashboard"})}),e.jsx(r,{path:"approvals",element:e.jsx(O,{activeTabProp:"approvals"})}),e.jsx(r,{path:"reachskyline-approvals",element:e.jsx(O,{activeTabProp:"reachskyline_approvals"})}),e.jsx(r,{path:"reports",element:e.jsx(O,{activeTabProp:"reports"})}),e.jsx(r,{path:"contact",element:e.jsx(O,{activeTabProp:"contact"})}),e.jsx(r,{path:"portal",element:e.jsx(w,{to:"/client/dashboard",replace:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsx(r,{path:"*",element:e.jsx(w,{to:"/login",replace:!0})})]})})})})})})}window.alert=l=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const p=document.createElement("style");p.textContent=`
      #custom-alert-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
      }
      
      .custom-alert-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
      }
      
      .custom-alert-backdrop.show {
        opacity: 1;
      }
      
      .custom-alert-box {
        position: relative;
        background: rgba(30, 41, 59, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f8fafc;
        border-radius: 16px;
        padding: 28px 24px;
        width: 90%;
        max-width: 440px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
        transform: scale(0.9) translateY(20px);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .custom-alert-box.show {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      
      .custom-alert-icon-container {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        border: 1px solid rgba(245, 158, 11, 0.2);
      }

      .custom-alert-icon-container.success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border-color: rgba(16, 185, 129, 0.2);
      }

      .custom-alert-icon-container.error {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.2);
      }
      
      .custom-alert-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 10px 0;
        color: #f8fafc;
        letter-spacing: -0.01em;
      }
      
      .custom-alert-message {
        font-size: 14px;
        color: #94a3b8;
        margin: 0 0 24px 0;
        line-height: 1.6;
        word-break: break-word;
      }
      
      .custom-alert-btn {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: #ffffff;
        border: none;
        border-radius: 10px;
        padding: 10px 28px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        outline: none;
        transition: transform 0.1s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }
      
      .custom-alert-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
      }
      
      .custom-alert-btn:active {
        transform: translateY(1px);
      }
    `,document.head.appendChild(p),document.body.appendChild(t)}t.innerHTML="";let s="info",i="Notification";const n=(l||"").toLowerCase();n.includes("already approved")||n.includes("can't edit")||n.includes("cannot edit")?(s="info",i="Info"):n.includes("success")||n.includes("approve")||n.includes("submit")?(s="success",i="Success"):(n.includes("fail")||n.includes("error")||n.includes("invalid")||n.includes("please"))&&(s="error",i="Alert");let c="";s==="success"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const a=document.createElement("div");a.className="custom-alert-backdrop";const h=document.createElement("div");h.className="custom-alert-box",h.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${c}
    </div>
    <h3 class="custom-alert-title">${i}</h3>
    <p class="custom-alert-message">${l}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(a),t.appendChild(h);const g=()=>{h.classList.remove("show"),a.classList.remove("show"),setTimeout(()=>{t.contains(a)&&t.removeChild(a),t.contains(h)&&t.removeChild(h)},300)},b=h.querySelector(".custom-alert-btn");b.addEventListener("click",g),a.addEventListener("click",g),requestAnimationFrame(()=>{a.classList.add("show"),h.classList.add("show"),b.focus()})};window.confirm=l=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const b=document.createElement("style");b.textContent=`
        #custom-confirm-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        }
        
        .custom-confirm-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: auto;
        }
        
        .custom-confirm-backdrop.show {
          opacity: 1;
        }
        
        .custom-confirm-box {
          position: relative;
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          border-radius: 16px;
          padding: 28px 24px;
          width: 90%;
          max-width: 440px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
          transform: scale(0.9) translateY(20px);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .custom-confirm-box.show {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        
        .custom-confirm-icon-container {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .custom-confirm-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: #f8fafc;
          letter-spacing: -0.01em;
        }
        
        .custom-confirm-message {
          font-size: 14px;
          color: #94a3b8;
          margin: 0 0 24px 0;
          line-height: 1.6;
          word-break: break-word;
        }
        
        .custom-confirm-buttons {
          display: flex;
          gap: 12px;
          width: 100%;
          justify-content: center;
        }
        
        .custom-confirm-btn {
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
          flex: 1;
        }
        
        .custom-confirm-btn-cancel {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
        }
        
        .custom-confirm-btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
        }
        
        .custom-confirm-btn-confirm {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .custom-confirm-btn-confirm:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        
        .custom-confirm-btn-confirm:active {
          transform: translateY(1px);
        }
      `,document.head.appendChild(b),document.body.appendChild(s)}s.innerHTML="";const i=document.createElement("div");i.className="custom-confirm-backdrop";const n=document.createElement("div");n.className="custom-confirm-box";const c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';n.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${c}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${l}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(i),s.appendChild(n);const a=b=>{n.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{s.contains(i)&&s.removeChild(i),s.contains(n)&&s.removeChild(n),t(b)},300)},h=n.querySelector(".custom-confirm-btn-cancel"),g=n.querySelector(".custom-confirm-btn-confirm");h.addEventListener("click",()=>a(!1)),g.addEventListener("click",()=>a(!0)),i.addEventListener("click",()=>a(!1)),requestAnimationFrame(()=>{i.classList.add("show"),n.classList.add("show"),g.focus()})});if(typeof window<"u"){const l=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var i;const s=((i=t.reason)==null?void 0:i.message)||String(t.reason||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var i;const s=t.message||String(((i=t.error)==null?void 0:i.message)||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}_e.createRoot(document.getElementById("root")).render(e.jsx(te.StrictMode,{children:e.jsx(bt,{})}));export{Le as M,E as a,C as u};
