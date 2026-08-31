const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-DS5sGZ88.js","assets/vendor-react-BOhAFuIu.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-5uPuF-Sr.js","assets/ClientList-DhelRm6G.js","assets/Table-IuFOIPsN.js","assets/FormFields-CLChU1Uh.js","assets/DepartmentList-DChFX5jy.js","assets/ManagerList-BmNVN7g2.js","assets/EmployeeList-BUDtYp70.js","assets/ProjectList-ZT5O6vjX.js","assets/ContentCalendarView-C8HetA9E.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList--DWaUzwG.js","assets/ReportDashboard-ogKaTIX-.js","assets/SuperadminReports-ilL-FfwV.js","assets/ActivityTypeList-DeRxdhit.js","assets/LoginCredentials-BL17lWVs.js","assets/WorkUpdates-D340j_bS.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-DcZfyQTT.js","assets/ManagerDashboard-CzZtpezt.js","assets/ManagerCalendar-Cj-9FdsB.js","assets/ManagerDailyTodo-BxCHKEPw.js","assets/DesignerWorkload-DcdovVw4.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-BR-ieGd3.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-AdH5zDRr.js","assets/ManagerClientRework-BuNY3NN0.js","assets/ManagerJobWorks-BCADbvn7.js","assets/ManagerSubDepartmentList-BZzX7p7d.js","assets/ManagerEmployeeList-CGFIaDJ_.js","assets/ManagerEfficiency-px_TjjEt.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-hr1Sd7H-.js","assets/SMMMonthlyPosting-DtDW75en.js","assets/SMMPosted-Cr4tlPNp.js","assets/WritersAssignment-CARSiGbn.js","assets/EmployeeDashboard-CP-fYeu6.js","assets/EmployeeCalendar-btzD8L7-.js","assets/EmployeeEventCalendar-B420fWY5.js","assets/EmployeeAssignedWork-CZ65hjnb.js","assets/EmployeeReassignedWork-CzZ_KMIl.js","assets/EmployeeApprovedWork-ClE0Gn75.js","assets/EmployeeTodayDeliverables-DP7urKyA.js","assets/EmployeeRework-qLtmokgN.js","assets/EmployeeOverallWork-BjEeOhPL.js","assets/SuperAdminDashboard-DnhCRjCo.js","assets/SuperAdminClients-c7f45nYR.js","assets/SuperAdminEfficiency-D9Ev9yg8.js","assets/SuperAdminBranches-KPfeR4iB.js","assets/SuperAdminBranchDetail-6M9Tf0TX.js","assets/SuperAdminProfile-Cv4yK715.js"])))=>i.map(i=>d[i]);
var ae=Object.defineProperty;var ie=(l,t,s)=>t in l?ae(l,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[t]=s;var G=(l,t,s)=>ie(l,typeof t!="symbol"?t+"":t,s);import{r as b,j as e,N as le,L as ce,a as S,C as I,F as z,B as W,P as de,b as K,U as P,c as D,d as pe,e as T,f as $,g as Y,R as F,h as me,K as ue,A as te,i as xe,G as he,X as se,M as fe,S as ge,k as je,l as be,m as ne,n as _e,o as ye,p as a,q as v,O as N,s as ve}from"./vendor-react-BOhAFuIu.js";import{f as we}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const d of o)if(d.type==="childList")for(const n of d.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function s(o){const d={};return o.integrity&&(d.integrity=o.integrity),o.referrerPolicy&&(d.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?d.credentials="include":o.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function i(o){if(o.ep)return;o.ep=!0;const d=s(o);fetch(o.href,d)}})();const Ee="modulepreload",ke=function(l){return"/"+l},Q={},p=function(t,s,i){let o=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),h=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));o=Promise.allSettled(s.map(g=>{if(g=ke(g),g in Q)return;Q[g]=!0;const j=g.endsWith(".css"),c=j?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${c}`))return;const x=document.createElement("link");if(x.rel=j?"stylesheet":Ee,j||(x.as="script"),x.crossOrigin="",x.href=g,h&&x.setAttribute("nonce",h),document.head.appendChild(x),j)return new Promise((_,f)=>{x.addEventListener("load",_),x.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${g}`)))})}))}function d(n){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=n,window.dispatchEvent(h),!h.defaultPrevented)throw n}return o.then(n=>{for(const h of n||[])h.status==="rejected"&&d(h.reason);return t().catch(d)})},Se=()=>{const l="https://api.reachskyline.com/api";{const t=l.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},w=we.create({baseURL:Se(),timeout:3e4,headers:{"Content-Type":"application/json"}});w.interceptors.request.use(l=>{const t=localStorage.getItem("erp_token");return t&&(l.headers.Authorization=`Bearer ${t}`),l},l=>Promise.reject(l));w.interceptors.response.use(l=>l,async l=>{var h,g,j;const{config:t,response:s}=l,i=((h=t==null?void 0:t.method)==null?void 0:h.toLowerCase())==="get",o=!s,d=s&&s.status>=500;if(t&&i&&(o||d)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${l.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(x=>setTimeout(x,c)),w(t)}if(s&&(s.status===401||s.status===403&&(((g=s.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((j=s.data)==null?void 0:j.errors)&&s.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))){const c=localStorage.getItem("erp_user");c&&(c.includes('"role":"client"')||c.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(l)});const oe=b.createContext(null),Ce=({children:l})=>{const[t,s]=b.useState(()=>{try{const c=localStorage.getItem("erp_user");return c?JSON.parse(c):null}catch{return null}}),[i,o]=b.useState(!1),d=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(x){var f,y;const _=async()=>{var r,L;try{const A=(L=(r=x.User)==null?void 0:r.PushSubscription)==null?void 0:L.id;A&&await w.post("/notifications/subscribe",{subscriptionId:A}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{x.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(r=>{console.warn("[OneSignal] Domain initialization deferred:",(r==null?void 0:r.message)||r)}),window.__oneSignalInitialized=!0}catch(r){console.warn("[OneSignal] Init warning:",r.message)}_();try{(y=(f=x.User)==null?void 0:f.PushSubscription)==null||y.addEventListener("change",function(r){var L;(L=r==null?void 0:r.current)!=null&&L.optedIn&&_()})}catch{}})}catch{}};b.useEffect(()=>{(async()=>{const x=localStorage.getItem("erp_token"),_=localStorage.getItem("erp_user");let f=null;try{f=_?JSON.parse(_):null}catch{}if(!x){if(f&&f.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(f),o(!1);return}s(null),o(!1);return}try{const y=await w.get("/auth/session");if(y.data&&y.data.success){const r=y.data.data.user;s(r),localStorage.setItem("erp_user",JSON.stringify(r))}else f&&f.role==="client"?s(f):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{f&&f.role==="client"&&s(f)}finally{o(!1)}})()},[]),b.useEffect(()=>{t&&d(t)},[t]);const n=async(c,x,_)=>{try{const f=await w.post("/auth/login",{username:c,password:x},{onRetry:_});if(f.data&&f.data.success){const{token:y,user:r}=f.data.data;return localStorage.setItem("erp_token",y||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(r)),s(r),o(!1),{success:!0}}}catch(f){const y=f.response&&f.response.data&&f.response.data.message?f.response.data.message:"Wrong credentials! Invalid username or password.",r=f.response&&f.response.data&&f.response.data.errors?f.response.data.errors:[];return{success:!1,message:y,errors:r}}},h=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var x,_;try{const f=(_=(x=c.User)==null?void 0:x.PushSubscription)==null?void 0:_.id;f&&await w.post("/notifications/unsubscribe",{subscriptionId:f}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),o(!1)},g=c=>{s(x=>{if(!x)return null;const _={...x,...c};return localStorage.setItem("erp_user",JSON.stringify(_)),_})},j={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:i,login:n,logout:h,updateCurrentUser:g};return e.jsx(oe.Provider,{value:j,children:l})},C=()=>{const l=b.useContext(oe);return l||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Le=b.createContext(null),Re=({children:l})=>{const[t,s]=b.useState([]),[i,o]=b.useState(0),{isAuthenticated:d}=C(),n=b.useCallback(async()=>{if(d)try{const c=await w.get("/notifications");if(c.data&&c.data.success){const x=c.data.data.notifications;s(x);const _=x.filter(f=>!f.is_read).length;o(_)}}catch{}},[d]),h=async c=>{try{await w.patch(`/notifications/${c}/read`),s(x=>x.map(_=>_.id===parseInt(c)?{..._,is_read:1}:_)),o(x=>Math.max(0,x-1))}catch(x){console.error("Failed to mark notification as read:",x.message)}},g=async()=>{try{await w.post("/notifications/read-all"),s(c=>c.map(x=>({...x,is_read:1}))),o(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};b.useEffect(()=>{if(d){n();const c=setInterval(n,3e4);return()=>clearInterval(c)}else s([]),o(0)},[d,n]);const j={notifications:t,unreadCount:i,fetchNotifications:n,markAsRead:h,markAllRead:g};return e.jsx(Le.Provider,{value:j,children:l})},M=()=>{const{logout:l,user:t}=C(),s=()=>{const n=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(K,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(Y,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(te,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(P,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(xe,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(D,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(D,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(W,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(he,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&n.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(z,{size:20})}),n.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(me,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(ue,{size:20})}),n},i=()=>{var g,j,c;const n=window.location.pathname.startsWith("/client");return(t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||n?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(S,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(I,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(z,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(W,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(de,{size:20})}]:(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(K,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(P,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(D,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(W,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(pe,{size:20})}]:(t==null?void 0:t.role)==="manager"?((g=t==null?void 0:t.managerProfile)==null?void 0:g.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(P,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(T,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(I,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(T,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(I,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx($,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(D,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(P,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(Y,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(P,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(W,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(z,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(F,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(z,{size:20})}]:(t==null?void 0:t.role)==="employee"?((j=t==null?void 0:t.employeeProfile)==null?void 0:j.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(T,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(I,{size:20})}]:((c=t==null?void 0:t.employeeProfile)==null?void 0:c.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(D,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(T,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(z,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx($,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(T,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(I,{size:20})}]:s()},o=()=>{document.body.classList.remove("mobile-sidebar-open")},d=i();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:o}),e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:d.map((n,h)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(le,{to:n.path,state:n.state,onClick:o,className:({isActive:g})=>`sidebar-link ${g?"active":""}`,children:[n.icon,e.jsx("span",{children:n.label})]})},h))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:l,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:n=>{n.currentTarget.style.color="#f87171"},onMouseLeave:n=>{n.currentTarget.style.color="var(--danger)"},children:[e.jsx(ce,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Pe=({isOpen:l,onClose:t,title:s,children:i,footer:o=null})=>(b.useEffect(()=>(l?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[l]),l?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:d=>d.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(se,{size:20})})]}),e.jsx("div",{className:"modal-body",children:i}),o&&e.jsx("div",{className:"modal-footer",children:o})]})}):null),B=()=>{var U;const{user:l,logout:t}=C(),[s,i]=b.useState(""),[o,d]=b.useState(!1),[n,h]=b.useState(null),[g,j]=b.useState(!1),[c,x]=b.useState(!1),_=()=>{const u=!c;x(u),u?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};b.useEffect(()=>{const u=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),x(!1))};return window.addEventListener("resize",u),()=>window.removeEventListener("resize",u)},[]);const f=async u=>{if(u.preventDefault(),!!s.trim()){d(!0),j(!0);try{const k=await w.get(`/search?q=${encodeURIComponent(s)}`);k.data&&k.data.success&&h(k.data.data)}catch(k){console.error("Global search error:",k.message)}finally{d(!1)}}},y=window.location.pathname.startsWith("/client"),r=y?l&&(l.role==="client"||l.user_type==="client")?l:{username:"gem",full_name:"rajesh kumar",role:"client"}:l,L=r&&r.username?r.username.slice(0,2).toUpperCase():"CL",A=()=>{var u,k,H,J;return y||(r==null?void 0:r.role)==="client"?"Client Partner":(r==null?void 0:r.role)==="manager"?((u=r==null?void 0:r.managerProfile)==null?void 0:u.department_code)==="SMM-RS"?"SMM Manager":(k=r==null?void 0:r.managerProfile)!=null&&k.department_name?`${r.managerProfile.department_name} Manager`:"Brand Manager":(r==null?void 0:r.role)==="employee"?((H=r==null?void 0:r.employeeProfile)==null?void 0:H.department_code)==="SMM-RS"?"SMM Employee":(J=r==null?void 0:r.employeeProfile)!=null&&J.department_name?`${r.employeeProfile.department_name} Employee`:"Employee":(r==null?void 0:r.role)==="admin"?"Administrator":(r==null?void 0:r.role)==="super_admin"?"Super Administrator":(r==null?void 0:r.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:_,"aria-label":"Toggle Navigation",children:c?e.jsx(se,{size:24}):e.jsx(fe,{size:24})}),e.jsx("form",{onSubmit:f,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(ge,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:s,onChange:u=>i(u.target.value)})]})})]}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:L}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((U=r==null?void 0:r.clientProfile)==null?void 0:U.company_name)||(r==null?void 0:r.full_name)||(r==null?void 0:r.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:A()})]})]})}),e.jsx(Pe,{isOpen:g,onClose:()=>{j(!1),h(null)},title:`Search Results for "${s}"`,children:o?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):n?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[n.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(je,{size:16,className:"text-primary"})," Clients (",n.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.clients.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${u.id}`,style:{fontWeight:600},children:u.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[u.client_name," • ",u.client_id_code]})]},u.id))})]}),n.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(Y,{size:16,className:"text-teal"})," Departments (",n.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.departments.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${u.id}`,style:{fontWeight:600},children:u.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:u.code})]},u.id))})]}),n.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(te,{size:16,className:"text-secondary"})," Managers (",n.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.managers.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${u.id}`,style:{fontWeight:600},children:u.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[u.manager_id_code," • ",u.department_name]})]},u.id))})]}),n.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(P,{size:16,className:"text-purple"})," Employees (",n.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.employees.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${u.id}`,style:{fontWeight:600},children:u.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[u.employee_id_code," • ",u.department_name]})]},u.id))})]}),n.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(be,{size:16,className:"text-orange"})," Projects (",n.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.projects.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${u.id}`,style:{fontWeight:600},children:u.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",u.client_name," • Manager: ",u.manager_name]})]},u.id))})]}),n.clients.length===0&&n.departments.length===0&&n.managers.length===0&&n.employees.length===0&&n.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',s,'".']})})]}):null})]})};class R extends ne.Component{constructor(s){super(s);G(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,i){var d,n,h;if(console.error("ErrorBoundary caught an error:",s,i),this.setState({errorInfo:i}),s&&(s.name==="ChunkLoadError"||((d=s.message)==null?void 0:d.includes("Failed to fetch dynamically imported module"))||((n=s.message)==null?void 0:n.includes("Importing a module script failed"))||((h=s.message)==null?void 0:h.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,i;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((i=this.state.errorInfo)==null?void 0:i.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const m=l=>b.lazy(()=>l().catch(t=>{var i,o,d;throw t&&(t.name==="ChunkLoadError"||((i=t.message)==null?void 0:i.includes("Failed to fetch dynamically imported module"))||((o=t.message)==null?void 0:o.includes("Importing a module script failed"))||((d=t.message)==null?void 0:d.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Ae=m(()=>p(()=>import("./Login-DS5sGZ88.js"),__vite__mapDeps([0,1,2]))),Ie=m(()=>p(()=>import("./AdminDashboard-5uPuF-Sr.js"),__vite__mapDeps([3,1,2]))),ze=m(()=>p(()=>import("./ClientList-DhelRm6G.js"),__vite__mapDeps([4,1,2,5,6]))),De=m(()=>p(()=>import("./DepartmentList-DChFX5jy.js"),__vite__mapDeps([7,1,2,5,6]))),Te=m(()=>p(()=>import("./ManagerList-BmNVN7g2.js"),__vite__mapDeps([8,1,2,5,6]))),Oe=m(()=>p(()=>import("./EmployeeList-BUDtYp70.js"),__vite__mapDeps([9,1,2,5,6]))),Ne=m(()=>p(()=>import("./ProjectList-ZT5O6vjX.js"),__vite__mapDeps([10,1,2,11,12,6]))),Me=m(()=>p(()=>import("./DeliverableList--DWaUzwG.js"),__vite__mapDeps([13,1,2,5,6]))),Be=m(()=>p(()=>import("./ReportDashboard-ogKaTIX-.js"),__vite__mapDeps([14,1,2]))),Ve=m(()=>p(()=>import("./SuperadminReports-ilL-FfwV.js"),__vite__mapDeps([15,1,2,5]))),We=m(()=>p(()=>import("./ActivityTypeList-DeRxdhit.js"),__vite__mapDeps([16,1,2,6]))),$e=m(()=>p(()=>import("./LoginCredentials-BL17lWVs.js"),__vite__mapDeps([17,1,2,5]))),qe=m(()=>p(()=>import("./WorkUpdates-D340j_bS.js"),__vite__mapDeps([18,1,2,19]))),O=m(()=>p(()=>import("./ClientPortal-DcZfyQTT.js"),__vite__mapDeps([20,1,2]))),Fe=m(()=>p(()=>import("./ManagerDashboard-CzZtpezt.js"),__vite__mapDeps([21,1,2]))),Ye=m(()=>p(()=>import("./ManagerCalendar-Cj-9FdsB.js"),__vite__mapDeps([22,1,2,11,12,6]))),Ue=m(()=>p(()=>import("./ManagerDailyTodo-BxCHKEPw.js"),__vite__mapDeps([23,1,2]))),He=m(()=>p(()=>import("./DesignerWorkload-DcdovVw4.js"),__vite__mapDeps([24,1,2,25]))),Je=m(()=>p(()=>import("./CompletedWorks-BR-ieGd3.js"),__vite__mapDeps([26,1,2,27]))),Ge=m(()=>p(()=>import("./ManagerSubmissionsReview-AdH5zDRr.js"),__vite__mapDeps([28,1,2]))),Ke=m(()=>p(()=>import("./ManagerClientRework-BuNY3NN0.js"),__vite__mapDeps([29,1,2]))),Qe=m(()=>p(()=>import("./ManagerJobWorks-BCADbvn7.js"),__vite__mapDeps([30,1,2,5]))),Xe=m(()=>p(()=>import("./ManagerSubDepartmentList-BZzX7p7d.js"),__vite__mapDeps([31,1,2]))),Ze=m(()=>p(()=>import("./ManagerEmployeeList-CGFIaDJ_.js"),__vite__mapDeps([32,1,2,5,33,34]))),et=m(()=>p(()=>import("./ManagerEfficiency-px_TjjEt.js"),__vite__mapDeps([33,1,2,34]))),X=m(()=>p(()=>import("./SMMTodayPosting-hr1Sd7H-.js"),__vite__mapDeps([35,1,2]))),Z=m(()=>p(()=>import("./SMMMonthlyPosting-DtDW75en.js"),__vite__mapDeps([36,1,2,5]))),ee=m(()=>p(()=>import("./SMMPosted-Cr4tlPNp.js"),__vite__mapDeps([37,1,2,5]))),tt=m(()=>p(()=>import("./WritersAssignment-CARSiGbn.js"),__vite__mapDeps([38,1,2]))),st=m(()=>p(()=>import("./EmployeeDashboard-CP-fYeu6.js"),__vite__mapDeps([39,1,2]))),nt=m(()=>p(()=>import("./EmployeeCalendar-btzD8L7-.js"),__vite__mapDeps([40,1,2,11,12,6]))),q=m(()=>p(()=>import("./EmployeeEventCalendar-B420fWY5.js"),__vite__mapDeps([41,1,2]))),ot=m(()=>p(()=>import("./EmployeeAssignedWork-CZ65hjnb.js"),__vite__mapDeps([42,1,2]))),rt=m(()=>p(()=>import("./EmployeeReassignedWork-CzZ_KMIl.js"),__vite__mapDeps([43,1,2]))),at=m(()=>p(()=>import("./EmployeeApprovedWork-ClE0Gn75.js"),__vite__mapDeps([44,1,2,5]))),it=m(()=>p(()=>import("./EmployeeTodayDeliverables-DP7urKyA.js"),__vite__mapDeps([45,1,2]))),lt=m(()=>p(()=>import("./EmployeeRework-qLtmokgN.js"),__vite__mapDeps([46,1,2]))),ct=m(()=>p(()=>import("./EmployeeOverallWork-BjEeOhPL.js"),__vite__mapDeps([47,1,2]))),dt=m(()=>p(()=>import("./SuperAdminDashboard-DnhCRjCo.js"),__vite__mapDeps([48,1,2]))),pt=m(()=>p(()=>import("./SuperAdminClients-c7f45nYR.js"),__vite__mapDeps([49,1,2,5]))),mt=m(()=>p(()=>import("./SuperAdminEfficiency-D9Ev9yg8.js"),__vite__mapDeps([50,1,2,5]))),ut=m(()=>p(()=>import("./SuperAdminBranches-KPfeR4iB.js"),__vite__mapDeps([51,1,2,5]))),xt=m(()=>p(()=>import("./SuperAdminBranchDetail-6M9Tf0TX.js"),__vite__mapDeps([52,1,2,5]))),ht=m(()=>p(()=>import("./SuperAdminProfile-Cv4yK715.js"),__vite__mapDeps([53,1,2]))),E=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),V=()=>{try{const l=localStorage.getItem("erp_user");return l?JSON.parse(l):null}catch{return null}},ft=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||V();return s?e.jsx(E,{}):!i||i.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(M,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(B,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(N,{})})})]})]})},gt=()=>{const{isAuthenticated:l,user:t,isAdmin:s,loading:i}=C(),o=t||V(),d=s||o&&(o.role==="admin"||o.role==="super_admin");return i?e.jsx(E,{}):!o||!d?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(M,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(B,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(N,{})})})]})]})},jt=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||V();return s?e.jsx(E,{}):!i||i.role!=="manager"&&i.role!=="admin"&&i.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(M,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(B,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(N,{})})})]})]})},bt=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||V(),o=((i==null?void 0:i.username)||"").trim().toLowerCase(),d=i&&(i.role==="client"||i.user_type==="client"||o==="gem"||o==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(E,{}):d?e.jsxs("div",{className:"app-layout",children:[e.jsx(M,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(B,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(N,{})})})]})]}):e.jsx(v,{to:"/login",replace:!0})},_t=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||V();return s?e.jsx(E,{}):!i||i.role!=="employee"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(M,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(B,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(N,{})})})]})]})};function yt(){return e.jsx(_e,{children:e.jsx(Ce,{children:e.jsx(Re,{children:e.jsx(R,{children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsxs(ye,{children:[e.jsx(a,{path:"/login",element:e.jsx(Ae,{})}),e.jsxs(a,{path:"/super-admin",element:e.jsx(ft,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(dt,{})}),e.jsx(a,{path:"clients",element:e.jsx(pt,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(mt,{})}),e.jsx(a,{path:"branches",element:e.jsx(ut,{})}),e.jsx(a,{path:"branches/:id",element:e.jsx(xt,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(q,{})})}),e.jsx(a,{path:"profile",element:e.jsx(ht,{})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/admin",element:e.jsx(gt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Ie,{})}),e.jsx(a,{path:"clients",element:e.jsx(ze,{})}),e.jsx(a,{path:"departments",element:e.jsx(De,{})}),e.jsx(a,{path:"managers",element:e.jsx(Te,{})}),e.jsx(a,{path:"employees",element:e.jsx(Oe,{})}),e.jsx(a,{path:"projects",element:e.jsx(Ne,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(q,{})})}),e.jsx(a,{path:"deliverables",element:e.jsx(Me,{})}),e.jsx(a,{path:"reports",element:e.jsx(Be,{})}),e.jsx(a,{path:"superadmin-reports",element:e.jsx(Ve,{})}),e.jsx(a,{path:"activity-types",element:e.jsx(We,{})}),e.jsx(a,{path:"credentials",element:e.jsx($e,{})}),e.jsx(a,{path:"work-updates",element:e.jsx(qe,{})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/manager",element:e.jsx(jt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Fe,{})}),e.jsx(a,{path:"calendar",element:e.jsx(Ye,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(q,{})})}),e.jsx(a,{path:"daily-todo",element:e.jsx(Ue,{})}),e.jsx(a,{path:"designer-workload",element:e.jsx(He,{})}),e.jsx(a,{path:"completed-works",element:e.jsx(Je,{})}),e.jsx(a,{path:"sub-departments",element:e.jsx(Xe,{})}),e.jsx(a,{path:"employees",element:e.jsx(Ze,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(et,{})}),e.jsx(a,{path:"submissions-review",element:e.jsx(R,{children:e.jsx(Ge,{})})}),e.jsx(a,{path:"client-reworks",element:e.jsx(Ke,{})}),e.jsx(a,{path:"job-works",element:e.jsx(Qe,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(X,{})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(Z,{})}),e.jsx(a,{path:"posted",element:e.jsx(ee,{})}),e.jsx(a,{path:"writers-assignment",element:e.jsx(R,{children:e.jsx(tt,{})})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/employee",element:e.jsx(_t,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(st,{})}),e.jsx(a,{path:"calendar",element:e.jsx(nt,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(q,{})})}),e.jsx(a,{path:"assigned-work",element:e.jsx(ot,{})}),e.jsx(a,{path:"reassigned-work",element:e.jsx(rt,{})}),e.jsx(a,{path:"approved-work",element:e.jsx(at,{})}),e.jsx(a,{path:"overall-work",element:e.jsx(ct,{})}),e.jsx(a,{path:"today",element:e.jsx(it,{})}),e.jsx(a,{path:"rework",element:e.jsx(lt,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(X,{isEmployee:!0})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(a,{path:"posted",element:e.jsx(ee,{isEmployee:!0})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/client",element:e.jsx(bt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(O,{activeTabProp:"dashboard"})}),e.jsx(a,{path:"approvals",element:e.jsx(O,{activeTabProp:"approvals"})}),e.jsx(a,{path:"reachskyline-approvals",element:e.jsx(O,{activeTabProp:"reachskyline_approvals"})}),e.jsx(a,{path:"reports",element:e.jsx(O,{activeTabProp:"reports"})}),e.jsx(a,{path:"contact",element:e.jsx(O,{activeTabProp:"contact"})}),e.jsx(a,{path:"portal",element:e.jsx(v,{to:"/client/dashboard",replace:!0})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsx(a,{path:"*",element:e.jsx(v,{to:"/login",replace:!0})})]})})})})})})}window.alert=l=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let s="info",i="Notification";const o=(l||"").toLowerCase();o.includes("already approved")||o.includes("can't edit")||o.includes("cannot edit")?(s="info",i="Info"):o.includes("success")||o.includes("approve")||o.includes("submit")?(s="success",i="Success"):(o.includes("fail")||o.includes("error")||o.includes("invalid")||o.includes("please"))&&(s="error",i="Alert");let d="";s==="success"?d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const n=document.createElement("div");n.className="custom-alert-backdrop";const h=document.createElement("div");h.className="custom-alert-box",h.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${d}
    </div>
    <h3 class="custom-alert-title">${i}</h3>
    <p class="custom-alert-message">${l}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(n),t.appendChild(h);const g=()=>{h.classList.remove("show"),n.classList.remove("show"),setTimeout(()=>{t.contains(n)&&t.removeChild(n),t.contains(h)&&t.removeChild(h)},300)},j=h.querySelector(".custom-alert-btn");j.addEventListener("click",g),n.addEventListener("click",g),requestAnimationFrame(()=>{n.classList.add("show"),h.classList.add("show"),j.focus()})};window.confirm=l=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const j=document.createElement("style");j.textContent=`
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
      `,document.head.appendChild(j),document.body.appendChild(s)}s.innerHTML="";const i=document.createElement("div");i.className="custom-confirm-backdrop";const o=document.createElement("div");o.className="custom-confirm-box";const d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';o.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${d}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${l}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(i),s.appendChild(o);const n=j=>{o.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{s.contains(i)&&s.removeChild(i),s.contains(o)&&s.removeChild(o),t(j)},300)},h=o.querySelector(".custom-confirm-btn-cancel"),g=o.querySelector(".custom-confirm-btn-confirm");h.addEventListener("click",()=>n(!1)),g.addEventListener("click",()=>n(!0)),i.addEventListener("click",()=>n(!1)),requestAnimationFrame(()=>{i.classList.add("show"),o.classList.add("show"),g.focus()})});if(typeof window<"u"){const l=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var i;const s=((i=t.reason)==null?void 0:i.message)||String(t.reason||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var i;const s=t.message||String(((i=t.error)==null?void 0:i.message)||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}ve.createRoot(document.getElementById("root")).render(e.jsx(ne.StrictMode,{children:e.jsx(yt,{})}));export{Pe as M,w as a,C as u};
