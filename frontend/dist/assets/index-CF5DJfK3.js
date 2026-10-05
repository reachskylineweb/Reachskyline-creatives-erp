const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-vfv0piY4.js","assets/vendor-react-smA2ie54.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-CwDI0yGY.js","assets/ClientList-qVekzhUC.js","assets/Table-BSNrEvkj.js","assets/FormFields-Dx46xYkV.js","assets/DepartmentList-DHXeisKZ.js","assets/ManagerList-8zmrQpno.js","assets/EmployeeList-B1p5Th7I.js","assets/ProjectList-CRvWCA1h.js","assets/ContentCalendarView-Cy5skIi0.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-BlDXCgY6.js","assets/ReportDashboard-Cg43lJoM.js","assets/SuperadminReports-CazDeGdZ.js","assets/ActivityTypeList-C2oU3RQz.js","assets/LoginCredentials-BHD1SDvP.js","assets/WorkUpdates-FoxUuK_b.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-DPF8gqR9.js","assets/ManagerDashboard-hasJ18JT.js","assets/ManagerCalendar-CSyAUvKU.js","assets/ManagerDailyTodo-NLKfQbXD.js","assets/DesignerWorkload-D2xZsm7y.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-BjIwUltz.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-DMR8rpro.js","assets/ManagerClientRework-DOpNdxSO.js","assets/ManagerJobWorks-DL7U8kBT.js","assets/ManagerSubDepartmentList-B1ER-Uem.js","assets/ManagerEmployeeList-CBmzYPxx.js","assets/ManagerEfficiency-C_KTi9qa.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-CX8AYXCT.js","assets/SMMMonthlyPosting-RI-oo_V4.js","assets/SMMPosted-BtPn3Wzb.js","assets/WritersAssignment-Cdz5GxZT.js","assets/EmployeeDashboard-D99RBh5e.js","assets/EmployeeCalendar-ChAT6qOW.js","assets/EmployeeEventCalendar-DJ-dv8qq.js","assets/EmployeeAssignedWork-BQnG2-d8.js","assets/EmployeeReassignedWork-oa1-GtZ9.js","assets/EmployeeApprovedWork-BB6ejfyK.js","assets/EmployeeTodayDeliverables-Bq0IHTmT.js","assets/EmployeeRework-CINTcCHY.js","assets/EmployeeOverallWork-g6oizE8g.js","assets/SuperAdminDashboard-DT-3qWK2.js","assets/SuperAdminClients-UpHFHbf7.js","assets/SuperAdminEfficiency-DhuY4rcq.js","assets/SuperAdminBranches-UspPk-kk.js","assets/SuperAdminBranchDetail-B9tJfqPz.js","assets/SuperAdminProfile-BgIoTGCU.js"])))=>i.map(i=>d[i]);
var ne=Object.defineProperty;var oe=(o,t,s)=>t in o?ne(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var W=(o,t,s)=>oe(o,typeof t!="symbol"?t+"":t,s);import{r as j,j as e,N as $,L as re,P as ae,B as ie,U as le,C as F,R as O,X as J,M as ce,a as de,b as me,S as pe,c as ue,d as he,e as xe,f as ge,A as fe,g as be,F as je,h as K,i as ye,k as _e,l as a,m as k,O as ve,n as we}from"./vendor-react-smA2ie54.js";import{f as ke}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}})();const Ee="modulepreload",Se=function(o){return"/"+o},q={},g=function(t,s,r){let n=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),u=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(s.map(l=>{if(l=Se(l),l in q)return;q[l]=!0;const y=l.endsWith(".css"),d=y?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${d}`))return;const b=document.createElement("link");if(b.rel=y?"stylesheet":Ee,y||(b.as="script"),b.crossOrigin="",b.href=l,u&&b.setAttribute("nonce",u),document.head.appendChild(b),y)return new Promise((_,m)=>{b.addEventListener("load",_),b.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${l}`)))})}))}function c(i){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=i,window.dispatchEvent(u),!u.defaultPrevented)throw i}return n.then(i=>{for(const u of i||[])u.status==="rejected"&&c(u.reason);return t().catch(c)})},Ce=()=>{const o="http://localhost:5050/api";{const t=o.trim().replace(/\/+$/,"");return t==="/api"||t.startsWith("/api/")||t.endsWith("/api")?t:`${t}/api`}},E=ke.create({baseURL:Ce(),timeout:3e4,headers:{"Content-Type":"application/json"}});E.interceptors.request.use(o=>{const t=localStorage.getItem("erp_token");return t&&(o.headers.Authorization=`Bearer ${t}`),o},o=>Promise.reject(o));E.interceptors.response.use(o=>o,async o=>{var u,l,y;const{config:t,response:s}=o,r=((u=t==null?void 0:t.method)==null?void 0:u.toLowerCase())==="get",n=!s,c=s&&s.status>=500;if(t&&r&&(n||c)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const d=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,d),console.warn(`API call failed: ${o.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${d}ms...`),await new Promise(b=>setTimeout(b,d)),E(t)}if(s&&(s.status===401||s.status===403&&(((l=s.data)==null?void 0:l.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((y=s.data)==null?void 0:y.errors)&&s.data.errors.some(d=>/jwt expired|invalid signature|jwt malformed/i.test(String(d)))))){const d=localStorage.getItem("erp_user");d&&(d.includes('"role":"client"')||d.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(o)});const G=j.createContext(null),Le=({children:o})=>{const[t,s]=j.useState(()=>{try{const d=localStorage.getItem("erp_user");return d?JSON.parse(d):null}catch{return null}}),[r,n]=j.useState(!1),c=d=>{if(d)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(b){var m,w;const _=async()=>{var v,S;try{const I=(S=(v=b.User)==null?void 0:v.PushSubscription)==null?void 0:S.id;I&&await E.post("/notifications/subscribe",{subscriptionId:I}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{b.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(v=>{console.warn("[OneSignal] Domain initialization deferred:",(v==null?void 0:v.message)||v)}),window.__oneSignalInitialized=!0}catch(v){console.warn("[OneSignal] Init warning:",v.message)}_();try{(w=(m=b.User)==null?void 0:m.PushSubscription)==null||w.addEventListener("change",function(v){var S;(S=v==null?void 0:v.current)!=null&&S.optedIn&&_()})}catch{}})}catch{}};j.useEffect(()=>{(async()=>{const b=localStorage.getItem("erp_token"),_=localStorage.getItem("erp_user");let m=null;try{m=_?JSON.parse(_):null}catch{}if(!b){if(m&&m.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(m),n(!1);return}s(null),n(!1);return}try{const w=await E.get("/auth/session");if(w.data&&w.data.success){const v=w.data.data.user;s(v),localStorage.setItem("erp_user",JSON.stringify(v))}else m&&m.role==="client"?s(m):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{m&&m.role==="client"&&s(m)}finally{n(!1)}})()},[]),j.useEffect(()=>{t&&c(t)},[t]);const i=async(d,b,_)=>{try{const m=await E.post("/auth/login",{username:d,password:b},{onRetry:_});if(m.data&&m.data.success){const{token:w,user:v}=m.data.data;return localStorage.setItem("erp_token",w||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(v)),s(v),n(!1),{success:!0}}}catch(m){console.error("[AuthContext] Login error caught:",m);let w="Wrong credentials! Invalid username or password.";m.response&&m.response.data&&m.response.data.message?w=m.response.data.message:m.code==="ECONNABORTED"||m.message&&m.message.includes("timeout")?w="Connection timed out. The server took too long to respond.":!m.response&&(m.code==="ERR_NETWORK"||m.message&&m.message.toLowerCase().includes("network"))?w="Network error: Cannot reach backend server. Please verify the server is running.":m.message&&(w=m.message);const v=m.response&&m.response.data&&m.response.data.errors?m.response.data.errors:[];return{success:!1,message:w,errors:v}}},u=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(d){var b,_;try{const m=(_=(b=d.User)==null?void 0:b.PushSubscription)==null?void 0:_.id;m&&await E.post("/notifications/unsubscribe",{subscriptionId:m}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),n(!1)},l=d=>{s(b=>{if(!b)return null;const _={...b,...d};return localStorage.setItem("erp_user",JSON.stringify(_)),_})},y={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:r,login:i,logout:u,updateCurrentUser:l};return e.jsx(G.Provider,{value:y,children:o})},L=()=>{const o=j.useContext(G);return o||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Re=j.createContext(null),Pe=({children:o})=>{const[t,s]=j.useState([]),[r,n]=j.useState(0),{isAuthenticated:c}=L(),i=j.useCallback(async()=>{if(c)try{const d=await E.get("/notifications");if(d.data&&d.data.success){const b=d.data.data.notifications;s(b);const _=b.filter(m=>!m.is_read).length;n(_)}}catch{}},[c]),u=async d=>{try{await E.patch(`/notifications/${d}/read`),s(b=>b.map(_=>_.id===parseInt(d)?{..._,is_read:1}:_)),n(b=>Math.max(0,b-1))}catch(b){console.error("Failed to mark notification as read:",b.message)}},l=async()=>{try{await E.post("/notifications/read-all"),s(d=>d.map(b=>({...b,is_read:1}))),n(0)}catch(d){console.error("Failed to mark all notifications as read:",d.message)}};j.useEffect(()=>{if(c){i();const d=setInterval(i,3e4);return()=>clearInterval(d)}else s([]),n(0)},[c,i]);const y={notifications:t,unreadCount:r,fetchNotifications:i,markAsRead:u,markAllRead:l};return e.jsx(Re.Provider,{value:y,children:o})},Q=j.createContext({isCollapsed:!1,toggleSidebar:()=>{},closeSidebar:()=>{},openSidebar:()=>{}}),Ie=({children:o})=>{const[t,s]=j.useState(()=>{try{return localStorage.getItem("erp_sidebar_collapsed")==="true"}catch{return!1}}),r=j.useCallback(()=>{s(i=>{const u=!i;try{localStorage.setItem("erp_sidebar_collapsed",String(u))}catch{}return u})},[]),n=j.useCallback(()=>{s(!0);try{localStorage.setItem("erp_sidebar_collapsed","true")}catch{}},[]),c=j.useCallback(()=>{s(!1);try{localStorage.setItem("erp_sidebar_collapsed","false")}catch{}},[]);return j.useEffect(()=>{const i=u=>{var l,y;if((u.ctrlKey||u.metaKey)&&u.key.toLowerCase()==="b"){const d=(y=(l=document.activeElement)==null?void 0:l.tagName)==null?void 0:y.toLowerCase();d!=="input"&&d!=="textarea"&&(u.preventDefault(),r())}};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[r]),e.jsx(Q.Provider,{value:{isCollapsed:t,toggleSidebar:r,closeSidebar:n,openSidebar:c},children:o})},X=()=>j.useContext(Q),Ae="/assets/reachskyline-logo-DpVD33Dn.webp",ze={dashboard:"https://img.icons8.com/clouds/100/performance-macbook.png",completedTask:"https://img.icons8.com/fluency/48/completed-task.png",task:"https://img.icons8.com/arcade/64/task.png",manager:"https://img.icons8.com/bubbles/100/manager.png",employee:"https://img.icons8.com/plasticine/100/manager.png",clients:"https://img.icons8.com/doodle/48/manager--v1.png",department:"https://img.icons8.com/plasticine/100/department.png",contentCalendar:"https://img.icons8.com/external-filled-outline-icons-maxicons/85/external-calender-insurance-filled-outline-filled-outline-icons-maxicons.png",blogCalendar:"https://img.icons8.com/external-frizty-kerismaker/48/external-Calender-internet-advertising-frizty-kerismaker.png",deliverables:"https://img.icons8.com/color/48/motorcycle-delivery-single-box.png",report:"https://img.icons8.com/arcade/64/health-graph.png",workUpdates:"https://img.icons8.com/flat-round/64/loop.png",activityType:"https://img.icons8.com/color/48/sports-mode.png",credentials:"https://img.icons8.com/external-smashingstocks-isometric-smashing-stocks/55/external-id-card-social-media-smashingstocks-isometric-smashing-stocks.png",creativesTeam:"https://img.icons8.com/fluency/48/creativity.png",campaignTeam:"https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-ads-internet-marketing-service-flaticons-flat-flat-icons.png",seoTeam:"https://img.icons8.com/bubbles/100/positive-dynamic.png",hr:"https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-hr-manager-professions-flaticons-lineal-color-flat-icons-2.png",businessDevelopment:"https://img.icons8.com/external-flat-icons-pack-pongsakorn-tan/64/external-bussiness-insurance-flat-icons-pack-pongsakorn-tan.png"},p=({name:o,size:t=26,style:s={},className:r="",alt:n=""})=>{const c=ze[o]||o;return e.jsx("img",{src:c,alt:n||o,className:`app-icon-img ${r}`,style:{width:`${t}px`,height:`${t}px`,objectFit:"contain",display:"inline-block",flexShrink:0,verticalAlign:"middle",...s},loading:"lazy"})},De=()=>{const{logout:o,user:t}=L(),s=()=>{const i=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(p,{name:"dashboard",size:26})},{label:"Clients",path:"/admin/clients",icon:e.jsx(p,{name:"clients",size:26})},{label:"Departments",path:"/admin/departments",icon:e.jsx(p,{name:"department",size:26})},{label:"Managers",path:"/admin/managers",icon:e.jsx(p,{name:"manager",size:26})},{label:"Employees",path:"/admin/employees",icon:e.jsx(p,{name:"employee",size:26})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(p,{name:"contentCalendar",size:26})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(p,{name:"blogCalendar",size:26})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(p,{name:"deliverables",size:26})},{label:"Reports",path:"/admin/reports",icon:e.jsx(p,{name:"report",size:26})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(p,{name:"workUpdates",size:26})}];return(t==null?void 0:t.role)==="super_admin"&&i.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(p,{name:"report",size:26})}),i.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(p,{name:"activityType",size:26})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(p,{name:"credentials",size:26})}),i},r=()=>{var l,y,d,b,_;const i=window.location.pathname.startsWith("/client");if((t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||i)return[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(p,{name:"dashboard",size:26})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(p,{name:"completedTask",size:26})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(p,{name:"task",size:26})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(p,{name:"report",size:26})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(ae,{size:22})}];if((t==null?void 0:t.role)==="super_admin")return[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(p,{name:"dashboard",size:26})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(ie,{size:24})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(p,{name:"clients",size:26})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(p,{name:"blogCalendar",size:26})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(p,{name:"report",size:26})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(le,{size:24})}];if((t==null?void 0:t.role)==="manager")return((l=t==null?void 0:t.managerProfile)==null?void 0:l.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(p,{name:"dashboard",size:26})},{label:"Employees",path:"/manager/employees",icon:e.jsx(p,{name:"employee",size:26})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(p,{name:"task",size:26})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(F,{size:24})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(p,{name:"completedTask",size:26})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(p,{name:"dashboard",size:26})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(p,{name:"task",size:26})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(p,{name:"completedTask",size:26})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(p,{name:"contentCalendar",size:26})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(p,{name:"blogCalendar",size:26})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(p,{name:"employee",size:26})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(p,{name:"department",size:26})},{label:"Employees",path:"/manager/employees",icon:e.jsx(p,{name:"employee",size:26})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(p,{name:"report",size:26})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(p,{name:"task",size:26})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(O,{size:22})}];if((t==null?void 0:t.role)==="employee"){if(((y=t==null?void 0:t.employeeProfile)==null?void 0:y.department_code)==="SMM-RS")return[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(p,{name:"dashboard",size:26})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(p,{name:"task",size:26})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(F,{size:24})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(p,{name:"completedTask",size:26})}];const m=Number((d=t==null?void 0:t.employeeProfile)==null?void 0:d.sub_department_id),w=(b=t==null?void 0:t.employeeProfile)==null?void 0:b.sub_department_code,v=(((_=t==null?void 0:t.employeeProfile)==null?void 0:_.sub_department_name)||"").toLowerCase();return m===1||w==="CW-RS"||v.includes("writer")||v.includes("content")?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(p,{name:"dashboard",size:26})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(p,{name:"blogCalendar",size:26})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(p,{name:"task",size:26})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(O,{size:22})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(p,{name:"completedTask",size:26})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(p,{name:"dashboard",size:26})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(p,{name:"contentCalendar",size:26})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(p,{name:"task",size:26})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(O,{size:22})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(p,{name:"completedTask",size:26})}]}return s()},n=()=>{document.body.classList.remove("mobile-sidebar-open")},c=r();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:n}),e.jsxs("aside",{className:"sidebar",children:[e.jsx("div",{className:"sidebar-logo",children:e.jsx($,{to:"/",onClick:n,className:"sidebar-logo-link",title:"ReachSkyline ERP",children:e.jsx("img",{src:Ae,alt:"ReachSkyline Logo",className:"sidebar-brand-img"})})}),e.jsx("ul",{className:"sidebar-menu",children:c.map((i,u)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs($,{to:i.path,state:i.state,onClick:n,className:({isActive:l})=>`sidebar-link ${l?"active":""}`,children:[i.icon,e.jsx("span",{children:i.label})]})},u))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:o,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:i=>{i.currentTarget.style.color="#f87171"},onMouseLeave:i=>{i.currentTarget.style.color="var(--danger)"},children:[e.jsx(re,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Te=({isOpen:o,onClose:t,title:s,children:r,footer:n=null})=>(j.useEffect(()=>(o?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[o]),o?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:c=>c.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(J,{size:20})})]}),e.jsx("div",{className:"modal-body",children:r}),n&&e.jsx("div",{className:"modal-footer",children:n})]})}):null),Oe=()=>{var M;const{user:o,logout:t}=L(),{isCollapsed:s,toggleSidebar:r}=X(),[n,c]=j.useState(""),[i,u]=j.useState(!1),[l,y]=j.useState(null),[d,b]=j.useState(!1),[_,m]=j.useState(!1),[w,v]=j.useState(!1),S=j.useCallback(()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})},[]);j.useEffect(()=>{const x=()=>{v(!!document.fullscreenElement)};return document.addEventListener("fullscreenchange",x),()=>document.removeEventListener("fullscreenchange",x)},[]);const I=()=>{const x=!_;m(x),x?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};j.useEffect(()=>{const x=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),m(!1))};return window.addEventListener("resize",x),()=>window.removeEventListener("resize",x)},[]);const Z=async x=>{if(x.preventDefault(),!!n.trim()){u(!0),b(!0);try{const C=await E.get(`/search?q=${encodeURIComponent(n)}`);C.data&&C.data.success&&y(C.data.data)}catch(C){console.error("Global search error:",C.message)}finally{u(!1)}}},N=window.location.pathname.startsWith("/client"),h=N?o&&(o.role==="client"||o.user_type==="client")?o:{username:"gem",full_name:"rajesh kumar",role:"client"}:o,ee=h&&h.username?h.username.slice(0,2).toUpperCase():"CL",te=()=>{var x,C,B,V;return N||(h==null?void 0:h.role)==="client"?"Client Partner":(h==null?void 0:h.role)==="manager"?((x=h==null?void 0:h.managerProfile)==null?void 0:x.department_code)==="SMM-RS"?"SMM Manager":(C=h==null?void 0:h.managerProfile)!=null&&C.department_name?`${h.managerProfile.department_name} Manager`:"Brand Manager":(h==null?void 0:h.role)==="employee"?((B=h==null?void 0:h.employeeProfile)==null?void 0:B.department_code)==="SMM-RS"?"SMM Employee":(V=h==null?void 0:h.employeeProfile)!=null&&V.department_name?`${h.employeeProfile.department_name} Employee`:"Employee":(h==null?void 0:h.role)==="admin"?"Administrator":(h==null?void 0:h.role)==="super_admin"?"Super Administrator":(h==null?void 0:h.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:I,"aria-label":"Toggle Navigation",children:_?e.jsx(J,{size:24}):e.jsx(ce,{size:24})}),e.jsx("button",{type:"button",className:"sidebar-toggle-btn",onClick:r,title:s?"Open sidebar (Ctrl+B)":"Close sidebar - Full page view (Ctrl+B)","aria-label":s?"Open sidebar":"Close sidebar",children:s?e.jsx(de,{size:19}):e.jsx(me,{size:19})}),e.jsx("form",{onSubmit:Z,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(pe,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:n,onChange:x=>c(x.target.value)})]})})]}),e.jsxs("div",{className:"header-actions",children:[e.jsx("button",{type:"button",className:"header-icon-btn",onClick:S,title:w?"Exit Fullscreen (Esc)":"Enter Fullscreen","aria-label":w?"Exit Fullscreen":"Enter Fullscreen",children:w?e.jsx(ue,{size:18}):e.jsx(he,{size:18})}),e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:ee}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((M=h==null?void 0:h.clientProfile)==null?void 0:M.company_name)||(h==null?void 0:h.full_name)||(h==null?void 0:h.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:te()})]})]})]}),e.jsx(Te,{isOpen:d,onClose:()=>{b(!1),y(null)},title:`Search Results for "${n}"`,children:i?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):l?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[l.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(xe,{size:16,className:"text-primary"})," Clients (",l.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.clients.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${x.id}`,style:{fontWeight:600},children:x.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.client_name," • ",x.client_id_code]})]},x.id))})]}),l.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ge,{size:16,className:"text-teal"})," Departments (",l.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.departments.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${x.id}`,style:{fontWeight:600},children:x.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:x.code})]},x.id))})]}),l.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(fe,{size:16,className:"text-secondary"})," Managers (",l.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.managers.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.manager_id_code," • ",x.department_name]})]},x.id))})]}),l.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(be,{size:16,className:"text-purple"})," Employees (",l.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.employees.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.employee_id_code," • ",x.department_name]})]},x.id))})]}),l.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(je,{size:16,className:"text-orange"})," Projects (",l.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.projects.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${x.id}`,style:{fontWeight:600},children:x.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",x.client_name," • Manager: ",x.manager_name]})]},x.id))})]}),l.clients.length===0&&l.departments.length===0&&l.managers.length===0&&l.employees.length===0&&l.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',n,'".']})})]}):null})]})};class R extends K.Component{constructor(s){super(s);W(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,r){var c,i,u;if(console.error("ErrorBoundary caught an error:",s,r),this.setState({errorInfo:r}),s&&(s.name==="ChunkLoadError"||((c=s.message)==null?void 0:c.includes("Failed to fetch dynamically imported module"))||((i=s.message)==null?void 0:i.includes("Importing a module script failed"))||((u=s.message)==null?void 0:u.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,r;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((r=this.state.errorInfo)==null?void 0:r.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const f=o=>j.lazy(()=>o().catch(t=>{var r,n,c;throw t&&(t.name==="ChunkLoadError"||((r=t.message)==null?void 0:r.includes("Failed to fetch dynamically imported module"))||((n=t.message)==null?void 0:n.includes("Importing a module script failed"))||((c=t.message)==null?void 0:c.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Ne=f(()=>g(()=>import("./Login-vfv0piY4.js"),__vite__mapDeps([0,1,2]))),Me=f(()=>g(()=>import("./AdminDashboard-CwDI0yGY.js"),__vite__mapDeps([3,1,2]))),Be=f(()=>g(()=>import("./ClientList-qVekzhUC.js"),__vite__mapDeps([4,1,2,5,6]))),Ve=f(()=>g(()=>import("./DepartmentList-DHXeisKZ.js"),__vite__mapDeps([7,1,2,6]))),We=f(()=>g(()=>import("./ManagerList-8zmrQpno.js"),__vite__mapDeps([8,1,2,5,6]))),$e=f(()=>g(()=>import("./EmployeeList-B1p5Th7I.js"),__vite__mapDeps([9,1,2,5,6]))),Fe=f(()=>g(()=>import("./ProjectList-CRvWCA1h.js"),__vite__mapDeps([10,1,2,11,12,6]))),qe=f(()=>g(()=>import("./DeliverableList-BlDXCgY6.js"),__vite__mapDeps([13,1,2,5,6]))),Ue=f(()=>g(()=>import("./ReportDashboard-Cg43lJoM.js"),__vite__mapDeps([14,1,2]))),He=f(()=>g(()=>import("./SuperadminReports-CazDeGdZ.js"),__vite__mapDeps([15,1,2,5]))),Ye=f(()=>g(()=>import("./ActivityTypeList-C2oU3RQz.js"),__vite__mapDeps([16,1,2,6]))),Je=f(()=>g(()=>import("./LoginCredentials-BHD1SDvP.js"),__vite__mapDeps([17,1,2,5]))),Ke=f(()=>g(()=>import("./WorkUpdates-FoxUuK_b.js"),__vite__mapDeps([18,1,2,19]))),A=f(()=>g(()=>import("./ClientPortal-DPF8gqR9.js"),__vite__mapDeps([20,1,2]))),Ge=f(()=>g(()=>import("./ManagerDashboard-hasJ18JT.js"),__vite__mapDeps([21,1,2]))),Qe=f(()=>g(()=>import("./ManagerCalendar-CSyAUvKU.js"),__vite__mapDeps([22,1,2,11,12,6]))),Xe=f(()=>g(()=>import("./ManagerDailyTodo-NLKfQbXD.js"),__vite__mapDeps([23,1,2]))),Ze=f(()=>g(()=>import("./DesignerWorkload-D2xZsm7y.js"),__vite__mapDeps([24,1,2,25]))),et=f(()=>g(()=>import("./CompletedWorks-BjIwUltz.js"),__vite__mapDeps([26,1,2,27]))),tt=f(()=>g(()=>import("./ManagerSubmissionsReview-DMR8rpro.js"),__vite__mapDeps([28,1,2]))),st=f(()=>g(()=>import("./ManagerClientRework-DOpNdxSO.js"),__vite__mapDeps([29,1,2]))),nt=f(()=>g(()=>import("./ManagerJobWorks-DL7U8kBT.js"),__vite__mapDeps([30,1,2,5]))),ot=f(()=>g(()=>import("./ManagerSubDepartmentList-B1ER-Uem.js"),__vite__mapDeps([31,1,2]))),rt=f(()=>g(()=>import("./ManagerEmployeeList-CBmzYPxx.js"),__vite__mapDeps([32,1,2,5,33,34]))),at=f(()=>g(()=>import("./ManagerEfficiency-C_KTi9qa.js"),__vite__mapDeps([33,1,2,34]))),U=f(()=>g(()=>import("./SMMTodayPosting-CX8AYXCT.js"),__vite__mapDeps([35,1,2]))),H=f(()=>g(()=>import("./SMMMonthlyPosting-RI-oo_V4.js"),__vite__mapDeps([36,1,2,5]))),Y=f(()=>g(()=>import("./SMMPosted-BtPn3Wzb.js"),__vite__mapDeps([37,1,2,5]))),it=f(()=>g(()=>import("./WritersAssignment-Cdz5GxZT.js"),__vite__mapDeps([38,1,2]))),lt=f(()=>g(()=>import("./EmployeeDashboard-D99RBh5e.js"),__vite__mapDeps([39,1,2]))),ct=f(()=>g(()=>import("./EmployeeCalendar-ChAT6qOW.js"),__vite__mapDeps([40,1,2,11,12,6]))),T=f(()=>g(()=>import("./EmployeeEventCalendar-DJ-dv8qq.js"),__vite__mapDeps([41,1,2]))),dt=f(()=>g(()=>import("./EmployeeAssignedWork-BQnG2-d8.js"),__vite__mapDeps([42,1,2]))),mt=f(()=>g(()=>import("./EmployeeReassignedWork-oa1-GtZ9.js"),__vite__mapDeps([43,1,2]))),pt=f(()=>g(()=>import("./EmployeeApprovedWork-BB6ejfyK.js"),__vite__mapDeps([44,1,2,5]))),ut=f(()=>g(()=>import("./EmployeeTodayDeliverables-Bq0IHTmT.js"),__vite__mapDeps([45,1,2]))),ht=f(()=>g(()=>import("./EmployeeRework-CINTcCHY.js"),__vite__mapDeps([46,1,2]))),xt=f(()=>g(()=>import("./EmployeeOverallWork-g6oizE8g.js"),__vite__mapDeps([47,1,2]))),gt=f(()=>g(()=>import("./SuperAdminDashboard-DT-3qWK2.js"),__vite__mapDeps([48,1,2]))),ft=f(()=>g(()=>import("./SuperAdminClients-UpHFHbf7.js"),__vite__mapDeps([49,1,2,5]))),bt=f(()=>g(()=>import("./SuperAdminEfficiency-DhuY4rcq.js"),__vite__mapDeps([50,1,2,5]))),jt=f(()=>g(()=>import("./SuperAdminBranches-UspPk-kk.js"),__vite__mapDeps([51,1,2,5]))),yt=f(()=>g(()=>import("./SuperAdminBranchDetail-B9tJfqPz.js"),__vite__mapDeps([52,1,2,5]))),_t=f(()=>g(()=>import("./SuperAdminProfile-BgIoTGCU.js"),__vite__mapDeps([53,1,2]))),P=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),z=()=>{try{const o=localStorage.getItem("erp_user");return o?JSON.parse(o):null}catch{return null}},D=()=>{const{isCollapsed:o}=X();return e.jsxs("div",{className:`app-layout ${o?"sidebar-collapsed":""}`,children:[e.jsx(De,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(Oe,{}),e.jsx("main",{className:"main-content-scroll",style:{flex:1,overflowY:"auto",minHeight:0},children:e.jsx(j.Suspense,{fallback:e.jsx(P,{}),children:e.jsx(ve,{})})})]})]})},vt=()=>{const{isAuthenticated:o,user:t,loading:s}=L(),r=t||z();return s?e.jsx(P,{}):!r||r.role!=="super_admin"?e.jsx(k,{to:"/login",replace:!0}):e.jsx(D,{})},wt=()=>{const{isAuthenticated:o,user:t,isAdmin:s,loading:r}=L(),n=t||z(),c=s||n&&(n.role==="admin"||n.role==="super_admin");return r?e.jsx(P,{}):!n||!c?e.jsx(k,{to:"/login",replace:!0}):e.jsx(D,{})},kt=()=>{const{isAuthenticated:o,user:t,loading:s}=L(),r=t||z();return s?e.jsx(P,{}):!r||r.role!=="manager"&&r.role!=="admin"&&r.role!=="super_admin"?e.jsx(k,{to:"/login",replace:!0}):e.jsx(D,{})},Et=()=>{const{isAuthenticated:o,user:t,loading:s}=L(),r=t||z(),n=((r==null?void 0:r.username)||"").trim().toLowerCase(),c=r&&(r.role==="client"||r.user_type==="client"||n==="gem"||n==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(P,{}):c?e.jsx(D,{}):e.jsx(k,{to:"/login",replace:!0})},St=()=>{const{isAuthenticated:o,user:t,loading:s}=L(),r=t||z();return s?e.jsx(P,{}):!r||r.role!=="employee"?e.jsx(k,{to:"/login",replace:!0}):e.jsx(D,{})};function Ct(){return e.jsx(ye,{children:e.jsx(Le,{children:e.jsx(Ie,{children:e.jsx(Pe,{children:e.jsx(R,{children:e.jsx(j.Suspense,{fallback:e.jsx(P,{}),children:e.jsxs(_e,{children:[e.jsx(a,{path:"/login",element:e.jsx(Ne,{})}),e.jsxs(a,{path:"/super-admin",element:e.jsx(vt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(gt,{})}),e.jsx(a,{path:"clients",element:e.jsx(ft,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(bt,{})}),e.jsx(a,{path:"branches",element:e.jsx(jt,{})}),e.jsx(a,{path:"branches/:id",element:e.jsx(yt,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(T,{})})}),e.jsx(a,{path:"profile",element:e.jsx(_t,{})}),e.jsx(a,{index:!0,element:e.jsx(k,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/admin",element:e.jsx(wt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Me,{})}),e.jsx(a,{path:"clients",element:e.jsx(Be,{})}),e.jsx(a,{path:"departments",element:e.jsx(Ve,{})}),e.jsx(a,{path:"managers",element:e.jsx(We,{})}),e.jsx(a,{path:"employees",element:e.jsx($e,{})}),e.jsx(a,{path:"projects",element:e.jsx(Fe,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(T,{})})}),e.jsx(a,{path:"deliverables",element:e.jsx(qe,{})}),e.jsx(a,{path:"reports",element:e.jsx(Ue,{})}),e.jsx(a,{path:"superadmin-reports",element:e.jsx(He,{})}),e.jsx(a,{path:"activity-types",element:e.jsx(Ye,{})}),e.jsx(a,{path:"credentials",element:e.jsx(Je,{})}),e.jsx(a,{path:"work-updates",element:e.jsx(Ke,{})}),e.jsx(a,{index:!0,element:e.jsx(k,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/manager",element:e.jsx(kt,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(Ge,{})}),e.jsx(a,{path:"calendar",element:e.jsx(Qe,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(T,{})})}),e.jsx(a,{path:"daily-todo",element:e.jsx(Xe,{})}),e.jsx(a,{path:"designer-workload",element:e.jsx(Ze,{})}),e.jsx(a,{path:"completed-works",element:e.jsx(et,{})}),e.jsx(a,{path:"sub-departments",element:e.jsx(ot,{})}),e.jsx(a,{path:"employees",element:e.jsx(rt,{})}),e.jsx(a,{path:"efficiency",element:e.jsx(at,{})}),e.jsx(a,{path:"submissions-review",element:e.jsx(R,{children:e.jsx(tt,{})})}),e.jsx(a,{path:"client-reworks",element:e.jsx(st,{})}),e.jsx(a,{path:"job-works",element:e.jsx(nt,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(U,{})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(H,{})}),e.jsx(a,{path:"posted",element:e.jsx(Y,{})}),e.jsx(a,{path:"writers-assignment",element:e.jsx(R,{children:e.jsx(it,{})})}),e.jsx(a,{index:!0,element:e.jsx(k,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/employee",element:e.jsx(St,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(lt,{})}),e.jsx(a,{path:"calendar",element:e.jsx(ct,{})}),e.jsx(a,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(T,{})})}),e.jsx(a,{path:"assigned-work",element:e.jsx(dt,{})}),e.jsx(a,{path:"reassigned-work",element:e.jsx(mt,{})}),e.jsx(a,{path:"approved-work",element:e.jsx(pt,{})}),e.jsx(a,{path:"overall-work",element:e.jsx(xt,{})}),e.jsx(a,{path:"today",element:e.jsx(ut,{})}),e.jsx(a,{path:"rework",element:e.jsx(ht,{})}),e.jsx(a,{path:"today-posting",element:e.jsx(U,{isEmployee:!0})}),e.jsx(a,{path:"monthly-posting",element:e.jsx(H,{isEmployee:!0})}),e.jsx(a,{path:"posted",element:e.jsx(Y,{isEmployee:!0})}),e.jsx(a,{index:!0,element:e.jsx(k,{to:"dashboard",replace:!0})})]}),e.jsxs(a,{path:"/client",element:e.jsx(Et,{}),children:[e.jsx(a,{path:"dashboard",element:e.jsx(A,{activeTabProp:"dashboard"})}),e.jsx(a,{path:"approvals",element:e.jsx(A,{activeTabProp:"approvals"})}),e.jsx(a,{path:"reachskyline-approvals",element:e.jsx(A,{activeTabProp:"reachskyline_approvals"})}),e.jsx(a,{path:"reports",element:e.jsx(A,{activeTabProp:"reports"})}),e.jsx(a,{path:"contact",element:e.jsx(A,{activeTabProp:"contact"})}),e.jsx(a,{path:"portal",element:e.jsx(k,{to:"/client/dashboard",replace:!0})}),e.jsx(a,{index:!0,element:e.jsx(k,{to:"dashboard",replace:!0})})]}),e.jsx(a,{path:"*",element:e.jsx(k,{to:"/login",replace:!0})})]})})})})})})})}window.alert=o=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const d=document.createElement("style");d.textContent=`
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
    `,document.head.appendChild(d),document.body.appendChild(t)}t.innerHTML="";let s="info",r="Notification";const n=(o||"").toLowerCase();n.includes("already approved")||n.includes("can't edit")||n.includes("cannot edit")?(s="info",r="Info"):n.includes("success")||n.includes("approve")||n.includes("submit")?(s="success",r="Success"):(n.includes("fail")||n.includes("error")||n.includes("invalid")||n.includes("please"))&&(s="error",r="Alert");let c="";s==="success"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const i=document.createElement("div");i.className="custom-alert-backdrop";const u=document.createElement("div");u.className="custom-alert-box",u.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${c}
    </div>
    <h3 class="custom-alert-title">${r}</h3>
    <p class="custom-alert-message">${o}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(i),t.appendChild(u);const l=()=>{u.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{t.contains(i)&&t.removeChild(i),t.contains(u)&&t.removeChild(u)},300)},y=u.querySelector(".custom-alert-btn");y.addEventListener("click",l),i.addEventListener("click",l),requestAnimationFrame(()=>{i.classList.add("show"),u.classList.add("show"),y.focus()})};window.confirm=o=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const y=document.createElement("style");y.textContent=`
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
      `,document.head.appendChild(y),document.body.appendChild(s)}s.innerHTML="";const r=document.createElement("div");r.className="custom-confirm-backdrop";const n=document.createElement("div");n.className="custom-confirm-box";const c='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';n.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${c}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${o}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(r),s.appendChild(n);const i=y=>{n.classList.remove("show"),r.classList.remove("show"),setTimeout(()=>{s.contains(r)&&s.removeChild(r),s.contains(n)&&s.removeChild(n),t(y)},300)},u=n.querySelector(".custom-confirm-btn-cancel"),l=n.querySelector(".custom-confirm-btn-confirm");u.addEventListener("click",()=>i(!1)),l.addEventListener("click",()=>i(!0)),r.addEventListener("click",()=>i(!1)),requestAnimationFrame(()=>{r.classList.add("show"),n.classList.add("show"),l.focus()})});if(typeof window<"u"){const o=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var r;const s=((r=t.reason)==null?void 0:r.message)||String(t.reason||"");o(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var r;const s=t.message||String(((r=t.error)==null?void 0:r.message)||"");o(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}we.createRoot(document.getElementById("root")).render(e.jsx(K.StrictMode,{children:e.jsx(Ct,{})}));export{p as A,Te as M,E as a,Ae as r,L as u};
