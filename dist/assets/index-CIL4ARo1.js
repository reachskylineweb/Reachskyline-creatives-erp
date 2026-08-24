const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-DUiOVbMj.js","assets/vendor-react-Cy653LfT.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-RQLBQlTb.js","assets/ClientList-Dn1i9mS1.js","assets/Table-DewUDxHh.js","assets/FormFields-DEm8TLqC.js","assets/DepartmentList-DfGWi6YE.js","assets/ManagerList-VQOZ_K8i.js","assets/EmployeeList-CzSxCgcR.js","assets/ProjectList-K8F_zegi.js","assets/ContentCalendarView-CAydq5SL.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-BwYunRh8.js","assets/ReportDashboard-Br4uGOxh.js","assets/SuperadminReports-BY010WB4.js","assets/ActivityTypeList-sDXhlxhA.js","assets/LoginCredentials-DFGy__YQ.js","assets/WorkUpdates-GTdMb3Wd.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-D7E1aGKk.js","assets/ManagerDashboard-DviLPius.js","assets/ManagerCalendar-CP4Q98ef.js","assets/ManagerDailyTodo-DKTRLweC.js","assets/DesignerWorkload-COxREgZT.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-ZbmU4DVo.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-hTTQyu8g.js","assets/ManagerClientRework-y490bsDq.js","assets/ManagerJobWorks-C0UvxSaJ.js","assets/ManagerSubDepartmentList-BzpeHn7B.js","assets/ManagerEmployeeList-DGx0udBk.js","assets/ManagerEfficiency-4d3OHpMA.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-AtipUg1W.js","assets/SMMMonthlyPosting-CDbw5kg7.js","assets/SMMPosted-cYnwsXj_.js","assets/WritersAssignment-BnaVxlvy.js","assets/EmployeeDashboard-DVKOaVp5.js","assets/EmployeeCalendar-BwFuo4wl.js","assets/EmployeeEventCalendar-C-x_bsNf.js","assets/EmployeeAssignedWork-CaLZQVls.js","assets/EmployeeReassignedWork-DyVCPEvi.js","assets/EmployeeApprovedWork-AbWBPnrW.js","assets/EmployeeTodayDeliverables-3k3_QWsV.js","assets/EmployeeRework-FJd1G8sy.js","assets/EmployeeOverallWork-BF4Eg--n.js","assets/SuperAdminDashboard-D3rpPguB.js","assets/SuperAdminClients-Dj6Y05D4.js","assets/SuperAdminEfficiency-DAtHrOqN.js","assets/SuperAdminBranches-CrrZrSWM.js","assets/SuperAdminBranchDetail-Ctb_EF80.js","assets/SuperAdminProfile-BuXH2g6t.js"])))=>i.map(i=>d[i]);
var se=Object.defineProperty;var ne=(l,t,s)=>t in l?se(l,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[t]=s;var U=(l,t,s)=>ne(l,typeof t!="symbol"?t+"":t,s);import{r as _,j as e,N as oe,L as re,a as S,C as P,F as A,B,P as ae,b as H,U as R,c as I,d as ie,e as z,f as V,g as q,R as $,h as le,K as ce,A as X,i as de,G as pe,X as me,S as ue,k as xe,l as he,m as Z,n as fe,o as ge,p as r,q as w,O as T,s as je}from"./vendor-react-Cy653LfT.js";import{f as be}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}})();const _e="modulepreload",ye=function(l){return"/"+l},J={},p=function(t,s,i){let n=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),h=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(s.map(g=>{if(g=ye(g),g in J)return;J[g]=!0;const j=g.endsWith(".css"),d=j?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${d}`))return;const x=document.createElement("link");if(x.rel=j?"stylesheet":_e,j||(x.as="script"),x.crossOrigin="",x.href=g,h&&x.setAttribute("nonce",h),document.head.appendChild(x),j)return new Promise((o,f)=>{x.addEventListener("load",o),x.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${g}`)))})}))}function c(a){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=a,window.dispatchEvent(h),!h.defaultPrevented)throw a}return n.then(a=>{for(const h of a||[])h.status==="rejected"&&c(h.reason);return t().catch(c)})},ve=()=>{const l="https://api.reachskyline.com/api";{const t=l.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},E=be.create({baseURL:ve(),timeout:3e4,headers:{"Content-Type":"application/json"}});E.interceptors.request.use(l=>{const t=localStorage.getItem("erp_token");return t&&(l.headers.Authorization=`Bearer ${t}`),l},l=>Promise.reject(l));E.interceptors.response.use(l=>l,async l=>{var h,g,j;const{config:t,response:s}=l,i=((h=t==null?void 0:t.method)==null?void 0:h.toLowerCase())==="get",n=!s,c=s&&s.status>=500;if(t&&i&&(n||c)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const d=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,d),console.warn(`API call failed: ${l.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${d}ms...`),await new Promise(x=>setTimeout(x,d)),E(t)}if(s&&(s.status===401||s.status===403&&(((g=s.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((j=s.data)==null?void 0:j.errors)&&s.data.errors.some(d=>/jwt expired|invalid signature|jwt malformed/i.test(String(d)))))){const d=localStorage.getItem("erp_user");d&&(d.includes('"role":"client"')||d.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(l)});const ee=_.createContext(null),we=({children:l})=>{const[t,s]=_.useState(()=>{try{const d=localStorage.getItem("erp_user");return d?JSON.parse(d):null}catch{return null}}),[i,n]=_.useState(!1),c=d=>{if(d)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(x){var f,y;const o=async()=>{var b,u;try{const v=(u=(b=x.User)==null?void 0:b.PushSubscription)==null?void 0:u.id;v&&await E.post("/notifications/subscribe",{subscriptionId:v}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{x.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(b=>{console.warn("[OneSignal] Domain initialization deferred:",(b==null?void 0:b.message)||b)}),window.__oneSignalInitialized=!0}catch(b){console.warn("[OneSignal] Init warning:",b.message)}o();try{(y=(f=x.User)==null?void 0:f.PushSubscription)==null||y.addEventListener("change",function(b){var u;(u=b==null?void 0:b.current)!=null&&u.optedIn&&o()})}catch{}})}catch{}};_.useEffect(()=>{(async()=>{const x=localStorage.getItem("erp_token"),o=localStorage.getItem("erp_user");let f=null;try{f=o?JSON.parse(o):null}catch{}if(!x){if(f&&f.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(f),n(!1);return}s(null),n(!1);return}try{const y=await E.get("/auth/session");if(y.data&&y.data.success){const b=y.data.data.user;s(b),localStorage.setItem("erp_user",JSON.stringify(b))}else f&&f.role==="client"?s(f):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{f&&f.role==="client"&&s(f)}finally{n(!1)}})()},[]),_.useEffect(()=>{t&&c(t)},[t]);const a=async(d,x,o)=>{try{const f=await E.post("/auth/login",{username:d,password:x},{onRetry:o});if(f.data&&f.data.success){const{token:y,user:b}=f.data.data;return localStorage.setItem("erp_token",y||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(b)),s(b),n(!1),{success:!0}}}catch(f){const y=f.response&&f.response.data&&f.response.data.message?f.response.data.message:"Wrong credentials! Invalid username or password.",b=f.response&&f.response.data&&f.response.data.errors?f.response.data.errors:[];return{success:!1,message:y,errors:b}}},h=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(d){var x,o;try{const f=(o=(x=d.User)==null?void 0:x.PushSubscription)==null?void 0:o.id;f&&await E.post("/notifications/unsubscribe",{subscriptionId:f}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),n(!1)},g=d=>{s(x=>{if(!x)return null;const o={...x,...d};return localStorage.setItem("erp_user",JSON.stringify(o)),o})},j={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:i,login:a,logout:h,updateCurrentUser:g};return e.jsx(ee.Provider,{value:j,children:l})},C=()=>{const l=_.useContext(ee);return l||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Ee=_.createContext(null),ke=({children:l})=>{const[t,s]=_.useState([]),[i,n]=_.useState(0),{isAuthenticated:c}=C(),a=_.useCallback(async()=>{if(c)try{const d=await E.get("/notifications");if(d.data&&d.data.success){const x=d.data.data.notifications;s(x);const o=x.filter(f=>!f.is_read).length;n(o)}}catch{}},[c]),h=async d=>{try{await E.patch(`/notifications/${d}/read`),s(x=>x.map(o=>o.id===parseInt(d)?{...o,is_read:1}:o)),n(x=>Math.max(0,x-1))}catch(x){console.error("Failed to mark notification as read:",x.message)}},g=async()=>{try{await E.post("/notifications/read-all"),s(d=>d.map(x=>({...x,is_read:1}))),n(0)}catch(d){console.error("Failed to mark all notifications as read:",d.message)}};_.useEffect(()=>{if(c){a();const d=setInterval(a,3e4);return()=>clearInterval(d)}else s([]),n(0)},[c,a]);const j={notifications:t,unreadCount:i,fetchNotifications:a,markAsRead:h,markAllRead:g};return e.jsx(Ee.Provider,{value:j,children:l})},O=()=>{const{logout:l,user:t}=C(),s=()=>{const c=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(H,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(q,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(X,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(R,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(de,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(I,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(I,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(B,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(pe,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&c.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(A,{size:20})}),c.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(le,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(ce,{size:20})}),c},n=(()=>{var h,g,j;const c=window.location.pathname.startsWith("/client");return(t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||c?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(S,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(P,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(A,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(B,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(ae,{size:20})}]:(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(S,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(H,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(R,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(I,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(B,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(ie,{size:20})}]:(t==null?void 0:t.role)==="manager"?((h=t==null?void 0:t.managerProfile)==null?void 0:h.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(R,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(z,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(V,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(P,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(S,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(z,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(P,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(V,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(I,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(R,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(q,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(R,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(B,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(A,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx($,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(A,{size:20})}]:(t==null?void 0:t.role)==="employee"?((g=t==null?void 0:t.employeeProfile)==null?void 0:g.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(z,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(V,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(P,{size:20})}]:((j=t==null?void 0:t.employeeProfile)==null?void 0:j.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(I,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(z,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx($,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(A,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(S,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(V,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(z,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx($,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(P,{size:20})}]:s()})();return e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:n.map((c,a)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(oe,{to:c.path,state:c.state,className:({isActive:h})=>`sidebar-link ${h?"active":""}`,children:[c.icon,e.jsx("span",{children:c.label})]})},a))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:l,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:c=>{c.currentTarget.style.color="#f87171"},onMouseLeave:c=>{c.currentTarget.style.color="var(--danger)"},children:[e.jsx(re,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})},Se=({isOpen:l,onClose:t,title:s,children:i,footer:n=null})=>(_.useEffect(()=>(l?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[l]),l?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:c=>c.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(me,{size:20})})]}),e.jsx("div",{className:"modal-body",children:i}),n&&e.jsx("div",{className:"modal-footer",children:n})]})}):null),N=()=>{var b;const{user:l,logout:t}=C(),[s,i]=_.useState(""),[n,c]=_.useState(!1),[a,h]=_.useState(null),[g,j]=_.useState(!1),d=async u=>{if(u.preventDefault(),!!s.trim()){c(!0),j(!0);try{const v=await E.get(`/search?q=${encodeURIComponent(s)}`);v.data&&v.data.success&&h(v.data.data)}catch(v){console.error("Global search error:",v.message)}finally{c(!1)}}},x=window.location.pathname.startsWith("/client"),o=x?l&&(l.role==="client"||l.user_type==="client")?l:{username:"gem",full_name:"rajesh kumar",role:"client"}:l,f=o&&o.username?o.username.slice(0,2).toUpperCase():"CL",y=()=>{var u,v,F,Y;return x||(o==null?void 0:o.role)==="client"?"Client Partner":(o==null?void 0:o.role)==="manager"?((u=o==null?void 0:o.managerProfile)==null?void 0:u.department_code)==="SMM-RS"?"SMM Manager":(v=o==null?void 0:o.managerProfile)!=null&&v.department_name?`${o.managerProfile.department_name} Manager`:"Brand Manager":(o==null?void 0:o.role)==="employee"?((F=o==null?void 0:o.employeeProfile)==null?void 0:F.department_code)==="SMM-RS"?"SMM Employee":(Y=o==null?void 0:o.employeeProfile)!=null&&Y.department_name?`${o.employeeProfile.department_name} Employee`:"Employee":(o==null?void 0:o.role)==="admin"?"Administrator":(o==null?void 0:o.role)==="super_admin"?"Super Administrator":(o==null?void 0:o.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsx("form",{onSubmit:d,children:e.jsxs("div",{className:"header-search",children:[e.jsx(ue,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:s,onChange:u=>i(u.target.value)})]})}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:f}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((b=o==null?void 0:o.clientProfile)==null?void 0:b.company_name)||(o==null?void 0:o.full_name)||(o==null?void 0:o.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:y()})]})]})}),e.jsx(Se,{isOpen:g,onClose:()=>{j(!1),h(null)},title:`Search Results for "${s}"`,children:n?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):a?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[a.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(xe,{size:16,className:"text-primary"})," Clients (",a.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.clients.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${u.id}`,style:{fontWeight:600},children:u.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[u.client_name," • ",u.client_id_code]})]},u.id))})]}),a.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(q,{size:16,className:"text-teal"})," Departments (",a.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.departments.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${u.id}`,style:{fontWeight:600},children:u.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:u.code})]},u.id))})]}),a.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(X,{size:16,className:"text-secondary"})," Managers (",a.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.managers.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${u.id}`,style:{fontWeight:600},children:u.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[u.manager_id_code," • ",u.department_name]})]},u.id))})]}),a.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(R,{size:16,className:"text-purple"})," Employees (",a.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.employees.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${u.id}`,style:{fontWeight:600},children:u.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[u.employee_id_code," • ",u.department_name]})]},u.id))})]}),a.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(he,{size:16,className:"text-orange"})," Projects (",a.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.projects.map(u=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${u.id}`,style:{fontWeight:600},children:u.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",u.client_name," • Manager: ",u.manager_name]})]},u.id))})]}),a.clients.length===0&&a.departments.length===0&&a.managers.length===0&&a.employees.length===0&&a.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',s,'".']})})]}):null})]})};class L extends Z.Component{constructor(s){super(s);U(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,i){var c,a,h;if(console.error("ErrorBoundary caught an error:",s,i),this.setState({errorInfo:i}),s&&(s.name==="ChunkLoadError"||((c=s.message)==null?void 0:c.includes("Failed to fetch dynamically imported module"))||((a=s.message)==null?void 0:a.includes("Importing a module script failed"))||((h=s.message)==null?void 0:h.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,i;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((i=this.state.errorInfo)==null?void 0:i.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const m=l=>_.lazy(()=>l().catch(t=>{var i,n,c;throw t&&(t.name==="ChunkLoadError"||((i=t.message)==null?void 0:i.includes("Failed to fetch dynamically imported module"))||((n=t.message)==null?void 0:n.includes("Importing a module script failed"))||((c=t.message)==null?void 0:c.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Ce=m(()=>p(()=>import("./Login-DUiOVbMj.js"),__vite__mapDeps([0,1,2]))),Le=m(()=>p(()=>import("./AdminDashboard-RQLBQlTb.js"),__vite__mapDeps([3,1,2]))),Re=m(()=>p(()=>import("./ClientList-Dn1i9mS1.js"),__vite__mapDeps([4,1,2,5,6]))),Pe=m(()=>p(()=>import("./DepartmentList-DfGWi6YE.js"),__vite__mapDeps([7,1,2,5,6]))),Ae=m(()=>p(()=>import("./ManagerList-VQOZ_K8i.js"),__vite__mapDeps([8,1,2,5,6]))),Ie=m(()=>p(()=>import("./EmployeeList-CzSxCgcR.js"),__vite__mapDeps([9,1,2,5,6]))),ze=m(()=>p(()=>import("./ProjectList-K8F_zegi.js"),__vite__mapDeps([10,1,2,11,12,6]))),De=m(()=>p(()=>import("./DeliverableList-BwYunRh8.js"),__vite__mapDeps([13,1,2,5,6]))),Te=m(()=>p(()=>import("./ReportDashboard-Br4uGOxh.js"),__vite__mapDeps([14,1,2]))),Oe=m(()=>p(()=>import("./SuperadminReports-BY010WB4.js"),__vite__mapDeps([15,1,2,5]))),Ne=m(()=>p(()=>import("./ActivityTypeList-sDXhlxhA.js"),__vite__mapDeps([16,1,2,6]))),Me=m(()=>p(()=>import("./LoginCredentials-DFGy__YQ.js"),__vite__mapDeps([17,1,2,5]))),Be=m(()=>p(()=>import("./WorkUpdates-GTdMb3Wd.js"),__vite__mapDeps([18,1,2,19]))),D=m(()=>p(()=>import("./ClientPortal-D7E1aGKk.js"),__vite__mapDeps([20,1,2]))),Ve=m(()=>p(()=>import("./ManagerDashboard-DviLPius.js"),__vite__mapDeps([21,1,2]))),We=m(()=>p(()=>import("./ManagerCalendar-CP4Q98ef.js"),__vite__mapDeps([22,1,2,11,12,6]))),$e=m(()=>p(()=>import("./ManagerDailyTodo-DKTRLweC.js"),__vite__mapDeps([23,1,2]))),qe=m(()=>p(()=>import("./DesignerWorkload-COxREgZT.js"),__vite__mapDeps([24,1,2,25]))),Fe=m(()=>p(()=>import("./CompletedWorks-ZbmU4DVo.js"),__vite__mapDeps([26,1,2,27]))),Ye=m(()=>p(()=>import("./ManagerSubmissionsReview-hTTQyu8g.js"),__vite__mapDeps([28,1,2]))),Ue=m(()=>p(()=>import("./ManagerClientRework-y490bsDq.js"),__vite__mapDeps([29,1,2]))),He=m(()=>p(()=>import("./ManagerJobWorks-C0UvxSaJ.js"),__vite__mapDeps([30,1,2,5]))),Je=m(()=>p(()=>import("./ManagerSubDepartmentList-BzpeHn7B.js"),__vite__mapDeps([31,1,2]))),Ge=m(()=>p(()=>import("./ManagerEmployeeList-DGx0udBk.js"),__vite__mapDeps([32,1,2,5,33,34]))),Ke=m(()=>p(()=>import("./ManagerEfficiency-4d3OHpMA.js"),__vite__mapDeps([33,1,2,34]))),G=m(()=>p(()=>import("./SMMTodayPosting-AtipUg1W.js"),__vite__mapDeps([35,1,2]))),K=m(()=>p(()=>import("./SMMMonthlyPosting-CDbw5kg7.js"),__vite__mapDeps([36,1,2,5]))),Q=m(()=>p(()=>import("./SMMPosted-cYnwsXj_.js"),__vite__mapDeps([37,1,2,5]))),Qe=m(()=>p(()=>import("./WritersAssignment-BnaVxlvy.js"),__vite__mapDeps([38,1,2]))),Xe=m(()=>p(()=>import("./EmployeeDashboard-DVKOaVp5.js"),__vite__mapDeps([39,1,2]))),Ze=m(()=>p(()=>import("./EmployeeCalendar-BwFuo4wl.js"),__vite__mapDeps([40,1,2,11,12,6]))),W=m(()=>p(()=>import("./EmployeeEventCalendar-C-x_bsNf.js"),__vite__mapDeps([41,1,2]))),et=m(()=>p(()=>import("./EmployeeAssignedWork-CaLZQVls.js"),__vite__mapDeps([42,1,2]))),tt=m(()=>p(()=>import("./EmployeeReassignedWork-DyVCPEvi.js"),__vite__mapDeps([43,1,2]))),st=m(()=>p(()=>import("./EmployeeApprovedWork-AbWBPnrW.js"),__vite__mapDeps([44,1,2,5]))),nt=m(()=>p(()=>import("./EmployeeTodayDeliverables-3k3_QWsV.js"),__vite__mapDeps([45,1,2]))),ot=m(()=>p(()=>import("./EmployeeRework-FJd1G8sy.js"),__vite__mapDeps([46,1,2]))),rt=m(()=>p(()=>import("./EmployeeOverallWork-BF4Eg--n.js"),__vite__mapDeps([47,1,2]))),at=m(()=>p(()=>import("./SuperAdminDashboard-D3rpPguB.js"),__vite__mapDeps([48,1,2]))),it=m(()=>p(()=>import("./SuperAdminClients-Dj6Y05D4.js"),__vite__mapDeps([49,1,2,5]))),lt=m(()=>p(()=>import("./SuperAdminEfficiency-DAtHrOqN.js"),__vite__mapDeps([50,1,2,5]))),ct=m(()=>p(()=>import("./SuperAdminBranches-CrrZrSWM.js"),__vite__mapDeps([51,1,2,5]))),dt=m(()=>p(()=>import("./SuperAdminBranchDetail-Ctb_EF80.js"),__vite__mapDeps([52,1,2,5]))),pt=m(()=>p(()=>import("./SuperAdminProfile-BuXH2g6t.js"),__vite__mapDeps([53,1,2]))),k=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),M=()=>{try{const l=localStorage.getItem("erp_user");return l?JSON.parse(l):null}catch{return null}},mt=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||M();return s?e.jsx(k,{}):!i||i.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},ut=()=>{const{isAuthenticated:l,user:t,isAdmin:s,loading:i}=C(),n=t||M(),c=s||n&&(n.role==="admin"||n.role==="super_admin");return i?e.jsx(k,{}):!n||!c?e.jsx(w,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},xt=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||M();return s?e.jsx(k,{}):!i||i.role!=="manager"&&i.role!=="admin"&&i.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})},ht=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||M(),n=((i==null?void 0:i.username)||"").trim().toLowerCase(),c=i&&(i.role==="client"||i.user_type==="client"||n==="gem"||n==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(k,{}):c?e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]}):e.jsx(w,{to:"/login",replace:!0})},ft=()=>{const{isAuthenticated:l,user:t,loading:s}=C(),i=t||M();return s?e.jsx(k,{}):!i||i.role!=="employee"?e.jsx(w,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(N,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsx(T,{})})})]})]})};function gt(){return e.jsx(fe,{children:e.jsx(we,{children:e.jsx(ke,{children:e.jsx(L,{children:e.jsx(_.Suspense,{fallback:e.jsx(k,{}),children:e.jsxs(ge,{children:[e.jsx(r,{path:"/login",element:e.jsx(Ce,{})}),e.jsxs(r,{path:"/super-admin",element:e.jsx(mt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(at,{})}),e.jsx(r,{path:"clients",element:e.jsx(it,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(lt,{})}),e.jsx(r,{path:"branches",element:e.jsx(ct,{})}),e.jsx(r,{path:"branches/:id",element:e.jsx(dt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx(W,{})})}),e.jsx(r,{path:"profile",element:e.jsx(pt,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/admin",element:e.jsx(ut,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Le,{})}),e.jsx(r,{path:"clients",element:e.jsx(Re,{})}),e.jsx(r,{path:"departments",element:e.jsx(Pe,{})}),e.jsx(r,{path:"managers",element:e.jsx(Ae,{})}),e.jsx(r,{path:"employees",element:e.jsx(Ie,{})}),e.jsx(r,{path:"projects",element:e.jsx(ze,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx(W,{})})}),e.jsx(r,{path:"deliverables",element:e.jsx(De,{})}),e.jsx(r,{path:"reports",element:e.jsx(Te,{})}),e.jsx(r,{path:"superadmin-reports",element:e.jsx(Oe,{})}),e.jsx(r,{path:"activity-types",element:e.jsx(Ne,{})}),e.jsx(r,{path:"credentials",element:e.jsx(Me,{})}),e.jsx(r,{path:"work-updates",element:e.jsx(Be,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/manager",element:e.jsx(xt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Ve,{})}),e.jsx(r,{path:"calendar",element:e.jsx(We,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx(W,{})})}),e.jsx(r,{path:"daily-todo",element:e.jsx($e,{})}),e.jsx(r,{path:"designer-workload",element:e.jsx(qe,{})}),e.jsx(r,{path:"completed-works",element:e.jsx(Fe,{})}),e.jsx(r,{path:"sub-departments",element:e.jsx(Je,{})}),e.jsx(r,{path:"employees",element:e.jsx(Ge,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(Ke,{})}),e.jsx(r,{path:"submissions-review",element:e.jsx(L,{children:e.jsx(Ye,{})})}),e.jsx(r,{path:"client-reworks",element:e.jsx(Ue,{})}),e.jsx(r,{path:"job-works",element:e.jsx(He,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(G,{})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(K,{})}),e.jsx(r,{path:"posted",element:e.jsx(Q,{})}),e.jsx(r,{path:"writers-assignment",element:e.jsx(L,{children:e.jsx(Qe,{})})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/employee",element:e.jsx(ft,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Xe,{})}),e.jsx(r,{path:"calendar",element:e.jsx(Ze,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(L,{children:e.jsx(W,{})})}),e.jsx(r,{path:"assigned-work",element:e.jsx(et,{})}),e.jsx(r,{path:"reassigned-work",element:e.jsx(tt,{})}),e.jsx(r,{path:"approved-work",element:e.jsx(st,{})}),e.jsx(r,{path:"overall-work",element:e.jsx(rt,{})}),e.jsx(r,{path:"today",element:e.jsx(nt,{})}),e.jsx(r,{path:"rework",element:e.jsx(ot,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(G,{isEmployee:!0})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(K,{isEmployee:!0})}),e.jsx(r,{path:"posted",element:e.jsx(Q,{isEmployee:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/client",element:e.jsx(ht,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(D,{activeTabProp:"dashboard"})}),e.jsx(r,{path:"approvals",element:e.jsx(D,{activeTabProp:"approvals"})}),e.jsx(r,{path:"reachskyline-approvals",element:e.jsx(D,{activeTabProp:"reachskyline_approvals"})}),e.jsx(r,{path:"reports",element:e.jsx(D,{activeTabProp:"reports"})}),e.jsx(r,{path:"contact",element:e.jsx(D,{activeTabProp:"contact"})}),e.jsx(r,{path:"portal",element:e.jsx(w,{to:"/client/dashboard",replace:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsx(r,{path:"*",element:e.jsx(w,{to:"/login",replace:!0})})]})})})})})})}window.alert=l=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const d=document.createElement("style");d.textContent=`
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
    `,document.head.appendChild(d),document.body.appendChild(t)}t.innerHTML="";let s="info",i="Notification";const n=(l||"").toLowerCase();n.includes("already approved")||n.includes("can't edit")||n.includes("cannot edit")?(s="info",i="Info"):n.includes("success")||n.includes("approve")||n.includes("submit")?(s="success",i="Success"):(n.includes("fail")||n.includes("error")||n.includes("invalid")||n.includes("please"))&&(s="error",i="Alert");let c="";s==="success"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const a=document.createElement("div");a.className="custom-alert-backdrop";const h=document.createElement("div");h.className="custom-alert-box",h.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${c}
    </div>
    <h3 class="custom-alert-title">${i}</h3>
    <p class="custom-alert-message">${l}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(a),t.appendChild(h);const g=()=>{h.classList.remove("show"),a.classList.remove("show"),setTimeout(()=>{t.contains(a)&&t.removeChild(a),t.contains(h)&&t.removeChild(h)},300)},j=h.querySelector(".custom-alert-btn");j.addEventListener("click",g),a.addEventListener("click",g),requestAnimationFrame(()=>{a.classList.add("show"),h.classList.add("show"),j.focus()})};window.confirm=l=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const j=document.createElement("style");j.textContent=`
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
      `,document.head.appendChild(j),document.body.appendChild(s)}s.innerHTML="";const i=document.createElement("div");i.className="custom-confirm-backdrop";const n=document.createElement("div");n.className="custom-confirm-box";const c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';n.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${c}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${l}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(i),s.appendChild(n);const a=j=>{n.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{s.contains(i)&&s.removeChild(i),s.contains(n)&&s.removeChild(n),t(j)},300)},h=n.querySelector(".custom-confirm-btn-cancel"),g=n.querySelector(".custom-confirm-btn-confirm");h.addEventListener("click",()=>a(!1)),g.addEventListener("click",()=>a(!0)),i.addEventListener("click",()=>a(!1)),requestAnimationFrame(()=>{i.classList.add("show"),n.classList.add("show"),g.focus()})});if(typeof window<"u"){const l=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var i;const s=((i=t.reason)==null?void 0:i.message)||String(t.reason||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var i;const s=t.message||String(((i=t.error)==null?void 0:i.message)||"");l(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}je.createRoot(document.getElementById("root")).render(e.jsx(Z.StrictMode,{children:e.jsx(gt,{})}));export{Se as M,E as a,C as u};
