const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-bYtSzKT0.js","assets/vendor-react-kjOyJ9_7.js","assets/vendor-utils-DP7iOGEv.js","assets/AdminDashboard-4TQEW6-a.js","assets/ClientList-B6wUx7a1.js","assets/Table-CBZvme-L.js","assets/FormFields-CGIIRSVH.js","assets/DepartmentList-Bi4R0-BG.js","assets/ManagerList-Ddq-Fm2C.js","assets/EmployeeList-Cy16grkP.js","assets/ProjectList-CaP15K2Q.js","assets/ContentCalendarView-BPW1ZmFa.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-BF7pIMAR.js","assets/ReportDashboard-b4skjd_j.js","assets/SuperadminReports-Dkl6xq6Q.js","assets/ActivityTypeList-COCoMxAH.js","assets/LoginCredentials-C_WELGIG.js","assets/WorkUpdates-CQQIKKBa.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-D3m5XpuE.js","assets/ManagerDashboard-BLnlNqoe.js","assets/ManagerCalendar-CBRuBbKu.js","assets/ManagerDailyTodo-C5CjOXag.js","assets/DesignerWorkload-CVMbcNcx.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-CSbh7p4W.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-BPsHDzTg.js","assets/ManagerClientRework-CPWCe274.js","assets/ManagerJobWorks-DUMdc5Si.js","assets/ManagerSubDepartmentList-XxYOezCc.js","assets/ManagerEmployeeList-By0P4p-k.js","assets/ManagerEfficiency-CfIzc6gX.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-Czg252mn.js","assets/SMMMonthlyPosting-C5qOdXK6.js","assets/SMMPosted-acjwi72_.js","assets/WritersAssignment-CqNwskQP.js","assets/EmployeeDashboard-CA0-hgEu.js","assets/EmployeeCalendar-D3MvDT13.js","assets/EmployeeEventCalendar-YrfG0MDD.js","assets/EmployeeAssignedWork-Ww5Qt1pj.js","assets/EmployeeReassignedWork-Cerfq26y.js","assets/EmployeeApprovedWork-5k3sR-ef.js","assets/EmployeeTodayDeliverables-Bc8oHqra.js","assets/EmployeeRework-Bnk-agsh.js","assets/EmployeeOverallWork-CnvPx9hb.js","assets/SuperAdminDashboard-BePnKa6z.js","assets/SuperAdminClients-ChcU2G2g.js","assets/SuperAdminEfficiency-0g9f5em7.js","assets/SuperAdminBranches-Dt5nZRUM.js","assets/SuperAdminBranchDetail-CjEbBIWF.js","assets/SuperAdminProfile-BucWXsK5.js"])))=>i.map(i=>d[i]);
var Z=Object.defineProperty;var ee=(s,t,o)=>t in s?Z(s,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[t]=o;var $=(s,t,o)=>ee(s,typeof t!="symbol"?t+"":t,o);import{r as n,j as e,L as k,B as q,U as L,C as R,a as N,b as te,c as C,d as M,e as P,f as W,F as A,R as V,P as se,N as oe,g as re,A as J,h as ne,G as ae,i as ie,K as le,X as ce,S as de,k as pe,l as me,m as K,n as xe,o as ue,p as r,q as b,O as D,s as he}from"./vendor-react-kjOyJ9_7.js";import{f as fe}from"./vendor-utils-DP7iOGEv.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))p(i);new MutationObserver(i=>{for(const x of i)if(x.type==="childList")for(const a of x.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&p(a)}).observe(document,{childList:!0,subtree:!0});function o(i){const x={};return i.integrity&&(x.integrity=i.integrity),i.referrerPolicy&&(x.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?x.credentials="include":i.crossOrigin==="anonymous"?x.credentials="omit":x.credentials="same-origin",x}function p(i){if(i.ep)return;i.ep=!0;const x=o(i);fetch(i.href,x)}})();const ge="modulepreload",je=function(s){return"/"+s},Y={},d=function(t,o,p){let i=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),h=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));i=Promise.allSettled(o.map(g=>{if(g=je(g),g in Y)return;Y[g]=!0;const u=g.endsWith(".css"),c=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${c}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":ge,u||(m.as="script"),m.crossOrigin="",m.href=g,h&&m.setAttribute("nonce",h),document.head.appendChild(m),u)return new Promise((j,f)=>{m.addEventListener("load",j),m.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${g}`)))})}))}function x(a){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=a,window.dispatchEvent(h),!h.defaultPrevented)throw a}return i.then(a=>{for(const h of a||[])h.status==="rejected"&&x(h.reason);return t().catch(x)})},ye=()=>{const s="https://api.reachskyline.com/api";{const t=s.trim().replace(/\/+$/,"");return t.endsWith("/api")?t:`${t}/api`}},_=fe.create({baseURL:ye(),timeout:3e4,headers:{"Content-Type":"application/json"}});_.interceptors.request.use(s=>{const t=localStorage.getItem("erp_token");return t&&(s.headers.Authorization=`Bearer ${t}`),s},s=>Promise.reject(s));_.interceptors.response.use(s=>s,async s=>{var h,g,u;const{config:t,response:o}=s,p=((h=t==null?void 0:t.method)==null?void 0:h.toLowerCase())==="get",i=!o,x=o&&o.status>=500;if(t&&p&&(i||x)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${s.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(m=>setTimeout(m,c)),_(t)}return o&&(o.status===401||o.status===403&&(((g=o.data)==null?void 0:g.message)&&/session expired|invalid token|jwt expired/i.test(o.data.message)||((u=o.data)==null?void 0:u.errors)&&o.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))&&(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true")),Promise.reject(s)});const Q=n.createContext(null),be=({children:s})=>{const[t,o]=n.useState(()=>{try{const c=localStorage.getItem("erp_user"),m=localStorage.getItem("erp_token");return c&&m?JSON.parse(c):null}catch{return null}}),[p,i]=n.useState(!1),x=c=>{c&&(window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(m){var f,w;const j=async()=>{var l,y;try{const E=(y=(l=m.User)==null?void 0:l.PushSubscription)==null?void 0:y.id;E&&(await _.post("/notifications/subscribe",{subscriptionId:E}),console.log("[OneSignal] Subscription registered successfully:",E))}catch(E){console.error("[OneSignal] Subscription registration failed:",E.message)}};if(!window.__oneSignalInitialized)try{m.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}),window.__oneSignalInitialized=!0}catch(l){console.warn("[OneSignal] Init warning:",l.message)}j();try{(w=(f=m.User)==null?void 0:f.PushSubscription)==null||w.addEventListener("change",function(l){var y;(y=l==null?void 0:l.current)!=null&&y.optedIn&&j()})}catch{}}))};n.useEffect(()=>{(async()=>{if(!localStorage.getItem("erp_token")){o(null),i(!1);return}try{const j=await _.get("/auth/session");if(j.data&&j.data.success){const f=j.data.data.user;o(f),localStorage.setItem("erp_user",JSON.stringify(f))}else localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null)}catch(j){console.warn("Session background validation:",j.message)}finally{i(!1)}})()},[]),n.useEffect(()=>{t&&x(t)},[t]);const a=async(c,m,j)=>{try{const f=await _.post("/auth/login",{username:c,password:m},{onRetry:j});if(f.data&&f.data.success){const{token:w,user:l}=f.data.data;return localStorage.setItem("erp_token",w),localStorage.setItem("erp_user",JSON.stringify(l)),o(l),i(!1),{success:!0}}else return{success:!1,message:f.data.message||"Login failed."}}catch(f){const w=f.response&&f.response.data&&f.response.data.message?f.response.data.message:"An error occurred connecting to the server.",l=f.response&&f.response.data&&f.response.data.errors?f.response.data.errors:[];return{success:!1,message:w,errors:l}}},h=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var j,f;const m=(f=(j=c.User)==null?void 0:j.PushSubscription)==null?void 0:f.id;m&&await _.post("/notifications/unsubscribe",{subscriptionId:m})})}catch(c){console.error("[OneSignal] Unsubscribe failed on logout:",c.message)}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),o(null),i(!1)},g=c=>{o(m=>{if(!m)return null;const j={...m,...c};return localStorage.setItem("erp_user",JSON.stringify(j)),j})},u={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:p,login:a,logout:h,updateCurrentUser:g};return e.jsx(Q.Provider,{value:u,children:s})},S=()=>{const s=n.useContext(Q);return s||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},_e=n.createContext(null),ve=({children:s})=>{const[t,o]=n.useState([]),[p,i]=n.useState(0),{isAuthenticated:x}=S(),a=n.useCallback(async()=>{if(x)try{const c=await _.get("/notifications");if(c.data&&c.data.success){const m=c.data.data.notifications;o(m);const j=m.filter(f=>!f.is_read).length;i(j)}}catch(c){console.error("Error fetching notifications:",c.message)}},[x]),h=async c=>{try{await _.patch(`/notifications/${c}/read`),o(m=>m.map(j=>j.id===parseInt(c)?{...j,is_read:1}:j)),i(m=>Math.max(0,m-1))}catch(m){console.error("Failed to mark notification as read:",m.message)}},g=async()=>{try{await _.post("/notifications/read-all"),o(c=>c.map(m=>({...m,is_read:1}))),i(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};n.useEffect(()=>{if(x){a();const c=setInterval(a,3e4);return()=>clearInterval(c)}else o([]),i(0)},[x,a]);const u={notifications:t,unreadCount:p,fetchNotifications:a,markAsRead:h,markAllRead:g};return e.jsx(_e.Provider,{value:u,children:s})},O=()=>{var i,x,a,h,g;const{logout:s,user:t}=S(),o=()=>{const u=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(q,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(W,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(J,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(L,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(ne,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(R,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(R,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(N,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(ae,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&u.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(A,{size:20})}),u.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(ie,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(le,{size:20})}),u},p=(t==null?void 0:t.role)==="super_admin"?[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(k,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(q,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(L,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(R,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(N,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(te,{size:20})}]:(t==null?void 0:t.role)==="manager"?((i=t==null?void 0:t.managerProfile)==null?void 0:i.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(C,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(M,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(P,{size:20})}]:((x=t==null?void 0:t.managerProfile)==null?void 0:x.department_code)==="SEO-RS"?[]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(k,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(C,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(P,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(M,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(R,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(L,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(W,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(L,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(N,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(A,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(V,{size:20})},{label:"Job Works",path:"/manager/job-works",icon:e.jsx(A,{size:20})}]:(t==null?void 0:t.role)==="employee"?((a=t==null?void 0:t.employeeProfile)==null?void 0:a.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(C,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(M,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(P,{size:20})}]:((h=t==null?void 0:t.employeeProfile)==null?void 0:h.department_code)==="SEO-RS"?[]:((g=t==null?void 0:t.employeeProfile)==null?void 0:g.sub_department_id)===3?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(R,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(C,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(V,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(A,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(k,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(M,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(C,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(V,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(P,{size:20})}]:(t==null?void 0:t.role)==="client"?[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(k,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(P,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(A,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(N,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(se,{size:20})}]:o();return e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("img",{src:"https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns",alt:"ReachSkyline Logo"}),e.jsx("span",{children:"ReachSkyline"}),e.jsx("svg",{width:"0",height:"0",style:{position:"absolute"},children:e.jsx("defs",{children:e.jsxs("linearGradient",{id:"logo-grad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#DAA71B"}),e.jsx("stop",{offset:"100%",stopColor:"#4f46e5"})]})})})]}),e.jsx("ul",{className:"sidebar-menu",children:p.map((u,c)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(oe,{to:u.path,state:u.state,className:({isActive:m})=>`sidebar-link ${m?"active":""}`,children:[u.icon,e.jsx("span",{children:u.label})]})},c))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:s,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:u=>{u.currentTarget.style.color="#f87171"},onMouseLeave:u=>{u.currentTarget.style.color="var(--danger)"},children:[e.jsx(re,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})},we=({isOpen:s,onClose:t,title:o,children:p,footer:i=null})=>(n.useEffect(()=>(s?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[s]),s?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:x=>x.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:o}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(ce,{size:20})})]}),e.jsx("div",{className:"modal-body",children:p}),i&&e.jsx("div",{className:"modal-footer",children:i})]})}):null),T=()=>{var f,w;const{user:s,logout:t}=S(),[o,p]=n.useState(""),[i,x]=n.useState(!1),[a,h]=n.useState(null),[g,u]=n.useState(!1),c=async l=>{if(l.preventDefault(),!!o.trim()){x(!0),u(!0);try{const y=await _.get(`/search?q=${encodeURIComponent(o)}`);y.data&&y.data.success&&h(y.data.data)}catch(y){console.error("Global search error:",y.message)}finally{x(!1)}}},m=s&&s.username?s.username.slice(0,2).toUpperCase():"AD",j=()=>{var l,y,E,U;return(s==null?void 0:s.role)==="manager"?((l=s==null?void 0:s.managerProfile)==null?void 0:l.department_code)==="SMM-RS"?"SMM Manager":(y=s==null?void 0:s.managerProfile)!=null&&y.department_name?`${s.managerProfile.department_name} Manager`:"Brand Manager":(s==null?void 0:s.role)==="employee"?((E=s==null?void 0:s.employeeProfile)==null?void 0:E.department_code)==="SMM-RS"?"SMM Employee":(U=s==null?void 0:s.employeeProfile)!=null&&U.department_name?`${s.employeeProfile.department_name} Employee`:"Employee":(s==null?void 0:s.role)==="client"?"Client Partner":(s==null?void 0:s.role)==="admin"?"Administrator":(s==null?void 0:s.role)==="super_admin"?"Super Administrator":(s==null?void 0:s.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsx("form",{onSubmit:c,children:e.jsxs("div",{className:"header-search",children:[e.jsx(de,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:o,onChange:l=>p(l.target.value)})]})}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:m}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((f=s==null?void 0:s.clientProfile)==null?void 0:f.company_name)||((w=s==null?void 0:s.managerProfile)==null?void 0:w.full_name)||(s==null?void 0:s.username)||"User"}),e.jsx("span",{className:"user-role",children:j()})]})]})}),e.jsx(we,{isOpen:g,onClose:()=>{u(!1),h(null)},title:`Search Results for "${o}"`,children:i?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):a?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[a.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(pe,{size:16,className:"text-primary"})," Clients (",a.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.clients.map(l=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${l.id}`,style:{fontWeight:600},children:l.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[l.client_name," • ",l.client_id_code]})]},l.id))})]}),a.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(W,{size:16,className:"text-teal"})," Departments (",a.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.departments.map(l=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${l.id}`,style:{fontWeight:600},children:l.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:l.code})]},l.id))})]}),a.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(J,{size:16,className:"text-secondary"})," Managers (",a.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.managers.map(l=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${l.id}`,style:{fontWeight:600},children:l.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[l.manager_id_code," • ",l.department_name]})]},l.id))})]}),a.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(L,{size:16,className:"text-purple"})," Employees (",a.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.employees.map(l=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${l.id}`,style:{fontWeight:600},children:l.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[l.employee_id_code," • ",l.department_name]})]},l.id))})]}),a.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(me,{size:16,className:"text-orange"})," Projects (",a.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:a.projects.map(l=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${l.id}`,style:{fontWeight:600},children:l.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",l.client_name," • Manager: ",l.manager_name]})]},l.id))})]}),a.clients.length===0&&a.departments.length===0&&a.managers.length===0&&a.employees.length===0&&a.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',o,'".']})})]}):null})]})};class z extends K.Component{constructor(o){super(o);$(this,"handleReset",()=>{this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(o){return{hasError:!0,error:o}}componentDidCatch(o,p){console.error("ErrorBoundary caught an error:",o,p),this.setState({errorInfo:p})}render(){var o,p;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(o=this.state.error)==null?void 0:o.toString(),((p=this.state.errorInfo)==null?void 0:p.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const Ee=n.lazy(()=>d(()=>import("./Login-bYtSzKT0.js"),__vite__mapDeps([0,1,2]))),ke=n.lazy(()=>d(()=>import("./AdminDashboard-4TQEW6-a.js"),__vite__mapDeps([3,1,2]))),Se=n.lazy(()=>d(()=>import("./ClientList-B6wUx7a1.js"),__vite__mapDeps([4,1,2,5,6]))),ze=n.lazy(()=>d(()=>import("./DepartmentList-Bi4R0-BG.js"),__vite__mapDeps([7,1,2,5,6]))),Le=n.lazy(()=>d(()=>import("./ManagerList-Ddq-Fm2C.js"),__vite__mapDeps([8,1,2,5,6]))),Re=n.lazy(()=>d(()=>import("./EmployeeList-Cy16grkP.js"),__vite__mapDeps([9,1,2,5,6]))),Ce=n.lazy(()=>d(()=>import("./ProjectList-CaP15K2Q.js"),__vite__mapDeps([10,1,2,11,12,6]))),Pe=n.lazy(()=>d(()=>import("./DeliverableList-BF7pIMAR.js"),__vite__mapDeps([13,1,2,5,6]))),Ae=n.lazy(()=>d(()=>import("./ReportDashboard-b4skjd_j.js"),__vite__mapDeps([14,1,2]))),Ie=n.lazy(()=>d(()=>import("./SuperadminReports-Dkl6xq6Q.js"),__vite__mapDeps([15,1,2,5]))),De=n.lazy(()=>d(()=>import("./ActivityTypeList-COCoMxAH.js"),__vite__mapDeps([16,1,2,6]))),Oe=n.lazy(()=>d(()=>import("./LoginCredentials-C_WELGIG.js"),__vite__mapDeps([17,1,2,5]))),Te=n.lazy(()=>d(()=>import("./WorkUpdates-CQQIKKBa.js"),__vite__mapDeps([18,1,2,19]))),I=n.lazy(()=>d(()=>import("./ClientPortal-D3m5XpuE.js"),__vite__mapDeps([20,1,2]))),Ne=n.lazy(()=>d(()=>import("./ManagerDashboard-BLnlNqoe.js"),__vite__mapDeps([21,1,2]))),Me=n.lazy(()=>d(()=>import("./ManagerCalendar-CBRuBbKu.js"),__vite__mapDeps([22,1,2,11,12,6]))),Be=n.lazy(()=>d(()=>import("./ManagerDailyTodo-C5CjOXag.js"),__vite__mapDeps([23,1,2]))),Ve=n.lazy(()=>d(()=>import("./DesignerWorkload-CVMbcNcx.js"),__vite__mapDeps([24,1,2,25]))),We=n.lazy(()=>d(()=>import("./CompletedWorks-CSbh7p4W.js"),__vite__mapDeps([26,1,2,27]))),Ue=n.lazy(()=>d(()=>import("./ManagerSubmissionsReview-BPsHDzTg.js"),__vite__mapDeps([28,1,2]))),$e=n.lazy(()=>d(()=>import("./ManagerClientRework-CPWCe274.js"),__vite__mapDeps([29,1,2]))),qe=n.lazy(()=>d(()=>import("./ManagerJobWorks-DUMdc5Si.js"),__vite__mapDeps([30,1,2,5]))),Ye=n.lazy(()=>d(()=>import("./ManagerSubDepartmentList-XxYOezCc.js"),__vite__mapDeps([31,1,2]))),Fe=n.lazy(()=>d(()=>import("./ManagerEmployeeList-By0P4p-k.js"),__vite__mapDeps([32,1,2,5,33,34]))),He=n.lazy(()=>d(()=>import("./ManagerEfficiency-CfIzc6gX.js"),__vite__mapDeps([33,1,2,34]))),F=n.lazy(()=>d(()=>import("./SMMTodayPosting-Czg252mn.js"),__vite__mapDeps([35,1,2]))),H=n.lazy(()=>d(()=>import("./SMMMonthlyPosting-C5qOdXK6.js"),__vite__mapDeps([36,1,2,5]))),G=n.lazy(()=>d(()=>import("./SMMPosted-acjwi72_.js"),__vite__mapDeps([37,1,2,5]))),Ge=n.lazy(()=>d(()=>import("./WritersAssignment-CqNwskQP.js"),__vite__mapDeps([38,1,2]))),Je=n.lazy(()=>d(()=>import("./EmployeeDashboard-CA0-hgEu.js"),__vite__mapDeps([39,1,2]))),Ke=n.lazy(()=>d(()=>import("./EmployeeCalendar-D3MvDT13.js"),__vite__mapDeps([40,1,2,11,12,6]))),B=n.lazy(()=>d(()=>import("./EmployeeEventCalendar-YrfG0MDD.js"),__vite__mapDeps([41,1,2]))),Qe=n.lazy(()=>d(()=>import("./EmployeeAssignedWork-Ww5Qt1pj.js"),__vite__mapDeps([42,1,2]))),Xe=n.lazy(()=>d(()=>import("./EmployeeReassignedWork-Cerfq26y.js"),__vite__mapDeps([43,1,2]))),Ze=n.lazy(()=>d(()=>import("./EmployeeApprovedWork-5k3sR-ef.js"),__vite__mapDeps([44,1,2,5]))),et=n.lazy(()=>d(()=>import("./EmployeeTodayDeliverables-Bc8oHqra.js"),__vite__mapDeps([45,1,2]))),tt=n.lazy(()=>d(()=>import("./EmployeeRework-Bnk-agsh.js"),__vite__mapDeps([46,1,2]))),st=n.lazy(()=>d(()=>import("./EmployeeOverallWork-CnvPx9hb.js"),__vite__mapDeps([47,1,2]))),ot=n.lazy(()=>d(()=>import("./SuperAdminDashboard-BePnKa6z.js"),__vite__mapDeps([48,1,2]))),rt=n.lazy(()=>d(()=>import("./SuperAdminClients-ChcU2G2g.js"),__vite__mapDeps([49,1,2,5]))),nt=n.lazy(()=>d(()=>import("./SuperAdminEfficiency-0g9f5em7.js"),__vite__mapDeps([50,1,2,5]))),at=n.lazy(()=>d(()=>import("./SuperAdminBranches-Dt5nZRUM.js"),__vite__mapDeps([51,1,2,5]))),it=n.lazy(()=>d(()=>import("./SuperAdminBranchDetail-CjEbBIWF.js"),__vite__mapDeps([52,1,2,5]))),lt=n.lazy(()=>d(()=>import("./SuperAdminProfile-BucWXsK5.js"),__vite__mapDeps([53,1,2]))),v=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),ct=()=>{const{isAuthenticated:s,user:t,loading:o}=S();return o?e.jsx(v,{}):!s||(t==null?void 0:t.role)!=="super_admin"?e.jsx(b,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(T,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(n.Suspense,{fallback:e.jsx(v,{}),children:e.jsx(D,{})})})]})]})},dt=()=>{const{isAuthenticated:s,isAdmin:t,loading:o}=S();return o?e.jsx(v,{}):!s||!t?e.jsx(b,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(T,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(n.Suspense,{fallback:e.jsx(v,{}),children:e.jsx(D,{})})})]})]})},pt=()=>{const{isAuthenticated:s,user:t,loading:o}=S();return o?e.jsx(v,{}):!s||(t==null?void 0:t.role)!=="manager"&&(t==null?void 0:t.role)!=="admin"&&(t==null?void 0:t.role)!=="super_admin"?e.jsx(b,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(T,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(n.Suspense,{fallback:e.jsx(v,{}),children:e.jsx(D,{})})})]})]})},mt=()=>{const{isAuthenticated:s,user:t,loading:o}=S();return o?e.jsx(v,{}):!s||(t==null?void 0:t.role)!=="client"?e.jsx(b,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(T,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(n.Suspense,{fallback:e.jsx(v,{}),children:e.jsx(D,{})})})]})]})},xt=()=>{const{isAuthenticated:s,user:t,loading:o}=S();return o?e.jsx(v,{}):!s||(t==null?void 0:t.role)!=="employee"?e.jsx(b,{to:"/login",replace:!0}):e.jsxs("div",{className:"app-layout",children:[e.jsx(O,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(T,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(n.Suspense,{fallback:e.jsx(v,{}),children:e.jsx(D,{})})})]})]})};function ut(){return e.jsx(xe,{children:e.jsx(be,{children:e.jsx(ve,{children:e.jsx(z,{children:e.jsx(n.Suspense,{fallback:e.jsx(v,{}),children:e.jsxs(ue,{children:[e.jsx(r,{path:"/login",element:e.jsx(Ee,{})}),e.jsxs(r,{path:"/super-admin",element:e.jsx(ct,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(ot,{})}),e.jsx(r,{path:"clients",element:e.jsx(rt,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(nt,{})}),e.jsx(r,{path:"branches",element:e.jsx(at,{})}),e.jsx(r,{path:"branches/:id",element:e.jsx(it,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(z,{children:e.jsx(B,{})})}),e.jsx(r,{path:"profile",element:e.jsx(lt,{})}),e.jsx(r,{index:!0,element:e.jsx(b,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/admin",element:e.jsx(dt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(ke,{})}),e.jsx(r,{path:"clients",element:e.jsx(Se,{})}),e.jsx(r,{path:"departments",element:e.jsx(ze,{})}),e.jsx(r,{path:"managers",element:e.jsx(Le,{})}),e.jsx(r,{path:"employees",element:e.jsx(Re,{})}),e.jsx(r,{path:"projects",element:e.jsx(Ce,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(z,{children:e.jsx(B,{})})}),e.jsx(r,{path:"deliverables",element:e.jsx(Pe,{})}),e.jsx(r,{path:"reports",element:e.jsx(Ae,{})}),e.jsx(r,{path:"superadmin-reports",element:e.jsx(Ie,{})}),e.jsx(r,{path:"activity-types",element:e.jsx(De,{})}),e.jsx(r,{path:"credentials",element:e.jsx(Oe,{})}),e.jsx(r,{path:"work-updates",element:e.jsx(Te,{})}),e.jsx(r,{index:!0,element:e.jsx(b,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/manager",element:e.jsx(pt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Ne,{})}),e.jsx(r,{path:"calendar",element:e.jsx(Me,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(z,{children:e.jsx(B,{})})}),e.jsx(r,{path:"daily-todo",element:e.jsx(Be,{})}),e.jsx(r,{path:"designer-workload",element:e.jsx(Ve,{})}),e.jsx(r,{path:"completed-works",element:e.jsx(We,{})}),e.jsx(r,{path:"sub-departments",element:e.jsx(Ye,{})}),e.jsx(r,{path:"employees",element:e.jsx(Fe,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(He,{})}),e.jsx(r,{path:"submissions-review",element:e.jsx(z,{children:e.jsx(Ue,{})})}),e.jsx(r,{path:"client-reworks",element:e.jsx($e,{})}),e.jsx(r,{path:"job-works",element:e.jsx(qe,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(F,{})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(H,{})}),e.jsx(r,{path:"posted",element:e.jsx(G,{})}),e.jsx(r,{path:"writers-assignment",element:e.jsx(z,{children:e.jsx(Ge,{})})}),e.jsx(r,{index:!0,element:e.jsx(b,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/employee",element:e.jsx(xt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Je,{})}),e.jsx(r,{path:"calendar",element:e.jsx(Ke,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(z,{children:e.jsx(B,{})})}),e.jsx(r,{path:"assigned-work",element:e.jsx(Qe,{})}),e.jsx(r,{path:"reassigned-work",element:e.jsx(Xe,{})}),e.jsx(r,{path:"approved-work",element:e.jsx(Ze,{})}),e.jsx(r,{path:"overall-work",element:e.jsx(st,{})}),e.jsx(r,{path:"today",element:e.jsx(et,{})}),e.jsx(r,{path:"rework",element:e.jsx(tt,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(F,{isEmployee:!0})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(H,{isEmployee:!0})}),e.jsx(r,{path:"posted",element:e.jsx(G,{isEmployee:!0})}),e.jsx(r,{index:!0,element:e.jsx(b,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/client",element:e.jsx(mt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(I,{activeTabProp:"dashboard"})}),e.jsx(r,{path:"approvals",element:e.jsx(I,{activeTabProp:"approvals"})}),e.jsx(r,{path:"reachskyline-approvals",element:e.jsx(I,{activeTabProp:"reachskyline_approvals"})}),e.jsx(r,{path:"reports",element:e.jsx(I,{activeTabProp:"reports"})}),e.jsx(r,{path:"contact",element:e.jsx(I,{activeTabProp:"contact"})}),e.jsx(r,{path:"portal",element:e.jsx(b,{to:"/client/dashboard",replace:!0})}),e.jsx(r,{index:!0,element:e.jsx(b,{to:"dashboard",replace:!0})})]}),e.jsx(r,{path:"*",element:e.jsx(b,{to:"/login",replace:!0})})]})})})})})})}window.alert=s=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let o="info",p="Notification";const i=(s||"").toLowerCase();i.includes("already approved")||i.includes("can't edit")||i.includes("cannot edit")?(o="info",p="Info"):i.includes("success")||i.includes("approve")||i.includes("submit")?(o="success",p="Success"):(i.includes("fail")||i.includes("error")||i.includes("invalid")||i.includes("please"))&&(o="error",p="Alert");let x="";o==="success"?x='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':o==="error"?x='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':x='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const a=document.createElement("div");a.className="custom-alert-backdrop";const h=document.createElement("div");h.className="custom-alert-box",h.innerHTML=`
    <div class="custom-alert-icon-container ${o}">
      ${x}
    </div>
    <h3 class="custom-alert-title">${p}</h3>
    <p class="custom-alert-message">${s}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(a),t.appendChild(h);const g=()=>{h.classList.remove("show"),a.classList.remove("show"),setTimeout(()=>{t.contains(a)&&t.removeChild(a),t.contains(h)&&t.removeChild(h)},300)},u=h.querySelector(".custom-alert-btn");u.addEventListener("click",g),a.addEventListener("click",g),requestAnimationFrame(()=>{a.classList.add("show"),h.classList.add("show"),u.focus()})};window.confirm=s=>new Promise(t=>{let o=document.getElementById("custom-confirm-container");if(!o){o=document.createElement("div"),o.id="custom-confirm-container";const u=document.createElement("style");u.textContent=`
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
      `,document.head.appendChild(u),document.body.appendChild(o)}o.innerHTML="";const p=document.createElement("div");p.className="custom-confirm-backdrop";const i=document.createElement("div");i.className="custom-confirm-box";const x='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';i.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${x}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${s}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,o.appendChild(p),o.appendChild(i);const a=u=>{i.classList.remove("show"),p.classList.remove("show"),setTimeout(()=>{o.contains(p)&&o.removeChild(p),o.contains(i)&&o.removeChild(i),t(u)},300)},h=i.querySelector(".custom-confirm-btn-cancel"),g=i.querySelector(".custom-confirm-btn-confirm");h.addEventListener("click",()=>a(!1)),g.addEventListener("click",()=>a(!0)),p.addEventListener("click",()=>a(!1)),requestAnimationFrame(()=>{p.classList.add("show"),i.classList.add("show"),g.focus()})});if(typeof window<"u"){const s=t=>{if(!t||typeof t!="string")return!1;const o=t.toLowerCase();return o.includes("message channel closed")||o.includes("asynchronous response")||o.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var p;const o=((p=t.reason)==null?void 0:p.message)||String(t.reason||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var p;const o=t.message||String(((p=t.error)==null?void 0:p.message)||"");s(o)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}he.createRoot(document.getElementById("root")).render(e.jsx(K.StrictMode,{children:e.jsx(ut,{})}));export{we as M,_ as a,S as u};
