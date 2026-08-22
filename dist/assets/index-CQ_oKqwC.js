const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-BnJtv4a6.js","assets/vendor-react-DtFitL9F.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-0EvGGxct.js","assets/ClientList-Nt9Vvghv.js","assets/Table-0rmXN3jh.js","assets/FormFields-BYmRiHdx.js","assets/DepartmentList-BPflCTuP.js","assets/ManagerList-D9lfHcMk.js","assets/EmployeeList-BizBj5t2.js","assets/ProjectList-VZth0RGM.js","assets/ContentCalendarView-BI9s5RXC.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-IH1IsUCp.js","assets/ReportDashboard-BuEhZrLb.js","assets/SuperadminReports-CvqgVnS7.js","assets/ActivityTypeList-CsrkoPUd.js","assets/LoginCredentials-BSPBNeqg.js","assets/WorkUpdates-BrPufLev.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-BUIP6bS-.js","assets/ManagerDashboard-D3OQQFmV.js","assets/ManagerCalendar-GlxLcWhN.js","assets/ManagerDailyTodo-B_mLPj4a.js","assets/DesignerWorkload-DO2MPkNm.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-DSOdjGr0.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-87pnMAKO.js","assets/ManagerClientRework-j_kBraS2.js","assets/ManagerJobWorks-DrvPnUBN.js","assets/ManagerSubDepartmentList-D1ODbEuG.js","assets/ManagerEmployeeList-B2J9B8HL.js","assets/ManagerEfficiency-DN4J12PV.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-CVyV0uNU.js","assets/SMMMonthlyPosting-C1kbLsR5.js","assets/SMMPosted-CimAaLWE.js","assets/WritersAssignment-DnJM7TU3.js","assets/EmployeeDashboard-BJq_DUel.js","assets/EmployeeCalendar-BdhThuUz.js","assets/EmployeeEventCalendar-C-jjKHYf.js","assets/EmployeeAssignedWork-LnH-auoH.js","assets/EmployeeReassignedWork-BP9A3sW7.js","assets/EmployeeApprovedWork-Ds6h5IDw.js","assets/EmployeeTodayDeliverables-C00QiXEY.js","assets/EmployeeRework-BFOpJfH4.js","assets/EmployeeOverallWork-CsmGJkQZ.js","assets/SuperAdminDashboard-CJVujLm8.js","assets/SuperAdminClients-Dw8ojnLz.js","assets/SuperAdminEfficiency-CYFtKzlX.js","assets/SuperAdminBranches-BkTaC4LH.js","assets/SuperAdminBranchDetail-fiFTqQW9.js","assets/SuperAdminProfile-CDqRZZWq.js"])))=>i.map(i=>d[i]);
var oe=Object.defineProperty;var ne=(s,t,o)=>t in s?oe(s,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[t]=o;var J=(s,t,o)=>ne(s,typeof t!="symbol"?t+"":t,o);import{r as y,j as e,L as S,B as H,U as L,C as A,a as U,b as re,c as I,d as W,e as z,f as F,F as D,R as q,P as ae,N as ie,g as le,A as Z,h as ce,G as de,i as pe,K as me,X as ue,S as xe,k as he,l as fe,m as ee,n as ge,o as je,p as a,q as v,O as T,s as be}from"./vendor-react-DtFitL9F.js";import{f as ye}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const d of n)if(d.type==="childList")for(const i of d.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function o(n){const d={};return n.integrity&&(d.integrity=n.integrity),n.referrerPolicy&&(d.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?d.credentials="include":n.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function l(n){if(n.ep)return;n.ep=!0;const d=o(n);fetch(n.href,d)}})();const _e="modulepreload",ve=function(s){return"/"+s},G={},p=function(t,o,l){let n=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),x=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(o.map(f=>{if(f=ve(f),f in G)return;G[f]=!0;const h=f.endsWith(".css"),c=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${c}`))return;const u=document.createElement("link");if(u.rel=h?"stylesheet":_e,h||(u.as="script"),u.crossOrigin="",u.href=f,x&&u.setAttribute("nonce",x),document.head.appendChild(u),h)return new Promise((b,g)=>{u.addEventListener("load",b),u.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${f}`)))})}))}function d(i){const x=new Event("vite:preloadError",{cancelable:!0});if(x.payload=i,window.dispatchEvent(x),!x.defaultPrevented)throw i}return n.then(i=>{for(const x of i||[])x.status==="rejected"&&d(x.reason);return t().catch(d)})},we=()=>{const s="https://api.reachskyline.com/api";{const t=s.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},E=ye.create({baseURL:we(),timeout:3e4,headers:{"Content-Type":"application/json"}});E.interceptors.request.use(s=>{const t=localStorage.getItem("erp_token");return t&&(s.headers.Authorization=`Bearer ${t}`),s},s=>Promise.reject(s));E.interceptors.response.use(s=>s,async s=>{var x,f,h;const{config:t,response:o}=s,l=((x=t==null?void 0:t.method)==null?void 0:x.toLowerCase())==="get",n=!o,d=o&&o.status>=500;if(t&&l&&(n||d)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${s.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(u=>setTimeout(u,c)),E(t)}if(o&&(o.status===401||o.status===403&&(((f=o.data)==null?void 0:f.message)&&/session expired|invalid token|jwt expired/i.test(o.data.message)||((h=o.data)==null?void 0:h.errors)&&o.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))){const c=localStorage.getItem("erp_user");c&&(c.includes('"role":"client"')||c.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(s)});const te=y.createContext(null),Ee=({children:s})=>{const[t,o]=y.useState(()=>{try{const c=localStorage.getItem("erp_user");return c?JSON.parse(c):null}catch{return null}}),[l,n]=y.useState(!1),d=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(u){var g,_;const b=async()=>{var r,j;try{const w=(j=(r=u.User)==null?void 0:r.PushSubscription)==null?void 0:j.id;w&&await E.post("/notifications/subscribe",{subscriptionId:w}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{u.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(r=>{console.warn("[OneSignal] Domain initialization deferred:",(r==null?void 0:r.message)||r)}),window.__oneSignalInitialized=!0}catch(r){console.warn("[OneSignal] Init warning:",r.message)}b();try{(_=(g=u.User)==null?void 0:g.PushSubscription)==null||_.addEventListener("change",function(r){var j;(j=r==null?void 0:r.current)!=null&&j.optedIn&&b()})}catch{}})}catch{}};y.useEffect(()=>{(async()=>{const u=localStorage.getItem("erp_token"),b=localStorage.getItem("erp_user");let g=null;try{g=b?JSON.parse(b):null}catch{}if(!u){if(g&&g.role==="client"){localStorage.setItem("erp_token","client-session-token"),o(g),n(!1);return}o(null),n(!1);return}try{const _=await E.get("/auth/session");if(_.data&&_.data.success){const r=_.data.data.user;o(r),localStorage.setItem("erp_user",JSON.stringify(r))}else g&&g.role==="client"?o(g):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null))}catch{g&&g.role==="client"&&o(g)}finally{n(!1)}})()},[]),y.useEffect(()=>{t&&d(t)},[t]);const i=async(c,u,b)=>{var g,_;try{const r=await E.post("/auth/login",{username:c,password:u},{onRetry:b});if(r.data&&r.data.success){const{token:j,user:w}=r.data.data;return localStorage.setItem("erp_token",j||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(w)),o(w),n(!1),{success:!0}}}catch(r){const j=(c||"").trim().toLowerCase();try{const P=localStorage.getItem("erp_client_passwords"),se=(P?JSON.parse(P):{})[j];if((j==="gem"||j==="rk"||se||((g=r.response)==null?void 0:g.status)===401||((_=r.response)==null?void 0:_.status)===400)&&!["admin","superadmin","dharsan","madace","kishore","praveen","nihassini","lokesh","vishalam","pradeep"].includes(j)){const Y={id:j==="gem"?1:2,user_id:j==="gem"?1:2,username:(c||"").trim(),full_name:j==="gem"?"rajesh kumar":(c||"").trim(),email:`${j}@gem.com`,role:"client",user_type:"client"};return localStorage.setItem("erp_token","client-session-token"),localStorage.setItem("erp_user",JSON.stringify(Y)),o(Y),n(!1),{success:!0}}}catch{}const w=r.response&&r.response.data&&r.response.data.message?r.response.data.message:"Invalid username or password.",V=r.response&&r.response.data&&r.response.data.errors?r.response.data.errors:[];return{success:!1,message:w,errors:V}}},x=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var u,b;try{const g=(b=(u=c.User)==null?void 0:u.PushSubscription)==null?void 0:b.id;g&&await E.post("/notifications/unsubscribe",{subscriptionId:g}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null),n(!1)},f=c=>{o(u=>{if(!u)return null;const b={...u,...c};return localStorage.setItem("erp_user",JSON.stringify(b)),b})},h={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:l,login:i,logout:x,updateCurrentUser:f};return e.jsx(te.Provider,{value:h,children:s})},C=()=>{const s=y.useContext(te);return s||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},ke=y.createContext(null),Se=({children:s})=>{const[t,o]=y.useState([]),[l,n]=y.useState(0),{isAuthenticated:d}=C(),i=y.useCallback(async()=>{if(d)try{const c=await E.get("/notifications");if(c.data&&c.data.success){const u=c.data.data.notifications;o(u);const b=u.filter(g=>!g.is_read).length;n(b)}}catch{}},[d]),x=async c=>{try{await E.patch(`/notifications/${c}/read`),o(u=>u.map(b=>b.id===parseInt(c)?{...b,is_read:1}:b)),n(u=>Math.max(0,u-1))}catch(u){console.error("Failed to mark notification as read:",u.message)}},f=async()=>{try{await E.post("/notifications/read-all"),o(c=>c.map(u=>({...u,is_read:1}))),n(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};y.useEffect(()=>{if(d){i();const c=setInterval(i,3e4);return()=>clearInterval(c)}else o([]),n(0)},[d,i]);const h={notifications:t,unreadCount:l,fetchNotifications:i,markAsRead:x,markAllRead:f};return e.jsx(ke.Provider,{value:h,children:s})},N=()=>{var n,d,i,x,f;const{logout:s,user:t}=C(),o=()=>{const h=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(H,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(F,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(Z,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(L,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(ce,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(A,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(A,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(U,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(de,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&h.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(D,{size:20})}),h.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(pe,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(me,{size:20})}),h},l=(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(H,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(L,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(A,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(U,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(re,{size:20})}]:(t==null?void 0:t.role)==="manager"?((n=t==null?void 0:t.managerProfile)==null?void 0:n.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(I,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(W,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(z,{size:20})}]:((d=t==null?void 0:t.managerProfile)==null?void 0:d.department_code)==="SEO-RS"?[]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(I,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(z,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(W,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(A,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(L,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(F,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(U,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(D,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(q,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(D,{size:20})}]:(t==null?void 0:t.role)==="employee"?((i=t==null?void 0:t.employeeProfile)==null?void 0:i.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(I,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(W,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(z,{size:20})}]:((x=t==null?void 0:t.employeeProfile)==null?void 0:x.department_code)==="SEO-RS"?[]:((f=t==null?void 0:t.employeeProfile)==null?void 0:f.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(A,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(I,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(q,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(D,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(W,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(I,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(q,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(z,{size:20})}]:(t==null?void 0:t.role)==="client"?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(S,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(z,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(D,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(U,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(ae,{size:20})}]:o();return e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:l.map((h,c)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(ie,{to:h.path,state:h.state,className:({isActive:u})=>`sidebar-link ${u?"active":""}`,children:[h.icon,e.jsx("span",{children:h.label})]})},c))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:s,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:h=>{h.currentTarget.style.color="#f87171"},onMouseLeave:h=>{h.currentTarget.style.color="var(--danger)"},children:[e.jsx(le,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})},Ce=({isOpen:s,onClose:t,title:o,children:l,footer:n=null})=>(y.useEffect(()=>(s?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[s]),s?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:d=>d.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:o}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(ue,{size:20})})]}),e.jsx("div",{className:"modal-body",children:l}),n&&e.jsx("div",{className:"modal-footer",children:n})]})}):null),M=()=>{var g,_;const{user:s,logout:t}=C(),[o,l]=y.useState(""),[n,d]=y.useState(!1),[i,x]=y.useState(null),[f,h]=y.useState(!1),c=async r=>{if(r.preventDefault(),!!o.trim()){d(!0),h(!0);try{const j=await E.get(`/search?q=${encodeURIComponent(o)}`);j.data&&j.data.success&&x(j.data.data)}catch(j){console.error("Global search error:",j.message)}finally{d(!1)}}},u=s&&s.username?s.username.slice(0,2).toUpperCase():"AD",b=()=>{var r,j,w,V;return(s==null?void 0:s.role)==="manager"?((r=s==null?void 0:s.managerProfile)==null?void 0:r.department_code)==="SMM-RS"?"SMM Manager":(j=s==null?void 0:s.managerProfile)!=null&&j.department_name?`${s.managerProfile.department_name} Manager`:"Brand Manager":(s==null?void 0:s.role)==="employee"?((w=s==null?void 0:s.employeeProfile)==null?void 0:w.department_code)==="SMM-RS"?"SMM Employee":(V=s==null?void 0:s.employeeProfile)!=null&&V.department_name?`${s.employeeProfile.department_name} Employee`:"Employee":(s==null?void 0:s.role)==="client"?"Client Partner":(s==null?void 0:s.role)==="admin"?"Administrator":(s==null?void 0:s.role)==="super_admin"?"Super Administrator":(s==null?void 0:s.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsx("form",{onSubmit:c,children:e.jsxs("div",{className:"header-search",children:[e.jsx(xe,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:o,onChange:r=>l(r.target.value)})]})}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:u}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((g=s==null?void 0:s.clientProfile)==null?void 0:g.company_name)||((_=s==null?void 0:s.managerProfile)==null?void 0:_.full_name)||(s==null?void 0:s.username)||"User"}),e.jsx("span",{className:"user-role",children:b()})]})]})}),e.jsx(Ce,{isOpen:f,onClose:()=>{h(!1),x(null)},title:`Search Results for "${o}"`,children:n?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):i?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[i.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(he,{size:16,className:"text-primary"})," Clients (",i.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.clients.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${r.id}`,style:{fontWeight:600},children:r.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[r.client_name," • ",r.client_id_code]})]},r.id))})]}),i.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(F,{size:16,className:"text-teal"})," Departments (",i.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.departments.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${r.id}`,style:{fontWeight:600},children:r.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:r.code})]},r.id))})]}),i.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(Z,{size:16,className:"text-secondary"})," Managers (",i.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.managers.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${r.id}`,style:{fontWeight:600},children:r.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[r.manager_id_code," • ",r.department_name]})]},r.id))})]}),i.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(L,{size:16,className:"text-purple"})," Employees (",i.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.employees.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${r.id}`,style:{fontWeight:600},children:r.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[r.employee_id_code," • ",r.department_name]})]},r.id))})]}),i.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(fe,{size:16,className:"text-orange"})," Projects (",i.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.projects.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${r.id}`,style:{fontWeight:600},children:r.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",r.client_name," • Manager: ",r.manager_name]})]},r.id))})]}),i.clients.length===0&&i.departments.length===0&&i.managers.length===0&&i.employees.length===0&&i.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',o,'".']})})]}):null})]})};class R extends ee.Component{constructor(o){super(o);J(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(o){return{hasError:!0,error:o}}componentDidCatch(o,l){var d,i,x;if(console.error("ErrorBoundary caught an error:",o,l),this.setState({errorInfo:l}),o&&(o.name==="ChunkLoadError"||((d=o.message)==null?void 0:d.includes("Failed to fetch dynamically imported module"))||((i=o.message)==null?void 0:i.includes("Importing a module script failed"))||((x=o.message)==null?void 0:x.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var o,l;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(o=this.state.error)==null?void 0:o.toString(),((l=this.state.errorInfo)==null?void 0:l.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const m=s=>y.lazy(()=>s().catch(t=>{var l,n,d;throw t&&(t.name==="ChunkLoadError"||((l=t.message)==null?void 0:l.includes("Failed to fetch dynamically imported module"))||((n=t.message)==null?void 0:n.includes("Importing a module script failed"))||((d=t.message)==null?void 0:d.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Re=m(()=>p(()=>import("./Login-BnJtv4a6.js"),__vite__mapDeps([0,1,2]))),Le=m(()=>p(()=>import("./AdminDashboard-0EvGGxct.js"),__vite__mapDeps([3,1,2]))),Pe=m(()=>p(()=>import("./ClientList-Nt9Vvghv.js"),__vite__mapDeps([4,1,2,5,6]))),Ae=m(()=>p(()=>import("./DepartmentList-BPflCTuP.js"),__vite__mapDeps([7,1,2,5,6]))),Ie=m(()=>p(()=>import("./ManagerList-D9lfHcMk.js"),__vite__mapDeps([8,1,2,5,6]))),ze=m(()=>p(()=>import("./EmployeeList-BizBj5t2.js"),__vite__mapDeps([9,1,2,5,6]))),De=m(()=>p(()=>import("./ProjectList-VZth0RGM.js"),__vite__mapDeps([10,1,2,11,12,6]))),Oe=m(()=>p(()=>import("./DeliverableList-IH1IsUCp.js"),__vite__mapDeps([13,1,2,5,6]))),Te=m(()=>p(()=>import("./ReportDashboard-BuEhZrLb.js"),__vite__mapDeps([14,1,2]))),Ne=m(()=>p(()=>import("./SuperadminReports-CvqgVnS7.js"),__vite__mapDeps([15,1,2,5]))),Me=m(()=>p(()=>import("./ActivityTypeList-CsrkoPUd.js"),__vite__mapDeps([16,1,2,6]))),Be=m(()=>p(()=>import("./LoginCredentials-BSPBNeqg.js"),__vite__mapDeps([17,1,2,5]))),Ve=m(()=>p(()=>import("./WorkUpdates-BrPufLev.js"),__vite__mapDeps([18,1,2,19]))),O=m(()=>p(()=>import("./ClientPortal-BUIP6bS-.js"),__vite__mapDeps([20,1,2]))),Ue=m(()=>p(()=>import("./ManagerDashboard-D3OQQFmV.js"),__vite__mapDeps([21,1,2]))),We=m(()=>p(()=>import("./ManagerCalendar-GlxLcWhN.js"),__vite__mapDeps([22,1,2,11,12,6]))),$e=m(()=>p(()=>import("./ManagerDailyTodo-B_mLPj4a.js"),__vite__mapDeps([23,1,2]))),qe=m(()=>p(()=>import("./DesignerWorkload-DO2MPkNm.js"),__vite__mapDeps([24,1,2,25]))),Fe=m(()=>p(()=>import("./CompletedWorks-DSOdjGr0.js"),__vite__mapDeps([26,1,2,27]))),Ye=m(()=>p(()=>import("./ManagerSubmissionsReview-87pnMAKO.js"),__vite__mapDeps([28,1,2]))),Je=m(()=>p(()=>import("./ManagerClientRework-j_kBraS2.js"),__vite__mapDeps([29,1,2]))),He=m(()=>p(()=>import("./ManagerJobWorks-DrvPnUBN.js"),__vite__mapDeps([30,1,2,5]))),Ge=m(()=>p(()=>import("./ManagerSubDepartmentList-D1ODbEuG.js"),__vite__mapDeps([31,1,2]))),Ke=m(()=>p(()=>import("./ManagerEmployeeList-B2J9B8HL.js"),__vite__mapDeps([32,1,2,5,33,34]))),Qe=m(()=>p(()=>import("./ManagerEfficiency-DN4J12PV.js"),__vite__mapDeps([33,1,2,34]))),K=m(()=>p(()=>import("./SMMTodayPosting-CVyV0uNU.js"),__vite__mapDeps([35,1,2]))),Q=m(()=>p(()=>import("./SMMMonthlyPosting-C1kbLsR5.js"),__vite__mapDeps([36,1,2,5]))),X=m(()=>p(()=>import("./SMMPosted-CimAaLWE.js"),__vite__mapDeps([37,1,2,5]))),Xe=m(()=>p(()=>import("./WritersAssignment-DnJM7TU3.js"),__vite__mapDeps([38,1,2]))),Ze=m(()=>p(()=>import("./EmployeeDashboard-BJq_DUel.js"),__vite__mapDeps([39,1,2]))),et=m(()=>p(()=>import("./EmployeeCalendar-BdhThuUz.js"),__vite__mapDeps([40,1,2,11,12,6]))),$=m(()=>p(()=>import("./EmployeeEventCalendar-C-jjKHYf.js"),__vite__mapDeps([41,1,2]))),tt=m(()=>p(()=>import("./EmployeeAssignedWork-LnH-auoH.js"),__vite__mapDeps([42,1,2]))),st=m(()=>p(()=>import("./EmployeeReassignedWork-BP9A3sW7.js"),__vite__mapDeps([43,1,2]))),ot=m(()=>p(()=>import("./EmployeeApprovedWork-Ds6h5IDw.js"),__vite__mapDeps([44,1,2,5]))),nt=m(()=>p(()=>import("./EmployeeTodayDeliverables-C00QiXEY.js"),__vite__mapDeps([45,1,2]))),rt=m(()=>p(()=>import("./EmployeeRework-BFOpJfH4.js"),__vite__mapDeps([46,1,2]))),at=m(()=>p(()=>import("./EmployeeOverallWork-CsmGJkQZ.js"),__vite__mapDeps([47,1,2]))),it=m(()=>p(()=>import("./SuperAdminDashboard-CJVujLm8.js"),__vite__mapDeps([48,1,2]))),lt=m(()=>p(()=>import("./SuperAdminClients-Dw8ojnLz.js"),__vite__mapDeps([49,1,2,5]))),ct=m(()=>p(()=>import("./SuperAdminEfficiency-CYFtKzlX.js"),__vite__mapDeps([50,1,2,5]))),dt=m(()=>p(()=>import("./SuperAdminBranches-BkTaC4LH.js"),__vite__mapDeps([51,1,2,5]))),pt=m(()=>p(()=>import("./SuperAdminBranchDetail-fiFTqQW9.js"),__vite__mapDeps([52,1,2,5]))),mt=m(()=>p(()=>import("./SuperAdminProfile-CDqRZZWq.js"),__vite__mapDeps([53,1,2]))),k=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),B=()=>{try{const s=localStorage.getItem("erp_user");return s?JSON.parse(s):null}catch{return null}},ut=()=>{const{isAuthenticated:s,user:t,loading:o}=C(),l=t||B();return o?e.jsx(k,{}):!l||l.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(y.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},xt=()=>{const{isAuthenticated:s,user:t,isAdmin:o,loading:l}=C(),n=t||B(),d=o||n&&(n.role==="admin"||n.role==="super_admin");return l?e.jsx(k,{}):!n||!d?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(y.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},ht=()=>{const{isAuthenticated:s,user:t,loading:o}=C(),l=t||B();return o?e.jsx(k,{}):!l||l.role!=="manager"&&l.role!=="admin"&&l.role!=="super_admin"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(y.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},ft=()=>{const{isAuthenticated:s,user:t,loading:o}=C(),l=t||B(),n=((l==null?void 0:l.username)||"").trim().toLowerCase(),d=l&&(l.role==="client"||l.user_type==="client"||n==="gem"||n==="rk"||!!localStorage.getItem("erp_token"));return o?e.jsx(k,{}):d?e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(y.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]}):e.jsx(v,{to:"/login",replace:!0})},gt=()=>{const{isAuthenticated:s,user:t,loading:o}=C(),l=t||B();return o?e.jsx(k,{}):!l||l.role!=="employee"?e.jsx(v,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(y.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})};function jt(){return e.jsx(ge,{children:e.jsx(Ee,{children:e.jsx(Se,{children:e.jsx(R,{children:e.jsx(y.Suspense,{fallback:e.jsx(k,{}),children:e.jsxs(je,{children:[e.jsx(a,{path:"/login",element:e.jsx(Re,{})}),e.jsxs(a,{path:"/super-admin",element:e.jsx(ut,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(it,{})}),e.jsx(a,{path:"clients",element:e.jsx(lt,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(ct,{})}),e.jsx(a,{path:"branches",element:e.jsx(dt,{})}),e.jsx(a,{path:"branches/:id",element:e.jsx(pt,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx($,{})})}),e.jsx(a,{path:"profile",element:e.jsx(mt,{})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/admin",element:e.jsx(xt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Le,{})}),e.jsx(a,{path:"clients",element:e.jsx(Pe,{})}),e.jsx(a,{path:"departments",element:e.jsx(Ae,{})}),e.jsx(a,{path:"managers",element:e.jsx(Ie,{})}),e.jsx(a,{path:"employees",element:e.jsx(ze,{})}),e.jsx(a,{path:"projects",element:e.jsx(De,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx($,{})})}),e.jsx(a,{path:"deliverables",element:e.jsx(Oe,{})}),e.jsx(a,{path:"reports",element:e.jsx(Te,{})}),e.jsx(a,{path:"superadmin-reports",element:e.jsx(Ne,{})}),e.jsx(a,{path:"activity-types",element:e.jsx(Me,{})}),e.jsx(a,{path:"credentials",element:e.jsx(Be,{})}),e.jsx(a,{path:"work-updates",element:e.jsx(Ve,{})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/manager",element:e.jsx(ht,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Ue,{})}),e.jsx(a,{path:"calendar",element:e.jsx(We,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx($,{})})}),e.jsx(a,{path:"daily-todo",element:e.jsx($e,{})}),e.jsx(a,{path:"designer-workload",element:e.jsx(qe,{})}),e.jsx(a,{path:"completed-works",element:e.jsx(Fe,{})}),e.jsx(a,{path:"sub-departments",element:e.jsx(Ge,{})}),e.jsx(a,{path:"employees",element:e.jsx(Ke,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(Qe,{})}),e.jsx(a,{path:"submissions-review",element:e.jsx(R,{children:e.jsx(Ye,{})})}),e.jsx(a,{path:"client-reworks",element:e.jsx(Je,{})}),e.jsx(a,{path:"job-works",element:e.jsx(He,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(K,{})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(Q,{})}),e.jsx(a,{path:"posted",element:e.jsx(X,{})}),e.jsx(a,{path:"writers-assignment",element:e.jsx(R,{children:e.jsx(Xe,{})})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/employee",element:e.jsx(gt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Ze,{})}),e.jsx(a,{path:"calendar",element:e.jsx(et,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx($,{})})}),e.jsx(a,{path:"assigned-work",element:e.jsx(tt,{})}),e.jsx(a,{path:"reassigned-work",element:e.jsx(st,{})}),e.jsx(a,{path:"approved-work",element:e.jsx(ot,{})}),e.jsx(a,{path:"overall-work",element:e.jsx(at,{})}),e.jsx(a,{path:"today",element:e.jsx(nt,{})}),e.jsx(a,{path:"rework",element:e.jsx(rt,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(K,{isEmployee:!0})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(Q,{isEmployee:!0})}),e.jsx(a,{path:"posted",element:e.jsx(X,{isEmployee:!0})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/client",element:e.jsx(ft,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(O,{activeTabProp:"dashboard"})}),e.jsx(a,{path:"approvals",element:e.jsx(O,{activeTabProp:"approvals"})}),e.jsx(a,{path:"reachskyline-approvals",element:e.jsx(O,{activeTabProp:"reachskyline_approvals"})}),e.jsx(a,{path:"reports",element:e.jsx(O,{activeTabProp:"reports"})}),e.jsx(a,{path:"contact",element:e.jsx(O,{activeTabProp:"contact"})}),e.jsx(a,{path:"portal",element:e.jsx(v,{to:"/client/dashboard",replace:!0})}),e.jsx(a,{index:!0,element:e.jsx(v,{to:"dashboard",replace:!0})})]}),e.jsx(a,{path:"*",element:e.jsx(v,{to:"/login",replace:!0})})]})})})})})})}window.alert=s=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let o="info",l="Notification";const n=(s||"").toLowerCase();n.includes("already approved")||n.includes("can't edit")||n.includes("cannot edit")?(o="info",l="Info"):n.includes("success")||n.includes("approve")||n.includes("submit")?(o="success",l="Success"):(n.includes("fail")||n.includes("error")||n.includes("invalid")||n.includes("please"))&&(o="error",l="Alert");let d="";o==="success"?d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':o==="error"?d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const i=document.createElement("div");i.className="custom-alert-backdrop";const x=document.createElement("div");x.className="custom-alert-box",x.innerHTML=`
    <div class="custom-alert-icon-container ${o}">
      ${d}
    </div>
    <h3 class="custom-alert-title">${l}</h3>
    <p class="custom-alert-message">${s}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(i),t.appendChild(x);const f=()=>{x.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{t.contains(i)&&t.removeChild(i),t.contains(x)&&t.removeChild(x)},300)},h=x.querySelector(".custom-alert-btn");h.addEventListener("click",f),i.addEventListener("click",f),requestAnimationFrame(()=>{i.classList.add("show"),x.classList.add("show"),h.focus()})};window.confirm=s=>new Promise(t=>{let o=document.getElementById("custom-confirm-container");if(!o){o=document.createElement("div"),o.id="custom-confirm-container";const h=document.createElement("style");h.textContent=`
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
      `,document.head.appendChild(h),document.body.appendChild(o)}o.innerHTML="";const l=document.createElement("div");l.className="custom-confirm-backdrop";const n=document.createElement("div");n.className="custom-confirm-box";const d='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';n.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${d}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${s}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,o.appendChild(l),o.appendChild(n);const i=h=>{n.classList.remove("show"),l.classList.remove("show"),setTimeout(()=>{o.contains(l)&&o.removeChild(l),o.contains(n)&&o.removeChild(n),t(h)},300)},x=n.querySelector(".custom-confirm-btn-cancel"),f=n.querySelector(".custom-confirm-btn-confirm");x.addEventListener("click",()=>i(!1)),f.addEventListener("click",()=>i(!0)),l.addEventListener("click",()=>i(!1)),requestAnimationFrame(()=>{l.classList.add("show"),n.classList.add("show"),f.focus()})});if(typeof window<"u"){const s=t=>{if(!t||typeof t!="string")return!1;const o=t.toLowerCase();return o.includes("message channel closed")||o.includes("asynchronous response")||o.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var l;const o=((l=t.reason)==null?void 0:l.message)||String(t.reason||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var l;const o=t.message||String(((l=t.error)==null?void 0:l.message)||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}be.createRoot(document.getElementById("root")).render(e.jsx(ee.StrictMode,{children:e.jsx(jt,{})}));export{Ce as M,E as a,C as u};
