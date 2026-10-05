const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-lX1cpXtO.js","assets/vendor-react-Ddc-MPKp.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-CAfvqd4Q.js","assets/ClientList-BT-wBTvl.js","assets/Table-CA7nEtM4.js","assets/FormFields-CczIJLOW.js","assets/DepartmentList-CiczPUSo.js","assets/ManagerList-BkjZxIxY.js","assets/EmployeeList-COKW5LoF.js","assets/ProjectList-2Azkh-tq.js","assets/ContentCalendarView-BDJPMWu0.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-BLeD6zHM.js","assets/ReportDashboard-CeU8TES0.js","assets/SuperadminReports-BoX57cGF.js","assets/ActivityTypeList-CXT5tt2C.js","assets/LoginCredentials-BgAgtvB4.js","assets/WorkUpdates-DthDFQVT.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-BgeTOKe6.js","assets/ManagerDashboard-CT6bbIRY.js","assets/ManagerCalendar-EKYZdmRN.js","assets/ManagerDailyTodo-BL6l6_F8.js","assets/DesignerWorkload-ClbVJvUH.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-C1bcX6zy.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-D_REgyI2.js","assets/ManagerClientRework-2skgkfOv.js","assets/ManagerJobWorks-CHm1Wfeo.js","assets/ManagerSubDepartmentList-D0DjHsnN.js","assets/ManagerEmployeeList-CuLtKWB8.js","assets/ManagerEfficiency-BvxBe1W8.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-Cq9B6RwQ.js","assets/SMMMonthlyPosting-BzKmOQX9.js","assets/SMMPosted-CS09Ykrp.js","assets/WritersAssignment-DvULbetz.js","assets/EmployeeDashboard-B8C7_S0s.js","assets/EmployeeCalendar-BZ1PQSnA.js","assets/EmployeeEventCalendar-B49EHajD.js","assets/EmployeeAssignedWork-BtUYpXlk.js","assets/EmployeeReassignedWork-CDJokaM6.js","assets/EmployeeApprovedWork-CpA9IXPo.js","assets/EmployeeTodayDeliverables-Dm6L4vBk.js","assets/EmployeeRework-BSBm5xKY.js","assets/EmployeeOverallWork-Hm25PmhC.js","assets/SuperAdminDashboard-BZ7rFdPo.js","assets/SuperAdminClients-BM0vaEDf.js","assets/SuperAdminEfficiency-Bb65ownr.js","assets/SuperAdminBranches-sZEI5G5H.js","assets/SuperAdminBranchDetail-ihUb0obA.js","assets/SuperAdminProfile-C9N6svyB.js"])))=>i.map(i=>d[i]);
var ce=Object.defineProperty;var de=(a,t,s)=>t in a?ce(a,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[t]=s;var Y=(a,t,s)=>de(a,typeof t!="symbol"?t+"":t,s);import{r as j,j as e,N as J,L as pe,a as C,C as A,F as M,B,P as me,b as K,U as I,c as z,d as ue,e as D,f as V,g as F,R as $,h as xe,K as he,A as ee,i as fe,G as ge,X as te,M as be,k as je,l as _e,S as ye,m as ve,n as we,o as se,p as Ee,q as ke,s as r,t as w,O as Se,u as Ce}from"./vendor-react-Ddc-MPKp.js";import{f as Le}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const p of o)if(p.type==="childList")for(const i of p.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(o){const p={};return o.integrity&&(p.integrity=o.integrity),o.referrerPolicy&&(p.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?p.credentials="include":o.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function n(o){if(o.ep)return;o.ep=!0;const p=s(o);fetch(o.href,p)}})();const Re="modulepreload",Pe=function(a){return"/"+a},G={},x=function(t,s,n){let o=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),u=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));o=Promise.allSettled(s.map(l=>{if(l=Pe(l),l in G)return;G[l]=!0;const b=l.endsWith(".css"),c=b?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const f=document.createElement("link");if(f.rel=b?"stylesheet":Re,b||(f.as="script"),f.crossOrigin="",f.href=l,u&&f.setAttribute("nonce",u),document.head.appendChild(f),b)return new Promise((_,d)=>{f.addEventListener("load",_),f.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${l}`)))})}))}function p(i){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=i,window.dispatchEvent(u),!u.defaultPrevented)throw i}return o.then(i=>{for(const u of i||[])u.status==="rejected"&&p(u.reason);return t().catch(p)})},Ie=()=>{const a="http://localhost:5050/api";{const t=a.trim().replace(/\/+$/,"");return t==="/api"||t.startsWith("/api/")||t.endsWith("/api")?t:`${t}/api`}},E=Le.create({baseURL:Ie(),timeout:3e4,headers:{"Content-Type":"application/json"}});E.interceptors.request.use(a=>{const t=localStorage.getItem("erp_token");return t&&(a.headers.Authorization=`Bearer ${t}`),a},a=>Promise.reject(a));E.interceptors.response.use(a=>a,async a=>{var u,l,b;const{config:t,response:s}=a,n=((u=t==null?void 0:t.method)==null?void 0:u.toLowerCase())==="get",o=!s,p=s&&s.status>=500;if(t&&n&&(o||p)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const c=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,c),console.warn(`API call failed: ${a.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${c}ms...`),await new Promise(f=>setTimeout(f,c)),E(t)}if(s&&(s.status===401||s.status===403&&(((l=s.data)==null?void 0:l.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((b=s.data)==null?void 0:b.errors)&&s.data.errors.some(c=>/jwt expired|invalid signature|jwt malformed/i.test(String(c)))))){const c=localStorage.getItem("erp_user");c&&(c.includes('"role":"client"')||c.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(a)});const oe=j.createContext(null),Ae=({children:a})=>{const[t,s]=j.useState(()=>{try{const c=localStorage.getItem("erp_user");return c?JSON.parse(c):null}catch{return null}}),[n,o]=j.useState(!1),p=c=>{if(c)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(f){var d,v;const _=async()=>{var y,k;try{const m=(k=(y=f.User)==null?void 0:y.PushSubscription)==null?void 0:k.id;m&&await E.post("/notifications/subscribe",{subscriptionId:m}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{f.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(y=>{console.warn("[OneSignal] Domain initialization deferred:",(y==null?void 0:y.message)||y)}),window.__oneSignalInitialized=!0}catch(y){console.warn("[OneSignal] Init warning:",y.message)}_();try{(v=(d=f.User)==null?void 0:d.PushSubscription)==null||v.addEventListener("change",function(y){var k;(k=y==null?void 0:y.current)!=null&&k.optedIn&&_()})}catch{}})}catch{}};j.useEffect(()=>{(async()=>{const f=localStorage.getItem("erp_token"),_=localStorage.getItem("erp_user");let d=null;try{d=_?JSON.parse(_):null}catch{}if(!f){if(d&&d.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(d),o(!1);return}s(null),o(!1);return}try{const v=await E.get("/auth/session");if(v.data&&v.data.success){const y=v.data.data.user;s(y),localStorage.setItem("erp_user",JSON.stringify(y))}else d&&d.role==="client"?s(d):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{d&&d.role==="client"&&s(d)}finally{o(!1)}})()},[]),j.useEffect(()=>{t&&p(t)},[t]);const i=async(c,f,_)=>{try{const d=await E.post("/auth/login",{username:c,password:f},{onRetry:_});if(d.data&&d.data.success){const{token:v,user:y}=d.data.data;return localStorage.setItem("erp_token",v||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(y)),s(y),o(!1),{success:!0}}}catch(d){console.error("[AuthContext] Login error caught:",d);let v="Wrong credentials! Invalid username or password.";d.response&&d.response.data&&d.response.data.message?v=d.response.data.message:d.code==="ECONNABORTED"||d.message&&d.message.includes("timeout")?v="Connection timed out. The server took too long to respond.":!d.response&&(d.code==="ERR_NETWORK"||d.message&&d.message.toLowerCase().includes("network"))?v="Network error: Cannot reach backend server. Please verify the server is running.":d.message&&(v=d.message);const y=d.response&&d.response.data&&d.response.data.errors?d.response.data.errors:[];return{success:!1,message:v,errors:y}}},u=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(c){var f,_;try{const d=(_=(f=c.User)==null?void 0:f.PushSubscription)==null?void 0:_.id;d&&await E.post("/notifications/unsubscribe",{subscriptionId:d}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),o(!1)},l=c=>{s(f=>{if(!f)return null;const _={...f,...c};return localStorage.setItem("erp_user",JSON.stringify(_)),_})},b={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:n,login:i,logout:u,updateCurrentUser:l};return e.jsx(oe.Provider,{value:b,children:a})},L=()=>{const a=j.useContext(oe);return a||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},ze=j.createContext(null),De=({children:a})=>{const[t,s]=j.useState([]),[n,o]=j.useState(0),{isAuthenticated:p}=L(),i=j.useCallback(async()=>{if(p)try{const c=await E.get("/notifications");if(c.data&&c.data.success){const f=c.data.data.notifications;s(f);const _=f.filter(d=>!d.is_read).length;o(_)}}catch{}},[p]),u=async c=>{try{await E.patch(`/notifications/${c}/read`),s(f=>f.map(_=>_.id===parseInt(c)?{..._,is_read:1}:_)),o(f=>Math.max(0,f-1))}catch(f){console.error("Failed to mark notification as read:",f.message)}},l=async()=>{try{await E.post("/notifications/read-all"),s(c=>c.map(f=>({...f,is_read:1}))),o(0)}catch(c){console.error("Failed to mark all notifications as read:",c.message)}};j.useEffect(()=>{if(p){i();const c=setInterval(i,3e4);return()=>clearInterval(c)}else s([]),o(0)},[p,i]);const b={notifications:t,unreadCount:n,fetchNotifications:i,markAsRead:u,markAllRead:l};return e.jsx(ze.Provider,{value:b,children:a})},ne=j.createContext({isCollapsed:!1,toggleSidebar:()=>{},closeSidebar:()=>{},openSidebar:()=>{}}),Oe=({children:a})=>{const[t,s]=j.useState(()=>{try{return localStorage.getItem("erp_sidebar_collapsed")==="true"}catch{return!1}}),n=j.useCallback(()=>{s(i=>{const u=!i;try{localStorage.setItem("erp_sidebar_collapsed",String(u))}catch{}return u})},[]),o=j.useCallback(()=>{s(!0);try{localStorage.setItem("erp_sidebar_collapsed","true")}catch{}},[]),p=j.useCallback(()=>{s(!1);try{localStorage.setItem("erp_sidebar_collapsed","false")}catch{}},[]);return j.useEffect(()=>{const i=u=>{var l,b;if((u.ctrlKey||u.metaKey)&&u.key.toLowerCase()==="b"){const c=(b=(l=document.activeElement)==null?void 0:l.tagName)==null?void 0:b.toLowerCase();c!=="input"&&c!=="textarea"&&(u.preventDefault(),n())}};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[n]),e.jsx(ne.Provider,{value:{isCollapsed:t,toggleSidebar:n,closeSidebar:o,openSidebar:p},children:a})},re=()=>j.useContext(ne),Te="/assets/reachskyline-logo-DpVD33Dn.webp",Ne=()=>{const{logout:a,user:t}=L(),s=()=>{const i=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(K,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(F,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(ee,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(I,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(fe,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(z,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(B,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(ge,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&i.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(M,{size:20})}),i.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(xe,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(he,{size:20})}),i},n=()=>{var l,b,c,f,_;const i=window.location.pathname.startsWith("/client");if((t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||i)return[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(C,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(A,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(M,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(B,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(me,{size:20})}];if((t==null?void 0:t.role)==="super_admin")return[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(K,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(I,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(B,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(ue,{size:20})}];if((t==null?void 0:t.role)==="manager")return((l=t==null?void 0:t.managerProfile)==null?void 0:l.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(I,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(V,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(A,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(D,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(A,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(V,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(z,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(I,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(F,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(I,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(B,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(M,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx($,{size:20})}];if((t==null?void 0:t.role)==="employee"){if(((b=t==null?void 0:t.employeeProfile)==null?void 0:b.department_code)==="SMM-RS")return[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(V,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(A,{size:20})}];const d=Number((c=t==null?void 0:t.employeeProfile)==null?void 0:c.sub_department_id),v=(f=t==null?void 0:t.employeeProfile)==null?void 0:f.sub_department_code,y=(((_=t==null?void 0:t.employeeProfile)==null?void 0:_.sub_department_name)||"").toLowerCase();return d===1||v==="CW-RS"||y.includes("writer")||y.includes("content")?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(z,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx($,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(M,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(V,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx($,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(A,{size:20})}]}return s()},o=()=>{document.body.classList.remove("mobile-sidebar-open")},p=n();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:o}),e.jsxs("aside",{className:"sidebar",children:[e.jsx("div",{className:"sidebar-logo",children:e.jsx(J,{to:"/",onClick:o,className:"sidebar-logo-link",title:"ReachSkyline ERP",children:e.jsx("img",{src:Te,alt:"ReachSkyline Logo",className:"sidebar-brand-img"})})}),e.jsx("ul",{className:"sidebar-menu",children:p.map((i,u)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(J,{to:i.path,state:i.state,onClick:o,className:({isActive:l})=>`sidebar-link ${l?"active":""}`,children:[i.icon,e.jsx("span",{children:i.label})]})},u))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:a,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:i=>{i.currentTarget.style.color="#f87171"},onMouseLeave:i=>{i.currentTarget.style.color="var(--danger)"},children:[e.jsx(pe,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Me=({isOpen:a,onClose:t,title:s,children:n,footer:o=null})=>(j.useEffect(()=>(a?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[a]),a?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:p=>p.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(te,{size:20})})]}),e.jsx("div",{className:"modal-body",children:n}),o&&e.jsx("div",{className:"modal-footer",children:o})]})}):null),Be=()=>{var q;const{user:a,logout:t}=L(),{isCollapsed:s,toggleSidebar:n}=re(),[o,p]=j.useState(""),[i,u]=j.useState(!1),[l,b]=j.useState(null),[c,f]=j.useState(!1),[_,d]=j.useState(!1),v=()=>{const g=!_;d(g),g?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};j.useEffect(()=>{const g=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),d(!1))};return window.addEventListener("resize",g),()=>window.removeEventListener("resize",g)},[]);const y=async g=>{if(g.preventDefault(),!!o.trim()){u(!0),f(!0);try{const S=await E.get(`/search?q=${encodeURIComponent(o)}`);S.data&&S.data.success&&b(S.data.data)}catch(S){console.error("Global search error:",S.message)}finally{u(!1)}}},k=window.location.pathname.startsWith("/client"),m=k?a&&(a.role==="client"||a.user_type==="client")?a:{username:"gem",full_name:"rajesh kumar",role:"client"}:a,ae=m&&m.username?m.username.slice(0,2).toUpperCase():"CL",ie=()=>{var g,S,U,H;return k||(m==null?void 0:m.role)==="client"?"Client Partner":(m==null?void 0:m.role)==="manager"?((g=m==null?void 0:m.managerProfile)==null?void 0:g.department_code)==="SMM-RS"?"SMM Manager":(S=m==null?void 0:m.managerProfile)!=null&&S.department_name?`${m.managerProfile.department_name} Manager`:"Brand Manager":(m==null?void 0:m.role)==="employee"?((U=m==null?void 0:m.employeeProfile)==null?void 0:U.department_code)==="SMM-RS"?"SMM Employee":(H=m==null?void 0:m.employeeProfile)!=null&&H.department_name?`${m.employeeProfile.department_name} Employee`:"Employee":(m==null?void 0:m.role)==="admin"?"Administrator":(m==null?void 0:m.role)==="super_admin"?"Super Administrator":(m==null?void 0:m.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:v,"aria-label":"Toggle Navigation",children:_?e.jsx(te,{size:24}):e.jsx(be,{size:24})}),e.jsx("button",{type:"button",className:"sidebar-toggle-btn",onClick:n,title:s?"Open sidebar (Ctrl+B)":"Close sidebar - Full page view (Ctrl+B)","aria-label":s?"Open sidebar":"Close sidebar",children:s?e.jsx(je,{size:19}):e.jsx(_e,{size:19})}),e.jsx("form",{onSubmit:y,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(ye,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:o,onChange:g=>p(g.target.value)})]})})]}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:ae}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((q=m==null?void 0:m.clientProfile)==null?void 0:q.company_name)||(m==null?void 0:m.full_name)||(m==null?void 0:m.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:ie()})]})]})}),e.jsx(Me,{isOpen:c,onClose:()=>{f(!1),b(null)},title:`Search Results for "${o}"`,children:i?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):l?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[l.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ve,{size:16,className:"text-primary"})," Clients (",l.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.clients.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${g.id}`,style:{fontWeight:600},children:g.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[g.client_name," • ",g.client_id_code]})]},g.id))})]}),l.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(F,{size:16,className:"text-teal"})," Departments (",l.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.departments.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${g.id}`,style:{fontWeight:600},children:g.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:g.code})]},g.id))})]}),l.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ee,{size:16,className:"text-secondary"})," Managers (",l.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.managers.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${g.id}`,style:{fontWeight:600},children:g.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[g.manager_id_code," • ",g.department_name]})]},g.id))})]}),l.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(I,{size:16,className:"text-purple"})," Employees (",l.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.employees.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${g.id}`,style:{fontWeight:600},children:g.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[g.employee_id_code," • ",g.department_name]})]},g.id))})]}),l.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(we,{size:16,className:"text-orange"})," Projects (",l.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:l.projects.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${g.id}`,style:{fontWeight:600},children:g.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",g.client_name," • Manager: ",g.manager_name]})]},g.id))})]}),l.clients.length===0&&l.departments.length===0&&l.managers.length===0&&l.employees.length===0&&l.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',o,'".']})})]}):null})]})};class R extends se.Component{constructor(s){super(s);Y(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,n){var p,i,u;if(console.error("ErrorBoundary caught an error:",s,n),this.setState({errorInfo:n}),s&&(s.name==="ChunkLoadError"||((p=s.message)==null?void 0:p.includes("Failed to fetch dynamically imported module"))||((i=s.message)==null?void 0:i.includes("Importing a module script failed"))||((u=s.message)==null?void 0:u.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,n;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((n=this.state.errorInfo)==null?void 0:n.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const h=a=>j.lazy(()=>a().catch(t=>{var n,o,p;throw t&&(t.name==="ChunkLoadError"||((n=t.message)==null?void 0:n.includes("Failed to fetch dynamically imported module"))||((o=t.message)==null?void 0:o.includes("Importing a module script failed"))||((p=t.message)==null?void 0:p.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Ve=h(()=>x(()=>import("./Login-lX1cpXtO.js"),__vite__mapDeps([0,1,2]))),We=h(()=>x(()=>import("./AdminDashboard-CAfvqd4Q.js"),__vite__mapDeps([3,1,2]))),$e=h(()=>x(()=>import("./ClientList-BT-wBTvl.js"),__vite__mapDeps([4,1,2,5,6]))),Fe=h(()=>x(()=>import("./DepartmentList-CiczPUSo.js"),__vite__mapDeps([7,1,2,6]))),qe=h(()=>x(()=>import("./ManagerList-BkjZxIxY.js"),__vite__mapDeps([8,1,2,5,6]))),Ue=h(()=>x(()=>import("./EmployeeList-COKW5LoF.js"),__vite__mapDeps([9,1,2,5,6]))),He=h(()=>x(()=>import("./ProjectList-2Azkh-tq.js"),__vite__mapDeps([10,1,2,11,12,6]))),Ye=h(()=>x(()=>import("./DeliverableList-BLeD6zHM.js"),__vite__mapDeps([13,1,2,5,6]))),Je=h(()=>x(()=>import("./ReportDashboard-CeU8TES0.js"),__vite__mapDeps([14,1,2]))),Ke=h(()=>x(()=>import("./SuperadminReports-BoX57cGF.js"),__vite__mapDeps([15,1,2,5]))),Ge=h(()=>x(()=>import("./ActivityTypeList-CXT5tt2C.js"),__vite__mapDeps([16,1,2,6]))),Qe=h(()=>x(()=>import("./LoginCredentials-BgAgtvB4.js"),__vite__mapDeps([17,1,2,5]))),Xe=h(()=>x(()=>import("./WorkUpdates-DthDFQVT.js"),__vite__mapDeps([18,1,2,19]))),O=h(()=>x(()=>import("./ClientPortal-BgeTOKe6.js"),__vite__mapDeps([20,1,2]))),Ze=h(()=>x(()=>import("./ManagerDashboard-CT6bbIRY.js"),__vite__mapDeps([21,1,2]))),et=h(()=>x(()=>import("./ManagerCalendar-EKYZdmRN.js"),__vite__mapDeps([22,1,2,11,12,6]))),tt=h(()=>x(()=>import("./ManagerDailyTodo-BL6l6_F8.js"),__vite__mapDeps([23,1,2]))),st=h(()=>x(()=>import("./DesignerWorkload-ClbVJvUH.js"),__vite__mapDeps([24,1,2,25]))),ot=h(()=>x(()=>import("./CompletedWorks-C1bcX6zy.js"),__vite__mapDeps([26,1,2,27]))),nt=h(()=>x(()=>import("./ManagerSubmissionsReview-D_REgyI2.js"),__vite__mapDeps([28,1,2]))),rt=h(()=>x(()=>import("./ManagerClientRework-2skgkfOv.js"),__vite__mapDeps([29,1,2]))),at=h(()=>x(()=>import("./ManagerJobWorks-CHm1Wfeo.js"),__vite__mapDeps([30,1,2,5]))),it=h(()=>x(()=>import("./ManagerSubDepartmentList-D0DjHsnN.js"),__vite__mapDeps([31,1,2]))),lt=h(()=>x(()=>import("./ManagerEmployeeList-CuLtKWB8.js"),__vite__mapDeps([32,1,2,5,33,34]))),ct=h(()=>x(()=>import("./ManagerEfficiency-BvxBe1W8.js"),__vite__mapDeps([33,1,2,34]))),Q=h(()=>x(()=>import("./SMMTodayPosting-Cq9B6RwQ.js"),__vite__mapDeps([35,1,2]))),X=h(()=>x(()=>import("./SMMMonthlyPosting-BzKmOQX9.js"),__vite__mapDeps([36,1,2,5]))),Z=h(()=>x(()=>import("./SMMPosted-CS09Ykrp.js"),__vite__mapDeps([37,1,2,5]))),dt=h(()=>x(()=>import("./WritersAssignment-DvULbetz.js"),__vite__mapDeps([38,1,2]))),pt=h(()=>x(()=>import("./EmployeeDashboard-B8C7_S0s.js"),__vite__mapDeps([39,1,2]))),mt=h(()=>x(()=>import("./EmployeeCalendar-BZ1PQSnA.js"),__vite__mapDeps([40,1,2,11,12,6]))),W=h(()=>x(()=>import("./EmployeeEventCalendar-B49EHajD.js"),__vite__mapDeps([41,1,2]))),ut=h(()=>x(()=>import("./EmployeeAssignedWork-BtUYpXlk.js"),__vite__mapDeps([42,1,2]))),xt=h(()=>x(()=>import("./EmployeeReassignedWork-CDJokaM6.js"),__vite__mapDeps([43,1,2]))),ht=h(()=>x(()=>import("./EmployeeApprovedWork-CpA9IXPo.js"),__vite__mapDeps([44,1,2,5]))),ft=h(()=>x(()=>import("./EmployeeTodayDeliverables-Dm6L4vBk.js"),__vite__mapDeps([45,1,2]))),gt=h(()=>x(()=>import("./EmployeeRework-BSBm5xKY.js"),__vite__mapDeps([46,1,2]))),bt=h(()=>x(()=>import("./EmployeeOverallWork-Hm25PmhC.js"),__vite__mapDeps([47,1,2]))),jt=h(()=>x(()=>import("./SuperAdminDashboard-BZ7rFdPo.js"),__vite__mapDeps([48,1,2]))),_t=h(()=>x(()=>import("./SuperAdminClients-BM0vaEDf.js"),__vite__mapDeps([49,1,2,5]))),yt=h(()=>x(()=>import("./SuperAdminEfficiency-Bb65ownr.js"),__vite__mapDeps([50,1,2,5]))),vt=h(()=>x(()=>import("./SuperAdminBranches-sZEI5G5H.js"),__vite__mapDeps([51,1,2,5]))),wt=h(()=>x(()=>import("./SuperAdminBranchDetail-ihUb0obA.js"),__vite__mapDeps([52,1,2,5]))),Et=h(()=>x(()=>import("./SuperAdminProfile-C9N6svyB.js"),__vite__mapDeps([53,1,2]))),P=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),T=()=>{try{const a=localStorage.getItem("erp_user");return a?JSON.parse(a):null}catch{return null}},N=()=>{const{isCollapsed:a}=re();return e.jsxs("div",{className:`app-layout ${a?"sidebar-collapsed":""}`,children:[e.jsx(Ne,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(Be,{}),e.jsx("main",{className:"main-content-scroll",style:{flex:1,overflowY:"auto",minHeight:0},children:e.jsx(j.Suspense,{fallback:e.jsx(P,{}),children:e.jsx(Se,{})})})]})]})},kt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),n=t||T();return s?e.jsx(P,{}):!n||n.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(N,{})},St=()=>{const{isAuthenticated:a,user:t,isAdmin:s,loading:n}=L(),o=t||T(),p=s||o&&(o.role==="admin"||o.role==="super_admin");return n?e.jsx(P,{}):!o||!p?e.jsx(w,{to:"/login",replace:!0}):e.jsx(N,{})},Ct=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),n=t||T();return s?e.jsx(P,{}):!n||n.role!=="manager"&&n.role!=="admin"&&n.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(N,{})},Lt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),n=t||T(),o=((n==null?void 0:n.username)||"").trim().toLowerCase(),p=n&&(n.role==="client"||n.user_type==="client"||o==="gem"||o==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(P,{}):p?e.jsx(N,{}):e.jsx(w,{to:"/login",replace:!0})},Rt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),n=t||T();return s?e.jsx(P,{}):!n||n.role!=="employee"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(N,{})};function Pt(){return e.jsx(Ee,{children:e.jsx(Ae,{children:e.jsx(Oe,{children:e.jsx(De,{children:e.jsx(R,{children:e.jsx(j.Suspense,{fallback:e.jsx(P,{}),children:e.jsxs(ke,{children:[e.jsx(r,{path:"/login",element:e.jsx(Ve,{})}),e.jsxs(r,{path:"/super-admin",element:e.jsx(kt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(jt,{})}),e.jsx(r,{path:"clients",element:e.jsx(_t,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(yt,{})}),e.jsx(r,{path:"branches",element:e.jsx(vt,{})}),e.jsx(r,{path:"branches/:id",element:e.jsx(wt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(W,{})})}),e.jsx(r,{path:"profile",element:e.jsx(Et,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/admin",element:e.jsx(St,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(We,{})}),e.jsx(r,{path:"clients",element:e.jsx($e,{})}),e.jsx(r,{path:"departments",element:e.jsx(Fe,{})}),e.jsx(r,{path:"managers",element:e.jsx(qe,{})}),e.jsx(r,{path:"employees",element:e.jsx(Ue,{})}),e.jsx(r,{path:"projects",element:e.jsx(He,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(W,{})})}),e.jsx(r,{path:"deliverables",element:e.jsx(Ye,{})}),e.jsx(r,{path:"reports",element:e.jsx(Je,{})}),e.jsx(r,{path:"superadmin-reports",element:e.jsx(Ke,{})}),e.jsx(r,{path:"activity-types",element:e.jsx(Ge,{})}),e.jsx(r,{path:"credentials",element:e.jsx(Qe,{})}),e.jsx(r,{path:"work-updates",element:e.jsx(Xe,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/manager",element:e.jsx(Ct,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Ze,{})}),e.jsx(r,{path:"calendar",element:e.jsx(et,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(W,{})})}),e.jsx(r,{path:"daily-todo",element:e.jsx(tt,{})}),e.jsx(r,{path:"designer-workload",element:e.jsx(st,{})}),e.jsx(r,{path:"completed-works",element:e.jsx(ot,{})}),e.jsx(r,{path:"sub-departments",element:e.jsx(it,{})}),e.jsx(r,{path:"employees",element:e.jsx(lt,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(ct,{})}),e.jsx(r,{path:"submissions-review",element:e.jsx(R,{children:e.jsx(nt,{})})}),e.jsx(r,{path:"client-reworks",element:e.jsx(rt,{})}),e.jsx(r,{path:"job-works",element:e.jsx(at,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Q,{})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(X,{})}),e.jsx(r,{path:"posted",element:e.jsx(Z,{})}),e.jsx(r,{path:"writers-assignment",element:e.jsx(R,{children:e.jsx(dt,{})})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/employee",element:e.jsx(Rt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(pt,{})}),e.jsx(r,{path:"calendar",element:e.jsx(mt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(W,{})})}),e.jsx(r,{path:"assigned-work",element:e.jsx(ut,{})}),e.jsx(r,{path:"reassigned-work",element:e.jsx(xt,{})}),e.jsx(r,{path:"approved-work",element:e.jsx(ht,{})}),e.jsx(r,{path:"overall-work",element:e.jsx(bt,{})}),e.jsx(r,{path:"today",element:e.jsx(ft,{})}),e.jsx(r,{path:"rework",element:e.jsx(gt,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(Q,{isEmployee:!0})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(X,{isEmployee:!0})}),e.jsx(r,{path:"posted",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/client",element:e.jsx(Lt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(O,{activeTabProp:"dashboard"})}),e.jsx(r,{path:"approvals",element:e.jsx(O,{activeTabProp:"approvals"})}),e.jsx(r,{path:"reachskyline-approvals",element:e.jsx(O,{activeTabProp:"reachskyline_approvals"})}),e.jsx(r,{path:"reports",element:e.jsx(O,{activeTabProp:"reports"})}),e.jsx(r,{path:"contact",element:e.jsx(O,{activeTabProp:"contact"})}),e.jsx(r,{path:"portal",element:e.jsx(w,{to:"/client/dashboard",replace:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsx(r,{path:"*",element:e.jsx(w,{to:"/login",replace:!0})})]})})})})})})})}window.alert=a=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const c=document.createElement("style");c.textContent=`
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
    `,document.head.appendChild(c),document.body.appendChild(t)}t.innerHTML="";let s="info",n="Notification";const o=(a||"").toLowerCase();o.includes("already approved")||o.includes("can't edit")||o.includes("cannot edit")?(s="info",n="Info"):o.includes("success")||o.includes("approve")||o.includes("submit")?(s="success",n="Success"):(o.includes("fail")||o.includes("error")||o.includes("invalid")||o.includes("please"))&&(s="error",n="Alert");let p="";s==="success"?p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const i=document.createElement("div");i.className="custom-alert-backdrop";const u=document.createElement("div");u.className="custom-alert-box",u.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${p}
    </div>
    <h3 class="custom-alert-title">${n}</h3>
    <p class="custom-alert-message">${a}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(i),t.appendChild(u);const l=()=>{u.classList.remove("show"),i.classList.remove("show"),setTimeout(()=>{t.contains(i)&&t.removeChild(i),t.contains(u)&&t.removeChild(u)},300)},b=u.querySelector(".custom-alert-btn");b.addEventListener("click",l),i.addEventListener("click",l),requestAnimationFrame(()=>{i.classList.add("show"),u.classList.add("show"),b.focus()})};window.confirm=a=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const b=document.createElement("style");b.textContent=`
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
      `,document.head.appendChild(b),document.body.appendChild(s)}s.innerHTML="";const n=document.createElement("div");n.className="custom-confirm-backdrop";const o=document.createElement("div");o.className="custom-confirm-box";const p='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';o.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${p}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${a}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(n),s.appendChild(o);const i=b=>{o.classList.remove("show"),n.classList.remove("show"),setTimeout(()=>{s.contains(n)&&s.removeChild(n),s.contains(o)&&s.removeChild(o),t(b)},300)},u=o.querySelector(".custom-confirm-btn-cancel"),l=o.querySelector(".custom-confirm-btn-confirm");u.addEventListener("click",()=>i(!1)),l.addEventListener("click",()=>i(!0)),n.addEventListener("click",()=>i(!1)),requestAnimationFrame(()=>{n.classList.add("show"),o.classList.add("show"),l.focus()})});if(typeof window<"u"){const a=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var n;const s=((n=t.reason)==null?void 0:n.message)||String(t.reason||"");a(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var n;const s=t.message||String(((n=t.error)==null?void 0:n.message)||"");a(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}Ce.createRoot(document.getElementById("root")).render(e.jsx(se.StrictMode,{children:e.jsx(Pt,{})}));export{Me as M,E as a,Te as r,L as u};
