const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-DTU_ihwp.js","assets/vendor-react-oiAd07sW.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-B_pf0qFD.js","assets/ClientList-BSD-Nq0Y.js","assets/Table-BeQ_RQ-C.js","assets/FormFields-BaO9rikp.js","assets/DepartmentList-aajkJPbw.js","assets/ManagerList-CNE62KqE.js","assets/EmployeeList-BEglYNVF.js","assets/ProjectList-D7bPswmn.js","assets/ContentCalendarView-ChJBmBKM.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-C_-eIMkn.js","assets/ReportDashboard-CV9OlAIr.js","assets/SuperadminReports-NX_Dh2jW.js","assets/ActivityTypeList-BAETW5g5.js","assets/LoginCredentials-BsnVlkKF.js","assets/WorkUpdates-Db0xHX-9.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-CMiwLB88.js","assets/ManagerDashboard-VZ2Se-EA.js","assets/ManagerCalendar-C9ymLmKE.js","assets/ManagerDailyTodo-XKTkBEHM.js","assets/DesignerWorkload-BxTUV9lO.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-Dekvz-_h.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-Dcf4XGCe.js","assets/ManagerClientRework-NjpOoI9I.js","assets/ManagerJobWorks-WLKTTDXK.js","assets/ManagerSubDepartmentList-B9cDFBu9.js","assets/ManagerEmployeeList-CVPnC57-.js","assets/ManagerEfficiency-DUIMNiD_.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-CozZ52Gw.js","assets/SMMMonthlyPosting-CX704BsJ.js","assets/SMMPosted-B2gXrdRA.js","assets/WritersAssignment-CKuViCJ0.js","assets/EmployeeDashboard-1o06n7uO.js","assets/EmployeeCalendar-iMm4gX3e.js","assets/EmployeeEventCalendar-DvP4xEIY.js","assets/EmployeeAssignedWork-DBaprCfZ.js","assets/EmployeeReassignedWork-D4wSAA2l.js","assets/EmployeeApprovedWork-D1dWVqaO.js","assets/EmployeeTodayDeliverables-CIqqQ1a3.js","assets/EmployeeRework-BPguogYI.js","assets/EmployeeOverallWork-BF5oGHim.js","assets/SuperAdminDashboard-CLF9sG6k.js","assets/SuperAdminClients-pi3eA6VR.js","assets/SuperAdminEfficiency-CwfzsxKo.js","assets/SuperAdminBranches-BriWGu5A.js","assets/SuperAdminBranchDetail-DjHc--Fv.js","assets/SuperAdminProfile-VRGPETK9.js"])))=>i.map(i=>d[i]);
var ee=Object.defineProperty;var te=(s,t,o)=>t in s?ee(s,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[t]=o;var q=(s,t,o)=>te(s,typeof t!="symbol"?t+"":t,o);import{r as b,j as e,L as k,B as F,U as R,C as P,a as M,b as se,c as A,d as B,e as z,f as $,F as I,R as W,P as oe,N as ne,g as re,A as K,h as ae,G as ie,i as le,K as ce,X as de,S as pe,k as me,l as xe,m as Q,n as ue,o as he,p as n,q as _,O as T,s as fe}from"./vendor-react-oiAd07sW.js";import{f as ge}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))p(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&p(r)}).observe(document,{childList:!0,subtree:!0});function o(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function p(a){if(a.ep)return;a.ep=!0;const l=o(a);fetch(a.href,l)}})();const je="modulepreload",be=function(s){return"/"+s},Y={},c=function(t,o,p){let a=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),u=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=Promise.allSettled(o.map(g=>{if(g=be(g),g in Y)return;Y[g]=!0;const h=g.endsWith(".css"),m=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${m}`))return;const x=document.createElement("link");if(x.rel=h?"stylesheet":je,h||(x.as="script"),x.crossOrigin="",x.href=g,u&&x.setAttribute("nonce",u),document.head.appendChild(x),h)return new Promise((j,f)=>{x.addEventListener("load",j),x.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${g}`)))})}))}function l(r){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=r,window.dispatchEvent(u),!u.defaultPrevented)throw r}return a.then(r=>{for(const u of r||[])u.status==="rejected"&&l(u.reason);return t().catch(l)})},ye=()=>{const s="https://api.reachskyline.com/api";{const t=s.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},v=ge.create({baseURL:ye(),timeout:3e4,headers:{"Content-Type":"application/json"}});v.interceptors.request.use(s=>{const t=localStorage.getItem("erp_token");return t&&(s.headers.Authorization=`Bearer ${t}`),s},s=>Promise.reject(s));v.interceptors.response.use(s=>s,async s=>{var u,g,h;const{config:t,response:o}=s,p=((u=t==null?void 0:t.method)==null?void 0:u.toLowerCase())==="get",a=!o,l=o&&o.status>=500;if(t&&p&&(a||l)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const m=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,m),console.warn(`API call failed: ${s.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${m}ms...`),await new Promise(x=>setTimeout(x,m)),v(t)}return o&&(o.status===401||o.status===403&&(((g=o.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(o.data.message)||((h=o.data)==null?void 0:h.errors)&&o.data.errors.some(m=>/jwt expired|invalid signature|jwt malformed/i.test(String(m)))))&&(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true")),Promise.reject(s)});const X=b.createContext(null),_e=({children:s})=>{const[t,o]=b.useState(()=>{try{const m=localStorage.getItem("erp_user"),x=localStorage.getItem("erp_token");return m&&x?JSON.parse(m):null}catch{return null}}),[p,a]=b.useState(!1),l=m=>{if(m)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(x){var f,E;const j=async()=>{var i,y;try{const L=(y=(i=x.User)==null?void 0:i.PushSubscription)==null?void 0:y.id;L&&await v.post("/notifications/subscribe",{subscriptionId:L}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{x.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(i=>{console.warn("[OneSignal] Domain initialization deferred:",(i==null?void 0:i.message)||i)}),window.__oneSignalInitialized=!0}catch(i){console.warn("[OneSignal] Init warning:",i.message)}j();try{(E=(f=x.User)==null?void 0:f.PushSubscription)==null||E.addEventListener("change",function(i){var y;(y=i==null?void 0:i.current)!=null&&y.optedIn&&j()})}catch{}})}catch{}};b.useEffect(()=>{(async()=>{if(!localStorage.getItem("erp_token")){o(null),a(!1);return}try{const j=await v.get("/auth/session");if(j.data&&j.data.success){const f=j.data.data.user;o(f),localStorage.setItem("erp_user",JSON.stringify(f))}else localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null)}catch(j){console.warn("Session background validation:",j.message)}finally{a(!1)}})()},[]),b.useEffect(()=>{t&&l(t)},[t]);const r=async(m,x,j)=>{try{const f=await v.post("/auth/login",{username:m,password:x},{onRetry:j});if(f.data&&f.data.success){const{token:E,user:i}=f.data.data;return localStorage.setItem("erp_token",E),localStorage.setItem("erp_user",JSON.stringify(i)),o(i),a(!1),{success:!0}}else return{success:!1,message:f.data.message||"Login failed."}}catch(f){const E=f.response&&f.response.data&&f.response.data.message?f.response.data.message:"An error occurred connecting to the server.",i=f.response&&f.response.data&&f.response.data.errors?f.response.data.errors:[];return{success:!1,message:E,errors:i}}},u=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(m){var x,j;try{const f=(j=(x=m.User)==null?void 0:x.PushSubscription)==null?void 0:j.id;f&&await v.post("/notifications/unsubscribe",{subscriptionId:f}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null),a(!1)},g=m=>{o(x=>{if(!x)return null;const j={...x,...m};return localStorage.setItem("erp_user",JSON.stringify(j)),j})},h={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:p,login:r,logout:u,updateCurrentUser:g};return e.jsx(X.Provider,{value:h,children:s})},S=()=>{const s=b.useContext(X);return s||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},ve=b.createContext(null),we=({children:s})=>{const[t,o]=b.useState([]),[p,a]=b.useState(0),{isAuthenticated:l}=S(),r=b.useCallback(async()=>{if(l)try{const m=await v.get("/notifications");if(m.data&&m.data.success){const x=m.data.data.notifications;o(x);const j=x.filter(f=>!f.is_read).length;a(j)}}catch{}},[l]),u=async m=>{try{await v.patch(`/notifications/${m}/read`),o(x=>x.map(j=>j.id===parseInt(m)?{...j,is_read:1}:j)),a(x=>Math.max(0,x-1))}catch(x){console.error("Failed to mark notification as read:",x.message)}},g=async()=>{try{await v.post("/notifications/read-all"),o(m=>m.map(x=>({...x,is_read:1}))),a(0)}catch(m){console.error("Failed to mark all notifications as read:",m.message)}};b.useEffect(()=>{if(l){r();const m=setInterval(r,3e4);return()=>clearInterval(m)}else o([]),a(0)},[l,r]);const h={notifications:t,unreadCount:p,fetchNotifications:r,markAsRead:u,markAllRead:g};return e.jsx(ve.Provider,{value:h,children:s})},O=()=>{var a,l,r,u,g;const{logout:s,user:t}=S(),o=()=>{const h=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(F,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx($,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(K,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(R,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(ae,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(P,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(P,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(M,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(ie,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&h.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(I,{size:20})}),h.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(le,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(ce,{size:20})}),h},p=(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(F,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(R,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(P,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(M,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(se,{size:20})}]:(t==null?void 0:t.role)==="manager"?((a=t==null?void 0:t.managerProfile)==null?void 0:a.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(R,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(A,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(B,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(z,{size:20})}]:((l=t==null?void 0:t.managerProfile)==null?void 0:l.department_code)==="SEO-RS"?[]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(A,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(z,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(B,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(P,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(R,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx($,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(R,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(M,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(I,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(W,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(I,{size:20})}]:(t==null?void 0:t.role)==="employee"?((r=t==null?void 0:t.employeeProfile)==null?void 0:r.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(A,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(B,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(z,{size:20})}]:((u=t==null?void 0:t.employeeProfile)==null?void 0:u.department_code)==="SEO-RS"?[]:((g=t==null?void 0:t.employeeProfile)==null?void 0:g.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(P,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(A,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(W,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(I,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(B,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(A,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(W,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(z,{size:20})}]:(t==null?void 0:t.role)==="client"?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(k,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(z,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(I,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(M,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(oe,{size:20})}]:o();return e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:p.map((h,m)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(ne,{to:h.path,state:h.state,className:({isActive:x})=>`sidebar-link ${x?"active":""}`,children:[h.icon,e.jsx("span",{children:h.label})]})},m))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:s,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:h=>{h.currentTarget.style.color="#f87171"},onMouseLeave:h=>{h.currentTarget.style.color="var(--danger)"},children:[e.jsx(re,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})},Ee=({isOpen:s,onClose:t,title:o,children:p,footer:a=null})=>(b.useEffect(()=>(s?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[s]),s?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:l=>l.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:o}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(de,{size:20})})]}),e.jsx("div",{className:"modal-body",children:p}),a&&e.jsx("div",{className:"modal-footer",children:a})]})}):null),N=()=>{var f,E;const{user:s,logout:t}=S(),[o,p]=b.useState(""),[a,l]=b.useState(!1),[r,u]=b.useState(null),[g,h]=b.useState(!1),m=async i=>{if(i.preventDefault(),!!o.trim()){l(!0),h(!0);try{const y=await v.get(`/search?q=${encodeURIComponent(o)}`);y.data&&y.data.success&&u(y.data.data)}catch(y){console.error("Global search error:",y.message)}finally{l(!1)}}},x=s&&s.username?s.username.slice(0,2).toUpperCase():"AD",j=()=>{var i,y,L,U;return(s==null?void 0:s.role)==="manager"?((i=s==null?void 0:s.managerProfile)==null?void 0:i.department_code)==="SMM-RS"?"SMM Manager":(y=s==null?void 0:s.managerProfile)!=null&&y.department_name?`${s.managerProfile.department_name} Manager`:"Brand Manager":(s==null?void 0:s.role)==="employee"?((L=s==null?void 0:s.employeeProfile)==null?void 0:L.department_code)==="SMM-RS"?"SMM Employee":(U=s==null?void 0:s.employeeProfile)!=null&&U.department_name?`${s.employeeProfile.department_name} Employee`:"Employee":(s==null?void 0:s.role)==="client"?"Client Partner":(s==null?void 0:s.role)==="admin"?"Administrator":(s==null?void 0:s.role)==="super_admin"?"Super Administrator":(s==null?void 0:s.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsx("form",{onSubmit:m,children:e.jsxs("div",{className:"header-search",children:[e.jsx(pe,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:o,onChange:i=>p(i.target.value)})]})}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:x}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((f=s==null?void 0:s.clientProfile)==null?void 0:f.company_name)||((E=s==null?void 0:s.managerProfile)==null?void 0:E.full_name)||(s==null?void 0:s.username)||"User"}),e.jsx("span",{className:"user-role",children:j()})]})]})}),e.jsx(Ee,{isOpen:g,onClose:()=>{h(!1),u(null)},title:`Search Results for "${o}"`,children:a?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):r?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[r.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(me,{size:16,className:"text-primary"})," Clients (",r.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:r.clients.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${i.id}`,style:{fontWeight:600},children:i.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[i.client_name," • ",i.client_id_code]})]},i.id))})]}),r.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx($,{size:16,className:"text-teal"})," Departments (",r.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:r.departments.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${i.id}`,style:{fontWeight:600},children:i.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:i.code})]},i.id))})]}),r.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(K,{size:16,className:"text-secondary"})," Managers (",r.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:r.managers.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${i.id}`,style:{fontWeight:600},children:i.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[i.manager_id_code," • ",i.department_name]})]},i.id))})]}),r.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(R,{size:16,className:"text-purple"})," Employees (",r.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:r.employees.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${i.id}`,style:{fontWeight:600},children:i.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[i.employee_id_code," • ",i.department_name]})]},i.id))})]}),r.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(xe,{size:16,className:"text-orange"})," Projects (",r.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:r.projects.map(i=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${i.id}`,style:{fontWeight:600},children:i.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",i.client_name," • Manager: ",i.manager_name]})]},i.id))})]}),r.clients.length===0&&r.departments.length===0&&r.managers.length===0&&r.employees.length===0&&r.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',o,'".']})})]}):null})]})};class C extends Q.Component{constructor(o){super(o);q(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(o){return{hasError:!0,error:o}}componentDidCatch(o,p){var l,r,u;if(console.error("ErrorBoundary caught an error:",o,p),this.setState({errorInfo:p}),o&&(o.name==="ChunkLoadError"||((l=o.message)==null?void 0:l.includes("Failed to fetch dynamically imported module"))||((r=o.message)==null?void 0:r.includes("Importing a module script failed"))||((u=o.message)==null?void 0:u.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var o,p;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(o=this.state.error)==null?void 0:o.toString(),((p=this.state.errorInfo)==null?void 0:p.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const d=s=>b.lazy(()=>s().catch(t=>{var p,a,l;throw t&&(t.name==="ChunkLoadError"||((p=t.message)==null?void 0:p.includes("Failed to fetch dynamically imported module"))||((a=t.message)==null?void 0:a.includes("Importing a module script failed"))||((l=t.message)==null?void 0:l.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),ke=d(()=>c(()=>import("./Login-DTU_ihwp.js"),__vite__mapDeps([0,1,2]))),Se=d(()=>c(()=>import("./AdminDashboard-B_pf0qFD.js"),__vite__mapDeps([3,1,2]))),Ce=d(()=>c(()=>import("./ClientList-BSD-Nq0Y.js"),__vite__mapDeps([4,1,2,5,6]))),Le=d(()=>c(()=>import("./DepartmentList-aajkJPbw.js"),__vite__mapDeps([7,1,2,5,6]))),Re=d(()=>c(()=>import("./ManagerList-CNE62KqE.js"),__vite__mapDeps([8,1,2,5,6]))),Pe=d(()=>c(()=>import("./EmployeeList-BEglYNVF.js"),__vite__mapDeps([9,1,2,5,6]))),Ae=d(()=>c(()=>import("./ProjectList-D7bPswmn.js"),__vite__mapDeps([10,1,2,11,12,6]))),ze=d(()=>c(()=>import("./DeliverableList-C_-eIMkn.js"),__vite__mapDeps([13,1,2,5,6]))),Ie=d(()=>c(()=>import("./ReportDashboard-CV9OlAIr.js"),__vite__mapDeps([14,1,2]))),De=d(()=>c(()=>import("./SuperadminReports-NX_Dh2jW.js"),__vite__mapDeps([15,1,2,5]))),Te=d(()=>c(()=>import("./ActivityTypeList-BAETW5g5.js"),__vite__mapDeps([16,1,2,6]))),Oe=d(()=>c(()=>import("./LoginCredentials-BsnVlkKF.js"),__vite__mapDeps([17,1,2,5]))),Ne=d(()=>c(()=>import("./WorkUpdates-Db0xHX-9.js"),__vite__mapDeps([18,1,2,19]))),D=d(()=>c(()=>import("./ClientPortal-CMiwLB88.js"),__vite__mapDeps([20,1,2]))),Me=d(()=>c(()=>import("./ManagerDashboard-VZ2Se-EA.js"),__vite__mapDeps([21,1,2]))),Be=d(()=>c(()=>import("./ManagerCalendar-C9ymLmKE.js"),__vite__mapDeps([22,1,2,11,12,6]))),Ve=d(()=>c(()=>import("./ManagerDailyTodo-XKTkBEHM.js"),__vite__mapDeps([23,1,2]))),We=d(()=>c(()=>import("./DesignerWorkload-BxTUV9lO.js"),__vite__mapDeps([24,1,2,25]))),$e=d(()=>c(()=>import("./CompletedWorks-Dekvz-_h.js"),__vite__mapDeps([26,1,2,27]))),Ue=d(()=>c(()=>import("./ManagerSubmissionsReview-Dcf4XGCe.js"),__vite__mapDeps([28,1,2]))),qe=d(()=>c(()=>import("./ManagerClientRework-NjpOoI9I.js"),__vite__mapDeps([29,1,2]))),Fe=d(()=>c(()=>import("./ManagerJobWorks-WLKTTDXK.js"),__vite__mapDeps([30,1,2,5]))),Ye=d(()=>c(()=>import("./ManagerSubDepartmentList-B9cDFBu9.js"),__vite__mapDeps([31,1,2]))),He=d(()=>c(()=>import("./ManagerEmployeeList-CVPnC57-.js"),__vite__mapDeps([32,1,2,5,33,34]))),Ge=d(()=>c(()=>import("./ManagerEfficiency-DUIMNiD_.js"),__vite__mapDeps([33,1,2,34]))),H=d(()=>c(()=>import("./SMMTodayPosting-CozZ52Gw.js"),__vite__mapDeps([35,1,2]))),G=d(()=>c(()=>import("./SMMMonthlyPosting-CX704BsJ.js"),__vite__mapDeps([36,1,2,5]))),J=d(()=>c(()=>import("./SMMPosted-B2gXrdRA.js"),__vite__mapDeps([37,1,2,5]))),Je=d(()=>c(()=>import("./WritersAssignment-CKuViCJ0.js"),__vite__mapDeps([38,1,2]))),Ke=d(()=>c(()=>import("./EmployeeDashboard-1o06n7uO.js"),__vite__mapDeps([39,1,2]))),Qe=d(()=>c(()=>import("./EmployeeCalendar-iMm4gX3e.js"),__vite__mapDeps([40,1,2,11,12,6]))),V=d(()=>c(()=>import("./EmployeeEventCalendar-DvP4xEIY.js"),__vite__mapDeps([41,1,2]))),Xe=d(()=>c(()=>import("./EmployeeAssignedWork-DBaprCfZ.js"),__vite__mapDeps([42,1,2]))),Ze=d(()=>c(()=>import("./EmployeeReassignedWork-D4wSAA2l.js"),__vite__mapDeps([43,1,2]))),et=d(()=>c(()=>import("./EmployeeApprovedWork-D1dWVqaO.js"),__vite__mapDeps([44,1,2,5]))),tt=d(()=>c(()=>import("./EmployeeTodayDeliverables-CIqqQ1a3.js"),__vite__mapDeps([45,1,2]))),st=d(()=>c(()=>import("./EmployeeRework-BPguogYI.js"),__vite__mapDeps([46,1,2]))),ot=d(()=>c(()=>import("./EmployeeOverallWork-BF5oGHim.js"),__vite__mapDeps([47,1,2]))),nt=d(()=>c(()=>import("./SuperAdminDashboard-CLF9sG6k.js"),__vite__mapDeps([48,1,2]))),rt=d(()=>c(()=>import("./SuperAdminClients-pi3eA6VR.js"),__vite__mapDeps([49,1,2,5]))),at=d(()=>c(()=>import("./SuperAdminEfficiency-CwfzsxKo.js"),__vite__mapDeps([50,1,2,5]))),it=d(()=>c(()=>import("./SuperAdminBranches-BriWGu5A.js"),__vite__mapDeps([51,1,2,5]))),lt=d(()=>c(()=>import("./SuperAdminBranchDetail-DjHc--Fv.js"),__vite__mapDeps([52,1,2,5]))),ct=d(()=>c(()=>import("./SuperAdminProfile-VRGPETK9.js"),__vite__mapDeps([53,1,2]))),w=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),dt=()=>{const{isAuthenticated:s,user:t,loading:o}=S();return o?e.jsx(w,{}):!s||(t==null?void 0:t.role)!=="super_admin"?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(T,{})})})]})]})},pt=()=>{const{isAuthenticated:s,isAdmin:t,loading:o}=S();return o?e.jsx(w,{}):!s||!t?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(T,{})})})]})]})},mt=()=>{const{isAuthenticated:s,user:t,loading:o}=S();return o?e.jsx(w,{}):!s||(t==null?void 0:t.role)!=="manager"&&(t==null?void 0:t.role)!=="admin"&&(t==null?void 0:t.role)!=="super_admin"?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(T,{})})})]})]})},xt=()=>{const{isAuthenticated:s,user:t,loading:o}=S();return o?e.jsx(w,{}):!s||(t==null?void 0:t.role)!=="client"?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(T,{})})})]})]})},ut=()=>{const{isAuthenticated:s,user:t,loading:o}=S();return o?e.jsx(w,{}):!s||(t==null?void 0:t.role)!=="employee"?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(w,{}),children:e.jsx(T,{})})})]})]})};function ht(){return e.jsx(ue,{children:e.jsx(_e,{children:e.jsx(we,{children:e.jsx(C,{children:e.jsx(b.Suspense,{fallback:e.jsx(w,{}),children:e.jsxs(he,{children:[e.jsx(n,{path:"/login",element:e.jsx(ke,{})}),e.jsxs(n,{path:"/super-admin",element:e.jsx(dt,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(nt,{})}),e.jsx(n,{path:"clients",element:e.jsx(rt,{})}),e.jsx(n,{path:"efficiency",element:e.jsx(at,{})}),e.jsx(n,{path:"branches",element:e.jsx(it,{})}),e.jsx(n,{path:"branches/:id",element:e.jsx(lt,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(C,{children:e.jsx(V,{})})}),e.jsx(n,{path:"profile",element:e.jsx(ct,{})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/admin",element:e.jsx(pt,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(Se,{})}),e.jsx(n,{path:"clients",element:e.jsx(Ce,{})}),e.jsx(n,{path:"departments",element:e.jsx(Le,{})}),e.jsx(n,{path:"managers",element:e.jsx(Re,{})}),e.jsx(n,{path:"employees",element:e.jsx(Pe,{})}),e.jsx(n,{path:"projects",element:e.jsx(Ae,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(C,{children:e.jsx(V,{})})}),e.jsx(n,{path:"deliverables",element:e.jsx(ze,{})}),e.jsx(n,{path:"reports",element:e.jsx(Ie,{})}),e.jsx(n,{path:"superadmin-reports",element:e.jsx(De,{})}),e.jsx(n,{path:"activity-types",element:e.jsx(Te,{})}),e.jsx(n,{path:"credentials",element:e.jsx(Oe,{})}),e.jsx(n,{path:"work-updates",element:e.jsx(Ne,{})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/manager",element:e.jsx(mt,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(Me,{})}),e.jsx(n,{path:"calendar",element:e.jsx(Be,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(C,{children:e.jsx(V,{})})}),e.jsx(n,{path:"daily-todo",element:e.jsx(Ve,{})}),e.jsx(n,{path:"designer-workload",element:e.jsx(We,{})}),e.jsx(n,{path:"completed-works",element:e.jsx($e,{})}),e.jsx(n,{path:"sub-departments",element:e.jsx(Ye,{})}),e.jsx(n,{path:"employees",element:e.jsx(He,{})}),e.jsx(n,{path:"efficiency",element:e.jsx(Ge,{})}),e.jsx(n,{path:"submissions-review",element:e.jsx(C,{children:e.jsx(Ue,{})})}),e.jsx(n,{path:"client-reworks",element:e.jsx(qe,{})}),e.jsx(n,{path:"job-works",element:e.jsx(Fe,{})}),e.jsx(n,{path:"today-posting",element:e.jsx(H,{})}),e.jsx(n,{path:"monthly-posting",element:e.jsx(G,{})}),e.jsx(n,{path:"posted",element:e.jsx(J,{})}),e.jsx(n,{path:"writers-assignment",element:e.jsx(C,{children:e.jsx(Je,{})})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/employee",element:e.jsx(ut,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(Ke,{})}),e.jsx(n,{path:"calendar",element:e.jsx(Qe,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(C,{children:e.jsx(V,{})})}),e.jsx(n,{path:"assigned-work",element:e.jsx(Xe,{})}),e.jsx(n,{path:"reassigned-work",element:e.jsx(Ze,{})}),e.jsx(n,{path:"approved-work",element:e.jsx(et,{})}),e.jsx(n,{path:"overall-work",element:e.jsx(ot,{})}),e.jsx(n,{path:"today",element:e.jsx(tt,{})}),e.jsx(n,{path:"rework",element:e.jsx(st,{})}),e.jsx(n,{path:"today-posting",element:e.jsx(H,{isEmployee:!0})}),e.jsx(n,{path:"monthly-posting",element:e.jsx(G,{isEmployee:!0})}),e.jsx(n,{path:"posted",element:e.jsx(J,{isEmployee:!0})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/client",element:e.jsx(xt,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(D,{activeTabProp:"dashboard"})}),e.jsx(n,{path:"approvals",element:e.jsx(D,{activeTabProp:"approvals"})}),e.jsx(n,{path:"reachskyline-approvals",element:e.jsx(D,{activeTabProp:"reachskyline_approvals"})}),e.jsx(n,{path:"reports",element:e.jsx(D,{activeTabProp:"reports"})}),e.jsx(n,{path:"contact",element:e.jsx(D,{activeTabProp:"contact"})}),e.jsx(n,{path:"portal",element:e.jsx(_,{to:"/client/dashboard",replace:!0})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsx(n,{path:"*",element:e.jsx(_,{to:"/login",replace:!0})})]})})})})})})}window.alert=s=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const m=document.createElement("style");m.textContent=`
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
    `,document.head.appendChild(m),document.body.appendChild(t)}t.innerHTML="";let o="info",p="Notification";const a=(s||"").toLowerCase();a.includes("already approved")||a.includes("can't edit")||a.includes("cannot edit")?(o="info",p="Info"):a.includes("success")||a.includes("approve")||a.includes("submit")?(o="success",p="Success"):(a.includes("fail")||a.includes("error")||a.includes("invalid")||a.includes("please"))&&(o="error",p="Alert");let l="";o==="success"?l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':o==="error"?l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const r=document.createElement("div");r.className="custom-alert-backdrop";const u=document.createElement("div");u.className="custom-alert-box",u.innerHTML=`
    <div class="custom-alert-icon-container ${o}">
      ${l}
    </div>
    <h3 class="custom-alert-title">${p}</h3>
    <p class="custom-alert-message">${s}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(r),t.appendChild(u);const g=()=>{u.classList.remove("show"),r.classList.remove("show"),setTimeout(()=>{t.contains(r)&&t.removeChild(r),t.contains(u)&&t.removeChild(u)},300)},h=u.querySelector(".custom-alert-btn");h.addEventListener("click",g),r.addEventListener("click",g),requestAnimationFrame(()=>{r.classList.add("show"),u.classList.add("show"),h.focus()})};window.confirm=s=>new Promise(t=>{let o=document.getElementById("custom-confirm-container");if(!o){o=document.createElement("div"),o.id="custom-confirm-container";const h=document.createElement("style");h.textContent=`
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
      `,document.head.appendChild(h),document.body.appendChild(o)}o.innerHTML="";const p=document.createElement("div");p.className="custom-confirm-backdrop";const a=document.createElement("div");a.className="custom-confirm-box";const l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';a.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${l}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${s}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,o.appendChild(p),o.appendChild(a);const r=h=>{a.classList.remove("show"),p.classList.remove("show"),setTimeout(()=>{o.contains(p)&&o.removeChild(p),o.contains(a)&&o.removeChild(a),t(h)},300)},u=a.querySelector(".custom-confirm-btn-cancel"),g=a.querySelector(".custom-confirm-btn-confirm");u.addEventListener("click",()=>r(!1)),g.addEventListener("click",()=>r(!0)),p.addEventListener("click",()=>r(!1)),requestAnimationFrame(()=>{p.classList.add("show"),a.classList.add("show"),g.focus()})});if(typeof window<"u"){const s=t=>{if(!t||typeof t!="string")return!1;const o=t.toLowerCase();return o.includes("message channel closed")||o.includes("asynchronous response")||o.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var p;const o=((p=t.reason)==null?void 0:p.message)||String(t.reason||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var p;const o=t.message||String(((p=t.error)==null?void 0:p.message)||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}fe.createRoot(document.getElementById("root")).render(e.jsx(Q.StrictMode,{children:e.jsx(ht,{})}));export{Ee as M,v as a,S as u};
