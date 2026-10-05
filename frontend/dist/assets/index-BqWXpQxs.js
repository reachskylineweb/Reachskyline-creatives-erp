const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-C5BzhSRk.js","assets/vendor-react-CxNeScnF.js","assets/vendor-utils-DHDxdmq1.js","assets/AdminDashboard-BpZz1rOS.js","assets/ClientList-pHGuBS2b.js","assets/Table-B2G4YZnY.js","assets/FormFields-CvxUcQxy.js","assets/DepartmentList-nqtJZ813.js","assets/ManagerList-BhAlgcsF.js","assets/EmployeeList-CSG1IhQs.js","assets/ProjectList-CPoLJl_G.js","assets/ContentCalendarView-D4Wi4r5j.js","assets/vendor-xlsx-DLNWaC59.js","assets/DeliverableList-kkN4mfWS.js","assets/ReportDashboard-B-dlUrvq.js","assets/SuperadminReports-_sEUclKn.js","assets/ActivityTypeList-BF9eol3c.js","assets/LoginCredentials-CTKzeG-b.js","assets/WorkUpdates-4fmBfXBG.js","assets/WorkUpdates-D6vj6kiE.css","assets/ClientPortal-C_gUQhD_.js","assets/ManagerDashboard-DCshwlPS.js","assets/ManagerCalendar-CH4Oh5tj.js","assets/ManagerDailyTodo-CNwaL4dy.js","assets/DesignerWorkload-BkFEwKjw.js","assets/DesignerWorkload-G5KV8eLa.css","assets/CompletedWorks-DdJunOuK.js","assets/CompletedWorks-yeO6XNzE.css","assets/ManagerSubmissionsReview-CPfasUCE.js","assets/ManagerClientRework-CPhlHzTi.js","assets/ManagerJobWorks-B-nIB11P.js","assets/ManagerSubDepartmentList-BwUPy7qB.js","assets/ManagerEmployeeList-jvzwG0Uy.js","assets/ManagerEfficiency-BniYBEIr.js","assets/ManagerEfficiency-BRcdi1Nm.css","assets/SMMTodayPosting-B6fk2mOn.js","assets/SMMMonthlyPosting-CqHVPDfT.js","assets/SMMPosted-C9nk6GRd.js","assets/WritersAssignment-Bqm3fpqd.js","assets/EmployeeDashboard-C6HR_uKe.js","assets/EmployeeCalendar-p1scT_gF.js","assets/EmployeeEventCalendar-LblFbWrv.js","assets/EmployeeAssignedWork-CrfyuZV4.js","assets/EmployeeReassignedWork-BeyavRRc.js","assets/EmployeeApprovedWork-IQxY2a0Z.js","assets/EmployeeTodayDeliverables-O_a71aCt.js","assets/EmployeeRework-BDu7lqB1.js","assets/EmployeeOverallWork-CBvFpzbA.js","assets/SuperAdminDashboard-BxKpuiPU.js","assets/SuperAdminClients-BMZxAXDt.js","assets/SuperAdminEfficiency-DokjhuU9.js","assets/SuperAdminBranches-B977r23G.js","assets/SuperAdminBranchDetail-Bb8VUQkq.js","assets/SuperAdminProfile-BKUU_7Uh.js"])))=>i.map(i=>d[i]);
var de=Object.defineProperty;var pe=(a,t,s)=>t in a?de(a,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[t]=s;var J=(a,t,s)=>pe(a,typeof t!="symbol"?t+"":t,s);import{r as j,j as e,N as K,P as te,L as me,a as C,C as A,F as M,B,b as ue,c as G,U as I,d as z,e as xe,f as D,g as V,h as F,R as $,i as he,K as fe,A as se,k as ge,G as be,X as oe,M as je,l as _e,S as ye,m as ve,n as we,o as ne,p as Ee,q as ke,s as r,t as w,O as Se,u as Ce}from"./vendor-react-CxNeScnF.js";import{f as Le}from"./vendor-utils-DHDxdmq1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function s(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(o){if(o.ep)return;o.ep=!0;const l=s(o);fetch(o.href,l)}})();const Re="modulepreload",Pe=function(a){return"/"+a},Q={},x=function(t,s,n){let o=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),i=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));o=Promise.allSettled(s.map(c=>{if(c=Pe(c),c in Q)return;Q[c]=!0;const b=c.endsWith(".css"),d=b?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const f=document.createElement("link");if(f.rel=b?"stylesheet":Re,b||(f.as="script"),f.crossOrigin="",f.href=c,i&&f.setAttribute("nonce",i),document.head.appendChild(f),b)return new Promise((_,p)=>{f.addEventListener("load",_),f.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${c}`)))})}))}function l(u){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=u,window.dispatchEvent(i),!i.defaultPrevented)throw u}return o.then(u=>{for(const i of u||[])i.status==="rejected"&&l(i.reason);return t().catch(l)})},Ie=()=>{const a="http://localhost:5050/api";{const t=a.trim().replace(/\/+$/,"");return t==="/api"||t.startsWith("/api/")||t.endsWith("/api")?t:`${t}/api`}},k=Le.create({baseURL:Ie(),timeout:3e4,headers:{"Content-Type":"application/json"}});k.interceptors.request.use(a=>{const t=localStorage.getItem("erp_token");return t&&(a.headers.Authorization=`Bearer ${t}`),a},a=>Promise.reject(a));k.interceptors.response.use(a=>a,async a=>{var i,c,b;const{config:t,response:s}=a,n=((i=t==null?void 0:t.method)==null?void 0:i.toLowerCase())==="get",o=!s,l=s&&s.status>=500;if(t&&n&&(o||l)&&(t.__retryCount=t.__retryCount||0,t.__maxRetries=t.__maxRetries||3,t.__backoff=t.__backoff||1e3,t.__retryCount<t.__maxRetries)){t.__retryCount+=1;const d=t.__backoff*Math.pow(2,t.__retryCount-1);return t.onRetry&&t.onRetry(t.__retryCount,d),console.warn(`API call failed: ${a.message}. Retrying request (Attempt ${t.__retryCount}/${t.__maxRetries}) in ${d}ms...`),await new Promise(f=>setTimeout(f,d)),k(t)}if(s&&(s.status===401||s.status===403&&(((c=s.data)==null?void 0:c.message)&&/session expired|invalid token|jwt expired/i.test(s.data.message)||((b=s.data)==null?void 0:b.errors)&&s.data.errors.some(d=>/jwt expired|invalid signature|jwt malformed/i.test(String(d)))))){const d=localStorage.getItem("erp_user");d&&(d.includes('"role":"client"')||d.includes('"user_type":"client"'))||(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),window.location.pathname.includes("/login")||(window.location.href="/login?expired=true"))}return Promise.reject(a)});const re=j.createContext(null),Ae=({children:a})=>{const[t,s]=j.useState(()=>{try{const d=localStorage.getItem("erp_user");return d?JSON.parse(d):null}catch{return null}}),[n,o]=j.useState(!1),l=d=>{if(d)try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(function(f){var p,v;const _=async()=>{var y,E;try{const m=(E=(y=f.User)==null?void 0:y.PushSubscription)==null?void 0:E.id;m&&await k.post("/notifications/subscribe",{subscriptionId:m}).catch(()=>{})}catch{}};if(!window.__oneSignalInitialized)try{f.init({appId:"ca3c1c80-3492-4268-a200-3be5586be352",allowLocalhostAsSecureOrigin:!0}).catch(y=>{console.warn("[OneSignal] Domain initialization deferred:",(y==null?void 0:y.message)||y)}),window.__oneSignalInitialized=!0}catch(y){console.warn("[OneSignal] Init warning:",y.message)}_();try{(v=(p=f.User)==null?void 0:p.PushSubscription)==null||v.addEventListener("change",function(y){var E;(E=y==null?void 0:y.current)!=null&&E.optedIn&&_()})}catch{}})}catch{}};j.useEffect(()=>{(async()=>{const f=localStorage.getItem("erp_token"),_=localStorage.getItem("erp_user");let p=null;try{p=_?JSON.parse(_):null}catch{}if(!f){if(p&&p.role==="client"){localStorage.setItem("erp_token","client-session-token"),s(p),o(!1);return}s(null),o(!1);return}try{const v=await k.get("/auth/session");if(v.data&&v.data.success){const y=v.data.data.user;s(y),localStorage.setItem("erp_user",JSON.stringify(y))}else p&&p.role==="client"?s(p):(localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null))}catch{p&&p.role==="client"&&s(p)}finally{o(!1)}})()},[]),j.useEffect(()=>{t&&l(t)},[t]);const u=async(d,f,_)=>{try{const p=await k.post("/auth/login",{username:d,password:f},{onRetry:_});if(p.data&&p.data.success){const{token:v,user:y}=p.data.data;return localStorage.setItem("erp_token",v||"client-session-token"),localStorage.setItem("erp_user",JSON.stringify(y)),s(y),o(!1),{success:!0}}}catch(p){console.error("[AuthContext] Login error caught:",p);let v="Wrong credentials! Invalid username or password.";p.response&&p.response.data&&p.response.data.message?v=p.response.data.message:p.code==="ECONNABORTED"||p.message&&p.message.includes("timeout")?v="Connection timed out. The server took too long to respond.":!p.response&&(p.code==="ERR_NETWORK"||p.message&&p.message.toLowerCase().includes("network"))?v="Network error: Cannot reach backend server. Please verify the server is running.":p.message&&(v=p.message);const y=p.response&&p.response.data&&p.response.data.errors?p.response.data.errors:[];return{success:!1,message:v,errors:y}}},i=async()=>{try{window.OneSignalDeferred=window.OneSignalDeferred||[],window.OneSignalDeferred.push(async function(d){var f,_;try{const p=(_=(f=d.User)==null?void 0:f.PushSubscription)==null?void 0:_.id;p&&await k.post("/notifications/unsubscribe",{subscriptionId:p}).catch(()=>{})}catch{}})}catch{}localStorage.removeItem("erp_token"),localStorage.removeItem("erp_user"),s(null),o(!1)},c=d=>{s(f=>{if(!f)return null;const _={...f,...d};return localStorage.setItem("erp_user",JSON.stringify(_)),_})},b={user:t,isAuthenticated:!!t,isAdmin:(t==null?void 0:t.role)==="admin"||(t==null?void 0:t.role)==="super_admin",loading:n,login:u,logout:i,updateCurrentUser:c};return e.jsx(re.Provider,{value:b,children:a})},L=()=>{const a=j.useContext(re);return a||{user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,login:async()=>({success:!1}),logout:async()=>{},updateCurrentUser:()=>{}}},ze=j.createContext(null),De=({children:a})=>{const[t,s]=j.useState([]),[n,o]=j.useState(0),{isAuthenticated:l}=L(),u=j.useCallback(async()=>{if(l)try{const d=await k.get("/notifications");if(d.data&&d.data.success){const f=d.data.data.notifications;s(f);const _=f.filter(p=>!p.is_read).length;o(_)}}catch{}},[l]),i=async d=>{try{await k.patch(`/notifications/${d}/read`),s(f=>f.map(_=>_.id===parseInt(d)?{..._,is_read:1}:_)),o(f=>Math.max(0,f-1))}catch(f){console.error("Failed to mark notification as read:",f.message)}},c=async()=>{try{await k.post("/notifications/read-all"),s(d=>d.map(f=>({...f,is_read:1}))),o(0)}catch(d){console.error("Failed to mark all notifications as read:",d.message)}};j.useEffect(()=>{if(l){u();const d=setInterval(u,3e4);return()=>clearInterval(d)}else s([]),o(0)},[l,u]);const b={notifications:t,unreadCount:n,fetchNotifications:u,markAsRead:i,markAllRead:c};return e.jsx(ze.Provider,{value:b,children:a})},ae=j.createContext({isCollapsed:!1,toggleSidebar:()=>{},closeSidebar:()=>{},openSidebar:()=>{}}),Oe=({children:a})=>{const[t,s]=j.useState(()=>{try{return localStorage.getItem("erp_sidebar_collapsed")==="true"}catch{return!1}}),n=j.useCallback(()=>{s(u=>{const i=!u;try{localStorage.setItem("erp_sidebar_collapsed",String(i))}catch{}return i})},[]),o=j.useCallback(()=>{s(!0);try{localStorage.setItem("erp_sidebar_collapsed","true")}catch{}},[]),l=j.useCallback(()=>{s(!1);try{localStorage.setItem("erp_sidebar_collapsed","false")}catch{}},[]);return j.useEffect(()=>{const u=i=>{var c,b;if((i.ctrlKey||i.metaKey)&&i.key.toLowerCase()==="b"){const d=(b=(c=document.activeElement)==null?void 0:c.tagName)==null?void 0:b.toLowerCase();d!=="input"&&d!=="textarea"&&(i.preventDefault(),n())}};return window.addEventListener("keydown",u),()=>window.removeEventListener("keydown",u)},[n]),e.jsx(ae.Provider,{value:{isCollapsed:t,toggleSidebar:n,closeSidebar:o,openSidebar:l},children:a})},q=()=>j.useContext(ae),Te="/assets/reachskyline-logo-DpVD33Dn.webp",Ne=()=>{const{logout:a,user:t}=L(),{closeSidebar:s}=q(),n=()=>{const i=[{label:"Dashboard",path:"/admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Clients",path:"/admin/clients",icon:e.jsx(G,{size:20})},{label:"Departments",path:"/admin/departments",icon:e.jsx(F,{size:20})},{label:"Managers",path:"/admin/managers",icon:e.jsx(se,{size:20})},{label:"Employees",path:"/admin/employees",icon:e.jsx(I,{size:20})},{label:"Content Calendar",path:"/admin/projects",icon:e.jsx(ge,{size:20})},{label:"Event Day Calendar",path:"/admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Deliverables",path:"/admin/deliverables",icon:e.jsx(z,{size:20})},{label:"Reports",path:"/admin/reports",icon:e.jsx(B,{size:20})},{label:"Work Updates",path:"/admin/work-updates",icon:e.jsx(be,{size:20})}];return(t==null?void 0:t.role)==="super_admin"&&i.push({label:"Superadmin Reports",path:"/admin/superadmin-reports",icon:e.jsx(M,{size:20})}),i.push({label:"Activity Types",path:"/admin/activity-types",icon:e.jsx(he,{size:20})},{label:"Credentials",path:"/admin/credentials",icon:e.jsx(fe,{size:20})}),i},o=()=>{var b,d,f,_,p;const i=window.location.pathname.startsWith("/client");if((t==null?void 0:t.role)==="client"||(t==null?void 0:t.user_type)==="client"||i)return[{label:"Client Dashboard",path:"/client/dashboard",icon:e.jsx(C,{size:20})},{label:"Collaboration & Approvals",path:"/client/approvals",icon:e.jsx(A,{size:20})},{label:"Approval for ReachSkyline",path:"/client/reachskyline-approvals",icon:e.jsx(M,{size:20})},{label:"Monthly Performance Reports",path:"/client/reports",icon:e.jsx(B,{size:20})},{label:"ReachSkyline Contact",path:"/client/contact",icon:e.jsx(ue,{size:20})}];if((t==null?void 0:t.role)==="super_admin")return[{label:"Dashboard",path:"/super-admin/dashboard",icon:e.jsx(C,{size:20})},{label:"Branches",path:"/super-admin/branches",icon:e.jsx(G,{size:20})},{label:"Clients",path:"/super-admin/clients",icon:e.jsx(I,{size:20})},{label:"Event Day Calendar",path:"/super-admin/event-calendar",icon:e.jsx(z,{size:20})},{label:"Employee Efficiency",path:"/super-admin/efficiency",icon:e.jsx(B,{size:20})},{label:"Profile",path:"/super-admin/profile",icon:e.jsx(xe,{size:20})}];if((t==null?void 0:t.role)==="manager")return((b=t==null?void 0:t.managerProfile)==null?void 0:b.department_code)==="SMM-RS"?[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(I,{size:20})},{label:"Today's Posting",path:"/manager/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/manager/monthly-posting",icon:e.jsx(V,{size:20})},{label:"Posted History",path:"/manager/posted",icon:e.jsx(A,{size:20})}]:[{label:"Dashboard",path:"/manager/dashboard",icon:e.jsx(C,{size:20})},{label:"Daily To-Do",path:"/manager/daily-todo",icon:e.jsx(D,{size:20})},{label:"Completed Works",path:"/manager/completed-works",icon:e.jsx(A,{size:20})},{label:"Content Calendar",path:"/manager/calendar",icon:e.jsx(V,{size:20})},{label:"Event Day Calendar",path:"/manager/event-calendar",icon:e.jsx(z,{size:20})},{label:"Content Writers Work Assignment",path:"/manager/writers-assignment",icon:e.jsx(I,{size:20})},{label:"Sub-departments",path:"/manager/sub-departments",icon:e.jsx(F,{size:20})},{label:"Employees",path:"/manager/employees",icon:e.jsx(I,{size:20})},{label:"Employee Efficiency",path:"/manager/efficiency",icon:e.jsx(B,{size:20})},{label:"Approval works",path:"/manager/submissions-review",icon:e.jsx(M,{size:20})},{label:"OP from Client",path:"/manager/client-reworks",icon:e.jsx($,{size:20})}];if((t==null?void 0:t.role)==="employee"){if(((d=t==null?void 0:t.employeeProfile)==null?void 0:d.department_code)==="SMM-RS")return[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"To-Do",path:"/employee/today-posting",icon:e.jsx(D,{size:20})},{label:"Monthly Posting",path:"/employee/monthly-posting",icon:e.jsx(V,{size:20})},{label:"Posted History",path:"/employee/posted",icon:e.jsx(A,{size:20})}];const v=Number((f=t==null?void 0:t.employeeProfile)==null?void 0:f.sub_department_id),y=(_=t==null?void 0:t.employeeProfile)==null?void 0:_.sub_department_code,E=(((p=t==null?void 0:t.employeeProfile)==null?void 0:p.sub_department_name)||"").toLowerCase();return v===1||y==="CW-RS"||E.includes("writer")||E.includes("content")?[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Event Day Calendar",path:"/employee/event-calendar",icon:e.jsx(z,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx($,{size:20})},{label:"Overall Work",path:"/employee/overall-work",icon:e.jsx(M,{size:20})}]:[{label:"Dashboard",path:"/employee/dashboard",icon:e.jsx(C,{size:20})},{label:"Content Calendar",path:"/employee/calendar",icon:e.jsx(V,{size:20})},{label:"Assigned Work",path:"/employee/assigned-work",icon:e.jsx(D,{size:20})},{label:"Reassigned Work",path:"/employee/reassigned-work",icon:e.jsx($,{size:20})},{label:"Approved Work",path:"/employee/approved-work",icon:e.jsx(A,{size:20})}]}return n()},l=()=>{document.body.classList.remove("mobile-sidebar-open")},u=o();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"sidebar-backdrop",onClick:l}),e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx(K,{to:"/",onClick:l,className:"sidebar-logo-link",title:"ReachSkyline ERP",children:e.jsx("img",{src:Te,alt:"ReachSkyline Logo",className:"sidebar-brand-img"})}),e.jsx("button",{type:"button",className:"sidebar-close-btn",onClick:s,title:"Close sidebar (Full page view)","aria-label":"Close sidebar",children:e.jsx(te,{size:18})})]}),e.jsx("ul",{className:"sidebar-menu",children:u.map((i,c)=>e.jsx("li",{className:"sidebar-item",children:e.jsxs(K,{to:i.path,state:i.state,onClick:l,className:({isActive:b})=>`sidebar-link ${b?"active":""}`,children:[i.icon,e.jsx("span",{children:i.label})]})},c))}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:a,className:"sidebar-link",style:{background:"none",border:"none",width:"100%",cursor:"pointer",textAlign:"left",color:"var(--danger)"},onMouseEnter:i=>{i.currentTarget.style.color="#f87171"},onMouseLeave:i=>{i.currentTarget.style.color="var(--danger)"},children:[e.jsx(me,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Sign Out"})]})})]})]})},Me=({isOpen:a,onClose:t,title:s,children:n,footer:o=null})=>(j.useEffect(()=>(a?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[a]),a?e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-container",onClick:l=>l.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:s}),e.jsx("button",{className:"modal-close-btn",onClick:t,"aria-label":"Close modal",children:e.jsx(oe,{size:20})})]}),e.jsx("div",{className:"modal-body",children:n}),o&&e.jsx("div",{className:"modal-footer",children:o})]})}):null),Be=()=>{var U;const{user:a,logout:t}=L(),{isCollapsed:s,toggleSidebar:n}=q(),[o,l]=j.useState(""),[u,i]=j.useState(!1),[c,b]=j.useState(null),[d,f]=j.useState(!1),[_,p]=j.useState(!1),v=()=>{const g=!_;p(g),g?document.body.classList.add("mobile-sidebar-open"):document.body.classList.remove("mobile-sidebar-open")};j.useEffect(()=>{const g=()=>{window.innerWidth>768&&(document.body.classList.remove("mobile-sidebar-open"),p(!1))};return window.addEventListener("resize",g),()=>window.removeEventListener("resize",g)},[]);const y=async g=>{if(g.preventDefault(),!!o.trim()){i(!0),f(!0);try{const S=await k.get(`/search?q=${encodeURIComponent(o)}`);S.data&&S.data.success&&b(S.data.data)}catch(S){console.error("Global search error:",S.message)}finally{i(!1)}}},E=window.location.pathname.startsWith("/client"),m=E?a&&(a.role==="client"||a.user_type==="client")?a:{username:"gem",full_name:"rajesh kumar",role:"client"}:a,ie=m&&m.username?m.username.slice(0,2).toUpperCase():"CL",le=()=>{var g,S,Y,H;return E||(m==null?void 0:m.role)==="client"?"Client Partner":(m==null?void 0:m.role)==="manager"?((g=m==null?void 0:m.managerProfile)==null?void 0:g.department_code)==="SMM-RS"?"SMM Manager":(S=m==null?void 0:m.managerProfile)!=null&&S.department_name?`${m.managerProfile.department_name} Manager`:"Brand Manager":(m==null?void 0:m.role)==="employee"?((Y=m==null?void 0:m.employeeProfile)==null?void 0:Y.department_code)==="SMM-RS"?"SMM Employee":(H=m==null?void 0:m.employeeProfile)!=null&&H.department_name?`${m.employeeProfile.department_name} Employee`:"Employee":(m==null?void 0:m.role)==="admin"?"Administrator":(m==null?void 0:m.role)==="super_admin"?"Super Administrator":(m==null?void 0:m.role)||"User"};return e.jsxs("header",{className:"header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",flex:1},children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:v,"aria-label":"Toggle Navigation",children:_?e.jsx(oe,{size:24}):e.jsx(je,{size:24})}),e.jsx("button",{type:"button",className:"sidebar-toggle-btn",onClick:n,title:s?"Open sidebar (Ctrl+B)":"Close sidebar - Full page view (Ctrl+B)","aria-label":s?"Open sidebar":"Close sidebar",children:s?e.jsx(_e,{size:19}):e.jsx(te,{size:19})}),e.jsx("form",{onSubmit:y,style:{flex:1,maxWidth:"480px"},children:e.jsxs("div",{className:"header-search",children:[e.jsx(ye,{size:18,className:"text-muted"}),e.jsx("input",{type:"text",placeholder:"Global search client, project, staff...",value:o,onChange:g=>l(g.target.value)})]})})]}),e.jsx("div",{className:"header-actions",children:e.jsxs("div",{className:"user-profile-menu",children:[e.jsx("div",{className:"user-avatar",children:ie}),e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",style:{color:"#d97706",fontWeight:800},children:((U=m==null?void 0:m.clientProfile)==null?void 0:U.company_name)||(m==null?void 0:m.full_name)||(m==null?void 0:m.username)||"Client Partner"}),e.jsx("span",{className:"user-role",children:le()})]})]})}),e.jsx(Me,{isOpen:d,onClose:()=>{f(!1),b(null)},title:`Search Results for "${o}"`,children:u?e.jsxs("div",{style:{textAlign:"center",padding:"40px 0"},children:[e.jsx("div",{style:{display:"inline-block",width:"24px",height:"24px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("p",{style:{marginTop:"12px",color:"var(--text-muted)"},children:"Searching databases..."})]}):c?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[c.clients.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(ve,{size:16,className:"text-primary"})," Clients (",c.clients.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:c.clients.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/clients?id=${g.id}`,style:{fontWeight:600},children:g.company_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[g.client_name," • ",g.client_id_code]})]},g.id))})]}),c.departments.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(F,{size:16,className:"text-teal"})," Departments (",c.departments.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:c.departments.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/departments?id=${g.id}`,style:{fontWeight:600},children:g.name}),e.jsx("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:g.code})]},g.id))})]}),c.managers.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(se,{size:16,className:"text-secondary"})," Managers (",c.managers.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:c.managers.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/managers?id=${g.id}`,style:{fontWeight:600},children:g.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[g.manager_id_code," • ",g.department_name]})]},g.id))})]}),c.employees.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(I,{size:16,className:"text-purple"})," Employees (",c.employees.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:c.employees.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/employees?id=${g.id}`,style:{fontWeight:600},children:g.full_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:[g.employee_id_code," • ",g.department_name]})]},g.id))})]}),c.projects.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{style:{display:"flex",alignItems:"center",gap:"8px",borderBottom:"1px solid var(--border-color)",paddingBottom:"6px",marginBottom:"8px",fontSize:"14px"},children:[e.jsx(we,{size:16,className:"text-orange"})," Projects (",c.projects.length,")"]}),e.jsx("ul",{style:{listStyle:"none",paddingLeft:0},children:c.projects.map(g=>e.jsxs("li",{style:{padding:"8px 10px",borderRadius:"4px",backgroundColor:"var(--bg-app)",marginBottom:"4px"},children:[e.jsx("a",{href:`/admin/projects?id=${g.id}`,style:{fontWeight:600},children:g.project_name}),e.jsxs("span",{style:{color:"var(--text-muted)",fontSize:"12px",marginLeft:"10px"},children:["Client: ",g.client_name," • Manager: ",g.manager_name]})]},g.id))})]}),c.clients.length===0&&c.departments.length===0&&c.managers.length===0&&c.employees.length===0&&c.projects.length===0&&e.jsx("div",{style:{textAlign:"center",padding:"30px 0",color:"var(--text-muted)"},children:e.jsxs("p",{style:{fontWeight:600},children:['No matching records found for "',o,'".']})})]}):null})]})};class R extends ne.Component{constructor(s){super(s);J(this,"handleReset",()=>{sessionStorage.removeItem("chunk_reload_attempted"),this.setState({hasError:!1,error:null,errorInfo:null}),window.location.reload()});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,n){var l,u,i;if(console.error("ErrorBoundary caught an error:",s,n),this.setState({errorInfo:n}),s&&(s.name==="ChunkLoadError"||((l=s.message)==null?void 0:l.includes("Failed to fetch dynamically imported module"))||((u=s.message)==null?void 0:u.includes("Importing a module script failed"))||((i=s.message)==null?void 0:i.includes("dynamically imported module")))&&!sessionStorage.getItem("chunk_reload_attempted")){sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload();return}}render(){var s,n;return this.state.hasError?e.jsxs("div",{style:{padding:"40px",maxWidth:"800px",margin:"50px auto",backgroundColor:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsx("h2",{style:{color:"#e11d48",marginTop:0,fontSize:"22px",fontWeight:800},children:"Application Rendering Crash"}),e.jsx("p",{style:{color:"#475569",fontSize:"14px",lineHeight:"1.6"},children:"A runtime error occurred in the React components rendering pipeline. See the details below:"}),e.jsxs("div",{style:{backgroundColor:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:"6px",padding:"16px",fontFamily:"monospace",fontSize:"13px",color:"#0f172a",overflowX:"auto",marginBottom:"20px",whiteSpace:"pre-wrap"},children:[e.jsx("strong",{children:"Error:"})," ",(s=this.state.error)==null?void 0:s.toString(),((n=this.state.errorInfo)==null?void 0:n.componentStack)&&e.jsxs("div",{style:{marginTop:"12px",color:"#475569",fontSize:"12px"},children:[e.jsx("strong",{children:"Component Stack:"}),this.state.errorInfo.componentStack]})]}),e.jsx("div",{style:{display:"flex",gap:"12px"},children:e.jsx("button",{onClick:this.handleReset,style:{backgroundColor:"#3b82f6",color:"#fff",border:"none",padding:"10px 20px",borderRadius:"6px",fontWeight:700,fontSize:"14px",cursor:"pointer"},children:"Reset & Reload Page"})})]}):this.props.children}}const h=a=>j.lazy(()=>a().catch(t=>{var n,o,l;throw t&&(t.name==="ChunkLoadError"||((n=t.message)==null?void 0:n.includes("Failed to fetch dynamically imported module"))||((o=t.message)==null?void 0:o.includes("Importing a module script failed"))||((l=t.message)==null?void 0:l.includes("dynamically imported module")))&&(sessionStorage.getItem("chunk_reload_attempted")||(sessionStorage.setItem("chunk_reload_attempted","true"),window.location.reload())),t})),Ve=h(()=>x(()=>import("./Login-C5BzhSRk.js"),__vite__mapDeps([0,1,2]))),We=h(()=>x(()=>import("./AdminDashboard-BpZz1rOS.js"),__vite__mapDeps([3,1,2]))),$e=h(()=>x(()=>import("./ClientList-pHGuBS2b.js"),__vite__mapDeps([4,1,2,5,6]))),Fe=h(()=>x(()=>import("./DepartmentList-nqtJZ813.js"),__vite__mapDeps([7,1,2,6]))),qe=h(()=>x(()=>import("./ManagerList-BhAlgcsF.js"),__vite__mapDeps([8,1,2,5,6]))),Ue=h(()=>x(()=>import("./EmployeeList-CSG1IhQs.js"),__vite__mapDeps([9,1,2,5,6]))),Ye=h(()=>x(()=>import("./ProjectList-CPoLJl_G.js"),__vite__mapDeps([10,1,2,11,12,6]))),He=h(()=>x(()=>import("./DeliverableList-kkN4mfWS.js"),__vite__mapDeps([13,1,2,5,6]))),Je=h(()=>x(()=>import("./ReportDashboard-B-dlUrvq.js"),__vite__mapDeps([14,1,2]))),Ke=h(()=>x(()=>import("./SuperadminReports-_sEUclKn.js"),__vite__mapDeps([15,1,2,5]))),Ge=h(()=>x(()=>import("./ActivityTypeList-BF9eol3c.js"),__vite__mapDeps([16,1,2,6]))),Qe=h(()=>x(()=>import("./LoginCredentials-CTKzeG-b.js"),__vite__mapDeps([17,1,2,5]))),Xe=h(()=>x(()=>import("./WorkUpdates-4fmBfXBG.js"),__vite__mapDeps([18,1,2,19]))),O=h(()=>x(()=>import("./ClientPortal-C_gUQhD_.js"),__vite__mapDeps([20,1,2]))),Ze=h(()=>x(()=>import("./ManagerDashboard-DCshwlPS.js"),__vite__mapDeps([21,1,2]))),et=h(()=>x(()=>import("./ManagerCalendar-CH4Oh5tj.js"),__vite__mapDeps([22,1,2,11,12,6]))),tt=h(()=>x(()=>import("./ManagerDailyTodo-CNwaL4dy.js"),__vite__mapDeps([23,1,2]))),st=h(()=>x(()=>import("./DesignerWorkload-BkFEwKjw.js"),__vite__mapDeps([24,1,2,25]))),ot=h(()=>x(()=>import("./CompletedWorks-DdJunOuK.js"),__vite__mapDeps([26,1,2,27]))),nt=h(()=>x(()=>import("./ManagerSubmissionsReview-CPfasUCE.js"),__vite__mapDeps([28,1,2]))),rt=h(()=>x(()=>import("./ManagerClientRework-CPhlHzTi.js"),__vite__mapDeps([29,1,2]))),at=h(()=>x(()=>import("./ManagerJobWorks-B-nIB11P.js"),__vite__mapDeps([30,1,2,5]))),it=h(()=>x(()=>import("./ManagerSubDepartmentList-BwUPy7qB.js"),__vite__mapDeps([31,1,2]))),lt=h(()=>x(()=>import("./ManagerEmployeeList-jvzwG0Uy.js"),__vite__mapDeps([32,1,2,5,33,34]))),ct=h(()=>x(()=>import("./ManagerEfficiency-BniYBEIr.js"),__vite__mapDeps([33,1,2,34]))),X=h(()=>x(()=>import("./SMMTodayPosting-B6fk2mOn.js"),__vite__mapDeps([35,1,2]))),Z=h(()=>x(()=>import("./SMMMonthlyPosting-CqHVPDfT.js"),__vite__mapDeps([36,1,2,5]))),ee=h(()=>x(()=>import("./SMMPosted-C9nk6GRd.js"),__vite__mapDeps([37,1,2,5]))),dt=h(()=>x(()=>import("./WritersAssignment-Bqm3fpqd.js"),__vite__mapDeps([38,1,2]))),pt=h(()=>x(()=>import("./EmployeeDashboard-C6HR_uKe.js"),__vite__mapDeps([39,1,2]))),mt=h(()=>x(()=>import("./EmployeeCalendar-p1scT_gF.js"),__vite__mapDeps([40,1,2,11,12,6]))),W=h(()=>x(()=>import("./EmployeeEventCalendar-LblFbWrv.js"),__vite__mapDeps([41,1,2]))),ut=h(()=>x(()=>import("./EmployeeAssignedWork-CrfyuZV4.js"),__vite__mapDeps([42,1,2]))),xt=h(()=>x(()=>import("./EmployeeReassignedWork-BeyavRRc.js"),__vite__mapDeps([43,1,2]))),ht=h(()=>x(()=>import("./EmployeeApprovedWork-IQxY2a0Z.js"),__vite__mapDeps([44,1,2,5]))),ft=h(()=>x(()=>import("./EmployeeTodayDeliverables-O_a71aCt.js"),__vite__mapDeps([45,1,2]))),gt=h(()=>x(()=>import("./EmployeeRework-BDu7lqB1.js"),__vite__mapDeps([46,1,2]))),bt=h(()=>x(()=>import("./EmployeeOverallWork-CBvFpzbA.js"),__vite__mapDeps([47,1,2]))),jt=h(()=>x(()=>import("./SuperAdminDashboard-BxKpuiPU.js"),__vite__mapDeps([48,1,2]))),_t=h(()=>x(()=>import("./SuperAdminClients-BMZxAXDt.js"),__vite__mapDeps([49,1,2,5]))),yt=h(()=>x(()=>import("./SuperAdminEfficiency-DokjhuU9.js"),__vite__mapDeps([50,1,2,5]))),vt=h(()=>x(()=>import("./SuperAdminBranches-B977r23G.js"),__vite__mapDeps([51,1,2,5]))),wt=h(()=>x(()=>import("./SuperAdminBranchDetail-Bb8VUQkq.js"),__vite__mapDeps([52,1,2,5]))),Et=h(()=>x(()=>import("./SuperAdminProfile-BKUU_7Uh.js"),__vite__mapDeps([53,1,2]))),P=()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:"var(--text-muted)"},children:[e.jsx("div",{style:{width:"32px",height:"32px",border:"3px solid #e2e8f0",borderTopColor:"var(--primary)",borderRadius:"50%",animation:"spin 1s linear infinite"}}),e.jsx("style",{children:"@keyframes spin { to { transform: rotate(360deg); } }"})]}),T=()=>{try{const a=localStorage.getItem("erp_user");return a?JSON.parse(a):null}catch{return null}},N=()=>{const{isCollapsed:a}=q();return e.jsxs("div",{className:`app-layout ${a?"sidebar-collapsed":""}`,children:[e.jsx(Ne,{}),e.jsxs("div",{className:"main-content",children:[e.jsx(Be,{}),e.jsx("main",{style:{flex:1,overflowY:"auto"},children:e.jsx(j.Suspense,{fallback:e.jsx(P,{}),children:e.jsx(Se,{})})})]})]})},kt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),n=t||T();return s?e.jsx(P,{}):!n||n.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(N,{})},St=()=>{const{isAuthenticated:a,user:t,isAdmin:s,loading:n}=L(),o=t||T(),l=s||o&&(o.role==="admin"||o.role==="super_admin");return n?e.jsx(P,{}):!o||!l?e.jsx(w,{to:"/login",replace:!0}):e.jsx(N,{})},Ct=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),n=t||T();return s?e.jsx(P,{}):!n||n.role!=="manager"&&n.role!=="admin"&&n.role!=="super_admin"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(N,{})},Lt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),n=t||T(),o=((n==null?void 0:n.username)||"").trim().toLowerCase(),l=n&&(n.role==="client"||n.user_type==="client"||o==="gem"||o==="rk"||!!localStorage.getItem("erp_token"));return s?e.jsx(P,{}):l?e.jsx(N,{}):e.jsx(w,{to:"/login",replace:!0})},Rt=()=>{const{isAuthenticated:a,user:t,loading:s}=L(),n=t||T();return s?e.jsx(P,{}):!n||n.role!=="employee"?e.jsx(w,{to:"/login",replace:!0}):e.jsx(N,{})};function Pt(){return e.jsx(Ee,{children:e.jsx(Ae,{children:e.jsx(Oe,{children:e.jsx(De,{children:e.jsx(R,{children:e.jsx(j.Suspense,{fallback:e.jsx(P,{}),children:e.jsxs(ke,{children:[e.jsx(r,{path:"/login",element:e.jsx(Ve,{})}),e.jsxs(r,{path:"/super-admin",element:e.jsx(kt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(jt,{})}),e.jsx(r,{path:"clients",element:e.jsx(_t,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(yt,{})}),e.jsx(r,{path:"branches",element:e.jsx(vt,{})}),e.jsx(r,{path:"branches/:id",element:e.jsx(wt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(W,{})})}),e.jsx(r,{path:"profile",element:e.jsx(Et,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/admin",element:e.jsx(St,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(We,{})}),e.jsx(r,{path:"clients",element:e.jsx($e,{})}),e.jsx(r,{path:"departments",element:e.jsx(Fe,{})}),e.jsx(r,{path:"managers",element:e.jsx(qe,{})}),e.jsx(r,{path:"employees",element:e.jsx(Ue,{})}),e.jsx(r,{path:"projects",element:e.jsx(Ye,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(W,{})})}),e.jsx(r,{path:"deliverables",element:e.jsx(He,{})}),e.jsx(r,{path:"reports",element:e.jsx(Je,{})}),e.jsx(r,{path:"superadmin-reports",element:e.jsx(Ke,{})}),e.jsx(r,{path:"activity-types",element:e.jsx(Ge,{})}),e.jsx(r,{path:"credentials",element:e.jsx(Qe,{})}),e.jsx(r,{path:"work-updates",element:e.jsx(Xe,{})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/manager",element:e.jsx(Ct,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(Ze,{})}),e.jsx(r,{path:"calendar",element:e.jsx(et,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(W,{})})}),e.jsx(r,{path:"daily-todo",element:e.jsx(tt,{})}),e.jsx(r,{path:"designer-workload",element:e.jsx(st,{})}),e.jsx(r,{path:"completed-works",element:e.jsx(ot,{})}),e.jsx(r,{path:"sub-departments",element:e.jsx(it,{})}),e.jsx(r,{path:"employees",element:e.jsx(lt,{})}),e.jsx(r,{path:"efficiency",element:e.jsx(ct,{})}),e.jsx(r,{path:"submissions-review",element:e.jsx(R,{children:e.jsx(nt,{})})}),e.jsx(r,{path:"client-reworks",element:e.jsx(rt,{})}),e.jsx(r,{path:"job-works",element:e.jsx(at,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(X,{})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(Z,{})}),e.jsx(r,{path:"posted",element:e.jsx(ee,{})}),e.jsx(r,{path:"writers-assignment",element:e.jsx(R,{children:e.jsx(dt,{})})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/employee",element:e.jsx(Rt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(pt,{})}),e.jsx(r,{path:"calendar",element:e.jsx(mt,{})}),e.jsx(r,{path:"event-calendar",element:e.jsx(R,{children:e.jsx(W,{})})}),e.jsx(r,{path:"assigned-work",element:e.jsx(ut,{})}),e.jsx(r,{path:"reassigned-work",element:e.jsx(xt,{})}),e.jsx(r,{path:"approved-work",element:e.jsx(ht,{})}),e.jsx(r,{path:"overall-work",element:e.jsx(bt,{})}),e.jsx(r,{path:"today",element:e.jsx(ft,{})}),e.jsx(r,{path:"rework",element:e.jsx(gt,{})}),e.jsx(r,{path:"today-posting",element:e.jsx(X,{isEmployee:!0})}),e.jsx(r,{path:"monthly-posting",element:e.jsx(Z,{isEmployee:!0})}),e.jsx(r,{path:"posted",element:e.jsx(ee,{isEmployee:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsxs(r,{path:"/client",element:e.jsx(Lt,{}),children:[e.jsx(r,{path:"dashboard",element:e.jsx(O,{activeTabProp:"dashboard"})}),e.jsx(r,{path:"approvals",element:e.jsx(O,{activeTabProp:"approvals"})}),e.jsx(r,{path:"reachskyline-approvals",element:e.jsx(O,{activeTabProp:"reachskyline_approvals"})}),e.jsx(r,{path:"reports",element:e.jsx(O,{activeTabProp:"reports"})}),e.jsx(r,{path:"contact",element:e.jsx(O,{activeTabProp:"contact"})}),e.jsx(r,{path:"portal",element:e.jsx(w,{to:"/client/dashboard",replace:!0})}),e.jsx(r,{index:!0,element:e.jsx(w,{to:"dashboard",replace:!0})})]}),e.jsx(r,{path:"*",element:e.jsx(w,{to:"/login",replace:!0})})]})})})})})})})}window.alert=a=>{let t=document.getElementById("custom-alert-container");if(!t){t=document.createElement("div"),t.id="custom-alert-container";const d=document.createElement("style");d.textContent=`
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
    `,document.head.appendChild(d),document.body.appendChild(t)}t.innerHTML="";let s="info",n="Notification";const o=(a||"").toLowerCase();o.includes("already approved")||o.includes("can't edit")||o.includes("cannot edit")?(s="info",n="Info"):o.includes("success")||o.includes("approve")||o.includes("submit")?(s="success",n="Success"):(o.includes("fail")||o.includes("error")||o.includes("invalid")||o.includes("please"))&&(s="error",n="Alert");let l="";s==="success"?l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>':s==="error"?l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>':l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const u=document.createElement("div");u.className="custom-alert-backdrop";const i=document.createElement("div");i.className="custom-alert-box",i.innerHTML=`
    <div class="custom-alert-icon-container ${s}">
      ${l}
    </div>
    <h3 class="custom-alert-title">${n}</h3>
    <p class="custom-alert-message">${a}</p>
    <button class="custom-alert-btn">Done</button>
  `,t.appendChild(u),t.appendChild(i);const c=()=>{i.classList.remove("show"),u.classList.remove("show"),setTimeout(()=>{t.contains(u)&&t.removeChild(u),t.contains(i)&&t.removeChild(i)},300)},b=i.querySelector(".custom-alert-btn");b.addEventListener("click",c),u.addEventListener("click",c),requestAnimationFrame(()=>{u.classList.add("show"),i.classList.add("show"),b.focus()})};window.confirm=a=>new Promise(t=>{let s=document.getElementById("custom-confirm-container");if(!s){s=document.createElement("div"),s.id="custom-confirm-container";const b=document.createElement("style");b.textContent=`
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
      `,document.head.appendChild(b),document.body.appendChild(s)}s.innerHTML="";const n=document.createElement("div");n.className="custom-confirm-backdrop";const o=document.createElement("div");o.className="custom-confirm-box";const l='<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';o.innerHTML=`
      <div class="custom-confirm-icon-container">
        ${l}
      </div>
      <h3 class="custom-confirm-title">Confirm Action</h3>
      <p class="custom-confirm-message">${a}</p>
      <div class="custom-confirm-buttons">
        <button class="custom-confirm-btn custom-confirm-btn-cancel">Cancel</button>
        <button class="custom-confirm-btn custom-confirm-btn-confirm">Confirm</button>
      </div>
    `,s.appendChild(n),s.appendChild(o);const u=b=>{o.classList.remove("show"),n.classList.remove("show"),setTimeout(()=>{s.contains(n)&&s.removeChild(n),s.contains(o)&&s.removeChild(o),t(b)},300)},i=o.querySelector(".custom-confirm-btn-cancel"),c=o.querySelector(".custom-confirm-btn-confirm");i.addEventListener("click",()=>u(!1)),c.addEventListener("click",()=>u(!0)),n.addEventListener("click",()=>u(!1)),requestAnimationFrame(()=>{n.classList.add("show"),o.classList.add("show"),c.focus()})});if(typeof window<"u"){const a=t=>{if(!t||typeof t!="string")return!1;const s=t.toLowerCase();return s.includes("message channel closed")||s.includes("asynchronous response")||s.includes("listener indicated")};window.addEventListener("unhandledrejection",t=>{var n;const s=((n=t.reason)==null?void 0:n.message)||String(t.reason||"");a(s)&&(t.preventDefault(),t.stopImmediatePropagation())}),window.addEventListener("error",t=>{var n;const s=t.message||String(((n=t.error)==null?void 0:n.message)||"");a(s)&&(t.preventDefault(),t.stopImmediatePropagation())},!0)}Ce.createRoot(document.getElementById("root")).render(e.jsx(ne.StrictMode,{children:e.jsx(Pt,{})}));export{Me as M,k as a,Te as r,L as u};
