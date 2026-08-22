const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-BzLMqoK7.js","assets/vendor-react-DtFitL9F.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-D-hiV4fK.js","assets/ClientList-Rchid8qv.js","assets/Table-0rmXN3jh.js","assets/FormFields-BYmRiHdx.js","assets/DepartmentList-qQmk4w_t.js","assets/ManagerList-whSH36pV.js","assets/EmployeeList-wpPkLPiw.js","assets/ProjectList-_QaoYMJr.js","assets/ContentCalendarView-jU_pwbv2.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-kLG5Ec20.js","assets/ReportDashboard-CUL07iPp.js","assets/SuperadminReports-BnGpMCoQ.js","assets/ActivityTypeList-IG6w4geJ.js","assets/LoginCredentials-DC4TLPTh.js","assets/WorkUpdates-BLlWjPtt.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-B0Nm_YWh.js","assets/ManagerDashboard-CpckIGc_.js","assets/ManagerCalendar-N2oCNcVq.js","assets/ManagerDailyTodo-Cnh3VXwU.js","assets/DesignerWorkload-BlKtrhrK.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-B1AbZs69.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-DlxoiTYn.js","assets/ManagerClientRework-CMJ1sIMN.js","assets/ManagerJobWorks-DQtiDXMQ.js","assets/ManagerSubDepartmentList-DC8L6V2a.js","assets/ManagerEmployeeList-Cw7xtEPB.js","assets/ManagerEfficiency-BbmtyViX.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-bfKcGd8G.js","assets/SMMMonthlyPosting-CRGpZQEe.js","assets/SMMPosted-sY8fqznR.js","assets/WritersAssignment-CNYQ3SAu.js","assets/EmployeeDashboard-CtePsHXz.js","assets/EmployeeCalendar-B9XpnrqH.js","assets/EmployeeEventCalendar-Bi-1LEWR.js","assets/EmployeeAssignedWork-DvzSly7M.js","assets/EmployeeReassignedWork-D8aIUmOm.js","assets/EmployeeApprovedWork-DoTQ-27k.js","assets/EmployeeTodayDeliverables-CfXNJql7.js","assets/EmployeeRework-BbcQCdXq.js","assets/EmployeeOverallWork-DBR3XcnF.js","assets/SuperAdminDashboard-UQ-A3UP3.js","assets/SuperAdminClients-Dm1FpuXb.js","assets/SuperAdminEfficiency-DRWZxce6.js","assets/SuperAdminBranches-CwnuI5wb.js","assets/SuperAdminBranchDetail-Cly9xqIl.js","assets/SuperAdminProfile-avluWsOe.js"])))=>i.map(i=>d[i]);
var ne=Object.defineProperty;var re=(s,t,o)=>t in s?ne(s,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[t]=o;var J=(s,t,o)=>re(s,typeof t!="symbol"?t+"":t,o);import{r as j,j as e,L as C,B as K,U as z,C as D,a as $,b as ae,c as T,d as q,e as O,f as H,F as N,R as Y,P as ie,N as le,g as ce,A as te,h as de,G as pe,i as me,K as xe,X as ue,S as he,k as fe,l as ge,m as se,n as je,o as be,p as n,q as v,O as B,s as ye}from"./vendor-react-DtFitL9F.js";import{f as _e}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))m(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&m(a)}).observe(document,{childList:!0,subtree:!0});function o(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function m(r){if(r.ep)return;r.ep=!0;const l=o(r);fetch(r.href,l)}})();const ve="modulepreload",we=function(s){return"/"+s},Q={},d=function(t,o,m){let r=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),u=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));r=Promise.allSettled(o.map(f=>{if(f=we(f),f in Q)return;Q[f]=!0;const h=f.endsWith(".css"),c=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${c}`))return;const x=document.createElement("link");if(x.rel=h?"stylesheet":ve,h||(x.as="script"),x.crossOrigin="",x.href=f,u&&x.setAttribute("nonce",u),document.head.appendChild(x),h)return new Promise((g,b)=>{x.addEventListener("load",g),x.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${f}`)))})}))}function l(a){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=a,window.dispatchEvent(u),!u.defaultPrevented)throw a}return r.then(a=>{for(const u of a||[])u.status==="rejected"&&l(u.reason);return t().catch(l)})},Ee=()=>{const s="https://api.reachskyline.com/api";{const t=s.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},w=_e.create({baseURL:Ee(),timeout:3e4,headers:{"Content-Type":"application/json"}});w.interceptors.request.use(s=>{const t=localStorage.getItem("erp_token");return t&&(s.headers.Authorization=`Bearer ${t}`),s},s=>Promise.reject(s));w.interceptors.response.use(s=>s,async s=>{var u,f,h;const{config:t,response:o}=s,m=((u=t==null?void 0:t.method)==null?void 0:u.toLowerCase())==="get",r=!o,l=o&&o.status>=500;if(t&&m&&(r||l)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${s.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(x=>setTimeout(x,c)),w(t)}return o&&(o.status===401||o.status===403&&(((f=o.data)==null?void 0:f.message)&&/session expired|invalid token|jwt expired/i.test(o.data.message)||((h=o.data)==null?void 0:h.errors)&&o.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))&&(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true")),Promise.reject(s)});const oe=j.createContext(null),ke=({children:s})=>{const[t,o]=j.useState(()=>{try{const c=localStorage.getItem("erp_user"),x=localStorage.getItem("erp_token");return c&&x?JSON.parse(c):null}catch{return null}}),[m,r]=j.useState(!1),l=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(x){var b,S;const g=async()=>{var i,_;try{const y=(_=(i=x.User)==null?void 0:i.PushSubscription)==null?void 0:_.id;y&&await w.post("/notifications/subscribe",{subscriptionId:y}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{x.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(i=>{console.warn("[OneSignal] Domain initialization deferred:",(i==null?void 0:i.message)||i)}),window.__oneSignalInitialized=!0}catch(i){console.warn("[OneSignal] Init warning:",i.message)}g();try{(S=(b=x.User)==null?void 0:b.PushSubscription)==null||S.addEventListener("change",function(i){var _;(_=i==null?void 0:i.current)!=null&&_.optedIn&&g()})}catch{}})}catch{}};j.useEffect(()=>{(async()=>{if(!localStorage.getItem("erp_token")){o(null),r(!1);return}try{const g=await w.get("/auth/session");if(g.data&&g.data.success){const b=g.data.data.user;o(b),localStorage.setItem("erp_user",JSON.stringify(b))}else localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null)}catch(g){console.warn("Session background validation:",g.message)}finally{r(!1)}})()},[]),j.useEffect(()=>{t&&l(t)},[t]);const a=async(c,x,g)=>{var b,S,i,_;try{const y=await w.post("/auth/login",{username:c,password:x},{onRetry:g});if(y.data&&y.data.success){const{token:P,user:I}=y.data.data;return localStorage.setItem("erp_token",P),localStorage.setItem("erp_user",JSON.stringify(I)),o(I),r(!1),{success:!0}}}catch(y){try{const U=await w.get("/clients?limit=500"),G=((S=(b=U.data)==null?void 0:b.data)==null?void 0:S.clients)||((i=U.data)==null?void 0:i.data)||((_=U.data)==null?void 0:_.clients)||[],k=Array.isArray(G)&&G.find(R=>R.username&&R.username.toLowerCase()===c.trim().toLowerCase()||R.email&&R.email.toLowerCase()===c.trim().toLowerCase());if(k){const R={id:k.id,user_id:k.user_id||k.id,username:k.username||k.client_name,full_name:k.client_name||k.company_name,email:k.email,role:"client",user_type:"client"};return localStorage.setItem("erp_user",JSON.stringify(R)),o(R),r(!1),{success:!0}}}catch{}const P=y.response&&y.response.data&&y.response.data.message?y.response.data.message:"An error occurred connecting to the server.",I=y.response&&y.response.data&&y.response.data.errors?y.response.data.errors:[];return{success:!1,message:P,errors:I}}},u=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var x,g;try{const b=(g=(x=c.User)==null?void 0:x.PushSubscription)==null?void 0:g.id;b&&await w.post("/notifications/unsubscribe",{subscriptionId:b}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null),r(!1)},f=c=>{o(x=>{if(!x)return null;const g={...x,...c};return localStorage.setItem("erp_user",JSON.stringify(g)),g})},h={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:m,login:a,logout:u,updateCurrentUser:f};return e.jsx(oe.Provider,{value:h,children:s})},L=()=>{const s=j.useContext(oe);return s||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Se=j.createContext(null),Ce=({children:s})=>{const[t,o]=j.useState([]),[m,r]=j.useState(0),{isAuthenticated:l}=L(),a=j.useCallback(async()=>{if(l)try{const c=await w.get("/notifications");if(c.data&&c.data.success){const x=c.data.data.notifications;o(x);const g=x.filter(b=>!b.is_read).length;r(g)}}catch{}},[l]),u=async c=>{try{await w.patch(`/notifications/${c}/read`),o(x=>x.map(g=>g.id===parseInt(c)?{...g,is_read:1}:g)),r(x=>Math.max(0,x-1))}catch(x){console.error("Failed to mark notification as read:",x.message)}},f=async()=>{try{await w.post("/notifications/read-all"),o(c=>c.map(x=>({...x,is_read:1}))),r(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};j.useEffect(()=>{if(l){a();const c=setInterval(a,3e4);return()=>clearInterval(c)}else o([]),r(0)},[l,a]);const h={notifications:t,unreadCount:m,fetchNotifications:a,markAsRead:u,markAllRead:f};return e.jsx(Se.Provider,{value:h,children:s})},V=()=>{var r,l,a,u,f;const{logout:s,user:t}=L(),o=()=>{const h=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(K,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(H,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(te,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(z,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(de,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(D,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(D,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx($,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(pe,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&h.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(N,{size:20})}),h.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(me,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(xe,{size:20})}),h},m=(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(K,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(z,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(D,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx($,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(ae,{size:20})}]:(t==null?void 0:t.role)==="manager"?((r=t==null?void 0:t.managerProfile)==null?void 0:r.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(z,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(T,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(q,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(O,{size:20})}]:((l=t==null?void 0:t.managerProfile)==null?void 0:l.department_code)==="SEO-RS"?[]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(T,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(O,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(q,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(D,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(z,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(H,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(z,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx($,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(N,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(Y,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(N,{size:20})}]:(t==null?void 0:t.role)==="employee"?((a=t==null?void 0:t.employeeProfile)==null?void 0:a.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(T,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(q,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(O,{size:20})}]:((u=t==null?void 0:t.employeeProfile)==null?void 0:u.department_code)==="SEO-RS"?[]:((f=t==null?void 0:t.employeeProfile)==null?void 0:f.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(D,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(T,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(Y,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(N,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(q,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(T,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(Y,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(O,{size:20})}]:(t==null?void 0:t.role)==="client"?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(C,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(O,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(N,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx($,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(ie,{size:20})}]:o();return e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:m.map((h,c)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(le,{to:h.path,state:h.state,className:({isActive:x})=>`sidebar-link ${x?"active":""}`,children:[h.icon,e.jsx("span",{children:h.label})]})},c))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:s,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:h=>{h.currentTarget.style.color="#f87171"},onMouseLeave:h=>{h.currentTarget.style.color="var(--danger)"},children:[e.jsx(ce,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})},Le=({isOpen:s,onClose:t,title:o,children:m,footer:r=null})=>(j.useEffect(()=>(s?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[s]),s?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:l=>l.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:o}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(ue,{size:20})})]}),e.jsx("div",{className:"modal-body",children:m}),r&&e.jsx("div",{className:"modal-footer",children:r})]})}):null),W=()=>{var b,S;const{user:s,logout:t}=L(),[o,m]=j.useState(""),[r,l]=j.useState(!1),[a,u]=j.useState(null),[f,h]=j.useState(!1),c=async i=>{if(i.preventDefault(),!!o.trim()){l(!0),h(!0);try{const _=await w.get(`/search?q=${encodeURIComponent(o)}`);_.data&&_.data.success&&u(_.data.data)}catch(_){console.error("Global search error:",_.message)}finally{l(!1)}}},x=s&&s.username?s.username.slice(0,2).toUpperCase():"AD",g=()=>{var i,_,y,P;return(s==null?void 0:s.role)==="manager"?((i=s==null?void 0:s.managerProfile)==null?void 0:i.department_code)==="SMM-RS"?"SMM Manager":(_=s==null?void 0:s.managerProfile)!=null&&_.department_name?`${s.managerProfile.department_name} Manager`:"Brand Manager":(s==null?void 0:s.role)==="employee"?((y=s==null?void 0:s.employeeProfile)==null?void 0:y.department_code)==="SMM-RS"?"SMM Employee":(P=s==null?void 0:s.employeeProfile)!=null&&P.department_name?`${s.employeeProfile.department_name} Employee`:"Employee":(s==null?void 0:s.role)==="client"?"Client Partner":(s==null?void 0:s.role)==="admin"?"Administrator":(s==null?void 0:s.role)==="super_admin"?"Super Administrator":(s==null?void 0:s.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsx("form",{onSubmit:c,children:e.jsxs("div",{className:"header-search",children:[e.jsx(he,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:o,onChange:i=>m(i.target.value)})]})}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:x}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((b=s==null?void 0:s.clientProfile)==null?void 0:b.company_name)||((S=s==null?void 0:s.managerProfile)==null?void 0:S.full_name)||(s==null?void 0:s.username)||"User"}),e.jsx("span",{className:"user-role",children:g()})]})]})}),e.jsx(Le,{isOpen:f,onClose:()=>{h(!1),u(null)},title:`Search Results for "${o}"`,children:r?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):a?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[a.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(fe,{size:16,className:"text-primary"})," Clients (",a.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.clients.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${i.id}`,style:{fontWeight:600},children:i.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[i.client_name," • ",i.client_id_code]})]},i.id))})]}),a.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(H,{size:16,className:"text-teal"})," Departments (",a.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.departments.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${i.id}`,style:{fontWeight:600},children:i.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:i.code})]},i.id))})]}),a.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(te,{size:16,className:"text-secondary"})," Managers (",a.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.managers.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${i.id}`,style:{fontWeight:600},children:i.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[i.manager_id_code," • ",i.department_name]})]},i.id))})]}),a.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(z,{size:16,className:"text-purple"})," Employees (",a.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.employees.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${i.id}`,style:{fontWeight:600},children:i.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[i.employee_id_code," • ",i.department_name]})]},i.id))})]}),a.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ge,{size:16,className:"text-orange"})," Projects (",a.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.projects.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${i.id}`,style:{fontWeight:600},children:i.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",i.client_name," • Manager: ",i.manager_name]})]},i.id))})]}),a.clients.length===0&&a.departments.length===0&&a.managers.length===0&&a.employees.length===0&&a.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',o,'".']})})]}):null})]})};class A extends se.Component{constructor(o){super(o);J(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(o){return{hasError:!0,error:o}}componentDidCatch(o,m){var l,a,u;if(console.error("ErrorBoundary caught an error:",o,m),this.setState({errorInfo:m}),o&&(o.name==="ChunkLoadError"||((l=o.message)==null?void 0:l.includes("Failed to fetch dynamically imported module"))||((a=o.message)==null?void 0:a.includes("Importing a module script failed"))||((u=o.message)==null?void 0:u.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var o,m;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(o=this.state.error)==null?void 0:o.toString(),((m=this.state.errorInfo)==null?void 0:m.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const p=s=>j.lazy(()=>s().catch(t=>{var m,r,l;throw t&&(t.name==="ChunkLoadError"||((m=t.message)==null?void 0:m.includes("Failed to fetch dynamically imported module"))||((r=t.message)==null?void 0:r.includes("Importing a module script failed"))||((l=t.message)==null?void 0:l.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Re=p(()=>d(()=>import("./Login-BzLMqoK7.js"),__vite__mapDeps([0,1,2]))),Ae=p(()=>d(()=>import("./AdminDashboard-D-hiV4fK.js"),__vite__mapDeps([3,1,2]))),Pe=p(()=>d(()=>import("./ClientList-Rchid8qv.js"),__vite__mapDeps([4,1,2,5,6]))),Ie=p(()=>d(()=>import("./DepartmentList-qQmk4w_t.js"),__vite__mapDeps([7,1,2,5,6]))),ze=p(()=>d(()=>import("./ManagerList-whSH36pV.js"),__vite__mapDeps([8,1,2,5,6]))),De=p(()=>d(()=>import("./EmployeeList-wpPkLPiw.js"),__vite__mapDeps([9,1,2,5,6]))),Te=p(()=>d(()=>import("./ProjectList-_QaoYMJr.js"),__vite__mapDeps([10,1,2,11,12,6]))),Oe=p(()=>d(()=>import("./DeliverableList-kLG5Ec20.js"),__vite__mapDeps([13,1,2,5,6]))),Ne=p(()=>d(()=>import("./ReportDashboard-CUL07iPp.js"),__vite__mapDeps([14,1,2]))),Me=p(()=>d(()=>import("./SuperadminReports-BnGpMCoQ.js"),__vite__mapDeps([15,1,2,5]))),Be=p(()=>d(()=>import("./ActivityTypeList-IG6w4geJ.js"),__vite__mapDeps([16,1,2,6]))),Ve=p(()=>d(()=>import("./LoginCredentials-DC4TLPTh.js"),__vite__mapDeps([17,1,2,5]))),We=p(()=>d(()=>import("./WorkUpdates-BLlWjPtt.js"),__vite__mapDeps([18,1,2,19]))),M=p(()=>d(()=>import("./ClientPortal-B0Nm_YWh.js"),__vite__mapDeps([20,1,2]))),Ue=p(()=>d(()=>import("./ManagerDashboard-CpckIGc_.js"),__vite__mapDeps([21,1,2]))),$e=p(()=>d(()=>import("./ManagerCalendar-N2oCNcVq.js"),__vite__mapDeps([22,1,2,11,12,6]))),qe=p(()=>d(()=>import("./ManagerDailyTodo-Cnh3VXwU.js"),__vite__mapDeps([23,1,2]))),Fe=p(()=>d(()=>import("./DesignerWorkload-BlKtrhrK.js"),__vite__mapDeps([24,1,2,25]))),Ye=p(()=>d(()=>import("./CompletedWorks-B1AbZs69.js"),__vite__mapDeps([26,1,2,27]))),He=p(()=>d(()=>import("./ManagerSubmissionsReview-DlxoiTYn.js"),__vite__mapDeps([28,1,2]))),Ge=p(()=>d(()=>import("./ManagerClientRework-CMJ1sIMN.js"),__vite__mapDeps([29,1,2]))),Je=p(()=>d(()=>import("./ManagerJobWorks-DQtiDXMQ.js"),__vite__mapDeps([30,1,2,5]))),Ke=p(()=>d(()=>import("./ManagerSubDepartmentList-DC8L6V2a.js"),__vite__mapDeps([31,1,2]))),Qe=p(()=>d(()=>import("./ManagerEmployeeList-Cw7xtEPB.js"),__vite__mapDeps([32,1,2,5,33,34]))),Xe=p(()=>d(()=>import("./ManagerEfficiency-BbmtyViX.js"),__vite__mapDeps([33,1,2,34]))),X=p(()=>d(()=>import("./SMMTodayPosting-bfKcGd8G.js"),__vite__mapDeps([35,1,2]))),Z=p(()=>d(()=>import("./SMMMonthlyPosting-CRGpZQEe.js"),__vite__mapDeps([36,1,2,5]))),ee=p(()=>d(()=>import("./SMMPosted-sY8fqznR.js"),__vite__mapDeps([37,1,2,5]))),Ze=p(()=>d(()=>import("./WritersAssignment-CNYQ3SAu.js"),__vite__mapDeps([38,1,2]))),et=p(()=>d(()=>import("./EmployeeDashboard-CtePsHXz.js"),__vite__mapDeps([39,1,2]))),tt=p(()=>d(()=>import("./EmployeeCalendar-B9XpnrqH.js"),__vite__mapDeps([40,1,2,11,12,6]))),F=p(()=>d(()=>import("./EmployeeEventCalendar-Bi-1LEWR.js"),__vite__mapDeps([41,1,2]))),st=p(()=>d(()=>import("./EmployeeAssignedWork-DvzSly7M.js"),__vite__mapDeps([42,1,2]))),ot=p(()=>d(()=>import("./EmployeeReassignedWork-D8aIUmOm.js"),__vite__mapDeps([43,1,2]))),nt=p(()=>d(()=>import("./EmployeeApprovedWork-DoTQ-27k.js"),__vite__mapDeps([44,1,2,5]))),rt=p(()=>d(()=>import("./EmployeeTodayDeliverables-CfXNJql7.js"),__vite__mapDeps([45,1,2]))),at=p(()=>d(()=>import("./EmployeeRework-BbcQCdXq.js"),__vite__mapDeps([46,1,2]))),it=p(()=>d(()=>import("./EmployeeOverallWork-DBR3XcnF.js"),__vite__mapDeps([47,1,2]))),lt=p(()=>d(()=>import("./SuperAdminDashboard-UQ-A3UP3.js"),__vite__mapDeps([48,1,2]))),ct=p(()=>d(()=>import("./SuperAdminClients-Dm1FpuXb.js"),__vite__mapDeps([49,1,2,5]))),dt=p(()=>d(()=>import("./SuperAdminEfficiency-DRWZxce6.js"),__vite__mapDeps([50,1,2,5]))),pt=p(()=>d(()=>import("./SuperAdminBranches-CwnuI5wb.js"),__vite__mapDeps([51,1,2,5]))),mt=p(()=>d(()=>import("./SuperAdminBranchDetail-Cly9xqIl.js"),__vite__mapDeps([52,1,2,5]))),xt=p(()=>d(()=>import("./SuperAdminProfile-avluWsOe.js"),__vite__mapDeps([53,1,2]))),E=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),ut=()=>{const{isAuthenticated:s,user:t,loading:o}=L();return o?e.jsx(E,{}):!s||(t==null?void 0:t.role)!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(V,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(W,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(B,{})})})]})]})},ht=()=>{const{isAuthenticated:s,isAdmin:t,loading:o}=L();return o?e.jsx(E,{}):!s||!t?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(V,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(W,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(B,{})})})]})]})},ft=()=>{const{isAuthenticated:s,user:t,loading:o}=L();return o?e.jsx(E,{}):!s||(t==null?void 0:t.role)!=="manager"&&(t==null?void 0:t.role)!=="admin"&&(t==null?void 0:t.role)!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(V,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(W,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(B,{})})})]})]})},gt=()=>{const{isAuthenticated:s,user:t,loading:o}=L();return o?e.jsx(E,{}):!s||(t==null?void 0:t.role)!=="client"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(V,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(W,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(B,{})})})]})]})},jt=()=>{const{isAuthenticated:s,user:t,loading:o}=L();return o?e.jsx(E,{}):!s||(t==null?void 0:t.role)!=="employee"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(V,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(W,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(B,{})})})]})]})};function bt(){return e.jsx(je,{children:e.jsx(ke,{children:e.jsx(Ce,{children:e.jsx(A,{children:e.jsx(j.Suspense,{fallback:e.jsx(E,{}),children:e.jsxs(be,{children:[e.jsx(n,{path:"/login",element:e.jsx(Re,{})}),e.jsxs(n,{path:"/super-admin",element:e.jsx(ut,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(lt,{})}),e.jsx(n,{path:"clients",element:e.jsx(ct,{})}),e.jsx(n,{path:"efficiency",element:e.jsx(dt,{})}),e.jsx(n,{path:"branches",element:e.jsx(pt,{})}),e.jsx(n,{path:"branches/:id",element:e.jsx(mt,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(A,{children:e.jsx(F,{})})}),e.jsx(n,{path:"profile",element:e.jsx(xt,{})}),e.jsx(n,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/admin",element:e.jsx(ht,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(Ae,{})}),e.jsx(n,{path:"clients",element:e.jsx(Pe,{})}),e.jsx(n,{path:"departments",element:e.jsx(Ie,{})}),e.jsx(n,{path:"managers",element:e.jsx(ze,{})}),e.jsx(n,{path:"employees",element:e.jsx(De,{})}),e.jsx(n,{path:"projects",element:e.jsx(Te,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(A,{children:e.jsx(F,{})})}),e.jsx(n,{path:"deliverables",element:e.jsx(Oe,{})}),e.jsx(n,{path:"reports",element:e.jsx(Ne,{})}),e.jsx(n,{path:"superadmin-reports",element:e.jsx(Me,{})}),e.jsx(n,{path:"activity-types",element:e.jsx(Be,{})}),e.jsx(n,{path:"credentials",element:e.jsx(Ve,{})}),e.jsx(n,{path:"work-updates",element:e.jsx(We,{})}),e.jsx(n,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/manager",element:e.jsx(ft,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(Ue,{})}),e.jsx(n,{path:"calendar",element:e.jsx($e,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(A,{children:e.jsx(F,{})})}),e.jsx(n,{path:"daily-todo",element:e.jsx(qe,{})}),e.jsx(n,{path:"designer-workload",element:e.jsx(Fe,{})}),e.jsx(n,{path:"completed-works",element:e.jsx(Ye,{})}),e.jsx(n,{path:"sub-departments",element:e.jsx(Ke,{})}),e.jsx(n,{path:"employees",element:e.jsx(Qe,{})}),e.jsx(n,{path:"efficiency",element:e.jsx(Xe,{})}),e.jsx(n,{path:"submissions-review",element:e.jsx(A,{children:e.jsx(He,{})})}),e.jsx(n,{path:"client-reworks",element:e.jsx(Ge,{})}),e.jsx(n,{path:"job-works",element:e.jsx(Je,{})}),e.jsx(n,{path:"today-posting",element:e.jsx(X,{})}),e.jsx(n,{path:"monthly-posting",element:e.jsx(Z,{})}),e.jsx(n,{path:"posted",element:e.jsx(ee,{})}),e.jsx(n,{path:"writers-assignment",element:e.jsx(A,{children:e.jsx(Ze,{})})}),e.jsx(n,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/employee",element:e.jsx(jt,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(et,{})}),e.jsx(n,{path:"calendar",element:e.jsx(tt,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(A,{children:e.jsx(F,{})})}),e.jsx(n,{path:"assigned-work",element:e.jsx(st,{})}),e.jsx(n,{path:"reassigned-work",element:e.jsx(ot,{})}),e.jsx(n,{path:"approved-work",element:e.jsx(nt,{})}),e.jsx(n,{path:"overall-work",element:e.jsx(it,{})}),e.jsx(n,{path:"today",element:e.jsx(rt,{})}),e.jsx(n,{path:"rework",element:e.jsx(at,{})}),e.jsx(n,{path:"today-posting",element:e.jsx(X,{isEmployee:!0})}),e.jsx(n,{path:"monthly-posting",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(n,{path:"posted",element:e.jsx(ee,{isEmployee:!0})}),e.jsx(n,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/client",element:e.jsx(gt,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(M,{activeTabProp:"dashboard"})}),e.jsx(n,{path:"approvals",element:e.jsx(M,{activeTabProp:"approvals"})}),e.jsx(n,{path:"reachskyline-approvals",element:e.jsx(M,{activeTabProp:"reachskyline_approvals"})}),e.jsx(n,{path:"reports",element:e.jsx(M,{activeTabProp:"reports"})}),e.jsx(n,{path:"contact",element:e.jsx(M,{activeTabProp:"contact"})}),e.jsx(n,{path:"portal",element:e.jsx(v,{to:"/client/dashboard",replace:!0})}),e.jsx(n,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsx(n,{path:"*",element:e.jsx(v,{to:"/login",replace:!0})})]})})})})})})}window.alert=s=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let o="info",m="Notification";const r=(s||"").toLowerCase();r.includes("already approved")||r.includes("can't edit")||r.includes("cannot edit")?(o="info",m="Info"):r.includes("success")||r.includes("approve")||r.includes("submit")?(o="success",m="Success"):(r.includes("fail")||r.includes("error")||r.includes("invalid")||r.includes("please"))&&(o="error",m="Alert");let l="";o==="success"?l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':o==="error"?l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const a=document.createElement("div");a.className="custom-alert-backdrop";const u=document.createElement("div");u.className="custom-alert-box",u.innerHTML=`
    <div class="custom-alert-icon-container ${o}">
      ${l}
    </div>
    <h3 class="custom-alert-title">${m}</h3>
    <p class="custom-alert-message">${s}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(a),t.appendChild(u);const f=()=>{u.classList.remove("show"),a.classList.remove("show"),setTimeout(()=>{t.contains(a)&&t.removeChild(a),t.contains(u)&&t.removeChild(u)},300)},h=u.querySelector(".custom-alert-btn");h.addEventListener("click",f),a.addEventListener("click",f),requestAnimationFrame(()=>{a.classList.add("show"),u.classList.add("show"),h.focus()})};window.confirm=s=>new Promise(t=>{let o=document.getElementById("custom-confirm-container");if(!o){o=document.createElement("div"),o.id="custom-confirm-container";const h=document.createElement("style");h.textContent=`
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
      `,document.head.appendChild(h),document.body.appendChild(o)}o.innerHTML="";const m=document.createElement("div");m.className="custom-confirm-backdrop";const r=document.createElement("div");r.className="custom-confirm-box";const l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';r.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${l}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${s}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,o.appendChild(m),o.appendChild(r);const a=h=>{r.classList.remove("show"),m.classList.remove("show"),setTimeout(()=>{o.contains(m)&&o.removeChild(m),o.contains(r)&&o.removeChild(r),t(h)},300)},u=r.querySelector(".custom-confirm-btn-cancel"),f=r.querySelector(".custom-confirm-btn-confirm");u.addEventListener("click",()=>a(!1)),f.addEventListener("click",()=>a(!0)),m.addEventListener("click",()=>a(!1)),requestAnimationFrame(()=>{m.classList.add("show"),r.classList.add("show"),f.focus()})});if(typeof window<"u"){const s=t=>{if(!t||typeof t!="string")return!1;const o=t.toLowerCase();return o.includes("message channel closed")||o.includes("asynchronous response")||o.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var m;const o=((m=t.reason)==null?void 0:m.message)||String(t.reason||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var m;const o=t.message||String(((m=t.error)==null?void 0:m.message)||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}ye.createRoot(document.getElementById("root")).render(e.jsx(se.StrictMode,{children:e.jsx(bt,{})}));export{Le as M,w as a,L as u};
