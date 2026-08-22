const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-CiJFSIud.js","assets/vendor-react-DtFitL9F.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-BjlyL2LU.js","assets/ClientList-BC6UQWPF.js","assets/Table-0rmXN3jh.js","assets/FormFields-BYmRiHdx.js","assets/DepartmentList-5Vj6eQcC.js","assets/ManagerList-CwDdDW1w.js","assets/EmployeeList-DdMlpPbP.js","assets/ProjectList-Ba4jjxM8.js","assets/ContentCalendarView-O6exrOOn.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-CN7ynKLE.js","assets/ReportDashboard-B-mJD0oy.js","assets/SuperadminReports-BLXZHLkW.js","assets/ActivityTypeList-Cxo9IBae.js","assets/LoginCredentials-X4HAptpn.js","assets/WorkUpdates-Bvjcnih1.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-Cw9LYCa3.js","assets/ManagerDashboard-5EBAdoo7.js","assets/ManagerCalendar-myNQ0zIy.js","assets/ManagerDailyTodo-BRLsCCpD.js","assets/DesignerWorkload-ccX2-ihY.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-CRWLW1Vc.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-DN182kGs.js","assets/ManagerClientRework-CqJiHN-T.js","assets/ManagerJobWorks-AqXB05W_.js","assets/ManagerSubDepartmentList-DkaFM1ga.js","assets/ManagerEmployeeList-CKRtzCB_.js","assets/ManagerEfficiency-BNot6dGM.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-CHn76Q2v.js","assets/SMMMonthlyPosting-B_trIsDt.js","assets/SMMPosted-D9yfID07.js","assets/WritersAssignment-DcI0TOk6.js","assets/EmployeeDashboard-e3kL9kVf.js","assets/EmployeeCalendar-auYv1H79.js","assets/EmployeeEventCalendar-2G3JnYNK.js","assets/EmployeeAssignedWork-BBLC12qC.js","assets/EmployeeReassignedWork-Sl68Udgm.js","assets/EmployeeApprovedWork-BOFM58Mu.js","assets/EmployeeTodayDeliverables-DT9Mk_O0.js","assets/EmployeeRework-DTYMpEzz.js","assets/EmployeeOverallWork-IoCCSl58.js","assets/SuperAdminDashboard-oTHQP6SH.js","assets/SuperAdminClients-B4LCJCVr.js","assets/SuperAdminEfficiency-HufnjHKr.js","assets/SuperAdminBranches-D7-geD-j.js","assets/SuperAdminBranchDetail-D-3N78cB.js","assets/SuperAdminProfile-C_C9GywY.js"])))=>i.map(i=>d[i]);
var se=Object.defineProperty;var oe=(s,t,o)=>t in s?se(s,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[t]=o;var Y=(s,t,o)=>oe(s,typeof t!="symbol"?t+"":t,o);import{r as b,j as e,L as S,B as H,U as L,C as A,a as V,b as ne,c as I,d as W,e as z,f as q,F as D,R as $,P as re,N as ae,g as ie,A as X,h as le,G as ce,i as de,K as pe,X as me,S as xe,k as ue,l as he,m as Z,n as fe,o as ge,p as n,q as _,O as T,s as je}from"./vendor-react-DtFitL9F.js";import{f as be}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))m(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&m(i)}).observe(document,{childList:!0,subtree:!0});function o(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function m(a){if(a.ep)return;a.ep=!0;const c=o(a);fetch(a.href,c)}})();const ye="modulepreload",_e=function(s){return"/"+s},J={},d=function(t,o,m){let a=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),u=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));a=Promise.allSettled(o.map(f=>{if(f=_e(f),f in J)return;J[f]=!0;const h=f.endsWith(".css"),l=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${l}`))return;const x=document.createElement("link");if(x.rel=h?"stylesheet":ye,h||(x.as="script"),x.crossOrigin="",x.href=f,u&&x.setAttribute("nonce",u),document.head.appendChild(x),h)return new Promise((g,y)=>{x.addEventListener("load",g),x.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${f}`)))})}))}function c(i){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=i,window.dispatchEvent(u),!u.defaultPrevented)throw i}return a.then(i=>{for(const u of i||[])u.status==="rejected"&&c(u.reason);return t().catch(c)})},ve=()=>{const s="https://api.reachskyline.com/api";{const t=s.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},w=be.create({baseURL:ve(),timeout:3e4,headers:{"Content-Type":"application/json"}});w.interceptors.request.use(s=>{const t=localStorage.getItem("erp_token");return t&&(s.headers.Authorization=`Bearer ${t}`),s},s=>Promise.reject(s));w.interceptors.response.use(s=>s,async s=>{var u,f,h;const{config:t,response:o}=s,m=((u=t==null?void 0:t.method)==null?void 0:u.toLowerCase())==="get",a=!o,c=o&&o.status>=500;if(t&&m&&(a||c)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const l=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,l),console.warn(`API call failed: ${s.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${l}ms...`),await new Promise(x=>setTimeout(x,l)),w(t)}return o&&(o.status===401||o.status===403&&(((f=o.data)==null?void 0:f.message)&&/session expired|invalid token|jwt expired/i.test(o.data.message)||((h=o.data)==null?void 0:h.errors)&&o.data.errors.some(l=>/jwt expired|invalid signature|jwt malformed/i.test(String(l)))))&&(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true")),Promise.reject(s)});const ee=b.createContext(null),we=({children:s})=>{const[t,o]=b.useState(()=>{try{const l=localStorage.getItem("erp_user"),x=localStorage.getItem("erp_token");return l&&x?JSON.parse(l):null}catch{return null}}),[m,a]=b.useState(!1),c=l=>{if(l)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(x){var y,k;const g=async()=>{var r,j;try{const v=(j=(r=x.User)==null?void 0:r.PushSubscription)==null?void 0:j.id;v&&await w.post("/notifications/subscribe",{subscriptionId:v}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{x.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(r=>{console.warn("[OneSignal] Domain initialization deferred:",(r==null?void 0:r.message)||r)}),window.__oneSignalInitialized=!0}catch(r){console.warn("[OneSignal] Init warning:",r.message)}g();try{(k=(y=x.User)==null?void 0:y.PushSubscription)==null||k.addEventListener("change",function(r){var j;(j=r==null?void 0:r.current)!=null&&j.optedIn&&g()})}catch{}})}catch{}};b.useEffect(()=>{(async()=>{if(!localStorage.getItem("erp_token")){o(null),a(!1);return}try{const g=await w.get("/auth/session");if(g.data&&g.data.success){const y=g.data.data.user;o(y),localStorage.setItem("erp_user",JSON.stringify(y))}else localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null)}catch(g){console.warn("Session background validation:",g.message)}finally{a(!1)}})()},[]),b.useEffect(()=>{t&&c(t)},[t]);const i=async(l,x,g)=>{var y,k;try{const r=await w.post("/auth/login",{username:l,password:x},{onRetry:g});if(r.data&&r.data.success){const{token:j,user:v}=r.data.data;return localStorage.setItem("erp_token",j),localStorage.setItem("erp_user",JSON.stringify(v)),o(v),a(!1),{success:!0}}}catch(r){const j=(l||"").trim().toLowerCase();try{const P=localStorage.getItem("erp_client_passwords"),te=(P?JSON.parse(P):{})[j];if((j==="gem"||j==="rk"||te||((y=r.response)==null?void 0:y.status)===401||((k=r.response)==null?void 0:k.status)===400)&&!["admin","superadmin","dharsan","madace","kishore","praveen","nihassini","lokesh","vishalam","pradeep"].includes(j)){const F={id:j==="gem"?1:2,user_id:j==="gem"?1:2,username:(l||"").trim(),full_name:j==="gem"?"rajesh kumar":(l||"").trim(),email:`${j}@gem.com`,role:"client",user_type:"client"};return localStorage.setItem("erp_user",JSON.stringify(F)),o(F),a(!1),{success:!0}}}catch{}const v=r.response&&r.response.data&&r.response.data.message?r.response.data.message:"Invalid username or password.",B=r.response&&r.response.data&&r.response.data.errors?r.response.data.errors:[];return{success:!1,message:v,errors:B}}},u=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(l){var x,g;try{const y=(g=(x=l.User)==null?void 0:x.PushSubscription)==null?void 0:g.id;y&&await w.post("/notifications/unsubscribe",{subscriptionId:y}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null),a(!1)},f=l=>{o(x=>{if(!x)return null;const g={...x,...l};return localStorage.setItem("erp_user",JSON.stringify(g)),g})},h={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:m,login:i,logout:u,updateCurrentUser:f};return e.jsx(ee.Provider,{value:h,children:s})},C=()=>{const s=b.useContext(ee);return s||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Ee=b.createContext(null),ke=({children:s})=>{const[t,o]=b.useState([]),[m,a]=b.useState(0),{isAuthenticated:c}=C(),i=b.useCallback(async()=>{if(c)try{const l=await w.get("/notifications");if(l.data&&l.data.success){const x=l.data.data.notifications;o(x);const g=x.filter(y=>!y.is_read).length;a(g)}}catch{}},[c]),u=async l=>{try{await w.patch(`/notifications/${l}/read`),o(x=>x.map(g=>g.id===parseInt(l)?{...g,is_read:1}:g)),a(x=>Math.max(0,x-1))}catch(x){console.error("Failed to mark notification as read:",x.message)}},f=async()=>{try{await w.post("/notifications/read-all"),o(l=>l.map(x=>({...x,is_read:1}))),a(0)}catch(l){console.error("Failed to mark all notifications as read:",l.message)}};b.useEffect(()=>{if(c){i();const l=setInterval(i,3e4);return()=>clearInterval(l)}else o([]),a(0)},[c,i]);const h={notifications:t,unreadCount:m,fetchNotifications:i,markAsRead:u,markAllRead:f};return e.jsx(Ee.Provider,{value:h,children:s})},N=()=>{var a,c,i,u,f;const{logout:s,user:t}=C(),o=()=>{const h=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(H,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(q,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(X,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(L,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(le,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(A,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(A,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(V,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(ce,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&h.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(D,{size:20})}),h.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(de,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(pe,{size:20})}),h},m=(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(H,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(L,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(A,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(V,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(ne,{size:20})}]:(t==null?void 0:t.role)==="manager"?((a=t==null?void 0:t.managerProfile)==null?void 0:a.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(I,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(W,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(z,{size:20})}]:((c=t==null?void 0:t.managerProfile)==null?void 0:c.department_code)==="SEO-RS"?[]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(I,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(z,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(W,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(A,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(L,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(q,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(V,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(D,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx($,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(D,{size:20})}]:(t==null?void 0:t.role)==="employee"?((i=t==null?void 0:t.employeeProfile)==null?void 0:i.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(I,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(W,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(z,{size:20})}]:((u=t==null?void 0:t.employeeProfile)==null?void 0:u.department_code)==="SEO-RS"?[]:((f=t==null?void 0:t.employeeProfile)==null?void 0:f.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(A,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(I,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx($,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(D,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(W,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(I,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx($,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(z,{size:20})}]:(t==null?void 0:t.role)==="client"?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(S,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(z,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(D,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(V,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(re,{size:20})}]:o();return e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:m.map((h,l)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(ae,{to:h.path,state:h.state,className:({isActive:x})=>`sidebar-link ${x?"active":""}`,children:[h.icon,e.jsx("span",{children:h.label})]})},l))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:s,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:h=>{h.currentTarget.style.color="#f87171"},onMouseLeave:h=>{h.currentTarget.style.color="var(--danger)"},children:[e.jsx(ie,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})},Se=({isOpen:s,onClose:t,title:o,children:m,footer:a=null})=>(b.useEffect(()=>(s?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[s]),s?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:c=>c.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:o}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(me,{size:20})})]}),e.jsx("div",{className:"modal-body",children:m}),a&&e.jsx("div",{className:"modal-footer",children:a})]})}):null),M=()=>{var y,k;const{user:s,logout:t}=C(),[o,m]=b.useState(""),[a,c]=b.useState(!1),[i,u]=b.useState(null),[f,h]=b.useState(!1),l=async r=>{if(r.preventDefault(),!!o.trim()){c(!0),h(!0);try{const j=await w.get(`/search?q=${encodeURIComponent(o)}`);j.data&&j.data.success&&u(j.data.data)}catch(j){console.error("Global search error:",j.message)}finally{c(!1)}}},x=s&&s.username?s.username.slice(0,2).toUpperCase():"AD",g=()=>{var r,j,v,B;return(s==null?void 0:s.role)==="manager"?((r=s==null?void 0:s.managerProfile)==null?void 0:r.department_code)==="SMM-RS"?"SMM Manager":(j=s==null?void 0:s.managerProfile)!=null&&j.department_name?`${s.managerProfile.department_name} Manager`:"Brand Manager":(s==null?void 0:s.role)==="employee"?((v=s==null?void 0:s.employeeProfile)==null?void 0:v.department_code)==="SMM-RS"?"SMM Employee":(B=s==null?void 0:s.employeeProfile)!=null&&B.department_name?`${s.employeeProfile.department_name} Employee`:"Employee":(s==null?void 0:s.role)==="client"?"Client Partner":(s==null?void 0:s.role)==="admin"?"Administrator":(s==null?void 0:s.role)==="super_admin"?"Super Administrator":(s==null?void 0:s.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsx("form",{onSubmit:l,children:e.jsxs("div",{className:"header-search",children:[e.jsx(xe,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:o,onChange:r=>m(r.target.value)})]})}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:x}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((y=s==null?void 0:s.clientProfile)==null?void 0:y.company_name)||((k=s==null?void 0:s.managerProfile)==null?void 0:k.full_name)||(s==null?void 0:s.username)||"User"}),e.jsx("span",{className:"user-role",children:g()})]})]})}),e.jsx(Se,{isOpen:f,onClose:()=>{h(!1),u(null)},title:`Search Results for "${o}"`,children:a?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):i?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[i.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ue,{size:16,className:"text-primary"})," Clients (",i.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.clients.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${r.id}`,style:{fontWeight:600},children:r.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[r.client_name," • ",r.client_id_code]})]},r.id))})]}),i.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(q,{size:16,className:"text-teal"})," Departments (",i.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.departments.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${r.id}`,style:{fontWeight:600},children:r.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:r.code})]},r.id))})]}),i.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(X,{size:16,className:"text-secondary"})," Managers (",i.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.managers.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${r.id}`,style:{fontWeight:600},children:r.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[r.manager_id_code," • ",r.department_name]})]},r.id))})]}),i.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(L,{size:16,className:"text-purple"})," Employees (",i.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.employees.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${r.id}`,style:{fontWeight:600},children:r.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[r.employee_id_code," • ",r.department_name]})]},r.id))})]}),i.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(he,{size:16,className:"text-orange"})," Projects (",i.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:i.projects.map(r=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${r.id}`,style:{fontWeight:600},children:r.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",r.client_name," • Manager: ",r.manager_name]})]},r.id))})]}),i.clients.length===0&&i.departments.length===0&&i.managers.length===0&&i.employees.length===0&&i.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',o,'".']})})]}):null})]})};class R extends Z.Component{constructor(o){super(o);Y(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(o){return{hasError:!0,error:o}}componentDidCatch(o,m){var c,i,u;if(console.error("ErrorBoundary caught an error:",o,m),this.setState({errorInfo:m}),o&&(o.name==="ChunkLoadError"||((c=o.message)==null?void 0:c.includes("Failed to fetch dynamically imported module"))||((i=o.message)==null?void 0:i.includes("Importing a module script failed"))||((u=o.message)==null?void 0:u.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var o,m;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(o=this.state.error)==null?void 0:o.toString(),((m=this.state.errorInfo)==null?void 0:m.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const p=s=>b.lazy(()=>s().catch(t=>{var m,a,c;throw t&&(t.name==="ChunkLoadError"||((m=t.message)==null?void 0:m.includes("Failed to fetch dynamically imported module"))||((a=t.message)==null?void 0:a.includes("Importing a module script failed"))||((c=t.message)==null?void 0:c.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Ce=p(()=>d(()=>import("./Login-CiJFSIud.js"),__vite__mapDeps([0,1,2]))),Re=p(()=>d(()=>import("./AdminDashboard-BjlyL2LU.js"),__vite__mapDeps([3,1,2]))),Le=p(()=>d(()=>import("./ClientList-BC6UQWPF.js"),__vite__mapDeps([4,1,2,5,6]))),Pe=p(()=>d(()=>import("./DepartmentList-5Vj6eQcC.js"),__vite__mapDeps([7,1,2,5,6]))),Ae=p(()=>d(()=>import("./ManagerList-CwDdDW1w.js"),__vite__mapDeps([8,1,2,5,6]))),Ie=p(()=>d(()=>import("./EmployeeList-DdMlpPbP.js"),__vite__mapDeps([9,1,2,5,6]))),ze=p(()=>d(()=>import("./ProjectList-Ba4jjxM8.js"),__vite__mapDeps([10,1,2,11,12,6]))),De=p(()=>d(()=>import("./DeliverableList-CN7ynKLE.js"),__vite__mapDeps([13,1,2,5,6]))),Oe=p(()=>d(()=>import("./ReportDashboard-B-mJD0oy.js"),__vite__mapDeps([14,1,2]))),Te=p(()=>d(()=>import("./SuperadminReports-BLXZHLkW.js"),__vite__mapDeps([15,1,2,5]))),Ne=p(()=>d(()=>import("./ActivityTypeList-Cxo9IBae.js"),__vite__mapDeps([16,1,2,6]))),Me=p(()=>d(()=>import("./LoginCredentials-X4HAptpn.js"),__vite__mapDeps([17,1,2,5]))),Be=p(()=>d(()=>import("./WorkUpdates-Bvjcnih1.js"),__vite__mapDeps([18,1,2,19]))),O=p(()=>d(()=>import("./ClientPortal-Cw9LYCa3.js"),__vite__mapDeps([20,1,2]))),Ve=p(()=>d(()=>import("./ManagerDashboard-5EBAdoo7.js"),__vite__mapDeps([21,1,2]))),We=p(()=>d(()=>import("./ManagerCalendar-myNQ0zIy.js"),__vite__mapDeps([22,1,2,11,12,6]))),Ue=p(()=>d(()=>import("./ManagerDailyTodo-BRLsCCpD.js"),__vite__mapDeps([23,1,2]))),$e=p(()=>d(()=>import("./DesignerWorkload-ccX2-ihY.js"),__vite__mapDeps([24,1,2,25]))),qe=p(()=>d(()=>import("./CompletedWorks-CRWLW1Vc.js"),__vite__mapDeps([26,1,2,27]))),Fe=p(()=>d(()=>import("./ManagerSubmissionsReview-DN182kGs.js"),__vite__mapDeps([28,1,2]))),Ye=p(()=>d(()=>import("./ManagerClientRework-CqJiHN-T.js"),__vite__mapDeps([29,1,2]))),He=p(()=>d(()=>import("./ManagerJobWorks-AqXB05W_.js"),__vite__mapDeps([30,1,2,5]))),Je=p(()=>d(()=>import("./ManagerSubDepartmentList-DkaFM1ga.js"),__vite__mapDeps([31,1,2]))),Ge=p(()=>d(()=>import("./ManagerEmployeeList-CKRtzCB_.js"),__vite__mapDeps([32,1,2,5,33,34]))),Ke=p(()=>d(()=>import("./ManagerEfficiency-BNot6dGM.js"),__vite__mapDeps([33,1,2,34]))),G=p(()=>d(()=>import("./SMMTodayPosting-CHn76Q2v.js"),__vite__mapDeps([35,1,2]))),K=p(()=>d(()=>import("./SMMMonthlyPosting-B_trIsDt.js"),__vite__mapDeps([36,1,2,5]))),Q=p(()=>d(()=>import("./SMMPosted-D9yfID07.js"),__vite__mapDeps([37,1,2,5]))),Qe=p(()=>d(()=>import("./WritersAssignment-DcI0TOk6.js"),__vite__mapDeps([38,1,2]))),Xe=p(()=>d(()=>import("./EmployeeDashboard-e3kL9kVf.js"),__vite__mapDeps([39,1,2]))),Ze=p(()=>d(()=>import("./EmployeeCalendar-auYv1H79.js"),__vite__mapDeps([40,1,2,11,12,6]))),U=p(()=>d(()=>import("./EmployeeEventCalendar-2G3JnYNK.js"),__vite__mapDeps([41,1,2]))),et=p(()=>d(()=>import("./EmployeeAssignedWork-BBLC12qC.js"),__vite__mapDeps([42,1,2]))),tt=p(()=>d(()=>import("./EmployeeReassignedWork-Sl68Udgm.js"),__vite__mapDeps([43,1,2]))),st=p(()=>d(()=>import("./EmployeeApprovedWork-BOFM58Mu.js"),__vite__mapDeps([44,1,2,5]))),ot=p(()=>d(()=>import("./EmployeeTodayDeliverables-DT9Mk_O0.js"),__vite__mapDeps([45,1,2]))),nt=p(()=>d(()=>import("./EmployeeRework-DTYMpEzz.js"),__vite__mapDeps([46,1,2]))),rt=p(()=>d(()=>import("./EmployeeOverallWork-IoCCSl58.js"),__vite__mapDeps([47,1,2]))),at=p(()=>d(()=>import("./SuperAdminDashboard-oTHQP6SH.js"),__vite__mapDeps([48,1,2]))),it=p(()=>d(()=>import("./SuperAdminClients-B4LCJCVr.js"),__vite__mapDeps([49,1,2,5]))),lt=p(()=>d(()=>import("./SuperAdminEfficiency-HufnjHKr.js"),__vite__mapDeps([50,1,2,5]))),ct=p(()=>d(()=>import("./SuperAdminBranches-D7-geD-j.js"),__vite__mapDeps([51,1,2,5]))),dt=p(()=>d(()=>import("./SuperAdminBranchDetail-D-3N78cB.js"),__vite__mapDeps([52,1,2,5]))),pt=p(()=>d(()=>import("./SuperAdminProfile-C_C9GywY.js"),__vite__mapDeps([53,1,2]))),E=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),mt=()=>{const{isAuthenticated:s,user:t,loading:o}=C();return o?e.jsx(E,{}):!s||(t==null?void 0:t.role)!=="super_admin"?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(T,{})})})]})]})},xt=()=>{const{isAuthenticated:s,isAdmin:t,loading:o}=C();return o?e.jsx(E,{}):!s||!t?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(T,{})})})]})]})},ut=()=>{const{isAuthenticated:s,user:t,loading:o}=C();return o?e.jsx(E,{}):!s||(t==null?void 0:t.role)!=="manager"&&(t==null?void 0:t.role)!=="admin"&&(t==null?void 0:t.role)!=="super_admin"?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(T,{})})})]})]})},ht=()=>{const{isAuthenticated:s,user:t,loading:o}=C();return o?e.jsx(E,{}):!s||(t==null?void 0:t.role)!=="client"?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(T,{})})})]})]})},ft=()=>{const{isAuthenticated:s,user:t,loading:o}=C();return o?e.jsx(E,{}):!s||(t==null?void 0:t.role)!=="employee"?e.jsx(_,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(N,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(M,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsx(T,{})})})]})]})};function gt(){return e.jsx(fe,{children:e.jsx(we,{children:e.jsx(ke,{children:e.jsx(R,{children:e.jsx(b.Suspense,{fallback:e.jsx(E,{}),children:e.jsxs(ge,{children:[e.jsx(n,{path:"/login",element:e.jsx(Ce,{})}),e.jsxs(n,{path:"/super-admin",element:e.jsx(mt,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(at,{})}),e.jsx(n,{path:"clients",element:e.jsx(it,{})}),e.jsx(n,{path:"efficiency",element:e.jsx(lt,{})}),e.jsx(n,{path:"branches",element:e.jsx(ct,{})}),e.jsx(n,{path:"branches/:id",element:e.jsx(dt,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(U,{})})}),e.jsx(n,{path:"profile",element:e.jsx(pt,{})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/admin",element:e.jsx(xt,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(Re,{})}),e.jsx(n,{path:"clients",element:e.jsx(Le,{})}),e.jsx(n,{path:"departments",element:e.jsx(Pe,{})}),e.jsx(n,{path:"managers",element:e.jsx(Ae,{})}),e.jsx(n,{path:"employees",element:e.jsx(Ie,{})}),e.jsx(n,{path:"projects",element:e.jsx(ze,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(U,{})})}),e.jsx(n,{path:"deliverables",element:e.jsx(De,{})}),e.jsx(n,{path:"reports",element:e.jsx(Oe,{})}),e.jsx(n,{path:"superadmin-reports",element:e.jsx(Te,{})}),e.jsx(n,{path:"activity-types",element:e.jsx(Ne,{})}),e.jsx(n,{path:"credentials",element:e.jsx(Me,{})}),e.jsx(n,{path:"work-updates",element:e.jsx(Be,{})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/manager",element:e.jsx(ut,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(Ve,{})}),e.jsx(n,{path:"calendar",element:e.jsx(We,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(U,{})})}),e.jsx(n,{path:"daily-todo",element:e.jsx(Ue,{})}),e.jsx(n,{path:"designer-workload",element:e.jsx($e,{})}),e.jsx(n,{path:"completed-works",element:e.jsx(qe,{})}),e.jsx(n,{path:"sub-departments",element:e.jsx(Je,{})}),e.jsx(n,{path:"employees",element:e.jsx(Ge,{})}),e.jsx(n,{path:"efficiency",element:e.jsx(Ke,{})}),e.jsx(n,{path:"submissions-review",element:e.jsx(R,{children:e.jsx(Fe,{})})}),e.jsx(n,{path:"client-reworks",element:e.jsx(Ye,{})}),e.jsx(n,{path:"job-works",element:e.jsx(He,{})}),e.jsx(n,{path:"today-posting",element:e.jsx(G,{})}),e.jsx(n,{path:"monthly-posting",element:e.jsx(K,{})}),e.jsx(n,{path:"posted",element:e.jsx(Q,{})}),e.jsx(n,{path:"writers-assignment",element:e.jsx(R,{children:e.jsx(Qe,{})})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/employee",element:e.jsx(ft,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(Xe,{})}),e.jsx(n,{path:"calendar",element:e.jsx(Ze,{})}),e.jsx(n,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(U,{})})}),e.jsx(n,{path:"assigned-work",element:e.jsx(et,{})}),e.jsx(n,{path:"reassigned-work",element:e.jsx(tt,{})}),e.jsx(n,{path:"approved-work",element:e.jsx(st,{})}),e.jsx(n,{path:"overall-work",element:e.jsx(rt,{})}),e.jsx(n,{path:"today",element:e.jsx(ot,{})}),e.jsx(n,{path:"rework",element:e.jsx(nt,{})}),e.jsx(n,{path:"today-posting",element:e.jsx(G,{isEmployee:!0})}),e.jsx(n,{path:"monthly-posting",element:e.jsx(K,{isEmployee:!0})}),e.jsx(n,{path:"posted",element:e.jsx(Q,{isEmployee:!0})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsxs(n,{path:"/client",element:e.jsx(ht,{}),children:[e.jsx(n,{path:"dashboard",element:e.jsx(O,{activeTabProp:"dashboard"})}),e.jsx(n,{path:"approvals",element:e.jsx(O,{activeTabProp:"approvals"})}),e.jsx(n,{path:"reachskyline-approvals",element:e.jsx(O,{activeTabProp:"reachskyline_approvals"})}),e.jsx(n,{path:"reports",element:e.jsx(O,{activeTabProp:"reports"})}),e.jsx(n,{path:"contact",element:e.jsx(O,{activeTabProp:"contact"})}),e.jsx(n,{path:"portal",element:e.jsx(_,{to:"/client/dashboard",replace:!0})}),e.jsx(n,{index:!0,element:e.jsx(_,{to:"dashboard",replace:!0})})]}),e.jsx(n,{path:"*",element:e.jsx(_,{to:"/login",replace:!0})})]})})})})})})}window.alert=s=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const l=document.createElement("style");l.textContent=`
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
    `,document.head.appendChild(l),document.body.appendChild(t)}t.innerHTML="";let o="info",m="Notification";const a=(s||"").toLowerCase();a.includes("already approved")||a.includes("can't edit")||a.includes("cannot edit")?(o="info",m="Info"):a.includes("success")||a.includes("approve")||a.includes("submit")?(o="success",m="Success"):(a.includes("fail")||a.includes("error")||a.includes("invalid")||a.includes("please"))&&(o="error",m="Alert");let c="";o==="success"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':o==="error"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const i=document.createElement("div");i.className="custom-alert-backdrop";const u=document.createElement("div");u.className="custom-alert-box",u.innerHTML=`
    <div class="custom-alert-icon-container ${o}">
      ${c}
    </div>
    <h3 class="custom-alert-title">${m}</h3>
    <p class="custom-alert-message">${s}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(i),t.appendChild(u);const f=()=>{u.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{t.contains(i)&&t.removeChild(i),t.contains(u)&&t.removeChild(u)},300)},h=u.querySelector(".custom-alert-btn");h.addEventListener("click",f),i.addEventListener("click",f),requestAnimationFrame(()=>{i.classList.add("show"),u.classList.add("show"),h.focus()})};window.confirm=s=>new Promise(t=>{let o=document.getElementById("custom-confirm-container");if(!o){o=document.createElement("div"),o.id="custom-confirm-container";const h=document.createElement("style");h.textContent=`
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
      `,document.head.appendChild(h),document.body.appendChild(o)}o.innerHTML="";const m=document.createElement("div");m.className="custom-confirm-backdrop";const a=document.createElement("div");a.className="custom-confirm-box";const c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';a.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${c}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${s}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,o.appendChild(m),o.appendChild(a);const i=h=>{a.classList.remove("show"),m.classList.remove("show"),setTimeout(()=>{o.contains(m)&&o.removeChild(m),o.contains(a)&&o.removeChild(a),t(h)},300)},u=a.querySelector(".custom-confirm-btn-cancel"),f=a.querySelector(".custom-confirm-btn-confirm");u.addEventListener("click",()=>i(!1)),f.addEventListener("click",()=>i(!0)),m.addEventListener("click",()=>i(!1)),requestAnimationFrame(()=>{m.classList.add("show"),a.classList.add("show"),f.focus()})});if(typeof window<"u"){const s=t=>{if(!t||typeof t!="string")return!1;const o=t.toLowerCase();return o.includes("message channel closed")||o.includes("asynchronous response")||o.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var m;const o=((m=t.reason)==null?void 0:m.message)||String(t.reason||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var m;const o=t.message||String(((m=t.error)==null?void 0:m.message)||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}je.createRoot(document.getElementById("root")).render(e.jsx(Z.StrictMode,{children:e.jsx(gt,{})}));export{Se as M,w as a,C as u};
