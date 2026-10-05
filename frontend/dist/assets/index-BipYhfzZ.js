const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-B4O1IboW.js","assets/vendor-react-BOhAFuIu.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-DFsSRMju.js","assets/ClientList-CoIKupgf.js","assets/Table-IuFOIPsN.js","assets/FormFields-CLChU1Uh.js","assets/DepartmentList-Dkl6umSw.js","assets/ManagerList-UYAVXCCF.js","assets/EmployeeList-DiXiillf.js","assets/ProjectList-DfqyTphZ.js","assets/ContentCalendarView-wn_9FxO3.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-BNaEPJZx.js","assets/ReportDashboard-NCqU3c8r.js","assets/SuperadminReports-CzqW2KuL.js","assets/ActivityTypeList-BAWYgdnK.js","assets/LoginCredentials-CxdeBaFv.js","assets/WorkUpdates-FKHVcA0f.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-ADFwLpXv.js","assets/ManagerDashboard-BKF_Iusj.js","assets/ManagerCalendar-C8q6Fko7.js","assets/ManagerDailyTodo-DvASaJm-.js","assets/DesignerWorkload-D5aB-hx8.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-Bjk1YhtI.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-BIxRwsb1.js","assets/ManagerClientRework-CToLdCTI.js","assets/ManagerJobWorks-BKOc7crH.js","assets/ManagerSubDepartmentList-CGdahOWT.js","assets/ManagerEmployeeList-07TZ4lQc.js","assets/ManagerEfficiency-Ekmw4RkD.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-2CTZ4jSS.js","assets/SMMMonthlyPosting-BfDaUMZI.js","assets/SMMPosted-DYYxkyLa.js","assets/WritersAssignment-CDUoCJgh.js","assets/EmployeeDashboard-DMy-N52N.js","assets/EmployeeCalendar-BSqjW0xL.js","assets/EmployeeEventCalendar-Uyo6WwIx.js","assets/EmployeeAssignedWork-CE82EM_1.js","assets/EmployeeReassignedWork-DTk688TO.js","assets/EmployeeApprovedWork-Bs6fPlnR.js","assets/EmployeeTodayDeliverables-De74zYa1.js","assets/EmployeeRework-DXueaM8k.js","assets/EmployeeOverallWork-CWuXwjUP.js","assets/SuperAdminDashboard-BiLhniHz.js","assets/SuperAdminClients-DyvSdpyk.js","assets/SuperAdminEfficiency-BDqPBLiA.js","assets/SuperAdminBranches-BaOyVQxa.js","assets/SuperAdminBranchDetail-CUaHMQJ4.js","assets/SuperAdminProfile-DrDQFgsn.js"])))=>i.map(i=>d[i]);
var ae=Object.defineProperty;var ie=(l,t,s)=>t in l?ae(l,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[t]=s;var J=(l,t,s)=>ie(l,typeof t!="symbol"?t+"":t,s);import{r as _,j as e,N as le,L as ce,a as C,C as I,F as V,B as W,P as de,b as K,U as P,c as z,d as pe,e as D,f as $,g as Y,R as F,h as me,K as ue,A as te,i as xe,G as he,X as se,M as fe,S as ge,k as be,l as je,m as oe,n as _e,o as ye,p as a,q as v,O,s as ve}from"./vendor-react-BOhAFuIu.js";import{f as we}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const p of n)if(p.type==="childList")for(const o of p.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const p={};return n.integrity&&(p.integrity=n.integrity),n.referrerPolicy&&(p.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?p.credentials="include":n.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function i(n){if(n.ep)return;n.ep=!0;const p=s(n);fetch(n.href,p)}})();const Ee="modulepreload",ke=function(l){return"/"+l},Q={},m=function(t,s,i){let n=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),f=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(s.map(g=>{if(g=ke(g),g in Q)return;Q[g]=!0;const j=g.endsWith(".css"),c=j?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${c}`))return;const x=document.createElement("link");if(x.rel=j?"stylesheet":Ee,j||(x.as="script"),x.crossOrigin="",x.href=g,f&&x.setAttribute("nonce",f),document.head.appendChild(x),j)return new Promise((b,d)=>{x.addEventListener("load",b),x.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${g}`)))})}))}function p(o){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=o,window.dispatchEvent(f),!f.defaultPrevented)throw o}return n.then(o=>{for(const f of o||[])f.status==="rejected"&&p(f.reason);return t().catch(p)})},Se=()=>{const l="http://localhost:5050/api";{const t=l.trim().replace(/\/+$/,"");return t==="/api"||t.startsWith("/api/")||t.endsWith("/api")?t:`${t}/api`}},w=we.create({baseURL:Se(),timeout:3e4,headers:{"Content-Type":"application/json"}});w.interceptors.request.use(l=>{const t=localStorage.getItem("erp_token");return t&&(l.headers.Authorization=`Bearer ${t}`),l},l=>Promise.reject(l));w.interceptors.response.use(l=>l,async l=>{var f,g,j;const{config:t,response:s}=l,i=((f=t==null?void 0:t.method)==null?void 0:f.toLowerCase())==="get",n=!s,p=s&&s.status>=500;if(t&&i&&(n||p)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${l.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(x=>setTimeout(x,c)),w(t)}if(s&&(s.status===401||s.status===403&&(((g=s.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((j=s.data)==null?void 0:j.errors)&&s.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))){const c=localStorage.getItem("erp_user");c&&(c.includes('"role":"client"')||c.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(l)});const ne=_.createContext(null),Ce=({children:l})=>{const[t,s]=_.useState(()=>{try{const c=localStorage.getItem("erp_user");return c?JSON.parse(c):null}catch{return null}}),[i,n]=_.useState(!1),p=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(x){var d,y;const b=async()=>{var r,k;try{const A=(k=(r=x.User)==null?void 0:r.PushSubscription)==null?void 0:k.id;A&&await w.post("/notifications/subscribe",{subscriptionId:A}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{x.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(r=>{console.warn("[OneSignal] Domain initialization deferred:",(r==null?void 0:r.message)||r)}),window.__oneSignalInitialized=!0}catch(r){console.warn("[OneSignal] Init warning:",r.message)}b();try{(y=(d=x.User)==null?void 0:d.PushSubscription)==null||y.addEventListener("change",function(r){var k;(k=r==null?void 0:r.current)!=null&&k.optedIn&&b()})}catch{}})}catch{}};_.useEffect(()=>{(async()=>{const x=localStorage.getItem("erp_token"),b=localStorage.getItem("erp_user");let d=null;try{d=b?JSON.parse(b):null}catch{}if(!x){if(d&&d.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(d),n(!1);return}s(null),n(!1);return}try{const y=await w.get("/auth/session");if(y.data&&y.data.success){const r=y.data.data.user;s(r),localStorage.setItem("erp_user",JSON.stringify(r))}else d&&d.role==="client"?s(d):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{d&&d.role==="client"&&s(d)}finally{n(!1)}})()},[]),_.useEffect(()=>{t&&p(t)},[t]);const o=async(c,x,b)=>{try{const d=await w.post("/auth/login",{username:c,password:x},{onRetry:b});if(d.data&&d.data.success){const{token:y,user:r}=d.data.data;return localStorage.setItem("erp_token",y||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(r)),s(r),n(!1),{success:!0}}}catch(d){console.error("[AuthContext] Login error caught:",d);let y="Wrong credentials! Invalid username or password.";d.response&&d.response.data&&d.response.data.message?y=d.response.data.message:d.code==="ECONNABORTED"||d.message&&d.message.includes("timeout")?y="Connection timed out. The server took too long to respond.":!d.response&&(d.code==="ERR_NETWORK"||d.message&&d.message.toLowerCase().includes("network"))?y="Network error: Cannot reach backend server. Please verify the server is running.":d.message&&(y=d.message);const r=d.response&&d.response.data&&d.response.data.errors?d.response.data.errors:[];return{success:!1,message:y,errors:r}}},f=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var x,b;try{const d=(b=(x=c.User)==null?void 0:x.PushSubscription)==null?void 0:b.id;d&&await w.post("/notifications/unsubscribe",{subscriptionId:d}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),n(!1)},g=c=>{s(x=>{if(!x)return null;const b={...x,...c};return localStorage.setItem("erp_user",JSON.stringify(b)),b})},j={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:i,login:o,logout:f,updateCurrentUser:g};return e.jsx(ne.Provider,{value:j,children:l})},L=()=>{const l=_.useContext(ne);return l||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Le=_.createContext(null),Re=({children:l})=>{const[t,s]=_.useState([]),[i,n]=_.useState(0),{isAuthenticated:p}=L(),o=_.useCallback(async()=>{if(p)try{const c=await w.get("/notifications");if(c.data&&c.data.success){const x=c.data.data.notifications;s(x);const b=x.filter(d=>!d.is_read).length;n(b)}}catch{}},[p]),f=async c=>{try{await w.patch(`/notifications/${c}/read`),s(x=>x.map(b=>b.id===parseInt(c)?{...b,is_read:1}:b)),n(x=>Math.max(0,x-1))}catch(x){console.error("Failed to mark notification as read:",x.message)}},g=async()=>{try{await w.post("/notifications/read-all"),s(c=>c.map(x=>({...x,is_read:1}))),n(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};_.useEffect(()=>{if(p){o();const c=setInterval(o,3e4);return()=>clearInterval(c)}else s([]),n(0)},[p,o]);const j={notifications:t,unreadCount:i,fetchNotifications:o,markAsRead:f,markAllRead:g};return e.jsx(Le.Provider,{value:j,children:l})},N=()=>{const{logout:l,user:t}=L(),s=()=>{const o=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(K,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(Y,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(te,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(P,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(xe,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(z,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(W,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(he,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&o.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(V,{size:20})}),o.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(me,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(ue,{size:20})}),o},i=()=>{var g,j,c,x,b;const o=window.location.pathname.startsWith("/client");if((t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||o)return[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(C,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(I,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(V,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(W,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(de,{size:20})}];if((t==null?void 0:t.role)==="super_admin")return[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(K,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(P,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(W,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(pe,{size:20})}];if((t==null?void 0:t.role)==="manager")return((g=t==null?void 0:t.managerProfile)==null?void 0:g.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(P,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(I,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(D,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(I,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx($,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(z,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(P,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(Y,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(P,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(W,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(V,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(F,{size:20})}];if((t==null?void 0:t.role)==="employee"){if(((j=t==null?void 0:t.employeeProfile)==null?void 0:j.department_code)==="SMM-RS")return[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(I,{size:20})}];const d=Number((c=t==null?void 0:t.employeeProfile)==null?void 0:c.sub_department_id),y=(x=t==null?void 0:t.employeeProfile)==null?void 0:x.sub_department_code,r=(((b=t==null?void 0:t.employeeProfile)==null?void 0:b.sub_department_name)||"").toLowerCase();return d===1||y==="CW-RS"||r.includes("writer")||r.includes("content")?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(z,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(V,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx($,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(I,{size:20})}]}return s()},n=()=>{document.body.classList.remove("mobile-sidebar-open")},p=i();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:n}),e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:p.map((o,f)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(le,{to:o.path,state:o.state,onClick:n,className:({isActive:g})=>`sidebar-link ${g?"active":""}`,children:[o.icon,e.jsx("span",{children:o.label})]})},f))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:l,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:o=>{o.currentTarget.style.color="#f87171"},onMouseLeave:o=>{o.currentTarget.style.color="var(--danger)"},children:[e.jsx(ce,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Pe=({isOpen:l,onClose:t,title:s,children:i,footer:n=null})=>(_.useEffect(()=>(l?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[l]),l?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:p=>p.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(se,{size:20})})]}),e.jsx("div",{className:"modal-body",children:i}),n&&e.jsx("div",{className:"modal-footer",children:n})]})}):null),M=()=>{var U;const{user:l,logout:t}=L(),[s,i]=_.useState(""),[n,p]=_.useState(!1),[o,f]=_.useState(null),[g,j]=_.useState(!1),[c,x]=_.useState(!1),b=()=>{const h=!c;x(h),h?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};_.useEffect(()=>{const h=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),x(!1))};return window.addEventListener("resize",h),()=>window.removeEventListener("resize",h)},[]);const d=async h=>{if(h.preventDefault(),!!s.trim()){p(!0),j(!0);try{const S=await w.get(`/search?q=${encodeURIComponent(s)}`);S.data&&S.data.success&&f(S.data.data)}catch(S){console.error("Global search error:",S.message)}finally{p(!1)}}},y=window.location.pathname.startsWith("/client"),r=y?l&&(l.role==="client"||l.user_type==="client")?l:{username:"gem",full_name:"rajesh kumar",role:"client"}:l,k=r&&r.username?r.username.slice(0,2).toUpperCase():"CL",A=()=>{var h,S,H,G;return y||(r==null?void 0:r.role)==="client"?"Client Partner":(r==null?void 0:r.role)==="manager"?((h=r==null?void 0:r.managerProfile)==null?void 0:h.department_code)==="SMM-RS"?"SMM Manager":(S=r==null?void 0:r.managerProfile)!=null&&S.department_name?`${r.managerProfile.department_name} Manager`:"Brand Manager":(r==null?void 0:r.role)==="employee"?((H=r==null?void 0:r.employeeProfile)==null?void 0:H.department_code)==="SMM-RS"?"SMM Employee":(G=r==null?void 0:r.employeeProfile)!=null&&G.department_name?`${r.employeeProfile.department_name} Employee`:"Employee":(r==null?void 0:r.role)==="admin"?"Administrator":(r==null?void 0:r.role)==="super_admin"?"Super Administrator":(r==null?void 0:r.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:b,"aria-label":"Toggle Navigation",children:c?e.jsx(se,{size:24}):e.jsx(fe,{size:24})}),e.jsx("form",{onSubmit:d,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(ge,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:s,onChange:h=>i(h.target.value)})]})})]}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:k}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((U=r==null?void 0:r.clientProfile)==null?void 0:U.company_name)||(r==null?void 0:r.full_name)||(r==null?void 0:r.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:A()})]})]})}),e.jsx(Pe,{isOpen:g,onClose:()=>{j(!1),f(null)},title:`Search Results for "${s}"`,children:n?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):o?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[o.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(be,{size:16,className:"text-primary"})," Clients (",o.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.clients.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${h.id}`,style:{fontWeight:600},children:h.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[h.client_name," • ",h.client_id_code]})]},h.id))})]}),o.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(Y,{size:16,className:"text-teal"})," Departments (",o.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.departments.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${h.id}`,style:{fontWeight:600},children:h.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:h.code})]},h.id))})]}),o.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(te,{size:16,className:"text-secondary"})," Managers (",o.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.managers.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${h.id}`,style:{fontWeight:600},children:h.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[h.manager_id_code," • ",h.department_name]})]},h.id))})]}),o.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(P,{size:16,className:"text-purple"})," Employees (",o.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.employees.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${h.id}`,style:{fontWeight:600},children:h.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[h.employee_id_code," • ",h.department_name]})]},h.id))})]}),o.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(je,{size:16,className:"text-orange"})," Projects (",o.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.projects.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${h.id}`,style:{fontWeight:600},children:h.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",h.client_name," • Manager: ",h.manager_name]})]},h.id))})]}),o.clients.length===0&&o.departments.length===0&&o.managers.length===0&&o.employees.length===0&&o.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',s,'".']})})]}):null})]})};class R extends oe.Component{constructor(s){super(s);J(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,i){var p,o,f;if(console.error("ErrorBoundary caught an error:",s,i),this.setState({errorInfo:i}),s&&(s.name==="ChunkLoadError"||((p=s.message)==null?void 0:p.includes("Failed to fetch dynamically imported module"))||((o=s.message)==null?void 0:o.includes("Importing a module script failed"))||((f=s.message)==null?void 0:f.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,i;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((i=this.state.errorInfo)==null?void 0:i.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const u=l=>_.lazy(()=>l().catch(t=>{var i,n,p;throw t&&(t.name==="ChunkLoadError"||((i=t.message)==null?void 0:i.includes("Failed to fetch dynamically imported module"))||((n=t.message)==null?void 0:n.includes("Importing a module script failed"))||((p=t.message)==null?void 0:p.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Ae=u(()=>m(()=>import("./Login-B4O1IboW.js"),__vite__mapDeps([0,1,2]))),Ie=u(()=>m(()=>import("./AdminDashboard-DFsSRMju.js"),__vite__mapDeps([3,1,2]))),ze=u(()=>m(()=>import("./ClientList-CoIKupgf.js"),__vite__mapDeps([4,1,2,5,6]))),De=u(()=>m(()=>import("./DepartmentList-Dkl6umSw.js"),__vite__mapDeps([7,1,2,5,6]))),Te=u(()=>m(()=>import("./ManagerList-UYAVXCCF.js"),__vite__mapDeps([8,1,2,5,6]))),Oe=u(()=>m(()=>import("./EmployeeList-DiXiillf.js"),__vite__mapDeps([9,1,2,5,6]))),Ne=u(()=>m(()=>import("./ProjectList-DfqyTphZ.js"),__vite__mapDeps([10,1,2,11,12,6]))),Me=u(()=>m(()=>import("./DeliverableList-BNaEPJZx.js"),__vite__mapDeps([13,1,2,5,6]))),Be=u(()=>m(()=>import("./ReportDashboard-NCqU3c8r.js"),__vite__mapDeps([14,1,2]))),Ve=u(()=>m(()=>import("./SuperadminReports-CzqW2KuL.js"),__vite__mapDeps([15,1,2,5]))),We=u(()=>m(()=>import("./ActivityTypeList-BAWYgdnK.js"),__vite__mapDeps([16,1,2,6]))),$e=u(()=>m(()=>import("./LoginCredentials-CxdeBaFv.js"),__vite__mapDeps([17,1,2,5]))),qe=u(()=>m(()=>import("./WorkUpdates-FKHVcA0f.js"),__vite__mapDeps([18,1,2,19]))),T=u(()=>m(()=>import("./ClientPortal-ADFwLpXv.js"),__vite__mapDeps([20,1,2]))),Fe=u(()=>m(()=>import("./ManagerDashboard-BKF_Iusj.js"),__vite__mapDeps([21,1,2]))),Ye=u(()=>m(()=>import("./ManagerCalendar-C8q6Fko7.js"),__vite__mapDeps([22,1,2,11,12,6]))),Ue=u(()=>m(()=>import("./ManagerDailyTodo-DvASaJm-.js"),__vite__mapDeps([23,1,2]))),He=u(()=>m(()=>import("./DesignerWorkload-D5aB-hx8.js"),__vite__mapDeps([24,1,2,25]))),Ge=u(()=>m(()=>import("./CompletedWorks-Bjk1YhtI.js"),__vite__mapDeps([26,1,2,27]))),Je=u(()=>m(()=>import("./ManagerSubmissionsReview-BIxRwsb1.js"),__vite__mapDeps([28,1,2]))),Ke=u(()=>m(()=>import("./ManagerClientRework-CToLdCTI.js"),__vite__mapDeps([29,1,2]))),Qe=u(()=>m(()=>import("./ManagerJobWorks-BKOc7crH.js"),__vite__mapDeps([30,1,2,5]))),Xe=u(()=>m(()=>import("./ManagerSubDepartmentList-CGdahOWT.js"),__vite__mapDeps([31,1,2]))),Ze=u(()=>m(()=>import("./ManagerEmployeeList-07TZ4lQc.js"),__vite__mapDeps([32,1,2,5,33,34]))),et=u(()=>m(()=>import("./ManagerEfficiency-Ekmw4RkD.js"),__vite__mapDeps([33,1,2,34]))),X=u(()=>m(()=>import("./SMMTodayPosting-2CTZ4jSS.js"),__vite__mapDeps([35,1,2]))),Z=u(()=>m(()=>import("./SMMMonthlyPosting-BfDaUMZI.js"),__vite__mapDeps([36,1,2,5]))),ee=u(()=>m(()=>import("./SMMPosted-DYYxkyLa.js"),__vite__mapDeps([37,1,2,5]))),tt=u(()=>m(()=>import("./WritersAssignment-CDUoCJgh.js"),__vite__mapDeps([38,1,2]))),st=u(()=>m(()=>import("./EmployeeDashboard-DMy-N52N.js"),__vite__mapDeps([39,1,2]))),ot=u(()=>m(()=>import("./EmployeeCalendar-BSqjW0xL.js"),__vite__mapDeps([40,1,2,11,12,6]))),q=u(()=>m(()=>import("./EmployeeEventCalendar-Uyo6WwIx.js"),__vite__mapDeps([41,1,2]))),nt=u(()=>m(()=>import("./EmployeeAssignedWork-CE82EM_1.js"),__vite__mapDeps([42,1,2]))),rt=u(()=>m(()=>import("./EmployeeReassignedWork-DTk688TO.js"),__vite__mapDeps([43,1,2]))),at=u(()=>m(()=>import("./EmployeeApprovedWork-Bs6fPlnR.js"),__vite__mapDeps([44,1,2,5]))),it=u(()=>m(()=>import("./EmployeeTodayDeliverables-De74zYa1.js"),__vite__mapDeps([45,1,2]))),lt=u(()=>m(()=>import("./EmployeeRework-DXueaM8k.js"),__vite__mapDeps([46,1,2]))),ct=u(()=>m(()=>import("./EmployeeOverallWork-CWuXwjUP.js"),__vite__mapDeps([47,1,2]))),dt=u(()=>m(()=>import("./SuperAdminDashboard-BiLhniHz.js"),__vite__mapDeps([48,1,2]))),pt=u(()=>m(()=>import("./SuperAdminClients-DyvSdpyk.js"),__vite__mapDeps([49,1,2,5]))),mt=u(()=>m(()=>import("./SuperAdminEfficiency-BDqPBLiA.js"),__vite__mapDeps([50,1,2,5]))),ut=u(()=>m(()=>import("./SuperAdminBranches-BaOyVQxa.js"),__vite__mapDeps([51,1,2,5]))),xt=u(()=>m(()=>import("./SuperAdminBranchDetail-CUaHMQJ4.js"),__vite__mapDeps([52,1,2,5]))),ht=u(()=>m(()=>import("./SuperAdminProfile-DrDQFgsn.js"),__vite__mapDeps([53,1,2]))),E=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),B=()=>{try{const l=localStorage.getItem("erp_user");return l?JSON.parse(l):null}catch{return null}},ft=()=>{const{isAuthenticated:l,user:t,loading:s}=L(),i=t||B();return s?e.jsx(E,{}):!i||i.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(O,{})})})]})]})},gt=()=>{const{isAuthenticated:l,user:t,isAdmin:s,loading:i}=L(),n=t||B(),p=s||n&&(n.role==="admin"||n.role==="super_admin");return i?e.jsx(E,{}):!n||!p?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(O,{})})})]})]})},bt=()=>{const{isAuthenticated:l,user:t,loading:s}=L(),i=t||B();return s?e.jsx(E,{}):!i||i.role!=="manager"&&i.role!=="admin"&&i.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(O,{})})})]})]})},jt=()=>{const{isAuthenticated:l,user:t,loading:s}=L(),i=t||B(),n=((i==null?void 0:i.username)||"").trim().toLowerCase(),p=i&&(i.role==="client"||i.user_type==="client"||n==="gem"||n==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(E,{}):p?e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(O,{})})})]})]}):e.jsx(v,{to:"/login",replace:!0})},_t=()=>{const{isAuthenticated:l,user:t,loading:s}=L(),i=t||B();return s?e.jsx(E,{}):!i||i.role!=="employee"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(O,{})})})]})]})};function yt(){return e.jsx(_e,{children:e.jsx(Ce,{children:e.jsx(Re,{children:e.jsx(R,{children:e.jsx(_.Suspense,{fallback:e.jsx(E,{}),children:e.jsxs(ye,{children:[e.jsx(a,{path:"/login",element:e.jsx(Ae,{})}),e.jsxs(a,{path:"/super-admin",element:e.jsx(ft,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(dt,{})}),e.jsx(a,{path:"clients",element:e.jsx(pt,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(mt,{})}),e.jsx(a,{path:"branches",element:e.jsx(ut,{})}),e.jsx(a,{path:"branches/:id",element:e.jsx(xt,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(q,{})})}),e.jsx(a,{path:"profile",element:e.jsx(ht,{})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/admin",element:e.jsx(gt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Ie,{})}),e.jsx(a,{path:"clients",element:e.jsx(ze,{})}),e.jsx(a,{path:"departments",element:e.jsx(De,{})}),e.jsx(a,{path:"managers",element:e.jsx(Te,{})}),e.jsx(a,{path:"employees",element:e.jsx(Oe,{})}),e.jsx(a,{path:"projects",element:e.jsx(Ne,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(q,{})})}),e.jsx(a,{path:"deliverables",element:e.jsx(Me,{})}),e.jsx(a,{path:"reports",element:e.jsx(Be,{})}),e.jsx(a,{path:"superadmin-reports",element:e.jsx(Ve,{})}),e.jsx(a,{path:"activity-types",element:e.jsx(We,{})}),e.jsx(a,{path:"credentials",element:e.jsx($e,{})}),e.jsx(a,{path:"work-updates",element:e.jsx(qe,{})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/manager",element:e.jsx(bt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Fe,{})}),e.jsx(a,{path:"calendar",element:e.jsx(Ye,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(q,{})})}),e.jsx(a,{path:"daily-todo",element:e.jsx(Ue,{})}),e.jsx(a,{path:"designer-workload",element:e.jsx(He,{})}),e.jsx(a,{path:"completed-works",element:e.jsx(Ge,{})}),e.jsx(a,{path:"sub-departments",element:e.jsx(Xe,{})}),e.jsx(a,{path:"employees",element:e.jsx(Ze,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(et,{})}),e.jsx(a,{path:"submissions-review",element:e.jsx(R,{children:e.jsx(Je,{})})}),e.jsx(a,{path:"client-reworks",element:e.jsx(Ke,{})}),e.jsx(a,{path:"job-works",element:e.jsx(Qe,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(X,{})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(Z,{})}),e.jsx(a,{path:"posted",element:e.jsx(ee,{})}),e.jsx(a,{path:"writers-assignment",element:e.jsx(R,{children:e.jsx(tt,{})})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/employee",element:e.jsx(_t,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(st,{})}),e.jsx(a,{path:"calendar",element:e.jsx(ot,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(q,{})})}),e.jsx(a,{path:"assigned-work",element:e.jsx(nt,{})}),e.jsx(a,{path:"reassigned-work",element:e.jsx(rt,{})}),e.jsx(a,{path:"approved-work",element:e.jsx(at,{})}),e.jsx(a,{path:"overall-work",element:e.jsx(ct,{})}),e.jsx(a,{path:"today",element:e.jsx(it,{})}),e.jsx(a,{path:"rework",element:e.jsx(lt,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(X,{isEmployee:!0})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(a,{path:"posted",element:e.jsx(ee,{isEmployee:!0})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/client",element:e.jsx(jt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(T,{activeTabProp:"dashboard"})}),e.jsx(a,{path:"approvals",element:e.jsx(T,{activeTabProp:"approvals"})}),e.jsx(a,{path:"reachskyline-approvals",element:e.jsx(T,{activeTabProp:"reachskyline_approvals"})}),e.jsx(a,{path:"reports",element:e.jsx(T,{activeTabProp:"reports"})}),e.jsx(a,{path:"contact",element:e.jsx(T,{activeTabProp:"contact"})}),e.jsx(a,{path:"portal",element:e.jsx(v,{to:"/client/dashboard",replace:!0})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsx(a,{path:"*",element:e.jsx(v,{to:"/login",replace:!0})})]})})})})})})}window.alert=l=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let s="info",i="Notification";const n=(l||"").toLowerCase();n.includes("already approved")||n.includes("can't edit")||n.includes("cannot edit")?(s="info",i="Info"):n.includes("success")||n.includes("approve")||n.includes("submit")?(s="success",i="Success"):(n.includes("fail")||n.includes("error")||n.includes("invalid")||n.includes("please"))&&(s="error",i="Alert");let p="";s==="success"?p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const o=document.createElement("div");o.className="custom-alert-backdrop";const f=document.createElement("div");f.className="custom-alert-box",f.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${p}
    </div>
    <h3 class="custom-alert-title">${i}</h3>
    <p class="custom-alert-message">${l}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(o),t.appendChild(f);const g=()=>{f.classList.remove("show"),o.classList.remove("show"),setTimeout(()=>{t.contains(o)&&t.removeChild(o),t.contains(f)&&t.removeChild(f)},300)},j=f.querySelector(".custom-alert-btn");j.addEventListener("click",g),o.addEventListener("click",g),requestAnimationFrame(()=>{o.classList.add("show"),f.classList.add("show"),j.focus()})};window.confirm=l=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const j=document.createElement("style");j.textContent=`
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
      `,document.head.appendChild(j),document.body.appendChild(s)}s.innerHTML="";const i=document.createElement("div");i.className="custom-confirm-backdrop";const n=document.createElement("div");n.className="custom-confirm-box";const p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';n.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${p}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${l}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(i),s.appendChild(n);const o=j=>{n.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{s.contains(i)&&s.removeChild(i),s.contains(n)&&s.removeChild(n),t(j)},300)},f=n.querySelector(".custom-confirm-btn-cancel"),g=n.querySelector(".custom-confirm-btn-confirm");f.addEventListener("click",()=>o(!1)),g.addEventListener("click",()=>o(!0)),i.addEventListener("click",()=>o(!1)),requestAnimationFrame(()=>{i.classList.add("show"),n.classList.add("show"),g.focus()})});if(typeof window<"u"){const l=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var i;const s=((i=t.reason)==null?void 0:i.message)||String(t.reason||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var i;const s=t.message||String(((i=t.error)==null?void 0:i.message)||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}ve.createRoot(document.getElementById("root")).render(e.jsx(oe.StrictMode,{children:e.jsx(yt,{})}));export{Pe as M,w as a,L as u};
