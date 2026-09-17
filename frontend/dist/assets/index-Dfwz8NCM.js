const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-C0-4vVPG.js","assets/vendor-react-DzTvxpcm.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-CTdNLeXS.js","assets/ClientList-BKsv6Urq.js","assets/Table-DeA0DfK_.js","assets/FormFields-CREDDlX1.js","assets/DepartmentList-BIcy0UQY.js","assets/ManagerList-CXtdxtzf.js","assets/EmployeeList-gd0G977M.js","assets/ProjectList-DOfs6JBx.js","assets/ContentCalendarView-ZJhq9Ua1.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-tvf95Y5W.js","assets/ReportDashboard-BqpfHDrv.js","assets/SuperadminReports-CCuqgiPL.js","assets/ActivityTypeList-a_K5ZlJE.js","assets/LoginCredentials-BWTWxHvF.js","assets/WorkUpdates-CllRR6i1.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-EUcEVxO2.js","assets/ManagerDashboard-Cy-he1ke.js","assets/ManagerCalendar-DprY43vN.js","assets/ManagerDailyTodo-kR2K43bZ.js","assets/DesignerWorkload-C_hdsT06.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-BpTQDLit.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-CC7Rvhpq.js","assets/ManagerClientRework-B0ctKdkU.js","assets/ManagerJobWorks-CDNIpFr7.js","assets/ManagerSubDepartmentList-DMVpvOkg.js","assets/ManagerEmployeeList-B30b3jdI.js","assets/ManagerEfficiency-BGQ6fuf4.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-D8Fkn8uD.js","assets/SMMMonthlyPosting-COvcFZNr.js","assets/SMMPosted-JhlfpDo2.js","assets/BlogCalendarView-yey8yz53.js","assets/AdminBlogsAssignment-seFS-LLu.js","assets/ManagerBlogClients-A_Di2Ehv.js","assets/WritersAssignment-CZzItRKb.js","assets/SEOAssignTask-CZzItRKb.js","assets/EmployeeDashboard-Bq0zRSZo.js","assets/EmployeeCalendar-CH6cPpI1.js","assets/EmployeeEventCalendar-CKLBq0q9.js","assets/EmployeeAssignedWork-BhkUtI-P.js","assets/EmployeeReassignedWork-2v4rjRNu.js","assets/EmployeeApprovedWork-DVMzy12E.js","assets/EmployeeTodayDeliverables-BCrTy0Rh.js","assets/EmployeeRework-DZcq9YV9.js","assets/EmployeeOverallWork-Dajyfpln.js","assets/SuperAdminDashboard-0u-1t6lo.js","assets/SuperAdminClients-jgF3Gxq1.js","assets/SuperAdminEfficiency-B7rLFBI3.js","assets/SuperAdminBranches-UcbjGshL.js","assets/SuperAdminBranchDetail-D42EL9fm.js","assets/SuperAdminProfile-DYylRF43.js"])))=>i.map(i=>d[i]);
var de=Object.defineProperty;var pe=(l,t,s)=>t in l?de(l,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[t]=s;var K=(l,t,s)=>pe(l,typeof t!="symbol"?t+"":t,s);import{r as b,j as e,N as me,L as ue,a as k,C as P,F as z,B as D,P as xe,b as F,U as L,c as T,d as he,e as O,f as $,g as Q,h as U,R as Y,i as fe,K as ge,A as oe,k as re,l as je,G as be,X as ae,M as _e,S as ye,m as ve,n as ie,o as we,p as Ee,q as r,s as v,O as M,t as ke}from"./vendor-react-DzTvxpcm.js";import{f as Se}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const m of o)if(m.type==="childList")for(const n of m.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function s(o){const m={};return o.integrity&&(m.integrity=o.integrity),o.referrerPolicy&&(m.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?m.credentials="include":o.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function i(o){if(o.ep)return;o.ep=!0;const m=s(o);fetch(o.href,m)}})();const Ce="modulepreload",Le=function(l){return"/"+l},X={},d=function(t,s,i){let o=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),h=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));o=Promise.allSettled(s.map(g=>{if(g=Le(g),g in X)return;X[g]=!0;const j=g.endsWith(".css"),c=j?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${c}`))return;const u=document.createElement("link");if(u.rel=j?"stylesheet":Ce,j||(u.as="script"),u.crossOrigin="",u.href=g,h&&u.setAttribute("nonce",h),document.head.appendChild(u),j)return new Promise((_,f)=>{u.addEventListener("load",_),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${g}`)))})}))}function m(n){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=n,window.dispatchEvent(h),!h.defaultPrevented)throw n}return o.then(n=>{for(const h of n||[])h.status==="rejected"&&m(h.reason);return t().catch(m)})},Re=()=>{const l="http://localhost:5050/api";{const t=l.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},w=Se.create({baseURL:Re(),timeout:3e4,headers:{"Content-Type":"application/json"}});w.interceptors.request.use(l=>{const t=localStorage.getItem("erp_token");return t&&(l.headers.Authorization=`Bearer ${t}`),l},l=>Promise.reject(l));w.interceptors.response.use(l=>l,async l=>{var h,g,j;const{config:t,response:s}=l,i=((h=t==null?void 0:t.method)==null?void 0:h.toLowerCase())==="get",o=!s,m=s&&s.status>=500;if(t&&i&&(o||m)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${l.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(u=>setTimeout(u,c)),w(t)}if(s&&(s.status===401||s.status===403&&(((g=s.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((j=s.data)==null?void 0:j.errors)&&s.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))){const c=localStorage.getItem("erp_user");c&&(c.includes('"role":"client"')||c.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(l)});const le=b.createContext(null),Ae=({children:l})=>{const[t,s]=b.useState(()=>{try{const c=localStorage.getItem("erp_user");return c?JSON.parse(c):null}catch{return null}}),[i,o]=b.useState(!1),m=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(u){var f,y;const _=async()=>{var a,A;try{const I=(A=(a=u.User)==null?void 0:a.PushSubscription)==null?void 0:A.id;I&&await w.post("/notifications/subscribe",{subscriptionId:I}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{u.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(a=>{console.warn("[OneSignal] Domain initialization deferred:",(a==null?void 0:a.message)||a)}),window.__oneSignalInitialized=!0}catch(a){console.warn("[OneSignal] Init warning:",a.message)}_();try{(y=(f=u.User)==null?void 0:f.PushSubscription)==null||y.addEventListener("change",function(a){var A;(A=a==null?void 0:a.current)!=null&&A.optedIn&&_()})}catch{}})}catch{}};b.useEffect(()=>{(async()=>{const u=localStorage.getItem("erp_token"),_=localStorage.getItem("erp_user");let f=null;try{f=_?JSON.parse(_):null}catch{}if(!u){if(f&&f.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(f),o(!1);return}s(null),o(!1);return}try{const y=await w.get("/auth/session");if(y.data&&y.data.success){const a=y.data.data.user;s(a),localStorage.setItem("erp_user",JSON.stringify(a))}else f&&f.role==="client"?s(f):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{f&&f.role==="client"&&s(f)}finally{o(!1)}})()},[]),b.useEffect(()=>{t&&m(t)},[t]);const n=async(c,u,_)=>{try{const f=await w.post("/auth/login",{username:c,password:u},{onRetry:_});if(f.data&&f.data.success){const{token:y,user:a}=f.data.data;return localStorage.setItem("erp_token",y||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(a)),s(a),o(!1),{success:!0}}}catch(f){const y=f.response&&f.response.data&&f.response.data.message?f.response.data.message:"Wrong credentials! Invalid username or password.",a=f.response&&f.response.data&&f.response.data.errors?f.response.data.errors:[];return{success:!1,message:y,errors:a}}},h=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var u,_;try{const f=(_=(u=c.User)==null?void 0:u.PushSubscription)==null?void 0:_.id;f&&await w.post("/notifications/unsubscribe",{subscriptionId:f}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),o(!1)},g=c=>{s(u=>{if(!u)return null;const _={...u,...c};return localStorage.setItem("erp_user",JSON.stringify(_)),_})},j={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:i,login:n,logout:h,updateCurrentUser:g};return e.jsx(le.Provider,{value:j,children:l})},R=()=>{const l=b.useContext(le);return l||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Pe=b.createContext(null),ze=({children:l})=>{const[t,s]=b.useState([]),[i,o]=b.useState(0),{isAuthenticated:m}=R(),n=b.useCallback(async()=>{if(m)try{const c=await w.get("/notifications");if(c.data&&c.data.success){const u=c.data.data.notifications;s(u);const _=u.filter(f=>!f.is_read).length;o(_)}}catch{}},[m]),h=async c=>{try{await w.patch(`/notifications/${c}/read`),s(u=>u.map(_=>_.id===parseInt(c)?{..._,is_read:1}:_)),o(u=>Math.max(0,u-1))}catch(u){console.error("Failed to mark notification as read:",u.message)}},g=async()=>{try{await w.post("/notifications/read-all"),s(c=>c.map(u=>({...u,is_read:1}))),o(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};b.useEffect(()=>{if(m){n();const c=setInterval(n,3e4);return()=>clearInterval(c)}else s([]),o(0)},[m,n]);const j={notifications:t,unreadCount:i,fetchNotifications:n,markAsRead:h,markAllRead:g};return e.jsx(Pe.Provider,{value:j,children:l})},B=()=>{const{logout:l,user:t}=R(),s=()=>{const n=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(F,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(U,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(oe,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(L,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(Q,{size:20})},{label:"Blog Calendar",path:"/admin/blog-calendar",icon:e.jsx(re,{size:20})},{label:"Blog Assignments",path:"/admin/blog-assignments",icon:e.jsx(je,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(T,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(T,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(D,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(be,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&n.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(z,{size:20})}),n.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(fe,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(ge,{size:20})}),n},i=()=>{var g,j,c,u;const n=window.location.pathname.startsWith("/client");return(t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||n?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(k,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(P,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(z,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(D,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(xe,{size:20})}]:(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(F,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(L,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(T,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(D,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(he,{size:20})}]:(t==null?void 0:t.role)==="manager"?((g=t==null?void 0:t.managerProfile)==null?void 0:g.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(O,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(P,{size:20})}]:((j=t==null?void 0:t.managerProfile)==null?void 0:j.department_code)==="SEO-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Clients for Blog",path:"/manager/clients",icon:e.jsx(F,{size:20})},{label:"Blog Calendar",path:"/manager/blog-calendar",icon:e.jsx(Q,{size:20})},{label:"Assign Task",path:"/manager/assign-task",icon:e.jsx(L,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(P,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(D,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(z,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(O,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(P,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx($,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(T,{size:20})},{label:"Assign Task",path:"/manager/assign-task",icon:e.jsx(L,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(U,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(D,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(z,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(Y,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(z,{size:20})}]:(t==null?void 0:t.role)==="employee"?((c=t==null?void 0:t.employeeProfile)==null?void 0:c.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(O,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx($,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(P,{size:20})}]:((u=t==null?void 0:t.employeeProfile)==null?void 0:u.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(T,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(O,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(Y,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(z,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx($,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(O,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(Y,{size:20})},{label:"Completed Work",path:"/employee/completed-work",icon:e.jsx(P,{size:20})}]:s()},o=()=>{document.body.classList.remove("mobile-sidebar-open")},m=i();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:o}),e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:m.map((n,h)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(me,{to:n.path,state:n.state,onClick:o,className:({isActive:g})=>`sidebar-link ${g?"active":""}`,children:[n.icon,e.jsx("span",{children:n.label})]})},h))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:l,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:n=>{n.currentTarget.style.color="#f87171"},onMouseLeave:n=>{n.currentTarget.style.color="var(--danger)"},children:[e.jsx(ue,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Ie=({isOpen:l,onClose:t,title:s,children:i,footer:o=null})=>(b.useEffect(()=>(l?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[l]),l?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:m=>m.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(ae,{size:20})})]}),e.jsx("div",{className:"modal-body",children:i}),o&&e.jsx("div",{className:"modal-footer",children:o})]})}):null),V=()=>{var H;const{user:l,logout:t}=R(),[s,i]=b.useState(""),[o,m]=b.useState(!1),[n,h]=b.useState(null),[g,j]=b.useState(!1),[c,u]=b.useState(!1),_=()=>{const x=!c;u(x),x?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};b.useEffect(()=>{const x=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),u(!1))};return window.addEventListener("resize",x),()=>window.removeEventListener("resize",x)},[]);const f=async x=>{if(x.preventDefault(),!!s.trim()){m(!0),j(!0);try{const C=await w.get(`/search?q=${encodeURIComponent(s)}`);C.data&&C.data.success&&h(C.data.data)}catch(C){console.error("Global search error:",C.message)}finally{m(!1)}}},y=window.location.pathname.startsWith("/client"),a=y?l&&(l.role==="client"||l.user_type==="client")?l:{username:"gem",full_name:"rajesh kumar",role:"client"}:l,A=a&&a.username?a.username.slice(0,2).toUpperCase():"CL",I=()=>{var x,C,J,G;return y||(a==null?void 0:a.role)==="client"?"Client Partner":(a==null?void 0:a.role)==="manager"?((x=a==null?void 0:a.managerProfile)==null?void 0:x.department_code)==="SMM-RS"?"SMM Manager":(C=a==null?void 0:a.managerProfile)!=null&&C.department_name?`${a.managerProfile.department_name} Manager`:"Brand Manager":(a==null?void 0:a.role)==="employee"?((J=a==null?void 0:a.employeeProfile)==null?void 0:J.department_code)==="SMM-RS"?"SMM Employee":(G=a==null?void 0:a.employeeProfile)!=null&&G.department_name?`${a.employeeProfile.department_name} Employee`:"Employee":(a==null?void 0:a.role)==="admin"?"Administrator":(a==null?void 0:a.role)==="super_admin"?"Super Administrator":(a==null?void 0:a.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:_,"aria-label":"Toggle Navigation",children:c?e.jsx(ae,{size:24}):e.jsx(_e,{size:24})}),e.jsx("form",{onSubmit:f,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(ye,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:s,onChange:x=>i(x.target.value)})]})})]}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:A}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((H=a==null?void 0:a.clientProfile)==null?void 0:H.company_name)||(a==null?void 0:a.full_name)||(a==null?void 0:a.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:I()})]})]})}),e.jsx(Ie,{isOpen:g,onClose:()=>{j(!1),h(null)},title:`Search Results for "${s}"`,children:o?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):n?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[n.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ve,{size:16,className:"text-primary"})," Clients (",n.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.clients.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${x.id}`,style:{fontWeight:600},children:x.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.client_name," • ",x.client_id_code]})]},x.id))})]}),n.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(U,{size:16,className:"text-teal"})," Departments (",n.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.departments.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${x.id}`,style:{fontWeight:600},children:x.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:x.code})]},x.id))})]}),n.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(oe,{size:16,className:"text-secondary"})," Managers (",n.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.managers.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.manager_id_code," • ",x.department_name]})]},x.id))})]}),n.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(L,{size:16,className:"text-purple"})," Employees (",n.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.employees.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.employee_id_code," • ",x.department_name]})]},x.id))})]}),n.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(re,{size:16,className:"text-orange"})," Projects (",n.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:n.projects.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${x.id}`,style:{fontWeight:600},children:x.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",x.client_name," • Manager: ",x.manager_name]})]},x.id))})]}),n.clients.length===0&&n.departments.length===0&&n.managers.length===0&&n.employees.length===0&&n.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',s,'".']})})]}):null})]})};class S extends ie.Component{constructor(s){super(s);K(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,i){var m,n,h;if(console.error("ErrorBoundary caught an error:",s,i),this.setState({errorInfo:i}),s&&(s.name==="ChunkLoadError"||((m=s.message)==null?void 0:m.includes("Failed to fetch dynamically imported module"))||((n=s.message)==null?void 0:n.includes("Importing a module script failed"))||((h=s.message)==null?void 0:h.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,i;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((i=this.state.errorInfo)==null?void 0:i.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const p=l=>b.lazy(()=>l().catch(t=>{var i,o,m;throw t&&(t.name==="ChunkLoadError"||((i=t.message)==null?void 0:i.includes("Failed to fetch dynamically imported module"))||((o=t.message)==null?void 0:o.includes("Importing a module script failed"))||((m=t.message)==null?void 0:m.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),De=p(()=>d(()=>import("./Login-C0-4vVPG.js"),__vite__mapDeps([0,1,2]))),Te=p(()=>d(()=>import("./AdminDashboard-CTdNLeXS.js"),__vite__mapDeps([3,1,2]))),Oe=p(()=>d(()=>import("./ClientList-BKsv6Urq.js"),__vite__mapDeps([4,1,2,5,6]))),Ne=p(()=>d(()=>import("./DepartmentList-BIcy0UQY.js"),__vite__mapDeps([7,1,2,5,6]))),Me=p(()=>d(()=>import("./ManagerList-CXtdxtzf.js"),__vite__mapDeps([8,1,2,5,6]))),Be=p(()=>d(()=>import("./EmployeeList-gd0G977M.js"),__vite__mapDeps([9,1,2,5,6]))),Ve=p(()=>d(()=>import("./ProjectList-DOfs6JBx.js"),__vite__mapDeps([10,1,2,11,12,6]))),We=p(()=>d(()=>import("./DeliverableList-tvf95Y5W.js"),__vite__mapDeps([13,1,2,5,6]))),$e=p(()=>d(()=>import("./ReportDashboard-BqpfHDrv.js"),__vite__mapDeps([14,1,2]))),qe=p(()=>d(()=>import("./SuperadminReports-CCuqgiPL.js"),__vite__mapDeps([15,1,2,5]))),Fe=p(()=>d(()=>import("./ActivityTypeList-a_K5ZlJE.js"),__vite__mapDeps([16,1,2,6]))),Ye=p(()=>d(()=>import("./LoginCredentials-BWTWxHvF.js"),__vite__mapDeps([17,1,2,5]))),Ue=p(()=>d(()=>import("./WorkUpdates-CllRR6i1.js"),__vite__mapDeps([18,1,2,19]))),N=p(()=>d(()=>import("./ClientPortal-EUcEVxO2.js"),__vite__mapDeps([20,1,2]))),He=p(()=>d(()=>import("./ManagerDashboard-Cy-he1ke.js"),__vite__mapDeps([21,1,2]))),Je=p(()=>d(()=>import("./ManagerCalendar-DprY43vN.js"),__vite__mapDeps([22,1,2,11,12,6]))),Ge=p(()=>d(()=>import("./ManagerDailyTodo-kR2K43bZ.js"),__vite__mapDeps([23,1,2]))),Ke=p(()=>d(()=>import("./DesignerWorkload-C_hdsT06.js"),__vite__mapDeps([24,1,2,25]))),Qe=p(()=>d(()=>import("./CompletedWorks-BpTQDLit.js"),__vite__mapDeps([26,1,2,27]))),Xe=p(()=>d(()=>import("./ManagerSubmissionsReview-CC7Rvhpq.js"),__vite__mapDeps([28,1,2]))),Ze=p(()=>d(()=>import("./ManagerClientRework-B0ctKdkU.js"),__vite__mapDeps([29,1,2]))),et=p(()=>d(()=>import("./ManagerJobWorks-CDNIpFr7.js"),__vite__mapDeps([30,1,2,5]))),tt=p(()=>d(()=>import("./ManagerSubDepartmentList-DMVpvOkg.js"),__vite__mapDeps([31,1,2]))),st=p(()=>d(()=>import("./ManagerEmployeeList-B30b3jdI.js"),__vite__mapDeps([32,1,2,5,33,34]))),nt=p(()=>d(()=>import("./ManagerEfficiency-BGQ6fuf4.js"),__vite__mapDeps([33,1,2,34]))),Z=p(()=>d(()=>import("./SMMTodayPosting-D8Fkn8uD.js"),__vite__mapDeps([35,1,2]))),ee=p(()=>d(()=>import("./SMMMonthlyPosting-COvcFZNr.js"),__vite__mapDeps([36,1,2,5]))),te=p(()=>d(()=>import("./SMMPosted-JhlfpDo2.js"),__vite__mapDeps([37,1,2,5]))),se=p(()=>d(()=>import("./BlogCalendarView-yey8yz53.js"),__vite__mapDeps([38,1,2,6]))),ot=p(()=>d(()=>import("./AdminBlogsAssignment-seFS-LLu.js"),__vite__mapDeps([39,1,2,5,6]))),rt=p(()=>d(()=>import("./ManagerBlogClients-A_Di2Ehv.js"),__vite__mapDeps([40,1,2,5,6])));p(()=>d(()=>import("./WritersAssignment-CZzItRKb.js"),__vite__mapDeps([41,1,2])));const ne=p(()=>d(()=>import("./SEOAssignTask-CZzItRKb.js"),__vite__mapDeps([42,1,2]))),at=p(()=>d(()=>import("./EmployeeDashboard-Bq0zRSZo.js"),__vite__mapDeps([43,1,2]))),it=p(()=>d(()=>import("./EmployeeCalendar-CH6cPpI1.js"),__vite__mapDeps([44,1,2,11,12,6]))),q=p(()=>d(()=>import("./EmployeeEventCalendar-CKLBq0q9.js"),__vite__mapDeps([45,1,2]))),lt=p(()=>d(()=>import("./EmployeeAssignedWork-BhkUtI-P.js"),__vite__mapDeps([46,1,2]))),ct=p(()=>d(()=>import("./EmployeeReassignedWork-2v4rjRNu.js"),__vite__mapDeps([47,1,2]))),dt=p(()=>d(()=>import("./EmployeeApprovedWork-DVMzy12E.js"),__vite__mapDeps([48,1,2,5]))),pt=p(()=>d(()=>import("./EmployeeTodayDeliverables-BCrTy0Rh.js"),__vite__mapDeps([49,1,2]))),mt=p(()=>d(()=>import("./EmployeeRework-DZcq9YV9.js"),__vite__mapDeps([50,1,2]))),ut=p(()=>d(()=>import("./EmployeeOverallWork-Dajyfpln.js"),__vite__mapDeps([51,1,2]))),xt=p(()=>d(()=>import("./SuperAdminDashboard-0u-1t6lo.js"),__vite__mapDeps([52,1,2]))),ht=p(()=>d(()=>import("./SuperAdminClients-jgF3Gxq1.js"),__vite__mapDeps([53,1,2,5]))),ft=p(()=>d(()=>import("./SuperAdminEfficiency-B7rLFBI3.js"),__vite__mapDeps([54,1,2,5]))),gt=p(()=>d(()=>import("./SuperAdminBranches-UcbjGshL.js"),__vite__mapDeps([55,1,2,5]))),jt=p(()=>d(()=>import("./SuperAdminBranchDetail-D42EL9fm.js"),__vite__mapDeps([56,1,2,5]))),bt=p(()=>d(()=>import("./SuperAdminProfile-DYylRF43.js"),__vite__mapDeps([57,1,2]))),E=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),W=()=>{try{const l=localStorage.getItem("erp_user");return l?JSON.parse(l):null}catch{return null}},_t=()=>{const{isAuthenticated:l,user:t,loading:s}=R(),i=t||W();return s?e.jsx(E,{}):!i||i.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]})},yt=()=>{const{isAuthenticated:l,user:t,isAdmin:s,loading:i}=R(),o=t||W(),m=s||o&&(o.role==="admin"||o.role==="super_admin");return i?e.jsx(E,{}):!o||!m?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]})},vt=()=>{const{isAuthenticated:l,user:t,loading:s}=R(),i=t||W();return s?e.jsx(E,{}):!i||i.role!=="manager"&&i.role!=="admin"&&i.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]})},wt=()=>{const{isAuthenticated:l,user:t,loading:s}=R(),i=t||W(),o=((i==null?void 0:i.username)||"").trim().toLowerCase(),m=i&&(i.role==="client"||i.user_type==="client"||o==="gem"||o==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(E,{}):m?e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]}):e.jsx(v,{to:"/login",replace:!0})},Et=()=>{const{isAuthenticated:l,user:t,loading:s}=R(),i=t||W();return s?e.jsx(E,{}):!i||i.role!=="employee"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(B,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(V,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(M,{})})})]})]})};function kt(){return e.jsx(we,{children:e.jsx(Ae,{children:e.jsx(ze,{children:e.jsx(S,{children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsxs(Ee,{children:[e.jsx(r,{path:"/login",element:e.jsx(De,{})}),e.jsxs(r,{path:"/super-admin",element:e.jsx(_t,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(xt,{})}),e.jsx(r,{path:"clients",element:e.jsx(ht,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(ft,{})}),e.jsx(r,{path:"branches",element:e.jsx(gt,{})}),e.jsx(r,{path:"branches/:id",element:e.jsx(jt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(S,{children:e.jsx(q,{})})}),e.jsx(r,{path:"profile",element:e.jsx(bt,{})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/admin",element:e.jsx(yt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Te,{})}),e.jsx(r,{path:"clients",element:e.jsx(Oe,{})}),e.jsx(r,{path:"departments",element:e.jsx(Ne,{})}),e.jsx(r,{path:"managers",element:e.jsx(Me,{})}),e.jsx(r,{path:"employees",element:e.jsx(Be,{})}),e.jsx(r,{path:"projects",element:e.jsx(Ve,{})}),e.jsx(r,{path:"blog-calendar",element:e.jsx(se,{})}),e.jsx(r,{path:"blog-assignments",element:e.jsx(ot,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(S,{children:e.jsx(q,{})})}),e.jsx(r,{path:"deliverables",element:e.jsx(We,{})}),e.jsx(r,{path:"reports",element:e.jsx($e,{})}),e.jsx(r,{path:"superadmin-reports",element:e.jsx(qe,{})}),e.jsx(r,{path:"activity-types",element:e.jsx(Fe,{})}),e.jsx(r,{path:"credentials",element:e.jsx(Ye,{})}),e.jsx(r,{path:"work-updates",element:e.jsx(Ue,{})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/manager",element:e.jsx(vt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(He,{})}),e.jsx(r,{path:"calendar",element:e.jsx(Je,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(S,{children:e.jsx(q,{})})}),e.jsx(r,{path:"daily-todo",element:e.jsx(Ge,{})}),e.jsx(r,{path:"designer-workload",element:e.jsx(Ke,{})}),e.jsx(r,{path:"completed-works",element:e.jsx(Qe,{})}),e.jsx(r,{path:"sub-departments",element:e.jsx(tt,{})}),e.jsx(r,{path:"employees",element:e.jsx(st,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(nt,{})}),e.jsx(r,{path:"submissions-review",element:e.jsx(S,{children:e.jsx(Xe,{})})}),e.jsx(r,{path:"client-reworks",element:e.jsx(Ze,{})}),e.jsx(r,{path:"job-works",element:e.jsx(et,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Z,{})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(ee,{})}),e.jsx(r,{path:"posted",element:e.jsx(te,{})}),e.jsx(r,{path:"assign-task",element:e.jsx(S,{children:e.jsx(ne,{})})}),e.jsx(r,{path:"clients",element:e.jsx(S,{children:e.jsx(rt,{})})}),e.jsx(r,{path:"blog-calendar",element:e.jsx(se,{})}),e.jsx(r,{path:"writers-assignment",element:e.jsx(S,{children:e.jsx(ne,{})})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/employee",element:e.jsx(Et,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(at,{})}),e.jsx(r,{path:"calendar",element:e.jsx(it,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(S,{children:e.jsx(q,{})})}),e.jsx(r,{path:"assigned-work",element:e.jsx(lt,{})}),e.jsx(r,{path:"reassigned-work",element:e.jsx(ct,{})}),e.jsx(r,{path:"approved-work",element:e.jsx(dt,{})}),e.jsx(r,{path:"overall-work",element:e.jsx(ut,{})}),e.jsx(r,{path:"today",element:e.jsx(pt,{})}),e.jsx(r,{path:"rework",element:e.jsx(mt,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(ee,{isEmployee:!0})}),e.jsx(r,{path:"posted",element:e.jsx(te,{isEmployee:!0})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/client",element:e.jsx(wt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(N,{activeTabProp:"dashboard"})}),e.jsx(r,{path:"approvals",element:e.jsx(N,{activeTabProp:"approvals"})}),e.jsx(r,{path:"reachskyline-approvals",element:e.jsx(N,{activeTabProp:"reachskyline_approvals"})}),e.jsx(r,{path:"reports",element:e.jsx(N,{activeTabProp:"reports"})}),e.jsx(r,{path:"contact",element:e.jsx(N,{activeTabProp:"contact"})}),e.jsx(r,{path:"portal",element:e.jsx(v,{to:"/client/dashboard",replace:!0})}),e.jsx(r,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsx(r,{path:"*",element:e.jsx(v,{to:"/login",replace:!0})})]})})})})})})}window.alert=l=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let s="info",i="Notification";const o=(l||"").toLowerCase();o.includes("already approved")||o.includes("can't edit")||o.includes("cannot edit")?(s="info",i="Info"):o.includes("success")||o.includes("approve")||o.includes("submit")?(s="success",i="Success"):(o.includes("fail")||o.includes("error")||o.includes("invalid")||o.includes("please"))&&(s="error",i="Alert");let m="";s==="success"?m='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?m='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':m='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const n=document.createElement("div");n.className="custom-alert-backdrop";const h=document.createElement("div");h.className="custom-alert-box",h.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${m}
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
      `,document.head.appendChild(j),document.body.appendChild(s)}s.innerHTML="";const i=document.createElement("div");i.className="custom-confirm-backdrop";const o=document.createElement("div");o.className="custom-confirm-box";const m='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';o.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${m}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${l}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(i),s.appendChild(o);const n=j=>{o.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{s.contains(i)&&s.removeChild(i),s.contains(o)&&s.removeChild(o),t(j)},300)},h=o.querySelector(".custom-confirm-btn-cancel"),g=o.querySelector(".custom-confirm-btn-confirm");h.addEventListener("click",()=>n(!1)),g.addEventListener("click",()=>n(!0)),i.addEventListener("click",()=>n(!1)),requestAnimationFrame(()=>{i.classList.add("show"),o.classList.add("show"),g.focus()})});if(typeof window<"u"){const l=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var i;const s=((i=t.reason)==null?void 0:i.message)||String(t.reason||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var i;const s=t.message||String(((i=t.error)==null?void 0:i.message)||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}ke.createRoot(document.getElementById("root")).render(e.jsx(ie.StrictMode,{children:e.jsx(kt,{})}));export{Ie as M,w as a,R as u};
