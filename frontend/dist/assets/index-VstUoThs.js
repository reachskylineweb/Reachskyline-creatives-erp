const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-Dqp0GZQo.js","assets/vendor-react-DPKYyjIX.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-Bl2ZnMpD.js","assets/ClientList-CkvXxUF9.js","assets/Table-B1r331yr.js","assets/FormFields-CJS6Lgio.js","assets/DepartmentList-iFET1GnL.js","assets/ManagerList-BujFOHg_.js","assets/EmployeeList-Bx_qJMKa.js","assets/ProjectList-D1tfteS9.js","assets/ContentCalendarView-DxPDR8gA.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-GgEqPjWP.js","assets/ReportDashboard-BGgYqqXu.js","assets/SuperadminReports-FTtuP7MR.js","assets/ActivityTypeList-BrJii4dP.js","assets/LoginCredentials-BDlFh6tO.js","assets/WorkUpdates-DItDixnw.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-HKvEBG9q.js","assets/ManagerDashboard-nRERNTtX.js","assets/ManagerCalendar-CsSdrxtL.js","assets/ManagerDailyTodo-BjbIRvY1.js","assets/DesignerWorkload-DzvxFtDG.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-CA0f5Awj.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-CwPF9MEz.js","assets/ManagerClientRework-mBOcDaNw.js","assets/ManagerJobWorks-SKrQ5Buj.js","assets/ManagerSubDepartmentList-1oQN65zq.js","assets/ManagerEmployeeList-hpBgo7gn.js","assets/ManagerEfficiency-DeCppGtF.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-Cjiz3CGI.js","assets/SMMMonthlyPosting-YOkc0GjM.js","assets/SMMPosted-wiEPgRv7.js","assets/WritersAssignment-CPbxKii7.js","assets/EmployeeDashboard-YDswfAes.js","assets/EmployeeCalendar-aDI_sMkQ.js","assets/EmployeeEventCalendar-CLqyZ4Vh.js","assets/EmployeeAssignedWork-DjykWefG.js","assets/EmployeeReassignedWork-Cz87v80w.js","assets/EmployeeApprovedWork-C5eKu4LA.js","assets/EmployeeTodayDeliverables-DRN94bmu.js","assets/EmployeeRework-BGBF6jOj.js","assets/EmployeeOverallWork-Lfw-m6XE.js","assets/SuperAdminDashboard-B8Ds7hSJ.js","assets/SuperAdminClients-CatG4-CF.js","assets/SuperAdminEfficiency-mmcuv7Vn.js","assets/SuperAdminBranches-QXLPdu39.js","assets/SuperAdminBranchDetail-BGhp66ja.js","assets/SuperAdminProfile-C24rVDjw.js"])))=>i.map(i=>d[i]);
var ie=Object.defineProperty;var le=(o,t,s)=>t in o?ie(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var U=(o,t,s)=>le(o,typeof t!="symbol"?t+"":t,s);import{r as b,j as e,N as H,L as ce,a as L,C as z,F as B,P as de,B as pe,U as me,b as D,c as Y,R as V,X,M as ue,d as he,e as xe,S as ge,f as fe,g as be,h as je,i as ye,A as _e,k as ve,l as we,m as Z,n as Ee,o as ke,p as a,q as E,O as Ce,s as Se}from"./vendor-react-DPKYyjIX.js";import{f as Le}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}})();const Re="modulepreload",Pe=function(o){return"/"+o},J={},x=function(t,s,r){let n=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),m=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(s.map(l=>{if(l=Pe(l),l in J)return;J[l]=!0;const j=l.endsWith(".css"),d=j?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${d}`))return;const f=document.createElement("link");if(f.rel=j?"stylesheet":Re,j||(f.as="script"),f.crossOrigin="",f.href=l,m&&f.setAttribute("nonce",m),document.head.appendChild(f),j)return new Promise((y,p)=>{f.addEventListener("load",y),f.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function c(i){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=i,window.dispatchEvent(m),!m.defaultPrevented)throw i}return n.then(i=>{for(const m of i||[])m.status==="rejected"&&c(m.reason);return t().catch(c)})},Ie=()=>{const o="http://localhost:5050/api";{const t=o.trim().replace(/\/+$/,"");return t==="/api"||t.startsWith("/api/")||t.endsWith("/api")?t:`${t}/api`}},k=Le.create({baseURL:Ie(),timeout:3e4,headers:{"Content-Type":"application/json"}});k.interceptors.request.use(o=>{const t=localStorage.getItem("erp_token");return t&&(o.headers.Authorization=`Bearer ${t}`),o},o=>Promise.reject(o));k.interceptors.response.use(o=>o,async o=>{var m,l,j;const{config:t,response:s}=o,r=((m=t==null?void 0:t.method)==null?void 0:m.toLowerCase())==="get",n=!s,c=s&&s.status>=500;if(t&&r&&(n||c)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const d=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,d),console.warn(`API call failed: ${o.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${d}ms...`),await new Promise(f=>setTimeout(f,d)),k(t)}if(s&&(s.status===401||s.status===403&&(((l=s.data)==null?void 0:l.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((j=s.data)==null?void 0:j.errors)&&s.data.errors.some(d=>/jwt expired|invalid signature|jwt malformed/i.test(String(d)))))){const d=localStorage.getItem("erp_user");d&&(d.includes('"role":"client"')||d.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(o)});const ee=b.createContext(null),Ae=({children:o})=>{const[t,s]=b.useState(()=>{try{const d=localStorage.getItem("erp_user");return d?JSON.parse(d):null}catch{return null}}),[r,n]=b.useState(!1),c=d=>{if(d)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(f){var p,w;const y=async()=>{var _,C;try{const A=(C=(_=f.User)==null?void 0:_.PushSubscription)==null?void 0:C.id;A&&await k.post("/notifications/subscribe",{subscriptionId:A}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{f.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(_=>{console.warn("[OneSignal] Domain initialization deferred:",(_==null?void 0:_.message)||_)}),window.__oneSignalInitialized=!0}catch(_){console.warn("[OneSignal] Init warning:",_.message)}y();try{(w=(p=f.User)==null?void 0:p.PushSubscription)==null||w.addEventListener("change",function(_){var C;(C=_==null?void 0:_.current)!=null&&C.optedIn&&y()})}catch{}})}catch{}};b.useEffect(()=>{(async()=>{const f=localStorage.getItem("erp_token"),y=localStorage.getItem("erp_user");let p=null;try{p=y?JSON.parse(y):null}catch{}if(!f){if(p&&p.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(p),n(!1);return}s(null),n(!1);return}try{const w=await k.get("/auth/session");if(w.data&&w.data.success){const _=w.data.data.user;s(_),localStorage.setItem("erp_user",JSON.stringify(_))}else p&&p.role==="client"?s(p):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{p&&p.role==="client"&&s(p)}finally{n(!1)}})()},[]),b.useEffect(()=>{t&&c(t)},[t]);const i=async(d,f,y)=>{try{const p=await k.post("/auth/login",{username:d,password:f},{onRetry:y});if(p.data&&p.data.success){const{token:w,user:_}=p.data.data;return localStorage.setItem("erp_token",w||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(_)),s(_),n(!1),{success:!0}}}catch(p){console.error("[AuthContext] Login error caught:",p);let w="Wrong credentials! Invalid username or password.";p.response&&p.response.data&&p.response.data.message?w=p.response.data.message:p.code==="ECONNABORTED"||p.message&&p.message.includes("timeout")?w="Connection timed out. The server took too long to respond.":!p.response&&(p.code==="ERR_NETWORK"||p.message&&p.message.toLowerCase().includes("network"))?w="Network error: Cannot reach backend server. Please verify the server is running.":p.message&&(w=p.message);const _=p.response&&p.response.data&&p.response.data.errors?p.response.data.errors:[];return{success:!1,message:w,errors:_}}},m=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(d){var f,y;try{const p=(y=(f=d.User)==null?void 0:f.PushSubscription)==null?void 0:y.id;p&&await k.post("/notifications/unsubscribe",{subscriptionId:p}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),n(!1)},l=d=>{s(f=>{if(!f)return null;const y={...f,...d};return localStorage.setItem("erp_user",JSON.stringify(y)),y})},j={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:r,login:i,logout:m,updateCurrentUser:l};return e.jsx(ee.Provider,{value:j,children:o})},R=()=>{const o=b.useContext(ee);return o||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},ze=b.createContext(null),De=({children:o})=>{const[t,s]=b.useState([]),[r,n]=b.useState(0),{isAuthenticated:c}=R(),i=b.useCallback(async()=>{if(c)try{const d=await k.get("/notifications");if(d.data&&d.data.success){const f=d.data.data.notifications;s(f);const y=f.filter(p=>!p.is_read).length;n(y)}}catch{}},[c]),m=async d=>{try{await k.patch(`/notifications/${d}/read`),s(f=>f.map(y=>y.id===parseInt(d)?{...y,is_read:1}:y)),n(f=>Math.max(0,f-1))}catch(f){console.error("Failed to mark notification as read:",f.message)}},l=async()=>{try{await k.post("/notifications/read-all"),s(d=>d.map(f=>({...f,is_read:1}))),n(0)}catch(d){console.error("Failed to mark all notifications as read:",d.message)}};b.useEffect(()=>{if(c){i();const d=setInterval(i,3e4);return()=>clearInterval(d)}else s([]),n(0)},[c,i]);const j={notifications:t,unreadCount:r,fetchNotifications:i,markAsRead:m,markAllRead:l};return e.jsx(ze.Provider,{value:j,children:o})},te=b.createContext({isCollapsed:!1,toggleSidebar:()=>{},closeSidebar:()=>{},openSidebar:()=>{}}),Te=({children:o})=>{const[t,s]=b.useState(()=>{try{return localStorage.getItem("erp_sidebar_collapsed")==="true"}catch{return!1}}),r=b.useCallback(()=>{s(i=>{const m=!i;try{localStorage.setItem("erp_sidebar_collapsed",String(m))}catch{}return m})},[]),n=b.useCallback(()=>{s(!0);try{localStorage.setItem("erp_sidebar_collapsed","true")}catch{}},[]),c=b.useCallback(()=>{s(!1);try{localStorage.setItem("erp_sidebar_collapsed","false")}catch{}},[]);return b.useEffect(()=>{const i=m=>{var l,j;if((m.ctrlKey||m.metaKey)&&m.key.toLowerCase()==="b"){const d=(j=(l=document.activeElement)==null?void 0:l.tagName)==null?void 0:j.toLowerCase();d!=="input"&&d!=="textarea"&&(m.preventDefault(),r())}};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[r]),e.jsx(te.Provider,{value:{isCollapsed:t,toggleSidebar:r,closeSidebar:n,openSidebar:c},children:o})},se=()=>b.useContext(te),Oe="/assets/reachskyline-logo-DpVD33Dn.webp",Ne={manager:"https://img.icons8.com/bubbles/100/manager.png",employee:"https://img.icons8.com/plasticine/100/manager.png",clients:"https://img.icons8.com/doodle/48/manager--v1.png",department:"https://img.icons8.com/plasticine/100/department.png",contentCalendar:"https://img.icons8.com/external-filled-outline-icons-maxicons/85/external-calender-insurance-filled-outline-filled-outline-icons-maxicons.png",blogCalendar:"https://img.icons8.com/external-frizty-kerismaker/48/external-Calender-internet-advertising-frizty-kerismaker.png",deliverables:"https://img.icons8.com/color/48/motorcycle-delivery-single-box.png",report:"https://img.icons8.com/arcade/64/health-graph.png",workUpdates:"https://img.icons8.com/flat-round/64/loop.png",activityType:"https://img.icons8.com/color/48/sports-mode.png",credentials:"https://img.icons8.com/external-smashingstocks-isometric-smashing-stocks/55/external-id-card-social-media-smashingstocks-isometric-smashing-stocks.png",creativesTeam:"https://img.icons8.com/fluency/48/creativity.png",campaignTeam:"https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-ads-internet-marketing-service-flaticons-flat-flat-icons.png",seoTeam:"https://img.icons8.com/bubbles/100/positive-dynamic.png",hr:"https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-hr-manager-professions-flaticons-lineal-color-flat-icons-2.png",businessDevelopment:"https://img.icons8.com/external-flat-icons-pack-pongsakorn-tan/64/external-bussiness-insurance-flat-icons-pack-pongsakorn-tan.png"},v=({name:o,size:t=20,style:s={},className:r="",alt:n=""})=>{const c=Ne[o]||o;return e.jsx("img",{src:c,alt:n||o,className:`app-icon-img ${r}`,style:{width:`${t}px`,height:`${t}px`,objectFit:"contain",display:"inline-block",flexShrink:0,verticalAlign:"middle",...s},loading:"lazy"})},Me=()=>{const{logout:o,user:t}=R(),s=()=>{const i=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(L,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(v,{name:"clients",size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(v,{name:"department",size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(v,{name:"manager",size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(v,{name:"employee",size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(v,{name:"contentCalendar",size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(v,{name:"blogCalendar",size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(v,{name:"deliverables",size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(v,{name:"report",size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(v,{name:"workUpdates",size:20})}];return(t==null?void 0:t.role)==="super_admin"&&i.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(v,{name:"report",size:20})}),i.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(v,{name:"activityType",size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(v,{name:"credentials",size:20})}),i},r=()=>{var l,j,d,f,y;const i=window.location.pathname.startsWith("/client");if((t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||i)return[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(L,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(z,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(B,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(v,{name:"report",size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(de,{size:20})}];if((t==null?void 0:t.role)==="super_admin")return[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(L,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(pe,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(v,{name:"clients",size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(v,{name:"blogCalendar",size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(v,{name:"report",size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(me,{size:20})}];if((t==null?void 0:t.role)==="manager")return((l=t==null?void 0:t.managerProfile)==null?void 0:l.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(L,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(v,{name:"employee",size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(Y,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(z,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(L,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(D,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(z,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(v,{name:"contentCalendar",size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(v,{name:"blogCalendar",size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(v,{name:"employee",size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(v,{name:"department",size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(v,{name:"employee",size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(v,{name:"report",size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(B,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(V,{size:20})}];if((t==null?void 0:t.role)==="employee"){if(((j=t==null?void 0:t.employeeProfile)==null?void 0:j.department_code)==="SMM-RS")return[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(L,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(Y,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(z,{size:20})}];const p=Number((d=t==null?void 0:t.employeeProfile)==null?void 0:d.sub_department_id),w=(f=t==null?void 0:t.employeeProfile)==null?void 0:f.sub_department_code,_=(((y=t==null?void 0:t.employeeProfile)==null?void 0:y.sub_department_name)||"").toLowerCase();return p===1||w==="CW-RS"||_.includes("writer")||_.includes("content")?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(L,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(v,{name:"blogCalendar",size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(V,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(B,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(L,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(v,{name:"contentCalendar",size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(V,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(z,{size:20})}]}return s()},n=()=>{document.body.classList.remove("mobile-sidebar-open")},c=r();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:n}),e.jsxs("aside",{className:"sidebar",children:[e.jsx("div",{className:"sidebar-logo",children:e.jsx(H,{to:"/",onClick:n,className:"sidebar-logo-link",title:"ReachSkyline ERP",children:e.jsx("img",{src:Oe,alt:"ReachSkyline Logo",className:"sidebar-brand-img"})})}),e.jsx("ul",{className:"sidebar-menu",children:c.map((i,m)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(H,{to:i.path,state:i.state,onClick:n,className:({isActive:l})=>`sidebar-link ${l?"active":""}`,children:[i.icon,e.jsx("span",{children:i.label})]})},m))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:o,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:i=>{i.currentTarget.style.color="#f87171"},onMouseLeave:i=>{i.currentTarget.style.color="var(--danger)"},children:[e.jsx(ce,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Be=({isOpen:o,onClose:t,title:s,children:r,footer:n=null})=>(b.useEffect(()=>(o?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[o]),o?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:c=>c.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(X,{size:20})})]}),e.jsx("div",{className:"modal-body",children:r}),n&&e.jsx("div",{className:"modal-footer",children:n})]})}):null),Ve=()=>{var $;const{user:o,logout:t}=R(),{isCollapsed:s,toggleSidebar:r}=se(),[n,c]=b.useState(""),[i,m]=b.useState(!1),[l,j]=b.useState(null),[d,f]=b.useState(!1),[y,p]=b.useState(!1),[w,_]=b.useState(!1),C=b.useCallback(()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})},[]);b.useEffect(()=>{const h=()=>{_(!!document.fullscreenElement)};return document.addEventListener("fullscreenchange",h),()=>document.removeEventListener("fullscreenchange",h)},[]);const A=()=>{const h=!y;p(h),h?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};b.useEffect(()=>{const h=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),p(!1))};return window.addEventListener("resize",h),()=>window.removeEventListener("resize",h)},[]);const ne=async h=>{if(h.preventDefault(),!!n.trim()){m(!0),f(!0);try{const S=await k.get(`/search?q=${encodeURIComponent(n)}`);S.data&&S.data.success&&j(S.data.data)}catch(S){console.error("Global search error:",S.message)}finally{m(!1)}}},W=window.location.pathname.startsWith("/client"),u=W?o&&(o.role==="client"||o.user_type==="client")?o:{username:"gem",full_name:"rajesh kumar",role:"client"}:o,oe=u&&u.username?u.username.slice(0,2).toUpperCase():"CL",re=()=>{var h,S,F,q;return W||(u==null?void 0:u.role)==="client"?"Client Partner":(u==null?void 0:u.role)==="manager"?((h=u==null?void 0:u.managerProfile)==null?void 0:h.department_code)==="SMM-RS"?"SMM Manager":(S=u==null?void 0:u.managerProfile)!=null&&S.department_name?`${u.managerProfile.department_name} Manager`:"Brand Manager":(u==null?void 0:u.role)==="employee"?((F=u==null?void 0:u.employeeProfile)==null?void 0:F.department_code)==="SMM-RS"?"SMM Employee":(q=u==null?void 0:u.employeeProfile)!=null&&q.department_name?`${u.employeeProfile.department_name} Employee`:"Employee":(u==null?void 0:u.role)==="admin"?"Administrator":(u==null?void 0:u.role)==="super_admin"?"Super Administrator":(u==null?void 0:u.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:A,"aria-label":"Toggle Navigation",children:y?e.jsx(X,{size:24}):e.jsx(ue,{size:24})}),e.jsx("button",{type:"button",className:"sidebar-toggle-btn",onClick:r,title:s?"Open sidebar (Ctrl+B)":"Close sidebar - Full page view (Ctrl+B)","aria-label":s?"Open sidebar":"Close sidebar",children:s?e.jsx(he,{size:19}):e.jsx(xe,{size:19})}),e.jsx("form",{onSubmit:ne,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(ge,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:n,onChange:h=>c(h.target.value)})]})})]}),e.jsxs("div",{className:"header-actions",children:[e.jsx("button",{type:"button",className:"header-icon-btn",onClick:C,title:w?"Exit Fullscreen (Esc)":"Enter Fullscreen","aria-label":w?"Exit Fullscreen":"Enter Fullscreen",children:w?e.jsx(fe,{size:18}):e.jsx(be,{size:18})}),e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:oe}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:(($=u==null?void 0:u.clientProfile)==null?void 0:$.company_name)||(u==null?void 0:u.full_name)||(u==null?void 0:u.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:re()})]})]})]}),e.jsx(Be,{isOpen:d,onClose:()=>{f(!1),j(null)},title:`Search Results for "${n}"`,children:i?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):l?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[l.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(je,{size:16,className:"text-primary"})," Clients (",l.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.clients.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${h.id}`,style:{fontWeight:600},children:h.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[h.client_name," • ",h.client_id_code]})]},h.id))})]}),l.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ye,{size:16,className:"text-teal"})," Departments (",l.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.departments.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${h.id}`,style:{fontWeight:600},children:h.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:h.code})]},h.id))})]}),l.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(_e,{size:16,className:"text-secondary"})," Managers (",l.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.managers.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${h.id}`,style:{fontWeight:600},children:h.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[h.manager_id_code," • ",h.department_name]})]},h.id))})]}),l.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ve,{size:16,className:"text-purple"})," Employees (",l.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.employees.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${h.id}`,style:{fontWeight:600},children:h.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[h.employee_id_code," • ",h.department_name]})]},h.id))})]}),l.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(we,{size:16,className:"text-orange"})," Projects (",l.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.projects.map(h=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${h.id}`,style:{fontWeight:600},children:h.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",h.client_name," • Manager: ",h.manager_name]})]},h.id))})]}),l.clients.length===0&&l.departments.length===0&&l.managers.length===0&&l.employees.length===0&&l.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',n,'".']})})]}):null})]})};class P extends Z.Component{constructor(s){super(s);U(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,r){var c,i,m;if(console.error("ErrorBoundary caught an error:",s,r),this.setState({errorInfo:r}),s&&(s.name==="ChunkLoadError"||((c=s.message)==null?void 0:c.includes("Failed to fetch dynamically imported module"))||((i=s.message)==null?void 0:i.includes("Importing a module script failed"))||((m=s.message)==null?void 0:m.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,r;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((r=this.state.errorInfo)==null?void 0:r.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const g=o=>b.lazy(()=>o().catch(t=>{var r,n,c;throw t&&(t.name==="ChunkLoadError"||((r=t.message)==null?void 0:r.includes("Failed to fetch dynamically imported module"))||((n=t.message)==null?void 0:n.includes("Importing a module script failed"))||((c=t.message)==null?void 0:c.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),We=g(()=>x(()=>import("./Login-Dqp0GZQo.js"),__vite__mapDeps([0,1,2]))),$e=g(()=>x(()=>import("./AdminDashboard-Bl2ZnMpD.js"),__vite__mapDeps([3,1,2]))),Fe=g(()=>x(()=>import("./ClientList-CkvXxUF9.js"),__vite__mapDeps([4,1,2,5,6]))),qe=g(()=>x(()=>import("./DepartmentList-iFET1GnL.js"),__vite__mapDeps([7,1,2,6]))),Ue=g(()=>x(()=>import("./ManagerList-BujFOHg_.js"),__vite__mapDeps([8,1,2,5,6]))),He=g(()=>x(()=>import("./EmployeeList-Bx_qJMKa.js"),__vite__mapDeps([9,1,2,5,6]))),Ye=g(()=>x(()=>import("./ProjectList-D1tfteS9.js"),__vite__mapDeps([10,1,2,11,12,6]))),Je=g(()=>x(()=>import("./DeliverableList-GgEqPjWP.js"),__vite__mapDeps([13,1,2,5,6]))),Ke=g(()=>x(()=>import("./ReportDashboard-BGgYqqXu.js"),__vite__mapDeps([14,1,2]))),Ge=g(()=>x(()=>import("./SuperadminReports-FTtuP7MR.js"),__vite__mapDeps([15,1,2,5]))),Qe=g(()=>x(()=>import("./ActivityTypeList-BrJii4dP.js"),__vite__mapDeps([16,1,2,6]))),Xe=g(()=>x(()=>import("./LoginCredentials-BDlFh6tO.js"),__vite__mapDeps([17,1,2,5]))),Ze=g(()=>x(()=>import("./WorkUpdates-DItDixnw.js"),__vite__mapDeps([18,1,2,19]))),T=g(()=>x(()=>import("./ClientPortal-HKvEBG9q.js"),__vite__mapDeps([20,1,2]))),et=g(()=>x(()=>import("./ManagerDashboard-nRERNTtX.js"),__vite__mapDeps([21,1,2]))),tt=g(()=>x(()=>import("./ManagerCalendar-CsSdrxtL.js"),__vite__mapDeps([22,1,2,11,12,6]))),st=g(()=>x(()=>import("./ManagerDailyTodo-BjbIRvY1.js"),__vite__mapDeps([23,1,2]))),nt=g(()=>x(()=>import("./DesignerWorkload-DzvxFtDG.js"),__vite__mapDeps([24,1,2,25]))),ot=g(()=>x(()=>import("./CompletedWorks-CA0f5Awj.js"),__vite__mapDeps([26,1,2,27]))),rt=g(()=>x(()=>import("./ManagerSubmissionsReview-CwPF9MEz.js"),__vite__mapDeps([28,1,2]))),at=g(()=>x(()=>import("./ManagerClientRework-mBOcDaNw.js"),__vite__mapDeps([29,1,2]))),it=g(()=>x(()=>import("./ManagerJobWorks-SKrQ5Buj.js"),__vite__mapDeps([30,1,2,5]))),lt=g(()=>x(()=>import("./ManagerSubDepartmentList-1oQN65zq.js"),__vite__mapDeps([31,1,2]))),ct=g(()=>x(()=>import("./ManagerEmployeeList-hpBgo7gn.js"),__vite__mapDeps([32,1,2,5,33,34]))),dt=g(()=>x(()=>import("./ManagerEfficiency-DeCppGtF.js"),__vite__mapDeps([33,1,2,34]))),K=g(()=>x(()=>import("./SMMTodayPosting-Cjiz3CGI.js"),__vite__mapDeps([35,1,2]))),G=g(()=>x(()=>import("./SMMMonthlyPosting-YOkc0GjM.js"),__vite__mapDeps([36,1,2,5]))),Q=g(()=>x(()=>import("./SMMPosted-wiEPgRv7.js"),__vite__mapDeps([37,1,2,5]))),pt=g(()=>x(()=>import("./WritersAssignment-CPbxKii7.js"),__vite__mapDeps([38,1,2]))),mt=g(()=>x(()=>import("./EmployeeDashboard-YDswfAes.js"),__vite__mapDeps([39,1,2]))),ut=g(()=>x(()=>import("./EmployeeCalendar-aDI_sMkQ.js"),__vite__mapDeps([40,1,2,11,12,6]))),M=g(()=>x(()=>import("./EmployeeEventCalendar-CLqyZ4Vh.js"),__vite__mapDeps([41,1,2]))),ht=g(()=>x(()=>import("./EmployeeAssignedWork-DjykWefG.js"),__vite__mapDeps([42,1,2]))),xt=g(()=>x(()=>import("./EmployeeReassignedWork-Cz87v80w.js"),__vite__mapDeps([43,1,2]))),gt=g(()=>x(()=>import("./EmployeeApprovedWork-C5eKu4LA.js"),__vite__mapDeps([44,1,2,5]))),ft=g(()=>x(()=>import("./EmployeeTodayDeliverables-DRN94bmu.js"),__vite__mapDeps([45,1,2]))),bt=g(()=>x(()=>import("./EmployeeRework-BGBF6jOj.js"),__vite__mapDeps([46,1,2]))),jt=g(()=>x(()=>import("./EmployeeOverallWork-Lfw-m6XE.js"),__vite__mapDeps([47,1,2]))),yt=g(()=>x(()=>import("./SuperAdminDashboard-B8Ds7hSJ.js"),__vite__mapDeps([48,1,2]))),_t=g(()=>x(()=>import("./SuperAdminClients-CatG4-CF.js"),__vite__mapDeps([49,1,2,5]))),vt=g(()=>x(()=>import("./SuperAdminEfficiency-mmcuv7Vn.js"),__vite__mapDeps([50,1,2,5]))),wt=g(()=>x(()=>import("./SuperAdminBranches-QXLPdu39.js"),__vite__mapDeps([51,1,2,5]))),Et=g(()=>x(()=>import("./SuperAdminBranchDetail-BGhp66ja.js"),__vite__mapDeps([52,1,2,5]))),kt=g(()=>x(()=>import("./SuperAdminProfile-C24rVDjw.js"),__vite__mapDeps([53,1,2]))),I=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),O=()=>{try{const o=localStorage.getItem("erp_user");return o?JSON.parse(o):null}catch{return null}},N=()=>{const{isCollapsed:o}=se();return e.jsxs("div",{className:`app-layout ${o?"sidebar-collapsed":""}`,children:[e.jsx(Me,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(Ve,{}),e.jsx("main",{className:"main-content-scroll",style:{flex:1,overflowY:"auto",minHeight:0},children:e.jsx(b.Suspense,{fallback:e.jsx(I,{}),children:e.jsx(Ce,{})})})]})]})},Ct=()=>{const{isAuthenticated:o,user:t,loading:s}=R(),r=t||O();return s?e.jsx(I,{}):!r||r.role!=="super_admin"?e.jsx(E,{to:"/login",replace:!0}):e.jsx(N,{})},St=()=>{const{isAuthenticated:o,user:t,isAdmin:s,loading:r}=R(),n=t||O(),c=s||n&&(n.role==="admin"||n.role==="super_admin");return r?e.jsx(I,{}):!n||!c?e.jsx(E,{to:"/login",replace:!0}):e.jsx(N,{})},Lt=()=>{const{isAuthenticated:o,user:t,loading:s}=R(),r=t||O();return s?e.jsx(I,{}):!r||r.role!=="manager"&&r.role!=="admin"&&r.role!=="super_admin"?e.jsx(E,{to:"/login",replace:!0}):e.jsx(N,{})},Rt=()=>{const{isAuthenticated:o,user:t,loading:s}=R(),r=t||O(),n=((r==null?void 0:r.username)||"").trim().toLowerCase(),c=r&&(r.role==="client"||r.user_type==="client"||n==="gem"||n==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(I,{}):c?e.jsx(N,{}):e.jsx(E,{to:"/login",replace:!0})},Pt=()=>{const{isAuthenticated:o,user:t,loading:s}=R(),r=t||O();return s?e.jsx(I,{}):!r||r.role!=="employee"?e.jsx(E,{to:"/login",replace:!0}):e.jsx(N,{})};function It(){return e.jsx(Ee,{children:e.jsx(Ae,{children:e.jsx(Te,{children:e.jsx(De,{children:e.jsx(P,{children:e.jsx(b.Suspense,{fallback:e.jsx(I,{}),children:e.jsxs(ke,{children:[e.jsx(a,{path:"/login",element:e.jsx(We,{})}),e.jsxs(a,{path:"/super-admin",element:e.jsx(Ct,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(yt,{})}),e.jsx(a,{path:"clients",element:e.jsx(_t,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(vt,{})}),e.jsx(a,{path:"branches",element:e.jsx(wt,{})}),e.jsx(a,{path:"branches/:id",element:e.jsx(Et,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(P,{children:e.jsx(M,{})})}),e.jsx(a,{path:"profile",element:e.jsx(kt,{})}),e.jsx(a,{index:!0,element:e.jsx(E,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/admin",element:e.jsx(St,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx($e,{})}),e.jsx(a,{path:"clients",element:e.jsx(Fe,{})}),e.jsx(a,{path:"departments",element:e.jsx(qe,{})}),e.jsx(a,{path:"managers",element:e.jsx(Ue,{})}),e.jsx(a,{path:"employees",element:e.jsx(He,{})}),e.jsx(a,{path:"projects",element:e.jsx(Ye,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(P,{children:e.jsx(M,{})})}),e.jsx(a,{path:"deliverables",element:e.jsx(Je,{})}),e.jsx(a,{path:"reports",element:e.jsx(Ke,{})}),e.jsx(a,{path:"superadmin-reports",element:e.jsx(Ge,{})}),e.jsx(a,{path:"activity-types",element:e.jsx(Qe,{})}),e.jsx(a,{path:"credentials",element:e.jsx(Xe,{})}),e.jsx(a,{path:"work-updates",element:e.jsx(Ze,{})}),e.jsx(a,{index:!0,element:e.jsx(E,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/manager",element:e.jsx(Lt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(et,{})}),e.jsx(a,{path:"calendar",element:e.jsx(tt,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(P,{children:e.jsx(M,{})})}),e.jsx(a,{path:"daily-todo",element:e.jsx(st,{})}),e.jsx(a,{path:"designer-workload",element:e.jsx(nt,{})}),e.jsx(a,{path:"completed-works",element:e.jsx(ot,{})}),e.jsx(a,{path:"sub-departments",element:e.jsx(lt,{})}),e.jsx(a,{path:"employees",element:e.jsx(ct,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(dt,{})}),e.jsx(a,{path:"submissions-review",element:e.jsx(P,{children:e.jsx(rt,{})})}),e.jsx(a,{path:"client-reworks",element:e.jsx(at,{})}),e.jsx(a,{path:"job-works",element:e.jsx(it,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(K,{})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(G,{})}),e.jsx(a,{path:"posted",element:e.jsx(Q,{})}),e.jsx(a,{path:"writers-assignment",element:e.jsx(P,{children:e.jsx(pt,{})})}),e.jsx(a,{index:!0,element:e.jsx(E,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/employee",element:e.jsx(Pt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(mt,{})}),e.jsx(a,{path:"calendar",element:e.jsx(ut,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(P,{children:e.jsx(M,{})})}),e.jsx(a,{path:"assigned-work",element:e.jsx(ht,{})}),e.jsx(a,{path:"reassigned-work",element:e.jsx(xt,{})}),e.jsx(a,{path:"approved-work",element:e.jsx(gt,{})}),e.jsx(a,{path:"overall-work",element:e.jsx(jt,{})}),e.jsx(a,{path:"today",element:e.jsx(ft,{})}),e.jsx(a,{path:"rework",element:e.jsx(bt,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(K,{isEmployee:!0})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(G,{isEmployee:!0})}),e.jsx(a,{path:"posted",element:e.jsx(Q,{isEmployee:!0})}),e.jsx(a,{index:!0,element:e.jsx(E,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/client",element:e.jsx(Rt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(T,{activeTabProp:"dashboard"})}),e.jsx(a,{path:"approvals",element:e.jsx(T,{activeTabProp:"approvals"})}),e.jsx(a,{path:"reachskyline-approvals",element:e.jsx(T,{activeTabProp:"reachskyline_approvals"})}),e.jsx(a,{path:"reports",element:e.jsx(T,{activeTabProp:"reports"})}),e.jsx(a,{path:"contact",element:e.jsx(T,{activeTabProp:"contact"})}),e.jsx(a,{path:"portal",element:e.jsx(E,{to:"/client/dashboard",replace:!0})}),e.jsx(a,{index:!0,element:e.jsx(E,{to:"dashboard",replace:!0})})]}),e.jsx(a,{path:"*",element:e.jsx(E,{to:"/login",replace:!0})})]})})})})})})})}window.alert=o=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const d=document.createElement("style");d.textContent=`
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
    `,document.head.appendChild(d),document.body.appendChild(t)}t.innerHTML="";let s="info",r="Notification";const n=(o||"").toLowerCase();n.includes("already approved")||n.includes("can't edit")||n.includes("cannot edit")?(s="info",r="Info"):n.includes("success")||n.includes("approve")||n.includes("submit")?(s="success",r="Success"):(n.includes("fail")||n.includes("error")||n.includes("invalid")||n.includes("please"))&&(s="error",r="Alert");let c="";s==="success"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const i=document.createElement("div");i.className="custom-alert-backdrop";const m=document.createElement("div");m.className="custom-alert-box",m.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${c}
    </div>
    <h3 class="custom-alert-title">${r}</h3>
    <p class="custom-alert-message">${o}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(i),t.appendChild(m);const l=()=>{m.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{t.contains(i)&&t.removeChild(i),t.contains(m)&&t.removeChild(m)},300)},j=m.querySelector(".custom-alert-btn");j.addEventListener("click",l),i.addEventListener("click",l),requestAnimationFrame(()=>{i.classList.add("show"),m.classList.add("show"),j.focus()})};window.confirm=o=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const j=document.createElement("style");j.textContent=`
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
      `,document.head.appendChild(j),document.body.appendChild(s)}s.innerHTML="";const r=document.createElement("div");r.className="custom-confirm-backdrop";const n=document.createElement("div");n.className="custom-confirm-box";const c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';n.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${c}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${o}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(r),s.appendChild(n);const i=j=>{n.classList.remove("show"),r.classList.remove("show"),setTimeout(()=>{s.contains(r)&&s.removeChild(r),s.contains(n)&&s.removeChild(n),t(j)},300)},m=n.querySelector(".custom-confirm-btn-cancel"),l=n.querySelector(".custom-confirm-btn-confirm");m.addEventListener("click",()=>i(!1)),l.addEventListener("click",()=>i(!0)),r.addEventListener("click",()=>i(!1)),requestAnimationFrame(()=>{r.classList.add("show"),n.classList.add("show"),l.focus()})});if(typeof window<"u"){const o=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var r;const s=((r=t.reason)==null?void 0:r.message)||String(t.reason||"");o(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var r;const s=t.message||String(((r=t.error)==null?void 0:r.message)||"");o(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}Se.createRoot(document.getElementById("root")).render(e.jsx(Z.StrictMode,{children:e.jsx(It,{})}));export{v as A,Be as M,k as a,Oe as r,R as u};
