const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-BOUYzS8T.js","assets/vendor-react-CnLd-tL1.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-CsMNpJyh.js","assets/ClientList-CqdgfzMA.js","assets/Table-CGgb8Dkh.js","assets/FormFields-Bx8natPv.js","assets/DepartmentList-M5iqLZu1.js","assets/ManagerList-BNqw8hRS.js","assets/EmployeeList-D4tPrwcX.js","assets/ProjectList-Ok-3PAe-.js","assets/ContentCalendarView-C-ua1Hqe.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-DMqJM_m2.js","assets/ReportDashboard-D_Z5uLm2.js","assets/SuperadminReports-DyZ0TaSm.js","assets/ActivityTypeList-BK-IUbyb.js","assets/LoginCredentials-CS0ETSCY.js","assets/WorkUpdates-CbG2XKm8.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-0A9VCFJA.js","assets/ManagerDashboard-Blgp3wN_.js","assets/ManagerCalendar-DsiSGe9P.js","assets/ManagerDailyTodo-BgCAWCVx.js","assets/DesignerWorkload-DNDNuNjg.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-DdRB8KzB.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-CY6y5ISt.js","assets/ManagerClientRework-CxPzAQqb.js","assets/ManagerJobWorks-BtnxnyHc.js","assets/ManagerSubDepartmentList-BGzZfmIi.js","assets/ManagerEmployeeList-NCyeLL68.js","assets/ManagerEfficiency-BeDBGULr.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-OkGf6euv.js","assets/SMMMonthlyPosting-wja02mbt.js","assets/SMMPosted-C6gXK1KS.js","assets/WritersAssignment-tAT8IkZf.js","assets/EmployeeDashboard-B72nbKNg.js","assets/EmployeeCalendar-DWSTd4hP.js","assets/EmployeeEventCalendar-cRfH9jLE.js","assets/EmployeeAssignedWork-DEIZ8roo.js","assets/EmployeeReassignedWork-DoV6X4mT.js","assets/EmployeeApprovedWork-EM5fAmIg.js","assets/EmployeeTodayDeliverables-m1R-J6gu.js","assets/EmployeeRework-DebKnJ2a.js","assets/EmployeeOverallWork-DwgwYUYT.js","assets/SuperAdminDashboard-XBJlXljN.js","assets/SuperAdminClients-Buj_0GnG.js","assets/SuperAdminEfficiency-buzYPDgU.js","assets/SuperAdminBranches-DUtXh2tQ.js","assets/SuperAdminBranchDetail-CmKAg_2t.js","assets/SuperAdminProfile-XcUt5Dzf.js"])))=>i.map(i=>d[i]);
var me=Object.defineProperty;var ue=(a,t,s)=>t in a?me(a,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[t]=s;var K=(a,t,s)=>ue(a,typeof t!="symbol"?t+"":t,s);import{r as b,j as e,N as G,L as xe,a as C,C as z,F as B,B as V,P as he,b as Q,U as I,c as D,d as fe,e as O,f as W,g as q,R as F,h as ge,K as be,A as se,i as je,G as _e,X as ne,M as ye,k as ve,l as we,S as Ee,m as ke,n as Se,o as Ce,p as Le,q as oe,s as Re,t as Pe,u as r,v as w,O as Ie,w as Ae}from"./vendor-react-CnLd-tL1.js";import{f as ze}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const p of n)if(p.type==="childList")for(const i of p.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const p={};return n.integrity&&(p.integrity=n.integrity),n.referrerPolicy&&(p.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?p.credentials="include":n.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function o(n){if(n.ep)return;n.ep=!0;const p=s(n);fetch(n.href,p)}})();const De="modulepreload",Oe=function(a){return"/"+a},X={},h=function(t,s,o){let n=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),m=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=Promise.allSettled(s.map(l=>{if(l=Oe(l),l in X)return;X[l]=!0;const j=l.endsWith(".css"),c=j?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const g=document.createElement("link");if(g.rel=j?"stylesheet":De,j||(g.as="script"),g.crossOrigin="",g.href=l,m&&g.setAttribute("nonce",m),document.head.appendChild(g),j)return new Promise((_,d)=>{g.addEventListener("load",_),g.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${l}`)))})}))}function p(i){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=i,window.dispatchEvent(m),!m.defaultPrevented)throw i}return n.then(i=>{for(const m of i||[])m.status==="rejected"&&p(m.reason);return t().catch(p)})},Te=()=>{const a="http://localhost:5050/api";{const t=a.trim().replace(/\/+$/,"");return t==="/api"||t.startsWith("/api/")||t.endsWith("/api")?t:`${t}/api`}},E=ze.create({baseURL:Te(),timeout:3e4,headers:{"Content-Type":"application/json"}});E.interceptors.request.use(a=>{const t=localStorage.getItem("erp_token");return t&&(a.headers.Authorization=`Bearer ${t}`),a},a=>Promise.reject(a));E.interceptors.response.use(a=>a,async a=>{var m,l,j;const{config:t,response:s}=a,o=((m=t==null?void 0:t.method)==null?void 0:m.toLowerCase())==="get",n=!s,p=s&&s.status>=500;if(t&&o&&(n||p)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${a.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(g=>setTimeout(g,c)),E(t)}if(s&&(s.status===401||s.status===403&&(((l=s.data)==null?void 0:l.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((j=s.data)==null?void 0:j.errors)&&s.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))){const c=localStorage.getItem("erp_user");c&&(c.includes('"role":"client"')||c.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(a)});const re=b.createContext(null),Ne=({children:a})=>{const[t,s]=b.useState(()=>{try{const c=localStorage.getItem("erp_user");return c?JSON.parse(c):null}catch{return null}}),[o,n]=b.useState(!1),p=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(g){var d,v;const _=async()=>{var y,k;try{const A=(k=(y=g.User)==null?void 0:y.PushSubscription)==null?void 0:k.id;A&&await E.post("/notifications/subscribe",{subscriptionId:A}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{g.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(y=>{console.warn("[OneSignal] Domain initialization deferred:",(y==null?void 0:y.message)||y)}),window.__oneSignalInitialized=!0}catch(y){console.warn("[OneSignal] Init warning:",y.message)}_();try{(v=(d=g.User)==null?void 0:d.PushSubscription)==null||v.addEventListener("change",function(y){var k;(k=y==null?void 0:y.current)!=null&&k.optedIn&&_()})}catch{}})}catch{}};b.useEffect(()=>{(async()=>{const g=localStorage.getItem("erp_token"),_=localStorage.getItem("erp_user");let d=null;try{d=_?JSON.parse(_):null}catch{}if(!g){if(d&&d.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(d),n(!1);return}s(null),n(!1);return}try{const v=await E.get("/auth/session");if(v.data&&v.data.success){const y=v.data.data.user;s(y),localStorage.setItem("erp_user",JSON.stringify(y))}else d&&d.role==="client"?s(d):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{d&&d.role==="client"&&s(d)}finally{n(!1)}})()},[]),b.useEffect(()=>{t&&p(t)},[t]);const i=async(c,g,_)=>{try{const d=await E.post("/auth/login",{username:c,password:g},{onRetry:_});if(d.data&&d.data.success){const{token:v,user:y}=d.data.data;return localStorage.setItem("erp_token",v||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(y)),s(y),n(!1),{success:!0}}}catch(d){console.error("[AuthContext] Login error caught:",d);let v="Wrong credentials! Invalid username or password.";d.response&&d.response.data&&d.response.data.message?v=d.response.data.message:d.code==="ECONNABORTED"||d.message&&d.message.includes("timeout")?v="Connection timed out. The server took too long to respond.":!d.response&&(d.code==="ERR_NETWORK"||d.message&&d.message.toLowerCase().includes("network"))?v="Network error: Cannot reach backend server. Please verify the server is running.":d.message&&(v=d.message);const y=d.response&&d.response.data&&d.response.data.errors?d.response.data.errors:[];return{success:!1,message:v,errors:y}}},m=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var g,_;try{const d=(_=(g=c.User)==null?void 0:g.PushSubscription)==null?void 0:_.id;d&&await E.post("/notifications/unsubscribe",{subscriptionId:d}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),n(!1)},l=c=>{s(g=>{if(!g)return null;const _={...g,...c};return localStorage.setItem("erp_user",JSON.stringify(_)),_})},j={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:o,login:i,logout:m,updateCurrentUser:l};return e.jsx(re.Provider,{value:j,children:a})},L=()=>{const a=b.useContext(re);return a||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},Me=b.createContext(null),Be=({children:a})=>{const[t,s]=b.useState([]),[o,n]=b.useState(0),{isAuthenticated:p}=L(),i=b.useCallback(async()=>{if(p)try{const c=await E.get("/notifications");if(c.data&&c.data.success){const g=c.data.data.notifications;s(g);const _=g.filter(d=>!d.is_read).length;n(_)}}catch{}},[p]),m=async c=>{try{await E.patch(`/notifications/${c}/read`),s(g=>g.map(_=>_.id===parseInt(c)?{..._,is_read:1}:_)),n(g=>Math.max(0,g-1))}catch(g){console.error("Failed to mark notification as read:",g.message)}},l=async()=>{try{await E.post("/notifications/read-all"),s(c=>c.map(g=>({...g,is_read:1}))),n(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};b.useEffect(()=>{if(p){i();const c=setInterval(i,3e4);return()=>clearInterval(c)}else s([]),n(0)},[p,i]);const j={notifications:t,unreadCount:o,fetchNotifications:i,markAsRead:m,markAllRead:l};return e.jsx(Me.Provider,{value:j,children:a})},ae=b.createContext({isCollapsed:!1,toggleSidebar:()=>{},closeSidebar:()=>{},openSidebar:()=>{}}),Ve=({children:a})=>{const[t,s]=b.useState(()=>{try{return localStorage.getItem("erp_sidebar_collapsed")==="true"}catch{return!1}}),o=b.useCallback(()=>{s(i=>{const m=!i;try{localStorage.setItem("erp_sidebar_collapsed",String(m))}catch{}return m})},[]),n=b.useCallback(()=>{s(!0);try{localStorage.setItem("erp_sidebar_collapsed","true")}catch{}},[]),p=b.useCallback(()=>{s(!1);try{localStorage.setItem("erp_sidebar_collapsed","false")}catch{}},[]);return b.useEffect(()=>{const i=m=>{var l,j;if((m.ctrlKey||m.metaKey)&&m.key.toLowerCase()==="b"){const c=(j=(l=document.activeElement)==null?void 0:l.tagName)==null?void 0:j.toLowerCase();c!=="input"&&c!=="textarea"&&(m.preventDefault(),o())}};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[o]),e.jsx(ae.Provider,{value:{isCollapsed:t,toggleSidebar:o,closeSidebar:n,openSidebar:p},children:a})},ie=()=>b.useContext(ae),We="/assets/reachskyline-logo-DpVD33Dn.webp",$e=()=>{const{logout:a,user:t}=L(),s=()=>{const i=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(Q,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(q,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(se,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(I,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(je,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(D,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(D,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(V,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(_e,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&i.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(B,{size:20})}),i.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(ge,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(be,{size:20})}),i},o=()=>{var l,j,c,g,_;const i=window.location.pathname.startsWith("/client");if((t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||i)return[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(C,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(z,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(B,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(V,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(he,{size:20})}];if((t==null?void 0:t.role)==="super_admin")return[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(Q,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(I,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(D,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(V,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(fe,{size:20})}];if((t==null?void 0:t.role)==="manager")return((l=t==null?void 0:t.managerProfile)==null?void 0:l.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(I,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(O,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(W,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(z,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(O,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(z,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(W,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(D,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(I,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(q,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(I,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(V,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(B,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx(F,{size:20})}];if((t==null?void 0:t.role)==="employee"){if(((j=t==null?void 0:t.employeeProfile)==null?void 0:j.department_code)==="SMM-RS")return[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(O,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(W,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(z,{size:20})}];const d=Number((c=t==null?void 0:t.employeeProfile)==null?void 0:c.sub_department_id),v=(g=t==null?void 0:t.employeeProfile)==null?void 0:g.sub_department_code,y=(((_=t==null?void 0:t.employeeProfile)==null?void 0:_.sub_department_name)||"").toLowerCase();return d===1||v==="CW-RS"||y.includes("writer")||y.includes("content")?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(D,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(O,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(B,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(W,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(O,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx(F,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(z,{size:20})}]}return s()},n=()=>{document.body.classList.remove("mobile-sidebar-open")},p=o();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:n}),e.jsxs("aside",{className:"sidebar",children:[e.jsx("div",{className:"sidebar-logo",children:e.jsx(G,{to:"/",onClick:n,className:"sidebar-logo-link",title:"ReachSkyline ERP",children:e.jsx("img",{src:We,alt:"ReachSkyline Logo",className:"sidebar-brand-img"})})}),e.jsx("ul",{className:"sidebar-menu",children:p.map((i,m)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(G,{to:i.path,state:i.state,onClick:n,className:({isActive:l})=>`sidebar-link ${l?"active":""}`,children:[i.icon,e.jsx("span",{children:i.label})]})},m))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:a,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:i=>{i.currentTarget.style.color="#f87171"},onMouseLeave:i=>{i.currentTarget.style.color="var(--danger)"},children:[e.jsx(xe,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Fe=({isOpen:a,onClose:t,title:s,children:o,footer:n=null})=>(b.useEffect(()=>(a?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[a]),a?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:p=>p.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(ne,{size:20})})]}),e.jsx("div",{className:"modal-body",children:o}),n&&e.jsx("div",{className:"modal-footer",children:n})]})}):null),qe=()=>{var H;const{user:a,logout:t}=L(),{isCollapsed:s,toggleSidebar:o}=ie(),[n,p]=b.useState(""),[i,m]=b.useState(!1),[l,j]=b.useState(null),[c,g]=b.useState(!1),[_,d]=b.useState(!1),[v,y]=b.useState(!1),k=b.useCallback(()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})},[]);b.useEffect(()=>{const x=()=>{y(!!document.fullscreenElement)};return document.addEventListener("fullscreenchange",x),()=>document.removeEventListener("fullscreenchange",x)},[]);const A=()=>{const x=!_;d(x),x?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};b.useEffect(()=>{const x=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),d(!1))};return window.addEventListener("resize",x),()=>window.removeEventListener("resize",x)},[]);const le=async x=>{if(x.preventDefault(),!!n.trim()){m(!0),g(!0);try{const S=await E.get(`/search?q=${encodeURIComponent(n)}`);S.data&&S.data.success&&j(S.data.data)}catch(S){console.error("Global search error:",S.message)}finally{m(!1)}}},U=window.location.pathname.startsWith("/client"),u=U?a&&(a.role==="client"||a.user_type==="client")?a:{username:"gem",full_name:"rajesh kumar",role:"client"}:a,ce=u&&u.username?u.username.slice(0,2).toUpperCase():"CL",de=()=>{var x,S,Y,J;return U||(u==null?void 0:u.role)==="client"?"Client Partner":(u==null?void 0:u.role)==="manager"?((x=u==null?void 0:u.managerProfile)==null?void 0:x.department_code)==="SMM-RS"?"SMM Manager":(S=u==null?void 0:u.managerProfile)!=null&&S.department_name?`${u.managerProfile.department_name} Manager`:"Brand Manager":(u==null?void 0:u.role)==="employee"?((Y=u==null?void 0:u.employeeProfile)==null?void 0:Y.department_code)==="SMM-RS"?"SMM Employee":(J=u==null?void 0:u.employeeProfile)!=null&&J.department_name?`${u.employeeProfile.department_name} Employee`:"Employee":(u==null?void 0:u.role)==="admin"?"Administrator":(u==null?void 0:u.role)==="super_admin"?"Super Administrator":(u==null?void 0:u.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:A,"aria-label":"Toggle Navigation",children:_?e.jsx(ne,{size:24}):e.jsx(ye,{size:24})}),e.jsx("button",{type:"button",className:"sidebar-toggle-btn",onClick:o,title:s?"Open sidebar (Ctrl+B)":"Close sidebar - Full page view (Ctrl+B)","aria-label":s?"Open sidebar":"Close sidebar",children:s?e.jsx(ve,{size:19}):e.jsx(we,{size:19})}),e.jsx("form",{onSubmit:le,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(Ee,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:n,onChange:x=>p(x.target.value)})]})})]}),e.jsxs("div",{className:"header-actions",children:[e.jsx("button",{type:"button",className:"header-icon-btn",onClick:k,title:v?"Exit Fullscreen (Esc)":"Enter Fullscreen","aria-label":v?"Exit Fullscreen":"Enter Fullscreen",children:v?e.jsx(ke,{size:18}):e.jsx(Se,{size:18})}),e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:ce}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((H=u==null?void 0:u.clientProfile)==null?void 0:H.company_name)||(u==null?void 0:u.full_name)||(u==null?void 0:u.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:de()})]})]})]}),e.jsx(Fe,{isOpen:c,onClose:()=>{g(!1),j(null)},title:`Search Results for "${n}"`,children:i?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):l?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[l.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(Ce,{size:16,className:"text-primary"})," Clients (",l.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.clients.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${x.id}`,style:{fontWeight:600},children:x.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.client_name," • ",x.client_id_code]})]},x.id))})]}),l.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(q,{size:16,className:"text-teal"})," Departments (",l.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.departments.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${x.id}`,style:{fontWeight:600},children:x.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:x.code})]},x.id))})]}),l.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(se,{size:16,className:"text-secondary"})," Managers (",l.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.managers.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.manager_id_code," • ",x.department_name]})]},x.id))})]}),l.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(I,{size:16,className:"text-purple"})," Employees (",l.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.employees.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${x.id}`,style:{fontWeight:600},children:x.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[x.employee_id_code," • ",x.department_name]})]},x.id))})]}),l.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(Le,{size:16,className:"text-orange"})," Projects (",l.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.projects.map(x=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${x.id}`,style:{fontWeight:600},children:x.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",x.client_name," • Manager: ",x.manager_name]})]},x.id))})]}),l.clients.length===0&&l.departments.length===0&&l.managers.length===0&&l.employees.length===0&&l.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',n,'".']})})]}):null})]})};class R extends oe.Component{constructor(s){super(s);K(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,o){var p,i,m;if(console.error("ErrorBoundary caught an error:",s,o),this.setState({errorInfo:o}),s&&(s.name==="ChunkLoadError"||((p=s.message)==null?void 0:p.includes("Failed to fetch dynamically imported module"))||((i=s.message)==null?void 0:i.includes("Importing a module script failed"))||((m=s.message)==null?void 0:m.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,o;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((o=this.state.errorInfo)==null?void 0:o.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const f=a=>b.lazy(()=>a().catch(t=>{var o,n,p;throw t&&(t.name==="ChunkLoadError"||((o=t.message)==null?void 0:o.includes("Failed to fetch dynamically imported module"))||((n=t.message)==null?void 0:n.includes("Importing a module script failed"))||((p=t.message)==null?void 0:p.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Ue=f(()=>h(()=>import("./Login-BOUYzS8T.js"),__vite__mapDeps([0,1,2]))),He=f(()=>h(()=>import("./AdminDashboard-CsMNpJyh.js"),__vite__mapDeps([3,1,2]))),Ye=f(()=>h(()=>import("./ClientList-CqdgfzMA.js"),__vite__mapDeps([4,1,2,5,6]))),Je=f(()=>h(()=>import("./DepartmentList-M5iqLZu1.js"),__vite__mapDeps([7,1,2,6]))),Ke=f(()=>h(()=>import("./ManagerList-BNqw8hRS.js"),__vite__mapDeps([8,1,2,5,6]))),Ge=f(()=>h(()=>import("./EmployeeList-D4tPrwcX.js"),__vite__mapDeps([9,1,2,5,6]))),Qe=f(()=>h(()=>import("./ProjectList-Ok-3PAe-.js"),__vite__mapDeps([10,1,2,11,12,6]))),Xe=f(()=>h(()=>import("./DeliverableList-DMqJM_m2.js"),__vite__mapDeps([13,1,2,5,6]))),Ze=f(()=>h(()=>import("./ReportDashboard-D_Z5uLm2.js"),__vite__mapDeps([14,1,2]))),et=f(()=>h(()=>import("./SuperadminReports-DyZ0TaSm.js"),__vite__mapDeps([15,1,2,5]))),tt=f(()=>h(()=>import("./ActivityTypeList-BK-IUbyb.js"),__vite__mapDeps([16,1,2,6]))),st=f(()=>h(()=>import("./LoginCredentials-CS0ETSCY.js"),__vite__mapDeps([17,1,2,5]))),nt=f(()=>h(()=>import("./WorkUpdates-CbG2XKm8.js"),__vite__mapDeps([18,1,2,19]))),T=f(()=>h(()=>import("./ClientPortal-0A9VCFJA.js"),__vite__mapDeps([20,1,2]))),ot=f(()=>h(()=>import("./ManagerDashboard-Blgp3wN_.js"),__vite__mapDeps([21,1,2]))),rt=f(()=>h(()=>import("./ManagerCalendar-DsiSGe9P.js"),__vite__mapDeps([22,1,2,11,12,6]))),at=f(()=>h(()=>import("./ManagerDailyTodo-BgCAWCVx.js"),__vite__mapDeps([23,1,2]))),it=f(()=>h(()=>import("./DesignerWorkload-DNDNuNjg.js"),__vite__mapDeps([24,1,2,25]))),lt=f(()=>h(()=>import("./CompletedWorks-DdRB8KzB.js"),__vite__mapDeps([26,1,2,27]))),ct=f(()=>h(()=>import("./ManagerSubmissionsReview-CY6y5ISt.js"),__vite__mapDeps([28,1,2]))),dt=f(()=>h(()=>import("./ManagerClientRework-CxPzAQqb.js"),__vite__mapDeps([29,1,2]))),pt=f(()=>h(()=>import("./ManagerJobWorks-BtnxnyHc.js"),__vite__mapDeps([30,1,2,5]))),mt=f(()=>h(()=>import("./ManagerSubDepartmentList-BGzZfmIi.js"),__vite__mapDeps([31,1,2]))),ut=f(()=>h(()=>import("./ManagerEmployeeList-NCyeLL68.js"),__vite__mapDeps([32,1,2,5,33,34]))),xt=f(()=>h(()=>import("./ManagerEfficiency-BeDBGULr.js"),__vite__mapDeps([33,1,2,34]))),Z=f(()=>h(()=>import("./SMMTodayPosting-OkGf6euv.js"),__vite__mapDeps([35,1,2]))),ee=f(()=>h(()=>import("./SMMMonthlyPosting-wja02mbt.js"),__vite__mapDeps([36,1,2,5]))),te=f(()=>h(()=>import("./SMMPosted-C6gXK1KS.js"),__vite__mapDeps([37,1,2,5]))),ht=f(()=>h(()=>import("./WritersAssignment-tAT8IkZf.js"),__vite__mapDeps([38,1,2]))),ft=f(()=>h(()=>import("./EmployeeDashboard-B72nbKNg.js"),__vite__mapDeps([39,1,2]))),gt=f(()=>h(()=>import("./EmployeeCalendar-DWSTd4hP.js"),__vite__mapDeps([40,1,2,11,12,6]))),$=f(()=>h(()=>import("./EmployeeEventCalendar-cRfH9jLE.js"),__vite__mapDeps([41,1,2]))),bt=f(()=>h(()=>import("./EmployeeAssignedWork-DEIZ8roo.js"),__vite__mapDeps([42,1,2]))),jt=f(()=>h(()=>import("./EmployeeReassignedWork-DoV6X4mT.js"),__vite__mapDeps([43,1,2]))),_t=f(()=>h(()=>import("./EmployeeApprovedWork-EM5fAmIg.js"),__vite__mapDeps([44,1,2,5]))),yt=f(()=>h(()=>import("./EmployeeTodayDeliverables-m1R-J6gu.js"),__vite__mapDeps([45,1,2]))),vt=f(()=>h(()=>import("./EmployeeRework-DebKnJ2a.js"),__vite__mapDeps([46,1,2]))),wt=f(()=>h(()=>import("./EmployeeOverallWork-DwgwYUYT.js"),__vite__mapDeps([47,1,2]))),Et=f(()=>h(()=>import("./SuperAdminDashboard-XBJlXljN.js"),__vite__mapDeps([48,1,2]))),kt=f(()=>h(()=>import("./SuperAdminClients-Buj_0GnG.js"),__vite__mapDeps([49,1,2,5]))),St=f(()=>h(()=>import("./SuperAdminEfficiency-buzYPDgU.js"),__vite__mapDeps([50,1,2,5]))),Ct=f(()=>h(()=>import("./SuperAdminBranches-DUtXh2tQ.js"),__vite__mapDeps([51,1,2,5]))),Lt=f(()=>h(()=>import("./SuperAdminBranchDetail-CmKAg_2t.js"),__vite__mapDeps([52,1,2,5]))),Rt=f(()=>h(()=>import("./SuperAdminProfile-XcUt5Dzf.js"),__vite__mapDeps([53,1,2]))),P=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),N=()=>{try{const a=localStorage.getItem("erp_user");return a?JSON.parse(a):null}catch{return null}},M=()=>{const{isCollapsed:a}=ie();return e.jsxs("div",{className:`app-layout ${a?"sidebar-collapsed":""}`,children:[e.jsx($e,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(qe,{}),e.jsx("main",{className:"main-content-scroll",style:{flex:1,overflowY:"auto",minHeight:0},children:e.jsx(b.Suspense,{fallback:e.jsx(P,{}),children:e.jsx(Ie,{})})})]})]})},Pt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),o=t||N();return s?e.jsx(P,{}):!o||o.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(M,{})},It=()=>{const{isAuthenticated:a,user:t,isAdmin:s,loading:o}=L(),n=t||N(),p=s||n&&(n.role==="admin"||n.role==="super_admin");return o?e.jsx(P,{}):!n||!p?e.jsx(w,{to:"/login",replace:!0}):e.jsx(M,{})},At=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),o=t||N();return s?e.jsx(P,{}):!o||o.role!=="manager"&&o.role!=="admin"&&o.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(M,{})},zt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),o=t||N(),n=((o==null?void 0:o.username)||"").trim().toLowerCase(),p=o&&(o.role==="client"||o.user_type==="client"||n==="gem"||n==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(P,{}):p?e.jsx(M,{}):e.jsx(w,{to:"/login",replace:!0})},Dt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),o=t||N();return s?e.jsx(P,{}):!o||o.role!=="employee"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(M,{})};function Ot(){return e.jsx(Re,{children:e.jsx(Ne,{children:e.jsx(Ve,{children:e.jsx(Be,{children:e.jsx(R,{children:e.jsx(b.Suspense,{fallback:e.jsx(P,{}),children:e.jsxs(Pe,{children:[e.jsx(r,{path:"/login",element:e.jsx(Ue,{})}),e.jsxs(r,{path:"/super-admin",element:e.jsx(Pt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Et,{})}),e.jsx(r,{path:"clients",element:e.jsx(kt,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(St,{})}),e.jsx(r,{path:"branches",element:e.jsx(Ct,{})}),e.jsx(r,{path:"branches/:id",element:e.jsx(Lt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx($,{})})}),e.jsx(r,{path:"profile",element:e.jsx(Rt,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/admin",element:e.jsx(It,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(He,{})}),e.jsx(r,{path:"clients",element:e.jsx(Ye,{})}),e.jsx(r,{path:"departments",element:e.jsx(Je,{})}),e.jsx(r,{path:"managers",element:e.jsx(Ke,{})}),e.jsx(r,{path:"employees",element:e.jsx(Ge,{})}),e.jsx(r,{path:"projects",element:e.jsx(Qe,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx($,{})})}),e.jsx(r,{path:"deliverables",element:e.jsx(Xe,{})}),e.jsx(r,{path:"reports",element:e.jsx(Ze,{})}),e.jsx(r,{path:"superadmin-reports",element:e.jsx(et,{})}),e.jsx(r,{path:"activity-types",element:e.jsx(tt,{})}),e.jsx(r,{path:"credentials",element:e.jsx(st,{})}),e.jsx(r,{path:"work-updates",element:e.jsx(nt,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/manager",element:e.jsx(At,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(ot,{})}),e.jsx(r,{path:"calendar",element:e.jsx(rt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx($,{})})}),e.jsx(r,{path:"daily-todo",element:e.jsx(at,{})}),e.jsx(r,{path:"designer-workload",element:e.jsx(it,{})}),e.jsx(r,{path:"completed-works",element:e.jsx(lt,{})}),e.jsx(r,{path:"sub-departments",element:e.jsx(mt,{})}),e.jsx(r,{path:"employees",element:e.jsx(ut,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(xt,{})}),e.jsx(r,{path:"submissions-review",element:e.jsx(R,{children:e.jsx(ct,{})})}),e.jsx(r,{path:"client-reworks",element:e.jsx(dt,{})}),e.jsx(r,{path:"job-works",element:e.jsx(pt,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Z,{})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(ee,{})}),e.jsx(r,{path:"posted",element:e.jsx(te,{})}),e.jsx(r,{path:"writers-assignment",element:e.jsx(R,{children:e.jsx(ht,{})})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/employee",element:e.jsx(Dt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(ft,{})}),e.jsx(r,{path:"calendar",element:e.jsx(gt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx($,{})})}),e.jsx(r,{path:"assigned-work",element:e.jsx(bt,{})}),e.jsx(r,{path:"reassigned-work",element:e.jsx(jt,{})}),e.jsx(r,{path:"approved-work",element:e.jsx(_t,{})}),e.jsx(r,{path:"overall-work",element:e.jsx(wt,{})}),e.jsx(r,{path:"today",element:e.jsx(yt,{})}),e.jsx(r,{path:"rework",element:e.jsx(vt,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(ee,{isEmployee:!0})}),e.jsx(r,{path:"posted",element:e.jsx(te,{isEmployee:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/client",element:e.jsx(zt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(T,{activeTabProp:"dashboard"})}),e.jsx(r,{path:"approvals",element:e.jsx(T,{activeTabProp:"approvals"})}),e.jsx(r,{path:"reachskyline-approvals",element:e.jsx(T,{activeTabProp:"reachskyline_approvals"})}),e.jsx(r,{path:"reports",element:e.jsx(T,{activeTabProp:"reports"})}),e.jsx(r,{path:"contact",element:e.jsx(T,{activeTabProp:"contact"})}),e.jsx(r,{path:"portal",element:e.jsx(w,{to:"/client/dashboard",replace:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsx(r,{path:"*",element:e.jsx(w,{to:"/login",replace:!0})})]})})})})})})})}window.alert=a=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let s="info",o="Notification";const n=(a||"").toLowerCase();n.includes("already approved")||n.includes("can't edit")||n.includes("cannot edit")?(s="info",o="Info"):n.includes("success")||n.includes("approve")||n.includes("submit")?(s="success",o="Success"):(n.includes("fail")||n.includes("error")||n.includes("invalid")||n.includes("please"))&&(s="error",o="Alert");let p="";s==="success"?p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const i=document.createElement("div");i.className="custom-alert-backdrop";const m=document.createElement("div");m.className="custom-alert-box",m.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${p}
    </div>
    <h3 class="custom-alert-title">${o}</h3>
    <p class="custom-alert-message">${a}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(i),t.appendChild(m);const l=()=>{m.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{t.contains(i)&&t.removeChild(i),t.contains(m)&&t.removeChild(m)},300)},j=m.querySelector(".custom-alert-btn");j.addEventListener("click",l),i.addEventListener("click",l),requestAnimationFrame(()=>{i.classList.add("show"),m.classList.add("show"),j.focus()})};window.confirm=a=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const j=document.createElement("style");j.textContent=`
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
      `,document.head.appendChild(j),document.body.appendChild(s)}s.innerHTML="";const o=document.createElement("div");o.className="custom-confirm-backdrop";const n=document.createElement("div");n.className="custom-confirm-box";const p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';n.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${p}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${a}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(o),s.appendChild(n);const i=j=>{n.classList.remove("show"),o.classList.remove("show"),setTimeout(()=>{s.contains(o)&&s.removeChild(o),s.contains(n)&&s.removeChild(n),t(j)},300)},m=n.querySelector(".custom-confirm-btn-cancel"),l=n.querySelector(".custom-confirm-btn-confirm");m.addEventListener("click",()=>i(!1)),l.addEventListener("click",()=>i(!0)),o.addEventListener("click",()=>i(!1)),requestAnimationFrame(()=>{o.classList.add("show"),n.classList.add("show"),l.focus()})});if(typeof window<"u"){const a=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var o;const s=((o=t.reason)==null?void 0:o.message)||String(t.reason||"");a(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var o;const s=t.message||String(((o=t.error)==null?void 0:o.message)||"");a(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}Ae.createRoot(document.getElementById("root")).render(e.jsx(oe.StrictMode,{children:e.jsx(Ot,{})}));export{Fe as M,E as a,We as r,L as u};
