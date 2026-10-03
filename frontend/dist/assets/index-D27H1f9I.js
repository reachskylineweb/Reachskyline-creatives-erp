const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-9nQsQg3s.js","assets/vendor-react-ZNQcpRn3.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-CRnuzUPm.js","assets/ClientList-CESHlLIT.js","assets/Table-BXFfnVuR.js","assets/FormFields-C86Hh2zK.js","assets/ImageUploadField-BFxYPGMq.js","assets/DepartmentList-pNhCdoBx.js","assets/ManagerList-jkgFt7of.js","assets/EmployeeList-0YezJMk1.js","assets/ProjectList-CY35FXHu.js","assets/ContentCalendarView-Bpt3dhQJ.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-CmA-ZCah.js","assets/ReportDashboard-C0sT42ni.js","assets/SuperadminReports-C-IHAAd_.js","assets/ActivityTypeList-CI3F0TtK.js","assets/LoginCredentials-BihAzOcy.js","assets/WorkUpdates-BMGqivLp.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-C3zfgAOC.js","assets/ManagerDashboard-CZi-Neql.js","assets/ManagerCalendar-2gEY9llX.js","assets/ManagerDailyTodo-pqUGk2qi.js","assets/DesignerWorkload-Cvao2RyW.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-CjhUaL3h.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-DNyIjhxa.js","assets/ManagerClientRework-DNZ5_qRM.js","assets/ManagerJobWorks-Bh4CFiav.js","assets/ManagerSubDepartmentList-D7vr9FFc.js","assets/ManagerEmployeeList-C5I_r2BZ.js","assets/ManagerEfficiency-DZ2FwHMP.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-DUw0sQU2.js","assets/SMMMonthlyPosting-CmwlKNAO.js","assets/SMMPosted-kXBfH9fL.js","assets/BlogCalendarView-Bpk-xt_w.js","assets/AdminBlogsAssignment-kDtwrqFh.js","assets/ManagerBlogClients-BLqnkwXD.js","assets/WritersAssignment-Fdod0D2V.js","assets/SEOAssignTask-Fdod0D2V.js","assets/EmployeeDashboard-Crt4sTwL.js","assets/EmployeeCalendar-C40rcUiu.js","assets/EmployeeEventCalendar-B7ydmfiL.js","assets/EmployeeAssignedWork-HMNmmIG7.js","assets/EmployeeReassignedWork-DARgZw6B.js","assets/EmployeeApprovedWork-QhSM-VIu.js","assets/EmployeeTodayDeliverables-Bv01pXC5.js","assets/EmployeeRework-CnnRKvCV.js","assets/EmployeeOverallWork-DUoMbUTg.js","assets/SuperAdminDashboard-fMgxNtMR.js","assets/SuperAdminClients-D8XsbsyE.js","assets/SuperAdminEfficiency-BwwYaoU2.js","assets/SuperAdminBranches-tbPKthkH.js","assets/SuperAdminBranchDetail-Du4QRdKx.js","assets/SuperAdminProfile-BBWcQ__K.js"])))=>i.map(i=>d[i]);
var fe=Object.defineProperty;var ge=(r,t,s)=>t in r?fe(r,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[t]=s;var te=(r,t,s)=>ge(r,typeof t!="symbol"?t+"":t,s);import{r as b,j as e,N as je,L as be,a as k,C as z,F as I,B as D,P as _e,b as q,U as L,c as T,d as ye,e as O,f as $,g as se,h as H,R as Y,i as ve,K as we,A as ce,k as de,l as Ee,G as ke,X as pe,M as Se,S as Ce,m as Le,n as me,o as Pe,p as Re,q as i,s as v,O as M,t as Ae}from"./vendor-react-ZNQcpRn3.js";import{f as ze}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const m of a)if(m.type==="childList")for(const o of m.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&l(o)}).observe(document,{childList:!0,subtree:!0});function s(a){const m={};return a.integrity&&(m.integrity=a.integrity),a.referrerPolicy&&(m.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?m.credentials="include":a.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function l(a){if(a.ep)return;a.ep=!0;const m=s(a);fetch(a.href,m)}})();const Ie="modulepreload",De=function(r){return"/"+r},ne={},d=function(t,s,l){let a=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),h=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));a=Promise.allSettled(s.map(g=>{if(g=De(g),g in ne)return;ne[g]=!0;const j=g.endsWith(".css"),c=j?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${c}`))return;const u=document.createElement("link");if(u.rel=j?"stylesheet":Ie,j||(u.as="script"),u.crossOrigin="",u.href=g,h&&u.setAttribute("nonce",h),document.head.appendChild(u),j)return new Promise((_,f)=>{u.addEventListener("load",_),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${g}`)))})}))}function m(o){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=o,window.dispatchEvent(h),!h.defaultPrevented)throw o}return a.then(o=>{for(const h of o||[])h.status==="rejected"&&m(h.reason);return t().catch(m)})},Te=()=>{const r="http://localhost:5050/api";{const t=r.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},w=ze.create({baseURL:Te(),timeout:3e4,headers:{"Content-Type":"application/json"}});w.interceptors.request.use(r=>{const t=localStorage.getItem("erp_token");return t&&(r.headers.Authorization=`Bearer ${t}`),r},r=>Promise.reject(r));w.interceptors.response.use(r=>r,async r=>{var h,g,j;const{config:t,response:s}=r,l=((h=t==null?void 0:t.method)==null?void 0:h.toLowerCase())==="get",a=!s,m=s&&s.status>=500;if(t&&l&&(a||m)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${r.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(u=>setTimeout(u,c)),w(t)}if(s&&(s.status===401||s.status===403&&(((g=s.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((j=s.data)==null?void 0:j.errors)&&s.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))){const c=localStorage.getItem("erp_user");c&&(c.includes('"role":"client"')||c.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(r)});const ue=b.createContext(null),Oe=({children:r})=>{const[t,s]=b.useState(()=>{try{const c=localStorage.getItem("erp_user");return c?JSON.parse(c):null}catch{return null}}),[l,a]=b.useState(!1),m=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(u){var f,y;const _=async()=>{var n,R;try{const A=(R=(n=u.User)==null?void 0:n.PushSubscription)==null?void 0:R.id;A&&await w.post("/notifications/subscribe",{subscriptionId:A}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{u.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(n=>{console.warn("[OneSignal] Domain initialization deferred:",(n==null?void 0:n.message)||n)}),window.__oneSignalInitialized=!0}catch(n){console.warn("[OneSignal] Init warning:",n.message)}_();try{(y=(f=u.User)==null?void 0:f.PushSubscription)==null||y.addEventListener("change",function(n){var R;(R=n==null?void 0:n.current)!=null&&R.optedIn&&_()})}catch{}})}catch{}};b.useEffect(()=>{(async()=>{const u=localStorage.getItem("erp_token"),_=localStorage.getItem("erp_user");let f=null;try{f=_?JSON.parse(_):null}catch{}if(!u){if(f&&f.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(f),a(!1);return}s(null),a(!1);return}try{const y=await w.get("/auth/session");if(y.data&&y.data.success){const n=y.data.data.user;s(n),localStorage.setItem("erp_user",JSON.stringify(n))}else f&&f.role==="client"?s(f):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{f&&f.role==="client"&&s(f)}finally{a(!1)}})()},[]),b.useEffect(()=>{t&&m(t)},[t]);const o=async(c,u,_)=>{try{const f=await w.post("/auth/login",{username:c,password:u},{onRetry:_});if(f.data&&f.data.success){const{token:y,user:n}=f.data.data;return localStorage.setItem("erp_token",y||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(n)),s(n),a(!1),{success:!0}}}catch(f){const y=f.response&&f.response.data&&f.response.data.message?f.response.data.message:"Wrong credentials! Invalid username or password.",n=f.response&&f.response.data&&f.response.data.errors?f.response.data.errors:[];return{success:!1,message:y,errors:n}}},h=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var u,_;try{const f=(_=(u=c.User)==null?void 0:u.PushSubscription)==null?void 0:_.id;f&&await w.post("/notifications/unsubscribe",{subscriptionId:f}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),a(!1)},g=c=>{s(u=>{if(!u)return null;const _={...u,...c};return localStorage.setItem("erp_user",JSON.stringify(_)),_})},j={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:l,login:o,logout:h,updateCurrentUser:g};return e.jsx(ue.Provider,{value:j,children:r})},P=()=>{const r=b.useContext(ue);return r||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Ne=b.createContext(null),Me=({children:r})=>{const[t,s]=b.useState([]),[l,a]=b.useState(0),{isAuthenticated:m}=P(),o=b.useCallback(async()=>{if(m)try{const c=await w.get("/notifications");if(c.data&&c.data.success){const u=c.data.data.notifications;s(u);const _=u.filter(f=>!f.is_read).length;a(_)}}catch{}},[m]),h=async c=>{try{await w.patch(`/notifications/${c}/read`),s(u=>u.map(_=>_.id===parseInt(c)?{..._,is_read:1}:_)),a(u=>Math.max(0,u-1))}catch(u){console.error("Failed to mark notification as read:",u.message)}},g=async()=>{try{await w.post("/notifications/read-all"),s(c=>c.map(u=>({...u,is_read:1}))),a(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};b.useEffect(()=>{if(m){o();const c=setInterval(o,3e4);return()=>clearInterval(c)}else s([]),a(0)},[m,o]);const j={notifications:t,unreadCount:l,fetchNotifications:o,markAsRead:h,markAllRead:g};return e.jsx(Ne.Provider,{value:j,children:r})},B=()=>{const{logout:r,user:t}=P(),s=()=>{const o=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(q,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(H,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(ce,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(L,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(se,{size:20})},{label:"Blog Calendar",path:"/admin/blog-calendar",icon:e.jsx(de,{size:20})},{label:"Blog Assignments",path:"/admin/blog-assignments",icon:e.jsx(Ee,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(T,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(T,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(D,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(ke,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&o.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(I,{size:20})}),o.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(ve,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(we,{size:20})}),o},l=()=>{var g,j,c,u;const o=window.location.pathname.startsWith("/client");return(t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||o?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(k,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(z,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(I,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(D,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(_e,{size:20})}]:(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(q,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(L,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(T,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(D,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(ye,{size:20})}]:(t==null?void 0:t.role)==="manager"?((g=t==null?void 0:t.managerProfile)==null?void 0:g.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(O,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(z,{size:20})}]:((j=t==null?void 0:t.managerProfile)==null?void 0:j.department_code)==="SEO-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Clients for Blog",path:"/manager/clients",icon:e.jsx(q,{size:20})},{label:"Blog Calendar",path:"/manager/blog-calendar",icon:e.jsx(se,{size:20})},{label:"Assign Task",path:"/manager/assign-task",icon:e.jsx(L,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(z,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(D,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(I,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(O,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(z,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx($,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(T,{size:20})},{label:"Assign Task",path:"/manager/assign-task",icon:e.jsx(L,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(H,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(D,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(I,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(Y,{size:20})}]:(t==null?void 0:t.role)==="employee"?((c=t==null?void 0:t.employeeProfile)==null?void 0:c.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(O,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(z,{size:20})}]:((u=t==null?void 0:t.employeeProfile)==null?void 0:u.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(T,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(O,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(Y,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(I,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx($,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(O,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(Y,{size:20})},{label:"Completed Work",path:"/employee/completed-work",icon:e.jsx(z,{size:20})}]:s()},a=()=>{document.body.classList.remove("mobile-sidebar-open")},m=l();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:a}),e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:m.map((o,h)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(je,{to:o.path,state:o.state,onClick:a,className:({isActive:g})=>`sidebar-link ${g?"active":""}`,children:[o.icon,e.jsx("span",{children:o.label})]})},h))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:r,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:o=>{o.currentTarget.style.color="#f87171"},onMouseLeave:o=>{o.currentTarget.style.color="var(--danger)"},children:[e.jsx(be,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Be=({isOpen:r,onClose:t,title:s,children:l,footer:a=null})=>(b.useEffect(()=>(r?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[r]),r?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:m=>m.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(pe,{size:20})})]}),e.jsx("div",{className:"modal-body",children:l}),a&&e.jsx("div",{className:"modal-footer",children:a})]})}):null),Ve=r=>{if(!r||typeof r!="string")return"";if(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("data:")||r.startsWith("blob:"))return r;const t=r.startsWith("/")?r:`/${r}`;return`${"http://localhost:5050/api".trim().replace(/\/+$/,"").replace(/\/api$/,"")}${t}`},V=()=>{var G,J,K,Q,X,Z;const{user:r,logout:t}=P(),[s,l]=b.useState(""),[a,m]=b.useState(!1),[o,h]=b.useState(null),[g,j]=b.useState(!1),[c,u]=b.useState(!1),_=()=>{const x=!c;u(x),x?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};b.useEffect(()=>{const x=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),u(!1))};return window.addEventListener("resize",x),()=>window.removeEventListener("resize",x)},[]);const f=async x=>{if(x.preventDefault(),!!s.trim()){m(!0),j(!0);try{const C=await w.get(`/search?q=${encodeURIComponent(s)}`);C.data&&C.data.success&&h(C.data.data)}catch(C){console.error("Global search error:",C.message)}finally{m(!1)}}},y=window.location.pathname.startsWith("/client"),n=y?r&&(r.role==="client"||r.user_type==="client")?r:{username:"gem",full_name:"rajesh kumar",role:"client"}:r,R=n&&n.username?n.username.slice(0,2).toUpperCase():"CL",A=Ve((n==null?void 0:n.profile_image)||(n==null?void 0:n.avatar_url)||((G=n==null?void 0:n.employeeProfile)==null?void 0:G.profile_image)||((J=n==null?void 0:n.employeeProfile)==null?void 0:J.avatar_url)||((K=n==null?void 0:n.managerProfile)==null?void 0:K.profile_image)||((Q=n==null?void 0:n.clientProfile)==null?void 0:Q.profile_image)||((X=n==null?void 0:n.clientProfile)==null?void 0:X.logo_url)),xe=()=>{var x,C,U,ee;return y||(n==null?void 0:n.role)==="client"?"Client Partner":(n==null?void 0:n.role)==="manager"?((x=n==null?void 0:n.managerProfile)==null?void 0:x.department_code)==="SMM-RS"?"SMM Manager":(C=n==null?void 0:n.managerProfile)!=null&&C.department_name?`${n.managerProfile.department_name} Manager`:"Brand Manager":(n==null?void 0:n.role)==="employee"?((U=n==null?void 0:n.employeeProfile)==null?void 0:U.department_code)==="SMM-RS"?"SMM Employee":(ee=n==null?void 0:n.employeeProfile)!=null&&ee.department_name?`${n.employeeProfile.department_name} Employee`:"Employee":(n==null?void 0:n.role)==="admin"?"Administrator":(n==null?void 0:n.role)==="super_admin"?"Super Administrator":(n==null?void 0:n.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:_,"aria-label":"Toggle Navigation",children:c?e.jsx(pe,{size:24}):e.jsx(Se,{size:24})}),e.jsx("form",{onSubmit:f,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(Ce,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:s,onChange:x=>l(x.target.value)})]})})]}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",style:{padding:0,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"},children:A?e.jsx("img",{src:A,alt:(n==null?void 0:n.full_name)||"Avatar",style:{width:"100%",height:"100%",objectFit:"cover"},onError:x=>{x.target.style.display="none"}}):R}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((Z=n==null?void 0:n.clientProfile)==null?void 0:Z.company_name)||(n==null?void 0:n.full_name)||(n==null?void 0:n.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:xe()})]})]})}),e.jsx(Be,{isOpen:g,onClose:()=>{j(!1),h(null)},title:`Search Results for "${s}"`,children:a?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):o?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[o.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(Le,{size:16,className:"text-primary"})," Clients (",o.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.clients.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${x.id}`,style:{fontWeight:600},children:x.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.client_name," • ",x.client_id_code]})]},x.id))})]}),o.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(H,{size:16,className:"text-teal"})," Departments (",o.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.departments.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${x.id}`,style:{fontWeight:600},children:x.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:x.code})]},x.id))})]}),o.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ce,{size:16,className:"text-secondary"})," Managers (",o.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.managers.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.manager_id_code," • ",x.department_name]})]},x.id))})]}),o.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(L,{size:16,className:"text-purple"})," Employees (",o.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.employees.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.employee_id_code," • ",x.department_name]})]},x.id))})]}),o.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(de,{size:16,className:"text-orange"})," Projects (",o.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:o.projects.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${x.id}`,style:{fontWeight:600},children:x.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",x.client_name," • Manager: ",x.manager_name]})]},x.id))})]}),o.clients.length===0&&o.departments.length===0&&o.managers.length===0&&o.employees.length===0&&o.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',s,'".']})})]}):null})]})};class S extends me.Component{constructor(s){super(s);te(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,l){var m,o,h;if(console.error("ErrorBoundary caught an error:",s,l),this.setState({errorInfo:l}),s&&(s.name==="ChunkLoadError"||((m=s.message)==null?void 0:m.includes("Failed to fetch dynamically imported module"))||((o=s.message)==null?void 0:o.includes("Importing a module script failed"))||((h=s.message)==null?void 0:h.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,l;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((l=this.state.errorInfo)==null?void 0:l.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const p=r=>b.lazy(()=>r().catch(t=>{var l,a,m;throw t&&(t.name==="ChunkLoadError"||((l=t.message)==null?void 0:l.includes("Failed to fetch dynamically imported module"))||((a=t.message)==null?void 0:a.includes("Importing a module script failed"))||((m=t.message)==null?void 0:m.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),We=p(()=>d(()=>import("./Login-9nQsQg3s.js"),__vite__mapDeps([0,1,2]))),$e=p(()=>d(()=>import("./AdminDashboard-CRnuzUPm.js"),__vite__mapDeps([3,1,2]))),Fe=p(()=>d(()=>import("./ClientList-CESHlLIT.js"),__vite__mapDeps([4,1,2,5,6,7]))),qe=p(()=>d(()=>import("./DepartmentList-pNhCdoBx.js"),__vite__mapDeps([8,1,2,5,6]))),Ye=p(()=>d(()=>import("./ManagerList-jkgFt7of.js"),__vite__mapDeps([9,1,2,5,6,7]))),He=p(()=>d(()=>import("./EmployeeList-0YezJMk1.js"),__vite__mapDeps([10,1,2,5,6,7]))),Ge=p(()=>d(()=>import("./ProjectList-CY35FXHu.js"),__vite__mapDeps([11,1,2,12,13,6]))),Je=p(()=>d(()=>import("./DeliverableList-CmA-ZCah.js"),__vite__mapDeps([14,1,2,5,6]))),Ke=p(()=>d(()=>import("./ReportDashboard-C0sT42ni.js"),__vite__mapDeps([15,1,2]))),Qe=p(()=>d(()=>import("./SuperadminReports-C-IHAAd_.js"),__vite__mapDeps([16,1,2,5]))),Xe=p(()=>d(()=>import("./ActivityTypeList-CI3F0TtK.js"),__vite__mapDeps([17,1,2,6]))),Ze=p(()=>d(()=>import("./LoginCredentials-BihAzOcy.js"),__vite__mapDeps([18,1,2,5]))),Ue=p(()=>d(()=>import("./WorkUpdates-BMGqivLp.js"),__vite__mapDeps([19,1,2,20]))),N=p(()=>d(()=>import("./ClientPortal-C3zfgAOC.js"),__vite__mapDeps([21,1,2]))),et=p(()=>d(()=>import("./ManagerDashboard-CZi-Neql.js"),__vite__mapDeps([22,1,2]))),tt=p(()=>d(()=>import("./ManagerCalendar-2gEY9llX.js"),__vite__mapDeps([23,1,2,12,13,6]))),st=p(()=>d(()=>import("./ManagerDailyTodo-pqUGk2qi.js"),__vite__mapDeps([24,1,2]))),nt=p(()=>d(()=>import("./DesignerWorkload-Cvao2RyW.js"),__vite__mapDeps([25,1,2,26]))),ot=p(()=>d(()=>import("./CompletedWorks-CjhUaL3h.js"),__vite__mapDeps([27,1,2,28]))),rt=p(()=>d(()=>import("./ManagerSubmissionsReview-DNyIjhxa.js"),__vite__mapDeps([29,1,2]))),at=p(()=>d(()=>import("./ManagerClientRework-DNZ5_qRM.js"),__vite__mapDeps([30,1,2]))),it=p(()=>d(()=>import("./ManagerJobWorks-Bh4CFiav.js"),__vite__mapDeps([31,1,2,5]))),lt=p(()=>d(()=>import("./ManagerSubDepartmentList-D7vr9FFc.js"),__vite__mapDeps([32,1,2]))),ct=p(()=>d(()=>import("./ManagerEmployeeList-C5I_r2BZ.js"),__vite__mapDeps([33,1,2,5,34,35]))),dt=p(()=>d(()=>import("./ManagerEfficiency-DZ2FwHMP.js"),__vite__mapDeps([34,1,2,35]))),oe=p(()=>d(()=>import("./SMMTodayPosting-DUw0sQU2.js"),__vite__mapDeps([36,1,2]))),re=p(()=>d(()=>import("./SMMMonthlyPosting-CmwlKNAO.js"),__vite__mapDeps([37,1,2,5]))),ae=p(()=>d(()=>import("./SMMPosted-kXBfH9fL.js"),__vite__mapDeps([38,1,2,5]))),ie=p(()=>d(()=>import("./BlogCalendarView-Bpk-xt_w.js"),__vite__mapDeps([39,1,2,6]))),pt=p(()=>d(()=>import("./AdminBlogsAssignment-kDtwrqFh.js"),__vite__mapDeps([40,1,2,5,6]))),mt=p(()=>d(()=>import("./ManagerBlogClients-BLqnkwXD.js"),__vite__mapDeps([41,1,2,5,6])));p(()=>d(()=>import("./WritersAssignment-Fdod0D2V.js"),__vite__mapDeps([42,1,2])));const le=p(()=>d(()=>import("./SEOAssignTask-Fdod0D2V.js"),__vite__mapDeps([43,1,2]))),ut=p(()=>d(()=>import("./EmployeeDashboard-Crt4sTwL.js"),__vite__mapDeps([44,1,2]))),xt=p(()=>d(()=>import("./EmployeeCalendar-C40rcUiu.js"),__vite__mapDeps([45,1,2,12,13,6]))),F=p(()=>d(()=>import("./EmployeeEventCalendar-B7ydmfiL.js"),__vite__mapDeps([46,1,2]))),ht=p(()=>d(()=>import("./EmployeeAssignedWork-HMNmmIG7.js"),__vite__mapDeps([47,1,2]))),ft=p(()=>d(()=>import("./EmployeeReassignedWork-DARgZw6B.js"),__vite__mapDeps([48,1,2]))),gt=p(()=>d(()=>import("./EmployeeApprovedWork-QhSM-VIu.js"),__vite__mapDeps([49,1,2,5]))),jt=p(()=>d(()=>import("./EmployeeTodayDeliverables-Bv01pXC5.js"),__vite__mapDeps([50,1,2]))),bt=p(()=>d(()=>import("./EmployeeRework-CnnRKvCV.js"),__vite__mapDeps([51,1,2]))),_t=p(()=>d(()=>import("./EmployeeOverallWork-DUoMbUTg.js"),__vite__mapDeps([52,1,2]))),yt=p(()=>d(()=>import("./SuperAdminDashboard-fMgxNtMR.js"),__vite__mapDeps([53,1,2]))),vt=p(()=>d(()=>import("./SuperAdminClients-D8XsbsyE.js"),__vite__mapDeps([54,1,2,5]))),wt=p(()=>d(()=>import("./SuperAdminEfficiency-BwwYaoU2.js"),__vite__mapDeps([55,1,2,5]))),Et=p(()=>d(()=>import("./SuperAdminBranches-tbPKthkH.js"),__vite__mapDeps([56,1,2,5]))),kt=p(()=>d(()=>import("./SuperAdminBranchDetail-Du4QRdKx.js"),__vite__mapDeps([57,1,2,5]))),St=p(()=>d(()=>import("./SuperAdminProfile-BBWcQ__K.js"),__vite__mapDeps([58,1,2]))),E=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),W=()=>{try{const r=localStorage.getItem("erp_user");return r?JSON.parse(r):null}catch{return null}},Ct=()=>{const{isAuthenticated:r,user:t,loading:s}=P(),l=t||W();return s?e.jsx(E,{}):!l||l.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]})},Lt=()=>{const{isAuthenticated:r,user:t,isAdmin:s,loading:l}=P(),a=t||W(),m=s||a&&(a.role==="admin"||a.role==="super_admin");return l?e.jsx(E,{}):!a||!m?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]})},Pt=()=>{const{isAuthenticated:r,user:t,loading:s}=P(),l=t||W();return s?e.jsx(E,{}):!l||l.role!=="manager"&&l.role!=="admin"&&l.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]})},Rt=()=>{const{isAuthenticated:r,user:t,loading:s}=P(),l=t||W(),a=((l==null?void 0:l.username)||"").trim().toLowerCase(),m=l&&(l.role==="client"||l.user_type==="client"||a==="gem"||a==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(E,{}):m?e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]}):e.jsx(v,{to:"/login",replace:!0})},At=()=>{const{isAuthenticated:r,user:t,loading:s}=P(),l=t||W();return s?e.jsx(E,{}):!l||l.role!=="employee"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]})};function zt(){return e.jsx(Pe,{children:e.jsx(Oe,{children:e.jsx(Me,{children:e.jsx(S,{children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsxs(Re,{children:[e.jsx(i,{path:"/login",element:e.jsx(We,{})}),e.jsxs(i,{path:"/super-admin",element:e.jsx(Ct,{}),children:[e.jsx(i,{path:"dashboard",element:e.jsx(yt,{})}),e.jsx(i,{path:"clients",element:e.jsx(vt,{})}),e.jsx(i,{path:"efficiency",element:e.jsx(wt,{})}),e.jsx(i,{path:"branches",element:e.jsx(Et,{})}),e.jsx(i,{path:"branches/:id",element:e.jsx(kt,{})}),e.jsx(i,{path:"event-calendar",element:e.jsx(S,{children:e.jsx(F,{})})}),e.jsx(i,{path:"profile",element:e.jsx(St,{})}),e.jsx(i,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(i,{path:"/admin",element:e.jsx(Lt,{}),children:[e.jsx(i,{path:"dashboard",element:e.jsx($e,{})}),e.jsx(i,{path:"clients",element:e.jsx(Fe,{})}),e.jsx(i,{path:"departments",element:e.jsx(qe,{})}),e.jsx(i,{path:"managers",element:e.jsx(Ye,{})}),e.jsx(i,{path:"employees",element:e.jsx(He,{})}),e.jsx(i,{path:"projects",element:e.jsx(Ge,{})}),e.jsx(i,{path:"blog-calendar",element:e.jsx(ie,{})}),e.jsx(i,{path:"blog-assignments",element:e.jsx(pt,{})}),e.jsx(i,{path:"event-calendar",element:e.jsx(S,{children:e.jsx(F,{})})}),e.jsx(i,{path:"deliverables",element:e.jsx(Je,{})}),e.jsx(i,{path:"reports",element:e.jsx(Ke,{})}),e.jsx(i,{path:"superadmin-reports",element:e.jsx(Qe,{})}),e.jsx(i,{path:"activity-types",element:e.jsx(Xe,{})}),e.jsx(i,{path:"credentials",element:e.jsx(Ze,{})}),e.jsx(i,{path:"work-updates",element:e.jsx(Ue,{})}),e.jsx(i,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(i,{path:"/manager",element:e.jsx(Pt,{}),children:[e.jsx(i,{path:"dashboard",element:e.jsx(et,{})}),e.jsx(i,{path:"calendar",element:e.jsx(tt,{})}),e.jsx(i,{path:"event-calendar",element:e.jsx(S,{children:e.jsx(F,{})})}),e.jsx(i,{path:"daily-todo",element:e.jsx(st,{})}),e.jsx(i,{path:"designer-workload",element:e.jsx(nt,{})}),e.jsx(i,{path:"completed-works",element:e.jsx(ot,{})}),e.jsx(i,{path:"sub-departments",element:e.jsx(lt,{})}),e.jsx(i,{path:"employees",element:e.jsx(ct,{})}),e.jsx(i,{path:"efficiency",element:e.jsx(dt,{})}),e.jsx(i,{path:"submissions-review",element:e.jsx(S,{children:e.jsx(rt,{})})}),e.jsx(i,{path:"client-reworks",element:e.jsx(at,{})}),e.jsx(i,{path:"job-works",element:e.jsx(it,{})}),e.jsx(i,{path:"today-posting",element:e.jsx(oe,{})}),e.jsx(i,{path:"monthly-posting",element:e.jsx(re,{})}),e.jsx(i,{path:"posted",element:e.jsx(ae,{})}),e.jsx(i,{path:"assign-task",element:e.jsx(S,{children:e.jsx(le,{})})}),e.jsx(i,{path:"clients",element:e.jsx(S,{children:e.jsx(mt,{})})}),e.jsx(i,{path:"blog-calendar",element:e.jsx(ie,{})}),e.jsx(i,{path:"writers-assignment",element:e.jsx(S,{children:e.jsx(le,{})})}),e.jsx(i,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(i,{path:"/employee",element:e.jsx(At,{}),children:[e.jsx(i,{path:"dashboard",element:e.jsx(ut,{})}),e.jsx(i,{path:"calendar",element:e.jsx(xt,{})}),e.jsx(i,{path:"event-calendar",element:e.jsx(S,{children:e.jsx(F,{})})}),e.jsx(i,{path:"assigned-work",element:e.jsx(ht,{})}),e.jsx(i,{path:"reassigned-work",element:e.jsx(ft,{})}),e.jsx(i,{path:"approved-work",element:e.jsx(gt,{})}),e.jsx(i,{path:"overall-work",element:e.jsx(_t,{})}),e.jsx(i,{path:"today",element:e.jsx(jt,{})}),e.jsx(i,{path:"rework",element:e.jsx(bt,{})}),e.jsx(i,{path:"today-posting",element:e.jsx(oe,{isEmployee:!0})}),e.jsx(i,{path:"monthly-posting",element:e.jsx(re,{isEmployee:!0})}),e.jsx(i,{path:"posted",element:e.jsx(ae,{isEmployee:!0})}),e.jsx(i,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(i,{path:"/client",element:e.jsx(Rt,{}),children:[e.jsx(i,{path:"dashboard",element:e.jsx(N,{activeTabProp:"dashboard"})}),e.jsx(i,{path:"approvals",element:e.jsx(N,{activeTabProp:"approvals"})}),e.jsx(i,{path:"reachskyline-approvals",element:e.jsx(N,{activeTabProp:"reachskyline_approvals"})}),e.jsx(i,{path:"reports",element:e.jsx(N,{activeTabProp:"reports"})}),e.jsx(i,{path:"contact",element:e.jsx(N,{activeTabProp:"contact"})}),e.jsx(i,{path:"portal",element:e.jsx(v,{to:"/client/dashboard",replace:!0})}),e.jsx(i,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsx(i,{path:"*",element:e.jsx(v,{to:"/login",replace:!0})})]})})})})})})}window.alert=r=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let s="info",l="Notification";const a=(r||"").toLowerCase();a.includes("already approved")||a.includes("can't edit")||a.includes("cannot edit")?(s="info",l="Info"):a.includes("success")||a.includes("approve")||a.includes("submit")?(s="success",l="Success"):(a.includes("fail")||a.includes("error")||a.includes("invalid")||a.includes("please"))&&(s="error",l="Alert");let m="";s==="success"?m='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?m='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':m='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const o=document.createElement("div");o.className="custom-alert-backdrop";const h=document.createElement("div");h.className="custom-alert-box",h.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${m}
    </div>
    <h3 class="custom-alert-title">${l}</h3>
    <p class="custom-alert-message">${r}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(o),t.appendChild(h);const g=()=>{h.classList.remove("show"),o.classList.remove("show"),setTimeout(()=>{t.contains(o)&&t.removeChild(o),t.contains(h)&&t.removeChild(h)},300)},j=h.querySelector(".custom-alert-btn");j.addEventListener("click",g),o.addEventListener("click",g),requestAnimationFrame(()=>{o.classList.add("show"),h.classList.add("show"),j.focus()})};window.confirm=r=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const j=document.createElement("style");j.textContent=`
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
      `,document.head.appendChild(j),document.body.appendChild(s)}s.innerHTML="";const l=document.createElement("div");l.className="custom-confirm-backdrop";const a=document.createElement("div");a.className="custom-confirm-box";const m='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';a.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${m}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${r}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(l),s.appendChild(a);const o=j=>{a.classList.remove("show"),l.classList.remove("show"),setTimeout(()=>{s.contains(l)&&s.removeChild(l),s.contains(a)&&s.removeChild(a),t(j)},300)},h=a.querySelector(".custom-confirm-btn-cancel"),g=a.querySelector(".custom-confirm-btn-confirm");h.addEventListener("click",()=>o(!1)),g.addEventListener("click",()=>o(!0)),l.addEventListener("click",()=>o(!1)),requestAnimationFrame(()=>{l.classList.add("show"),a.classList.add("show"),g.focus()})});if(typeof window<"u"){const r=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var l;const s=((l=t.reason)==null?void 0:l.message)||String(t.reason||"");r(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var l;const s=t.message||String(((l=t.error)==null?void 0:l.message)||"");r(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}Ae.createRoot(document.getElementById("root")).render(e.jsx(me.StrictMode,{children:e.jsx(zt,{})}));export{Be as M,w as a,Ve as g,P as u};
