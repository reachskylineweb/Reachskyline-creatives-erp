const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-B-rtq4gv.js","assets/vendor-react-BOhAFuIu.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-k2Mfedav.js","assets/ClientList-By6EnWlR.js","assets/Table-IuFOIPsN.js","assets/FormFields-CLChU1Uh.js","assets/DepartmentList-DH4GD0DJ.js","assets/ManagerList-CpcYUwOE.js","assets/EmployeeList-DvKt2w7p.js","assets/ProjectList-ebvicXQC.js","assets/ContentCalendarView-DBUiFhJD.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-DhPKJZ9g.js","assets/ReportDashboard-CtX4kaac.js","assets/SuperadminReports-DpsgsquA.js","assets/ActivityTypeList-vlE8uyNn.js","assets/LoginCredentials-7h50DKYE.js","assets/WorkUpdates-BFvr0aBk.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-vRNWkWXd.js","assets/ManagerDashboard-Bx2m5F-F.js","assets/ManagerCalendar-BHepjNIh.js","assets/ManagerDailyTodo-BPa7pat1.js","assets/DesignerWorkload-Fo3egYnC.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-B0uJ-N9_.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-DK2JMKdw.js","assets/ManagerClientRework-DZSuQwvY.js","assets/ManagerJobWorks-1Qjiad66.js","assets/ManagerSubDepartmentList-BTmJOJ8I.js","assets/ManagerEmployeeList-Bc_ngEHk.js","assets/ManagerEfficiency-D4_oLHv7.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-5uKH_3Rq.js","assets/SMMMonthlyPosting-Bj0w-Aml.js","assets/SMMPosted-DDbU2VGm.js","assets/WritersAssignment-RegNJo5o.js","assets/EmployeeDashboard-Dk2QaiLe.js","assets/EmployeeCalendar-DyQR8v9W.js","assets/EmployeeEventCalendar-Pr_NtZNw.js","assets/EmployeeAssignedWork-CZH52Md9.js","assets/EmployeeReassignedWork-BRUvm077.js","assets/EmployeeApprovedWork-BhLidpDU.js","assets/EmployeeTodayDeliverables-3PybfmzX.js","assets/EmployeeRework-C_xMPAco.js","assets/EmployeeOverallWork-BFgUJhEm.js","assets/SuperAdminDashboard-Drw17IZH.js","assets/SuperAdminClients-DRTucnTA.js","assets/SuperAdminEfficiency-Bob9Lvhp.js","assets/SuperAdminBranches-BEhEfL4p.js","assets/SuperAdminBranchDetail-CGXVj0Ra.js","assets/SuperAdminProfile-e8MBCJA2.js"])))=>i.map(i=>d[i]);
var re=Object.defineProperty;var ae=(i,t,s)=>t in i?re(i,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):i[t]=s;var J=(i,t,s)=>ae(i,typeof t!="symbol"?t+"":t,s);import{r as j,j as e,N as ie,L as le,a as k,C as A,F as I,B as V,P as ce,b as G,U as P,c as z,d as de,e as D,f as W,g as q,R as F,h as pe,K as me,A as ee,i as ue,G as xe,X as te,M as he,S as fe,k as ge,l as je,m as se,n as be,o as _e,p as r,q as v,O,s as ye}from"./vendor-react-BOhAFuIu.js";import{f as ve}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const d of o)if(d.type==="childList")for(const n of d.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function s(o){const d={};return o.integrity&&(d.integrity=o.integrity),o.referrerPolicy&&(d.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?d.credentials="include":o.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function a(o){if(o.ep)return;o.ep=!0;const d=s(o);fetch(o.href,d)}})();const we="modulepreload",Ee=function(i){return"/"+i},K={},p=function(t,s,a){let o=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),f=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));o=Promise.allSettled(s.map(g=>{if(g=Ee(g),g in K)return;K[g]=!0;const b=g.endsWith(".css"),c=b?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${c}`))return;const u=document.createElement("link");if(u.rel=b?"stylesheet":we,b||(u.as="script"),u.crossOrigin="",u.href=g,f&&u.setAttribute("nonce",f),document.head.appendChild(u),b)return new Promise((y,h)=>{u.addEventListener("load",y),u.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${g}`)))})}))}function d(n){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=n,window.dispatchEvent(f),!f.defaultPrevented)throw n}return o.then(n=>{for(const f of n||[])f.status==="rejected"&&d(f.reason);return t().catch(d)})},ke=()=>{const i="https://api.reachskyline.com/api";{const t=i.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},E=ve.create({baseURL:ke(),timeout:3e4,headers:{"Content-Type":"application/json"}});E.interceptors.request.use(i=>{const t=localStorage.getItem("erp_token");return t&&(i.headers.Authorization=`Bearer ${t}`),i},i=>Promise.reject(i));E.interceptors.response.use(i=>i,async i=>{var f,g,b;const{config:t,response:s}=i,a=((f=t==null?void 0:t.method)==null?void 0:f.toLowerCase())==="get",o=!s,d=s&&s.status>=500;if(t&&a&&(o||d)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${i.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(u=>setTimeout(u,c)),E(t)}if(s&&(s.status===401||s.status===403&&(((g=s.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((b=s.data)==null?void 0:b.errors)&&s.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))){const c=localStorage.getItem("erp_user");c&&(c.includes('"role":"client"')||c.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(i)});const ne=j.createContext(null),Se=({children:i})=>{const[t,s]=j.useState(()=>{try{const c=localStorage.getItem("erp_user");return c?JSON.parse(c):null}catch{return null}}),[a,o]=j.useState(!1),d=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(u){var h,l;const y=async()=>{var _,C;try{const R=(C=(_=u.User)==null?void 0:_.PushSubscription)==null?void 0:C.id;R&&await E.post("/notifications/subscribe",{subscriptionId:R}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{u.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(_=>{console.warn("[OneSignal] Domain initialization deferred:",(_==null?void 0:_.message)||_)}),window.__oneSignalInitialized=!0}catch(_){console.warn("[OneSignal] Init warning:",_.message)}y();try{(l=(h=u.User)==null?void 0:h.PushSubscription)==null||l.addEventListener("change",function(_){var C;(C=_==null?void 0:_.current)!=null&&C.optedIn&&y()})}catch{}})}catch{}};j.useEffect(()=>{(async()=>{const u=localStorage.getItem("erp_token"),y=localStorage.getItem("erp_user");let h=null;try{h=y?JSON.parse(y):null}catch{}if(!u){if(h&&h.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(h),o(!1);return}s(null),o(!1);return}try{const l=await E.get("/auth/session");if(l.data&&l.data.success){const _=l.data.data.user;s(_),localStorage.setItem("erp_user",JSON.stringify(_))}else h&&h.role==="client"?s(h):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{h&&h.role==="client"&&s(h)}finally{o(!1)}})()},[]),j.useEffect(()=>{t&&d(t)},[t]);const n=async(c,u,y)=>{try{const h=await E.post("/auth/login",{username:c,password:u},{onRetry:y});if(h.data&&h.data.success){const{token:l,user:_}=h.data.data;return localStorage.setItem("erp_token",l||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(_)),s(_),o(!1),{success:!0}}}catch(h){const l=h.response&&h.response.data&&h.response.data.message?h.response.data.message:"Wrong credentials! Invalid username or password.",_=h.response&&h.response.data&&h.response.data.errors?h.response.data.errors:[];return{success:!1,message:l,errors:_}}},f=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var u,y;try{const h=(y=(u=c.User)==null?void 0:u.PushSubscription)==null?void 0:y.id;h&&await E.post("/notifications/unsubscribe",{subscriptionId:h}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),o(!1)},g=c=>{s(u=>{if(!u)return null;const y={...u,...c};return localStorage.setItem("erp_user",JSON.stringify(y)),y})},b={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:a,login:n,logout:f,updateCurrentUser:g};return e.jsx(ne.Provider,{value:b,children:i})},S=()=>{const i=j.useContext(ne);return i||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Ce=j.createContext(null),Le=({children:i})=>{const[t,s]=j.useState([]),[a,o]=j.useState(0),{isAuthenticated:d}=S(),n=j.useCallback(async()=>{if(d)try{const c=await E.get("/notifications");if(c.data&&c.data.success){const u=c.data.data.notifications;s(u);const y=u.filter(h=>!h.is_read).length;o(y)}}catch{}},[d]),f=async c=>{try{await E.patch(`/notifications/${c}/read`),s(u=>u.map(y=>y.id===parseInt(c)?{...y,is_read:1}:y)),o(u=>Math.max(0,u-1))}catch(u){console.error("Failed to mark notification as read:",u.message)}},g=async()=>{try{await E.post("/notifications/read-all"),s(c=>c.map(u=>({...u,is_read:1}))),o(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};j.useEffect(()=>{if(d){n();const c=setInterval(n,3e4);return()=>clearInterval(c)}else s([]),o(0)},[d,n]);const b={notifications:t,unreadCount:a,fetchNotifications:n,markAsRead:f,markAllRead:g};return e.jsx(Ce.Provider,{value:b,children:i})},N=()=>{const{logout:i,user:t}=S(),s=()=>{const n=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(G,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(q,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(ee,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(P,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(ue,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(z,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(V,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(xe,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&n.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(I,{size:20})}),n.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(pe,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(me,{size:20})}),n},a=()=>{var g,b,c;const n=window.location.pathname.startsWith("/client");return(t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||n?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(k,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(A,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(I,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(V,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(ce,{size:20})}]:(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(G,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(P,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(V,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(de,{size:20})}]:(t==null?void 0:t.role)==="manager"?((g=t==null?void 0:t.managerProfile)==null?void 0:g.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(P,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(W,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(A,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(D,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(A,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(W,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(z,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(P,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(q,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(P,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(V,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(I,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(F,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(I,{size:20})}]:(t==null?void 0:t.role)==="employee"?((b=t==null?void 0:t.employeeProfile)==null?void 0:b.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(W,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(A,{size:20})}]:((c=t==null?void 0:t.employeeProfile)==null?void 0:c.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(z,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(I,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(W,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(A,{size:20})}]:s()},o=()=>{document.body.classList.remove("mobile-sidebar-open")},d=a();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:o}),e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:d.map((n,f)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(ie,{to:n.path,state:n.state,onClick:o,className:({isActive:g})=>`sidebar-link ${g?"active":""}`,children:[n.icon,e.jsx("span",{children:n.label})]})},f))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:i,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:n=>{n.currentTarget.style.color="#f87171"},onMouseLeave:n=>{n.currentTarget.style.color="var(--danger)"},children:[e.jsx(le,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Re=({isOpen:i,onClose:t,title:s,children:a,footer:o=null})=>(j.useEffect(()=>(i?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[i]),i?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:d=>d.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(te,{size:20})})]}),e.jsx("div",{className:"modal-body",children:a}),o&&e.jsx("div",{className:"modal-footer",children:o})]})}):null),M=()=>{var R;const{user:i,logout:t}=S(),[s,a]=j.useState(""),[o,d]=j.useState(!1),[n,f]=j.useState(null),[g,b]=j.useState(!1),[c,u]=j.useState(!1),y=()=>{const x=!c;u(x),x?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};j.useEffect(()=>{const x=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),u(!1))};return window.addEventListener("resize",x),()=>window.removeEventListener("resize",x)},[]);const h=window.location.pathname.startsWith("/client"),l=h?i&&(i.role==="client"||i.user_type==="client")?i:{username:"gem",full_name:"rajesh kumar",role:"client"}:i,_=l&&l.username?l.username.slice(0,2).toUpperCase():"CL",C=()=>{var x,Y,U,H;return h||(l==null?void 0:l.role)==="client"?"Client Partner":(l==null?void 0:l.role)==="manager"?((x=l==null?void 0:l.managerProfile)==null?void 0:x.department_code)==="SMM-RS"?"SMM Manager":(Y=l==null?void 0:l.managerProfile)!=null&&Y.department_name?`${l.managerProfile.department_name} Manager`:"Brand Manager":(l==null?void 0:l.role)==="employee"?((U=l==null?void 0:l.employeeProfile)==null?void 0:U.department_code)==="SMM-RS"?"SMM Employee":(H=l==null?void 0:l.employeeProfile)!=null&&H.department_name?`${l.employeeProfile.department_name} Employee`:"Employee":(l==null?void 0:l.role)==="admin"?"Administrator":(l==null?void 0:l.role)==="super_admin"?"Super Administrator":(l==null?void 0:l.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:y,"aria-label":"Toggle Navigation",children:c?e.jsx(te,{size:24}):e.jsx(he,{size:24})}),e.jsx("form",{onSubmit:handleSearchSubmit,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(fe,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:s,onChange:x=>a(x.target.value)})]})})]}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:_}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((R=l==null?void 0:l.clientProfile)==null?void 0:R.company_name)||(l==null?void 0:l.full_name)||(l==null?void 0:l.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:C()})]})]})}),e.jsx(Re,{isOpen:g,onClose:()=>{b(!1),f(null)},title:`Search Results for "${s}"`,children:o?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):n?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[n.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ge,{size:16,className:"text-primary"})," Clients (",n.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.clients.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${x.id}`,style:{fontWeight:600},children:x.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.client_name," • ",x.client_id_code]})]},x.id))})]}),n.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(q,{size:16,className:"text-teal"})," Departments (",n.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.departments.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${x.id}`,style:{fontWeight:600},children:x.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:x.code})]},x.id))})]}),n.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ee,{size:16,className:"text-secondary"})," Managers (",n.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.managers.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.manager_id_code," • ",x.department_name]})]},x.id))})]}),n.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(P,{size:16,className:"text-purple"})," Employees (",n.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.employees.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.employee_id_code," • ",x.department_name]})]},x.id))})]}),n.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(je,{size:16,className:"text-orange"})," Projects (",n.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.projects.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${x.id}`,style:{fontWeight:600},children:x.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",x.client_name," • Manager: ",x.manager_name]})]},x.id))})]}),n.clients.length===0&&n.departments.length===0&&n.managers.length===0&&n.employees.length===0&&n.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',s,'".']})})]}):null})]})};class L extends se.Component{constructor(s){super(s);J(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,a){var d,n,f;if(console.error("ErrorBoundary caught an error:",s,a),this.setState({errorInfo:a}),s&&(s.name==="ChunkLoadError"||((d=s.message)==null?void 0:d.includes("Failed to fetch dynamically imported module"))||((n=s.message)==null?void 0:n.includes("Importing a module script failed"))||((f=s.message)==null?void 0:f.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,a;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((a=this.state.errorInfo)==null?void 0:a.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const m=i=>j.lazy(()=>i().catch(t=>{var a,o,d;throw t&&(t.name==="ChunkLoadError"||((a=t.message)==null?void 0:a.includes("Failed to fetch dynamically imported module"))||((o=t.message)==null?void 0:o.includes("Importing a module script failed"))||((d=t.message)==null?void 0:d.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Pe=m(()=>p(()=>import("./Login-B-rtq4gv.js"),__vite__mapDeps([0,1,2]))),Ae=m(()=>p(()=>import("./AdminDashboard-k2Mfedav.js"),__vite__mapDeps([3,1,2]))),Ie=m(()=>p(()=>import("./ClientList-By6EnWlR.js"),__vite__mapDeps([4,1,2,5,6]))),ze=m(()=>p(()=>import("./DepartmentList-DH4GD0DJ.js"),__vite__mapDeps([7,1,2,5,6]))),De=m(()=>p(()=>import("./ManagerList-CpcYUwOE.js"),__vite__mapDeps([8,1,2,5,6]))),Te=m(()=>p(()=>import("./EmployeeList-DvKt2w7p.js"),__vite__mapDeps([9,1,2,5,6]))),Oe=m(()=>p(()=>import("./ProjectList-ebvicXQC.js"),__vite__mapDeps([10,1,2,11,12,6]))),Ne=m(()=>p(()=>import("./DeliverableList-DhPKJZ9g.js"),__vite__mapDeps([13,1,2,5,6]))),Me=m(()=>p(()=>import("./ReportDashboard-CtX4kaac.js"),__vite__mapDeps([14,1,2]))),Be=m(()=>p(()=>import("./SuperadminReports-DpsgsquA.js"),__vite__mapDeps([15,1,2,5]))),Ve=m(()=>p(()=>import("./ActivityTypeList-vlE8uyNn.js"),__vite__mapDeps([16,1,2,6]))),We=m(()=>p(()=>import("./LoginCredentials-7h50DKYE.js"),__vite__mapDeps([17,1,2,5]))),$e=m(()=>p(()=>import("./WorkUpdates-BFvr0aBk.js"),__vite__mapDeps([18,1,2,19]))),T=m(()=>p(()=>import("./ClientPortal-vRNWkWXd.js"),__vite__mapDeps([20,1,2]))),Fe=m(()=>p(()=>import("./ManagerDashboard-Bx2m5F-F.js"),__vite__mapDeps([21,1,2]))),qe=m(()=>p(()=>import("./ManagerCalendar-BHepjNIh.js"),__vite__mapDeps([22,1,2,11,12,6]))),Ye=m(()=>p(()=>import("./ManagerDailyTodo-BPa7pat1.js"),__vite__mapDeps([23,1,2]))),Ue=m(()=>p(()=>import("./DesignerWorkload-Fo3egYnC.js"),__vite__mapDeps([24,1,2,25]))),He=m(()=>p(()=>import("./CompletedWorks-B0uJ-N9_.js"),__vite__mapDeps([26,1,2,27]))),Je=m(()=>p(()=>import("./ManagerSubmissionsReview-DK2JMKdw.js"),__vite__mapDeps([28,1,2]))),Ge=m(()=>p(()=>import("./ManagerClientRework-DZSuQwvY.js"),__vite__mapDeps([29,1,2]))),Ke=m(()=>p(()=>import("./ManagerJobWorks-1Qjiad66.js"),__vite__mapDeps([30,1,2,5]))),Qe=m(()=>p(()=>import("./ManagerSubDepartmentList-BTmJOJ8I.js"),__vite__mapDeps([31,1,2]))),Xe=m(()=>p(()=>import("./ManagerEmployeeList-Bc_ngEHk.js"),__vite__mapDeps([32,1,2,5,33,34]))),Ze=m(()=>p(()=>import("./ManagerEfficiency-D4_oLHv7.js"),__vite__mapDeps([33,1,2,34]))),Q=m(()=>p(()=>import("./SMMTodayPosting-5uKH_3Rq.js"),__vite__mapDeps([35,1,2]))),X=m(()=>p(()=>import("./SMMMonthlyPosting-Bj0w-Aml.js"),__vite__mapDeps([36,1,2,5]))),Z=m(()=>p(()=>import("./SMMPosted-DDbU2VGm.js"),__vite__mapDeps([37,1,2,5]))),et=m(()=>p(()=>import("./WritersAssignment-RegNJo5o.js"),__vite__mapDeps([38,1,2]))),tt=m(()=>p(()=>import("./EmployeeDashboard-Dk2QaiLe.js"),__vite__mapDeps([39,1,2]))),st=m(()=>p(()=>import("./EmployeeCalendar-DyQR8v9W.js"),__vite__mapDeps([40,1,2,11,12,6]))),$=m(()=>p(()=>import("./EmployeeEventCalendar-Pr_NtZNw.js"),__vite__mapDeps([41,1,2]))),nt=m(()=>p(()=>import("./EmployeeAssignedWork-CZH52Md9.js"),__vite__mapDeps([42,1,2]))),ot=m(()=>p(()=>import("./EmployeeReassignedWork-BRUvm077.js"),__vite__mapDeps([43,1,2]))),rt=m(()=>p(()=>import("./EmployeeApprovedWork-BhLidpDU.js"),__vite__mapDeps([44,1,2,5]))),at=m(()=>p(()=>import("./EmployeeTodayDeliverables-3PybfmzX.js"),__vite__mapDeps([45,1,2]))),it=m(()=>p(()=>import("./EmployeeRework-C_xMPAco.js"),__vite__mapDeps([46,1,2]))),lt=m(()=>p(()=>import("./EmployeeOverallWork-BFgUJhEm.js"),__vite__mapDeps([47,1,2]))),ct=m(()=>p(()=>import("./SuperAdminDashboard-Drw17IZH.js"),__vite__mapDeps([48,1,2]))),dt=m(()=>p(()=>import("./SuperAdminClients-DRTucnTA.js"),__vite__mapDeps([49,1,2,5]))),pt=m(()=>p(()=>import("./SuperAdminEfficiency-Bob9Lvhp.js"),__vite__mapDeps([50,1,2,5]))),mt=m(()=>p(()=>import("./SuperAdminBranches-BEhEfL4p.js"),__vite__mapDeps([51,1,2,5]))),ut=m(()=>p(()=>import("./SuperAdminBranchDetail-CGXVj0Ra.js"),__vite__mapDeps([52,1,2,5]))),xt=m(()=>p(()=>import("./SuperAdminProfile-e8MBCJA2.js"),__vite__mapDeps([53,1,2]))),w=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),B=()=>{try{const i=localStorage.getItem("erp_user");return i?JSON.parse(i):null}catch{return null}},ht=()=>{const{isAuthenticated:i,user:t,loading:s}=S(),a=t||B();return s?e.jsx(w,{}):!a||a.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(O,{})})})]})]})},ft=()=>{const{isAuthenticated:i,user:t,isAdmin:s,loading:a}=S(),o=t||B(),d=s||o&&(o.role==="admin"||o.role==="super_admin");return a?e.jsx(w,{}):!o||!d?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(O,{})})})]})]})},gt=()=>{const{isAuthenticated:i,user:t,loading:s}=S(),a=t||B();return s?e.jsx(w,{}):!a||a.role!=="manager"&&a.role!=="admin"&&a.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(O,{})})})]})]})},jt=()=>{const{isAuthenticated:i,user:t,loading:s}=S(),a=t||B(),o=((a==null?void 0:a.username)||"").trim().toLowerCase(),d=a&&(a.role==="client"||a.user_type==="client"||o==="gem"||o==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(w,{}):d?e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(O,{})})})]})]}):e.jsx(v,{to:"/login",replace:!0})},bt=()=>{const{isAuthenticated:i,user:t,loading:s}=S(),a=t||B();return s?e.jsx(w,{}):!a||a.role!=="employee"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(O,{})})})]})]})};function _t(){return e.jsx(be,{children:e.jsx(Se,{children:e.jsx(Le,{children:e.jsx(L,{children:e.jsx(j.Suspense,{fallback:e.jsx(w,{}),children:e.jsxs(_e,{children:[e.jsx(r,{path:"/login",element:e.jsx(Pe,{})}),e.jsxs(r,{path:"/super-admin",element:e.jsx(ht,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(ct,{})}),e.jsx(r,{path:"clients",element:e.jsx(dt,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(pt,{})}),e.jsx(r,{path:"branches",element:e.jsx(mt,{})}),e.jsx(r,{path:"branches/:id",element:e.jsx(ut,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx($,{})})}),e.jsx(r,{path:"profile",element:e.jsx(xt,{})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/admin",element:e.jsx(ft,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Ae,{})}),e.jsx(r,{path:"clients",element:e.jsx(Ie,{})}),e.jsx(r,{path:"departments",element:e.jsx(ze,{})}),e.jsx(r,{path:"managers",element:e.jsx(De,{})}),e.jsx(r,{path:"employees",element:e.jsx(Te,{})}),e.jsx(r,{path:"projects",element:e.jsx(Oe,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx($,{})})}),e.jsx(r,{path:"deliverables",element:e.jsx(Ne,{})}),e.jsx(r,{path:"reports",element:e.jsx(Me,{})}),e.jsx(r,{path:"superadmin-reports",element:e.jsx(Be,{})}),e.jsx(r,{path:"activity-types",element:e.jsx(Ve,{})}),e.jsx(r,{path:"credentials",element:e.jsx(We,{})}),e.jsx(r,{path:"work-updates",element:e.jsx($e,{})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/manager",element:e.jsx(gt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Fe,{})}),e.jsx(r,{path:"calendar",element:e.jsx(qe,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx($,{})})}),e.jsx(r,{path:"daily-todo",element:e.jsx(Ye,{})}),e.jsx(r,{path:"designer-workload",element:e.jsx(Ue,{})}),e.jsx(r,{path:"completed-works",element:e.jsx(He,{})}),e.jsx(r,{path:"sub-departments",element:e.jsx(Qe,{})}),e.jsx(r,{path:"employees",element:e.jsx(Xe,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(Ze,{})}),e.jsx(r,{path:"submissions-review",element:e.jsx(L,{children:e.jsx(Je,{})})}),e.jsx(r,{path:"client-reworks",element:e.jsx(Ge,{})}),e.jsx(r,{path:"job-works",element:e.jsx(Ke,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Q,{})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(X,{})}),e.jsx(r,{path:"posted",element:e.jsx(Z,{})}),e.jsx(r,{path:"writers-assignment",element:e.jsx(L,{children:e.jsx(et,{})})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/employee",element:e.jsx(bt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(tt,{})}),e.jsx(r,{path:"calendar",element:e.jsx(st,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx($,{})})}),e.jsx(r,{path:"assigned-work",element:e.jsx(nt,{})}),e.jsx(r,{path:"reassigned-work",element:e.jsx(ot,{})}),e.jsx(r,{path:"approved-work",element:e.jsx(rt,{})}),e.jsx(r,{path:"overall-work",element:e.jsx(lt,{})}),e.jsx(r,{path:"today",element:e.jsx(at,{})}),e.jsx(r,{path:"rework",element:e.jsx(it,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Q,{isEmployee:!0})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(X,{isEmployee:!0})}),e.jsx(r,{path:"posted",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/client",element:e.jsx(jt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(T,{activeTabProp:"dashboard"})}),e.jsx(r,{path:"approvals",element:e.jsx(T,{activeTabProp:"approvals"})}),e.jsx(r,{path:"reachskyline-approvals",element:e.jsx(T,{activeTabProp:"reachskyline_approvals"})}),e.jsx(r,{path:"reports",element:e.jsx(T,{activeTabProp:"reports"})}),e.jsx(r,{path:"contact",element:e.jsx(T,{activeTabProp:"contact"})}),e.jsx(r,{path:"portal",element:e.jsx(v,{to:"/client/dashboard",replace:!0})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsx(r,{path:"*",element:e.jsx(v,{to:"/login",replace:!0})})]})})})})})})}window.alert=i=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let s="info",a="Notification";const o=(i||"").toLowerCase();o.includes("already approved")||o.includes("can't edit")||o.includes("cannot edit")?(s="info",a="Info"):o.includes("success")||o.includes("approve")||o.includes("submit")?(s="success",a="Success"):(o.includes("fail")||o.includes("error")||o.includes("invalid")||o.includes("please"))&&(s="error",a="Alert");let d="";s==="success"?d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const n=document.createElement("div");n.className="custom-alert-backdrop";const f=document.createElement("div");f.className="custom-alert-box",f.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${d}
    </div>
    <h3 class="custom-alert-title">${a}</h3>
    <p class="custom-alert-message">${i}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(n),t.appendChild(f);const g=()=>{f.classList.remove("show"),n.classList.remove("show"),setTimeout(()=>{t.contains(n)&&t.removeChild(n),t.contains(f)&&t.removeChild(f)},300)},b=f.querySelector(".custom-alert-btn");b.addEventListener("click",g),n.addEventListener("click",g),requestAnimationFrame(()=>{n.classList.add("show"),f.classList.add("show"),b.focus()})};window.confirm=i=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const b=document.createElement("style");b.textContent=`
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
      `,document.head.appendChild(b),document.body.appendChild(s)}s.innerHTML="";const a=document.createElement("div");a.className="custom-confirm-backdrop";const o=document.createElement("div");o.className="custom-confirm-box";const d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';o.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${d}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${i}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(a),s.appendChild(o);const n=b=>{o.classList.remove("show"),a.classList.remove("show"),setTimeout(()=>{s.contains(a)&&s.removeChild(a),s.contains(o)&&s.removeChild(o),t(b)},300)},f=o.querySelector(".custom-confirm-btn-cancel"),g=o.querySelector(".custom-confirm-btn-confirm");f.addEventListener("click",()=>n(!1)),g.addEventListener("click",()=>n(!0)),a.addEventListener("click",()=>n(!1)),requestAnimationFrame(()=>{a.classList.add("show"),o.classList.add("show"),g.focus()})});if(typeof window<"u"){const i=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var a;const s=((a=t.reason)==null?void 0:a.message)||String(t.reason||"");i(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var a;const s=t.message||String(((a=t.error)==null?void 0:a.message)||"");i(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}ye.createRoot(document.getElementById("root")).render(e.jsx(se.StrictMode,{children:e.jsx(_t,{})}));export{Re as M,E as a,S as u};
